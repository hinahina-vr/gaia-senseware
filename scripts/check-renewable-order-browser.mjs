import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright-core";

const base = process.argv[2] || "http://127.0.0.1:4397";
const output = path.resolve(process.argv[3] || "artifacts/renewable-descending");
fs.mkdirSync(output, { recursive: true });
const report = { status: "running", checks: [], errors: [] };
const browser = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
let page;
try {
  for (const width of [390, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: width < 600 ? 844 : 900 },
      hasTouch: width < 600, reducedMotion: width < 600 ? "reduce" : "no-preference" });
    await context.addInitScript(() => {
      sessionStorage.setItem("gaia:mode-entry-guide:map:v3", "seen");
      localStorage.setItem("gaia-senseware-bgm-muted", "true");
    });
    await context.route("https://services.swpc.noaa.gov/**", route => route.fulfill({ path: "data/ovation-aurora-snapshot.json", contentType: "application/json" }));
    page = await context.newPage();
    page.on("pageerror", error => report.errors.push({ width, message: error.message }));
    await page.goto(`${base}/?mode=13&preview=renewable-order#world`, { waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => globalThis.GaiaMapObservationAdapter && globalThis.GaiaMapCategories?.buttons().length === 30);
    const source = await page.evaluate(async () => {
      const snapshot = await GaiaMapObservationAdapter.waitSignalsReady();
      GaiaModeEntryGuide.close("map", { restoreFocus: false });
      GaiaMapObservationAdapter.selectMode(7);
      return snapshot.modes.find(mode => mode.id === "earth-organ").signals.current;
    });
    const expected = source.slice().sort((a, b) => b.renewablePercent - a.renewablePercent);
    assert.equal(expected.length, 31);
    await page.waitForFunction(() => !document.querySelector("#japan-layer").classList.contains("is-map-title-transitioning"));
    await page.waitForFunction(() => document.querySelector("#japan-overlay").dataset.plotRevealState === "complete");
    const sequence = [];
    for (let index = 0; index < expected.length; index++) {
      await page.locator("#japan-layer [data-signal-time]").first().evaluate((input, position) => {
        input.value = String(position);
        input.dispatchEvent(new Event("input", { bubbles: true }));
      }, index === 0 ? 0 : index === expected.length - 1 ? 100 : (index + .5) / expected.length * 100);
      await page.waitForFunction(percent => document.querySelector("#japan-overlay").dataset.renewableSelectedPercent === percent, expected[index].renewablePercent.toFixed(1));
      const actual = await page.evaluate(() => ({
        country: document.querySelector("#japan-overlay").dataset.renewableSelectedCountry,
        percent: document.querySelector("#japan-overlay").dataset.renewableSelectedPercent,
        text: document.querySelector("#japan-layer [data-signal-value]").textContent,
        overflow: document.documentElement.scrollWidth - innerWidth,
      }));
      assert.match(actual.text, /再生可能エネルギー発電割合/u);
      assert(actual.text.includes(actual.percent + "%"));
      assert.equal(actual.overflow, 0);
      sequence.push(actual);
      if (index === 0) {
        await page.evaluate(row => GaiaMapObservationAdapter.focusEarthLocation({ lon: row.lon, lat: row.lat,
          zoom: 1.5, targetX: .5, targetY: .4, durationMs: 0 }), expected[0]);
        await page.screenshot({ path: path.join(output, `${width}-highest.jpg`), type: "jpeg", quality: 88 });
      }
    }
    assert.deepEqual(sequence.map(row => row.percent), expected.map(row => row.renewablePercent.toFixed(1)));
    assert.equal(sequence[0].country, "アイスランド");
    const preserved = await page.evaluate(async () => (await GaiaMapObservationAdapter.waitSignalsReady()).modes.find(mode => mode.id === "earth-organ").signals.current);
    assert.deepEqual(preserved, source, "Ranking must not mutate the source data or its order");
    report.checks.push({ width, manual: sequence });
    console.log(`PASS ${width}: all 31 slider selections descend, endpoints and source values preserved`);

    if (width === 1440) {
      // Observe the real 48-second animation, including the last -> first wrap.
      // No clock mocking or direct changes to the production playback duration.
      await page.evaluate(() => GaiaMapObservationAdapter.setSignalTime(0));
      await page.waitForFunction(percent => document.querySelector("#japan-overlay").dataset.renewableSelectedPercent === percent, expected[0].renewablePercent.toFixed(1));
      await page.evaluate(() => {
        const records = [];
        const sample = () => {
          const overlay = document.querySelector("#japan-overlay");
          const country = overlay.dataset.renewableSelectedCountry;
          if (country && records.at(-1)?.country !== country) records.push({ country,
            percent: overlay.dataset.renewableSelectedPercent, at: performance.now() });
        };
        globalThis.renewablePlaybackCheck = { records, timer: setInterval(sample, 50) };
        sample();
      });
      await page.waitForFunction(() => renewablePlaybackCheck.records.length >= 32, null, { timeout: 59_000 });
      const playback = await page.evaluate(() => {
        clearInterval(renewablePlaybackCheck.timer);
        return renewablePlaybackCheck.records.slice(0, 32);
      });
      assert.deepEqual(playback.map(row => row.percent), [...expected, expected[0]].map(row => row.renewablePercent.toFixed(1)));
      assert.equal(playback[31].country, "アイスランド");
      report.checks.at(-1).playback = playback;
      console.log("PASS desktop: actual autoplay visits all 31 countries in descending order and loops to Iceland");
    }
    await context.close();
  }
  assert.deepEqual(report.errors, []);
  report.status = "passed";
} catch (error) {
  report.status = "failed"; report.failure = error.stack;
  await page?.screenshot({ path: path.join(output, "failure.jpg"), type: "jpeg", quality: 88 }).catch(() => {});
  throw error;
} finally {
  fs.writeFileSync(path.join(output, "report.json"), JSON.stringify(report, null, 2));
  await browser.close();
}
