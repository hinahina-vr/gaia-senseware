import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const canonPath = path.join(projectRoot, "story", "物語台本.md");
const outputPath = path.join(projectRoot, "novel-story-data.js");

const source = fs.readFileSync(canonPath, "utf8").replace(/\r\n?/g, "\n");
const lines = source.split("\n");
const dividerPattern = /^─+$/u;
const headingPattern = /^【(.+)】$/u;

const sections = [];
let current = null;

for (const line of lines) {
  const heading = line.match(headingPattern);
  if (heading) {
    if (current) sections.push(current);
    current = { title: heading[1], lines: [] };
    continue;
  }
  if (current) current.lines.push(line);
}
if (current) sections.push(current);

const archiveIndex = sections.findIndex((section) => section.title.startsWith("ARCHIVES｜"));
const mainSections = sections.slice(0, archiveIndex < 0 ? sections.length : archiveIndex);

const trimSectionLines = (sectionLines) => {
  const copy = [...sectionLines];
  while (copy.length && (!copy[0].trim() || dividerPattern.test(copy[0].trim()))) copy.shift();
  while (copy.length && (!copy.at(-1).trim() || dividerPattern.test(copy.at(-1).trim()))) copy.pop();
  return copy;
};

const sectionQueue = [...mainSections];
const takeSection = (prefix) => {
  const index = sectionQueue.findIndex((section) => section.title.startsWith(prefix));
  if (index < 0) throw new Error(`正本の場面が見つかりません: ${prefix}`);
  return sectionQueue.splice(index, 1)[0];
};

const speakerMap = Object.freeze({
  "ミズハ": "mizuha",
  "アマネ": "amane",
  "サクヤ": "sakuya",
  "プレイヤー": "visitor",
  "参加者": "visitor",
  MIZUHA: "mizuha",
  AMANE: "amane",
  SAKUYA: "sakuya",
  VISITOR: "visitor",
});

const recordTypeFor = (text) => {
  if (/LOCAL SOURCE/u.test(text)) return "LOCAL_SOURCE";
  if (/VISITOR POST|来場者の投稿/u.test(text)) return "VISITOR_POST";
  if (/VISITOR TRACE|操作記録/u.test(text)) return "VISITOR_TRACE";
  if (/DERIVED|計算・解釈/u.test(text)) return "DERIVED";
  if (/SCENARIO|仮定/u.test(text)) return "SCENARIO";
  if (/SOURCE|観測記録|最後の受信文|直前の投稿/u.test(text)) return "SOURCE";
  return null;
};

const isRecordBlock = (text) => Boolean(recordTypeFor(text)) && (
  /^(観測記録|その場の観測|計算・解釈|仮定|操作記録|来場者の投稿|園芸売り場の温度計|最寄り観測所の気温|公開同意|学園祭公開版|削除 \/|復元 \/|編集履歴 \/|直前の投稿|最後の受信文|受信時刻|制作記録|来場者欄の試作|投稿者 \/|分類 \/|サクヤの受信文)/u.test(text)
  || /\n(AUTHOR|GENERATED|EDITORS|SOURCE|DERIVED|VISITOR)/u.test(text)
);

const splitBlocks = (sectionLines) => trimSectionLines(sectionLines)
  .join("\n")
  .split(/\n{2,}/u)
  .map((block) => block.trim())
  .filter(Boolean);

const parseChoiceOptions = (block, choice) => {
  const canonicalLabels = block.split("\n")
    .map((line) => line.match(/^\d+\.\s*(.+)$/u)?.[1])
    .filter(Boolean);
  if (canonicalLabels.length !== choice.options.length) {
    throw new Error(`${choice.id}: 選択肢数が正本と設定で一致しません`);
  }
  return choice.options.map((option, index) => ({ ...option, label: canonicalLabels[index] }));
};

const conditionFromHeading = (block) => {
  if (!/^＜.+＞$/u.test(block)) return null;
  if (/SOURCE RECORD/u.test(block)) return { key: "editorialChoice", value: "SOURCE_RECORD" };
  if (/DISCLOSE DERIVATION/u.test(block)) return { key: "editorialChoice", value: "DISCLOSE_DERIVATION" };
  if (/LEAVE EMPTY/u.test(block)) return { key: "visitorAction", value: "LEAVE_EMPTY" };
  if (/WRITE/u.test(block)) return { key: "visitorAction", value: "WRITE" };
  return null;
};

const parseSceneSteps = (scene, sectionLines) => {
  const steps = [];
  let condition = null;
  let serial = 0;
  const pushStep = (step) => {
    serial += 1;
    steps.push({
      id: `${scene.id}_${String(serial).padStart(3, "0")}`,
      sceneId: scene.id,
      ...(condition ? { condition } : {}),
      ...step,
    });
  };

  for (const block of splitBlocks(sectionLines)) {
    const branchCondition = conditionFromHeading(block);
    if (branchCondition) {
      condition = branchCondition;
      pushStep({ type: "ui", text: block.slice(1, -1) });
      continue;
    }
    if (
      (scene.id === "choice_editorial" && /^セッション内の表示だけ/u.test(block))
      || (scene.id === "choice_visitor_action" && /^どちらにも/u.test(block))
    ) {
      condition = null;
    }

    if (/^\d+\.\s/u.test(block) && scene.choice) {
      pushStep({
        type: "choice",
        choiceId: scene.choice.id,
        prompt: scene.choice.prompt,
        trackedByEves: scene.choice.trackedByEves,
        options: parseChoiceOptions(block, scene.choice),
      });
      continue;
    }

    if (/^［操作｜/u.test(block) && scene.interaction) {
      pushStep({
        type: "interaction",
        interaction: scene.interaction,
        text: block.slice(1, -1),
      });
      continue;
    }

    if (/^［生成履歴を詳しく見る］$/u.test(block)) {
      pushStep({ type: "details", text: "生成履歴を詳しく見る", detailId: "mode07_generation_details" });
      continue;
    }

    const chatMatch = block.match(/^(\d{2}:\d{2})\s{2,}([^\n]+)\n([\s\S]+)$/u);
    if (chatMatch) {
      pushStep({
        type: "chat",
        time: chatMatch[1],
        speaker: speakerMap[chatMatch[2].trim()] || "system",
        speakerLabel: chatMatch[2].trim(),
        text: chatMatch[3],
      });
      continue;
    }

    const dialogueMatch = block.match(/^(ミズハ|アマネ|サクヤ|プレイヤー)：\n([\s\S]+)$/u);
    if (dialogueMatch) {
      pushStep({
        type: "dialogue",
        speaker: speakerMap[dialogueMatch[1]],
        text: dialogueMatch[2],
      });
      continue;
    }

    if (/^####\s+/u.test(block)) {
      pushStep({ type: "transition", text: block.replace(/^####\s+/u, "") });
      continue;
    }

    if (/^［表示｜/u.test(block) || /^［.+］$/u.test(block)) {
      pushStep({ type: "ui", text: block.slice(1, -1) });
      continue;
    }

    const recordType = recordTypeFor(block);
    if (recordType && isRecordBlock(block)) {
      pushStep({ type: "record", recordType, text: block });
      continue;
    }

    if (/^(START|CONNECTED|TEMP：|LIGHT：|MIZUHA\nAMANE\nSAKUYA)/u.test(block)) {
      pushStep({ type: "ui", text: block });
      continue;
    }

    pushStep({ type: "narration", speaker: "narrator", text: block });
  }

  if (scene.id === "epilogue_visitor_field") {
    pushStep({ type: "visitorInput", inputId: "visitor_post", maxLength: 120 });
  }
  if (scene.id === "final_record") {
    pushStep({ type: "result", resultId: "session_result" });
  }
  return steps;
};

const configs = [
  { id: "current_notice", prefix: "CURRENT｜学園祭の展示ホール", chapter: "CURRENT", modeIndex: 9 },
  { id: "opening_empty_seat", prefix: "OPENING｜三か月前／10:21", chapter: "OPENING", modeIndex: 9 },
  { id: "prologue_online_circle", prefix: "PROLOGUE｜文字だけだった三人", chapter: "PROLOGUE", modeIndex: 0, split: "ミズハ、アマネ、サクヤが初めて同じスレッドに揃った" },
  { id: "choice_observation_order", prefix: "プレイヤーの小さな選択｜どちらから見る？", chapter: "PROLOGUE", modeIndex: 0, choice: {
    id: "observation_order", prompt: "どちらから見る？", trackedByEves: false,
    options: [
      { value: "LOCAL_FIRST", next: "first_meeting_promise" },
      { value: "STATION_FIRST", next: "first_meeting_promise" },
    ],
  } },
  { id: "first_meeting_promise", prefix: "00:08｜初めて会う約束", chapter: "PROLOGUE", modeIndex: 0 },
  { id: "first_meeting_hall", prefix: "09:48｜海沿いの展示場・中央入口", chapter: "PROLOGUE", modeIndex: 0 },
  { id: "festival_walk", prefix: "17:06｜展示ホールをつなぐ連絡通路", chapter: "PROLOGUE", modeIndex: 0 },
  { id: "production_year", prefix: "九か月間｜三人で作ったもの", chapter: "PRODUCTION", modeIndex: 5 },
  { id: "absence", prefix: "三か月前／来なかった日", chapter: "ABSENCE", modeIndex: 2 },
  { id: "search", prefix: "その日から二週間｜安否確認", chapter: "SEARCH", modeIndex: 2 },
  { id: "festival_build", prefix: "CURRENT｜公開されたGAIA SENSEWARE", chapter: "CURRENT", modeIndex: 9 },
  { id: "gx_deep_time", prefix: "GXモード｜太古の海", chapter: "GX", modeIndex: 0, interaction: { kind: "gx", requiredGestures: 3 } },
  { id: "mode03_map", prefix: "MODE 03｜地図モード／森の気候装置", chapter: "MODE 03", modeIndex: 2, interaction: { kind: "map03", requiredLayers: ["forest", "rain", "overlay"] } },
  { id: "mode07_abstract", prefix: "MODE 07｜抽象モード／届いた時刻、開いた時刻", chapter: "MODE 07", modeIndex: 6, interaction: { kind: "abstract07", requiredPoints: 1 } },
  { id: "interlude_sea", prefix: "INTERLUDE｜十二分の海", chapter: "INTERLUDE", modeIndex: 6 },
  { id: "mode08_map_layers", prefix: "MODE 08｜地図モード／三つの生態系", chapter: "MODE 08", modeIndex: 7, interaction: { kind: "map08", requiredLayers: ["nature", "life", "memory"] } },
  { id: "mode10_space", prefix: "MODE 10｜宇宙モード／最後の受信文", chapter: "MODE 10", modeIndex: 9, interaction: { kind: "space10", requiredGestures: 1 } },
  { id: "choice_editorial", prefix: "編集方針の選択｜最終画面に何を残すか", chapter: "EDITORIAL CHOICE", modeIndex: 9, choice: {
    id: "editorial_choice", prompt: "最終画面に何を残すか", trackedByEves: true,
    options: [
      { value: "SOURCE_RECORD", next: "epilogue_visitor_field" },
      { value: "DISCLOSE_DERIVATION", next: "epilogue_visitor_field" },
    ],
  } },
  { id: "epilogue_visitor_field", prefix: "EPILOGUE｜書き込み欄 / WRITE ACCESS", chapter: "EPILOGUE", modeIndex: 9 },
  { id: "choice_visitor_action", prefix: "最後の選択｜自分の記録を置くか", chapter: "FINAL CHOICE", modeIndex: 9, choice: {
    id: "visitor_action", prompt: "自分の記録を置くか", trackedByEves: true,
    options: [
      { value: "WRITE", next: "final_record" },
      { value: "LEAVE_EMPTY", next: "final_record" },
    ],
  } },
  { id: "final_record", prefix: "最終表示｜誰が何を残したか", chapter: "FINAL RECORD", modeIndex: 9 },
];

const scenes = [];
for (const config of configs) {
  const section = takeSection(config.prefix);
  const base = {
    id: config.id,
    title: section.title,
    chapter: config.chapter,
    modeIndex: config.modeIndex,
    ...(config.interaction ? { interaction: config.interaction } : {}),
    ...(config.choice ? { choice: config.choice } : {}),
  };

  if (config.split) {
    const splitAt = section.lines.findIndex((line) => line.startsWith(config.split));
    if (splitAt < 0) throw new Error(`${config.id}: 分割位置が見つかりません`);
    const first = { ...base, steps: parseSceneSteps(base, section.lines.slice(0, splitAt)) };
    const basil = {
      id: "prologue_basil",
      title: "PROLOGUE｜バジルの投稿",
      chapter: "PROLOGUE",
      modeIndex: 0,
    };
    basil.steps = parseSceneSteps(basil, section.lines.slice(splitAt));
    scenes.push(first, basil);
  } else {
    scenes.push({ ...base, steps: parseSceneSteps(base, section.lines) });
  }
}

const returnScene = {
  id: "return_to_start",
  title: "END OF PLAYER STORY",
  chapter: "END",
  modeIndex: 9,
  steps: [{ id: "return_to_start_001", sceneId: "return_to_start", type: "end", text: "START" }],
};
scenes.push(returnScene);

scenes.forEach((scene, index) => {
  scene.nextSceneId = scenes[index + 1]?.id || null;
});

const story = {
  storyVersion: 6,
  title: "GAIA SENSATION",
  systemTitle: "GAIA SENSEWARE",
  startSceneId: "current_notice",
  saveFields: [
    "storyVersion", "stepId", "reachedSceneIds", "viewed", "evesRoute",
    "observationOrder", "editorialChoice", "visitorAction", "audio", "readStepIds",
    "clear", "archivesUnlocked", "sessionId",
  ],
  visitorInput: { maxLength: 120, persistent: false },
  requiredSceneIds: scenes.map((scene) => scene.id),
  requiredInteractions: ["gx", "map03", "abstract07", "map08", "space10"],
  finalResults: [
    "SOURCE_RECORD×WRITE",
    "SOURCE_RECORD×LEAVE_EMPTY",
    "DISCLOSE_DERIVATION×WRITE",
    "DISCLOSE_DERIVATION×LEAVE_EMPTY",
  ],
  generationDetails: {
    referencePostCount: "制作ログに件数記録なし",
    similarPostCount: "制作ログに件数記録なし",
    candidateCount: "複数候補から1件を選定（総数記録なし）",
    model: "Qwen2.5-3B-Instruct / ローカル実行",
    temperature: "制作ログに記録なし",
    seed: "制作ログに記録なし",
    generatedAt: "公開前夜（詳細時刻の記録なし）",
    exclusions: "個別メッセージ、授業チャンネル、送信されなかった本文",
    edited: "本文の編集なし",
  },
  scenes,
};

const banner = "// Generated from story/物語台本.md by scripts/build-novel-story.mjs. Do not edit by hand.\n";
const output = `${banner}globalThis.GAIA_NOVEL_STORY_V6 = Object.freeze(${JSON.stringify(story, null, 2)});\n`;
fs.writeFileSync(outputPath, output, "utf8");
console.log(`wrote ${path.relative(projectRoot, outputPath)} (${scenes.length} scenes)`);
