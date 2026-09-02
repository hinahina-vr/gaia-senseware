import { createGaiaStore } from "./state.js";
import { collectMeasurements } from "./transforms.js";

const FALLBACK_URL = "./data/live-observation-fallback-v1.json";
const RETRY_DELAYS = [1_000, 2_000, 5_000, 10_000, 30_000];
const store = createGaiaStore({ events: [], measurements: {}, connected: false, source: "snapshot", lastEventId: "" });
let eventSource = null;
let retryIndex = 0;
let retryTimer = 0;
let activeCity = "sapporo";
let loadGeneration = 0;

const permitsLiveEndpoint = () => location.protocol === "https:" || new URLSearchParams(location.search).get("live") === "1";
const publish = (events, source, connected = store.getState().connected) => {
  const measurements = collectMeasurements(events);
  const next = store.setState({ events, measurements, source, connected });
  globalThis.dispatchEvent(new CustomEvent("gaia:live-update", { detail: next }));
};

const readJson = async (url) => {
  const response = await fetch(url, { headers: { Accept: "application/json" }, cache: "no-store" });
  if (!response.ok) throw new Error(`Live snapshot ${response.status}`);
  return response.json();
};

const liveEndpoint = (pathname) => {
  const endpoint = new URL(pathname, location.origin);
  endpoint.searchParams.set("city", activeCity);
  return endpoint;
};

const fallbackEventsForActiveCity = (payload) => (
  // The bundled emergency snapshot is explicitly a Tokyo snapshot. Reusing
  // those measurements after another city is selected would falsely relabel
  // Tokyo data as local data, so other cities stay in the honest missing-data
  // state until their live model response arrives.
  activeCity === "tokyo" ? (payload.events || []) : []
);

const loadSnapshot = async () => {
  const generation = ++loadGeneration;
  try {
    const payload = await readJson(permitsLiveEndpoint() ? liveEndpoint("/api/live/v1/snapshot") : FALLBACK_URL);
    if (generation !== loadGeneration) return payload;
    const events = payload.source === "snapshot" || !permitsLiveEndpoint()
      ? fallbackEventsForActiveCity(payload)
      : (payload.events || []);
    publish(events, payload.source || (permitsLiveEndpoint() ? "live" : "snapshot"), false);
    return payload;
  } catch (error) {
    console.warn("Live snapshot unavailable; using the versioned snapshot.", error);
    const payload = await readJson(FALLBACK_URL);
    if (generation !== loadGeneration) return payload;
    publish(fallbackEventsForActiveCity(payload), "snapshot", false);
    return payload;
  }
};

const closeStream = () => {
  eventSource?.close();
  eventSource = null;
  clearTimeout(retryTimer);
  retryTimer = 0;
  if (store.getState().connected) store.setState({ connected: false });
};

const scheduleReconnect = () => {
  closeStream();
  if (document.hidden || !permitsLiveEndpoint()) return;
  const delay = RETRY_DELAYS[Math.min(retryIndex, RETRY_DELAYS.length - 1)];
  retryIndex += 1;
  retryTimer = window.setTimeout(() => void connectStream(), delay);
};

const mergeProvider = (providerEvent) => {
  // NOAA publishes independent NDBC and GML events. Replace only the same
  // dataset so a wind update cannot erase the CO₂ value (or vice versa).
  const events = store.getState().events.filter((event) => !(
    event.provider === providerEvent.provider
    && event.datasetId === providerEvent.datasetId
  ));
  events.push(providerEvent);
  const current = store.getState();
  publish(events, current.source === "snapshot" ? "snapshot" : "live", current.connected);
};

const connectStream = async () => {
  if (eventSource || document.hidden || !permitsLiveEndpoint()) return;
  const lastEventId = store.getState().lastEventId;
  const endpoint = liveEndpoint("/api/live/v1/stream");
  if (lastEventId) endpoint.searchParams.set("lastEventId", lastEventId);
  eventSource = new EventSource(endpoint);
  eventSource.addEventListener("open", () => {
    retryIndex = 0;
    store.setState({ connected: true });
  });
  eventSource.addEventListener("snapshot", (message) => {
    const payload = JSON.parse(message.data);
    store.setState({ lastEventId: message.lastEventId || store.getState().lastEventId });
    const source = payload.source || "live";
    publish(payload.events || [], source, source !== "snapshot");
    if (source === "snapshot") scheduleReconnect();
  });
  eventSource.addEventListener("provider", (message) => {
    store.setState({ lastEventId: message.lastEventId || store.getState().lastEventId });
    mergeProvider(JSON.parse(message.data));
  });
  eventSource.addEventListener("status", (message) => {
    const payload = JSON.parse(message.data);
    if (payload.state === "complete") scheduleReconnect();
  });
  eventSource.onerror = scheduleReconnect;
};

const selectCity = async (city) => {
  const requested = String(city || "").trim().toLowerCase();
  if (!/^[a-z0-9-]{2,32}$/u.test(requested)) return false;
  if (requested === activeCity) return true;
  closeStream();
  activeCity = requested;
  store.setState({ lastEventId: "", connected: false });
  publish([], "loading", false);
  globalThis.dispatchEvent(new CustomEvent("gaia:live-city-change", { detail: { city: activeCity, state: "loading" } }));
  const snapshot = await loadSnapshot();
  if (snapshot.source !== "snapshot") await connectStream();
  globalThis.dispatchEvent(new CustomEvent("gaia:live-city-change", { detail: { city: activeCity, state: "ready" } }));
  return true;
};

const mount = async () => {
  const snapshot = await loadSnapshot();
  if (snapshot.source !== "snapshot") await connectStream();
};

document.addEventListener("visibilitychange", async () => {
  if (document.hidden) closeStream();
  else {
    const snapshot = await loadSnapshot();
    if (snapshot.source !== "snapshot") await connectStream();
  }
});
globalThis.GaiaLiveData = Object.freeze({
  mount,
  refresh: loadSnapshot,
  reconnect: connectStream,
  close: closeStream,
  selectCity,
  getCity: () => activeCity,
  getState: store.getState,
});

export { mount };
