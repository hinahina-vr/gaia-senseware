import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const [moduleRoot, executablePath, outputArgument, baseUrl = "http://127.0.0.1:4173"] = process.argv.slice(2);
if (!moduleRoot || !executablePath) throw new Error("Playwright module root and browser executable are required");
const playwrightEntry = fs.existsSync(path.join(moduleRoot, "index.mjs"))
  ? path.join(moduleRoot, "index.mjs")
  : path.join(moduleRoot, "playwright", "index.mjs");
const { chromium } = await import(pathToFileURL(playwrightEntry).href);
const outputDir = path.resolve(outputArgument || "artifacts/map-overlay-layout-browser");
fs.mkdirSync(outputDir, { recursive: true });

const viewports = [
  { name: "pc-1440", width: 1440, height: 900, maxInset: 36 },
  { name: "pc-1920", width: 1920, height: 1044, maxInset: 40 },
  { name: "mobile-390", width: 390, height: 844, maxInset: 28 },
];
const report = { status: "running", baseUrl, scans: [], consoleErrors: [], pageErrors: [], responses404: [] };
const browser = await chromium.launch({ headless: true, executablePath });

const boxInsideViewport = (box, viewport, label) => {
  assert(box, `${label}: missing box`);
  assert(box.left >= 0 && box.right <= viewport.width, `${label}: clipped horizontally`);
  assert(box.top >= 0 && box.top < viewport.height, `${label}: outside viewport`);
};

try {
  for (const viewport of viewports) {
    const context = await browser.newContext({ viewport, reducedMotion: "reduce" });
    const page = await context.newPage();
    page.on("console", (message) => {
      if (message.type() === "error") report.consoleErrors.push(`${viewport.name}: ${message.text()}`);
    });
    page.on("pageerror", (error) => report.pageErrors.push(`${viewport.name}: ${error.message}`));
    page.on("response", (response) => {
      if (response.status() === 404) report.responses404.push(`${viewport.name}: ${response.url()}`);
    });

    await page.goto(new URL("/?mode=1", baseUrl).href, { waitUntil: "domcontentloaded", timeout: 90_000 });
    await page.waitForFunction(() => document.querySelectorAll("#mode-list .mode-button").length === 10);
    await page.evaluate(() => {
      document.body.classList.remove("gaia-opening-active", "opening-active", "intro-open");
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
    await page.waitForTimeout(160);

    for (let index = 0; index < 10; index += 1) {
      await page.evaluate((modeIndex) => document.querySelectorAll("#japan-mode-list .map-mode-button")[modeIndex]?.click(), index);
      await page.waitForFunction(
        (modeNumber) => document.querySelector("#japan-mode-number")?.textContent?.trim() === modeNumber,
        String(index + 1).padStart(2, "0"),
      );
      await page.waitForTimeout(120);
      if (index === 2) {
        await page.waitForFunction(() => {
          const overlay = document.querySelector("#japan-overlay");
          return overlay?.dataset.forestMask === "ready"
            && overlay.dataset.forestRainCircleRange
            && overlay.dataset.forestRainBrazil;
        });
      } else if (index === 3) {
        await page.waitForFunction(() => {
          const overlay = document.querySelector("#japan-overlay");
          return overlay?.dataset.pollinationStage
            && overlay.dataset.pollinationOccurrenceCount
            && overlay.dataset.pollinationRelationCount;
        });
      } else if (index === 7) {
        await page.waitForFunction(() => {
          const overlay = document.querySelector("#japan-overlay");
          return overlay?.dataset.ecologiesPlot === "paired-country-scatter"
            && overlay.dataset.ecologiesPairCount
            && overlay.dataset.ecologiesCorrelation;
        });
      } else if (index === 8) {
        await page.waitForFunction(() => {
          const overlay = document.querySelector("#japan-overlay");
          return overlay?.dataset.countryGeometryState === "ready"
            && Number(overlay.dataset.renewableCountryFillCount) === 31;
        });
      } else if (index === 9) {
        await page.waitForFunction(() => {
          const overlay = document.querySelector("#japan-overlay");
          return overlay?.dataset.sensewareDisplay === "nine-data-cards"
            && Number(overlay.dataset.sensewareCardCount) === 9;
        });
      }

      const scan = await page.evaluate(() => {
        const box = (node) => node?.getBoundingClientRect().toJSON() || null;
        const visible = (node) => node && getComputedStyle(node).display !== "none"
          && getComputedStyle(node).visibility !== "hidden"
          && getComputedStyle(node).opacity !== "0";
        const back = document.querySelector("#japan-close");
        const heading = document.querySelector("#japan-layer > .japan-heading");
        const bank = document.querySelector("#japan-layer > .map-mode-bank");
        const signal = document.querySelector("#japan-layer > .signal-console-map");
        const backRect = back?.getBoundingClientRect();
        const hit = backRect
          ? document.elementFromPoint(backRect.left + backRect.width / 2, backRect.top + backRect.height / 2)
          : null;
        return {
          modeNumber: document.querySelector("#japan-mode-number")?.textContent?.trim() || "",
          desktopGrid: document.body.classList.contains("map-grid-desktop"),
          back: box(back),
          heading: box(heading),
          bank: box(bank),
          signal: box(signal),
          scaleCount: document.querySelectorAll("#japan-layer > .map-scope-switch").length,
          forestRainCircleRange: document.querySelector("#japan-overlay")?.dataset.forestRainCircleRange || "",
          forestRainBrazil: document.querySelector("#japan-overlay")?.dataset.forestRainBrazil || "",
          pollinationStage: document.querySelector("#japan-overlay")?.dataset.pollinationStage || "",
          pollinationOccurrenceCount: document.querySelector("#japan-overlay")?.dataset.pollinationOccurrenceCount || "",
          pollinationRelationCount: document.querySelector("#japan-overlay")?.dataset.pollinationRelationCount || "",
          ecologiesPlot: document.querySelector("#japan-overlay")?.dataset.ecologiesPlot || "",
          ecologiesPairCount: document.querySelector("#japan-overlay")?.dataset.ecologiesPairCount || "",
          ecologiesCorrelation: document.querySelector("#japan-overlay")?.dataset.ecologiesCorrelation || "",
          renewableCountryFillCount: document.querySelector("#japan-overlay")?.dataset.renewableCountryFillCount || "",
          renewableFillScale: document.querySelector("#japan-overlay")?.dataset.renewableFillScale || "",
          energyConnectionRemoved: document.querySelector("#japan-overlay")?.dataset.energyConnectionRemoved || "",
          sensewareDisplay: document.querySelector("#japan-overlay")?.dataset.sensewareDisplay || "",
          sensewareCardCount: document.querySelector("#japan-overlay")?.dataset.sensewareCardCount || "",
          sensewareAudienceTraces: document.querySelector("#japan-overlay")?.dataset.sensewareAudienceTraces || "",
          backVisible: visible(back),
          backHitId: hit?.closest?.("button")?.id || "",
          overflowX: Math.max(0, document.documentElement.scrollWidth - innerWidth),
          overflowY: Math.max(0, document.documentElement.scrollHeight - innerHeight),
          viewport: { width: innerWidth, height: innerHeight },
        };
      });

      assert.equal(scan.backVisible, true, `${viewport.name}/${scan.modeNumber}: back button is hidden`);
      assert.equal(scan.backHitId, "japan-close", `${viewport.name}/${scan.modeNumber}: back button is obstructed`);
      assert(scan.back.left >= 0 && scan.back.left <= viewport.maxInset, `${viewport.name}/${scan.modeNumber}: back is not at left edge`);
      assert(scan.back.top >= 0 && scan.back.top <= viewport.maxInset, `${viewport.name}/${scan.modeNumber}: back is not at top edge`);
      assert(scan.back.width >= 44 && scan.back.height >= 44, `${viewport.name}/${scan.modeNumber}: back hit area is too small`);
      assert.equal(scan.scaleCount, 0, `${viewport.name}/${scan.modeNumber}: redundant map scale block remains`);
      for (const [name, panelBox] of Object.entries({ heading: scan.heading, bank: scan.bank, signal: scan.signal })) {
        boxInsideViewport(panelBox, scan.viewport, `${viewport.name}/${scan.modeNumber}/${name}`);
        assert(panelBox.top >= scan.back.bottom + 10, `${viewport.name}/${scan.modeNumber}/${name}: panel was not lowered below back`);
      }
      if (viewport.name.startsWith("pc")) {
        assert.equal(scan.desktopGrid, true, `${viewport.name}/${scan.modeNumber}: desktop map grid is inactive`);
        assert(scan.bank.top >= scan.heading.bottom + 8, `${viewport.name}/${scan.modeNumber}: bank overlaps heading`);
        assert(scan.signal.top >= scan.bank.bottom + 8, `${viewport.name}/${scan.modeNumber}: signal panel overlaps bank`);
      } else {
        assert(scan.signal.top >= scan.heading.bottom + 8, `${viewport.name}/${scan.modeNumber}: signal panel overlaps heading`);
        assert(scan.bank.top >= scan.signal.bottom + 8, `${viewport.name}/${scan.modeNumber}: bank overlaps signal panel`);
      }
      assert.equal(scan.overflowX, 0, `${viewport.name}/${scan.modeNumber}: horizontal overflow`);
      assert.equal(scan.overflowY, 0, `${viewport.name}/${scan.modeNumber}: vertical overflow`);
      if (index === 2) {
        assert.equal(scan.forestRainCircleRange, "10-54px radius", `${viewport.name}/03: rain-circle scale is stale`);
        assert.equal(scan.forestRainBrazil, "5.33 mm/day", `${viewport.name}/03: Brazil rain point is missing`);
      } else if (index === 3) {
        assert(["records", "sampling", "relations"].includes(scan.pollinationStage), `${viewport.name}/04: pollination stage is missing`);
        assert.equal(scan.pollinationOccurrenceCount, "62", `${viewport.name}/04: GBIF occurrence count is stale`);
        assert.equal(scan.pollinationRelationCount, "23", `${viewport.name}/04: GloBI relation count is stale`);
      } else if (index === 7) {
        assert.equal(scan.ecologiesPlot, "paired-country-scatter", `${viewport.name}/08: paired scatter plot is missing`);
        assert.equal(scan.ecologiesPairCount, "31", `${viewport.name}/08: paired-country count is stale`);
        assert(Number(scan.ecologiesCorrelation) > 0.2 && Number(scan.ecologiesCorrelation) < 0.3, `${viewport.name}/08: correlation is missing`);
      } else if (index === 8) {
        assert.equal(scan.renewableCountryFillCount, "31", `${viewport.name}/09: country fills are missing`);
        assert.equal(scan.renewableFillScale, "country-blue-0-100", `${viewport.name}/09: color scale is stale`);
        assert.equal(scan.energyConnectionRemoved, "true", `${viewport.name}/09: old connection interaction remains`);
      } else if (index === 9) {
        assert.equal(scan.sensewareDisplay, "nine-data-cards", `${viewport.name}/10: data atlas is missing`);
        assert.equal(scan.sensewareCardCount, "9", `${viewport.name}/10: atlas card count is stale`);
        assert.equal(scan.sensewareAudienceTraces, "removed", `${viewport.name}/10: audience traces remain`);
      }
      report.scans.push({ viewport: viewport.name, ...scan, passed: true });

      if (index === 0 || index === 2 || index === 3 || index === 7 || index === 8 || index === 9) {
        await page.screenshot({
          path: path.join(outputDir, `${viewport.name}-${scan.modeNumber}.png`),
          animations: "disabled",
        });
      }
    }
    await context.close();
  }

  assert.deepEqual(report.consoleErrors, [], `console errors: ${report.consoleErrors.join("\n")}`);
  assert.deepEqual(report.pageErrors, [], `page errors: ${report.pageErrors.join("\n")}`);
  assert.deepEqual(report.responses404, [], `404 responses: ${report.responses404.join("\n")}`);
  report.status = "passed";
} catch (error) {
  report.status = "failed";
  report.error = error.stack || String(error);
  throw error;
} finally {
  fs.writeFileSync(path.join(outputDir, "report.json"), `${JSON.stringify(report, null, 2)}\n`, "utf8");
  await browser.close();
}

console.log(`Map overlay layout browser check passed: ${report.scans.length} mode/viewports`);
