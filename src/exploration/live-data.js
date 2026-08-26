import { createGaiaStore } from "./state.js";
import { collectMeasurements, STATUS_LABELS, toSoundParameters } from "./transforms.js";
import proceduralAudio from "./procedural-audio.js";

const FALLBACK_URL = "./data/live-observation-fallback-v1.json";
const RETRY_DELAYS = [1_000, 2_000, 5_000, 10_000, 30_000];
const store = createGaiaStore({ events: [], measurements: {}, connected: false, source: "snapshot", lastEventId: "" });
let eventSource = null;
let retryIndex = 0;
let retryTimer = 0;

const permitsLiveEndpoint = () => location.protocol === "https:" || new URLSearchParams(location.search).get("live") === "1";
const formatValue = (measurement) => measurement?.quality === "missing" || !Number.isFinite(Number(measurement?.value))
  ? "欠測"
  : `${Number(measurement.value).toLocaleString("ja-JP", { maximumFractionDigits: 4 })} ${measurement.unit}`;

const render = (state) => {
  document.querySelectorAll("[data-gaia-live-receipt]").forEach((root) => {
    const status = root.querySelector("[data-live-connection]");
    if (status) status.textContent = state.connected ? "LIVE STREAM CONNECTED" : `${state.source.toUpperCase()} / RECONNECT SAFE`;
    root.querySelectorAll("[data-live-provider]").forEach((row) => {
      const provider = row.getAttribute("data-live-provider");
      const events = state.events.filter((candidate) => candidate.provider === provider);
      const event = events[0];
      const badge = row.querySelector("[data-live-status]");
      const value = row.querySelector("[data-live-value]");
      const time = row.querySelector("[data-live-time]");
      if (badge) badge.textContent = [...new Set(events.map((candidate) => STATUS_LABELS[candidate.status] || "SNAPSHOT"))].join(" / ") || "SNAPSHOT";
      if (value) value.textContent = events.flatMap((candidate) => candidate.measurements?.map((measurement) => `${STATUS_LABELS[candidate.status] || "SNAPSHOT"} ${formatValue(measurement)}`) || []).join(" / ") || "取得待ち";
      if (time) time.textContent = events.map((candidate) => candidate.observedAt ? new Date(candidate.observedAt).toLocaleString("ja-JP") : "観測時刻なし").join(" / ") || "観測時刻なし";
      row.toggleAttribute("data-stale", events.some((candidate) => candidate.status === "stale" || candidate.status === "snapshot"));
    });
    const sound = root.querySelector("[data-live-sound-readout]");
    if (sound) {
      const values = toSoundParameters(state.measurements);
      sound.textContent = `風→noise ${values.noiseCutoff?.toFixed(0) ?? "—"}Hz / 気温→tone ${values.baseFrequency?.toFixed(1) ?? "—"}Hz / CO₂→LFO ${values.lfoFrequency?.toFixed(3) ?? "—"}Hz / 雨→pulse ${values.pulseDensity?.toFixed(1) ?? "—"} / NO₂→Q ${values.resonance?.toFixed(1) ?? "—"}`;
    }
  });
};

const ensureSpaceReceipt = () => {
  const spaceContent = document.querySelector("#space-data-content");
  if (!(spaceContent instanceof HTMLElement) || spaceContent.querySelector("[data-gaia-live-receipt]")) return;
  const mapReceipt = document.querySelector("[data-gaia-live-receipt]");
  if (!(mapReceipt instanceof HTMLDetailsElement)) return;
  const clone = mapReceipt.cloneNode(true);
  clone.classList.add("gaia-live-receipt--space");
  spaceContent.prepend(clone);
};

const publish = (events, source, connected = store.getState().connected) => {
  const measurements = collectMeasurements(events);
  const next = store.setState({ events, measurements, source, connected });
  render(next);
  globalThis.dispatchEvent(new CustomEvent("gaia:live-update", { detail: next }));
};

const readJson = async (url) => {
  const response = await fetch(url, { headers: { Accept: "application/json" }, cache: "no-store" });
  if (!response.ok) throw new Error(`Live snapshot ${response.status}`);
  return response.json();
};

const loadSnapshot = async () => {
  try {
    const payload = await readJson(permitsLiveEndpoint() ? "/api/live/v1/snapshot" : FALLBACK_URL);
    publish(payload.events || [], payload.source || (permitsLiveEndpoint() ? "live" : "snapshot"), false);
    return payload;
  } catch (error) {
    console.warn("Live snapshot unavailable; using the versioned snapshot.", error);
    const payload = await readJson(FALLBACK_URL);
    publish(payload.events || [], "snapshot", false);
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
  const events = store.getState().events.filter((event) => event.provider !== providerEvent.provider);
  events.push(providerEvent);
  publish(events, "live", true);
};

const connectStream = async () => {
  if (eventSource || document.hidden || !permitsLiveEndpoint()) return;
  const lastEventId = store.getState().lastEventId;
  const endpoint = new URL("/api/live/v1/stream", location.origin);
  if (lastEventId) endpoint.searchParams.set("lastEventId", lastEventId);
  eventSource = new EventSource(endpoint);
  eventSource.addEventListener("open", () => {
    retryIndex = 0;
    store.setState({ connected: true });
    render(store.getState());
  });
  eventSource.addEventListener("snapshot", (message) => {
    const payload = JSON.parse(message.data);
    store.setState({ lastEventId: message.lastEventId || store.getState().lastEventId });
    publish(payload.events || [], "live", true);
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

const bindControls = () => {
  ensureSpaceReceipt();
  document.querySelectorAll("[data-live-sound-toggle]").forEach((button) => {
    if (button.dataset.bound === "true") return;
    button.dataset.bound = "true";
    button.addEventListener("click", async () => {
      try {
        if (proceduralAudio.getState().enabled) proceduralAudio.disable();
        else await proceduralAudio.enable();
        const enabled = proceduralAudio.getState().enabled;
        document.querySelectorAll("[data-live-sound-toggle]").forEach((control) => {
          control.setAttribute("aria-pressed", String(enabled));
          control.textContent = enabled ? "観測音をオフ" : "観測音をオン";
        });
      } catch (error) {
        console.error(error);
      }
    });
  });
};

const mount = async () => {
  bindControls();
  render(store.getState());
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
globalThis.addEventListener("gaia:mode-group-loaded", () => {
  ensureSpaceReceipt();
  bindControls();
  render(store.getState());
});

globalThis.GaiaLiveData = Object.freeze({
  mount,
  refresh: loadSnapshot,
  reconnect: connectStream,
  close: closeStream,
  getState: store.getState,
});

export { mount };
