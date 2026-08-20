import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (name) => fs.readFileSync(path.join(root, name), "utf8");
const html = read("index.html");
const app = read("app.js");
const styles = read("novel-mode.css");
const baseStyles = read("styles.css");
const backgroundCues = read("novel-background-cues.js");
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
    requiredViews: step.interaction?.requiredViews || [],
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
    { id: "map_mode01_004", kind: "map01", optional: false, modeId: "breathing-earth", requiredViews: ["timeline_complete"] },
    { id: "gx_experience_017", kind: "gx", optional: false, modeId: "", requiredViews: [] },
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

check("map01 uses a modal, triple-speed playback, and automatic return", () => {
  assert.match(runtime, /\["gx", "map01"\]\.includes\(pendingInteraction\?\.interaction\?\.kind\)/u);
  assert.match(runtime, /if \(step\.interaction\.kind !== "map01"\) \{/u);
  assert.match(runtime, /gaia:story-mode-auto-complete/u);
  assert.match(runtime, /requestDetourReturn\(\);/u);
  assert.match(app, /const STORY_MAP_TIMELINE_SPEED = 3;/u);
  assert.match(app, /baseDuration \/ STORY_MAP_TIMELINE_SPEED/u);
  assert.match(app, /1958年から2050年まで、実測・補完・試算の変化を自動で再生します。/u);
  assert.match(app, /completeStoryMapTimeline/u);
  assert.match(app, /detail: \{ kind: "map01", view: "timeline_complete" \}/u);
  assert.doesNotMatch(app, /mountStoryMapGuide/u);
  assert.match(styles, /\.japan-layer\[data-story-mode="map01"\][\s\S]+position: fixed;[\s\S]+width: min\(1260px/u);
  assert.match(styles, /\.japan-layer\[data-story-mode="map01"\] \.story-map-guide,[\s\S]+\.japan-layer\[data-story-mode="map01"\] \.story-detour-dock,[\s\S]+display: none !important;/u);
});

check("story copy describes automatic playback without retired controls", () => {
  const mapSteps = story.scenes.find((scene) => scene.id === "map_mode01")?.steps || [];
  const copy = mapSteps.map((step) => step.text || "").join("\n");
  assert.match(copy, /1958年から2050年まで、地球の変化を続けて見てください/u);
  assert.match(copy, /静かに閉じて物語へ戻った/u);
  assert.doesNotMatch(copy, /操作を保存するボタン|地図の気になる場所を押して/u);
});

check("runtime cache keys are advanced", () => {
  assert.match(html, /styles\.css\?v=gaia-map-no-tabletop-1/u);
  assert.match(html, /novel-background-cues\.js\?v=gaia-map-no-tabletop-1/u);
  assert.match(html, /app\.js\?v=gaia-story-map-autoplay-1/u);
  assert.match(html, /novel-mode\.css\?v=gaia-story-map-modal-1/u);
  assert.match(html, /novel-mode\.js\?v=gaia-story-map-autoreturn-1/u);
  assert.match(html, /novel-story-data\.js\?v=gaia-story-map-autoplay-1/u);
});

check("tabletop map artwork is absent from story and map runtime", () => {
  assert.doesNotMatch(backgroundCues, /mode-map-v1\.webp/u);
  assert.doesNotMatch(baseStyles, /mode-map-v1\.webp/u);
  assert.doesNotMatch(html, /data-intro-visual="map"[\s\S]{0,180}mode-map-v1\.webp/u);
  assert.match(backgroundCues, /map01-co2-observation[\s\S]{0,180}event-cg-festival-map-transition-five-plane-v3\.png/u);
});

console.log(JSON.stringify({ status: "passed", checks, sceneCount: story.scenes.length, stepCount: steps.length, interactions }, null, 2));
