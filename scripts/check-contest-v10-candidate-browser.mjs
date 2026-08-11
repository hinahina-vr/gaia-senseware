import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const [moduleRoot, executablePath, outputArgument, baseUrl = "http://127.0.0.1:4319"] = process.argv.slice(2);
if (!moduleRoot || !executablePath) throw new Error("Playwright module and browser executable are required");
const { chromium } = await import(pathToFileURL(path.join(moduleRoot, "index.mjs")));
const outputDir = path.resolve(outputArgument || "artifacts/contest-v10-candidate");
fs.mkdirSync(outputDir, { recursive: true });

const viewports = [
  { name: "pc-1440", width: 1440, height: 900 },
  { name: "mobile-390", width: 390, height: 844 },
];
const interactions = [
  { name: "map01", stepId: "map_mode01_004", nextStepId: "map_mode01_005", modal: "#japan-layer" },
  { name: "gx", stepId: "gx_experience_017", nextStepId: "gx_experience_018", modal: "#gx-layer" },
];
const welcomeCases = [
  { name: "wide", stepId: "welcome_chat_004", device: "wide", slack: true },
  { name: "physical-mizuha", stepId: "welcome_chat_055", device: "wide", slack: false, cast: "novel-character-minamo" },
  { name: "physical-amane", stepId: "welcome_chat_060", device: "wide", slack: false, cast: "novel-character-sora" },
  { name: "mobile", stepId: "welcome_chat_081", device: "mobile", slack: true },
];
const report = { status: "running", scans: [], consoleErrors: [], pageErrors: [], responses404: [] };
const browser = await chromium.launch({ headless: true, executablePath });

const stateFor = (storyVersion, stepId, extra = {}) => ({
  storyVersion,
  stepId,
  reachedSceneIds: [],
  viewed: {},
  evesRoute: [],
  observationOrder: null,
  editorialChoice: null,
  reflectionIds: [],
  resultTone: null,
  demoInterest: "気候の長期変化",
  metCharacters: { mizuha: true, amane: true, sakuya: false },
  audio: { muted: true, volume: 0.37 },
  readStepIds: [],
  clear: false,
  archivesUnlocked: false,
  sessionId: `contest-v10-${stepId}`,
  ...extra,
});

const createPage = async (viewport, label) => {
  const context = await browser.newContext({ viewport, reducedMotion: "reduce" });
  const page = await context.newPage();
  page.on("console", (message) => { if (message.type() === "error") report.consoleErrors.push(`${label}: ${message.text()}`); });
  page.on("pageerror", (error) => report.pageErrors.push(`${label}: ${error.message}`));
  page.on("response", (response) => { if (response.status() === 404) report.responses404.push(`${label}: ${response.url()}`); });
  await page.addInitScript(() => {
    globalThis.__contestVisible = (element) => {
      if (!element || element.hidden) return false;
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity || 1) > 0 && rect.width > 0 && rect.height > 0;
    };
  });
  return { context, page };
};

const bootAt = async (page, stepId, extra = {}, storyVersion = 10, expectedStepId = stepId) => {
  await page.goto(new URL("/story", baseUrl).href, { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => Boolean(globalThis.GaiaNovel && globalThis.GAIA_NOVEL_STORY));
  await page.evaluate(({ candidate, config }) => {
    localStorage.setItem("gaiaSensewareNovel:progress", JSON.stringify(candidate));
    localStorage.setItem("gaiaSensewareNovel:config:v2", JSON.stringify(config));
    localStorage.setItem("gaia-senseware-bgm-volume", String(candidate.audio.volume));
  }, {
    candidate: stateFor(storyVersion, stepId, extra),
    config: { messageSpeedPercent: 400, reducedMotion: true },
  });
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => Boolean(globalThis.GaiaNovel));
  await page.evaluate(() => globalThis.GaiaNovel.open());
  await page.locator("#novel-resume-button").click();
  await page.waitForFunction((id) => document.querySelector("#novel-layer")?.dataset.stepId === id, expectedStepId);
};

const layoutSnapshot = (page) => page.evaluate(() => ({
  overflow: document.documentElement.scrollWidth > innerWidth + 1,
  visibleCast: [...document.querySelectorAll("#novel-cast .novel-character")]
    .filter((node) => globalThis.__contestVisible(node)).map((node) => node.id),
  visibleSakuImages: [...document.querySelectorAll("img[src*='saku' i], #novel-character-sakuya")]
    .filter((node) => globalThis.__contestVisible(node)).length,
  audioCue: document.querySelector("#novel-layer")?.dataset.storyAudioCue || "",
}));

try {
  const staticContext = await browser.newContext({ viewport: viewports[0], reducedMotion: "reduce" });
  const staticPage = await staticContext.newPage();
  await staticPage.goto(new URL("/story", baseUrl).href, { waitUntil: "domcontentloaded" });
  await staticPage.waitForFunction(() => Boolean(globalThis.GAIA_NOVEL_STORY));
  const canonical = await staticPage.evaluate(() => {
    const story = globalThis.GAIA_NOVEL_STORY;
    const steps = story.scenes.flatMap((scene) => scene.steps);
    return {
      storyVersion: story.storyVersion,
      sceneIds: story.scenes.map((scene) => scene.id),
      stepCount: steps.length,
      interactions: steps.filter((step) => step.type === "interaction").map((step) => [step.id, step.interaction.kind]),
      requiredInteractions: story.requiredInteractions,
    };
  });
  assert.deepEqual(canonical, {
    storyVersion: 10,
    sceneIds: ["festival_concept", "map_mode01", "gx_experience", "esp32_pitch", "circle_invitation", "welcome_chat"],
    stepCount: 396,
    interactions: [["map_mode01_004", "map01"], ["gx_experience_017", "gx"]],
    requiredInteractions: ["map01", "gx"],
  });
  await staticContext.close();

  for (const viewport of viewports) {
    const startLabel = `${viewport.name}-festival-start`;
    const { context: startContext, page: startPage } = await createPage(viewport, startLabel);
    await startPage.goto(new URL("/story", baseUrl).href, { waitUntil: "domcontentloaded" });
    await startPage.waitForFunction(() => Boolean(globalThis.GaiaNovel));
    await startPage.evaluate(() => {
      localStorage.removeItem("gaiaSensewareNovel:progress");
      localStorage.setItem("gaiaSensewareNovel:config:v2", JSON.stringify({ messageSpeedPercent: 400, reducedMotion: true }));
      globalThis.GaiaNovel.open();
    });
    await startPage.locator("#novel-start-button").click();
    await startPage.waitForFunction(() => globalThis.GaiaNovel.getState().stepId === "festival_concept_001");
    const startScan = { stepId: await startPage.evaluate(() => globalThis.GaiaNovel.getState().stepId), ...(await layoutSnapshot(startPage)) };
    assert.equal(startScan.overflow, false);
    report.scans.push({ viewport, case: "festival-start", ...startScan, passed: true });
    await startPage.screenshot({ path: path.join(outputDir, `${startLabel}.png`) });
    await startContext.close();

    const migrationLabel = `${viewport.name}-v9-save`;
    const { context: migrationContext, page: migrationPage } = await createPage(viewport, migrationLabel);
    await bootAt(migrationPage, "current_exhibition_001", {
      unknownFuturePayload: { nested: "keep", count: 7 },
      unknownScalar: "keep",
    }, 9, "festival_concept_001");
    const migrated = await migrationPage.evaluate(() => globalThis.GaiaNovel.getState());
    assert.equal(migrated.stepId, "festival_concept_001");
    assert.deepEqual(migrated.audio, { muted: true, volume: 0.37 });
    assert.deepEqual(migrated.unknownFuturePayload, { nested: "keep", count: 7 });
    assert.equal(migrated.unknownScalar, "keep");
    report.scans.push({ viewport, case: "v9-save", stepId: migrated.stepId, audio: migrated.audio, unknownPreserved: true, passed: true });
    await migrationContext.close();

    for (const testCase of interactions) {
      const label = `${viewport.name}-${testCase.name}`;
      const { context, page } = await createPage(viewport, label);
      await bootAt(page, testCase.stepId);
      const prep = await page.evaluate((modal) => ({
        lifecycle: document.body.dataset.novelInteractionState,
        promptVisible: globalThis.__contestVisible(document.querySelector(".novel-interaction-open")),
        modalVisible: globalThis.__contestVisible(document.querySelector(modal)),
      }), testCase.modal);
      assert.deepEqual(prep, { lifecycle: "prep", promptVisible: true, modalVisible: false });
      await page.locator(".novel-interaction-open").click();
      await page.waitForFunction((modal) => document.body.dataset.novelInteractionState === "open" && globalThis.__contestVisible(document.querySelector(modal)), testCase.modal);
      const open = await page.evaluate((modal) => ({
        storyHidden: document.querySelector("#novel-layer")?.hidden,
        storyInert: document.querySelector("#novel-layer")?.inert,
        modalVisible: globalThis.__contestVisible(document.querySelector(modal)),
        castVisible: globalThis.__contestVisible(document.querySelector("#novel-cast")),
        dialogueVisible: globalThis.__contestVisible(document.querySelector("#novel-dialogue")),
        navVisible: globalThis.__contestVisible(document.querySelector("#novel-topbar-actions")),
        overflow: document.documentElement.scrollWidth > innerWidth + 1,
      }), testCase.modal);
      assert.equal(open.storyHidden, true);
      assert.equal(open.storyInert, true);
      assert.equal(open.modalVisible, true);
      assert.equal(open.castVisible, false);
      assert.equal(open.dialogueVisible, false);
      assert.equal(open.navVisible, false);
      assert.equal(open.overflow, false);
      await page.screenshot({ path: path.join(outputDir, `${label}-open.png`) });

      if (testCase.name === "map01") {
        const timeInput = page.locator("#japan-layer [data-signal-time]").first();
        await timeInput.fill("73");
        await timeInput.dispatchEvent("input");
        await page.locator("#japan-map").press("Enter");
      } else {
        for (let index = 0; index < 3; index += 1) {
          await page.getByRole("button", { name: "段階表示を進める", exact: true }).click();
        }
      }
      const returnButton = page.locator("#story-detour-return");
      assert.equal(await returnButton.isEnabled(), true);
      await returnButton.click();
      await page.waitForFunction((id) => globalThis.GaiaNovel.getState().stepId === id, testCase.nextStepId);
      await page.waitForFunction((modal) => !globalThis.__contestVisible(document.querySelector(modal)), testCase.modal);
      const closed = await page.evaluate((modal) => ({
        lifecycle: document.body.dataset.novelInteractionState || "idle",
        stepId: globalThis.GaiaNovel.getState().stepId,
        modalVisible: globalThis.__contestVisible(document.querySelector(modal)),
        promptVisible: globalThis.__contestVisible(document.querySelector(".novel-interaction-open")),
        overflow: document.documentElement.scrollWidth > innerWidth + 1,
      }), testCase.modal);
      assert.equal(closed.lifecycle, "idle");
      assert.equal(closed.stepId, testCase.nextStepId);
      assert.equal(closed.modalVisible, false);
      assert.equal(closed.promptVisible, false);
      assert.equal(closed.overflow, false);
      report.scans.push({ viewport, case: testCase.name, prep, open, closed, passed: true });
      await page.screenshot({ path: path.join(outputDir, `${label}-closed.png`) });
      await context.close();
    }

    for (const testCase of welcomeCases) {
      const label = `${viewport.name}-welcome-${testCase.name}`;
      const { context, page } = await createPage(viewport, label);
      await bootAt(page, testCase.stepId);
      const scan = await page.evaluate(() => ({
        stepId: globalThis.GaiaNovel.getState().stepId,
        slack: document.querySelector("#novel-layer")?.classList.contains("is-slack"),
        slackDevice: document.querySelector(".novel-slack-workspace")?.dataset.device || "",
        visibleCast: [...document.querySelectorAll("#novel-cast .novel-character")]
          .filter((node) => globalThis.__contestVisible(node)).map((node) => node.id),
        visibleSakuImages: [...document.querySelectorAll("img[src*='saku' i], #novel-character-sakuya")]
          .filter((node) => globalThis.__contestVisible(node)).length,
        audioCue: document.querySelector("#novel-layer")?.dataset.storyAudioCue || "",
        overflow: document.documentElement.scrollWidth > innerWidth + 1,
      }));
      assert.equal(scan.slack, testCase.slack);
      if (testCase.slack) assert.equal(scan.slackDevice, testCase.device);
      if (testCase.cast) {
        assert.deepEqual(scan.visibleCast, [testCase.cast]);
      } else {
        assert.equal(scan.visibleCast.length, 0);
      }
      assert.equal(scan.visibleSakuImages, 0);
      assert(!scan.audioCue || scan.audioCue === "none");
      assert.equal(scan.overflow, false);
      report.scans.push({ viewport, case: `welcome-${testCase.name}`, ...scan, passed: true });
      await page.screenshot({ path: path.join(outputDir, `${label}.png`) });
      await context.close();
    }

    const endLabel = `${viewport.name}-end`;
    const { context: endContext, page: endPage } = await createPage(viewport, endLabel);
    await bootAt(endPage, "welcome_chat_095");
    for (let attempt = 0; attempt < 4 && await endPage.locator(".novel-end-v6").count() === 0; attempt += 1) {
      await endPage.locator("#novel-dialogue").click({ position: { x: 20, y: 20 } });
      await endPage.waitForTimeout(80);
    }
    assert.equal(await endPage.locator(".novel-end-v6").count(), 1, `${endLabel}: END was not reached`);
    const endScan = { ...(await layoutSnapshot(endPage)), clear: await endPage.evaluate(() => globalThis.GaiaNovel.getState().clear) };
    assert.equal(endScan.clear, true);
    assert.equal(endScan.overflow, false);
    report.scans.push({ viewport, case: "end", ...endScan, passed: true });
    await endPage.screenshot({ path: path.join(outputDir, `${endLabel}.png`) });
    await endContext.close();
  }

  assert.equal(report.consoleErrors.length, 0);
  assert.equal(report.pageErrors.length, 0);
  assert.equal(report.responses404.length, 0);
  report.status = "passed";
} catch (error) {
  report.status = "failed";
  report.error = error.stack || String(error);
  throw error;
} finally {
  fs.writeFileSync(path.join(outputDir, "report.json"), `${JSON.stringify(report, null, 2)}\n`);
  await browser.close();
}

console.log("contest v10 candidate browser check passed");
