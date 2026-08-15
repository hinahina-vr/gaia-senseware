import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const port = Number(process.argv[2] || 4397);
let pairingIssued = false;
let deviceCreated = false;
let latestPolls = 0;
let avatarUploaded = false;
let lastPairingDraft = null;
let lastDeviceDraft = null;
const initialProfile = () => ({
  publicId: "usr_browserqa",
  displayName: "青猫センサー",
  avatarUrl: "/api/public/v1/profiles/usr_browserqa/avatar?v=qa",
  xUrl: "https://x.com/bluecat_sensor",
  githubUrl: "https://github.com/bluecat-sensor",
  instagramUrl: "https://instagram.com/bluecat.sensor",
});
let profile = initialProfile();
const avatarPng = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M/wHwAF/gL+X4u1WQAAAABJRU5ErkJggg==", "base64");
const initialDevice = () => ({
  deviceId: "dev_browser_qa",
  name: "ベランダ環境センサー",
  countryCode: "JP",
  countryName: "日本",
  subdivisionCode: "JP-13",
  subdivisionName: "東京都",
  municipalityCode: "131130",
  municipalityName: "渋谷区",
  admin1Code: "JP-13",
  localityName: "渋谷区",
  state: "OFFLINE",
  lastSeenAt: null,
  createdAt: "2026-08-12T00:00:00.000Z",
  isPublic: true,
  publicLatitude: 35.7,
  publicLongitude: 139.7,
});
let device = initialDevice();
const requests = [];

const server = http.createServer(async (request, response) => {
  const url = new URL(request.url || "/", `http://${request.headers.host}`);
  requests.push({ method: request.method, path: url.pathname, at: new Date().toISOString() });
  try {
    if (url.pathname === "/__qa/report") return sendJson(response, 200, { requests, latestPolls, avatarUploaded, lastPairingDraft, lastDeviceDraft, profile });
    if (url.pathname === "/__qa/reset" && request.method === "POST") {
      pairingIssued = false;
      deviceCreated = false;
      latestPolls = 0;
      avatarUploaded = false;
      lastPairingDraft = null;
      lastDeviceDraft = null;
      profile = initialProfile();
      device = initialDevice();
      return sendJson(response, 200, { ok: true });
    }
    if (url.pathname.startsWith("/api/")) return handleApi(request, response, url);
    const relative = decodeURIComponent(url.pathname === "/" ? "/index.html" : url.pathname);
    const resolved = path.resolve(root, `.${relative}`);
    if (resolved !== root && !resolved.startsWith(`${root}${path.sep}`)) return sendJson(response, 403, { error: "forbidden" });
    const stat = await fs.stat(resolved).catch(() => null);
    const file = stat?.isDirectory() ? path.join(resolved, "index.html") : resolved;
    const body = await fs.readFile(file);
    response.writeHead(200, { "Content-Type": contentType(file), "Cache-Control": "no-store" });
    response.end(body);
  } catch (error) {
    console.error("qa-server", error instanceof Error ? error.message : "unknown");
    sendJson(response, 404, { error: "not found" });
  }
});

server.listen(port, "127.0.0.1", () => console.log(`sensor qa http://127.0.0.1:${port}`));

async function handleApi(request, response, url) {
  const referer = request.headers.referer || "";
  if (referer.includes("error=1")) return sendJson(response, 500, { error: { code: "QA_ERROR", message: "QA用の通信エラーです。" } });
  if (url.pathname === "/api/public/v1/sensors" && request.method === "GET") {
    return sendJson(response, 200, { sensors: [{
      id: "sensor_browserqa", sensorName: "ベランダ環境センサー", state: "ONLINE", lastSeenAt: new Date().toISOString(),
       location: { latitude: 35.7, longitude: 139.7, precision: "APPROXIMATE_0_1_DEGREE" },
       region: { countryCode: "JP", subdivisionCode: "JP-13", subdivisionName: "東京都" },
      owner: { displayName: profile.displayName, avatarUrl: profile.avatarUrl, xUrl: profile.xUrl, githubUrl: profile.githubUrl, instagramUrl: profile.instagramUrl },
    }] });
  }
  if (url.pathname === "/api/public/v1/profiles/usr_browserqa/avatar" && request.method === "GET") {
    response.writeHead(200, { "Content-Type": "image/png", "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" });
    return response.end(avatarPng);
  }
  if (url.pathname === "/api/web/v1/session") {
    if (!referer.includes("authenticated=1")) return sendJson(response, 401, { error: { code: "AUTHENTICATION_REQUIRED", message: "Google login is required." } });
    return sendJson(response, 200, { user: { id: "user_browser_qa", displayName: "QA参加者" }, expiresAt: "2026-08-13T00:00:00.000Z" });
  }
  if (url.pathname === "/api/web/v1/countries") {
    return sendJson(response, 200, { countries: [{ code: "JP", nameEn: "Japan", nameLocal: "日本" }, { code: "US", nameEn: "United States", nameLocal: "アメリカ合衆国" }] });
  }
  if (url.pathname === "/api/web/v1/regions" && request.method === "GET") {
    const countryCode = url.searchParams.get("countryCode");
    const subdivisionCode = url.searchParams.get("subdivisionCode");
    const subdivisions = countryCode === "JP"
      ? [{ code: "JP-13", name: "東京都" }, { code: "JP-14", name: "神奈川県" }]
      : countryCode === "US" ? [{ code: "US-CA", name: "California" }] : [];
    const municipalities = subdivisionCode === "JP-13"
      ? [{ code: "131130", name: "渋谷区" }]
      : subdivisionCode === "JP-14" ? [{ code: "142085", name: "逗子市" }] : [];
    return sendJson(response, 200, { version: "qa", subdivisions, municipalities });
  }
  if (url.pathname === "/api/web/v1/profile" && request.method === "GET") return sendJson(response, 200, { profile });
  if (url.pathname === "/api/web/v1/profile" && request.method === "PATCH") {
    const body = await readJson(request);
    profile = { ...profile, ...body };
    return sendJson(response, 200, { profile });
  }
  if (url.pathname === "/api/web/v1/profile/avatar" && request.method === "PUT") {
    const chunks = [];
    for await (const chunk of request) chunks.push(chunk);
    avatarUploaded = Buffer.concat(chunks).length > 0;
    profile = { ...profile, avatarUrl: `/api/public/v1/profiles/usr_browserqa/avatar?v=${Date.now()}` };
    return sendJson(response, 200, { profile });
  }
  if (url.pathname === "/api/web/v1/profile/avatar" && request.method === "DELETE") {
    avatarUploaded = false;
    profile = { ...profile, avatarUrl: null };
    response.writeHead(204);
    return response.end();
  }
  if (url.pathname === "/api/web/v1/devices/pairing" && request.method === "POST") {
    lastPairingDraft = await readJson(request);
    pairingIssued = true;
    return sendJson(response, 201, { pairingCode: "H7K2-PQ9M", expiresAt: new Date(Date.now() + 600000).toISOString() });
  }
  if (url.pathname === "/api/web/v1/devices" && request.method === "GET") {
    if (pairingIssued && !deviceCreated) deviceCreated = true;
    return sendJson(response, 200, { devices: deviceCreated ? [device] : [] });
  }
  const match = url.pathname.match(/^\/api\/web\/v1\/devices\/([^/]+)(\/latest|\/telemetry)?$/u);
  if (!match || match[1] !== device.deviceId) return sendJson(response, 404, { error: { code: "DEVICE_NOT_FOUND", message: "Device was not found." } });
  if (match[2] === "/latest") {
    latestPolls += 1;
    device = { ...device, state: "ONLINE", lastSeenAt: new Date().toISOString() };
    return sendJson(response, 200, { device, latest: telemetry(4) });
  }
  if (match[2] === "/telemetry") return sendJson(response, 200, { telemetry: [telemetry(4), telemetry(3), telemetry(2)] });
  if (request.method === "PATCH") {
    const body = await readJson(request);
    lastDeviceDraft = body;
    const subdivisionNames = { "JP-13": "東京都", "JP-14": "神奈川県", "US-CA": "California" };
    const municipalityNames = { "131130": "渋谷区", "142085": "逗子市" };
    device = {
      ...device,
      ...body,
      countryName: body.countryCode === "JP" ? "日本" : "アメリカ合衆国",
      subdivisionName: subdivisionNames[body.subdivisionCode] || null,
      municipalityName: municipalityNames[body.municipalityCode] || null,
      admin1Code: body.subdivisionCode || body.admin1Code,
      localityName: municipalityNames[body.municipalityCode] || body.localityName,
    };
    return sendJson(response, 200, { device });
  }
  if (request.method === "DELETE") {
    deviceCreated = false;
    pairingIssued = false;
    response.writeHead(204);
    return response.end();
  }
  return sendJson(response, 405, { error: { code: "METHOD", message: "Method not allowed." } });
}

function telemetry(seq) {
  return { seq, observedAt: new Date(Date.now() - (4 - seq) * 10000).toISOString(), receivedAt: new Date().toISOString(), data: { temperature: 24 + seq / 10, humidity: 58.2, pm25: 9.1 } };
}
function sendJson(response, status, body) {
  response.writeHead(status, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
  response.end(JSON.stringify(body));
}
async function readJson(request) {
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}
function contentType(file) {
  const extension = path.extname(file).toLowerCase();
  return ({ ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".svg": "image/svg+xml", ".png": "image/png", ".webp": "image/webp", ".yaml": "text/yaml; charset=utf-8", ".md": "text/markdown; charset=utf-8", ".sh": "text/plain; charset=utf-8" })[extension] || "application/octet-stream";
}
