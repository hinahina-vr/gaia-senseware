const views = new Map(Array.from(document.querySelectorAll("[data-view]"), (element) => [element.dataset.view, element]));
const statusRegion = document.querySelector("#sensor-status");
const loginButton = document.querySelector("#google-login");
const trialLoginButton = document.querySelector("#trial-login");
const participationInfoOpen = document.querySelector("#participation-info-open");
const participationDialog = document.querySelector("#participation-info");
const logoutButton = document.querySelector("#sensor-logout");
const profileNav = document.querySelector("#profile-nav");
const accountNote = document.querySelector("#sensor-account-note");
const upgradeGoogleButton = document.querySelector("#upgrade-google");
const showAddButton = document.querySelector("#show-add");
const deviceList = document.querySelector("#device-list");
const emptyState = document.querySelector("#device-empty");
const deviceForm = document.querySelector("#device-form");
const locationForm = document.querySelector("#location-form");
const pairingCode = document.querySelector("#pairing-code");
const pairingExpiry = document.querySelector("#pairing-expiry");
const cardTemplate = document.querySelector("#device-card-template");
const historyList = document.querySelector("#history-list");
const historyChart = document.querySelector("#history-chart");
const latestMetrics = document.querySelector("#latest-metrics");
const publicSensorMap = document.querySelector("#public-sensor-map");
const publicSensorNetwork = document.querySelector("#public-sensor-network");
const publicSensorTethers = document.querySelector("#public-sensor-tethers");
const publicSensorMarkers = document.querySelector("#public-sensor-markers");
const publicSensorList = document.querySelector("#public-sensor-list");
const publicSensorDetail = document.querySelector("#public-sensor-detail");
const publicSensorDirectory = document.querySelector("#public-sensor-directory");
const publicSensorQuery = document.querySelector("#public-sensor-query");
const publicSensorResults = document.querySelector("#public-sensor-results");
const publicSensorEmpty = document.querySelector("#public-sensor-empty");
const publicMapDirectoryToggle = document.querySelector("#public-map-directory-toggle");
const publicMapDirectoryCount = document.querySelector("#public-map-directory-count");
const publicMapRefresh = document.querySelector("#refresh-map");
const publicMapZoomIn = document.querySelector("#public-map-zoom-in");
const publicMapZoomOut = document.querySelector("#public-map-zoom-out");
const publicMapReset = document.querySelector("#public-map-reset");
const publicMapZoomOutput = document.querySelector("#public-map-zoom");
const publicSyncRate = document.querySelector("#public-sync-rate");
const publicActiveNodes = document.querySelector("#public-active-nodes");
const publicPacketCount = document.querySelector("#public-packet-count");
const publicDataVolume = document.querySelector("#public-data-volume");
const publicDepthFill = document.querySelector("#public-depth-fill");
const publicDepthValue = document.querySelector("#public-depth-value");
const profileForm = document.querySelector("#profile-form");
const profileAvatarPreview = document.querySelector("#profile-avatar-preview");
const profileAvatarInput = document.querySelector("#profile-avatar-input");
const publicSensorCount = document.querySelector("#public-sensor-count");
const pollIntervalMs = 2_000;
const naturalEarthCountriesUrl = "../data/natural-earth-50m-countries.geojson?v=gaia-1";
const japanPrefectureUrl = "../data/japan-prefectures.topojson?v=gaia-1";
const publicMapMinZoom = 1;
const publicMapMaxZoom = 96;
const publicMapLongitudeScale = Math.cos(36 * Math.PI / 180);
const publicMapHome = Object.freeze({ longitude: 137.5, latitude: 36, zoom: 4.2 });
const publicMapOverscanRatio = .22;
const publicMapDragRebaseRatio = .18;
const publicMapFocusMinZoom = 7.2;
const publicMapPollIntervalMs = 60_000;
const publicMapCanvasPixelBudget = 12_000_000;
const publicMapMarkerCollisionDistance = 56;
const resonanceDistanceKm = 1_800;
const regionNames = typeof Intl.DisplayNames === "function" ? new Intl.DisplayNames(["ja"], { type: "region" }) : null;
const worldMapView = Object.freeze({ west: -180, east: 180, south: -90, north: 90, key: "WORLD" });
const countryMapViews = Object.freeze({
  JP: Object.freeze({
    west: 105, east: 173, south: 20, north: 48,
    selectionWest: 122, selectionEast: 154, selectionSouth: 20, selectionNorth: 48,
    key: "JP",
  }),
});
const japanPrefectureCentres = Object.freeze({
  "JP-01": [43.1,141.4], "JP-02": [40.8,140.7], "JP-03": [39.7,141.2], "JP-04": [38.3,140.9],
  "JP-05": [39.7,140.1], "JP-06": [38.2,140.4], "JP-07": [37.8,140.5], "JP-08": [36.3,140.4],
  "JP-09": [36.6,139.9], "JP-10": [36.4,139.1], "JP-11": [35.9,139.6], "JP-12": [35.6,140.1],
  "JP-13": [35.7,139.7], "JP-14": [35.4,139.6], "JP-15": [37.9,139.0], "JP-16": [36.7,137.2],
  "JP-17": [36.6,136.6], "JP-18": [36.1,136.2], "JP-19": [35.7,138.6], "JP-20": [36.7,138.2],
  "JP-21": [35.4,136.7], "JP-22": [35.0,138.4], "JP-23": [35.2,136.9], "JP-24": [34.7,136.5],
  "JP-25": [35.0,135.9], "JP-26": [35.0,135.8], "JP-27": [34.7,135.5], "JP-28": [34.7,135.2],
  "JP-29": [34.7,135.8], "JP-30": [34.2,135.2], "JP-31": [35.5,134.2], "JP-32": [35.5,133.1],
  "JP-33": [34.7,133.9], "JP-34": [34.4,132.5], "JP-35": [34.2,131.5], "JP-36": [34.1,134.6],
  "JP-37": [34.3,134.0], "JP-38": [33.8,132.8], "JP-39": [33.6,133.5], "JP-40": [33.6,130.4],
  "JP-41": [33.3,130.3], "JP-42": [32.8,129.9], "JP-43": [32.8,130.7], "JP-44": [33.2,131.6],
  "JP-45": [31.9,131.4], "JP-46": [31.6,130.6], "JP-47": [26.2,127.7],
});
const regionCache = new Map();
const regionLocationCache = new Map();
const regionPlotVersions = new WeakMap();
const mapObservers = [];
const mapViewports = new WeakMap();
const mapRenderers = new WeakMap();
const publicMapCamera = { ...publicMapHome };
const publicMapPointers = new Map();
let publicMapDrag = null;
let publicMapDragFrame = 0;
let publicMapPinch = null;
let publicMapPinchFrame = 0;
let publicMapWheelFrame = 0;
let publicMapWheel = null;
let publicMapFocusFrame = 0;
let publicMapFocusToken = 0;
let publicMapHoverTimer = 0;
let publicMapPollTimer = 0;
let publicSensorFilter = "ALL";
let publicSensorQueryText = "";
let countries = [];
let devices = [];
let selectedDevice = null;
let publicSensors = [];
let publicNetworkStats = { observationPackets: 0, payloadBytes: 0 };
let publicResonancePairs = [];
let selectedPublicSensorId = publicSensorIdFromHash();
let publicSensorSelectionDismissed = false;
let oracleDepthBoost = 0;
let currentProfile = null;
let authenticated = false;
let sessionUser = null;
let pollTimer = 0;
let statusTimer = 0;

const api = async (path, options = {}) => {
  const { body: requestBody, rawBody, ...requestOptions } = options;
  const headers = new Headers(options.headers);
  if (requestBody !== undefined) headers.set("Content-Type", "application/json");
  if (options.method && options.method !== "GET" && options.method !== "HEAD") {
    const csrf = readCookie("__Host-gaia_sensor_csrf");
    if (csrf) headers.set("X-CSRF-Token", csrf);
  }
  const response = await fetch(path, {
    credentials: "include",
    ...requestOptions,
    headers,
    body: rawBody ?? (requestBody === undefined ? undefined : JSON.stringify(requestBody)),
  });
  if (response.status === 204) return null;
  const body = await response.json().catch(() => null);
  if (!response.ok) {
    const error = new Error(body?.error?.message || "通信に失敗しました。");
    error.code = body?.error?.code || "REQUEST_FAILED";
    error.status = response.status;
    throw error;
  }
  return body;
};

const showView = (name) => {
  if (participationDialog?.open && name !== "login") participationDialog.close();
  window.clearInterval(pollTimer);
  pollTimer = 0;
  window.clearInterval(publicMapPollTimer);
  publicMapPollTimer = 0;
  for (const [key, element] of views) element.hidden = key !== name;
  document.querySelectorAll("[data-nav]").forEach((link) => {
    link.toggleAttribute("aria-current", link.dataset.nav === name);
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
  if (name === "map") {
    requestAnimationFrame(updatePublicMapViewport);
    publicMapPollTimer = window.setInterval(() => {
      void loadPublicSensors({ preserveSelection: true, quiet: true }).catch(() => {});
    }, publicMapPollIntervalMs);
  }
};

const showStatus = (message, kind = "info") => {
  window.clearTimeout(statusTimer);
  statusRegion.hidden = false;
  statusRegion.dataset.kind = kind;
  statusRegion.textContent = message;
  statusTimer = window.setTimeout(() => { statusRegion.hidden = true; }, kind === "error" ? 6_000 : 2_800);
};

const boot = async () => {
  showView("loading");
  initPublicMapNavigation();
  initPublicSensorDirectory();
  void mountMapSurfaces();
  initLocationPickers();
  initRegionFields();
  await loadPublicSensors().catch((error) => showStatus(error.message, "error"));
  try {
    const session = await api("../api/web/v1/session");
    authenticated = true;
    sessionUser = session.user;
    syncAccountUi();
    const accountLoads = [loadCountries(), loadDevices()];
    if (sessionUser.accountKind !== "trial") accountLoads.push(loadProfile());
    await Promise.all(accountLoads);
    routeFromHash();
  } catch (error) {
    authenticated = false;
    sessionUser = null;
    syncAccountUi();
    if (error.status === 401) {
      if (location.hash.startsWith("#map")) showView("map");
      else if (location.hash === "#guide") showView("guide");
      else if (location.hash === "#terms") showView("terms");
      else showView("login");
    }
    else {
      showView("login");
      showStatus(error.message, "error");
    }
  }
};

const loadCountries = async () => {
  const response = await api("../api/web/v1/countries");
  countries = response.countries;
  document.querySelectorAll("select[name='countryCode']").forEach((select) => {
    const initial = select.value;
    select.replaceChildren();
    if (select.closest("#device-form")) select.append(new Option("選択してください", ""));
    countries.forEach((country) => {
      const localized = country.nameLocal || (country.nameEn === country.code ? regionNames?.of(country.code) : country.nameEn);
      select.append(new Option(localized || country.code, country.code));
    });
    select.value = initial;
  });
};

const loadDevices = async () => {
  const response = await api("../api/web/v1/devices");
  devices = response.devices;
  deviceList.replaceChildren();
  emptyState.hidden = devices.length > 0;
  devices.forEach((device, index) => {
    const fragment = cardTemplate.content.cloneNode(true);
    const card = fragment.querySelector("article");
    card.dataset.nodeIndex = String(index + 1).padStart(2, "0");
    card.dataset.state = device.state;
    const state = fragment.querySelector(".sensor-state");
    state.textContent = device.state;
    state.dataset.state = device.state;
    fragment.querySelector("small").textContent = device.deviceId;
    fragment.querySelector("h2").textContent = device.name;
    fragment.querySelector("p").textContent = locationLabel(device);
    fragment.querySelector("button").addEventListener("click", () => openDetail(device.deviceId));
    card.dataset.deviceId = device.deviceId;
    deviceList.append(fragment);
  });
};

const loadPublicSensors = async ({ preserveSelection = true, quiet = false } = {}) => {
  const response = await api("../api/public/v1/sensors");
  publicSensors = response.sensors;
  publicNetworkStats = response.stats ?? { observationPackets: 0, payloadBytes: 0 };
  if (!preserveSelection) selectedPublicSensorId = null;
  renderPublicSensors();
  if (!quiet && views.get("map") && !views.get("map").hidden) updatePublicMapViewport();
};

const renderPublicSensors = () => {
  publicSensorMarkers.replaceChildren();
  publicSensorList.replaceChildren();
  const linkedSensorId = publicSensorIdFromHash();
  let linkedSensorFound = !linkedSensorId;
  publicSensors.forEach((sensor) => {
    sensor.visualType = publicSensorType(sensor);
    sensor.visualObservations = publicObservationsFor(sensor);
  });
  publicResonancePairs = buildPublicResonancePairs(publicSensors);
  const onlineCount = publicSensors.filter((sensor) => !sensor.isDemo && sensor.state === "ONLINE").length;
  const demoCount = publicSensors.filter((sensor) => sensor.isDemo).length;
  const offlineCount = publicSensors.length - onlineCount - demoCount;
  publicSensorCount.textContent = `${String(publicSensors.length).padStart(3, "0")} NODES · ${onlineCount} ONLINE · ${demoCount} DEMO · ${offlineCount} OFFLINE`;
  renderPublicNetworkStats();
  if (!publicSensors.length) {
    selectedPublicSensorId = null;
    if (linkedSensorId) setPublicSensorHash(null, { replace: true });
    publicSensorNetwork?.replaceChildren();
    publicSensorDetail.replaceChildren(
      Object.assign(document.createElement("small"), { className: "sensor-console-label", textContent: "SIGNAL STATUS" }),
      Object.assign(document.createElement("p"), { textContent: "公開中のセンサーはまだありません。最初の信号を待っています。" }),
    );
    applyPublicSensorFilters();
    return;
  }
  let initialSelection = null;
  publicSensors.forEach((sensor) => {
    const marker = document.createElement("button");
    marker.type = "button";
    marker.className = "sensor-map-marker";
    marker.dataset.sensorId = sensor.id;
    marker.dataset.sensorType = sensor.visualType;
    marker.dataset.longitude = String(sensor.location.longitude);
    marker.dataset.latitude = String(sensor.location.latitude);
    marker.dataset.state = sensor.state;
    marker.dataset.active = String(publicSensorIsActive(sensor));
    const activity = publicSensorActivity(sensor);
    marker.style.setProperty("--sensor-activity", String(activity));
    marker.style.setProperty("--sensor-glow", `${Math.round(13 + activity * 22)}px`);
    marker.style.setProperty("--sensor-pulse-duration", `${(3.1 - activity * 1.2).toFixed(2)}s`);
    marker.style.setProperty("--sensor-pulse-scale", String(1.32 + activity * .5));
    marker.setAttribute("aria-label", `${sensor.owner.displayName}さんの${sensor.sensorName}、${publicSensorStateLabel(sensor)}`);
    marker.append(avatarElement(sensor.owner, "span"));
    const primaryMetric = publicPrimaryMetric(sensor);
    marker.append(Object.assign(document.createElement("span"), {
      className: "sensor-map-marker-state",
      textContent: [publicSensorStateLabel(sensor), primaryMetric?.compact].filter(Boolean).join(" · "),
    }));
    marker.addEventListener("click", () => {
      selectPublicSensor(sensor, marker, { historyMode: "push" });
      focusPublicSensor(sensor, { minimumZoom: publicMapFocusMinZoom });
    });
    publicSensorMarkers.append(marker);

    const card = document.createElement("button");
    card.type = "button";
    card.className = "sensor-public-card";
    card.dataset.sensorId = sensor.id;
    card.dataset.state = sensor.state;
    card.dataset.sensorType = sensor.visualType;
    card.append(avatarElement(sensor.owner, "span"));
    const text = document.createElement("span");
    text.append(
      Object.assign(document.createElement("strong"), { textContent: sensor.sensorName }),
      Object.assign(document.createElement("small"), { textContent: `${sensor.owner.displayName} / ${publicSensorStateLabel(sensor)}` }),
    );
    if (primaryMetric) text.append(Object.assign(document.createElement("em"), { textContent: primaryMetric.full }));
    card.append(text);
    card.addEventListener("pointerenter", () => {
      window.clearTimeout(publicMapHoverTimer);
      publicMapHoverTimer = window.setTimeout(() => focusPublicSensor(sensor, { minimumZoom: 5.2 }), 150);
    });
    card.addEventListener("pointerleave", () => window.clearTimeout(publicMapHoverTimer));
    card.addEventListener("focus", () => focusPublicSensor(sensor, { minimumZoom: 5.2 }));
    card.addEventListener("click", () => {
      selectPublicSensor(sensor, marker, { historyMode: "push" });
      focusPublicSensor(sensor, { minimumZoom: publicMapFocusMinZoom });
      if (matchMedia("(max-width: 760px)").matches) {
        requestAnimationFrame(() => publicSensorDetail?.querySelector(".sensor-map-card-expand")?.focus({ preventScroll: true }));
      }
    });
    publicSensorList.append(card);
    if (sensor.id === linkedSensorId) linkedSensorFound = true;
    if (sensor.id === selectedPublicSensorId) initialSelection = { sensor, marker };
    else if (!initialSelection && !selectedPublicSensorId && !publicSensorSelectionDismissed && !sensor.isDemo) initialSelection = { sensor, marker };
  });
  if (!initialSelection && !publicSensorSelectionDismissed && publicSensors.length) {
    const sensor = publicSensors[0];
    initialSelection = { sensor, marker: publicSensorMarkers.querySelector(`[data-sensor-id="${CSS.escape(sensor.id)}"]`) };
  }
  if (linkedSensorId && !linkedSensorFound) setPublicSensorHash(null, { replace: true });
  if (initialSelection) {
    selectPublicSensor(initialSelection.sensor, initialSelection.marker);
    if (linkedSensorId === initialSelection.sensor.id) {
      requestAnimationFrame(() => focusPublicSensor(initialSelection.sensor, { minimumZoom: publicMapFocusMinZoom }));
    }
  }
  applyPublicSensorFilters();
};

function initPublicSensorDirectory() {
  publicSensorQuery?.addEventListener("input", () => {
    publicSensorQueryText = publicSensorQuery.value;
    applyPublicSensorFilters();
  });
  document.querySelectorAll("[data-public-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      publicSensorFilter = button.dataset.publicFilter || "ALL";
      document.querySelectorAll("[data-public-filter]").forEach((option) => {
        option.setAttribute("aria-pressed", String(option === button));
      });
      applyPublicSensorFilters();
    });
  });
  publicMapDirectoryToggle?.addEventListener("click", () => {
    setPublicSensorDirectoryOpen(publicSensorDirectory?.dataset.open !== "true", { focus: true });
  });
  document.addEventListener("keydown", (event) => {
    if (views.get("map")?.hidden) return;
    const editing = event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement || event.target instanceof HTMLSelectElement;
    if (event.key === "/" && !editing) {
      event.preventDefault();
      setPublicSensorDirectoryOpen(true, { focus: true });
      return;
    }
    if (event.key !== "Escape") return;
    if (publicSensorDirectory?.dataset.open === "true") {
      event.preventDefault();
      setPublicSensorDirectoryOpen(false, { focus: true });
    } else if (publicSensorQueryText) {
      event.preventDefault();
      publicSensorQueryText = "";
      if (publicSensorQuery) publicSensorQuery.value = "";
      applyPublicSensorFilters();
    } else if (publicSensorDetail?.dataset.expanded === "true" && matchMedia("(max-width: 760px)").matches) {
      event.preventDefault();
      setPublicSensorDetailExpanded(false, { focus: true });
    } else if (selectedPublicSensorId) {
      event.preventDefault();
      clearPublicSensorSelection({ hideDetail: true, historyMode: "push" });
      publicSensorMap?.focus({ preventScroll: true });
    }
  });
}

function applyPublicSensorFilters() {
  const query = normalizePublicSensorSearch(publicSensorQueryText);
  let visibleCount = 0;
  let selectedVisible = !selectedPublicSensorId;
  publicSensors.forEach((sensor) => {
    const stateMatches = publicSensorFilter === "ALL"
      || (publicSensorFilter === "DEMO" && sensor.isDemo)
      || (publicSensorFilter === "ONLINE" && !sensor.isDemo && sensor.state === "ONLINE")
      || (publicSensorFilter === "OFFLINE" && !sensor.isDemo && sensor.state !== "ONLINE");
    const searchText = normalizePublicSensorSearch([
      sensor.sensorName,
      sensor.owner?.displayName,
      sensor.region?.countryCode,
      sensor.region?.subdivisionCode,
      sensor.region?.subdivisionName,
      sensor.demoLocationLabel,
      publicSensorStateLabel(sensor),
    ].filter(Boolean).join(" "));
    const visible = stateMatches && (!query || searchText.includes(query));
    visibleCount += Number(visible);
    if (visible && sensor.id === selectedPublicSensorId) selectedVisible = true;
    const marker = publicSensorMarkers?.querySelector(`[data-sensor-id="${CSS.escape(sensor.id)}"]`);
    const card = publicSensorList?.querySelector(`[data-sensor-id="${CSS.escape(sensor.id)}"]`);
    if (marker) marker.dataset.filtered = String(!visible);
    if (card) card.hidden = !visible;
  });
  if (!selectedVisible) clearPublicSensorSelection({ hideDetail: true, historyMode: "replace" });
  if (publicSensorResults) publicSensorResults.value = `${visibleCount} / ${publicSensors.length}件`;
  if (publicMapDirectoryCount) publicMapDirectoryCount.textContent = String(publicSensors.length);
  if (publicSensorEmpty) publicSensorEmpty.hidden = visibleCount !== 0;
  positionPublicSensorMarkers();
}

function normalizePublicSensorSearch(value) {
  return String(value || "").normalize("NFKC").toLocaleLowerCase("ja").replace(/\s+/gu, " ").trim();
}

function publicSensorIdFromHash() {
  const prefix = "#map/sensor=";
  if (!location.hash.startsWith(prefix)) return null;
  try {
    return decodeURIComponent(location.hash.slice(prefix.length)) || null;
  } catch {
    return null;
  }
}

function setPublicSensorHash(sensorId, { replace = false } = {}) {
  const nextHash = sensorId ? `#map/sensor=${encodeURIComponent(sensorId)}` : "#map";
  if (location.hash === nextHash) return;
  history[replace ? "replaceState" : "pushState"](null, "", nextHash);
}

function restorePublicSensorSelectionFromHash() {
  const sensorId = publicSensorIdFromHash();
  if (!sensorId) {
    if (selectedPublicSensorId) clearPublicSensorSelection({ hideDetail: true });
    return;
  }
  const sensor = publicSensors.find((candidate) => candidate.id === sensorId);
  const marker = publicSensorMarkers?.querySelector(`[data-sensor-id="${CSS.escape(sensorId)}"]`);
  if (!sensor || !marker) {
    setPublicSensorHash(null, { replace: true });
    return;
  }
  selectPublicSensor(sensor, marker);
  focusPublicSensor(sensor, { minimumZoom: publicMapFocusMinZoom });
}

function setPublicSensorDirectoryOpen(open, { focus = false } = {}) {
  if (!publicSensorDirectory || !publicMapDirectoryToggle) return;
  publicSensorDirectory.dataset.open = String(open);
  publicMapDirectoryToggle.setAttribute("aria-expanded", String(open));
  if (matchMedia("(max-width: 760px)").matches) {
    if (open) {
      setPublicSensorDetailExpanded(false);
      publicSensorDetail.hidden = true;
    } else if (selectedPublicSensorId) {
      publicSensorDetail.hidden = false;
      setPublicSensorDetailExpanded(false);
    }
  }
  if (focus) {
    if (open) requestAnimationFrame(() => publicSensorQuery?.focus({ preventScroll: true }));
    else publicMapDirectoryToggle.focus({ preventScroll: true });
  }
}

function setPublicSensorDetailExpanded(expanded, { focus = false } = {}) {
  if (!publicSensorDetail) return;
  publicSensorDetail.dataset.expanded = String(expanded);
  const toggle = publicSensorDetail.querySelector(".sensor-map-card-expand");
  if (toggle) {
    toggle.setAttribute("aria-expanded", String(expanded));
    toggle.textContent = expanded ? "たたむ" : "詳細を見る";
    if (focus) toggle.focus({ preventScroll: true });
  }
  if (!expanded) publicSensorDetail.scrollTop = 0;
}

function clearPublicSensorSelection({ hideDetail = false, historyMode = null } = {}) {
  selectedPublicSensorId = null;
  publicSensorSelectionDismissed = true;
  if (historyMode) setPublicSensorHash(null, { replace: historyMode === "replace" });
  document.querySelectorAll(".sensor-map-marker[aria-current], .sensor-public-card[aria-current]").forEach((element) => element.removeAttribute("aria-current"));
  if (!publicSensorDetail) return;
  setPublicSensorDetailExpanded(false);
  publicSensorDetail.hidden = hideDetail;
  publicSensorDetail.replaceChildren(
    Object.assign(document.createElement("small"), { className: "sensor-console-label", textContent: "SELECTED SIGNAL" }),
    Object.assign(document.createElement("p"), { textContent: "地図上のアイコンまたは観測点一覧から選んでください。" }),
  );
}

const selectPublicSensor = (sensor, marker, { historyMode = null } = {}) => {
  if (!marker) return;
  publicSensorDetail.hidden = false;
  publicSensorDetail.dataset.expanded = "false";
  publicSensorDetail.scrollTop = 0;
  setPublicSensorDirectoryOpen(false);
  selectedPublicSensorId = sensor.id;
  publicSensorSelectionDismissed = false;
  if (historyMode) setPublicSensorHash(sensor.id, { replace: historyMode === "replace" });
  document.querySelectorAll(".sensor-map-marker[aria-current]").forEach((element) => element.removeAttribute("aria-current"));
  document.querySelectorAll(".sensor-public-card[aria-current]").forEach((element) => element.removeAttribute("aria-current"));
  marker.setAttribute("aria-current", "true");
  publicSensorList.querySelector(`[data-sensor-id="${CSS.escape(sensor.id)}"]`)?.setAttribute("aria-current", "true");
  publicSensorDetail.replaceChildren();
  const consoleLabel = Object.assign(document.createElement("small"), { className: "sensor-console-label", textContent: "SELECTED SIGNAL" });
  const toolbar = document.createElement("header");
  toolbar.className = "sensor-map-card-toolbar";
  const actions = document.createElement("span");
  actions.className = "sensor-map-card-actions";
  const expand = Object.assign(document.createElement("button"), { type: "button", className: "sensor-map-card-expand", textContent: "詳細を見る" });
  expand.setAttribute("aria-controls", "public-sensor-detail");
  expand.setAttribute("aria-expanded", "false");
  expand.addEventListener("click", () => {
    setPublicSensorDetailExpanded(publicSensorDetail.dataset.expanded !== "true");
  });
  const share = Object.assign(document.createElement("button"), { type: "button", className: "sensor-map-card-share", textContent: "共有" });
  share.setAttribute("aria-label", `${sensor.sensorName}の共有リンクをコピー`);
  share.addEventListener("click", async () => {
    setPublicSensorHash(sensor.id, { replace: true });
    try {
      await navigator.clipboard.writeText(location.href);
      share.textContent = "コピー済み";
      window.setTimeout(() => { share.textContent = "共有"; }, 1_600);
    } catch {
      showStatus("アドレスバーのURLをコピーしてください。", "error");
    }
  });
  const close = Object.assign(document.createElement("button"), { type: "button", textContent: "閉じる" });
  close.className = "sensor-map-card-close";
  close.setAttribute("aria-label", "選択中のセンサー詳細を閉じる");
  close.addEventListener("click", () => {
    clearPublicSensorSelection({ hideDetail: true, historyMode: "push" });
    publicSensorMap?.focus({ preventScroll: true });
  });
  actions.append(expand, share, close);
  toolbar.append(consoleLabel, actions);
  const owner = document.createElement("div");
  owner.className = "sensor-map-owner";
  owner.append(avatarElement(sensor.owner, "span"));
  const heading = document.createElement("div");
  heading.append(Object.assign(document.createElement("small"), { textContent: sensor.owner.displayName }));
  heading.append(Object.assign(document.createElement("h2"), { textContent: sensor.sensorName }));
  owner.append(heading);
  const state = Object.assign(document.createElement("span"), { className: "sensor-state", textContent: publicSensorStateLabel(sensor) });
  state.dataset.state = sensor.isDemo ? "DEMO" : sensor.state;
  owner.append(state);
  const social = document.createElement("div");
  social.className = "sensor-map-socials";
  [["X", sensor.owner.xUrl], ["GitHub", sensor.owner.githubUrl], ["Instagram", sensor.owner.instagramUrl]].forEach(([label, url]) => {
    if (!url) return;
    const link = Object.assign(document.createElement("a"), { href: url, textContent: label, target: "_blank", rel: "noopener noreferrer" });
    social.append(link);
  });
  const note = document.createElement("p");
  const region = [sensor.region?.subdivisionName, sensor.region?.subdivisionCode].filter(Boolean).join(" / ") || sensor.region?.countryCode || "地域非公開";
  note.textContent = `${region} · 公開位置は0.1度単位へ丸めています。自治体コードと住所は公開しません。`;
  const content = [toolbar, owner, createPublicMetricHud(sensor), createPublicNodeMeta(sensor), createPublicOracle(sensor)];
  if (sensor.isDemo) {
    const disclosure = document.createElement("p");
    disclosure.className = "sensor-demo-disclosure";
    const demoRegion = [sensor.region?.subdivisionName, sensor.demoLocationLabel].filter(Boolean).join("・");
    disclosure.textContent = `ネタバレ：これは${demoRegion ? `${demoRegion}に置いた` : "展示用の"}ダミーセンサーです。実機から送信された観測データではありません。`;
    content.push(disclosure);
  }
  content.push(note);
  if (social.childElementCount) content.push(social);
  publicSensorDetail.append(...content);
};

function publicSensorType(sensor) {
  const source = `${sensor.id} ${sensor.sensorName} ${sensor.owner?.displayName}`.toLowerCase();
  if (/あめ|ame/u.test(source)) return "ame";
  if (/みず|mizu/u.test(source)) return "mizu";
  if (/saku|サクヤ|咲夜/u.test(source)) return "saku";
  return "custom";
}

function publicSensorIsActive(sensor) {
  return sensor.isDemo || sensor.state === "ONLINE";
}

function publicSensorStateLabel(sensor) {
  return sensor.isDemo ? "DEMO LIVE" : sensor.state;
}

function publicObservationsFor(sensor) {
  if (sensor.isDemo) return createDemoObservationSeries(sensor);
  if (!Array.isArray(sensor.observations)) return [];
  return sensor.observations
    .map((observation) => ({ data: sanitizePublicMeasurements(observation?.data) }))
    .filter((observation) => Object.keys(observation.data).length);
}

function sanitizePublicMeasurements(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.fromEntries(Object.entries(value).filter(([, measurement]) => Number.isFinite(Number(measurement))).map(([key, measurement]) => [key, Number(measurement)]));
}

function createDemoObservationSeries(sensor, count = 18) {
  const seed = hashPublicSensorId(sensor.id);
  const phase = (Math.floor(Date.now() / 300_000) + seed) * .17;
  return Array.from({ length: count }, (_, index) => {
    const t = count - index - 1;
    const wave = Math.sin(phase - t * .46);
    const slower = Math.cos(phase * .61 - t * .27);
    const ripple = Math.sin(phase * 1.37 - t * .81);
    if (sensor.visualType === "ame") return { data: {
      electric_field: rounded(1.8 + wave * .72 + ripple * .18, 2),
      pressure: rounded(1007.4 + slower * 5.6 - wave * 2.1, 1),
      radio_noise: rounded(-72 + ripple * 8 + wave * 3, 1),
    } };
    if (sensor.visualType === "mizu") return { data: {
      water_temperature: rounded(13.2 + slower * 2.4 + ripple * .3, 1),
      humidity: rounded(78 + wave * 8 + ripple * 2, 1),
      groundwater_level: rounded(1.62 + slower * .24 + wave * .08, 2),
    } };
    if (sensor.visualType === "saku") return { data: {
      spatial_noise: rounded(.018 + Math.abs(ripple) * .024 + Math.abs(wave) * .007, 3),
      illuminance: Math.round(470 + slower * 210 + ripple * 45),
      sync_rate: rounded(89 + wave * 5 + slower * 2, 1),
    } };
    return { data: {
      temperature: rounded(24.8 + wave * 2.2 + ripple * .35, 1),
      humidity: rounded(54 + slower * 7 + ripple * 1.8, 1),
      pm25: rounded(9.4 + Math.abs(wave) * 4.2 + ripple * .8, 1),
    } };
  });
}

function hashPublicSensorId(value) {
  let hash = 2166136261;
  for (const character of String(value)) hash = Math.imul(hash ^ character.codePointAt(0), 16777619);
  return hash >>> 0;
}

function rounded(value, digits = 1) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

const publicMetricMetadata = Object.freeze({
  temperature: { label: "気温", console: "TEMP", unit: "°C", digits: 1 },
  humidity: { label: "湿度", console: "HUM", unit: "%", digits: 1 },
  pm25: { label: "PM2.5", console: "PM2.5", unit: "µg/m³", digits: 1 },
  pressure: { label: "気圧", console: "PRESS", unit: "hPa", digits: 1 },
  illuminance: { label: "照度", console: "LUX", unit: "lx", digits: 0 },
  rssi: { label: "電波強度", console: "RSSI", unit: "dBm", digits: 0 },
  geomagnetic: { label: "地磁気変動", console: "MAG", unit: "µT", digits: 2 },
  electric_field: { label: "電界変動", console: "E-FIELD", unit: "kV/m", digits: 2 },
  radio_noise: { label: "電波ノイズ", console: "RF NOISE", unit: "dBm", digits: 1 },
  water_temperature: { label: "水温", console: "WATER", unit: "°C", digits: 1 },
  groundwater_level: { label: "地下水位", console: "GROUND", unit: "m", digits: 2 },
  spatial_noise: { label: "空間ノイズ", console: "SPACE Δ", unit: "Δ", digits: 3 },
  sync_rate: { label: "識理層シンクロ率", console: "SYNC", unit: "%", digits: 1 },
});

function publicMetricDefinitions(sensor) {
  const latest = sensor.visualObservations?.[0]?.data ?? {};
  const preferred = sensor.visualType === "ame"
    ? ["electric_field", "pressure", "radio_noise"]
    : sensor.visualType === "mizu"
      ? ["water_temperature", "humidity", "groundwater_level"]
      : sensor.visualType === "saku"
        ? ["spatial_noise", "illuminance", "sync_rate"]
        : ["temperature", "humidity", "pm25", "pressure", "illuminance", "rssi", "geomagnetic"];
  const orderedKeys = [...preferred.filter((key) => key in latest), ...Object.keys(latest).filter((key) => !preferred.includes(key))];
  return orderedKeys.slice(0, 6).map((key) => ({ key, ...(publicMetricMetadata[key] ?? { label: key, console: key.toUpperCase(), unit: "", digits: 2 }) }));
}

function formatPublicMetric(definition, value, compact = false) {
  if (!Number.isFinite(value)) return "--";
  const text = Number(value).toLocaleString("ja-JP", { minimumFractionDigits: definition.digits, maximumFractionDigits: definition.digits });
  return compact ? `${text}${definition.unit}` : `${text} ${definition.unit}`.trim();
}

function publicPrimaryMetric(sensor) {
  const definition = publicMetricDefinitions(sensor)[0];
  if (!definition) return null;
  const value = sensor.visualObservations?.[0]?.data?.[definition.key];
  if (!Number.isFinite(value)) return null;
  return {
    compact: formatPublicMetric(definition, value, true),
    full: `${definition.label} ${formatPublicMetric(definition, value)}`,
  };
}

function publicSensorActivity(sensor) {
  if (!publicSensorIsActive(sensor)) return .18;
  const definitions = publicMetricDefinitions(sensor);
  const latest = sensor.visualObservations?.[0]?.data ?? {};
  const value = definitions.length ? Math.abs(Number(latest[definitions[0].key])) : 0;
  return rounded(clamp(.48 + (value % 19) / 50, .48, .88), 2);
}

function createPublicMetricHud(sensor) {
  const section = document.createElement("section");
  section.className = "sensor-observation-hud";
  const header = document.createElement("header");
  header.append(
    Object.assign(document.createElement("span"), { textContent: sensor.isDemo ? "SIMULATED METRICS" : "LIVE METRICS" }),
    Object.assign(document.createElement("b"), { textContent: publicSensorTypeLabel(sensor.visualType) }),
  );
  section.append(header);
  const grid = document.createElement("div");
  grid.className = "sensor-metric-hud-grid";
  const definitions = publicMetricDefinitions(sensor).slice(0, 3);
  if (!definitions.length) {
    grid.append(Object.assign(document.createElement("p"), { className: "sensor-metric-awaiting", textContent: "最初の観測値を待っています。" }));
  }
  definitions.forEach((definition) => {
    const card = document.createElement("article");
    const latest = sensor.visualObservations[0]?.data?.[definition.key];
    card.append(
      Object.assign(document.createElement("small"), { textContent: `${definition.console} · ${definition.label}`, title: definition.label }),
      Object.assign(document.createElement("strong"), { textContent: formatPublicMetric(definition, latest) }),
      createPublicSparkline(sensor.visualObservations, definition.key),
    );
    grid.append(card);
  });
  section.append(grid);
  return section;
}

function publicSensorTypeLabel(type) {
  return ({ ame: "ATMOSPHERIC / RF", mizu: "HYDROLOGICAL", saku: "SPATIAL SYNC", custom: "ENVIRONMENTAL" })[type] ?? "ENVIRONMENTAL";
}

function createPublicSparkline(observations, key) {
  const namespace = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(namespace, "svg");
  svg.classList.add("sensor-sparkline");
  svg.setAttribute("viewBox", "0 0 100 28");
  svg.setAttribute("preserveAspectRatio", "none");
  svg.setAttribute("aria-hidden", "true");
  const values = observations.slice(0, 12).map((observation) => Number(observation.data?.[key])).filter(Number.isFinite).reverse();
  if (values.length < 2) return svg;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = Math.max(max - min, Math.abs(max || 1) * .02, .001);
  const points = values.map((value, index) => `${(index / (values.length - 1)) * 100},${24 - ((value - min) / span) * 20}`).join(" ");
  const polyline = document.createElementNS(namespace, "polyline");
  polyline.setAttribute("points", points);
  polyline.setAttribute("vector-effect", "non-scaling-stroke");
  svg.append(polyline);
  return svg;
}

function createPublicNodeMeta(sensor) {
  const wrapper = document.createElement("div");
  wrapper.className = "sensor-node-meta";
  const resonanceCount = publicResonancePairs.filter((pair) => pair.from.id === sensor.id || pair.to.id === sensor.id).length;
  const duration = sensor.isDemo ? 259_200 + (hashPublicSensorId(sensor.id) % 86_400) : Number(sensor.observationSpanSeconds) || 0;
  const packetCount = sensor.isDemo ? `${sensor.visualObservations.length} SIM` : Number(sensor.observationCount || 0).toLocaleString("ja-JP");
  [["UPTIME / 観測期間", formatPublicDuration(duration)], ["OBS WINDOW", packetCount], ["RESONANCE", `${resonanceCount} NODES`]].forEach(([label, value]) => {
    const item = document.createElement("span");
    item.append(Object.assign(document.createElement("small"), { textContent: label }), Object.assign(document.createElement("b"), { textContent: value }));
    wrapper.append(item);
  });
  return wrapper;
}

function formatPublicDuration(seconds) {
  const value = Math.max(0, Number(seconds) || 0);
  if (value >= 86_400) return `${Math.floor(value / 86_400)}d ${Math.floor((value % 86_400) / 3_600)}h`;
  if (value >= 3_600) return `${Math.floor(value / 3_600)}h ${Math.floor((value % 3_600) / 60)}m`;
  if (value >= 60) return `${Math.floor(value / 60)}m`;
  return value ? `${Math.floor(value)}s` : "WAITING";
}

function createPublicOracle(sensor) {
  const section = document.createElement("section");
  section.className = "sensor-oracle";
  const button = Object.assign(document.createElement("button"), { type: "button", className: "sensor-oracle-trigger" });
  button.append(
    Object.assign(document.createElement("span"), { textContent: "OBSERVE FROM THIS NODE" }),
    Object.assign(document.createElement("strong"), { textContent: "世界を観測する" }),
    Object.assign(document.createElement("b"), { textContent: "→" }),
  );
  const receipt = Object.assign(document.createElement("output"), { className: "sensor-oracle-receipt", hidden: true });
  button.addEventListener("click", () => {
    button.disabled = true;
    receipt.hidden = false;
    receipt.classList.remove("is-received");
    receipt.textContent = "NODE HANDSHAKE... 直近の観測ログを受信中";
    oracleDepthBoost = Math.min(12, oracleDepthBoost + 1.5);
    renderPublicNetworkStats();
    window.setTimeout(() => {
      if (!receipt.isConnected) return;
      receipt.textContent = generatePublicOracle(sensor);
      receipt.classList.add("is-received");
      button.disabled = false;
    }, 520);
  });
  section.append(button, receipt);
  return section;
}

function generatePublicOracle(sensor) {
  const data = sensor.visualObservations?.[0]?.data ?? {};
  const prefix = sensor.isDemo ? "SIMULATION LOG" : "OBSERVATION LOG";
  if (sensor.visualType === "ame") {
    return `${prefix} / 気圧 ${formatOracleValue(data.pressure, 1, "hPa")}、電波ノイズ ${formatOracleValue(data.radio_noise, 1, "dBm")}。空の縁で、嵐の気配を拾っています。`;
  }
  if (sensor.visualType === "mizu") {
    return `${prefix} / 水温 ${formatOracleValue(data.water_temperature, 1, "°C")}、地下水位 ${formatOracleValue(data.groundwater_level, 2, "m")}。水の層は静かに地表の変化を記録しています。`;
  }
  if (sensor.visualType === "saku") {
    return `${prefix} / 識理層シンクロ率 ${formatOracleValue(data.sync_rate, 1, "%")}、空間ノイズ ${formatOracleValue(data.spatial_noise, 3, "Δ")}。座標は安定、微小なゆらぎだけを検出。`;
  }
  const temperature = formatOracleValue(data.temperature, 1, "°C");
  const humidity = formatOracleValue(data.humidity, 1, "%");
  const pm25 = formatOracleValue(data.pm25, 1, "µg/m³");
  return `${prefix} / 気温 ${temperature}、湿度 ${humidity}、PM2.5 ${pm25}。この場所の現在が、地球の感覚器へ届きました。`;
}

function formatOracleValue(value, digits, unit) {
  return Number.isFinite(Number(value)) ? `${Number(value).toFixed(digits)}${unit}` : `--${unit}`;
}

function buildPublicResonancePairs(sensors) {
  const active = sensors.filter(publicSensorIsActive);
  const candidates = [];
  for (let left = 0; left < active.length; left += 1) {
    for (let right = left + 1; right < active.length; right += 1) {
      const distance = publicSensorDistanceKm(active[left], active[right]);
      if (distance <= resonanceDistanceKm) candidates.push({ from: active[left], to: active[right], distance });
    }
  }
  const selected = new Map();
  active.forEach((sensor) => {
    candidates
      .filter((pair) => pair.from === sensor || pair.to === sensor)
      .sort((left, right) => left.distance - right.distance)
      .slice(0, 2)
      .forEach((pair) => {
        const key = [pair.from.id, pair.to.id].sort().join("::");
        selected.set(key, pair);
      });
  });
  return [...selected.values()].sort((left, right) => left.distance - right.distance).slice(0, 80);
}

function publicSensorDistanceKm(left, right) {
  const toRadians = (degrees) => degrees * Math.PI / 180;
  const latitude1 = toRadians(left.location.latitude);
  const latitude2 = toRadians(right.location.latitude);
  const deltaLatitude = latitude2 - latitude1;
  const deltaLongitude = toRadians(right.location.longitude - left.location.longitude);
  const a = Math.sin(deltaLatitude / 2) ** 2 + Math.cos(latitude1) * Math.cos(latitude2) * Math.sin(deltaLongitude / 2) ** 2;
  return 6_371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(Math.max(0, 1 - a)));
}

function renderPublicResonanceNetwork() {
  if (!publicSensorNetwork) return;
  const namespace = "http://www.w3.org/2000/svg";
  const markerBounds = publicSensorMarkers.getBoundingClientRect();
  const markerWidth = Math.max(markerBounds.width, 1);
  const markerHeight = Math.max(markerBounds.height, 1);
  const markerById = new Map([...publicSensorMarkers.querySelectorAll(".sensor-map-marker")].map((marker) => [marker.dataset.sensorId, marker]));
  const paths = [];
  publicResonancePairs.forEach((pair, index) => {
    const from = markerById.get(pair.from.id);
    const to = markerById.get(pair.to.id);
    if (!from || !to || from.hidden || to.hidden) return;
    const x1 = Number.parseFloat(from.style.left) + markerOffset(from, "x") / markerWidth * 100;
    const y1 = Number.parseFloat(from.style.top) + markerOffset(from, "y") / markerHeight * 100;
    const x2 = Number.parseFloat(to.style.left) + markerOffset(to, "x") / markerWidth * 100;
    const y2 = Number.parseFloat(to.style.top) + markerOffset(to, "y") / markerHeight * 100;
    if (![x1, y1, x2, y2].every(Number.isFinite)) return;
    const bend = ((hashPublicSensorId(`${pair.from.id}:${pair.to.id}`) % 11) - 5) * .35;
    const midpointX = (x1 + x2) / 2 - (y2 - y1) * .025 + bend;
    const midpointY = (y1 + y2) / 2 + (x2 - x1) * .025 - bend;
    const path = document.createElementNS(namespace, "path");
    path.classList.add("sensor-resonance-link");
    path.toggleAttribute("data-demo", pair.from.isDemo || pair.to.isDemo);
    path.setAttribute("d", `M ${x1} ${y1} Q ${midpointX} ${midpointY} ${x2} ${y2}`);
    path.setAttribute("pathLength", "1");
    path.setAttribute("vector-effect", "non-scaling-stroke");
    path.style.setProperty("--resonance-delay", `${-(index * .43)}s`);
    path.style.setProperty("--resonance-strength", String(clamp(1 - pair.distance / resonanceDistanceKm, .24, .88)));
    paths.push(path);
  });
  publicSensorNetwork.replaceChildren(...paths);
}

function markerOffset(marker, axis) {
  return Number.parseFloat(marker.style.getPropertyValue(`--sensor-marker-offset-${axis}`)) || 0;
}

function renderPublicNetworkStats() {
  const activeNodes = publicSensors.filter(publicSensorIsActive).length;
  const packets = Math.max(0, Number(publicNetworkStats.observationPackets) || 0);
  const payloadBytes = Math.max(0, Number(publicNetworkStats.payloadBytes) || 0);
  const resonance = publicResonancePairs.length;
  const sync = publicSensors.length
    ? clamp(16 + activeNodes * 7.2 + resonance * 3.4 + Math.log10(packets + 1) * 8 + oracleDepthBoost * .35, 0, 99.8)
    : 0;
  const depth = publicSensors.length
    ? clamp(8 + Math.log10(packets + 1) * 19 + activeNodes * 3.8 + oracleDepthBoost, 0, 100)
    : 0;
  if (publicSyncRate) publicSyncRate.textContent = `${sync.toFixed(1)}%`;
  if (publicActiveNodes) publicActiveNodes.textContent = `${activeNodes}/${publicSensors.length}`;
  if (publicPacketCount) publicPacketCount.textContent = packets.toLocaleString("ja-JP");
  if (publicDataVolume) publicDataVolume.textContent = formatPublicDataVolume(payloadBytes);
  if (publicDepthFill) publicDepthFill.style.width = `${depth.toFixed(1)}%`;
  if (publicDepthValue) publicDepthValue.textContent = `${depth.toFixed(1)}%`;
}

function formatPublicDataVolume(bytes) {
  if (bytes < 1_000) return `${bytes} B`;
  if (bytes < 1_000_000) return `${(bytes / 1_000).toFixed(1)} KB`;
  if (bytes < 1_000_000_000) return `${(bytes / 1_000_000).toFixed(2)} MB`;
  return `${(bytes / 1_000_000_000).toFixed(3)} GB`;
}

function focusPublicSensor(sensor, { minimumZoom = publicMapFocusMinZoom } = {}) {
  window.clearTimeout(publicMapHoverTimer);
  if (!sensor?.location || !publicSensorMap) return;
  const from = { ...publicMapCamera };
  let targetLongitude = Number(sensor.location.longitude);
  while (targetLongitude - from.longitude > 180) targetLongitude -= 360;
  while (targetLongitude - from.longitude < -180) targetLongitude += 360;
  const target = {
    longitude: targetLongitude,
    latitude: clamp(Number(sensor.location.latitude), -85, 85),
    zoom: Math.max(from.zoom, minimumZoom),
  };
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const token = ++publicMapFocusToken;
  if (publicMapFocusFrame) cancelAnimationFrame(publicMapFocusFrame);
  if (reducedMotion) {
    Object.assign(publicMapCamera, target);
    updatePublicMapViewport();
    return;
  }
  const startedAt = performance.now();
  let lastPaint = -Infinity;
  const animate = (now) => {
    if (token !== publicMapFocusToken) return;
    const progress = clamp((now - startedAt) / 460, 0, 1);
    const eased = 1 - (1 - progress) ** 3;
    if (now - lastPaint >= 30 || progress === 1) {
      publicMapCamera.longitude = from.longitude + (target.longitude - from.longitude) * eased;
      publicMapCamera.latitude = from.latitude + (target.latitude - from.latitude) * eased;
      publicMapCamera.zoom = from.zoom + (target.zoom - from.zoom) * eased;
      updatePublicMapViewport();
      lastPaint = now;
    }
    if (progress < 1) publicMapFocusFrame = requestAnimationFrame(animate);
    else publicMapFocusFrame = 0;
  };
  publicMapFocusFrame = requestAnimationFrame(animate);
}

function initPublicMapNavigation() {
  resetPublicMapView(false);
  publicMapZoomIn?.addEventListener("click", () => zoomPublicMapBy(1.6));
  publicMapZoomOut?.addEventListener("click", () => zoomPublicMapBy(1 / 1.6));
  publicMapReset?.addEventListener("click", () => resetPublicMapView());
  publicSensorMap.addEventListener("wheel", (event) => {
    event.preventDefault();
    const factor = Math.exp(-clamp(event.deltaY, -240, 240) * (event.ctrlKey ? .008 : .0036));
    if (!publicMapWheel) publicMapWheel = { factor: 1, clientX: event.clientX, clientY: event.clientY };
    publicMapWheel.factor = clamp(publicMapWheel.factor * factor, .2, 5);
    publicMapWheel.clientX = event.clientX;
    publicMapWheel.clientY = event.clientY;
    if (publicMapWheelFrame) return;
    publicMapWheelFrame = requestAnimationFrame(() => {
      publicMapWheelFrame = 0;
      const pending = publicMapWheel;
      publicMapWheel = null;
      if (pending) zoomPublicMapBy(pending.factor, pending.clientX, pending.clientY);
    });
  }, { passive: false });
  publicSensorMap.addEventListener("dblclick", (event) => {
    if (event.target.closest("button, a")) return;
    event.preventDefault();
    zoomPublicMapBy(2, event.clientX, event.clientY);
  });
  publicSensorMap.addEventListener("pointerdown", (event) => {
    if (event.button !== 0 || event.target.closest("button, a")) return;
    event.preventDefault();
    cancelPublicMapFocus();
    publicMapPointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    try { publicSensorMap.setPointerCapture(event.pointerId); } catch {}
    publicSensorMap.classList.add("is-dragging");
    if (publicMapPointers.size >= 2) {
      finishPublicMapDrag(true);
      startPublicMapPinch();
      return;
    }
    publicMapDrag = { pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, deltaX: 0, deltaY: 0 };
  });
  publicSensorMap.addEventListener("pointermove", (event) => {
    if (!publicMapPointers.has(event.pointerId)) return;
    publicMapPointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (publicMapPointers.size >= 2) {
      queuePublicMapPinch();
      return;
    }
    if (!publicMapDrag || publicMapDrag.pointerId !== event.pointerId) return;
    publicMapDrag.deltaX = event.clientX - publicMapDrag.startX;
    publicMapDrag.deltaY = event.clientY - publicMapDrag.startY;
    queuePublicMapDragPreview();
  });
  const release = (event, commit = true) => {
    if (!publicMapPointers.has(event.pointerId)) return;
    const wasPinching = Boolean(publicMapPinch);
    publicMapPointers.delete(event.pointerId);
    if (wasPinching) {
      stopPublicMapPinch();
      const remaining = [...publicMapPointers.entries()][0];
      if (remaining) {
        const [pointerId, point] = remaining;
        publicMapDrag = { pointerId, startX: point.x, startY: point.y, deltaX: 0, deltaY: 0 };
        publicSensorMap.classList.add("is-dragging");
      } else publicSensorMap.classList.remove("is-dragging");
      return;
    }
    if (publicMapDrag?.pointerId === event.pointerId) finishPublicMapDrag(commit);
    if (!publicMapPointers.size) publicSensorMap.classList.remove("is-dragging");
  };
  publicSensorMap.addEventListener("pointerup", release);
  publicSensorMap.addEventListener("pointercancel", (event) => release(event, false));
  publicSensorMap.addEventListener("keydown", (event) => {
    if (["+", "="].includes(event.key)) { event.preventDefault(); zoomPublicMapBy(1.6); return; }
    if (event.key === "-") { event.preventDefault(); zoomPublicMapBy(1 / 1.6); return; }
    if (event.key === "Home") { event.preventDefault(); resetPublicMapView(); return; }
    const moves = { ArrowLeft: [80, 0], ArrowRight: [-80, 0], ArrowUp: [0, 80], ArrowDown: [0, -80] };
    if (moves[event.key]) { event.preventDefault(); panPublicMap(...moves[event.key]); }
  });
  window.addEventListener("resize", updatePublicMapViewport, { passive: true });
}

function cancelPublicMapFocus() {
  publicMapFocusToken += 1;
  if (publicMapFocusFrame) cancelAnimationFrame(publicMapFocusFrame);
  publicMapFocusFrame = 0;
}

function finishPublicMapDrag(commit = true) {
  if (!publicMapDrag) return;
  const { deltaX, deltaY } = publicMapDrag;
  publicMapDrag = null;
  if (publicMapDragFrame) cancelAnimationFrame(publicMapDragFrame);
  publicMapDragFrame = 0;
  publicSensorMap.style.removeProperty("--sensor-map-drag-x");
  publicSensorMap.style.removeProperty("--sensor-map-drag-y");
  if (commit && (Math.abs(deltaX) > .5 || Math.abs(deltaY) > .5)) panPublicMap(deltaX, deltaY);
}

function startPublicMapPinch() {
  const geometry = publicMapPinchGeometry();
  if (!geometry) return;
  publicMapPinch = geometry;
  publicSensorMap.dataset.gesture = "pinch";
}

function stopPublicMapPinch() {
  if (publicMapPinchFrame) cancelAnimationFrame(publicMapPinchFrame);
  publicMapPinchFrame = 0;
  publicMapPinch = null;
  delete publicSensorMap.dataset.gesture;
}

function publicMapPinchGeometry() {
  const points = [...publicMapPointers.values()].slice(0, 2);
  if (points.length < 2) return null;
  const [first, second] = points;
  return {
    distance: Math.max(Math.hypot(second.x - first.x, second.y - first.y), 1),
    clientX: (first.x + second.x) / 2,
    clientY: (first.y + second.y) / 2,
  };
}

function queuePublicMapPinch() {
  if (!publicMapPinch || publicMapPinchFrame) return;
  publicMapPinchFrame = requestAnimationFrame(() => {
    publicMapPinchFrame = 0;
    const current = publicMapPinchGeometry();
    if (!current || !publicMapPinch) return;
    const previous = publicMapPinch;
    publicMapPinch = current;
    panPublicMap(current.clientX - previous.clientX, current.clientY - previous.clientY, false);
    zoomPublicMapBy(clamp(current.distance / previous.distance, .5, 2), current.clientX, current.clientY, false);
    updatePublicMapViewport();
  });
}

function queuePublicMapDragPreview() {
  if (publicMapDragFrame) return;
  publicMapDragFrame = requestAnimationFrame(() => {
    publicMapDragFrame = 0;
    if (!publicMapDrag) return;
    const rect = publicSensorMap.getBoundingClientRect();
    const needsRebase = Math.abs(publicMapDrag.deltaX) > rect.width * publicMapDragRebaseRatio
      || Math.abs(publicMapDrag.deltaY) > rect.height * publicMapDragRebaseRatio;
    if (needsRebase) {
      const { deltaX, deltaY } = publicMapDrag;
      publicMapDrag.startX += deltaX;
      publicMapDrag.startY += deltaY;
      publicMapDrag.deltaX = 0;
      publicMapDrag.deltaY = 0;
      publicSensorMap.style.removeProperty("--sensor-map-drag-x");
      publicSensorMap.style.removeProperty("--sensor-map-drag-y");
      panPublicMap(deltaX, deltaY);
      return;
    }
    publicSensorMap.style.setProperty("--sensor-map-drag-x", `${publicMapDrag.deltaX}px`);
    publicSensorMap.style.setProperty("--sensor-map-drag-y", `${publicMapDrag.deltaY}px`);
  });
}

function resetPublicMapView(render = true) {
  Object.assign(publicMapCamera, publicMapHome);
  if (render) updatePublicMapViewport();
}

function publicMapView() {
  const rect = publicSensorMap.getBoundingClientRect();
  const width = Math.max(rect.width, window.innerWidth, 1);
  const height = Math.max(rect.height, window.innerHeight, 1);
  const verticalSpan = Math.min(180, 180 / publicMapCamera.zoom);
  const horizontalSpan = Math.min(360, verticalSpan * (width / height) / publicMapLongitudeScale);
  publicMapCamera.latitude = clamp(publicMapCamera.latitude, -90 + verticalSpan / 2, 90 - verticalSpan / 2);
  publicMapCamera.longitude = normalizeLongitude(publicMapCamera.longitude);
  return {
    west: publicMapCamera.longitude - horizontalSpan / 2,
    east: publicMapCamera.longitude + horizontalSpan / 2,
    south: publicMapCamera.latitude - verticalSpan / 2,
    north: publicMapCamera.latitude + verticalSpan / 2,
    key: "PUBLIC",
  };
}

function updatePublicMapViewport() {
  const view = publicMapView();
  mapViewports.set(publicSensorMap, view);
  publicSensorMap.dataset.mapView = "PUBLIC";
  mapRenderers.get(publicSensorMap)?.();
  positionPublicSensorMarkers();
  if (publicMapZoomOutput) publicMapZoomOutput.value = `${publicMapCamera.zoom.toFixed(1)}×`;
  const basis = publicSensorMap.querySelector("[data-map-basis]");
  if (basis) basis.textContent = `JAPAN CENTER / ZOOM ${publicMapCamera.zoom.toFixed(1)}× / NE 1:50m / 境界: 地球地図日本`;
}

function positionPublicSensorMarkers() {
  const view = mapViewFor(publicSensorMap);
  const bounds = publicSensorMarkers.getBoundingClientRect();
  const width = Math.max(bounds.width, 1);
  const height = Math.max(bounds.height, 1);
  const entries = [];
  publicSensorMarkers.querySelectorAll(".sensor-map-marker").forEach((marker) => {
    const longitude = Number(marker.dataset.longitude);
    const latitude = Number(marker.dataset.latitude);
    const left = longitudeToPercent(longitudeNearestToView(longitude, view), view);
    const top = latitudeToPercent(latitude, view);
    marker.style.left = `${left}%`;
    marker.style.top = `${top}%`;
    marker.style.setProperty("--sensor-marker-offset-x", "0px");
    marker.style.setProperty("--sensor-marker-offset-y", "0px");
    delete marker.dataset.collisionGroup;
    marker.removeAttribute("aria-description");
    marker.hidden = marker.dataset.filtered === "true" || left < -3 || left > 103 || top < -3 || top > 103;
    if (!marker.hidden) entries.push({ marker, baseX: left / 100 * width, baseY: top / 100 * height });
  });
  const remaining = new Set(entries);
  while (remaining.size) {
    const seed = remaining.values().next().value;
    remaining.delete(seed);
    const group = [seed];
    for (let cursor = 0; cursor < group.length; cursor += 1) {
      const current = group[cursor];
      for (const candidate of [...remaining]) {
        if (Math.hypot(candidate.baseX - current.baseX, candidate.baseY - current.baseY) > publicMapMarkerCollisionDistance) continue;
        remaining.delete(candidate);
        group.push(candidate);
      }
    }
    if (group.length < 2) continue;
    group.sort((left, right) => String(left.marker.dataset.sensorId).localeCompare(String(right.marker.dataset.sensorId)));
    const groupId = group.map((entry) => entry.marker.dataset.sensorId).join(":");
    const centreX = group.reduce((sum, entry) => sum + entry.baseX, 0) / group.length;
    const centreY = group.reduce((sum, entry) => sum + entry.baseY, 0) / group.length;
    const baseAngle = hashPublicSensorId(groupId) % 360 * Math.PI / 180;
    group.forEach((entry, index) => {
      const ringIndex = Math.floor(index / 8);
      const ringStart = ringIndex * 8;
      const ringCount = Math.min(8, group.length - ringStart);
      const position = index - ringStart;
      const radius = group.length === 2 ? 29 : 34 + ringIndex * 54 + Math.max(0, ringCount - 3) * 3;
      const angle = baseAngle + position / ringCount * Math.PI * 2;
      const edge = 32;
      const targetX = clamp(centreX + Math.cos(angle) * radius, edge, width - edge);
      const targetY = clamp(centreY + Math.sin(angle) * radius, edge, height - edge);
      entry.offsetX = targetX - entry.baseX;
      entry.offsetY = targetY - entry.baseY;
      entry.marker.style.setProperty("--sensor-marker-offset-x", `${entry.offsetX.toFixed(1)}px`);
      entry.marker.style.setProperty("--sensor-marker-offset-y", `${entry.offsetY.toFixed(1)}px`);
      entry.marker.dataset.collisionGroup = groupId;
      entry.marker.setAttribute("aria-description", "同じ地域の観測点と重ならないよう、座標を示す線付きで表示しています。");
    });
  }
  renderPublicMarkerTethers(entries, width, height);
  renderPublicResonanceNetwork();
}

function renderPublicMarkerTethers(entries, width, height) {
  if (!publicSensorTethers) return;
  const namespace = "http://www.w3.org/2000/svg";
  const lines = entries.filter((entry) => entry.marker.dataset.collisionGroup).map((entry) => {
    const line = document.createElementNS(namespace, "line");
    line.classList.add("sensor-marker-tether");
    line.dataset.sensorId = entry.marker.dataset.sensorId;
    line.setAttribute("x1", String(entry.baseX / width * 100));
    line.setAttribute("y1", String(entry.baseY / height * 100));
    line.setAttribute("x2", String((entry.baseX + entry.offsetX) / width * 100));
    line.setAttribute("y2", String((entry.baseY + entry.offsetY) / height * 100));
    line.setAttribute("vector-effect", "non-scaling-stroke");
    return line;
  });
  publicSensorTethers.replaceChildren(...lines);
}

function zoomPublicMapBy(factor, clientX, clientY, render = true) {
  const rect = publicSensorMap.getBoundingClientRect();
  const before = publicMapView();
  const xRatio = Number.isFinite(clientX) ? clamp((clientX - rect.left) / Math.max(rect.width, 1), 0, 1) : .5;
  const yRatio = Number.isFinite(clientY) ? clamp((clientY - rect.top) / Math.max(rect.height, 1), 0, 1) : .5;
  const anchorLongitude = before.west + xRatio * (before.east - before.west);
  const anchorLatitude = before.north - yRatio * (before.north - before.south);
  publicMapCamera.zoom = clamp(publicMapCamera.zoom * factor, publicMapMinZoom, publicMapMaxZoom);
  const after = publicMapView();
  publicMapCamera.longitude += anchorLongitude - (after.west + xRatio * (after.east - after.west));
  publicMapCamera.latitude += anchorLatitude - (after.north - yRatio * (after.north - after.south));
  if (render) updatePublicMapViewport();
}

function panPublicMap(deltaX, deltaY, render = true) {
  const rect = publicSensorMap.getBoundingClientRect();
  const view = publicMapView();
  publicMapCamera.longitude -= (deltaX / Math.max(rect.width, 1)) * (view.east - view.west);
  publicMapCamera.latitude += (deltaY / Math.max(rect.height, 1)) * (view.north - view.south);
  if (render) updatePublicMapViewport();
}

const avatarElement = (owner, tagName = "span") => {
  const wrapper = document.createElement(tagName);
  wrapper.className = "sensor-owner-avatar";
  if (owner.avatarUrl) wrapper.append(Object.assign(document.createElement("img"), { src: owner.avatarUrl, alt: "", loading: "lazy", decoding: "async" }));
  else wrapper.textContent = Array.from(owner.displayName || "?")[0] || "?";
  return wrapper;
};

const loadProfile = async () => {
  const response = await api("../api/web/v1/profile");
  currentProfile = response.profile;
  profileForm.elements.displayName.value = currentProfile.displayName;
  profileForm.elements.xUrl.value = currentProfile.xUrl || "";
  profileForm.elements.githubUrl.value = currentProfile.githubUrl || "";
  profileForm.elements.instagramUrl.value = currentProfile.instagramUrl || "";
  renderProfileAvatar();
};

const renderProfileAvatar = () => {
  profileAvatarPreview.replaceChildren();
  if (currentProfile?.avatarUrl) profileAvatarPreview.append(Object.assign(document.createElement("img"), { src: currentProfile.avatarUrl, alt: "" }));
  else profileAvatarPreview.append(Object.assign(document.createElement("span"), { textContent: Array.from(currentProfile?.displayName || "?")[0] || "?" }));
  document.querySelector("#profile-avatar-delete").disabled = !currentProfile?.avatarUrl;
};

const openDetail = async (deviceId) => {
  try {
    showView("loading");
    const [latest, historyResponse] = await Promise.all([
      api(`../api/web/v1/devices/${encodeURIComponent(deviceId)}/latest`),
      api(`../api/web/v1/devices/${encodeURIComponent(deviceId)}/telemetry?limit=48`),
    ]);
    selectedDevice = latest.device;
    renderDetail(latest, historyResponse.telemetry);
    showView("detail");
    history.replaceState(null, "", `#device=${encodeURIComponent(deviceId)}`);
    pollTimer = window.setInterval(() => refreshDetail({ quiet: true }), pollIntervalMs);
  } catch (error) {
    showStatus(error.message, "error");
    await showDevices();
  }
};

const refreshDetail = async ({ quiet = false } = {}) => {
  if (!selectedDevice) return;
  try {
    const [latest, history] = await Promise.all([
      api(`../api/web/v1/devices/${encodeURIComponent(selectedDevice.deviceId)}/latest`),
      api(`../api/web/v1/devices/${encodeURIComponent(selectedDevice.deviceId)}/telemetry?limit=48`),
    ]);
    selectedDevice = latest.device;
    renderDetail(latest, history.telemetry);
    if (!quiet) showStatus("最新の測定値へ更新しました。");
  } catch (error) {
    if (!quiet) showStatus(error.message, "error");
  }
};

const renderDetail = ({ device, latest }, telemetry) => {
  document.querySelector("#detail-id").textContent = device.deviceId;
  document.querySelector("#detail-name").textContent = device.name;
  const state = document.querySelector("#detail-state");
  state.textContent = device.state;
  state.dataset.state = device.state;
  document.querySelector("#detail-location").textContent = locationLabel(device);
  document.querySelector("#detail-updated").textContent = latest ? formatRelative(latest.receivedAt) : "まだデータがありません";
  latestMetrics.replaceChildren();
  if (!latest) latestMetrics.append(Object.assign(document.createElement("p"), { textContent: "最初のデータを待っています。" }));
  else Object.entries(latest.data).slice(0, 6).forEach(([key, value]) => latestMetrics.append(metric(key, value)));
  renderHistory(telemetry);
  if (!locationForm.contains(document.activeElement)) {
    locationForm.elements.name.value = device.name;
    locationForm.elements.countryCode.value = device.countryCode;
    locationForm.elements.admin1Code.value = device.admin1Code || "";
    locationForm.elements.localityName.value = device.localityName || "";
    locationForm.elements.isPublic.value = "true";
    locationForm.dataset.savedRegion = regionSelectionKey(
      device.countryCode,
      device.subdivisionCode,
      device.municipalityCode,
    );
    syncPickerViewport(locationForm, device.countryCode);
    setPickerLocation(locationForm, device.publicLatitude, device.publicLongitude);
    locationForm.querySelector("[data-location-picker]").dataset.regionPlot = "stored";
    syncPickerEnabled(locationForm);
    void populateRegionFields(locationForm, {
      subdivisionCode: device.subdivisionCode || "",
      municipalityCode: device.municipalityCode || "",
    });
  }
};

const renderHistory = (telemetry) => {
  historyList.replaceChildren();
  telemetry.slice(0, 12).forEach((entry) => {
    const item = document.createElement("li");
    const values = Object.entries(entry.data).slice(0, 3).map(([key, value]) => `${labelFor(key)} ${formatValue(value)}`).join(" / ");
    item.append(Object.assign(document.createElement("time"), { textContent: new Date(entry.receivedAt).toLocaleTimeString("ja-JP") }));
    item.append(Object.assign(document.createElement("span"), { textContent: values }));
    historyList.append(item);
  });
  const chartValues = telemetry.slice().reverse().map((entry) => Number(entry.data.temperature)).filter(Number.isFinite);
  historyChart.replaceChildren();
  if (!chartValues.length) {
    historyChart.textContent = "温度の履歴が届くとグラフを表示します。";
    return;
  }
  const minimum = Math.min(...chartValues);
  const maximum = Math.max(...chartValues);
  chartValues.forEach((value) => {
    const bar = document.createElement("i");
    const normalized = maximum === minimum ? 55 : 15 + ((value - minimum) / (maximum - minimum)) * 80;
    bar.style.setProperty("--height", `${normalized}%`);
    bar.title = `${value} ℃`;
    historyChart.append(bar);
  });
};

const metric = (key, value) => {
  const article = document.createElement("article");
  article.className = "sensor-metric";
  const label = document.createElement("span");
  const strong = document.createElement("strong");
  const unit = document.createElement("small");
  label.textContent = labelFor(key);
  strong.textContent = formatValue(value);
  unit.textContent = unitFor(key);
  strong.append(unit);
  article.append(label, strong);
  return article;
};

const showDevices = async () => {
  await loadDevices();
  showView("devices");
  history.replaceState(null, "", "#devices");
};

const routeFromHash = () => {
  if (location.hash.startsWith("#map")) showView("map");
  else if (location.hash === "#guide") showView("guide");
  else if (location.hash === "#terms") showView("terms");
  else if (!authenticated) showView("login");
  else if (location.hash === "#profile" && sessionUser?.accountKind !== "trial") showView("profile");
  else if (location.hash.startsWith("#device=")) openDetail(decodeURIComponent(location.hash.slice(8)));
  else showView("devices");
};

loginButton.addEventListener("click", () => { location.assign("../api/auth/google/start?returnTo=%2Fsensors%2F"); });
participationInfoOpen?.addEventListener("click", () => participationDialog?.showModal());
participationDialog?.addEventListener("click", (event) => {
  if (event.target === participationDialog) participationDialog.close();
});
upgradeGoogleButton.addEventListener("click", () => {
  upgradeGoogleButton.disabled = true;
  location.assign("../api/auth/google/start?returnTo=%2Fsensors%2F");
});
trialLoginButton.addEventListener("click", async () => {
  trialLoginButton.disabled = true;
  loginButton.disabled = true;
  try {
    const session = await api("../api/auth/trial", { method: "POST" });
    authenticated = true;
    sessionUser = session.user;
    syncAccountUi();
    await Promise.all([loadCountries(), loadDevices()]);
    history.replaceState(null, "", "#devices");
    showView("devices");
    showStatus("匿名のおためし利用を開始しました。");
  } catch (error) {
    showStatus(error.message, "error");
  } finally {
    trialLoginButton.disabled = false;
    loginButton.disabled = false;
  }
});
logoutButton.addEventListener("click", async () => {
  const isTrial = sessionUser?.accountKind === "trial";
  if (isTrial && !confirm("おためし利用をログアウトすると、登録したセンサーと観測データをすべて削除します。ログアウトしますか？")) return;
  logoutButton.disabled = true;
  try {
    await api("../api/web/v1/logout", { method: "POST" });
    authenticated = false;
    sessionUser = null;
    devices = [];
    selectedDevice = null;
    currentProfile = null;
    syncAccountUi();
    history.replaceState(null, "", "#login");
    showView("login");
    showStatus(isTrial ? "おためしデータを削除してログアウトしました。" : "ログアウトしました。");
  } catch (error) {
    showStatus(error.message, "error");
  } finally {
    logoutButton.disabled = false;
  }
});
showAddButton.addEventListener("click", () => showView("add"));
document.querySelectorAll("[data-action='show-add']").forEach((button) => button.addEventListener("click", () => showView("add")));
document.querySelectorAll("[data-action='devices']").forEach((button) => button.addEventListener("click", showDevices));
document.querySelectorAll("[data-action='map']").forEach((button) => button.addEventListener("click", () => { showView("map"); history.replaceState(null, "", "#map"); }));
document.querySelectorAll("[data-nav]").forEach((link) => link.addEventListener("click", (event) => {
  event.preventDefault();
  const destination = link.dataset.nav;
  if (!new Set(["map", "guide", "terms"]).has(destination) && !authenticated) { showView("login"); history.replaceState(null, "", "#login"); return; }
  if (destination === "profile" && sessionUser?.accountKind === "trial") { void showDevices(); return; }
  if (destination === "devices") showDevices();
  else { showView(destination); history.replaceState(null, "", `#${destination}`); }
}));
publicMapRefresh.addEventListener("click", async () => {
  publicMapRefresh.disabled = true;
  publicMapRefresh.setAttribute("aria-busy", "true");
  publicMapRefresh.dataset.compactLabel = "更新中";
  publicMapRefresh.textContent = "更新中…";
  try {
    await loadPublicSensors();
    publicMapRefresh.dataset.compactLabel = "完了";
    publicMapRefresh.textContent = "更新しました";
    window.setTimeout(() => {
      if (publicMapRefresh.textContent === "更新しました") {
        publicMapRefresh.dataset.compactLabel = "更新";
        publicMapRefresh.textContent = "地図を更新";
      }
    }, 1_800);
  } catch (error) {
    publicMapRefresh.dataset.compactLabel = "更新";
    publicMapRefresh.textContent = "地図を更新";
    showStatus(error.message, "error");
  } finally {
    publicMapRefresh.disabled = false;
    publicMapRefresh.removeAttribute("aria-busy");
  }
});

deviceForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const submit = deviceForm.querySelector("button[type='submit']");
  submit.disabled = true;
  try {
    const body = await formDeviceForSubmission(deviceForm);
    const response = await api("../api/web/v1/devices/pairing", { method: "POST", body });
    pairingCode.value = response.pairingCode;
    pairingCode.textContent = response.pairingCode;
    pairingExpiry.textContent = `有効期限 ${new Date(response.expiresAt).toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" })}`;
    showView("pairing");
  } catch (error) { showStatus(error.message, "error"); }
  finally { submit.disabled = false; }
});

document.querySelector("#copy-pairing").addEventListener("click", async () => {
  try { await navigator.clipboard.writeText(pairingCode.value); showStatus("Pairing Codeをコピーしました。"); }
  catch { showStatus("コードを選択してコピーしてください。", "error"); }
});
document.querySelector("#pairing-complete").addEventListener("click", showDevices);
document.querySelector("#refresh-detail").addEventListener("click", () => refreshDetail());

locationForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!selectedDevice) return;
  const submit = locationForm.querySelector("button[type='submit']");
  submit.disabled = true;
  try {
    const response = await api(`../api/web/v1/devices/${encodeURIComponent(selectedDevice.deviceId)}`, {
      method: "PATCH",
      body: await formDeviceForSubmission(locationForm),
    });
    selectedDevice = response.device;
    locationForm.dataset.savedRegion = formRegionSelectionKey(locationForm);
    locationForm.querySelector("[data-location-picker]").dataset.regionPlot = "stored";
    showStatus("地域を更新しました。");
    await Promise.all([refreshDetail({ quiet: true }), loadPublicSensors()]);
  } catch (error) { showStatus(error.message, "error"); }
  finally { submit.disabled = false; }
});

profileForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const submit = profileForm.querySelector("button[type='submit']");
  submit.disabled = true;
  try {
    const data = new FormData(profileForm);
    const response = await api("../api/web/v1/profile", { method: "PATCH", body: {
      displayName: String(data.get("displayName") || "").trim(),
      xUrl: String(data.get("xUrl") || "").trim() || null,
      githubUrl: String(data.get("githubUrl") || "").trim() || null,
      instagramUrl: String(data.get("instagramUrl") || "").trim() || null,
    } });
    currentProfile = response.profile;
    renderProfileAvatar();
    showStatus("プロフィールを保存しました。");
    await loadPublicSensors();
  } catch (error) { showStatus(error.message, "error"); }
  finally { submit.disabled = false; }
});

profileAvatarInput.addEventListener("change", async () => {
  const file = profileAvatarInput.files?.[0];
  if (!file) return;
  profileAvatarInput.disabled = true;
  try {
    const png = await normalizeAvatar(file);
    const response = await api("../api/web/v1/profile/avatar", { method: "PUT", rawBody: png, headers: { "Content-Type": "image/png" } });
    currentProfile = response.profile;
    renderProfileAvatar();
    showStatus("アイコンを保存しました。");
    await loadPublicSensors();
  } catch (error) { showStatus(error.message, "error"); }
  finally { profileAvatarInput.value = ""; profileAvatarInput.disabled = false; }
});

document.querySelector("#profile-avatar-delete").addEventListener("click", async () => {
  try {
    await api("../api/web/v1/profile/avatar", { method: "DELETE" });
    currentProfile = { ...currentProfile, avatarUrl: null };
    renderProfileAvatar();
    showStatus("アイコンを削除しました。");
    await loadPublicSensors();
  } catch (error) { showStatus(error.message, "error"); }
});

document.querySelector("#revoke-device").addEventListener("click", async () => {
  if (!selectedDevice || !confirm(`${selectedDevice.name} を削除しますか？Device Tokenは直ちに無効になります。`)) return;
  try {
    await api(`../api/web/v1/devices/${encodeURIComponent(selectedDevice.deviceId)}`, { method: "DELETE" });
    selectedDevice = null;
    showStatus("センサーを削除しました。");
    await showDevices();
  } catch (error) { showStatus(error.message, "error"); }
});

window.addEventListener("hashchange", () => {
  routeFromHash();
  if (location.hash.startsWith("#map")) restorePublicSensorSelectionFromHash();
});
void boot();

function syncAccountUi() {
  logoutButton.hidden = !authenticated;
  const trial = sessionUser?.accountKind === "trial";
  profileNav.hidden = trial;
  upgradeGoogleButton.hidden = !authenticated || !trial;
  upgradeGoogleButton.disabled = false;
  accountNote.hidden = !authenticated;
  accountNote.textContent = trial
    ? `${sessionUser?.displayName || "匿名参加者"}としておためし利用中。修正・削除できます。Google登録するとセンサーと履歴を保持し、ログアウトすると削除します。`
    : `${sessionUser?.displayName || "GAIA参加者"}としてGoogle連携中。Googleの名前・メールアドレスは保存していません。`;
}

function formDevice(form) {
  const data = new FormData(form);
  const subdivisionCode = String(data.get("subdivisionCode") || "").trim() || null;
  const municipalityCode = String(data.get("municipalityCode") || "").trim() || null;
  return {
    name: String(data.get("name") || "").trim(),
    countryCode: String(data.get("countryCode") || "").trim(),
    subdivisionCode,
    municipalityCode,
    admin1Code: subdivisionCode ? null : String(data.get("admin1Code") || "").trim() || null,
    localityName: municipalityCode ? null : String(data.get("localityName") || "").trim() || null,
    isPublic: true,
    publicLatitude: numberOrNull(data.get("publicLatitude")),
    publicLongitude: numberOrNull(data.get("publicLongitude")),
  };
}

function initRegionFields() {
  document.querySelectorAll("form [data-region-fields]").forEach((group) => {
    const form = group.closest("form");
    form.elements.countryCode.addEventListener("change", () => {
      form.elements.subdivisionCode.value = "";
      form.elements.municipalityCode.value = "";
      form.elements.admin1Code.value = "";
      form.elements.localityName.value = "";
      syncPickerViewport(form, form.elements.countryCode.value, { ensureLocation: true });
      void plotSelectedRegion(form);
      void populateRegionFields(form);
    });
    form.elements.subdivisionCode.addEventListener("change", () => {
      form.elements.municipalityCode.value = "";
      form.elements.admin1Code.value = "";
      form.elements.localityName.value = "";
      void plotSelectedRegion(form);
      void populateRegionFields(form, { subdivisionCode: form.elements.subdivisionCode.value });
    });
    form.elements.municipalityCode.addEventListener("change", () => {
      if (form.elements.municipalityCode.value) form.elements.localityName.value = "";
      void plotSelectedRegion(form);
    });
  });
}

async function populateRegionFields(form, selection = {}) {
  const countryCode = form.elements.countryCode.value;
  const subdivisionSelect = form.elements.subdivisionCode;
  const municipalitySelect = form.elements.municipalityCode;
  const municipalityField = municipalitySelect.closest("[data-municipality-field]");
  const note = form.querySelector("[data-region-note]");
  const requestedSubdivision = selection.subdivisionCode ?? subdivisionSelect.value;
  const requestedMunicipality = selection.municipalityCode ?? municipalitySelect.value;
  const requestKey = `${countryCode}:${requestedSubdivision}`;
  form.dataset.regionRequest = requestKey;
  subdivisionSelect.disabled = true;
  municipalitySelect.disabled = true;
  municipalityField.hidden = countryCode !== "JP";
  if (!countryCode) {
    replaceOptions(subdivisionSelect, "国を選択してください", []);
    replaceOptions(municipalitySelect, "都道府県を選択してください", []);
    note.textContent = "地域はISOの正式コードで保存します。住所は入力・保存しません。";
    return;
  }
  try {
    const base = await loadRegions(countryCode);
    if (form.dataset.regionRequest !== requestKey) return;
    replaceOptions(subdivisionSelect, "指定しない", base.subdivisions);
    subdivisionSelect.disabled = base.subdivisions.length === 0;
    subdivisionSelect.value = requestedSubdivision;
    if (requestedSubdivision && !subdivisionSelect.value) appendCurrentOption(subdivisionSelect, requestedSubdivision);
    if (countryCode === "JP" && subdivisionSelect.value) {
      const scoped = await loadRegions(countryCode, subdivisionSelect.value);
      if (form.dataset.regionRequest !== requestKey) return;
      replaceOptions(municipalitySelect, "指定しない", scoped.municipalities);
      municipalitySelect.disabled = false;
      municipalitySelect.value = requestedMunicipality;
      if (requestedMunicipality && !municipalitySelect.value) appendCurrentOption(municipalitySelect, requestedMunicipality);
    } else {
      replaceOptions(municipalitySelect, "都道府県を選択してください", []);
    }
    const legacy = !subdivisionSelect.value && (form.elements.admin1Code.value || form.elements.localityName.value);
    note.textContent = legacy
      ? `既存の地域表記「${[form.elements.admin1Code.value, form.elements.localityName.value].filter(Boolean).join(" / ")}」を保持中です。正式コードを選ぶと正規化されます。`
      : countryCode === "JP"
        ? "都道府県はISO 3166-2、市区町村は検査数字を含むJ-LISの6桁コードで保存します。住所は保存しません。"
        : "地域は国コードを含む完全なISO 3166-2コードで保存します。住所は保存しません。";
  } catch (error) {
    if (form.dataset.regionRequest !== requestKey) return;
    replaceOptions(subdivisionSelect, "地域コードを読み込めません", []);
    replaceOptions(municipalitySelect, "市区町村コードを読み込めません", []);
    note.textContent = error.message;
  }
}

async function loadRegions(countryCode, subdivisionCode = "") {
  const key = `${countryCode}:${subdivisionCode}`;
  if (!regionCache.has(key)) {
    const query = new URLSearchParams({ countryCode });
    if (subdivisionCode) query.set("subdivisionCode", subdivisionCode);
    regionCache.set(key, api(`../api/web/v1/regions?${query}`));
  }
  try { return await regionCache.get(key); }
  catch (error) { regionCache.delete(key); throw error; }
}

async function plotSelectedRegion(form) {
  const version = (regionPlotVersions.get(form) ?? 0) + 1;
  regionPlotVersions.set(form, version);
  const countryCode = form.elements.countryCode.value;
  const subdivisionCode = form.elements.subdivisionCode.value;
  const municipalityCode = form.elements.municipalityCode.value;
  const picker = form.querySelector("[data-location-picker]");
  if (countryCode !== "JP") {
    picker.dataset.regionPlot = "idle";
    return;
  }
  if (!subdivisionCode) {
    setPickerLocation(form, 35.7, 139.7);
    picker.dataset.regionPlot = "ready";
    return;
  }
  const prefectureCentre = japanPrefectureCentres[subdivisionCode];
  if (prefectureCentre) setPickerLocation(form, prefectureCentre[0], prefectureCentre[1]);
  if (!municipalityCode) {
    picker.dataset.regionPlot = "ready";
    return;
  }
  picker.dataset.regionPlot = "loading";
  const query = new URLSearchParams({ countryCode, subdivisionCode, municipalityCode });
  const cacheKey = query.toString();
  if (!regionLocationCache.has(cacheKey)) {
    regionLocationCache.set(cacheKey, api(`../api/web/v1/region-location?${query}`));
  }
  try {
    const response = await regionLocationCache.get(cacheKey);
    if (regionPlotVersions.get(form) !== version) return;
    setPickerLocation(form, response.location.latitude, response.location.longitude);
    picker.dataset.regionPlot = "ready";
  } catch {
    regionLocationCache.delete(cacheKey);
    if (regionPlotVersions.get(form) === version) picker.dataset.regionPlot = "fallback";
  }
}

function cancelRegionPlot(form) {
  regionPlotVersions.set(form, (regionPlotVersions.get(form) ?? 0) + 1);
  const picker = form.querySelector("[data-location-picker]");
  if (picker) picker.dataset.regionPlot = "manual";
}

function replaceOptions(select, emptyLabel, options) {
  select.replaceChildren(new Option(emptyLabel, ""));
  options.forEach((option) => select.append(new Option(`${option.name} / ${option.code}`, option.code)));
}

function appendCurrentOption(select, code) {
  select.append(new Option(`${code} / 現在の登録値`, code));
  select.value = code;
}

function initLocationPickers() {
  document.querySelectorAll(".sensor-public-location").forEach((fieldset) => {
    const form = fieldset.closest("form");
    const picker = fieldset.querySelector("[data-location-picker]");
    picker.addEventListener("pointerdown", (event) => {
      cancelRegionPlot(form);
      const rect = picker.getBoundingClientRect();
      const view = mapViewFor(picker);
      const bounds = selectionBoundsFor(view);
      setPickerLocation(
        form,
        clamp(view.north - ((event.clientY - rect.top) / rect.height) * (view.north - view.south), bounds.south, bounds.north),
        clamp(view.west + ((event.clientX - rect.left) / rect.width) * (view.east - view.west), bounds.west, bounds.east),
      );
    });
    picker.addEventListener("keydown", (event) => {
      if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) return;
      event.preventDefault();
      cancelRegionPlot(form);
      const view = mapViewFor(picker);
      const bounds = selectionBoundsFor(view);
      const latitude = numberOrNull(form.elements.publicLatitude.value) ?? ((view.north + view.south) / 2);
      const longitude = numberOrNull(form.elements.publicLongitude.value) ?? ((view.east + view.west) / 2);
      setPickerLocation(
        form,
        clamp(latitude + (event.key === "ArrowUp" ? 1 : event.key === "ArrowDown" ? -1 : 0), bounds.south, bounds.north),
        clamp(longitude + (event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0), bounds.west, bounds.east),
      );
    });
    syncPickerViewport(form, form.elements.countryCode.value);
    syncPickerEnabled(form);
  });
}

function syncPickerViewport(form, countryCode, { ensureLocation = false } = {}) {
  const picker = form.querySelector("[data-location-picker]");
  if (!picker) return;
  const view = countryMapViews[countryCode] || worldMapView;
  mapViewports.set(picker, view);
  picker.dataset.mapView = view.key;
  const basis = picker.querySelector("[data-map-basis]");
  if (basis) basis.textContent = view.key === "WORLD" ? "BASEMAP / NATURAL EARTH 1:50m" : `BASEMAP / NATURAL EARTH / ${view.key}`;
  const latitude = numberOrNull(form.elements.publicLatitude.value);
  const longitude = numberOrNull(form.elements.publicLongitude.value);
  const bounds = selectionBoundsFor(view);
  const outsideView = latitude !== null && longitude !== null
    && (latitude < bounds.south || latitude > bounds.north || longitude < bounds.west || longitude > bounds.east);
  if (ensureLocation && (latitude === null || longitude === null || outsideView)) {
    setPickerLocation(form, (bounds.north + bounds.south) / 2, (bounds.east + bounds.west) / 2);
  } else {
    setPickerLocation(form, latitude, longitude);
  }
  mapRenderers.get(picker)?.();
}

function mapViewFor(surface) {
  return mapViewports.get(surface) || worldMapView;
}

function selectionBoundsFor(view) {
  return {
    west: view.selectionWest ?? view.west,
    east: view.selectionEast ?? view.east,
    south: view.selectionSouth ?? view.south,
    north: view.selectionNorth ?? view.north,
  };
}

async function formDeviceForSubmission(form) {
  const picker = form.querySelector("[data-location-picker]");
  const regionChanged = form.dataset.savedRegion !== undefined
    && form.dataset.savedRegion !== formRegionSelectionKey(form);
  if (picker?.dataset.regionPlot === "loading" || (regionChanged && picker?.dataset.regionPlot !== "manual")) {
    await plotSelectedRegion(form);
  }
  return formDevice(form);
}

function formRegionSelectionKey(form) {
  return regionSelectionKey(
    form.elements.countryCode.value,
    form.elements.subdivisionCode.value,
    form.elements.municipalityCode.value,
  );
}

function regionSelectionKey(countryCode, subdivisionCode, municipalityCode) {
  return [countryCode, subdivisionCode, municipalityCode].map((value) => String(value || "").trim()).join(":");
}

function syncPickerEnabled(form) {
  const picker = form.querySelector("[data-location-picker]");
  picker.removeAttribute("aria-disabled");
  if (numberOrNull(form.elements.publicLatitude.value) === null) setPickerLocation(form, 35.7, 139.7);
}

function setPickerLocation(form, rawLatitude, rawLongitude) {
  const latitude = rawLatitude === null || rawLatitude === undefined ? null : Math.max(-90, Math.min(90, Math.round(Number(rawLatitude) * 10) / 10));
  const longitude = rawLongitude === null || rawLongitude === undefined ? null : Math.max(-180, Math.min(180, Math.round(Number(rawLongitude) * 10) / 10));
  form.elements.publicLatitude.value = latitude ?? "";
  form.elements.publicLongitude.value = longitude ?? "";
  const picker = form.querySelector("[data-location-picker]");
  picker.querySelector(".sensor-picker-pin")?.remove();
  const output = form.querySelector("[data-location-output]");
  if (latitude === null || longitude === null) { output.textContent = "位置は未選択です"; return; }
  const pin = document.createElement("i");
  pin.className = "sensor-picker-pin";
  const view = mapViewFor(picker);
  pin.style.left = `${longitudeToPercent(longitude, view)}%`;
  pin.style.top = `${latitudeToPercent(latitude, view)}%`;
  picker.append(pin);
  output.textContent = `公開位置 ${latitude.toFixed(1)}, ${longitude.toFixed(1)}（約10km単位）`;
}

async function mountMapSurfaces() {
  const surfaces = [...document.querySelectorAll(".sensor-world-map, .sensor-location-picker")];
  surfaces.forEach((surface) => { surface.dataset.basemap = "loading"; });
  try {
    const [countryResponse, prefectureLines] = await Promise.all([
      fetch(naturalEarthCountriesUrl),
      fetch(japanPrefectureUrl)
        .then((response) => response.ok ? response.json() : Promise.reject(new Error(`HTTP ${response.status}`)))
        .then(extractSharedTopologyArcs)
        .catch(() => []),
    ]);
    if (!countryResponse.ok) throw new Error(`HTTP ${countryResponse.status}`);
    const countryLines = prepareMapLines(extractLandRings(await countryResponse.json()));
    if (countryLines.length < 200) throw new Error("country geometry is incomplete");
    surfaces.forEach((surface) => mountMapCanvas(surface, countryLines, prefectureLines));
  } catch {
    surfaces.forEach((surface) => {
      surface.dataset.basemap = "unavailable";
      const basis = surface.querySelector("[data-map-basis]");
      if (basis) basis.textContent = "BASEMAP / UNAVAILABLE";
    });
  }
}

function extractSharedTopologyArcs(topology) {
  if (topology?.type !== "Topology" || !Array.isArray(topology.arcs)) return [];
  const referenceCounts = new Uint16Array(topology.arcs.length);
  const visitArcReferences = (value) => {
    if (Array.isArray(value)) { value.forEach(visitArcReferences); return; }
    if (!Number.isInteger(value)) return;
    const index = value < 0 ? ~value : value;
    if (index >= 0 && index < referenceCounts.length) referenceCounts[index] += 1;
  };
  Object.values(topology.objects ?? {}).forEach((object) => {
    if (object?.type === "GeometryCollection") object.geometries?.forEach((geometry) => visitArcReferences(geometry.arcs));
    else visitArcReferences(object?.arcs);
  });

  const scale = topology.transform?.scale ?? [1, 1];
  const translate = topology.transform?.translate ?? [0, 0];
  const sharedArcs = [];
  topology.arcs.forEach((arc, index) => {
    if (referenceCounts[index] < 2 || !Array.isArray(arc)) return;
    let x = 0;
    let y = 0;
    const points = [];
    arc.forEach((delta) => {
      x += Number(delta?.[0]) || 0;
      y += Number(delta?.[1]) || 0;
      points.push([x * scale[0] + translate[0], y * scale[1] + translate[1]]);
    });
    if (points.length > 1) sharedArcs.push(points);
  });
  return prepareMapLines(sharedArcs);
}

function extractLandRings(geojson) {
  const rings = [];
  for (const feature of geojson?.features ?? []) {
    const geometry = feature?.geometry;
    if (geometry?.type === "Polygon") rings.push(...geometry.coordinates);
    else if (geometry?.type === "MultiPolygon") geometry.coordinates.forEach((polygon) => rings.push(...polygon));
  }
  return rings;
}

function prepareMapLines(lines) {
  return lines.map((line) => {
    const points = [];
    let west = Infinity;
    let east = -Infinity;
    let south = Infinity;
    let north = -Infinity;
    for (const coordinate of line ?? []) {
      const longitude = Number(coordinate?.[0]);
      const latitude = Number(coordinate?.[1]);
      if (!Number.isFinite(longitude) || !Number.isFinite(latitude)) continue;
      points.push([longitude, latitude]);
      west = Math.min(west, longitude);
      east = Math.max(east, longitude);
      south = Math.min(south, latitude);
      north = Math.max(north, latitude);
    }
    return { points, west, east, south, north };
  }).filter((line) => line.points.length > 1);
}

function mountMapCanvas(surface, countryLines, prefectureLines) {
  const canvas = document.createElement("canvas");
  canvas.className = "sensor-map-canvas";
  if (surface === publicSensorMap) canvas.classList.add("sensor-map-canvas--overscan");
  canvas.setAttribute("aria-hidden", "true");
  surface.prepend(canvas);
  surface.dataset.countryBoundaries = String(countryLines.length);
  surface.dataset.prefectureBoundaries = String(prefectureLines.length);
  const render = () => renderMapCanvas(canvas, countryLines, prefectureLines, mapViewFor(surface));
  mapRenderers.set(surface, render);
  if (typeof ResizeObserver === "function") {
    const observer = new ResizeObserver(render);
    observer.observe(surface);
    mapObservers.push(observer);
  } else {
    window.addEventListener("resize", render, { passive: true });
  }
  surface.dataset.basemap = "ready";
  render();
}

function renderMapCanvas(canvas, countryLines, prefectureLines, view = worldMapView) {
  const overscan = canvas.classList.contains("sensor-map-canvas--overscan") ? publicMapOverscanRatio : 0;
  const { width, height } = (overscan ? canvas : canvas.parentElement).getBoundingClientRect();
  if (width < 1 || height < 1) return;
  if (overscan) {
    const longitudeMargin = (view.east - view.west) * overscan;
    const latitudeMargin = (view.north - view.south) * overscan;
    view = {
      ...view,
      west: view.west - longitudeMargin,
      east: view.east + longitudeMargin,
      south: view.south - latitudeMargin,
      north: view.north + latitudeMargin,
    };
  }
  const requestedPixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  const pixelBudgetRatio = overscan ? Math.sqrt(publicMapCanvasPixelBudget / Math.max(width * height, 1)) : requestedPixelRatio;
  const dimensionRatio = overscan ? 8_192 / Math.max(width, height, 1) : requestedPixelRatio;
  const pixelRatio = Math.max(.35, Math.min(requestedPixelRatio, pixelBudgetRatio, dimensionRatio));
  const canvasWidth = Math.round(width * pixelRatio);
  const canvasHeight = Math.round(height * pixelRatio);
  canvas.dataset.renderScale = pixelRatio.toFixed(3);
  canvas.dataset.renderPixels = String(canvasWidth * canvasHeight);
  if (canvas.width !== canvasWidth || canvas.height !== canvasHeight) {
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
  }
  const context = canvas.getContext("2d", { alpha: true, desynchronized: true });
  if (!context) return;
  context.setTransform(1, 0, 0, 1, 0, 0);
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  context.save();
  context.strokeStyle = "rgba(126, 230, 214, .16)";
  context.lineWidth = 1;
  context.setLineDash([2, 7]);
  const span = view.east - view.west;
  const longitudeStep = view.key === "WORLD" ? 30 : span > 100 ? 10 : span > 35 ? 5 : span > 15 ? 2 : 1;
  const latitudeStep = longitudeStep;
  for (let longitude = Math.ceil(view.west / longitudeStep) * longitudeStep; longitude < view.east; longitude += longitudeStep) {
    const x = ((longitude - view.west) / (view.east - view.west)) * width;
    context.beginPath(); context.moveTo(x, 0); context.lineTo(x, height); context.stroke();
  }
  for (let latitude = Math.ceil(view.south / latitudeStep) * latitudeStep; latitude < view.north; latitude += latitudeStep) {
    const y = ((view.north - latitude) / (view.north - view.south)) * height;
    context.beginPath(); context.moveTo(0, y); context.lineTo(width, y); context.stroke();
  }
  context.restore();

  const land = new Path2D();
  for (const ring of countryLines) {
    for (const longitudeOffset of mapLongitudeOffsets(view)) {
      if (ring.east + longitudeOffset < view.west || ring.west + longitudeOffset > view.east || ring.north < view.south || ring.south > view.north) continue;
      let started = false;
      let previousLongitude = null;
      for (const [longitude, latitude] of ring.points) {
        const shiftedLongitude = longitude + longitudeOffset;
        const x = ((shiftedLongitude - view.west) / (view.east - view.west)) * width;
        const y = ((view.north - latitude) / (view.north - view.south)) * height;
        if (!started || (previousLongitude !== null && Math.abs(longitude - previousLongitude) > 180)) {
          land.moveTo(x, y);
          started = true;
        } else land.lineTo(x, y);
        previousLongitude = longitude;
      }
      if (started) land.closePath();
    }
  }
  context.fillStyle = "rgba(30, 103, 99, .34)";
  context.fill(land, "evenodd");
  context.strokeStyle = "rgba(137, 244, 216, .72)";
  context.lineWidth = Math.max(.65, width / 1_900);
  context.shadowColor = "rgba(86, 255, 223, .2)";
  context.shadowBlur = width > 2_200 ? 0 : 5;
  context.stroke(land);

  const prefectures = new Path2D();
  for (const line of prefectureLines) {
    for (const longitudeOffset of mapLongitudeOffsets(view)) {
      if (line.east + longitudeOffset < view.west || line.west + longitudeOffset > view.east || line.north < view.south || line.south > view.north) continue;
      let started = false;
      for (const [longitude, latitude] of line.points) {
        const x = ((longitude + longitudeOffset - view.west) / (view.east - view.west)) * width;
        const y = ((view.north - latitude) / (view.north - view.south)) * height;
        if (!started) { prefectures.moveTo(x, y); started = true; }
        else prefectures.lineTo(x, y);
      }
    }
  }
  context.strokeStyle = "rgba(213, 255, 244, .58)";
  context.lineWidth = Math.max(.7, Math.min(1.35, width / 1_700));
  context.shadowColor = "rgba(119, 255, 225, .28)";
  context.shadowBlur = width > 2_200 ? 0 : 3;
  context.stroke(prefectures);
}

async function normalizeAvatar(file) {
  if (file.type !== "image/png" || file.size > 8 * 1024 * 1024) throw new Error("8MB以下のPNGを選んでください。");
  const bitmap = await createImageBitmap(file);
  const sourceEdge = Math.min(bitmap.width, bitmap.height);
  const outputEdge = Math.min(512, sourceEdge);
  if (sourceEdge < 1) { bitmap.close(); throw new Error("画像を読み込めませんでした。"); }
  const canvas = document.createElement("canvas");
  canvas.width = outputEdge; canvas.height = outputEdge;
  const context = canvas.getContext("2d", { alpha: true });
  context.drawImage(bitmap, (bitmap.width - sourceEdge) / 2, (bitmap.height - sourceEdge) / 2, sourceEdge, sourceEdge, 0, 0, outputEdge, outputEdge);
  bitmap.close();
  const blob = await new Promise((resolve, reject) => canvas.toBlob((value) => value ? resolve(value) : reject(new Error("PNGを作成できませんでした。")), "image/png"));
  if (blob.size > 1024 * 1024) throw new Error("変換後のPNGが1MBを超えています。");
  return blob;
}

function numberOrNull(value) { const number = Number(value); return value === null || value === "" || !Number.isFinite(number) ? null : number; }
function clamp(value, minimum, maximum) { return Math.max(minimum, Math.min(maximum, value)); }
function normalizeLongitude(longitude) { return ((Number(longitude) + 180) % 360 + 360) % 360 - 180; }
function mapLongitudeOffsets(view) { return view.key === "PUBLIC" ? [-360, 0, 360] : [0]; }
function longitudeNearestToView(longitude, view) {
  const viewCenter = (view.west + view.east) / 2;
  return Number(longitude) + 360 * Math.round((viewCenter - Number(longitude)) / 360);
}
function longitudeToPercent(longitude, view = worldMapView) { return ((Number(longitude) - view.west) / (view.east - view.west)) * 100; }
function latitudeToPercent(latitude, view = worldMapView) { return ((view.north - Number(latitude)) / (view.north - view.south)) * 100; }

function readCookie(name) {
  const prefix = `${name}=`;
  const pair = document.cookie.split(";").map((value) => value.trim()).find((value) => value.startsWith(prefix));
  return pair ? decodeURIComponent(pair.slice(prefix.length)) : "";
}

function locationLabel(device) {
  const country = device.countryName === device.countryCode ? regionNames?.of(device.countryCode) : device.countryName;
  const subdivision = device.subdivisionCode
    ? `${device.subdivisionName || device.subdivisionCode} (${device.subdivisionCode})`
    : device.admin1Code;
  const municipality = device.municipalityCode
    ? `${device.municipalityName || device.localityName || device.municipalityCode} (${device.municipalityCode})`
    : device.localityName;
  return [country || device.countryCode, subdivision, municipality].filter(Boolean).join(" / ");
}
function formatValue(value) { return Number.isFinite(Number(value)) ? Number(value).toLocaleString("ja-JP", { maximumFractionDigits: 2 }) : "—"; }
function formatRelative(iso) { const seconds = Math.max(0, Math.floor((Date.now() - Date.parse(iso)) / 1000)); return seconds < 60 ? `${seconds}秒前` : seconds < 3600 ? `${Math.floor(seconds / 60)}分前` : new Date(iso).toLocaleString("ja-JP"); }
function labelFor(key) { return ({ temperature: "温度", humidity: "湿度", pm25: "PM2.5", pm10: "PM10", voc: "VOC", nox: "NOx" })[key] || key; }
function unitFor(key) { return ({ temperature: "℃", humidity: "%", pm25: "µg/m³", pm10: "µg/m³", voc: "ppb", nox: "ppb" })[key] || ""; }
