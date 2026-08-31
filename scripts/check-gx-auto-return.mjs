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
const loader = read("gaia-mode-loader.js");

assert.match(novel, /if \(!\["map01", "gx"\]\.includes\(step\.interaction\.kind\)\) \{/u);
assert.doesNotMatch(novel, /水面の操作[^\n]*\/ 3/u);
assert.doesNotMatch(novel, /kind === "gx" && motionReduced\(\)/u);
assert.doesNotMatch(novel, /event\.detail\?\.complete \|\| detourState\.gestureCount >= 3/u);
assert.match(novel, /if \(event\.detail\?\.complete === true\) state\.viewed\.gxDeepTime = true;/u);

assert.match(gx, /let storySequenceComplete = false;/u);
assert.match(gx, /if \(storyDetourActive && !storySequenceComplete\) return;/u);
assert.match(gx, /if \(isFinalPhase && storyDetourActive\) \{\s*storySequenceComplete = true;\s*emitStoryProgress\(true\);/u);
assert.match(gx, /if \(completedPhase === exhibit\.phases\.length - 1\) closeGX\(\);/u);
assert.match(gx, /const skipGXModal = \(\) => \{[\s\S]*?storySequenceComplete = true;[\s\S]*?emitStoryProgress\(true\);[\s\S]*?closeGX\(\);/u);
assert.match(gx, /elements\.modalSkip\.addEventListener\("click", \(event\) => \{\s*event\.stopPropagation\(\);\s*skipGXModal\(\);/u);
assert.match(gx, /await loadExhibit\(\);\s*if \(!isOpen\) return;/u);
assert.doesNotMatch(gx, /eraTransitionSkip/u);
assert.doesNotMatch(gx, /storyGestureCount < 3/u);
assert.doesNotMatch(gx, /storyGestureCount >= 3/u);
assert.match(gx, /event\.key === "Enter" \|\| event\.key === " "/u);

assert.match(html, /id="gx-modal-skip"[\s\S]{0,240}aria-label="GXモーダルをスキップして戻る"[\s\S]{0,240}<b aria-hidden="true">◀<\/b><span>戻る<\/span>/u);
assert.match(gx, /elements\.modalSkip\.setAttribute\([\s\S]*?GXモーダルをスキップして\$\{returnTo === "novel" \? "ストーリー" : "入口"\}へ戻る/u);
assert.doesNotMatch(html, /id="gx-era-transition-skip"/u);
assert.match(loader, /gx-mode\.js\?v=gaia-gx-back-header-drop-1/u);
assert.match(loader, /novel-mode\.js\?v=gaia-staff-credits-1/u);
assert.match(loader, /gx-mode\.css\?v=gaia-gx-mobile-gesture-pass-through-1/u);
assert.match(gx, /const CLOSE_TRANSITION_MS = reducedMotion \? 0 : 340;/u);
assert.match(gx, /if \(isOpen \|\| isClosing\) return;/u);
assert.match(gx, /closeTransitionTimer = window\.setTimeout\(\(\) => \{[\s\S]*?document\.body\.classList\.remove\("gx-story-open"\);/u);
assert.match(gxStyles, /\.gx-era-transition strong \{[\s\S]*?font-size: clamp\(12px, 2vw, 38px\);[\s\S]*?white-space: nowrap;/u);
assert.match(gxStyles, /\.gx-modal-skip \{[\s\S]*?top: max\(24px,[\s\S]*?left: clamp\(22px,[\s\S]*?min-height: 48px;/u);
assert.match(gxStyles, /@media \(min-width: 1600px\) \{[\s\S]*?\.gx-layer\[data-return-to="novel"\] \.gx-story-card h3 \{[\s\S]*?white-space: nowrap;/u);
assert.match(gxStyles, /body\.gx-story-open \.gx-layer\[data-return-to="novel"\]\[data-phase="gaia-transformation"\] \.gx-story-card \{\s*width: min\(54%, 720px\);/u);
assert.match(gxStyles, /body\.gx-story-open #gx-layer\[data-return-to="novel"\] \.gx-story-card \{\s*pointer-events: none;\s*touch-action: none;/u);
assert.match(gxStyles, /body\.gx-story-open #gx-layer\[data-return-to="novel"\] \.gx-mobile-info-toggle \{\s*pointer-events: auto;/u);

console.log(JSON.stringify({ status: "passed", behavior: "gx-modal-skip-and-return" }, null, 2));
