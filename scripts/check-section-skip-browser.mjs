import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const [moduleRoot, executablePath, outputArgument, baseUrl = "http://127.0.0.1:4173"] = process.argv.slice(2);
if (!moduleRoot || !executablePath) throw new Error("Playwright module and browser executable are required");
const playwrightEntry = fs.existsSync(path.join(moduleRoot, "index.mjs"))
  ? path.join(moduleRoot, "index.mjs")
  : path.join(moduleRoot, "playwright", "index.mjs");
const { chromium } = await import(pathToFileURL(playwrightEntry).href);
const outputDir = path.resolve(outputArgument || "artifacts/section-skip-browser");
fs.mkdirSync(outputDir, { recursive: true });

const STORAGE_KEY = "gaiaSensewareNovel:progress";
const CONFIG_KEY = "gaiaSensewareNovel:config:v3";
const viewports = [
  { name: "pc-1440", width: 1440, height: 900 },
  { name: "mobile-390", width: 390, height: 844 },
];
const report = { status: "running", baseUrl, scans: [], consoleErrors: [], pageErrors: [], responses404: [] };

const baseState = (storyVersion, stepId, reachedSceneIds = []) => ({
  storyVersion,
  stepId,
  reachedSceneIds,
  viewed: {},
  metCharacters: { mizuha: false, amane: false, sakuya: false },
  evesRoute: [],
  observationOrder: "LOCAL_FIRST",
  editorialChoice: null,
  reflectionIds: [],
  resultTone: null,
  demoInterest: "",
  audio: { muted: true, volume: 0 },
  readStepIds: [],
  clear: false,
  archivesUnlocked: false,
  sessionId: "section-skip-browser",
});

const layoutScan = (page) => page.evaluate(() => {
  const close = document.querySelector("#novel-close-button").getBoundingClientRect();
  const audio = document.querySelector(".gaia-audio-dock")?.getBoundingClientRect();
  return {
    label: document.querySelector("#novel-close-button span")?.textContent,
    ariaLabel: document.querySelector("#novel-close-button")?.getAttribute("aria-label"),
    layerOpen: document.querySelector("#novel-layer")?.classList.contains("is-open"),
    titleVisible: !document.querySelector("#novel-title-screen")?.hidden,
    overflowX: Math.max(0, document.documentElement.scrollWidth - innerWidth),
    closeAudioOverlap: audio
      ? !(close.right <= audio.left || close.left >= audio.right || close.bottom <= audio.top || close.top >= audio.bottom)
      : false,
  };
});

const storeProgress = async (page, stepId, reachedSceneIds = []) => {
  const storyVersion = await page.evaluate(() => globalThis.GAIA_NOVEL_STORY.storyVersion);
  const progress = baseState(storyVersion, stepId, reachedSceneIds);
  await page.evaluate(({ storageKey, configKey, candidate }) => {
    localStorage.setItem(storageKey, JSON.stringify(candidate));
    localStorage.setItem("gaiaSensewareNovel:manual-saves", JSON.stringify([{
      progress: candidate,
      savedAt: Date.now(),
      meta: { title: "Section skip QA", excerpt: candidate.stepId },
    }]));
    localStorage.setItem(configKey, JSON.stringify({ messageSpeedPercent: 400, reducedMotion: true }));
    localStorage.setItem("gaia-senseware-bgm-volume", "0");
  }, { storageKey: STORAGE_KEY, configKey: CONFIG_KEY, candidate: progress });
};

const openStoredProgress = async (page) => {
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => Boolean(globalThis.GaiaNovel));
  await page.evaluate(() => globalThis.GaiaNovel.open());
  await page.locator("#novel-resume-button").click();
  await page.locator("#novel-save-panel").waitFor({ state: "visible" });
  await page.locator('.novel-save-slot[data-slot-index="0"]').click();
};

const browser = await chromium.launch({ headless: true, executablePath });
try {
  for (const viewport of viewports) {
    const context = await browser.newContext({ viewport, reducedMotion: "reduce" });
    const page = await context.newPage();
    page.on("console", (message) => { if (message.type() === "error") report.consoleErrors.push(`${viewport.name}: ${message.text()}`); });
    page.on("pageerror", (error) => report.pageErrors.push(`${viewport.name}: ${error.message}`));
    page.on("response", (response) => { if (response.status() === 404) report.responses404.push(`${viewport.name}: ${response.url()}`); });

    await page.goto(new URL("/story", baseUrl).href, { waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => Boolean(globalThis.GaiaNovel && globalThis.GAIA_NOVEL_STORY));
    await page.evaluate(() => {
      localStorage.clear();
      globalThis.GaiaNovel.open();
    });
    assert.equal(await page.locator("#novel-close-button span:first-child").textContent(), "戻る");
    assert.equal(await page.locator("#novel-close-button").getAttribute("aria-label"), "ストーリーメニューを閉じる");

    await page.locator("#novel-start-button").click();
    await page.waitForFunction(() => document.querySelector("#novel-layer")?.dataset.stepType === "narration");
    const before = await layoutScan(page);
    assert.equal(before.label, "セクションスキップ");
    assert.match(before.ariaLabel || "", /地球温暖化を地図で見る/u);
    assert.equal(before.closeAudioOverlap, false, `${viewport.name}: audio control overlaps section skip`);
    assert.equal(before.overflowX, 0, `${viewport.name}: runtime overflows horizontally`);
    await page.screenshot({ path: path.join(outputDir, `${viewport.name}-section-skip.png`), animations: "disabled" });

    await page.locator("#novel-close-button").focus();
    await page.keyboard.press("Enter");
    await page.waitForFunction(() => globalThis.GaiaNovel.getState().stepId === "map_mode01_001");
    const skipped = await layoutScan(page);
    const skippedState = await page.evaluate(() => globalThis.GaiaNovel.getState());
    const skippedGallery = await page.evaluate(() => globalThis.GaiaNovel.getGalleryState());
    assert.equal(skipped.layerOpen, true, `${viewport.name}: section skip closed the story`);
    assert.equal(skipped.titleVisible, false, `${viewport.name}: section skip returned to title`);
    assert(skippedState.reachedSceneIds.includes("festival_concept"), `${viewport.name}: skipped section was not recorded as reached`);
    assert.equal(skippedState.readStepIds.includes("festival_concept_076"), false, `${viewport.name}: unseen final step was marked read`);
    assert.equal(skippedGallery.count, 0, `${viewport.name}: skipped event CG was unlocked`);

    await page.reload({ waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => Boolean(globalThis.GaiaNovel));
    assert.equal(await page.evaluate((storageKey) => JSON.parse(localStorage.getItem(storageKey)).stepId, STORAGE_KEY), "map_mode01_001", `${viewport.name}: section skip was not persisted`);

    await storeProgress(page, "map_mode01_001", ["festival_concept"]);
    await openStoredProgress(page);
    await page.waitForFunction(() => globalThis.GaiaNovel.getState().stepId === "map_mode01_001");
    await page.waitForFunction(() => document.querySelector("#novel-text")?.dataset.revealState === "complete");
    const skippedTargets = ["map_mode01_001"];
    for (const targetStepId of ["gx_experience_001", "esp32_pitch_001", "circle_invitation_001", "welcome_chat_001"]) {
      await page.locator("#novel-close-button").waitFor({ state: "visible" });
      await page.waitForFunction(() => !document.querySelector("#novel-close-button")?.disabled);
      await page.locator("#novel-close-button").click();
      await page.waitForFunction((id) => globalThis.GaiaNovel.getState().stepId === id, targetStepId);
      skippedTargets.push(targetStepId);
      assert.equal(await page.locator("#novel-layer").getAttribute("aria-hidden"), "false", `${viewport.name}: ${targetStepId} closed the story`);
    }
    await page.waitForFunction(() => !document.querySelector("#novel-close-button")?.disabled);
    await page.locator("#novel-close-button").click();
    await page.waitForFunction(() => document.querySelector("#novel-layer")?.classList.contains("is-staff-roll"));
    assert.equal(await page.evaluate(() => globalThis.GaiaNovel.getState().stepId), "welcome_chat_095");
    assert.equal(await page.locator("#novel-close-button").isHidden(), true, `${viewport.name}: duplicate section control remained on credits`);
    await page.locator(".novel-staff-roll button").click();
    await page.waitForFunction(() => globalThis.GaiaNovel.getState().clear === true && document.querySelector("#novel-layer")?.classList.contains("is-title"));
    assert.equal(await page.locator("#novel-title-screen").isVisible(), true, `${viewport.name}: credits did not return to title`);
    assert.equal(await page.locator(".novel-end-v6").count(), 0, `${viewport.name}: obsolete END panel remained`);
    assert.equal(await page.locator("#novel-close-button span:first-child").textContent(), "戻る");

    const finalScan = await layoutScan(page);
    assert.equal(finalScan.overflowX, 0, `${viewport.name}: ending overflows horizontally`);
    report.scans.push({ viewport: viewport.name, before, skipped, skippedTargets, finalScan, passed: true });
    await page.screenshot({ path: path.join(outputDir, `${viewport.name}-ending.png`), animations: "disabled" });
    await context.close();
  }
  assert.equal(report.consoleErrors.length, 0, `console errors: ${report.consoleErrors.join("\n")}`);
  assert.equal(report.pageErrors.length, 0, `page errors: ${report.pageErrors.join("\n")}`);
  assert.equal(report.responses404.length, 0, `404 responses: ${report.responses404.join("\n")}`);
  report.status = "passed";
} catch (error) {
  report.status = "failed";
  report.error = error.stack || String(error);
  throw error;
} finally {
  fs.writeFileSync(path.join(outputDir, "report.json"), `${JSON.stringify(report, null, 2)}\n`);
  await browser.close();
}

console.log(`Section skip browser check passed: ${report.scans.length} viewports`);
