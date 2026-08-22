import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = path.resolve(import.meta.dirname, "..");
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), "utf8");
const appContentSource = read("app-content.js");
const appSource = read("app.js");
const html = read("index.html");
const snapshot = JSON.parse(read("data/gaia-signals.json"));

const sandbox = { window: {} };
vm.runInNewContext(appContentSource, sandbox, { filename: "app-content.js" });
const content = sandbox.window.GaiaAppContent;
assert(content, "GaiaAppContent was not exported");
assert.equal(content.modes.length, 20, "installation must expose 20 modes");
assert.equal(content.INTRO_MODE_CHOICES.length, 20, "intro must expose 20 choices");

const mode = content.modes[10];
assert.equal(mode.id, "breathing-earth-data");
assert.equal(mode.dataModeId, "breathing-earth");
assert.match(mode.description, /CO₂.+球体.+伸縮/u);
assert.match(mode.description, /気温.+GOSAT/u);
assert.match(mode.source, /seasonal = \(uSignal\.y - 0\.5\) \* 2\.0/u);
assert.match(mode.source, /earthRadius = 0\.57 \+ seasonal \* 0\.052/u);
assert.match(mode.source, /longTerm = uSignal\.x/u);
assert.match(mode.source, /temperature = uSignal\.z/u);
assert.match(mode.source, /texture\(uGosatTexture/u);
assert.match(mode.source, /vec3 warm = vec3\(1\.0, 0\.18, 0\.055\)/u);

assert(content.modeConcepts[mode.id], "mode 11 concept is missing");
assert(content.modeDataNarratives[mode.id], "mode 11 data narrative is missing");
assert(content.lectureResumeLinks[mode.id], "mode 11 lecture link is missing");

assert.match(appSource, /const MODE_COUNT = 20/u);
assert.match(appSource, /uniform sampler2D uGosatTexture/u);
assert.match(appSource, /return modeBreathingEarthData\(p, t, response, uModeMemory\[10\]\)/u);
assert.match(appSource, /visualMode\.dataModeId \|\| visualMode\.id/u);
assert.match(appSource, /getTimelineCellValue\(timeline, index\)/u);
assert.match(appSource, /gl\.texImage2D\([\s\S]+gl\.R8[\s\S]+gl\.RED/u);
assert.match(appSource, /\(!japanIsOpen && !isMeasuredBreath\)/u);
assert.match(appSource, /"breathing-earth-data": `const row = noaaMonthlyCo2/u);

assert.match(html, /地球観測データの20の展示/u);
assert.match(html, /01〜20のバンク/u);
assert.match(html, /<span aria-hidden="true">20<\/span>/u);
assert.match(html, /01 \/ 20/u);

const sourceMode = snapshot.modes.find((entry) => entry.id === "breathing-earth");
assert(sourceMode, "breathing-earth data is missing");
const co2 = sourceMode.signals.co2;
const temperature = sourceMode.signals.temperature;
const gosat = sourceMode.signals.gosat;
assert(co2.length > 100, "monthly NOAA CO2 sequence is too short");
assert(temperature.length > 100, "NASA temperature sequence is too short");
assert(gosat.frames.length >= 2, "GOSAT needs multiple frames");
assert.equal(gosat.frames[0].values.length, gosat.width * gosat.height, "GOSAT grid dimensions mismatch");

const seasonal = co2.map((row) => row.averagePpm - row.deseasonalizedPpm);
assert(Math.min(...seasonal) < -1, "NOAA sequence must contain a negative seasonal phase");
assert(Math.max(...seasonal) > 1, "NOAA sequence must contain a positive seasonal phase");
assert(Math.min(...temperature.map((row) => row.anomalyC)) < 0, "temperature sequence needs a cool phase");
assert(Math.max(...temperature.map((row) => row.anomalyC)) > 1, "temperature sequence needs a warm phase");

console.log(JSON.stringify({
  status: "ok",
  modes: content.modes.length,
  mode11: mode.id,
  noaaMonths: co2.length,
  seasonalRangePpm: [Math.min(...seasonal), Math.max(...seasonal)],
  temperatureRangeC: [
    Math.min(...temperature.map((row) => row.anomalyC)),
    Math.max(...temperature.map((row) => row.anomalyC)),
  ],
  gosatFrames: gosat.frames.length,
  gosatGrid: `${gosat.width}x${gosat.height}`,
}, null, 2));
