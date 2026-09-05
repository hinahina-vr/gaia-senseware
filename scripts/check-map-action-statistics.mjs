import assert from "node:assert/strict";
import { buildPlanetStatistics } from "../src/exploration/planet-statistics.js";
import { buildLiveStatistics } from "../src/exploration/live-statistics.js";

for (const [renderer, key, unit] of [["wind", "windSpeed", "m/s"], ["air", "pm25", "µg/m³"], ["quake", "magnitude", "M"], ["cloud", "radiation", "W/m²"]]) {
  const definition = { id: renderer, renderer, number: "27", shortTitle: "QA", sourceName: "provider", sourcePage: "https://example.org" };
  const data = { sourceState: "LIVE", observedAt: "2026-09-05", points: [0, 8, null, NaN].map((value, i) => ({ id: String(i), [key]: value, time: 123000 + i })) };
  const result = buildPlanetStatistics(definition, data);
  assert.deepEqual(result.rows.map(row => row.value), [0, 8]);
  assert.equal(result.unit, unit);
  assert(result.rows.every(row => row.provenance === "SOURCE"));
  assert.equal(result.sourceUrl, definition.sourcePage);
  assert.equal(buildPlanetStatistics(definition, { ...data, sourceState: "SAVED VALUES" }), null);
  assert.equal(buildPlanetStatistics(definition, { ...data, points: [] }), null);
}
for (const key of ["weatherWindSpeed", "forecastCo2", "weatherPrecipitation", "weatherTemperature", "cloudCover", "pm25"]) {
  const definition = { id: key, key, number: "10", shortTitle: "QA", signalLabel: key };
  const measurement = { value: 0, unit: "test", provider: "open-meteo", datasetId: key, status: "snapshot", location: { label: "東京" } };
  const state = { measurements: { [key]: measurement }, events: [{ provider: "open-meteo", datasetId: key, provenance: { sourceUrl: "https://example.org/data" } }] };
  assert.equal(buildLiveStatistics(definition, state).rows.length, 1);
  assert.equal(buildLiveStatistics(definition, state).rows[0].value, 0);
  assert.match(buildLiveStatistics(definition, state).title, /モデル値・1地点/);
  assert.match(buildLiveStatistics(definition, state).sourceName, /保存済みモデル値/);
  assert.equal(buildLiveStatistics(definition, state).sourceUrl, "https://example.org/data");
  assert.equal(buildLiveStatistics(definition, { measurements: {} }), null);
  for (const value of [null, undefined, NaN, Infinity]) {
    assert.equal(buildLiveStatistics(definition, { measurements: { [key]: { ...measurement, value } } }), null);
  }
}
const wind = buildLiveStatistics({ id: "wind-field", key: "weatherWindSpeed" }, {}, { points: [{ id: "tokyo", windSpeed: 3.2 }, { id: "sapporo", windSpeed: 0 }, { id: "missing", windSpeed: null }] });
assert.deepEqual(wind.rows.map(row => row.value), [3.2, 0]);
console.log("MAP action statistics passed: actual metric rows, units, provenance, zero values, missing-data and illustrative-fallback guards.");
