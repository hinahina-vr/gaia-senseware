import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const [moduleRoot, executablePath, outputArgument, baseUrl = "http://127.0.0.1:4202"] = process.argv.slice(2);
if (!moduleRoot || !executablePath) throw new Error("Playwright module root and browser executable are required");

const playwrightEntry = fs.existsSync(path.join(moduleRoot, "index.mjs"))
  ? path.join(moduleRoot, "index.mjs")
  : path.join(moduleRoot, "playwright", "index.mjs");
const { chromium } = await import(pathToFileURL(playwrightEntry).href);
const outputDir = path.resolve(outputArgument || "artifacts/character-setting-mode-browser");
fs.mkdirSync(outputDir, { recursive: true });

const viewports = [
  { name: "pc-1440", width: 1440, height: 900, mobile: false },
  { name: "mobile-390", width: 390, height: 844, mobile: true },
];
const expectedSheets = [
  "01-three-ecologies-character-master.png",
  "02-first-meeting-zushi-coast.png",
  "03-gaia-senseware-installation.png",
  "04-life-earth-coevolution.png",
  "05-anthropocene-planetary-force.png",
  "06-ai-earth-coevolution.png",
  "07-three-ecologies-world.png",
  "08-old-os-to-gx.png",
  "09-next-stage-civilization.png",
  "10-final-keyvisual.png",
];
const report = { status: "running", baseUrl, scans: [], consoleErrors: [], pageErrors: [], responses404: [] };
const browser = await chromium.launch({ headless: true, executablePath });

const attachDiagnostics = (page, name, { allowAbortedImage = false } = {}) => {
  page.on("console", (message) => {
    if (allowAbortedImage && message.type() === "error" && /Failed to load resource: net::ERR_FAILED/u.test(message.text())) return;
    if (message.type() === "error") report.consoleErrors.push(`${name}: ${message.text()}`);
  });
  page.on("pageerror", (error) => report.pageErrors.push(`${name}: ${error.message}`));
  page.on("response", (response) => {
    if (response.status() === 404) report.responses404.push(`${name}: ${response.url()}`);
  });
};

const waitForPageImage = (page, pageNumber) => page.waitForFunction((expectedPage) => {
  const image = document.querySelector("#character-book-image");
  const pageSurface = document.querySelector("#character-book-page");
  return document.querySelector("#character-book-current")?.textContent.trim() === expectedPage
    && image?.complete
    && image.naturalWidth > 0
    && !pageSurface?.classList.contains("is-loading")
    && !pageSurface?.classList.contains("is-turning");
}, pageNumber);

const inspect = (page) => page.evaluate(() => {
  const layer = document.querySelector("#character-book-layer");
  const viewer = document.querySelector(".character-book-viewer");
  const details = document.querySelector(".character-book-details");
  const image = document.querySelector("#character-book-image");
  const currentButtons = [...document.querySelectorAll("[data-character-page]")]
    .filter((button) => button.getAttribute("aria-current") === "page");
  const rect = (element) => element?.getBoundingClientRect().toJSON();
  return {
    layerPosition: getComputedStyle(layer).position,
    layerRect: rect(layer),
    viewerRect: rect(viewer),
    detailsRect: rect(details),
    imageRect: rect(image),
    imageAlt: image?.alt || "",
    imageSource: image?.currentSrc || "",
    pageCount: document.querySelectorAll("[data-character-page]").length,
    activePageCount: currentButtons.length,
    current: document.querySelector("#character-book-current")?.textContent.trim(),
    title: document.querySelector("#character-book-page-title")?.textContent.trim(),
    bodyMode: document.body.classList.contains("character-mode-open"),
    ariaHidden: layer?.getAttribute("aria-hidden"),
    dialogRole: layer?.getAttribute("role"),
    modal: layer?.getAttribute("aria-modal"),
    nextDisabled: document.querySelector("#character-book-next")?.disabled,
    overflowX: Math.max(0, document.documentElement.scrollWidth - innerWidth),
  };
});

try {
  for (const viewport of viewports) {
    const context = await browser.newContext({ viewport, hasTouch: viewport.mobile });
    const page = await context.newPage();
    attachDiagnostics(page, viewport.name);
    await page.goto(new URL("/#character", baseUrl).href, { waitUntil: "domcontentloaded" });
    await page.locator("#character-book-layer").waitFor({ state: "visible", timeout: 15_000 });
    await waitForPageImage(page, "01");

    const initial = await inspect(page);
    assert.equal(initial.layerPosition, "fixed", `${viewport.name}: character viewer is not independent of the exploration scroll`);
    assert.equal(initial.bodyMode, true, `${viewport.name}: character mode body state is missing`);
    assert.equal(initial.ariaHidden, "false", `${viewport.name}: dialog is hidden from accessibility APIs`);
    assert.equal(initial.dialogRole, "dialog", `${viewport.name}: standalone viewer has no dialog role`);
    assert.equal(initial.modal, "true", `${viewport.name}: standalone viewer is not modal`);
    assert.equal(initial.pageCount, 10, `${viewport.name}: setting bible does not expose 10 pages`);
    assert.equal(initial.activePageCount, 1, `${viewport.name}: page index has an invalid active state`);
    assert.equal(initial.current, "01", `${viewport.name}: character master is not the opening page`);
    assert.equal(initial.title, "三人の基準設定画", `${viewport.name}: character master title is incorrect`);
    assert.match(initial.imageSource, /01-three-ecologies-character-master\.png/u, `${viewport.name}: character master image is incorrect`);
    assert(initial.imageAlt.length >= 12, `${viewport.name}: setting image alt text is missing`);
    assert.equal(initial.overflowX, 0, `${viewport.name}: horizontal overflow (${initial.overflowX}px)`);
    assert(initial.imageRect.left >= -1 && initial.imageRect.right <= viewport.width + 1, `${viewport.name}: page image leaves viewport`);
    if (viewport.mobile) {
      assert(initial.detailsRect.top >= initial.viewerRect.bottom - 1, `${viewport.name}: details do not stack below the page`);
    } else {
      assert(initial.viewerRect.right <= initial.detailsRect.left, `${viewport.name}: desktop page and metadata overlap`);
    }
    assert.equal(await page.locator("#character-book-layer").getAttribute("data-image-state"), "ready", `${viewport.name}: opening sheet is not in a ready state`);
    await page.screenshot({ path: path.join(outputDir, `${viewport.name}-character-book.png`), fullPage: false });

    await page.locator("#character-book-page").click();
    await waitForPageImage(page, "02");
    assert.equal(await page.locator("#character-book-page-title").textContent(), "海辺での初対面");
    assert.match(await page.locator("#character-book-image").getAttribute("src"), /02-first-meeting-zushi-coast\.png/u);

    await page.keyboard.press("ArrowRight");
    await waitForPageImage(page, "03");
    assert.equal(await page.locator("#character-book-page-title").textContent(), "GAIA SENSEWAREの展示空間");

    for (let pageIndex = 0; pageIndex < expectedSheets.length; pageIndex += 1) {
      await page.locator(`[data-character-page="${pageIndex}"]`).click();
      await waitForPageImage(page, String(pageIndex + 1).padStart(2, "0"));
      const sheet = await page.locator("#character-book-image").evaluate((element) => ({
        source: element.currentSrc,
        naturalWidth: element.naturalWidth,
        naturalHeight: element.naturalHeight,
        state: document.querySelector("#character-book-layer")?.dataset.imageState,
      }));
      assert.match(sheet.source, new RegExp(expectedSheets[pageIndex].replaceAll(".", "\\."), "u"), `${viewport.name}: sheet ${pageIndex + 1} source is wrong`);
      assert(sheet.naturalWidth >= 1200 && sheet.naturalHeight >= 800, `${viewport.name}: sheet ${pageIndex + 1} did not decode at full resolution`);
      assert.equal(sheet.state, "ready", `${viewport.name}: sheet ${pageIndex + 1} remained in ${sheet.state} state`);
    }

    await page.locator('[data-character-page="9"]').click();
    await waitForPageImage(page, "10");
    assert.equal(await page.locator("#character-book-next").isDisabled(), true, `${viewport.name}: next remains active on final page`);
    assert.equal(await page.locator("#character-book-page-title").textContent(), "第四の共創者へ");

    await page.keyboard.press("ArrowLeft");
    await waitForPageImage(page, "09");
    const finalScan = await inspect(page);
    assert.equal(finalScan.nextDisabled, false, `${viewport.name}: next did not recover after leaving final page`);
    report.scans.push({ viewport: viewport.name, initial, final: finalScan, passed: true });
    await page.screenshot({ path: path.join(outputDir, `${viewport.name}-character-book-page09.png`), fullPage: false });

    await page.keyboard.press("Escape");
    await page.locator("#character-book-layer").waitFor({ state: "hidden", timeout: 5_000 });
    assert.equal(await page.evaluate(() => document.body.classList.contains("character-mode-open")), false);
    assert.equal(await page.evaluate(() => window.location.hash), "", `${viewport.name}: direct-route hash was not cleared on close`);
    await context.close();
  }

  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  attachDiagnostics(page, "trigger-return");
  await page.goto(new URL("/", baseUrl).href, { waitUntil: "domcontentloaded" });
  await page.evaluate(() => globalThis.GaiaModeLoader.load("exploration"));
  await page.waitForFunction(() => document.querySelector("#intro-character-jump"));
  await page.evaluate(() => {
    document.documentElement.classList.remove("gaia-booting");
    const boot = document.querySelector("#gaia-boot");
    if (boot) boot.hidden = true;
    const opening = document.querySelector("#gaia-opening");
    if (opening) {
      opening.hidden = true;
      opening.inert = true;
      opening.setAttribute("aria-hidden", "true");
    }
    document.body.classList.remove("gaia-opening-active", "opening-active");
    window.dispatchEvent(new CustomEvent("gaia:opening-complete", { detail: { destination: "exploration" } }));
  });
  const characterTrigger = page.locator("#intro-character-jump");
  await characterTrigger.waitFor({ state: "visible", timeout: 15_000 });
  await characterTrigger.focus();
  await characterTrigger.click();
  await page.locator("#character-book-layer").waitFor({ state: "visible", timeout: 15_000 });
  await page.waitForFunction(() => document.activeElement?.id === "character-book-close");
  await page.locator("#character-book-close").click();
  await page.locator("#character-book-layer").waitFor({ state: "hidden", timeout: 5_000 });
  await page.waitForFunction(() => document.activeElement?.id === "intro-character-jump");
  await context.close();

  const recoveryContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const recoveryPage = await recoveryContext.newPage();
  attachDiagnostics(recoveryPage, "image-recovery", { allowAbortedImage: true });
  let interruptFinalSheet = true;
  await recoveryPage.route("**/10-final-keyvisual.png*", async (route) => {
    if (interruptFinalSheet) {
      interruptFinalSheet = false;
      await route.abort("failed");
    } else {
      await route.continue();
    }
  });
  await recoveryPage.goto(new URL("/#character", baseUrl).href, { waitUntil: "domcontentloaded" });
  await recoveryPage.locator("#character-book-layer").waitFor({ state: "visible", timeout: 15_000 });
  await waitForPageImage(recoveryPage, "01");
  await recoveryPage.locator('[data-character-page="9"]').click();
  await recoveryPage.waitForFunction(() => document.querySelector("#character-book-layer")?.dataset.imageState === "error");
  const failureState = await recoveryPage.locator("#character-book-image").evaluate((element) => ({
    naturalWidth: element.naturalWidth,
    statusVisible: !document.querySelector("#character-book-image-state")?.hidden,
    statusText: document.querySelector("#character-book-image-state")?.textContent.trim(),
  }));
  assert(failureState.naturalWidth > 0, "A failed setting sheet left the viewer visually blank");
  assert.equal(failureState.statusVisible, true, "A failed setting sheet has no visible retry state");
  assert.match(failureState.statusText, /クリックで再試行/u, "The image failure state does not explain recovery");
  await recoveryPage.locator("#character-book-page").click();
  await waitForPageImage(recoveryPage, "10");
  assert.equal(await recoveryPage.locator("#character-book-layer").getAttribute("data-image-state"), "ready");
  await recoveryContext.close();

  assert.deepEqual(report.consoleErrors, [], `Console errors: ${JSON.stringify(report.consoleErrors)}`);
  assert.deepEqual(report.pageErrors, [], `Page errors: ${JSON.stringify(report.pageErrors)}`);
  assert.deepEqual(report.responses404, [], `404 responses: ${JSON.stringify(report.responses404)}`);
  report.status = "passed";
  console.log(JSON.stringify(report, null, 2));
} catch (error) {
  report.status = "failed";
  report.error = error.stack || String(error);
  console.error(JSON.stringify(report, null, 2));
  process.exitCode = 1;
} finally {
  await browser.close();
}
