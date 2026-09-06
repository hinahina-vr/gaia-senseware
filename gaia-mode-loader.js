(() => {
  "use strict";

  const sharedStylesheet = "./styles.css?v=gaia-prefecture-gis-view-1";

  const groups = Object.freeze({
    exploration: {
      templates: ["gaia-template-exploration"],
      styles: [
        sharedStylesheet,
        "./mode-entry-guide.css?v=gaia-map-guide-sequence-1",
        "./scene-transition.css?v=gaia-52",
        "./data-ledger.css?v=gaia-source-link-icons-1",
        "./data-journey.css?v=gaia-04",
        "./map-ui-grid-polish.css?v=gaia-place-picker-1",
        "./estat-exhibits.css?v=gaia-annual-history-1",
        "./firms-exhibit.css?v=gaia-firms-readout-fit-1",
        "./planet-signals-exhibit.css?v=gaia-epicenter-jump-1",
        "./statistics-lab.css?v=gaia-discovery-1",
        "./statistics-workspace.css?v=gaia-visual-picker-1",
        "./statistics-atmosphere.css?v=gaia-observation-studio-1",
        "./mode-exit.css?v=gaia-story-control-center-2",
        "./map-instrument-ui.css?v=gaia-country-emissions-history-1",
        "./map-chapter-navigation.css?v=gaia-unified-picker-1",
        "./map-exhibit-actions.css?v=gaia-realtime-analysis-disabled-1",
        "./map-exhibit-categories.css?v=gaia-exhibit-profile-1",
        "./ecologies-exhibit.css?v=gaia-ecologies-reading-1",
        "./metric-legend.css?v=gaia-unified-metric-legend-1",
        "./map-demo.css?v=gaia-demo-aurora-1",
        "./map-legend-drag.css?v=gaia-movable-legends-1",
        "./live-observation-ui.css?v=gaia-action-corner-1",
        "./observation-place-picker.css?v=gaia-place-inline-1",
        "./map-observation-panels.css?v=gaia-observation-panels-jst-1",
        "./story-map-layout.css?v=gaia-story-map-left-ui-1",
        "./map-observation-typography.css?v=gaia-lodging-color-1",
        "./map-mobile-shell.css?v=gaia-annual-history-1",
        "./realtime-exhibits.css?v=gaia-realtime-identity-1",
      ],
      scripts: [
        "./mode-entry-guide.js?v=gaia-map-guide-sequence-1",
        "./scene-transition.js?v=gaia-66",
        "./data-ledger.js?v=gaia-observation-panels-jst-1",
        "./data-journey.js?v=gaia-01",
        "./app-content.js?v=gaia-country-coverage-1",
        "./ecologies-exhibit.js?v=gaia-country-coverage-1",
        "./map-exhibit-categories.js?v=gaia-exhibit-profile-1",
        "./app.js?v=gaia-prefecture-gis-view-1",
        "./map-ui-grid-polish.js?v=gaia-story-map-dock-1",
        "./map-legend-drag.js?v=gaia-story-map-left-ui-1",
        "./map-mobile-shell.js?v=gaia-realtime-analysis-disabled-1",
        "./particles-v9.js?v=gaia-light-surface-fps-1",
      ],
      modules: [
        "./src/exploration/index.js?v=gaia-lodging-color-1",
        "./statistics-lab.js?v=gaia-observation-studio-1",
      ],
    },
    story: {
      templates: ["gaia-template-story"],
      styles: [
        sharedStylesheet,
        "./scene-transition.css?v=gaia-52",
        "./novel-mode.css?v=gaia-glitch-double-speed-1",
        "./true-end.css?v=gaia-finale-label-mincho-1",
        "./mode-exit.css?v=gaia-story-control-center-2",
      ],
      scripts: [
        "./scene-transition.js?v=gaia-66",
        "./novel-story-data.js?v=gaia-story-log-revisions-20260906-1",
        "./true-end-data.js?v=gaia-beyond-log-20260906-115607",
        "./true-end-webgl.js?v=gaia-ambient-motion-1",
        "./true-end-mode.js?v=gaia-ending-whiteout-1",
        "./novel-background-cues.js?v=gaia-story-log-revisions-20260906-1",
        "./novel-back-half-cues.js?v=gaia-story-log-revisions-20260906-1",
        "./novel-temporal.js?v=gaia-temporal-1",
        "./ending-glitch.js?v=gaia-glitch-double-speed-1",
        "./novel-mode.js?v=gaia-story-log-revisions-20260906-1",
      ],
      modules: ["./src/exploration/lod-governor.js?v=gaia-budget-devices-1"],
    },
    gx: {
      templates: ["gaia-template-gx"],
      styles: [
        sharedStylesheet,
        "./scene-transition.css?v=gaia-52",
        "./gx-mode.css?v=gaia-gx-reading-1",
        "./gx-reading-layout.css?v=gaia-gx-reading-1",
        "./mode-exit.css?v=gaia-story-control-center-2",
      ],
      scripts: [
        "./scene-transition.js?v=gaia-66",
        "./gx-mode.js?v=gaia-gx-reading-1",
      ],
      modules: ["./src/exploration/lod-governor.js?v=gaia-budget-devices-1"],
    },
    space: {
      templates: ["gaia-template-space"],
      styles: [
        sharedStylesheet,
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
      parallel: true,
      styles: [
        sharedStylesheet,
        "./sound-mode.css?v=gaia-sound-lock-1",
        "./mode-exit.css?v=gaia-story-control-center-2",
      ],
      scripts: ["./sound-constellation.js?v=gaia-sound-lock-1", "./sound-mode.js?v=gaia-sound-lock-1"],
    },
    character: {
      templates: ["gaia-template-character"],
      styles: [
        sharedStylesheet,
        "./mode-entry-guide.css?v=gaia-map-guide-sequence-1",
        "./character-mode.css?v=gaia-character-profile-five-lines-1",
        "./mode-exit.css?v=gaia-story-control-center-2",
      ],
      scripts: [
        "./mode-entry-guide.js?v=gaia-map-guide-sequence-1",
        "./character-mode.js?v=gaia-character-profile-five-lines-1",
      ],
    },
    tour: {
      templates: [],
      styles: ["./guided-tour.css?v=gaia-tour-compact-safe-area-2"],
      scripts: ["./guided-tour.js?v=gaia-tour-compact-safe-area-2"],
    },
  });

  const assetPromises = new Map();
  const groupPromises = new Map();
  const loadedGroups = new Set();
  const characterPreloader = document.querySelector("#gaia-character-preloader");
  const characterPreloaderStatus = characterPreloader?.querySelector("[data-character-preloader-status]");
  let characterPreloaderShownAt = 0;

  const setCharacterPreloader = (visible, { error = false } = {}) => {
    if (!(characterPreloader instanceof HTMLElement)) return;
    window.clearTimeout(Number(characterPreloader.dataset.hideTimer) || 0);
    if (visible) {
      characterPreloaderShownAt = performance.now();
      characterPreloader.hidden = false;
      characterPreloader.classList.toggle("is-error", error);
      characterPreloader.setAttribute("aria-hidden", "false");
      if (characterPreloaderStatus) characterPreloaderStatus.textContent = error
        ? "PORTRAIT DATA / RETRY AVAILABLE"
        : "PORTRAIT DATA / CONNECTING";
      requestAnimationFrame(() => characterPreloader.classList.add("is-visible"));
      return;
    }
    const delay = Math.max(0, 420 - (performance.now() - characterPreloaderShownAt));
    const timer = window.setTimeout(() => {
      characterPreloader.classList.remove("is-visible");
      characterPreloader.setAttribute("aria-hidden", "true");
      const hideTimer = window.setTimeout(() => {
        if (!characterPreloader.classList.contains("is-visible")) characterPreloader.hidden = true;
      }, 430);
      characterPreloader.dataset.hideTimer = String(hideTimer);
    }, delay);
    characterPreloader.dataset.hideTimer = String(timer);
  };

  const waitForCharacterReady = () => new Promise((resolve) => {
    const layer = document.querySelector("#character-book-layer");
    if (!(layer instanceof HTMLElement)) {
      resolve();
      return;
    }
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      observer.disconnect();
      window.clearTimeout(timeout);
      resolve();
    };
    const ready = () => layer.classList.contains("is-open")
      && ["ready", "error"].includes(layer.dataset.imageState || "");
    const observer = new MutationObserver(() => {
      if (ready()) finish();
    });
    const timeout = window.setTimeout(finish, 8000);
    observer.observe(layer, { attributes: true, attributeFilter: ["class", "data-image-state"] });
    if (ready()) finish();
  });

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
      if (group.parallel) {
        await Promise.all([
          ...group.styles.map(loadStyle),
          ...(group.modules || []).map(loadModule),
          ...group.scripts.map(loadScript),
        ]);
      } else {
        await Promise.all(group.styles.map(loadStyle));
        await Promise.all((group.modules || []).map(loadModule));
        for (const script of group.scripts) await loadScript(script);
      }
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
      if (group === "character") setCharacterPreloader(true);
      void load(group).then(() => {
        delete trigger.dataset.gaiaLazyPending;
        trigger.removeAttribute("aria-busy");
        trigger.click();
        if (group === "character") void waitForCharacterReady().then(() => setCharacterPreloader(false));
      }).catch(() => {
        delete trigger.dataset.gaiaLazyPending;
        trigger.removeAttribute("aria-busy");
        if (group === "character") {
          setCharacterPreloader(true, { error: true });
          window.setTimeout(() => setCharacterPreloader(false), 1200);
        }
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

  const warmCharacterArchive = (event) => {
    if (loadedGroups.has("character")) return;
    const trigger = event.target instanceof Element ? event.target.closest("[data-character-gallery-open]") : null;
    if (trigger) void load("character").catch(() => {});
  };
  document.addEventListener("pointerover", warmCharacterArchive, { passive: true });
  document.addEventListener("focusin", warmCharacterArchive);

  const warmSoundArchive = (event) => {
    if (loadedGroups.has("sound")) return;
    const trigger = event.target instanceof Element ? event.target.closest("[data-sound-gallery-open]") : null;
    if (trigger) void load("sound").catch(() => {});
  };
  document.addEventListener("pointerover", warmSoundArchive, { passive: true });
  document.addEventListener("focusin", warmSoundArchive);
  window.addEventListener("gaia:return-to-intro", () => {
    void load("sound").catch(() => {});
  });

  globalThis.GaiaModeLoader = Object.freeze({
    load,
    isLoaded: (name) => loadedGroups.has(name),
  });

  const directRouteLoad = async () => {
    const hash = window.location.hash;
    const query = new URLSearchParams(window.location.search);
    if (hash === "#story" || /\/story\/?$/iu.test(window.location.pathname)) {
      await load("story");
    } else if (hash === "#top") {
      await load("exploration");
    } else if (hash === "#world") {
      await load("exploration");
    } else if (hash === "#sound") {
      await load("sound");
    } else if (hash === "#character") {
      await Promise.all([load("exploration"), load("character")]);
    } else if (hash === "#tour") {
      await load("exploration");
      await load("tour");
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
  window.addEventListener("hashchange", () => {
    void directRouteLoad().catch(console.error);
  });
})();
