import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { setTimeout as delay } from "node:timers/promises";
import { fileURLToPath } from "node:url";

const sensorRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const root = path.resolve(sensorRoot, "..");
const nodePath = process.env.GAIA_NODE_PATH || process.execPath;
const wranglerPath = process.env.GAIA_WRANGLER_PATH || path.join(sensorRoot, "node_modules", "wrangler", "bin", "wrangler.js");
if (!fs.existsSync(wranglerPath)) throw new Error(`Wrangler entrypoint was not found: ${wranglerPath}`);
const origin = "http://127.0.0.1:8792";
const persistPath = path.join(root, ".wrangler", `pages-functions-test-${process.pid}`);
const reports = [];

const command = (argumentsList) => new Promise((resolve, reject) => {
  const child = spawn(nodePath, [wranglerPath, ...argumentsList], { cwd: root, env: process.env, windowsHide: true });
  let output = "";
  child.stdout.on("data", (chunk) => { output += chunk; });
  child.stderr.on("data", (chunk) => { output += chunk; });
  child.on("error", reject);
  child.on("exit", (code) => code === 0 ? resolve(output) : reject(new Error(output)));
});

await test("advanced handler delegates API and calls ASSETS exactly once for non-API", async () => {
  const source = fs.readFileSync(path.join(root, "sensor-platform", "src", "pages-entry.ts"), "utf8")
    .replace(/^import sensorPlatform[^\n]+$/mu, "const sensorPlatform = globalThis.__gaiaPagesSensorHandler;")
    .replace(/interface PagesEnv extends Env \{\r?\n  ASSETS: Fetcher;\r?\n\}\r?\n\r?\n/u, "")
    .replace(/: Request/gu, "")
    .replace(/: PagesEnv/gu, "")
    .replace(/: Promise<Response>/gu, "")
    .replace(/ satisfies ExportedHandler<PagesEnv>;/u, ";");
  let apiCalls = 0;
  let assetCalls = 0;
  globalThis.__gaiaPagesSensorHandler = { fetch: async () => { apiCalls += 1; return new Response("api"); } };
  const module = await import(`data:text/javascript;base64,${Buffer.from(source).toString("base64")}`);
  const env = { ASSETS: { fetch: async () => { assetCalls += 1; return new Response("static"); } } };
  assert.equal((await module.default.fetch(new Request("https://example.test/api/health"), env)).status, 200);
  assert.equal(apiCalls, 1);
  assert.equal(assetCalls, 0);
  assert.equal(await (await module.default.fetch(new Request("https://example.test/story"), env)).text(), "static");
  assert.equal(apiCalls, 1);
  assert.equal(assetCalls, 1);
  delete globalThis.__gaiaPagesSensorHandler;
});

await command(["d1", "migrations", "apply", "gaia-senseware-sensors", "--local", "--config", "wrangler.jsonc", `--persist-to=${persistPath}`]);

const server = spawn(nodePath, [
  wranglerPath,
  "pages", "dev", ".",
  "--port", "8792",
  "--ip", "127.0.0.1",
  `--persist-to=${persistPath}`,
  "--binding=ENVIRONMENT=local",
  `--binding=PUBLIC_ORIGIN=${origin}`,
  `--binding=WEB_ORIGIN=${origin}`,
], { cwd: root, env: process.env, windowsHide: true, stdio: ["ignore", "pipe", "pipe"] });
let serverOutput = "";
server.stdout.on("data", (chunk) => { serverOutput += chunk; });
server.stderr.on("data", (chunk) => { serverOutput += chunk; });

try {
  await waitForServer();
  await test("API health is a Function response", async () => {
    const response = await fetch(`${origin}/api/health`);
    assert.equal(response.status, 200);
    assert.equal((await response.json()).service, "gaia-senseware-sensor-platform");
    assert.match(response.headers.get("x-request-id") ?? "", /.+/u);
  });
  for (const staticPath of ["/story", "/sensors/", "/novel-mode.js", "/sensors/sensor-platform.js"]) {
    await test(`${staticPath} remains static`, async () => {
      const response = await fetch(`${origin}${staticPath}`);
      assert.equal(response.status, 200);
      assert.equal(response.headers.has("x-request-id"), false);
    });
  }
  await test("unknown API path still invokes the Function", async () => {
    const response = await fetch(`${origin}/api/not-found`);
    assert.equal(response.status, 401);
    assert.match(response.headers.get("x-request-id") ?? "", /.+/u);
  });
  assert.doesNotMatch(serverOutput, /(?:Uncaught|ERROR|Internal Server Error)/u);
  console.log(JSON.stringify({ status: "passed", scans: reports.length, reports }, null, 2));
} finally {
  server.kill();
}

async function test(name, run) {
  await run();
  reports.push({ name, status: "passed" });
}

async function waitForServer() {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    try {
      const response = await fetch(`${origin}/api/health`);
      if (response.ok) return;
    } catch {}
    await delay(250);
  }
  throw new Error(`Pages dev did not start.\n${serverOutput}`);
}
