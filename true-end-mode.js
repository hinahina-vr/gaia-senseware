(() => {
  "use strict";

  const story = globalThis.GAIA_TRUE_END_STORY;
  if (!story) return;

  const SPEAKERS = Object.freeze({
    narrator: Object.freeze({ name: "", code: "OBSERVATION" }),
    system: Object.freeze({ name: "SYSTEM", code: "ARCHIVAL READOUT" }),
    lou: Object.freeze({ name: "ルウ", code: "K2.7 CONTACT FORM" }),
    mizuha: Object.freeze({ name: "みず", code: "MIZUHA" }),
    amane: Object.freeze({ name: "あめ", code: "AMANE" }),
    sakuya: Object.freeze({ name: "saku", code: "SAKUYA" }),
    visitor: Object.freeze({ name: "あなた", code: "LOCAL OBSERVER" }),
  });
  const STORAGE_KEY = "gaiaSensewareTrueEnd:complete:v1";
  const CHARACTER_DELAY_MS = 29;
  const SCENE_CROSSFADE_MS = 720;
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

  const createRuntime = ({ host, layer, onComplete, onExit, onStepRead, onLogOpen }) => {
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

    const shell = createElement("section", "true-end-shell");
    shell.tabIndex = 0;
    shell.setAttribute("role", "region");
    shell.setAttribute("aria-label", "惑星の放課後 GAIA SENSATION Beyond。メッセージウィンドウ、Enterキー、またはスペースキーで進みます");

    const universe = createElement("canvas", "true-end-universe");
    universe.setAttribute("aria-hidden", "true");
    const weave = createElement("div", "true-end-weave");
    weave.setAttribute("aria-hidden", "true");
    for (let index = 0; index < 8; index += 1) weave.append(createElement("i"));
    const relic = createElement("div", "true-end-relic");
    relic.setAttribute("aria-hidden", "true");
    relic.append(createElement("i"), createElement("i"), createElement("i"), createElement("i"));
    const lou = createElement("div", "true-end-lou");
    lou.setAttribute("aria-hidden", "true");
    const louImage = createElement("img", "true-end-lou-image");
    louImage.src = "./assets/true-end/true-end-luu-cute-v1.webp";
    louImage.alt = "";
    lou.append(louImage, createElement("i", "true-end-lou-core"), createElement("i", "true-end-lou-orbit"));

    const thoughtforms = createElement("div", "true-end-thoughtforms");
    thoughtforms.setAttribute("aria-hidden", "true");
    [
      ["mizuha", "./assets/true-end/true-end-mizuha-thoughtform-v1.webp"],
      ["amane", "./assets/true-end/true-end-amane-thoughtform-v1.webp"],
      ["sakuya", "./assets/true-end/true-end-sakuya-thoughtform-v1.webp"],
    ].forEach(([speakerName, src]) => {
      const image = createElement("img", `true-end-thoughtform true-end-thoughtform-${speakerName}`);
      image.src = src;
      image.alt = "";
      image.dataset.speaker = speakerName;
      thoughtforms.append(image);
    });

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
    const location = createElement("span", "", "2.7 MILLION YEARS AFTER THE ANTHROPOCENE");
    const counter = createElement("span");
    footer.append(location, counter);

    const logButton = createElement("button", "true-end-log-button", "LOG");
    logButton.type = "button";
    logButton.setAttribute("aria-label", "Beyondの会話履歴を開く");

    const sceneCard = createElement("div", "true-end-scene-card");
    sceneCard.setAttribute("aria-hidden", "true");
    const sceneCardNumber = createElement("span");
    const sceneCardTitle = createElement("strong");
    sceneCard.append(sceneCardNumber, sceneCardTitle);

    const finale = createElement("section", "true-end-finale");
    finale.hidden = true;
    const finaleLabel = createElement("span", "", story.finale.label);
    const finaleTitle = createElement("h2", "", story.finale.title);
    const finaleReadout = createElement("div");
    story.finale.readout.forEach((line) => finaleReadout.append(createElement("code", "", line)));
    const finaleNote = createElement("p", "", "感じ取れる世界は、まだ増えていく。");
    const finaleExit = createElement("button", "", "タイトルへ戻る");
    finaleExit.type = "button";
    finale.append(finaleLabel, finaleTitle, finaleReadout, finaleNote, finaleExit);

    shell.append(
      universe,
      weave,
      relic,
      lou,
      thoughtforms,
      header,
      progress,
      readout,
      dialogue,
      footer,
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
      lines.forEach((line) => readout.append(createElement("code", "", line)));
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
      universeRuntime?.setScene?.(name, { immediate });
    };

    const syncScene = ({ immediate = false } = {}) => {
      const current = scene();
      if (!current) return;
      sceneNumber.textContent = `SCENE ${current.number}`;
      sceneTitle.textContent = current.title;
      sceneCardNumber.textContent = `SCENE ${current.number}`;
      sceneCardTitle.textContent = current.title;
      shell.dataset.scene = current.id;
      setBackdrop(current.backdrop, immediate);
      sceneCard.classList.remove("is-visible");
      void sceneCard.offsetWidth;
      sceneCard.classList.add("is-visible");
      window.setTimeout(() => sceneCard.classList.remove("is-visible"), reducedMotion() ? 0 : 1500);
    };

    const renderStep = () => {
      const current = step();
      if (!current) return;
      const currentSpeaker = SPEAKERS[current.speaker || "narrator"] || SPEAKERS.narrator;
      shell.dataset.speaker = current.speaker || "narrator";
      shell.classList.toggle("is-emphasis", current.emphasis === true);
      speaker.textContent = currentSpeaker.name;
      speaker.hidden = !currentSpeaker.name;
      speakerCode.textContent = currentSpeaker.code;
      renderReadout(current.readout || []);
      onStepRead?.(current);
      startReveal(current.text);
      counter.textContent = `${String(absoluteStep()).padStart(3, "0")} / ${String(totalSteps).padStart(3, "0")}`;
      progressFill.style.width = `${(absoluteStep() / totalSteps) * 100}%`;
      dialogue.setAttribute("aria-label", `${currentSpeaker.name ? `${currentSpeaker.name}。` : ""}${current.text}。次へ進む`);
    };

    const showFinale = () => {
      stopReveal();
      complete = true;
      shell.classList.add("is-finale");
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
        stepIndex += 1;
        renderStep();
        return;
      }
      if (sceneIndex >= story.scenes.length - 1) {
        showFinale();
        return;
      }

      transitioning = true;
      shell.classList.add("is-scene-changing");
      const delay = reducedMotion() ? 0 : SCENE_CROSSFADE_MS / 2;
      window.setTimeout(() => {
        sceneIndex += 1;
        stepIndex = 0;
        syncScene();
        renderStep();
        requestAnimationFrame(() => {
          shell.classList.remove("is-scene-changing");
          window.setTimeout(() => { transitioning = false; }, reducedMotion() ? 0 : SCENE_CROSSFADE_MS / 2);
        });
      }, delay);
    };

    dialogue.addEventListener("click", advance);
    logButton.addEventListener("click", (event) => {
      event.stopPropagation();
      onLogOpen?.();
    });
    shell.addEventListener("click", (event) => event.stopPropagation());
    shell.addEventListener("keydown", (event) => {
      if (!(["Enter", " "].includes(event.key)) || event.repeat || event.isComposing || event.target.closest("button")) return;
      event.preventDefault();
      advance();
    });
    finaleExit.addEventListener("click", () => onExit?.());

    syncScene({ immediate: true });
    renderStep();
    requestAnimationFrame(() => shell.focus({ preventScroll: true }));

    return Object.freeze({
      shell,
      destroy() {
        stopReveal();
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
