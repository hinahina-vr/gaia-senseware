import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataPath = path.join(projectRoot, "novel-story-data.js");
delete globalThis.GAIA_NOVEL_STORY;
delete globalThis.GAIA_NOVEL_STORY_V6;
await import(`${pathToFileURL(dataPath).href}?check=${Date.now()}`);
const story = globalThis.GAIA_NOVEL_STORY;

assert.ok(story, "GAIA_NOVEL_STORY must be defined");
assert.equal(story.storyVersion, 7);
assert.equal(story.startSceneId, "current_exhibition");

const scenes = story.scenes || [];
const sceneIds = scenes.map((scene) => scene.id);
const sceneSet = new Set(sceneIds);
assert.equal(sceneSet.size, sceneIds.length, "scene IDs must be unique");
const steps = scenes.flatMap((scene) => scene.steps || []);
const stepIds = steps.map((step) => step.id);
assert.equal(new Set(stepIds).size, stepIds.length, "step IDs must be unique");
const visibleStoryText = steps.flatMap((step) => [step.text, step.prompt, ...(step.options || []).map((option) => option.label)]).filter(Boolean).join("\n");
assert.doesNotMatch(visibleStoryText, /LOCAL FIRST|STATION FIRST/u, "internal observation-order identifiers leaked into visible story text");

for (const required of story.requiredSceneIds || []) assert.ok(sceneSet.has(required), `required scene is missing: ${required}`);
for (const scene of scenes) {
  assert.ok(scene.steps?.length, `${scene.id} must contain steps`);
  if (scene.nextSceneId) assert.ok(sceneSet.has(scene.nextSceneId), `${scene.id} has an invalid nextSceneId`);
  for (const step of scene.steps) {
    assert.equal(step.sceneId, scene.id, `${step.id} must reference its containing scene`);
    if (["dialogue", "chat"].includes(step.type)) assert.ok(["mizuha", "amane", "sakuya", "visitor", "system"].includes(step.speaker), `${step.id} has an invalid speaker`);
    if (step.type === "record") assert.ok(["SOURCE", "LOCAL_SOURCE", "DERIVED", "SCENARIO", "VISITOR_TRACE"].includes(step.recordType), `${step.id} has an invalid record type`);
    if (step.type === "choice") {
      assert.equal(step.options.length, 2, `${step.choiceId} must contain two options`);
      step.options.forEach((option) => assert.ok(sceneSet.has(option.next), `${step.choiceId} has an invalid destination`));
    }
  }
}

const reachable = new Set();
let cursor = story.startSceneId;
while (cursor && !reachable.has(cursor)) {
  reachable.add(cursor);
  cursor = scenes.find((scene) => scene.id === cursor)?.nextSceneId || null;
}
for (const required of story.requiredSceneIds || []) assert.ok(reachable.has(required), `required scene is unreachable: ${required}`);

const interactionKinds = steps.filter((step) => step.type === "interaction").map((step) => step.interaction?.kind);
assert.deepEqual(interactionKinds, ["gx", "map03", "abstract07", "map08", "space10"]);
assert.deepEqual(story.requiredInteractions, interactionKinds);
assert.deepEqual(scenes.filter((scene) => /^mode\d+/u.test(scene.id)).map((scene) => scene.modeIndex), [2, 6, 7, 9]);

const editorial = steps.find((step) => step.choiceId === "editorial_choice");
assert.deepEqual(editorial?.options.map((option) => option.value), ["SOURCE_RECORD", "DISCLOSE_DERIVATION"]);
const reflection = steps.find((step) => step.type === "reflectionChoice");
assert.ok(reflection, "reflection choice must exist");
assert.equal(reflection.maxSelections, 3);
assert.equal(reflection.options.length, 36);
assert.equal(new Set(reflection.options.map((option) => option.id)).size, 36, "reflection IDs must be unique");
assert.equal(new Set(reflection.options.map((option) => option.text)).size, 36, "reflection statements must be unique");

const dominance = { law: 0, neutral: 0, chaos: 0 };
const expectedReflectionIds = Array.from({ length: 36 }, (_, index) => `R${String(index + 1).padStart(2, "0")}`);
assert.deepEqual(reflection.options.map((option) => option.id).sort(), expectedReflectionIds, "all fixed reflection IDs must remain present");
const expectedThemes = ["不確実さと解釈", "記録と検証", "技術と生成責任", "権利と当事者", "制度と行動", "人間・地球・未来"];
assert.deepEqual([...new Set(reflection.options.map((option) => option.theme))], expectedThemes, "reflection themes must keep the script order");
expectedThemes.forEach((theme) => assert.equal(reflection.options.filter((option) => option.theme === theme).length, 6, `${theme} must contain six statements`));
reflection.options.forEach((option) => {
  const values = Object.entries(option.weights);
  const max = Math.max(...values.map(([, value]) => value));
  const leaders = values.filter(([, value]) => value === max);
  assert.equal(leaders.length, 1, `${option.id} must have one dominant axis`);
  dominance[leaders[0][0]] += 1;
});
assert.deepEqual(dominance, { law: 12, neutral: 12, chaos: 12 });
assert.equal(story.finalResults.length, 8, "two editorial choices by four spatial outcomes are required");
assert.deepEqual(story.saveFields.filter((field) => ["reflectionIds", "resultTone"].includes(field)), ["reflectionIds", "resultTone"]);

const allText = steps.map((step) => step.text || "").join("\n");
for (const requiredText of [
  "真ん中の椅子には鞄も上着もなく、誰も座っていない。",
  "うん。今日、はじめまして🌸",
  "森と雨が重なる場所があります。原因はこの画面だけでは決められません。",
  "もし地球の声が聞こえたと思ったら、すぐに意味を決めるんじゃなくて――",
  "「聞こえたつもりになってない？」って、三人で確かめたい。",
]) assert.ok(allText.includes(requiredText), `canon text is missing: ${requiredText}`);

assert.ok(steps.some((step) => step.sceneId === "mode07_abstract" && ["SOURCE", "LOCAL_SOURCE"].includes(step.recordType)), "MODE 07 SOURCE must exist");
assert.ok(steps.some((step) => step.sceneId === "mode07_abstract" && step.recordType === "DERIVED"), "MODE 07 DERIVED must exist separately");
assert.ok(story.generationDetails?.model);

const checkedFiles = ["index.html", "novel-mode.js", "novel-mode.css", "scripts/build-novel-story.mjs", "story/物語台本.md", "story/世界観設定.md"];
const checkedSource = checkedFiles.map((file) => fs.readFileSync(path.join(projectRoot, file), "utf8")).join("\n");
for (const forbidden of ["novel-inline-card", "novel-mode-bridge", "visitorInput", "LEAVE EMPTY", "WRITE ACCESS", "START前の通知", "旧版の記録"]) {
  assert.ok(!checkedSource.includes(forbidden), `removed UI or behavior remains: ${forbidden}`);
}
for (const asset of [
  "assets/visuals-07/novel-title-keyvisual-v2.png",
  "assets/visuals-07/novel-result-observation-v1.png",
  "assets/visuals-07/novel-bg-exhibition-v2.png",
  "assets/visuals-07/novel-bg-workroom-v2.png",
  "assets/visuals-07/novel-bg-online-night-v2.png",
  "assets/visuals-07/novel-bg-garden-center-v2.png",
  "assets/visuals-07/novel-bg-coastal-venue-v2.png",
  "assets/visuals-07/novel-bg-production-night-v2.png",
  "assets/visuals-07/novel-bg-zushi-coast-night-v2.png",
]) {
  assert.ok(fs.statSync(path.join(projectRoot, asset)).size > 100_000, `visual asset is missing: ${asset}`);
}
const novelCss = fs.readFileSync(path.join(projectRoot, "novel-mode.css"), "utf8");
assert.ok(!novelCss.includes('url("./assets/visuals-07/novel-background-v1.webp")'), "character-composited legacy background remains in the novel runtime");

console.log(`novel story check passed: ${scenes.length} scenes, ${stepIds.length} steps, 36 reflection statements, 8 result combinations`);
