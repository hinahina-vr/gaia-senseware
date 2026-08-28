(() => {
  "use strict";

  const opening = document.querySelector("#gaia-opening");
  const skipButton = document.querySelector("#gaia-opening-skip");
  const preloadPanel = document.querySelector("#gaia-opening-preload");
  const preloadPercent = document.querySelector("#gaia-preload-percent");
  const preloadBar = document.querySelector("#gaia-preload-bar");
  const preloadStatus = document.querySelector("#gaia-preload-status");
  const soundOnButton = document.querySelector("#gaia-opening-sound-on");
  const soundOffButton = document.querySelector("#gaia-opening-sound-off");
  const particleCanvas = document.querySelector("#gaia-opening-particles");
  const openingVolume = document.querySelector("#gaia-opening-volume");
  const openingVolumeValue = document.querySelector("#gaia-opening-volume-value");
  const audioDock = document.querySelector("#gaia-audio-dock");
  const audioToggle = document.querySelector("#gaia-audio-toggle");
  const audioToggleIcon = document.querySelector("#gaia-audio-toggle-icon");
  const audioVolume = document.querySelector("#gaia-audio-volume");
  const audioVolumePanel = document.querySelector("#gaia-audio-volume-panel");
  const audioVolumeValue = document.querySelector("#gaia-audio-volume-value");
  const finalMenu = document.querySelector("#gaia-opening-final-menu");
  const finalStoryButton = document.querySelector("#gaia-opening-route-story");
  const finalOtherButton = document.querySelector("#gaia-opening-route-other");
  const finalTourButton = document.querySelector("#gaia-opening-tour-link");
  const soundModal = document.querySelector("#gaia-opening-sound-modal");
  const soundDialog = soundModal?.querySelector(".gaia-opening-sound-dialog");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const AUDIO_DOCK_COLLAPSE_DELAY_MS = 6000;
  let audioDockCollapseTimer = 0;
  let soundModalRevealTimer = 0;
  let soundModalHideTimer = 0;
  let soundModalOpen = false;
  let soundSetupConfirmed = false;
  let soundSetupSubmitting = false;
  let pendingSoundEnabled = true;
  const editableCopySelector = "input, textarea, select, [contenteditable='true'], [contenteditable='plaintext-only']";
  document.addEventListener("copy", (event) => {
    const target = event.target;
    if (target instanceof Element && target.closest(editableCopySelector)) return;
    event.preventDefault();
  }, true);
  const signalInitialViewReady = () => {
    if (window.__gaiaInitialViewReady === true) return;
    window.__gaiaInitialViewReady = true;
    window.dispatchEvent(new CustomEvent("gaia:initial-view-ready"));
    window.__gaiaBootCheck?.();
  };
  const directDestination = ["#earth", "#japan", "#data", "#source", "#concept", "#sound", "#story", "#tour"].includes(
    window.location.hash,
  ) || window.location.hash.startsWith("#observation=") || /\/story\/?$/i.test(window.location.pathname);
  const directSensewareDestination = ["#earth", "#japan", "#data", "#source", "#concept", "#tour"].includes(
    window.location.hash,
  ) || window.location.hash.startsWith("#observation=");

  const syncAudioControls = (state = window.GaiaOpeningAudio?.getState?.()) => {
    const volume = Math.round(Math.max(0, Math.min(1, state?.volume ?? 0.1)) * 100);
    const isMuted = state?.muted ?? true;
    const controlSoundEnabled = soundModalOpen ? pendingSoundEnabled : !isMuted;
    if (openingVolume instanceof HTMLInputElement) openingVolume.value = String(volume);
    if (audioVolume instanceof HTMLInputElement) audioVolume.value = String(volume);
    if (openingVolumeValue) openingVolumeValue.textContent = `${volume}%`;
    if (audioVolumeValue) audioVolumeValue.textContent = `${volume}%`;
    soundOnButton?.setAttribute("aria-pressed", String(controlSoundEnabled));
    soundOffButton?.setAttribute("aria-pressed", String(!controlSoundEnabled));
    if (audioDock) audioDock.dataset.muted = String(isMuted);
    if (audioToggle) {
      audioToggle.setAttribute("aria-pressed", String(isMuted));
      const isExpanded = audioDock?.classList.contains("is-expanded") ?? false;
      audioToggle.setAttribute("aria-expanded", String(isExpanded));
      audioToggle.setAttribute("aria-label", isExpanded
        ? (isMuted ? "BGMを再生" : "BGMを消音")
        : "音量調整を開く");
      audioVolumePanel?.setAttribute("aria-hidden", String(!isExpanded));
      if (audioVolume instanceof HTMLInputElement) audioVolume.tabIndex = isExpanded ? 0 : -1;
    }
    if (audioToggleIcon) audioToggleIcon.dataset.muted = String(isMuted);
  };

  const revealAudioDock = () => {
    if (!audioDock) return;
    audioDock.hidden = false;
    audioDock.classList.remove("is-expanded");
    audioDock.dataset.expanded = "false";
    requestAnimationFrame(() => audioDock.classList.add("is-visible"));
  };

  const clearAudioDockCollapse = () => {
    window.clearTimeout(audioDockCollapseTimer);
    audioDockCollapseTimer = 0;
  };

  const setAudioDockExpanded = (expanded, { focusVolume = false } = {}) => {
    if (!audioDock) return;
    clearAudioDockCollapse();
    const nextExpanded = Boolean(expanded);
    audioDock.classList.toggle("is-expanded", nextExpanded);
    audioDock.dataset.expanded = String(nextExpanded);
    syncAudioControls();
    if (nextExpanded) {
      if (focusVolume) window.setTimeout(() => audioVolume?.focus({ preventScroll: true }), 260);
      audioDockCollapseTimer = window.setTimeout(() => setAudioDockExpanded(false), AUDIO_DOCK_COLLAPSE_DELAY_MS);
    }
  };

  const scheduleAudioDockCollapse = (delay = AUDIO_DOCK_COLLAPSE_DELAY_MS) => {
    if (!audioDock?.classList.contains("is-expanded")) return;
    clearAudioDockCollapse();
    audioDockCollapseTimer = window.setTimeout(() => setAudioDockExpanded(false), delay);
  };

  const setVolumeFromInput = (input) => {
    if (!(input instanceof HTMLInputElement)) return;
    const nextVolume = Number(input.value) / 100;
    window.GaiaOpeningAudio?.setVolume?.(nextVolume);
    if (input === audioVolume) {
      const state = window.GaiaOpeningAudio?.getState?.();
      if (nextVolume <= 0 && !state?.muted) void window.GaiaOpeningAudio?.setMuted?.(true);
      else if (nextVolume > 0 && state?.muted) void window.GaiaOpeningAudio?.setMuted?.(false);
      scheduleAudioDockCollapse();
    }
  };

  openingVolume?.addEventListener("input", () => setVolumeFromInput(openingVolume));
  audioVolume?.addEventListener("input", () => setVolumeFromInput(audioVolume));
  audioToggle?.addEventListener("click", async () => {
    if (!audioDock?.classList.contains("is-expanded")) {
      setAudioDockExpanded(true);
      return;
    }
    await window.GaiaOpeningAudio?.toggleMuted?.();
    syncAudioControls();
    scheduleAudioDockCollapse();
  });
  audioDock?.addEventListener("pointerenter", clearAudioDockCollapse);
  audioDock?.addEventListener("pointerleave", () => scheduleAudioDockCollapse(2200));
  audioDock?.addEventListener("focusin", clearAudioDockCollapse);
  audioDock?.addEventListener("focusout", () => scheduleAudioDockCollapse(2200));
  document.addEventListener("pointerdown", (event) => {
    if (!audioDock?.classList.contains("is-expanded") || audioDock.contains(event.target)) return;
    setAudioDockExpanded(false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || !audioDock?.classList.contains("is-expanded")) return;
    event.preventDefault();
    setAudioDockExpanded(false);
    audioToggle?.focus({ preventScroll: true });
  });
  window.addEventListener("gaia:audio-state", (event) => syncAudioControls(event.detail));
  syncAudioControls();

  if (!opening) {
    revealAudioDock();
    signalInitialViewReady();
    return;
  }
  if (directDestination) {
    // Direct hashes mount their lazy destination after this opening layer is
    // removed. Keep the abstract WebGL base suppressed for that whole gap.
    document.body.classList.add("gaia-route-handoff");
    opening.hidden = true;
    document.body.classList.remove("gaia-opening-active");
    if (directSensewareDestination) void window.GaiaOpeningAudio?.switchTrack?.("senseware", 0);
    revealAudioDock();
    if (document.documentElement.dataset.gaiaAppReady === "true") signalInitialViewReady();
    else {
      window.addEventListener("gaia:app-ready", signalInitialViewReady, { once: true });
      window.setTimeout(signalInitialViewReady, 12000);
    }
    return;
  }

  document.body.classList.add("gaia-opening-active");

  const finalCopy = opening.querySelector(".gaia-vn-panel-final .gaia-vn-final-copy");
  const ROUTE_GUIDE_STORAGE_KEY = "gaia:opening-route-guide:v1";
  const routeGuidePreference = new URLSearchParams(window.location.search).get("routeGuide");
  const routeGuideSteps = [
    {
      target: finalStoryButton,
      kicker: "STORY / 物語",
      title: "ふたりの物語から始める",
      copy: "登場人物の視点を通して、人間と地球のこれからをたどります。",
    },
    {
      target: finalOtherButton,
      kicker: "DATA / 地図",
      title: "地球のデータを探索する",
      copy: "地図の光や流れに触れて、観測された地球の今を見ます。",
    },
    {
      target: finalTourButton,
      kicker: "GUIDE / 30秒",
      title: "見どころと操作を短く知る",
      copy: "展示の基本操作を、30秒で実画面に沿って案内します。",
    },
  ].filter((step) => step.target instanceof HTMLButtonElement);
  const routeGuideLayer = document.createElement("section");
  routeGuideLayer.className = "gaia-opening-route-guide";
  routeGuideLayer.hidden = true;
  routeGuideLayer.inert = true;
  routeGuideLayer.setAttribute("aria-hidden", "true");
  routeGuideLayer.setAttribute("role", "dialog");
  routeGuideLayer.setAttribute("aria-modal", "false");
  routeGuideLayer.setAttribute("aria-labelledby", "gaia-opening-route-guide-title");
  routeGuideLayer.innerHTML = `
    <div class="gaia-opening-route-guide-shade" aria-hidden="true"></div>
    <article class="gaia-opening-route-guide-bubble" aria-live="polite">
      <div class="gaia-opening-route-guide-index"><span>入口ガイド</span><b><i data-route-guide-step>1</i> / ${routeGuideSteps.length}</b></div>
      <p data-route-guide-kicker></p>
      <h2 id="gaia-opening-route-guide-title" data-route-guide-title></h2>
      <p data-route-guide-copy></p>
      <nav aria-label="入口ガイドの操作">
        <button type="button" data-route-guide-action="close">閉じる</button>
        <button type="button" data-route-guide-action="previous">戻る</button>
        <button class="is-primary" type="button" data-route-guide-action="next"><span>次へ</span></button>
      </nav>
    </article>`;
  opening.append(routeGuideLayer);

  const routeGuideShade = routeGuideLayer.querySelector(".gaia-opening-route-guide-shade");
  const routeGuideBubble = routeGuideLayer.querySelector(".gaia-opening-route-guide-bubble");
  const routeGuidePrevious = routeGuideLayer.querySelector("[data-route-guide-action='previous']");
  const routeGuideNext = routeGuideLayer.querySelector("[data-route-guide-action='next']");
  let routeGuideActive = false;
  let routeGuideIndex = 0;
  let routeGuidePositionFrame = 0;
  let gatewayLayoutFrame = 0;
  let routeGuideStartTimer = 0;

  const hasSeenRouteGuide = () => {
    if (routeGuidePreference === "1") return false;
    if (routeGuidePreference === "0") return true;
    try { return window.localStorage.getItem(ROUTE_GUIDE_STORAGE_KEY) === "seen"; }
    catch { return false; }
  };

  const rememberRouteGuide = () => {
    try { window.localStorage.setItem(ROUTE_GUIDE_STORAGE_KEY, "seen"); }
    catch { /* Storage can be unavailable in privacy-restricted browsers. */ }
  };

  const clearRouteGuideTarget = () => {
    routeGuideSteps.forEach(({ target }) => target.classList.remove("is-route-guide-target"));
  };

  const positionRouteGuideBubble = () => {
    routeGuidePositionFrame = 0;
    if (!routeGuideActive || !(routeGuideBubble instanceof HTMLElement)) return;
    const target = routeGuideSteps[routeGuideIndex]?.target;
    if (!(target instanceof HTMLElement) || target.getClientRects().length === 0) return;
    const targetRect = target.getBoundingClientRect();
    if (routeGuideShade instanceof HTMLElement) {
      const spotlightPad = 5;
      routeGuideShade.style.setProperty("--route-guide-focus-left", `${Math.max(0, targetRect.left - spotlightPad)}px`);
      routeGuideShade.style.setProperty("--route-guide-focus-top", `${Math.max(0, targetRect.top - spotlightPad)}px`);
      routeGuideShade.style.setProperty("--route-guide-focus-width", `${Math.min(innerWidth, targetRect.right + spotlightPad) - Math.max(0, targetRect.left - spotlightPad)}px`);
      routeGuideShade.style.setProperty("--route-guide-focus-height", `${Math.min(innerHeight, targetRect.bottom + spotlightPad) - Math.max(0, targetRect.top - spotlightPad)}px`);
    }
    const bubbleRect = routeGuideBubble.getBoundingClientRect();
    const gutter = 12;
    const viewportInset = 12;
    const preferredLeft = targetRect.left + targetRect.width / 2 - bubbleRect.width / 2;
    const left = Math.max(viewportInset, Math.min(innerWidth - bubbleRect.width - viewportInset, preferredLeft));
    const below = targetRect.bottom + gutter;
    const above = targetRect.top - bubbleRect.height - gutter;
    const placeBelow = below + bubbleRect.height <= innerHeight - viewportInset;
    const top = placeBelow
      ? below
      : Math.max(viewportInset, above);
    const arrowLeft = Math.max(22, Math.min(bubbleRect.width - 22, targetRect.left + targetRect.width / 2 - left));
    routeGuideBubble.style.left = `${Math.round(left)}px`;
    routeGuideBubble.style.top = `${Math.round(top)}px`;
    routeGuideBubble.style.setProperty("--route-guide-arrow-left", `${Math.round(arrowLeft)}px`);
    routeGuideBubble.dataset.placement = placeBelow ? "below" : "above";
  };

  const scheduleRouteGuidePosition = () => {
    cancelAnimationFrame(routeGuidePositionFrame);
    routeGuidePositionFrame = requestAnimationFrame(() => {
      routeGuidePositionFrame = requestAnimationFrame(positionRouteGuideBubble);
    });
  };

  const syncFinalGatewayPlacement = () => {
    gatewayLayoutFrame = 0;
    if (!(finalCopy instanceof HTMLElement) || !(finalMenu instanceof HTMLElement)) return;
    const desktopLayout = matchMedia("(min-width: 961px) and (min-height: 521px)").matches;
    if (!desktopLayout || finalMenu.hidden) {
      finalCopy.style.removeProperty("--opening-gateway-top");
      finalCopy.style.removeProperty("--opening-gateway-offset");
      scheduleRouteGuidePosition();
      return;
    }
    const artworkWidth = 1672;
    const artworkHeight = 941;
    const titleOpticalX = 430;
    const taglineBottomY = 540;
    const cinemaWide = matchMedia("(min-width: 1200px) and (min-aspect-ratio: 19 / 10)").matches;
    let scale;
    let artworkLeft;
    let artworkTop;
    if (cinemaWide) {
      const renderedWidth = innerWidth * 0.95;
      const renderedHeight = renderedWidth * artworkHeight / artworkWidth;
      scale = renderedWidth / artworkWidth;
      artworkLeft = innerWidth - renderedWidth;
      artworkTop = (innerHeight - renderedHeight) / 2;
    } else {
      scale = Math.max(innerWidth / artworkWidth, innerHeight / artworkHeight);
      artworkLeft = (innerWidth - artworkWidth * scale) / 2;
      artworkTop = (innerHeight - artworkHeight * scale) / 2;
    }
    const copyRect = finalCopy.getBoundingClientRect();
    const menuWidth = finalMenu.getBoundingClientRect().width || finalCopy.clientWidth;
    const titleCenter = artworkLeft + titleOpticalX * scale;
    const gatewayOffset = titleCenter - copyRect.left - menuWidth / 2;
    const gatewayTop = Math.max(14, Math.min(innerHeight - 220, artworkTop + taglineBottomY * scale + 18));
    finalCopy.style.setProperty("--opening-gateway-top", `${Math.round(gatewayTop)}px`);
    finalCopy.style.setProperty("--opening-gateway-offset", `${Math.round(gatewayOffset)}px`);
    scheduleRouteGuidePosition();
  };

  const scheduleFinalGatewayPlacement = () => {
    cancelAnimationFrame(gatewayLayoutFrame);
    gatewayLayoutFrame = requestAnimationFrame(syncFinalGatewayPlacement);
  };

  const setRouteGuideStep = (nextIndex, { moveFocus = true } = {}) => {
    if (!routeGuideActive || routeGuideSteps.length === 0) return;
    routeGuideIndex = Math.max(0, Math.min(routeGuideSteps.length - 1, nextIndex));
    clearRouteGuideTarget();
    const step = routeGuideSteps[routeGuideIndex];
    step.target.classList.add("is-route-guide-target");
    routeGuideLayer.querySelector("[data-route-guide-step]").textContent = String(routeGuideIndex + 1);
    routeGuideLayer.querySelector("[data-route-guide-kicker]").textContent = step.kicker;
    routeGuideLayer.querySelector("[data-route-guide-title]").textContent = step.title;
    routeGuideLayer.querySelector("[data-route-guide-copy]").textContent = step.copy;
    if (routeGuidePrevious instanceof HTMLButtonElement) routeGuidePrevious.disabled = routeGuideIndex === 0;
    if (routeGuideNext instanceof HTMLButtonElement) {
      routeGuideNext.querySelector("span").textContent = routeGuideIndex === routeGuideSteps.length - 1 ? "案内を終える" : "次へ";
    }
    routeGuideLayer.dataset.step = String(routeGuideIndex + 1);
    if (moveFocus) step.target.focus({ preventScroll: true });
    scheduleRouteGuidePosition();
  };

  const closeRouteGuide = ({ remember = true, restoreFocus = true } = {}) => {
    window.clearTimeout(routeGuideStartTimer);
    routeGuideStartTimer = 0;
    if (remember) rememberRouteGuide();
    routeGuideActive = false;
    clearRouteGuideTarget();
    opening.classList.remove("is-route-guide-active");
    routeGuideLayer.classList.remove("is-visible");
    routeGuideLayer.inert = true;
    routeGuideLayer.setAttribute("aria-hidden", "true");
    window.setTimeout(() => {
      if (!routeGuideActive) routeGuideLayer.hidden = true;
    }, reducedMotion ? 0 : 180);
    if (restoreFocus) finalStoryButton?.focus({ preventScroll: true });
  };

  const openRouteGuide = () => {
    if (routeGuideActive || routeGuideSteps.length === 0 || finished) return;
    routeGuideActive = true;
    routeGuideLayer.hidden = false;
    routeGuideLayer.inert = false;
    routeGuideLayer.setAttribute("aria-hidden", "false");
    opening.classList.add("is-route-guide-active");
    requestAnimationFrame(() => {
      routeGuideLayer.classList.add("is-visible");
      setRouteGuideStep(0, { moveFocus: false });
    });
  };

  const maybeStartRouteGuide = () => {
    window.clearTimeout(routeGuideStartTimer);
    if (hasSeenRouteGuide()) return;
    routeGuideStartTimer = window.setTimeout(openRouteGuide, reducedMotion ? 120 : 440);
  };

  routeGuideLayer.addEventListener("click", (event) => {
    const action = event.target.closest("[data-route-guide-action]")?.dataset.routeGuideAction;
    if (action === "close") closeRouteGuide();
    if (action === "previous") setRouteGuideStep(routeGuideIndex - 1);
    if (action === "next") {
      if (routeGuideIndex >= routeGuideSteps.length - 1) closeRouteGuide();
      else setRouteGuideStep(routeGuideIndex + 1);
    }
  });
  routeGuideLayer.addEventListener("keydown", (event) => {
    if (!routeGuideActive) return;
    if (event.key === "Escape") { event.preventDefault(); closeRouteGuide(); }
    if (event.key === "ArrowRight") { event.preventDefault(); setRouteGuideStep(routeGuideIndex + 1); }
    if (event.key === "ArrowLeft") { event.preventDefault(); setRouteGuideStep(routeGuideIndex - 1); }
  });
  window.addEventListener("resize", scheduleFinalGatewayPlacement, { passive: true });

  const OPENING_TIME_SCALE = 1.275;
  const openingMs = (value) => Math.round(value * OPENING_TIME_SCALE);
  const OPENING_DURATION = openingMs(17200);
  const EXIT_DURATION = Math.round(1080 * 0.85);
  const compactArtwork = (Number(navigator.deviceMemory) > 0 && Number(navigator.deviceMemory) <= 4)
    || (Number(navigator.hardwareConcurrency) > 0 && Number(navigator.hardwareConcurrency) <= 4);
  const portraitOpeningArtwork = window.matchMedia("(max-width: 720px)").matches;
  document.documentElement.dataset.gaiaArtworkQuality = compactArtwork ? "compact" : "full";
  const artworkSource = (path) => compactArtwork ? path.replace(/\.webp$/u, "-834.webp") : path;
  const mizuhaArtwork = portraitOpeningArtwork
    ? `./assets/visuals-08/opening-mizuha-keyvisual-portrait-v2${compactArtwork ? "-720" : ""}.webp`
    : artworkSource("./assets/visuals-08/opening-mizuha-keyvisual-v1.webp");
  const OPENING_ART = [
    mizuhaArtwork,
    "./assets/visuals-08/opening-amane-keyvisual-v1.webp",
    "./assets/visuals-07/opening-keyvisual-v2.webp",
    "./assets/visuals-07/open-data-archive-bg-v1.webp",
  ].map((path, index) => index === 0 ? path : artworkSource(path));
  const focusTargets = Array.from(opening.querySelectorAll("[data-opening-focus]"));
  focusTargets.forEach((target) => target.classList.add("is-opening-focus-pending"));
  const textTimers = [];
  let finishTimer = 0;
  let exitTimer = 0;
  let finished = false;
  let finishRequested = false;
  let openingStarted = false;
  let preloadReady = false;
  let preloadStarted = false;
  let artPreloadPromise = null;
  let audioPreloadPromise = null;
  let preloadAssetCount = OPENING_ART.length;
  let settledPreloads = 0;
  let preloadPanelShownAt = 0;
  let preloadRevealTimer = 0;
  let openingArtWarmTimer = 0;
  let preloadLabel = "オープニングの光と人物";
  if (preloadPanel instanceof HTMLElement) preloadPanel.hidden = true;

  const schedule = [
    [260, 650],
    [620, 850],
    [2450, 520],
    [2720, 650],
    [3370, 650],
    [5150, 520],
    [5420, 680],
    [6070, 680],
    [8050, 700],
    [8420, 650],
    [10750, 700],
    [10940, 520],
    [11160, 520],
    [11380, 520],
    [11600, 520],
    [13650, 650],
    [14200, 750],
  ].map(([delay, duration]) => [openingMs(delay), openingMs(duration)]);

  const createOpeningParticles = (canvas) => {
    if (!(canvas instanceof HTMLCanvasElement)) {
      return { start() {}, stop() {} };
    }

    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return { start() {}, stop() {} };

    let width = 0;
    let height = 0;
    let ratio = 1;
    let frame = 0;
    let running = false;
    let lastTime = 0;
    let motes = [];
    let streams = [];
    let glows = [];

    const random = (min, max) => min + Math.random() * (max - min);

    const makeMote = (fromBottom = false) => ({
      x: random(-40, width + 40),
      y: fromBottom ? height + random(0, 100) : random(-30, height + 30),
      radius: random(0.45, 1.75),
      vx: random(0.018, 0.085),
      vy: random(-0.105, -0.025),
      phase: random(0, Math.PI * 2),
      pulse: random(0.0007, 0.0018),
      alpha: random(0.18, 0.6),
      hueOffset: random(-18, 22),
    });

    const makeStream = (fromBottom = false) => ({
      x: random(-width * 0.08, width * 1.08),
      y: fromBottom ? height + random(20, 160) : random(0, height),
      speed: random(0.035, 0.11),
      drift: random(0.012, 0.055),
      width: random(0.55, 1.3),
      length: Math.round(random(12, 28)),
      phase: random(0, Math.PI * 2),
      amplitude: random(7, 24),
      frequency: random(0.00035, 0.0008),
      hueOffset: random(-10, 28),
      trail: [],
    });

    const rebuild = () => {
      const compact = width < 720;
      const area = Math.max(1, (width * height) / 150000);
      const moteCount = Math.min(compact ? 34 : 76, Math.max(compact ? 22 : 42, Math.round(area * 10)));
      const streamCount = compact ? 4 : 8;
      motes = Array.from({ length: moteCount }, () => makeMote());
      streams = Array.from({ length: streamCount }, () => makeStream());
      glows = Array.from({ length: compact ? 2 : 4 }, (_, index) => ({
        x: width * random(0.08, 0.92),
        y: height * random(0.12, 0.88),
        radius: Math.max(width, height) * random(0.11, 0.24),
        phase: index * 1.7 + random(0, 1),
        drift: random(0.00008, 0.0002),
      }));
    };

    const resize = () => {
      width = Math.max(1, window.innerWidth);
      height = Math.max(1, window.innerHeight);
      ratio = Math.min(window.devicePixelRatio || 1, 1.6);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      rebuild();
    };

    const draw = (time) => {
      if (!running) return;
      const delta = Math.min(34, Math.max(0, time - (lastTime || time)));
      lastTime = time;
      const hue = 181 + Math.sin(time * 0.00016) * 12;

      context.clearRect(0, 0, width, height);
      context.save();
      context.globalCompositeOperation = "lighter";

      glows.forEach((glow) => {
        const x = glow.x + Math.sin(time * glow.drift + glow.phase) * width * 0.055;
        const y = glow.y + Math.cos(time * glow.drift * 0.74 + glow.phase) * height * 0.045;
        const pulse = 0.86 + Math.sin(time * 0.00042 + glow.phase) * 0.14;
        const radius = glow.radius * pulse;
        const gradient = context.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, `hsla(${hue + 8}, 74%, 73%, 0.042)`);
        gradient.addColorStop(0.42, `hsla(${hue}, 72%, 58%, 0.018)`);
        gradient.addColorStop(1, `hsla(${hue - 8}, 70%, 40%, 0)`);
        context.fillStyle = gradient;
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2);
        context.fill();
      });

      motes.forEach((mote, index) => {
        mote.x += mote.vx * delta;
        mote.y += mote.vy * delta;
        if (mote.y < -24 || mote.x > width + 30) Object.assign(mote, makeMote(true), { x: random(-40, width * 0.82) });
        const pulse = 0.52 + Math.sin(time * mote.pulse + mote.phase) * 0.48;
        const alpha = mote.alpha * (0.36 + pulse * 0.64);
        const radius = mote.radius * (0.75 + pulse * 0.55);
        context.shadowColor = `hsla(${hue + mote.hueOffset}, 92%, 82%, ${alpha})`;
        context.shadowBlur = radius * 7;
        context.fillStyle = `hsla(${hue + mote.hueOffset}, 86%, ${index % 7 === 0 ? 92 : 76}%, ${alpha})`;
        context.beginPath();
        context.arc(mote.x, mote.y, radius, 0, Math.PI * 2);
        context.fill();
      });

      context.shadowBlur = 0;
      streams.forEach((stream) => {
        stream.y -= stream.speed * delta;
        stream.x += stream.drift * delta;
        const wave = Math.sin(time * stream.frequency + stream.phase) * stream.amplitude;
        stream.trail.push({ x: stream.x + wave, y: stream.y });
        if (stream.trail.length > stream.length) stream.trail.shift();
        if (stream.y < -80 || stream.x > width + 100) Object.assign(stream, makeStream(true));
        if (stream.trail.length < 3) return;

        const gradient = context.createLinearGradient(
          stream.trail[0].x,
          stream.trail[0].y,
          stream.trail[stream.trail.length - 1].x,
          stream.trail[stream.trail.length - 1].y,
        );
        gradient.addColorStop(0, `hsla(${hue + stream.hueOffset}, 86%, 70%, 0)`);
        gradient.addColorStop(0.62, `hsla(${hue + stream.hueOffset}, 88%, 76%, 0.12)`);
        gradient.addColorStop(1, `hsla(${hue + stream.hueOffset}, 96%, 92%, 0.42)`);
        context.strokeStyle = gradient;
        context.lineWidth = stream.width;
        context.beginPath();
        context.moveTo(stream.trail[0].x, stream.trail[0].y);
        for (let index = 1; index < stream.trail.length; index += 1) {
          const previous = stream.trail[index - 1];
          const current = stream.trail[index];
          context.quadraticCurveTo(
            previous.x,
            previous.y,
            (previous.x + current.x) * 0.5,
            (previous.y + current.y) * 0.5,
          );
        }
        context.stroke();
      });

      context.restore();
      frame = requestAnimationFrame(draw);
    };

    return {
      start() {
        if (running) return;
        running = true;
        resize();
        window.addEventListener("resize", resize, { passive: true });
        frame = requestAnimationFrame(draw);
      },
      stop() {
        running = false;
        cancelAnimationFrame(frame);
        window.removeEventListener("resize", resize);
        context.clearRect(0, 0, width, height);
      },
    };
  };

  const particleSystem = window.GaiaParticles?.create?.(particleCanvas, {
    variant: "opening",
    intensity: 1,
  }) || createOpeningParticles(particleCanvas);

  const updatePreload = (message = "") => {
    const total = Math.max(1, preloadAssetCount);
    const percentage = Math.round((settledPreloads / total) * 100);
    if (preloadPercent) preloadPercent.textContent = String(percentage);
    if (preloadBar) preloadBar.style.transform = `scaleX(${percentage / 100})`;
    if (preloadStatus) {
      preloadStatus.textContent = message || `${preloadLabel}を準備しています　${settledPreloads} / ${total}`;
    }
  };

  const preloadOpeningArt = (source, fetchPriority = "low") => new Promise((resolve) => {
    const artwork = new Image();
    artwork.decoding = "async";
    artwork.fetchPriority = fetchPriority;
    let settled = false;
    const complete = () => {
      if (settled) return;
      settled = true;
      settledPreloads += 1;
      updatePreload();
      resolve();
    };
    const settle = () => {
      if (typeof artwork.decode !== "function") {
        complete();
        return;
      }
      artwork.decode().catch(() => {}).finally(complete);
    };
    artwork.onload = settle;
    artwork.onerror = complete;
    artwork.src = new URL(source, document.baseURI).href;
  });

  const startOpeningArtPreload = ({ fetchPriority = "low" } = {}) => {
    if (artPreloadPromise) return artPreloadPromise;
    artPreloadPromise = Promise.all(OPENING_ART.map((source) => preloadOpeningArt(source, fetchPriority)));
    return artPreloadPromise;
  };

  const startOpeningAudioPreload = () => {
    if (audioPreloadPromise) return audioPreloadPromise;
    preloadAssetCount += 1;
    preloadLabel = "オープニングの光・人物・音";
    updatePreload();
    audioPreloadPromise = (async () => {
      try {
        await window.GaiaOpeningAudio?.preload();
      } finally {
        settledPreloads += 1;
        updatePreload();
      }
    })();
    return audioPreloadPromise;
  };

  const startOpeningPreload = ({ includeAudio = true } = {}) => {
    if (preloadStarted) return;
    preloadStarted = true;
    preloadLabel = includeAudio ? "オープニングの光・人物・音" : "オープニングの光と人物";
    updatePreload();
    window.clearTimeout(preloadRevealTimer);
    preloadRevealTimer = window.setTimeout(() => {
      if (preloadReady || openingStarted || !(preloadPanel instanceof HTMLElement)) return;
      preloadPanel.hidden = false;
      preloadPanelShownAt = performance.now();
    }, 240);

    const tasks = [startOpeningArtPreload({ fetchPriority: "high" })];
    if (includeAudio) tasks.push(startOpeningAudioPreload());
    Promise.race([
      Promise.all(tasks),
      new Promise((resolve) => window.setTimeout(() => resolve("timeout"), 5000)),
    ]).then((result) => {
      window.clearTimeout(preloadRevealTimer);
      const panelWasShown = preloadPanel instanceof HTMLElement && !preloadPanel.hidden;
      if (result === "timeout") {
        if (preloadBar) preloadBar.style.transform = "scaleX(1)";
        if (preloadPercent) preloadPercent.textContent = "100";
        if (preloadStatus) preloadStatus.textContent = "準備できた素材からオープニングを開始します";
      } else {
        updatePreload("準備ができました。オープニングを開始します");
      }
      const minimumVisible = panelWasShown ? Math.max(0, 420 - (performance.now() - preloadPanelShownAt)) : 0;
      window.setTimeout(() => {
        preloadReady = true;
        tryStart();
      }, minimumVisible);
    });
  };

  const revealFocusText = (target, delay, duration) => {
    target.style.setProperty("--opening-focus-duration", `${duration}ms`);
    textTimers.push(window.setTimeout(() => {
      if (finished) return;
      target.classList.remove("is-opening-focus-pending");
    }, delay));
  };

  const settleFocusText = () => {
    textTimers.forEach((timer) => window.clearTimeout(timer));
    focusTargets.forEach((target) => target.classList.remove("is-opening-focus-pending"));
  };

  const closeSoundModalImmediately = () => {
    window.clearTimeout(soundModalRevealTimer);
    window.clearTimeout(soundModalHideTimer);
    soundModalOpen = false;
    opening.classList.remove("is-sound-modal-open");
    if (soundModal instanceof HTMLElement) {
      soundModal.classList.remove("is-visible");
      soundModal.hidden = true;
      soundModal.inert = true;
      soundModal.setAttribute("aria-hidden", "true");
    }
    if (finalMenu instanceof HTMLElement) {
      finalMenu.inert = false;
      finalMenu.removeAttribute("aria-hidden");
    }
  };

  const hideSoundModal = () => {
    if (!soundModalOpen || !(soundModal instanceof HTMLElement)) return;
    window.clearTimeout(soundModalRevealTimer);
    soundModalOpen = false;
    opening.classList.remove("is-sound-modal-open");
    soundModal.classList.remove("is-visible");
    soundModal.inert = true;
    soundModal.setAttribute("aria-hidden", "true");
    if (finalMenu instanceof HTMLElement) {
      finalMenu.inert = false;
      finalMenu.removeAttribute("aria-hidden");
    }
    soundModalHideTimer = window.setTimeout(() => {
      soundModal.hidden = true;
    }, reducedMotion ? 0 : 220);
  };

  const showSoundModal = () => {
    if (
      !(soundModal instanceof HTMLElement)
      || !(soundOnButton instanceof HTMLButtonElement)
      || !(soundOffButton instanceof HTMLButtonElement)
    ) {
      finalStoryButton?.focus({ preventScroll: true });
      return;
    }

    window.clearTimeout(soundModalHideTimer);
    const state = window.GaiaOpeningAudio?.getState?.();
    pendingSoundEnabled = true;
    soundModalOpen = true;
    syncAudioControls(state);
    if (finalMenu instanceof HTMLElement) {
      finalMenu.inert = true;
      finalMenu.setAttribute("aria-hidden", "true");
    }
    soundModal.hidden = false;
    soundModal.inert = false;
    soundModal.setAttribute("aria-hidden", "false");
    opening.classList.add("is-sound-modal-open");
    const focusSelectedSound = () => {
      if (!soundModalOpen) return;
      const selectedButton = pendingSoundEnabled ? soundOnButton : soundOffButton;
      selectedButton?.focus({ preventScroll: true });
    };
    requestAnimationFrame(() => {
      soundModal.classList.add("is-visible");
      signalInitialViewReady();
      window.clearTimeout(openingArtWarmTimer);
      const warmOpeningArtAfterHandoff = () => {
        focusSelectedSound();
        openingArtWarmTimer = 0;
      };
      if (document.querySelector("#gaia-boot")?.hidden) warmOpeningArtAfterHandoff();
      else window.addEventListener("gaia:boot-handoff", warmOpeningArtAfterHandoff, { once: true });
    });
  };

  const finish = async (destination = "menu") => {
    if (finished || finishRequested) return;
    if (typeof destination !== "string") destination = "menu";
    closeRouteGuide({ remember: true, restoreFocus: false });
    finishRequested = true;
    finalMenu?.setAttribute("aria-busy", "true");
    if (finalStoryButton instanceof HTMLButtonElement) finalStoryButton.disabled = true;
    if (finalOtherButton instanceof HTMLButtonElement) finalOtherButton.disabled = true;
    if (finalTourButton instanceof HTMLButtonElement) finalTourButton.disabled = true;
    performance.mark(`gaia:${destination}-route-load-request`);
    const routeReady = destination === "tour"
      ? (async () => {
          await window.GaiaModeLoader?.load?.("exploration");
          await window.GaiaModeLoader?.load?.("notebook");
          await window.GaiaModeLoader?.load?.("tour");
        })()
      : Promise.resolve(window.GaiaModeLoader?.load?.(destination === "story" ? "story" : "exploration"));
    const soundtrackReady = destination === "menu" || destination === "tour"
      ? Promise.resolve(window.GaiaOpeningAudio?.switchTrack?.("senseware", 0.25))
      : Promise.resolve(true);
    finished = true;
    window.clearTimeout(finishTimer);
    closeSoundModalImmediately();
    settleFocusText();
    // Remove the choice cards as one completed unit. Leaving them mounted while
    // the opening dissolves can expose their borders after the copy has faded.
    if (finalMenu instanceof HTMLElement) {
      finalMenu.classList.remove("is-visible");
      finalMenu.hidden = true;
    }
    // Lazy route assets can finish before or after the opening dissolve. Hide
    // the abstract WebGL base for that entire interval, not only after loading.
    document.body.classList.add("gaia-route-handoff");
    opening.classList.add("is-leaving");
    const exitReady = new Promise((resolve) => {
      exitTimer = window.setTimeout(resolve, EXIT_DURATION);
    });
    try {
      await Promise.all([routeReady, exitReady, soundtrackReady]);
    } catch (error) {
      console.error(error);
      finished = false;
      finishRequested = false;
      document.body.classList.remove("gaia-route-handoff");
      opening.classList.remove("is-leaving");
      finalMenu?.removeAttribute("aria-busy");
      if (finalMenu instanceof HTMLElement) {
        finalMenu.hidden = false;
        requestAnimationFrame(() => finalMenu.classList.add("is-visible"));
      }
      if (finalStoryButton instanceof HTMLButtonElement) finalStoryButton.disabled = false;
      if (finalOtherButton instanceof HTMLButtonElement) finalOtherButton.disabled = false;
      if (finalTourButton instanceof HTMLButtonElement) finalTourButton.disabled = false;
      return;
    }
    if (destination === "story") {
      history.replaceState(null, "", `${window.location.pathname}${window.location.search}#story`);
    }
    if (destination === "tour") history.replaceState(null, "", `${window.location.pathname}${window.location.search}#tour`);
    window.dispatchEvent(new CustomEvent("gaia:opening-complete", { detail: { destination } }));
    opening.hidden = true;
    opening.classList.remove("is-active", "is-leaving");
    document.body.classList.remove("gaia-opening-active");
    particleSystem.stop();
    revealAudioDock();
    if (destination === "story") {
      window.dispatchEvent(new CustomEvent("gaia:novel-open-at-mode", {
        detail: { index: 0, source: "opening" },
      }));
    }
    if (destination === "tour") window.GaiaGuidedTour?.start?.({ source: "opening" });
    requestAnimationFrame(() => document.body.classList.remove("gaia-route-handoff"));
  };

  const retireOpeningForStory = () => {
    window.clearTimeout(finishTimer);
    window.clearTimeout(exitTimer);
    closeSoundModalImmediately();
    settleFocusText();
    opening.inert = true;
    opening.setAttribute("aria-hidden", "true");
    opening.classList.add("is-leaving");
    if (finalMenu instanceof HTMLElement) {
      finalMenu.classList.remove("is-visible");
      finalMenu.hidden = true;
    }
    particleSystem.stop();
    window.setTimeout(() => {
      opening.hidden = true;
      opening.classList.remove("is-active", "is-leaving");
      document.body.classList.remove("gaia-opening-active");
      revealAudioDock();
    }, reducedMotion ? 0 : 260);
  };
  window.addEventListener("gaia:novel-open", retireOpeningForStory);

  const showFinalMenu = () => {
    if (finished || !(finalMenu instanceof HTMLElement)) return;
    finalMenu.hidden = false;
    opening.classList.add("is-menu-ready");
    if (!window.GaiaOpeningAudio?.getState?.().muted) void window.GaiaOpeningAudio?.preloadTrack?.("senseware");
    syncAudioControls();
    requestAnimationFrame(() => {
      finalMenu.classList.add("is-visible");
      scheduleFinalGatewayPlacement();
      maybeStartRouteGuide();
      soundModalRevealTimer = window.setTimeout(() => {
        finalStoryButton?.focus({ preventScroll: true });
      }, reducedMotion ? 80 : 240);
    });
  };

  const skipToFinalMenu = () => {
    if (finished || opening.classList.contains("is-menu-ready")) return;
    window.clearTimeout(finishTimer);
    settleFocusText();
    opening.classList.add("is-skipping-to-menu");
    showFinalMenu();
  };

  const start = () => {
    if (openingStarted || !preloadReady || !soundSetupConfirmed) return;
    openingStarted = true;
    particleSystem.start();
    opening.hidden = false;
    opening.classList.add("is-preloaded");
    window.setTimeout(() => {
      if (preloadPanel) preloadPanel.hidden = true;
      opening.classList.remove("is-preloading");
    }, 380);
    void opening.offsetWidth;
    opening.classList.add("is-active");
    if (!window.GaiaOpeningAudio?.getState?.().muted) {
      window.setTimeout(() => void window.GaiaOpeningAudio?.preloadTrack?.("story"), 1000);
    }
    focusTargets.forEach((target, index) => {
      const [delay, duration] = schedule[index] || [index * 120, 520];
      revealFocusText(target, delay, duration);
    });
    finishTimer = window.setTimeout(showFinalMenu, OPENING_DURATION);

  };

  const tryStart = () => {
    if (!soundSetupConfirmed || !preloadReady || openingStarted) return;
    requestAnimationFrame(start);
  };

  const showReducedMotionMenu = () => {
    if (openingStarted || finished) return;
    openingStarted = true;
    opening.hidden = false;
    opening.classList.add("is-preloaded");
    opening.classList.add("is-skipping-to-menu");
    if (preloadPanel) preloadPanel.hidden = true;
    opening.classList.remove("is-preloading");
    settleFocusText();
    showFinalMenu();
  };

  const chooseSound = (enabled) => {
    soundOnButton?.setAttribute("aria-pressed", String(Boolean(enabled)));
    soundOffButton?.setAttribute("aria-pressed", String(!enabled));

    const selectedVolume = Number(openingVolume?.value ?? 10) / 100;
    window.GaiaOpeningAudio?.setVolume?.(selectedVolume);

    if (enabled) {
      // Keep play() in the click task for autoplay permission, but do not wait
      // for media startup before painting the selected state.
      void window.GaiaOpeningAudio?.start(selectedVolume)?.catch?.(() => {});
      // Warm both destinations while the opening or route menu is still visible,
      // so neither route has to keep the next screen waiting for its soundtrack.
      void window.GaiaOpeningAudio?.preloadTrack?.("story");
      void window.GaiaOpeningAudio?.preloadTrack?.("senseware");
    } else {
      void window.GaiaOpeningAudio?.setMuted?.(true);
    }

    syncAudioControls();
  };

  const scheduleAfterInputPaint = (callback) => {
    requestAnimationFrame(() => {
      performance.mark("gaia:sound-choice-feedback-painted");
      requestAnimationFrame(() => {
        window.setTimeout(() => {
          if (globalThis.scheduler?.postTask) {
            void globalThis.scheduler.postTask(callback, { priority: "background" });
          } else {
            callback();
          }
        }, 120);
      });
    });
  };

  const confirmSoundSetup = (enabled) => {
    if (!soundModalOpen || soundSetupSubmitting) return;
    performance.mark("gaia:sound-choice-click");
    soundSetupSubmitting = true;
    window.clearTimeout(openingArtWarmTimer);
    pendingSoundEnabled = Boolean(enabled);
    if (soundOnButton instanceof HTMLButtonElement) soundOnButton.disabled = true;
    if (soundOffButton instanceof HTMLButtonElement) soundOffButton.disabled = true;
    if (openingVolume instanceof HTMLInputElement) openingVolume.disabled = true;
    syncAudioControls();
    chooseSound(pendingSoundEnabled);
    scheduleAfterInputPaint(() => {
      soundSetupConfirmed = true;
      opening.classList.remove("is-awaiting-sound");
      hideSoundModal();
      soundSetupSubmitting = false;
      if (soundOnButton instanceof HTMLButtonElement) soundOnButton.disabled = false;
      if (soundOffButton instanceof HTMLButtonElement) soundOffButton.disabled = false;
      if (openingVolume instanceof HTMLInputElement) openingVolume.disabled = false;
      if (reducedMotion) {
        showReducedMotionMenu();
        return;
      }
      performance.mark("gaia:opening-preload-start");
      startOpeningPreload({ includeAudio: pendingSoundEnabled });
      tryStart();
    });
  };

  skipButton?.addEventListener("click", skipToFinalMenu);
  finalStoryButton?.addEventListener("click", () => void finish("story"));
  finalOtherButton?.addEventListener("click", () => void finish("menu"));
  finalTourButton?.addEventListener("click", () => void finish("tour"));
  soundOnButton?.addEventListener("click", () => void confirmSoundSetup(true));
  soundOffButton?.addEventListener("click", () => void confirmSoundSetup(false));
  soundModal?.addEventListener("keydown", (event) => {
    if (!soundModalOpen) return;
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      (pendingSoundEnabled ? soundOnButton : soundOffButton)?.focus({ preventScroll: true });
      return;
    }
    if (event.key !== "Tab" || !(soundDialog instanceof HTMLElement)) return;
    const focusable = Array.from(
      soundDialog.querySelectorAll('button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'),
    ).filter((element) => element instanceof HTMLElement && element.offsetParent !== null);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !opening.hidden && !opening.classList.contains("is-preloading")) skipToFinalMenu();
  });
  window.addEventListener("pagehide", () => {
    window.clearTimeout(finishTimer);
    window.clearTimeout(exitTimer);
    window.clearTimeout(soundModalRevealTimer);
    window.clearTimeout(soundModalHideTimer);
    window.clearTimeout(preloadRevealTimer);
    window.clearTimeout(openingArtWarmTimer);
    textTimers.forEach((timer) => window.clearTimeout(timer));
    particleSystem.stop();
  });

  showSoundModal();
})();
