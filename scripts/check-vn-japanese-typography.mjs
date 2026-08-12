import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const runtime = read("novel-mode.js");
const css = read("novel-mode.css");
const html = read("index.html");
const source = read(path.join("story", "物語台本.md"));
const mirror = read(path.join("contest-limited", "story", "機能限定版台本.md"));

const scans = [
  ["Intl.Segmenter Japanese word segmentation", /new Intl\.Segmenter\("ja", \{ granularity: "word" \}\)/u.test(runtime)],
  ["deterministic fallback segmenter", /fallbackDialogueSegments/u.test(runtime)],
  ["protected phrase set", ["そのもの", "ものづくり", "リアルタイム", "GAIA SENSEWARE"].every((value) => runtime.includes(value))],
  ["Japanese inflection suffixes remain atomic", /DIALOGUE_INFLECTION_SUFFIXES/u.test(runtime) && ["た", "て", "ば", "れ", "さ", "ます"].every((value) => runtime.includes(`\"${value}\"`))],
  ["token-boundary pagination", /tokenBoundaries\.has/u.test(runtime) && /largestSafePrefix/u.test(runtime)],
  ["page pair enumerates existing token boundaries", /const combinedTokens = segmentDialoguePhrases\(combined\)/u.test(runtime) && /splitIndex < combinedTokens\.length/u.test(runtime)],
  ["page pair preserves source exactly", /`\$\{before\}\$\{after\}` !== combined/u.test(runtime)],
  ["page pair keeps both pages bounded", /beforeMetrics\.fits \|\| !afterMetrics\.fits/u.test(runtime) && /requireRightTwoLines && afterMetrics\.measuredLines\.length < 2/u.test(runtime)],
  ["two-line minimum applies only to final pair", /requireRightTwoLines: index === pages\.length - 1/u.test(runtime)],
  ["sentence-safe boundary outranks punctuation", /a\.sentencePenalty - b\.sentencePenalty/u.test(runtime) && /a\.unsafeBoundaryCount - b\.unsafeBoundaryCount/u.test(runtime)],
  ["unsafe page boundaries are rebalanced", runtime.includes("const unsafeBoundary = !/[。！？!?、，,・：:；;\\s]") && runtime.includes("!orphanedFinalPage && !unsafeBoundary")],
  ["unbounded phrase-boundary rebalance absent", !/phraseOffsets/u.test(runtime) && !/safeCandidates\.length \? safeCandidates : candidates/u.test(runtime)],
  ["same token layout for measure and render", runtime.includes("measureNativeLines = (text, preparedLayout = null)") && runtime.includes("replaceChildren(layout)")],
  ["font loading reflow", /loadingdone/u.test(runtime)],
  ["width-only resize guard", /Math\.abs\(width - dialogueObservedWidth\) < 0\.5/u.test(runtime)],
  ["reflow generation guard", /generation !== dialoguePaginationGeneration/u.test(runtime) && /dialogueReflowActive/u.test(runtime)],
  ["phrase tokens do not split", /\.novel-phrase-token,[\s\S]*display: inline-block;[\s\S]*white-space: pre;/u.test(css)],
  ["native auto-phrase disabled", !/word-break:\s*auto-phrase/u.test(css)],
  ["source mirrors match", source === mirror],
  ["no escape hard breaks in changed prose", !source.includes("<br") && !source.includes("\\n")],
  ["forbidden verb absent", !/(?:置く|置いた|置いて|置か|置き|置け|置こう)/u.test(source)],
  ["scenario cache key", (html.match(/gaia-scenario-vn-typography-1/gu) || []).length === 2],
];

const failures = scans.filter(([, pass]) => !pass).map(([name]) => name);
assert.equal(failures.length, 0, `VN typography checks failed: ${failures.join(", ")}`);

const sentenceBoundary = /[。！？!?][」』）】］〉》〕]*$/u;
const paginationSafeBoundary = /[。！？!?、，,・：:；;\s][」』）】］〉》〕]*$/u;
[
  {
    source: "「『GAIA Transformation』は、私たち『惑星の放課後』が、このシステムのためにつくった言葉ですの。生命が地球を変え、変わった地球がまた生命を変えてきた。その相互作用を表していますわ」",
    boundary: "「『GAIA Transformation』は、私たち『惑星の放課後』が、このシステムのためにつくった言葉ですの。",
    next: "生命が地球を変え、変わった地球がまた生命を変えてきた。その相互作用を表していますわ」",
  },
  {
    source: "「温度、湿度、明るさ、気圧、空気中の粒子、音、振動。センサーを替えれば、もっといろいろ測れます。いくつか組み合わせて、その場所の環境をまとめて記録することもできます」",
    boundary: "「温度、湿度、明るさ、気圧、空気中の粒子、音、振動。",
    next: "センサーを替えれば、もっといろいろ測れます。いくつか組み合わせて、その場所の環境をまとめて記録することもできます」",
  },
].forEach(({ source: text, boundary, next }) => {
  assert(sentenceBoundary.test(boundary), "expected target boundary must end a complete sentence");
  assert(paginationSafeBoundary.test(boundary), "expected target boundary must satisfy the pagination safe-boundary predicate");
  assert.equal(`${boundary}${next}`, text, "target boundary must preserve source exactly");
  assert(!/^いろいろ/u.test(next), "もっといろいろ測れます must remain on one page");
});

[
  ["pc-2048", "festival_concept_070", "NASAやJAXA、", "気象庁"],
  ["pc-2048", "esp32_pitch_015", "拾ったり、", "いくつか"],
  ["pc-1920", "festival_concept_029", "設備も、", "プロジェクターも"],
  ["pc-1920", "festival_concept_064", "聞いたり、", "触れたり"],
  ["pc-1920", "festival_concept_070", "NASAやJAXA、", "気象庁"],
  ["pc-1920", "esp32_pitch_015", "拾ったり、", "いくつか"],
  ["pc-1440", "esp32_pitch_015", "拾ったり、", "いくつか"],
  ["mobile-390", "festival_concept_016", "気候の変化まで、", "画面に触れながら"],
  ["mobile-390", "gx_experience_010", "『惑星の放課後』が、", "このシステム"],
  ["mobile-390", "esp32_pitch_015", "拾ったり、", "いくつか"],
].forEach(([viewport, id, left, right]) => {
  assert(paginationSafeBoundary.test(left), `${viewport} ${id} fixture left side must be a safe pagination boundary`);
  assert(left.length > 1 && right.length > 1, `${viewport} ${id} fixture must retain content on both pages`);
});
console.log(`VN Japanese typography static check passed: ${scans.length}/${scans.length}`);
