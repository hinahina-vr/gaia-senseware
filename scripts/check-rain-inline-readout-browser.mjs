import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright-core";

const base = process.argv[2] || "http://127.0.0.1:4397";
const output = path.resolve(process.argv[3] || "artifacts/rain-inline-readout");
fs.mkdirSync(output, { recursive: true });
const rows = JSON.parse(fs.readFileSync("data/gaia-signals.json", "utf8"))
  .modes.find(mode => mode.id === "forest-cloud-engine").signals.precipitation;
const report = { status: "running", checks: [], errors: [] };
const browser = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
try {
  for (const viewport of [
    { width: 1440, height: 900 }, { width: 3840, height: 2160 },
    { width: 390, height: 844 }, { width: 320, height: 740 },
    { width: 280, height: 653 }, { width: 568, height: 320 },
    { width: 390, height: 844, reduced: true },
  ]) {
    const label = `${viewport.width}${viewport.reduced ? "-reduced" : ""}`;
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      reducedMotion: viewport.reduced ? "reduce" : "no-preference",
      deviceScaleFactor: viewport.width < 600 ? 2 : 1,
    });
    await context.addInitScript(() => {
      sessionStorage.setItem("gaia:mode-entry-guide:map:v3", "seen");
      localStorage.setItem("gaia-senseware-bgm-muted", "true");
      const recent = [];
      const fill = CanvasRenderingContext2D.prototype.fillText;
      CanvasRenderingContext2D.prototype.fillText = function (text, x, y, maxWidth) {
        if (this.canvas.id === "japan-overlay") {
          const bounds = this.canvas.getBoundingClientRect();
          const transform = this.getTransform();
          const metrics = this.measureText(text);
          const sx = bounds.width / this.canvas.width;
          const sy = bounds.height / this.canvas.height;
          recent.push({ text, x: (transform.a * x + transform.e) * sx,
            y: (transform.d * y + transform.f) * sy,
            right: (transform.a * (x + metrics.width) + transform.e) * sx,
            top: (transform.d * (y - metrics.actualBoundingBoxAscent) + transform.f) * sy,
            bottom: (transform.d * (y + metrics.actualBoundingBoxDescent) + transform.f) * sy,
            font: this.font, color: this.fillStyle, shadow: this.shadowBlur,
            alpha: this.globalAlpha, maxWidth: maxWidth ?? null });
          if (recent.length > 4) recent.shift();
          if (text === "NASA POWER") window.__rainReadout = { time: performance.now(), text: [...recent] };
        }
        return maxWidth === undefined ? fill.call(this, text, x, y) : fill.call(this, text, x, y, maxWidth);
      };
    });
    await context.route("https://services.swpc.noaa.gov/**", route => route.fulfill({ path: "data/ovation-aurora-snapshot.json", contentType: "application/json" }));
    const page = await context.newPage();
    page.on("pageerror", error => report.errors.push(`${label}: ${error.message}`));
    await page.goto(`${base}/?preview=rain-inline-readout#world`, { waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => document.documentElement.dataset.gaiaAppReady === "true"
      && document.querySelectorAll(".map-mode-bank .map-mode-button").length === 30);
    await page.evaluate(async () => {
      await GaiaMapObservationAdapter.waitSignalsReady();
      GaiaModeEntryGuide?.close?.("map", { restoreFocus: false });
      [...document.querySelectorAll(".map-mode-bank .map-mode-button")].find(button => button.textContent.trim() === "03").click();
    });
    await page.waitForFunction(() => document.querySelector("#japan-overlay").dataset.forestRevealState === "complete");
    await page.evaluate(() => document.fonts.ready);
    for (const [index, row] of rows.entries()) {
      const started = await page.evaluate(({ index, row, count }) => {
        GaiaMapObservationAdapter.focusEarthLocation({ lon: row.lon, lat: row.lat, zoom: 2,
          targetX: index % 3 === 0 ? .2 : index % 3 === 1 ? .8 : .5,
          targetY: index % 2 ? .2 : .55, durationMs: 120, label: "rain-readout-test" });
        const input = document.querySelector("#japan-layer [data-signal-time]");
        input.value = String(((index + .5) / count) * 100);
        input.dispatchEvent(new Event("input", { bubbles: true }));
        return performance.now();
      }, { index, row, count: rows.length });
      await page.waitForFunction(({ value, started }) => window.__rainReadout?.time > started
        && window.__rainReadout.text[1].text === value
        && document.querySelector("#japan-overlay").dataset.viewAnimation === "idle",
      { value: row.precipitationMmDay.toFixed(2), started });
      const scan = await page.evaluate(() => {
        const overlay = document.querySelector("#japan-overlay");
        const data = overlay.dataset;
        const map = overlay.getBoundingClientRect();
        const left = Number(data.selectionLabelLeftPx) + map.left;
        const top = Number(data.selectionLabelTopPx) + map.top;
        const right = left + Number(data.selectionLabelWidthPx);
        const bottom = top + Number(data.selectionLabelHeightPx);
        const overlaps = [...document.querySelectorAll(
          "#japan-layer button, .japan-heading, .signal-console-map, .map-command-dock, .map-mode-bank, #map-reading-guide, .signal-encoding-legend-dock, #gaia-map-zoom-controls, #co2-timeline-display, #gaia-audio-toggle",
        )].filter(element => {
          const bounds = element.getBoundingClientRect();
          const style = getComputedStyle(element);
          return bounds.width > 2 && bounds.height > 2 && style.visibility !== "hidden" && Number(style.opacity) > 0
            && left < bounds.right && right > bounds.left && top < bounds.bottom && bottom > bounds.top;
        }).map(element => element.id || element.className);
        return { ...window.__rainReadout, shape: data.selectionLabelShape,
          name: data.selectionLabelFullName, displayName: data.selectionLabelDisplayName,
          left: Number(data.selectionLabelLeftPx), top: Number(data.selectionLabelTopPx),
          width: Number(data.selectionLabelWidthPx), height: Number(data.selectionLabelHeightPx),
          placement: data.selectionLabelPlacement, rain: data.forestRainBrazil, overlaps };
      });
      assert.equal(scan.shape, "inline-readout");
      assert.equal(scan.text.length, 4);
      assert.deepEqual(scan.text.map(item => item.text), [scan.displayName, row.precipitationMmDay.toFixed(2), "mm/日", "NASA POWER"]);
      assert.equal(scan.rain, "5.33 mm/日");
      assert.equal(scan.height, viewport.height < 420 && viewport.width < 900 ? 36 : viewport.width < 600 ? 42 : viewport.width >= 2400 ? 68 : 48);
      assert(scan.left >= 11.9 && scan.left + scan.width <= viewport.width - 11.9, `${label}/${row.id}: card exceeds viewport`);
      assert(scan.top >= 11.9 && scan.top + scan.height <= viewport.height - 11.9);
      for (const [i, item] of scan.text.entries()) {
        assert(Math.abs(item.y - scan.text[0].y) < .1, "All four parts must share one baseline");
        assert(item.x >= scan.left + 2 && item.right <= scan.left + scan.width - 2, "Text exceeds card");
        assert(item.top >= scan.top && item.bottom <= scan.top + scan.height, "Glyphs clipped vertically");
        if (i) assert(item.x > scan.text[i - 1].right + 1, "Text overlaps adjacent part");
        assert.equal(item.maxWidth, null, "Do not compress glyphs");
        assert.equal(item.shadow, 0, "Readout must not have neon text glow");
        assert(item.alpha > .95);
      }
      if (viewport.width >= 600) assert.equal(scan.displayName, scan.name, "Desktop site names must be complete");
      report.checks.push({ viewport: label, id: row.id, ...scan });
      assert.deepEqual(scan.overlaps, [], `${label}/${row.id}: readout is hidden by controls`);
      if (["cuba", "brazil", "japan"].includes(row.id)) {
        await page.screenshot({ path: path.join(output, `${label}-${row.id}.jpg`), type: "jpeg", quality: 90 });
        await page.screenshot({ path: path.join(output, `${label}-${row.id}-detail.png`),
          clip: { x: Math.max(0, scan.left - 10), y: Math.max(0, scan.top - 10),
            width: Math.min(viewport.width - Math.max(0, scan.left - 10), scan.width + 20), height: scan.height + 20 } });
      }
    }
    // Returning to another exhibit must clear the rain-only layout diagnostics.
    await page.evaluate(() => GaiaMapObservationAdapter.selectMode(4));
    await page.waitForFunction(() => document.querySelector("#japan-mode-number").textContent.trim() === "05"
      && !document.querySelector("#japan-overlay").dataset.selectionLabelFullName);
    assert.notEqual(await page.locator("#japan-overlay").getAttribute("data-selection-label-shape"), "inline-readout");
    console.log(`PASS ${label}: all 31 sites, horizontal glyph bounds, no glow, complete value/unit/source, mode cleanup`);
    await context.close();
  }
  assert.deepEqual(report.errors, []);
  report.status = "passed";
} finally {
  fs.writeFileSync(path.join(output, "report.json"), JSON.stringify(report, null, 2));
  await browser.close();
}
