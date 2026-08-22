import assert from "node:assert/strict";
import { access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
await import(new URL("../novel-story-data.js", import.meta.url));
await import(new URL("../novel-background-cues.js", import.meta.url));

const story = globalThis.GAIA_NOVEL_STORY;
const backgrounds = globalThis.GAIA_NOVEL_BACKGROUND_CUES;
const sceneIds = ["festival_concept", "map_mode01", "gx_experience", "esp32_pitch", "circle_invitation", "welcome_chat"];
const counts = [76, 43, 48, 43, 81, 95];
assert.equal(story.storyVersion, 11);
assert.deepEqual(story.scenes.map((scene) => scene.id), sceneIds);
assert.deepEqual(story.scenes.map((scene) => scene.steps.length), counts);
assert.deepEqual(backgrounds.expectedSceneCounts, Object.fromEntries(sceneIds.map((id, index) => [id, counts[index]])));
assert.equal(backgrounds.limitedStory.length, 37);

const allSteps = story.scenes.flatMap((scene) => scene.steps);
const resolved = allSteps.map((step) => ({ step, cue: backgrounds.forStep(step) }));
assert.equal(resolved.length, 386);
assert(resolved.every(({ cue }) => cue?.assetPath && cue?.motion));
assert.equal(new Set(resolved.map(({ cue }) => cue.assetPath)).size, 19);
assert.equal(resolved.filter(({ cue }) => cue.presentation === "event-cg").length, 105);
assert(
  backgrounds.limitedStory
    .filter((cue) => /(?:^|\/)event-cg-/u.test(cue.assetPath))
    .every((cue) => cue.presentation === "event-cg"),
  "character-composited event CG must suppress standalone cast",
);

for (const assetPath of new Set(resolved.map(({ cue }) => cue.assetPath))) {
  assert(assetPath.startsWith("assets/"));
  assert.doesNotMatch(assetPath, /portrait/iu);
  await access(path.join(projectRoot, assetPath));
}

const cue = (id) => backgrounds.forStep(allSteps.find((step) => step.id === id));
const expected = [
  ["festival_concept_001", "novel-bg-convention-hall-entrance-autumn-morning-v2.png"],
  ["festival_concept_010", "novel-bg-festival-five-plane-projection-autumn-morning-v2.png"],
  ["festival_concept_015", "event-cg-first-encounter-five-plane-v3.png"],
  ["festival_concept_021", "event-cg-amane-closeup-five-plane-v4.png"],
  ["festival_concept_023", "event-cg-mizuha-closeup-five-plane-v3.png"],
  ["map_mode01_004", "event-cg-festival-map-transition-five-plane-v3.png"],
  ["map_mode01_023", "modis-land-cover-2023.png"],
  ["map_mode01_029", "novel-bg-map01-data-provenance-autumn-morning-v3.png"],
  ["gx_experience_017", "novel-bg-festival-five-plane-projection-autumn-morning-v2.png"],
  ["gx_experience_018", "novel-bg-gx-ancient-ocean-autumn-morning-v3.png"],
  ["gx_experience_020", "mode-abstract-v1.webp"],
  ["gx_experience_027", "novel-bg-gx-breathing-points-autumn-morning-v3.png"],
  ["esp32_pitch_001", "event-cg-esp32-collaboration-v2.png"],
  ["esp32_pitch_010", "gaia-field-sensor-architecture-v2.svg"],
  ["circle_invitation_029", "event-cg-circle-invitation-card-v3.png"],
  ["circle_invitation_048", "event-cg-circle-welcome-v2.png"],
  ["welcome_chat_004", "novel-bg-online-night-v2.png"],
  ["welcome_chat_074", "event-cg-exhibition-finale-sunset-v1.png"],
  ["welcome_chat_095", "event-cg-exhibition-finale-sunset-v1.png"],
];
for (const [id, filename] of expected) assert(cue(id).assetPath.endsWith(filename), `${id} background is not synchronized`);

assert.equal(backgrounds.gallery.length, 6);
for (const entry of backgrounds.gallery) {
  const step = allSteps.find((candidate) => candidate.id === entry.unlockStepId);
  assert(step, `${entry.id}: gallery unlock step missing`);
  assert.equal(backgrounds.forStep(step).galleryId, entry.id, `${entry.id}: gallery cue mismatch`);
}

assert.throws(() => backgrounds.forStep({ sceneId: "gx_experience", id: "gx_experience_054" }), /Missing contest-v10 background cue/);
assert.throws(() => backgrounds.forStep({ sceneId: "unknown", id: "unknown_001" }), /Unknown contest-v10 background scene/);

console.log(`story background sync check passed: ${backgrounds.limitedStory.length} cues, ${new Set(resolved.map(({ cue: item }) => item.assetPath)).size} assets`);
