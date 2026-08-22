import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const [moduleRoot, executablePath, outputArgument, baseUrl = "http://127.0.0.1:4195"] = process.argv.slice(2);
const mobile = process.argv.slice(6).includes("--mobile");
if (!moduleRoot || !executablePath) throw new Error("Playwright module root and browser executable are required");
const playwrightEntry = fs.existsSync(path.join(moduleRoot, "index.mjs"))
  ? path.join(moduleRoot, "index.mjs")
  : path.join(moduleRoot, "playwright", "index.mjs");
const { chromium } = await import(pathToFileURL(playwrightEntry).href);
const outputDir = path.resolve(outputArgument || "artifacts/story-improvement-v11-browser");
fs.mkdirSync(outputDir, { recursive: true });

const STORAGE_KEY = "gaiaSensewareNovel:progress";
const CONFIG_KEY = "gaiaSensewareNovel:config:v4";
const report = { status: "running", baseUrl, mobile, backgrounds: [], flow: {}, consoleErrors: [], pageErrors: [], responses404: [] };
const browser = await chromium.launch({ executablePath, headless: true, args: ["--no-first-run", "--disable-background-networking"] });
const context = await browser.newContext({
  viewport: mobile ? { width: 390, height: 844 } : { width: 1440, height: 900 },
  reducedMotion: "reduce",
  isMobile: mobile,
  hasTouch: mobile,
});

const attachDiagnostics = (page, label) => {
  page.on("console", (message) => {
    if (message.type() === "error") report.consoleErrors.push(`${label}: ${message.text()}`);
  });
  page.on("pageerror", (error) => report.pageErrors.push(`${label}: ${error.message}`));
  page.on("response", (response) => {
    if (response.status() === 404) report.responses404.push(`${label}: ${response.url()}`);
  });
};

const progressFor = (stepId, label) => ({
  storyVersion: 11,
  stepId,
  reachedSceneIds: [stepId.slice(0, stepId.lastIndexOf("_"))],
  viewed: {},
  metCharacters: { mizuha: true, amane: true, sakuya: true },
  evesRoute: [],
  observationOrder: "LOCAL_FIRST",
  editorialChoice: null,
  reflectionIds: [],
  resultTone: null,
  demoInterest: null,
  audio: { muted: true, volume: 0 },
  readStepIds: [],
  clear: false,
  archivesUnlocked: false,
  sessionId: `story-v11-${label}`,
});

const bootAt = async (page, stepId, label) => {
  await page.goto(new URL("/story", baseUrl).href, { waitUntil: "domcontentloaded", timeout: 90_000 });
  await page.waitForFunction(() => Boolean(globalThis.GaiaNovel && globalThis.GAIA_NOVEL_STORY?.storyVersion === 11));
  await page.evaluate(({ storageKey, configKey, progress, label: saveLabel }) => {
    localStorage.setItem(storageKey, JSON.stringify(progress));
    localStorage.setItem("gaiaSensewareNovel:manual-saves", JSON.stringify([{
      progress,
      savedAt: Date.now(),
      meta: { title: saveLabel, excerpt: progress.stepId },
    }]));
    localStorage.setItem(configKey, JSON.stringify({ messageSpeedPercent: 500, auto: false }));
    localStorage.setItem("gaia-senseware-bgm-volume", "0");
  }, { storageKey: STORAGE_KEY, configKey: CONFIG_KEY, progress: progressFor(stepId, label), label });
  await page.reload({ waitUntil: "domcontentloaded", timeout: 90_000 });
  await page.waitForFunction(() => Boolean(globalThis.GaiaNovel));
  await page.evaluate(() => globalThis.GaiaNovel.open());
  await page.locator("#novel-resume-button").click();
  await page.locator("#novel-save-panel").waitFor({ state: "visible", timeout: 15_000 });
  await page.locator('.novel-save-slot[data-slot-index="0"]').click();
  await page.waitForFunction((id) => document.querySelector("#novel-layer")?.dataset.stepId === id, stepId, { timeout: 15_000 });
};

const backgroundCases = [
  ["festival_concept_015", mobile ? "event-cg-first-encounter-five-plane-mobile-v2.png" : "event-cg-first-encounter-five-plane-v3.png", "何か、気になりました"],
  ["map_mode01_024", "modis-land-cover-2023.png", "基準期間との差"],
  ["gx_experience_018", "novel-bg-gx-ancient-ocean-autumn-morning-v3.png", "約46億年前"],
  ["esp32_pitch_010", "gaia-field-sensor-architecture-v2.svg", "失敗した理由"],
  ["circle_invitation_029", mobile ? "event-cg-circle-invitation-card-mobile-v1.png" : "event-cg-circle-invitation-card-v3.png", "学内チャットの招待"],
  ["welcome_chat_004", "novel-bg-online-night-v2.png", "失敗ログと構成図"],
  ["welcome_chat_074", mobile ? "event-cg-exhibition-finale-sunset-mobile-v1.png" : "event-cg-exhibition-finale-sunset-v1.png", "イベント帰りの海沿い"],
];

for (const [stepId, expectedAsset, expectedText] of backgroundCases) {
  const page = await context.newPage();
  attachDiagnostics(page, stepId);
  await bootAt(page, stepId, stepId);
  await page.waitForFunction(
    (asset) => getComputedStyle(document.querySelector("#novel-layer")).backgroundImage.includes(asset),
    expectedAsset,
    { timeout: 15_000 },
  );
  const scan = await page.evaluate(() => {
    const layer = document.querySelector("#novel-layer");
    const text = [
      document.querySelector("#novel-text")?.textContent,
      document.querySelector("#novel-slack-surface")?.textContent,
    ].filter(Boolean).join(" ");
    return {
      stepId: layer?.dataset.stepId || "",
      cue: layer?.dataset.backgroundCue || "",
      backgroundImage: getComputedStyle(layer).backgroundImage,
      text,
    };
  });
  assert(scan.backgroundImage.includes(expectedAsset), `${stepId}: background is not synchronized`);
  assert(scan.text.includes(expectedText), `${stepId}: revised text is not visible`);
  report.backgrounds.push(scan);
  await page.screenshot({ path: path.join(outputDir, `${stepId}.png`), fullPage: false });
  await page.close();
}

const page = await context.newPage();
attachDiagnostics(page, "full-flow");
await bootAt(page, "welcome_chat_094", "full-flow");
await page.locator("#novel-dialogue").click();
await page.waitForSelector(".novel-intermission", { state: "visible", timeout: 15_000 });
const intermission = await page.evaluate(() => {
  const shell = document.querySelector(".novel-intermission");
  const bounds = shell?.getBoundingClientRect();
  return {
    title: shell?.querySelector("h2")?.textContent || "",
    copy: shell?.querySelector("p")?.textContent || "",
    buttons: [...(shell?.querySelectorAll("button") || [])].map((button) => button.textContent),
    backgroundImage: getComputedStyle(document.querySelector("#novel-layer")).backgroundImage,
    centered: Boolean(bounds && Math.abs((bounds.left + bounds.width / 2) - innerWidth / 2) < 3 && Math.abs((bounds.top + bounds.height / 2) - innerHeight / 2) < 3),
  };
});
assert.deepEqual(intermission.buttons, ["続ける", "ここで休む"]);
assert.equal(intermission.title, "世界の続きを紡ぐ");
assert(intermission.backgroundImage.includes(mobile ? "event-cg-exhibition-finale-sunset-mobile-v1.png" : "event-cg-exhibition-finale-sunset-v1.png"));
assert.equal(intermission.centered, true);
report.flow.intermission = intermission;
await page.screenshot({ path: path.join(outputDir, "part1-intermission.png"), fullPage: false });

await page.locator(".novel-intermission button").first().click();
await page.waitForSelector(".true-end-shell", { state: "visible", timeout: 15_000 });
await page.waitForFunction(() => {
  const shell = document.querySelector(".true-end-shell");
  return shell && !shell.classList.contains("is-scene-separating") && document.querySelector(".true-end-message")?.textContent;
}, null, { timeout: 15_000 });
const firstTrueEnd = await page.evaluate(() => ({
  scene: document.querySelector(".true-end-shell")?.dataset.scene,
  message: document.querySelector(".true-end-message")?.textContent,
  webgl: document.querySelector(".true-end-universe")?.dataset.webglState,
  readout: document.querySelector(".true-end-readout")?.textContent,
}));
assert.equal(firstTrueEnd.scene, "same-voice");
assert(firstTrueEnd.message.includes("SÆLIVA ARCHIVE // COHERENCE: PARTIAL"));
assert.notEqual(firstTrueEnd.webgl, "fallback");
report.flow.firstTrueEnd = firstTrueEnd;
await page.screenshot({ path: path.join(outputDir, "novacene-01.png"), fullPage: false });

let advances = 0;
while (await page.locator(".true-end-finale").isHidden()) {
  await page.waitForFunction(() => {
    const shell = document.querySelector(".true-end-shell");
    const dialogue = document.querySelector(".true-end-dialogue");
    return shell && !shell.classList.contains("is-scene-separating") && !dialogue?.hidden;
  }, null, { timeout: 15_000 });
  await page.locator(".true-end-dialogue").click();
  advances += 1;
  assert(advances < 140, "NOVACENE did not reach its finale");
}
const trueEndFinale = await page.evaluate(() => ({
  scene: document.querySelector(".true-end-shell")?.dataset.scene,
  title: document.querySelector(".true-end-finale h2")?.textContent,
  note: document.querySelector(".true-end-finale p")?.textContent,
  button: document.querySelector(".true-end-finale button")?.textContent,
  complete: globalThis.GaiaNovel.getState().trueEndComplete,
}));
assert.deepEqual(trueEndFinale, {
  scene: "next-sensation",
  title: "NOVACENE",
  note: "最初の値は、まだ届いていない。",
  button: "正式エンディングへ",
  complete: true,
});
report.flow.trueEndFinale = trueEndFinale;

await page.locator(".true-end-finale button").click();
await page.waitForFunction(() => document.querySelector(".novel-staff-roll")?.dataset.phase === "complete", null, { timeout: 15_000 });
const staffBeforeClick = await page.evaluate(() => ({
  visible: Boolean(document.querySelector(".novel-staff-roll")),
  action: document.querySelector(".novel-staff-roll-finale button")?.textContent,
  thanks: document.querySelector(".novel-staff-roll-closing-mark")?.textContent,
}));
assert.deepEqual(staffBeforeClick, { visible: true, action: "データを見てみる", thanks: "Thank you for playing" });
await page.locator(".novel-staff-roll-stage").click({ position: { x: 30, y: 30 } });
await page.waitForTimeout(150);
assert.equal(await page.locator(".novel-staff-roll").isVisible(), true, "staff roll was skipped by a background click");
report.flow.staffRoll = staffBeforeClick;
await page.screenshot({ path: path.join(outputDir, "formal-staff-roll.png"), fullPage: false });

assert.deepEqual(report.consoleErrors, []);
assert.deepEqual(report.pageErrors, []);
assert.deepEqual(report.responses404, []);
report.status = "passed";
fs.writeFileSync(path.join(outputDir, "report.json"), `${JSON.stringify(report, null, 2)}\n`, "utf8");
await browser.close();
console.log(`story improvement v11 browser check passed: ${report.backgrounds.length} synchronized backgrounds, ${advances} NOVACENE advances`);
