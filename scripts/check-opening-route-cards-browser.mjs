import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const [moduleRoot, executablePath, outputArgument, baseUrl = "http://127.0.0.1:4193"] = process.argv.slice(2);
if (!moduleRoot || !executablePath) throw new Error("Playwright module root and browser executable are required");
const playwrightEntry = fs.existsSync(path.join(moduleRoot, "index.mjs"))
  ? path.join(moduleRoot, "index.mjs")
  : path.join(moduleRoot, "playwright", "index.mjs");
const { chromium } = await import(pathToFileURL(playwrightEntry).href);
const outputDir = path.resolve(outputArgument || "artifacts/opening-route-cards-browser");
fs.mkdirSync(outputDir, { recursive: true });

const allViewports = [
  { name: "pc-1440", width: 1440, height: 900 },
  { name: "pc-4k", width: 3840, height: 2160 },
  { name: "mobile-280", width: 280, height: 653, mobile: true },
  { name: "mobile-390", width: 390, height: 844, mobile: true },
  { name: "landscape-568", width: 568, height: 320, mobile: true },
  { name: "landscape-667", width: 667, height: 375, mobile: true },
  { name: "landscape-844", width: 844, height: 390, mobile: true },
  { name: "reduced-motion", width: 1440, height: 900, reduced: true },
];
const viewports = process.env.GAIA_VIEWPORT
  ? allViewports.filter(({ name }) => name === process.env.GAIA_VIEWPORT)
  : allViewports;
if (viewports.length === 0) throw new Error(`Unknown GAIA_VIEWPORT: ${process.env.GAIA_VIEWPORT}`);
const overlapArea = (a, b) => Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left))
  * Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
const report = { status: "running", baseUrl, scans: [], consoleErrors: [], pageErrors: [], responses404: [] };

const browser = await chromium.launch({ headless: true, executablePath });
try {
  for (const viewport of viewports) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      hasTouch: Boolean(viewport.mobile),
      isMobile: Boolean(viewport.mobile),
      reducedMotion: viewport.reduced ? "reduce" : "no-preference",
    });
    await context.addInitScript(() => {
      localStorage.clear();
      globalThis.__qaVisible = (element) => {
        if (!element || element.hidden || element.closest("[hidden]")) return false;
        const style = getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        return style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity || 1) > 0 && rect.width > 0 && rect.height > 0;
      };
    });
    const page = await context.newPage();
    page.on("console", (message) => { if (message.type() === "error") report.consoleErrors.push(`${viewport.name}: ${message.text()}`); });
    page.on("pageerror", (error) => report.pageErrors.push(`${viewport.name}: ${error.message}`));
    page.on("response", (response) => { if (response.status() === 404) report.responses404.push(`${viewport.name}: ${response.url()}`); });

    await page.goto(new URL("/", baseUrl).href, { waitUntil: "domcontentloaded", timeout: 90_000 });
    await page.waitForFunction(() => __qaVisible(document.querySelector("#gaia-opening-sound-modal")));
    await page.locator("#gaia-opening-sound-off").click();
    if (!viewport.reduced) {
      await page.waitForFunction(() => __qaVisible(document.querySelector("#gaia-opening-skip")), null, { timeout: 10_000 });
      await page.locator("#gaia-opening-skip").click();
    }
    await page.waitForFunction(() => __qaVisible(document.querySelector("#gaia-opening-route-story")), null, { timeout: 10_000 });
    await page.waitForFunction(() => document.querySelector("#gaia-opening-route-guide")?.classList.contains("is-visible"), null, { timeout: 10_000 });
    await page.waitForFunction(() => document.activeElement?.id === "gaia-opening-route-guide", null, { timeout: 4_000 });

    const readGuide = () => page.evaluate(() => {
      const guide = document.querySelector("#gaia-opening-route-guide");
      const bubble = guide.querySelector(".gaia-opening-route-guide-bubble");
      return {
        step: guide.dataset.step,
        targetId: document.querySelector(".gaia-opening-route.is-route-guide-target")?.id,
        activeId: document.activeElement?.id,
        title: guide.querySelector("[data-route-guide-title]")?.textContent.trim(),
        copy: guide.querySelector("[data-route-guide-copy]")?.textContent.trim(),
        hint: guide.querySelector("[data-route-guide-hint-action]")?.textContent.trim(),
        buttonCount: guide.querySelectorAll("button").length,
        bubbleRect: bubble.getBoundingClientRect().toJSON(),
      };
    });
    const guideSteps = [await readGuide()];
    assert.equal(guideSteps[0].step, "1");
    assert.equal(guideSteps[0].targetId, "gaia-opening-route-story");
    assert.equal(guideSteps[0].activeId, "gaia-opening-route-guide");
    assert.equal(guideSteps[0].buttonCount, 0, `${viewport.name}: route guide still contains operation buttons`);
    assert.equal(guideSteps[0].hint, "次へ");
    await page.screenshot({ path: path.join(outputDir, `${viewport.name}-guide.png`), animations: "disabled" });

    await page.locator("#gaia-opening-route-guide").click({ position: { x: 8, y: 8 } });
    await page.waitForFunction(() => document.querySelector("#gaia-opening-route-guide")?.dataset.step === "2");
    const clickAdvancedGuide = await readGuide();
    assert.equal(clickAdvancedGuide.targetId, "gaia-opening-route-other", `${viewport.name}: click did not advance the guide`);
    assert.equal(clickAdvancedGuide.activeId, "gaia-opening-route-guide");
    guideSteps.push(clickAdvancedGuide);

    await page.keyboard.press("Enter");
    await page.waitForFunction(() => document.querySelector("#gaia-opening-route-guide")?.dataset.step === "3");
    const keyboardAdvancedGuide = await readGuide();
    assert.equal(keyboardAdvancedGuide.targetId, "gaia-opening-tour-link", `${viewport.name}: Enter did not advance the guide`);
    assert.equal(keyboardAdvancedGuide.activeId, "gaia-opening-route-guide");
    assert.equal(keyboardAdvancedGuide.hint, "案内を終える");
    guideSteps.push(keyboardAdvancedGuide);

    await page.locator("#gaia-opening-route-guide").click({ position: { x: 8, y: 8 } });
    await page.waitForFunction(() => !document.querySelector("#gaia-opening-route-guide")?.classList.contains("is-visible"));
    await page.locator("#gaia-opening-route-guide-replay").click();
    await page.waitForFunction(() => document.querySelector("#gaia-opening-route-guide")?.classList.contains("is-visible"));
    const replayedGuide = await readGuide();
    assert.equal(replayedGuide.step, "1", `${viewport.name}: replay did not restart the guide`);
    assert.equal(replayedGuide.targetId, "gaia-opening-route-story", `${viewport.name}: replay targets the wrong route`);
    assert.equal(replayedGuide.buttonCount, 0, `${viewport.name}: replayed guide restored removed buttons`);
    await page.keyboard.press("Escape");
    await page.locator("#gaia-opening-route-story").focus();

    const layout = await page.evaluate(() => {
      const readRect = (element) => element?.getBoundingClientRect().toJSON();
      const cards = Array.from(document.querySelectorAll(".gaia-opening-route-grid .gaia-opening-route"), (card) => ({
        id: card.id,
        index: card.querySelector(".gaia-opening-route-index")?.textContent.trim(),
        label: card.querySelector("strong")?.textContent.trim(),
        english: card.querySelector(".gaia-opening-route-en")?.textContent.trim(),
        englishVisible: __qaVisible(card.querySelector(".gaia-opening-route-en")),
        rect: readRect(card),
        labelRect: readRect(card.querySelector("strong")),
        symbolRect: readRect(card.querySelector(".gaia-opening-route-symbol")),
        iconRect: readRect(card.querySelector(".gaia-opening-route-icon")),
        iconPosition: getComputedStyle(card.querySelector(".gaia-opening-route-icon")).position,
        glintDisplay: getComputedStyle(card, "::after").display,
        glintAnimationName: getComputedStyle(card, "::after").animationName,
        glintAnimationDuration: getComputedStyle(card, "::after").animationDuration,
      }));
      return {
        menuRect: readRect(document.querySelector("#gaia-opening-final-menu")),
        replayRect: readRect(document.querySelector("#gaia-opening-route-guide-replay")),
        replayLabel: document.querySelector("#gaia-opening-route-guide-replay strong")?.textContent.trim(),
        replayEnglish: document.querySelector("#gaia-opening-route-guide-replay small")?.textContent.trim(),
        cards,
        overflowX: Math.max(0, document.documentElement.scrollWidth - innerWidth),
        overflowY: Math.max(0, document.documentElement.scrollHeight - innerHeight),
      };
    });
    report.scans.push({ viewport: viewport.name, guideSteps, replayedGuide, layout, passed: false });
    const compactLandscape = viewport.width > viewport.height && viewport.height <= 430;
    assert(layout.menuRect.left >= 13 && layout.menuRect.right <= viewport.width - 13, `${viewport.name}: route menu is outside its safe area`);
    assert(layout.menuRect.top >= -1 && layout.menuRect.bottom <= viewport.height + 1, `${viewport.name}: route menu is outside the viewport vertically`);
    assert(layout.replayRect.width >= 44 && layout.replayRect.height >= 44, `${viewport.name}: guide replay hit area is smaller than 44px`);
    assert.equal(layout.replayLabel, "入口ガイド");
    assert.equal(layout.replayEnglish, "CHOICE GUIDE");
    assert.equal(layout.cards.length, 3, `${viewport.name}: route card count changed`);
    assert.deepEqual(layout.cards.map(({ index }) => index), ["01 / STORY", "02 / DATA", "03 / GUIDE"]);
    assert.deepEqual(layout.cards.map(({ label }) => label), ["物語を始める", "データを探索する", "30秒ガイド"]);
    assert.deepEqual(layout.cards.map(({ english }) => english), ["STORY EXPERIENCE", "DATA EXPLORATION", "30 SEC QUICK TOUR"]);
    for (const card of layout.cards) {
      assert(card.rect.width >= 44 && card.rect.height >= 64, `${viewport.name}: ${card.id} hit area is too small`);
      assert(card.rect.left >= 13 && card.rect.right <= viewport.width - 13, `${viewport.name}: ${card.id} left the safe area`);
      assert.equal(card.englishVisible, !compactLandscape, `${viewport.name}: ${card.id} English-label visibility is inconsistent`);
      assert.equal(card.iconPosition, "static", `${viewport.name}: ${card.id} icon escaped its column`);
      assert.equal(card.glintDisplay, viewport.reduced ? "none" : "block", `${viewport.name}: ${card.id} glint layer is incorrect`);
      if (!viewport.reduced && card.id === "gaia-opening-route-story") {
        assert.equal(card.glintAnimationName, "opening-choice-glint", `${viewport.name}: focused-card glint did not run`);
        assert.equal(card.glintAnimationDuration, "0.24s", `${viewport.name}: focused-card glint is not three times faster`);
      }
      assert.equal(overlapArea(card.labelRect, card.symbolRect), 0, `${viewport.name}: ${card.id} label overlaps its icon`);
      assert(Math.abs((card.iconRect.left + card.iconRect.right - card.symbolRect.left - card.symbolRect.right) / 2) <= 0.75, `${viewport.name}: ${card.id} icon is not horizontally centered`);
      assert(Math.abs((card.iconRect.top + card.iconRect.bottom - card.symbolRect.top - card.symbolRect.bottom) / 2) <= 1.25, `${viewport.name}: ${card.id} icon is not vertically centered`);
    }
    assert.equal(layout.overflowX, 0, `${viewport.name}: horizontal overflow remains`);
    assert.equal(layout.overflowY, 0, `${viewport.name}: vertical overflow remains`);
    await page.screenshot({ path: path.join(outputDir, `${viewport.name}-cards-focused.png`), animations: "disabled" });
    report.scans[report.scans.length - 1].passed = true;
    await context.close();
  }

  assert.deepEqual(report.consoleErrors, []);
  assert.deepEqual(report.pageErrors, []);
  assert.deepEqual(report.responses404, []);
  report.status = "passed";
  console.log(`Opening route cards passed: ${report.scans.length} viewports`);
} catch (error) {
  report.status = "failed";
  report.error = error instanceof Error ? error.stack : String(error);
  throw error;
} finally {
  fs.writeFileSync(path.join(outputDir, "report.json"), `${JSON.stringify(report, null, 2)}\n`, "utf8");
  await browser.close();
}
