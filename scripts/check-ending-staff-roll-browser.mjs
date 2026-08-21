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
const outputDir = path.resolve(outputArgument || "artifacts/ending-staff-roll-browser");
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
  scans: [],
  reducedMotion: null,
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

const bootAtEnding = async (page, reducedMotion = false) => {
  await page.goto(new URL("/story", baseUrl).href, { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => Boolean(globalThis.GaiaNovel && globalThis.GAIA_NOVEL_STORY));
  await page.evaluate(({ storageKey, configKey, reduced }) => {
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
      sessionId: `ending-staff-roll-${reduced ? "reduced" : "motion"}`,
    };
    localStorage.setItem(storageKey, JSON.stringify(state));
    localStorage.setItem("gaiaSensewareNovel:manual-saves", JSON.stringify([{
      progress: state,
      savedAt: Date.now(),
      meta: { title: "Ending QA", excerpt: state.stepId },
    }]));
    localStorage.setItem(configKey, JSON.stringify({ messageSpeedPercent: 400, reducedMotion: reduced }));
    localStorage.setItem("gaia-senseware-bgm-volume", "0");
  }, { storageKey: STORAGE_KEY, configKey: CONFIG_KEY, reduced: reducedMotion });
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => Boolean(globalThis.GaiaNovel));
  await page.evaluate(() => globalThis.GaiaNovel.open());
  await page.locator("#novel-resume-button").click();
  await page.locator("#novel-save-panel").waitFor({ state: "visible", timeout: 15_000 });
  await page.locator('.novel-save-slot[data-slot-index="0"]').click();
  await page.waitForFunction(() => document.querySelector("#novel-layer")?.classList.contains("is-staff-roll"), null, { timeout: 15_000 });
};

const scanEnding = (page) => page.evaluate(() => {
  const layer = document.querySelector("#novel-layer");
  const shell = document.querySelector(".novel-staff-roll");
  const whiteout = document.querySelector(".novel-staff-roll-whiteout");
  const stage = document.querySelector(".novel-staff-roll-stage");
  const track = document.querySelector(".novel-staff-roll-track");
  const button = document.querySelector(".novel-staff-roll-finale button");
  const toolbar = document.querySelector(".novel-topbar");
  const trackStyle = getComputedStyle(track);
  const whiteoutStyle = getComputedStyle(whiteout);
  const stageStyle = getComputedStyle(stage);
  const toolbarStyle = getComputedStyle(toolbar);
  const buttonRect = button?.getBoundingClientRect();
  const trackRect = track?.getBoundingClientRect();
  const trackCenterX = trackRect ? trackRect.left + (trackRect.width / 2) : 0;
  const creditRows = [...document.querySelectorAll(".novel-staff-roll-credit")].map((row) => {
    const term = row.querySelector("dt");
    const description = row.querySelector("dd");
    const rowRect = row.getBoundingClientRect();
    const termRect = term?.getBoundingClientRect();
    const descriptionRect = description?.getBoundingClientRect();
    return {
      role: row.dataset.creditRole || "",
      textAlign: getComputedStyle(row).textAlign,
      rowCenterDelta: Math.abs((rowRect.left + (rowRect.width / 2)) - trackCenterX),
      termCenterDelta: termRect ? Math.abs((termRect.left + (termRect.width / 2)) - trackCenterX) : null,
      descriptionCenterDelta: descriptionRect ? Math.abs((descriptionRect.left + (descriptionRect.width / 2)) - trackCenterX) : null,
    };
  });
  return {
    stepId: layer?.dataset.stepId,
    phase: shell?.dataset.phase,
    text: track?.innerText || "",
    trackY: track?.getBoundingClientRect().y || 0,
    trackAnimation: trackStyle.animationName,
    trackDuration: trackStyle.animationDuration,
    whiteoutAnimation: whiteoutStyle.animationName,
    stageBackground: stageStyle.backgroundImage,
    toolbarHidden: toolbarStyle.visibility === "hidden" && Number(toolbarStyle.opacity) === 0,
    fastForwarding: layer?.classList.contains("is-fast-forwarding") ?? false,
    skipHintCount: document.querySelectorAll(".novel-staff-roll-skip-hint").length,
    buttonHidden: button?.closest(".novel-staff-roll-finale")?.hidden ?? true,
    buttonText: button?.textContent?.trim() || "",
    buttonAriaLabel: button?.getAttribute("aria-label") || "",
    buttonHeight: buttonRect?.height || 0,
    audioTrack: globalThis.GaiaOpeningAudio?.getState?.().track || "",
    overflowX: Math.max(0, document.documentElement.scrollWidth - innerWidth),
    overflowY: Math.max(0, document.documentElement.scrollHeight - innerHeight),
    bodyOverflowX: Math.max(0, document.body.scrollWidth - innerWidth),
    creditRows,
  };
});

const scanDataDestination = (page) => page.evaluate((storageKey) => {
  const layer = document.querySelector("#novel-layer");
  const intro = document.querySelector("#intro-layer");
  const stage = document.querySelector("#intro-path-stage");
  const saved = JSON.parse(localStorage.getItem(storageKey) || "{}");
  return {
    introVisible: Boolean(intro && !intro.hidden && intro.getAttribute("aria-hidden") === "false"),
    stageVisible: Boolean(stage && !stage.hidden),
    heading: stage?.querySelector(".intro-exploration-heading h3")?.textContent?.trim() || "",
    pathCount: stage?.querySelectorAll(".intro-path-card").length || 0,
    novelHidden: layer?.getAttribute("aria-hidden") === "true",
    staffRollCount: document.querySelectorAll(".novel-staff-roll").length,
    obsoleteEndCount: document.querySelectorAll(".novel-end-v6").length,
    clear: globalThis.GaiaNovel?.getState?.().clear,
    archivesUnlocked: globalThis.GaiaNovel?.getState?.().archivesUnlocked,
    savedClear: saved.clear,
    savedArchivesUnlocked: saved.archivesUnlocked,
    audioTrack: globalThis.GaiaOpeningAudio?.getState?.().track || "",
    overflowX: Math.max(0, document.documentElement.scrollWidth - innerWidth),
    overflowY: Math.max(0, document.documentElement.scrollHeight - innerHeight),
  };
}, STORAGE_KEY);

const scanTrueEndDestination = (page) => page.evaluate((storageKey) => {
  const layer = document.querySelector("#novel-layer");
  const shell = document.querySelector(".true-end-shell");
  const dialogue = document.querySelector(".true-end-dialogue");
  const saved = JSON.parse(localStorage.getItem(storageKey) || "{}");
  return {
    trueEndVisible: Boolean(shell),
    layerActive: layer?.classList.contains("is-true-end") ?? false,
    scene: shell?.dataset.scene || "",
    heading: document.querySelector(".true-end-scene-heading strong")?.textContent?.trim() || "",
    dialogueHeight: dialogue?.getBoundingClientRect().height || 0,
    clear: globalThis.GaiaNovel?.getState?.().clear,
    archivesUnlocked: globalThis.GaiaNovel?.getState?.().archivesUnlocked,
    savedClear: saved.clear,
    savedArchivesUnlocked: saved.archivesUnlocked,
    audioTrack: globalThis.GaiaOpeningAudio?.getState?.().track || "",
    overflowX: Math.max(0, document.documentElement.scrollWidth - innerWidth),
    overflowY: Math.max(0, document.documentElement.scrollHeight - innerHeight),
  };
}, STORAGE_KEY);

const browser = await chromium.launch({ headless: true, executablePath });
try {
  for (const viewport of viewports) {
    const context = await browser.newContext({ viewport, reducedMotion: "no-preference" });
    const page = await context.newPage();
    attachDiagnostics(page, viewport.name);
    const audioRuntimeResponse = await page.request.get(new URL("/opening-audio.js", baseUrl).href);
    assert.equal(audioRuntimeResponse.ok(), true, `${viewport.name}: opening-audio.js was not available`);
    assert.match(await audioRuntimeResponse.text(), /ending:\s*"\.\/assets\/audio\/after-school-afterglow\.mp3"/u, `${viewport.name}: ending is not mapped to AfterSchool Afterglow`);
    assert.match(await audioRuntimeResponse.text(), /trueend:\s*"\.\/assets\/audio\/sensory-horizon\.wav"/u, `${viewport.name}: true end is not mapped to its dedicated score`);
    await bootAtEnding(page, false);

    const initial = await scanEnding(page);
    assert.equal(initial.stepId, "welcome_chat_095");
    assert.equal(initial.phase, "whiteout", `${viewport.name}: ending did not begin with whiteout`);
    assert.equal(initial.whiteoutAnimation, "novel-staff-roll-whiteout");
    assert.equal(initial.trackAnimation, "novel-staff-roll-rise");
    assert.equal(initial.buttonHidden, true, `${viewport.name}: END action was shown before the roll`);
    assert.equal(initial.skipHintCount, 0, `${viewport.name}: obsolete staff-roll skip hint remains`);
    assert.equal(initial.toolbarHidden, true, `${viewport.name}: normal VN toolbar remained over the ending`);
    assert.match(initial.stageBackground, /event-cg-exhibition-finale-(?:v2|mobile-v1)\.png/u);
    [
      "原案・企画・制作",
      "シナリオ",
      "WEBデザイン・開発",
      "開発支援",
      "DEVELOPMENT SUPPORT",
      "OpenAI Codex",
      "キャラクターデザイン",
      "OpenAI ImageGen",
      "背景美術",
      "音楽",
      "AfterSchool Afterglow",
      "glitchyeventdj664",
      "ZEN大学『共創地球論』",
      "ZEN大学『人新世の人類学』",
      "参照データ",
      "JAXA / NASA / NOAA",
      "気象庁 ほか",
      "物語は、ここからも続いていく。",
      "© 2026 惑星の放課後 / GAIA SENSATION",
    ].forEach((text) => {
      assert(initial.text.includes(text), `${viewport.name}: missing credit ${text}`);
    });
    assert.equal(initial.text.includes("AI開発支援"), false, `${viewport.name}: obsolete AI開発支援 credit remains`);
    assert.equal(initial.text.includes("AI DEVELOPMENT SUPPORT"), false, `${viewport.name}: obsolete AI DEVELOPMENT SUPPORT credit remains`);
    assert.equal(initial.text.includes("データ提供"), false, `${viewport.name}: obsolete データ提供 credit remains`);
    assert.equal(initial.text.includes("HTML / CSS / JavaScript"), false, `${viewport.name}: implementation note remains in staff credits`);
    assert.equal(initial.creditRows.length, 9, `${viewport.name}: unexpected staff credit row count`);
    initial.creditRows.forEach((row) => {
      assert.equal(row.textAlign, "center", `${viewport.name}: ${row.role} is not center aligned`);
      assert(row.rowCenterDelta <= 1, `${viewport.name}: ${row.role} row is off center by ${row.rowCenterDelta}px`);
      assert(row.termCenterDelta <= 1, `${viewport.name}: ${row.role} label is off center by ${row.termCenterDelta}px`);
      assert(row.descriptionCenterDelta <= 1, `${viewport.name}: ${row.role} name is off center by ${row.descriptionCenterDelta}px`);
    });
    assert.equal(initial.overflowX, 0);
    assert.equal(initial.overflowY, 0);
    assert.equal(initial.bodyOverflowX, 0);

    await page.waitForTimeout(1_750);
    const whiteoutOpacity = await page.locator(".novel-staff-roll-whiteout").evaluate((node) => Number(getComputedStyle(node).opacity));
    assert(whiteoutOpacity >= 0.8, `${viewport.name}: whiteout never covered the finale (${whiteoutOpacity})`);
    await page.screenshot({ path: path.join(outputDir, `${viewport.name}-whiteout.png`) });

    await page.waitForFunction(() => globalThis.GaiaOpeningAudio?.getState?.().track === "ending", null, { timeout: 6_500 });
    const playbackBeforeToggle = await page.evaluate(() => globalThis.GaiaOpeningAudio?.getPlaybackState?.());
    if (!playbackBeforeToggle?.playing || playbackBeforeToggle.muted) {
      await page.evaluate(() => globalThis.GaiaOpeningAudio?.setVolume?.(0.1, 0));
      await page.locator("#gaia-audio-toggle").click();
      await page.waitForTimeout(120);
      const playbackAfterExpand = await page.evaluate(() => globalThis.GaiaOpeningAudio?.getPlaybackState?.());
      if (!playbackAfterExpand?.playing || playbackAfterExpand.muted) {
        await page.locator("#gaia-audio-toggle").click();
      }
    }
    await page.waitForFunction(() => {
      const playback = globalThis.GaiaOpeningAudio?.getPlaybackState?.();
      return playback?.track === "ending" && playback.playing && !playback.muted && playback.duration > 0;
    }, null, { timeout: 10_000 });
    const endingPlayback = await page.evaluate(() => globalThis.GaiaOpeningAudio.getPlaybackState());
    const endingTrack = await page.evaluate(() => globalThis.GaiaOpeningAudio.getState().track);
    await page.waitForFunction(() => document.querySelector(".novel-staff-roll")?.dataset.phase === "rolling", null, { timeout: 6_000 });
    const beforeY = await page.locator(".novel-staff-roll-track").evaluate((node) => node.getBoundingClientRect().y);
    await page.waitForTimeout(650);
    const afterY = await page.locator(".novel-staff-roll-track").evaluate((node) => node.getBoundingClientRect().y);
    assert(afterY < beforeY - 2, `${viewport.name}: credits did not move upward (${beforeY} -> ${afterY})`);
    assert(report.audioResponses.some((response) => response.label === viewport.name && response.url.endsWith("/assets/audio/after-school-afterglow.mp3") && [200, 206].includes(response.status)), `${viewport.name}: AfterSchool Afterglow was not requested`);
    assert(!report.audioResponses.some((response) => response.label === viewport.name && response.url.endsWith("/assets/audio/planet-forecast-first-light.mp3")), `${viewport.name}: previous ending track is still requested`);
    await page.screenshot({ path: path.join(outputDir, `${viewport.name}-rolling.png`) });

    await page.locator(".novel-staff-roll").focus();
    await page.keyboard.down("Control");
    await page.waitForTimeout(360);
    await page.keyboard.press("Enter");
    await page.waitForTimeout(100);
    const controlAttempt = await scanEnding(page);
    assert.equal(controlAttempt.phase, "rolling", `${viewport.name}: Control skipped the staff roll`);
    assert.equal(controlAttempt.buttonHidden, true, `${viewport.name}: Control revealed the final action`);
    assert.equal(controlAttempt.fastForwarding, false, `${viewport.name}: normal-story Control fast-forward leaked into the staff roll`);
    await page.keyboard.up("Control");

    await page.locator(".novel-staff-roll-track").evaluate((node) => {
      const animation = node.getAnimations().find((candidate) => candidate.animationName === "novel-staff-roll-rise") || node.getAnimations()[0];
      if (!animation) throw new Error("staff roll animation was not found");
      animation.pause();
      animation.currentTime = 34_000;
    });
    await page.waitForTimeout(80);
    const creditsFrame = await scanEnding(page);
    creditsFrame.creditRows.forEach((row) => {
      assert(row.rowCenterDelta <= 1, `${viewport.name}: ${row.role} shifted off center during the roll`);
    });
    await page.screenshot({ path: path.join(outputDir, `${viewport.name}-credits.png`) });
    await page.locator(".novel-staff-roll-track").evaluate((node) => {
      const animation = node.getAnimations().find((candidate) => candidate.animationName === "novel-staff-roll-rise") || node.getAnimations()[0];
      animation.currentTime = 50_000;
    });
    await page.waitForTimeout(80);
    await page.screenshot({ path: path.join(outputDir, `${viewport.name}-credits-late.png`) });

    await page.locator(".novel-staff-roll").focus();
    await page.keyboard.press("Enter");
    await page.waitForFunction(() => document.querySelector(".novel-staff-roll")?.dataset.phase === "end-hold");
    const endHold = await scanEnding(page);
    assert.equal(endHold.buttonHidden, true, `${viewport.name}: final action appeared before the END hold`);
    await page.waitForTimeout(2_650);
    const beforeFinale = await scanEnding(page);
    assert.equal(beforeFinale.phase, "end-hold", `${viewport.name}: END hold was shorter than about three seconds`);
    assert.equal(beforeFinale.buttonHidden, true, `${viewport.name}: final action appeared during the END hold`);
    await page.waitForFunction(() => document.querySelector(".novel-staff-roll")?.dataset.phase === "complete", null, { timeout: 1_000 });
    const completed = await scanEnding(page);
    assert.equal(completed.buttonHidden, false);
    assert.equal(completed.buttonText, "世界の続きを紡ぐ");
    assert.match(completed.buttonAriaLabel, /トゥルーエンド/u);
    assert(completed.buttonHeight >= 44, `${viewport.name}: END action hit area is under 44px`);
    assert.equal(completed.overflowX, 0);
    await page.screenshot({ path: path.join(outputDir, `${viewport.name}-complete.png`), animations: "disabled" });

    await page.locator(".novel-staff-roll-finale button").click();
    await page.waitForFunction(() => Boolean(document.querySelector(".true-end-shell")));
    await page.waitForFunction(() => globalThis.GaiaNovel.getState().clear === true && globalThis.GaiaNovel.getState().archivesUnlocked === true);
    await page.waitForFunction(() => globalThis.GaiaOpeningAudio?.getState?.().track === "trueend", null, { timeout: 6_500 });
    await page.waitForFunction(() => {
      const playback = globalThis.GaiaOpeningAudio?.getPlaybackState?.();
      return playback?.track === "trueend" && playback.playing && !playback.muted && playback.duration === 72;
    }, null, { timeout: 10_000 });
    const trueEndPlayback = await page.evaluate(() => globalThis.GaiaOpeningAudio.getPlaybackState());
    const trueEndDestination = await scanTrueEndDestination(page);
    assert.equal(trueEndDestination.trueEndVisible, true, `${viewport.name}: credits did not open the true ending`);
    assert.equal(trueEndDestination.layerActive, true);
    assert.equal(trueEndDestination.scene, "after-ending");
    assert.equal(trueEndDestination.heading, "エンディングの、その先");
    assert(trueEndDestination.dialogueHeight >= 44, `${viewport.name}: true-end dialogue hit area is under 44px`);
    assert.equal(trueEndDestination.clear, true);
    assert.equal(trueEndDestination.archivesUnlocked, true);
    assert.equal(trueEndDestination.savedClear, true);
    assert.equal(trueEndDestination.savedArchivesUnlocked, true);
    assert.equal(trueEndDestination.audioTrack, "trueend");
    assert.equal(trueEndDestination.overflowX, 0);
    assert.equal(trueEndDestination.overflowY, 0);
    assert(report.audioResponses.some((response) => response.label === viewport.name && response.url.endsWith("/assets/audio/sensory-horizon.wav") && [200, 206].includes(response.status)), `${viewport.name}: dedicated true-end score was not requested`);
    await page.screenshot({ path: path.join(outputDir, `${viewport.name}-true-end.png`), animations: "disabled" });
    report.scans.push({ viewport: viewport.name, initial, whiteoutOpacity, endingTrack, endingPlayback, beforeY, afterY, controlAttempt, endHold, beforeFinale, completed, trueEndPlayback, trueEndDestination, passed: true });
    await context.close();
  }

  const reducedContext = await browser.newContext({ viewport: viewports[1], reducedMotion: "reduce" });
  const reducedPage = await reducedContext.newPage();
  attachDiagnostics(reducedPage, "mobile-390-reduced");
  await bootAtEnding(reducedPage, true);
  const reduced = await scanEnding(reducedPage);
  assert.equal(reduced.phase, "complete");
  assert.equal(reduced.trackAnimation, "none");
  assert.equal(reduced.buttonHidden, false);
  assert.equal(reduced.skipHintCount, 0);
  assert.equal(reduced.buttonText, "世界の続きを紡ぐ");
  assert.match(reduced.buttonAriaLabel, /トゥルーエンド/u);
  assert(reduced.buttonHeight >= 44);
  assert.equal(reduced.overflowX, 0);
  await reducedPage.screenshot({ path: path.join(outputDir, "mobile-390-reduced.png"), animations: "disabled" });
  await reducedPage.locator(".novel-staff-roll-finale button").click();
  await reducedPage.waitForFunction(() => Boolean(document.querySelector(".true-end-shell")));
  const reducedTrueEndDestination = await scanTrueEndDestination(reducedPage);
  assert.equal(reducedTrueEndDestination.trueEndVisible, true);
  assert.equal(reducedTrueEndDestination.layerActive, true);
  assert.equal(reducedTrueEndDestination.scene, "after-ending");
  assert.equal(reducedTrueEndDestination.clear, true);
  assert.equal(reducedTrueEndDestination.savedClear, true);
  assert.equal(reducedTrueEndDestination.overflowX, 0);
  assert.equal(reducedTrueEndDestination.overflowY, 0);
  report.reducedMotion = { ...reduced, trueEndDestination: reducedTrueEndDestination, passed: true };
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

console.log(`Ending staff roll browser check passed: ${report.scans.length} animated viewports + reduced motion`);
