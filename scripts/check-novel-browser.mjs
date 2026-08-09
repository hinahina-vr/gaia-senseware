import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";

const [moduleArgument, executableArgument, outputArgument, baseUrlArgument] = process.argv.slice(2);
const moduleRoot = process.env.GAIA_PLAYWRIGHT_PATH || moduleArgument;
const executablePath = process.env.GAIA_BROWSER_EXECUTABLE || executableArgument;
const baseUrl = process.env.GAIA_BASE_URL || baseUrlArgument || "http://127.0.0.1:4173";
const outputDir = path.resolve(process.env.GAIA_BROWSER_ARTIFACTS || outputArgument || "artifacts/novel-browser");
if (!moduleRoot || !executablePath) throw new Error("GAIA_PLAYWRIGHT_PATH and GAIA_BROWSER_EXECUTABLE are required.");

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const nodeModules = path.dirname(moduleRoot);
const { chromium } = await import(pathToFileURL(path.join(moduleRoot, "index.mjs")));
const sharp = (await import(pathToFileURL(path.join(nodeModules, "sharp", "lib", "index.js")))).default;
const pixelmatch = (await import(pathToFileURL(path.join(nodeModules, "pixelmatch", "index.js")))).default;
delete globalThis.GAIA_NOVEL_STORY;
delete globalThis.GAIA_NOVEL_BACKGROUND_CUES;
await import(`${pathToFileURL(path.join(projectRoot, "novel-story-data.js")).href}?browser=${Date.now()}`);
await import(`${pathToFileURL(path.join(projectRoot, "novel-background-cues.js")).href}?browser=${Date.now()}`);
const story = globalThis.GAIA_NOVEL_STORY;
const backgroundCueData = globalThis.GAIA_NOVEL_BACKGROUND_CUES;
const steps = story.scenes.flatMap((scene) => scene.steps);
const stepMap = new Map(steps.map((step) => [step.id, step]));
const routeUrl = new URL("/story", baseUrl).href;
const STORAGE_KEY = "gaiaSensewareNovel:progress";
const CONFIG_KEY = "gaiaSensewareNovel:config:v2";

await mkdir(outputDir, { recursive: true });
const browser = await chromium.launch({ executablePath, headless: true, args: ["--no-first-run", "--disable-background-networking"] });
const report = { baseUrl: routeUrl, screenshots: [], visualDiffs: [], sceneBackgrounds: [], productionBackgrounds: [], backgroundPreloads: [], interactions: [], modeModalChecks: [], fullWalkthrough: null, viewports: [], consoleErrors: [], pageErrors: [], responses404: [] };
const assert = (condition, message) => { if (!condition) throw new Error(message); };

const attachDiagnostics = (page, label) => {
  page.on("console", (message) => { if (message.type() === "error") report.consoleErrors.push(`${label}: ${message.text()}`); });
  page.on("pageerror", (error) => report.pageErrors.push(`${label}: ${error.message}`));
  page.on("response", (response) => { if (response.status() === 404) report.responses404.push(`${label}: ${response.url()}`); });
};

const screenshot = async (page, name) => {
  const destination = path.join(outputDir, `${name}.png`);
  await page.screenshot({ path: destination, fullPage: false, animations: "disabled", timeout: 90000 });
  report.screenshots.push(destination);
  return destination;
};

const compareBaseline = async (actualPath, baselineName) => {
  const baselinePath = path.join(projectRoot, "tests", "visual-baselines", `${baselineName}.png`);
  const actual = await sharp(actualPath).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const expected = await sharp(baselinePath).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  assert(actual.info.width === expected.info.width && actual.info.height === expected.info.height, `${baselineName}: screenshot dimensions differ from baseline`);
  const diffData = Buffer.alloc(actual.data.length);
  const mismatch = pixelmatch(actual.data, expected.data, diffData, actual.info.width, actual.info.height, { threshold: 0.15, includeAA: false });
  const ratio = mismatch / (actual.info.width * actual.info.height);
  const diffPath = path.join(outputDir, `${baselineName}-diff.png`);
  await sharp(diffData, { raw: actual.info }).png().toFile(diffPath);
  report.visualDiffs.push({ name: baselineName, mismatchRatio: ratio, baselinePath, actualPath, diffPath });
  assert(ratio < 0.68, `${baselineName}: visual mismatch ${ratio.toFixed(3)} exceeds recovery threshold`);
};

const baseState = (stepId, overrides = {}) => ({
  storyVersion: story.storyVersion,
  stepId,
  reachedSceneIds: [],
  viewed: {},
  evesRoute: [],
  observationOrder: null,
  editorialChoice: null,
  reflectionIds: [],
  resultTone: null,
  audio: { muted: false, volume: 0.1 },
  readStepIds: [],
  clear: false,
  archivesUnlocked: false,
  sessionId: "browser-validation",
  ...overrides,
});

const ensureNovelOpen = async (page) => {
  await page.waitForFunction(() => Boolean(globalThis.GaiaNovel), null, { timeout: 15000 });
  await page.evaluate(() => {
    const layer = document.querySelector("#novel-layer");
    if (layer?.hidden || !layer?.classList.contains("is-open")) globalThis.GaiaNovel.open();
  });
  await page.waitForTimeout(150);
  await page.locator("#novel-title-screen").waitFor({ state: "visible", timeout: 15000 });
};

const bootTitle = async (page, { clear = false } = {}) => {
  await page.goto(routeUrl, { waitUntil: "domcontentloaded" });
  await ensureNovelOpen(page);
  if (clear) {
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: "domcontentloaded" });
    await ensureNovelOpen(page);
  }
};

const bootAt = async (page, stepId, overrides = {}, { reducedMotion = false } = {}) => {
  await page.evaluate(({ key, stateValue, configKey, reduced }) => {
    localStorage.setItem(key, JSON.stringify(stateValue));
    localStorage.setItem(configKey, JSON.stringify({ messageSpeedPercent: 400, reducedMotion: reduced }));
  }, { key: STORAGE_KEY, stateValue: baseState(stepId, overrides), configKey: CONFIG_KEY, reduced: reducedMotion });
  await page.reload({ waitUntil: "domcontentloaded" });
  await ensureNovelOpen(page);
  await page.locator("#novel-resume-button").click();
  await page.waitForFunction((id) => document.querySelector("#novel-layer")?.dataset.stepId === id, stepId);
};

const currentStepId = (page) => page.locator("#novel-layer").getAttribute("data-step-id");
const dialoguePageGeometry = (page) => page.evaluate(() => {
  const dialogue = document.querySelector("#novel-dialogue");
  const text = document.querySelector("#novel-text");
  const dialogueRect = dialogue.getBoundingClientRect();
  const textRect = text.getBoundingClientRect();
  const dialogueStyle = getComputedStyle(dialogue);
  const contentTop = dialogueRect.top + (Number.parseFloat(dialogueStyle.paddingTop) || 0);
  const contentBottom = dialogueRect.bottom - (Number.parseFloat(dialogueStyle.paddingBottom) || 0);
  const renderedLineTops = new Set();
  const walker = document.createTreeWalker(text, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const node = walker.currentNode;
    for (let offset = 0; offset < node.data.length; offset += 1) {
      const range = document.createRange();
      range.setStart(node, offset);
      range.setEnd(node, offset + 1);
      const rect = [...range.getClientRects()].find((candidate) => candidate.width > 0 && candidate.height > 0);
      if (rect) renderedLineTops.add(Math.round(rect.top * 2) / 2);
    }
  }
  return {
    characterCount: Number(text.dataset.characterCount),
    explicitLineCount: Number(text.dataset.explicitLineCount),
    measuredLineCount: Number(text.dataset.measuredLineCount),
    maxLineCount: Number(text.dataset.maxLineCount),
    pageCount: Number(text.dataset.pageCount),
    pageIndex: Number(text.dataset.pageIndex),
    renderedLineCount: renderedLineTops.size,
    visibleText: text.getAttribute("aria-label") || text.textContent,
    fontSize: getComputedStyle(text).fontSize,
    inlineFontSize: text.style.fontSize,
    bounds: { textTop: textRect.top, textBottom: textRect.bottom, contentTop, contentBottom },
    fits: textRect.top >= contentTop - 1 && textRect.bottom <= contentBottom + 1,
  };
});
const assertDialoguePageFits = async (page, step) => {
  await page.waitForFunction(() => Boolean(document.querySelector("#novel-text")?.dataset.pageCount));
  const geometry = await dialoguePageGeometry(page);
  assert(geometry.characterCount === Array.from(step.text.replace(/\s/gu, "")).length, `${step.id}: character count was not applied to pagination`);
  assert(geometry.explicitLineCount === step.text.split("\n").length, `${step.id}: explicit line count was not applied to pagination`);
  assert(geometry.measuredLineCount >= 1, `${step.id}: measured line count is invalid`);
  assert(geometry.maxLineCount >= geometry.measuredLineCount, `${step.id}: page exceeded its available line count`);
  assert(geometry.renderedLineCount <= 3, `${step.id}: a fourth rendered line is visible: ${JSON.stringify(geometry)}`);
  assert(!geometry.inlineFontSize, `${step.id}: pagination changed the inline font size`);
  assert(geometry.fits, `${step.id}: dialogue page overflowed: ${JSON.stringify(geometry)}`);
  return geometry;
};
const normalizedDialogueText = (value) => String(value || "").replace(/\s/gu, "");
const assertSentenceAwarePages = (pages, step) => {
  pages.slice(0, -1).forEach((pageText, index) => {
    if (!/[。！？]/u.test(pageText)) return;
    assert(/[。！？][」』】）》〉］〕）”’"']*$/u.test(pageText), `${step.id}: page ${index + 1} includes a fragment of the next sentence: ${JSON.stringify(pages)}`);
  });
};
const collectDialoguePages = async (page, step, { advancePastFinal = false } = {}) => {
  const visiblePages = [];
  let geometry = await assertDialoguePageFits(page, step);
  const expectedPageCount = geometry.pageCount;
  for (let expectedPage = 1; expectedPage <= expectedPageCount; expectedPage += 1) {
    await page.locator("#novel-continue.is-visible").waitFor({ state: "visible", timeout: 10000 });
    geometry = await assertDialoguePageFits(page, step);
    assert(geometry.pageIndex === expectedPage, `${step.id}: expected page ${expectedPage}, got ${geometry.pageIndex}`);
    assert(await currentStepId(page) === step.id, `${step.id}: story advanced before its final text page`);
    visiblePages.push(geometry.visibleText);
    if (expectedPage < expectedPageCount) {
      await page.locator("#novel-dialogue").click();
      await page.waitForFunction((index) => Number(document.querySelector("#novel-text")?.dataset.pageIndex) === index, expectedPage + 1);
    }
  }
  assert(normalizedDialogueText(visiblePages.join("")) === normalizedDialogueText(step.text), `${step.id}: paginated text did not preserve the full source text`);
  assertSentenceAwarePages(visiblePages, step);
  if (advancePastFinal) {
    await page.locator("#novel-dialogue").click();
    await page.waitForFunction((id) => document.querySelector("#novel-layer")?.dataset.stepId !== id, step.id);
  }
  return { geometry, visiblePages };
};
const startPaginationTrace = (page) => page.evaluate(() => {
  globalThis.__novelPaginationObserver?.disconnect();
  const events = [];
  const record = () => {
    const event = {
      stepId: document.querySelector("#novel-layer")?.dataset.stepId || "",
      pageIndex: Number(document.querySelector("#novel-text")?.dataset.pageIndex) || 0,
    };
    const previous = events.at(-1);
    if (!previous || previous.stepId !== event.stepId || previous.pageIndex !== event.pageIndex) events.push(event);
  };
  globalThis.__novelPaginationObserver = new MutationObserver(record);
  globalThis.__novelPaginationObserver.observe(document.querySelector("#novel-layer"), {
    attributes: true,
    subtree: true,
    attributeFilter: ["data-step-id", "data-page-index"],
  });
  globalThis.__novelPaginationTrace = events;
  record();
});
const finishPaginationTrace = (page) => page.evaluate(() => {
  globalThis.__novelPaginationObserver?.disconnect();
  return globalThis.__novelPaginationTrace || [];
});
const assertPaginationTrace = (trace, step, expectedPageCount, mode) => {
  const visitedPages = trace
    .filter((event) => event.stepId === step.id && event.pageIndex > 0)
    .map((event) => event.pageIndex)
    .filter((pageIndex, index, values) => index === 0 || values[index - 1] !== pageIndex);
  const expectedPages = Array.from({ length: expectedPageCount }, (_, index) => index + 1);
  assert(JSON.stringify(visitedPages) === JSON.stringify(expectedPages), `${mode} changed pagination order: ${JSON.stringify(trace)}`);
  assert(trace.some((event) => event.stepId !== step.id), `${mode} did not advance after the final page: ${JSON.stringify(trace)}`);
};
const advanceLinear = async (page) => {
  const previous = await currentStepId(page);
  await page.locator("#novel-layer").dispatchEvent("click");
  if (await currentStepId(page) === previous) await page.locator("#novel-layer").dispatchEvent("click");
  await page.waitForFunction((id) => document.querySelector("#novel-layer")?.dataset.stepId !== id, previous);
};

const checkTitleGeometry = async (page) => {
  const geometry = await page.evaluate(() => {
    const screen = document.querySelector("#novel-title-screen");
    const actions = document.querySelector(".novel-title-actions");
    const rect = actions.getBoundingClientRect();
    return {
      internalScroll: ["auto", "scroll"].includes(getComputedStyle(screen).overflowY) && screen.scrollHeight > screen.clientHeight + 1,
      actionBounds: { left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom },
      viewport: { width: innerWidth, height: innerHeight },
      forbiddenCount: document.querySelectorAll(".novel-title-privacy, .novel-legacy-notice, .novel-inline-card, #novel-mode-bridge").length,
    };
  });
  assert(!geometry.internalScroll, "START contains an internal scrollbar");
  assert(geometry.actionBounds.left >= 0 && geometry.actionBounds.right <= geometry.viewport.width, "START actions overflow horizontally");
  assert(geometry.actionBounds.top >= 0 && geometry.actionBounds.bottom <= geometry.viewport.height, "START actions overflow vertically");
  assert(geometry.forbiddenCount === 0, "removed START or nested-card UI remains");
};

const assertNovelDetourModal = async (page, kind) => {
  await page.waitForTimeout(kind === "gx" ? 1200 : 120);
  const state = await page.evaluate((interactionKind) => {
    const novel = document.querySelector("#novel-layer");
    const modeSelector = interactionKind === "gx"
      ? "#gx-layer"
      : interactionKind === "space10"
        ? "#space-layer"
        : interactionKind === "abstract07"
          ? "#gaia-canvas"
          : "#japan-layer";
    const mode = document.querySelector(modeSelector);
    const backdrop = document.querySelector("#gx-story-backdrop");
    const novelStyle = getComputedStyle(novel);
    const modeStyle = getComputedStyle(mode);
    const backdropStyle = getComputedStyle(backdrop);
    const modeRect = mode.getBoundingClientRect();
    const hitTarget = interactionKind === "gx"
      ? document.elementFromPoint(modeRect.left + modeRect.width / 2, modeRect.top + modeRect.height / 2)
      : null;
    return {
      kind: interactionKind,
      viewport: { width: innerWidth, height: innerHeight },
      bodyClasses: document.body.className,
      stepId: novel.dataset.stepId,
      novel: {
        display: novelStyle.display,
        opacity: Number.parseFloat(novelStyle.opacity),
        pointerEvents: novelStyle.pointerEvents,
        backgroundImage: novelStyle.backgroundImage,
      },
      mode: {
        selector: modeSelector,
        display: modeStyle.display,
        visibility: modeStyle.visibility,
        opacity: Number.parseFloat(modeStyle.opacity),
        pointerEvents: modeStyle.pointerEvents,
        returnTo: mode.dataset.returnTo || "",
        bounds: { top: modeRect.top, right: modeRect.right, bottom: modeRect.bottom, left: modeRect.left },
      },
      backdrop: {
        display: backdropStyle.display,
        opacity: Number.parseFloat(backdropStyle.opacity),
      },
      hitTargetInsideMode: interactionKind !== "gx" || Boolean(hitTarget?.closest("#gx-layer")),
    };
  }, kind);
  assert(state.bodyClasses.includes("novel-mode-detour"), `${kind} did not enter the novel modal state: ${JSON.stringify(state)}`);
  assert(state.novel.display !== "none" && state.novel.opacity > 0 && state.novel.backgroundImage !== "none", `${kind} removed the novel scene context: ${JSON.stringify(state)}`);
  assert(state.novel.pointerEvents === "none", `${kind} left the novel layer interactive: ${JSON.stringify(state)}`);
  assert(state.mode.display !== "none" && state.mode.visibility !== "hidden" && state.mode.opacity > 0 && state.mode.pointerEvents !== "none", `${kind} is not the active interaction target: ${JSON.stringify(state)}`);
  if (kind === "gx") {
    assert(state.bodyClasses.includes("gx-open") && state.mode.returnTo === "novel", `GX modal classes are incomplete: ${JSON.stringify(state)}`);
    assert(state.mode.bounds.top > 0 && state.mode.bounds.left > 0 && state.mode.bounds.right < state.viewport.width && state.mode.bounds.bottom < state.viewport.height, `GX did not open as an inset modal: ${JSON.stringify(state)}`);
    assert(state.backdrop.display !== "none" && state.backdrop.opacity > 0 && state.hitTargetInsideMode, `GX modal backdrop or pointer isolation failed: ${JSON.stringify(state)}`);
  }
  report.modeModalChecks.push(state);
};

const operateInteraction = async (page, step, { record = false } = {}) => {
  await page.locator(".novel-interaction-open").click();
  await page.locator(".story-detour-dock").waitFor({ state: "visible", timeout: 15000 });
  await assertNovelDetourModal(page, step.interaction.kind);
  if (record) await screenshot(page, `mode-${step.interaction.kind}-open`);
  if (step.interaction.kind === "gx") {
    for (let index = 0; index < 3; index += 1) await page.locator(".story-detour-controls button").first().click();
  } else if (step.interaction.kind === "map03" || step.interaction.kind === "map08") {
    await page.locator("#japan-layer").waitFor({ state: "visible" });
    const count = await page.locator(".story-detour-controls button").count();
    for (let index = 0; index < count; index += 1) {
      await page.locator(".story-detour-controls button").nth(index).click();
      if (record) await screenshot(page, `mode-${step.interaction.kind}-layer-${index + 1}`);
    }
  } else if (step.interaction.kind === "abstract07") {
    await page.locator("#gaia-canvas").click({ position: { x: 320, y: 260 }, force: true });
    await page.waitForFunction(() => globalThis.GaiaNovel.getState().viewed.mode07AbstractPoint);
    const count = await page.locator(".story-detour-controls button").count();
    for (let index = 0; index < count; index += 1) await page.locator(".story-detour-controls button").nth(index).click();
  } else if (step.interaction.kind === "space10") {
    await page.locator("#space-layer").waitFor({ state: "visible" });
    await page.locator("#space-canvas").click({ position: { x: 300, y: 240 }, force: true });
  }
  await page.waitForFunction(() => !document.querySelector("#story-detour-return")?.disabled);
  await page.locator("#story-detour-return").click();
  await page.waitForFunction((id) => document.querySelector("#novel-layer")?.dataset.stepId !== id, step.id, { timeout: 15000 });
  const persisted = await page.evaluate(() => globalThis.GaiaNovel.getState().viewed);
  if (record) report.interactions.push({ kind: step.interaction.kind, returnedToStory: true, persisted });
};

const completeInteraction = async (page, step) => {
  await bootAt(page, step.id, {}, { reducedMotion: true });
  await operateInteraction(page, step, { record: true });
};

const runFullWalkthrough = async (page) => {
  await bootTitle(page, { clear: true });
  await page.locator("#novel-start-button").click();
  await page.waitForFunction(() => Boolean(document.querySelector("#novel-layer")?.dataset.stepId));
  const visited = [];
  const interactionKinds = new Set();
  for (let guard = 0; guard < 420; guard += 1) {
    const id = await currentStepId(page);
    const step = stepMap.get(id);
    assert(step, `full walkthrough reached unknown step: ${id}`);
    visited.push(id);
    if (step.type === "end") {
      const state = await page.evaluate(() => globalThis.GaiaNovel.getState());
      assert(state.clear === true, "full walkthrough reached END without clear state");
      assert(interactionKinds.size === 5, `full walkthrough used ${interactionKinds.size} / 5 display-mode interactions`);
      report.fullWalkthrough = { reachedEnd: true, visitedSteps: visited.length, interactionKinds: [...interactionKinds] };
      return;
    }
    if (step.type === "choice") {
      const selector = step.choiceId === "editorial_choice" ? "#novel-evidence-surface nav button" : "#novel-choices button";
      await page.locator(selector).first().click();
      await page.waitForFunction((previous) => document.querySelector("#novel-layer")?.dataset.stepId !== previous, id);
    } else if (step.type === "reflectionChoice") {
      await page.locator(".novel-reflection-proceed").click();
      await page.waitForFunction((previous) => document.querySelector("#novel-layer")?.dataset.stepId !== previous, id);
    } else if (step.type === "interaction") {
      interactionKinds.add(step.interaction.kind);
      await operateInteraction(page, step);
    } else if (step.type === "result") {
      await page.locator(".novel-result-shell button").click();
      await page.waitForFunction((previous) => document.querySelector("#novel-layer")?.dataset.stepId !== previous, id);
    } else {
      await advanceLinear(page);
    }
  }
  throw new Error("full walkthrough did not reach END within 420 transitions");
};

let context;
try {
  context = await browser.newContext({ viewport: { width: 2048, height: 1114 }, reducedMotion: "no-preference" });
  const page = await context.newPage();
  attachDiagnostics(page, "desktop-2048");
  await bootTitle(page, { clear: true });
  await checkTitleGeometry(page);
  assert(await page.locator("#novel-title-privacy").count() === 0, "START notice remains");
  const titlePath = await screenshot(page, "start");
  await compareBaseline(titlePath, "start");

  const backgroundCases = [
    ["current_exhibition", "novel-bg-exhibition-v3.png", "scene-exhibition"],
    ["opening_empty_seat", "novel-bg-workroom-v2.png", "scene-workroom"],
    ["first_meeting_promise", "novel-bg-online-night-v2.png", "scene-online"],
    ["prologue_basil", "novel-bg-garden-center-v2.png", "scene-garden-center"],
    ["first_meeting_hall", "novel-bg-coastal-venue-v2.png", "scene-coastal-venue"],
    ["interlude_sea", "novel-bg-zushi-coast-night-v2.png", "scene-zushi-coast"],
  ];
  for (const [sceneId, expectedFile, screenshotName] of backgroundCases) {
    const sceneStep = steps.find((candidate) => candidate.sceneId === sceneId && ["dialogue", "chat"].includes(candidate.type))
      || steps.find((candidate) => candidate.sceneId === sceneId);
    await bootAt(page, sceneStep.id);
    const backgroundImage = await page.locator("#novel-layer").evaluate((node) => getComputedStyle(node).backgroundImage);
    assert(backgroundImage.includes(expectedFile), `${sceneId} uses the wrong background: ${backgroundImage}`);
    assert(!backgroundImage.includes("novel-background-v1") && !backgroundImage.includes("assets/characters"), `${sceneId} still uses character-composited background art`);
    report.sceneBackgrounds.push({ sceneId, expectedFile, passed: true });
    await screenshot(page, screenshotName);
  }

  // production_year has step-level background cues and is audited separately.
  const productionSteps = steps.filter((step) => step.sceneId === "production_year");
  const productionRuntimeCues = await page.evaluate((stepIds) => stepIds.map((stepId) => globalThis.GaiaNovel.getBackgroundCue(stepId)), productionSteps.map((step) => step.id));
  assert(productionRuntimeCues.length === 261 && productionRuntimeCues.every((cue) => cue?.assetPath), "production_year has an unresolved background cue");
  assert(productionRuntimeCues.every((cue) => !cue.assetPath.includes("novel-bg-production-night-v2.png")), "production_year still references the old production-night background");
  assert(productionRuntimeCues.every((cue) => !/novel-bg-(?:amane|mizuha|sakuya)-room-v1\.png$/.test(cue.assetPath)), "production_year uses an unqualified room-v1 fallback");

  const productionEvidenceSteps = [
    "production_year_001", "production_year_007", "production_year_060", "production_year_080", "production_year_083",
    "production_year_086", "production_year_089", "production_year_090", "production_year_103", "production_year_122",
    "production_year_150", "production_year_156", "production_year_168", "production_year_169", "production_year_170", "production_year_175", "production_year_195",
    "production_year_200", "production_year_215", "production_year_233", "production_year_239", "production_year_248",
    "production_year_254", "production_year_257", "production_year_259",
  ];
  const preloadTargets = new Map([
    ["production_year_083", "novel-bg-sakuya-room-day-v1.png"],
    ["production_year_168", "novel-bg-production-station-meeting-v1.png"],
  ]);
  for (const stepId of productionEvidenceSteps) {
    const step = stepMap.get(stepId);
    const cue = backgroundCueData.forStep(step);
    const expectedFile = path.basename(cue.assetPath);
    await bootAt(page, stepId);
    const presentation = await page.locator("#novel-layer").evaluate((node) => ({
      backgroundImage: getComputedStyle(node).backgroundImage,
      cueId: node.dataset.backgroundCue,
      horizontalOverflow: document.documentElement.scrollWidth > innerWidth + 1,
    }));
    assert(presentation.backgroundImage.includes(expectedFile), `${stepId} uses the wrong production background: ${presentation.backgroundImage}`);
    assert(presentation.cueId === cue.id && !presentation.horizontalOverflow, `${stepId} cue presentation failed: ${JSON.stringify(presentation)}`);
    const preloadTarget = preloadTargets.get(stepId);
    if (preloadTarget) {
      await page.waitForFunction((filename) => performance.getEntriesByType("resource").some((entry) => entry.name.includes(filename)), preloadTarget, { timeout: 5000 });
      report.backgroundPreloads.push({ stepId, nextAsset: preloadTarget, requestedBeforeBoundary: true });
    }
    report.productionBackgrounds.push({ viewport: "2048x1114", stepId, cueId: cue.id, assetPath: cue.assetPath, passed: true });
    await screenshot(page, `production-${stepId.slice(-3)}-desktop`);
  }

  const productionTransitionCases = productionSteps.slice(0, -1)
    .map((step, index) => [step, productionSteps[index + 1]])
    .filter(([fromStep, toStep]) => backgroundCueData.forStep(fromStep).assetPath !== backgroundCueData.forStep(toStep).assetPath)
    .map(([fromStep, toStep]) => [fromStep.id, toStep.id]);
  for (const [fromStepId, toStepId] of productionTransitionCases) {
    const fromCue = backgroundCueData.forStep(stepMap.get(fromStepId));
    const toCue = backgroundCueData.forStep(stepMap.get(toStepId));
    const fromFile = path.basename(fromCue.assetPath);
    const toFile = path.basename(toCue.assetPath);
    await bootAt(page, fromStepId);
    for (let guard = 0; guard < 64; guard += 1) {
      await page.locator("#novel-layer").dispatchEvent("click");
      await page.waitForTimeout(24);
      if (await page.locator("body").evaluate((body) => body.classList.contains("scene-transitioning"))) break;
    }
    await page.waitForFunction(() => document.body.classList.contains("scene-transitioning"), null, { timeout: 8000 });
    await page.waitForFunction((id) => document.querySelector("#novel-layer")?.dataset.stepId === id, toStepId, { timeout: 8000 });
    const frame = await page.locator("#novel-layer").evaluate((layer) => ({
      currentBackground: getComputedStyle(layer).backgroundImage,
      bufferedBackground: getComputedStyle(layer, "::before").backgroundImage,
      buffered: layer.classList.contains("is-background-buffered"),
      releasing: layer.classList.contains("is-background-releasing"),
    }));
    assert(frame.currentBackground.includes(toFile) && frame.bufferedBackground.includes(fromFile) && frame.buffered && frame.releasing, `${fromStepId}->${toStepId} did not preserve the old background beneath the new cue: ${JSON.stringify(frame)}`);
    report.productionBackgrounds.push({ viewport: "2048x1114", transition: `${fromStepId}->${toStepId}`, from: fromCue.id, to: toCue.id, layered: true, passed: true });
    await screenshot(page, `production-transition-${fromStepId.slice(-3)}-${toStepId.slice(-3)}`, { animations: "allow" });
    await page.waitForFunction(() => !document.body.classList.contains("scene-transitioning"), null, { timeout: 8000 });
  }
  await bootAt(page, "production_year_087");
  await advanceLinear(page);
  assert(await currentStepId(page) === "production_year_088", "same-cue production step did not advance normally");
  assert(!await page.locator("body").evaluate((body) => body.classList.contains("scene-transitioning")), "same production background reanimated on every step");
  report.productionBackgrounds.push({ viewport: "2048x1114", transition: "production_year_087->production_year_088", sameCueDidNotReanimate: true, passed: true });

  const inlineRecord = steps.find((step) => step.type === "record" && step.recordType === "SOURCE" && step.text.includes("園芸売り場"))
    || steps.find((step) => step.type === "record" && step.recordType === "SOURCE");
  const inlineRecordScene = story.scenes.find((scene) => scene.id === inlineRecord.sceneId);
  await bootAt(page, inlineRecord.id);
  await page.locator("#novel-continue.is-visible").waitFor({ state: "visible", timeout: 5000 });
  const inlineRecordPresentation = await page.evaluate(() => {
    const location = document.querySelector("#novel-location");
    return {
      dialogueVisible: !document.querySelector("#novel-dialogue").hidden,
      evidenceHidden: document.querySelector("#novel-evidence-surface").hidden,
      speaker: document.querySelector("#novel-speaker").textContent,
      text: document.querySelector("#novel-text").textContent,
      paginationApplied: Boolean(document.querySelector("#novel-text").dataset.pageCount),
      sourceDetailsAvailable: !document.querySelector("#novel-source-button").hidden,
      castSpeaker: document.querySelector("#novel-cast").dataset.speaker,
      avatarHidden: document.querySelector("#novel-avatar").hidden,
      locationText: location.textContent,
      locationParent: location.parentElement?.id,
      locationShadow: getComputedStyle(location).textShadow,
      obsoleteFooterLocation: document.querySelectorAll(".novel-footer #novel-location").length,
      obsoleteSignalTitle: document.querySelectorAll("#novel-signal-title").length,
    };
  });
  assert(inlineRecordPresentation.dialogueVisible && inlineRecordPresentation.evidenceHidden && inlineRecordPresentation.speaker === "観測メモ" && inlineRecordPresentation.sourceDetailsAvailable, `record did not use the normal novel presentation: ${JSON.stringify(inlineRecordPresentation)}`);
  assert(!inlineRecordPresentation.paginationApplied, `special record UI incorrectly used normal-text pagination: ${JSON.stringify(inlineRecordPresentation)}`);
  assert(inlineRecordPresentation.castSpeaker === "narrator" && inlineRecordPresentation.avatarHidden, `source record unexpectedly displayed a character portrait: ${JSON.stringify(inlineRecordPresentation)}`);
  assert(inlineRecordPresentation.text.includes("園芸売り場") && inlineRecordPresentation.text.includes("36") && !/LOCAL SOURCE|SOURCE|観測記録\s*\//.test(inlineRecordPresentation.text), `record exposed internal labels or lost canonical copy: ${JSON.stringify(inlineRecordPresentation)}`);
  assert(inlineRecordPresentation.locationText === inlineRecordScene.title && inlineRecordPresentation.locationParent === "novel-source-button" && inlineRecordPresentation.obsoleteFooterLocation === 0 && inlineRecordPresentation.obsoleteSignalTitle === 0 && inlineRecordPresentation.locationShadow !== "none", `scene location was not moved into the readable upper caption: ${JSON.stringify(inlineRecordPresentation)}`);
  assert(await page.locator(".novel-evidence-card").count() === 0, "obsolete full-screen record card remains");
  await screenshot(page, "record-note");

  const backgroundTransitionScene = story.scenes.find((scene) => scene.id === "opening_empty_seat");
  const backgroundTransitionStep = backgroundTransitionScene.steps.at(-1);
  await bootAt(page, backgroundTransitionStep.id);
  await page.waitForTimeout(200);
  const backgroundBeforeTransition = await page.locator("#novel-layer").evaluate((node) => getComputedStyle(node).backgroundImage);
  await page.locator("#novel-dialogue").click();
  await page.waitForFunction(() => document.body.classList.contains("scene-transitioning"));
  assert(await page.locator("#scene-transition").isVisible(), "novel background change did not use the shared scene transition canvas");
  await page.waitForFunction((id) => document.querySelector("#novel-layer")?.dataset.stepId === id, "prologue_online_circle_001", { timeout: 5000 });
  const backgroundAfterTransition = await page.locator("#novel-layer").evaluate((node) => getComputedStyle(node).backgroundImage);
  assert(backgroundBeforeTransition.includes("novel-bg-workroom-v2.png") && backgroundAfterTransition.includes("novel-bg-online-night-v2.png"), "novel background transition did not swap the expected scenes");
  await page.waitForFunction(() => !document.body.classList.contains("scene-transitioning"), null, { timeout: 5000 });

  const stableRevealStep = steps.find((step) => step.id === "festival_walk_001");
  await bootAt(page, stableRevealStep.id);
  await page.locator("#novel-text.is-revealing .novel-line").first().waitFor({ state: "attached", timeout: 5000 });
  const revealGeometry = () => page.locator("#novel-text").evaluate((text) => ({
    box: (() => { const rect = text.getBoundingClientRect(); return [rect.left, rect.top, rect.width, rect.height]; })(),
    lines: [...text.querySelectorAll(".novel-line")].map((line) => {
      const rect = line.getBoundingClientRect();
      return [rect.left, rect.top, rect.width, rect.height];
    }),
  }));
  const revealStartGeometry = await revealGeometry();
  await page.waitForTimeout(220);
  const revealMidGeometry = await revealGeometry();
  await page.locator("#novel-continue.is-visible").waitFor({ state: "visible", timeout: 5000 });
  const revealEndGeometry = await revealGeometry();
  assert(revealStartGeometry.lines.length >= 3, `long narration was not measured into stable lines: ${JSON.stringify(revealStartGeometry)}`);
  assert(JSON.stringify(revealStartGeometry) === JSON.stringify(revealMidGeometry) && JSON.stringify(revealMidGeometry) === JSON.stringify(revealEndGeometry), `narration geometry moved during or after text reveal: ${JSON.stringify({ revealStartGeometry, revealMidGeometry, revealEndGeometry })}`);
  assert(await page.locator("#novel-cursor").isHidden(), "text cursor remained visible after reveal completed");

  const nativeFontStep = steps.find((step) => step.id === "current_exhibition_001");
  const overflowRegressionStep = steps.find((step) => step.id === "current_exhibition_006");
  const sentenceBoundaryRegressionStep = steps.find((step) => step.id === "current_exhibition_010");
  const dialogueSentenceRegressionStep = steps
    .filter((step) => step.type === "dialogue" && (step.text.match(/[。！？]/gu) || []).length >= 2)
    .sort((left, right) => right.text.length - left.text.length)[0];
  await bootAt(page, nativeFontStep.id);
  const nativeFontGeometry = await assertDialoguePageFits(page, nativeFontStep);
  await bootAt(page, overflowRegressionStep.id);
  const overflowRegressionGeometry = await assertDialoguePageFits(page, overflowRegressionStep);
  assert(overflowRegressionGeometry.pageCount > 1, "long narration was not split across pages");
  assert(overflowRegressionGeometry.maxLineCount === 3, "desktop dialogue did not reserve three lines per page");
  assert(overflowRegressionGeometry.measuredLineCount === overflowRegressionGeometry.maxLineCount, "long narration turned the page before using its final available line");
  assert(overflowRegressionGeometry.fontSize === nativeFontGeometry.fontSize, "long narration changed the dialogue font size");
  const firstPageFontSize = overflowRegressionGeometry.fontSize;
  await page.locator("#novel-dialogue").click();
  await page.locator("#novel-continue.is-visible").waitFor({ state: "visible", timeout: 10000 });
  assert(await currentStepId(page) === overflowRegressionStep.id, "completing the reveal advanced the story step");
  assert((await dialoguePageGeometry(page)).pageIndex === 1, "completing the reveal skipped the first text page");
  const collectedDesktopPages = await collectDialoguePages(page, overflowRegressionStep);
  assert(collectedDesktopPages.geometry.fontSize === firstPageFontSize, "page turn changed the dialogue font size");
  await screenshot(page, "dialogue-pagination");
  await page.locator("#novel-dialogue").click();
  await page.waitForFunction((id) => document.querySelector("#novel-layer")?.dataset.stepId !== id, overflowRegressionStep.id);

  const explicitMultilineStep = steps
    .filter((step) => ["narration", "dialogue"].includes(step.type) && step.text.includes("\n"))
    .sort((left, right) => right.text.split("\n").length - left.text.split("\n").length)[0];
  if (explicitMultilineStep) {
    await bootAt(page, explicitMultilineStep.id);
    await assertDialoguePageFits(page, explicitMultilineStep);
  }

  const sharedBackgroundScene = story.scenes.find((scene) => scene.id === "absence");
  const sharedBackgroundStep = sharedBackgroundScene.steps.at(-1);
  await bootAt(page, sharedBackgroundStep.id);
  await page.locator("#novel-dialogue").click();
  if (await currentStepId(page) === sharedBackgroundStep.id) await page.locator("#novel-dialogue").click();
  assert(!await page.locator("body").evaluate((node) => node.classList.contains("scene-transitioning")), "unchanged story background incorrectly triggered a scene transition");
  await page.waitForFunction(() => document.querySelector("#novel-layer")?.dataset.sceneId === "search");

  const chat = steps.find((step) => step.id === "opening_empty_seat_004");
  await bootAt(page, chat.id);
  assert(await page.locator("#novel-dialogue").isVisible(), "Slack must float above the normal dialogue window");
  assert(await page.locator(".novel-slack-workspace").count() === 1, "Slack must be one surface");
  assert(await page.locator(".novel-slack-post").count() === 1, "Slack thread must begin with one root post");
  assert(await page.locator(".novel-slack-typing").isVisible(), "continued Slack conversation must show a typing indicator");
  const firstSlackAvatars = await page.evaluate(() => ({
    amane: getComputedStyle(document.querySelector('.novel-slack-post[data-speaker="amane"] .novel-slack-avatar')).backgroundImage,
    mizuhaTyping: getComputedStyle(document.querySelector('.novel-slack-typing[data-speaker="mizuha"] .novel-slack-avatar')).backgroundImage,
  }));
  assert(firstSlackAvatars.amane.includes("slack-avatar-amane-v1.webp") && firstSlackAvatars.mizuhaTyping.includes("slack-avatar-mizuha-v1.webp"), `character mascot avatars are missing from Slack: ${JSON.stringify(firstSlackAvatars)}`);
  const slackGeometry = await page.evaluate(() => {
    const workspace = document.querySelector(".novel-slack-workspace");
    const dialogue = document.querySelector("#novel-dialogue");
    const rect = workspace.getBoundingClientRect();
    const dialogueRect = dialogue.getBoundingClientRect();
    return {
      widthRatio: rect.width / innerWidth,
      heightRatio: rect.height / innerHeight,
      sitsAboveDialogue: rect.top < dialogueRect.top && rect.bottom <= dialogueRect.bottom,
      background: getComputedStyle(workspace).backgroundColor,
      mainBackground: getComputedStyle(workspace.querySelector("main")).backgroundColor,
      backdropFilter: getComputedStyle(workspace).backdropFilter,
    };
  });
  const slackAlpha = (color) => Number(color.match(/[\d.]+(?=\))/u)?.[0] || 1);
  assert(slackGeometry.widthRatio < 0.64 && slackGeometry.heightRatio < 0.62, `Slack overlay is still too large: ${JSON.stringify(slackGeometry)}`);
  assert(slackGeometry.sitsAboveDialogue && slackAlpha(slackGeometry.background) <= 0.3 && slackAlpha(slackGeometry.mainBackground) <= 0.5 && !slackGeometry.backdropFilter.includes("blur"), `Slack overlay placement/translucency failed: ${JSON.stringify(slackGeometry)}`);
  await advanceLinear(page);
  assert(await page.locator(".novel-slack-post").count() === 2, "second Slack message did not append to the thread");
  assert((await page.locator(".novel-slack-post").first().innerText()).includes("先に部屋、入ってる。"), "earlier Slack post disappeared");
  assert(await page.locator(".novel-slack-typing").isVisible(), "typing indicator did not continue before the next reply");
  assert((await page.locator(".novel-slack-post.is-new").evaluate((post) => getComputedStyle(post).animationName)) === "novel-slack-reply-in", "new Slack reply has no append animation");
  assert((await page.locator(".novel-slack-typing i b").first().evaluate((dot) => getComputedStyle(dot).animationName)) === "novel-slack-typing", "Slack typing indicator is not animated");
  const slackPath = await screenshot(page, "slack");
  await compareBaseline(slackPath, "slack");
  await advanceLinear(page);
  assert(await page.locator(".novel-slack-post").count() === 3, "third Slack message did not append to the thread");
  assert(await page.locator(".novel-slack-post.is-reply").count() === 2, "Slack replies are not connected as a thread");
  const speakerText = await page.locator(".novel-slack-post p strong").allTextContents();
  assert(speakerText.length === 3, "Slack speaker labels do not match the visible posts");

  const sakuyaChat = steps.find((step) => step.id === "prologue_basil_007");
  await bootAt(page, sakuyaChat.id);
  const sakuyaAvatar = await page.locator('.novel-slack-post[data-speaker="sakuya"] .novel-slack-avatar').last().evaluate((avatar) => getComputedStyle(avatar).backgroundImage);
  assert(sakuyaAvatar.includes("slack-avatar-sakuya-v1.webp"), `Sakuya mascot avatar is missing from Slack: ${sakuyaAvatar}`);

  const observationChoice = steps.find((step) => step.choiceId === "observation_order");
  await bootAt(page, observationChoice.id);
  const observationLabels = await page.locator("#novel-choices button").allTextContents();
  assert(JSON.stringify(observationLabels) === JSON.stringify(["売り場の温度計から見る", "最寄り観測所の記録から見る"]), `observation choice leaked internal labels: ${JSON.stringify(observationLabels)}`);
  await screenshot(page, "observation-choice");

  const editorial = steps.find((step) => step.choiceId === "editorial_choice");
  await bootAt(page, editorial.id);
  assert(await page.locator(".novel-evidence-compare > article").count() === 2, "SOURCE and DERIVED are not separated");
  assert((await page.locator(".novel-evidence-compare .is-derived").innerText()).includes("サクヤ本人の確認"), "DERIVED responsibility is missing");
  const evidencePath = await screenshot(page, "evidence");
  await compareBaseline(evidencePath, "evidence");

  const reflection = steps.find((step) => step.type === "reflectionChoice");
  await bootAt(page, reflection.id, { editorialChoice: "SOURCE_RECORD", evesRoute: [{ decisionId: "editorial_choice", value: "SOURCE_RECORD", label: "本人記録で構成する / SOURCE RECORD", stepId: editorial.id }] });
  assert(await page.locator(".novel-reflection-grid button").count() === 36, "reflection grid must contain 36 statements");
  const gridGeometry = await page.evaluate(() => {
    const surface = document.querySelector("#novel-reflection-surface");
    const rects = [...document.querySelectorAll(".novel-reflection-grid button")].map((button) => button.getBoundingClientRect());
    return { scrolls: surface.scrollHeight > surface.clientHeight + 1, allVisible: rects.every((rect) => rect.top >= 0 && rect.bottom <= innerHeight && rect.left >= 0 && rect.right <= innerWidth) };
  });
  assert(!gridGeometry.scrolls && gridGeometry.allVisible, "36 statements must fit in one desktop viewport");
  const choicePath = await screenshot(page, "choice");
  await compareBaseline(choicePath, "choice");
  for (let index = 0; index < 3; index += 1) await page.locator(".novel-reflection-grid button").nth(index).click();
  await page.locator(".novel-reflection-grid button").nth(3).click();
  assert(await page.locator('.novel-reflection-grid button[aria-pressed="true"]').count() === 3, "fourth reflection statement was incorrectly selected");
  assert((await page.locator(".novel-reflection-status").innerText()).includes("最大3つ"), "selection limit was not announced");
  await page.locator(".novel-reflection-grid button").nth(1).click();
  assert(await page.locator('.novel-reflection-grid button[aria-pressed="true"]').count() === 2, "reflection deselection failed");
  await page.reload({ waitUntil: "domcontentloaded" });
  await ensureNovelOpen(page);
  await page.locator("#novel-resume-button").click();
  assert(await page.locator('.novel-reflection-grid button[aria-pressed="true"]').count() === 2, "reflection selection did not survive reload");
  const scoring = await page.evaluate(() => ({
    none: GaiaNovel.scoreReflection([]), law: GaiaNovel.scoreReflection(["R03"]), neutral: GaiaNovel.scoreReflection(["R01"]), chaos: GaiaNovel.scoreReflection(["R02"]),
    allTie: GaiaNovel.scoreReflection(["R01", "R03", "R21"]), twoWayTie: GaiaNovel.scoreReflection(["R01", "R02"]),
  }));
  assert(JSON.stringify(scoring) === JSON.stringify({ none: "UNANSWERED", law: "LAW", neutral: "NEUTRAL", chaos: "CHAOS", allTie: "NEUTRAL", twoWayTie: "NEUTRAL" }), `unexpected reflection scoring: ${JSON.stringify(scoring)}`);

  const result = steps.find((step) => step.type === "result");
  await bootAt(page, result.id, { editorialChoice: "SOURCE_RECORD", reflectionIds: ["R01"], resultTone: "NEUTRAL", evesRoute: [{ decisionId: "editorial_choice", value: "SOURCE_RECORD", label: "本人記録で構成する / SOURCE RECORD", stepId: editorial.id }, { decisionId: "reflection_choice", value: "SELECTED", label: "観測姿勢を選ぶ", stepId: reflection.id }] });
  const resultText = await page.locator("#novel-result-surface").innerText();
  assert(!/LAW|NEUTRAL|CHAOS|R01/u.test(resultText), "result exposes hidden attributes or selected statement IDs");
  const resultPath = await screenshot(page, "result");
  await compareBaseline(resultPath, "result");

  const interactions = steps.filter((step) => step.type === "interaction");
  const transitionInteraction = interactions.find((step) => step.interaction.kind === "map03") || interactions[0];
  await bootAt(page, transitionInteraction.id);
  await screenshot(page, "interaction-open");
  const interactionOpen = page.locator(".novel-interaction-open");
  await interactionOpen.hover();
  assert(!await page.locator(".gaia-global-button-glint").evaluate((node) => node.classList.contains("is-active")), "full-width interaction button activates the fixed glint");
  const interactionBounds = await interactionOpen.boundingBox();
  await interactionOpen.click();
  await page.locator(".story-detour-dock").waitFor({ state: "visible", timeout: 15000 });
  const glintAfterTransition = await page.locator(".gaia-global-button-glint").evaluate((node) => ({
    active: node.classList.contains("is-active"),
    width: Number.parseFloat(node.style.width) || 0,
    height: Number.parseFloat(node.style.height) || 0,
  }));
  const sourceSizedGlint = glintAfterTransition.active
    && glintAfterTransition.width >= interactionBounds.width * 0.8
    && glintAfterTransition.height >= interactionBounds.height * 0.8;
  assert(!sourceSizedGlint, `button glint leaked into the interaction view: ${JSON.stringify(glintAfterTransition)}`);
  await screenshot(page, "interaction-transition-clean");
  const glintLifecycle = await page.evaluate(async () => {
    const nextFrame = () => new Promise((resolve) => requestAnimationFrame(resolve));
    const makeButton = () => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = "test";
      Object.assign(button.style, {
        position: "fixed",
        zIndex: "2147482000",
        top: "24px",
        left: "24px",
        width: "180px",
        height: "52px",
      });
      document.body.append(button);
      return button;
    };
    const hover = (button) => button.dispatchEvent(new PointerEvent("pointerover", {
      bubbles: true,
      clientX: 40,
      clientY: 40,
    }));
    const glint = document.querySelector(".gaia-global-button-glint");
    const detachedButton = makeButton();
    hover(detachedButton);
    await nextFrame();
    const activated = glint.classList.contains("is-active");
    detachedButton.remove();
    await nextFrame();
    await nextFrame();
    const detachedCleared = !glint.classList.contains("is-active");

    const coveredButton = makeButton();
    const cover = document.createElement("div");
    Object.assign(cover.style, {
      position: "fixed",
      zIndex: "2147482500",
      inset: "20px auto auto 20px",
      width: "190px",
      height: "62px",
    });
    document.body.append(cover);
    hover(coveredButton);
    await nextFrame();
    await nextFrame();
    const coveredCleared = !glint.classList.contains("is-active");
    cover.remove();
    coveredButton.remove();
    return { activated, detachedCleared, coveredCleared };
  });
  assert(glintLifecycle.activated && glintLifecycle.detachedCleared && glintLifecycle.coveredCleared, `button glint lifecycle failed: ${JSON.stringify(glintLifecycle)}`);
  for (const interaction of interactions) await completeInteraction(page, interaction);

  const narration = steps.find((step) => step.type === "narration");
  await bootAt(page, narration.id);
  const keyboardStep = await currentStepId(page);
  await page.locator("#novel-dialogue").focus();
  await page.keyboard.press("Enter");
  await page.keyboard.press("Space");
  await page.waitForFunction((previous) => document.querySelector("#novel-layer")?.dataset.stepId !== previous, keyboardStep);
  await bootAt(page, narration.id);
  await page.locator("#novel-log-button").click();
  assert(await page.locator("#novel-log-panel").isVisible(), "LOG did not open");
  await page.locator("#novel-log-close").click();
  await page.locator("#novel-config-button").click();
  await page.locator("#novel-reduced-motion").check();
  await page.locator("#novel-config-close").click();
  await page.locator("#novel-auto-button").click();
  assert(await page.locator("#novel-auto-button").getAttribute("aria-pressed") === "true", "AUTO did not enable");
  await page.locator("#novel-auto-button").click();
  const savedStep = await currentStepId(page);
  await page.locator("#novel-save-button").click();
  await page.locator("#novel-save-slots .novel-save-primary").first().click();
  await page.locator("#novel-save-close").click();
  await advanceLinear(page);
  await page.locator("#novel-load-button").click();
  await page.locator("#novel-save-slots .novel-save-primary").first().click();
  assert(await currentStepId(page) === savedStep, "manual SAVE / LOAD did not restore the step");
  await page.locator("#novel-eves-button").click();
  assert(await page.locator("#novel-eves-panel").isVisible(), "E.V.E.S. did not open");
  await page.locator("#novel-eves-close").click();
  if (await page.locator("#gaia-audio-toggle").count()) {
    await page.locator("#gaia-audio-toggle").click();
    await page.locator("#gaia-audio-toggle").click();
  }

  await page.evaluate((key) => localStorage.setItem(key, "{broken"), STORAGE_KEY);
  await page.reload({ waitUntil: "domcontentloaded" });
  await ensureNovelOpen(page);
  assert(await page.locator("#novel-resume-button").isHidden(), "broken save must be ignored");
  await page.evaluate(({ stable, legacy, id }) => { localStorage.removeItem(stable); localStorage.setItem(legacy, JSON.stringify({ storyVersion: 6, stepId: id })); }, { stable: STORAGE_KEY, legacy: "gaia_novel_save_v6", id: narration.id });
  await page.reload({ waitUntil: "domcontentloaded" });
  await ensureNovelOpen(page);
  assert(await page.locator("#novel-resume-button").isVisible(), "v6 save was not migrated");
  assert(await page.evaluate((key) => Boolean(localStorage.getItem(key)), STORAGE_KEY), "v6 migration did not write stable storage");
  await page.evaluate(({ stable, v6, v5 }) => { localStorage.removeItem(stable); localStorage.removeItem(v6); localStorage.setItem(v5, JSON.stringify({ stepIndex: 3, flags: [], routeHistory: [] })); }, { stable: STORAGE_KEY, v6: "gaia_novel_save_v6", v5: "gaiaSensewareNovel:v5" });
  await page.reload({ waitUntil: "domcontentloaded" });
  await ensureNovelOpen(page);
  assert(await page.locator("#novel-resume-button").isVisible(), "v5 save was not migrated");
  const walkthroughContext = await browser.newContext({ viewport: { width: 2048, height: 1114 }, reducedMotion: "reduce" });
  const walkthroughPage = await walkthroughContext.newPage();
  attachDiagnostics(walkthroughPage, "full-walkthrough");
  await runFullWalkthrough(walkthroughPage);
  await walkthroughContext.close();
  report.viewports.push({ width: 2048, height: 1114, passed: true });
  await context.close();

  context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const medium = await context.newPage();
  attachDiagnostics(medium, "desktop-1440");
  await bootTitle(medium, { clear: true });
  await checkTitleGeometry(medium);
  await screenshot(medium, "start-1440");
  await bootAt(medium, reflection.id);
  assert(await medium.locator(".novel-reflection-grid button").count() === 36, "1440 reflection grid is incomplete");
  await screenshot(medium, "choice-1440");
  const mediumGxInteraction = steps.find((step) => step.type === "interaction" && step.interaction.kind === "gx");
  await bootAt(medium, mediumGxInteraction.id);
  await medium.locator(".novel-interaction-open").click();
  await medium.locator(".story-detour-dock").waitFor({ state: "visible", timeout: 15000 });
  await assertNovelDetourModal(medium, mediumGxInteraction.interaction.kind);
  report.viewports.push({ width: 1440, height: 900, passed: true });
  await context.close();

  context = await browser.newContext({ viewport: { width: 1612, height: 454 }, reducedMotion: "reduce" });
  const shortDesktop = await context.newPage();
  attachDiagnostics(shortDesktop, "short-desktop-1612x454");
  await bootTitle(shortDesktop, { clear: true });
  await bootAt(shortDesktop, nativeFontStep.id, {}, { reducedMotion: true });
  const shortDesktopNativeFont = (await assertDialoguePageFits(shortDesktop, nativeFontStep)).fontSize;
  await bootAt(shortDesktop, overflowRegressionStep.id, {}, { reducedMotion: true });
  const shortDesktopGeometry = await assertDialoguePageFits(shortDesktop, overflowRegressionStep);
  assert(shortDesktopGeometry.pageCount > 1, "short desktop did not paginate the long narration");
  assert(shortDesktopGeometry.maxLineCount === 3, "short desktop dialogue did not reserve three lines per page");
  assert(shortDesktopGeometry.measuredLineCount === shortDesktopGeometry.maxLineCount, "short desktop turned the page before using its third line");
  assert(shortDesktopGeometry.fontSize === shortDesktopNativeFont, "short desktop changed the dialogue font size");
  await collectDialoguePages(shortDesktop, overflowRegressionStep);
  await screenshot(shortDesktop, "dialogue-pagination-1612x454");

  await bootAt(shortDesktop, sentenceBoundaryRegressionStep.id, {}, { reducedMotion: true });
  const shortDesktopSentencePages = (await collectDialoguePages(shortDesktop, sentenceBoundaryRegressionStep)).visiblePages;
  assert(shortDesktopSentencePages[0].endsWith("風向きと発電量について話している。"), `short desktop did not end the first page at the requested sentence boundary: ${JSON.stringify(shortDesktopSentencePages)}`);
  assert(shortDesktopSentencePages[1]?.startsWith("奥のステージから"), `short desktop left a fragment of the next sentence on page one: ${JSON.stringify(shortDesktopSentencePages)}`);
  await screenshot(shortDesktop, "dialogue-sentence-boundary-1612x454");

  await bootAt(shortDesktop, overflowRegressionStep.id, {}, { reducedMotion: true });
  const autoPageCount = (await assertDialoguePageFits(shortDesktop, overflowRegressionStep)).pageCount;
  await startPaginationTrace(shortDesktop);
  await shortDesktop.locator("#novel-auto-button").click();
  await shortDesktop.waitForFunction((id) => document.querySelector("#novel-layer")?.dataset.stepId !== id, overflowRegressionStep.id, { timeout: 15000 });
  if (await shortDesktop.locator("#novel-auto-button").getAttribute("aria-pressed") === "true") await shortDesktop.locator("#novel-auto-button").click();
  assertPaginationTrace(await finishPaginationTrace(shortDesktop), overflowRegressionStep, autoPageCount, "AUTO");

  await bootAt(shortDesktop, overflowRegressionStep.id, {}, { reducedMotion: true });
  const fastForwardPageCount = (await assertDialoguePageFits(shortDesktop, overflowRegressionStep)).pageCount;
  await startPaginationTrace(shortDesktop);
  await shortDesktop.locator("#novel-fast-forward-button").click();
  await shortDesktop.waitForFunction((id) => document.querySelector("#novel-layer")?.dataset.stepId !== id, overflowRegressionStep.id, { timeout: 5000 });
  if (await shortDesktop.locator("#novel-fast-forward-button").getAttribute("aria-pressed") === "true") await shortDesktop.locator("#novel-fast-forward-button").click();
  assertPaginationTrace(await finishPaginationTrace(shortDesktop), overflowRegressionStep, fastForwardPageCount, "fast-forward");
  report.viewports.push({ width: 1612, height: 454, passed: true });
  await context.close();

  context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
  const mobile = await context.newPage();
  attachDiagnostics(mobile, "mobile-390");
  await bootTitle(mobile, { clear: true });
  await checkTitleGeometry(mobile);
  await screenshot(mobile, "start-mobile");
  await bootAt(mobile, nativeFontStep.id, {}, { reducedMotion: true });
  const mobileNativeFont = (await assertDialoguePageFits(mobile, nativeFontStep)).fontSize;
  await bootAt(mobile, overflowRegressionStep.id, {}, { reducedMotion: true });
  const mobilePaginationGeometry = await assertDialoguePageFits(mobile, overflowRegressionStep);
  assert(mobilePaginationGeometry.pageCount > 1 && mobilePaginationGeometry.maxLineCount === 3, `mobile did not paginate narration at three rendered lines: ${JSON.stringify(mobilePaginationGeometry)}`);
  assert(mobilePaginationGeometry.fontSize === mobileNativeFont, "mobile pagination changed the dialogue font size");
  await collectDialoguePages(mobile, overflowRegressionStep);
  await screenshot(mobile, "dialogue-pagination-mobile");
  await bootAt(mobile, sentenceBoundaryRegressionStep.id, {}, { reducedMotion: true });
  const mobileSentencePages = (await collectDialoguePages(mobile, sentenceBoundaryRegressionStep)).visiblePages;
  const mobileStagePage = mobileSentencePages.findIndex((pageText) => pageText.startsWith("奥のステージから"));
  assert(mobileStagePage > 0 && mobileSentencePages[mobileStagePage - 1].endsWith("風向きと発電量について話している。"), `mobile left a fragment of the next sentence on the previous page: ${JSON.stringify(mobileSentencePages)}`);
  await bootAt(mobile, dialogueSentenceRegressionStep.id, {}, { reducedMotion: true });
  const mobileDialogueSentencePages = (await collectDialoguePages(mobile, dialogueSentenceRegressionStep)).visiblePages;
  assert(mobileDialogueSentencePages.length > 1, `${dialogueSentenceRegressionStep.id}: mobile dialogue did not exercise sentence-aware pagination`);
  await bootAt(mobile, reflection.id, {}, { reducedMotion: true });
  const mobileGeometry = await mobile.evaluate(() => ({
    horizontalOverflow: document.documentElement.scrollWidth > innerWidth + 1,
    surfaceScroll: document.querySelector("#novel-reflection-surface").scrollHeight > document.querySelector("#novel-reflection-surface").clientHeight,
    count: document.querySelectorAll(".novel-reflection-grid button").length,
  }));
  assert(!mobileGeometry.horizontalOverflow && mobileGeometry.surfaceScroll && mobileGeometry.count === 36, `mobile reflection layout failed: ${JSON.stringify(mobileGeometry)}`);
  await screenshot(mobile, "choice-mobile");
  for (const stepId of productionEvidenceSteps) {
    const step = stepMap.get(stepId);
    const cue = backgroundCueData.forStep(step);
    const expectedFile = path.basename(cue.assetPath);
    await bootAt(mobile, stepId, {}, { reducedMotion: true });
    const presentation = await mobile.locator("#novel-layer").evaluate((node) => ({
      backgroundImage: getComputedStyle(node).backgroundImage,
      backgroundSize: getComputedStyle(node).backgroundSize,
      cueId: node.dataset.backgroundCue,
      horizontalOverflow: document.documentElement.scrollWidth > innerWidth + 1,
    }));
    assert(presentation.backgroundImage.includes(expectedFile), `${stepId} uses the wrong 390px production background: ${presentation.backgroundImage}`);
    assert(presentation.backgroundSize.split(",").every((value) => value.trim() === "cover") && presentation.cueId === cue.id && !presentation.horizontalOverflow, `${stepId} 390px cue presentation failed: ${JSON.stringify(presentation)}`);
    report.productionBackgrounds.push({ viewport: "390x844", stepId, cueId: cue.id, assetPath: cue.assetPath, passed: true });
    await screenshot(mobile, `production-${stepId.slice(-3)}-mobile`);
  }
  await bootAt(mobile, chat.id, {}, { reducedMotion: true });
  await advanceLinear(mobile);
  const mobileSlackGeometry = await mobile.evaluate(() => {
    const workspaceRect = document.querySelector(".novel-slack-workspace").getBoundingClientRect();
    const dialogueRect = document.querySelector("#novel-dialogue").getBoundingClientRect();
    return {
      horizontalOverflow: document.documentElement.scrollWidth > innerWidth + 1,
      workspace: { top: workspaceRect.top, right: workspaceRect.right, bottom: workspaceRect.bottom, left: workspaceRect.left },
      dialogue: { top: dialogueRect.top, right: dialogueRect.right, bottom: dialogueRect.bottom, left: dialogueRect.left },
      posts: document.querySelectorAll(".novel-slack-post").length,
    };
  });
  assert(!mobileSlackGeometry.horizontalOverflow && mobileSlackGeometry.posts === 2 && mobileSlackGeometry.workspace.bottom <= mobileSlackGeometry.dialogue.bottom, `mobile Slack overlay failed: ${JSON.stringify(mobileSlackGeometry)}`);
  await screenshot(mobile, "slack-mobile");
  const mobileGxInteraction = steps.find((step) => step.type === "interaction" && step.interaction.kind === "gx");
  await bootAt(mobile, mobileGxInteraction.id, {}, { reducedMotion: true });
  await operateInteraction(mobile, mobileGxInteraction);
  report.viewports.push({ width: 390, height: 844, passed: true });
  await context.close();

  assert(report.pageErrors.length === 0, `page errors: ${report.pageErrors.join(" | ")}`);
  assert(report.consoleErrors.length === 0, `console errors: ${report.consoleErrors.join(" | ")}`);
  assert(report.responses404.length === 0, `404 responses: ${report.responses404.join(" | ")}`);
  report.status = "passed";
} catch (error) {
  report.status = "failed";
  report.failure = error instanceof Error ? error.stack : String(error);
  throw error;
} finally {
  await context?.close().catch(() => {});
  await writeFile(path.join(outputDir, "report.json"), `${JSON.stringify(report, null, 2)}\n`, "utf8");
  await browser.close();
}

console.log(`novel browser check passed: ${report.viewports.length} viewports, ${report.interactions.length} mode interactions, ${report.visualDiffs.length} visual diffs`);
