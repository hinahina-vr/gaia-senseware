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
  { name: "mobile-360", width: 360, height: 800, mobile: true },
  { name: "mobile-390", width: 390, height: 844, mobile: true },
  { name: "mobile-short", width: 390, height: 667, mobile: true },
  { name: "mobile-min", width: 280, height: 653, mobile: true },
  { name: "mobile-landscape-min", width: 568, height: 320, mobile: true },
  { name: "mobile-landscape-short", width: 667, height: 375, mobile: true },
  { name: "mobile-landscape", width: 844, height: 390, mobile: true },
  { name: "pc-reduced-motion", width: 1440, height: 900, reduced: true },
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
      reducedMotion: viewport.reduced ? "reduce" : "no-preference",
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
    const audioResponses = [];
    page.on("console", (message) => { if (message.type() === "error") report.consoleErrors.push(`${viewport.name}: ${message.text()}`); });
    page.on("pageerror", (error) => report.pageErrors.push(`${viewport.name}: ${error.message}`));
    page.on("response", (response) => {
      if (/\/assets\/audio\//u.test(response.url())) audioResponses.push({ url: response.url(), status: response.status() });
      if (response.status() === 404) report.responses404.push(`${viewport.name}: ${response.url()}`);
    });

    await page.goto(new URL("/", baseUrl).href, { waitUntil: "domcontentloaded", timeout: 90_000 });
    await page.waitForFunction(() => Boolean(globalThis.GaiaOpeningAudio));
    assert.equal(await page.locator("#gaia-opening-sound-gate").count(), 0, `${viewport.name}: separate sound screen remains`);
    await page.waitForFunction(() => __qaVisible(document.querySelector("#gaia-opening-sound-modal")));
    await page.waitForFunction(() => document.activeElement?.id === "gaia-opening-sound-on");
    await page.waitForTimeout(viewport.reduced ? 20 : 500);

    const initial = await page.evaluate(() => {
      const readRect = (selector) => document.querySelector(selector)?.getBoundingClientRect().toJSON();
      return {
        menuVisible: __qaVisible(document.querySelector("#gaia-opening-final-menu")),
        modalVisible: __qaVisible(document.querySelector("#gaia-opening-sound-modal")),
        choicesVisible: __qaVisible(document.querySelector(".gaia-opening-sound-choices")),
        choicesInsideModal: Boolean(document.querySelector("#gaia-opening-sound-modal .gaia-opening-sound-choices")),
        audioInsideMenu: Boolean(document.querySelector("#gaia-opening-final-menu .gaia-opening-menu-audio")),
        menuInert: document.querySelector("#gaia-opening-final-menu")?.inert,
        modalHiddenFromA11y: document.querySelector("#gaia-opening-sound-modal")?.getAttribute("aria-hidden"),
        activeId: document.activeElement?.id,
        title: document.querySelector("#gaia-opening-sound-title")?.textContent.trim(),
        description: document.querySelector("#gaia-opening-sound-description")?.textContent.trim(),
        soundOnLabel: document.querySelector("#gaia-opening-sound-on .gaia-opening-sound-option-label")?.textContent.trim(),
        soundOffLabel: document.querySelector("#gaia-opening-sound-off .gaia-opening-sound-option-label")?.textContent.trim(),
        tourLabel: document.querySelector("#gaia-opening-tour-link strong")?.textContent.trim(),
        sliderValue: document.querySelector("#gaia-opening-volume")?.value,
        output: document.querySelector("#gaia-opening-volume-value")?.textContent.trim(),
        soundOnPressed: document.querySelector("#gaia-opening-sound-on")?.getAttribute("aria-pressed"),
        soundOffPressed: document.querySelector("#gaia-opening-sound-off")?.getAttribute("aria-pressed"),
        dockVisible: __qaVisible(document.querySelector("#gaia-audio-dock")),
        preloadVisible: __qaVisible(document.querySelector("#gaia-opening-preload")),
        skipVisible: __qaVisible(document.querySelector("#gaia-opening-skip")),
        openingActive: document.querySelector("#gaia-opening")?.classList.contains("is-active"),
        awaitingSound: document.querySelector("#gaia-opening")?.classList.contains("is-awaiting-sound"),
        modalZIndex: Number.parseInt(getComputedStyle(document.querySelector("#gaia-opening-sound-modal")).zIndex, 10),
        preloadZIndex: Number.parseInt(getComputedStyle(document.querySelector("#gaia-opening-preload")).zIndex, 10),
        particleZIndex: Number.parseInt(getComputedStyle(document.querySelector("#gaia-opening-particles")).zIndex, 10),
        modalRect: readRect("#gaia-opening-sound-modal"),
        dialogRect: readRect(".gaia-opening-sound-dialog"),
        scrimBackground: getComputedStyle(document.querySelector(".gaia-opening-sound-modal-scrim")).backgroundColor,
        modalPlaceItems: getComputedStyle(document.querySelector("#gaia-opening-sound-modal")).placeItems,
        choicesRect: readRect(".gaia-opening-sound-choices"),
        soundOnRect: readRect("#gaia-opening-sound-on"),
        soundOffRect: readRect("#gaia-opening-sound-off"),
        overflowX: Math.max(0, document.documentElement.scrollWidth - innerWidth),
        overflowY: Math.max(0, document.documentElement.scrollHeight - innerHeight),
      };
    });
    assert(!initial.menuVisible && initial.modalVisible && initial.choicesVisible && initial.choicesInsideModal, `${viewport.name}: sound setup is not the first screen`);
    assert.equal(initial.audioInsideMenu, false, `${viewport.name}: sound controls remain embedded in the route menu`);
    assert.equal(initial.menuInert, true, `${viewport.name}: routes are interactive behind the modal`);
    assert.equal(initial.modalHiddenFromA11y, "false");
    assert.equal(initial.activeId, "gaia-opening-sound-on", `${viewport.name}: initial focus escaped the sound-on default`);
    assert.equal(initial.title, "サウンド設定");
    assert.equal(initial.description, "サウンドのオン／オフはゲーム中でも変更できます。");
    assert.equal(initial.soundOnLabel, "サウンドあり");
    assert.equal(initial.soundOffLabel, "サウンドなし");
    assert.equal(initial.tourLabel, "30秒ガイド");
    assert.equal(initial.sliderValue, "23");
    assert.equal(initial.output, "23%");
    assert.equal(initial.soundOnPressed, "true");
    assert.equal(initial.soundOffPressed, "false");
    assert.equal(initial.dockVisible, false, `${viewport.name}: duplicate audio dock is visible on the title menu`);
    assert.equal(initial.preloadVisible, false, `${viewport.name}: preload appeared ahead of sound setup`);
    assert.equal(initial.skipVisible, false, `${viewport.name}: skip appeared ahead of sound setup`);
    assert.equal(initial.openingActive, false, `${viewport.name}: opening animation started before sound confirmation`);
    assert.equal(initial.awaitingSound, true, `${viewport.name}: initial sound gate state is missing`);
    assert(initial.modalZIndex > initial.preloadZIndex && initial.modalZIndex > initial.particleZIndex, `${viewport.name}: sound setup is not the top opening layer`);
    assert(initial.modalRect.left >= -1 && initial.modalRect.right <= viewport.width + 1, `${viewport.name}: modal is outside the viewport`);
    assert(initial.modalRect.top >= -1 && initial.modalRect.bottom <= viewport.height + 1, `${viewport.name}: modal is outside the viewport vertically`);
    assert(initial.dialogRect.left >= -1 && initial.dialogRect.right <= viewport.width + 1, `${viewport.name}: sound dialog is outside the viewport`);
    assert(initial.dialogRect.top >= -1 && initial.dialogRect.bottom <= viewport.height + 1, `${viewport.name}: sound dialog is outside the viewport vertically`);
    assert.equal(initial.scrimBackground, "rgba(0, 0, 0, 0.68)", `${viewport.name}: sound backdrop is not a uniform translucent blackout`);
    const shortLandscape = viewport.width > viewport.height && viewport.height <= 430;
    assert(shortLandscape ? initial.modalPlaceItems.startsWith("start") : initial.modalPlaceItems === "center", `${viewport.name}: sound dialog alignment is incorrect`);
    assert(Math.abs((initial.dialogRect.left + initial.dialogRect.right) / 2 - viewport.width / 2) <= 1, `${viewport.name}: sound dialog is not horizontally centered`);
    if (!shortLandscape) assert(Math.abs((initial.dialogRect.top + initial.dialogRect.bottom) / 2 - viewport.height / 2) <= 6, `${viewport.name}: sound dialog is not vertically centered`);
    for (const rect of [initial.soundOnRect, initial.soundOffRect]) {
      assert(rect.width >= 44 && rect.height >= 44, `${viewport.name}: sound action hit area is smaller than 44px`);
    }
    assert.equal(overlapArea(initial.soundOnRect, initial.soundOffRect), 0, `${viewport.name}: sound actions overlap`);
    assert.equal(initial.overflowX, 0);
    assert.equal(initial.overflowY, 0);
    await page.screenshot({ path: path.join(outputDir, `${viewport.name}-first-sound-setup.png`), animations: "disabled" });

    await page.locator("#gaia-opening-volume").fill("37");
    await page.waitForFunction(() => Math.abs(globalThis.GaiaOpeningAudio.getState().volume - 0.37) < 0.001);
    const storedVolume = await page.evaluate(() => localStorage.getItem("gaia-senseware-bgm-volume"));
    assert.equal(storedVolume, "0.37", `${viewport.name}: volume was not persisted`);
    assert.equal(await page.locator("#gaia-opening-volume-value").textContent(), "37%");

    await page.locator("#gaia-opening-sound-off").focus();
    await page.locator("#gaia-opening-sound-off").press("Tab");
    assert.equal(await page.evaluate(() => document.activeElement?.id), "gaia-opening-sound-on", `${viewport.name}: modal focus did not wrap`);

    const startWithSound = ["pc-1440", "mobile-390", "mobile-landscape"].includes(viewport.name);
    const choice = page.locator(startWithSound ? "#gaia-opening-sound-on" : "#gaia-opening-sound-off");
    if (viewport.mobile) await choice.tap();
    else await choice.click();
    await page.waitForFunction(() => !__qaVisible(document.querySelector("#gaia-opening-sound-modal")));
    if (viewport.reduced) {
      await page.waitForFunction(() => __qaVisible(document.querySelector("#gaia-opening-route-story")));
    } else {
      await page.waitForFunction(() => document.querySelector("#gaia-opening")?.classList.contains("is-active"), null, { timeout: 10_000 });
      await page.waitForFunction(() => __qaVisible(document.querySelector("#gaia-opening-skip")), null, { timeout: 10_000 });
    }
    const confirmed = await page.evaluate(() => ({
      menuInert: document.querySelector("#gaia-opening-final-menu")?.inert,
      activeId: document.activeElement?.id,
      openingActive: document.querySelector("#gaia-opening")?.classList.contains("is-active"),
      awaitingSound: document.querySelector("#gaia-opening")?.classList.contains("is-awaiting-sound"),
      audio: globalThis.GaiaOpeningAudio.getState(),
    }));
    assert.equal(confirmed.menuInert, false, `${viewport.name}: route menu stayed inert after confirmation`);
    assert.equal(confirmed.openingActive, !viewport.reduced, `${viewport.name}: opening motion state is incorrect after sound confirmation`);
    assert.equal(confirmed.awaitingSound, false, `${viewport.name}: sound gate state remained after confirmation`);
    assert.equal(confirmed.audio.muted, !startWithSound, `${viewport.name}: confirmed sound choice was not applied`);
    assert.equal(confirmed.audio.track, "opening", `${viewport.name}: the opening did not start with Planet Forecast - Hope`);
    await page.screenshot({ path: path.join(outputDir, `${viewport.name}-post-sound.png`), animations: "disabled" });

    if (!viewport.reduced) {
      assert.equal(await page.locator("#gaia-opening-route-story").isVisible(), false, `${viewport.name}: title menu appeared before the cinematic ended`);
      await page.locator("#gaia-opening-skip").click();
      await page.waitForFunction(() => __qaVisible(document.querySelector("#gaia-opening-route-story")));
    }
    await page.waitForFunction(() => document.activeElement?.id === "gaia-opening-route-story");
    const routeReady = await page.evaluate(() => {
      const readRect = (selector) => document.querySelector(selector)?.getBoundingClientRect().toJSON();
      const cards = Array.from(document.querySelectorAll(".gaia-opening-route-grid .gaia-opening-route"), (card) => ({
        id: card.id,
        rect: card.getBoundingClientRect().toJSON(),
        strongRect: card.querySelector("strong")?.getBoundingClientRect().toJSON(),
        symbolRect: card.querySelector(".gaia-opening-route-symbol")?.getBoundingClientRect().toJSON(),
        english: card.querySelector(".gaia-opening-route-en")?.textContent.trim(),
        englishVisible: __qaVisible(card.querySelector(".gaia-opening-route-en")),
        iconPosition: getComputedStyle(card.querySelector(".gaia-opening-route-icon")).position,
        glintDisplay: getComputedStyle(card, "::after").display,
      }));
      return {
        menuVisible: __qaVisible(document.querySelector("#gaia-opening-final-menu")),
        modalVisible: __qaVisible(document.querySelector("#gaia-opening-sound-modal")),
        menuInert: document.querySelector("#gaia-opening-final-menu")?.inert,
        activeId: document.activeElement?.id,
        finalPanelOpacity: Number(getComputedStyle(document.querySelector(".gaia-vn-panel-final")).opacity),
        menuRect: readRect("#gaia-opening-final-menu"),
        storyRect: readRect("#gaia-opening-route-story"),
        otherRect: readRect("#gaia-opening-route-other"),
        guideReplayRect: readRect("#gaia-opening-route-guide-replay"),
        guideReplayLabel: document.querySelector("#gaia-opening-route-guide-replay strong")?.textContent.trim(),
        guideReplayEnglish: document.querySelector("#gaia-opening-route-guide-replay small")?.textContent.trim(),
        cards,
        overflowX: Math.max(0, document.documentElement.scrollWidth - innerWidth),
        overflowY: Math.max(0, document.documentElement.scrollHeight - innerHeight),
      };
    });
    assert(routeReady.menuVisible && !routeReady.modalVisible, `${viewport.name}: route menu did not replace the sound setup`);
    assert.equal(routeReady.menuInert, false);
    assert.equal(routeReady.activeId, "gaia-opening-route-guide");
    assert(routeReady.finalPanelOpacity > 0.99, `${viewport.name}: final route scene is visually hidden`);
    assert(routeReady.menuRect.left >= -1 && routeReady.menuRect.right <= viewport.width + 1, `${viewport.name}: menu is outside the viewport`);
    assert(routeReady.menuRect.top >= -1 && routeReady.menuRect.bottom <= viewport.height + 1, `${viewport.name}: menu is outside the viewport vertically`);
    for (const rect of [routeReady.storyRect, routeReady.otherRect]) {
      assert(rect.width >= 44 && rect.height >= 64, `${viewport.name}: route hit area is too small`);
    }
    assert.equal(routeReady.guideReplayLabel, "入口ガイド");
    assert.equal(routeReady.guideReplayEnglish, "CHOICE GUIDE");
    assert(routeReady.guideReplayRect.width >= 44 && routeReady.guideReplayRect.height >= 44, `${viewport.name}: guide replay hit area is smaller than 44px`);
    assert.equal(routeReady.cards.length, 3, `${viewport.name}: the three route cards are incomplete`);
    for (const card of routeReady.cards) {
      assert(card.english, `${viewport.name}: ${card.id} has no English label`);
      assert.equal(card.englishVisible, !shortLandscape, `${viewport.name}: ${card.id} English-label visibility is inconsistent`);
      assert.equal(card.iconPosition, "static", `${viewport.name}: ${card.id} icon escaped its dedicated column`);
      assert.equal(card.glintDisplay, viewport.reduced ? "none" : "block", `${viewport.name}: ${card.id} glint layer is incorrect`);
      assert.equal(overlapArea(card.strongRect, card.symbolRect), 0, `${viewport.name}: ${card.id} label overlaps its icon`);
    }
    assert.equal(routeReady.overflowX, 0);
    assert.equal(routeReady.overflowY, 0);
    await page.screenshot({ path: path.join(outputDir, `${viewport.name}-route-ready.png`), animations: "disabled" });

    await page.locator("#gaia-opening-route-guide").click({ position: { x: 8, y: 8 } });
    await page.waitForFunction(() => document.querySelector("#gaia-opening-route-guide")?.dataset.step === "2");
    await page.locator("#gaia-opening-route-guide").click({ position: { x: 8, y: 8 } });
    await page.waitForFunction(() => document.querySelector("#gaia-opening-route-guide")?.dataset.step === "3");
    await page.locator("#gaia-opening-route-guide").click({ position: { x: 8, y: 8 } });
    await page.waitForFunction(() => !document.querySelector("#gaia-opening-route-guide")?.classList.contains("is-visible"));

    const useDataRoute = ["pc-4k", "mobile-360"].includes(viewport.name);
    const routeStartedAt = Date.now();
    await page.locator(useDataRoute ? "#gaia-opening-route-other" : "#gaia-opening-route-story").click();
    await page.waitForFunction(() => document.querySelector("#gaia-opening")?.hidden === true, null, { timeout: 10_000 });
    await page.waitForFunction((dataRoute) => dataRoute
      ? __qaVisible(document.querySelector("#intro-layer"))
      : __qaVisible(document.querySelector("#novel-runtime")), useDataRoute, { timeout: 10_000 });
    const destinationVisibleMs = Date.now() - routeStartedAt;
    const expectedDestinationTrack = useDataRoute ? "senseware" : "story";
    await page.waitForFunction((track) => globalThis.GaiaOpeningAudio.getState().track === track, expectedDestinationTrack, { timeout: 2_500 });
    const trackSwitchMs = Date.now() - routeStartedAt;
    const trackSwitchAfterDestinationMs = trackSwitchMs - destinationVisibleMs;
    await page.waitForFunction(() => __qaVisible(document.querySelector("#gaia-audio-dock")), null, { timeout: 10_000 });
    const destination = await page.evaluate(() => ({
      titleVisible: __qaVisible(document.querySelector("#novel-title-screen")),
      runtimeVisible: __qaVisible(document.querySelector("#novel-runtime")),
      stepId: globalThis.GaiaNovel?.getState?.().stepId,
      introVisible: __qaVisible(document.querySelector("#intro-layer")),
      dockVisible: __qaVisible(document.querySelector("#gaia-audio-dock")),
      track: globalThis.GaiaOpeningAudio.getState().track,
      muted: globalThis.GaiaOpeningAudio.getState().muted,
      volume: globalThis.GaiaOpeningAudio.getState().volume,
      overflowX: Math.max(0, document.documentElement.scrollWidth - innerWidth),
      overflowY: Math.max(0, document.documentElement.scrollHeight - innerHeight),
    }));
    assert.equal(destination.titleVisible, false, `${viewport.name}: true first access stopped at the story title`);
    assert.equal(destination.runtimeVisible, !useDataRoute, `${viewport.name}: story did not begin immediately on true first access`);
    if (!useDataRoute) {
      assert.equal(destination.stepId, "festival_concept_001", `${viewport.name}: story began at the wrong first step`);
      assert.equal(destination.track, "story", `${viewport.name}: opening BGM remained active after the story began`);
      assert(trackSwitchMs <= 2_500, `${viewport.name}: story BGM switch took ${trackSwitchMs}ms`);
      assert(trackSwitchAfterDestinationMs <= 600, `${viewport.name}: opening BGM remained for ${trackSwitchAfterDestinationMs}ms after the story became visible`);
      assert(audioResponses.some(({ url, status }) => url.includes("planet-forecast-windowlight.mp3") && [200, 206].includes(status)), `${viewport.name}: story BGM was not fetched successfully`);
    } else {
      assert.equal(destination.track, "senseware", `${viewport.name}: GAIA SENSEWARE BGM was not selected for the data screen`);
      assert(trackSwitchMs <= 4_000, `${viewport.name}: GAIA SENSEWARE BGM switch took ${trackSwitchMs}ms`);
      assert(trackSwitchAfterDestinationMs <= 600, `${viewport.name}: opening BGM remained for ${trackSwitchAfterDestinationMs}ms after the data screen became visible`);
      assert(audioResponses.some(({ url, status }) => url.includes("moonlit-source-save.mp3") && [200, 206].includes(status)), `${viewport.name}: GAIA SENSEWARE BGM was not fetched successfully`);
    }
    if (startWithSound) {
      assert(audioResponses.some(({ url, status }) => url.includes("satellite-forecast-hope.mp3") && [200, 206].includes(status)), `${viewport.name}: Planet Forecast - Hope was not fetched for the opening`);
    }
    assert.equal(destination.introVisible, useDataRoute, `${viewport.name}: data menu did not open`);
    assert(destination.dockVisible, `${viewport.name}: destination audio control is missing`);
    assert.equal(destination.muted, !startWithSound);
    assert(Math.abs(destination.volume - 0.37) < 0.001);
    assert.equal(destination.overflowX, 0);
    assert.equal(destination.overflowY, 0);
    report.scans.push({ viewport: viewport.name, route: useDataRoute ? "data" : "story", destinationVisibleMs, trackSwitchMs, trackSwitchAfterDestinationMs, audioResponses, initial, confirmed, routeReady, destination, passed: true });
    await context.close();
  }

  assert.deepEqual(report.consoleErrors, []);
  assert.deepEqual(report.pageErrors, []);
  assert.deepEqual(report.responses404, []);
  report.status = "passed";
  console.log(`Opening sound modal passed: ${report.scans.length} viewports`);
} catch (error) {
  report.status = "failed";
  report.error = error instanceof Error ? error.stack : String(error);
  throw error;
} finally {
  fs.writeFileSync(path.join(outputDir, "report.json"), `${JSON.stringify(report, null, 2)}\n`, "utf8");
  await browser.close();
}
