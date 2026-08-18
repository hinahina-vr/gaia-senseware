import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const [moduleRoot, executablePath, outputArgument, baseUrl = "http://127.0.0.1:4184"] = process.argv.slice(2);
if (!moduleRoot || !executablePath) throw new Error("Playwright module and browser executable are required");
const playwrightEntry = fs.existsSync(path.join(moduleRoot, "index.mjs"))
  ? path.join(moduleRoot, "index.mjs")
  : path.join(moduleRoot, "playwright", "index.mjs");
const { chromium } = await import(pathToFileURL(playwrightEntry).href);
const outputDir = path.resolve(outputArgument || "artifacts/campus-chat-channels-browser");
fs.mkdirSync(outputDir, { recursive: true });

const stepId = "welcome_chat_023";
const expectedChannels = [
  "大学からのお知らせ_公式",
  "class_ネットワーク産業論",
  "class_数理構造の発見と活用",
];
const viewports = [
  { name: "pc-1440", width: 1440, height: 900 },
  { name: "mobile-390", width: 390, height: 844 },
];
const report = { status: "running", baseUrl, scans: [], consoleErrors: [], pageErrors: [], responses404: [] };

const stateFor = (storyVersion, viewport) => ({
  storyVersion,
  stepId,
  reachedSceneIds: ["welcome_chat"],
  viewed: {},
  metCharacters: { mizuha: true, amane: true, sakuya: true },
  evesRoute: [],
  observationOrder: "LOCAL_FIRST",
  editorialChoice: null,
  reflectionIds: [],
  resultTone: null,
  demoInterest: "",
  audio: { muted: true, volume: 0 },
  readStepIds: [],
  clear: false,
  archivesUnlocked: false,
  sessionId: `campus-chat-channels-${viewport}`,
});

const browser = await chromium.launch({ headless: true, executablePath });
try {
  for (const viewport of viewports) {
    const context = await browser.newContext({ viewport, reducedMotion: "reduce" });
    const page = await context.newPage();
    page.on("console", (message) => { if (message.type() === "error") report.consoleErrors.push(`${viewport.name}: ${message.text()}`); });
    page.on("pageerror", (error) => report.pageErrors.push(`${viewport.name}: ${error.message}`));
    page.on("response", (response) => { if (response.status() === 404) report.responses404.push(`${viewport.name}: ${response.url()}`); });

    await page.goto(new URL("/story", baseUrl).href, { waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => Boolean(globalThis.GaiaNovel && globalThis.GAIA_NOVEL_STORY));
    const storyVersion = await page.evaluate(() => globalThis.GAIA_NOVEL_STORY.storyVersion);
    const progress = stateFor(storyVersion, viewport.name);
    await page.evaluate((candidate) => {
      localStorage.setItem("gaiaSensewareNovel:progress", JSON.stringify(candidate));
      localStorage.setItem("gaiaSensewareNovel:manual-saves", JSON.stringify([{
        progress: candidate,
        savedAt: Date.now(),
        meta: { title: "Campus channels QA", excerpt: candidate.stepId },
      }]));
      localStorage.setItem("gaiaSensewareNovel:config:v3", JSON.stringify({ messageSpeedPercent: 400, reducedMotion: true }));
      localStorage.setItem("gaia-senseware-bgm-volume", "0");
    }, progress);
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => Boolean(globalThis.GaiaNovel));
    await page.evaluate(() => globalThis.GaiaNovel.open());
    await page.locator("#novel-resume-button").click();
    await page.locator("#novel-save-panel").waitFor({ state: "visible" });
    await page.locator('.novel-save-slot[data-slot-index="0"]').click();
    await page.waitForFunction((id) => document.querySelector("#novel-layer")?.dataset.stepId === id, stepId);
    await page.locator(".novel-slack-workspace > aside").waitFor({ state: "visible" });
    await page.waitForFunction(() => {
      const images = [...document.querySelectorAll(".novel-slack-avatar img")];
      return images.length >= 3 && images.every((image) => image.complete && image.naturalWidth > 0);
    });
    await page.locator(".novel-slack-avatar img").evaluateAll((images) => Promise.all(images.map((image) => image.decode().catch(() => {}))));

    const scan = await page.evaluate(() => {
      const aside = document.querySelector(".novel-slack-workspace > aside");
      const asideRect = aside?.getBoundingClientRect();
      const channels = [...document.querySelectorAll(".novel-slack-school-channel")].map((channel) => {
        const rect = channel.getBoundingClientRect();
        return {
          text: channel.textContent?.trim() || "",
          channel: channel.dataset.channel || "",
          title: channel.getAttribute("title") || "",
          visible: rect.width > 0 && rect.height > 0,
          fullyInsideSidebar: Boolean(asideRect && rect.top >= asideRect.top && rect.bottom <= asideRect.bottom && rect.left >= asideRect.left && rect.right <= asideRect.right),
          clippedInline: channel.scrollWidth > channel.clientWidth + 1,
          lineHeight: Number.parseFloat(getComputedStyle(channel).lineHeight) || 0,
          height: rect.height,
        };
      });
      const current = aside?.querySelector(".is-current");
      const currentRect = current?.getBoundingClientRect();
      return {
        stepId: document.querySelector("#novel-layer")?.dataset.stepId || "",
        channels,
        currentText: current?.textContent?.trim() || "",
        currentAria: current?.getAttribute("aria-current") || "",
        currentVisible: Boolean(currentRect && currentRect.width > 0 && currentRect.height > 0),
        sidebarOverflowX: aside ? Math.max(0, aside.scrollWidth - aside.clientWidth) : -1,
        overflowX: Math.max(0, document.documentElement.scrollWidth - innerWidth),
        currentMessage: document.querySelector(".novel-slack-post.is-new .novel-slack-message")?.textContent || "",
        avatarImagesLoaded: [...document.querySelectorAll(".novel-slack-avatar img")].filter((image) => image.complete && image.naturalWidth > 0).length,
      };
    });
    assert.equal(scan.stepId, stepId, `${viewport.name}: target step did not render`);
    assert.deepEqual(scan.channels.map((channel) => channel.channel), expectedChannels, `${viewport.name}: school channel IDs differ`);
    assert.deepEqual(scan.channels.map((channel) => channel.title), expectedChannels, `${viewport.name}: full channel labels are unavailable`);
    assert.deepEqual(scan.channels.map((channel) => channel.text), expectedChannels.map((channel) => `# ${channel}`), `${viewport.name}: displayed channel labels differ`);
    assert(scan.channels.every((channel) => channel.visible && channel.fullyInsideSidebar), `${viewport.name}: a school channel is outside the sidebar`);
    if (viewport.name === "pc-1440") assert(scan.channels.every((channel) => !channel.clippedInline), "pc-1440: a school channel label is truncated");
    assert.equal(scan.currentText, "# 惑星の放課後", `${viewport.name}: story channel lost selection`);
    assert.equal(scan.currentAria, "page", `${viewport.name}: selected channel semantics are missing`);
    assert.equal(scan.currentVisible, true, `${viewport.name}: selected story channel is hidden`);
    assert.equal(scan.sidebarOverflowX, 0, `${viewport.name}: sidebar has horizontal overflow`);
    assert.equal(scan.overflowX, 0, `${viewport.name}: page has horizontal overflow`);
    assert.equal(scan.currentMessage, "青猫さんが会場で話してくださった、ESP32の案ですの。", `${viewport.name}: current story message changed`);
    assert(scan.avatarImagesLoaded >= 3, `${viewport.name}: symbolic chat avatars did not load`);
    report.scans.push({ viewport: viewport.name, ...scan, passed: true });
    await page.screenshot({ path: path.join(outputDir, `${viewport.name}.png`), animations: "disabled" });
    await context.close();
  }
  assert.equal(report.consoleErrors.length, 0, `console errors: ${report.consoleErrors.join("\n")}`);
  assert.equal(report.pageErrors.length, 0, `page errors: ${report.pageErrors.join("\n")}`);
  assert.equal(report.responses404.length, 0, `404 responses: ${report.responses404.join("\n")}`);
  report.status = "passed";
} catch (error) {
  report.status = "failed";
  report.error = error.stack || String(error);
  throw error;
} finally {
  fs.writeFileSync(path.join(outputDir, "report.json"), `${JSON.stringify(report, null, 2)}\n`);
  await browser.close();
}

console.log(`Campus chat channels browser check passed: ${report.scans.length} viewports`);
