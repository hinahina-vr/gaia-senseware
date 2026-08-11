import assert from "node:assert/strict";
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
assert.equal(story.storyVersion, 8);
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
assert.equal(stepIds.length, 1024, "the focused opening, basil, and observation-order rewrite must produce 1024 steps");
const visibleStoryText = steps.flatMap((step) => [step.text, step.prompt, ...(step.options || []).map((option) => option.label)]).filter(Boolean).join("\n");
assert.doesNotMatch(visibleStoryText, /LOCAL FIRST|STATION FIRST/u, "internal observation-order identifiers leaked into visible story text");
assert.doesNotMatch(visibleStoryText, /\b(?:LOCAL SOURCE|SOURCE RECORD|DISCLOSE DERIVATION|SOURCE|DERIVED|CURRENT|VISITOR TRACE|PRODUCTION RECORD|RESPONSIBLE|EDITORIAL CHOICE|PUBLIC BUILD CHANGED|REFLECTION FIELD|CLEAR)\b/u, "internal or unexplained system labels leaked into visible story text");
assert.doesNotMatch(visibleStoryText, /補助表示：|操作記録 \/|計算・解釈 \/|観測記録 \/|localStorage/u, "system-oriented explanatory copy leaked into visible story text");
assert.doesNotMatch(visibleStoryText, /[［[](?:画像添付|添付画像)｜/u, "raw attachment token leaked into visible story text");
const attachmentSteps = steps.filter((step) => Array.isArray(step.attachments) && step.attachments.length > 0);
const attachments = attachmentSteps.flatMap((step) => step.attachments.map((attachment) => ({ stepId: step.id, ...attachment })));
assert.deepEqual(attachments.map((attachment) => attachment.id), ["BASIL", "MEETING_MAP", "VENUE"], "story attachment identifiers changed or an obsolete attachment remains");
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
const optionalInteractions = steps.filter((step) => step.type === "interaction" && step.interaction?.optional === true);
assert.deepEqual(optionalInteractions.map((step) => [step.sceneId, step.interaction.kind]), [["mode08_map_layers", "map08"]], "only MODE 08 may be skipped");
assert.equal(scenes.find((scene) => scene.id === "mode08_map_layers")?.interaction?.optional, true, "MODE 08 scene metadata must expose the optional interaction");
assert.equal(steps.filter((step) => step.type === "interaction" && step.interaction?.kind !== "map08").some((step) => Object.hasOwn(step.interaction, "optional")), false, "optional metadata leaked to another interaction");
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

const interactionDialogueContract = new Map([
  ["gx_deep_time", {
    kind: "gx",
    before: ["「この展示が『共進化』という言葉を使う理由を、まず人のいない海から見てくださいな」", "「時間軸を開いて水面をなぞる。最後の年代まで進めたら戻って」"],
    after: ["「酸素が増え、その変化が次の生命の条件になりましたのね」", "「でも、それが最初から目的だった証拠にはならない。三人の制作音声を確認したら、次はsakuの地図を開く」"],
  }],
  ["mode03_map", {
    kind: "map03",
    before: ["「sakuが最後まで仕上げた地図ですの。完成した説明と、その直後の未完文を分けて見ます」", "「森と雨を重ね、重なる地点を一つ開く。説明と修正履歴が出たら戻って」"],
    after: ["「森と雨が重なった場所は見えましたわ」", "「でも、この地図だけで原因は決まらない。02:13の完成作業と02:14の未完文を別に見る」"],
  }],
  ["mode07_abstract", {
    kind: "abstract07",
    before: ["「完成した作業と未完文を、同じ出来事にせず確かめます」", "「発生、到着、開封の時刻を順に開く。最後の時刻まで見たら戻って」"],
    after: ["「02:14に届き、二人が開いたのは10:27だったと分かりましたわ」", "「でも、八時間十三分の理由はこの操作では分からない。次は本人文と生成文の出典を分ける」"],
  }],
  ["mode08_map_layers", {
    kind: "map08",
    before: ["「同じ町でも、自然、暮らし、土地の記憶の資料は揃っていませんの」", "「三層を切り替え、空欄を一つ開く。更新履歴と受付控えまで見たら戻って。見ないで進んでもいい」"],
    after: ["「三層には、資料がある場所と空欄が分けて置かれていますのね」", "「開いても、空欄の理由までは決まらない。更新履歴と受付控えだけを確認する」"],
  }],
  ["mode10_space", {
    kind: "space10",
    before: ["「離れた記録を一つの物語にしすぎていないか、地球上へ戻して確かめます」", "「地球を回し、四地点を一回ずつ開く。十一秒と02:14を確認したら戻って」"],
    after: ["「四地点と、十一秒と、02:14の本人文が別々に開きましたわ」", "「でも、並んだから同じ物語になるわけじゃない。本人文の意味も決めない」"],
  }],
]);
for (const [sceneId, contract] of interactionDialogueContract) {
  const scene = scenes.find((entry) => entry.id === sceneId);
  assert.deepEqual(scene?.steps.slice(0, 5).map((step) => [step.type, step.speaker, step.text, step.interaction?.kind]), [
    ["dialogue", "mizuha", contract.before[0], undefined],
    ["dialogue", "amane", contract.before[1], undefined],
    ["interaction", undefined, scene?.steps[2]?.text, contract.kind],
    ["dialogue", "mizuha", contract.after[0], undefined],
    ["dialogue", "amane", contract.after[1], undefined],
  ], `${sceneId}: interaction must be enclosed by the approved character dialogue`);
}
assert.deepEqual(scenes.find((scene) => scene.id === "mode08_map_layers")?.temporal.entryTransition?.stepId, "mode08_map_layers_001", "MODE 08 must return to CURRENT before its character introduction");
const editorialScene = scenes.find((scene) => scene.id === "choice_editorial");
const reflectionFieldScene = scenes.find((scene) => scene.id === "epilogue_reflection_field");
const reflectionChoiceScene = scenes.find((scene) => scene.id === "choice_reflection");
const finalRecordScene = scenes.find((scene) => scene.id === "final_record");
assert.equal(editorialScene?.steps[0]?.type, "choice", "the editorial choice must open only after MODE 10 character guidance");
assert.deepEqual(reflectionFieldScene?.steps.map((step) => [step.speaker, step.text]), [
  ["mizuha", "「表示を決めても、sakuの言葉の意味が決まったわけではありませんわ」"],
  ["amane", "「公開版は変わってない。次は、自分が持ち帰る文を選ぶ」"],
  ["mizuha", "「ここからは三人の答えではなく、あなたが展示から持ち帰る文ですの」"],
  ["amane", "「最大三件。何も選ばなくても終了できる。四件目は入らない」"],
], "editorial post-dialogue and reflection pre-dialogue changed");
assert.equal(reflectionChoiceScene?.steps[0]?.type, "reflectionChoice", "the 36 statements must open only after the character guidance");
assert.deepEqual(finalRecordScene?.steps.slice(1, 3).map((step) => [step.speaker, step.text]), [
  ["mizuha", "「選んだ光は、あなたが今残した文を示すだけですわ」"],
  ["amane", "「三人の真相にはしない。このセッションの表示を閉じる」"],
], "reflection completion must return to the two creators before the final record continues");

const novelModeSource = fs.readFileSync(path.join(projectRoot, "novel-mode.js"), "utf8");
assert.match(novelModeSource, /observationOrder:\s*"LOCAL_FIRST"/u, "new sessions must use the canonical observation order without showing a choice");
assert.match(novelModeSource, /\["LOCAL_FIRST", "STATION_FIRST"\]\.includes\(candidate\.observationOrder\)/u, "legacy STATION_FIRST saves must remain readable");
for (const token of ["is-mode08-optional", "dataset.interactionKind", "dataset.interactionOptional", "novel-interaction-skip", "表示モードを見る", "選ばずに進む"]) {
  assert.ok(novelModeSource.includes(token), `MODE 08 optional runtime contract is missing: ${token}`);
}
assert.match(novelModeSource, /const isMode08Optional = step\.type === "interaction"[\s\S]*?step\.interaction\?\.kind === "map08"[\s\S]*?step\.interaction\?\.optional === true/u, "the skip control must use the exact optional map08 predicate");
assert.match(novelModeSource, /event\.stopPropagation\(\);[\s\S]*?skip\.disabled = true;[\s\S]*?moveToFollowingStep\(step\);/u, "MODE 08 skip must advance once without opening the detour");
assert.match(novelModeSource, /resolveVisibleStep[\s\S]*?candidate\?\.type === "phase"/u, "the invisible opening phase must be consumed before rendering or saving the next visible step");
assert.match(novelModeSource, /version7To8StepIds[\s\S]*?Number\(sourceVersion\) < 8/u, "v7 saves must use the focused step migration before same-ID passthrough");
assert.match(novelModeSource, /candidate\.readStepIds[\s\S]*?\.map\(\(id\) =>[\s\S]*?migrateStepId\(id, sourceVersion\)/u, "readStepIds must use the same v7 migration as direct resume");

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
  ["current_exhibition", 17], ["opening_empty_seat", 10], ["prologue_online_circle", 7], ["prologue_basil", 10],
  ["choice_observation_order", 5], ["first_meeting_promise", 70], ["first_meeting_hall", 85], ["festival_walk", 21],
  ["production_year", 261], ["absence", 95], ["search", 146], ["festival_build", 18], ["gx_deep_time", 26],
  ["mode03_map", 20], ["mode07_abstract", 54], ["interlude_sea", 67], ["mode08_map_layers", 19],
  ["mode10_space", 18], ["choice_editorial", 6], ["epilogue_reflection_field", 4], ["choice_reflection", 2],
  ["final_record", 27], ["return_to_start", 36],
], "the focused scene counts changed outside the approved rewrite");

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
const validateLinearLocalMigration = ({ heading, sceneId, oldCount, newCount }) => {
  const rows = readOpeningMigration(heading);
  const expectedOldIds = Array.from({ length: oldCount }, (_, index) => `${sceneId}_${String(index + 1).padStart(3, "0")}`);
  assert.equal(rows.length, oldCount, `${sceneId}: migration row count changed`);
  assert.deepEqual(rows.map((row) => row.oldStepId), expectedOldIds, `${sceneId}: old steps must be listed once in source order`);
  let previousTarget = 0;
  for (const row of rows) {
    assert.equal(row.newSceneId, sceneId, `${row.oldStepId}: migration must stay in its scene`);
    assert.ok(stepIds.includes(row.newStepId), `${row.oldStepId}: migration target is missing`);
    const target = Number(row.newStepId.slice(-3));
    assert.ok(target >= 1 && target <= newCount, `${row.oldStepId}: migration target is outside the new scene`);
    assert.ok(target >= previousTarget, `${sceneId}: migration targets must be monotonic`);
    previousTarget = target;
  }
  return rows;
};
validateLinearLocalMigration({ heading: "prologue_basil旧23step→新10step 完全一意移行表", sceneId: "prologue_basil", oldCount: 23, newCount: 10 });
validateLinearLocalMigration({ heading: "choice_observation_order旧12step→新5step 完全一意移行表", sceneId: "choice_observation_order", oldCount: 12, newCount: 5 });

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
assert.deepEqual({ type: currentOpeningScene?.steps[16]?.type, phase: currentOpeningScene?.steps[16]?.phase, text: currentOpeningScene?.steps[16]?.text }, { type: "phase", phase: "OPENING_RECORD_READY", text: undefined }, "the transition cue must remain non-visible internal metadata");
assert.equal(currentOpeningScene?.steps[4]?.text, "「こんにちは。制作者のミズハです。掲示では『みず』。こちらはアマネですわ」", "Mizuha must introduce her name and display name naturally");
assert.equal(currentOpeningScene?.steps[5]?.text, "「アマネです。掲示では『あまあま』。よかったら、画面はそのまま触って」", "Amane must introduce her name and display name naturally");
assert.equal(currentOpeningScene?.steps[12]?.text, "「STARTで、予定、写真、学内チャットを順に開く。最後の未読まで見たら戻る」", "Amane must explain the objective RECORD sequence without exposing a cast cue");
const currentOpeningText = currentOpeningScene?.steps.map((step) => step.text || "").join("\n") || "";
assert.doesNotMatch(currentOpeningText, /椅子|着席|展示席|黒いシャツの人物|無名staff|指差|黒布|暗い小ブース|机の向こう|扇風機|湯の沸く音|踏切/u, "the CURRENT entrance must match the bright chairless exhibition background");
assert.doesNotMatch(currentOpeningText, /立ち絵|退出|人物表示は出さない|表示｜作業予定/u, "visual implementation notes must not leak into opening copy");
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
assert.deepEqual(basilScene?.steps.map((step) => step.type), ["narration", "narration", "narration", "chat", "chat", "chat", "chat", "narration", "chat", "chat"], "the basil scene must stay a short objective chat record");
assert.deepEqual(basilScene?.steps.slice(0, 3).map((step) => step.text), [
  "二日後、園芸売り場にいるみずが、学内サークル「惑星の放課後」のチャットへ、バジル一鉢の写真を投稿した。",
  "アマネとサクヤは別々の町から開いた。写真には、値下げ札、太い黄色いホース、青灰色と白のスニーカーの先、濡れた床、中央から下の大きな葉が斜め下を向く様子が写っている。",
  "18時12分、みずの投稿が届いた。",
], "the May 3 basil record must establish one place, one pot, and remote readers");
assert.deepEqual(basilScene?.steps[3]?.attachments?.map((attachment) => attachment.id), ["BASIL"], "the existing BASIL attachment must stay on prologue_basil_004");
assert.equal(basilScene?.steps[3]?.attachments?.[0]?.description, "売り場の裏にあるバジル。値下げ札、黄色いホース、青灰色と白のスニーカーの先が写っている", "BASIL alt text must stay within visible image facts");
assert.deepEqual(basilScene?.steps.filter((step) => step.type === "chat").map((step) => [step.time, step.speaker, step.text]), [
  ["18:12", "mizuha", "売り場の裏のバジルですの。同じ鉢をもう一度見たいですわ。"],
  ["18:13", "amane", "撮ったの、何時？"],
  ["18:14", "mizuha", "18時12分、売り場の裏ですわ。"],
  ["18:19", "sakuya", "次も値下げ札と黄色いホースを入れて、同じ角度で見たい。"],
  ["昼", "mizuha", "今日も18時12分に、同じ場所と角度で撮りますわ。値下げ札と黄色いホースも入れます。"],
  ["昼", "amane", "それなら比べられる。"],
], "the basil chat must end on a same-condition next-photo promise");
const basilVisibleText = basilScene?.steps.map((step) => step.text || "").join("\n") || "";
assert.doesNotMatch(basilVisibleText, /FLOWERBED|花壇|工事板|観測所|36度|温度計|日陰|土が湿|土のついた|土で汚|水滴|根|蒸散|鉢サイズ|病斑|枯死|回復|翌日の写真/u, "unsupported basil facts or the deleted second topic remain");
assert.equal(basilScene?.steps.flatMap((step) => step.attachments || []).length, 1, "the basil scene must contain exactly one attachment");
const observationScene = scenes.find((scene) => scene.id === "choice_observation_order");
assert.equal(observationScene?.title, "現在の展示｜売り場と観測所", "the observation scene title must be natural Japanese");
assert.deepEqual(observationScene?.legacyChoice, { id: "observation_order", defaultValue: "LOCAL_FIRST", values: ["LOCAL_FIRST", "STATION_FIRST"] }, "legacy observation-order save values must remain readable");
assert.equal(observationScene?.steps.some((step) => step.type === "choice"), false, "the meaningless observation-order choice must not be rendered");
assert.deepEqual(observationScene?.steps.map((step) => [step.type, step.speaker, step.text]), [
  ["narration", "narrator", "バジルの記録が閉じ、画面は現在の展示ブースへ戻る。展示端末の前には、海側からの明るい光が届いている。"],
  ["dialogue", "mizuha", "「三人が話し始めた日と、sakuが来なかった日の記録を見ても、来なかった理由までは分かりませんわ」"],
  ["dialogue", "amane", "「残っている記録だけで進む。次は、三人が初めて会う約束をした前夜」"],
  ["narration", "narrator", "端末は、園芸売り場の写真記録、同じ時間帯の最寄り観測所の公開記録の順に開く。場所と測った時刻が違うため、同じ値としてまとめない。"],
  ["narration", "narrator", "二つの記録を閉じると、端末は、三人が初めて会う約束をした前夜のチャットを開く。"],
], "the observation record must return to CURRENT, speak once, then follow the canonical automatic order");
assert.doesNotMatch(observationScene?.steps.map((step) => step.text || "").join("\n") || "", /小さな選択|どちらから見る|記録を選ぶ|選ばなかった記録|LOCAL FIRST|STATION FIRST|CURRENT/u, "obsolete choice copy leaked into the automatic observation sequence");
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
assert.equal(temporalTransitionCount, 60, "the removed FLOWERBED transition must not remain in temporal metadata");

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
assert.equal(scenes.find((scene) => scene.id === "first_meeting_promise")?.steps[25]?.text, "いよいよ、直接会うのですわね…！", "Mizuha's first-meeting reaction must express anticipation instead of false surprise");
assert.doesNotMatch(allText, /急ですわね…！/u, "obsolete first-meeting microcopy remains");
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
assert.match(allText, /当日の本人同意で届いた外部通知で、直前の選択の結果ではない。/u, "visitor choices must not cause the current contact");
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
assert.match(allText, /バジルの記録が閉じ、画面は現在の展示ブースへ戻る。/u, "the automatic observation sequence must establish the return to the exhibition booth");
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
