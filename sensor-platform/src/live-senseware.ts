import { fromUrl } from "geotiff";

const HAWAII_BBOX = [-156.2, 18.8, -154.7, 20.3] as const;
const HAWAII_CENTER = { lat: 19.55, lon: -155.45 } as const;
const TOKYO_BBOX = [139.4, 35.45, 139.95, 35.9] as const;
const TOKYO_CENTER = { lat: 35.6762, lon: 139.6503 } as const;
const TRANSFORM_VERSION = "live-senseware-v2-open-meteo";
const STREAM_LIFETIME_MS = 10 * 60 * 1_000;
const STREAM_REFRESH_MS = 5 * 60 * 1_000;
const HEARTBEAT_MS = 15_000;

type Provider = "noaa" | "jaxa" | "esa" | "open-meteo";
type LiveStatus = "near-real-time" | "latest-published" | "stale" | "snapshot";
type MeasurementKey = "windSpeed" | "airTemperature" | "co2" | "precipitation" | "no2"
  | "weatherWindSpeed" | "weatherTemperature" | "weatherPrecipitation" | "cloudCover" | "forecastCo2" | "pm25";

interface LiveMeasurement {
  key: MeasurementKey;
  value: number | null;
  unit: string;
  quality: "valid" | "estimated" | "missing";
  sourceKind: "SOURCE" | "MODEL";
}

export interface LiveObservationEvent {
  schemaVersion: 1;
  eventId: string;
  provider: Provider;
  datasetId: string;
  status: LiveStatus;
  observedAt: string;
  retrievedAt: string;
  location: { label: string; lat: number; lon: number; bbox: readonly number[] };
  measurements: LiveMeasurement[];
  provenance: { sourceUrl: string; licenseUrl: string; transformVersion: string };
  fallbackReason?: string;
}

interface LiveEnv {
  ASSETS: Fetcher;
  LIVE_SENSEWARE_ENABLED?: string;
  LIVE_SENSEWARE_JAXA_ENABLED?: string;
  LIVE_SENSEWARE_ESA_ENABLED?: string;
  CDSE_CLIENT_ID?: string;
  CDSE_CLIENT_SECRET?: string;
}

interface CachedEvent {
  event: LiveObservationEvent;
  upstreamEtag?: string;
  upstreamLastModified?: string;
}

interface ProviderDefinition {
  cacheKey: string;
  ttlMs: number;
  load: (conditional: Headers) => Promise<CachedEvent>;
}

const jsonHeaders = Object.freeze({
  "Cache-Control": "no-store",
  "Content-Type": "application/json; charset=utf-8",
  "X-Content-Type-Options": "nosniff",
});

const fetchWithTimeout = async (input: RequestInfo | URL, init: RequestInit = {}, timeoutMs = 12_000): Promise<Response> => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort("upstream-timeout"), timeoutMs);
  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
};

const sourceHeaders = (response: Response): Pick<CachedEvent, "upstreamEtag" | "upstreamLastModified"> => ({
  upstreamEtag: response.headers.get("ETag") || undefined,
  upstreamLastModified: response.headers.get("Last-Modified") || undefined,
});

const conditionalHeaders = (cached?: CachedEvent): Headers => {
  const headers = new Headers({ Accept: "application/json,text/plain;q=0.9,*/*;q=0.5" });
  if (cached?.upstreamEtag) headers.set("If-None-Match", cached.upstreamEtag);
  if (cached?.upstreamLastModified) headers.set("If-Modified-Since", cached.upstreamLastModified);
  return headers;
};

const cacheRequest = (key: string): Request => new Request(`https://gaia-live-cache.invalid/${encodeURIComponent(key)}`);
const liveCache = (): Cache => (caches as CacheStorage & { default: Cache }).default;

const readCached = async (key: string): Promise<CachedEvent | undefined> => {
  const response = await liveCache().match(cacheRequest(key));
  if (!response) return undefined;
  try {
    return await response.json<CachedEvent>();
  } catch {
    return undefined;
  }
};

const writeCached = async (key: string, cached: CachedEvent): Promise<void> => {
  const response = new Response(JSON.stringify(cached), {
    headers: { "Cache-Control": "public, max-age=604800", "Content-Type": "application/json" },
  });
  await liveCache().put(cacheRequest(key), response);
};

const eventAge = (event: LiveObservationEvent): number => Date.now() - Date.parse(event.retrievedAt);

const withStaleStatus = (cached: CachedEvent, reason: string): LiveObservationEvent => ({
  ...cached.event,
  status: "stale",
  fallbackReason: reason,
});

const loadCachedProvider = async (definition: ProviderDefinition, ctx: ExecutionContext): Promise<LiveObservationEvent> => {
  const cached = await readCached(definition.cacheKey);
  if (cached && eventAge(cached.event) < definition.ttlMs) return cached.event;
  try {
    const fresh = await definition.load(conditionalHeaders(cached));
    ctx.waitUntil(writeCached(definition.cacheKey, fresh));
    return fresh.event;
  } catch (error) {
    if (cached && error instanceof Error && /(?:304|not-modified)/iu.test(error.message)) {
      const refreshed = { ...cached, event: { ...cached.event, retrievedAt: new Date().toISOString() } };
      ctx.waitUntil(writeCached(definition.cacheKey, refreshed));
      return refreshed.event;
    }
    if (cached) return withStaleStatus(cached, error instanceof Error ? error.message : "upstream-failure");
    throw error;
  }
};

const degrees = (value: number): number => value * Math.PI / 180;
const distanceKm = (lat: number, lon: number): number => {
  const deltaLat = degrees(lat - HAWAII_CENTER.lat);
  const deltaLon = degrees(lon - HAWAII_CENTER.lon);
  const a = Math.sin(deltaLat / 2) ** 2
    + Math.cos(degrees(HAWAII_CENTER.lat)) * Math.cos(degrees(lat)) * Math.sin(deltaLon / 2) ** 2;
  return 6_371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const loadNdbc = async (headers: Headers): Promise<CachedEvent> => {
  const sourceUrl = "https://www.ndbc.noaa.gov/data/latest_obs/latest_obs.txt";
  const response = await fetchWithTimeout(sourceUrl, { headers });
  if (response.status === 304) throw new Error("not-modified-without-refresh");
  if (!response.ok) throw new Error(`NDBC ${response.status}`);
  const candidates = (await response.text()).split(/\r?\n/u).slice(2).map((line) => line.trim().split(/\s+/u)).map((columns) => {
    const lat = Number(columns[1]);
    const lon = Number(columns[2]);
    const wind = Number(columns[9]);
    const temperature = Number(columns[16]);
    const observedAt = `${columns[3]}-${columns[4]}-${columns[5]}T${columns[6]}:${columns[7]}:00Z`;
    return { station: columns[0] || "unknown", lat, lon, wind, temperature, observedAt };
  }).filter((row) => Number.isFinite(row.lat) && Number.isFinite(row.lon) && (Number.isFinite(row.wind) || Number.isFinite(row.temperature)))
    .sort((left, right) => distanceKm(left.lat, left.lon) - distanceKm(right.lat, right.lon));
  const row = candidates[0];
  if (!row) throw new Error("NDBC valid station missing");
  const retrievedAt = new Date().toISOString();
  const status: LiveStatus = Date.now() - Date.parse(row.observedAt) <= 3 * 60 * 60 * 1_000 ? "near-real-time" : "stale";
  return {
    event: {
      schemaVersion: 1,
      eventId: `noaa:ndbc:${row.station}:${row.observedAt}`,
      provider: "noaa",
      datasetId: `NDBC latest observations / ${row.station}`,
      status,
      observedAt: row.observedAt,
      retrievedAt,
      location: { label: `NDBC ${row.station} (${Math.round(distanceKm(row.lat, row.lon))} km from bbox center)`, lat: row.lat, lon: row.lon, bbox: HAWAII_BBOX },
      measurements: [
        { key: "windSpeed", value: Number.isFinite(row.wind) ? row.wind : null, unit: "m/s", quality: Number.isFinite(row.wind) ? "valid" : "missing", sourceKind: "SOURCE" },
        { key: "airTemperature", value: Number.isFinite(row.temperature) ? row.temperature : null, unit: "degree C", quality: Number.isFinite(row.temperature) ? "valid" : "missing", sourceKind: "SOURCE" },
      ],
      provenance: { sourceUrl, licenseUrl: "https://www.noaa.gov/information-technology/open-data-dissemination", transformVersion: TRANSFORM_VERSION },
    },
    ...sourceHeaders(response),
  };
};

const loadCo2 = async (headers: Headers): Promise<CachedEvent> => {
  const sourceUrl = "https://erddap.gml.noaa.gov/erddap/tabledap/greenhouse_gases_co2_insitu_hourly_averages_surface.csv?time,site_code,latitude,longitude,value&site_code=%22MLO%22&orderByMax(%22time%22)";
  headers.set("Accept", "text/csv");
  const response = await fetchWithTimeout(sourceUrl, { headers });
  if (response.status === 304) throw new Error("NOAA GML 304 not-modified");
  if (!response.ok) throw new Error(`NOAA GML ${response.status}`);
  const rows = (await response.text()).trim().split(/\r?\n/u);
  const values = rows.at(-1)?.split(",");
  const observedAt = values?.[0] || "";
  const lat = Number(values?.[2]);
  const lon = Number(values?.[3]);
  const co2 = Number(values?.[4]);
  if (!observedAt || !Number.isFinite(co2)) throw new Error("NOAA GML malformed value");
  return {
    event: {
      schemaVersion: 1,
      eventId: `noaa:gml-mlo-co2:${observedAt}`,
      provider: "noaa",
      datasetId: "NOAA GML Mauna Loa hourly CO2",
      status: "latest-published",
      observedAt,
      retrievedAt: new Date().toISOString(),
      location: { label: "Mauna Loa Observatory", lat, lon, bbox: HAWAII_BBOX },
      measurements: [{ key: "co2", value: co2, unit: "micromol mol-1", quality: "valid", sourceKind: "SOURCE" }],
      provenance: { sourceUrl, licenseUrl: "https://gml.noaa.gov/ccgg/about/co2_measurements.html", transformVersion: TRANSFORM_VERSION },
    },
    ...sourceHeaders(response),
  };
};

interface OpenMeteoCurrent {
  time?: string;
  temperature_2m?: number;
  precipitation?: number;
  cloud_cover?: number;
  wind_speed_10m?: number;
  carbon_dioxide?: number;
  pm2_5?: number;
}

interface OpenMeteoPayload {
  current?: OpenMeteoCurrent;
}

const openMeteoObservedAt = (value?: string): string => {
  if (!value) throw new Error("Open-Meteo current time missing");
  const normalized = /(?:Z|[+-]\d{2}:?\d{2})$/u.test(value) ? value : `${value}Z`;
  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) throw new Error("Open-Meteo current time malformed");
  return date.toISOString();
};

const numericOrNull = (value: unknown): number | null => {
  if (value === null || value === undefined || value === "") return null;
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : null;
};

const loadOpenMeteoWeather = async (headers: Headers): Promise<CachedEvent> => {
  const sourceUrl = new URL("https://api.open-meteo.com/v1/forecast");
  sourceUrl.search = new URLSearchParams({
    latitude: String(TOKYO_CENTER.lat),
    longitude: String(TOKYO_CENTER.lon),
    current: "temperature_2m,precipitation,cloud_cover,wind_speed_10m",
    wind_speed_unit: "ms",
    timezone: "GMT",
    forecast_days: "1",
  }).toString();
  const response = await fetchWithTimeout(sourceUrl, { headers });
  if (response.status === 304) throw new Error("Open-Meteo weather 304 not-modified");
  if (!response.ok) throw new Error(`Open-Meteo weather ${response.status}`);
  const current = (await response.json<OpenMeteoPayload>()).current;
  if (!current) throw new Error("Open-Meteo weather current missing");
  const observedAt = openMeteoObservedAt(current.time);
  const wind = numericOrNull(current.wind_speed_10m);
  const temperature = numericOrNull(current.temperature_2m);
  const precipitation = numericOrNull(current.precipitation);
  const cloudCover = numericOrNull(current.cloud_cover);
  if ([wind, temperature, precipitation, cloudCover].every((value) => value === null)) throw new Error("Open-Meteo weather values missing");
  return {
    event: {
      schemaVersion: 1,
      eventId: `open-meteo:tokyo-weather:${observedAt}`,
      provider: "open-meteo",
      datasetId: "Open-Meteo Best Match / Tokyo current weather",
      status: "near-real-time",
      observedAt,
      retrievedAt: new Date().toISOString(),
      location: { label: "Open-Meteo / 東京", ...TOKYO_CENTER, bbox: TOKYO_BBOX },
      measurements: [
        { key: "weatherWindSpeed", value: wind, unit: "m/s", quality: wind === null ? "missing" : "estimated", sourceKind: "MODEL" },
        { key: "weatherTemperature", value: temperature, unit: "℃", quality: temperature === null ? "missing" : "estimated", sourceKind: "MODEL" },
        { key: "weatherPrecipitation", value: precipitation, unit: "mm", quality: precipitation === null ? "missing" : "estimated", sourceKind: "MODEL" },
        { key: "cloudCover", value: cloudCover, unit: "%", quality: cloudCover === null ? "missing" : "estimated", sourceKind: "MODEL" },
      ],
      provenance: { sourceUrl: sourceUrl.href, licenseUrl: "https://open-meteo.com/en/pricing", transformVersion: TRANSFORM_VERSION },
    },
    ...sourceHeaders(response),
  };
};

const loadOpenMeteoAir = async (headers: Headers): Promise<CachedEvent> => {
  const sourceUrl = new URL("https://air-quality-api.open-meteo.com/v1/air-quality");
  sourceUrl.search = new URLSearchParams({
    latitude: String(TOKYO_CENTER.lat),
    longitude: String(TOKYO_CENTER.lon),
    current: "carbon_dioxide,pm2_5",
    timezone: "GMT",
    forecast_days: "1",
  }).toString();
  const response = await fetchWithTimeout(sourceUrl, { headers });
  if (response.status === 304) throw new Error("Open-Meteo air quality 304 not-modified");
  if (!response.ok) throw new Error(`Open-Meteo air quality ${response.status}`);
  const current = (await response.json<OpenMeteoPayload>()).current;
  if (!current) throw new Error("Open-Meteo air quality current missing");
  const observedAt = openMeteoObservedAt(current.time);
  const co2 = numericOrNull(current.carbon_dioxide);
  const pm25 = numericOrNull(current.pm2_5);
  if (co2 === null && pm25 === null) throw new Error("Open-Meteo air quality values missing");
  return {
    event: {
      schemaVersion: 1,
      eventId: `open-meteo:tokyo-cams:${observedAt}`,
      provider: "open-meteo",
      datasetId: "Open-Meteo / CAMS global atmosphere forecast",
      status: "latest-published",
      observedAt,
      retrievedAt: new Date().toISOString(),
      location: { label: "CAMSモデル / 東京格子", ...TOKYO_CENTER, bbox: TOKYO_BBOX },
      measurements: [
        { key: "forecastCo2", value: co2, unit: "ppm", quality: co2 === null ? "missing" : "estimated", sourceKind: "MODEL" },
        { key: "pm25", value: pm25, unit: "µg/m³", quality: pm25 === null ? "missing" : "estimated", sourceKind: "MODEL" },
      ],
      provenance: { sourceUrl: sourceUrl.href, licenseUrl: "https://open-meteo.com/en/pricing", transformVersion: TRANSFORM_VERSION },
    },
    ...sourceHeaders(response),
  };
};

interface LinkLike { href?: string; rel?: string; title?: string }
interface CatalogLike { links?: LinkLike[] }
const latestLink = (catalog: CatalogLike, pattern: RegExp): string | undefined => catalog.links
  ?.map((link) => link.href || "")
  .filter((href) => pattern.test(href))
  .sort()
  .at(-1);

const loadJaxa = async (headers: Headers): Promise<CachedEvent> => {
  const collectionUrl = "https://s3.ap-northeast-1.wasabisys.com/je-pds/cog/v1/JAXA.EORC_GSMaP_standard.Gauge.00Z-23Z.v6_daily/collection.json";
  const collectionResponse = await fetchWithTimeout(collectionUrl, { headers });
  if (collectionResponse.status === 304) throw new Error("JAXA 304 not-modified");
  if (!collectionResponse.ok) throw new Error(`JAXA collection ${collectionResponse.status}`);
  const collection = await collectionResponse.json<CatalogLike>();
  const monthLink = latestLink(collection, /\/\d{4}-\d{2}\/(?:catalog|collection)\.json$/u);
  if (!monthLink) throw new Error("JAXA latest month missing");
  const monthUrl = new URL(monthLink, collectionUrl).href;
  const monthResponse = await fetchWithTimeout(monthUrl);
  if (!monthResponse.ok) throw new Error(`JAXA month ${monthResponse.status}`);
  const month = await monthResponse.json<CatalogLike>();
  const dayLink = latestLink(month, /\/\d{2}\/(?:catalog|collection)\.json$/u);
  if (!dayLink) throw new Error("JAXA latest day missing");
  const dateMatch = new URL(dayLink, monthUrl).pathname.match(/(\d{4}-\d{2})\/(\d{2})/u);
  if (!dateMatch) throw new Error("JAXA date malformed");
  const itemUrl = new URL(`${dateMatch[1]}/${dateMatch[2]}/0/W180.00-E000.00/S90.00-N90.00.json`, new URL("./", collectionUrl)).href;
  const itemResponse = await fetchWithTimeout(itemUrl);
  if (!itemResponse.ok) throw new Error(`JAXA item ${itemResponse.status}`);
  const item = await itemResponse.json<{ assets?: Record<string, { href?: string }> }>();
  const assetHref = item.assets?.PRECIP?.href;
  if (!assetHref) throw new Error("JAXA PRECIP asset missing");
  const assetUrl = new URL(assetHref, itemUrl).href;
  const tiff = await fromUrl(assetUrl);
  const rasters = await tiff.readRasters({ bbox: [...HAWAII_BBOX] });
  const values = rasters[0] as ArrayLike<number> | undefined;
  if (!values) throw new Error("JAXA raster missing");
  let sum = 0;
  let count = 0;
  for (let index = 0; index < values.length; index += 1) {
    const value = Number(values[index]);
    if (!Number.isFinite(value) || value <= -900) continue;
    sum += value;
    count += 1;
  }
  if (!count) throw new Error("JAXA bbox has no valid pixels");
  const observedAt = `${dateMatch[1]}-${dateMatch[2]}T00:00:00Z`;
  return {
    event: {
      schemaVersion: 1,
      eventId: `jaxa:gsmap-daily:${observedAt}`,
      provider: "jaxa",
      datasetId: "JAXA.EORC_GSMaP_standard.Gauge.00Z-23Z.v6_daily",
      status: Date.now() - Date.parse(observedAt) <= 48 * 60 * 60 * 1_000 ? "near-real-time" : "latest-published",
      observedAt,
      retrievedAt: new Date().toISOString(),
      location: { label: "Hawaii fixed bbox mean", ...HAWAII_CENTER, bbox: HAWAII_BBOX },
      measurements: [{ key: "precipitation", value: sum / count, unit: "mm/hr", quality: "estimated", sourceKind: "SOURCE" }],
      provenance: { sourceUrl: assetUrl, licenseUrl: "https://data.earth.jaxa.jp/en/terms-of-use/", transformVersion: TRANSFORM_VERSION },
    },
    ...sourceHeaders(collectionResponse),
  };
};

const loadEsa = async (env: LiveEnv): Promise<CachedEvent> => {
  if (!env.CDSE_CLIENT_ID || !env.CDSE_CLIENT_SECRET) throw new Error("ESA credentials unavailable");
  const tokenResponse = await fetchWithTimeout("https://identity.dataspace.copernicus.eu/auth/realms/CDSE/protocol/openid-connect/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: env.CDSE_CLIENT_ID,
      client_secret: env.CDSE_CLIENT_SECRET,
    }),
  });
  if (!tokenResponse.ok) throw new Error(`ESA OAuth ${tokenResponse.status}`);
  const token = await tokenResponse.json<{ access_token?: string }>();
  if (!token.access_token) throw new Error("ESA OAuth token missing");
  const to = new Date();
  const from = new Date(to.getTime() - 72 * 60 * 60 * 1_000);
  const sourceUrl = "https://sh.dataspace.copernicus.eu/api/v1/statistics";
  const statisticsResponse = await fetchWithTimeout(sourceUrl, {
    method: "POST",
    headers: { Authorization: `Bearer ${token.access_token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      input: {
        bounds: { bbox: HAWAII_BBOX, properties: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" } },
        data: [{ type: "sentinel-5p-l2", dataFilter: { timeRange: { from: from.toISOString(), to: to.toISOString() }, timeliness: "NRTI" } }],
      },
      aggregation: {
        timeRange: { from: from.toISOString(), to: to.toISOString() },
        aggregationInterval: { of: "P1D" },
        resolution: { x: 0.02, y: 0.02 },
        evalscript: "//VERSION=3\nfunction setup(){return {input:[{bands:[\"NO2\",\"dataMask\"]}],output:[{id:\"data\",bands:1,sampleType:\"FLOAT32\"}]};}\nfunction evaluatePixel(s){return {data:[s.dataMask ? s.NO2 : NaN]};}",
      },
      calculations: { default: {} },
    }),
  }, 20_000);
  if (!statisticsResponse.ok) throw new Error(`ESA statistics ${statisticsResponse.status}`);
  const payload = await statisticsResponse.json<{ data?: Array<{ interval?: { from?: string }; outputs?: { data?: { bands?: { B0?: { stats?: { mean?: number } } } } } }> }>();
  const latest = payload.data?.filter((entry) => Number.isFinite(entry.outputs?.data?.bands?.B0?.stats?.mean)).at(-1);
  const mean = latest?.outputs?.data?.bands?.B0?.stats?.mean;
  const observedAt = latest?.interval?.from;
  if (typeof mean !== "number" || !Number.isFinite(mean) || !observedAt) throw new Error("ESA NO2 valid mean missing");
  return {
    event: {
      schemaVersion: 1,
      eventId: `esa:sentinel-5p-no2:${observedAt}`,
      provider: "esa",
      datasetId: "Sentinel-5P L2 NO2 NRTI",
      status: "near-real-time",
      observedAt,
      retrievedAt: new Date().toISOString(),
      location: { label: "Hawaii fixed bbox quality-masked mean", ...HAWAII_CENTER, bbox: HAWAII_BBOX },
      measurements: [{ key: "no2", value: mean, unit: "mol/m2", quality: "estimated", sourceKind: "SOURCE" }],
      provenance: { sourceUrl, licenseUrl: "https://dataspace.copernicus.eu/terms-and-conditions", transformVersion: TRANSFORM_VERSION },
    },
  };
};

const eventIdentity = (event: LiveObservationEvent): string => {
  if (event.provider === "open-meteo") return `${event.provider}:${event.datasetId.includes("CAMS") ? "air" : "weather"}`;
  return `${event.provider}:${event.datasetId.includes("CO2") ? "co2" : "main"}`;
};

const fallbackSnapshot = async (request: Request, env: LiveEnv, reason: string): Promise<{ schemaVersion: 1; source: "snapshot"; generatedAt?: string; bbox?: readonly number[]; events: LiveObservationEvent[]; fallbackReason: string }> => {
  const fallbackUrl = new URL("/data/live-observation-fallback-v1.json", request.url);
  const response = await env.ASSETS.fetch(new Request(fallbackUrl, { headers: { Accept: "application/json" } }));
  if (!response.ok) throw new Error(`Versioned live snapshot ${response.status}`);
  const payload = await response.json<{ generatedAt?: string; bbox?: readonly number[]; events: LiveObservationEvent[] }>();
  return { schemaVersion: 1, source: "snapshot", generatedAt: payload.generatedAt, bbox: payload.bbox, events: payload.events, fallbackReason: reason };
};

const liveSnapshot = async (request: Request, env: LiveEnv, ctx: ExecutionContext): Promise<{ schemaVersion: 1; source: "live" | "snapshot"; generatedAt?: string; bbox?: readonly number[]; events: LiveObservationEvent[]; errors?: string[]; fallbackReason?: string }> => {
  if (env.LIVE_SENSEWARE_ENABLED !== "true") return fallbackSnapshot(request, env, "LIVE_SENSEWARE_ENABLED is not true");
  const definitions: ProviderDefinition[] = [
    { cacheKey: "noaa-ndbc", ttlMs: 5 * 60 * 1_000, load: loadNdbc },
    { cacheKey: "noaa-co2", ttlMs: 60 * 60 * 1_000, load: loadCo2 },
    { cacheKey: "open-meteo-tokyo-weather-v1", ttlMs: 30 * 60 * 1_000, load: loadOpenMeteoWeather },
    { cacheKey: "open-meteo-tokyo-air-v1", ttlMs: 3 * 60 * 60 * 1_000, load: loadOpenMeteoAir },
  ];
  if (env.LIVE_SENSEWARE_JAXA_ENABLED === "true") {
    definitions.push({ cacheKey: "jaxa-gsmap", ttlMs: 6 * 60 * 60 * 1_000, load: loadJaxa });
  }
  if (env.LIVE_SENSEWARE_ESA_ENABLED === "true" && env.CDSE_CLIENT_ID && env.CDSE_CLIENT_SECRET) {
    definitions.push({ cacheKey: "esa-no2", ttlMs: 30 * 60 * 1_000, load: () => loadEsa(env) });
  }
  const settled = await Promise.allSettled(definitions.map((definition) => loadCachedProvider(definition, ctx)));
  const events = settled.flatMap((result) => result.status === "fulfilled" ? [result.value] : []);
  const errors = settled.flatMap((result) => result.status === "rejected" ? [result.reason instanceof Error ? result.reason.message : "provider failure"] : []);
  if (!events.length) return fallbackSnapshot(request, env, errors.join("; "));
  const fallback = await fallbackSnapshot(request, env, "Some providers use saved snapshots");
  const available = new Set(events.map(eventIdentity));
  const disabledReasons = new Map<string, string>([
    ["jaxa:main", env.LIVE_SENSEWARE_JAXA_ENABLED === "true" ? "JAXA upstream unavailable" : "JAXA live disabled for free-plan CPU safety"],
    ["esa:main", env.LIVE_SENSEWARE_ESA_ENABLED !== "true" ? "ESA live disabled" : !env.CDSE_CLIENT_ID || !env.CDSE_CLIENT_SECRET ? "ESA credentials unavailable" : "ESA upstream unavailable"],
    ["open-meteo:weather", "Open-Meteo weather upstream unavailable"],
    ["open-meteo:air", "Open-Meteo CAMS upstream unavailable"],
  ]);
  for (const event of fallback.events) {
    const identity = eventIdentity(event);
    if (!available.has(identity)) {
      events.push({ ...event, fallbackReason: disabledReasons.get(identity) || errors.join("; ") || "provider snapshot fallback" });
    }
  }
  return { schemaVersion: 1, source: "live", generatedAt: new Date().toISOString(), bbox: HAWAII_BBOX, events, errors: errors.length ? errors : undefined };
};

const sseLine = (event: string, data: unknown, id?: string): string => `${id ? `id: ${id}\n` : ""}event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;

const streamResponse = (request: Request, env: LiveEnv, ctx: ExecutionContext): Response => {
  const encoder = new TextEncoder();
  let heartbeat = 0;
  let refresh = 0;
  let lifetime = 0;
  let closed = false;
  let refreshInFlight = false;
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      const close = () => {
        if (closed) return;
        closed = true;
        clearInterval(heartbeat);
        clearInterval(refresh);
        clearTimeout(lifetime);
        try { controller.close(); } catch {}
      };
      const emitSnapshot = async () => {
        if (closed || refreshInFlight) return;
        refreshInFlight = true;
        try {
          const snapshot = await liveSnapshot(request, env, ctx);
          if (closed) return;
          const lastEventId = request.headers.get("Last-Event-ID") || new URL(request.url).searchParams.get("lastEventId") || "";
          const snapshotId = `snapshot:${snapshot.generatedAt || new Date().toISOString()}`;
          controller.enqueue(encoder.encode(sseLine("snapshot", { ...snapshot, resumedAfter: lastEventId || undefined }, snapshotId)));
          for (const event of snapshot.events) controller.enqueue(encoder.encode(sseLine("provider", event, event.eventId)));
          controller.enqueue(encoder.encode(sseLine("status", { state: "streaming", source: snapshot.source, refreshSeconds: STREAM_REFRESH_MS / 1_000 }, `status:${Date.now()}`)));
        } catch (error) {
          if (!closed) controller.error(error);
          close();
        } finally {
          refreshInFlight = false;
        }
      };
      request.signal.addEventListener("abort", close, { once: true });
      heartbeat = setInterval(() => {
        if (!closed) controller.enqueue(encoder.encode(`: heartbeat ${new Date().toISOString()}\n\n`));
      }, HEARTBEAT_MS) as unknown as number;
      refresh = setInterval(() => void emitSnapshot(), STREAM_REFRESH_MS) as unknown as number;
      lifetime = setTimeout(() => {
        controller.enqueue(encoder.encode(sseLine("status", { state: "complete", reconnect: true })));
        close();
      }, STREAM_LIFETIME_MS) as unknown as number;
      void emitSnapshot();
    },
    cancel() {
      closed = true;
      clearInterval(heartbeat);
      clearInterval(refresh);
      clearTimeout(lifetime);
    },
  });
  return new Response(stream, {
    headers: {
      "Cache-Control": "no-store, no-transform",
      Connection: "keep-alive",
      "Content-Type": "text/event-stream; charset=utf-8",
      "X-Accel-Buffering": "no",
      "X-Content-Type-Options": "nosniff",
    },
  });
};

export const handleLiveSenseware = async (request: Request, env: LiveEnv, ctx: ExecutionContext): Promise<Response | null> => {
  const url = new URL(request.url);
  if (url.pathname !== "/api/live/v1/snapshot" && url.pathname !== "/api/live/v1/stream") return null;
  if (request.method !== "GET" && request.method !== "HEAD") return new Response("Method Not Allowed", { status: 405, headers: { Allow: "GET, HEAD" } });
  if (url.pathname.endsWith("/stream")) return request.method === "HEAD" ? new Response(null, { headers: { "Content-Type": "text/event-stream; charset=utf-8" } }) : streamResponse(request, env, ctx);
  const snapshot = await liveSnapshot(request, env, ctx);
  const body = request.method === "HEAD" ? null : JSON.stringify(snapshot);
  return new Response(body, { headers: jsonHeaders });
};
