(() => {
  "use strict";
  if (globalThis.GaiaModeEntryGuide || typeof document === "undefined") return;

  const registry = new Map();
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const layer = document.createElement("section");
  layer.className = "gaia-mode-entry-guide";
  layer.id = "gaia-mode-entry-guide";
  layer.hidden = true;
  layer.inert = true;
  layer.tabIndex = -1;
  layer.setAttribute("role", "dialog");
  layer.setAttribute("aria-modal", "false");
  layer.setAttribute("aria-labelledby", "gaia-mode-entry-guide-title");
  layer.setAttribute("aria-describedby", "gaia-mode-entry-guide-copy");
  layer.innerHTML = `
    <div class="gaia-mode-entry-guide-spotlight" aria-hidden="true"></div>
    <article class="gaia-mode-entry-guide-card" aria-live="polite" aria-atomic="true">
      <header>
        <span data-mode-guide-kicker>MODE GUIDE</span>
        <b><i data-mode-guide-step>1</i> / <span data-mode-guide-total>1</span></b>
      </header>
      <h2 id="gaia-mode-entry-guide-title" data-mode-guide-title></h2>
      <p id="gaia-mode-entry-guide-copy" data-mode-guide-copy></p>
    </article>`;
  document.body.append(layer);

  const spotlight = layer.querySelector(".gaia-mode-entry-guide-spotlight");
  const card = layer.querySelector(".gaia-mode-entry-guide-card");
  let activeId = null;
  let activeConfig = null;
  let activeSteps = [];
  let activeIndex = 0;
  let activeTarget = null;
  let returnFocus = null;
  let positionFrame = 0;
  let settleTimer = 0;

  const seenKey = (id, version) => `gaia:mode-entry-guide:${id}:${version || "v1"}`;
  const isVisible = (element) => {
    if (!(element instanceof HTMLElement) || element.hidden || element.closest("[hidden], [inert]")) return false;
    const style = getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    return style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity || 1) > 0 && rect.width > 0 && rect.height > 0;
  };
  const resolveTarget = (step) => {
    const target = typeof step.target === "function" ? step.target() : document.querySelector(step.target);
    return target instanceof HTMLElement ? target : null;
  };
  const clamp = (minimum, maximum, value) => Math.max(minimum, Math.min(maximum, value));
  const overlapArea = (first, second) => Math.max(0, Math.min(first.right, second.right) - Math.max(first.left, second.left))
    * Math.max(0, Math.min(first.bottom, second.bottom) - Math.max(first.top, second.top));
  const resolveAvoidRects = (step) => {
    const sources = [activeConfig?.avoid, step?.avoid].flat().filter(Boolean);
    return sources.flatMap((source) => {
      const resolved = typeof source === "function" ? source() : source;
      if (typeof resolved === "string") return Array.from(document.querySelectorAll(resolved));
      if (resolved instanceof Element) return [resolved];
      return [];
    }).filter(isVisible).map((element) => element.getBoundingClientRect());
  };

  const clearTarget = () => {
    activeTarget?.classList.remove("is-gaia-mode-guide-target");
    activeTarget = null;
  };

  const position = () => {
    positionFrame = 0;
    if (!activeId || !isVisible(activeTarget) || !(card instanceof HTMLElement) || !(spotlight instanceof HTMLElement)) return;
    const rawTarget = activeTarget.getBoundingClientRect();
    const target = {
      left: clamp(0, innerWidth, rawTarget.left),
      top: clamp(0, innerHeight, rawTarget.top),
      right: clamp(0, innerWidth, rawTarget.right),
      bottom: clamp(0, innerHeight, rawTarget.bottom),
    };
    target.width = Math.max(1, target.right - target.left);
    target.height = Math.max(1, target.bottom - target.top);
    spotlight.style.left = `${Math.round(target.left)}px`;
    spotlight.style.top = `${Math.round(target.top)}px`;
    spotlight.style.width = `${Math.round(target.width)}px`;
    spotlight.style.height = `${Math.round(target.height)}px`;
    spotlight.style.borderRadius = getComputedStyle(activeTarget).borderRadius || "8px";

    const cardRect = card.getBoundingClientRect();
    const inset = innerWidth <= 640 ? 10 : 14;
    const gap = innerWidth <= 640 ? 10 : 14;
    const width = Math.min(cardRect.width, innerWidth - inset * 2);
    const height = Math.min(cardRect.height, innerHeight - inset * 2);
    const centerX = target.left + target.width / 2;
    const centerY = target.top + target.height / 2;
    const avoidRects = resolveAvoidRects(activeSteps[activeIndex]);
    const bottomBarrier = avoidRects
      .filter((rect) => rect.width >= innerWidth * 0.55 && rect.bottom >= innerHeight - inset * 2)
      .reduce((top, rect) => Math.min(top, rect.top), innerHeight - inset);
    const maximumTop = Math.max(inset, Math.min(innerHeight - inset - height, bottomBarrier - gap - height));
    const candidates = [
      { placement: "below", left: centerX - width / 2, top: target.bottom + gap, priority: 0 },
      { placement: "above", left: centerX - width / 2, top: target.top - height - gap, priority: 1 },
      { placement: "right", left: target.right + gap, top: centerY - height / 2, priority: 2 },
      { placement: "left", left: target.left - width - gap, top: centerY - height / 2, priority: 3 },
      { placement: "above-left", left: inset, top: target.top - height - gap, priority: 4 },
      { placement: "above-right", left: innerWidth - inset - width, top: target.top - height - gap, priority: 5 },
      { placement: "below-left", left: inset, top: target.bottom + gap, priority: 6 },
      { placement: "below-right", left: innerWidth - inset - width, top: target.bottom + gap, priority: 7 },
    ].map((candidate) => {
      const left = clamp(inset, Math.max(inset, innerWidth - inset - width), candidate.left);
      const top = clamp(inset, maximumTop, candidate.top);
      const bounds = { left, top, right: left + width, bottom: top + height };
      const targetOverlap = overlapArea(bounds, target);
      const avoidedOverlap = avoidRects.reduce((sum, avoidRect) => sum + overlapArea(bounds, avoidRect), 0);
      return { ...candidate, ...bounds, score: targetOverlap * 1000 + avoidedOverlap * 100 + candidate.priority };
    }).sort((first, second) => first.score - second.score)[0];

    card.style.left = `${Math.round(candidates.left)}px`;
    card.style.top = `${Math.round(candidates.top)}px`;
    card.dataset.placement = candidates.placement;
    card.dataset.positioned = "true";
  };

  const schedulePosition = () => {
    cancelAnimationFrame(positionFrame);
    positionFrame = requestAnimationFrame(() => {
      positionFrame = requestAnimationFrame(position);
    });
  };

  const findAvailableStep = (requestedIndex, direction = 1) => {
    for (let index = requestedIndex; index >= 0 && index < activeSteps.length; index += direction) {
      const target = resolveTarget(activeSteps[index]);
      if (isVisible(target)) return { index, target };
    }
    return null;
  };

  const setStep = (requestedIndex, direction = 1) => {
    if (!activeId || activeSteps.length === 0) return;
    const available = findAvailableStep(clamp(0, activeSteps.length - 1, requestedIndex), direction);
    if (!available) {
      close({ restoreFocus: false });
      return;
    }
    clearTarget();
    activeIndex = available.index;
    activeTarget = available.target;
    activeTarget.classList.add("is-gaia-mode-guide-target");
    const step = activeSteps[activeIndex];
    layer.dataset.mode = activeId;
    layer.dataset.step = String(activeIndex + 1);
    layer.querySelector("[data-mode-guide-kicker]").textContent = step.kicker || activeConfig.kicker || "MODE GUIDE";
    layer.querySelector("[data-mode-guide-step]").textContent = String(activeIndex + 1);
    layer.querySelector("[data-mode-guide-total]").textContent = String(activeSteps.length);
    layer.querySelector("[data-mode-guide-title]").textContent = step.title;
    layer.querySelector("[data-mode-guide-copy]").textContent = step.copy;
    delete card.dataset.positioned;

    const rect = activeTarget.getBoundingClientRect();
    if (rect.height < innerHeight * 0.9 && (rect.top < 12 || rect.bottom > innerHeight - 12)) {
      activeTarget.scrollIntoView({ block: "center", inline: "nearest", behavior: reducedMotion ? "auto" : "smooth" });
    }
    schedulePosition();
    clearTimeout(settleTimer);
    settleTimer = window.setTimeout(schedulePosition, reducedMotion ? 0 : 380);
  };

  function close({ restoreFocus = true } = {}) {
    if (!activeId) return false;
    const closingConfig = activeConfig;
    activeId = null;
    activeConfig = null;
    activeSteps = [];
    clearTimeout(settleTimer);
    settleTimer = 0;
    cancelAnimationFrame(positionFrame);
    positionFrame = 0;
    clearTarget();
    layer.classList.remove("is-visible");
    layer.inert = true;
    layer.setAttribute("aria-hidden", "true");
    window.setTimeout(() => {
      if (!activeId) layer.hidden = true;
    }, reducedMotion ? 0 : 180);
    closingConfig?.onClose?.();
    if (restoreFocus && returnFocus instanceof HTMLElement && returnFocus.isConnected) returnFocus.focus({ preventScroll: true });
    returnFocus = null;
    return true;
  }

  const open = async (id, { force = false } = {}) => {
    const config = registry.get(id);
    if (!config || !Array.isArray(config.steps) || config.steps.length === 0) return false;
    if (!force && sessionStorage.getItem(seenKey(id, config.version))) return false;
    if (activeId === id) return false;
    if (activeId) close({ restoreFocus: false });
    await config.prepare?.();
    if (config.available && !config.available()) return false;

    // Some modes reveal their controls after an opening transition. Wait until
    // at least one guide target is actually visible before consuming the
    // first-visit flag or trying to render the first step.
    let visibleSteps = config.steps.filter((step) => isVisible(resolveTarget(step)));
    for (let attempt = 0; visibleSteps.length === 0 && attempt < 30; attempt += 1) {
      await new Promise((resolve) => window.setTimeout(resolve, 80));
      if (config.available && !config.available()) return false;
      visibleSteps = config.steps.filter((step) => isVisible(resolveTarget(step)));
    }
    if (visibleSteps.length === 0) return false;

    activeId = id;
    activeConfig = config;
    activeSteps = visibleSteps;
    activeIndex = 0;
    returnFocus = document.activeElement;
    sessionStorage.setItem(seenKey(id, config.version), "seen");
    layer.hidden = false;
    layer.inert = false;
    layer.setAttribute("aria-hidden", "false");
    requestAnimationFrame(() => {
      if (activeId !== id) return;
      layer.classList.add("is-visible");
      setStep(0);
      layer.focus({ preventScroll: true });
    });
    return true;
  };

  const register = (id, config) => {
    if (!id || !config) return null;
    registry.set(id, Object.freeze({ ...config, steps: Object.freeze([...config.steps]) }));
    return registry.get(id);
  };

  const mountReplay = (id, host, { label = "操作ガイド" } = {}) => {
    if (!(host instanceof HTMLElement)) return null;
    const existing = host.querySelector(`[data-gaia-mode-guide-replay='${id}']`);
    if (existing) return existing;
    const button = document.createElement("button");
    button.className = "gaia-mode-entry-guide-replay";
    button.type = "button";
    button.dataset.gaiaModeGuideReplay = id;
    button.setAttribute("aria-label", `${label}をもう一度見る`);
    button.setAttribute("aria-controls", layer.id);
    button.innerHTML = `<span aria-hidden="true">?</span><strong>${label}</strong>`;
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      void open(id, { force: true });
    });
    host.append(button);
    return button;
  };

  const advance = () => {
    if (activeIndex >= activeSteps.length - 1) close();
    else setStep(activeIndex + 1, 1);
  };
  layer.addEventListener("click", (event) => {
    if (!activeId) return;
    event.preventDefault();
    event.stopPropagation();
    advance();
  });
  layer.addEventListener("keydown", (event) => {
    if (!activeId || (event.key !== "Enter" && event.key !== " ")) return;
    event.preventDefault();
    event.stopPropagation();
    advance();
  });
  document.addEventListener("keydown", (event) => {
    if (!activeId || event.key !== "Escape") return;
    event.preventDefault();
    event.stopImmediatePropagation();
    close();
  }, true);
  addEventListener("resize", schedulePosition, { passive: true });
  addEventListener("scroll", schedulePosition, { passive: true, capture: true });

  globalThis.GaiaModeEntryGuide = Object.freeze({
    register,
    mountReplay,
    open,
    close: (id = null, options = {}) => (!id || id === activeId ? close(options) : false),
    getState: () => ({ active: Boolean(activeId), id: activeId, index: activeIndex }),
  });
  dispatchEvent(new CustomEvent("gaia:mode-entry-guide-ready"));
})();
