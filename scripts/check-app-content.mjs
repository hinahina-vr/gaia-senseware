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
assert.equal(content.modes.length, 8, "Earth mode catalog must contain 8 exhibits");
assert.equal(content.INTRO_MODE_CHOICES.length, 8, "Entrance catalog must contain 8 choices");
assert.equal(content.SPACE_MODE_CHOICES.length, 10, "Space catalog must contain 10 choices");
assert.deepEqual(Object.keys(content.INTRO_PATHS), ["abstract", "map", "novel", "space"], "Abstract exhibit must remain routable");
assert.equal(indexHtml.includes('data-intro-path="abstract"'), false, "Abstract exhibit must not remain a separate entrance card");
assert.equal(indexHtml.includes('class="map-surface-switch"'), false, "Obsolete MAP/LIGHT toggle remains in the world-reading bank");
assert.equal(indexHtml.includes('class="map-mode-groups"'), true, "MAP-only exhibit bank is missing");
assert.equal(indexHtml.includes('id="map-light-overlay"'), true, "Independent light overlay picker is missing");
assert.equal(indexHtml.includes('id="abstract-mode-list"'), true, "Eight-choice light overlay bank is missing");
assert.equal(indexHtml.includes('id="map-mode-preview"'), true, "Restored focus explanation preview is missing");
assert.equal(indexHtml.includes("SCROLL</b><small>他の展示を見る"), true, "Updated exhibit scroll label is missing");
assert.equal(indexHtml.includes('id="intro-character-jump"'), true, "Character settings menu button is missing");
assert.equal(indexHtml.includes('data-character-gallery-open'), true, "Character settings menu is not connected to the standalone viewer");
assert.equal(indexHtml.includes('id="gaia-template-character"'), true, "Lazy character settings template is missing");
assert.equal(indexHtml.includes('id="character-book-layer"'), true, "Standalone character settings viewer is missing");
assert.equal(indexHtml.includes("VISUAL MEMORY ARCHIVE"), true, "Immersive character archive heading is missing");
assert.equal(indexHtml.includes('id="character-book-webgl"'), true, "Immersive character setting atmosphere is missing");
assert.equal((indexHtml.match(/data-character-select=/gu) || []).length, 3, "Character setting selector must expose all three characters");
assert.equal((indexHtml.match(/data-character-profile=/gu) || []).length, 0, "Duplicate lower character profiles must remain removed");
assert.equal(indexHtml.includes('class="character-book-hero-detail"'), true, "Switchable hero character detail is missing");
assert.equal(indexHtml.includes('id="character-book-profile"'), true, "Switchable hero character profile is missing");
assert.equal(indexHtml.includes("01-three-ecologies-character-master.png"), true, "Character master sheet is missing");
assert.equal(modeLoader.includes('interceptClick("[data-character-gallery-open]", "character")'), true, "Character viewer is not lazy-loaded");
assert.equal(indexHtml.includes("このデータの出典を表示する"), false, "Old open-data button copy remains");
assert.equal(indexHtml.includes("この展示を統計で読み解く"), false, "Old statistics button copy remains");

const modeIds = content.modes.map(({ id }) => id);
assert.equal(new Set(modeIds).size, modeIds.length, "Mode ids must be unique");
assert.equal(modeIds.includes("pollination-protocol"), false, "Retired pollination exhibit remains routable");

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
