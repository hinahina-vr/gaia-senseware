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
const outputDir = path.resolve(outputArgument || "artifacts/novel-background-transition-order-browser");
fs.mkdirSync(outputDir, { recursive: true });

const STORAGE_KEY = "gaiaSensewareNovel:progress";
const CONFIG_KEY = "gaiaSensewareNovel:config:v4";
const cases = [
  {
    id: "normal-background",
    fromStepId: "festival_concept_009",
    toStepId: "festival_concept_010",
    fromAsset: "novel-bg-festival-b-hall-autumn-morning-v1.png",
    toAsset: "novel-bg-festival-five-plane-projection-autumn-morning-v2.png",
  },
  {
    id: "event-cg",
    fromStepId: "festival_concept_020",
    toStepId: "festival_concept_021",
    fromAsset: "event-cg-first-encounter-five-plane-v3.png",
    fromMobileAsset: "event-cg-first-encounter-five-plane-mobile-v2.png",
    toAsset: "event-cg-amane-closeup-five-plane-v4.png",
  },
];
const viewports = [
  { name: "pc-1440", width: 1440, height: 900 },
  { name: "mobile-390", width: 390, height: 844 },
];
const report = { status: "running", baseUrl, scans: [], consoleErrors: [], pageErrors: [], responses404: [] };
const browser = await chromium.launch({ headless: true, executablePath, args: ["--no-first-run", "--disable-background-networking"] });

const progressFor = (storyVersion, stepId, sceneId) => ({
  storyVersion,
  stepId,
  reachedSceneIds: [sceneId],
  viewed: {},
  evesRoute: [],
  observationOrder: "LOCAL_FIRST",
  editorialChoice: null,
  reflectionIds: [],
  resultTone: null,
  demoInterest: "太古の海",
  metCharacters: { mizuha: true, amane: true, sakuya: false },
  audio: { muted: true, volume: 0 },
  readStepIds: [stepId],
  clear: false,
  archivesUnlocked: false,
  sessionId: `background-order-${stepId}`,
});

const bootAt = async (page, stepId) => {
  await page.goto(new URL("/story", baseUrl).href, { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => Boolean(globalThis.GaiaNovel && globalThis.GAIA_NOVEL_STORY));
  const boot = await page.evaluate((id) => {
    const steps = globalThis.GAIA_NOVEL_STORY.scenes.flatMap((scene) => scene.steps);
    const step = steps.find((candidate) => candidate.id === id);
    if (!step) return null;
    return { storyVersion: globalThis.GAIA_NOVEL_STORY.storyVersion, sceneId: step.sceneId };
  }, stepId);
  assert(boot, `unknown transition start step: ${stepId}`);
  await page.evaluate(({ storageKey, configKey, progress }) => {
    localStorage.setItem(storageKey, JSON.stringify(progress));
    localStorage.setItem(configKey, JSON.stringify({ messageSpeedPercent: 400, reducedMotion: false }));
    localStorage.setItem("gaia-senseware-bgm-volume", "0");
  }, {
    storageKey: STORAGE_KEY,
    configKey: CONFIG_KEY,
    progress: progressFor(boot.storyVersion, stepId, boot.sceneId),
  });
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => Boolean(globalThis.GaiaNovel));
  await page.evaluate(() => globalThis.GaiaNovel.open());
  await page.locator("#novel-resume-button").click();
  await page.waitForFunction((id) => document.querySelector("#novel-layer")?.dataset.stepId === id, stepId);
  await page.locator("#novel-continue.is-visible").waitFor({ state: "visible", timeout: 10000 });
  await page.evaluate(() => {
    globalThis.__gaiaBackgroundOrderEvents = [];
    window.addEventListener("gaia:novel-background-transition-complete", (event) => {
      const layer = document.querySelector("#novel-layer");
      globalThis.__gaiaBackgroundOrderEvents.push({
        at: performance.now(),
        detail: event.detail,
        stepId: layer?.dataset.stepId || "",
        phase: layer?.dataset.backgroundTransitionPhase || "",
        text: document.querySelector("#novel-text")?.textContent?.trim() || "",
      });
    });
  });
};

const presentation = (page) => page.locator("#novel-layer").evaluate((layer) => {
  const dialogue = document.querySelector("#novel-dialogue");
  const speaker = document.querySelector("#novel-speaker");
  const text = document.querySelector("#novel-text");
  const marker = document.querySelector("#novel-continue");
  const dialogueStyle = getComputedStyle(dialogue);
  const speakerStyle = getComputedStyle(speaker);
  const textStyle = getComputedStyle(text);
  const markerStyle = getComputedStyle(marker);
  const visiblyPainted = (node, style) => Boolean(node?.textContent?.trim())
    && style.visibility !== "hidden"
    && Number.parseFloat(style.opacity || "1") > 0.01;
  return {
    at: performance.now(),
    stepId: layer.dataset.stepId || "",
    phase: layer.dataset.backgroundTransitionPhase || "",
    busy: layer.getAttribute("aria-busy") || "",
    transitioning: layer.classList.contains("is-background-transitioning"),
    buffered: layer.classList.contains("is-background-buffered"),
    releasing: layer.classList.contains("is-background-releasing"),
    backgroundImage: getComputedStyle(layer).backgroundImage,
    outgoingImage: getComputedStyle(layer, "::before").backgroundImage,
    outgoingOpacity: Number.parseFloat(getComputedStyle(layer, "::before").opacity),
    dialogueVisibility: dialogueStyle.visibility,
    speaker: speaker?.textContent?.trim() || "",
    text: text?.textContent?.trim() || "",
    messageVisible: visiblyPainted(text, textStyle),
    speakerVisible: visiblyPainted(speaker, speakerStyle),
    markerVisible: marker?.classList.contains("is-visible")
      && markerStyle.visibility !== "hidden"
      && Number.parseFloat(markerStyle.opacity || "1") > 0.01,
  };
});

try {
  for (const viewport of viewports) {
    const context = await browser.newContext({ viewport, reducedMotion: "no-preference" });
    const page = await context.newPage();
    page.on("console", (message) => {
      if (message.type() === "error") report.consoleErrors.push(`${viewport.name}: ${message.text()}`);
    });
    page.on("pageerror", (error) => report.pageErrors.push(`${viewport.name}: ${error.message}`));
    page.on("response", (response) => {
      if (response.status() === 404) report.responses404.push(`${viewport.name}: ${response.url()}`);
    });

    for (const transitionCase of cases) {
      await bootAt(page, transitionCase.fromStepId);
      const expectedFromAsset = viewport.name.startsWith("mobile") && transitionCase.fromMobileAsset
        ? transitionCase.fromMobileAsset
        : transitionCase.fromAsset;
      const targetText = await page.evaluate((id) => globalThis.GAIA_NOVEL_STORY.scenes
        .flatMap((scene) => scene.steps)
        .find((step) => step.id === id)?.text || "", transitionCase.toStepId);
      assert(targetText, `${transitionCase.id}: target message is empty`);
      const before = await presentation(page);
      assert(before.stepId === transitionCase.fromStepId && before.backgroundImage.includes(expectedFromAsset), `${viewport.name}/${transitionCase.id}: invalid starting frame: ${JSON.stringify(before)}`);
      assert(before.messageVisible && before.markerVisible, `${viewport.name}/${transitionCase.id}: starting message is not ready`);

      for (let pageTurn = 0; pageTurn < 4; pageTurn += 1) {
        await page.locator("#novel-dialogue").click();
        await page.waitForTimeout(90);
        if (await page.locator("#novel-layer").evaluate((layer) => layer.classList.contains("is-background-transitioning"))) break;
      }
      await page.waitForFunction(() => document.querySelector("#novel-layer")?.dataset.backgroundTransitionPhase === "releasing", null, { timeout: 10000 });
      const during = await presentation(page);
      assert(during.stepId === transitionCase.toStepId, `${viewport.name}/${transitionCase.id}: incoming background was not applied`);
      assert(during.backgroundImage.includes(transitionCase.toAsset), `${viewport.name}/${transitionCase.id}: incoming background is wrong`);
      assert(during.outgoingImage.includes(expectedFromAsset) && during.outgoingOpacity > 0, `${viewport.name}/${transitionCase.id}: outgoing background was not retained during release`);
      assert(during.transitioning && during.buffered && during.releasing && during.busy === "true", `${viewport.name}/${transitionCase.id}: transition lock is incomplete`);
      assert(during.dialogueVisibility === "hidden" && !during.messageVisible && !during.speakerVisible && !during.markerVisible, `${viewport.name}/${transitionCase.id}: story UI became visible before background release completed`);
      assert(during.text !== targetText, `${viewport.name}/${transitionCase.id}: incoming message was committed during background release`);
      await page.screenshot({ path: path.join(outputDir, `${viewport.name}-${transitionCase.id}-during.png`), animations: "allow" });

      await page.evaluate(() => {
        const dialogue = document.querySelector("#novel-dialogue");
        for (let index = 0; index < 6; index += 1) dialogue?.click();
      });
      await page.waitForFunction(() => {
        const layer = document.querySelector("#novel-layer");
        return layer?.dataset.backgroundTransitionPhase === "complete"
          && !layer.classList.contains("is-background-transitioning");
      }, null, { timeout: 10000 });
      await page.locator("#novel-continue.is-visible").waitFor({ state: "visible", timeout: 10000 });
      await page.waitForFunction((text) => {
        const rendered = document.querySelector("#novel-text")?.textContent?.trim() || "";
        return Boolean(rendered) && text.includes(rendered);
      }, targetText, { timeout: 10000 });
      const after = await presentation(page);
      const events = await page.evaluate(() => globalThis.__gaiaBackgroundOrderEvents || []);
      assert(after.stepId === transitionCase.toStepId, `${viewport.name}/${transitionCase.id}: click burst advanced more than one step`);
      assert(after.backgroundImage.includes(transitionCase.toAsset) && after.outgoingImage === "none", `${viewport.name}/${transitionCase.id}: final background state is wrong`);
      assert(!after.transitioning && !after.buffered && !after.releasing && after.busy === "", `${viewport.name}/${transitionCase.id}: transition lock was not released`);
      assert(targetText.includes(after.text) && after.messageVisible && after.markerVisible, `${viewport.name}/${transitionCase.id}: incoming message did not appear after release`);
      assert(events.length === 1 && events[0].detail.fromStepId === transitionCase.fromStepId && events[0].detail.toStepId === transitionCase.toStepId, `${viewport.name}/${transitionCase.id}: completion event order is wrong`);
      assert(events[0].at > during.at && after.at >= events[0].at, `${viewport.name}/${transitionCase.id}: message/background timestamps are out of order`);
      await page.screenshot({ path: path.join(outputDir, `${viewport.name}-${transitionCase.id}-after.png`), animations: "disabled" });
      report.scans.push({ viewport: viewport.name, case: transitionCase.id, before, during, completed: events[0], after, passed: true });
    }
    await context.close();
  }
  assert.equal(report.consoleErrors.length, 0, `console errors: ${JSON.stringify(report.consoleErrors)}`);
  assert.equal(report.pageErrors.length, 0, `page errors: ${JSON.stringify(report.pageErrors)}`);
  assert.equal(report.responses404.length, 0, `404 responses: ${JSON.stringify(report.responses404)}`);
  report.status = "passed";
} catch (error) {
  report.status = "failed";
  report.error = error.stack || String(error);
  throw error;
} finally {
  fs.writeFileSync(path.join(outputDir, "report.json"), `${JSON.stringify(report, null, 2)}\n`);
  await browser.close();
}

console.log(`Novel background transition order check passed: ${report.scans.length} PC/mobile transition scans`);
