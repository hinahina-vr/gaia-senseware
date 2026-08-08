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
  ["foldedwind", "折り目の向こうの風"],
  ["snowfire", "雪火の観測信号"],
  ["snowafter", "雪火、軌道の外へ"],
  ["moonbook", "月明かりの観測ノート"],
  ["moonsave", "月下のSOURCE保存"],
  ["moonreopen", "月下、もう一度ひらく"],
];
const report = { status: "running", tracks: [], errors: [], responses404: [] };
const assert = (condition, message) => { if (!condition) throw new Error(message); };
const browser = await chromium.launch({ executablePath: chromePath, headless: true });

const attachDiagnostics = (page) => {
  page.on("pageerror", (error) => report.errors.push(error.message));
  page.on("console", (message) => { if (message.type() === "error") report.errors.push(message.text()); });
  page.on("response", (response) => { if (response.status() === 404) report.responses404.push(response.url()); });
};

let context;
try {
  context = await browser.newContext({ viewport: { width: 2048, height: 1114 } });
  const page = await context.newPage();
  attachDiagnostics(page);
  await page.goto(routeUrl, { waitUntil: "domcontentloaded" });
  await page.locator("#sound-layer").waitFor({ state: "visible", timeout: 15000 });
  assert(await page.locator("[data-sound-track]").count() === 10, "sound archive does not contain 10 unique tracks");
  assert((await page.locator(".sound-track-heading strong").innerText()) === "10 TRACKS", "track count heading is stale");

  const panelGeometry = await page.locator(".sound-track-panel").evaluate((panel) => {
    const rect = panel.getBoundingClientRect();
    return {
      scrolls: panel.scrollHeight > panel.clientHeight + 1,
      withinViewport: rect.top >= 0 && rect.bottom <= innerHeight,
    };
  });
  assert(panelGeometry.scrolls && panelGeometry.withinViewport, `desktop track list must scroll inside the viewport: ${JSON.stringify(panelGeometry)}`);

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
  await page.screenshot({ path: path.join(outputDir, "sound-desktop.png"), fullPage: true });
  await context.close();

  context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
  const mobile = await context.newPage();
  attachDiagnostics(mobile);
  await mobile.goto(routeUrl, { waitUntil: "domcontentloaded" });
  await mobile.locator("#sound-layer").waitFor({ state: "visible", timeout: 15000 });
  const mobileGeometry = await mobile.evaluate(() => ({
    count: document.querySelectorAll("[data-sound-track]").length,
    horizontalOverflow: document.documentElement.scrollWidth > innerWidth + 1,
    layoutScrolls: document.querySelector(".sound-layout").scrollHeight > document.querySelector(".sound-layout").clientHeight + 1,
  }));
  assert(mobileGeometry.count === 10 && !mobileGeometry.horizontalOverflow && mobileGeometry.layoutScrolls, `mobile sound archive layout failed: ${JSON.stringify(mobileGeometry)}`);
  const lastTrack = mobile.locator('[data-sound-track="moonreopen"]');
  await lastTrack.scrollIntoViewIfNeeded();
  await lastTrack.click();
  await mobile.waitForFunction(() => globalThis.GaiaOpeningAudio?.getState?.().track === "moonreopen", null, { timeout: 10000 });
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
