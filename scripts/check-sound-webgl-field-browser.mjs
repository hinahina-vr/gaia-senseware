import { mkdir } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const [playwrightRoot, chromePath, outputArg = "artifacts/sound-webgl-field", routeUrl = "http://127.0.0.1:4173/#sound"] = process.argv.slice(2);
if (!playwrightRoot || !chromePath) {
  throw new Error("usage: node scripts/check-sound-webgl-field-browser.mjs <playwright-root> <chrome-path> [output-dir] [url]");
}

const { chromium } = await import(pathToFileURL(path.join(playwrightRoot, "index.mjs")).href);
const outputDir = path.resolve(outputArg);
await mkdir(outputDir, { recursive: true });
const browser = await chromium.launch({
  executablePath: chromePath,
  headless: true,
  args: ["--enable-webgl", "--ignore-gpu-blocklist", "--disable-background-timer-throttling"],
});

const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

for (const viewport of [
  { name: "desktop", width: 2048, height: 1114 },
  { name: "mobile", width: 390, height: 844 },
]) {
  const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height } });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });

  await page.goto(routeUrl, { waitUntil: "domcontentloaded", timeout: 90_000 });
  await page.locator("#sound-layer").waitFor({ state: "visible", timeout: 15_000 });
  await page.waitForFunction(() => document.querySelector("#sound-visualizer")?.dataset.renderer === "webgl", null, { timeout: 15_000 });
  await page.locator('[data-sound-track="opening"]').click();
  await page.waitForFunction(() => {
    const canvas = document.querySelector("#sound-visualizer");
    return canvas?.dataset.analysisActive === "true"
      && [canvas.dataset.bass, canvas.dataset.mid, canvas.dataset.high].some((value) => Number(value) > 0.005)
      && Number(canvas.dataset.energy) > 0.005;
  }, null, { timeout: 15_000 });

  const scan = await page.locator("#sound-visualizer").evaluate((canvas) => {
    const rect = canvas.getBoundingClientRect();
    const style = getComputedStyle(canvas);
    return {
      rect: rect.toJSON(),
      renderer: canvas.dataset.renderer,
      visualizer: canvas.dataset.visualizer,
      presentation: canvas.dataset.presentation,
      shaderError: canvas.dataset.shaderError || "",
      bass: Number(canvas.dataset.bass),
      mid: Number(canvas.dataset.mid),
      high: Number(canvas.dataset.high),
      energy: Number(canvas.dataset.energy),
      opacity: Number(style.opacity),
      filter: style.filter,
      eqCount: document.querySelectorAll("#sound-eq-visualizer, .sound-eq-visualizer").length,
    };
  });

  assert(scan.renderer === "webgl" && !scan.shaderError, `${viewport.name}: WebGL shader failed: ${JSON.stringify(scan)}`);
  assert(scan.visualizer === "full-field-audio-ink" && scan.presentation === "full-screen-webgl", `${viewport.name}: wrong visualizer mode: ${JSON.stringify(scan)}`);
  assert(scan.eqCount === 0, `${viewport.name}: detached EQ visualizer remains`);
  assert(scan.rect.left <= 0 && scan.rect.top <= 0 && scan.rect.right >= viewport.width && scan.rect.bottom >= viewport.height, `${viewport.name}: WebGL field is not full-screen: ${JSON.stringify(scan)}`);
  assert(scan.opacity >= 0.9 && scan.filter.includes("saturate") && scan.filter.includes("contrast"), `${viewport.name}: WebGL field remains faint: ${JSON.stringify(scan)}`);
  assert(scan.energy > 0.005 && Math.max(scan.bass, scan.mid, scan.high) > 0.005, `${viewport.name}: audio analysis is not reaching WebGL: ${JSON.stringify(scan)}`);
  assert(errors.length === 0, `${viewport.name}: browser errors: ${errors.join(" | ")}`);

  await page.screenshot({ path: path.join(outputDir, `${viewport.name}-sound-webgl-field.png`), fullPage: false });
  await context.close();
}

await browser.close();
console.log("sound full-screen WebGL field check passed: desktop + mobile");
