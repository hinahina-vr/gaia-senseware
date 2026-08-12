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
const expectedHash = "09c9cd2dd23fba17ef6c5be67e0cbb93d2d64bb357b28cd81962754bb0a7fffb";
const expectedSceneIds = ["festival_concept", "map_mode01", "gx_experience", "esp32_pitch", "circle_invitation", "welcome_chat"];
const expectedSceneCounts = [76, 43, 58, 43, 81, 95];

const sha256 = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const canonBytes = fs.readFileSync(canonPath);
const retainedBytes = fs.readFileSync(retainedPath);
assert.equal(canonBytes.length, 53591, "freeze正本のbytesが変わりました");
assert.equal(sha256(canonBytes), expectedHash, "story/物語台本.mdがfreeze入力と一致しません");
assert.ok(canonBytes.equals(retainedBytes), "repo保持版が正本と一致しません");
const canonSource = new TextDecoder("utf-8", { fatal: true }).decode(canonBytes);
assert.equal(canonSource.split("\n").length, 1020, "freeze正本は1019 content lines + trailing LFである必要があります");
assert.equal(canonSource.endsWith("\n"), true, "freeze正本のtrailing LFがありません");

delete globalThis.GAIA_NOVEL_STORY;
delete globalThis.GAIA_NOVEL_STORY_V6;
await import(`${pathToFileURL(dataPath).href}?check=${Date.now()}`);
const story = globalThis.GAIA_NOVEL_STORY;
assert.ok(story, "GAIA_NOVEL_STORYを読み込めません");
assert.equal(story.storyVersion, 10);
assert.equal(story.sourceSha256, expectedHash);
assert.equal(story.startSceneId, "festival_concept");
assert.deepEqual(story.requiredSceneIds, expectedSceneIds);
assert.deepEqual(story.temporal.sceneOrder, expectedSceneIds);
assert.deepEqual(story.scenes.map((scene) => scene.id), expectedSceneIds);
assert.deepEqual(story.scenes.map((scene) => scene.steps.length), expectedSceneCounts);

const sourceSceneIds = [...canonSource.matchAll(/^<!-- scene-meta\n([\s\S]*?)\n-->/gmu)].map((match) => JSON.parse(match[1]).id);
assert.deepEqual(sourceSceneIds, expectedSceneIds, "scene-meta IDまたは順序がfreeze入力と一致しません");
assert.equal(story.scenes.length, 6);
const steps = story.scenes.flatMap((scene) => scene.steps);
assert.equal(steps.length, 396, "短尺正本は394 source block + 2 interaction stepである必要があります");
assert.equal(new Set(steps.map((step) => step.id)).size, steps.length, "step IDが重複しています");
story.scenes.forEach((scene, sceneIndex) => {
  assert.equal(scene.nextSceneId, story.scenes[sceneIndex + 1]?.id || null, `${scene.id}: nextSceneIdが不正です`);
  assert.equal(scene.duration, ["0:00–1:45", "1:45–3:25", "3:25–5:35", "5:35–7:15", "7:15–9:05", "9:05–11:30"][sceneIndex]);
  assert.equal(scene.temporal.temporalContext, "CURRENT");
  assert.equal(scene.temporal.timePrecision, "APPROXIMATE");
  assert.equal(Object.hasOwn(scene.temporal, "startAt"), false, `${scene.id}: freeze入力にない絶対日時を補完してはいけません`);
  scene.steps.forEach((step, index) => {
    assert.equal(step.id, `${scene.id}_${String(index + 1).padStart(3, "0")}`);
    assert.equal(step.sceneId, scene.id);
  });
});

const interactions = steps.filter((step) => step.type === "interaction");
assert.deepEqual(interactions.map((step) => [step.id, step.interaction.kind]), [
  ["map_mode01_004", "map01"],
  ["gx_experience_017", "gx"],
]);
assert.deepEqual(story.requiredInteractions, ["map01", "gx"]);
assert.deepEqual(interactions[0].interaction, {
  kind: "map01",
  modeIndex: 0,
  modeId: "breathing-earth",
  requiredViews: ["long_term", "temperature_anomaly"],
});
assert.equal(story.scenes.find((scene) => scene.id === "map_mode01").steps[2].speaker, "amane", "MAP01 PREPはアマネの操作案内です");
assert.equal(story.scenes.find((scene) => scene.id === "map_mode01").steps[4].type, "narration", "MAP01 return stepがありません");
assert.equal(story.scenes.find((scene) => scene.id === "gx_experience").steps[15].speaker, "mizuha", "GX PREPはミズハの案内です");
assert.equal(story.scenes.find((scene) => scene.id === "gx_experience").steps[17].type, "narration", "GX return stepがありません");

const choice = steps.find((step) => step.choiceId === "demo_interest");
assert.equal(choice.id, "gx_experience_046");
assert.deepEqual(choice.options.map((option) => option.label), ["太古の海", "CO2の季節変動", "気温偏差の地図"]);
assert.equal(steps.some((step) => ["reflectionChoice", "result", "end"].includes(step.type)), false, "旧後半の選択・結果stepが本編へ残っています");
assert.equal(steps.some((step) => ["map03", "abstract07", "map08", "space10"].includes(step.interaction?.kind)), false, "旧MODE interactionが本編へ残っています");

const sakuyaSteps = steps.filter((step) => step.speaker === "sakuya");
assert.ok(sakuyaSteps.length > 0, "sakuのchatがありません");
assert.ok(sakuyaSteps.every((step) => step.sceneId === "welcome_chat" && step.type === "chat"), "sakuはwelcome_chatの文字chat以外へ登場できません");
assert.ok(!JSON.stringify(story).includes("mode_catalog"), "不採用scene ID mode_catalogが残っています");
assert.equal(story.scenes.some((scene) => scene.id === "invitation"), false, "不採用scene ID invitationが残っています");
assert.equal(story.scenes.some((scene) => scene.id === "current_exhibition"), false, "旧1022step routeが残っています");

const welcome = story.scenes.find((scene) => scene.id === "welcome_chat");
assert.equal(welcome.steps[0].type, "chatSurface");
assert.ok(welcome.steps.slice(3, 40).some((step) => step.type === "chat"), "welcome_chat wide chat区間がありません");
assert.ok(welcome.steps.slice(54, 77).some((step) => step.type === "dialogue"), "welcome_chat物理会話区間がありません");
assert.deepEqual(welcome.steps.slice(80, 83).map((step) => [step.id, step.type, step.speaker]), [
  ["welcome_chat_081", "chat", "sakuya"],
  ["welcome_chat_082", "chat", "sakuya"],
  ["welcome_chat_083", "chat", "sakuya"],
], "閉場後展示ホールのmobile chat境界が変わりました");

const novelModeSource = fs.readFileSync(path.join(projectRoot, "novel-mode.js"), "utf8");
assert.match(novelModeSource, /Number\(sourceVersion\) < 10\) return firstStepForScene\(story\.startSceneId\)/u, "v9以前はfestival_concept_001へ安全移行する必要があります");
assert.match(novelModeSource, /const resetsLegacyProgress = sourceVersion < 10/u, "旧進行を新routeへ持ち込んではいけません");
assert.match(novelModeSource, /normalized\.audio = \{[\s\S]*?candidate\.audio/u, "旧saveの音量・mute設定を保持する必要があります");
assert.match(novelModeSource, /demo_interest:\s*"demoInterest"/u, "短尺3択の保存fieldがありません");
assert.match(novelModeSource, /replaceAll\("\{\{demo_interest\}\}"/u, "選択結果placeholderの表示処理がありません");
assert.ok(story.saveFields.includes("demoInterest"));

console.log(`contest v10 story check passed: ${story.scenes.length} scenes, ${steps.length} steps, freeze ${expectedHash}`);
