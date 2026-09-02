import { OBSERVATION_CITIES } from "./live-exhibits.js?v=gaia-wind-brush-1";
import { ESTAT_PREFECTURE_SNAPSHOT } from "./estat-prefecture-data.js";

const SERIES_URL = new URL("../../data/estat-prefecture-series.json", import.meta.url);
const PERIOD_MS = 6200;
const POI_MS = 3600;
const TRANSITION_MS = 920;
const NATURAL_ENVIRONMENT_SOURCE = "https://www.e-stat.go.jp/stat-search/files?cycle=0&layout=datalist&lid=000001477298&month=0&page=1&stat_infid=000040412523&tclass1=000001240737&tclass2val=0&toukei=00200502&tstat=000001240736&year=20260";

const EXHIBITS = Object.freeze([
  Object.freeze({
    id: "estat-migration",
    number: "16",
    shortTitle: "人の潮目",
    title: "人の潮目 — PEOPLE TIDE",
    key: "migration",
    unit: "人",
    valueLabel: "転入超過",
    accent: "#65f5df",
    secondary: "#ff8278",
    caption: "都道府県ごとの転入超過数を、流れ込む青緑と流れ出す珊瑚色の潮目へ変換します。",
    guide: "プラスは転入超過、マイナスは転出超過。光環の向きと長さが人数の差を表します。",
    frequency: "月次",
    sourceName: "住民基本台帳人口移動報告 / 月報",
    source: ESTAT_PREFECTURE_SNAPSHOT.sources.migration,
  }),
  Object.freeze({
    id: "estat-lodging",
    number: "17",
    shortTitle: "旅の灯",
    title: "旅の灯 — STAYING LIGHTS",
    key: "lodging",
    unit: "人泊",
    valueLabel: "延べ宿泊者数",
    accent: "#ffd36e",
    secondary: "#ff8ac7",
    caption: "都道府県別の延べ宿泊者数を、列島に宿る灯と余韻の密度へ変換します。",
    guide: "灯の大きさは延べ宿泊者数。月を送ると、季節ごとに旅の重心が移る様子が見えます。",
    frequency: "月次",
    sourceName: "宿泊旅行統計調査 / 第2次速報値",
    source: ESTAT_PREFECTURE_SNAPSHOT.sources.lodging,
  }),
  Object.freeze({
    id: "estat-housing",
    number: "18",
    shortTitle: "住まいの芽吹き",
    title: "住まいの芽吹き — NEW HOMES",
    key: "housing",
    unit: "戸",
    valueLabel: "新設住宅着工戸数",
    accent: "#9cecff",
    secondary: "#b9ff8b",
    caption: "都道府県別の新設住宅着工戸数を、地面から立ち上がる光の芽へ変換します。",
    guide: "光柱の高さと枝分かれが着工戸数。月ごとの建設活動の濃淡を比較できます。",
    frequency: "月次",
    sourceName: "建築着工統計調査 / 住宅着工統計",
    source: ESTAT_PREFECTURE_SNAPSHOT.sources.housing,
  }),
  Object.freeze({
    id: "estat-average-temperature",
    number: "19",
    shortTitle: "空の体温",
    title: "空の体温 — ANNUAL TEMPERATURE",
    key: "averageTemperature",
    unit: "℃",
    decimals: 1,
    valueLabel: "年平均気温",
    accent: "#ff9a72",
    secondary: "#ffdf82",
    caption: "47都道府県の年平均気温を、列島を包む熱の呼吸として描きます。",
    guide: "光環の厚みと暖色の密度が気温。年を送ると、同じ場所の空気の変化を追えます。",
    frequency: "年次",
    visual: "thermal",
    scaleMode: "range",
    sourceName: "統計でみる都道府県のすがた / B 自然環境",
    source: NATURAL_ENVIRONMENT_SOURCE,
  }),
  Object.freeze({
    id: "estat-summer-high",
    number: "20",
    shortTitle: "夏の頂",
    title: "夏の頂 — SUMMER CREST",
    key: "summerHigh",
    unit: "℃",
    decimals: 1,
    valueLabel: "月平均日最高気温の最高値",
    accent: "#ff765f",
    secondary: "#ffd76d",
    caption: "一年でもっとも暑い月の平均的な日最高気温を、ほどける陽炎へ変換します。",
    guide: "大きく鋭い光ほど値が高い地点。単日の最高気温ではなく、月平均値の年内最高です。",
    frequency: "年次",
    visual: "heat",
    scaleMode: "range",
    sourceName: "統計でみる都道府県のすがた / B 自然環境",
    source: NATURAL_ENVIRONMENT_SOURCE,
  }),
  Object.freeze({
    id: "estat-winter-low",
    number: "21",
    shortTitle: "冬の底",
    title: "冬の底 — WINTER DEPTH",
    key: "winterLow",
    unit: "℃",
    decimals: 1,
    valueLabel: "月平均日最低気温の最低値",
    accent: "#83d8ff",
    secondary: "#c9b8ff",
    caption: "一年でもっとも寒い月の平均的な日最低気温を、静かな氷晶の深さで示します。",
    guide: "大きい氷晶ほど低温。単日の最低気温ではなく、月平均値の年内最低です。",
    frequency: "年次",
    visual: "frost",
    scaleMode: "cold",
    sourceName: "統計でみる都道府県のすがた / B 自然環境",
    source: NATURAL_ENVIRONMENT_SOURCE,
  }),
  Object.freeze({
    id: "estat-relative-humidity",
    number: "22",
    shortTitle: "湿りの膜",
    title: "湿りの膜 — HUMID AIR",
    key: "relativeHumidity",
    unit: "%",
    valueLabel: "年平均相対湿度",
    accent: "#79f0dc",
    secondary: "#7bb7ff",
    caption: "年平均相対湿度を、土地の上で重なり合う水の膜として可視化します。",
    guide: "膜が大きく幾重にも見えるほど湿度が高い地点。欠測は推定せず、そのまま示します。",
    frequency: "年次",
    visual: "humidity",
    scaleMode: "range",
    sourceName: "統計でみる都道府県のすがた / B 自然環境",
    source: NATURAL_ENVIRONMENT_SOURCE,
  }),
  Object.freeze({
    id: "estat-sunshine-hours",
    number: "23",
    shortTitle: "光の貯金",
    title: "光の貯金 — SUNSHINE HOURS",
    key: "sunshineHours",
    unit: "時間",
    decimals: 1,
    valueLabel: "年間日照時間",
    accent: "#ffe58b",
    secondary: "#ff9e6d",
    caption: "一年に積み重なった日照時間を、土地ごとに蓄えられた光として灯します。",
    guide: "光条の長さと数が年間日照時間。全期間共通スケールで年ごとの増減を比較できます。",
    frequency: "年次",
    visual: "sunshine",
    scaleMode: "range",
    sourceName: "統計でみる都道府県のすがた / B 自然環境",
    source: NATURAL_ENVIRONMENT_SOURCE,
  }),
  Object.freeze({
    id: "estat-precipitation",
    number: "24",
    shortTitle: "雨の器",
    title: "雨の器 — ANNUAL RAINFALL",
    key: "precipitation",
    unit: "mm",
    decimals: 1,
    valueLabel: "年間降水量",
    accent: "#67cfff",
    secondary: "#668cff",
    caption: "年間降水量を、列島へ落ちて広がる水の筋と波紋へ変換します。",
    guide: "雨筋の長さと波紋の広がりが降水量。観測値がない年は補完せず欠測と表示します。",
    frequency: "年次",
    visual: "rainfall",
    scaleMode: "range",
    sourceName: "統計でみる都道府県のすがた / B 自然環境",
    source: NATURAL_ENVIRONMENT_SOURCE,
  }),
  Object.freeze({
    id: "estat-rainy-days",
    number: "25",
    shortTitle: "雨の足跡",
    title: "雨の足跡 — RAINY DAYS",
    key: "rainyDays",
    unit: "日",
    valueLabel: "年間雨日数",
    accent: "#9aa7ff",
    secondary: "#65efd5",
    caption: "一年の雨日数を、繰り返し地表へ残る雫の足跡として描きます。",
    guide: "波紋の層が多いほど雨の日が多い地点。降水量とは別の『雨の頻度』を比べられます。",
    frequency: "年次",
    visual: "rain-days",
    scaleMode: "range",
    sourceName: "統計でみる都道府県のすがた / B 自然環境",
    source: NATURAL_ENVIRONMENT_SOURCE,
  }),
]);

let layer;
let map;
let canvas;
let context;
let markerLayer;
let markerButtons = [];
let readout;
let buttons = [];
let activeIndex = -1;
let selectedIndex = 0;
let periodIndex = 0;
let previousPeriodIndex = 0;
let transitionStartedAt = 0;
let frame = 0;
let nextMonthAt = 0;
let nextPoiAt = 0;
let series;
let seriesPromise;
let savedHeading;
const scaleMaxima = new Map();

const clamp01 = (value) => Math.max(0, Math.min(1, value));
const ease = (value) => 1 - ((1 - clamp01(value)) ** 3);
const formatNumber = (value, signed = false, decimals = 0) => {
  if (!Number.isFinite(value)) return "欠測";
  const number = Number(value);
  const sign = signed && number > 0 ? "+" : "";
  return `${sign}${number.toLocaleString("ja-JP", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;
};

const fallbackSeries = () => {
  const latest = ESTAT_PREFECTURE_SNAPSHOT.period;
  const fallback = {
    months: [latest],
    migration: { [latest]: ESTAT_PREFECTURE_SNAPSHOT.migration.map(({ net }) => net) },
    lodging: { [latest]: ESTAT_PREFECTURE_SNAPSHOT.lodging.map(({ guestNights }) => guestNights) },
    housing: { [latest]: ESTAT_PREFECTURE_SNAPSHOT.housing.map(({ newStarts }) => newStarts) },
    periodsBySeries: {},
    ids: {},
  };
  EXHIBITS.filter(({ frequency }) => frequency === "年次").forEach(({ key }) => {
    fallback.periodsBySeries[key] = ["—"];
    fallback[key] = { "—": Array(OBSERVATION_CITIES.length).fill(null) };
  });
  return fallback;
};

const periodsFor = (exhibit = currentExhibit(), candidate = series) => (
  candidate?.periodsBySeries?.[exhibit.key]
  || candidate?.months
  || []
);

const validateSeries = (candidate) => {
  if (!Array.isArray(candidate?.months) || !candidate.months.length) return false;
  return EXHIBITS.every((exhibit) => periodsFor(exhibit, candidate).every((period) => (
    Array.isArray(candidate[exhibit.key]?.[period])
    && candidate[exhibit.key][period].length === OBSERVATION_CITIES.length
    && candidate[exhibit.key][period].every((value) => value === null || Number.isFinite(value))
  )));
};

const loadSeries = () => {
  if (series) return Promise.resolve(series);
  if (seriesPromise) return seriesPromise;
  seriesPromise = fetch(SERIES_URL)
    .then((response) => {
      if (!response.ok) throw new Error(`e-Stat series HTTP ${response.status}`);
      return response.json();
    })
    .then((candidate) => {
      if (!validateSeries(candidate)) throw new Error("e-Stat series failed validation");
      series = candidate;
      return series;
    })
    .catch((error) => {
      console.warn(error);
      series = fallbackSeries();
      return series;
    });
  return seriesPromise;
};

const wrapLongitude = (longitude) => ((longitude + 540) % 360) - 180;
const projection = () => {
  const rect = canvas?.getBoundingClientRect();
  if (!rect?.width || !rect?.height) return null;
  const overlay = document.querySelector("#japan-overlay");
  const zoom = Math.max(1, Number(overlay?.dataset.earthZoom) || 1);
  const offsetX = Number(overlay?.dataset.earthOffsetX) || 0;
  const offsetY = Number(overlay?.dataset.earthOffsetY) || 0;
  const scale = Math.max(rect.width / 360, rect.height / 180) * zoom;
  return {
    rect,
    scale,
    originX: (rect.width - 360 * scale) / 2 + offsetX,
    originY: (rect.height - 180 * scale) / 2 + offsetY,
  };
};

const project = (location, currentProjection) => {
  const { rect, scale, originX, originY } = currentProjection;
  return [
    originX + (wrapLongitude(location.lon - 138) + 180) * scale,
    originY + (90 - location.lat) * scale,
    rect,
  ];
};

const currentExhibit = () => EXHIBITS[activeIndex] || EXHIBITS[0];
const currentPeriod = () => periodsFor()[periodIndex] || ESTAT_PREFECTURE_SNAPSHOT.period;
const valuesFor = (index = periodIndex) => {
  const exhibit = currentExhibit();
  const period = periodsFor(exhibit)[index] || currentPeriod();
  return series?.[exhibit.key]?.[period] || [];
};

const selectedValue = () => valuesFor()[selectedIndex];
const normalizedValue = (value, exhibit) => {
  if (!Number.isFinite(value)) return 0;
  if (!scaleMaxima.has(exhibit.key)) {
    const allValues = periodsFor(exhibit)
      .flatMap((period) => series?.[exhibit.key]?.[period] || [])
      .filter(Number.isFinite);
    scaleMaxima.set(exhibit.key, {
      minimum: Math.min(...allValues),
      maximum: Math.max(...allValues),
      absolute: Math.max(1, ...allValues.map((entry) => Math.abs(entry))),
    });
  }
  const range = scaleMaxima.get(exhibit.key) || { minimum: 0, maximum: 1, absolute: 1 };
  if (exhibit.key === "migration") return Math.sqrt(Math.abs(value) / range.absolute);
  if (exhibit.scaleMode === "cold") {
    return 0.12 + Math.sqrt(clamp01((range.maximum - value) / Math.max(0.001, range.maximum - range.minimum))) * 0.88;
  }
  if (exhibit.scaleMode === "range") {
    return 0.12 + Math.sqrt(clamp01((value - range.minimum) / Math.max(0.001, range.maximum - range.minimum))) * 0.88;
  }
  return Math.sqrt(Math.max(0, value) / Math.max(1, range.maximum));
};

const syncCanvas = () => {
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.min(devicePixelRatio || 1, 1.75);
  const width = Math.max(1, Math.round(rect.width * dpr));
  const height = Math.max(1, Math.round(rect.height * dpr));
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }
  context.setTransform(dpr, 0, 0, dpr, 0, 0);
  return rect;
};

const drawMigration = (x, y, value, strength, selected, time) => {
  const positive = value >= 0;
  const color = positive ? "101,245,223" : "255,130,120";
  const direction = positive ? -1 : 1;
  const radius = 6 + strength * 19;
  context.save();
  context.translate(x, y);
  context.rotate(direction * (0.35 + Math.sin(time * 0.0005 + x) * 0.18));
  context.lineCap = "round";
  for (let ring = 0; ring < 3; ring += 1) {
    context.beginPath();
    context.arc(0, 0, radius + ring * 4, -2.55 + ring * 0.25, 0.65 + ring * 0.18);
    context.strokeStyle = `rgba(${color},${0.15 + strength * 0.34 + (selected ? 0.18 : 0)})`;
    context.lineWidth = Math.max(1, 1.2 + strength * 2.4 - ring * 0.45);
    context.stroke();
  }
  context.beginPath();
  context.moveTo(direction * -radius * 0.8, 0);
  context.quadraticCurveTo(0, Math.sin(time * 0.001 + y) * 7, direction * radius * 0.78, 0);
  context.strokeStyle = `rgba(${color},${0.32 + strength * 0.56})`;
  context.lineWidth = 1.5 + strength * 3.5;
  context.stroke();
  context.restore();
};

const drawLodging = (x, y, strength, selected, time) => {
  const pulse = 0.5 + 0.5 * Math.sin(time * 0.0012 + x * 0.04);
  const radius = 4 + strength * 18 + (selected ? pulse * 4 : 0);
  const gradient = context.createRadialGradient(x, y, 0, x, y, radius * 2.2);
  gradient.addColorStop(0, `rgba(255,238,170,${0.65 + strength * 0.3})`);
  gradient.addColorStop(0.35, `rgba(255,184,102,${0.28 + strength * 0.25})`);
  gradient.addColorStop(1, "rgba(255,116,194,0)");
  context.fillStyle = gradient;
  context.beginPath();
  context.arc(x, y, radius * 2.2, 0, Math.PI * 2);
  context.fill();
  context.strokeStyle = `rgba(255,215,125,${0.24 + strength * 0.6})`;
  context.lineWidth = 1 + strength * 2;
  for (let petal = 0; petal < 3; petal += 1) {
    const angle = time * 0.00018 + petal * Math.PI * 2 / 3;
    context.beginPath();
    context.arc(x + Math.cos(angle) * radius * 0.4, y + Math.sin(angle) * radius * 0.4, radius * (0.65 + petal * 0.08), angle, angle + 1.8);
    context.stroke();
  }
};

const drawHousing = (x, y, strength, selected, time) => {
  const height = 8 + strength * 38;
  const sway = Math.sin(time * 0.00055 + x * 0.03) * (1.5 + strength * 2);
  context.save();
  context.translate(x, y);
  context.lineCap = "round";
  const gradient = context.createLinearGradient(0, 0, 0, -height);
  gradient.addColorStop(0, `rgba(129,230,255,${0.3 + strength * 0.4})`);
  gradient.addColorStop(1, `rgba(196,255,145,${0.62 + strength * 0.34})`);
  context.strokeStyle = gradient;
  context.lineWidth = 1.2 + strength * 3.4 + (selected ? 1 : 0);
  context.beginPath();
  context.moveTo(0, 3);
  context.bezierCurveTo(-sway, -height * 0.32, sway, -height * 0.68, sway * 0.45, -height);
  context.stroke();
  context.lineWidth *= 0.55;
  context.beginPath();
  context.moveTo(0, -height * 0.48);
  context.quadraticCurveTo(-height * 0.22, -height * 0.58, -height * 0.27, -height * 0.72);
  context.moveTo(sway * 0.25, -height * 0.7);
  context.quadraticCurveTo(height * 0.2, -height * 0.78, height * 0.23, -height * 0.91);
  context.stroke();
  context.restore();
};

const rgb = (hex) => {
  const value = Number.parseInt(hex.slice(1), 16);
  return `${value >> 16},${(value >> 8) & 255},${value & 255}`;
};

const drawNature = (x, y, strength, selected, time, exhibit, index) => {
  const phase = time * 0.00034 + index * 1.731;
  const breath = 0.82 + Math.sin(phase) * 0.08;
  const radius = (5 + strength * 19) * breath + (selected ? 3 : 0);
  const primary = rgb(exhibit.accent);
  const secondary = rgb(exhibit.secondary);
  const glow = context.createRadialGradient(x, y, 0, x, y, radius * 2.25);
  glow.addColorStop(0, `rgba(${primary},${0.34 + strength * 0.28})`);
  glow.addColorStop(0.32, `rgba(${secondary},${0.12 + strength * 0.16})`);
  glow.addColorStop(1, `rgba(${primary},0)`);
  context.fillStyle = glow;
  context.beginPath();
  context.arc(x, y, radius * 2.25, 0, Math.PI * 2);
  context.fill();

  context.save();
  context.translate(x, y);
  context.lineCap = "round";
  context.lineJoin = "round";
  context.strokeStyle = `rgba(${primary},${0.34 + strength * 0.48})`;
  context.fillStyle = `rgba(${secondary},${0.34 + strength * 0.44})`;

  if (exhibit.visual === "thermal") {
    for (let ring = 0; ring < 3; ring += 1) {
      const r = radius * (0.56 + ring * 0.28);
      context.lineWidth = 0.9 + strength * 1.8 - ring * 0.15;
      context.beginPath();
      context.ellipse(Math.sin(phase + ring) * 1.5, 0, r * (1.08 + ring * 0.04), r * 0.62, phase * 0.12 + ring * 0.36, 0.18, Math.PI * 1.82);
      context.stroke();
    }
    context.fillStyle = `rgba(${secondary},${0.55 + strength * 0.34})`;
    context.beginPath();
    context.arc(0, 0, 2.2 + strength * 3.1, 0, Math.PI * 2);
    context.fill();
  } else if (exhibit.visual === "heat" || exhibit.visual === "sunshine") {
    const rays = exhibit.visual === "sunshine" ? 12 : 8;
    context.rotate(phase * (exhibit.visual === "sunshine" ? 0.08 : 0.14));
    for (let ray = 0; ray < rays; ray += 1) {
      const angle = ray * Math.PI * 2 / rays;
      const inner = radius * (0.32 + (ray % 2) * 0.1);
      const outer = radius * (0.82 + strength * 0.38 + (ray % 3) * 0.1);
      context.lineWidth = 0.8 + strength * (exhibit.visual === "sunshine" ? 1.5 : 2.2);
      context.beginPath();
      context.moveTo(Math.cos(angle) * inner, Math.sin(angle) * inner);
      context.quadraticCurveTo(
        Math.cos(angle + 0.09) * outer * 0.72,
        Math.sin(angle + 0.09) * outer * 0.72,
        Math.cos(angle) * outer,
        Math.sin(angle) * outer,
      );
      context.stroke();
    }
    context.fillStyle = `rgba(${secondary},${0.52 + strength * 0.42})`;
    context.beginPath();
    context.arc(0, 0, radius * (exhibit.visual === "sunshine" ? 0.32 : 0.4), 0, Math.PI * 2);
    context.fill();
  } else if (exhibit.visual === "frost") {
    context.rotate(phase * 0.08);
    for (let branch = 0; branch < 6; branch += 1) {
      context.save();
      context.rotate(branch * Math.PI / 3);
      context.lineWidth = 0.75 + strength * 1.45;
      context.beginPath();
      context.moveTo(radius * 0.12, 0);
      context.lineTo(radius, 0);
      const fork = radius * 0.57;
      context.moveTo(fork, 0);
      context.lineTo(fork + radius * 0.2, -radius * 0.16);
      context.moveTo(fork, 0);
      context.lineTo(fork + radius * 0.2, radius * 0.16);
      context.stroke();
      context.restore();
    }
  } else if (exhibit.visual === "humidity") {
    for (let layerIndex = 0; layerIndex < 3; layerIndex += 1) {
      const r = radius * (0.42 + layerIndex * 0.3);
      context.lineWidth = 1 + strength * 1.7;
      context.beginPath();
      context.ellipse(Math.sin(phase + layerIndex) * 2, Math.cos(phase * 0.7 + layerIndex) * 1.4, r * 1.15, r * 0.52, -0.25 + layerIndex * 0.2, 0.16, Math.PI * 1.84);
      context.stroke();
    }
    context.beginPath();
    context.arc(Math.cos(phase) * radius * 0.42, Math.sin(phase) * radius * 0.24, 1.8 + strength * 2.2, 0, Math.PI * 2);
    context.fill();
  } else if (exhibit.visual === "rainfall") {
    for (let drop = -2; drop <= 2; drop += 1) {
      const dx = drop * radius * 0.28;
      const shift = ((phase * 7 + drop * 0.37) % 1) * radius * 0.8;
      context.lineWidth = 0.9 + strength * 1.7;
      context.beginPath();
      context.moveTo(dx + radius * 0.16, -radius * 0.82 + shift);
      context.lineTo(dx - radius * 0.12, -radius * 0.2 + shift);
      context.stroke();
    }
    context.beginPath();
    context.ellipse(0, radius * 0.58, radius * 0.84, radius * 0.28, 0, 0.2, Math.PI * 1.8);
    context.stroke();
  } else {
    for (let ring = 0; ring < 4; ring += 1) {
      const r = radius * (0.3 + ring * 0.23);
      context.globalAlpha = 0.92 - ring * 0.15;
      context.lineWidth = 0.8 + strength * 1.35;
      context.beginPath();
      context.ellipse(0, ring * 0.8, r, r * 0.38, Math.sin(phase + ring) * 0.12, 0.12, Math.PI * 1.88);
      context.stroke();
    }
    context.globalAlpha = 1;
    context.beginPath();
    context.moveTo(0, -radius * 0.82);
    context.quadraticCurveTo(radius * 0.3, -radius * 0.3, 0, radius * 0.02);
    context.quadraticCurveTo(-radius * 0.3, -radius * 0.3, 0, -radius * 0.82);
    context.fill();
  }
  context.restore();
};

const updateMarkers = (currentProjection, interpolatedValues) => {
  markerButtons.forEach((button, index) => {
    const city = OBSERVATION_CITIES[index];
    const [x, y, rect] = project(city, currentProjection);
    const visible = x >= -20 && x <= rect.width + 20 && y >= -28 && y <= rect.height + 28;
    button.hidden = !visible;
    button.style.left = `${x}px`;
    button.style.top = `${y}px`;
    const value = interpolatedValues[index];
    const missing = !Number.isFinite(value);
    const strength = normalizedValue(value, currentExhibit());
    button.classList.toggle("is-missing", missing);
    button.style.setProperty("--estat-strength", strength.toFixed(3));
    button.style.setProperty("--estat-marker-size", `${(14 + strength * 12).toFixed(2)}px`);
    button.style.setProperty("--estat-core-size", `${(5 + strength * 7).toFixed(2)}px`);
    button.style.setProperty("--estat-glow-size", `${(8 + strength * 18).toFixed(2)}px`);
    button.setAttribute("aria-current", String(index === selectedIndex));
    button.querySelector("b").textContent = formatNumber(value, currentExhibit().key === "migration", currentExhibit().decimals || 0);
  });
};

const draw = (timestamp = performance.now()) => {
  if (activeIndex < 0 || !series || document.hidden) {
    frame = 0;
    return;
  }
  const rect = syncCanvas();
  const currentProjection = projection();
  if (!currentProjection) {
    frame = requestAnimationFrame(draw);
    return;
  }
  context.clearRect(0, 0, rect.width, rect.height);
  const progress = ease((timestamp - transitionStartedAt) / TRANSITION_MS);
  const from = valuesFor(previousPeriodIndex);
  const to = valuesFor(periodIndex);
  const values = to.map((value, index) => {
    const previous = from[index];
    if (!Number.isFinite(value)) return null;
    if (!Number.isFinite(previous)) return value;
    return previous + (value - previous) * progress;
  });
  updateMarkers(currentProjection, values);
  const exhibit = currentExhibit();
  values.forEach((value, index) => {
    const [x, y] = project(OBSERVATION_CITIES[index], currentProjection);
    if (x < -60 || x > rect.width + 60 || y < -60 || y > rect.height + 60) return;
    if (!Number.isFinite(value)) return;
    const strength = normalizedValue(value, exhibit);
    if (exhibit.key === "migration") drawMigration(x, y, value, strength, index === selectedIndex, timestamp);
    else if (exhibit.key === "lodging") drawLodging(x, y, strength, index === selectedIndex, timestamp);
    else if (exhibit.key === "housing") drawHousing(x, y, strength, index === selectedIndex, timestamp);
    else drawNature(x, y, strength, index === selectedIndex, timestamp, exhibit, index);
  });
  const periods = periodsFor();
  if (timestamp >= nextMonthAt && periods.length > 1) setPeriod((periodIndex + 1) % periods.length, { auto: true });
  if (timestamp >= nextPoiAt) selectPrefecture((selectedIndex + 1) % OBSERVATION_CITIES.length, { auto: true });
  frame = requestAnimationFrame(draw);
};

const renderReadout = () => {
  if (!readout || !series || activeIndex < 0) return;
  const exhibit = currentExhibit();
  const periods = periodsFor(exhibit);
  const values = valuesFor();
  const value = selectedValue();
  const previousValues = valuesFor(Math.max(0, periodIndex - 1));
  const previousValue = previousValues[selectedIndex];
  const delta = periodIndex > 0 && Number.isFinite(value) && Number.isFinite(previousValue) ? value - previousValue : null;
  const ordered = values.filter(Number.isFinite).sort((a, b) => b - a);
  const rank = Number.isFinite(value) ? ordered.indexOf(value) + 1 : null;
  const city = OBSERVATION_CITIES[selectedIndex];
  const period = currentPeriod();
  layer.style.setProperty("--estat-accent", exhibit.accent);
  layer.style.setProperty("--estat-secondary", exhibit.secondary);
  readout.style.setProperty("--estat-accent", exhibit.accent);
  readout.style.setProperty("--estat-secondary", exhibit.secondary);
  readout.dataset.estatExhibit = exhibit.key;
  readout.dataset.estatPeriod = period;
  readout.dataset.estatSelectedCode = city.code;
  readout.querySelector("[data-estat-number]").textContent = exhibit.number;
  readout.querySelector("[data-estat-title]").textContent = exhibit.shortTitle;
  readout.querySelector("[data-estat-place]").textContent = `${city.code} ${city.prefecture}`;
  readout.querySelector("[data-estat-city]").textContent = city.city;
  readout.querySelector("[data-estat-value-label]").textContent = exhibit.valueLabel;
  readout.querySelector("[data-estat-value]").textContent = formatNumber(value, exhibit.key === "migration", exhibit.decimals || 0);
  readout.querySelector("[data-estat-unit]").textContent = exhibit.unit;
  readout.querySelector("[data-estat-period]").textContent = period.replace("-", " / ");
  readout.querySelector("[data-estat-rank]").textContent = rank ? `${rank} / ${ordered.length}` : "欠測";
  readout.querySelector("[data-estat-delta]").textContent = delta === null ? (periodIndex === 0 ? "起点" : "比較不可") : `${formatNumber(delta, true, exhibit.decimals || 0)} ${exhibit.unit}`;
  readout.querySelector("[data-estat-frequency]").textContent = `e-Stat · ${exhibit.frequency.toUpperCase()}`;
  readout.querySelector("[data-estat-delta-label]").childNodes[0].nodeValue = exhibit.frequency === "年次" ? "前年差" : "前月差";
  readout.querySelector("[data-estat-caption]").textContent = exhibit.caption;
  readout.querySelector("[data-estat-guide]").textContent = exhibit.guide;
  readout.querySelector("[data-estat-source]").textContent = exhibit.sourceName;
  readout.querySelector("[data-estat-source]").href = exhibit.source;
  const slider = readout.querySelector("[data-estat-month]");
  slider.max = String(periods.length - 1);
  slider.value = String(periodIndex);
  slider.setAttribute("aria-valuetext", period);
  slider.setAttribute("aria-label", exhibit.frequency === "年次" ? "表示年を選ぶ" : "表示月を選ぶ");
  readout.querySelector("[data-estat-months]").innerHTML = periods.map((entry, index) => `<i class="${index === periodIndex ? "is-current" : ""}"><span>${exhibit.frequency === "年次" ? entry : entry.slice(5)}</span></i>`).join("");
  markerButtons.forEach((button, index) => {
    const markerValue = values[index];
    button.setAttribute("aria-label", `${OBSERVATION_CITIES[index].code} ${OBSERVATION_CITIES[index].prefecture}、${exhibit.valueLabel} ${formatNumber(markerValue, exhibit.key === "migration", exhibit.decimals || 0)} ${Number.isFinite(markerValue) ? exhibit.unit : ""}`.trim());
  });
};

const applyHeading = () => {
  const exhibit = currentExhibit();
  const number = document.querySelector("#japan-mode-number");
  const bankTitle = document.querySelector("#japan-mode-title");
  const mapTitle = document.querySelector("#japan-title");
  if (number) number.textContent = exhibit.number;
  if (bankTitle) bankTitle.textContent = exhibit.shortTitle;
  if (mapTitle) {
    mapTitle.dataset.exhibitNumber = exhibit.number;
    mapTitle.textContent = exhibit.shortTitle;
    mapTitle.setAttribute("aria-label", `${exhibit.number} ${exhibit.shortTitle}`);
  }
};

const selectPrefecture = (index, { auto = false } = {}) => {
  const requested = Math.max(0, Math.min(OBSERVATION_CITIES.length - 1, Number(index) || 0));
  if (requested === selectedIndex && auto) {
    nextPoiAt = performance.now() + POI_MS;
    return;
  }
  const previous = markerButtons[selectedIndex];
  const previousIndex = selectedIndex;
  selectedIndex = requested;
  previous?.classList.add("is-departing");
  window.setTimeout(() => previous?.classList.remove("is-departing"), 520);
  const current = markerButtons[selectedIndex];
  current?.classList.remove("is-arriving");
  requestAnimationFrame(() => current?.classList.add("is-arriving"));
  window.setTimeout(() => current?.classList.remove("is-arriving"), 900);
  nextPoiAt = performance.now() + (auto ? POI_MS : POI_MS * 2);
  renderReadout();
  dispatchEvent(new CustomEvent("gaia:estat-poi-change", {
    detail: {
      from: OBSERVATION_CITIES[previousIndex]?.code,
      to: OBSERVATION_CITIES[selectedIndex]?.code,
      auto,
    },
  }));
};

const setPeriod = (index, { auto = false } = {}) => {
  const periods = periodsFor();
  if (!periods.length) return;
  const length = periods.length;
  const requested = ((Number(index) || 0) % length + length) % length;
  if (requested === periodIndex && auto) {
    nextMonthAt = performance.now() + PERIOD_MS;
    return;
  }
  previousPeriodIndex = periodIndex;
  periodIndex = requested;
  transitionStartedAt = performance.now();
  nextMonthAt = transitionStartedAt + (auto ? PERIOD_MS : PERIOD_MS * 2);
  layer.dataset.estatPeriodTransition = "active";
  window.setTimeout(() => {
    if (layer) layer.dataset.estatPeriodTransition = "settled";
  }, TRANSITION_MS);
  renderReadout();
};

const setMonth = setPeriod;

const select = async (index) => {
  const requested = Math.max(0, Math.min(EXHIBITS.length - 1, Number(index) || 0));
  globalThis.GaiaLiveExhibits?.deactivate?.();
  if (activeIndex < 0) {
    savedHeading = {
      number: document.querySelector("#japan-mode-number")?.textContent || "01",
      title: document.querySelector("#japan-mode-title")?.textContent || "地球の一呼吸",
    };
  }
  activeIndex = requested;
  await loadSeries();
  periodIndex = 0;
  previousPeriodIndex = 0;
  transitionStartedAt = performance.now();
  layer.classList.add("is-estat-exhibit");
  layer.dataset.estatExhibit = currentExhibit().key;
  layer.dataset.estatFrequency = currentExhibit().frequency;
  canvas.hidden = false;
  markerLayer.hidden = false;
  readout.hidden = false;
  buttons.forEach((button, buttonIndex) => button.setAttribute("aria-current", String(buttonIndex === activeIndex)));
  document.querySelectorAll(".map-mode-button:not([data-estat-exhibit])").forEach((button) => button.setAttribute("aria-current", "false"));
  applyHeading();
  renderReadout();
  nextMonthAt = performance.now() + PERIOD_MS;
  nextPoiAt = performance.now() + POI_MS;
  globalThis.GaiaMapObservationAdapter?.focusEarthLocation?.({
    lon: 137.4,
    lat: 36.2,
    zoom: innerWidth <= 720 ? 4.25 : 4.45,
    targetX: 0.51,
    targetY: innerWidth <= 720 ? 0.42 : 0.44,
    label: "estat-japan-47-prefectures",
  });
  cancelAnimationFrame(frame);
  frame = requestAnimationFrame(draw);
  dispatchEvent(new CustomEvent("gaia:estat-exhibit-change", { detail: { index: activeIndex, id: currentExhibit().id } }));
};

const deactivate = () => {
  if (activeIndex < 0) return;
  activeIndex = -1;
  cancelAnimationFrame(frame);
  frame = 0;
  layer.classList.remove("is-estat-exhibit");
  delete layer.dataset.estatExhibit;
  delete layer.dataset.estatFrequency;
  delete layer.dataset.estatPeriodTransition;
  canvas.hidden = true;
  markerLayer.hidden = true;
  readout.hidden = true;
  buttons.forEach((button) => button.setAttribute("aria-current", "false"));
  if (savedHeading) {
    const number = document.querySelector("#japan-mode-number");
    const bankTitle = document.querySelector("#japan-mode-title");
    if (number) number.textContent = savedHeading.number;
    if (bankTitle) bankTitle.textContent = savedHeading.title;
  }
  savedHeading = null;
  dispatchEvent(new CustomEvent("gaia:estat-exhibit-change", { detail: { index: -1, id: null } }));
};

const mount = () => {
  if (document.querySelector("#gaia-estat-canvas")) return;
  layer = document.querySelector("#japan-layer");
  map = document.querySelector("#japan-map");
  const list = document.querySelector("#japan-estat-mode-list");
  const bank = document.querySelector(".map-mode-bank");
  if (!(layer instanceof HTMLElement) || !(map instanceof HTMLElement) || !(list instanceof HTMLElement) || !(bank instanceof HTMLElement)) return;

  canvas = document.createElement("canvas");
  canvas.id = "gaia-estat-canvas";
  canvas.className = "gaia-estat-canvas";
  canvas.hidden = true;
  canvas.setAttribute("aria-hidden", "true");
  context = canvas.getContext("2d", { alpha: true });
  map.append(canvas);

  markerLayer = document.createElement("div");
  markerLayer.className = "gaia-estat-markers";
  markerLayer.hidden = true;
  markerLayer.setAttribute("aria-label", "e-Stat 47都道府県データ地点");
  markerButtons = OBSERVATION_CITIES.map((city, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "gaia-estat-marker";
    button.dataset.estatPrefecture = city.code;
    button.innerHTML = `<i aria-hidden="true"></i><span><small>${city.code}</small>${city.prefecture}<b>—</b></span>`;
    button.addEventListener("pointerdown", (event) => event.stopPropagation());
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      selectPrefecture(index);
    });
    markerLayer.append(button);
    return button;
  });
  map.append(markerLayer);

  readout = document.createElement("section");
  readout.className = "gaia-estat-readout";
  readout.hidden = true;
  readout.setAttribute("aria-live", "polite");
  readout.innerHTML = `
    <button class="gaia-estat-return" type="button" data-estat-return><span>MAP 01—15</span><strong>地球展示へ戻る</strong></button>
    <div class="gaia-estat-chapter">
      <p>JAPAN / e-Stat · MONTHLY + ANNUAL</p>
      <div><button type="button" data-estat-step="-1" aria-label="前のe-Stat展示">‹</button><span><b data-estat-number>16</b><strong data-estat-title>人の潮目</strong></span><button type="button" data-estat-step="1" aria-label="次のe-Stat展示">›</button></div>
    </div>
    <div class="gaia-estat-place"><p>47 PREFECTURES / AUTO RELAY</p><strong data-estat-place>01 北海道</strong><small data-estat-city>札幌</small></div>
    <div class="gaia-estat-primary"><p data-estat-value-label>転入超過</p><strong data-estat-value>—</strong><span data-estat-unit>人</span></div>
    <div class="gaia-estat-timeline">
      <header><span>PERIOD / <b data-estat-period>2026 / 06</b></span><strong data-estat-frequency>e-Stat · 月次</strong></header>
      <input data-estat-month type="range" min="0" max="4" step="1" value="0" aria-label="表示月を選ぶ" />
      <div data-estat-months aria-hidden="true"></div>
    </div>
    <div class="gaia-estat-comparison"><span>都道府県順位<strong data-estat-rank>—</strong></span><span data-estat-delta-label>前月差<strong data-estat-delta>—</strong></span></div>
    <div class="gaia-estat-copy"><p data-estat-caption></p><small data-estat-guide></small></div>
    <a class="gaia-estat-source" data-estat-source href="https://www.e-stat.go.jp/" target="_blank" rel="noopener noreferrer">e-Stat</a>
  `;
  layer.append(readout);

  buttons = EXHIBITS.map((exhibit, index) => {
    const button = document.createElement("button");
    button.className = "map-mode-button";
    button.type = "button";
    button.textContent = exhibit.number;
    button.dataset.estatExhibit = exhibit.id;
    button.dataset.mapPreviewSurface = "map";
    button.setAttribute("aria-label", `${exhibit.number} ${exhibit.shortTitle}、e-Stat都道府県展示へ切り替える`);
    button.setAttribute("aria-describedby", "map-mode-preview");
    button.setAttribute("aria-current", "false");
    button.addEventListener("click", () => { void select(index); });
    list.append(button);
    return button;
  });

  bank.addEventListener("click", (event) => {
    const target = event.target instanceof Element ? event.target.closest(".map-mode-button") : null;
    if (!(target instanceof HTMLButtonElement) || target.dataset.estatExhibit || activeIndex < 0) return;
    deactivate();
  }, { capture: true });
  readout.querySelector("[data-estat-return]")?.addEventListener("click", () => document.querySelector("#japan-mode-list .map-mode-button")?.click());
  readout.querySelectorAll("[data-estat-step]").forEach((button) => button.addEventListener("click", () => {
    void select((activeIndex + Number(button.dataset.estatStep) + EXHIBITS.length) % EXHIBITS.length);
  }));
  readout.querySelector("[data-estat-month]")?.addEventListener("input", (event) => setMonth(Number(event.currentTarget.value)));
  addEventListener("resize", () => { if (activeIndex >= 0) draw(performance.now()); }, { passive: true });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) cancelAnimationFrame(frame);
    else if (activeIndex >= 0) frame = requestAnimationFrame(draw);
  });
  dispatchEvent(new CustomEvent("gaia:estat-exhibit-mounted"));
  void loadSeries();
};

if (globalThis.GaiaMapObservationAdapter) mount();
else addEventListener("gaia:map-adapter-ready", mount, { once: true });

globalThis.GaiaEstatExhibits = Object.freeze({
  definitions: EXHIBITS,
  select,
  deactivate,
  setMonth,
  setPeriod,
  selectPrefecture,
  getState: () => ({ activeIndex, selectedIndex, monthIndex: periodIndex, periodIndex, period: currentPeriod() }),
});

export { mount };
