(() => {
  "use strict";

  const story = globalThis.GAIA_NOVEL_STORY_V6;
  const layer = document.querySelector("#novel-layer");
  if (!story || !layer) return;

  const STORAGE_KEY = "gaia_novel_save_v6";
  const MANUAL_SAVE_KEY = "gaia_novel_manual_saves_v6";
  const EVENT_KEY = "gaia_novel_event_v6";
  const CONFIG_KEY = "gaiaSensewareNovel:config:v2";
  const LEGACY_KEYS = ["gaiaSensewareNovel:v5", "gaiaSensewareNovel:manual-saves:v1"];
  const SLOT_COUNT = 6;
  const SYSTEM_REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const AUTO_DELAY_MS = 3600;
  const REVEAL_BASE_MS = 24;
  const CHARACTER_VIEW = Object.freeze({ mizuha: "minamo", amane: "sora" });
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
    VISITOR_POST: "来場者の投稿 / VISITOR POST",
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
    titleCast: layer.querySelector("#novel-title-cast"),
    titleScreen: layer.querySelector("#novel-title-screen"),
    titleNotice: layer.querySelector("#novel-title-privacy"),
    titleDetails: layer.querySelector("#novel-record-details"),
    titleStats: layer.querySelector("#novel-event-stats"),
    legacyNotice: layer.querySelector("#novel-legacy-notice"),
    runtime: layer.querySelector("#novel-runtime"),
    start: layer.querySelector("#novel-start-button"),
    resume: layer.querySelector("#novel-resume-button"),
    titleLoad: layer.querySelector("#novel-title-load-button"),
    close: layer.querySelector("#novel-close-button"),
    restart: layer.querySelector("#novel-restart-button"),
    auto: layer.querySelector("#novel-auto-button"),
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
    eventReset: layer.querySelector("#novel-event-reset"),
    eventResetStatus: layer.querySelector("#novel-event-reset-status"),
    evesButton: layer.querySelector("#novel-eves-button"),
    evesCount: layer.querySelector("#novel-eves-count"),
    evesPanel: layer.querySelector("#novel-eves-panel"),
    evesClose: layer.querySelector("#novel-eves-close"),
    evesCurrent: layer.querySelector("#novel-eves-current"),
    evesGraph: layer.querySelector("#novel-eves-graph"),
    evesHistory: layer.querySelector("#novel-eves-history"),
    evesRewind: layer.querySelector("#novel-eves-rewind"),
    modeReadout: layer.querySelector("#novel-mode-readout"),
    progress: layer.querySelector("#novel-progress-bar"),
    chapterCard: layer.querySelector("#novel-chapter-card"),
    chapterIndex: layer.querySelector("#novel-chapter-index"),
    chapterTitle: layer.querySelector("#novel-chapter-title"),
    cast: layer.querySelector("#novel-cast"),
    characterSora: layer.querySelector("#novel-character-sora"),
    characterMinamo: layer.querySelector("#novel-character-minamo"),
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
    bridge: document.querySelector("#novel-mode-bridge"),
    bridgeKicker: document.querySelector("#novel-mode-bridge-kicker"),
    bridgeTitle: document.querySelector("#novel-mode-bridge-title"),
    bridgeGuide: document.querySelector("#novel-mode-bridge-guide"),
    bridgeProgress: document.querySelector("#novel-mode-bridge-progress"),
    bridgeControls: document.querySelector("#novel-mode-bridge-controls"),
    bridgeReturn: document.querySelector("#novel-mode-bridge-return"),
  };

  const scenes = story.scenes;
  const sceneMap = new Map(scenes.map((scene) => [scene.id, scene]));
  const allSteps = scenes.flatMap((scene) => scene.steps);
  const stepMap = new Map(allSteps.map((step) => [step.id, step]));
  const stepIndexMap = new Map(allSteps.map((step, index) => [step.id, index]));
  const firstStepForScene = (sceneId) => sceneMap.get(sceneId)?.steps?.[0]?.id || null;

  const defaultState = () => ({
    storyVersion: 6,
    stepId: firstStepForScene(story.startSceneId),
    reachedSceneIds: [],
    viewed: { ...VIEWED_DEFAULTS },
    evesRoute: [],
    observationOrder: null,
    editorialChoice: null,
    visitorAction: null,
    eventActionRecorded: false,
    audio: { muted: false, volume: 0.1 },
    readStepIds: [],
    clear: false,
    archivesUnlocked: false,
    sessionId: "",
  });

  let state = defaultState();
  let sessionDraft = "";
  let isOpen = false;
  let hasStarted = false;
  let isRevealing = false;
  let fullText = "";
  let revealTimer = 0;
  let autoTimer = 0;
  let previousFocus = null;
  let archiveMode = "save";
  let pendingSlotAction = "";
  let pendingSlotTimer = 0;
  let eventResetArmed = false;
  let eventResetTimer = 0;
  let pendingInteraction = null;
  let bridgeState = null;
  let config = { messageSpeedPercent: 200, reducedMotion: false };

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
  const removeStorage = (key) => {
    try { window.localStorage.removeItem(key); } catch { /* storage can be disabled */ }
  };

  const readAudioState = () => {
    const volume = Number(document.querySelector("#gaia-audio-volume")?.value);
    const muted = document.querySelector("#gaia-audio-toggle")?.getAttribute("aria-pressed") === "true";
    return {
      muted,
      volume: Number.isFinite(volume) ? Math.max(0, Math.min(1, volume)) : state.audio.volume,
    };
  };

  const normalizeState = (candidate) => {
    if (!candidate || candidate.storyVersion !== 6 || !stepMap.has(candidate.stepId)) return null;
    const normalized = defaultState();
    normalized.stepId = candidate.stepId;
    normalized.reachedSceneIds = Array.isArray(candidate.reachedSceneIds)
      ? candidate.reachedSceneIds.filter((id) => sceneMap.has(id))
      : [];
    normalized.viewed = { ...VIEWED_DEFAULTS, ...(candidate.viewed || {}) };
    normalized.evesRoute = Array.isArray(candidate.evesRoute)
      ? candidate.evesRoute.filter((entry) => ["editorial_choice", "visitor_action"].includes(entry?.decisionId)).slice(0, 2)
      : [];
    normalized.observationOrder = ["LOCAL_FIRST", "STATION_FIRST"].includes(candidate.observationOrder)
      ? candidate.observationOrder : null;
    normalized.editorialChoice = ["SOURCE_RECORD", "DISCLOSE_DERIVATION"].includes(candidate.editorialChoice)
      ? candidate.editorialChoice : null;
    normalized.visitorAction = ["WRITE", "LEAVE_EMPTY"].includes(candidate.visitorAction)
      ? candidate.visitorAction : null;
    normalized.eventActionRecorded = Boolean(candidate.eventActionRecorded);
    normalized.audio = {
      muted: Boolean(candidate.audio?.muted),
      volume: Number.isFinite(candidate.audio?.volume) ? Math.max(0, Math.min(1, candidate.audio.volume)) : 0.1,
    };
    normalized.readStepIds = Array.isArray(candidate.readStepIds)
      ? candidate.readStepIds.filter((id) => stepMap.has(id)).slice(-260)
      : [];
    normalized.clear = Boolean(candidate.clear);
    normalized.archivesUnlocked = Boolean(candidate.archivesUnlocked);
    normalized.sessionId = typeof candidate.sessionId === "string" ? candidate.sessionId.slice(0, 80) : "";
    return normalized;
  };

  const getStoredProgress = () => normalizeState(safeJson(readStorage(STORAGE_KEY)));
  const saveProgress = () => {
    state.audio = readAudioState();
    writeStorage(STORAGE_KEY, JSON.stringify(state));
  };

  const emptyEventRecord = () => ({
    eventSessions: 0,
    eventPosts: 0,
    eventLeaveEmpty: 0,
    lastVisitorAction: null,
    markers: [],
  });
  const getEventRecord = () => {
    const candidate = safeJson(readStorage(EVENT_KEY));
    if (!candidate) return emptyEventRecord();
    return {
      eventSessions: Math.max(0, Number(candidate.eventSessions) || 0),
      eventPosts: Math.max(0, Number(candidate.eventPosts) || 0),
      eventLeaveEmpty: Math.max(0, Number(candidate.eventLeaveEmpty) || 0),
      lastVisitorAction: ["WRITE", "LEAVE_EMPTY"].includes(candidate.lastVisitorAction) ? candidate.lastVisitorAction : null,
      markers: Array.isArray(candidate.markers)
        ? candidate.markers.filter((marker) => ["WRITE", "LEAVE_EMPTY"].includes(marker)).slice(0, 24)
        : [],
    };
  };
  const saveEventRecord = (record) => writeStorage(EVENT_KEY, JSON.stringify(record));

  const renderEventStats = () => {
    if (!elements.titleStats) return;
    const record = getEventRecord();
    elements.titleStats.replaceChildren();
    const summary = document.createElement("p");
    summary.textContent = `会期中 ${record.eventSessions} セッション / WRITE ${record.eventPosts} / LEAVE EMPTY ${record.eventLeaveEmpty}`;
    const markers = document.createElement("div");
    markers.className = "novel-event-markers";
    markers.setAttribute("aria-label", "本文を含まない直近の来場者痕跡");
    record.markers.forEach((kind) => {
      const marker = document.createElement("span");
      marker.className = kind === "WRITE" ? "is-write" : "is-empty";
      marker.title = kind;
      marker.setAttribute("aria-label", kind);
      markers.append(marker);
    });
    const overflow = Math.max(0, record.eventPosts + record.eventLeaveEmpty - record.markers.length);
    if (overflow) {
      const more = document.createElement("b");
      more.textContent = `+${overflow}`;
      markers.append(more);
    }
    elements.titleStats.append(summary, markers);
  };

  const incrementSessionCount = () => {
    const record = getEventRecord();
    record.eventSessions += 1;
    saveEventRecord(record);
    renderEventStats();
  };

  const recordVisitorAction = (action) => {
    const record = getEventRecord();
    if (action === "WRITE") record.eventPosts += 1;
    if (action === "LEAVE_EMPTY") record.eventLeaveEmpty += 1;
    record.lastVisitorAction = action;
    record.markers.unshift(action);
    record.markers = record.markers.slice(0, 24);
    saveEventRecord(record);
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
    window.clearTimeout(revealTimer);
    window.clearTimeout(autoTimer);
    revealTimer = 0;
    autoTimer = 0;
  };

  const showRuntime = () => {
    hasStarted = true;
    elements.titleCast.hidden = true;
    elements.titleScreen.hidden = true;
    elements.runtime.hidden = false;
    elements.restart.hidden = false;
    elements.saveButton.hidden = false;
    elements.loadButton.hidden = false;
  };

  const showTitle = () => {
    hasStarted = false;
    elements.titleCast.hidden = false;
    elements.titleScreen.hidden = false;
    elements.runtime.hidden = true;
    elements.restart.hidden = true;
    elements.saveButton.hidden = true;
    elements.loadButton.hidden = true;
    elements.resume.hidden = !getStoredProgress();
    if (elements.legacyNotice) {
      elements.legacyNotice.hidden = !LEGACY_KEYS.some((key) => Boolean(readStorage(key)));
    }
    renderEventStats();
    requestAnimationFrame(() => elements.start.focus({ preventScroll: true }));
  };

  const currentStep = () => stepMap.get(state.stepId) || null;
  const currentScene = () => sceneMap.get(currentStep()?.sceneId) || null;
  const conditionMatches = (step) => !step.condition || state[step.condition.key] === step.condition.value;

  const getFollowingStepId = (step) => {
    const scene = sceneMap.get(step.sceneId);
    const localIndex = scene.steps.findIndex((candidate) => candidate.id === step.id);
    if (localIndex >= 0 && localIndex + 1 < scene.steps.length) return scene.steps[localIndex + 1].id;
    return firstStepForScene(scene.nextSceneId);
  };

  const moveToFollowingStep = (step = currentStep()) => {
    const next = step ? getFollowingStepId(step) : null;
    if (!next) return;
    state.stepId = next;
    saveProgress();
    renderCurrentStep();
  };

  const updateProgress = () => {
    const index = stepIndexMap.get(state.stepId) || 0;
    elements.progress.style.width = `${Math.max(2, ((index + 1) / allSteps.length) * 100)}%`;
  };

  const selectMode = (index) => {
    if (!Number.isInteger(index)) return;
    window.dispatchEvent(new CustomEvent("gaia:select-mode", { detail: { index, source: "novel-v6" } }));
  };

  const setCharacterPresentation = (speaker) => {
    const legacySpeaker = CHARACTER_VIEW[speaker] || speaker || "narrator";
    elements.cast.dataset.speaker = legacySpeaker;
    elements.avatar.dataset.speaker = legacySpeaker;
    elements.avatarGlyph.textContent = SPEAKERS[speaker]?.glyph || "◌";
    const illustrated = legacySpeaker === "sora" || legacySpeaker === "minamo";
    elements.avatar.hidden = illustrated;
    if (illustrated) {
      const figure = legacySpeaker === "sora" ? elements.characterSora : elements.characterMinamo;
      figure.dataset.expression = "calm";
    }
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
    window.clearTimeout(revealTimer);
    revealTimer = 0;
    isRevealing = false;
    elements.text.textContent = fullText;
    elements.cursor.hidden = true;
    elements.continueMark.classList.add("is-visible");
    scheduleAutoAdvance();
  };

  const revealText = (text) => {
    clearTimers();
    fullText = text;
    elements.text.replaceChildren();
    elements.text.textContent = "";
    elements.text.setAttribute("aria-label", text);
    elements.continueMark.classList.remove("is-visible");
    if (motionReduced() || !text) {
      finishReveal();
      return;
    }
    const glyphs = Array.from(text);
    const duration = Math.max(120, glyphs.length * (REVEAL_BASE_MS * 100 / config.messageSpeedPercent));
    isRevealing = true;
    elements.cursor.hidden = false;
    const started = performance.now();
    const tick = () => {
      if (!isRevealing) return;
      const progress = Math.min(1, (performance.now() - started) / duration);
      elements.text.textContent = glyphs.slice(0, Math.ceil(glyphs.length * progress)).join("");
      if (progress >= 1) finishReveal();
      else revealTimer = window.setTimeout(tick, 16);
    };
    tick();
  };

  const markRead = (step) => {
    if (!["choice", "interaction", "visitorInput", "result", "end"].includes(step.type)
      && !state.readStepIds.includes(step.id)) {
      state.readStepIds.push(step.id);
      state.readStepIds = state.readStepIds.slice(-260);
    }
    if (!state.reachedSceneIds.includes(step.sceneId)) state.reachedSceneIds.push(step.sceneId);
    saveProgress();
  };

  const prepareStepFrame = (step) => {
    const scene = sceneMap.get(step.sceneId);
    layer.dataset.sceneId = step.sceneId;
    layer.dataset.stepId = step.id;
    layer.dataset.stepType = step.type;
    showRuntime();
    elements.chapterCard.hidden = true;
    elements.dialogue.hidden = false;
    elements.choices.replaceChildren();
    elements.choices.classList.remove("is-visible");
    elements.sourceButton.hidden = false;
    elements.modeReadout.textContent = `${scene.chapter} — ${scene.title}`;
    elements.location.textContent = scene.title;
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

  const renderSimpleStep = (step) => {
    prepareStepFrame(step);
    const speaker = step.speaker || "narrator";
    setCharacterPresentation(speaker);
    elements.speaker.textContent = SPEAKERS[speaker]?.name || "";
    revealText(step.text || "");
  };

  const renderRichStep = (step) => {
    prepareStepFrame(step);
    clearTimers();
    isRevealing = false;
    elements.cursor.hidden = true;
    elements.continueMark.classList.add("is-visible");
    const speaker = step.speaker || (step.type === "record" ? "system" : "narrator");
    setCharacterPresentation(speaker);
    elements.speaker.textContent = SPEAKERS[speaker]?.name || "";
    const card = document.createElement("section");
    card.className = `novel-inline-card novel-inline-card--${step.type}`;
    if (step.recordType) card.dataset.kind = step.recordType;
    if (step.type === "chat") {
      const header = document.createElement("header");
      const time = document.createElement("time");
      const name = document.createElement("strong");
      time.textContent = step.time;
      name.textContent = step.speakerLabel;
      header.append(time, name);
      card.append(header);
    } else if (step.type === "record") {
      const label = document.createElement("strong");
      label.className = "novel-record-label";
      label.textContent = RECORD_LABELS[step.recordType] || step.recordType;
      card.append(label);
    }
    const body = document.createElement("p");
    appendLines(body, step.text || "");
    card.append(body);
    elements.text.replaceChildren(card);
    scheduleAutoAdvance();
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
    visitor_action: "visitorAction",
  })[choiceId];

  const renderChoice = (step) => {
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
      code.textContent = parts.slice(1).join(" / ") || option.value;
      button.append(title, code);
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        const key = choiceStateKey(step.choiceId);
        if (step.choiceId === "visitor_action" && option.value === "WRITE" && !sessionDraft.trim()) {
          const hint = document.createElement("p");
          hint.className = "novel-input-error";
          hint.textContent = "WRITEを選ぶ場合は、現在の自分の記録を一行入力してください。";
          elements.choices.prepend(hint);
          const inputStep = sceneMap.get("epilogue_visitor_field")?.steps.find((candidate) => candidate.type === "visitorInput");
          if (inputStep) {
            state.stepId = inputStep.id;
            saveProgress();
            renderCurrentStep();
          }
          return;
        }
        if (key) state[key] = option.value;
        if (option.value === "LEAVE_EMPTY") sessionDraft = "";
        if (step.trackedByEves) {
          state.evesRoute = state.evesRoute.filter((entry) => entry.decisionId !== step.choiceId);
          state.evesRoute.push({ decisionId: step.choiceId, value: option.value, label: option.label, stepId: step.id });
          state.evesRoute = state.evesRoute.slice(0, 2);
        }
        if (step.choiceId === "visitor_action" && !state.eventActionRecorded) {
          recordVisitorAction(option.value);
          state.eventActionRecorded = true;
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

  const bridgeDefinitions = Object.freeze({
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

  const bridgeCompletion = () => {
    if (!pendingInteraction) return false;
    switch (pendingInteraction.interaction.kind) {
      case "gx": return state.viewed.gxDeepTime;
      case "map03": return state.viewed.mode03Forest && state.viewed.mode03Rain && state.viewed.mode03Overlay;
      case "abstract07": return state.viewed.mode07AbstractPoint && state.viewed.mode07Source && state.viewed.mode07Derived;
      case "map08": return state.viewed.mode08Nature && state.viewed.mode08Life && state.viewed.mode08Memory;
      case "space10": return state.viewed.mode10SpaceOverview;
      default: return false;
    }
  };

  const bridgeProgressText = () => {
    if (!pendingInteraction) return "";
    const kind = pendingInteraction.interaction.kind;
    if (kind === "gx") return state.viewed.gxDeepTime ? "操作完了 / 海の変化を確認しました" : `水面の操作 ${bridgeState?.gestureCount || 0} / 3`;
    if (kind === "map03") return `森林 ${state.viewed.mode03Forest ? "✓" : "○"}　降水量 ${state.viewed.mode03Rain ? "✓" : "○"}　重ね合わせ ${state.viewed.mode03Overlay ? "✓" : "○"}`;
    if (kind === "abstract07") return `観測点 ${state.viewed.mode07AbstractPoint ? "✓" : "○"}　SOURCE ${state.viewed.mode07Source ? "✓" : "○"}　DERIVED ${state.viewed.mode07Derived ? "✓" : "○"}`;
    if (kind === "map08") return `自然環境 ${state.viewed.mode08Nature ? "✓" : "○"}　人の暮らし ${state.viewed.mode08Life ? "✓" : "○"}　土地の記憶 ${state.viewed.mode08Memory ? "✓" : "○"}`;
    return state.viewed.mode10SpaceOverview ? "視点操作を確認しました" : "地球を回すか、対象へ触れてください";
  };

  const addBridgeControl = (label, action, pressed) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = label;
    button.setAttribute("aria-pressed", String(pressed));
    if (pressed) button.classList.add("is-complete");
    button.addEventListener("click", action);
    elements.bridgeControls.append(button);
  };

  const updateBridge = () => {
    if (!pendingInteraction || !elements.bridge) return;
    const kind = pendingInteraction.interaction.kind;
    elements.bridgeProgress.textContent = bridgeProgressText();
    elements.bridgeReturn.disabled = !bridgeCompletion();
    elements.bridgeControls.replaceChildren();
    if (kind === "map03") {
      const controls = [
        ["森林を開く", "mode03Forest", "forest"],
        ["降水量を開く", "mode03Rain", "rain"],
        ["二つを重ねる", "mode03Overlay", "overlay"],
      ];
      controls.forEach(([label, key, layerName], index) => addBridgeControl(label, () => {
        if (index === 2 && (!state.viewed.mode03Forest || !state.viewed.mode03Rain)) return;
        state.viewed[key] = true;
        window.dispatchEvent(new CustomEvent("gaia:story-mode-layer", { detail: { kind, layer: layerName } }));
        saveProgress();
        updateBridge();
      }, state.viewed[key]));
    } else if (kind === "abstract07") {
      addBridgeControl("SOURCE｜受信 02:14", () => {
        state.viewed.mode07Source = true;
        saveProgress();
        updateBridge();
      }, state.viewed.mode07Source);
      addBridgeControl("DERIVED｜開封 10:27 / P波→S波", () => {
        state.viewed.mode07Derived = true;
        saveProgress();
        updateBridge();
      }, state.viewed.mode07Derived);
    } else if (kind === "map08") {
      [
        ["自然環境", "mode08Nature", "nature"],
        ["人の暮らし", "mode08Life", "life"],
        ["土地の記憶", "mode08Memory", "memory"],
      ].forEach(([label, key, layerName]) => addBridgeControl(label, () => {
        state.viewed[key] = true;
        window.dispatchEvent(new CustomEvent("gaia:story-mode-layer", { detail: { kind, layer: layerName } }));
        saveProgress();
        updateBridge();
      }, state.viewed[key]));
    } else if (kind === "gx" && motionReduced()) {
      addBridgeControl("段階表示を進める", () => {
        bridgeState.gestureCount = Math.min(3, (bridgeState.gestureCount || 0) + 1);
        window.dispatchEvent(new CustomEvent("gaia:gx-story-key-step"));
        if (bridgeState.gestureCount >= 3) state.viewed.gxDeepTime = true;
        saveProgress();
        updateBridge();
      }, state.viewed.gxDeepTime);
    }
  };

  const openBridge = (step) => {
    pendingInteraction = step;
    bridgeState = { gestureCount: 0 };
    const definition = bridgeDefinitions[step.interaction.kind];
    elements.bridgeKicker.textContent = definition.kicker;
    elements.bridgeTitle.textContent = definition.title;
    elements.bridgeGuide.textContent = definition.guide;
    elements.bridge.hidden = false;
    elements.bridge.setAttribute("aria-hidden", "false");
    document.body.classList.add("novel-mode-detour");
    layer.classList.add("is-mode-detour");
    updateBridge();
    const detail = {
      kind: step.interaction.kind,
      index: currentScene()?.modeIndex || 0,
      returnTo: "novel",
      storyMode: "v6",
      reducedMotion: motionReduced(),
    };
    if (step.interaction.kind === "gx") {
      window.dispatchEvent(new CustomEvent("gaia:gx-open", { detail: { ...detail, phase: 0 } }));
    } else if (step.interaction.kind === "space10") {
      window.dispatchEvent(new CustomEvent("gaia:space-open-at-mode", { detail }));
    } else {
      window.dispatchEvent(new CustomEvent("gaia:story-mode-open", { detail }));
    }
    requestAnimationFrame(() => elements.bridgeControls.querySelector("button")?.focus({ preventScroll: true }));
  };

  const closeBridge = () => {
    elements.bridge.hidden = true;
    elements.bridge.setAttribute("aria-hidden", "true");
    document.body.classList.remove("novel-mode-detour");
    layer.classList.remove("is-mode-detour");
  };

  const completePendingInteraction = () => {
    if (!pendingInteraction || !bridgeCompletion()) return;
    const step = pendingInteraction;
    pendingInteraction = null;
    bridgeState = null;
    closeBridge();
    saveProgress();
    moveToFollowingStep(step);
  };

  const renderInteraction = (step) => {
    prepareStepFrame(step);
    clearTimers();
    setCharacterPresentation("visitor");
    elements.speaker.textContent = "INTERACTIVE DISPLAY";
    elements.text.textContent = step.text;
    elements.cursor.hidden = true;
    elements.continueMark.classList.remove("is-visible");
    const button = document.createElement("button");
    button.type = "button";
    button.className = "novel-interaction-open";
    button.textContent = "既存の表示モードを開く";
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      openBridge(step);
    });
    elements.choices.append(button);
    elements.choices.classList.add("is-visible");
    requestAnimationFrame(() => button.focus({ preventScroll: true }));
  };

  const renderVisitorInput = (step) => {
    prepareStepFrame(step);
    clearTimers();
    setCharacterPresentation("visitor");
    elements.speaker.textContent = "VISITOR POST / サクヤの続きではありません";
    elements.cursor.hidden = true;
    elements.continueMark.classList.remove("is-visible");
    const form = document.createElement("section");
    form.className = "novel-visitor-input";
    const prompt = document.createElement("p");
    prompt.textContent = "この展示を見た現在の記録を、残したい場合だけ一行書いてください。これはサクヤの文章の続きではありません。";
    const privacy = document.createElement("p");
    privacy.className = "novel-visitor-privacy";
    privacy.textContent = "本名、住所、連絡先は書かないでください。";
    const label = document.createElement("label");
    label.htmlFor = "novel-visitor-post";
    label.textContent = "作者 / AUTHOR：VISITOR　分類 / TYPE：来場者の投稿 / VISITOR POST";
    const textarea = document.createElement("textarea");
    textarea.id = "novel-visitor-post";
    textarea.maxLength = step.maxLength;
    textarea.rows = 3;
    textarea.value = sessionDraft;
    textarea.placeholder = "現在の自分の記録（書きたい場合だけ・120文字まで）";
    const count = document.createElement("output");
    count.htmlFor = textarea.id;
    count.textContent = `${Array.from(sessionDraft).length} / 120`;
    const policy = document.createElement("p");
    policy.className = "novel-visitor-policy";
    policy.textContent = "120文字まで／このセッションだけ／サーバー送信なし／次の人に本文は見えない";
    const actions = document.createElement("div");
    const remove = document.createElement("button");
    const proceed = document.createElement("button");
    remove.type = proceed.type = "button";
    remove.textContent = "この文章を消す";
    proceed.textContent = "WRITE / LEAVE EMPTYの選択へ";
    textarea.addEventListener("input", () => {
      sessionDraft = Array.from(textarea.value).slice(0, 120).join("");
      if (textarea.value !== sessionDraft) textarea.value = sessionDraft;
      count.textContent = `${Array.from(sessionDraft).length} / 120`;
    });
    remove.addEventListener("click", () => {
      sessionDraft = "";
      textarea.value = "";
      count.textContent = "0 / 120";
      textarea.focus({ preventScroll: true });
    });
    proceed.addEventListener("click", () => moveToFollowingStep(step));
    actions.append(remove, proceed);
    form.append(prompt, privacy, label, textarea, count, policy, actions);
    elements.text.replaceChildren(form);
    requestAnimationFrame(() => textarea.focus({ preventScroll: true }));
  };

  const renderResult = (step) => {
    prepareStepFrame(step);
    clearTimers();
    setCharacterPresentation("system");
    elements.speaker.textContent = "FINAL RECORD / 四つは同格の到達結果です";
    elements.cursor.hidden = true;
    elements.continueMark.classList.remove("is-visible");
    const result = document.createElement("section");
    result.className = "novel-final-result";
    const heading = document.createElement("h3");
    heading.textContent = `${state.editorialChoice} × ${state.visitorAction}`;
    const source = document.createElement("article");
    source.dataset.kind = "SOURCE";
    const sourceLabel = document.createElement("strong");
    const sourceText = document.createElement("p");
    sourceLabel.textContent = "観測記録 / SOURCE　作者：SAKUYA";
    sourceText.textContent = "もし地球の声が聞こえたと思ったら、すぐに意味を決めるんじゃなくて――";
    source.append(sourceLabel, sourceText);
    result.append(heading, source);
    if (state.editorialChoice === "DISCLOSE_DERIVATION") {
      const derived = document.createElement("article");
      derived.dataset.kind = "DERIVED";
      const label = document.createElement("strong");
      const text = document.createElement("p");
      const meta = document.createElement("small");
      label.textContent = "計算・解釈 / DERIVED　生成実行・選定責任：MIZUHA";
      text.textContent = "「聞こえたつもりになってない？」って、三人で確かめたい。";
      meta.textContent = "公開対象の制作投稿からローカル生成／サクヤ本人の確認なし";
      derived.append(label, text, meta);
      result.append(derived);
    }
    if (state.visitorAction === "WRITE") {
      const visitor = document.createElement("article");
      visitor.dataset.kind = "VISITOR_POST";
      const label = document.createElement("strong");
      const text = document.createElement("p");
      label.textContent = "来場者の投稿 / VISITOR POST　作者：VISITOR";
      text.textContent = sessionDraft;
      visitor.append(label, text);
      result.append(visitor);
    }
    const trace = document.createElement("p");
    trace.className = "novel-final-trace";
    trace.textContent = `操作記録 / VISITOR TRACE：${state.observationOrder || "—"} → ${state.editorialChoice} → ${state.visitorAction}　公開版の変更：NO`;
    const next = document.createElement("button");
    next.type = "button";
    next.textContent = "展示ホールへ戻る";
    next.addEventListener("click", () => moveToFollowingStep(step));
    result.append(trace, next);
    elements.text.replaceChildren(result);
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
    copy.textContent = "本文は消えます。次へ残るのは、誰かが書いた、または書かなかったという黄色い痕跡と累積件数だけです。";
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
    start.textContent = "STARTへ戻る（本文を破棄）";
    start.addEventListener("click", () => {
      sessionDraft = "";
      removeStorage(STORAGE_KEY);
      state = defaultState();
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
    while (step && !conditionMatches(step) && guard < allSteps.length) {
      state.stepId = getFollowingStepId(step);
      step = currentStep();
      guard += 1;
    }
    if (!step) return;
    saveProgress();
    if (["narration", "dialogue"].includes(step.type)) return renderSimpleStep(step);
    if (["chat", "record", "ui", "transition"].includes(step.type)) return renderRichStep(step);
    if (step.type === "details") return renderGenerationDetails(step);
    if (step.type === "choice") return renderChoice(step);
    if (step.type === "interaction") return renderInteraction(step);
    if (step.type === "visitorInput") return renderVisitorInput(step);
    if (step.type === "result") return renderResult(step);
    if (step.type === "end") return renderEnd(step);
    return renderSimpleStep(step);
  }

  const canAdvanceStep = (step) => ["narration", "dialogue", "chat", "record", "ui", "transition", "details"].includes(step?.type);
  function advance() {
    if (!isOpen || !hasStarted || pendingInteraction) return;
    if (![elements.logPanel, elements.savePanel, elements.configPanel, elements.evesPanel, elements.sourcePanel].every((panel) => panel.hidden)) return;
    const step = currentStep();
    if (!canAdvanceStep(step)) return;
    if (isRevealing) {
      finishReveal();
      return;
    }
    moveToFollowingStep(step);
  }

  function scheduleAutoAdvance() {
    window.clearTimeout(autoTimer);
    if (elements.auto.getAttribute("aria-pressed") !== "true" || !canAdvanceStep(currentStep())) return;
    autoTimer = window.setTimeout(advance, AUTO_DELAY_MS);
  }

  const startNewSession = () => {
    sessionDraft = "";
    state = defaultState();
    state.sessionId = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
    incrementSessionCount();
    showRuntime();
    renderEves();
    saveProgress();
    renderCurrentStep();
  };

  const restartStory = () => {
    const sessionId = state.sessionId || `${Date.now().toString(36)}-restart`;
    sessionDraft = "";
    state = defaultState();
    state.sessionId = sessionId;
    showRuntime();
    renderEves();
    saveProgress();
    renderCurrentStep();
  };

  const resumeStory = () => {
    const stored = getStoredProgress();
    if (!stored) return startNewSession();
    state = stored;
    sessionDraft = "";
    showRuntime();
    renderEves();
    renderCurrentStep();
  };

  const renderLog = () => {
    elements.logContent.replaceChildren();
    [...state.readStepIds].reverse().forEach((id) => {
      const step = stepMap.get(id);
      if (!step?.text) return;
      const article = document.createElement("article");
      const header = document.createElement("p");
      const text = document.createElement("p");
      const speaker = SPEAKERS[step.speaker]?.name || step.type.toUpperCase();
      article.dataset.kind = step.recordType || "SOURCE";
      header.textContent = `${speaker || "観測記録"} / ${RECORD_LABELS[step.recordType] || step.type}`;
      text.textContent = step.text;
      article.append(header, text);
      elements.logContent.append(article);
    });
  };
  const closeLog = () => {
    elements.logPanel.hidden = true;
    elements.logPanel.setAttribute("aria-hidden", "true");
    elements.logButton.setAttribute("aria-expanded", "false");
  };
  const toggleLog = () => {
    if (elements.logPanel.hidden) {
      closeEves();
      closeSourceDetails();
      renderLog();
      elements.logPanel.hidden = false;
      elements.logPanel.setAttribute("aria-hidden", "false");
      elements.logButton.setAttribute("aria-expanded", "true");
      elements.logClose.focus({ preventScroll: true });
    } else closeLog();
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

  const evesNodeLabel = (id) => ({
    intro: "物語を観測中",
    editorial_choice: "表示選択",
    visitor_action: "最後の選択",
    SOURCE_RECORD_WRITE: "SOURCE RECORD × WRITE",
    SOURCE_RECORD_LEAVE_EMPTY: "SOURCE RECORD × LEAVE EMPTY",
    DISCLOSE_DERIVATION_WRITE: "DISCLOSE DERIVATION × WRITE",
    DISCLOSE_DERIVATION_LEAVE_EMPTY: "DISCLOSE DERIVATION × LEAVE EMPTY",
  })[id] || "物語を観測中";

  const renderEvesGraph = () => {
    const editorial = state.editorialChoice;
    const action = state.visitorAction;
    const result = editorial && action ? `${editorial}_${action}` : "";
    const visited = new Set(["intro"]);
    if (editorial) visited.add("editorial_choice");
    if (action) visited.add("visitor_action");
    if (result) visited.add(result);
    const node = (id, x, y, width, label) => `<g class="eves-node ${visited.has(id) ? "is-visited" : ""} ${result === id ? "is-current" : ""}" data-node="${id}"><rect x="${x}" y="${y}" width="${width}" height="54" rx="8"></rect><text class="eves-node-eyebrow" x="${x + 12}" y="${y + 18}">${label}</text><text class="eves-node-label" x="${x + 12}" y="${y + 39}">${evesNodeLabel(id)}</text></g>`;
    const edge = (active, d, label, x, y) => `<g class="eves-edge ${active ? "is-active" : ""}"><path d="${d}"></path><text x="${x}" y="${y}">${label}</text></g>`;
    elements.evesGraph.innerHTML = `<svg viewBox="0 0 1120 390" role="img" aria-label="二段階の選択から四つの同格な結果へ至る経路図">
      ${edge(Boolean(editorial), "M130 195 H200", "", 0, 0)}
      ${edge(editorial === "SOURCE_RECORD", "M360 185 C400 185 400 90 450 90", "SOURCE RECORD", 360, 124)}
      ${edge(editorial === "DISCLOSE_DERIVATION", "M360 205 C400 205 400 295 450 295", "DISCLOSE", 365, 274)}
      ${edge(Boolean(action), "M610 90 C650 90 650 50 690 50", "WRITE", 620, 65)}
      ${edge(Boolean(action), "M610 90 C650 90 650 135 690 135", "LEAVE EMPTY", 615, 126)}
      ${edge(Boolean(action), "M610 295 C650 295 650 250 690 250", "WRITE", 620, 267)}
      ${edge(Boolean(action), "M610 295 C650 295 650 335 690 335", "LEAVE EMPTY", 615, 328)}
      ${node("intro", 20, 168, 110, "START")}
      ${node("editorial_choice", 200, 168, 160, "DECISION 01")}
      ${node("visitor_action", 450, 63, 160, "DECISION 02")}
      ${node("visitor_action", 450, 268, 160, "DECISION 02")}
      ${node("SOURCE_RECORD_WRITE", 690, 23, 310, "RESULT")}
      ${node("SOURCE_RECORD_LEAVE_EMPTY", 690, 108, 310, "RESULT")}
      ${node("DISCLOSE_DERIVATION_WRITE", 690, 223, 390, "RESULT")}
      ${node("DISCLOSE_DERIVATION_LEAVE_EMPTY", 690, 308, 390, "RESULT")}
    </svg>`;
  };

  const renderEves = () => {
    elements.evesCount.textContent = `${state.evesRoute.length} / 2`;
    const current = state.editorialChoice && state.visitorAction
      ? `${state.editorialChoice}_${state.visitorAction}`
      : state.evesRoute.at(-1)?.decisionId || "intro";
    elements.evesCurrent.textContent = evesNodeLabel(current);
    elements.evesHistory.replaceChildren();
    if (!state.evesRoute.length) {
      const item = document.createElement("li");
      item.className = "is-empty";
      const span = document.createElement("span");
      const strong = document.createElement("strong");
      span.textContent = "NO VARIANT YET";
      strong.textContent = "E.V.E.S.は作品の正解ではなく、選択と順番を記録します。";
      item.append(span, strong);
      elements.evesHistory.append(item);
    } else {
      state.evesRoute.forEach((entry, index) => {
        const item = document.createElement("li");
        const span = document.createElement("span");
        const strong = document.createElement("strong");
        const small = document.createElement("small");
        span.textContent = `VARIANT ${String(index + 1).padStart(2, "0")}`;
        strong.textContent = entry.label;
        small.textContent = entry.decisionId === "editorial_choice" ? "表示選択" : "最後の選択";
        item.append(span, strong, small);
        elements.evesHistory.append(item);
      });
    }
    elements.evesRewind.disabled = state.evesRoute.length === 0;
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
    sessionDraft = "";
    if (entry.decisionId === "visitor_action") state.visitorAction = null;
    if (entry.decisionId === "editorial_choice") {
      state.editorialChoice = null;
      state.visitorAction = null;
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
    const candidate = safeJson(readStorage(MANUAL_SAVE_KEY));
    if (!Array.isArray(candidate)) return emptySlots();
    return emptySlots().map((_, index) => {
      const saved = candidate[index];
      const progress = normalizeState(saved?.progress);
      return progress ? { progress, savedAt: Number(saved.savedAt) || 0, meta: saved.meta || {} } : null;
    });
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
    elements.saveStatus.textContent = `SLOT ${index + 1}へ保存しました。入力本文は含まれません。`;
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
    state = saved.progress;
    sessionDraft = "";
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
    elements.saveStatus.textContent = archiveMode === "save" ? "保存先を選んでください。入力本文は保存されません。" : "再開する記録を選んでください。";
    renderManualSlots();
  };
  const openManualArchive = (mode) => {
    setArchiveMode(mode);
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
  const resetEventRecord = () => {
    if (!eventResetArmed) {
      eventResetArmed = true;
      elements.eventReset.textContent = "もう一度押してイベント記録消去";
      elements.eventResetStatus.textContent = "累積件数と黄色い痕跡だけを消去します。物語セーブと設定は残ります。";
      eventResetTimer = window.setTimeout(() => {
        eventResetArmed = false;
        elements.eventReset.textContent = "イベント記録消去";
        elements.eventResetStatus.textContent = "";
      }, 5000);
      return;
    }
    window.clearTimeout(eventResetTimer);
    eventResetArmed = false;
    removeStorage(EVENT_KEY);
    elements.eventReset.textContent = "イベント記録消去";
    elements.eventResetStatus.textContent = "累積件数と黄色い痕跡を消去しました。";
    renderEventStats();
  };

  function openNovel(event = null) {
    event?.preventDefault?.();
    previousFocus = document.activeElement;
    particleSystem.start();
    void window.GaiaOpeningAudio?.switchTrack?.("story");
    window.dispatchEvent(new CustomEvent("gaia:novel-open"));
    isOpen = true;
    layer.hidden = false;
    layer.setAttribute("aria-hidden", "false");
    document.body.classList.add("novel-open");
    showTitle();
    requestAnimationFrame(() => layer.classList.add("is-open"));
    if (window.location.hash !== "#story") history.replaceState(null, "", "#story");
  }
  function closeNovelNow() {
    clearTimers();
    closeBridge();
    sessionDraft = "";
    particleSystem.stop();
    void window.GaiaOpeningAudio?.switchTrack?.("opening");
    isOpen = false;
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
    state = defaultState();
    if (target) state.stepId = target.steps[0].id;
    state.sessionId = `${Date.now().toString(36)}-entry`;
    incrementSessionCount();
    openNovel();
    showRuntime();
    renderCurrentStep();
  });

  window.addEventListener("gaia:gx-story-progress", (event) => {
    if (pendingInteraction?.interaction.kind !== "gx") return;
    bridgeState.gestureCount = Math.max(bridgeState.gestureCount || 0, Number(event.detail?.count) || 0);
    if (event.detail?.complete || bridgeState.gestureCount >= 3) state.viewed.gxDeepTime = true;
    saveProgress();
    updateBridge();
  });
  window.addEventListener("gaia:gx-return-to-novel", () => completePendingInteraction());
  window.addEventListener("gaia:story-map-interaction", () => {
    if (!pendingInteraction) return;
    updateBridge();
  });
  window.addEventListener("gaia:story-abstract-interaction", () => {
    if (pendingInteraction?.interaction.kind !== "abstract07") return;
    state.viewed.mode07AbstractPoint = true;
    saveProgress();
    updateBridge();
  });
  window.addEventListener("gaia:space-story-progress", (event) => {
    if (pendingInteraction?.interaction.kind !== "space10") return;
    if (event.detail?.complete) state.viewed.mode10SpaceOverview = true;
    saveProgress();
    updateBridge();
  });
  window.addEventListener("gaia:space-return-to-novel", () => completePendingInteraction());

  elements.bridgeReturn?.addEventListener("click", () => {
    if (!pendingInteraction || !bridgeCompletion()) return;
    const kind = pendingInteraction.interaction.kind;
    if (kind === "gx") window.GaiaGX?.close?.();
    else if (kind === "space10") window.GaiaSpace?.close?.({ returnToTop: false });
    else {
      window.dispatchEvent(new CustomEvent("gaia:story-mode-close", { detail: { kind } }));
      completePendingInteraction();
    }
  });

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
  elements.eventReset?.addEventListener("click", resetEventRecord);
  elements.evesButton.addEventListener("click", toggleEves);
  elements.evesClose.addEventListener("click", closeEves);
  elements.evesRewind.addEventListener("click", rewindEves);
  elements.sourceButton.addEventListener("click", (event) => {
    event.stopPropagation();
    toggleSourceDetails();
  });
  elements.sourceClose.addEventListener("click", () => closeSourceDetails({ restoreFocus: true }));
  elements.auto.addEventListener("click", () => {
    const enabled = elements.auto.getAttribute("aria-pressed") !== "true";
    elements.auto.setAttribute("aria-pressed", String(enabled));
    elements.auto.classList.toggle("is-active", enabled);
    if (enabled) scheduleAutoAdvance();
    else window.clearTimeout(autoTimer);
  });
  elements.dialogue.addEventListener("click", (event) => {
    if (event.target.closest("button, textarea, input, details, summary")) return;
    event.stopPropagation();
    advance();
  });
  layer.addEventListener("click", (event) => {
    if (event.target.closest("button, a, input, select, textarea, details, summary, [role='button']")) return;
    advance();
  });
  layer.addEventListener("keydown", (event) => {
    event.stopPropagation();
    if (event.key === "Escape") {
      event.preventDefault();
      if (!elements.configPanel.hidden) closeConfig();
      else if (!elements.savePanel.hidden) closeManualArchive();
      else if (!elements.sourcePanel.hidden) closeSourceDetails({ restoreFocus: true });
      else if (!elements.evesPanel.hidden) closeEves();
      else if (!elements.logPanel.hidden) closeLog();
      else closeNovel();
      return;
    }
    if ((event.key === " " || event.key === "Enter") && !event.target.closest("button, textarea, input, summary")) {
      event.preventDefault();
      advance();
    }
    if (event.key.toLowerCase() === "l" && !event.target.closest("textarea, input")) {
      event.preventDefault();
      toggleLog();
    }
  });

  loadConfig();
  syncConfig();
  renderManualSlots();
  renderEves();
  renderEventStats();
  showTitle();
  if (window.location.hash === "#story") openNovel();
})();
