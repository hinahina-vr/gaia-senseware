import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const [moduleRoot, executablePath, outputArgument, baseUrl = "http://127.0.0.1:4202"] = process.argv.slice(2);
if (!moduleRoot || !executablePath) throw new Error("Playwright module root and browser executable are required");
const playwrightEntry = fs.existsSync(path.join(moduleRoot, "index.mjs"))
  ? path.join(moduleRoot, "index.mjs")
  : path.join(moduleRoot, "playwright", "index.mjs");
const { chromium } = await import(pathToFileURL(playwrightEntry).href);
const outputDir = path.resolve(outputArgument || "artifacts/mode-exit-buttons-browser");
fs.mkdirSync(outputDir, { recursive: true });

const viewports = [
  { name: "pc-1440", width: 1440, height: 900 },
  { name: "mobile-390", width: 390, height: 844 },
];
const surfaces = [
  { name: "map", trigger: "#japan-button", selector: "#japan-close", ready: "#japan-layer:not([hidden])" },
  { name: "story", trigger: "#story-button", selector: "#novel-close-button", ready: "#novel-layer:not([hidden])" },
  { name: "sound", trigger: "[data-sound-gallery-open]", selector: "#sound-close", ready: "#sound-layer:not([hidden])" },
];
const report = { status: "running", baseUrl, scans: [], consoleErrors: [], pageErrors: [], responses404: [] };
const browser = await chromium.launch({ headless: true, executablePath });

const attachDiagnostics = (page, viewport) => {
  page.on("console", (message) => { if (message.type() === "error") report.consoleErrors.push(`${viewport}: ${message.text()}`); });
  page.on("pageerror", (error) => report.pageErrors.push(`${viewport}: ${error.message}`));
  page.on("response", (response) => { if (response.status() === 404) report.responses404.push(`${viewport}: ${response.url()}`); });
};

const bypassOpening = async (page) => {
  await page.waitForFunction(() => document.querySelectorAll("#mode-list .mode-button").length === 10);
  await page.evaluate(() => {
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
    document.body.classList.remove("gaia-opening-active", "opening-active", "intro-open");
  });
};

const inspectButton = async (page, selector, viewport, surface) => {
  const locator = page.locator(selector);
  await locator.waitFor({ state: "visible", timeout: 15_000 });
  const data = await locator.evaluate((button) => {
    const rect = button.getBoundingClientRect();
    const style = getComputedStyle(button);
    const arrow = getComputedStyle(button, "::before");
    const hit = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
    const hitButton = hit?.closest("button");
    return {
      text: button.textContent.trim(),
      rect: rect.toJSON(),
      clipPath: style.clipPath,
      borderRadius: style.borderRadius,
      background: style.backgroundImage,
      transitionDuration: style.transitionDuration,
      arrow: arrow.content,
      hit: Boolean(hitButton === button),
      hitElement: hit ? `${hit.tagName.toLowerCase()}#${hit.id}.${hit.className}` : null,
      hitButtonId: hitButton?.id || null,
      overflowX: Math.max(0, document.documentElement.scrollWidth - innerWidth),
    };
  });
  assert(data.text.includes("戻る"), `${viewport}/${surface}: return label is missing`);
  assert(data.rect.height >= 44, `${viewport}/${surface}: hit area is under 44px`);
  assert(data.rect.width < 220, `${viewport}/${surface}: return control is still oversized`);
  assert.equal(data.hit, true, `${viewport}/${surface}: center hit is obstructed (${JSON.stringify(data)})`);
  if (surface === "story") {
    assert.equal(data.clipPath, "none", `${viewport}/${surface}: story control retained the angular mode silhouette`);
    assert(parseFloat(data.borderRadius) >= 10, `${viewport}/${surface}: compact story glass radius is missing`);
  } else {
    assert.notEqual(data.clipPath, "none", `${viewport}/${surface}: geometric silhouette is missing`);
    assert.equal(data.borderRadius, "0px", `${viewport}/${surface}: old capsule silhouette remains`);
  }
  assert(data.arrow.includes("←"), `${viewport}/${surface}: directional cue is missing`);
  assert.equal(data.overflowX, 0, `${viewport}/${surface}: horizontal overflow`);
  await locator.focus();
  assert.equal(await locator.evaluate((button) => document.activeElement === button), true, `${viewport}/${surface}: keyboard focus failed`);
  report.scans.push({ viewport, surface, ...data, passed: true });
};

try {
  for (const viewport of viewports) {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    attachDiagnostics(page, viewport.name);

    for (const surface of surfaces) {
      await page.goto(new URL("/", baseUrl).href, { waitUntil: "domcontentloaded" });
      await bypassOpening(page);
      await page.evaluate((selector) => document.querySelector(selector)?.click(), surface.trigger);
      await page.locator(surface.ready).waitFor({ state: "visible", timeout: 15_000 });
      await page.waitForFunction(() => !window.GaiaSceneTransition?.running);
      await inspectButton(page, surface.selector, viewport.name, surface.name);
      await page.screenshot({ path: path.join(outputDir, `${viewport.name}-${surface.name}.png`) });
      await page.locator(surface.selector).press("Enter");
      await page.locator(surface.ready).waitFor({ state: "hidden", timeout: 15_000 });
      report.scans.at(-1).keyboardActivated = true;
    }

    await page.goto(new URL("/", baseUrl).href, { waitUntil: "domcontentloaded" });
    await bypassOpening(page);
    await inspectButton(page, "#intro-button", viewport.name, "abstract");
    await page.screenshot({ path: path.join(outputDir, `${viewport.name}-abstract.png`) });
    await page.locator("#intro-button").press("Enter");
    await page.locator("#intro-layer:not([hidden])").waitFor({ state: "visible", timeout: 15_000 });
    report.scans.at(-1).keyboardActivated = true;
    await bypassOpening(page);

    await page.evaluate(() => window.GaiaSpace.open(0));
    await page.locator("#space-layer").waitFor({ state: "visible", timeout: 15_000 });
    await page.waitForFunction(() => !window.GaiaSceneTransition?.running);
    await inspectButton(page, "#space-close", viewport.name, "space");
    await page.screenshot({ path: path.join(outputDir, `${viewport.name}-space.png`) });
    await page.locator("#space-close").press("Enter");
    await page.locator("#space-layer").waitFor({ state: "hidden", timeout: 15_000 });
    report.scans.at(-1).keyboardActivated = true;

    await context.close();
  }

  assert.equal(report.consoleErrors.length, 0, `console errors: ${report.consoleErrors.join(" | ")}`);
  assert.equal(report.pageErrors.length, 0, `page errors: ${report.pageErrors.join(" | ")}`);
  assert.equal(report.responses404.length, 0, `404 responses: ${report.responses404.join(" | ")}`);
  report.status = "passed";
} catch (error) {
  report.status = "failed";
  report.failure = error instanceof Error ? error.stack : String(error);
  throw error;
} finally {
  fs.writeFileSync(path.join(outputDir, "report.json"), `${JSON.stringify(report, null, 2)}\n`, "utf8");
  await browser.close();
}

console.log(`Mode exit browser check passed: ${report.scans.length} surfaces`);
