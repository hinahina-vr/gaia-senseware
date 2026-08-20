import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const [moduleRoot, executablePath, outputArgument, baseUrl = "http://127.0.0.1:4428"] = process.argv.slice(2);
if (!moduleRoot || !executablePath) throw new Error("Playwright module and browser executable are required");
const playwrightEntry = fs.existsSync(path.join(moduleRoot, "index.mjs"))
  ? path.join(moduleRoot, "index.mjs")
  : path.join(moduleRoot, "playwright", "index.mjs");
const { chromium } = await import(pathToFileURL(playwrightEntry).href);
const outputDir = path.resolve(outputArgument || "artifacts/story-map-modal-browser");
fs.mkdirSync(outputDir, { recursive: true });

const errors = [];
const browser = await chromium.launch({ headless: true, executablePath });
const stateForMap = () => ({
  storyVersion: 10,
  stepId: "map_mode01_004",
  reachedSceneIds: ["festival_concept", "map_mode01"],
  viewed: {},
  evesRoute: [],
  observationOrder: null,
  editorialChoice: null,
  reflectionIds: [],
  resultTone: null,
  demoInterest: "気候の長期変化",
  metCharacters: { mizuha: true, amane: true, sakuya: true },
  audio: { muted: true, volume: 0.37 },
  readStepIds: ["map_mode01_001", "map_mode01_002", "map_mode01_003"],
  clear: false,
  archivesUnlocked: false,
  sessionId: `story-map-modal-${Date.now()}`,
});

const bootAtMap = async (viewport, label) => {
  const context = await browser.newContext({ viewport, reducedMotion: "no-preference" });
  const page = await context.newPage();
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(`${label} console: ${message.text()}`);
  });
  page.on("pageerror", (error) => errors.push(`${label} page: ${error.message}`));
  await page.goto(new URL("/story", baseUrl).href, { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => Boolean(globalThis.GaiaNovel && globalThis.GAIA_NOVEL_STORY));
  await page.evaluate((state) => {
    localStorage.setItem("gaiaSensewareNovel:progress", JSON.stringify(state));
    localStorage.setItem("gaiaSensewareNovel:manual-saves", JSON.stringify([{
      progress: state,
      savedAt: Date.now(),
      meta: { title: "STORY MAP MODAL QA", excerpt: state.stepId },
    }]));
    localStorage.setItem("gaiaSensewareNovel:config:v2", JSON.stringify({
      messageSpeedPercent: 400,
      reducedMotion: false,
    }));
  }, stateForMap());
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => Boolean(globalThis.GaiaNovel));
  await page.evaluate(() => globalThis.GaiaNovel.open());
  await page.locator("#novel-resume-button").click();
  await page.locator("#novel-save-panel").waitFor({ state: "visible", timeout: 15_000 });
  await page.locator('.novel-save-slot[data-slot-index="0"]').click();
  await page.waitForFunction(() => (
    document.body.dataset.novelInteractionState === "open"
    && document.querySelector("#japan-layer")?.dataset.storyMode === "map01"
  ), { timeout: 15_000 });
  return { context, page };
};

const scanOpenModal = async (page) => page.evaluate(() => {
  const map = document.querySelector("#japan-layer");
  const novel = document.querySelector("#novel-layer");
  const slider = map?.querySelector("[data-signal-time]");
  const rect = map?.getBoundingClientRect();
  const mapStyle = map ? getComputedStyle(map) : null;
  const novelStyle = novel ? getComputedStyle(novel) : null;
  return {
    viewport: { width: innerWidth, height: innerHeight },
    rect: rect?.toJSON(),
    mapPosition: mapStyle?.position,
    mapRadius: mapStyle?.borderRadius,
    mapRole: map?.getAttribute("role"),
    mapAriaModal: map?.getAttribute("aria-modal"),
    novelHidden: novel?.hidden,
    novelDisplay: novelStyle?.display,
    novelOpacity: Number(novelStyle?.opacity || 0),
    guideCount: document.querySelectorAll(".story-map-guide").length,
    dockCount: document.querySelectorAll('.story-detour-dock[data-kind="map01"]').length,
    returnCount: document.querySelectorAll("#story-detour-return").length,
    nativeCloseDisplay: getComputedStyle(map?.querySelector(".japan-close")).display,
    readingGuideDisplay: getComputedStyle(map?.querySelector(".map-reading-guide")).display,
    label: map?.querySelector("[data-signal-time-label]")?.textContent || "",
    sliderValue: Number(slider?.value || 0),
    overflowX: document.documentElement.scrollWidth > innerWidth + 1,
    overflowY: document.documentElement.scrollHeight > innerHeight + 1,
  };
});

const assertModal = (scan, mobile = false) => {
  assert.equal(scan.mapPosition, "fixed");
  assert.equal(scan.mapRole, "dialog");
  assert.equal(scan.mapAriaModal, "true");
  assert.equal(scan.novelHidden, false);
  assert.notEqual(scan.novelDisplay, "none");
  assert(scan.novelOpacity > 0, "story underlay must remain visible");
  assert.equal(scan.guideCount, 0);
  assert.equal(scan.dockCount, 0);
  assert.equal(scan.returnCount, 0);
  assert.equal(scan.nativeCloseDisplay, "none");
  assert.equal(scan.readingGuideDisplay, "none");
  assert.match(scan.label, /3×/u);
  assert.equal(scan.overflowX, false);
  assert.equal(scan.overflowY, false);
  assert(scan.rect && scan.rect.width < scan.viewport.width && scan.rect.height < scan.viewport.height);
  assert(Math.abs((scan.rect.x + scan.rect.width / 2) - scan.viewport.width / 2) <= 2);
  assert(Math.abs((scan.rect.y + scan.rect.height / 2) - scan.viewport.height / 2) <= 2);
  assert(parseFloat(scan.mapRadius) >= (mobile ? 12 : 16));
};

const desktop = await bootAtMap({ width: 1440, height: 900 }, "desktop");
const desktopOpen = await scanOpenModal(desktop.page);
assertModal(desktopOpen);
await desktop.page.screenshot({ path: path.join(outputDir, "desktop-open.png") });
const initialValue = desktopOpen.sliderValue;
await desktop.page.waitForTimeout(2500);
const advancedValue = Number(await desktop.page.locator("#japan-layer [data-signal-time]").inputValue());
assert(advancedValue > initialValue + 5, "triple-speed timeline did not advance");
const autoStartedAt = Date.now();
await desktop.page.waitForFunction(() => globalThis.GaiaNovel.getState().stepId === "map_mode01_005", { timeout: 23_000 });
const remainingMs = Date.now() - autoStartedAt;
assert(remainingMs < 21_500, `automatic return took too long: ${remainingMs}ms after initial scan`);
await desktop.page.waitForFunction(() => document.body.dataset.novelInteractionState === undefined);
const desktopClosed = await desktop.page.evaluate(() => ({
  stepId: globalThis.GaiaNovel.getState().stepId,
  mapHidden: document.querySelector("#japan-layer")?.hidden,
  novelHidden: document.querySelector("#novel-layer")?.hidden,
  usesExhibitionMapBackground: getComputedStyle(document.querySelector("#novel-layer")).backgroundImage.includes("event-cg-festival-map-transition-five-plane-v3.png"),
  usesTabletopMapBackground: getComputedStyle(document.querySelector("#novel-layer")).backgroundImage.includes("mode-map-v1.webp"),
  guideCount: document.querySelectorAll(".story-map-guide").length,
  returnCount: document.querySelectorAll("#story-detour-return").length,
}));
assert.deepEqual(desktopClosed, {
  stepId: "map_mode01_005",
  mapHidden: true,
  novelHidden: false,
  usesExhibitionMapBackground: true,
  usesTabletopMapBackground: false,
  guideCount: 0,
  returnCount: 0,
});
await desktop.page.screenshot({ path: path.join(outputDir, "desktop-return.png") });
await desktop.context.close();

const mobile = await bootAtMap({ width: 390, height: 844 }, "mobile");
const mobileOpen = await scanOpenModal(mobile.page);
assertModal(mobileOpen, true);
await mobile.page.screenshot({ path: path.join(outputDir, "mobile-open.png") });
await mobile.page.evaluate(() => window.dispatchEvent(new CustomEvent("gaia:story-mode-auto-complete", {
  detail: { kind: "map01", view: "timeline_complete" },
})));
await mobile.page.waitForFunction(() => globalThis.GaiaNovel.getState().stepId === "map_mode01_005", { timeout: 5_000 });
await mobile.context.close();

await browser.close();
assert.deepEqual(errors, []);
console.log(JSON.stringify({
  status: "passed",
  desktopOpen,
  desktopClosed,
  autoReturnWaitMs: remainingMs,
  mobileOpen,
  screenshots: [
    path.join(outputDir, "desktop-open.png"),
    path.join(outputDir, "desktop-return.png"),
    path.join(outputDir, "mobile-open.png"),
  ],
}, null, 2));
