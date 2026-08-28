import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  analyzeAnova,
  analyzeBayes,
  analyzeCategorical,
  analyzeCorrelation,
  analyzeDistribution,
  analyzeInterval,
  analyzeLogistic,
  analyzeSampling,
  analyzeSummary,
  analyzeWelch,
  descriptive,
  simpleRegression,
} from "../statistics-lab-core.js";

const snapshot = JSON.parse(await readFile(new URL("../data/gaia-signals.json", import.meta.url), "utf8"));
const mode = (id) => snapshot.modes.find((candidate) => candidate.id === id)?.signals;
const closeTo = (actual, expected, tolerance, label) => assert.ok(Math.abs(actual - expected) <= tolerance, `${label}: expected ${expected}, got ${actual}`);

const assertInsight = (result, label) => {
  assert.ok(result?.insight, `${label}: insight missing`);
  assert.ok(result.insight.meaning?.trim(), `${label}: meaning missing`);
  assert.ok(result.insight.interpretation?.trim(), `${label}: interpretation missing`);
  assert.ok(Array.isArray(result.insight.limitations) && result.insight.limitations.join("").trim(), `${label}: limitations missing`);
  const prose = [result.insight.headline, result.insight.meaning, result.insight.interpretation].join(" ");
  assert.doesNotMatch(prose, /原因である|因果関係を証明した|差がない(?:。|$)/, `${label}: prohibited causal or null assertion`);
};

const breathing = mode("breathing-earth");
const co2Rows = breathing.co2.filter((row) => Number.isFinite(row.deseasonalizedPpm)).slice(-120);
const co2X = co2Rows.map((row) => row.year + (row.month - 0.5) / 12);
const co2Y = co2Rows.map((row) => row.deseasonalizedPpm);
const co2Model = simpleRegression(co2X, co2Y);
closeTo(co2Model.coefficients[1], 2.536558, 1e-5, "CO2 slope per year");
closeTo(co2Model.rSquared, 0.995353, 1e-6, "CO2 R2");
const co2Result = analyzeCorrelation({ x: co2X, y: co2Y, xLabel: "年", yLabel: "CO₂", xUnit: "年", yUnit: "ppm" });
assertInsight(co2Result, "CO2 regression");
closeTo(co2Result.metrics.find(([name]) => name === "回帰傾き")[1], co2Model.coefficients[1], 1e-12, "CO2 insight metric consistency");

const disaster = mode("rhythm-of-disaster");
const dates = disaster.globalEvents.map((event) => new Date(event.occurredAt));
const yearly = Array.from({ length: 25 }, (_, offset) => dates.filter((date) => date.getUTCFullYear() === 2001 + offset).length);
const earthquakeStats = descriptive(yearly);
assert.equal(earthquakeStats.n, 25);
closeTo(earthquakeStats.mean, 5.28, 1e-12, "earthquake mean");
closeTo(earthquakeStats.populationVariance, 4.4416, 1e-12, "earthquake variance");

const forest = mode("forest-cloud-engine");
const rainfall = forest.precipitation.map((row) => row.precipitationMmDay);
const rainfallStats = descriptive(rainfall);
assert.equal(rainfallStats.n, 31);
closeTo(rainfallStats.mean, 2.462580645, 1e-8, "rainfall mean");
closeTo(rainfallStats.median, 2.36, 1e-12, "rainfall median");
closeTo(rainfallStats.populationSd, 1.6481, 1e-4, "rainfall sd");
assertInsight(analyzeSummary({ values: rainfall, label: "降水量", unit: "mm/day" }), "rainfall summary");

const ecologies = mode("three-ecologies");
const paired = ecologies.pairedCountries;
const ecologyResult = analyzeCorrelation({ x: paired.map((row) => row.forestPercent), y: paired.map((row) => row.urbanPercent), xLabel: "森林率", yLabel: "都市化率", xUnit: "%", yUnit: "%" });
closeTo(ecologyResult.model.correlation, 0.2394, 1e-4, "forest urban correlation");
assertInsight(ecologyResult, "forest urban correlation");

const waste = mode("nothing-is-waste").countryWaste;
const sourceWaste = waste.filter((row) => row.valueStatus === "SOURCE").map((row) => row.recyclePercent);
const imputedWaste = waste.filter((row) => row.valueStatus !== "SOURCE").map((row) => row.recyclePercent);
assert.equal(sourceWaste.length, 17);
assert.equal(imputedWaste.length, 14);
closeTo(descriptive(sourceWaste).mean, 14.2255, 1e-4, "source waste mean");
closeTo(descriptive(imputedWaste).mean, 18.8871, 1e-4, "imputed waste mean");
assertInsight(analyzeWelch({ left: sourceWaste, right: imputedWaste, leftLabel: "SOURCE", rightLabel: "IMPUTED", unit: "%", diagnosticOnly: true, provenance: ["SOURCE", "IMPUTED"] }), "waste comparison");

const culture = ecologies.culture;
const cultureResult = analyzeCategorical({ categories: culture.map((row) => row.category), groups: culture.map((row) => row.region), categoryLabel: "カテゴリ", groupLabel: "地域" });
assertInsight(cultureResult, "culture sparse table");
assert.match(cultureResult.insight.headline, /期待度数が不足/);

const pollination = mode("pollination-protocol");
const pollinationResult = analyzeCategorical({ categories: pollination.interactions.map((row) => row.interaction), groups: pollination.interactions.map((row) => row.sourceTaxon), categoryLabel: "相互作用", groupLabel: "送粉者" });
assertInsight(pollinationResult, "pollination inapplicable");
assert.equal(pollinationResult.kind, "not-applicable");

const commonResults = [
  analyzeDistribution({ values: rainfall, label: "降水量", unit: "mm/day" }),
  analyzeSampling({ values: rainfall, label: "降水量", unit: "mm/day" }),
  analyzeInterval({ values: rainfall, label: "降水量", unit: "mm/day" }),
  analyzeAnova({ groups: [rainfall.slice(0, 10), rainfall.slice(10, 20), rainfall.slice(20)], labels: ["A", "B", "C"], diagnosticOnly: true }),
  analyzeLogistic({ x: paired.map((row) => row.forestPercent), y: paired.map((row) => row.urbanPercent > 70 ? 1 : 0), xLabel: "森林率", outcomeLabel: "都市化率70%超" }),
  analyzeBayes({ successes: 14, trials: 31, successLabel: "中央値超" }),
];
commonResults.forEach((result, index) => assertInsight(result, `common analysis ${index + 1}`));

console.log("GAIA Statistics Lab core checks passed: numeric fixtures, insight completeness, wording, and applicability.");
