(() => {
  "use strict";
  const layer = document.querySelector("#japan-layer");
  if (!layer || globalThis.GaiaMobileMap) return;
  const media = matchMedia("(max-width: 900px)");
  const toolbar = document.createElement("nav");
  toolbar.id = "map-mobile-toolbar";
  toolbar.setAttribute("aria-label", "地図のメニュー");
  toolbar.innerHTML = `<button type="button" data-mobile-sheet="exhibits" aria-haspopup="dialog" aria-controls="map-mobile-sheet">展示一覧</button><button type="button" data-mobile-sheet="reading" aria-haspopup="dialog" aria-controls="map-mobile-sheet">読み方・凡例</button><button type="button" data-mobile-sheet="tools" aria-haspopup="dialog" aria-controls="map-mobile-sheet">操作</button>`;
  const sheet = document.createElement("dialog");
  sheet.id = "map-mobile-sheet";
  sheet.setAttribute("aria-labelledby", "map-mobile-sheet-title");
  sheet.innerHTML = `<header><h2 id="map-mobile-sheet-title"></h2><button type="button" data-mobile-sheet-close aria-label="パネルを閉じる">閉じる ×</button></header><div class="map-mobile-sheet-body"></div>`;
  const content = sheet.querySelector(".map-mobile-sheet-body");
  const heading = sheet.querySelector("h2");
  const ecologySummary = document.createElement("section");
  ecologySummary.className = "map-mobile-ecology-summary";
  ecologySummary.innerHTML = `<span>森林率と都市人口率を比べる</span><button type="button" aria-haspopup="dialog" aria-controls="map-mobile-sheet">比較・関係図を開く</button>`;
  layer.append(toolbar, ecologySummary, sheet);
  let opener = null;
  let metric = null;
  let ecologyHome = null;
  const enabled = () => media.matches && !layer.hidden && layer.getAttribute("aria-hidden") !== "true"
    && !document.body.classList.contains("novel-mode-detour") && !layer.dataset.storyMode;
  const activeReadout = () => [...layer.querySelectorAll(".gaia-live-exhibit-readout, .gaia-estat-readout, .gaia-firms-readout, .gaia-planet-signals-readout")]
    .find(node => !node.hidden && getComputedStyle(node).display !== "none");
  const close = (restoreFocus = true) => {
    if (!sheet.open) return;
    sheet.close();
    opener?.setAttribute("aria-expanded", "false");
    if (ecologyHome) {
      ecologyHome.placeholder.replaceWith(ecologyHome.panel);
      ecologyHome = null;
    }
    toolbar.querySelectorAll("button").forEach(button => button.setAttribute("aria-expanded", "false"));
    if (restoreFocus && enabled()) opener?.focus({ preventScroll: true });
  };
  const makeButton = (label, action) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = label;
    button.addEventListener("click", action);
    return button;
  };
  const addCopy = (text, tag = "p") => {
    if (!text?.trim()) return;
    const node = document.createElement(tag);
    node.textContent = text;
    content.append(node);
  };
  // Read-only copies never move the provider's live nodes: their renderers keep
  // querying those nodes, even while the modal is open. No copied IDs or controls.
  const copy = node => {
    if (!node) return;
    const clone = node.cloneNode(true);
    for (const mark of clone.querySelectorAll("[data-encoding-mark]")) {
      const original = node.querySelector(`[data-encoding-mark="${mark.dataset.encodingMark}"]`);
      const style = getComputedStyle(original);
      for (const property of ["background", "width", "height", "border", "box-shadow"]) mark.style.setProperty(property, style.getPropertyValue(property));
    }
    for (const item of [clone, ...clone.querySelectorAll("*")]) {
      for (const name of [...item.getAttributeNames()]) {
        if (name === "id" || (name === "hidden" && item === clone) || name === "tabindex" || name.startsWith("aria-") || name.startsWith("data-")) item.removeAttribute(name);
      }
      if (item !== clone && item.matches("button, input, select")) item.remove();
    }
    clone.classList.add("map-mobile-reading-copy");
    content.append(clone);
  };
  const renderReading = () => {
    addCopy(layer.querySelector("#japan-description")?.textContent);
    addCopy("数値はこのパネルを開いた時点の表示です。");
    const readout = activeReadout();
    if (readout) {
      const legend = [...layer.querySelectorAll(".gaia-firms-legend, .gaia-planet-signals-legend, .gaia-live-metric-legend, .gaia-estat-heat-legend")].find(node => !node.hidden);
      copy(legend);
      for (const selector of [".gaia-live-deck-question", ".gaia-live-exhibit-details", ".gaia-estat-copy", ".gaia-estat-comparison", ".gaia-firms-count", ".gaia-firms-copy", ".gaia-firms-quality", ".gaia-planet-copy", ".gaia-planet-metrics"]) copy(readout.querySelector(selector));
    } else {
      if (metric) {
        addCopy(metric.title, "h3");
        addCopy(metric.current);
        const scale = document.createElement("div");
        scale.className = "map-mobile-metric-scale";
        scale.style.background = `linear-gradient(90deg, ${metric.colors.join(",")})`;
        const marker = document.createElement("i");
        marker.style.left = `${metric.progress * 100}%`;
        scale.append(marker);
        content.append(scale);
        addCopy(`${metric.minimumLabel} — ${metric.maximumLabel}${metric.scale === "log" ? "（対数目盛）" : ""}`);
      }
      copy(layer.querySelector(".map-reading-guide-body"));
      const legend = layer.querySelector("[data-signal-encoding-legend]");
      if (legend && !legend.hidden) { addCopy("凡例", "h3"); copy(legend); }
      const timeline = layer.querySelector("#co2-timeline-display");
      if (timeline && !timeline.hidden) addCopy(timeline.textContent.trim().replace(/\s+/gu, " "));
    }
  };
  const renderExhibits = () => {
    const current = globalThis.GaiaMapCategories?.buttons().find(button => button.getAttribute("aria-current") === "true");
    const guide = document.createElement("p");
    guide.className = "map-picker-profile-guide";
    guide.textContent = globalThis.GaiaMapCategories.profileGuide;
    content.append(guide);
    for (const category of globalThis.GaiaMapCategories?.definitions || []) {
      const section = document.createElement("section");
      const title = document.createElement("h3");
      title.textContent = category.label;
      section.append(title);
      for (const number of category.numbers) {
        const target = globalThis.GaiaMapCategories.buttons().find(button => Number(button.textContent) === number);
        if (!target) continue;
        // Read the catalog title directly: punctuation can be part of a title.
        const exhibit = [
          ...(globalThis.GaiaAppContent?.modes || []),
          ...(globalThis.GaiaLiveExhibits?.definitions || []),
          ...(globalThis.GaiaEstatExhibits?.definitions || []),
          globalThis.GaiaFirmsExhibit?.definition,
          ...(globalThis.GaiaPlanetSignals?.definitions || []),
        ].find(item => item && Number(item.mapNumber || item.number) === number);
        const publicNumber = String(number).padStart(2, "0");
        const name = exhibit?.titleJa || exhibit?.shortTitle || target.getAttribute("aria-label") || publicNumber;
        const button = makeButton("", () => { close(); target.click(); });
        const title = document.createElement("b");
        title.textContent = `${publicNumber} ${name}`;
        button.append(title);
        const profile = globalThis.GaiaMapCategories.getProfile(number);
        if (profile) {
          const labels = document.createElement("span");
          labels.className = "map-exhibit-profile";
          for (const text of [profile.scopeLabel, profile.timeLabel]) {
            const label = document.createElement("span");
            label.textContent = text;
            labels.append(label);
          }
          button.append(labels);
          button.dataset.mapScope = profile.scope;
          button.dataset.mapTime = profile.time;
        }
        const subtitle = globalThis.GaiaAppContent?.MAP_TITLE_SUBTITLES[publicNumber];
        if (subtitle) {
          const why = document.createElement("small");
          why.textContent = subtitle;
          button.append(why);
        }
        button.setAttribute("aria-current", String(target === current));
        button.dataset.mobileExhibit = String(number);
        section.append(button);
      }
      content.append(section);
    }
  };
  const renderTools = () => {
    const readout = activeReadout();
    const actions = document.createElement("div");
    actions.className = "map-mobile-tool-grid";
    const proxy = (label, target) => {
      if (!target) return;
      const button = makeButton(label, () => { close(); target.click(); });
      button.disabled = target.disabled || target.getAttribute("aria-disabled") === "true";
      if (button.disabled && target.dataset.disabledReason) {
        const item = document.createElement("div");
        item.className = "map-mobile-tool-unavailable";
        const reason = document.createElement("small");
        reason.id = "map-mobile-analysis-unavailable-reason";
        reason.textContent = target.dataset.disabledReason;
        button.setAttribute("aria-describedby", reason.id);
        item.append(button, reason);
        actions.append(item);
      } else actions.append(button);
    };
    proxy("データの出典", readout?.querySelector(".gaia-map-action--source") || layer.querySelector("#japan-data-button"));
    proxy("統計分析", readout?.querySelector(".gaia-map-action--analysis") || layer.querySelector("#gaia-statistics-button"));
    const demo = layer.querySelector("#gaia-map-demo-toggle");
    proxy(demo?.getAttribute("aria-pressed") === "true" ? "デモを停止" : "全展示のデモ再生", demo);
    proxy("地図ガイド", layer.querySelector('[data-gaia-mode-guide-replay="map"]'));
    proxy("最大の震源へ", readout?.querySelector("[data-planet-epicenter]:not([hidden])"));
    content.append(actions);
    addCopy("地図をドラッグして移動、2本指で拡大・縮小できます。");
    const zoom = document.createElement("div");
    zoom.className = "map-mobile-tool-grid";
    for (const [id, label] of [["in", "＋ 拡大"], ["out", "− 縮小"], ["reset", "全体に戻す"]]) {
      const target = layer.querySelector(`#gaia-map-zoom-${id}`);
      const button = makeButton(label, () => { close(); target?.click(); });
      button.disabled = target?.disabled ?? true;
      zoom.append(button);
    }
    content.append(zoom);
  };
  const open = (kind, trigger) => {
    if (!enabled()) return;
    close(false);
    opener = trigger;
    content.replaceChildren();
    sheet.dataset.panel = kind;
    heading.textContent = { exhibits: "展示を選ぶ", reading: "読み方・凡例", tools: "地図の操作", ecology: "三つの生態系を比べる" }[kind];
    if (kind === "ecology") {
      const panel = layer.querySelector(".ecologies-exhibit");
      const placeholder = document.createComment("ecology-panel-home");
      panel.before(placeholder);
      ecologyHome = { panel, placeholder };
      content.append(panel);
    } else ({ exhibits: renderExhibits, reading: renderReading, tools: renderTools })[kind]();
    trigger?.setAttribute("aria-expanded", "true");
    sheet.showModal();
    content.scrollTop = 0;
    sheet.querySelector("[data-mobile-sheet-close]").focus({ preventScroll: true });
  };
  toolbar.addEventListener("click", event => {
    const trigger = event.target.closest("[data-mobile-sheet]");
    if (trigger) open(trigger.dataset.mobileSheet, trigger);
  });
  ecologySummary.querySelector("button").addEventListener("click", event => open("ecology", event.currentTarget));
  sheet.querySelector("[data-mobile-sheet-close]").addEventListener("click", () => close());
  sheet.addEventListener("cancel", event => { event.preventDefault(); close(); });
  // Keep map-level keyboard shortcuts from closing or changing the underlying
  // map. Native dialog owns the inert background and button activation.
  addEventListener("keydown", event => {
    if (!sheet.open) return;
    if (event.key === "Escape") { event.stopImmediatePropagation(); event.preventDefault(); close(); }
  }, true);
  sheet.addEventListener("keydown", event => {
    event.stopPropagation();
    if (event.key !== "Tab") return;
    const targets = [...sheet.querySelectorAll('button, a[href], input, select, textarea, summary, [tabindex]')]
      .filter(node => !node.disabled && node.tabIndex >= 0 && node.getClientRects().length
        && getComputedStyle(node).visibility !== "hidden" && !node.closest("[inert]"));
    const first = targets[0], last = targets.at(-1);
    if (!first) { event.preventDefault(); return; }
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
  let backdropDown = false;
  const outside = event => { const rect = sheet.getBoundingClientRect(); return event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom; };
  sheet.addEventListener("pointerdown", event => { backdropDown = outside(event); });
  sheet.addEventListener("click", event => { if (backdropDown && outside(event)) close(); backdropDown = false; });
  const sync = () => {
    const active = enabled();
    layer.classList.toggle("is-mobile-map-shell", active);
    document.body.classList.toggle("has-mobile-map-shell", active);
    if (!active) close(false);
  };
  const onMode = () => { metric = null; close(); sync(); };
  for (const name of ["gaia:japan-mode-change", "gaia:live-exhibit-change", "gaia:estat-exhibit-change", "gaia:firms-change", "gaia:planet-signals-change"]) addEventListener(name, onMode);
  new MutationObserver(sync).observe(layer, { attributes: true, attributeFilter: ["hidden", "aria-hidden", "data-story-mode"] });
  new MutationObserver(sync).observe(document.body, { attributes: true, attributeFilter: ["class"] });
  media.addEventListener("change", sync);
  globalThis.GaiaMobileMap = Object.freeze({ isActive: enabled, setMetric: value => { metric = value; }, close });
  sync();
})();
