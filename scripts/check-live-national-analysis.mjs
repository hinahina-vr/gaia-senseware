import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { createRequire } from "node:module";
import { OBSERVATION_CITIES as cities } from "../src/exploration/observation-cities.js";
import { LIVE_EXHIBITS } from "../src/exploration/live-exhibit-catalog.js";
import { buildLiveStatistics } from "../src/exploration/live-statistics.js";
import { statisticsAiSnapshot } from "../statistics-ai.js";

const saved = JSON.parse(await fs.readFile(new URL("../data/live-prefecture-fallback-v1.json", import.meta.url), "utf8"));
assert.equal(cities.length, 47);
for (const exhibit of LIVE_EXHIBITS) {
  const result = buildLiveStatistics(exhibit, {}, {}, saved);
  assert.equal(result.rows.length, 47, exhibit.id);
  assert.deepEqual(result.rows.map(row => row.id), cities.map(city => city.id));
  assert.match(result.title, /47\/47都道府県/);
  assert.equal(result.coverage.missingCount, 0);
  assert.equal(result.insightContext.axis, "locations");
  const ai = statisticsAiSnapshot({ dataset: result, rows: result.rows, method: { group: { name: "summary" }, label: "summary" }, result: {} });
  assert.equal(ai.selection.sentRows, 47);
  assert.equal(ai.dataset.measurementKind, "MODEL");
  assert.equal(ai.dataset.coverage.targetCount, 47);
  assert(ai.samples.every(row => row.observedAt));
  assert.equal(buildLiveStatistics(exhibit, { measurements: { [exhibit.key]: { value: 42 } } }), null, "Never fall back to one selected point");
  const provider = ["forecastCo2", "pm25"].includes(exhibit.key) ? "air" : "weather";
  for (const value of [null, undefined, NaN, Infinity, false, true, "", " ", "0"]) {
    const partial = structuredClone(saved);
    partial[provider].points[0].measurements[exhibit.key] = value;
    const dataset = buildLiveStatistics(exhibit, {}, {}, partial);
    assert.equal(dataset.rows.length, 46);
    assert.equal(dataset.coverage.missingCount, 1);
  }
  const zero = structuredClone(saved);
  zero[provider].points[0].measurements[exhibit.key] = 0;
  assert.equal(buildLiveStatistics(exhibit, {}, {}, zero).rows[0].value, 0);
  zero[provider].points.reverse();
  assert.equal(buildLiveStatistics(exhibit, {}, {}, zero).rows[0].id, cities[0].id, "Identity, not response order");
  zero[provider].source = "stale-cache";
  assert.match(buildLiveStatistics(exhibit, {}, {}, zero).sourceName, /更新失敗/);
}

const require = createRequire(new URL("../sensor-platform/package.json", import.meta.url));
const ts = require("typescript");
const source = await fs.readFile(new URL("../sensor-platform/src/prefecture-field.ts", import.meta.url), "utf8");
const compiled = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } }).outputText;
const api = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`);
const originalFetch = globalThis.fetch;
let requests = 0, failure = false, truncated = false;
globalThis.fetch = async url => {
  requests++;
  if (failure && url.hostname.startsWith("air-quality")) return new Response("offline", { status: 503 });
  assert.equal(url.searchParams.get("latitude").split(",").length, 47);
  assert.equal(url.searchParams.get("longitude").split(",").length, 47);
  const vars = url.searchParams.get("current").split(",");
  const values = cities.map((_, index) => ({ current: { time: "2026-09-06T21:00", ...Object.fromEntries(vars.map(key => [key, index])) } }));
  values[1].current[vars[0]] = false;
  if (truncated) values.pop();
  return Response.json(values);
};
const memory = new Map();
globalThis.caches = { default: { match: async key => memory.get(key.url)?.clone(), put: async (key, response) => { memory.set(key.url, response); } } };
const pending = [], ctx = { waitUntil: promise => pending.push(promise) };
try {
  const fields = await Promise.all(["weather", "air"].map(provider => api.cachedPrefectureField(provider, cities, true, ctx)));
  await Promise.all(pending);
  assert.equal(requests, 2);
  assert.equal(fields[0].points[0].measurements.weatherWindSpeed, 0);
  assert.equal(fields[0].points[1].measurements.weatherWindSpeed, null);
  await api.cachedPrefectureField("weather", cities, true, ctx);
  assert.equal(requests, 2, "Fresh cache reused");
  for (const [key, response] of memory) {
    const data = await response.clone().json(); data.generatedAt = "2020-01-01T00:00:00Z";
    memory.set(key, Response.json(data));
  }
  failure = true;
  const [weather, air] = await Promise.all(["weather", "air"].map(provider => api.cachedPrefectureField(provider, cities, true, ctx)));
  assert.equal(weather.source, "open-meteo");
  assert.equal(air.source, "stale-cache");
  assert.equal(air.points.length, 47);
  memory.clear();
  const unavailable = await api.cachedPrefectureField("air", cities, false, ctx);
  assert.equal(unavailable.source, "unavailable");
  assert(unavailable.points.every(point => Object.values(point.measurements).every(value => value === null)));
  truncated = true;
  await assert.rejects(api.fetchPrefectureField("weather", cities), /count mismatch/);
} finally { globalThis.fetch = originalFetch; delete globalThis.caches; }
console.log("National analysis passed: 15–20, 47 IDs, finite/zero/missing, AI 47 rows, model provenance, independent provider cache and failures.");
