import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const [moduleRoot, executablePath, outputArgument, baseUrl = "http://127.0.0.1:4397"] = process.argv.slice(2);
if (!moduleRoot || !executablePath) throw new Error("Playwright module and browser executable are required");
const playwrightEntry = fs.existsSync(path.join(moduleRoot, "index.mjs"))
  ? path.join(moduleRoot, "index.mjs")
  : path.join(moduleRoot, "playwright", "index.mjs");
const { chromium } = await import(pathToFileURL(playwrightEntry).href);
const outputDir = path.resolve(outputArgument || "artifacts/opening-title-load-integration");
fs.mkdirSync(outputDir, { recursive: true });

const canonicalFile = "novel-bg-festival-five-plane-projection-v1.png";
const forbiddenFiles = [
  "novel-bg-exhibition-v3.png",
  "novel-bg-exhibition-v2.png",
  "novel-bg-festival-projection-conversation-v1.png",
  "novel-bg-online-night-v2.png",
  "novel-bg-production-night-v2.png",
  "concept-04-co-created-future.png",
  "concept-01-earth-as-partner.png",
];
const viewports = [
  { name: "pc-1440", width: 1440, height: 900 },
  { name: "mobile-390", width: 390, height: 844, mobile: true },
];
const savedProgress = {
  storyVersion: 10,
  stepId: "welcome_chat_038",
  reachedSceneIds: [],
  viewed: {},
  evesRoute: [],
  observationOrder: null,
  editorialChoice: null,
  reflectionIds: [],
  resultTone: null,
  demoInterest: "気温の長期変化",
  metCharacters: { mizuha: true, amane: true, sakuya: true },
  audio: { muted: true, volume: 0.1 },
  readStepIds: [],
  clear: false,
  archivesUnlocked: false,
  sessionId: "opening-title-load-integration",
};
const report = {
  status: "running",
  baseUrl,
  viewports,
  flows: [],
  consoleErrors: [],
  pageErrors: [],
  responses404: [],
};

const browser = await chromium.launch({ headless: true, executablePath, args: ["--no-first-run", "--disable-background-networking"] });
try {
  for (const viewport of viewports) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      hasTouch: Boolean(viewport.mobile),
      isMobile: Boolean(viewport.mobile),
      reducedMotion: "no-preference",
    });
    await context.addInitScript((progress) => {
      localStorage.clear();
      localStorage.setItem("gaiaSensewareNovel:manual-saves", JSON.stringify([{
        progress,
        savedAt: 1786597200000,
        meta: { title: "閉場後の展示ホール", excerpt: "チャットの保存地点" },
      }]));
      localStorage.setItem("gaiaSensewareNovel:config:v2", JSON.stringify({ messageSpeedPercent: 400, reducedMotion: true }));
    }, savedProgress);
    const page = await context.newPage();
    const requests = [];
    page.on("request", (request) => requests.push(request.url()));
    page.on("console", (message) => { if (message.type() === "error") report.consoleErrors.push(`${viewport.name}: ${message.text()}`); });
    page.on("pageerror", (error) => report.pageErrors.push(`${viewport.name}: ${error.message}`));
    page.on("response", (response) => { if (response.status() === 404) report.responses404.push(`${viewport.name}: ${response.url()}`); });
    await page.addInitScript(() => {
      globalThis.__qaVisible = (element) => {
        if (!element || element.hidden || element.closest("[hidden]")) return false;
        const style = getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        return style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity || 1) > 0 && rect.width > 0 && rect.height > 0;
      };
    });

    await page.goto(new URL("/", baseUrl).href, { waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => Boolean(globalThis.GaiaNovel));
    await page.waitForFunction(() => !document.querySelector("#gaia-opening")?.classList.contains("is-preloading"), null, { timeout: 10000 });
    await page.waitForFunction(() => __qaVisible(document.querySelector("#gaia-opening-skip")));
    const opening = await page.evaluate(() => {
      const copy = [...document.querySelectorAll(".gaia-vn-panel-character .gaia-vn-character-copy")];
      const byName = (name) => copy.find((node) => node.querySelector("h2")?.textContent.trim() === name);
      const read = (name) => {
        const node = byName(name);
        return {
          quote: node?.querySelector("strong")?.textContent.trim(),
          reply: node?.querySelector(".gaia-vn-character-reply")?.textContent.trim(),
        };
      };
      return {
        mizuha: read("ミズハ"),
        amane: read("アマネ"),
        soundGateCount: document.querySelectorAll("#gaia-opening-sound-gate").length,
        overflowX: document.documentElement.scrollWidth - innerWidth,
        overflowY: document.documentElement.scrollHeight - innerHeight,
      };
    });
    assert.deepEqual(opening.mizuha, {
      quote: "「海も、空も、生命も。互いに変え合って、今の地球になりましたの。」",
      reply: "生命のつながりを、ひとつの地球として感じる。",
    });
    assert.deepEqual(opening.amane, {
      quote: "「変わらないものって、変わり続けていることだけなのかもね。」",
      reply: "変化の連なりを、時間の中で見る。",
    });
    assert.equal(opening.soundGateCount, 0);
    assert(opening.overflowX <= 1 && opening.overflowY <= 1);

    await page.screenshot({ path: path.join(outputDir, `${viewport.name}-opening.png`), animations: "disabled" });
    await page.locator("#gaia-opening-skip").click();
    await page.waitForFunction(() => __qaVisible(document.querySelector("#gaia-opening-route-story")));
    await page.waitForFunction(() => __qaVisible(document.querySelector("#gaia-opening-sound-modal")));
    await page.locator("#gaia-opening-sound-off").click();
    await page.locator("#gaia-opening-sound-start").click();
    await page.waitForFunction(() => !__qaVisible(document.querySelector("#gaia-opening-sound-modal")));
    await page.locator("#gaia-opening-route-story").click();
    await page.waitForFunction(() => __qaVisible(document.querySelector("#novel-title-screen")), null, { timeout: 10000 });
    const title = await page.evaluate(() => ({
      titleVisible: __qaVisible(document.querySelector("#novel-title-screen")),
      runtimeVisible: __qaVisible(document.querySelector("#novel-runtime")),
      subtitle: document.querySelector(".novel-title-sub")?.textContent.trim(),
      resumeVisible: __qaVisible(document.querySelector("#novel-resume-button")),
      resumeText: document.querySelector("#novel-resume-button")?.textContent.trim(),
      resumeExpanded: document.querySelector("#novel-resume-button")?.getAttribute("aria-expanded"),
      obsoleteTitleLoadCount: document.querySelectorAll("#novel-title-load-button").length,
      actions: [...document.querySelectorAll(".novel-title-actions > button")].map((button) => button.textContent.replace(/\s+/gu, " ").trim()),
      overflowX: document.documentElement.scrollWidth - innerWidth,
      overflowY: document.documentElement.scrollHeight - innerHeight,
    }));
    assert(title.titleVisible && !title.runtimeVisible && title.resumeVisible);
    assert.equal(title.subtitle, "『記録にないことを、勝手に事実へ変えない。』");
    assert.equal(title.resumeText, "続きから");
    assert.equal(title.resumeExpanded, "false");
    assert.equal(title.obsoleteTitleLoadCount, 0);
    assert.equal(title.actions.some((text) => text.includes("セーブデータから")), false);
    assert(title.overflowX <= 1 && title.overflowY <= 1);
    await page.screenshot({ path: path.join(outputDir, `${viewport.name}-title.png`), animations: "disabled" });

    await page.locator("#novel-resume-button").click();
    await page.waitForFunction(() => __qaVisible(document.querySelector("#novel-save-panel")));
    const loadPanel = await page.evaluate(() => ({
      visible: __qaVisible(document.querySelector("#novel-save-panel")),
      title: document.querySelector("#novel-save-title")?.textContent.trim(),
      loadSelected: document.querySelector("#novel-load-tab")?.getAttribute("aria-selected"),
      saveSelected: document.querySelector("#novel-save-tab")?.getAttribute("aria-selected"),
      saveDisabled: document.querySelector("#novel-save-tab")?.disabled,
      resumeExpanded: document.querySelector("#novel-resume-button")?.getAttribute("aria-expanded"),
      slots: document.querySelectorAll(".novel-save-slot").length,
      enabledSlots: document.querySelectorAll(".novel-save-slot[aria-disabled='false']").length,
      focusedSlot: document.activeElement?.matches(".novel-save-slot[data-slot-index='0']"),
      runtimeVisible: __qaVisible(document.querySelector("#novel-runtime")),
      overflowX: document.documentElement.scrollWidth - innerWidth,
      overflowY: document.documentElement.scrollHeight - innerHeight,
    }));
    assert(loadPanel.visible && loadPanel.title === "LOAD");
    assert.equal(loadPanel.loadSelected, "true");
    assert.equal(loadPanel.saveSelected, "false");
    assert.equal(loadPanel.saveDisabled, true);
    assert.equal(loadPanel.resumeExpanded, "true");
    assert.equal(loadPanel.slots, 6);
    assert.equal(loadPanel.enabledSlots, 1);
    assert(loadPanel.focusedSlot && !loadPanel.runtimeVisible && loadPanel.overflowX <= 1 && loadPanel.overflowY <= 1);
    await page.screenshot({ path: path.join(outputDir, `${viewport.name}-load.png`), animations: "disabled" });

    const requestOffset = requests.length;
    await page.locator(".novel-save-slot[data-slot-index='0']").click();
    await page.waitForFunction(() => document.querySelector("#novel-layer")?.dataset.stepId === "welcome_chat_038");
    await page.waitForTimeout(350);
    const restored = await page.evaluate(() => {
      const layer = document.querySelector("#novel-layer");
      const workspace = document.querySelector(".novel-slack-workspace");
      const rect = workspace.getBoundingClientRect();
      const images = [...document.querySelectorAll(".novel-slack-avatar img")];
      const apple = document.querySelector('.novel-slack-avatar[data-symbol="green-apple"] .novel-slack-apple-body');
      return {
        stepId: layer.dataset.stepId,
        titleVisible: __qaVisible(document.querySelector("#novel-title-screen")),
        runtimeVisible: __qaVisible(document.querySelector("#novel-runtime")),
        loadVisible: __qaVisible(document.querySelector("#novel-save-panel")),
        backgroundImage: getComputedStyle(layer).backgroundImage,
        centerDeviationX: rect.left + rect.width / 2 - innerWidth / 2,
        centerDeviationY: rect.top + rect.height / 2 - innerHeight / 2,
        workspaceInViewport: rect.left >= 0 && rect.top >= 0 && rect.right <= innerWidth + 1 && rect.bottom <= innerHeight + 1,
        dialogueHidden: document.querySelector("#novel-dialogue")?.hidden,
        vnText: document.querySelector("#novel-text")?.textContent,
        vnSpeaker: document.querySelector("#novel-speaker")?.textContent,
        appleColor: apple ? getComputedStyle(apple).fill : "",
        appleImageCount: document.querySelectorAll('.novel-slack-avatar[data-symbol="green-apple"] img').length,
        v2Mascots: images.filter((image) => /slack-avatar-(?:amane|mizuha)-v2\.webp/u.test(image.currentSrc)).map((image) => ({
          src: image.currentSrc,
          complete: image.complete,
          naturalWidth: image.naturalWidth,
          naturalHeight: image.naturalHeight,
          rect: image.closest(".novel-slack-avatar").getBoundingClientRect().toJSON(),
        })),
        v1Mascots: images.filter((image) => /slack-avatar-(?:amane|mizuha)-v1\.webp/u.test(image.currentSrc)).length,
        humanAvatars: document.querySelectorAll(".novel-slack-avatar[data-human-avatar], .novel-slack-avatar img[src*='/characters/']").length,
        overflowX: document.documentElement.scrollWidth - innerWidth,
        overflowY: document.documentElement.scrollHeight - innerHeight,
      };
    });
    assert(restored.stepId === "welcome_chat_038" && restored.runtimeVisible && !restored.titleVisible && !restored.loadVisible);
    assert(restored.backgroundImage.includes(canonicalFile));
    assert(Math.abs(restored.centerDeviationX) <= 1 && Math.abs(restored.centerDeviationY) <= 1 && restored.workspaceInViewport);
    assert(restored.dialogueHidden && restored.vnText === "" && restored.vnSpeaker === "");
    assert.equal(restored.appleColor, "rgb(88, 168, 76)");
    assert.equal(restored.appleImageCount, 0);
    assert(restored.v2Mascots.length > 0 && restored.v2Mascots.every((image) => image.complete && image.naturalWidth === 512 && image.naturalHeight === 512 && image.rect.width >= 24));
    assert.equal(restored.v1Mascots, 0);
    assert.equal(restored.humanAvatars, 0);
    assert(restored.overflowX <= 1 && restored.overflowY <= 1);
    const runtimeRequests = requests.slice(requestOffset);
    assert.equal(runtimeRequests.filter((url) => forbiddenFiles.some((file) => url.includes(file))).length, 0);
    assert.equal(runtimeRequests.filter((url) => /slack-avatar-(?:amane|mizuha)-v1\.webp(?:\?|$)/u.test(url)).length, 0);
    await page.screenshot({ path: path.join(outputDir, `${viewport.name}-restored-chat.png`), animations: "disabled" });

    report.flows.push({ viewport: viewport.name, opening, title, loadPanel, restored, runtimeRequests, passed: true });
    await context.close();
  }
  assert.equal(report.consoleErrors.length, 0, `console errors: ${report.consoleErrors.join(" | ")}`);
  assert.equal(report.pageErrors.length, 0, `page errors: ${report.pageErrors.join(" | ")}`);
  assert.equal(report.responses404.length, 0, `404 responses: ${report.responses404.join(" | ")}`);
  report.status = "passed";
  console.log(`opening/title/LOAD integration passed: ${report.flows.length} viewport flows`);
} catch (error) {
  report.status = "failed";
  report.error = error instanceof Error ? error.stack : String(error);
  throw error;
} finally {
  fs.writeFileSync(path.join(outputDir, "report.json"), `${JSON.stringify(report, null, 2)}\n`, "utf8");
  await browser.close();
}
