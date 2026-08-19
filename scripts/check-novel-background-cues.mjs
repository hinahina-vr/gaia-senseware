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
  map01Provenance: "assets/visuals-07/novel-bg-map01-data-provenance-five-plane-v1.png",
  system: "assets/architecture/gaia-system-architecture.png",
  gxAncientOcean: "assets/visuals-07/novel-bg-gx-ancient-ocean-five-plane-v1.png",
  abstract: "assets/visuals-07/mode-abstract-v1.webp",
  gxBreathingPoints: "assets/visuals-07/novel-bg-gx-breathing-points-five-plane-v1.png",
  observatory: "assets/architecture/observatory-architecture-v2.png",
  partner: "assets/concept/concept-01-earth-as-partner.png",
  gxTemperatureAnomaly: "assets/visuals-07/novel-bg-gx-temperature-anomaly-five-plane-v1.png",
  gxModeGateway: "assets/visuals-07/novel-bg-gx-mode-gateway-five-plane-v2.png",
  esp32Collaboration: "assets/visuals-07/event-cg-esp32-collaboration-v1.png",
  future: "assets/concept/concept-04-co-created-future.png",
  shared: "assets/visuals-07/novel-background-v1.webp",
  circleWelcome: "assets/visuals-07/event-cg-circle-welcome-v1.png",
  circleInvitationCard: "assets/visuals-07/event-cg-circle-invitation-card-v2.png",
  onlineNight: "assets/visuals-07/novel-bg-online-night-v2.png",
  productionNight: "assets/visuals-07/novel-bg-production-night-v2.png",
  venue: "assets/visuals-07/novel-bg-coastal-venue-v2.png",
  coastNight: "assets/visuals-07/novel-bg-zushi-coast-night-v2.png",
  finale: "assets/visuals-07/event-cg-exhibition-finale-v1.png",
});
const approvedAssetHashes = Object.freeze({
  [assets.entrance]: "d74de25f0db8f94602bccd2e34bd76848bc93b37ef2612bcc714d8b2fb105d09",
  [assets.bHallOverview]: "9e7511c2b7c201d4cfa381fc60cee67db2c7d65b2ea31dcbfdb0b74cb6b09b2b",
  [assets.fivePlaneProjection]: "d9d791231fcd6c4e0f18a0b61176e26d40e858e6c750238a76838b96a6f908a6",
  [assets.boothClose]: "9b40f633dcb6a6e5393e5b211d107d607a3c235c8d4e4f5817509823de1ec510",
  [assets.boothWide]: "84dd216e66ca181b859303bf2d769b90b3711c8c8b9faa8b0b3ff4cafaa6281a",
  [assets.firstEncounter]: "b6b51146df739b3150f5c0d126e53eb5f85f471ec788ba74de65e09d272a1c10",
  [assets.amaneCloseup]: "f7a0eaacaca94dc8d52ffbdc626ecb5a2a5535ba433319b71194d3e06a5ea967",
  [assets.mizuhaCloseup]: "0ad34c323b01a9f51e3bab9a7f7d30a2dd2be3f99a30b4e9657717bf8e1e3544",
  [assets.mapTransition]: "1702eaba7fdabf3b916c437743dbb3e2d0482d937e2090b7fa54598f6142438a",
  [assets.gxAncientOcean]: "8efd0de8a9d756ac8d4b20d69871f4ff1b1b7dec917c812dde55e6f39ae3da7f",
  [assets.gxBreathingPoints]: "c2fd98293f53d9c4390f8cf6ceaf1f7d329cf6d2b27bbe1647dc476111311495",
  [assets.gxTemperatureAnomaly]: "e2dcae00e0ce417f99768214e7694690386f60cc1f4b61eb90c91e6d21fb1dae",
  [assets.map01Provenance]: "4b739542ed246c13862236fc135e8eccbd482ad2c853865a067257cd33fa9a29",
  [assets.gxModeGateway]: "87183da72698185baa3874548b1fa7c2e8d1baca5c265d547e0ba7bd280961db",
  [assets.coastNight]: "a99ec8e9d9c4f03667c44fdd9e8d581f78c6e8de4468572c038d126d8ef82643",
  [assets.circleInvitationCard]: "9110b5fde651e6c31a8f9fbe63d723334a6ec05dc8cd8deb92b49ec069c7ae7a",
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
  ["festival_concept", 13, 14, "festival-gaia-booth-approach", assets.fivePlaneProjection, "drift-left", "scenic"],
  ["festival_concept", 15, 20, "festival-first-encounter-cg", assets.firstEncounter, "event-focus", "event-cg"],
  ["festival_concept", 21, 22, "festival-amane-closeup-cg", assets.amaneCloseup, "event-focus", "event-cg"],
  ["festival_concept", 23, 26, "festival-mizuha-closeup-cg", assets.mizuhaCloseup, "event-focus", "event-cg"],
  ["festival_concept", 27, 75, "festival-gaia-booth-conversation", assets.fivePlaneProjection, "drift-left", "scenic"],
  ["festival_concept", 76, 76, "festival-map-transition", assets.mapTransition, "event-focus", "event-cg"],
  ["map_mode01", 1, 14, "map01-co2-observation", assets.modeMap, "drift-right", "scenic"],
  ["map_mode01", 15, 28, "map01-temperature-observation", assets.modis, "push-in", "scenic"],
  ["map_mode01", 29, 40, "map01-data-provenance", assets.map01Provenance, "drift-left", "scenic"],
  ["map_mode01", 41, 43, "map01-exhibition-return", assets.fivePlaneProjection, "drift-right", "scenic"],
  ["gx_experience", 1, 16, "gx-ocean-entry", assets.gxAncientOcean, "push-in", "scenic"],
  ["gx_experience", 17, 17, "gx-native-deep-time", assets.boothClose, "drift-right", "scenic"],
  ["gx_experience", 18, 18, "gx-exhibition-return", assets.fivePlaneProjection, "push-in", "scenic"],
  ["gx_experience", 19, 29, "gx-ancient-ocean", assets.abstract, "drift-right", "scenic"],
  ["gx_experience", 30, 41, "gx-coevolution", assets.gxBreathingPoints, "drift-left", "scenic"],
  ["gx_experience", 42, 44, "gx-present-return", assets.observatory, "push-in", "scenic"],
  ["gx_experience", 45, 54, "gx-human-choice", assets.gxTemperatureAnomaly, "drift-right", "scenic"],
  ["gx_experience", 55, 58, "gx-ten-mode-gateway", assets.gxModeGateway, "push-in", "scenic"],
  ["esp32_pitch", 1, 7, "esp32-exhibition-opening", assets.fivePlaneProjection, "drift-left", "scenic"],
  ["esp32_pitch", 8, 18, "esp32-exhibition-proposal", assets.fivePlaneProjection, "drift-right", "scenic"],
  ["esp32_pitch", 19, 26, "esp32-system-design", assets.system, "drift-left", "scenic"],
  ["esp32_pitch", 27, 38, "esp32-co-created-prototype", assets.fivePlaneProjection, "drift-right", "scenic"],
  ["esp32_pitch", 39, 43, "esp32-exhibition-return", assets.fivePlaneProjection, "push-in", "scenic"],
  ["circle_invitation", 1, 10, "circle-closing-exhibition", assets.fivePlaneProjection, "push-in", "scenic"],
  ["circle_invitation", 11, 28, "circle-private-invitation", assets.boothWide, "drift-left", "scenic"],
  ["circle_invitation", 29, 47, "circle-invitation-card-cg", assets.circleInvitationCard, "event-focus", "event-cg"],
  ["circle_invitation", 48, 69, "circle-welcome-cg", assets.circleWelcome, "event-focus", "event-cg"],
  ["circle_invitation", 70, 81, "circle-after-welcome", assets.boothClose, "drift-right", "scenic"],
  ["welcome_chat", 1, 20, "welcome-online-arrival", assets.fivePlaneProjection, "drift-left", "scenic"],
  ["welcome_chat", 21, 40, "welcome-online-esp32-thread", assets.fivePlaneProjection, "drift-right", "scenic"],
  ["welcome_chat", 41, 54, "welcome-co-created-future", assets.fivePlaneProjection, "push-in", "scenic"],
  ["welcome_chat", 55, 68, "welcome-physical-booth", assets.fivePlaneProjection, "drift-left", "scenic"],
  ["welcome_chat", 69, 73, "welcome-booth-packdown", assets.fivePlaneProjection, "drift-right", "scenic"],
  ["welcome_chat", 74, 83, "welcome-night-exit-mobile", assets.coastNight, "drift-left", "scenic"],
  ["welcome_chat", 84, 91, "welcome-earth-partner-reflection", assets.fivePlaneProjection, "push-in", "scenic"],
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
assert.equal(new Set(resolved.map(({ cue }) => cue.assetPath)).size, 23, "background-art cut must use twenty-three distinct scene assets");
assert.equal(resolved.filter(({ cue }) => cue.presentation === "event-cg").length, 58);

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
assert(festivalAfterEncounter.every(({ cue: resolvedCue }) => resolvedCue.assetPath === assets.fivePlaneProjection));
assert.equal(festivalResolved.find(({ step }) => step.id === "festival_concept_076")?.cue.assetPath, assets.mapTransition);
const forbiddenFestivalAssets = [
  "assets/visuals-07/novel-bg-exhibition-v2.png",
  "assets/visuals-07/mode-map-v1.webp",
  "assets/concept/concept-02-ten-windows.png",
];
assert(festivalResolved.slice(26).every(({ cue: resolvedCue }) => !forbiddenFestivalAssets.includes(resolvedCue.assetPath)), "festival 027-076 still references a superseded fantasy/flat asset");
assert(resolved.every(({ cue: resolvedCue }) => !/portrait/iu.test(resolvedCue.assetPath)), "mobile portrait asset must never be requested");

const forbiddenConsistencyAssets = new Set([
  assets.boothClose,
  assets.boothWide,
  assets.projectionConversation,
  assets.onlineNight,
  assets.productionNight,
  assets.future,
  assets.partner,
]);
const boothRanges = [
  ["festival_concept", 13, 14],
  ["festival_concept", 27, 75],
  ["map_mode01", 41, 43],
  ["welcome_chat", 1, 73],
  ["welcome_chat", 84, 91],
];
for (const [sceneId, from, to] of boothRanges) {
  const range = resolved.filter(({ step }) => {
    const number = Number(step.id.slice(-3));
    return step.sceneId === sceneId && number >= from && number <= to;
  });
  assert.equal(range.length, to - from + 1, `${sceneId} ${from}-${to}: audited booth range is incomplete`);
  assert(range.every(({ cue: resolvedCue }) => resolvedCue.assetPath === assets.fivePlaneProjection), `${sceneId} ${from}-${to}: canonical booth asset mismatch`);
  assert(range.every(({ cue: resolvedCue }) => !forbiddenConsistencyAssets.has(resolvedCue.assetPath)), `${sceneId} ${from}-${to}: forbidden inconsistent asset remains`);
}

const cue = (stepId) => backgroundCues.forStep(allSteps.find((step) => step.id === stepId));
assert.equal(cue("festival_concept_001").assetPath, assets.entrance);
assert.equal(cue("festival_concept_008").assetPath, assets.bHallOverview);
assert.equal(cue("festival_concept_009").assetPath, assets.bHallOverview);
assert.equal(cue("festival_concept_010").assetPath, assets.fivePlaneProjection);
assert.equal(cue("festival_concept_011").assetPath, assets.fivePlaneProjection);
assert.equal(cue("festival_concept_012").assetPath, assets.fivePlaneProjection);
assert.equal(cue("festival_concept_013").assetPath, assets.fivePlaneProjection);
assert.equal(cue("festival_concept_014").assetPath, assets.fivePlaneProjection);
assert.equal(cue("festival_concept_015").presentation, "event-cg");
assert.equal(cue("festival_concept_019").assetPath, assets.firstEncounter);
assert.equal(cue("festival_concept_021").assetPath, assets.amaneCloseup);
assert.equal(cue("festival_concept_023").assetPath, assets.mizuhaCloseup);
assert.equal(cue("festival_concept_027").assetPath, assets.fivePlaneProjection);
assert.equal(cue("festival_concept_063").assetPath, assets.fivePlaneProjection);
assert.equal(cue("festival_concept_075").assetPath, assets.fivePlaneProjection);
assert.equal(cue("festival_concept_076").assetPath, assets.mapTransition);
assert.equal(cue("festival_concept_076").presentation, "event-cg");
assert.equal(cue("map_mode01_015").assetPath, assets.modis);
assert.equal(cue("map_mode01_029").assetPath, assets.map01Provenance);
assert.equal(cue("map_mode01_040").assetPath, assets.map01Provenance);
assert.equal(cue("map_mode01_043").assetPath, assets.fivePlaneProjection);
assert.equal(cue("gx_experience_017").assetPath, assets.boothClose);
assert.equal(cue("gx_experience_011").assetPath, assets.gxAncientOcean);
assert.equal(cue("gx_experience_018").assetPath, assets.fivePlaneProjection);
assert.equal(cue("gx_experience_030").assetPath, assets.gxBreathingPoints);
assert.equal(cue("gx_experience_054").assetPath, assets.gxTemperatureAnomaly);
assert.equal(cue("esp32_pitch_007").assetPath, assets.fivePlaneProjection);
assert.equal(cue("esp32_pitch_008").assetPath, assets.fivePlaneProjection);
assert.equal(cue("esp32_pitch_019").assetPath, assets.system);
assert.equal(cue("esp32_pitch_027").assetPath, assets.fivePlaneProjection);
assert.equal(cue("circle_invitation_001").assetPath, assets.fivePlaneProjection);
assert.equal(cue("circle_invitation_029").assetPath, assets.circleInvitationCard);
assert.equal(cue("circle_invitation_047").assetPath, assets.circleInvitationCard);
assert.equal(cue("circle_invitation_048").presentation, "event-cg");
assert.equal(cue("circle_invitation_070").assetPath, assets.boothClose);
assert.equal(cue("welcome_chat_020").id, "welcome-online-arrival");
assert.equal(cue("welcome_chat_021").id, "welcome-online-esp32-thread");
assert.equal(cue("welcome_chat_055").id, "welcome-physical-booth");
assert.equal(cue("welcome_chat_074").assetPath, assets.coastNight);
assert.equal(cue("welcome_chat_002").assetPath, assets.fivePlaneProjection);
assert.equal(cue("welcome_chat_041").assetPath, assets.fivePlaneProjection);
assert.equal(cue("welcome_chat_084").assetPath, assets.fivePlaneProjection);
assert.equal(cue("welcome_chat_091").assetPath, assets.fivePlaneProjection);
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
  welcomeBoundaries: ["001-073 five-plane booth", "074-083 explicit hall exit/mobile night", "084-091 five-plane booth continuity", "092-095 finale event CG"],
}, null, 2));
