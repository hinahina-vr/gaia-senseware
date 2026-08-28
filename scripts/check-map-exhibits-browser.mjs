import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const [moduleRoot, executablePath, outputArgument, baseUrl = "http://127.0.0.1:4198"] = process.argv.slice(2);
const recyclingOnly = process.argv.slice(6).includes("--recycling-only");
const panOnly = process.argv.slice(6).includes("--pan-only");
const legendOnly = process.argv.slice(6).includes("--legend-only");
if (!moduleRoot || !executablePath) throw new Error("Playwright module and browser executable are required");
const playwrightEntry = fs.existsSync(path.join(moduleRoot, "index.mjs"))
  ? path.join(moduleRoot, "index.mjs")
  : path.join(moduleRoot, "playwright", "index.mjs");
const { chromium } = await import(pathToFileURL(playwrightEntry).href);
const outputDir = path.resolve(outputArgument || "artifacts/map-exhibits-10");
fs.mkdirSync(outputDir, { recursive: true });

const viewports = [
  { name: "pc", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 },
];
const report = { status: "running", baseUrl, consoleErrors: [], pageErrors: [], responses404: [], scans: [] };
const browser = await chromium.launch({
  headless: true,
  executablePath,
  args: [
    "--enable-webgl",
    "--ignore-gpu-blocklist",
    "--disable-background-timer-throttling",
    "--disable-backgrounding-occluded-windows",
    "--disable-renderer-backgrounding",
  ],
});

const readMapState = (page) => page.evaluate(() => {
  const overlay = document.querySelector("#japan-overlay");
  const rect = document.querySelector("#japan-map")?.getBoundingClientRect();
  return {
    zoom: Number(overlay?.dataset.earthZoom),
    offsetX: Number(overlay?.dataset.earthOffsetX),
    offsetY: Number(overlay?.dataset.earthOffsetY),
    japanX: Number(overlay?.dataset.japanScreenX),
    japanY: Number(overlay?.dataset.japanScreenY),
    animation: overlay?.dataset.viewAnimation || "",
    target: overlay?.dataset.viewTarget || "",
    vectorCopies: overlay?.dataset.vectorWorldCopies || "",
    rasterCopies: overlay?.dataset.rasterWorldCopies || "",
    gosatAnchorX: Number(overlay?.dataset.gosatAnchorScreenX),
    gosatAnchorY: Number(overlay?.dataset.gosatAnchorScreenY),
    gosatProjectionKey: overlay?.dataset.gosatProjectionKey || "",
    forestMask: overlay?.dataset.forestMask || "",
    rect: rect?.toJSON(),
  };
});

const sampleZoom = async (page, count = 9, interval = 150) => {
  const samples = [];
  for (let index = 0; index < count; index += 1) {
    samples.push(await readMapState(page));
    await page.waitForTimeout(interval);
  }
  return samples;
};

const selectMode = async (page, index, expectedTitle) => {
  const mobileBankToggle = page.locator("#map-mobile-bank-toggle");
  if (await mobileBankToggle.count()
    && await mobileBankToggle.isVisible()
    && await mobileBankToggle.getAttribute("aria-expanded") !== "true") {
    await mobileBankToggle.click();
  }
  await page.locator("#japan-mode-list .map-mode-button").nth(index).click({ force: true });
  await page.waitForFunction(
    ({ number, title }) => document.querySelector("#japan-mode-number")?.textContent === number
      && document.querySelector("#japan-mode-title")?.textContent === title
      && document.querySelector("#japan-title")?.textContent === title,
    { number: String(index + 1).padStart(2, "0"), title: expectedTitle },
  );
  const observed = await page.evaluate(() => ({
    number: document.querySelector("#japan-mode-number")?.textContent || "",
    title: document.querySelector("#japan-mode-title")?.textContent || "",
    current: Array.from(document.querySelectorAll("#japan-mode-list .map-mode-button"))
      .findIndex((button) => button.getAttribute("aria-current") === "true"),
  }));
  assert.deepEqual(
    observed,
    { number: String(index + 1).padStart(2, "0"), title: expectedTitle, current: index },
    `mode ${index + 1} did not respond to a real button click`,
  );
};

const findClickableDataPoint = async (page, modeId) => page.evaluate(async (requestedModeId) => {
  const snapshot = await fetch("./data/gaia-signals.json").then((response) => response.json());
  const mode = snapshot.modes.find((entry) => entry.id === requestedModeId);
  const rows = requestedModeId === "blue-circulation"
    ? mode?.signals?.currents
    : requestedModeId === "forest-cloud-engine"
      ? mode?.signals?.precipitation
      : mode?.signals?.countryWaste;
  const map = document.querySelector("#japan-map");
  const overlay = document.querySelector("#japan-overlay");
  const rect = map.getBoundingClientRect();
  const zoom = Number(overlay.dataset.earthZoom);
  const offsetX = Number(overlay.dataset.earthOffsetX);
  const offsetY = Number(overlay.dataset.earthOffsetY);
  const baseScale = Math.max(rect.width / 360, rect.height / 180);
  const scale = baseScale * zoom;
  const width = 360 * scale;
  const height = 180 * scale;
  const originX = (rect.width - width) / 2 + offsetX;
  const originY = (rect.height - height) / 2 + offsetY;
  const wrap = (longitude) => ((longitude - 138 + 540) % 360) - 180;
  for (const [index, row] of (rows || []).entries()) {
    const x = originX + (wrap(row.lon) + 180) * scale;
    const y = originY + (90 - row.lat) * scale;
    const clientX = rect.left + x;
    const clientY = rect.top + y;
    if (x < 28 || x > rect.width - 28 || y < 28 || y > rect.height - 28) continue;
    const hit = document.elementFromPoint(clientX, clientY);
    if (hit?.closest?.("#japan-map")) return { index, clientX, clientY, row };
  }
  return null;
}, modeId);

const clickDataPoint = async (page, modeId) => {
  const point = await findClickableDataPoint(page, modeId);
  assert(point, `${modeId}: no uncovered data point is clickable`);
  await page.mouse.click(point.clientX, point.clientY);
  await page.waitForFunction(() => document.querySelector("#japan-poi-card")?.getAttribute("aria-hidden") === "false");
  return {
    point,
    card: await page.evaluate(() => ({
      title: document.querySelector("#japan-poi-title")?.textContent || "",
      meta: document.querySelector("#japan-poi-meta")?.textContent || "",
      description: document.querySelector("#japan-poi-description")?.textContent || "",
      relation: document.querySelector("#japan-poi-relation")?.textContent || "",
    })),
  };
};

const closeDataCard = async (page) => {
  await page.locator("#japan-poi-close").click();
  await page.waitForFunction(() => document.querySelector("#japan-poi-card")?.getAttribute("aria-hidden") === "true");
};

const boot = async (viewport) => {
  const context = await browser.newContext({ viewport, colorScheme: "dark", reducedMotion: "no-preference" });
  const page = await context.newPage();
  const label = viewport.name;
  page.on("console", (message) => {
    if (message.type() === "error") report.consoleErrors.push(`${label}: ${message.text()}`);
  });
  page.on("pageerror", (error) => report.pageErrors.push(`${label}: ${error.message}`));
  page.on("response", (response) => {
    if (response.status() === 404) report.responses404.push(`${label}: ${response.url()}`);
  });
  await page.goto(new URL("/?mode=1", baseUrl).href, { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => typeof window.GaiaModeLoader?.load === "function");
  await page.evaluate(() => window.GaiaModeLoader.load("exploration"));
  await page.waitForFunction(() => window.GaiaAppContent?.modes?.length === 8);
  await page.waitForFunction(() => document.querySelectorAll("#mode-list .mode-button").length === 8);
  await page.waitForFunction(() => document.documentElement.dataset.gaiaAppReady === "true");
  assert.equal(await page.locator("#intro-mode-list .intro-mode-choice").count(), 8);
  assert.equal(await page.locator("#intro-mode-list .intro-mode-choice").last().locator("span").nth(1).innerText(), "08");
  await page.evaluate(() => {
    document.body.classList.remove("gaia-opening-active");
    for (const selector of ["#gaia-opening", "#intro-layer", "#novel-layer", "#true-end-layer"]) {
      const layer = document.querySelector(selector);
      if (!layer) continue;
      layer.hidden = true;
      layer.inert = true;
      layer.setAttribute("aria-hidden", "true");
    }
    document.querySelector(".experience")?.classList.remove("intro-open");
  });
  await page.locator("#japan-button").click({ force: true });
  await page.waitForFunction(() => document.querySelector("#japan-layer")?.getAttribute("aria-hidden") === "false");
  await page.waitForFunction(() => document.querySelector("#scene-transition")?.hidden
    && !document.body.classList.contains("scene-transitioning"));
  await page.evaluate(() => window.dispatchEvent(new CustomEvent("gaia:opening-complete")));
  await page.waitForFunction(() => Number(document.querySelector("#japan-overlay")?.dataset.earthZoom) >= 1);
  assert.equal(await page.locator("#japan-mode-list .map-mode-button:not([data-live-exhibit])").count(), 8);
  assert.equal(await page.locator("#concept-mode-list .concept-mode-button").count(), 8);
  assert.equal(await page.locator("#error-panel").isHidden(), true);
  return { context, page };
};

try {
  for (const viewport of viewports) {
    const { context, page } = await boot(viewport);
    const scan = { viewport, clicks: {}, screenshots: [], zoom: {} };

    if (recyclingOnly) {
      await selectMode(page, 3, "再資源化率を比べる");
      const slider = page.locator("#japan-layer [data-signal-time]").first();
      const initial = await page.locator("#japan-overlay").evaluate((element) => ({
        current: Number(element.dataset.recyclingSelectedRate),
        target: Number(element.dataset.recyclingScenarioRate),
        increase: Number(element.dataset.recyclingScenarioIncrease),
      }));
      assert.equal(initial.target, initial.current, `${viewport.name}: initial target is below or above the current baseline`);
      assert.equal(initial.increase, 0, `${viewport.name}: initial target should start at +0 points`);
      assert.match(await page.locator("#map-guide-action").textContent(), /自分で決める改善目標.*予測や公的目標ではありません/u);
      assert.doesNotMatch(await page.locator("#japan-layer").innerText(), /もしも/u);
      assert.match(await page.locator("#japan-layer [data-signal-time-label]").first().textContent(), /自分の改善目標/u);
      await slider.press("End");
      await page.waitForFunction(() => Number(document.querySelector("#japan-overlay")?.dataset.recyclingScenarioRate) === 100);
      const targetText = await page.locator("#japan-layer [data-signal-value]").first().innerText();
      assert.match(targetText, /自分の目標 100\.0%/u);
      const settledPosition = Number(await slider.inputValue());
      await page.waitForTimeout(2_000);
      assert.equal(Number(await slider.inputValue()), settledPosition, `${viewport.name}: manual target resumed automatic motion`);
      const screenshot = path.join(outputDir, `${viewport.name}-04-recycling-target-clear.png`);
      await page.screenshot({ path: screenshot });
      scan.screenshots.push(screenshot);
      scan.recyclingTarget = { initial, target: 100, manual: true };
      report.scans.push(scan);
      await context.close();
      console.log(`PASS ${viewport.name}`);
      continue;
    }

    if (legendOnly) {
      await selectMode(page, 2, "森林と降水量を重ねる");
      const mobileLegendToggle = page.locator("#map-mobile-legend-toggle");
      if (await mobileLegendToggle.isVisible()) {
        await mobileLegendToggle.click();
        await page.waitForFunction(() => document.querySelector("#japan-layer")?.classList.contains("is-mobile-legend-expanded"));
      }
      await page.waitForFunction(() => {
        const title = document.querySelector("[data-signal-encoding-legend-title]");
        const legend = document.querySelector("[data-signal-encoding-legend]");
        const overlay = document.querySelector("#japan-overlay");
        return title?.getClientRects().length > 0
          && legend?.getClientRects().length > 0
          && overlay?.dataset.forestMask === "ready";
      });
      const legend = await page.evaluate(() => ({
        title: document.querySelector("[data-signal-encoding-legend-title]")?.textContent.trim() || "",
        body: document.querySelector("[data-signal-encoding-legend]")?.textContent.replace(/\s+/gu, " ").trim() || "",
      }));
      assert.match(legend.title, /凡例\s*MAP LEGEND/u);
      assert.match(legend.body, /大きな水色円\s*\/\s*降水量/u);
      assert.match(legend.body, /緑の面\s*\/\s*森林域/u);
      const screenshot = path.join(outputDir, `${viewport.name}-forest-map-legend.png`);
      await page.screenshot({ path: screenshot, animations: "disabled" });
      scan.screenshots.push(screenshot);
      scan.legend = legend;
      report.scans.push(scan);
      await context.close();
      console.log(`PASS ${viewport.name}`);
      continue;
    }

    if (panOnly) {
      await page.evaluate(() => globalThis.GaiaModeLoader.load("tour"));
      await page.waitForFunction(() => typeof globalThis.GaiaGuidedTour?.start === "function");
      await page.evaluate(() => globalThis.GaiaGuidedTour.start({ source: "map-pan-regression" }));
      await page.waitForFunction(() => globalThis.GaiaGuidedTour.getState().active
        && globalThis.GaiaGuidedTour.getState().stepId === "map"
        && document.querySelector("#japan-layer")?.getAttribute("aria-hidden") === "false");
      if (await page.evaluate(() => globalThis.GaiaGuidedTour.getState().running)) {
        await page.locator("#gaia-guided-tour [data-tour-action='toggle']").click({ force: true });
      }
      await page.waitForFunction(() => globalThis.GaiaGuidedTour.getState().running === false);
    }

    await page.waitForFunction(() => {
      const overlay = document.querySelector("#japan-overlay");
      return overlay?.dataset.viewAnimation === "idle"
        && Number.isFinite(Number(overlay.dataset.gosatAnchorScreenX))
        && Number.isFinite(Number(overlay.dataset.gosatAnchorScreenY));
    });
    const panBefore = await readMapState(page);
    const dragTarget = await page.evaluate(() => {
      const map = document.querySelector("#japan-map");
      const rect = map?.getBoundingClientRect();
      if (!map || !rect) return null;
      for (let yOffset = 8; yOffset <= rect.height - 8; yOffset += 16) {
        for (let xOffset = 8; xOffset <= rect.width - 112; xOffset += 16) {
          const x = rect.left + xOffset;
          const y = rect.top + yOffset;
          if (document.elementFromPoint(x, y)?.closest?.("#japan-map")) return { x, y };
        }
      }
      return null;
    });
    assert(dragTarget, `${viewport.name}: no real map drag target was available`);
    await page.mouse.move(dragTarget.x, dragTarget.y);
    await page.mouse.down();
    await page.mouse.move(dragTarget.x + 96, dragTarget.y + 34, { steps: 8 });
    await page.mouse.up();
    await page.waitForFunction(
      (previousKey) => {
        const overlay = document.querySelector("#japan-overlay");
        return overlay?.dataset.gosatProjectionKey !== previousKey
          && Math.abs(Number(overlay.dataset.gosatAnchorScreenX) - Number(overlay.dataset.japanScreenX)) <= 0.1
          && Math.abs(Number(overlay.dataset.gosatAnchorScreenY) - Number(overlay.dataset.japanScreenY)) <= 0.1;
      },
      panBefore.gosatProjectionKey,
    );
    const panAfter = await readMapState(page);
    const coastlineDelta = {
      x: panAfter.japanX - panBefore.japanX,
      y: panAfter.japanY - panBefore.japanY,
    };
    const gosatDelta = {
      x: panAfter.gosatAnchorX - panBefore.gosatAnchorX,
      y: panAfter.gosatAnchorY - panBefore.gosatAnchorY,
    };
    assert(Math.abs(coastlineDelta.x) >= 40, `${viewport.name}: map did not move far enough to verify alignment`);
    assert(Math.abs(gosatDelta.x - coastlineDelta.x) <= 0.75, `${viewport.name}: GOSAT data did not follow horizontal map movement`);
    assert(Math.abs(gosatDelta.y - coastlineDelta.y) <= 0.75, `${viewport.name}: GOSAT data did not follow vertical map movement`);
    const panScreenshot = path.join(outputDir, `${viewport.name}-01-gosat-pan-aligned.png`);
    await page.screenshot({ path: panScreenshot });
    scan.screenshots.push(panScreenshot);
    scan.gosatPan = { before: panBefore, after: panAfter, coastlineDelta, gosatDelta };
    if (panOnly) {
      const zoomBefore = await readMapState(page);
      await page.locator("#japan-map").dispatchEvent("wheel", {
        bubbles: true,
        cancelable: true,
        clientX: zoomBefore.rect.left + zoomBefore.rect.width * 0.72,
        clientY: zoomBefore.rect.top + zoomBefore.rect.height * 0.44,
        deltaY: -180,
      });
      await page.waitForFunction((previousKey) => {
        const overlay = document.querySelector("#japan-overlay");
        return overlay?.dataset.gosatProjectionKey !== previousKey
          && Math.abs(Number(overlay.dataset.gosatAnchorScreenX) - Number(overlay.dataset.japanScreenX)) <= 0.1
          && Math.abs(Number(overlay.dataset.gosatAnchorScreenY) - Number(overlay.dataset.japanScreenY)) <= 0.1;
      }, zoomBefore.gosatProjectionKey);
      const zoomAfter = await readMapState(page);
      assert(zoomAfter.zoom > zoomBefore.zoom + 0.1, `${viewport.name}: wheel did not zoom the map`);
      assert(Math.abs(zoomAfter.gosatAnchorX - zoomAfter.japanX) <= 0.1, `${viewport.name}: GOSAT data separated from the coastline after zoom`);
      assert(Math.abs(zoomAfter.gosatAnchorY - zoomAfter.japanY) <= 0.1, `${viewport.name}: GOSAT data separated vertically after zoom`);
      const zoomScreenshot = path.join(outputDir, `${viewport.name}-01-gosat-zoom-aligned.png`);
      await page.screenshot({ path: zoomScreenshot });
      scan.screenshots.push(zoomScreenshot);
      scan.gosatZoom = { before: zoomBefore, after: zoomAfter };

      const resizeBefore = await readMapState(page);
      await page.setViewportSize({ width: viewport.width + 16, height: viewport.height + 12 });
      await page.waitForFunction((previousKey) => {
        const overlay = document.querySelector("#japan-overlay");
        return overlay?.dataset.gosatProjectionKey !== previousKey
          && Math.abs(Number(overlay.dataset.gosatAnchorScreenX) - Number(overlay.dataset.japanScreenX)) <= 0.1
          && Math.abs(Number(overlay.dataset.gosatAnchorScreenY) - Number(overlay.dataset.japanScreenY)) <= 0.1;
      }, resizeBefore.gosatProjectionKey);
      const resizeAfter = await readMapState(page);
      scan.gosatResize = { before: resizeBefore, after: resizeAfter };
      report.scans.push(scan);
      await context.close();
      console.log(`PASS ${viewport.name}`);
      continue;
    }
    await page.locator("#japan-map").focus();
    await page.locator("#japan-map").press("0");
    await page.waitForFunction(() => {
      const overlay = document.querySelector("#japan-overlay");
      return Math.abs(Number(overlay?.dataset.earthOffsetX)) < 0.01
        && Math.abs(Number(overlay?.dataset.earthOffsetY)) < 0.01;
    });

    await selectMode(page, 1, "海流が14日続いたら");
    const zoomIn = await sampleZoom(page);
    await page.waitForFunction(() => document.querySelector("#japan-overlay")?.dataset.viewAnimation === "idle");
    const finalJapan = await readMapState(page);
    assert(zoomIn.filter((sample) => Number.isFinite(sample.zoom)).length === zoomIn.length);
    assert(
      new Set(zoomIn.map((sample) => sample.zoom.toFixed(3))).size >= 4,
      `${viewport.name}: zoom did not animate smoothly (${JSON.stringify(zoomIn.map(({ zoom, animation, target }) => ({ zoom, animation, target })))})`,
    );
    assert(zoomIn.every((sample, index) => index === 0 || sample.zoom + 0.01 >= zoomIn[index - 1].zoom), `${viewport.name}: zoom-in is not monotonic`);
    assert(finalJapan.zoom >= (viewport.name === "mobile" ? 2.65 : 2.95));
    assert(Math.abs(finalJapan.japanX - finalJapan.rect.width * (viewport.name === "mobile" ? 0.5 : 0.68)) <= 24);
    assert(Math.abs(finalJapan.japanY - finalJapan.rect.height * 0.48) <= 24);
    const zoomScreenshot = path.join(outputDir, `${viewport.name}-02-japan-zoom.png`);
    await page.screenshot({ path: zoomScreenshot });
    scan.screenshots.push(zoomScreenshot);

    await page.waitForFunction(() => !document.querySelector("#japan-layer [data-signal-value]")?.textContent?.includes("LOADING"));
    const circulationUi = await page.evaluate(() => ({
      title: document.querySelector("#japan-mode-title")?.textContent || "",
      guideTitle: document.querySelector("#map-guide-title")?.textContent || "",
      guideSubject: document.querySelector("#map-guide-subject")?.textContent || "",
      guideReading: document.querySelector("#map-guide-reading")?.textContent || "",
      guideAction: document.querySelector("#map-guide-action")?.textContent || "",
      signalValue: document.querySelector("#japan-layer [data-signal-value]")?.textContent || "",
      signalNote: document.querySelector("#japan-layer [data-signal-note]")?.textContent || "",
      sliderLabel: document.querySelector("#japan-layer [data-signal-time-label]")?.textContent || "",
      legend: document.querySelector("#japan-layer [data-signal-encoding-legend]")?.textContent || "",
    }));
    assert.equal(circulationUi.title, "海流が14日続いたら");
    assert.equal(circulationUi.guideTitle, "この海流は、14日でどこまで進む？");
    assert.match(circulationUi.guideSubject, /色付きの矢印が海流/u);
    assert.match(circulationUi.guideReading, /白い矢印.*計算には使いません/u);
    assert.match(circulationUi.guideAction, /スライダー/u);
    assert.match(circulationUi.signalValue, /海流.*地点/u);
    assert.match(circulationUi.signalNote, /白い矢印.*計算に使いません/u);
    assert.match(circulationUi.sliderLabel, /経過日数/u);
    assert.match(circulationUi.legend, /色付き矢印\s*\/\s*海流/u);
    assert.match(circulationUi.legend, /白い矢印\s*\/\s*風（比較用）/u);
    assert.match(circulationUi.legend, /距離計算には未使用/u);
    await page.locator("#map-reading-guide").evaluate((element) => { element.open = false; });
    scan.clicks.circulation = await clickDataPoint(page, "blue-circulation");
    assert.equal(scan.clicks.circulation.card.title, "この地点の海流が続いたら");
    assert.match(scan.clicks.circulation.card.meta, /海流 \d+\.\d+ m\/s \/ (北|北東|東|南東|南|南西|西|北西)方向/u);
    assert.match(scan.clicks.circulation.card.description, /日後の計算です。.*開始点から約.* km先/u);
    assert.match(scan.clicks.circulation.card.relation, /白い矢印.*距離計算には使っていません/u);
    const circulationScreenshot = path.join(outputDir, `${viewport.name}-02-current-distance.png`);
    await page.screenshot({ path: circulationScreenshot });
    scan.screenshots.push(circulationScreenshot);
    await closeDataCard(page);

    await selectMode(page, 0, "地球の一呼吸");
    await page.waitForFunction(() => document.querySelector("#japan-overlay")?.dataset.viewAnimation === "idle");
    await selectMode(page, 1, "海流が14日続いたら");
    await page.waitForFunction(() => document.querySelector("#japan-overlay")?.dataset.viewAnimation === "running");
    const mapBox = await page.locator("#japan-map").boundingBox();
    await page.locator("#japan-map").dispatchEvent("wheel", {
      bubbles: true,
      cancelable: true,
      clientX: mapBox.x + mapBox.width * 0.86,
      clientY: mapBox.y + mapBox.height * 0.34,
      deltaY: -120,
    });
    const cancelled = await readMapState(page);
    await page.waitForTimeout(900);
    const afterCancel = await readMapState(page);
    assert.equal(cancelled.animation, "user-wheel");
    assert(Math.abs(afterCancel.zoom - cancelled.zoom) < 0.08, `${viewport.name}: cancelled zoom kept running`);
    scan.zoom = { zoomIn, cancelled, afterCancel };

    await selectMode(page, 1, "海流が14日続いたら");
    await page.waitForFunction(() => document.querySelector("#japan-overlay")?.dataset.viewAnimation === "idle");
    await selectMode(page, 2, "森林と降水量を重ねる");
    const zoomOut = await sampleZoom(page);
    await page.waitForFunction(() => document.querySelector("#japan-overlay")?.dataset.viewAnimation === "idle");
    const worldView = await readMapState(page);
    assert(
      new Set(zoomOut.map((sample) => sample.zoom.toFixed(3))).size >= 3,
      `${viewport.name}: world return did not animate (${JSON.stringify(zoomOut.map(({ zoom, animation, target }) => ({ zoom, animation, target })))})`,
    );
    assert(zoomOut.every((sample, index) => index === 0 || sample.zoom <= zoomOut[index - 1].zoom + 0.01), `${viewport.name}: world return is not monotonic`);
    assert(worldView.zoom <= 1.03, `${viewport.name}: world view did not return (${worldView.zoom})`);
    try {
      await page.waitForFunction(() => {
        const overlay = document.querySelector("#japan-overlay");
        const vectorCopies = (overlay?.dataset.vectorWorldCopies || "").split(",").map(Number);
        const rasterCopies = (overlay?.dataset.rasterWorldCopies || "").split(",").map(Number);
        return overlay?.dataset.forestMask === "ready"
          && vectorCopies.length === rasterCopies.length
          && vectorCopies.length > 0
          && vectorCopies.every((value, index) => Number.isFinite(value)
            && Number.isFinite(rasterCopies[index])
            && Math.abs(value - rasterCopies[index]) <= 0.25);
      });
    } catch (error) {
      const stalledAlignment = await readMapState(page);
      throw new Error(`${viewport.name}: forest/vector/raster alignment timed out (${JSON.stringify(stalledAlignment)})`, { cause: error });
    }
    const alignment = await readMapState(page);
    const vectorCopies = alignment.vectorCopies.split(",").map(Number);
    const rasterCopies = alignment.rasterCopies.split(",").map(Number);
    assert.equal(vectorCopies.length, rasterCopies.length);
    assert(vectorCopies.every((value, index) => Math.abs(value - rasterCopies[index]) <= 0.25));
    const mobileLegendToggle = page.locator("#map-mobile-legend-toggle");
    const openedMobileLegend = await mobileLegendToggle.count()
      && await mobileLegendToggle.isVisible()
      && await mobileLegendToggle.getAttribute("aria-expanded") !== "true";
    if (openedMobileLegend) await mobileLegendToggle.click();
    const forestUi = await page.evaluate(() => ({
      guideTitle: document.querySelector("#map-guide-title")?.textContent || "",
      guideSubject: document.querySelector("#map-guide-subject")?.textContent || "",
      guideReading: document.querySelector("#map-guide-reading")?.textContent || "",
      guideAction: document.querySelector("#map-guide-action")?.textContent || "",
      signalValue: document.querySelector("#japan-layer [data-signal-value]")?.textContent || "",
      legendTitle: document.querySelector("#japan-layer [data-signal-encoding-legend-title]")?.textContent || "",
      legendTitleVisible: document.querySelector("#japan-layer [data-signal-encoding-legend-title]")?.getClientRects().length > 0,
      legend: document.querySelector("#japan-layer [data-signal-encoding-legend]")?.textContent || "",
      circleRange: document.querySelector("#japan-overlay")?.dataset.forestRainCircleRange || "",
      brazilRain: document.querySelector("#japan-overlay")?.dataset.forestRainBrazil || "",
    }));
    assert.equal(forestUi.guideTitle, "森林と、雨の多い場所はどこで重なる？");
    assert.match(forestUi.guideSubject, /31代表地点.*相関係数/u);
    assert.match(forestUi.guideReading, /大きな水色円.*ブラジルのアマゾン付近は5\.33 mm\/day/u);
    assert.match(forestUi.guideAction, /円のない場所.*雨がない.*ではなく/u);
    assert.match(forestUi.signalValue, /降水量.*mm\/day/u);
    assert.equal(forestUi.legendTitleVisible, true);
    assert.match(forestUi.legendTitle, /凡例\s*MAP LEGEND/u);
    assert.match(forestUi.legend, /大きな水色円\s*\/\s*降水量/u);
    assert.match(forestUi.legend, /相関係数ではない/u);
    assert.equal(forestUi.circleRange, "10-54px radius");
    assert.equal(forestUi.brazilRain, "5.33 mm/day");
    if (openedMobileLegend) await mobileLegendToggle.click();
    await page.locator("#map-reading-guide").evaluate((element) => { element.open = false; });
    scan.clicks.forest = await clickDataPoint(page, "forest-cloud-engine");
    assert.match(scan.clicks.forest.card.title, new RegExp(scan.clicks.forest.point.row.name, "u"));
    assert.match(scan.clicks.forest.card.meta, /mm\/day/u);
    assert.match(scan.clicks.forest.card.description, /大きな水色円の直径/u);
    assert.match(scan.clicks.forest.card.relation, /円のない場所にも雨.*相関係数/u);
    const forestScreenshot = path.join(outputDir, `${viewport.name}-03-forest-rain.png`);
    await page.screenshot({ path: forestScreenshot });
    scan.screenshots.push(forestScreenshot);
    await closeDataCard(page);

    await selectMode(page, 3, "再資源化率を比べる");
    await page.waitForFunction(() => document.querySelector("#japan-overlay")?.dataset.recyclingEncoding === "fixed-diameter-pie");
    const recyclingEncoding = await page.locator("#japan-overlay").evaluate((element) => ({
      encoding: element.dataset.recyclingEncoding,
      pieCount: Number(element.dataset.recyclingPieCount),
      officialCount: Number(element.dataset.recyclingOfficialCount),
      imputedCount: Number(element.dataset.recyclingImputedCount),
      selectedRate: Number(element.dataset.recyclingSelectedRate),
      targetRate: Number(element.dataset.recyclingScenarioRate),
      targetIncrease: Number(element.dataset.recyclingScenarioIncrease),
    }));
    assert.deepEqual(recyclingEncoding, {
      encoding: "fixed-diameter-pie",
      pieCount: 31,
      officialCount: 17,
      imputedCount: 14,
      selectedRate: 19.6,
      targetRate: 19.6,
      targetIncrease: 0,
    });
    const recyclingGuide = await page.locator("#map-guide-reading").textContent();
    assert.match(recyclingGuide, /緑の扇形.*橙/u);
    scan.clicks.waste = await clickDataPoint(page, "nothing-is-waste");
    assert.match(scan.clicks.waste.card.title, new RegExp(scan.clicks.waste.point.row.country, "u"));
    assert.match(scan.clicks.waste.card.description, /円グラフ.*緑.*橙/u);
    const selectedCurrentRate = Number(scan.clicks.waste.point.row.recyclePercent.toFixed(1));
    await page.waitForFunction(
      (expectedRate) => Number(document.querySelector("#japan-overlay")?.dataset.recyclingSelectedRate) === expectedRate,
      selectedCurrentRate,
    );
    await closeDataCard(page);
    const beforeScenario = await page.locator("#japan-layer [data-signal-value]").first().innerText();
    const slider = page.locator("#japan-layer [data-signal-time]").first();
    await slider.focus();
    await slider.press("End");
    await page.waitForFunction(() => {
      const overlay = document.querySelector("#japan-overlay");
      return Number(overlay?.dataset.recyclingScenarioRate) > Number(overlay?.dataset.recyclingSelectedRate);
    });
    const afterScenario = await page.locator("#japan-layer [data-signal-value]").first().innerText();
    assert.notEqual(afterScenario, beforeScenario);
    assert.match(afterScenario, /自分の目標 100\.0% \(\+\d+\.\dpt\)/u);
    const scenarioRate = Number(await page.locator("#japan-overlay").getAttribute("data-recycling-scenario-rate"));
    const scenarioIncrease = Number(await page.locator("#japan-overlay").getAttribute("data-recycling-scenario-increase"));
    assert.equal(scenarioRate, 100);
    assert.ok(scenarioRate >= selectedCurrentRate);
    assert.equal(scenarioIncrease, Number((100 - selectedCurrentRate).toFixed(1)));
    assert.match(await slider.getAttribute("aria-valuetext"), /自分の改善目標 100\.0%.*プラス\d+\.\dポイント/u);
    const wasteScreenshot = path.join(outputDir, `${viewport.name}-04-recycling-target.png`);
    await page.screenshot({ path: wasteScreenshot });
    scan.screenshots.push(wasteScreenshot);

    await selectMode(page, 4, "人類世の傷跡");
    await page.waitForFunction(() => document.querySelector("#japan-overlay")?.dataset.nightLightsLayer === "visible");
    const anthropoceneEncoding = await page.locator("#japan-overlay").evaluate((element) => ({
      lightLayer: element.dataset.nightLightsLayer,
      source: element.dataset.nightLightsSource,
      projection: element.dataset.nightLightsProjection,
      display: element.dataset.nightLightsDisplay,
      emissionCount: Number(element.dataset.emissionsCircleCount),
      emissionEncoding: element.dataset.emissionsEncoding,
    }));
    assert.deepEqual(anthropoceneEncoding, {
      lightLayer: "visible",
      source: "NASA-VIIRS-2016",
      projection: "web-mercator-to-geographic",
      display: "glow-plus-radiance-core",
      emissionCount: 31,
      emissionEncoding: "country-total-log-area",
    });
    const anthropoceneGuide = await page.locator("#map-guide-reading").textContent();
    assert.match(anthropoceneGuide, /白い発光.*夜間光画素.*赤い円.*国全体/u);
    const nightLightsScreenshot = path.join(outputDir, `${viewport.name}-05-night-lights-visible.png`);
    await page.screenshot({ path: nightLightsScreenshot });
    scan.screenshots.push(nightLightsScreenshot);

    if (viewport.name === "pc") {
      const mapBox = await page.locator("#japan-map").boundingBox();
      assert.ok(mapBox);
      await page.mouse.move(mapBox.x + mapBox.width * 0.77, mapBox.y + mapBox.height * 0.37);
      await page.mouse.down();
      await page.waitForTimeout(720);
      await page.mouse.up();
      await page.waitForFunction(() => document.querySelector("#japan-overlay")?.dataset.nightLightsLayer === "dimmed");
      const dimmedScreenshot = path.join(outputDir, `${viewport.name}-05-night-lights-dimmed.png`);
      await page.screenshot({ path: dimmedScreenshot });
      scan.screenshots.push(dimmedScreenshot);
    }

    await selectMode(page, 5, "地球からのメッセージ");
    await page.waitForFunction(() => {
      const overlay = document.querySelector("#japan-overlay");
      return overlay?.dataset.earthquakeLayer === "world-year" && overlay.dataset.earthquakeYear === "2000";
    });
    const earthquakeInitial = await page.locator("#japan-overlay").evaluate((element) => ({
      layer: element.dataset.earthquakeLayer,
      year: element.dataset.earthquakeYear,
      eventCount: Number(element.dataset.earthquakeYearEventCount),
      totalCount: Number(element.dataset.earthquakeTotalEventCount),
      sync: element.dataset.earthquakeWaveSync,
      model: element.dataset.earthquakeWaveModel,
      target: element.dataset.viewTarget,
      zoom: Number(element.dataset.earthZoom),
    }));
    assert.deepEqual({
      ...earthquakeInitial,
      totalCount: undefined,
    }, {
      layer: "world-year",
      year: "2000",
      eventCount: 7,
      totalCount: undefined,
      sync: "annual-simultaneous-distance-limited",
      model: "usgs-estimated-felt-radius",
      target: "global",
      zoom: 1,
    });
    assert.ok(earthquakeInitial.totalCount >= 142);
    const earthquakeSlider = page.locator("#japan-layer [data-signal-time]").first();
    await earthquakeSlider.evaluate((element) => {
      element.value = String(((4 + 0.1) / 27) * 100);
      element.dispatchEvent(new Event("input", { bubbles: true }));
    });
    await page.waitForFunction(() => document.querySelector("#japan-overlay")?.dataset.earthquakeYear === "2004");
    const waveStart = Number(await page.locator("#japan-overlay").getAttribute("data-earthquake-wave-progress"));
    await page.waitForTimeout(360);
    const earthquakeWave = await page.locator("#japan-overlay").evaluate((element) => ({
      year: element.dataset.earthquakeYear,
      eventCount: Number(element.dataset.earthquakeYearEventCount),
      progress: Number(element.dataset.earthquakeWaveProgress),
      model: element.dataset.earthquakeWaveModel,
      maxRadiusKm: Number(element.dataset.earthquakeWaveRadiusMaxKm),
      maxRadius: Number(element.dataset.earthquakeWaveRadiusMaxPx),
      maxRadiusX: Number(element.dataset.earthquakeWaveRadiusMaxXPx),
      durationMs: Number(element.dataset.earthquakeWaveDurationMaxMs),
    }));
    assert.equal(earthquakeWave.year, "2004");
    assert.equal(earthquakeWave.eventCount, 3);
    assert.ok(earthquakeWave.progress > waveStart);
    assert.ok(earthquakeWave.progress < 0.08, `earthquake wave expanded too quickly: ${earthquakeWave.progress}`);
    assert.equal(earthquakeWave.model, "usgs-estimated-felt-radius");
    assert.equal(earthquakeWave.maxRadiusKm, 2000);
    assert.equal(earthquakeWave.durationMs, 15000);
    assert.ok(earthquakeWave.maxRadius > 40);
    assert.ok(earthquakeWave.maxRadius < viewport.width * 0.25);
    assert.ok(earthquakeWave.maxRadiusX >= earthquakeWave.maxRadius);
    const earthquakeReadout = await page.locator("#japan-layer [data-signal-value]").first().innerText();
    assert.match(earthquakeReadout, /2004.*3 EVENTS.*MAX M9\.1/u);
    const earthquakeScreenshot = path.join(outputDir, `${viewport.name}-06-yearly-synchronized-waves.png`);
    await page.screenshot({ path: earthquakeScreenshot });
    scan.screenshots.push(earthquakeScreenshot);
    await page.waitForFunction(
      () => Number(document.querySelector("#japan-overlay")?.dataset.earthquakeWaveProgress) >= 0.999,
      null,
      { timeout: 16000 },
    );
    const earthquakeSettledScreenshot = path.join(outputDir, `${viewport.name}-06-estimated-felt-radius-settled.png`);
    await page.screenshot({ path: earthquakeSettledScreenshot });
    scan.screenshots.push(earthquakeSettledScreenshot);

    await selectMode(page, 6, "三つの生態系");
    await page.waitForFunction(() => document.querySelector("#japan-overlay")?.dataset.ecologiesPlot === "paired-country-scatter");
    const ecologySlider = page.locator("#japan-layer [data-signal-time]").first();
    await ecologySlider.evaluate((element) => {
      element.value = "50";
      element.dispatchEvent(new Event("input", { bubbles: true }));
    });
    await page.waitForTimeout(120);
    const ecologyState = await page.locator("#japan-overlay").evaluate((element) => ({
      plot: element.dataset.ecologiesPlot,
      pairCount: Number(element.dataset.ecologiesPairCount),
      correlation: Number(element.dataset.ecologiesCorrelation),
      selectedCountry: element.dataset.ecologiesSelectedCountry,
      cultureCount: Number(element.dataset.ecologiesCultureCount),
    }));
    assert.equal(ecologyState.plot, "paired-country-scatter");
    assert.equal(ecologyState.pairCount, 31);
    assert.ok(ecologyState.correlation > 0.2 && ecologyState.correlation < 0.3);
    assert.ok(ecologyState.selectedCountry);
    assert.equal(ecologyState.cultureCount, 24);
    const ecologyGuide = await page.locator("#map-guide-reading").textContent();
    assert.match(ecologyGuide, /散布図.*回帰線.*相関係数r/u);
    const ecologyReadout = await page.locator("#japan-layer [data-signal-value]").first().innerText();
    assert.match(ecologyReadout, /FOREST.*URBAN/u);
    const ecologyScreenshot = path.join(outputDir, `${viewport.name}-07-forest-urban-correlation.png`);
    await page.screenshot({ path: ecologyScreenshot });
    scan.screenshots.push(ecologyScreenshot);

    await selectMode(page, 7, "人工物の共生化");
    await page.waitForFunction(() => {
      const overlay = document.querySelector("#japan-overlay");
      return overlay?.dataset.countryGeometryState === "ready"
        && Number(overlay.dataset.renewableCountryFillCount) === 31;
    });
    await slider.evaluate((element) => {
      element.value = "50";
      element.dispatchEvent(new Event("input", { bubbles: true }));
    });
    await page.waitForTimeout(120);
    const renewableState = await page.locator("#japan-overlay").evaluate((element) => ({
      fillCount: Number(element.dataset.renewableCountryFillCount),
      scale: element.dataset.renewableFillScale,
      selectedCountry: element.dataset.renewableSelectedCountry,
      selectedPercent: Number(element.dataset.renewableSelectedPercent),
      connectionRemoved: element.dataset.energyConnectionRemoved,
      geometryState: element.dataset.countryGeometryState,
    }));
    assert.equal(renewableState.fillCount, 31);
    assert.equal(renewableState.scale, "country-blue-0-100");
    assert.ok(renewableState.selectedCountry);
    assert.ok(Number.isFinite(renewableState.selectedPercent));
    assert.equal(renewableState.connectionRemoved, "true");
    assert.equal(renewableState.geometryState, "ready");
    const renewableGuide = await page.locator("#map-guide-reading").textContent();
    assert.match(renewableGuide, /暗い青.*明るい水色/u);
    const renewableReadout = await page.locator("#japan-layer [data-signal-value]").first().innerText();
    assert.match(renewableReadout, /再生可能電力.*%/u);
    const renewableScreenshot = path.join(outputDir, `${viewport.name}-08-renewable-country-choropleth.png`);
    await page.screenshot({ path: renewableScreenshot });
    scan.screenshots.push(renewableScreenshot);

    scan.final = await readMapState(page);
    report.scans.push(scan);
    await context.close();
    console.log(`PASS ${viewport.name}`);
  }
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

console.log(JSON.stringify({ status: report.status, scans: report.scans.length }, null, 2));
