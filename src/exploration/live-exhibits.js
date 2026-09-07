import { formatJapaneseNumber } from "../shared/number-format.js";
import { STATUS_LABELS } from "./transforms.js?v=gaia-live-loading-1";
import { earthBaseScale, earthLongitudeToMapX } from "./world-projection.js?v=gaia-japan-center-1";
import { japanPrefectureView } from "./japan-prefecture-view.js?v=gaia-prefecture-gis-view-1";
import { decorateMapActions } from "./map-exhibit-actions.js?v=gaia-inline-data-sources-1";
import { LIVE_EXHIBITS as EXHIBITS } from "./live-exhibit-catalog.js?v=gaia-exhibit-editorial-1";
import { OBSERVATION_CITIES, findObservationCity, adjacentObservationCity } from "./observation-cities.js?v=gaia-exhibit-catalog-1";
import { createMetricLegend, updateMetricLegend } from "./metric-legend.js?v=gaia-observation-mincho-1";
import { createObservationPlacePicker } from "./observation-place-picker.js?v=gaia-place-inline-1";
import { formatPrefecturePlace } from "./observation-place-label.js?v=gaia-place-inline-1";

// Preserve the existing module export for callers outside the map runtime.
export { OBSERVATION_CITIES };

const LIVE_POI_DWELL_MS = 6800;
const LIVE_POI_DEPART_MS = 280;
const LIVE_POI_ARRIVE_MS = 1320;

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
let chapterSelectorToggle = null;
let anchorMarker = null;
let cityPicker = null;
let placePicker = null;
let resumePoiAfterPicker = false;
let metricLegend = null;
let weatherCredit = null;
let cityMarkersLayer = null;
let cityMarkerButtons = [];
let buttons = [];
let frame = 0;
let lastRenderedAt = 0;
let savedHeading = null;
let selectedCityId = globalThis.GaiaLiveData?.getCity?.() || OBSERVATION_CITIES[0].id;
let windFieldSnapshot = globalThis.GaiaLiveData?.getWindField?.() || { source: "unavailable", points: [] };
let poiAutoplayEnabled = !reducedMotion;
let poiAutoplayTimer = 0;
let poiTransitionTimer = 0;
let poiTransitionGeneration = 0;
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
  if (measurement?.value == null || !Number.isFinite(Number(measurement.value))) return "—";
  const digits = measurement.key === "weatherPrecipitation" ? 2 : 1;
  const unit = measurement.unit || "";
  return `${formatJapaneseNumber(Number(measurement.value), digits)} ${unit}`.trim();
};

const formatJstDateTime = (value) => {
  if (!value) return "観測時刻なし";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "観測時刻なし";
  return `${new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).format(date)} JST`;
};

const currentState = () => globalThis.GaiaLiveData?.getState?.() || { measurements: {}, source: "loading", requestState: "loading", connected: false };
const currentMeasurement = (exhibit) => currentState().measurements?.[exhibit.key] || null;
const currentWindField = () => windFieldSnapshot;
const profile = () => globalThis.GaiaFrameBudgetGovernor?.getProfile?.() || { dprCap: 1, particleRatio: 0.65, level: "medium" };
const clamp01 = (value) => Math.max(0, Math.min(1, value));
const WIND_FIELD_REFERENCE_MS = 15;
const WIND_COLOR_STOPS = Object.freeze([
  [0, [52, 112, 255]],
  [0.22, [38, 209, 236]],
  [0.42, [62, 226, 145]],
  [0.62, [244, 222, 70]],
  [0.8, [255, 129, 36]],
  [1, [255, 43, 67]],
]);
const windStrength = (value) => Number.isFinite(Number(value)) ? clamp01(Number(value) / WIND_FIELD_REFERENCE_MS) : null;
const windColor = (strength) => {
  const value = clamp01(Number(strength) || 0);
  const upperIndex = Math.max(1, WIND_COLOR_STOPS.findIndex(([stop]) => stop >= value));
  const [lowerStop, lowerColor] = WIND_COLOR_STOPS[upperIndex - 1];
  const [upperStop, upperColor] = WIND_COLOR_STOPS[upperIndex];
  const mix = upperStop === lowerStop ? 0 : (value - lowerStop) / (upperStop - lowerStop);
  return lowerColor.map((channel, index) => Math.round(channel + (upperColor[index] - channel) * mix));
};
// Match the existing visual reference ranges, including the wind field's
// 15 m/s colour ceiling (which differs from the audio normalization range).
const LIVE_METRIC_SCALES = Object.freeze({
  weatherWindSpeed: [0, WIND_FIELD_REFERENCE_MS, "m/s", "#3470ff, #26d1ec 22%, #3ee291 42%, #f4de46 62%, #ff8124 80%, #ff2b43"],
  forecastCo2: [280, 650, "ppm", "#423d72, #ba8753, #ffd06f"],
  weatherPrecipitation: [0, 30, "mm", "#163950, #417fc4, #a4e5ff"],
  weatherTemperature: [-20, 45, "℃", "#567cc9, #bde3ef, #ff9b69, #fff1bb"],
  cloudCover: [0, 100, "%", "#163950, #779cb7, #e5f4fa"],
  pm25: [0, 150, "µg/m³", "#353052, #895ea7, #d49bff"],
});

const updateLiveCreditPosition = () => {
  if (activeIndex < 0 || !readout || readout.hidden) return;
  layer.style.setProperty("--live-credit-bottom", `${Math.max(0, innerHeight - readout.getBoundingClientRect().top + 6)}px`);
};
const selectedCity = () => findObservationCity(selectedCityId) || OBSERVATION_CITIES[0];
const cityForLocation = (location) => OBSERVATION_CITIES.find((city) => (
  Math.abs(city.lat - Number(location?.lat)) < 0.08 && Math.abs(city.lon - Number(location?.lon)) < 0.08
)) || selectedCity();

const observationLocation = (exhibit, measurement) => {
  const location = measurement?.location;
  const lon = Number(location?.lon);
  const lat = Number(location?.lat);
  const fallbackCity = selectedCity();
  // Provider attribution belongs in the edge credit and source ledger, not place names.
  // Normalize display text only; keep the API/snapshot provenance unchanged.
  const city = cityForLocation(location);
  return {
    lon: Number.isFinite(lon) ? lon : fallbackCity.lon,
    lat: Number.isFinite(lat) ? lat : fallbackCity.lat,
    label: formatPrefecturePlace(city.prefecture, city.city),
  };
};

const getLiveMapProjection = () => {
  const rect = canvas?.getBoundingClientRect();
  if (!rect?.width || !rect?.height) return null;
  const overlay = document.querySelector("#japan-overlay");
  const zoom = Math.max(1, Number(overlay?.dataset.earthZoom) || 1);
  const offsetX = Number(overlay?.dataset.earthOffsetX) || 0;
  const offsetY = Number(overlay?.dataset.earthOffsetY) || 0;
  const scale = earthBaseScale(rect) * zoom;
  const worldWidth = 360 * scale;
  const worldHeight = 180 * scale;
  const originX = (rect.width - worldWidth) / 2 + offsetX;
  const originY = (rect.height - worldHeight) / 2 + offsetY;
  return { rect, scale, originX, originY };
};

const projectSceneAnchor = (location, projection = getLiveMapProjection()) => {
  if (!projection) return { scene: [0.4, 0.12], normalized: [0.7, 0.42] };
  const { rect, scale, originX, originY } = projection;
  const mapLongitude = earthLongitudeToMapX(location.lon);
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

const updateCityMarkers = (projection) => {
  if (!cityMarkersLayer || !projection) return;
  const fieldById = new Map((currentWindField().points || []).map((point) => [point.id, point]));
  cityMarkerButtons.forEach((button) => {
    const city = findObservationCity(button.dataset.liveCityMarker);
    if (!city) return;
    const [x, y] = projectSceneAnchor(city, projection).normalized;
    const onScreen = x >= -0.02 && x <= 1.02 && y >= -0.04 && y <= 1.04;
    button.hidden = !onScreen;
    button.style.left = `${(x * 100).toFixed(3)}%`;
    button.style.top = `${(y * 100).toFixed(3)}%`;
    button.setAttribute("aria-current", String(city.id === selectedCityId));
    const wind = fieldById.get(city.id);
    const strength = windStrength(wind?.windSpeed);
    const exhibit = EXHIBITS[activeIndex];
    const measurement = exhibit && city.id === selectedCityId ? currentMeasurement(exhibit) : null;
    const hasMeasurement = measurement?.value != null && Number.isFinite(Number(measurement.value));
    const windAvailable = activeIndex === 0 && strength !== null;
    const signature = [exhibit?.id, hasMeasurement, measurement?.value, measurement?.observedAt,
      windAvailable, wind?.windSpeed, wind?.observedAt || currentWindField().observedAt].join("|");
    if (button.dataset.observationSignature !== signature) {
      button.dataset.observationSignature = signature;
      button.querySelector("[data-live-marker-value]").textContent = hasMeasurement
        ? `${exhibit.signalLabel}　${formatValue(measurement)}`
        : windAvailable ? `風速　${Number(wind.windSpeed).toFixed(1)} m/s` : "値は未取得";
      button.querySelector("[data-live-marker-detail]").textContent = hasMeasurement
        ? `${formatJstDateTime(measurement.observedAt)} · モデル値`
        : windAvailable ? `${formatJstDateTime(wind.observedAt || currentWindField().observedAt)} · モデル値` : "地点を選んで取得";
    }
    if (activeIndex === 0 && strength !== null) {
      const rgb = windColor(strength);
      button.dataset.windSpeed = Number(wind.windSpeed).toFixed(1);
      button.style.setProperty("--live-wind-level", strength.toFixed(4));
      button.style.setProperty("--live-wind-rgb", rgb.join(","));
      button.style.setProperty("--live-wind-halo-alpha", (0.08 + strength * 0.12).toFixed(3));
      button.style.setProperty("--live-wind-glow-alpha", (0.46 + strength * 0.4).toFixed(3));
      button.setAttribute("aria-label", `${city.code} ${city.name}、風速${Number(wind.windSpeed).toFixed(1)} m/sのモデル値を表示`);
    } else {
      delete button.dataset.windSpeed;
      button.style.removeProperty("--live-wind-level");
      button.style.removeProperty("--live-wind-rgb");
      button.style.removeProperty("--live-wind-halo-alpha");
      button.style.removeProperty("--live-wind-glow-alpha");
      button.setAttribute("aria-label", `${city.code} ${city.name}の観測データを表示`);
    }
  });
  cityMarkersLayer.dataset.visibleCount = String(cityMarkerButtons.filter((button) => !button.hidden).length);
};

const projectWindPoints = (projection, selectedMeasurement) => {
  if (activeIndex !== 0 || !projection) return [];
  const field = currentWindField();
  const fieldById = new Map((field.points || []).map((point) => [point.id, point]));
  if (!fieldById.has(selectedCityId) && Number.isFinite(Number(selectedMeasurement?.value))) {
    const city = selectedCity();
    fieldById.set(city.id, { id: city.id, lat: city.lat, lon: city.lon, windSpeed: Number(selectedMeasurement.value) });
  }
  return OBSERVATION_CITIES.flatMap((city, index) => {
    const point = fieldById.get(city.id);
    const strength = windStrength(point?.windSpeed);
    if (strength === null) return [];
    const projected = projectSceneAnchor(city, projection).normalized;
    if (projected[0] < -0.12 || projected[0] > 1.12 || projected[1] < -0.12 || projected[1] > 1.12) return [];
    return [{
      x: projected[0],
      y: projected[1],
      strength,
      seed: (index * 0.61803398875) % 1,
      selected: city.id === selectedCityId ? 1 : 0,
      windSpeed: Number(point.windSpeed),
    }];
  }).sort((left, right) => left.selected - right.selected);
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
  if (exhibit) {
    canvas?.dispatchEvent(new CustomEvent("gaia:live-light-touch", {
      detail: {
        id: exhibit.id,
        key: exhibit.key,
        x: normalizedX,
        y: normalizedY,
        energy: strength,
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

  vec3 temperatureField(vec2 p, vec2 signalSpace, float fieldA, float fieldB, float phase, out float energy) {
    vec2 heatSpace = signalSpace - u_anchor;
    float contourA = softLine(abs(sin((heatSpace.y + fieldA * 0.18) * 8.0 - phase * 0.32)), 0.085);
    float contourB = softLine(abs(sin((heatSpace.x * 0.55 - heatSpace.y + fieldB * 0.22) * 11.0 + phase * 0.21)), 0.06);
    float thermalLift = smoothstep(0.36, 0.9, fbm(vec2(heatSpace.x * 2.1, heatSpace.y * 1.4 - phase * (0.12 + u_strength * 0.2))));
    float sourceHeat = exp(-8.0 * dot(heatSpace * vec2(0.86, 1.0), heatSpace * vec2(0.86, 1.0)));
    energy = contourA * 0.42 + contourB * 0.24 + thermalLift * (0.18 + u_strength * 0.28) + sourceHeat * 0.7;
    vec3 cold = vec3(0.18, 0.66, 1.0);
    vec3 warm = vec3(1.0, 0.38, 0.12);
    vec3 whiteHeat = vec3(1.0, 0.91, 0.68);
    return mix(mix(cold, warm, smoothstep(0.18, 0.76, u_strength)), whiteHeat, clamp(sourceHeat + contourA * 0.22, 0.0, 1.0));
  }

  vec3 cloudField(vec2 p, vec2 signalSpace, float fieldA, float fieldB, float phase, out float energy) {
    vec2 cloudSpace = signalSpace * vec2(0.88, 1.28) + vec2(-phase * 0.055, phase * 0.012);
    float broadCloud = fbm(cloudSpace * 1.12 + vec2(fieldA * 0.34, fieldB * 0.18));
    float fineCloud = fbm(cloudSpace * 2.36 - vec2(fieldB, fieldA) * 0.28);
    float threshold = mix(0.72, 0.38, u_strength);
    float cloudMass = smoothstep(threshold, threshold + 0.2, broadCloud * 0.72 + fineCloud * 0.38);
    float rim = softLine(abs((broadCloud * 0.72 + fineCloud * 0.38) - threshold), 0.045);
    float opening = exp(-5.0 * dot((signalSpace - u_anchor) * vec2(0.78, 1.0), (signalSpace - u_anchor) * vec2(0.78, 1.0)));
    energy = cloudMass * (0.34 + u_strength * 0.52) + rim * 0.22 + opening * (1.0 - u_strength) * 0.18;
    vec3 shadowCloud = vec3(0.21, 0.43, 0.62);
    vec3 daylight = vec3(0.78, 0.94, 1.0);
    return mix(shadowCloud, daylight, clamp(fineCloud + rim * 0.46, 0.0, 1.0));
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
    else if (u_mode < 3.5) fieldColor = temperatureField(p, signalSpace, fieldA, fieldB, phase, energy);
    else if (u_mode < 4.5) fieldColor = cloudField(p, signalSpace, fieldA, fieldB, phase, energy);
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

const WEBGL_WIND_BRUSH_VERTEX_SOURCE = `
  attribute vec2 a_anchor;
  attribute vec2 a_corner;
  attribute float a_strength;
  attribute float a_seed;
  attribute float a_selected;
  uniform vec2 u_resolution;
  varying vec2 v_local;
  varying float v_strength;
  varying float v_seed;
  varying float v_selected;

  void main() {
    float pressure = pow(clamp(a_strength, 0.0, 1.0), 0.68);
    vec2 size = vec2(mix(34.0, 112.0, pressure), mix(18.0, 54.0, pressure));
    size *= mix(1.0, 1.32, a_selected);
    vec2 clipAnchor = vec2(a_anchor.x * 2.0 - 1.0, 1.0 - a_anchor.y * 2.0);
    vec2 clipOffset = a_corner * size * 2.0 / max(u_resolution, vec2(1.0));
    gl_Position = vec4(clipAnchor + clipOffset, 0.0, 1.0);
    v_local = a_corner;
    v_strength = a_strength;
    v_seed = a_seed;
    v_selected = a_selected;
  }
`;

const WEBGL_WIND_BRUSH_FRAGMENT_SOURCE = `
  varying vec2 v_local;
  varying float v_strength;
  varying float v_seed;
  varying float v_selected;
  uniform float u_time;

  float hash21(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 34.45);
    return fract(p.x * p.y);
  }

  vec3 windPalette(float value) {
    vec3 blue = vec3(0.20, 0.44, 1.0);
    vec3 cyan = vec3(0.11, 0.86, 0.94);
    vec3 green = vec3(0.24, 0.90, 0.57);
    vec3 yellow = vec3(0.98, 0.86, 0.22);
    vec3 orange = vec3(1.0, 0.43, 0.10);
    vec3 red = vec3(1.0, 0.10, 0.18);
    vec3 color = mix(blue, cyan, smoothstep(0.0, 0.22, value));
    color = mix(color, green, smoothstep(0.22, 0.42, value));
    color = mix(color, yellow, smoothstep(0.42, 0.62, value));
    color = mix(color, orange, smoothstep(0.62, 0.80, value));
    return mix(color, red, smoothstep(0.80, 1.0, value));
  }

  void main() {
    float time = u_time * 0.34;
    float taper = pow(max(0.0, 1.0 - pow(abs(v_local.x), 1.7)), 0.62);
    float firstWave = sin(v_local.x * 3.15 + v_seed * 12.0 + time) * 0.18;
    float secondWave = sin(v_local.x * 7.2 - v_seed * 7.0 - time * 0.62) * 0.055;
    float center = (firstWave + secondWave) * (0.5 + v_strength * 0.5) * taper;
    float width = mix(0.075, 0.24, pow(v_strength, 0.72)) * (0.28 + taper * 0.72);
    float distanceToStroke = abs(v_local.y - center);
    float body = 1.0 - smoothstep(width * 0.48, width * 1.34, distanceToStroke);
    float bristleCoordinate = (v_local.y - center) * mix(58.0, 94.0, v_strength)
      + sin(v_local.x * 17.0 + v_seed * 19.0 - time * 1.4) * 1.7;
    float bristles = 0.58 + 0.42 * smoothstep(-0.22, 0.82, sin(bristleCoordinate));
    float dryPigment = smoothstep(0.17, 0.84, hash21(floor(vec2(
      (v_local.x + 1.0) * 32.0,
      (v_local.y + 1.0) * 46.0
    )) + vec2(v_seed * 31.0, floor(time * 1.3))));
    float brokenEdge = mix(0.48, 1.0, dryPigment) * bristles;
    float halo = exp(-pow(distanceToStroke / max(0.045, width * 2.45), 2.0)) * taper;
    float alpha = body * brokenEdge * (0.42 + v_strength * 0.48)
      + halo * (0.035 + v_strength * 0.12 + v_selected * 0.07);
    if (alpha < 0.012) discard;
    vec3 color = windPalette(v_strength);
    vec3 pigmentLight = mix(color, vec3(1.0, 0.95, 0.78), 0.18 + body * 0.14);
    pigmentLight *= 0.82 + bristles * 0.34 + v_selected * 0.16;
    gl_FragColor = vec4(pigmentLight, min(alpha, 0.9));
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
  const link = (vertexSource, fragmentSource) => {
    const vertex = compile(gl.VERTEX_SHADER, vertexSource);
    const fragment = compile(gl.FRAGMENT_SHADER, `precision ${highPrecision ? "highp" : "mediump"} float;\n${fragmentSource}`);
    if (!vertex || !fragment) return null;
    const nextProgram = gl.createProgram();
    gl.attachShader(nextProgram, vertex);
    gl.attachShader(nextProgram, fragment);
    gl.linkProgram(nextProgram);
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);
    if (gl.getProgramParameter(nextProgram, gl.LINK_STATUS)) return nextProgram;
    gl.deleteProgram(nextProgram);
    return null;
  };
  const program = link(WEBGL_VERTEX_SOURCE, WEBGL_FRAGMENT_SOURCE);
  const windBrushProgram = link(WEBGL_WIND_BRUSH_VERTEX_SOURCE, WEBGL_WIND_BRUSH_FRAGMENT_SOURCE);
  if (!program || !windBrushProgram) {
    if (program) gl.deleteProgram(program);
    if (windBrushProgram) gl.deleteProgram(windBrushProgram);
    return null;
  }
  const buffer = gl.createBuffer();
  const windBrushBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, "a_position");
  const uniforms = Object.fromEntries([
    "u_resolution", "u_time", "u_mode", "u_strength", "u_missing", "u_accent", "u_anchor", "u_pointer",
  ].map((name) => [name, gl.getUniformLocation(program, name)]));
  uniforms.u_touches = gl.getUniformLocation(program, "u_touches[0]");
  const windBrushAttributes = Object.fromEntries([
    "a_anchor", "a_corner", "a_strength", "a_seed", "a_selected",
  ].map((name) => [name, gl.getAttribLocation(windBrushProgram, name)]));
  const windBrushUniforms = {
    resolution: gl.getUniformLocation(windBrushProgram, "u_resolution"),
    time: gl.getUniformLocation(windBrushProgram, "u_time"),
  };
  const windBrushCorners = [[-1, -1], [1, -1], [-1, 1], [-1, 1], [1, -1], [1, 1]];
  let renderCount = 0;
  return Object.freeze({
    gl,
    resize(width, height) { gl.viewport(0, 0, width, height); },
    render({ time, mode, strength, missing, accent, anchor, pointer, touches, windPoints = [], windFieldSource = "unavailable" }) {
      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.enableVertexAttribArray(position);
      gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
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
      if (mode < 0.5 && windPoints.length) {
        const brushVertices = new Float32Array(windPoints.flatMap((point) => windBrushCorners.flatMap(([cornerX, cornerY]) => [
          point.x, point.y, cornerX, cornerY, point.strength, point.seed, point.selected,
        ])));
        gl.useProgram(windBrushProgram);
        gl.bindBuffer(gl.ARRAY_BUFFER, windBrushBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, brushVertices, gl.DYNAMIC_DRAW);
        const stride = 7 * Float32Array.BYTES_PER_ELEMENT;
        const bindAttribute = (attribute, size, offset) => {
          gl.enableVertexAttribArray(attribute);
          gl.vertexAttribPointer(attribute, size, gl.FLOAT, false, stride, offset * Float32Array.BYTES_PER_ELEMENT);
        };
        bindAttribute(windBrushAttributes.a_anchor, 2, 0);
        bindAttribute(windBrushAttributes.a_corner, 2, 2);
        bindAttribute(windBrushAttributes.a_strength, 1, 4);
        bindAttribute(windBrushAttributes.a_seed, 1, 5);
        bindAttribute(windBrushAttributes.a_selected, 1, 6);
        gl.uniform2f(windBrushUniforms.resolution, targetCanvas.width, targetCanvas.height);
        gl.uniform1f(windBrushUniforms.time, time);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.drawArrays(gl.TRIANGLES, 0, windPoints.length * windBrushCorners.length);
        gl.disable(gl.BLEND);
      }
      renderCount += 1;
      targetCanvas.dataset.webglFrame = String(renderCount);
      targetCanvas.dataset.webglMode = String(mode);
      targetCanvas.dataset.webglStrength = strength.toFixed(4);
      targetCanvas.dataset.anchorSceneX = anchor[0].toFixed(4);
      targetCanvas.dataset.anchorSceneY = anchor[1].toFixed(4);
      targetCanvas.dataset.windFieldCount = String(windPoints.length);
      targetCanvas.dataset.windFieldSource = windFieldSource;
      const windSpeeds = windPoints.map((point) => point.windSpeed).filter(Number.isFinite);
      targetCanvas.dataset.windFieldMin = windSpeeds.length ? Math.min(...windSpeeds).toFixed(1) : "";
      targetCanvas.dataset.windFieldMax = windSpeeds.length ? Math.max(...windSpeeds).toFixed(1) : "";
    },
    destroy() {
      gl.deleteBuffer(buffer);
      gl.deleteBuffer(windBrushBuffer);
      gl.deleteProgram(program);
      gl.deleteProgram(windBrushProgram);
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

const drawTemperature = (width, height, time, strength, ratio, anchor) => {
  const x = anchor[0] * width;
  const y = anchor[1] * height;
  const red = Math.round(82 + strength * 173);
  const green = Math.round(184 - strength * 52);
  const blue = Math.round(255 - strength * 150);
  const glow = context.createRadialGradient(x, y, 0, x, y, Math.min(width, height) * 0.56);
  glow.addColorStop(0, `rgba(${red},${green},${blue},${0.18 + strength * 0.16})`);
  glow.addColorStop(0.48, `rgba(${red},${green},${blue},.07)`);
  glow.addColorStop(1, `rgba(${red},${green},${blue},0)`);
  context.fillStyle = glow;
  context.fillRect(0, 0, width, height);
  context.globalCompositeOperation = "screen";
  const bands = Math.max(8, Math.round(16 * ratio));
  for (let band = 0; band < bands; band += 1) {
    const points = [];
    const base = height * (0.14 + band / bands * 0.72);
    for (let step = 0; step <= 54; step += 1) {
      const pointX = step / 54 * width;
      const pointY = base + Math.sin(step * 0.31 + band * 0.62 - time * (0.14 + strength * 0.28)) * (12 + strength * 48);
      points.push([pointX, pointY]);
    }
    line(points, `rgba(${red},${green},${blue},${0.08 + strength * 0.15})`, band % 4 === 0 ? 1.8 : 0.75);
  }
};

const drawCloud = (width, height, time, strength, ratio, anchor) => {
  const count = Math.max(12, Math.round((24 + strength * 48) * ratio));
  context.globalCompositeOperation = "screen";
  for (let index = 0; index < count; index += 1) {
    const seedX = (index * 0.61803398875) % 1;
    const seedY = (index * 0.41421356237) % 1;
    const x = ((seedX * width + time * (8 + strength * 18) + index * 13) % (width + 260)) - 130;
    const y = height * (0.14 + seedY * 0.68) + Math.sin(time * 0.12 + index) * 20;
    const radius = 44 + (index % 7) * 13 + strength * 72;
    const cloud = context.createRadialGradient(x, y, 0, x, y, radius);
    cloud.addColorStop(0, `rgba(222,244,255,${0.08 + strength * 0.16})`);
    cloud.addColorStop(0.48, `rgba(160,211,239,${0.04 + strength * 0.08})`);
    cloud.addColorStop(1, "rgba(120,178,210,0)");
    context.fillStyle = cloud;
    context.fillRect(x - radius, y - radius, radius * 2, radius * 2);
  }
  const anchorX = anchor[0] * width;
  const anchorY = anchor[1] * height;
  const opening = context.createRadialGradient(anchorX, anchorY, 0, anchorX, anchorY, 110);
  opening.addColorStop(0, `rgba(232,251,255,${0.3 * (1 - strength)})`);
  opening.addColorStop(1, "rgba(200,232,255,0)");
  context.fillStyle = opening;
  context.fillRect(anchorX - 120, anchorY - 120, 240, 240);
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
  const measurement = currentMeasurement(exhibit);
  const signature = [exhibit.id, location.label, location.lat, location.lon, measurement?.value, measurement?.observedAt].join("|");
  if (anchorMarker.dataset.observationSignature !== signature) {
    anchorMarker.dataset.observationSignature = signature;
    anchorMarker.querySelector("[data-live-anchor-source]").textContent = `${exhibit.signalLabel}　${formatValue(measurement)}`;
    anchorMarker.querySelector("[data-live-anchor-label]").textContent = location.label;
    anchorMarker.querySelector("[data-live-anchor-coordinates]").textContent = `${formatJstDateTime(measurement?.observedAt)} · モデル格子 ${Math.abs(location.lat).toFixed(3)}°${location.lat >= 0 ? "N" : "S"} / ${Math.abs(location.lon).toFixed(3)}°${location.lon >= 0 ? "E" : "W"}`;
  }
  const label = anchorMarker.querySelector("span");
  if (!onScreen || !label.getClientRects().length) return;
  const bounds = label.getBoundingClientRect();
  const baseX = bounds.left - (parseFloat(label.style.left) || 0), baseY = bounds.top - (parseFloat(label.style.top) || 0);
  const obstacles = [...layer.querySelectorAll(".gaia-live-metric-legend, .signal-encoding-legend-dock, .gaia-live-exhibit-readout, #gaia-map-zoom-controls, .japan-heading")]
    .filter(node => node.getClientRects().length && getComputedStyle(node).visibility !== "hidden")
    .map(node => node.getBoundingClientRect());
  const core = anchorMarker.querySelector("i").getBoundingClientRect();
  obstacles.push(core);
  const xs = [baseX, core.left - bounds.width - 18, 16, innerWidth - bounds.width - 16];
  const ys = [baseY, ...obstacles.flatMap(box => [box.bottom + 12, box.top - bounds.height - 12])];
  const candidates = xs.flatMap(x => ys.map(y => {
    x = Math.max(16, Math.min(x, innerWidth - bounds.width - 16));
    y = Math.max(16, Math.min(y, innerHeight - bounds.height - 16));
    const overlap = obstacles.reduce((total, box) => total
      + Math.max(0, Math.min(x + bounds.width, box.right + 8) - Math.max(x, box.left - 8))
      * Math.max(0, Math.min(y + bounds.height, box.bottom + 8) - Math.max(y, box.top - 8)), 0);
    return { x, y, score: overlap * 1000 + Math.hypot(x - baseX, y - baseY) };
  }));
  const best = candidates.sort((a, b) => a.score - b.score)[0];
  label.style.left = `${best.x - baseX}px`; label.style.top = `${best.y - baseY}px`;
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
  const projection = getLiveMapProjection();
  const anchor = projectSceneAnchor(location, projection);
  const windPoints = projectWindPoints(projection, measurement);
  const windField = currentWindField();
  const touches = lightTouchUniform(timestamp);
  lightPointer.energy *= lightPointer.down ? 0.992 : 0.965;
  canvas.dataset.anchorLongitude = String(location.lon);
  canvas.dataset.anchorLatitude = String(location.lat);
  canvas.dataset.observationCity = selectedCityId;
  canvas.dataset.anchorNormalizedX = anchor.normalized[0].toFixed(4);
  canvas.dataset.anchorNormalizedY = anchor.normalized[1].toFixed(4);
  canvas.dataset.signalStrength = strength.toFixed(4);
  canvas.dataset.signalKey = exhibit.key;
  updateCityMarkers(projection);
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
      windPoints,
      windFieldSource: windField.source || "unavailable",
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
    else if (exhibit.id === "temperature-field") drawTemperature(width, height, time, strength, particleRatio, anchor.normalized);
    else if (exhibit.id === "cloud-drift") drawCloud(width, height, time, strength, particleRatio, anchor.normalized);
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
  const missing = !measurement || measurement.value == null || !Number.isFinite(Number(measurement.value));
  const pending = state.requestState === "loading" || state.source === "loading";
  const retained = !missing && state.requestState === "unavailable";
  const strength = missing ? exhibit.fallback : clamp01(measurement.normalized);
  const location = observationLocation(exhibit, measurement);
  const locationCity = cityForLocation(location);
  const status = pending ? missing ? "LOADING" : "UPDATING"
    : missing ? "UNAVAILABLE" : retained ? "CACHED"
      : STATUS_LABELS[measurement?.status] || (state.connected ? "NEAR REAL TIME" : "SNAPSHOT");
  const savedMeasurement = measurement?.status === "snapshot";
  const modelMeasurement = measurement?.sourceKind === "MODEL";
  const feedState = pending ? missing ? "CONNECTING / データを取得中" : "UPDATING / 前回値を表示して更新中"
    : retained ? "CACHED VALUE / 前回取得値を表示中"
    : missing ? state.source === "snapshot" ? "NOT IN SNAPSHOT / この地点の保存値は未収録" : "UNAVAILABLE / データを取得できませんでした"
    : state.connected && !savedMeasurement
    ? modelMeasurement ? "LATEST MODEL / 5分ごとに再確認" : "NEAR REAL TIME / 5分ごとに再確認"
    : state.source === "live"
      ? "LATEST API SNAPSHOT / 再接続中"
      : "SAVED SNAPSHOT / 保存データを再現中";
  const observedAt = formatJstDateTime(measurement?.observedAt);
  readout.dataset.missing = String(missing);
  readout.dataset.requestState = state.requestState || "ready";
  readout.dataset.exhibit = exhibit.id;
  readout.style.setProperty("--live-signal-level", String(strength));
  readout.querySelector("[data-live-exhibit-kicker]").textContent = `${exhibit.number} / ${status}`;
  const [titleJa, titleEn = ""] = exhibit.title.split(" — ");
  const exhibitTitle = readout.querySelector("[data-live-exhibit-title]");
  exhibitTitle.setAttribute("aria-label", exhibit.title);
  exhibitTitle.querySelector("[data-live-exhibit-title-ja]").textContent = titleJa;
  exhibitTitle.querySelector("[data-live-exhibit-title-en]").textContent = titleEn;
  readout.querySelector("[data-live-exhibit-value]").textContent = missing && pending ? "取得中" : formatValue(measurement);
  readout.querySelector("[data-live-exhibit-caption]").textContent = exhibit.caption.replaceAll("東京", locationCity.city);
  readout.querySelector("[data-live-deck-question]").textContent = exhibit.question;
  weatherCredit.querySelector("[data-live-exhibit-feed-state]").textContent = feedState;
  weatherCredit.querySelector("[data-live-exhibit-feed-time]").textContent = missing ? "データ時刻 —" : `データ時刻 ${observedAt}`;
  const [minimum, maximum, defaultUnit, colors] = LIVE_METRIC_SCALES[exhibit.key];
  const unit = measurement?.unit || defaultUnit;
  const metricDate = measurement?.observedAt ? new Date(measurement.observedAt) : null;
  updateMetricLegend(metricLegend, {
    title: exhibit.signalLabel,
    scope: location.label,
    period: missing || !metricDate || !Number.isFinite(metricDate.getTime()) ? "" : new Intl.DateTimeFormat("ja-JP", {
      timeZone: "Asia/Tokyo", hour: "2-digit", minute: "2-digit", hourCycle: "h23",
    }).format(metricDate) + " JST",
    current: missing ? pending ? "取得中" : "未取得" : formatValue(measurement),
    value: missing ? null : Number(measurement.value), minimum, maximum,
    minimumLabel: `${minimum} ${unit}`,
    maximumLabel: `${maximum}${exhibit.key === "weatherWindSpeed" ? "+" : ""} ${unit}`,
    gradient: `linear-gradient(90deg, ${colors})`,
    description: `${feedState}。${observedAt}。選択した代表地点のモデル値。針は値を示し、範囲を超える場合は端で止まります。`,
  });
  readout.querySelector("[data-live-exhibit-feed-copy]").textContent = pending
    ? missing ? "選択した地点のデータを取得しています。別の地点の値で補わず、到着した値から表示します。"
      : "同じ地点の前回取得値を表示しながら更新しています。データ時刻は前回取得値のものです。"
    : retained ? "再取得できなかったため、同じ地点の前回取得値とそのデータ時刻を表示しています。"
    : missing ? state.source === "snapshot" ? "この地点の値は保存データに収録されていません。保存値のある地点を選ぶか、ライブ接続で確認してください。"
      : "選択した地点のデータを取得できませんでした。別の地点の値で置き換えず、次の更新を待ちます。"
    : state.connected && !savedMeasurement
    ? exhibit.refreshCopy
    : state.source === "live"
      ? `この項目は保存済み${modelMeasurement ? "モデル" : "観測"}値です。ライブ取得できた項目だけを5分ごとに更新し、混在状態を明示します。`
      : `現在は保存済み${modelMeasurement ? "モデル" : "観測"}データの再現です。準リアルタイム接続時も、取得できない項目はこの状態を明示します。`;
  readout.querySelector("[data-live-exhibit-scale]").textContent = exhibit.scaleLabel;
  readout.querySelector("[data-live-stage-signal]").textContent = missing ? pending ? "LOADING" : "STANDBY" : formatValue(measurement);
  readout.querySelector("[data-live-stage-location]").textContent = location.label;
  readout.querySelector("[data-live-stage-coordinates]").textContent = `${Math.abs(location.lat).toFixed(1)}°${location.lat >= 0 ? "N" : "S"}`;
  readout.querySelector("[data-live-stage-visual]").textContent = exhibit.visualCue;
  readout.querySelector("[data-live-exhibit-input]").textContent = missing
    ? pending ? `${exhibit.signalLabel}を取得中です。値が届くまで待機演出を表示します。` : `${exhibit.signalLabel}は未取得です。待機演出を表示しています。`
    : `${exhibit.signalLabel} ${formatValue(measurement)}を変換の起点にします。`;
  readout.querySelector("[data-live-exhibit-location]").textContent = `${location.label}（${location.lat.toFixed(3)}°, ${location.lon.toFixed(3)}°）を地図上の発生点として表示します。`;
  readout.querySelector("[data-live-exhibit-visual-map]").textContent = exhibit.visualMap;
  readout.querySelector("[data-live-exhibit-source]").textContent = measurement
    ? `${measurement.provider?.toUpperCase() || "SOURCE"} · ${measurement.datasetId || "PUBLIC DATA"}`
    : pending ? "SOURCE DATA LOADING · VISUAL SCAN STANDBY" : "SOURCE DATA UNAVAILABLE · VISUAL SCAN STANDBY";
  readout.querySelector("[data-live-exhibit-time]").textContent = observedAt;
  readout.querySelector("[data-live-deck-number]").textContent = exhibit.number;
  readout.querySelector("[data-live-deck-title]").textContent = exhibit.shortTitle;
  readout.querySelector("[data-live-deck-location]").textContent = location.label;
  readout.querySelector(".gaia-live-place-selector").title = `${location.label} · ${Math.abs(location.lat).toFixed(4)}°${location.lat >= 0 ? "N" : "S"} / ${Math.abs(location.lon).toFixed(4)}°${location.lon >= 0 ? "E" : "W"}`;
  readout.querySelectorAll("[data-live-poi-step]").forEach((button) => {
    const direction = Number(button.dataset.livePoiStep) || 0;
    const target = adjacentObservationCity(selectedCityId, direction);
    button.setAttribute("aria-label", `${direction < 0 ? "前" : "次"}の観測地点、${target.code} ${formatPrefecturePlace(target.prefecture, target.city)}へ送る`);
  });
  if (cityPicker) {
    cityPicker.dataset.city = selectedCityId;
    weatherCredit.querySelector("[data-live-cams-credit]").hidden = !["forecastCo2", "pm25"].includes(exhibit.key);
    placePicker?.sync(selectedCityId);
  }
};

const applyHeading = () => {
  if (activeIndex < 0) return;
  const exhibit = EXHIBITS[activeIndex];
  layer.style.setProperty("--map-accent", exhibit.accent);
  layer.style.setProperty("--map-accent-rgb", exhibit.rgb);
  document.querySelector("#japan-mode-number").textContent = exhibit.number;
  document.querySelector("#japan-mode-title").textContent = exhibit.shortTitle;
  const mapTitle = document.querySelector("#japan-title");
  mapTitle.dataset.exhibitNumber = exhibit.number;
  mapTitle.textContent = exhibit.shortTitle;
  mapTitle.setAttribute("aria-label", `${exhibit.number} ${exhibit.shortTitle}`);
  chapterSelectorToggle?.setAttribute("aria-label", `${exhibit.number} ${exhibit.shortTitle}。展示一覧を開く`);
  buttons.forEach((button, index) => button.setAttribute("aria-current", String(index === activeIndex)));
  globalThis.GaiaMapCategories.buttons().filter((button) => !button.dataset.liveExhibit).forEach((button) => button.setAttribute("aria-current", "false"));
  const modeButtons = globalThis.GaiaMapCategories.buttons();
  const activeButtonIndex = modeButtons.findIndex((button) => button.getAttribute("aria-current") === "true");
  readout?.querySelectorAll("[data-live-deck-step]").forEach((button) => {
    if (activeButtonIndex < 0 || modeButtons.length < 2) return;
    const direction = Number(button.dataset.liveDeckStep) || 0;
    const target = modeButtons[(activeButtonIndex + direction + modeButtons.length) % modeButtons.length];
    button.setAttribute("aria-label", `${direction < 0 ? "前" : "次"}の展示、${target.getAttribute("aria-label") || target.textContent?.trim() || "地図展示"}`);
  });
  const legend = document.querySelector("[data-signal-encoding-legend]");
  const legendTitle = document.querySelector("[data-signal-encoding-legend-title]");
  const mobileLegendToggle = document.querySelector("#map-mobile-legend-toggle");
  if (legend) {
    const labels = exhibit.id === "wind-field"
      ? [
        "色 / 10m風速（青→赤）",
        "暗い地点 / 取得値なし",
        "筆の太さ・明度 / 風速に比例",
        "筆の向き / 風向ではない",
      ]
      : [
        `色と光 / ${exhibit.visualCue}`,
        "待機表示 / 取得値なし",
        `強さ / ${exhibit.scaleLabel}`,
        "発生点 / 都道府県代表都市",
      ];
    ["heatmap", "nodata", "estimate", "resolution"].forEach((key, index) => {
      const item = legend.querySelector(`[data-encoding-label="${key}"]`);
      if (item?.lastChild) item.lastChild.textContent = labels[index];
    });
    legend.dataset.mode = `live-${exhibit.id}`;
    legend.hidden = false;
    if (legendTitle) legendTitle.hidden = false;
    if (mobileLegendToggle) mobileLegendToggle.hidden = false;
  }
};

const clearPoiAutoplayTimer = () => {
  clearTimeout(poiAutoplayTimer);
  poiAutoplayTimer = 0;
};

const clearPoiTransitionTimer = () => {
  clearTimeout(poiTransitionTimer);
  poiTransitionTimer = 0;
};

const clearPoiTransitionPresentation = () => {
  cityMarkerButtons.forEach((button) => button.classList.remove("is-departing", "is-arriving"));
  anchorMarker?.classList.remove("is-departing", "is-arriving");
  if (layer) {
    layer.dataset.livePoiTransition = "settled";
    delete layer.dataset.livePoiFrom;
    delete layer.dataset.livePoiTo;
  }
  if (cityPicker) delete cityPicker.dataset.transition;
};

const schedulePoiAutoplay = (delay = LIVE_POI_DWELL_MS) => {
  clearPoiAutoplayTimer();
  if (!layer) return;
  const canRun = poiAutoplayEnabled && activeIndex >= 0 && !document.hidden;
  layer.dataset.livePoiAutoplay = canRun ? "running" : "paused";
  if (!canRun) return;
  const safeDelay = Math.max(1200, Number(delay) || LIVE_POI_DWELL_MS);
  layer.style.setProperty("--live-poi-dwell", `${safeDelay}ms`);
  poiAutoplayTimer = window.setTimeout(() => {
    poiAutoplayTimer = 0;
    if (activeIndex < 0 || document.hidden || !poiAutoplayEnabled) return;
    const nextCity = adjacentObservationCity(selectedCityId, 1);
    selectObservationCity(nextCity.id, { source: "auto" });
  }, safeDelay);
};

const setPoiAutoplayEnabled = (enabled) => {
  poiAutoplayEnabled = Boolean(enabled && !reducedMotion);
  if (poiAutoplayEnabled) schedulePoiAutoplay();
  else {
    clearPoiAutoplayTimer();
    if (layer) layer.dataset.livePoiAutoplay = "paused";
  }
  return poiAutoplayEnabled;
};

const selectObservationCity = (cityId, {
  source = "manual",
  animate = true,
  force = false,
} = {}) => {
  const nextCity = findObservationCity(cityId);
  if (!nextCity) return false;
  if (source === "manual") {
    resumePoiAfterPicker = false;
    setPoiAutoplayEnabled(false);
    globalThis.GaiaMapDemo?.stop?.("interaction");
  }
  const previousCity = selectedCity();
  if (!force && previousCity.id === nextCity.id) {
    if (["departing", "arriving"].includes(layer?.dataset.livePoiTransition)) {
      poiTransitionGeneration += 1;
      clearPoiTransitionTimer();
      clearPoiTransitionPresentation();
      if (cityPicker) {
        cityPicker.dataset.state = "ready";
        placePicker?.sync(nextCity.id);
      }
      renderReadout();
      draw(performance.now(), true);
    }
    schedulePoiAutoplay();
    return true;
  }

  const generation = ++poiTransitionGeneration;
  clearPoiAutoplayTimer();
  clearPoiTransitionTimer();
  clearPoiTransitionPresentation();
  const previousButton = cityMarkerButtons.find((button) => button.dataset.liveCityMarker === previousCity.id);
  const nextButton = cityMarkerButtons.find((button) => button.dataset.liveCityMarker === nextCity.id);
  layer.dataset.livePoiTransition = animate && !reducedMotion ? "departing" : "arriving";
  layer.dataset.livePoiFrom = previousCity.code;
  layer.dataset.livePoiTo = nextCity.code;
  layer.dataset.livePoiSource = source;
  cityPicker.dataset.transition = "departing";
  previousButton?.classList.add("is-departing");
  anchorMarker?.classList.add("is-departing");
  if (cityPicker) {
    cityPicker.dataset.state = "loading";
    placePicker?.sync(nextCity.id);
    cityPicker.querySelector(".gaia-live-place-selector").title = `${formatPrefecturePlace(nextCity.prefecture, nextCity.city)}へ移動中`;
  }

  dispatchEvent(new CustomEvent("gaia:live-poi-change", {
    detail: { from: previousCity.id, to: nextCity.id, code: nextCity.code, source, phase: "departing" },
  }));

  const commit = () => {
    if (generation !== poiTransitionGeneration || activeIndex < 0) return;
    selectedCityId = nextCity.id;
    cityMarkerButtons.forEach((button) => {
      button.setAttribute("aria-current", String(button.dataset.liveCityMarker === nextCity.id));
    });
    previousButton?.classList.add("is-departing");
    nextButton?.classList.add("is-arriving");
    anchorMarker?.classList.remove("is-departing");
    anchorMarker?.classList.add("is-arriving");
    layer.dataset.livePoiTransition = "arriving";
    cityPicker.dataset.transition = "arriving";
    void globalThis.GaiaLiveData?.selectCity?.(nextCity.id);
    renderReadout();
    draw(performance.now(), true);
    dispatchEvent(new CustomEvent("gaia:live-poi-change", {
      detail: { from: previousCity.id, to: nextCity.id, code: nextCity.code, source, phase: "arriving" },
    }));
    poiTransitionTimer = window.setTimeout(() => {
      if (generation !== poiTransitionGeneration || activeIndex < 0) return;
      clearPoiTransitionPresentation();
      dispatchEvent(new CustomEvent("gaia:live-poi-change", {
        detail: { from: previousCity.id, to: nextCity.id, code: nextCity.code, source, phase: "settled" },
      }));
      schedulePoiAutoplay();
    }, reducedMotion ? 0 : LIVE_POI_ARRIVE_MS);
  };

  if (animate && !reducedMotion) poiTransitionTimer = window.setTimeout(commit, LIVE_POI_DEPART_MS);
  else commit();
  return true;
};

const select = (index) => {
  if (!EXHIBITS[index]) return;
  placePicker?.close({ restoreFocus: false });
  globalThis.GaiaFirmsExhibit?.deactivate?.();
  const enteringLiveDeck = activeIndex < 0;
  if (enteringLiveDeck) {
    savedHeading = {
      number: document.querySelector("#japan-mode-number")?.textContent || "06",
      title: document.querySelector("#japan-mode-title")?.textContent || "積み重なるCO₂",
    };
    selectedCityId = globalThis.GaiaLiveData?.getCity?.() || selectedCityId;
    poiAutoplayEnabled = !reducedMotion;
  }
  activeIndex = index;
  const exhibit = EXHIBITS[index];
  layer.classList.add("is-live-exhibit");
  layer.dataset.liveExhibit = exhibit.id;
  lightTouches = [];
  lightPointer.energy = 0;
  canvas.dataset.lightTouchCount = "0";
  canvas.hidden = false;
  readout.hidden = false;
  cityPicker.hidden = false;
  metricLegend.hidden = false;
  weatherCredit.hidden = false;
  cityMarkersLayer.hidden = false;
  setMobileReadoutExpanded(false);
  applyHeading();
  globalThis.GaiaMapObservationAdapter?.focusEarthLocation?.(japanPrefectureView(innerWidth));
  if (enteringLiveDeck) {
    selectObservationCity(selectedCityId, {
      source: "entry",
      animate: false,
      force: true,
    });
  } else {
    renderReadout();
    lastRenderedAt = 0;
    draw(performance.now(), true);
    schedulePoiAutoplay();
  }
  dispatchEvent(new CustomEvent("gaia:live-exhibit-change", { detail: { index, id: exhibit.id } }));
  queueMicrotask(applyHeading);
};

const deactivate = ({ number, title } = {}) => {
  if (activeIndex < 0) return;
  clearPoiAutoplayTimer();
  clearPoiTransitionTimer();
  poiTransitionGeneration += 1;
  clearPoiTransitionPresentation();
  activeIndex = -1;
  placePicker?.close({ restoreFocus: false });
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
  if (cityPicker) cityPicker.hidden = true;
  if (metricLegend) metricLegend.hidden = true;
  if (weatherCredit) weatherCredit.hidden = true;
  if (cityMarkersLayer) cityMarkersLayer.hidden = true;
  if (layer) {
    delete layer.dataset.livePoiAutoplay;
    delete layer.dataset.livePoiSource;
    layer.style.removeProperty("--live-poi-dwell");
  }
  setMobileReadoutExpanded(false);
  if (anchorMarker) anchorMarker.hidden = true;
  buttons.forEach((button) => button.setAttribute("aria-current", "false"));
  layer.style.removeProperty("--map-accent");
  layer.style.removeProperty("--map-accent-rgb");
  const restored = number && title ? { number, title } : savedHeading;
  if (restored) {
    document.querySelector("#japan-mode-number").textContent = restored.number;
    document.querySelector("#japan-mode-title").textContent = restored.title;
    const mapTitle = document.querySelector("#japan-title");
    mapTitle.dataset.exhibitNumber = restored.number;
    mapTitle.textContent = restored.title;
    mapTitle.setAttribute("aria-label", `${restored.number} ${restored.title}`);
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
  cityMarkersLayer = document.createElement("div");
  cityMarkersLayer.className = "gaia-live-city-markers";
  cityMarkersLayer.hidden = true;
  cityMarkersLayer.setAttribute("aria-label", "都道府県コード順のライブ観測地点");
  cityMarkerButtons = OBSERVATION_CITIES.map((city) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "gaia-live-city-marker";
    button.dataset.liveCityMarker = city.id;
    button.dataset.prefectureCode = city.code;
    button.setAttribute("aria-label", `${city.code} ${formatPrefecturePlace(city.prefecture, city.city)}の観測データを表示`);
    button.setAttribute("aria-current", String(city.id === selectedCityId));
    button.innerHTML = `<i aria-hidden="true"></i><span><strong>${formatPrefecturePlace(city.prefecture, city.city)}</strong><b data-live-marker-value>値は未取得</b><small data-live-marker-detail>地点を選んで取得</small></span>`;
    button.addEventListener("pointerdown", (event) => {
      event.stopPropagation();
      setPoiAutoplayEnabled(false);
      globalThis.GaiaMapDemo?.stop?.("interaction");
    });
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      selectObservationCity(city.id);
    });
    cityMarkersLayer.append(button);
    return button;
  });
  map.append(cityMarkersLayer);
  anchorMarker = document.createElement("div");
  anchorMarker.className = "gaia-live-exhibit-anchor";
  anchorMarker.hidden = true;
  anchorMarker.setAttribute("aria-hidden", "true");
  anchorMarker.innerHTML = `<i></i><span><b data-live-anchor-source>MODEL GRID</b><strong data-live-anchor-label>TOKYO</strong><small data-live-anchor-coordinates>35.676°N / 139.650°E</small></span>`;
  map.append(anchorMarker);
  metricLegend = createMetricLegend({ className: "gaia-live-metric-legend", label: "選択した都道府県のモデル値と目盛り" });
  metricLegend.hidden = true;
  layer.append(metricLegend);
  weatherCredit = document.createElement("div");
  weatherCredit.className = "gaia-live-weather-credit";
  weatherCredit.hidden = true;
  weatherCredit.innerHTML = `
    <div class="gaia-live-data-credit" aria-label="気象データのクレジット">
      <a data-live-cams-credit href="https://ads.atmosphere.copernicus.eu/" target="_blank" rel="noopener noreferrer" aria-label="Copernicus Atmosphere Monitoring Service (CAMS)" hidden>CAMS</a>
      <a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer">Open-Meteo</a>
      <span aria-hidden="true">·</span>
      <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer">CC BY 4.0</a>
      <span>／加工表示</span>
    </div>
    <div class="gaia-live-data-freshness" aria-label="データの取得状態と時刻" aria-live="polite">
      <strong data-live-exhibit-feed-state></strong>
      <time data-live-exhibit-feed-time></time>
    </div>
  `;
  layer.querySelector(".japan-credits").append(weatherCredit);
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
    <div class="gaia-live-deck-chapter">
      <p>CHAPTER / LIVE MAP</p>
      <div>
        <button type="button" data-live-deck-step="-1" aria-label="一つ前のライブ展示へ">‹</button>
        <button class="gaia-live-deck-selector-toggle" data-map-bank-toggle type="button" aria-expanded="false" aria-controls="map-dock-bank-popover" aria-label="15 街を通る風。展示一覧を開く">
          <span data-live-deck-number>15</span>
          <strong data-live-deck-title>街を通る風</strong>
        </button>
        <button type="button" data-live-deck-step="1" aria-label="一つ次のライブ展示へ">›</button>
      </div>
    </div>
    <div class="gaia-live-deck-location gaia-live-prefecture-picker">
      <p>都道府県</p>
      <div class="gaia-live-deck-location-control">
        <button type="button" data-live-poi-step="-1" aria-label="前の観測地点へ">‹</button>
        <button type="button" class="gaia-live-place-selector" aria-label="都道府県を選ぶ">
          <strong data-live-deck-location aria-hidden="true">北海道（札幌市）</strong>
        </button>
        <button type="button" data-live-poi-step="1" aria-label="次の観測地点へ">›</button>
      </div>
    </div>
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
    <section class="gaia-live-deck-question" aria-labelledby="gaia-live-deck-question-label">
      <span id="gaia-live-deck-question-label">この地図で確かめること</span>
      <strong data-live-deck-question></strong>
    </section>
    <div class="gaia-live-deck-actions gaia-live-exhibit-actions">
      <button type="button" data-live-deck-source aria-label="データの出典を表示する"></button>
      <button type="button" data-live-deck-analysis></button>
    </div>
    <button class="gaia-live-mobile-toggle" id="gaia-live-mobile-toggle" type="button" aria-expanded="false" aria-controls="gaia-live-exhibit-details">
      <span>DETAIL</span><strong>詳細</strong><i aria-hidden="true"></i>
    </button>
    <div class="gaia-live-exhibit-signal" aria-label="観測値の変換強度">
      <span><i></i></span>
      <small data-live-exhibit-scale></small>
    </div>
    <div class="gaia-live-exhibit-details" id="gaia-live-exhibit-details">
    <section class="gaia-live-exhibit-explanation" aria-label="展示の説明と観測状態">
      <p class="gaia-live-exhibit-summary" data-live-exhibit-caption></p>
      <p data-live-exhibit-feed-copy></p>
    </section>
    <ol class="gaia-live-exhibit-path" aria-label="観測データから光への変換経路">
      <li data-live-stage="observe">
        <span>01</span>
        <i class="gaia-live-stage-symbol" aria-hidden="true"><svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="5"/><circle cx="32" cy="32" r="16"/><circle cx="32" cy="32" r="27"/></svg></i>
        <b>観測</b><em data-live-stage-signal>—</em>
        <p class="gaia-live-exhibit-a11y" data-live-exhibit-input></p>
      </li>
      <li data-live-stage="locate">
        <span>02</span>
        <i class="gaia-live-stage-symbol" aria-hidden="true"><svg viewBox="0 0 64 64"><circle cx="32" cy="27" r="9"/><path d="M32 5c-13 0-23 10-23 23 0 17 23 31 23 31s23-14 23-31C55 15 45 5 32 5Z"/></svg></i>
        <b>地図</b><em data-live-stage-location>TOKYO</em><small data-live-stage-coordinates>35.7°N</small>
        <p class="gaia-live-exhibit-a11y" data-live-exhibit-location></p>
      </li>
      <li data-live-stage="visualize">
        <span>03</span>
        <i class="gaia-live-stage-symbol" aria-hidden="true"><svg viewBox="0 0 64 64"><path d="M4 21c10-12 18 12 28 0s18 12 28 0M4 33c10-12 18 12 28 0s18 12 28 0M4 45c10-12 18 12 28 0s18 12 28 0"/></svg></i>
        <b>光</b><em data-live-stage-visual>流線</em>
        <p class="gaia-live-exhibit-a11y" data-live-exhibit-visual-map></p>
      </li>
    </ol>
    <footer><span data-live-exhibit-source></span><time data-live-exhibit-time></time></footer>
    </div>
  `;
  decorateMapActions(readout.querySelector(".gaia-live-deck-actions"), readout.querySelector("[data-live-deck-source]"), readout.querySelector("[data-live-deck-analysis]"));
  cityPicker = readout.querySelector(".gaia-live-prefecture-picker");
  layer.append(readout);
  placePicker = createObservationPlacePicker({
    container: layer,
    trigger: cityPicker.querySelector(".gaia-live-place-selector"),
    getSelected: () => selectedCityId,
    onSelect: cityId => selectObservationCity(cityId, { source: "manual" }),
    onOpen: () => {
      resumePoiAfterPicker = poiAutoplayEnabled;
      setPoiAutoplayEnabled(false);
    },
    onClose: () => {
      if (resumePoiAfterPicker && activeIndex >= 0 && !layer.hidden && layer.getAttribute("aria-hidden") !== "true") setPoiAutoplayEnabled(true);
      resumePoiAfterPicker = false;
    },
  });
  new ResizeObserver(updateLiveCreditPosition).observe(readout);
  addEventListener("resize", updateLiveCreditPosition, { passive: true });
  chapterSelectorToggle = readout.querySelector(".gaia-live-deck-selector-toggle");
  // The title delegates to the same category picker as all other providers.
  readout.querySelectorAll("[data-live-deck-step]").forEach((button) => {
    button.addEventListener("click", () => {
      const modeButtons = globalThis.GaiaMapCategories.buttons();
      const activeButtonIndex = modeButtons.findIndex((candidate) => candidate.getAttribute("aria-current") === "true");
      if (activeButtonIndex < 0 || !modeButtons.length) return;
      modeButtons[(activeButtonIndex + Number(button.dataset.liveDeckStep) + modeButtons.length) % modeButtons.length]?.click();
    });
  });
  mobileReadoutToggle = readout.querySelector("#gaia-live-mobile-toggle");
  mobileReadoutToggle?.addEventListener("click", () => {
    setMobileReadoutExpanded(mobileReadoutToggle.getAttribute("aria-expanded") !== "true");
  });
  dispatchEvent(new CustomEvent("gaia:live-exhibit-mounted"));

  [readout].forEach((container) => {
    container?.querySelectorAll("[data-live-poi-step]").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        const direction = Number(button.dataset.livePoiStep) || 0;
        const target = adjacentObservationCity(selectedCityId, direction);
        selectObservationCity(target.id, { source: "manual" });
      });
    });
  });

  map.addEventListener("pointerdown", (event) => {
    if (activeIndex < 0) return;
    if (event.target instanceof Element && event.target.closest(".gaia-live-city-marker")) return;
    lightPointer.down = true;
    updateLightPointer(event, { touch: true });
  }, { capture: true });
  map.addEventListener("pointermove", (event) => {
    if (activeIndex < 0) return;
    updateLightPointer(event);
  }, { capture: true });
  map.addEventListener("pointerup", (event) => {
    if (activeIndex < 0) return;
    updateLightPointer(event);
    lightPointer.down = false;
    if (event.pointerType !== "mouse") lightPointer.active = 0;
  }, { capture: true });
  map.addEventListener("pointercancel", (event) => {
    if (activeIndex < 0) return;
    lightPointer.down = false;
    lightPointer.active = 0;
  }, { capture: true });
  map.addEventListener("pointerleave", () => {
    lightPointer.down = false;
    lightPointer.active = 0;
  });
  map.addEventListener("keydown", (event) => {
    if (activeIndex < 0 || !["Enter", " "].includes(event.key)) return;
    if (event.target instanceof Element && event.target !== map
      && event.target.closest("button, input, select, textarea, [role='button'], [role='slider'], a[href]")) return;
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

  document.querySelector(".map-mode-bank").addEventListener("click", (event) => {
    const button = event.target instanceof Element ? event.target.closest(".map-mode-button[data-map-standard-index]") : null;
    if (!(button instanceof HTMLButtonElement) || activeIndex < 0) return;
    const standards = globalThis.GaiaMapCategories.standardButtons();
    const index = standards.indexOf(button);
    const mode = globalThis.GaiaAppContent?.modes?.[index];
    deactivate({ number: button.textContent.trim(), title: mode?.titleJa || button.getAttribute("aria-label") || "展示" });
  }, { capture: true });

  addEventListener("gaia:live-update", () => {
    renderReadout();
    if (activeIndex >= 0 && !frame) draw();
  });
  addEventListener("gaia:live-wind-field", (event) => {
    windFieldSnapshot = event.detail || { source: "unavailable", points: [] };
    if (activeIndex >= 0) {
      renderReadout();
      draw(performance.now(), true);
    }
  });
  addEventListener("gaia:live-prefecture-field", () => renderReadout());
  addEventListener("gaia:live-city-change", (event) => {
    if (findObservationCity(event.detail?.city)) selectedCityId = event.detail.city;
    if (cityPicker) cityPicker.dataset.state = event.detail?.state || "ready";
    if (activeIndex >= 0) {
      renderReadout();
      draw(performance.now(), true);
    }
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
  addEventListener("resize", () => {
    if (activeIndex >= 0) draw(performance.now(), true);
  }, { passive: true });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      clearPoiAutoplayTimer();
      if (layer && activeIndex >= 0) layer.dataset.livePoiAutoplay = "paused";
      return;
    }
    if (activeIndex >= 0) {
      draw(performance.now(), true);
      schedulePoiAutoplay();
    }
  });
  addEventListener("gaia:map-playback-resume", () => { if (activeIndex >= 0) setPoiAutoplayEnabled(true); });
};

if (globalThis.GaiaMapObservationAdapter) mount();
else addEventListener("gaia:map-adapter-ready", mount, { once: true });

globalThis.GaiaLiveExhibits = Object.freeze({
  mount,
  select,
  deactivate,
  redraw: () => draw(performance.now(), true),
  reflowObservationLabel: () => {
    if (activeIndex < 0 || !anchorMarker || anchorMarker.hidden) return;
    const exhibit = EXHIBITS[activeIndex], location = observationLocation(exhibit, currentMeasurement(exhibit));
    updateAnchorMarker(exhibit, location, projectSceneAnchor(location));
  },
  selectObservationPoint: (cityId) => selectObservationCity(cityId, { source: "manual" }),
  pausePoiAutoplay: () => setPoiAutoplayEnabled(false),
  resumePoiAutoplay: () => setPoiAutoplayEnabled(true),
  observationPoints: OBSERVATION_CITIES,
  definitions: EXHIBITS,
});

export { mount };
