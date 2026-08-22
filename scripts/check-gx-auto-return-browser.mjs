import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const [moduleRoot, executablePath, outputArgument, baseUrl = "http://127.0.0.1:4430"] = process.argv.slice(2);
if (!moduleRoot || !executablePath) throw new Error("Playwright module and browser executable are required");
const playwrightEntry = fs.existsSync(path.join(moduleRoot, "index.mjs"))
  ? path.join(moduleRoot, "index.mjs")
  : path.join(moduleRoot, "playwright", "index.mjs");
const { chromium } = await import(pathToFileURL(playwrightEntry).href);
const outputDir = path.resolve(outputArgument || "artifacts/gx-auto-return-browser");
fs.mkdirSync(outputDir, { recursive: true });

const viewports = [
  { name: "pc-1080p", width: 1920, height: 1080 },
  { name: "mobile-390", width: 390, height: 844 },
];
const report = { status: "running", baseUrl, scans: [], consoleErrors: [], pageErrors: [], responses404: [] };
const browser = await chromium.launch({ headless: true, executablePath, args: ["--no-first-run", "--disable-background-networking"] });

const stateFor = (storyVersion) => ({
  storyVersion,
  stepId: "gx_experience_017",
  reachedSceneIds: ["festival_concept", "map_mode01", "gx_experience"],
  viewed: {},
  evesRoute: [],
  observationOrder: "LOCAL_FIRST",
  editorialChoice: null,
  reflectionIds: [],
  resultTone: null,
  demoInterest: "太古の海",
  metCharacters: { mizuha: true, amane: true, sakuya: false },
  audio: { muted: true, volume: 0 },
  readStepIds: ["gx_experience_016"],
  clear: false,
  archivesUnlocked: false,
  sessionId: "gx-auto-return-check",
});

const bootAtGX = async (page) => {
  await page.goto(new URL("/story", baseUrl).href, { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => Boolean(globalThis.GaiaNovel && globalThis.GAIA_NOVEL_STORY));
  const storyVersion = await page.evaluate(() => globalThis.GAIA_NOVEL_STORY.storyVersion);
  const progress = stateFor(storyVersion);
  await page.evaluate((savedProgress) => {
    localStorage.setItem("gaiaSensewareNovel:progress", JSON.stringify(savedProgress));
    localStorage.setItem("gaiaSensewareNovel:manual-saves", JSON.stringify([{
      progress: savedProgress,
      savedAt: Date.now(),
      meta: { title: "GX auto-return QA", excerpt: savedProgress.stepId },
    }]));
    localStorage.setItem("gaiaSensewareNovel:config:v3", JSON.stringify({ messageSpeedPercent: 400, reducedMotion: true }));
    localStorage.setItem("gaia-senseware-bgm-volume", "0");
  }, progress);
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => Boolean(globalThis.GaiaNovel));
  await page.evaluate(() => globalThis.GaiaNovel.open());
  await page.locator("#novel-resume-button").click();
  if (await page.locator("#novel-save-panel").isVisible()) {
    await page.locator('.novel-save-slot[data-slot-index="0"]').click();
  }
  await page.waitForFunction(() => (
    document.querySelector("#novel-layer")?.dataset.stepId === "gx_experience_017"
    && document.body.classList.contains("gx-story-open")
    && document.querySelector("#gx-layer")?.hidden === false
  ));
};

try {
  for (const viewport of viewports) {
    const context = await browser.newContext({ viewport, deviceScaleFactor: 1, reducedMotion: "no-preference" });
    const page = await context.newPage();
    await page.addInitScript(() => {
      globalThis.__gxAutoReturnEvents = { progress: [], returns: 0 };
      addEventListener("gaia:gx-story-progress", (event) => {
        globalThis.__gxAutoReturnEvents.progress.push({ ...event.detail });
      });
      addEventListener("gaia:gx-return-to-novel", () => {
        globalThis.__gxAutoReturnEvents.returns += 1;
      });
    });
    page.on("console", (message) => {
      if (message.type() === "error") report.consoleErrors.push({ viewport: viewport.name, text: message.text() });
    });
    page.on("pageerror", (error) => report.pageErrors.push({ viewport: viewport.name, text: error.message }));
    page.on("response", (response) => {
      if (response.status() === 404) report.responses404.push({ viewport: viewport.name, url: response.url() });
    });

    await bootAtGX(page);
    const open = await page.evaluate(() => ({
      phase: document.querySelector("#gx-phase-index")?.textContent?.trim(),
      returnButtonCount: document.querySelectorAll("#story-detour-return").length,
      dockCount: document.querySelectorAll("#gx-layer .story-detour-dock").length,
      closeDisabled: document.querySelector("#gx-close")?.disabled,
      horizontalOverflow: document.documentElement.scrollWidth > innerWidth + 1,
    }));
    assert.deepEqual(open, {
      phase: "01 / 08",
      returnButtonCount: 0,
      dockCount: 0,
      closeDisabled: true,
      horizontalOverflow: false,
    }, `${viewport.name}: GX did not open as a dockless, guarded story modal`);
    await page.screenshot({ path: path.join(outputDir, `${viewport.name}-gx-dockless.png`), fullPage: false });

    const transitionTitle = await page.evaluate(() => {
      const transition = document.querySelector("#gx-era-transition");
      const title = document.querySelector("#gx-era-transition-title");
      title.textContent = "埋められた炭素の上に、新しい生命圏が広がる。";
      transition.classList.add("is-visible");
      const range = document.createRange();
      range.selectNodeContents(title);
      const titleRect = title.getBoundingClientRect();
      const transitionRect = transition.getBoundingClientRect();
      const lineTops = new Set([...range.getClientRects()].map((rect) => Math.round(rect.top)));
      return {
        lineCount: lineTops.size,
        whiteSpace: getComputedStyle(title).whiteSpace,
        insideLeft: titleRect.left >= transitionRect.left - 1,
        insideRight: titleRect.right <= transitionRect.right + 1,
      };
    });
    assert.deepEqual(transitionTitle, {
      lineCount: 1,
      whiteSpace: "nowrap",
      insideLeft: true,
      insideRight: true,
    }, `${viewport.name}: the long era-transition title did not stay on one line`);
    await page.screenshot({ path: path.join(outputDir, `${viewport.name}-gx-transition-nowrap.png`), fullPage: false });
    await page.evaluate(() => document.querySelector("#gx-era-transition")?.classList.remove("is-visible"));

    await page.keyboard.press("Enter");
    await page.locator("#gx-era-transition-skip").waitFor({ state: "visible", timeout: 3000 });
    const skipControl = await page.evaluate(() => {
      const transition = document.querySelector("#gx-era-transition");
      const skip = document.querySelector("#gx-era-transition-skip");
      const title = document.querySelector("#gx-era-transition-title");
      const header = document.querySelector("#gx-layer .gx-header");
      const timePanel = document.querySelector("#gx-layer .gx-time");
      const audioDock = document.querySelector("#gaia-audio-dock");
      const transitionRect = transition.getBoundingClientRect();
      const skipRect = skip.getBoundingClientRect();
      const titleRect = title.getBoundingClientRect();
      const headerRect = header.getBoundingClientRect();
      const timeRect = timePanel.getBoundingClientRect();
      const audioRect = audioDock?.getBoundingClientRect();
      const overlaps = (first, second) => !(
        first.right <= second.left
        || first.left >= second.right
        || first.bottom <= second.top
        || first.top >= second.bottom
      );
      const overlapsTitle = overlaps(skipRect, titleRect);
      const overlapsHeader = overlaps(skipRect, headerRect);
      const overlapsTime = overlaps(skipRect, timeRect);
      const overlapsAudio = audioRect && audioRect.width > 0 && audioRect.height > 0
        ? overlaps(skipRect, audioRect)
        : false;
      return {
        text: skip.querySelector("span")?.textContent?.trim(),
        ariaLabel: skip.getAttribute("aria-label"),
        width: Math.round(skipRect.width),
        height: Math.round(skipRect.height),
        topGap: Math.round(skipRect.top - transitionRect.top),
        rightGap: Math.round(transitionRect.right - skipRect.right),
        inside: skipRect.top >= transitionRect.top - 1
          && skipRect.right <= transitionRect.right + 1
          && skipRect.bottom <= transitionRect.bottom + 1
          && skipRect.left >= transitionRect.left - 1,
        overlapsTitle,
        overlapsHeader,
        overlapsTime,
        overlapsAudio,
        transitionVisible: transition.classList.contains("is-visible")
          && transition.getAttribute("aria-hidden") === "false",
      };
    });
    assert.equal(skipControl.text, "スキップ", `${viewport.name}: era transition skip label changed`);
    assert.equal(skipControl.ariaLabel, "時代切り替え演出をスキップ", `${viewport.name}: era transition skip accessible label changed`);
    assert(skipControl.width >= 110 && skipControl.height >= 44, `${viewport.name}: era transition skip hit area is too small`);
    assert(skipControl.topGap >= 0 && skipControl.rightGap >= 0 && skipControl.inside, `${viewport.name}: era transition skip is outside the GX card`);
    assert.equal(skipControl.overlapsTitle, false, `${viewport.name}: era transition skip overlaps the transition title`);
    assert.equal(skipControl.overlapsHeader, false, `${viewport.name}: era transition skip overlaps the GX heading`);
    assert.equal(skipControl.overlapsTime, false, `${viewport.name}: era transition skip overlaps the era counter`);
    assert.equal(skipControl.overlapsAudio, false, `${viewport.name}: era transition skip overlaps the audio control`);
    assert.equal(skipControl.transitionVisible, true, `${viewport.name}: era transition skip appeared outside the transition`);
    await page.screenshot({ path: path.join(outputDir, `${viewport.name}-gx-transition-skip.png`), fullPage: false });

    const skipStartedAt = Date.now();
    await page.locator("#gx-era-transition-skip").click();
    await page.waitForFunction(() => (
      document.querySelector("#gx-phase-index")?.textContent?.trim() === "02 / 08"
      && !document.querySelector("#gx-layer")?.classList.contains("is-era-transitioning")
      && document.querySelector("#gx-era-transition-skip")?.hidden === true
    ), null, { timeout: 1500 });
    const skipElapsedMs = Date.now() - skipStartedAt;
    assert(skipElapsedMs < 1200, `${viewport.name}: era transition skip took ${skipElapsedMs}ms`);

    await page.keyboard.press("Escape");
    await page.waitForTimeout(160);
    assert.equal(await page.evaluate(() => document.body.classList.contains("gx-story-open")), true, `${viewport.name}: GX closed before the final phase`);

    const phases = ["03 / 08", "04 / 08", "05 / 08", "06 / 08", "07 / 08", "08 / 08"];
    for (const phase of phases) {
      await page.keyboard.press("Enter");
      await page.locator("#gx-era-transition-skip").waitFor({ state: "visible", timeout: 3000 });
      await page.locator("#gx-era-transition-skip").click();
      await page.waitForFunction((value) => (
        document.querySelector("#gx-phase-index")?.textContent?.trim() === value
        && !document.querySelector("#gx-layer")?.classList.contains("is-era-transitioning")
      ), phase, { timeout: 5000 });
    }
    await page.waitForFunction(() => (
      document.querySelector("#gx-title")?.textContent?.trim() === "THE UNWRITTEN GX"
      && !document.querySelector("#gx-title")?.classList.contains("is-changing")
    ), null, { timeout: 3000 });
    const phase8Layout = await page.evaluate(() => {
      const card = document.querySelector("#gx-layer .gx-story-card");
      const title = card.querySelector("h3");
      const lowerNotes = [
        card.querySelector(".gx-strata-marker strong"),
        ...card.querySelectorAll(".gx-guide b"),
      ];
      const controls = document.querySelector("#gx-layer .gx-controls");
      const lineCount = (element) => {
        const range = document.createRange();
        range.selectNodeContents(element);
        return new Set([...range.getClientRects()]
          .filter((rect) => rect.width > 0 && rect.height > 0)
          .map((rect) => Math.round(rect.top))).size;
      };
      const cardRect = card.getBoundingClientRect();
      const controlsRect = controls.getBoundingClientRect();
      const overlapsControls = !(
        cardRect.right <= controlsRect.left
        || cardRect.left >= controlsRect.right
        || cardRect.bottom <= controlsRect.top
        || cardRect.top >= controlsRect.bottom
      );
      return {
        chapterTitle: document.querySelector("#gx-title")?.textContent?.trim(),
        titleLines: lineCount(title),
        lowerNoteLines: lowerNotes.map(lineCount),
        cardWidth: Math.round(cardRect.width),
        cardClientWidth: card.clientWidth,
        cardScrollWidth: card.scrollWidth,
        contentWidths: [title, ...lowerNotes].map((element) => ({
          client: element.clientWidth,
          scroll: element.scrollWidth,
        })),
        cardHorizontalOverflow: card.scrollWidth > card.clientWidth + 1,
        overlapsControls,
        pageHorizontalOverflow: document.documentElement.scrollWidth > innerWidth + 1,
      };
    });
    await page.screenshot({ path: path.join(outputDir, `${viewport.name}-gx-phase8-card.png`), fullPage: false });
    assert.equal(phase8Layout.cardHorizontalOverflow, false, `${viewport.name}: final GX card scrolls horizontally: ${JSON.stringify(phase8Layout)}`);
    assert.equal(phase8Layout.pageHorizontalOverflow, false, `${viewport.name}: final GX card overflows the page`);
    assert.equal(phase8Layout.overlapsControls, false, `${viewport.name}: final GX card overlaps its controls`);
    if (viewport.width >= 1600) {
      assert.equal(phase8Layout.titleLines, 1, `${viewport.name}: final GX title wraps`);
      assert.deepEqual(phase8Layout.lowerNoteLines, [1, 1, 1], `${viewport.name}: final GX lower notes wrap`);
    }
    assert.equal(await page.locator("#story-detour-return").count(), 0, `${viewport.name}: return button appeared before final completion`);
    await page.keyboard.press("Enter");
    await page.locator("#gx-era-transition-skip").waitFor({ state: "visible", timeout: 3000 });
    await page.locator("#gx-era-transition-skip").click();
    await page.waitForFunction(() => (
      globalThis.GaiaNovel.getState().stepId === "gx_experience_018"
      && !document.body.classList.contains("gx-story-open")
      && document.querySelector("#gx-layer")?.hidden === true
    ), null, { timeout: 5000 });

    const closed = await page.evaluate(() => ({
      stepId: globalThis.GaiaNovel.getState().stepId,
      completed: globalThis.GaiaNovel.getState().viewed.gxDeepTime === true,
      returnButtonCount: document.querySelectorAll("#story-detour-return").length,
      returns: globalThis.__gxAutoReturnEvents.returns,
      finalCompleteEvents: globalThis.__gxAutoReturnEvents.progress.filter((event) => event.complete === true).length,
      finalPhase: Math.max(...globalThis.__gxAutoReturnEvents.progress.map((event) => Number(event.phase) || 0)),
      horizontalOverflow: document.documentElement.scrollWidth > innerWidth + 1,
    }));
    assert.equal(closed.stepId, "gx_experience_018");
    assert.equal(closed.completed, true);
    assert.equal(closed.returnButtonCount, 0);
    assert.equal(closed.returns, 1);
    assert(closed.finalCompleteEvents >= 1, `${viewport.name}: final completion was not announced`);
    assert.equal(closed.finalPhase, 8);
    assert.equal(closed.horizontalOverflow, false);
    report.scans.push({ viewport: viewport.name, open, skipControl, skipElapsedMs, phase8Layout, closed, passed: true });
    await context.close();
  }
  assert.equal(report.consoleErrors.length, 0, `console errors: ${JSON.stringify(report.consoleErrors)}`);
  assert.equal(report.pageErrors.length, 0, `page errors: ${JSON.stringify(report.pageErrors)}`);
  assert.equal(report.responses404.length, 0, `404 responses: ${JSON.stringify(report.responses404)}`);
  report.status = "passed";
} catch (error) {
  report.status = "failed";
  report.error = error.stack || String(error);
  throw error;
} finally {
  fs.writeFileSync(path.join(outputDir, "report.json"), `${JSON.stringify(report, null, 2)}\n`);
  await browser.close();
}

console.log(`GX auto-return browser check passed: ${report.scans.length} viewports`);
