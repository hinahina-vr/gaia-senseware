import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const [moduleRoot, executablePath, outputArgument, baseUrl = "http://127.0.0.1:4527"] = process.argv.slice(2);
if (!moduleRoot || !executablePath) throw new Error("Playwright module and browser executable are required");
const { chromium } = await import(pathToFileURL(path.join(moduleRoot, "index.mjs")).href);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputDir = path.resolve(outputArgument || "artifacts/vn-typewriter-order");
fs.mkdirSync(outputDir, { recursive: true });

delete globalThis.GAIA_NOVEL_STORY;
await import(`${pathToFileURL(path.join(root, "novel-story-data.js")).href}?vn-typewriter=${Date.now()}`);
const story = globalThis.GAIA_NOVEL_STORY;
const targetStep = story.scenes.flatMap((scene) => scene.steps).find((step) => step.id === "gx_experience_010");
assert(targetStep && ["narration", "dialogue"].includes(targetStep.type), "gx_experience_010 text step missing");

const viewportFilter = process.env.GAIA_VIEWPORT_FILTER || "";
const modeFilter = process.env.GAIA_MODE_FILTER || "";
const viewports = [
  { name: "pc-2048", width: 2048, height: 1152 },
  { name: "pc-1440", width: 1440, height: 900 },
  { name: "mobile-390", width: 390, height: 844 },
].filter((viewport) => !viewportFilter || viewport.name === viewportFilter);
const modes = ["normal", "high", "speed-change", "click-skip", "space-skip", "auto", "fast", "reduced"]
  .filter((mode) => !modeFilter || mode === modeFilter);
assert(viewports.length > 0 && modes.length > 0, "unknown viewport or mode filter");
const storageKey = "gaiaSensewareNovel:progress";
const manualSaveKey = "gaiaSensewareNovel:manual-saves";
const configKey = "gaiaSensewareNovel:config:v3";
const routeUrl = new URL("/story", baseUrl).href;
const report = { status: "running", baseUrl, stepId: targetStep.id, scans: [], consoleErrors: [], pageErrors: [], responses404: [] };
const browser = await chromium.launch({ headless: true, executablePath, args: ["--no-first-run", "--disable-background-networking"] });

const baseState = {
  storyVersion: story.storyVersion,
  stepId: targetStep.id,
  reachedSceneIds: [],
  viewed: {},
  evesRoute: [],
  observationOrder: "LOCAL_FIRST",
  editorialChoice: null,
  reflectionIds: [],
  resultTone: null,
  demoInterest: "気温偏差の地図",
  metCharacters: { mizuha: true, amane: true, sakuya: true },
  audio: { muted: true, volume: 0.1 },
  readStepIds: [],
  clear: false,
  archivesUnlocked: false,
  sessionId: "vn-typewriter-order",
};

const installFrameTrace = async (page) => page.evaluate(() => {
  const text = document.querySelector("#novel-text");
  const cursor = document.querySelector("#novel-cursor");
  const source = text.getAttribute("aria-label") || "";
  const sourceGlyphs = Array.from(source);
  const samples = [];
  let previousCount = -1;
  let completeFrames = 0;
  let stopped = false;
  globalThis.__vnRevealTrace = { samples, source, errors: [], done: false };
  const sample = () => {
    if (stopped) return;
    const glyphs = [...text.querySelectorAll(".novel-reveal-glyph")];
    const flags = glyphs.map((glyph) => getComputedStyle(glyph).visibility !== "hidden");
    const firstHidden = flags.indexOf(false);
    const immediate = glyphs.length === 0 && text.dataset.revealState === "complete";
    const visibleCount = immediate ? sourceGlyphs.length : firstHidden < 0 ? flags.length : firstHidden;
    const visible = immediate ? source : glyphs.slice(0, visibleCount).map((glyph) => glyph.textContent || "").join("");
    const outOfOrder = flags.slice(visibleCount).some(Boolean);
    const state = text.dataset.revealState || "";
    const stepId = document.querySelector("#novel-layer")?.dataset.stepId || "";
    const cursorStyle = getComputedStyle(cursor);
    const cursorVisible = !cursor.hidden && cursorStyle.display !== "none" && cursorStyle.visibility !== "hidden" && Number(cursorStyle.opacity || 1) > 0;
    samples.push({ time: performance.now(), visibleCount, visible, outOfOrder, cursorVisible, state, stepId });
    if (cursorVisible) globalThis.__vnRevealTrace.errors.push("block cursor became visible");
    if (outOfOrder) globalThis.__vnRevealTrace.errors.push("later glyph became visible before an earlier glyph");
    if (visible !== sourceGlyphs.slice(0, visibleCount).join("")) globalThis.__vnRevealTrace.errors.push("visible text is not a source prefix");
    if (previousCount > visibleCount) globalThis.__vnRevealTrace.errors.push("visible prefix moved backwards");
    previousCount = visibleCount;
    if (state === "complete") completeFrames += 1;
    if (completeFrames >= 2 || stepId !== document.querySelector("#novel-layer")?.dataset.stepId) {
      stopped = true;
      globalThis.__vnRevealTrace.done = true;
      return;
    }
    requestAnimationFrame(sample);
  };
  requestAnimationFrame(sample);
});

const readTrace = async (page) => {
  try {
    await page.waitForFunction(() => globalThis.__vnRevealTrace?.done, null, { timeout: 12_000 });
  } catch (error) {
    const diagnostics = await page.evaluate(() => ({
      trace: structuredClone(globalThis.__vnRevealTrace),
      state: document.querySelector("#novel-text")?.dataset.revealState || "",
      count: document.querySelector("#novel-text")?.dataset.revealCount || "",
      sourceLength: document.querySelector("#novel-text")?.dataset.revealSourceLength || "",
      stepId: document.querySelector("#novel-layer")?.dataset.stepId || "",
    }));
    throw new Error(`reveal trace timeout: ${JSON.stringify(diagnostics)}`, { cause: error });
  }
  return page.evaluate(() => structuredClone(globalThis.__vnRevealTrace));
};

const assertTrace = (trace, tag, { allowJump = false, steadyCadence = false } = {}) => {
  const uniqueCounts = trace.samples.map((sample) => sample.visibleCount)
    .filter((value, index, values) => index === 0 || value !== values[index - 1]);
  const deltas = uniqueCounts.slice(1).map((value, index) => value - uniqueCounts[index]);
  assert.equal(trace.errors.length, 0, `${tag}: ${trace.errors.join(", ")}`);
  assert(trace.samples.every((sample) => trace.source.startsWith(sample.visible)), `${tag}: non-prefix sample`);
  assert.equal(trace.samples.at(-1)?.visible, trace.source, `${tag}: completion text mismatch`);
  assert(deltas.every((delta) => delta >= 0), `${tag}: reveal moved backwards`);
  if (!allowJump) assert(deltas.every((delta) => delta <= 1), `${tag}: glyph block jump ${Math.max(...deltas)}`);
  const revealEvents = [];
  let previousVisibleCount = -1;
  for (const sample of trace.samples) {
    if (sample.visibleCount <= previousVisibleCount) continue;
    revealEvents.push({ time: sample.time, visibleCount: sample.visibleCount });
    previousVisibleCount = sample.visibleCount;
  }
  const sourceGlyphs = Array.from(trace.source);
  const revealIntervals = revealEvents.slice(1).map((event, index) => ({
    duration: event.time - revealEvents[index].time,
    previousGlyph: sourceGlyphs[Math.max(0, revealEvents[index].visibleCount - 1)] || "",
  })).filter((entry) => entry.duration > 0 && entry.duration < 250);
  const punctuationIntervals = revealIntervals.filter((entry) => /[。！？、…―]/u.test(entry.previousGlyph)).map((entry) => entry.duration);
  const ordinaryIntervals = revealIntervals.filter((entry) => !/[。！？、…―]/u.test(entry.previousGlyph)).map((entry) => entry.duration).sort((a, b) => a - b);
  const ordinaryMedian = ordinaryIntervals.length ? ordinaryIntervals[Math.floor(ordinaryIntervals.length / 2)] : 0;
  const punctuationMax = punctuationIntervals.length ? Math.max(...punctuationIntervals) : 0;
  if (steadyCadence && punctuationIntervals.length && ordinaryMedian) {
    assert(punctuationMax <= ordinaryMedian * 2.2 + 1, `${tag}: punctuation pause ${punctuationMax.toFixed(1)}ms exceeds steady cadence median ${ordinaryMedian.toFixed(1)}ms`);
  }
  return {
    samples: trace.samples.length,
    uniqueCounts: uniqueCounts.length,
    maxDelta: deltas.length ? Math.max(...deltas) : 0,
    sourceLength: sourceGlyphs.length,
    cadence: { ordinaryMedian, punctuationMax, measuredIntervals: revealIntervals.length },
  };
};

const pressStorySpace = async (page) => {
  await page.evaluate(() => {
    const text = document.querySelector("#novel-text");
    text.tabIndex = -1;
    text.focus({ preventScroll: true });
  });
  await page.keyboard.press("Space");
};

try {
  for (const viewport of viewports) {
    for (const mode of modes) {
      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
        reducedMotion: mode === "reduced" ? "reduce" : "no-preference",
      });
      const page = await context.newPage();
      const tag = `${viewport.name}-${mode}`;
      page.on("console", (message) => { if (message.type() === "error") report.consoleErrors.push(`${tag}: ${message.text()}`); });
      page.on("pageerror", (error) => report.pageErrors.push(`${tag}: ${error.message}`));
      page.on("response", (response) => { if (response.status() === 404) report.responses404.push(`${tag}: ${response.url()}`); });
      await page.goto(routeUrl, { waitUntil: "domcontentloaded" });
      await page.evaluate(({ progressKey, manualKey, settingsKey, progress, settings }) => {
        localStorage.setItem(progressKey, JSON.stringify(progress));
        localStorage.setItem(manualKey, JSON.stringify([{
          progress,
          savedAt: 1786597200000,
          meta: { title: "GX展示", excerpt: "文字送り検証地点" },
        }]));
        localStorage.setItem(settingsKey, JSON.stringify(settings));
      }, {
        progressKey: storageKey,
        manualKey: manualSaveKey,
        settingsKey: configKey,
        progress: { ...baseState, sessionId: `vn-typewriter-${tag}` },
        settings: { messageSpeedPercent: mode === "speed-change" ? 50 : mode === "normal" || mode === "high" || mode === "auto" ? 400 : 200, reducedMotion: mode === "reduced" },
      });
      await page.reload({ waitUntil: "domcontentloaded" });
      await page.waitForFunction(() => Boolean(globalThis.GaiaNovel?.open));
      await page.evaluate(() => globalThis.GaiaNovel.open());
      if (mode === "auto") await page.locator("#novel-auto-button").click();
      await page.locator("#novel-resume-button").click();
      await page.waitForFunction(() => {
        const panel = document.querySelector("#novel-save-panel");
        return panel && !panel.hidden && getComputedStyle(panel).display !== "none";
      });
      await page.locator(".novel-save-slot[data-slot-index='0']").click();
      await page.waitForFunction((stepId) => {
        const layer = document.querySelector("#novel-layer");
        const runtime = document.querySelector("#novel-runtime");
        const text = document.querySelector("#novel-text");
        return layer?.dataset.stepId === stepId && !runtime?.hidden
          && getComputedStyle(runtime).display !== "none"
          && (text?.dataset.revealState === "complete" || text?.querySelectorAll(".novel-reveal-glyph").length > 0);
      }, targetStep.id, { timeout: 15_000 });
      await installFrameTrace(page);

      if (mode === "speed-change") {
        await page.waitForFunction(() => Number(document.querySelector("#novel-text")?.dataset.revealCount || 0) >= 3);
        await page.evaluate(() => {
          const control = document.querySelector("#novel-message-speed");
          control.value = "400";
          control.dispatchEvent(new Event("input", { bubbles: true }));
        });
      } else if (mode === "click-skip" || mode === "space-skip" || mode === "fast") {
        await page.waitForFunction(() => Number(document.querySelector("#novel-text")?.dataset.revealCount || 0) >= 2);
        if (mode === "click-skip") await page.locator("#novel-dialogue").click({ position: { x: 20, y: 20 } });
        if (mode === "space-skip") await pressStorySpace(page);
        if (mode === "fast") await page.locator("#novel-fast-forward-button").click();
        if (["click-skip", "space-skip"].includes(mode)) {
          await page.waitForFunction(() => document.querySelector("#novel-text")?.dataset.revealState === "complete", null, { timeout: 1_000 });
        }
      }

      const trace = await readTrace(page);
      const explicitSkip = ["click-skip", "space-skip", "fast", "reduced"].includes(mode);
      const steadyCadence = ["normal", "high", "auto"].includes(mode);
      const pageTraces = [assertTrace(trace, `${tag}-page1`, { allowJump: explicitSkip, steadyCadence })];
      if (mode === "auto") await page.locator("#novel-auto-button").click();
      if (mode === "fast") await page.locator("#novel-fast-forward-button").click();
      await page.locator("#novel-dialogue").click({ position: { x: 20, y: 20 } });
      await page.waitForFunction(() => {
        const text = document.querySelector("#novel-text");
        return text?.dataset.pageIndex === "2"
          && (text.dataset.revealState === "complete" || text.querySelectorAll(".novel-reveal-glyph").length > 0);
      });
      await installFrameTrace(page);
      if (["click-skip", "space-skip"].includes(mode)) {
        await page.waitForFunction(() => Number(document.querySelector("#novel-text")?.dataset.revealCount || 0) >= 2);
        if (mode === "space-skip") await pressStorySpace(page);
        else await page.locator("#novel-dialogue").click({ position: { x: 20, y: 20 } });
        await page.waitForFunction(() => document.querySelector("#novel-text")?.dataset.revealState === "complete", null, { timeout: 1_000 });
      }
      const secondTrace = await readTrace(page);
      pageTraces.push(assertTrace(secondTrace, `${tag}-page2`, { allowJump: ["click-skip", "space-skip", "reduced"].includes(mode), steadyCadence }));
      const pageInfo = await page.evaluate(() => ({
        text: document.querySelector("#novel-text")?.textContent || "",
        aria: document.querySelector("#novel-text")?.getAttribute("aria-label") || "",
        pageIndex: Number(document.querySelector("#novel-text")?.dataset.pageIndex || 0),
        pageCount: Number(document.querySelector("#novel-text")?.dataset.pageCount || 0),
        lines: Number(document.querySelector("#novel-text")?.dataset.measuredLineCount || 0),
        tokenCount: document.querySelectorAll("#novel-text .novel-phrase-token, #novel-text .novel-space-token").length,
        glyphCount: document.querySelectorAll("#novel-text .novel-reveal-glyph").length,
        overflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      }));
      assert.equal(pageInfo.text, pageInfo.aria, `${tag}: DOM/source mismatch`);
      assert(pageInfo.pageCount >= 2, `${tag}: long dialogue did not paginate`);
      assert.equal(pageInfo.pageIndex, 2, `${tag}: second page was not rendered`);
      assert(pageInfo.lines <= 3, `${tag}: page exceeds three lines`);
      assert(pageInfo.tokenCount > 0, `${tag}: phrase token DOM missing`);
      assert(pageInfo.overflowX <= 1, `${tag}: horizontal overflow`);
      if (mode === "normal") await page.screenshot({ path: path.join(outputDir, `${tag}.png`), fullPage: true });
      report.scans.push({ tag, pages: pageTraces, pageInfo });
      await context.close();
    }
  }
  assert.equal(report.consoleErrors.length, 0, `console errors: ${report.consoleErrors.join(" | ")}`);
  assert.equal(report.pageErrors.length, 0, `page errors: ${report.pageErrors.join(" | ")}`);
  assert.equal(report.responses404.length, 0, `404 responses: ${report.responses404.join(" | ")}`);
  report.status = "passed";
} catch (error) {
  report.status = "failed";
  report.failure = error.stack || error.message;
  throw error;
} finally {
  fs.writeFileSync(path.join(outputDir, "report.json"), `${JSON.stringify(report, null, 2)}\n`);
  await browser.close();
}

console.log(`VN typewriter order browser check passed: ${report.scans.length}/${viewports.length * modes.length}`);
