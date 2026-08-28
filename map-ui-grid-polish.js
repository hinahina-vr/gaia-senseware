(() => {
  "use strict";

  const DESKTOP_MIN = 901;
  const japanLayer = document.querySelector("#japan-layer");
  const panels = Object.freeze({
    intro: japanLayer?.querySelector(":scope > .japan-heading") || null,
    bank: japanLayer?.querySelector(":scope > .map-mode-bank") || null,
    data: japanLayer?.querySelector(":scope > .signal-console-map") || null,
  });
  const legendDock = japanLayer?.querySelector(".signal-encoding-legend-dock") || null;
  let scheduled = 0;
  const measuredHeights = new Map();

  Object.entries(panels).forEach(([role, panel]) => {
    if (!(panel instanceof HTMLElement)) return;
    panel.dataset.mapGridRole = role;
    panel.classList.add("map-grid-polish", `map-grid-${role}`);
  });

  const applyLayout = ({ desktop, bankTop, dataTop, dataHeight }) => {
    document.body.classList.toggle("map-grid-desktop", desktop);
    if (!desktop) return;
    if (Number.isFinite(dataHeight)) {
      document.documentElement.style.setProperty("--map-grid-data-height", `${Math.ceil(dataHeight)}px`);
    }
    if (!Number.isFinite(bankTop) || !Number.isFinite(dataTop)) return;
    document.documentElement.style.setProperty("--map-grid-bank-top", `${Math.round(bankTop)}px`);
    document.documentElement.style.setProperty("--map-grid-data-top", `${Math.round(dataTop)}px`);
  };

  const measureLayout = () => {
    scheduled = 0;
    const desktop = innerWidth >= DESKTOP_MIN;
    const legendTarget = desktop ? japanLayer : panels.data;
    if (legendDock instanceof HTMLElement && legendTarget instanceof HTMLElement && legendDock.parentElement !== legendTarget) {
      legendTarget.append(legendDock);
    }
    if (desktop && (japanLayer?.hidden || !japanLayer?.getClientRects().length)) {
      requestAnimationFrame(() => applyLayout({ desktop }));
      return;
    }
    const top = Math.max(82, Math.min(108, innerHeight * 0.09));
    const gap = Math.max(9, Math.min(14, innerWidth * 0.0075));
    const introHeight = measuredHeights.get(panels.intro) || 0;
    const bankHeight = measuredHeights.get(panels.bank) || 0;
    const dataHeight = measuredHeights.get(panels.data) || 0;
    if (desktop && (!introHeight || !bankHeight)) {
      requestAnimationFrame(() => applyLayout({ desktop }));
      return;
    }
    const bankTop = top + introHeight + gap;
    const dataTop = bankTop + bankHeight + gap;
    requestAnimationFrame(() => applyLayout({ desktop, bankTop, dataTop, dataHeight }));
  };

  const schedule = () => {
    if (scheduled) return;
    scheduled = requestAnimationFrame(measureLayout);
  };

  const resizeObserver = new ResizeObserver((entries) => {
    entries.forEach((entry) => measuredHeights.set(entry.target, entry.borderBoxSize?.[0]?.blockSize || entry.contentRect.height));
    schedule();
  });
  Object.values(panels).forEach((panel) => {
    if (panel instanceof HTMLElement) resizeObserver.observe(panel);
  });

  if (japanLayer instanceof HTMLElement) {
    new MutationObserver(schedule).observe(japanLayer, {
      attributes: true,
      attributeFilter: ["class", "data-story-mode", "hidden"],
    });
  }

  addEventListener("resize", schedule, { passive: true });
  addEventListener("hashchange", schedule, { passive: true });
  addEventListener("gaia:japan-open", schedule);
  addEventListener("gaia:japan-mode-change", schedule);
  addEventListener("gaia:story-mode-open", schedule);
  addEventListener("gaia:story-mode-close", schedule);
  schedule();
})();
