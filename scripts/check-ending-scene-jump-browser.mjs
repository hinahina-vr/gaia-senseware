import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const [moduleArgument, executableArgument, outputArgument, baseUrlArgument] = process.argv.slice(2);
const moduleRoot = process.env.GAIA_PLAYWRIGHT_PATH || moduleArgument;
const executablePath = process.env.GAIA_BROWSER_EXECUTABLE || executableArgument;
const outputDir = path.resolve(process.env.GAIA_BROWSER_ARTIFACTS || outputArgument || "artifacts/ending-scene-jump");
const baseUrl = process.env.GAIA_BASE_URL || baseUrlArgument || "http://127.0.0.1:4173";
if (!moduleRoot || !executablePath) throw new Error("GAIA_PLAYWRIGHT_PATH and GAIA_BROWSER_EXECUTABLE are required");

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
delete globalThis.GAIA_NOVEL_STORY;
await import(`${pathToFileURL(path.join(projectRoot, "novel-story-data.js")).href}?ending-jump=${Date.now()}`);
const story = globalThis.GAIA_NOVEL_STORY;
const steps = story.scenes.flatMap((scene) => scene.steps);
const stepIndex = new Map(steps.map((step, index) => [step.id, index + 1]));
const endingStepId = "welcome_chat_095";
const endingScriptIndex = stepIndex.get(endingStepId);
const normalStep = story.scenes[0].steps.find((step) => ["dialogue", "narration", "chat", "record", "ui"].includes(step.type));
assert(normalStep, "normal story step is unavailable");
assert.equal(endingScriptIndex, steps.length, "ending must remain the final canonical script step");

const playwrightEntry = fs.existsSync(path.join(moduleRoot, "index.mjs"))
  ? path.join(moduleRoot, "index.mjs")
  : path.join(moduleRoot, "playwright", "index.mjs");
const { chromium } = await import(pathToFileURL(playwrightEntry).href);
const routeUrl = new URL("/story", baseUrl).href;
const storageKey = "gaiaSensewareNovel:progress";
const configKey = "gaiaSensewareNovel:config:v3";
const viewports = [
  { name: "pc-1440", width: 1440, height: 900 },
  { name: "mobile-390", width: 390, height: 844 },
];
const diagnostics = { consoleErrors: [], pageErrors: [], responses404: [] };
const report = { status: "running", baseUrl, storySteps: steps.length, canonicalScenes: story.scenes.length, scans: [], ...diagnostics };
fs.mkdirSync(outputDir, { recursive: true });

const progressAt = (stepId) => ({
  storyVersion: story.storyVersion,
  stepId,
  reachedSceneIds: [story.scenes[0].id],
  viewed: {},
  metCharacters: { mizuha: true, amane: true, sakuya: false },
  evesRoute: [],
  observationOrder: "LOCAL_FIRST",
  editorialChoice: null,
  reflectionIds: [],
  resultTone: null,
  demoInterest: "太古の海",
  audio: { muted: true, volume: 0 },
  readStepIds: [],
  clear: false,
  archivesUnlocked: false,
  sessionId: "ending-scene-jump-browser",
});

const attachDiagnostics = (page, label) => {
  page.on("console", (message) => { if (message.type() === "error") diagnostics.consoleErrors.push(`${label}: ${message.text()}`); });
  page.on("pageerror", (error) => diagnostics.pageErrors.push(`${label}: ${error.message}`));
  page.on("response", (response) => { if (response.status() === 404) diagnostics.responses404.push(`${label}: ${response.url()}`); });
};

const bootAt = async (page, stepId) => {
  await page.goto(routeUrl, { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => Boolean(globalThis.GaiaNovel && globalThis.GAIA_NOVEL_STORY), null, { timeout: 15_000 });
  await page.evaluate(({ progressKey, settingsKey, progress }) => {
    localStorage.setItem(progressKey, JSON.stringify(progress));
    localStorage.setItem("gaiaSensewareNovel:manual-saves", JSON.stringify([{
      progress,
      savedAt: Date.now(),
      meta: { title: "Ending Jump QA", excerpt: progress.stepId },
    }]));
    localStorage.setItem(settingsKey, JSON.stringify({ messageSpeedPercent: 400, reducedMotion: true }));
    localStorage.setItem("gaia-senseware-bgm-volume", "0");
    globalThis.GaiaNovel.open();
  }, { progressKey: storageKey, settingsKey: configKey, progress: progressAt(stepId) });
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => Boolean(globalThis.GaiaNovel), null, { timeout: 15_000 });
  await page.locator("#novel-resume-button").click();
  await page.locator("#novel-save-panel").waitFor({ state: "visible", timeout: 15_000 });
  await page.locator('.novel-save-slot[data-slot-index="0"]').click();
  await page.waitForFunction((id) => document.querySelector("#novel-layer")?.dataset.stepId === id, stepId, { timeout: 15_000 });
  await page.locator("#novel-jump-button").waitFor({ state: "visible", timeout: 15_000 });
};

const browser = await chromium.launch({ headless: true, executablePath });
try {
  for (const viewport of viewports) {
    const context = await browser.newContext({ viewport, reducedMotion: "reduce" });
    const page = await context.newPage();
    attachDiagnostics(page, viewport.name);
    await bootAt(page, normalStep.id);
    const storedBeforeJump = await page.evaluate((key) => localStorage.getItem(key), storageKey);

    await page.locator("#novel-jump-button").click();
    const jumpItems = await page.locator("button.novel-jump-item[data-scene-id]").evaluateAll((items) => items.map((item) => ({
      id: item.dataset.sceneId,
      text: item.innerText,
      current: item.getAttribute("aria-current"),
    })));
    assert.equal(jumpItems.length, story.scenes.length + 1, `${viewport.name}: ending entry count`);
    assert.deepEqual(jumpItems.slice(0, -1).map((item) => item.id), story.scenes.map((scene) => scene.id), `${viewport.name}: canonical scene order changed`);
    assert.equal(jumpItems.at(-1).id, "ending", `${viewport.name}: ending entry is not last`);
    assert.match(jumpItems.at(-1).text, /07\s*\/\s*ENDING/u, `${viewport.name}: ending chapter label`);
    assert.match(jumpItems.at(-1).text, /エンディング/u, `${viewport.name}: ending title`);
    assert.match(jumpItems.at(-1).text, /SCRIPT #0396/u, `${viewport.name}: ending script label`);
    assert.equal(jumpItems.filter((item) => item.current === "true").length, 1, `${viewport.name}: current scene marker count`);

    const endingButton = page.locator('button.novel-jump-item[data-scene-id="ending"]');
    await endingButton.scrollIntoViewIfNeeded();
    const menuScan = await page.evaluate(() => {
      const panel = document.querySelector("#novel-jump-panel");
      const list = document.querySelector("#novel-jump-list");
      const ending = document.querySelector('button.novel-jump-item[data-scene-id="ending"]');
      const panelRect = panel?.getBoundingClientRect();
      const listRect = list?.getBoundingClientRect();
      const endingRect = ending?.getBoundingClientRect();
      return {
        panelHidden: panel?.hidden,
        panelInsideViewport: panelRect ? panelRect.left >= -1 && panelRect.right <= innerWidth + 1 && panelRect.top >= -1 && panelRect.bottom <= innerHeight + 1 : false,
        endingInsideList: listRect && endingRect ? endingRect.top >= listRect.top - 1 && endingRect.bottom <= listRect.bottom + 1 : false,
        endingHeight: endingRect?.height || 0,
        listScrollable: list ? list.scrollHeight > list.clientHeight : false,
        overflowX: Math.max(0, document.documentElement.scrollWidth - innerWidth),
        overflowY: Math.max(0, document.documentElement.scrollHeight - innerHeight),
      };
    });
    assert.equal(menuScan.panelHidden, false, `${viewport.name}: jump panel closed unexpectedly`);
    assert.equal(menuScan.panelInsideViewport, true, `${viewport.name}: jump panel left viewport`);
    assert.equal(menuScan.endingInsideList, true, `${viewport.name}: ending entry is clipped`);
    assert(menuScan.endingHeight >= 44, `${viewport.name}: ending hit area is under 44px`);
    assert.equal(menuScan.overflowX, 0, `${viewport.name}: horizontal page overflow`);
    assert.equal(menuScan.overflowY, 0, `${viewport.name}: vertical page overflow`);
    await page.screenshot({ path: path.join(outputDir, `${viewport.name}-menu.png`), animations: "disabled" });

    await endingButton.click();
    await page.waitForFunction((id) => document.querySelector("#novel-layer")?.classList.contains("is-staff-roll")
      && document.querySelector("#novel-layer")?.dataset.stepId === id, endingStepId, { timeout: 15_000 });
    const endingScan = await page.evaluate(() => {
      const layer = document.querySelector("#novel-layer");
      const toolbarStyle = getComputedStyle(document.querySelector(".novel-topbar"));
      const finaleButton = document.querySelector(".novel-staff-roll-finale button");
      const finaleRect = finaleButton?.getBoundingClientRect();
      return {
        stepId: layer?.dataset.stepId,
        stepType: layer?.dataset.stepType,
        sceneId: layer?.dataset.sceneId,
        staffRoll: layer?.classList.contains("is-staff-roll"),
        staffRollPhase: document.querySelector(".novel-staff-roll")?.dataset.phase,
        jumpHidden: document.querySelector("#novel-jump-panel")?.hidden,
        separatorVisible: Boolean(document.querySelector('.novel-chapter-card:not([hidden])')),
        toolbarHidden: toolbarStyle.visibility === "hidden" && Number(toolbarStyle.opacity) === 0,
        currentScript: document.querySelector("#novel-script-debug-number")?.textContent,
        finaleHeight: finaleRect?.height || 0,
        reachedSceneIds: globalThis.GaiaNovel?.getState?.().reachedSceneIds || [],
        clear: globalThis.GaiaNovel?.getState?.().clear,
        overflowX: Math.max(0, document.documentElement.scrollWidth - innerWidth),
        overflowY: Math.max(0, document.documentElement.scrollHeight - innerHeight),
      };
    });
    assert.equal(endingScan.stepId, endingStepId, `${viewport.name}: ending target step`);
    assert.notEqual(endingScan.stepType, "section-separator", `${viewport.name}: scene separator interrupted ending`);
    assert.equal(endingScan.staffRoll, true, `${viewport.name}: staff roll did not render`);
    assert.equal(endingScan.staffRollPhase, "complete", `${viewport.name}: reduced-motion ending did not complete`);
    assert.equal(endingScan.jumpHidden, true, `${viewport.name}: jump panel remained over ending`);
    assert.equal(endingScan.separatorVisible, false, `${viewport.name}: chapter card remained over ending`);
    assert.equal(endingScan.toolbarHidden, true, `${viewport.name}: normal toolbar remained over ending`);
    assert.equal(endingScan.currentScript, String(endingScriptIndex).padStart(4, "0"), `${viewport.name}: ending script number`);
    assert(endingScan.finaleHeight >= 44, `${viewport.name}: ending action hit area is under 44px`);
    assert.equal(endingScan.reachedSceneIds.includes("ending"), false, `${viewport.name}: pseudo ending polluted canonical scene state`);
    assert.equal(endingScan.clear, false, `${viewport.name}: jump marked story clear before ending action`);
    assert.equal(endingScan.overflowX, 0, `${viewport.name}: ending horizontal overflow`);
    assert.equal(endingScan.overflowY, 0, `${viewport.name}: ending vertical overflow`);
    assert.equal(await page.evaluate((key) => localStorage.getItem(key), storageKey), storedBeforeJump, `${viewport.name}: ending jump mutated autosave`);
    await page.screenshot({ path: path.join(outputDir, `${viewport.name}-ending.png`), animations: "disabled" });

    report.scans.push({ viewport, menu: menuScan, ending: endingScan, passed: true });
    await context.close();
  }
  assert.equal(diagnostics.consoleErrors.length, 0, `console errors: ${diagnostics.consoleErrors.join("\n")}`);
  assert.equal(diagnostics.pageErrors.length, 0, `page errors: ${diagnostics.pageErrors.join("\n")}`);
  assert.equal(diagnostics.responses404.length, 0, `404 responses: ${diagnostics.responses404.join("\n")}`);
  report.status = "passed";
} catch (error) {
  report.status = "failed";
  report.error = error.stack || String(error);
  throw error;
} finally {
  fs.writeFileSync(path.join(outputDir, "report.json"), `${JSON.stringify(report, null, 2)}\n`);
  await browser.close();
}

console.log(`ending scene jump browser check passed: ${report.scans.length} viewports, ${report.storySteps} canonical steps`);
