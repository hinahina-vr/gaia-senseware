import { mkdir } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright-core";

const [routeUrl = "http://127.0.0.1:4173/?soundMorph=1#sound", outputArg = "artifacts/sound-morph-prototype"] = process.argv.slice(2);
const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const outputDir = path.resolve(outputArg);
await mkdir(outputDir, { recursive: true });

const browser = await chromium.launch({ executablePath: chromePath, headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 2048, height: 1114 }, deviceScaleFactor: 1 });
  await page.goto(routeUrl, { waitUntil: "domcontentloaded", timeout: 90_000 });
  await page.waitForFunction(() => {
    const layer = document.querySelector("#sound-layer");
    const scene = document.querySelector(".sound-character-scene");
    return layer?.classList.contains("is-open")
      && layer.classList.contains("sound-morph-prototype")
      && scene instanceof HTMLImageElement
      && scene.complete
      && scene.naturalWidth > 0
      && document.querySelectorAll(".sound-track-constellation").length === 12;
  }, null, { timeout: 75_000 });

  await page.waitForTimeout(1_200);
  const movingConstellation = page.locator(".sound-track-constellation").nth(1);
  const readConstellationMotion = () => movingConstellation.evaluate((element) => ({
    transform: getComputedStyle(element.querySelector("svg")).transform,
    starOpacity: getComputedStyle(element.querySelector("circle")).opacity,
    lineOpacity: getComputedStyle(element.querySelector("polyline")).strokeOpacity,
  }));
  const constellationMotionStart = await readConstellationMotion();
  await page.waitForTimeout(420);
  const constellationMotionEnd = await readConstellationMotion();
  if (JSON.stringify(constellationMotionStart) === JSON.stringify(constellationMotionEnd)) {
    throw new Error(`constellation animation is not advancing: ${JSON.stringify(constellationMotionStart)}`);
  }
  const idleScreenshotPath = path.join(outputDir, "sound-morph-idle.png");
  await page.locator(".sound-track-panel").screenshot({ path: idleScreenshotPath });
  const firstTrack = page.locator("[data-sound-track]").nth(0);
  const secondTrack = page.locator("[data-sound-track]").nth(1);
  await firstTrack.focus();
  await secondTrack.dispatchEvent("pointerenter");
  const exclusiveFocusState = await page.evaluate(() => ({
    expandedCount: document.querySelectorAll("[data-sound-track].is-morph-focus").length,
    expandedTrack: document.querySelector("[data-sound-track].is-morph-focus")?.getAttribute("data-sound-track"),
  }));
  const expectedExpandedTrack = await secondTrack.getAttribute("data-sound-track");
  if (exclusiveFocusState.expandedCount !== 1 || exclusiveFocusState.expandedTrack !== expectedExpandedTrack) {
    throw new Error(`multiple sound tracks expanded at once: ${JSON.stringify(exclusiveFocusState)}`);
  }
  await secondTrack.dispatchEvent("pointerleave");
  await page.evaluate(() => document.activeElement?.blur?.());
  const focusedTrack = page.locator('[data-sound-track="moonbook"]');
  const readMotionState = () => focusedTrack.evaluate((button) => ({
    width: Number(button.getBoundingClientRect().width.toFixed(2)),
    reveal: Number(button.querySelector(".sound-track-morph-canvas")?.dataset.reveal || 0),
    starPhase: Number(button.querySelector(".sound-track-morph-canvas")?.dataset.starPhase || 0),
    linePhase: Number(button.querySelector(".sound-track-morph-canvas")?.dataset.linePhase || 0),
    settlePhase: Number(button.querySelector(".sound-track-morph-canvas")?.dataset.settlePhase || 0),
    scanProgress: Number(button.querySelector(".sound-track-morph-canvas")?.dataset.scanProgress || 0),
    litNodes: Number(button.querySelector(".sound-track-morph-canvas")?.dataset.litNodes || 0),
    twinkle: Number(button.querySelector(".sound-track-morph-canvas")?.dataset.twinkle || 0),
    strokeHeadX: Number(button.querySelector(".sound-track-morph-canvas")?.dataset.strokeHeadX || 0),
  }));
  const motionSamples = [{ at: 0, ...(await readMotionState()) }];
  await focusedTrack.focus();
  await focusedTrack.evaluate((button) => button.classList.add("is-morph-focus"));
  await page.waitForTimeout(80);
  motionSamples.push({ at: 80, ...(await readMotionState()) });
  await page.waitForTimeout(80);
  motionSamples.push({ at: 160, ...(await readMotionState()) });
  await page.waitForTimeout(80);
  motionSamples.push({ at: 240, ...(await readMotionState()) });
  const transitionDetailScreenshotPath = path.join(outputDir, "sound-morph-transition-detail.png");
  await page.locator(".sound-track-panel").screenshot({ path: transitionDetailScreenshotPath });
  const transitionScreenshotPath = path.join(outputDir, "sound-morph-transition.png");
  await page.screenshot({ path: transitionScreenshotPath, fullPage: true });
  await page.waitForTimeout(360);
  motionSamples.push({ at: 600, ...(await readMotionState()) });
  const connectionDetailScreenshotPath = path.join(outputDir, "sound-morph-connection-detail.png");
  await page.locator(".sound-track-panel").screenshot({ path: connectionDetailScreenshotPath });
  await page.waitForTimeout(420);
  motionSamples.push({ at: 1020, ...(await readMotionState()) });
  await page.waitForTimeout(420);
  motionSamples.push({ at: 1440, ...(await readMotionState()) });
  await page.waitForTimeout(320);
  motionSamples.push({ at: 1760, ...(await readMotionState()) });
  await page.waitForTimeout(720);
  motionSamples.push({ at: 2480, ...(await readMotionState()) });

  const state = await focusedTrack.evaluate((button) => {
    const title = button.querySelector(".sound-track-name");
    const morphCanvas = button.querySelector(".sound-track-morph-canvas");
    const signalRibbon = document.querySelector(".sound-player-signal");
    const rect = button.getBoundingClientRect();
    return {
      width: rect.width,
      title: title?.textContent?.trim(),
      titleOpacity: Number.parseFloat(getComputedStyle(title).opacity),
      morphRenderer: morphCanvas?.dataset.rendered,
      morphReveal: Number(morphCanvas?.dataset.reveal || 0),
      morphNodes: Number(morphCanvas?.dataset.nodes || 0),
      morphPaths: Number(morphCanvas?.dataset.paths || 0),
      scopeRenderer: morphCanvas?.dataset.scope,
      formationSequence: morphCanvas?.dataset.sequence,
      scanProgress: Number(morphCanvas?.dataset.scanProgress || 0),
      litNodes: Number(morphCanvas?.dataset.litNodes || 0),
      twinkle: Number(morphCanvas?.dataset.twinkle || 0),
      signalRibbonRenderer: signalRibbon?.dataset.renderer,
      signalRibbonWaveform: signalRibbon?.dataset.waveform,
      signalRibbonFrames: Number(signalRibbon?.dataset.frame || 0),
      signalRibbonWidth: signalRibbon?.getBoundingClientRect().width || 0,
      backgroundSource: document.querySelector(".sound-character-scene")?.getAttribute("src"),
    };
  });

  if (state.width < 800 || state.title !== "月明かりの観測ノート" || state.titleOpacity < 0.7 || state.morphRenderer !== "true" || state.morphReveal < 0.99 || state.morphNodes < 12 || state.morphPaths < 20 || state.scopeRenderer !== "phosphor-waveform-trace" || state.formationSequence !== "left-to-right-single-stroke" || state.scanProgress < 0.99 || state.litNodes < 12 || state.signalRibbonRenderer !== "audio-waveform-ribbon" || state.signalRibbonWaveform !== "live-signal-ribbon" || state.signalRibbonFrames < 1 || state.signalRibbonWidth < 500) {
    throw new Error(`morph focus did not reach its visible state: ${JSON.stringify(state)}`);
  }
  if (state.backgroundSource !== "./assets/visuals-07/sound-archive-bg-v2.png?v=gaia-sound-linked-ink-1") {
    throw new Error(`sound background changed unexpectedly: ${state.backgroundSource}`);
  }
  if (new Set(motionSamples.map((sample) => sample.width)).size < 3 || new Set(motionSamples.map((sample) => sample.reveal)).size < 4) {
    throw new Error(`morph animation did not produce enough intermediate frames: ${JSON.stringify(motionSamples)}`);
  }
  const scanningFrames = motionSamples.filter((sample) => sample.scanProgress > 0 && sample.scanProgress < 1);
  if (scanningFrames.length < 2 || scanningFrames.some((sample, index) => index > 0 && sample.scanProgress < scanningFrames[index - 1].scanProgress)) {
    throw new Error(`title scan did not advance sequentially from left to right: ${JSON.stringify(motionSamples)}`);
  }
  if (motionSamples.some((sample, index) => index > 0 && sample.litNodes < motionSamples[index - 1].litNodes)) {
    throw new Error(`constellation stars did not light after the drawing head passed: ${JSON.stringify(motionSamples)}`);
  }
  await page.waitForTimeout(420);
  const settledTwinkle = await readMotionState();
  if (Math.abs(settledTwinkle.twinkle - state.twinkle) < 0.001) throw new Error(`settled constellation stars are not twinkling: ${JSON.stringify({ before: state.twinkle, after: settledTwinkle.twinkle })}`);

  const screenshotPath = path.join(outputDir, "sound-morph-focused.png");
  await page.screenshot({ path: screenshotPath, fullPage: true });
  const detailScreenshotPath = path.join(outputDir, "sound-morph-focus-detail.png");
  await page.locator(".sound-track-panel").screenshot({ path: detailScreenshotPath });

  const titleCards = [];
  const allTracks = page.locator("[data-sound-track]");
  for (let index = 0; index < await allTracks.count(); index += 1) {
    const button = allTracks.nth(index);
    await page.evaluate(() => document.querySelectorAll(".is-morph-focus").forEach((element) => element.classList.remove("is-morph-focus")));
    await button.focus();
    await button.evaluate((element) => element.classList.add("is-morph-focus"));
    await page.waitForTimeout(2_480);
    titleCards.push({
      title: await button.getAttribute("aria-label"),
      image: (await button.screenshot({ type: "png" })).toString("base64"),
    });
  }
  const contactPage = await browser.newPage({ viewport: { width: 1800, height: 1120 }, deviceScaleFactor: 1 });
  await contactPage.setContent(`<!doctype html><meta charset="utf-8"><style>
    *{box-sizing:border-box}body{margin:0;padding:20px;background:#020b16;color:#dffff7;font:13px Consolas,sans-serif}
    main{display:grid;grid-template-columns:1fr 1fr;gap:14px 18px}.card{min-width:0}.label{height:20px;color:#8fb8b1;letter-spacing:.06em}
    img{display:block;width:100%;height:142px;object-fit:contain;object-position:left center;border:1px solid #173d48;background:#03111e}
  </style><main>${titleCards.map((card) => `<section class="card"><div class="label">${card.title.replaceAll("&", "&amp;").replaceAll("<", "&lt;")}</div><img src="data:image/png;base64,${card.image}"></section>`).join("")}</main>`);
  const allTitlesScreenshotPath = path.join(outputDir, "sound-morph-all-titles.png");
  await contactPage.screenshot({ path: allTitlesScreenshotPath, fullPage: true });
  await contactPage.close();

  const mobilePage = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true });
  await mobilePage.goto(routeUrl, { waitUntil: "domcontentloaded", timeout: 90_000 });
  await mobilePage.waitForFunction(() => document.querySelector("#sound-layer")?.classList.contains("is-open"), null, { timeout: 75_000 });
  await mobilePage.waitForTimeout(800);
  const mobileState = await mobilePage.evaluate(() => ({
    viewportWidth: window.innerWidth,
    documentWidth: document.documentElement.scrollWidth,
    prototypeEnabled: document.querySelector("#sound-layer")?.classList.contains("sound-morph-prototype"),
    rawConstellationWidth: document.querySelector(".sound-track-constellation")?.getBoundingClientRect().width || 0,
    signalRibbonWidth: document.querySelector(".sound-player-signal")?.getBoundingClientRect().width || 0,
    signalRibbonRenderer: document.querySelector(".sound-player-signal")?.dataset.renderer,
    signalRibbonFrames: Number(document.querySelector(".sound-player-signal")?.dataset.frame || 0),
  }));
  if (mobileState.documentWidth > mobileState.viewportWidth + 1) {
    throw new Error(`mobile sound mode overflows horizontally: ${JSON.stringify(mobileState)}`);
  }
  if (mobileState.signalRibbonWidth < 300 || mobileState.signalRibbonRenderer !== "audio-waveform-ribbon" || mobileState.signalRibbonFrames < 1) {
    throw new Error(`responsive signal ribbon is missing from mobile layout: ${JSON.stringify(mobileState)}`);
  }
  const mobileScreenshotPath = path.join(outputDir, "sound-morph-mobile.png");
  await mobilePage.screenshot({ path: mobileScreenshotPath, fullPage: true });
  await mobilePage.close();

  console.log(JSON.stringify({ status: "ok", idleScreenshotPath, transitionScreenshotPath, transitionDetailScreenshotPath, connectionDetailScreenshotPath, screenshotPath, detailScreenshotPath, allTitlesScreenshotPath, mobileScreenshotPath, state, exclusiveFocusState, constellationMotion: { start: constellationMotionStart, end: constellationMotionEnd }, motionSamples, mobileState }, null, 2));
} finally {
  await browser.close();
}
