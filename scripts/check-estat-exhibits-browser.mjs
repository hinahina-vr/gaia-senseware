import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright-core";

const browserPath = process.argv[2] || "C:/Program Files/Google/Chrome/Application/chrome.exe";
const baseUrl = (process.argv[3] || "http://127.0.0.1:4198").replace(/\/$/u, "");
const outputDir = path.resolve(process.argv[4] || "artifacts/estat-exhibits");
fs.mkdirSync(outputDir, { recursive: true });

const browser = await chromium.launch({
  executablePath: browserPath,
  headless: true,
  args: ["--enable-webgl", "--ignore-gpu-blocklist", "--disable-background-timer-throttling"],
});
const errors = [];
const responses404 = [];

const monitor = (page) => {
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  page.on("pageerror", (error) => errors.push(error.stack || error.message));
  page.on("response", (response) => { if (response.status() === 404) responses404.push(response.url()); });
};

const openMap = async (page) => {
  await page.goto(`${baseUrl}/#earth`, { waitUntil: "domcontentloaded", timeout: 90_000 });
  await page.waitForFunction(() => Boolean(globalThis.GaiaMapObservationAdapter && globalThis.GaiaEstatExhibits), null, { timeout: 30_000 });
  await page.evaluate(() => { location.hash = "#japan"; });
  await page.waitForFunction(() => document.querySelectorAll("#japan-estat-mode-list [data-estat-exhibit]").length === 10, null, { timeout: 20_000 });
  await page.evaluate(() => globalThis.GaiaModeEntryGuide?.close?.("map", { restoreFocus: false }));
};

const canvasEvidence = (page) => page.locator("#gaia-estat-canvas").evaluate((canvas) => {
  const context = canvas.getContext("2d", { willReadFrequently: true });
  const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
  let visible = 0;
  let energy = 0;
  for (let index = 0; index < pixels.length; index += 16) {
    const alpha = pixels[index + 3];
    if (alpha > 6) visible += 1;
    energy += pixels[index] + pixels[index + 1] + pixels[index + 2] + alpha;
  }
  return { width: canvas.width, height: canvas.height, visible, energy };
});

const snapshots = [];
try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  const page = await context.newPage();
  monitor(page);
  await openMap(page);

  assert.equal(await page.locator(".map-mode-bank").getAttribute("aria-label"), "地図の25展示を選ぶ");
  assert.equal(await page.locator("#map-mode-bank-kicker").textContent(), "INSTALLATION BANK / MAP 01—25");
  assert.equal(await page.locator("#japan-estat-mode-list .map-mode-button").count(), 10);
  assert.equal(await page.locator(".gaia-estat-marker").count(), 47);
  await page.waitForTimeout(700);
  await page.evaluate(() => globalThis.GaiaModeEntryGuide?.close?.("map", { restoreFocus: false }));
  await page.waitForTimeout(240);
  await page.locator(".map-dock-bank-trigger").evaluate((button) => button.click());
  await page.waitForFunction(() => document.querySelector(".map-mode-bank")?.classList.contains("is-dock-bank-expanded"));
  await page.waitForTimeout(360);
  await page.screenshot({ path: path.join(outputDir, "pc-bank-grouped.png"), fullPage: true });
  await page.locator(".map-dock-bank-trigger").evaluate((button) => button.click());

  const contracts = [
    { number: "16", title: "人の潮目", key: "migration" },
    { number: "17", title: "旅の灯", key: "lodging" },
    { number: "18", title: "住まいの芽吹き", key: "housing" },
    { number: "19", title: "空の体温", key: "averageTemperature" },
    { number: "20", title: "夏の頂", key: "summerHigh" },
    { number: "21", title: "冬の底", key: "winterLow" },
    { number: "22", title: "湿りの膜", key: "relativeHumidity" },
    { number: "23", title: "光の貯金", key: "sunshineHours" },
    { number: "24", title: "雨の器", key: "precipitation" },
    { number: "25", title: "雨の足跡", key: "rainyDays" },
  ];
  for (let index = 0; index < contracts.length; index += 1) {
    const contract = contracts[index];
    await page.locator("#japan-estat-mode-list .map-mode-button").nth(index).evaluate((button) => button.click());
    await page.waitForFunction(({ number, key }) => (
      document.querySelector("#japan-layer")?.classList.contains("is-estat-exhibit")
      && document.querySelector("#japan-mode-number")?.textContent === number
      && document.querySelector(".gaia-estat-readout")?.dataset.estatExhibit === key
    ), contract);
    await page.waitForTimeout(1100);
    assert.equal(await page.locator("#japan-mode-title").textContent(), contract.title);
    assert.equal(await page.locator(".gaia-estat-marker:not([hidden])").count() > 30, true);
    assert.ok(Number(await page.locator("#japan-overlay").getAttribute("data-earth-zoom")) >= 4.4, `${contract.key} did not open at the Japan-focused size`);
    const evidence = await canvasEvidence(page);
    assert.ok(evidence.visible > 500, `${contract.key} canvas did not draw enough visible pixels`);
    snapshots.push({ ...contract, ...evidence });
    await page.screenshot({ path: path.join(outputDir, `pc-${contract.number}.png`), fullPage: true });
  }

  await page.evaluate(() => globalThis.GaiaEstatExhibits.select(0));
  await page.waitForTimeout(1100);
  const autoplayInitial = await page.evaluate(() => globalThis.GaiaEstatExhibits.getState());
  assert.equal(autoplayInitial.monthIndex, 0);
  assert.equal(autoplayInitial.selectedIndex, 0);
  await page.evaluate(() => {
    globalThis.__estatPoiCodes = [];
    addEventListener("gaia:estat-poi-change", (event) => {
      if (event.detail?.auto) globalThis.__estatPoiCodes.push(event.detail.to);
    });
  });
  await page.waitForTimeout(6500);
  const autoplayState = await page.evaluate(() => globalThis.GaiaEstatExhibits.getState());
  const autoplayPoiCodes = await page.evaluate(() => globalThis.__estatPoiCodes);
  assert.equal(autoplayState.monthIndex, 1, "monthly series did not advance automatically");
  assert.deepEqual(autoplayPoiCodes.slice(0, 2), ["02", "03"].slice(0, autoplayPoiCodes.length));
  assert.ok(autoplayPoiCodes.length >= 1, "prefecture relay did not advance automatically");
  await page.evaluate(() => globalThis.GaiaEstatExhibits.setMonth(0));
  await page.waitForTimeout(1050);
  const february = await canvasEvidence(page);
  await page.screenshot({ path: path.join(outputDir, "pc-16-2026-02.png"), fullPage: true });
  await page.evaluate(() => globalThis.GaiaEstatExhibits.setMonth(1));
  await page.waitForTimeout(1050);
  const march = await canvasEvidence(page);
  await page.screenshot({ path: path.join(outputDir, "pc-16-2026-03.png"), fullPage: true });
  assert.ok(march.energy > february.energy * 1.35, "high-variation month did not materially alter the rendered distribution");
  assert.equal(await page.locator(".gaia-estat-readout").getAttribute("data-estat-period"), "2026-03");

  await page.evaluate(() => globalThis.GaiaEstatExhibits.select(8));
  await page.waitForFunction(() => document.querySelector(".gaia-estat-readout")?.dataset.estatExhibit === "precipitation");
  await page.waitForTimeout(1050);
  const annualInitial = await page.evaluate(() => globalThis.GaiaEstatExhibits.getState());
  assert.equal(annualInitial.period, "2020");
  assert.equal(await page.locator("strong[data-estat-frequency]").textContent(), "e-Stat · 年次");
  assert.match(await page.locator("[data-estat-delta-label]").textContent(), /前年差/u);
  const rainfall2020 = await canvasEvidence(page);
  await page.screenshot({ path: path.join(outputDir, "pc-24-2020.png"), fullPage: true });
  await page.evaluate(() => globalThis.GaiaEstatExhibits.setPeriod(4));
  await page.waitForTimeout(1050);
  const rainfall2024 = await canvasEvidence(page);
  await page.screenshot({ path: path.join(outputDir, "pc-24-2024.png"), fullPage: true });
  assert.equal(await page.locator(".gaia-estat-readout").getAttribute("data-estat-period"), "2024");
  assert.ok(Math.abs(rainfall2024.energy - rainfall2020.energy) > rainfall2020.energy * 0.01, "annual climate data did not materially alter the rendered distribution");

  await page.evaluate(() => globalThis.GaiaEstatExhibits.setPeriod(0, { auto: true }));
  await page.waitForTimeout(6400);
  const annualAutoplay = await page.evaluate(() => globalThis.GaiaEstatExhibits.getState());
  assert.equal(annualAutoplay.period, "2021", "annual series did not advance automatically");

  await page.evaluate(() => globalThis.GaiaEstatExhibits.selectPrefecture(46));
  await page.waitForTimeout(250);
  assert.equal(await page.locator(".gaia-estat-readout").getAttribute("data-estat-selected-code"), "47");
  assert.equal(await page.locator(".gaia-estat-marker[aria-current='true']").getAttribute("data-estat-prefecture"), "47");

  const zoomBefore = Number(await page.locator("#japan-overlay").getAttribute("data-earth-zoom"));
  await page.locator("#gaia-map-zoom-in").evaluate((button) => button.click());
  await page.waitForFunction((before) => Number(document.querySelector("#japan-overlay")?.dataset.earthZoom) > before + 0.05, zoomBefore);
  assert.equal(await page.locator("#gaia-map-zoom-controls").isVisible(), true);
  await context.close();

  const wideContext = await browser.newContext({ viewport: { width: 2048, height: 1114 }, deviceScaleFactor: 1 });
  const widePage = await wideContext.newPage();
  monitor(widePage);
  await openMap(widePage);
  await widePage.locator("#japan-estat-mode-list .map-mode-button").nth(1).evaluate((button) => button.click());
  await widePage.waitForFunction(() => document.querySelector(".gaia-estat-readout")?.dataset.estatExhibit === "lodging");
  await widePage.waitForTimeout(1100);
  const wideBox = await widePage.locator(".gaia-estat-readout").boundingBox();
  assert.ok(wideBox && wideBox.height < 190, `wide readout wrapped into an extra row: ${JSON.stringify(wideBox)}`);
  await widePage.screenshot({ path: path.join(outputDir, "wide-17.png"), fullPage: true });
  await wideContext.close();

  const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
  const mobilePage = await mobileContext.newPage();
  monitor(mobilePage);
  await openMap(mobilePage);
  await mobilePage.locator("#japan-estat-mode-list .map-mode-button").nth(1).evaluate((button) => button.click());
  await mobilePage.waitForFunction(() => document.querySelector(".gaia-estat-readout")?.dataset.estatExhibit === "lodging");
  await mobilePage.waitForTimeout(700);
  await mobilePage.evaluate(() => globalThis.GaiaModeEntryGuide?.close?.("map", { restoreFocus: false }));
  await mobilePage.waitForTimeout(1100);
  const mobileBox = await mobilePage.locator(".gaia-estat-readout").boundingBox();
  assert.ok(mobileBox && mobileBox.x >= 0 && mobileBox.y >= 0 && mobileBox.x + mobileBox.width <= 390.5 && mobileBox.y + mobileBox.height <= 844.5);
  assert.equal(await mobilePage.locator("#gaia-map-zoom-controls").isVisible(), true);
  await mobilePage.screenshot({ path: path.join(outputDir, "mobile-17.png"), fullPage: true });
  await mobileContext.close();

  assert.deepEqual(errors, []);
  assert.deepEqual(responses404, []);
  const report = { status: "passed", baseUrl, snapshots, autoplayState, autoplayPoiCodes, annualAutoplay, monthEvidence: { february, march }, annualEvidence: { rainfall2020, rainfall2024 }, errors, responses404 };
  fs.writeFileSync(path.join(outputDir, "report.json"), `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify(report, null, 2));
} finally {
  await browser.close();
}
