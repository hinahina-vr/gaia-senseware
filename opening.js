(() => {
  "use strict";

  const opening = document.querySelector("#gaia-opening");
  const preloadPanel = document.querySelector("#gaia-opening-preload");
  const preloadPercent = document.querySelector("#gaia-preload-percent");
  const preloadBar = document.querySelector("#gaia-preload-bar");
  const preloadStatus = document.querySelector("#gaia-preload-status");
  const soundGate = document.querySelector("#gaia-opening-sound-gate");
  const soundOnButton = document.querySelector("#gaia-opening-sound-on");
  const soundOffButton = document.querySelector("#gaia-opening-sound-off");
  const openingVolume = document.querySelector("#gaia-opening-volume");
  const openingVolumeValue = document.querySelector("#gaia-opening-volume-value");
  const skipButton = document.querySelector("#gaia-opening-skip");
  const finalMenu = document.querySelector("#gaia-opening-final-menu");
  const finalStoryButton = document.querySelector("#gaia-opening-route-story");
  const finalOtherButton = document.querySelector("#gaia-opening-route-other");
  const chatLog = document.querySelector("#gaia-opening-chat-log");
  const lateLog = document.querySelector("#gaia-opening-late-log");
  const typingIndicator = document.querySelector("#gaia-opening-sakuya-typing");
  const morningDialogue = document.querySelector("#gaia-opening-morning-dialogue");
  const chairChat = document.querySelector("#gaia-opening-chair-chat");
  const presence = document.querySelector("#gaia-opening-presence");
  const chairDialogue = document.querySelector("#gaia-opening-chair-dialogue");
  const titleNarration = document.querySelector("#gaia-opening-title-narration");
  const titleLockup = document.querySelector("#gaia-opening-title-lockup");
  const progressBar = document.querySelector("#gaia-opening-progress-bar");
  const progressTime = document.querySelector("#gaia-opening-progress-time");
  const audioDock = document.querySelector("#gaia-audio-dock");
  const audioToggle = document.querySelector("#gaia-audio-toggle");
  const audioToggleIcon = document.querySelector("#gaia-audio-toggle-icon");
  const audioVolume = document.querySelector("#gaia-audio-volume");
  const audioVolumeValue = document.querySelector("#gaia-audio-volume-value");

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const directDestination = ["#earth", "#japan", "#data", "#source", "#concept"].includes(
    window.location.hash,
  );
  const speedParameter = Number(new URLSearchParams(window.location.search).get("openingSpeed"));
  const TIME_SCALE = Number.isFinite(speedParameter) && speedParameter > 0
    ? Math.min(4, Math.max(0.02, speedParameter))
    : reducedMotion
      ? 0.12
      : 1;
  const TOTAL_SECONDS = 120;
  const EXIT_MS = reducedMotion ? 120 : 900;

  // This array is also read by scripts/export-story-script.mjs.
  // Sakuya entries must never receive a sound key.
  const OPENING_SCRIPT = [
    { at: 0, type: "scene", scene: "chat", label: "00:08　前夜のチャット" },
    { at: 1.5, type: "message", target: "chat", time: "23:47", speaker: "MIZUHA", text: "明日の場所、海の見える共同制作室で\n合っていますの？", sound: "mizuha" },
    { at: 5, type: "message", target: "chat", time: "23:48", speaker: "AMANE", text: "合ってる。\n駅からちょっと遠いね。", sound: "amane" },
    { at: 8, type: "message", target: "chat", time: "23:48", speaker: "MIZUHA", text: "徒歩18分ですわ。\nサクヤの「すぐそこ」は信用なりませんの。", sound: "mizuha" },
    { at: 12, type: "message", target: "chat", time: "23:49", speaker: "AMANE", text: "だいぶやってんね。", sound: "amane" },
    { at: 16, type: "message", target: "chat", time: "23:50", speaker: "SAKUYA", text: "目印は青りんご。" },
    { at: 19, type: "message", target: "chat", time: "23:50", speaker: "AMANE", text: "なんで青りんご。", sound: "amane" },
    { at: 22, type: "message", target: "chat", time: "23:51", speaker: "SAKUYA", text: "三人とも、画面の外では初対面だから。" },
    { at: 25, type: "message", target: "chat", time: "23:51", speaker: "MIZUHA", text: "ええ。古典的ですが、分かりやすくはありますわね。", sound: "mizuha" },
    { at: 29, type: "message", target: "chat", time: "23:52", speaker: "AMANE", text: "ほんとに持ってくる人、おるかな。", sound: "amane" },
    { at: 33, type: "message", target: "chat", time: "23:52", speaker: "MIZUHA", text: "私が持つんですの？", sound: "mizuha" },
    { at: 37, type: "message", target: "chat", time: "23:53", speaker: "SAKUYA", text: "お願い。" },

    { at: 45, type: "scene", scene: "late", label: "00:45　最後のオンライン" },
    { at: 47, type: "message", target: "late", time: "02:14", speaker: "SAKUYA", text: "データだけ先に上げた。\nきれいにしすぎないでね。" },
    { at: 51, type: "typing", state: "start", speaker: "SAKUYA", text: "SAKUYA is typing...", duration: 4.8 },
    { at: 55.8, type: "typing", state: "end", speaker: "SAKUYA" },

    { at: 65, type: "scene", scene: "morning", label: "01:05　翌朝の逗子" },
    { at: 67, type: "dialogue", target: "morning", speaker: "アマネ", text: "……青りんご" },
    { at: 70.5, type: "dialogue", target: "morning", speaker: "ミズハ", text: "ええ。あなたがアマネで合っていますの？" },
    { at: 74.5, type: "dialogue", target: "morning", speaker: "アマネ", text: "合ってる。本当に持ってくる人、あるんだ" },
    { at: 78.5, type: "dialogue", target: "morning", speaker: "ミズハ", text: "指定した本人が来なければ、ただの果物ですけれど" },
    { at: 82.5, type: "dialogue", target: "morning", speaker: "アマネ", text: "声なら、すぐ分かったかも" },
    { at: 86, type: "dialogue", target: "morning", speaker: "ミズハ", text: "私もですわ。ほいじゃ――改めまして" },
    { at: 90, type: "dialogue", target: "morning", speaker: "アマネ", text: "ええ。はじめまして" },

    { at: 95, type: "scene", scene: "chairs", label: "01:35　三つの椅子" },
    { at: 97, type: "message", target: "chairs", time: "10:03", speaker: "AMANE", text: "着いた。", sound: "amane" },
    { at: 100, type: "message", target: "chairs", time: "10:03", speaker: "MIZUHA", text: "青りんごも到着しましたわ。", sound: "mizuha" },
    { at: 103, type: "presence", name: "SAKUYA", text: "last online 02:14" },
    { at: 105, type: "dialogue", target: "chairs", speaker: "ミズハ", text: "サクヤは、何時に来ると言っていました？" },
    { at: 108, type: "dialogue", target: "chairs", speaker: "アマネ", text: "時間、聞いてない" },

    { at: 110, type: "scene", scene: "title", label: "01:50　タイトル" },
    { at: 111, type: "music", state: "start", note: "この瞬間に初めて音楽が入る" },
    { at: 112, type: "narration", text: "私たちは、三人で会うはずだった。" },
    { at: 115, type: "title", text: "空白のところで、地球は待っている", subtitle: "GAIA SENSEWARE GX" },
    { at: 118, type: "menu" },
  ];

  const waitMs = (seconds) => Math.round(seconds * 1000 * TIME_SCALE);
  const timers = new Set();
  const schedule = (seconds, callback) => {
    const timer = window.setTimeout(() => {
      timers.delete(timer);
      callback();
    }, waitMs(seconds));
    timers.add(timer);
    return timer;
  };

  const syncAudioControls = (state = window.GaiaOpeningAudio?.getState?.()) => {
    const volume = Math.round(Math.max(0, Math.min(1, state?.volume ?? 0.1)) * 100);
    const isMuted = state?.muted ?? true;
    if (openingVolume instanceof HTMLInputElement && !opening?.classList.contains("is-running")) {
      openingVolume.value = String(volume || 10);
    }
    if (audioVolume instanceof HTMLInputElement) audioVolume.value = String(volume);
    if (openingVolumeValue) openingVolumeValue.textContent = `${openingVolume?.value || volume}%`;
    if (audioVolumeValue) audioVolumeValue.textContent = `${volume}%`;
    if (audioDock) audioDock.dataset.muted = String(isMuted);
    if (audioToggle) {
      audioToggle.setAttribute("aria-pressed", String(isMuted));
      audioToggle.setAttribute("aria-label", isMuted ? "BGMを再生" : "BGMを消音");
    }
    if (audioToggleIcon) audioToggleIcon.dataset.muted = String(isMuted);
  };

  const revealAudioDock = () => {
    if (!audioDock) return;
    audioDock.hidden = false;
    requestAnimationFrame(() => audioDock.classList.add("is-visible"));
  };

  const setVolumeFromInput = (input) => {
    if (!(input instanceof HTMLInputElement)) return;
    window.GaiaOpeningAudio?.setVolume?.(Number(input.value) / 100);
  };

  openingVolume?.addEventListener("input", () => {
    if (openingVolumeValue) openingVolumeValue.textContent = `${openingVolume.value}%`;
  });
  audioVolume?.addEventListener("input", () => setVolumeFromInput(audioVolume));
  audioToggle?.addEventListener("click", async () => {
    await window.GaiaOpeningAudio?.toggleMuted?.();
    syncAudioControls();
  });
  window.addEventListener("gaia:audio-state", (event) => syncAudioControls(event.detail));
  syncAudioControls();

  if (!opening) {
    revealAudioDock();
    return;
  }

  if (directDestination) {
    opening.hidden = true;
    revealAudioDock();
    return;
  }

  document.body.classList.add("gaia-opening-active");
  opening.style.setProperty("--opening-total-duration", `${waitMs(TOTAL_SECONDS)}ms`);

  const createSoundEngine = () => {
    let context = null;
    let enabled = false;
    let waveSource = null;
    let waveGain = null;

    const ensureContext = async () => {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return null;
      if (!context) context = new AudioContextClass();
      if (context.state === "suspended") await context.resume();
      return context;
    };

    const key = (voice) => {
      if (!enabled || !context) return;
      const duration = voice === "mizuha" ? 0.026 : 0.014;
      const frameCount = Math.max(1, Math.floor(context.sampleRate * duration));
      const buffer = context.createBuffer(1, frameCount, context.sampleRate);
      const data = buffer.getChannelData(0);
      for (let index = 0; index < frameCount; index += 1) {
        const envelope = Math.pow(1 - index / frameCount, voice === "mizuha" ? 1.8 : 3.2);
        data[index] = (Math.random() * 2 - 1) * envelope;
      }
      const source = context.createBufferSource();
      const filter = context.createBiquadFilter();
      const gain = context.createGain();
      filter.type = "bandpass";
      filter.frequency.value = voice === "mizuha" ? 1150 : 2450;
      filter.Q.value = voice === "mizuha" ? 1.1 : 1.8;
      gain.gain.value = voice === "mizuha" ? 0.065 : 0.045;
      source.buffer = buffer;
      source.connect(filter).connect(gain).connect(context.destination);
      source.start();
    };

    const startWaves = () => {
      if (!enabled || !context || waveSource) return;
      const duration = 4;
      const frameCount = Math.floor(context.sampleRate * duration);
      const buffer = context.createBuffer(1, frameCount, context.sampleRate);
      const data = buffer.getChannelData(0);
      let last = 0;
      for (let index = 0; index < frameCount; index += 1) {
        const white = Math.random() * 2 - 1;
        last = last * 0.985 + white * 0.015;
        data[index] = last;
      }
      waveSource = context.createBufferSource();
      waveGain = context.createGain();
      const filter = context.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 760;
      waveGain.gain.value = 0.055;
      waveSource.buffer = buffer;
      waveSource.loop = true;
      waveSource.connect(filter).connect(waveGain).connect(context.destination);
      waveSource.start();
    };

    const stopWaves = () => {
      if (!waveSource) return;
      try { waveSource.stop(); } catch { /* already stopped */ }
      waveSource.disconnect();
      waveGain?.disconnect();
      waveSource = null;
      waveGain = null;
    };

    return {
      async enable(nextEnabled) {
        enabled = Boolean(nextEnabled);
        if (enabled) await ensureContext();
      },
      key,
      startWaves,
      stopWaves,
      close() {
        stopWaves();
        context?.close?.();
        context = null;
      },
    };
  };

  const soundEngine = createSoundEngine();
  let finished = false;
  let started = false;
  let soundEnabled = false;
  let selectedVolume = 0.1;
  let progressFrame = 0;
  let progressStartedAt = 0;

  const setScene = (scene) => {
    opening.dataset.scene = scene;
    opening.querySelectorAll("[data-opening-scene]").forEach((panel) => {
      const active = panel.dataset.openingScene === scene;
      panel.classList.toggle("is-active", active);
      panel.setAttribute("aria-hidden", String(!active));
    });
    if (scene === "morning") soundEngine.startWaves();
    if (scene === "title") soundEngine.stopWaves();
  };

  const scrollLog = (container) => {
    if (!(container instanceof HTMLElement)) return;
    requestAnimationFrame(() => container.scrollTo({ top: container.scrollHeight, behavior: "smooth" }));
  };

  const renderTypedText = (element, entry) => {
    const glyphs = Array.from(entry.text);
    if (!entry.sound || reducedMotion || TIME_SCALE < 0.08) {
      element.textContent = entry.text;
      return;
    }

    element.textContent = "";
    const interval = Math.max(12, waitMs(entry.sound === "mizuha" ? 0.055 : 0.026));
    let index = 0;
    const typeNext = () => {
      if (finished || index >= glyphs.length) return;
      const glyph = glyphs[index];
      element.textContent += glyph;
      if (glyph.trim() && index % (entry.sound === "mizuha" ? 2 : 1) === 0) {
        soundEngine.key(entry.sound);
      }
      index += 1;
      const timer = window.setTimeout(() => {
        timers.delete(timer);
        typeNext();
      }, interval);
      timers.add(timer);
    };
    typeNext();
  };

  const appendMessage = (container, entry) => {
    if (!(container instanceof HTMLElement)) return;
    const message = document.createElement("article");
    message.className = `gaia-record-message gaia-record-message--${entry.speaker.toLowerCase()}`;
    message.dataset.speaker = entry.speaker;

    const meta = document.createElement("p");
    meta.className = "gaia-record-message-meta";
    meta.innerHTML = `<time>${entry.time}</time><strong>${entry.speaker}</strong>`;

    const text = document.createElement("p");
    text.className = "gaia-record-message-text";
    message.append(meta, text);
    container.append(message);
    requestAnimationFrame(() => message.classList.add("is-visible"));
    renderTypedText(text, entry);
    scrollLog(container);
  };

  const appendDialogue = (container, entry) => {
    if (!(container instanceof HTMLElement)) return;
    const line = document.createElement("p");
    line.className = "gaia-record-dialogue-line";
    const speaker = document.createElement("strong");
    speaker.textContent = entry.speaker;
    const text = document.createElement("span");
    text.textContent = `「${entry.text}」`;
    line.append(speaker, text);
    container.append(line);
    requestAnimationFrame(() => line.classList.add("is-visible"));
    while (container.children.length > 3) container.firstElementChild?.remove();
  };

  const startMusic = async () => {
    if (!soundEnabled) return;
    window.GaiaOpeningAudio?.setVolume?.(selectedVolume, 1.8);
    await window.GaiaOpeningAudio?.start?.(selectedVolume);
    syncAudioControls();
  };

  const showMenu = () => {
    if (!(finalMenu instanceof HTMLElement)) return;
    finalMenu.hidden = false;
    requestAnimationFrame(() => {
      finalMenu.classList.add("is-visible");
      finalStoryButton?.focus({ preventScroll: true });
    });
  };

  const applyEntry = (entry) => {
    if (finished) return;
    if (entry.type === "scene") {
      setScene(entry.scene);
      return;
    }
    if (entry.type === "message") {
      const targets = { chat: chatLog, late: lateLog, chairs: chairChat };
      appendMessage(targets[entry.target], entry);
      return;
    }
    if (entry.type === "typing") {
      if (typingIndicator) {
        typingIndicator.classList.toggle("is-visible", entry.state === "start");
        typingIndicator.setAttribute("aria-hidden", String(entry.state !== "start"));
      }
      return;
    }
    if (entry.type === "dialogue") {
      appendDialogue(entry.target === "morning" ? morningDialogue : chairDialogue, entry);
      return;
    }
    if (entry.type === "presence") {
      if (presence) {
        presence.querySelector("strong").textContent = entry.name;
        presence.querySelector("span").textContent = entry.text;
        presence.classList.add("is-visible");
      }
      return;
    }
    if (entry.type === "music") {
      void startMusic();
      return;
    }
    if (entry.type === "narration") {
      if (titleNarration) {
        titleNarration.textContent = entry.text;
        titleNarration.classList.add("is-visible");
      }
      return;
    }
    if (entry.type === "title") {
      titleLockup?.classList.add("is-visible");
      return;
    }
    if (entry.type === "menu") showMenu();
  };

  const updateProgress = (time) => {
    if (!started || finished) return;
    const elapsed = Math.min(TOTAL_SECONDS, (time - progressStartedAt) / 1000 / TIME_SCALE);
    const progress = elapsed / TOTAL_SECONDS;
    if (progressBar) progressBar.style.transform = `scaleX(${progress})`;
    if (progressTime) {
      const minutes = Math.floor(elapsed / 60);
      const seconds = Math.floor(elapsed % 60);
      progressTime.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    }
    progressFrame = requestAnimationFrame(updateProgress);
  };

  const startTimeline = () => {
    if (started || finished) return;
    started = true;
    opening.classList.add("is-running");
    opening.classList.remove("is-awaiting-sound");
    soundGate?.classList.add("is-decided");
    schedule(0.35, () => { if (soundGate) soundGate.hidden = true; });
    OPENING_SCRIPT.forEach((entry) => schedule(entry.at, () => applyEntry(entry)));
    progressStartedAt = performance.now();
    progressFrame = requestAnimationFrame(updateProgress);
  };

  const chooseSound = async (enabled) => {
    if (started || finished) return;
    soundEnabled = Boolean(enabled);
    selectedVolume = Number(openingVolume?.value ?? 10) / 100;
    await soundEngine.enable(soundEnabled);

    if (soundEnabled) {
      // Unlock media playback during the click, then reset it. Music itself
      // remains silent until the 01:50 title scene.
      await window.GaiaOpeningAudio?.start?.(0);
      window.GaiaOpeningAudio?.stop?.(0);
    } else {
      await window.GaiaOpeningAudio?.setMuted?.(true);
    }

    startTimeline();
  };

  const skipToTitle = () => {
    if (finished || opening.dataset.scene === "title") {
      showMenu();
      return;
    }
    timers.forEach((timer) => window.clearTimeout(timer));
    timers.clear();
    setScene("title");
    titleNarration?.classList.add("is-visible");
    titleLockup?.classList.add("is-visible");
    if (progressBar) progressBar.style.transform = "scaleX(1)";
    if (progressTime) progressTime.textContent = "02:00";
    void startMusic();
    showMenu();
  };

  const finish = (destination = "menu") => {
    if (finished) return;
    finished = true;
    timers.forEach((timer) => window.clearTimeout(timer));
    timers.clear();
    cancelAnimationFrame(progressFrame);
    soundEngine.stopWaves();
    finalMenu?.classList.remove("is-visible");
    if (destination === "story") {
      history.replaceState(null, "", `${window.location.pathname}${window.location.search}#story`);
    }
    window.dispatchEvent(new CustomEvent("gaia:opening-complete"));
    opening.classList.add("is-leaving");
    window.setTimeout(() => {
      opening.hidden = true;
      opening.classList.remove("is-running", "is-leaving");
      document.body.classList.remove("gaia-opening-active");
      revealAudioDock();
      if (destination === "story") {
        void window.GaiaOpeningAudio?.switchTrack?.("story", 0.8);
        requestAnimationFrame(() => {
          window.dispatchEvent(new CustomEvent("gaia:novel-open-at-mode", {
            detail: { index: 0, source: "opening" },
          }));
        });
      }
    }, EXIT_MS);
  };

  soundOnButton?.addEventListener("click", () => void chooseSound(true));
  soundOffButton?.addEventListener("click", () => void chooseSound(false));
  skipButton?.addEventListener("click", skipToTitle);
  finalStoryButton?.addEventListener("click", () => finish("story"));
  finalOtherButton?.addEventListener("click", () => finish("menu"));
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && started && !finished) skipToTitle();
  });
  window.addEventListener("pagehide", () => {
    timers.forEach((timer) => window.clearTimeout(timer));
    cancelAnimationFrame(progressFrame);
    soundEngine.close();
  });

  const preloadAssets = [
    "./assets/visuals-07/opening-keyvisual-v1.webp",
    "./assets/visuals-07/zushi-campus-story-bg-v3.webp",
  ];
  let settled = 0;
  const total = preloadAssets.length + 1;
  const updatePreload = (message = "") => {
    const percentage = Math.round((settled / total) * 100);
    if (preloadPercent) preloadPercent.textContent = String(percentage);
    if (preloadBar) preloadBar.style.transform = `scaleX(${percentage / 100})`;
    if (preloadStatus) preloadStatus.textContent = message || `記録を読み込んでいます　${settled} / ${total}`;
  };
  const preloadImage = (source) => new Promise((resolve) => {
    const image = new Image();
    const done = () => {
      settled += 1;
      updatePreload();
      resolve();
    };
    image.onload = done;
    image.onerror = done;
    image.src = source;
  });
  const preloadAudio = async () => {
    try { await window.GaiaOpeningAudio?.preload?.(); } finally {
      settled += 1;
      updatePreload();
    }
  };

  updatePreload();
  Promise.race([
    Promise.all([...preloadAssets.map(preloadImage), preloadAudio()]),
    new Promise((resolve) => window.setTimeout(resolve, 5000)),
  ]).then(() => {
    if (preloadBar) preloadBar.style.transform = "scaleX(1)";
    if (preloadPercent) preloadPercent.textContent = "100";
    if (preloadStatus) preloadStatus.textContent = "記録を再生できます";
    window.setTimeout(() => {
      if (preloadPanel) preloadPanel.hidden = true;
      opening.classList.remove("is-preloading");
      soundOnButton?.focus({ preventScroll: true });
    }, 260);
  });
})();
