import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = path.resolve(import.meta.dirname, "..");
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), "utf8");
const appContentSource = read("app-content.js");
const appSource = read("app.js");
const modeLoaderSource = read("gaia-mode-loader.js");
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
  "senseware-2050",
  "senseware-2050-live",
];

assert.equal(content.modes.length, 9, "Earth catalog must contain exactly 9 exhibits");
assert.equal(content.INTRO_MODE_CHOICES.length, 9, "Entrance must contain exactly 9 exhibits");
assert.deepEqual(Array.from(content.modes, ({ id }) => id), expectedIds);
assert.equal(new Set(content.modes.map(({ id }) => id)).size, 9);
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
assert.match(content.modes[6].description, /年度ごと.*ゆっくり.*可感半径/u);
assert.match(content.modeConcepts["rhythm-of-disaster"].seeing, /M7\.5.*約500km.*M9\.1.*約2,000km.*別年度の点は表示しません/u);
assert.match(content.modeDataNarratives["rhythm-of-disaster"], /初期表示は世界.*約7〜15秒.*M7\.5約500km.*M9\.1約2,000km/u);
assert.match(appSource, /GLOBAL_EARTHQUAKE_WAVE_MIN_DURATION_MS = 7000/u);
assert.match(appSource, /GLOBAL_EARTHQUAKE_WAVE_MAX_DURATION_MS = 15000/u);
assert.match(appSource, /GLOBAL_EARTHQUAKE_YEAR_COUNT = 27/u);
assert.match(appSource, /GLOBAL_EARTHQUAKE_TIMELINE_DURATION_MS/u);
assert.match(appSource, /getGlobalEarthquakeImpactRadiusKm/u);
assert.match(appSource, /earthquakeWaveSync = "annual-simultaneous-distance-limited"/u);
assert.match(appSource, /earthquakeWaveModel = "usgs-estimated-felt-radius"/u);
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
assert.equal(content.modes.at(-1).id, "earth-organ");
assert.equal(gaiaData.modes.length, 9);
assert.equal(gaiaData.modes.some(({ id }) => id === "senseware-2050"), false);
assert.doesNotMatch(appSource, /getNineSignalCards|sensewareDisplay|nine-data-cards|9つの測定 ≠ 1つの地球スコア/u);

assert.match(appSource, /const MODE_COUNT = 9;/u);
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

assert.match(html, /地球観測データの9つの展示/u);
assert.match(html, /INSTALLATION BANK \/ 01—09/u);
assert.match(html, /9つの観測展示/u);
assert.match(html, /01 \/ 09/u);
assert.doesNotMatch(html, /01—10|01〜10|10の観測展示|10番目の展示/u);
assert.doesNotMatch(html, /01—20|01〜20|20の感覚器|20の展示|10テーマ・20演出/u);
assert.doesNotMatch(html, /class="map-scope-switch"|MAP SCALE/u);
assert.match(html, /gaia-mode-loader\.js\?v=gaia-map-nine-exhibits-1/u);
assert.match(modeLoaderSource, /map-ui-grid-polish\.css\?v=gaia-map-europe-clear-1/u);
assert.match(modeLoaderSource, /map-ui-grid-polish\.js\?v=gaia-map-europe-clear-1/u);
assert.match(modeLoaderSource, /app-content\.js\?v=gaia-map-nine-exhibits-1/u);
assert.match(modeLoaderSource, /app\.js\?v=gaia-map-nine-exhibits-1/u);
assert.match(appSource, /tier: "native", ratioCap: 3, maxPixels: 9000000/u);
assert.match(appSource, /dataset\.renderPixelRatio/u);
assert.match(appSource, /fixed-diameter-pie/u);
assert.match(appSource, /緑 \/ 再資源化/u);
assert.match(content.modes[4].description, /同じ大きさの円グラフ/u);
assert.match(modeLoaderSource, /styles\.css\?v=gaia-cross-platform-fonts-1/u);
assert.doesNotMatch(html, /gaia-remix-20/u);
assert.doesNotMatch(packageJson, /check-remix-modes/u);

console.log(JSON.stringify({
  status: "passed",
  exhibits: expectedIds,
  sharedWorldCopyHelperUses: (appSource.match(/getEarthWorldCopies\(projection\)/gu) || []).length,
}, null, 2));
