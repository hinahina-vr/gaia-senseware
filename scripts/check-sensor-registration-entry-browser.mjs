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
const outputDir = path.resolve(outputArgument || "artifacts/sensor-registration-entry");
fs.mkdirSync(outputDir, { recursive: true });

const viewports = [
  { name: "pc-1440", width: 1440, height: 900 },
  { name: "mobile-390", width: 390, height: 844 },
];
const report = { status: "running", viewports, scans: [], consoleErrors: [], expectedAuth401: [], pageErrors: [], responses404: [] };
const browser = await chromium.launch({ headless: true, executablePath });

const visible = async (locator) => locator.evaluate((element) => {
  const rect = element.getBoundingClientRect();
  const style = getComputedStyle(element);
  return !element.hidden && style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0;
});

try {
  for (const viewport of viewports) {
    await fetch(new URL("/__qa/reset", baseUrl), { method: "POST" });
    const context = await browser.newContext({ viewport, reducedMotion: "reduce" });
    const page = await context.newPage();
    const label = viewport.name;
    page.on("console", (message) => {
      if (message.type() !== "error") return;
      const text = message.text();
      if (text === "Failed to load resource: the server responded with a status of 401 (Unauthorized)") {
        report.expectedAuth401.push(`${label}: unauthenticated session probe`);
      } else report.consoleErrors.push(`${label}: ${text}`);
    });
    page.on("pageerror", (error) => report.pageErrors.push(`${label}: ${error.message}`));
    page.on("response", (response) => { if (response.status() === 404) report.responses404.push(`${label}: ${response.url()}`); });

    await page.goto(new URL("/", baseUrl).href, { waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => Boolean(document.querySelector("#intro-path-grid")));
    await page.evaluate(() => {
      document.querySelector("#gaia-opening")?.setAttribute("hidden", "");
      document.body.classList.remove("gaia-opening-active");
      window.dispatchEvent(new CustomEvent("gaia:opening-complete"));
    });
    const sensorCard = page.locator("[data-sensor-platform-link]");
    await sensorCard.waitFor({ state: "visible" });
    const entrance = await page.evaluate(() => {
      const cards = [...document.querySelectorAll("#intro-path-grid > .intro-path-card")];
      const card = document.querySelector("[data-sensor-platform-link]");
      const rect = card.getBoundingClientRect();
      return {
        labels: cards.map((element) => element.querySelector("strong")?.textContent.trim()),
        sensorIndex: cards.indexOf(card),
        href: card.getAttribute("href"),
        label: card.querySelector("strong")?.textContent.trim(),
        enter: card.querySelector(".intro-path-enter")?.textContent.replace("→", "").trim(),
        visible: rect.width > 0 && rect.height > 0,
        overflowX: document.documentElement.scrollWidth > innerWidth + 1,
      };
    });
    assert.equal(entrance.labels[1], "世界を読む");
    assert.equal(entrance.sensorIndex, 2);
    assert.equal(entrance.label, "ESP32センサーを登録");
    assert.equal(entrance.enter, "ESP32センサーを登録");
    assert.equal(entrance.href, "./sensors/");
    assert.equal(entrance.visible, true);
    assert.equal(entrance.overflowX, false);
    await page.screenshot({ path: path.join(outputDir, `${label}-entrance.png`), fullPage: true });

    await sensorCard.click();
    await page.waitForURL(/\/sensors\/$/u);
    await page.locator("[data-view='login']").waitFor({ state: "visible" });
    const login = await page.evaluate(() => {
      const view = document.querySelector("[data-view='login']");
      const steps = [...view.querySelectorAll(".sensor-register-preview li")];
      return {
        cta: document.querySelector("#google-login")?.textContent.replace(/\s+/gu, " ").trim(),
        steps: steps.map((step) => step.textContent.replace(/\s+/gu, " ").trim()),
        previewVisible: steps.length === 3 && steps.every((step) => { const rect = step.getBoundingClientRect(); return rect.width > 0 && rect.height > 0; }),
        overflowX: document.documentElement.scrollWidth > innerWidth + 1,
      };
    });
    assert.match(login.cta, /GoogleでログインしてESP32を登録/u);
    assert.equal(login.previewVisible, true);
    assert.equal(login.steps.length, 3);
    assert(login.steps[2].includes("CITY-SENSOR-XXXX"));
    assert.equal(login.overflowX, false);
    await page.screenshot({ path: path.join(outputDir, `${label}-login.png`), fullPage: true });

    await page.goto(new URL("/sensors/?authenticated=1", baseUrl).href, { waitUntil: "domcontentloaded" });
    await page.locator("[data-view='devices']").waitFor({ state: "visible" });
    assert.equal(await visible(page.locator("#device-empty")), true);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false);
    await page.screenshot({ path: path.join(outputDir, `${label}-empty.png`), fullPage: true });
    await page.locator("[data-action='show-add']").click();
    await page.locator("[data-view='add']").waitFor({ state: "visible" });
    await page.waitForFunction(() => document.querySelector("#device-form [data-location-picker]")?.dataset.basemap === "ready");
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false);
    assert.equal(await page.locator("#device-form [data-location-picker] svg").count(), 0);
    assert.equal(await page.evaluate(() => {
      const canvas = document.querySelector("#device-form .sensor-map-canvas");
      return Boolean(canvas && canvas.width > 100 && canvas.height > 50);
    }), true);
    await page.screenshot({ path: path.join(outputDir, `${label}-add.png`), fullPage: true });
    await page.locator("#device-form input[name='name']").fill("学園祭ESP32");
    await page.locator("#device-form select[name='countryCode']").selectOption("JP");
    await page.waitForFunction(() => !document.querySelector("#device-form select[name='subdivisionCode']")?.disabled);
    await page.locator("#device-form select[name='subdivisionCode']").selectOption("JP-13");
    await page.waitForFunction(() => !document.querySelector("#device-form select[name='municipalityCode']")?.disabled);
    await page.locator("#device-form select[name='municipalityCode']").selectOption("131130");
    await page.locator("#device-form button[type='submit']").click();
    await page.locator("[data-view='pairing']").waitFor({ state: "visible" });
    const pairing = await page.evaluate(() => {
      const view = document.querySelector("[data-view='pairing']");
      const steps = [...view.querySelectorAll(".sensor-setup-steps li")];
      return {
        code: document.querySelector("#pairing-code")?.textContent.trim(),
        steps: steps.map((step) => step.textContent.replace(/\s+/gu, " ").trim()),
        instructionsVisible: steps.length === 3 && steps.every((step) => { const rect = step.getBoundingClientRect(); return rect.width > 0 && rect.height > 0; }),
        overflowX: document.documentElement.scrollWidth > innerWidth + 1,
      };
    });
    assert.equal(pairing.code, "H7K2-PQ9M");
    assert.equal(pairing.instructionsVisible, true);
    assert(pairing.steps.join(" ").includes("CITY-SENSOR-XXXX"));
    assert(pairing.steps.join(" ").includes("http://192.168.4.1/"));
    assert(pairing.steps.join(" ").includes("Wi-Fi"));
    assert(pairing.steps.join(" ").includes("Pairing Code"));
    assert.equal(pairing.overflowX, false);
    const qa = await (await fetch(new URL("/__qa/report", baseUrl))).json();
    assert.equal(qa.lastPairingDraft.countryCode, "JP");
    assert.equal(qa.lastPairingDraft.subdivisionCode, "JP-13");
    assert.equal(qa.lastPairingDraft.municipalityCode, "131130");
    assert.equal(qa.lastPairingDraft.admin1Code, null);
    assert.equal(qa.lastPairingDraft.localityName, null);
    await page.screenshot({ path: path.join(outputDir, `${label}-pairing.png`), fullPage: true });
    report.scans.push({ viewport: label, entrance, login, pairing, regionDraft: qa.lastPairingDraft, passed: true });
    await context.close();
  }
  assert.deepEqual(report.consoleErrors, []);
  assert.equal(report.expectedAuth401.length, viewports.length);
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

console.log("sensor registration entry browser check passed");
