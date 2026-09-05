import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright-core";

const base = process.argv[2] || "http://127.0.0.1:4397";
const output = path.resolve(process.argv[3] || "artifacts/all-exhibit-separators");
fs.mkdirSync(output, { recursive: true });
const report = { status: "running", checks: [], errors: [] };
let currentPage;
const browser = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
try {
  for (const { width, reduced } of [
    { width: 1440 }, { width: 390 }, { width: 320, reduced: true }, { width: 3840, reduced: true },
  ]) {
    const height = width === 3840 ? 2088 : width <= 720 ? 844 : 900;
    const context = await browser.newContext({
      viewport: { width, height }, reducedMotion: reduced ? "reduce" : "no-preference", hasTouch: width <= 720,
    });
    await context.addInitScript(() => {
      sessionStorage.setItem("gaia:mode-entry-guide:map:v3", "seen");
      localStorage.setItem("gaia-senseware-bgm-muted", "true");
    });
    await context.route("https://services.swpc.noaa.gov/**", route => route.fulfill({ path: "data/ovation-aurora-snapshot.json", contentType: "application/json" }));
    for (const host of ["api.open-meteo.com", "air-quality-api.open-meteo.com"]) {
      await context.route(`https://${host}/**`, route => {
        const count = new URL(route.request().url()).searchParams.get("latitude")?.split(",").length || 1;
        const rows = Array.from({ length: count }, () => ({ current: {
          time: "2026-09-06T00:00", wind_speed_10m: 5, wind_direction_10m: 80,
          surface_pressure: 1005, cloud_cover: 58, shortwave_radiation: 194, pm2_5: 9.9, aerosol_optical_depth: .18,
        } }));
        return route.fulfill({ json: count === 1 ? rows[0] : rows });
      });
    }
    await context.route("https://earthquake.usgs.gov/**", route => route.fulfill({ json: {
      type: "FeatureCollection", metadata: { generated: Date.now() }, features: [{
        type: "Feature", id: "separator-test", geometry: { type: "Point", coordinates: [140, 36, 10] },
        properties: { mag: 3, time: Date.now(), place: "TEST" },
      }],
    } }));
    const page = await context.newPage();
    currentPage = page;
    page.on("pageerror", error => report.errors.push(error.message));
    await page.goto(`${base}/?preview=all-exhibit-separators#world`, { waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => document.documentElement.dataset.gaiaAppReady === "true"
      && document.querySelectorAll(".map-mode-bank .map-mode-button").length === 30);
    await page.evaluate(() => globalThis.GaiaModeEntryGuide?.close?.("map", { restoreFocus: false }));
    const select = async number => page.evaluate(number => [...document.querySelectorAll(".map-mode-bank .map-mode-button")]
      .find(button => button.textContent.trim() === String(number).padStart(2, "0")).click(), number);
    const settled = () => page.waitForFunction(() => !document.querySelector("#japan-layer").classList.contains("is-map-title-transitioning"));
    const scan = () => page.evaluate(() => {
      const title = document.querySelector("#japan-title");
      const separator = document.querySelector("#map-title-transition");
      const text = separator.querySelector("span");
      const data = document.querySelector("#japan-overlay").dataset;
      const rect = text.getBoundingClientRect();
      const range = document.createRange();
      range.selectNodeContents(text);
      const glyphs = [...range.getClientRects()].map(r => ({ x: r.x, right: r.right, y: r.y, bottom: r.bottom }));
      return {
        number: title.dataset.exhibitNumber, title: title.textContent, text: text.textContent,
        running: document.querySelector("#japan-layer").classList.contains("is-map-title-transitioning"),
        state: data.titleSeparatorState, startedAt: Number(data.titleSeparatorStartedAt), endsAt: Number(data.titleSeparatorEndsAt),
        animation: getComputedStyle(separator).animationName, duration: getComputedStyle(separator).animationDuration,
        visibility: getComputedStyle(separator).visibility, opacity: Number(getComputedStyle(separator).opacity),
        pointerEvents: getComputedStyle(separator).pointerEvents,
        textOpacity: Number(getComputedStyle(text).opacity),
        bandScale: new DOMMatrix(getComputedStyle(separator, "::before").transform).a,
        bandOrigin: getComputedStyle(separator, "::before").transformOrigin,
        rect: { x: rect.x, right: rect.right, y: rect.y, bottom: rect.bottom }, glyphs,
      };
    });
    await select(2);
    await settled();
    let baseline;
    for (const number of [1, ...Array.from({ length: 21 }, (_, i) => i + 10)]) {
      await select(number);
      await page.waitForFunction(number => {
        const text = document.querySelector("#map-title-transition-text").textContent;
        return text.startsWith(`${String(number).padStart(2, "0")}　`)
          && document.querySelector("#japan-layer").classList.contains("is-map-title-transitioning");
      }, number);
      await page.waitForTimeout(reduced ? 100 : 930);
      const result = await scan();
      report.checks.push({ width, reduced: Boolean(reduced), ...result });
      assert.equal(result.text, `${result.number}　${result.title}`, `${width}/${number}: stale separator title`);
      assert.equal(result.number, String(number).padStart(2, "0"));
      assert.equal(result.running, true);
      assert.equal(result.state, "running");
      assert.equal(result.animation, "map-title-separator-crossfade");
      assert.equal(result.duration, reduced ? "0.46s" : "1.5s");
      assert.equal(result.visibility, "visible");
      assert(result.opacity > .4, `${width}/${number}: separator not visible`);
      assert(result.textOpacity > .95, `${width}/${number}: typography did not settle after the band`);
      assert(Math.abs(result.bandScale - 1) < .001, `${width}/${number}: band did not reach the right edge`);
      assert(result.bandOrigin.startsWith("0px "), `${width}/${number}: band is not anchored to the left`);
      assert.equal(result.pointerEvents, "none", "Separator must not block chapter navigation");
      assert(Math.abs(result.endsAt - result.startedAt - (reduced ? 460 : 1500)) < 1);
      for (const rect of [result.rect, ...result.glyphs]) {
        assert(rect.x >= 0 && rect.right <= width + 1 && rect.y >= 0 && rect.bottom <= height + 1,
          `${width}/${number}: title clipped ${JSON.stringify(rect)}`);
      }
      if (number === 1) baseline = result;
      else assert.equal(result.animation, baseline.animation);
      if ([11, 18, 26, 30].includes(number)) {
        await page.screenshot({ path: path.join(output, `${width}-${number}-separator.jpg`), type: "jpeg", quality: 85 });
      }
      // Same heading/POI refreshes must neither restart an active separator nor replay it afterwards.
      if (number === 11) {
        await select(number);
        await page.evaluate(() => {
          dispatchEvent(new CustomEvent("gaia:live-update"));
          dispatchEvent(new CustomEvent("gaia:japan-mode-change"));
        });
        assert.equal((await scan()).startedAt, result.startedAt, "Repeated update restarted separator");
      }
      await settled();
      assert.equal((await scan()).state, "complete");
      if (number === 18) {
        await select(number);
        await page.waitForTimeout(100);
        assert.equal((await scan()).running, false, "Same exhibit replayed separator");
      }
    }
    // Outgoing timers must not dismiss the newest exhibit during fast cross-family navigation.
    for (const number of [11, 16, 26, 30]) {
      await select(number);
      await page.waitForTimeout(reduced ? 40 : 110);
      assert.equal((await scan()).number, String(number));
    }
    const latest = await scan();
    await page.waitForTimeout(reduced ? 170 : 1000);
    const stillLatest = await scan();
    assert.equal(stillLatest.text, latest.text);
    assert.equal(stillLatest.startedAt, latest.startedAt);
    assert.equal(stillLatest.running, true, "An older separator timer ended the latest one");
    await settled();
    // Returning to the unchanged underlying base mode still gets its own separator.
    await select(1);
    await page.waitForFunction(() => document.querySelector("#map-title-transition-text").textContent.startsWith("01　")
      && document.querySelector("#japan-layer").classList.contains("is-map-title-transitioning"));
    await settled();
    await select(11);
    await page.locator("#japan-close").click();
    await page.waitForTimeout(reduced ? 500 : 1600);
    const closed = await scan();
    assert.equal(closed.running, false);
    assert.equal(closed.state, "cancelled", "Close must cancel the pending separator");
    assert.equal(await page.locator("#japan-layer").getAttribute("aria-hidden"), "true");
    console.log(JSON.stringify({ width, reduced: Boolean(reduced), status: "passed", exhibits: 22 }));
    await context.close();
  }
  assert.deepEqual(report.errors, []);
  report.status = "passed";
} catch (error) {
  report.status = "failed";
  report.failure = error.stack;
  await currentPage?.screenshot({ path: path.join(output, "failure.jpg"), type: "jpeg", quality: 85 }).catch(() => {});
  throw error;
} finally {
  fs.writeFileSync(path.join(output, "report.json"), JSON.stringify(report, null, 2));
  await browser.close();
}
