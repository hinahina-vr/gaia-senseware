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
]) assert(guide.includes(required), `提出ガイドに必須項目がありません: ${required}`);

assert.match(readme, /docs\/CONTEST_2026_SUBMISSION\.md/u);
assert.match(readme, /actions\/workflows\/contest-checks\.yml\/badge\.svg/u);
assert.equal(typeof packageJson.scripts["check:contest"], "string");
assert.match(workflow, /npm run check:contest/u);
assert.match(workflow, /npm run test:pages/u);
assert.doesNotMatch(workflow, /(?:pages\s+deploy|wrangler\s+deploy|git\s+push)/u, "CIから公開・pushしてはいけません");
assert.match(index, /id="gaia-opening-tour-start"/u);
assert.match(index, /id="gaia-opening-route-tour"/u);
assert.match(loader, /#observation=/u);
assert.match(loader, /hash === "#tour"/u);
assert.doesNotMatch(index, /<script[^>]+src="https?:\/\//iu, "外部ランタイムscriptを読み込んでいます");

console.log(JSON.stringify({ status: "passed", guide: "docs/CONTEST_2026_SUBMISSION.md", workflow: ".github/workflows/contest-checks.yml", checks: 27 }, null, 2));
