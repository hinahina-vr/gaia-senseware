import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const [moduleRoot, executablePath, outputArgument, baseUrl = "http://127.0.0.1:4417"] = process.argv.slice(2);
if (!moduleRoot || !executablePath) throw new Error("Playwright module root and browser executable are required");
const playwrightEntry = fs.existsSync(path.join(moduleRoot, "index.mjs"))
  ? path.join(moduleRoot, "index.mjs")
  : path.join(moduleRoot, "playwright", "index.mjs");
const { chromium } = await import(pathToFileURL(playwrightEntry).href);
const outputDir = path.resolve(outputArgument || "artifacts/lightweight-story-menu-hotfix");
fs.mkdirSync(outputDir, { recursive: true });

const viewports = [
  { name: "pc-2048", width: 2048, height: 1030, action: "click" },
  { name: "pc-1920", width: 1920, height: 1000, action: "Enter" },
  { name: "pc-1440", width: 1440, height: 900, action: "click" },
  { name: "mobile-390", width: 390, height: 844, mobile: true, action: "Space" },
];
const report = {
  status: "running",
  baseUrl,
  viewports,
  scans: [],
  consoleErrors: [],
  pageErrors: [],
  responses404: [],
};
const browser = await chromium.launch({ headless: true, executablePath });
const visibleSource = `(element) => {
  if (!element || element.hidden || element.closest('[hidden]')) return false;
  const style = getComputedStyle(element); const rect = element.getBoundingClientRect();
  return style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity || 1) > 0 && rect.width > 0 && rect.height > 0;
}`;
const progressFixture = {
  storyVersion: 10,
  stepId: "festival_concept_032",
  reachedSceneIds: ["festival_concept"],
  viewed: {},
  evesRoute: [],
  observationOrder: null,
  editorialChoice: null,
  reflectionIds: [],
  resultTone: null,
  demoInterest: "",
  metCharacters: { mizuha: true, amane: true, sakuya: false },
  audio: { muted: true, volume: 0.3 },
  readStepIds: ["festival_concept_001", "festival_concept_021", "festival_concept_023"],
  clear: false,
  archivesUnlocked: false,
  sessionId: "lightweight-story-menu-hotfix",
  unknownLocalField: { preserved: true },
};
const unlockedGallery = [
  "first-encounter",
  "amane-closeup",
  "mizuha-closeup",
  "esp32-collaboration",
  "circle-welcome",
  "exhibition-finale",
];

const createPage = async (viewport, label) => {
  const context = await browser.newContext({
    viewport,
    hasTouch: Boolean(viewport.mobile),
    isMobile: Boolean(viewport.mobile),
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  page.on("console", (message) => {
    if (message.type() === "error") report.consoleErrors.push(`${label}: ${message.text()}`);
  });
  page.on("pageerror", (error) => report.pageErrors.push(`${label}: ${error.message}`));
  page.on("response", (response) => {
    if (response.status() === 404) report.responses404.push(`${label}: ${response.url()}`);
  });
  await page.addInitScript((source) => {
    globalThis.__qaVisible = eval(source);
    globalThis.__qaNovelOpenAtCount = 0;
    globalThis.__qaNovelOpenCount = 0;
    window.addEventListener("gaia:novel-open-at-mode", () => { globalThis.__qaNovelOpenAtCount += 1; }, true);
    window.addEventListener("gaia:novel-open", () => { globalThis.__qaNovelOpenCount += 1; }, true);
  }, visibleSource);
  return { context, page };
};

const seedStorage = async (page, stepId = progressFixture.stepId) => page.evaluate(({ progress, ids, targetStepId }) => {
  localStorage.setItem("gaiaSensewareNovel:progress", JSON.stringify({ ...progress, stepId: targetStepId }));
  localStorage.setItem("gaiaSensewareNovel:cg-gallery:v1", JSON.stringify({ version: 1, unlocked: ids }));
  localStorage.setItem("gaiaSensewareNovel:config:v2", JSON.stringify({ messageSpeedPercent: 400, reducedMotion: true }));
}, { progress: progressFixture, ids: unlockedGallery, targetStepId: stepId });

const openIntro = async (page) => {
  await page.goto(new URL("/", baseUrl).href, { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => Boolean(globalThis.GaiaNovel));
  await seedStorage(page);
  await page.evaluate(() => {
    const opening = document.querySelector("#gaia-opening");
    opening.hidden = true;
    opening.inert = true;
    opening.setAttribute("aria-hidden", "true");
    document.body.classList.remove("gaia-opening-active");
    window.dispatchEvent(new CustomEvent("gaia:opening-complete"));
  });
  await page.waitForFunction(() => __qaVisible(document.querySelector("#intro-layer")));
  await page.waitForTimeout(80);
};

const cardScan = async (page) => page.evaluate(() => {
  const cards = [...document.querySelectorAll(".intro-path-card")];
  const hiddenDetails = [...document.querySelectorAll(
    ".intro-path-card .intro-card-reveal-fx,.intro-path-card .intro-border-glint,.intro-path-card .intro-path-index,.intro-path-card .intro-path-enter",
  )];
  const primary = document.querySelector(".intro-story-return[data-primary-action='true']");
  const primaryStyle = getComputedStyle(primary);
  return {
    cardCount: cards.length,
    cards: cards.map((card) => ({
      path: card.dataset.introPath || (card.hasAttribute("data-sound-gallery-open") ? "sound" : ""),
      title: card.querySelector(":scope > strong")?.textContent.trim(),
      copy: card.querySelector(":scope > p")?.textContent.trim(),
      glyphVisible: __qaVisible(card.querySelector(".intro-path-glyph")),
      rect: card.getBoundingClientRect().toJSON(),
      accessibleName: card.getAttribute("aria-label") || card.innerText.trim(),
      focusable: card.tabIndex >= 0,
    })),
    hiddenDetailCount: hiddenDetails.length,
    hiddenDetailVisibleCount: hiddenDetails.filter(__qaVisible).length,
    primaryCount: document.querySelectorAll("[data-primary-action='true']").length,
    primaryVisible: __qaVisible(primary),
    primaryFocusable: primary.tabIndex >= 0,
    primaryText: primary.textContent.replace(/\s+/gu, "").trim(),
    primaryRole: primary.tagName.toLowerCase(),
    primaryBackground: primaryStyle.backgroundImage,
    primaryRect: primary.getBoundingClientRect().toJSON(),
    overflowX: document.documentElement.scrollWidth > innerWidth + 1,
    overflowY: document.documentElement.scrollHeight > innerHeight + 1,
  };
});

const assertCards = (scan) => {
  assert.equal(scan.cardCount, 5);
  assert.deepEqual(scan.cards.map((card) => card.title), ["光に触れる", "世界を読む", "センサーを登録", "宇宙から見る", "音を聴く"]);
  assert.deepEqual(scan.cards.map((card) => card.copy), ["数字を光へ。", "変化を地図へ。", "地球の観測データを送る", "宇宙の記録へ。", "物語の音楽へ。"]);
  assert(scan.cards.every((card) => card.glyphVisible && card.focusable && card.rect.width > 0 && card.rect.height >= 90));
  assert.equal(scan.hiddenDetailVisibleCount, 0);
  assert(scan.hiddenDetailCount > 0);
  assert.equal(scan.primaryCount, 1);
  assert(scan.primaryVisible && scan.primaryFocusable && scan.primaryRole === "button");
  assert(scan.primaryText.includes("物語へ戻る"));
  assert.notEqual(scan.primaryBackground, "none");
  assert.equal(scan.overflowX, false);
  assert.equal(scan.overflowY, false);
};

const titleState = async (page) => page.evaluate(() => ({
  titleVisible: __qaVisible(document.querySelector("#novel-title-screen")),
  runtimeVisible: __qaVisible(document.querySelector("#novel-runtime")),
  novelVisibleCount: [...document.querySelectorAll("#novel-layer")].filter(__qaVisible).length,
  openingVisible: __qaVisible(document.querySelector("#gaia-opening")),
  introVisible: __qaVisible(document.querySelector("#intro-layer")),
  actionVisible: {
    start: __qaVisible(document.querySelector("#novel-start-button")),
    resume: __qaVisible(document.querySelector("#novel-resume-button")),
    load: __qaVisible(document.querySelector("#novel-title-load-button")),
    gallery: __qaVisible(document.querySelector("#novel-title-gallery-button")),
  },
  runtimeGalleryDomCount: document.querySelectorAll("#novel-gallery-button,#novel-gallery-count").length,
  progress: JSON.parse(localStorage.getItem("gaiaSensewareNovel:progress") || "null"),
  openAtCount: globalThis.__qaNovelOpenAtCount,
  novelOpenCount: globalThis.__qaNovelOpenCount,
  overflowX: document.documentElement.scrollWidth > innerWidth + 1,
  overflowY: document.documentElement.scrollHeight > innerHeight + 1,
}));

const assertTitle = (state) => {
  assert(state.titleVisible && !state.runtimeVisible && !state.openingVisible && !state.introVisible);
  assert.equal(state.novelVisibleCount, 1);
  assert.deepEqual(state.actionVisible, { start: true, resume: true, load: false, gallery: true });
  assert.equal(state.runtimeGalleryDomCount, 0);
  assert.equal(state.openAtCount, 1);
  assert.equal(state.novelOpenCount, 1);
  assert.equal(state.progress.stepId, progressFixture.stepId);
  assert.deepEqual(state.progress.unknownLocalField, progressFixture.unknownLocalField);
  assert.equal(state.overflowX, false);
  assert.equal(state.overflowY, false);
};

const scanIntroReturn = async (viewport) => {
  const { context, page } = await createPage(viewport, `${viewport.name}-intro-return`);
  await openIntro(page);
  const before = await cardScan(page);
  assertCards(before);
  await page.screenshot({ path: path.join(outputDir, `${viewport.name}-intro-simple.png`) });
  const returnButton = page.locator(".intro-story-return[data-primary-action='true']");
  if (viewport.action === "click") await returnButton.click();
  else {
    await returnButton.focus();
    await returnButton.press(viewport.action);
  }
  await page.waitForFunction(() => __qaVisible(document.querySelector("#novel-title-screen")));
  await page.waitForTimeout(80);
  const after = await titleState(page);
  assertTitle(after);
  await page.screenshot({ path: path.join(outputDir, `${viewport.name}-novel-title.png`) });

  let album = null;
  if (["pc-1440", "mobile-390"].includes(viewport.name)) {
    await page.locator("#novel-title-gallery-button").click();
    await page.waitForFunction(() => __qaVisible(document.querySelector("#novel-gallery-panel")));
    album = await page.evaluate(() => ({
      visible: __qaVisible(document.querySelector("#novel-gallery-panel")),
      cardCount: document.querySelectorAll(".novel-gallery-card[data-unlocked='true']").length,
      progress: document.querySelector("#novel-title-gallery-progress")?.textContent.trim(),
    }));
    assert(album.visible && album.cardCount === 6 && /6\s*\/\s*6/u.test(album.progress));
    await page.locator(".novel-gallery-card[data-unlocked='true']").first().click();
    assert.equal(await page.locator("#novel-gallery-viewer").evaluate((element) => __qaVisible(element)), true);
    await page.screenshot({ path: path.join(outputDir, `${viewport.name}-title-album-viewer.png`) });
    await page.locator("#novel-gallery-viewer-close").click();
    await page.locator("#novel-gallery-close").click();
  }

  report.scans.push({ viewport: viewport.name, case: `intro-return-${viewport.action}`, before, after, album, passed: true });
  await context.close();
};

const scanMetadataAndRuntimeGallery = async (viewport, stepId) => {
  const { context, page } = await createPage(viewport, `${viewport.name}-${stepId}`);
  await page.goto(new URL("/story", baseUrl).href, { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => Boolean(globalThis.GaiaNovel));
  await seedStorage(page, stepId);
  await page.evaluate(() => {
    const progress = JSON.parse(localStorage.getItem("gaiaSensewareNovel:progress") || "null");
    localStorage.setItem("gaiaSensewareNovel:manual-saves", JSON.stringify([
      { progress, savedAt: Date.now(), meta: { title: "Story menu QA", excerpt: progress.stepId } },
    ]));
  });
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => Boolean(globalThis.GaiaNovel));
  await page.evaluate(() => globalThis.GaiaNovel.open());
  await page.locator("#novel-resume-button").click();
  await page.locator('.novel-save-slot[data-slot-index="0"]').click();
  await page.waitForFunction((id) => document.querySelector("#novel-layer")?.dataset.stepId === id, stepId);
  await page.waitForTimeout(120);
  const scan = await page.evaluate(() => {
    const caption = document.querySelector(".novel-signal-caption");
    const style = getComputedStyle(caption);
    const strong = getComputedStyle(caption.querySelector("strong"));
    const before = getComputedStyle(caption, "::before");
    const after = getComputedStyle(caption, "::after");
    return {
      stepId: document.querySelector("#novel-layer")?.dataset.stepId,
      captionVisible: __qaVisible(caption),
      backgroundColor: style.backgroundColor,
      backgroundImage: style.backgroundImage,
      borderWidths: [style.borderTopWidth, style.borderRightWidth, style.borderBottomWidth, style.borderLeftWidth],
      boxShadow: style.boxShadow,
      backdropFilter: style.backdropFilter,
      textShadow: strong.textShadow,
      pseudoBefore: before.display,
      pseudoAfter: after.display,
      runtimeGalleryDomCount: document.querySelectorAll("#novel-gallery-button,#novel-gallery-count").length,
      runtimeGalleryFocusable: [...document.querySelectorAll("#novel-gallery-button,#novel-gallery-count")].filter((element) => element.tabIndex >= 0).length,
      titleGalleryDomCount: document.querySelectorAll("#novel-title-gallery-button,#novel-title-gallery-progress").length,
      titleGalleryHidden: document.querySelector("#novel-title-gallery-button")?.hidden,
      overflowX: document.documentElement.scrollWidth > innerWidth + 1,
      overflowY: document.documentElement.scrollHeight > innerHeight + 1,
      rect: caption.getBoundingClientRect().toJSON(),
    };
  });
  assert(scan.captionVisible);
  assert(["rgba(0, 0, 0, 0)", "transparent"].includes(scan.backgroundColor));
  assert(scan.backgroundImage.includes("radial-gradient"));
  assert(scan.borderWidths.every((width) => width === "0px"));
  assert.equal(scan.boxShadow, "none");
  assert(["none", ""].includes(scan.backdropFilter));
  assert.notEqual(scan.textShadow, "none");
  assert.equal(scan.pseudoBefore, "block");
  assert.equal(scan.pseudoAfter, "block");
  assert.equal(scan.runtimeGalleryDomCount, 0);
  assert.equal(scan.runtimeGalleryFocusable, 0);
  assert.equal(scan.titleGalleryDomCount, 2);
  assert.equal(scan.titleGalleryHidden, false);
  assert.equal(scan.overflowX, false);
  assert.equal(scan.overflowY, false);
  await page.screenshot({ path: path.join(outputDir, `${viewport.name}-${stepId}-metadata.png`) });
  report.scans.push({ viewport: viewport.name, case: `metadata-runtime-${stepId}`, ...scan, passed: true });
  await context.close();
};

const scanIntroductionSequence = async (viewport) => {
  const expected = [
    ["festival_concept_020", "narration", "narrator", "", "返事を聞くと、青い髪の学生はわずかに目を細めた。画面の端へ触れると、地球が一度だけゆっくり明滅し、海から都市までの光が短くつながった。最初のデモを終えてから、彼女はケーブルを離し、体ごとこちらへ向き直る。"],
    ["festival_concept_021", "dialogue", "amane", "短髪の女性", "「改めまして、私は『あめ』です」"],
    ["festival_concept_022", "narration", "narrator", "", "「あめ」と名乗っても、照れたり笑ったりはしなかった。柔らかな響きとは対照的に、言葉は簡潔だった。"],
    ["festival_concept_023", "dialogue", "mizuha", "長髪の女性", "「みず」と申します。あなたも、うちの大学の方ですの？"],
    ["festival_concept_024", "narration", "narrator", "", "あめと、みず。空から地上へ、二人の名前だけでひとつの流れができていた。本名ではなく、学内で使っている名前らしい。オンラインの大学では、そのほうが自然だった。"],
    ["festival_concept_025", "narration", "narrator", "", "長い髪の学生もタブレットから顔を上げた。表情は落ち着いているが、「うちの大学」と言ったところで眉が少し上がる。答えを予想するより、こちらの返事を楽しみにしているように見えた。"],
    ["festival_concept_026", "narration", "narrator", "", "あめは名乗ったあとも、机の端のケーブルを指先で確かめている。みずはタブレットを両手で持ち、返事を待つあいだ、わずかに首を傾けていた。地球の青い光が、長い髪の内側へ薄く映っている。"],
    ["festival_concept_027", "dialogue", "visitor", "あなた", "「はい。同じ大学の学生です。今日は学生作品を見に来ました。通路から見えた、この地球が気になって」"],
  ];
  const { context, page } = await createPage(viewport, `${viewport.name}-introduction-sequence`);
  const scans = [];
  for (const [stepId, type, speaker, speakerLabel, text] of expected) {
    await page.goto(new URL("/story", baseUrl).href, { waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => Boolean(globalThis.GaiaNovel));
    await seedStorage(page, stepId);
    await page.evaluate(() => {
      const progress = JSON.parse(localStorage.getItem("gaiaSensewareNovel:progress") || "null");
      localStorage.setItem("gaiaSensewareNovel:manual-saves", JSON.stringify([
        { progress, savedAt: Date.now(), meta: { title: "Introduction QA", excerpt: progress.stepId } },
      ]));
    });
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => Boolean(globalThis.GaiaNovel));
    await page.evaluate(() => globalThis.GaiaNovel.open());
    await page.locator("#novel-resume-button").click();
    await page.locator('.novel-save-slot[data-slot-index="0"]').click();
    await page.waitForFunction((id) => document.querySelector("#novel-layer")?.dataset.stepId === id, stepId);
    await page.waitForTimeout(100);
    const scan = await page.evaluate(() => {
      const step = globalThis.GAIA_NOVEL_STORY.scenes.flatMap((scene) => scene.steps)
        .find((candidate) => candidate.id === document.querySelector("#novel-layer")?.dataset.stepId);
      const dialogueText = document.querySelector("#novel-text")?.textContent.trim();
      const pagination = globalThis.GaiaNovel.inspectDialoguePagination(step.text);
      const textElement = document.querySelector("#novel-text");
      const textRect = textElement.getBoundingClientRect();
      const dialogueRect = document.querySelector("#novel-dialogue")?.getBoundingClientRect();
      return {
        stepId: step.id,
        type: step.type,
        internalSpeaker: step.speaker,
        sourceText: step.text,
        speakerLabel: document.querySelector("#novel-speaker")?.textContent.trim(),
        dialogueText,
        pagination: pagination.pages.map((page) => ({ text: page.text, lines: page.lines, maxLines: page.maxLines, fits: page.fits })),
        measuredLines: Number(textElement.dataset.measuredLineCount || 0),
        maxLines: Number(textElement.dataset.maxLineCount || 0),
        safeArea: textRect.bottom <= dialogueRect.bottom + 1,
        cueId: document.querySelector("#novel-layer")?.dataset.backgroundCue,
        backgroundImage: getComputedStyle(document.querySelector("#novel-layer")).backgroundImage,
        formalNameEarly: /雨音|瑞葉/u.test(`${document.querySelector("#novel-speaker")?.textContent}\n${dialogueText}`),
        placementVerb: /置(?:く|か|き|け|こ|い)/u.test(step.text || ""),
        overflowX: document.documentElement.scrollWidth > innerWidth + 1,
        overflowY: document.documentElement.scrollHeight > innerHeight + 1,
      };
    });
    assert.equal(scan.stepId, stepId);
    assert.equal(scan.type, type);
    assert.equal(scan.internalSpeaker, speaker);
    assert.equal(scan.sourceText, text);
    if (speakerLabel) assert.equal(scan.speakerLabel, speakerLabel);
    assert.equal(scan.dialogueText, scan.pagination[0].text);
    assert(scan.pagination.every((page) => page.fits && page.lines <= 3));
    assert(scan.measuredLines <= Math.max(3, scan.maxLines));
    assert(scan.safeArea && !scan.formalNameEarly && !scan.placementVerb);
    assert.equal(scan.overflowX, false);
    assert.equal(scan.overflowY, false);
    if (stepId === "festival_concept_024" && scan.pagination.length > 1) {
      for (let pageIndex = 1; pageIndex < scan.pagination.length; pageIndex += 1) {
        await page.locator("#novel-dialogue").click();
        await page.waitForFunction((expectedPage) => Number(document.querySelector("#novel-text")?.dataset.pageIndex) === expectedPage, pageIndex + 1);
        const pageScan = await page.evaluate(() => ({
          stepId: document.querySelector("#novel-layer")?.dataset.stepId,
          text: document.querySelector("#novel-text")?.textContent.trim(),
          pageIndex: Number(document.querySelector("#novel-text")?.dataset.pageIndex),
          measuredLines: Number(document.querySelector("#novel-text")?.dataset.measuredLineCount || 0),
          overflowX: document.documentElement.scrollWidth > innerWidth + 1,
          overflowY: document.documentElement.scrollHeight > innerHeight + 1,
        }));
        assert.equal(pageScan.stepId, stepId);
        assert.equal(pageScan.text, scan.pagination[pageIndex].text);
        assert(pageScan.measuredLines <= 3 && !pageScan.overflowX && !pageScan.overflowY);
        scan.renderedPages = scan.renderedPages || [{ pageIndex: 1, text: scan.dialogueText, measuredLines: scan.measuredLines }];
        scan.renderedPages.push(pageScan);
        await page.screenshot({ path: path.join(outputDir, `${viewport.name}-${stepId}-decision-copy-page-${pageIndex + 1}.png`) });
      }
    }
    if (["festival_concept_021", "festival_concept_023", "festival_concept_024"].includes(stepId)) {
      await page.screenshot({ path: path.join(outputDir, `${viewport.name}-${stepId}-decision-copy.png`) });
    }
    scans.push(scan);
  }
  assert(scans.slice(1, 3).every((scan) => scan.cueId === "festival-amane-closeup-cg"));
  assert(scans.slice(3, 7).every((scan) => scan.cueId === "festival-mizuha-closeup-cg"));
  assert.equal(scans[7].cueId, "festival-gaia-booth-conversation");
  report.scans.push({
    viewport: viewport.name,
    case: "introduction-decision-copy-020-027",
    interpretation: "024決定稿の後は025/026既存narrationを保持し、027が次のdialogue response。追加step・ID shiftなし。",
    scans,
    passed: true,
  });
  await context.close();
};

const scanRepeatAndBack = async () => {
  const viewport = viewports.find((entry) => entry.name === "pc-1440");
  const { context, page } = await createPage(viewport, "pc-1440-repeat-back");
  await openIntro(page);
  await page.evaluate(() => history.pushState({ qa: true }, "", "#explore"));
  await page.locator(".intro-story-return[data-primary-action='true']").click();
  await page.waitForFunction(() => __qaVisible(document.querySelector("#novel-title-screen")));
  await page.goBack({ waitUntil: "domcontentloaded" });
  await page.waitForTimeout(80);
  const afterBack = await page.evaluate(() => ({
    titleVisible: __qaVisible(document.querySelector("#novel-title-screen")),
    runtimeVisible: __qaVisible(document.querySelector("#novel-runtime")),
    progress: JSON.parse(localStorage.getItem("gaiaSensewareNovel:progress") || "null"),
  }));
  assert(afterBack.titleVisible && !afterBack.runtimeVisible && afterBack.progress.stepId === progressFixture.stepId);
  await page.locator("#novel-close-button").click();
  await page.waitForFunction(() => __qaVisible(document.querySelector("#intro-layer")));
  await page.waitForFunction(() => document.querySelector("#novel-layer")?.hidden === true);
  await page.locator(".intro-story-return[data-primary-action='true']").click();
  await page.waitForFunction(() => (
    __qaVisible(document.querySelector("#novel-layer"))
    && __qaVisible(document.querySelector("#novel-title-screen"))
    && !__qaVisible(document.querySelector("#novel-runtime"))
  ));
  const repeated = await page.evaluate(() => ({
    titleVisible: __qaVisible(document.querySelector("#novel-title-screen")),
    novelVisibleCount: [...document.querySelectorAll("#novel-layer")].filter(__qaVisible).length,
    runtimeVisible: __qaVisible(document.querySelector("#novel-runtime")),
    progress: JSON.parse(localStorage.getItem("gaiaSensewareNovel:progress") || "null"),
    openAtCount: globalThis.__qaNovelOpenAtCount,
    novelOpenCount: globalThis.__qaNovelOpenCount,
  }));
  assert(repeated.titleVisible && !repeated.runtimeVisible && repeated.novelVisibleCount === 1);
  assert.equal(repeated.progress.stepId, progressFixture.stepId);
  assert.deepEqual(repeated.progress.unknownLocalField, progressFixture.unknownLocalField);
  assert.equal(repeated.openAtCount, 2);
  assert.equal(repeated.novelOpenCount, 2);
  report.scans.push({ viewport: viewport.name, case: "browser-back-repeat", afterBack, repeated, passed: true });
  await context.close();
};

const scanRuntimeStoryContract = async () => {
  const viewport = viewports.find((entry) => entry.name === "pc-1440");
  const { context, page } = await createPage(viewport, "runtime-story-contract");
  await page.goto(new URL("/story", baseUrl).href, { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => Boolean(globalThis.GAIA_NOVEL_STORY));
  const scan = await page.evaluate(() => {
    const scenes = globalThis.GAIA_NOVEL_STORY.scenes;
    const steps = scenes.flatMap((scene) => scene.steps);
    const userVisible = steps.filter((step) => ["dialogue", "narration", "ui"].includes(step.type));
    const placementVerb = /置(?:く|か(?:ない|な|せ|ず|ぬ|れ|ろ|ん|せる|れる)?|き|け|こ|い(?:た|て|てある|ていた|ておく)?)/u;
    const containsCharacter = userVisible.filter((step) => String(step.text || "").includes("置"));
    const allText = steps.map((step) => String(step.text || "")).join("\n");
    return {
      sourceSha256: globalThis.GAIA_NOVEL_STORY.sourceSha256,
      sceneCount: scenes.length,
      stepCount: steps.length,
      userVisibleCount: userVisible.length,
      userVisiblePlacementVerbStepIds: userVisible.filter((step) => placementVerb.test(String(step.text || ""))).map((step) => step.id),
      excludedNounOccurrences: containsCharacter.map((step) => ({ stepId: step.id, text: step.text })),
      exactCounts: {
        old024: allText.split("あめと、みず。本名ではなく、学内で使っている名前らしい。オンラインの大学では、そのほうが自然だった。").length - 1,
        final024: allText.split("あめと、みず。空から地上へ、二人の名前だけでひとつの流れができていた。本名ではなく、学内で使っている名前らしい。オンラインの大学では、そのほうが自然だった。").length - 1,
        withdrawn: allText.split("雨が降って、水になる。二人の名前を並べると、偶然にしては出来すぎていた。").length - 1,
      },
    };
  });
  assert.equal(scan.sourceSha256, "fed88965250d118d3db17392a6e4dbd9c853633311a116beb69a2d264f40365d");
  assert.equal(scan.sceneCount, 6);
  assert.equal(scan.stepCount, 386);
  assert.deepEqual(scan.userVisiblePlacementVerbStepIds, []);
  assert.deepEqual(scan.excludedNounOccurrences.map((entry) => entry.stepId), ["festival_concept_028", "map_mode01_024", "esp32_pitch_016", "esp32_pitch_030"]);
  assert.deepEqual(scan.exactCounts, { old024: 0, final024: 1, withdrawn: 0 });
  report.scans.push({ viewport: viewport.name, case: "runtime-story-contract", ...scan, passed: true });
  await context.close();
};

try {
  for (const viewport of viewports) await scanIntroReturn(viewport);
  await scanMetadataAndRuntimeGallery(viewports[0], "festival_concept_001");
  await scanMetadataAndRuntimeGallery(viewports[1], "festival_concept_008");
  await scanMetadataAndRuntimeGallery(viewports[2], "festival_concept_015");
  await scanMetadataAndRuntimeGallery(viewports[3], "festival_concept_001");
  await scanIntroductionSequence(viewports[2]);
  await scanIntroductionSequence(viewports[3]);
  await scanRuntimeStoryContract();
  await scanRepeatAndBack();
  assert.deepEqual(report.consoleErrors, []);
  assert.deepEqual(report.pageErrors, []);
  assert.deepEqual(report.responses404, []);
  report.status = "passed";
} catch (error) {
  report.status = "failed";
  report.failure = { message: error.message, stack: error.stack };
  throw error;
} finally {
  fs.writeFileSync(path.join(outputDir, "report.json"), `${JSON.stringify(report, null, 2)}\n`);
  await browser.close();
}

console.log(JSON.stringify({ status: report.status, scans: report.scans.length, outputDir }, null, 2));
