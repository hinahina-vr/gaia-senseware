import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const read = (relative) => fs.readFileSync(path.join(root, relative), "utf8");
const report = [];
const check = (name, run) => { run(); report.push({ name, status: "passed" }); };

const index = read("index.html");
const sensorHtml = read("sensors/index.html");
const sensorJs = read("sensors/sensor-platform.js");
const worker = read("sensor-platform/src/index.ts");
const auth = read("sensor-platform/src/auth.ts");
const devices = read("sensor-platform/src/devices.ts");
const validation = read("sensor-platform/src/validation.ts");
const migration1 = read("sensor-platform/migrations/0001_initial.sql");
const migration2 = read("sensor-platform/migrations/0002_iso_3166_1_alpha2.sql");
const wrangler = read("sensor-platform/wrangler.jsonc");
const openapi = read("smartcity-sensor-starter-kit/openapi.yaml");
const curl = read("smartcity-sensor-starter-kit/curl-examples.sh");
const starter = read("smartcity-sensor-starter-kit/esp32-arduino/SmartCitySensorDemo/SmartCitySensorDemo.ino");

check("global nav inserts sensor immediately after map", () => {
  const map = index.indexOf("<strong>地図で見る</strong>");
  const sensor = index.indexOf("<strong>センサーで参加</strong>");
  const space = index.indexOf("<strong>宇宙から見る</strong>");
  assert(map >= 0 && map < sensor && sensor < space);
  assert.match(index.slice(map, space), /data-sensor-platform-link/u);
});

check("SPA exposes required views and web operations", () => {
  for (const view of ["login", "loading", "devices", "add", "pairing", "detail", "guide"]) assert.match(sensorHtml, new RegExp(`data-view="${view}"`, "u"));
  for (const fragment of ["/session", "/countries", "/devices/pairing", "/latest", "/telemetry", 'method: "PATCH"', 'method: "DELETE"']) assert(sensorJs.includes(fragment), fragment);
});

check("OIDC flow is browser-bound, one-time and secure", () => {
  for (const fragment of ["state", "nonce", "code_challenge", "browser_binding_hash", "consumed_at", "timingSafeHexEqual", "redirectUri(env)", "iss", "aud", "exp", "sub"]) assert(auth.includes(fragment), fragment);
  assert.match(auth, /code_challenge_method: "S256"/u);
  assert.match(read("sensor-platform/src/http.ts"), /__Host-gaia_sensor_oidc[\s\S]*HttpOnly[\s\S]*Secure[\s\S]*SameSite=Lax/u);
  assert.match(auth, /UPDATE sessions SET token_hash/u);
});

check("owner isolation and token pairing controls", () => {
  for (const operation of ["listDevices", "getDevice", "getLatest", "getHistory", "updateDevice", "revokeDevice"]) assert(devices.includes(`export const ${operation}`), operation);
  assert((devices.match(/owner_user_id/g) || []).length >= 6);
  for (const fragment of ["used_at IS NULL", "expires_at >", "consumed_by_device_id", "DEVICE_TOKEN_PEPPER", "PAIRING_CODE_PEPPER", "status = 'ACTIVE'"]) assert(devices.includes(fragment), fragment);
});

check("telemetry is monotonic and idempotent", () => {
  for (const fragment of ["last_seq", "last_payload_hash", "payload_hash", "STALE_SEQUENCE", "SEQUENCE_CONFLICT", "?1 > last_seq", "UNIQUE(device_id, seq)"]) {
    assert(devices.includes(fragment) || migration1.includes(fragment), fragment);
  }
  assert.match(devices, /datetime\(d\.last_seen_at\) >= datetime\('now'/u);
  assert.match(validation, /RFC 3339 UTC timestamp/u);
  assert.match(validation, /new Date\(observedAt\)\.toISOString\(\)/u);
});

check("D1 schema has complete ISO alpha-2 master", () => {
  const codes = [...migration2.matchAll(/\('([A-Z]{2})'\)/gu)].map((match) => match[1]);
  assert.equal(codes.length, 249);
  assert.equal(new Set(codes).size, 249);
  for (const representative of ["JP", "US", "DE", "BR", "AQ"]) assert(codes.includes(representative));
  assert.match(migration1, /country_code TEXT NOT NULL REFERENCES countries\(code\)/u);
  assert.match(migration2, /INSERT OR IGNORE/u);
});

check("wrangler config has D1, generated Env, compatibility and observability", () => {
  for (const fragment of ['"nodejs_compat"', '"d1_databases"', '"migrations_dir"', '"observability"']) assert(wrangler.includes(fragment), fragment);
  assert(fs.existsSync(path.join(root, "sensor-platform/src/worker-configuration.d.ts")));
  assert.doesNotMatch(wrangler, /client_secret|token_pepper.*[A-Za-z0-9]{20}/iu);
});

check("OpenAPI 3.1 public contract is structurally complete", () => {
  assert.match(openapi, /^openapi: 3\.1\.0/mu);
  const pathKeys = [...openapi.matchAll(/^  (\/[^:]+):$/gmu)].map((match) => match[1]);
  assert.deepEqual(pathKeys, ["/device/pair", "/devices/{deviceId}/telemetry"]);
  for (const fragment of ["operationId: pairDevice", "operationId: postTelemetry", "deviceBearer", "additionalProperties: false", "'200':", "'201':", "'202':", "'400':", "'401':", "'409':", "'413':", "'415':"]) assert(openapi.includes(fragment), fragment);
  assert.match(openapi, /observedAt: \{ type: \[string, 'null'\], format: date-time/u);
});

check("curl flow safely carries one-time pair response", () => {
  for (const fragment of ["command -v jq", "mktemp -d", "umask 077", "trap", ".deviceId", ".deviceToken", "unset PAIRING_CODE", "--config", "chmod 600"]) assert(curl.includes(fragment), fragment);
  assert.doesNotMatch(curl, /DEVICE_TOKEN="gdt_/u);
});

check("Arduino kit provides setup AP, NVS, root CA and safe retry", () => {
  for (const fragment of ["CITY-SENSOR-", "WebServer", "DNSServer", "WiFi.softAP", "wifiSsid", "wifiPass", "pairCode", "preferences.remove(\"pairCode\")", "client.setCACert(ROOT_CA)", "USE_MOCK_SENSOR", "RETRY_ATTEMPTS", "esp_random()", "%Y-%m-%dT%H:%M:%SZ"]) assert(starter.includes(fragment), fragment);
  assert.doesNotMatch(starter, /setInsecure\s*\(/u);
  assert.doesNotMatch(starter, /Serial\.(?:print|printf).*deviceToken/iu);
});

check("scope excludes out-of-scope technologies and hardcoded secrets", () => {
  const tracked = [worker, auth, devices, validation, sensorJs, starter, wrangler].join("\n");
  for (const forbidden of [/\bmqtt\b/iu, /\bkafka\b/iu, /\bkubernetes\b/iu, /\bwebbluetooth\b/iu, /setInsecure\s*\(/u]) assert.doesNotMatch(tracked, forbidden);
  assert.doesNotMatch(tracked, /AIza[0-9A-Za-z_-]{20,}/u);
});

console.log(JSON.stringify({ status: "passed", scans: report.length, report }, null, 2));
