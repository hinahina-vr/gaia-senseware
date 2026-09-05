import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright-core";

const [baseUrl = "http://127.0.0.1:4397", outputArgument = "artifacts/map-preview-copy"] = process.argv.slice(2);
const output = path.resolve(outputArgument);
fs.mkdirSync(output, { recursive: true });
const report = { status: "running", previews: [], titles: [], errors: [] };
const browser = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
try {
  for (const viewport of [{ width: 1440, height: 900 }, { width: 3840, height: 2088 }, { width: 390, height: 844 }]) {
    const mobile = viewport.width < 720;
    const context = await browser.newContext({ viewport, isMobile: mobile, hasTouch: mobile, reducedMotion: mobile ? "reduce" : "no-preference" });
    await context.addInitScript(() => {
      sessionStorage.setItem("gaia:mode-entry-guide:map:v3", "seen");
      localStorage.setItem("gaia-senseware-bgm-muted", "true");
    });
    await context.route("https://services.swpc.noaa.gov/**", (route) => route.fulfill({ contentType: "application/json", body: fs.readFileSync("data/ovation-aurora-snapshot.json", "utf8") }));
    for (const host of ["api.open-meteo.com", "air-quality-api.open-meteo.com"]) {
      await context.route(`https://${host}/**`, (route) => {
        const count = new URL(route.request().url()).searchParams.get("latitude")?.split(",").length || 1;
        const rows = Array.from({ length: count }, () => ({ current: {
          time: "2026-09-05T00:00", wind_speed_10m: 5, wind_direction_10m: 80,
          surface_pressure: 1005, cloud_cover: 58, shortwave_radiation: 194,
          pm2_5: 9.9, aerosol_optical_depth: .18,
        } }));
        return route.fulfill({ contentType: "application/json", body: JSON.stringify(rows) });
      });
    }
    await context.route("https://earthquake.usgs.gov/**", (route) => route.fulfill({ contentType: "application/json", body: JSON.stringify({
      type: "FeatureCollection", metadata: { generated: Date.now() }, features: [{ type: "Feature", id: "copy-test", geometry: { type: "Point", coordinates: [140, 36, 10] }, properties: { mag: 3, time: Date.now(), place: "TEST" } }],
    }) }));
    const page = await context.newPage();
    page.on("pageerror", (error) => report.errors.push(error.message));
    await page.goto(`${baseUrl}/?preview=map-copy#world`, { waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => document.documentElement.dataset.gaiaAppReady === "true" && document.querySelectorAll(".map-mode-bank .map-mode-button").length === 30);
    await page.evaluate(() => globalThis.GaiaModeEntryGuide?.close?.("map", { restoreFocus: false }));
    const catalog = await page.evaluate(() => {
      const content = window.GaiaAppContent;
      const base = content.modes.map((mode, index) => ({ id: mode.id, number: String(index + 1).padStart(2, "0"), title: mode.titleJa }));
      const extra = [...GaiaLiveExhibits.definitions, ...GaiaEstatExhibits.definitions, GaiaFirmsExhibit.definition, ...GaiaPlanetSignals.definitions]
        .map((exhibit) => ({ id: exhibit.id, number: exhibit.number, title: exhibit.shortTitle }));
      return { entries: [...base, ...extra].map((entry) => ({ ...entry, copy: content.MAP_MODE_DESCRIPTIONS[entry.id] })), copyIds: Object.keys(content.MAP_MODE_DESCRIPTIONS) };
    });
    assert.equal(catalog.entries.length, 30);
    assert.deepEqual(catalog.copyIds.sort(), catalog.entries.map(({ id }) => id).sort(), "Copy keys must match the live exhibit catalog exactly");
    assert.equal(catalog.entries[0].title, "地球の一呼吸");
    assert.equal(catalog.entries[8].title, "人口のうねり");

    const toggle = page.locator(mobile ? "#map-mobile-bank-toggle" : ".map-dock-bank-trigger");
    await toggle.click();
    await page.waitForFunction(() => document.querySelector(".map-mode-bank .map-mode-button").checkVisibility({ checkOpacity: true, checkVisibilityCSS: true }));
    for (const entry of catalog.entries) {
      const button = page.locator(".map-mode-bank .map-mode-button").filter({ hasText: new RegExp(`^${entry.number}$`) });
      if (mobile) {
        await page.keyboard.press("Tab");
        await button.focus();
      } else {
        await button.hover();
      }
      await page.waitForFunction((number) => document.querySelector("#map-mode-preview").classList.contains("is-open") && document.querySelector("#map-mode-preview-number").textContent.startsWith(`${number} /`), entry.number);
      await page.waitForTimeout(120);
      const scan = await page.locator("#map-mode-preview").evaluate((node) => ({
        title: node.querySelector("b").textContent,
        copy: node.querySelector("p").textContent,
        rect: node.getBoundingClientRect().toJSON(),
        overflow: node.scrollWidth - node.clientWidth,
        copyOverflow: node.querySelector("p").scrollHeight - node.querySelector("p").clientHeight,
        ariaHidden: node.getAttribute("aria-hidden"),
      }));
      report.previews.push({ width: viewport.width, number: entry.number, ...scan });
      assert.equal(scan.title, entry.title, `${entry.number}: preview title`);
      assert.equal(scan.copy, entry.copy, `${entry.number}: map-only description`);
      assert.equal(scan.ariaHidden, "false");
      assert.ok(scan.rect.left >= -1 && scan.rect.right <= viewport.width + 1, `${entry.number}: horizontal overflow`);
      assert.ok(scan.rect.top >= -1 && scan.rect.bottom <= viewport.height + 1, `${entry.number}: vertical overflow`);
      assert.ok(scan.overflow <= 1 && scan.copyOverflow <= 1, `${entry.number}: copy must not be clipped`);
      if (["01", "20", "30"].includes(entry.number)) {
        await page.screenshot({ path: path.join(output, `${viewport.width}-preview-${entry.number}.png`) });
      }
    }

    // Previewing another map must not change the active title. Once selected,
    // the tooltip, upper heading, bank heading, and dock must all agree.
    assert.equal(await page.locator("#japan-title").textContent(), "地球の一呼吸");
    for (const entry of catalog.entries) {
      await page.evaluate((number) => [...document.querySelectorAll(".map-mode-bank .map-mode-button")].find((button) => button.textContent.trim() === number).click(), entry.number);
      await page.waitForFunction((number) => document.querySelector("#japan-mode-number").textContent === number, entry.number);
      const scan = await page.evaluate(() => ({
        top: document.querySelector("#japan-title").textContent,
        dock: document.querySelector("[data-map-dock-title]").textContent,
        bank: document.querySelector("#japan-mode-title").textContent,
      }));
      report.titles.push({ width: viewport.width, number: entry.number, ...scan });
      for (const title of Object.values(scan)) assert.equal(title, entry.title, `${entry.number}: selected title must match its preview`);
    }
    await context.close();
    console.log(`${viewport.width}px: 30 previews and 30 selected titles passed`);
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
