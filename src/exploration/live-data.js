import { createGaiaStore } from "./state.js";
import { collectMeasurements } from "./transforms.js";
import proceduralAudio from "./procedural-audio.js?v=gaia-live-compact-jpt-audio-1";

const FALLBACK_URL = "./data/live-observation-fallback-v1.json";
const RETRY_DELAYS = [1_000, 2_000, 5_000, 10_000, 30_000];
const store = createGaiaStore({ events: [], measurements: {}, connected: false, source: "snapshot", lastEventId: "" });
let eventSource = null;
let retryIndex = 0;
let retryTimer = 0;

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
  const endpoint = new URL("/api/live/v1/stream", location.origin);
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

const syncSoundControls = () => {
  const audioState = proceduralAudio.getState();
  document.querySelectorAll("[data-live-sound-toggle]").forEach((control) => {
    control.setAttribute("aria-pressed", String(audioState.enabled));
    control.dataset.audioState = audioState.active ? "playing" : audioState.enabled ? "armed" : "off";
    const label = audioState.enabled ? "展示音を停止" : "展示音を再生";
    control.setAttribute("aria-label", label);
    const visibleLabel = control.querySelector("[data-live-sound-label]");
    if (visibleLabel) visibleLabel.textContent = label;
    else control.textContent = label;
    const visibleStatus = control.querySelector("[data-live-sound-status]");
    if (visibleStatus) {
      visibleStatus.textContent = audioState.active
        ? `再生中 · ${audioState.tempo || "—"} BPM`
        : audioState.enabled
          ? "音声を準備中"
          : "クリックで観測値を音に変換";
    }
  });
};

const bindControls = () => {
  document.querySelectorAll("[data-live-sound-toggle]").forEach((button) => {
    if (button.dataset.bound === "true") return;
    button.dataset.bound = "true";
    button.addEventListener("click", async () => {
      try {
        if (proceduralAudio.getState().enabled) proceduralAudio.disable();
        else {
          const openingAudio = globalThis.GaiaOpeningAudio;
          const proceduralAudioReady = proceduralAudio.enable();
          const globalAudioReady = openingAudio?.getState?.().muted
            ? openingAudio.setMuted(false)
            : Promise.resolve(true);
          await Promise.all([proceduralAudioReady, globalAudioReady]);
        }
        syncSoundControls();
      } catch (error) {
        console.error(error);
      }
    });
  });
  syncSoundControls();
};

const mount = async () => {
  bindControls();
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
  bindControls();
});
globalThis.addEventListener("gaia:live-exhibit-mounted", bindControls);
globalThis.addEventListener("gaia:procedural-audio-state", syncSoundControls);

globalThis.GaiaLiveData = Object.freeze({
  mount,
  refresh: loadSnapshot,
  reconnect: connectStream,
  close: closeStream,
  getState: store.getState,
});

export { mount };
