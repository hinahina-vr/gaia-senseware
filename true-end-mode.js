(() => {
  "use strict";

  const story = globalThis.GAIA_TRUE_END_STORY;
  if (!story) return;
  const SYSTEM_LANGUAGE = story.language?.htmlLang || "art-x-saeliva";

  const SPEAKERS = Object.freeze({
    narrator: Object.freeze({ name: "", code: "MIR", language: SYSTEM_LANGUAGE }),
    system: Object.freeze({ name: "AIVA", code: "KAR·MIR", language: SYSTEM_LANGUAGE }),
    lou: Object.freeze({ name: "ルウ", code: "K 2.7 / TIR·DÆM", language: SYSTEM_LANGUAGE }),
    mizuha: Object.freeze({ name: "みず", code: "MIZUHA" }),
    amane: Object.freeze({ name: "あめ", code: "AMANE" }),
    sakuya: Object.freeze({ name: "saku", code: "SAKUYA" }),
    visitor: Object.freeze({ name: "あなた", code: "AL MIR", language: SYSTEM_LANGUAGE }),
  });
  const STORAGE_KEY = "gaiaSensewareTrueEnd:complete:v1";
  const CHARACTER_DELAY_MS = 29;
  const SCENE_BLACKOUT_MS = 360;
  const SCENE_TITLE_FADE_MS = 220;
  const SCENE_TITLE_HOLD_MS = 520;
  const SCENE_TITLE_OUT_MS = 180;
  const SCENE_REVEAL_MS = 460;
  const segmenter = typeof Intl?.Segmenter === "function"
    ? new Intl.Segmenter("ja", { granularity: "grapheme" })
    : null;

  const splitText = (value) => {
    const text = String(value || "");
    return segmenter ? [...segmenter.segment(text)].map(({ segment }) => segment) : Array.from(text);
  };

  const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const createElement = (tag, className = "", text = "") => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  };

  const createRuntime = ({ host, layer, onComplete, onExit, onStepRead, onLogOpen, onReady }) => {
    if (!(host instanceof HTMLElement) || !(layer instanceof HTMLElement)) return null;

    let sceneIndex = 0;
    let stepIndex = 0;
    let revealFrame = 0;
    let revealStartedAt = 0;
    let revealTokens = [];
    let revealing = false;
    let transitioning = false;
    let complete = false;
    let universeRuntime = null;
    let sceneCardTimer = 0;
    let sceneCardTimerResolve = null;
    let sceneCardFadeTimer = 0;
    let sceneCardFadeResolve = null;
    let renderRevision = 0;

    const shell = createElement("section", "true-end-shell");
    shell.tabIndex = 0;
    shell.setAttribute("role", "region");
    shell.setAttribute("aria-label", "惑星の放課後 GAIA SENSATION NOVACENE。画面をクリックまたはタップするか、Enterキーまたはスペースキーで進みます");

    const universe = createElement("canvas", "true-end-universe");
    universe.setAttribute("aria-hidden", "true");
    const header = createElement("header", "true-end-header");
    const brand = createElement("div", "true-end-brand");
    brand.append(
      createElement("span", "", story.subtitle),
      createElement("strong", "", story.title),
    );
    const sceneHeading = createElement("div", "true-end-scene-heading");
    const sceneNumber = createElement("span");
    const sceneTitle = createElement("strong");
    sceneHeading.append(sceneNumber, sceneTitle);
    header.append(brand, sceneHeading);

    const progress = createElement("div", "true-end-progress");
    const progressFill = createElement("i");
    progress.append(progressFill);

    const readout = createElement("aside", "true-end-readout");
    readout.hidden = true;
    readout.setAttribute("aria-label", "未来文明の走査表示");

    const dialogue = createElement("button", "true-end-dialogue");
    dialogue.type = "button";
    dialogue.setAttribute("aria-label", "次へ進む");
    const speaker = createElement("span", "true-end-speaker");
    const speakerCode = createElement("small", "true-end-speaker-code");
    const message = createElement("span", "true-end-message");
    const nextMark = createElement("i", "true-end-next", "▽");
    dialogue.append(speaker, speakerCode, message, nextMark);

    const footer = createElement("footer", "true-end-footer");
    const counter = createElement("span");
    footer.append(counter);

    const logButton = createElement("button", "true-end-log-button", "LOG");
    logButton.type = "button";
    logButton.setAttribute("aria-label", "NOVACENEの会話履歴を開く");

    const sceneCard = createElement("div", "true-end-scene-card");
    sceneCard.setAttribute("aria-hidden", "true");
    sceneCard.dataset.phase = "idle";
    const sceneCardContent = createElement("div", "true-end-scene-card-content");
    const sceneCardNumber = createElement("span");
    const sceneCardTitle = createElement("strong");
    sceneCardContent.append(sceneCardNumber, sceneCardTitle);
    sceneCard.append(sceneCardContent);

    const interfaceLayer = createElement("div", "true-end-interface");
    interfaceLayer.append(header, progress, readout, dialogue, footer);

    const finale = createElement("section", "true-end-finale");
    finale.hidden = true;
    const finaleLabel = createElement("span", "", story.finale.label);
    const finaleTitle = createElement("h2", "", story.finale.title);
    const finaleReadout = createElement("div");
    finaleReadout.lang = SYSTEM_LANGUAGE;
    story.finale.readout.forEach((line) => finaleReadout.append(createElement("code", "", line)));
    const finaleNote = createElement("p", "", "感じ取れる世界は、まだ増えていく。");
    const finaleExit = createElement("button", "", "世界を拡げる");
    finaleExit.type = "button";
    finale.append(finaleLabel, finaleTitle, finaleReadout, finaleNote, finaleExit);

    shell.append(
      universe,
      interfaceLayer,
      logButton,
      sceneCard,
      finale,
    );
    host.replaceChildren(shell);
    universeRuntime = globalThis.GaiaTrueEndWebGL?.create?.({ canvas: universe, shell }) || null;
    if (!universeRuntime) {
      universe.classList.add("is-fallback");
      universe.dataset.webglState = "fallback";
    }

    const scene = () => story.scenes[sceneIndex];
    const step = () => scene()?.steps?.[stepIndex];
    const totalSteps = story.scenes.reduce((sum, item) => sum + item.steps.length, 0);
    const absoluteStep = () => story.scenes
      .slice(0, sceneIndex)
      .reduce((sum, item) => sum + item.steps.length, 0) + stepIndex + 1;

    const stopReveal = () => {
      if (revealFrame) cancelAnimationFrame(revealFrame);
      revealFrame = 0;
      revealing = false;
      shell.classList.remove("is-revealing");
    };

    const finishReveal = () => {
      if (!revealing) return false;
      stopReveal();
      message.textContent = revealTokens.join("");
      nextMark.hidden = false;
      return true;
    };

    const renderReadout = (lines = []) => {
      readout.replaceChildren();
      if (lines.length > 0) {
        const readoutHeader = createElement("div", "true-end-readout-header");
        readoutHeader.lang = SYSTEM_LANGUAGE;
        const readoutSignal = createElement("span", "true-end-readout-signal", "SÆL·MIR");
        const readoutTrace = createElement("i", "true-end-readout-trace");
        readoutTrace.setAttribute("aria-hidden", "true");
        const readoutCount = createElement("small", "true-end-readout-count", `KAR ${String(lines.length).padStart(2, "0")}`);
        readoutHeader.append(readoutSignal, readoutTrace, readoutCount);

        const readoutList = createElement("div", "true-end-readout-list");
        lines.forEach((line, index) => {
          const row = createElement("div", "true-end-readout-row");
          row.style.setProperty("--readout-index", index);
          const marker = createElement("span", "true-end-readout-marker", String(index + 1).padStart(2, "0"));
          marker.setAttribute("aria-hidden", "true");
          const code = createElement("code", "", line);
          code.lang = /[\u3040-\u30ff\u3400-\u9fff]/u.test(line) ? "ja" : SYSTEM_LANGUAGE;
          const separator = line.indexOf(":");
          if (separator >= 0) {
            code.replaceChildren(
              createElement("span", "true-end-readout-key", line.slice(0, separator + 1)),
              createElement("span", "true-end-readout-value", line.slice(separator + 1)),
            );
          }
          row.append(marker, code);
          readoutList.append(row);
        });
        readout.append(readoutHeader, readoutList);
      }
      readout.hidden = lines.length === 0;
      shell.classList.toggle("has-readout", lines.length > 0);
    };

    const animateReveal = (now) => {
      if (!revealing) return;
      const visibleCount = Math.min(
        revealTokens.length,
        Math.floor((now - revealStartedAt) / CHARACTER_DELAY_MS) + 1,
      );
      message.textContent = revealTokens.slice(0, visibleCount).join("");
      if (visibleCount < revealTokens.length) {
        revealFrame = requestAnimationFrame(animateReveal);
        return;
      }
      stopReveal();
      nextMark.hidden = false;
    };

    const startReveal = (text) => {
      stopReveal();
      revealTokens = splitText(text);
      message.textContent = "";
      message.setAttribute("aria-label", text);
      nextMark.hidden = true;
      if (reducedMotion() || revealTokens.length < 2) {
        message.textContent = text;
        nextMark.hidden = false;
        return;
      }
      revealing = true;
      shell.classList.add("is-revealing");
      revealStartedAt = performance.now();
      revealFrame = requestAnimationFrame(animateReveal);
    };

    const setBackdrop = (name, immediate = false) => {
      shell.dataset.backdrop = name;
      return universeRuntime?.setScene?.(name, { immediate }) || Promise.resolve();
    };

    const setSceneTransitionPhase = (phase) => {
      sceneCard.dataset.phase = phase;
      shell.dataset.sectionTransitionPhase = phase;
      document.body.classList.toggle("true-end-section-transition", phase !== "idle");
      const sharedAudioDock = document.querySelector(".gaia-audio-dock");
      if (phase === "idle") sharedAudioDock?.style.removeProperty("opacity");
      else sharedAudioDock?.style.setProperty("opacity", "0", "important");
    };

    const stopSceneCardDelay = () => {
      window.clearTimeout(sceneCardTimer);
      sceneCardTimer = 0;
      const resolve = sceneCardTimerResolve;
      sceneCardTimerResolve = null;
      resolve?.();
    };

    const waitForSceneCard = (duration) => {
      stopSceneCardDelay();
      if (reducedMotion() || duration <= 0) return Promise.resolve();
      return new Promise((resolve) => {
        sceneCardTimerResolve = resolve;
        sceneCardTimer = window.setTimeout(() => {
          sceneCardTimer = 0;
          sceneCardTimerResolve = null;
          resolve();
        }, duration);
      });
    };

    const stopSceneCardFade = () => {
      window.clearTimeout(sceneCardFadeTimer);
      sceneCardFadeTimer = 0;
      const resolve = sceneCardFadeResolve;
      sceneCardFadeResolve = null;
      resolve?.();
    };

    const animateSceneOpacity = (target, from, to, duration) => {
      stopSceneCardFade();
      target.style.opacity = String(from);
      if (reducedMotion() || duration <= 0) {
        target.style.opacity = String(to);
        return Promise.resolve();
      }
      return new Promise((resolve) => {
        sceneCardFadeResolve = resolve;
        const startedAt = performance.now();
        const drawSceneOpacity = (now) => {
          const progress = Math.min(1, (now - startedAt) / duration);
          const eased = progress * progress * (3 - 2 * progress);
          target.style.opacity = String(from + (to - from) * eased);
          if (progress < 1) {
            sceneCardFadeTimer = window.setTimeout(() => drawSceneOpacity(performance.now()), 16);
            return;
          }
          sceneCardFadeTimer = 0;
          sceneCardFadeResolve = null;
          resolve();
        };
        drawSceneOpacity(startedAt);
      });
    };

    const showSceneSeparator = async ({ prepareScene, switchScene, onSceneReady } = {}) => {
      sceneCard.classList.add("is-active");
      sceneCardContent.style.opacity = "0";
      setSceneTransitionPhase("blackout");
      await animateSceneOpacity(sceneCard, 0, 1, SCENE_BLACKOUT_MS);
      if (!shell.isConnected || complete) return;

      setSceneTransitionPhase("black");
      prepareScene?.();
      setSceneTransitionPhase("title");
      await animateSceneOpacity(sceneCardContent, 0, 1, SCENE_TITLE_FADE_MS);
      if (!shell.isConnected || complete) return;

      setSceneTransitionPhase("switching");
      await Promise.all([
        Promise.resolve().then(() => switchScene?.()),
        waitForSceneCard(SCENE_TITLE_HOLD_MS),
      ]);
      if (!shell.isConnected || complete) return;

      setSceneTransitionPhase("ready");
      onSceneReady?.({ shell });
      await animateSceneOpacity(sceneCardContent, 1, 0, SCENE_TITLE_OUT_MS);
      if (!shell.isConnected || complete) return;

      setSceneTransitionPhase("reveal");
      await animateSceneOpacity(sceneCard, 1, 0, SCENE_REVEAL_MS);
      sceneCard.classList.remove("is-active");
      sceneCard.style.removeProperty("opacity");
      sceneCardContent.style.removeProperty("opacity");
      setSceneTransitionPhase("idle");
    };

    const syncSceneMetadata = () => {
      const current = scene();
      if (!current) return;
      sceneNumber.textContent = `VENA ${current.number}`;
      sceneNumber.lang = SYSTEM_LANGUAGE;
      sceneTitle.textContent = current.title;
      sceneCardNumber.textContent = `VENA ${current.number}`;
      sceneCardNumber.lang = SYSTEM_LANGUAGE;
      sceneCardTitle.textContent = current.title;
      shell.dataset.scene = current.id;
    };

    const syncSceneBackdrop = ({ immediate = false } = {}) => {
      const current = scene();
      if (!current) return Promise.resolve();
      return setBackdrop(current.backdrop, immediate);
    };

    const revealSceneAfterSeparator = async (options) => {
      await showSceneSeparator(options);
      if (!shell.isConnected || complete) return;
      shell.classList.remove("is-scene-separating");
      transitioning = false;
    };

    const renderStep = async () => {
      const current = step();
      if (!current) return false;
      const revision = ++renderRevision;
      const currentSpeaker = SPEAKERS[current.speaker || "narrator"] || SPEAKERS.narrator;
      await (universeRuntime?.setPresence?.(current.speaker || "narrator", {
        emphasis: current.emphasis === true,
        signal: current.id,
      }) || Promise.resolve());
      if (revision !== renderRevision || !shell.isConnected || complete) return false;
      shell.dataset.speaker = current.speaker || "narrator";
      shell.classList.toggle("is-emphasis", current.emphasis === true);
      speaker.textContent = currentSpeaker.name;
      speaker.lang = currentSpeaker.language || "ja";
      speaker.hidden = !currentSpeaker.name;
      speakerCode.textContent = currentSpeaker.code;
      speakerCode.lang = currentSpeaker.language || "ja";
      message.lang = current.speaker === "system" ? SYSTEM_LANGUAGE : "ja";
      renderReadout(current.readout || []);
      onStepRead?.(current);
      startReveal(current.text);
      shell.dataset.messageCommittedAt = performance.now().toFixed(3);
      counter.textContent = `${String(absoluteStep()).padStart(3, "0")} / ${String(totalSteps).padStart(3, "0")}`;
      progressFill.style.width = `${(absoluteStep() / totalSteps) * 100}%`;
      dialogue.setAttribute("aria-label", `${currentSpeaker.name ? `${currentSpeaker.name}。` : ""}${current.text}。次へ進む`);
      return true;
    };

    const showFinale = () => {
      stopReveal();
      complete = true;
      shell.classList.add("is-finale");
      universeRuntime?.setPresence?.("narrator", { signal: "beyond-finale" });
      dialogue.hidden = true;
      readout.hidden = true;
      footer.hidden = true;
      header.hidden = true;
      progress.hidden = true;
      finale.hidden = false;
      try {
        window.localStorage.setItem(STORAGE_KEY, new Date().toISOString());
      } catch {
        // The ending remains available when storage is disabled.
      }
      onComplete?.();
      requestAnimationFrame(() => finaleExit.focus({ preventScroll: true }));
    };

    const advance = () => {
      if (complete || transitioning) return;
      if (finishReveal()) return;
      const currentScene = scene();
      if (stepIndex < currentScene.steps.length - 1) {
        transitioning = true;
        stepIndex += 1;
        renderStep().finally(() => {
          if (!shell.isConnected || complete) return;
          transitioning = false;
        });
        return;
      }
      if (sceneIndex >= story.scenes.length - 1) {
        showFinale();
        return;
      }

      transitioning = true;
      stopReveal();
      shell.classList.add("is-scene-separating");
      void revealSceneAfterSeparator({
        prepareScene: () => {
          sceneIndex += 1;
          stepIndex = 0;
          syncSceneMetadata();
        },
        switchScene: async () => {
          await syncSceneBackdrop({ immediate: true });
          await renderStep();
        },
      });
    };

    let dialoguePointerOrigin = null;
    let suppressDialogueClick = false;
    dialogue.addEventListener("pointerdown", (event) => {
      if (event.button !== 0) return;
      dialoguePointerOrigin = { id: event.pointerId, x: event.clientX, y: event.clientY };
      suppressDialogueClick = false;
    });
    dialogue.addEventListener("pointermove", (event) => {
      if (!dialoguePointerOrigin || event.pointerId !== dialoguePointerOrigin.id) return;
      if (Math.hypot(event.clientX - dialoguePointerOrigin.x, event.clientY - dialoguePointerOrigin.y) > 6) {
        suppressDialogueClick = true;
      }
    });
    dialogue.addEventListener("pointerup", (event) => {
      if (!dialoguePointerOrigin || event.pointerId !== dialoguePointerOrigin.id) return;
      dialoguePointerOrigin = null;
      window.setTimeout(() => { suppressDialogueClick = false; }, 0);
    });
    dialogue.addEventListener("pointercancel", () => {
      dialoguePointerOrigin = null;
      suppressDialogueClick = false;
    });
    dialogue.addEventListener("click", (event) => {
      event.stopPropagation();
      if (suppressDialogueClick) {
        event.preventDefault();
        suppressDialogueClick = false;
        return;
      }
      advance();
    });
    logButton.addEventListener("click", (event) => {
      event.stopPropagation();
      onLogOpen?.();
    });
    shell.addEventListener("click", (event) => {
      event.stopPropagation();
      const interactiveTarget = event.target instanceof Element
        ? event.target.closest(".true-end-dialogue, .true-end-log-button, .true-end-finale")
        : null;
      if (interactiveTarget) return;
      advance();
    });
    shell.addEventListener("keydown", (event) => {
      if (!(["Enter", " "].includes(event.key)) || event.repeat || event.isComposing || event.target.closest("button")) return;
      event.preventDefault();
      advance();
    });
    finaleExit.addEventListener("click", () => onExit?.());

    transitioning = true;
    shell.classList.add("is-scene-separating");
    syncSceneMetadata();
    void revealSceneAfterSeparator({
      switchScene: async () => {
        await syncSceneBackdrop({ immediate: true });
        await renderStep();
      },
      onSceneReady: onReady,
    });
    requestAnimationFrame(() => shell.focus({ preventScroll: true }));

    return Object.freeze({
      shell,
      destroy() {
        renderRevision += 1;
        document.body.classList.remove("true-end-section-transition");
        document.querySelector(".gaia-audio-dock")?.style.removeProperty("opacity");
        stopReveal();
        stopSceneCardDelay();
        stopSceneCardFade();
        universeRuntime?.destroy?.();
        universeRuntime = null;
        shell.remove();
      },
    });
  };

  globalThis.GaiaTrueEnd = Object.freeze({
    start(options) {
      return createRuntime(options || {});
    },
    isComplete() {
      try {
        return Boolean(window.localStorage.getItem(STORAGE_KEY));
      } catch {
        return false;
      }
    },
  });
})();
