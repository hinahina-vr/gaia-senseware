import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataPath = path.join(projectRoot, "novel-story-data.js");
const runtimePath = path.join(projectRoot, "novel-mode.js");

delete globalThis.GAIA_NOVEL_STORY_V6;
await import(`${pathToFileURL(dataPath).href}?check=${Date.now()}`);
const story = globalThis.GAIA_NOVEL_STORY_V6;

assert.ok(story, "GAIA_NOVEL_STORY_V6 must be defined");
assert.equal(story.storyVersion, 6, "storyVersion must be 6");
assert.equal(story.startSceneId, "current_notice", "the story must start at CURRENT");

const scenes = story.scenes || [];
const sceneIds = scenes.map((scene) => scene.id);
assert.equal(new Set(sceneIds).size, sceneIds.length, "scene IDs must be unique");

const stepIds = scenes.flatMap((scene) => (scene.steps || []).map((step) => step.id));
assert.equal(new Set(stepIds).size, stepIds.length, "step IDs must be unique");

const sceneSet = new Set(sceneIds);
for (const required of story.requiredSceneIds || []) {
  assert.ok(sceneSet.has(required), `required scene is missing: ${required}`);
}
for (const scene of scenes) {
  assert.ok(Array.isArray(scene.steps) && scene.steps.length > 0, `${scene.id} must contain steps`);
  if (scene.nextSceneId) assert.ok(sceneSet.has(scene.nextSceneId), `${scene.id} has an invalid nextSceneId`);
  for (const step of scene.steps) {
    assert.equal(step.sceneId, scene.id, `${step.id} must reference its containing scene`);
    if (["dialogue", "chat"].includes(step.type)) {
      assert.ok(["mizuha", "amane", "sakuya", "visitor", "system"].includes(step.speaker), `${step.id} has an invalid speaker`);
    }
    if (step.type === "record") {
      assert.ok(["SOURCE", "LOCAL_SOURCE", "DERIVED", "SCENARIO", "VISITOR_TRACE", "VISITOR_POST"].includes(step.recordType), `${step.id} has an invalid recordType`);
    }
    if (step.type === "choice") {
      assert.equal(step.options.length, 2, `${step.choiceId} must have exactly two options`);
      for (const option of step.options) assert.ok(sceneSet.has(option.next), `${step.choiceId} has an invalid destination`);
    }
  }
}

const reachable = new Set();
let cursor = story.startSceneId;
while (cursor && !reachable.has(cursor)) {
  reachable.add(cursor);
  cursor = scenes.find((scene) => scene.id === cursor)?.nextSceneId || null;
}
for (const required of story.requiredSceneIds || []) {
  assert.ok(reachable.has(required), `required scene is unreachable: ${required}`);
}

const interactionSteps = scenes.flatMap((scene) => scene.steps || []).filter((step) => step.type === "interaction");
const interactionKinds = interactionSteps.map((step) => step.interaction?.kind);
for (const kind of story.requiredInteractions || []) {
  assert.equal(interactionKinds.filter((candidate) => candidate === kind).length, 1, `interaction must exist exactly once: ${kind}`);
}
assert.deepEqual(interactionKinds, ["gx", "map03", "abstract07", "map08", "space10"], "interactive modes must keep the canon order");

const modeScenes = scenes.filter((scene) => /^mode\d+/u.test(scene.id));
assert.deepEqual(modeScenes.map((scene) => scene.modeIndex), [2, 6, 7, 9], "only MODE 03, 07, 08, and 10 are required story modes");

const choices = scenes.flatMap((scene) => scene.steps || []).filter((step) => step.type === "choice");
const editorial = choices.find((step) => step.choiceId === "editorial_choice");
const visitor = choices.find((step) => step.choiceId === "visitor_action");
assert.deepEqual(editorial?.options.map((option) => option.value), ["SOURCE_RECORD", "DISCLOSE_DERIVATION"]);
assert.deepEqual(visitor?.options.map((option) => option.value), ["WRITE", "LEAVE_EMPTY"]);
assert.equal(story.finalResults.length, 4, "four equal final results are required");

assert.equal(story.visitorInput?.maxLength, 120, "visitor input must be limited to 120 characters");
assert.equal(story.visitorInput?.persistent, false, "visitor input must not be persistent");
assert.ok(!story.saveFields.some((field) => /visitor.*(text|post)/iu.test(field)), "visitor post text must not be a save field");

const serialized = JSON.stringify(story);
for (const forbidden of ["gap_decision", "gap_source", "gap_derived", "END_SOURCE", "END_DERIVED", "END_SCENARIO", "TRUE END", "GOOD END", "4.8"]) {
  assert.ok(!serialized.includes(forbidden), `legacy story token must not remain: ${forbidden}`);
}

const allText = scenes.flatMap((scene) => scene.steps || []).map((step) => step.text || "").join("\n");
for (const requiredText of [
  "この端末は、進行と選んだ項目を会期中の件数として記録します。",
  "真ん中の椅子には、誰も座っていない。",
  "うん。今日、はじめまして。",
  "森と雨が重なる場所があります。原因はこの画面だけでは決められません。",
  "もし地球の声が聞こえたと思ったら、すぐに意味を決めるんじゃなくて――",
  "「聞こえたつもりになってない？」って、三人で確かめたい。",
  "この展示を見た現在の記録を、残したい場合だけ一行書いてください。",
  "どちらにも本文は入っていない。",
]) {
  assert.ok(allText.includes(requiredText), `canon text is missing: ${requiredText}`);
}

const sourceCard = scenes.flatMap((scene) => scene.steps || []).find((step) => step.id === "mode07_abstract_005");
const derivedCards = scenes.flatMap((scene) => scene.steps || []).filter((step) => step.sceneId === "mode07_abstract" && step.recordType === "DERIVED");
assert.ok(sourceCard || allText.includes("観測記録 / SOURCE"), "MODE 07 SOURCE must exist");
assert.ok(derivedCards.length > 0, "MODE 07 DERIVED must exist separately");
assert.ok(story.generationDetails?.model, "generation details must be collapsible data");

const runtime = fs.readFileSync(runtimePath, "utf8");
assert.ok(!/localStorage\.setItem\([^\n]+visitor(?:Post)?Text/iu.test(runtime), "visitor input must not be written to localStorage");
assert.ok(!/console\.(?:log|error|warn)\([^\n]+visitor/iu.test(runtime), "visitor input must not be logged");

console.log(`novel story check passed: ${scenes.length} scenes, ${stepIds.length} stable steps, 4 final results`);
