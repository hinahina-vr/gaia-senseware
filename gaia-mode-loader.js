(() => {
  "use strict";

  const groups = Object.freeze({
    exploration: {
      templates: ["gaia-template-exploration"],
      styles: [
        "./styles.css?v=gaia-character-main-card-1",
        "./scene-transition.css?v=gaia-52",
        "./data-ledger.css?v=gaia-23",
        "./data-journey.css?v=gaia-04",
        "./map-ui-grid-polish.css?v=gaia-unified-world-bank-1",
        "./statistics-lab.css?v=gaia-statistics-bi-4",
        "./mode-exit.css?v=gaia-story-control-center-2",
        "./observation-notebook.css?v=gaia-exhibit-heading-actions-1",
      ],
      scripts: [
        "./scene-transition.js?v=gaia-66",
        "./data-ledger.js?v=gaia-live-free-tier-1",
        "./data-journey.js?v=gaia-01",
        "./app-content.js?v=gaia-abstract-entry-1",
        "./app.js?v=gaia-budget-devices-1",
        "./map-ui-grid-polish.js?v=gaia-mobile-exhibit-hud-5",
        "./particles-v9.js?v=gaia-light-surface-fps-1",
        "./observation-notebook-core.js?v=gaia-contest-notebook-2",
        "./observation-notebook.js?v=gaia-exhibit-heading-actions-1",
      ],
      modules: [
        "./src/exploration/index.js?v=gaia-budget-devices-1",
        "./statistics-lab.js?v=gaia-statistics-bi-4",
      ],
    },
    story: {
      templates: ["gaia-template-story"],
      styles: [
        "./styles.css?v=gaia-character-main-card-1",
        "./scene-transition.css?v=gaia-52",
        "./novel-mode.css?v=gaia-log-complete-script-1",
        "./true-end.css?v=gaia-apeironcene-exit-3",
        "./mode-exit.css?v=gaia-story-control-center-2",
      ],
      scripts: [
        "./scene-transition.js?v=gaia-66",
        "./novel-story-data.js?v=gaia-approved-script-14",
        "./true-end-data.js?v=gaia-finale-webgl-1",
        "./true-end-webgl.js?v=gaia-ambient-motion-1",
        "./true-end-mode.js?v=gaia-apeironcene-exit-3",
        "./novel-background-cues.js?v=gaia-amane-no-plug-1",
        "./novel-back-half-cues.js?v=gaia-finale-sunset-1",
        "./novel-temporal.js?v=gaia-temporal-1",
        "./novel-mode.js?v=gaia-log-complete-script-1",
      ],
      modules: ["./src/exploration/lod-governor.js?v=gaia-budget-devices-1"],
    },
    gx: {
      templates: ["gaia-template-gx"],
      styles: [
        "./styles.css?v=gaia-character-main-card-1",
        "./scene-transition.css?v=gaia-52",
        "./gx-mode.css?v=gaia-gx-feature-card-1",
        "./mode-exit.css?v=gaia-story-control-center-2",
      ],
      scripts: [
        "./scene-transition.js?v=gaia-66",
        "./gx-mode.js?v=gaia-gx-mobile-installation-1",
      ],
      modules: ["./src/exploration/lod-governor.js?v=gaia-budget-devices-1"],
    },
    space: {
      templates: ["gaia-template-space"],
      styles: [
        "./styles.css?v=gaia-character-main-card-1",
        "./scene-transition.css?v=gaia-52",
        "./space-mode.css?v=gaia-102",
        "./mode-exit.css?v=gaia-story-control-center-2",
      ],
      scripts: [
        "./scene-transition.js?v=gaia-66",
        "./space-scenes.js?v=gaia-98",
        "./space-mode.js?v=gaia-no-breathing-flash-1",
      ],
      modules: ["./src/exploration/lod-governor.js?v=gaia-budget-devices-1"],
    },
    sound: {
      templates: ["gaia-template-sound"],
      styles: [
        "./styles.css?v=gaia-character-main-card-1",
        "./sound-mode.css?v=gaia-aurora-silk-1",
        "./mode-exit.css?v=gaia-story-control-center-2",
      ],
      scripts: ["./sound-mode.js?v=gaia-aurora-silk-1"],
      modules: ["./src/exploration/procedural-audio.js?v=gaia-live-senseware-1"],
    },
    character: {
      templates: ["gaia-template-character"],
      styles: [
        "./styles.css?v=gaia-character-main-card-1",
        "./character-mode.css?v=gaia-character-archive-2",
        "./mode-exit.css?v=gaia-story-control-center-2",
      ],
      scripts: ["./character-mode.js?v=gaia-character-archive-2"],
    },
    notebook: {
      templates: [],
      styles: ["./observation-notebook.css?v=gaia-exhibit-heading-actions-1"],
      scripts: [
        "./observation-notebook-core.js?v=gaia-contest-notebook-2",
        "./observation-notebook.js?v=gaia-exhibit-heading-actions-1",
      ],
    },
    tour: {
      templates: [],
      styles: ["./guided-tour.css?v=gaia-tour-earth-only-1"],
      scripts: ["./guided-tour.js?v=gaia-tour-earth-only-1"],
    },
  });

  const assetPromises = new Map();
  const groupPromises = new Map();
  const loadedGroups = new Set();

  const mountTemplate = (id) => {
    const template = document.getElementById(id);
    if (!(template instanceof HTMLTemplateElement)) return;
    template.replaceWith(template.content);
  };

  const loadStyle = (href) => {
    const absolute = new URL(href, document.baseURI).href;
    if (assetPromises.has(absolute)) return assetPromises.get(absolute);
    const existing = Array.from(document.styleSheets).find((sheet) => sheet.href === absolute);
    if (existing) return Promise.resolve();
    const promise = new Promise((resolve, reject) => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      link.dataset.gaiaLazyAsset = "style";
      link.onload = () => resolve();
      link.onerror = () => reject(new Error(`Stylesheet failed: ${href}`));
      document.head.append(link);
    });
    assetPromises.set(absolute, promise);
    return promise;
  };

  const loadScript = (src) => {
    const absolute = new URL(src, document.baseURI).href;
    if (assetPromises.has(absolute)) return assetPromises.get(absolute);
    const existing = Array.from(document.scripts).find((script) => script.src === absolute);
    if (existing) return Promise.resolve();
    const promise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.async = false;
      script.dataset.gaiaLazyAsset = "script";
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Script failed: ${src}`));
      document.body.append(script);
    });
    assetPromises.set(absolute, promise);
    return promise;
  };

  const loadModule = (src) => {
    const absolute = new URL(src, document.baseURI).href;
    if (assetPromises.has(absolute)) return assetPromises.get(absolute);
    const promise = import(absolute);
    assetPromises.set(absolute, promise);
    return promise;
  };

  const waitForGroupReady = (name) => {
    if (name !== "exploration" || ["true", "fallback"].includes(document.documentElement.dataset.gaiaAppReady)) {
      return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
      const timeout = window.setTimeout(() => {
        window.removeEventListener("gaia:app-ready", onReady);
        reject(new Error("GAIA exploration runtime did not become ready"));
      }, 15_000);
      const onReady = () => {
        window.clearTimeout(timeout);
        resolve();
      };
      window.addEventListener("gaia:app-ready", onReady, { once: true });
    });
  };

  const load = (name) => {
    if (loadedGroups.has(name)) return Promise.resolve();
    if (groupPromises.has(name)) return groupPromises.get(name);
    const group = groups[name];
    if (!group) return Promise.reject(new Error(`Unknown GAIA mode group: ${name}`));

    const promise = (async () => {
      performance.mark(`gaia:${name}-load-start`);
      group.templates.forEach(mountTemplate);
      await Promise.all(group.styles.map(loadStyle));
      await Promise.all((group.modules || []).map(loadModule));
      for (const script of group.scripts) await loadScript(script);
      await waitForGroupReady(name);
      loadedGroups.add(name);
      performance.mark(`gaia:${name}-load-end`);
      performance.measure(`gaia:${name}-load`, `gaia:${name}-load-start`, `gaia:${name}-load-end`);
      window.dispatchEvent(new CustomEvent("gaia:mode-group-loaded", { detail: { name } }));
    })().catch((error) => {
      groupPromises.delete(name);
      console.error(error);
      throw error;
    });
    groupPromises.set(name, promise);
    return promise;
  };

  const interceptClick = (selector, group) => {
    document.addEventListener("click", (event) => {
      const trigger = event.target instanceof Element ? event.target.closest(selector) : null;
      if (!trigger || loadedGroups.has(group)) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      if (trigger.dataset.gaiaLazyPending === "true") return;
      trigger.dataset.gaiaLazyPending = "true";
      trigger.setAttribute("aria-busy", "true");
      void load(group).then(() => {
        delete trigger.dataset.gaiaLazyPending;
        trigger.removeAttribute("aria-busy");
        trigger.click();
      }).catch(() => {
        delete trigger.dataset.gaiaLazyPending;
        trigger.removeAttribute("aria-busy");
      });
    }, true);
  };

  const interceptEvent = (eventName, resolveGroup) => {
    window.addEventListener(eventName, (event) => {
      const group = resolveGroup(event);
      if (!group || loadedGroups.has(group)) return;
      event.stopImmediatePropagation();
      const detail = event.detail;
      void load(group).then(() => {
        window.dispatchEvent(new CustomEvent(eventName, { detail }));
      });
    }, true);
  };

  interceptClick("[data-sound-gallery-open]", "sound");
  interceptClick("[data-character-gallery-open]", "character");
  interceptClick("#intro-gx-feature", "gx");
  interceptClick("[data-space-open]", "space");
  interceptEvent("gaia:gx-open", () => "gx");
  interceptEvent("gaia:space-open-at-mode", () => "space");
  interceptEvent("gaia:novel-open-at-mode", () => "story");
  interceptEvent("gaia:story-mode-open", () => "exploration");
  interceptEvent("gaia:return-to-intro", () => "exploration");
  interceptEvent("gaia:observation-open-request", () => "notebook");

  globalThis.GaiaModeLoader = Object.freeze({
    load,
    isLoaded: (name) => loadedGroups.has(name),
  });

  const directRouteLoad = async () => {
    const hash = window.location.hash;
    const query = new URLSearchParams(window.location.search);
    if (hash === "#story" || /\/story\/?$/iu.test(window.location.pathname)) {
      await load("story");
    } else if (hash === "#sound") {
      await load("sound");
    } else if (hash === "#character") {
      await load("character");
    } else if (hash === "#tour") {
      await load("exploration");
      await load("notebook");
      await load("tour");
    } else if (hash.startsWith("#observation=")) {
      await load("notebook");
    } else if (["#source", "#concept", "#earth", "#japan", "#data"].includes(hash)) {
      await load("exploration");
    } else if (query.has("space")) {
      await Promise.all([load("exploration"), load("space")]);
    } else {
      return;
    }
    globalThis.__gaiaInitialViewReady = true;
    globalThis.__gaiaBootCheck?.();
  };

  void directRouteLoad().catch((error) => {
    console.error(error);
    globalThis.__gaiaInitialViewReady = true;
    globalThis.__gaiaBootCheck?.();
  });
})();
