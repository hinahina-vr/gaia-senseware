import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createHash, randomBytes } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { setTimeout as delay } from "node:timers/promises";

const root = new URL("..", import.meta.url).pathname.replace(/^\/(?:[A-Za-z]:)/u, (value) => value.slice(1)).replaceAll("/", "\\");
const nodePath = process.env.GAIA_NODE_PATH || process.execPath;
const wranglerPath = process.env.GAIA_WRANGLER_PATH || path.join(root, "node_modules", "wrangler", "bin", "wrangler.js");
if (!fs.existsSync(wranglerPath)) throw new Error(`Wrangler entrypoint was not found: ${wranglerPath}`);
const origin = "http://127.0.0.1:8791";
const persistPath = `${root}\\.wrangler\\api-test-state-${process.pid}`;
const reports = [];
const testSecrets = {
  GOOGLE_CLIENT_ID: `local-test-${randomBytes(12).toString("hex")}`,
  GOOGLE_CLIENT_SECRET: randomBytes(32).toString("hex"),
  SESSION_SECRET: randomBytes(32).toString("hex"),
  DEVICE_TOKEN_PEPPER: randomBytes(32).toString("hex"),
  PAIRING_CODE_PEPPER: randomBytes(32).toString("hex"),
};

const command = (argumentsList) => new Promise((resolve, reject) => {
  const child = spawn(nodePath, [wranglerPath, ...argumentsList], { cwd: root, env: process.env, windowsHide: true });
  let output = "";
  child.stdout.on("data", (chunk) => { output += chunk; });
  child.stderr.on("data", (chunk) => { output += chunk; });
  child.on("error", reject);
  child.on("exit", (code) => code === 0 ? resolve(output) : reject(new Error(output)));
});

await command(["d1", "migrations", "apply", "gaia-senseware-sensors-local", "--local", `--persist-to=${persistPath}`]);
const migrationReapplyOutput = await command(["d1", "migrations", "apply", "gaia-senseware-sensors-local", "--local", `--persist-to=${persistPath}`]);
await command(["d1", "execute", "gaia-senseware-sensors-local", "--local", `--persist-to=${persistPath}`, "--file=test/seed-local.sql"]);

const server = spawn(nodePath, [
  wranglerPath,
  "dev", "--local", "--port", "8791", `--persist-to=${persistPath}`,
  ...Object.entries(testSecrets).flatMap(([name, value]) => ["--var", `${name}:${value}`]),
], {
  cwd: root,
  env: process.env,
  windowsHide: true,
  stdio: ["ignore", "pipe", "pipe"],
});
let serverOutput = "";
server.stdout.on("data", (chunk) => { serverOutput += chunk; });
server.stderr.on("data", (chunk) => { serverOutput += chunk; });

try {
  await waitForServer();
  await test("health and security headers", async () => {
    const response = await fetch(`${origin}/api/health`);
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("x-frame-options"), "DENY");
    assert.match(response.headers.get("permissions-policy") ?? "", /geolocation=\(\)/u);
  });
  await test("public route rejects non-JSON", async () => {
    const response = await fetch(`${origin}/api/v1/device/pair`, { method: "POST", body: "{}" });
    assert.equal(response.status, 415);
  });
  await test("payload size limit", async () => {
    const response = await fetch(`${origin}/api/v1/device/pair`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pairingCode: "AAAA-AAAA", padding: "x".repeat(3000) }),
    });
    assert.equal(response.status, 413);
  });
  await test("session required", async () => {
    const response = await fetch(`${origin}/api/web/v1/devices`);
    assert.equal(response.status, 401);
  });
  await test("migrations are sequential and safe to reapply", async () => {
    assert.match(migrationReapplyOutput, /No migrations to apply/u);
    assert.equal(await scalar("SELECT COUNT(*) FROM d1_migrations"), "5");
  });
  await test("OIDC flow cookie binds callback to the starting browser", async () => {
    const start = await fetch(`${origin}/api/auth/google/start`, { redirect: "manual" });
    assert.equal(start.status, 302);
    const cookie = start.headers.get("set-cookie") ?? "";
    assert.match(cookie, /__Host-gaia_sensor_oidc=/u);
    assert.match(cookie, /; Secure;/u);
    assert.match(cookie, /; HttpOnly;/u);
    assert.match(cookie, /; SameSite=Lax/u);
    const location = new URL(start.headers.get("location"));
    const state = location.searchParams.get("state");
    assert(state);
    const wrongBrowser = await fetch(`${origin}/api/auth/google/callback?state=${encodeURIComponent(state)}&code=not-exchanged`, {
      redirect: "manual",
    });
    assert.equal(wrongBrowser.status, 400);
    assert.equal((await wrongBrowser.json()).error.code, "INVALID_OIDC_STATE");
    assert.match(wrongBrowser.headers.get("set-cookie") ?? "", /__Host-gaia_sensor_oidc=.*Max-Age=0/u);
    const stillUnused = await query("SELECT consumed_at FROM oauth_flows ORDER BY created_at DESC LIMIT 1");
    assert.match(stillUnused, /consumed_at.*null/isu);
  });

  const auth = await createLocalSession("user_test_owner");
  const otherAuth = await createLocalSession("user_test_other");
  await test("public sensor endpoint is available without a session", async () => {
    const response = await fetch(`${origin}/api/public/v1/sensors`);
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { sensors: [] });
  });
  await test("owner profile stores display name and optional social profile URLs", async () => {
    const update = await webFetch("/api/web/v1/profile", auth, {
      method: "PATCH",
      body: {
        displayName: "青猫センサー",
        xUrl: "https://x.com/bluecat_sensor",
        githubUrl: "https://github.com/bluecat-sensor",
        instagramUrl: "https://instagram.com/bluecat.sensor",
      },
    });
    assert.equal(update.status, 200);
    const profile = (await update.json()).profile;
    assert.equal(profile.publicId, "usr_testowner");
    assert.equal(profile.displayName, "青猫センサー");
    assert.equal(profile.githubUrl, "https://github.com/bluecat-sensor");
    assert.equal(Object.hasOwn(profile, "email"), false);
  });
  await test("social links only accept the intended HTTPS account hosts", async () => {
    const response = await webFetch("/api/web/v1/profile", auth, {
      method: "PATCH",
      body: { displayName: "青猫センサー", xUrl: "https://example.com/tracker", githubUrl: null, instagramUrl: null },
    });
    assert.equal(response.status, 400);
    assert.equal((await response.json()).error.code, "INVALID_SOCIAL_URL");
  });
  const avatarPng = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M/wHwAF/gL+X4u1WQAAAABJRU5ErkJggg==", "base64");
  await test("avatar upload requires PNG, strips ancillary metadata, and is publicly readable by opaque id", async () => {
    const wrongType = await webFetch("/api/web/v1/profile/avatar", auth, {
      method: "PUT", rawBody: Buffer.from("not an image"), contentType: "image/jpeg",
    });
    assert.equal(wrongType.status, 415);
    const upload = await webFetch("/api/web/v1/profile/avatar", auth, {
      method: "PUT", rawBody: avatarPng, contentType: "image/png",
    });
    assert.equal(upload.status, 200);
    const profile = (await upload.json()).profile;
    assert.match(profile.avatarUrl, /^\/api\/public\/v1\/profiles\/usr_testowner\/avatar\?v=/u);
    const avatar = await fetch(`${origin}${profile.avatarUrl}`);
    assert.equal(avatar.status, 200);
    assert.equal(avatar.headers.get("content-type"), "image/png");
    assert.deepEqual(Buffer.from(await avatar.arrayBuffer()).subarray(0, 8), avatarPng.subarray(0, 8));
  });
  await test("session credential rotates while preserving expiry and Secure host cookie", async () => {
    const rotationAuth = await createLocalSession("user_test_owner");
    const session = await webFetch("/api/web/v1/session", rotationAuth);
    assert.equal(session.status, 200);
    assert.match(session.headers.get("set-cookie") ?? "", /^__Host-gaia_sensor_session=.*; Path=\/; HttpOnly; Secure; SameSite=Lax/u);
    assert.equal((await webFetch("/api/web/v1/devices", rotationAuth)).status, 401);
  });
  let pairingCode = "";
  await test("CSRF required for pairing creation", async () => {
    const response = await webFetch("/api/web/v1/devices/pairing", auth, { method: "POST", includeCsrf: false, body: deviceDraft() });
    assert.equal(response.status, 403);
  });
  await test("ISO 3166-1 country master has 249 valid unique codes and foreign keys", async () => {
    assert.equal(await scalar("SELECT COUNT(*) FROM countries"), "249");
    assert.equal(await scalar("SELECT COUNT(DISTINCT code) FROM countries"), "249");
    assert.equal(await scalar("SELECT COUNT(*) FROM countries WHERE code NOT GLOB '[A-Z][A-Z]' OR length(code) <> 2"), "0");
    assert.equal(await scalar("SELECT COUNT(*) FROM countries WHERE code IN ('JP','US','DE','BR','AQ')"), "5");
    assert.equal(await scalar("SELECT COUNT(*) FROM pragma_foreign_key_list('devices') WHERE \"table\" = 'countries'"), "1");
    const invalidCountry = await webFetch("/api/web/v1/devices/pairing", auth, {
      method: "POST",
      body: { ...deviceDraft(), countryCode: "ZZ" },
    });
    assert.equal(invalidCountry.status, 400);
  });
  await test("canonical region registry lists current ISO subdivisions and official Japanese municipalities", async () => {
    const japan = await webFetch("/api/web/v1/regions?countryCode=JP&subdivisionCode=JP-14", auth);
    assert.equal(japan.status, 200);
    const japanBody = await japan.json();
    assert.equal(japanBody.subdivisions.length, 47);
    assert.deepEqual(japanBody.subdivisions.find(({ code }) => code === "JP-14"), { code: "JP-14", name: "神奈川県" });
    assert.deepEqual(japanBody.municipalities.find(({ code }) => code === "142085"), { code: "142085", name: "逗子市" });
    const unitedStates = await webFetch("/api/web/v1/regions?countryCode=US", auth);
    assert.equal(unitedStates.status, 200);
    assert((await unitedStates.json()).subdivisions.some(({ code }) => code === "US-CA"));
    assert.equal(await scalar("SELECT COUNT(*) FROM pragma_table_info('devices') WHERE name IN ('subdivision_code','municipality_code')"), "2");
    assert.equal(await scalar("SELECT COUNT(*) FROM pragma_table_info('device_pairing_codes') WHERE name IN ('subdivision_code','municipality_code')"), "2");
  });
  await test("region validation rejects malformed, conflicting, and bad-check-digit codes", async () => {
    const cases = [
      [{ ...deviceDraft(), subdivisionCode: "JP-ZZ" }, "INVALID_SUBDIVISION"],
      [{ ...deviceDraft(), countryCode: "US", subdivisionCode: "US-CA", municipalityCode: "142085" }, "INVALID_MUNICIPALITY"],
      [{ ...deviceDraft(), municipalityCode: "142086" }, "INVALID_MUNICIPALITY"],
      [{ ...deviceDraft(), countryCode: "US" }, "REGION_FIELD_CONFLICT"],
      [{ ...deviceDraft(), admin1Code: "JP-13" }, "REGION_FIELD_CONFLICT"],
    ];
    for (const [body, code] of cases) {
      const response = await webFetch("/api/web/v1/devices/pairing", auth, { method: "POST", body });
      assert.equal(response.status, 400);
      assert.equal((await response.json()).error.code, code);
    }
  });
  await test("legacy location payload remains accepted without canonical fields", async () => {
    const response = await webFetch("/api/web/v1/devices/pairing", auth, { method: "POST", body: legacyDeviceDraft() });
    assert.equal(response.status, 201);
    assert.equal(await scalar("SELECT COUNT(*) FROM device_pairing_codes WHERE subdivision_code IS NULL AND admin1_code = 'JP-14'"), "1");
  });
  await test("Japanese municipality code derives its ISO prefecture when omitted", async () => {
    const response = await webFetch("/api/web/v1/devices/pairing", auth, {
      method: "POST",
      body: { ...deviceDraft(), subdivisionCode: null },
    });
    assert.equal(response.status, 201);
    assert.equal(await scalar("SELECT COUNT(*) FROM device_pairing_codes WHERE subdivision_code = 'JP-14' AND municipality_code = '142085'"), "1");
  });
  await test("owner creates one-time pairing code", async () => {
    const response = await webFetch("/api/web/v1/devices/pairing", auth, { method: "POST", body: deviceDraft() });
    assert.equal(response.status, 201);
    const body = await response.json();
    assert.match(body.pairingCode, /^[2-9A-HJ-NP-Z]{4}-[2-9A-HJ-NP-Z]{4}$/u);
    pairingCode = body.pairingCode;
    const hashProbe = await query(`SELECT code_hash, used_at FROM device_pairing_codes WHERE user_id = 'user_test_owner' ORDER BY created_at DESC LIMIT 1`);
    assert.equal(hashProbe.includes(pairingCode), false);
    assert.match(hashProbe, /[a-f0-9]{64}/u);
    const regionProbe = await query("SELECT subdivision_code, municipality_code, admin1_code, locality_name FROM device_pairing_codes WHERE user_id = 'user_test_owner' ORDER BY created_at DESC LIMIT 1");
    assert.match(regionProbe, /JP-14/su);
    assert.match(regionProbe, /142085/su);
    assert.match(regionProbe, /逗子市/su);
  });

  let deviceId = "";
  let deviceToken = "";
  await test("pairing code concurrent consume is exactly once", async () => {
    const call = () => fetch(`${origin}/api/v1/device/pair`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pairingCode }),
    });
    const responses = await Promise.all([call(), call()]);
    assert.deepEqual(responses.map((response) => response.status).sort(), [201, 409]);
    const success = responses.find((response) => response.status === 201);
    assert(success);
    const body = await success.json();
    deviceId = body.deviceId;
    deviceToken = body.deviceToken;
    assert.match(deviceToken, /^gdt_[A-Za-z0-9_-]{43}$/u);
    const counts = await query(`SELECT COUNT(*) AS device_count FROM devices WHERE owner_user_id = 'user_test_owner'`);
    assert.match(counts, /device_count.*1/su);
    assert.doesNotMatch(await query("SELECT token_hash FROM devices"), new RegExp(deviceToken, "u"));
  });

  await test("device token must match path device", async () => {
    const response = await telemetryFetch("dev_not_the_same", deviceToken, 1);
    assert.equal(response.status, 401);
  });
  await test("telemetry schema rejects unknown and nonfinite representation", async () => {
    const response = await fetch(`${origin}/api/v1/devices/${deviceId}/telemetry`, {
      method: "POST",
      headers: { Authorization: `Bearer ${deviceToken}`, "Content-Type": "application/json" },
      body: JSON.stringify({ seq: 1, data: { temperature: 21 }, extra: true }),
    });
    assert.equal(response.status, 400);
  });
  await test("Arduino seconds-only RFC3339 payload is canonicalized and idempotent", async () => {
    const starterObservedAt = new Date().toISOString().replace(/\.\d{3}Z$/u, "Z");
    const first = await telemetryFetch(deviceId, deviceToken, 1, starterObservedAt);
    const second = await telemetryFetch(deviceId, deviceToken, 1, starterObservedAt);
    assert.equal(first.status, 202);
    assert.equal(second.status, 200);
    assert.equal((await second.json()).duplicate, true);
    assert.match(await query(`SELECT COUNT(*) AS telemetry_count FROM telemetry WHERE device_id = '${deviceId}'`), /telemetry_count.*1/su);
    assert.equal(await scalar(`SELECT observed_at FROM telemetry WHERE device_id = '${deviceId}' AND seq = 1`), new Date(starterObservedAt).toISOString());
  });
  await test("same seq with different payload is rejected", async () => {
    const response = await fetch(`${origin}/api/v1/devices/${deviceId}/telemetry`, {
      method: "POST",
      headers: { Authorization: `Bearer ${deviceToken}`, "Content-Type": "application/json" },
      body: JSON.stringify({ seq: 1, data: { temperature: 99 } }),
    });
    assert.equal(response.status, 409);
    assert.equal((await response.json()).error.code, "SEQUENCE_CONFLICT");
  });
  await test("lower unused seq is stale and does not update last_seen", async () => {
    assert.equal((await telemetryFetch(deviceId, deviceToken, 3)).status, 202);
    const before = await scalar(`SELECT last_seen_at FROM devices WHERE device_id = '${deviceId}'`);
    await delay(20);
    const stale = await telemetryFetch(deviceId, deviceToken, 2);
    assert.equal(stale.status, 409);
    assert.equal((await stale.json()).error.code, "STALE_SEQUENCE");
    const after = await scalar(`SELECT last_seen_at FROM devices WHERE device_id = '${deviceId}'`);
    assert.equal(after, before);
  });
  await test("concurrent next sequences only advance monotonically", async () => {
    const responses = await Promise.all([
      telemetryFetch(deviceId, deviceToken, 4),
      telemetryFetch(deviceId, deviceToken, 4),
    ]);
    assert.deepEqual(responses.map((response) => response.status).sort(), [200, 202]);
    assert.equal(await scalar(`SELECT last_seq FROM devices WHERE device_id = '${deviceId}'`), "4");
    assert.equal(await scalar(`SELECT COUNT(*) FROM telemetry WHERE device_id = '${deviceId}' AND seq = 4`), "1");
  });
  await test("owner latest/history and other user isolation", async () => {
    const latest = await webFetch(`/api/web/v1/devices/${deviceId}/latest`, auth);
    assert.equal(latest.status, 200);
    const ownerDevice = (await latest.json()).device;
    assert.equal(ownerDevice.subdivisionCode, "JP-14");
    assert.equal(ownerDevice.subdivisionName, "神奈川県");
    assert.equal(ownerDevice.municipalityCode, "142085");
    assert.equal(ownerDevice.municipalityName, "逗子市");
    assert.equal((await webFetch(`/api/web/v1/devices/${deviceId}/telemetry?limit=10`, auth)).status, 200);
    assert.equal((await webFetch(`/api/web/v1/devices/${deviceId}`, otherAuth)).status, 404);
    assert.equal((await webFetch(`/api/web/v1/devices/${deviceId}/latest`, otherAuth)).status, 404);
    assert.equal((await webFetch(`/api/web/v1/devices/${deviceId}/telemetry`, otherAuth)).status, 404);
  });
  await test("ONLINE threshold handles ISO timestamps at 29s and 31s", async () => {
    const online29 = await scalar("SELECT datetime('2026-08-12T08:21:31.000Z') >= datetime('2026-08-12T08:22:00.000Z', '-30 seconds')");
    const offline31 = await scalar("SELECT datetime('2026-08-12T08:21:29.000Z') >= datetime('2026-08-12T08:22:00.000Z', '-30 seconds')");
    assert.equal(online29, "1");
    assert.equal(offline31, "0");
  });
  await test("location update owner-only then logical revoke stops token", async () => {
    const update = await webFetch(`/api/web/v1/devices/${deviceId}`, auth, {
      method: "PATCH",
      body: { ...deviceDraft(), isPublic: true, publicLatitude: 35.294, publicLongitude: 139.581 },
    });
    assert.equal(update.status, 200);
    assert.equal((await update.json()).device.isPublic, true);
    const publicResponse = await fetch(`${origin}/api/public/v1/sensors`);
    assert.equal(publicResponse.status, 200);
    const publicBody = await publicResponse.json();
    assert.equal(publicBody.sensors.length, 1);
    assert.equal(publicBody.sensors[0].location.latitude, 35.3);
    assert.equal(publicBody.sensors[0].location.longitude, 139.6);
    assert.deepEqual(publicBody.sensors[0].region, { countryCode: "JP", subdivisionCode: "JP-14", subdivisionName: "神奈川県" });
    assert.equal(publicBody.sensors[0].owner.displayName, "青猫センサー");
    assert.equal(publicBody.sensors[0].owner.xUrl, "https://x.com/bluecat_sensor");
    assert.equal(Object.hasOwn(publicBody.sensors[0], "lastSeenAt"), false);
    const publicJson = JSON.stringify(publicBody);
    assert.doesNotMatch(publicJson, /user_test_owner|@|localityName|municipality|142085|逗子市/u);
    const forbidden = await webFetch(`/api/web/v1/devices/${deviceId}`, otherAuth, {
      method: "PATCH",
      body: deviceDraft(),
    });
    assert.equal(forbidden.status, 404);
    const revoke = await webFetch(`/api/web/v1/devices/${deviceId}`, auth, { method: "DELETE" });
    assert.equal(revoke.status, 204);
    assert.equal((await telemetryFetch(deviceId, deviceToken, 2)).status, 401);
  });

  const leaked = /(Authorization: Bearer|gdt_[A-Za-z0-9_-]{20,}|[2-9A-HJ-NP-Z]{4}-[2-9A-HJ-NP-Z]{4})/u.test(serverOutput);
  assert.equal(leaked, false, "server output must not contain credentials");
  assert.equal(Object.values(testSecrets).some((secret) => serverOutput.includes(secret)), false, "server output must not contain test secrets");
  console.log(JSON.stringify({ status: "passed", scans: reports.length, reports }, null, 2));
} finally {
  server.kill();
}

async function test(name, run) {
  await run();
  reports.push({ name, status: "passed" });
}

async function waitForServer() {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const response = await fetch(`${origin}/api/health`);
      if (response.ok) return;
    } catch {}
    await delay(250);
  }
  throw new Error(`Worker did not start.\n${serverOutput}`);
}

function deviceDraft() {
  return {
    name: "ベランダ環境センサー",
    countryCode: "JP",
    subdivisionCode: "JP-14",
    municipalityCode: "142085",
    admin1Code: null,
    localityName: null,
  };
}

function legacyDeviceDraft() {
  return { name: "旧クライアント", countryCode: "JP", admin1Code: "JP-14", localityName: "逗子市" };
}

async function createLocalSession(userId) {
  const token = `gs_${randomBytes(32).toString("base64url")}`;
  const csrf = `csrf_${randomBytes(32).toString("base64url")}`;
  const tokenHash = createHash("sha256").update(token).digest("hex");
  const csrfHash = createHash("sha256").update(csrf).digest("hex");
  const id = randomBytes(12).toString("hex");
  const expires = new Date(Date.now() + 3_600_000).toISOString();
  const now = new Date().toISOString();
  await execute(`INSERT INTO sessions (id, token_hash, user_id, csrf_hash, expires_at, created_at, last_seen_at) VALUES ('${id}', '${tokenHash}', '${userId}', '${csrfHash}', '${expires}', '${now}', '${now}')`);
  return { token, csrf, tokenHash, csrfHash };
}

async function webFetch(path, auth, options = {}) {
  const headers = { Cookie: `__Host-gaia_sensor_session=${auth.token}; __Host-gaia_sensor_csrf=${auth.csrf}` };
  if (options.includeCsrf !== false && options.method && options.method !== "GET") headers["X-CSRF-Token"] = auth.csrf;
  let body;
  if (options.body) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(options.body);
  } else if (options.rawBody) {
    headers["Content-Type"] = options.contentType || "application/octet-stream";
    body = options.rawBody;
  }
  return fetch(`${origin}${path}`, { method: options.method ?? "GET", headers, body });
}

function telemetryFetch(id, token, seq, observedAt) {
  return fetch(`${origin}/api/v1/devices/${id}/telemetry`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ seq, ...(observedAt ? { observedAt } : {}), data: { temperature: 21.4, humidity: 58.2, pm25: 9.1 } }),
  });
}

async function execute(sql) {
  await command(["d1", "execute", "gaia-senseware-sensors-local", "--local", `--persist-to=${persistPath}`, "--command", sql]);
}

async function query(sql) {
  return command(["d1", "execute", "gaia-senseware-sensors-local", "--local", `--persist-to=${persistPath}`, "--command", sql]);
}

async function scalar(sql) {
  const output = await command(["d1", "execute", "gaia-senseware-sensors-local", "--local", `--persist-to=${persistPath}`, "--json", "--command", sql]);
  const parsed = JSON.parse(output);
  const row = parsed[0]?.results?.[0];
  return row ? String(Object.values(row)[0]) : "";
}
