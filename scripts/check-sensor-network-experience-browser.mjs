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
      if (!/401 \(Unauthorized\)/u.test(text)) report.consoleErrors.push(`${viewport.name}: ${text}`);
    });
    page.on("pageerror", (error) => report.pageErrors.push(`${viewport.name}: ${error.message}`));
    page.on("response", (response) => { if (response.status() === 404) report.responses404.push(`${viewport.name}: ${response.url()}`); });

    await page.goto(new URL("/sensors/#map", baseUrl).href, { waitUntil: "domcontentloaded" });
    await page.locator("[data-view='map']").waitFor({ state: "visible" });
    await page.locator(".sensor-map-marker").first().waitFor({ state: "visible" });
    await page.waitForTimeout(900);
    assert.equal(await page.locator(".sensor-map-marker").count(), 5);
    assert.equal(await page.locator(".sensor-public-card").count(), 5);
    assert((await page.locator(".sensor-resonance-link").count()) >= 3);
    assert.match(await page.locator("#public-sync-rate").textContent(), /^\d{2}\.\d%$/u);
    assert.notEqual(await page.locator("#public-sync-rate").textContent(), "00.0%");
    assert.equal(await page.locator(".sensor-metric-hud-grid article").count(), 3);
    assert.equal(await page.locator(".sensor-sparkline polyline").count(), 3);

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
    }

    if (viewport.width > 760) {
      await page.locator(".sensor-public-card", { hasText: "あめセンサー" }).click();
      await page.waitForTimeout(650);
    } else {
      const ameMarker = page.locator(".sensor-map-marker", { hasText: "DEMO LIVE" }).filter({ has: page.locator("img[src*='amane']") });
      await ameMarker.click();
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
