(() => {
  "use strict";

  const DESKTOP_MIN = 901;
  const ROLES = ["intro", "bank", "data"];
  const STABLE_SELECTORS = Object.freeze({
    intro: "#japan-layer > .japan-heading",
    bank: "#japan-layer > .map-mode-bank",
    data: "#japan-layer > .signal-console-map"
  });
  let scheduled = 0;
  let markedPanels = null;

  const normalize = (value) => String(value || "").replace(/\s+/g, " ").trim();

  function deepestMatch(pattern) {
    const nodes = document.querySelectorAll("body *:not(script):not(style):not(svg):not(path)");
    for (const node of nodes) {
      const text = normalize(node.textContent);
      if (!pattern.test(text)) continue;
      const childOwnsMatch = Array.from(node.children).some((child) => pattern.test(normalize(child.textContent)));
      if (!childOwnsMatch) return node;
    }
    return null;
  }

  function isPanelLike(node) {
    const style = getComputedStyle(node);
    const background = style.backgroundColor.match(/[\d.]+/g)?.map(Number) || [];
    const alpha = background.length > 3 ? background[3] : background.length ? 1 : 0;
    const positioned = style.position === "fixed" || style.position === "absolute" || style.position === "sticky";
    const bordered = parseFloat(style.borderTopWidth) > 0 || parseFloat(style.borderLeftWidth) > 0;
    return positioned || bordered || alpha > 0.035 || style.backdropFilter !== "none";
  }

  function panelFrom(seed, limits) {
    if (!seed) return null;
    let node = seed;
    let best = seed.parentElement || seed;
    let bestScore = -1;

    for (let depth = 0; node && node !== document.body && depth < 11; depth += 1, node = node.parentElement) {
      const rect = node.getBoundingClientRect();
      if (!rect.width || !rect.height) continue;
      if (rect.width > limits.maxWidth || rect.height > limits.maxHeight) break;
      if (rect.width < limits.minWidth || rect.height < limits.minHeight || !isPanelLike(node)) continue;

      const style = getComputedStyle(node);
      const positionBonus = /fixed|absolute|sticky/.test(style.position) ? 1000000 : 0;
      const score = rect.width * rect.height + positionBonus + depth * 500;
      if (score > bestScore) {
        best = node;
        bestScore = score;
      }
    }
    return best;
  }

  function locatePanels() {
    const introSeed = deepestMatch(/PLANETARY\s+LENS\s*\/\s*OPEN\s+MAP|世界のデータを見る/i);
    const bankSeed = deepestMatch(/INSTALLATION\s+BANK\s*\/\s*01[–—-]10/i);
    const dataSeed = deepestMatch(/ACT\s*\d+\s*\/[^/]{0,30}(循環|影響|再編|観測|知る|見る)/i)
      || deepestMatch(/\d{2,4}(?:\.\d+)?\s*ppm\s*\/\s*(?:実測|予想|補完)/i);
    return {
      intro: document.querySelector(STABLE_SELECTORS.intro)
        || panelFrom(introSeed, { minWidth: 260, minHeight: 120, maxWidth: 900, maxHeight: 590 }),
      bank: document.querySelector(STABLE_SELECTORS.bank)
        || panelFrom(bankSeed, { minWidth: 170, minHeight: 90, maxWidth: 610, maxHeight: 290 }),
      data: document.querySelector(STABLE_SELECTORS.data)
        || panelFrom(dataSeed, { minWidth: 220, minHeight: 120, maxWidth: 760, maxHeight: 430 })
    };
  }

  function markPanels(panels) {
    if (markedPanels && ROLES.every((role) => markedPanels[role] === panels[role])) return false;
    document.querySelectorAll("[data-map-grid-role]").forEach((node) => {
      const role = node.dataset.mapGridRole;
      if (panels[role] !== node) {
        node.classList.remove("map-grid-polish", `map-grid-${role}`);
        delete node.dataset.mapGridRole;
        ["left", "top", "width"].forEach((prop) => node.style.removeProperty(prop));
      }
    });

    ROLES.forEach((role) => {
      const node = panels[role];
      if (!node) return;
      node.dataset.mapGridRole = role;
      node.classList.add("map-grid-polish", `map-grid-${role}`);
    });
    markedPanels = panels;
    return true;
  }

  function place(node, left, top, width) {
    if (!node) return;
    const values = {
      left: `${Math.round(left)}px`,
      top: `${Math.round(top)}px`,
      ...(width ? { width: `${Math.round(width)}px` } : {})
    };
    Object.entries(values).forEach(([property, value]) => {
      if (node.style.getPropertyValue(property) === value && node.style.getPropertyPriority(property) === "important") return;
      node.style.setProperty(property, value, "important");
    });
  }

  function layout() {
    scheduled = 0;
    const desktop = innerWidth >= DESKTOP_MIN;
    document.body.classList.toggle("map-grid-desktop", desktop);
    const panels = locatePanels();
    markPanels(panels);
    if (!desktop || !panels.intro) return;

    const gutter = Math.max(18, Math.min(34, innerWidth * 0.017));
    const gap = Math.max(9, Math.min(14, innerWidth * 0.0075));
    const railWidth = Math.max(390, Math.min(530, innerWidth * 0.28));

    const isStoryMap01 = document.body.classList.contains("novel-mode-detour")
      && document.querySelector("#japan-layer")?.dataset.storyMode === "map01";
    if (isStoryMap01) {
      place(panels.data, gutter, 72, railWidth);
      return;
    }

    const topClearance = Math.max(82, Math.min(108, innerHeight * 0.09));
    place(panels.intro, gutter, topClearance, railWidth);

    requestAnimationFrame(() => {
      const introRect = panels.intro.getBoundingClientRect();
      let cursorTop = introRect.bottom + gap;

      if (panels.bank) {
        place(panels.bank, gutter, cursorTop, railWidth);
        cursorTop = panels.bank.getBoundingClientRect().bottom + gap;
      }

      if (panels.data) place(panels.data, gutter, cursorTop, railWidth);
    });
  }

  function schedule() {
    if (scheduled) return;
    scheduled = requestAnimationFrame(layout);
  }

  const observer = new MutationObserver((mutations) => {
    const requiresLayout = mutations.some((mutation) => {
      if (mutation.type !== "childList" || (!mutation.addedNodes.length && !mutation.removedNodes.length)) return false;
      const target = mutation.target instanceof Element ? mutation.target : mutation.target.parentElement;
      return !target?.closest("[data-map-grid-role]");
    });
    if (requiresLayout) {
      schedule();
    }
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", schedule, { once: true });
  } else {
    schedule();
  }

  addEventListener("resize", schedule, { passive: true });
  addEventListener("hashchange", () => setTimeout(schedule, 80));
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
