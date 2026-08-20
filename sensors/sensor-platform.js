const views = new Map(Array.from(document.querySelectorAll("[data-view]"), (element) => [element.dataset.view, element]));
const statusRegion = document.querySelector("#sensor-status");
const loginButton = document.querySelector("#google-login");
const trialLoginButton = document.querySelector("#trial-login");
const logoutButton = document.querySelector("#sensor-logout");
const profileNav = document.querySelector("#profile-nav");
const accountNote = document.querySelector("#sensor-account-note");
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
const publicSensorMarkers = document.querySelector("#public-sensor-markers");
const publicSensorList = document.querySelector("#public-sensor-list");
const publicSensorDetail = document.querySelector("#public-sensor-detail");
const profileForm = document.querySelector("#profile-form");
const profileAvatarPreview = document.querySelector("#profile-avatar-preview");
const profileAvatarInput = document.querySelector("#profile-avatar-input");
const publicSensorCount = document.querySelector("#public-sensor-count");
const pollIntervalMs = 2_000;
const naturalEarthUrl = "../data/natural-earth-50m-land.geojson?v=gaia-27";
const regionNames = typeof Intl.DisplayNames === "function" ? new Intl.DisplayNames(["ja"], { type: "region" }) : null;
const worldMapView = Object.freeze({ west: -180, east: 180, south: -90, north: 90, key: "WORLD" });
const countryMapViews = Object.freeze({
  JP: Object.freeze({ west: 122, east: 154, south: 20, north: 48, key: "JP" }),
});
const regionCache = new Map();
const mapObservers = [];
const mapViewports = new WeakMap();
const mapRenderers = new WeakMap();
let countries = [];
let devices = [];
let selectedDevice = null;
let publicSensors = [];
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
  window.clearInterval(pollTimer);
  pollTimer = 0;
  for (const [key, element] of views) element.hidden = key !== name;
  document.querySelectorAll("[data-nav]").forEach((link) => {
    link.toggleAttribute("aria-current", link.dataset.nav === name);
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
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
      if (location.hash === "#map") showView("map");
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
  devices.forEach((device) => {
    const fragment = cardTemplate.content.cloneNode(true);
    const card = fragment.querySelector("article");
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

const loadPublicSensors = async () => {
  const response = await api("../api/public/v1/sensors");
  publicSensors = response.sensors;
  renderPublicSensors();
};

const renderPublicSensors = () => {
  publicSensorMarkers.replaceChildren();
  publicSensorList.replaceChildren();
  publicSensorCount.textContent = `${String(publicSensors.length).padStart(3, "0")} NODES`;
  if (!publicSensors.length) {
    publicSensorDetail.replaceChildren(
      Object.assign(document.createElement("small"), { className: "sensor-console-label", textContent: "SIGNAL STATUS" }),
      Object.assign(document.createElement("p"), { textContent: "公開中のセンサーはまだありません。最初の信号を待っています。" }),
    );
    return;
  }
  publicSensors.forEach((sensor, index) => {
    const marker = document.createElement("button");
    marker.type = "button";
    marker.className = "sensor-map-marker";
    marker.style.left = `${longitudeToPercent(sensor.location.longitude)}%`;
    marker.style.top = `${latitudeToPercent(sensor.location.latitude)}%`;
    marker.dataset.state = sensor.state;
    marker.setAttribute("aria-label", `${sensor.owner.displayName}さんの${sensor.sensorName}`);
    marker.append(avatarElement(sensor.owner, "span"));
    marker.addEventListener("click", () => selectPublicSensor(sensor, marker));
    publicSensorMarkers.append(marker);

    const card = document.createElement("button");
    card.type = "button";
    card.className = "sensor-public-card";
    card.append(avatarElement(sensor.owner, "span"));
    const text = document.createElement("span");
    text.innerHTML = `<strong></strong><small></small>`;
    text.querySelector("strong").textContent = sensor.sensorName;
    text.querySelector("small").textContent = `${sensor.owner.displayName} / ${sensor.state}`;
    card.append(text);
    card.addEventListener("click", () => { selectPublicSensor(sensor, marker); publicSensorMap.scrollIntoView({ behavior: "smooth", block: "center" }); });
    publicSensorList.append(card);
    if (index === 0) selectPublicSensor(sensor, marker);
  });
};

const selectPublicSensor = (sensor, marker) => {
  document.querySelectorAll(".sensor-map-marker[aria-current]").forEach((element) => element.removeAttribute("aria-current"));
  marker.setAttribute("aria-current", "true");
  publicSensorDetail.replaceChildren();
  const consoleLabel = Object.assign(document.createElement("small"), { className: "sensor-console-label", textContent: "SELECTED SIGNAL" });
  const owner = document.createElement("div");
  owner.className = "sensor-map-owner";
  owner.append(avatarElement(sensor.owner, "span"));
  const heading = document.createElement("div");
  heading.append(Object.assign(document.createElement("small"), { textContent: sensor.owner.displayName }));
  heading.append(Object.assign(document.createElement("h2"), { textContent: sensor.sensorName }));
  owner.append(heading);
  const state = Object.assign(document.createElement("span"), { className: "sensor-state", textContent: sensor.state });
  state.dataset.state = sensor.state;
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
  publicSensorDetail.append(consoleLabel, owner, note, social);
};

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
    locationForm.elements.isPublic.checked = Boolean(device.isPublic);
    syncPickerViewport(locationForm, device.countryCode);
    setPickerLocation(locationForm, device.publicLatitude, device.publicLongitude);
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
  if (location.hash === "#map") showView("map");
  else if (!authenticated) showView("login");
  else if (location.hash === "#profile" && sessionUser?.accountKind !== "trial") showView("profile");
  else if (location.hash === "#guide") showView("guide");
  else if (location.hash.startsWith("#device=")) openDetail(decodeURIComponent(location.hash.slice(8)));
  else showView("devices");
};

loginButton.addEventListener("click", () => { location.assign("../api/auth/google/start?returnTo=%2Fsensors%2F"); });
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
  if (destination !== "map" && !authenticated) { showView("login"); history.replaceState(null, "", "#login"); return; }
  if (destination === "profile" && sessionUser?.accountKind === "trial") { void showDevices(); return; }
  if (destination === "devices") showDevices();
  else { showView(destination); history.replaceState(null, "", `#${destination}`); }
}));
document.querySelector("#refresh-map").addEventListener("click", async () => {
  try { await loadPublicSensors(); showStatus("公開センサーを更新しました。"); }
  catch (error) { showStatus(error.message, "error"); }
});

deviceForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const submit = deviceForm.querySelector("button[type='submit']");
  submit.disabled = true;
  try {
    const body = formDevice(deviceForm);
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
  try {
    const response = await api(`../api/web/v1/devices/${encodeURIComponent(selectedDevice.deviceId)}`, { method: "PATCH", body: formDevice(locationForm) });
    selectedDevice = response.device;
    showStatus("地域を更新しました。");
    await refreshDetail({ quiet: true });
  } catch (error) { showStatus(error.message, "error"); }
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

window.addEventListener("hashchange", routeFromHash);
void boot();

function syncAccountUi() {
  logoutButton.hidden = !authenticated;
  const trial = sessionUser?.accountKind === "trial";
  profileNav.hidden = trial;
  accountNote.hidden = !authenticated;
  accountNote.textContent = trial
    ? `${sessionUser?.displayName || "匿名参加者"}としておためし利用中。ログアウトすると、この利用で登録したデータを削除します。`
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
    isPublic: data.get("isPublic") === "on",
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
      void populateRegionFields(form);
    });
    form.elements.subdivisionCode.addEventListener("change", () => {
      form.elements.municipalityCode.value = "";
      form.elements.admin1Code.value = "";
      form.elements.localityName.value = "";
      void populateRegionFields(form, { subdivisionCode: form.elements.subdivisionCode.value });
    });
    form.elements.municipalityCode.addEventListener("change", () => {
      if (form.elements.municipalityCode.value) form.elements.localityName.value = "";
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
    fieldset.querySelector("input[name='isPublic']").addEventListener("change", () => syncPickerEnabled(form));
    picker.addEventListener("pointerdown", (event) => {
      if (!form.elements.isPublic.checked) return;
      const rect = picker.getBoundingClientRect();
      const view = mapViewFor(picker);
      setPickerLocation(
        form,
        view.north - ((event.clientY - rect.top) / rect.height) * (view.north - view.south),
        view.west + ((event.clientX - rect.left) / rect.width) * (view.east - view.west),
      );
    });
    picker.addEventListener("keydown", (event) => {
      if (!form.elements.isPublic.checked || !["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) return;
      event.preventDefault();
      const view = mapViewFor(picker);
      const latitude = numberOrNull(form.elements.publicLatitude.value) ?? ((view.north + view.south) / 2);
      const longitude = numberOrNull(form.elements.publicLongitude.value) ?? ((view.east + view.west) / 2);
      setPickerLocation(
        form,
        Math.max(view.south, Math.min(view.north, latitude + (event.key === "ArrowUp" ? 1 : event.key === "ArrowDown" ? -1 : 0))),
        Math.max(view.west, Math.min(view.east, longitude + (event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0))),
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
  const outsideView = latitude !== null && longitude !== null
    && (latitude < view.south || latitude > view.north || longitude < view.west || longitude > view.east);
  if (ensureLocation && form.elements.isPublic.checked && (latitude === null || longitude === null || outsideView)) {
    setPickerLocation(form, (view.north + view.south) / 2, (view.east + view.west) / 2);
  } else {
    setPickerLocation(form, latitude, longitude);
  }
  mapRenderers.get(picker)?.();
}

function mapViewFor(surface) {
  return mapViewports.get(surface) || worldMapView;
}

function syncPickerEnabled(form) {
  const enabled = form.elements.isPublic.checked;
  const picker = form.querySelector("[data-location-picker]");
  picker.toggleAttribute("aria-disabled", !enabled);
  if (enabled && numberOrNull(form.elements.publicLatitude.value) === null) setPickerLocation(form, 35.7, 139.7);
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
    const response = await fetch(naturalEarthUrl);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const geometry = extractLandRings(await response.json());
    if (geometry.length < 1_000) throw new Error("land geometry is incomplete");
    surfaces.forEach((surface) => mountMapCanvas(surface, geometry));
  } catch {
    surfaces.forEach((surface) => {
      surface.dataset.basemap = "unavailable";
      const basis = surface.querySelector("[data-map-basis]");
      if (basis) basis.textContent = "BASEMAP / UNAVAILABLE";
    });
  }
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

function mountMapCanvas(surface, rings) {
  const canvas = document.createElement("canvas");
  canvas.className = "sensor-map-canvas";
  canvas.setAttribute("aria-hidden", "true");
  surface.prepend(canvas);
  const render = () => renderMapCanvas(canvas, rings, mapViewFor(surface));
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

function renderMapCanvas(canvas, rings, view = worldMapView) {
  const { width, height } = canvas.parentElement.getBoundingClientRect();
  if (width < 1 || height < 1) return;
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(width * pixelRatio);
  canvas.height = Math.round(height * pixelRatio);
  const context = canvas.getContext("2d");
  if (!context) return;
  context.scale(pixelRatio, pixelRatio);
  context.clearRect(0, 0, width, height);
  context.save();
  context.strokeStyle = "rgba(126, 230, 214, .16)";
  context.lineWidth = 1;
  context.setLineDash([2, 7]);
  const longitudeStep = view.key === "WORLD" ? 30 : 5;
  const latitudeStep = view.key === "WORLD" ? 30 : 5;
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
  for (const ring of rings) {
    let started = false;
    let previousLongitude = null;
    for (const coordinate of ring) {
      const longitude = Number(coordinate?.[0]);
      const latitude = Number(coordinate?.[1]);
      if (!Number.isFinite(longitude) || !Number.isFinite(latitude)) continue;
      const x = ((longitude - view.west) / (view.east - view.west)) * width;
      const y = ((view.north - latitude) / (view.north - view.south)) * height;
      if (!started || (previousLongitude !== null && Math.abs(longitude - previousLongitude) > 180)) {
        land.moveTo(x, y);
        started = true;
      } else land.lineTo(x, y);
      previousLongitude = longitude;
    }
    if (started) land.closePath();
  }
  context.fillStyle = "rgba(30, 103, 99, .34)";
  context.fill(land, "evenodd");
  context.strokeStyle = "rgba(137, 244, 216, .72)";
  context.lineWidth = Math.max(.65, width / 1_900);
  context.shadowColor = "rgba(86, 255, 223, .2)";
  context.shadowBlur = 5;
  context.stroke(land);
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
