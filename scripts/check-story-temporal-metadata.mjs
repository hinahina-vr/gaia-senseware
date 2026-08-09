import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const canonPath = path.join(projectRoot, "story", "物語台本.md");
const generatedPath = path.join(projectRoot, "novel-story-data.js");
const source = fs.readFileSync(canonPath, "utf8").replace(/\r\n?/g, "\n");
const metadataMatch = source.match(/<!-- GAIA_TEMPORAL_METADATA\n([\s\S]*?)\nGAIA_TEMPORAL_METADATA -->/u);
assert.ok(metadataMatch, "GAIA_TEMPORAL_METADATA block is required in the canonical script");
const metadata = JSON.parse(metadataMatch[1]);

assert.equal(metadata.schemaVersion, 1);
assert.equal(metadata.calendar, "GREGORIAN");
assert.equal(metadata.timeZone, "Asia/Tokyo");
assert.equal(metadata.currentYear, 2026);
assert.equal(metadata.clockPolicy, "AUTHOR_FIXED");
assert.equal(metadata.missingMetadataPolicy, "ERROR");

const expectedSceneOrder = [
  "current_exhibition", "opening_empty_seat", "prologue_online_circle", "prologue_basil",
  "choice_observation_order", "first_meeting_promise", "first_meeting_hall", "festival_walk",
  "production_year", "absence", "search", "festival_build", "gx_deep_time", "mode03_map",
  "mode07_abstract", "interlude_sea", "mode08_map_layers", "mode10_space", "choice_editorial",
  "epilogue_reflection_field", "choice_reflection", "final_record", "return_to_start",
];
assert.deepEqual(metadata.sceneOrder, expectedSceneOrder, "all 23 canonical scenes must have ordered temporal metadata");
assert.deepEqual(Object.keys(metadata.scenes), expectedSceneOrder, "scene metadata keys must match canonical order exactly");

const allowedPrecisions = new Set(["MINUTE", "DAY", "PART_OF_DAY", "APPROXIMATE"]);
const weekdayNames = ["日", "月", "火", "水", "木", "金", "土"];
const datePart = (value) => value.slice(0, 10);
const minutePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:00\+09:00$/u;
const dayPattern = /^\d{4}-\d{2}-\d{2}$/u;
const assertPrecisionValue = (value, precision, label) => {
  assert.ok(allowedPrecisions.has(precision), `${label}: unsupported precision ${precision}`);
  if (precision === "MINUTE" || precision === "APPROXIMATE") assert.match(value, minutePattern, `${label}: minute/approximate values must be fixed JST timestamps`);
  if (precision === "DAY" || precision === "PART_OF_DAY") assert.match(value, dayPattern, `${label}: day/part-of-day values must not invent HH:MM`);
};
const assertDisplayWeekdays = (displayTitle, values, label) => {
  const tokens = [...displayTitle.matchAll(/(?:(\d{4})年)?(\d{1,2})月(\d{1,2})日（([日月火水木金土])）/gu)];
  const uniqueDateValues = values.filter((value, index) => index === 0 || datePart(value) !== datePart(values[index - 1]));
  assert.equal(tokens.length, uniqueDateValues.length, `${label}: display date count must match metadata range`);
  tokens.forEach((token, index) => {
    const [year, month, day] = datePart(uniqueDateValues[index]).split("-").map(Number);
    if (token[1]) assert.equal(Number(token[1]), year, `${label}: displayed year mismatch`);
    assert.equal(Number(token[2]), month, `${label}: displayed month mismatch`);
    assert.equal(Number(token[3]), day, `${label}: displayed day mismatch`);
    const weekday = weekdayNames[new Date(Date.UTC(year, month - 1, day)).getUTCDay()];
    assert.equal(token[4], weekday, `${label}: weekday mismatch for ${datePart(uniqueDateValues[index])}`);
  });
};

await import(`${pathToFileURL(generatedPath).href}?temporal-check=1`);
const generatedScenes = globalThis.GAIA_NOVEL_STORY.scenes;
const generatedStepIds = new Set(generatedScenes.flatMap((scene) => scene.steps.map((step) => step.id)));

for (const sceneId of expectedSceneOrder) {
  const scene = metadata.scenes[sceneId];
  assert.ok(scene, `${sceneId}: temporal metadata is required`);
  assert.ok(["CURRENT", "RECORD"].includes(scene.temporalContext), `${sceneId}: temporalContext must be CURRENT or RECORD`);
  assert.equal(typeof scene.location, "string", `${sceneId}: location is required`);
  assert.equal(typeof scene.displayTitle, "string", `${sceneId}: displayTitle is required`);
  assertPrecisionValue(scene.startAt, scene.timePrecision, `${sceneId}.startAt`);
  const titleValues = [scene.startAt];
  if (scene.endAt) {
    assert.ok(scene.endTimePrecision, `${sceneId}: endTimePrecision is required with endAt`);
    assertPrecisionValue(scene.endAt, scene.endTimePrecision, `${sceneId}.endAt`);
    titleValues.push(scene.endAt);
  }
  assertDisplayWeekdays(scene.displayTitle, titleValues, `${sceneId}.displayTitle`);
  for (const transition of [scene.entryTransition, ...(scene.transitions || [])].filter(Boolean)) {
    if (transition.stepId) assert.ok(generatedStepIds.has(transition.stepId), `${sceneId}: unknown transition step ${transition.stepId}`);
    assertPrecisionValue(transition.transitionAt, transition.timePrecision, `${sceneId}.${transition.stepId || "transition"}`);
    if (transition.endAt) {
      assert.ok(transition.endTimePrecision, `${sceneId}.${transition.stepId}: endTimePrecision is required`);
      assertPrecisionValue(transition.endAt, transition.endTimePrecision, `${sceneId}.${transition.stepId}.endAt`);
    }
    if (transition.timePrecision === "PART_OF_DAY") assert.ok(transition.partOfDay, `${sceneId}.${transition.stepId}: partOfDay is required`);
    assertDisplayWeekdays(transition.displayTitle, [transition.transitionAt, ...(transition.endAt ? [transition.endAt] : [])], `${sceneId}.${transition.stepId || "transition"}.displayTitle`);
  }
}

const currentIds = [
  "current_exhibition", "choice_observation_order", "festival_build", "gx_deep_time", "mode03_map",
  "mode07_abstract", "mode08_map_layers", "mode10_space", "choice_editorial", "epilogue_reflection_field",
  "choice_reflection", "final_record", "return_to_start",
];
const expectedCurrentTimes = ["13:30", "13:42", "14:40", "14:44", "14:53", "15:00", "15:22", "15:30", "15:38", "15:42", "15:44", "15:47", "15:55"];
assert.deepEqual(currentIds.map((id) => metadata.scenes[id].startAt.slice(11, 16)), expectedCurrentTimes, "CURRENT fixed author times must match the approved 2h25m sequence");
assert.equal((new Date(metadata.scenes.return_to_start.startAt) - new Date(metadata.scenes.current_exhibition.startAt)) / 60000, 145, "CURRENT session duration must be 145 minutes");
assert.ok(!expectedCurrentTimes.includes("14:02"), "obsolete compressed CURRENT endpoint must not return");

const exactPeriodTitles = {
  prologue_basil: "5月3日（土）〜5月4日（日）｜学内チャット「惑星の放課後」",
  first_meeting_promise: "11月1日（土）21:06〜11月2日（日）02:00過ぎ｜学内チャット「惑星の放課後」",
  production_year: "2025年11月9日（日）〜2026年8月1日（土）｜九か月間の制作記録",
  search: "8月1日（土）〜8月14日（金）｜安否確認記録",
  interlude_sea: "10月31日（土）23:20〜11月1日（日）00:26｜共同作業室から海岸へ",
};
for (const [sceneId, title] of Object.entries(exactPeriodTitles)) assert.equal(metadata.scenes[sceneId].displayTitle, title, `${sceneId}: approved period title changed`);
assert.equal(metadata.scenes.first_meeting_promise.endTimePrecision, "APPROXIMATE");
assert.equal(metadata.scenes.first_meeting_promise.endQualifier, "AFTER");
assert.equal(metadata.scenes.prologue_basil.endTimePrecision, "PART_OF_DAY");
assert.ok(!metadataMatch[1].includes("2025-05-04T12:00"), "prologue_basil must not invent an exact noon time");

const requiredContextChanges = [
  ["opening_empty_seat", "CURRENT", "RECORD"],
  ["choice_observation_order", "RECORD", "CURRENT"],
  ["first_meeting_promise", "CURRENT", "RECORD"],
  ["festival_build", "RECORD", "CURRENT"],
  ["mode08_map_layers", "RECORD", "CURRENT"],
];
for (const [sceneId, from, to] of requiredContextChanges) {
  const transition = metadata.scenes[sceneId].entryTransition;
  assert.equal(transition.fromTemporalContext, from, `${sceneId}: entry transition source changed`);
  assert.equal(transition.toTemporalContext, to, `${sceneId}: entry transition destination changed`);
}
const mode07ContextChange = metadata.scenes.mode07_abstract.transitions[0];
assert.equal(mode07ContextChange.fromTemporalContext, "CURRENT");
assert.equal(mode07ContextChange.toTemporalContext, "RECORD");

const expectedProductionSteps = [
  "production_year_006", "production_year_028", "production_year_038", "production_year_043", "production_year_060",
  "production_year_069", "production_year_081", "production_year_083", "production_year_088", "production_year_089",
  "production_year_090", "production_year_116", "production_year_125", "production_year_130", "production_year_148",
  "production_year_156", "production_year_168", "production_year_183", "production_year_196", "production_year_200",
  "production_year_215", "production_year_233", "production_year_239", "production_year_248", "production_year_248",
  "production_year_257", "production_year_261",
];
assert.deepEqual(metadata.scenes.production_year.transitions.map((transition) => transition.stepId), expectedProductionSteps, "production_year transition coverage changed");
const c04Event = metadata.scenes.production_year.transitions.find((transition) => transition.archiveId === "C-04");
const reservationEvent = metadata.scenes.production_year.transitions.find((transition) => transition.stepId === "production_year_248" && !transition.archiveId);
assert.ok(new Date(c04Event.endAt) < new Date(reservationEvent.transitionAt), "C-04 must end before the same-day reservation chat begins");
assert.equal(reservationEvent.transitionAt.slice(11, 16), "10:02");

const expectedSearchPrecision = [
  ["search_003", "MINUTE"], ["search_013", "MINUTE"], ["search_024", "DAY"], ["search_034", "DAY"],
  ["search_045", "DAY"], ["search_060", "PART_OF_DAY"], ["search_069", "PART_OF_DAY"],
  ["search_076", "MINUTE"], ["search_080", "MINUTE"], ["search_081", "MINUTE"],
  ["search_086", "DAY"], ["search_112", "PART_OF_DAY"], ["search_127", "DAY"],
];
assert.deepEqual(metadata.scenes.search.transitions.map(({ stepId, timePrecision }) => [stepId, timePrecision]), expectedSearchPrecision, "search precision must not invent minute values");

const expectedArchives = {
  "C-01": ["2026-06-20", "PART_OF_DAY"],
  "C-02": ["2026-06-28T18:36:00+09:00", "MINUTE"],
  "C-03": ["2026-07-12", "DAY"],
  "C-04": ["2026-07-25T00:18:00+09:00", "MINUTE"],
};
for (const [archiveId, [startAt, precision]] of Object.entries(expectedArchives)) {
  const archive = metadata.archives[archiveId];
  assert.equal(archive.startAt, startAt, `${archiveId}: canonical date changed`);
  assert.equal(archive.timePrecision, precision, `${archiveId}: precision changed`);
  assertPrecisionValue(archive.startAt, archive.timePrecision, `${archiveId}.startAt`);
  assertDisplayWeekdays(archive.displayTitle, [archive.startAt, ...(archive.endAt ? [archive.endAt] : [])], `${archiveId}.displayTitle`);
  for (const transition of archive.transitions || []) {
    assertPrecisionValue(transition.transitionAt, transition.timePrecision, `${archiveId}.transition`);
    assertDisplayWeekdays(transition.displayTitle, [transition.transitionAt], `${archiveId}.transition.displayTitle`);
  }
}

for (const obsoleteDate of ["2025-07-19", "2025-08-03", "2025-10-12", "2025-11-08"]) assert.ok(!source.includes(obsoleteDate), `obsolete ARCHIVE C date remains: ${obsoleteDate}`);
for (const requiredArchiveLabel of [
  "［SOURCE｜制作ログ 2026-06-20（土） 夜］",
  "［SOURCE｜制作ログ 2026-06-28（日）］",
  "［SOURCE｜制作ログ 2026-07-12（日）］",
  "［SOURCE｜制作ログ 2026-07-25（土）］",
]) assert.ok(source.includes(requiredArchiveLabel), `updated ARCHIVE C label missing: ${requiredArchiveLabel}`);
assert.ok(!source.includes("六月の終わり、アマネが共同作業室を予約した。"), "obsolete production month remains");
assert.ok(source.includes("七月の終わり、アマネが共同作業室を予約した。"), "approved production month is missing");

console.log(`story temporal metadata check passed: ${expectedSceneOrder.length} scenes, ${metadata.scenes.production_year.transitions.length + metadata.scenes.search.transitions.length + metadata.scenes.mode07_abstract.transitions.length + metadata.scenes.interlude_sea.transitions.length + metadata.scenes.prologue_basil.transitions.length + metadata.scenes.first_meeting_promise.transitions.length} internal transitions, 4 archive records`);
