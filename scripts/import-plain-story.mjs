import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readApprovedStoryScript } from "./approved-story-script.mjs";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const inputPath = process.argv[2] ? path.resolve(process.argv[2]) : null;
const outputPath = process.argv[3]
  ? path.resolve(process.argv[3])
  : path.join(projectRoot, "story", "APPROVED_SCRIPT_2026-08-24.md");
const rawCopyPath = path.join(projectRoot, "story", "USER_SCRIPT_2026-08-24.txt");
const checkOnly = process.argv.includes("--check");

if (!inputPath || !fs.existsSync(inputPath)) {
  throw new Error("usage: node scripts/import-plain-story.mjs <plain-script.txt> [output.md]");
}

const source = fs.readFileSync(inputPath, "utf8").replace(/^\uFEFF/u, "").replace(/\r\n?/gu, "\n").trim();
const approved = readApprovedStoryScript();
const lines = source.split("\n");

const MAIN_HEADINGS = Object.freeze([
  Object.freeze({ marker: "01 / CONCEPT", id: "festival_concept" }),
  Object.freeze({ marker: "02 / MAP 01", id: "map_mode01" }),
  Object.freeze({ marker: "03 / DEEP TIME", id: "gx_experience" }),
  Object.freeze({ marker: "04 / PROPOSAL", id: "esp32_pitch" }),
  Object.freeze({ marker: "05 / AFTER SCHOOL", id: "circle_invitation" }),
  Object.freeze({ marker: "06 / WELCOME", id: "welcome_chat" }),
]);
const MAIN_SPEAKERS = new Set(["女の子", "もう一人の女の子", "あめ", "みず", "プレイヤー", "SYSTEM", "青猫", "saku"]);
const TRUE_END_SPEAKERS = new Set(["AIVA", "ルウ", "あめ", "みず", "saku", "プレイヤー"]);

const indexOfLine = (value, from = 0) => {
  const index = lines.indexOf(value, from);
  if (index < 0) throw new Error(`台本の見出しまたは境界がありません: ${value}`);
  return index;
};

const trimBlankEdges = (values) => {
  let start = 0;
  let end = values.length;
  while (start < end && !values[start].trim()) start += 1;
  while (end > start && !values[end - 1].trim()) end -= 1;
  return values.slice(start, end);
};

const parseMainLines = (sceneLines, sceneId) => {
  const entries = [];
  let index = 0;
  let campusChatOpen = sceneId === "welcome_chat";
  while (index < sceneLines.length) {
    const line = sceneLines[index].trim();
    if (!line) {
      index += 1;
      continue;
    }
    if (sceneId === "welcome_chat" && entries.length === 0 && line === "惑星の放課後_雑談") {
      entries.push({ kind: "チャット画面", speakerLabel: "—", text: line });
      index += 1;
      continue;
    }
    if (!MAIN_SPEAKERS.has(line)) {
      entries.push({ kind: "地の文", speakerLabel: "地の文", text: line });
      if (line.startsWith("新しくできた # 惑星の放課後_センサー を開く。")) campusChatOpen = false;
      index += 1;
      continue;
    }

    let blockEnd = index + 1;
    while (blockEnd < sceneLines.length && sceneLines[blockEnd].trim()) blockEnd += 1;
    const block = sceneLines.slice(index + 1, blockEnd).map((value) => value.trim()).filter(Boolean);
    if (block.length === 0) throw new Error(`${sceneId}: ${line} の本文がありません`);
    const finalIsTime = /^\d{2}:\d{2}$/u.test(block.at(-1));
    const isQuotedDialogue = /^[「『]/u.test(block[0]);
    const isChat = sceneId === "welcome_chat" && (campusChatOpen || finalIsTime || !isQuotedDialogue);
    if (!isChat && isQuotedDialogue) {
      entries.push({ kind: "会話", speakerLabel: line, text: block[0] });
      index += 2;
      continue;
    }
    const textLines = finalIsTime ? block.slice(0, -1) : block;
    entries.push({
      kind: isChat ? "学内チャット" : "会話",
      speakerLabel: line,
      text: textLines.join("\n"),
      ...(finalIsTime ? { time: block.at(-1) } : {}),
    });
    index = blockEnd;
  }
  return entries;
};

const isReadoutLine = (line) => /^[A-ZÆ][A-ZÆ·\- :/0-9.,]+$/u.test(line) || line.includes("→");

const parseTrueEndLines = (sceneLines) => {
  const entries = [];
  let index = 0;
  while (index < sceneLines.length) {
    const line = sceneLines[index].trim();
    if (!line) {
      index += 1;
      continue;
    }
    if (TRUE_END_SPEAKERS.has(line)) {
      let blockEnd = index + 1;
      while (blockEnd < sceneLines.length && sceneLines[blockEnd].trim()) blockEnd += 1;
      const block = sceneLines.slice(index + 1, blockEnd).map((value) => value.trim()).filter(Boolean);
      if (block.length === 0) throw new Error(`NOVACENE: ${line} の本文がありません`);
      entries.push({ kind: "NOVACENE", speakerLabel: line, text: block[0] });
      for (const extra of block.slice(1)) {
        if (isReadoutLine(extra)) entries.at(-1).readout = [...(entries.at(-1).readout || []), extra];
        else entries.push({ kind: "NOVACENE", speakerLabel: "—", text: extra });
      }
      index = blockEnd;
      continue;
    }
    if (isReadoutLine(line) && entries.length > 0) {
      entries.at(-1).readout = [...(entries.at(-1).readout || []), line];
    } else {
      entries.push({ kind: "NOVACENE", speakerLabel: "—", text: line });
    }
    index += 1;
  }
  return entries;
};

const mainScenes = MAIN_HEADINGS.map((heading, index) => {
  const start = indexOfLine(heading.marker) + 1;
  const endMarker = MAIN_HEADINGS[index + 1]?.marker || "STAFF & CREDITS / 惑星の放課後 / GAIA SENSATION";
  const end = indexOfLine(endMarker, start);
  const metadata = approved.mainScenes.find((scene) => scene.id === heading.id);
  if (!metadata) throw new Error(`現行台本にscene metadataがありません: ${heading.id}`);
  return {
    ...metadata,
    entries: parseMainLines(trimBlankEdges(lines.slice(start, end)), heading.id),
  };
});

const novaceneHeading = indexOfLine("NOVACENE");
const novaceneStart = novaceneHeading + 2;
const novaceneLines = trimBlankEdges(lines.slice(novaceneStart));
const scene2Start = novaceneLines.findIndex((line, index) => line.trim() === "AIVA" && novaceneLines[index + 1]?.trim() === "DÆM MIR");
const scene3Start = novaceneLines.findIndex((line) => line.trim() === "数百万の恒星系へ、異なる色と速さの光が広がる。一本の巨大な神経網ではない。");
if (scene2Start < 0 || scene3Start < 0 || scene2Start >= scene3Start) {
  throw new Error("NOVACENEの3scene境界を確認できません");
}
const trueEndRanges = [
  novaceneLines.slice(0, scene2Start),
  novaceneLines.slice(scene2Start, scene3Start),
  novaceneLines.slice(scene3Start),
];
const trueEndScenes = approved.trueEndScenes.map((scene, index) => ({
  ...scene,
  entries: parseTrueEndLines(trimBlankEdges(trueEndRanges[index])),
}));

const interactionTemplates = Object.freeze([
  Object.freeze({ sceneId: "map_mode01", id: "map_mode01_004", anchor: "「こちらがMODE 01です。1958年から2050年まで、地球の変化を続けて見てください」" }),
  Object.freeze({ sceneId: "map_mode01", id: "map_mode01_023", anchor: "「次は、気温偏差を地図の変化として確かめてみてください」" }),
  Object.freeze({ sceneId: "gx_experience", id: "gx_experience_017", anchor: "「ええ。いまの海や大気とは、まったく違う地球まで戻りますの」" }),
]);

for (const template of interactionTemplates) {
  const scene = mainScenes.find((candidate) => candidate.id === template.sceneId);
  const currentScene = approved.mainScenes.find((candidate) => candidate.id === template.sceneId);
  const currentEntry = currentScene.entries.find((entry) => entry.id === template.id);
  const anchorIndex = scene.entries.findIndex((entry) => entry.text === template.anchor);
  if (!currentEntry || anchorIndex < 0) throw new Error(`操作挿入点がありません: ${template.id}`);
  scene.entries.splice(anchorIndex + 1, 0, { ...currentEntry, _lockedId: template.id });
}

const normalizeText = (value) => value
  .normalize("NFKC")
  .replace(/[\s「」『』…。、！？!?：:,.・（）()#—―ｰ\-]/gu, "")
  .toLowerCase();

const bigramDice = (left, right) => {
  if (left === right) return 1;
  if (!left || !right) return 0;
  if (left.length === 1 || right.length === 1) return left === right ? 1 : 0;
  const counts = new Map();
  for (let index = 0; index < left.length - 1; index += 1) {
    const key = left.slice(index, index + 2);
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  let overlap = 0;
  for (let index = 0; index < right.length - 1; index += 1) {
    const key = right.slice(index, index + 2);
    const count = counts.get(key) || 0;
    if (count > 0) {
      overlap += 1;
      counts.set(key, count - 1);
    }
  }
  return (2 * overlap) / (left.length + right.length - 2);
};

const entryScore = (current, incoming) => {
  if (incoming._lockedId) return current.id === incoming._lockedId ? 1_000 : -1_000;
  const left = normalizeText(current.text);
  const right = normalizeText(incoming.text);
  let similarity = bigramDice(left, right);
  if (left.includes(right) || right.includes(left)) {
    similarity = Math.max(similarity, Math.min(left.length, right.length) / Math.max(left.length, right.length));
  }
  const sameKind = current.kind === incoming.kind;
  const bothSpeech = ["会話", "学内チャット"].includes(current.kind) && ["会話", "学内チャット"].includes(incoming.kind);
  const sameSpeaker = current.speakerLabel === incoming.speakerLabel;
  if (bothSpeech && !sameSpeaker) return -1_000;
  if (similarity < 0.16) return -1_000;
  return similarity * 100 + (sameKind ? 15 : 0) + (sameSpeaker ? 10 : 0);
};

const alignIds = (currentEntries, incomingEntries, sceneId, { inheritCues = false } = {}) => {
  const rows = currentEntries.length + 1;
  const columns = incomingEntries.length + 1;
  const gap = -5;
  const scores = Array.from({ length: rows }, () => new Float64Array(columns));
  const moves = Array.from({ length: rows }, () => new Uint8Array(columns));
  for (let row = 1; row < rows; row += 1) {
    scores[row][0] = row * gap;
    moves[row][0] = 1;
  }
  for (let column = 1; column < columns; column += 1) {
    scores[0][column] = column * gap;
    moves[0][column] = 2;
  }
  for (let row = 1; row < rows; row += 1) {
    for (let column = 1; column < columns; column += 1) {
      const matchScore = entryScore(currentEntries[row - 1], incomingEntries[column - 1]);
      const diagonal = scores[row - 1][column - 1] + matchScore;
      const up = scores[row - 1][column] + gap;
      const left = scores[row][column - 1] + gap;
      if (matchScore > -1_000 && diagonal >= up && diagonal >= left) {
        scores[row][column] = diagonal;
        moves[row][column] = 3;
      } else if (up >= left) {
        scores[row][column] = up;
        moves[row][column] = 1;
      } else {
        scores[row][column] = left;
        moves[row][column] = 2;
      }
    }
  }

  const matches = [];
  let row = currentEntries.length;
  let column = incomingEntries.length;
  while (row > 0 || column > 0) {
    const move = moves[row][column];
    if (move === 3) {
      matches.push([row - 1, column - 1]);
      row -= 1;
      column -= 1;
    } else if (move === 1) {
      row -= 1;
    } else {
      column -= 1;
    }
  }
  matches.reverse();
  const matchedByIncoming = new Map(matches.map(([currentIndex, incomingIndex]) => [incomingIndex, currentEntries[currentIndex]]));
  const cueSourceByIncoming = new Map();
  let previousCueSource = null;
  for (let incomingIndex = 0; incomingIndex < incomingEntries.length; incomingIndex += 1) {
    const current = matchedByIncoming.get(incomingIndex);
    if (current && !/_new_\d{3}$/u.test(current.id)) previousCueSource = current.id;
    if (previousCueSource) cueSourceByIncoming.set(incomingIndex, previousCueSource);
  }
  let nextCueSource = null;
  for (let incomingIndex = incomingEntries.length - 1; incomingIndex >= 0; incomingIndex -= 1) {
    const current = matchedByIncoming.get(incomingIndex);
    if (current && !/_new_\d{3}$/u.test(current.id)) nextCueSource = current.id;
    if (!cueSourceByIncoming.has(incomingIndex) && nextCueSource) cueSourceByIncoming.set(incomingIndex, nextCueSource);
  }
  let newIndex = 0;
  const entries = incomingEntries.map((entry, incomingIndex) => {
    const current = matchedByIncoming.get(incomingIndex);
    const id = entry._lockedId || current?.id || `${sceneId}_new_${String(++newIndex).padStart(3, "0")}`;
    const { _lockedId, ...cleanEntry } = entry;
    const inheritedMetadata = current?.metadata || entry.metadata || null;
    const cueFromStepId = inheritCues && /_new_\d{3}$/u.test(id) ? cueSourceByIncoming.get(incomingIndex) : null;
    return {
      ...cleanEntry,
      id,
      ...((inheritedMetadata || cueFromStepId) ? {
        metadata: {
          ...(inheritedMetadata || {}),
          ...(cueFromStepId ? { cueFromStepId } : {}),
        },
      } : {}),
    };
  });
  const unique = new Set(entries.map((entry) => entry.id));
  if (unique.size !== entries.length) throw new Error(`${sceneId}: IDが重複しました`);
  return { entries, reused: entries.length - newIndex, added: newIndex };
};

const alignmentReport = [];
for (const scene of mainScenes) {
  const current = approved.mainScenes.find((candidate) => candidate.id === scene.id);
  const aligned = alignIds(current.entries, scene.entries, scene.id, { inheritCues: true });
  scene.entries = aligned.entries;
  alignmentReport.push(`${scene.id}: ${scene.entries.length} entries (${aligned.reused} IDs reused, ${aligned.added} new)`);
}
for (const scene of trueEndScenes) {
  const current = approved.trueEndScenes.find((candidate) => candidate.id === scene.id);
  const aligned = alignIds(current.entries, scene.entries, scene.id);
  scene.entries = aligned.entries;
  alignmentReport.push(`${scene.id}: ${scene.entries.length} entries (${aligned.reused} IDs reused, ${aligned.added} new)`);
}

const quoteLines = (text) => text.split("\n").map((line) => line ? `> ${line}` : ">").join("\n");
const renderEntry = (entry) => {
  const output = [`#### ${entry.id}｜${entry.kind}｜${entry.speakerLabel}`, quoteLines(entry.text)];
  if (entry.time) output.push(`- 時刻: ${entry.time}`);
  if (entry.readout?.length) output.push(`- データ表示: ${entry.readout.map((value) => `\`${value.replaceAll("`", "\\`")}\``).join("、")}`);
  if (entry.metadata) output.push(`- 演出メタ: \`${JSON.stringify(entry.metadata).replaceAll("`", "\\`")}\``);
  return output.join("\n\n");
};

const output = [];
output.push("# 『惑星の放課後 ～GAIA SENSATION～』承認済み全編台本（2026-08-24）");
output.push("> 2026年8月24日に提供された全編改稿を、実装用の安定IDと操作メタデータへ変換した正本です。");
output.push("# PART I｜本編");
for (const scene of mainScenes) {
  output.push(`## SCENE ${String(scene.number).padStart(2, "0")}｜${scene.title}`);
  output.push(`- シーンID: \`${scene.id}\`\n- 章表示: ${scene.chapter}\n- 日時: ${scene.date} ${scene.time}\n- 場所: ${scene.location}`);
  output.push(scene.entries.map(renderEntry).join("\n\n"));
}
output.push("# PART II｜スタッフロールと分岐");
output.push("## 提供台本の表示文\n\n" + quoteLines(lines.slice(indexOfLine("STAFF & CREDITS / 惑星の放課後 / GAIA SENSATION"), novaceneHeading).join("\n")));
output.push("# PART III｜NOVACENE");
output.push("- タイトル: NOVACENE\n- サブタイトル: 惑星の放課後 / GAIA SENSATION — NOVACENE\n- 経過時間: 2,704,118 HARA\n- 統一言語: SÆLIVA（セイリヴァ）");
for (const scene of trueEndScenes) {
  output.push(`## NOVACENE ${String(scene.number).padStart(2, "0")}｜${scene.title}`);
  output.push(`- シーンID: \`${scene.id}\`\n- 背景シグネチャ: \`${scene.backdrop}\``);
  output.push(scene.entries.map(renderEntry).join("\n\n"));
}
output.push("## 今回の反映チェックリスト\n\n- 提供された本編・スタッフロール・NOVACENE全文を実装正本へ変換。\n- 既存の地図/GX操作、安定ID、演出メタデータを可能な限り継承。");

const rendered = `${output.join("\n\n---\n\n")}\n`;
const rawCopy = `${source}\n`;
if (checkOnly) {
  if (!fs.existsSync(outputPath) || fs.readFileSync(outputPath, "utf8") !== rendered) {
    throw new Error(`${path.relative(projectRoot, outputPath)} が提供台本からの変換結果と一致しません`);
  }
  if (!fs.existsSync(rawCopyPath) || fs.readFileSync(rawCopyPath, "utf8") !== rawCopy) {
    throw new Error(`${path.relative(projectRoot, rawCopyPath)} が提供台本と一致しません`);
  }
  console.log(`approved user script ok: ${mainScenes.reduce((count, scene) => count + scene.entries.length, 0)} main / ${trueEndScenes.reduce((count, scene) => count + scene.entries.length, 0)} NOVACENE entries`);
} else {
  fs.writeFileSync(outputPath, rendered, "utf8");
  fs.writeFileSync(rawCopyPath, rawCopy, "utf8");
  console.log(`wrote ${path.relative(projectRoot, outputPath)}`);
  console.log(`wrote ${path.relative(projectRoot, rawCopyPath)}`);
}
alignmentReport.forEach((line) => console.log(line));
