(() => {
  "use strict";

  const story = globalThis.GAIA_NOVEL_STORY || globalThis.GAIA_NOVEL_STORY_V6;
  const layer = document.querySelector("#novel-layer");
  if (!story || !layer) return;

  const STORAGE_KEY = "gaiaSensewareNovel:progress";
  const MANUAL_SAVE_KEY = "gaiaSensewareNovel:manual-saves";
  const CONFIG_KEY = "gaiaSensewareNovel:config:v2";
  const LEGACY_PROGRESS_KEYS = ["gaia_novel_save_v6", "gaiaSensewareNovel:v5"];
  const LEGACY_MANUAL_KEYS = ["gaia_novel_manual_saves_v6", "gaiaSensewareNovel:manual-saves:v1"];
  const SLOT_COUNT = 6;
  const SYSTEM_REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const AUTO_DELAY_MS = 3600;
  const REVEAL_BASE_MS = 24;
  const REVEAL_MIN_LINE_MS = 120;
  const REVEAL_PUNCTUATION_MS = 84;
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
    slackSurface: layer.querySelector("#novel-slack-surface"),
    evidenceSurface: layer.querySelector("#novel-evidence-surface"),
    reflectionSurface: layer.querySelector("#novel-reflection-surface"),
    resultSurface: layer.querySelector("#novel-result-surface"),
  };

  const scenes = story.scenes;
  const sceneMap = new Map(scenes.map((scene) => [scene.id, scene]));
  const allSteps = scenes.flatMap((scene) => scene.steps);
  const stepMap = new Map(allSteps.map((step) => [step.id, step]));
  const stepIndexMap = new Map(allSteps.map((step, index) => [step.id, index]));
  const firstStepForScene = (sceneId) => sceneMap.get(sceneId)?.steps?.[0]?.id || null;
  const reflectionStep = allSteps.find((step) => step.type === "reflectionChoice");
  const reflectionOptionMap = new Map((reflectionStep?.options || []).map((option) => [option.id, option]));

  const defaultState = () => ({
    storyVersion: story.storyVersion,
    stepId: firstStepForScene(story.startSceneId),
    reachedSceneIds: [],
    viewed: { ...VIEWED_DEFAULTS },
    evesRoute: [],
    observationOrder: null,
    editorialChoice: null,
    reflectionIds: [],
    resultTone: null,
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
  let revealTimer = 0;
  let revealFrame = 0;
  let revealGeneration = 0;
  let autoTimer = 0;
  let previousFocus = null;
  let archiveMode = "save";
  let pendingSlotAction = "";
  let pendingSlotTimer = 0;
  let pendingInteraction = null;
  let detourState = null;
  let detourDock = null;
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
  const readAudioState = () => {
    const volume = Number(document.querySelector("#gaia-audio-volume")?.value);
    const muted = document.querySelector("#gaia-audio-toggle")?.getAttribute("aria-pressed") === "true";
    return {
      muted,
      volume: Number.isFinite(volume) ? Math.max(0, Math.min(1, volume)) : state.audio.volume,
    };
  };

  const migrateStepId = (stepId) => {
    if (stepMap.has(stepId)) return stepId;
    if (typeof stepId !== "string") return null;
    const mappings = [
      ["current_notice_", "current_exhibition_"],
      ["epilogue_visitor_field_", "epilogue_reflection_field_"],
      ["choice_visitor_action_", "choice_reflection_"],
      ["final_record_", "final_record_"],
    ];
    for (const [from, to] of mappings) {
      if (!stepId.startsWith(from)) continue;
      const mapped = `${to}${stepId.slice(from.length)}`;
      if (stepMap.has(mapped)) return mapped;
      const sceneId = to.slice(0, -1);
      return firstStepForScene(sceneId);
    }
    return null;
  };

  const normalizeState = (candidate) => {
    const legacyIndexStep = Number.isInteger(candidate?.stepIndex)
      ? allSteps[Math.max(0, Math.min(allSteps.length - 1, candidate.stepIndex))]?.id
      : null;
    const stepId = migrateStepId(candidate?.stepId || legacyIndexStep);
    if (!candidate || !stepId) return null;
    const normalized = defaultState();
    normalized.stepId = stepId;
    normalized.reachedSceneIds = Array.isArray(candidate.reachedSceneIds)
      ? candidate.reachedSceneIds.filter((id) => sceneMap.has(id))
      : [];
    normalized.viewed = { ...VIEWED_DEFAULTS, ...(candidate.viewed || {}) };
    normalized.evesRoute = Array.isArray(candidate.evesRoute)
      ? candidate.evesRoute.filter((entry) => ["editorial_choice", "reflection_choice"].includes(entry?.decisionId)).slice(0, 2)
      : [];
    normalized.observationOrder = ["LOCAL_FIRST", "STATION_FIRST"].includes(candidate.observationOrder)
      ? candidate.observationOrder : null;
    normalized.editorialChoice = ["SOURCE_RECORD", "DISCLOSE_DERIVATION"].includes(candidate.editorialChoice)
      ? candidate.editorialChoice : null;
    normalized.reflectionIds = Array.isArray(candidate.reflectionIds)
      ? [...new Set(candidate.reflectionIds.filter((id) => reflectionOptionMap.has(id)))].slice(0, 3)
      : [];
    normalized.resultTone = ["LAW", "NEUTRAL", "CHAOS", "UNANSWERED"].includes(candidate.resultTone)
      ? candidate.resultTone : null;
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
  const saveProgress = () => {
    state.audio = readAudioState();
    writeStorage(STORAGE_KEY, JSON.stringify(state));
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
    revealTimer = 0;
    revealFrame = 0;
    autoTimer = 0;
  };

  const hideSpecialSurfaces = () => {
    [elements.slackSurface, elements.evidenceSurface, elements.reflectionSurface, elements.resultSurface].forEach((surface) => {
      surface.hidden = true;
      surface.replaceChildren();
    });
    layer.classList.remove("is-slack", "is-evidence", "is-editorial-evidence", "is-reflection", "is-result");
  };

  const showRuntime = () => {
    hasStarted = true;
    layer.classList.remove("is-title");
    elements.titleScreen.hidden = true;
    elements.runtime.hidden = false;
    elements.restart.hidden = false;
    elements.saveButton.hidden = false;
    elements.loadButton.hidden = false;
  };

  const showTitle = () => {
    hasStarted = false;
    hideSpecialSurfaces();
    layer.classList.add("is-title");
    elements.titleScreen.hidden = false;
    elements.runtime.hidden = true;
    elements.restart.hidden = true;
    elements.saveButton.hidden = true;
    elements.loadButton.hidden = true;
    elements.resume.hidden = !getStoredProgress();
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

  const backgroundImageForScene = (sceneId) => {
    const previousSceneId = layer.dataset.sceneId;
    layer.dataset.sceneId = sceneId;
    const backgroundImage = getComputedStyle(layer).backgroundImage;
    if (previousSceneId) layer.dataset.sceneId = previousSceneId;
    else delete layer.dataset.sceneId;
    return backgroundImage;
  };

  const moveToFollowingStep = (step = currentStep()) => {
    const next = step ? getFollowingStepId(step) : null;
    if (!next) return;
    const nextStep = stepMap.get(next);
    const swapStep = () => {
      state.stepId = next;
      saveProgress();
      renderCurrentStep();
    };
    const backgroundChanges = step.sceneId !== nextStep?.sceneId
      && backgroundImageForScene(step.sceneId) !== backgroundImageForScene(nextStep.sceneId);
    if (backgroundChanges && !motionReduced()) {
      return runSceneTransition(swapStep, null, "novel");
    }
    swapStep();
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

  const markRead = (step) => {
    if (!["choice", "reflectionChoice", "interaction", "result", "end"].includes(step.type)
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
    hideSpecialSurfaces();
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

  const createSlackPost = (message, { root = false, current = false } = {}) => {
    const article = document.createElement("article");
    article.className = `novel-slack-post ${root ? "is-root" : "is-reply"}${current ? " is-new" : ""}`;
    article.dataset.speaker = message.speaker || "system";
    const avatar = document.createElement("div");
    avatar.className = "novel-slack-avatar";
    avatar.setAttribute("aria-hidden", "true");
    avatar.textContent = SPEAKERS[message.speaker]?.glyph || "◌";
    const body = document.createElement("div");
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
    article.append(avatar, body);
    return article;
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
    if (step.type === "chat") {
      const timeline = slackTimelineFor(step);
      setCharacterPresentation(step.speaker);
      elements.dialogue.hidden = false;
      elements.speaker.textContent = "SLACK / #惑星の放課後";
      elements.text.textContent = timeline.typing ? "返信を待っています。クリックすると次の投稿へ進みます。" : "このスレッドの記録を表示しています。";
      elements.sourceButton.hidden = true;
      elements.slackSurface.hidden = false;
      layer.classList.add("is-slack");
      const workspace = document.createElement("div");
      workspace.className = "novel-slack-workspace";
      workspace.innerHTML = `<header><b>◀　▶　◷</b><span>⌕　惑星の放課後を検索</span><i aria-hidden="true">?　◉</i></header><aside><strong>惑星の放課後</strong><small>チャンネル</small><span># general</span><span class="is-current"># 惑星の放課後</span><span># 観測メモ</span><small>ダイレクトメッセージ</small><span>● ミズハ</span><span>● アマネ</span><span>○ サクヤ</span></aside><main><header><div><strong># 惑星の放課後</strong><small>まだ名前のない変化を見つけて、持ち寄る場所</small></div><span>♟ 3　⌕</span></header><section class="novel-slack-thread" aria-label="メッセージスレッド" aria-live="polite"></section><footer><span>＋</span><span># 惑星の放課後 へのメッセージ</span><b aria-hidden="true">Aa　☺　🎙</b></footer></main>`;
      const thread = workspace.querySelector(".novel-slack-thread");
      timeline.messages.forEach((message, index) => {
        thread.append(createSlackPost(message, { root: index === 0, current: message.id === step.id }));
      });
      if (timeline.typing) {
        const typing = document.createElement("div");
        typing.className = "novel-slack-typing";
        typing.dataset.speaker = timeline.typing.speaker || "system";
        typing.setAttribute("role", "status");
        typing.innerHTML = `<span class="novel-slack-avatar" aria-hidden="true">${SPEAKERS[timeline.typing.speaker]?.glyph || "◌"}</span><span><b>${timeline.typing.speakerLabel || SPEAKERS[timeline.typing.speaker]?.name || "誰か"}</b> が入力しています</span><i aria-hidden="true"><b></b><b></b><b></b></i>`;
        thread.append(typing);
      }
      elements.slackSurface.append(workspace);
      requestAnimationFrame(() => { thread.scrollTop = thread.scrollHeight; });
      scheduleAutoAdvance();
      return;
    }

    if (step.type === "record") {
      elements.dialogue.hidden = true;
      elements.sourceButton.hidden = true;
      elements.evidenceSurface.hidden = false;
      layer.classList.add("is-evidence");
      const isDerived = step.recordType === "DERIVED";
      const evidence = document.createElement("article");
      evidence.className = `novel-evidence-card ${isDerived ? "is-derived" : "is-source"}`;
      const type = document.createElement("span");
      const heading = document.createElement("h2");
      const body = document.createElement("p");
      const meta = document.createElement("footer");
      type.textContent = isDerived ? "DERIVED" : "SOURCE";
      heading.textContent = isDerived ? "計算・解釈として生成された記録" : "観測されたままの記録";
      appendLines(body, step.text || "");
      meta.textContent = isDerived
        ? "生成実行・選定責任：MIZUHA　｜　サクヤ本人の確認：なし"
        : "原文の作者と出典を保持しています";
      evidence.append(type, heading, body, meta);
      elements.evidenceSurface.append(evidence);
      scheduleAutoAdvance();
      return;
    }

    const speaker = step.speaker || "system";
    setCharacterPresentation(speaker);
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

    const groups = step.groups?.length
      ? step.groups
      : [{ id: "all", title: "観測姿勢", optionIds: step.options.map((option) => option.id) }];
    groups.forEach((group) => {
      const section = document.createElement("section");
      section.className = "novel-reflection-group";
      section.dataset.themeId = group.id;
      const title = document.createElement("h3");
      title.textContent = group.title;
      section.append(title);
      group.optionIds.forEach((id) => {
        const option = reflectionOptionMap.get(id);
        if (option) section.append(createOptionButton(option));
      });
      grid.append(section);
    });

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
    if (kind === "map03" || kind === "map08") return document.querySelector("#japan-layer");
    return document.querySelector(".experience");
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
    if (kind === "gx") window.GaiaGX?.close?.();
    else if (kind === "space10") window.GaiaSpace?.close?.({ returnToTop: false });
    else {
      window.dispatchEvent(new CustomEvent("gaia:story-mode-close", { detail: { kind } }));
      completePendingInteraction();
    }
  };

  const openDetour = (step) => {
    pendingInteraction = step;
    detourState = { gestureCount: 0 };
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
    requestAnimationFrame(() => detourDock?.querySelector(".story-detour-controls button, #story-detour-return")?.focus({ preventScroll: true }));
  };

  const completePendingInteraction = () => {
    if (!pendingInteraction || !detourCompletion()) return;
    const step = pendingInteraction;
    pendingInteraction = null;
    detourState = null;
    closeDetourDock();
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
      openDetour(step);
    });
    elements.choices.append(button);
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
    if (step.type === "reflectionChoice") return renderReflectionChoice(step);
    if (step.type === "interaction") return renderInteraction(step);
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
    state = defaultState();
    state.sessionId = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
    showRuntime();
    renderEves();
    saveProgress();
    renderCurrentStep();
  };

  const restartStory = () => {
    const sessionId = state.sessionId || `${Date.now().toString(36)}-restart`;
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
    reflection_choice: "観測姿勢の選択",
    SOURCE_RECORD_SELECTED: "観測姿勢を選ぶ",
    SOURCE_RECORD_UNANSWERED: "観測姿勢を選ばない",
    DISCLOSE_DERIVATION_SELECTED: "観測姿勢を選ぶ",
    DISCLOSE_DERIVATION_UNANSWERED: "観測姿勢を選ばない",
  })[id] || "物語を観測中";

  const renderEvesGraph = () => {
    const editorial = state.editorialChoice;
    const posture = state.evesRoute.find((entry) => entry.decisionId === "reflection_choice")?.value || "";
    const result = editorial && posture ? `${editorial}_${posture}` : "";
    const visited = new Set(["intro"]);
    if (editorial) visited.add("editorial_choice");
    if (posture) visited.add("reflection_choice");
    if (result) visited.add(result);
    const node = (id, x, y, width, label) => `<g class="eves-node ${visited.has(id) ? "is-visited" : ""} ${result === id ? "is-current" : ""}" data-node="${id}"><rect x="${x}" y="${y}" width="${width}" height="54" rx="8"></rect><text class="eves-node-eyebrow" x="${x + 12}" y="${y + 18}">${label}</text><text class="eves-node-label" x="${x + 12}" y="${y + 39}">${evesNodeLabel(id)}</text></g>`;
    const edge = (active, d, label, x, y) => `<g class="eves-edge ${active ? "is-active" : ""}"><path d="${d}"></path><text x="${x}" y="${y}">${label}</text></g>`;
    elements.evesGraph.innerHTML = `<svg viewBox="0 0 1120 390" role="img" aria-label="編集方針と観測姿勢の二段階を記録する経路図">
      ${edge(Boolean(editorial), "M130 195 H200", "", 0, 0)}
      ${edge(editorial === "SOURCE_RECORD", "M360 185 C400 185 400 90 450 90", "SOURCE RECORD", 360, 124)}
      ${edge(editorial === "DISCLOSE_DERIVATION", "M360 205 C400 205 400 295 450 295", "DISCLOSE", 365, 274)}
      ${edge(Boolean(posture), "M610 90 C650 90 650 50 690 50", "選ぶ", 626, 65)}
      ${edge(Boolean(posture), "M610 90 C650 90 650 135 690 135", "選ばない", 615, 126)}
      ${edge(Boolean(posture), "M610 295 C650 295 650 250 690 250", "選ぶ", 626, 267)}
      ${edge(Boolean(posture), "M610 295 C650 295 650 335 690 335", "選ばない", 615, 328)}
      ${node("intro", 20, 168, 110, "START")}
      ${node("editorial_choice", 200, 168, 160, "DECISION 01")}
      ${node("reflection_choice", 450, 63, 160, "DECISION 02")}
      ${node("reflection_choice", 450, 268, 160, "DECISION 02")}
      ${node("SOURCE_RECORD_SELECTED", 690, 23, 310, "RESULT")}
      ${node("SOURCE_RECORD_UNANSWERED", 690, 108, 310, "RESULT")}
      ${node("DISCLOSE_DERIVATION_SELECTED", 690, 223, 390, "RESULT")}
      ${node("DISCLOSE_DERIVATION_UNANSWERED", 690, 308, 390, "RESULT")}
    </svg>`;
  };

  const renderEves = () => {
    elements.evesCount.textContent = `${state.evesRoute.length} / 2`;
    const posture = state.evesRoute.find((entry) => entry.decisionId === "reflection_choice")?.value;
    const current = state.editorialChoice && posture
      ? `${state.editorialChoice}_${posture}`
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
    closeDetourDock();
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
    openNovel();
    showRuntime();
    renderCurrentStep();
  });

  window.addEventListener("gaia:gx-story-progress", (event) => {
    if (pendingInteraction?.interaction.kind !== "gx") return;
    detourState.gestureCount = Math.max(detourState.gestureCount || 0, Number(event.detail?.count) || 0);
    if (event.detail?.complete || detourState.gestureCount >= 3) state.viewed.gxDeepTime = true;
    saveProgress();
    updateDetourDock();
  });
  window.addEventListener("gaia:gx-return-to-novel", () => completePendingInteraction());
  window.addEventListener("gaia:story-map-interaction", () => {
    if (!pendingInteraction) return;
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

  globalThis.GaiaNovel = Object.freeze({
    open: openNovel,
    close: closeNovel,
    getState: () => structuredClone(state),
    scoreReflection: (ids) => scoreReflection(ids),
    storageKey: STORAGE_KEY,
  });

  loadConfig();
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
