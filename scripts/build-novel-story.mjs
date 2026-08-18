import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const canonPath = path.join(projectRoot, "story", "物語台本.md");
const characterCanonPath = path.join(projectRoot, "story", "キャラクター設定.md");
const retainedPath = path.join(projectRoot, "contest-limited", "story", "機能限定版台本.md");
const outputPath = path.join(projectRoot, "novel-story-data.js");
const EXPECTED_SOURCE_SHA256 = "150ed7b00481fab2bf1fbe801356f2b83eee6e342c86040a32fa97b4a0dd0ea6";

const sourceBytes = fs.readFileSync(canonPath);
const characterSourceBytes = fs.readFileSync(characterCanonPath);
const retainedBytes = fs.readFileSync(retainedPath);
const sha256 = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
if (sha256(sourceBytes) !== EXPECTED_SOURCE_SHA256) throw new Error("story/物語台本.mdがfreeze入力と一致しません");
if (!sourceBytes.equals(retainedBytes)) throw new Error("repo保持版の機能限定版台本が正本と一致しません");
const characterSource = characterSourceBytes.toString("utf8");
const characters = Object.freeze({
  amane: Object.freeze({ formalName: "雨音", reading: "アマネ", campusName: "あめ" }),
  mizuha: Object.freeze({ formalName: "瑞葉", reading: "ミズハ", campusName: "みず" }),
  sakuya: Object.freeze({ formalName: "咲弥", reading: "サクヤ", campusName: "saku" }),
});
for (const profile of Object.values(characters)) {
  if (!characterSource.includes(`【${profile.formalName}（${profile.reading}）】`)) {
    throw new Error(`story/キャラクター設定.mdに正式名 ${profile.formalName}（${profile.reading}）がありません`);
  }
}
const source = sourceBytes.toString("utf8").replace(/\r\n?/gu, "\n");
if (Buffer.from(source, "utf8").length !== sourceBytes.length) throw new Error("正本はUTF-8/LFである必要があります");

const EXPECTED_SCENE_IDS = Object.freeze([
  "festival_concept",
  "map_mode01",
  "gx_experience",
  "esp32_pitch",
  "circle_invitation",
  "welcome_chat",
]);

const INTERACTION_CONFIG = Object.freeze({
  map_mode01: Object.freeze({
    kind: "map01",
    modeIndex: 0,
    modeId: "breathing-earth",
    requiredViews: Object.freeze(["long_term", "temperature_anomaly"]),
    afterText: "「こちらがMODE 01です。年代のスライダーを動かしてから、地図の気になる場所を押してみてください」",
  }),
  gx_experience: Object.freeze({
    kind: "gx",
    requiredGestures: 3,
    afterText: "「ええ。いまの海や大気とは、まったく違う地球まで戻りますの」",
  }),
});

const speakerMap = new Map([
  ["ミズハ", "mizuha"],
  ["アマネ", "amane"],
  ["プレイヤー", "visitor"],
]);
const speakerLabelMap = new Map([
  ["ミズハ", "みず"],
  ["アマネ", "あめ"],
  ["プレイヤー", "プレイヤー"],
]);
const chatSpeakerMap = new Map([
  ["MIZUHA", "mizuha"],
  ["AMANE", "amane"],
  ["saku", "sakuya"],
  ["YOU", "visitor"],
  ["青猫", "visitor"],
  ["SYSTEM", "system"],
]);
const chatSpeakerLabelMap = new Map([
  ["MIZUHA", "みず"],
  ["AMANE", "あめ"],
  ["saku", "saku"],
  ["YOU", "YOU"],
  ["青猫", "青猫"],
  ["SYSTEM", "SYSTEM"],
]);

const parseBlock = (block, sceneId) => {
  const dialogue = block.match(/^(ミズハ|アマネ|プレイヤー)：\n([\s\S]+)$/u);
  if (dialogue) {
    const [rawSpeaker, text] = dialogue.slice(1);
    const speakerLabel = rawSpeaker === "アマネ" && /私は[『「]あめ[』」]|体験してみませんか/u.test(text)
      ? "女の子"
      : rawSpeaker === "ミズハ" && /「みず」と申します。/u.test(text)
        ? "もう一人の女の子"
        : speakerLabelMap.get(rawSpeaker);
    return { type: "dialogue", speaker: speakerMap.get(rawSpeaker), speakerLabel, text };
  }

  const chat = block.match(/^(\d{2}:\d{2})  (MIZUHA|AMANE|saku|YOU|青猫|SYSTEM)\n([\s\S]+)$/u);
  if (chat) {
    return {
      type: "chat",
      time: chat[1],
      speaker: chatSpeakerMap.get(chat[2]),
      speakerLabel: chatSpeakerLabelMap.get(chat[2]),
      text: chat[3],
    };
  }

  const cue = block.match(/^［([^｜\]]+)｜([^\]]+)］(?:\n([\s\S]+))?$/u);
  if (cue) {
    const [, marker, text, body = ""] = cue;
    if (marker === "選択") {
      const labels = body.split("\n").map((line) => line.match(/^\d+\.\s*(.+)$/u)?.[1]).filter(Boolean);
      if (labels.length !== 3) throw new Error(`${sceneId}: demo_interestには3択が必要です`);
      return {
        type: "choice",
        choiceId: "demo_interest",
        variable: "demo_interest",
        prompt: text,
        trackedByEves: false,
        options: labels.map((label) => ({ label, value: label, next: "esp32_pitch" })),
      };
    }
    if (marker === "学内チャット") return { type: "chatSurface", text };
    return { type: "ui", text: `${marker}｜${text}` };
  }

  return { type: "narration", speaker: "narrator", text: block };
};

const sceneHeading = /^## SCENE (\d+)｜(.+)$/gmu;
const matches = [...source.matchAll(sceneHeading)];
if (matches.length !== EXPECTED_SCENE_IDS.length) throw new Error("freeze正本には6sceneが必要です");

const scenes = matches.map((match, index) => {
  const start = match.index + match[0].length;
  const end = matches[index + 1]?.index ?? source.length;
  let body = source.slice(start, end).trim();
  const metaMatch = body.match(/^<!-- scene-meta\n([\s\S]*?)\n-->\n*/u);
  if (!metaMatch) throw new Error(`${match[0]}: scene-metaがありません`);
  const meta = JSON.parse(metaMatch[1]);
  if (meta.id !== EXPECTED_SCENE_IDS[index]) throw new Error(`${match[0]}: scene idがfreeze順と一致しません`);
  body = body.slice(metaMatch[0].length).replace(/\n---\s*$/u, "").trim();
  const blocks = body.split(/\n{2,}/u).map((block) => block.trim()).filter(Boolean);
  const steps = [];
  const pushStep = (step) => {
    const id = `${meta.id}_${String(steps.length + 1).padStart(3, "0")}`;
    steps.push({ id, sceneId: meta.id, ...step });
  };
  const interaction = INTERACTION_CONFIG[meta.id] || null;
  for (const block of blocks) {
    const step = parseBlock(block, meta.id);
    pushStep(step);
    if (interaction && step.text === interaction.afterText) {
      const { afterText, ...interactionMetadata } = interaction;
      pushStep({ type: "interaction", text: "", interaction: interactionMetadata });
    }
  }
  if (interaction && steps.filter((step) => step.type === "interaction").length !== 1) {
    throw new Error(`${meta.id}: interactionはexact1件必要です`);
  }
  return {
    id: meta.id,
    number: Number(match[1]),
    title: match[2],
    chapter: meta.chapter,
    duration: meta.duration,
    location: meta.location,
    modeIndex: 0,
    ...(interaction ? { interaction: Object.fromEntries(Object.entries(interaction).filter(([key]) => key !== "afterText")) } : {}),
    temporal: {
      temporalContext: "CURRENT",
      timePrecision: "APPROXIMATE",
      displayTitle: `${meta.duration}｜${meta.location}`,
      location: meta.location,
    },
    steps,
  };
});

scenes.forEach((scene, index) => { scene.nextSceneId = scenes[index + 1]?.id || null; });
const sceneOrder = scenes.map((scene) => scene.id);
const story = {
  storyVersion: 10,
  title: "GAIA SENSATION",
  systemTitle: "GAIA SENSEWARE",
  subtitle: "コンテスト機能限定版",
  estimatedDuration: "10〜12分",
  sourceSha256: EXPECTED_SOURCE_SHA256,
  characterSourceSha256: sha256(characterSourceBytes),
  characters,
  startSceneId: "festival_concept",
  temporal: {
    schemaVersion: 2,
    calendar: "GREGORIAN",
    timeZone: "Asia/Tokyo",
    clockPolicy: "AUTHOR_FIXED",
    missingMetadataPolicy: "ERROR",
    sceneOrder,
    archives: [],
  },
  saveFields: ["storyVersion", "stepId", "reachedSceneIds", "viewed", "evesRoute", "observationOrder", "editorialChoice", "reflectionIds", "resultTone", "demoInterest", "audio", "readStepIds", "clear", "archivesUnlocked", "sessionId"],
  requiredSceneIds: sceneOrder,
  requiredInteractions: ["map01", "gx"],
  finalResults: [],
  resultCopy: {},
  generationDetails: {},
  scenes,
};

const banner = "// Generated from story/物語台本.md by scripts/build-novel-story.mjs. Do not edit by hand.\n";
const output = `${banner}globalThis.GAIA_NOVEL_STORY = Object.freeze(${JSON.stringify(story, null, 2)});\nglobalThis.GAIA_NOVEL_STORY_V6 = globalThis.GAIA_NOVEL_STORY;\n`;
fs.writeFileSync(outputPath, output, "utf8");
console.log(`wrote ${path.relative(projectRoot, outputPath)} (${scenes.length} scenes, ${scenes.flatMap((scene) => scene.steps).length} steps)`);
