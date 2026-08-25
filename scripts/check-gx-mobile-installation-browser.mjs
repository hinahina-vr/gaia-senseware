import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const [moduleRoot, executablePath, outputArgument, baseUrl = "http://127.0.0.1:4391"] = process.argv.slice(2);
if (!moduleRoot || !executablePath) throw new Error("Playwright module and browser executable are required");

const playwrightEntry = fs.existsSync(path.join(moduleRoot, "index.mjs"))
  ? path.join(moduleRoot, "index.mjs")
  : path.join(moduleRoot, "playwright", "index.mjs");
const { chromium } = await import(pathToFileURL(playwrightEntry).href);
const outputDir = path.resolve(outputArgument || "artifacts/gx-mobile-installation-browser");
fs.mkdirSync(outputDir, { recursive: true });

const viewports = [
  { name: "pc-1440", width: 1440, height: 900 },
  { name: "mobile-390", width: 390, height: 844 },
];
const report = { status: "running", baseUrl, scans: [], consoleErrors: [], pageErrors: [], responses404: [] };
const browser = await chromium.launch({ headless: true, executablePath, args: ["--no-first-run", "--disable-background-networking"] });

const waitForGX = async (page) => {
  await page.waitForFunction(() => Boolean(globalThis.GaiaGX), null, { timeout: 30000 });
  await page.evaluate(() => globalThis.GaiaGX.open({ returnTo: "intro", phase: 0 }));
  await page.waitForFunction(() => (
    document.querySelector("#gx-layer")?.hidden === false
    && document.querySelector("#gx-layer")?.classList.contains("is-open")
    && document.querySelector("#gx-loading")?.hidden === true
  ), null, { timeout: 30000 });
  await page.evaluate(() => {
    const opening = document.querySelector("#gaia-opening");
    if (opening) {
      opening.hidden = true;
      opening.classList.remove("is-active");
      opening.setAttribute("aria-hidden", "true");
    }
    document.body.classList.remove("gaia-opening-active");
    const intro = document.querySelector("#intro-layer");
    if (intro) {
      intro.hidden = true;
      intro.setAttribute("aria-hidden", "true");
    }
  });
};

const readSurface = async (page, mobile, story = false) => page.evaluate(({ mobile, story }) => {
  const layer = document.querySelector("#gx-layer");
  const canvas = document.querySelector("#gx-canvas");
  const card = document.querySelector("#gx-story-card");
  const controls = document.querySelector("#gx-layer .gx-controls");
  const toggle = document.querySelector("#gx-mobile-info-toggle");
  const info = document.querySelector("#gx-mobile-info");
  const effect = document.querySelector("#gx-effect-row");
  const layerRect = layer.getBoundingClientRect();
  const cardRect = card.getBoundingClientRect();
  const controlsRect = controls.getBoundingClientRect();
  const toggleRect = toggle.getBoundingClientRect();
  const planetX = layerRect.left + layerRect.width * (story ? 0.69 : 0.76);
  const planetY = layerRect.top + layerRect.height * (story ? 0.5 : 0.48);
  const planetHit = document.elementFromPoint(planetX, planetY);
  return {
    mobile,
    story,
    cardHeightRatio: cardRect.height / layerRect.height,
    cardClearOfControls: cardRect.bottom <= controlsRect.top - 8,
    cardScrollable: card.scrollHeight > card.clientHeight + 1,
    cardOverflowY: getComputedStyle(card).overflowY,
    toggleDisplay: getComputedStyle(toggle).display,
    toggleHeight: toggleRect.height,
    toggleExpanded: toggle.getAttribute("aria-expanded"),
    infoDisplay: getComputedStyle(info).display,
    effectDisplay: getComputedStyle(effect).display,
    titleWordBreak: getComputedStyle(document.querySelector("#gx-phase-title")).wordBreak,
    headerTitleOverflow: document.querySelector("#gx-title").scrollWidth > document.querySelector("#gx-title").clientWidth + 1,
    planetHitCanvas: planetHit === canvas,
    planetHit: planetHit?.id || String(planetHit?.className || planetHit?.tagName || ""),
    overflowX: document.documentElement.scrollWidth > innerWidth + 1,
    overflowY: document.documentElement.scrollHeight > innerHeight + 1,
  };
}, { mobile, story });

try {
  for (const viewport of viewports) {
    const context = await browser.newContext({ viewport, deviceScaleFactor: 1, reducedMotion: "reduce" });
    const page = await context.newPage();
    page.on("console", (message) => {
      if (message.type() === "error") report.consoleErrors.push({ viewport: viewport.name, text: message.text() });
    });
    page.on("pageerror", (error) => report.pageErrors.push({ viewport: viewport.name, text: error.message }));
    page.on("response", (response) => {
      if (response.status() === 404) report.responses404.push({ viewport: viewport.name, url: response.url() });
    });

    await page.goto(new URL(`/?qa=gx-installation-${viewport.name}`, baseUrl).href, { waitUntil: "domcontentloaded", timeout: 90000 });
    await waitForGX(page);
    const mobile = viewport.width <= 560;
    const standalone = await readSurface(page, mobile, false);
    assert.equal(standalone.overflowX, false);
    assert.equal(standalone.overflowY, false);
    assert.equal(standalone.planetHitCanvas, true, `${viewport.name}: standalone planet center is blocked by ${standalone.planetHit}`);

    if (mobile) {
      assert(standalone.cardHeightRatio <= 0.18, `${viewport.name}: collapsed explanation is too tall: ${JSON.stringify(standalone)}`);
      assert.equal(standalone.cardClearOfControls, true);
      assert.equal(standalone.cardScrollable, false);
      assert.equal(standalone.cardOverflowY, "hidden");
      assert.equal(standalone.toggleDisplay, "flex");
      assert(standalone.toggleHeight >= 44);
      assert.equal(standalone.toggleExpanded, "false");
      assert.equal(standalone.infoDisplay, "none");
      assert.equal(standalone.effectDisplay, "none");
      assert.equal(standalone.titleWordBreak, "auto-phrase");

      const phases = [];
      for (let phase = 0; phase < 8; phase += 1) {
        await page.evaluate((index) => globalThis.GaiaGX.setPhase(index), phase);
        const surface = await readSurface(page, true, false);
        assert(surface.cardHeightRatio <= 0.18, `phase ${phase + 1}: collapsed explanation is too tall`);
        assert.equal(surface.cardClearOfControls, true, `phase ${phase + 1}: explanation overlaps controls`);
        assert.equal(surface.cardScrollable, false, `phase ${phase + 1}: collapsed explanation scrolls`);
        assert.equal(surface.infoDisplay, "none", `phase ${phase + 1}: long explanation did not collapse`);
        assert.equal(surface.headerTitleOverflow, false, `phase ${phase + 1}: compact GX heading is clipped`);
        phases.push(surface);
      }
      await page.evaluate(() => globalThis.GaiaGX.setPhase(0));
      await page.locator("#gx-mobile-info-toggle").click();
      const expanded = await page.evaluate(() => {
        const card = document.querySelector("#gx-story-card");
        const controls = document.querySelector("#gx-layer .gx-controls");
        const cardRect = card.getBoundingClientRect();
        const controlsRect = controls.getBoundingClientRect();
        return {
          expanded: card.dataset.mobileInfoOpen,
          ariaExpanded: document.querySelector("#gx-mobile-info-toggle").getAttribute("aria-expanded"),
          infoDisplay: getComputedStyle(document.querySelector("#gx-mobile-info")).display,
          effectDisplay: getComputedStyle(document.querySelector("#gx-effect-row")).display,
          overflowY: getComputedStyle(card).overflowY,
          clearOfControls: cardRect.bottom <= controlsRect.top - 8,
        };
      });
      assert.deepEqual(expanded, {
        expanded: "true",
        ariaExpanded: "true",
        infoDisplay: "block",
        effectDisplay: "grid",
        overflowY: "auto",
        clearOfControls: true,
      });
      await page.screenshot({ path: path.join(outputDir, `${viewport.name}-expanded.png`), fullPage: false });
      await page.locator("#gx-mobile-info-toggle").click();

      await page.locator("#gx-modal-skip").click();
      await page.waitForFunction(() => document.querySelector("#gx-layer")?.hidden === true, null, { timeout: 5000 });
      await page.evaluate(() => globalThis.GaiaGX.open({ returnTo: "novel", storyMode: "qa", phase: 0 }));
      await page.waitForFunction(() => (
        document.body.classList.contains("gx-story-open")
        && document.querySelector("#gx-layer")?.classList.contains("is-open")
      ), null, { timeout: 5000 });
      const story = await readSurface(page, true, true);
      assert(story.cardHeightRatio <= 0.18, `story GX explanation is too tall: ${JSON.stringify(story)}`);
      assert.equal(story.cardClearOfControls, true);
      assert.equal(story.planetHitCanvas, true, `story planet center is blocked by ${story.planetHit}`);
      assert.equal(story.infoDisplay, "none");
      await page.screenshot({ path: path.join(outputDir, `${viewport.name}-story-collapsed.png`), fullPage: false });
      report.scans.push({ viewport: viewport.name, standalone, phases, expanded, story });
    } else {
      assert.equal(standalone.toggleDisplay, "none");
      assert.equal(standalone.infoDisplay, "contents");
      assert.notEqual(standalone.effectDisplay, "none");
      report.scans.push({ viewport: viewport.name, standalone });
    }

    await page.screenshot({ path: path.join(outputDir, `${viewport.name}-collapsed.png`), fullPage: false });
    await context.close();
  }

  assert.deepEqual(report.consoleErrors, []);
  assert.deepEqual(report.pageErrors, []);
  assert.deepEqual(report.responses404, []);
  report.status = "passed";
} catch (error) {
  report.status = "failed";
  report.error = error.stack || error.message;
  throw error;
} finally {
  fs.writeFileSync(path.join(outputDir, "report.json"), `${JSON.stringify(report, null, 2)}\n`);
  await browser.close();
}

console.log(`GX mobile installation browser check passed: ${outputDir}`);
