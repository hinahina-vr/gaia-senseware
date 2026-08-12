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
const assets = Object.freeze({
  campus: "assets/visuals-07/zushi-campus-story-bg-v4.webp",
  entrance: "assets/visuals-07/novel-bg-coastal-venue-v3.png",
  firstEncounter: "assets/visuals-07/event-cg-first-encounter-v1.png",
  boothWide: "assets/visuals-07/novel-bg-exhibition-v2.png",
  boothClose: "assets/visuals-07/novel-bg-exhibition-v3.png",
  circleWelcome: "assets/visuals-07/event-cg-circle-welcome-v1.png",
  onlineNight: "assets/visuals-07/novel-bg-online-night-v2.png",
  venue: "assets/visuals-07/novel-bg-coastal-venue-v2.png",
  finale: "assets/visuals-07/event-cg-exhibition-finale-v1.png",
});

assert.equal(story.storyVersion, 10);
assert.deepEqual(story.scenes.map((scene) => scene.id), expectedSceneIds);
assert.deepEqual(story.scenes.map((scene) => scene.steps.length), expectedCounts);
assert.deepEqual(backgroundCues.sceneIds, expectedSceneIds);
assert.deepEqual(backgroundCues.expectedSceneCounts, Object.fromEntries(expectedSceneIds.map((id, index) => [id, expectedCounts[index]])));
assert.equal(backgroundCues.productionYear.length, 0, "legacy production registry must be empty");

const expectedBoundaries = [
  ["festival_concept", 1, 7, "festival-campus-entrance", assets.campus, "drift-right", "scenic"],
  ["festival_concept", 8, 14, "festival-exhibition-entrance", assets.entrance, "push-in", "scenic"],
  ["festival_concept", 15, 26, "festival-first-encounter-cg", assets.firstEncounter, "event-focus", "event-cg"],
  ["festival_concept", 27, 76, "festival-gaia-booth", assets.boothWide, "drift-left", "scenic"],
  ["map_mode01", 1, 43, "map01-terminal-booth", assets.boothWide, "push-in", "scenic"],
  ["gx_experience", 1, 58, "gx-terminal-booth", assets.boothClose, "drift-right", "scenic"],
  ["esp32_pitch", 1, 43, "esp32-exhibition", assets.boothWide, "drift-left", "scenic"],
  ["circle_invitation", 1, 47, "circle-closing-exhibition", assets.boothClose, "push-in", "scenic"],
  ["circle_invitation", 48, 69, "circle-welcome-cg", assets.circleWelcome, "event-focus", "event-cg"],
  ["circle_invitation", 70, 81, "circle-after-welcome", assets.boothClose, "drift-right", "scenic"],
  ["welcome_chat", 1, 54, "welcome-wide-night", assets.onlineNight, "drift-left", "scenic"],
  ["welcome_chat", 55, 77, "welcome-physical-venue", assets.venue, "push-in", "scenic"],
  ["welcome_chat", 78, 91, "welcome-closing-exhibition", assets.boothClose, "push-in", "scenic"],
  ["welcome_chat", 92, 95, "welcome-exhibition-finale-cg", assets.finale, "event-focus", "event-cg"],
];

assert.equal(backgroundCues.limitedStory.length, expectedBoundaries.length);
for (let index = 0; index < expectedBoundaries.length; index += 1) {
  const [sceneId, from, to, id, assetPath, motion, presentation] = expectedBoundaries[index];
  const cue = backgroundCues.limitedStory[index];
  assert.deepEqual(
    [cue.sceneId, cue.from, cue.to, cue.id, cue.assetPath, cue.motion, cue.presentation || "scenic"],
    [sceneId, from, to, id, assetPath, motion, presentation],
  );
  if (index > 0 && expectedBoundaries[index - 1][0] === sceneId) {
    assert.equal(from, expectedBoundaries[index - 1][2] + 1, `${id}: background ranges overlap or leave a gap`);
  }
}

const allSteps = story.scenes.flatMap((scene) => scene.steps);
const resolved = allSteps.map((step) => ({ step, cue: backgroundCues.forStep(step) }));
assert.equal(resolved.length, 396);
assert(resolved.every(({ cue }) => Boolean(cue?.assetPath)), "every contest step must resolve to a background");
assert(resolved.every(({ cue }) => Boolean(cue?.motion)), "every contest step must resolve to background motion");
assert.equal(new Set(resolved.map(({ cue }) => cue.assetPath)).size, 9, "exhibition-finale cut must use nine distinct scene assets");
assert.equal(resolved.filter(({ cue }) => cue.presentation === "event-cg").length, 38);

for (const assetPath of new Set(resolved.map(({ cue }) => cue.assetPath))) {
  assert(assetPath.startsWith("assets/visuals-07/"), `background escaped approved assets: ${assetPath}`);
  await access(path.join(projectRoot, assetPath));
}

const cue = (stepId) => backgroundCues.forStep(allSteps.find((step) => step.id === stepId));
assert.equal(cue("festival_concept_001").assetPath, assets.campus);
assert.equal(cue("festival_concept_008").assetPath, assets.entrance);
assert.equal(cue("festival_concept_015").presentation, "event-cg");
assert.equal(cue("festival_concept_027").assetPath, assets.boothWide);
assert.equal(cue("circle_invitation_047").assetPath, assets.boothClose);
assert.equal(cue("circle_invitation_048").presentation, "event-cg");
assert.equal(cue("circle_invitation_070").assetPath, assets.boothClose);
assert.equal(cue("welcome_chat_054").id, "welcome-wide-night");
assert.equal(cue("welcome_chat_055").id, "welcome-physical-venue");
assert.equal(cue("welcome_chat_077").assetPath, assets.venue);
assert.equal(cue("welcome_chat_078").assetPath, assets.boothClose);
assert.equal(cue("welcome_chat_091").assetPath, assets.boothClose);
assert.equal(cue("welcome_chat_092").presentation, "event-cg");
assert.equal(cue("welcome_chat_095").assetPath, assets.finale);
assert.throws(() => backgroundCues.forStep({ sceneId: "welcome_chat", id: "welcome_chat_999" }), /Missing contest-v10 background cue/);
assert.throws(() => backgroundCues.forStep({ sceneId: "unknown", id: "unknown_001" }), /Unknown contest-v10 background scene/);

console.log(JSON.stringify({
  status: "passed",
  storyVersion: story.storyVersion,
  scenes: story.scenes.length,
  steps: resolved.length,
  cues: backgroundCues.limitedStory.length,
  assets: [...new Set(resolved.map(({ cue }) => cue.assetPath))],
  eventCgSteps: resolved.filter(({ cue }) => cue.presentation === "event-cg").length,
  welcomeBoundaries: ["001-054 wide/night", "055-077 physical/venue", "078-091 closing exhibition/mobile", "092-095 exhibition finale CG"],
}, null, 2));
