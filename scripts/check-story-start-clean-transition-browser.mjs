import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const [moduleRoot, executablePath, outputArgument, baseUrl = "http://127.0.0.1:4174"] = process.argv.slice(2);
if (!moduleRoot || !executablePath) throw new Error("Playwright module root and browser executable are required");
const playwrightEntry = fs.existsSync(path.join(moduleRoot, "index.mjs"))
  ? path.join(moduleRoot, "index.mjs")
  : path.join(moduleRoot, "playwright", "index.mjs");
const { chromium } = await import(pathToFileURL(playwrightEntry).href);
const outputDir = path.resolve(outputArgument || "artifacts/story-start-clean-transition-browser");
fs.mkdirSync(outputDir, { recursive: true });

const REACHED_KEY = "gaiaSensewareTrueEnd:reached:v1";
const viewports = [
  { name: "pc-1440", width: 1440, height: 900 },
  { name: "mobile-390", width: 390, height: 844 },
];
const baseInterfaceSelectors = [
  "#novel-title-screen",
  "#novel-layer.is-title .novel-topbar",
  "#gaia-opening",
  "#gaia-opening .gaia-vn-final-copy",
  "#intro-layer",
  "#intro-layer .intro-shell",
  ".status",
  "#guide",
  "#mode-caption",
  ".mode-nav",
  ".actions",
];
const report = { status: "running", baseUrl, scans: [], consoleErrors: [], pageErrors: [], responses404: [] };

const scanBaseInterface = (page, elapsed) => page.evaluate(({ selectors, elapsedMs }) => ({
  elapsed: elapsedMs,
  phase: document.querySelector("#novel-layer")?.dataset.runtimeTransition || "",
  sceneTransitioning: document.body.classList.contains("scene-transitioning"),
  nodes: selectors.map((selector) => {
    const node = document.querySelector(selector);
    const style = node ? getComputedStyle(node) : null;
    const rect = node?.getBoundingClientRect();
    return {
      selector,
      hidden: node?.hidden ?? null,
      display: style?.display || "",
      visibility: style?.visibility || "",
      opacity: style?.opacity || "",
      painted: Boolean(
        node
        && style?.display !== "none"
        && style?.visibility !== "hidden"
        && Number(style?.opacity || 1) > 0
        && rect?.width > 0
        && rect?.height > 0
      ),
    };
  }),
}), { selectors: baseInterfaceSelectors, elapsedMs: elapsed });

const browser = await chromium.launch({ headless: true, executablePath });
try {
  for (const viewport of viewports) {
    const context = await browser.newContext({ viewport, reducedMotion: "no-preference" });
    await context.addInitScript(({ reachedKey }) => {
      localStorage.clear();
      localStorage.setItem(reachedKey, new Date().toISOString());
      localStorage.setItem("gaia-senseware-bgm-volume", "0");
      localStorage.setItem("gaiaSensewareNovel:config:v4", JSON.stringify({ messageSpeedPercent: 400, reducedMotion: false }));
    }, { reachedKey: REACHED_KEY });
    const page = await context.newPage();
    page.on("console", (message) => { if (message.type() === "error") report.consoleErrors.push(`${viewport.name}: ${message.text()}`); });
    page.on("pageerror", (error) => report.pageErrors.push(`${viewport.name}: ${error.message}`));
    page.on("response", (response) => { if (response.status() === 404) report.responses404.push(`${viewport.name}: ${response.url()}`); });

    await page.goto(new URL("/", baseUrl).href, { waitUntil: "domcontentloaded", timeout: 90_000 });
    await page.waitForFunction(() => Boolean(globalThis.GaiaNovel && !document.querySelector("#gaia-opening-sound-modal")?.hidden));
    await page.locator("#gaia-opening-sound-on").click();
    await page.waitForFunction(() => !document.querySelector("#gaia-opening-skip")?.hidden);
    await page.locator("#gaia-opening-skip").click();
    await page.waitForFunction(() => !document.querySelector("#gaia-opening-final-menu")?.hidden);
    await page.locator("#gaia-opening-route-story").click();
    await page.waitForFunction(() => Boolean(
      document.querySelector("#gaia-opening")?.hidden
      && document.querySelector("#novel-layer")?.classList.contains("is-title")
    ));
    await page.locator("#novel-start-button").click();
    await page.waitForFunction(() => document.body.classList.contains("scene-transitioning"));

    const samples = [];
    let elapsed = 0;
    for (const delay of [0, 240, 520, 300, 400, 400]) {
      if (delay) await page.waitForTimeout(delay);
      elapsed += delay;
      samples.push(await scanBaseInterface(page, elapsed));
      await page.screenshot({ path: path.join(outputDir, `${viewport.name}-${elapsed}ms.png`) });
    }
    await page.waitForFunction(() => document.querySelector("#novel-layer")?.dataset.runtimeReveal === "revealed");
    const leaked = samples.flatMap((sample) => sample.nodes
      .filter((node) => node.painted)
      .map((node) => `${sample.elapsed}ms ${node.selector}`));
    assert.deepEqual(leaked, [], `${viewport.name}: base interface painted during story start: ${leaked.join(", ")}`);
    report.scans.push({ viewport: viewport.name, samples, passed: true });
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

console.log(`Story start clean transition browser check passed: ${report.scans.length} viewports`);
