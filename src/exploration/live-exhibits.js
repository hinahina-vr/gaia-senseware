import { STATUS_LABELS } from "./transforms.js";

const EXHIBITS = Object.freeze([
  Object.freeze({
    id: "wind-field",
    number: "10",
    title: "風脈 — WIND FIELD",
    shortTitle: "風脈",
    key: "windSpeed",
    accent: "#79f7ff",
    rgb: "121, 247, 255",
    fallback: 0.14,
    caption: "NOAAの風速を、ハワイ島を横切る流線の密度と速さへ変換します。",
  }),
  Object.freeze({
    id: "carbon-pulse",
    number: "11",
    title: "炭素の呼吸 — CARBON PULSE",
    shortTitle: "炭素の呼吸",
    key: "co2",
    accent: "#ffd06f",
    rgb: "255, 208, 111",
    fallback: 0.4,
    caption: "Mauna LoaのCO₂公開値を、島から広がる光環と呼吸周期へ変換します。",
  }),
  Object.freeze({
    id: "rain-chorus",
    number: "12",
    title: "雨の記憶 — RAIN CHORUS",
    shortTitle: "雨の記憶",
    key: "precipitation",
    accent: "#82bfff",
    rgb: "130, 191, 255",
    fallback: 0.08,
    caption: "JAXA GSMaPの領域平均降水量を、雨線と水面の波紋密度へ変換します。",
  }),
  Object.freeze({
    id: "no2-veil",
    number: "13",
    title: "大気の痕跡 — NO₂ VEIL",
    shortTitle: "大気の痕跡",
    key: "no2",
    accent: "#d49bff",
    rgb: "212, 155, 255",
    fallback: 0.16,
    caption: "Sentinel-5P NO₂をスペクトルの薄膜へ変換。欠測時は走査待機を明示します。",
  }),
]);

const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
let activeIndex = -1;
let layer = null;
let map = null;
let canvas = null;
let context = null;
let readout = null;
let buttons = [];
let frame = 0;
let savedHeading = null;

const formatValue = (measurement) => {
  if (!measurement || !Number.isFinite(Number(measurement.value))) return "欠測";
  const digits = measurement.key === "no2" ? 7 : measurement.key === "co2" ? 2 : 3;
  const unit = measurement.key === "co2" ? "ppm" : measurement.unit || "";
  return `${Number(measurement.value).toLocaleString("ja-JP", { maximumFractionDigits: digits })} ${unit}`.trim();
};

const currentState = () => globalThis.GaiaLiveData?.getState?.() || { measurements: {}, source: "snapshot", connected: false };
const currentMeasurement = (exhibit) => currentState().measurements?.[exhibit.key] || null;
const profile = () => globalThis.GaiaFrameBudgetGovernor?.getProfile?.() || { dprCap: 1, particleRatio: 0.65, level: "medium" };

const resizeCanvas = () => {
  const rect = canvas.getBoundingClientRect();
  const ratio = Math.max(1, Math.min(devicePixelRatio || 1, profile().dprCap || 1));
  const width = Math.max(1, Math.round(rect.width * ratio));
  const height = Math.max(1, Math.round(rect.height * ratio));
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  return { width: rect.width, height: rect.height };
};

const line = (points, color, width = 1) => {
  context.beginPath();
  points.forEach(([x, y], index) => index ? context.lineTo(x, y) : context.moveTo(x, y));
  context.strokeStyle = color;
  context.lineWidth = width;
  context.stroke();
};

const drawWind = (width, height, time, strength, ratio) => {
  const count = Math.max(24, Math.round((54 + strength * 66) * ratio));
  context.globalCompositeOperation = "screen";
  for (let index = 0; index < count; index += 1) {
    const seed = (index * 0.61803398875) % 1;
    const y = seed * height;
    const phase = time * (0.24 + strength * 0.72) + index * 0.47;
    const x = ((phase * 170 + seed * width * 1.3) % (width + 280)) - 140;
    const length = 90 + strength * 260 + (index % 7) * 8;
    const curve = Math.sin(seed * 18 + time * 0.7) * (20 + strength * 54);
    context.beginPath();
    context.moveTo(x - length, y - curve * 0.45);
    context.bezierCurveTo(x - length * 0.52, y + curve, x - length * 0.16, y - curve, x, y);
    context.strokeStyle = `rgba(121,247,255,${0.12 + (index % 5) * 0.045})`;
    context.lineWidth = index % 9 === 0 ? 2.2 : 0.8;
    context.stroke();
    context.fillStyle = `rgba(232,255,255,${0.24 + strength * 0.38})`;
    context.fillRect(x - 2, y - 1, 4 + strength * 5, 1.4);
  }
  line([[width * 0.12, height * 0.5], [width * 0.88, height * 0.5]], "rgba(121,247,255,.1)");
};

const drawCarbon = (width, height, time, strength, ratio) => {
  const x = width * 0.47;
  const y = height * 0.48;
  const pulse = 0.5 + 0.5 * Math.sin(time * (0.8 + strength * 1.6));
  const glow = context.createRadialGradient(x, y, 0, x, y, Math.min(width, height) * 0.46);
  glow.addColorStop(0, `rgba(255,225,138,${0.18 + pulse * 0.2})`);
  glow.addColorStop(0.3, "rgba(255,184,73,.08)");
  glow.addColorStop(1, "rgba(255,184,73,0)");
  context.fillStyle = glow;
  context.fillRect(0, 0, width, height);
  context.globalCompositeOperation = "screen";
  const rings = Math.max(7, Math.round(13 * ratio));
  for (let index = 0; index < rings; index += 1) {
    const progress = ((index / rings) + time * (0.035 + strength * 0.045)) % 1;
    const radius = 28 + progress * Math.min(width, height) * 0.48;
    context.beginPath();
    context.arc(x, y, radius, -Math.PI * 0.08, Math.PI * 1.72);
    context.strokeStyle = `rgba(255,208,111,${(1 - progress) * 0.34})`;
    context.lineWidth = index % 4 === 0 ? 2 : 0.8;
    context.stroke();
  }
  for (let ray = 0; ray < Math.round(28 * ratio); ray += 1) {
    const angle = ray / 28 * Math.PI * 2 + time * 0.025;
    const inner = 68 + (ray % 3) * 18;
    const outer = inner + 90 + strength * 190;
    line([[x + Math.cos(angle) * inner, y + Math.sin(angle) * inner], [x + Math.cos(angle) * outer, y + Math.sin(angle) * outer]], `rgba(255,208,111,${0.07 + (ray % 5) * 0.025})`);
  }
};

const drawRain = (width, height, time, strength, ratio) => {
  const count = Math.max(34, Math.round((72 + strength * 150) * ratio));
  context.globalCompositeOperation = "screen";
  for (let index = 0; index < count; index += 1) {
    const seedX = (index * 0.754877666) % 1;
    const seedY = (index * 0.569840291) % 1;
    const x = seedX * width + Math.sin(time * 0.3 + index) * 16;
    const y = ((seedY * height + time * (90 + strength * 340) + index * 9) % (height + 120)) - 60;
    const length = 18 + strength * 52 + (index % 5) * 4;
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(x - length * 0.22, y + length);
    context.strokeStyle = `rgba(130,191,255,${0.13 + (index % 6) * 0.045})`;
    context.lineWidth = index % 8 === 0 ? 1.8 : 0.75;
    context.stroke();
  }
  const rippleCount = Math.max(5, Math.round(11 * ratio));
  for (let index = 0; index < rippleCount; index += 1) {
    const phase = ((time * (0.28 + strength * 0.5) + index / rippleCount) % 1);
    const x = width * (0.18 + ((index * 0.37) % 0.58));
    const y = height * (0.57 + ((index * 0.21) % 0.28));
    context.beginPath();
    context.ellipse(x, y, 12 + phase * 72, 4 + phase * 24, 0, 0, Math.PI * 2);
    context.strokeStyle = `rgba(151,218,255,${(1 - phase) * 0.3})`;
    context.stroke();
  }
};

const drawNo2 = (width, height, time, strength, ratio, missing) => {
  const bands = Math.max(8, Math.round(18 * ratio));
  context.globalCompositeOperation = "screen";
  for (let band = 0; band < bands; band += 1) {
    const points = [];
    const base = height * (0.16 + band / bands * 0.68);
    for (let step = 0; step <= 48; step += 1) {
      const x = step / 48 * width;
      const y = base + Math.sin(step * 0.42 + band * 0.73 + time * (0.22 + strength)) * (18 + strength * 70);
      points.push([x, y]);
    }
    line(points, `rgba(${band % 3 === 0 ? "255,161,105" : "212,155,255"},${missing ? 0.08 : 0.1 + strength * 0.16})`, band % 5 === 0 ? 2 : 0.8);
  }
  const scanX = ((time * 92) % (width + 180)) - 90;
  const scan = context.createLinearGradient(scanX - 90, 0, scanX + 90, 0);
  scan.addColorStop(0, "rgba(212,155,255,0)");
  scan.addColorStop(0.5, `rgba(239,215,255,${missing ? 0.16 : 0.3})`);
  scan.addColorStop(1, "rgba(212,155,255,0)");
  context.fillStyle = scan;
  context.fillRect(scanX - 90, 0, 180, height);
};

const draw = (timestamp = performance.now()) => {
  cancelAnimationFrame(frame);
  frame = 0;
  if (activeIndex < 0 || !canvas || canvas.hidden) return;
  const exhibit = EXHIBITS[activeIndex];
  const measurement = currentMeasurement(exhibit);
  const missing = !measurement || !Number.isFinite(Number(measurement.value));
  const strength = missing ? exhibit.fallback : Math.max(0, Math.min(1, Number(measurement.normalized) || 0));
  const { width, height } = resizeCanvas();
  context.clearRect(0, 0, width, height);
  const wash = context.createRadialGradient(width * 0.48, height * 0.48, 0, width * 0.48, height * 0.48, Math.max(width, height) * 0.7);
  wash.addColorStop(0, `rgba(${exhibit.rgb},.08)`);
  wash.addColorStop(1, "rgba(1,7,12,.02)");
  context.fillStyle = wash;
  context.fillRect(0, 0, width, height);
  const time = reducedMotion ? 2.4 : timestamp / 1000;
  const particleRatio = profile().particleRatio || 0.25;
  if (exhibit.id === "wind-field") drawWind(width, height, time, strength, particleRatio);
  else if (exhibit.id === "carbon-pulse") drawCarbon(width, height, time, strength, particleRatio);
  else if (exhibit.id === "rain-chorus") drawRain(width, height, time, strength, particleRatio);
  else drawNo2(width, height, time, strength, particleRatio, missing);
  context.globalCompositeOperation = "source-over";
  if (!reducedMotion && !document.hidden && profile().level !== "static" && !layer.hidden) frame = requestAnimationFrame(draw);
};

const renderReadout = () => {
  if (activeIndex < 0 || !readout) return;
  const exhibit = EXHIBITS[activeIndex];
  const state = currentState();
  const measurement = currentMeasurement(exhibit);
  const missing = !measurement || !Number.isFinite(Number(measurement.value));
  const status = STATUS_LABELS[measurement?.status] || (state.connected ? "NEAR REAL TIME" : "SNAPSHOT");
  readout.dataset.missing = String(missing);
  readout.querySelector("[data-live-exhibit-kicker]").textContent = `${exhibit.number} / ${status}`;
  readout.querySelector("[data-live-exhibit-title]").textContent = exhibit.title;
  readout.querySelector("[data-live-exhibit-value]").textContent = formatValue(measurement);
  readout.querySelector("[data-live-exhibit-caption]").textContent = exhibit.caption;
  readout.querySelector("[data-live-exhibit-source]").textContent = measurement
    ? `${measurement.provider?.toUpperCase() || "SOURCE"} · ${measurement.datasetId || "PUBLIC DATA"}`
    : "SOURCE DATA MISSING · VISUAL SCAN STANDBY";
  readout.querySelector("[data-live-exhibit-time]").textContent = measurement?.observedAt
    ? new Date(measurement.observedAt).toLocaleString("ja-JP")
    : "観測時刻なし";
};

const applyHeading = () => {
  if (activeIndex < 0) return;
  const exhibit = EXHIBITS[activeIndex];
  layer.style.setProperty("--map-accent", exhibit.accent);
  layer.style.setProperty("--map-accent-rgb", exhibit.rgb);
  document.querySelector("#japan-mode-number").textContent = exhibit.number;
  document.querySelector("#japan-mode-title").textContent = exhibit.shortTitle;
  buttons.forEach((button, index) => button.setAttribute("aria-current", String(index === activeIndex)));
  document.querySelectorAll("#japan-mode-list .map-mode-button:not([data-live-exhibit])").forEach((button) => button.setAttribute("aria-current", "false"));
};

const select = (index) => {
  if (!EXHIBITS[index]) return;
  if (activeIndex < 0) {
    savedHeading = {
      number: document.querySelector("#japan-mode-number")?.textContent || "01",
      title: document.querySelector("#japan-mode-title")?.textContent || "地球の一呼吸",
    };
  }
  activeIndex = index;
  layer.classList.add("is-live-exhibit");
  layer.dataset.liveExhibit = EXHIBITS[index].id;
  canvas.hidden = false;
  readout.hidden = false;
  applyHeading();
  renderReadout();
  draw();
  dispatchEvent(new CustomEvent("gaia:live-exhibit-change", { detail: { index, id: EXHIBITS[index].id } }));
};

const deactivate = ({ number, title } = {}) => {
  if (activeIndex < 0) return;
  activeIndex = -1;
  cancelAnimationFrame(frame);
  frame = 0;
  layer.classList.remove("is-live-exhibit");
  delete layer.dataset.liveExhibit;
  canvas.hidden = true;
  readout.hidden = true;
  buttons.forEach((button) => button.setAttribute("aria-current", "false"));
  layer.style.removeProperty("--map-accent");
  layer.style.removeProperty("--map-accent-rgb");
  const restored = number && title ? { number, title } : savedHeading;
  if (restored) {
    document.querySelector("#japan-mode-number").textContent = restored.number;
    document.querySelector("#japan-mode-title").textContent = restored.title;
  }
  savedHeading = null;
  dispatchEvent(new CustomEvent("gaia:live-exhibit-change", { detail: { index: -1, id: null } }));
};

const mount = () => {
  if (document.querySelector("#gaia-live-exhibit-canvas")) return;
  layer = document.querySelector("#japan-layer");
  map = document.querySelector("#japan-map");
  const list = document.querySelector("#japan-mode-list");
  if (!(layer instanceof HTMLElement) || !(map instanceof HTMLElement) || !(list instanceof HTMLElement)) return;

  canvas = document.createElement("canvas");
  canvas.id = "gaia-live-exhibit-canvas";
  canvas.className = "gaia-live-exhibit-canvas";
  canvas.hidden = true;
  canvas.setAttribute("aria-hidden", "true");
  context = canvas.getContext("2d", { alpha: true });
  map.append(canvas);

  readout = document.createElement("section");
  readout.className = "gaia-live-exhibit-readout";
  readout.hidden = true;
  readout.setAttribute("aria-live", "polite");
  readout.innerHTML = `<p data-live-exhibit-kicker></p><h3 data-live-exhibit-title></h3><strong data-live-exhibit-value></strong><p data-live-exhibit-caption></p><footer><span data-live-exhibit-source></span><time data-live-exhibit-time></time></footer>`;
  layer.append(readout);

  buttons = EXHIBITS.map((exhibit, index) => {
    const button = document.createElement("button");
    button.className = "map-mode-button";
    button.type = "button";
    button.textContent = exhibit.number;
    button.dataset.liveExhibit = exhibit.id;
    button.setAttribute("aria-label", `${exhibit.number} ${exhibit.shortTitle}のライブ観測演出へ切り替える`);
    button.setAttribute("aria-current", "false");
    button.addEventListener("click", () => select(index));
    list.append(button);
    return button;
  });

  list.addEventListener("click", (event) => {
    const button = event.target instanceof Element ? event.target.closest(".map-mode-button:not([data-live-exhibit])") : null;
    if (!(button instanceof HTMLButtonElement) || activeIndex < 0) return;
    const standards = [...list.querySelectorAll(".map-mode-button:not([data-live-exhibit])")];
    const index = standards.indexOf(button);
    const mode = globalThis.GaiaAppContent?.modes?.[index];
    deactivate({ number: String(index + 1).padStart(2, "0"), title: mode?.titleJa || button.getAttribute("aria-label") || "展示" });
  });

  addEventListener("gaia:live-update", () => {
    renderReadout();
    if (activeIndex >= 0 && !frame) draw();
  });
  addEventListener("gaia:japan-mode-change", () => {
    if (activeIndex < 0) return;
    savedHeading = {
      number: document.querySelector("#japan-mode-number")?.textContent || savedHeading?.number,
      title: document.querySelector("#japan-mode-title")?.textContent || savedHeading?.title,
    };
    queueMicrotask(applyHeading);
  });
  addEventListener("gaia:lodchange", () => { if (activeIndex >= 0) draw(); });
  addEventListener("resize", () => { if (activeIndex >= 0) draw(); }, { passive: true });
  document.addEventListener("visibilitychange", () => { if (!document.hidden && activeIndex >= 0) draw(); });
};

if (globalThis.GaiaMapObservationAdapter) mount();
else addEventListener("gaia:map-adapter-ready", mount, { once: true });

globalThis.GaiaLiveExhibits = Object.freeze({ mount, select, deactivate, definitions: EXHIBITS });

export { mount };
