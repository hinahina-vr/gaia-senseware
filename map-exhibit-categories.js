(() => {
  "use strict";

  // The five global spectacles lead the route; the remaining exhibits retain
  // their relative order within the subject groups. IDs/renderer indices stay stable.
  const definitions = Object.freeze([
    { id: "planet", label: "惑星のいま", summary: "火災・風・大気・地震・雲を世界から", color: "#9ee4dc", numbers: [1, 2, 3, 4, 5] },
    { id: "climate", label: "気候と炭素", summary: "CO₂濃度・長期の気温変化", color: "#f3b48f", numbers: [6, 16, 24, 25, 26] },
    { id: "weather", label: "空と天気", summary: "風・雲・気温・空気の状態", color: "#9ed5ed", numbers: [15, 18, 19, 20, 27, 28] },
    { id: "water", label: "水と森", summary: "海流・雨・森林のつながり", color: "#95d8c2", numbers: [7, 8, 12, 17, 29, 30] },
    { id: "people", label: "人口と暮らし", summary: "人口・移動・旅・住まい", color: "#e8cf9b", numbers: [14, 21, 22, 23] },
    { id: "resources", label: "資源とエネルギー", summary: "再資源化・排出・再生可能電力", color: "#b8c9ef", numbers: [9, 10, 13] },
    { id: "earth", label: "大地の活動", summary: "世界の大地震、その時と場所", color: "#d7abd8", numbers: [11] },
  ].map(category => Object.freeze({ ...category, numbers: Object.freeze(category.numbers) })));
  const byNumber = new Map(definitions.flatMap(category => category.numbers.map(number => [number, category])));
  const get = number => byNumber.get(Number(number)) || null;
  const buttons = (root = document) => [...root.querySelectorAll(".map-mode-bank .map-mode-button")]
    .sort((a, b) => Number(a.textContent.trim()) - Number(b.textContent.trim()));
  const standardButtons = () => buttons().filter(button => button.hasAttribute("data-map-standard-index"));
  globalThis.GaiaMapCategories = Object.freeze({ definitions, get, buttons, standardButtons });

  const layer = document.querySelector("#japan-layer");
  const groups = layer?.querySelector(".map-mode-groups");
  if (!layer || !groups) return;
  const sections = new Map();
  let scheduled = false;
  const setText = (element, value) => {
    if (element.textContent !== value) element.textContent = value;
  };
  const sync = () => {
    scheduled = false;
    for (const category of definitions) {
      if (!sections.has(category.id)) {
        const section = document.createElement("section");
        section.className = "map-mode-group map-category-group";
        section.dataset.mapCategory = category.id;
        section.style.setProperty("--map-category-color", category.color);
        const heading = document.createElement("p");
        heading.className = "map-mode-group-label";
        heading.id = `map-category-${category.id}-label`;
        const title = document.createElement("strong");
        title.textContent = category.label;
        const count = document.createElement("small");
        count.textContent = `${category.numbers.length} 展示`;
        heading.append(title, count);
        const summary = document.createElement("p");
        summary.className = "map-category-summary";
        summary.textContent = category.summary;
        const grid = document.createElement("div");
        grid.className = "map-mode-list map-category-list";
        section.setAttribute("aria-labelledby", heading.id);
        section.append(heading, summary, grid);
        groups.append(section);
        sections.set(category.id, section);
      }
    }
    for (const button of buttons()) {
      const category = get(button.textContent.trim());
      if (!category) continue;
      const grid = sections.get(category.id).querySelector(".map-category-list");
      if (button.parentElement !== grid) grid.append(button);
      if (button.dataset.mapCategory !== category.id) button.dataset.mapCategory = category.id;
    }
    // Keep the original mounting points for lazy-loaded providers. Relocating
    // the real buttons preserves their listeners, references and accessibility.
    for (const section of groups.querySelectorAll(":scope > .map-mode-group:not(.map-category-group)")) {
      section.hidden = true;
      section.dataset.mapSourceMount = "true";
    }
    groups.classList.add("is-themed");
    for (const section of sections.values()) section.hidden = !section.querySelector(".map-mode-button");
    const category = get(layer.querySelector("#japan-mode-number")?.textContent.trim());
    if (!category) return;
    layer.dataset.mapCategory = category.id;
    for (const section of sections.values()) {
      section.classList.toggle("is-current-category", section.dataset.mapCategory === category.id);
    }
    for (const chapter of layer.querySelectorAll(".gaia-live-deck-chapter, .gaia-estat-chapter, .gaia-firms-chapter, .gaia-planet-chapter")) {
      if (!chapter.querySelector("[data-map-category-label]")) {
        const label = document.createElement("p");
        label.className = "map-category-eyebrow";
        label.dataset.mapCategoryLabel = "";
        chapter.prepend(label);
        chapter.classList.add("has-map-category");
      }
    }
    for (const label of layer.querySelectorAll("[data-map-category-label]")) {
      setText(label, category.label);
      label.style.setProperty("--map-category-color", category.color);
    }
    // App startup precedes the lazy renderers. Apply the requested public
    // chapter only once all real buttons exist, through the normal click path.
    const pending = layer.dataset.mapEntryExhibit;
    if (pending && layer.getAttribute("aria-hidden") === "false" && buttons().length === 30) {
      const target = buttons().find(button => Number(button.textContent.trim()) === Number(pending));
      delete layer.dataset.mapEntryExhibit;
      if (target && (!target.hasAttribute("data-map-standard-index") || target.getAttribute("aria-current") !== "true")) target.click();
    }
  };
  const schedule = () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(sync);
  };
  new MutationObserver(schedule).observe(layer, { childList: true, subtree: true });
  for (const event of ["gaia:app-ready", "gaia:japan-open", "gaia:japan-mode-change", "gaia:live-exhibit-change", "gaia:estat-exhibit-change", "gaia:firms-change", "gaia:planet-signals-change"]) {
    addEventListener(event, schedule);
  }
  groups.addEventListener("click", event => {
    if (event.target instanceof Element && event.target.closest(".map-mode-button")) delete layer.dataset.mapEntryExhibit;
  }, { capture: true });
  schedule();
})();
