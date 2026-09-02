import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = path.resolve(import.meta.dirname, "..");
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), "utf8");
const appContentSource = read("app-content.js");
const appSource = read("app.js");
const particlesSource = read("particles-v9.js");
const modeLoaderSource = read("gaia-mode-loader.js");
const liveExhibitsSource = read("src/exploration/live-exhibits.js");
const liveDataSource = read("src/exploration/live-data.js");
const liveTransformsSource = read("src/exploration/transforms.js");
const stylesSource = read("styles.css");
const mapGridStylesSource = read("map-ui-grid-polish.css");
const mapGridScriptSource = read("map-ui-grid-polish.js");
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
  "nothing-is-waste",
  "anthropocene-scar",
  "rhythm-of-disaster",
  "three-ecologies",
  "earth-organ",
  "population-tide",
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
assert.equal(content.modes.some(({ id }) => id === "pollination-protocol"), false);
assert.doesNotMatch(appContentSource, /pollination-protocol|ミツバチ|GloBI|GBIF/u);
assert.equal(content.modes[3].titleJa, "再資源化率を比べる");
assert.match(content.modeConcepts["nothing-is-waste"].seeing, /緑.*橙.*直径はすべて同じ/u);
assert.match(content.modeConcepts["nothing-is-waste"].touch, /左右ボタン.*スライダー.*31.*公式値か補完値/u);
assert.doesNotMatch(appSource, /scenarioRecycle|scenarioIncrease|drawOuterTargetRing/u);
assert.match(appSource, /signalMode\.id === "nothing-is-waste" \|\|[\s\S]*co2TimelineHeld/u);
assert.match(content.modes[4].description, /1945〜2023年.*VIIRS 2016.*固定参照/u);
assert.match(content.modeConcepts["anthropocene-scar"].seeing, /国全体の化石燃料由来CO₂.*2016年/u);
assert.match(content.modeConcepts["anthropocene-scar"].touch, /1945〜2023年.*0\.65秒以上/u);
assert.match(appSource, /glow-plus-radiance-core/u);
assert.match(appSource, /web-mercator-to-geographic/u);
assert.match(appSource, /const ANTHROPOCENE_EMISSIONS_SCALE_MT = 12000;/u);
assert.match(appSource, /const getAnthropoceneEmissionRadius/u);
assert.match(appSource, /emissionsEncoding = "country-total-fixed-sqrt-area"/u);
assert.match(appSource, /emissionRows\.forEach[\s\S]{0,2600}applyMapPlotReveal[\s\S]{0,2600}ctx\.restore\(\);\s*\}\);/u);
assert.match(content.modes[5].description, /年度ごと.*ゆっくり.*可感半径/u);
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
assert.match(content.modes[6].description, /同じ31か国.*二重円.*散布図/u);
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
assert.match(appSource, /const ECOLOGIES_SEQUENCE_DURATION_MS = MODE_SEQUENCE_DURATION_MS \* 2;/u);
assert.match(appSource, /const ECOLOGIES_SELECTION_TRANSITION_MS = 920;/u);
assert.match(appSource, /const getEcologiesSelectionTransition = \(rows, selected, now\)/u);
assert.match(appSource, /id === "three-ecologies"[\s\S]{0,120}ECOLOGIES_SEQUENCE_DURATION_MS/u);
assert.match(appSource, /ecologiesCountryDisplayMs[\s\S]{0,500}ecologiesSelectionTransitionProgress/u);
assert.match(content.modes[7].description, /国土の青.*暗い青.*明るい水色/u);
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
assert.equal(content.modes[8].id, "population-tide");
assert.match(content.modes[8].description, /1960〜2025年.*円の面積.*人口/u);
assert.match(content.modeConcepts["population-tide"].touch, /1960〜2025年.*年だけを動か/u);
const anthropoceneData = gaiaData.modes.find(({ id }) => id === "anthropocene-scar");
assert.equal(Math.min(...anthropoceneData.signals.emissions.map(({ year }) => year)), 1945);
assert.equal(Math.max(...anthropoceneData.signals.emissions.map(({ year }) => year)), 2023);
assert(anthropoceneData.signals.emissions.every((row) => Number.isFinite(row.emissionsMtCo2)));
const populationData = gaiaData.modes.find(({ id }) => id === "population-tide");
assert.equal(Math.min(...populationData.signals.population.map(({ year }) => year)), 1960);
assert.equal(Math.max(...populationData.signals.population.map(({ year }) => year)), 2025);
assert.equal(populationData.signals.population.filter(({ year }) => year === 1960).length, 31);
assert.equal(populationData.signals.population.filter(({ year }) => year === 2025).length, 31);
assert.equal(content.modes.at(-1).id, "population-tide");
assert.equal(gaiaData.modes.length, 10);
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
assert.match(appSource, /BLUE_CIRCULATION_FOCUS = Object\.freeze\(\{[\s\S]*label: "tokyo"[\s\S]*lon: 139\.6503[\s\S]*lat: 35\.6762/u);
assert.match(appSource, /dataset\.tokyoScreenX/u);
assert.match(appSource, /currentVisualLanguage = "calligraphic-current-brush"/u);
assert.match(appSource, /currentBrushLanguage = "broad-ink-with-moving-pigment"/u);
assert.match(appSource, /currentAmbientMotion = "continuous-timeline-independent-gradient"/u);
assert.match(appSource, /MAP_LIGHT_OPACITIES = Object\.freeze\(\[0\.09, 0\.72,/u);
assert.match(appContentSource, /float currentBrushBody/u);
assert.match(appContentSource, /float currentBrushBristles/u);
assert.match(appContentSource, /float pigmentTime = t \* mix\(0\.72, 1\.32, currentEnergy\)/u);
assert.match(appContentSource, /float mainWidth = mix\(0\.22, 0\.34, currentEnergy\)/u);
assert.match(appContentSource, /float mainTaper[\s\S]*float upperTaper[\s\S]*float lowerTaper/u);
assert.match(appContentSource, /float mainWetEdge/u);
assert.match(appContentSource, /float observedInk/u);
assert.doesNotMatch(appContentSource, /float travelingPearl|float observedPearls/u);
assert.match(stylesSource, /data-integrated-map-mode="02"/u);

assert.match(html, /地球観測データの9つの展示/u);
assert.match(html, /INSTALLATION BANK \/ MAP 01—15/u);
assert.match(html, /aria-label="地図の15展示を選ぶ"/u);
assert.match(html, /9つの観測展示/u);
assert.match(html, /01 \/ 09/u);
assert.doesNotMatch(html, /japan-instruction|DRAG \/ ZOOM|点を押して読む/u);
assert.doesNotMatch(html, /data-signal-note/u);
assert.doesNotMatch(appSource, /data-signal-note/u);
assert.doesNotMatch(html, /data-encoding-value/u);
assert.doesNotMatch(appSource, /setEncodingValue|data-encoding-value/u);
assert.doesNotMatch(stylesSource, /\.signal-encoding-legend dd/u);
assert.doesNotMatch(mapGridStylesSource, /\.signal-encoding-legend dd/u);
assert.match(html, /id="japan-poi-source"[\s\S]*target="_blank"[\s\S]*rel="noopener noreferrer"[\s\S]*元データを確認する/u);
assert.doesNotMatch(html, /id="japan-poi-(?:title|description|relation)"/u);
assert.doesNotMatch(appSource, /この地点の海流が続いたら|japanPoiTitle|japanPoiDescription|japanPoiRelation/u);
assert.match(appSource, /"blue-circulation": "noaa-current-fallback"/u);
assert.match(appSource, /japanPoiSource\.href = sourceUrl/u);
assert.doesNotMatch(html, /data-gaia-live-receipt|gaia-live-receipt|変換レシート/u);
assert.doesNotMatch(appSource, /gaiaLiveReceipt/u);
assert.doesNotMatch(liveDataSource, /ensureSpaceReceipt|data-gaia-live-receipt|gaia-live-receipt/u);
assert.doesNotMatch(stylesSource, /gaia-live-receipt|gaia-live-sound-controls/u);
assert.doesNotMatch(mapGridStylesSource, /gaia-live-receipt/u);
const liveContracts = [
  ["10", "wind-field", "Open-Meteoの東京風速モデル値を、列島を横切る流線の密度と速さへ変換します。"],
  ["11", "carbon-pulse", "CAMSの東京格子CO₂予測値を、都市から広がる光環と呼吸周期へ変換します。"],
  ["12", "rain-chorus", "Open-Meteoの東京降水モデル値を、雨線と水面の波紋密度へ変換します。"],
  ["13", "temperature-field", "Open-Meteoの東京気温モデル値を、暖気の等温線と光の色温度へ変換します。"],
  ["14", "cloud-drift", "Open-Meteoの東京総雲量を、地図を流れる雲粒と透過する光の量へ変換します。"],
  ["15", "pm25-haze", "CAMSの東京格子PM2.5予測値を、浮遊粒子と大気の霞へ変換します。"],
];
for (const [number, id, caption] of liveContracts) {
  assert.match(liveExhibitsSource, new RegExp(`id: "${id}"[\\s\\S]*number: "${number}"`, "u"));
  assert(liveExhibitsSource.includes(`caption: "${caption}"`), `${number}: explanatory contract changed`);
}
assert.match(liveExhibitsSource, /getContext\("webgl"[\s\S]*WEBGL_FRAGMENT_SOURCE/u);
assert.match(liveExhibitsSource, /visualLanguage = "continuous-signal-field"/u);
assert.match(liveExhibitsSource, /vec3 windField[\s\S]*vec3 carbonField[\s\S]*vec3 rainField[\s\S]*vec3 temperatureField[\s\S]*vec3 cloudField[\s\S]*vec3 no2Field/u);
assert.match(liveExhibitsSource, /location: Object\.freeze\(\{ lon: 139\.6503, lat: 35\.6762, label: "Open-Meteo \/ 東京" \}\)/u);
assert.match(liveExhibitsSource, /location: Object\.freeze\(\{ lon: 139\.6503, lat: 35\.6762, label: "CAMSモデル \/ 東京格子" \}\)/u);
assert.match(liveExhibitsSource, /const observationLocation = \(exhibit, measurement\)[\s\S]*measurement\?\.location[\s\S]*projectSceneAnchor\(location\)/u);
assert.match(liveTransformsSource, /location: event\.location \? \{ \.\.\.event\.location \} : null/u);
assert.match(liveExhibitsSource, /windField[\s\S]*signalSpace - u_anchor[\s\S]*velocity = 0\.72 \+ u_strength \* 2\.1[\s\S]*density = mix\(7\.0, 18\.0, u_strength\)/u);
assert.match(liveExhibitsSource, /carbonField[\s\S]*signalSpace - u_anchor[\s\S]*breathRate[\s\S]*sourceCore/u);
assert.match(liveExhibitsSource, /rainField[\s\S]*density = mix\(12\.0, 34\.0, u_strength\)[\s\S]*rainLines[\s\S]*rippleA[\s\S]*rippleB[\s\S]*rippleC/u);
assert.match(liveExhibitsSource, /no2Field[\s\S]*spectralVeil[\s\S]*scan/u);
assert.match(liveExhibitsSource, /uniform vec4 u_touches\[8\][\s\S]*lightTouchField/u);
assert.match(liveExhibitsSource, /lightTouchIntegration = "abstract-light-touch"/u);
assert.match(liveExhibitsSource, /gaia:live-light-touch[\s\S]*button class="gaia-live-exhibit-touch-hint"[\s\S]*data-live-light-touch[\s\S]*光に触れる[\s\S]*TOUCH \/ DRAG/u);
assert.match(liveExhibitsSource, /data-live-light-touch[\s\S]*addLightTouch\(x, y, 1\.35\)/u);
assert.match(liveExhibitsSource, /data-live-stage="observe"[\s\S]*data-live-stage="locate"[\s\S]*data-live-stage="visualize"/u);
assert((liveExhibitsSource.match(/<svg viewBox="0 0 64 64">/gu) || []).length >= 3, "live transformation stages require graphic symbols");
assert.match(liveExhibitsSource, /data-live-exhibit-input[\s\S]*data-live-exhibit-location[\s\S]*data-live-exhibit-visual-map/u);
assert.doesNotMatch(liveExhibitsSource, /proceduralAudio|procedural-audio|data-live-sound|展示音|BPM|data-live-stage="sonify"/u);
assert.doesNotMatch(liveDataSource, /proceduralAudio|procedural-audio|data-live-sound|展示音|BPM/u);
assert.doesNotMatch(modeLoaderSource, /procedural-audio/u);
assert.doesNotMatch(stylesSource, /data-live-sound|gaia-live-sound/u);
assert.match(stylesSource, /\.gaia-live-exhibit-touch-hint[\s\S]*cursor: pointer/u);
assert.match(stylesSource, /\.gaia-live-exhibit-a11y[\s\S]*clip-path: inset\(50%\)/u);
assert.match(stylesSource, /\.gaia-live-exhibit-primary > strong[\s\S]*font: 500 42px/u);
assert.match(stylesSource, /\.gaia-live-exhibit-path::after[\s\S]*gaia-live-data-travel/u);
assert.match(stylesSource, /\.gaia-live-exhibit-explanation[\s\S]*gaia-live-exhibit-summary/u);
assert.match(liveExhibitsSource, /SAVED SNAPSHOT \/ 保存データを再現中/u);
assert.match(liveExhibitsSource, /NEAR REAL TIME \/ 5分ごとに再確認/u);
assert.match(liveExhibitsSource, /混在状態を明示します/u);
assert.doesNotMatch(mapGridStylesSource, /\.japan-layer\.is-live-exhibit \.map-grid-bank[\s\S]{0,320}width: clamp\(400px, 22vw, 720px\)/u);
assert.doesNotMatch(liveExhibitsSource, /fillRect\(x - 2, y - 1/u, "wind field must not render sperm-like particle heads");
assert.doesNotMatch(html, /01—10|01〜10|10の観測展示|10番目の展示/u);
assert.doesNotMatch(html, /01—20|01〜20|20の感覚器|20の展示|10テーマ・20演出/u);
assert.doesNotMatch(html, /class="map-scope-switch"|MAP SCALE/u);
assert.match(html, /gaia-mode-loader\.js\?v=gaia-human-history-2/u);
assert.match(modeLoaderSource, /map-ui-grid-polish\.css\?v=gaia-human-history-2/u);
assert.match(modeLoaderSource, /map-ui-grid-polish\.js\?v=gaia-human-history-2/u);
assert.match(modeLoaderSource, /app-content\.js\?v=gaia-map-brush-flow-1/u);
assert.match(modeLoaderSource, /app\.js\?v=gaia-map-poi-history-1/u);
assert.match(modeLoaderSource, /styles\.css\?v=gaia-map-brush-flow-1/u);
assert.match(modeLoaderSource, /mode-entry-guide\.js\?v=gaia-live-deck-3/u);
assert.match(appSource, /setIntroEntryGuideStep\(0\);\s*positionIntroEntryGuide\(\);\s*requestAnimationFrame\(\(\) => \{\s*introEntryGuide\.classList\.add\("is-visible"\)/u);
assert.match(stylesSource, /\.intro-entry-guide-bubble \{[\s\S]*filter: blur\(2px\);[\s\S]*translateY\(2px\) scale\(0\.994\)/u);
assert.match(stylesSource, /\.intro-entry-guide-bubble \{[\s\S]*transition: opacity 620ms ease, filter 680ms ease, transform 720ms/u);
assert.doesNotMatch(stylesSource, /\.intro-entry-guide-bubble \{[\s\S]{0,1200}transition:[^;}]*(?:top|left)/u);
assert.match(appSource, /avoid: "#map-reading-guide, \.gaia-live-exhibit-readout"/u);
assert.match(modeLoaderSource, /particles-v9\.js\?v=gaia-light-surface-fps-1/u);
assert.match(appSource, /const mapExhibitIsVisible = japanIsOpen\s*&& !japanLayer\.classList\.contains\("is-live-exhibit"\)/u);
assert.match(appSource, /const setLightCanvasMounted = \(mounted\)[\s\S]*japanOverlay\.before\(canvas\)[\s\S]*below-reference-map-and-poi/u);
assert.match(appSource, /const syncIntegratedMapLight = \(\) =>[\s\S]*has-integrated-map-light[\s\S]*mode-matched/u);
assert.match(appSource, /uniform vec4 uCurrentSamples\[\$\{CURRENT_FIELD_SAMPLE_LIMIT\}\][\s\S]*uniform int uCurrentSampleCount/u);
assert.match(appSource, /getCurrentFieldUniformData[\s\S]*Math\.hypot\(row\.uMs, row\.vMs\)[\s\S]*Math\.atan2\(row\.vMs, row\.uMs\)/u);
assert.match(appSource, /gl\.uniform4fv\(uniforms\.currentSamples, currentField\.data\)[\s\S]*gl\.uniform1i\(uniforms\.currentSampleCount, currentField\.count\)/u);
assert.match(appContentSource, /uCurrentSamples\[i\][\s\S]*measuredSpeed[\s\S]*observedInk[\s\S]*observedLustre/u);
assert.match(appSource, /const brushCurrentIsActive = getActiveSignalMode\(\)\?\.id === "blue-circulation"/u);
assert.match(appSource, /brushCurrentIsActive[\s\S]*Math\.max\(30, lodTarget\)/u);
assert.match(appSource, /do nextJapanOverlayRenderAt \+= mapFrameInterval;\s*while \(nextJapanOverlayRenderAt <= now\)/u);
assert.doesNotMatch(appSource, /lastJapanOverlayRenderAt/u);
assert.match(appSource, /float grainBlend = smoothstep\(0\.0, 1\.0, fract\(grainTime\)\)/u);
assert.match(particlesSource, /const installationIsOpen = \(\) => Boolean\(document\.querySelector\("\.experience\.japan-open"\)\)/u);
assert.match(particlesSource, /&& !installationIsOpen\(\)/u);
assert.match(modeLoaderSource, /src\/exploration\/index\.js\?v=gaia-human-history-2/u);
assert.match(html, /id="japan-title" data-exhibit-number="01" aria-label="01 地球の一呼吸" aria-live="polite">地球の一呼吸<\/h2>/u);
assert.match(html, /id="map-title-transition"[\s\S]{0,120}id="map-title-transition-text"/u);
assert.match(html, /class="japan-map-actions"[\s\S]{0,320}id="japan-close"/u);
assert.match(html, /id="japan-poi-preview"[\s\S]{0,900}クリックで詳しく見る/u);
assert.match(appSource, /const updateJapanPoiHover = \(event\) =>[\s\S]{0,620}allowGridFallback: false/u);
assert.match(appSource, /renderJapanPoiFocus\(ctx, rect, left, top, now, ratio\)/u);
assert.match(appSource, /japanTitle\.textContent = mode\.titleJa;/u);
assert.match(appSource, /const animateMapTitleTransition = \(title\) =>/u);
assert.match(appSource, /japanLayer\.classList\.add\("is-map-title-transitioning"\)/u);
assert.match(appSource, /const MAP_TITLE_SEPARATOR_DURATION_MS = 1500;[\s\S]*const restartMapPlotReveal = \(reason = "mode-change"\)[\s\S]*waiting-for-separator/u);
assert.match(appSource, /mapPlotRevealBlockedUntil = separatorStartedAt \+ separatorDuration[\s\S]*titleSeparatorEndsAt/u);
assert.match(appSource, /if \(now < mapPlotRevealStartedAt\) return \{ progress: 0, alpha: 0, scale: 0\.14 \};/u);
assert.match(appSource, /const firstPoiVisibleAt = mapPlotRevealStartedAt \+ \(reducedMotion \? 0 : MAP_PLOT_REVEAL_LEAD_MS\);[\s\S]*return null/u);
assert.match(appSource, /signalMode\.id === "blue-circulation"[\s\S]*getMapPlotReveal\(currentIndex, state\.currents\.length, now\)[\s\S]*applyMapPlotReveal\(ctx, point, reveal\)/u);
assert.match(appSource, /tier: "native", ratioCap: 3, maxPixels: 9000000/u);
assert.match(appSource, /dataset\.renderPixelRatio/u);
assert.match(mapGridStylesSource, /--map-grid-bank-height: 320px/u);
assert.match(mapGridScriptSource, /setProperty\("--map-grid-bank-height", `\$\{Math\.ceil\(bankHeight\)\}px`\)/u);
assert.match(mapGridStylesSource, /\.map-grid-bank \{[\s\S]{0,240}var\(--map-grid-route-stack\) \+ var\(--map-grid-gap\)/u);
assert.match(mapGridStylesSource, /\.map-grid-data \{[\s\S]{0,280}var\(--map-grid-bank-height\)/u);
assert.match(appSource, /fixed-diameter-pie/u);
assert.match(appSource, /緑 \/ 再資源化/u);
assert.match(content.modes[3].description, /同じ大きさの円グラフ/u);
assert.match(modeLoaderSource, /styles\.css\?v=gaia-title-meta-removed-1/u);
assert.match(appSource, /tooltip\.dataset\.placement = placement/u);
assert.match(appSource, /--map-tooltip-anchor-y/u);
assert.match(stylesSource, /\.map-mode-01-tooltip::after[\s\S]{0,320}clip-path: polygon/u);
assert.match(stylesSource, /\.map-mode-01-tooltip\[data-placement="left"\]::before/u);
assert.match(appSource, /const animateMapReadingGuide = \(guide\) =>/u);
assert.match(appSource, /mapReadingGuideBody\?\.setAttribute\("aria-busy", "true"\)/u);
assert.match(stylesSource, /\.map-reading-guide\.is-mode-entering[\s\S]{0,180}map-reading-guide-enter/u);
assert.match(stylesSource, /@keyframes map-reading-guide-enter/u);
assert.match(html, /id="map-mode-preview"[\s\S]*id="map-mode-preview-number">01 \/ AIR<[\s\S]*CO₂が季節ごとに上下しながら/u);
assert.doesNotMatch(html, /id="map-mode-preview-(?:surface|title|lead|note)"/u);
assert.doesNotMatch(html, /data-intro-path="abstract"/u);
assert.doesNotMatch(html, /id="map-surface-map"|id="map-surface-light"|class="map-surface-switch"/u);
assert.match(html, /class="map-mode-groups"[\s\S]*id="japan-mode-list"/u);
assert.doesNotMatch(html, /id="map-light-overlay"|id="abstract-mode-list"|id="map-light-overlay-open"/u);
assert.doesNotMatch(appSource, /mapModePreview(?:Surface|Title|Lead|Note)/u);
assert.doesNotMatch(appSource, /setMapSurface|is-abstract-exhibit|abstractModeButton|abstractModeList/u);
assert.match(appSource, /getMapModePreviewContent[\s\S]*INTRO_MODE_CHOICES\[index\][\s\S]*choice\.copy/u);
assert.match(stylesSource, /\.japan-layer\.has-integrated-map-light \.japan-map > #gaia-canvas[\s\S]*z-index: 1[\s\S]*pointer-events: none !important[\s\S]*mix-blend-mode: screen/u);
assert.match(mapGridStylesSource, /\.japan-layer \.japan-heading \.japan-kicker[\s\S]{0,100}display: none !important/u);
assert.match(mapGridStylesSource, /\.japan-layer #japan-description[\s\S]{0,320}clip-path: inset\(50%\)/u);
assert.match(mapGridStylesSource, /body\.map-grid-desktop \.japan-layer \.map-grid-intro #japan-title[\s\S]{0,100}justify-self: center/u);
assert.match(mapGridStylesSource, /\.japan-layer \.japan-heading[\s\S]{0,220}background: transparent !important/u);
assert.match(mapGridStylesSource, /@keyframes map-title-separator-crossfade/u);
assert.match(mapGridStylesSource, /@keyframes map-title-return-home/u);
assert.match(appSource, /if \(path === "map"\)[\s\S]{0,440}openJapan\(\{ respectUrlMode: false, focusModeBank: true \}\)/u);
assert.match(appSource, /aria-describedby", "map-mode-preview"/u);
assert.match(stylesSource, /\.intro-lp-hero :is\(\.intro-path-grid, \.intro-story-return\[data-primary-action="true"\]\)[\s\S]{0,220}width: min\(1000px, 100%\)/u);
assert.match(html, /データの出典を表示する/u);
assert.match(html, /データを統計分析する/u);
assert.doesNotMatch(html, /class="japan-data-button japan-story-button"/u);
assert.match(html, /data-signal-encoding-legend-title[\s\S]*凡例[\s\S]*MAP LEGEND/u);
assert.match(html, /id="map-mobile-heading-toggle"[\s\S]*id="map-mobile-legend-toggle"[\s\S]*id="map-mobile-bank-toggle"/u);
assert.match(appSource, /setMobileMapBankExpanded[\s\S]*is-mobile-bank-expanded[\s\S]*restoreFocus/u);
assert.match(appSource, /resetMobileMapUi\(\);/u);
assert.match(mapGridStylesSource, /Mobile exhibit HUD[\s\S]*is-mobile-heading-expanded[\s\S]*is-mobile-bank-expanded/u);
assert.match(liveExhibitsSource, /id="gaia-live-mobile-toggle"[\s\S]*gaia-live-exhibit-details/u);
assert.match(stylesSource, /\.signal-encoding-legend-title[\s\S]*font-size: 12px/u);
assert.match(stylesSource, /\.japan-layer\.is-live-exhibit \.japan-overlay \{[\s\S]*opacity: 0\.92;[\s\S]*visibility: visible;/u);
assert.match(stylesSource, /\.gaia-live-exhibit-readout \{[\s\S]*width: min\(590px, calc\(100vw - 520px\)\);[\s\S]*max-height: min\(440px/u);
assert.doesNotMatch(mapGridStylesSource, /\.japan-layer\.is-live-exhibit \.japan-heading \.japan-data-button[\s\S]{0,80}display: none/u);
assert.match(appSource, /dataLedger\.updateLiveExhibit\(liveExhibit/u);
assert.match(liveExhibitsSource, /timeZone: "Asia\/Tokyo"[\s\S]*JPT/u);
assert.match(appSource, /renderCachedReferenceWorldModel\(ctx, rect, left, top\);[\s\S]*liveBackdropOnly[\s\S]*reference-map-only[\s\S]*if \(liveBackdropOnly\) \{[\s\S]*ctx\.restore\(\);[\s\S]*return;/u);
assert.match(appSource, /signalMode\.id === "anthropocene-scar"[\s\S]{0,320}drawNightLightsLayer\(nightLightsImage, nightLightsDimmed\);[\s\S]{0,320}renderCachedReferenceWorldModel\(ctx, rect, left, top\);/u);
assert.match(appSource, /addEventListener\("gaia:live-exhibit-change"[\s\S]*renderJapanOverlay\(performance\.now\(\)\)/u);
assert.doesNotMatch(html, /gaia-remix-20/u);
assert.doesNotMatch(packageJson, /check-remix-modes/u);

console.log(JSON.stringify({
  status: "passed",
  exhibits: expectedIds,
  sharedWorldCopyHelperUses: (appSource.match(/getEarthWorldCopies\(projection\)/gu) || []).length,
}, null, 2));
