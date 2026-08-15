import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const [moduleArgument, executableArgument, outputArgument, baseUrlArgument] = process.argv.slice(2);
const moduleRoot = process.env.GAIA_PLAYWRIGHT_PATH || moduleArgument;
const executablePath = process.env.GAIA_BROWSER_EXECUTABLE || executableArgument;
const outputDir = path.resolve(process.env.GAIA_BROWSER_ARTIFACTS || outputArgument || "artifacts/log-debug-comments");
const baseUrl = process.env.GAIA_BASE_URL || baseUrlArgument || "http://127.0.0.1:4312";
if (!moduleRoot || !executablePath) throw new Error("GAIA_PLAYWRIGHT_PATH and GAIA_BROWSER_EXECUTABLE are required");

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const htmlSource = fs.readFileSync(path.join(projectRoot, "index.html"), "utf8");
const runtimeSource = fs.readFileSync(path.join(projectRoot, "novel-mode.js"), "utf8");
for (const id of ["novel-log-comment-count", "novel-log-export", "novel-log-status"]) {
  assert.equal((htmlSource.match(new RegExp(`id=["']${id}["']`, "gu")) || []).length, 1, `${id} must exist exactly once`);
}
assert.match(runtimeSource, /sessionStorage/u, "LOG comments must use sessionStorage");
assert.match(runtimeSource, /gaiaSensewareNovel:log-comments:v1/u, "LOG comment storage key is missing");
assert.match(runtimeSource, /text\/markdown;charset=utf-8/u, "UTF-8 Markdown export is missing");
assert.match(runtimeSource, /gaia-log-open/u, "LOG open state class is missing");

delete globalThis.GAIA_NOVEL_STORY;
await import(`${pathToFileURL(path.join(projectRoot, "novel-story-data.js")).href}?log-comments=${Date.now()}`);
const story = globalThis.GAIA_NOVEL_STORY;
const steps = story.scenes.flatMap((scene) => scene.steps);
const stepMap = new Map(steps.map((step) => [step.id, step]));
const readStepIds = ["festival_concept_001", "festival_concept_002", "festival_concept_003"];
const currentStepId = "festival_concept_004";
const expectedLogIds = [...readStepIds, currentStepId];
const commentStorageKey = "gaiaSensewareNovel:log-comments:v1";
const progressKey = "gaiaSensewareNovel:progress";
const manualSaveKey = "gaiaSensewareNovel:manual-saves";
const settingsKey = "gaiaSensewareNovel:config:v2";

const { chromium } = await import(pathToFileURL(path.join(moduleRoot, "index.mjs")));
const routeUrl = new URL("/story", baseUrl).href;
const viewports = [
  { name: "pc-1440", width: 1440, height: 900 },
  { name: "mobile-390", width: 390, height: 844 },
];
const report = { status: "running", scans: [], consoleErrors: [], pageErrors: [], responses404: [] };
fs.mkdirSync(outputDir, { recursive: true });

const baseState = () => ({
  storyVersion: story.storyVersion,
  stepId: currentStepId,
  reachedSceneIds: ["festival_concept"],
  viewed: {},
  metCharacters: { mizuha: false, amane: false, sakuya: false },
  evesRoute: [],
  observationOrder: null,
  editorialChoice: null,
  reflectionIds: [],
  resultTone: null,
  audio: { muted: true, volume: 0 },
  readStepIds,
  clear: false,
  archivesUnlocked: false,
  sessionId: "log-debug-comments-browser",
});

const attachDiagnostics = (page, label) => {
  page.on("console", (message) => { if (message.type() === "error") report.consoleErrors.push(`${label}: ${message.text()}`); });
  page.on("pageerror", (error) => report.pageErrors.push(`${label}: ${error.message}`));
  page.on("response", (response) => { if (response.status() === 404) report.responses404.push(`${label}: ${response.url()}`); });
};

const ensureNovelOpen = async (page) => {
  await page.waitForFunction(() => Boolean(globalThis.GaiaNovel), null, { timeout: 15_000 });
  await page.evaluate(() => {
    const layer = document.querySelector("#novel-layer");
    if (layer?.hidden || !layer.classList.contains("is-open")) globalThis.GaiaNovel.open();
  });
  await page.locator("#novel-title-screen").waitFor({ state: "visible", timeout: 15_000 });
};

const bootAtLogState = async (page) => {
  await page.evaluate(({ storedProgress, storageKey, manualKey, configKey }) => {
    localStorage.setItem(storageKey, JSON.stringify(storedProgress));
    localStorage.setItem(manualKey, JSON.stringify([{
      progress: storedProgress,
      savedAt: Date.now(),
      meta: { title: "LOG QA", excerpt: storedProgress.stepId },
    }]));
    localStorage.setItem(configKey, JSON.stringify({ messageSpeedPercent: 400, reducedMotion: true }));
  }, { storedProgress: baseState(), storageKey: progressKey, manualKey: manualSaveKey, configKey: settingsKey });
  await page.reload({ waitUntil: "domcontentloaded" });
  await ensureNovelOpen(page);
  await page.locator("#novel-resume-button").click();
  await page.locator("#novel-save-panel").waitFor({ state: "visible", timeout: 15_000 });
  await page.locator('.novel-save-slot[data-slot-index="0"]').click();
  await page.waitForFunction((id) => document.querySelector("#novel-layer")?.dataset.stepId === id, currentStepId, { timeout: 15_000 });
  await page.locator("#novel-log-button").click();
  await page.locator("#novel-log-panel").waitFor({ state: "visible" });
};

const geometry = (page) => page.evaluate(() => {
  const panel = document.querySelector("#novel-log-panel").getBoundingClientRect();
  const content = document.querySelector("#novel-log-content");
  const exportButton = document.querySelector("#novel-log-export").getBoundingClientRect();
  const heading = document.querySelector("#novel-log-title")?.getBoundingClientRect();
  const audioDock = document.querySelector("#gaia-audio-dock");
  const audioRect = audioDock?.getBoundingClientRect();
  const audioStyle = audioDock ? getComputedStyle(audioDock) : null;
  const entries = [...content.querySelectorAll("article")];
  return {
    panel: { left: panel.left, top: panel.top, right: panel.right, bottom: panel.bottom, width: panel.width, height: panel.height },
    exportButton: { width: exportButton.width, height: exportButton.height },
    entryCount: entries.length,
    overflowX: Math.max(0, document.documentElement.scrollWidth - innerWidth),
    contentOverflowX: Math.max(0, content.scrollWidth - content.clientWidth),
    headingAudioCollision: Boolean(heading && audioRect
      && heading.left < audioRect.right && heading.right > audioRect.left
      && heading.top < audioRect.bottom && heading.bottom > audioRect.top),
    audioVisible: Boolean(audioStyle && audioStyle.visibility !== "hidden" && audioStyle.display !== "none"),
    visibleIds: entries.map((entry) => entry.querySelector(".novel-log-entry-id")?.textContent),
    textareas: entries.map((entry) => ({
      id: entry.dataset.stepId,
      width: entry.querySelector("textarea")?.getBoundingClientRect().width || 0,
      visible: Boolean(entry.querySelector("textarea")?.offsetParent),
    })),
  };
});

const browser = await chromium.launch({ headless: true, executablePath });
try {
  for (const viewport of viewports) {
    const context = await browser.newContext({ viewport, reducedMotion: "reduce", acceptDownloads: true });
    const page = await context.newPage();
    attachDiagnostics(page, viewport.name);
    await page.addInitScript(() => {
      Object.defineProperty(navigator, "clipboard", {
        configurable: true,
        value: { writeText: async (value) => { globalThis.__logClipboard = String(value); } },
      });
      globalThis.__logClipboard = "";
    });
    await page.goto(routeUrl, { waitUntil: "domcontentloaded" });
    await ensureNovelOpen(page);
    await bootAtLogState(page);

    const initial = await geometry(page);
    assert.equal(initial.entryCount, expectedLogIds.length, `${viewport.name}: unexpected LOG entry count`);
    assert.deepEqual(initial.visibleIds, expectedLogIds, `${viewport.name}: visible LOG IDs are wrong`);
    assert.equal(initial.overflowX, 0, `${viewport.name}: document overflows horizontally`);
    assert.equal(initial.contentOverflowX, 0, `${viewport.name}: LOG content overflows horizontally`);
    assert.equal(initial.headingAudioCollision, false, `${viewport.name}: audio control overlaps the LOG heading`);
    assert.equal(initial.audioVisible, false, `${viewport.name}: persistent audio control remains visible over LOG`);
    assert(initial.textareas.every((item) => item.visible && item.width > 0), `${viewport.name}: a comment field is unavailable`);

    const firstEntry = page.locator(`article[data-step-id="${readStepIds[0]}"]`);
    await firstEntry.getByRole("button", { name: `${readStepIds[0]}のLOG IDをコピー` }).click();
    assert.equal(await page.evaluate(() => globalThis.__logClipboard), readStepIds[0], `${viewport.name}: ID copy failed`);
    await firstEntry.getByRole("button", { name: `${readStepIds[0]}のLOG IDと本文をコピー` }).click();
    assert.equal(await page.evaluate(() => globalThis.__logClipboard), `${readStepIds[0]}\n${stepMap.get(readStepIds[0]).text}`, `${viewport.name}: ID + text copy failed`);

    const comments = {
      [readStepIds[0]]: "冒頭の風の音を、もう少し短くしてください。",
      [readStepIds[1]]: "匂いの描写と背景の整合を確認してください。",
    };
    for (const [id, value] of Object.entries(comments)) {
      await page.getByRole("textbox", { name: `${id}への修正コメント` }).fill(value);
    }
    assert.equal(await page.locator("#novel-log-comment-count").textContent(), "コメント 2件", `${viewport.name}: comment count failed`);
    const stored = JSON.parse(await page.evaluate((key) => sessionStorage.getItem(key), commentStorageKey));
    assert.deepEqual(stored, comments, `${viewport.name}: sessionStorage comments differ`);

    await page.locator("#novel-log-close").click();
    assert.equal(await page.evaluate(() => document.body.classList.contains("gaia-log-open")), false,
      `${viewport.name}: LOG open state remained after close`);
    await page.locator("#novel-log-button").click();
    await page.locator("#novel-log-panel").waitFor({ state: "visible" });
    for (const [id, value] of Object.entries(comments)) {
      assert.equal(await page.getByRole("textbox", { name: `${id}への修正コメント` }).inputValue(), value, `${viewport.name}: comment did not survive reopen`);
    }

    const downloadPromise = page.waitForEvent("download");
    await page.locator("#novel-log-export").click();
    const download = await downloadPromise;
    const downloadPath = await download.path();
    const markdownBuffer = fs.readFileSync(downloadPath);
    const markdown = markdownBuffer.toString("utf8");
    assert(markdownBuffer.subarray(0, 3).equals(Buffer.from([0xef, 0xbb, 0xbf])), `${viewport.name}: Markdown has no UTF-8 BOM`);
    assert.match(download.suggestedFilename(), /^gaia-codex-log-comments-\d{8}T\d{6}Z\.md$/u);
    for (const [id, value] of Object.entries(comments)) {
      assert(markdown.includes(`\`${id}\``) && markdown.includes(stepMap.get(id).text) && markdown.includes(value), `${viewport.name}: exported Markdown misses ${id}`);
    }
    assert.equal(markdown.includes(readStepIds[2]), false, `${viewport.name}: uncommented step was exported`);
    assert.equal(await page.locator("#novel-log-status").textContent(), "2件を書き出しました");

    await page.reload({ waitUntil: "domcontentloaded" });
    await ensureNovelOpen(page);
    await bootAtLogState(page);
    for (const [id, value] of Object.entries(comments)) {
      assert.equal(await page.getByRole("textbox", { name: `${id}への修正コメント` }).inputValue(), value, `${viewport.name}: comment did not survive reload`);
    }
    const finalGeometry = await geometry(page);
    assert.equal(finalGeometry.overflowX, 0);
    assert.equal(finalGeometry.contentOverflowX, 0);
    await page.screenshot({ path: path.join(outputDir, `${viewport.name}-log-comments.png`), animations: "disabled" });

    report.scans.push({ viewport, initial, finalGeometry, stored, download: download.suggestedFilename(), passed: true });
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

console.log(`LOG debug comments browser check passed: ${report.scans.length} viewports`);
