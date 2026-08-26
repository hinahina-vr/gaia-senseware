import assert from "node:assert/strict";
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";

const rawArguments = process.argv.slice(2);
const option = (name) => {
  const index = rawArguments.indexOf(name);
  return index >= 0 ? rawArguments[index + 1] : undefined;
};
const legacyArguments = rawArguments[0] && !rawArguments[0].startsWith("--") ? rawArguments : [];
const executablePath = option("--browser") || process.env.GAIA_BROWSER_PATH || legacyArguments[1];
const outputArgument = option("--output") || legacyArguments[2];
const baseUrlArgument = option("--base-url") || legacyArguments[3];
if (!executablePath) throw new Error("A real Google Chrome executable is required via --browser or GAIA_BROWSER_PATH");
const outputDir = path.resolve(outputArgument || "artifacts/contest-experience-browser");
fs.mkdirSync(outputDir, { recursive: true });
const report = { status: "running", performance: null, layouts: [], entry: {}, tour: {}, resilience: {}, consoleErrors: [], pageErrors: [], unhandledRejections: [], responses404: [] };
const sourceRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const mime = new Map([[".html", "text/html; charset=utf-8"], [".js", "text/javascript; charset=utf-8"], [".css", "text/css; charset=utf-8"], [".json", "application/json; charset=utf-8"], [".svg", "image/svg+xml"], [".png", "image/png"], [".webp", "image/webp"], [".mp3", "audio/mpeg"], [".woff2", "font/woff2"]]);
let qaServer = null;
const startLocalServer = () => new Promise((resolve) => {
  qaServer = http.createServer((request, response) => {
    const pathname = decodeURIComponent(new URL(request.url || "/", "http://127.0.0.1").pathname);
    const relative = pathname === "/" || pathname === "/story" || pathname === "/story/" ? "index.html" : pathname.replace(/^\/+/, "");
    const file = path.resolve(sourceRoot, relative);
    if (file !== sourceRoot && !file.startsWith(`${sourceRoot}${path.sep}`)) { response.writeHead(403).end(); return; }
    try {
      const body = fs.readFileSync(file);
      response.writeHead(200, { "Content-Type": mime.get(path.extname(file).toLowerCase()) || "application/octet-stream", "Cache-Control": "no-store", "Content-Length": body.length });
      response.end(request.method === "HEAD" ? undefined : body);
    } catch {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Not found");
    }
  });
  qaServer.listen(0, "127.0.0.1", () => resolve(`http://127.0.0.1:${qaServer.address().port}`));
});
const baseUrl = baseUrlArgument || await startLocalServer();

// The local QA server can be paused while a separate browser command is being
// scheduled. Wake it before opening a clean browser context so server-process
// scheduling is not counted as page LCP.
const warmupResponse = await fetch(new URL("/", baseUrl));
assert.equal(warmupResponse.ok, true, `QA server warmup ${warmupResponse.status}`);
await warmupResponse.arrayBuffer();

const monitor = (page, name, { allowExpectedAbort = false } = {}) => {
  void page.addInitScript(() => {
    addEventListener("unhandledrejection", (event) => {
      const reason = event.reason instanceof Error ? event.reason.stack || event.reason.message : String(event.reason);
      console.error(`__GAIA_UNHANDLED_REJECTION__${reason}`);
    });
  });
  page.on("console", (message) => {
    if (message.type() !== "error") return;
    if (allowExpectedAbort && message.text().includes("net::ERR_FAILED")) return;
    if (message.text().startsWith("__GAIA_UNHANDLED_REJECTION__")) report.unhandledRejections.push(`${name}: ${message.text()}`);
    report.consoleErrors.push(`${name}: ${message.text()}`);
  });
  page.on("pageerror", (error) => report.pageErrors.push(`${name}: ${error.message}`));
  page.on("response", (response) => { if (response.status() === 404) report.responses404.push(`${name}: ${response.url()}`); });
};

const browser = await chromium.launch({ headless: true, executablePath });
try {
  fs.writeFileSync(path.join(outputDir, "chrome.log"), `executable=${executablePath}\nversion=${await browser.version()}\n`);
  // The first Chromium navigation includes process and renderer startup on
  // some Windows runners. Warm that path before measuring page-load vitals.
  const browserWarmupContext = await browser.newContext({ viewport: { width: 800, height: 600 } });
  const browserWarmupPage = await browserWarmupContext.newPage();
  await browserWarmupPage.goto(new URL("/", baseUrl).href, { waitUntil: "domcontentloaded", timeout: 90_000 });
  await browserWarmupContext.close();

  const performanceContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const performancePage = await performanceContext.newPage();
  monitor(performancePage, "performance");
  await performancePage.addInitScript(() => {
    localStorage.clear();
    globalThis.__gaiaContestVitals = { lcp: 0, lcpEntry: null, cls: 0 };
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.startTime < globalThis.__gaiaContestVitals.lcp) continue;
        globalThis.__gaiaContestVitals.lcp = entry.startTime;
        globalThis.__gaiaContestVitals.lcpEntry = {
          startTime: entry.startTime,
          size: entry.size,
          url: entry.url,
          element: entry.element?.id || entry.element?.className || entry.element?.tagName || "unknown",
        };
      }
    })
      .observe({ type: "largest-contentful-paint", buffered: true });
    new PerformanceObserver((list) => { for (const entry of list.getEntries()) if (!entry.hadRecentInput) globalThis.__gaiaContestVitals.cls += entry.value; })
      .observe({ type: "layout-shift", buffered: true });
  });
  await performancePage.goto(new URL("/", baseUrl).href, { waitUntil: "domcontentloaded", timeout: 90_000 });
  await performancePage.waitForSelector("#gaia-opening-sound-modal.is-visible", { timeout: 20_000 });
  await performancePage.waitForTimeout(800);
  report.performance = await performancePage.evaluate(() => {
    const entries = performance.getEntriesByType("resource");
    const navigation = performance.getEntriesByType("navigation")[0];
    const logo = entries.find((entry) => entry.name.includes("brand-logo-dark-surface-590.webp"));
    return {
      encodedBytes: Math.round((navigation?.encodedBodySize || 0) + entries.reduce((sum, entry) => sum + (entry.encodedBodySize || 0), 0)),
      resources: entries.map((entry) => new URL(entry.name).pathname),
      navigation: navigation ? {
        responseStart: navigation.responseStart,
        responseEnd: navigation.responseEnd,
        domContentLoaded: navigation.domContentLoadedEventEnd,
      } : null,
      logo: logo ? { startTime: logo.startTime, responseStart: logo.responseStart, responseEnd: logo.responseEnd } : null,
      lcp: globalThis.__gaiaContestVitals.lcp,
      lcpEntry: globalThis.__gaiaContestVitals.lcpEntry,
      cls: globalThis.__gaiaContestVitals.cls,
    };
  });
  fs.writeFileSync(path.join(outputDir, "performance.json"), JSON.stringify(report.performance, null, 2));
  assert(report.performance.encodedBytes <= 1_000_000, `initial payload ${report.performance.encodedBytes} bytes`);
  assert(report.performance.lcp < 2500, `LCP ${report.performance.lcp}ms`);
  assert(report.performance.cls < 0.1, `CLS ${report.performance.cls}`);
  for (const pattern of [/\.mp3$/u, /gaia-signals\.json/u, /space-signals\.json/u, /novel-/u, /guided-tour/u, /observation-notebook/u]) {
    assert.equal(report.performance.resources.some((resource) => pattern.test(resource)), false, `eager request: ${pattern}`);
  }
  await performancePage.screenshot({ path: path.join(outputDir, "initial-pc.png"), animations: "disabled" });
  await performanceContext.close();

  for (const viewport of [
    { name: "portrait-min", width: 280, height: 653 },
    { name: "portrait-short", width: 390, height: 568 },
    { name: "landscape-min", width: 568, height: 320 },
    { name: "landscape", width: 667, height: 375 },
  ]) {
    const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height }, isMobile: true, hasTouch: true });
    const page = await context.newPage();
    monitor(page, viewport.name);
    await page.goto(new URL("/", baseUrl).href, { waitUntil: "domcontentloaded", timeout: 90_000 });
    await page.waitForSelector("#gaia-opening-sound-modal.is-visible", { timeout: 20_000 });
    await page.locator("#gaia-opening-sound-off").scrollIntoViewIfNeeded();
    const layout = await page.evaluate(() => {
      const modal = document.querySelector("#gaia-opening-sound-modal");
      const dialog = document.querySelector(".gaia-opening-sound-dialog");
      const description = document.querySelector("#gaia-opening-sound-description");
      const actions = ["#gaia-opening-sound-on", "#gaia-opening-sound-off"].map((selector) => {
        const element = document.querySelector(selector);
        const rect = element.getBoundingClientRect();
        return { selector, width: rect.width, height: rect.height, fontSize: Number.parseFloat(getComputedStyle(element).fontSize), visible: rect.bottom > 0 && rect.top < innerHeight };
      });
      const modalRect = modal.getBoundingClientRect();
      const dialogRect = dialog.getBoundingClientRect();
      return {
        modalRect: modalRect.toJSON(), dialogRect: dialogRect.toJSON(),
        overflowX: document.documentElement.scrollWidth - innerWidth,
        dialogScrollable: dialog.scrollHeight > dialog.clientHeight,
        activeId: document.activeElement?.id,
        descriptionFontSize: Number.parseFloat(getComputedStyle(description).fontSize),
        actions,
      };
    });
    assert(layout.dialogRect.left >= -1 && layout.dialogRect.right <= viewport.width + 1, `${viewport.name}: horizontal cutoff`);
    assert(layout.dialogRect.top >= -1 && layout.dialogRect.bottom <= viewport.height + 1, `${viewport.name}: vertical cutoff`);
    assert.equal(layout.overflowX, 0, `${viewport.name}: horizontal overflow`);
    assert(layout.descriptionFontSize >= 8, `${viewport.name}: sound copy unreadable`);
    for (const action of layout.actions) {
      assert(action.width >= 44 && action.height >= 44, `${viewport.name}: ${action.selector} hit target`);
      assert.equal(action.visible, true, `${viewport.name}: ${action.selector} unreachable`);
    }
    report.layouts.push({ ...viewport, ...layout });
    await page.screenshot({ path: path.join(outputDir, `${viewport.name}.png`), animations: "disabled" });
    await context.close();
  }

  const storyEntryContext = await browser.newContext({ viewport: { width: 1280, height: 820 } });
  const storyEntryPage = await storyEntryContext.newPage();
  monitor(storyEntryPage, "entry-story");
  await storyEntryPage.route(/novel-mode\.js/u, async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 700));
    await route.continue();
  });
  await storyEntryPage.goto(new URL("/", baseUrl).href, { waitUntil: "domcontentloaded", timeout: 90_000 });
  await storyEntryPage.waitForSelector("#gaia-opening-sound-modal.is-visible", { timeout: 20_000 });
  assert.equal(await storyEntryPage.locator("#gaia-opening-entry-continue, #gaia-opening-tour-start, #gaia-opening-entry-story").count(), 0);
  assert.match(await storyEntryPage.locator("#gaia-opening-sound-title").textContent(), /サウンド設定/u);
  await storyEntryPage.locator("#gaia-opening-sound-off").click();
  await storyEntryPage.locator("#gaia-opening-sound-modal").waitFor({ state: "hidden", timeout: 20_000 });
  await storyEntryPage.locator("#gaia-opening-skip").click();
  await storyEntryPage.waitForSelector("#gaia-opening-final-menu.is-visible", { timeout: 20_000 });
  assert.equal(await storyEntryPage.locator("#gaia-opening-final-menu .gaia-opening-route").count(), 2);
  assert.equal(await storyEntryPage.locator("#gaia-opening-tour-link").isVisible(), true, "quiet 60-second guide link must be visible below the two choices");
  assert.match(await storyEntryPage.locator("#gaia-opening-tour-link").textContent(), /60秒ガイド/u);
  await storyEntryPage.screenshot({ path: path.join(outputDir, "opening-restored-pc.png"), animations: "disabled" });
  await storyEntryPage.locator("#gaia-opening-route-story").click();
  await storyEntryPage.waitForTimeout(150);
  assert.notEqual(await storyEntryPage.evaluate(() => location.hash), "#story", "story hash must wait for lazy-loaded story UI");
  await storyEntryPage.waitForFunction(() => location.hash === "#story" && document.querySelector("#novel-layer")?.getAttribute("aria-hidden") === "false", null, { timeout: 30_000 });
  await storyEntryPage.screenshot({ path: path.join(outputDir, "story-restored-pc.png"), animations: "disabled" });
  assert.equal(await storyEntryPage.locator(".gaia-observation-launcher").count(), 0, "story route must not mount the notebook launcher");
  report.entry.soundAndStory = "passed";
  await storyEntryContext.close();

  const guideEntryContext = await browser.newContext({ viewport: { width: 1280, height: 820 } });
  const guideEntryPage = await guideEntryContext.newPage();
  monitor(guideEntryPage, "entry-guide-link");
  await guideEntryPage.goto(new URL("/", baseUrl).href, { waitUntil: "domcontentloaded", timeout: 90_000 });
  await guideEntryPage.waitForSelector("#gaia-opening-sound-modal.is-visible", { timeout: 20_000 });
  await guideEntryPage.locator("#gaia-opening-sound-off").click();
  await guideEntryPage.locator("#gaia-opening-sound-modal").waitFor({ state: "hidden", timeout: 20_000 });
  await guideEntryPage.locator("#gaia-opening-skip").click();
  await guideEntryPage.waitForSelector("#gaia-opening-final-menu.is-visible", { timeout: 20_000 });
  await guideEntryPage.locator("#gaia-opening-tour-link").click();
  await guideEntryPage.waitForFunction(() => globalThis.GaiaGuidedTour?.getState?.().active === true, null, { timeout: 30_000 });
  assert.equal(await guideEntryPage.evaluate(() => location.hash), "#tour");
  await guideEntryPage.evaluate(() => globalThis.GaiaGuidedTour.exit());
  report.entry.guideLink = "passed";
  await guideEntryContext.close();

  const directContext = await browser.newContext({ viewport: { width: 1280, height: 820 } });
  const directPage = await directContext.newPage();
  monitor(directPage, "entry-direct-routes");
  for (const hash of ["#earth", "#story", "#observation=e30"]) {
    await directPage.goto(new URL(`/${hash}`, baseUrl).href, { waitUntil: "domcontentloaded", timeout: 90_000 });
    await directPage.waitForFunction(() => document.querySelector("#gaia-opening")?.hidden === true, null, { timeout: 20_000 });
    assert.equal(await directPage.locator("#gaia-opening-sound-modal.is-visible").count(), 0, `${hash} must bypass entry`);
  }
  report.entry.directRoutes = "passed";
  await directPage.goto(new URL("/#earth", baseUrl).href, { waitUntil: "domcontentloaded", timeout: 90_000 });
  await directPage.waitForFunction(() => Boolean(globalThis.GaiaMapObservationAdapter), null, { timeout: 30_000 });
  await directPage.evaluate(() => { location.hash = "#japan"; });
  await directPage.waitForFunction(() => location.hash === "#japan");
  await directPage.goBack({ waitUntil: "domcontentloaded" });
  assert.equal(await directPage.evaluate(() => location.hash), "#earth");
  await directPage.goForward({ waitUntil: "domcontentloaded" });
  assert.equal(await directPage.evaluate(() => location.hash), "#japan");
  await directPage.reload({ waitUntil: "domcontentloaded" });
  await directPage.waitForFunction(() => Boolean(globalThis.GaiaMapObservationAdapter), null, { timeout: 30_000 });
  assert.equal(await directPage.locator("#japan-layer").count(), 1, "history/reload must not duplicate the exploration UI");
  report.entry.history = "passed";
  await directContext.close();

  const tourContext = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const tourPage = await tourContext.newPage();
  monitor(tourPage, "tour");
  const tourRequests = [];
  tourPage.on("request", (request) => tourRequests.push(new URL(request.url()).pathname));
  await tourPage.addInitScript(() => {
    localStorage.setItem("gaia-novel-save", "tour-must-not-change");
    localStorage.setItem("gaiaSenseware:observationNotebook:v1", JSON.stringify({ version: 1, records: [{ id: "unchanged" }] }));
  });
  await tourPage.goto(new URL("/#tour", baseUrl).href, { waitUntil: "domcontentloaded", timeout: 90_000 });
  await tourPage.waitForFunction(() => globalThis.GaiaGuidedTour?.getState?.().active === true, null, { timeout: 30_000 });
  const initialTour = await tourPage.evaluate(() => ({ state: GaiaGuidedTour.getState(), hash: location.hash, modalHidden: document.querySelector("#gaia-opening")?.hidden }));
  assert.equal(initialTour.state.totalDuration, 60);
  assert.equal(await tourPage.locator(".gaia-tour-card-index span").last().textContent(), "07");
  assert.equal(initialTour.hash, "#tour");
  assert.equal(initialTour.modalHidden, true);
  assert.equal(await tourPage.evaluate(() => document.querySelector("#gaia-guided-tour")?.contains(document.activeElement)), true);
  for (const pattern of [/\.mp3$/u, /opening-mizuha/u, /opening-amane/u, /open-data-archive-bg/u, /opening-final-night/u]) {
    assert.equal(tourRequests.some((resource) => pattern.test(resource)), false, `tour requested opening asset: ${pattern}`);
  }
  await tourPage.locator("[data-tour-action='toggle']").click();
  assert.equal(await tourPage.evaluate(() => GaiaGuidedTour.getState().running), false);
  const pausedTourIndex = await tourPage.evaluate(() => GaiaGuidedTour.getState().index);
  await tourPage.locator("[data-tour-action='next']").click();
  assert.equal(await tourPage.evaluate(() => GaiaGuidedTour.getState().index), pausedTourIndex + 1);
  assert.equal(await tourPage.evaluate(() => GaiaGuidedTour.getState().running), false, "manual navigation pauses the tour");
  const mobileTourLayout = await tourPage.evaluate(() => {
    const card = document.querySelector(".gaia-tour-card");
    const copy = document.querySelector(".gaia-tour-copy");
    const instruction = document.querySelector(".gaia-tour-instruction");
    const controls = Array.from(document.querySelectorAll(".gaia-tour-controls button")).map((element) => element.getBoundingClientRect().height);
    return { cardHeight: card.getBoundingClientRect().height, maxHeight: innerHeight * 0.35, copyFont: Number.parseFloat(getComputedStyle(copy).fontSize), instructionFont: Number.parseFloat(getComputedStyle(instruction).fontSize), controls };
  });
  assert(mobileTourLayout.cardHeight <= mobileTourLayout.maxHeight + 2, `tour card ${mobileTourLayout.cardHeight}px exceeds 35dvh`);
  assert(mobileTourLayout.copyFont >= 14 && mobileTourLayout.instructionFont >= 14, "tour important copy below 14px");
  assert(mobileTourLayout.controls.every((height) => height >= 44), "tour control below 44px");
  await tourPage.locator("[data-tour-action='toggle']").click();
  await tourPage.waitForFunction(() => GaiaGuidedTour.getState().elapsed > 0, null, { timeout: 10_000 });
  await tourPage.evaluate(() => document.querySelector(".gaia-tour-highlight-target")?.dispatchEvent(new MouseEvent("click", { bubbles: true })));
  assert.equal(await tourPage.evaluate(() => GaiaGuidedTour.getState().running), true, "exhibit interaction must not pause autoplay");
  const visibleElapsed = await tourPage.evaluate(() => {
    Object.defineProperty(document, "hidden", { configurable: true, value: true });
    document.dispatchEvent(new Event("visibilitychange"));
    return GaiaGuidedTour.getState().elapsed;
  });
  assert.equal(await tourPage.evaluate(() => GaiaGuidedTour.getState().running), false);
  await tourPage.waitForTimeout(350);
  assert.equal(await tourPage.evaluate(() => GaiaGuidedTour.getState().elapsed), visibleElapsed);
  await tourPage.evaluate(() => {
    Object.defineProperty(document, "hidden", { configurable: true, value: false });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  assert.equal(await tourPage.evaluate(() => GaiaGuidedTour.getState().running), true);
  await tourPage.locator("[data-tour-action='previous']").click();
  assert.equal(await tourPage.evaluate(() => GaiaGuidedTour.getState().index), 0);
  assert.equal(await tourPage.evaluate(() => localStorage.getItem("gaia-novel-save")), "tour-must-not-change");
  assert.equal(await tourPage.evaluate(() => localStorage.getItem("gaiaSenseware:observationNotebook:v1")), JSON.stringify({ version: 1, records: [{ id: "unchanged" }] }));
  await tourPage.setViewportSize({ width: 667, height: 375 });
  await tourPage.waitForTimeout(180);
  const rotatedLayout = await tourPage.evaluate(() => {
    const card = document.querySelector(".gaia-tour-card").getBoundingClientRect();
    const controls = document.querySelector(".gaia-tour-controls").getBoundingClientRect();
    return { card: card.toJSON(), controls: controls.toJSON(), width: innerWidth, height: innerHeight };
  });
  assert(rotatedLayout.card.left >= 0 && rotatedLayout.card.right <= rotatedLayout.width, "rotated tour card cutoff");
  assert(rotatedLayout.controls.left >= 0 && rotatedLayout.controls.right <= rotatedLayout.width && rotatedLayout.controls.bottom <= rotatedLayout.height, "rotated tour controls cutoff");
  assert.equal(await tourPage.evaluate(() => GaiaGuidedTour.getState().active), true, "tour must survive rotation");
  await tourPage.setViewportSize({ width: 390, height: 844 });
  await tourPage.screenshot({ path: path.join(outputDir, "tour-mobile.png"), animations: "disabled" });
  await tourPage.keyboard.press("Escape");
  await tourPage.waitForFunction(() => GaiaGuidedTour.getState().active === false);
  await tourPage.evaluate(() => GaiaGuidedTour.start({ source: "reentry" }));
  assert.equal(await tourPage.evaluate(() => GaiaGuidedTour.getState().active), true);
  await tourPage.evaluate(() => GaiaGuidedTour.exit());
  report.tour.controls = "passed";
  await tourContext.close();

  const automaticContext = await browser.newContext({ viewport: { width: 1280, height: 820 } });
  const automaticPage = await automaticContext.newPage();
  monitor(automaticPage, "tour-automatic");
  await automaticPage.goto(new URL("/#tour", baseUrl).href, { waitUntil: "domcontentloaded", timeout: 90_000 });
  await automaticPage.waitForFunction(() => globalThis.GaiaGuidedTour?.getState?.().active === true, null, { timeout: 30_000 });
  const automaticStartedAt = Date.now();
  await automaticPage.waitForSelector("[data-tour-finish]:not([hidden])", { timeout: 68_000 });
  report.tour.autoDurationMs = Date.now() - automaticStartedAt;
  assert(report.tour.autoDurationMs >= 58_000 && report.tour.autoDurationMs <= 66_000, `automatic tour ${report.tour.autoDurationMs}ms`);
  assert.equal(await automaticPage.locator("[data-tour-finish] [data-tour-destination]").count(), 3);
  assert.equal(await automaticPage.locator("[data-tour-finish] a[href='./sensors/']").count(), 1);
  await automaticPage.screenshot({ path: path.join(outputDir, "tour-finish.png"), animations: "disabled" });
  await automaticContext.close();

  const fallbackContext = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  const fallbackPage = await fallbackContext.newPage();
  monitor(fallbackPage, "tour-fallback", { allowExpectedAbort: true });
  await fallbackPage.route(/space-signals\.json/u, (route) => route.abort());
  await fallbackPage.goto(new URL("/#tour", baseUrl).href, { waitUntil: "domcontentloaded", timeout: 90_000 });
  await fallbackPage.waitForFunction(() => globalThis.GaiaGuidedTour?.getState?.().active === true, null, { timeout: 30_000 });
  await fallbackPage.locator("[data-tour-action='next']").click();
  await fallbackPage.locator("[data-tour-action='next']").click();
  await fallbackPage.locator("[data-tour-action='next']").click();
  await fallbackPage.locator("[data-tour-action='next']").click();
  await fallbackPage.waitForFunction(() => GaiaGuidedTour.getState().stepId === "space", null, { timeout: 20_000 });
  await fallbackPage.waitForSelector("[data-tour-fallback]:not([hidden])", { timeout: 45_000 });
  assert.equal(await fallbackPage.locator("#gaia-guided-tour").getAttribute("data-step"), "space");
  assert.equal(await fallbackPage.locator("#gaia-guided-tour").evaluate((element) => element.classList.contains("is-reduced-motion")), true);
  report.tour.fallback = "passed";
  await fallbackContext.close();

  const webglContext = await browser.newContext({ viewport: { width: 1280, height: 820 } });
  const webglPage = await webglContext.newPage();
  monitor(webglPage, "webgl-fallback");
  await webglPage.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function getContext(type, ...args) {
      if (type === "webgl2") return null;
      return original.call(this, type, ...args);
    };
  });
  await webglPage.goto(new URL("/#tour", baseUrl).href, { waitUntil: "domcontentloaded", timeout: 90_000 });
  await webglPage.waitForFunction(() => globalThis.GaiaGuidedTour?.getState?.().active === true, null, { timeout: 30_000 });
  await webglPage.locator("[data-tour-action='next']").click();
  await webglPage.waitForSelector("[data-tour-fallback]:not([hidden])", { timeout: 20_000 });
  for (let position = 0; position < 6; position += 1) await webglPage.locator("[data-tour-action='next']").click();
  assert.equal(await webglPage.locator("[data-tour-finish]").isVisible(), true, "WebGL fallback must reach finish");
  assert.equal(await webglPage.locator("[data-tour-finish] [data-tour-destination='source']").isEnabled(), true);
  report.resilience.webglFallback = "passed";
  await webglContext.close();

  const lifecycleContext = await browser.newContext({ viewport: { width: 1280, height: 820 } });
  const lifecyclePage = await lifecycleContext.newPage();
  monitor(lifecyclePage, "lifecycle");
  await lifecyclePage.goto(new URL("/#earth", baseUrl).href, { waitUntil: "domcontentloaded", timeout: 90_000 });
  await lifecyclePage.waitForFunction(() => Boolean(globalThis.GaiaMapObservationAdapter), null, { timeout: 30_000 });
  const lifecycle = await lifecyclePage.evaluate(async () => {
    const initialCanvasCount = document.querySelectorAll("canvas").length;
    const initialSpaceCanvasCount = document.querySelectorAll("#space-canvas").length;
    const initialAudioCount = document.querySelectorAll("audio").length;
    for (let position = 0; position < 10; position += 1) {
      GaiaMapObservationAdapter.openMap();
      GaiaMapObservationAdapter.closeMap();
    }
    await GaiaModeLoader.load("space");
    let spaceCanvas = null;
    let spaceCanvasReused = true;
    for (let position = 0; position < 10; position += 1) {
      await GaiaSpaceTourAdapter.openAtMode(0);
      const currentSpaceCanvas = document.querySelector("#space-canvas");
      if (!spaceCanvas) spaceCanvas = currentSpaceCanvas;
      else if (currentSpaceCanvas !== spaceCanvas) spaceCanvasReused = false;
      GaiaSpaceTourAdapter.close();
    }
    await GaiaModeLoader.load("sound");
    for (let position = 0; position < 10; position += 1) {
      document.querySelector("[data-sound-gallery-open]").click();
      document.querySelector("#sound-close").click();
    }
    await new Promise((resolve) => setTimeout(resolve, 320));
    return {
      initialCanvasCount,
      finalCanvasCount: document.querySelectorAll("canvas").length,
      initialSpaceCanvasCount,
      finalSpaceCanvasCount: document.querySelectorAll("#space-canvas").length,
      spaceCanvasReused,
      initialAudioCount,
      finalAudioCount: document.querySelectorAll("audio").length,
      soundLayerCount: document.querySelectorAll("#sound-layer").length,
      soundHidden: document.querySelector("#sound-layer").hidden,
      map: GaiaMapObservationAdapter.getState(),
      space: GaiaSpaceTourAdapter.getState(),
    };
  });
  assert.equal(lifecycle.initialSpaceCanvasCount, 0, "space canvas must stay lazy before space loads");
  assert.equal(lifecycle.finalSpaceCanvasCount, 1, "space must create one canvas only");
  assert.equal(lifecycle.spaceCanvasReused, true, "space must reuse its canvas across open and close cycles");
  assert.equal(lifecycle.finalAudioCount, lifecycle.initialAudioCount, "sound mode must reuse the existing audio player");
  assert.equal(lifecycle.soundLayerCount, 1, "sound mode must mount one layer only");
  assert.equal(lifecycle.soundHidden, true);
  assert.equal(lifecycle.map.mapOpen, false);
  assert.equal(lifecycle.space.open, false);
  assert.equal(lifecycle.space.frameActive, false);
  const contextLossTriggered = await lifecyclePage.evaluate(() => {
    const gl = document.querySelector("#gaia-canvas")?.getContext("webgl2");
    const extension = gl?.getExtension("WEBGL_lose_context");
    if (!extension) return false;
    extension.loseContext();
    return true;
  });
  if (contextLossTriggered) {
    await lifecyclePage.waitForSelector("#error-panel:not([hidden])", { timeout: 10_000 });
    assert.equal(await lifecyclePage.locator("#error-panel a[href*='#tour']").isVisible(), true, "context loss must retain the guide exit");
    assert.equal(await lifecyclePage.locator("#error-panel a[href*='github.com']").isVisible(), true, "context loss must retain the source exit");
  }
  report.resilience.contextLoss = contextLossTriggered ? "passed" : "extension-unavailable";
  report.resilience.lifecycle = lifecycle;
  const lodResult = await lifecyclePage.evaluate(() => {
    const governor = new globalThis.GaiaFrameBudgetGovernorClass({ autoStart: false, now: () => 20_000 });
    const feed = (duration, periods) => {
      for (let index = 0; index < periods; index += 1) governor.__testFeedWindow(Array.from({ length: 120 }, () => duration));
    };
    feed(19, 2);
    const afterMedium = governor.getProfile().level;
    feed(19, 2);
    const afterLow = governor.getProfile().level;
    feed(23, 3);
    const result = { afterMedium, afterLow, afterStatic: governor.getProfile().level };
    globalThis.GaiaFrameBudgetGovernor.publish("deterministic-test-complete");
    return result;
  });
  assert.deepEqual(lodResult, { afterMedium: "medium", afterLow: "low", afterStatic: "static" });
  const frameTimes = await lifecyclePage.evaluate(() => new Promise((resolve) => {
    const samples = [];
    let previous = performance.now();
    const tick = (now) => {
      samples.push(now - previous);
      previous = now;
      if (samples.length >= 120) resolve(samples);
      else requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }));
  const sortedFrameTimes = [...frameTimes].sort((left, right) => left - right);
  const medianFrameMs = sortedFrameTimes[Math.floor(sortedFrameTimes.length / 2)];
  report.resilience.lod = { deterministic: lodResult, medianFps: 1000 / medianFrameMs, activeLevel: await lifecyclePage.evaluate(() => document.documentElement.dataset.gaiaLod) };
  assert(report.resilience.lod.medianFps >= 55, `median frame rate ${report.resilience.lod.medianFps.toFixed(1)}fps`);
  assert.notEqual(report.resilience.lod.activeLevel, "static", "normal Chrome must not fall back to static rendering");
  await lifecycleContext.close();

  assert.deepEqual(report.consoleErrors, []);
  assert.deepEqual(report.pageErrors, []);
  assert.deepEqual(report.unhandledRejections, []);
  assert.deepEqual(report.responses404, []);
  report.status = "passed";
  fs.writeFileSync(path.join(outputDir, "report.json"), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
} catch (error) {
  report.status = "failed";
  report.failure = error instanceof Error ? { message: error.message, stack: error.stack } : { message: String(error) };
  fs.writeFileSync(path.join(outputDir, "report.json"), JSON.stringify(report, null, 2));
  throw error;
} finally {
  await browser.close();
  qaServer?.closeAllConnections?.();
  await new Promise((resolve) => qaServer ? qaServer.close(resolve) : resolve());
}
