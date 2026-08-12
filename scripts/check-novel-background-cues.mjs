import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { access, readFile } from "node:fs/promises";
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
  projectionConversation: "assets/visuals-07/novel-bg-festival-projection-conversation-v1.png",
  firstEncounter: "assets/visuals-07/event-cg-first-encounter-five-plane-v2.png",
  amaneCloseup: "assets/visuals-07/event-cg-amane-closeup-five-plane-v2.png",
  mizuhaCloseup: "assets/visuals-07/event-cg-mizuha-closeup-five-plane-v2.png",
  mapTransition: "assets/visuals-07/event-cg-festival-map-transition-five-plane-v2.png",
  tenWindows: "assets/concept/concept-02-ten-windows.png",
  modeMap: "assets/visuals-07/mode-map-v1.webp",
  modis: "assets/data/modis-land-cover-2023.png",
  system: "assets/architecture/gaia-system-architecture.png",
  gxAncientOcean: "assets/visuals-07/novel-bg-gx-ancient-ocean-five-plane-v1.png",
  abstract: "assets/visuals-07/mode-abstract-v1.webp",
  gxBreathingPoints: "assets/visuals-07/novel-bg-gx-breathing-points-five-plane-v1.png",
  observatory: "assets/architecture/observatory-architecture-v2.png",
  partner: "assets/concept/concept-01-earth-as-partner.png",
  gxTemperatureAnomaly: "assets/visuals-07/novel-bg-gx-temperature-anomaly-five-plane-v1.png",
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
const approvedAssetHashes = Object.freeze({
  [assets.firstEncounter]: "b6b51146df739b3150f5c0d126e53eb5f85f471ec788ba74de65e09d272a1c10",
  [assets.amaneCloseup]: "f7a0eaacaca94dc8d52ffbdc626ecb5a2a5535ba433319b71194d3e06a5ea967",
  [assets.mizuhaCloseup]: "0ad34c323b01a9f51e3bab9a7f7d30a2dd2be3f99a30b4e9657717bf8e1e3544",
  [assets.mapTransition]: "1702eaba7fdabf3b916c437743dbb3e2d0482d937e2090b7fa54598f6142438a",
  [assets.gxAncientOcean]: "b7529e8e40e7100a00359c51180a6d943d331e229170c82192c71877fd32ad45",
  [assets.gxBreathingPoints]: "20b7d0534c48ecf96b598d87ac5a23d00409f89ce08edc396689af4adf2a3188",
  [assets.gxTemperatureAnomaly]: "98ac244431d127b46638e5fe4a706693d1095d39b55e4e81063cb6e05dc05052",
});
const sha256 = async (assetPath) => createHash("sha256")
  .update(await readFile(path.join(projectRoot, assetPath)))
  .digest("hex");

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
  ["festival_concept", 27, 75, "festival-gaia-booth-conversation", assets.projectionConversation, "drift-left", "scenic"],
  ["festival_concept", 76, 76, "festival-map-transition", assets.mapTransition, "event-focus", "event-cg"],
  ["map_mode01", 1, 14, "map01-co2-observation", assets.modeMap, "drift-right", "scenic"],
  ["map_mode01", 15, 28, "map01-temperature-observation", assets.modis, "push-in", "scenic"],
  ["map_mode01", 29, 40, "map01-data-architecture", assets.system, "drift-left", "scenic"],
  ["map_mode01", 41, 43, "map01-exhibition-return", assets.boothWide, "drift-right", "scenic"],
  ["gx_experience", 1, 16, "gx-ocean-entry", assets.gxAncientOcean, "push-in", "scenic"],
  ["gx_experience", 17, 29, "gx-ancient-ocean", assets.abstract, "drift-right", "scenic"],
  ["gx_experience", 30, 41, "gx-coevolution", assets.gxBreathingPoints, "drift-left", "scenic"],
  ["gx_experience", 42, 44, "gx-present-return", assets.observatory, "push-in", "scenic"],
  ["gx_experience", 45, 54, "gx-human-choice", assets.gxTemperatureAnomaly, "drift-right", "scenic"],
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
assert.equal(new Set(resolved.map(({ cue }) => cue.assetPath)).size, 28, "background-art cut must use twenty-eight distinct scene assets");
assert.equal(resolved.filter(({ cue }) => cue.presentation === "event-cg").length, 50);

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

for (const [assetPath, expectedHash] of Object.entries(approvedAssetHashes)) {
  assert.equal(await sha256(assetPath), expectedHash, `${assetPath}: approved asset bytes changed`);
}

const festivalResolved = resolved.filter(({ step }) => step.sceneId === "festival_concept");
const festivalAfterEncounter = festivalResolved.filter(({ step }) => {
  const number = Number(step.id.slice(-3));
  return number >= 27 && number <= 75;
});
assert(festivalAfterEncounter.every(({ cue: resolvedCue }) => resolvedCue.assetPath === assets.projectionConversation));
assert.equal(festivalResolved.find(({ step }) => step.id === "festival_concept_076")?.cue.assetPath, assets.mapTransition);
const forbiddenFestivalAssets = [
  "assets/visuals-07/novel-bg-exhibition-v2.png",
  "assets/visuals-07/mode-map-v1.webp",
  "assets/concept/concept-02-ten-windows.png",
];
assert(festivalResolved.slice(26).every(({ cue: resolvedCue }) => !forbiddenFestivalAssets.includes(resolvedCue.assetPath)), "festival 027-076 still references a superseded fantasy/flat asset");
assert(resolved.every(({ cue: resolvedCue }) => !/portrait/iu.test(resolvedCue.assetPath)), "mobile portrait asset must never be requested");

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
assert.equal(cue("festival_concept_027").assetPath, assets.projectionConversation);
assert.equal(cue("festival_concept_063").assetPath, assets.projectionConversation);
assert.equal(cue("festival_concept_075").assetPath, assets.projectionConversation);
assert.equal(cue("festival_concept_076").assetPath, assets.mapTransition);
assert.equal(cue("festival_concept_076").presentation, "event-cg");
assert.equal(cue("map_mode01_015").assetPath, assets.modis);
assert.equal(cue("gx_experience_017").assetPath, assets.abstract);
assert.equal(cue("gx_experience_011").assetPath, assets.gxAncientOcean);
assert.equal(cue("gx_experience_030").assetPath, assets.gxBreathingPoints);
assert.equal(cue("gx_experience_054").assetPath, assets.gxTemperatureAnomaly);
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
