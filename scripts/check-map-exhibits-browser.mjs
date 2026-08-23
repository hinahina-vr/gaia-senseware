import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const [moduleRoot, executablePath, outputArgument, baseUrl = "http://127.0.0.1:4198"] = process.argv.slice(2);
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
    "--use-angle=swiftshader",
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
  await page.locator("#japan-mode-list .map-mode-button").nth(index).click({ force: true });
  await page.waitForFunction(
    ({ number, title }) => document.querySelector("#japan-mode-number")?.textContent === number
      && document.querySelector("#japan-mode-title")?.textContent === title,
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
      : requestedModeId === "pollination-protocol"
        ? mode?.signals?.occurrences
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
  await page.locator("#japan-poi-close").click({ force: true });
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
  await page.waitForFunction(() => window.GaiaAppContent?.modes?.length === 10);
  await page.waitForFunction(() => document.querySelectorAll("#mode-list .mode-button").length === 10);
  assert.equal(await page.locator("#intro-mode-list .intro-mode-choice").count(), 10);
  assert.equal(await page.locator("#intro-mode-list .intro-mode-choice").last().locator("span").nth(1).innerText(), "10");
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
  await page.waitForFunction(() => Number(document.querySelector("#japan-overlay")?.dataset.earthZoom) >= 1);
  assert.equal(await page.locator("#japan-mode-list .map-mode-button").count(), 10);
  assert.equal(await page.locator("#concept-mode-list .concept-mode-button").count(), 10);
  assert.equal(await page.locator("#error-panel").isHidden(), true);
  return { context, page };
};

try {
  for (const viewport of viewports) {
    const { context, page } = await boot(viewport);
    const scan = { viewport, clicks: {}, screenshots: [], zoom: {} };

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
    await page.waitForFunction(() => {
      const overlay = document.querySelector("#japan-overlay");
      return overlay?.dataset.forestMask === "ready"
        && overlay.dataset.vectorWorldCopies
        && overlay.dataset.vectorWorldCopies === overlay.dataset.rasterWorldCopies;
    });
    const alignment = await readMapState(page);
    assert.equal(alignment.vectorCopies, alignment.rasterCopies);
    const forestUi = await page.evaluate(() => ({
      guideTitle: document.querySelector("#map-guide-title")?.textContent || "",
      guideSubject: document.querySelector("#map-guide-subject")?.textContent || "",
      guideReading: document.querySelector("#map-guide-reading")?.textContent || "",
      guideAction: document.querySelector("#map-guide-action")?.textContent || "",
      signalValue: document.querySelector("#japan-layer [data-signal-value]")?.textContent || "",
      legend: document.querySelector("#japan-layer [data-signal-encoding-legend]")?.textContent || "",
      circleRange: document.querySelector("#japan-overlay")?.dataset.forestRainCircleRange || "",
      brazilRain: document.querySelector("#japan-overlay")?.dataset.forestRainBrazil || "",
    }));
    assert.equal(forestUi.guideTitle, "森林と、雨の多い場所はどこで重なる？");
    assert.match(forestUi.guideSubject, /31代表地点.*相関係数/u);
    assert.match(forestUi.guideReading, /大きな水色円.*ブラジルのアマゾン付近は5\.33 mm\/day/u);
    assert.match(forestUi.guideAction, /円のない場所.*雨がない.*ではなく/u);
    assert.match(forestUi.signalValue, /降水量.*mm\/day/u);
    assert.match(forestUi.legend, /大きな水色円\s*\/\s*降水量/u);
    assert.match(forestUi.legend, /相関係数ではない/u);
    assert.equal(forestUi.circleRange, "10-54px radius");
    assert.equal(forestUi.brazilRain, "5.33 mm/day");
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

    await selectMode(page, 3, "記録は、生息地図ではない");
    const pollinationGuide = await page.evaluate(() => ({
      title: document.querySelector("#map-guide-title")?.textContent || "",
      subject: document.querySelector("#map-guide-subject")?.textContent || "",
      reading: document.querySelector("#map-guide-reading")?.textContent || "",
      action: document.querySelector("#map-guide-action")?.textContent || "",
    }));
    assert.equal(pollinationGuide.title, "点がない場所に、ミツバチはいないのか？");
    assert.match(pollinationGuide.subject, /生息分布ではなく.*空白/u);
    assert.match(pollinationGuide.reading, /3段階.*最大2件.*地理ではありません/u);
    assert.match(pollinationGuide.action, /スライダー.*花との関係網/u);
    const pollinationSlider = page.locator("#japan-layer [data-signal-time]").first();
    await pollinationSlider.focus();
    await pollinationSlider.press("Home");
    await page.waitForFunction(() => document.querySelector("#japan-overlay")?.dataset.pollinationStage === "records");
    const recordStage = await page.evaluate(() => ({
      value: document.querySelector("#japan-layer [data-signal-value]")?.textContent || "",
      occurrenceCount: document.querySelector("#japan-overlay")?.dataset.pollinationOccurrenceCount || "",
      relationCount: document.querySelector("#japan-overlay")?.dataset.pollinationRelationCount || "",
      sampling: document.querySelector("#japan-overlay")?.dataset.pollinationSampling || "",
    }));
    assert.match(recordStage.value, /62 \/ GBIF観察記録/u);
    assert.deepEqual(recordStage, {
      value: recordStage.value,
      occurrenceCount: "62",
      relationCount: "23",
      sampling: "max-2-per-country",
    });
    await pollinationSlider.evaluate((element) => {
      element.value = "50";
      element.dispatchEvent(new Event("input", { bubbles: true }));
    });
    await page.waitForFunction(() => document.querySelector("#japan-overlay")?.dataset.pollinationStage === "sampling");
    assert.match(await page.locator("#japan-layer [data-signal-value]").first().innerText(), /2 \/ 1か国あたり最大件数/u);
    const samplingScreenshot = path.join(outputDir, `${viewport.name}-04-sampling-limit.png`);
    await page.screenshot({ path: samplingScreenshot });
    scan.screenshots.push(samplingScreenshot);
    await pollinationSlider.focus();
    await pollinationSlider.press("End");
    await page.waitForFunction(() => document.querySelector("#japan-overlay")?.dataset.pollinationStage === "relations");
    assert.match(await page.locator("#japan-layer [data-signal-value]").first().innerText(), /23 \/ 花との記録関係/u);
    const networkScreenshot = path.join(outputDir, `${viewport.name}-04-flower-network.png`);
    await page.screenshot({ path: networkScreenshot });
    scan.screenshots.push(networkScreenshot);
    await pollinationSlider.focus();
    await pollinationSlider.press("Home");
    await page.waitForFunction(() => document.querySelector("#japan-overlay")?.dataset.pollinationStage === "records");
    await page.locator("#map-reading-guide").evaluate((element) => { element.open = false; });
    scan.clicks.pollination = await clickDataPoint(page, "pollination-protocol");
    assert.equal(scan.clicks.pollination.card.title, "この点は、一件の観察記録");
    assert.match(scan.clicks.pollination.card.meta, new RegExp(String(scan.clicks.pollination.point.row.key), "u"));
    assert.match(scan.clicks.pollination.card.meta, /GBIF/u);
    assert.match(scan.clicks.pollination.card.description, /生息数や分布範囲は分かりません/u);
    assert.match(scan.clicks.pollination.card.relation, /最大2件.*点がない場所.*いないとは言えません/u);
    const pollinationScreenshot = path.join(outputDir, `${viewport.name}-04-bee-records.png`);
    await page.screenshot({ path: pollinationScreenshot });
    scan.screenshots.push(pollinationScreenshot);
    await closeDataCard(page);

    await selectMode(page, 4, "再資源化の現在ともしも");
    await page.waitForFunction(() => document.querySelector("#japan-overlay")?.dataset.recyclingEncoding === "fixed-diameter-pie");
    const recyclingEncoding = await page.locator("#japan-overlay").evaluate((element) => ({
      encoding: element.dataset.recyclingEncoding,
      pieCount: Number(element.dataset.recyclingPieCount),
      officialCount: Number(element.dataset.recyclingOfficialCount),
      imputedCount: Number(element.dataset.recyclingImputedCount),
      selectedRate: Number(element.dataset.recyclingSelectedRate),
    }));
    assert.deepEqual(recyclingEncoding, {
      encoding: "fixed-diameter-pie",
      pieCount: 31,
      officialCount: 17,
      imputedCount: 14,
      selectedRate: 19.6,
    });
    const recyclingGuide = await page.locator("#map-guide-reading").textContent();
    assert.match(recyclingGuide, /緑の扇形.*橙/u);
    scan.clicks.waste = await clickDataPoint(page, "nothing-is-waste");
    assert.match(scan.clicks.waste.card.title, new RegExp(scan.clicks.waste.point.row.country, "u"));
    assert.match(scan.clicks.waste.card.description, /円グラフ.*緑.*橙/u);
    const selectedCurrentRate = Number(await page.locator("#japan-overlay").getAttribute("data-recycling-selected-rate"));
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
    assert.match(afterScenario, /もしも/u);
    const scenarioRate = Number(await page.locator("#japan-overlay").getAttribute("data-recycling-scenario-rate"));
    assert.ok(scenarioRate > selectedCurrentRate);
    const wasteScreenshot = path.join(outputDir, `${viewport.name}-05-recycling-what-if.png`);
    await page.screenshot({ path: wasteScreenshot });
    scan.screenshots.push(wasteScreenshot);

    await selectMode(page, 5, "人類世の傷跡");
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
    const nightLightsScreenshot = path.join(outputDir, `${viewport.name}-06-night-lights-visible.png`);
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
      const dimmedScreenshot = path.join(outputDir, `${viewport.name}-06-night-lights-dimmed.png`);
      await page.screenshot({ path: dimmedScreenshot });
      scan.screenshots.push(dimmedScreenshot);
    }

    await selectMode(page, 6, "地球からのメッセージ");
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
      sync: "annual-simultaneous",
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
      viewportLimit: Number(element.dataset.earthquakeWaveViewportLimitPx),
      maxRadius: Number(element.dataset.earthquakeWaveRadiusMaxPx),
    }));
    assert.equal(earthquakeWave.year, "2004");
    assert.equal(earthquakeWave.eventCount, 3);
    assert.ok(earthquakeWave.progress > waveStart);
    assert.ok(Math.abs(earthquakeWave.maxRadius - earthquakeWave.viewportLimit) <= 0.2);
    assert.ok(earthquakeWave.maxRadius >= viewport.width * 0.4);
    const earthquakeReadout = await page.locator("#japan-layer [data-signal-value]").first().innerText();
    assert.match(earthquakeReadout, /2004.*3 EVENTS.*MAX M9\.1/u);
    const earthquakeScreenshot = path.join(outputDir, `${viewport.name}-07-yearly-synchronized-waves.png`);
    await page.screenshot({ path: earthquakeScreenshot });
    scan.screenshots.push(earthquakeScreenshot);

    await selectMode(page, 7, "三つの生態系");
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
    const ecologyScreenshot = path.join(outputDir, `${viewport.name}-08-forest-urban-correlation.png`);
    await page.screenshot({ path: ecologyScreenshot });
    scan.screenshots.push(ecologyScreenshot);

    await selectMode(page, 8, "人工物の共生化");
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
    const renewableScreenshot = path.join(outputDir, `${viewport.name}-09-renewable-country-choropleth.png`);
    await page.screenshot({ path: renewableScreenshot });
    scan.screenshots.push(renewableScreenshot);

    await selectMode(page, 9, "九つの測定は、足せない");
    await page.waitForFunction(() => {
      const overlay = document.querySelector("#japan-overlay");
      return overlay?.dataset.sensewareDisplay === "nine-data-cards"
        && Number(overlay.dataset.sensewareCardCount) === 9;
    });
    const sensewareGuide = await page.locator("#map-guide-subject").textContent();
    assert.match(sensewareGuide, /9枚のカード.*代表値.*単位/u);
    const sensewareState = await page.locator("#japan-overlay").evaluate((element) => ({
      display: element.dataset.sensewareDisplay,
      cardCount: Number(element.dataset.sensewareCardCount),
      selectedCard: element.dataset.sensewareSelectedCard,
      selectedMetric: element.dataset.sensewareSelectedMetric,
      audienceTraces: element.dataset.sensewareAudienceTraces,
    }));
    assert.equal(sensewareState.display, "nine-data-cards");
    assert.equal(sensewareState.cardCount, 9);
    assert.equal(sensewareState.audienceTraces, "removed");
    assert.ok(sensewareState.selectedMetric);
    const firstSignal = await page.locator("#japan-layer [data-signal-time-output]").first().innerText();
    await slider.focus();
    await slider.press("End");
    await page.waitForFunction(() => document.querySelector("#japan-overlay")?.dataset.sensewareSelectedCard === "09");
    const lastSignal = await page.locator("#japan-layer [data-signal-time-output]").first().innerText();
    assert.notEqual(firstSignal, lastSignal);
    assert.match(lastSignal, /09 OF 09/u);
    assert.equal(await page.locator("#japan-overlay").getAttribute("data-senseware-selected-card"), "09");
    const sensewareReadout = await page.locator("#japan-layer [data-signal-value]").first().innerText();
    assert.match(sensewareReadout, /09 再生可能電力比率.*%/u);
    const sensewareScreenshot = path.join(outputDir, `${viewport.name}-10-nine-measure-atlas.png`);
    await page.screenshot({ path: sensewareScreenshot });
    scan.screenshots.push(sensewareScreenshot);

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
