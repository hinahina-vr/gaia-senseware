import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright-core";

const base = process.argv[2] || "http://127.0.0.1:4397";
const output = path.resolve(process.argv[3] || "artifacts/sound-lock");
fs.mkdirSync(output, { recursive: true });
const report = { status: "running", scans: [], errors: [] };
const browser = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
const heard = page => page.evaluate(() => GaiaOpeningAudio.getHeardTracks().sort());
const open = async page => {
  await page.evaluate(() => { location.hash = "sound"; });
  await page.waitForFunction(() => document.querySelector("#sound-layer")?.classList.contains("is-open"));
};
const waitHeard = (page, track) => page.waitForFunction(key => GaiaOpeningAudio.hasTrackBeenHeard(key), track);
const inspect = page => page.evaluate(() => {
  const layer = document.querySelector("#sound-layer");
  const layout = layer.querySelector(".sound-layout");
  return {
    unlocked: [...layer.querySelectorAll("[data-sound-track]:not(:disabled)")].map(b => b.dataset.soundTrack),
    locked: [...layer.querySelectorAll("[data-sound-track]:disabled")].map(b => ({ title: b.querySelector("strong").textContent, aria: b.getAttribute("aria-label"), morph: b.querySelector("canvas").dataset.title })),
    title: layer.querySelector("#sound-track-title").textContent,
    cover: layer.querySelector(".sound-cover-art img").getAttribute("src"),
    playDisabled: layer.querySelector("#sound-play").disabled,
    seekDisabled: layer.querySelector("#sound-progress").disabled,
    spoilers: /Sensory Horizon|二百七十万年後|Beyond専用曲|雪火、軌道の外へ/.test(layer.textContent),
    overflow: layout.scrollWidth - layout.clientWidth,
    pageOverflow: document.documentElement.scrollWidth - innerWidth,
  };
});

try {
  for (const width of [1440, 390, 320]) {
    const context = await browser.newContext({ viewport: { width, height: width === 1440 ? 900 : 844 }, hasTouch: width < 500, isMobile: width < 500 });
    const page = await context.newPage();
    page.on("pageerror", error => report.errors.push(error.message));
    const forbiddenCovers = [];
    page.on("request", request => { if (/galactic-senses|pregeometry-loom/.test(request.url())) forbiddenCovers.push(request.url()); });
    await page.goto(`${base}/#sound`, { waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => document.querySelector("#sound-layer")?.classList.contains("is-open") && document.querySelector("#gaia-boot")?.hidden);
    await page.waitForTimeout(500);
    const fresh = await inspect(page);
    assert.deepEqual(fresh.unlocked, []);
    assert.equal(fresh.locked.length, 12);
    assert(fresh.locked.every(t => t.title === "未解放" && t.aria.includes("未解放") && !t.morph));
    assert(fresh.playDisabled && fresh.seekDisabled && !fresh.cover && !fresh.spoilers);
    assert(fresh.overflow <= 1 && fresh.pageOverflow <= 1);
    await page.screenshot({ path: path.join(output, `${width}-fresh.png`) });
    await page.locator('[data-sound-track="trueend"]').dispatchEvent("pointermove", { pointerType: "mouse", clientX: 50, clientY: 50 });
    await page.locator('[data-sound-track="trueend"]').dispatchEvent("click");
    await page.locator("#sound-play").dispatchEvent("click");
    await page.evaluate(() => document.body.dispatchEvent(new KeyboardEvent("keydown", { code: "Space", bubbles: true })));
    await page.waitForTimeout(150);
    assert.equal(await page.locator(".is-locked.is-morph-focus").count(), 0);
    assert.deepEqual(await heard(page), []);
    assert.equal(await page.evaluate(() => GaiaOpeningAudio.getState().muted), true);

    await page.evaluate(async () => { await GaiaOpeningAudio.preloadTrack("trueend"); await GaiaOpeningAudio.switchTrack("trueend", 0); });
    await page.waitForTimeout(400);
    assert.deepEqual(await heard(page), []);
    assert.equal((await inspect(page)).spoilers, false);
    assert.deepEqual(forbiddenCovers, []);

    await page.locator("#sound-close").click();
    await page.evaluate(async () => { await GaiaOpeningAudio.switchTrack("opening", 0); await GaiaOpeningAudio.start(.18); });
    await waitHeard(page, "opening");
    await open(page);
    await page.waitForFunction(() => document.querySelector("#sound-track-title").textContent === "Planet Forecast - Hope");
    assert.deepEqual((await inspect(page)).unlocked, ["opening"]);
    await page.waitForTimeout(1800);
    await page.screenshot({ path: path.join(output, `${width}-opening-heard.png`) });

    await page.locator("#sound-close").click();
    await page.evaluate(() => GaiaOpeningAudio.switchTrack("story", 0));
    await waitHeard(page, "story");
    await page.evaluate(async () => { await GaiaOpeningAudio.setMuted(true); await GaiaOpeningAudio.switchTrack("trueend", 0); });
    await open(page);
    const muted = await inspect(page);
    assert.deepEqual(muted.unlocked, ["opening", "story"]);
    assert(muted.playDisabled && !muted.cover && !muted.spoilers);
    await page.locator('[data-sound-track="opening"]').click();
    await page.waitForFunction(() => document.querySelector("#sound-track-title").textContent === "Planet Forecast - Hope");
    await page.locator('[data-sound-track="story"]').focus();
    await page.keyboard.press("ArrowRight");
    assert.equal(await page.evaluate(() => document.activeElement.dataset.soundTrack), "opening", "arrow keys skip locked tracks");
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => document.querySelectorAll("[data-sound-track]:not(:disabled)").length === 2);
    assert.deepEqual(await heard(page), ["opening", "story"]);
    assert.equal((await inspect(page)).spoilers, false);
    assert.deepEqual(forbiddenCovers, []);

    if (width === 1440) {
      const sensors = await context.newPage();
      sensors.on("pageerror", error => report.errors.push(error.message));
      await sensors.goto(`${base}/sensors/`, { waitUntil: "domcontentloaded" });
      await sensors.waitForFunction(() => Boolean(window.GaiaOpeningAudio));
      await sensors.evaluate(async () => { await GaiaOpeningAudio.switchTrack("sensorfield", 0); await GaiaOpeningAudio.start(.18); });
      await waitHeard(sensors, "moonbook");
      await page.waitForFunction(() => !document.querySelector('[data-sound-track="moonbook"]').disabled);
      assert.deepEqual(await heard(page), ["moonbook", "opening", "story"]);
      await sensors.close();
    }
    report.scans.push({ width, fresh, final: await inspect(page), heard: await heard(page), forbiddenCovers });
    console.log(`${width}px: fresh locks, no spoiler images/text, guarded controls, audible-only unlocks and persistence PASS`);
    await context.close();
  }
  // Legacy story completion is not evidence of which recordings were audible.
  const legacy = await browser.newPage();
  await legacy.addInitScript(() => localStorage.setItem("gaiaSensewareNovel:progress", JSON.stringify({ clear: true, archivesUnlocked: true })));
  await legacy.goto(`${base}/#sound`);
  await legacy.waitForFunction(() => document.querySelector("#sound-layer")?.classList.contains("is-open"));
  assert.deepEqual((await inspect(legacy)).unlocked, []);
  await legacy.close();
  assert.deepEqual(report.errors, []);
  report.status = "passed";
} catch (error) {
  report.status = "failed"; report.failure = error.stack; throw error;
} finally {
  fs.writeFileSync(path.join(output, "report.json"), JSON.stringify(report, null, 2));
  await browser.close();
}
