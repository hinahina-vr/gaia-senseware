import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const [moduleRoot, executablePath, outputArgument, baseUrl = "http://127.0.0.1:4173"] = process.argv.slice(2);
const extraArguments = process.argv.slice(6);
const separatorOnly = extraArguments.includes("--separator-only");
const pcOnly = extraArguments.includes("--pc-only");
const mobileOnly = extraArguments.includes("--mobile-only");
const presenceOnly = extraArguments.includes("--presence-only");
const productionSmoke = extraArguments.includes("--production-smoke");
const pageBreakOnly = extraArguments.includes("--page-break-only");
if (!moduleRoot || !executablePath) throw new Error("Playwright module root and browser executable are required");
const playwrightEntry = fs.existsSync(path.join(moduleRoot, "index.mjs"))
  ? path.join(moduleRoot, "index.mjs")
  : path.join(moduleRoot, "playwright", "index.mjs");
const { chromium } = await import(pathToFileURL(playwrightEntry).href);
const outputDir = path.resolve(outputArgument || "artifacts/true-end-browser");
fs.mkdirSync(outputDir, { recursive: true });

const STORAGE_KEY = "gaiaSensewareNovel:progress";
const CONFIG_KEY = "gaiaSensewareNovel:config:v4";
const OPENING_MESSAGE = "DORA SEV·EN――二百七十万年の沈黙を越え、休眠記憶を再結合。観測者たちよ、目を覚まして。";
const FINAL_MESSAGE = "ルウは基板を抱き、星々へ問う。『次はどこを感じたい？』返事が灯る。放課後は終わらない。";
const viewports = [
  { name: "pc-1440", width: 1440, height: 900 },
  { name: "mobile-390", width: 390, height: 844 },
].filter(({ name }) => (!pcOnly || name === "pc-1440") && (!mobileOnly || name === "mobile-390"));
const report = {
  status: "running",
  baseUrl,
  viewports: [],
  consoleErrors: [],
  pageErrors: [],
  responses404: [],
  audioResponses: [],
  presenceFades: [],
};

const attachDiagnostics = (page, label) => {
  page.on("console", (message) => {
    if (message.type() !== "error") return;
    const location = message.location();
    const source = location.url ? ` (${location.url}:${location.lineNumber}:${location.columnNumber})` : "";
    report.consoleErrors.push(`${label}: ${message.text()}${source}`);
  });
  page.on("pageerror", (error) => report.pageErrors.push(`${label}: ${error.message}`));
  page.on("response", (response) => {
    if (response.status() === 404) report.responses404.push(`${label}: ${response.url()}`);
    if (/\/assets\/audio\/.*\.(?:mp3|wav)(?:\?|$)/u.test(response.url())) {
      report.audioResponses.push({ label, status: response.status(), url: response.url() });
    }
  });
};

const bootAtTrueEnd = async (page, name, reducedMotion = true) => {
  await page.goto(new URL("/", baseUrl).href, { waitUntil: "domcontentloaded", timeout: 90_000 });
  await page.waitForFunction(() => Boolean(globalThis.GaiaNovel && globalThis.GAIA_NOVEL_STORY && globalThis.GAIA_TRUE_END_STORY));
  await page.waitForFunction(() => {
    const resources = performance.getEntriesByType("resource").map(({ name }) => name);
    return resources.some((name) => name.includes("/data/gaia-signals.json"))
      && resources.some((name) => name.includes("/data/natural-earth-50m-land.geojson"));
  }, null, { timeout: 30_000 });
  await page.evaluate(({ storageKey, configKey, label, reducedMotion: motionPreference }) => {
    localStorage.clear();
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
    localStorage.setItem(configKey, JSON.stringify({ messageSpeedPercent: 100, reducedMotion: motionPreference }));
    localStorage.setItem("gaia-senseware-bgm-volume", "0");
    localStorage.removeItem("gaiaSensewareTrueEnd:reached:v1");
    localStorage.removeItem("gaiaSensewareTrueEnd:complete:v1");
  }, { storageKey: STORAGE_KEY, configKey: CONFIG_KEY, label: name, reducedMotion });
  await page.goto(new URL("/story", baseUrl).href, { waitUntil: "domcontentloaded", timeout: 90_000 });
  await page.waitForFunction(() => Boolean(globalThis.GaiaNovel));
  await page.waitForFunction(() => document.querySelector(".novel-staff-roll")?.dataset.phase === "complete", null, { timeout: 15_000 });
  await page.locator(".novel-staff-roll-finale button").click();
  await page.waitForFunction(() => Boolean(document.querySelector(".true-end-shell")), null, { timeout: 15_000 });
  await page.waitForFunction(() => globalThis.GaiaOpeningAudio?.getState?.().track === "trueend", null, { timeout: 10_000 });
  await page.waitForFunction(() => {
    const shell = document.querySelector(".true-end-shell");
    return shell && !shell.classList.contains("is-scene-separating")
      && Boolean(document.querySelector(".true-end-message")?.textContent);
  }, null, { timeout: 8_000 });
  await page.waitForFunction(() => globalThis.GaiaTrueEnd?.isReached?.() === true);
};

const scanFrame = (page) => page.evaluate(() => {
  const shell = document.querySelector(".true-end-shell");
  const dialogue = document.querySelector(".true-end-dialogue");
  const message = document.querySelector(".true-end-message");
  const readout = document.querySelector(".true-end-readout");
  const interfaceLayer = document.querySelector(".true-end-interface");
  const universe = document.querySelector(".true-end-universe");
  const sceneCard = document.querySelector(".true-end-scene-card");
  const sceneCardContent = document.querySelector(".true-end-scene-card-content");
  const audioDock = document.querySelector(".gaia-audio-dock");
  const rect = dialogue?.getBoundingClientRect();
  const mainDialogueReference = document.createElement("div");
  mainDialogueReference.style.cssText = "position:absolute;visibility:hidden;pointer-events:none;width:var(--novel-say-width);height:var(--novel-say-height)";
  shell?.append(mainDialogueReference);
  const mainDialogueRect = mainDialogueReference.getBoundingClientRect();
  mainDialogueReference.remove();
  const messageRect = message?.getBoundingClientRect();
  const dialogueStyle = dialogue ? getComputedStyle(dialogue) : null;
  const messageStyle = message ? getComputedStyle(message) : null;
  const headerRect = document.querySelector(".true-end-header")?.getBoundingClientRect();
  const readoutRect = readout?.getBoundingClientRect();
  const messageRange = document.createRange();
  if (message) messageRange.selectNodeContents(message);
  const messageLineTops = [...messageRange.getClientRects()]
    .filter((candidate) => candidate.width > 0 && candidate.height > 0)
    .map((candidate) => Math.round(candidate.top * 2) / 2);
  return {
    sampledAt: performance.now(),
    documentHidden: document.hidden,
    scene: shell?.dataset.scene || "",
    stepId: shell?.dataset.step || "",
    shoreImage: shell?.dataset.shoreImage || "",
    speaker: shell?.dataset.speaker || "",
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
    readoutHeader: document.querySelector(".true-end-readout-signal")?.textContent?.trim() || "",
    readoutCount: document.querySelector(".true-end-readout-count")?.textContent?.trim() || "",
    readoutRowCount: document.querySelectorAll(".true-end-readout-row").length,
    readoutLines: [...document.querySelectorAll(".true-end-readout code")].map((node) => node.textContent?.trim() || ""),
    messageFontSize: Number.parseFloat(getComputedStyle(message).fontSize),
    messageLineCount: new Set(messageLineTops).size,
    messageClientHeight: message?.clientHeight || 0,
    messageScrollHeight: message?.scrollHeight || 0,
    messagePage: shell?.dataset.messagePage || "",
    shellUserSelect: getComputedStyle(shell).userSelect,
    readoutVisible: Boolean(readout && !readout.hidden),
    readoutRect: readoutRect ? { x: readoutRect.x, y: readoutRect.y, width: readoutRect.width, height: readoutRect.height, right: readoutRect.right } : null,
    universeState: universe?.dataset.webglState || "",
    universeScene: universe?.dataset.webglScene || "",
    universeSpeaker: universe?.dataset.webglSpeaker || "",
    universeManifestation: universe?.dataset.webglManifestation || "",
    universeSignal: Number(universe?.dataset.webglSignal || 0),
    universeEmphasis: universe?.dataset.webglEmphasis || "",
    universePresenceMix: Number(universe?.dataset.webglPresenceMix || 0),
    universePresenceState: universe?.dataset.webglPresenceState || "",
    universePresenceDuration: Number(universe?.dataset.webglPresenceDuration || 0),
    universePresenceCompletedAt: Number(universe?.dataset.webglPresenceCompletedAt || 0),
    messageCommittedAt: Number(shell?.dataset.messageCommittedAt || 0),
    sectionTransitionCompletedAt: Number(shell?.dataset.sectionTransitionCompletedAt || 0),
    universeFrame: Number(universe?.dataset.webglFrame || 0),
    universeSize: { width: universe?.width || 0, height: universe?.height || 0 },
    universeOpacity: universe ? Number.parseFloat(getComputedStyle(universe).opacity) : 0,
    universeBlendMode: universe ? getComputedStyle(universe).mixBlendMode : "",
    universeZIndex: universe ? Number.parseInt(getComputedStyle(universe).zIndex, 10) : 0,
    characterImageCount: document.querySelectorAll(".true-end-shell img").length,
    backdropCount: document.querySelectorAll(".true-end-backdrop").length,
    dialogueRect: rect ? { x: rect.x, y: rect.y, width: rect.width, height: rect.height, bottom: rect.bottom } : null,
    mainDialogueRect: mainDialogueRect ? {
      x: mainDialogueRect.x,
      y: mainDialogueRect.y,
      width: mainDialogueRect.width,
      height: mainDialogueRect.height,
      bottom: mainDialogueRect.bottom,
    } : null,
    dialogueBorderWidth: dialogueStyle ? Number.parseFloat(dialogueStyle.borderTopWidth) : null,
    dialogueBackground: dialogueStyle?.backgroundImage || "",
    dialogueGlowBackground: dialogue ? getComputedStyle(dialogue, "::after").backgroundImage : "",
    messageTopOffset: rect && messageRect && dialogueStyle
      ? messageRect.top - (rect.top + Number.parseFloat(dialogueStyle.paddingTop))
      : null,
    messageLayoutDebug: {
      dialoguePaddingTop: dialogueStyle?.paddingTop || "",
      dialogueLineHeight: dialogueStyle?.lineHeight || "",
      dialogueFontSize: dialogueStyle?.fontSize || "",
      messageTop: messageStyle?.top || "",
      messageMarginTop: messageStyle?.marginTop || "",
      messageLineHeight: messageStyle?.lineHeight || "",
      messagePosition: messageStyle?.position || "",
      messageTransform: messageStyle?.transform || "",
    },
    headerBottom: headerRect?.bottom || 0,
    audioTrack: globalThis.GaiaOpeningAudio?.getState?.().track || "",
    titleUnlocked: globalThis.GaiaTrueEnd?.isReached?.() ?? false,
    reachedMarkerStored: Boolean(localStorage.getItem("gaiaSensewareTrueEnd:reached:v1")),
    audioPlayback: globalThis.GaiaOpeningAudio?.getPlaybackState?.() || null,
    overflowX: Math.max(0, document.documentElement.scrollWidth - innerWidth),
    overflowY: Math.max(0, document.documentElement.scrollHeight - innerHeight),
    toolbarHidden: getComputedStyle(document.querySelector(".novel-topbar")).visibility === "hidden",
    dialogueVisible: getComputedStyle(dialogue).visibility !== "hidden",
    interfaceOpacity: Number.parseFloat(getComputedStyle(interfaceLayer).opacity),
    interfaceTransitionDuration: getComputedStyle(interfaceLayer).transitionDuration,
    interfaceAnimations: interfaceLayer.getAnimations().map((animation) => ({
      currentTime: animation.currentTime,
      duration: animation.effect?.getTiming().duration,
      playState: animation.playState,
    })),
    motionReduced: matchMedia("(prefers-reduced-motion: reduce)").matches,
    separatorActive: shell?.classList.contains("is-scene-separating") || false,
    sectionTransitionPhase: shell?.dataset.sectionTransitionPhase || "",
    sceneCardPhase: sceneCard?.dataset.phase || "",
    sceneCardVisible: sceneCard?.classList.contains("is-active") || false,
    sceneCardOpacity: Number.parseFloat(getComputedStyle(sceneCard).opacity),
    sceneCardBackground: getComputedStyle(sceneCard).backgroundColor,
    sceneCardTitleOpacity: Number.parseFloat(getComputedStyle(sceneCardContent).opacity),
    sceneCardTitle: sceneCardContent?.querySelector("strong")?.textContent?.trim() || "",
    audioDockOpacity: Number.parseFloat(getComputedStyle(audioDock).opacity),
    audioDockInlineOpacity: audioDock?.style.getPropertyValue("opacity") || "",
    audioDockInlinePriority: audioDock?.style.getPropertyPriority("opacity") || "",
    audioDockHidden: audioDock?.hidden || false,
    bodyTransitionClass: document.body.classList.contains("true-end-section-transition"),
    sceneCardAnimation: getComputedStyle(sceneCard).animationName,
    sceneCardAnimations: sceneCard.getAnimations().map((animation) => ({
      currentTime: animation.currentTime,
      duration: animation.effect?.getTiming().duration,
      playState: animation.playState,
    })),
    sceneVisualBackground: shell ? getComputedStyle(shell, "::before").backgroundImage : "",
    sceneVisualOpacity: shell ? Number.parseFloat(getComputedStyle(shell, "::before").opacity) : 0,
    sceneVisualZIndex: shell ? Number.parseInt(getComputedStyle(shell, "::before").zIndex, 10) : 0,
    finaleVisible: Boolean(document.querySelector(".true-end-finale:not([hidden])")),
    logButtonVisible: Boolean(document.querySelector(".true-end-log-button")?.getClientRects().length),
    logButtonText: document.querySelector(".true-end-log-button")?.textContent?.trim() || "",
  };
});

const advanceTransmissionStep = async (page) => {
  const initial = await scanFrame(page);
  let before = initial;
  while (true) {
    const revealing = await page.evaluate(() => document.querySelector(".true-end-shell")?.classList.contains("is-revealing"));
    await page.locator(".true-end-dialogue").click();
    if (revealing) {
      await page.waitForFunction(() => !document.querySelector(".true-end-shell")?.classList.contains("is-revealing"));
      before = await scanFrame(page);
      continue;
    }
    await page.waitForFunction(({ counter, messagePage }) => {
      const shell = document.querySelector(".true-end-shell");
      const currentCounter = document.querySelector(".true-end-footer span:last-child")?.textContent?.trim() || "";
      return currentCounter !== counter || shell?.dataset.messagePage !== messagePage;
    }, { counter: before.counter, messagePage: before.messagePage });
    const after = await scanFrame(page);
    if (after.counter !== initial.counter) return { before: initial, after };
    before = after;
  }
};

const clickOutsideDialogue = async (page, label) => {
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
  return point;
};

const browser = await chromium.launch({
  headless: true,
  executablePath,
  args: ["--enable-webgl", "--ignore-gpu-blocklist", "--use-angle=swiftshader"],
});
try {
  const runtimeSource = await (await fetch(new URL("/opening-audio.js", baseUrl))).text();
  assert.match(runtimeSource, /story:\s*"\.\/assets\/audio\/planet-forecast-windowlight\.mp3"/u);
  assert.match(runtimeSource, /ending:\s*"\.\/assets\/audio\/after-school-afterglow\.mp3"/u);
  assert.match(runtimeSource, /trueend:\s*"\.\/assets\/audio\/sensory-horizon\.wav"/u);
  const trueEndStyleSource = await (await fetch(new URL("/true-end.css", baseUrl))).text();
  const trueEndModeSource = await (await fetch(new URL("/true-end-mode.js", baseUrl))).text();
  const trueEndWebGLSource = await (await fetch(new URL("/true-end-webgl.js", baseUrl))).text();
  assert.doesNotMatch(trueEndStyleSource, /true-end-bg-/u, "retired raster background remains in true-end.css");
  assert.doesNotMatch(trueEndStyleSource, /true-end-(?:lou|thoughtform)/u, "retired character-image styling remains in true-end.css");
  assert.doesNotMatch(trueEndModeSource, /true-end-(?:luu-cute|mizuha-thoughtform|amane-thoughtform|sakuya-thoughtform)/u, "retired character-image asset remains in true-end-mode.js");
  assert.doesNotMatch(trueEndStyleSource, /true-end-relic/u, "retired green relic styling remains in true-end.css");
  assert.doesNotMatch(trueEndModeSource, /true-end-relic/u, "retired green relic element remains in true-end-mode.js");
  assert.match(trueEndModeSource, /createElement\("div", "true-end-interface"\)/u, "unified true-end interface layer is missing");
  assert.match(trueEndModeSource, /const SCENE_BLACKOUT_MS = 720/u, "full-black curtain timing is missing");
  assert.match(trueEndModeSource, /const SCENE_TITLE_FADE_MS = 440/u, "section-title fade timing is missing");
  assert.match(trueEndModeSource, /const SCENE_TITLE_HOLD_MS = 1040/u, "section-title hold timing is missing");
  assert.match(trueEndModeSource, /const SCENE_TITLE_OUT_MS = 360/u, "section-title exit timing is missing");
  assert.match(trueEndModeSource, /const SCENE_REVEAL_MS = 920/u, "section reveal timing is missing");
  assert.match(trueEndModeSource, /await animateSceneOpacity\(sceneCard, 0, 1, SCENE_BLACKOUT_MS\)/u, "section transition does not close to black first");
  assert.match(trueEndModeSource, /setSceneTransitionPhase\("black"\)[\s\S]*prepareScene\?\.\(\)[\s\S]*setSceneTransitionPhase\("title"\)/u, "section metadata is not prepared only after full blackout");
  assert.match(trueEndModeSource, /setSceneTransitionPhase\("switching"\)[\s\S]*Promise\.resolve\(\)\.then\(async \(\) => \{[\s\S]*preparedStep = await switchScene\?\.\(\)[\s\S]*setSceneTransitionPhase\("ready"\)/u, "background preparation is not completed behind the black curtain");
  assert.match(trueEndModeSource, /setSceneTransitionPhase\("reveal"\)[\s\S]*animateSceneOpacity\(sceneCard, 1, 0, SCENE_REVEAL_MS\)/u, "new section does not reveal from full black");
  assert.match(trueEndStyleSource, /\.true-end-scene-card\s*\{[\s\S]*background:\s*#000/u, "section curtain is not pure black");
  assert.doesNotMatch(trueEndModeSource, /animateInterfaceOpacity/u, "interface still fades independently from the black curtain");
  assert.doesNotMatch(trueEndModeSource, /is-scene-changing/u, "retired second scene-fade state remains in true-end-mode.js");
  assert.doesNotMatch(trueEndWebGLSource, /classList\.contains\("is-scene-separating"\)/u, "WebGL still freezes during the scene separator");
  assert.match(trueEndWebGLSource, /if \(sceneCompletionResolve\) settleSceneDraw\(false\)/u, "WebGL scene switching does not report an actual completed draw");
  assert.match(trueEndModeSource, /await syncSceneBackdrop\(\{ immediate: true \}\)[\s\S]*return prepareStep\(\)/u, "section preparation does not wait for the background draw and character presence");
  assert.match(trueEndModeSource, /animateSceneOpacity\(sceneCard, 1, 0, SCENE_REVEAL_MS\)[\s\S]*sectionTransitionCompletedAt[\s\S]*commitPreparedStep\(result\.preparedStep\)/u, "the next message is not committed strictly after the section curtain finishes fading out");
  assert.match(trueEndStyleSource, /\.true-end-shell\.is-scene-separating\s+:is\(\.true-end-dialogue, \.true-end-readout\)\s*\{\s*visibility:\s*hidden;/u, "message UI is not hidden throughout the section separator");
  assert.match(trueEndModeSource, /FUTURE_SHORE_START_STEP_ID = "beyond_03_032"/u, "future-shore image does not start at the requested narration");
  assert.match(trueEndModeSource, /shell\.dataset\.shoreImage = shoreVisible \? "visible" : "hidden"/u, "future-shore visibility is not synchronized per step");
  assert.match(trueEndStyleSource, /\[data-shore-image="visible"\]::before[\s\S]*opacity:\s*0\.94/u, "future-shore image is not gated behind its narration");
  assert.match(trueEndStyleSource, /\[data-shore-image="visible"\] \.true-end-universe[\s\S]*opacity:\s*0\.84;[\s\S]*mix-blend-mode:\s*screen/u, "character WebGL is not strongly composited over the future shore");
  assert.match(trueEndStyleSource, /\.true-end-shell\.is-finale \.true-end-universe[\s\S]*opacity:\s*0\.96;[\s\S]*mix-blend-mode:\s*normal/u, "finale does not expose the NOVACENE WebGL field");
  assert.match(trueEndModeSource, /shell\.dataset\.shoreImage\s*=\s*"hidden";[\s\S]*setScene\?\.\("galaxy"\)[\s\S]*setPresence\?\.\("system", \{ emphasis: true, signal: "beyond-finale" \}\)/u, "finale does not switch from the shore image to the existing NOVACENE WebGL field");
  assert.doesNotMatch(trueEndModeSource, /createElement\("img"/u, "TRANSMISSION still creates a raster image element");
  assert.match(trueEndWebGLSource, /setPresence\(name/u, "WebGL presence controller is missing");
  assert.match(trueEndWebGLSource, /u_speaker_mix/u, "WebGL presence crossfade is missing");
  assert.match(trueEndWebGLSource, /const presenceTransitionDuration = 380/u, "presence crossfade is not twice as fast");
  assert.match(trueEndModeSource, /await \(universeRuntime\?\.setPresence/u, "message rendering does not await the completed presence crossfade");
  assert.match(trueEndWebGLSource, /if \(speaker < -0\.5\) return vec3\(0\.0\)/u, "first presence cannot fade in from transparent");
  assert.match(trueEndWebGLSource, /presenceField\(p, u_speaker_from\)[\s\S]*presenceFadeOut[\s\S]*presenceField\(p, u_speaker_to\)[\s\S]*presenceFadeIn/u, "presence shader does not fade the old character out and the new character in");
  assert.match(trueEndWebGLSource, /signalStateAt\(now\)/u, "per-line presence signal still changes in one frame");
  assert.doesNotMatch(trueEndWebGLSource, /0\.52 \+ 0\.48 \* u_speaker_mix/u, "new character still appears at partial strength on its first frame");
  assert.match(trueEndWebGLSource, /vec3 signalSurge[\s\S]*vec2 matrixUv[\s\S]*float blocks[\s\S]*float scanRow[\s\S]*float columns/u, "AIVA's rectangular signal matrix is missing");
  assert.match(trueEndWebGLSource, /vec3 weaveStorm[\s\S]*float warpThreads[\s\S]*float weftThreads[\s\S]*float diagonalThread[\s\S]*float crossings/u, "Lou's living loom is missing");
  assert.match(trueEndWebGLSource, /vec3 tidalSurge[\s\S]*float distanceFromDrop[\s\S]*float rippleA[\s\S]*float rippleB[\s\S]*float reflectedWater[\s\S]*float drop/u, "Mizuha's water ripples are missing");
  assert.match(trueEndWebGLSource, /vec3 skyCurrent[\s\S]*float skyPressure[\s\S]*float fallingMemory[\s\S]*float descendingVeil[\s\S]*float pressureFront[\s\S]*float downwardPulse/u, "Amane's abstract sky veil is missing");
  assert.match(trueEndWebGLSource, /vec3 memoryBranches[\s\S]*float fiveFoldMemory[\s\S]*float openingWave[\s\S]*float petalResonance[\s\S]*float bloomPulse[\s\S]*float memoryPollen/u, "Sakuya's abstract bloom resonance is missing");
  assert.match(trueEndWebGLSource, /vec3 witnessConvergence[\s\S]*float trunk[\s\S]*float leftChoice[\s\S]*float rightChoice[\s\S]*float secondDecision[\s\S]*float branchingPaths/u, "the visitor's choice paths are missing");
  assert.doesNotMatch(trueEndWebGLSource, /float flowA|float flowB|float flowC/u, "shared thick flow bands still make every character look alike");
  assert.match(trueEndWebGLSource, /float presenceStrength = 1\.34 \+ u_emphasis \* 0\.48/u, "character fields are not using the stronger presence gain");
  assert.doesNotMatch(trueEndWebGLSource, /orbitSeed|ringA|ringB|ringC|satelliteA|satelliteB|float rings|float spiral|vec2 beacon|float orbit|witnessLens|float lens|float iris|float aperture/u, "retired orbit, circle, or vortex geometry remains in the WebGL shader");
  assert.doesNotMatch(trueEndModeSource, /true-end-weave/u, "TRANSMISSION still creates the full-screen ellipse weave");
  assert.doesNotMatch(trueEndStyleSource, /\.true-end-weave|conic-gradient/u, "TRANSMISSION still styles ellipse or vortex decoration");
  assert.match(trueEndWebGLSource, /p \+= u_pointer/u, "the restored field no longer follows pointer parallax");

  for (const viewport of separatorOnly ? [] : viewports) {
    const context = await browser.newContext({ viewport, reducedMotion: "reduce" });
    const page = await context.newPage();
    attachDiagnostics(page, viewport.name);
    await bootAtTrueEnd(page, viewport.name);

    const story = await page.evaluate(() => ({
      title: globalThis.GAIA_TRUE_END_STORY.title,
      subtitle: globalThis.GAIA_TRUE_END_STORY.subtitle,
      language: globalThis.GAIA_TRUE_END_STORY.language,
      finale: globalThis.GAIA_TRUE_END_STORY.finale,
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
    assert.equal(story.title, "NOVACENE");
    assert.equal(story.subtitle, "惑星の放課後 / GAIA SENSATION — NOVACENE");
    assert.equal(story.finale.label, "星々の放課後");
    assert.equal(story.language.name, "SÆLIVA");
    assert.equal(story.language.japaneseName, "セイリヴァ");
    assert.equal(story.language.htmlLang, "art-x-saeliva");
    assert.equal(story.scenes.length, 3, `${viewport.name}: approved true end must have three scenes`);
    assert.deepEqual(story.scenes.map(({ number }) => number), ["01", "02", "03"]);
    assert.equal(story.totalSteps, 133, `${viewport.name}: total step count mismatch`);

    if (pageBreakOnly) {
      let frame = await scanFrame(page);
      while (Number.parseInt(frame.counter, 10) < 70) {
        ({ after: frame } = await advanceTransmissionStep(page));
      }
      assert.equal(frame.counter, "070 / 133", `${viewport.name}: page-break check did not stop on the excavation page`);
      assert.equal(frame.message, "新品の像が消え、発掘品だけが残る。記憶領域から機器ID、六十秒間隔、送信先、最初の文が現れた。", `${viewport.name}: excavation page does not end at 現れた。`);
      assert(frame.messageScrollHeight <= frame.messageClientHeight + 1, `${viewport.name}: first excavation page is visually clipped`);
      await page.screenshot({ path: path.join(outputDir, `${viewport.name}-page-035.png`), animations: "disabled" });

      const { after: nextFrame } = await advanceTransmissionStep(page);
      assert.equal(nextFrame.counter, "071 / 133", `${viewport.name}: one click did not advance exactly one page`);
      assert.equal(nextFrame.message, "DÆM RAI: KAR·EN", `${viewport.name}: the page after excavation is not isolated after the click boundary`);
      assert.equal(nextFrame.dialogueVisible, true, `${viewport.name}: second excavation page is not visible`);
      await page.screenshot({ path: path.join(outputDir, `${viewport.name}-page-036.png`), animations: "disabled" });
      report.viewports.push({
        viewport: viewport.name,
        firstPage: { counter: frame.counter, message: frame.message, lines: frame.messageLineCount },
        secondPage: { counter: nextFrame.counter, message: nextFrame.message, lines: nextFrame.messageLineCount },
        passed: true,
      });
      await context.close();
      continue;
    }

    let initial = await scanFrame(page);
    if (!initial.audioPlayback?.duration) {
      await page.waitForFunction(() => (globalThis.GaiaOpeningAudio?.getPlaybackState?.().duration || 0) > 0, null, { timeout: 30_000 });
      initial = await scanFrame(page);
    }
    const seenSpeakers = new Set();
    const seenManifestations = new Map();
    const seenSystemPhrases = new Set();
    const capturedSpeakers = new Set();
    const messageLayoutViolations = [];
    const targetMessagePages = [];
    const maximumAllowedMessageLines = viewport.width <= 720 ? 5 : 3;
    let maximumMessageLines = 0;
    const fixedDialogueHeight = initial.dialogueRect.height;
    const manifestations = {
      narrator: "central-breath",
      system: "signal-matrix",
      lou: "living-loom",
      mizuha: "water-ripples",
      amane: "sky-veil",
      sakuya: "bloom-resonance",
      visitor: "choice-paths",
    };
    const validateSpeakerVisual = (frame) => {
      seenSpeakers.add(frame.speaker);
      seenManifestations.set(frame.speaker, frame.universeManifestation);
      const expectedScene = story.scenes.find(({ id }) => id === frame.scene);
      assert(expectedScene, `${viewport.name}: unknown true-end scene ${frame.scene}`);
      assert.equal(frame.universeState, "active", `${viewport.name}: WebGL universe is not active`);
      assert.equal(frame.universeScene, expectedScene.backdrop, `${viewport.name}: WebGL palette is out of sync`);
      assert(frame.universeFrame > 0, `${viewport.name}: WebGL universe did not render a frame`);
      assert(frame.universeSize.width > 0 && frame.universeSize.height > 0, `${viewport.name}: WebGL canvas has no drawable area`);
      assert.equal(frame.universeSpeaker, frame.speaker, `${viewport.name}: WebGL presence is out of sync with ${frame.speaker}`);
      assert.equal(frame.universeManifestation, manifestations[frame.speaker], `${viewport.name}: ${frame.speaker} has the wrong WebGL manifestation`);
      assert(Number.isFinite(frame.universeSignal) && frame.universeSignal >= 0 && frame.universeSignal <= 1, `${viewport.name}: WebGL signal seed is invalid`);
      assert.equal(frame.characterImageCount, 0, `${viewport.name}: raster character image DOM remains in TRANSMISSION`);
      assert.equal(frame.backdropCount, 0, `${viewport.name}: retired raster backdrop DOM remains`);
      if (frame.scene === "after-school-stars") {
        const shoreShouldBeVisible = Number.parseInt(frame.stepId.slice(-3), 10) >= 32;
        assert.match(frame.sceneVisualBackground, /true-end-future-cosmic-shore-v1\.png/u, `${viewport.name}: generated future shore is not connected to scene 09`);
        assert.equal(frame.shoreImage, shoreShouldBeVisible ? "visible" : "hidden", `${viewport.name}: shore visibility state is wrong at ${frame.stepId}`);
        if (shoreShouldBeVisible) {
          assert(frame.sceneVisualOpacity >= 0.9, `${viewport.name}: future shore is not visible from beyond_03_032 onward`);
          assert(frame.universeOpacity >= 0.8, `${viewport.name}: character WebGL became too faint over the future shore`);
          assert.equal(frame.universeBlendMode, "screen", `${viewport.name}: character WebGL is not composited over the future shore`);
          assert(frame.universeZIndex > frame.sceneVisualZIndex, `${viewport.name}: future shore still covers the character WebGL layer`);
        } else {
          assert(frame.sceneVisualOpacity <= 0.01, `${viewport.name}: future shore appeared before beyond_03_032`);
          assert(frame.universeOpacity >= 0.99, `${viewport.name}: WebGL was dimmed before the future-shore narration`);
          assert.equal(frame.universeBlendMode, "normal", `${viewport.name}: pre-shore WebGL inherited the image blend mode`);
        }
      }
      assert(frame.dialogueRect && frame.dialogueRect.y >= 0 && frame.dialogueRect.bottom <= viewport.height + 1, `${viewport.name}: dialogue escaped the viewport`);
      assert(Math.abs(frame.dialogueRect.height - fixedDialogueHeight) <= 0.5, `${viewport.name}: dialogue height changed at ${frame.counter} (${fixedDialogueHeight} -> ${frame.dialogueRect.height})`);
      maximumMessageLines = Math.max(maximumMessageLines, frame.messageLineCount);
      if (frame.messageLineCount < 1 || frame.messageLineCount > maximumAllowedMessageLines || frame.messageScrollHeight > frame.messageClientHeight + 1) {
        messageLayoutViolations.push(`${frame.counter}: ${frame.messageLineCount} lines, ${frame.messageScrollHeight}/${frame.messageClientHeight}px — ${frame.message}`);
      }
      if (frame.stepId === "beyond_01_021" && targetMessagePages.at(-1) !== frame.message) {
        targetMessagePages.push(frame.message);
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
    assert.equal(initial.message, OPENING_MESSAGE);
    assert.equal(initial.speakerName, "AIVA");
    assert.equal(initial.speakerCode, "KAR·MIR");
    assert.equal(initial.readoutHeader, "SÆL·MIR");
    assert.equal(initial.readoutCount, "KAR 01");
    assert.equal(initial.readoutRowCount, 1);
    assert.deepEqual(initial.readoutLines, ["AL MIR: KAR·EN / THEL: 2,704,118 HARA"]);
    assert.equal(initial.audioTrack, "trueend");
    assert.equal(initial.titleUnlocked, true, `${viewport.name}: canonical NOVACENE entry did not unlock the title`);
    assert.equal(initial.reachedMarkerStored, true, `${viewport.name}: canonical NOVACENE entry did not persist its reached marker`);
    assert.equal(initial.audioPlayback.duration, 72, `${viewport.name}: dedicated score has the wrong duration`);
    assert.equal(initial.toolbarHidden, true);
    assert.equal(initial.dialogueVisible, true);
    assert.equal(initial.shellUserSelect, "none", `${viewport.name}: TRANSMISSION text remains selectable`);
    assert.equal(initial.logButtonVisible, true);
    assert.equal(initial.logButtonText, "LOG");
    assert.equal(initial.footerSpanCount, 1);
    assert.doesNotMatch(initial.footerText, /ANTHROPOCENE/u);
    assert.equal(initial.overflowX, 0);
    assert.equal(initial.overflowY, 0);
    assert(initial.dialogueRect.height >= 44, `${viewport.name}: dialogue hit area is under 44px`);
    assert(initial.dialogueRect.x >= 0 && initial.dialogueRect.bottom <= viewport.height + 1, `${viewport.name}: dialogue is outside viewport`);
    assert(initial.mainDialogueRect, `${viewport.name}: main-story dialogue reference is unavailable`);
    assert(Math.abs(initial.dialogueRect.width - initial.mainDialogueRect.width) <= 1, `${viewport.name}: TRANSMISSION width does not match the main story (${initial.dialogueRect.width} / ${initial.mainDialogueRect.width})`);
    if (viewport.width <= 720) {
      assert(initial.dialogueRect.height >= initial.mainDialogueRect.height, `${viewport.name}: expanded TRANSMISSION dialogue is shorter than the main story (${initial.dialogueRect.height} / ${initial.mainDialogueRect.height})`);
    } else {
      assert(Math.abs(initial.dialogueRect.height - initial.mainDialogueRect.height) <= 1, `${viewport.name}: TRANSMISSION height does not match the main story (${initial.dialogueRect.height} / ${initial.mainDialogueRect.height})`);
    }
    assert.equal(initial.dialogueBorderWidth, 0, `${viewport.name}: TRANSMISSION retained its separate framed box`);
    assert.equal(initial.dialogueBackground, "none", `${viewport.name}: TRANSMISSION retained its separate panel background`);
    assert.match(initial.dialogueGlowBackground, /linear-gradient/u, `${viewport.name}: main-story lower glass fade is missing`);
    assert(Math.abs(initial.messageTopOffset) <= 1, `${viewport.name}: initial message is not top-aligned (${initial.messageTopOffset}; ${JSON.stringify(initial.messageLayoutDebug)})`);
    assert(initial.messageFontSize >= (viewport.width <= 500 ? 16 : 20), `${viewport.name}: dialogue text is too small`);
    assert(initial.readoutRect && initial.readoutRect.right <= viewport.width + 1, `${viewport.name}: readout escaped the viewport`);
    assert(initial.readoutRect.width <= (viewport.width <= 500 ? viewport.width - 24 : 420), `${viewport.name}: readout is still too wide (${initial.readoutRect.width}px)`);

    const selectionBeforeDrag = await page.locator(".true-end-footer span:last-child").textContent();
    const messageBox = await page.locator(".true-end-message").boundingBox();
    assert(messageBox && messageBox.width > 40 && messageBox.height > 10, `${viewport.name}: message has no draggable area`);
    await page.mouse.move(messageBox.x + 8, messageBox.y + Math.min(12, messageBox.height / 2));
    await page.mouse.down();
    await page.mouse.move(messageBox.x + messageBox.width - 8, messageBox.y + Math.min(messageBox.height - 4, 30), { steps: 12 });
    await page.mouse.up();
    const dragSelection = await page.evaluate(() => window.getSelection()?.toString() || "");
    assert.equal(dragSelection, "", `${viewport.name}: dragging selected TRANSMISSION text`);
    assert.equal(await page.locator(".true-end-footer span:last-child").textContent(), selectionBeforeDrag, `${viewport.name}: drag advanced the message`);
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.waitForFunction((initialFrame) => (
      Number(document.querySelector(".true-end-universe")?.dataset.webglFrame || 0) > initialFrame
    ), initial.universeFrame, { timeout: 5_000 });
    const animatedFrame = await scanFrame(page);
    assert(animatedFrame.universeFrame > initial.universeFrame, `${viewport.name}: WebGL universe is not animating`);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.locator(".true-end-log-button").click();
    await page.locator("#novel-log-panel").waitFor({ state: "visible" });
    const initialBeyondLog = await page.evaluate(() => ({
      ids: globalThis.GaiaNovel.getState().readStepIds.filter((id) => id.startsWith("beyond_")),
      entries: [...document.querySelectorAll('#novel-log-content article[data-step-id^="beyond_"]')]
        .map((entry) => ({ id: entry.dataset.stepId, text: entry.querySelector(".novel-log-entry-text")?.textContent || "" })),
    }));
    assert.deepEqual(initialBeyondLog.ids, ["beyond_01_001"], `${viewport.name}: first TRANSMISSION line was not persisted`);
    assert.equal(initialBeyondLog.entries.length, 1, `${viewport.name}: first TRANSMISSION line is absent from LOG`);
    assert.equal(initialBeyondLog.entries[0].text, OPENING_MESSAGE);
    await page.locator("#novel-log-close").click();
    await page.locator("#novel-log-panel").waitFor({ state: "hidden" });
    await page.screenshot({ path: path.join(outputDir, `${viewport.name}-scene-01.png`), animations: "disabled" });
    capturedSpeakers.add(initial.speaker);
    await page.screenshot({ path: path.join(outputDir, `${viewport.name}-speaker-${initial.speaker}.png`), animations: "disabled" });

    const visited = [{ scene: initial.scene, title: initial.title }];
    let absoluteStep = 1;
    let outsideAdvance = null;
    for (let sceneIndex = 0; sceneIndex < story.scenes.length; sceneIndex += 1) {
      const currentScene = story.scenes[sceneIndex];
      for (let index = 0; index < currentScene.steps; index += 1) {
        const isFinalStep = absoluteStep === story.totalSteps;
        if (isFinalStep) {
          outsideAdvance = await clickOutsideDialogue(page, `${viewport.name}: final message`);
          await page.waitForFunction(() => Boolean(document.querySelector(".true-end-finale:not([hidden])")));
          break;
        }
        let beforeAdvance = await scanFrame(page);
        await page.locator(".true-end-dialogue").click();
        absoluteStep += 1;
        let nextFrame;
        while (!nextFrame) {
          await page.waitForFunction(({ expected, previousCounter, previousPage }) => {
            const currentShell = document.querySelector(".true-end-shell");
            const currentCounter = document.querySelector(".true-end-footer span:last-child")?.textContent?.trim() || "";
            return currentCounter.startsWith(String(expected).padStart(3, "0"))
              || (currentCounter === previousCounter && currentShell?.dataset.messagePage !== previousPage);
          }, {
            expected: absoluteStep,
            previousCounter: beforeAdvance.counter,
            previousPage: beforeAdvance.messagePage,
          });
          const candidate = await scanFrame(page);
          if (candidate.counter.startsWith(String(absoluteStep).padStart(3, "0"))) {
            nextFrame = candidate;
            break;
          }
          assert.equal(candidate.counter, beforeAdvance.counter, `${viewport.name}: a message page changed the story counter`);
          assert.equal(candidate.stepId, beforeAdvance.stepId, `${viewport.name}: a message page changed the story step`);
          validateSpeakerVisual(candidate);
          beforeAdvance = candidate;
          await page.locator(".true-end-dialogue").click();
        }
        validateSpeakerVisual(nextFrame);
        assert(Math.abs(nextFrame.messageTopOffset) <= 1, `${viewport.name}: message moved from the top at ${nextFrame.counter} (${nextFrame.messageTopOffset})`);
        if (absoluteStep === 70) {
          assert.equal(nextFrame.message, "新品の像が消え、発掘品だけが残る。記憶領域から機器ID、六十秒間隔、送信先、最初の文が現れた。", `${viewport.name}: excavation page does not end at 現れた。`);
        }
        if (absoluteStep === 71) {
          assert.equal(nextFrame.message, "DÆM RAI: KAR·EN", `${viewport.name}: the page after excavation is not isolated after the click boundary`);
        }
        if (!capturedSpeakers.has(nextFrame.speaker)) {
          capturedSpeakers.add(nextFrame.speaker);
          await page.waitForTimeout(80);
          await page.screenshot({
            path: path.join(outputDir, `${viewport.name}-speaker-${nextFrame.speaker}.png`),
            animations: "disabled",
          });
        }
        if (nextFrame.scene !== visited.at(-1).scene) {
          visited.push({ scene: nextFrame.scene, title: nextFrame.title });
          if (nextFrame.scene === "electronic-civilization") {
            await page.screenshot({ path: path.join(outputDir, `${viewport.name}-scene-04.png`), animations: "disabled" });
          }
          if (nextFrame.scene === "after-school-stars") {
            await page.screenshot({ path: path.join(outputDir, `${viewport.name}-scene-09-webgl-only.png`), animations: "disabled" });
          }
        }
        if (nextFrame.stepId === "beyond_03_032") {
          await page.screenshot({ path: path.join(outputDir, `${viewport.name}-scene-09-shore-start.png`), animations: "disabled" });
        }
        if (nextFrame.stepId === "beyond_03_041") {
          await page.screenshot({ path: path.join(outputDir, `${viewport.name}-scene-09-shore-with-lou.png`), animations: "disabled" });
        }
      }
    }

    assert.deepEqual(messageLayoutViolations, [], `${viewport.name}: messages exceeded the ${maximumAllowedMessageLines}-line dialogue design:\n${messageLayoutViolations.join("\n")}`);
    assert.deepEqual(targetMessagePages, [
      "この世界では、言葉というフィルターを通さず、他者の存在や意図をありのまま受け止める。",
      "猫同士が微かな匂いや気配だけで互いのすべてを通じ合わせるように、人類が忘れ去っていた原初の感覚が息を吹き返したのだ。",
      "自分と他者を隔てる壁が消え去ったとき、その通じ合いは静かな波紋のように広がり、やがて全宇宙のあらゆる存在と意識を分かち合う感覚へと広がっていった。",
    ], `${viewport.name}: beyond_01_021 did not preserve all three authored pages`);
    assert.deepEqual(visited, story.scenes.map(({ id, title }) => ({ scene: id, title })), `${viewport.name}: scene order changed`);
    for (const speaker of ["narrator", "system", "lou", "mizuha", "amane", "sakuya", "visitor"]) {
      assert(seenSpeakers.has(speaker), `${viewport.name}: ${speaker} was never rendered`);
      assert.equal(seenManifestations.get(speaker), manifestations[speaker], `${viewport.name}: ${speaker} WebGL manifestation was never rendered`);
      assert(capturedSpeakers.has(speaker), `${viewport.name}: ${speaker} visual was not captured`);
    }
    for (const phrase of [OPENING_MESSAGE, "KAR DÆM MIR·EN"]) {
      assert(seenSystemPhrases.has(phrase), `${viewport.name}: SÆLIVA system phrase was never rendered: ${phrase}`);
    }
    const rasterBackgroundResources = await page.evaluate(() => performance
      .getEntriesByType("resource")
      .map(({ name }) => name)
      .filter((url) => url.includes("true-end-bg-")));
    assert.deepEqual(rasterBackgroundResources, [], `${viewport.name}: retired raster background was requested`);
    const generatedShoreResources = await page.evaluate(() => performance
      .getEntriesByType("resource")
      .map(({ name }) => name)
      .filter((url) => url.includes("true-end-future-cosmic-shore-v1.png")));
    assert(generatedShoreResources.length >= 1, `${viewport.name}: generated future shore image was not requested`);
    const rasterCharacterResources = await page.evaluate(() => performance
      .getEntriesByType("resource")
      .map(({ name }) => name)
      .filter((url) => /true-end-(?:luu-cute|mizuha-thoughtform|amane-thoughtform|sakuya-thoughtform)/u.test(url)));
    assert.deepEqual(rasterCharacterResources, [], `${viewport.name}: retired raster character was requested`);
    const finale = await page.evaluate(() => ({
      label: document.querySelector(".true-end-finale > span")?.textContent?.trim() || "",
      title: document.querySelector(".true-end-finale h2")?.textContent?.trim() || "",
      text: document.querySelector(".true-end-finale")?.innerText || "",
      button: document.querySelector(".true-end-finale button")?.textContent?.trim() || "",
      completed: Boolean(localStorage.getItem("gaiaSensewareTrueEnd:complete:v1")),
      stateCompleted: globalThis.GaiaNovel?.getState?.().trueEndComplete === true,
      overflowX: Math.max(0, document.documentElement.scrollWidth - innerWidth),
      overflowY: Math.max(0, document.documentElement.scrollHeight - innerHeight),
      logButtonVisible: Boolean(document.querySelector(".true-end-log-button")?.getClientRects().length),
      readoutLang: document.querySelector(".true-end-finale div")?.lang || "",
      shoreImage: document.querySelector(".true-end-shell")?.dataset.shoreImage || "",
      webglScene: document.querySelector(".true-end-universe")?.dataset.webglScene || "",
      webglSpeaker: document.querySelector(".true-end-universe")?.dataset.webglSpeaker || "",
      webglManifestation: document.querySelector(".true-end-universe")?.dataset.webglManifestation || "",
      webglOpacity: Number.parseFloat(getComputedStyle(document.querySelector(".true-end-universe")).opacity || "0"),
    }));
    assert.equal(finale.label, "星々の放課後");
    assert.equal(finale.title, "NOVACENE");
    assert(finale.text.includes("DÆM UL: ESHA·GEMA"));
    assert(finale.text.includes("IVARA KERA: K 2.700"));
    assert(finale.text.includes("SÆL·ORAI: 2,641,903 NETH"));
    assert(finale.text.includes("ESHA SÆL·TIR: KAR·EN"));
    assert(finale.text.includes("NÆI MIR: REA·AI"));
    assert.equal(finale.readoutLang, "art-x-saeliva");
    assert.equal(finale.button, "今の世界を拡げる");
    assert.equal(finale.shoreImage, "hidden");
    assert.equal(finale.webglScene, "galaxy");
    assert.equal(finale.webglSpeaker, "system");
    assert.equal(finale.webglManifestation, "signal-matrix");
    assert(finale.webglOpacity >= 0.95, `${viewport.name}: finale NOVACENE WebGL is too faint`);
    assert.equal(finale.completed, true);
    assert.equal(finale.stateCompleted, true);
    assert.equal(finale.overflowX, 0);
    assert.equal(finale.overflowY, 0);
    assert.equal(finale.logButtonVisible, true, `${viewport.name}: LOG is unavailable from the TRANSMISSION finale`);
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
    assert.deepEqual(beyondLog.stateIds, expectedBeyondIds, `${viewport.name}: TRANSMISSION state LOG order/count mismatch`);
    assert.deepEqual(beyondLog.storedIds, expectedBeyondIds, `${viewport.name}: TRANSMISSION persisted LOG order/count mismatch`);
    assert.equal(beyondLog.entries.length, 133, `${viewport.name}: TRANSMISSION LOG does not contain all 133 lines`);
    assert.deepEqual(beyondLog.entries.map(({ id }) => id), expectedBeyondIds, `${viewport.name}: TRANSMISSION rendered LOG order mismatch`);
    assert.match(beyondLog.entries[0].meta, /NOVACENE/u);
    assert.equal(beyondLog.entries[0].text, OPENING_MESSAGE);
    assert.equal(beyondLog.entries.find(({ id }) => id === "beyond_02_038")?.text, "新品の像が消え、発掘品だけが残る。記憶領域から機器ID、六十秒間隔、送信先、最初の文が現れた。", `${viewport.name}: excavation page is wrong in the persisted LOG`);
    assert.equal(beyondLog.entries.find(({ id }) => id === "beyond_02_039")?.text, "DÆM RAI: KAR·EN", `${viewport.name}: post-excavation page is wrong in the persisted LOG`);
    assert.doesNotMatch(beyondLog.entries.map(({ text }) => text).join("\n"), /子どもの玩具以下|性能は玩具以下/u, `${viewport.name}: retired toy-scale comparison remains`);
    assert.equal(beyondLog.entries.at(-1).text, FINAL_MESSAGE);
    await page.locator("#novel-log-close").click();
    await page.locator("#novel-log-panel").waitFor({ state: "hidden" });

    await page.locator(".true-end-finale button").click();
    await page.waitForFunction(() => !document.querySelector(".true-end-shell")
      && !document.body.classList.contains("novel-open")
      && document.querySelector("#novel-layer")?.getAttribute("aria-hidden") === "true"
      && !document.querySelector("#intro-layer")?.hidden
      && document.querySelector("#intro-layer")?.getAttribute("aria-hidden") === "false");
    await page.waitForFunction(() => globalThis.GaiaOpeningAudio?.getState?.().track === "opening", null, { timeout: 10_000 });

    await page.evaluate(() => localStorage.removeItem("gaiaSensewareNovel:manual-saves"));
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => Boolean(globalThis.GaiaNovel));
    await page.evaluate(() => globalThis.GaiaNovel.open());
    await page.locator("#novel-resume-button").click();
    await page.waitForFunction(() => globalThis.GaiaNovel.getState().readStepIds
      .filter((id) => id.startsWith("beyond_")).length === 133);
    const restoredBeyondIds = await page.evaluate(() => globalThis.GaiaNovel.getState().readStepIds
      .filter((id) => id.startsWith("beyond_")));
    assert.deepEqual(restoredBeyondIds, expectedBeyondIds, `${viewport.name}: TRANSMISSION LOG did not survive reload`);

    report.viewports.push({
      viewport: viewport.name,
      story,
      initial,
      animatedFrame: animatedFrame.universeFrame,
      outsideAdvance,
      rasterBackgroundResources,
      rasterCharacterResources,
      manifestations: Object.fromEntries(seenManifestations),
      visited,
      maximumMessageLines,
      fixedDialogueHeight,
      readoutWidth: initial.readoutRect.width,
      dragSelection,
      finale,
      beyondLog: { count: beyondLog.entries.length, first: beyondLog.entries[0].id, last: beyondLog.entries.at(-1).id },
      restoredBeyondLogCount: restoredBeyondIds.length,
      passed: true,
    });
    await context.close();
  }

  report.separatorOrder = [];
  for (const viewport of pageBreakOnly ? [] : viewports) {
    const separatorContext = await browser.newContext({ viewport, reducedMotion: "no-preference" });
    const separatorPage = await separatorContext.newPage();
    attachDiagnostics(separatorPage, `${viewport.name}-separator-flow`);
    await bootAtTrueEnd(separatorPage, `${viewport.name}-separator-flow`);
    const { firstSceneSteps, firstSpeakerChangeIndex, nextSpeaker } = await separatorPage.evaluate(() => {
      const steps = globalThis.GAIA_TRUE_END_STORY.scenes[0].steps;
      const speakerFor = (item) => item.speaker || "narrator";
      const changeIndex = steps.findIndex((item, index) => index > 0 && speakerFor(item) !== speakerFor(steps[index - 1]));
      return {
        firstSceneSteps: steps.length,
        firstSpeakerChangeIndex: changeIndex,
        nextSpeaker: speakerFor(steps[changeIndex]),
      };
    });
    assert(firstSpeakerChangeIndex > 0, `${viewport.name}: no speaker change was found for the presence fade test`);
    while (Number.parseInt((await scanFrame(separatorPage)).counter, 10) < firstSpeakerChangeIndex) {
      await advanceTransmissionStep(separatorPage);
    }
    await separatorPage.evaluate(() => {
      const shell = document.querySelector(".true-end-shell");
      if (shell?.classList.contains("is-revealing")) document.querySelector(".true-end-dialogue")?.click();
    });
    await separatorPage.waitForFunction(() => !document.querySelector(".true-end-shell")?.classList.contains("is-revealing"));
    const fadeBefore = await scanFrame(separatorPage);
    await separatorPage.evaluate(() => document.querySelector(".true-end-dialogue")?.click());
    await separatorPage.waitForTimeout(50);
    const fadeStart = await scanFrame(separatorPage);
    assert.equal(fadeStart.motionReduced, false, `${viewport.name}: fade test unexpectedly prefers reduced motion`);
    assert.equal(fadeStart.universeState, "active", `${viewport.name}: WebGL universe is unavailable during fade test`);
    assert.equal(fadeStart.universePresenceState, "fading", `${viewport.name}: presence transition was not started (${JSON.stringify({ before: fadeBefore.speaker, after: fadeStart.speaker, mix: fadeStart.universePresenceMix, frame: fadeStart.universeFrame })})`);
    assert.equal(fadeStart.universeSpeaker, nextSpeaker, `${viewport.name}: WebGL did not begin the next speaker presence`);
    assert.equal(fadeStart.speaker, fadeBefore.speaker, `${viewport.name}: speaker label changed before the new presence was fully visible`);
    assert.equal(fadeStart.message, fadeBefore.message, `${viewport.name}: message changed before the new presence was fully visible`);
    assert.equal(fadeStart.counter, fadeBefore.counter, `${viewport.name}: message step committed before the new presence was fully visible`);
    assert.equal(fadeStart.universePresenceDuration, 380, `${viewport.name}: presence crossfade duration is not 380ms`);
    await separatorPage.waitForTimeout(100);
    const fadeMiddle = await scanFrame(separatorPage);
    if (fadeMiddle.universePresenceState === "fading") {
      assert.equal(fadeMiddle.message, fadeBefore.message, `${viewport.name}: message changed during the presence crossfade`);
      assert(
        fadeMiddle.universePresenceMix > fadeStart.universePresenceMix && fadeMiddle.universePresenceMix < 0.95,
        `${viewport.name}: presence did not interpolate continuously (${JSON.stringify({ start: { mix: fadeStart.universePresenceMix, frame: fadeStart.universeFrame, state: fadeStart.universePresenceState, hidden: fadeStart.documentHidden }, middle: { mix: fadeMiddle.universePresenceMix, frame: fadeMiddle.universeFrame, state: fadeMiddle.universePresenceState, hidden: fadeMiddle.documentHidden } })})`,
      );
    } else {
      assert.equal(fadeMiddle.universePresenceState, "steady", `${viewport.name}: presence entered an unknown state`);
      assert(fadeMiddle.universePresenceMix >= 0.9999, `${viewport.name}: settled presence has an incomplete mix`);
      assert(fadeMiddle.universePresenceCompletedAt > fadeStart.sampledAt, `${viewport.name}: delayed mobile sample lost the presence completion timestamp`);
      assert(fadeMiddle.messageCommittedAt >= fadeMiddle.universePresenceCompletedAt, `${viewport.name}: delayed mobile sample committed the message before presence completion`);
    }
    await separatorPage.screenshot({ path: path.join(outputDir, `${viewport.name}-presence-fade.png`) });
    await separatorPage.waitForFunction((counter) => document.querySelector(".true-end-footer span:last-child")?.textContent?.trim() !== counter, fadeBefore.counter, { timeout: 2_000 });
    const fadeAfter = await scanFrame(separatorPage);
    assert(fadeAfter.universePresenceMix >= 0.9999, `${viewport.name}: presence fade did not finish (${fadeAfter.universePresenceMix})`);
    assert.equal(fadeAfter.universePresenceState, "steady", `${viewport.name}: message committed before the presence became steady`);
    assert.equal(fadeAfter.speaker, nextSpeaker, `${viewport.name}: speaker label did not update after the presence completed`);
    assert.notEqual(fadeAfter.message, fadeBefore.message, `${viewport.name}: message did not update after the presence completed`);
    assert(fadeAfter.universePresenceCompletedAt > 0, `${viewport.name}: presence completion timestamp is missing`);
    assert(fadeAfter.messageCommittedAt >= fadeAfter.universePresenceCompletedAt, `${viewport.name}: message committed before presence completion (${JSON.stringify({ presence: fadeAfter.universePresenceCompletedAt, message: fadeAfter.messageCommittedAt })})`);
    report.presenceFades.push({
      viewport: viewport.name,
      from: fadeBefore.speaker,
      to: fadeAfter.speaker,
      samples: [fadeStart.universePresenceMix, fadeMiddle.universePresenceMix, fadeAfter.universePresenceMix],
      passed: true,
    });
    if (presenceOnly) {
      await separatorContext.close();
      continue;
    }

    while (Number.parseInt((await scanFrame(separatorPage)).counter, 10) < firstSceneSteps) {
      await advanceTransmissionStep(separatorPage);
    }
    await separatorPage.evaluate(() => {
      const shell = document.querySelector(".true-end-shell");
      if (shell?.classList.contains("is-revealing")) document.querySelector(".true-end-dialogue")?.click();
    });
    await separatorPage.waitForFunction(() => !document.querySelector(".true-end-shell")?.classList.contains("is-revealing"));

    const beforeSeparator = await scanFrame(separatorPage);
    assert.equal(beforeSeparator.scene, "after-ending", `${viewport.name}: separator test overshot the first scene`);
    assert.equal(beforeSeparator.title, "ずっと昔の人たち", `${viewport.name}: renamed first section title is missing`);
    assert.equal(beforeSeparator.counter, `${String(firstSceneSteps).padStart(3, "0")} / 133`, `${viewport.name}: separator test did not stop at the scene boundary`);
    assert.equal(beforeSeparator.interfaceOpacity, 1, `${viewport.name}: interface was not fully visible before the separator`);
    assert.equal(beforeSeparator.motionReduced, false, `${viewport.name}: separator timing test unexpectedly prefers reduced motion`);
    await separatorPage.screenshot({ path: path.join(outputDir, `${viewport.name}-separator-00-before.png`) });

    const separatorTriggeredAt = await separatorPage.evaluate(() => {
      const dialogue = document.querySelector(".true-end-dialogue");
      dialogue?.click();
      dialogue?.click();
      dialogue?.click();
      return performance.now();
    });
    if (productionSmoke) {
      await separatorPage.waitForFunction((triggeredAt) => {
        const shell = document.querySelector(".true-end-shell");
        const message = document.querySelector(".true-end-message");
        return shell?.dataset.scene === "electronic-civilization"
          && shell.dataset.sectionTransitionPhase === "idle"
          && Number(shell.dataset.sectionTransitionCompletedAt || 0) > triggeredAt
          && Number(shell.dataset.messageCommittedAt || 0) >= Number(shell.dataset.sectionTransitionCompletedAt || 0)
          && Boolean(message?.textContent);
      }, separatorTriggeredAt, { timeout: 15_000, polling: 10 });
      const productionAfter = await scanFrame(separatorPage);
      assert.equal(productionAfter.scene, "electronic-civilization", `${viewport.name}: production separator did not advance to the next scene`);
      assert.equal(productionAfter.counter, `${String(firstSceneSteps + 1).padStart(3, "0")} / 133`, `${viewport.name}: production click burst advanced more than one message`);
      assert.notEqual(productionAfter.message, beforeSeparator.message, `${viewport.name}: production next message did not appear`);
      assert.equal(productionAfter.dialogueVisible, true, `${viewport.name}: production message UI stayed hidden`);
      assert(productionAfter.sectionTransitionCompletedAt > separatorTriggeredAt, `${viewport.name}: production section completion timestamp is missing`);
      assert(productionAfter.messageCommittedAt >= productionAfter.sectionTransitionCompletedAt, `${viewport.name}: production message committed before section fade-out completed`);
      await separatorPage.screenshot({ path: path.join(outputDir, `${viewport.name}-separator-production-after.png`), animations: "disabled" });
      report.separatorOrder.push({
        viewport: viewport.name,
        before: beforeSeparator.message,
        during: "production-smoke",
        after: productionAfter.message,
        productionSmoke: true,
        passed: true,
      });
      await separatorContext.close();
      continue;
    }
    await separatorPage.waitForFunction(() => document.querySelector(".true-end-shell")?.dataset.sectionTransitionPhase === "blackout", null, { timeout: 2_000 });
    await separatorPage.waitForTimeout(140);
    const blackout = await scanFrame(separatorPage);
    assert.equal(blackout.separatorActive, true, `${viewport.name}: separator state ended during blackout`);
    assert.equal(blackout.sectionTransitionPhase, "blackout", `${viewport.name}: blackout phase was skipped`);
    assert(blackout.sceneCardOpacity > 0 && blackout.sceneCardOpacity < 1, `${viewport.name}: black curtain did not fade in continuously (${blackout.sceneCardOpacity} at ${(blackout.sampledAt - separatorTriggeredAt).toFixed(1)}ms)`);
    assert.equal(blackout.interfaceOpacity, 1, `${viewport.name}: interface faded independently under the black curtain`);
    assert.equal(blackout.scene, "after-ending", `${viewport.name}: section metadata changed before full black`);
    assert.equal(blackout.universeScene, beforeSeparator.universeScene, `${viewport.name}: WebGL background changed before full black`);
    assert.equal(blackout.message, beforeSeparator.message, `${viewport.name}: message changed before full black`);
    assert.equal(blackout.dialogueVisible, false, `${viewport.name}: message UI remained visible during blackout`);

    await separatorPage.waitForFunction(() => document.querySelector(".true-end-shell")?.dataset.sectionTransitionPhase === "title", null, { timeout: 2_000, polling: 10 });
    await separatorPage.waitForTimeout(90);
    const title = await scanFrame(separatorPage);
    assert(title.sceneCardOpacity >= 0.99, `${viewport.name}: section title appeared without a fully opaque curtain (${title.sceneCardOpacity})`);
    assert.equal(title.sceneCardBackground, "rgb(0, 0, 0)", `${viewport.name}: section curtain is not pure black (${title.sceneCardBackground})`);
    assert(title.audioDockOpacity <= 0.01, `${viewport.name}: global audio UI remained visible over the black title card (${JSON.stringify({ opacity: title.audioDockOpacity, inlineOpacity: title.audioDockInlineOpacity, inlinePriority: title.audioDockInlinePriority, hidden: title.audioDockHidden, bodyTransitionClass: title.bodyTransitionClass })})`);
    assert.equal(title.scene, "electronic-civilization", `${viewport.name}: next section metadata was not prepared under black`);
    assert.equal(title.sceneCardTitle, "電子を使っていた文明", `${viewport.name}: next section title was not shown over black`);
    assert(title.sceneCardTitleOpacity > 0 && title.sceneCardTitleOpacity <= 1, `${viewport.name}: section title was not visible (${title.sceneCardTitleOpacity})`);
    assert.equal(title.universeScene, beforeSeparator.universeScene, `${viewport.name}: WebGL background switched before the title appeared`);
    assert.equal(title.message, beforeSeparator.message, `${viewport.name}: next message rendered before background preparation`);
    assert.equal(title.dialogueVisible, false, `${viewport.name}: message UI became visible behind the section title`);
    await separatorPage.waitForFunction(() => document.querySelector(".true-end-shell")?.dataset.sectionTransitionPhase === "switching", null, { timeout: 2_000, polling: 10 });
    await separatorPage.waitForFunction(() => document.querySelector(".true-end-universe")?.dataset.webglScene === "reconstruction", null, { timeout: 2_000, polling: 10 });
    const switching = await scanFrame(separatorPage);
    assert(switching.sceneCardOpacity >= 0.99, `${viewport.name}: black curtain opened while the WebGL background was switching`);
    assert.equal(switching.sceneCardBackground, "rgb(0, 0, 0)", `${viewport.name}: switching phase lost its pure-black cover`);
    assert(switching.universeFrame > beforeSeparator.universeFrame, `${viewport.name}: new WebGL background did not draw under black`);

    await separatorPage.waitForFunction(() => document.querySelector(".true-end-shell")?.dataset.sectionTransitionPhase === "ready", null, { timeout: 3_000, polling: 10 });
    const ready = await scanFrame(separatorPage);
    assert(ready.sceneCardOpacity >= 0.99, `${viewport.name}: curtain opened before section preparation completed`);
    assert.equal(ready.universeScene, "reconstruction", `${viewport.name}: next WebGL background was not ready before reveal`);
    assert.equal(ready.universePresenceState, "steady", `${viewport.name}: character presence was not fully displayed before reveal`);
    assert.equal(ready.message, beforeSeparator.message, `${viewport.name}: next message was committed while the screen was black`);
    assert.equal(ready.messageCommittedAt, beforeSeparator.messageCommittedAt, `${viewport.name}: message timestamp changed before curtain reveal`);
    assert.equal(ready.dialogueVisible, false, `${viewport.name}: message UI became visible before curtain reveal`);
    await separatorPage.waitForFunction(() => document.querySelector(".true-end-shell")?.dataset.sectionTransitionPhase === "reveal", null, { timeout: 2_000, polling: 10 });
    await separatorPage.waitForTimeout(150);
    const reveal = await scanFrame(separatorPage);
    assert(reveal.sceneCardOpacity > 0 && reveal.sceneCardOpacity < 1, `${viewport.name}: new section did not fade in from black (${reveal.sceneCardOpacity})`);
    assert.equal(reveal.interfaceOpacity, 1, `${viewport.name}: prepared UI faded separately during reveal`);
    assert.equal(reveal.universeScene, "reconstruction", `${viewport.name}: background changed during reveal`);
    assert.equal(reveal.message, beforeSeparator.message, `${viewport.name}: next message was committed before curtain fade-out completed`);
    assert.equal(reveal.messageCommittedAt, beforeSeparator.messageCommittedAt, `${viewport.name}: message timestamp changed during curtain fade-out`);
    assert.equal(reveal.sectionTransitionCompletedAt, 0, `${viewport.name}: section completion was recorded before curtain fade-out completed`);
    assert.equal(reveal.dialogueVisible, false, `${viewport.name}: message UI was visible during curtain fade-out`);

    await separatorPage.waitForFunction(() => {
      const shell = document.querySelector(".true-end-shell");
      const message = document.querySelector(".true-end-message");
      return shell?.dataset.sectionTransitionPhase === "idle"
        && Number(shell.dataset.messageCommittedAt || 0) >= Number(shell.dataset.sectionTransitionCompletedAt || 0)
        && Boolean(message?.textContent);
    }, null, { timeout: 3_000, polling: 10 });
    const afterSeparator = await scanFrame(separatorPage);
    assert.equal(afterSeparator.separatorActive, false, `${viewport.name}: separating state remained after reveal`);
    assert.equal(afterSeparator.interfaceOpacity, 1, `${viewport.name}: prepared interface was not fully visible after reveal`);
    assert.equal(afterSeparator.sceneCardOpacity, 0, `${viewport.name}: separator remained visible after the interface returned`);
    assert.equal(afterSeparator.scene, "electronic-civilization", `${viewport.name}: separator did not advance to the next scene`);
    assert.equal(afterSeparator.counter, `${String(firstSceneSteps + 1).padStart(3, "0")} / 133`, `${viewport.name}: click burst advanced more than one message`);
    assert.notEqual(afterSeparator.message, beforeSeparator.message, `${viewport.name}: next message did not appear after curtain fade-out`);
    assert.equal(afterSeparator.dialogueVisible, true, `${viewport.name}: message UI stayed hidden after curtain fade-out`);
    assert(afterSeparator.sectionTransitionCompletedAt > separatorTriggeredAt, `${viewport.name}: section completion timestamp is missing`);
    assert(afterSeparator.sectionTransitionCompletedAt - separatorTriggeredAt >= 3_200, `${viewport.name}: section separator was not held long enough (${(afterSeparator.sectionTransitionCompletedAt - separatorTriggeredAt).toFixed(1)}ms)`);
    assert(afterSeparator.messageCommittedAt >= afterSeparator.sectionTransitionCompletedAt, `${viewport.name}: next message committed before section fade-out completed (${JSON.stringify({ section: afterSeparator.sectionTransitionCompletedAt, message: afterSeparator.messageCommittedAt })})`);
    assert(afterSeparator.messageCommittedAt > beforeSeparator.messageCommittedAt, `${viewport.name}: next message did not receive a new commit timestamp`);
    await separatorPage.screenshot({ path: path.join(outputDir, `${viewport.name}-separator-05-after.png`) });

    report.separatorOrder.push({
      viewport: viewport.name,
      before: beforeSeparator.message,
      during: reveal.message,
      after: afterSeparator.message,
      durationMs: afterSeparator.sectionTransitionCompletedAt - separatorTriggeredAt,
      webglFramesDuringTransition: ready.universeFrame - beforeSeparator.universeFrame,
      passed: true,
    });
    await separatorContext.close();
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

console.log(`True-end browser check passed: ${report.viewports.length} viewports / three approved scenes / dedicated score`);
