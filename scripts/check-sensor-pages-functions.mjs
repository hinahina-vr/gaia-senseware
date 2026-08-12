import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const read = (relative) => fs.readFileSync(path.join(root, relative), "utf8");
const report = [];
const check = (name, run) => {
  run();
  report.push({ name, status: "passed" });
};

const routes = JSON.parse(read("_routes.json"));
const pagesConfigSource = read("wrangler.jsonc");
const pagesConfig = JSON.parse(pagesConfigSource);
const entrypoint = read("_worker.js");
const worker = read("sensor-platform/src/index.ts");
const apiTests = read("sensor-platform/test/run-api-tests.mjs");
const productionSetup = read("sensor-platform/docs/PRODUCTION-SETUP.md");
const openapi = read("smartcity-sensor-starter-kit/openapi.yaml");
const curl = read("smartcity-sensor-starter-kit/curl-examples.sh");
const starterConfig = read("smartcity-sensor-starter-kit/esp32-arduino/SmartCitySensorDemo/config.example.h");
const pagesEntry = read("sensor-platform/src/pages-entry.ts");
const buildScript = read("scripts/build-sensor-pages-worker.mjs");

check("Pages routes invoke Functions only for API", () => {
  assert.deepEqual(routes, { version: 1, include: ["/api/*"], exclude: [] });
  for (const staticPath of ["/story", "/sensors/", "/novel-mode.js", "/styles.css"]) {
    assert.equal(routes.include.includes(staticPath), false);
  }
});

check("advanced mode entrypoint delegates API and has one static fallback", () => {
  assert.match(pagesEntry, /url\.pathname\.startsWith\("\/api\/"\)/u);
  assert.equal((entrypoint.match(/env\.ASSETS\.fetch\(request\)/gu) ?? []).length, 1);
  assert.doesNotMatch(entrypoint, /(?:from|import)\s*\(?["'][^"']+\.ts["']/u);
  assert.doesNotMatch(entrypoint, /sourceMappingURL/u);
  assert.doesNotMatch(entrypoint, /local-test-|replace-with-|sensors\.example\.com/u);
  assert.match(buildScript, /wrangler\.pages-build\.jsonc/u);
  assert.match(buildScript, /_worker\.js is stale/u);
});

check("Pages wrangler config is the production source of truth", () => {
  assert.equal(pagesConfig.name, "gaia-senseware");
  assert.equal(pagesConfig.pages_build_output_dir, ".");
  assert.equal(Object.hasOwn(pagesConfig, "main"), false);
  assert.equal(pagesConfig.compatibility_date, "2026-08-11");
  assert.deepEqual(pagesConfig.compatibility_flags, ["nodejs_compat"]);
  assert.equal(pagesConfig.vars.ENVIRONMENT, "production");
  assert.equal(pagesConfig.vars.PUBLIC_ORIGIN, "https://gaia-senseware.pages.dev");
  assert.equal(pagesConfig.vars.WEB_ORIGIN, "https://gaia-senseware.pages.dev");
  const database = pagesConfig.d1_databases.find(({ binding }) => binding === "DB");
  assert(database);
  assert.equal(database.database_name, "gaia-senseware-sensors");
  assert.equal(database.migrations_dir, "sensor-platform/migrations");
  assert.equal(Object.hasOwn(database, "database_id"), false, "production D1 UUID must not be fabricated before approval");
  assert.doesNotMatch(pagesConfigSource, /GOOGLE_CLIENT_SECRET|SESSION_SECRET|DEVICE_TOKEN_PEPPER|PAIRING_CODE_PEPPER/u);
});

check("health and test dependencies use the API route", () => {
  assert.match(worker, /url\.pathname === "\/api\/health"/u);
  assert(apiTests.includes("${origin}/api/health"));
  assert.match(productionSetup, /GET \/api\/health/u);
  const executable = [entrypoint, worker, apiTests].join("\n");
  assert.doesNotMatch(executable, /["'`]\/health["'`]/u);
});

check("same-origin URLs are consistent across distribution artifacts", () => {
  const apiBase = "https://gaia-senseware.pages.dev/api/v1";
  for (const content of [openapi, curl, starterConfig]) assert(content.includes(apiBase));
  assert.match(productionSetup, /https:\/\/gaia-senseware\.pages\.dev\/api\/auth\/google\/callback/u);
  assert.doesNotMatch([openapi, curl, starterConfig, productionSetup].join("\n"), /sensors\.example\.com/u);
});

console.log(JSON.stringify({ status: "passed", scans: report.length, report }, null, 2));
