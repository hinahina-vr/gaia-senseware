import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataPath = path.join(projectRoot, "novel-story-data.js");
delete globalThis.GAIA_NOVEL_STORY;
delete globalThis.GAIA_NOVEL_STORY_V6;
await import(`${pathToFileURL(dataPath).href}?check=${Date.now()}`);
const story = globalThis.GAIA_NOVEL_STORY;

assert.ok(story, "GAIA_NOVEL_STORY must be defined");
assert.equal(story.storyVersion, 7);
assert.equal(story.startSceneId, "current_exhibition");
assert.equal(story.temporal?.clockPolicy, "AUTHOR_FIXED");
assert.equal(story.temporal?.missingMetadataPolicy, "ERROR");

const scenes = story.scenes || [];
const sceneIds = scenes.map((scene) => scene.id);
const sceneSet = new Set(sceneIds);
assert.equal(sceneSet.size, sceneIds.length, "scene IDs must be unique");
const steps = scenes.flatMap((scene) => scene.steps || []);
const stepIds = steps.map((step) => step.id);
assert.equal(new Set(stepIds).size, stepIds.length, "step IDs must be unique");
assert.equal(stepIds.length, 1044, "the approved opening redesign must reduce the full story to 1044 steps");
const visibleStoryText = steps.flatMap((step) => [step.text, step.prompt, ...(step.options || []).map((option) => option.label)]).filter(Boolean).join("\n");
assert.doesNotMatch(visibleStoryText, /LOCAL FIRST|STATION FIRST/u, "internal observation-order identifiers leaked into visible story text");
assert.doesNotMatch(visibleStoryText, /\b(?:LOCAL SOURCE|SOURCE RECORD|DISCLOSE DERIVATION|SOURCE|DERIVED|CURRENT|VISITOR TRACE|PRODUCTION RECORD|RESPONSIBLE|EDITORIAL CHOICE|PUBLIC BUILD CHANGED|REFLECTION FIELD|CLEAR)\b/u, "internal or unexplained system labels leaked into visible story text");
assert.doesNotMatch(visibleStoryText, /補助表示：|操作記録 \/|計算・解釈 \/|観測記録 \/|localStorage/u, "system-oriented explanatory copy leaked into visible story text");
assert.doesNotMatch(visibleStoryText, /[［[](?:画像添付|添付画像)｜/u, "raw attachment token leaked into visible story text");
const attachmentSteps = steps.filter((step) => Array.isArray(step.attachments) && step.attachments.length > 0);
const attachments = attachmentSteps.flatMap((step) => step.attachments.map((attachment) => ({ stepId: step.id, ...attachment })));
assert.deepEqual(attachments.map((attachment) => attachment.id), ["BASIL", "FLOWERBED", "MEETING_MAP", "VENUE"], "story attachment identifiers changed or an attachment was not parsed");
attachments.forEach((attachment) => assert.ok(attachment.description, `${attachment.stepId}/${attachment.id} must retain its accessibility description`));

for (const required of story.requiredSceneIds || []) assert.ok(sceneSet.has(required), `required scene is missing: ${required}`);
for (const scene of scenes) {
  assert.ok(scene.steps?.length, `${scene.id} must contain steps`);
  assert.ok(scene.temporal, `${scene.id} must contain canonical temporal metadata`);
  assert.ok(["CURRENT", "RECORD"].includes(scene.temporal.temporalContext), `${scene.id} has an invalid temporal context`);
  assert.equal(typeof scene.temporal.displayTitle, "string", `${scene.id} must contain a temporal display title`);
  if (scene.nextSceneId) assert.ok(sceneSet.has(scene.nextSceneId), `${scene.id} has an invalid nextSceneId`);
  for (const step of scene.steps) {
    assert.equal(step.sceneId, scene.id, `${step.id} must reference its containing scene`);
    if (["dialogue", "chat"].includes(step.type)) assert.ok(["mizuha", "amane", "sakuya", "visitor", "system"].includes(step.speaker), `${step.id} has an invalid speaker`);
    if (step.type === "record") assert.ok(["SOURCE", "LOCAL_SOURCE", "DERIVED", "SCENARIO", "VISITOR_TRACE"].includes(step.recordType), `${step.id} has an invalid record type`);
    if (step.type === "choice") {
      assert.equal(step.options.length, 2, `${step.choiceId} must contain two options`);
      step.options.forEach((option) => assert.ok(sceneSet.has(option.next), `${step.choiceId} has an invalid destination`));
    }
  }
}

const reachable = new Set();
let cursor = story.startSceneId;
while (cursor && !reachable.has(cursor)) {
  reachable.add(cursor);
  cursor = scenes.find((scene) => scene.id === cursor)?.nextSceneId || null;
}
for (const required of story.requiredSceneIds || []) assert.ok(reachable.has(required), `required scene is unreachable: ${required}`);

const interactionKinds = steps.filter((step) => step.type === "interaction").map((step) => step.interaction?.kind);
assert.deepEqual(interactionKinds, ["gx", "map03", "abstract07", "map08", "space10"]);
assert.deepEqual(story.requiredInteractions, interactionKinds);
assert.deepEqual(scenes.filter((scene) => /^mode\d+/u.test(scene.id)).map((scene) => scene.modeIndex), [2, 6, 7, 9]);

const editorial = steps.find((step) => step.choiceId === "editorial_choice");
assert.deepEqual(editorial?.options.map((option) => option.value), ["SOURCE_RECORD", "DISCLOSE_DERIVATION"]);
const reflection = steps.find((step) => step.type === "reflectionChoice");
assert.ok(reflection, "reflection choice must exist");
assert.equal(reflection.maxSelections, 3);
assert.equal(reflection.options.length, 36);
assert.equal(new Set(reflection.options.map((option) => option.id)).size, 36, "reflection IDs must be unique");
assert.equal(new Set(reflection.options.map((option) => option.text)).size, 36, "reflection statements must be unique");

const dominance = { law: 0, neutral: 0, chaos: 0 };
const expectedReflectionIds = Array.from({ length: 36 }, (_, index) => `R${String(index + 1).padStart(2, "0")}`);
assert.deepEqual(reflection.options.map((option) => option.id), expectedReflectionIds, "reflection options must keep the fixed R01-R36 display order");
const expectedThemes = ["不確実さと解釈", "記録と検証", "技術と生成責任", "権利と当事者", "制度と行動", "人間・地球・未来"];
assert.deepEqual([...new Set(reflection.options.map((option) => option.theme))].sort(), [...expectedThemes].sort(), "all six internal reflection themes must remain present");
expectedThemes.forEach((theme) => assert.equal(reflection.options.filter((option) => option.theme === theme).length, 6, `${theme} must contain six statements`));
reflection.options.forEach((option) => {
  const values = Object.entries(option.weights);
  const max = Math.max(...values.map(([, value]) => value));
  const leaders = values.filter(([, value]) => value === max);
  assert.equal(leaders.length, 1, `${option.id} must have one dominant axis`);
  dominance[leaders[0][0]] += 1;
});
assert.deepEqual(dominance, { law: 12, neutral: 12, chaos: 12 });
assert.equal(story.finalResults.length, 8, "two editorial choices by four spatial outcomes are required");
assert.deepEqual(story.saveFields.filter((field) => ["reflectionIds", "resultTone"].includes(field)), ["reflectionIds", "resultTone"]);

const backHalfSceneIds = [
  "festival_build", "gx_deep_time", "mode03_map", "mode07_abstract", "interlude_sea", "mode08_map_layers",
  "mode10_space", "choice_editorial", "epilogue_reflection_field", "choice_reflection", "final_record", "return_to_start",
];
const backHalfSteps = scenes.filter((scene) => backHalfSceneIds.includes(scene.id)).flatMap((scene) => scene.steps);
assert.equal(backHalfSteps.length, 297, "the approved back-half rewrite must stay within the 235-297 step ceiling");

const migrationSource = fs.readFileSync(path.join(projectRoot, "docs", "SCENARIO_HANDOFF_BACK_HALF_REWRITE.md"), "utf8");
const migrationRangeSource = migrationSource.split("## 完全範囲移行表")[1]?.split("## 新規CURRENT境界")[0] || "";
const expectedOldStepCounts = {
  festival_build: 32,
  gx_deep_time: 58,
  mode03_map: 33,
  mode07_abstract: 124,
  interlude_sea: 76,
  mode08_map_layers: 34,
  mode10_space: 38,
  choice_editorial: 15,
  epilogue_reflection_field: 6,
  choice_reflection: 4,
  final_record: 50,
  return_to_start: 1,
};
for (const [sceneId, oldCount] of Object.entries(expectedOldStepCounts)) {
  const coverage = Array(oldCount + 1).fill(0);
  const rangePattern = new RegExp(`\\| ${sceneId} \\| (\\d{3})(?:–(\\d{3}))? \\|`, "gu");
  for (const match of migrationRangeSource.matchAll(rangePattern)) {
    const start = Number(match[1]);
    const end = Number(match[2] || match[1]);
    assert.ok(start >= 1 && end <= oldCount && start <= end, `${sceneId}: invalid old-step migration range ${match[0]}`);
    for (let index = start; index <= end; index += 1) coverage[index] += 1;
  }
  assert.deepEqual(coverage.slice(1), Array(oldCount).fill(1), `${sceneId}: old-step migration ranges must cover every former step exactly once`);
}

const openingSceneCounts = {
  current_exhibition: 17,
  opening_empty_seat: 10,
  prologue_online_circle: 7,
};
for (const [sceneId, expectedCount] of Object.entries(openingSceneCounts)) {
  assert.equal(scenes.find((scene) => scene.id === sceneId)?.steps.length, expectedCount, `${sceneId}: approved opening step count changed`);
}
assert.deepEqual(scenes.map((scene) => [scene.id, scene.steps.length]), [
  ["current_exhibition", 17], ["opening_empty_seat", 10], ["prologue_online_circle", 7], ["prologue_basil", 23],
  ["choice_observation_order", 12], ["first_meeting_promise", 70], ["first_meeting_hall", 85], ["festival_walk", 21],
  ["production_year", 261], ["absence", 95], ["search", 146], ["festival_build", 18], ["gx_deep_time", 26],
  ["mode03_map", 20], ["mode07_abstract", 54], ["interlude_sea", 67], ["mode08_map_layers", 19],
  ["mode10_space", 18], ["choice_editorial", 7], ["epilogue_reflection_field", 2], ["choice_reflection", 3],
  ["final_record", 27], ["return_to_start", 36],
], "only the three approved opening scenes may change their step counts");

const openingMigrationSource = fs.readFileSync(path.join(projectRoot, "docs", "SCENARIO_HANDOFF_OPENING_RECORD_TRANSITION.md"), "utf8");
const readOpeningMigration = (heading) => {
  const escapedHeading = heading.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
  const csv = openingMigrationSource.match(new RegExp("## " + escapedHeading + "[\\s\\S]*?```csv\\r?\\n([\\s\\S]*?)\\r?\\n```", "u"))?.[1] || "";
  return csv.split(/\r?\n/u).filter(Boolean).map((line) => {
    const fields = line.split(",");
    assert.equal(fields.length, 3, `opening migration row must have three fields: ${line}`);
    const [oldStepId, newSceneId, newStepId] = fields;
    return { oldStepId, newSceneId, newStepId };
  });
};
const validateOpeningMigration = ({ rows, expectedOldCounts, currentBoundary }) => {
  const expectedOldIds = Object.entries(expectedOldCounts)
    .flatMap(([sceneId, count]) => Array.from({ length: count }, (_, index) => `${sceneId}_${String(index + 1).padStart(3, "0")}`));
  assert.equal(rows.length, expectedOldIds.length, "opening migration row count changed");
  assert.equal(new Set(rows.map((row) => row.oldStepId)).size, expectedOldIds.length, "opening migration old step IDs must be unique");
  assert.deepEqual([...rows.map((row) => row.oldStepId)].sort(), [...expectedOldIds].sort(), "opening migration old step set must exactly match its source steps");
  const generatedStepSet = new Set(stepIds);
  for (const row of rows) {
    assert.ok(sceneSet.has(row.newSceneId), `opening migration target scene is missing: ${row.newSceneId}`);
    assert.ok(generatedStepSet.has(row.newStepId), `opening migration target step is missing: ${row.newStepId}`);
    assert.ok(row.newStepId.startsWith(`${row.newSceneId}_`), `opening migration target scene and step disagree: ${row.oldStepId}`);
  }
  const currentRows = rows.filter((row) => row.oldStepId.startsWith("current_exhibition_"));
  for (const row of currentRows) {
    const oldIndex = Number(row.oldStepId.slice(-3));
    const targetIndex = Number(row.newStepId.slice(-3));
    if (oldIndex < currentBoundary.start) {
      assert.equal(row.newSceneId, "current_exhibition", `${row.oldStepId}: a pre-START save must remain before START`);
      assert.ok(targetIndex < 15, `${row.oldStepId}: a pre-START save crossed the new START boundary`);
    } else if (oldIndex === currentBoundary.start) {
      assert.deepEqual([row.newSceneId, row.newStepId], ["current_exhibition", "current_exhibition_015"], "the former START must map to the new START interaction");
    } else {
      const afterStart = row.newSceneId === "opening_empty_seat" || (row.newSceneId === "current_exhibition" && targetIndex >= 16);
      assert.ok(afterStart, `${row.oldStepId}: a post-START save moved before START`);
    }
  }
  for (const sceneId of ["opening_empty_seat", "prologue_online_circle"]) {
    const sceneRows = rows.filter((row) => row.oldStepId.startsWith(`${sceneId}_`));
    let previousTarget = 0;
    for (const row of sceneRows) {
      assert.equal(row.newSceneId, sceneId, `${row.oldStepId}: migration must not jump to a future scene`);
      const target = Number(row.newStepId.slice(-3));
      assert.ok(target >= previousTarget, `${sceneId}: migration targets must be monotonic`);
      previousTarget = target;
    }
  }
};
const currentOpeningMigrationRows = readOpeningMigration("現公開43step→新34step 完全一意移行表");
validateOpeningMigration({
  rows: currentOpeningMigrationRows,
  expectedOldCounts: { current_exhibition: 16, opening_empty_seat: 18, prologue_online_circle: 9 },
  currentBoundary: { start: 15 },
});
const legacyOpeningMigrationRows = readOpeningMigration("旧80step→新34step 完全一意移行表");
validateOpeningMigration({
  rows: legacyOpeningMigrationRows,
  expectedOldCounts: { current_exhibition: 42, opening_empty_seat: 25, prologue_online_circle: 13 },
  currentBoundary: { start: 34 },
});
const basilMigrationRows = readOpeningMigration("prologue_basil冒頭 最小移行");
assert.deepEqual(basilMigrationRows, [1, 2, 3].map((index) => {
  const stepId = `prologue_basil_${String(index).padStart(3, "0")}`;
  return { oldStepId: stepId, newSceneId: "prologue_basil", newStepId: stepId };
}), "the three basil lead-in steps must retain their IDs");

const openingScenes = scenes.filter((scene) => Object.hasOwn(openingSceneCounts, scene.id));
const openingSteps = openingScenes.flatMap((scene) => scene.steps);
const openingVisibleText = openingSteps.flatMap((step) => [step.text, step.prompt, ...(step.options || []).map((option) => option.label)]).filter(Boolean).join("\n");
assert.equal(openingVisibleText.match(/三か月前/gu)?.length || 0, 1, "the three opening scenes must use 三か月前 exactly once in visible step copy");
const openingHeaderAndUi = openingScenes.flatMap((scene) => [
  scene.title,
  scene.chapter,
  scene.temporal.location,
  scene.temporal.displayTitle,
  scene.temporal.entryTransition?.displayTitle,
  ...(scene.temporal.transitions || []).map((transition) => transition.displayTitle),
  ...scene.steps.filter((step) => step.type === "ui").map((step) => step.text),
]).filter(Boolean).join("\n");
assert.doesNotMatch(openingHeaderAndUi, /三か月前/u, "三か月前 must not be hard-coded into opening titles, locations, headers, or UI steps");
assert.doesNotMatch(openingVisibleText, /監視映像|隠し録音|照合メモ|編集再構成/u, "the opening must show objective saved material without reconstruction jargon");
assert.equal(openingVisibleText.match(/保存された予定、投稿、写真が順に表示される。/gu)?.length || 0, 1, "the objective record-medium sentence must appear exactly once");
const currentOpeningScene = scenes.find((scene) => scene.id === "current_exhibition");
const emptySeatScene = scenes.find((scene) => scene.id === "opening_empty_seat");
const onlineCircleScene = scenes.find((scene) => scene.id === "prologue_online_circle");
const basilScene = scenes.find((scene) => scene.id === "prologue_basil");
const canonicalEmptySeatHeading = "8月1日（土） 10:21｜海に近い町・共同作業室";
assert.equal(emptySeatScene?.title, "OPENING｜空席", "opening_empty_seat must not repeat relative or clock time in its visible scene title");
assert.equal(emptySeatScene?.chapter, "OPENING", "opening_empty_seat chapter must remain OPENING");
const emptySeatNonTemporalHeaders = [
  emptySeatScene?.title,
  emptySeatScene?.chapter,
  ...(emptySeatScene?.steps.filter((step) => step.type === "ui").map((step) => step.text) || []),
].filter(Boolean).join("\n");
assert.doesNotMatch(emptySeatNonTemporalHeaders, /三か月前|\b\d{1,2}:\d{2}\b/u, "relative or clock time must not be duplicated outside temporal metadata");
assert.equal(emptySeatScene?.temporal.displayTitle, canonicalEmptySeatHeading, "the scene temporal heading must remain canonical");
const emptySeatVisibleHeaderSet = new Set([
  emptySeatScene?.title,
  emptySeatScene?.chapter,
  emptySeatScene?.temporal.displayTitle,
  emptySeatScene?.temporal.entryTransition?.displayTitle,
  ...(emptySeatScene?.steps.filter((step) => step.type === "ui").map((step) => step.text) || []),
].filter(Boolean));
assert.deepEqual([...emptySeatVisibleHeaderSet].filter((value) => /\b\d{1,2}:\d{2}\b/u.test(value)), [canonicalEmptySeatHeading], "the canonical metadata heading must be the only visible opening time heading");
assert.equal(currentOpeningScene?.steps.find((step) => step.type === "ui" && step.text === "START")?.id, "current_exhibition_015", "START interaction moved from its approved step");
assert.equal(currentOpeningScene?.steps[15]?.text, "STARTを押すと、端末の画面だけが暗くなった。私は展示端末の前に立ったままだ。", "the player must remain physically at the exhibition terminal after START");
assert.equal(currentOpeningScene?.steps[16]?.text, "表示｜作業予定／保存写真／学内チャット", "the saved-material labels must appear before the RECORD transition");
assert.equal(currentOpeningScene?.steps[6]?.text, "「こんにちは。制作者のミズハです。掲示では『みず』。こちらはアマネですわ」", "Mizuha must introduce her name and display name naturally");
assert.equal(currentOpeningScene?.steps[7]?.text, "「アマネです。掲示では『あまあま』。画面はそのまま触って大丈夫」", "Amane must introduce her name and display name naturally");
assert.doesNotMatch(currentOpeningScene?.steps.map((step) => step.text || "").join("\n") || "", /椅子|着席|展示席|黒いシャツの人物|無名staff|指差/u, "the CURRENT entrance must match the chairless exhibition background");
assert.doesNotMatch(emptySeatScene?.steps.map((step) => step.text || "").join("\n") || "", /私/u, "the August RECORD must not use the player's first-person viewpoint");
assert.doesNotMatch(onlineCircleScene?.steps.map((step) => step.text || "").join("\n") || "", /私/u, "the May RECORD must not use the player's first-person viewpoint");
assert.deepEqual(emptySeatScene?.steps.filter((step) => step.type === "chat").map((step) => step.id), ["opening_empty_seat_005", "opening_empty_seat_006", "opening_empty_seat_007"], "the three timestamped chat originals must share the existing chat surface");
assert.equal(emptySeatScene?.steps.filter((step) => step.type === "dialogue").length, 0, "the August RECORD must not reenact room dialogue");
assert.deepEqual(emptySeatScene?.steps.filter((step) => step.type === "chat").map((step) => [step.time, step.speaker, step.text]), [
  ["10:08", "amane", "先に入ってる🙆"],
  ["10:09", "mizuha", "迷っていたら迎えに行きますわ🌱"],
  ["10:21", "amane", "いまどこ？"],
], "the saved August chat originals changed");
assert.equal(emptySeatScene?.steps[7]?.text, "最後のメッセージはsaku宛てで、未読の印が残っている。", "the unread state must belong to the message addressed to saku");
assert.equal(emptySeatScene?.steps[8]?.text, "10時21分になっても、sakuは共同作業室へ来ず、メッセージは未読のままだった。", "the August RECORD must end on its objective purpose");
assert.equal(emptySeatScene?.steps[9]?.text, "端末は、sakuがみずとあまあまに初めて返信した、学内サークル「惑星の放課後」のチャットを開いた。", "the August-to-May transition must follow the character relationship");
assert.equal(emptySeatScene?.steps.some((step) => step.attachments?.length), false, "the August RECORD must not add attachments");
assert.deepEqual(onlineCircleScene?.steps.map((step) => step.type), ["narration", "narration", "chat", "chat", "chat", "chat", "chat"], "the May introduction must use two narration steps and five existing-chat steps");
assert.deepEqual(onlineCircleScene?.steps.filter((step) => step.type === "chat").map((step) => [step.time, step.speaker]), [
  ["18:00", "mizuha"], ["18:02", "amane"], ["18:19", "sakuya"], ["18:24", "mizuha"], ["18:25", "amane"],
], "the May text-chat order changed");
assert.equal(onlineCircleScene?.steps.some((step) => step.attachments?.length), false, "the May puddle chat must not use an image attachment");
assert.equal(onlineCircleScene?.steps[3]?.text, "何時ごろ？", "Amane's May comparison question must use only time");
assert.equal(onlineCircleScene?.steps[6]?.text, "同じ時刻なら比べやすい。", "Amane's closing comparison condition must stay on the same time axis");
assert.match(onlineCircleScene?.steps[4]?.text || "", /落ち葉、門の方に寄ってる。明日も同じ場所を見られる？/u, "Sakuya must pick up the leaf direction already written by Mizuha");
assert.doesNotMatch(onlineCircleScene?.steps.map((step) => step.text || "").join("\n") || "", /バジル|画像|添付/u, "the May 1 scene must stay a text-only puddle chat");
assert.deepEqual(basilScene?.steps.slice(0, 3).map((step) => step.text), [
  "二日後、みずが学内サークル「惑星の放課後」のチャットへ、バジルの写真を投稿した。",
  "画像を開くと、園芸売り場の裏で、値下げ札のついたバジルの鉢が日陰に葉を垂らしている。写真の端には黄色い散水ホースと、土で汚れたスニーカーのつま先が写っていた。",
  "アマネとサクヤは、別々の町からその写真を開いた。",
], "the May 3 basil record must begin as a separate later post");
assert.deepEqual(basilScene?.steps[3]?.attachments?.map((attachment) => attachment.id), ["BASIL"], "the existing BASIL attachment must stay on prologue_basil_004");
assert.deepEqual(basilScene?.steps[10]?.attachments?.map((attachment) => attachment.id), ["FLOWERBED"], "the existing FLOWERBED attachment must stay on prologue_basil_011");
const unchangedBasilTail = basilScene?.steps.slice(3).map((step) => ({
  id: step.id,
  type: step.type,
  time: step.time || null,
  speaker: step.speaker || null,
  text: step.text || null,
  attachments: step.attachments || null,
}));
assert.equal(createHash("sha256").update(JSON.stringify(unchangedBasilTail)).digest("hex"), "d589bbadd178b66b8f2ccd2d30bf0f961eac674324a564c56a00d71d1f70b890", "prologue_basil_004 onward changed");
const openingBannedCopy = /共有スレッド|共有thread|名前のない変化|気になったものを持ち寄る|作者表示|表示名対応/u;
assert.doesNotMatch(openingVisibleText, openingBannedCopy, "obsolete abstract or meta opening copy remains");
assert.equal(currentOpeningScene?.nextSceneId, "opening_empty_seat");
assert.equal(emptySeatScene?.nextSceneId, "prologue_online_circle");
assert.equal(onlineCircleScene?.nextSceneId, "prologue_basil");
assert.deepEqual(emptySeatScene?.temporal.entryTransition, {
  stepId: "opening_empty_seat_001",
  fromTemporalContext: "CURRENT",
  toTemporalContext: "RECORD",
  transitionAt: "2026-08-01T10:21:00+09:00",
  timePrecision: "MINUTE",
  displayTitle: canonicalEmptySeatHeading,
});
assert.deepEqual(onlineCircleScene?.temporal.entryTransition, {
  stepId: "prologue_online_circle_001",
  fromTemporalContext: "RECORD",
  toTemporalContext: "RECORD",
  transitionAt: "2025-05-01T18:00:00+09:00",
  timePrecision: "MINUTE",
  displayTitle: "5月1日（木） 18:00｜学内サークル「惑星の放課後」・チャット",
});
for (const sceneId of ["prologue_online_circle", "prologue_basil", "first_meeting_promise"]) {
  assert.equal(scenes.find((scene) => scene.id === sceneId)?.temporal.location, "学内サークル「惑星の放課後」・チャット", `${sceneId}: the campus-club chat location is inconsistent`);
}
const boothSceneIds = ["choice_observation_order", "choice_editorial", "epilogue_reflection_field", "choice_reflection", "final_record", "return_to_start"];
for (const sceneId of boothSceneIds) {
  assert.equal(scenes.find((scene) => scene.id === sceneId)?.temporal.location, "学園祭・展示ブース", `${sceneId}: CURRENT location must use the chairless exhibition booth`);
}
const currentSceneText = scenes.filter((scene) => scene.temporal.temporalContext === "CURRENT")
  .flatMap((scene) => scene.steps.map((step) => step.text || "")).join("\n");
assert.doesNotMatch(currentSceneText, /展示席|椅子|着席|座る|座った|座って/u, "CURRENT visible copy must not imply an exhibition seat or sitting pose");
assert.doesNotMatch(scenes.flatMap((scene) => [scene.temporal.location, scene.temporal.displayTitle, scene.temporal.entryTransition?.displayTitle, ...(scene.temporal.transitions || []).map((transition) => transition.displayTitle)]).filter(Boolean).join("\n"), /展示席/u, "temporal headings must not use the obsolete exhibition-seat location");
const temporalTransitionCount = scenes.reduce((count, scene) => count + Number(Boolean(scene.temporal.entryTransition)) + (scene.temporal.transitions?.length || 0), 0);
assert.equal(temporalTransitionCount, 61, "opening rewrite must add only the approved RECORD-to-RECORD transition");

const allText = steps.map((step) => step.text || "").join("\n");
const exhibitionText = scenes.find((scene) => scene.id === "current_exhibition")?.steps.map((step) => step.text || "").join("\n") || "";
for (const requiredText of [
  "真ん中の椅子には鞄も上着もなく、誰も座っていない。",
  "うん。今日、はじめまして🌸",
  "サクヤの分だけ、縁が乾いたまま",
  "森と雨が重なる場所があります。原因はこの画面だけでは決められません。",
  "もし地球の声が聞こえたと思ったら、すぐに意味を決めるんじゃなくて――",
  "「聞こえたつもりになってない？」って、三人で確かめたい。",
]) assert.ok(allText.includes(requiredText), `canon text is missing: ${requiredText}`);
assert.ok(!allText.includes("サクヤの分だけ、縁が乾いたままだった。"), "confirmed paper-cup wording regressed to the past-form draft");
for (const requiredResolutionText of [
  "本人の安全を確認し、本人同意により中央入口で二人と話したい旨をお伝えします。",
  "中央入口にいる。待たせた。ごめん",
  "最初は連絡できなかった。できるようになってからも、返すのが怖くて遅らせた",
  "理由は二人に話す",
  "話は聞く。でも、なかったことにはしない",
  "分かりました。作品ではなく、あなたから聞かせてください",
  "三人は数歩の距離を残したまま、話し始める。",
]) assert.ok(allText.includes(requiredResolutionText), `back-half resolution text is missing: ${requiredResolutionText}`);
assert.equal(allText.match(/本人の安全を確認し、本人同意により中央入口で二人と話したい旨をお伝えします。/gu)?.length, 1, "the university notification must remain a single line in one step");
assert.match(allText, /音声だけではなく、顔と声と表示名を結び付けた本人が、現在の中央入口にいる。/u, "Sakuya must be physically identified at the current central entrance");
assert.match(allText, /この選択は三人の発言を書き換えず、これから起きる現在の出来事も変えない。/u, "visitor choices must not cause the current contact");
assert.match(allText, /現在の画面に送信ボタンは出ない。二人が当日になって新しい依頼を送ったのではない。/u, "MODE 08 must show the previous-night receipt instead of sending a current request");
assert.match(allText, /お願い。この札をSTARTの前に置いて。次の人が触らないように/u, "Amane must explicitly ask the player to place the pause sign");
assert.match(allText, /ここから先、私は二人を追わない。/u, "the player must not follow the private meeting");
for (const obsoleteEndingCopy of [
  "失踪の理由が明かされることはない",
  "次の来場者がSTART",
  "START画面へ戻る",
  "青りんごの向きを変える",
]) assert.ok(!allText.includes(obsoleteEndingCopy), `obsolete ending copy remains: ${obsoleteEndingCopy}`);
const endSteps = steps.filter((step) => step.type === "end");
assert.deepEqual(endSteps.map((step) => [step.sceneId, step.text]), [["return_to_start", "END"]], "16:03 must be the sole canonical END path");
const currentContactScene = scenes.find((scene) => scene.id === "return_to_start");
assert.equal(currentContactScene?.title, "CURRENT CONTACT｜展示を一時休止する", "the 15:55 scene title must describe the current contact, not END");
assert.equal(currentContactScene?.chapter, "CURRENT CONTACT", "the 15:55 scene chapter must not begin END before 16:03");
assert.notEqual(currentContactScene?.title, "END｜展示を一時休止する", "the obsolete 15:55 END title remains");
assert.notEqual(currentContactScene?.chapter, "END", "the obsolete 15:55 END chapter remains");
assert.ok(!currentContactScene?.steps.some((step) => step.type === "start"), "return_to_start must no longer cycle to START");
assert.match(allText, /園芸売り場の写真が閉じ、画面は現在の展示ブースへ戻る。/u, "the observation-order choice must establish the return to the exhibition booth");
assert.match(allText, /端末の右側には、傷のある青りんごが最初と同じ位置に置かれている。/u, "the physical apple must be distinguished from the on-screen measurements");
assert.match(allText, /園芸売り場の温度計は三十六度。/u, "the garden-center measurement must read as natural narration");
const promiseScene = scenes.find((scene) => scene.id === "first_meeting_promise");
const meetingScene = scenes.find((scene) => scene.id === "first_meeting_hall");
const stepWithText = (scene, text) => scene?.steps.find((step) => step.text?.includes(text));
assert.equal(stepWithText(promiseScene, "顔間違えたらごめん笑")?.id, "first_meeting_promise_054", "Sakuya's pre-meeting misrecognition anxiety must remain before the offline meeting");
assert.match(promiseScene?.steps.map((step) => step.text || "").join("\n") || "", /二度とも誰も通話開始ボタンを押さなかった|顔も声も知らない/u, "the script must not imply a call before the first offline meeting");
assert.equal(stepWithText(meetingScene, "あまあま、で合っていますの？")?.id, "first_meeting_hall_031", "Mizuha must confirm Amane's chat name aloud");
assert.equal(stepWithText(meetingScene, "うん。みず、だよね。")?.id, "first_meeting_hall_032", "Amane must confirm Mizuha's chat name aloud");
assert.equal(stepWithText(meetingScene, "ほんとに声ある。")?.id, "first_meeting_hall_063", "Sakuya must connect the known chat names to real voices");
assert.equal(stepWithText(meetingScene, "約束が文字だけの冗談ではなかったこと")?.id, "first_meeting_hall_066", "the three-person offline meeting gate must remain explicit");
assert.equal(stepWithText(promiseScene, "まだ聞いたことのない三人の声の代わりに")?.id, "first_meeting_promise_004", "the pre-meeting rooms must be described as story, not portrait direction");
assert.equal(stepWithText(meetingScene, "片手の端末を胸の高さへ上げた")?.id, "first_meeting_hall_020", "the outdoor phone view must be described through Amane's action");
assert.equal(stepWithText(meetingScene, "二人のあいだには三歩ぶんの距離が残っていた")?.id, "first_meeting_hall_033", "Mizuha and Amane must keep their initial distance after recognition");
assert.equal(stepWithText(meetingScene, "文字の向こうにいた三人が、ようやく同じ場所へ立っていた")?.id, "first_meeting_hall_067", "Sakuya's portrait gate step must read as natural story");
assert.ok(meetingScene.steps.findIndex((step) => step.id === "first_meeting_hall_032") < meetingScene.steps.findIndex((step) => step.id === "first_meeting_hall_063"), "Mizuha and Amane must recognize each other before Sakuya arrives");
assert.ok(meetingScene.steps.findIndex((step) => step.id === "first_meeting_hall_066") < meetingScene.steps.findIndex((step) => step.text?.includes("三人の肩が初めて触れた")), "the meeting must be established before the photo closes their physical distance");
for (const leakedDirection of [
  "人物の立ち絵は置かれない",
  "学内チャットアイコンが",
  "デスクトップ版の横長の画面ではない",
  "画面の端へ初めて二人の立ち絵が現れる",
  "姿をさかのぼって置かない",
  "サクヤの立ち絵もミズハ、アマネと同じ胸上の大きさ",
  "サクヤだけを遠い全身像にせず",
]) assert.ok(!allText.includes(leakedDirection), `production direction leaked into player-visible narration: ${leakedDirection}`);
assert.match(exhibitionText, /地球と人類の共進化を考える展示です。/u, "the exhibition entrance must state the work's central theme");
assert.match(exhibitionText, /地球の変化が人の暮らしをどう変え、人の選択が地球をどう変えてきたか/u, "the exhibition entrance must explain coevolution in concrete terms");
for (const removedEntranceCopy of [
  "これは三人が制作した記録と、公開までの変更をたどる展示です。",
  "青りんごと同じ色のSTARTボタン",
  "この端末は、進行と選んだ項目を会期中の件数として記録します。",
  "記録について詳しく見る",
  "前の来場者が何を選んだかは、次の来場者の最初の画面へ表示されない。",
]) assert.ok(!exhibitionText.includes(removedEntranceCopy), `obsolete exhibition entrance copy remains: ${removedEntranceCopy}`);

assert.ok(steps.some((step) => step.sceneId === "mode07_abstract" && ["SOURCE", "LOCAL_SOURCE"].includes(step.recordType)), "MODE 07 SOURCE must exist");
assert.ok(steps.some((step) => step.sceneId === "mode07_abstract" && step.recordType === "DERIVED"), "MODE 07 DERIVED must exist separately");
assert.ok(story.generationDetails?.model);

const checkedFiles = ["index.html", "novel-mode.js", "novel-mode.css", "scripts/build-novel-story.mjs", "story/物語台本.md", "story/世界観設定.md"];
const checkedSource = checkedFiles.map((file) => fs.readFileSync(path.join(projectRoot, file), "utf8")).join("\n");
const visibleStoryAndData = ["story/物語台本.md", "novel-story-data.js"]
  .map((file) => fs.readFileSync(path.join(projectRoot, file), "utf8"))
  .join("\n");
assert.doesNotMatch(visibleStoryAndData, /Slack|スラック|グループチャット/u, "story and generated copy must use 学内チャット");
assert.doesNotMatch(fs.readFileSync(path.join(projectRoot, "index.html"), "utf8"), /aria-label="[^"]*Slack/u, "accessible chat naming must use 学内チャット");
assert.doesNotMatch(fs.readFileSync(path.join(projectRoot, "novel-mode.js"), "utf8"), /textContent\s*=\s*"(?:SLACK|Slack)|>Slack<|SLACK \/ #/u, "runtime-visible chat naming must use 学内チャット");
for (const forbidden of ["novel-inline-card", "novel-mode-bridge", "visitorInput", "LEAVE EMPTY", "WRITE ACCESS", "START前の通知", "旧版の記録"]) {
  assert.ok(!checkedSource.includes(forbidden), `removed UI or behavior remains: ${forbidden}`);
}
for (const asset of [
  "assets/visuals-07/novel-title-keyvisual-v2.png",
  "assets/visuals-07/novel-result-observation-v1.png",
  "assets/visuals-07/novel-bg-exhibition-v2.png",
  "assets/visuals-07/novel-bg-workroom-v2.png",
  "assets/visuals-07/novel-bg-online-night-v2.png",
  "assets/visuals-07/novel-bg-garden-center-v2.png",
  "assets/visuals-07/novel-bg-coastal-venue-v2.png",
  "assets/visuals-07/novel-bg-coastal-venue-v3.png",
  "assets/visuals-07/novel-bg-production-night-v2.png",
  "assets/visuals-07/novel-bg-zushi-coast-night-v2.png",
]) {
  assert.ok(fs.statSync(path.join(projectRoot, asset)).size > 100_000, `visual asset is missing: ${asset}`);
}
for (const asset of [
  "assets/visuals-07/slack-attachment-basil-v1.webp",
  "assets/visuals-07/slack-attachment-flowerbed-v1.webp",
  "assets/visuals-07/slack-attachment-venue-map-v1.svg",
  "assets/visuals-07/slack-attachment-venue-v1.webp",
]) {
  const minimumSize = asset.endsWith(".svg") ? 1_000 : 10_000;
  assert.ok(fs.statSync(path.join(projectRoot, asset)).size > minimumSize, `Slack attachment asset is missing: ${asset}`);
}
const novelCss = fs.readFileSync(path.join(projectRoot, "novel-mode.css"), "utf8");
assert.ok(!novelCss.includes('url("./assets/visuals-07/novel-background-v1.webp")'), "character-composited legacy background remains in the novel runtime");
assert.match(novelCss, /data-scene-id="first_meeting_hall"[^}]*novel-bg-coastal-venue-v3\.png/su, "first_meeting_hall must use approved coastal venue v3");
assert.match(novelCss, /data-scene-id="festival_walk"[^}]*novel-bg-coastal-venue-v2\.png/su, "festival_walk must retain coastal venue v2");
assert.doesNotMatch(novelCss, /data-scene-id="first_meeting_hall"\][^}]*data-scene-id="festival_walk"/su, "first_meeting_hall and festival_walk background selectors must remain independent");

console.log(`novel story check passed: ${scenes.length} scenes, ${stepIds.length} steps, 36 reflection statements, 8 result combinations`);
