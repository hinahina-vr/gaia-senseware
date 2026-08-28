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
    await page.waitForFunction(() => document.querySelector("#gaia-statistics-status")?.textContent?.includes("COMPLETE"));
    await page.locator("#gaia-statistics-dataset").selectOption("rainfall");
    await page.waitForFunction(() => document.querySelector("#gaia-statistics-status")?.textContent !== "CALCULATING");
    assert.equal(await page.locator("#gaia-statistics-lab").getAttribute("aria-hidden"), "false");
    assert.equal(await page.locator("#gaia-statistics-lectures button").count(), 15);
    assert.equal(await page.locator(".gaia-statistics-insight").count(), 4);
    assert.match(await page.locator(".gaia-statistics-insight").nth(0).innerText(), /この図が示すこと/u);
    assert.match(await page.locator(".gaia-statistics-insight").nth(1).innerText(), /データから見えたこと/u);
    assert.match(await page.locator(".gaia-statistics-insight").nth(2).innerText(), /ここからは言えないこと/u);
    assert.match(await page.locator(".gaia-statistics-insight").nth(3).innerText(), /次に確かめる/u);
    const canvas = await page.locator("#gaia-statistics-canvas").evaluate((element) => ({ width: element.width, height: element.height, rect: element.getBoundingClientRect().toJSON() }));
    assert.ok(canvas.width > 300 && canvas.height > 200, `${viewport.name}: canvas is not rendered`);
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
      await page.locator("#gaia-statistics-lectures button").nth(lecture).click();
      await page.waitForFunction(() => document.querySelector("#gaia-statistics-status")?.textContent !== "CALCULATING");
      assert.equal(await page.locator(".gaia-statistics-insight").count(), 4, `${viewport.name}: lecture ${lecture + 1} insight cards`);
      const cards = await page.locator(".gaia-statistics-insight").allInnerTexts();
      cards.forEach((text, index) => assert.ok(text.trim().length > 18, `${viewport.name}: lecture ${lecture + 1}, card ${index + 1} empty`));
      const methodButtons = page.locator("#gaia-statistics-methods button");
      for (let method = 1; method < await methodButtons.count(); method += 1) {
        await methodButtons.nth(method).click();
        await page.waitForFunction(() => document.querySelector("#gaia-statistics-status")?.textContent !== "CALCULATING");
        assert.equal(await page.locator(".gaia-statistics-insight").count(), 4);
      }
    }

    await page.locator("#gaia-statistics-dataset").selectOption("waste");
    await page.locator("#gaia-statistics-lectures button[data-lecture='01']").click();
    await page.waitForFunction(() => document.querySelectorAll("#gaia-statistics-metrics tr").length >= 6
      && document.querySelector("#gaia-statistics-status")?.textContent !== "CALCULATING");
    const readMean = () => page.evaluate(() => [...document.querySelectorAll("#gaia-statistics-metrics tr")]
      .find((row) => row.cells[0]?.textContent === "平均")?.textContent || "");
    const sourceMean = await readMean();
    await page.locator("#gaia-statistics-derived").check();
    await page.waitForFunction(() => document.querySelector("#gaia-statistics-status")?.textContent !== "CALCULATING");
    await page.waitForTimeout(80);
    const combinedMean = await readMean();
    assert.ok(sourceMean && combinedMean, `${viewport.name}: mean metric missing (${sourceMean} / ${combinedMean})`);
    assert.notEqual(sourceMean, combinedMean, `${viewport.name}: provenance toggle did not update metrics`);
    assert.ok(await page.locator(".gaia-statistics-evidence-button").count() >= 3, `${viewport.name}: clickable evidence values missing`);
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
