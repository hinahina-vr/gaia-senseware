import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const [moduleRoot, executablePath, outputArgument, baseUrl = "http://127.0.0.1:4173"] = process.argv.slice(2);
if (!moduleRoot || !executablePath) throw new Error("Playwright module root and browser executable are required");
const playwrightEntry = fs.existsSync(path.join(moduleRoot, "index.mjs"))
  ? path.join(moduleRoot, "index.mjs")
  : path.join(moduleRoot, "playwright", "index.mjs");
const { chromium } = await import(pathToFileURL(playwrightEntry).href);
const outputDir = path.resolve(outputArgument || "artifacts/opening-sequence-browser");
fs.mkdirSync(outputDir, { recursive: true });

const STORAGE_KEY = "gaiaSensewareNovel:progress";
const MANUAL_KEY = "gaiaSensewareNovel:manual-saves";
const CONFIG_KEY = "gaiaSensewareNovel:config:v3";
const viewports = [
  { name: "pc-1440", width: 1440, height: 900, send: "Enter" },
  { name: "mobile-390", width: 390, height: 844, send: "click" },
];
const report = {
  status: "running",
  baseUrl,
  scans: [],
  consoleErrors: [],
  pageErrors: [],
  responses404: [],
};

const attachDiagnostics = (page, label) => {
  page.on("console", (message) => { if (message.type() === "error") report.consoleErrors.push(`${label}: ${message.text()}`); });
  page.on("pageerror", (error) => report.pageErrors.push(`${label}: ${error.message}`));
  page.on("response", (response) => { if (response.status() === 404) report.responses404.push(`${label}: ${response.url()}`); });
};

const defaultState = (storyVersion, stepId = "festival_concept_002") => ({
  storyVersion,
  stepId,
  reachedSceneIds: ["festival_concept"],
  viewed: {},
  metCharacters: { mizuha: false, amane: false, sakuya: false },
  evesRoute: [],
  observationOrder: "LOCAL_FIRST",
  editorialChoice: null,
  reflectionIds: [],
  resultTone: null,
  demoInterest: "",
  audio: { muted: true, volume: 0 },
  readStepIds: ["festival_concept_001"],
  clear: false,
  archivesUnlocked: false,
  sessionId: "opening-sequence-resume-qa",
});

const bootTitle = async (page, { reduced = false, storedStep = "" } = {}) => {
  await page.goto(new URL("/story", baseUrl).href, { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => Boolean(globalThis.GaiaNovel && globalThis.GAIA_NOVEL_STORY));
  await page.evaluate(({ storageKey, manualKey, configKey, reducedMotion, resumeStep }) => {
    localStorage.clear();
    localStorage.setItem(configKey, JSON.stringify({ messageSpeedPercent: 400, reducedMotion }));
    localStorage.setItem("gaia-senseware-bgm-volume", "0");
    if (resumeStep) {
      const state = {
        storyVersion: globalThis.GAIA_NOVEL_STORY.storyVersion,
        stepId: resumeStep,
        reachedSceneIds: ["festival_concept"],
        viewed: {},
        metCharacters: { mizuha: false, amane: false, sakuya: false },
        evesRoute: [],
        observationOrder: "LOCAL_FIRST",
        editorialChoice: null,
        reflectionIds: [],
        resultTone: null,
        demoInterest: "",
        audio: { muted: true, volume: 0 },
        readStepIds: ["festival_concept_001"],
        clear: false,
        archivesUnlocked: false,
        sessionId: "opening-sequence-resume-qa",
      };
      localStorage.setItem(storageKey, JSON.stringify(state));
      localStorage.setItem(manualKey, JSON.stringify([{
        progress: state,
        savedAt: Date.now(),
        meta: { title: "Opening resume QA", excerpt: resumeStep },
      }]));
    }
  }, {
    storageKey: STORAGE_KEY,
    manualKey: MANUAL_KEY,
    configKey: CONFIG_KEY,
    reducedMotion: reduced,
    resumeStep: storedStep,
  });
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => Boolean(globalThis.GaiaNovel));
  await page.evaluate(() => globalThis.GaiaNovel.open());
};

const scanOpening = (page) => page.evaluate(() => {
  const layer = document.querySelector("#novel-layer");
  const opening = document.querySelector("#novel-opening-sequence");
  const title = opening.querySelector(".novel-opening-sequence-title");
  const scene = opening.querySelector(".novel-opening-sequence-scene");
  const dialogue = document.querySelector("#novel-dialogue");
  const toolbar = document.querySelector(".novel-topbar");
  const openingRect = opening.getBoundingClientRect();
  const titleStyle = getComputedStyle(title);
  const sceneStyle = getComputedStyle(scene);
  const toolbarStyle = getComputedStyle(toolbar);
  return {
    phase: layer.dataset.openingPhase || "",
    stepType: layer.dataset.stepType,
    stepId: layer.dataset.stepId,
    cue: layer.dataset.backgroundCue,
    openingVisible: !opening.hidden && openingRect.width > 0 && openingRect.height > 0,
    titleOpacity: Number(titleStyle.opacity),
    sceneOpacity: Number(sceneStyle.opacity),
    titleText: title.textContent.trim(),
    sceneText: scene.textContent.trim(),
    dialogueHidden: dialogue.hidden && getComputedStyle(dialogue).visibility === "hidden",
    dialogueText: document.querySelector("#novel-text")?.textContent.trim() || "",
    toolbarHidden: toolbarStyle.visibility === "hidden" && Number(toolbarStyle.opacity) === 0,
    background: getComputedStyle(layer).backgroundImage,
    audioTrack: globalThis.GaiaOpeningAudio?.getState?.().track || "",
    activeElement: document.activeElement?.id || "",
    openingRect: openingRect.toJSON(),
    overflowX: Math.max(0, document.documentElement.scrollWidth - innerWidth),
    overflowY: Math.max(0, document.documentElement.scrollHeight - innerHeight),
    bodyOverflowX: Math.max(0, document.body.scrollWidth - innerWidth),
  };
});

const assertOpeningBase = (scan, label) => {
  assert.equal(scan.stepType, "opening-sequence", `${label}: opening step type is missing`);
  assert.equal(scan.stepId, "festival_concept_001", `${label}: opening changed the first step`);
  assert.equal(scan.cue, "festival-main-entrance-reception", `${label}: first background cue changed`);
  assert.equal(scan.openingVisible, true, `${label}: opening layer is not visible`);
  assert.equal(scan.dialogueHidden, true, `${label}: first dialogue appeared under the opening`);
  assert.equal(scan.dialogueText, "", `${label}: story copy appeared before the opening completed`);
  assert.equal(scan.toolbarHidden, true, `${label}: normal VN toolbar remained over the opening`);
  assert.match(scan.background, /novel-bg-coastal-venue-v3\.png/u, `${label}: exhibition opening background changed`);
  assert.equal(scan.overflowX, 0, `${label}: horizontal overflow`);
  assert.equal(scan.overflowY, 0, `${label}: vertical overflow`);
  assert.equal(scan.bodyOverflowX, 0, `${label}: body horizontal overflow`);
};

const browser = await chromium.launch({ headless: true, executablePath });
try {
  for (const viewport of viewports) {
    const context = await browser.newContext({ viewport, reducedMotion: "no-preference" });
    const page = await context.newPage();
    attachDiagnostics(page, viewport.name);
    await bootTitle(page);
    await page.locator("#novel-start-button").click();
    await page.waitForFunction(() => document.querySelector("#novel-layer")?.dataset.stepType === "opening-sequence");
    const initial = await scanOpening(page);
    assertOpeningBase(initial, `${viewport.name}/initial`);
    assert.equal(initial.phase, "silence");
    assert.equal(initial.activeElement, "novel-opening-sequence");

    await page.waitForFunction(() => document.querySelector("#novel-layer")?.dataset.openingPhase === "title", null, { timeout: 3_000 });
    await page.waitForTimeout(1_150);
    const title = await scanOpening(page);
    assertOpeningBase(title, `${viewport.name}/title`);
    assert.match(title.titleText, /今日、はじめまして。/u);
    assert(title.titleOpacity >= 0.85, `${viewport.name}: title did not settle (${title.titleOpacity})`);
    await page.screenshot({ path: path.join(outputDir, `${viewport.name}-title.png`) });

    await page.waitForFunction(() => document.querySelector("#novel-layer")?.dataset.openingPhase === "scene", null, { timeout: 4_000 });
    await page.waitForTimeout(1_150);
    const scene = await scanOpening(page);
    assertOpeningBase(scene, `${viewport.name}/scene`);
    assert.match(scene.sceneText, /地球の感覚器/u);
    assert.match(scene.sceneText, /海沿いの展示会場/u);
    assert(scene.sceneOpacity >= 0.85, `${viewport.name}: scene title did not settle (${scene.sceneOpacity})`);
    await page.screenshot({ path: path.join(outputDir, `${viewport.name}-scene.png`) });

    if (viewport.send === "Enter") await page.keyboard.press("Enter");
    else await page.locator("#novel-opening-sequence").click({ position: { x: 30, y: 30 } });
    await page.waitForFunction(() => document.querySelector("#novel-layer")?.dataset.stepType === "narration");
    await page.waitForFunction(() => document.querySelector("#novel-text")?.dataset.revealState === "complete", null, { timeout: 5_000 }).catch(async () => {
      const state = await page.evaluate(() => ({
        revealState: document.querySelector("#novel-text")?.dataset.revealState,
        revealCount: document.querySelector("#novel-text")?.dataset.revealCount,
        text: document.querySelector("#novel-text")?.textContent,
        classes: document.querySelector("#novel-text")?.className,
        active: document.activeElement?.id,
      }));
      throw new Error(`${viewport.name}: first-line reveal stalled ${JSON.stringify(state)}`);
    });
    await page.waitForFunction(() => globalThis.GaiaOpeningAudio?.getState?.().track === "story", null, { timeout: 8_000 });
    const completed = await page.evaluate(() => ({
      stepId: globalThis.GaiaNovel.getState().stepId,
      type: document.querySelector("#novel-layer")?.dataset.stepType,
      openingHidden: document.querySelector("#novel-opening-sequence")?.hidden,
      openingClass: document.querySelector("#novel-layer")?.classList.contains("is-opening-sequence"),
      text: document.querySelector("#novel-text")?.textContent.trim(),
      track: globalThis.GaiaOpeningAudio?.getState?.().track,
      overflowX: Math.max(0, document.documentElement.scrollWidth - innerWidth),
      overflowY: Math.max(0, document.documentElement.scrollHeight - innerHeight),
    }));
    assert.equal(completed.stepId, "festival_concept_001", `${viewport.name}: sending the opening skipped the first step`);
    assert.equal(completed.type, "narration");
    assert.equal(completed.openingHidden, true);
    assert.equal(completed.openingClass, false);
    assert.match(completed.text, /海から吹く風/u);
    assert.equal(completed.track, "story");
    assert.equal(completed.overflowX, 0);
    assert.equal(completed.overflowY, 0);
    await page.screenshot({ path: path.join(outputDir, `${viewport.name}-first-line.png`) });

    await bootTitle(page, { storedStep: "festival_concept_002" });
    await page.locator("#novel-resume-button").click();
    await page.locator("#novel-save-panel").waitFor({ state: "visible" });
    await page.locator('.novel-save-slot[data-slot-index="0"]').click();
    await page.waitForFunction(() => document.querySelector("#novel-layer")?.dataset.stepId === "festival_concept_002");
    const resumed = await page.evaluate(() => ({
      stepType: document.querySelector("#novel-layer")?.dataset.stepType,
      openingHidden: document.querySelector("#novel-opening-sequence")?.hidden,
      openingClass: document.querySelector("#novel-layer")?.classList.contains("is-opening-sequence"),
      overflowX: Math.max(0, document.documentElement.scrollWidth - innerWidth),
    }));
    assert.equal(resumed.stepType, "narration", `${viewport.name}: resume replayed the opening`);
    assert.equal(resumed.openingHidden, true);
    assert.equal(resumed.openingClass, false);
    assert.equal(resumed.overflowX, 0);

    report.scans.push({ viewport: viewport.name, send: viewport.send, initial, title, scene, completed, resumed, passed: true });
    await context.close();
  }

  const automaticContext = await browser.newContext({ viewport: viewports[0], reducedMotion: "no-preference" });
  const automaticPage = await automaticContext.newPage();
  attachDiagnostics(automaticPage, "pc-1440-automatic");
  await bootTitle(automaticPage);
  const automaticStartedAt = Date.now();
  await automaticPage.locator("#novel-start-button").click();
  await automaticPage.waitForFunction(() => document.querySelector("#novel-layer")?.dataset.openingPhase === "depart", null, { timeout: 6_000 });
  await automaticPage.waitForFunction(() => document.querySelector("#novel-layer")?.dataset.stepType === "narration", null, { timeout: 3_000 });
  const automaticElapsed = Date.now() - automaticStartedAt;
  assert(automaticElapsed >= 5_650 && automaticElapsed <= 6_800, `automatic opening timing changed: ${automaticElapsed}ms`);
  assert.equal(await automaticPage.evaluate(() => globalThis.GaiaNovel.getState().stepId), "festival_concept_001");
  report.automatic = { elapsed: automaticElapsed, passed: true };
  await automaticContext.close();

  const reducedContext = await browser.newContext({ viewport: viewports[1], reducedMotion: "reduce" });
  const reducedPage = await reducedContext.newPage();
  attachDiagnostics(reducedPage, "mobile-390-reduced");
  await bootTitle(reducedPage, { reduced: true });
  const reducedStartedAt = Date.now();
  await reducedPage.locator("#novel-start-button").click();
  await reducedPage.waitForFunction(() => document.querySelector("#novel-layer")?.dataset.stepType === "opening-sequence");
  await reducedPage.waitForFunction(() => document.querySelector("#novel-layer")?.dataset.openingPhase === "scene", null, { timeout: 3_000 });
  const reducedScene = await scanOpening(reducedPage);
  assertOpeningBase(reducedScene, "mobile-390-reduced/scene");
  assert.equal(reducedScene.sceneOpacity, 1);
  await reducedPage.waitForFunction(() => document.querySelector("#novel-layer")?.dataset.stepType === "narration", null, { timeout: 4_500 });
  const reducedElapsed = Date.now() - reducedStartedAt;
  assert(reducedElapsed >= 3_250 && reducedElapsed <= 4_500, `reduced opening timing changed: ${reducedElapsed}ms`);
  await reducedPage.screenshot({ path: path.join(outputDir, "mobile-390-reduced-first-line.png"), animations: "disabled" });
  report.reducedMotion = { scene: reducedScene, elapsed: reducedElapsed, passed: true };
  await reducedContext.close();

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

console.log(`Opening sequence browser check passed: ${report.scans.length} viewports + reduced motion`);
