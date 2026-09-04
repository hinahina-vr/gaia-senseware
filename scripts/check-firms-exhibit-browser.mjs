import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright-core";

const browserPath = process.argv[2] || "C:/Program Files/Google/Chrome/Application/chrome.exe";
const baseUrl = (process.argv[3] || "http://127.0.0.1:4198").replace(/\/$/u, "");
const outputDir = path.resolve(process.argv[4] || "artifacts/firms-active-fire");
const ovationSnapshot = fs.readFileSync(path.resolve("data/ovation-aurora-snapshot.json"), "utf8");
fs.mkdirSync(outputDir, { recursive: true });

const browser = await chromium.launch({
  executablePath: browserPath,
  headless: true,
  args: ["--enable-webgl", "--ignore-gpu-blocklist", "--disable-background-timer-throttling"],
});
const errors = [];
const responses404 = [];

const monitor = (page) => {
  page.on("console", (message) => {
    const text = message.text();
    const unrelatedPreloadCapacityError = /ERR_NO_BUFFER_SPACE/u.test(text) && /assets\/visuals-/u.test(message.location().url || "");
    if (message.type() === "error" && !unrelatedPreloadCapacityError) errors.push(`${text} @ ${message.location().url || "inline"}`);
  });
  page.on("pageerror", (error) => errors.push(error.stack || error.message));
  page.on("response", (response) => { if (response.status() === 404) responses404.push(response.url()); });
};

const openMap = async (page) => {
  await page.route("https://services.swpc.noaa.gov/**", (route) => route.fulfill({ status: 200, contentType: "application/json", body: ovationSnapshot }));
  await page.goto(`${baseUrl}/#earth`, { waitUntil: "domcontentloaded", timeout: 90_000 });
  await page.waitForFunction(() => Boolean(globalThis.GaiaMapObservationAdapter && globalThis.GaiaFirmsExhibit), null, { timeout: 30_000 });
  await page.evaluate(() => { location.hash = "#japan"; });
  await page.waitForFunction(() => document.querySelectorAll("#japan-firms-mode-list [data-firms-exhibit]").length === 1, null, { timeout: 20_000 });
  await page.evaluate(() => globalThis.GaiaModeEntryGuide?.close?.("map", { restoreFocus: false }));
};

const selectFirms = async (page) => {
  await page.locator("[data-firms-exhibit]").evaluate((element) => element.click());
  await page.waitForFunction(() => document.querySelector("#japan-layer")?.classList.contains("is-firms-exhibit"));
  await page.waitForFunction(() => Number(document.querySelector("#gaia-firms-canvas")?.dataset.firmsPointCount) > 100, null, { timeout: 15_000 });
  await page.waitForFunction(() => document.querySelector("#gaia-firms-canvas")?.dataset.firmsEngine === "webgl-fire-particles", null, { timeout: 15_000 });
  await page.waitForTimeout(450);
  await page.evaluate(() => globalThis.GaiaModeEntryGuide?.close?.("map", { restoreFocus: false }));
  await page.waitForFunction(() => document.querySelector("#gaia-mode-entry-guide")?.hidden !== false);
};

const evidence = (page) => page.locator("#gaia-firms-canvas").evaluate((canvas) => ({
  engine: canvas.dataset.firmsEngine,
  points: Number(canvas.dataset.firmsPointCount),
  visible: Number(canvas.dataset.firmsVisibleCount),
  progress: Number(canvas.dataset.firmsPlaybackProgress),
  phase: canvas.dataset.firmsPlaybackPhase,
  sequence: canvas.dataset.firmsSequence,
  projection: canvas.dataset.firmsProjection,
  encoding: canvas.dataset.firmsAttributeEncoding,
  flashCadence: canvas.dataset.firmsFlashCadence,
  motion: canvas.dataset.firmsMotion,
  width: canvas.width,
  height: canvas.height,
}));

try {
  const desktopContext = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  const desktop = await desktopContext.newPage();
  monitor(desktop);
  await openMap(desktop);
  assert.equal(await desktop.locator(".map-mode-bank").getAttribute("aria-label"), "地図の31展示を選ぶ");
  assert.equal(await desktop.locator("#map-mode-bank-kicker").textContent(), "INSTALLATION BANK / MAP 01—31");
  assert.equal(await desktop.locator("#japan-firms-mode-list .map-mode-button").count(), 6);
  await selectFirms(desktop);
  const initial = await evidence(desktop);
  await desktop.waitForTimeout(3_000);
  const advancing = await evidence(desktop);
  assert.equal(advancing.engine, "webgl-fire-particles");
  assert(advancing.points > 100 && advancing.points <= 1_600);
  assert.equal(advancing.sequence, "acquisition-time");
  assert.equal(advancing.projection, "japan-centered-equirectangular-138");
  assert.equal(advancing.encoding, "frp-size-confidence-alpha-daynight-color");
  assert.equal(advancing.flashCadence, "none");
  assert.equal(advancing.motion, "spatial-continuous-non-pulsing");
  assert(advancing.progress > initial.progress, "acquisition-time replay did not advance");
  assert(advancing.visible > initial.visible, "fire detections did not appear sequentially");
  assert.equal(await desktop.locator(".gaia-firms-legend").isVisible(), true);
  assert.equal(await desktop.locator(".gaia-firms-readout").isVisible(), true);
  assert.match(await desktop.locator("[data-firms-latest]").textContent(), /^\d{4}\/\d{2}\/\d{2} \d{2}:\d{2} UTC$/u);
  assert.match(await desktop.locator("[data-firms-age]").textContent(), /^観測から/u);
  assert.equal(await desktop.locator(".gaia-live-city-marker:visible").count(), 0);
  assert.equal(await desktop.locator(".gaia-estat-marker:visible").count(), 0);
  assert.match(await desktop.locator(".gaia-firms-copy").innerText(), /火災の範囲ではなく.+熱異常/u);
  assert.match(await desktop.locator(".gaia-firms-actions a").getAttribute("href"), /^https:\/\/firms\.modaps\.eosdis\.nasa\.gov\//u);
  await desktop.locator("[data-firms-progress]").evaluate((input) => {
    input.value = "780";
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
  await desktop.waitForTimeout(400);
  const scrubbed = await evidence(desktop);
  assert.equal(scrubbed.phase, "scrub");
  assert(scrubbed.visible > scrubbed.points * 0.7);
  await desktop.screenshot({ path: path.join(outputDir, "desktop-26-active-fire.png"), fullPage: true });
  await desktop.locator("[data-firms-step='1']").click();
  await desktop.waitForFunction(() => !document.querySelector("#japan-layer")?.classList.contains("is-firms-exhibit"));
  assert.equal(await desktop.locator("#japan-mode-number").textContent(), "01");
  await desktopContext.close();

  const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
  const mobile = await mobileContext.newPage();
  monitor(mobile);
  await openMap(mobile);
  await selectFirms(mobile);
  await mobile.locator("[data-firms-progress]").evaluate((input) => {
    input.value = "700";
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
  await mobile.waitForTimeout(400);
  const mobileLayout = await mobile.evaluate(() => ({
    viewportWidth: innerWidth,
    documentWidth: document.documentElement.scrollWidth,
    titleFont: parseFloat(getComputedStyle(document.querySelector(".gaia-firms-chapter strong")).fontSize),
    valueFont: parseFloat(getComputedStyle(document.querySelector(".gaia-firms-primary > strong")).fontSize),
    legendVisible: document.querySelector(".gaia-firms-legend")?.getBoundingClientRect().width > 0,
  }));
  assert(mobileLayout.documentWidth <= mobileLayout.viewportWidth + 1, "mobile FIRMS exhibit overflows horizontally");
  assert(mobileLayout.titleFont >= 16);
  assert(mobileLayout.valueFont >= 26);
  assert.equal(mobileLayout.legendVisible, true);
  await mobile.screenshot({ path: path.join(outputDir, "mobile-26-active-fire.png"), fullPage: true });
  await mobileContext.close();

  assert.deepEqual(errors, []);
  assert.deepEqual(responses404, []);
  console.log(JSON.stringify({ status: "passed", baseUrl, initial, advancing, scrubbed, mobileLayout, errors, responses404 }, null, 2));
} finally {
  await browser.close();
}
