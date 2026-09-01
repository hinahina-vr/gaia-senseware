import assert from "node:assert/strict";
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { chromium } from "playwright-core";


const argumentsList = process.argv.slice(2);
const option = (name) => {
  const index = argumentsList.indexOf(name);
  return index >= 0 ? argumentsList[index + 1] : undefined;
};
const browserPath = option("--browser");
if (!browserPath) throw new Error("--browser is required");

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const output = path.resolve(option("--output") || "artifacts/live-open-meteo-browser");
fs.mkdirSync(output, { recursive: true });
const mime = new Map([
  [".css", "text/css; charset=utf-8"],
  [".html", "text/html; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".mp3", "audio/mpeg"],
  [".png", "image/png"],
  [".svg", "image/svg+xml"],
  [".webp", "image/webp"],
  [".woff2", "font/woff2"],
]);

const server = http.createServer((request, response) => {
  const pathname = decodeURIComponent(new URL(request.url || "/", "http://127.0.0.1").pathname);
  const relative = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
  const file = path.resolve(root, relative);
  if (file !== root && !file.startsWith(`${root}${path.sep}`)) {
    response.writeHead(403).end();
    return;
  }
  try {
    const body = fs.readFileSync(file);
    response.writeHead(200, {
      "Cache-Control": "no-store",
      "Content-Length": body.length,
      "Content-Type": mime.get(path.extname(file).toLowerCase()) || "application/octet-stream",
    });
    response.end(request.method === "HEAD" ? undefined : body);
  } catch {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
  }
});

await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const origin = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({ executablePath: browserPath, headless: true });
const errors = [];
const responses404 = [];

const contracts = [
  { id: "wind-field", key: "weatherWindSpeed", number: "09", title: "風脈" },
  { id: "carbon-pulse", key: "forecastCo2", number: "10", title: "炭素の呼吸" },
  { id: "rain-chorus", key: "weatherPrecipitation", number: "11", title: "雨の記憶" },
  { id: "temperature-field", key: "weatherTemperature", number: "12", title: "熱の輪郭" },
  { id: "cloud-drift", key: "cloudCover", number: "13", title: "雲の層" },
  { id: "pm25-haze", key: "pm25", number: "14", title: "微粒子の霞" },
];

const monitor = (page) => {
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.stack || error.message));
  page.on("response", (response) => {
    if (response.status() === 404) responses404.push(response.url());
  });
};

try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  monitor(page);
  await page.goto(`${origin}/#earth`, { waitUntil: "domcontentloaded", timeout: 90_000 });
  await page.waitForFunction(() => Boolean(globalThis.GaiaMapObservationAdapter), null, { timeout: 30_000 });
  await page.evaluate(() => { location.hash = "#japan"; });
  await page.waitForFunction(() => document.querySelectorAll("#japan-mode-list [data-live-exhibit]").length === 6, null, { timeout: 20_000 });
  assert.equal(await page.locator("#map-mode-bank-kicker").textContent(), "INSTALLATION BANK / MAP 01—14");
  assert.equal(await page.locator("#japan-mode-list .map-mode-button").count(), 14);

  const fallbackKeys = await page.evaluate(async () => {
    const payload = await fetch("./data/live-observation-fallback-v1.json").then((response) => response.json());
    return payload.events.flatMap((event) => event.measurements || []).map((measurement) => measurement.key);
  });
  for (const contract of contracts) assert(fallbackKeys.includes(contract.key), `${contract.key}: fallback value missing`);

  const screenshots = [];
  for (let index = 0; index < contracts.length; index += 1) {
    const contract = contracts[index];
    await page.locator(`#japan-mode-list [data-live-exhibit="${contract.id}"]`).evaluate((button) => button.click());
    await page.waitForFunction((mode) => document.querySelector("#gaia-live-exhibit-canvas")?.dataset.webglMode === String(mode), index);
    await page.waitForFunction(() => Number(document.querySelector("#gaia-live-exhibit-canvas")?.dataset.webglFrame || 0) > 0);
    const state = await page.locator("#gaia-live-exhibit-canvas").evaluate((canvas) => ({
      anchorLatitude: Number(canvas.dataset.anchorLatitude),
      anchorLongitude: Number(canvas.dataset.anchorLongitude),
      deckModeCount: document.querySelectorAll(".gaia-live-deck-modes [data-live-deck-mode]").length,
      deckRect: (() => {
        const rect = document.querySelector(".gaia-live-exhibit-readout")?.getBoundingClientRect();
        return rect ? { top: rect.top, right: rect.right, bottom: rect.bottom, left: rect.left, width: rect.width } : null;
      })(),
      guideRect: (() => {
        const element = document.querySelector("#gaia-mode-entry-guide .gaia-mode-entry-guide-card");
        const rect = element?.getBoundingClientRect();
        return rect && rect.width > 0 ? { top: rect.top, right: rect.right, bottom: rect.bottom, left: rect.left, width: rect.width } : null;
      })(),
      layerState: (() => {
        const element = document.querySelector(".japan-layer");
        return { className: element?.className || "", hidden: element?.hasAttribute("hidden") || false };
      })(),
      missing: document.querySelector(".gaia-live-exhibit-readout")?.dataset.missing,
      signalKey: canvas.dataset.signalKey,
      title: document.querySelector("#japan-title")?.textContent,
    }));
    assert.equal(state.signalKey, contract.key);
    assert.equal(state.title, contract.title);
    assert.equal(state.missing, "false");
    assert.equal(state.anchorLatitude, 35.6762);
    assert.equal(state.anchorLongitude, 139.6503);
    assert.equal(state.deckModeCount, 6);
    assert(state.deckRect && state.deckRect.left >= 0 && state.deckRect.right <= 1440, `${contract.id}: deck leaves the viewport`);
    if (state.guideRect) assert(state.guideRect.bottom <= state.deckRect.top + 1, `${contract.id}: guide overlaps deck ${JSON.stringify(state)}`);
    assert.match(await page.locator("[data-live-anchor-source]").textContent(), /MODEL GRID/u);
    assert.match(await page.locator("[data-live-exhibit-source]").textContent(), /OPEN-METEO/u);
    assert.match(await page.locator("[data-live-exhibit-feed-copy]").textContent(), /モデル|キャッシュ/u);
    await page.waitForTimeout(700);
    const overlap = await page.evaluate(() => {
      const deck = document.querySelector(".gaia-live-exhibit-readout")?.getBoundingClientRect();
      const guideElement = document.querySelector("#gaia-mode-entry-guide .gaia-mode-entry-guide-card");
      const guide = guideElement?.getBoundingClientRect();
      if (!deck || !guide || guide.width <= 0) return null;
      return { deckTop: deck.top, guideBottom: guide.bottom };
    });
    if (overlap) assert(overlap.guideBottom <= overlap.deckTop + 1, `${contract.id}: guide overlaps deck ${JSON.stringify(overlap)}`);
    const screenshot = path.join(output, `live-${contract.number}.png`);
    await page.screenshot({ path: screenshot, animations: "disabled" });
    screenshots.push(screenshot);
  }

  await page.evaluate(() => globalThis.GaiaModeEntryGuide?.close?.("map", { restoreFocus: false }));
  await page.locator('#japan-mode-list [data-live-exhibit="wind-field"]').evaluate((button) => button.click());
  await page.waitForFunction(() => document.querySelector("#gaia-live-exhibit-canvas")?.dataset.webglMode === "0");
  const poiBeforeWheel = await page.evaluate(() => {
    const canvas = document.querySelector("#gaia-live-exhibit-canvas");
    const overlay = document.querySelector("#japan-overlay");
    return {
      x: Number(canvas?.dataset.anchorNormalizedX),
      y: Number(canvas?.dataset.anchorNormalizedY),
      zoom: Number(overlay?.dataset.earthZoom),
    };
  });
  const mapBox = await page.locator("#japan-map").boundingBox();
  assert(mapBox, "live map bounds were unavailable");
  const wheelPoint = { x: mapBox.x + mapBox.width * 0.62, y: mapBox.y + mapBox.height * 0.34 };
  await page.mouse.move(wheelPoint.x, wheelPoint.y);
  const wheelTarget = await page.evaluate(({ x, y }) => {
    const element = document.elementFromPoint(x, y);
    return { id: element?.id || "", className: element?.className || "", tagName: element?.tagName || "" };
  }, wheelPoint);
  await page.mouse.wheel(0, -180);
  await page.waitForTimeout(180);
  const poiAfterWheel = await page.evaluate(() => {
    const canvas = document.querySelector("#gaia-live-exhibit-canvas");
    const overlay = document.querySelector("#japan-overlay");
    return {
      x: Number(canvas?.dataset.anchorNormalizedX),
      y: Number(canvas?.dataset.anchorNormalizedY),
      zoom: Number(overlay?.dataset.earthZoom),
    };
  });
  assert(poiAfterWheel.zoom > poiBeforeWheel.zoom, `wheel did not zoom the live map: ${JSON.stringify({ mapBox, wheelPoint, wheelTarget, poiBeforeWheel, poiAfterWheel })}`);
  assert(Math.abs(poiAfterWheel.x - poiBeforeWheel.x) <= 0.002, `POI moved horizontally during wheel zoom: ${JSON.stringify({ poiBeforeWheel, poiAfterWheel })}`);
  assert(Math.abs(poiAfterWheel.y - poiBeforeWheel.y) <= 0.002, `POI moved vertically during wheel zoom: ${JSON.stringify({ poiBeforeWheel, poiAfterWheel })}`);

  await page.locator("[data-live-deck-source]").click();
  await page.waitForFunction(() => document.querySelector("#japan-data-panel")?.getAttribute("aria-hidden") === "false");
  await page.locator("#japan-data-close").click();
  await page.locator("[data-live-deck-analysis]").click();
  await page.waitForFunction(() => document.querySelector("#gaia-statistics-lab")?.getAttribute("aria-hidden") === "false");
  await page.locator("#gaia-statistics-close").click();

  await page.setViewportSize({ width: 3840, height: 2160 });
  await page.locator('#japan-mode-list [data-live-exhibit="wind-field"]').evaluate((button) => button.click());
  await page.waitForFunction(() => document.querySelector("#gaia-live-exhibit-canvas")?.dataset.webglMode === "0");
  const wideLayout = await page.evaluate(() => ({
    chapterVisible: document.querySelector(".gaia-live-deck-chapter")?.getBoundingClientRect().width > 0,
    deckWidth: document.querySelector(".gaia-live-exhibit-readout")?.getBoundingClientRect().width || 0,
    locationVisible: document.querySelector(".gaia-live-deck-location")?.getBoundingClientRect().width > 0,
    overflow: document.documentElement.scrollWidth - innerWidth,
  }));
  assert.equal(wideLayout.chapterVisible, true);
  assert.equal(wideLayout.locationVisible, true);
  assert(wideLayout.deckWidth >= 3700, `wide deck is too narrow: ${wideLayout.deckWidth}px`);
  assert(wideLayout.overflow <= 1, `wide horizontal overflow: ${wideLayout.overflow}px`);
  const wideScreenshot = path.join(output, "live-09-wide.png");
  await page.screenshot({ path: wideScreenshot, animations: "disabled" });
  screenshots.push(wideScreenshot);

  await page.locator('#japan-mode-list [data-live-exhibit="pm25-haze"]').evaluate((button) => button.click());
  await page.waitForFunction(() => document.querySelector("#gaia-live-exhibit-canvas")?.dataset.webglMode === "5");
  const wideMetricLayout = await page.evaluate(() => {
    const title = document.querySelector("[data-live-exhibit-title-ja]")?.getBoundingClientRect();
    const value = document.querySelector("[data-live-exhibit-value]")?.getBoundingClientRect();
    const titleElement = document.querySelector("[data-live-exhibit-title-ja]");
    return {
      title: title ? { top: title.top, right: title.right, bottom: title.bottom, left: title.left, height: title.height } : null,
      value: value ? { top: value.top, right: value.right, bottom: value.bottom, left: value.left } : null,
      whiteSpace: titleElement ? getComputedStyle(titleElement).whiteSpace : "",
    };
  });
  assert.equal(wideMetricLayout.whiteSpace, "nowrap");
  assert(wideMetricLayout.title && wideMetricLayout.title.height < 45, `wide title wrapped: ${JSON.stringify(wideMetricLayout)}`);
  assert(wideMetricLayout.value && wideMetricLayout.title.right <= wideMetricLayout.value.left + 1, `wide title overlaps value: ${JSON.stringify(wideMetricLayout)}`);
  const wideMetricScreenshot = path.join(output, "live-14-wide.png");
  await page.screenshot({ path: wideMetricScreenshot, animations: "disabled" });
  screenshots.push(wideMetricScreenshot);
  await context.close();

  const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const mobilePage = await mobileContext.newPage();
  monitor(mobilePage);
  await mobilePage.goto(`${origin}/#earth`, { waitUntil: "domcontentloaded", timeout: 90_000 });
  await mobilePage.waitForFunction(() => Boolean(globalThis.GaiaMapObservationAdapter), null, { timeout: 30_000 });
  await mobilePage.evaluate(() => { location.hash = "#japan"; });
  await mobilePage.waitForFunction(() => document.querySelectorAll("#japan-mode-list [data-live-exhibit]").length === 6, null, { timeout: 20_000 });
  await mobilePage.locator('#japan-mode-list [data-live-exhibit="pm25-haze"]').evaluate((button) => button.click());
  await mobilePage.waitForFunction(() => document.querySelector("#gaia-live-exhibit-canvas")?.dataset.webglMode === "5");
  const mobileLayout = await mobilePage.evaluate(() => ({
    bodyOverflow: document.documentElement.scrollWidth - innerWidth,
    readoutVisible: document.querySelector(".gaia-live-exhibit-readout")?.getBoundingClientRect().width > 0,
    buttonCount: document.querySelectorAll("#japan-mode-list .map-mode-button").length,
  }));
  assert(mobileLayout.bodyOverflow <= 1, `mobile horizontal overflow: ${mobileLayout.bodyOverflow}px`);
  assert.equal(mobileLayout.readoutVisible, true);
  assert.equal(mobileLayout.buttonCount, 14);
  const mobileScreenshot = path.join(output, "live-14-mobile.png");
  await mobilePage.screenshot({ path: mobileScreenshot, animations: "disabled" });
  await mobileContext.close();

  assert.deepEqual(responses404, []);
  assert.deepEqual(errors, []);
  console.log(JSON.stringify({ status: "passed", exhibits: contracts.length, screenshots: [...screenshots, mobileScreenshot] }));
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
