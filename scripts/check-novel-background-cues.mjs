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
  entrance: "assets/visuals-07/novel-bg-coastal-venue-v3.png",
  bHallOverview: "assets/visuals-07/novel-bg-festival-b-hall-overview-v1.png",
  fivePlaneProjection: "assets/visuals-07/novel-bg-festival-five-plane-projection-v1.png",
  boothClose: "assets/visuals-07/novel-bg-exhibition-v3.png",
  boothWide: "assets/visuals-07/novel-bg-exhibition-v2.png",
  firstEncounter: "assets/visuals-07/event-cg-first-encounter-v1.png",
  amaneCloseup: "assets/visuals-07/event-cg-amane-closeup-v1.png",
  mizuhaCloseup: "assets/visuals-07/event-cg-mizuha-closeup-v1.png",
  tenWindows: "assets/concept/concept-02-ten-windows.png",
  modeMap: "assets/visuals-07/mode-map-v1.webp",
  modis: "assets/data/modis-land-cover-2023.png",
  system: "assets/architecture/gaia-system-architecture.png",
  chapterFlow: "assets/visuals-07/data-chapter-flow-v1.webp",
  abstract: "assets/visuals-07/mode-abstract-v1.webp",
  memory: "assets/concept/concept-03-touch-becomes-memory.png",
  observatory: "assets/architecture/observatory-architecture-v2.png",
  partner: "assets/concept/concept-01-earth-as-partner.png",
  esp32Collaboration: "assets/visuals-07/event-cg-esp32-collaboration-v1.png",
  future: "assets/concept/concept-04-co-created-future.png",
  shared: "assets/visuals-07/novel-background-v1.webp",
  circleWelcome: "assets/visuals-07/event-cg-circle-welcome-v1.png",
  onlineNight: "assets/visuals-07/novel-bg-online-night-v2.png",
  productionNight: "assets/visuals-07/novel-bg-production-night-v2.png",
  venue: "assets/visuals-07/novel-bg-coastal-venue-v2.png",
  coastNight: "assets/visuals-07/novel-bg-zushi-coast-night-v2.png",
  finale: "assets/visuals-07/event-cg-exhibition-finale-v1.png",
});

assert.equal(story.storyVersion, 10);
assert.deepEqual(story.scenes.map((scene) => scene.id), expectedSceneIds);
assert.deepEqual(story.scenes.map((scene) => scene.steps.length), expectedCounts);
assert.deepEqual(backgroundCues.sceneIds, expectedSceneIds);
assert.deepEqual(backgroundCues.expectedSceneCounts, Object.fromEntries(expectedSceneIds.map((id, index) => [id, expectedCounts[index]])));
assert.equal(backgroundCues.productionYear.length, 0, "legacy production registry must be empty");

const expectedBoundaries = [
  ["festival_concept", 1, 7, "festival-main-entrance-reception", assets.entrance, "push-in", "scenic"],
  ["festival_concept", 8, 9, "festival-b-hall-overview", assets.bHallOverview, "push-in", "scenic"],
  ["festival_concept", 10, 12, "festival-gaia-five-plane-projection", assets.fivePlaneProjection, "push-in", "scenic"],
  ["festival_concept", 13, 14, "festival-gaia-booth-approach", assets.boothClose, "drift-left", "scenic"],
  ["festival_concept", 15, 20, "festival-first-encounter-cg", assets.firstEncounter, "event-focus", "event-cg"],
  ["festival_concept", 21, 22, "festival-amane-closeup-cg", assets.amaneCloseup, "event-focus", "event-cg"],
  ["festival_concept", 23, 26, "festival-mizuha-closeup-cg", assets.mizuhaCloseup, "event-focus", "event-cg"],
  ["festival_concept", 27, 31, "festival-gaia-booth-conversation", assets.boothWide, "drift-left", "scenic"],
  ["festival_concept", 32, 35, "festival-amane-response-closeup-cg", assets.amaneCloseup, "event-focus", "event-cg"],
  ["festival_concept", 36, 37, "festival-mizuha-response-closeup-cg", assets.mizuhaCloseup, "event-focus", "event-cg"],
  ["festival_concept", 38, 46, "festival-gaia-booth-conversation-return", assets.boothWide, "drift-left", "scenic"],
  ["festival_concept", 47, 61, "festival-gaia-booth-explanation", assets.boothClose, "drift-right", "scenic"],
  ["festival_concept", 62, 71, "festival-ten-senses", assets.tenWindows, "push-in", "scenic"],
  ["festival_concept", 72, 76, "festival-map-transition", assets.modeMap, "push-in", "scenic"],
  ["map_mode01", 1, 14, "map01-co2-observation", assets.modeMap, "drift-right", "scenic"],
  ["map_mode01", 15, 28, "map01-temperature-observation", assets.modis, "push-in", "scenic"],
  ["map_mode01", 29, 40, "map01-data-architecture", assets.system, "drift-left", "scenic"],
  ["map_mode01", 41, 43, "map01-exhibition-return", assets.boothWide, "drift-right", "scenic"],
  ["gx_experience", 1, 16, "gx-ocean-entry", assets.chapterFlow, "push-in", "scenic"],
  ["gx_experience", 17, 29, "gx-ancient-ocean", assets.abstract, "drift-right", "scenic"],
  ["gx_experience", 30, 41, "gx-coevolution", assets.memory, "drift-left", "scenic"],
  ["gx_experience", 42, 44, "gx-present-return", assets.observatory, "push-in", "scenic"],
  ["gx_experience", 45, 54, "gx-human-choice", assets.partner, "drift-right", "scenic"],
  ["gx_experience", 55, 58, "gx-ten-mode-gateway", assets.tenWindows, "push-in", "scenic"],
  ["esp32_pitch", 1, 7, "esp32-exhibition-opening", assets.boothWide, "drift-left", "scenic"],
  ["esp32_pitch", 8, 18, "esp32-collaboration-cg", assets.esp32Collaboration, "event-focus", "event-cg"],
  ["esp32_pitch", 19, 26, "esp32-system-design", assets.system, "drift-left", "scenic"],
  ["esp32_pitch", 27, 38, "esp32-co-created-prototype", assets.future, "drift-right", "scenic"],
  ["esp32_pitch", 39, 43, "esp32-exhibition-return", assets.boothWide, "push-in", "scenic"],
  ["circle_invitation", 1, 10, "circle-closing-exhibition", assets.boothClose, "push-in", "scenic"],
  ["circle_invitation", 11, 28, "circle-private-invitation", assets.boothWide, "drift-left", "scenic"],
  ["circle_invitation", 29, 47, "circle-shared-future", assets.shared, "drift-right", "scenic"],
  ["circle_invitation", 48, 69, "circle-welcome-cg", assets.circleWelcome, "event-focus", "event-cg"],
  ["circle_invitation", 70, 81, "circle-after-welcome", assets.boothClose, "drift-right", "scenic"],
  ["welcome_chat", 1, 20, "welcome-online-arrival", assets.onlineNight, "drift-left", "scenic"],
  ["welcome_chat", 21, 40, "welcome-online-esp32-thread", assets.productionNight, "drift-right", "scenic"],
  ["welcome_chat", 41, 54, "welcome-co-created-future", assets.future, "push-in", "scenic"],
  ["welcome_chat", 55, 68, "welcome-physical-booth", assets.boothWide, "drift-left", "scenic"],
  ["welcome_chat", 69, 73, "welcome-booth-packdown", assets.boothClose, "drift-right", "scenic"],
  ["welcome_chat", 74, 83, "welcome-night-exit-mobile", assets.coastNight, "drift-left", "scenic"],
  ["welcome_chat", 84, 91, "welcome-earth-partner-reflection", assets.partner, "push-in", "scenic"],
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
assert.equal(new Set(resolved.map(({ cue }) => cue.assetPath)).size, 25, "background-art cut must use twenty-five distinct scene assets");
assert.equal(resolved.filter(({ cue }) => cue.presentation === "event-cg").length, 55);

assert.equal(backgroundCues.gallery.length, 6, "CG album must define six collectible event images");
assert.equal(new Set(backgroundCues.gallery.map((entry) => entry.id)).size, 6, "CG album IDs must be unique");
assert.equal(new Set(backgroundCues.gallery.map((entry) => entry.assetPath)).size, 6, "each album entry must have a distinct image");
for (const entry of backgroundCues.gallery) {
  assert(allSteps.some((step) => step.id === entry.unlockStepId), `${entry.id}: unlock step must exist`);
  assert(resolved.some(({ step, cue: resolvedCue }) => step.id === entry.unlockStepId && resolvedCue.galleryId === entry.id), `${entry.id}: unlock cue must map back to album entry`);
  await access(path.join(projectRoot, entry.assetPath));
}

for (const assetPath of new Set(resolved.map(({ cue }) => cue.assetPath))) {
  assert(assetPath.startsWith("assets/"), `background escaped approved assets: ${assetPath}`);
  await access(path.join(projectRoot, assetPath));
}

const cue = (stepId) => backgroundCues.forStep(allSteps.find((step) => step.id === stepId));
assert.equal(cue("festival_concept_001").assetPath, assets.entrance);
assert.equal(cue("festival_concept_008").assetPath, assets.bHallOverview);
assert.equal(cue("festival_concept_009").assetPath, assets.bHallOverview);
assert.equal(cue("festival_concept_010").assetPath, assets.fivePlaneProjection);
assert.equal(cue("festival_concept_011").assetPath, assets.fivePlaneProjection);
assert.equal(cue("festival_concept_012").assetPath, assets.fivePlaneProjection);
assert.equal(cue("festival_concept_013").assetPath, assets.boothClose);
assert.equal(cue("festival_concept_014").assetPath, assets.boothClose);
assert.equal(cue("festival_concept_015").presentation, "event-cg");
assert.equal(cue("festival_concept_019").assetPath, assets.firstEncounter);
assert.equal(cue("festival_concept_021").assetPath, assets.amaneCloseup);
assert.equal(cue("festival_concept_023").assetPath, assets.mizuhaCloseup);
assert.equal(cue("festival_concept_027").assetPath, assets.boothWide);
assert.equal(cue("festival_concept_031").assetPath, assets.boothWide);
assert.equal(cue("festival_concept_032").assetPath, assets.amaneCloseup);
assert.equal(cue("festival_concept_036").assetPath, assets.mizuhaCloseup);
assert.equal(cue("festival_concept_062").assetPath, assets.tenWindows);
assert.equal(cue("map_mode01_015").assetPath, assets.modis);
assert.equal(cue("gx_experience_017").assetPath, assets.abstract);
assert.equal(cue("esp32_pitch_007").assetPath, assets.boothWide);
assert.equal(cue("esp32_pitch_008").assetPath, assets.esp32Collaboration);
assert.equal(cue("esp32_pitch_019").assetPath, assets.system);
assert.equal(cue("circle_invitation_047").assetPath, assets.shared);
assert.equal(cue("circle_invitation_048").presentation, "event-cg");
assert.equal(cue("circle_invitation_070").assetPath, assets.boothClose);
assert.equal(cue("welcome_chat_020").id, "welcome-online-arrival");
assert.equal(cue("welcome_chat_021").id, "welcome-online-esp32-thread");
assert.equal(cue("welcome_chat_055").id, "welcome-physical-booth");
assert.equal(cue("welcome_chat_074").assetPath, assets.coastNight);
assert.equal(cue("welcome_chat_091").assetPath, assets.partner);
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
  gallery: backgroundCues.gallery.map(({ id, unlockStepId }) => ({ id, unlockStepId })),
  welcomeBoundaries: ["001-020 online arrival", "021-040 online ESP32", "041-054 future concept", "055-073 physical venue", "074-083 mobile/night exit", "084-091 reflection", "092-095 finale CG"],
}, null, 2));
