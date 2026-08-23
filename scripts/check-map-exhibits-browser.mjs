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
  const rows = requestedModeId === "forest-cloud-engine"
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

    await selectMode(page, 1, "青い循環系");
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

    await selectMode(page, 0, "地球の一呼吸");
    await page.waitForFunction(() => document.querySelector("#japan-overlay")?.dataset.viewAnimation === "idle");
    await selectMode(page, 1, "青い循環系");
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

    await selectMode(page, 1, "青い循環系");
    await page.waitForFunction(() => document.querySelector("#japan-overlay")?.dataset.viewAnimation === "idle");
    await selectMode(page, 2, "森林と雨を比べる");
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
    await page.locator("#map-reading-guide").evaluate((element) => { element.open = false; });
    scan.clicks.forest = await clickDataPoint(page, "forest-cloud-engine");
    assert.match(scan.clicks.forest.card.title, new RegExp(scan.clicks.forest.point.row.name, "u"));
    assert.match(scan.clicks.forest.card.meta, /mm\/day/u);
    const forestScreenshot = path.join(outputDir, `${viewport.name}-03-forest-rain.png`);
    await page.screenshot({ path: forestScreenshot });
    scan.screenshots.push(forestScreenshot);
    await closeDataCard(page);

    await selectMode(page, 3, "ミツバチの観察記録");
    const pollinationGuide = await page.locator("#map-guide-subject").textContent();
    assert.match(pollinationGuide, /地図の点とは結びません/u);
    scan.clicks.pollination = await clickDataPoint(page, "pollination-protocol");
    assert.equal(scan.clicks.pollination.card.title, scan.clicks.pollination.point.row.species);
    assert.match(scan.clicks.pollination.card.meta, new RegExp(String(scan.clicks.pollination.point.row.key), "u"));
    assert.match(scan.clicks.pollination.card.meta, /GBIF/u);
    assert.match(scan.clicks.pollination.card.relation, /別の資料/u);
    const pollinationScreenshot = path.join(outputDir, `${viewport.name}-04-bee-records.png`);
    await page.screenshot({ path: pollinationScreenshot });
    scan.screenshots.push(pollinationScreenshot);
    await closeDataCard(page);

    await selectMode(page, 4, "再資源化の現在ともしも");
    scan.clicks.waste = await clickDataPoint(page, "nothing-is-waste");
    assert.match(scan.clicks.waste.card.title, new RegExp(scan.clicks.waste.point.row.country, "u"));
    const beforeScenario = await page.locator("#japan-layer [data-signal-value]").first().innerText();
    const slider = page.locator("#japan-layer [data-signal-time]").first();
    await slider.focus();
    await slider.press("End");
    await page.waitForTimeout(80);
    const afterScenario = await page.locator("#japan-layer [data-signal-value]").first().innerText();
    assert.notEqual(afterScenario, beforeScenario);
    assert.match(afterScenario, /もしも/u);
    const wasteScreenshot = path.join(outputDir, `${viewport.name}-05-recycling-what-if.png`);
    await page.screenshot({ path: wasteScreenshot });
    scan.screenshots.push(wasteScreenshot);
    await closeDataCard(page);

    await selectMode(page, 9, "九つの地球信号を見比べる");
    const sensewareGuide = await page.locator("#map-guide-subject").textContent();
    assert.match(sensewareGuide, /番号つきの九本の枝/u);
    const firstSignal = await page.locator("#japan-layer [data-signal-time-output]").first().innerText();
    await slider.focus();
    await slider.press("End");
    await page.waitForTimeout(80);
    const lastSignal = await page.locator("#japan-layer [data-signal-time-output]").first().innerText();
    assert.notEqual(firstSignal, lastSignal);
    assert.match(lastSignal, /09/u);
    const sensewareScreenshot = path.join(outputDir, `${viewport.name}-10-nine-signals.png`);
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
