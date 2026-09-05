import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright-core";

const base = process.argv[2] || "http://127.0.0.1:4397";
const output = path.resolve(process.argv[3] || "artifacts/separator-band-bloom");
fs.mkdirSync(output, { recursive: true });
const report = { status: "running", scans: [], errors: [] };
const browser = await chromium.launch({ headless: true, executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });
const viewports = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "4k", width: 3840, height: 2160 },
  { name: "mobile", width: 390, height: 844 },
  { name: "minimum", width: 280, height: 653 },
  { name: "landscape", width: 568, height: 320 },
  { name: "reduced", width: 390, height: 844, reduced: true },
];
const select = (page, number) => page.evaluate(number => {
  [...document.querySelectorAll(".map-mode-bank .map-mode-button")]
    .find(button => button.textContent.trim() === String(number).padStart(2, "0")).click();
}, number);
const readPhases = (page, times) => page.evaluate(times => {
  const layer = document.querySelector("#map-title-transition");
  const title = document.querySelector("#map-title-transition-text");
  const animations = layer.getAnimations({ subtree: true });
  return times.map(time => {
    animations.forEach(animation => { animation.pause(); animation.currentTime = time; });
    const root = getComputedStyle(layer);
    const band = getComputedStyle(layer, "::before");
    const type = getComputedStyle(title);
    const rect = title.getBoundingClientRect();
    return {
      time, names: animations.map(animation => animation.animationName),
      rootOpacity: Number(root.opacity), rootPointer: root.pointerEvents,
      bandOpacity: Number(band.opacity), bandScale: new DOMMatrix(band.transform).a,
      bandX: new DOMMatrix(band.transform).e, bandOrigin: band.transformOrigin,
      bandCurve: band.animationTimingFunction,
      text: title.textContent, typeOpacity: Number(type.opacity), typeScale: new DOMMatrix(type.transform).a,
      typeFilter: type.filter, typeColor: type.color, typeShadow: type.textShadow,
      rect: { x: rect.x, right: rect.right, y: rect.y, bottom: rect.bottom },
    };
  });
}, times);

try {
  for (const viewport of viewports) {
    const page = await browser.newPage({
      viewport: { width: viewport.width, height: viewport.height }, hasTouch: viewport.width < 720,
      reducedMotion: viewport.reduced ? "reduce" : "no-preference",
    });
    page.on("pageerror", error => report.errors.push({ viewport: viewport.name, message: error.message }));
    await page.addInitScript(() => sessionStorage.setItem("gaia:mode-entry-guide:map:v3", "seen"));
    await page.route("https://services.swpc.noaa.gov/**", route => route.fulfill({ path: "data/ovation-aurora-snapshot.json", contentType: "application/json" }));
    await page.goto(`${base}/?preview=separator-band-bloom#world`, { waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => document.documentElement.dataset.gaiaAppReady === "true"
      && document.querySelectorAll(".map-mode-bank .map-mode-button").length === 30 && document.querySelector("#gaia-boot")?.hidden);
    await page.evaluate(() => GaiaModeEntryGuide?.close?.("map", { restoreFocus: false }));
    await select(page, 2);
    await page.waitForFunction(() => !document.querySelector("#japan-layer").classList.contains("is-map-title-transitioning"));
    await select(page, 1);
    await page.waitForFunction(() => document.querySelector("#map-title-transition-text").textContent.startsWith("01　")
      && document.querySelector("#japan-layer").classList.contains("is-map-title-transitioning"));
    const times = viewport.reduced ? [0, 100, 230, 460] : [0, 150, 300, 450, 600, 690, 735, 1050, 1400, 1500];
    const phases = await readPhases(page, times);
    for (const phase of phases) {
      assert.equal(phase.text, "01　地球の一呼吸");
      assert.equal(phase.rootPointer, "none");
      assert(phase.bandOrigin.startsWith("0px "), `${viewport.name}: band does not start at the left edge`);
      assert.equal(phase.bandX, 0);
      assert(phase.rect.x >= -1 && phase.rect.right <= viewport.width + 1
        && phase.rect.y >= -1 && phase.rect.bottom <= viewport.height + 1, `${viewport.name}: type escapes the viewport`);
    }
    if (viewport.reduced) {
      assert(phases.every(phase => phase.bandScale === 1 && phase.typeScale === 1 && phase.typeFilter === "none"));
      assert(phases.every(phase => phase.names.includes("map-title-separator-still")));
      assert.equal(phases[1].typeOpacity, 1);
      assert.equal(phases[1].typeShadow, phases[2].typeShadow, "Reduced motion must not flare");
    } else {
      const [start, quarter, half, threeQuarters, bandDone, typeArriving, bloom, hold, leave, end] = phases;
      assert.equal(start.bandScale, 0);
      assert(quarter.bandScale > .5 && quarter.bandScale < 1);
      assert(half.bandScale > quarter.bandScale && half.bandScale < 1);
      assert(threeQuarters.bandScale > half.bandScale && threeQuarters.bandScale < 1);
      assert(half.bandScale - quarter.bandScale > threeQuarters.bandScale - half.bandScale, "Band is not easing out");
      assert.equal(bandDone.bandScale, 1);
      assert.equal(quarter.bandCurve, "cubic-bezier(0.16, 0.84, 0.22, 1)");
      assert(phases.slice(0, 5).every(phase => phase.typeOpacity === 0), "Type appeared before the band finished");
      assert(typeArriving.typeOpacity > .5 && typeArriving.typeOpacity < 1);
      assert.equal(bloom.typeOpacity, 1);
      assert.equal(bloom.typeScale, 1.025);
      assert.equal(bloom.typeColor, "rgb(255, 255, 246)");
      assert(bloom.typeShadow.includes("82px"), "Type has no luminous bloom");
      assert.equal(hold.typeFilter, "none");
      assert.equal(hold.typeScale, 1);
      assert.equal(hold.typeOpacity, 1);
      assert.equal(leave.bandScale, 1, "The departing band retracted instead of dissolving");
      assert(leave.rootOpacity < hold.rootOpacity);
      assert.equal(end.rootOpacity, 0);
    }
    const clip = await page.evaluate(() => {
      const layer = document.querySelector("#map-title-transition");
      const rect = layer.getBoundingClientRect();
      const bandHeight = Number.parseFloat(getComputedStyle(layer, "::before").height);
      const y = Math.max(0, Math.floor(rect.top + rect.height / 2 - bandHeight / 2 - 24));
      return { x: Math.max(0, Math.ceil(rect.x)), y, width: Math.min(innerWidth, Math.floor(rect.width)), height: Math.min(innerHeight - y, Math.ceil(bandHeight + 48)) };
    });
    for (const time of viewport.reduced ? [100] : [150, 600, 735, 1050]) {
      await readPhases(page, [time]);
      await page.screenshot({ path: path.join(output, `${viewport.name}-${time}.jpg`), type: "jpeg", quality: 87, clip });
    }
    // The visual stages use the existing 1500/460ms lifecycle. They must not
    // extend the POI reveal gate or leave a paused CSS surface behind.
    await page.waitForFunction(() => !document.querySelector("#japan-layer").classList.contains("is-map-title-transitioning"));
    const completed = await page.evaluate(() => ({
      state: document.querySelector("#japan-overlay").dataset.titleSeparatorState,
      duration: Number(document.querySelector("#japan-overlay").dataset.titleSeparatorEndsAt) - Number(document.querySelector("#japan-overlay").dataset.titleSeparatorStartedAt),
      animations: document.querySelector("#map-title-transition").getAnimations({ subtree: true }).length,
      opacity: getComputedStyle(document.querySelector("#map-title-transition")).opacity,
    }));
    assert.equal(completed.state, "complete");
    assert.equal(completed.animations, 0);
    assert.equal(completed.opacity, "0");
    assert(Math.abs(completed.duration - (viewport.reduced ? 460 : 1500)) < 1);
    report.scans.push({ viewport, phases, completed, passed: true });
    console.log(`${viewport.name}: left-to-right ease-out, delayed type bloom, and lifecycle passed`);
    await page.close();
  }
  assert.deepEqual(report.errors, []);
  report.status = "passed";
} catch (error) {
  report.status = "failed";
  report.error = error.stack || String(error);
  throw error;
} finally {
  fs.writeFileSync(path.join(output, "report.json"), `${JSON.stringify(report, null, 2)}\n`);
  await browser.close();
}
