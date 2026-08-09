import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const [moduleArgument, executableArgument, baseUrlArgument] = process.argv.slice(2);
const moduleRoot = process.env.GAIA_PLAYWRIGHT_PATH || moduleArgument;
const executablePath = process.env.GAIA_BROWSER_EXECUTABLE || executableArgument;
const baseUrl = process.env.GAIA_BASE_URL || baseUrlArgument || "http://127.0.0.1:4289";
if (!moduleRoot || !executablePath) throw new Error("GAIA_PLAYWRIGHT_PATH and GAIA_BROWSER_EXECUTABLE are required");

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const jsSource = fs.readFileSync(path.join(projectRoot, "novel-mode.js"), "utf8");
const cssSource = fs.readFileSync(path.join(projectRoot, "novel-mode.css"), "utf8");
assert.match(jsSource, /const SECTION_SEPARATOR_MS = 2200;/u);
assert.match(jsSource, /const SECTION_SEPARATOR_REDUCED_MOTION_MS = 2900;/u);
assert.match(jsSource, /const AUTO_DELAY_MS = 3600;/u, "AUTO delay must not change with the title hold");
assert.match(cssSource, /animation: novel-chapter-in 1\.45s ease both;/u, "non-section cards must keep their original timing");
assert.match(cssSource, /animation: novel-chapter-beam 1\.45s cubic-bezier\(0\.22, 1, 0\.36, 1\) both;/u, "non-section beams must keep their original timing");
assert.match(cssSource, /animation: novel-section-chapter-in 2\.2s ease both;/u);
assert.match(cssSource, /animation: novel-section-chapter-beam 2\.2s cubic-bezier\(0\.22, 1, 0\.36, 1\) both;/u);
assert.match(cssSource, /15\.8%, 84\.2% \{ opacity: 1;/u);
assert.match(cssSource, /0%, 6\.6% \{ opacity: 0; transform: scaleX\(0\); \}/u);
assert.match(cssSource, /21\.1%, 83% \{ opacity: 1; transform: scaleX\(1\); \}/u);

delete globalThis.GAIA_NOVEL_STORY;
await import(`${pathToFileURL(path.join(projectRoot, "novel-story-data.js")).href}?section-separator=1`);
const story = globalThis.GAIA_NOVEL_STORY;
assert.equal(story.scenes.length, 23, "section separator scope must cover all 23 scenes");

const { chromium } = await import(pathToFileURL(path.join(moduleRoot, "index.mjs")));
const browser = await chromium.launch({ executablePath, headless: true, args: ["--no-first-run", "--disable-background-networking"] });
const routeUrl = new URL("/story", baseUrl).href;
const STORAGE_KEY = "gaiaSensewareNovel:progress";
const CONFIG_KEY = "gaiaSensewareNovel:config:v2";
const errors = [];

const baseState = (stepId) => ({
  storyVersion: story.storyVersion,
  stepId,
  reachedSceneIds: [],
  viewed: {},
  metCharacters: { mizuha: false, amane: false, sakuya: false },
  evesRoute: [],
  observationOrder: null,
  editorialChoice: null,
  reflectionIds: [],
  resultTone: null,
  audio: { muted: false, volume: 0.1 },
  readStepIds: [],
  clear: false,
  archivesUnlocked: false,
  sessionId: "separator-browser-check",
});

try {
  for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    for (const reducedMotion of [false, true]) {
      const page = await browser.newPage({ viewport });
      await page.emulateMedia({ reducedMotion: reducedMotion ? "reduce" : "no-preference" });
      const label = `${viewport.width}/${reducedMotion ? "reduced" : "normal"}`;
      page.on("console", (message) => { if (message.type() === "error") errors.push(`${label}: ${message.text()}`); });
      page.on("pageerror", (error) => errors.push(`${label}: ${error.message}`));
      await page.goto(routeUrl, { waitUntil: "domcontentloaded" });
      await page.waitForFunction(() => Boolean(globalThis.GaiaNovel));
      await page.evaluate(() => localStorage.clear());
      await page.reload({ waitUntil: "domcontentloaded" });
      await page.waitForFunction(() => Boolean(globalThis.GaiaNovel));
      await page.evaluate(() => globalThis.GaiaNovel.open());

      const startedAt = await page.evaluate(() => {
        const started = performance.now();
        document.querySelector("#novel-start-button").click();
        return started;
      });
      await page.waitForFunction(() => document.querySelector("#novel-layer")?.dataset.stepType === "section-separator");
      const initialStep = await page.locator("#novel-layer").getAttribute("data-step-id");
      const animation = await page.locator("#novel-chapter-card").evaluate((card) => {
        const item = card.getAnimations({ subtree: true }).find((candidate) => candidate.animationName === "novel-section-chapter-in");
        return item ? { duration: item.effect.getTiming().duration, keyframes: item.effect.getKeyframes().map(({ offset, opacity }) => ({ offset, opacity })) } : null;
      });
      if (reducedMotion) {
        assert.equal(animation, null, `${label}: reduced motion must not run the fade animation`);
      } else {
        assert.equal(animation?.duration, 2200, `${label}: motion animation duration changed`);
        const offsets = animation?.keyframes.map(({ offset }) => Number(offset.toFixed(3)));
        assert.deepEqual(offsets, [0, 0.158, 0.842, 1], `${label}: fade/hold boundaries changed`);
      }
      await page.waitForFunction(() => document.querySelector("#novel-chapter-card")?.hidden, null, { timeout: 5000 });
      const elapsed = await page.evaluate((start) => performance.now() - start, startedAt);
      const minimum = reducedMotion ? 2820 : 2120;
      const maximum = reducedMotion ? 3300 : 2600;
      assert(elapsed >= minimum && elapsed <= maximum, `${label}: hide timing ${Math.round(elapsed)}ms is outside ${minimum}-${maximum}ms`);
      assert.equal(await page.locator("#novel-layer").getAttribute("data-step-id"), initialStep, `${label}: first story step was skipped`);

      await page.evaluate(() => document.querySelector("#novel-restart-button").click());
      await page.waitForFunction(() => document.querySelector("#novel-layer")?.dataset.stepType === "section-separator");
      const restartStep = await page.locator("#novel-layer").getAttribute("data-step-id");
      await page.locator("#novel-layer").dispatchEvent("keydown", { key: "Enter" });
      await page.waitForFunction(() => document.querySelector("#novel-layer")?.dataset.stepType !== "section-separator");
      assert.equal(await page.locator("#novel-layer").getAttribute("data-step-id"), restartStep, `${label}: manual dismiss skipped the first step`);

      await page.evaluate(({ storageKey, configKey, stateValue, reduced }) => {
        localStorage.setItem(storageKey, JSON.stringify(stateValue));
        localStorage.setItem(configKey, JSON.stringify({ messageSpeedPercent: 200, reducedMotion: reduced }));
      }, { storageKey: STORAGE_KEY, configKey: CONFIG_KEY, stateValue: baseState("opening_empty_seat_005"), reduced: reducedMotion });
      await page.reload({ waitUntil: "domcontentloaded" });
      await page.waitForFunction(() => Boolean(globalThis.GaiaNovel));
      await page.evaluate(() => globalThis.GaiaNovel.open());
      await page.locator("#novel-resume-button").click();
      await page.waitForFunction(() => document.querySelector("#novel-layer")?.dataset.stepId === "opening_empty_seat_005");
      assert.notEqual(await page.locator("#novel-layer").getAttribute("data-step-type"), "section-separator", `${label}: RESUME incorrectly replayed the scene title`);

      await page.evaluate(() => window.dispatchEvent(new CustomEvent("gaia:novel-open-at-mode", { detail: { index: 2, source: "separator-check" } })));
      await page.waitForFunction(() => document.querySelector("#novel-layer")?.dataset.stepType === "section-separator");
      await page.locator("#novel-layer").dispatchEvent("keydown", { key: " " });
      await page.waitForFunction(() => document.querySelector("#novel-layer")?.dataset.stepType !== "section-separator");
      await page.close();
    }
  }
  assert.equal(errors.length, 0, `browser errors: ${errors.join(" | ")}`);
  console.log("section separator browser check passed: 23-scene scope, 1440/390, normal/reduced timing, NEW GAME/RESTART/RESUME/mode entry, manual dismiss");
} finally {
  await browser.close();
}
