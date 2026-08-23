import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { readApprovedStoryScript } from "./approved-story-script.mjs";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const canonPath = path.join(projectRoot, "story", "物語台本.md");
const retainedPath = path.join(projectRoot, "contest-limited", "story", "limited-feature-script.md");
const dataPath = path.join(projectRoot, "novel-story-data.js");
const expectedFreezeHash = "27db292fbcfd2fc5130c9dcef8f33532ee0956abb559729347aa055dc5cd6b0c";
const expectedApprovedHash = "2ef34f5d4dda6e38227e638e76506a03072445ef55b616ff1894314816aeba3f";
const expectedSceneIds = ["festival_concept", "map_mode01", "gx_experience", "esp32_pitch", "circle_invitation", "welcome_chat"];
const expectedSceneCounts = [73, 43, 46, 50, 79, 83];
const sha256 = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");

const canonBytes = fs.readFileSync(canonPath);
const retainedBytes = fs.readFileSync(retainedPath);
assert.equal(sha256(canonBytes), expectedFreezeHash, "story/物語台本.mdがfreeze入力と一致しません");
assert.ok(canonBytes.equals(retainedBytes), "repo保持版がfreeze正本と一致しません");

delete globalThis.GAIA_NOVEL_STORY;
delete globalThis.GAIA_NOVEL_STORY_V6;
await import(`${pathToFileURL(dataPath).href}?check=${Date.now()}`);
const story = globalThis.GAIA_NOVEL_STORY;
const approved = readApprovedStoryScript();
assert.ok(story, "GAIA_NOVEL_STORYを読み込めません");
assert.equal(story.storyVersion, 13);
assert.equal(story.sourceSha256, expectedFreezeHash);
assert.equal(story.approvedSourceSha256, expectedApprovedHash);
assert.equal(approved.sha256, expectedApprovedHash);
assert.equal(story.revisionId, "approved-script-20260824");
assert.deepEqual(story.scenes.map((scene) => scene.id), expectedSceneIds);
assert.deepEqual(story.requiredSceneIds, expectedSceneIds);
assert.deepEqual(story.temporal.sceneOrder, expectedSceneIds);
assert.deepEqual(story.scenes.map((scene) => scene.steps.length), expectedSceneCounts);

const steps = story.scenes.flatMap((scene) => scene.steps);
const stepMap = new Map(steps.map((step) => [step.id, step]));
assert.equal(steps.length, 374, "承認済み本文373件とスタッフロール接続1件が必要です");
assert.equal(stepMap.size, steps.length, "step IDが重複しています");
assert.equal(steps.at(-1).id, "welcome_chat_095", "スタッフロール接続が末尾にありません");

const kindToType = Object.freeze({ 地の文: "narration", 会話: "dialogue", 学内チャット: "chat", チャット画面: "chatSurface", 操作: "interaction" });
for (const approvedScene of approved.mainScenes) {
  const runtimeScene = story.scenes.find((scene) => scene.id === approvedScene.id);
  assert(runtimeScene, `${approvedScene.id}: runtime sceneがありません`);
  assert.equal(runtimeScene.chapter, approvedScene.chapter);
  assert.equal(runtimeScene.date, approvedScene.date);
  assert.equal(runtimeScene.time, approvedScene.time);
  assert.equal(runtimeScene.location, approvedScene.location);
  assert.deepEqual(
    runtimeScene.steps.slice(0, approvedScene.entries.length).map((step) => step.id),
    approvedScene.entries.map((entry) => entry.id),
    `${approvedScene.id}: 承認済みID順が変わりました`,
  );
  for (const entry of approvedScene.entries) {
    const step = stepMap.get(entry.id);
    assert(step, `${entry.id}: runtime stepがありません`);
    assert.equal(step.sceneId, approvedScene.id);
    assert.equal(step.type, kindToType[entry.kind], `${entry.id}: 種別が不正です`);
    assert.equal(step.text, step.type === "interaction" ? "" : entry.text, `${entry.id}: 承認済み本文と一致しません`);
    if (entry.time) assert.equal(step.time, entry.time, `${entry.id}: 時刻が一致しません`);
  }
}

const esp32Steps = story.scenes.find((scene) => scene.id === "esp32_pitch").steps;
const esp32LearningCurveStart = esp32Steps.findIndex((step) => step.id === "esp32_pitch_016");
assert.deepEqual(
  esp32Steps.slice(esp32LearningCurveStart, esp32LearningCurveStart + 10).map((step) => step.id),
  ["esp32_pitch_016", "esp32_pitch_016a", "esp32_pitch_016b", "esp32_pitch_016c", "esp32_pitch_016d", "esp32_pitch_016e", "esp32_pitch_016f", "esp32_pitch_016g", "esp32_pitch_016h", "esp32_pitch_016i"],
  "ESP32反論と再提案の学習曲線が崩れています",
);

assert.equal(stepMap.get("gx_experience_001").text, "表示は現在の地球から、太古の海を再現した映像へ自動で切り替わる。");
assert.match(stepMap.get("gx_experience_021").text, /約二十七億年前/u);
assert.doesNotMatch(stepMap.get("esp32_pitch_016").text, /時刻|設置条件/u);
assert.match(stepMap.get("circle_invitation_002").text, /連絡先も知らないまま/u);
assert.equal(stepMap.get("welcome_chat_077").text, "最初の一台はきっと失敗する。それでもみんなで直し、次の観測へ進めばいい。");

const interactions = steps.filter((step) => step.type === "interaction");
assert.deepEqual(interactions.map((step) => step.id), ["map_mode01_004", "map_mode01_023", "gx_experience_017"]);
assert.equal(stepMap.get("map_mode01_023").interaction.phase, "temperature-anomaly");
assert.deepEqual(story.requiredInteractions, ["map01", "gx"]);

const sakuyaSteps = steps.filter((step) => step.speaker === "sakuya");
assert(sakuyaSteps.length > 0, "sakuのchatがありません");
assert(sakuyaSteps.every((step) => step.sceneId === "welcome_chat" && step.type === "chat"), "sakuは学内チャット以外へ登場できません");
assert.equal(stepMap.get("welcome_chat_001").type, "chatSurface");
assert.deepEqual(["welcome_chat_081", "welcome_chat_082", "welcome_chat_083"].map((id) => stepMap.get(id)?.speaker), ["sakuya", "sakuya", "sakuya"]);

const storyText = steps.map((step) => String(step.text || "")).join("\n");
assert.doesNotMatch(storyText, /九人で直し|ただの見学者へ戻る|時代と地層の名/u);
assert.doesNotMatch(storyText, /照明を落とした一角|単管と暗幕|展示ホールの白い光/u);
assert.equal(storyText.includes("#GSW-esp32"), false);

story.scenes.forEach((scene, index) => {
  assert.equal(scene.nextSceneId, story.scenes[index + 1]?.id || null);
  assert.equal(scene.temporal.displayTitle, `${scene.date} ${scene.time}｜${scene.location}`);
  assert.equal(scene.temporal.temporalContext, "CURRENT");
  assert.equal(scene.temporal.timePrecision, "MINUTE");
});

const novelModeSource = fs.readFileSync(path.join(projectRoot, "novel-mode.js"), "utf8");
assert.match(novelModeSource, /Number\(sourceVersion\) < 13\) return firstStepForScene\(story\.startSceneId\)/u, "旧台本saveをv13の先頭へ移行する必要があります");
assert.match(novelModeSource, /const resetsLegacyProgress = sourceVersion < 13/u);
assert.match(novelModeSource, /normalized\.audio = \{[\s\S]*?candidate\.audio/u, "旧saveの音量・mute設定は保持する必要があります");

console.log(`approved story check passed: ${story.scenes.length} scenes, ${steps.length} runtime steps, source ${approved.sha256}`);
