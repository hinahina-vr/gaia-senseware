import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const [moduleRoot, executablePath, outputArgument, baseUrl = "http://127.0.0.1:4417"] = process.argv.slice(2);
if (!moduleRoot || !executablePath) throw new Error("Playwright module root and browser executable are required");
const playwrightEntry = fs.existsSync(path.join(moduleRoot, "index.mjs"))
  ? path.join(moduleRoot, "index.mjs")
  : path.join(moduleRoot, "playwright", "index.mjs");
const { chromium } = await import(pathToFileURL(playwrightEntry).href);
const outputDir = path.resolve(outputArgument || "artifacts/static-observation-label");
fs.mkdirSync(outputDir, { recursive: true });

const stepId = "festival_concept_001";
const viewports = [
  { name: "pc-1440", width: 1440, height: 900, mobile: false },
  { name: "mobile-390", width: 390, height: 844, mobile: true },
];
const report = { status: "running", baseUrl, scans: [], consoleErrors: [], pageErrors: [], responses404: [] };
const browser = await chromium.launch({ headless: true, executablePath });

const progressFor = (storyVersion, viewport) => ({
  storyVersion,
  stepId,
  reachedSceneIds: ["festival_concept"],
  viewed: {},
  metCharacters: { mizuha: true, amane: true, sakuya: false },
  evesRoute: [],
  observationOrder: null,
  editorialChoice: null,
  reflectionIds: [],
  resultTone: null,
  demoInterest: "気温偏差の地図",
  audio: { muted: true, volume: 0 },
  readStepIds: [],
  clear: false,
  archivesUnlocked: false,
  sessionId: `static-observation-label-${viewport}`,
});

try {
  for (const viewport of viewports) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      hasTouch: viewport.mobile,
      isMobile: viewport.mobile,
      reducedMotion: "reduce",
    });
    const page = await context.newPage();
    page.on("console", (message) => {
      if (message.type() === "error") report.consoleErrors.push(`${viewport.name}: ${message.text()}`);
    });
    page.on("pageerror", (error) => report.pageErrors.push(`${viewport.name}: ${error.message}`));
    page.on("response", (response) => {
      if (response.status() === 404) report.responses404.push(`${viewport.name}: ${response.url()}`);
    });

    await page.goto(new URL("/story", baseUrl).href, { waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => Boolean(globalThis.GaiaNovel && globalThis.GAIA_NOVEL_STORY), null, { timeout: 15_000 });
    const storyVersion = await page.evaluate(() => globalThis.GAIA_NOVEL_STORY.storyVersion);
    await page.evaluate((progress) => {
      localStorage.setItem("gaiaSensewareNovel:progress", JSON.stringify(progress));
      localStorage.setItem("gaiaSensewareNovel:manual-saves", JSON.stringify([{
        progress,
        savedAt: Date.now(),
        meta: { title: "Static observation label QA", excerpt: progress.stepId },
      }]));
      localStorage.setItem("gaiaSensewareNovel:config:v3", JSON.stringify({ messageSpeedPercent: 400, reducedMotion: true }));
      localStorage.setItem("gaia-senseware-bgm-volume", "0");
    }, progressFor(storyVersion, viewport.name));
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => Boolean(globalThis.GaiaNovel));
    await page.evaluate(() => globalThis.GaiaNovel.open());
    await page.locator("#novel-resume-button").click();
    await page.locator("#novel-save-panel").waitFor({ state: "visible", timeout: 15_000 });
    await page.locator('.novel-save-slot[data-slot-index="0"]').click();
    await page.waitForFunction((id) => document.querySelector("#novel-layer")?.dataset.stepId === id, stepId);
    await page.waitForFunction(() => document.querySelector("#novel-text")?.dataset.revealState === "complete");

    const scan = await page.evaluate(() => {
      const label = document.querySelector("#novel-source-label");
      const rect = label.getBoundingClientRect();
      const focusable = [...document.querySelectorAll("button, a[href], input, select, textarea, [tabindex]")]
        .filter((element) => !element.hidden && element.tabIndex >= 0);
      return {
        stepId: document.querySelector("#novel-layer")?.dataset.stepId,
        tagName: label.tagName,
        role: label.getAttribute("role"),
        tabIndex: label.tabIndex,
        pointerEvents: getComputedStyle(label).pointerEvents,
        labelVisible: !label.hidden && rect.width > 0 && rect.height > 0,
        hitTargetId: document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2)?.id || "",
        labelInTabOrder: focusable.includes(label),
        sourceButtonCount: document.querySelectorAll("#novel-source-button").length,
        sourcePanelCount: document.querySelectorAll("#novel-source-panel, .novel-source-panel").length,
        overflowX: Math.max(0, document.documentElement.scrollWidth - innerWidth),
      };
    });

    assert.equal(scan.stepId, stepId);
    assert.equal(scan.tagName, "DIV");
    assert.equal(scan.role, null);
    assert.equal(scan.tabIndex, -1);
    assert.equal(scan.pointerEvents, "none");
    assert.equal(scan.labelVisible, true);
    assert.notEqual(scan.hitTargetId, "novel-source-label");
    assert.equal(scan.labelInTabOrder, false);
    assert.equal(scan.sourceButtonCount, 0);
    assert.equal(scan.sourcePanelCount, 0);
    assert.equal(scan.overflowX, 0);
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

console.log(JSON.stringify(report, null, 2));
