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
const outputDir = path.resolve(outputArgument || "artifacts/route-bgm");
fs.mkdirSync(outputDir, { recursive: true });

const viewports = [
  { name: "pc-1440", width: 1440, height: 900 },
  { name: "mobile-390", width: 390, height: 844, mobile: true },
];
const report = { status: "running", scans: [], consoleErrors: [], pageErrors: [], responses404: [] };
const browser = await chromium.launch({ headless: true, executablePath });

try {
  for (const viewport of viewports) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      hasTouch: Boolean(viewport.mobile),
      isMobile: Boolean(viewport.mobile),
      reducedMotion: "reduce",
    });
    await context.addInitScript(() => {
      localStorage.clear();
      localStorage.setItem("gaia-senseware-bgm-volume", "0.2");
      localStorage.setItem("gaia:opening-route-guide:v2", "seen");
    });
    const page = await context.newPage();
    const audioResponses = [];
    page.on("console", (message) => { if (message.type() === "error") report.consoleErrors.push(`${viewport.name}: ${message.text()}`); });
    page.on("pageerror", (error) => report.pageErrors.push(`${viewport.name}: ${error.message}`));
    page.on("response", (response) => {
      if (/\/assets\/audio\//u.test(response.url())) audioResponses.push({ url: response.url(), status: response.status() });
      if (response.status() === 404) report.responses404.push(`${viewport.name}: ${response.url()}`);
    });

    await page.goto(new URL("/?routeGuide=0", baseUrl).href, { waitUntil: "domcontentloaded", timeout: 90_000 });
    await page.waitForFunction(() => Boolean(globalThis.GaiaOpeningAudio));
    await page.locator("#gaia-opening-sound-on").waitFor({ state: "visible" });
    if (viewport.mobile) await page.locator("#gaia-opening-sound-on").tap();
    else await page.locator("#gaia-opening-sound-on").click();
    await page.waitForFunction(() => document.querySelector("#gaia-opening-route-other")?.offsetParent !== null);
    await page.waitForFunction(() => globalThis.GaiaOpeningAudio?.getState?.().track === "opening");
    if (!audioResponses.some(({ url, status }) => url.includes("satellite-forecast-hope.mp3") && [200, 206].includes(status))) {
      await page.waitForResponse((response) => response.url().includes("satellite-forecast-hope.mp3") && [200, 206].includes(response.status()), { timeout: 10_000 });
    }
    assert(audioResponses.some(({ url, status }) => url.includes("satellite-forecast-hope.mp3") && [200, 206].includes(status)), `${viewport.name}: Planet Forecast - Hope was not requested by the opening`);

    const routeStartedAt = performance.now();
    if (viewport.mobile) await page.locator("#gaia-opening-route-other").tap();
    else await page.locator("#gaia-opening-route-other").click();
    await page.waitForFunction(() => globalThis.GaiaOpeningAudio?.getState?.().track === "senseware", null, { timeout: 10_000 });
    await page.waitForFunction(() => document.querySelector("#intro-layer")?.getAttribute("aria-hidden") === "false", null, { timeout: 10_000 });
    const routeSwitchMs = performance.now() - routeStartedAt;
    await page.waitForTimeout(120);
    assert(audioResponses.some(({ url, status }) => url.includes("moonlit-source-save.mp3") && [200, 206].includes(status)), `${viewport.name}: GAIA SENSEWARE was not requested by the data screen`);
    const destination = await page.evaluate(() => ({
      track: globalThis.GaiaOpeningAudio.getState().track,
      openingHidden: document.querySelector("#gaia-opening")?.hidden,
      introVisible: document.querySelector("#intro-layer")?.getAttribute("aria-hidden") === "false",
    }));
    assert.deepEqual(destination, { track: "senseware", openingHidden: true, introVisible: true });
    const screenshot = path.join(outputDir, `${viewport.name}-senseware-destination.png`);
    await page.screenshot({ path: screenshot, animations: "disabled" });

    await page.goto(new URL("/#japan", baseUrl).href, { waitUntil: "domcontentloaded", timeout: 90_000 });
    await page.waitForFunction(() => globalThis.GaiaOpeningAudio?.getState?.().track === "senseware");
    const directTrack = await page.evaluate(() => globalThis.GaiaOpeningAudio.getState().track);
    assert.equal(directTrack, "senseware", `${viewport.name}: direct GAIA SENSEWARE routes use the opening track`);
    report.scans.push({ viewport, routeSwitchMs, destination, directTrack, audioResponses, screenshot, passed: true });
    await context.close();
  }

  assert.deepEqual(report.consoleErrors, []);
  assert.deepEqual(report.pageErrors, []);
  assert.deepEqual(report.responses404, []);
  report.status = "passed";
  console.log(`Route BGM checks passed: ${report.scans.length} viewports.`);
} catch (error) {
  report.status = "failed";
  report.error = error instanceof Error ? error.stack : String(error);
  throw error;
} finally {
  fs.writeFileSync(path.join(outputDir, "report.json"), `${JSON.stringify(report, null, 2)}\n`);
  await browser.close();
}
