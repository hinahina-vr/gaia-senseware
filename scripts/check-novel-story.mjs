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
const expectedHash = "d9f81434a1fe5d24397e60e887cbc15f071cf2badb1ed3bd734d936f312e68c0";
const expectedSceneIds = ["festival_concept", "map_mode01", "gx_experience", "esp32_pitch", "circle_invitation", "welcome_chat"];
const expectedSceneCounts = [76, 43, 58, 43, 81, 95];

const sha256 = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const canonBytes = fs.readFileSync(canonPath);
const retainedBytes = fs.readFileSync(retainedPath);
assert.equal(canonBytes.length, 56353, "freeze正本のbytesが変わりました");
assert.equal(sha256(canonBytes), expectedHash, "story/物語台本.mdがfreeze入力と一致しません");
assert.ok(canonBytes.equals(retainedBytes), "repo保持版が正本と一致しません");
const canonSource = new TextDecoder("utf-8", { fatal: true }).decode(canonBytes);
assert.equal(canonSource.split("\n").length, 1020, "freeze正本は1019 content lines + trailing LFである必要があります");
assert.equal(canonSource.endsWith("\n"), true, "freeze正本のtrailing LFがありません");
const prohibitedRemainingPhrase = ["だけが", "残った"].join("");
assert.equal(canonSource.includes(prohibitedRemainingPhrase), false, "指定NG表現がfreeze正本に残っています");

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
const userVisibleSteps = steps.filter((step) => ["dialogue", "narration", "ui"].includes(step.type));
const prohibitedPlacementVerb = /置(?:く|か(?:ない|な|せ|ず|ぬ|れ|ろ|ん|せる|れる)?|き|け|こ|い(?:た|て|てある|ていた|ておく)?)/u;
assert.deepEqual(
  userVisibleSteps.filter((step) => prohibitedPlacementVerb.test(String(step.text || ""))).map((step) => step.id),
  [],
  "ユーザー可視台本に動詞『置く』の活用形が残っています",
);
const festival = story.scenes.find((scene) => scene.id === "festival_concept");
const storyText = steps.map((step) => String(step.text || "")).join("\n");
assert.equal(storyText.includes(prohibitedRemainingPhrase), false, "指定NG表現が生成済みストーリーに残っています");
assert.doesNotMatch(storyText, /ものづくり|ほどけ/u, "今回の対象文脈で使用しない表現が残っています");
assert.equal(storyText.split("あめと、みず。本名ではなく、学内で使っている名前らしい。オンラインの大学では、そのほうが自然だった。").length - 1, 0, "旧festival_concept_024全文が残っています");
assert.equal(storyText.split("あめと、みず。空から地上へ、二人の名前だけでひとつの流れができていた。本名ではなく、学内で使っている名前らしい。オンラインの大学では、そのほうが自然だった。").length - 1, 1, "festival_concept_024決定稿はexact1件必要です");
assert.equal(storyText.split("雨が降って、水になる。二人の名前を並べると、偶然にしては出来すぎていた。").length - 1, 0, "撤回された所感が残っています");
assert.deepEqual(
  festival.steps.slice(20, 27).map((step) => [step.id, step.type, step.speaker || null, step.speakerLabel || null, step.text]),
  [
    ["festival_concept_021", "dialogue", "amane", "女の子", "「改めまして、私は『あめ』です」"],
    ["festival_concept_022", "narration", "narrator", null, "「あめ」と名乗っても、照れたり笑ったりはしなかった。柔らかな響きとは対照的に、言葉は簡潔だった。"],
    ["festival_concept_023", "dialogue", "mizuha", "もう一人の女の子", "「みず」と申します。あなたも、うちの大学の方ですの？"],
    ["festival_concept_024", "narration", "narrator", null, "あめと、みず。空から地上へ、二人の名前だけでひとつの流れができていた。本名ではなく、学内で使っている名前らしい。オンラインの大学では、そのほうが自然だった。"],
    ["festival_concept_025", "narration", "narrator", null, "長い髪の学生もタブレットから顔を上げた。表情は落ち着いているが、「うちの大学」と言ったところで眉が少し上がる。答えを予想するより、こちらの返事を楽しみにしているように見えた。"],
    ["festival_concept_026", "narration", "narrator", null, "あめは名乗ったあとも、机の端のケーブルを指先で確かめている。みずはタブレットを両手で持ち、返事を待つあいだ、わずかに首を傾けていた。地球の青い光が、長い髪の内側へ薄く映っている。"],
    ["festival_concept_027", "dialogue", "visitor", "プレイヤー", "「はい。同じ大学の学生です。今日は学生作品を見に来ました。通路から見えた、この地球が気になって」"],
  ],
  "festival_concept_021–027の決定稿または順序が変わりました",
);
story.scenes.forEach((scene, sceneIndex) => {
  const expectedDates = Array(6).fill("10月3日（土）");
  const expectedTimes = ["AM 9:20–9:40", "AM 9:40–9:45", "AM 9:45–9:53", "AM 9:53–10:00", "AM 10:00–10:07", "AM 10:07–10:45"];
  assert.equal(scene.nextSceneId, story.scenes[sceneIndex + 1]?.id || null, `${scene.id}: nextSceneIdが不正です`);
  assert.equal(scene.duration, ["0:00–1:45", "1:45–3:25", "3:25–5:35", "5:35–7:15", "7:15–9:05", "9:05–11:30"][sceneIndex]);
  assert.equal(scene.date, expectedDates[sceneIndex]);
  assert.equal(scene.time, expectedTimes[sceneIndex]);
  assert.equal(scene.temporal.displayTitle, `${expectedDates[sceneIndex]} ${expectedTimes[sceneIndex]}｜${scene.location}`);
  assert.equal(scene.temporal.temporalContext, "CURRENT");
  assert.equal(scene.temporal.timePrecision, "MINUTE");
  assert.equal(Object.hasOwn(scene.temporal, "startAt"), false, `${scene.id}: 表示時刻から未定義のISO日時を補完してはいけません`);
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
assert.equal(welcome.steps[6].text, "ESP32に詳しい。参加者が測った温度や湿度をGAIA SENSEWAREに表示する案を出してくれたよ。", "welcome_chat_007の紹介文が決定稿と一致しません");
assert.equal(welcome.steps[14].text, "まだ会ったことのないsakuから、短いメッセージが届いた。", "welcome_chat_015の導入文が決定稿と一致しません");
assert.equal(welcome.steps[62].text, "地球の未来を考えたい。ESP32をつなぎたい。二人にまた会いたい。どれも同じくらい本当だった。周囲では、午前枠を終えた学生たちが機材を箱へ戻し始めていた。", "welcome_chat_063の午前展示枠終了へのつなぎが決定稿と一致しません");
assert.equal(welcome.steps[63].text, "「私たちも、そろそろ片づけます。展示画面を消しますね」", "welcome_chat_064の終了案内が決定稿と一致しません");
assert.equal(welcome.steps[67].text, "黒い画面の中で、私たち三人の視線が交わった。", "welcome_chat_068の決定稿が一致しません");
assert.equal(welcome.steps[83].text, "その二行が、今日の展示で見てきたものと、これから始める観測をつないだ。", "welcome_chat_084の受けが決定稿と一致しません");
assert.equal(welcome.steps[91].text, "スマートフォンをポケットへ戻す。顔を上げると、隣を歩く二人と目が合った。", "welcome_chat_092の動作が決定稿と一致しません");
assert.ok(welcome.steps.slice(3, 40).some((step) => step.type === "chat"), "welcome_chat wide chat区間がありません");
assert.ok(welcome.steps.slice(54, 77).some((step) => step.type === "dialogue"), "welcome_chat物理会話区間がありません");
assert.deepEqual(welcome.steps.slice(80, 83).map((step) => [step.id, step.type, step.speaker]), [
  ["welcome_chat_081", "chat", "sakuya"],
  ["welcome_chat_082", "chat", "sakuya"],
  ["welcome_chat_083", "chat", "sakuya"],
], "午前展示枠終了後のmobile chat境界が変わりました");

const novelModeSource = fs.readFileSync(path.join(projectRoot, "novel-mode.js"), "utf8");
assert.match(novelModeSource, /Number\(sourceVersion\) < 10\) return firstStepForScene\(story\.startSceneId\)/u, "v9以前はfestival_concept_001へ安全移行する必要があります");
assert.match(novelModeSource, /const resetsLegacyProgress = sourceVersion < 10/u, "旧進行を新routeへ持ち込んではいけません");
assert.match(novelModeSource, /normalized\.audio = \{[\s\S]*?candidate\.audio/u, "旧saveの音量・mute設定を保持する必要があります");
assert.match(novelModeSource, /demo_interest:\s*"demoInterest"/u, "短尺3択の保存fieldがありません");
assert.match(novelModeSource, /replaceAll\("\{\{demo_interest\}\}"/u, "選択結果placeholderの表示処理がありません");
assert.ok(story.saveFields.includes("demoInterest"));

console.log(`contest v10 story check passed: ${story.scenes.length} scenes, ${steps.length} steps, freeze ${expectedHash}`);
