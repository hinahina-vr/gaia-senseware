import assert from "node:assert/strict";
import { access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
await import(new URL("../novel-story-data.js", import.meta.url));
await import(new URL("../novel-background-cues.js", import.meta.url));
await import(new URL("../novel-back-half-cues.js", import.meta.url));

const story = globalThis.GAIA_NOVEL_STORY;
const backgrounds = globalThis.GAIA_NOVEL_BACKGROUND_CUES;
const staging = globalThis.GAIA_NOVEL_BACK_HALF_CUES;
const allSteps = story.scenes.flatMap((scene) => scene.steps);
const stepMap = new Map(allSteps.map((step) => [step.id, step]));

assert.equal(story.scenes.length, 23, "canonical story must keep 23 scenes");
assert.equal(allSteps.length, 1044, "canonical story must keep 1044 steps after the approved opening redesign");

const backHalfScenes = story.scenes.filter((scene) => staging.backHalfSceneIds.includes(scene.id));
assert.equal(backHalfScenes.length, 12, "back half must contain 12 scenes");
for (const [sceneId, expectedCount] of Object.entries(staging.expectedSceneCounts)) {
  const scene = backHalfScenes.find((candidate) => candidate.id === sceneId);
  assert(scene, `${sceneId}: scene is missing`);
  assert.equal(scene.steps.length, expectedCount, `${sceneId}: canonical step count changed`);
  scene.steps.forEach((step, index) => {
    assert.equal(step.id, `${sceneId}_${String(index + 1).padStart(3, "0")}`, `${sceneId}: non-canonical step id at ${index + 1}`);
  });
}

const backHalfSteps = backHalfScenes.flatMap((scene) => scene.steps);
assert.equal(backHalfSteps.length, 297, "back-half migration must resolve to 297 steps");

const resolved = backHalfSteps.map((step) => ({
  step,
  background: backgrounds.forStep(step),
  staging: staging.forStep(step),
}));
assert(resolved.every(({ background }) => background?.assetPath), "every back-half step needs an approved background");
assert(resolved.every(({ staging: cue }) => cue?.temporal), "every back-half step needs a temporal cue");
assert.equal(resolved.filter(({ background }) => background.assetPath.includes("novel-bg-production-night-v2.png")).length, 0, "old production-night background leaked into the new back half");

for (const assetPath of new Set(resolved.map(({ background }) => background.assetPath))) {
  assert(assetPath.startsWith("assets/visuals-07/"), `background escaped the approved asset root: ${assetPath}`);
  await access(path.join(projectRoot, assetPath));
}

for (const interaction of staging.interactions) {
  const step = stepMap.get(interaction.stepId);
  assert(step, `${interaction.stepId}: interaction step is missing`);
  assert.equal(step.type, "interaction", `${interaction.stepId}: interaction type changed`);
  assert.equal(step.interaction?.kind, interaction.kind, `${interaction.stepId}: interaction kind changed`);
  assert(stepMap.has(interaction.returnStepId), `${interaction.stepId}: return step is missing`);
}
assert.deepEqual(
  backHalfSteps.filter((step) => step.type === "interaction").map((step) => step.id),
  staging.interactions.map((entry) => entry.stepId),
  "MODE interaction starts changed",
);

const cue = (stepId) => staging.forStep(stepMap.get(stepId));
assert.equal(cue("mode07_abstract_008").temporal.context, "CURRENT");
assert.equal(cue("mode07_abstract_009").temporal.context, "RECORD");
assert.equal(cue("interlude_sea_067").temporal.context, "RECORD");
assert.equal(cue("mode08_map_layers_001").temporal.context, "CURRENT");
assert.equal(cue("final_record_008").temporal.time, "15:52");
assert.equal(cue("final_record_009").device, "portrait-operations-phone");
assert.equal(cue("final_record_009").phone.noticeTime, "15:52");
assert.equal(cue("final_record_009").phone.noticeSender, "大学学生支援窓口");
assert.equal(
  cue("final_record_009").phone.noticeBody,
  "本人の安全を確認しました。本人の同意により、中央入口で二人と話したい旨をお伝えします。",
);
assert.equal(cue("final_record_017").temporal.time, "15:54");
assert.equal(cue("final_record_018").devicePhase, "incoming-audio");
assert.equal(cue("final_record_018").phone.clock, "15:54");
assert.equal(cue("final_record_018").phone.audioSpeaker, "サクヤ");
assert.equal(cue("final_record_018").phone.audioStatus, "音声着信");
assert.equal(cue("final_record_019").phone.audioStatus, "接続中");
assert.equal(cue("final_record_027").phone.audioStatus, "通話終了");
assert.equal(cue("return_to_start_001").temporal.time, "15:55");
assert.equal(cue("return_to_start_001").phone, null, "operations phone must close at the 15:55 pause scene");
assert.equal(cue("return_to_start_018").temporal.time, "16:00");
assert.equal(cue("return_to_start_032").temporal.time, "16:03");
assert.equal(cue("return_to_start_017").viewpoint, "visitor");
assert.equal(cue("return_to_start_018").viewpoint, "work-camera");
assert.equal(cue("return_to_start_020").castMode, "sakuya-unseen");
assert.equal(cue("return_to_start_021").castMode, "central-entrance-distance");
assert.equal(cue("gx_deep_time_017").castMode, "archived-voice-no-cast");
assert.equal(cue("final_record_024").castMode, "remote-sakuya-no-cast");
assert.equal(cue("mode10_space_009").device, "wide-exhibition-terminal");
assert.equal(cue("mode10_space_014").device, "wide-exhibition-terminal");
assert(!stepMap.has("mode10_space_030"), "obsolete pre-rewrite mode10 device boundary remains");

const reflection = stepMap.get("choice_reflection_002");
assert.equal(reflection.maxSelections, 3, "reflection max selection changed");
assert.deepEqual(reflection.options.map((option) => option.id), Array.from({ length: 36 }, (_, index) => `R${String(index + 1).padStart(2, "0")}`), "R01-R36 fixed order changed");
const endSteps = allSteps.filter((step) => step.type === "end");
assert.deepEqual(endSteps.map((step) => step.id), ["return_to_start_036"], "16:03 must remain the only END");
assert.equal(story.scenes.find((scene) => scene.id === "return_to_start")?.chapter, "CURRENT CONTACT", "CURRENT CONTACT chapter changed");
assert.equal(story.scenes.find((scene) => scene.id === "return_to_start")?.title, "CURRENT CONTACT｜展示を一時休止する", "CURRENT CONTACT title changed");

const report = {
  status: "passed",
  storySteps: allSteps.length,
  backHalfScenes: backHalfScenes.length,
  backHalfSteps: backHalfSteps.length,
  backgrounds: backgrounds.backHalf.length,
  temporalCues: staging.temporal.length,
  interactions: staging.interactions.length,
  deviceCues: staging.devices.length,
  audioCues: staging.audio.length,
  currentRecordBoundaries: ["mode07_abstract_008→009", "interlude_sea_067→mode08_map_layers_001"],
  phoneWindow: "final_record_008→027",
  viewpointBoundary: "return_to_start_017→018",
  sakuyaPhysicalGate: "return_to_start_020 displayed; eligible from _021",
  onlyEnd: endSteps[0].id,
};
console.log(JSON.stringify(report, null, 2));
