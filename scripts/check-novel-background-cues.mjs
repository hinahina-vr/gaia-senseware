import assert from "node:assert/strict";
import { access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
await import(new URL("../novel-story-data.js", import.meta.url));
await import(new URL("../novel-background-cues.js", import.meta.url));

const story = globalThis.GAIA_NOVEL_STORY;
const backgroundCues = globalThis.GAIA_NOVEL_BACKGROUND_CUES;
const expectedSceneIds = [
  "festival_concept",
  "map_mode01",
  "gx_experience",
  "esp32_pitch",
  "circle_invitation",
  "welcome_chat",
];
const expectedCounts = [76, 43, 58, 43, 81, 95];
const exhibition = "assets/visuals-07/novel-bg-exhibition-v3.png";
const route = "assets/visuals-07/novel-bg-coastal-venue-v2.png";

assert.equal(story.storyVersion, 10);
assert.deepEqual(story.scenes.map((scene) => scene.id), expectedSceneIds);
assert.deepEqual(story.scenes.map((scene) => scene.steps.length), expectedCounts);
assert.deepEqual(backgroundCues.sceneIds, expectedSceneIds);
assert.deepEqual(backgroundCues.expectedSceneCounts, Object.fromEntries(expectedSceneIds.map((id, index) => [id, expectedCounts[index]])));
assert.equal(backgroundCues.productionYear.length, 0, "legacy production registry must be empty");

const expectedBoundaries = [
  ["festival_concept", 1, 76, "festival-concept-exhibition", exhibition],
  ["map_mode01", 1, 43, "map01-exhibition", exhibition],
  ["gx_experience", 1, 58, "gx-exhibition", exhibition],
  ["esp32_pitch", 1, 43, "esp32-exhibition", exhibition],
  ["circle_invitation", 1, 81, "circle-invitation-exhibition", exhibition],
  ["welcome_chat", 1, 54, "welcome-wide-chat", exhibition],
  ["welcome_chat", 55, 77, "welcome-physical-exhibition", exhibition],
  ["welcome_chat", 78, 95, "welcome-mobile-route", route],
];

assert.equal(backgroundCues.limitedStory.length, expectedBoundaries.length);
for (let index = 0; index < expectedBoundaries.length; index += 1) {
  const [sceneId, from, to, id, assetPath] = expectedBoundaries[index];
  const cue = backgroundCues.limitedStory[index];
  assert.deepEqual([cue.sceneId, cue.from, cue.to, cue.id, cue.assetPath], [sceneId, from, to, id, assetPath]);
  if (index > 0 && expectedBoundaries[index - 1][0] === sceneId) {
    assert.equal(from, expectedBoundaries[index - 1][2] + 1, `${id}: background ranges overlap or leave a gap`);
  }
}

const allSteps = story.scenes.flatMap((scene) => scene.steps);
const resolved = allSteps.map((step) => ({ step, cue: backgroundCues.forStep(step) }));
assert.equal(resolved.length, 396);
assert(resolved.every(({ cue }) => Boolean(cue?.assetPath)), "every contest step must resolve to a background");
assert.equal(resolved.filter(({ cue }) => cue.assetPath === exhibition).length, 378);
assert.equal(resolved.filter(({ cue }) => cue.assetPath === route).length, 18);

for (const assetPath of new Set(resolved.map(({ cue }) => cue.assetPath))) {
  assert(assetPath.startsWith("assets/visuals-07/"), `background escaped approved assets: ${assetPath}`);
  await access(path.join(projectRoot, assetPath));
}

const cue = (stepId) => backgroundCues.forStep(allSteps.find((step) => step.id === stepId));
assert.equal(cue("festival_concept_001").assetPath, exhibition);
assert.equal(cue("circle_invitation_081").assetPath, exhibition);
assert.equal(cue("welcome_chat_054").id, "welcome-wide-chat");
assert.equal(cue("welcome_chat_055").id, "welcome-physical-exhibition");
assert.equal(cue("welcome_chat_077").assetPath, exhibition);
assert.equal(cue("welcome_chat_078").assetPath, route);
assert.equal(cue("welcome_chat_095").assetPath, route);
assert.throws(() => backgroundCues.forStep({ sceneId: "welcome_chat", id: "welcome_chat_999" }), /Missing contest-v10 background cue/);
assert.throws(() => backgroundCues.forStep({ sceneId: "unknown", id: "unknown_001" }), /Unknown contest-v10 background scene/);

console.log(JSON.stringify({
  status: "passed",
  storyVersion: story.storyVersion,
  scenes: story.scenes.length,
  steps: resolved.length,
  cues: backgroundCues.limitedStory.length,
  assets: [...new Set(resolved.map(({ cue }) => cue.assetPath))],
  welcomeBoundaries: ["001-054 wide", "055-077 physical", "078-095 route/mobile"],
}, null, 2));
