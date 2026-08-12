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
  ["orphan page uses bounded token transfer", /maximumMove = Math\.min\(16,/u.test(runtime) && /moveCount <= maximumMove/u.test(runtime)],
  ["orphan transfer preserves source exactly", /`\$\{before\}\$\{after\}` !== combined/u.test(runtime)],
  ["orphan transfer keeps both pages bounded", /beforeMetrics\.fits \|\| !afterMetrics\.fits/u.test(runtime) && /afterMetrics\.measuredLines\.length < 2/u.test(runtime)],
  ["sentence-safe boundary outranks punctuation", /candidates\.sort\(\(a, b\) => b\.quality - a\.quality \|\| a\.moveCount - b\.moveCount\)/u.test(runtime)],
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

const boundedTokenTransfers = (leftTokens, right, limit = 16) => {
  const combined = `${leftTokens.join("")}${right}`;
  const candidates = [];
  const maximumMove = Math.min(limit, Math.max(0, leftTokens.length - 1));
  for (let moveCount = 1; moveCount <= maximumMove; moveCount += 1) {
    const splitIndex = leftTokens.length - moveCount;
    const movedTokens = leftTokens.slice(splitIndex);
    candidates.push({
      moveCount,
      before: leftTokens.slice(0, splitIndex).join(""),
      after: `${movedTokens.join("")}${right}`,
      movedTokens,
      combined,
    });
  }
  return candidates;
};

[
  {
    leftTokens: ["「『GAIA", " ", "Transformation』は、", "私たち", "『惑星の放課後』が、", "この", "システムの", "ため", "につくった", "言葉ですの。", "生命が", "地球を", "変え、", "変わった", "地球が", "また", "生命を", "変えて", "きた。"],
    right: "その相互作用を表していますわ」",
  },
  {
    leftTokens: ["「温度、", "湿度、", "明るさ、", "気圧、", "空気中の", "粒子、", "音、", "振動。", "センサーを", "替えれば、", "もっと", "いろいろ", "測れます。"],
    right: "いくつか組み合わせて、その場所の環境をまとめて記録することもできます」",
  },
].forEach(({ leftTokens, right }) => {
  const candidates = boundedTokenTransfers(leftTokens, right);
  assert.equal(candidates.length, Math.min(16, leftTokens.length - 1));
  candidates.forEach((candidate) => {
    assert.equal(`${candidate.before}${candidate.after}`, candidate.combined, "bounded transfer must preserve source exactly");
    assert.deepEqual(candidate.movedTokens, leftTokens.slice(-candidate.moveCount), "bounded transfer must preserve atomic tokens");
    assert(candidate.moveCount >= 1 && candidate.moveCount <= 16, "bounded transfer must remain finite");
    assert(
      Math.max(...candidate.movedTokens.map((token) => Array.from(token).length))
        <= Math.max(...leftTokens.map((token) => Array.from(token).length)),
      "bounded transfer must not create a larger phrase token",
    );
  });
});

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
console.log(`VN Japanese typography static check passed: ${scans.length}/${scans.length}`);
