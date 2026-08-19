import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const [moduleRoot, executablePath, outputArgument, baseUrl = "http://127.0.0.1:4193"] = process.argv.slice(2);
if (!moduleRoot || !executablePath) throw new Error("Playwright module root and browser executable are required");
const playwrightEntry = fs.existsSync(path.join(moduleRoot, "index.mjs"))
  ? path.join(moduleRoot, "index.mjs")
  : path.join(moduleRoot, "playwright", "index.mjs");
const { chromium } = await import(pathToFileURL(playwrightEntry).href);
const outputDir = path.resolve(outputArgument || "artifacts/opening-audio-integration-browser");
fs.mkdirSync(outputDir, { recursive: true });

const viewports = [
  { name: "pc-1440", width: 1440, height: 900 },
  { name: "pc-4k", width: 3840, height: 2160 },
  { name: "mobile-390", width: 390, height: 844, mobile: true },
];
const report = { status: "running", baseUrl, scans: [], consoleErrors: [], pageErrors: [], responses404: [] };
const visible = (element) => {
  if (!element || element.hidden || element.closest("[hidden]")) return false;
  const style = getComputedStyle(element);
  const rect = element.getBoundingClientRect();
  return style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity || 1) > 0 && rect.width > 0 && rect.height > 0;
};
const overlapArea = (a, b) => Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left))
  * Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));

const browser = await chromium.launch({ headless: true, executablePath });
try {
  for (const viewport of viewports) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      hasTouch: Boolean(viewport.mobile),
      isMobile: Boolean(viewport.mobile),
      reducedMotion: "no-preference",
    });
    await context.addInitScript(() => {
      localStorage.clear();
      localStorage.setItem("gaia-senseware-bgm-volume", "0.23");
      globalThis.__qaVisible = (element) => {
        if (!element || element.hidden || element.closest("[hidden]")) return false;
        const style = getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        return style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity || 1) > 0 && rect.width > 0 && rect.height > 0;
      };
    });
    const page = await context.newPage();
    page.on("console", (message) => { if (message.type() === "error") report.consoleErrors.push(`${viewport.name}: ${message.text()}`); });
    page.on("pageerror", (error) => report.pageErrors.push(`${viewport.name}: ${error.message}`));
    page.on("response", (response) => { if (response.status() === 404) report.responses404.push(`${viewport.name}: ${response.url()}`); });

    await page.goto(new URL("/", baseUrl).href, { waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => Boolean(globalThis.GaiaOpeningAudio));
    assert.equal(await page.locator("#gaia-opening-sound-gate").count(), 0, `${viewport.name}: separate sound screen remains`);
    await page.waitForFunction(() => !document.querySelector("#gaia-opening")?.classList.contains("is-preloading"), null, { timeout: 10_000 });
    await page.waitForFunction(() => __qaVisible(document.querySelector("#gaia-opening-skip")));
    assert.equal(await page.locator("#gaia-opening-route-story").isVisible(), false, `${viewport.name}: title menu appeared before the cinematic ended`);
    await page.locator("#gaia-opening-skip").click();
    await page.waitForFunction(() => __qaVisible(document.querySelector(".gaia-opening-menu-audio")));

    const initial = await page.evaluate(() => {
      const readRect = (selector) => document.querySelector(selector)?.getBoundingClientRect().toJSON();
      return {
        menuVisible: __qaVisible(document.querySelector("#gaia-opening-final-menu")),
        audioVisible: __qaVisible(document.querySelector(".gaia-opening-menu-audio")),
        audioInsideMenu: Boolean(document.querySelector("#gaia-opening-final-menu .gaia-opening-menu-audio")),
        sliderValue: document.querySelector("#gaia-opening-volume")?.value,
        output: document.querySelector("#gaia-opening-volume-value")?.textContent.trim(),
        soundOnPressed: document.querySelector("#gaia-opening-sound-on")?.getAttribute("aria-pressed"),
        soundOffPressed: document.querySelector("#gaia-opening-sound-off")?.getAttribute("aria-pressed"),
        dockVisible: __qaVisible(document.querySelector("#gaia-audio-dock")),
        menuRect: readRect("#gaia-opening-final-menu"),
        routeRect: readRect(".gaia-opening-route-grid"),
        audioRect: readRect(".gaia-opening-menu-audio"),
        soundOnRect: readRect("#gaia-opening-sound-on"),
        soundOffRect: readRect("#gaia-opening-sound-off"),
        overflowX: Math.max(0, document.documentElement.scrollWidth - innerWidth),
        overflowY: Math.max(0, document.documentElement.scrollHeight - innerHeight),
      };
    });
    assert(initial.menuVisible && initial.audioVisible && initial.audioInsideMenu, `${viewport.name}: integrated sound controls are missing`);
    assert.equal(initial.sliderValue, "23");
    assert.equal(initial.output, "23%");
    assert.equal(initial.soundOnPressed, "false");
    assert.equal(initial.soundOffPressed, "true");
    assert.equal(initial.dockVisible, false, `${viewport.name}: duplicate audio dock is visible on the title menu`);
    assert(initial.menuRect.left >= -1 && initial.menuRect.right <= viewport.width + 1, `${viewport.name}: menu is outside the viewport`);
    assert(initial.menuRect.top >= -1 && initial.menuRect.bottom <= viewport.height + 1, `${viewport.name}: menu is outside the viewport vertically`);
    assert.equal(overlapArea(initial.routeRect, initial.audioRect), 0, `${viewport.name}: route and sound controls overlap`);
    for (const rect of [initial.soundOnRect, initial.soundOffRect]) {
      assert(rect.width >= 44 && rect.height >= 44, `${viewport.name}: sound action hit area is smaller than 44px`);
    }
    assert.equal(overlapArea(initial.soundOnRect, initial.soundOffRect), 0, `${viewport.name}: sound actions overlap`);
    assert.equal(initial.overflowX, 0);
    assert.equal(initial.overflowY, 0);
    await page.screenshot({ path: path.join(outputDir, `${viewport.name}-integrated.png`), animations: "disabled" });

    await page.locator("#gaia-opening-volume").fill("37");
    await page.waitForFunction(() => Math.abs(globalThis.GaiaOpeningAudio.getState().volume - 0.37) < 0.001);
    const storedVolume = await page.evaluate(() => localStorage.getItem("gaia-senseware-bgm-volume"));
    assert.equal(storedVolume, "0.37", `${viewport.name}: volume was not persisted`);
    assert.equal(await page.locator("#gaia-opening-volume-value").textContent(), "37%");

    if (viewport.mobile) await page.locator("#gaia-opening-sound-on").tap();
    else await page.locator("#gaia-opening-sound-on").click();
    await page.waitForFunction(() => globalThis.GaiaOpeningAudio.getState().muted === false
      && document.querySelector("#gaia-opening-sound-on")?.getAttribute("aria-pressed") === "true");
    const playing = await page.evaluate(() => globalThis.GaiaOpeningAudio.getState());
    assert.equal(playing.muted, false);
    assert.equal(await page.locator("#gaia-opening-sound-on").getAttribute("aria-pressed"), "true");

    await page.locator("#gaia-opening-sound-off").focus();
    await page.locator("#gaia-opening-sound-off").press("Enter");
    await page.waitForFunction(() => globalThis.GaiaOpeningAudio.getState().muted === true);
    assert.equal(await page.locator("#gaia-opening-sound-off").getAttribute("aria-pressed"), "true");

    await page.locator("#gaia-opening-route-story").click();
    await page.waitForFunction(() => document.querySelector("#gaia-opening")?.hidden === true, null, { timeout: 10_000 });
    await page.waitForFunction(() => __qaVisible(document.querySelector("#novel-title-screen")), null, { timeout: 10_000 });
    await page.waitForFunction(() => __qaVisible(document.querySelector("#gaia-audio-dock")), null, { timeout: 10_000 });
    const destination = await page.evaluate(() => ({
      titleVisible: __qaVisible(document.querySelector("#novel-title-screen")),
      dockVisible: __qaVisible(document.querySelector("#gaia-audio-dock")),
      muted: globalThis.GaiaOpeningAudio.getState().muted,
      volume: globalThis.GaiaOpeningAudio.getState().volume,
      overflowX: Math.max(0, document.documentElement.scrollWidth - innerWidth),
      overflowY: Math.max(0, document.documentElement.scrollHeight - innerHeight),
    }));
    assert(destination.titleVisible && destination.dockVisible, `${viewport.name}: destination controls are missing`);
    assert.equal(destination.muted, true);
    assert(Math.abs(destination.volume - 0.37) < 0.001);
    assert.equal(destination.overflowX, 0);
    assert.equal(destination.overflowY, 0);
    report.scans.push({ viewport: viewport.name, initial, playing, destination, passed: true });
    await context.close();
  }

  assert.deepEqual(report.consoleErrors, []);
  assert.deepEqual(report.pageErrors, []);
  assert.deepEqual(report.responses404, []);
  report.status = "passed";
  console.log(`Opening audio integration passed: ${report.scans.length} viewports`);
} catch (error) {
  report.status = "failed";
  report.error = error instanceof Error ? error.stack : String(error);
  throw error;
} finally {
  fs.writeFileSync(path.join(outputDir, "report.json"), `${JSON.stringify(report, null, 2)}\n`, "utf8");
  await browser.close();
}
