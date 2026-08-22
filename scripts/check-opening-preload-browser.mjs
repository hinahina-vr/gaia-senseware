import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const [moduleRoot, executablePath, outputArgument, baseUrl = "http://127.0.0.1:4173"] = process.argv.slice(2);
if (!moduleRoot || !executablePath) throw new Error("Playwright module root and browser executable are required");
const entry = fs.existsSync(path.join(moduleRoot, "index.mjs")) ? path.join(moduleRoot, "index.mjs") : path.join(moduleRoot, "playwright", "index.mjs");
const { chromium } = await import(pathToFileURL(entry).href);
const outputDir = path.resolve(outputArgument || "artifacts/opening-preload-browser");
fs.mkdirSync(outputDir, { recursive: true });
const report = { status: "running", baseUrl, scans: [], consoleErrors: [], pageErrors: [], responses404: [] };
const browser = await chromium.launch({ headless: true, executablePath });

try {
  for (const viewport of [{ name: "pc-1440", width: 1440, height: 900 }, { name: "mobile-390", width: 390, height: 844 }]) {
    const context = await browser.newContext({ viewport, reducedMotion: "no-preference" });
    const page = await context.newPage();
    page.on("console", (message) => { if (message.type() === "error") report.consoleErrors.push(`${viewport.name}: ${message.text()}`); });
    page.on("pageerror", (error) => report.pageErrors.push(`${viewport.name}: ${error.message}`));
    page.on("response", (response) => { if (response.status() === 404) report.responses404.push(`${viewport.name}: ${response.url()}`); });
    await page.route("**/opening-mizuha-keyvisual-v1.png", async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      await route.continue();
    });
    await page.goto(new URL("/", baseUrl).href, { waitUntil: "domcontentloaded" });
    await page.locator("#gaia-opening-sound-modal").waitFor({ state: "visible" });
    assert.equal(await page.locator("#gaia-opening-preload").isVisible(), false, `${viewport.name}: preload appeared before sound setup`);
    assert.equal(await page.evaluate(() => document.querySelector("#gaia-opening")?.classList.contains("is-active")), false, `${viewport.name}: opening started before sound setup`);
    await page.locator("#gaia-opening-sound-off").click();
    await page.locator("#gaia-opening-sound-modal").waitFor({ state: "hidden" });
    await page.locator("#gaia-opening-preload").waitFor({ state: "visible" });
    const scan = await page.evaluate(() => {
      const preload = document.querySelector("#gaia-opening-preload");
      const meter = document.querySelector(".gaia-preload-meter");
      const status = document.querySelector("#gaia-preload-status");
      const percent = document.querySelector("#gaia-preload-percent");
      const visible = (element) => {
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        return style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0;
      };
      return {
        preloadVisible: visible(preload),
        preloadMarkCount: document.querySelectorAll(".gaia-preload-mark").length,
        percentVisible: visible(percent),
        meterVisible: visible(meter),
        statusVisible: visible(status),
        statusText: status.textContent.trim(),
        overflowX: Math.max(0, document.documentElement.scrollWidth - innerWidth),
        overflowY: Math.max(0, document.documentElement.scrollHeight - innerHeight),
      };
    });
    assert.equal(scan.preloadVisible, true);
    assert.equal(scan.preloadMarkCount, 0);
    assert.equal(scan.percentVisible, true);
    assert.equal(scan.meterVisible, true);
    assert.equal(scan.statusVisible, true);
    assert.match(scan.statusText, /オープニング/u);
    assert.equal(scan.overflowX, 0);
    assert.equal(scan.overflowY, 0);
    await page.evaluate(() => {
      const opening = document.querySelector("#gaia-opening");
      const preload = document.querySelector("#gaia-opening-preload");
      opening.classList.remove("is-preloaded");
      preload.hidden = false;
    });
    await page.screenshot({ path: path.join(outputDir, `${viewport.name}.png`) });
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

console.log("opening preload browser check passed");
