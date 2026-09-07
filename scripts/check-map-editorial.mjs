import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import { LIVE_EXHIBITS } from "../src/exploration/live-exhibit-catalog.js";
import { ESTAT_EXHIBITS } from "../src/exploration/estat-exhibit-catalog.js";

const read = file => fs.readFileSync(new URL(`../${file}`, import.meta.url), "utf8");
const sandbox = { window: {} };
vm.runInNewContext(read("app-content.js"), sandbox);
const content = sandbox.window.GaiaAppContent;
const fixture = JSON.parse(read("docs/design/map-editorial-20260907/copy.json")).exhibits;
const recyclingRevision = JSON.parse(read("docs/design/recycling-map-20260907.json"));
// Evaluate only the frozen, browser-independent definition blocks.
const fire = read("src/exploration/firms-exhibit.js").match(/const DEFINITION = (Object\.freeze\(\{[\s\S]*?\n\}\));/u)?.[1];
const planet = read("src/exploration/planet-signals-exhibit.js").match(/const DEFINITIONS = (Object\.freeze\(\[[\s\S]*?\n\]\));/u)?.[1];
assert(fire && planet);
const extra = [vm.runInNewContext(fire, { SOURCE_PAGE: "https://firms.modaps.eosdis.nasa.gov/active_fire/" }),
  ...vm.runInNewContext(planet), ...LIVE_EXHIBITS, ...ESTAT_EXHIBITS];
const records = [
  ...content.modes.map(mode => ({ number: mode.mapNumber, id: mode.id, title: mode.titleJa, body: mode.description })),
  ...extra.map(exhibit => ({ number: exhibit.number, id: exhibit.id, title: exhibit.shortTitle, body: exhibit.caption, question: exhibit.question })),
].sort((a, b) => a.number.localeCompare(b.number));
assert.equal(fixture.length, 30);
assert.equal(records.length, 30);
assert.equal(new Set(records.map(record => record.id)).size, 30);
for (const [index, record] of records.entries()) {
  const expected = record.number === recyclingRevision.number
    ? { ...fixture[index], body: recyclingRevision.body }
    : fixture[index];
  assert.equal(record.number, String(index + 1).padStart(2, "0"));
  for (const key of ["number", "id", "title", "body", "question"]) {
    assert.equal(record[key], expected[key], `${record.number}: ${key}`);
  }
  assert.equal(content.MAP_TITLE_SUBTITLES[record.number], expected.subtitle);
  assert.equal(content.MAP_MODE_DESCRIPTIONS[record.id], expected.picker);
  assert(expected.subtitle.length >= 12 && expected.subtitle.length <= 32);
  assert(expected.picker.length <= 85);
  assert(expected.body.length >= 50);
}
for (const exhibit of extra.filter(item => !LIVE_EXHIBITS.includes(item))) {
  assert.match(exhibit.source || exhibit.sourcePage || "", /^https:\/\//u);
}
const liveRuntime = read("src/exploration/live-exhibits.js");
assert.match(liveRuntime, /data-live-deck-source/u);
assert.match(liveRuntime, /https:\/\/open-meteo\.com\//u);
assert.match(liveRuntime, /https:\/\/ads\.atmosphere\.copernicus\.eu\//u);
for (const [number, pattern] of [
  ["01", /熱異常.*焼失面積.*被害.*原因は分かりません/u],
  ["03", /モデル.*曝露量.*健康被害は分かりません/u],
  ["04", /波紋は演出.*予測ではありません/u],
  ["06", /再構成.*試算.*因果関係を示す展示ではありません/u],
  ["07", /変わらない.*予報ではありません/u],
  ["08", /因果関係は計算していません/u],
  ["09", /公表値.*未収録.*推定値では埋めません/u],
  ["13", /年は異なり.*0%.*未収録/u],
  ["21", /転入者数.*転出者数.*出生・死亡/u],
  ["25", /毎日の日最高気温.*一年で平均.*夏だけ.*最高記録.*猛暑日数/u],
  ["26", /毎日の日最低気温.*一年で平均.*冬だけ.*最低記録.*冬日数/u],
  ["30", /雨日以外の日を晴天日数とはみなしません/u],
]) assert.match(records[Number(number) - 1].body, pattern, `${number}: material limitation`);
console.log("PASS MAP editorial: all 30 titles, relevance subtitles, picker copy, bodies, sources and critical data limits match the review copy");
