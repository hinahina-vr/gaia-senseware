// National model samples: one representative coordinate per prefecture, never
// a prefectural average or copies of the currently selected city's value.
export interface PrefectureCity { id: string; name: string; lat: number; lon: number }
export interface PrefectureField {
  schemaVersion: 1;
  source: "open-meteo" | "stale-cache" | "unavailable";
  generatedAt: string;
  points: Array<PrefectureCity & { observedAt: string | null; measurements: Record<string, number | null> }>;
  provenance: { sourceUrl: string; licenseUrl: string; transformVersion: string };
  fallbackReason?: string;
}
export const PREFECTURE_PROVIDERS = {
  weather: { url: "https://api.open-meteo.com/v1/forecast", ttl: 300_000,
    variables: { weatherWindSpeed: "wind_speed_10m", weatherTemperature: "temperature_2m", weatherPrecipitation: "precipitation", cloudCover: "cloud_cover" } },
  air: { url: "https://air-quality-api.open-meteo.com/v1/air-quality", ttl: 3_600_000,
    variables: { forecastCo2: "carbon_dioxide", pm25: "pm2_5" } },
} as const;
type Provider = keyof typeof PREFECTURE_PROVIDERS;
const version = "japan-prefecture-models-v1";
const numberOrNull = (value: unknown): number | null => typeof value === "number" && Number.isFinite(value) ? value : null;

export const emptyPrefectureField = (provider: Provider, cities: PrefectureCity[], reason: string): PrefectureField => ({
  schemaVersion: 1, source: "unavailable", generatedAt: new Date().toISOString(),
  points: cities.map(city => ({ ...city, observedAt: null,
    measurements: Object.fromEntries(Object.keys(PREFECTURE_PROVIDERS[provider].variables).map(key => [key, null])) })),
  provenance: { sourceUrl: PREFECTURE_PROVIDERS[provider].url, licenseUrl: "https://open-meteo.com/en/pricing", transformVersion: version },
  fallbackReason: reason,
});

export const fetchPrefectureField = async (provider: Provider, cities: PrefectureCity[]): Promise<PrefectureField> => {
  const definition = PREFECTURE_PROVIDERS[provider];
  const url = new URL(definition.url);
  url.search = new URLSearchParams({ latitude: cities.map(city => city.lat).join(","),
    longitude: cities.map(city => city.lon).join(","), current: Object.values(definition.variables).join(","),
    timezone: "GMT", forecast_days: "1", ...(provider === "weather" ? { wind_speed_unit: "ms" } : {}) }).toString();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);
  try {
    const response = await fetch(url, { signal: controller.signal, headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error(`Open-Meteo ${provider} ${response.status}`);
    // Fixed 47-location/current-only response; cap the body as well as its read time.
    const reader = response.body?.getReader();
    if (!reader) throw new Error("Open-Meteo body missing");
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 256_000) { await reader.cancel(); throw new Error("Open-Meteo body too large"); }
      chunks.push(value);
    }
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
    const locations = JSON.parse(new TextDecoder().decode(bytes)) as Array<{ current?: Record<string, unknown> }>;
    if (!Array.isArray(locations) || locations.length !== cities.length) throw new Error(`Open-Meteo ${provider} location count mismatch`);
    const field = emptyPrefectureField(provider, cities, "");
    field.source = "open-meteo";
    delete field.fallbackReason;
    field.provenance.sourceUrl = url.href;
    field.points = cities.map((city, index) => {
      const current = locations[index]?.current;
      const rawTime = current?.time;
      const time = typeof rawTime === "string" ? Date.parse(/(?:Z|[+-]\d{2}:?\d{2})$/u.test(rawTime) ? rawTime : `${rawTime}Z`) : NaN;
      const observedAt = Number.isFinite(time) ? new Date(time).toISOString() : null;
      return { ...city, observedAt, measurements: Object.fromEntries(Object.entries(definition.variables)
        .map(([key, variable]) => [key, observedAt ? numberOrNull(current?.[variable]) : null])) };
    });
    if (!field.points.some(point => Object.values(point.measurements).some(value => value !== null))) throw new Error(`Open-Meteo ${provider} values missing`);
    return field;
  } finally { clearTimeout(timeout); }
};

// Each provider has its own edge cache: an air outage cannot erase weather.
export const cachedPrefectureField = async (provider: Provider, cities: PrefectureCity[], enabled: boolean, ctx: ExecutionContext): Promise<PrefectureField> => {
  const cacheKey = new Request(`https://gaia-live-cache.invalid/${version}/${provider}`);
  const cache = (caches as CacheStorage & { default: Cache }).default;
  let cached: PrefectureField | undefined;
  try { cached = await (await cache.match(cacheKey))?.json<PrefectureField>(); } catch { /* Cache is optional. */ }
  if (cached && Date.now() - Date.parse(cached.generatedAt) < PREFECTURE_PROVIDERS[provider].ttl) return cached;
  try {
    if (!enabled) throw new Error("LIVE_SENSEWARE_ENABLED is not true");
    const field = await fetchPrefectureField(provider, cities);
    ctx.waitUntil(cache.put(cacheKey, new Response(JSON.stringify(field), { headers: {
      "Content-Type": "application/json", "Cache-Control": "public, max-age=604800",
    } })).catch(() => { /* A cache write failure must not discard valid data. */ }));
    return field;
  } catch (error) {
    const reason = error instanceof Error ? error.message : "National model unavailable";
    return cached ? { ...cached, source: "stale-cache", fallbackReason: reason } : emptyPrefectureField(provider, cities, reason);
  }
};
