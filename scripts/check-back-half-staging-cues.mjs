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
const expectedSceneIds = [
  "festival_concept",
  "map_mode01",
  "gx_experience",
  "esp32_pitch",
  "circle_invitation",
  "welcome_chat",
];
const expectedCounts = [76, 43, 48, 43, 81, 95];
const allSteps = story.scenes.flatMap((scene) => scene.steps);
const stepMap = new Map(allSteps.map((step) => [step.id, step]));
const range = (sceneId, from, to) => Array.from(
  { length: to - from + 1 },
  (_, index) => `${sceneId}_${String(from + index).padStart(3, "0")}`,
);

assert.equal(story.storyVersion, 10, "contest story version changed");
assert.deepEqual(story.scenes.map((scene) => scene.id), expectedSceneIds, "contest scene order changed");
assert.deepEqual(story.scenes.map((scene) => scene.steps.length), expectedCounts, "contest scene counts changed");
assert.equal(allSteps.length, 386, "contest story must keep 386 steps after retiring the demo poll");
assert.deepEqual(staging.sceneIds, expectedSceneIds, "staging scene registry changed");
assert.deepEqual(staging.expectedSceneCounts, Object.fromEntries(expectedSceneIds.map((id, index) => [id, expectedCounts[index]])));

for (const scene of story.scenes) {
  assert.equal(scene.temporal?.temporalContext, "CURRENT", `${scene.id}: temporal context changed`);
  assert.equal(scene.temporal?.timePrecision, "MINUTE", `${scene.id}: temporal precision changed`);
  scene.steps.forEach((step, index) => {
    const stepNumber = scene.id === "gx_experience" && index >= 44 ? index + 11 : index + 1;
    assert.equal(step.id, `${scene.id}_${String(stepNumber).padStart(3, "0")}`, `${scene.id}: non-canonical step id`);
  });
}

const resolved = allSteps.map((step) => ({
  step,
  background: backgrounds.forStep(step),
  staging: staging.forStep(step),
}));
assert(resolved.every(({ background }) => background?.assetPath), "every contest step needs an approved background");
assert(resolved.every(({ staging: cue }) => cue?.temporal), "every contest step needs a temporal cue");
assert(resolved.every(({ staging: cue }) => cue.temporal.context === "CURRENT"), "contest route must stay CURRENT");
assert(resolved.every(({ staging: cue }) => cue.temporal.precision === "MINUTE"), "contest route must keep authored minute precision");
assert(resolved.every(({ staging: cue }) => cue.temporal.date === "10月3日（土）"), "contest cue lost the authored autumn Saturday date");
assert(resolved.every(({ staging: cue }) => /^AM\s/u.test(cue.temporal.time)), "contest cue lost autumn-morning AM notation");
assert(resolved.every(({ staging: cue }) => cue.audio === "none"), "contest cue added character or archive audio");

for (const assetPath of new Set(resolved.map(({ background }) => background.assetPath))) {
  assert(/^assets\/(?:visuals-07|data|architecture|concept)\//u.test(assetPath), `background escaped approved assets: ${assetPath}`);
  await access(path.join(projectRoot, assetPath));
}

assert.deepEqual(staging.interactions.map((entry) => entry.stepId), ["map_mode01_004", "map_mode01_023", "gx_experience_017"]);
assert.deepEqual(
  allSteps.filter((step) => step.type === "interaction").map((step) => step.id),
  staging.interactions.map((entry) => entry.stepId),
  "interaction registry must contain both MAP01 phases and GX",
);

const mapInteraction = staging.interactions[0];
assert.deepEqual(mapInteraction.prepStepIds, range("map_mode01", 1, 3));
assert.deepEqual(mapInteraction.postStepIds, range("map_mode01", 5, 22));
assert.equal(mapInteraction.returnStepId, "map_mode01_005");
assert.equal(mapInteraction.kind, "map01");
assert.equal(mapInteraction.modeIndex, 0);
assert.equal(mapInteraction.modeId, "breathing-earth");
assert.equal(mapInteraction.target, "#japan-layer");

const temperatureInteraction = staging.interactions[1];
assert.deepEqual(temperatureInteraction.prepStepIds, range("map_mode01", 15, 22));
assert.deepEqual(temperatureInteraction.postStepIds, range("map_mode01", 24, 43));
assert.equal(temperatureInteraction.returnStepId, "map_mode01_024");
assert.equal(temperatureInteraction.kind, "map01");
assert.equal(temperatureInteraction.modeIndex, 0);
assert.equal(temperatureInteraction.modeId, "breathing-earth");
assert.equal(temperatureInteraction.phase, "temperature-anomaly");
assert.equal(temperatureInteraction.target, "#japan-layer");

const gxInteraction = staging.interactions[2];
assert.deepEqual(gxInteraction.prepStepIds, range("gx_experience", 1, 16));
assert.deepEqual(gxInteraction.postStepIds, [
  ...range("gx_experience", 18, 44),
  ...range("gx_experience", 55, 58),
]);
assert.equal(gxInteraction.returnStepId, "gx_experience_018");
assert.equal(gxInteraction.kind, "gx");
assert.equal(gxInteraction.target, "#gx-layer");

for (const interaction of staging.interactions) {
  const step = stepMap.get(interaction.stepId);
  assert.equal(step?.type, "interaction", `${interaction.stepId}: interaction type changed`);
  assert.equal(step?.interaction?.kind, interaction.kind, `${interaction.stepId}: interaction kind changed`);
  assert(stepMap.has(interaction.returnStepId), `${interaction.stepId}: return step is missing`);
}

assert.deepEqual(staging.choices, []);
assert.equal(stepMap.has("gx_experience_046"), false);

const cue = (stepId) => staging.forStep(stepMap.get(stepId));
assert.equal(cue("map_mode01_003").device, "none");
assert.equal(cue("map_mode01_003").castMode, "normal");
assert.equal(cue("map_mode01_004").device, "native-mode-overlay");
assert.equal(cue("map_mode01_004").devicePhase, "open");
assert.equal(cue("map_mode01_004").castMode, "interaction-no-cast");
assert.equal(cue("map_mode01_005").device, "none");
assert.equal(cue("map_mode01_005").castMode, "normal");
assert.equal(cue("map_mode01_023").device, "native-mode-overlay");
assert.equal(cue("map_mode01_023").devicePhase, "temperature-anomaly");
assert.equal(cue("map_mode01_023").castMode, "interaction-no-cast");
assert.equal(cue("map_mode01_024").device, "none");
assert.equal(cue("map_mode01_024").castMode, "normal");
assert.equal(cue("gx_experience_016").castMode, "normal");
assert.equal(cue("gx_experience_017").device, "native-mode-overlay");
assert.equal(cue("gx_experience_017").castMode, "interaction-no-cast");
assert.equal(cue("gx_experience_018").castMode, "normal");
assert.equal(cue("welcome_chat_001").device, "wide-campus-chat");
assert.equal(cue("welcome_chat_001").character.avatar, "none");
assert.equal(cue("welcome_chat_001").character.cast, "none");
assert.equal(cue("welcome_chat_054").castMode, "chat-text-only-no-cast");
assert.equal(cue("welcome_chat_055").devicePhase, "physical");
assert.equal(cue("welcome_chat_055").castMode, "normal");
assert.equal(cue("welcome_chat_055").character.cast, "mizuha-amane");
assert.equal(cue("welcome_chat_055").character.portrait, "normal");
assert.equal(cue("welcome_chat_077").castMode, "normal");
assert.equal(cue("welcome_chat_078").device, "mobile-campus-chat");
assert.equal(cue("welcome_chat_078").character.avatar, "none");
assert.equal(cue("welcome_chat_095").castMode, "chat-text-only-no-cast");
assert.equal(staging.audio.length, 0, "contest route must not add Sakuya voice/audio cues");
assert(staging.characters.every((entry) => entry.voice === "none"), "welcome route must not add character voice");

const sakuyaSteps = allSteps.filter((step) => step.speaker === "sakuya");
assert(sakuyaSteps.length > 0, "Sakuya text chat is missing");
assert(sakuyaSteps.every((step) => step.sceneId === "welcome_chat" && step.type === "chat"), "Sakuya escaped text-only chat");
assert.throws(() => staging.forStep({ sceneId: "welcome_chat", id: "welcome_chat_999" }), /Missing contest-v10 temporal cue/);
assert.throws(() => staging.forStep({ sceneId: "unknown", id: "unknown_001" }), /Unknown contest-v10 staging scene/);

console.log(JSON.stringify({
  status: "passed",
  storyVersion: story.storyVersion,
  scenes: story.scenes.length,
  steps: allSteps.length,
  temporalCues: staging.temporal.length,
  interactions: staging.interactions.map((entry) => entry.stepId),
  choices: staging.choices.map((entry) => entry.stepId),
  deviceCues: staging.devices.length,
  characterCues: staging.characters.length,
  audioCues: staging.audio.length,
  welcomePresentation: ["001-054 wide", "055-077 physical", "078-095 mobile"],
}, null, 2));
