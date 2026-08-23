import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = path.resolve(import.meta.dirname, "..");
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), "utf8");
const appContentSource = read("app-content.js");
const appSource = read("app.js");
const html = read("index.html");
const packageJson = read("package.json");
const sandbox = { window: {} };

vm.runInNewContext(appContentSource, sandbox, { filename: "app-content.js" });
const content = sandbox.window.GaiaAppContent;
const expectedIds = [
  "breathing-earth",
  "blue-circulation",
  "forest-cloud-engine",
  "pollination-protocol",
  "nothing-is-waste",
  "anthropocene-scar",
  "rhythm-of-disaster",
  "three-ecologies",
  "earth-organ",
  "senseware-2050",
];
const retiredIds = [
  "breathing-earth-data",
  "blue-circulation-live",
  "forest-cloud-engine-live",
  "pollination-protocol-live",
  "nothing-is-waste-live",
  "anthropocene-scar-live",
  "rhythm-of-disaster-live",
  "three-ecologies-live",
  "earth-organ-live",
  "senseware-2050-live",
];

assert.equal(content.modes.length, 10, "Earth catalog must contain exactly 10 exhibits");
assert.equal(content.INTRO_MODE_CHOICES.length, 10, "Entrance must contain exactly 10 exhibits");
assert.deepEqual(Array.from(content.modes, ({ id }) => id), expectedIds);
assert.equal(new Set(content.modes.map(({ id }) => id)).size, 10);
for (const id of expectedIds) {
  assert(content.modeConcepts[id]?.question, `${id}: question is missing`);
  assert(content.modeDataNarratives[id], `${id}: data narrative is missing`);
  assert(content.lectureResumeLinks[id], `${id}: lecture reference is missing`);
}
for (const id of retiredIds) {
  assert(!appContentSource.includes(id), `${id}: retired exhibit remains in app-content.js`);
  assert(!appSource.includes(id), `${id}: retired exhibit remains in app.js`);
}

assert.equal(content.modes[2].titleJa, "森林と雨を比べる");
assert.match(content.modeConcepts["forest-cloud-engine"].seeing, /森林域/u);
assert.match(content.modeConcepts["forest-cloud-engine"].touch, /地点名・mm\/day/u);
assert.equal(content.modes[3].titleJa, "ミツバチの観察記録");
assert.match(content.modeConcepts["pollination-protocol"].seeing, /地図上の点へは結びません/u);
assert.equal(content.modes[4].titleJa, "再資源化の現在ともしも");
assert.match(content.modeConcepts["nothing-is-waste"].touch, /外側の破線/u);
assert.equal(content.modes[9].titleJa, "九つの地球信号を見比べる");
assert.match(content.modeConcepts["senseware-2050"].seeing, /選択中の番号と名前/u);

assert.match(appSource, /const MODE_COUNT = 10;/u);
assert.doesNotMatch(appSource, /mode == (?:1[0-9]|[2-9][0-9])/u);
assert.match(appSource, /const getEarthWorldCopies = \(projection\)/u);
assert((appSource.match(/getEarthWorldCopies\(projection\)/gu) || []).length >= 2, "vector and raster must share getEarthWorldCopies");
assert.match(appSource, /dataset\.vectorWorldCopies/u);
assert.match(appSource, /dataset\.rasterWorldCopies/u);
assert.match(appSource, /const getForestGeographicRaster/u);
assert.match(appSource, /forestOnly: true/u);
assert.match(appSource, /const animateEarthViewForMode/u);
assert.match(appSource, /duration = 1150/u);
assert.match(appSource, /cancelEarthViewAnimation\("user-pointer"\)/u);
assert.match(appSource, /cancelEarthViewAnimation\("user-wheel"\)/u);
assert.match(appSource, /cancelEarthViewAnimation\("user-keyboard"\)/u);
assert.match(appSource, /dataset\.japanScreenX/u);

assert.match(html, /地球観測データの10の展示/u);
assert.match(html, /INSTALLATION BANK \/ 01—10/u);
assert.match(html, /10の観測展示/u);
assert.match(html, /01 \/ 10/u);
assert.doesNotMatch(html, /01—20|01〜20|20の感覚器|20の展示|10テーマ・20演出/u);
assert.match(html, /gaia-map-exhibits-10-1/u);
assert.doesNotMatch(html, /gaia-remix-20/u);
assert.doesNotMatch(packageJson, /check-remix-modes/u);

console.log(JSON.stringify({
  status: "passed",
  exhibits: expectedIds,
  sharedWorldCopyHelperUses: (appSource.match(/getEarthWorldCopies\(projection\)/gu) || []).length,
}, null, 2));
