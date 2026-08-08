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
await import(`${pathToFileURL(path.join(projectRoot, "novel-story-data.js")).href}?browser=${Date.now()}`);
const story = globalThis.GAIA_NOVEL_STORY;
const steps = story.scenes.flatMap((scene) => scene.steps);
const stepMap = new Map(steps.map((step) => [step.id, step]));
const routeUrl = new URL("/story", baseUrl).href;
const STORAGE_KEY = "gaiaSensewareNovel:progress";
const CONFIG_KEY = "gaiaSensewareNovel:config:v2";

await mkdir(outputDir, { recursive: true });
const browser = await chromium.launch({ executablePath, headless: true, args: ["--no-first-run", "--disable-background-networking"] });
const report = { baseUrl: routeUrl, screenshots: [], visualDiffs: [], interactions: [], fullWalkthrough: null, viewports: [], consoleErrors: [], pageErrors: [], responses404: [] };
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

const operateInteraction = async (page, step, { record = false } = {}) => {
  await page.locator(".novel-interaction-open").click();
  await page.locator(".story-detour-dock").waitFor({ state: "visible", timeout: 15000 });
  if (step.interaction.kind === "gx") {
    await page.locator("#gx-layer").waitFor({ state: "visible" });
    for (let index = 0; index < 3; index += 1) await page.locator(".story-detour-controls button").first().click();
  } else if (step.interaction.kind === "map03" || step.interaction.kind === "map08") {
    await page.locator("#japan-layer").waitFor({ state: "visible" });
    const count = await page.locator(".story-detour-controls button").count();
    for (let index = 0; index < count; index += 1) await page.locator(".story-detour-controls button").nth(index).click();
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

  const chat = steps.find((step) => step.id === "opening_empty_seat_004");
  await bootAt(page, chat.id);
  assert(await page.locator("#novel-dialogue").isVisible(), "Slack must float above the normal dialogue window");
  assert(await page.locator(".novel-slack-workspace").count() === 1, "Slack must be one surface");
  assert(await page.locator(".novel-slack-post").count() === 1, "Slack thread must begin with one root post");
  assert(await page.locator(".novel-slack-typing").isVisible(), "continued Slack conversation must show a typing indicator");
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
    };
  });
  assert(slackGeometry.widthRatio < 0.72 && slackGeometry.heightRatio < 0.7, `Slack overlay is still too large: ${JSON.stringify(slackGeometry)}`);
  assert(slackGeometry.sitsAboveDialogue && slackGeometry.background.startsWith("rgba("), `Slack overlay placement/translucency failed: ${JSON.stringify(slackGeometry)}`);
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

  for (const interaction of steps.filter((step) => step.type === "interaction")) await completeInteraction(page, interaction);

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
  report.viewports.push({ width: 1440, height: 900, passed: true });
  await context.close();

  context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
  const mobile = await context.newPage();
  attachDiagnostics(mobile, "mobile-390");
  await bootTitle(mobile, { clear: true });
  await checkTitleGeometry(mobile);
  await screenshot(mobile, "start-mobile");
  await bootAt(mobile, reflection.id, {}, { reducedMotion: true });
  const mobileGeometry = await mobile.evaluate(() => ({
    horizontalOverflow: document.documentElement.scrollWidth > innerWidth + 1,
    surfaceScroll: document.querySelector("#novel-reflection-surface").scrollHeight > document.querySelector("#novel-reflection-surface").clientHeight,
    count: document.querySelectorAll(".novel-reflection-grid button").length,
  }));
  assert(!mobileGeometry.horizontalOverflow && mobileGeometry.surfaceScroll && mobileGeometry.count === 36, `mobile reflection layout failed: ${JSON.stringify(mobileGeometry)}`);
  await screenshot(mobile, "choice-mobile");
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
