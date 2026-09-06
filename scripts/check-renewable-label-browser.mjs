import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright-core";

const base = process.argv[2] || "http://127.0.0.1:4397";
const output = path.resolve(process.argv[3] || "artifacts/renewable-generation-share");
const widths = (process.argv[4] || "1440,3840,901,390,320").split(",").map(Number);
fs.mkdirSync(output, { recursive: true });
const report = { status: "running", checks: [], errors: [] };
const browser = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
let page;
try {
  for (const width of widths) {
    const height = width >= 2400 ? 2160 : width < 600 ? 844 : 900;
    const context = await browser.newContext({ viewport: { width, height }, hasTouch: width <= 900, reducedMotion: "reduce" });
    await context.addInitScript(() => {
      sessionStorage.setItem("gaia:mode-entry-guide:map:v3", "seen");
      localStorage.setItem("gaia-senseware-bgm-muted", "true");
    });
    await context.route("https://services.swpc.noaa.gov/**", route => route.fulfill({ path: "data/ovation-aurora-snapshot.json", contentType: "application/json" }));
    page = await context.newPage();
    page.on("pageerror", error => report.errors.push({ width, message: error.message }));
    await page.goto(`${base}/?mode=13&preview=renewable-label#world`, { waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => globalThis.GaiaMapObservationAdapter && globalThis.GaiaMapCategories?.buttons().length === 30);
    await page.evaluate(async () => {
      await GaiaMapObservationAdapter.waitSignalsReady();
      GaiaModeEntryGuide.close("map", { restoreFocus: false });
      GaiaMapObservationAdapter.selectMode(7);
    });
    await page.waitForFunction(() => !document.querySelector("#japan-layer").classList.contains("is-map-title-transitioning"));
    for (const iso3 of ["JPN", "SWE", "ISL"]) {
      const source = await page.evaluate(async iso3 => {
        const snapshot = await GaiaMapObservationAdapter.waitSignalsReady();
        const rows = snapshot.modes.find(mode => mode.id === "earth-organ").signals.current.slice().sort((a, b) => b.renewablePercent - a.renewablePercent);
        const index = rows.findIndex(row => row.iso3 === iso3), row = rows[index];
        GaiaMapObservationAdapter.setSignalTime((index + .5) / rows.length * 100);
        GaiaMapObservationAdapter.focusEarthLocation({ lon: row.lon, lat: row.lat, zoom: 1.8, targetX: .5, targetY: .45, durationMs: 0 });
        return row;
      }, iso3);
      await page.waitForFunction(value => document.querySelector("#japan-overlay").dataset.renewableSelectedPercent === value, source.renewablePercent.toFixed(1));
      const scan = await page.locator('.signal-console-map .signal-console-heading').evaluate(heading => {
        const value = heading.querySelector("[data-signal-value]");
        const range = document.createRange(); range.selectNodeContents(value);
        const glyphs = [...range.getClientRects()].map(rect => rect.toJSON());
        return { text: value.textContent, glyphs, value: value.getBoundingClientRect().toJSON(), heading: heading.getBoundingClientRect().toJSON(),
          dock: document.querySelector(".map-command-dock").getBoundingClientRect().toJSON(),
          overlay: { ...document.querySelector("#japan-overlay").dataset }, overflow: document.documentElement.scrollWidth - innerWidth };
      });
      assert.match(scan.text, /再生可能エネルギー発電割合/u);
      assert(scan.text.includes(`${source.renewablePercent.toFixed(1)}%`));
      assert.equal(scan.overflow, 0);
      for (const rect of scan.glyphs) {
        assert(rect.x >= scan.value.x - 1 && rect.right <= scan.value.right + 1, `${width}/${iso3}: clipped metric label or number`);
        assert(rect.y >= scan.heading.y - 1 && rect.bottom <= scan.heading.bottom + 1, `${width}/${iso3}: metric overflows heading`);
      }
      if (width > 900) assert(scan.value.y >= scan.dock.y && scan.value.bottom <= scan.dock.bottom, `${width}/${iso3}: metric overflows dock`);
      report.checks.push({ width, iso3, source, ...scan });
      if (iso3 === "JPN") {
        await page.screenshot({ path: path.join(output, `${width}-screen.jpg`), type: "jpeg", quality: 88 });
        await page.locator('.signal-console-map .signal-console-heading').screenshot({ path: path.join(output, `${width}-readout.png`) });
      }
    }
    await context.close();
    console.log(`PASS ${width}: full generation-share label and source values for Japan, Sweden and Iceland`);
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
