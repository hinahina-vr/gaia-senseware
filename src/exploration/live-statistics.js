// Analyze only the values available to the current exhibit; do not substitute
// an unrelated 01–09 dataset, generate a history, or treat missing values as 0.
export const buildLiveStatistics = (exhibit, state, windField) => {
  if (!exhibit) return null;
  const measurement = state?.measurements?.[exhibit.key];
  const windPoints = exhibit.key === "weatherWindSpeed"
    ? (windField?.points || []).filter(point => Number.isFinite(point.windSpeed)) : [];
  let rows, unit, sourceName, sourceUrl, observedAt;
  if (windPoints.length) {
    rows = windPoints.map((point, index) => ({
      id: point.id, label: point.name || point.label || point.id,
      x: index + 1, y: point.windSpeed, value: point.windSpeed,
      lat: point.lat, lon: point.lon, provenance: "SOURCE",
    }));
    unit = "m/s";
    sourceName = "Open-Meteo / 47都道府県代表都市の風速モデル値";
    sourceUrl = "https://open-meteo.com/en/docs";
    observedAt = windField.generatedAt;
  } else {
    if (measurement?.value == null || measurement.quality === "missing" || !Number.isFinite(Number(measurement.value))) return null;
    const event = state.events?.find(event => event.provider === measurement.provider && event.datasetId === measurement.datasetId);
    const value = Number(measurement.value);
    rows = [{
      id: `${exhibit.id}-current`, label: measurement.location?.label || exhibit.shortTitle,
      x: 1, y: value, value, lat: measurement.location?.lat, lon: measurement.location?.lon,
      provenance: "SOURCE",
    }];
    unit = measurement.unit;
    sourceName = `${measurement.datasetId || measurement.provider || "公開データ"} / ${measurement.status === "snapshot" ? "保存済み" : "取得済み"}モデル値`;
    sourceUrl = event?.provenance?.sourceUrl;
    observedAt = measurement.observedAt;
  }
  return {
    id: `live-${exhibit.id}`, modeId: exhibit.id,
    title: `${exhibit.number} ${exhibit.shortTitle} — ${exhibit.signalLabel}（モデル値・${rows.length}地点）`,
    rows, unit, xLabel: "地点番号（表示順）", yLabel: exhibit.signalLabel,
    defaultMethod: "summary", provenance: ["SOURCE"],
    periodStart: observedAt, periodEnd: observedAt, sourceName, sourceUrl,
  };
};
