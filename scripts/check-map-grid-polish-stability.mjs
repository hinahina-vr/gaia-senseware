import fs from "node:fs";

const source = fs.readFileSync(new URL("../map-ui-grid-polish.js", import.meta.url), "utf8");
const html = fs.readFileSync(new URL("../index.html", import.meta.url), "utf8");
const browserChecker = fs.readFileSync(new URL("./check-map-gx-p1-browser.mjs", import.meta.url), "utf8");

const checks = [
  ["data role uses the stable map panel", /data:\s*"#japan-layer > \.signal-console-map"/.test(source)],
  ["all four roles have stable selectors", ["japan-heading", "map-mode-bank", "signal-console-map", "map-scope-switch"].every((name) => source.includes(name))],
  ["stable selectors precede geometry fallback", /data:\s*document\.querySelector\(STABLE_SELECTORS\.data\)\s*\|\|\s*panelFrom/.test(source)],
  ["same panel identity is a no-op", /ROLES\.every\(\(role\) => markedPanels\[role\] === panels\[role\]\)\) return false/.test(source)],
  ["unchanged inline layout is a no-op", /getPropertyValue\(property\) === value/.test(source)],
  ["marked panel child mutations do not reschedule", /!target\?\.closest\("\[data-map-grid-role\]"\)/.test(source)],
  ["schedule coalesces without cancel/requeue", /if \(scheduled\) return;\s*scheduled = requestAnimationFrame\(layout\)/.test(source)],
  ["cache key is updated", /map-ui-grid-polish\.js\?v=2/.test(html)],
  ["browser checker samples the exact map panel", /#japan-layer > \.signal-console-map/.test(browserChecker)],
  ["browser checker requires 1200 samples", /polishTrace\.frames >= 1200/.test(browserChecker)],
  ["browser checker rejects marker churn", /markerMutations, 0/.test(browserChecker)],
];

const failures = checks.filter(([, passed]) => !passed).map(([name]) => name);
if (failures.length) throw new Error(`map grid polish stability check failed: ${failures.join(", ")}`);
console.log(`map grid polish stability check passed: ${checks.length}/${checks.length}`);
