import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const sourceUrl = new URL("../data/natural-earth-50m-land.geojson", import.meta.url);
const geojson = JSON.parse(await readFile(sourceUrl, "utf8"));
const countriesUrl = new URL("../data/natural-earth-50m-countries.geojson", import.meta.url);
const countriesGeojson = JSON.parse(await readFile(countriesUrl, "utf8"));
const signalsUrl = new URL("../data/gaia-signals.json", import.meta.url);
const signals = JSON.parse(await readFile(signalsUrl, "utf8"));

assert.equal(geojson.type, "FeatureCollection", "Natural Earth file must be GeoJSON");
assert.ok(geojson.features.length >= 1000, "Natural Earth feature collection is incomplete");

let ringCount = 0;
let pointCount = 0;
let datelineJumps = 0;
const bounds = {
  west: Infinity,
  south: Infinity,
  east: -Infinity,
  north: -Infinity,
};

for (const feature of geojson.features) {
  const { geometry } = feature;
  if (!geometry) continue;
  const polygons = geometry.type === "Polygon"
    ? [geometry.coordinates]
    : geometry.type === "MultiPolygon"
      ? geometry.coordinates
      : [];

  for (const polygon of polygons) {
    for (const ring of polygon) {
      ringCount += 1;
      pointCount += ring.length;
      ring.forEach(([longitude, latitude], index) => {
        assert.ok(longitude >= -180 && longitude <= 180, `invalid longitude: ${longitude}`);
        assert.ok(latitude >= -90 && latitude <= 90, `invalid latitude: ${latitude}`);
        bounds.west = Math.min(bounds.west, longitude);
        bounds.south = Math.min(bounds.south, latitude);
        bounds.east = Math.max(bounds.east, longitude);
        bounds.north = Math.max(bounds.north, latitude);
        if (index > 0 && Math.abs(longitude - ring[index - 1][0]) > 180) {
          datelineJumps += 1;
        }
      });
    }
  }
}

assert.ok(ringCount >= 1400, `expected at least 1,400 coastline rings, got ${ringCount}`);
assert.ok(pointCount >= 60000, `expected at least 60,000 reference points, got ${pointCount}`);
assert.ok(bounds.west <= -179.99 && bounds.east >= 179.99, "land reference must span the globe");
assert.ok(bounds.south <= -89.9 && bounds.north >= 83, "polar coverage is incomplete");
assert.equal(datelineJumps, 0, "a coastline ring crosses the antimeridian and would draw a false line");

assert.equal(countriesGeojson.type, "FeatureCollection", "Natural Earth countries file must be GeoJSON");
assert.ok(countriesGeojson.features.length >= 200, "Natural Earth country collection is incomplete");
const countryCodes = new Set();
for (const feature of countriesGeojson.features) {
  const properties = feature.properties || {};
  const code = [properties.ADM0_A3, properties.ISO_A3, properties.SOV_A3, properties.BRK_A3, properties.WB_A3]
    .find((value) => typeof value === "string" && /^[A-Z]{3}$/.test(value) && value !== "-99");
  if (code) countryCodes.add(code);
}
assert.ok(countryCodes.size >= 200, `expected at least 200 country codes, got ${countryCodes.size}`);
const renewableRows = signals.modes.find(({ id }) => id === "earth-organ")?.signals?.current || [];
const missingRenewableCountries = renewableRows.map(({ iso3 }) => iso3).filter((iso3) => !countryCodes.has(iso3));
assert.deepEqual(missingRenewableCountries, [], "renewable rows must all have Natural Earth country geometry");

console.log(
  `Natural Earth check passed: ${geojson.features.length} features, ${ringCount} rings, ` +
    `${pointCount} points, ${countryCodes.size} countries, ${renewableRows.length} renewable fills, bounds ${JSON.stringify(bounds)}.`,
);
