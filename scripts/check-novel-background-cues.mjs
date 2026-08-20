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
  entrance: "assets/visuals-07/novel-bg-coastal-venue-autumn-morning-v1.png",
  conventionHallEntrance: "assets/visuals-07/novel-bg-convention-hall-entrance-autumn-morning-v1.png",
  bHallOverview: "assets/visuals-07/novel-bg-festival-b-hall-autumn-morning-v1.png",
  fivePlaneProjection: "assets/visuals-07/novel-bg-festival-five-plane-projection-autumn-morning-v2.png",
  boothClose: "assets/visuals-07/novel-bg-exhibition-autumn-morning-close-v4.png",
  boothWide: "assets/visuals-07/novel-bg-exhibition-autumn-morning-wide-v4.png",
  projectionConversation: "assets/visuals-07/novel-bg-festival-projection-conversation-v1.png",
  firstEncounter: "assets/visuals-07/event-cg-first-encounter-five-plane-v3.png",
  amaneCloseup: "assets/visuals-07/event-cg-amane-closeup-five-plane-v3.png",
  mizuhaCloseup: "assets/visuals-07/event-cg-mizuha-closeup-five-plane-v3.png",
  mapTransition: "assets/visuals-07/event-cg-festival-map-transition-five-plane-v3.png",
  tenWindows: "assets/concept/concept-02-ten-windows.png",
  modeMap: "assets/visuals-07/mode-map-v1.webp",
  modis: "assets/data/modis-land-cover-2023.png",
  map01Provenance: "assets/visuals-07/novel-bg-map01-data-provenance-autumn-morning-v3.png",
  system: "assets/architecture/gaia-system-architecture.png",
  gxAncientOcean: "assets/visuals-07/novel-bg-gx-ancient-ocean-autumn-morning-v3.png",
  abstract: "assets/visuals-07/mode-abstract-v1.webp",
  gxBreathingPoints: "assets/visuals-07/novel-bg-gx-breathing-points-autumn-morning-v3.png",
  observatory: "assets/architecture/observatory-architecture-v2.png",
  partner: "assets/concept/concept-01-earth-as-partner.png",
  gxTemperatureAnomaly: "assets/visuals-07/novel-bg-gx-temperature-anomaly-autumn-morning-v3.png",
  gxModeGateway: "assets/visuals-07/novel-bg-gx-mode-gateway-autumn-morning-v4.png",
  esp32Collaboration: "assets/visuals-07/event-cg-esp32-collaboration-v2.png",
  future: "assets/concept/concept-04-co-created-future.png",
  shared: "assets/visuals-07/novel-background-v1.webp",
  circleWelcome: "assets/visuals-07/event-cg-circle-welcome-v2.png",
  circleInvitationCard: "assets/visuals-07/event-cg-circle-invitation-card-v3.png",
  onlineNight: "assets/visuals-07/novel-bg-online-night-v2.png",
  productionNight: "assets/visuals-07/novel-bg-production-night-v2.png",
  venue: "assets/visuals-07/novel-bg-coastal-venue-v2.png",
  coastNight: "assets/visuals-07/novel-bg-zushi-coast-autumn-day-v3.png",
  finale: "assets/visuals-07/event-cg-exhibition-finale-v2.png",
});
const approvedAssetHashes = Object.freeze({
  [assets.entrance]: "972adf6beac6b3ac51e9e132b81c7ca61acb24e9f795600153ec021b7c9d1654",
  [assets.conventionHallEntrance]: "c54278de22f4de6695130845bbb4cdf461d842d546ec53ca039bb8fd02def35c",
  [assets.bHallOverview]: "47c4b03ca464db0df64b5a0f055f862bc63f7bc697d40ffe374cdce4d6dac519",
  [assets.fivePlaneProjection]: "42821b8efb82deb36075a9164d04d60bb52e284a2ca0ad3ac72d9f0b1a65ee1f",
  [assets.boothClose]: "7395fdf68129209f51e2eb1fea26e478627b4fbf03525a7ecb9cdc3d58c45f69",
  [assets.boothWide]: "9dc2b6db1bb35274842128b81a4e0bf09257be43727b472ec0ff5b06d7ad5ea4",
  [assets.firstEncounter]: "62984fd5ea1bbca86bf985be02c06b61d3680aae19ec2af932ae8dc4240efaa6",
  [assets.amaneCloseup]: "ae7b03317515a741ae231d82be7be28076d44213c208f3c4c080439b499b16ea",
  [assets.mizuhaCloseup]: "440c8c71df5cc82a142994fc2757b24f2be874272a1067da9a9a5b872b946672",
  [assets.mapTransition]: "9eae1fce4e79ce8d32961dce29c348fe1ed0df329e70684b2fdb1cde657ce380",
  [assets.modeMap]: "1a245a6af41d7b4dd5621cf0673b5b44284932c64d7b12c192c885c0f579e1d5",
  [assets.gxAncientOcean]: "f219a47c1b5d24ab780dedf492f807515b9ecc6a088f7d5f803fff584903699f",
  [assets.abstract]: "be589ad2fd084284d967e2fd873c8565ac4ceb468820a4eca9b87d6815b67b68",
  [assets.gxBreathingPoints]: "d468bdcead823a16b9847dce49c8945bf011b48c82ce9f933dfe6602f39ad0e7",
  [assets.gxTemperatureAnomaly]: "f03f821c95cc0ccd4c3b62d1f5e7b08f8a0fb7c741fd2c210edb600b2ffd0050",
  [assets.map01Provenance]: "90316d1300c7b5a19ed04eca347ad8bd702d476e2d5bb03e8ef207784160e206",
  [assets.gxModeGateway]: "6cb628c79e74496fd7393c6844c0a0fd8d91e5bd682f5567065c5218fb826514",
  [assets.esp32Collaboration]: "9dac8e247d2fc37fc86b57a49be249c0cd73da84f02fe803d9c6f802c83c68fd",
  [assets.shared]: "933900ea6c5d9dca04861d551d25e67fb7fffd33085f3a4abe43ff102a8b4d02",
  [assets.circleWelcome]: "525634c93527c677b8afa337e89a5d00ed46e1b64b349bfa123efb220ff7dfbd",
  [assets.coastNight]: "f8017fc5902cbae1df2f9e037b7009179a5bf924e5d943f73e76005d60c1467e",
  [assets.finale]: "343579e6a2af3cfbc8c1e2d1314dc852ef69d2a742e432f3f8ce7fa49fae2262",
  [assets.circleInvitationCard]: "0333bec3f7b6d0af5b3dca51913ede5f87dc30ffe81df28b4520bc1c7cb2f04b",
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
  ["festival_concept", 1, 1, "festival-main-entrance-reception", assets.entrance, "push-in", "scenic"],
  ["festival_concept", 2, 7, "festival-convention-hall-entrance", assets.conventionHallEntrance, "push-in", "scenic"],
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
  ["gx_experience", 17, 17, "gx-native-deep-time", assets.fivePlaneProjection, "drift-right", "scenic"],
  ["gx_experience", 18, 18, "gx-exhibition-return", assets.fivePlaneProjection, "push-in", "scenic"],
  ["gx_experience", 19, 29, "gx-ancient-ocean", assets.abstract, "drift-right", "scenic"],
  ["gx_experience", 30, 41, "gx-coevolution", assets.gxBreathingPoints, "drift-left", "scenic"],
  ["gx_experience", 42, 44, "gx-present-return", assets.observatory, "push-in", "scenic"],
  ["gx_experience", 45, 54, "gx-human-choice", assets.gxTemperatureAnomaly, "drift-right", "scenic"],
  ["gx_experience", 55, 58, "gx-ten-mode-gateway", assets.gxModeGateway, "push-in", "scenic"],
  ["esp32_pitch", 1, 7, "esp32-exhibition-opening", assets.fivePlaneProjection, "drift-left", "scenic"],
  ["esp32_pitch", 8, 18, "esp32-exhibition-proposal", assets.esp32Collaboration, "event-focus", "event-cg"],
  ["esp32_pitch", 19, 26, "esp32-system-design", assets.system, "drift-left", "scenic"],
  ["esp32_pitch", 27, 38, "esp32-co-created-prototype", assets.fivePlaneProjection, "drift-right", "scenic"],
  ["esp32_pitch", 39, 43, "esp32-exhibition-return", assets.fivePlaneProjection, "push-in", "scenic"],
  ["circle_invitation", 1, 10, "circle-closing-exhibition", assets.fivePlaneProjection, "push-in", "scenic"],
  ["circle_invitation", 11, 28, "circle-private-invitation", assets.fivePlaneProjection, "drift-left", "scenic"],
  ["circle_invitation", 29, 47, "circle-invitation-card-cg", assets.circleInvitationCard, "event-focus", "event-cg"],
  ["circle_invitation", 48, 69, "circle-welcome-cg", assets.circleWelcome, "event-focus", "event-cg"],
  ["circle_invitation", 70, 81, "circle-after-welcome", assets.fivePlaneProjection, "drift-right", "scenic"],
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
assert.equal(resolved.filter(({ cue }) => cue.presentation === "event-cg").length, 69);

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
assert.equal(cue("festival_concept_002").assetPath, assets.conventionHallEntrance);
assert.equal(cue("festival_concept_007").assetPath, assets.conventionHallEntrance);
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
assert.equal(cue("gx_experience_017").assetPath, assets.fivePlaneProjection);
assert.equal(cue("gx_experience_011").assetPath, assets.gxAncientOcean);
assert.equal(cue("gx_experience_018").assetPath, assets.fivePlaneProjection);
assert.equal(cue("gx_experience_030").assetPath, assets.gxBreathingPoints);
assert.equal(cue("gx_experience_054").assetPath, assets.gxTemperatureAnomaly);
assert.equal(cue("esp32_pitch_007").assetPath, assets.fivePlaneProjection);
assert.equal(cue("esp32_pitch_008").assetPath, assets.esp32Collaboration);
assert.equal(cue("esp32_pitch_008").presentation, "event-cg");
assert.equal(cue("esp32_pitch_019").assetPath, assets.system);
assert.equal(cue("esp32_pitch_027").assetPath, assets.fivePlaneProjection);
assert.equal(cue("circle_invitation_001").assetPath, assets.fivePlaneProjection);
assert.equal(cue("circle_invitation_029").assetPath, assets.circleInvitationCard);
assert.equal(cue("circle_invitation_047").assetPath, assets.circleInvitationCard);
assert.equal(cue("circle_invitation_048").presentation, "event-cg");
assert.equal(cue("circle_invitation_070").assetPath, assets.fivePlaneProjection);
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
  welcomeBoundaries: ["001-073 five-plane booth", "074-083 explicit autumn-day hall exit/mobile", "084-091 five-plane booth continuity", "092-095 finale event CG"],
}, null, 2));
