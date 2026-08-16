import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const [moduleRoot, executablePath, outputArgument, baseUrl = "http://127.0.0.1:4173"] = process.argv.slice(2);
if (!moduleRoot || !executablePath) throw new Error("Playwright module root and browser executable are required");
const playwrightEntry = fs.existsSync(path.join(moduleRoot, "index.mjs"))
  ? path.join(moduleRoot, "index.mjs")
  : path.join(moduleRoot, "playwright", "index.mjs");
const { chromium } = await import(pathToFileURL(playwrightEntry).href);
const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputDir = path.resolve(outputArgument || "artifacts/log-comment-fixes-browser");
fs.mkdirSync(outputDir, { recursive: true });

delete globalThis.GAIA_NOVEL_STORY;
await import(`${pathToFileURL(path.join(projectRoot, "novel-story-data.js")).href}?log-fixes=${Date.now()}`);
const story = globalThis.GAIA_NOVEL_STORY;
const allSteps = story.scenes.flatMap((scene) => scene.steps);
const stepMap = new Map(allSteps.map((step) => [step.id, step]));

const expectedText = new Map([
  ["festival_concept_005", "私は電子工作が好きだ。誰かと相談するより、自宅の机で一人、基板と配線を相手に黙々と手を動かすほうが性に合っている。今日は出展者ではない。学内チャットで眺めているだけだった輪の中へ、顔も知らないまま一人で入るのが怖かった。何度も参加登録の画面を閉じ、見るだけなら話しかけなくていいと自分に言い聞かせて、ようやくここまで来た。"],
  ["festival_concept_007", "受付を抜けると、行き交う学生たちの胸元の名札に、学内チャットで見たことのあるハンドルネームがいくつもあった。けれど、話したことのある名前は一つもない。画面の中にいた学生たちが友人を呼び、笑い合うたび、自分だけが名前のない匿名ユーザーのように、人の輪を外から眺めていた。"],
  ["festival_concept_012", "壁の札には、白い文字で「GAIA SENSEWARE｜地球の声、聴いてみませんか」と書かれている。"],
  ["festival_concept_021", "「改めまして、私は『あめ』です」"],
  ["festival_concept_029", "「これ、すごいね。ソフトウェアも演出も、映像の迫力も。学生作品って聞いていたから、ここまで本格的だと思わなかった」"],
  ["festival_concept_037", "みずの言い方には、設営の日にあめや叔父と試行錯誤した時間を、誰かへ伝えたかったような弾みがあった。"],
  ["festival_concept_039", "「あめは、電気工事士の資格も持っていますの」"],
  ["festival_concept_041", "「ご家庭の電気工事はもちろん。資格の上では、五万ボルトぐらいまでお世話できるよ」"],
  ["festival_concept_043", "「さすがに六百ボルトを超える高圧は、触ったことないけどね。ペーパーなんだ」"],
  ["festival_concept_048", "「GAIA SENSEWAREって、何をするシステムなんですか？」"],
  ["festival_concept_057", "「みず、最初から視座が大きいね」"],
  ["festival_concept_071", "あめは画面下の出典欄を指し、データごとに提供元を確かめていく。誰でも使えるデータだからこそ、どこから受け取った数字なのかを見失わないための説明だった。"],
  ["festival_concept_075", "あめが何かを押したようには見えなかった。それでも地球の輪郭は静かに平面へ広がり、世界地図へ変わった。"],
  ["map_mode01_003", "「こちらがMODE 01です。年代のスライダーを動かしてから、地図の気になる場所を押してみてください」"],
  ["map_mode01_005", "年代を動かすと、観測時点が切り替わり、画面上のCO2濃度と気温偏差の数値も連動して変わった。"],
  ["map_mode01_006", "スライダーを過去へ戻し、また現在へ進める。地球の明るさと背景の色が、数値に合わせて少しずつ変わる。"],
  ["map_mode01_007", "次に地図を押すと、触れた場所から光の輪が広がった。画面の案内が「物語へ戻る」へ進み、操作を保存するボタンが使えるようになる。"],
  ["map_mode01_008", "自分で記録した部屋の温度も、一点だけではただの数字だった。年代を動かして前後を比べると、同じ場所の変化として読める。その感覚なら分かった。"],
]);

const expectedSpeakers = new Map([
  ["festival_concept_021", "短髪の女性"],
  ["festival_concept_029", "あなた"],
  ["festival_concept_039", "みず"],
  ["festival_concept_041", "あめ"],
  ["festival_concept_043", "あめ"],
  ["festival_concept_048", "あなた"],
  ["festival_concept_057", "あめ"],
  ["map_mode01_003", "あめ"],
]);

assert.equal(allSteps.length, 396);
assert.equal(new Set(allSteps.map((step) => step.id)).size, 396);
assert.equal(expectedText.size, 18);
assert.equal(story.sourceSha256, "ea23b125c7942429b57fd7cca04f3dc8a9c959a4b77d3cb22fd02c6de879a049");
assert.deepEqual(story.requiredInteractions, ["map01", "gx"]);
assert(story.saveFields.includes("stepId") && story.saveFields.includes("readStepIds") && story.saveFields.includes("demoInterest"));
for (const [id, text] of expectedText) assert.equal(stepMap.get(id)?.text, text, `${id}: generated text differs`);
assert.equal(stepMap.get("festival_concept_043")?.speaker, "amane");
assert.doesNotMatch(allSteps.map((step) => step.text || "").join("\n"), /ものづくり|ほどけ/u);

const viewports = [
  { name: "pc-1440", width: 1440, height: 900 },
  { name: "mobile-390", width: 390, height: 844 },
];
const report = {
  status: "running",
  baseUrl,
  targetStepCount: expectedText.size,
  scans: [],
  mapInteractions: [],
  consoleErrors: [],
  pageErrors: [],
  responses404: [],
};

const stateFor = (stepId, extra = {}) => ({
  storyVersion: story.storyVersion,
  stepId,
  reachedSceneIds: [stepMap.get(stepId).sceneId],
  viewed: {},
  metCharacters: { mizuha: true, amane: true, sakuya: false },
  evesRoute: [],
  observationOrder: null,
  editorialChoice: null,
  reflectionIds: [],
  resultTone: null,
  demoInterest: "気温偏差の地図",
  audio: { muted: true, volume: 0 },
  readStepIds: [],
  clear: false,
  archivesUnlocked: false,
  sessionId: `log-comment-fixes-${stepId}`,
  ...extra,
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

const bootAt = async (page, stepId, extra = {}) => {
  await page.goto(new URL("/story", baseUrl).href, { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => Boolean(globalThis.GaiaNovel && globalThis.GAIA_NOVEL_STORY));
  await page.evaluate((candidate) => {
    localStorage.setItem("gaiaSensewareNovel:progress", JSON.stringify(candidate));
    localStorage.setItem("gaiaSensewareNovel:manual-saves", JSON.stringify([{
      progress: candidate,
      savedAt: Date.now(),
      meta: { title: "LOG fixes QA", excerpt: candidate.stepId },
    }]));
    localStorage.setItem("gaiaSensewareNovel:config:v2", JSON.stringify({ messageSpeedPercent: 400, reducedMotion: true }));
    localStorage.setItem("gaia-senseware-bgm-volume", "0");
  }, stateFor(stepId, extra));
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => Boolean(globalThis.GaiaNovel));
  await page.evaluate(() => globalThis.GaiaNovel.open());
  await page.locator("#novel-resume-button").click();
  await page.locator("#novel-save-panel").waitFor({ state: "visible", timeout: 15_000 });
  await page.locator('.novel-save-slot[data-slot-index="0"]').click();
  await page.waitForFunction((id) => document.querySelector("#novel-layer")?.dataset.stepId === id, stepId, { timeout: 15_000 });
  await page.waitForTimeout(180);
};

const scanStep = async (page, viewport, stepId) => {
  await bootAt(page, stepId);
  await page.waitForFunction(() => Boolean(document.querySelector("#novel-text")?.dataset.pageCount));
  if (await page.locator("#novel-text").evaluate((text) => text.classList.contains("is-revealing"))) {
    await page.locator("#novel-dialogue").click({ position: { x: 30, y: 30 } });
    await page.waitForFunction(() => !document.querySelector("#novel-text")?.classList.contains("is-revealing"));
  }
  const scan = await page.evaluate(() => {
    const isVisible = (element) => {
      if (!element || element.hidden) return false;
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity || 1) > 0 && rect.width > 0 && rect.height > 0;
    };
    const layer = document.querySelector("#novel-layer");
    const dialogue = document.querySelector("#novel-dialogue");
    const text = document.querySelector("#novel-text");
    const speaker = document.querySelector("#novel-speaker");
    const avatar = document.querySelector("#novel-avatar");
    const dialogueRect = dialogue?.getBoundingClientRect();
    const textRect = text?.getBoundingClientRect();
    return {
      stepId: layer?.dataset.stepId,
      cueId: layer?.dataset.backgroundCue,
      backgroundImage: getComputedStyle(layer).backgroundImage,
      renderedText: text?.textContent || "",
      sourceText: text?.getAttribute("aria-label") || "",
      speaker: speaker?.textContent || "",
      avatarHidden: avatar?.hidden,
      avatarVisible: isVisible(avatar),
      dialogueVisible: isVisible(dialogue),
      dialogueRect: dialogueRect?.toJSON(),
      textRect: textRect?.toJSON(),
      pageCount: Number(text?.dataset.pageCount || 1),
      measuredLineCount: Number(text?.dataset.measuredLineCount || 0),
      maxLineCount: Number(text?.dataset.maxLineCount || 0),
      overflowX: Math.max(0, document.documentElement.scrollWidth - innerWidth),
      bodyOverflowX: Math.max(0, document.body.scrollWidth - innerWidth),
    };
  });
  assert.equal(scan.stepId, stepId);
  assert.equal(scan.dialogueVisible, true, `${viewport.name} ${stepId}: dialogue is not visible`);
  assert(scan.renderedText.length > 0, `${viewport.name} ${stepId}: text is empty`);
  assert(scan.cueId, `${viewport.name} ${stepId}: background cue is missing`);
  assert.notEqual(scan.backgroundImage, "none", `${viewport.name} ${stepId}: background image is missing`);
  assert.equal(scan.overflowX, 0, `${viewport.name} ${stepId}: document overflows horizontally`);
  assert.equal(scan.bodyOverflowX, 0, `${viewport.name} ${stepId}: body overflows horizontally`);
  assert(scan.measuredLineCount > 0 && scan.measuredLineCount <= scan.maxLineCount, `${viewport.name} ${stepId}: text exceeds the measured page capacity`);
  assert(scan.dialogueRect.left >= 0 && scan.dialogueRect.right <= viewport.width + 1, `${viewport.name} ${stepId}: dialogue leaves viewport`);
  assert(scan.textRect.left >= scan.dialogueRect.left && scan.textRect.right <= scan.dialogueRect.right + 1, `${viewport.name} ${stepId}: text leaves dialogue`);
  if (expectedSpeakers.has(stepId)) assert.equal(scan.speaker, expectedSpeakers.get(stepId), `${viewport.name} ${stepId}: speaker differs`);
  if (stepId === "festival_concept_048") {
    assert.equal(scan.avatarHidden, true, `${viewport.name}: visitor atom-like avatar is not hidden`);
    assert.equal(scan.avatarVisible, false, `${viewport.name}: visitor atom-like avatar remains visible`);
  }
  await page.screenshot({ path: path.join(outputDir, `${viewport.name}-${stepId}.png`), animations: "disabled" });
  report.scans.push({ viewport: viewport.name, ...scan, passed: true });
};

const performMapInteraction = async (page, viewport) => {
  await bootAt(page, "map_mode01_003", { readStepIds: ["map_mode01_001", "map_mode01_002"] });
  for (let attempt = 0; attempt < 8; attempt += 1) {
    if (await page.evaluate(() => globalThis.GaiaNovel.getState().stepId === "map_mode01_004")) break;
    await page.locator("#novel-dialogue").click({ position: { x: 30, y: 30 } });
    await page.waitForTimeout(90);
  }
  await page.waitForFunction(() => (
    globalThis.GaiaNovel.getState().stepId === "map_mode01_004"
    && document.body.dataset.novelInteractionState === "open"
    && document.querySelector("#japan-layer")?.hidden === false
  ), null, { timeout: 15_000 });
  const open = await page.evaluate(() => {
    const isVisible = (element) => {
      if (!element || element.hidden) return false;
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity || 1) > 0 && rect.width > 0 && rect.height > 0;
    };
    const guide = document.querySelector(".story-map-guide");
    const input = document.querySelector("#japan-layer [data-signal-time]");
    const returnButton = document.querySelector("#story-detour-return");
    return {
      stepId: globalThis.GaiaNovel.getState().stepId,
      guideStage: guide?.dataset.stage,
      guideText: guide?.innerText || "",
      inputVisible: isVisible(input),
      inputDisabled: input?.disabled,
      returnText: returnButton?.textContent || "",
      returnEnabled: !returnButton?.disabled,
      overflowX: Math.max(0, document.documentElement.scrollWidth - innerWidth),
    };
  });
  assert.deepEqual({ stepId: open.stepId, guideStage: open.guideStage, inputVisible: open.inputVisible, inputDisabled: open.inputDisabled, returnEnabled: open.returnEnabled, overflowX: open.overflowX }, {
    stepId: "map_mode01_004", guideStage: "1", inputVisible: true, inputDisabled: false, returnEnabled: false, overflowX: 0,
  });
  assert.match(open.guideText, /年代を動かす[\s\S]*地図を押す[\s\S]*物語へ戻る/u);
  assert.equal(open.returnText, "操作を保存して物語へ戻る");
  await page.screenshot({ path: path.join(outputDir, `${viewport.name}-map-stage-1.png`), animations: "disabled" });

  const timeInput = page.locator("#japan-layer [data-signal-time]").first();
  const before = Number(await timeInput.inputValue());
  const inputBox = await timeInput.boundingBox();
  assert(inputBox && inputBox.width >= 40 && inputBox.height >= 10, `${viewport.name}: MAP slider has no real pointer target`);
  const ratio = before > 50 ? 0.2 : 0.8;
  await page.mouse.move(inputBox.x + inputBox.width * (1 - ratio), inputBox.y + inputBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(inputBox.x + inputBox.width * ratio, inputBox.y + inputBox.height / 2, { steps: 8 });
  await page.mouse.up();
  const afterPointer = Number(await timeInput.inputValue());
  assert.notEqual(afterPointer, before, `${viewport.name}: MAP slider did not change from real pointer input`);
  await page.waitForFunction(() => document.querySelector(".story-map-guide")?.dataset.stage === "2");
  await timeInput.focus();
  await timeInput.press("ArrowRight");
  const afterKeyboard = Number(await timeInput.inputValue());
  assert.notEqual(afterKeyboard, afterPointer, `${viewport.name}: MAP slider did not change from keyboard input`);
  await page.screenshot({ path: path.join(outputDir, `${viewport.name}-map-stage-2.png`), animations: "disabled" });

  const map = page.locator("#japan-map");
  const mapBox = await map.boundingBox();
  assert(mapBox && mapBox.width > 100 && mapBox.height > 100, `${viewport.name}: MAP surface has no real pointer target`);
  const point = { x: mapBox.x + mapBox.width * 0.52, y: mapBox.y + mapBox.height * 0.5 };
  assert.equal(await page.evaluate(({ x, y }) => Boolean(document.elementFromPoint(x, y)?.closest?.("#japan-map")), point), true);
  await page.mouse.click(point.x, point.y);
  await page.waitForFunction(() => document.querySelector(".story-map-guide")?.dataset.stage === "3");
  await page.waitForFunction(() => !document.querySelector("#story-detour-return")?.disabled);
  await page.screenshot({ path: path.join(outputDir, `${viewport.name}-map-stage-3.png`), animations: "disabled" });
  await page.locator("#story-detour-return").click();
  await page.waitForFunction(() => globalThis.GaiaNovel.getState().stepId === "map_mode01_005");
  const closed = await page.evaluate(() => {
    const isVisible = (element) => {
      if (!element || element.hidden) return false;
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity || 1) > 0 && rect.width > 0 && rect.height > 0;
    };
    return {
      stepId: globalThis.GaiaNovel.getState().stepId,
      lifecycle: document.body.dataset.novelInteractionState || "idle",
      mapVisible: isVisible(document.querySelector("#japan-layer")),
      guideCount: document.querySelectorAll(".story-map-guide").length,
      overflowX: Math.max(0, document.documentElement.scrollWidth - innerWidth),
    };
  });
  assert.deepEqual(closed, { stepId: "map_mode01_005", lifecycle: "idle", mapVisible: false, guideCount: 0, overflowX: 0 });
  report.mapInteractions.push({ viewport: viewport.name, open, before, afterPointer, afterKeyboard, closed, passed: true });
};

const browser = await chromium.launch({ headless: true, executablePath });
try {
  for (const viewport of viewports) {
    const context = await browser.newContext({ viewport, reducedMotion: "reduce" });
    const page = await context.newPage();
    attachDiagnostics(page, viewport.name);
    for (const stepId of expectedText.keys()) await scanStep(page, viewport, stepId);
    await performMapInteraction(page, viewport);
    await context.close();
  }
  assert.equal(report.scans.length, expectedText.size * viewports.length);
  assert.equal(report.mapInteractions.length, viewports.length);
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

console.log(`LOG comment fixes browser check passed: ${report.scans.length} step scans, ${report.mapInteractions.length} MAP interactions`);
