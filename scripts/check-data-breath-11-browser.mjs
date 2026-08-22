import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const [moduleRoot, executablePath, outputArgument, baseUrl = "http://127.0.0.1:4197"] = process.argv.slice(2);
if (!moduleRoot || !executablePath) throw new Error("Playwright module and browser executable are required");
const playwrightEntry = fs.existsSync(path.join(moduleRoot, "index.mjs"))
  ? path.join(moduleRoot, "index.mjs")
  : path.join(moduleRoot, "playwright", "index.mjs");
const { chromium } = await import(pathToFileURL(playwrightEntry).href);
const sharpEntry = fs.existsSync(path.join(moduleRoot, "sharp", "dist", "index.mjs"))
  ? path.join(moduleRoot, "sharp", "dist", "index.mjs")
  : path.join(moduleRoot, "sharp", "lib", "index.js");
const { default: sharp } = await import(pathToFileURL(sharpEntry).href);
const outputDir = path.resolve(outputArgument || "artifacts/data-breath-11");
fs.mkdirSync(outputDir, { recursive: true });

const snapshot = JSON.parse(fs.readFileSync(path.resolve("data/gaia-signals.json"), "utf8"));
const sourceMode = snapshot.modes.find((entry) => entry.id === "breathing-earth");
const seasonalRows = Array.from({ length: 101 }, (_, position) => {
  const rows = sourceMode.signals.co2;
  const index = Math.round((position / 100) * (rows.length - 1));
  const row = rows[index];
  return {
    index,
    position,
    seasonalPpm: row.averagePpm - row.deseasonalizedPpm,
  };
});
const minimumSeason = seasonalRows.reduce((best, row) => row.seasonalPpm < best.seasonalPpm ? row : best);
const maximumSeason = seasonalRows.reduce((best, row) => row.seasonalPpm > best.seasonalPpm ? row : best);

const report = {
  status: "running",
  baseUrl,
  consoleErrors: [],
  pageErrors: [],
  responses404: [],
  scans: [],
};

const hash = (buffer) => crypto.createHash("sha256").update(buffer).digest("hex");

const browser = await chromium.launch({
  headless: true,
  executablePath,
  args: ["--use-angle=swiftshader", "--enable-webgl", "--ignore-gpu-blocklist"],
});

try {
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    reducedMotion: "no-preference",
    colorScheme: "dark",
  });
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
  try {
    await page.waitForFunction(() => document.querySelector("#mode-title")?.textContent === "Measured Earth Breath", null, { timeout: 8_000 });
  } catch (error) {
    const diagnostics = await page.evaluate(() => ({
      title: document.querySelector("#mode-title")?.textContent || "",
      errorVisible: !document.querySelector("#error-panel")?.hidden,
      errorText: document.querySelector("#error-panel")?.textContent?.trim() || "",
    }));
    throw new Error(`Mode 11 did not initialize: ${JSON.stringify({ diagnostics, consoleErrors: report.consoleErrors, pageErrors: report.pageErrors })}`, { cause: error });
  }
  await page.evaluate(() => {
    document.body.classList.remove("gaia-opening-active");
    const opening = document.querySelector("#gaia-opening");
    if (opening) {
      opening.hidden = true;
      opening.inert = true;
      opening.setAttribute("aria-hidden", "true");
    }
    const intro = document.querySelector("#intro-layer");
    if (intro) {
      intro.hidden = true;
      intro.inert = true;
      intro.setAttribute("aria-hidden", "true");
    }
    document.querySelector(".experience")?.classList.remove("intro-open");
  });
  await page.waitForFunction(() => document.querySelector("#gaia-canvas")?.dataset.gosatTexture === "ready", null, { timeout: 15_000 });

  const modeCount = await page.locator("#mode-list .mode-button").count();
  const conceptCount = await page.locator("#concept-mode-list .concept-mode-button").count();
  assert.equal(modeCount, 20, "main mode bank must contain 20 buttons");
  assert.equal(conceptCount, 20, "concept mode bank must contain 20 buttons");
  assert.equal(await page.locator("#mode-number").textContent(), "11");
  assert.match(await page.locator("#mode-description").textContent(), /GOSATのXCO₂格子/u);
  assert(await page.locator("#error-panel").isHidden(), "WebGL error panel is visible");

  const sampleFrame = async (name, position) => {
    await page.locator("[data-signal-time]").first().evaluate((input, value) => {
      input.value = String(value);
      input.dispatchEvent(new Event("input", { bubbles: true }));
    }, position);
    await page.waitForTimeout(420);
    const scan = await page.evaluate(async () => {
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      const canvas = document.querySelector("#gaia-canvas");
      return {
        title: document.querySelector("#mode-title")?.textContent || "",
        number: document.querySelector("#mode-number")?.textContent || "",
        output: document.querySelector("[data-signal-time-output]")?.textContent || "",
        value: document.querySelector("[data-signal-value]")?.textContent || "",
        note: document.querySelector("[data-signal-note]")?.textContent || "",
        gosatTexture: canvas.dataset.gosatTexture || "",
        gosatFrame: canvas.dataset.gosatFrame || "",
        canvas: { width: canvas.width, height: canvas.height },
      };
    });
    const screenshotPath = path.join(outputDir, `${name}.png`);
    const screenshot = await page.screenshot({ path: screenshotPath, animations: "allow" });
    const { data: screenshotPixels, info } = await sharp(screenshot).removeAlpha().raw().toBuffer({ resolveWithObject: true });
    let red = 0;
    let green = 0;
    let blue = 0;
    let warmPixels = 0;
    let coolPixels = 0;
    let samples = 0;
    const stride = 8;
    for (let y = 0; y < info.height; y += stride) {
      for (let x = 0; x < info.width; x += stride) {
        const offset = (y * info.width + x) * info.channels;
        const r = screenshotPixels[offset];
        const g = screenshotPixels[offset + 1];
        const b = screenshotPixels[offset + 2];
        red += r;
        green += g;
        blue += b;
        if (r > b * 1.12 && r > 24) warmPixels += 1;
        if (b > r * 1.12 && b > 24) coolPixels += 1;
        samples += 1;
      }
    }
    scan.averageRgb = [red / samples, green / samples, blue / samples];
    scan.warmPixels = warmPixels;
    scan.coolPixels = coolPixels;
    scan.name = name;
    scan.position = position;
    scan.screenshot = screenshotPath;
    scan.sha256 = hash(screenshot);
    report.scans.push(scan);
    return scan;
  };

  const cool = await sampleFrame("pc-11-early-cool", 0);
  const warm = await sampleFrame("pc-11-current-warm", 100);
  const contracted = await sampleFrame("pc-11-seasonal-min", minimumSeason.position);
  const expanded = await sampleFrame("pc-11-seasonal-max", maximumSeason.position);

  for (const scan of report.scans) {
    assert.equal(scan.title, "Measured Earth Breath");
    assert.equal(scan.number, "11");
    assert.equal(scan.gosatTexture, "ready");
    assert.match(scan.note, /半径＝季節成分/u);
    assert.match(scan.note, /球面＝GOSAT XCO₂/u);
    assert(scan.gosatFrame, `${scan.name}: GOSAT frame key is missing`);
  }
  assert.notEqual(cool.sha256, warm.sha256, "cool and warm frames must differ");
  assert.notEqual(contracted.sha256, expanded.sha256, "seasonal minimum and maximum frames must differ");
  assert(warm.warmPixels > cool.warmPixels, `warm pixels did not increase (${cool.warmPixels} -> ${warm.warmPixels})`);
  assert.match(contracted.note, /季節成分 -/u);
  assert.match(expanded.note, /季節成分 \+/u);
  assert.deepEqual(report.consoleErrors, [], "console errors detected");
  assert.deepEqual(report.pageErrors, [], "page errors detected");
  assert.deepEqual(report.responses404, [], "404 responses detected");

  report.status = "passed";
  report.seasonalExtremes = { minimumSeason, maximumSeason };
  fs.writeFileSync(path.join(outputDir, "report.json"), `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify(report, null, 2));
  await context.close();
} finally {
  await browser.close();
}
