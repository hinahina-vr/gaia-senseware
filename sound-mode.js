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
    let smoothedEnergy = 0;
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
      uniform float playing;

      const float PI = 3.141592653589793;

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
        vec2 offset = (hash22(cell) - 0.5) * 0.66;
        float seed = hash21(cell + 31.7);
        float dust = exp(-dot(local - offset, local - offset) * 280.0);
        return dust * smoothstep(threshold, 1.0, seed);
      }

      vec3 auroraSilk(vec2 uv) {
        float aspect = resolution.x / max(1.0, resolution.y);
        vec2 p = vec2((uv.x - 0.5) * aspect, uv.y);
        float motion = time * (0.022 + mid * 0.055);
        float breath = 0.84 + 0.045 * sin(time * 0.3) + bass * 0.5 + energy * 0.32;
        float warp = fbm(vec2(p.x * 0.72 - motion, p.y * 1.42 + motion * 0.6));
        float fine = fbm(vec2(p.x * 1.38 + motion * 0.7, p.y * 2.2 - motion));
        float twist = (warp - 0.5) * (0.14 + mid * 0.28);
        float sweep = sin(p.x * 0.74 + motion * 1.24) * (0.095 + mid * 0.11) + p.x * 0.025;
        float lift = sin(p.x * 1.36 + motion * 2.2) * (0.065 + mid * 0.1);
        float fold = 0.72 + 0.28 * sin(p.x * 5.2 - p.y * 3.1 + fine * 4.4 + motion * 2.0);

        float c1 = 0.56 + sweep + lift + twist;
        float c2 = 0.47 - sweep * 0.7 - sin(p.x * 1.06 - motion * 1.7) * 0.1 - twist * 0.72;
        float c3 = 0.65 + sweep * 0.46 + sin(p.x * 0.82 + motion) * 0.09 + twist * 0.48;
        float c4 = 0.39 - sweep * 0.34 + sin(p.x * 1.7 + motion * 1.35) * 0.08 - twist * 0.38;
        float c5 = 0.75 - sweep * 0.5 - sin(p.x * 1.22 - motion * 1.15) * 0.07 + twist * 0.26;

        float m1 = exp(-pow(abs(p.y - c1) / (0.086 + mid * 0.045 + bass * 0.02), 2.0));
        float m2 = exp(-pow(abs(p.y - c2) / (0.097 + mid * 0.042 + bass * 0.018), 2.0));
        float m3 = exp(-pow(abs(p.y - c3) / (0.074 + mid * 0.04 + bass * 0.015), 2.0));
        float m4 = exp(-pow(abs(p.y - c4) / (0.079 + mid * 0.022), 2.0));
        float m5 = exp(-pow(abs(p.y - c5) / (0.063 + mid * 0.023), 2.0));
        float s1 = exp(-pow(abs(p.y - c1) / (0.022 + mid * 0.012), 2.0));
        float s2 = exp(-pow(abs(p.y - c2) / (0.026 + mid * 0.011), 2.0));
        float s3 = exp(-pow(abs(p.y - c3) / (0.018 + mid * 0.01), 2.0));
        float s4 = exp(-pow(abs(p.y - c4) / (0.021 + mid * 0.009), 2.0));
        float s5 = exp(-pow(abs(p.y - c5) / (0.016 + mid * 0.008), 2.0));

        vec3 indigo = vec3(0.055, 0.025, 0.20);
        vec3 violet = vec3(0.39, 0.12, 0.66);
        vec3 magenta = vec3(0.82, 0.16, 0.48);
        vec3 gold = vec3(1.0, 0.63, 0.24);
        vec3 emerald = vec3(0.22, 0.78, 0.56);
        vec3 celadon = vec3(0.28, 0.77, 0.82);

        vec3 color = vec3(0.0);
        color += mix(indigo, violet, 0.72 + 0.18 * fine) * m1 * (0.48 + 0.28 * fold);
        color += mix(violet, magenta, 0.46 + 0.24 * warp) * m2 * (0.44 + 0.24 * (1.0 - fold));
        color += mix(magenta, gold, 0.28 + 0.26 * fine) * m3 * (0.32 + 0.22 * fold);
        color += mix(emerald, celadon, 0.52 + 0.3 * warp) * m4 * (0.46 + 0.25 * (1.0 - fold));
        color += mix(gold, celadon, 0.22 + 0.36 * fine) * m5 * (0.27 + 0.18 * fold);
        float silkGrain = 0.54 + 0.46 * smoothstep(0.2, 0.8, fine + sin(p.x * 3.7 + motion) * 0.1);
        color += mix(violet, vec3(0.82, 0.67, 1.0), fine) * s1 * silkGrain * 0.22;
        color += mix(magenta, gold, warp * 0.5) * s2 * (1.0 - silkGrain * 0.35) * 0.18;
        color += mix(gold, vec3(1.0, 0.84, 0.62), fine) * s3 * silkGrain * 0.16;
        color += mix(emerald, celadon, fine) * s4 * silkGrain * 0.2;
        color += mix(celadon, violet, warp * 0.36) * s5 * (0.7 + fold * 0.3) * 0.17;

        float signalCore = max(max(s1, s2), max(s3, max(s4, s5)));
        vec3 signalColor = mix(vec3(0.35, 1.0, 0.88), vec3(0.96, 0.35, 1.0), smoothstep(-0.8, 0.9, p.x));
        color += signalColor * signalCore * (0.16 + energy * 1.05 + high * 0.38);
        color *= 1.04 + mid * 0.36;

        float overlap = m1 * m2 + m2 * m3 + m3 * m5 + m1 * m4;
        color += mix(vec3(0.68, 0.53, 1.0), vec3(0.64, 1.0, 0.89), fine) * overlap * 0.16;
        float edgeFade = smoothstep(-0.92, -0.52, p.x) * smoothstep(1.02, 0.58, p.x);
        return color * breath * edgeFade;
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / resolution;
        float aspect = resolution.x / max(1.0, resolution.y);
        vec2 centered = vec2((uv.x - 0.5) * aspect, uv.y - 0.5);

        vec3 deepIndigo = vec3(0.006, 0.008, 0.035);
        vec3 midnight = vec3(0.012, 0.015, 0.072);
        vec3 color = mix(deepIndigo, midnight, smoothstep(0.0, 1.0, uv.y));
        float nebula = fbm(centered * vec2(0.68, 1.12) + vec2(time * 0.006, -time * 0.004));
        color += vec3(0.055, 0.02, 0.105) * smoothstep(0.5, 0.93, nebula) * 0.42;

        vec3 silk = auroraSilk(uv);
        float horizon = 0.285;
        if (uv.y < horizon + 0.03) {
          float rippleField = fbm(vec2(uv.x * 6.0 + time * 0.025, uv.y * 19.0 - time * 0.032));
          float ripple = (rippleField - 0.5) * (0.014 + bass * 0.014);
          vec2 reflectedUv = vec2(uv.x + ripple, horizon + (horizon - uv.y) * 0.78);
          vec3 reflectedSilk = auroraSilk(reflectedUv);
          float depthFade = smoothstep(0.0, horizon, uv.y);
          float waterBreath = 0.52 + bass * 0.36 + energy * 0.18 + 0.035 * sin(time * 0.38);
          vec3 water = reflectedSilk * waterBreath * mix(0.28, 0.9, depthFade);
          water += vec3(0.06, 0.11, 0.2) * smoothstep(0.38, 0.9, rippleField) * (0.08 + bass * 0.13);
          vec3 sky = color + silk;
          vec3 waterScene = color * 0.42 + water;
          float waterMask = 1.0 - smoothstep(horizon - 0.04, horizon + 0.025, uv.y);
          color = mix(sky, waterScene, waterMask);
        } else {
          color += silk;
        }

        float silverDust = powderLayer(uv, 31.0, time * 0.018, 0.92);
        float goldDust = powderLayer(uv + vec2(0.13, 0.07), 43.0, -time * 0.013, 0.95);
        float nearDust = powderLayer(uv + vec2(-0.21, 0.17), 19.0, time * 0.009, 0.94);
        float dustLift = 0.12 + high * 1.62 + energy * 0.38;
        color += vec3(0.82, 0.9, 1.0) * silverDust * dustLift;
        color += vec3(1.0, 0.69, 0.31) * goldDust * dustLift * 0.9;
        color += vec3(0.55, 0.96, 0.82) * nearDust * (0.1 + high * 0.56);

        vec2 earthCenter = vec2(0.79, 0.78);
        vec2 earthPoint = vec2((uv.x - earthCenter.x) * aspect, uv.y - earthCenter.y);
        float earthRadius = 0.145;
        float earthDistance = length(earthPoint);
        vec2 spherePoint = earthPoint / earthRadius;
        float sphereZ = sqrt(max(0.0, 1.0 - dot(spherePoint, spherePoint)));
        vec3 normal = normalize(vec3(spherePoint, sphereZ));
        float longitude = atan(normal.x, max(0.001, normal.z)) / PI;
        float latitude = asin(clamp(normal.y, -1.0, 1.0)) / PI;
        float landMap = fbm(vec2(longitude * 4.2 + 2.0, latitude * 6.4 - time * 0.003));
        float coast = smoothstep(0.50, 0.59, landMap + valueNoise(vec2(longitude * 11.0, latitude * 9.0)) * 0.12);
        float cloudMap = fbm(vec2(longitude * 7.0 - time * 0.012, latitude * 12.0 + 9.0));
        float clouds = smoothstep(0.57, 0.76, cloudMap) * 0.72;
        float daylight = max(0.0, dot(normal, normalize(vec3(-0.72, 0.38, 0.92))));
        float nightGlow = pow(max(0.0, dot(normal, normalize(vec3(-0.75, -0.18, 0.65)))), 3.0);
        vec3 ocean = mix(vec3(0.006, 0.025, 0.095), vec3(0.025, 0.20, 0.34), daylight);
        vec3 land = mix(vec3(0.035, 0.085, 0.09), vec3(0.20, 0.34, 0.22), daylight);
        vec3 earthSurface = mix(ocean, land, coast);
        earthSurface += clouds * vec3(0.62, 0.72, 0.75) * (0.2 + daylight * 0.58);
        earthSurface += vec3(0.75, 0.43, 0.15) * nightGlow * coast * 0.13;
        earthSurface *= 0.22 + daylight * 0.9;
        float earthDisc = 1.0 - smoothstep(earthRadius - 0.002, earthRadius + 0.002, earthDistance);
        color = mix(color, earthSurface, earthDisc);

        float rimDistance = abs(earthDistance - earthRadius);
        float atmosphere = exp(-rimDistance * 115.0) * smoothstep(earthRadius + 0.03, earthRadius - 0.012, earthDistance);
        float outerHalo = exp(-max(0.0, earthDistance - earthRadius) * 38.0) * smoothstep(earthRadius + 0.09, earthRadius, earthDistance);
        float polarVeil = smoothstep(0.25, 0.82, abs(spherePoint.y)) * (0.46 + 0.54 * sin(longitude * 19.0 + time * 0.22));
        color += vec3(0.18, 0.62, 0.92) * atmosphere * (0.4 + 0.6 * daylight);
        color += mix(vec3(0.18, 0.8, 0.58), vec3(0.56, 0.3, 0.9), polarVeil) * atmosphere * polarVeil * 0.46;
        color += vec3(0.12, 0.34, 0.62) * outerHalo * 0.16;

        float bassBloom = (bass * 0.82 + energy * 0.24) * exp(-dot(centered - vec2(-0.12, -0.04), centered - vec2(-0.12, -0.04)) * 1.65);
        color += mix(vec3(0.42, 0.06, 0.68), vec3(0.04, 0.72, 0.58), uv.x) * bassBloom;

        float vignette = smoothstep(1.08, 0.2, length(centered * vec2(0.82, 1.03)));
        color *= 0.54 + 0.46 * vignette;
        float grain = hash21(gl_FragCoord.xy + fract(time) * 71.0) - 0.5;
        color += grain * 0.008;
        float luminance = dot(color, vec3(0.2126, 0.7152, 0.0722));
        color = mix(vec3(luminance), color, 1.22 + energy * 0.18);
        color = 1.0 - exp(-max(color, vec3(0.0)) * (1.38 + energy * 0.82));
        color = pow(color, vec3(0.9));
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
        playing: gl.getUniformLocation(program, "playing"),
      };
      gl.disable(gl.BLEND);
      gl.disable(gl.DEPTH_TEST);
      canvas.dataset.renderer = "webgl";
      canvas.dataset.visualizer = "full-field-audio-ink";
      canvas.dataset.presentation = "full-screen-webgl";
      canvas.dataset.audioAnalysis = "web-audio-fft-three-band";
      return true;
    };

    const initFallback = () => {
      fallback = canvas.getContext("2d");
      canvas.dataset.renderer = fallback ? "canvas2d" : "unavailable";
      canvas.dataset.visualizer = "full-field-audio-ink";
      canvas.dataset.presentation = "full-screen-webgl";
      canvas.dataset.audioAnalysis = "web-audio-fft-three-band";
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
      automaticGain += (targetGain - automaticGain) * 0.025;
      for (let index = 0; index < 3; index += 1) {
        const raw = active ? Math.min(1, Math.max(0, (state.bands?.[index] || 0) * automaticGain * 1.05)) : 0;
        const shaped = Math.pow(raw, 0.82);
        smoothedBands[index] = easeBand(smoothedBands[index], shaped, reduced ? 0.04 : 0.11, reduced ? 0.02 : 0.04);
      }
      const activeEnergy = active
        ? Math.min(1, (state.rms || 0) * automaticGain * 2.2 + smoothedBands[0] * 0.28 + smoothedBands[1] * 0.16)
        : 0;
      smoothedEnergy = easeBand(smoothedEnergy, activeEnergy, reduced ? 0.03 : 0.085, reduced ? 0.015 : 0.032);
      canvas.dataset.analysisActive = String(active);
      canvas.dataset.bass = smoothedBands[0].toFixed(3);
      canvas.dataset.mid = smoothedBands[1].toFixed(3);
      canvas.dataset.high = smoothedBands[2].toFixed(3);
      canvas.dataset.energy = smoothedEnergy.toFixed(3);
    };

    const drawFallback = (state, now) => {
      if (!fallback) return;
      updateAudioState(state);
      const width = canvas.width;
      const height = canvas.height;
      const t = now * 0.0001;
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
        const phase = t * (0.9 + index * 0.13) + index * 1.7;
        const y = height * (0.42 + index * 0.065 + Math.sin(phase) * (0.03 + smoothedBands[1] * 0.035));
        fallback.beginPath();
        fallback.moveTo(-width * 0.12, y + height * 0.13);
        fallback.bezierCurveTo(width * 0.22, y - height * (0.12 + smoothedBands[1] * 0.08), width * 0.55, y + height * 0.16, width * 1.12, y - height * 0.06);
        fallback.lineTo(width * 1.12, y + height * 0.13);
        fallback.bezierCurveTo(width * 0.62, y + height * 0.23, width * 0.25, y + height * 0.01, -width * 0.12, y + height * 0.25);
        fallback.closePath();
        fallback.globalAlpha = 0.13 + smoothedEnergy * 0.08;
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

      const earthX = width * 0.79;
      const earthY = height * 0.22;
      const earthRadius = Math.min(width, height) * 0.14;
      const earth = fallback.createRadialGradient(
        earthX - earthRadius * 0.34,
        earthY - earthRadius * 0.3,
        earthRadius * 0.08,
        earthX,
        earthY,
        earthRadius,
      );
      earth.addColorStop(0, "#467e9a");
      earth.addColorStop(0.55, "#153f64");
      earth.addColorStop(1, "#03081d");
      fallback.shadowColor = "rgba(74, 186, 222, .56)";
      fallback.shadowBlur = earthRadius * 0.35;
      fallback.fillStyle = earth;
      fallback.beginPath();
      fallback.arc(earthX, earthY, earthRadius, 0, Math.PI * 2);
      fallback.fill();
      fallback.shadowBlur = 0;

      fallback.globalCompositeOperation = "screen";
      for (let index = 0; index < 42; index += 1) {
        const x = (Math.sin(index * 91.17 + t * 0.7) * 0.5 + 0.5) * width;
        const y = (Math.sin(index * 37.73 - t * 0.41) * 0.5 + 0.5) * height * 0.72;
        const size = 0.5 + (index % 5) * 0.24 + smoothedBands[2] * 1.8;
        fallback.globalAlpha = 0.12 + smoothedBands[2] * 0.42;
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
      gl.uniform1f(uniforms.time, now * 0.001 * (reduced ? 0.12 : 0.48));
      gl.uniform1f(uniforms.bass, smoothedBands[0]);
      gl.uniform1f(uniforms.mid, smoothedBands[1]);
      gl.uniform1f(uniforms.high, smoothedBands[2]);
      gl.uniform1f(uniforms.energy, smoothedEnergy);
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
    if (planetNumber) planetNumber.textContent = metadata.planet;
    if (planetSignal) planetSignal.textContent = metadata.signal;
    if (analysisState) {
      analysisState.textContent = analysis?.active
        ? "音の呼吸を解析中"
        : (analysis?.supported ? "静かな光の呼吸" : "光の余韻");
      analysisState.title = analysis?.active
        ? `Web Audio FFT ${analysis.fftSize || 512} / 低・中・高域を実測中`
        : (analysis?.supported ? "Web Audio FFT 待機中" : "音声解析を利用できないためアンビエント表示中");
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
    if (window.location.hash !== "#sound") {
      window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}#sound`);
    }
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
