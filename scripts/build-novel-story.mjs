import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const canonPath = path.join(projectRoot, "story", "物語台本.md");
const outputPath = path.join(projectRoot, "novel-story-data.js");

const REFLECTION_OPTIONS = Object.freeze([
  ["R01", "意味を決める前に、聞こえなかった可能性を残す。", 0, 2, 1],
  ["R02", "中央の正解より、各地の異なる判断を生かす。", 0, 1, 2],
  ["R03", "将来世代が検証できる形で、いまの判断を保存する。", 2, 1, 0],
  ["R04", "制度が拾えない変化を、個人の感覚から始める。", 0, 1, 2],
  ["R05", "記録されないものを、存在しなかったことにしない。", 2, 1, 0],
  ["R06", "技術を拒絶も崇拝もせず、作用した場所を追う。", 1, 2, 1],
  ["R07", "人間の都合で消える生態系に、法的な代理を与える。", 2, 0, 1],
  ["R08", "矛盾する二つの記録を、急いで一つにしない。", 0, 2, 1],
  ["R09", "完成した記録より、書き換え続けられる余白を残す。", 0, 1, 2],
  ["R10", "解釈より先に、出典と変更履歴を残す。", 2, 1, 0],
  ["R11", "安全な解釈より、まだ名のない可能性へ進む。", 0, 1, 2],
  ["R12", "正しさより、どこから見た記録かを確かめる。", 1, 2, 0],
  ["R13", "一つの尺度で測れないものを、比較不能のまま置く。", 0, 2, 1],
  ["R14", "責任の所在が消える共同制作を、認めない。", 2, 0, 1],
  ["R15", "記録する権利と同じだけ、記録されない権利を守る。", 0, 1, 2],
  ["R16", "人間と地球の境界を固定せず、関係の変化を見る。", 0, 2, 1],
  ["R17", "不確実でも、被害を抑える側へ制度を動かす。", 2, 1, 0],
  ["R18", "既存の分類に入らない声のために、分類そのものを壊す。", 0, 0, 2],
  ["R19", "声の大きさではなく、再現可能な証拠を基準にする。", 2, 1, 0],
  ["R20", "誰の声でもない現象に、話者を作らない。", 1, 2, 0],
  ["R21", "未来のためという名目で、現在の自由を差し出さない。", 1, 0, 2],
  ["R22", "空欄を欠陥ではなく、観測できなかった証拠として扱う。", 1, 2, 0],
  ["R23", "観測者であることをやめ、結果へ介入する。", 0, 0, 2],
  ["R24", "誰が変えたか辿れない生成物を、公開しない。", 2, 0, 0],
  ["R25", "再現できない経験にも、世界を変える力を認める。", 0, 1, 2],
  ["R26", "迷ったときは、取り返しのつかない損失を先に防ぐ。", 2, 1, 0],
  ["R27", "原文と生成文のあいだに、優劣ではなく距離を表示する。", 1, 2, 0],
  ["R28", "観測装置の限界も、記録の一部として公開する。", 2, 1, 0],
  ["R29", "出典が正しくても、世界を閉じる説明には従わない。", 0, 1, 2],
  ["R30", "分からないという状態を、判断の失敗にしない。", 0, 2, 1],
  ["R31", "地球規模の危機には、個人の自由より共通規則を優先する。", 2, 0, 1],
  ["R32", "人間の外側に意味を求めず、人間が選んだ意味を引き受ける。", 0, 1, 2],
  ["R33", "未来への責任を語る前に、現在の犠牲を数える。", 1, 2, 0],
  ["R34", "公共の記録は、私的な物語より改変に強くする。", 2, 0, 0],
  ["R35", "責任者の許可より、当事者の異議を先に通す。", 0, 1, 2],
  ["R36", "結論を共有できなくても、検証の手続きを共有する。", 1, 2, 0],
].map(([id, text, law, neutral, chaos]) => ({ id, text, weights: { law, neutral, chaos } })));

const source = fs.readFileSync(canonPath, "utf8").replace(/\r\n?/g, "\n");
const temporalMetadataMatch = source.match(/<!-- GAIA_TEMPORAL_METADATA\n([\s\S]*?)\nGAIA_TEMPORAL_METADATA -->/u);
if (!temporalMetadataMatch) throw new Error("正本にGAIA_TEMPORAL_METADATAがありません");
let temporalMetadata;
try {
  temporalMetadata = JSON.parse(temporalMetadataMatch[1]);
} catch (error) {
  throw new Error(`GAIA_TEMPORAL_METADATAを解析できません: ${error.message}`);
}
if (temporalMetadata.clockPolicy !== "AUTHOR_FIXED") throw new Error("日時metadataのclockPolicyはAUTHOR_FIXEDである必要があります");
if (temporalMetadata.missingMetadataPolicy !== "ERROR") throw new Error("日時metadataの欠損方針はERRORである必要があります");
if (!Array.isArray(temporalMetadata.sceneOrder) || !temporalMetadata.scenes || typeof temporalMetadata.scenes !== "object") {
  throw new Error("日時metadataにはsceneOrderとscenesが必要です");
}
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
const sectionQueue = [...mainSections];

const trimSectionLines = (sectionLines) => {
  const copy = [...sectionLines];
  while (copy.length && (!copy[0].trim() || dividerPattern.test(copy[0].trim()))) copy.shift();
  while (copy.length && (!copy.at(-1).trim() || dividerPattern.test(copy.at(-1).trim()))) copy.pop();
  return copy;
};
const takeSection = (prefix) => {
  const index = sectionQueue.findIndex((section) => section.title.startsWith(prefix));
  if (index < 0) throw new Error(`正本の場面が見つかりません: ${prefix}`);
  return sectionQueue.splice(index, 1)[0];
};
const splitBlocks = (sectionLines) => trimSectionLines(sectionLines)
  .join("\n")
  .split(/\n{2,}/u)
  .map((block) => block.trim())
  .filter(Boolean);

const speakerMap = Object.freeze({
  "ミズハ": "mizuha", "アマネ": "amane", "サクヤ": "sakuya", "プレイヤー": "visitor", "参加者": "visitor",
  "🌱 みず 🌱": "mizuha", "☁️ あまあま ☁️": "amane", "🌸 saku 🌸": "sakuya",
  MIZUHA: "mizuha", AMANE: "amane", SAKUYA: "sakuya", VISITOR: "visitor",
});
const attachmentPattern = /^[［[](?:画像添付|添付画像)｜([A-Z0-9_]+)｜(.+)[］\]]$/iu;
const parseChatContent = (rawText) => {
  const attachments = [];
  const text = rawText
    .split("\n")
    .filter((line) => {
      const attachment = line.trim().match(attachmentPattern);
      if (!attachment) return true;
      attachments.push({ id: attachment[1].toUpperCase(), description: attachment[2] });
      return false;
    })
    .join("\n")
    .trim();
  return { text, ...(attachments.length ? { attachments } : {}) };
};
const recordTypeFor = (text) => {
  if (/LOCAL SOURCE/u.test(text)) return "LOCAL_SOURCE";
  if (/VISITOR TRACE|操作記録/u.test(text)) return "VISITOR_TRACE";
  if (/DERIVED|計算・解釈|展示のために変換した表示|ミズハが生成し、候補から選んだ文章/u.test(text)) return "DERIVED";
  if (/SCENARIO|仮定/u.test(text)) return "SCENARIO";
  if (/SOURCE|観測記録|最後の受信文|直前の投稿|サクヤ本人から届いた文章|サクヤから最後に届いた投稿|直前に届いた投稿/u.test(text)) return "SOURCE";
  return null;
};
const isRecordBlock = (text) => Boolean(recordTypeFor(text)) && (
  /^(観測記録|その場の観測|計算・解釈|仮定|操作記録|園芸売り場の温度計|最寄り観測所の気温|公開同意|学園祭公開版|削除 \/|復元 \/|編集履歴 \/|直前の投稿|最後の受信文|受信時刻|制作記録|サクヤの受信文|展示のために変換した表示|ミズハが生成し、候補から選んだ文章|サクヤ本人から届いた文章|サクヤから最後に届いた投稿|直前に届いた投稿)/u.test(text)
  || /\n(AUTHOR|GENERATED|EDITORS|SOURCE|DERIVED|VISITOR)/u.test(text)
);
const parseChoiceOptions = (block, choice) => {
  const canonicalLabels = block.split("\n").map((line) => line.match(/^\d+\.\s*(.+)$/u)?.[1]).filter(Boolean);
  if (canonicalLabels.length !== choice.options.length) throw new Error(`${choice.id}: 選択肢数が正本と設定で一致しません`);
  return choice.options.map((option, index) => ({ ...option, label: canonicalLabels[index] }));
};
const conditionFromHeading = (block) => {
  if (!/^＜.+＞$/u.test(block)) return null;
  if (/本人から届いた記録だけを表示/u.test(block)) return { key: "editorialChoice", value: "SOURCE_RECORD" };
  if (/本人の記録と生成した部分を分けて表示/u.test(block)) return { key: "editorialChoice", value: "DISCLOSE_DERIVATION" };
  return null;
};

const parseSceneSteps = (scene, sectionLines) => {
  const steps = [];
  let condition = null;
  let serial = 0;
  let reflectionAdded = false;
  let themedReflectionOptions = [];
  const pushStep = (step) => {
    serial += 1;
    steps.push({ id: `${scene.id}_${String(serial).padStart(3, "0")}`, sceneId: scene.id, ...(condition ? { condition } : {}), ...step });
  };

  if (scene.id === "final_record") pushStep({ type: "result", resultId: "session_result" });

  if (scene.reflectionChoice) {
    const optionById = new Map(REFLECTION_OPTIONS.map((option) => [option.id, option]));
    let currentTheme = null;
    for (const line of sectionLines) {
      const themeMatch = line.match(/^［テーマ(\d+)｜(.+)］$/u);
      if (themeMatch) {
        currentTheme = { themeId: `T${themeMatch[1]}`, theme: themeMatch[2] };
        continue;
      }
      const optionMatch = line.match(/^(R\d{2})｜(.+)$/u);
      if (!optionMatch) continue;
      if (!currentTheme) throw new Error(`reflection_choice: ${optionMatch[1]}にテーマがありません`);
      const option = optionById.get(optionMatch[1]);
      if (!option) throw new Error(`reflection_choice: 未知のIDです: ${optionMatch[1]}`);
      if (option.text !== optionMatch[2]) throw new Error(`reflection_choice: ${option.id}の文面が正本と一致しません`);
      themedReflectionOptions.push({ ...option, ...currentTheme });
    }
    if (themedReflectionOptions.length) {
      if (themedReflectionOptions.length !== REFLECTION_OPTIONS.length) throw new Error("reflection_choice: 正本には36文が必要です");
      if (new Set(themedReflectionOptions.map((option) => option.id)).size !== REFLECTION_OPTIONS.length) throw new Error("reflection_choice: R番号が重複しています");
      if (new Set(themedReflectionOptions.map((option) => option.themeId)).size !== 6) throw new Error("reflection_choice: テーマは6件必要です");
      themedReflectionOptions.sort((left, right) => left.id.localeCompare(right.id, "en"));
    }
  }

  for (const block of splitBlocks(sectionLines)) {
    const branchCondition = conditionFromHeading(block);
    if (branchCondition) {
      condition = branchCondition;
      pushStep({ type: "ui", text: block.slice(1, -1) });
      continue;
    }
    if (scene.id === "choice_editorial" && /^セッション内の表示だけ/u.test(block)) condition = null;

    if (scene.reflectionChoice && (/^［テーマ\d+｜/u.test(block) || /^R\d{2}｜/u.test(block))) {
      if (!reflectionAdded) {
        pushStep({
          type: "reflectionChoice",
          choiceId: "reflection_choice",
          prompt: scene.reflectionChoice.prompt,
          trackedByEves: true,
          maxSelections: 3,
          options: themedReflectionOptions,
        });
        reflectionAdded = true;
      }
      continue;
    }

    if (/^\d+\.\s/u.test(block) && scene.reflectionChoice) {
      const canonical = block.split("\n").map((line) => line.match(/^\d+\.\s*(.+)$/u)?.[1]).filter(Boolean);
      if (canonical.length !== REFLECTION_OPTIONS.length) throw new Error("reflection_choice: 正本には36文が必要です");
      REFLECTION_OPTIONS.forEach((option, index) => {
        if (canonical[index] !== option.text) throw new Error(`reflection_choice: ${index + 1}番の文面が正本と一致しません`);
      });
      pushStep({
        type: "reflectionChoice",
        choiceId: "reflection_choice",
        prompt: scene.reflectionChoice.prompt,
        trackedByEves: true,
        maxSelections: 3,
        options: REFLECTION_OPTIONS,
      });
      reflectionAdded = true;
      continue;
    }
    if (/^\d+\.\s/u.test(block) && scene.choice) {
      pushStep({ type: "choice", choiceId: scene.choice.id, prompt: scene.choice.prompt, trackedByEves: scene.choice.trackedByEves, options: parseChoiceOptions(block, scene.choice) });
      continue;
    }
    if (/^［操作｜/u.test(block) && scene.interaction) {
      const interactionAlreadyAdded = steps.some((step) => step.type === "interaction");
      pushStep(interactionAlreadyAdded
        ? { type: "ui", text: block.slice(1, -1) }
        : { type: "interaction", interaction: scene.interaction, text: block.slice(1, -1) });
      continue;
    }
    if (/^［生成履歴を詳しく見る］$/u.test(block)) {
      pushStep({ type: "details", text: "生成履歴を詳しく見る", detailId: "mode07_generation_details" });
      continue;
    }
    if (/^［表示｜END］$/u.test(block)) {
      pushStep({ type: "end", text: "END" });
      continue;
    }
    const phaseMatch = block.match(/^<!-- GAIA_PHASE\|([A-Z0-9_]+) -->$/u);
    if (phaseMatch) {
      pushStep({ type: "phase", phase: phaseMatch[1] });
      continue;
    }
    const chatMatch = block.match(/^((?:\d{2}:\d{2})|昼)\s{2,}([^\n]+)\n([\s\S]+)$/u);
    if (chatMatch) {
      pushStep({
        type: "chat",
        time: chatMatch[1],
        speaker: speakerMap[chatMatch[2].trim()] || "system",
        speakerLabel: chatMatch[2].trim(),
        ...parseChatContent(chatMatch[3]),
      });
      continue;
    }
    const dialogueMatch = block.match(/^(ミズハ|アマネ|サクヤ|プレイヤー)：\n([\s\S]+)$/u);
    if (dialogueMatch) {
      pushStep({ type: "dialogue", speaker: speakerMap[dialogueMatch[1]], text: dialogueMatch[2] });
      continue;
    }
    if (/^####\s+/u.test(block)) { pushStep({ type: "transition", text: block.replace(/^####\s+/u, "") }); continue; }
    if (/^［表示｜/u.test(block) || /^［.+］$/u.test(block)) { pushStep({ type: "ui", text: block.slice(1, -1) }); continue; }
    const recordType = recordTypeFor(block);
    if (recordType && isRecordBlock(block)) { pushStep({ type: "record", recordType, text: block }); continue; }
    if (/^(START|CONNECTED|TEMP：|LIGHT：|MIZUHA\nAMANE\nSAKUYA)/u.test(block)) { pushStep({ type: "ui", text: block }); continue; }
    pushStep({ type: "narration", speaker: "narrator", text: block });
  }
  return steps;
};

const configs = [
  { id: "current_exhibition", prefix: "現在の展示｜学園祭の展示ホール", chapter: "現在", modeIndex: 9 },
  { id: "opening_empty_seat", prefix: "OPENING｜空席", chapter: "OPENING", modeIndex: 9 },
  { id: "prologue_online_circle", prefix: "PROLOGUE｜文字だけだった三人", chapter: "PROLOGUE", modeIndex: 0, split: "二日後、園芸売り場にいるみずが、学内サークル「惑星の放課後」のチャットへ、バジル一鉢の写真を投稿した。" },
  { id: "choice_observation_order", prefix: "現在の展示｜売り場と観測所", chapter: "PROLOGUE", modeIndex: 0, legacyChoice: { id: "observation_order", defaultValue: "LOCAL_FIRST", values: ["LOCAL_FIRST", "STATION_FIRST"] } },
  { id: "first_meeting_promise", prefix: "00:08｜初めて会う約束", chapter: "PROLOGUE", modeIndex: 0 },
  { id: "first_meeting_hall", prefix: "09:48｜海沿いの展示場・中央入口", chapter: "PROLOGUE", modeIndex: 0 },
  { id: "festival_walk", prefix: "17:06｜展示ホールをつなぐ連絡通路", chapter: "PROLOGUE", modeIndex: 0 },
  { id: "production_year", prefix: "九か月間｜三人で作ったもの", chapter: "PRODUCTION", modeIndex: 5 },
  { id: "absence", prefix: "三か月前／来なかった日", chapter: "ABSENCE", modeIndex: 2 },
  { id: "search", prefix: "その日から二週間｜安否確認", chapter: "SEARCH", modeIndex: 2 },
  { id: "festival_build", prefix: "現在の展示｜公開されたGAIA SENSEWARE", chapter: "現在", modeIndex: 9 },
  { id: "gx_deep_time", prefix: "GXモード｜太古の海", chapter: "GX", modeIndex: 0, interaction: { kind: "gx", requiredGestures: 3 } },
  { id: "mode03_map", prefix: "MODE 03｜地図モード／森の気候装置", chapter: "MODE 03", modeIndex: 2, interaction: { kind: "map03", requiredLayers: ["forest", "rain", "overlay"] } },
  { id: "mode07_abstract", prefix: "MODE 07｜抽象モード／届いた時刻、開いた時刻", chapter: "MODE 07", modeIndex: 6, interaction: { kind: "abstract07", requiredPoints: 1 } },
  { id: "interlude_sea", prefix: "INTERLUDE｜十二分の海", chapter: "INTERLUDE", modeIndex: 6 },
  { id: "mode08_map_layers", prefix: "MODE 08｜地図モード／三つの生態系", chapter: "MODE 08", modeIndex: 7, interaction: { kind: "map08", requiredLayers: ["nature", "life", "memory"], optional: true } },
  { id: "mode10_space", prefix: "MODE 10｜宇宙モード／最後の受信文", chapter: "MODE 10", modeIndex: 9, interaction: { kind: "space10", requiredGestures: 1 } },
  { id: "choice_editorial", prefix: "編集方針の選択｜最終画面に何を残すか", chapter: "EDITORIAL CHOICE", modeIndex: 9, choice: { id: "editorial_choice", prompt: "最終画面に何を残すか", trackedByEves: true, options: [{ value: "SOURCE_RECORD", next: "epilogue_reflection_field" }, { value: "DISCLOSE_DERIVATION", next: "epilogue_reflection_field" }] } },
  { id: "epilogue_reflection_field", prefix: "EPILOGUE｜次へ持ち帰りたい姿勢", chapter: "EPILOGUE", modeIndex: 9 },
  { id: "choice_reflection", prefix: "最後の選択｜次へ渡す姿勢", chapter: "FINAL CHOICE", modeIndex: 9, reflectionChoice: { prompt: "次へ渡したい姿勢を、最大3つまで選んでください。" } },
  { id: "final_record", prefix: "最終表示｜選んだ姿勢を空間へ返す", chapter: "FINAL RECORD", modeIndex: 9 },
  { id: "return_to_start", prefix: "CURRENT CONTACT｜展示を一時休止する", chapter: "CURRENT CONTACT", modeIndex: 9 },
];

const scenes = [];
for (const config of configs) {
  const section = takeSection(config.prefix);
  const base = { id: config.id, title: section.title, chapter: config.chapter, modeIndex: config.modeIndex, ...(config.interaction ? { interaction: config.interaction } : {}), ...(config.choice ? { choice: config.choice } : {}), ...(config.legacyChoice ? { legacyChoice: config.legacyChoice } : {}), ...(config.reflectionChoice ? { reflectionChoice: config.reflectionChoice } : {}) };
  if (config.split) {
    const splitAt = section.lines.findIndex((line) => line.startsWith(config.split));
    if (splitAt < 0) throw new Error(`${config.id}: 分割位置が見つかりません`);
    scenes.push({ ...base, steps: parseSceneSteps(base, section.lines.slice(0, splitAt)) });
    const basil = { id: "prologue_basil", title: "PROLOGUE｜バジルの投稿", chapter: "PROLOGUE", modeIndex: 0 };
    basil.steps = parseSceneSteps(basil, section.lines.slice(splitAt));
    scenes.push(basil);
  } else {
    scenes.push({ ...base, steps: parseSceneSteps(base, section.lines) });
  }
}

scenes.forEach((scene, index) => { scene.nextSceneId = scenes[index + 1]?.id || null; });
const generatedSceneOrder = scenes.map((scene) => scene.id);
if (JSON.stringify(temporalMetadata.sceneOrder) !== JSON.stringify(generatedSceneOrder)) {
  throw new Error(`日時metadataのsceneOrderが生成sceneと一致しません: ${JSON.stringify(generatedSceneOrder)}`);
}
for (const scene of scenes) {
  const temporal = temporalMetadata.scenes[scene.id];
  if (!temporal) throw new Error(`${scene.id}: 日時metadataがありません`);
  const stepIds = new Set(scene.steps.map((step) => step.id));
  for (const transition of [temporal.entryTransition, ...(temporal.transitions || [])].filter(Boolean)) {
    if (transition.stepId && !stepIds.has(transition.stepId)) throw new Error(`${scene.id}: 日時transitionのstepがありません: ${transition.stepId}`);
  }
  scene.temporal = temporal;
}

const tones = ["LAW", "NEUTRAL", "CHAOS", "UNANSWERED"];
const story = {
  storyVersion: 9,
  title: "GAIA SENSATION",
  systemTitle: "GAIA SENSEWARE",
  startSceneId: "current_exhibition",
  temporal: {
    schemaVersion: temporalMetadata.schemaVersion,
    calendar: temporalMetadata.calendar,
    timeZone: temporalMetadata.timeZone,
    currentYear: temporalMetadata.currentYear,
    clockPolicy: temporalMetadata.clockPolicy,
    missingMetadataPolicy: temporalMetadata.missingMetadataPolicy,
    sceneOrder: temporalMetadata.sceneOrder,
    archives: temporalMetadata.archives,
  },
  saveFields: ["storyVersion", "stepId", "reachedSceneIds", "viewed", "evesRoute", "observationOrder", "editorialChoice", "reflectionIds", "resultTone", "audio", "readStepIds", "clear", "archivesUnlocked", "sessionId"],
  requiredSceneIds: scenes.map((scene) => scene.id),
  requiredInteractions: ["gx", "map03", "abstract07", "map08", "space10"],
  finalResults: ["SOURCE_RECORD", "DISCLOSE_DERIVATION"].flatMap((editorial) => tones.map((tone) => `${editorial}×${tone}`)),
  resultCopy: {
    LAW: "選んだ文の光が細い線へ集まり、地球の輪郭を一周して消えた。",
    NEUTRAL: "選んだ文の光は、重なりと間を残したまま、ゆっくり消えた。",
    CHAOS: "選んだ文の光は複数の方向へ広がり、画面の外へ消えた。",
    UNANSWERED: "新しい光は加わらず、地球の輪郭だけが残った。",
  },
  generationDetails: {
    referencePostCount: "制作ログに件数記録なし", similarPostCount: "制作ログに件数記録なし", candidateCount: "複数候補から1件を選定（総数記録なし）",
    model: "Qwen2.5-3B-Instruct / ローカル実行", temperature: "制作ログに記録なし", seed: "制作ログに記録なし", generatedAt: "公開前夜（詳細時刻の記録なし）",
    exclusions: "個別メッセージ、授業チャンネル、送信されなかった本文", edited: "本文の編集なし",
  },
  scenes,
};

const banner = "// Generated from story/物語台本.md by scripts/build-novel-story.mjs. Do not edit by hand.\n";
const output = `${banner}globalThis.GAIA_NOVEL_STORY = Object.freeze(${JSON.stringify(story, null, 2)});\nglobalThis.GAIA_NOVEL_STORY_V6 = globalThis.GAIA_NOVEL_STORY;\n`;
fs.writeFileSync(outputPath, output, "utf8");
console.log(`wrote ${path.relative(projectRoot, outputPath)} (${scenes.length} scenes)`);
