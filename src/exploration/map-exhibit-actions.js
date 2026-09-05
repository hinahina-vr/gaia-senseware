let iconSerial = 0;

// Reuse the canonical 01–09 dock icons, including their gradient fills.
// Keep each exhibit's source URL and analysis handler on the original element.
export const decorateMapActions = (container, source, analysis) => {
  container.classList.add("gaia-map-actions");
  container.setAttribute("aria-label", "データの出典と統計分析");
  for (const [button, kind, canonicalKind, kicker, label] of [
    [source, "source", "source", "SOURCE", "データの出典"],
    [analysis, "analysis", "statistics", "ANALYSIS", "統計分析"],
  ]) {
    button.className = `gaia-map-action gaia-map-action--${kind}`;
    const icon = document.createElement("i");
    icon.setAttribute("aria-hidden", "true");
    const svg = document.querySelector(`.map-command-dock > .map-dock-action--${canonicalKind} svg`)?.cloneNode(true);
    if (svg) {
      for (const definition of svg.querySelectorAll("[id]")) {
        const oldId = definition.id;
        definition.id = `map-exhibit-icon-${++iconSerial}`;
        for (const shape of svg.querySelectorAll("[fill]")) {
          if (shape.getAttribute("fill") === `url(#${oldId})`) shape.setAttribute("fill", `url(#${definition.id})`);
        }
      }
      icon.append(svg);
    }
    const copy = document.createElement("span");
    const small = document.createElement("small");
    small.textContent = kicker;
    const strong = document.createElement("strong");
    strong.textContent = label;
    copy.append(small, strong);
    button.replaceChildren(icon, copy);
    if (kind === "analysis") {
      button.setAttribute("aria-label", "現在の展示データを統計分析する");
      button.setAttribute("aria-haspopup", "dialog");
      button.setAttribute("aria-controls", "gaia-statistics-lab");
    }
  }
};
