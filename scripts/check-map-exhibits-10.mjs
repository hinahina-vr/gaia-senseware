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
const gaiaData = JSON.parse(read("data/gaia-signals.json"));
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

assert.equal(content.modes[2].titleJa, "森林と降水量を重ねる");
assert.match(content.modeConcepts["forest-cloud-engine"].seeing, /森林域/u);
assert.match(content.modeConcepts["forest-cloud-engine"].touch, /大きな水色円.*代表地点名・平均降水量/u);
assert.match(appSource, /const FOREST_RAIN_MIN_RADIUS = 10;/u);
assert.match(appSource, /const FOREST_RAIN_MAX_RADIUS = 54;/u);
assert.match(appSource, /BRA \/ AMAZON/u);
assert.equal(content.modes[3].titleJa, "記録は、生息地図ではない");
assert.match(content.modeConcepts["pollination-protocol"].seeing, /3段階.*最大2件.*地理ではない/u);
assert.match(appSource, /pollinationStage/u);
assert.match(appSource, /NON-GEOGRAPHIC \/ GloBI RELATION NETWORK/u);
assert.equal(content.modes[4].titleJa, "再資源化の現在ともしも");
assert.match(content.modeConcepts["nothing-is-waste"].seeing, /緑.*橙.*直径はすべて同じ/u);
assert.match(content.modeConcepts["nothing-is-waste"].touch, /外周.*もしも/u);
assert.match(content.modes[5].description, /夜間光画素.*地図上の位置.*赤い円/u);
assert.match(content.modeConcepts["anthropocene-scar"].seeing, /都市や道路沿い.*国全体の排出量/u);
assert.match(content.modeConcepts["anthropocene-scar"].touch, /0\.65秒以上.*6秒間/u);
assert.match(appSource, /glow-plus-radiance-core/u);
assert.match(appSource, /web-mercator-to-geographic/u);
assert.match(content.modes[6].description, /年度ごと.*全震源.*一斉/u);
assert.match(content.modeConcepts["rhythm-of-disaster"].seeing, /別年度の点は表示しません/u);
assert.match(content.modeDataNarratives["rhythm-of-disaster"], /初期表示は世界.*M9\.1.*約半分/u);
assert.match(appSource, /GLOBAL_EARTHQUAKE_WAVE_DURATION_MS = 1500/u);
assert.match(appSource, /earthquakeWaveSync = "annual-simultaneous"/u);
assert.match(appSource, /setJapanDataLayer\("snapshot"\)/u);
assert.match(content.modes[7].description, /同じ31か国.*二重円.*散布図/u);
assert.match(content.modeConcepts["three-ecologies"].seeing, /回帰線.*相関係数r/u);
assert.match(content.modeConcepts["three-ecologies"].touch, /都市人口率の低い国から高い国/u);
assert.match(content.modeDataNarratives["three-ecologies"], /森林面積率.*緑の内円.*青の外円/u);
assert.match(appSource, /const getThreeEcologiesComparison/u);
assert.match(appSource, /ecologiesPlot = "paired-country-scatter"/u);
assert.match(appSource, /drawMemoryContext\(unescoGlobalSample\)/u);
const threeEcologiesData = gaiaData.modes.find(({ id }) => id === "three-ecologies");
assert.equal(threeEcologiesData.signals.pairedCountries.length, 31);
assert.equal(threeEcologiesData.signals.ecological.length, 31);
assert.equal(threeEcologiesData.signals.social.length, 31);
assert.equal(threeEcologiesData.signals.culture.length, 24);
assert(threeEcologiesData.signals.pairedCountries.every((row) => Number.isFinite(row.forestPercent) && Number.isFinite(row.urbanPercent)));
assert.match(content.modes[8].description, /国土の青.*暗い青.*明るい水色/u);
assert.match(content.modeConcepts["earth-organ"].seeing, /31か国.*暗い青.*明るい水色/u);
assert.match(content.modeConcepts["earth-organ"].touch, /低い国から高い国.*結ぶ機能はなくし/u);
assert.match(content.modeDataNarratives["earth-organ"], /31か国の国土.*0%.*100%/u);
assert.match(appSource, /const drawRenewableCountryChoropleth/u);
assert.match(appSource, /renewableCountryFillCount/u);
assert.match(appSource, /energyConnectionRemoved = "true"/u);
assert.doesNotMatch(appSource, /selectedEnergyRegions|SCENARIO \/ DISTRIBUTED LINK|scenarioLinks\.push/u);
const earthOrganData = gaiaData.modes.find(({ id }) => id === "earth-organ");
assert.equal(earthOrganData.signals.current.length, 31);
assert.equal(earthOrganData.signals.potential.length, 31);
assert.equal(Object.hasOwn(earthOrganData.signals, "scenarioLinks"), false);
assert.equal(earthOrganData.datasets.some(({ id }) => id === "distributed-link-scenario"), false);
assert.equal(content.modes[9].titleJa, "九つの測定は、足せない");
assert.match(content.modes[9].description, /3×3のカード.*ひとつの『地球スコア』には足しません/u);
assert.match(content.modeConcepts["senseware-2050"].seeing, /測るもの.*代表値.*単位.*同じ種類の数字ではない/u);
assert.match(content.modeConcepts["senseware-2050"].touch, /9枚は最初から同時.*黄色い枠/u);
assert.match(content.modeDataNarratives["senseware-2050"], /3×3の9枚すべてが同時.*総合順位にはしません/u);
assert.match(appSource, /const getNineSignalCards/u);
assert.match(appSource, /sensewareDisplay = "nine-data-cards"/u);
assert.match(appSource, /sensewareAudienceTraces = "removed"/u);
assert.doesNotMatch(appSource, /drawSelectedBranch|drawAudienceMemory|9 SIGNALS \+ AUDIENCE TRACES/u);
const sensewareData = gaiaData.modes.find(({ id }) => id === "senseware-2050");
assert.equal(sensewareData.datasets.length, 1);
assert.equal(sensewareData.datasets[0].id, "nine-measure-atlas");
assert.equal(sensewareData.datasets[0].preview.length, 9);
assert.equal(sensewareData.datasets.some(({ id }) => id === "audience-traces"), false);

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
assert.match(appSource, /const frameDelta = clamp\(now - previousFrameAt, 0, 64\)/u);
assert.match(appSource, /cancelEarthViewAnimation\("user-pointer"\)/u);
assert.match(appSource, /cancelEarthViewAnimation\("user-wheel"\)/u);
assert.match(appSource, /cancelEarthViewAnimation\("user-keyboard"\)/u);
assert.match(appSource, /dataset\.japanScreenX/u);

assert.match(html, /地球観測データの10の展示/u);
assert.match(html, /INSTALLATION BANK \/ 01—10/u);
assert.match(html, /10の観測展示/u);
assert.match(html, /01 \/ 10/u);
assert.doesNotMatch(html, /01—20|01〜20|20の感覚器|20の展示|10テーマ・20演出/u);
assert.doesNotMatch(html, /class="map-scope-switch"|MAP SCALE/u);
assert.match(html, /map-ui-grid-polish\.css\?v=6/u);
assert.match(html, /map-ui-grid-polish\.js\?v=5/u);
assert.match(html, /app-content\.js\?v=gaia-map10-nine-measure-atlas-1/u);
assert.match(html, /app\.js\?v=gaia-map10-nine-measure-atlas-1/u);
assert.match(appSource, /fixed-diameter-pie/u);
assert.match(appSource, /緑 \/ 再資源化/u);
assert.match(content.modes[4].description, /同じ大きさの円グラフ/u);
assert.match(html, /styles\.css\?v=gaia-cross-platform-fonts-1/u);
assert.doesNotMatch(html, /gaia-remix-20/u);
assert.doesNotMatch(packageJson, /check-remix-modes/u);

console.log(JSON.stringify({
  status: "passed",
  exhibits: expectedIds,
  sharedWorldCopyHelperUses: (appSource.match(/getEarthWorldCopies\(projection\)/gu) || []).length,
}, null, 2));
