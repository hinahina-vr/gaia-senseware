(() => {
  "use strict";

  const TRACKS = Object.freeze({
    opening: "./assets/audio/satellite-forecast-hope.mp3",
    story: "./assets/audio/satellite-forecast-calm.mp3",
    windowlight: "./assets/audio/planet-forecast-windowlight.mp3",
    firstlight: "./assets/audio/planet-forecast-first-light.mp3",
    foldedwind: "./assets/audio/folded-wind-message.mp3",
    snowfire: "./assets/audio/snowfire-signal.mp3",
    snowafter: "./assets/audio/snowfire-afterimage.mp3",
    moonbook: "./assets/audio/moonlit-observation-notebook.mp3",
    moonsave: "./assets/audio/moonlit-source-save.mp3",
    moonreopen: "./assets/audio/moonlit-reopen.mp3",
    ending: "./assets/audio/after-school-afterglow.mp3",
  });
  const DEFAULT_VOLUME = 0.1;
  const VOLUME_STORAGE_KEY = "gaia-senseware-bgm-volume";
  const NAVIGATION_STATE_KEY = "gaia-senseware-bgm-navigation:v1";
  const NAVIGATION_STATE_MAX_AGE_MS = 30_000;
  const TRACK_SWITCH_FADE_MULTIPLIER = 2;
  const TRACK_SWITCH_FADE_IN_SECONDS = 0.8 * TRACK_SWITCH_FADE_MULTIPLIER;
  const scriptBaseUrl = new URL("./", document.currentScript?.src || document.baseURI);

  let audio = null;
  let activeTrack = "opening";
  const players = new Map();
  const preloadPromises = new Map();
  let fadeFrame = 0;
  let stopTimer = 0;
  let switchSerial = 0;
  let preferredVolume = DEFAULT_VOLUME;
  let muted = true;
  let navigationStatePersisted = false;
  // Keep the visitor's choice separate from the instantaneous player state.
  // A scene transition may pause a player for a moment; that must not be
  // mistaken for the visitor choosing "sound off".
  let playbackRequested = false;

  try {
    const savedValue = window.localStorage.getItem(VOLUME_STORAGE_KEY);
    const savedVolume = savedValue === null ? Number.NaN : Number(savedValue);
    if (Number.isFinite(savedVolume)) preferredVolume = Math.max(0, Math.min(1, savedVolume));
  } catch {
    // Storage is optional. The experience still starts at the safe default.
  }

  const emitState = () => {
    window.dispatchEvent(
      new CustomEvent("gaia:audio-state", {
        detail: {
          volume: preferredVolume,
          muted,
          playing: Boolean(audio && !audio.paused),
          track: activeTrack,
        },
      }),
    );
  };

  const cancelFade = () => {
    if (fadeFrame) cancelAnimationFrame(fadeFrame);
    fadeFrame = 0;
    window.clearTimeout(stopTimer);
  };

  const ensureAudio = (track = activeTrack) => {
    if (!TRACKS[track]) throw new Error(`Unknown BGM track: ${track}`);
    if (players.has(track)) return players.get(track);

    const player = new Audio(new URL(TRACKS[track], scriptBaseUrl).href);
    player.preload = "auto";
    player.playsInline = true;
    // The soundtrack belongs to the whole experience, not only the opening.
    // Keep one player alive while the visitor moves between every mode.
    player.loop = true;
    player.volume = 0;
    player.load();
    players.set(track, player);
    if (track === activeTrack) audio = player;
    return player;
  };

  const fadeTo = (target, durationSeconds, afterFade) => {
    const player = ensureAudio();
    cancelFade();

    const from = player.volume;
    const startedAt = performance.now();
    const duration = Math.max(40, durationSeconds * 1000);

    const draw = (now) => {
      const progress = Math.min(1, (now - startedAt) / duration);
      const eased = 1 - (1 - progress) ** 3;
      player.volume = Math.max(0, Math.min(1, from + (target - from) * eased));

      if (progress < 1) {
        fadeFrame = requestAnimationFrame(draw);
      } else {
        fadeFrame = 0;
        afterFade?.();
      }
    };

    fadeFrame = requestAnimationFrame(draw);
  };

  const preloadTrack = (track = activeTrack) => {
    if (!TRACKS[track]) return Promise.resolve(false);
    if (preloadPromises.has(track)) return preloadPromises.get(track);
    const player = ensureAudio(track);

    const preloadPromise = new Promise((resolve) => {
      if (player.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
        resolve(true);
        return;
      }

      let settled = false;
      const complete = (ready) => {
        if (settled) return;
        settled = true;
        player.removeEventListener("canplay", handleReady);
        player.removeEventListener("error", handleError);
        window.clearTimeout(timeout);
        resolve(ready);
      };
      const handleReady = () => complete(true);
      const handleError = () => complete(false);
      const timeout = window.setTimeout(() => complete(player.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA), 4800);

      player.addEventListener("canplay", handleReady, { once: true });
      player.addEventListener("error", handleError, { once: true });
    });

    preloadPromises.set(track, preloadPromise);
    return preloadPromise;
  };

  const preload = () => preloadTrack("opening");

  const setVolume = (value, fadeSeconds = 0.22) => {
    const nextVolume = Math.max(0, Math.min(1, Number(value) || 0));
    preferredVolume = nextVolume;
    try {
      window.localStorage.setItem(VOLUME_STORAGE_KEY, String(preferredVolume));
    } catch {
      // Ignore private-mode and storage-policy failures.
    }
    if (audio && !audio.paused && !muted) fadeTo(preferredVolume, fadeSeconds);
    emitState();
    return preferredVolume;
  };

  const start = async (volume = preferredVolume) => {
    setVolume(volume, 0);
    const player = ensureAudio();
    cancelFade();
    muted = false;
    playbackRequested = true;

    if (!player.paused) {
      fadeTo(preferredVolume, 0.35, emitState);
      emitState();
      return true;
    }

    player.volume = 0;

    try {
      // play() is deliberately called before awaiting anything so Chrome keeps
      // the user's click as the audio permission gesture.
      await player.play();
      fadeTo(preferredVolume, 1.2, emitState);
      emitState();
      return true;
    } catch {
      muted = true;
      playbackRequested = false;
      emitState();
      return false;
    }
  };

  const setMuted = async (nextMuted) => {
    muted = Boolean(nextMuted);
    if (muted) {
      playbackRequested = false;
      if (audio && !audio.paused) fadeTo(0, 0.24, emitState);
      emitState();
      return true;
    }

    playbackRequested = true;
    if (!audio || audio.paused) return start(preferredVolume);
    fadeTo(preferredVolume, 0.24, emitState);
    emitState();
    return true;
  };

  const toggleMuted = () => setMuted(!muted);

  const switchTrack = async (track, fadeSeconds = 0.5) => {
    if (!TRACKS[track]) return false;
    const serial = ++switchSerial;
    const switchFadeOutSeconds = Math.max(0, fadeSeconds) * TRACK_SWITCH_FADE_MULTIPLIER;
    if (track === activeTrack) {
      if (playbackRequested && !muted && audio?.paused) {
        try {
          audio.volume = 0;
          await audio.play();
          fadeTo(preferredVolume, 0.45, emitState);
        } catch {
          muted = true;
          playbackRequested = false;
          emitState();
          return false;
        }
      }
      if (audio && !audio.paused && !muted && audio.volume < preferredVolume) {
        fadeTo(preferredVolume, 0.25, emitState);
      }
      emitState();
      return true;
    }

    await preloadTrack(track);
    if (serial !== switchSerial) return false;

    const previousTrack = activeTrack;
    const previousPlayer = ensureAudio(previousTrack);
    const nextPlayer = ensureAudio(track);
    const shouldResume = playbackRequested && !muted;

    if (shouldResume && previousPlayer.volume > 0.001) {
      await new Promise((resolve) => fadeTo(0, switchFadeOutSeconds, resolve));
      if (serial !== switchSerial) return false;
    }

    previousPlayer.pause();
    previousPlayer.currentTime = 0;
    activeTrack = track;
    audio = nextPlayer;
    nextPlayer.currentTime = 0;
    nextPlayer.volume = 0;

    if (!shouldResume) {
      emitState();
      return true;
    }

    try {
      await nextPlayer.play();
      if (serial !== switchSerial) return false;
      fadeTo(preferredVolume, TRACK_SWITCH_FADE_IN_SECONDS, emitState);
      emitState();
      return true;
    } catch {
      activeTrack = previousTrack;
      audio = previousPlayer;
      try {
        await previousPlayer.play();
        fadeTo(preferredVolume, 0.3, emitState);
      } catch {
        muted = true;
        playbackRequested = false;
      }
      emitState();
      return false;
    }
  };

  const getState = () => ({
    volume: preferredVolume,
    muted,
    playing: Boolean(audio && !audio.paused),
    track: activeTrack,
  });

  const getPlaybackState = () => ({
    ...getState(),
    currentTime: Number.isFinite(audio?.currentTime) ? audio.currentTime : 0,
    duration: Number.isFinite(audio?.duration) ? audio.duration : 0,
  });

  const seek = (seconds) => {
    const player = ensureAudio();
    if (!Number.isFinite(player.duration) || player.duration <= 0) return false;
    player.currentTime = Math.max(0, Math.min(player.duration, Number(seconds) || 0));
    emitState();
    return true;
  };

  const persistNavigationState = () => {
    if (navigationStatePersisted) return true;
    try {
      window.sessionStorage.setItem(NAVIGATION_STATE_KEY, JSON.stringify({
        savedAt: Date.now(),
        track: activeTrack,
        currentTime: Number.isFinite(audio?.currentTime) ? audio.currentTime : 0,
        volume: preferredVolume,
        muted,
        playing: Boolean(audio && !audio.paused),
        playbackRequested,
      }));
      navigationStatePersisted = true;
      return true;
    } catch {
      return false;
    }
  };

  const restoreNavigationState = async () => {
    let snapshot = null;
    try {
      snapshot = JSON.parse(window.sessionStorage.getItem(NAVIGATION_STATE_KEY) || "null");
      window.sessionStorage.removeItem(NAVIGATION_STATE_KEY);
    } catch {
      snapshot = null;
    }
    if (!snapshot || !TRACKS[snapshot.track] || Date.now() - Number(snapshot.savedAt || 0) > NAVIGATION_STATE_MAX_AGE_MS) {
      emitState();
      return { restored: false, playing: false, blocked: false };
    }

    activeTrack = snapshot.track;
    audio = ensureAudio(activeTrack);
    preferredVolume = Math.max(0, Math.min(1, Number(snapshot.volume) || 0));
    muted = Boolean(snapshot.muted);
    playbackRequested = Boolean(snapshot.playbackRequested || snapshot.playing) && !muted;
    const resumeAt = Math.max(0, Number(snapshot.currentTime) || 0);
    const applyResumeTime = () => {
      try {
        audio.currentTime = Number.isFinite(audio.duration) && audio.duration > 0 ? resumeAt % audio.duration : resumeAt;
      } catch {
        // A browser may defer seeking until metadata is ready.
      }
    };
    if (audio.readyState >= HTMLMediaElement.HAVE_METADATA) applyResumeTime();
    else audio.addEventListener("loadedmetadata", applyResumeTime, { once: true });

    if (!playbackRequested) {
      audio.volume = 0;
      emitState();
      return { restored: true, playing: false, blocked: false };
    }

    audio.volume = 0;
    try {
      await audio.play();
      applyResumeTime();
      fadeTo(preferredVolume, 0.28, emitState);
      emitState();
      return { restored: true, playing: true, blocked: false };
    } catch {
      // Keep the visitor's sound-on intent. A visible control on the destination
      // page can resume playback with the next click if autoplay is restricted.
      playbackRequested = true;
      muted = false;
      emitState();
      return { restored: true, playing: false, blocked: true };
    }
  };

  const stop = (fadeSeconds = 1.1) => {
    if (!audio) return;
    const player = audio;
    fadeTo(0, fadeSeconds, () => {
      player.pause();
      player.currentTime = 0;
      emitState();
    });
  };

  // Begin buffering while the visual opening runs, before the title menu's
  // integrated sound controls become available.
  void preload();
  document.addEventListener("click", (event) => {
    const anchor = event.target instanceof Element ? event.target.closest("a[href]") : null;
    if (!(anchor instanceof HTMLAnchorElement)) return;
    const destination = new URL(anchor.href, document.baseURI);
    if (destination.origin === location.origin && destination.pathname !== location.pathname) persistNavigationState();
  }, { capture: true });
  window.addEventListener("pagehide", persistNavigationState);

  window.GaiaOpeningAudio = Object.freeze({
    preload,
    preloadTrack,
    start,
    stop,
    switchTrack,
    setVolume,
    setMuted,
    toggleMuted,
    getState,
    getPlaybackState,
    seek,
    persistNavigationState,
    restoreNavigationState,
  });
})();
