import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const [moduleRoot, executablePath, outputArgument, baseUrl = "http://127.0.0.1:4401"] = process.argv.slice(2);
if (!moduleRoot || !executablePath) throw new Error("Playwright module and browser executable are required");
const playwrightEntry = fs.existsSync(path.join(moduleRoot, "index.mjs"))
  ? path.join(moduleRoot, "index.mjs")
  : path.join(moduleRoot, "playwright", "index.mjs");
const { chromium } = await import(pathToFileURL(path.resolve(playwrightEntry)).href);
const outputDir = path.resolve(outputArgument || "artifacts/sensor-network-experience");
fs.mkdirSync(outputDir, { recursive: true });

const viewports = [
  { name: "pc-1440", width: 1440, height: 900 },
  { name: "mobile-390", width: 390, height: 844 },
];
const report = { status: "running", scans: [], consoleErrors: [], pageErrors: [], responses404: [] };
const browser = await chromium.launch({ headless: true, executablePath });

try {
  for (const viewport of viewports) {
    await fetch(new URL("/__qa/reset", baseUrl), { method: "POST" });
    const context = await browser.newContext({ viewport, reducedMotion: "no-preference" });
    const page = await context.newPage();
    page.on("console", (message) => {
      if (message.type() !== "error") return;
      const text = message.text();
      if (!/server responded with a status of 401\b/u.test(text)) report.consoleErrors.push(`${viewport.name}: ${text}`);
    });
    page.on("pageerror", (error) => report.pageErrors.push(`${viewport.name}: ${error.message}`));
    page.on("response", (response) => { if (response.status() === 404) report.responses404.push(`${viewport.name}: ${response.url()}`); });

    await page.goto(new URL("/sensors/#map", baseUrl).href, { waitUntil: "domcontentloaded" });
    await page.locator("[data-view='map']").waitFor({ state: "visible" });
    await page.locator(".sensor-map-marker").first().waitFor({ state: "visible" });
    await page.waitForTimeout(900);
    assert.equal(await page.locator(".sensor-map-marker").count(), 5);
    assert.equal(await page.locator(".sensor-public-card").count(), 5);
    assert.equal(await page.locator("#public-sensor-results").textContent(), "5 / 5件");
    assert((await page.locator(".sensor-resonance-link").count()) >= 3);
    assert.match(await page.locator("#public-sync-rate").textContent(), /^\d{2}\.\d%$/u);
    assert.notEqual(await page.locator("#public-sync-rate").textContent(), "00.0%");
    assert.equal(await page.locator(".sensor-metric-hud-grid article").count(), 3);
    assert.equal(await page.locator(".sensor-sparkline polyline").count(), 3);

    if (viewport.width > 760) {
      const collided = page.locator(".sensor-map-marker[data-collision-group]");
      assert((await collided.count()) >= 2);
      const collisionGroup = await collided.first().getAttribute("data-collision-group");
      const collisionPair = page.locator(`.sensor-map-marker[data-collision-group="${collisionGroup}"]`);
      const collisionLayout = await collisionPair.evaluateAll((markers) => {
        const centres = markers.map((marker) => {
          const rect = marker.getBoundingClientRect();
          return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
        });
        return { centres, distance: Math.hypot(centres[1].x - centres[0].x, centres[1].y - centres[0].y) };
      });
      assert(collisionLayout.distance >= 48, `collided markers remain too close: ${collisionLayout.distance}`);
      assert((await page.locator(".sensor-marker-tether").count()) >= 2);
      await collided.first().hover();
      const hoveredCentre = await collided.first().evaluate((marker) => {
        const rect = marker.getBoundingClientRect();
        return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
      });
      assert(Math.hypot(hoveredCentre.x - collisionLayout.centres[0].x, hoveredCentre.y - collisionLayout.centres[0].y) < .5);
      assert.equal(await page.locator("#public-sensor-directory").isVisible(), true);
      await page.locator("#public-sensor-query").fill("大阪");
      assert.equal(await page.locator(".sensor-public-card:visible").count(), 1);
      assert.equal(await page.locator(".sensor-map-marker:visible").count(), 1);
      assert.equal(await page.locator("#public-sensor-results").textContent(), "1 / 5件");
      await page.locator("#public-sensor-query").fill("");
      await page.locator("[data-public-filter='DEMO']").click();
      assert.equal(await page.locator(".sensor-public-card:visible").count(), 4);
      assert.equal(await page.locator("#public-sensor-results").textContent(), "4 / 5件");
      await page.locator("[data-public-filter='ALL']").click();
    } else {
      const topbarHeight = await page.locator(".sensor-topbar").evaluate((element) => element.getBoundingClientRect().height);
      assert(topbarHeight <= 110, `mobile map topbar is too tall: ${topbarHeight}`);
      assert.equal(await page.locator("#public-sensor-detail").getAttribute("data-expanded"), "false");
      const compactCardHeight = await page.locator("#public-sensor-detail").evaluate((element) => element.getBoundingClientRect().height);
      assert(compactCardHeight <= 130, `mobile sensor summary is too tall: ${compactCardHeight}`);
      assert.equal(await page.locator(".sensor-map-card-expand").isVisible(), true);
      assert.equal(await page.locator(".sensor-observation-hud").isVisible(), false);
      await page.screenshot({ path: path.join(outputDir, `${viewport.name}-summary.png`), fullPage: false });
      const map = page.locator("#public-sensor-map");
      const mapBox = await map.boundingBox();
      const centreX = mapBox.x + mapBox.width / 2;
      const centreY = mapBox.y + mapBox.height / 2;
      const zoomBeforePinch = await page.locator("#public-map-zoom").evaluate((output) => Number.parseFloat(output.value));
      await map.dispatchEvent("pointerdown", { pointerId: 41, pointerType: "touch", button: 0, buttons: 1, clientX: centreX - 42, clientY: centreY });
      await map.dispatchEvent("pointerdown", { pointerId: 42, pointerType: "touch", button: 0, buttons: 1, clientX: centreX + 42, clientY: centreY });
      await map.dispatchEvent("pointermove", { pointerId: 41, pointerType: "touch", button: -1, buttons: 1, clientX: centreX - 86, clientY: centreY });
      await map.dispatchEvent("pointermove", { pointerId: 42, pointerType: "touch", button: -1, buttons: 1, clientX: centreX + 86, clientY: centreY });
      await page.waitForTimeout(80);
      const zoomAfterPinch = await page.locator("#public-map-zoom").evaluate((output) => Number.parseFloat(output.value));
      assert(zoomAfterPinch > zoomBeforePinch * 1.45, `pinch did not zoom enough: ${zoomBeforePinch} -> ${zoomAfterPinch}`);
      assert.equal(await map.getAttribute("data-gesture"), "pinch");
      await map.dispatchEvent("pointerup", { pointerId: 41, pointerType: "touch", button: 0, buttons: 0, clientX: centreX - 86, clientY: centreY });
      await map.dispatchEvent("pointerup", { pointerId: 42, pointerType: "touch", button: 0, buttons: 0, clientX: centreX + 86, clientY: centreY });
      await page.locator("#public-map-directory-toggle").click();
      assert.equal(await page.locator("#public-sensor-directory").isVisible(), true);
      assert.equal(await page.locator("#public-map-directory-toggle").getAttribute("aria-expanded"), "true");
      await page.keyboard.press("Escape");
      assert.equal(await page.locator("#public-sensor-directory").isVisible(), false);
    }

    if (viewport.width > 760) {
      const sakuCard = page.locator(".sensor-public-card", { hasText: "sakuセンサー" });
      await sakuCard.click();
      await page.waitForTimeout(650);
      const focusDelta = await page.evaluate(() => {
        const map = document.querySelector("#public-sensor-map").getBoundingClientRect();
        const marker = document.querySelector(".sensor-map-marker[aria-current='true']").getBoundingClientRect();
        return {
          x: Math.abs(marker.left + marker.width / 2 - (map.left + map.width / 2)),
          y: Math.abs(marker.top + marker.height / 2 - (map.top + map.height / 2)),
        };
      });
      assert(focusDelta.x < 5 && focusDelta.y < 5);
      assert.match(await page.locator("#public-sensor-detail").textContent(), /識理層シンクロ率/u);
      assert.equal(await page.locator(".sensor-map-card-expand").isVisible(), false);
      assert.equal(await page.locator(".sensor-map-card-close").isVisible(), true);
      await page.locator(".sensor-map-card-close").click();
      assert.equal(await page.locator("#public-sensor-detail").isVisible(), false);
      await page.locator("#refresh-map").click();
      await page.waitForTimeout(250);
      assert.equal(await page.locator("#public-sensor-detail").isVisible(), false);
      assert.equal(await page.locator("#refresh-map").textContent(), "更新しました");
      assert.equal(await page.locator("#sensor-status").isVisible(), false);
    }

    if (viewport.width > 760) {
      await page.locator(".sensor-public-card", { hasText: "あめセンサー" }).click();
      await page.waitForTimeout(650);
    } else {
      const ameMarker = page.locator(".sensor-map-marker", { hasText: "DEMO LIVE" }).filter({ has: page.locator("img[src*='amane']") });
      await ameMarker.click();
      assert.equal(await page.locator("#public-sensor-detail").getAttribute("data-expanded"), "false");
      assert.equal(await page.locator(".sensor-observation-hud").isVisible(), false);
      await page.locator(".sensor-map-card-expand").click();
      assert.equal(await page.locator(".sensor-map-card-expand").getAttribute("aria-expanded"), "true");
      assert.equal(await page.locator(".sensor-observation-hud").isVisible(), true);
      await page.keyboard.press("Escape");
      assert.equal(await page.locator("#public-sensor-detail").getAttribute("data-expanded"), "false");
      assert.equal(await page.locator(".sensor-observation-hud").isVisible(), false);
      await page.locator(".sensor-map-card-expand").click();
    }
    assert.match(await page.locator("#public-sensor-detail").textContent(), /ダミーセンサー/u);
    assert.match(await page.locator("#public-sensor-detail").textContent(), /電界変動/u);
    const depthBefore = await page.locator("#public-depth-value").textContent();
    await page.locator(".sensor-oracle-trigger").click();
    await page.locator(".sensor-oracle-receipt.is-received").waitFor({ state: "visible" });
    assert.match(await page.locator(".sensor-oracle-receipt").textContent(), /SIMULATION LOG/u);
    assert.notEqual(await page.locator("#public-depth-value").textContent(), depthBefore);

    const scan = await page.evaluate(() => ({
      syncRate: document.querySelector("#public-sync-rate")?.textContent,
      activeNodes: document.querySelector("#public-active-nodes")?.textContent,
      packets: document.querySelector("#public-packet-count")?.textContent,
      resonanceLinks: document.querySelectorAll(".sensor-resonance-link").length,
      selected: document.querySelector("#public-sensor-detail h2")?.textContent,
      overflowX: document.documentElement.scrollWidth > innerWidth + 1,
      cardWithinViewport: (() => {
        const rect = document.querySelector("#public-sensor-detail").getBoundingClientRect();
        return rect.left >= -1 && rect.right <= innerWidth + 1 && rect.bottom <= innerHeight + 1;
      })(),
    }));
    assert.equal(scan.overflowX, false);
    assert.equal(scan.cardWithinViewport, true);
    await page.screenshot({ path: path.join(outputDir, `${viewport.name}-network.png`), fullPage: false });
    report.scans.push({ viewport: viewport.name, ...scan, passed: true });
    await context.close();
  }

  await fetch(new URL("/__qa/reset", baseUrl), { method: "POST" });
  const wideContext = await browser.newContext({ viewport: { width: 3840, height: 2160 }, reducedMotion: "reduce" });
  const widePage = await wideContext.newPage();
  await widePage.goto(new URL("/sensors/#map", baseUrl).href, { waitUntil: "domcontentloaded" });
  await widePage.locator(".sensor-map-canvas--overscan").waitFor({ state: "visible" });
  const canvasBudget = await widePage.locator(".sensor-map-canvas--overscan").evaluate((canvas) => ({
    pixels: canvas.width * canvas.height,
    declaredPixels: Number(canvas.dataset.renderPixels),
    renderScale: Number(canvas.dataset.renderScale),
  }));
  assert(canvasBudget.pixels <= 12_100_000, `4K map canvas exceeds its pixel budget: ${canvasBudget.pixels}`);
  assert.equal(canvasBudget.pixels, canvasBudget.declaredPixels);
  assert(canvasBudget.renderScale > 0 && canvasBudget.renderScale <= 1);
  report.scans.push({ viewport: "pc-3840", ...canvasBudget, passed: true });
  await wideContext.close();
  assert.deepEqual(report.consoleErrors, []);
  assert.deepEqual(report.pageErrors, []);
  assert.deepEqual(report.responses404, []);
  report.status = "passed";
} catch (error) {
  report.status = "failed";
  report.error = error.stack || String(error);
  throw error;
} finally {
  fs.writeFileSync(path.join(outputDir, "report.json"), `${JSON.stringify(report, null, 2)}\n`);
  await browser.close();
}

console.log("sensor network experience browser check passed");
