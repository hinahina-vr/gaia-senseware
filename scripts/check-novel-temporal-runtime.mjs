import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
await import(`${pathToFileURL(path.join(projectRoot, "novel-story-data.js")).href}?temporal-runtime-data=1`);
await import(`${pathToFileURL(path.join(projectRoot, "novel-temporal.js")).href}?temporal-runtime=1`);

const story = globalThis.GAIA_NOVEL_STORY;
const runtime = globalThis.GaiaNovelTemporal.create(story);
const steps = new Map(story.scenes.flatMap((scene) => scene.steps.map((step) => [step.id, step])));
const presentation = (stepId) => runtime.presentationForStep(steps.get(stepId));

assert.deepEqual(presentation("current_exhibition_001"), {
  displayTitle: "11月1日（日） 13:30｜学園祭・展示ホール",
  temporalContext: "CURRENT",
  timePrecision: "MINUTE",
  isPeriod: false,
  displayMode: "",
  source: "SCENE",
});
assert.equal(presentation("prologue_basil_001").displayTitle, "5月3日（土）〜5月4日（日）｜学内チャット「惑星の放課後」");
assert.equal(presentation("prologue_basil_001").isPeriod, true);
assert.equal(presentation("prologue_basil_011").displayTitle, "5月4日（日） 00:31｜サクヤの花壇投稿");
assert.equal(presentation("prologue_basil_017").displayTitle, "5月4日（日） 昼｜バジルの翌日写真");
assert.equal(presentation("prologue_basil_017").timePrecision, "PART_OF_DAY");
assert.equal(presentation("production_year_001").displayTitle, "2025年11月9日（日）〜2026年8月1日（土）｜九か月間の制作記録");
assert.equal(presentation("production_year_248").displayTitle, "2026年7月25日（土） 10:02〜18:32｜七月の終わり・予約と制作チャット");
assert.equal(presentation("production_year_248").displayMode, "", "ARCHIVE_REFERENCE must not replace the story heading");
assert.equal(presentation("search_024").timePrecision, "DAY");
assert.equal(presentation("search_060").timePrecision, "PART_OF_DAY");
assert.equal(presentation("search_127").isPeriod, true);
assert.equal(presentation("mode07_abstract_024").temporalContext, "RECORD");

const entryChange = runtime.contextTransitionForStep(steps.get("opening_empty_seat_001"));
assert.deepEqual([entryChange.fromTemporalContext, entryChange.toTemporalContext], ["CURRENT", "RECORD"]);
const internalChange = runtime.contextTransitionForStep(steps.get("mode07_abstract_009"));
assert.deepEqual([internalChange.fromTemporalContext, internalChange.toTemporalContext], ["CURRENT", "RECORD"]);
const delayedEntryChange = runtime.contextTransitionForStep(steps.get("mode08_map_layers_003"));
assert.deepEqual([delayedEntryChange.fromTemporalContext, delayedEntryChange.toTemporalContext], ["RECORD", "CURRENT"]);
assert.equal(runtime.contextTransitionForStep(steps.get("mode08_map_layers_001")), null);

const missingSceneMetadata = structuredClone(story);
delete missingSceneMetadata.scenes[0].temporal;
assert.throws(
  () => globalThis.GaiaNovelTemporal.create(missingSceneMetadata),
  /scene current_exhibition\.temporal is required/u,
  "missing scene metadata must fail instead of falling back to the current date",
);
const missingPolicy = structuredClone(story);
delete missingPolicy.temporal.clockPolicy;
assert.throws(() => globalThis.GaiaNovelTemporal.create(missingPolicy), /clockPolicy must be AUTHOR_FIXED/u);

console.log("novel temporal runtime check passed: scene, period, cross-year, precision, context cards, strict missing-data errors");
