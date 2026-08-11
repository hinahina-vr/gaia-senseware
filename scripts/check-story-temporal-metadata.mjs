import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = fs.readFileSync(path.join(projectRoot, "story", "物語台本.md"), "utf8").replace(/\r\n?/gu, "\n");
const sourceMetadata = [...source.matchAll(/^<!-- scene-meta\n([\s\S]*?)\n-->/gmu)].map((match) => JSON.parse(match[1]));
await import(`${pathToFileURL(path.join(projectRoot, "novel-story-data.js")).href}?metadata=${Date.now()}`);
const story = globalThis.GAIA_NOVEL_STORY;

assert.equal(sourceMetadata.length, 6, "freeze source must expose six scene-meta blocks");
assert.deepEqual(story.scenes.map((scene) => scene.id), sourceMetadata.map((meta) => meta.id));
for (const [index, meta] of sourceMetadata.entries()) {
  const scene = story.scenes[index];
  assert.equal(scene.chapter, meta.chapter);
  assert.equal(scene.duration, meta.duration);
  assert.equal(scene.location, meta.location);
  assert.equal(scene.temporal.displayTitle, `${meta.duration}｜${meta.location}`);
  assert.equal(scene.temporal.temporalContext, "CURRENT");
  assert.equal(scene.temporal.timePrecision, "APPROXIMATE");
  assert.equal(Object.hasOwn(scene.temporal, "startAt"), false, `${scene.id}: absolute date must not be invented`);
}
assert.deepEqual(story.temporal.sceneOrder, sourceMetadata.map((meta) => meta.id));
assert.deepEqual(story.temporal.archives, []);
console.log("contest v10 scene-meta check passed: 6 scenes, source duration/location preserved");
