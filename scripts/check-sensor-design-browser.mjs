import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const [moduleRoot, executablePath, outputArgument, baseUrl = "http://127.0.0.1:4397"] = process.argv.slice(2);
if (!moduleRoot || !executablePath) throw new Error("Playwright module and browser executable are required");
const playwrightEntry = fs.existsSync(path.join(moduleRoot, "index.mjs"))
  ? path.join(moduleRoot, "index.mjs")
  : path.join(moduleRoot, "playwright", "index.mjs");
const { chromium } = await import(pathToFileURL(playwrightEntry).href);
const outputDir = path.resolve(outputArgument || "artifacts/sensor-design");
fs.mkdirSync(outputDir, { recursive: true });

const viewports = [
  { name: "pc-1440", width: 1440, height: 900 },
  { name: "mobile-390", width: 390, height: 844 },
];
const report = { status: "running", viewports, scans: [], consoleErrors: [], expectedAuth401: [], pageErrors: [], responses404: [] };
const browser = await chromium.launch({ headless: true, executablePath });

try {
  for (const viewport of viewports) {
    await fetch(new URL("/__qa/reset", baseUrl), { method: "POST" });
    const context = await browser.newContext({ viewport, reducedMotion: "no-preference" });
    const page = await context.newPage();
    const label = viewport.name;
    page.on("console", (message) => {
      if (message.type() !== "error") return;
      const text = message.text();
      if (text === "Failed to load resource: the server responded with a status of 401 (Unauthorized)") report.expectedAuth401.push(`${label}: session probe`);
      else report.consoleErrors.push(`${label}: ${text}`);
    });
    page.on("pageerror", (error) => report.pageErrors.push(`${label}: ${error.message}`));
    page.on("response", (response) => { if (response.status() === 404) report.responses404.push(`${label}: ${response.url()}`); });

    await page.goto(new URL("/sensors/", baseUrl).href, { waitUntil: "domcontentloaded" });
    await page.locator("[data-view='login']").waitFor({ state: "visible" });
    await page.waitForTimeout(750);
    const login = await page.evaluate(() => {
      const body = getComputedStyle(document.body);
      const heading = document.querySelector(".sensor-login h1");
      const headingStyle = getComputedStyle(heading);
      const brandStyle = getComputedStyle(document.querySelector(".sensor-brand span"));
      const navStyle = getComputedStyle(document.querySelector(".sensor-topbar nav a"));
      const buttonStyle = getComputedStyle(document.querySelector("#google-login"));
      const topbar = document.querySelector(".sensor-topbar").getBoundingClientRect();
      const audio = document.querySelector("#sensor-audio-toggle").getBoundingClientRect();
      const nav = [...document.querySelectorAll(".sensor-topbar nav a")].map((element) => {
        const rect = element.getBoundingClientRect();
        return { text: element.textContent.trim(), left: rect.left, right: rect.right, height: rect.height };
      });
      const button = document.querySelector("#google-login").getBoundingClientRect();
      const view = document.querySelector("[data-view='login']");
      return {
        bodyFont: body.fontFamily,
        headingFont: headingStyle.fontFamily,
        brandFont: brandStyle.fontFamily,
        navFont: navStyle.fontFamily,
        buttonFont: buttonStyle.fontFamily,
        headingHeight: heading.getBoundingClientRect().height,
        animationName: getComputedStyle(view).animationName,
        topbar: { height: topbar.height },
        audio: { left: audio.left, right: audio.right, height: audio.height },
        nav,
        buttonHeight: button.height,
        overflowX: document.documentElement.scrollWidth > innerWidth + 1,
      };
    });
    assert.match(login.bodyFont, /Arial Narrow/u);
    assert.match(login.headingFont, /Yu Mincho/u);
    assert.match(login.brandFont, /Georgia/u);
    assert.match(login.navFont, /Yu Mincho/u);
    assert.match(login.buttonFont, /Yu Mincho/u);
    assert.equal(login.animationName, "sensor-enter");
    assert(login.buttonHeight >= 44);
    assert(login.audio.height >= 44);
    assert(login.nav.every((item) => item.height >= 44));
    assert(login.nav.every((item) => item.left >= -1 && item.right <= viewport.width + 1));
    assert(login.audio.left >= -1 && login.audio.right <= viewport.width + 1);
    assert.equal(login.overflowX, false);
    if (viewport.width === 390) assert(login.headingHeight < 120);
    await page.screenshot({ path: path.join(outputDir, `${label}-login.png`), fullPage: true });

    await page.goto(new URL("/sensors/#map", baseUrl).href, { waitUntil: "domcontentloaded" });
    await page.locator("[data-view='map']").waitFor({ state: "visible" });
    await page.locator(".sensor-map-marker").waitFor({ state: "visible" });
    await page.waitForTimeout(750);
    const publicMap = await page.evaluate(() => ({
      headingFont: getComputedStyle(document.querySelector(".sensor-page-head h1")).fontFamily,
      markerSize: Math.min(...[...document.querySelectorAll(".sensor-map-marker")].map((marker) => marker.getBoundingClientRect().width)),
      socialLinkTargets: [...document.querySelectorAll(".sensor-map-socials a")].map((link) => link.getBoundingClientRect().height),
      overflowX: document.documentElement.scrollWidth > innerWidth + 1,
    }));
    assert.match(publicMap.headingFont, /Yu Mincho/u);
    assert(publicMap.markerSize >= 44);
    assert(publicMap.socialLinkTargets.every((height) => height >= 44));
    assert.equal(publicMap.overflowX, false);
    await page.screenshot({ path: path.join(outputDir, `${label}-map.png`), fullPage: true });

    await page.goto(new URL("/sensors/?authenticated=1#guide", baseUrl).href, { waitUntil: "domcontentloaded" });
    await page.locator("[data-view='guide']").waitFor({ state: "visible" });
    await page.waitForTimeout(750);
    const guide = await page.evaluate(() => ({
      headingFont: getComputedStyle(document.querySelector(".sensor-guide h1")).fontFamily,
      linkTargets: [...document.querySelectorAll(".sensor-guide-links a")].map((link) => link.getBoundingClientRect().height),
      overflowX: document.documentElement.scrollWidth > innerWidth + 1,
    }));
    assert.match(guide.headingFont, /Yu Mincho/u);
    assert(guide.linkTargets.every((height) => height >= 44));
    assert.equal(guide.overflowX, false);
    await page.screenshot({ path: path.join(outputDir, `${label}-guide.png`), fullPage: true });
    report.scans.push({ viewport: label, login, publicMap, guide, passed: true });
    await context.close();
  }
  assert.equal(report.expectedAuth401.length, viewports.length);
  assert.deepEqual(report.consoleErrors, []);
  assert.deepEqual(report.pageErrors, []);
  assert.deepEqual(report.responses404, []);
  report.status = "passed";
} catch (error) {
  report.status = "failed";
  report.error = error.stack || String(error);
  throw error;
} finally {
  fs.writeFileSync(path.join(outputDir, "report.json"), `${JSON.stringify(report, null, 2)}\n`);
  await browser.close();
}

console.log("sensor design browser check passed");
