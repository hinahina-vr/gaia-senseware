import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright-core";

const base = process.argv[2] || "http://127.0.0.1:4397";
const output = path.resolve(process.argv[3] || "artifacts/realtime-exhibits");
fs.mkdirSync(output, { recursive: true });
const profiles = process.env.REALTIME_SIZES ? process.env.REALTIME_SIZES.split(",").map(size => size.split("x").map(Number))
  : [[1440, 900], [1920, 1080], [3840, 2088], [1024, 768], [390, 844], [320, 568], [844, 390]];
const report = { profiles: [], errors: [] };
const now = Date.parse("2026-09-07T03:00:00Z");
const freshFirms = JSON.parse(fs.readFileSync("data/firms-active-fire-snapshot.json", "utf8"));
freshFirms.source = "nasa-firms-modis";
freshFirms.generatedAt = new Date(now).toISOString();
freshFirms.summary.end = new Date(now - 2 * 3600_000).toISOString();
freshFirms.summary.start = new Date(now - 24 * 3600_000).toISOString();
const browser = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
try {
  for (const [width, height] of profiles) {
    const context = await browser.newContext({ viewport: { width, height }, hasTouch: width <= 900, reducedMotion: "reduce" });
    let apiMode = "live";
    await context.addInitScript(() => {
      sessionStorage.setItem("gaia:mode-entry-guide:map:v4", "seen");
      localStorage.setItem("gaia-senseware-bgm-muted", "true");
    });
    await context.route("**/api/live/v1/firms", route => apiMode === "offline" ? route.abort() : route.fulfill({ json: freshFirms }));
    await context.route("https://services.swpc.noaa.gov/**", route => route.fulfill({ contentType: "application/json", body: fs.readFileSync("data/ovation-aurora-snapshot.json", "utf8") }));
    await context.route("https://earthquake.usgs.gov/**", route => route.fulfill({ json: {
      metadata: { generated: now }, features: [{ id: "qa-quake", geometry: { coordinates: [138, 36, 10] }, properties: { time: now - 3600_000, mag: 4.5, place: "検証用の公開地震観測" } }],
    } }));
    for (const host of ["api.open-meteo.com", "air-quality-api.open-meteo.com"]) await context.route(`https://${host}/**`, route => {
      if (apiMode === "offline") return route.abort();
      const count = new URL(route.request().url()).searchParams.get("latitude")?.split(",").length || 1;
      return route.fulfill({ json: Array.from({ length: count }, (_, i) => ({ current: { time: apiMode === "delayed" ? "2026-09-01T02:00" : "2026-09-07T02:00", wind_speed_10m: 4 + i / 20, wind_direction_10m: 100,
        surface_pressure: 1008, cloud_cover: 62, shortwave_radiation: 182, pm2_5: 10, aerosol_optical_depth: .2 } })) });
    });
    const page = await context.newPage();
    page.on("pageerror", error => report.errors.push({ width, message: error.message }));
    await page.clock.install({ time: new Date(now) });
    await page.goto(`${base}/?preview=realtime-exhibits&live=1#world`, { waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => globalThis.GaiaMapDemo && globalThis.GaiaMapCategories?.buttons().length === 30 && document.documentElement.dataset.gaiaAppReady === "true");
    await page.evaluate(() => GaiaMapDemo.stop());
    const profile = { width, height, exhibits: [] };
    report.profiles.push(profile);
    for (let number = 1; number <= 5; number++) {
      await page.evaluate(number => GaiaMapCategories.buttons().find(item => Number(item.textContent) === number).click(), number);
      const readout = page.locator(number === 1 ? ".gaia-firms-readout" : ".gaia-planet-signals-readout");
      await readout.locator('[data-realtime-state="live"]').waitFor();
      await page.waitForTimeout(450);
      const layout = await readout.evaluate(node => {
        const r = node.getBoundingClientRect();
        const status = node.querySelector(".gaia-realtime-status"), s = status.getBoundingClientRect();
        const title = status.querySelector("h3"), t = title.getBoundingClientRect();
        const titleRange = document.createRange(); titleRange.selectNodeContents(title);
        const text = titleRange.getBoundingClientRect();
        const visible = element => { const style = getComputedStyle(element), b = element.getBoundingClientRect(); return style.display !== "none" && style.visibility !== "hidden" && b.width > 0 && b.height > 0; };
        const fields = [...status.children].filter(visible).map(element => ({ text: element.textContent, rect: element.getBoundingClientRect().toJSON() }));
        const actions = [...node.querySelectorAll(".gaia-map-action")].filter(visible).map(button => {
          const b = button.getBoundingClientRect(), hit = document.elementFromPoint(b.x + b.width / 2, b.y + b.height / 2);
          return button === hit || button.contains(hit);
        });
        return { dock: r.toJSON(), status: s.toJSON(), titleSize: parseFloat(getComputedStyle(title).fontSize), fields,
          titleFits: text.left >= s.left && text.right <= s.right + 1 && text.bottom <= s.bottom + 1,
          fits: node.scrollWidth <= node.clientWidth + 2 && node.scrollHeight <= node.clientHeight + 2,
          inViewport: r.left >= 0 && r.right <= innerWidth && r.top >= 0 && r.bottom <= innerHeight,
          fieldsFit: fields.every(({ rect: b }) => b.left >= r.left && b.right <= r.right + 1 && b.top >= r.top && b.bottom <= r.bottom + 1),
          readable: status.textContent, actionsReachable: actions.every(Boolean), state: status.dataset.realtimeState,
        };
      });
      profile.exhibits.push({ number, ...layout });
      await page.screenshot({ path: path.join(output, `${width}x${height}-${number}.png`) });
      await readout.screenshot({ path: path.join(output, `${width}x${height}-${number}-dock.png`) });
      assert(layout.fits && layout.inViewport && layout.fieldsFit && layout.titleFits && layout.actionsReachable, JSON.stringify({ number, ...layout }));
      assert(layout.titleSize >= (height < 500 ? 20 : width <= 900 ? 24 : 26));
      assert.match(layout.readable, /リアルタイム展示/u);
      assert.match(layout.readable, /2026\/09\/07/u);
      assert.match(layout.readable, /JST/u);
      if (number === 5) assert.match(layout.readable, /気象モデル/u);
      if (width > 900) {
        const legend = page.locator(number === 1 ? ".gaia-firms-legend" : ".gaia-planet-signals-legend");
        assert.equal(await legend.locator("details").evaluate(node => node.open), false);
        await legend.locator("summary").click();
        assert.equal(await legend.locator("details").evaluate(node => node.open), true);
        assert(await legend.locator(number === 1 ? "[data-firms-latest]" : "[data-metric-current]").isVisible());
        await legend.locator("summary").click();
      }
    }
    await page.evaluate(() => GaiaMapCategories.buttons().find(item => Number(item.textContent) === 6).click());
    await page.waitForTimeout(300);
    assert.equal(await page.locator(".gaia-realtime-status:visible").count(), 0, "Historical exhibits must not be labelled realtime");
    if ([1440, 390, 320].includes(width)) {
      apiMode = "offline";
      const fallback = await context.newPage();
      fallback.on("pageerror", error => report.errors.push({ width, message: error.message }));
      await fallback.clock.install({ time: new Date(now) });
      await fallback.goto(`${base}/?preview=realtime-fallback&live=1#world`, { waitUntil: "domcontentloaded" });
      await fallback.waitForFunction(() => globalThis.GaiaMapDemo && document.documentElement.dataset.gaiaAppReady === "true");
      await fallback.evaluate(() => GaiaMapDemo.stop());
      const assertFallback = async (kind, selector) => {
        const panel = fallback.locator(selector);
        await panel.locator(`[data-realtime-state="${kind}"]`).waitFor();
        const state = await panel.evaluate(node => {
          const status = node.querySelector(".gaia-realtime-status"), r = node.getBoundingClientRect();
          return { fits: node.scrollHeight <= node.clientHeight + 2 && node.scrollWidth <= node.clientWidth + 2,
            text: status.textContent, visible: status.getBoundingClientRect().top >= r.top && status.getBoundingClientRect().bottom <= r.bottom + 1 };
        });
        assert(state.fits && state.visible, JSON.stringify(state));
        assert.doesNotMatch(state.text, /LIVE ·/u);
        await fallback.screenshot({ path: path.join(output, `${width}x${height}-${kind}.png`) });
        return state.text;
      };
      assert.match(await assertFallback("saved", ".gaia-firms-readout"), /保存観測.*ライブ未接続/u);
      await fallback.evaluate(() => { void GaiaPlanetSignals.select(0); });
      assert.match(await assertFallback("sample", ".gaia-planet-signals-readout"), /現在値ではありません/u);
      apiMode = "delayed";
      await fallback.evaluate(() => { void GaiaPlanetSignals.select(1); });
      assert.match(await assertFallback("delayed", ".gaia-planet-signals-readout"), /時刻に遅れ/u);
      profile.fallbackStates = ["saved", "sample", "delayed"];
    }
    await context.close();
    console.log(`${width}x${height}: MAP 01–05 identity, timestamp, compact legends and MAP 06 exclusion passed`);
  }
  assert.deepEqual(report.errors, []);
  report.status = "passed";
} catch (error) {
  report.status = "failed";
  report.failure = error.stack;
  throw error;
} finally {
  fs.writeFileSync(path.join(output, "report.json"), JSON.stringify(report, null, 2));
  await browser.close();
}
