import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright-core";

const browserPath = process.argv[2] || "C:/Program Files/Google/Chrome/Application/chrome.exe";
const baseUrl = (process.argv[3] || "http://127.0.0.1:4198").replace(/\/$/u, "");
const outputDir = path.resolve(process.argv[4] || "artifacts/planet-signals");
fs.mkdirSync(outputDir, { recursive: true });

const atmosphereRows = Array.from({ length: 10 }, (_, index) => ({
  current: {
    time: "2026-09-04T00:00",
    wind_speed_10m: 2.5 + index * 0.7,
    wind_direction_10m: 20 + index * 31,
    surface_pressure: 1002 + index,
    cloud_cover: 22 + index * 6,
    shortwave_radiation: 180 + index * 45,
    pm2_5: 4 + index * 1.8,
    aerosol_optical_depth: 0.05 + index * 0.018,
  },
}));
const marineRows = Array.from({ length: 8 }, (_, index) => ({
  current: {
    time: "2026-09-04T00:00",
    wave_height: 0.7 + index * 0.32,
    wave_period: 5.5 + index * 0.7,
    wave_direction: 35 + index * 37,
  },
}));
const quakeFeatures = Array.from({ length: 18 }, (_, index) => ({
  type: "Feature",
  id: `test-quake-${index}`,
  geometry: { type: "Point", coordinates: [-170 + index * 19, -55 + (index % 8) * 14, 12 + index] },
  properties: { mag: 2.6 + index * 0.18, place: `TEST REGION ${index + 1}`, time: Date.now() - index * 2_400_000 },
}));

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

const mockLiveSources = async (page) => {
  await page.route("https://api.open-meteo.com/**", (route) => route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify(atmosphereRows),
  }));
  await page.route("https://air-quality-api.open-meteo.com/**", (route) => route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify(atmosphereRows),
  }));
  await page.route("https://marine-api.open-meteo.com/**", (route) => route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify(marineRows),
  }));
  await page.route("https://earthquake.usgs.gov/**", (route) => route.fulfill({
    status: 200,
    contentType: "application/geo+json",
    body: JSON.stringify({ type: "FeatureCollection", metadata: { generated: Date.now(), count: quakeFeatures.length }, features: quakeFeatures }),
  }));
  await page.route("https://services.swpc.noaa.gov/products/summary/solar-wind-speed.json", (route) => route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify([{ proton_speed: 517, time_tag: "2026-09-04T00:05:00Z" }]),
  }));
  await page.route("https://services.swpc.noaa.gov/products/summary/solar-wind-mag-field.json", (route) => route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify([{ bt: 7.2, bz_gsm: -4.1, time_tag: "2026-09-04T00:06:00Z" }]),
  }));
};

const openMap = async (page) => {
  await mockLiveSources(page);
  await page.goto(`${baseUrl}/#earth`, { waitUntil: "domcontentloaded", timeout: 90_000 });
  await page.waitForFunction(() => Boolean(globalThis.GaiaMapObservationAdapter && globalThis.GaiaPlanetSignals), null, { timeout: 30_000 });
  await page.evaluate(() => { location.hash = "#japan"; });
  await page.waitForFunction(() => document.querySelectorAll("#japan-firms-mode-list [data-planet-exhibit]").length === 5, null, { timeout: 20_000 });
  await page.evaluate(() => globalThis.GaiaModeEntryGuide?.close?.("map", { restoreFocus: false }));
};

const selectAndRead = async (page, index) => {
  const button = page.locator("#japan-firms-mode-list [data-planet-exhibit]").nth(index);
  const id = await button.getAttribute("data-planet-exhibit");
  await button.evaluate((element) => element.click());
  try {
    await page.waitForFunction((expected) => {
      const canvas = document.querySelector("#gaia-planet-signals-canvas");
      return canvas?.dataset.planetExhibit === expected && /^LIVE/u.test(canvas.dataset.planetSourceState || "") && Number(canvas.dataset.planetFrame) > 0;
    }, id, { timeout: 15_000 });
  } catch (error) {
    const state = await page.evaluate(() => ({
      canvas: { ...document.querySelector("#gaia-planet-signals-canvas")?.dataset },
      layer: { ...document.querySelector("#japan-layer")?.dataset },
      readout: { ...document.querySelector(".gaia-planet-signals-readout")?.dataset },
    }));
    throw new Error(`${error.message}\n${JSON.stringify(state, null, 2)}`);
  }
  return page.locator("#gaia-planet-signals-canvas").evaluate((canvas) => ({
    id: canvas.dataset.planetExhibit,
    engine: canvas.dataset.planetEngine,
    source: canvas.dataset.planetSourceState,
    points: Number(canvas.dataset.planetPointCount),
    particles: Number(canvas.dataset.planetParticleCount),
    frames: Number(canvas.dataset.planetFrame),
    width: canvas.width,
    height: canvas.height,
  }));
};

try {
  const desktopContext = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  const desktop = await desktopContext.newPage();
  monitor(desktop);
  await openMap(desktop);
  assert.equal(await desktop.locator("#japan-firms-mode-list .map-mode-button").count(), 6);
  assert.match(await desktop.locator("#map-mode-firms-label").textContent(), /LIVE OPEN DATA[\s\S]*6つの観測信号/u);
  const desktopEvidence = [];
  for (let index = 0; index < 5; index += 1) desktopEvidence.push(await selectAndRead(desktop, index));
  assert.deepEqual(desktopEvidence.map(({ id }) => id), [
    "global-wind-pressure",
    "global-ocean-pulse",
    "global-aerosol-light",
    "usgs-earthquake-ripples",
    "noaa-solar-wind",
  ]);
  assert(desktopEvidence.every(({ engine, source, particles, width, height }) => (
    engine === "canvas2d-particle-field" && /^LIVE/u.test(source) && particles >= 300 && width > 500 && height > 300
  )));
  await desktop.screenshot({ path: path.join(outputDir, "desktop-31-solar-wind.png"), fullPage: true });
  await desktopContext.close();

  const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
  const mobile = await mobileContext.newPage();
  monitor(mobile);
  await openMap(mobile);
  const mobileEvidence = await selectAndRead(mobile, 1);
  const mobileLayout = await mobile.evaluate(() => ({
    viewportWidth: innerWidth,
    documentWidth: document.documentElement.scrollWidth,
    readoutVisible: document.querySelector(".gaia-planet-signals-readout")?.getBoundingClientRect().height > 0,
    legendVisible: document.querySelector(".gaia-planet-signals-legend")?.getBoundingClientRect().width > 0,
  }));
  assert(mobileEvidence.particles >= 160);
  assert(mobileLayout.documentWidth <= mobileLayout.viewportWidth + 1, "mobile planet-signal exhibit overflows horizontally");
  assert.equal(mobileLayout.readoutVisible, true);
  assert.equal(mobileLayout.legendVisible, true);
  await mobile.screenshot({ path: path.join(outputDir, "mobile-28-ocean-pulse.png"), fullPage: true });
  await mobileContext.close();

  assert.deepEqual(errors, []);
  assert.deepEqual(responses404, []);
  console.log(JSON.stringify({ status: "passed", desktopEvidence, mobileEvidence, mobileLayout }, null, 2));
} finally {
  await browser.close();
}
