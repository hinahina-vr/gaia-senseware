import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const [moduleRoot, executablePath, outputArgument, baseUrl = "http://127.0.0.1:4173"] = process.argv.slice(2);
const tooltipOnly = process.argv.slice(6).includes("--tooltip-only");
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

const focusModeButton = async (page, locator, expectedCopy = null) => {
  await page.keyboard.press("Tab");
  await locator.focus();
  await page.waitForFunction(() => document.activeElement?.matches?.(".map-mode-button:focus-visible"));
  await page.waitForFunction(() => document.querySelector("#map-mode-preview")?.classList.contains("is-open"));
  if (expectedCopy) {
    await page.waitForFunction((copy) => document.querySelector("#map-mode-preview-copy")?.textContent === copy, expectedCopy);
  }
};

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
    assert.equal(await page.locator("#map-light-overlay").isHidden(), true, `${viewport.name}: independent light overlay starts open`);

    if (viewport.name === "mobile") await page.locator("#map-mobile-bank-toggle").click();
    await page.waitForFunction(() => [...document.querySelectorAll("#japan-mode-list .map-mode-button")]
      .every((button) => button.getClientRects().length > 0));
    await page.locator("#japan-close").focus();
    await page.waitForFunction(() => !document.querySelector("#map-mode-preview")?.classList.contains("is-open"));
    assert.equal(await page.locator("#map-mode-preview").getAttribute("aria-hidden"), "true", `${viewport.name}: preview is sticky without button intent`);

    const scan = await page.evaluate(() => {
      const bank = document.querySelector(".map-mode-bank");
      const bankRect = bank.getBoundingClientRect();
      const buttons = [...document.querySelectorAll("#japan-mode-list .map-mode-button")];
      return {
        bank: bankRect.toJSON(),
        groupLabels: [...document.querySelectorAll(".map-mode-group-label")].map((label) => label.textContent.trim()),
        visibleButtons: buttons.filter((button) => button.getClientRects().length > 0).length,
        buttonHeights: buttons.map((button) => button.getBoundingClientRect().height),
        horizontalOverflow: Math.max(0, bank.scrollWidth - bank.clientWidth),
      };
    });
    assert.deepEqual(scan.groupLabels, ["MAP地図"], `${viewport.name}: the main bank must contain only map choices`);
    assert.equal(scan.visibleButtons, 12, `${viewport.name}: not all map buttons are visible together`);
    assert.ok(scan.buttonHeights.every((height) => height >= (viewport.name === "mobile" ? 44 : 30)), `${viewport.name}: button target is too short`);
    assert.ok(scan.horizontalOverflow <= 1, `${viewport.name}: bank overflows horizontally by ${scan.horizontalOverflow}px`);
    const headingScan = await page.locator("#japan-layer .japan-heading").evaluate((heading) => {
      const title = heading.querySelector("#japan-title");
      const titleRect = title.getBoundingClientRect();
      const headingRect = heading.getBoundingClientRect();
      return {
        kickerDisplay: getComputedStyle(heading.querySelector(".japan-kicker")).display,
        descriptionWidth: heading.querySelector("#japan-description").getBoundingClientRect().width,
        titleCenterDelta: Math.abs((titleRect.left + titleRect.right) / 2 - (headingRect.left + headingRect.right) / 2),
      };
    });
    assert.equal(headingScan.kickerDisplay, "none", `${viewport.name}: the redundant heading kicker is still visible`);
    assert.ok(headingScan.descriptionWidth <= 1, `${viewport.name}: the redundant heading description is still visible`);
    if (viewport.name === "pc") {
      assert.ok(headingScan.titleCenterDelta <= 1, `${viewport.name}: the exhibit title is not centered (${headingScan.titleCenterDelta}px)`);
    }

    for (const index of expectedCopies.keys()) {
      await focusModeButton(page, page.locator("#japan-mode-list .map-mode-button:not([data-live-exhibit])").nth(index), expectedCopies[index]);
      assert.equal(await page.locator("#map-mode-preview-copy").textContent(), expectedCopies[index], `${viewport.name}: MAP ${index + 1} copy`);
      assert.equal(await page.locator("#map-mode-preview-number").textContent(), `${String(index + 1).padStart(2, "0")} / ${expectedCodes[index]}`);
    }

    const mouseSelection = page.locator("#japan-mode-list .map-mode-button:not([data-live-exhibit])").nth(1);
    if (viewport.name === "mobile") await mouseSelection.tap();
    else await mouseSelection.click();
    await page.waitForFunction(() => document.querySelector("#japan-mode-list .map-mode-button:nth-child(2)")?.getAttribute("aria-current") === "true");
    const buttonTransition = await mouseSelection.evaluate((button) => ({
      animationName: getComputedStyle(button).animationName,
      transitionDuration: getComputedStyle(button).transitionDuration,
    }));
    assert(buttonTransition.animationName.includes("map-mode-button-selected"), `${viewport.name}: selected button has no transition animation`);
    assert.notEqual(buttonTransition.transitionDuration, "0s", `${viewport.name}: button transitions are disabled`);
    await page.evaluate(() => {
      if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
    });
    if (viewport.name !== "mobile") await page.mouse.move(viewport.width - 4, viewport.height - 4);
    await page.waitForFunction(() => !document.querySelector("#map-mode-preview")?.classList.contains("is-open"));
    await page.waitForFunction(() => {
      const preview = document.querySelector("#map-mode-preview");
      if (!(preview instanceof HTMLElement)) return false;
      const style = getComputedStyle(preview);
      return Number(style.opacity) <= 0.01 && style.visibility === "hidden";
    });
    const dismissedPreview = await page.locator("#map-mode-preview").evaluate((preview) => ({
      ariaHidden: preview.getAttribute("aria-hidden"),
      opacity: Number(getComputedStyle(preview).opacity),
      visibility: getComputedStyle(preview).visibility,
      transitionDuration: getComputedStyle(preview).transitionDuration,
    }));
    assert.equal(dismissedPreview.ariaHidden, "true", `${viewport.name}: preview remains exposed after intent leaves`);
    assert(dismissedPreview.opacity <= 0.01, `${viewport.name}: preview did not fade out`);
    assert.equal(dismissedPreview.visibility, "hidden", `${viewport.name}: preview remains visible`);
    assert.notEqual(dismissedPreview.transitionDuration, "0s", `${viewport.name}: preview has no transition`);

    await page.locator("#map-light-overlay-open").click();
    await page.waitForFunction(() => !document.querySelector("#map-light-overlay")?.hidden);
    assert.match(await page.locator("#map-light-overlay").textContent(), /地図の番号とは対応しません。/u);
    for (const index of expectedCopies.keys()) {
      await focusModeButton(page, page.locator("#abstract-mode-list .map-mode-button").nth(index), expectedCopies[index]);
      assert.equal(await page.locator("#map-mode-preview-copy").textContent(), expectedCopies[index], `${viewport.name}: LIGHT ${index + 1} copy`);
      assert.equal(await page.locator("#map-mode-preview-number").textContent(), `${String(index + 1).padStart(2, "0")} / ${expectedCodes[index]}`);
    }
    assert.match(await page.locator("#map-mode-preview").textContent(), /08 \/ ENERGY\s+エネルギーの声/u);
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
      anchorRect: document.activeElement?.matches?.(".map-mode-button")
        ? document.activeElement.getBoundingClientRect().toJSON()
        : null,
      display: getComputedStyle(node).display,
      visibility: getComputedStyle(node).visibility,
      opacity: getComputedStyle(node).opacity,
      position: getComputedStyle(node).position,
      numberSize: parseFloat(getComputedStyle(node.querySelector("span")).fontSize),
      titleSize: parseFloat(getComputedStyle(node.querySelector("b")).fontSize),
      copySize: parseFloat(getComputedStyle(node.querySelector("p")).fontSize),
      bankOverflow: node.closest(".map-mode-bank") ? getComputedStyle(node.closest(".map-mode-bank")).overflow : "detached-for-desktop",
      insideLightOverlay: Boolean(node.closest("#map-light-overlay")),
    }));
    assert.equal(await page.locator("#map-mode-preview").isVisible(), true, `${viewport.name}: focus preview is hidden: ${JSON.stringify(previewScan)}`);
    assert.ok(previewScan.rect.top >= -1 && previewScan.rect.bottom <= viewport.height + 1, `${viewport.name}: preview leaves the viewport: ${JSON.stringify(previewScan.rect)}`);
    assert.ok(previewScan.numberSize >= 10 && previewScan.titleSize >= 15 && previewScan.copySize >= 13, `${viewport.name}: preview type is too small: ${JSON.stringify(previewScan)}`);
    if (viewport.name === "pc" && !previewScan.insideLightOverlay) {
      const horizontalGap = previewScan.rect.left >= previewScan.anchorRect.right
        ? previewScan.rect.left - previewScan.anchorRect.right
        : previewScan.anchorRect.left - previewScan.rect.right;
      assert.ok(horizontalGap >= 0 && horizontalGap <= 12, `${viewport.name}: preview is too far from its button: ${JSON.stringify(previewScan)}`);
    }

    if (tooltipOnly) {
      const screenshot = path.join(outputDir, `${viewport.name}-tooltip.png`);
      await page.screenshot({ path: screenshot, fullPage: false });
      report.scans.push({ viewport, screenshot, preview: previewScan, ...scan });
      await context.close();
      continue;
    }

    await page.locator("#map-light-overlay-close").click();
    await page.waitForFunction(() => document.querySelector("#map-light-overlay")?.hidden === true);
    if (viewport.name === "mobile") await page.locator("#map-mobile-bank-toggle").click();

    for (const [index, copy] of expectedLiveCopies.entries()) {
      await focusModeButton(page, page.locator("#japan-mode-list .map-mode-button[data-live-exhibit]").nth(index), copy);
      assert.equal(await page.locator("#map-mode-preview-copy").textContent(), copy, `${viewport.name}: LIVE ${index + 9} copy`);
    }

    await page.locator("#map-light-overlay-open").click();
    await page.locator("#abstract-mode-list .map-mode-button").nth(2).click();
    await page.waitForFunction(() => document.querySelector(".map-mode-bank")?.dataset.mapSurface === "light"
      && document.querySelector("#japan-layer")?.classList.contains("is-abstract-exhibit")
      && document.querySelector("#japan-map")?.getClientRects().length > 0
      && document.querySelector("#gaia-canvas")?.parentElement?.id === "japan-layer"
      && getComputedStyle(document.querySelector("#gaia-canvas")).pointerEvents === "none");
    if (viewport.name === "mobile") {
      await page.locator("#map-mobile-bank-toggle").click();
      await page.waitForFunction(() => document.querySelector("#japan-layer")?.classList.contains("is-mobile-bank-expanded"));
    }
    await page.locator("#japan-mode-list .map-mode-button:not([data-live-exhibit])").nth(1).click();
    await page.waitForTimeout(180);
    const independenceScan = await page.evaluate(() => ({
      surface: document.querySelector(".map-mode-bank")?.dataset.mapSurface,
      overlayActive: document.querySelector("#japan-layer")?.classList.contains("is-abstract-exhibit"),
      currentMap: document.querySelector("#japan-mode-list .map-mode-button[aria-current='true']")?.textContent.trim(),
      currentLight: document.querySelector("#abstract-mode-list .map-mode-button[aria-current='true']")?.textContent.trim(),
      mapVisible: document.querySelector("#japan-map")?.getClientRects().length > 0,
      canvasParent: document.querySelector("#gaia-canvas")?.parentElement?.id,
    }));
    assert.deepEqual(independenceScan, {
      surface: "light",
      overlayActive: true,
      currentMap: "02",
      currentLight: "03",
      mapVisible: true,
      canvasParent: "japan-layer",
    }, `${viewport.name}: MAP and LIGHT selections are not independent`);

    await page.locator("#map-light-overlay-open").click();
    await focusModeButton(page, page.locator("#abstract-mode-list .map-mode-button").nth(2), expectedCopies[2]);

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
