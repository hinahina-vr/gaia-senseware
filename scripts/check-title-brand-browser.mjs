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
const outputDir = path.resolve(outputArgument || "artifacts/title-brand-browser");
fs.mkdirSync(outputDir, { recursive: true });

const viewports = [
  { name: "pc-1440", width: 1440, height: 900 },
  { name: "mobile-390", width: 390, height: 844 },
];
const report = { status: "running", baseUrl, scans: [], consoleErrors: [], pageErrors: [], responses404: [] };
const browser = await chromium.launch({ headless: true, executablePath });

try {
  for (const viewport of viewports) {
    const context = await browser.newContext({ viewport, reducedMotion: "no-preference" });
    const page = await context.newPage();
    page.on("console", (message) => { if (message.type() === "error") report.consoleErrors.push(`${viewport.name}: ${message.text()}`); });
    page.on("pageerror", (error) => report.pageErrors.push(`${viewport.name}: ${error.message}`));
    page.on("response", (response) => { if (response.status() === 404) report.responses404.push(`${viewport.name}: ${response.url()}`); });

    await page.goto(new URL("/story", baseUrl).href, { waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => Boolean(globalThis.GaiaNovel && globalThis.GAIA_NOVEL_STORY));
    await page.evaluate(() => {
      localStorage.clear();
      localStorage.setItem("gaia-senseware-bgm-volume", "0");
      localStorage.setItem("gaiaSensewareTrueEnd:reached:v1", new Date().toISOString());
      globalThis.GaiaNovel.open();
    });
    await page.locator("#novel-title-screen").waitFor({ state: "visible" });
    await page.evaluate(() => document.fonts.ready);

    const scan = await page.evaluate(() => {
      const screen = document.querySelector("#novel-title-screen");
      const title = document.querySelector("#novel-title");
      const main = title?.querySelector("span");
      const subtitle = title?.querySelector("small");
      const actions = document.querySelector(".novel-title-actions");
      const rect = (node) => {
        const value = node?.getBoundingClientRect();
        return value ? { top: value.top, right: value.right, bottom: value.bottom, left: value.left, width: value.width, height: value.height } : null;
      };
      return {
        documentTitle: document.title,
        storyTitle: globalThis.GAIA_NOVEL_STORY?.title || "",
        storySubtitle: globalThis.GAIA_NOVEL_STORY?.subtitle || "",
        mainText: main?.textContent?.trim() || "",
        subtitleText: subtitle?.textContent?.trim() || "",
        mainDisplay: main ? getComputedStyle(main).display : "",
        subtitleDisplay: subtitle ? getComputedStyle(subtitle).display : "",
        screen: rect(screen),
        main: rect(main),
        subtitle: rect(subtitle),
        actions: rect(actions),
        overflowX: Math.max(0, document.documentElement.scrollWidth - innerWidth),
        overflowY: Math.max(0, document.documentElement.scrollHeight - innerHeight),
        viewport: { width: innerWidth, height: innerHeight },
      };
    });

    assert.equal(scan.documentTitle, "惑星の放課後 — GAIA SENSATION", `${viewport.name}: browser title`);
    assert.equal(scan.storyTitle, "惑星の放課後", `${viewport.name}: story title metadata`);
    assert.equal(scan.storySubtitle, "GAIA SENSATION", `${viewport.name}: story subtitle metadata`);
    assert.equal(scan.mainText, "惑星の放課後", `${viewport.name}: main title copy`);
    assert.equal(scan.subtitleText, "GAIA SENSATION", `${viewport.name}: subtitle copy`);
    assert.equal(scan.mainDisplay, "block", `${viewport.name}: main title is not its own line`);
    assert.equal(scan.subtitleDisplay, "block", `${viewport.name}: subtitle is not its own line`);
    assert.ok(scan.subtitle.top >= scan.main.bottom, `${viewport.name}: subtitle overlaps main title`);
    assert.ok(scan.screen.left >= 0 && scan.screen.right <= scan.viewport.width, `${viewport.name}: title lockup is clipped horizontally`);
    assert.ok(scan.actions.bottom <= scan.viewport.height, `${viewport.name}: title actions are clipped vertically`);
    assert.equal(scan.overflowX, 0, `${viewport.name}: horizontal overflow`);
    assert.equal(scan.overflowY, 0, `${viewport.name}: vertical overflow`);

    await page.screenshot({ path: path.join(outputDir, `${viewport.name}.png`), animations: "disabled" });
    report.scans.push({ viewport: viewport.name, ...scan, passed: true });
    await context.close();
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

console.log(`Title brand browser check passed: ${report.scans.length} viewports`);
