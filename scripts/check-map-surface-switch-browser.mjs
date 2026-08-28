import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const [moduleRoot, executablePath, outputArgument, baseUrl = "http://127.0.0.1:4173"] = process.argv.slice(2);
if (!moduleRoot || !executablePath) throw new Error("Playwright module and browser executable are required");
const playwrightEntry = fs.existsSync(path.join(moduleRoot, "index.mjs"))
  ? path.join(moduleRoot, "index.mjs")
  : path.join(moduleRoot, "playwright", "index.mjs");
const { chromium } = await import(pathToFileURL(playwrightEntry).href);
const outputDir = path.resolve(outputArgument || "artifacts/unified-world-bank");
fs.mkdirSync(outputDir, { recursive: true });

const browser = await chromium.launch({ headless: true, executablePath });
const report = { consoleErrors: [], pageErrors: [], responses404: [], scans: [] };
const expectedCopies = [
  "CO₂が季節ごとに上下しながら、長い目では増えてきた様子を見る。",
  "ある一日の海流が変わらないと仮定し、0〜14日後の移動距離をたどる。白い風矢印は比較用です。",
  "森林だけを緑で強調し、31地点の雨量と同じ場所で見比べる。",
  "国ごとの現在値を比べ、選んだ国に自分の改善目標を置く。",
  "宇宙から見た夜の明かりと、国ごとの排出量を見比べる。",
  "世界の大地震と、日本各地で実際に記録された揺れをたどる。",
  "同じ国の森林率と都市人口率を組にし、全体傾向と例外を見る。",
  "国土の青で再生可能電力比率を比べ、選択国の日差しと風を補足で見る。",
];
const expectedCodes = ["AIR", "OCEAN", "FOREST", "RECYCLING", "CITY", "QUAKE", "ECOLOGIES", "ENERGY"];
const expectedLiveCopies = [
  "NOAAの風速を、ハワイ島を横切る流線の密度と速さへ変換します。",
  "Mauna LoaのCO₂公開値を、島から広がる光環と呼吸周期へ変換します。",
  "JAXA GSMaPの領域平均降水量を、雨線と水面の波紋密度へ変換します。",
  "Sentinel-5P NO₂をスペクトルの薄膜へ変換。欠測時は走査待機を明示します。",
];

try {
  for (const viewport of [
    { name: "pc", width: 1440, height: 900 },
    { name: "tablet", width: 768, height: 900 },
    { name: "mobile", width: 390, height: 844, isMobile: true },
  ]) {
    const context = await browser.newContext({
      viewport,
      colorScheme: "dark",
      hasTouch: Boolean(viewport.isMobile),
      isMobile: Boolean(viewport.isMobile),
    });
    await context.addInitScript(() => {
      localStorage.setItem("gaia-senseware-bgm-volume", "0");
      localStorage.setItem("gaiaSensewareTourSeen:v1", "true");
    });
    const page = await context.newPage();
    page.on("console", (message) => {
      if (message.type() === "error" && !message.text().includes("status of 401")) {
        report.consoleErrors.push(`${viewport.name}: ${message.text()}`);
      }
    });
    page.on("pageerror", (error) => report.pageErrors.push(`${viewport.name}: ${error.message}`));
    page.on("response", (response) => {
      if (response.status() === 404) report.responses404.push(`${viewport.name}: ${response.url()}`);
    });

    await page.goto(new URL("/?preview=gaia-unified-world-bank-1#japan", baseUrl).href, { waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => typeof window.GaiaModeLoader?.load === "function");
    await page.evaluate(() => window.GaiaModeLoader.load("exploration"));
    await page.waitForFunction(() => document.documentElement.dataset.gaiaAppReady === "true");
    await page.waitForFunction(() => document.querySelectorAll("#japan-mode-list .map-mode-button").length === 12);
    await page.evaluate(() => window.GaiaMapObservationAdapter.openMap());
    await page.waitForFunction(() => document.querySelector("#japan-layer")?.getAttribute("aria-hidden") === "false");

    assert.equal(await page.locator(".map-surface-switch").count(), 0, `${viewport.name}: obsolete MAP/LIGHT toggle remains`);
    assert.equal(await page.locator("#japan-mode-list .map-mode-button").count(), 12, `${viewport.name}: MAP button count`);
    assert.equal(await page.locator("#abstract-mode-list .map-mode-button").count(), 8, `${viewport.name}: LIGHT button count`);

    if (viewport.name === "mobile") await page.locator("#map-mobile-bank-toggle").click();
    await page.waitForFunction(() => [...document.querySelectorAll(".map-mode-groups .map-mode-button")]
      .every((button) => button.getClientRects().length > 0));

    const scan = await page.evaluate(() => {
      const bank = document.querySelector(".map-mode-bank");
      const bankRect = bank.getBoundingClientRect();
      const buttons = [...document.querySelectorAll(".map-mode-groups .map-mode-button")];
      return {
        bank: bankRect.toJSON(),
        groupLabels: [...document.querySelectorAll(".map-mode-group-label")].map((label) => label.textContent.trim()),
        visibleButtons: buttons.filter((button) => button.getClientRects().length > 0).length,
        buttonHeights: buttons.map((button) => button.getBoundingClientRect().height),
        horizontalOverflow: Math.max(0, bank.scrollWidth - bank.clientWidth),
      };
    });
    assert.deepEqual(scan.groupLabels, ["MAP地図", "LIGHT光"], `${viewport.name}: integrated group labels`);
    assert.equal(scan.visibleButtons, 20, `${viewport.name}: not all buttons are visible together`);
    assert.ok(scan.buttonHeights.every((height) => height >= (viewport.name === "mobile" ? 44 : 30)), `${viewport.name}: button target is too short`);
    assert.ok(scan.horizontalOverflow <= 1, `${viewport.name}: bank overflows horizontally by ${scan.horizontalOverflow}px`);

    for (const index of expectedCopies.keys()) {
      await page.locator("#japan-mode-list .map-mode-button:not([data-live-exhibit])").nth(index).focus();
      assert.equal(await page.locator("#map-mode-preview-copy").textContent(), expectedCopies[index], `${viewport.name}: MAP ${index + 1} copy`);
      assert.equal(await page.locator("#map-mode-preview-number").textContent(), `${String(index + 1).padStart(2, "0")} / ${expectedCodes[index]}`);
    }

    for (const index of expectedCopies.keys()) {
      await page.locator("#abstract-mode-list .map-mode-button").nth(index).focus();
      assert.equal(await page.locator("#map-mode-preview-copy").textContent(), expectedCopies[index], `${viewport.name}: LIGHT ${index + 1} copy`);
      assert.equal(await page.locator("#map-mode-preview-number").textContent(), `${String(index + 1).padStart(2, "0")} / ${expectedCodes[index]}`);
    }
    assert.match(await page.locator("#map-mode-preview-surface").textContent(), /ABSTRACT MODE/u);
    await page.waitForFunction(() => {
      const preview = document.querySelector("#map-mode-preview");
      return preview && getComputedStyle(preview).visibility === "visible" && Number(getComputedStyle(preview).opacity) > 0.9;
    });
    if (viewport.name === "mobile") {
      await page.waitForFunction(() => document.querySelector("#map-mode-preview")?.getBoundingClientRect().bottom <= innerHeight + 1);
    }
    const previewScan = await page.locator("#map-mode-preview").evaluate((node) => ({
      className: node.className,
      rect: node.getBoundingClientRect().toJSON(),
      display: getComputedStyle(node).display,
      visibility: getComputedStyle(node).visibility,
      opacity: getComputedStyle(node).opacity,
      position: getComputedStyle(node).position,
      bankOverflow: node.closest(".map-mode-bank") ? getComputedStyle(node.closest(".map-mode-bank")).overflow : "detached-for-desktop",
    }));
    assert.equal(await page.locator("#map-mode-preview").isVisible(), true, `${viewport.name}: focus preview is hidden: ${JSON.stringify(previewScan)}`);
    assert.ok(previewScan.rect.top >= -1 && previewScan.rect.bottom <= viewport.height + 1, `${viewport.name}: preview leaves the viewport: ${JSON.stringify(previewScan.rect)}`);

    for (const [index, copy] of expectedLiveCopies.entries()) {
      await page.locator("#japan-mode-list .map-mode-button[data-live-exhibit]").nth(index).focus();
      assert.equal(await page.locator("#map-mode-preview-copy").textContent(), copy, `${viewport.name}: LIVE ${index + 9} copy`);
    }

    await page.locator("#abstract-mode-list .map-mode-button").nth(2).click({ force: true });
    await page.waitForFunction(() => document.querySelector(".map-mode-bank")?.dataset.mapSurface === "light"
      && document.querySelector("#japan-layer")?.classList.contains("is-abstract-exhibit"));
    if (viewport.name === "mobile") await page.locator("#map-mobile-bank-toggle").click();
    await page.locator("#japan-mode-list .map-mode-button:not([data-live-exhibit])").nth(1).click({ force: true });
    await page.waitForFunction(() => document.querySelector(".map-mode-bank")?.dataset.mapSurface === "map"
      && !document.querySelector("#japan-layer")?.classList.contains("is-abstract-exhibit"));

    if (viewport.name === "mobile") await page.locator("#map-mobile-bank-toggle").click();
    await page.locator("#abstract-mode-list .map-mode-button").nth(2).focus();
    await page.waitForFunction(() => document.querySelector("#map-mode-preview")?.classList.contains("is-open"));

    const screenshot = path.join(outputDir, `${viewport.name}-unified-world-bank.png`);
    await page.screenshot({ path: screenshot, fullPage: false });
    report.scans.push({ viewport, screenshot, ...scan });
    await context.close();
  }

  assert.deepEqual(report.consoleErrors, [], `console errors: ${report.consoleErrors.join("\n")}`);
  assert.deepEqual(report.pageErrors, [], `page errors: ${report.pageErrors.join("\n")}`);
  assert.deepEqual(report.responses404, [], `404 responses: ${report.responses404.join("\n")}`);
  report.status = "passed";
  fs.writeFileSync(path.join(outputDir, "report.json"), JSON.stringify(report, null, 2));
  console.log("GAIA unified world bank browser checks passed: 3 viewports, 20 controls, restored focus copy.");
} finally {
  await browser.close();
}
