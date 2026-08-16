import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (name) => fs.readFileSync(path.join(root, name), "utf8");
const html = read("index.html");
const runtime = read("novel-mode.js");
await import(`${pathToFileURL(path.join(root, "novel-story-data.js")).href}?map01=${Date.now()}`);

const story = globalThis.GAIA_NOVEL_STORY;
const steps = story.scenes.flatMap((scene) => scene.steps);
const interactions = steps
  .filter((step) => step.type === "interaction")
  .map((step) => ({
    id: step.id,
    kind: step.interaction?.kind,
    optional: step.interaction?.optional === true,
    modeId: step.interaction?.modeId || "",
  }));
const checks = [];
const check = (name, fn) => {
  fn();
  checks.push({ name, passed: true });
};

check("only current map01 and gx interaction data exist", () => {
  assert.equal(story.scenes.length, 6);
  assert.equal(steps.length, 396);
  assert.deepEqual(interactions, [
    { id: "map_mode01_004", kind: "map01", optional: false, modeId: "breathing-earth" },
    { id: "gx_experience_017", kind: "gx", optional: false, modeId: "" },
  ]);
  for (const retiredId of ["gx_deep_time_003", "mode03_map_003", "mode07_abstract_003", "mode08_map_layers_003", "mode10_space_003"]) {
    assert.equal(steps.some((step) => step.id === retiredId), false, `${retiredId} must not be reintroduced`);
  }
});

check("map01 exact step joins the existing guarded auto-open path", () => {
  assert.match(runtime, /const autoOpenInteraction = step\.interaction\?\.kind === "gx"\s*\|\| \(step\.id === "map_mode01_004" && step\.interaction\?\.kind === "map01"\);/u);
  assert.match(runtime, /if \(autoOpenInteraction\) \{\s*requestAnimationFrame\(\(\) => \{\s*if \(currentStep\(\)\?\.id === step\.id && interactionLifecycle === "prep" && !pendingInteraction\) openDetour\(step\);/u);
  assert.equal((runtime.match(/map_mode01_004/gu) || []).length, 1);
  const autoOpenDeclaration = runtime.match(/const autoOpenInteraction =[^;]+;/u)?.[0] || "";
  for (const retiredKind of ["map03", "abstract07", "space10", "map08"]) assert.equal(autoOpenDeclaration.includes(retiredKind), false);
});

check("launcher fallback and optional contract remain available without current data", () => {
  assert.equal((runtime.match(/既存の表示モードを開く/gu) || []).length, 1);
  assert.match(runtime, /const isMode08Optional = step\.type === "interaction"\s*&& step\.interaction\?\.kind === "map08"\s*&& step\.interaction\?\.optional === true;/u);
  assert.equal((runtime.match(/表示モードを見る/gu) || []).length, 1);
  assert((runtime.match(/選ばずに進む/gu) || []).length >= 1);
});

check("runtime cache key is advanced", () => {
  assert.match(html, /novel-mode\.js\?v=gaia-log-comment-delete-all-1/u);
});

console.log(JSON.stringify({ status: "passed", checks, sceneCount: story.scenes.length, stepCount: steps.length, interactions }, null, 2));
