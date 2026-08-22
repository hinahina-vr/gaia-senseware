import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { TextDecoder } from "node:util";
import { fileURLToPath, pathToFileURL } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const canonPath = path.join(projectRoot, "story", "物語台本.md");
const retainedPath = path.join(projectRoot, "contest-limited", "story", "機能限定版台本.md");
const dataPath = path.join(projectRoot, "novel-story-data.js");
const expectedHash = "27db292fbcfd2fc5130c9dcef8f33532ee0956abb559729347aa055dc5cd6b0c";
const expectedSceneIds = ["festival_concept", "map_mode01", "gx_experience", "esp32_pitch", "circle_invitation", "welcome_chat"];
const expectedSceneCounts = [76, 43, 48, 43, 81, 95];
const expectedPlayableCounts = [33, 22, 20, 22, 24, 26];

const sha256 = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const canonBytes = fs.readFileSync(canonPath);
const retainedBytes = fs.readFileSync(retainedPath);
assert.equal(sha256(canonBytes), expectedHash, "freeze入力を直接変更してはいけません");
assert.ok(canonBytes.equals(retainedBytes), "repo保持版とfreeze入力が一致しません");
const canonSource = new TextDecoder("utf-8", { fatal: true }).decode(canonBytes);
assert.equal(canonSource.endsWith("\n"), true, "freeze入力のtrailing LFがありません");

delete globalThis.GAIA_NOVEL_STORY;
delete globalThis.GAIA_NOVEL_STORY_V6;
await import(`${pathToFileURL(dataPath).href}?check=${Date.now()}`);
const story = globalThis.GAIA_NOVEL_STORY;
assert.ok(story, "GAIA_NOVEL_STORYを読み込めません");
assert.equal(story.storyVersion, 11);
assert.equal(story.sourceSha256, expectedHash);
assert.equal(story.revisionId, "story-improvement-alt2-20260823");
assert.equal(story.startSceneId, "festival_concept");
assert.deepEqual(story.requiredSceneIds, expectedSceneIds);
assert.deepEqual(story.scenes.map((scene) => scene.id), expectedSceneIds);
assert.deepEqual(story.scenes.map((scene) => scene.steps.length), expectedSceneCounts);

const sourceSceneIds = [...canonSource.matchAll(/^<!-- scene-meta\n([\s\S]*?)\n-->/gmu)].map((match) => JSON.parse(match[1]).id);
assert.deepEqual(sourceSceneIds, expectedSceneIds);
const steps = story.scenes.flatMap((scene) => scene.steps);
assert.equal(steps.length, 386, "安定IDスロット数が変わりました");
assert.equal(new Set(steps.map((step) => step.id)).size, steps.length, "step IDが重複しています");
assert.deepEqual(
  story.scenes.map((scene) => scene.steps.filter((step) => !["phase", "chatSurface"].includes(step.type)).length),
  expectedPlayableCounts,
  "第2稿の可視ビート数が変わりました",
);

story.scenes.forEach((scene, sceneIndex) => {
  assert.equal(scene.nextSceneId, story.scenes[sceneIndex + 1]?.id || null);
  scene.steps.forEach((step, index) => {
    const stepNumber = scene.id === "gx_experience" && index >= 44 ? index + 11 : index + 1;
    assert.equal(step.id, `${scene.id}_${String(stepNumber).padStart(3, "0")}`);
    assert.equal(step.sceneId, scene.id);
  });
});

const interactions = steps.filter((step) => step.type === "interaction");
assert.deepEqual(interactions.map((step) => [step.id, step.interaction.kind]), [
  ["map_mode01_004", "map01"],
  ["map_mode01_023", "map01"],
  ["gx_experience_017", "gx"],
]);
assert.deepEqual(interactions[1].interaction.requiredViews, ["long_term", "temperature_anomaly"]);
assert.equal(interactions[1].interaction.phase, "temperature-anomaly");

const storyText = steps.filter((step) => step.type !== "phase").map((step) => String(step.text || "")).join("\n");
for (const phrase of [
  "みずと、あめ。画面で見た名前が、初めて声と結びついた。",
  "似て見えるだけで関係があるとは限らない",
  "地球そのものの呼吸ではなく、観測された濃度の変化",
  "表示は約46億年前で止まる",
  "時間を進め、約27億年前の海へ移動する",
  "届かなかった一回も残します",
  "作っている人たちの集まりは、〈惑星の放課後〉",
  "最初の値は“時刻未確認”",
  "記録は、次の観測を待っています。",
]) assert.ok(storyText.includes(phrase), `第2稿の必須文がありません: ${phrase}`);
assert.doesNotMatch(storyText, /三人は、同じ未来|宇宙は一つの意識/u);

const sakuSteps = steps.filter((step) => step.speaker === "sakuya" && step.type !== "phase");
assert.ok(sakuSteps.length > 0);
assert.ok(sakuSteps.every((step) => step.type === "chat"), "PART Iのsakuは文字チャット以外へ登場できません");
assert.equal(steps.find((step) => step.id === "welcome_chat_001").type, "chatSurface");
assert.equal(steps.find((step) => step.id === "welcome_chat_095").text, "AFTER SCHOOL SESSION 01 / COMPLETE");

const novelModeSource = fs.readFileSync(path.join(projectRoot, "novel-mode.js"), "utf8");
assert.match(novelModeSource, /Number\(sourceVersion\) < 11\) return firstStepForScene\(story\.startSceneId\)/u);
assert.match(novelModeSource, /const resetsLegacyProgress = sourceVersion < 11/u);
assert.match(novelModeSource, /step\.id === "welcome_chat_095"\) return renderIntermission\(step\)/u);
assert.match(novelModeSource, /renderStaffRoll\(stepMap\.get\(ENDING_STEP_ID\), \{ afterTrueEnd: true \}\)/u);

console.log(`story improvement check passed: ${expectedPlayableCounts.reduce((sum, count) => sum + count, 0)} playable beats in ${story.scenes.length} scenes`);
