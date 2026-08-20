import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const runtime = read("novel-mode.js");
const css = read("novel-mode.css");
const html = read("index.html");
const checks = [];
const check = (name, condition) => {
  assert(condition, name);
  checks.push(name);
};

check("phrase token reveal animation removed", !runtime.includes("--novel-token-delay") && !css.includes("novel-token-reveal"));
check("phrase token layout remains canonical", runtime.includes('span.className = /^\\s+$/u.test(token) ? "novel-space-token" : "novel-phrase-token"'));
check("source offsets remain on phrase tokens", runtime.includes('span.dataset.sourceStart = String(offset)') && runtime.includes('span.dataset.sourceEnd = String(offset + token.length)'));
check("glyphs are nested after pagination measurement", runtime.indexOf("const measuredLines = measureNativeLines(text, layout)") < runtime.indexOf('span.className = "novel-reveal-glyph"'));
check("glyphs preserve source order", runtime.includes('span.dataset.revealIndex = String(glyphs.length)') && runtime.includes("glyphs.push(span)"));
check("one glyph is revealed at most once per painted frame", runtime.includes('glyph.classList.add("is-visible")') && runtime.includes("nextGlyphIndex += 1") && runtime.includes("revealFrame = window.requestAnimationFrame(revealNextGlyph)"));
check("reveal cadence is gated from the previous painted glyph", runtime.includes("frameTime - previousRevealFrameTime < revealDelayForGlyph()") && runtime.includes("previousRevealFrameTime = frameTime"));
check("live speed is sampled per painted glyph", runtime.includes("const revealDelayForGlyph") && runtime.includes("100 / config.messageSpeedPercent"));
check("every glyph uses the same cadence", runtime.includes("const revealDelayForGlyph = () => REVEAL_BASE_MS * (100 / config.messageSpeedPercent)") && !runtime.includes("REVEAL_PUNCTUATION_MS"));
check("default speed is two thirds of the former four times", runtime.includes("const DEFAULT_MESSAGE_SPEED_PERCENT = 270") && runtime.includes("const REVEAL_BASE_MS = 64") && runtime.includes('const CONFIG_KEY = "gaiaSensewareNovel:config:v4"'));
check("legacy speed is reduced once", runtime.includes("const LEGACY_MESSAGE_SPEED_SCALE = 2 / 3") && runtime.includes("legacySpeed * LEGACY_MESSAGE_SPEED_SCALE"));
check("actual reveal progress is observable", runtime.includes('elements.text.dataset.revealCount = String(nextGlyphIndex)') && runtime.includes('elements.text.dataset.revealState = "complete"'));
check("preparing state cannot inherit a completed frame", runtime.includes('elements.text.dataset.revealState = "preparing"') && runtime.includes('elements.text.dataset.revealCount = "0"'));
check("initial resize reflow cannot replace the reveal DOM", runtime.includes("window.clearTimeout(dialogueResizeTimer)") && runtime.includes("dialogueObservedWidth = elements.text.getBoundingClientRect().width"));
check("CSS hides only unrevealed glyphs", css.includes(".novel-text.is-revealing .novel-reveal-glyph") && css.includes(".novel-reveal-glyph.is-visible"));
check("scramble fade is disabled during reveal", /\.novel-text\.is-revealing\s*\{\s*animation:\s*none;/u.test(css));
check("block cursor is removed", !html.includes(">▌</span>") && /\.novel-cursor\s*\{\s*display:\s*none !important;/u.test(css));
check("SCRIPT debug overlay is removed", /\.novel-script-debug\s*\{[\s\S]*?display:\s*none !important;/u.test(css));
check("runtime cache key is current", html.includes("novel-mode.js?v=gaia-frame-gated-typewriter-1"));

console.log(JSON.stringify({ status: "passed", checks: checks.length, names: checks }, null, 2));
