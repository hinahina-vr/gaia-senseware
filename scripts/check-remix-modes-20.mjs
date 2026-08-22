import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = path.resolve(import.meta.dirname, "..");
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), "utf8");
const appContentSource = read("app-content.js");
const appSource = read("app.js");
const html = read("index.html");
const sandbox = { window: {} };

vm.runInNewContext(appContentSource, sandbox, { filename: "app-content.js" });
const content = sandbox.window.GaiaAppContent;
const baseIds = [
  "breathing-earth",
  "blue-circulation",
  "forest-cloud-engine",
  "pollination-protocol",
  "nothing-is-waste",
  "anthropocene-scar",
  "rhythm-of-disaster",
  "three-ecologies",
  "earth-organ",
  "senseware-2050",
];
const remixIds = [
  "breathing-earth-data",
  "blue-circulation-live",
  "forest-cloud-engine-live",
  "pollination-protocol-live",
  "nothing-is-waste-live",
  "anthropocene-scar-live",
  "rhythm-of-disaster-live",
  "three-ecologies-live",
  "earth-organ-live",
  "senseware-2050-live",
];

assert.equal(content.modes.length, 20);
assert.equal(content.INTRO_MODE_CHOICES.length, 20);
assert.deepEqual(Array.from(content.modes.slice(0, 10), ({ id }) => id), baseIds, "01-10 must remain the comparison baseline");
assert.deepEqual(Array.from(content.modes.slice(10), ({ id }) => id), remixIds, "11-20 remix order changed");

for (let index = 0; index < remixIds.length; index += 1) {
  const mode = content.modes[index + 10];
  const concept = content.modeConcepts[mode.id];
  assert.equal(mode.dataModeId, baseIds[index], `${mode.id} must reuse the matching source data`);
  assert(mode.description.length <= 80, `${mode.id} description is too long (${mode.description.length})`);
  assert.equal((mode.description.match(/。/gu) || []).length, 1, `${mode.id} description must stay one sentence`);
  assert.match(mode.source, /vec3 mode[A-Za-z0-9]+\(/u, `${mode.id} shader entry is missing`);
  assert(mode.source.length > 900, `${mode.id} shader is unexpectedly small`);
  assert(concept, `${mode.id} concept is missing`);
  assert(concept.lead.length <= 75, `${mode.id} lead is too long`);
  assert(concept.seeing.length <= 100, `${mode.id} seeing copy is too long`);
  assert(concept.touch.length <= 55, `${mode.id} touch copy is too long`);
  assert(concept.context.length <= 65, `${mode.id} context copy is too long`);
  assert(content.modeDataNarratives[mode.id], `${mode.id} data narrative is missing`);
  assert(content.lectureResumeLinks[mode.id], `${mode.id} lecture link is missing`);
}

assert.match(appSource, /const MODE_COUNT = 20/u);
for (let index = 10; index < 19; index += 1) {
  assert.match(appSource, new RegExp(`if \\(mode == ${index}\\) return mode`), `shader dispatch ${index + 1} is missing`);
}
assert.match(appSource, /return modeSenseware2050Live\(p, t, response, uModeMemory\[19\]\)/u);
assert.match(appSource, /DATA_TRANSFORMS\[mode\.dataModeId\]/u);
assert.match(appSource, /meanWindSpeed \/ 10/u);
assert.match(appSource, /routeValue\("incineration_and_other_reduction"\)/u);
assert.match(appSource, /normalizeLongitude\(event\?\.longitude\)/u);
assert.match(appSource, /current\?\.renewablePercent/u);
assert.match(appSource, /uniform float uSourceSignals\[9\]/u);
assert.match(appSource, /uniform sampler2D uLandCoverTexture/u);
assert.match(appSource, /uniform sampler2D uNightLightsTexture/u);
assert.match(content.modes[12].source, /texture\(uLandCoverTexture/u);
assert.match(content.modes[15].source, /texture\(uNightLightsTexture/u);
assert.match(content.modes[19].source, /uSourceSignals\[i\]/u);
assert.match(html, /地球観測データの20の展示/u);
assert.match(html, /INSTALLATION BANK \/ 01—20/u);
assert.match(html, /10テーマ・20演出/u);
assert.match(html, /01 \/ 20/u);

console.log(JSON.stringify({
  status: "passed",
  baseline: baseIds,
  remixes: remixIds,
  maximumDescriptionLength: Math.max(...content.modes.slice(10).map((mode) => mode.description.length)),
}, null, 2));
