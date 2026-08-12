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
  ["token-boundary pagination", /tokenBoundaries\.has/u.test(runtime) && /largestSafePrefix/u.test(runtime)],
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
console.log(`VN Japanese typography static check passed: ${scans.length}/${scans.length}`);
