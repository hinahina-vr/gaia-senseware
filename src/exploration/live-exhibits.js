import { STATUS_LABELS } from "./transforms.js";
import proceduralAudio from "./procedural-audio.js?v=gaia-live-compact-jpt-audio-1";

const EXHIBITS = Object.freeze([
  Object.freeze({
    id: "wind-field",
    number: "09",
    title: "風脈 — WIND FIELD",
    shortTitle: "風脈",
    key: "windSpeed",
    accent: "#79f7ff",
    rgb: "121, 247, 255",
    fallback: 0.14,
    caption: "NOAAの風速を、ハワイ島を横切る流線の密度と速さへ変換します。",
    signalLabel: "風速",
    scaleLabel: "0—45 m/sを0—100%へ正規化",
    location: Object.freeze({ lon: -155.056, lat: 19.73, label: "NDBC ILOH1 / ハワイ島東岸" }),
    visualCue: "流線",
    visualMap: "風速が高いほど、流線の本数・移動速度・光量が増えます。",
    soundMap: "風速が高いほど、テンポ・高域・風の粒子音が増えます。",
  }),
  Object.freeze({
    id: "carbon-pulse",
    number: "10",
    title: "炭素の呼吸 — CARBON PULSE",
    shortTitle: "炭素の呼吸",
    key: "co2",
    accent: "#ffd06f",
    rgb: "255, 208, 111",
    fallback: 0.4,
    caption: "Mauna LoaのCO₂公開値を、島から広がる光環と呼吸周期へ変換します。",
    signalLabel: "CO₂濃度",
    scaleLabel: "280—650 ppmを0—100%へ正規化",
    location: Object.freeze({ lon: -155.576, lat: 19.536, label: "Mauna Loa Observatory / ハワイ島" }),
    visualCue: "光環",
    visualMap: "CO₂濃度が高いほど、光環の呼吸が速まり、余韻が広がります。",
    soundMap: "CO₂濃度を、maj7和音の呼吸周期と微細な音程変化へ変えます。",
  }),
  Object.freeze({
    id: "rain-chorus",
    number: "11",
    title: "雨の記憶 — RAIN CHORUS",
    shortTitle: "雨の記憶",
    key: "precipitation",
    accent: "#82bfff",
    rgb: "130, 191, 255",
    fallback: 0.08,
    caption: "JAXA GSMaPの領域平均降水量を、雨線と水面の波紋密度へ変換します。",
    signalLabel: "領域平均降水量",
    scaleLabel: "0—30 mm/hrを0—100%へ正規化",
    location: Object.freeze({ lon: -155.45, lat: 19.55, label: "JAXA GSMaP / ハワイ固定範囲" }),
    visualCue: "雨と波紋",
    visualMap: "降水量が多いほど、雨線と水面の波紋が密に発生します。",
    soundMap: "降水量を、音符密度・水滴の明るさ・残響の深さへ変えます。",
  }),
  Object.freeze({
    id: "no2-veil",
    number: "12",
    title: "大気の痕跡 — NO₂ VEIL",
    shortTitle: "大気の痕跡",
    key: "no2",
    accent: "#d49bff",
    rgb: "212, 155, 255",
    fallback: 0.16,
    caption: "Sentinel-5P NO₂をスペクトルの薄膜へ変換。欠測時は走査待機を明示します。",
    signalLabel: "NO₂鉛直カラム",
    scaleLabel: "0—0.0003 mol/m²を0—100%へ正規化",
    location: Object.freeze({ lon: -155.45, lat: 19.55, label: "Sentinel-5P / ハワイ固定範囲" }),
    visualCue: "大気の膜",
    visualMap: "NO₂が高いほど薄膜の明度と揺らぎが増え、欠測時は走査線だけが残ります。",
    soundMap: "NO₂を共鳴と高域の薄膜へ変換し、欠測時は疎らな待機和音にします。",
  }),
]);

const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const EXHIBIT_COLORS = new Map(EXHIBITS.map((exhibit) => [
  exhibit.id,
  new Float32Array(exhibit.rgb.split(",").map((channel) => Number(channel.trim()) / 255)),
]));
let activeIndex = -1;
let layer = null;
let map = null;
let canvas = null;
let context = null;
let webglRenderer = null;
let readout = null;
let mobileReadoutToggle = null;
let anchorMarker = null;
let buttons = [];
let frame = 0;
let lastRenderedAt = 0;
let savedHeading = null;
const LIGHT_TOUCH_CAPACITY = 8;
let lightTouches = [];
let lightPointer = { x: 0.5, y: 0.5, active: 0, energy: 0, down: false, lastX: 0.5, lastY: 0.5 };
let lastLightTrailAt = 0;

const setMobileReadoutExpanded = (expanded) => {
  const shouldExpand = Boolean(expanded && (innerWidth <= 720 || (innerHeight <= 520 && matchMedia("(pointer: coarse)").matches)));
  readout?.classList.toggle("is-mobile-expanded", shouldExpand);
  mobileReadoutToggle?.setAttribute("aria-expanded", String(shouldExpand));
  mobileReadoutToggle?.querySelector("strong")?.replaceChildren(shouldExpand ? "閉じる" : "詳細");
};

const formatValue = (measurement) => {
  if (!measurement || !Number.isFinite(Number(measurement.value))) return "欠測";
  const digits = measurement.key === "no2" ? 7 : measurement.key === "co2" ? 2 : 3;
  const unit = measurement.key === "co2" ? "ppm" : measurement.unit || "";
  return `${Number(measurement.value).toLocaleString("ja-JP", { maximumFractionDigits: digits })} ${unit}`.trim();
};

const formatJptDateTime = (value) => {
  if (!value) return "観測時刻なし";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return `${String(value)} JPT`;
  return `${new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).format(date)} JPT`;
};

const currentState = () => globalThis.GaiaLiveData?.getState?.() || { measurements: {}, source: "snapshot", connected: false };
const currentMeasurement = (exhibit) => currentState().measurements?.[exhibit.key] || null;
const profile = () => globalThis.GaiaFrameBudgetGovernor?.getProfile?.() || { dprCap: 1, particleRatio: 0.65, level: "medium" };
const clamp01 = (value) => Math.max(0, Math.min(1, value));
const wrapLongitude = (longitude) => ((longitude + 540) % 360) - 180;

const observationLocation = (exhibit, measurement) => {
  const location = measurement?.location;
  const lon = Number(location?.lon);
  const lat = Number(location?.lat);
  return {
    lon: Number.isFinite(lon) ? lon : exhibit.location.lon,
    lat: Number.isFinite(lat) ? lat : exhibit.location.lat,
    label: location?.label || exhibit.location.label,
  };
};

const projectSceneAnchor = (location) => {
  const rect = canvas?.getBoundingClientRect();
  if (!rect?.width || !rect?.height) return { scene: [0.4, 0.12], normalized: [0.7, 0.42] };
  const overlay = document.querySelector("#japan-overlay");
  const zoom = Math.max(1, Number(overlay?.dataset.earthZoom) || 1);
  const offsetX = Number(overlay?.dataset.earthOffsetX) || 0;
  const offsetY = Number(overlay?.dataset.earthOffsetY) || 0;
  const scale = Math.max(rect.width / 360, rect.height / 180) * zoom;
  const worldWidth = 360 * scale;
  const worldHeight = 180 * scale;
  const originX = (rect.width - worldWidth) / 2 + offsetX;
  const originY = (rect.height - worldHeight) / 2 + offsetY;
  const mapLongitude = wrapLongitude(location.lon - 138) + 180;
  const screenX = originX + mapLongitude * scale;
  const screenY = originY + (90 - location.lat) * scale;
  const minimumDimension = Math.max(1, Math.min(rect.width, rect.height));
  return {
    normalized: [screenX / rect.width, screenY / rect.height],
    scene: [
      (screenX * 2 - rect.width) / minimumDimension,
      (rect.height - screenY * 2) / minimumDimension,
    ],
  };
};

const lightTouchUniform = (timestamp) => {
  lightTouches = lightTouches.filter((touch) => timestamp - touch.startedAt < 3100);
  const values = new Float32Array(LIGHT_TOUCH_CAPACITY * 4);
  lightTouches.slice(-LIGHT_TOUCH_CAPACITY).forEach((touch, index) => {
    values[index * 4] = touch.x;
    values[index * 4 + 1] = touch.y;
    values[index * 4 + 2] = Math.max(0, (timestamp - touch.startedAt) / 1000);
    values[index * 4 + 3] = touch.strength;
  });
  return values;
};

const addLightTouch = (x, y, strength = 1) => {
  const normalizedX = clamp01(x);
  const normalizedY = clamp01(y);
  lightTouches.push({ x: normalizedX, y: normalizedY, strength, startedAt: performance.now() });
  if (lightTouches.length > LIGHT_TOUCH_CAPACITY) lightTouches.splice(0, lightTouches.length - LIGHT_TOUCH_CAPACITY);
  if (canvas) canvas.dataset.lightTouchCount = String(lightTouches.length);
  const exhibit = EXHIBITS[activeIndex];
  const measurement = exhibit ? currentMeasurement(exhibit) : null;
  if (exhibit) {
    dispatchEvent(new CustomEvent("gaia:live-touch", {
      detail: {
        id: exhibit.id,
        key: exhibit.key,
        x: normalizedX,
        y: normalizedY,
        strength,
        normalized: Number.isFinite(Number(measurement?.normalized)) ? Number(measurement.normalized) : exhibit.fallback,
      },
    }));
  }
};

const updateLightPointer = (event, { touch = false } = {}) => {
  if (activeIndex < 0 || !map) return;
  const rect = map.getBoundingClientRect();
  if (!rect.width || !rect.height) return;
  const x = clamp01((event.clientX - rect.left) / rect.width);
  const y = clamp01((event.clientY - rect.top) / rect.height);
  const distance = Math.hypot(x - lightPointer.lastX, y - lightPointer.lastY);
  lightPointer.x = x;
  lightPointer.y = y;
  lightPointer.active = 1;
  lightPointer.energy = Math.min(1.35, Math.max(lightPointer.energy, 0.26 + distance * 16));
  lightPointer.lastX = x;
  lightPointer.lastY = y;
  const now = performance.now();
  if (touch || (lightPointer.down && distance > 0.008 && now - lastLightTrailAt > 72)) {
    addLightTouch(x, y, touch ? 1.3 : Math.min(1.05, 0.56 + distance * 12));
    lastLightTrailAt = now;
  }
};

const WEBGL_VERTEX_SOURCE = `
  attribute vec2 a_position;
  varying vec2 v_uv;
  void main() {
    v_uv = a_position * 0.5 + 0.5;
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const WEBGL_FRAGMENT_SOURCE = `
  varying vec2 v_uv;
  uniform vec2 u_resolution;
  uniform float u_time;
  uniform float u_mode;
  uniform float u_strength;
  uniform float u_missing;
  uniform vec3 u_accent;
  uniform vec2 u_anchor;
  uniform vec4 u_pointer;
  uniform vec4 u_touches[8];

  float hash21(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float noise21(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash21(i), hash21(i + vec2(1.0, 0.0)), f.x),
      mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0)), f.x),
      f.y
    );
  }

  mat2 rotate2d(float angle) {
    float s = sin(angle);
    float c = cos(angle);
    return mat2(c, -s, s, c);
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.52;
    mat2 turn = rotate2d(0.57);
    for (int octave = 0; octave < 4; octave += 1) {
      value += amplitude * noise21(p);
      p = turn * p * 2.03 + vec2(7.1, 3.7);
      amplitude *= 0.49;
    }
    return value;
  }

  float softLine(float distanceToLine, float width) {
    return 1.0 - smoothstep(width, width * 2.8, distanceToLine);
  }

  vec2 normalizedToScene(vec2 normalizedPoint) {
    vec2 pixelPoint = vec2(normalizedPoint.x, 1.0 - normalizedPoint.y) * u_resolution;
    return (pixelPoint * 2.0 - u_resolution) / max(1.0, min(u_resolution.x, u_resolution.y));
  }

  void lightTouchField(vec2 p, out float bloomField, out float ringField) {
    bloomField = 0.0;
    ringField = 0.0;
    for (int index = 0; index < 8; index += 1) {
      vec4 touch = u_touches[index];
      float life = 1.0 - smoothstep(0.08, 3.1, touch.z);
      vec2 local = p - normalizedToScene(touch.xy);
      float bloom = exp(-dot(local, local) * (28.0 + touch.z * 8.0));
      float ringRadius = touch.z * (0.21 + touch.w * 0.055);
      float ring = softLine(abs(length(local) - ringRadius), 0.014 + touch.z * 0.006);
      bloomField += bloom * life * touch.w * 0.34;
      ringField += ring * life * touch.w * 0.2;
    }
    if (u_pointer.z > 0.0) {
      vec2 local = p - normalizedToScene(u_pointer.xy);
      bloomField += exp(-dot(local, local) * 25.0) * (0.34 + u_pointer.w * 0.28);
      ringField += softLine(abs(length(local) - 0.075), 0.014) * (0.1 + u_pointer.w * 0.08);
    }
  }

  vec3 windField(vec2 p, vec2 signalSpace, float fieldA, float fieldB, float phase, out float energy) {
    vec2 flow = rotate2d(-0.035) * (signalSpace - u_anchor);
    float velocity = 0.72 + u_strength * 2.1;
    float density = mix(7.0, 18.0, u_strength);
    float corridorCenter = 0.11 * sin(flow.x * 1.75 - phase * 0.34 * velocity + fieldB * 2.1);
    float relativeY = flow.y - corridorCenter;
    float corridor = exp(-pow(abs(relativeY) / 0.36, 2.0));
    float streamPhase = relativeY * density * 6.283
      + sin(flow.x * 2.4 - phase * velocity + fieldA * 3.0) * 0.72;
    float streamlineA = smoothstep(0.91, 0.997, 0.5 + 0.5 * cos(streamPhase));
    float streamlineB = smoothstep(0.93, 0.998, 0.5 + 0.5 * cos(streamPhase * 1.62 + fieldB * 5.0));
    float islandWake = softLine(abs(relativeY + 0.055 * sin(flow.x * 4.2 - phase * velocity)), 0.026);
    islandWake *= exp(-0.18 * flow.x * flow.x);
    float sourceHalo = softLine(abs(length(flow * vec2(1.0, 1.32)) - 0.07), 0.013)
      + exp(-48.0 * dot(flow, flow));
    energy = corridor * (streamlineA * 0.76 + streamlineB * 0.36)
      + islandWake * 0.72 + sourceHalo * 0.88;
    vec3 ice = vec3(0.84, 0.98, 1.0);
    vec3 cobalt = vec3(0.12, 0.46, 1.0);
    return mix(cobalt, mix(u_accent, ice, 0.54), clamp(fieldA + sourceHalo * 0.38, 0.0, 1.0));
  }

  vec3 carbonField(vec2 p, vec2 signalSpace, float fieldA, float fieldB, float phase, out float energy) {
    vec2 breathSpace = signalSpace - u_anchor + vec2(fieldA - 0.5, fieldB - 0.5) * 0.075;
    float radius = length(breathSpace * vec2(0.84, 1.08));
    float breathRate = 0.64 + u_strength * 1.06;
    float membraneA = smoothstep(0.78, 0.995, 0.5 + 0.5 * cos(radius * 15.2 - phase * breathRate + fieldA * 1.5));
    float membraneB = smoothstep(0.82, 0.997, 0.5 + 0.5 * cos(radius * 23.4 - phase * breathRate * 1.24 - fieldB * 1.8));
    float respiration = exp(-7.0 * dot(breathSpace, breathSpace)) * (0.7 + 0.3 * sin(phase * breathRate));
    float exchangeVein = smoothstep(0.7, 0.96, 0.5 + 0.5 * sin((breathSpace.x - breathSpace.y) * 4.2 + fieldA * 4.0 - phase * 0.36));
    exchangeVein *= smoothstep(0.36, 0.78, fieldB);
    float sourceCore = exp(-58.0 * dot(breathSpace, breathSpace));
    energy = membraneA * 0.5 + membraneB * 0.27 + respiration * 0.72
      + exchangeVein * 0.16 + sourceCore * 1.1;
    vec3 amberMemory = vec3(1.0, 0.56, 0.19);
    vec3 pearl = vec3(1.0, 0.96, 0.72);
    return mix(amberMemory, pearl, clamp(respiration + sourceCore + fieldA * 0.38, 0.0, 1.0));
  }

  vec3 rainField(vec2 p, vec2 signalSpace, float fieldA, float fieldB, float phase, out float energy) {
    vec2 waterSpace = rotate2d(-0.11) * signalSpace;
    float density = mix(12.0, 34.0, u_strength);
    float fallSpeed = 1.3 + u_strength * 2.4;
    float streakCoordinate = (waterSpace.x + waterSpace.y * 0.075 + fieldA * 0.055) * density * 6.283;
    float rainLines = smoothstep(0.925, 0.999, 0.5 + 0.5 * cos(streakCoordinate));
    float dropGate = smoothstep(0.42, 0.78, fbm(vec2(
      floor((waterSpace.x + 2.4) * density * 0.34),
      waterSpace.y * 0.62 + phase * fallSpeed
    )));
    rainLines *= 0.32 + dropGate * 0.86;
    vec2 poolA = waterSpace - (u_anchor + vec2(-0.12, -0.34));
    vec2 poolB = waterSpace - (u_anchor + vec2(0.34, -0.22));
    vec2 poolC = waterSpace - (u_anchor + vec2(-0.42, -0.15));
    float radiusA = length(poolA * vec2(0.72, 2.15));
    float radiusB = length(poolB * vec2(0.72, 2.15));
    float radiusC = length(poolC * vec2(0.72, 2.15));
    float rippleA = smoothstep(0.86, 0.998, 0.5 + 0.5 * cos(radiusA * 24.0 - phase * 1.55));
    float rippleB = smoothstep(0.88, 0.998, 0.5 + 0.5 * cos(radiusB * 28.0 - phase * 1.34 + 1.8));
    float rippleC = smoothstep(0.89, 0.999, 0.5 + 0.5 * cos(radiusC * 31.0 - phase * 1.72 + 3.2));
    float ripple = rippleA * exp(-0.82 * radiusA)
      + rippleB * exp(-0.88 * radiusB)
      + rippleC * exp(-0.92 * radiusC);
    energy = rainLines * 0.82 + ripple * (0.42 + u_strength * 0.32);
    vec3 deepWater = vec3(0.06, 0.31, 0.88);
    vec3 rainLight = vec3(0.62, 0.93, 1.0);
    return mix(deepWater, rainLight, clamp(rainLines * 0.82 + ripple * 0.56 + fieldB * 0.2, 0.0, 1.0));
  }

  vec3 no2Field(vec2 p, vec2 signalSpace, float fieldA, float fieldB, float phase, out float energy) {
    vec2 veilSpace = rotate2d(0.16) * signalSpace;
    veilSpace += vec2(fieldA - 0.5, fieldB - 0.5) * 0.2;
    float spectrumA = smoothstep(0.67, 0.96, 0.5 + 0.5 * sin(veilSpace.y * 6.4 + veilSpace.x * 1.8 + fieldA * 4.2 - phase * 0.46));
    float spectrumB = smoothstep(0.72, 0.98, 0.5 + 0.5 * sin(veilSpace.y * 11.2 - veilSpace.x * 1.1 - fieldB * 3.8 - phase * 0.72));
    float spectralVeil = smoothstep(0.34, 0.82, fieldA * 0.56 + fieldB * 0.54);
    float scan = exp(-18.0 * abs(veilSpace.x - 0.56 * sin(phase * 0.19))) * (0.58 + spectralVeil * 0.42);
    float trace = softLine(abs(veilSpace.y + 0.28 * sin(veilSpace.x * 2.4 - phase * 0.31)), 0.065);
    energy = spectralVeil * (spectrumA * 0.48 + spectrumB * 0.38) + scan * 0.58 + trace * 0.26;
    vec3 violet = vec3(0.54, 0.28, 1.0);
    vec3 ionBlue = vec3(0.28, 0.72, 1.0);
    vec3 spectralWhite = vec3(0.92, 0.91, 1.0);
    return mix(mix(violet, ionBlue, fieldA), spectralWhite, clamp(scan + spectrumA * 0.28, 0.0, 1.0));
  }

  void main() {
    vec2 p = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / max(1.0, min(u_resolution.x, u_resolution.y));
    float phase = u_time * (0.42 + u_strength * 0.62) + u_mode * 3.7;
    vec2 drift = vec2(u_time * 0.08, -u_time * 0.052);
    float fieldA = fbm(p * vec2(1.28, 1.72) + drift + vec2(u_mode * 4.1, 1.7));
    float fieldB = fbm(rotate2d(0.66) * p * vec2(2.12, 1.2) - drift * 0.78 + vec2(7.3, u_mode * 5.2));
    vec2 signalSpace = p + vec2(fieldA - 0.5, fieldB - 0.5) * (0.22 + u_strength * 0.12);
    float ambient = smoothstep(0.28, 0.82, fieldA * 0.62 + fieldB * 0.46);
    float energy = 0.0;
    vec3 fieldColor;
    if (u_mode < 0.5) fieldColor = windField(p, signalSpace, fieldA, fieldB, phase, energy);
    else if (u_mode < 1.5) fieldColor = carbonField(p, signalSpace, fieldA, fieldB, phase, energy);
    else if (u_mode < 2.5) fieldColor = rainField(p, signalSpace, fieldA, fieldB, phase, energy);
    else fieldColor = no2Field(p, signalSpace, fieldA, fieldB, phase, energy);

    float touchBloom = 0.0;
    float touchRing = 0.0;
    lightTouchField(p, touchBloom, touchRing);
    float center = exp(-1.7 * dot(p * vec2(0.78, 0.94), p * vec2(0.78, 0.94)));
    float response = 0.56 + u_strength * 0.72;
    float missingPulse = u_missing * (0.5 + 0.5 * sin(u_time * 0.72));
    vec3 color = fieldColor * (energy * response + ambient * 0.08 + center * 0.05);
    color += mix(u_accent, vec3(0.82, 0.96, 1.0), 0.52) * center * (0.04 + u_strength * 0.08);
    color += vec3(0.62, 0.82, 1.0) * missingPulse * softLine(abs(signalSpace.x), 0.018) * 0.16;
    color += mix(u_accent, vec3(0.94, 1.0, 1.0), 0.72) * (touchBloom * 1.16 + touchRing * 0.9);
    color = vec3(1.0) - exp(-color * 1.62);
    color = pow(max(color, 0.0), vec3(0.82));
    float alpha = clamp(ambient * 0.08 + energy * (0.54 + u_strength * 0.24)
      + center * 0.035 + touchBloom * 0.72 + touchRing * 0.48, 0.02, 0.9);
    alpha *= mix(1.0, 0.58, u_missing);
    gl_FragColor = vec4(color, alpha);
  }
`;

const createWebGLRenderer = (targetCanvas) => {
  let gl;
  try {
    gl = targetCanvas.getContext("webgl", {
      alpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      premultipliedAlpha: false,
      powerPreference: "high-performance",
    });
  } catch {
    gl = null;
  }
  if (!gl) return null;
  const highPrecision = gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT)?.precision > 0;
  const compile = (type, source) => {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
    gl.deleteShader(shader);
    return null;
  };
  const vertex = compile(gl.VERTEX_SHADER, WEBGL_VERTEX_SOURCE);
  const fragment = compile(gl.FRAGMENT_SHADER, `precision ${highPrecision ? "highp" : "mediump"} float;\n${WEBGL_FRAGMENT_SOURCE}`);
  if (!vertex || !fragment) return null;
  const program = gl.createProgram();
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    return null;
  }
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  gl.useProgram(program);
  const position = gl.getAttribLocation(program, "a_position");
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  const uniforms = Object.fromEntries([
    "u_resolution", "u_time", "u_mode", "u_strength", "u_missing", "u_accent", "u_anchor", "u_pointer",
  ].map((name) => [name, gl.getUniformLocation(program, name)]));
  uniforms.u_touches = gl.getUniformLocation(program, "u_touches[0]");
  let renderCount = 0;
  return Object.freeze({
    gl,
    resize(width, height) { gl.viewport(0, 0, width, height); },
    render({ time, mode, strength, missing, accent, anchor, pointer, touches }) {
      gl.useProgram(program);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(uniforms.u_resolution, targetCanvas.width, targetCanvas.height);
      gl.uniform1f(uniforms.u_time, time);
      gl.uniform1f(uniforms.u_mode, mode);
      gl.uniform1f(uniforms.u_strength, strength);
      gl.uniform1f(uniforms.u_missing, missing ? 1 : 0);
      gl.uniform3fv(uniforms.u_accent, accent);
      gl.uniform2f(uniforms.u_anchor, anchor[0], anchor[1]);
      gl.uniform4f(uniforms.u_pointer, pointer.x, pointer.y, pointer.active, pointer.energy);
      gl.uniform4fv(uniforms.u_touches, touches);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      renderCount += 1;
      targetCanvas.dataset.webglFrame = String(renderCount);
      targetCanvas.dataset.webglMode = String(mode);
      targetCanvas.dataset.webglStrength = strength.toFixed(4);
      targetCanvas.dataset.anchorSceneX = anchor[0].toFixed(4);
      targetCanvas.dataset.anchorSceneY = anchor[1].toFixed(4);
    },
    destroy() {
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    },
  });
};

const resizeCanvas = () => {
  const rect = canvas.getBoundingClientRect();
  const currentProfile = profile();
  const quality = webglRenderer
    ? currentProfile.level === "high" ? 0.9 : currentProfile.level === "medium" ? 0.72 : 0.56
    : 1;
  const ratio = Math.max(0.5, Math.min(devicePixelRatio || 1, currentProfile.dprCap || 1) * quality);
  const targetWidth = Math.max(1, Math.round(rect.width * ratio));
  const targetHeight = Math.max(1, Math.round(rect.height * ratio));
  const renderScale = Math.min(1, 1600 / targetWidth, 1000 / targetHeight);
  const width = Math.max(1, Math.round(targetWidth * renderScale));
  const height = Math.max(1, Math.round(targetHeight * renderScale));
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
    webglRenderer?.resize(width, height);
  }
  if (context) context.setTransform(width / Math.max(1, rect.width), 0, 0, height / Math.max(1, rect.height), 0, 0);
  return { width: rect.width, height: rect.height };
};

const line = (points, color, width = 1) => {
  context.beginPath();
  points.forEach(([x, y], index) => index ? context.lineTo(x, y) : context.moveTo(x, y));
  context.strokeStyle = color;
  context.lineWidth = width;
  context.stroke();
};

const drawWind = (width, height, time, strength, ratio, anchor) => {
  const count = Math.max(24, Math.round((54 + strength * 66) * ratio));
  const anchorX = anchor[0] * width;
  const anchorY = anchor[1] * height;
  context.globalCompositeOperation = "screen";
  for (let index = 0; index < count; index += 1) {
    const seed = (index * 0.61803398875) % 1;
    const y = index % 6 === 0 ? seed * height : anchorY + (seed - 0.5) * height * 0.38;
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
  }
  const sourceGlow = context.createRadialGradient(anchorX, anchorY, 0, anchorX, anchorY, 74 + strength * 80);
  sourceGlow.addColorStop(0, "rgba(228,255,255,.34)");
  sourceGlow.addColorStop(0.22, "rgba(121,247,255,.16)");
  sourceGlow.addColorStop(1, "rgba(121,247,255,0)");
  context.fillStyle = sourceGlow;
  context.fillRect(anchorX - 170, anchorY - 170, 340, 340);
  line([[width * 0.08, anchorY], [width * 0.94, anchorY]], "rgba(121,247,255,.12)");
};

const drawCarbon = (width, height, time, strength, ratio, anchor) => {
  const x = anchor[0] * width;
  const y = anchor[1] * height;
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

const drawRain = (width, height, time, strength, ratio, anchor) => {
  const count = Math.max(34, Math.round((72 + strength * 150) * ratio));
  const anchorX = anchor[0] * width;
  const anchorY = anchor[1] * height;
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
    const x = anchorX + (((index * 0.37) % 1) - 0.5) * width * 0.54;
    const y = anchorY + height * (0.12 + ((index * 0.21) % 0.28));
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

const drawLightTouch = (width, height, timestamp, rgb) => {
  context.save();
  context.globalCompositeOperation = "screen";
  for (const touch of lightTouches) {
    const age = Math.max(0, (timestamp - touch.startedAt) / 1000);
    const life = Math.max(0, 1 - age / 3.1);
    const x = touch.x * width;
    const y = touch.y * height;
    const radius = age * (74 + touch.strength * 24);
    const glow = context.createRadialGradient(x, y, 0, x, y, 72 + age * 28);
    glow.addColorStop(0, `rgba(${rgb},${0.26 * life * touch.strength})`);
    glow.addColorStop(0.34, `rgba(229,255,255,${0.12 * life})`);
    glow.addColorStop(1, `rgba(${rgb},0)`);
    context.fillStyle = glow;
    context.fillRect(x - 110, y - 110, 220, 220);
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.strokeStyle = `rgba(${rgb},${0.4 * life})`;
    context.lineWidth = 1.2 + touch.strength;
    context.stroke();
  }
  if (lightPointer.active > 0) {
    const x = lightPointer.x * width;
    const y = lightPointer.y * height;
    const glow = context.createRadialGradient(x, y, 0, x, y, 86);
    glow.addColorStop(0, `rgba(242,255,255,${0.3 + lightPointer.energy * 0.16})`);
    glow.addColorStop(0.32, `rgba(${rgb},0.18)`);
    glow.addColorStop(1, `rgba(${rgb},0)`);
    context.fillStyle = glow;
    context.fillRect(x - 90, y - 90, 180, 180);
  }
  context.restore();
};

const updateAnchorMarker = (exhibit, location, anchor) => {
  if (!anchorMarker) return;
  const [x, y] = anchor.normalized;
  const onScreen = x >= 0.015 && x <= 0.985 && y >= 0.04 && y <= 0.96;
  anchorMarker.hidden = !onScreen;
  anchorMarker.style.left = `${(x * 100).toFixed(3)}%`;
  anchorMarker.style.top = `${(y * 100).toFixed(3)}%`;
  anchorMarker.dataset.exhibit = exhibit.id;
  anchorMarker.querySelector("[data-live-anchor-source]").textContent = exhibit.number === "10" ? "OBSERVATORY" : "OBSERVATION AREA";
  anchorMarker.querySelector("[data-live-anchor-label]").textContent = location.label;
  anchorMarker.querySelector("[data-live-anchor-coordinates]").textContent = `${Math.abs(location.lat).toFixed(3)}°${location.lat >= 0 ? "N" : "S"} / ${Math.abs(location.lon).toFixed(3)}°${location.lon >= 0 ? "E" : "W"}`;
};

const draw = (timestamp = performance.now(), force = false) => {
  cancelAnimationFrame(frame);
  frame = 0;
  if (activeIndex < 0 || !canvas || canvas.hidden) return;
  const currentProfile = profile();
  const targetFps = currentProfile.level === "high" ? 36 : currentProfile.level === "medium" ? 30 : 20;
  if (webglRenderer && !force && lastRenderedAt > 0 && timestamp - lastRenderedAt < 1000 / targetFps) {
    if (!reducedMotion && !document.hidden && currentProfile.level !== "static" && !layer.hidden) frame = requestAnimationFrame(draw);
    return;
  }
  lastRenderedAt = timestamp;
  const exhibit = EXHIBITS[activeIndex];
  const measurement = currentMeasurement(exhibit);
  const missing = !measurement || !Number.isFinite(Number(measurement.value));
  const strength = missing ? exhibit.fallback : Math.max(0, Math.min(1, Number(measurement.normalized) || 0));
  const { width, height } = resizeCanvas();
  const time = reducedMotion ? 2.4 : timestamp / 1000;
  const location = observationLocation(exhibit, measurement);
  const anchor = projectSceneAnchor(location);
  const touches = lightTouchUniform(timestamp);
  lightPointer.energy *= lightPointer.down ? 0.992 : 0.965;
  canvas.dataset.anchorLongitude = String(location.lon);
  canvas.dataset.anchorLatitude = String(location.lat);
  canvas.dataset.anchorNormalizedX = anchor.normalized[0].toFixed(4);
  canvas.dataset.anchorNormalizedY = anchor.normalized[1].toFixed(4);
  canvas.dataset.signalStrength = strength.toFixed(4);
  canvas.dataset.signalKey = exhibit.key;
  updateAnchorMarker(exhibit, location, anchor);
  if (webglRenderer) {
    webglRenderer.render({
      time,
      mode: activeIndex,
      strength,
      missing,
      accent: EXHIBIT_COLORS.get(exhibit.id),
      anchor: anchor.scene,
      pointer: lightPointer,
      touches,
    });
  } else if (context) {
    context.clearRect(0, 0, width, height);
    const wash = context.createRadialGradient(width * 0.48, height * 0.48, 0, width * 0.48, height * 0.48, Math.max(width, height) * 0.7);
    wash.addColorStop(0, `rgba(${exhibit.rgb},.08)`);
    wash.addColorStop(1, "rgba(1,7,12,.02)");
    context.fillStyle = wash;
    context.fillRect(0, 0, width, height);
    const particleRatio = currentProfile.particleRatio || 0.25;
    if (exhibit.id === "wind-field") drawWind(width, height, time, strength, particleRatio, anchor.normalized);
    else if (exhibit.id === "carbon-pulse") drawCarbon(width, height, time, strength, particleRatio, anchor.normalized);
    else if (exhibit.id === "rain-chorus") drawRain(width, height, time, strength, particleRatio, anchor.normalized);
    else drawNo2(width, height, time, strength, particleRatio, missing);
    drawLightTouch(width, height, timestamp, exhibit.rgb);
    context.globalCompositeOperation = "source-over";
  }
  if (!reducedMotion && !document.hidden && currentProfile.level !== "static" && !layer.hidden) frame = requestAnimationFrame(draw);
};

const renderReadout = () => {
  if (activeIndex < 0 || !readout) return;
  const exhibit = EXHIBITS[activeIndex];
  const state = currentState();
  const measurement = currentMeasurement(exhibit);
  const missing = !measurement || !Number.isFinite(Number(measurement.value));
  const strength = missing ? exhibit.fallback : clamp01(measurement.normalized);
  const location = observationLocation(exhibit, measurement);
  const audioState = proceduralAudio.getState();
  const status = STATUS_LABELS[measurement?.status] || (state.connected ? "NEAR REAL TIME" : "SNAPSHOT");
  const savedMeasurement = measurement?.status === "snapshot";
  const feedState = state.connected && !savedMeasurement
    ? "NEAR REAL TIME / 5分ごとに更新"
    : state.source === "live"
      ? "LATEST API SNAPSHOT / 再接続中"
      : "SAVED SNAPSHOT / 保存データを再現中";
  const observedAt = formatJptDateTime(measurement?.observedAt);
  readout.dataset.missing = String(missing);
  readout.dataset.exhibit = exhibit.id;
  readout.dataset.audioState = audioState.active ? "playing" : audioState.enabled ? "armed" : "off";
  readout.style.setProperty("--live-signal-level", String(strength));
  readout.style.setProperty("--live-stage-duration", `${(60 / Math.max(1, audioState.tempo || 48)).toFixed(3)}s`);
  readout.querySelector("[data-live-exhibit-kicker]").textContent = `${exhibit.number} / ${status}`;
  const [titleJa, titleEn = ""] = exhibit.title.split(" — ");
  const exhibitTitle = readout.querySelector("[data-live-exhibit-title]");
  exhibitTitle.setAttribute("aria-label", exhibit.title);
  exhibitTitle.querySelector("[data-live-exhibit-title-ja]").textContent = titleJa;
  exhibitTitle.querySelector("[data-live-exhibit-title-en]").textContent = titleEn;
  readout.querySelector("[data-live-exhibit-value]").textContent = formatValue(measurement);
  readout.querySelector("[data-live-exhibit-caption]").textContent = exhibit.caption;
  readout.querySelector("[data-live-exhibit-feed-state]").textContent = feedState;
  readout.querySelector("[data-live-exhibit-feed-time]").textContent = `観測時刻 ${observedAt}`;
  readout.querySelector("[data-live-exhibit-feed-copy]").textContent = state.connected && !savedMeasurement
    ? "公開APIの最新公開値に接続中です。5分ごとの更新時に、数値・光・音へ同じ変換を反映します。"
    : state.source === "live"
      ? "この項目は保存済み観測値です。ライブ取得できた項目だけを5分ごとに更新し、混在状態を明示します。"
      : "現在は保存済み観測データの再現です。準リアルタイム接続時も、取得できない項目はこの状態を明示します。";
  readout.querySelector("[data-live-exhibit-sound-description]").textContent = audioState.active
    ? `音：${exhibit.soundMap} 現在 ${audioState.tempo} BPMで再生中です。`
    : `音：${exhibit.soundMap} 「展示音を再生」を押すと始まります。`;
  readout.querySelector("[data-live-exhibit-level]").textContent = missing ? "欠測 / STANDBY" : `${Math.round(strength * 100)}% SIGNAL`;
  readout.querySelector("[data-live-exhibit-scale]").textContent = exhibit.scaleLabel;
  readout.querySelector("[data-live-stage-signal]").textContent = missing ? "STANDBY" : formatValue(measurement);
  readout.querySelector("[data-live-stage-location]").textContent = "HAWAIʻI";
  readout.querySelector("[data-live-stage-coordinates]").textContent = `${Math.abs(location.lat).toFixed(1)}°${location.lat >= 0 ? "N" : "S"}`;
  readout.querySelector("[data-live-stage-visual]").textContent = exhibit.visualCue;
  readout.querySelector("[data-live-stage-sound]").textContent = `${audioState.tempo || "—"} BPM`;
  readout.querySelector("[data-live-exhibit-input]").textContent = missing
    ? `${exhibit.signalLabel}は欠測。値を捏造せず待機演出へ切り替えます。`
    : `${exhibit.signalLabel} ${formatValue(measurement)}を変換の起点にします。`;
  readout.querySelector("[data-live-exhibit-location]").textContent = `${location.label}（${location.lat.toFixed(3)}°, ${location.lon.toFixed(3)}°）を地図上の発生点として表示します。`;
  readout.querySelector("[data-live-exhibit-visual-map]").textContent = exhibit.visualMap;
  readout.querySelector("[data-live-exhibit-sound-map]").textContent = audioState.focus === exhibit.id
    ? `${exhibit.soundMap} 現在 ${audioState.tempo} BPM。`
    : exhibit.soundMap;
  readout.querySelector("[data-live-exhibit-source]").textContent = measurement
    ? `${measurement.provider?.toUpperCase() || "SOURCE"} · ${measurement.datasetId || "PUBLIC DATA"}`
    : "SOURCE DATA MISSING · VISUAL SCAN STANDBY";
  readout.querySelector("[data-live-exhibit-time]").textContent = observedAt;
};

const applyHeading = () => {
  if (activeIndex < 0) return;
  const exhibit = EXHIBITS[activeIndex];
  layer.style.setProperty("--map-accent", exhibit.accent);
  layer.style.setProperty("--map-accent-rgb", exhibit.rgb);
  document.querySelector("#japan-mode-number").textContent = exhibit.number;
  document.querySelector("#japan-mode-title").textContent = exhibit.shortTitle;
  document.querySelector("#japan-title").textContent = exhibit.shortTitle;
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
  const exhibit = EXHIBITS[index];
  layer.classList.add("is-live-exhibit");
  layer.dataset.liveExhibit = exhibit.id;
  proceduralAudio.setFocus(exhibit.id);
  if (!globalThis.GaiaOpeningAudio?.getState?.().muted) {
    void proceduralAudio.enable().then(renderReadout).catch((error) => console.error(error));
  }
  lightTouches = [];
  lightPointer.energy = 0;
  canvas.dataset.lightTouchCount = "0";
  canvas.hidden = false;
  readout.hidden = false;
  setMobileReadoutExpanded(false);
  applyHeading();
  renderReadout();
  lastRenderedAt = 0;
  draw(performance.now(), true);
  dispatchEvent(new CustomEvent("gaia:live-exhibit-change", { detail: { index, id: exhibit.id } }));
};

const deactivate = ({ number, title } = {}) => {
  if (activeIndex < 0) return;
  activeIndex = -1;
  proceduralAudio.setFocus(null);
  proceduralAudio.disable();
  lightTouches = [];
  lightPointer.active = 0;
  lightPointer.down = false;
  cancelAnimationFrame(frame);
  frame = 0;
  lastRenderedAt = 0;
  layer.classList.remove("is-live-exhibit");
  delete layer.dataset.liveExhibit;
  canvas.hidden = true;
  readout.hidden = true;
  setMobileReadoutExpanded(false);
  if (anchorMarker) anchorMarker.hidden = true;
  buttons.forEach((button) => button.setAttribute("aria-current", "false"));
  layer.style.removeProperty("--map-accent");
  layer.style.removeProperty("--map-accent-rgb");
  const restored = number && title ? { number, title } : savedHeading;
  if (restored) {
    document.querySelector("#japan-mode-number").textContent = restored.number;
    document.querySelector("#japan-mode-title").textContent = restored.title;
    document.querySelector("#japan-title").textContent = restored.title;
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
  canvas.dataset.lightTouchIntegration = "abstract-light-touch";
  canvas.dataset.lightTouchCount = "0";
  map.append(canvas);
  anchorMarker = document.createElement("div");
  anchorMarker.className = "gaia-live-exhibit-anchor";
  anchorMarker.hidden = true;
  anchorMarker.setAttribute("aria-hidden", "true");
  anchorMarker.innerHTML = `<i></i><span><b data-live-anchor-source>OBSERVATION AREA</b><strong data-live-anchor-label>HAWAII</strong><small data-live-anchor-coordinates>19.550°N / 155.450°W</small></span>`;
  map.append(anchorMarker);
  webglRenderer = createWebGLRenderer(canvas);
  if (webglRenderer) {
    canvas.dataset.renderEngine = "webgl-aiva-field";
    canvas.dataset.webglState = "active";
    canvas.dataset.visualLanguage = "continuous-signal-field";
  } else {
    context = canvas.getContext("2d", { alpha: true });
    if (!context) {
      const fallbackCanvas = canvas.cloneNode();
      canvas.replaceWith(fallbackCanvas);
      canvas = fallbackCanvas;
      context = canvas.getContext("2d", { alpha: true });
    }
    canvas.dataset.renderEngine = "canvas-2d-fallback";
    canvas.dataset.webglState = "fallback";
    canvas.dataset.visualLanguage = "continuous-ribbons";
  }

  if (webglRenderer) {
    canvas.addEventListener("webglcontextlost", (event) => {
      event.preventDefault();
      cancelAnimationFrame(frame);
      frame = 0;
      canvas.dataset.webglState = "lost";
      globalThis.GaiaFrameBudgetGovernor?.reportFailure?.("context-lost");
    });
    canvas.addEventListener("webglcontextrestored", () => {
      webglRenderer?.destroy?.();
      webglRenderer = createWebGLRenderer(canvas);
      canvas.dataset.webglState = webglRenderer ? "active" : "fallback";
      canvas.dataset.renderEngine = webglRenderer ? "webgl-aiva-field" : "unavailable";
      lastRenderedAt = 0;
      if (activeIndex >= 0) draw(performance.now(), true);
    });
  }

  readout = document.createElement("section");
  readout.className = "gaia-live-exhibit-readout";
  readout.hidden = true;
  readout.setAttribute("aria-live", "polite");
  readout.innerHTML = `
    <div class="gaia-live-exhibit-primary">
      <div>
        <p data-live-exhibit-kicker></p>
        <h3 data-live-exhibit-title>
          <span data-live-exhibit-title-ja></span>
          <small data-live-exhibit-title-en></small>
        </h3>
      </div>
      <strong data-live-exhibit-value></strong>
    </div>
    <button class="gaia-live-mobile-toggle" id="gaia-live-mobile-toggle" type="button" aria-expanded="false" aria-controls="gaia-live-exhibit-details">
      <span>DETAIL</span><strong>詳細</strong><i aria-hidden="true"></i>
    </button>
    <div class="gaia-live-exhibit-signal" aria-label="観測値の変換強度">
      <span><i></i></span>
      <b data-live-exhibit-level>0% SIGNAL</b>
      <small data-live-exhibit-scale></small>
    </div>
    <div class="gaia-live-exhibit-details" id="gaia-live-exhibit-details">
    <section class="gaia-live-exhibit-explanation" aria-label="展示の説明と観測状態">
      <p class="gaia-live-exhibit-summary" data-live-exhibit-caption></p>
      <div class="gaia-live-exhibit-freshness">
        <strong data-live-exhibit-feed-state></strong>
        <time data-live-exhibit-feed-time></time>
      </div>
      <p data-live-exhibit-feed-copy></p>
      <p class="gaia-live-exhibit-sonification" data-live-exhibit-sound-description></p>
    </section>
    <ol class="gaia-live-exhibit-path" aria-label="観測データから映像と音への変換経路">
      <li data-live-stage="observe">
        <span>01</span>
        <i class="gaia-live-stage-symbol" aria-hidden="true"><svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="5"/><circle cx="32" cy="32" r="16"/><circle cx="32" cy="32" r="27"/></svg></i>
        <b>観測</b><em data-live-stage-signal>—</em>
        <p class="gaia-live-exhibit-a11y" data-live-exhibit-input></p>
      </li>
      <li data-live-stage="locate">
        <span>02</span>
        <i class="gaia-live-stage-symbol" aria-hidden="true"><svg viewBox="0 0 64 64"><circle cx="32" cy="27" r="9"/><path d="M32 5c-13 0-23 10-23 23 0 17 23 31 23 31s23-14 23-31C55 15 45 5 32 5Z"/></svg></i>
        <b>地図</b><em data-live-stage-location>HAWAIʻI</em><small data-live-stage-coordinates>19.7°N</small>
        <p class="gaia-live-exhibit-a11y" data-live-exhibit-location></p>
      </li>
      <li data-live-stage="visualize">
        <span>03</span>
        <i class="gaia-live-stage-symbol" aria-hidden="true"><svg viewBox="0 0 64 64"><path d="M4 21c10-12 18 12 28 0s18 12 28 0M4 33c10-12 18 12 28 0s18 12 28 0M4 45c10-12 18 12 28 0s18 12 28 0"/></svg></i>
        <b>光</b><em data-live-stage-visual>流線</em>
        <p class="gaia-live-exhibit-a11y" data-live-exhibit-visual-map></p>
      </li>
      <li data-live-stage="sonify">
        <span>04</span>
        <i class="gaia-live-stage-symbol" aria-hidden="true"><svg viewBox="0 0 64 64"><path d="M6 35h7l5-17 8 32 7-42 8 47 7-27 5 7h5"/></svg></i>
        <b>音</b><em data-live-stage-sound>— BPM</em>
        <p class="gaia-live-exhibit-a11y" data-live-exhibit-sound-map></p>
      </li>
    </ol>
    <div class="gaia-live-exhibit-actions">
      <button type="button" data-live-sound-toggle aria-pressed="false"><span class="gaia-live-sound-mark" aria-hidden="true"><i></i><i></i><i></i></span><span class="gaia-live-sound-copy"><b data-live-sound-label>展示音を再生</b><small data-live-sound-status>クリックで観測値を音に変換</small></span></button>
      <button class="gaia-live-exhibit-touch-hint" type="button" data-live-light-touch aria-label="地図の光へ触れ、光と展示音を鳴らす"><i aria-hidden="true"></i><b>光に触れる</b><span>TOUCH / DRAG</span></button>
    </div>
    <footer><span data-live-exhibit-source></span><time data-live-exhibit-time></time></footer>
    </div>
  `;
  layer.append(readout);
  mobileReadoutToggle = readout.querySelector("#gaia-live-mobile-toggle");
  mobileReadoutToggle?.addEventListener("click", () => {
    setMobileReadoutExpanded(mobileReadoutToggle.getAttribute("aria-expanded") !== "true");
  });
  dispatchEvent(new CustomEvent("gaia:live-exhibit-mounted"));

  readout.querySelector("[data-live-light-touch]")?.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    const touchStep = proceduralAudio.getState().touchCount % 3;
    const [x, y] = [[0.36, 0.43], [0.52, 0.34], [0.68, 0.54]][touchStep];
    lightPointer.x = x;
    lightPointer.y = y;
    lightPointer.active = 1;
    lightPointer.energy = 1.2;
    addLightTouch(x, y, 1.35);
    lastRenderedAt = 0;
    draw(performance.now(), true);
  });

  map.addEventListener("pointerdown", (event) => {
    if (activeIndex < 0) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    map.setPointerCapture?.(event.pointerId);
    lightPointer.down = true;
    updateLightPointer(event, { touch: true });
  }, { capture: true });
  map.addEventListener("pointermove", (event) => {
    if (activeIndex < 0) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    updateLightPointer(event);
  }, { capture: true });
  map.addEventListener("pointerup", (event) => {
    if (activeIndex < 0) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    updateLightPointer(event);
    lightPointer.down = false;
    if (event.pointerType !== "mouse") lightPointer.active = 0;
    if (map.hasPointerCapture?.(event.pointerId)) map.releasePointerCapture(event.pointerId);
  }, { capture: true });
  map.addEventListener("pointercancel", (event) => {
    if (activeIndex < 0) return;
    event.stopImmediatePropagation();
    lightPointer.down = false;
    lightPointer.active = 0;
  }, { capture: true });
  map.addEventListener("pointerleave", () => {
    lightPointer.down = false;
    lightPointer.active = 0;
  });
  map.addEventListener("keydown", (event) => {
    if (activeIndex < 0 || !["Enter", " "].includes(event.key)) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    lightPointer.x = 0.5;
    lightPointer.y = 0.5;
    lightPointer.active = 1;
    lightPointer.energy = 1;
    addLightTouch(0.5, 0.5, 1.3);
  }, { capture: true });

  buttons = EXHIBITS.map((exhibit, index) => {
    const button = document.createElement("button");
    button.className = "map-mode-button";
    button.type = "button";
    button.textContent = exhibit.number;
    button.dataset.liveExhibit = exhibit.id;
    button.dataset.mapPreviewSurface = "map";
    button.setAttribute("aria-label", `${exhibit.number} ${exhibit.shortTitle}のライブ観測演出へ切り替える`);
    button.setAttribute("aria-describedby", "map-mode-preview");
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
  addEventListener("gaia:procedural-audio-state", () => {
    const audioState = proceduralAudio.getState();
    canvas.dataset.audioState = audioState.active ? "playing" : audioState.enabled ? "armed" : "off";
    canvas.dataset.audioFocus = audioState.focus || "none";
    canvas.dataset.audioTempo = String(audioState.tempo || 0);
    renderReadout();
  });
  addEventListener("gaia:japan-mode-change", () => {
    if (activeIndex < 0) return;
    savedHeading = {
      number: document.querySelector("#japan-mode-number")?.textContent || savedHeading?.number,
      title: document.querySelector("#japan-mode-title")?.textContent || savedHeading?.title,
    };
    queueMicrotask(applyHeading);
  });
  addEventListener("gaia:lodchange", () => { if (activeIndex >= 0) draw(performance.now(), true); });
  addEventListener("resize", () => { if (activeIndex >= 0) draw(performance.now(), true); }, { passive: true });
  document.addEventListener("visibilitychange", () => { if (!document.hidden && activeIndex >= 0) draw(performance.now(), true); });
};

if (globalThis.GaiaMapObservationAdapter) mount();
else addEventListener("gaia:map-adapter-ready", mount, { once: true });

globalThis.GaiaLiveExhibits = Object.freeze({
  mount,
  select,
  deactivate,
  redraw: () => draw(performance.now(), true),
  definitions: EXHIBITS,
});

export { mount };
