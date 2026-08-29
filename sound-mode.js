(() => {
  "use strict";

  const layer = document.querySelector("#sound-layer");
  if (!layer) return;

  const closeButton = document.querySelector("#sound-close");
  const playButton = document.querySelector("#sound-play");
  const progress = document.querySelector("#sound-progress");
  const currentTime = document.querySelector("#sound-current-time");
  const duration = document.querySelector("#sound-duration");
  const volume = document.querySelector("#sound-volume");
  const volumeValue = document.querySelector("#sound-volume-value");
  const trackNumber = document.querySelector("#sound-track-number");
  const trackTitle = document.querySelector("#sound-track-title");
  const description = document.querySelector("#sound-mode-description");
  const planetNumber = document.querySelector("#sound-planet-number");
  const planetSignal = document.querySelector("#sound-planet-signal");
  const analysisState = document.querySelector("#sound-analysis-state");
  const visualizerCanvas = document.querySelector("#sound-visualizer");
  const trackButtons = Array.from(document.querySelectorAll("[data-sound-track]"));
  const openButtons = Array.from(document.querySelectorAll("[data-sound-gallery-open]"));

  const tracks = Object.freeze({
    opening: {
      number: "TRACK 01 / OPENING THEME",
      title: "Planet Forecast - Hope",
      description: "惑星の放課後のオープニングで、三人と地球の物語への入口をひらく音楽。",
      planet: "PLANET 01",
      signal: "FORECAST SIGNAL",
    },
    story: {
      number: "TRACK 02 / STORY THEME",
      title: "Planet Forecast — Windowlight",
      description: "三人の記録を読み、残された言葉へ近づいていく場面の音楽。",
      planet: "PLANET 02",
      signal: "STORY RESONANCE",
    },
    windowlight: {
      number: "TRACK 03 / OBSERVATION ROOM",
      title: "Planet Forecast — Calm",
      description: "制作室の窓へ午後の光が差し、三人の観測が静かに重なり始める場面の音楽。",
      planet: "PLANET 03",
      signal: "WINDOWLIGHT TRACE",
    },
    firstlight: {
      number: "TRACK 04 / DAWN THEME",
      title: "Planet Forecast — First Light",
      description: "夜明け前の海が黒から青へほどけ、未完の観測が次へ続いていく場面の音楽。",
      planet: "PLANET 04",
      signal: "FIRST LIGHT TRACE",
    },
    foldedwind: {
      number: "TRACK 05 / UNSENT RECORD",
      title: "折り目の向こうの風",
      description: "折り畳まれた記録が風にほどけ、次の読み手へ渡っていく情景の音楽。",
      planet: "PLANET 05",
      signal: "FOLDED WIND TRACE",
    },
    snowfire: {
      number: "TRACK 06 / UNKNOWN SIGNAL",
      title: "雪火の観測信号",
      description: "冷たい記録と消えない熱が、同じ信号の中で揺れる場面の音楽。",
      planet: "PLANET 06",
      signal: "SNOWFIRE SIGNAL",
    },
    snowafter: {
      number: "TRACK 07 / BRANCHING LIGHT",
      title: "雪火、軌道の外へ（未使用曲）",
      description: "既存の軌道から分かれた光が、まだ名のない外側へ開いていく場面の音楽。",
      planet: "PLANET 07",
      signal: "SNOWFIRE AFTERIMAGE",
    },
    moonbook: {
      number: "TRACK 08 / NIGHT NOTE",
      title: "月明かりの観測ノート",
      description: "SOURCEと解釈を分けながら、夜の机で記録を読み直す場面の音楽。",
      planet: "PLANET 08",
      signal: "MOONLIT NOTE",
    },
    senseware: {
      number: "TRACK 09 / SYSTEM THEME",
      title: "GAIA SENSEWARE",
      description: "データを探索するGAIA SENSEWARE画面で、公開記録と地球の感覚をひとつの場へつなぐ音楽。",
      planet: "PLANET 09",
      signal: "SOURCE SAVE",
    },
    moonreopen: {
      number: "TRACK 10 / RELOAD MEMORY",
      title: "月下、もう一度ひらく（未使用曲）",
      description: "保存された選択と空白を、優劣をつけずに読み直す場面の音楽。",
      planet: "PLANET 10",
      signal: "REOPENED MEMORY",
    },
    ending: {
      number: "TRACK 11 / ENDING THEME",
      title: "AfterSchool,AfterGlow",
      description: "スタッフロールとともに、物語の余韻を次の観測へつなぐエンディングテーマ。",
      planet: "PLANET 11",
      signal: "AFTERGLOW SIGNAL",
    },
    trueend: {
      number: "TRACK 12 / Beyond",
      title: "Sensory Horizon",
      description: "二百七十万年後、星々へ広がった感覚の系譜をたどるBeyond専用曲。",
      planet: "PLANET 12",
      signal: "SENSORY HORIZON",
    },
  });

  let isOpen = false;
  let isScrubbing = false;
  let animationFrame = 0;
  let lastFocused = null;
  let visualizerRuntime = null;
  let visualizerState = {
    playing: false,
    volume: 0.1,
    outputVolume: 0,
    currentTime: 0,
    track: "opening",
    bands: [0, 0, 0],
    spectrum: Array(32).fill(0),
    waveform: Array(64).fill(0),
    peak: 0,
    rms: 0,
    analysisActive: false,
    analysisSupported: false,
  };

  const getAudio = () => window.GaiaOpeningAudio;

  const createSoundVisualizer = (canvas) => {
    if (!(canvas instanceof HTMLCanvasElement)) return null;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const spectrumSize = 32;
    const sampleCount = 72;
    const floatsPerVertex = 7;
    const smoothedSpectrum = new Float32Array(spectrumSize);
    const smoothedWaveform = new Float32Array(sampleCount);
    let automaticGain = 1;
    let lastDrawAt = -Infinity;
    const vertexSource = `
      attribute vec2 position;
      attribute vec4 color;
      attribute float pointSize;
      varying vec4 vertexColor;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
        gl_PointSize = pointSize;
        vertexColor = color;
      }
    `;
    const fragmentSource = `
      precision mediump float;
      varying vec4 vertexColor;
      uniform float pointMode;
      void main() {
        float alpha = vertexColor.a;
        if (pointMode > 0.5) {
          float distanceFromCenter = length(gl_PointCoord - vec2(0.5));
          alpha *= 1.0 - smoothstep(0.08, 0.5, distanceFromCenter);
        }
        gl_FragColor = vec4(vertexColor.rgb, alpha);
      }
    `;
    let gl = null;
    let program = null;
    let vertexBuffer = null;
    let attributes = null;
    let pointModeUniform = null;
    let fallback = null;

    const compile = (context, type, source) => {
      const shader = context.createShader(type);
      context.shaderSource(shader, source);
      context.compileShader(shader);
      if (!context.getShaderParameter(shader, context.COMPILE_STATUS)) {
        context.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const initWebGL = () => {
      gl = canvas.getContext("webgl", {
        alpha: true,
        antialias: true,
        depth: false,
        premultipliedAlpha: false,
        powerPreference: "low-power",
      });
      if (!gl) return false;
      const vertex = compile(gl, gl.VERTEX_SHADER, vertexSource);
      const fragment = compile(gl, gl.FRAGMENT_SHADER, fragmentSource);
      if (!vertex || !fragment) return false;
      program = gl.createProgram();
      gl.attachShader(program, vertex);
      gl.attachShader(program, fragment);
      gl.linkProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return false;
      vertexBuffer = gl.createBuffer();
      attributes = {
        position: gl.getAttribLocation(program, "position"),
        color: gl.getAttribLocation(program, "color"),
        pointSize: gl.getAttribLocation(program, "pointSize"),
      };
      pointModeUniform = gl.getUniformLocation(program, "pointMode");
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
      gl.disable(gl.DEPTH_TEST);
      canvas.dataset.renderer = "webgl";
      canvas.dataset.visualizer = "spectral-weave";
      return true;
    };

    const initFallback = () => {
      fallback = canvas.getContext("2d");
      canvas.dataset.renderer = fallback ? "canvas2d" : "unavailable";
      canvas.dataset.visualizer = "spectral-weave";
      return Boolean(fallback);
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(1.5, window.devicePixelRatio || 1);
      const width = Math.max(1, Math.round(rect.width * ratio));
      const height = Math.max(1, Math.round(rect.height * ratio));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
    };

    const sample = (values, progress) => {
      if (!values?.length) return 0;
      const scaled = Math.max(0, Math.min(1, progress)) * (values.length - 1);
      const lower = Math.floor(scaled);
      const upper = Math.min(values.length - 1, lower + 1);
      const mix = scaled - lower;
      return values[lower] * (1 - mix) + values[upper] * mix;
    };

    const updateAnalysisShape = (state) => {
      const active = Boolean(state.analysisActive);
      const targetGain = active ? Math.max(1, Math.min(20, 0.14 / Math.max(0.006, state.rms || 0))) : 1;
      automaticGain += (targetGain - automaticGain) * 0.12;
      const smoothing = reduced ? 0.18 : 0.32;
      for (let index = 0; index < spectrumSize; index += 1) {
        const target = active ? Math.min(1, (state.spectrum?.[index] || 0) * automaticGain) : 0;
        smoothedSpectrum[index] += (target - smoothedSpectrum[index]) * smoothing;
      }
      for (let index = 0; index < sampleCount; index += 1) {
        const target = active ? Math.max(-1, Math.min(1, sample(state.waveform, index / (sampleCount - 1)) * automaticGain)) : 0;
        smoothedWaveform[index] += (target - smoothedWaveform[index]) * smoothing;
      }
    };

    const edgeEnvelope = (progress) => Math.max(0, Math.sin(Math.PI * progress)) ** 0.72;
    const spectrumAt = (progress) => sample(smoothedSpectrum, progress);
    const waveformAt = (progress) => sample(smoothedWaveform, progress);

    const appendVertex = (vertices, x, y, color, alpha, pointSize = 1) => {
      vertices.push(x, y, color[0], color[1], color[2], alpha, pointSize);
    };

    const createStrip = (path, halfWidth, color, opacity) => {
      const vertices = [];
      for (let index = 0; index < sampleCount; index += 1) {
        const progress = index / (sampleCount - 1);
        const edge = edgeEnvelope(progress);
        const x = -0.98 + progress * 1.96;
        const y = path(progress, edge);
        const width = typeof halfWidth === "function" ? halfWidth(progress, edge) : halfWidth;
        const alpha = opacity * edge;
        appendVertex(vertices, x, y - width, color, alpha);
        appendVertex(vertices, x, y + width, color, alpha);
      }
      return vertices;
    };

    const createTies = (upperPath, lowerPath, energy) => {
      const vertices = [];
      for (let index = 4; index < sampleCount - 4; index += 4) {
        const progress = index / (sampleCount - 1);
        const edge = edgeEnvelope(progress);
        const level = spectrumAt(progress);
        const x = -0.98 + progress * 1.96;
        const color = progress < 0.52 ? [0.22, 0.62, 0.88] : [0.42, 0.94, 0.76];
        const alpha = edge * (0.025 + level * 0.12 + energy * 0.025);
        appendVertex(vertices, x, lowerPath(progress, edge), color, alpha);
        appendVertex(vertices, x, upperPath(progress, edge), color, alpha);
      }
      return vertices;
    };

    const createPeakPoints = (upperPath, lowerPath) => {
      const vertices = [];
      for (let index = 2; index < spectrumSize - 2; index += 1) {
        const progress = index / (spectrumSize - 1);
        const level = smoothedSpectrum[index];
        if (level < 0.13 || level < smoothedSpectrum[index - 1] || level < smoothedSpectrum[index + 1]) continue;
        const edge = edgeEnvelope(progress);
        const x = -0.98 + progress * 1.96;
        const color = progress > 0.7 ? [0.96, 0.78, 0.38] : [0.68, 1, 0.91];
        const pointSize = Math.min(10, 2.5 + level * 7);
        appendVertex(vertices, x, upperPath(progress, edge), color, edge * (0.28 + level * 0.55), pointSize);
        if (index % 3 === 0) appendVertex(vertices, x, lowerPath(progress, edge), color, edge * level * 0.34, pointSize * 0.72);
      }
      return vertices;
    };

    const drawVertices = (vertices, primitive, points = false) => {
      if (!vertices.length) return;
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
      const stride = floatsPerVertex * Float32Array.BYTES_PER_ELEMENT;
      gl.enableVertexAttribArray(attributes.position);
      gl.vertexAttribPointer(attributes.position, 2, gl.FLOAT, false, stride, 0);
      gl.enableVertexAttribArray(attributes.color);
      gl.vertexAttribPointer(attributes.color, 4, gl.FLOAT, false, stride, 2 * Float32Array.BYTES_PER_ELEMENT);
      gl.enableVertexAttribArray(attributes.pointSize);
      gl.vertexAttribPointer(attributes.pointSize, 1, gl.FLOAT, false, stride, 6 * Float32Array.BYTES_PER_ELEMENT);
      gl.uniform1f(pointModeUniform, points ? 1 : 0);
      gl.drawArrays(primitive, 0, vertices.length / floatsPerVertex);
    };

    const drawFallback = (state) => {
      if (!fallback) return;
      fallback.clearRect(0, 0, canvas.width, canvas.height);
      updateAnalysisShape(state);
      const centerY = canvas.height / 2;
      const drawTrace = (direction, color, width) => {
        fallback.beginPath();
        for (let index = 0; index < sampleCount; index += 1) {
          const progress = index / (sampleCount - 1);
          const edge = edgeEnvelope(progress);
          const spectrum = spectrumAt(progress);
          const waveform = waveformAt(progress);
          const x = progress * canvas.width;
          const y = centerY + direction * edge * spectrum * canvas.height * 0.27 + waveform * canvas.height * 0.055;
          if (index === 0) fallback.moveTo(x, y);
          else fallback.lineTo(x, y);
        }
        fallback.strokeStyle = color;
        fallback.lineWidth = width;
        fallback.stroke();
      };
      fallback.globalCompositeOperation = "lighter";
      drawTrace(-1, "rgba(91, 230, 200, .72)", Math.max(1, canvas.height * 0.008));
      drawTrace(1, "rgba(66, 145, 215, .56)", Math.max(1, canvas.height * 0.006));
      fallback.globalCompositeOperation = "source-over";
    };

    const draw = (state, now = performance.now()) => {
      const frameInterval = reduced ? 64 : 30;
      if (now - lastDrawAt < frameInterval) return;
      lastDrawAt = now;
      resize();
      if (!gl || !program || gl.isContextLost()) {
        drawFallback(state);
        return;
      }
      updateAnalysisShape(state);
      const energy = state.analysisActive
        ? Math.min(1, (state.rms || 0) * automaticGain * 3.8 + smoothedSpectrum[5] * 0.35)
        : 0;
      const upperPath = (progress, edge) => {
        const spectrum = spectrumAt(progress);
        return edge * (0.035 + spectrum * 0.48) + waveformAt(progress) * edge * 0.055;
      };
      const lowerPath = (progress, edge) => {
        const spectrum = spectrumAt(progress);
        return -edge * (0.035 + spectrum * 0.42) + waveformAt(progress) * edge * 0.045;
      };
      const upperInnerPath = (progress, edge) => edge * spectrumAt(progress) * 0.2 + waveformAt(progress) * edge * 0.1;
      const lowerInnerPath = (progress, edge) => -edge * spectrumAt(progress) * 0.18 + waveformAt(progress) * edge * 0.09;
      const waveformPath = (progress, edge) => waveformAt(progress) * edge * (0.15 + spectrumAt(progress) * 0.1);

      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);
      drawVertices(createTies(upperPath, lowerPath, energy), gl.LINES);
      drawVertices(createStrip(upperPath, 0.035 + energy * 0.012, [0.18, 0.59, 0.86], 0.08 + energy * 0.08), gl.TRIANGLE_STRIP);
      drawVertices(createStrip(lowerPath, 0.032 + energy * 0.01, [0.19, 0.52, 0.8], 0.07 + energy * 0.07), gl.TRIANGLE_STRIP);
      drawVertices(createStrip(upperInnerPath, 0.018, [0.32, 0.92, 0.77], 0.11 + energy * 0.08), gl.TRIANGLE_STRIP);
      drawVertices(createStrip(lowerInnerPath, 0.015, [0.31, 0.75, 0.82], 0.09 + energy * 0.06), gl.TRIANGLE_STRIP);
      drawVertices(createStrip(upperPath, 0.0045, [0.47, 1, 0.84], 0.5 + energy * 0.22), gl.TRIANGLE_STRIP);
      drawVertices(createStrip(lowerPath, 0.0038, [0.29, 0.67, 0.93], 0.4 + energy * 0.18), gl.TRIANGLE_STRIP);
      drawVertices(createStrip(waveformPath, 0.005 + energy * 0.003, [0.94, 0.78, 0.38], 0.32 + energy * 0.48), gl.TRIANGLE_STRIP);
      drawVertices(createPeakPoints(upperPath, lowerPath), gl.POINTS, true);
    };

    canvas.addEventListener("webglcontextlost", (event) => {
      event.preventDefault();
      canvas.dataset.renderer = "context-lost";
    });
    canvas.addEventListener("webglcontextrestored", () => {
      program = null;
      vertexBuffer = null;
      attributes = null;
      pointModeUniform = null;
      initWebGL();
    });
    if (!initWebGL()) initFallback();
    return { draw };
  };

  const formatTime = (seconds) => {
    if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const remainder = Math.floor(seconds % 60);
    return `${minutes}:${String(remainder).padStart(2, "0")}`;
  };

  const render = (state = getAudio()?.getPlaybackState?.()) => {
    const activeTrack = tracks[state?.track] ? state.track : "opening";
    const metadata = tracks[activeTrack];
    const volumePercent = Math.round(Math.max(0, Math.min(1, state?.volume ?? 0.1)) * 100);
    const trackDuration = state?.duration || 0;
    const elapsed = state?.currentTime || 0;
    const isPlaying = Boolean(state?.playing && !state?.muted);
    const analysis = getAudio()?.getAnalysisFrame?.();

    visualizerState = {
      playing: isPlaying,
      volume: state?.volume ?? 0.1,
      outputVolume: state?.outputVolume ?? 0,
      currentTime: elapsed,
      track: activeTrack,
      bands: analysis?.bands || [0, 0, 0],
      spectrum: analysis?.spectrum || Array(32).fill(0),
      waveform: analysis?.waveform || Array(64).fill(0),
      peak: analysis?.peak || 0,
      rms: analysis?.rms || 0,
      analysisActive: Boolean(analysis?.active),
      analysisSupported: Boolean(analysis?.supported),
    };

    layer.dataset.playing = String(isPlaying);
    layer.dataset.analysis = analysis?.active ? "live" : (analysis?.supported ? "ready" : "unavailable");
    layer.dataset.track = activeTrack;
    playButton?.setAttribute("aria-pressed", String(isPlaying));
    playButton?.setAttribute("aria-label", isPlaying ? "一時停止する" : "再生する");
    if (trackNumber) trackNumber.textContent = metadata.number;
    if (trackTitle) trackTitle.textContent = metadata.title;
    if (description) description.textContent = metadata.description;
    if (planetNumber) planetNumber.textContent = metadata.planet;
    if (planetSignal) planetSignal.textContent = metadata.signal;
    if (analysisState) {
      analysisState.textContent = analysis?.active
        ? `LIVE FFT ${analysis.fftSize || 512} / ${analysis.spectrum?.length || 32} BANDS`
        : (analysis?.supported ? "FFT READY / AUDIO PAUSED" : "AUDIO ANALYSIS UNAVAILABLE");
    }
    if (currentTime) currentTime.textContent = formatTime(elapsed);
    if (duration) duration.textContent = formatTime(trackDuration);
    if (volume instanceof HTMLInputElement) volume.value = String(volumePercent);
    if (volumeValue) volumeValue.textContent = `${volumePercent}%`;

    if (!isScrubbing && progress instanceof HTMLInputElement) {
      progress.value = trackDuration > 0 ? String(Math.round((elapsed / trackDuration) * 1000)) : "0";
      progress.disabled = trackDuration <= 0;
    }

    trackButtons.forEach((button) => {
      button.setAttribute("aria-current", String(button.dataset.soundTrack === activeTrack));
    });
  };

  const tick = () => {
    render();
    visualizerRuntime?.draw?.(visualizerState);
    if (isOpen) animationFrame = requestAnimationFrame(tick);
  };

  const open = () => {
    if (isOpen) return;
    isOpen = true;
    lastFocused = document.activeElement;
    layer.hidden = false;
    layer.setAttribute("aria-hidden", "false");
    document.body.classList.add("sound-mode-open");
    void getAudio()?.enableAnalysis?.();
    visualizerRuntime ||= createSoundVisualizer(visualizerCanvas);
    render();
    requestAnimationFrame(() => {
      layer.classList.add("is-open");
      closeButton?.focus({ preventScroll: true });
    });
    cancelAnimationFrame(animationFrame);
    animationFrame = requestAnimationFrame(tick);
  };

  const close = () => {
    if (!isOpen) return;
    isOpen = false;
    layer.classList.remove("is-open");
    layer.setAttribute("aria-hidden", "true");
    document.body.classList.remove("sound-mode-open");
    cancelAnimationFrame(animationFrame);
    animationFrame = 0;
    window.setTimeout(() => {
      if (!isOpen) layer.hidden = true;
    }, 260);
    if (window.location.hash === "#sound") {
      window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
    }
    if (lastFocused instanceof HTMLElement) lastFocused.focus({ preventScroll: true });
  };

  const togglePlayback = async () => {
    const api = getAudio();
    if (!api) return;
    const state = api.getState();
    if (state.playing && !state.muted) {
      await api.setMuted(true);
    } else {
      await api.start(state.volume);
    }
    render();
  };

  openButtons.forEach((button) => button.addEventListener("click", open));
  closeButton?.addEventListener("click", close);
  playButton?.addEventListener("click", togglePlayback);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      cancelAnimationFrame(animationFrame);
      animationFrame = 0;
    } else if (isOpen && animationFrame === 0) {
      animationFrame = requestAnimationFrame(tick);
    }
  });

  trackButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const track = button.dataset.soundTrack;
      if (!tracks[track]) return;
      const api = getAudio();
      await api?.switchTrack?.(track, 0.35);
      const state = api?.getState?.();
      if (state?.muted || !state?.playing) await api?.start?.(state?.volume);
      render();
    });
  });

  progress?.addEventListener("pointerdown", () => { isScrubbing = true; });
  progress?.addEventListener("input", () => {
    if (!(progress instanceof HTMLInputElement)) return;
    const state = getAudio()?.getPlaybackState?.();
    const previewTime = (Number(progress.value) / 1000) * (state?.duration || 0);
    if (currentTime) currentTime.textContent = formatTime(previewTime);
  });
  progress?.addEventListener("change", () => {
    if (!(progress instanceof HTMLInputElement)) return;
    const state = getAudio()?.getPlaybackState?.();
    getAudio()?.seek?.((Number(progress.value) / 1000) * (state?.duration || 0));
    isScrubbing = false;
    render();
  });
  progress?.addEventListener("pointerup", () => { isScrubbing = false; });

  volume?.addEventListener("input", () => {
    if (!(volume instanceof HTMLInputElement)) return;
    getAudio()?.setVolume?.(Number(volume.value) / 100, 0.08);
    render();
  });

  window.addEventListener("gaia:audio-state", (event) => render(event.detail));
  document.addEventListener("keydown", (event) => {
    if (!isOpen) return;
    if (event.key === "Escape") {
      event.preventDefault();
      close();
      return;
    }
    if (event.code === "Space" && !event.target.closest("button, input, a")) {
      event.preventDefault();
      void togglePlayback();
    }
  });

  render();
  if (window.location.hash === "#sound") {
    if (document.readyState === "loading") {
      window.addEventListener("load", () => requestAnimationFrame(open), { once: true });
    } else {
      requestAnimationFrame(open);
    }
  }
})();
