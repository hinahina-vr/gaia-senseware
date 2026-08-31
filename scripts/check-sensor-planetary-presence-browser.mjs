import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const [moduleRoot, executablePath, outputArgument, baseUrl = "http://127.0.0.1:4499"] = process.argv.slice(2);
if (!moduleRoot || !executablePath) throw new Error("Playwright module and browser executable are required");
const playwrightEntry = fs.existsSync(path.join(moduleRoot, "index.mjs"))
  ? path.join(moduleRoot, "index.mjs")
  : path.join(moduleRoot, "playwright", "index.mjs");
const { chromium } = await import(pathToFileURL(path.resolve(playwrightEntry)).href);
const outputDir = path.resolve(outputArgument || "artifacts/sensor-planetary-presence");
fs.mkdirSync(outputDir, { recursive: true });

const browser = await chromium.launch({ headless: true, executablePath, args: ["--no-first-run", "--disable-background-networking"] });
const report = { status: "running", viewports: [], ownedPresence: null, fallback: null, consoleErrors: [], pageErrors: [] };

try {
  for (const viewport of [
    { name: "pc-1440", width: 1440, height: 900, reducedMotion: "no-preference" },
    { name: "mobile-390-reduced", width: 390, height: 844, reducedMotion: "reduce" },
  ]) {
    await fetch(new URL("/__qa/reset", baseUrl), { method: "POST" });
    const context = await browser.newContext({ viewport, reducedMotion: viewport.reducedMotion });
    const page = await context.newPage();
    monitorPage(page, viewport.name, report);
    await page.goto(new URL("/sensors/#map", baseUrl).href, { waitUntil: "domcontentloaded" });
    const field = page.locator(".sensor-sense-field");
    const panel = page.locator(".sensor-belonging");
    const sense = page.locator(".sensor-belonging-sense");
    const presence = page.locator(".sensor-presence-node");
    await field.waitFor({ state: "visible" });
    await panel.waitFor({ state: "visible" });
    assert.equal(await presence.isHidden(), true);
    assert.equal(await field.getAttribute("data-presence"), null);
    assert.match(await field.getAttribute("data-renderer"), /^(webgl|2d)$/u);
    assert(Number(await field.getAttribute("data-render-pixels")) <= 900_000);
    assert.equal(await field.getAttribute("data-motion"), viewport.reducedMotion === "reduce" ? "static" : "ambient");
    const targets = await page.locator(".sensor-belonging-sense, .sensor-belonging-join").evaluateAll((buttons) => buttons.map((button) => {
      const rect = button.getBoundingClientRect();
      return { width: rect.width, height: rect.height };
    }));
    assert(targets.every((target) => target.width >= 44 && target.height >= 44), `presence actions are too small: ${JSON.stringify(targets)}`);

    await sense.click();
    await presence.waitFor({ state: "visible" });
    assert.equal(await presence.getAttribute("data-state"), "present");
    assert.equal(await field.getAttribute("data-presence"), "present");
    assert(Number(await field.getAttribute("data-presence-count")) >= 1);
    assert.match(await panel.locator("small").first().textContent(), /YOU ARE PART OF THE FIELD/u);
    assert.match(await panel.locator("p").textContent(), /あなたも、この星を感じている一部/u);
    assert.match(await presence.textContent(), /YOU · SENSING/u);

    await page.locator(".sensor-map-marker[data-sensor-id='sensor_browserqa']").click();
    await page.waitForTimeout(700);
    assert.match(await panel.locator("p").textContent(), /あなたと.+同じ地球の「いま」/u);
    await page.locator(".sensor-oracle-trigger").dispatchEvent("click");
    await page.waitForFunction(() => document.querySelector(".sensor-oracle-receipt")?.classList.contains("is-received"));
    assert.equal(await presence.getAttribute("data-state"), "received");
    assert.match(await panel.locator("p").textContent(), /あなたの感覚へ届きました/u);
    assert(Number(await field.getAttribute("data-presence-count")) >= 2);

    if (viewport.reducedMotion === "reduce") {
      assert.equal(await presence.evaluate((node) => getComputedStyle(node, "::before").animationName), "none");
    }
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    assert(overflow <= 1, `horizontal overflow: ${overflow}`);
    await page.screenshot({ path: path.join(outputDir, `${viewport.name}.png`), fullPage: false });
    report.viewports.push({
      ...viewport,
      renderer: await field.getAttribute("data-renderer"),
      pixels: Number(await field.getAttribute("data-render-pixels")),
      presenceCount: Number(await field.getAttribute("data-presence-count")),
    });
    await context.close();
  }

  await fetch(new URL("/__qa/reset", baseUrl), { method: "POST" });
  await fetch(new URL("/api/auth/trial", baseUrl), { method: "POST" });
  await fetch(new URL("/api/web/v1/devices/pairing", baseUrl), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "ベランダ環境センサー" }),
  });
  const ownedContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const ownedPage = await ownedContext.newPage();
  monitorPage(ownedPage, "owned-pc", report);
  const socialLoaded = ownedPage.waitForResponse((response) => response.url().endsWith("/api/web/v1/social") && response.ok(), { timeout: 60_000 });
  await ownedPage.goto(new URL("/sensors/#map", baseUrl).href, { waitUntil: "domcontentloaded" });
  await socialLoaded;
  const ownedField = ownedPage.locator(".sensor-sense-field");
  const ownedPresence = ownedPage.locator(".sensor-presence-node");
  await ownedPresence.waitFor({ state: "visible" });
  assert.equal(await ownedPresence.getAttribute("data-state"), "owned");
  assert.equal(await ownedField.getAttribute("data-owned-node-count"), "1");
  assert.match(await ownedPage.locator(".sensor-belonging").textContent(), /YOUR NODES 01/u);
  assert.match(await ownedPage.locator(".sensor-belonging p").textContent(), /あなたと.+同じ地球の「いま」/u);

  await ownedPage.locator(".sensor-map-marker[data-sensor-id='sensor_browserqa']").click();
  await ownedPage.waitForTimeout(700);
  await ownedPage.locator("#public-sensor-detail [data-relationship='like']").dispatchEvent("click");
  await ownedPage.waitForFunction(() => document.querySelector(".sensor-presence-node")?.dataset.state === "responding");
  assert.match(await ownedPage.locator(".sensor-belonging p").textContent(), /あなたの「感じた」が返りました/u);
  await ownedPage.screenshot({ path: path.join(outputDir, "owned-response-pc.png"), fullPage: false });
  report.ownedPresence = {
    ownedNodeCount: Number(await ownedField.getAttribute("data-owned-node-count")),
    state: await ownedPresence.getAttribute("data-state"),
  };
  await ownedContext.close();

  await fetch(new URL("/__qa/reset", baseUrl), { method: "POST" });
  const fallbackContext = await browser.newContext({ viewport: { width: 1024, height: 720 } });
  const fallbackPage = await fallbackContext.newPage();
  monitorPage(fallbackPage, "canvas-fallback", report);
  await fallbackPage.addInitScript(() => {
    const getContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function patchedGetContext(type, ...options) {
      if (type === "webgl" || type === "experimental-webgl") return null;
      return getContext.call(this, type, ...options);
    };
  });
  await fallbackPage.goto(new URL("/sensors/#map", baseUrl).href, { waitUntil: "domcontentloaded" });
  const fallbackField = fallbackPage.locator(".sensor-sense-field");
  await fallbackField.waitFor({ state: "visible" });
  assert.equal(await fallbackField.getAttribute("data-renderer"), "2d");
  await fallbackPage.locator(".sensor-belonging-sense").click();
  await fallbackPage.locator(".sensor-presence-node").waitFor({ state: "visible" });
  assert.equal(await fallbackField.getAttribute("data-presence"), "present");
  report.fallback = { renderer: "2d", presence: "present" };
  await fallbackContext.close();

  assert.deepEqual(report.consoleErrors, []);
  assert.deepEqual(report.pageErrors, []);
  report.status = "passed";
  console.log(JSON.stringify(report, null, 2));
} finally {
  await browser.close();
}

function monitorPage(page, name, target) {
  page.on("console", (message) => {
    if (message.type() !== "error") return;
    const text = message.text();
    if (!/server responded with a status of 401\b/u.test(text)) target.consoleErrors.push(`${name}: ${text}`);
  });
  page.on("pageerror", (error) => target.pageErrors.push(`${name}: ${error.message}`));
}
