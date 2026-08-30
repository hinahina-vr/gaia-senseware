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
const outputDir = path.resolve(outputArgument || "artifacts/sensor-profile-map");
fs.mkdirSync(outputDir, { recursive: true });

const viewports = [
  { name: "pc-1440", width: 1440, height: 900 },
  { name: "mobile-390", width: 390, height: 844 },
];
const report = { status: "running", viewports, scans: [], consoleErrors: [], expectedAuth401: [], pageErrors: [], responses404: [] };
const browser = await chromium.launch({ headless: true, executablePath });
const png = fs.readFileSync(path.resolve("gaia-mode-01.png"));

try {
  for (const viewport of viewports) {
    await fetch(new URL("/__qa/reset", baseUrl), { method: "POST" });
    const context = await browser.newContext({ viewport, reducedMotion: "reduce" });
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

    await page.goto(new URL("/sensors/#map", baseUrl).href, { waitUntil: "domcontentloaded" });
    await page.locator("[data-view='map']").waitFor({ state: "visible" });
    await page.locator(".sensor-map-marker").waitFor({ state: "visible" });
    await page.waitForFunction(() => document.querySelector("#public-sensor-map")?.dataset.basemap === "ready");
    await page.waitForFunction(() => {
      const image = document.querySelector("#public-sensor-detail img");
      return Boolean(image?.complete && image.naturalWidth > 0);
    });
    const publicMap = await page.evaluate(() => {
      const marker = document.querySelector(".sensor-map-marker");
      const detail = document.querySelector("#public-sensor-detail");
      const links = [...detail.querySelectorAll("a")].map((link) => ({ text: link.textContent, href: link.href }));
      return {
        markerLabel: marker?.getAttribute("aria-label"),
        owner: detail.querySelector(".sensor-map-owner small")?.textContent,
        sensor: detail.querySelector("h2")?.textContent,
        links,
        avatarLoaded: Boolean(detail.querySelector("img")?.complete && detail.querySelector("img")?.naturalWidth),
        mapCanvasReady: Boolean(document.querySelector("#public-sensor-map .sensor-map-canvas")?.width > 100),
        inlineMapSvgCount: document.querySelectorAll("#public-sensor-map svg").length,
        markerTouchTarget: Math.min(marker?.getBoundingClientRect().width ?? 0, marker?.getBoundingClientRect().height ?? 0),
        visibleText: document.body.innerText,
        overflowX: document.documentElement.scrollWidth > innerWidth + 1,
      };
    });
    assert.equal(publicMap.markerLabel, "青猫センサーさんのベランダ環境センサー");
    assert.equal(publicMap.owner, "青猫センサー");
    assert.equal(publicMap.sensor, "ベランダ環境センサー");
    assert.deepEqual(publicMap.links.map((link) => link.text), ["X", "GitHub", "Instagram"]);
    assert.equal(publicMap.avatarLoaded, true);
    assert.equal(publicMap.mapCanvasReady, true);
    assert.equal(publicMap.inlineMapSvgCount, 0);
    assert(publicMap.markerTouchTarget >= 44);
    assert.equal(publicMap.overflowX, false);
    assert.doesNotMatch(publicMap.visibleText, /user_browser_qa|@example|owner_user_id/iu);
    assert.doesNotMatch(publicMap.visibleText, /131130|渋谷区/u);
    await page.screenshot({ path: path.join(outputDir, `${label}-public-map.png`), fullPage: true });

    await page.goto(new URL("/sensors/?authenticated=1#profile", baseUrl).href, { waitUntil: "domcontentloaded" });
    await page.locator("[data-view='profile']").waitFor({ state: "visible" });
    assert.equal(await page.locator("#profile-form input[name='displayName']").inputValue(), "青猫センサー");
    await page.locator("#profile-form input[name='displayName']").fill("青猫観測所");
    await page.locator("#profile-form input[name='xUrl']").fill("https://x.com/aoneko_station");
    await page.locator("#profile-form input[name='githubUrl']").fill("https://github.com/aoneko-station");
    await page.locator("#profile-form input[name='instagramUrl']").fill("https://instagram.com/aoneko.station");
    await page.locator("#profile-form button[type='submit']").click();
    await page.waitForFunction(() => document.querySelector("#sensor-status")?.textContent === "プロフィールを保存しました。");
    await page.locator("#profile-avatar-input").setInputFiles({ name: "avatar.png", mimeType: "image/png", buffer: png });
    await page.waitForFunction(() => document.querySelector("#sensor-status")?.textContent === "アイコンを保存しました。");
    await page.locator("#profile-avatar-preview img").waitFor({ state: "visible" });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false);
    await page.screenshot({ path: path.join(outputDir, `${label}-profile.png`), fullPage: true });

    await page.locator("[data-nav='map']").click();
    await page.waitForFunction(() => !document.querySelector("[data-view='map']")?.hidden && location.hash === "#map");
    await page.waitForFunction(() => document.querySelector("#public-sensor-detail .sensor-map-owner small")?.textContent === "青猫観測所");
    assert.equal(await page.locator("#public-sensor-detail h2").textContent(), "ベランダ環境センサー");

    await page.locator("[data-nav='devices']").click();
    await page.locator("[data-view='devices']").waitFor({ state: "visible" });
    await page.locator("[data-action='show-add']").click();
    await page.locator("#device-form input[name='name']").fill("校庭ESP32");
    await page.locator("#device-form select[name='countryCode']").selectOption("JP");
    await page.waitForFunction(() => document.querySelector("#device-form [data-location-picker]")?.dataset.mapView === "JP");
    assert.equal(await page.locator("#device-form [data-location-picker] [data-map-basis]").textContent(), "BASEMAP / NATURAL EARTH / JP");
    await page.screenshot({ path: path.join(outputDir, `${label}-japan-zoom.png`), fullPage: true });
    await page.waitForFunction(() => !document.querySelector("#device-form select[name='subdivisionCode']")?.disabled);
    await page.locator("#device-form select[name='subdivisionCode']").selectOption("JP-13");
    await page.waitForFunction(() => !document.querySelector("#device-form select[name='municipalityCode']")?.disabled);
    await page.locator("#device-form select[name='municipalityCode']").selectOption("131130");
    assert.equal(await page.locator("#device-form input[name='isPublic']").inputValue(), "true");
    const picker = page.locator("#device-form [data-location-picker]");
    const box = await picker.boundingBox();
    assert(box);
    assert.equal(await picker.getAttribute("role"), "group");
    assert(await picker.getAttribute("aria-describedby"));
    await page.mouse.click(box.x + box.width * 0.82, box.y + box.height * 0.31);
    const beforeKeyboard = Number(await page.locator("#device-form input[name='publicLongitude']").inputValue());
    await picker.focus();
    await page.keyboard.press("ArrowRight");
    assert.equal(Number(await page.locator("#device-form input[name='publicLongitude']").inputValue()), Math.min(180, beforeKeyboard + 1));
    const picked = await page.evaluate(() => ({
      latitude: document.querySelector("#device-form input[name='publicLatitude']")?.value,
      longitude: document.querySelector("#device-form input[name='publicLongitude']")?.value,
    }));
    assert.notEqual(picked.latitude, "");
    assert.notEqual(picked.longitude, "");
    assert(Number(picked.latitude) >= 20 && Number(picked.latitude) <= 48);
    assert(Number(picked.longitude) >= 122 && Number(picked.longitude) <= 154);
    await page.locator("#device-form input[name='acceptTerms']").check();
    await page.locator("#device-form button[type='submit']").click();
    await page.locator("[data-view='pairing']").waitFor({ state: "visible" });
    const qa = await (await fetch(new URL("/__qa/report", baseUrl))).json();
    assert.equal(qa.avatarUploaded, true);
    assert.equal(qa.profile.displayName, "青猫観測所");
    assert.equal(qa.profile.xUrl, "https://x.com/aoneko_station");
    assert.equal(qa.lastPairingDraft.name, "校庭ESP32");
    assert.equal(qa.lastPairingDraft.subdivisionCode, "JP-13");
    assert.equal(qa.lastPairingDraft.municipalityCode, "131130");
    assert.equal(qa.lastPairingDraft.isPublic, true);
    assert.equal(qa.lastPairingDraft.publicLatitude, Number(picked.latitude));
    assert.equal(qa.lastPairingDraft.publicLongitude, Number(picked.longitude));
    await page.locator("#pairing-complete").click();
    await page.locator(".sensor-device-card button").click();
    await page.locator("[data-view='detail']").waitFor({ state: "visible" });
    await page.waitForFunction(() => document.querySelector("#location-form select[name='subdivisionCode']")?.value === "JP-13");
    assert.equal(await page.locator("#location-form select[name='municipalityCode']").inputValue(), "131130");
    await page.locator("#location-form select[name='subdivisionCode']").selectOption("JP-14");
    await page.waitForFunction(() => !document.querySelector("#location-form select[name='municipalityCode']")?.disabled);
    assert.equal(await page.locator("#location-form select[name='municipalityCode'] option[value='131130']").count(), 0);
    await page.locator("#location-form select[name='municipalityCode']").selectOption("142085");
    await page.locator("#location-form button[type='submit']").click();
    await page.waitForFunction(() => document.querySelector("#sensor-status")?.textContent === "地域を更新しました。");
    const edited = await (await fetch(new URL("/__qa/report", baseUrl))).json();
    assert.equal(edited.lastDeviceDraft.subdivisionCode, "JP-14");
    assert.equal(edited.lastDeviceDraft.municipalityCode, "142085");
    assert.equal(edited.lastDeviceDraft.admin1Code, null);
    assert.equal(edited.lastDeviceDraft.localityName, null);
    assert.match(await page.locator("#detail-location").textContent(), /神奈川県.*JP-14.*逗子市.*142085/u);

    await page.locator("#location-form select[name='subdivisionCode']").selectOption("JP-47");
    await page.locator("#location-form button[type='submit']").click();
    await page.waitForFunction(() => document.querySelector("#sensor-status")?.textContent === "地域を更新しました。");
    const okinawa = await (await fetch(new URL("/__qa/report", baseUrl))).json();
    assert.equal(okinawa.lastDeviceDraft.subdivisionCode, "JP-47");
    assert.equal(okinawa.lastDeviceDraft.municipalityCode, null);
    assert.equal(okinawa.lastDeviceDraft.publicLatitude, 26.2);
    assert.equal(okinawa.lastDeviceDraft.publicLongitude, 127.7);
    await page.locator("[data-nav='map']").click();
    await page.locator("[data-view='map']").waitFor({ state: "visible" });
    assert.equal(await page.locator(".sensor-map-marker").getAttribute("data-latitude"), "26.2");
    assert.equal(await page.locator(".sensor-map-marker").getAttribute("data-longitude"), "127.7");
    await page.screenshot({ path: path.join(outputDir, `${label}-device-detail.png`), fullPage: true });
    report.scans.push({ viewport: label, publicMap: { ...publicMap, visibleText: undefined }, picked, profile: qa.profile, editedRegion: edited.lastDeviceDraft, okinawaRegion: okinawa.lastDeviceDraft, passed: true });
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

console.log("sensor profile and public map browser check passed");
