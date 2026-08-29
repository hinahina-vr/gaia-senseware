import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const [moduleRoot, executablePath, outputArgument, baseUrl = "http://127.0.0.1:4173"] = process.argv.slice(2);
if (!moduleRoot || !executablePath) throw new Error("Playwright module and browser executable are required");
const playwrightEntry = fs.existsSync(path.join(moduleRoot, "index.mjs")) ? path.join(moduleRoot, "index.mjs") : path.join(moduleRoot, "playwright", "index.mjs");
const { chromium } = await import(pathToFileURL(playwrightEntry).href);
const outputDir = path.resolve(outputArgument || "artifacts/statistics-lab");
fs.mkdirSync(outputDir, { recursive: true });

const browser = await chromium.launch({ headless: true, executablePath, args: ["--enable-webgl", "--ignore-gpu-blocklist", "--disable-background-timer-throttling"] });
const report = { consoleErrors: [], pageErrors: [], responses404: [], scans: [] };

const boot = async (viewport) => {
  const context = await browser.newContext({ viewport, colorScheme: "dark", reducedMotion: viewport.name === "mobile" ? "reduce" : "no-preference" });
  await context.addInitScript(() => window.localStorage.removeItem("gaia-statistics-saved-views:v1"));
  const page = await context.newPage();
  page.on("console", (message) => { if (message.type() === "error") report.consoleErrors.push(`${viewport.name}: ${message.text()}`); });
  page.on("pageerror", (error) => report.pageErrors.push(`${viewport.name}: ${error.message}`));
  page.on("response", (response) => { if (response.status() === 404) report.responses404.push(`${viewport.name}: ${response.url()}`); });
  await page.goto(new URL("/?preview=gaia-statistics-lab-1#japan", baseUrl).href, { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => typeof window.GaiaModeLoader?.load === "function");
  await page.evaluate(() => window.GaiaModeLoader.load("exploration"));
  await page.waitForFunction(() => document.documentElement.dataset.gaiaAppReady === "true");
  await page.waitForFunction(() => typeof window.GaiaStatisticsLab?.open === "function");
  await page.evaluate(() => window.GaiaMapObservationAdapter.openMap());
  await page.waitForFunction(() => document.querySelector("#japan-layer")?.getAttribute("aria-hidden") === "false");
  return { context, page };
};

try {
  for (const viewport of [{ name: "pc", width: 1440, height: 900 }, { name: "mobile", width: 390, height: 844 }]) {
    const { context, page } = await boot(viewport);
    const mapStateBefore = await page.evaluate(() => ({
      adapter: (({ modeIndex, mapOpen }) => ({ modeIndex, mapOpen }))(window.GaiaMapObservationAdapter.getState()),
      zoom: document.querySelector("#japan-overlay")?.dataset.earthZoom,
      offsetX: document.querySelector("#japan-overlay")?.dataset.earthOffsetX,
      offsetY: document.querySelector("#japan-overlay")?.dataset.earthOffsetY,
    }));
    const trigger = viewport.name === "mobile" ? page.locator("#gaia-statistics-button-mobile") : page.locator("#gaia-statistics-button");
    assert.equal(await trigger.isVisible(), true, `${viewport.name}: statistics entry button is not visible on the map`);
    await trigger.click();
    await page.waitForFunction(() => window.GaiaStatisticsLab?.getState().exportReady === true);
    const fixedFrame = await page.evaluate(() => {
      const geometry = (selector) => {
        const element = document.querySelector(selector);
        return {
          clientHeight: element.clientHeight,
          scrollHeight: element.scrollHeight,
          scrollTop: element.scrollTop,
          overflowY: getComputedStyle(element).overflowY,
        };
      };
      return {
        document: { clientHeight: document.documentElement.clientHeight, scrollHeight: document.documentElement.scrollHeight, scrollY },
        lab: geometry("#gaia-statistics-lab"),
        shell: geometry(".gaia-statistics-shell"),
        body: geometry(".gaia-statistics-body"),
        stage: geometry(".gaia-statistics-stage"),
      };
    });
    for (const [name, geometry] of Object.entries(fixedFrame)) {
      if (name === "document") {
        assert.ok(geometry.scrollHeight <= geometry.clientHeight + 1 && geometry.scrollY === 0, `${viewport.name}: statistics page still scrolls vertically`);
      } else {
        assert.ok(geometry.scrollHeight <= geometry.clientHeight + 1 && geometry.scrollTop === 0, `${viewport.name}: ${name} still scrolls vertically`);
      }
    }
    await page.locator("#gaia-statistics-dataset").selectOption("co2-trend");
    await page.locator("#gaia-statistics-lectures").selectOption("01");
    await page.waitForFunction(() => document.querySelector("#gaia-statistics-status")?.textContent !== "CALCULATING"
      && document.querySelector("#gaia-statistics-canvas")?.dataset.axisX === "CO₂ (ppm)");
    const co2Chart = await page.locator("#gaia-statistics-canvas").evaluate((element) => ({
      axisX: element.dataset.axisX,
      axisY: element.dataset.axisY,
      domainX: element.dataset.domainX?.split(",").map(Number),
      pointCount: Number(element.dataset.pointCount),
      selectedDataset: document.querySelector("#gaia-statistics-dataset")?.selectedOptions[0]?.textContent,
    }));
    assert.equal(co2Chart.axisX, "CO₂ (ppm)", `${viewport.name}: histogram x-axis label is wrong`);
    assert.equal(co2Chart.axisY, "観測数", `${viewport.name}: histogram y-axis label is wrong`);
    assert.equal(co2Chart.pointCount, 120, `${viewport.name}: finite monthly observations were not preserved`);
    assert.ok(co2Chart.domainX[0] > 300, `${viewport.name}: chart domain still includes empty zero-to-data space`);
    assert.match(co2Chart.selectedDataset, /2016-08〜2026-07 \/ 欠測0か月/u, `${viewport.name}: actual observation period is not labeled`);
    const co2BusinessSummary = await page.locator("#gaia-statistics-kpis").evaluate((element) => ({
      usedRows: Number(element.dataset.usedRows),
      totalRows: Number(element.dataset.totalRows),
      sourceRows: Number(element.dataset.sourceRows),
      coverage: Number(element.dataset.coverage),
      quality: element.dataset.quality,
      primary: document.querySelector("#gaia-statistics-kpi-primary")?.textContent || "",
      filter: document.querySelector("#gaia-statistics-filter-summary")?.textContent || "",
      enabledExports: [...document.querySelectorAll(".gaia-statistics-bi-actions button")].filter((button) => !button.disabled).length,
    }));
    assert.deepEqual(
      { usedRows: co2BusinessSummary.usedRows, totalRows: co2BusinessSummary.totalRows, sourceRows: co2BusinessSummary.sourceRows, quality: co2BusinessSummary.quality },
      { usedRows: 120, totalRows: 120, sourceRows: 120, quality: "source-only" },
      `${viewport.name}: CO2 KPI row lineage is wrong`,
    );
    assert.equal(co2BusinessSummary.coverage, 1, `${viewport.name}: CO2 coverage KPI is wrong`);
    assert.ok(co2BusinessSummary.primary && co2BusinessSummary.primary !== "—", `${viewport.name}: primary KPI is empty`);
    assert.match(co2BusinessSummary.filter, /SOURCE ONLY.*2016-08–2026-07.*BROWSER LOCAL/u, `${viewport.name}: filter lineage is not visible`);
    assert.equal(co2BusinessSummary.enabledExports, 3, `${viewport.name}: BI exports are not ready after analysis`);
    assert.equal(await page.locator("#gaia-statistics-records-body tr").count(), 120, `${viewport.name}: accessible CO2 record table is incomplete`);
    assert.equal(await page.locator("#gaia-statistics-record-x-heading").textContent(), "観測月", `${viewport.name}: record table X heading is wrong`);
    assert.equal(await page.locator("#gaia-statistics-record-y-heading").textContent(), "CO₂", `${viewport.name}: record table Y heading is wrong`);
    await page.locator("#gaia-statistics-canvas").focus();
    await page.keyboard.press("ArrowRight");
    const keyboardChart = await page.locator("#gaia-statistics-canvas").evaluate((element) => ({
      index: Number(element.dataset.keyboardIndex),
      describedBy: element.getAttribute("aria-describedby") || "",
      label: element.getAttribute("aria-label") || "",
      tooltipVisible: !document.querySelector(".gaia-statistics-chart-tooltip")?.hidden,
    }));
    assert.equal(keyboardChart.index, 1, `${viewport.name}: keyboard chart navigation did not advance`);
    assert.match(keyboardChart.describedBy, /gaia-statistics-chart-help.*gaia-statistics-chart-tooltip/u, `${viewport.name}: keyboard tooltip is not described accessibly`);
    assert.match(keyboardChart.label, /120点.*矢印キー/u, `${viewport.name}: canvas does not disclose keyboard navigation`);
    assert.equal(keyboardChart.tooltipVisible, true, `${viewport.name}: keyboard chart tooltip is hidden`);
    await page.keyboard.press("Enter");
    await page.waitForFunction(() => document.querySelector(".gaia-statistics-records")?.open
      && document.querySelectorAll("#gaia-statistics-records-body tr[data-selected='true']").length === 1);
    const drilledRecord = await page.locator("#gaia-statistics-records-body tr[data-selected='true']").evaluate((element) => ({
      id: element.dataset.recordId,
      focused: element === document.activeElement,
      label: element.querySelector("th strong")?.textContent || "",
      announcement: document.querySelector("#gaia-statistics-record-drill-status")?.textContent || "",
    }));
    assert.ok(drilledRecord.id && drilledRecord.label, `${viewport.name}: chart drill-through has no record identity`);
    assert.equal(drilledRecord.focused, true, `${viewport.name}: chart drill-through did not move focus to the record`);
    assert.match(drilledRecord.announcement, new RegExp(drilledRecord.label, "u"), `${viewport.name}: chart drill-through is not announced`);
    assert.equal((await page.evaluate(() => window.GaiaStatisticsLab.getState())).selectedRecordId, drilledRecord.id, `${viewport.name}: drilled record state is not traceable`);
    await page.locator(".gaia-statistics-records").evaluate((element) => { element.open = false; });
    await page.locator("#gaia-statistics-canvas").focus();
    const exportReport = await page.evaluate(() => window.GaiaStatisticsLab.createExportReport());
    assert.equal(exportReport.schemaVersion, "gaia-statistics-report/v1", `${viewport.name}: report schema version missing`);
    assert.equal(exportReport.processing, "browser-local", `${viewport.name}: local-processing disclosure missing`);
    assert.equal(exportReport.rows.length, 120, `${viewport.name}: JSON report does not contain the filtered rows`);
    if (viewport.name === "pc") {
      const csvDownloadPromise = page.waitForEvent("download");
      await page.locator("#gaia-statistics-export-csv").click();
      const csvDownload = await csvDownloadPromise;
      assert.match(csvDownload.suggestedFilename(), /^gaia-co2-trend-summary-\d{4}-\d{2}-\d{2}\.csv$/u, "pc: CSV export filename is not traceable");
      const csvPath = path.join(outputDir, "pc-co2-export.csv");
      await csvDownload.saveAs(csvPath);
      const csvSource = fs.readFileSync(csvPath, "utf8");
      assert.match(csvSource, /"dataset_id","mode_id","method_id","id","label","value"/u, "pc: CSV export headers are not BI-ready");
      assert.equal(csvSource.trim().split(/\r?\n/u).length, 121, "pc: CSV export row count is wrong");

      const pngDownloadPromise = page.waitForEvent("download");
      await page.locator("#gaia-statistics-export-png").click();
      const pngDownload = await pngDownloadPromise;
      assert.match(pngDownload.suggestedFilename(), /^gaia-co2-trend-summary-\d{4}-\d{2}-\d{2}\.png$/u, "pc: PNG export filename is not traceable");
      await pngDownload.saveAs(path.join(outputDir, "pc-co2-chart-export.png"));
      const box = await page.locator("#gaia-statistics-canvas").boundingBox();
      let tooltipVisible = false;
      for (let yi = 1; yi <= 9 && !tooltipVisible; yi += 1) {
        for (let xi = 1; xi <= 13 && !tooltipVisible; xi += 1) {
          await page.mouse.move(box.x + box.width * xi / 14, box.y + box.height * yi / 10);
          tooltipVisible = await page.locator(".gaia-statistics-chart-tooltip").isVisible();
        }
      }
      assert.equal(tooltipVisible, true, "pc: hovering chart points does not reveal a tooltip");
      assert.match(await page.locator(".gaia-statistics-chart-tooltip").innerText(), /20\d{2}-\d{2}[\s\S]*ppm[\s\S]*SOURCE/u);
    }
    await page.locator("#gaia-statistics-visual").screenshot({
      path: path.join(outputDir, `${viewport.name}-co2-chart${viewport.name === "pc" ? "-tooltip" : ""}.png`),
    });
    await page.locator("#gaia-statistics-dataset").selectOption("rainfall");
    await page.waitForFunction(() => document.querySelector("#gaia-statistics-status")?.textContent !== "CALCULATING");
    assert.equal(await page.locator("#gaia-statistics-lab").getAttribute("aria-hidden"), "false");
    assert.equal(await page.locator("#gaia-statistics-lectures option").count(), 15);
    assert.equal(await page.locator(".gaia-statistics-insight").count(), 4);
    assert.match(await page.locator(".gaia-statistics-insight").nth(0).textContent(), /この図が示すこと/u);
    assert.match(await page.locator(".gaia-statistics-insight").nth(1).textContent(), /データから見えたこと/u);
    assert.match(await page.locator(".gaia-statistics-insight").nth(2).textContent(), /ここからは言えないこと/u);
    assert.match(await page.locator(".gaia-statistics-insight").nth(3).textContent(), /次に確かめる/u);
    const canvas = await page.locator("#gaia-statistics-canvas").evaluate((element) => ({ width: element.width, height: element.height, rect: element.getBoundingClientRect().toJSON() }));
    assert.ok(canvas.width > 300 && canvas.height > (viewport.name === "pc" ? 140 : 90), `${viewport.name}: canvas is not rendered`);
    const labVisual = await page.locator("#gaia-statistics-lab").evaluate((element) => {
      const style = getComputedStyle(element);
      const top = document.elementFromPoint(innerWidth / 2, innerHeight / 2);
      const shell = element.querySelector(".gaia-statistics-shell").getBoundingClientRect();
      return { position: style.position, inset: [style.top, style.right, style.bottom, style.left], background: style.backgroundImage, topInside: element.contains(top), shell: shell.toJSON() };
    });
    assert.equal(labVisual.position, "fixed");
    assert.ok(labVisual.topInside, `${viewport.name}: old WebGL can appear above the lab`);
    assert.match(labVisual.background, /linear-gradient/u);
    assert.ok(labVisual.shell.width < viewport.width && labVisual.shell.height < viewport.height, `${viewport.name}: statistics view is not a map overlay popup`);
    const specialized = await page.evaluate(async () => {
      const anova = await window.GaiaStatisticsLab.run("anova", "renewables");
      const multiple = await window.GaiaStatisticsLab.run("multiple", "renewables");
      const prediction = await window.GaiaStatisticsLab.run("prediction", "renewables");
      const pollination = await window.GaiaStatisticsLab.run("categorical", "pollination");
      return { anova, multiple, prediction, pollination };
    });
    assert.ok(specialized.anova.metrics.some(([label]) => label === "交互作用p"), `${viewport.name}: two-way interaction missing`);
    assert.ok(specialized.multiple.metrics.some(([label]) => label === "調整済みR²"), `${viewport.name}: multiple regression missing`);
    assert.ok(specialized.multiple.metrics.some(([label]) => label === "太陽光 VIF"), `${viewport.name}: multicollinearity metric missing`);
    assert.ok(specialized.prediction.metrics.some(([label]) => label === "95%予測上限"), `${viewport.name}: prediction interval missing`);
    assert.equal(specialized.pollination.kind, "not-applicable");
    assert.match(specialized.pollination.insight.interpretation, /23相互作用.*62標本/u);

    for (let lecture = 0; lecture < 15; lecture += 1) {
      await page.locator("#gaia-statistics-lectures").selectOption(String(lecture + 1).padStart(2, "0"));
      await page.waitForFunction(() => document.querySelector("#gaia-statistics-status")?.textContent !== "CALCULATING");
      assert.equal(await page.locator(".gaia-statistics-insight").count(), 4, `${viewport.name}: lecture ${lecture + 1} insight cards`);
      const cards = await page.locator(".gaia-statistics-insight").allTextContents();
      cards.forEach((text, index) => assert.ok(text.trim().length > 18, `${viewport.name}: lecture ${lecture + 1}, card ${index + 1} empty`));
      const methodButtons = page.locator("#gaia-statistics-methods button");
      for (let method = 1; method < await methodButtons.count(); method += 1) {
        await methodButtons.nth(method).click();
        await page.waitForFunction(() => document.querySelector("#gaia-statistics-status")?.textContent !== "CALCULATING");
        assert.equal(await page.locator(".gaia-statistics-insight").count(), 4);
      }
    }

    await page.locator("#gaia-statistics-dataset").selectOption("waste");
    await page.locator("#gaia-statistics-lectures").selectOption("01");
    await page.waitForFunction(() => document.querySelectorAll("#gaia-statistics-metrics tr").length >= 6
      && document.querySelector("#gaia-statistics-status")?.textContent !== "CALCULATING");
    const readMean = () => page.evaluate(() => [...document.querySelectorAll("#gaia-statistics-metrics tr")]
      .find((row) => row.cells[0]?.textContent === "平均")?.textContent || "");
    const sourceMean = await readMean();
    const sourceWasteKpis = await page.locator("#gaia-statistics-kpis").evaluate((element) => ({
      usedRows: Number(element.dataset.usedRows), totalRows: Number(element.dataset.totalRows), sourceRows: Number(element.dataset.sourceRows), quality: element.dataset.quality,
    }));
    assert.deepEqual(sourceWasteKpis, { usedRows: 17, totalRows: 31, sourceRows: 17, quality: "source-only" }, `${viewport.name}: source-only waste KPIs are wrong`);
    await page.locator("#gaia-statistics-derived").evaluate((element) => {
      element.checked = true;
      element.dispatchEvent(new Event("change", { bubbles: true }));
    });
    await page.waitForFunction(() => document.querySelector("#gaia-statistics-status")?.textContent !== "CALCULATING");
    await page.waitForTimeout(80);
    const combinedMean = await readMean();
    const combinedWasteKpis = await page.locator("#gaia-statistics-kpis").evaluate((element) => ({
      usedRows: Number(element.dataset.usedRows), totalRows: Number(element.dataset.totalRows), sourceRows: Number(element.dataset.sourceRows), quality: element.dataset.quality,
    }));
    assert.deepEqual(combinedWasteKpis, { usedRows: 31, totalRows: 31, sourceRows: 17, quality: "mixed" }, `${viewport.name}: mixed-provenance waste KPIs are wrong`);
    assert.equal(await page.locator("#gaia-statistics-records-body tr").count(), 31, `${viewport.name}: mixed-provenance record table is incomplete`);
    assert.equal(await page.locator('#gaia-statistics-records-body [data-provenance="IMPUTED"]').count(), 14, `${viewport.name}: imputed rows are not disclosed in the record table`);
    assert.ok(sourceMean && combinedMean, `${viewport.name}: mean metric missing (${sourceMean} / ${combinedMean})`);
    assert.notEqual(sourceMean, combinedMean, `${viewport.name}: provenance toggle did not update metrics`);
    assert.ok(await page.locator(".gaia-statistics-evidence-button").count() >= 3, `${viewport.name}: clickable evidence values missing`);

    await page.locator(".gaia-statistics-records").evaluate((element) => { element.open = true; });
    const labelSort = page.locator('[data-record-sort-action="label"]');
    await labelSort.click();
    assert.equal(await page.locator('th[data-record-sort="label"]').getAttribute("aria-sort"), "ascending", `${viewport.name}: record label sort is not exposed`);
    const ascendingLabels = await page.locator("#gaia-statistics-records-body th strong").allTextContents();
    assert.equal(ascendingLabels.every((label, index) => index === 0 || ascendingLabels[index - 1].localeCompare(label, "ja-JP", { numeric: true, sensitivity: "base" }) <= 0), true, `${viewport.name}: records are not sorted ascending`);
    await labelSort.click();
    assert.equal(await page.locator('th[data-record-sort="label"]').getAttribute("aria-sort"), "descending", `${viewport.name}: descending record label sort is not exposed`);
    const descendingLabels = await page.locator("#gaia-statistics-records-body th strong").allTextContents();
    assert.equal(descendingLabels.every((label, index) => index === 0 || descendingLabels[index - 1].localeCompare(label, "ja-JP", { numeric: true, sensitivity: "base" }) >= 0), true, `${viewport.name}: records are not sorted descending`);

    await page.locator("#gaia-statistics-record-filter").fill("Canada");
    await page.waitForFunction(() => Number(document.querySelector("#gaia-statistics-kpis")?.dataset.usedRows) === 1
      && window.GaiaStatisticsLab?.getState().recordQuery === "Canada");
    assert.equal(await page.locator("#gaia-statistics-records-body tr").count(), 1, `${viewport.name}: record query did not filter the audit table`);
    const segmentComparison = await page.locator("#gaia-statistics-segment-compare").evaluate((element) => ({
      status: element.dataset.status,
      delta: Number(element.dataset.delta),
      segmentMean: Number(element.dataset.segmentMean),
      baselineMean: Number(element.dataset.baselineMean),
      text: element.textContent || "",
    }));
    assert.match(segmentComparison.status, /^(?:above|below|same)$/u, `${viewport.name}: numeric segment comparison has no status`);
    assert.ok(Number.isFinite(segmentComparison.delta), `${viewport.name}: segment delta is not finite`);
    assert.ok(Number.isFinite(segmentComparison.segmentMean) && Number.isFinite(segmentComparison.baselineMean), `${viewport.name}: segment means are not traceable`);
    assert.ok(Math.abs(segmentComparison.delta - (segmentComparison.segmentMean - segmentComparison.baselineMean)) < 1e-10, `${viewport.name}: segment delta is inconsistent`);
    assert.match(segmentComparison.text, /表示中平均.*全31行/u, `${viewport.name}: segment comparison does not disclose its baseline`);
    const filteredReport = await page.evaluate(() => window.GaiaStatisticsLab.createExportReport());
    assert.equal(filteredReport.filter.query, "Canada", `${viewport.name}: JSON report omitted the record query`);
    assert.equal(filteredReport.rows.length, 1, `${viewport.name}: JSON report ignored the record query`);

    assert.equal(await page.locator(".gaia-statistics-saved-panel").isVisible(), false, `${viewport.name}: saved-view controls should not clutter the primary workspace`);
    await page.locator("#gaia-statistics-view-save").evaluate((element) => element.click());
    assert.equal(await page.locator("#gaia-statistics-saved-view option").count(), 2, `${viewport.name}: saved view was not added`);
    const savedViewId = await page.locator("#gaia-statistics-saved-view").inputValue();
    assert.ok(savedViewId, `${viewport.name}: saved view is not selected after save`);
    const savedStorage = await page.evaluate(() => JSON.parse(localStorage.getItem("gaia-statistics-saved-views:v1") || "[]"));
    assert.equal(savedStorage.length, 1, `${viewport.name}: local saved-view storage is wrong`);
    assert.equal(savedStorage[0].recordQuery, "Canada", `${viewport.name}: saved view omitted the record query`);
    assert.equal(savedStorage[0].recordSortKey, "label", `${viewport.name}: saved view omitted the record sort key`);
    assert.equal(savedStorage[0].recordSortDirection, "descending", `${viewport.name}: saved view omitted the record sort direction`);

    await page.locator("#gaia-statistics-dataset").selectOption("co2-trend");
    await page.waitForFunction(() => window.GaiaStatisticsLab?.getState().datasetId === "co2-trend"
      && document.querySelector("#gaia-statistics-status")?.textContent !== "CALCULATING");
    await page.locator("#gaia-statistics-saved-view").evaluate((element, value) => {
      element.value = value;
      element.dispatchEvent(new Event("change", { bubbles: true }));
    }, savedViewId);
    await page.locator("#gaia-statistics-view-apply").evaluate((element) => element.click());
    await page.waitForFunction(() => {
      const state = window.GaiaStatisticsLab?.getState();
      return state?.datasetId === "waste" && state.includeDerived && state.recordQuery === "Canada"
        && Number(document.querySelector("#gaia-statistics-kpis")?.dataset.usedRows) === 1;
    });
    const restoredViewState = await page.evaluate(() => window.GaiaStatisticsLab.getState());
    assert.equal(restoredViewState.lectureId, "01", `${viewport.name}: saved lecture was not restored`);
    assert.equal(restoredViewState.methodId, "summary", `${viewport.name}: saved method was not restored`);
    assert.equal(restoredViewState.recordSortKey, "label", `${viewport.name}: saved sort key was not restored`);
    assert.equal(restoredViewState.recordSortDirection, "descending", `${viewport.name}: saved sort direction was not restored`);
    assert.equal(await page.locator('th[data-record-sort="label"]').getAttribute("aria-sort"), "descending", `${viewport.name}: restored sort is not reflected in the table header`);
    assert.equal(await page.locator("#gaia-statistics-record-filter").inputValue(), "Canada", `${viewport.name}: saved record query is not visible after restore`);

    await page.locator("#gaia-statistics-view-delete").evaluate((element) => element.click());
    assert.equal(await page.locator("#gaia-statistics-saved-view option").count(), 1, `${viewport.name}: deleted view remains in the selector`);
    assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem("gaia-statistics-saved-views:v1") || "[]").length), 0, `${viewport.name}: deleted view remains in local storage`);
    await page.locator("#gaia-statistics-filter-clear").click();
    await page.waitForFunction(() => Number(document.querySelector("#gaia-statistics-kpis")?.dataset.usedRows) === 31
      && window.GaiaStatisticsLab?.getState().recordQuery === "");
    assert.equal(await page.locator("#gaia-statistics-records-body tr").count(), 31, `${viewport.name}: clearing the record query did not restore all rows`);

    if (viewport.name === "pc") {
      await page.locator(".gaia-statistics-records").evaluate((element) => { element.open = true; });
      const recordGeometry = await page.locator(".gaia-statistics-records-scroll").evaluate((element) => ({
        scrollable: element.scrollHeight > element.clientHeight,
        width: element.getBoundingClientRect().width,
        headerPosition: getComputedStyle(element.querySelector("thead")).position,
      }));
      assert.equal(recordGeometry.scrollable, true, "pc: record audit table is not independently scrollable");
      assert.ok(recordGeometry.width > 600, "pc: record audit table is too narrow");
      assert.equal(recordGeometry.headerPosition, "sticky", "pc: record audit table header is not sticky");
      await page.locator(".gaia-statistics-records").screenshot({ path: path.join(outputDir, "pc-record-audit-table.png") });
      await page.locator(".gaia-statistics-records").evaluate((element) => { element.open = false; });
    }
    await page.waitForTimeout(viewport.name === "pc" ? 650 : 40);

    const screenshot = path.join(outputDir, `${viewport.name}-statistics-lab.png`);
    await page.screenshot({ path: screenshot, fullPage: false });
    report.scans.push({ viewport, screenshot, canvas, sourceMean, combinedMean });
    await page.keyboard.press("Escape");
    assert.equal(await page.locator("#gaia-statistics-lab").getAttribute("aria-hidden"), "true");
    const mapStateAfter = await page.evaluate(() => ({
      adapter: (({ modeIndex, mapOpen }) => ({ modeIndex, mapOpen }))(window.GaiaMapObservationAdapter.getState()),
      zoom: document.querySelector("#japan-overlay")?.dataset.earthZoom,
      offsetX: document.querySelector("#japan-overlay")?.dataset.earthOffsetX,
      offsetY: document.querySelector("#japan-overlay")?.dataset.earthOffsetY,
    }));
    assert.deepEqual(mapStateAfter, mapStateBefore, `${viewport.name}: map state changed while the statistics popup was open`);
    assert.equal(await trigger.evaluate((element) => element === document.activeElement), true, `${viewport.name}: keyboard focus did not return to the trigger`);
    await context.close();
  }
  assert.deepEqual(report.consoleErrors, [], `console errors: ${report.consoleErrors.join("\n")}`);
  assert.deepEqual(report.pageErrors, [], `page errors: ${report.pageErrors.join("\n")}`);
  assert.deepEqual(report.responses404, [], `404 responses: ${report.responses404.join("\n")}`);
  report.status = "passed";
  fs.writeFileSync(path.join(outputDir, "report.json"), JSON.stringify(report, null, 2));
  console.log(`GAIA Statistics Lab browser checks passed: ${report.scans.length} viewports.`);
} finally {
  await browser.close();
}
