const views = new Map(Array.from(document.querySelectorAll("[data-view]"), (element) => [element.dataset.view, element]));
const statusRegion = document.querySelector("#sensor-status");
const loginButton = document.querySelector("#google-login");
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
const pollIntervalMs = 2_000;
const regionNames = typeof Intl.DisplayNames === "function" ? new Intl.DisplayNames(["ja"], { type: "region" }) : null;
let countries = [];
let devices = [];
let selectedDevice = null;
let pollTimer = 0;
let statusTimer = 0;

const api = async (path, options = {}) => {
  const headers = new Headers(options.headers);
  if (options.body !== undefined) headers.set("Content-Type", "application/json");
  if (options.method && options.method !== "GET" && options.method !== "HEAD") {
    const csrf = readCookie("__Host-gaia_sensor_csrf");
    if (csrf) headers.set("X-CSRF-Token", csrf);
  }
  const response = await fetch(path, {
    credentials: "include",
    ...options,
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
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
  try {
    await api("../api/web/v1/session");
    await Promise.all([loadCountries(), loadDevices()]);
    routeFromHash();
  } catch (error) {
    if (error.status === 401) showView("login");
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
  locationForm.elements.name.value = device.name;
  locationForm.elements.countryCode.value = device.countryCode;
  locationForm.elements.admin1Code.value = device.admin1Code || "";
  locationForm.elements.localityName.value = device.localityName || "";
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
  if (location.hash === "#guide") showView("guide");
  else if (location.hash.startsWith("#device=")) openDetail(decodeURIComponent(location.hash.slice(8)));
  else showView("devices");
};

loginButton.addEventListener("click", () => { location.assign("../api/auth/google/start?returnTo=%2Fsensors%2F"); });
showAddButton.addEventListener("click", () => showView("add"));
document.querySelectorAll("[data-action='show-add']").forEach((button) => button.addEventListener("click", () => showView("add")));
document.querySelectorAll("[data-action='devices']").forEach((button) => button.addEventListener("click", showDevices));
document.querySelectorAll("[data-nav]").forEach((link) => link.addEventListener("click", (event) => {
  event.preventDefault();
  const destination = link.dataset.nav;
  if (destination === "devices") showDevices();
  else { showView(destination); history.replaceState(null, "", `#${destination}`); }
}));

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

function formDevice(form) {
  const data = new FormData(form);
  return {
    name: String(data.get("name") || "").trim(),
    countryCode: String(data.get("countryCode") || "").trim(),
    admin1Code: String(data.get("admin1Code") || "").trim() || null,
    localityName: String(data.get("localityName") || "").trim() || null,
  };
}

function readCookie(name) {
  const prefix = `${name}=`;
  const pair = document.cookie.split(";").map((value) => value.trim()).find((value) => value.startsWith(prefix));
  return pair ? decodeURIComponent(pair.slice(prefix.length)) : "";
}

function locationLabel(device) {
  const country = device.countryName === device.countryCode ? regionNames?.of(device.countryCode) : device.countryName;
  return [country || device.countryCode, device.admin1Code, device.localityName].filter(Boolean).join(" / ");
}
function formatValue(value) { return Number.isFinite(Number(value)) ? Number(value).toLocaleString("ja-JP", { maximumFractionDigits: 2 }) : "—"; }
function formatRelative(iso) { const seconds = Math.max(0, Math.floor((Date.now() - Date.parse(iso)) / 1000)); return seconds < 60 ? `${seconds}秒前` : seconds < 3600 ? `${Math.floor(seconds / 60)}分前` : new Date(iso).toLocaleString("ja-JP"); }
function labelFor(key) { return ({ temperature: "温度", humidity: "湿度", pm25: "PM2.5", pm10: "PM10", voc: "VOC", nox: "NOx" })[key] || key; }
function unitFor(key) { return ({ temperature: "℃", humidity: "%", pm25: "µg/m³", pm10: "µg/m³", voc: "ppb", nox: "ppb" })[key] || ""; }
