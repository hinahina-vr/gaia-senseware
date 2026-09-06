import assert from "node:assert/strict";
import { chromium } from "playwright-core";
const base = process.argv[2] || "http://127.0.0.1:4397";
const browser = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
try {
  const page = await browser.newPage();
  await page.clock.install({ time: new Date("2026-09-07T03:00:00Z") });
  // Same local origin, isolated from the map's animation/network workload.
  await page.goto(`${base}/realtime-exhibits.css`);
  await page.evaluate(async () => {
    const { createRealtimeStatus, updateRealtimeStatus } = await import("./src/exploration/realtime-exhibit-status.js");
    const status = createRealtimeStatus();
    document.body.replaceChildren(status);
    globalThis.refreshFixture = () => updateRealtimeStatus(status, { sourceState: "LIVE", observedAt: new Date(Date.now()).toISOString(), source: "Test public feed" });
    refreshFixture();
  });
  const state = () => page.locator(".gaia-realtime-status").getAttribute("data-realtime-state");
  assert.equal(await state(), "live");
  await page.clock.fastForward(25 * 3600_000);
  assert.equal(await state(), "delayed", "A visible installation must not keep yesterday's LIVE badge");
  await page.evaluate(() => {
    refreshFixture();
    Object.defineProperty(document, "hidden", { configurable: true, get: () => true });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await page.clock.fastForward(25 * 3600_000);
  assert.equal(await state(), "live", "Hidden tabs should not keep rewriting UI");
  await page.evaluate(() => { delete document.hidden; document.dispatchEvent(new Event("visibilitychange")); });
  assert.equal(await state(), "delayed", "Returning to the tab must immediately re-evaluate freshness");
  console.log("Realtime status: visible age transition and suspended-tab return passed without provider polling.");
} finally {
  await browser.close();
}
