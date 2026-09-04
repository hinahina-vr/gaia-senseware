const ATMOSPHERE_POINTS = Object.freeze([
  ["逗子", 35.295, 139.578],
  ["レイキャヴィーク", 64.147, -21.94],
  ["ニューヨーク", 40.713, -74.006],
  ["リマ", -12.046, -77.043],
  ["サンパウロ", -23.55, -46.633],
  ["ケープタウン", -33.925, 18.424],
  ["ナイロビ", -1.286, 36.818],
  ["シンガポール", 1.352, 103.82],
  ["シドニー", -33.868, 151.209],
  ["ホノルル", 21.307, -157.858],
].map(([label, lat, lon]) => Object.freeze({ label, lat, lon })));

const MARINE_POINTS = Object.freeze([
  ["相模湾", 35.2, 139.45],
  ["北太平洋", 40, -160],
  ["南太平洋", -30, -120],
  ["北大西洋", 45, -30],
  ["南大西洋", -35, -20],
  ["インド洋", -20, 80],
  ["珊瑚海", -20, 155],
  ["北海", 56, 3],
].map(([label, lat, lon]) => Object.freeze({ label, lat, lon })));

const DEFINITIONS = Object.freeze([
  Object.freeze({
    id: "global-wind-pressure",
    number: "27",
    shortTitle: "大気をなぞる",
    title: "大気をなぞる — WIND / PRESSURE",
    signalLabel: "風速・風向・気圧",
    accent: "#63f3ff",
    rgb: "99, 243, 255",
    caption: "世界10地点の風速・風向・気圧を、地表を走る細い光跡へ変換します。",
    sourceName: "Open-Meteo Forecast API / DWD・ECMWFほか",
    sourcePage: "https://open-meteo.com/en/docs",
    sourceLabel: "Open-Meteoの仕様を見る",
    primaryLabel: "平均風速",
    visualLabel: "FLOW TRAILS / DIRECTION + SPEED",
    loader: "atmosphere",
    renderer: "wind",
  }),
  Object.freeze({
    id: "global-ocean-pulse",
    number: "28",
    shortTitle: "海の脈動",
    title: "海の脈動 — WAVE FIELD",
    signalLabel: "波高・周期・波向",
    accent: "#65a9ff",
    rgb: "101, 169, 255",
    caption: "8つの海域の波高と周期を、互いに重なる波紋として描きます。",
    sourceName: "Open-Meteo Marine API / DWDほか",
    sourcePage: "https://open-meteo.com/en/docs/marine-weather-api",
    sourceLabel: "Marine APIの仕様を見る",
    primaryLabel: "平均波高",
    visualLabel: "INTERFERENCE RINGS / HEIGHT + PERIOD",
    loader: "marine",
    renderer: "ocean",
  }),
  Object.freeze({
    id: "global-aerosol-light",
    number: "29",
    shortTitle: "大気の散乱",
    title: "大気の散乱 — AEROSOL LIGHT",
    signalLabel: "PM2.5・光学的厚さ",
    accent: "#f3a3ff",
    rgb: "243, 163, 255",
    caption: "大気中の微粒子と光学的厚さを、にじむ光環と浮遊粒子へ変換します。",
    sourceName: "Open-Meteo Air Quality API / CAMS",
    sourcePage: "https://open-meteo.com/en/docs/air-quality-api",
    sourceLabel: "Air Quality APIの仕様を見る",
    primaryLabel: "平均 PM2.5",
    visualLabel: "AURA SCATTER / PM2.5 + AOD",
    loader: "air",
    renderer: "air",
  }),
  Object.freeze({
    id: "usgs-earthquake-ripples",
    number: "30",
    shortTitle: "地殻の波紋",
    title: "地殻の波紋 — EARTHQUAKES",
    signalLabel: "M2.5以上・直近24時間",
    accent: "#ffbd68",
    rgb: "255, 189, 104",
    caption: "USGSが公開する直近24時間の地震を、発生時刻と規模に応じた波紋で示します。",
    sourceName: "USGS Earthquake Hazards Program",
    sourcePage: "https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php",
    sourceLabel: "USGS GeoJSON Feedを見る",
    primaryLabel: "最大マグニチュード",
    visualLabel: "EPICENTER RIPPLES / TIME + MAGNITUDE",
    loader: "earthquake",
    renderer: "quake",
  }),
  Object.freeze({
    id: "noaa-solar-wind",
    number: "31",
    shortTitle: "太陽風の到着",
    title: "太陽風の到着 — SPACE WEATHER",
    signalLabel: "太陽風速度・惑星間磁場",
    accent: "#9bffca",
    rgb: "155, 255, 202",
    caption: "地球へ届く太陽風と磁場の値を、極域を横切る流光と粒子の速度へ変換します。",
    sourceName: "NOAA Space Weather Prediction Center",
    sourcePage: "https://www.swpc.noaa.gov/products/real-time-solar-wind",
    sourceLabel: "NOAAの観測ページを見る",
    primaryLabel: "太陽風速度",
    visualLabel: "POLAR STREAM / SPEED + BZ",
    loader: "solar",
    renderer: "solar",
  }),
]);

const OPEN_METEO_WEATHER = "https://api.open-meteo.com/v1/forecast";
const OPEN_METEO_MARINE = "https://marine-api.open-meteo.com/v1/marine";
const OPEN_METEO_AIR = "https://air-quality-api.open-meteo.com/v1/air-quality";
const USGS_DAY = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson";
const NOAA_SPEED = "https://services.swpc.noaa.gov/products/summary/solar-wind-speed.json";
const NOAA_FIELD = "https://services.swpc.noaa.gov/products/summary/solar-wind-mag-field.json";
const CACHE_PREFIX = "gaia-planet-signals-v1:";
const CACHE_TTL_MS = 5 * 60 * 1000;
const FRAME_INTERVAL_MS = 1000 / 30;
const MAX_CANVAS_PIXELS = 1_500_000;
const EARTH_INITIAL_CENTER_LONGITUDE = 138;
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

const FALLBACKS = Object.freeze({
  atmosphere: Object.freeze({
    observedAt: "2026-09-03T09:00:00Z",
    points: ATMOSPHERE_POINTS.map((point, index) => ({
      ...point,
      windSpeed: [3.4, 6.8, 4.7, 5.2, 3.1, 7.4, 4.2, 2.8, 8.1, 6.2][index],
      windDirection: [182, 236, 274, 191, 118, 305, 146, 211, 259, 71][index],
      pressure: [1008, 1002, 1014, 1011, 1016, 1005, 1010, 1009, 1001, 1013][index],
      cloud: [58, 79, 42, 51, 30, 72, 63, 81, 69, 37][index],
      radiation: [410, 130, 520, 610, 280, 350, 560, 470, 220, 680][index],
    })),
  }),
  marine: Object.freeze({
    observedAt: "2026-09-03T09:00:00Z",
    points: MARINE_POINTS.map((point, index) => ({
      ...point,
      waveHeight: [0.8, 2.7, 2.1, 3.3, 2.5, 1.9, 2.2, 1.6][index],
      wavePeriod: [6.2, 10.8, 12.1, 9.5, 11.4, 8.9, 9.8, 7.1][index],
      waveDirection: [151, 96, 231, 282, 203, 248, 111, 317][index],
    })),
  }),
  air: Object.freeze({
    observedAt: "2026-09-03T09:00:00Z",
    points: ATMOSPHERE_POINTS.map((point, index) => ({
      ...point,
      pm25: [10.2, 4.1, 8.9, 17.3, 12.8, 7.4, 15.1, 13.8, 5.6, 9.3][index],
      aerosol: [0.14, 0.06, 0.12, 0.22, 0.18, 0.1, 0.2, 0.17, 0.08, 0.13][index],
    })),
  }),
  earthquake: Object.freeze({
    observedAt: "2026-09-03T09:00:00Z",
    points: [
      [143.2, 39.1, 4.7, 28, "三陸沖"], [-176.4, -22.1, 5.3, 71, "トンガ南方"],
      [-71.7, -30.2, 4.4, 42, "チリ中部"], [126.9, 1.6, 4.9, 54, "モルッカ海"],
      [-149.8, 61.3, 3.1, 36, "アラスカ南部"], [96.1, 3.2, 4.6, 67, "スマトラ北部"],
    ].map(([lon, lat, magnitude, depth, label], index) => ({
      id: `fallback-${index}`,
      lon,
      lat,
      magnitude,
      depth,
      label,
      time: Date.parse("2026-09-03T09:00:00Z") - index * 73 * 60 * 1000,
    })),
  }),
  solar: Object.freeze({
    observedAt: "2026-09-03T09:00:00Z",
    points: [],
    speed: 394,
    bt: 6,
    bz: 2,
  }),
});

let layer;
let map;
let canvas;
let context;
let readout;
let legend;
let buttons = [];
let activeIndex = -1;
let currentData = null;
let frame = 0;
let lastRenderedAt = 0;
let savedHeading = null;
let particles = [];

const clamp = (value, min, max) => Math.max(min, Math.min(max, Number(value) || 0));
const clamp01 = (value) => clamp(value, 0, 1);
const average = (values) => values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
const wrapLongitude = (longitude) => ((longitude + 540) % 360) - 180;
const mapLongitude = (longitude) => wrapLongitude(longitude - EARTH_INITIAL_CENTER_LONGITUDE) + 180;
const fract = (value) => value - Math.floor(value);
const hash = (value) => fract(Math.sin(value * 12.9898 + 78.233) * 43758.5453);
const asFinite = (value, fallback = 0) => Number.isFinite(Number(value)) ? Number(value) : fallback;
const formatNumber = (value, decimals = 1) => Number(value).toLocaleString("ja-JP", {
  minimumFractionDigits: decimals,
  maximumFractionDigits: decimals,
});
const formatUtc = (value) => {
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return "時刻不明";
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "UTC",
  }).format(date) + " UTC";
};

const formatAge = (value) => {
  const timestamp = Date.parse(value);
  if (!Number.isFinite(timestamp)) return "更新間隔不明";
  const minutes = Math.max(0, Math.floor((Date.now() - timestamp) / 60_000));
  if (minutes < 2) return "データ時点から1分以内";
  if (minutes < 60) return `データ時点から${minutes}分`;
  const hours = Math.floor(minutes / 60);
  if (hours < 48) return `データ時点から${hours}時間`;
  return `データ時点から${Math.floor(hours / 24)}日`;
};

const coordinateParams = (points) => ({
  latitude: points.map(({ lat }) => lat).join(","),
  longitude: points.map(({ lon }) => lon).join(","),
});

const apiUrl = (base, params) => {
  const url = new URL(base);
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));
  return url.href;
};

const fetchJson = async (url, timeoutMs = 9000) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`${new URL(url).hostname} ${response.status}`);
    return await response.json();
  } finally {
    clearTimeout(timeout);
  }
};

const normalizeMulti = (payload) => Array.isArray(payload) ? payload : [payload];

const loadAtmosphere = async () => {
  const url = apiUrl(OPEN_METEO_WEATHER, {
    ...coordinateParams(ATMOSPHERE_POINTS),
    current: "wind_speed_10m,wind_direction_10m,surface_pressure,cloud_cover,shortwave_radiation",
    wind_speed_unit: "ms",
    timezone: "GMT",
  });
  const rows = normalizeMulti(await fetchJson(url));
  const points = ATMOSPHERE_POINTS.map((point, index) => {
    const current = rows[index]?.current || {};
    return {
      ...point,
      windSpeed: asFinite(current.wind_speed_10m),
      windDirection: asFinite(current.wind_direction_10m),
      pressure: asFinite(current.surface_pressure),
      cloud: asFinite(current.cloud_cover),
      radiation: asFinite(current.shortwave_radiation),
    };
  });
  if (!points.some(({ windSpeed }) => windSpeed > 0)) throw new Error("Open-Meteo wind values are unavailable");
  return { observedAt: rows.find(({ current }) => current?.time)?.current.time + "Z", points };
};

const loadMarine = async () => {
  const url = apiUrl(OPEN_METEO_MARINE, {
    ...coordinateParams(MARINE_POINTS),
    current: "wave_height,wave_period,wave_direction",
    timezone: "GMT",
    cell_selection: "sea",
  });
  const rows = normalizeMulti(await fetchJson(url));
  const points = MARINE_POINTS.map((point, index) => {
    const current = rows[index]?.current || {};
    return {
      ...point,
      waveHeight: asFinite(current.wave_height),
      wavePeriod: asFinite(current.wave_period),
      waveDirection: asFinite(current.wave_direction),
    };
  });
  if (!points.some(({ waveHeight }) => waveHeight > 0)) throw new Error("Open-Meteo marine values are unavailable");
  return { observedAt: rows.find(({ current }) => current?.time)?.current.time + "Z", points };
};

const loadAir = async () => {
  const url = apiUrl(OPEN_METEO_AIR, {
    ...coordinateParams(ATMOSPHERE_POINTS),
    current: "pm2_5,aerosol_optical_depth",
    timezone: "GMT",
  });
  const rows = normalizeMulti(await fetchJson(url));
  const points = ATMOSPHERE_POINTS.map((point, index) => {
    const current = rows[index]?.current || {};
    return {
      ...point,
      pm25: asFinite(current.pm2_5),
      aerosol: asFinite(current.aerosol_optical_depth),
    };
  });
  if (!points.some(({ pm25 }) => pm25 > 0)) throw new Error("Open-Meteo air-quality values are unavailable");
  return { observedAt: rows.find(({ current }) => current?.time)?.current.time + "Z", points };
};

const loadEarthquake = async () => {
  const payload = await fetchJson(USGS_DAY);
  const points = (payload.features || []).map((feature) => ({
    id: String(feature.id || ""),
    lon: asFinite(feature.geometry?.coordinates?.[0]),
    lat: asFinite(feature.geometry?.coordinates?.[1]),
    depth: Math.max(0, asFinite(feature.geometry?.coordinates?.[2])),
    magnitude: Math.max(0, asFinite(feature.properties?.mag)),
    label: String(feature.properties?.place || "震源地不明"),
    time: asFinite(feature.properties?.time),
  })).filter(({ id, lon, lat, time }) => id && lon >= -180 && lon <= 180 && lat >= -90 && lat <= 90 && time > 0)
    .sort((left, right) => left.time - right.time)
    .slice(-240);
  if (!points.length) throw new Error("USGS earthquake feed contains no events");
  return { observedAt: new Date(asFinite(payload.metadata?.generated, Date.now())).toISOString(), points };
};

const loadSolar = async () => {
  const [speedPayload, fieldPayload] = await Promise.all([fetchJson(NOAA_SPEED), fetchJson(NOAA_FIELD)]);
  const speedRow = speedPayload?.[0] || {};
  const fieldRow = fieldPayload?.[0] || {};
  const speed = asFinite(speedRow.proton_speed);
  const bt = asFinite(fieldRow.bt);
  const bz = asFinite(fieldRow.bz_gsm);
  if (!(speed > 0)) throw new Error("NOAA solar-wind speed is unavailable");
  return {
    observedAt: fieldRow.time_tag || speedRow.time_tag || new Date().toISOString(),
    points: [],
    speed,
    bt,
    bz,
  };
};

const LOADERS = Object.freeze({
  atmosphere: loadAtmosphere,
  marine: loadMarine,
  air: loadAir,
  earthquake: loadEarthquake,
  solar: loadSolar,
});

const readCache = (key) => {
  try {
    const cached = JSON.parse(sessionStorage.getItem(`${CACHE_PREFIX}${key}`) || "null");
    if (cached && Date.now() - cached.cachedAt < CACHE_TTL_MS) return cached.data;
  } catch {}
  return null;
};

const writeCache = (key, data) => {
  try {
    sessionStorage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify({ cachedAt: Date.now(), data }));
  } catch {}
};

const loadData = async (definition) => {
  const cached = readCache(definition.loader);
  if (cached) return { ...cached, sourceState: "LIVE CACHE" };
  try {
    const data = await LOADERS[definition.loader]();
    writeCache(definition.loader, data);
    return { ...data, sourceState: "LIVE" };
  } catch (error) {
    console.warn(`${definition.sourceName} unavailable; using the saved exhibit values.`, error);
    return { ...FALLBACKS[definition.loader], sourceState: "SAVED VALUES" };
  }
};

const summarize = (definition, data) => {
  if (definition.loader === "atmosphere") {
    return {
      primary: formatNumber(average(data.points.map(({ windSpeed }) => windSpeed))),
      unit: "m/s",
      secondary: [
        ["平均気圧", `${formatNumber(average(data.points.map(({ pressure }) => pressure)), 0)} hPa`],
        ["平均雲量", `${formatNumber(average(data.points.map(({ cloud }) => cloud)), 0)}%`],
      ],
      count: `${data.points.length}地点`,
    };
  }
  if (definition.loader === "marine") {
    return {
      primary: formatNumber(average(data.points.map(({ waveHeight }) => waveHeight))),
      unit: "m",
      secondary: [
        ["平均周期", `${formatNumber(average(data.points.map(({ wavePeriod }) => wavePeriod)))} sec`],
        ["最大波高", `${formatNumber(Math.max(...data.points.map(({ waveHeight }) => waveHeight)))} m`],
      ],
      count: `${data.points.length}海域`,
    };
  }
  if (definition.loader === "air") {
    return {
      primary: formatNumber(average(data.points.map(({ pm25 }) => pm25))),
      unit: "µg/m³",
      secondary: [
        ["平均AOD", formatNumber(average(data.points.map(({ aerosol }) => aerosol)), 2)],
        ["最大PM2.5", `${formatNumber(Math.max(...data.points.map(({ pm25 }) => pm25)))} µg/m³`],
      ],
      count: `${data.points.length}地点`,
    };
  }
  if (definition.loader === "earthquake") {
    const strongest = data.points.reduce((best, point) => point.magnitude > best.magnitude ? point : best, data.points[0]);
    return {
      primary: formatNumber(strongest.magnitude),
      unit: "M",
      secondary: [
        ["検知数", `${data.points.length}回`],
        ["最大震源", strongest.label],
      ],
      count: `${data.points.length}地震`,
    };
  }
  return {
    primary: formatNumber(data.speed, 0),
    unit: "km/s",
    secondary: [
      ["磁場強度 Bt", `${formatNumber(data.bt)} nT`],
      ["磁場南北 Bz", `${formatNumber(data.bz)} nT`],
    ],
    count: "L1観測",
  };
};

const projection = () => {
  const rect = map?.getBoundingClientRect();
  const overlay = document.querySelector("#japan-overlay");
  if (!rect?.width || !rect?.height || !(overlay instanceof HTMLElement)) return null;
  const zoom = Math.max(1, Number(overlay.dataset.earthZoom) || 1);
  const scale = Math.max(rect.width / 360, rect.height / 180) * zoom;
  return {
    rect,
    scale,
    originX: (rect.width - 360 * scale) / 2 + (Number(overlay.dataset.earthOffsetX) || 0),
    originY: (rect.height - 180 * scale) / 2 + (Number(overlay.dataset.earthOffsetY) || 0),
  };
};

const screenPoint = (point, view) => ({
  x: view.originX + mapLongitude(point.lon) * view.scale,
  y: view.originY + (90 - point.lat) * view.scale,
});

const resizeCanvas = (rect) => {
  const density = Math.min(devicePixelRatio || 1, 1.4);
  const targetWidth = rect.width * density;
  const targetHeight = rect.height * density;
  const budgetScale = Math.min(1, Math.sqrt(MAX_CANVAS_PIXELS / Math.max(1, targetWidth * targetHeight)));
  const ratio = density * budgetScale;
  const width = Math.max(1, Math.round(rect.width * ratio));
  const height = Math.max(1, Math.round(rect.height * ratio));
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }
  canvas.dataset.planetResolutionScale = ratio.toFixed(3);
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
};

const rebuildParticles = (definition) => {
  const count = reducedMotion ? 80 : innerWidth <= 720 ? 180 : 360;
  particles = Array.from({ length: count }, (_, index) => ({
    seed: hash(index + Number(definition.number) * 19.7),
    seedB: hash(index * 2.31 + Number(definition.number) * 31.1),
    seedC: hash(index * 4.71 + Number(definition.number) * 7.3),
  }));
  canvas.dataset.planetParticleCount = String(particles.length);
};

const drawWind = (time, view, data, definition) => {
  data.points.forEach((point, index) => {
    const center = screenPoint(point, view);
    const radians = (point.windDirection + 180) * Math.PI / 180;
    const dx = Math.sin(radians);
    const dy = -Math.cos(radians);
    const speed = clamp(point.windSpeed, 0.4, 18);
    const reach = 28 + speed * 6.5;
    const color = point.pressure < 1008 ? "151, 132, 255" : definition.rgb;
    for (let lane = 0; lane < 13; lane += 1) {
      const seed = hash(index * 43 + lane * 11);
      const phase = fract(time * (0.035 + speed * 0.005) + seed);
      const offset = (lane - 6) * 2.7;
      const normalX = -dy * offset;
      const normalY = dx * offset;
      const x = center.x + dx * (phase - 0.5) * reach + normalX;
      const y = center.y + dy * (phase - 0.5) * reach + normalY;
      const length = 8 + speed * 1.9;
      context.beginPath();
      context.moveTo(x - dx * length, y - dy * length);
      context.lineTo(x, y);
      context.strokeStyle = `rgba(${color}, ${0.08 + (1 - phase) * 0.34})`;
      context.lineWidth = 0.55 + clamp01(speed / 15) * 1.35;
      context.stroke();
    }
  });
};

const drawOcean = (time, view, data, definition) => {
  data.points.forEach((point, index) => {
    const center = screenPoint(point, view);
    const height = clamp(point.waveHeight, 0.1, 8);
    const period = clamp(point.wavePeriod, 3, 18);
    for (let ring = 0; ring < 4; ring += 1) {
      const phase = fract(time / period + ring / 4 + hash(index * 17) * 0.2);
      const radius = (5 + phase * (30 + height * 15)) * Math.min(1.45, view.scale / 4);
      context.beginPath();
      context.arc(center.x, center.y, radius, 0, Math.PI * 2);
      context.strokeStyle = `rgba(${definition.rgb}, ${(1 - phase) * (0.12 + height * 0.055)})`;
      context.lineWidth = 0.6 + height * 0.35;
      context.stroke();
    }
    context.beginPath();
    context.arc(center.x, center.y, 2.2 + height, 0, Math.PI * 2);
    context.fillStyle = `rgba(215, 245, 255, ${0.28 + height * 0.06})`;
    context.fill();
  });
};

const drawAir = (time, view, data, definition) => {
  data.points.forEach((point, index) => {
    const center = screenPoint(point, view);
    const density = clamp01(point.pm25 / 45);
    const haze = clamp01(point.aerosol / 0.6);
    const radius = 20 + density * 42 + haze * 30;
    const gradient = context.createRadialGradient(center.x, center.y, 0, center.x, center.y, radius);
    gradient.addColorStop(0, `rgba(255, 224, 191, ${0.08 + haze * 0.14})`);
    gradient.addColorStop(0.38, `rgba(${definition.rgb}, ${0.07 + density * 0.12})`);
    gradient.addColorStop(1, `rgba(${definition.rgb}, 0)`);
    context.fillStyle = gradient;
    context.fillRect(center.x - radius, center.y - radius, radius * 2, radius * 2);
    for (let dust = 0; dust < 12; dust += 1) {
      const seed = hash(index * 101 + dust * 7);
      const angle = seed * Math.PI * 2 + time * (0.05 + haze * 0.08);
      const distance = (8 + hash(index * 53 + dust * 13) * radius) * (0.65 + 0.35 * Math.sin(time * 0.3 + seed * 8));
      context.beginPath();
      context.arc(center.x + Math.cos(angle) * distance, center.y + Math.sin(angle) * distance * 0.55, 0.5 + density * 1.5, 0, Math.PI * 2);
      context.fillStyle = `rgba(255, 220, 247, ${0.08 + density * 0.34})`;
      context.fill();
    }
  });
};

const drawQuakes = (time, view, data, definition) => {
  const now = Date.now();
  data.points.forEach((point, index) => {
    const center = screenPoint(point, view);
    const magnitude = clamp(point.magnitude, 2.5, 8);
    const age = clamp01((now - point.time) / 86_400_000);
    for (let ring = 0; ring < 3; ring += 1) {
      const phase = reducedMotion ? 0.72 : fract(time * (0.06 + magnitude * 0.01) + ring / 3 + hash(index * 23));
      const radius = (3 + phase * (13 + magnitude * 7)) * Math.min(1.35, view.scale / 4);
      context.beginPath();
      context.arc(center.x, center.y, radius, 0, Math.PI * 2);
      context.strokeStyle = `rgba(${definition.rgb}, ${(1 - phase) * (0.1 + magnitude * 0.06) * (1 - age * 0.45)})`;
      context.lineWidth = 0.55 + magnitude * 0.13;
      context.stroke();
    }
    context.beginPath();
    context.arc(center.x, center.y, 1.2 + magnitude * 0.45, 0, Math.PI * 2);
    context.fillStyle = `rgba(255, 241, 202, ${0.38 + magnitude * 0.055})`;
    context.fill();
  });
};

const drawSolar = (time, view, data, definition) => {
  const energy = clamp01((data.speed - 280) / 520);
  const southward = clamp01((-data.bz + 1) / 14);
  [67, -67].forEach((latitude, bandIndex) => {
    const y = screenPoint({ lon: 0, lat: latitude }, view).y;
    context.beginPath();
    for (let step = 0; step <= 80; step += 1) {
      const x = view.rect.width * step / 80;
      const wave = Math.sin(step * 0.28 + time * (0.35 + energy * 0.5) + bandIndex * 2.3) * (4 + southward * 12);
      if (step === 0) context.moveTo(x, y + wave);
      else context.lineTo(x, y + wave);
    }
    context.strokeStyle = `rgba(${bandIndex ? "112, 190, 255" : definition.rgb}, ${0.2 + energy * 0.32 + southward * 0.2})`;
    context.lineWidth = 1.2 + energy * 3;
    context.shadowBlur = 13 + energy * 22;
    context.shadowColor = definition.accent;
    context.stroke();
    context.shadowBlur = 0;
  });
  particles.forEach((particle, index) => {
    const phase = reducedMotion ? particle.seed : fract(time * (0.055 + energy * 0.11) + particle.seed);
    const x = view.rect.width * (1 - phase);
    const y = view.rect.height * (0.08 + particle.seedB * 0.84) + Math.sin(time + index) * 4;
    const length = 18 + energy * 58 + particle.seedC * 20;
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(x + length, y + (particle.seedB - 0.5) * 8);
    context.strokeStyle = `rgba(${definition.rgb}, ${0.05 + particle.seedC * 0.22 + energy * 0.18})`;
    context.lineWidth = 0.45 + particle.seedC * 1.2;
    context.stroke();
  });
};

const RENDERERS = Object.freeze({ wind: drawWind, ocean: drawOcean, air: drawAir, quake: drawQuakes, solar: drawSolar });

const draw = (timestamp = performance.now()) => {
  if (activeIndex < 0 || document.hidden || !currentData || !context) {
    frame = 0;
    return;
  }
  if (timestamp - lastRenderedAt < FRAME_INTERVAL_MS) {
    frame = requestAnimationFrame(draw);
    return;
  }
  lastRenderedAt = timestamp;
  const view = projection();
  if (!view) {
    frame = requestAnimationFrame(draw);
    return;
  }
  resizeCanvas(view.rect);
  context.clearRect(0, 0, view.rect.width, view.rect.height);
  context.globalCompositeOperation = "lighter";
  const definition = DEFINITIONS[activeIndex];
  RENDERERS[definition.renderer](timestamp / 1000, view, currentData, definition);
  context.globalCompositeOperation = "source-over";
  canvas.dataset.planetFrame = String((Number(canvas.dataset.planetFrame) || 0) + 1);
  frame = requestAnimationFrame(draw);
};

const applyHeading = (definition) => {
  const number = document.querySelector("#japan-mode-number");
  const bankTitle = document.querySelector("#japan-mode-title");
  const mapTitle = document.querySelector("#japan-title");
  if (number) number.textContent = definition.number;
  if (bankTitle) bankTitle.textContent = definition.shortTitle;
  if (mapTitle) {
    mapTitle.dataset.exhibitNumber = definition.number;
    mapTitle.textContent = definition.shortTitle;
    mapTitle.setAttribute("aria-label", `${definition.number} ${definition.shortTitle}`);
  }
};

const renderReadout = (definition, data) => {
  const summary = summarize(definition, data);
  readout.style.setProperty("--planet-accent", definition.accent);
  readout.style.setProperty("--planet-rgb", definition.rgb);
  legend.style.setProperty("--planet-accent", definition.accent);
  legend.style.setProperty("--planet-rgb", definition.rgb);
  readout.querySelector("[data-planet-kicker]").textContent = `${definition.number} / ${definition.signalLabel}`;
  readout.querySelector("[data-planet-title]").textContent = definition.shortTitle;
  readout.querySelector("[data-planet-primary-label]").textContent = definition.primaryLabel;
  readout.querySelector("[data-planet-primary]").textContent = summary.primary;
  readout.querySelector("[data-planet-unit]").textContent = summary.unit;
  readout.querySelector("[data-planet-secondary-a-label]").textContent = summary.secondary[0][0];
  readout.querySelector("[data-planet-secondary-a]").textContent = summary.secondary[0][1];
  readout.querySelector("[data-planet-secondary-b-label]").textContent = summary.secondary[1][0];
  readout.querySelector("[data-planet-secondary-b]").textContent = summary.secondary[1][1];
  readout.querySelector("[data-planet-caption]").textContent = definition.caption;
  readout.querySelector("[data-planet-state]").textContent = data.sourceState;
  readout.querySelector("[data-planet-time]").textContent = formatUtc(data.observedAt);
  readout.querySelector("[data-planet-source]").textContent = definition.sourceName;
  const source = readout.querySelector("[data-planet-source-link]");
  source.href = definition.sourcePage;
  source.querySelector("strong").textContent = definition.sourceLabel;
  legend.querySelector("[data-planet-legend-title]").textContent = definition.visualLabel;
  legend.querySelector("[data-planet-legend-count]").textContent = summary.count;
  legend.querySelector("[data-planet-legend-state]").textContent = data.sourceState;
  legend.querySelector("[data-planet-data-time]").textContent = formatUtc(data.observedAt);
  legend.querySelector("[data-planet-data-age]").textContent = formatAge(data.observedAt);
  canvas.dataset.planetExhibit = definition.id;
  canvas.dataset.planetSourceState = data.sourceState;
  canvas.dataset.planetPointCount = String(data.points.length);
  canvas.dataset.planetEncoding = definition.visualLabel.toLowerCase().replaceAll(" ", "-");
};

const select = async (index) => {
  const definition = DEFINITIONS[index];
  if (!definition || !layer) return;
  globalThis.GaiaLiveExhibits?.deactivate?.();
  globalThis.GaiaEstatExhibits?.deactivate?.();
  globalThis.GaiaFirmsExhibit?.deactivate?.();
  if (activeIndex < 0) {
    savedHeading = {
      number: document.querySelector("#japan-mode-number")?.textContent || "01",
      title: document.querySelector("#japan-mode-title")?.textContent || "地球の一呼吸",
    };
  }
  activeIndex = index;
  currentData = null;
  rebuildParticles(definition);
  layer.classList.add("is-firms-exhibit", "is-planet-signals-exhibit");
  layer.dataset.planetExhibit = definition.id;
  canvas.hidden = false;
  legend.hidden = false;
  readout.hidden = false;
  buttons.forEach((item, buttonIndex) => item.setAttribute("aria-current", String(buttonIndex === index)));
  document.querySelectorAll(".map-mode-button:not([data-planet-exhibit])").forEach((item) => item.setAttribute("aria-current", "false"));
  applyHeading(definition);
  readout.dataset.loading = "true";
  readout.querySelector("[data-planet-kicker]").textContent = `${definition.number} / CONNECTING`;
  readout.querySelector("[data-planet-title]").textContent = definition.shortTitle;
  readout.querySelector("[data-planet-primary]").textContent = "—";
  readout.querySelector("[data-planet-unit]").textContent = "";
  legend.querySelector("[data-planet-legend-title]").textContent = definition.visualLabel;
  legend.querySelector("[data-planet-legend-state]").textContent = "FETCHING";
  const data = await loadData(definition);
  if (activeIndex !== index) return;
  currentData = data;
  delete readout.dataset.loading;
  renderReadout(definition, data);
  globalThis.GaiaMapObservationAdapter?.focusEarthLocation?.({
    lon: 0,
    lat: 0,
    zoom: 1,
    targetX: 0.5,
    targetY: 0.47,
    durationMs: 900,
    label: definition.id,
  });
  cancelAnimationFrame(frame);
  lastRenderedAt = 0;
  frame = requestAnimationFrame(draw);
  dispatchEvent(new CustomEvent("gaia:planet-signals-change", { detail: { active: true, id: definition.id, sourceState: data.sourceState } }));
};

const deactivate = () => {
  if (activeIndex < 0) return;
  const previous = DEFINITIONS[activeIndex];
  activeIndex = -1;
  currentData = null;
  cancelAnimationFrame(frame);
  frame = 0;
  layer.classList.remove("is-firms-exhibit", "is-planet-signals-exhibit");
  delete layer.dataset.planetExhibit;
  canvas.hidden = true;
  legend.hidden = true;
  readout.hidden = true;
  buttons.forEach((item) => item.setAttribute("aria-current", "false"));
  if (savedHeading) {
    const number = document.querySelector("#japan-mode-number");
    const title = document.querySelector("#japan-mode-title");
    if (number) number.textContent = savedHeading.number;
    if (title) title.textContent = savedHeading.title;
  }
  savedHeading = null;
  dispatchEvent(new CustomEvent("gaia:planet-signals-change", { detail: { active: false, id: previous.id } }));
};

const step = (direction) => {
  const next = activeIndex + Number(direction);
  if (next < 0) document.querySelector("#japan-firms-mode-list [data-firms-exhibit]")?.click();
  else if (next >= DEFINITIONS.length) document.querySelector("#japan-mode-list .map-mode-button")?.click();
  else void select(next);
};

const mount = () => {
  if (document.querySelector("#gaia-planet-signals-canvas")) return;
  layer = document.querySelector("#japan-layer");
  map = document.querySelector("#japan-map");
  const list = document.querySelector("#japan-firms-mode-list");
  const bank = document.querySelector(".map-mode-bank");
  if (!(layer instanceof HTMLElement) || !(map instanceof HTMLElement) || !(list instanceof HTMLElement) || !(bank instanceof HTMLElement)) return;

  canvas = document.createElement("canvas");
  canvas.id = "gaia-planet-signals-canvas";
  canvas.className = "gaia-planet-signals-canvas";
  canvas.hidden = true;
  canvas.setAttribute("aria-hidden", "true");
  canvas.dataset.planetEngine = "canvas2d-particle-field";
  canvas.dataset.planetTargetFps = "30";
  context = canvas.getContext("2d", { alpha: true, desynchronized: true });
  if (!context) canvas.dataset.planetEngine = "unavailable";
  map.append(canvas);

  legend = document.createElement("section");
  legend.className = "gaia-planet-signals-legend";
  legend.hidden = true;
  legend.setAttribute("aria-label", "地球ライブデータの描画凡例");
  legend.innerHTML = `
    <header><strong data-planet-legend-title>LIVE PLANET SIGNAL</strong><span data-planet-legend-state>FETCHING</span></header>
    <i aria-hidden="true"></i>
    <p><span>暗い</span><span>観測値</span><span>明るい</span><em data-planet-legend-count>—</em></p>
    <div class="gaia-planet-data-time"><span>DATA TIME</span><time data-planet-data-time>読込中</time><small data-planet-data-age>—</small></div>
  `;
  map.append(legend);

  readout = document.createElement("section");
  readout.className = "gaia-planet-signals-readout";
  readout.hidden = true;
  readout.setAttribute("aria-live", "polite");
  readout.innerHTML = `
    <div class="gaia-planet-chapter">
      <p data-planet-kicker></p>
      <div><button type="button" data-planet-step="-1" aria-label="前の展示">‹</button><strong data-planet-title></strong><button type="button" data-planet-step="1" aria-label="次の展示">›</button></div>
    </div>
    <div class="gaia-planet-primary"><p data-planet-primary-label></p><strong data-planet-primary>—</strong><span data-planet-unit></span></div>
    <div class="gaia-planet-metrics">
      <span><small data-planet-secondary-a-label>—</small><strong data-planet-secondary-a>—</strong></span>
      <span><small data-planet-secondary-b-label>—</small><strong data-planet-secondary-b>—</strong></span>
    </div>
    <div class="gaia-planet-copy"><p data-planet-caption></p><small><b data-planet-state>FETCHING</b> · <time data-planet-time>—</time></small></div>
    <div class="gaia-planet-source"><span data-planet-source></span><a data-planet-source-link target="_blank" rel="noopener noreferrer"><strong>元データを見る</strong><i aria-hidden="true">↗</i></a></div>
  `;
  layer.append(readout);

  buttons = DEFINITIONS.map((definition, index) => {
    const item = document.createElement("button");
    item.className = "map-mode-button";
    item.type = "button";
    item.textContent = definition.number;
    item.dataset.planetExhibit = definition.id;
    item.dataset.mapPreviewSurface = "map";
    item.style.setProperty("--planet-rgb", definition.rgb);
    item.setAttribute("aria-label", `${definition.number} ${definition.shortTitle}、${definition.sourceName}の観測展示へ切り替える`);
    item.setAttribute("aria-describedby", "map-mode-preview");
    item.setAttribute("aria-current", "false");
    item.addEventListener("click", () => { void select(index); });
    list.append(item);
    return item;
  });

  bank.addEventListener("click", (event) => {
    const target = event.target instanceof Element ? event.target.closest(".map-mode-button") : null;
    if (!(target instanceof HTMLButtonElement) || target.dataset.planetExhibit || activeIndex < 0) return;
    deactivate();
  }, { capture: true });
  readout.querySelectorAll("[data-planet-step]").forEach((item) => item.addEventListener("click", () => step(item.dataset.planetStep)));
  addEventListener("resize", () => { if (activeIndex >= 0) lastRenderedAt = 0; }, { passive: true });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) cancelAnimationFrame(frame);
    else if (activeIndex >= 0) frame = requestAnimationFrame(draw);
  });
  dispatchEvent(new CustomEvent("gaia:planet-signals-mounted"));
};

if (globalThis.GaiaMapObservationAdapter) mount();
else addEventListener("gaia:map-adapter-ready", mount, { once: true });

globalThis.GaiaPlanetSignals = Object.freeze({
  definitions: DEFINITIONS,
  select,
  deactivate,
  getState: () => ({
    active: activeIndex >= 0,
    id: activeIndex >= 0 ? DEFINITIONS[activeIndex].id : null,
    sourceState: currentData?.sourceState || null,
    pointCount: currentData?.points?.length || 0,
  }),
});

export { mount };
