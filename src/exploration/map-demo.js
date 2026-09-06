import { createMapDemoController } from "./map-demo-controller.js?v=gaia-map-demo-1";

function mountMapDemo() {
  const layer = document.querySelector("#japan-layer");
  if (!layer || globalThis.GaiaMapDemo) return;
  const button = document.createElement("button");
  button.id = "gaia-map-demo-toggle";
  button.type = "button";
  button.setAttribute("aria-pressed", "false");
  button.setAttribute("aria-describedby", "gaia-map-demo-help");
  button.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path data-demo-play d="m8 5 11 7-11 7Z"/><path data-demo-stop d="M7 7h10v10H7Z"/></svg><span data-demo-label>デモ</span><span data-demo-seconds aria-hidden="true">25</span><i aria-hidden="true"></i>`;
  const help = document.createElement("span");
  help.id = "gaia-map-demo-help";
  help.className = "map-demo-visually-hidden";
  help.textContent = "全30展示を25秒ごとに自動で切り替えます。地図へのタッチ・クリックやキー操作で停止します。";
  const status = document.createElement("span");
  status.className = "map-demo-visually-hidden";
  status.setAttribute("role", "status");
  const back = layer.querySelector("#japan-close");
  if (back) back.after(button);
  else layer.append(button);
  layer.append(help, status);
  const label = button.querySelector("[data-demo-label]");
  const seconds = button.querySelector("[data-demo-seconds]");
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
      button.title = state.active ? "デモ再生中 — 操作すると停止" : "全30展示を25秒ごとに自動で切り替える";
      label.textContent = state.active ? "デモ中" : "デモ";
      seconds.textContent = String(Math.ceil(state.remainingMs / 1000));
      button.style.setProperty("--demo-remaining", String(state.remainingMs / state.intervalMs));
      if (state.active !== wasActive) {
        status.textContent = state.active ? "デモを開始しました。25秒ごとに次の展示へ進みます。操作すると停止します。"
          : state.reason === "error" ? "展示を切り替えられなかったためデモを停止しました。" : "デモを停止しました。";
        wasActive = state.active;
      }
    },
  });
  const start = () => {
    if (document.hidden || !isAvailable()) return false;
    globalThis.GaiaModeEntryGuide?.close?.("map", { restoreFocus: false });
    for (const selector of [".map-dock-bank-trigger", "#map-mobile-bank-toggle"]) {
      const toggle = layer.querySelector(selector);
      if (toggle?.getAttribute("aria-expanded") === "true") toggle.click();
    }
    return controller.start();
  };
  button.setAttribute("aria-label", "デモを開始");
  button.title = "全30展示を25秒ごとに自動で切り替える";
  button.addEventListener("click", () => {
    if (controller.getState().active) controller.stop();
    else start();
  });
  // Real input yields immediately to the visitor. Programmatic exhibit clicks
  // must not cancel the loop, and the stop control must not restart itself.
  const onInput = event => {
    if (!event.isTrusted || !controller.getState().active) return;
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
  document.addEventListener("visibilitychange", () => controller.setPaused(document.hidden));
  addEventListener("pagehide", () => controller.stop("leave"));
  addEventListener("gaia:japan-close", () => controller.stop("leave"));
  const syncAvailability = () => {
    const available = isAvailable();
    button.disabled = !available || buttons().length < 2;
    if (!available) controller.stop("unavailable");
  };
  const observer = new MutationObserver(syncAvailability);
  observer.observe(layer, { attributes: true, attributeFilter: ["hidden", "aria-hidden", "class", "data-story-mode"] });
  observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
  addEventListener("gaia:app-ready", syncAvailability);
  syncAvailability();
  globalThis.GaiaMapDemo = Object.freeze({ start, stop: controller.stop, getState: controller.getState });
}

mountMapDemo();
