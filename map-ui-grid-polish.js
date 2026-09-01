(() => {
  "use strict";

  const DESKTOP_MIN = 901;
  const japanLayer = document.querySelector("#japan-layer");
  const panels = Object.freeze({
    intro: japanLayer?.querySelector(":scope > .japan-heading") || null,
    bank: japanLayer?.querySelector(":scope > .map-mode-bank") || null,
    data: japanLayer?.querySelector(":scope > .signal-console-map") || null,
  });
  const guide = japanLayer?.querySelector("#map-reading-guide") || null;
  const sourceButton = japanLayer?.querySelector("#japan-data-button") || null;
  const statisticsButton = japanLayer?.querySelector("#gaia-statistics-button") || null;
  const legendDock = japanLayer?.querySelector(".signal-encoding-legend-dock") || null;
  let scheduled = 0;
  const measuredHeights = new Map();

  const mountCommandDock = () => {
    if (!(japanLayer instanceof HTMLElement)
      || !(panels.bank instanceof HTMLElement)
      || !(panels.data instanceof HTMLElement)
      || !(guide instanceof HTMLElement)
      || japanLayer.querySelector(".map-command-dock")) return;

    const dock = document.createElement("section");
    dock.className = "map-command-dock";
    dock.setAttribute("aria-label", "地図展示の操作パネル");

    const bankTrigger = document.createElement("button");
    bankTrigger.className = "map-dock-bank-trigger";
    bankTrigger.type = "button";
    bankTrigger.setAttribute("aria-expanded", "false");
    bankTrigger.setAttribute("aria-controls", "map-dock-bank-popover");
    bankTrigger.innerHTML = `
      <span class="map-dock-bank-copy">
        <small>CHAPTER / MAP <b>MAP-01–14</b></small>
        <span><em data-map-dock-number>01</em><strong data-map-dock-title>地球の一呼吸</strong></span>
      </span>
      <i aria-hidden="true"></i>
    `;

    const bankPopover = document.createElement("div");
    bankPopover.className = "map-dock-bank-popover";
    bankPopover.id = "map-dock-bank-popover";
    bankPopover.setAttribute("aria-label", "展示一覧");
    const modeGroups = panels.bank.querySelector(".map-mode-groups");
    const lightButton = panels.bank.querySelector("#map-light-overlay-open");
    if (modeGroups) bankPopover.append(modeGroups);
    if (lightButton) bankPopover.append(lightButton);
    panels.bank.prepend(bankTrigger);
    panels.bank.append(bankPopover);

    const year = document.createElement("div");
    year.className = "map-dock-year";
    year.innerHTML = `
      <button type="button" data-map-dock-year-step="-1" aria-label="一つ前の時点へ">‹</button>
      <span><b data-map-dock-year>—</b><small data-map-dock-year-unit>年</small></span>
      <button type="button" data-map-dock-year-step="1" aria-label="一つ次の時点へ">›</button>
    `;
    const timelineLabel = panels.data.querySelector("label");
    const timelineInput = timelineLabel?.querySelector("[data-signal-time]");
    if (timelineLabel && timelineInput) timelineLabel.insertBefore(year, timelineInput);
    const timelineScale = document.createElement("div");
    timelineScale.className = "map-dock-timeline-scale";
    timelineScale.setAttribute("aria-hidden", "true");
    if (timelineLabel) timelineLabel.append(timelineScale);

    const makeProxy = ({ className, kicker, label, symbol, target }) => {
      const button = document.createElement("button");
      button.className = className;
      button.type = "button";
      button.innerHTML = `<span><small>${kicker}</small><strong>${label}</strong></span><i aria-hidden="true">${symbol}</i>`;
      button.addEventListener("click", () => {
        guide.open = false;
        setBankOpen(false);
        target?.click();
      });
      return button;
    };
    const sourceProxy = makeProxy({
      className: "map-dock-action map-dock-action--source",
      kicker: "SOURCE",
      label: "データの出典",
      symbol: "↗",
      target: sourceButton,
    });
    sourceProxy.setAttribute("aria-label", "データの出典を表示する");
    sourceProxy.setAttribute("aria-controls", "japan-data-panel");
    const statisticsProxy = makeProxy({
      className: "map-dock-action map-dock-action--statistics",
      kicker: "ANALYSIS",
      label: "統計分析",
      symbol: "+",
      target: statisticsButton,
    });
    statisticsProxy.setAttribute("aria-label", "現在の展示データを統計分析する");
    statisticsProxy.setAttribute("aria-haspopup", "dialog");
    statisticsProxy.setAttribute("aria-controls", "gaia-statistics-lab");

    dock.append(panels.bank, panels.data, guide, sourceProxy, statisticsProxy);
    japanLayer.append(dock);
    guide.open = false;

    const syncBankHeading = () => {
      const number = japanLayer.querySelector("#japan-mode-number")?.textContent?.trim() || "01";
      const title = japanLayer.querySelector("#japan-mode-title")?.textContent?.trim() || "地球の一呼吸";
      bankTrigger.querySelector("[data-map-dock-number]").textContent = number;
      bankTrigger.querySelector("[data-map-dock-title]").textContent = title;
      bankTrigger.setAttribute("aria-label", `${number} ${title}。展示一覧を開く`);
    };

    const getTimelineRange = () => {
      const label = panels.data.querySelector("[data-signal-time-label]")?.textContent?.trim() || "";
      const values = [...label.matchAll(/\d{1,4}/gu)].map((match) => ({
        value: Number(match[0]),
        width: match[0].length,
      }));
      if (values.length < 2 || !Number.isFinite(values[0].value) || !Number.isFinite(values.at(-1).value)) return null;
      return { start: values[0].value, end: values.at(-1).value, width: Math.max(values[0].width, values.at(-1).width) };
    };

    const syncTimelineScale = () => {
      const range = getTimelineRange();
      if (!range || range.start === range.end) {
        timelineScale.replaceChildren();
        return;
      }
      const fragment = document.createDocumentFragment();
      const count = 7;
      for (let index = 0; index < count; index += 1) {
        const ratio = index / (count - 1);
        const value = Math.round(range.start + (range.end - range.start) * ratio);
        const marker = document.createElement("span");
        marker.textContent = String(value).padStart(range.width, "0");
        fragment.append(marker);
      }
      timelineScale.replaceChildren(fragment);
      timelineScale.dataset.scale = range.start >= 1900 ? "year" : "step";
    };

    const syncYear = () => {
      const timelineYear = japanLayer.querySelector("#co2-timeline-year")?.textContent?.trim() || "";
      const output = panels.data.querySelector("[data-signal-time-output]")?.textContent?.trim() || "";
      const candidate = timelineYear || output;
      const match = candidate.match(/(?:19|20)\d{2}/u);
      const stepMatch = output.match(/\b(\d{1,3})\s+(?:OF|\/)\s*(\d{1,3})\b/iu);
      const range = getTimelineRange();
      const inputProgress = timelineInput
        ? (Number(timelineInput.value) - Number(timelineInput.min || 0))
          / Math.max(1, Number(timelineInput.max || 100) - Number(timelineInput.min || 0))
        : 0;
      const rangeValue = range
        ? Math.round(range.start + (range.end - range.start) * inputProgress)
        : null;
      const stepValue = stepMatch?.[1]
        || (Number.isFinite(rangeValue) ? String(rangeValue).padStart(range?.width || 2, "0") : "—");
      const value = match?.[0] || stepValue;
      year.querySelector("[data-map-dock-year]").textContent = value;
      year.querySelector("[data-map-dock-year-unit]").textContent = match ? "年" : "STEP";
      year.classList.toggle("has-year", Boolean(match));
      year.classList.toggle("has-step", !match);
    };

    year.querySelectorAll("[data-map-dock-year-step]").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (!timelineInput) return;
        const direction = Number(button.dataset.mapDockYearStep) || 0;
        const range = getTimelineRange();
        const minimum = Number(timelineInput.min || 0);
        const maximum = Number(timelineInput.max || 100);
        const unitCount = range ? Math.max(1, Math.abs(range.end - range.start)) : 100;
        const increment = Math.max(Number(timelineInput.step || 1), (maximum - minimum) / unitCount);
        timelineInput.value = String(Math.min(maximum, Math.max(minimum, Number(timelineInput.value) + direction * increment)));
        timelineInput.dispatchEvent(new Event("input", { bubbles: true }));
        timelineInput.dispatchEvent(new Event("change", { bubbles: true }));
        requestAnimationFrame(syncYear);
      });
    });

    const setBankOpen = (open, { restoreFocus = false } = {}) => {
      const shouldOpen = Boolean(open && innerWidth >= DESKTOP_MIN);
      if (shouldOpen) guide.open = false;
      panels.bank.classList.toggle("is-dock-bank-expanded", shouldOpen);
      bankTrigger.setAttribute("aria-expanded", String(shouldOpen));
      if (shouldOpen) requestAnimationFrame(() => panels.bank.querySelector(".map-mode-button[aria-current='true']")?.focus({ preventScroll: true }));
      else if (restoreFocus) bankTrigger.focus({ preventScroll: true });
    };

    bankTrigger.addEventListener("click", () => setBankOpen(bankTrigger.getAttribute("aria-expanded") !== "true"));
    guide.addEventListener("toggle", () => {
      if (guide.open && innerWidth >= DESKTOP_MIN) setBankOpen(false);
    });
    panels.bank.addEventListener("click", (event) => {
      if (event.target.closest?.(".map-mode-button")) setBankOpen(false);
    });
    document.addEventListener("pointerdown", (event) => {
      if (bankTrigger.getAttribute("aria-expanded") === "true" && !panels.bank.contains(event.target)) setBankOpen(false);
    }, { capture: true });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && bankTrigger.getAttribute("aria-expanded") === "true") {
        event.preventDefault();
        setBankOpen(false, { restoreFocus: true });
      }
    });

    const modeHeading = panels.bank.querySelector(".map-mode-bank-heading");
    if (modeHeading) new MutationObserver(syncBankHeading).observe(modeHeading, { childList: true, subtree: true, characterData: true });
    const timelineOutput = panels.data.querySelector("[data-signal-time-output]");
    const timelineKicker = panels.data.querySelector("[data-signal-time-label]");
    const timelineYear = japanLayer.querySelector("#co2-timeline-year");
    if (timelineOutput) new MutationObserver(syncYear).observe(timelineOutput, { childList: true, subtree: true, characterData: true });
    if (timelineKicker) new MutationObserver(() => { syncTimelineScale(); syncYear(); }).observe(timelineKicker, { childList: true, subtree: true, characterData: true });
    if (timelineYear) new MutationObserver(syncYear).observe(timelineYear, { childList: true, subtree: true, characterData: true });
    if (sourceButton) new MutationObserver(() => {
      sourceProxy.setAttribute("aria-expanded", sourceButton.getAttribute("aria-expanded") || "false");
    }).observe(sourceButton, { attributes: true, attributeFilter: ["aria-expanded"] });
    addEventListener("resize", () => { if (innerWidth < DESKTOP_MIN) setBankOpen(false); }, { passive: true });
    addEventListener("gaia:japan-mode-change", () => requestAnimationFrame(() => { syncBankHeading(); syncTimelineScale(); syncYear(); }));
    addEventListener("gaia:live-exhibit-change", () => requestAnimationFrame(() => { syncBankHeading(); syncTimelineScale(); syncYear(); }));
    syncBankHeading();
    syncTimelineScale();
    syncYear();
  };

  mountCommandDock();

  Object.entries(panels).forEach(([role, panel]) => {
    if (!(panel instanceof HTMLElement)) return;
    panel.dataset.mapGridRole = role;
    panel.classList.add("map-grid-polish", `map-grid-${role}`);
  });

  const applyLayout = ({ desktop, bankTop, dataTop, bankHeight, dataHeight }) => {
    document.body.classList.toggle("map-grid-desktop", desktop);
    if (!desktop) return;
    if (Number.isFinite(bankHeight)) {
      document.documentElement.style.setProperty("--map-grid-bank-height", `${Math.ceil(bankHeight)}px`);
    }
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
    requestAnimationFrame(() => applyLayout({ desktop, bankTop, dataTop, bankHeight, dataHeight }));
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
