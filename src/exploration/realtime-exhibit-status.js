// The exhibit category is realtime; the displayed payload may still be a
// delayed public feed, a saved observation, or a generated fallback. Never
// infer a live connection from an animated map or from its exhibit number.
export function realtimeStatus({ sourceState = "FETCHING", observedAt, now = Date.now() } = {}) {
  const timestamp = Date.parse(observedAt);
  const validTime = Number.isFinite(timestamp);
  const delayed = validTime && now - timestamp > 24 * 60 * 60 * 1000;
  let state = "loading", label = "公開データを取得中";
  if (sourceState === "SAVED VALUES") { state = "sample"; label = "参考値を表示 · ライブ取得不可"; }
  else if (sourceState === "SAVED SNAPSHOT") { state = "saved"; label = "保存観測を表示 · ライブ未接続"; }
  else if (sourceState === "ERROR") { state = "error"; label = "データを取得できません"; }
  else if (["LIVE", "LIVE CACHE"].includes(sourceState)) {
    state = delayed || !validTime ? "delayed" : "live";
    label = !validTime ? "公開データ · 時刻不明" : delayed ? "公開データ · 時刻に遅れ" : "LIVE · 公開データ";
  }
  const time = validTime && !["loading", "sample", "error"].includes(state)
    ? new Intl.DateTimeFormat("ja-JP", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Asia/Tokyo" }).format(timestamp) + " JST" : "—";
  return { state, label, time, iso: time === "—" ? "" : new Date(timestamp).toISOString() };
}

const records = new Map();
let freshnessClock = null;
const refreshVisible = () => {
  if (document.hidden) return;
  for (const [element, payload] of records) {
    if (!element.isConnected) continue;
    if (!element.closest("[hidden]") && element.getClientRects().length) paintStatus(element, payload);
  }
};

export function createRealtimeStatus() {
  const element = document.createElement("div");
  element.className = "gaia-realtime-status";
  element.setAttribute("aria-label", "リアルタイム展示のデータ接続状況");
  element.innerHTML = `
    <p class="gaia-realtime-kicker"><i aria-hidden="true"></i><span>EARTH NOW / 01—05</span></p>
    <h3>リアルタイム展示</h3>
    <p class="gaia-realtime-state"><b data-realtime-state></b><span data-realtime-kind></span></p>
    <p class="gaia-realtime-time"><span data-realtime-time-label>データ時刻</span><time data-realtime-time></time></p>
    <p class="gaia-realtime-source"><span data-realtime-source></span></p>`;
  updateRealtimeStatus(element);
  if (freshnessClock === null) {
    // This only ages the displayed timestamp; it does not pretend to poll a
    // provider. A long-running installation must not retain a stale LIVE badge.
    freshnessClock = setInterval(refreshVisible, 60_000);
    document.addEventListener("visibilitychange", refreshVisible);
  }
  return element;
}

const setText = (element, value) => { if (element.textContent !== value) element.textContent = value; };
function paintStatus(element, { source = "", kind = "", timeLabel = "データ時刻", ...payload } = {}) {
  if (!element) return;
  const status = realtimeStatus(payload);
  if (element.dataset.realtimeState !== status.state) element.dataset.realtimeState = status.state;
  setText(element.querySelector("[data-realtime-state]"), status.label);
  setText(element.querySelector("[data-realtime-kind]"), kind);
  setText(element.querySelector("[data-realtime-time-label]"), status.state === "sample" ? "現在値ではありません" : timeLabel);
  const time = element.querySelector("[data-realtime-time]");
  setText(time, status.time);
  if (status.iso && time.dateTime !== status.iso) time.dateTime = status.iso;
  else if (!status.iso && time.hasAttribute("datetime")) time.removeAttribute("datetime");
  setText(element.querySelector("[data-realtime-source]"), source);
}

export function updateRealtimeStatus(element, payload = {}) {
  if (!element) return;
  records.set(element, payload);
  paintStatus(element, payload);
}
