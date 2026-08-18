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
const outputDir = path.resolve(outputArgument || "artifacts/sensor-audio-continuity-browser");
fs.mkdirSync(outputDir, { recursive: true });

const viewports = [
  { name: "pc-1440", width: 1440, height: 900 },
  { name: "mobile-390", width: 390, height: 844 },
];
const report = { status: "running", baseUrl, scans: [], consoleErrors: [], pageErrors: [], responses404: [] };
const browser = await chromium.launch({ headless: true, executablePath });

try {
  for (const viewport of viewports) {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    await page.route("**/api/public/v1/sensors", (route) => route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ sensors: [] }) }));
    await page.route("**/api/web/v1/**", (route) => {
      const pathname = new URL(route.request().url()).pathname;
      let body = {};
      if (pathname.endsWith("/countries")) body = { countries: [] };
      else if (pathname.endsWith("/devices")) body = { devices: [] };
      else if (pathname.endsWith("/profile")) body = { profile: { displayName: "QA", avatarUrl: null, xUrl: null, githubUrl: null, instagramUrl: null } };
      else if (pathname.endsWith("/session")) body = { user: { id: "qa" } };
      return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(body) });
    });
    page.on("console", (message) => { if (message.type() === "error") report.consoleErrors.push(`${viewport.name}: ${message.text()}`); });
    page.on("pageerror", (error) => report.pageErrors.push(`${viewport.name}: ${error.message}`));
    page.on("response", (response) => { if (response.status() === 404) report.responses404.push(`${viewport.name}: ${response.url()}`); });

    await page.goto(new URL("/#earth", baseUrl).href, { waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => Boolean(globalThis.GaiaOpeningAudio));
    await page.evaluate(() => globalThis.GaiaOpeningAudio.setVolume(0.14, 0));
    await page.locator("#gaia-audio-toggle").click();
    await page.locator("#gaia-audio-toggle").click();
    await page.waitForFunction(() => globalThis.GaiaOpeningAudio?.getState?.().playing === true);
    await page.evaluate(() => globalThis.GaiaOpeningAudio.switchTrack("story", 0));
    await page.waitForFunction(() => globalThis.GaiaOpeningAudio?.getState?.().track === "story" && globalThis.GaiaOpeningAudio?.getState?.().playing === true);
    await page.waitForTimeout(900);
    const before = await page.evaluate(() => globalThis.GaiaOpeningAudio.getPlaybackState());

    await page.evaluate(() => {
      const source = document.querySelector("[data-sensor-platform-link]");
      const link = document.createElement("a");
      link.id = "sensor-audio-qa-link";
      link.href = source.href;
      link.textContent = "SENSOR QA";
      Object.assign(link.style, { position: "fixed", zIndex: "99999", inset: "12px auto auto 12px", padding: "14px" });
      document.body.append(link);
    });
    await page.locator("#sensor-audio-qa-link").click();
    await page.waitForURL(/\/sensors\/?$/u);
    await page.waitForFunction(() => Boolean(globalThis.GaiaOpeningAudio && document.querySelector("#sensor-audio-toggle")));
    await page.waitForFunction(() => globalThis.GaiaOpeningAudio?.getState?.().playing === true, null, { timeout: 10_000 });
    const after = await page.evaluate(() => {
      const state = globalThis.GaiaOpeningAudio.getPlaybackState();
      const button = document.querySelector("#sensor-audio-toggle");
      const rect = button.getBoundingClientRect();
      return {
        ...state,
        buttonHeight: rect.height,
        buttonWidth: rect.width,
        buttonLabel: button.getAttribute("aria-label"),
        needsAction: button.dataset.needsAction,
        overflowX: Math.max(0, document.documentElement.scrollWidth - innerWidth),
      };
    });
    assert.equal(after.track, before.track, `${viewport.name}: BGM track changed on sensor navigation`);
    assert.equal(after.muted, false, `${viewport.name}: BGM became muted on sensor navigation`);
    assert.equal(after.playing, true, `${viewport.name}: BGM stopped on sensor navigation`);
    assert(Math.abs(after.volume - before.volume) < 0.001, `${viewport.name}: BGM volume changed`);
    assert(after.currentTime >= Math.max(0, before.currentTime - 0.25), `${viewport.name}: BGM position was reset (${before.currentTime} -> ${after.currentTime})`);
    assert(after.buttonHeight >= 44 && after.buttonWidth >= 44, `${viewport.name}: audio control hit area is under 44px`);
    assert.equal(after.buttonLabel, "BGMを消音");
    assert.equal(after.needsAction, "false");
    assert.equal(after.overflowX, 0);

    await page.locator("#sensor-audio-toggle").click();
    await page.waitForFunction(() => globalThis.GaiaOpeningAudio?.getState?.().muted === true);
    await page.locator("#sensor-audio-toggle").click();
    await page.waitForFunction(() => globalThis.GaiaOpeningAudio?.getState?.().playing === true && globalThis.GaiaOpeningAudio?.getState?.().muted === false);
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => document.querySelector("#sensor-audio-toggle")?.dataset.needsAction === "true" || globalThis.GaiaOpeningAudio?.getState?.().playing === true, null, { timeout: 10_000 });
    const resumeRequired = await page.locator("#sensor-audio-toggle").getAttribute("data-needs-action") === "true";
    if (resumeRequired) await page.locator("#sensor-audio-toggle").click();
    await page.waitForFunction(() => globalThis.GaiaOpeningAudio?.getState?.().playing === true, null, { timeout: 10_000 });
    const reloaded = await page.evaluate(() => ({
      ...globalThis.GaiaOpeningAudio.getPlaybackState(),
      overflowX: Math.max(0, document.documentElement.scrollWidth - innerWidth),
    }));
    assert.equal(reloaded.track, "story");
    assert.equal(reloaded.playing, true);
    assert.equal(reloaded.muted, false);
    assert.equal(reloaded.overflowX, 0);
    await page.screenshot({ path: path.join(outputDir, `${viewport.name}.png`), fullPage: false });
    report.scans.push({ viewport: viewport.name, before, after, resumeRequired, reloaded, passed: true });
    await context.close();
  }
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

console.log(`Sensor audio continuity browser check passed: ${report.scans.length} viewports`);
