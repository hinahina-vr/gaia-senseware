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
      description: "ハープとフェルトピアノ、海と大気の低い呼吸が、地図に記録された地球の感覚を静かに包む音楽。",
      planet: "PLANET 09",
      signal: "SOURCE SAVE",
    },
    moonreopen: {
      number: "TRACK 10 / BLUE GLASS TIDE",
      title: "青硝子の潮汐",
      description: "青いガラスのような潮の揺らぎが、夜の観測記録を静かにひらく音楽。",
      planet: "PLANET 10",
      signal: "BLUE GLASS TIDE",
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
    const smoothedBands = new Float32Array(3);
    const previousSpectrum = new Float32Array(32);
    let smoothedEnergy = 0;
    let smoothedPulse = 0;
    let smoothedFlux = 0;
    let smoothedWave = 0;
    let previousBass = 0;
    let automaticGain = 1;
    let lastDrawAt = -Infinity;
    let gl = null;
    let program = null;
    let vertexBuffer = null;
    let positionAttribute = -1;
    let uniforms = null;
    let fallback = null;

    const vertexSource = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    const fragmentSource = `
      precision highp float;

      uniform vec2 resolution;
      uniform float time;
      uniform float bass;
      uniform float mid;
      uniform float high;
      uniform float energy;
      uniform float pulse;
      uniform float flux;
      uniform float wave;
      uniform float playing;

      float hash21(vec2 p) {
        p = fract(p * vec2(123.34, 456.21));
        p += dot(p, p + 45.32);
        return fract(p.x * p.y);
      }

      vec2 hash22(vec2 p) {
        float n = hash21(p);
        return vec2(n, hash21(p + n + 17.17));
      }

      float valueNoise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(
          mix(hash21(i), hash21(i + vec2(1.0, 0.0)), u.x),
          mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), u.x),
          u.y
        );
      }

      float fbm(vec2 p) {
        float sum = 0.0;
        float amplitude = 0.5;
        mat2 rotation = mat2(0.82, -0.57, 0.57, 0.82);
        for (int octave = 0; octave < 5; octave += 1) {
          sum += amplitude * valueNoise(p);
          p = rotation * p * 2.03 + vec2(7.1, 3.7);
          amplitude *= 0.5;
        }
        return sum;
      }

      float powderLayer(vec2 uv, float scale, float drift, float threshold) {
        float aspect = resolution.x / max(1.0, resolution.y);
        vec2 p = vec2(uv.x * aspect, uv.y) * scale + vec2(drift, -drift * 0.37);
        vec2 cell = floor(p);
        vec2 local = fract(p) - 0.5;
        vec2 offset = (hash22(cell) - 0.5) * 0.72;
        float seed = hash21(cell + 31.7);
        float dust = exp(-dot(local - offset, local - offset) * 320.0);
        return dust * smoothstep(threshold, 1.0, seed);
      }

      vec3 spectrumPalette(float t) {
        vec3 violet = vec3(0.31, 0.08, 0.73);
        vec3 rose = vec3(0.94, 0.18, 0.59);
        vec3 gold = vec3(1.0, 0.62, 0.23);
        vec3 mint = vec3(0.15, 0.91, 0.64);
        vec3 cyan = vec3(0.22, 0.72, 1.0);
        vec3 color = mix(violet, rose, smoothstep(0.0, 0.32, t));
        color = mix(color, gold, smoothstep(0.26, 0.52, t));
        color = mix(color, mint, smoothstep(0.48, 0.76, t));
        return mix(color, cyan, smoothstep(0.72, 1.0, t));
      }

      vec3 spectralRibbons(vec2 uv) {
        float aspect = resolution.x / max(1.0, resolution.y);
        vec2 p = vec2((uv.x - 0.5) * aspect, uv.y - 0.5);
        float motion = time * (0.38 + mid * 1.65 + flux * 2.8);
        float coarseNoise = fbm(vec2(p.x * 0.68 - motion * 0.11, p.y * 1.9 + wave * 0.8));
        float fineNoise = fbm(vec2(p.x * 1.8 + motion * 0.16, p.y * 4.2 - motion * 0.13));
        vec3 field = vec3(0.0);
        float signalCore = 0.0;

        for (int index = 0; index < 7; index += 1) {
          float fi = float(index);
          float bandPosition = -0.38 + fi * 0.126;
          float phase = fi * 1.37 + wave * (1.2 + fi * 0.18);
          float primary = sin(p.x * (1.18 + fi * 0.19) + motion * (0.72 + fi * 0.09) + phase);
          float secondary = sin(p.x * (3.1 + fi * 0.31) - motion * (1.05 + fi * 0.07) - phase * 0.6);
          float tremor = sin(p.x * (8.0 + fi * 0.72) + motion * 2.4 + fi) * flux;
          float bend = primary * (0.045 + mid * 0.19 + pulse * 0.065)
            + secondary * (0.018 + mid * 0.06 + flux * 0.09)
            + tremor * 0.035
            + (coarseNoise - 0.5) * (0.04 + mid * 0.12)
            + (fineNoise - 0.5) * high * 0.028;
          float center = bandPosition + bend + wave * (fi - 3.0) * 0.012;
          float distanceToBand = abs(p.y - center);
          float width = 0.052 + bass * 0.065 + pulse * 0.035 + fi * 0.0015;
          float glow = exp(-pow(distanceToBand / width, 2.0));
          float silk = exp(-pow(distanceToBand / (0.015 + mid * 0.012 + pulse * 0.007), 2.0));
          float filament = exp(-pow(distanceToBand / (0.0045 + high * 0.004), 2.0));
          float palettePosition = fi / 6.0 + 0.035 * sin(motion * 0.2 + fi);
          vec3 bandColor = spectrumPalette(fract(palettePosition));
          float fold = 0.62 + 0.38 * sin(p.x * 5.6 + fineNoise * 5.0 + motion + fi * 0.8);
          field += bandColor * glow * (0.18 + energy * 0.42 + bass * 0.18) * (0.74 + fold * 0.26);
          field += mix(bandColor, vec3(0.84, 0.96, 1.0), 0.35) * silk * (0.18 + mid * 0.62 + flux * 0.72);
          field += vec3(0.76, 1.0, 0.95) * filament * (0.04 + high * 0.74 + flux * 1.1);
          signalCore = max(signalCore, filament);
        }

        float edgeFade = smoothstep(-1.18, -0.72, p.x) * smoothstep(1.18, 0.72, p.x);
        float bassBloom = (bass * 0.88 + pulse * 0.72) * exp(-dot(p * vec2(0.58, 1.1), p * vec2(0.58, 1.1)) * 1.7);
        field += mix(vec3(0.36, 0.05, 0.78), vec3(0.02, 0.78, 0.68), uv.x) * bassBloom;
        field += vec3(0.72, 0.92, 1.0) * signalCore * flux * 0.8;
        return field * edgeFade;
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / resolution;
        float aspect = resolution.x / max(1.0, resolution.y);
        vec2 centered = vec2((uv.x - 0.5) * aspect, uv.y - 0.5);

        vec3 deepIndigo = vec3(0.003, 0.005, 0.028);
        vec3 midnight = vec3(0.014, 0.012, 0.075);
        vec3 color = mix(deepIndigo, midnight, smoothstep(0.0, 1.0, uv.y));
        float nebula = fbm(centered * vec2(0.82, 1.34) + vec2(time * (0.018 + mid * 0.04), -time * 0.012));
        color += mix(vec3(0.08, 0.015, 0.16), vec3(0.015, 0.11, 0.15), uv.x) * smoothstep(0.46, 0.91, nebula) * (0.3 + energy * 0.42);

        vec3 ribbons = spectralRibbons(uv);
        float interference = 0.5 + 0.5 * sin((centered.x + wave * 0.32) * (14.0 + high * 18.0) + time * (1.2 + flux * 4.0));
        ribbons *= 0.82 + interference * high * 0.42;
        color += ribbons;

        float silverDust = powderLayer(uv, 31.0, time * (0.06 + high * 0.18), 0.91);
        float goldDust = powderLayer(uv + vec2(0.13, 0.07), 45.0, -time * (0.04 + flux * 0.22), 0.945);
        float nearDust = powderLayer(uv + vec2(-0.21, 0.17), 19.0, time * (0.028 + energy * 0.12), 0.93);
        float dustLift = 0.08 + high * 1.9 + flux * 2.4 + pulse * 0.45;
        color += vec3(0.82, 0.92, 1.0) * silverDust * dustLift;
        color += vec3(1.0, 0.67, 0.3) * goldDust * dustLift * 0.84;
        color += vec3(0.46, 1.0, 0.82) * nearDust * (0.08 + high * 0.72 + flux * 0.62);

        float pulseVeil = exp(-pow((centered.y - sin(centered.x * 1.8 + time * 0.8) * 0.12) / (0.34 + bass * 0.18), 2.0));
        color += mix(vec3(0.29, 0.03, 0.58), vec3(0.02, 0.48, 0.53), uv.x) * pulseVeil * pulse * 0.48;

        float vignette = smoothstep(1.16, 0.18, length(centered * vec2(0.76, 1.0)));
        color *= 0.5 + 0.5 * vignette;
        float grain = hash21(gl_FragCoord.xy + fract(time) * 71.0) - 0.5;
        color += grain * (0.006 + high * 0.005);
        float luminance = dot(color, vec3(0.2126, 0.7152, 0.0722));
        color = mix(vec3(luminance), color, 1.26 + energy * 0.24 + flux * 0.18);
        color = 1.0 - exp(-max(color, vec3(0.0)) * (1.42 + energy * 1.1 + pulse * 0.54));
        color = pow(color, vec3(0.88));
        gl_FragColor = vec4(color, 1.0);
      }
    `;

    const compile = (context, type, source) => {
      const shader = context.createShader(type);
      context.shaderSource(shader, source);
      context.compileShader(shader);
      if (!context.getShaderParameter(shader, context.COMPILE_STATUS)) {
        canvas.dataset.shaderError = (context.getShaderInfoLog(shader) || "compile-failed").slice(0, 180);
        context.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const initWebGL = () => {
      gl = canvas.getContext("webgl", {
        alpha: true,
        antialias: false,
        depth: false,
        premultipliedAlpha: false,
        powerPreference: "high-performance",
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
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        canvas.dataset.shaderError = (gl.getProgramInfoLog(program) || "link-failed").slice(0, 180);
        return false;
      }

      vertexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
        gl.STATIC_DRAW,
      );
      positionAttribute = gl.getAttribLocation(program, "position");
      uniforms = {
        resolution: gl.getUniformLocation(program, "resolution"),
        time: gl.getUniformLocation(program, "time"),
        bass: gl.getUniformLocation(program, "bass"),
        mid: gl.getUniformLocation(program, "mid"),
        high: gl.getUniformLocation(program, "high"),
        energy: gl.getUniformLocation(program, "energy"),
        pulse: gl.getUniformLocation(program, "pulse"),
        flux: gl.getUniformLocation(program, "flux"),
        wave: gl.getUniformLocation(program, "wave"),
        playing: gl.getUniformLocation(program, "playing"),
      };
      gl.disable(gl.BLEND);
      gl.disable(gl.DEPTH_TEST);
      canvas.dataset.renderer = "webgl";
      canvas.dataset.visualizer = "full-field-audio-ink";
      canvas.dataset.presentation = "full-screen-webgl";
      canvas.dataset.audioAnalysis = "fft-spectrum-flux-waveform";
      canvas.dataset.reactivity = "bass-mid-high-transient-wave";
      return true;
    };

    const initFallback = () => {
      fallback = canvas.getContext("2d");
      canvas.dataset.renderer = fallback ? "canvas2d" : "unavailable";
      canvas.dataset.visualizer = "full-field-audio-ink";
      canvas.dataset.presentation = "full-screen-webgl";
      canvas.dataset.audioAnalysis = "fft-spectrum-flux-waveform";
      canvas.dataset.reactivity = "bass-mid-high-transient-wave";
      return Boolean(fallback);
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(reduced ? 1 : 1.25, window.devicePixelRatio || 1);
      const width = Math.max(1, Math.round(rect.width * ratio));
      const height = Math.max(1, Math.round(rect.height * ratio));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
    };

    const easeBand = (current, target, attack, release) => (
      current + (target - current) * (target > current ? attack : release)
    );

    const updateAudioState = (state) => {
      const active = Boolean(state.analysisActive);
      const targetGain = active
        ? Math.max(1, Math.min(4.4, 0.13 / Math.max(0.012, state.rms || 0)))
        : 1;
      automaticGain += (targetGain - automaticGain) * (active ? 0.045 : 0.025);
      for (let index = 0; index < 3; index += 1) {
        const raw = active ? Math.min(1, Math.max(0, (state.bands?.[index] || 0) * automaticGain * 1.05)) : 0;
        const shaped = Math.pow(raw, 0.72);
        smoothedBands[index] = easeBand(smoothedBands[index], shaped, reduced ? 0.08 : 0.34, reduced ? 0.04 : 0.095);
      }
      const activeEnergy = active
        ? Math.min(1, (state.rms || 0) * automaticGain * 2.8 + smoothedBands[0] * 0.32 + smoothedBands[1] * 0.2)
        : 0;
      smoothedEnergy = easeBand(smoothedEnergy, activeEnergy, reduced ? 0.07 : 0.3, reduced ? 0.035 : 0.085);

      const spectrum = active && Array.isArray(state.spectrum) ? state.spectrum : [];
      let spectralFlux = 0;
      for (let index = 0; index < previousSpectrum.length; index += 1) {
        const sample = Math.max(0, Math.min(1, spectrum[index] || 0));
        spectralFlux += Math.max(0, sample - previousSpectrum[index]);
        previousSpectrum[index] += (sample - previousSpectrum[index]) * (sample > previousSpectrum[index] ? 0.72 : 0.18);
      }
      spectralFlux = Math.min(1, spectralFlux * automaticGain * 0.62);
      smoothedFlux = easeBand(smoothedFlux, spectralFlux, reduced ? 0.12 : 0.54, reduced ? 0.055 : 0.12);

      const waveform = active && Array.isArray(state.waveform) ? state.waveform : [];
      let waveProjection = 0;
      for (let index = 0; index < waveform.length; index += 1) {
        waveProjection += (waveform[index] || 0) * Math.sin(index * 0.71 + 0.4);
      }
      const projectedWave = waveform.length > 0
        ? Math.max(-1, Math.min(1, waveProjection / Math.sqrt(waveform.length) * 1.9))
        : 0;
      smoothedWave += (projectedWave - smoothedWave) * (reduced ? 0.08 : 0.31);

      const bassAttack = Math.max(0, smoothedBands[0] - previousBass);
      previousBass = smoothedBands[0];
      const pulseTarget = active
        ? Math.min(1, bassAttack * 4.8 + smoothedFlux * 1.65 + (state.peak || 0) * automaticGain * 0.34)
        : 0;
      smoothedPulse = easeBand(smoothedPulse, pulseTarget, reduced ? 0.14 : 0.68, reduced ? 0.05 : 0.105);
      canvas.dataset.analysisActive = String(active);
      canvas.dataset.bass = smoothedBands[0].toFixed(3);
      canvas.dataset.mid = smoothedBands[1].toFixed(3);
      canvas.dataset.high = smoothedBands[2].toFixed(3);
      canvas.dataset.energy = smoothedEnergy.toFixed(3);
      canvas.dataset.pulse = smoothedPulse.toFixed(3);
      canvas.dataset.flux = smoothedFlux.toFixed(3);
      canvas.dataset.wave = smoothedWave.toFixed(3);
    };

    const drawFallback = (state, now) => {
      if (!fallback) return;
      updateAudioState(state);
      const width = canvas.width;
      const height = canvas.height;
      const t = now * 0.001;
      const background = fallback.createLinearGradient(0, 0, 0, height);
      background.addColorStop(0, "#080828");
      background.addColorStop(0.58, "#100b31");
      background.addColorStop(1, "#030615");
      fallback.globalCompositeOperation = "source-over";
      fallback.fillStyle = background;
      fallback.fillRect(0, 0, width, height);

      const palette = ["#6130ba", "#cf3d91", "#f0a548", "#4fc99b", "#52c6d4"];
      fallback.save();
      fallback.globalCompositeOperation = "screen";
      palette.forEach((color, index) => {
        const phase = t * (0.34 + smoothedBands[1] * 1.4 + index * 0.045) + index * 1.7 + smoothedWave * 2.2;
        const y = height * (0.29 + index * 0.075 + Math.sin(phase) * (0.035 + smoothedBands[1] * 0.14 + smoothedPulse * 0.045));
        fallback.beginPath();
        fallback.moveTo(-width * 0.12, y + height * 0.13);
        fallback.bezierCurveTo(width * 0.22, y - height * (0.11 + smoothedBands[1] * 0.16), width * 0.55, y + height * (0.12 + smoothedWave * 0.08), width * 1.12, y - height * (0.04 + smoothedFlux * 0.08));
        fallback.lineTo(width * 1.12, y + height * 0.13);
        fallback.bezierCurveTo(width * 0.62, y + height * 0.23, width * 0.25, y + height * 0.01, -width * 0.12, y + height * 0.25);
        fallback.closePath();
        fallback.globalAlpha = 0.12 + smoothedEnergy * 0.28 + smoothedPulse * 0.16;
        fallback.shadowColor = color;
        fallback.shadowBlur = height * 0.08;
        fallback.fillStyle = color;
        fallback.fill();
      });
      fallback.restore();

      const water = fallback.createLinearGradient(0, height * 0.7, 0, height);
      water.addColorStop(0, "rgba(94, 130, 190, .08)");
      water.addColorStop(1, "rgba(1, 4, 20, .78)");
      fallback.fillStyle = water;
      fallback.fillRect(0, height * 0.7, width, height * 0.3);

      fallback.globalCompositeOperation = "screen";
      for (let index = 0; index < 42; index += 1) {
        const x = (Math.sin(index * 91.17 + t * 0.7) * 0.5 + 0.5) * width;
        const y = (Math.sin(index * 37.73 - t * 0.41) * 0.5 + 0.5) * height * 0.72;
        const size = 0.5 + (index % 5) * 0.24 + smoothedBands[2] * 1.8;
        fallback.globalAlpha = 0.08 + smoothedBands[2] * 0.62 + smoothedFlux * 0.54;
        fallback.fillStyle = index % 3 ? "#e7eef5" : "#f2c477";
        fallback.beginPath();
        fallback.arc(x, y, size, 0, Math.PI * 2);
        fallback.fill();
      }
      fallback.globalCompositeOperation = "source-over";
      fallback.globalAlpha = 1;
    };

    const draw = (state, now = performance.now()) => {
      const frameInterval = reduced ? 84 : 32;
      if (now - lastDrawAt < frameInterval) return;
      lastDrawAt = now;
      resize();
      if (!gl || !program || gl.isContextLost()) {
        drawFallback(state, now);
        return;
      }

      updateAudioState(state);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
      gl.enableVertexAttribArray(positionAttribute);
      gl.vertexAttribPointer(positionAttribute, 2, gl.FLOAT, false, 0, 0);
      gl.uniform2f(uniforms.resolution, canvas.width, canvas.height);
      gl.uniform1f(uniforms.time, now * 0.001 * (reduced ? 0.18 : 0.78));
      gl.uniform1f(uniforms.bass, smoothedBands[0]);
      gl.uniform1f(uniforms.mid, smoothedBands[1]);
      gl.uniform1f(uniforms.high, smoothedBands[2]);
      gl.uniform1f(uniforms.energy, smoothedEnergy);
      gl.uniform1f(uniforms.pulse, smoothedPulse);
      gl.uniform1f(uniforms.flux, smoothedFlux);
      gl.uniform1f(uniforms.wave, smoothedWave);
      gl.uniform1f(uniforms.playing, state.playing ? 1 : 0);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };

    canvas.addEventListener("webglcontextlost", (event) => {
      event.preventDefault();
      canvas.dataset.renderer = "context-lost";
    });
    canvas.addEventListener("webglcontextrestored", () => {
      program = null;
      vertexBuffer = null;
      positionAttribute = -1;
      uniforms = null;
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
    if (window.location.hash !== "#sound") {
      window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}#sound`);
    }
    isOpen = true;
    lastFocused = document.activeElement;
    void getAudio()?.setMuted?.(true);
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

  const close = ({ updateHash = true } = {}) => {
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
    if (updateHash && window.location.hash === "#sound") {
      window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}#top`);
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
  window.addEventListener("hashchange", () => {
    if (window.location.hash === "#sound") open();
    else if (isOpen) close({ updateHash: false });
  });
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
