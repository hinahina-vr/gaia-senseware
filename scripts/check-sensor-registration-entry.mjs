import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const read = (relative) => fs.readFileSync(path.join(root, relative), "utf8");
const index = read("index.html");
const sensors = read("sensors/index.html");
const css = read("sensors/sensor-platform.css");
const report = [];
const check = (name, run) => { run(); report.push({ name, status: "passed" }); };

check("ESP32 registration card follows map and links to the sensor SPA", () => {
  const map = index.indexOf('data-intro-path="map"');
  const sensor = index.indexOf("data-sensor-platform-link");
  const space = index.indexOf('data-intro-path="space"');
  assert(map >= 0 && map < sensor && sensor < space);
  const card = index.slice(index.lastIndexOf("<a", sensor), index.indexOf("</a>", sensor) + 4);
  assert.match(card, /href="\.\/sensors\/"/u);
  assert.match(card, /<strong>ESP32センサーを登録<\/strong>/u);
  assert.match(card, /class="intro-path-enter">ESP32センサーを登録/u);
});

check("logged-out registration CTA and three-step preview are explicit", () => {
  assert.match(sensors, /GoogleでログインしてESP32を登録/u);
  const preview = sensors.slice(sensors.indexOf("sensor-register-preview"), sensors.indexOf("</ol>", sensors.indexOf("sensor-register-preview")));
  for (const fragment of ["Googleでログイン", "端末を追加", "Pairing Code", "CITY-SENSOR-XXXX", "Setup APへ入力"]) assert(preview.includes(fragment), fragment);
});

check("pairing view contains complete Setup AP instructions", () => {
  const pairing = sensors.slice(sensors.indexOf('data-view="pairing"'), sensors.indexOf("</section>", sensors.indexOf('data-view="pairing"')));
  for (const fragment of ["PCまたはスマホ", "CITY-SENSOR-XXXX", "http://192.168.4.1/", "Wi-Fi", "このPairing Codeを入力"]) assert(pairing.includes(fragment), fragment);
});

check("registration uses canonical region selectors and the shared Natural Earth map", () => {
  for (const field of ['name="subdivisionCode"', 'name="municipalityCode"', "ISO 3166-2", "全国地方公共団体コード"]) assert(sensors.includes(field), field);
  assert.match(read("sensors/sensor-platform.js"), /natural-earth-50m-land\.geojson/u);
  assert.doesNotMatch(read("sensors/sensor-platform.js"), /mapSvg|<svg viewBox/u);
});

check("responsive styles preserve readable three-step layouts", () => {
  for (const selector of [".sensor-register-preview", ".sensor-setup-steps"]) assert(css.includes(selector));
  assert.match(css, /@media \(max-width: 760px\)[\s\S]*\.sensor-register-preview, \.sensor-setup-steps \{ grid-template-columns: 1fr;/u);
  assert.match(css, /\.sensor-login \.sensor-primary \{ width: 100%; min-width: 0;/u);
});

console.log(JSON.stringify({ status: "passed", scans: report.length, report }, null, 2));
