import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import vm from "node:vm";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const rootDirectory = path.resolve(scriptDirectory, "..");
const source = await readFile(path.join(rootDirectory, "app-content.js"), "utf8");
const indexHtml = await readFile(path.join(rootDirectory, "index.html"), "utf8");
const modeLoader = await readFile(path.join(rootDirectory, "gaia-mode-loader.js"), "utf8");
const sandbox = { window: {} };

vm.createContext(sandbox);
new vm.Script(source, { filename: "app-content.js" }).runInContext(sandbox);

const content = sandbox.window.GaiaAppContent;
const requiredKeys = [
  "JAPAN_NODES",
  "JMA_CO2_SITES",
  "EARTH_NODES",
  "SIMPLE_WORLD_LANDMASSES",
  "SIMPLE_WORLD_ISLAND_LINES",
  "JMA_EVENT_TITLES",
  "INTRO_PATHS",
  "INTRO_MODE_CHOICES",
  "SPACE_MODE_CHOICES",
  "modes",
  "modeConcepts",
  "modeDataNarratives",
  "lectureResumeLinks",
];

assert.ok(content, "GaiaAppContent was not published on window");
assert.ok(Object.isFrozen(content), "GaiaAppContent must be frozen");
assert.deepEqual(Object.keys(content), requiredKeys);
assert.equal(content.modes.length, 9, "Earth mode catalog must contain 9 exhibits");
assert.equal(content.INTRO_MODE_CHOICES.length, 9, "Entrance catalog must contain 9 choices");
assert.equal(content.SPACE_MODE_CHOICES.length, 10, "Space catalog must contain 10 choices");
assert.deepEqual(Object.keys(content.INTRO_PATHS), ["map", "novel", "space"], "Retired abstract exhibit must not remain routable");
assert.equal(indexHtml.includes('data-intro-path="abstract"'), false, "Retired abstract exhibit card remains in the entrance");
assert.equal(indexHtml.includes("光に触れる"), false, "Retired abstract exhibit copy remains in the entrance");

const modeIds = content.modes.map(({ id }) => id);
assert.equal(new Set(modeIds).size, modeIds.length, "Mode ids must be unique");

for (const id of modeIds) {
  assert.ok(content.modeConcepts[id], `Missing concept copy for ${id}`);
  assert.ok(content.modeDataNarratives[id], `Missing data narrative for ${id}`);
  assert.ok(content.lectureResumeLinks[id], `Missing lecture reference for ${id}`);
}

assert.ok(content.JAPAN_NODES.length > 0, "Japan node catalog is empty");
assert.ok(content.EARTH_NODES.length > 0, "Earth node catalog is empty");
assert.ok(content.SIMPLE_WORLD_LANDMASSES.length > 0, "Fallback world geometry is empty");

assert.ok(indexHtml.includes('src="./gaia-mode-loader.js'), "index.html does not load gaia-mode-loader.js");
const contentScriptPosition = modeLoader.indexOf('"./app-content.js');
const appScriptPosition = modeLoader.indexOf('"./app.js');
assert.ok(contentScriptPosition >= 0, "mode loader does not load app-content.js");
assert.ok(appScriptPosition >= 0, "mode loader does not load app.js");
assert.ok(contentScriptPosition < appScriptPosition, "app-content.js must load before app.js");

console.log(`app-content.js: ${modeIds.length} modes and ${requiredKeys.length} catalogs verified`);
