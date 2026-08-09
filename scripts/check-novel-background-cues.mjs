import assert from "node:assert/strict";
import { access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
await import(new URL("../novel-story-data.js", import.meta.url));
await import(new URL("../novel-background-cues.js", import.meta.url));

const story = globalThis.GAIA_NOVEL_STORY;
const backgroundCues = globalThis.GAIA_NOVEL_BACKGROUND_CUES;
const production = story.scenes.find((scene) => scene.id === "production_year");
assert(production, "production_year scene is missing");
assert.equal(production.steps.length, 261, "production_year step count changed; re-audit background boundaries");
assert.throws(
  () => backgroundCues.forStep({ sceneId: "production_year", id: "production_year_999" }),
  /Missing production_year background cue/,
  "unknown production_year steps must fail instead of using a fallback",
);

const expectedBoundaries = [
  [1, 6, "current-exhibition-intro", "novel-bg-exhibition-v3.png"],
  [7, 59, "remote-planning-night", "novel-bg-online-night-v2.png"],
  [60, 79, "remote-white-red", "novel-bg-online-night-v2.png"],
  [80, 82, "amane-white-red-night", "novel-bg-amane-room-night-v1.png"],
  [83, 85, "amane-white-red-morning", "novel-bg-amane-room-morning-v1.png"],
  [86, 86, "sakuya-white-red-day", "novel-bg-sakuya-room-day-v1.png"],
  [87, 88, "amane-white-red-evening-note", "novel-bg-amane-room-evening-v1.png"],
  [89, 89, "sakuya-photo-morning", "novel-bg-sakuya-room-morning-v1.png"],
  [90, 102, "sakuya-deleted-line-evening", "novel-bg-sakuya-room-evening-v1.png"],
  [103, 108, "mizuha-deleted-line-evening", "novel-bg-mizuha-room-evening-v1.png"],
  [109, 115, "amane-deleted-line-evening", "novel-bg-amane-room-evening-v1.png"],
  [116, 121, "sakuya-apology-morning", "novel-bg-sakuya-room-morning-v1.png"],
  [122, 129, "remote-lunch-thread", "novel-bg-online-night-v2.png"],
  [130, 149, "remote-new-year-huddle", "novel-bg-online-night-v2.png"],
  [150, 155, "current-exhibition-audio", "novel-bg-exhibition-v3.png"],
  [156, 168, "remote-ten-modes", "novel-bg-online-night-v2.png"],
  [169, 174, "station-meeting", "novel-bg-production-station-meeting-v1.png"],
  [175, 194, "shared-room-first-session", "novel-bg-production-shared-meeting-v3.png"],
  [195, 199, "return-train", "novel-bg-production-return-train-v1.png"],
  [200, 214, "shared-room-user-test", "novel-bg-production-shared-meeting-v3.png"],
  [215, 232, "remote-publication-agreement", "novel-bg-online-night-v2.png"],
  [233, 238, "venue-preparation", "novel-bg-production-venue-prep-v1.png"],
  [239, 247, "used-equipment-store", "novel-bg-production-used-equipment-store-v1.png"],
  [248, 253, "amane-reservation-day", "novel-bg-amane-room-day-v1.png"],
  [254, 256, "amane-reservation-evening", "novel-bg-amane-room-evening-v1.png"],
  [257, 258, "amane-next-session-evening-hold", "novel-bg-amane-room-evening-v1.png"],
  [259, 261, "current-exhibition-return", "novel-bg-exhibition-v3.png"],
];

assert.equal(backgroundCues.productionYear.length, expectedBoundaries.length, "production_year cue count changed");
for (let index = 0; index < expectedBoundaries.length; index += 1) {
  const [from, to, id, expectedFilename] = expectedBoundaries[index];
  const cue = backgroundCues.productionYear[index];
  assert.deepEqual([cue.from, cue.to, cue.id], [from, to, id], `${id}: cue boundary changed`);
  if (expectedFilename) assert.equal(path.basename(cue.assetPath || ""), expectedFilename, `${id}: asset mapping changed`);
  if (index > 0) assert.equal(from, expectedBoundaries[index - 1][1] + 1, `${id}: cue ranges overlap or leave a gap`);
}

const resolved = production.steps.map((step) => ({ step, cue: backgroundCues.forStep(step) }));
assert.equal(resolved.length, 261, "not every production_year step resolved to a cue");
assert.equal(resolved.filter(({ cue }) => cue.assetPath.includes("novel-bg-production-night-v2.png")).length, 0, "old production-night background remains mapped");
assert.equal(resolved.filter(({ cue }) => /novel-bg-(?:amane|mizuha|sakuya)-room-v1\.png$/.test(cue.assetPath)).length, 0, "unqualified room-v1 fallback remains mapped");

for (const assetPath of new Set(resolved.map(({ cue }) => cue.assetPath))) {
  assert(assetPath.startsWith("assets/visuals-07/"), `background escaped the approved asset root: ${assetPath}`);
  await access(path.join(projectRoot, assetPath));
}

for (const step of production.steps.slice(174, 194)) assert.equal(backgroundCues.forStep(step).id, "shared-room-first-session");
for (const step of production.steps.slice(199, 214)) assert.equal(backgroundCues.forStep(step).id, "shared-room-user-test");
for (const step of production.steps.slice(258, 261)) assert.equal(backgroundCues.forStep(step).id, "current-exhibition-return");

console.log(JSON.stringify({
  status: "passed",
  scene: production.id,
  steps: resolved.length,
  cues: backgroundCues.productionYear.length,
  assets: [...new Set(resolved.map(({ cue }) => cue.assetPath))],
  oldProductionNightReferences: 0,
  unqualifiedRoomFallbacks: 0,
}, null, 2));
