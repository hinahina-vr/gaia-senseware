import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (name) => fs.readFileSync(path.join(root, name), "utf8");
const html = read("index.html");
const gx = read("gx-mode.js");
const gxStyles = read("gx-mode.css");
const novel = read("novel-mode.js");

assert.match(novel, /if \(!\["map01", "gx"\]\.includes\(step\.interaction\.kind\)\) \{/u);
assert.doesNotMatch(novel, /水面の操作[^\n]*\/ 3/u);
assert.doesNotMatch(novel, /kind === "gx" && motionReduced\(\)/u);
assert.doesNotMatch(novel, /event\.detail\?\.complete \|\| detourState\.gestureCount >= 3/u);
assert.match(novel, /if \(event\.detail\?\.complete === true\) state\.viewed\.gxDeepTime = true;/u);

assert.match(gx, /let storySequenceComplete = false;/u);
assert.match(gx, /if \(storyDetourActive && !storySequenceComplete\) return;/u);
assert.match(gx, /if \(isFinalPhase && storyDetourActive\) \{\s*storySequenceComplete = true;\s*emitStoryProgress\(true\);/u);
assert.match(gx, /if \(completedPhase === exhibit\.phases\.length - 1\) closeGX\(\);/u);
assert.match(gx, /completeEraTransition\(phaseIndex\);/u);
assert.doesNotMatch(gx, /storyGestureCount < 3/u);
assert.doesNotMatch(gx, /storyGestureCount >= 3/u);
assert.match(gx, /event\.key === "Enter" \|\| event\.key === " "/u);

assert.match(html, /id="gx-era-transition-skip"[\s\S]{0,240}<span>スキップ<\/span>/u);
assert.match(html, /gx-mode\.js\?v=gaia-gx-transition-skip-1/u);
assert.match(html, /novel-mode\.js\?v=gaia-finale-sunset-1/u);
assert.match(html, /gx-mode\.css\?v=gaia-gx-card-one-line-1/u);
assert.match(gxStyles, /\.gx-era-transition strong \{[\s\S]*?font-size: clamp\(12px, 2vw, 38px\);[\s\S]*?white-space: nowrap;/u);
assert.match(gxStyles, /\.gx-era-transition-skip \{[\s\S]*?min-height: 48px;/u);
assert.match(gxStyles, /@media \(min-width: 1600px\) \{[\s\S]*?\.gx-layer\[data-return-to="novel"\] \.gx-story-card h3 \{[\s\S]*?white-space: nowrap;/u);
assert.match(gxStyles, /body\.gx-story-open \.gx-layer\[data-return-to="novel"\]\[data-phase="gaia-transformation"\] \.gx-story-card \{\s*width: min\(54%, 720px\);/u);

console.log(JSON.stringify({ status: "passed", behavior: "gx-final-phase-auto-return" }, null, 2));
