import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const guide = read("docs/CONTEST_2026_SUBMISSION.md");
const readme = read("README.md");
const workflow = read(".github/workflows/contest-checks.yml");
const index = read("index.html");
const loader = read("gaia-mode-loader.js");
const opening = read("opening.js");
const app = read("app.js");
const space = read("space-mode.js");
const novel = read("novel-mode.js");
const tour = read("guided-tour.js");
const openingCss = read("opening.css");
const architecture = read("docs/ARCHITECTURE.md");
const packageJson = JSON.parse(read("package.json"));

for (const required of [
  "https://progedu.github.io/webappcontest/2026/summer/index.html",
  "https://gaia-senseware.pages.dev/",
  "https://gaia-senseware.pages.dev/#tour",
  "https://github.com/hinahina-vr/gaia-senseware",
  "HTML、CSS、JavaScript",
  "外部JavaScriptランタイムライブラリ",
  "```mermaid",
  "SOURCE",
  "DERIVED",
  "SCENARIO",
  "Natural Earth",
  "OpenAI ImageGen",
  "Suno AI",
  "npm run check:contest",
  "30秒で基本操作を覚える",
]) assert(guide.includes(required), `提出ガイドに必須項目がありません: ${required}`);

assert.match(readme, /docs\/CONTEST_2026_SUBMISSION\.md/u);
assert.match(readme, /docs\/ARCHITECTURE\.md/u);
assert.match(readme, /docs\/screenshots\/contest-entry-pc\.png/u);
assert.match(readme, /docs\/screenshots\/contest-tour-mobile\.png/u);
assert.equal(fs.existsSync(path.join(root, "docs/screenshots/contest-entry-pc.png")), true);
assert.equal(fs.existsSync(path.join(root, "docs/screenshots/contest-tour-mobile.png")), true);
assert.match(readme, /actions\/workflows\/contest-checks\.yml\/badge\.svg/u);
assert.match(readme, /公開データとして保存された地球の変化を、光・色・動き・音へ翻訳/u);
assert.equal(typeof packageJson.scripts["check:contest"], "string");
assert.match(workflow, /npm run check:contest/u);
assert.match(workflow, /npm run test:pages/u);
assert.doesNotMatch(workflow, /(?:pages\s+deploy|wrangler\s+deploy|git\s+push)/u, "CIから公開・pushしてはいけません");
assert.match(index, /id="gaia-opening-sound-modal"/u);
assert.match(index, /id="gaia-opening-sound-on"/u);
assert.match(index, /id="gaia-opening-sound-off"/u);
assert.match(index, /id="gaia-opening-route-story"/u);
assert.match(index, /id="gaia-opening-route-other"/u);
assert.doesNotMatch(index, /id="gaia-opening-entry-(?:continue|story|explore|sound-toggle)"/u);
assert.doesNotMatch(index, /id="gaia-opening-(?:tour-start|route-tour)"/u);
assert.match(index, /data-build-profile="release"/u);
assert.match(index, /LOCAL DATA \/ SNAPSHOT/u);
assert.doesNotMatch(index, /SIGNAL \/ LIVE/u);
assert.match(tour, /○ SOURCE \/ 公開記録/u);
assert.match(tour, /△ DERIVED \/ 計算・補間/u);
assert.match(tour, /◇ SCENARIO \/ 仮定・操作/u);
assert.doesNotMatch(opening, /gaiaSenseware:entryPreference:v1/u);
assert.match(opening, /"#tour"/u);
assert.match(app, /GaiaMapObservationAdapter/u);
assert.match(app, /getTourReceipt/u);
assert.match(space, /GaiaSpaceTourAdapter/u);
assert.match(space, /visibilitychange/u);
assert.doesNotMatch(novel, /source === "entry-continue"/u);
for (const side of ["top", "right", "bottom", "left"]) assert.match(openingCss, new RegExp(`env\\(safe-area-inset-${side}\\)`, "u"));
assert.match(architecture, /```mermaid/u);
assert.match(architecture, /gaia:map-adapter-ready/u);
assert.match(architecture, /WebGL 2が使えない場合/u);
assert.equal(fs.existsSync(path.join(root, "assets/architecture/gaia-system-architecture.png")), true);
assert.match(loader, /#observation=/u);
assert.match(loader, /hash === "#tour"/u);
assert.doesNotMatch(index, /<script[^>]+src="https?:\/\//iu, "外部ランタイムscriptを読み込んでいます");

console.log(JSON.stringify({ status: "passed", guide: "docs/CONTEST_2026_SUBMISSION.md", architecture: "docs/ARCHITECTURE.md", workflow: ".github/workflows/contest-checks.yml", checks: 58 }, null, 2));
