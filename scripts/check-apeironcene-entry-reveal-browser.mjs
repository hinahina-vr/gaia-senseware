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
const outputDir = path.resolve(outputArgument || "artifacts/apeironcene-entry-reveal");
fs.mkdirSync(outputDir, { recursive: true });

const allViewports = [
  { name: "pc-2048", width: 2048, height: 1114 },
  { name: "mobile-390", width: 390, height: 844, mobile: true },
];
const viewports = process.env.GAIA_FOCUS === "mobile" ? allViewports.slice(1) : allViewports;
const report = { status: "running", baseUrl, scans: [], consoleErrors: [], pageErrors: [], responses404: [] };
const browser = await chromium.launch({ headless: true, executablePath });

try {
  for (const viewport of viewports) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      hasTouch: Boolean(viewport.mobile),
      isMobile: Boolean(viewport.mobile),
      reducedMotion: "no-preference",
    });
    await context.addInitScript(() => {
      localStorage.clear();
      localStorage.setItem("gaia-senseware-bgm-muted", "true");
      localStorage.setItem("gaiaSensewareNovel:progress", JSON.stringify({
        storyVersion: 13,
        stepId: "festival_concept_001",
        clear: true,
        archivesUnlocked: true,
      }));
      globalThis.__apeironceneRevealQa = { openedAt: 0, startAt: 0, revealedAt: 0, starts: 0, reveals: 0 };
      addEventListener("gaia:apeironcene-entry-reveal-start", () => {
        globalThis.__apeironceneRevealQa.starts += 1;
        globalThis.__apeironceneRevealQa.startAt = performance.now();
      });
      addEventListener("gaia:apeironcene-entry-revealed", () => {
        globalThis.__apeironceneRevealQa.reveals += 1;
        globalThis.__apeironceneRevealQa.revealedAt = performance.now();
      });
    });
    const page = await context.newPage();
    page.on("console", (message) => {
      if (message.type() === "error") report.consoleErrors.push(`${viewport.name}: ${message.text()}`);
    });
    page.on("pageerror", (error) => report.pageErrors.push(`${viewport.name}: ${error.message}`));
    page.on("response", (response) => {
      if (response.status() === 404) report.responses404.push(`${viewport.name}: ${response.url()}`);
    });

    await page.goto(new URL(`/?preview=apeironcene-entry-${viewport.name}#earth`, baseUrl).href, {
      waitUntil: "domcontentloaded",
      timeout: 90_000,
    });
    await page.waitForFunction(() => document.documentElement.dataset.gaiaAppReady === "true");
    await page.waitForFunction(() => !document.documentElement.classList.contains("gaia-booting"));
    await page.waitForFunction(() => document.querySelector("#japan-layer")?.getAttribute("aria-hidden") === "false");
    await page.evaluate(() => { globalThis.__apeironceneRevealQa.openedAt = performance.now(); });
    await page.locator("#japan-close").click();
    await page.waitForFunction(() => {
      const intro = document.querySelector("#intro-layer");
      return intro && !intro.hidden && intro.getAttribute("aria-hidden") === "false";
    });
    const initial = await page.evaluate(() => {
      const button = document.querySelector(".intro-story-return[data-primary-action='true']");
      return {
        label: button.querySelector("strong")?.textContent.trim(),
        kicker: button.querySelector("span")?.textContent.trim(),
        destination: button.dataset.storyDestination,
        awakening: button.classList.contains("is-apeironcene-awakening"),
        revealed: button.classList.contains("is-apeironcene"),
      };
    });
    assert.deepEqual(initial, {
      label: "物語へ戻る",
      kicker: "MAIN STORY",
      destination: "story",
      awakening: false,
      revealed: false,
    });

    await page.waitForFunction(() => document.querySelector(".intro-story-return")?.classList.contains("is-apeironcene-awakening"));
    await page.screenshot({ path: path.join(outputDir, `${viewport.name}-awakening.png`) });
    await page.waitForFunction(() => document.querySelector(".intro-story-return")?.classList.contains("is-apeironcene"));
    const revealed = await page.evaluate(() => {
      const button = document.querySelector(".intro-story-return[data-primary-action='true']");
      const grid = document.querySelector("#intro-path-grid");
      const style = getComputedStyle(button);
      const rect = button.getBoundingClientRect();
      const gridRect = grid.getBoundingClientRect();
      return {
        label: button.querySelector("strong")?.textContent.trim(),
        kicker: button.querySelector("span")?.textContent.trim(),
        destination: button.dataset.storyDestination,
        ariaLabel: button.getAttribute("aria-label"),
        backgroundImage: style.backgroundImage,
        boxShadow: style.boxShadow,
        animationName: style.animationName,
        visualWidthDeltaFromGrid: Math.abs(rect.width - gridRect.width),
        layoutWidthDeltaFromGrid: Math.abs(button.offsetWidth - grid.offsetWidth),
        horizontalOverflow: Math.max(0, document.documentElement.scrollWidth - innerWidth),
        timing: { ...globalThis.__apeironceneRevealQa },
      };
    });
    report.scans.push({ viewport: viewport.name, initial, revealed, passed: false });
    assert.equal(revealed.label, "星々の放課後 ～APEIRONCENE～");
    assert.equal(revealed.kicker, "TRUE END / UNLOCKED");
    assert.equal(revealed.destination, "apeironcene");
    assert.equal(revealed.ariaLabel, "星々の放課後 APEIRONCENEへ進む");
    assert(revealed.backgroundImage.includes("linear-gradient"));
    assert.notEqual(revealed.boxShadow, "none");
    assert(revealed.animationName.includes("intro-apeironcene-spectrum"));
    assert(revealed.layoutWidthDeltaFromGrid <= 1, `${viewport.name}: action layout width delta ${revealed.layoutWidthDeltaFromGrid}px`);
    assert.equal(revealed.horizontalOverflow, 0);
    assert.equal(revealed.timing.starts, 1);
    assert.equal(revealed.timing.reveals, 1);
    assert(revealed.timing.startAt - revealed.timing.openedAt >= 520);
    assert(revealed.timing.revealedAt > revealed.timing.startAt);
    await page.screenshot({ path: path.join(outputDir, `${viewport.name}-revealed.png`) });
    report.scans.at(-1).passed = true;
    await context.close();
  }

  assert.deepEqual(report.consoleErrors, []);
  assert.deepEqual(report.pageErrors, []);
  assert.deepEqual(report.responses404, []);
  report.status = "passed";
} catch (error) {
  report.status = "failed";
  report.failure = { message: error.message, stack: error.stack };
  throw error;
} finally {
  fs.writeFileSync(path.join(outputDir, "report.json"), `${JSON.stringify(report, null, 2)}\n`);
  await browser.close();
}

console.log(JSON.stringify({ status: report.status, scans: report.scans.length, outputDir }, null, 2));
