import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const [playwrightRoot, chromePath, outputArg = "artifacts/sound-browser", routeUrl = "http://127.0.0.1:4173/#sound"] = process.argv.slice(2);
if (!playwrightRoot || !chromePath) {
  throw new Error("usage: node scripts/check-sound-browser.mjs <playwright-root> <chrome-path> [output-dir] [url]");
}

const { chromium } = await import(pathToFileURL(path.join(playwrightRoot, "index.mjs")).href);
const outputDir = path.resolve(outputArg);
await mkdir(outputDir, { recursive: true });

const expectedTracks = [
  ["opening", "GAIA SENSEWARE"],
  ["story", "Planet Forecast — Windowlight"],
  ["windowlight", "Planet Forecast — Calm"],
  ["firstlight", "Planet Forecast — First Light"],
  ["foldedwind", "折り目の向こうの風"],
  ["snowfire", "雪火の観測信号"],
  ["snowafter", "雪火、軌道の外へ（未使用曲）"],
  ["moonbook", "月明かりの観測ノート"],
  ["moonsave", "Planet Forecast - Hope（未使用曲）"],
  ["moonreopen", "月下、もう一度ひらく（未使用曲）"],
  ["ending", "AfterSchool,AfterGlow"],
  ["trueend", "Sensory Horizon"],
];
const report = { status: "running", tracks: [], errors: [], responses404: [] };
const assert = (condition, message) => { if (!condition) throw new Error(message); };
const browser = await chromium.launch({ executablePath: chromePath, headless: true });

const attachDiagnostics = (page) => {
  page.on("pageerror", (error) => report.errors.push(error.message));
  page.on("console", (message) => { if (message.type() === "error") report.errors.push(message.text()); });
  page.on("response", (response) => { if (response.status() === 404) report.responses404.push(response.url()); });
};

const readControlDesign = (page) => page.evaluate(() => {
  const seek = document.querySelector(".sound-progress-group");
  const volume = document.querySelector(".sound-volume");
  const seekInput = document.querySelector("#sound-progress");
  const volumeInput = document.querySelector("#sound-volume");
  const title = document.querySelector("#sound-track-title");
  const volumeLabel = document.querySelector(".sound-volume-label strong");
  const styleValue = (node, name) => getComputedStyle(node).getPropertyValue(name).trim();
  return {
    seekLabel: seek?.textContent?.replace(/\s+/g, " ").trim() || "",
    volumeLabel: volume?.textContent?.replace(/\s+/g, " ").trim() || "",
    seekAccent: styleValue(seekInput, "--sound-control-accent"),
    volumeAccent: styleValue(volumeInput, "--sound-control-accent"),
    seekPattern: styleValue(seekInput, "--sound-track-pattern"),
    volumePattern: styleValue(volumeInput, "--sound-track-pattern"),
    seekBorderLeft: getComputedStyle(seek).borderLeftWidth,
    volumeBorderRight: getComputedStyle(volume).borderRightWidth,
    titleFont: getComputedStyle(title).fontFamily,
    volumeLabelFont: getComputedStyle(volumeLabel).fontFamily,
  };
});

const assertControlDesign = (design, label) => {
  assert(design.seekLabel.includes("再生位置") && design.seekLabel.includes("PLAYBACK"), `${label}: seek control label is ambiguous`);
  assert(design.volumeLabel.includes("音量") && design.volumeLabel.includes("VOLUME"), `${label}: volume control label is ambiguous`);
  assert(design.seekAccent && design.volumeAccent && design.seekAccent !== design.volumeAccent, `${label}: seek and volume accents are indistinguishable`);
  assert(design.seekAccent.toLowerCase() === "#efc879" && design.volumeAccent.toLowerCase() === "#8ce9cf", `${label}: seek and volume colors were not swapped`);
  assert(design.seekPattern === "dashed" && design.volumePattern === "solid", `${label}: dashed and solid track designs were not swapped`);
  assert(design.seekBorderLeft === "3px" && design.volumeBorderRight === "3px", `${label}: control shapes are not visually separated`);
  assert(design.titleFont.includes("Yu Mincho") && design.titleFont.includes("Noto Serif CJK JP"), `${label}: title font stack does not preserve the PC-first serif fallback`);
  assert(design.volumeLabelFont.includes("Yu Gothic UI") && design.volumeLabelFont.includes("Noto Sans CJK JP"), `${label}: UI font stack does not preserve the PC-first sans-serif fallback`);
};

let context;
try {
  context = await browser.newContext({ viewport: { width: 2048, height: 1114 } });
  const page = await context.newPage();
  page.setDefaultNavigationTimeout(90_000);
  attachDiagnostics(page);
  const audioRuntime = await page.request.get(new URL("/opening-audio.js", routeUrl).href);
  assert(audioRuntime.ok(), "opening audio runtime is unavailable");
  const audioRuntimeSource = await audioRuntime.text();
  assert(/opening:\s*"\.\/assets\/audio\/moonlit-source-save\.mp3"/u.test(audioRuntimeSource), "GAIA SENSEWARE does not use 月下のSOURCE保存");
  assert(/moonsave:\s*"\.\/assets\/audio\/satellite-forecast-hope\.mp3"/u.test(audioRuntimeSource), "former opening track was not archived as track 09");
  await page.goto(routeUrl, { waitUntil: "domcontentloaded" });
  await page.locator("#sound-layer").waitFor({ state: "visible", timeout: 15000 });
  await page.waitForFunction(() => !["", "pending"].includes(document.querySelector("#sound-visualizer")?.dataset.renderer || "pending"));
  const desktopVisualizer = await page.locator("#sound-visualizer").evaluate((canvas) => {
    const rect = canvas.getBoundingClientRect();
    return { renderer: canvas.dataset.renderer, width: rect.width, height: rect.height };
  });
  assert(desktopVisualizer.renderer === "webgl" && desktopVisualizer.width > 200 && desktopVisualizer.height > 200, `desktop WebGL visualizer failed: ${JSON.stringify(desktopVisualizer)}`);
  assert(await page.locator("[data-sound-track]").count() === 12, "sound archive does not contain 12 unique tracks");
  assert((await page.locator(".sound-track-heading strong").innerText()) === "12 TRACKS", "track count heading is stale");
  const unusedTrackIds = await page.locator("[data-sound-track]", { hasText: "（未使用曲）" }).evaluateAll((nodes) => nodes.map((node) => node.dataset.soundTrack));
  assert(JSON.stringify(unusedTrackIds) === JSON.stringify(["snowafter", "moonsave", "moonreopen"]), `unused track labels are incorrect: ${JSON.stringify(unusedTrackIds)}`);

  const panelGeometry = await page.locator(".sound-track-panel").evaluate((panel) => {
    const rect = panel.getBoundingClientRect();
    return {
      scrolls: panel.scrollHeight > panel.clientHeight + 1,
      withinViewport: rect.top >= 0 && rect.bottom <= innerHeight,
    };
  });
  assert(panelGeometry.scrolls && panelGeometry.withinViewport, `desktop track list must scroll inside the viewport: ${JSON.stringify(panelGeometry)}`);
  assertControlDesign(await readControlDesign(page), "desktop");

  for (const [id, title] of expectedTracks) {
    const button = page.locator(`[data-sound-track="${id}"]`);
    await button.scrollIntoViewIfNeeded();
    await button.click();
    await page.waitForFunction((track) => globalThis.GaiaOpeningAudio?.getState?.().track === track, id, { timeout: 10000 });
    await page.waitForFunction(() => (globalThis.GaiaOpeningAudio?.getPlaybackState?.().duration || 0) > 0, null, { timeout: 10000 });
    const state = await page.evaluate(() => globalThis.GaiaOpeningAudio.getPlaybackState());
    const renderedTitle = await page.locator("#sound-track-title").innerText();
    assert(renderedTitle === title, `${id} rendered the wrong title: ${renderedTitle}`);
    assert(state.duration > 0 && Number.isFinite(state.duration), `${id} has no playable duration`);
    assert(await button.getAttribute("aria-current") === "true", `${id} was not marked current`);
    report.tracks.push({ id, title, duration: state.duration });
  }
  await page.waitForFunction(() => {
    const frame = globalThis.GaiaOpeningAudio?.getAnalysisFrame?.();
    return frame?.supported && frame.active && frame.peak > 0.002 && frame.bands.some((value) => value > 0.001);
  }, null, { timeout: 10_000 });
  const analysisFrame = await page.evaluate(() => globalThis.GaiaOpeningAudio.getAnalysisFrame());
  assert(analysisFrame.bands.length === 3 && analysisFrame.rms > 0, `Web Audio analysis is inactive: ${JSON.stringify(analysisFrame)}`);
  report.analysisFrame = analysisFrame;
  await page.screenshot({ path: path.join(outputDir, "sound-desktop.png"), fullPage: true });
  await context.close();

  context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
  const mobile = await context.newPage();
  mobile.setDefaultNavigationTimeout(90_000);
  attachDiagnostics(mobile);
  await mobile.goto(routeUrl, { waitUntil: "domcontentloaded" });
  await mobile.locator("#sound-layer").waitFor({ state: "visible", timeout: 15000 });
  await mobile.waitForFunction(() => !["", "pending"].includes(document.querySelector("#sound-visualizer")?.dataset.renderer || "pending"));
  const mobileGeometry = await mobile.evaluate(() => ({
    count: document.querySelectorAll("[data-sound-track]").length,
    horizontalOverflow: document.documentElement.scrollWidth > innerWidth + 1,
    layoutScrolls: document.querySelector(".sound-layout").scrollHeight > document.querySelector(".sound-layout").clientHeight + 1,
    renderer: document.querySelector("#sound-visualizer")?.dataset.renderer || "",
    planetHidden: getComputedStyle(document.querySelector(".sound-planet")).display === "none",
    nowPlayingTop: document.querySelector(".sound-now-playing").getBoundingClientRect().top,
    visualizerTop: document.querySelector("#sound-visualizer").getBoundingClientRect().top,
  }));
  assert(mobileGeometry.count === 12 && !mobileGeometry.horizontalOverflow && mobileGeometry.layoutScrolls, `mobile sound archive layout failed: ${JSON.stringify(mobileGeometry)}`);
  assert(mobileGeometry.renderer === "webgl" && mobileGeometry.planetHidden && mobileGeometry.nowPlayingTop < mobileGeometry.visualizerTop, `mobile player was not raised above the WebGL visualizer: ${JSON.stringify(mobileGeometry)}`);
  assertControlDesign(await readControlDesign(mobile), "mobile");
  const lastTrack = mobile.locator('[data-sound-track="trueend"]');
  await lastTrack.scrollIntoViewIfNeeded();
  await lastTrack.click();
  await mobile.waitForFunction(() => globalThis.GaiaOpeningAudio?.getState?.().track === "trueend", null, { timeout: 10000 });
  await mobile.screenshot({ path: path.join(outputDir, "sound-mobile.png"), fullPage: false });
  await context.close();

  assert(report.errors.length === 0, `browser errors: ${report.errors.join(" | ")}`);
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

console.log(`sound browser check passed: ${report.tracks.length} new tracks / desktop + mobile`);
