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
const outputDir = path.resolve(outputArgument || "E:/CodexData/temp/gaia-character-profile-browser");
fs.mkdirSync(outputDir, { recursive: true });

const viewports = [
  { name: "pc-1440", width: 1440, height: 900, mobile: false },
  { name: "pc-4k", width: 3840, height: 2160, mobile: false },
  { name: "mobile-390", width: 390, height: 844, mobile: true },
  { name: "reduced-motion", width: 1440, height: 900, mobile: false, reduced: true },
];
const report = { status: "running", baseUrl, scans: [], consoleErrors: [], pageErrors: [], responses404: [] };
const browser = await chromium.launch({ headless: true, executablePath });

const attachDiagnostics = (page, name) => {
  page.on("console", (message) => {
    if (message.type() === "error") report.consoleErrors.push(name + ": " + message.text());
  });
  page.on("pageerror", (error) => report.pageErrors.push(name + ": " + error.message));
  page.on("response", (response) => {
    if (response.status() === 404) report.responses404.push(name + ": " + response.url());
  });
};

const inspect = (page) => page.evaluate(() => {
  const layer = document.querySelector("#character-book-layer");
  const scroller = document.querySelector("#character-book-scroll");
  const hero = document.querySelector("#character-book-hero");
  const image = document.querySelector("#character-book-image");
  const canvas = document.querySelector("#character-book-webgl");
  const lead = document.querySelector(".character-book-lead");
  const rect = (element) => element?.getBoundingClientRect().toJSON();
  return {
    layerPosition: getComputedStyle(layer).position,
    layerRect: rect(layer),
    heroRect: rect(hero),
    imageRect: rect(image),
    canvasRect: rect(canvas),
    webglState: canvas?.dataset.webglState || "missing",
    webglRendered: canvas?.dataset.webglRendered || "false",
    webglWidth: canvas instanceof HTMLCanvasElement ? canvas.width : 0,
    webglHeight: canvas instanceof HTMLCanvasElement ? canvas.height : 0,
    webglOpacity: Number.parseFloat(getComputedStyle(canvas).opacity || "0"),
    imageSource: image?.currentSrc || "",
    imageAlt: image?.alt || "",
    selectors: document.querySelectorAll("[data-character-select]").length,
    activeSelectors: [...document.querySelectorAll("[data-character-select]")]
      .filter((button) => button.getAttribute("aria-current") === "true").length,
    profiles: document.querySelectorAll("[data-character-profile]").length,
    current: document.querySelector("#character-book-current")?.textContent.trim(),
    title: document.querySelector("#character-book-page-title")?.textContent.replace(/\s+/gu, " ").trim(),
    characterId: layer?.dataset.characterId,
    bodyMode: document.body.classList.contains("character-mode-open"),
    ariaHidden: layer?.getAttribute("aria-hidden"),
    role: layer?.getAttribute("role"),
    modal: layer?.getAttribute("aria-modal"),
    scrollHeight: scroller?.scrollHeight || 0,
    clientHeight: scroller?.clientHeight || 0,
    overflowX: Math.max(0, document.documentElement.scrollWidth - innerWidth),
    leadOverflow: lead ? Math.max(0, lead.scrollWidth - lead.clientWidth) : -1,
  };
});

try {
  for (const viewport of viewports) {
    const context = await browser.newContext({
      viewport,
      hasTouch: viewport.mobile,
      reducedMotion: viewport.reduced ? "reduce" : "no-preference",
    });
    const page = await context.newPage();
    attachDiagnostics(page, viewport.name);
    await page.goto(new URL("/#character", baseUrl).href, { waitUntil: "domcontentloaded" });
    await page.locator("#character-book-layer").waitFor({ state: "visible", timeout: 15000 });
    await page.waitForFunction(() => {
      const image = document.querySelector("#character-book-image");
      return image?.complete && image.naturalWidth > 0
        && document.querySelector("#character-book-webgl")?.dataset.webglRendered === "true";
    });

    const initial = await inspect(page);
    assert.equal(initial.layerPosition, "fixed", viewport.name + ": character page is not an independent full-screen surface");
    assert.equal(initial.bodyMode, true, viewport.name + ": character body mode is missing");
    assert.equal(initial.ariaHidden, "false", viewport.name + ": dialog remains hidden");
    assert.equal(initial.role, "dialog", viewport.name + ": dialog role is missing");
    assert.equal(initial.modal, "true", viewport.name + ": modal state is missing");
    assert.equal(initial.selectors, 3, viewport.name + ": three-character selector is incomplete");
    assert.equal(initial.activeSelectors, 1, viewport.name + ": selector active state is ambiguous");
    assert.equal(initial.profiles, 3, viewport.name + ": three long-form profiles are incomplete");
    assert.equal(initial.current, "01", viewport.name + ": Mizuha is not the opening character");
    assert.match(initial.title, /MIZUHA.*みずは/u, viewport.name + ": opening profile title is incorrect");
    assert.match(initial.imageSource, /mizuha-calm-07-v2\.png/u, viewport.name + ": opening character art is incorrect");
    assert(initial.imageAlt.length >= 10, viewport.name + ": hero character alt text is missing");
    assert.equal(initial.webglState, "ready", viewport.name + ": WebGL atmosphere did not initialize");
    assert.equal(initial.webglRendered, "true", viewport.name + ": WebGL atmosphere did not render");
    assert(initial.webglWidth > 0 && initial.webglHeight > 0, viewport.name + ": WebGL buffer is empty");
    assert(initial.webglOpacity > 0, viewport.name + ": WebGL atmosphere is not visible");
    assert(initial.canvasRect.left <= 0 && initial.canvasRect.top <= 0, viewport.name + ": WebGL canvas is offset");
    assert(initial.heroRect.height >= viewport.height * 0.9, viewport.name + ": hero does not occupy the viewport");
    assert(initial.scrollHeight > initial.clientHeight * 2.5, viewport.name + ": long-form character document is missing");
    assert.equal(initial.overflowX, 0, viewport.name + ": page has horizontal overflow");
    if (!viewport.mobile) assert(initial.leadOverflow <= 1, viewport.name + ": one-line lead is clipped");

    await page.screenshot({ path: path.join(outputDir, viewport.name + "-character-hero.png"), fullPage: false });

    await page.locator('[data-character-select="amane"]').click();
    await page.waitForFunction(() => document.querySelector("#character-book-layer")?.dataset.characterId === "amane"
      && document.querySelector("#character-book-current")?.textContent.trim() === "02"
      && /amane-calm-07-v2\.png/u.test(document.querySelector("#character-book-image")?.currentSrc || ""));
    const amane = await inspect(page);
    assert.match(amane.title, /AMANE.*あめ/u, viewport.name + ": Amane profile did not update");
    assert.equal(amane.activeSelectors, 1, viewport.name + ": Amane selection produced multiple active portraits");

    await page.keyboard.press("ArrowRight");
    await page.waitForFunction(() => document.querySelector("#character-book-layer")?.dataset.characterId === "sakuya"
      && document.querySelector("#character-book-current")?.textContent.trim() === "03");
    const sakuya = await inspect(page);
    assert.match(sakuya.title, /SAKUYA.*saku/u, viewport.name + ": keyboard character change failed");
    assert.match(sakuya.imageSource, /sakuya-calm-07-v1\.png/u, viewport.name + ": Sakuya art did not load");

    await page.locator("#character-book-profiles").scrollIntoViewIfNeeded();
    await page.waitForTimeout(viewport.reduced ? 50 : 220);
    const sectionState = await page.locator("[data-character-profile='mizuha']").evaluate((element) => ({
      visible: element.classList.contains("is-visible"),
      color: getComputedStyle(element).color,
      width: element.getBoundingClientRect().width,
    }));
    assert(sectionState.width > 0, viewport.name + ": long-form profile collapsed");
    assert.match(sectionState.color, /rgb/u, viewport.name + ": profile typography is not rendered");

    await page.screenshot({ path: path.join(outputDir, viewport.name + "-character-profile.png"), fullPage: false });
    await page.locator("#character-book-close").click();
    await page.locator("#character-book-layer").waitFor({ state: "hidden", timeout: 5000 });
    assert.equal(await page.evaluate(() => document.body.classList.contains("character-mode-open")), false);
    report.scans.push({ viewport, initial, amane, sakuya, sectionState });
    await context.close();
  }

  assert.deepEqual(report.consoleErrors, [], "console errors were detected");
  assert.deepEqual(report.pageErrors, [], "page errors were detected");
  assert.deepEqual(report.responses404, [], "404 responses were detected");
  report.status = "passed";
} finally {
  await browser.close();
  fs.writeFileSync(path.join(outputDir, "report.json"), JSON.stringify(report, null, 2));
}

console.log(JSON.stringify({ status: report.status, scans: report.scans.length, outputDir }, null, 2));
