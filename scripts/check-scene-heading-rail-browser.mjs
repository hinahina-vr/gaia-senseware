import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const [moduleRoot, executablePath, outputArgument, baseUrl = "http://127.0.0.1:4571"] = process.argv.slice(2);
if (!moduleRoot || !executablePath) throw new Error("Playwright module root and browser executable are required");
const playwrightEntry = fs.existsSync(path.join(moduleRoot, "index.mjs"))
  ? path.join(moduleRoot, "index.mjs")
  : path.join(moduleRoot, "playwright", "index.mjs");
const { chromium } = await import(pathToFileURL(playwrightEntry).href);
const outputDir = path.resolve(outputArgument || "artifacts/scene-heading-rail-browser");
fs.mkdirSync(outputDir, { recursive: true });

const viewports = [
  { name: "pc-1920", width: 1920, height: 1080 },
  { name: "pc-1440", width: 1440, height: 900 },
  { name: "pc-1180", width: 1180, height: 760 },
  { name: "mobile-390", width: 390, height: 844, mobile: true },
];
const report = { status: "running", scans: [], consoleErrors: [], pageErrors: [], responses404: [] };
const browser = await chromium.launch({ headless: true, executablePath });

const intersects = (a, b) => !(a.right <= b.left || a.left >= b.right || a.bottom <= b.top || a.top >= b.bottom);

try {
  for (const viewport of viewports) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      hasTouch: Boolean(viewport.mobile),
      isMobile: Boolean(viewport.mobile),
      reducedMotion: "reduce",
    });
    const page = await context.newPage();
    page.on("console", (message) => { if (message.type() === "error") report.consoleErrors.push(`${viewport.name}: ${message.text()}`); });
    page.on("pageerror", (error) => report.pageErrors.push(`${viewport.name}: ${error.message}`));
    page.on("response", (response) => { if (response.status() === 404) report.responses404.push(`${viewport.name}: ${response.url()}`); });

    await page.goto(new URL("/story", baseUrl).href, { waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => Boolean(globalThis.GaiaNovel && globalThis.GAIA_NOVEL_STORY), null, { timeout: 15_000 });
    const progress = await page.evaluate(() => ({
      storyVersion: globalThis.GAIA_NOVEL_STORY.storyVersion,
      stepId: "welcome_chat_002",
      reachedSceneIds: ["welcome_chat"],
      viewed: {}, metCharacters: { mizuha: true, amane: true, sakuya: true }, evesRoute: [],
      observationOrder: null, editorialChoice: null, reflectionIds: [], resultTone: null,
      audio: { muted: true, volume: 0 }, readStepIds: [], clear: false, archivesUnlocked: false,
      sessionId: `heading-rail-${innerWidth}`,
    }));
    await page.evaluate((candidate) => {
      localStorage.setItem("gaiaSensewareNovel:progress", JSON.stringify(candidate));
      localStorage.setItem("gaiaSensewareNovel:manual-saves", JSON.stringify([{
        progress: candidate, savedAt: Date.now(), meta: { title: "Heading rail QA", excerpt: candidate.stepId },
      }]));
      localStorage.setItem("gaiaSensewareNovel:config:v3", JSON.stringify({ messageSpeedPercent: 400, reducedMotion: true }));
      localStorage.setItem("gaia-senseware-bgm-volume", "0");
    }, progress);
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => Boolean(globalThis.GaiaNovel), null, { timeout: 15_000 });
    await page.evaluate(() => globalThis.GaiaNovel.open());
    await page.locator("#novel-resume-button").click();
    await page.locator("#novel-save-panel").waitFor({ state: "visible", timeout: 15_000 });
    await page.locator('.novel-save-slot[data-slot-index="0"]').click();
    await page.waitForFunction(() => document.querySelector("#novel-layer")?.dataset.stepId === "welcome_chat_002", null, { timeout: 15_000 });

    const scan = await page.evaluate(() => {
      const visible = (element) => {
        if (!element || element.hidden) return false;
        const style = getComputedStyle(element); const rect = element.getBoundingClientRect();
        return style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity || 1) > 0 && rect.width > 0 && rect.height > 0;
      };
      const heading = document.querySelector("#novel-source-label");
      const headingText = document.querySelector("#novel-location");
      const controls = ["#novel-home-button", "#novel-close-button", ".gaia-audio-dock"]
        .map((selector) => document.querySelector(selector))
        .filter(visible)
        .map((element) => ({ selector: element.id ? `#${element.id}` : ".gaia-audio-dock", rect: element.getBoundingClientRect().toJSON() }));
      return {
        text: headingText.textContent.trim(),
        heading: heading.getBoundingClientRect().toJSON(),
        headingText: headingText.getBoundingClientRect().toJSON(),
        controls,
        overflowX: Math.max(0, document.documentElement.scrollWidth - innerWidth),
      };
    });
    const primaryRail = scan.controls.filter(({ selector }) => selector !== "#novel-close-button");
    scan.primaryTopDeltas = primaryRail.map(({ selector, rect }) => ({ selector, delta: Math.abs(rect.top - scan.heading.top) }));
    scan.overlaps = scan.controls.filter(({ rect }) => intersects(scan.heading, rect)).map(({ selector }) => selector);
    assert(primaryRail.length >= 2, `${viewport.name}: primary corner controls missing`);
    assert(scan.primaryTopDeltas.every(({ delta }) => delta <= 1), `${viewport.name}: heading does not share the primary top rail ${JSON.stringify(scan.primaryTopDeltas)}`);
    assert.deepEqual(scan.overlaps, [], `${viewport.name}: heading overlaps fixed controls`);
    assert.equal(scan.overflowX, 0, `${viewport.name}: horizontal overflow`);
    assert(scan.heading.left >= -1 && scan.heading.right <= viewport.width + 1, `${viewport.name}: heading leaves viewport`);
    report.scans.push({ viewport: viewport.name, ...scan, passed: true });
    await page.screenshot({ path: path.join(outputDir, `${viewport.name}.png`), animations: "disabled" });
    await context.close();
  }

  assert.deepEqual(report.consoleErrors, []);
  assert.deepEqual(report.pageErrors, []);
  assert.deepEqual(report.responses404, []);
  report.status = "passed";
} catch (error) {
  report.status = "failed";
  report.error = error.stack || String(error);
  throw error;
} finally {
  fs.writeFileSync(path.join(outputDir, "report.json"), `${JSON.stringify(report, null, 2)}\n`);
  await browser.close();
}

console.log(`scene heading rail browser check passed: ${report.scans.length} viewports`);
