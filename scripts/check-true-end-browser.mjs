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
const outputDir = path.resolve(outputArgument || "artifacts/true-end-browser");
fs.mkdirSync(outputDir, { recursive: true });

const STORAGE_KEY = "gaiaSensewareNovel:progress";
const CONFIG_KEY = "gaiaSensewareNovel:config:v3";
const viewports = [
  { name: "pc-1440", width: 1440, height: 900 },
  { name: "mobile-390", width: 390, height: 844 },
];
const report = {
  status: "running",
  baseUrl,
  viewports: [],
  consoleErrors: [],
  pageErrors: [],
  responses404: [],
  audioResponses: [],
};

const attachDiagnostics = (page, label) => {
  page.on("console", (message) => { if (message.type() === "error") report.consoleErrors.push(`${label}: ${message.text()}`); });
  page.on("pageerror", (error) => report.pageErrors.push(`${label}: ${error.message}`));
  page.on("response", (response) => {
    if (response.status() === 404) report.responses404.push(`${label}: ${response.url()}`);
    if (/\/assets\/audio\/.*\.(?:mp3|wav)(?:\?|$)/u.test(response.url())) {
      report.audioResponses.push({ label, status: response.status(), url: response.url() });
    }
  });
};

const bootAtTrueEnd = async (page, name) => {
  await page.goto(new URL("/story", baseUrl).href, { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => Boolean(globalThis.GaiaNovel && globalThis.GAIA_NOVEL_STORY && globalThis.GAIA_TRUE_END_STORY));
  await page.evaluate(({ storageKey, configKey, label }) => {
    const state = {
      storyVersion: globalThis.GAIA_NOVEL_STORY.storyVersion,
      stepId: "welcome_chat_095",
      reachedSceneIds: ["welcome_chat"],
      viewed: {},
      metCharacters: { mizuha: true, amane: true, sakuya: true },
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
      sessionId: `true-end-${label}`,
    };
    localStorage.setItem(storageKey, JSON.stringify(state));
    localStorage.setItem("gaiaSensewareNovel:manual-saves", JSON.stringify([{
      progress: state,
      savedAt: Date.now(),
      meta: { title: "True End QA", excerpt: state.stepId },
    }]));
    localStorage.setItem(configKey, JSON.stringify({ messageSpeedPercent: 100, reducedMotion: true }));
    localStorage.setItem("gaia-senseware-bgm-volume", "0");
  }, { storageKey: STORAGE_KEY, configKey: CONFIG_KEY, label: name });
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => Boolean(globalThis.GaiaNovel));
  await page.evaluate(() => globalThis.GaiaNovel.open());
  await page.locator("#novel-resume-button").click();
  await page.locator("#novel-save-panel").waitFor({ state: "visible", timeout: 15_000 });
  await page.locator('.novel-save-slot[data-slot-index="0"]').click();
  await page.waitForFunction(() => document.querySelector(".novel-staff-roll")?.dataset.phase === "complete", null, { timeout: 15_000 });
  await page.locator(".novel-staff-roll-finale button").click();
  await page.waitForFunction(() => Boolean(document.querySelector(".true-end-shell")), null, { timeout: 15_000 });
  await page.waitForFunction(() => globalThis.GaiaOpeningAudio?.getState?.().track === "trueend", null, { timeout: 10_000 });
};

const scanFrame = (page) => page.evaluate(() => {
  const shell = document.querySelector(".true-end-shell");
  const dialogue = document.querySelector(".true-end-dialogue");
  const message = document.querySelector(".true-end-message");
  const readout = document.querySelector(".true-end-readout");
  const louNode = document.querySelector(".true-end-lou");
  const louImage = document.querySelector(".true-end-lou-image");
  const universe = document.querySelector(".true-end-universe");
  const visibleThoughtform = [...document.querySelectorAll(".true-end-thoughtform")]
    .find((node) => Number.parseFloat(getComputedStyle(node).opacity) > 0.5);
  const rect = dialogue?.getBoundingClientRect();
  const headerRect = document.querySelector(".true-end-header")?.getBoundingClientRect();
  return {
    scene: shell?.dataset.scene || "",
    speaker: shell?.dataset.speaker || "",
    visibleThoughtform: visibleThoughtform?.dataset.speaker || "",
    title: document.querySelector(".true-end-scene-heading strong")?.textContent?.trim() || "",
    sceneCode: document.querySelector(".true-end-scene-heading span")?.textContent?.trim() || "",
    counter: document.querySelector(".true-end-footer span:last-child")?.textContent?.trim() || "",
    footerText: document.querySelector(".true-end-footer")?.textContent?.trim() || "",
    footerSpanCount: document.querySelectorAll(".true-end-footer span").length,
    message: message?.textContent || "",
    messageLang: message?.lang || "",
    speakerName: document.querySelector(".true-end-speaker")?.textContent?.trim() || "",
    speakerCode: document.querySelector(".true-end-speaker-code")?.textContent?.trim() || "",
    speakerCodeLang: document.querySelector(".true-end-speaker-code")?.lang || "",
    readoutLines: [...document.querySelectorAll(".true-end-readout code")].map((node) => node.textContent?.trim() || ""),
    messageFontSize: Number.parseFloat(getComputedStyle(message).fontSize),
    readoutVisible: Boolean(readout && !readout.hidden),
    louLoaded: Boolean(louImage?.complete && louImage.naturalWidth > 0),
    louVisible: Boolean(louNode && Number.parseFloat(getComputedStyle(louNode).opacity) > 0.5),
    universeState: universe?.dataset.webglState || "",
    universeScene: universe?.dataset.webglScene || "",
    universeFrame: Number(universe?.dataset.webglFrame || 0),
    universeSize: { width: universe?.width || 0, height: universe?.height || 0 },
    backdropCount: document.querySelectorAll(".true-end-backdrop").length,
    dialogueRect: rect ? { x: rect.x, y: rect.y, width: rect.width, height: rect.height, bottom: rect.bottom } : null,
    headerBottom: headerRect?.bottom || 0,
    audioTrack: globalThis.GaiaOpeningAudio?.getState?.().track || "",
    audioPlayback: globalThis.GaiaOpeningAudio?.getPlaybackState?.() || null,
    overflowX: Math.max(0, document.documentElement.scrollWidth - innerWidth),
    overflowY: Math.max(0, document.documentElement.scrollHeight - innerHeight),
    toolbarHidden: getComputedStyle(document.querySelector(".novel-topbar")).visibility === "hidden",
    dialogueVisible: getComputedStyle(dialogue).visibility !== "hidden",
    finaleVisible: Boolean(document.querySelector(".true-end-finale:not([hidden])")),
    logButtonVisible: Boolean(document.querySelector(".true-end-log-button")?.getClientRects().length),
    logButtonText: document.querySelector(".true-end-log-button")?.textContent?.trim() || "",
  };
});

const assertOutsideClickIgnored = async (page, label) => {
  const before = await scanFrame(page);
  const point = await page.evaluate(() => {
    const x = innerWidth * 0.5;
    const y = innerHeight * 0.38;
    const target = document.elementFromPoint(x, y);
    return {
      x,
      y,
      target: target?.className || target?.tagName || "unknown",
      outsideDialogue: !target?.closest?.(".true-end-dialogue"),
    };
  });
  assert.equal(point.outsideDialogue, true, `${label}: outside-click test point landed in the message window`);
  await page.mouse.click(point.x, point.y);
  await page.waitForTimeout(140);
  const after = await scanFrame(page);
  assert.equal(after.scene, before.scene, `${label}: outside click changed the scene`);
  assert.equal(after.counter, before.counter, `${label}: outside click advanced the counter`);
  assert.equal(after.message, before.message, `${label}: outside click changed the message`);
  assert.equal(after.finaleVisible, before.finaleVisible, `${label}: outside click opened the finale`);
  return { point, counter: before.counter, scene: before.scene };
};

const browser = await chromium.launch({
  headless: true,
  executablePath,
  args: ["--enable-webgl", "--ignore-gpu-blocklist", "--use-angle=swiftshader"],
});
try {
  const runtimeSource = await (await fetch(new URL("/opening-audio.js", baseUrl))).text();
  assert.match(runtimeSource, /story:\s*"\.\/assets\/audio\/satellite-forecast-calm\.mp3"/u);
  assert.match(runtimeSource, /ending:\s*"\.\/assets\/audio\/after-school-afterglow\.mp3"/u);
  assert.match(runtimeSource, /trueend:\s*"\.\/assets\/audio\/sensory-horizon\.wav"/u);
  const trueEndStyleSource = await (await fetch(new URL("/true-end.css", baseUrl))).text();
  assert.doesNotMatch(trueEndStyleSource, /true-end-bg-/u, "retired raster background remains in true-end.css");

  for (const viewport of viewports) {
    const context = await browser.newContext({ viewport, reducedMotion: "reduce" });
    const page = await context.newPage();
    attachDiagnostics(page, viewport.name);
    await bootAtTrueEnd(page, viewport.name);

    const story = await page.evaluate(() => ({
      title: globalThis.GAIA_TRUE_END_STORY.title,
      subtitle: globalThis.GAIA_TRUE_END_STORY.subtitle,
      language: globalThis.GAIA_TRUE_END_STORY.language,
      scenes: globalThis.GAIA_TRUE_END_STORY.scenes.map((scene) => ({
        id: scene.id,
        number: scene.number,
        title: scene.title,
        backdrop: scene.backdrop,
        steps: scene.steps.length,
        stepIds: scene.steps.map((step) => step.id),
      })),
      totalSteps: globalThis.GAIA_TRUE_END_STORY.scenes.reduce((sum, scene) => sum + scene.steps.length, 0),
    }));
    assert.equal(story.title, "Beyond");
    assert.equal(story.subtitle, "惑星の放課後 / GAIA SENSATION — Beyond");
    assert.equal(story.language.name, "SÆLIVA");
    assert.equal(story.language.japaneseName, "セイリヴァ");
    assert.equal(story.language.htmlLang, "art-x-saeliva");
    assert.equal(story.scenes.length, 9, `${viewport.name}: true end does not have nine scenes`);
    assert.deepEqual(story.scenes.map(({ number }) => number), ["01", "02", "03", "04", "05", "06", "07", "08", "09"]);
    assert.equal(story.totalSteps, 135, `${viewport.name}: total step count mismatch`);

    await page.waitForFunction(() => {
      const elements = [...document.querySelectorAll(".true-end-lou-image,.true-end-thoughtform")];
      return elements.length === 4 && elements.every((element) => element.complete && element.naturalWidth > 0);
    });
    const generatedVisuals = await page.evaluate(() => (
      [...document.querySelectorAll(".true-end-lou-image,.true-end-thoughtform")]
        .map((element) => ({
          src: element.getAttribute("src"),
          complete: element.complete,
          width: element.naturalWidth,
        }))
    ));
    assert.equal(generatedVisuals.length, 4, `${viewport.name}: generated character visuals are incomplete`);
    assert(generatedVisuals.every((visual) => visual.complete && visual.width > 0), `${viewport.name}: generated character asset failed to load`);

    const initial = await scanFrame(page);
    const seenSpeakers = new Set();
    const seenSystemPhrases = new Set();
    const validateSpeakerVisual = (frame) => {
      seenSpeakers.add(frame.speaker);
      const expectedScene = story.scenes.find(({ id }) => id === frame.scene);
      assert(expectedScene, `${viewport.name}: unknown true-end scene ${frame.scene}`);
      assert.equal(frame.universeState, "active", `${viewport.name}: WebGL universe is not active`);
      assert.equal(frame.universeScene, expectedScene.backdrop, `${viewport.name}: WebGL palette is out of sync`);
      assert(frame.universeFrame > 0, `${viewport.name}: WebGL universe did not render a frame`);
      assert(frame.universeSize.width > 0 && frame.universeSize.height > 0, `${viewport.name}: WebGL canvas has no drawable area`);
      assert.equal(frame.backdropCount, 0, `${viewport.name}: retired raster backdrop DOM remains`);
      if (["mizuha", "amane", "sakuya"].includes(frame.speaker)) {
        assert.equal(frame.visibleThoughtform, frame.speaker, `${viewport.name}: ${frame.speaker} thoughtform is not visible`);
      }
      if (frame.speaker === "lou") {
        assert.equal(frame.louVisible, true, `${viewport.name}: Lou visual is not visible`);
      }
      if (frame.speaker === "system") {
        seenSystemPhrases.add(frame.message);
        assert.equal(frame.messageLang, "art-x-saeliva", `${viewport.name}: SÆLIVA message language metadata is missing`);
        assert.equal(frame.speakerCodeLang, "art-x-saeliva", `${viewport.name}: SÆLIVA speaker-code language metadata is missing`);
      }
    };
    validateSpeakerVisual(initial);
    assert.equal(initial.scene, story.scenes[0].id);
    assert.equal(initial.title, story.scenes[0].title);
    assert.equal(initial.sceneCode, "VENA 01");
    assert.equal(initial.message, "DORA SEV·EN");
    assert.equal(initial.speakerName, "AIVA");
    assert.equal(initial.speakerCode, "KAR·MIR");
    assert.deepEqual(initial.readoutLines, ["AL MIR: KAR·EN", "THEL: 2,704,118 HARA"]);
    assert.equal(initial.audioTrack, "trueend");
    assert.equal(initial.audioPlayback.duration, 72, `${viewport.name}: dedicated score has the wrong duration`);
    assert.equal(initial.toolbarHidden, true);
    assert.equal(initial.dialogueVisible, true);
    assert.equal(initial.logButtonVisible, true);
    assert.equal(initial.logButtonText, "LOG");
    assert.equal(initial.footerSpanCount, 1);
    assert.doesNotMatch(initial.footerText, /ANTHROPOCENE/u);
    assert.equal(initial.overflowX, 0);
    assert.equal(initial.overflowY, 0);
    assert(initial.dialogueRect.height >= 44, `${viewport.name}: dialogue hit area is under 44px`);
    assert(initial.dialogueRect.x >= 0 && initial.dialogueRect.bottom <= viewport.height + 1, `${viewport.name}: dialogue is outside viewport`);
    assert(initial.messageFontSize >= (viewport.width <= 500 ? 16 : 20), `${viewport.name}: dialogue text is too small`);
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.waitForFunction((initialFrame) => (
      Number(document.querySelector(".true-end-universe")?.dataset.webglFrame || 0) > initialFrame
    ), initial.universeFrame, { timeout: 5_000 });
    const animatedFrame = await scanFrame(page);
    assert(animatedFrame.universeFrame > initial.universeFrame, `${viewport.name}: WebGL universe is not animating`);
    await page.emulateMedia({ reducedMotion: "reduce" });
    const initialOutsideGuard = await assertOutsideClickIgnored(page, `${viewport.name}: initial message`);
    await page.locator(".true-end-log-button").click();
    await page.locator("#novel-log-panel").waitFor({ state: "visible" });
    const initialBeyondLog = await page.evaluate(() => ({
      ids: globalThis.GaiaNovel.getState().readStepIds.filter((id) => id.startsWith("beyond_")),
      entries: [...document.querySelectorAll('#novel-log-content article[data-step-id^="beyond_"]')]
        .map((entry) => ({ id: entry.dataset.stepId, text: entry.querySelector(".novel-log-entry-text")?.textContent || "" })),
    }));
    assert.deepEqual(initialBeyondLog.ids, ["beyond_01_001"], `${viewport.name}: first Beyond line was not persisted`);
    assert.equal(initialBeyondLog.entries.length, 1, `${viewport.name}: first Beyond line is absent from LOG`);
    assert.equal(initialBeyondLog.entries[0].text, "DORA SEV·EN");
    await page.locator("#novel-log-close").click();
    await page.locator("#novel-log-panel").waitFor({ state: "hidden" });
    await page.screenshot({ path: path.join(outputDir, `${viewport.name}-scene-01.png`), animations: "disabled" });

    const visited = [{ scene: initial.scene, title: initial.title }];
    let absoluteStep = 1;
    for (let sceneIndex = 0; sceneIndex < story.scenes.length; sceneIndex += 1) {
      const currentScene = story.scenes[sceneIndex];
      for (let index = 0; index < currentScene.steps; index += 1) {
        const isFinalStep = absoluteStep === story.totalSteps;
        if (isFinalStep) await assertOutsideClickIgnored(page, `${viewport.name}: final message`);
        await page.locator(".true-end-dialogue").click();
        if (isFinalStep) {
          await page.waitForFunction(() => Boolean(document.querySelector(".true-end-finale:not([hidden])")));
          break;
        }
        absoluteStep += 1;
        await page.waitForFunction((expected) => document.querySelector(".true-end-footer span:last-child")?.textContent?.trim().startsWith(String(expected).padStart(3, "0")), absoluteStep);
        const nextFrame = await scanFrame(page);
        validateSpeakerVisual(nextFrame);
        if (nextFrame.scene !== visited.at(-1).scene) {
          visited.push({ scene: nextFrame.scene, title: nextFrame.title });
          if (nextFrame.scene === "electronic-civilization") {
            await page.screenshot({ path: path.join(outputDir, `${viewport.name}-scene-04.png`), animations: "disabled" });
          }
        }
      }
    }

    assert.deepEqual(visited, story.scenes.map(({ id, title }) => ({ scene: id, title })), `${viewport.name}: scene order changed`);
    for (const speaker of ["lou", "mizuha", "amane", "sakuya"]) {
      assert(seenSpeakers.has(speaker), `${viewport.name}: ${speaker} was never rendered`);
    }
    for (const phrase of ["DORA SEV·EN", "NETH·IR SÆL·ORAI", "ESHA SÆL·TIR: KAR·EN"]) {
      assert(seenSystemPhrases.has(phrase), `${viewport.name}: SÆLIVA system phrase was never rendered: ${phrase}`);
    }
    const rasterBackgroundResources = await page.evaluate(() => performance
      .getEntriesByType("resource")
      .map(({ name }) => name)
      .filter((url) => url.includes("true-end-bg-")));
    assert.deepEqual(rasterBackgroundResources, [], `${viewport.name}: retired raster background was requested`);
    const finale = await page.evaluate(() => ({
      title: document.querySelector(".true-end-finale h2")?.textContent?.trim() || "",
      text: document.querySelector(".true-end-finale")?.innerText || "",
      button: document.querySelector(".true-end-finale button")?.textContent?.trim() || "",
      completed: Boolean(localStorage.getItem("gaiaSensewareTrueEnd:complete:v1")),
      stateCompleted: globalThis.GaiaNovel?.getState?.().trueEndComplete === true,
      overflowX: Math.max(0, document.documentElement.scrollWidth - innerWidth),
      overflowY: Math.max(0, document.documentElement.scrollHeight - innerHeight),
      logButtonVisible: Boolean(document.querySelector(".true-end-log-button")?.getClientRects().length),
      readoutLang: document.querySelector(".true-end-finale div")?.lang || "",
    }));
    assert.equal(finale.title, "Beyond");
    assert(finale.text.includes("DÆM UL: ESHA·GEMA"));
    assert(finale.text.includes("IVARA KERA: K 2.700"));
    assert(finale.text.includes("SÆL·ORAI: 2,641,903 NETH"));
    assert(finale.text.includes("ESHA SÆL·TIR: KAR·EN"));
    assert(finale.text.includes("NÆI MIR: REA·AI"));
    assert.equal(finale.readoutLang, "art-x-saeliva");
    assert.equal(finale.button, "タイトルへ戻る");
    assert.equal(finale.completed, true);
    assert.equal(finale.stateCompleted, true);
    assert.equal(finale.overflowX, 0);
    assert.equal(finale.overflowY, 0);
    assert.equal(finale.logButtonVisible, true, `${viewport.name}: LOG is unavailable from the Beyond finale`);
    await page.screenshot({ path: path.join(outputDir, `${viewport.name}-finale.png`), animations: "disabled" });

    await page.locator(".true-end-log-button").click();
    await page.locator("#novel-log-panel").waitFor({ state: "visible" });
    const beyondLog = await page.evaluate(() => ({
      stateIds: globalThis.GaiaNovel.getState().readStepIds.filter((id) => id.startsWith("beyond_")),
      storedIds: (JSON.parse(localStorage.getItem("gaiaSensewareNovel:progress") || "{}").readStepIds || [])
        .filter((id) => id.startsWith("beyond_")),
      entries: [...document.querySelectorAll('#novel-log-content article[data-step-id^="beyond_"]')]
        .map((entry) => ({
          id: entry.dataset.stepId,
          meta: entry.querySelector(".novel-log-entry-meta")?.textContent || "",
          text: entry.querySelector(".novel-log-entry-text")?.textContent || "",
        })),
    }));
    const expectedBeyondIds = story.scenes.flatMap((scene) => scene.stepIds);
    assert.deepEqual(beyondLog.stateIds, expectedBeyondIds, `${viewport.name}: Beyond state LOG order/count mismatch`);
    assert.deepEqual(beyondLog.storedIds, expectedBeyondIds, `${viewport.name}: Beyond persisted LOG order/count mismatch`);
    assert.equal(beyondLog.entries.length, 135, `${viewport.name}: Beyond LOG does not contain all 135 lines`);
    assert.deepEqual(beyondLog.entries.map(({ id }) => id), expectedBeyondIds, `${viewport.name}: Beyond rendered LOG order mismatch`);
    assert.match(beyondLog.entries[0].meta, /Beyond/u);
    assert.equal(beyondLog.entries[0].text, "DORA SEV·EN");
    assert.equal(beyondLog.entries.at(-1).text, "ルウたちは新しい倫理を教わったのではない。自分たちが、どこから続いているのかを発見した。");
    await page.locator("#novel-log-close").click();
    await page.locator("#novel-log-panel").waitFor({ state: "hidden" });

    await page.locator(".true-end-finale button").click();
    await page.waitForFunction(() => !document.querySelector(".true-end-shell")
      && document.querySelector("#novel-layer")?.classList.contains("is-title")
      && document.querySelector("#novel-title-screen")
      && !document.querySelector("#novel-title-screen").hidden);
    await page.waitForFunction(() => globalThis.GaiaOpeningAudio?.getState?.().track === "story", null, { timeout: 10_000 });

    await page.evaluate(() => localStorage.removeItem("gaiaSensewareNovel:manual-saves"));
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => Boolean(globalThis.GaiaNovel));
    await page.evaluate(() => globalThis.GaiaNovel.open());
    await page.locator("#novel-resume-button").click();
    await page.waitForFunction(() => globalThis.GaiaNovel.getState().readStepIds
      .filter((id) => id.startsWith("beyond_")).length === 135);
    const restoredBeyondIds = await page.evaluate(() => globalThis.GaiaNovel.getState().readStepIds
      .filter((id) => id.startsWith("beyond_")));
    assert.deepEqual(restoredBeyondIds, expectedBeyondIds, `${viewport.name}: Beyond LOG did not survive reload`);

    report.viewports.push({
      viewport: viewport.name,
      story,
      initial,
      animatedFrame: animatedFrame.universeFrame,
      initialOutsideGuard,
      rasterBackgroundResources,
      visited,
      finale,
      beyondLog: { count: beyondLog.entries.length, first: beyondLog.entries[0].id, last: beyondLog.entries.at(-1).id },
      restoredBeyondLogCount: restoredBeyondIds.length,
      passed: true,
    });
    await context.close();
  }

  assert(report.audioResponses.some(({ url, status }) => url.endsWith("/assets/audio/sensory-horizon.wav") && [200, 206].includes(status)), "dedicated true-end score was never requested");
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

console.log(`True-end browser check passed: ${report.viewports.length} viewports / nine scenes / dedicated score`);
