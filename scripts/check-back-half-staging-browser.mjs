import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";

const [moduleArgument, executableArgument, outputArgument, baseUrlArgument] = process.argv.slice(2);
const moduleRoot = process.env.GAIA_PLAYWRIGHT_PATH || moduleArgument;
const executablePath = process.env.GAIA_BROWSER_EXECUTABLE || executableArgument;
const baseUrl = process.env.GAIA_BASE_URL || baseUrlArgument || "http://127.0.0.1:4298";
const outputDir = path.resolve(process.env.GAIA_BROWSER_ARTIFACTS || outputArgument || "artifacts/back-half-staging-browser");
if (!moduleRoot || !executablePath) throw new Error("GAIA_PLAYWRIGHT_PATH and GAIA_BROWSER_EXECUTABLE are required.");

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const { chromium } = await import(pathToFileURL(path.join(moduleRoot, "index.mjs")));
delete globalThis.GAIA_NOVEL_STORY;
delete globalThis.GAIA_NOVEL_BACKGROUND_CUES;
delete globalThis.GAIA_NOVEL_BACK_HALF_CUES;
await import(`${pathToFileURL(path.join(projectRoot, "novel-story-data.js")).href}?browser=${Date.now()}`);
await import(`${pathToFileURL(path.join(projectRoot, "novel-background-cues.js")).href}?browser=${Date.now()}`);
await import(`${pathToFileURL(path.join(projectRoot, "novel-back-half-cues.js")).href}?browser=${Date.now()}`);

const story = globalThis.GAIA_NOVEL_STORY;
const backgrounds = globalThis.GAIA_NOVEL_BACKGROUND_CUES;
const staging = globalThis.GAIA_NOVEL_BACK_HALF_CUES;
const steps = story.scenes.flatMap((scene) => scene.steps);
const stepMap = new Map(steps.map((step) => [step.id, step]));
const routeUrl = new URL("/story", baseUrl).href;
const STORAGE_KEY = "gaiaSensewareNovel:progress";
const CONFIG_KEY = "gaiaSensewareNovel:config:v2";
const assert = (condition, message) => { if (!condition) throw new Error(message); };

await mkdir(outputDir, { recursive: true });
const report = {
  status: "running",
  baseUrl: routeUrl,
  viewports: [],
  evidence: [],
  boundaries: [],
  stableBoundaries: [],
  consoleErrors: [],
  pageErrors: [],
  responses404: [],
};
const browser = await chromium.launch({ executablePath, headless: true, args: ["--no-first-run", "--disable-background-networking"] });

const baseState = (stepId) => ({
  storyVersion: story.storyVersion,
  stepId,
  reachedSceneIds: [],
  viewed: {},
  evesRoute: [],
  observationOrder: null,
  editorialChoice: null,
  reflectionIds: [],
  resultTone: null,
  audio: { muted: true, volume: 0 },
  readStepIds: [],
  clear: false,
  archivesUnlocked: false,
  sessionId: "back-half-staging-browser",
});

const attachDiagnostics = (page, label) => {
  page.on("console", (message) => { if (message.type() === "error") report.consoleErrors.push(`${label}: ${message.text()}`); });
  page.on("pageerror", (error) => report.pageErrors.push(`${label}: ${error.message}`));
  page.on("response", (response) => { if (response.status() === 404) report.responses404.push(`${label}: ${response.url()}`); });
};

const ensureNovelOpen = async (page) => {
  await page.waitForFunction(() => Boolean(globalThis.GaiaNovel), null, { timeout: 15000 });
  await page.evaluate(() => {
    const layer = document.querySelector("#novel-layer");
    if (layer?.hidden || !layer?.classList.contains("is-open")) globalThis.GaiaNovel.open();
  });
  await page.locator("#novel-title-screen").waitFor({ state: "visible", timeout: 15000 });
};

const bootAt = async (page, stepId) => {
  await page.evaluate(({ progressKey, configKey, progress }) => {
    localStorage.setItem(progressKey, JSON.stringify(progress));
    localStorage.setItem(configKey, JSON.stringify({ messageSpeedPercent: 400, reducedMotion: false }));
  }, { progressKey: STORAGE_KEY, configKey: CONFIG_KEY, progress: baseState(stepId) });
  await page.reload({ waitUntil: "domcontentloaded" });
  await ensureNovelOpen(page);
  await page.locator("#novel-resume-button").click();
  await page.waitForFunction((id) => document.querySelector("#novel-layer")?.dataset.stepId === id, stepId, { timeout: 15000 });
};

const presentation = (page) => page.locator("#novel-layer").evaluate((node) => {
  const style = getComputedStyle(node);
  const cast = node.querySelector("#novel-cast");
  const castStyle = cast ? getComputedStyle(cast) : null;
  return {
    stepId: node.dataset.stepId,
    backgroundImage: style.backgroundImage,
    backgroundCue: node.dataset.backgroundCue,
    context: node.dataset.storyContext,
    time: node.dataset.storyTime,
    location: node.dataset.storyLocation,
    device: node.dataset.storyDevice,
    devicePhase: node.dataset.storyDevicePhase,
    viewpoint: node.dataset.storyViewpoint,
    castMode: node.dataset.storyCastMode,
    audioCue: node.dataset.storyAudioCue,
    castSuppressed: node.classList.contains("is-cast-suppressed"),
    castVisibility: castStyle?.visibility,
    castOpacity: castStyle?.opacity,
    bodyOverflow: document.documentElement.scrollWidth - innerWidth,
    layerOverflow: node.scrollWidth - node.clientWidth,
  };
});

const capture = async (page, viewportName, stepId) => {
  await bootAt(page, stepId);
  const step = stepMap.get(stepId);
  const expectedBackground = path.basename(backgrounds.forStep(step).assetPath);
  const expectedStaging = staging.forStep(step);
  const current = await presentation(page);
  assert(current.backgroundImage.includes(expectedBackground), `${viewportName}/${stepId}: wrong background ${current.backgroundImage}`);
  assert(current.context === expectedStaging.temporal.context, `${viewportName}/${stepId}: wrong context`);
  assert(current.time === expectedStaging.temporal.time, `${viewportName}/${stepId}: wrong time`);
  assert(current.location === expectedStaging.temporal.location, `${viewportName}/${stepId}: wrong location`);
  assert(current.device === expectedStaging.device, `${viewportName}/${stepId}: wrong device`);
  assert(current.viewpoint === expectedStaging.viewpoint, `${viewportName}/${stepId}: wrong viewpoint`);
  assert(current.castMode === expectedStaging.castMode, `${viewportName}/${stepId}: wrong cast mode`);
  assert(current.bodyOverflow <= 1 && current.layerOverflow <= 1, `${viewportName}/${stepId}: horizontal overflow ${current.bodyOverflow}/${current.layerOverflow}`);
  if (["archived-voice-no-cast", "remote-sakuya-no-cast", "sakuya-unseen"].includes(expectedStaging.castMode)) {
    assert(current.castSuppressed && current.castVisibility === "hidden", `${viewportName}/${stepId}: remote/recorded cast is visible`);
  }
  const screenshotPath = path.join(outputDir, `${viewportName}-${stepId}.png`);
  await page.screenshot({ path: screenshotPath, animations: "disabled", timeout: 90000 });
  report.evidence.push({ viewport: viewportName, stepId, expectedBackground, ...current, screenshotPath });
};

const checkBoundary = async (page, viewportName, fromId, toId, expectedFile) => {
  await bootAt(page, fromId);
  await page.evaluate(() => {
    globalThis.__gaiaBackHalfTransitionSeen = false;
    globalThis.__gaiaBackHalfTransitionObserver?.disconnect();
    globalThis.__gaiaBackHalfTransitionObserver = new MutationObserver(() => {
      if (document.body.classList.contains("scene-transitioning")) globalThis.__gaiaBackHalfTransitionSeen = true;
    });
    globalThis.__gaiaBackHalfTransitionObserver.observe(document.body, { attributes: true, attributeFilter: ["class"] });
  });
  await page.locator("#novel-layer").dispatchEvent("click");
  await page.locator("#novel-layer").dispatchEvent("click");
  await page.waitForFunction((id) => document.querySelector("#novel-layer")?.dataset.stepId === id, toId, { timeout: 15000 });
  const current = await presentation(page);
  const transitionSeen = await page.evaluate(() => globalThis.__gaiaBackHalfTransitionSeen);
  assert(current.backgroundImage.includes(expectedFile), `${viewportName}/${fromId}→${toId}: background did not switch`);
  assert(transitionSeen, `${viewportName}/${fromId}→${toId}: approved transition did not run`);
  report.boundaries.push({ viewport: viewportName, fromId, toId, expectedFile, transitionSeen, passed: true });
};

const checkStableBoundary = async (page, viewportName, fromId, toId) => {
  await bootAt(page, fromId);
  await page.evaluate(() => {
    globalThis.__gaiaBackHalfTransitionSeen = false;
    globalThis.__gaiaBackHalfTransitionObserver?.disconnect();
    globalThis.__gaiaBackHalfTransitionObserver = new MutationObserver(() => {
      if (document.body.classList.contains("scene-transitioning")) globalThis.__gaiaBackHalfTransitionSeen = true;
    });
    globalThis.__gaiaBackHalfTransitionObserver.observe(document.body, { attributes: true, attributeFilter: ["class"] });
  });
  await page.locator("#novel-layer").dispatchEvent("click");
  await page.locator("#novel-layer").dispatchEvent("click");
  await page.waitForFunction((id) => document.querySelector("#novel-layer")?.dataset.stepId === id, toId, { timeout: 15000 });
  const transitionSeen = await page.evaluate(() => globalThis.__gaiaBackHalfTransitionSeen);
  assert(!transitionSeen, `${viewportName}/${fromId}→${toId}: same-surface step replayed the scene transition`);
  report.stableBoundaries.push({ viewport: viewportName, fromId, toId, transitionSeen, passed: true });
};

try {
  const viewports = [
    { name: "pc-1440", width: 1440, height: 900 },
    { name: "mobile-390", width: 390, height: 844 },
  ];
  const evidenceSteps = [
    "mode07_abstract_009",
    "interlude_sea_008",
    "interlude_sea_046",
    "mode08_map_layers_001",
    "gx_deep_time_017",
    "mode10_space_009",
    "final_record_009",
    "final_record_018",
    "return_to_start_017",
    "return_to_start_018",
    "return_to_start_020",
    "return_to_start_021",
    "return_to_start_029",
    "return_to_start_032",
  ];
  for (const viewport of viewports) {
    const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height }, reducedMotion: "no-preference" });
    const page = await context.newPage();
    attachDiagnostics(page, viewport.name);
    await page.goto(routeUrl, { waitUntil: "domcontentloaded" });
    await ensureNovelOpen(page);
    for (const stepId of evidenceSteps) await capture(page, viewport.name, stepId);
    await checkBoundary(page, viewport.name, "mode07_abstract_008", "mode07_abstract_009", "novel-bg-production-shared-meeting-v3.png");
    await checkBoundary(page, viewport.name, "interlude_sea_007", "interlude_sea_008", "novel-bg-zushi-coast-night-v2.png");
    await checkBoundary(page, viewport.name, "interlude_sea_045", "interlude_sea_046", "novel-bg-production-shared-meeting-v3.png");
    await checkBoundary(page, viewport.name, "interlude_sea_067", "mode08_map_layers_001", "novel-bg-exhibition-v3.png");
    await checkBoundary(page, viewport.name, "return_to_start_017", "return_to_start_018", "novel-bg-coastal-venue-v2.png");
    await checkStableBoundary(page, viewport.name, "mode07_abstract_009", "mode07_abstract_010");
    await checkStableBoundary(page, viewport.name, "final_record_017", "final_record_018");
    await checkStableBoundary(page, viewport.name, "return_to_start_020", "return_to_start_021");
    report.viewports.push({ ...viewport, passed: true });
    await context.close();
  }
  assert(report.consoleErrors.length === 0, `console errors: ${report.consoleErrors.join("\n")}`);
  assert(report.pageErrors.length === 0, `page errors: ${report.pageErrors.join("\n")}`);
  assert(report.responses404.length === 0, `404 responses: ${report.responses404.join("\n")}`);
  report.status = "passed";
} finally {
  await browser.close();
  await writeFile(path.join(outputDir, "report.json"), `${JSON.stringify(report, null, 2)}\n`, "utf8");
}

console.log(JSON.stringify({
  status: report.status,
  viewports: report.viewports,
  evidence: report.evidence.length,
  boundaries: report.boundaries.length,
  stableBoundaries: report.stableBoundaries.length,
  consoleErrors: report.consoleErrors.length,
  pageErrors: report.pageErrors.length,
  responses404: report.responses404.length,
  outputDir,
}, null, 2));
