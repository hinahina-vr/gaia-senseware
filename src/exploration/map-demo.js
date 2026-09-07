import { createMapDemoController } from "./map-demo-controller.js?v=gaia-map-demo-1";

function mountMapDemo() {
  const layer = document.querySelector("#japan-layer");
  if (!layer || globalThis.GaiaMapDemo) return;
  const button = document.createElement("button");
  button.id = "gaia-map-demo-toggle";
  button.type = "button";
  button.setAttribute("aria-pressed", "false");
  button.setAttribute("aria-describedby", "gaia-map-demo-help");
  button.innerHTML = `<span data-demo-fill aria-hidden="true"></span><span data-demo-icon aria-hidden="true"><svg viewBox="0 0 24 24" focusable="false"><path data-demo-play d="m9 6 9 6-9 6Z"/><path data-demo-stop d="M7 7h10v10H7Z"/></svg></span><span data-demo-label>デモ</span>`;
  const help = document.createElement("span");
  help.id = "gaia-map-demo-help";
  help.className = "map-demo-visually-hidden";
  help.textContent = "地図を開くとデモはオン。全30展示を25秒ごとに自動で切り替えます。操作ガイド中は切り替えを一時停止し、地図へのタッチ・クリックやキー操作でデモを停止します。";
  const status = document.createElement("span");
  status.className = "map-demo-visually-hidden";
  status.setAttribute("role", "status");
  const back = layer.querySelector("#japan-close");
  if (back) back.after(button);
  else layer.append(button);
  layer.append(help, status);
  const label = button.querySelector("[data-demo-label]");
  const fill = button.querySelector("[data-demo-fill]");
  let progressAnimation = null;
  let previousProgress = { active: false, paused: false, remainingMs: 0 };
  const syncProgress = state => {
    const remaining = Math.max(0, Math.min(1, state.remainingMs / state.intervalMs));
    button.style.setProperty("--demo-remaining", String(remaining));
    const restart = state.active && (!previousProgress.active || previousProgress.paused !== state.paused
      || state.remainingMs > previousProgress.remainingMs + 1);
    if (!state.active || state.paused || restart) {
      progressAnimation?.cancel();
      progressAnimation = null;
      const clipPath = `inset(0 ${(1 - remaining) * 100}% 0 0)`;
      fill.style.clipPath = clipPath;
      if (state.active && !state.paused) {
        // Reveal the unchanged gradient through a shrinking window. The right
        // edge travels left; the text and colors themselves never get squashed.
        progressAnimation = fill.animate([{ clipPath }, { clipPath: "inset(0 100% 0 0)" }], {
          duration: state.remainingMs, easing: "linear", fill: "forwards",
        });
      }
    }
    previousProgress = { active: state.active, paused: state.paused, remainingMs: state.remainingMs };
  };
  const buttons = () => globalThis.GaiaMapCategories?.buttons(layer).filter(item => !item.disabled) || [];
  const number = item => Number(item.textContent.trim());
  const isAvailable = () => !layer.hidden && layer.getAttribute("aria-hidden") === "false"
    && !layer.classList.contains("japan-data-open")
    && !layer.dataset.storyMode
    && !document.body.matches(".gaia-tour-open, .gaia-statistics-open, .novel-open");
  let wasActive = false;
  const controller = createMapDemoController({
    getItems: () => buttons().map(number),
    getCurrent: () => Number(layer.querySelector("#japan-mode-number")?.textContent.trim()),
    select: next => {
      const target = buttons().find(item => number(item) === next);
      if (!target) return false;
      // Use exactly the manual navigation path for every renderer (01–30).
      target.click();
      return true;
    },
    isAvailable,
    onChange: state => {
      layer.classList.toggle("is-demo-running", state.active);
      button.setAttribute("aria-pressed", String(state.active));
      button.setAttribute("aria-label", state.active ? "デモを停止" : "デモを開始");
      button.title = state.active ? state.paused ? "デモはオン — ガイド中・非表示中は切り替えを一時停止" : "デモ再生中 — 操作すると停止" : "展示をゆっくり巡る";
      label.textContent = state.active ? "デモ中" : "デモ";
      syncProgress(state);
      if (state.active !== wasActive) {
        status.textContent = state.active ? "デモを開始しました。25秒ごとに次の展示へ進みます。操作すると停止します。"
          : state.reason === "error" ? "展示を切り替えられなかったためデモを停止しました。" : "デモを停止しました。";
        wasActive = state.active;
      }
    },
  });
  const guideIsOpen = () => {
    const guide = globalThis.GaiaModeEntryGuide?.getState?.();
    return guide?.active && guide.id === "map";
  };
  const syncPause = () => controller.setPaused(document.hidden || guideIsOpen());
  const start = ({ automatic = false } = {}) => {
    if (document.hidden || !isAvailable()) return false;
    if (!automatic) globalThis.GaiaModeEntryGuide?.close?.("map", { restoreFocus: false });
    for (const selector of [".map-dock-bank-trigger", "#map-mobile-bank-toggle"]) {
      const toggle = layer.querySelector(selector);
      if (toggle?.getAttribute("aria-expanded") === "true") toggle.click();
    }
    const started = controller.start();
    if (started && !automatic) dispatchEvent(new CustomEvent("gaia:map-playback-resume"));
    syncPause();
    return started;
  };
  button.setAttribute("aria-label", "デモを開始");
  button.title = "展示をゆっくり巡る";
  button.addEventListener("click", () => {
    if (controller.getState().active) controller.stop();
    else start();
  });
  // Real input yields immediately to the visitor. Programmatic exhibit clicks
  // must not cancel the loop, and the stop control must not restart itself.
  const onInput = event => {
    if (!event.isTrusted || !controller.getState().active) return;
    // Reading, stepping through, or replaying the guide keeps the default on.
    // Its lifecycle pauses the countdown instead of cancelling the demo.
    if (guideIsOpen() || event.composedPath().some(node => node instanceof Element
      && node.matches('[data-gaia-mode-guide-replay="map"]'))) return;
    const onToggle = event.composedPath().includes(button);
    if (onToggle && (["pointerdown", "click"].includes(event.type)
      || (event.type === "keydown" && ["Enter", " "].includes(event.key)))) return;
    controller.stop("interaction");
    if (event.type === "keydown" && event.key === "Escape") {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  };
  for (const type of ["pointerdown", "click", "wheel"]) addEventListener(type, onInput, { capture: true, passive: true });
  addEventListener("keydown", onInput, true);
  let defaultPending = !layer.hidden && !layer.dataset.storyMode;
  document.addEventListener("visibilitychange", () => { syncAvailability(); syncPause(); });
  for (const name of ["gaia:mode-guide-open", "gaia:mode-guide-close"]) {
    addEventListener(name, event => { if (event.detail?.id === "map") syncPause(); });
  }
  addEventListener("pagehide", () => controller.stop("leave"));
  addEventListener("gaia:japan-close", () => { defaultPending = false; controller.stop("leave"); });
  const syncAvailability = () => {
    const available = isAvailable();
    button.disabled = !available || buttons().length < 2;
    if (!available) controller.stop("unavailable");
    if (defaultPending && !button.disabled && !document.hidden) {
      // One automatic start per map visit. A manual stop stays stopped until
      // the visitor explicitly starts again or leaves and re-enters the map.
      defaultPending = false;
      start({ automatic: true });
    }
  };
  const observer = new MutationObserver(syncAvailability);
  observer.observe(layer, { attributes: true, attributeFilter: ["hidden", "aria-hidden", "class", "data-story-mode"] });
  observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
  addEventListener("gaia:japan-open", () => {
    defaultPending = !layer.dataset.storyMode && !document.body.matches(".gaia-tour-open, .novel-open");
    syncAvailability();
  });
  addEventListener("gaia:app-ready", syncAvailability);
  globalThis.GaiaMapDemo = Object.freeze({ start, stop: controller.stop, getState: controller.getState });
  syncAvailability();
}

mountMapDemo();
