import assert from "node:assert/strict";
import fs from "node:fs";

const data = JSON.parse(fs.readFileSync(new URL("../data/estat-prefecture-series.json", import.meta.url), "utf8"));
const prefectureCount = 47;
const monthlyKeys = ["migration", "lodging", "housing"];
const annualKeys = [
  "averageTemperature",
  "summerHigh",
  "winterLow",
  "relativeHumidity",
  "sunshineHours",
  "precipitation",
  "rainyDays",
];
const temperatureKeys = ["averageTemperature", "summerHigh", "winterLow"];
const longTermYears = Array.from({ length: 71 }, (_, index) => String(1955 + index));

assert.deepEqual(data.months, ["2026-02", "2026-03", "2026-04", "2026-05", "2026-06"]);
for (const key of monthlyKeys) {
  for (const period of data.months) {
    assert.equal(data[key]?.[period]?.length, prefectureCount, `${key}/${period} must contain 47 prefectures`);
    assert.ok(data[key][period].every(Number.isFinite), `${key}/${period} must not contain missing values`);
  }
}

const missingBySeries = {};
const changedPrefecturesBySeries = {};
for (const key of annualKeys) {
  const periods = data.periodsBySeries?.[key];
  const expectedPeriods = temperatureKeys.includes(key)
    ? longTermYears
    : ["2020", "2021", "2022", "2023", "2024"];
  assert.deepEqual(periods, expectedPeriods, `${key} periods are incomplete`);
  const rows = periods.map((period) => {
    const values = data[key]?.[period];
    assert.equal(values?.length, prefectureCount, `${key}/${period} must contain 47 prefecture slots`);
    assert.ok(values.every((value) => value === null || Number.isFinite(value)), `${key}/${period} contains an invalid value`);
    return values;
  });
  missingBySeries[key] = rows.flat().filter((value) => value === null).length;
  assert.ok(missingBySeries[key] <= (temperatureKeys.includes(key) ? 0 : 2), `${key} has too many missing observations`);
  changedPrefecturesBySeries[key] = Array.from({ length: prefectureCount }, (_, index) => (
    new Set(rows.map((values) => values[index]).filter(Number.isFinite)).size
  )).filter((distinct) => distinct > 1).length;
  assert.ok(changedPrefecturesBySeries[key] >= 40, `${key} does not vary across enough prefectures`);
}

assert.equal(data.temperatureHistorySource?.publisher, "気象庁");
assert.equal(data.temperatureHistorySource?.coverage, "1955-2025 / 47都道府県の代表気象台・測候所");
assert.equal(data.temperatureHistorySource?.stations?.length, prefectureCount);
assert.deepEqual(
  data.temperatureHistorySource.stations.map(({ code }) => code),
  Array.from({ length: prefectureCount }, (_, index) => String(index + 1).padStart(2, "0")),
);
assert.ok(data.temperatureHistorySource.stations.every(({ url }) => /^https:\/\/www\.data\.jma\.go\.jp\//u.test(url)));

const linearTrendPerDecade = (values) => {
  const meanYear = longTermYears.reduce((sum, year) => sum + Number(year), 0) / longTermYears.length;
  const meanValue = values.reduce((sum, value) => sum + value, 0) / values.length;
  const numerator = values.reduce((sum, value, index) => sum + (Number(longTermYears[index]) - meanYear) * (value - meanValue), 0);
  const denominator = longTermYears.reduce((sum, year) => sum + (Number(year) - meanYear) ** 2, 0);
  return (numerator / denominator) * 10;
};
const warmingTrendBySeries = Object.fromEntries(temperatureKeys.map((key) => {
  const trends = Array.from({ length: prefectureCount }, (_, prefectureIndex) => linearTrendPerDecade(
    longTermYears.map((year) => data[key][year][prefectureIndex]),
  ));
  assert.ok(trends.filter((trend) => trend > 0).length >= 44, `${key} does not show a widespread long-term warming trend`);
  return [key, {
    minimum: Math.min(...trends),
    maximum: Math.max(...trends),
    mean: trends.reduce((sum, trend) => sum + trend, 0) / trends.length,
  }];
}));

assert.deepEqual(Object.keys(data.naturalEnvironmentSource?.publicationStatInfIds || {}), ["2022", "2023", "2024", "2025", "2026"]);
assert.equal(data.naturalEnvironmentSource?.missingValuePolicy, "欠損補完なし");

console.log(JSON.stringify({
  status: "passed",
  exhibits: monthlyKeys.length + annualKeys.length,
  prefectures: prefectureCount,
  annualPeriods: { temperature: longTermYears.length, other: 5 },
  missingBySeries,
  changedPrefecturesBySeries,
  warmingTrendBySeries,
}, null, 2));
