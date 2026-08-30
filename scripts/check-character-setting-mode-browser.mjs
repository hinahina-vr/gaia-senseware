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
const outputDir = path.resolve(outputArgument || "E:/CodexData/temp/gaia-character-profile-browser");
fs.mkdirSync(outputDir, { recursive: true });

const viewports = [
  { name: "pc-1440", width: 1440, height: 900, mobile: false },
  { name: "pc-4k", width: 3840, height: 2160, mobile: false },
  { name: "mobile-390", width: 390, height: 844, mobile: true },
  { name: "reduced-motion", width: 1440, height: 900, mobile: false, reduced: true },
];
const report = { status: "running", baseUrl, scans: [], consoleErrors: [], pageErrors: [], responses404: [] };
const browser = await chromium.launch({ headless: true, executablePath });

const attachDiagnostics = (page, name) => {
  page.on("console", (message) => {
    if (message.type() === "error") report.consoleErrors.push(name + ": " + message.text());
  });
  page.on("pageerror", (error) => report.pageErrors.push(name + ": " + error.message));
  page.on("response", (response) => {
    if (response.status() === 404) report.responses404.push(name + ": " + response.url());
  });
};

const inspect = (page) => page.evaluate(() => {
  const layer = document.querySelector("#character-book-layer");
  const scroller = document.querySelector("#character-book-scroll");
  const hero = document.querySelector("#character-book-hero");
  const image = document.querySelector("#character-book-image");
  const canvas = document.querySelector("#character-book-webgl");
  const lead = document.querySelector(".character-book-lead");
  const quote = document.querySelector("#character-book-quote");
  const master = document.querySelector("#character-book-master");
  const rect = (element) => element?.getBoundingClientRect().toJSON();
  return {
    layerPosition: getComputedStyle(layer).position,
    layerRect: rect(layer),
    heroRect: rect(hero),
    imageRect: rect(image),
    canvasRect: rect(canvas),
    webglState: canvas?.dataset.webglState || "missing",
    webglRendered: canvas?.dataset.webglRendered || "false",
    webglWidth: canvas instanceof HTMLCanvasElement ? canvas.width : 0,
    webglHeight: canvas instanceof HTMLCanvasElement ? canvas.height : 0,
    webglOpacity: Number.parseFloat(getComputedStyle(canvas).opacity || "0"),
    imageSource: image?.currentSrc || "",
    imageAlt: image?.alt || "",
    selectors: document.querySelectorAll("[data-character-select]").length,
    activeSelectors: [...document.querySelectorAll("[data-character-select]")]
      .filter((button) => button.getAttribute("aria-current") === "true").length,
    profiles: document.querySelectorAll("[data-character-profile]").length,
    oldCompactProfiles: document.querySelectorAll(".character-book-hero-profile").length,
    current: document.querySelector("#character-book-current")?.textContent.trim(),
    title: document.querySelector("#character-book-page-title")?.textContent.replace(/\s+/gu, " ").trim(),
    code: document.querySelector("#character-book-code")?.textContent.trim(),
    profile: document.querySelector("#character-book-profile")?.textContent.trim(),
    profileLines: document.querySelectorAll("#character-book-profile > span").length,
    profileShadow: document.querySelector("#character-book-profile")
      ? getComputedStyle(document.querySelector("#character-book-profile")).textShadow
      : "none",
    quote: quote?.textContent.trim(),
    quoteWritingMode: quote ? getComputedStyle(quote).writingMode : "missing",
    statusRows: document.querySelectorAll(".character-book-hero-detail dl").length,
    masterRect: rect(master),
    characterId: layer?.dataset.characterId,
    bodyMode: document.body.classList.contains("character-mode-open"),
    ariaHidden: layer?.getAttribute("aria-hidden"),
    role: layer?.getAttribute("role"),
    modal: layer?.getAttribute("aria-modal"),
    scrollHeight: scroller?.scrollHeight || 0,
    clientHeight: scroller?.clientHeight || 0,
    overflowX: Math.max(0, document.documentElement.scrollWidth - innerWidth),
    leadOverflow: lead ? Math.max(0, lead.scrollWidth - lead.clientWidth) : -1,
  };
});

try {
  for (const viewport of viewports) {
    const context = await browser.newContext({
      viewport,
      hasTouch: viewport.mobile,
      reducedMotion: viewport.reduced ? "reduce" : "no-preference",
    });
    const page = await context.newPage();
    attachDiagnostics(page, viewport.name);
    await page.goto(new URL("/#character", baseUrl).href, { waitUntil: "domcontentloaded" });
    await page.locator("#character-book-layer").waitFor({ state: "visible", timeout: 15000 });
    await page.waitForFunction(() => {
      const image = document.querySelector("#character-book-image");
      return image?.complete && image.naturalWidth > 0
        && document.querySelector("#character-book-webgl")?.dataset.webglRendered === "true";
    });

    const initial = await inspect(page);
    assert.equal(initial.layerPosition, "fixed", viewport.name + ": character page is not an independent full-screen surface");
    assert.equal(initial.bodyMode, true, viewport.name + ": character body mode is missing");
    assert.equal(initial.ariaHidden, "false", viewport.name + ": dialog remains hidden");
    assert.equal(initial.role, "dialog", viewport.name + ": dialog role is missing");
    assert.equal(initial.modal, "true", viewport.name + ": modal state is missing");
    assert.equal(initial.selectors, 3, viewport.name + ": three-character selector is incomplete");
    assert.equal(initial.activeSelectors, 1, viewport.name + ": selector active state is ambiguous");
    assert.equal(initial.profiles, 0, viewport.name + ": duplicate lower profiles remain");
    assert.equal(initial.oldCompactProfiles, 0, viewport.name + ": old compact hero profile remains");
    assert.equal(initial.current, "01", viewport.name + ": Amane is not the opening character");
    assert.equal(initial.title, "あめ / アマネ", viewport.name + ": opening profile title is incorrect");
    assert.match(initial.imageSource, /amane-calm-07-v2\.png/u, viewport.name + ": opening character art is incorrect");
    assert.equal(initial.code, "AMANE / INFRASTRUCTURE / ELECTRICAL");
    assert.equal(initial.profile, "水色のショートボブと眠そうな目元が特徴の大学2年生。普段は無口で省エネ運転だが、配線やハードウェアの話になると途端にスイッチが入る。電気工事士・電験三種の資格を持ち、現場の機材設営から安全管理までを一手に担う実践派。");
    assert.equal(initial.profileLines, 3, viewport.name + ": Amane profile is not split at sentence endings");
    assert.notEqual(initial.profileShadow, "none", viewport.name + ": profile lacks contrast shadow");
    assert.equal(initial.quote, "「信号線とは違うの。一本飛んだら、本当に終わるよ」");
    assert.equal(initial.quoteWritingMode, "vertical-rl", viewport.name + ": character quote is not vertical");
    assert.equal(initial.statusRows, 0, viewport.name + ": FIELD / ROLE / TOOLS remain in the hero");
    assert(initial.imageAlt.length >= 10, viewport.name + ": hero character alt text is missing");
    assert.equal(initial.webglState, "ready", viewport.name + ": WebGL atmosphere did not initialize");
    assert.equal(initial.webglRendered, "true", viewport.name + ": WebGL atmosphere did not render");
    assert(initial.webglWidth > 0 && initial.webglHeight > 0, viewport.name + ": WebGL buffer is empty");
    assert(initial.webglOpacity > 0, viewport.name + ": WebGL atmosphere is not visible");
    assert(initial.canvasRect.left <= 0 && initial.canvasRect.top <= 0, viewport.name + ": WebGL canvas is offset");
    assert(initial.heroRect.height >= viewport.height * 0.9, viewport.name + ": hero does not occupy the viewport");
    assert(initial.scrollHeight > initial.clientHeight * 1.4, viewport.name + ": character reference document is missing");
    assert.equal(initial.overflowX, 0, viewport.name + ": page has horizontal overflow");
    if (!viewport.mobile) assert(initial.leadOverflow <= 1, viewport.name + ": one-line lead is clipped");

    await page.screenshot({ path: path.join(outputDir, viewport.name + "-character-hero.png"), fullPage: false });

    await page.locator('[data-character-select="mizuha"]').click();
    await page.waitForFunction(() => document.querySelector("#character-book-layer")?.dataset.characterId === "mizuha"
      && document.querySelector("#character-book-current")?.textContent.trim() === "02"
      && /mizuha-calm-07-v2\.png/u.test(document.querySelector("#character-book-image")?.currentSrc || ""));
    const mizuha = await inspect(page);
    assert.equal(mizuha.title, "みず / ミズハ", viewport.name + ": Mizuha profile did not update");
    assert.equal(mizuha.code, "MIZUHA / NARRATIVE / EARTH SCIENCE");
    assert.equal(mizuha.profile, "海色の長い髪とおっとりした丁寧語が印象的な大学2年生。地球の歴史や生き物の共進化に関心を持ち、システム全体のナラティブと概念設計を担当する。穏やかな見た目の一方で、データの出典や数字の正確さ、観測条件の厳密さには決して妥協しない。");
    assert.equal(mizuha.profileLines, 3, viewport.name + ": Mizuha profile is not split at sentence endings");
    assert.equal(mizuha.quote, "「46億年、ずっと変わり続けている星ですから」");
    assert.equal(mizuha.activeSelectors, 1, viewport.name + ": Mizuha selection produced multiple active portraits");

    await page.keyboard.press("ArrowRight");
    await page.waitForFunction(() => document.querySelector("#character-book-layer")?.dataset.characterId === "sakuya"
      && document.querySelector("#character-book-current")?.textContent.trim() === "03");
    const sakuya = await inspect(page);
    assert.equal(sakuya.title, "saku / サクヤ", viewport.name + ": keyboard character change failed");
    assert.match(sakuya.imageSource, /sakuya-calm-07-v1\.png/u, viewport.name + ": Sakuya art did not load");
    assert.equal(sakuya.profile, "海外からオンラインで参加している、サークル『惑星の放課後』のプロデューサー兼システムアーキテクト。普段のチャットでは無駄口を叩かないが、要件定義やデータ構造の議論では圧倒的な速度と解像度で仕様を組み上げる。プロジェクトの骨格を支える名付け親。");
    assert.equal(sakuya.profileLines, 3, viewport.name + ": Sakuya profile is not split at sentence endings");
    assert.equal(sakuya.quote, "「まだ気づいてないだけでしょ。世界はこんなにも満ちてるよ」");

    await page.locator("#character-book-master").scrollIntoViewIfNeeded();
    await page.waitForTimeout(viewport.reduced ? 50 : 220);
    const sectionState = await page.locator("#character-book-master").evaluate((element) => ({
      color: getComputedStyle(element).color,
      width: element.getBoundingClientRect().width,
    }));
    assert(sectionState.width > 0, viewport.name + ": reference section collapsed");
    assert.match(sectionState.color, /rgb/u, viewport.name + ": reference typography is not rendered");

    await page.screenshot({ path: path.join(outputDir, viewport.name + "-character-profile.png"), fullPage: false });
    await page.locator("#character-book-close").click();
    await page.locator("#character-book-layer").waitFor({ state: "hidden", timeout: 5000 });
    assert.equal(await page.evaluate(() => document.body.classList.contains("character-mode-open")), false);
    report.scans.push({ viewport, initial, mizuha, sakuya, sectionState });
    await context.close();
  }

  assert.deepEqual(report.consoleErrors, [], "console errors were detected");
  assert.deepEqual(report.pageErrors, [], "page errors were detected");
  assert.deepEqual(report.responses404, [], "404 responses were detected");
  report.status = "passed";
} finally {
  await browser.close();
  fs.writeFileSync(path.join(outputDir, "report.json"), JSON.stringify(report, null, 2));
}

console.log(JSON.stringify({ status: report.status, scans: report.scans.length, outputDir }, null, 2));
