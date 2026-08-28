import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const [moduleRoot, executablePath, outputArgument, baseUrl = "http://127.0.0.1:4173"] = process.argv.slice(2);
if (!moduleRoot || !executablePath) throw new Error("Playwright module and browser executable are required");
const playwrightEntry = fs.existsSync(path.join(moduleRoot, "index.mjs"))
  ? path.join(moduleRoot, "index.mjs")
  : path.join(moduleRoot, "playwright", "index.mjs");
const { chromium } = await import(pathToFileURL(playwrightEntry).href);
const outputDir = path.resolve(outputArgument || "artifacts/map-surface-switch");
fs.mkdirSync(outputDir, { recursive: true });

const browser = await chromium.launch({ headless: true, executablePath });
const report = { consoleErrors: [], pageErrors: [], responses404: [], scans: [] };

try {
  for (const viewport of [
    { name: "pc", width: 1440, height: 900 },
    { name: "tablet", width: 768, height: 900 },
    { name: "mobile", width: 390, height: 844 },
  ]) {
    const context = await browser.newContext({ viewport, colorScheme: "dark" });
    const page = await context.newPage();
    page.on("console", (message) => {
      if (message.type() === "error") report.consoleErrors.push(`${viewport.name}: ${message.text()}`);
    });
    page.on("pageerror", (error) => report.pageErrors.push(`${viewport.name}: ${error.message}`));
    page.on("response", (response) => {
      if (response.status() === 404) report.responses404.push(`${viewport.name}: ${response.url()}`);
    });

    await page.goto(new URL("/?preview=gaia-surface-switch-1#japan", baseUrl).href, { waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => typeof window.GaiaModeLoader?.load === "function");
    await page.evaluate(() => window.GaiaModeLoader.load("exploration"));
    await page.waitForFunction(() => document.documentElement.dataset.gaiaAppReady === "true");
    await page.evaluate(() => window.GaiaMapObservationAdapter.openMap());
    await page.waitForFunction(() => document.querySelector("#japan-layer")?.getAttribute("aria-hidden") === "false");

    const switchElement = page.locator(".map-surface-switch");
    const bankElement = page.locator(".map-mode-bank");
    assert.equal(await switchElement.isVisible(), true, `${viewport.name}: surface switch is hidden`);
    const scan = await page.evaluate(() => {
      const switchRect = document.querySelector(".map-surface-switch").getBoundingClientRect();
      const bankRect = document.querySelector(".map-mode-bank").getBoundingClientRect();
      const buttons = [...document.querySelectorAll(".map-surface-switch button")].map((button) => ({
        rect: button.getBoundingClientRect().toJSON(),
        pressed: button.getAttribute("aria-pressed"),
        radius: getComputedStyle(button).borderRadius,
      }));
      return {
        switchRect: switchRect.toJSON(),
        bankRect: bankRect.toJSON(),
        buttons,
        surfaceRadius: getComputedStyle(document.querySelector(".map-surface-switch")).borderRadius,
      };
    });

    assert.ok(scan.switchRect.width <= 203, `${viewport.name}: switch still stretches to ${scan.switchRect.width}px`);
    assert.equal(scan.buttons.filter((button) => button.pressed === "true").length, 1, `${viewport.name}: one surface must be active`);
    assert.match(scan.surfaceRadius, /999px/u, `${viewport.name}: switch is not visually compact`);
    if (viewport.name === "tablet") {
      assert.ok(scan.bankRect.width <= 341, `tablet: bank still stretches to ${scan.bankRect.width}px`);
      assert.ok(scan.buttons.every((button) => button.rect.height >= 34), "tablet: targets are too short");
    }
    if (viewport.name === "mobile") {
      assert.ok(scan.buttons.every((button) => button.rect.height >= 44), "mobile: touch targets are too short");
    }

    await page.locator("#map-surface-light").click();
    assert.equal(await page.locator("#map-surface-light").getAttribute("aria-pressed"), "true");
    await page.locator("#map-surface-map").click();
    assert.equal(await page.locator("#map-surface-map").getAttribute("aria-pressed"), "true");

    const screenshot = path.join(outputDir, `${viewport.name}-map-surface-switch.png`);
    await bankElement.screenshot({ path: screenshot });
    report.scans.push({ viewport, screenshot, ...scan });
    await context.close();
  }

  assert.deepEqual(report.consoleErrors, [], `console errors: ${report.consoleErrors.join("\n")}`);
  assert.deepEqual(report.pageErrors, [], `page errors: ${report.pageErrors.join("\n")}`);
  assert.deepEqual(report.responses404, [], `404 responses: ${report.responses404.join("\n")}`);
  report.status = "passed";
  fs.writeFileSync(path.join(outputDir, "report.json"), JSON.stringify(report, null, 2));
  console.log("GAIA map surface switch browser checks passed: 3 viewports.");
} finally {
  await browser.close();
}
