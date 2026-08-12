(() => {
  "use strict";

  const story = globalThis.GAIA_NOVEL_STORY || globalThis.GAIA_NOVEL_STORY_V6;
  const backgroundCues = globalThis.GAIA_NOVEL_BACKGROUND_CUES;
  const backHalfCues = globalThis.GAIA_NOVEL_BACK_HALF_CUES;
  const layer = document.querySelector("#novel-layer");
  if (!story || !layer) return;
  if (!backgroundCues) throw new Error("[GAIA novel] Background cue data is unavailable");
  if (!backHalfCues) throw new Error("[GAIA novel] Back-half staging cue data is unavailable");

  const STORAGE_KEY = "gaiaSensewareNovel:progress";
  const MANUAL_SAVE_KEY = "gaiaSensewareNovel:manual-saves";
  const CONFIG_KEY = "gaiaSensewareNovel:config:v2";
  const LEGACY_PROGRESS_KEYS = ["gaia_novel_save_v6", "gaiaSensewareNovel:v5"];
  const LEGACY_MANUAL_KEYS = ["gaia_novel_manual_saves_v6", "gaiaSensewareNovel:manual-saves:v1"];
  const SLOT_COUNT = 6;
  const SYSTEM_REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const AUTO_DELAY_MS = 3600;
  const TEMPORAL_TRANSITION_MS = 2400;
  const REVEAL_BASE_MS = 24;
  const REVEAL_MIN_LINE_MS = 120;
  const REVEAL_PUNCTUATION_MS = 84;
  const TEXT_PAGE_MAX_LINES = 3;
  const TEXT_PAGE_HEIGHT_BUFFER_PX = 4;
  const TEXT_PAGE_INDICATOR_SAFETY_PX = 12;
  const SECTION_SEPARATOR_MS = 2200;
  const SECTION_SEPARATOR_REDUCED_MOTION_MS = 2900;
  const FAST_FORWARD_HOLD_DELAY_MS = 180;
  const FAST_FORWARD_STEP_MS = 90;
  const SLACK_ENTER_MS = 760;
  const SLACK_EXIT_MS = 460;
  const LOG_FOLLOW_THRESHOLD_PX = 72;
  const SLACK_ATTACHMENT_ASSETS = Object.freeze({
    BASIL: {
      src: "./assets/visuals-07/slack-attachment-basil-v1.webp",
      label: "IMG_1812.JPG",
    },
    FLOWERBED: {
      src: "./assets/visuals-07/slack-attachment-flowerbed-v1.webp",
      label: "IMG_0031.JPG",
    },
    MEETING_MAP: {
      src: "./assets/visuals-07/slack-attachment-venue-map-v1.svg",
      label: "meeting-place.png",
    },
    VENUE: {
      src: "./assets/visuals-07/slack-attachment-venue-v1.webp",
      label: "entrance-reference.jpg",
    },
  });
  const CHARACTER_VIEW = Object.freeze({ mizuha: "minamo", amane: "sora" });
  const BACKGROUND_SOUNDTRACK = Object.freeze([
    ["novel-bg-workroom-v2.png", "windowlight"],
    ["novel-bg-online-night-v2.png", "moonbook"],
    ["novel-bg-garden-center-v2.png", "firstlight"],
    ["novel-bg-coastal-venue-v2.png", "foldedwind"],
    ["novel-bg-zushi-coast-night-v2.png", "snowfire"],
    ["novel-bg-exhibition-v3.png", "story"],
  ]);
  const CHAT_CAST_MEETING_GATES = Object.freeze({
    mizuha: Object.freeze({ completedAt: "first_meeting_hall_032", visibleFrom: "first_meeting_hall_033" }),
    amane: Object.freeze({ completedAt: "first_meeting_hall_032", visibleFrom: "first_meeting_hall_033" }),
    sakuya: Object.freeze({ completedAt: "first_meeting_hall_066", visibleFrom: "first_meeting_hall_067" }),
  });
  const CHAT_DEVICE_MOBILE_RANGES = Object.freeze({
    first_meeting_hall: Object.freeze([[21, 23], [42, 48]]),
    production_year: Object.freeze([[125, 127], [196, 198]]),
    absence: Object.freeze([[40, 40], [61, 63]]),
  });
  const SPEAKERS = Object.freeze({
    narrator: { name: "", glyph: "◌" },
    mizuha: { name: "ミズハ", glyph: "≈" },
    amane: { name: "アマネ", glyph: "△" },
    sakuya: { name: "サクヤ", glyph: "＊" },
    visitor: { name: "VISITOR", glyph: "◇" },
    system: { name: "GAIA SENSEWARE", glyph: "◎" },
  });
  const RECORD_LABELS = Object.freeze({
    SOURCE: "観測記録 / SOURCE",
    LOCAL_SOURCE: "その場の観測 / LOCAL SOURCE",
    DERIVED: "計算・解釈 / DERIVED",
    SCENARIO: "仮定 / SCENARIO",
    VISITOR_TRACE: "操作記録 / VISITOR TRACE",
  });
  const RECORD_SPEAKER_LABELS = Object.freeze({
    SOURCE: "観測メモ",
    LOCAL_SOURCE: "観測メモ",
    DERIVED: "解析メモ",
    SCENARIO: "仮定メモ",
    VISITOR_TRACE: "選択の記録",
  });
  const getRecordPresenter = (step) => (
    step.sceneId === "prologue_basil" && step.recordType === "LOCAL_SOURCE"
      ? "amane"
      : "narrator"
  );
  const SAKUYA_STEP_EXPRESSIONS = Object.freeze({
    prologue_basil_007: "worried",
    first_meeting_promise_010: "teasing",
    first_meeting_promise_012: "teasing",
    first_meeting_promise_014: "teasing",
    first_meeting_hall_014: "teasing",
    first_meeting_hall_016: "teasing",
    festival_walk_004: "teasing",
    festival_walk_006: "worried",
    production_year_018: "worried",
    production_year_022: "worried",
    production_year_024: "worried",
    production_year_032: "teasing",
    production_year_042: "worried",
    absence_003: "worried",
    absence_004: "sad",
    mode10_space_012: "sad",
  });
  const VIEWED_DEFAULTS = Object.freeze({
    gxDeepTime: false,
    mode03Forest: false,
    mode03Rain: false,
    mode03Overlay: false,
    mode07AbstractPoint: false,
    mode07Source: false,
    mode07Derived: false,
    mode08Nature: false,
    mode08Life: false,
    mode08Memory: false,
    mode10SpaceOverview: false,
  });

  const elements = {
    particles: layer.querySelector("#novel-particles"),
    titleScreen: layer.querySelector("#novel-title-screen"),
    runtime: layer.querySelector("#novel-runtime"),
    start: layer.querySelector("#novel-start-button"),
    resume: layer.querySelector("#novel-resume-button"),
    titleLoad: layer.querySelector("#novel-title-load-button"),
    close: layer.querySelector("#novel-close-button"),
    restart: layer.querySelector("#novel-restart-button"),
    auto: layer.querySelector("#novel-auto-button"),
    fastForward: layer.querySelector("#novel-fast-forward-button"),
    fastForwardLabel: layer.querySelector("#novel-fast-forward-label"),
    jumpButton: layer.querySelector("#novel-jump-button"),
    jumpPanel: layer.querySelector("#novel-jump-panel"),
    jumpList: layer.querySelector("#novel-jump-list"),
    jumpCurrent: layer.querySelector("#novel-jump-current"),
    jumpClose: layer.querySelector("#novel-jump-close"),
    logButton: layer.querySelector("#novel-log-button"),
    logPanel: layer.querySelector("#novel-log-panel"),
    logClose: layer.querySelector("#novel-log-close"),
    logContent: layer.querySelector("#novel-log-content"),
    saveButton: layer.querySelector("#novel-save-button"),
    loadButton: layer.querySelector("#novel-load-button"),
    savePanel: layer.querySelector("#novel-save-panel"),
    saveClose: layer.querySelector("#novel-save-close"),
    saveTitle: layer.querySelector("#novel-save-title"),
    saveTab: layer.querySelector("#novel-save-tab"),
    loadTab: layer.querySelector("#novel-load-tab"),
    saveStatus: layer.querySelector("#novel-save-status"),
    saveSlots: layer.querySelector("#novel-save-slots"),
    configButton: layer.querySelector("#novel-config-button"),
    configPanel: layer.querySelector("#novel-config-panel"),
    configClose: layer.querySelector("#novel-config-close"),
    configReset: layer.querySelector("#novel-config-reset"),
    messageSpeed: layer.querySelector("#novel-message-speed"),
    messageSpeedValue: layer.querySelector("#novel-message-speed-value"),
    reducedMotion: layer.querySelector("#novel-reduced-motion"),
    evesButton: layer.querySelector("#novel-eves-button"),
    evesCount: layer.querySelector("#novel-eves-count"),
    evesPanel: layer.querySelector("#novel-eves-panel"),
    evesClose: layer.querySelector("#novel-eves-close"),
    evesCurrent: layer.querySelector("#novel-eves-current"),
    evesGraph: layer.querySelector("#novel-eves-graph"),
    evesHistory: layer.querySelector("#novel-eves-history"),
    evesRewind: layer.querySelector("#novel-eves-rewind"),
    evesRewindNote: layer.querySelector("#novel-eves-rewind-note"),
    modeReadout: layer.querySelector("#novel-mode-readout"),
    progress: layer.querySelector("#novel-progress-bar"),
    chapterCard: layer.querySelector("#novel-chapter-card"),
    chapterIndex: layer.querySelector("#novel-chapter-index"),
    chapterTitle: layer.querySelector("#novel-chapter-title"),
    cast: layer.querySelector("#novel-cast"),
    characterSora: layer.querySelector("#novel-character-sora"),
    characterMinamo: layer.querySelector("#novel-character-minamo"),
    characterSakuya: layer.querySelector("#novel-character-sakuya"),
    avatar: layer.querySelector("#novel-avatar"),
    avatarGlyph: layer.querySelector("#novel-avatar-glyph"),
    dataKind: layer.querySelector("#novel-data-kind"),
    signalTitle: layer.querySelector("#novel-signal-title"),
    sourceButton: layer.querySelector("#novel-source-button"),
    sourcePanel: layer.querySelector("#novel-source-panel"),
    sourceClose: layer.querySelector("#novel-source-close"),
    sourcePanelKind: layer.querySelector("#novel-source-panel-kind"),
    sourcePanelTitle: layer.querySelector("#novel-source-panel-title"),
    sourcePanelDescription: layer.querySelector("#novel-source-panel-description"),
    sourcePanelRule: layer.querySelector("#novel-source-panel-rule"),
    sourcePanelLocation: layer.querySelector("#novel-source-panel-location"),
    sourcePanelNote: layer.querySelector("#novel-source-panel-note"),
    dialogue: layer.querySelector("#novel-dialogue"),
    speaker: layer.querySelector("#novel-speaker"),
    text: layer.querySelector("#novel-text"),
    cursor: layer.querySelector("#novel-cursor"),
    continueMark: layer.querySelector("#novel-continue"),
    choices: layer.querySelector("#novel-choices"),
    location: layer.querySelector("#novel-location"),
    slackSurface: layer.querySelector("#novel-slack-surface"),
    operationsPhoneSurface: layer.querySelector("#novel-operations-phone-surface"),
    operationsPhoneClock: layer.querySelector("#novel-operations-phone-clock"),
    operationsPhoneNoticeTime: layer.querySelector("#novel-operations-phone-notice-time"),
    operationsPhoneNoticeSender: layer.querySelector("#novel-operations-phone-notice-sender"),
    operationsPhoneNoticeBody: layer.querySelector("#novel-operations-phone-notice-body"),
    operationsPhoneAudioSpeaker: layer.querySelector("#novel-operations-phone-audio-speaker"),
    operationsPhoneAudioStatus: layer.querySelector("#novel-operations-phone-audio-status"),
    evidenceSurface: layer.querySelector("#novel-evidence-surface"),
    reflectionSurface: layer.querySelector("#novel-reflection-surface"),
    resultSurface: layer.querySelector("#novel-result-surface"),
  };

  const scenes = story.scenes;
  const sceneMap = new Map(scenes.map((scene) => [scene.id, scene]));
  const allSteps = scenes.flatMap((scene) => scene.steps);
  const stepMap = new Map(allSteps.map((step) => [step.id, step]));
  const stepIndexMap = new Map(allSteps.map((step, index) => [step.id, index]));
  if (stepMap.size !== allSteps.length) {
    const seenStepIds = new Set();
    const duplicateStepIds = allSteps
      .map((step) => step.id)
      .filter((stepId) => seenStepIds.has(stepId) || !seenStepIds.add(stepId));
    throw new Error(`[GAIA novel] Duplicate story step IDs: ${[...new Set(duplicateStepIds)].join(", ")}`);
  }
  const scriptIndexMap = new Map(allSteps.map((step, index) => [step.id, index + 1]));
  const sceneJumpEntries = scenes.map((scene, index) => {
    const firstStep = scene.steps?.[0];
    const scriptIndex = scriptIndexMap.get(firstStep?.id);
    if (!firstStep || !Number.isInteger(scriptIndex)) throw new Error(`[GAIA novel] Scene has no valid first step: ${scene.id}`);
    return Object.freeze({ scene, sceneId: scene.id, firstStepId: firstStep.id, scriptIndex, index: index + 1 });
  });
  if (new Set(sceneJumpEntries.map((entry) => entry.sceneId)).size !== scenes.length) {
    throw new Error("[GAIA novel] Duplicate scene IDs in debug jump map");
  }
  if (!globalThis.GaiaNovelTemporal?.create) throw new Error("[GAIA temporal metadata] runtime is not loaded");
  const temporalRuntime = globalThis.GaiaNovelTemporal.create(story);
  const firstStepForScene = (sceneId) => sceneMap.get(sceneId)?.steps?.[0]?.id || null;
  const reflectionStep = allSteps.find((step) => step.type === "reflectionChoice");
  const reflectionOptionMap = new Map((reflectionStep?.options || []).map((option) => [option.id, option]));

  const defaultState = () => ({
    storyVersion: story.storyVersion,
    stepId: firstStepForScene(story.startSceneId),
    reachedSceneIds: [],
    viewed: { ...VIEWED_DEFAULTS },
    evesRoute: [],
    observationOrder: "LOCAL_FIRST",
    editorialChoice: null,
    reflectionIds: [],
    resultTone: null,
    demoInterest: "",
    metCharacters: { mizuha: false, amane: false, sakuya: false },
    audio: { muted: false, volume: 0.1 },
    readStepIds: [],
    clear: false,
    archivesUnlocked: false,
    sessionId: "",
  });

  let state = defaultState();
  let isOpen = false;
  let hasStarted = false;
  let isRevealing = false;
  let fullText = "";
  let dialoguePages = [];
  let dialoguePageIndex = 0;
  let dialoguePageReveal = true;
  let dialogueSourceText = "";
  let dialoguePaginationGeneration = 0;
  let dialogueResizeTimer = 0;
  let revealTimer = 0;
  let revealFrame = 0;
  let revealGeneration = 0;
  let autoTimer = 0;
  const fastForwardState = {
    timer: 0,
    holdTimer: 0,
    controlDown: false,
    keyActive: false,
    buttonActive: false,
    blocked: false,
  };
  let slackTransitionTimer = 0;
  let slackScrollGuardUntil = 0;
  let sectionSeparatorTimer = 0;
  let sectionSeparatorActive = false;
  let temporalTransitionTimer = 0;
  let temporalTransitionActive = false;
  let previousFocus = null;
  let archiveMode = "save";
  let pendingSlotAction = "";
  let pendingSlotTimer = 0;
  let pendingInteraction = null;
  let detourState = null;
  let detourDock = null;
  let detourDockObserver = null;
  let interactionLifecycle = "idle";
  let backgroundTransitionPending = false;
  let deferredOpeningBackground = null;
  let requestedStoryTrack = null;
  let logFollowLatest = true;
  let debugJumpActive = false;
  let jumpOutsidePointerBlocked = false;
  let scriptCopyFeedbackTimer = 0;
  let config = { messageSpeedPercent: 200, reducedMotion: false };

  const getScriptDebugElements = () => ({
    root: document.querySelector("#novel-script-debug"),
    number: document.querySelector("#novel-script-debug-number"),
    stepId: document.querySelector("#novel-script-debug-step-id"),
    copyButton: document.querySelector("#novel-script-debug-copy-button"),
    copyStatus: document.querySelector("#novel-script-debug-copy-status"),
  });

  const clearScriptCopyFeedback = () => {
    window.clearTimeout(scriptCopyFeedbackTimer);
    scriptCopyFeedbackTimer = 0;
    const debug = getScriptDebugElements();
    if (debug.copyStatus) debug.copyStatus.textContent = "COPY";
    if (debug.copyButton) {
      debug.copyButton.dataset.copyState = "idle";
      debug.copyButton.setAttribute("aria-label", "現在のスクリプト位置をコピー");
    }
  };

  const closeSceneJump = ({ restoreFocus = true } = {}) => {
    if (!elements.jumpPanel || !elements.jumpButton) return;
    const wasOpen = !elements.jumpPanel.hidden;
    elements.jumpPanel.hidden = true;
    elements.jumpButton.setAttribute("aria-expanded", "false");
    if (wasOpen && restoreFocus) elements.jumpButton.focus({ preventScroll: true });
  };

  const syncSceneJumpCurrent = (step) => {
    if (!elements.jumpList || !elements.jumpCurrent) return;
    const scene = sceneMap.get(step?.sceneId);
    const entry = sceneJumpEntries.find((candidate) => candidate.sceneId === scene?.id);
    elements.jumpList.querySelectorAll(".novel-jump-item").forEach((button) => {
      const current = button.dataset.sceneId === scene?.id;
      button.classList.toggle("is-current", current);
      if (current) button.setAttribute("aria-current", "true");
      else button.removeAttribute("aria-current");
    });
    elements.jumpCurrent.textContent = entry
      ? `${String(entry.index).padStart(2, "0")} / ${scene.chapter}｜${scene.title} / SCRIPT #${String(entry.scriptIndex).padStart(4, "0")}`
      : "現在位置を特定できません";
  };

  const renderSceneJumpList = () => {
    if (!elements.jumpList) return;
    const fragment = document.createDocumentFragment();
    sceneJumpEntries.forEach((entry) => {
      const item = document.createElement("li");
      const button = document.createElement("button");
      const index = document.createElement("span");
      const label = document.createElement("span");
      const chapter = document.createElement("small");
      const title = document.createElement("strong");
      const script = document.createElement("span");
      button.type = "button";
      button.className = "novel-jump-item";
      button.dataset.sceneId = entry.sceneId;
      index.className = "novel-jump-index";
      index.textContent = String(entry.index).padStart(2, "0");
      label.className = "novel-jump-label";
      chapter.textContent = entry.scene.chapter;
      title.textContent = entry.scene.title;
      label.append(chapter, title);
      script.className = "novel-jump-script";
      script.textContent = `SCRIPT #${String(entry.scriptIndex).padStart(4, "0")}`;
      button.append(index, label, script);
      item.append(button);
      fragment.append(item);
    });
    elements.jumpList.replaceChildren(fragment);
  };

  const setSceneJumpAvailability = (available) => {
    if (!elements.jumpButton) return;
    elements.jumpButton.hidden = !available;
    elements.jumpButton.disabled = !available;
    if (!available) closeSceneJump({ restoreFocus: false });
  };

  const openSceneJump = () => {
    if (!isOpen || !hasStarted || elements.runtime.hidden || !elements.jumpPanel || !elements.jumpButton) return;
    closeLog();
    closeManualArchive();
    closeConfig();
    closeEves();
    closeSourceDetails();
    resetFastForward();
    syncSceneJumpCurrent(currentStep());
    elements.jumpPanel.hidden = false;
    elements.jumpButton.setAttribute("aria-expanded", "true");
    requestAnimationFrame(() => {
      const current = elements.jumpList?.querySelector(".novel-jump-item.is-current")
        || elements.jumpList?.querySelector(".novel-jump-item");
      current?.scrollIntoView?.({ block: "nearest" });
      current?.focus?.({ preventScroll: true });
    });
  };

  const toggleSceneJump = () => {
    if (!elements.jumpPanel) return;
    if (elements.jumpPanel.hidden) openSceneJump();
    else closeSceneJump();
  };

  const clearScriptDebug = () => {
    clearScriptCopyFeedback();
    const debug = getScriptDebugElements();
    if (!debug.root) return;
    if (debug.number) debug.number.textContent = "";
    if (debug.stepId) debug.stepId.textContent = "";
    debug.root.removeAttribute("aria-label");
    debug.root.hidden = true;
    debug.root.setAttribute("aria-hidden", "true");
  };

  const syncScriptDebug = (step) => {
    clearScriptCopyFeedback();
    const debug = getScriptDebugElements();
    if (!debug.root) return;
    const index = scriptIndexMap.get(step?.id);
    const valid = Boolean(isOpen
      && hasStarted
      && !elements.runtime.hidden
      && Number.isInteger(index)
      && stepMap.get(step.id) === step
      && state.stepId === step.id
      && debug.number
      && debug.stepId);
    if (!valid) {
      clearScriptDebug();
      return;
    }
    debug.number.textContent = String(index).padStart(4, "0");
    debug.stepId.textContent = step.id;
    debug.root.setAttribute("aria-label", `スクリプト位置 ${index}、${step.id}`);
    debug.root.hidden = false;
    debug.root.setAttribute("aria-hidden", "false");
    syncSceneJumpCurrent(step);
  };

  const particleSystem = window.GaiaParticles?.create?.(elements.particles, {
    variant: "story",
    intensity: 0.62,
  }) || { start() {}, stop() {} };

  const runSceneTransition = (swapScene, event = null, tone = "novel") => {
    const transition = window.GaiaSceneTransition;
    if (!transition) return Promise.resolve(swapScene());
    const hasOrigin = Number.isFinite(event?.clientX) && Number.isFinite(event?.clientY);
    return transition.run(swapScene, {
      tone,
      origin: hasOrigin ? { x: event.clientX, y: event.clientY } : undefined,
    });
  };

  const motionReduced = () => SYSTEM_REDUCED_MOTION || config.reducedMotion;
  const safeJson = (value) => {
    try { return JSON.parse(value); } catch { return null; }
  };
  const readStorage = (key) => {
    try { return window.localStorage.getItem(key); } catch { return null; }
  };
  const writeStorage = (key, value) => {
    try {
      window.localStorage.setItem(key, value);
      return true;
    } catch {
      return false;
    }
  };
  const readAudioState = () => {
    const volumeInput = document.querySelector("#gaia-audio-volume");
    const volume = Number(volumeInput?.value);
    const volumeMaximum = Number(volumeInput?.max);
    const normalizedVolume = volumeMaximum > 1 ? volume / volumeMaximum : volume;
    const muted = document.querySelector("#gaia-audio-toggle")?.getAttribute("aria-pressed") === "true";
    return {
      muted,
      volume: Number.isFinite(normalizedVolume) ? Math.max(0, Math.min(1, normalizedVolume)) : state.audio.volume,
    };
  };

  const version7To8StepIds = new Map([
    ["current_exhibition_005", "current_exhibition_005"],
    ["current_exhibition_006", "current_exhibition_005"],
    ["current_exhibition_007", "current_exhibition_005"],
    ["current_exhibition_008", "current_exhibition_006"],
    ["current_exhibition_009", "current_exhibition_007"],
    ["current_exhibition_010", "current_exhibition_008"],
    ["current_exhibition_011", "current_exhibition_009"],
    ["current_exhibition_012", "current_exhibition_012"],
    ["current_exhibition_013", "current_exhibition_013"],
    ["current_exhibition_014", "current_exhibition_014"],
    ["current_exhibition_015", "current_exhibition_015"],
    ["current_exhibition_016", "current_exhibition_016"],
    ["current_exhibition_017", "opening_empty_seat_001"],
    ["prologue_basil_001", "prologue_basil_001"],
    ["prologue_basil_002", "prologue_basil_002"],
    ["prologue_basil_003", "prologue_basil_002"],
    ["prologue_basil_004", "prologue_basil_004"],
    ["prologue_basil_005", "prologue_basil_005"],
    ["prologue_basil_006", "prologue_basil_006"],
    ["prologue_basil_007", "prologue_basil_006"],
    ["prologue_basil_008", "prologue_basil_006"],
    ["prologue_basil_009", "prologue_basil_007"],
    ["prologue_basil_010", "prologue_basil_008"],
    ["prologue_basil_011", "prologue_basil_008"],
    ["prologue_basil_012", "prologue_basil_008"],
    ["prologue_basil_013", "prologue_basil_008"],
    ["prologue_basil_014", "prologue_basil_008"],
    ["prologue_basil_015", "prologue_basil_008"],
    ["prologue_basil_016", "prologue_basil_008"],
    ["prologue_basil_017", "prologue_basil_008"],
    ["prologue_basil_018", "prologue_basil_010"],
    ["prologue_basil_019", "prologue_basil_010"],
    ["prologue_basil_020", "prologue_basil_010"],
    ["prologue_basil_021", "prologue_basil_010"],
    ["prologue_basil_022", "prologue_basil_010"],
    ["prologue_basil_023", "prologue_basil_010"],
    ["choice_observation_order_001", "choice_observation_order_001"],
    ["choice_observation_order_002", "choice_observation_order_002"],
    ["choice_observation_order_003", "choice_observation_order_002"],
    ["choice_observation_order_004", "choice_observation_order_003"],
    ["choice_observation_order_005", "choice_observation_order_003"],
    ["choice_observation_order_006", "choice_observation_order_003"],
    ["choice_observation_order_007", "choice_observation_order_004"],
    ["choice_observation_order_008", "choice_observation_order_004"],
    ["choice_observation_order_009", "choice_observation_order_004"],
    ["choice_observation_order_010", "choice_observation_order_005"],
    ["choice_observation_order_011", "choice_observation_order_005"],
    ["choice_observation_order_012", "choice_observation_order_005"],
    ["choice_editorial_001", "choice_editorial_001"],
    ["choice_editorial_002", "choice_editorial_001"],
    ["choice_editorial_003", "choice_editorial_002"],
    ["choice_editorial_004", "choice_editorial_003"],
    ["choice_editorial_005", "choice_editorial_004"],
    ["choice_editorial_006", "choice_editorial_005"],
    ["choice_editorial_007", "choice_editorial_006"],
    ["epilogue_reflection_field_001", "epilogue_reflection_field_001"],
    ["epilogue_reflection_field_002", "epilogue_reflection_field_001"],
    ["choice_reflection_001", "choice_reflection_001"],
    ["choice_reflection_002", "choice_reflection_001"],
    ["choice_reflection_003", "choice_reflection_002"],
  ]);
  const registerShiftedInteractionMigration = (sceneId, total) => {
    version7To8StepIds.set(`${sceneId}_001`, `${sceneId}_001`);
    version7To8StepIds.set(`${sceneId}_002`, `${sceneId}_003`);
    for (let index = 3; index < total; index += 1) {
      const from = `${sceneId}_${String(index).padStart(3, "0")}`;
      const to = `${sceneId}_${String(index + 1).padStart(3, "0")}`;
      version7To8StepIds.set(from, to);
    }
    const last = `${sceneId}_${String(total).padStart(3, "0")}`;
    version7To8StepIds.set(last, last);
  };
  [
    ["gx_deep_time", 26],
    ["mode03_map", 20],
    ["mode07_abstract", 54],
    ["mode08_map_layers", 19],
    ["mode10_space", 18],
  ].forEach(([sceneId, total]) => registerShiftedInteractionMigration(sceneId, total));

  const version8To9StepIds = new Map([
    ["gx_deep_time_017", "gx_deep_time_017"],
    ["gx_deep_time_018", "gx_deep_time_017"],
    ["gx_deep_time_019", "gx_deep_time_017"],
    ["gx_deep_time_020", "gx_deep_time_018"],
    ["gx_deep_time_021", "gx_deep_time_019"],
    ["gx_deep_time_022", "gx_deep_time_020"],
    ["gx_deep_time_023", "gx_deep_time_021"],
    ["gx_deep_time_024", "gx_deep_time_022"],
    ["gx_deep_time_025", "gx_deep_time_023"],
    ["gx_deep_time_026", "gx_deep_time_024"],
  ]);

  const migrateStepId = (stepId, sourceVersion = story.storyVersion) => {
    if (typeof stepId !== "string") return null;
    if (Number(sourceVersion) < 10) return firstStepForScene(story.startSceneId);
    let migratedStepId = stepId;
    if (Number(sourceVersion) < 8 && version7To8StepIds.has(stepId)) {
      migratedStepId = version7To8StepIds.get(stepId);
    }
    if (Number(sourceVersion) < 9 && version8To9StepIds.has(migratedStepId)) {
      migratedStepId = version8To9StepIds.get(migratedStepId);
    }
    if (migratedStepId === "current_exhibition_017") return "opening_empty_seat_001";
    if (stepMap.has(migratedStepId)) return migratedStepId;
    const mappings = [
      ["current_notice_", "current_exhibition_"],
      ["epilogue_visitor_field_", "epilogue_reflection_field_"],
      ["choice_visitor_action_", "choice_reflection_"],
      ["final_record_", "final_record_"],
    ];
    for (const [from, to] of mappings) {
      if (!migratedStepId.startsWith(from)) continue;
      const mapped = `${to}${migratedStepId.slice(from.length)}`;
      if (stepMap.has(mapped)) return mapped;
      const sceneId = to.slice(0, -1);
      return firstStepForScene(sceneId);
    }
    return firstStepForScene(story.startSceneId);
  };

  const normalizeState = (candidate) => {
    const sourceVersion = Number.isFinite(Number(candidate?.storyVersion)) ? Number(candidate.storyVersion) : 7;
    const resetsLegacyProgress = sourceVersion < 10;
    const legacyIndexStep = Number.isInteger(candidate?.stepIndex)
      ? allSteps[Math.max(0, Math.min(allSteps.length - 1, candidate.stepIndex))]?.id
      : null;
    const stepId = migrateStepId(candidate?.stepId || legacyIndexStep, sourceVersion);
    if (!candidate || !stepId) return null;
    const migratedReadStepIds = !resetsLegacyProgress && Array.isArray(candidate.readStepIds)
      ? [...new Set(candidate.readStepIds
        .map((id) => (id === "current_exhibition_017" ? null : migrateStepId(id, sourceVersion)))
        .filter((id) => stepMap.has(id) && stepMap.get(id)?.type !== "phase"))].slice(-260)
      : [];
    const normalized = defaultState();
    normalized.stepId = stepId;
    normalized.reachedSceneIds = !resetsLegacyProgress && Array.isArray(candidate.reachedSceneIds)
      ? candidate.reachedSceneIds.filter((id) => sceneMap.has(id))
      : [];
    normalized.viewed = resetsLegacyProgress ? { ...VIEWED_DEFAULTS } : { ...VIEWED_DEFAULTS, ...(candidate.viewed || {}) };
    normalized.evesRoute = !resetsLegacyProgress && Array.isArray(candidate.evesRoute)
      ? candidate.evesRoute.filter((entry) => ["editorial_choice", "reflection_choice"].includes(entry?.decisionId)).slice(0, 2)
      : [];
    normalized.observationOrder = !resetsLegacyProgress && ["LOCAL_FIRST", "STATION_FIRST"].includes(candidate.observationOrder)
      ? candidate.observationOrder : normalized.observationOrder;
    normalized.editorialChoice = !resetsLegacyProgress && ["SOURCE_RECORD", "DISCLOSE_DERIVATION"].includes(candidate.editorialChoice)
      ? candidate.editorialChoice : null;
    normalized.reflectionIds = !resetsLegacyProgress && Array.isArray(candidate.reflectionIds)
      ? [...new Set(candidate.reflectionIds.filter((id) => reflectionOptionMap.has(id)))].slice(0, 3)
      : [];
    normalized.resultTone = !resetsLegacyProgress && ["LAW", "NEUTRAL", "CHAOS", "UNANSWERED"].includes(candidate.resultTone)
      ? candidate.resultTone : null;
    normalized.demoInterest = !resetsLegacyProgress && ["太古の海", "CO2の季節変動", "気温偏差の地図"].includes(candidate.demoInterest)
      ? candidate.demoInterest : "";
    const currentStepIndex = stepIndexMap.get(stepId) ?? -1;
    normalized.metCharacters = Object.fromEntries(Object.entries(CHAT_CAST_MEETING_GATES).map(([speaker, gate]) => {
      if (resetsLegacyProgress) return [speaker, false];
      const savedFlag = candidate.metCharacters?.[speaker];
      if (typeof savedFlag === "boolean") return [speaker, savedFlag];
      const visibleFromIndex = stepIndexMap.get(gate.visibleFrom) ?? Number.POSITIVE_INFINITY;
      const legacyProgressPassedGate = currentStepIndex >= visibleFromIndex
        && migratedReadStepIds.includes(migrateStepId(gate.completedAt, sourceVersion));
      return [speaker, legacyProgressPassedGate];
    }));
    normalized.audio = {
      muted: Boolean(candidate.audio?.muted),
      volume: Number.isFinite(candidate.audio?.volume) ? Math.max(0, Math.min(1, candidate.audio.volume)) : 0.1,
    };
    normalized.readStepIds = migratedReadStepIds;
    normalized.clear = resetsLegacyProgress ? false : Boolean(candidate.clear);
    normalized.archivesUnlocked = resetsLegacyProgress ? false : Boolean(candidate.archivesUnlocked);
    normalized.sessionId = typeof candidate.sessionId === "string" ? candidate.sessionId.slice(0, 80) : "";
    const knownSaveFields = new Set(story.saveFields || []);
    for (const [key, value] of Object.entries(candidate)) {
      if (knownSaveFields.has(key) || ["__proto__", "prototype", "constructor"].includes(key)) continue;
      normalized[key] = value;
    }
    return normalized;
  };

  const getStoredProgress = () => {
    const current = normalizeState(safeJson(readStorage(STORAGE_KEY)));
    if (current) return current;
    for (const key of LEGACY_PROGRESS_KEYS) {
      const migrated = normalizeState(safeJson(readStorage(key)));
      if (!migrated) continue;
      writeStorage(STORAGE_KEY, JSON.stringify(migrated));
      return migrated;
    }
    return null;
  };
  const exitDebugJumpSession = () => { debugJumpActive = false; };
  const saveProgress = () => {
    if (debugJumpActive) return false;
    state.audio = readAudioState();
    writeStorage(STORAGE_KEY, JSON.stringify(state));
    return true;
  };

  const loadConfig = () => {
    const candidate = safeJson(readStorage(CONFIG_KEY));
    config = {
      messageSpeedPercent: Math.max(50, Math.min(400, Number(candidate?.messageSpeedPercent) || 200)),
      reducedMotion: Boolean(candidate?.reducedMotion),
    };
  };
  const saveConfig = () => writeStorage(CONFIG_KEY, JSON.stringify(config));
  const syncConfig = () => {
    if (elements.messageSpeed) elements.messageSpeed.value = String(config.messageSpeedPercent);
    if (elements.messageSpeedValue) {
      const label = `${(config.messageSpeedPercent / 100).toFixed(1)}×`;
      elements.messageSpeedValue.value = label;
      elements.messageSpeedValue.textContent = label;
    }
    if (elements.reducedMotion) elements.reducedMotion.checked = config.reducedMotion;
    layer.classList.toggle("is-motion-reduced", motionReduced());
  };

  const clearTimers = () => {
    revealGeneration += 1;
    window.clearTimeout(revealTimer);
    window.cancelAnimationFrame(revealFrame);
    window.clearTimeout(autoTimer);
    window.clearTimeout(sectionSeparatorTimer);
    window.clearTimeout(temporalTransitionTimer);
    revealTimer = 0;
    revealFrame = 0;
    autoTimer = 0;
    sectionSeparatorTimer = 0;
    temporalTransitionTimer = 0;
    temporalTransitionActive = false;
  };

  const resetDialoguePagination = () => {
    dialoguePaginationGeneration += 1;
    window.clearTimeout(dialogueResizeTimer);
    dialogueResizeTimer = 0;
    dialogueSourceText = "";
    dialoguePages = [];
    dialoguePageIndex = 0;
    dialoguePageReveal = true;
    delete elements.text.dataset.characterCount;
    delete elements.text.dataset.explicitLineCount;
    delete elements.text.dataset.measuredLineCount;
    delete elements.text.dataset.maxLineCount;
    delete elements.text.dataset.pageCount;
    delete elements.text.dataset.pageIndex;
    elements.continueMark.textContent = "▼";
  };

  const dialogueTextCapacity = () => {
    const dialogueStyle = getComputedStyle(elements.dialogue);
    const verticalPadding = (Number.parseFloat(dialogueStyle.paddingTop) || 0)
      + (Number.parseFloat(dialogueStyle.paddingBottom) || 0);
    return Math.max(1, elements.dialogue.clientHeight - verticalPadding - TEXT_PAGE_HEIGHT_BUFFER_PX);
  };

  const hideSpecialSurfaces = ({ preserveSlack = false } = {}) => {
    [elements.slackSurface, elements.evidenceSurface, elements.reflectionSurface, elements.resultSurface].forEach((surface) => {
      if (preserveSlack && surface === elements.slackSurface) return;
      surface.hidden = true;
      surface.replaceChildren();
    });
    if (elements.operationsPhoneSurface) elements.operationsPhoneSurface.hidden = true;
    layer.classList.remove("is-slack", "is-evidence", "is-editorial-evidence", "is-reflection", "is-result");
  };

  const showRuntime = () => {
    hasStarted = true;
    layer.classList.remove("is-title");
    elements.titleScreen.hidden = true;
    elements.runtime.hidden = false;
    elements.restart.hidden = true;
    if (elements.fastForward) elements.fastForward.hidden = false;
    setSceneJumpAvailability(true);
    elements.saveButton.hidden = false;
    elements.loadButton.hidden = false;
  };

  const showTitle = () => {
    hasStarted = false;
    resetFastForward();
    clearScriptDebug();
    hideSpecialSurfaces();
    layer.classList.add("is-title");
    elements.titleScreen.hidden = false;
    elements.runtime.hidden = true;
    elements.restart.hidden = true;
    if (elements.fastForward) elements.fastForward.hidden = true;
    setSceneJumpAvailability(false);
    elements.saveButton.hidden = true;
    elements.loadButton.hidden = true;
    elements.resume.hidden = !getStoredProgress();
    requestAnimationFrame(() => elements.start.focus({ preventScroll: true }));
  };

  const currentStep = () => stepMap.get(state.stepId) || null;
  const currentScene = () => sceneMap.get(currentStep()?.sceneId) || null;
  const conditionMatches = (step) => !step.condition || state[step.condition.key] === step.condition.value;
  const chatDeviceForStep = (step) => {
    const cueDevice = backHalfCues.forStep(step)?.device || "";
    if (cueDevice === "mobile-campus-chat") return "mobile";
    if (cueDevice === "wide-campus-chat") return "wide";
    const sequence = Number(step?.id?.match(/_(\d{3})$/u)?.[1]);
    const ranges = CHAT_DEVICE_MOBILE_RANGES[step?.sceneId] || [];
    return Number.isInteger(sequence) && ranges.some(([start, end]) => sequence >= start && sequence <= end)
      ? "mobile"
      : "wide";
  };

  const getFollowingStepId = (step) => {
    const scene = sceneMap.get(step.sceneId);
    const localIndex = scene.steps.findIndex((candidate) => candidate.id === step.id);
    if (localIndex >= 0 && localIndex + 1 < scene.steps.length) return scene.steps[localIndex + 1].id;
    return firstStepForScene(scene.nextSceneId);
  };

  const applyBackgroundCueForStep = (step) => {
    const cue = backgroundCues.forStep(step);
    if (!cue) {
      layer.style.removeProperty("--novel-scene-background");
      delete layer.dataset.backgroundCue;
      delete layer.dataset.backgroundMotion;
      delete layer.dataset.backgroundPresentation;
      return null;
    }
    layer.style.setProperty("--novel-scene-background", `url("./${cue.assetPath}")`);
    layer.dataset.backgroundCue = cue.id;
    layer.dataset.backgroundMotion = cue.motion;
    if (cue.presentation) layer.dataset.backgroundPresentation = cue.presentation;
    else delete layer.dataset.backgroundPresentation;
    return cue;
  };

  const backgroundPresentationForStep = (step) => {
    const previousSceneId = layer.dataset.sceneId;
    const previousStepId = layer.dataset.stepId;
    const previousCue = layer.dataset.backgroundCue;
    const previousMotion = layer.dataset.backgroundMotion;
    const previousPresentation = layer.dataset.backgroundPresentation;
    const previousBackground = layer.style.getPropertyValue("--novel-scene-background");
    const previousBackgroundPriority = layer.style.getPropertyPriority("--novel-scene-background");
    try {
      layer.dataset.sceneId = step.sceneId;
      layer.dataset.stepId = step.id;
      applyBackgroundCueForStep(step);
      const computed = getComputedStyle(layer);
      return {
        image: computed.backgroundImage,
        position: computed.backgroundPosition,
        size: computed.backgroundSize,
        repeat: computed.backgroundRepeat,
      };
    } finally {
      if (previousSceneId) layer.dataset.sceneId = previousSceneId;
      else delete layer.dataset.sceneId;
      if (previousStepId) layer.dataset.stepId = previousStepId;
      else delete layer.dataset.stepId;
      if (previousCue) layer.dataset.backgroundCue = previousCue;
      else delete layer.dataset.backgroundCue;
      if (previousMotion) layer.dataset.backgroundMotion = previousMotion;
      else delete layer.dataset.backgroundMotion;
      if (previousPresentation) layer.dataset.backgroundPresentation = previousPresentation;
      else delete layer.dataset.backgroundPresentation;
      if (previousBackground) layer.style.setProperty("--novel-scene-background", previousBackground, previousBackgroundPriority);
      else layer.style.removeProperty("--novel-scene-background");
    }
  };

  const soundtrackForBackground = (backgroundImage) => BACKGROUND_SOUNDTRACK
    .find(([filename]) => String(backgroundImage).includes(filename))?.[1] || "story";

  const requestStoryTrack = (track, fadeSeconds = 0.55) => {
    if (!track || requestedStoryTrack === track) return;
    requestedStoryTrack = track;
    void window.GaiaOpeningAudio?.switchTrack?.(track, fadeSeconds);
  };

  const requestTrackForBackground = (presentation, fadeSeconds = 0.55) => {
    requestStoryTrack(soundtrackForBackground(presentation?.image), fadeSeconds);
  };

  const backgroundPreloadCache = new Map();

  const preloadBackgroundUrl = (url) => {
    if (backgroundPreloadCache.has(url)) return backgroundPreloadCache.get(url);
    const pending = new Promise((resolve) => {
      const image = new Image();
      let settled = false;
      const finish = () => {
        if (settled) return;
        settled = true;
        resolve();
      };
      image.addEventListener("load", () => {
        if (typeof image.decode === "function") image.decode().catch(() => {}).finally(finish);
        else finish();
      }, { once: true });
      image.addEventListener("error", finish, { once: true });
      image.src = url;
      if (image.complete) finish();
    });
    backgroundPreloadCache.set(url, pending);
    return pending;
  };

  const preloadBackground = async (backgroundImage) => {
    const urls = [...String(backgroundImage).matchAll(/url\((?:"([^"]+)"|'([^']+)'|([^'"\)]+))\)/g)]
      .map((match) => match[1] || match[2] || match[3])
      .filter(Boolean);
    await Promise.all(urls.map(preloadBackgroundUrl));
  };

  const warmUpcomingBackground = (step) => {
    let nextBackground = null;
    const currentPresentation = backgroundPresentationForStep(step);
    const currentIndex = stepIndexMap.get(step.id) ?? -1;
    for (let index = currentIndex + 1; index < allSteps.length; index += 1) {
      const followingPresentation = backgroundPresentationForStep(allSteps[index]);
      if (currentPresentation.image === followingPresentation.image) continue;
      nextBackground = followingPresentation.image;
      break;
    }
    if (!nextBackground) return;
    const warm = () => { void preloadBackground(nextBackground); };
    if (typeof window.requestIdleCallback === "function") window.requestIdleCallback(warm, { timeout: 1200 });
    else window.setTimeout(warm, 0);
  };

  const runBackgroundTransition = async (currentBackground, nextBackground, swapStep) => {
    if (backgroundTransitionPending) return;
    backgroundTransitionPending = true;
    try {
      await preloadBackground(nextBackground.image);
      layer.style.setProperty("--novel-transition-background", currentBackground.image);
      layer.style.setProperty("--novel-transition-background-position", currentBackground.position);
      layer.style.setProperty("--novel-transition-background-size", currentBackground.size);
      layer.style.setProperty("--novel-transition-background-repeat", currentBackground.repeat);
      layer.classList.remove("is-background-releasing");
      layer.classList.add("is-background-buffered");
      await new Promise((resolve) => requestAnimationFrame(resolve));
      return await runSceneTransition(() => {
        swapStep();
        layer.classList.add("is-background-releasing");
      }, null, "novel");
    } finally {
      backgroundTransitionPending = false;
      layer.classList.remove("is-background-buffered", "is-background-releasing");
      layer.style.removeProperty("--novel-transition-background");
      layer.style.removeProperty("--novel-transition-background-position");
      layer.style.removeProperty("--novel-transition-background-size");
      layer.style.removeProperty("--novel-transition-background-repeat");
    }
  };

  const applyOperationsPhonePresentation = (cue) => {
    const phone = cue?.phone;
    const visible = cue?.device === "portrait-operations-phone" && Boolean(phone);
    if (!elements.operationsPhoneSurface) return;
    elements.operationsPhoneSurface.hidden = !visible;
    if (!visible) return;
    elements.operationsPhoneClock.textContent = phone.clock;
    elements.operationsPhoneNoticeTime.textContent = phone.noticeTime;
    elements.operationsPhoneNoticeSender.textContent = phone.noticeSender;
    elements.operationsPhoneNoticeBody.textContent = phone.noticeBody;
    elements.operationsPhoneAudioSpeaker.textContent = phone.audioSpeaker;
    elements.operationsPhoneAudioStatus.textContent = phone.audioStatus;
  };

  const applyBackHalfCueForStep = (step) => {
    const cue = backHalfCues.forStep(step);
    const cueKeys = [
      "storyContext", "storyDate", "storyTime", "storyDayPeriod", "storyLocation",
      "storyDevice", "storyDevicePhase", "storyViewpoint", "storyCastMode", "storyAudioCue",
    ];
    if (!cue) {
      cueKeys.forEach((key) => { delete layer.dataset[key]; });
      layer.classList.remove("is-cast-suppressed", "is-central-entrance-distance");
      applyOperationsPhonePresentation(null);
      return null;
    }
    layer.dataset.storyContext = cue.temporal.context;
    layer.dataset.storyDate = cue.temporal.date;
    layer.dataset.storyTime = cue.temporal.time;
    layer.dataset.storyDayPeriod = cue.temporal.dayPeriod;
    layer.dataset.storyLocation = cue.temporal.location;
    layer.dataset.storyDevice = cue.device;
    layer.dataset.storyDevicePhase = cue.devicePhase;
    layer.dataset.storyViewpoint = cue.viewpoint;
    layer.dataset.storyCastMode = cue.castMode;
    layer.dataset.storyAudioCue = cue.audio;
    const isEventCg = layer.dataset.backgroundPresentation === "event-cg";
    layer.classList.toggle("is-cast-suppressed", isEventCg || ["archived-voice-no-cast", "remote-sakuya-no-cast", "sakuya-unseen"].includes(cue.castMode));
    layer.classList.toggle("is-central-entrance-distance", cue.castMode === "central-entrance-distance");
    applyOperationsPhonePresentation(cue);
    return cue;
  };

  const resolveVisibleStep = (stepId) => {
    let candidate = stepMap.get(stepId);
    let guard = 0;
    while (candidate?.type === "phase" && guard < allSteps.length) {
      candidate = stepMap.get(getFollowingStepId(candidate));
      guard += 1;
    }
    return candidate || null;
  };

  const moveToFollowingStep = (step = currentStep()) => {
    const rawNextStep = step ? stepMap.get(getFollowingStepId(step)) : null;
    const nextStep = resolveVisibleStep(rawNextStep?.id);
    const next = nextStep?.id || null;
    if (!next) {
      renderEnd(step);
      return;
    }
    const swapStep = () => {
      Object.entries(CHAT_CAST_MEETING_GATES).forEach(([speaker, gate]) => {
        if (step.id === gate.completedAt) state.metCharacters[speaker] = true;
      });
      state.stepId = next;
      saveProgress();
      if (step.sceneId !== nextStep?.sceneId) renderSectionSeparator(nextStep);
      else if (temporalRuntime.contextTransitionForStep(nextStep)) renderTemporalTransitionCard(nextStep);
      else renderCurrentStep();
    };
    const currentBackground = backgroundPresentationForStep(step);
    const nextBackground = backgroundPresentationForStep(nextStep);
    const backgroundChanges = currentBackground.image !== nextBackground.image;
    if (backgroundChanges && nextStep?.id === "opening_empty_seat_001") {
      deferredOpeningBackground = { stepId: nextStep.id, current: currentBackground, next: nextBackground };
      layer.dataset.openingTransitionStage = "awaiting-record";
      layer.dataset.openingCue = "record-transition";
      swapStep();
      return;
    }
    const shouldTransitionBackground = rawNextStep?.type !== "phase" && backgroundChanges;
    if (shouldTransitionBackground && !motionReduced()) {
      if (backgroundTransitionPending) return;
      return runBackgroundTransition(currentBackground, nextBackground, swapStep);
    }
    swapStep();
  };

  const updateProgress = () => {
    const index = stepIndexMap.get(state.stepId) || 0;
    elements.progress.style.width = `${Math.max(2, ((index + 1) / allSteps.length) * 100)}%`;
  };

  function renderTemporalHeading(value) {
    const title = String(value || "");
    const [temporal = "", ...locationParts] = title.split("｜");
    const unit = (text, kind) => {
      const node = document.createElement("span");
      node.className = "novel-temporal-heading-unit";
      node.dataset.temporalHeadingUnit = kind;
      node.textContent = text;
      return node;
    };
    const temporalParts = temporal.split("〜");
    const units = [unit(temporalParts.shift() || "", "time")];
    if (temporalParts.length) units.push(unit(`〜${temporalParts.join("〜")}`, "range"));
    if (locationParts.length) {
      const tail = document.createElement("span");
      tail.className = "novel-temporal-heading-tail";
      tail.append(unit("｜", "separator"), unit(locationParts.join("｜"), "location"));
      units.push(tail);
    }
    elements.location.setAttribute("aria-label", title);
    elements.location.replaceChildren(...units);
  }

  const applyTemporalPresentation = (step) => {
    const scene = sceneMap.get(step.sceneId);
    const presentation = temporalRuntime.presentationForStep(step);
    layer.dataset.temporalContext = presentation.temporalContext;
    layer.dataset.timePrecision = presentation.timePrecision;
    layer.dataset.temporalPeriod = String(presentation.isPeriod);
    layer.dataset.temporalSource = presentation.source;
    elements.modeReadout.textContent = `${scene.chapter} — ${presentation.displayTitle}`;
    renderTemporalHeading(presentation.displayTitle);
    return presentation;
  };

  function finishTemporalTransitionCard() {
    if (!temporalTransitionActive) return false;
    window.clearTimeout(temporalTransitionTimer);
    temporalTransitionTimer = 0;
    temporalTransitionActive = false;
    elements.chapterCard.hidden = true;
    const deferred = deferredOpeningBackground;
    if (deferred?.stepId === currentStep()?.id) {
      deferredOpeningBackground = null;
      requestTrackForBackground(deferred.next);
      if (motionReduced()) {
        delete layer.dataset.openingTransitionStage;
        renderCurrentStep();
      } else {
        void runBackgroundTransition(deferred.current, deferred.next, () => {
          delete layer.dataset.openingTransitionStage;
          renderCurrentStep();
        });
      }
    } else {
      renderCurrentStep();
    }
    return true;
  }

  function renderTemporalTransitionCard(step = currentStep()) {
    const transition = temporalRuntime.contextTransitionForStep(step);
    if (!step || !transition) return renderCurrentStep();
    clearTimers();
    closeLog();
    closeSourceDetails();
    showRuntime();
    syncScriptDebug(step);
    hideSpecialSurfaces();
    isRevealing = false;
    layer.dataset.sceneId = step.sceneId;
    layer.dataset.stepId = step.id;
    layer.dataset.stepType = "temporal-transition";
    applyTemporalPresentation(step);
    elements.dialogue.hidden = true;
    elements.choices.replaceChildren();
    elements.choices.classList.remove("is-visible");
    elements.sourceButton.hidden = true;
    elements.chapterIndex.textContent = `${transition.fromTemporalContext} → ${transition.toTemporalContext}`;
    renderChapterTitleUnits(transition.displayTitle);
    elements.chapterCard.dataset.transitionFrom = transition.fromTemporalContext;
    elements.chapterCard.dataset.transitionTo = transition.toTemporalContext;
    elements.chapterCard.setAttribute("role", "status");
    elements.chapterCard.setAttribute("aria-live", "polite");
    elements.chapterCard.setAttribute("aria-label", `${transition.fromTemporalContext}から${transition.toTemporalContext}へ。${transition.displayTitle}`);
    elements.chapterCard.hidden = false;
    setCharacterPresentation("chapter");
    if (isPreMeetingRecordPresentation(step)) elements.avatar.hidden = true;
    selectMode(sceneMap.get(step.sceneId)?.modeIndex);
    updateProgress();
    temporalTransitionActive = true;
    temporalTransitionTimer = window.setTimeout(
      finishTemporalTransitionCard,
      motionReduced() ? 600 : TEMPORAL_TRANSITION_MS,
    );
  }

  const selectMode = (index) => {
    if (!Number.isInteger(index)) return;
    window.dispatchEvent(new CustomEvent("gaia:select-mode", { detail: { index, source: "novel-v6" } }));
  };

  const expressionForStep = (step) => step?.speaker === "sakuya"
    ? SAKUYA_STEP_EXPRESSIONS[step.id] || "calm"
    : "calm";

  const isObjectiveOpeningRecord = (step) => step?.sceneId === "opening_empty_seat";
  const isPreMeetingRecordPresentation = (step) => (
    isObjectiveOpeningRecord(step) || step?.sceneId === "prologue_online_circle"
  );
  const openingCueForStep = (step) => {
    if (step?.id === "current_exhibition_015") return "start-ready";
    if (step?.id === "current_exhibition_016") return "terminal-focus";
    if (step?.id === "current_exhibition_017") return "material-index";
    if (isObjectiveOpeningRecord(step)) return "objective-record";
    if (step?.sceneId === "prologue_online_circle") return step.type === "chat" ? "circle-chat" : "circle-context";
    return "";
  };

  const setCharacterPresentation = (speaker, expression = "calm") => {
    const legacySpeaker = CHARACTER_VIEW[speaker] || speaker || "narrator";
    elements.cast.dataset.speaker = legacySpeaker;
    elements.avatar.dataset.speaker = legacySpeaker;
    elements.avatarGlyph.textContent = SPEAKERS[speaker]?.glyph || "◌";
    const figure = {
      sora: elements.characterSora,
      minamo: elements.characterMinamo,
      sakuya: elements.characterSakuya,
    }[legacySpeaker];
    elements.avatar.hidden = Boolean(figure);
    if (figure && figure.dataset.expression !== expression) {
      figure.classList.remove("is-changing");
      figure.dataset.expression = expression;
      requestAnimationFrame(() => figure.classList.add("is-changing"));
    }
  };

  const suppressCharacterPresentation = () => {
    setCharacterPresentation("chapter");
    elements.avatar.hidden = true;
  };

  const setSlackCastVisibility = (step) => {
    const gate = CHAT_CAST_MEETING_GATES[step?.speaker];
    const currentIndex = stepIndexMap.get(step?.id) ?? -1;
    const visibleFromIndex = gate ? (stepIndexMap.get(gate.visibleFrom) ?? Number.POSITIVE_INFINITY) : Number.POSITIVE_INFINITY;
    const visible = Boolean(gate && state.metCharacters[step.speaker] && currentIndex >= visibleFromIndex);
    elements.cast.dataset.slackCast = visible ? "visible" : "hidden";
  };

  const updateSourceDetails = (step) => {
    const kind = step.recordType || (step.type === "choice" ? "VISITOR_TRACE" : "SOURCE");
    const label = RECORD_LABELS[kind] || RECORD_LABELS.SOURCE;
    elements.dataKind.textContent = label;
    elements.dataKind.dataset.kind = kind;
    elements.signalTitle.textContent = step.type === "record" ? "記録の分類と作者を分けて表示しています。" : "物語台本に記録された場面です。";
    elements.sourcePanelKind.textContent = label;
    elements.sourcePanelKind.dataset.kind = kind;
    elements.sourcePanelTitle.textContent = label;
    elements.sourcePanelDescription.textContent = step.type === "record"
      ? "SOURCE、DERIVED、VISITOR TRACE、VISITOR POSTは、同じ作者や同じ種類の記録として扱いません。"
      : "この文章は『物語台本.md』の順序と文面を保って表示しています。";
    elements.sourcePanelRule.textContent = "色だけでなく、日本語と英語の分類ラベル、話者名、カード形状で区別します。";
    elements.sourcePanelLocation.textContent = currentScene()?.title || "GAIA SENSATION";
    elements.sourcePanelNote.textContent = "記録にないことを、本人の事実や発話へ置き換えません。";
  };

  const finishReveal = () => {
    revealGeneration += 1;
    window.clearTimeout(revealTimer);
    window.cancelAnimationFrame(revealFrame);
    revealTimer = 0;
    revealFrame = 0;
    isRevealing = false;
    elements.text.classList.remove("is-preparing", "is-revealing");
    const lines = elements.text.querySelectorAll(".novel-line");
    if (lines.length > 0) {
      elements.text.classList.add("is-revealed");
    } else {
      elements.text.textContent = fullText;
    }
    elements.cursor.hidden = true;
    elements.continueMark.classList.add("is-visible");
    scheduleAutoAdvance();
  };

  const measureNativeLines = (text) => {
    elements.text.textContent = text;
    const textNode = elements.text.firstChild;
    const glyphs = Array.from(text);
    if (!(textNode instanceof Text) || glyphs.length === 0) return [glyphs];

    const range = document.createRange();
    const lines = [];
    let lineStart = 0;
    let lineTop = null;
    let textOffset = 0;

    glyphs.forEach((glyph, index) => {
      const nextOffset = textOffset + glyph.length;
      range.setStart(textNode, textOffset);
      range.setEnd(textNode, nextOffset);
      const top = range.getBoundingClientRect().top;
      if (lineTop === null) {
        lineTop = top;
      } else if (Math.abs(top - lineTop) > 2) {
        lines.push(glyphs.slice(lineStart, index));
        lineStart = index;
        lineTop = top;
      }
      textOffset = nextOffset;
    });

    range.detach();
    lines.push(glyphs.slice(lineStart));
    return lines.filter((line) => line.length > 0);
  };

  const dialoguePageMetrics = (text) => {
    const normalized = String(text || "").replace(/\n+$/u, "");
    const measuredLines = measureNativeLines(normalized);
    const textStyle = getComputedStyle(elements.text);
    const fontSize = Number.parseFloat(textStyle.fontSize) || 16;
    const lineHeight = Number.parseFloat(textStyle.lineHeight) || fontSize * 1.6;
    const maxLines = Math.min(TEXT_PAGE_MAX_LINES, Math.max(1, Math.floor(dialogueTextCapacity() / lineHeight)));
    const estimatedCharactersPerLine = Math.max(8, Math.floor(elements.text.clientWidth / Math.max(1, fontSize * 0.92)));
    const characterBudget = Math.max(16, estimatedCharactersPerLine * maxLines);
    const characterCount = Array.from(normalized.replace(/\s/gu, "")).length;
    const renderedHeight = Math.max(elements.text.scrollHeight, measuredLines.length * lineHeight);
    const indicatorSafety = elements.continueMark.getBoundingClientRect().top - elements.text.getBoundingClientRect().bottom;
    return {
      measuredLines,
      maxLines,
      characterCount,
      characterBudget,
      indicatorSafety,
      fits: characterCount <= characterBudget
        && measuredLines.length <= maxLines
        && renderedHeight <= dialogueTextCapacity()
        && indicatorSafety >= TEXT_PAGE_INDICATOR_SAFETY_PX,
    };
  };

  const sentenceBoundaryOffset = (glyphs) => {
    const sentenceMarks = new Set(["。", "！", "？"]);
    const closingMarks = new Set(["」", "』", "】", "》", "〉", "］", "〕", "）", "”", "’", "\"", "'"]);
    let boundary = 0;
    glyphs.forEach((glyph, index) => {
      if (!sentenceMarks.has(glyph)) return;
      let next = index + 1;
      while (next < glyphs.length && closingMarks.has(glyphs[next])) next += 1;
      boundary = next;
    });
    return boundary;
  };

  const preferredPageBreak = (prefix, glyphs, maximum) => {
    const prefixGlyphs = Array.from(prefix);
    const maximumGlyphs = [...prefixGlyphs, ...glyphs.slice(0, maximum)];
    const sentenceBoundary = sentenceBoundaryOffset(maximumGlyphs);
    if (sentenceBoundary >= prefixGlyphs.length && sentenceBoundary > 0) {
      const sentenceCandidate = maximumGlyphs.slice(0, sentenceBoundary).join("").trimEnd();
      if (dialoguePageMetrics(sentenceCandidate).fits) return sentenceBoundary - prefixGlyphs.length;
    }

    const maximumText = maximumGlyphs.join("").trimEnd();
    const occupiedLineCount = dialoguePageMetrics(maximumText).measuredLines.length;
    const minimum = Math.floor(maximum * 0.58);
    for (let index = maximum - 1; index >= minimum; index -= 1) {
      if (!/[、，,；;：:\s]/u.test(glyphs[index])) continue;
      const candidate = `${prefix}${glyphs.slice(0, index + 1).join("")}`.trimEnd();
      if (dialoguePageMetrics(candidate).measuredLines.length === occupiedLineCount) return index + 1;
    }
    return maximum;
  };

  const largestFittingPrefix = (text, prefix = "") => {
    const glyphs = Array.from(text);
    let low = 1;
    let high = glyphs.length;
    let best = 0;
    while (low <= high) {
      const middle = Math.floor((low + high) / 2);
      const candidate = `${prefix}${glyphs.slice(0, middle).join("")}`.trimEnd();
      if (candidate && dialoguePageMetrics(candidate).fits) {
        best = middle;
        low = middle + 1;
      } else {
        high = middle - 1;
      }
    }
    if (!best) return 0;
    return preferredPageBreak(prefix, glyphs, best);
  };

  const paginateDialogueText = (text) => {
    const normalized = String(text || "").trim();
    if (!normalized) return [""];
    const units = normalized.match(/[^\n。！？]+(?:[。！？][」』】）》〉］〕）”’"']*)?|\n+/gu) || [normalized];
    const pages = [];
    let page = "";

    const commitPage = () => {
      const committed = page.trim();
      if (committed) pages.push(committed);
      page = "";
    };

    for (const unit of units) {
      if (/^\n+$/u.test(unit)) {
        const candidate = `${page}${unit}`;
        if (page && dialoguePageMetrics(candidate).fits) page = candidate;
        else commitPage();
        continue;
      }

      let remainder = unit;
      while (remainder) {
        const candidate = `${page}${remainder}`;
        if (dialoguePageMetrics(candidate).fits) {
          page = candidate;
          remainder = "";
          continue;
        }
        if (page) {
          const breakAt = largestFittingPrefix(remainder, page);
          if (breakAt > 0) {
            page += Array.from(remainder).slice(0, breakAt).join("");
            commitPage();
            remainder = Array.from(remainder).slice(breakAt).join("").trimStart();
            continue;
          }
          commitPage();
          continue;
        }
        const breakAt = largestFittingPrefix(remainder);
        page = Array.from(remainder).slice(0, Math.max(1, breakAt)).join("");
        commitPage();
        remainder = Array.from(remainder).slice(Math.max(1, breakAt)).join("").trimStart();
      }
    }
    commitPage();
    return pages.length ? pages : [normalized];
  };

  const isStructuredDialogueLine = (line) => /^\s*(?:[-*+>\u30fb\u2022\u25cf\u25a0\u25c6\u25c7\u25cb\u3010]|\d+[.\)\u3001\uff09]|[A-Z][.\uff1a:])/u.test(line)
    || /^\s*[^\u3002\uff01\uff1f!?\n]{1,16}[|\uff5c\uff1a:]/u.test(line)
    || /^\s*(?:\u300c[^\n]*\u300d|\u300e[^\n]*\u300f)\s*$/u.test(line);

  const semanticDialogueUnits = (text) => {
    const glyphs = Array.from(String(text || ""));
    const sentenceMarks = new Set(["\u3002", "\uff01", "\uff1f", "!", "?"]);
    const closingMarks = new Set(["\u300d", "\u300f", "\u3011", "\u3015", "\uff3d", "\uff09", ")", "\u3009", "\u300b", "\u201d", "\u2019", "\"", "'"]);
    const units = [];
    let lineStart = 0;

    const appendLine = (lineGlyphs, newlineGlyphs) => {
      const newline = newlineGlyphs.join("");
      if (!lineGlyphs.length) {
        if (newline) units.push(newline);
        return;
      }
      const line = lineGlyphs.join("");
      if (isStructuredDialogueLine(line)) {
        units.push(`${line}${newline}`);
        return;
      }
      let start = 0;
      for (let index = 0; index < lineGlyphs.length; index += 1) {
        if (!sentenceMarks.has(lineGlyphs[index])) continue;
        let end = index + 1;
        while (end < lineGlyphs.length && closingMarks.has(lineGlyphs[end])) end += 1;
        while (end < lineGlyphs.length && /[ \t\u3000]/u.test(lineGlyphs[end])) end += 1;
        units.push(lineGlyphs.slice(start, end).join(""));
        start = end;
        index = end - 1;
      }
      if (start < lineGlyphs.length) units.push(lineGlyphs.slice(start).join(""));
      if (newline) units[units.length - 1] += newline;
    };

    for (let index = 0; index <= glyphs.length; index += 1) {
      if (index < glyphs.length && glyphs[index] !== "\n") continue;
      let newlineEnd = index;
      while (newlineEnd < glyphs.length && glyphs[newlineEnd] === "\n") newlineEnd += 1;
      appendLine(glyphs.slice(lineStart, index), glyphs.slice(index, newlineEnd));
      if (newlineEnd >= glyphs.length) break;
      lineStart = newlineEnd;
      index = newlineEnd - 1;
    }
    return units.filter((unit) => unit.length > 0);
  };

  const dialogueBoundaryCandidates = (text) => {
    const glyphs = Array.from(text);
    const structuredRanges = [];
    let rangeStart = 0;
    for (let index = 0; index <= glyphs.length; index += 1) {
      if (index < glyphs.length && glyphs[index] !== "\n") continue;
      if (isStructuredDialogueLine(glyphs.slice(rangeStart, index).join(""))) structuredRanges.push({ start: rangeStart, end: index });
      rangeStart = index + 1;
    }
    const splitsStructuredLine = (offset) => structuredRanges.some((range) => offset > range.start && offset < range.end);
    const semanticOffsets = new Set();
    let semanticOffset = 0;
    semanticDialogueUnits(text).forEach((unit) => {
      semanticOffset += Array.from(unit).length;
      if (semanticOffset > 0 && semanticOffset < glyphs.length) semanticOffsets.add(semanticOffset);
    });
    const safeOffsets = new Set();
    glyphs.forEach((glyph, index) => {
      if (/[\u3001\uff0c,\u30fb\uff1a:；;\s]/u.test(glyph) && !splitsStructuredLine(index + 1)) safeOffsets.add(index + 1);
    });
    const lineOffsets = new Set();
    let lineOffset = 0;
    measureNativeLines(text).forEach((line) => {
      lineOffset += line.length;
      if (lineOffset > 0 && lineOffset < glyphs.length && !splitsStructuredLine(lineOffset)) lineOffsets.add(lineOffset);
    });
    return { glyphs, semanticOffsets, safeOffsets, lineOffsets };
  };

  const balanceDialoguePagePair = (left, right) => {
    const combined = `${left}${right}`;
    if (dialoguePageMetrics(combined).fits) return [combined];
    const { glyphs, semanticOffsets, safeOffsets, lineOffsets } = dialogueBoundaryCandidates(combined);
    const offsets = new Set([...semanticOffsets, ...safeOffsets, ...lineOffsets]);
    const candidates = [];
    offsets.forEach((offset) => {
      const before = glyphs.slice(0, offset).join("");
      const after = glyphs.slice(offset).join("");
      const beforeMetrics = dialoguePageMetrics(before);
      const afterMetrics = dialoguePageMetrics(after);
      if (!beforeMetrics.fits || !afterMetrics.fits || afterMetrics.measuredLines.length < 2) return;
      const boundaryRank = semanticOffsets.has(offset) ? 3 : safeOffsets.has(offset) ? 2 : 1;
      const score = (beforeMetrics.measuredLines.length * 10000)
        + (boundaryRank * 1000)
        - (Math.abs(beforeMetrics.measuredLines.length - afterMetrics.measuredLines.length) * 10)
        + (offset / Math.max(1, glyphs.length));
      candidates.push({ before, after, score, boundaryRank });
    });
    const safeCandidates = candidates.filter((candidate) => candidate.boundaryRank >= 2);
    const best = safeCandidates
      .reduce((winner, candidate) => (!winner || candidate.score > winner.score ? candidate : winner), null);
    return best ? [best.before, best.after] : [left, right];
  };

  const balanceDialoguePages = (inputPages) => {
    const pages = [...inputPages];
    for (let index = 1; index < pages.length;) {
      const combined = `${pages[index - 1]}${pages[index]}`;
      if (dialoguePageMetrics(combined).fits) {
        pages.splice(index - 1, 2, combined);
        index = Math.max(1, index - 1);
      } else {
        index += 1;
      }
    }
    for (let index = pages.length - 1; index > 0; index -= 1) {
      const previousMetrics = dialoguePageMetrics(pages[index - 1]);
      const currentMetrics = dialoguePageMetrics(pages[index]);
      const orphanedFinalPage = currentMetrics.measuredLines.length < 2;
      const explicitLineNeedsBalance = pages[index - 1].endsWith("\n")
        && previousMetrics.measuredLines.length < 3
        && currentMetrics.measuredLines.length > 2;
      if (!orphanedFinalPage && !explicitLineNeedsBalance) continue;
      const balanced = balanceDialoguePagePair(pages[index - 1], pages[index]);
      pages.splice(index - 1, 2, ...balanced);
    }
    return pages;
  };

  const paginateDialogueTextBalanced = (text) => {
    const normalized = String(text || "");
    if (!normalized) return [""];
    if (dialoguePageMetrics(normalized).fits) return [normalized];
    const pages = [];
    const units = semanticDialogueUnits(normalized);
    let page = "";

    const commitPage = () => {
      if (page) pages.push(page);
      page = "";
    };

    const largestSafePrefix = (value) => {
      const glyphs = Array.from(value);
      let low = 1;
      let high = glyphs.length;
      let maximum = 0;
      while (low <= high) {
        const middle = Math.floor((low + high) / 2);
        if (dialoguePageMetrics(glyphs.slice(0, middle).join("")).fits) {
          maximum = middle;
          low = middle + 1;
        } else {
          high = middle - 1;
        }
      }
      maximum = Math.max(1, maximum);
      const sentenceOffsets = new Set();
      const safeOffsets = new Set();
      const sentenceMarks = new Set(["\u3002", "\uff01", "\uff1f", "!", "?"]);
      const closingMarks = new Set(["\u300d", "\u300f", "\u3011", "\u3015", "\uff3d", "\uff09", ")", "\u3009", "\u300b", "\u201d", "\u2019", "\"", "'"]);
      glyphs.slice(0, maximum).forEach((glyph, index) => {
        if (sentenceMarks.has(glyph)) {
          let offset = index + 1;
          while (offset < maximum && closingMarks.has(glyphs[offset])) offset += 1;
          sentenceOffsets.add(offset);
        }
        if (/[\u3001\uff0c,\u30fb\uff1a:；;\s]/u.test(glyph)) safeOffsets.add(index + 1);
      });
      const fittingOffset = (offsets) => [...offsets]
        .filter((offset) => offset > 0 && offset <= maximum && dialoguePageMetrics(glyphs.slice(0, offset).join("")).fits)
        .sort((left, right) => right - left)[0];
      return fittingOffset(sentenceOffsets) || fittingOffset(safeOffsets) || maximum;
    };

    units.forEach((unit) => {
      let remainder = unit;
      while (remainder) {
        if (dialoguePageMetrics(`${page}${remainder}`).fits) {
          page += remainder;
          remainder = "";
          continue;
        }
        if (page) {
          if (dialoguePageMetrics(remainder).fits) {
            commitPage();
            page = remainder;
            remainder = "";
            continue;
          }
          commitPage();
          continue;
        }
        const breakAt = largestSafePrefix(remainder);
        page = Array.from(remainder).slice(0, breakAt).join("");
        commitPage();
        remainder = Array.from(remainder).slice(breakAt).join("");
      }
    });
    commitPage();
    const balanced = balanceDialoguePages(pages.length ? pages : [normalized]);
    return balanced.join("") === normalized ? balanced : [normalized];
  };

  const buildMeasuredLineLayout = (text) => {
    const measuredLines = measureNativeLines(text);
    const fragment = document.createDocumentFragment();
    const speedScale = 100 / config.messageSpeedPercent;
    let delay = 0;

    measuredLines.forEach((lineGlyphs) => {
      const lineText = lineGlyphs.join("");
      const line = document.createElement("span");
      const layout = document.createElement("span");
      const reveal = document.createElement("span");
      let duration = 0;

      line.className = "novel-line";
      line.setAttribute("aria-hidden", "true");
      layout.className = "novel-line-layout";
      reveal.className = "novel-line-reveal";
      layout.textContent = lineText;
      reveal.textContent = lineText;
      lineGlyphs.forEach((glyph) => {
        duration += REVEAL_BASE_MS * speedScale;
        if (/[。！？、…―]/u.test(glyph)) duration += REVEAL_PUNCTUATION_MS * speedScale;
      });
      reveal.style.setProperty("--novel-line-delay", `${delay}ms`);
      reveal.style.setProperty("--novel-line-duration", `${Math.max(duration, REVEAL_MIN_LINE_MS)}ms`);
      reveal.style.setProperty("--novel-line-steps", String(Math.max(1, lineGlyphs.length)));
      line.append(layout, reveal);
      fragment.append(line);
      delay += duration;
    });

    elements.text.replaceChildren(fragment);
    return delay;
  };

  const revealText = (text) => {
    clearTimers();
    const generation = revealGeneration;
    fullText = text;
    elements.text.setAttribute("aria-label", text);
    elements.text.classList.remove("is-preparing", "is-revealing", "is-revealed");
    elements.continueMark.classList.remove("is-visible");
    if (motionReduced() || !text) {
      elements.text.replaceChildren();
      finishReveal();
      return;
    }

    isRevealing = true;
    elements.text.textContent = text;
    elements.text.classList.add("is-preparing");
    elements.cursor.hidden = true;

    const startMeasuredReveal = () => {
      if (generation !== revealGeneration || !isRevealing) return;
      revealFrame = window.requestAnimationFrame(() => {
        revealFrame = window.requestAnimationFrame(() => {
          if (generation !== revealGeneration || !isRevealing) return;
          const duration = buildMeasuredLineLayout(text);
          elements.text.classList.remove("is-preparing");
          void elements.text.offsetWidth;
          elements.text.classList.add("is-revealing");
          elements.cursor.hidden = false;
          revealTimer = window.setTimeout(finishReveal, duration + REVEAL_MIN_LINE_MS);
        });
      });
    };

    const fontsReady = document.fonts?.ready || Promise.resolve();
    Promise.resolve(fontsReady).then(startMeasuredReveal, startMeasuredReveal);
  };

  const renderDialoguePage = () => {
    const page = (dialoguePages[dialoguePageIndex] || "").replace(/\n+$/u, "");
    const metrics = dialoguePageMetrics(page);
    elements.text.dataset.pageCount = String(dialoguePages.length);
    elements.text.dataset.pageIndex = String(dialoguePageIndex + 1);
    elements.text.dataset.measuredLineCount = String(metrics.measuredLines.length);
    elements.text.dataset.maxLineCount = String(metrics.maxLines);
    elements.continueMark.textContent = dialoguePages.length > 1
      ? `${dialoguePageIndex + 1} / ${dialoguePages.length}　▼`
      : "▼";
    if (dialoguePageReveal) {
      revealText(page);
      return;
    }
    clearTimers();
    fullText = page;
    isRevealing = false;
    elements.text.classList.remove("is-preparing", "is-revealing", "is-revealed");
    elements.text.textContent = page;
    elements.text.setAttribute("aria-label", page);
    elements.cursor.hidden = true;
    elements.continueMark.classList.add("is-visible");
    scheduleAutoAdvance();
  };

  const renderDialoguePages = (text, { reveal = true } = {}) => {
    const normalized = String(text || "");
    resetDialoguePagination();
    const paginationGeneration = dialoguePaginationGeneration;
    dialogueSourceText = normalized;
    dialoguePageReveal = reveal;
    elements.text.dataset.characterCount = String(Array.from(normalized.replace(/\s/gu, "")).length);
    elements.text.dataset.explicitLineCount = String(Math.max(1, normalized.split("\n").length));
    const renderMeasuredPages = () => {
      if (paginationGeneration !== dialoguePaginationGeneration || dialogueSourceText !== normalized) return;
      dialoguePages = paginateDialogueTextBalanced(normalized);
      elements.text.dataset.pageCount = String(dialoguePages.length);
      renderDialoguePage();
    };
    if (!document.fonts || document.fonts.status === "loaded") {
      renderMeasuredPages();
      return;
    }
    elements.text.textContent = normalized;
    elements.text.setAttribute("aria-label", normalized);
    elements.text.classList.add("is-preparing");
    elements.continueMark.classList.remove("is-visible");
    Promise.resolve(document.fonts.ready).then(renderMeasuredPages, renderMeasuredPages);
  };

  const advanceDialoguePage = () => {
    if (dialoguePageIndex + 1 >= dialoguePages.length) return false;
    dialoguePageIndex += 1;
    renderDialoguePage();
    return true;
  };

  const repaginateVisibleDialogue = () => {
    window.clearTimeout(dialogueResizeTimer);
    dialogueResizeTimer = window.setTimeout(() => {
      dialogueResizeTimer = 0;
      const step = currentStep();
      if (!isOpen || !hasStarted || !["narration", "dialogue"].includes(step?.type) || !dialogueSourceText) return;
      const generation = dialoguePaginationGeneration;
      const source = dialogueSourceText;
      const anchorOffset = dialoguePages.slice(0, dialoguePageIndex).reduce((total, page) => total + Array.from(page).length, 0);
      const apply = () => {
        if (generation !== dialoguePaginationGeneration || source !== dialogueSourceText || currentStep()?.id !== step.id) return;
        const nextPages = paginateDialogueTextBalanced(source);
        let nextIndex = 0;
        let offset = 0;
        while (nextIndex + 1 < nextPages.length && anchorOffset >= offset + Array.from(nextPages[nextIndex]).length) {
          offset += Array.from(nextPages[nextIndex]).length;
          nextIndex += 1;
        }
        dialoguePages = nextPages;
        dialoguePageIndex = nextIndex;
        dialoguePageReveal = false;
        elements.text.dataset.pageCount = String(dialoguePages.length);
        renderDialoguePage();
      };
      const fontsReady = document.fonts?.ready || Promise.resolve();
      Promise.resolve(fontsReady).then(apply, apply);
    }, 120);
  };

  function finishSectionSeparator() {
    if (!sectionSeparatorActive) return false;
    window.clearTimeout(sectionSeparatorTimer);
    sectionSeparatorTimer = 0;
    sectionSeparatorActive = false;
    elements.chapterCard.hidden = true;
    const step = currentStep();
    if (temporalRuntime.contextTransitionForStep(step)) renderTemporalTransitionCard(step);
    else renderCurrentStep();
    return true;
  }

  function renderChapterTitleUnits(value) {
    const title = String(value || "");
    const labels = title.split("｜");
    const longestLabel = labels.reduce((longest, label) => Math.max(longest, Array.from(label).length), 0);
    elements.chapterTitle.dataset.titleDensity = longestLabel >= 23
      ? "dense"
      : longestLabel >= 17
        ? "compact"
        : "regular";
    elements.chapterTitle.setAttribute("aria-label", title);
    const labelUnit = (label) => {
      const unit = document.createElement("span");
      unit.className = "novel-chapter-title-unit";
      unit.dataset.titleUnit = "label";
      unit.textContent = label;
      return unit;
    };
    const units = [labelUnit(labels.shift() || "")];
    labels.forEach((label) => {
      const tail = document.createElement("span");
      tail.className = "novel-chapter-title-tail";
      const separator = document.createElement("span");
      separator.className = "novel-chapter-title-unit is-separator";
      separator.dataset.titleUnit = "separator";
      separator.textContent = "｜";
      tail.append(separator, labelUnit(label));
      units.push(tail);
    });
    elements.chapterTitle.replaceChildren(...units);
  }

  function renderSectionSeparator(step = currentStep()) {
    if (!step) {
      clearScriptDebug();
      return;
    }
    const scene = sceneMap.get(step.sceneId);
    if (!scene) return renderCurrentStep();
    endControlFastForward();
    clearTimers();
    closeLog();
    closeSourceDetails();
    showRuntime();
    syncScriptDebug(step);
    requestTrackForBackground(backgroundPresentationForStep(step));
    hideSpecialSurfaces();
    resetDialoguePagination();
    isRevealing = false;
    layer.dataset.sceneId = step.sceneId;
    layer.dataset.stepId = step.id;
    layer.dataset.stepType = "section-separator";
    elements.dialogue.hidden = true;
    elements.choices.replaceChildren();
    elements.choices.classList.remove("is-visible");
    elements.sourceButton.hidden = true;
    elements.modeReadout.textContent = `${scene.chapter} — ${scene.title}`;
    renderTemporalHeading(scene.title);
    elements.chapterIndex.textContent = scene.chapter;
    renderChapterTitleUnits(scene.title);
    elements.chapterCard.dataset.sceneId = scene.id;
    elements.chapterCard.hidden = false;
    setCharacterPresentation("chapter");
    if (isPreMeetingRecordPresentation(step)) elements.avatar.hidden = true;
    selectMode(scene.modeIndex);
    updateProgress();
    sectionSeparatorActive = true;
    sectionSeparatorTimer = window.setTimeout(
      finishSectionSeparator,
      motionReduced() ? SECTION_SEPARATOR_REDUCED_MOTION_MS : SECTION_SEPARATOR_MS,
    );
  }
  const markRead = (step) => {
    let addedToLog = false;
    if (!["choice", "reflectionChoice", "interaction", "phase", "result", "end"].includes(step.type)
      && !state.readStepIds.includes(step.id)) {
      state.readStepIds.push(step.id);
      state.readStepIds = state.readStepIds.slice(-260);
      addedToLog = true;
    }
    if (!state.reachedSceneIds.includes(step.sceneId)) state.reachedSceneIds.push(step.sceneId);
    saveProgress();
    if (addedToLog && !elements.logPanel.hidden) renderLog();
  };

  const clearSlackSurface = () => {
    elements.slackSurface.hidden = true;
    elements.slackSurface.replaceChildren();
    delete layer.dataset.slackTerminal;
    slackScrollGuardUntil = 0;
  };

  const prepareSlackTransition = (nextStepType) => {
    window.clearTimeout(slackTransitionTimer);
    slackTransitionTimer = 0;
    if (layer.classList.contains("is-slack-exiting")) clearSlackSurface();
    const wasSlack = layer.classList.contains("is-slack");
    const entersSlack = !wasSlack && nextStepType === "chat";
    const exitsSlack = wasSlack && nextStepType !== "chat";
    layer.classList.remove("is-slack-entering", "is-slack-exiting");
    if (entersSlack) layer.classList.add("is-slack-entering");
    if (exitsSlack) layer.classList.add("is-slack-exiting");
    if (!entersSlack && !exitsSlack) return false;

    const transitionDuration = exitsSlack ? SLACK_EXIT_MS : SLACK_ENTER_MS;
    slackTransitionTimer = window.setTimeout(() => {
      if (exitsSlack) clearSlackSurface();
      layer.classList.remove("is-slack-entering", "is-slack-exiting");
      slackTransitionTimer = 0;
    }, motionReduced() ? 0 : transitionDuration);
    return exitsSlack;
  };

  const prepareStepFrame = (step) => {
    const scene = sceneMap.get(step.sceneId);
    const chatDevice = chatDeviceForStep(step);
    const preserveSlack = prepareSlackTransition(step.type);
    layer.dataset.sceneId = step.sceneId;
    layer.dataset.stepId = step.id;
    layer.dataset.stepType = step.type;
    layer.dataset.slackDevice = chatDevice;
    const openingCue = openingCueForStep(step);
    if (openingCue) layer.dataset.openingCue = openingCue;
    else delete layer.dataset.openingCue;
    if (isObjectiveOpeningRecord(step)) layer.dataset.openingPresentation = "objective-record";
    else delete layer.dataset.openingPresentation;
    delete layer.dataset.recordPresentation;
    if (step.type !== "chat") delete elements.cast.dataset.slackCast;
    applyBackgroundCueForStep(step);
    sectionSeparatorActive = false;
    showRuntime();
    warmUpcomingBackground(step);
    hideSpecialSurfaces({ preserveSlack });
    applyBackHalfCueForStep(step);
    elements.chapterCard.hidden = true;
    elements.dialogue.hidden = false;
    elements.choices.replaceChildren();
    elements.choices.classList.remove("is-visible", "is-mode08-optional");
    delete elements.choices.dataset.interactionKind;
    delete elements.choices.dataset.interactionOptional;
    elements.sourceButton.hidden = false;
    resetDialoguePagination();
    applyTemporalPresentation(step);
    selectMode(scene.modeIndex);
    updateProgress();
    updateSourceDetails(step);
    markRead(step);
  };

  const appendLines = (container, text) => {
    String(text).split("\n").forEach((line, index) => {
      if (index) container.append(document.createElement("br"));
      container.append(document.createTextNode(line));
    });
  };

  const recordTextForDisplay = (text) => {
    const normalized = String(text || "")
      .replace(/\s*\/\s*(?:LOCAL SOURCE|SOURCE|DERIVED|SCENARIO|VISITOR TRACE|CONTEXT|AUTHOR|GENERATED TEXT|RESPONSIBLE|EDITORIAL CHOICE|SAKUYA SOURCE|PUBLIC BUILD CHANGED)(?=：|$)/gm, "")
      .replace(/SOURCE RECORD または DISCLOSE DERIVATION/g, "原文を残す／生成経緯を開示する")
      .replace(/：NO(?=$|\n)/g, "：なし")
      .trim();
    const lines = normalized.split("\n");
    if (lines.length > 1 && ["観測記録", "その場の観測", "計算・解釈", "操作記録"].includes(lines[0].trim())) lines.shift();
    return lines.join("\n").trim();
  };

  const canonicalStepTextForCopy = (step) => {
    const source = String(step?.text ?? step?.prompt ?? "");
    if (!source) return "";
    if (!/<[a-z][^>]*>/iu.test(source)) return recordTextForDisplay(source);
    const template = document.createElement("template");
    template.innerHTML = source;
    return recordTextForDisplay(template.content.textContent || "");
  };

  const fallbackClipboardWrite = (text) => {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    Object.assign(textarea.style, { position: "fixed", left: "-9999px", top: "0", opacity: "0" });
    document.body.append(textarea);
    textarea.select();
    let copied = false;
    try { copied = document.execCommand("copy"); } catch { copied = false; }
    textarea.remove();
    return copied;
  };

  const setScriptCopyFeedback = (copied) => {
    clearScriptCopyFeedback();
    const debug = getScriptDebugElements();
    if (!debug.copyButton || !debug.copyStatus) return;
    debug.copyStatus.textContent = copied ? "コピー済み" : "コピー失敗";
    debug.copyButton.dataset.copyState = copied ? "copied" : "error";
    debug.copyButton.setAttribute("aria-label", copied ? "スクリプト位置をコピーしました" : "スクリプト位置をコピーできませんでした");
    scriptCopyFeedbackTimer = window.setTimeout(clearScriptCopyFeedback, 1200);
  };

  const copyCurrentScriptPosition = async () => {
    const debug = getScriptDebugElements();
    const step = currentStep();
    const expectedIndex = scriptIndexMap.get(step?.id);
    const number = debug.number?.textContent || "";
    const stepId = debug.stepId?.textContent || "";
    if (!step || !Number.isInteger(expectedIndex) || stepId !== step.id || number !== String(expectedIndex).padStart(4, "0")) {
      setScriptCopyFeedback(false);
      return false;
    }
    const header = `SCRIPT #${number}｜${stepId}`;
    const body = canonicalStepTextForCopy(step);
    const payload = body ? `${header}\n${body}` : header;
    let copied = false;
    try {
      await navigator.clipboard?.writeText?.(payload);
      copied = Boolean(navigator.clipboard?.writeText);
    } catch {
      copied = false;
    }
    if (!copied) copied = fallbackClipboardWrite(payload);
    setScriptCopyFeedback(copied);
    return copied;
  };

  const slackTimelineFor = (step) => {
    const scene = sceneMap.get(step.sceneId);
    const localIndex = scene?.steps.findIndex((candidate) => candidate.id === step.id) ?? -1;
    if (!scene || localIndex < 0) return { messages: [step], typing: null };
    const messages = scene.steps
      .slice(0, localIndex + 1)
      .filter((candidate) => candidate.type === "chat" && conditionMatches(candidate));
    const following = scene.steps[localIndex + 1];
    return { messages, typing: following?.type === "chat" && conditionMatches(following) ? following : null };
  };

  const HUMAN_SLACK_SPEAKERS = new Set(["mizuha", "amane", "sakuya"]);
  const shouldRenderSlackAvatar = (message) => (
    !HUMAN_SLACK_SPEAKERS.has(message?.speaker)
    || backHalfCues.forStep(message)?.character?.avatar !== "none"
  );

  const createSlackAttachment = (attachment) => {
    const identifier = String(attachment?.id || "").toUpperCase();
    const asset = SLACK_ATTACHMENT_ASSETS[identifier];
    const figure = document.createElement("figure");
    const status = document.createElement("p");
    figure.className = "novel-slack-attachment";
    figure.dataset.attachment = identifier;
    status.className = "novel-slack-attachment-error";
    status.setAttribute("role", "status");
    status.textContent = "画像を読み込めませんでした。";
    status.hidden = true;

    if (!asset) {
      figure.classList.add("is-error");
      status.hidden = false;
      figure.append(status);
      return figure;
    }

    const image = document.createElement("img");
    const caption = document.createElement("figcaption");
    const icon = document.createElement("span");
    const label = document.createElement("strong");
    const kind = document.createElement("small");
    image.src = asset.src;
    image.alt = attachment.description || asset.label;
    image.decoding = "async";
    image.loading = "eager";
    image.addEventListener("error", () => {
      figure.classList.add("is-error");
      status.hidden = false;
    });
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = "▣";
    label.textContent = asset.label;
    kind.textContent = "画像";
    caption.append(icon, label, kind);
    figure.append(image, status, caption);
    return figure;
  };

  const createSlackPost = (message, { root = false, current = false } = {}) => {
    const article = document.createElement("article");
    article.className = `novel-slack-post ${root ? "is-root" : "is-reply"}${current ? " is-new" : ""}`;
    article.dataset.speaker = message.speaker || "system";
    const renderAvatar = shouldRenderSlackAvatar(message);
    article.classList.toggle("is-avatarless", !renderAvatar);
    const body = document.createElement("div");
    body.className = "novel-slack-post-body";
    const meta = document.createElement("p");
    const speaker = document.createElement("strong");
    const time = document.createElement("time");
    const text = document.createElement("div");
    speaker.textContent = message.speakerLabel || SPEAKERS[message.speaker]?.name || "SYSTEM";
    time.textContent = message.time || "";
    text.className = "novel-slack-message";
    appendLines(text, message.text || "");
    meta.append(speaker, time);
    body.append(meta, text);
    if (Array.isArray(message.attachments) && message.attachments.length > 0) {
      const attachments = document.createElement("div");
      attachments.className = "novel-slack-attachments";
      message.attachments.forEach((attachment) => attachments.append(createSlackAttachment(attachment)));
      body.append(attachments);
    }
    if (renderAvatar) {
      const avatar = document.createElement("div");
      avatar.className = "novel-slack-avatar";
      avatar.setAttribute("aria-hidden", "true");
      avatar.textContent = SPEAKERS[message.speaker]?.glyph || "◌";
      article.append(avatar);
    }
    article.append(body);
    return article;
  };

  const renderSimpleStep = (step) => {
    prepareStepFrame(step);
    const speaker = step.speaker || "narrator";
    if (isPreMeetingRecordPresentation(step)) {
      suppressCharacterPresentation();
      elements.speaker.textContent = "";
    } else {
      setCharacterPresentation(speaker, expressionForStep(step));
      elements.speaker.textContent = SPEAKERS[speaker]?.name || "";
    }
    renderDialoguePages(String(step.text || "").replaceAll("{{demo_interest}}", state.demoInterest || "選んだ項目"));
  };

  const renderRichStep = (step) => {
    prepareStepFrame(step);
    clearTimers();
    isRevealing = false;
    elements.cursor.hidden = true;
    elements.continueMark.classList.add("is-visible");
    if (step.type === "chat") {
      const timeline = slackTimelineFor(step);
      const followingStep = stepMap.get(getFollowingStepId(step));
      const terminalChat = Boolean(!timeline.typing && followingStep && followingStep.sceneId !== step.sceneId);
      layer.dataset.slackTerminal = String(terminalChat);
      if (isPreMeetingRecordPresentation(step)) {
        suppressCharacterPresentation();
        elements.cast.dataset.slackCast = "hidden";
      } else {
        setCharacterPresentation(step.speaker, expressionForStep(step));
        setSlackCastVisibility(step);
      }
      elements.dialogue.hidden = false;
      elements.speaker.textContent = "学内チャット / #惑星の放課後";
      elements.text.textContent = timeline.typing ? "返信を待っています。クリックすると次の投稿へ進みます。" : "このスレッドの記録を表示しています。";
      elements.sourceButton.hidden = true;
      elements.slackSurface.hidden = false;
      layer.classList.add("is-slack");
      const workspace = document.createElement("div");
      workspace.className = "novel-slack-workspace";
      workspace.classList.toggle("is-mobile-device", layer.dataset.slackDevice === "mobile");
      workspace.dataset.device = layer.dataset.slackDevice;
      workspace.innerHTML = `<header><b><span class="novel-slack-app-name">学内チャット</span><i aria-hidden="true">◀　▶　◷</i></b><span>⌕　惑星の放課後を検索</span><i aria-hidden="true">?　◉</i></header><aside><strong>惑星の放課後</strong><small>チャンネル</small><span># general</span><span class="is-current"># 惑星の放課後</span><span># 観測メモ</span><small>ダイレクトメッセージ</small><span>● ミズハ</span><span>● アマネ</span><span>○ サクヤ</span></aside><main><header><div><strong># 惑星の放課後</strong><small>まだ名前のない変化を見つけて、記録する場所</small></div><span>♟ 3　⌕</span></header><section class="novel-slack-thread" aria-label="メッセージスレッド" aria-live="polite"></section><footer><span>＋</span><span># 惑星の放課後 へのメッセージ</span><b aria-hidden="true">Aa　☺　🎙</b></footer></main>`;
      const thread = workspace.querySelector(".novel-slack-thread");
      thread.addEventListener("scroll", () => {
        slackScrollGuardUntil = performance.now() + 220;
      }, { passive: true });
      timeline.messages.forEach((message, index) => {
        thread.append(createSlackPost(message, { root: index === 0, current: message.id === step.id }));
      });
      if (timeline.typing) {
        const typing = document.createElement("div");
        const renderAvatar = shouldRenderSlackAvatar(timeline.typing);
        typing.className = "novel-slack-typing";
        typing.classList.toggle("is-avatarless", !renderAvatar);
        typing.dataset.speaker = timeline.typing.speaker || "system";
        typing.setAttribute("role", "status");
        typing.innerHTML = `<span><b>${timeline.typing.speakerLabel || SPEAKERS[timeline.typing.speaker]?.name || "誰か"}</b> が入力しています</span><i aria-hidden="true"><b></b><b></b><b></b></i>`;
        if (renderAvatar) {
          const avatar = document.createElement("span");
          avatar.className = "novel-slack-avatar";
          avatar.setAttribute("aria-hidden", "true");
          avatar.textContent = SPEAKERS[timeline.typing.speaker]?.glyph || "◌";
          typing.prepend(avatar);
        }
        thread.append(typing);
      }
      if (terminalChat) {
        const next = document.createElement("button");
        next.type = "button";
        next.className = "novel-slack-next";
        next.setAttribute("aria-label", "次の場面へ進む");
        next.title = "次の場面へ進む";
        next.innerHTML = '<span aria-hidden="true">→</span>';
        next.addEventListener("click", (event) => {
          event.preventDefault();
          event.stopPropagation();
          if (currentStep()?.id !== step.id || backgroundTransitionPending) return;
          advance();
        });
        workspace.querySelector("main").append(next);
      }
      elements.slackSurface.append(workspace);
      requestAnimationFrame(() => { thread.scrollTop = thread.scrollHeight; });
      scheduleAutoAdvance();
      return;
    }

    if (step.type === "record") {
      const presenter = getRecordPresenter(step);
      setCharacterPresentation(presenter);
      if (presenter === "narrator") elements.avatar.hidden = true;
      elements.dialogue.hidden = false;
      elements.sourceButton.hidden = false;
      elements.speaker.textContent = presenter === "amane"
        ? "アマネの観測メモ"
        : RECORD_SPEAKER_LABELS[step.recordType] || "記録メモ";
      elements.text.classList.remove("is-preparing", "is-revealing", "is-revealed");
      const displayText = recordTextForDisplay(step.text);
      elements.text.replaceChildren();
      appendLines(elements.text, displayText);
      elements.text.setAttribute("aria-label", displayText);
      elements.cursor.hidden = true;
      elements.continueMark.classList.add("is-visible");
      scheduleAutoAdvance();
      return;
    }

    const speaker = step.speaker || "system";
    if (["current_exhibition_016", "current_exhibition_017"].includes(step.id)) {
      suppressCharacterPresentation();
    } else {
      const presentationSpeaker = step.id === "current_exhibition_015" ? "amane" : speaker;
      setCharacterPresentation(presentationSpeaker, expressionForStep(step));
    }
    elements.speaker.textContent = SPEAKERS[speaker]?.name || "GAIA SENSEWARE";
    revealText(step.text || "");
  };

  const renderGenerationDetails = (step) => {
    prepareStepFrame(step);
    clearTimers();
    setCharacterPresentation("system");
    elements.speaker.textContent = "GAIA SENSEWARE";
    elements.cursor.hidden = true;
    elements.continueMark.classList.add("is-visible");
    const details = document.createElement("details");
    details.className = "novel-generation-details";
    const summary = document.createElement("summary");
    summary.textContent = step.text;
    const list = document.createElement("dl");
    const labels = {
      referencePostCount: "参照投稿件数",
      similarPostCount: "類似投稿件数",
      candidateCount: "生成候補数",
      model: "モデル名",
      temperature: "temperature",
      seed: "seed",
      generatedAt: "生成時刻",
      exclusions: "除外範囲",
      edited: "編集の有無",
    };
    Object.entries(labels).forEach(([key, label]) => {
      const row = document.createElement("div");
      const term = document.createElement("dt");
      const value = document.createElement("dd");
      term.textContent = label;
      value.textContent = story.generationDetails[key];
      row.append(term, value);
      list.append(row);
    });
    details.append(summary, list);
    elements.text.replaceChildren(details);
  };

  const choiceStateKey = (choiceId) => ({
    observation_order: "observationOrder",
    editorial_choice: "editorialChoice",
    demo_interest: "demoInterest",
  })[choiceId];

  const renderEditorialChoice = (step) => {
    prepareStepFrame(step);
    clearTimers();
    elements.dialogue.hidden = true;
    elements.sourceButton.hidden = true;
    elements.evidenceSurface.hidden = false;
    layer.classList.add("is-evidence", "is-editorial-evidence");
    const compare = document.createElement("div");
    compare.className = "novel-evidence-compare";
    compare.innerHTML = `<article class="is-source"><header><span>観測記録 / SOURCE</span><time>02:14　SAKUYA</time></header><small>最後に届いたメッセージ</small><p>もし地球の声が聞こえたと思ったら、すぐに意味を決めるんじゃなくて――</p><footer><span>このあとに届いたメッセージ<br><b>0</b></span><span>本人の確認<br><b>受信済み原文</b></span></footer></article><article class="is-derived"><header><span>計算・解釈 / DERIVED</span><time>PRODUCTION RECORD</time></header><small>生成された制作過程</small><p>「聞こえたつもりになってない？」って、三人で確かめたい。</p><footer><span>生成実行・選定責任<br><b>MIZUHA</b></span><span>サクヤ本人の確認<br><b>なし</b></span></footer></article>`;
    const actions = document.createElement("nav");
    actions.setAttribute("aria-label", step.prompt);
    step.options.forEach((option) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = option.label.split(" / ")[0];
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        state.editorialChoice = option.value;
        state.evesRoute = state.evesRoute.filter((entry) => entry.decisionId !== step.choiceId);
        state.evesRoute.push({ decisionId: step.choiceId, value: option.value, label: option.label, stepId: step.id });
        state.evesRoute = state.evesRoute.slice(0, 2);
        saveProgress();
        renderEves();
        moveToFollowingStep(step);
      });
      actions.append(button);
    });
    elements.evidenceSurface.append(compare, actions);
    requestAnimationFrame(() => actions.querySelector("button")?.focus({ preventScroll: true }));
  };

  const renderChoice = (step) => {
    if (step.choiceId === "editorial_choice") return renderEditorialChoice(step);
    prepareStepFrame(step);
    clearTimers();
    setCharacterPresentation("visitor");
    elements.speaker.textContent = "あなたの選択";
    elements.text.textContent = step.prompt;
    elements.cursor.hidden = true;
    elements.continueMark.classList.remove("is-visible");
    elements.dataKind.textContent = "操作記録 / VISITOR TRACE";
    elements.dataKind.dataset.kind = "VISITOR_TRACE";
    step.options.forEach((option) => {
      const button = document.createElement("button");
      button.type = "button";
      const title = document.createElement("strong");
      const code = document.createElement("small");
      const parts = option.label.split(" / ");
      title.textContent = parts[0];
      if (parts.length > 1) {
        code.textContent = parts.slice(1).join(" / ");
        button.append(title, code);
      } else {
        button.append(title);
      }
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        const key = choiceStateKey(step.choiceId);
        if (key) state[key] = option.value;
        if (step.trackedByEves) {
          state.evesRoute = state.evesRoute.filter((entry) => entry.decisionId !== step.choiceId);
          state.evesRoute.push({ decisionId: step.choiceId, value: option.value, label: option.label, stepId: step.id });
          state.evesRoute = state.evesRoute.slice(0, 2);
        }
        saveProgress();
        renderEves();
        moveToFollowingStep(step);
      });
      elements.choices.append(button);
    });
    elements.choices.classList.add("is-visible");
    renderEves();
    requestAnimationFrame(() => elements.choices.querySelector("button")?.focus({ preventScroll: true }));
  };

  const scoreReflection = (ids) => {
    if (!Array.isArray(ids) || ids.length === 0) return "UNANSWERED";
    const score = { LAW: 0, NEUTRAL: 0, CHAOS: 0 };
    ids.forEach((id) => {
      const weights = reflectionOptionMap.get(id)?.weights;
      if (!weights) return;
      score.LAW += Number(weights.law) || 0;
      score.NEUTRAL += Number(weights.neutral) || 0;
      score.CHAOS += Number(weights.chaos) || 0;
    });
    const maximum = Math.max(score.LAW, score.NEUTRAL, score.CHAOS);
    const leaders = Object.keys(score).filter((key) => score[key] === maximum);
    return leaders.length === 1 ? leaders[0] : "NEUTRAL";
  };

  const renderReflectionChoice = (step) => {
    prepareStepFrame(step);
    clearTimers();
    elements.dialogue.hidden = true;
    elements.sourceButton.hidden = true;
    elements.reflectionSurface.hidden = false;
    layer.classList.add("is-reflection");

    const shell = document.createElement("div");
    shell.className = "novel-reflection-shell";
    const header = document.createElement("header");
    header.innerHTML = `<div><span>REFLECTION FIELD</span><h2>次へ渡したい姿勢を選ぶ</h2></div><p>最大3つ。選ばずに進むこともできます。</p>`;
    const grid = document.createElement("div");
    grid.className = "novel-reflection-grid";
    const status = document.createElement("p");
    status.className = "novel-reflection-status";
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");
    const proceed = document.createElement("button");
    proceed.type = "button";
    proceed.className = "novel-reflection-proceed";

    const update = (message = "") => {
      const selected = new Set(state.reflectionIds);
      grid.querySelectorAll("button").forEach((button) => {
        const active = selected.has(button.dataset.choiceId);
        button.setAttribute("aria-pressed", String(active));
        button.classList.toggle("is-selected", active);
      });
      status.textContent = message || `選択 ${selected.size} / ${step.maxSelections}`;
      proceed.textContent = selected.size ? "選んだ姿勢で進む" : "選ばずに進む";
    };

    const createOptionButton = (option) => {
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.choiceId = option.id;
      button.setAttribute("aria-pressed", "false");
      const text = document.createElement("strong");
      text.textContent = option.text;
      button.append(text);
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        const selected = new Set(state.reflectionIds);
        if (selected.has(option.id)) selected.delete(option.id);
        else if (selected.size >= step.maxSelections) {
          update(`最大${step.maxSelections}つまでです。いずれかを外してから選んでください。`);
          return;
        } else selected.add(option.id);
        state.reflectionIds = [...selected];
        state.resultTone = null;
        saveProgress();
        update();
      });
      return button;
    };

    const reflectionNumber = (option) => Number(/^R(\d{2})$/.exec(option.id)?.[1] || Number.MAX_SAFE_INTEGER);
    const orderedOptions = [...step.options].sort((left, right) => (
      reflectionNumber(left) - reflectionNumber(right)
      || String(left.id).localeCompare(String(right.id))
    ));
    grid.classList.add("is-flat");
    orderedOptions.forEach((option) => grid.append(createOptionButton(option)));

    proceed.addEventListener("click", (event) => {
      event.stopPropagation();
      state.resultTone = scoreReflection(state.reflectionIds);
      state.evesRoute = state.evesRoute.filter((entry) => entry.decisionId !== step.choiceId);
      state.evesRoute.push({
        decisionId: step.choiceId,
        value: state.reflectionIds.length ? "SELECTED" : "UNANSWERED",
        label: state.reflectionIds.length ? "観測姿勢を選ぶ" : "観測姿勢を選ばない",
        stepId: step.id,
      });
      state.evesRoute = state.evesRoute.slice(0, 2);
      saveProgress();
      renderEves();
      moveToFollowingStep(step);
    });
    const footer = document.createElement("footer");
    footer.append(status, proceed);
    shell.append(header, grid, footer);
    elements.reflectionSurface.append(shell);
    update();
    requestAnimationFrame(() => grid.querySelector("button")?.focus({ preventScroll: true }));
  };

  const detourDefinitions = Object.freeze({
    map01: {
      kicker: "MODE 01 / MAP",
      title: "長い時間の変化を見る",
      guide: "年表示を動かして長期変化を開き、地図へ触れて気温偏差の色を確認してください。",
    },
    gx: {
      kicker: "GX / DEEP TIME",
      title: "太古の海へ触れる",
      guide: "水面を三回以上なぞり、生命の活動が海と大気を変えた長い時間を確認してください。",
    },
    map03: {
      kicker: "MODE 03 / MAP",
      title: "森と雨を、場所へ戻す",
      guide: "既存の地図を動かし、森林と降水量を別々に開いてから重ねてください。重なりだけで因果は決めません。",
    },
    abstract07: {
      kicker: "MODE 07 / ABSTRACT",
      title: "届いた時刻、開いた時刻",
      guide: "既存の抽象表示へ触れ、P波とS波の到着差を確認したあと、SOURCEとDERIVEDを別々に開いてください。",
    },
    map08: {
      kicker: "MODE 08 / MAP LAYERS",
      title: "同じ場所の三つの層",
      guide: "自然環境、人の暮らし、土地の記憶を一つずつ開いてください。数値のない欄も消しません。",
    },
    space10: {
      kicker: "MODE 10 / SPACE",
      title: "地球全体から見直す",
      guide: "既存の宇宙表示で視点または対象を一度操作し、ここまで触れた記録を地球規模へつないでください。",
    },
  });

  const detourCompletion = () => {
    if (!pendingInteraction) return false;
    switch (pendingInteraction.interaction.kind) {
      case "map01": return (pendingInteraction.interaction.requiredViews || [])
        .every((view) => detourState?.views?.has(view));
      case "gx": return state.viewed.gxDeepTime;
      case "map03": return state.viewed.mode03Forest && state.viewed.mode03Rain && state.viewed.mode03Overlay;
      case "abstract07": return state.viewed.mode07AbstractPoint && state.viewed.mode07Source && state.viewed.mode07Derived;
      case "map08": return state.viewed.mode08Nature && state.viewed.mode08Life && state.viewed.mode08Memory;
      case "space10": return state.viewed.mode10SpaceOverview;
      default: return false;
    }
  };

  const detourProgressText = () => {
    if (!pendingInteraction) return "";
    const kind = pendingInteraction.interaction.kind;
    if (kind === "map01") {
      return `長期表示 ${detourState?.views?.has("long_term") ? "✓" : "○"}　気温偏差 ${detourState?.views?.has("temperature_anomaly") ? "✓" : "○"}`;
    }
    if (kind === "gx") return state.viewed.gxDeepTime ? "操作完了 / 海の変化を確認しました" : `水面の操作 ${detourState?.gestureCount || 0} / 3`;
    if (kind === "map03") return `森林 ${state.viewed.mode03Forest ? "✓" : "○"}　降水量 ${state.viewed.mode03Rain ? "✓" : "○"}　重ね合わせ ${state.viewed.mode03Overlay ? "✓" : "○"}`;
    if (kind === "abstract07") return `観測点 ${state.viewed.mode07AbstractPoint ? "✓" : "○"}　SOURCE ${state.viewed.mode07Source ? "✓" : "○"}　DERIVED ${state.viewed.mode07Derived ? "✓" : "○"}`;
    if (kind === "map08") return `自然環境 ${state.viewed.mode08Nature ? "✓" : "○"}　人の暮らし ${state.viewed.mode08Life ? "✓" : "○"}　土地の記憶 ${state.viewed.mode08Memory ? "✓" : "○"}`;
    return state.viewed.mode10SpaceOverview ? "視点操作を確認しました" : "地球を回すか、対象へ触れてください";
  };

  const addDetourControl = (label, action, pressed) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = label;
    button.setAttribute("aria-pressed", String(pressed));
    if (pressed) button.classList.add("is-complete");
    button.addEventListener("click", action);
    detourDock.querySelector(".story-detour-controls").append(button);
  };

  const updateDetourDock = () => {
    if (!pendingInteraction || !detourDock) return;
    const kind = pendingInteraction.interaction.kind;
    detourDock.querySelector(".story-detour-progress").textContent = detourProgressText();
    detourDock.querySelector("#story-detour-return").disabled = !detourCompletion();
    detourDock.querySelector(".story-detour-controls").replaceChildren();
    if (kind === "map03") {
      const controls = [
        ["森林を開く", "mode03Forest", "forest"],
        ["降水量を開く", "mode03Rain", "rain"],
        ["二つを重ねる", "mode03Overlay", "overlay"],
      ];
      controls.forEach(([label, key, layerName], index) => addDetourControl(label, () => {
        if (index === 2 && (!state.viewed.mode03Forest || !state.viewed.mode03Rain)) return;
        state.viewed[key] = true;
        window.dispatchEvent(new CustomEvent("gaia:story-mode-layer", { detail: { kind, layer: layerName } }));
        saveProgress();
        updateDetourDock();
      }, state.viewed[key]));
    } else if (kind === "abstract07") {
      addDetourControl("SOURCE｜受信 02:14", () => {
        state.viewed.mode07Source = true;
        saveProgress();
        updateDetourDock();
      }, state.viewed.mode07Source);
      addDetourControl("DERIVED｜開封 10:27 / P波→S波", () => {
        state.viewed.mode07Derived = true;
        saveProgress();
        updateDetourDock();
      }, state.viewed.mode07Derived);
    } else if (kind === "map08") {
      [
        ["自然環境", "mode08Nature", "nature"],
        ["人の暮らし", "mode08Life", "life"],
        ["土地の記憶", "mode08Memory", "memory"],
      ].forEach(([label, key, layerName]) => addDetourControl(label, () => {
        state.viewed[key] = true;
        window.dispatchEvent(new CustomEvent("gaia:story-mode-layer", { detail: { kind, layer: layerName } }));
        saveProgress();
        updateDetourDock();
      }, state.viewed[key]));
    } else if (kind === "gx" && motionReduced()) {
      addDetourControl("段階表示を進める", () => {
        detourState.gestureCount = Math.min(3, (detourState.gestureCount || 0) + 1);
        window.dispatchEvent(new CustomEvent("gaia:gx-story-key-step"));
        if (detourState.gestureCount >= 3) state.viewed.gxDeepTime = true;
        saveProgress();
        updateDetourDock();
      }, state.viewed.gxDeepTime);
    }
  };

  const detourParent = (kind) => {
    if (kind === "gx") return document.querySelector("#gx-layer");
    if (kind === "space10") return document.querySelector("#space-layer");
    if (kind === "map01" || kind === "map03" || kind === "map08") return document.querySelector("#japan-layer");
    return document.querySelector(".experience");
  };

  const setInteractionLifecycle = (phase) => {
    interactionLifecycle = phase;
    const exclusive = phase === "open" || phase === "closing";
    if (phase === "idle") {
      delete layer.dataset.interactionState;
      delete document.body.dataset.novelInteractionState;
    } else {
      layer.dataset.interactionState = phase;
      document.body.dataset.novelInteractionState = phase;
    }
    document.body.classList.toggle("novel-interaction-exclusive", exclusive);
    layer.inert = exclusive;
    if (exclusive) {
      layer.hidden = true;
      layer.setAttribute("aria-hidden", "true");
    } else if (isOpen) {
      layer.hidden = false;
      layer.setAttribute("aria-hidden", "false");
    }
  };

  const closeDetourDock = () => {
    detourDock?.remove();
    detourDock = null;
    document.body.classList.remove("novel-mode-detour");
    layer.classList.remove("is-mode-detour");
  };

  const requestDetourReturn = () => {
    if (!pendingInteraction || !detourCompletion()) return;
    const kind = pendingInteraction.interaction.kind;
    setInteractionLifecycle("closing");
    if (kind === "gx") window.GaiaGX?.close?.();
    else if (kind === "space10") window.GaiaSpace?.close?.({ returnToTop: false });
    else {
      window.dispatchEvent(new CustomEvent("gaia:story-mode-close", { detail: { kind } }));
    }
  };

  const openDetour = (step) => {
    if (pendingInteraction || interactionLifecycle !== "prep") return;
    pendingInteraction = step;
    detourState = { gestureCount: 0, views: new Set() };
    const definition = detourDefinitions[step.interaction.kind];
    closeDetourDock();
    detourDock = document.createElement("aside");
    detourDock.className = "story-detour-dock";
    detourDock.dataset.kind = step.interaction.kind;
    detourDock.innerHTML = `<header><span>${definition.kicker}</span><h2>${definition.title}</h2></header><p>${definition.guide}</p><p class="story-detour-progress" role="status" aria-live="polite"></p><div class="story-detour-controls"></div><button id="story-detour-return" type="button" disabled>操作を保存して物語へ戻る</button>`;
    detourDock.querySelector("#story-detour-return").addEventListener("click", requestDetourReturn);
    detourParent(step.interaction.kind)?.append(detourDock);
    document.body.classList.add("novel-mode-detour");
    layer.classList.add("is-mode-detour");
    updateDetourDock();
    setInteractionLifecycle("open");
    const detail = {
      kind: step.interaction.kind,
      index: Number.isInteger(step.interaction.modeIndex) ? step.interaction.modeIndex : (currentScene()?.modeIndex || 0),
      modeId: step.interaction.modeId || null,
      returnTo: "novel",
      storyMode: `v${story.storyVersion}`,
      reducedMotion: motionReduced(),
    };
    if (step.interaction.kind === "gx") {
      window.dispatchEvent(new CustomEvent("gaia:gx-open", { detail: { ...detail, phase: 0 } }));
    } else if (step.interaction.kind === "space10") {
      window.dispatchEvent(new CustomEvent("gaia:space-open-at-mode", { detail }));
    } else {
      window.dispatchEvent(new CustomEvent("gaia:story-mode-open", { detail }));
    }
    requestAnimationFrame(() => detourDock?.querySelector(".story-detour-controls button, #story-detour-return")?.focus({ preventScroll: true }));
  };

  const completePendingInteraction = () => {
    if (!pendingInteraction || !detourCompletion()) return;
    const step = pendingInteraction;
    pendingInteraction = null;
    detourState = null;
    closeDetourDock();
    setInteractionLifecycle("idle");
    saveProgress();
    moveToFollowingStep(step);
    requestAnimationFrame(() => {
      if (!elements.dialogue.hidden) elements.dialogue.focus({ preventScroll: true });
    });
  };

  const renderInteraction = (step) => {
    prepareStepFrame(step);
    clearTimers();
    setCharacterPresentation("visitor");
    elements.speaker.textContent = "INTERACTIVE DISPLAY";
    elements.text.textContent = step.text;
    elements.cursor.hidden = true;
    elements.continueMark.classList.remove("is-visible");
    setInteractionLifecycle("prep");
    const button = document.createElement("button");
    const isMode08Optional = step.type === "interaction"
      && step.interaction?.kind === "map08"
      && step.interaction?.optional === true;
    button.type = "button";
    button.className = "novel-interaction-open";
    button.textContent = isMode08Optional ? "表示モードを見る" : "既存の表示モードを開く";
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      openDetour(step);
    });
    elements.choices.append(button);
    if (isMode08Optional) {
      elements.choices.classList.add("is-mode08-optional");
      elements.choices.dataset.interactionKind = "map08";
      elements.choices.dataset.interactionOptional = "true";
      const skip = document.createElement("button");
      skip.type = "button";
      skip.className = "novel-interaction-skip";
      skip.textContent = "選ばずに進む";
      skip.addEventListener("click", (event) => {
        event.stopPropagation();
        skip.disabled = true;
        moveToFollowingStep(step);
      }, { once: true });
      elements.choices.append(skip);
    }
    elements.choices.classList.add("is-visible");
    requestAnimationFrame(() => button.focus({ preventScroll: true }));
  };

  const renderResult = (step) => {
    prepareStepFrame(step);
    clearTimers();
    state.resultTone = state.resultTone || scoreReflection(state.reflectionIds);
    saveProgress();
    elements.dialogue.hidden = true;
    elements.sourceButton.hidden = true;
    elements.resultSurface.hidden = false;
    layer.classList.add("is-result");
    const result = document.createElement("div");
    result.className = `novel-result-shell is-${state.resultTone.toLowerCase()}`;
    const content = document.createElement("article");
    const eyebrow = document.createElement("span");
    const heading = document.createElement("h2");
    const copy = document.createElement("p");
    const next = document.createElement("button");
    eyebrow.textContent = "THE RECORD REMAINS OPEN";
    heading.textContent = "地球は答えず、次の観測を待つ。";
    copy.textContent = story.resultCopy[state.resultTone];
    next.type = "button";
    next.textContent = "記録を閉じる";
    next.addEventListener("click", () => moveToFollowingStep(step));
    content.append(eyebrow, heading, copy, next);
    result.append(content);
    elements.resultSurface.append(result);
    requestAnimationFrame(() => next.focus({ preventScroll: true }));
  };

  const renderEnd = (step) => {
    prepareStepFrame(step);
    clearTimers();
    setCharacterPresentation("system");
    state.clear = true;
    state.archivesUnlocked = true;
    saveProgress();
    elements.speaker.textContent = "END OF PLAYER STORY";
    elements.cursor.hidden = true;
    elements.continueMark.classList.remove("is-visible");
    const end = document.createElement("section");
    end.className = "novel-end-v6";
    const title = document.createElement("h3");
    const copy = document.createElement("p");
    title.textContent = "STARTへ戻した端末が、次の来場者を待っています。";
    copy.textContent = "観測した現在地と選択は、この端末に保存されています。属性や得点を表示せず、選び直せる記録として残ります。";
    const archive = document.createElement("div");
    archive.className = "novel-archive-doors";
    [
      ["A", "三人が会うまで"],
      ["B", "GAIA SENSEWAREを作った一年"],
      ["C", "データと科学の補足"],
    ].forEach(([code, label]) => {
      const item = document.createElement("span");
      item.textContent = `${code}｜${label}`;
      archive.append(item);
    });
    const start = document.createElement("button");
    start.type = "button";
    start.textContent = "STARTへ戻る";
    start.addEventListener("click", () => {
      showTitle();
    });
    end.append(title, copy, archive, start);
    elements.text.replaceChildren(end);
    requestAnimationFrame(() => start.focus({ preventScroll: true }));
  };

  function renderCurrentStep() {
    clearTimers();
    closeLog();
    closeSourceDetails();
    let step = currentStep();
    let guard = 0;
    while (step && (!conditionMatches(step) || ["phase", "chatSurface"].includes(step.type)) && guard < allSteps.length) {
      state.stepId = getFollowingStepId(step);
      step = currentStep();
      guard += 1;
    }
    if (!step) {
      clearScriptDebug();
      return;
    }
    syncScriptDebug(step);
    if (!canAdvanceStep(step) && fastForwardEnabled()) stopFastForwardAtBarrier();
    saveProgress();
    if (["narration", "dialogue"].includes(step.type)) return renderSimpleStep(step);
    if (["chat", "record", "ui", "transition"].includes(step.type)) return renderRichStep(step);
    if (step.type === "details") return renderGenerationDetails(step);
    if (step.type === "choice") return renderChoice(step);
    if (step.type === "reflectionChoice") return renderReflectionChoice(step);
    if (step.type === "interaction") return renderInteraction(step);
    if (step.type === "result") return renderResult(step);
    if (step.type === "end") return renderEnd(step);
    return renderSimpleStep(step);
  }

  const canAdvanceStep = (step) => ["narration", "dialogue", "chat", "record", "ui", "transition", "details"].includes(step?.type);
  const progressionPanelsClosed = () => [elements.logPanel, elements.savePanel, elements.configPanel, elements.evesPanel, elements.sourcePanel, elements.jumpPanel]
    .every((panel) => panel.hidden);

  const updateFastForwardInterface = () => {
    const active = !fastForwardState.blocked && (fastForwardState.keyActive || fastForwardState.buttonActive);
    elements.fastForward?.setAttribute("aria-pressed", String(fastForwardState.buttonActive));
    elements.fastForward?.classList.toggle("is-active", active);
    elements.fastForward?.classList.toggle("is-control-held", active && fastForwardState.keyActive);
    if (elements.fastForwardLabel) elements.fastForwardLabel.textContent = active ? "早送り中" : "早送り";
    layer.classList.toggle("is-fast-forwarding", active);
  };

  const disableAutoForFastForward = () => {
    elements.auto.setAttribute("aria-pressed", "false");
    elements.auto.classList.remove("is-active");
    window.clearTimeout(autoTimer);
    autoTimer = 0;
  };

  const clearFastForwardTimer = () => {
    window.clearTimeout(fastForwardState.timer);
    fastForwardState.timer = 0;
  };

  const clearFastForwardHoldTimer = () => {
    window.clearTimeout(fastForwardState.holdTimer);
    fastForwardState.holdTimer = 0;
  };

  const resetFastForward = () => {
    clearFastForwardTimer();
    clearFastForwardHoldTimer();
    Object.assign(fastForwardState, {
      controlDown: false,
      keyActive: false,
      buttonActive: false,
      blocked: false,
    });
    updateFastForwardInterface();
  };

  const stopFastForwardAtBarrier = () => {
    clearFastForwardTimer();
    fastForwardState.buttonActive = false;
    fastForwardState.blocked = true;
    updateFastForwardInterface();
  };

  const fastForwardEnabled = () => !fastForwardState.blocked && (fastForwardState.keyActive || fastForwardState.buttonActive);

  const scheduleFastForward = (delay = FAST_FORWARD_STEP_MS) => {
    clearFastForwardTimer();
    if (!fastForwardEnabled()) return;
    fastForwardState.timer = window.setTimeout(() => {
      fastForwardState.timer = 0;
      if (!fastForwardEnabled()) return;
      if (backgroundTransitionPending) {
        scheduleFastForward();
        return;
      }
      if (!isOpen || !hasStarted || pendingInteraction || !progressionPanelsClosed()) {
        stopFastForwardAtBarrier();
        return;
      }
      if (!canAdvanceStep(currentStep())) {
        stopFastForwardAtBarrier();
        return;
      }
      advance();
      scheduleFastForward();
    }, delay);
  };

  const endControlFastForward = (event) => {
    if (event?.key && event.key !== "Control") return;
    fastForwardState.controlDown = false;
    clearFastForwardHoldTimer();
    fastForwardState.keyActive = false;
    fastForwardState.blocked = false;
    if (!fastForwardState.buttonActive) clearFastForwardTimer();
    updateFastForwardInterface();
  };

  const beginControlFastForward = (event) => {
    if (event.key !== "Control" || event.repeat || fastForwardState.controlDown || !isOpen || !hasStarted) return;
    if (event.target.closest?.("input, textarea, select, [contenteditable='true']")) return;
    fastForwardState.controlDown = true;
    clearFastForwardHoldTimer();
    fastForwardState.holdTimer = window.setTimeout(() => {
      fastForwardState.holdTimer = 0;
      if (!fastForwardState.controlDown || !isOpen || !hasStarted) return;
      fastForwardState.blocked = false;
      fastForwardState.keyActive = true;
      disableAutoForFastForward();
      updateFastForwardInterface();
      scheduleFastForward(0);
    }, FAST_FORWARD_HOLD_DELAY_MS);
  };

  const handleFastForwardKeyDown = (event) => {
    if (event.key === "Control") {
      beginControlFastForward(event);
      return;
    }
    if (event.ctrlKey && (fastForwardState.controlDown || fastForwardState.keyActive)) endControlFastForward();
  };

  function advance() {
    if (!isOpen || !hasStarted || pendingInteraction || backgroundTransitionPending) return;
    if (!progressionPanelsClosed()) return;
    if (finishSectionSeparator()) return;
    if (finishTemporalTransitionCard()) return;
    const step = currentStep();
    if (!canAdvanceStep(step)) return;
    if (step.type === "chat" && (layer.classList.contains("is-slack-entering") || performance.now() < slackScrollGuardUntil)) return;
    if (isRevealing) {
      finishReveal();
      return;
    }
    if (["narration", "dialogue"].includes(step.type) && advanceDialoguePage()) return;
    moveToFollowingStep(step);
  }

  function scheduleAutoAdvance() {
    window.clearTimeout(autoTimer);
    if (elements.auto.getAttribute("aria-pressed") !== "true" || !canAdvanceStep(currentStep())) return;
    autoTimer = window.setTimeout(advance, AUTO_DELAY_MS);
  }

  const startNewSession = () => {
    exitDebugJumpSession();
    state = defaultState();
    state.sessionId = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
    showRuntime();
    renderEves();
    saveProgress();
    renderSectionSeparator();
  };

  const restartStory = () => {
    exitDebugJumpSession();
    const sessionId = state.sessionId || `${Date.now().toString(36)}-restart`;
    state = defaultState();
    state.sessionId = sessionId;
    resetFastForward();
    closeConfig();
    showRuntime();
    renderEves();
    saveProgress();
    renderSectionSeparator();
  };

  const resumeStory = () => {
    exitDebugJumpSession();
    const stored = getStoredProgress();
    if (!stored) return startNewSession();
    state = stored;
    showRuntime();
    renderEves();
    renderCurrentStep();
  };

  const jumpToSceneStart = (sceneId) => {
    const entry = sceneJumpEntries.find((candidate) => candidate.sceneId === sceneId);
    const target = entry ? stepMap.get(entry.firstStepId) : null;
    if (!entry || !target) {
      console.error(`[GAIA novel] Unknown debug scene jump target: ${String(sceneId)}`);
      return false;
    }
    const targetIndex = stepIndexMap.get(target.id);
    const detourKind = pendingInteraction?.interaction?.kind;
    pendingInteraction = null;
    detourState = null;
    closeDetourDock();
    setInteractionLifecycle("idle");
    if (detourKind === "gx") window.GaiaGX?.close?.();
    else if (detourKind === "space10") window.GaiaSpace?.close?.({ returnToTop: false });
    else if (detourKind) window.dispatchEvent(new CustomEvent("gaia:story-mode-close", { detail: { kind: detourKind } }));
    resetFastForward();
    elements.auto.setAttribute("aria-pressed", "false");
    elements.auto.classList.remove("is-active");
    closeLog();
    closeManualArchive();
    closeConfig();
    closeEves();
    closeSourceDetails();
    hideSpecialSurfaces();
    clearTimers();
    window.clearTimeout(slackTransitionTimer);
    slackTransitionTimer = 0;
    layer.classList.remove("is-slack-entering", "is-slack-exiting");
    const priorReadableSteps = allSteps
      .slice(Math.max(0, targetIndex - 260), targetIndex)
      .filter((step) => step.text && !["choice", "reflectionChoice", "interaction", "result", "end"].includes(step.type))
      .map((step) => step.id);
    state = {
      ...state,
      stepId: target.id,
      reachedSceneIds: sceneJumpEntries
        .filter((candidate) => stepIndexMap.get(candidate.firstStepId) <= targetIndex)
        .map((candidate) => candidate.sceneId),
      readStepIds: priorReadableSteps,
      metCharacters: Object.fromEntries(Object.entries(CHAT_CAST_MEETING_GATES).map(([speaker, gate]) => [
        speaker,
        targetIndex >= (stepIndexMap.get(gate.visibleFrom) ?? Number.POSITIVE_INFINITY),
      ])),
    };
    debugJumpActive = true;
    closeSceneJump();
    showRuntime();
    renderEves();
    applyBackgroundCueForStep(target);
    renderSectionSeparator(target);
    return true;
  };

  const renderLog = () => {
    elements.logContent.replaceChildren();
    state.readStepIds.forEach((id) => {
      const step = stepMap.get(id);
      if (!step?.text) return;
      const article = document.createElement("article");
      const header = document.createElement("p");
      const text = document.createElement("p");
      const speaker = SPEAKERS[step.speaker]?.name || step.type.toUpperCase();
      article.dataset.stepId = id;
      article.dataset.kind = step.recordType || "SOURCE";
      article.dataset.speaker = step.speaker || "system";
      header.textContent = `${speaker || "観測記録"} / ${RECORD_LABELS[step.recordType] || step.type}`;
      text.textContent = String(step.text).replaceAll("{{demo_interest}}", state.demoInterest || "選んだ項目");
      article.append(header, text);
      elements.logContent.append(article);
    });
  };
  const logDistanceFromBottom = () => Math.max(0,
    elements.logContent.scrollHeight - elements.logContent.clientHeight - elements.logContent.scrollTop);
  const scrollLogToLatest = () => {
    elements.logContent.scrollTop = elements.logContent.scrollHeight;
    logFollowLatest = true;
  };
  elements.logContent.addEventListener("scroll", () => {
    logFollowLatest = logDistanceFromBottom() <= LOG_FOLLOW_THRESHOLD_PX;
  }, { passive: true });
  new MutationObserver(() => {
    if (elements.logPanel.hidden || !logFollowLatest) return;
    requestAnimationFrame(scrollLogToLatest);
  }).observe(elements.logContent, { childList: true });
  const closeLog = () => {
    elements.logPanel.hidden = true;
    elements.logPanel.setAttribute("aria-hidden", "true");
    elements.logButton.setAttribute("aria-expanded", "false");
  };
  const openLog = () => {
    if (!elements.logPanel.hidden) return;
    closeEves();
    closeSourceDetails();
    logFollowLatest = true;
    renderLog();
    elements.logPanel.hidden = false;
    elements.logPanel.setAttribute("aria-hidden", "false");
    elements.logButton.setAttribute("aria-expanded", "true");
    requestAnimationFrame(scrollLogToLatest);
    elements.logClose.focus({ preventScroll: true });
  };
  const toggleLog = () => {
    if (elements.logPanel.hidden) openLog();
    else closeLog();
  };

  const closeSourceDetails = ({ restoreFocus = false } = {}) => {
    elements.sourcePanel.hidden = true;
    elements.sourcePanel.setAttribute("aria-hidden", "true");
    elements.sourceButton.setAttribute("aria-expanded", "false");
    if (restoreFocus) elements.sourceButton.focus({ preventScroll: true });
  };
  const toggleSourceDetails = () => {
    if (elements.sourcePanel.hidden) {
      closeLog();
      closeEves();
      elements.sourcePanel.hidden = false;
      elements.sourcePanel.setAttribute("aria-hidden", "false");
      elements.sourceButton.setAttribute("aria-expanded", "true");
      elements.sourceClose.focus({ preventScroll: true });
    } else closeSourceDetails({ restoreFocus: true });
  };

  const evesEditorialLabel = (choice) => ({
    SOURCE_RECORD: "本人から届いた記録だけを表示",
    DISCLOSE_DERIVATION: "本人の記録と生成した部分を分けて表示",
  })[choice] || "最終画面の表示を選択前";

  const evesPostureResultLabel = (posture) => {
    if (posture !== "SELECTED") return "何も選ばずに進んだ";
    const confirmed = state.evesRoute.some((entry) => entry.decisionId === "reflection_choice" && entry.value === "SELECTED");
    return confirmed ? `姿勢を${state.reflectionIds.length}件選択` : "姿勢を1〜3件選択";
  };

  const evesProgress = () => {
    const posture = state.evesRoute.find((entry) => entry.decisionId === "reflection_choice")?.value || "";
    const count = state.editorialChoice ? (posture ? 2 : 1) : 0;
    const label = [
      "0 / 2｜まだ選択前です",
      "1 / 2｜最終画面の表示を選びました",
      "2 / 2｜二つの選択が完了しました",
    ][count];
    return { count, label, posture };
  };

  const renderEvesGraph = () => {
    const editorial = state.editorialChoice;
    const { posture } = evesProgress();
    const result = editorial && posture ? `${editorial}_${posture}` : "";
    const currentNode = result || (editorial ? "editorial_choice" : "intro");
    const visited = new Set(["intro"]);
    if (editorial) visited.add("editorial_choice");
    if (posture) visited.add("reflection_choice");
    if (result) visited.add(result);
    const resultLabels = {
      SOURCE_RECORD_SELECTED: [evesEditorialLabel("SOURCE_RECORD"), evesPostureResultLabel("SELECTED")],
      SOURCE_RECORD_UNANSWERED: [evesEditorialLabel("SOURCE_RECORD"), evesPostureResultLabel("UNANSWERED")],
      DISCLOSE_DERIVATION_SELECTED: [evesEditorialLabel("DISCLOSE_DERIVATION"), evesPostureResultLabel("SELECTED")],
      DISCLOSE_DERIVATION_UNANSWERED: [evesEditorialLabel("DISCLOSE_DERIVATION"), evesPostureResultLabel("UNANSWERED")],
    };
    const textLines = (lines, x, y, gap = 14) => lines
      .map((line, index) => `<tspan x="${x}" y="${y + (index * gap)}">${line}</tspan>`)
      .join("");
    const node = (id, x, y, width, eyebrow, lines) => {
      const current = currentNode === id;
      const labels = Array.isArray(lines) ? lines : [lines];
      const labelY = labels.length > 1 ? y + 32 : y + 39;
      return `<g class="eves-node ${visited.has(id) ? "is-visited" : ""} ${current ? "is-current" : ""}" data-node="${id}"><rect x="${x}" y="${y}" width="${width}" height="54" rx="8"></rect><text class="eves-node-eyebrow" x="${x + 12}" y="${y + 16}">${current ? "現在｜" : ""}${eyebrow}</text><text class="eves-node-label">${textLines(labels, x + 12, labelY)}</text></g>`;
    };
    const edge = (active, d, labels, x, y) => {
      const lines = Array.isArray(labels) ? labels : [labels];
      return `<g class="eves-edge ${active ? "is-active" : ""}"><path d="${d}"></path><text>${textLines(lines, x, y, 12)}</text></g>`;
    };
    elements.evesGraph.innerHTML = `<svg viewBox="0 0 1120 390" role="img" aria-label="左からプレイ開始、選択1、選択2、今回の選択結果の順です。箱は選択する場所と結果、線は選べる内容と進む順番を表します。">
      ${edge(Boolean(editorial), "M130 195 H200", "", 0, 0)}
      ${edge(editorial === "SOURCE_RECORD", "M360 185 C400 185 400 90 450 90", ["本人から届いた記録", "だけを表示"], 360, 124)}
      ${edge(editorial === "DISCLOSE_DERIVATION", "M360 205 C400 205 400 295 450 295", ["本人の記録と生成した部分を", "分けて表示"], 365, 242)}
      ${edge(Boolean(posture), "M610 90 C650 90 650 50 690 50", "1〜3件選んで進む", 610, 65)}
      ${edge(Boolean(posture), "M610 90 C650 90 650 135 690 135", "何も選ばず進む", 615, 126)}
      ${edge(Boolean(posture), "M610 295 C650 295 650 250 690 250", "1〜3件選んで進む", 610, 267)}
      ${edge(Boolean(posture), "M610 295 C650 295 650 335 690 335", "何も選ばず進む", 615, 328)}
      ${node("intro", 20, 168, 110, "開始", "プレイ開始")}
      ${node("editorial_choice", 200, 168, 160, "選択1", ["最終画面に", "何を表示するか"])}
      ${node("reflection_choice", 450, 63, 160, "選択2", ["次へ持ち帰りたい", "姿勢"])}
      ${node("reflection_choice", 450, 268, 160, "選択2", ["次へ持ち帰りたい", "姿勢"])}
      ${node("SOURCE_RECORD_SELECTED", 690, 23, 310, "今回の選択結果", resultLabels.SOURCE_RECORD_SELECTED)}
      ${node("SOURCE_RECORD_UNANSWERED", 690, 108, 310, "今回の選択結果", resultLabels.SOURCE_RECORD_UNANSWERED)}
      ${node("DISCLOSE_DERIVATION_SELECTED", 690, 223, 390, "今回の選択結果", resultLabels.DISCLOSE_DERIVATION_SELECTED)}
      ${node("DISCLOSE_DERIVATION_UNANSWERED", 690, 308, 390, "今回の選択結果", resultLabels.DISCLOSE_DERIVATION_UNANSWERED)}
    </svg>`;
  };

  const renderEves = () => {
    const { count, label, posture } = evesProgress();
    elements.evesCount.textContent = `${count} / 2`;
    elements.evesCurrent.textContent = label;
    elements.evesHistory.replaceChildren();
    if (count === 0) {
      const item = document.createElement("li");
      item.className = "is-empty";
      const span = document.createElement("span");
      const strong = document.createElement("strong");
      const small = document.createElement("small");
      span.textContent = "選択前";
      strong.textContent = "まだ選択はありません";
      small.textContent = "物語を進めると、ここに選んだ内容が表示されます。";
      item.append(span, strong, small);
      elements.evesHistory.append(item);
    } else {
      const historyEntries = [
        { decisionId: "editorial_choice" },
        ...(posture ? [{ decisionId: "reflection_choice" }] : []),
      ];
      historyEntries.forEach((entry, index) => {
        const item = document.createElement("li");
        const span = document.createElement("span");
        const strong = document.createElement("strong");
        const small = document.createElement("small");
        const editorialEntry = entry.decisionId === "editorial_choice";
        span.textContent = `選択${index + 1}`;
        strong.textContent = editorialEntry
          ? evesEditorialLabel(state.editorialChoice)
          : posture === "SELECTED"
            ? `次へ持ち帰りたい姿勢を${state.reflectionIds.length}件選んだ`
            : "何も選ばずに進んだ";
        small.textContent = editorialEntry ? "最終画面の表示" : "次へ持ち帰る姿勢";
        item.append(span, strong, small);
        elements.evesHistory.append(item);
      });
    }
    elements.evesRewind.disabled = count === 0;
    elements.evesRewindNote.textContent = count === 0
      ? "まだやり直せる選択はありません。"
      : count === 1
        ? "「最終画面の表示」の選択を取り消し、その選択画面へ戻ります。物語の既読記録は残ります。"
        : "「次へ持ち帰りたい姿勢」の選択と結果演出を取り消し、その選択画面へ戻ります。「最終画面の表示」の選択は残ります。";
    renderEvesGraph();
  };
  const closeEves = () => {
    elements.evesPanel.hidden = true;
    elements.evesPanel.setAttribute("aria-hidden", "true");
    elements.evesButton.setAttribute("aria-expanded", "false");
  };
  const toggleEves = () => {
    if (elements.evesPanel.hidden) {
      closeLog();
      closeSourceDetails();
      renderEves();
      elements.evesPanel.hidden = false;
      elements.evesPanel.setAttribute("aria-hidden", "false");
      elements.evesButton.setAttribute("aria-expanded", "true");
      elements.evesClose.focus({ preventScroll: true });
    } else closeEves();
  };
  const rewindEves = () => {
    const entry = state.evesRoute.pop();
    if (!entry) return;
    if (entry.decisionId === "reflection_choice") {
      state.reflectionIds = [];
      state.resultTone = null;
    }
    if (entry.decisionId === "editorial_choice") {
      state.editorialChoice = null;
      state.reflectionIds = [];
      state.resultTone = null;
      state.evesRoute = [];
    }
    state.stepId = entry.stepId;
    saveProgress();
    closeEves();
    renderEves();
    renderCurrentStep();
  };

  const emptySlots = () => Array.from({ length: SLOT_COUNT }, () => null);
  const getManualSaves = () => {
    let candidate = safeJson(readStorage(MANUAL_SAVE_KEY));
    if (!Array.isArray(candidate)) {
      for (const key of LEGACY_MANUAL_KEYS) {
        const legacy = safeJson(readStorage(key));
        if (!Array.isArray(legacy)) continue;
        candidate = legacy;
        break;
      }
    }
    if (!Array.isArray(candidate)) return emptySlots();
    const migrated = emptySlots().map((_, index) => {
      const saved = candidate[index];
      const progress = normalizeState(saved?.progress || saved);
      return progress ? { progress, savedAt: Number(saved.savedAt) || 0, meta: saved.meta || {} } : null;
    });
    writeStorage(MANUAL_SAVE_KEY, JSON.stringify(migrated));
    return migrated;
  };
  const writeManualSaves = (slots) => writeStorage(MANUAL_SAVE_KEY, JSON.stringify(slots));
  const renderManualSlots = () => {
    const slots = getManualSaves();
    elements.saveSlots.replaceChildren();
    slots.forEach((saved, index) => {
      const article = document.createElement("article");
      const header = document.createElement("header");
      const label = document.createElement("span");
      const time = document.createElement("time");
      const title = document.createElement("h3");
      const excerpt = document.createElement("p");
      const actions = document.createElement("footer");
      const primary = document.createElement("button");
      article.className = "novel-save-slot";
      article.dataset.empty = String(!saved);
      label.textContent = `SLOT ${String(index + 1).padStart(2, "0")}`;
      time.textContent = saved?.savedAt ? new Date(saved.savedAt).toLocaleString("ja-JP") : "EMPTY";
      title.textContent = saved?.meta?.title || "空の記録領域";
      excerpt.textContent = saved?.meta?.excerpt || "ここにはまだ物語の現在地が保存されていません。";
      header.append(label, time);
      primary.type = "button";
      primary.className = "novel-save-primary";
      if (archiveMode === "save") {
        primary.textContent = saved ? (pendingSlotAction === `save:${index}` ? "もう一度押して上書き" : "上書き保存") : "このスロットに保存";
        primary.addEventListener("click", () => saveManualSlot(index));
      } else {
        primary.textContent = saved ? "ここから再開" : "記録なし";
        primary.disabled = !saved;
        primary.addEventListener("click", () => loadManualSlot(index));
      }
      actions.append(primary);
      if (saved) {
        const remove = document.createElement("button");
        remove.type = "button";
        remove.className = "novel-save-delete";
        remove.textContent = pendingSlotAction === `delete:${index}` ? "もう一度押して消去" : "消去";
        remove.addEventListener("click", () => deleteManualSlot(index));
        actions.append(remove);
      }
      article.append(header, title, excerpt, actions);
      elements.saveSlots.append(article);
    });
  };
  const armSlotAction = (key, message) => {
    window.clearTimeout(pendingSlotTimer);
    pendingSlotAction = key;
    elements.saveStatus.textContent = message;
    renderManualSlots();
    pendingSlotTimer = window.setTimeout(() => {
      pendingSlotAction = "";
      renderManualSlots();
    }, 3200);
  };
  function saveManualSlot(index) {
    const slots = getManualSaves();
    if (slots[index] && pendingSlotAction !== `save:${index}`) {
      armSlotAction(`save:${index}`, "上書きする場合は、もう一度押してください");
      return;
    }
    pendingSlotAction = "";
    const step = currentStep();
    slots[index] = {
      progress: { ...state, audio: readAudioState() },
      savedAt: Date.now(),
      meta: {
        title: currentScene()?.title || "GAIA SENSATION",
        excerpt: String(step?.text || step?.prompt || "物語の現在地").slice(0, 120),
      },
    };
    writeManualSaves(slots);
    elements.saveStatus.textContent = `SLOT ${index + 1}へ現在地と選択を保存しました。`;
    renderManualSlots();
  }
  function deleteManualSlot(index) {
    const slots = getManualSaves();
    if (pendingSlotAction !== `delete:${index}`) {
      armSlotAction(`delete:${index}`, "消去する場合は、もう一度押してください");
      return;
    }
    slots[index] = null;
    pendingSlotAction = "";
    writeManualSaves(slots);
    renderManualSlots();
  }
  function loadManualSlot(index) {
    const saved = getManualSaves()[index];
    if (!saved) return;
    exitDebugJumpSession();
    state = saved.progress;
    closeManualArchive();
    showRuntime();
    renderEves();
    saveProgress();
    renderCurrentStep();
  }
  const setArchiveMode = (mode) => {
    archiveMode = mode === "load" || !hasStarted ? "load" : "save";
    elements.saveTitle.textContent = archiveMode.toUpperCase();
    elements.saveTab.setAttribute("aria-selected", String(archiveMode === "save"));
    elements.loadTab.setAttribute("aria-selected", String(archiveMode === "load"));
    elements.saveTab.disabled = !hasStarted;
    elements.saveStatus.textContent = archiveMode === "save" ? "現在地と選択を保存するスロットを選んでください。" : "再開する記録を選んでください。";
    renderManualSlots();
  };
  const openManualArchive = (mode) => {
    setArchiveMode(mode);
    elements.saveButton.setAttribute("aria-expanded", String(archiveMode === "save"));
    elements.loadButton.setAttribute("aria-expanded", String(archiveMode === "load"));
    elements.savePanel.hidden = false;
    elements.savePanel.setAttribute("aria-hidden", "false");
    requestAnimationFrame(() => elements.saveSlots.querySelector("button:not([disabled])")?.focus({ preventScroll: true }));
  };
  const closeManualArchive = () => {
    elements.savePanel.hidden = true;
    elements.savePanel.setAttribute("aria-hidden", "true");
    elements.saveButton.setAttribute("aria-expanded", "false");
    elements.loadButton.setAttribute("aria-expanded", "false");
  };

  const openConfig = () => {
    syncConfig();
    elements.configPanel.hidden = false;
    elements.configPanel.setAttribute("aria-hidden", "false");
    elements.configButton.setAttribute("aria-expanded", "true");
    requestAnimationFrame(() => elements.messageSpeed.focus({ preventScroll: true }));
  };
  const closeConfig = () => {
    elements.configPanel.hidden = true;
    elements.configPanel.setAttribute("aria-hidden", "true");
    elements.configButton.setAttribute("aria-expanded", "false");
  };
  function openNovel(event = null) {
    event?.preventDefault?.();
    previousFocus = document.activeElement;
    particleSystem.start();
    void window.GaiaOpeningAudio?.switchTrack?.("story");
    window.dispatchEvent(new CustomEvent("gaia:novel-open"));
    isOpen = true;
    setInteractionLifecycle("idle");
    layer.hidden = false;
    layer.setAttribute("aria-hidden", "false");
    document.body.classList.add("novel-open");
    showTitle();
    requestAnimationFrame(() => layer.classList.add("is-open"));
    if (window.location.hash !== "#story" && !/\/story\/?$/i.test(window.location.pathname)) {
      history.replaceState(null, "", "#story");
    }
  }
  function closeNovelNow() {
    clearTimers();
    resetFastForward();
    closeDetourDock();
    particleSystem.stop();
    void window.GaiaOpeningAudio?.switchTrack?.("opening");
    isOpen = false;
    setInteractionLifecycle("idle");
    clearScriptDebug();
    setSceneJumpAvailability(false);
    layer.classList.remove("is-open", "is-mode-detour");
    layer.setAttribute("aria-hidden", "true");
    document.body.classList.remove("novel-open", "novel-mode-detour");
    window.setTimeout(() => { if (!isOpen) layer.hidden = true; }, motionReduced() ? 0 : 260);
    if (window.location.hash === "#story") history.replaceState(null, "", window.location.pathname + window.location.search);
    window.dispatchEvent(new CustomEvent("gaia:return-to-intro"));
    previousFocus?.focus?.({ preventScroll: true });
  }
  const closeNovel = (event = null) => isOpen && runSceneTransition(closeNovelNow, event);

  document.querySelectorAll("[data-novel-open]").forEach((button) => {
    button.addEventListener("click", (event) => runSceneTransition(() => openNovel(event), event));
  });
  window.addEventListener("gaia:novel-open-at-mode", (event) => {
    if (event.detail?.source === "opening") {
      openNovel();
      return;
    }
    const index = Number(event.detail?.index);
    const target = scenes.find((scene) => scene.modeIndex === index && [2, 6, 7, 9].includes(index));
    exitDebugJumpSession();
    state = defaultState();
    if (target) state.stepId = target.steps[0].id;
    state.sessionId = `${Date.now().toString(36)}-entry`;
    openNovel();
    showRuntime();
    renderSectionSeparator();
  });

  window.addEventListener("gaia:gx-story-progress", (event) => {
    if (pendingInteraction?.interaction.kind !== "gx") return;
    detourState.gestureCount = Math.max(detourState.gestureCount || 0, Number(event.detail?.count) || 0);
    if (event.detail?.complete || detourState.gestureCount >= 3) state.viewed.gxDeepTime = true;
    saveProgress();
    updateDetourDock();
  });
  window.addEventListener("gaia:gx-return-to-novel", () => completePendingInteraction());
  window.addEventListener("gaia:story-mode-return-to-novel", (event) => {
    if (!pendingInteraction || event.detail?.kind !== pendingInteraction.interaction.kind) return;
    completePendingInteraction();
  });
  window.addEventListener("gaia:story-map-interaction", (event) => {
    if (!pendingInteraction) return;
    if (pendingInteraction.interaction.kind === "map01") {
      const view = String(event.detail?.view || "");
      if ((pendingInteraction.interaction.requiredViews || []).includes(view)) detourState?.views?.add(view);
    }
    updateDetourDock();
  });
  window.addEventListener("gaia:story-abstract-interaction", () => {
    if (pendingInteraction?.interaction.kind !== "abstract07") return;
    state.viewed.mode07AbstractPoint = true;
    saveProgress();
    updateDetourDock();
  });
  window.addEventListener("gaia:space-story-progress", (event) => {
    if (pendingInteraction?.interaction.kind !== "space10") return;
    if (event.detail?.complete) state.viewed.mode10SpaceOverview = true;
    saveProgress();
    updateDetourDock();
  });
  window.addEventListener("gaia:space-return-to-novel", () => completePendingInteraction());

  elements.start.addEventListener("click", startNewSession);
  elements.resume.addEventListener("click", resumeStory);
  elements.titleLoad.addEventListener("click", () => openManualArchive("load"));
  elements.close.addEventListener("click", (event) => closeNovel(event));
  elements.restart.addEventListener("click", restartStory);
  elements.logButton.addEventListener("click", toggleLog);
  elements.logClose.addEventListener("click", closeLog);
  elements.saveButton.addEventListener("click", () => openManualArchive("save"));
  elements.loadButton.addEventListener("click", () => openManualArchive("load"));
  elements.saveClose.addEventListener("click", closeManualArchive);
  elements.saveTab.addEventListener("click", () => setArchiveMode("save"));
  elements.loadTab.addEventListener("click", () => setArchiveMode("load"));
  elements.configButton.addEventListener("click", openConfig);
  elements.configClose.addEventListener("click", closeConfig);
  elements.configReset.addEventListener("click", () => {
    config = { messageSpeedPercent: 200, reducedMotion: false };
    saveConfig();
    syncConfig();
  });
  elements.messageSpeed.addEventListener("input", () => {
    config.messageSpeedPercent = Number(elements.messageSpeed.value);
    saveConfig();
    syncConfig();
  });
  elements.reducedMotion?.addEventListener("change", () => {
    config.reducedMotion = elements.reducedMotion.checked;
    saveConfig();
    syncConfig();
  });
  elements.evesButton.addEventListener("click", toggleEves);
  elements.evesClose.addEventListener("click", closeEves);
  elements.evesRewind.addEventListener("click", rewindEves);
  elements.sourceButton.addEventListener("click", (event) => {
    event.stopPropagation();
    toggleSourceDetails();
  });
  elements.sourceClose.addEventListener("click", () => closeSourceDetails({ restoreFocus: true }));
  elements.jumpButton?.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    toggleSceneJump();
  });
  elements.jumpClose?.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    closeSceneJump();
  });
  elements.jumpList?.addEventListener("click", (event) => {
    const button = event.target.closest("button.novel-jump-item[data-scene-id]");
    if (!button) return;
    event.preventDefault();
    event.stopPropagation();
    jumpToSceneStart(button.dataset.sceneId);
  });
  elements.jumpPanel?.addEventListener("pointerdown", (event) => event.stopPropagation());
  elements.jumpPanel?.addEventListener("click", (event) => event.stopPropagation());
  elements.jumpPanel?.addEventListener("wheel", (event) => {
    const list = elements.jumpList;
    if (!list || event.ctrlKey) {
      event.stopPropagation();
      return;
    }
    const maximum = Math.max(0, list.scrollHeight - list.clientHeight);
    const canScroll = maximum > 0 && (event.deltaY > 0 ? list.scrollTop < maximum : list.scrollTop > 0);
    if (canScroll) {
      event.preventDefault();
      list.scrollBy({ top: event.deltaY, behavior: "auto" });
    }
    event.stopPropagation();
  }, { passive: false });
  document.addEventListener("pointerdown", (event) => {
    if (elements.jumpPanel?.hidden || elements.jumpPanel?.contains(event.target) || elements.jumpButton?.contains(event.target)) return;
    jumpOutsidePointerBlocked = true;
    closeSceneJump();
    event.preventDefault();
    event.stopImmediatePropagation();
  }, true);
  document.addEventListener("click", (event) => {
    if (jumpOutsidePointerBlocked) {
      jumpOutsidePointerBlocked = false;
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }
    if (elements.jumpPanel?.hidden || elements.jumpPanel?.contains(event.target) || elements.jumpButton?.contains(event.target)) return;
    closeSceneJump();
    event.preventDefault();
    event.stopImmediatePropagation();
  }, true);
  const scriptCopy = getScriptDebugElements().copyButton;
  scriptCopy?.addEventListener("pointerdown", (event) => event.stopPropagation());
  scriptCopy?.addEventListener("keydown", (event) => {
    if (!["Enter", " "].includes(event.key)) return;
    event.stopPropagation();
  });
  scriptCopy?.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    void copyCurrentScriptPosition();
  });
  elements.auto.addEventListener("click", () => {
    const enabled = elements.auto.getAttribute("aria-pressed") !== "true";
    elements.auto.setAttribute("aria-pressed", String(enabled));
    elements.auto.classList.toggle("is-active", enabled);
    if (enabled) scheduleAutoAdvance();
    else window.clearTimeout(autoTimer);
  });
  elements.fastForward?.addEventListener("click", () => {
    fastForwardState.buttonActive = !fastForwardState.buttonActive;
    fastForwardState.blocked = false;
    if (fastForwardState.buttonActive) {
      disableAutoForFastForward();
      updateFastForwardInterface();
      scheduleFastForward(0);
    } else {
      if (!fastForwardState.keyActive) clearFastForwardTimer();
      updateFastForwardInterface();
    }
  });
  document.addEventListener("keydown", handleFastForwardKeyDown, true);
  document.addEventListener("keyup", endControlFastForward, true);
  window.addEventListener("blur", () => endControlFastForward());
  document.addEventListener("visibilitychange", () => endControlFastForward());
  window.addEventListener("resize", repaginateVisibleDialogue, { passive: true });
  elements.dialogue.addEventListener("click", (event) => {
    if (event.target.closest("button, textarea, input, details, summary")) return;
    event.stopPropagation();
    advance();
  });
  layer.addEventListener("click", (event) => {
    if (event.target.closest("button, a, input, select, textarea, details, summary, [role='button']")) return;
    if (layer.classList.contains("is-slack") && event.target.closest(".novel-slack-attachment, .novel-slack-workspace > header, .novel-slack-workspace > aside, .novel-slack-workspace > main > header, .novel-slack-workspace > main > footer")) return;
    advance();
  });
  layer.addEventListener("wheel", (event) => {
    if (!elements.jumpPanel?.hidden || event.target.closest?.("#novel-jump-panel")) return;
    if (event.deltaY >= 0 || event.ctrlKey || !hasStarted || elements.runtime.hidden || !elements.logPanel.hidden) return;
    if (![elements.logPanel, elements.savePanel, elements.configPanel, elements.evesPanel, elements.sourcePanel, elements.jumpPanel].every((panel) => panel.hidden)) return;
    event.preventDefault();
    event.stopPropagation();
    openLog();
  }, { passive: false });
  layer.addEventListener("keydown", (event) => {
    event.stopPropagation();
    if (event.key === "Escape") {
      event.preventDefault();
      if (!elements.jumpPanel?.hidden) closeSceneJump();
      else if (!elements.configPanel.hidden) closeConfig();
      else if (!elements.savePanel.hidden) closeManualArchive();
      else if (!elements.sourcePanel.hidden) closeSourceDetails({ restoreFocus: true });
      else if (!elements.evesPanel.hidden) closeEves();
      else if (!elements.logPanel.hidden) closeLog();
      else closeNovel();
      return;
    }
    if (!elements.jumpPanel?.hidden) return;
    if ((event.key === " " || event.key === "Enter") && !event.target.closest("button, textarea, input, summary")) {
      event.preventDefault();
      advance();
    }
    if (event.key.toLowerCase() === "l" && !event.target.closest("textarea, input")) {
      event.preventDefault();
      toggleLog();
    }
  });

  globalThis.GaiaNovel = Object.freeze({
    open: openNovel,
    close: closeNovel,
    getState: () => structuredClone(state),
    scoreReflection: (ids) => scoreReflection(ids),
    getBackgroundCue: (stepId) => {
      const step = stepMap.get(stepId);
      if (!step) return null;
      const cue = backgroundCues.forStep(step);
      return cue ? { ...cue } : null;
    },
    inspectDialoguePagination: (text) => {
      const source = String(text || "");
      const pages = paginateDialogueTextBalanced(source);
      return {
        source,
        units: semanticDialogueUnits(source).map((unit) => {
          const metrics = dialoguePageMetrics(unit);
          return {
            text: unit,
            lines: metrics.measuredLines.length,
            fits: metrics.fits,
            indicatorSafety: metrics.indicatorSafety,
          };
        }),
        pages: pages.map((page) => {
          const metrics = dialoguePageMetrics(page);
          const textRect = elements.text.getBoundingClientRect();
          const indicatorRect = elements.continueMark.getBoundingClientRect();
          return {
            text: page,
            lines: metrics.measuredLines.length,
            maxLines: metrics.maxLines,
            fits: metrics.fits,
            characters: metrics.characterCount,
            indicatorSafety: indicatorRect.top - textRect.bottom,
          };
        }),
      };
    },
    storageKey: STORAGE_KEY,
  });

  loadConfig();
  renderSceneJumpList();
  syncConfig();
  renderManualSlots();
  renderEves();
  showTitle();
  const directStoryRoute = /\/story\/?$/i.test(window.location.pathname);
  if (directStoryRoute) {
    const opening = document.querySelector("#gaia-opening");
    if (opening) opening.hidden = true;
    document.body.classList.remove("gaia-opening-active");
  }
  if (window.location.hash === "#story" || directStoryRoute) openNovel();
})();
