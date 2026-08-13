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
        owner: detail.querySelector("small")?.textContent,
        sensor: detail.querySelector("h2")?.textContent,
        links,
        avatarLoaded: Boolean(detail.querySelector("img")?.complete && detail.querySelector("img")?.naturalWidth),
        visibleText: document.body.innerText,
        overflowX: document.documentElement.scrollWidth > innerWidth + 1,
      };
    });
    assert.equal(publicMap.markerLabel, "青猫センサーさんのベランダ環境センサー");
    assert.equal(publicMap.owner, "青猫センサー");
    assert.equal(publicMap.sensor, "ベランダ環境センサー");
    assert.deepEqual(publicMap.links.map((link) => link.text), ["X", "GitHub", "Instagram"]);
    assert.equal(publicMap.avatarLoaded, true);
    assert.equal(publicMap.overflowX, false);
    assert.doesNotMatch(publicMap.visibleText, /user_browser_qa|@example|owner_user_id/iu);
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
    await page.locator("[data-view='map']").waitFor({ state: "visible" });
    await page.waitForFunction(() => document.querySelector("#public-sensor-detail small")?.textContent === "青猫観測所");
    assert.equal(await page.locator("#public-sensor-detail h2").textContent(), "ベランダ環境センサー");

    await page.locator("[data-nav='devices']").click();
    await page.locator("[data-view='devices']").waitFor({ state: "visible" });
    await page.locator("[data-action='show-add']").click();
    await page.locator("#device-form input[name='name']").fill("校庭ESP32");
    await page.locator("#device-form select[name='countryCode']").selectOption("JP");
    await page.locator("#device-form input[name='isPublic']").check();
    const picker = page.locator("#device-form [data-location-picker]");
    const box = await picker.boundingBox();
    assert(box);
    await page.mouse.click(box.x + box.width * 0.82, box.y + box.height * 0.31);
    const picked = await page.evaluate(() => ({
      latitude: document.querySelector("#device-form input[name='publicLatitude']")?.value,
      longitude: document.querySelector("#device-form input[name='publicLongitude']")?.value,
    }));
    assert.notEqual(picked.latitude, "");
    assert.notEqual(picked.longitude, "");
    await page.locator("#device-form button[type='submit']").click();
    await page.locator("[data-view='pairing']").waitFor({ state: "visible" });
    const qa = await (await fetch(new URL("/__qa/report", baseUrl))).json();
    assert.equal(qa.avatarUploaded, true);
    assert.equal(qa.profile.displayName, "青猫観測所");
    assert.equal(qa.profile.xUrl, "https://x.com/aoneko_station");
    assert.equal(qa.lastPairingDraft.name, "校庭ESP32");
    assert.equal(qa.lastPairingDraft.isPublic, true);
    assert.equal(qa.lastPairingDraft.publicLatitude, Number(picked.latitude));
    assert.equal(qa.lastPairingDraft.publicLongitude, Number(picked.longitude));
    report.scans.push({ viewport: label, publicMap: { ...publicMap, visibleText: undefined }, picked, profile: qa.profile, passed: true });
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
