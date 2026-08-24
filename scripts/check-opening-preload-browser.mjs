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
    const requests = [];
    let requestPhase = "boot";
    await page.exposeFunction("__gaiaTestBootHandoff", () => { requestPhase = "sound-choice"; });
    await page.addInitScript(() => {
      window.addEventListener("gaia:boot-handoff", () => void window.__gaiaTestBootHandoff?.(), { once: true });
    });
    page.on("console", (message) => { if (message.type() === "error") report.consoleErrors.push(`${viewport.name}: ${message.text()}`); });
    page.on("pageerror", (error) => report.pageErrors.push(`${viewport.name}: ${error.message}`));
    page.on("response", (response) => { if (response.status() === 404) report.responses404.push(`${viewport.name}: ${response.url()}`); });
    page.on("request", (request) => requests.push({ url: request.url(), phase: requestPhase }));
    await page.route("**/opening.css*", async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      await route.continue();
    });
    await page.route("**/opening-mizuha-keyvisual-v1.png", async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      await route.continue();
    });
    await page.goto(new URL("/", baseUrl).href, { waitUntil: "commit" });
    await page.locator("#gaia-boot").waitFor({ state: "visible" });
    await page.waitForFunction(() => {
      const logo = document.querySelector(".gaia-boot__logo");
      return logo instanceof HTMLImageElement && logo.complete && logo.naturalWidth > 0;
    });
    const bootLogo = await page.evaluate(() => {
      const logo = document.querySelector(".gaia-boot__logo");
      const rect = logo.getBoundingClientRect();
      const canvas = document.createElement("canvas");
      canvas.width = 256;
      canvas.height = 86;
      const context = canvas.getContext("2d", { willReadFrequently: true });
      context.drawImage(logo, 0, 0, canvas.width, canvas.height);
      const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
      const alphas = [];
      for (let index = 3; index < pixels.length; index += 4) alphas.push(pixels[index]);
      return {
        src: logo.getAttribute("src"),
        alt: logo.alt,
        naturalWidth: logo.naturalWidth,
        naturalHeight: logo.naturalHeight,
        rect: { left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom, width: rect.width, height: rect.height },
        cornerAlpha: pixels[3],
        maximumAlpha: Math.max(...alphas),
        transparentPixels: alphas.filter((alpha) => alpha === 0).length,
        partialPixels: alphas.filter((alpha) => alpha > 0 && alpha < 255).length,
      };
    });
    assert.equal(bootLogo.src, "./assets/brand/brand-logo-dark-surface.png", `${viewport.name}: boot did not select the dark-surface logo`);
    assert.equal(bootLogo.alt, "惑星の放課後 — GAIA SENSATION", `${viewport.name}: boot logo alternative text changed`);
    assert.deepEqual([bootLogo.naturalWidth, bootLogo.naturalHeight], [2172, 724], `${viewport.name}: boot logo source dimensions changed`);
    assert.equal(bootLogo.cornerAlpha, 0, `${viewport.name}: boot logo background is not transparent`);
    assert(bootLogo.maximumAlpha >= 240 && bootLogo.transparentPixels > 1_000 && bootLogo.partialPixels > 1_000, `${viewport.name}: boot logo lost its solid strokes or soft alpha edges`);
    assert(bootLogo.rect.left >= 0 && bootLogo.rect.top >= 0 && bootLogo.rect.right <= viewport.width + 1 && bootLogo.rect.bottom <= viewport.height + 1, `${viewport.name}: boot logo escaped the viewport`);
    assert.equal(await page.locator("#gaia-opening-sound-modal").isVisible(), false, `${viewport.name}: sound setup appeared before critical styles`);
    assert.equal(await page.locator("#gaia-opening-preload").isVisible(), false, `${viewport.name}: opening preload replaced the lightweight boot view`);
    await page.screenshot({ path: path.join(outputDir, `${viewport.name}-boot.png`) });
    await page.locator("#gaia-opening-sound-modal").waitFor({ state: "visible" });
    await page.locator("#gaia-boot").waitFor({ state: "hidden" });
    if (requestPhase === "boot") requestPhase = "sound-choice";
    assert.equal(await page.locator("#gaia-opening-preload").isVisible(), false, `${viewport.name}: preload appeared before sound setup`);
    assert.equal(await page.evaluate(() => document.querySelector("#gaia-opening")?.classList.contains("is-active")), false, `${viewport.name}: opening started before sound setup`);
    const deferredDuringBoot = requests.filter(({ phase, url }) => phase === "boot" && /\/(?:assets\/audio|opening-(?:mizuha|amane)-keyvisual|open-data-archive-bg|gateway-keyvisual|mode-space-v2|sound-archive-bg|novel-title-keyvisual|novel-bg-festival-five-plane-projection)/u.test(url));
    assert.deepEqual(deferredDuringBoot, [], `${viewport.name}: later media started during the lightweight boot view`);
    assert(requests.some(({ phase, url }) => phase === "boot" && url.endsWith("/assets/brand/brand-logo-dark-surface.png")), `${viewport.name}: dark-surface logo was not requested during boot`);
    assert.equal(requests.some(({ url }) => url.endsWith("/assets/brand/brand-logo-light-surface.png")), false, `${viewport.name}: light-surface logo was unnecessarily requested on the dark boot`);
    await page.waitForTimeout(650);
    assert(requests.some(({ phase, url }) => phase === "sound-choice" && /opening-(?:mizuha|amane)-keyvisual/u.test(url)), `${viewport.name}: opening art did not warm during the sound choice`);
    assert.equal(requests.some(({ url }) => /\/assets\/audio\//u.test(url)), false, `${viewport.name}: audio started before consent`);
    requestPhase = "after-choice";
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
    assert(requests.some(({ phase, url }) => phase !== "boot" && url.includes("opening-mizuha-keyvisual-v1.png")), `${viewport.name}: opening art never started`);
    assert.equal(requests.some(({ url }) => /\/assets\/audio\//u.test(url)), false, `${viewport.name}: muted opening fetched audio`);
    await page.evaluate(() => {
      const opening = document.querySelector("#gaia-opening");
      const preload = document.querySelector("#gaia-opening-preload");
      opening.classList.remove("is-preloaded");
      preload.hidden = false;
    });
    await page.screenshot({ path: path.join(outputDir, `${viewport.name}.png`) });
    report.scans.push({ viewport: viewport.name, requests, ...scan, passed: true });
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
