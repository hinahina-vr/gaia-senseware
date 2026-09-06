import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { chromium } from "playwright-core";

const base = process.argv[2] || "http://127.0.0.1:4397";
const output = path.resolve(process.argv[3] || "artifacts/map-exhibit-profiles");
const widths = (process.argv[4] || "1440,390,320").split(",").map(Number);
const context = { document: { querySelector: () => null } };
vm.runInNewContext(fs.readFileSync("map-exhibit-categories.js", "utf8"), context);
const expected = Array.from({ length: 30 }, (_, index) => {
  const number = index + 1;
  const scope = number <= 14 ? "world" : "japan";
  const time = [1, 2, 3, 4, 5, 15, 16, 17, 18, 19, 20].includes(number) ? "realtime"
    : number === 7 ? "simulation" : [8, 9, 12, 13].includes(number) ? "comparison" : "series";
  return { number, scope, time };
});
for (const item of expected) {
  const profile = context.GaiaMapCategories.getProfile(item.number);
  assert.equal(profile.scope, item.scope); assert.equal(profile.time, item.time);
  assert(Object.isFrozen(profile));
}
assert.equal(context.GaiaMapCategories.getProfile(0), null);
assert.equal(context.GaiaMapCategories.getProfile(31), null);
fs.mkdirSync(output, { recursive: true });
const report = { status: "running", checks: [], errors: [] };
const browser = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
let page;
try {
  for (const width of widths) {
    const mobile = width <= 900;
    const ctx = await browser.newContext({ viewport: { width, height: width >= 2400 ? 2088 : mobile ? 844 : 900 }, reducedMotion: "reduce", hasTouch: mobile });
    await ctx.addInitScript(() => {
      sessionStorage.setItem("gaia:mode-entry-guide:map:v4", "seen"); localStorage.setItem("gaia-senseware-bgm-muted", "true");
    });
    await ctx.route("https://services.swpc.noaa.gov/**", route => route.fulfill({ path: "data/ovation-aurora-snapshot.json", contentType: "application/json" }));
    page = await ctx.newPage(); page.on("pageerror", error => report.errors.push(`${width}: ${error.message}`));
    await page.goto(`${base}/?mode=15&preview=map-exhibit-profiles#world`, { waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => globalThis.GaiaMapCategories?.buttons().length === 30 && globalThis.GaiaMapDemo);
    await page.evaluate(async () => {
      await GaiaMapObservationAdapter.waitSignalsReady(); GaiaMapDemo.stop(); GaiaModeEntryGuide.close("map", { restoreFocus: false });
      GaiaMapCategories.buttons()[14].click(); GaiaLiveExhibits.pausePoiAutoplay();
    });
    await page.waitForFunction(() => document.querySelectorAll('.map-mode-button[data-map-scope]').length === 30
      && !document.querySelector("#japan-layer").classList.contains("is-map-title-transitioning"));
    const source = await page.evaluate(() => GaiaMapCategories.buttons().map(button => ({
      number: Number(button.textContent), scope: button.dataset.mapScope, time: button.dataset.mapTime,
      description: document.getElementById(`map-profile-${button.dataset.mapScope}-${button.dataset.mapTime}`)?.textContent,
      describedBy: button.getAttribute("aria-describedby"), children: button.children.length,
    })));
    assert.deepEqual(source.map(({ number, scope, time }) => ({ number, scope, time })), expected);
    for (const button of source) {
      assert.equal(button.children, 0, "Button text remains its public number");
      assert(button.describedBy.includes(`map-profile-${button.scope}-${button.time}`));
      assert(button.description.includes(button.scope === "world" ? "世界展示" : "日本展示"));
    }
    const open = async () => {
      if (mobile) await page.locator('[data-mobile-sheet="exhibits"]').click();
      else {
        const extension = page.locator('[data-map-bank-toggle]:visible').first();
        await (await extension.count() ? extension : page.locator(".map-dock-bank-trigger")).click();
      }
    };
    await open();
    const menu = page.locator(mobile ? "#map-mobile-sheet" : ".map-dock-bank-popover");
    await menu.waitFor({ state: "visible" });
    const entries = await page.locator(mobile ? "#map-mobile-sheet [data-mobile-exhibit]" : ".map-category-group .map-mode-button").evaluateAll((buttons, mobile) => buttons.map(button => {
      const profile = GaiaMapCategories.getProfile(mobile ? button.dataset.mobileExhibit : button.textContent);
      const style = getComputedStyle(button, "::before"), rect = button.getBoundingClientRect();
      const labels = button.querySelector(".map-exhibit-profile");
      const text = mobile ? labels.textContent : style.content;
      const measure = document.createElement("canvas").getContext("2d");
      measure.font = `${style.fontSize} ${style.fontFamily}`;
      return { number: Number(mobile ? button.dataset.mobileExhibit : button.textContent), scope: button.dataset.mapScope, time: button.dataset.mapTime,
        visibleLabels: text.includes(profile.scopeLabel) && text.includes(profile.timeLabel), height: rect.height,
        clipped: mobile ? labels.scrollWidth > labels.clientWidth + 1 : Math.max(measure.measureText(profile.scopeLabel).width, measure.measureText(profile.timeLabel).width) > rect.width - 8,
      };
    }), mobile);
    assert.equal(entries.length, 30);
    for (const entry of entries) { assert(entry.visibleLabels && !entry.clipped && entry.height >= 44, JSON.stringify(entry)); }
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth), 0);
    assert((await menu.locator(".map-picker-profile-guide").textContent()).includes("保存値"));
    await page.mouse.move(width - 1, 1);
    await menu.screenshot({ path: path.join(output, `${width}-menu.png`) });
    for (const number of [24, 2, 17, 9, 7, 21]) {
      const button = mobile ? page.locator(`[data-mobile-exhibit="${number}"]`)
        : page.locator(".map-category-group .map-mode-button").filter({ hasText: new RegExp(`^${String(number).padStart(2, "0")}$`) });
      await button.click();
      await page.waitForFunction(number => Number(document.querySelector("#japan-mode-number").textContent) === number
        && !document.querySelector("#japan-layer").classList.contains("is-map-title-transitioning"), number);
      await open(); await menu.waitFor({ state: "visible" });
    }
    if (mobile) await page.keyboard.press("Escape");
    else await page.locator('[data-map-bank-toggle]:visible').first().click();
    report.checks.push({ width, entries });
    console.log(`PASS ${width}: all 30 profiles visible, accurate, accessible; number routing and provider switching intact`);
    await ctx.close();
  }
  assert.deepEqual(report.errors, []); report.status = "passed";
} catch (error) {
  report.status = "failed"; report.failure = error.stack;
  if (page && !page.isClosed()) await page.screenshot({ path: path.join(output, "failure.jpg") }).catch(() => {});
  throw error;
} finally {
  fs.writeFileSync(path.join(output, "report.json"), JSON.stringify(report, null, 2)); await browser.close();
}
