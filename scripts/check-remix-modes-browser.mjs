import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const [moduleRoot, executablePath, outputArgument, baseUrl = "http://127.0.0.1:4198"] = process.argv.slice(2);
if (!moduleRoot || !executablePath) throw new Error("Playwright module and browser executable are required");
const playwrightEntry = fs.existsSync(path.join(moduleRoot, "index.mjs"))
  ? path.join(moduleRoot, "index.mjs")
  : path.join(moduleRoot, "playwright", "index.mjs");
const sharpEntry = fs.existsSync(path.join(moduleRoot, "sharp", "dist", "index.mjs"))
  ? path.join(moduleRoot, "sharp", "dist", "index.mjs")
  : path.join(moduleRoot, "sharp", "lib", "index.js");
const { chromium } = await import(pathToFileURL(playwrightEntry).href);
const { default: sharp } = await import(pathToFileURL(sharpEntry).href);
const outputDir = path.resolve(outputArgument || "artifacts/remix-modes-20");
fs.mkdirSync(outputDir, { recursive: true });

const expected = [
  [11, "Measured Earth Breath"],
  [12, "Current Rush"],
  [13, "Rainforest Pulse"],
  [14, "Pollination Constellation"],
  [15, "Circular Foundry"],
  [16, "Scar City"],
  [17, "Seismic Chorus"],
  [18, "Ecology Prism"],
  [19, "Living Grid"],
  [20, "Gaia Synapse"],
];
const report = { status: "running", baseUrl, consoleErrors: [], pageErrors: [], responses404: [], modes: [] };
const hash = (buffer) => crypto.createHash("sha256").update(buffer).digest("hex");
const browser = await chromium.launch({
  headless: true,
  executablePath,
  args: ["--use-angle=swiftshader", "--enable-webgl", "--ignore-gpu-blocklist"],
});

try {
  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 }, colorScheme: "dark" });
  const page = await context.newPage();
  page.on("console", (message) => {
    if (message.type() === "error") report.consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => report.pageErrors.push(error.message));
  page.on("response", (response) => {
    if (response.status() === 404) report.responses404.push(response.url());
  });

  await page.goto(new URL("/?mode=11", baseUrl).href, { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => window.GaiaAppContent?.modes?.length === 20);
  await page.waitForFunction(() => document.querySelector("#mode-title")?.textContent === "Measured Earth Breath");
  await page.waitForFunction(() => {
    const canvas = document.querySelector("#gaia-canvas");
    return canvas?.dataset.landCoverTexture === "ready"
      && canvas?.dataset.nightLightsTexture === "ready";
  }, undefined, { timeout: 15_000 });
  await page.evaluate(() => {
    document.body.classList.remove("gaia-opening-active");
    for (const selector of ["#gaia-opening", "#intro-layer"]) {
      const layer = document.querySelector(selector);
      if (!layer) continue;
      layer.hidden = true;
      layer.inert = true;
      layer.setAttribute("aria-hidden", "true");
    }
    document.querySelector(".experience")?.classList.remove("intro-open");
  });

  assert.equal(await page.locator("#mode-list .mode-button").count(), 20);
  assert.equal(await page.locator("#concept-mode-list .concept-mode-button").count(), 20);
  assert(await page.locator("#error-panel").isHidden(), "WebGL error panel is visible");

  const screenshotBuffers = [];
  for (const [number, title] of expected) {
    await page.locator("#mode-list .mode-button").nth(number - 1).evaluate((button) => button.click());
    await page.waitForFunction(
      ({ expectedNumber, expectedTitle }) => document.querySelector("#mode-number")?.textContent === expectedNumber
        && document.querySelector("#mode-title")?.textContent === expectedTitle,
      { expectedNumber: String(number).padStart(2, "0"), expectedTitle: title },
    );
    await page.waitForTimeout(950);
    const state = await page.evaluate(() => ({
      number: document.querySelector("#mode-number")?.textContent || "",
      title: document.querySelector("#mode-title")?.textContent || "",
      titleJa: document.querySelector("#mode-title-ja")?.textContent || "",
      description: document.querySelector("#mode-description")?.textContent?.trim() || "",
      errorHidden: document.querySelector("#error-panel")?.hidden ?? false,
      landCoverTexture: document.querySelector("#gaia-canvas")?.dataset.landCoverTexture || "",
      nightLightsTexture: document.querySelector("#gaia-canvas")?.dataset.nightLightsTexture || "",
    }));
    assert.equal(state.errorHidden, true, `${number}: WebGL error panel is visible`);
    assert(state.description.length <= 80, `${number}: description is too long`);
    const filename = `pc-${number}-${title.toLowerCase().replaceAll(" ", "-")}.png`;
    const screenshotPath = path.join(outputDir, filename);
    const buffer = await page.screenshot({ path: screenshotPath, animations: "allow" });
    const visualCrop = await sharp(buffer).extract({ left: 320, top: 60, width: 1280, height: 840 }).resize(640, 420).png().toBuffer();
    screenshotBuffers.push(buffer);
    report.modes.push({ ...state, screenshot: screenshotPath, visualHash: hash(visualCrop) });
  }

  assert.equal(new Set(report.modes.map((mode) => mode.visualHash)).size, 10, "11-20 visual crops must all differ");
  assert(report.modes.find((mode) => mode.number === "13")?.landCoverTexture === "ready", "13: MODIS texture is not ready");
  assert(report.modes.find((mode) => mode.number === "16")?.nightLightsTexture === "ready", "16: VIIRS texture is not ready");
  assert(report.modes.find((mode) => mode.number === "18")?.landCoverTexture === "ready", "18: MODIS texture is not ready");
  assert.deepEqual(report.consoleErrors, [], "console errors detected");
  assert.deepEqual(report.pageErrors, [], "page errors detected");
  assert.deepEqual(report.responses404, [], "404 responses detected");

  const makeSheet = async (startIndex, filename) => {
    const tiles = await Promise.all(screenshotBuffers.slice(startIndex, startIndex + 5).map((buffer) => (
      sharp(buffer).resize(640, 360, { fit: "cover" }).png().toBuffer()
    )));
    const composites = tiles.map((input, index) => ({
      input,
      left: (index % 2) * 640,
      top: Math.floor(index / 2) * 360,
    }));
    await sharp({ create: { width: 1280, height: 1080, channels: 3, background: "#030b13" } })
      .composite(composites)
      .png()
      .toFile(path.join(outputDir, filename));
  };
  await makeSheet(0, "pc-comparison-11-15.png");
  await makeSheet(5, "pc-comparison-16-20.png");

  report.status = "passed";
  fs.writeFileSync(path.join(outputDir, "report.json"), `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify(report, null, 2));
  await context.close();
} finally {
  await browser.close();
}
