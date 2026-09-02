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
    const visualResponses = new Float32Array(3);
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
      uniform float densityResponse;
      uniform float meanderResponse;
      uniform float causticResponse;
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

      float starlightLayer(vec2 uv, float scale, float drift, float threshold) {
        float aspect = resolution.x / max(1.0, resolution.y);
        vec2 p = vec2(uv.x * aspect, uv.y) * scale + vec2(drift, -drift * 0.37);
        vec2 cell = floor(p);
        vec2 local = fract(p) - 0.5;
        vec2 offset = (hash22(cell) - 0.5) * 0.58;
        float seed = hash21(cell + 31.7);
        float glow = exp(-dot(local - offset, local - offset) * 145.0);
        return glow * smoothstep(threshold, 1.0, seed);
      }

      vec3 dreamPalette(float t) {
        t = fract(t);
        vec3 wisteria = vec3(0.64, 0.24, 1.00);
        vec3 sky = vec3(0.08, 0.72, 1.00);
        vec3 mint = vec3(0.05, 0.95, 0.73);
        vec3 apricot = vec3(1.00, 0.57, 0.22);
        vec3 sakura = vec3(1.00, 0.24, 0.66);
        vec3 color = mix(wisteria, sky, smoothstep(0.00, 0.24, t));
        color = mix(color, mint, smoothstep(0.20, 0.45, t));
        color = mix(color, apricot, smoothstep(0.42, 0.70, t));
        color = mix(color, sakura, smoothstep(0.67, 0.88, t));
        return mix(color, wisteria, smoothstep(0.86, 1.00, t));
      }

      vec2 rotateFlow(vec2 p, float angle) {
        float cosine = cos(angle);
        float sine = sin(angle);
        return mat2(cosine, -sine, sine, cosine) * p;
      }

      vec2 curlWarp(vec2 p, float seed) {
        float drift = time * 0.026;
        vec2 domain = p * vec2(0.92, 1.14);
        float warpX = fbm(domain + vec2(seed * 1.31 + drift, seed * 0.43));
        float warpY = fbm(domain.yx + vec2(seed * 0.67 - drift, seed * 1.73));
        vec2 curl = vec2(warpY - 0.5, 0.5 - warpX);
        float response = 0.72 + meanderResponse * 0.78 + mid * 0.34;
        p += curl * vec2(0.28, 0.25) * response;
        p.x += sin(p.y * 1.86 - time * 0.075 + seed) * (0.085 + meanderResponse * 0.072);
        p.y += cos(p.x * 1.54 + time * 0.052 - seed * 0.71) * (0.062 + mid * 0.068);
        return p;
      }

      vec4 currentRibbon(
        vec2 p,
        float seed,
        float baseY,
        float angle,
        float baseWidth,
        float amplitude,
        float frequency,
        float hue,
        float strength
      ) {
        vec2 q = rotateFlow(p, angle);
        q = curlWarp(q, seed);
        float travel = time * (0.24 + mid * 0.28 + meanderResponse * 0.24) * (0.82 + seed * 0.017);
        float macroFold = sin(q.x * frequency + travel + seed) * amplitude;
        macroFold += sin(q.x * (frequency * 0.43) - travel * 0.54 + seed * 2.13) * amplitude * 0.78;
        macroFold += cos(q.x * (frequency * 0.19) + travel * 0.31 - seed * 0.84) * amplitude * 0.54;
        float riverDrift = fbm(vec2(q.x * 0.31 - travel * 0.045 + seed, seed * 0.71 + time * 0.011));
        float audioCurl = sin(q.x * frequency * 1.58 - travel * 1.26 + seed * 3.17)
          * amplitude * (mid * 0.45 + meanderResponse * 0.58);
        float center = baseY
          + macroFold
          + (riverDrift - 0.5) * amplitude * 2.35
          + audioCurl
          + wave * 0.040 * sin(seed * 1.91)
          + flux * 0.030 * cos(seed * 2.37);

        float widthField = fbm(vec2(q.x * 0.54 - travel * 0.075 + seed * 2.2, seed * 0.87 + time * 0.013));
        float widthRipple = fbm(vec2(q.x * 1.48 + seed, q.y * 0.16 - time * 0.019));
        float densityField = fbm(vec2(q.x * 0.38 + travel * 0.055 + seed * 2.4, time * 0.012 - seed * 0.61));
        float fineDensity = fbm(vec2(q.x * 1.72 - travel * 0.14 - seed, time * 0.026 + seed * 1.3));
        float densityVeil = 0.06 + 0.94 * smoothstep(
          0.40,
          0.74,
          densityField * 0.72 + fineDensity * 0.28 + densityResponse * 0.18
        );
        float brushGrain = 0.62 + 0.38 * smoothstep(
          0.25,
          0.78,
          fbm(vec2(q.x * 2.16 - travel * 0.18 + seed * 0.43, q.y * 0.44 + seed))
        );
        float localWidth = baseWidth
          * (0.36 + widthField * 0.92 + widthRipple * 0.34)
          * (1.0 + bass * 0.30 + densityResponse * (0.36 + strength * 0.12));
        float signedDistance = q.y - center;
        float sideWidthA = localWidth * (0.58 + widthRipple * 0.58);
        float sideWidthB = localWidth * (0.76 + widthField * 0.52);
        float asymmetricWidth = mix(sideWidthA, sideWidthB, step(0.0, signedDistance));
        float normalizedDistance = abs(signedDistance) / max(0.001, asymmetricWidth);
        float featheredBody = exp(-pow(normalizedDistance, 1.78) * 2.18);
        float translucentEdge = exp(-pow(normalizedDistance, 2.72) * 1.18);
        float pigment = fbm(vec2(q.x * 1.64 - travel * 0.22 + seed, q.y * 0.68 + seed * 0.73));
        float shimmer = smoothstep(
          0.54,
          0.88,
          fbm(vec2(q.x * 3.10 - travel * 0.52 + seed, q.y * 1.26 - time * 0.025))
        );

        float colorPhase = fract(
          hue + q.x * 0.074 + time * 0.012 + pigment * 0.19
          + meanderResponse * 0.15 + causticResponse * 0.11
        );
        vec3 firstDye = dreamPalette(colorPhase);
        vec3 secondDye = dreamPalette(colorPhase + 0.14 + sin(q.x * 0.62 + seed) * 0.055);
        float crossDye = smoothstep(-0.92, 0.92, (q.y - center) / max(0.001, localWidth));
        vec3 dye = mix(firstDye, secondDye, clamp(crossDye * 0.56 + pigment * 0.44, 0.0, 1.0));
        dye *= 0.78 + pigment * 0.48;
        dye += dreamPalette(colorPhase + 0.34) * shimmer
          * (0.035 + high * 0.17 + causticResponse * 0.24);

        float presence = 0.30 + playing * 0.70;
        float alpha = featheredBody * densityVeil * brushGrain * strength * presence
          * (0.28 + energy * 0.40 + bass * 0.16 + densityResponse * 0.56);
        alpha += translucentEdge * densityVeil * strength * presence
          * (0.018 + meanderResponse * 0.034 + causticResponse * 0.028);
        return vec4(dye, clamp(alpha, 0.0, 0.88));
      }

      void compositeVeil(inout vec3 field, vec4 veil) {
        vec3 layerColor = clamp(veil.rgb * veil.a, 0.0, 0.90);
        field = 1.0 - (1.0 - field) * (1.0 - layerColor);
      }

      vec3 braidedCurrentField(vec2 uv) {
        float aspect = resolution.x / max(1.0, resolution.y);
        vec2 p = vec2((uv.x - 0.5) * aspect, uv.y - 0.5);
        vec3 field = vec3(0.0);
        compositeVeil(field, currentRibbon(p, 1.1,  0.04,  0.08, 0.150, 0.345, 1.30, 0.02, 0.92));
        compositeVeil(field, currentRibbon(p, 2.7, -0.20, -0.22, 0.110, 0.298, 1.64, 0.39, 0.86));
        compositeVeil(field, currentRibbon(p, 4.2,  0.26,  0.30, 0.085, 0.252, 2.06, 0.67, 0.79));
        compositeVeil(field, currentRibbon(p, 5.8, -0.34,  0.43, 0.065, 0.208, 2.56, 0.19, 0.71));
        compositeVeil(field, currentRibbon(p, 7.3,  0.01, -0.48, 0.050, 0.174, 3.12, 0.53, 0.64));
        compositeVeil(field, currentRibbon(p, 8.9,  0.23,  0.55, 0.042, 0.142, 3.72, 0.82, 0.57));
        compositeVeil(field, currentRibbon(p, 10.4, -0.09, -0.62, 0.035, 0.116, 4.38, 0.31, 0.50));
        compositeVeil(field, currentRibbon(p, 12.1,  0.37,  0.37, 0.030, 0.094, 5.08, 0.73, 0.43));

        vec2 poolCenter = p - vec2(sin(time * 0.078) * 0.28, cos(time * 0.064) * 0.13 - 0.02);
        float bassPool = exp(-dot(poolCenter * vec2(0.66, 1.08), poolCenter * vec2(0.66, 1.08)) * (2.0 - bass * 0.48));
        field += mix(vec3(0.20, 0.055, 0.55), vec3(0.00, 0.44, 0.48), uv.x)
          * bassPool * (0.020 + bass * 0.070 + pulse * 0.085);
        float edgeFade = smoothstep(0.0, 0.07, uv.x) * (1.0 - smoothstep(0.93, 1.0, uv.x));
        return field * edgeFade;
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / resolution;
        float aspect = resolution.x / max(1.0, resolution.y);
        vec2 centered = vec2((uv.x - 0.5) * aspect, uv.y - 0.5);

        vec3 deepIndigo = vec3(0.004, 0.008, 0.030);
        vec3 midnight = vec3(0.012, 0.030, 0.074);
        vec3 color = mix(deepIndigo, midnight, smoothstep(0.0, 1.0, uv.y));
        float nebula = fbm(centered * vec2(0.62, 0.88) + vec2(time * 0.006, -time * 0.004));
        color += mix(vec3(0.09, 0.035, 0.18), vec3(0.018, 0.14, 0.17), uv.x)
          * smoothstep(0.44, 0.84, nebula) * (0.11 + energy * 0.20);
        color += braidedCurrentField(uv);

        float cyanPrism = starlightLayer(uv, 16.0, time * 0.009, 0.958);
        float goldPrism = starlightLayer(uv + vec2(0.17, 0.09), 10.0, -time * 0.006, 0.972);
        float prismLift = 0.026 + high * 0.34 + causticResponse * 0.92;
        color += vec3(0.58, 0.90, 1.00) * cyanPrism * prismLift;
        color += vec3(1.00, 0.77, 0.48) * goldPrism * prismLift * 0.68;

        float vignette = smoothstep(1.16, 0.18, length(centered * vec2(0.76, 1.0)));
        color *= 0.66 + 0.34 * vignette;
        float grain = hash21(gl_FragCoord.xy + fract(time) * 71.0) - 0.5;
        color += grain * 0.0012;
        float luminance = dot(color, vec3(0.2126, 0.7152, 0.0722));
        color = mix(vec3(luminance), color, 1.12 + high * 0.16);
        color = 1.0 - exp(-max(color, vec3(0.0)) * (1.22 + energy * 0.36 + bass * 0.10 + flux * 0.16));
        color = pow(color, vec3(0.92));
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
        densityResponse: gl.getUniformLocation(program, "densityResponse"),
        meanderResponse: gl.getUniformLocation(program, "meanderResponse"),
        causticResponse: gl.getUniformLocation(program, "causticResponse"),
        playing: gl.getUniformLocation(program, "playing"),
      };
      gl.disable(gl.BLEND);
      gl.disable(gl.DEPTH_TEST);
      canvas.dataset.renderer = "webgl";
      canvas.dataset.visualizer = "audio-reactive-silk-tide";
      canvas.dataset.presentation = "full-screen-webgl";
      canvas.dataset.audioAnalysis = "fft-spectrum-flux-waveform";
      canvas.dataset.reactivity = "bass-bloom-mid-curl-high-shimmer-flux-spark";
      canvas.dataset.motionProfile = "layered-curl-warped-veils";
      canvas.dataset.formLanguage = "soft-feathered-veils-no-core";
      canvas.dataset.palette = "wisteria-sky-mint-sakura-apricot";
      return true;
    };

    const initFallback = () => {
      fallback = canvas.getContext("2d");
      canvas.dataset.renderer = fallback ? "canvas2d" : "unavailable";
      canvas.dataset.visualizer = "audio-reactive-silk-tide";
      canvas.dataset.presentation = "full-screen-webgl";
      canvas.dataset.audioAnalysis = "fft-spectrum-flux-waveform";
      canvas.dataset.reactivity = "bass-bloom-mid-curl-high-shimmer-flux-spark";
      canvas.dataset.motionProfile = "layered-curl-warped-veils";
      canvas.dataset.formLanguage = "soft-feathered-veils-no-core";
      canvas.dataset.palette = "wisteria-sky-mint-sakura-apricot";
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
      const strongestBand = active ? Math.max(0, ...(state.bands || [0, 0, 0])) : 0;
      const targetGain = active
        ? Math.max(1, Math.min(3.2, 0.48 / Math.max(0.08, strongestBand)))
        : 1;
      const gainEase = targetGain < automaticGain ? 0.12 : (active ? 0.04 : 0.018);
      automaticGain += (targetGain - automaticGain) * gainEase;
      for (let index = 0; index < 3; index += 1) {
        const boosted = active ? Math.max(0, (state.bands?.[index] || 0) * automaticGain) : 0;
        const compressed = boosted / (0.52 + boosted);
        const shaped = Math.pow(Math.min(0.96, compressed), 0.78);
        smoothedBands[index] = easeBand(smoothedBands[index], shaped, reduced ? 0.16 : 0.34, reduced ? 0.055 : 0.12);
      }
      const activeEnergy = active
        ? Math.min(1, (state.rms || 0) * automaticGain * 2.7 + smoothedBands[0] * 0.32 + smoothedBands[1] * 0.20)
        : 0;
      smoothedEnergy = easeBand(smoothedEnergy, activeEnergy, reduced ? 0.11 : 0.20, reduced ? 0.040 : 0.065);

      const spectrum = active && Array.isArray(state.spectrum) ? state.spectrum : [];
      let spectralFlux = 0;
      for (let index = 0; index < previousSpectrum.length; index += 1) {
        const sample = Math.max(0, Math.min(1, spectrum[index] || 0));
        spectralFlux += Math.max(0, sample - previousSpectrum[index]);
        previousSpectrum[index] += (sample - previousSpectrum[index]) * (sample > previousSpectrum[index] ? 0.38 : 0.08);
      }
      spectralFlux = Math.min(1, spectralFlux * automaticGain * 0.32);
      smoothedFlux = easeBand(smoothedFlux, spectralFlux, reduced ? 0.16 : 0.32, reduced ? 0.045 : 0.09);

      const waveform = active && Array.isArray(state.waveform) ? state.waveform : [];
      let waveProjection = 0;
      for (let index = 0; index < waveform.length; index += 1) {
        waveProjection += (waveform[index] || 0) * Math.sin(index * 0.71 + 0.4);
      }
      const projectedWave = waveform.length > 0
        ? Math.max(-1, Math.min(1, waveProjection / Math.sqrt(waveform.length) * 0.72))
        : 0;
      smoothedWave += (projectedWave - smoothedWave) * (reduced ? 0.05 : 0.085);

      const bassAttack = Math.max(0, smoothedBands[0] - previousBass);
      previousBass = smoothedBands[0];
      const pulseTarget = active
        ? Math.min(1, bassAttack * 2.2 + smoothedFlux * 0.55 + (state.peak || 0) * automaticGain * 0.16)
        : 0;
      smoothedPulse = easeBand(smoothedPulse, pulseTarget, reduced ? 0.16 : 0.34, reduced ? 0.035 : 0.065);
      visualResponses[0] = Math.min(1, smoothedBands[0] * 0.62 + smoothedEnergy * 0.42 + smoothedPulse * 0.92);
      visualResponses[1] = Math.min(1, smoothedBands[1] * 0.94 + smoothedFlux * 0.82 + Math.abs(smoothedWave) * 0.34);
      visualResponses[2] = Math.min(1, smoothedBands[2] * 1.18 + smoothedFlux * 1.32);
      canvas.dataset.analysisActive = String(active);
      canvas.dataset.bass = smoothedBands[0].toFixed(3);
      canvas.dataset.mid = smoothedBands[1].toFixed(3);
      canvas.dataset.high = smoothedBands[2].toFixed(3);
      canvas.dataset.energy = smoothedEnergy.toFixed(3);
      canvas.dataset.pulse = smoothedPulse.toFixed(3);
      canvas.dataset.flux = smoothedFlux.toFixed(3);
      canvas.dataset.wave = smoothedWave.toFixed(3);
      canvas.dataset.densityResponse = visualResponses[0].toFixed(3);
      canvas.dataset.meanderResponse = visualResponses[1].toFixed(3);
      canvas.dataset.causticResponse = visualResponses[2].toFixed(3);
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

      const palette = ["#302c74", "#72538a", "#92706f", "#4b817b"];
      fallback.save();
      fallback.globalCompositeOperation = "screen";
      palette.forEach((color, index) => {
        const phase = t * (0.025 + smoothedBands[1] * 0.035) + index * 1.45 + smoothedWave * 0.18;
        const y = height * (0.25 + index * 0.12 + Math.sin(phase) * (0.02 + smoothedBands[1] * 0.025));
        fallback.beginPath();
        fallback.moveTo(-width * 0.12, y + height * 0.18);
        fallback.bezierCurveTo(width * 0.22, y - height * (0.045 + smoothedBands[1] * 0.035), width * 0.58, y + height * (0.055 + smoothedWave * 0.018), width * 1.12, y - height * 0.025);
        fallback.lineTo(width * 1.12, y + height * 0.24);
        fallback.bezierCurveTo(width * 0.62, y + height * 0.30, width * 0.24, y + height * 0.13, -width * 0.12, y + height * 0.34);
        fallback.closePath();
        fallback.globalAlpha = 0.1 + smoothedEnergy * 0.12 + smoothedPulse * 0.03;
        fallback.shadowColor = color;
        fallback.shadowBlur = height * 0.13;
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
      for (let index = 0; index < 18; index += 1) {
        const x = (Math.sin(index * 91.17 + t * 0.05) * 0.5 + 0.5) * width;
        const y = (Math.sin(index * 37.73 - t * 0.03) * 0.5 + 0.5) * height * 0.72;
        const size = 0.7 + (index % 4) * 0.18 + smoothedBands[2] * 0.45;
        fallback.globalAlpha = 0.025 + smoothedBands[2] * 0.18 + smoothedFlux * 0.05;
        fallback.fillStyle = index % 3 ? "#dbe8ee" : "#d9bd8c";
        fallback.shadowColor = fallback.fillStyle;
        fallback.shadowBlur = 10;
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
      gl.uniform1f(uniforms.time, now * 0.001 * (reduced ? 0.14 : 0.52));
      gl.uniform1f(uniforms.bass, smoothedBands[0]);
      gl.uniform1f(uniforms.mid, smoothedBands[1]);
      gl.uniform1f(uniforms.high, smoothedBands[2]);
      gl.uniform1f(uniforms.energy, smoothedEnergy);
      gl.uniform1f(uniforms.pulse, smoothedPulse);
      gl.uniform1f(uniforms.flux, smoothedFlux);
      gl.uniform1f(uniforms.wave, smoothedWave);
      gl.uniform1f(uniforms.densityResponse, visualResponses[0]);
      gl.uniform1f(uniforms.meanderResponse, visualResponses[1]);
      gl.uniform1f(uniforms.causticResponse, visualResponses[2]);
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
    layer.hidden = false;
    layer.setAttribute("aria-hidden", "false");
    document.body.classList.add("sound-mode-open");
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
    const analysisReady = api.enableAnalysis?.();
    const state = api.getState();
    if (state.playing && !state.muted) {
      await api.setMuted(true);
    } else {
      await api.start(state.volume);
    }
    await analysisReady;
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
      const analysisReady = api?.enableAnalysis?.();
      await api?.switchTrack?.(track, 0.35);
      const state = api?.getState?.();
      if (state?.muted || !state?.playing) await api?.start?.(state?.volume);
      await analysisReady;
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
    open();
  }
})();
