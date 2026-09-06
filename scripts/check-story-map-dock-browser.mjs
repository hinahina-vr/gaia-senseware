import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright-core";
import "../novel-story-data.js";

const base = process.argv[2] || "http://127.0.0.1:4397";
const baseline = process.argv.includes("--baseline");
const output = path.resolve("artifacts/story-map-dock");
fs.mkdirSync(output, { recursive: true });
const report = { status: "running", checks: [], errors: [] };
const browser = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
let page;
try {
  for (const [width, height, warm = false] of (baseline ? [[2176, 1072]] : [[2176, 1072], [1440, 900], [1024, 768], [390, 844], [320, 568], [1440, 900, true]])) {
    const context = await browser.newContext({ viewport: { width, height }, reducedMotion: "no-preference" });
    await context.addInitScript(storyVersion => {
      const progress = { storyVersion, stepId: "map_mode01_004", reachedSceneIds: [], viewed: {}, evesRoute: [], observationOrder: null, editorialChoice: null, reflectionIds: [], resultTone: null, demoInterest: "気候の長期変化", metCharacters: { mizuha: true, amane: true, sakuya: true }, audio: { muted: true, volume: 0.37 }, readStepIds: [], clear: false, archivesUnlocked: false, sessionId: "story-map-dock-test" };
      localStorage.setItem("gaiaSensewareNovel:progress", JSON.stringify(progress));
      localStorage.setItem("gaiaSensewareNovel:manual-saves", JSON.stringify([{ progress, savedAt: Date.now(), meta: { title: "MAP layout QA", excerpt: progress.stepId } }]));
      localStorage.setItem("gaiaSensewareNovel:config:v4", JSON.stringify({ messageSpeedPercent: 400, reducedMotion: false }));
      localStorage.setItem("gaia-senseware-bgm-muted", "true");
      sessionStorage.setItem("gaia:mode-entry-guide:map:v3", "seen");
    }, GAIA_NOVEL_STORY.storyVersion);
    await context.route("https://services.swpc.noaa.gov/**", route => route.fulfill({ path: "data/ovation-aurora-snapshot.json", contentType: "application/json" }));
    page = await context.newPage();
    page.on("pageerror", error => report.errors.push(error.message));
    await page.goto(`${base}/?preview=story-map-dock#${warm ? "world" : "story"}`, { waitUntil: "domcontentloaded" });
    if (warm) {
      await page.waitForFunction(() => document.documentElement.dataset.gaiaAppReady === "true" && globalThis.GaiaStatisticsLab);
      await page.evaluate(async () => { await GaiaModeLoader.load("story"); await GaiaNovel.open(); });
    }
    await page.waitForFunction(() => globalThis.GaiaNovel);
    await page.waitForFunction(() => document.body.classList.contains("novel-mode-detour") && document.querySelector("#japan-layer")?.getBoundingClientRect().width > 0 && globalThis.GaiaMapObservationAdapter);
    await page.evaluate(() => GaiaMapObservationAdapter.waitSignalsReady());
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    const scan = await page.evaluate(() => {
      const layer = document.querySelector("#japan-layer");
      const measure = selector => {
        const element = layer.querySelector(selector), box = element?.getBoundingClientRect(), style = element && getComputedStyle(element);
        return element ? { selector, text: element.textContent.trim().slice(0, 180), box: box.toJSON(), display: style.display, position: style.position,
          overflow: element.scrollWidth - element.clientWidth, grid: style.gridTemplateColumns, visible: style.display !== "none" && style.visibility !== "hidden" && box.width > 0 && box.height > 0,
          hit: document.elementFromPoint(box.x + box.width / 2, box.y + box.height / 2)?.outerHTML.slice(0, 150) } : null;
      };
      return { width: innerWidth, body: document.body.className, layer: layer.getBoundingClientRect().toJSON(), phase: layer.dataset.storyPhase,
        scale: [...layer.querySelectorAll(".map-dock-timeline-scale span")].map(node => Number(node.textContent)),
        controls: [".map-command-dock", ".signal-console-map", ".signal-console-heading", ".signal-console-map > label", ".map-dock-year", ".map-dock-year b", "[data-signal-time]", ".map-dock-action--source", ".map-dock-action--statistics", "#story-map-modal-skip", ".japan-map-actions", ".signal-encoding-legend-dock"].map(measure) };
    });
    report.checks.push({ ...scan, warm });
    await page.screenshot({ path: path.join(output, `${baseline ? "before" : "after"}-${width}${warm ? "-warm" : ""}.png`) });
    if (baseline) console.log(JSON.stringify(scan));
    if (!baseline) {
      assert.equal(scan.scale[0], 1958); assert.equal(scan.scale.at(-1), 2050);
      assert(scan.scale.every((value, index) => !index || value > scan.scale[index - 1]), "Year scale must not include playback speed");
      for (const control of scan.controls.filter(item => item?.visible && [".signal-console-map", ".signal-console-map > label", ".map-dock-year", ".map-dock-year b", "[data-signal-time]", ".map-dock-action--source", ".map-dock-action--statistics"].includes(item.selector))) {
        assert(control.box.left >= scan.layer.left - 1 && control.box.right <= scan.layer.right + 1, `${width}: ${control.selector} outside map horizontally`);
        assert(control.box.top >= scan.layer.top - 1 && control.box.bottom <= scan.layer.bottom + 1, `${width}: ${control.selector} outside map vertically`);
        assert(control.overflow <= 1, `${width}: ${control.selector} overflows internally`);
      }
      const timeline = page.locator("#japan-layer [data-signal-time]").first();
      const box = await timeline.boundingBox();
      assert(box && box.width >= 80 && box.height >= 16, `${width}: usable timeline`);
      const before = await timeline.inputValue();
      await timeline.focus(); await timeline.press("ArrowRight");
      assert.notEqual(await timeline.inputValue(), before, "Keyboard changes the year");
      await page.mouse.click(box.x + box.width * .75, box.y + box.height / 2);
      assert.notEqual(await timeline.inputValue(), before, "Pointer reaches the timeline");
      if (width === 1440 || width === 390) {
        await page.locator(".map-dock-action--source").click();
        await page.locator("#japan-data-panel").waitFor({ state: "visible" });
        await page.locator("#japan-data-close").click();
        await page.locator(".map-dock-action--statistics").click();
        await page.waitForFunction(() => GaiaStatisticsLab.getState().analysisReady);
        await page.locator("#gaia-statistics-close").click();
        assert.equal(await page.evaluate(() => document.body.classList.contains("novel-mode-detour")), true);
      }
      if (width < 901) {
        await page.locator("#map-mobile-legend-toggle").click();
        await page.locator("#map-signal-encoding-legend-dock").waitFor({ state: "visible" });
        const legend = await page.locator("#map-signal-encoding-legend-dock").boundingBox();
        assert(legend.y + legend.height < scan.controls.find(item => item.selector === ".map-command-dock").box.top);
        await page.locator("#map-mobile-legend-toggle").click();
      }
      await page.locator("#story-map-modal-skip").click();
      await page.waitForFunction(() => GaiaNovel.getState().stepId === "map_mode01_005" && !document.body.classList.contains("novel-mode-detour"));
      console.log(`PASS ${width}${warm ? " warm" : ""}: bounded dock, correct years, pointer/keyboard, actions, story return`);
    }
    await context.close();
  }
  assert.deepEqual(report.errors, []); report.status = "passed";
} catch (error) { report.status = "failed"; report.failure = error.stack; if (page && !page.isClosed()) await page.screenshot({ path: path.join(output, "failure.png") }); throw error; }
finally { fs.writeFileSync(path.join(output, `${baseline ? "baseline" : "report"}.json`), JSON.stringify(report, null, 2)); await browser.close(); }
