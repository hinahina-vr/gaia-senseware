import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const sourceUrl = new URL("../data/natural-earth-50m-land.geojson", import.meta.url);
const geojson = JSON.parse(await readFile(sourceUrl, "utf8"));

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

console.log(
  `Natural Earth check passed: ${geojson.features.length} features, ${ringCount} rings, ` +
    `${pointCount} points, bounds ${JSON.stringify(bounds)}.`,
);
