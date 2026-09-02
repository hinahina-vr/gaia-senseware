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
    let pointBuffer = null;
    let pointCount = 0;
    let attributes = null;
    let uniforms = null;
    let fallback = null;
    let renderedFrames = 0;
    let visualStartedAt = performance.now();
    const viewOffset = new Float32Array(2);
    const targetViewOffset = new Float32Array(2);
    let dragPointerId = null;
    let dragX = 0;
    let dragY = 0;

    const vertexSource = `
      precision highp float;

      attribute vec3 position;
      attribute float seed;
      attribute float kind;
      attribute float pointSize;

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
      uniform float trackHue;
      uniform vec2 viewOffset;

      varying vec3 lightColor;
      varying float lightAlpha;
      varying float lightKind;
      varying float sparkle;

      vec3 palette(float phase) {
        float cycle = fract(phase);
        vec3 sapphire = vec3(0.025, 0.18, 0.92);
        vec3 lagoon = vec3(0.00, 0.86, 0.72);
        vec3 orchid = vec3(0.66, 0.16, 0.96);
        vec3 amber = vec3(1.00, 0.49, 0.08);
        if (cycle < 0.25) return mix(sapphire, lagoon, cycle * 4.0);
        if (cycle < 0.50) return mix(lagoon, orchid, (cycle - 0.25) * 4.0);
        if (cycle < 0.75) return mix(orchid, amber, (cycle - 0.50) * 4.0);
        return mix(amber, sapphire, (cycle - 0.75) * 4.0);
      }

      void main() {
        float travelSpeed = mix(0.10, 0.58, playing);
        // Every point on a plane shares the same depth velocity. Randomizing
        // this per point turns the installation into an unstructured starfield
        // and destroys the crystal braces after only a few frames.
        float depth = mod(-position.z - time * travelSpeed, 56.0) + 1.8;
        vec2 room = position.xy;
        float focalLength = 1.28;
        vec2 projected = room * focalLength / max(1.1, depth);
        float aspect = resolution.x / max(1.0, resolution.y);
        projected.x /= aspect;
        projected += viewOffset;
        gl_Position = vec4(projected, 0.0, 1.0);

        float depthPulse = exp(-pow(fract(depth * 0.064 - time * 0.10) - 0.5, 2.0) * 42.0);
        float twinkle = 0.54 + 0.46 * sin(time * (1.1 + seed * 2.2) + seed * 47.0 + depth * 0.16);
        twinkle = max(0.0, twinkle);
        float perspectiveSize = pointSize * (108.0 / max(2.2, depth));
        float pixelScale = clamp(resolution.y / 900.0, 0.82, 1.55);
        float audioSize = 1.0 + high * 0.16 + pulse * 0.12 + depthPulse * flux * 0.34;
        float dustScale = kind > 3.5 ? 0.54 : 1.0;
        gl_PointSize = clamp(perspectiveSize * pixelScale * audioSize * dustScale, 1.15, 62.0);

        float nearFade = smoothstep(1.9, 4.5, depth);
        float farFade = 1.0 - smoothstep(43.0, 57.2, depth);
        float classLift = kind > 3.5 ? 0.27 : 0.92 + kind * 0.075;
        lightAlpha = nearFade * farFade * classLift
          * (0.74 + energy * 0.62 + high * twinkle * 0.52 + causticResponse * 0.34);
        lightAlpha *= 0.28 + playing * 0.72;
        sparkle = twinkle * (0.22 + high * 0.78 + causticResponse * 0.54) + depthPulse * flux;
        lightKind = kind;
        lightColor = palette(trackHue + kind * 0.13 + seed * 0.07 + depth * 0.0025 + mid * 0.17 + high * 0.06);
        lightColor = mix(lightColor, vec3(0.03, 0.22, 1.0), bass * 0.24);
        lightColor = mix(lightColor, vec3(0.00, 0.96, 0.67), mid * 0.22);
        lightColor = mix(lightColor, vec3(0.80, 0.18, 1.0), high * 0.28);
        lightColor *= 0.92 + energy * 0.34;
      }
    `;

    const fragmentSource = `
      precision highp float;

      varying vec3 lightColor;
      varying float lightAlpha;
      varying float lightKind;
      varying float sparkle;

      void main() {
        vec2 point = gl_PointCoord - 0.5;
        float radius = length(point) * 2.0;
        if (radius > 1.0) discard;
        float halo = exp(-radius * radius * 2.65) * (1.0 - smoothstep(0.72, 1.0, radius));
        float pearl = 1.0 - smoothstep(0.05, 0.24, radius);
        float cross = (
          exp(-abs(point.x) * 28.0) + exp(-abs(point.y) * 28.0)
        ) * exp(-radius * 2.2) * (0.08 + sparkle * 0.12);
        float faceted = 0.93 + 0.07 * cos(atan(point.y, point.x) * (4.0 + mod(lightKind, 3.0)));
        float alpha = (halo * (0.48 + sparkle * 0.28) + pearl * 0.98 + cross)
          * lightAlpha * faceted;
        vec3 color = lightColor * (0.84 + halo * 1.08 + sparkle * 0.42);
        color += lightColor * pearl * (0.46 + sparkle * 0.18);
        color = min(color, vec3(2.4));
        gl_FragColor = vec4(color, clamp(alpha, 0.0, 1.0));
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

    const createPointGeometry = () => {
      const points = [];
      let randomState = 0x6d2b79f5;
      const random = () => {
        randomState = Math.imul(randomState ^ (randomState >>> 15), randomState | 1);
        randomState ^= randomState + Math.imul(randomState ^ (randomState >>> 7), randomState | 61);
        return ((randomState ^ (randomState >>> 14)) >>> 0) / 4294967296;
      };
      const push = (x, y, z, kind, size = 1) => {
        points.push(x, y, z, random(), kind, size);
      };
      const segment = (from, to, spacing, kind, size) => {
        const dx = to[0] - from[0];
        const dy = to[1] - from[1];
        const dz = to[2] - from[2];
        const length = Math.hypot(dx, dy, dz);
        const steps = Math.max(1, Math.ceil(length / spacing));
        for (let step = 0; step <= steps; step += 1) {
          const amount = step / steps;
          push(
            from[0] + dx * amount,
            from[1] + dy * amount,
            from[2] + dz * amount,
            kind,
            size * (0.86 + random() * 0.34),
          );
        }
      };

      for (let z = -2.5; z >= -55; z -= 1.5) {
        push(0, 0, z, 4, 1.5);
      }

      // The room shell is made from actual 3D point strings. Perspective is
      // handled in the vertex shader, so the lattice keeps a stable vanishing
      // point without a fragment-shader raymarch at 4K.
      for (let z = -2.2; z >= -56; z -= 1.34) {
        for (let x = -12; x <= 12.01; x += 0.74) {
          push(x, -6.2, z, 0, 0.88);
          push(x, 6.2, z, 0, 0.88);
        }
        for (let y = -6.2; y <= 6.21; y += 0.72) {
          push(-12, y, z, 0, 0.88);
          push(12, y, z, 0, 0.88);
        }
      }

      // Repeating luminous planes create the dense mirrored chambers visible
      // in the reference while leaving enough darkness between structures.
      [-8.5, -15.5, -24, -34.5, -47].forEach((z, planeIndex) => {
        for (let x = -10.5; x <= 10.51; x += 0.78) {
          for (let y = -5.4; y <= 5.41; y += 0.78) {
            push(x, y, z, 1, 0.78 + (planeIndex % 2) * 0.12);
          }
        }
      });

      // Hanging light strands make the near field feel physical rather than
      // like a flat wallpaper. Each strand has its own depth and point rhythm.
      for (let x = -11.2; x <= 11.21; x += 0.64) {
        const z = -5.5 - random() * 46;
        const stagger = random() * 0.24;
        for (let y = -6.1 + stagger; y <= 6.1; y += 0.29 + random() * 0.025) {
          push(x, y, z, 2, 1.02 + random() * 0.22);
        }
      }

      // Faceted diamonds and X-shaped braces form crystalline architecture.
      [-10.5, -20.5, -32.5, -45].forEach((z, depthIndex) => {
        for (let x = -9; x <= 9.01; x += 4.5) {
          for (let y = -4.4; y <= 4.41; y += 2.95) {
            const width = 2.05 + depthIndex * 0.06;
            const height = 1.28 + (depthIndex % 2) * 0.16;
            segment([x - width, y, z], [x, y + height, z], 0.20, 3, 1.18);
            segment([x, y + height, z], [x + width, y, z], 0.20, 3, 1.18);
            segment([x + width, y, z], [x, y - height, z], 0.20, 3, 1.18);
            segment([x, y - height, z], [x - width, y, z], 0.20, 3, 1.18);
            segment([x - width, y - height, z], [x + width, y + height, z], 0.24, 3, 0.96);
            segment([x - width, y + height, z], [x + width, y - height, z], 0.24, 3, 0.96);
          }
        }
      });

      // Sparse motes catch high-frequency detail and stop the regular matrix
      // from becoming sterile. Their motion is intentionally much smaller.
      for (let index = 0; index < 1400; index += 1) {
        const x = (random() * 2 - 1) * 12.5;
        const y = (random() * 2 - 1) * 6.6;
        const z = -2.2 - random() * 53.8;
        push(x, y, z, 4, 0.52 + random() * 0.88);
      }
      return new Float32Array(points);
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

      const geometry = createPointGeometry();
      pointCount = geometry.length / 6;
      pointBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, pointBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, geometry, gl.STATIC_DRAW);
      attributes = {
        position: gl.getAttribLocation(program, "position"),
        seed: gl.getAttribLocation(program, "seed"),
        kind: gl.getAttribLocation(program, "kind"),
        pointSize: gl.getAttribLocation(program, "pointSize"),
      };
      canvas.dataset.attributeLocations = Object.values(attributes).join(",");
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
        trackHue: gl.getUniformLocation(program, "trackHue"),
        viewOffset: gl.getUniformLocation(program, "viewOffset"),
      };
      gl.enable(gl.BLEND);
      gl.blendEquation(gl.FUNC_ADD);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
      gl.disable(gl.DEPTH_TEST);
      canvas.dataset.renderer = "webgl";
      canvas.dataset.visualizer = "audio-reactive-crystal-universe";
      canvas.dataset.presentation = "full-screen-webgl";
      canvas.dataset.audioAnalysis = "fft-spectrum-flux-waveform";
      canvas.dataset.reactivity = "audio-color-particle-size-density-and-spark";
      canvas.dataset.motionProfile = "single-direction-infinite-led-drift";
      canvas.dataset.formLanguage = "crystalline-perspective-light-field";
      canvas.dataset.palette = "sapphire-lagoon-orchid-amber-track-palettes";
      canvas.dataset.dragControl = "left-pointer-view-pan";
      canvas.dataset.geometryPoints = String(pointCount);
      return true;
    };

    const initFallback = () => {
      fallback = canvas.getContext("2d");
      canvas.dataset.renderer = fallback ? "canvas2d" : "unavailable";
      canvas.dataset.visualizer = "audio-reactive-crystal-universe";
      canvas.dataset.presentation = "full-screen-webgl";
      canvas.dataset.audioAnalysis = "fft-spectrum-flux-waveform";
      canvas.dataset.reactivity = "audio-color-particle-size-density-and-spark";
      canvas.dataset.motionProfile = "single-direction-infinite-led-drift";
      canvas.dataset.formLanguage = "crystalline-perspective-light-field";
      canvas.dataset.palette = "sapphire-lagoon-orchid-amber-track-palettes";
      canvas.dataset.dragControl = "left-pointer-view-pan";
      return Boolean(fallback);
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(reduced ? 1 : 1.15, window.devicePixelRatio || 1);
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
      const t = (now - visualStartedAt) * 0.001;
      const centerX = width * (0.5 + Math.sin(t * 0.12) * 0.012);
      const centerY = height * (0.5 + Math.cos(t * 0.10) * 0.01);
      const background = fallback.createRadialGradient(centerX, centerY, 0, centerX, centerY, width * 0.72);
      background.addColorStop(0, `rgba(10, 74, 122, ${0.18 + smoothedEnergy * 0.12})`);
      background.addColorStop(0.35, "rgba(3, 17, 48, .2)");
      background.addColorStop(1, "rgba(0, 2, 16, .05)");
      fallback.globalCompositeOperation = "source-over";
      fallback.fillStyle = background;
      fallback.fillRect(0, 0, width, height);

      fallback.save();
      fallback.globalCompositeOperation = "screen";
      for (let depth = 0; depth < 15; depth += 1) {
        const travel = (depth / 15 + t * (0.018 + smoothedBands[1] * 0.025)) % 1;
        const scale = 0.04 + travel * travel * 1.05;
        const halfW = width * scale;
        const halfH = height * scale * 0.58;
        fallback.strokeStyle = `rgba(90, 205, 255, ${0.025 + travel * 0.11 + smoothedEnergy * 0.07})`;
        fallback.lineWidth = 0.6 + travel * 1.1;
        fallback.strokeRect(centerX - halfW, centerY - halfH, halfW * 2, halfH * 2);
        const columns = 12;
        const rows = 7;
        for (let column = 0; column <= columns; column += 1) {
          for (let row = 0; row <= rows; row += 1) {
            const x = centerX - halfW + (column / columns) * halfW * 2;
            const y = centerY - halfH + (row / rows) * halfH * 2;
            const shimmer = 0.42 + 0.58 * Math.sin(t * 1.7 + depth * 1.9 + column * 2.3 + row);
            const size = 0.45 + travel * 2.2 + smoothedBands[0] * 1.6 + Math.max(0, shimmer) * smoothedBands[2];
            fallback.globalAlpha = 0.08 + travel * 0.28 + smoothedEnergy * 0.18;
            fallback.fillStyle = shimmer > 0.82 ? "#f3fdff" : "#4fc8ff";
            fallback.shadowColor = fallback.fillStyle;
            fallback.shadowBlur = 5 + size * 4;
            fallback.beginPath();
            fallback.arc(x, y, size, 0, Math.PI * 2);
            fallback.fill();
          }
        }
      }
      fallback.restore();
      fallback.globalAlpha = 1;
    };

    const draw = (state, now = performance.now()) => {
      const frameInterval = reduced ? 84 : (innerWidth <= 720 ? 22 : 16);
      if (now - lastDrawAt < frameInterval) return;
      lastDrawAt = now;
      resize();
      if (!gl || !program || gl.isContextLost()) {
        drawFallback(state, now);
        return;
      }

      updateAudioState(state);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, pointBuffer);
      const stride = 6 * Float32Array.BYTES_PER_ELEMENT;
      gl.enableVertexAttribArray(attributes.position);
      gl.vertexAttribPointer(attributes.position, 3, gl.FLOAT, false, stride, 0);
      gl.enableVertexAttribArray(attributes.seed);
      gl.vertexAttribPointer(attributes.seed, 1, gl.FLOAT, false, stride, 3 * Float32Array.BYTES_PER_ELEMENT);
      gl.enableVertexAttribArray(attributes.kind);
      gl.vertexAttribPointer(attributes.kind, 1, gl.FLOAT, false, stride, 4 * Float32Array.BYTES_PER_ELEMENT);
      gl.enableVertexAttribArray(attributes.pointSize);
      gl.vertexAttribPointer(attributes.pointSize, 1, gl.FLOAT, false, stride, 5 * Float32Array.BYTES_PER_ELEMENT);
      gl.uniform2f(uniforms.resolution, canvas.width, canvas.height);
      gl.uniform1f(uniforms.time, (now - visualStartedAt) * 0.001 * (reduced ? 0.22 : 0.74));
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
      const trackIndex = Math.max(0, Object.keys(tracks).indexOf(state.track));
      gl.uniform1f(uniforms.trackHue, trackIndex / Math.max(1, Object.keys(tracks).length - 1));
      viewOffset[0] += (targetViewOffset[0] - viewOffset[0]) * 0.2;
      viewOffset[1] += (targetViewOffset[1] - viewOffset[1]) * 0.2;
      gl.uniform2f(uniforms.viewOffset, viewOffset[0], viewOffset[1]);
      gl.drawArrays(gl.POINTS, 0, pointCount);
      if (renderedFrames === 0) {
        canvas.dataset.webglError = String(gl.getError());
      }
      renderedFrames += 1;
      canvas.dataset.webglFrame = String(renderedFrames);
      canvas.dataset.viewX = viewOffset[0].toFixed(4);
      canvas.dataset.viewY = viewOffset[1].toFixed(4);
    };

    const finishDrag = (event) => {
      if (event.pointerId !== dragPointerId) return;
      if (layer.hasPointerCapture?.(event.pointerId)) layer.releasePointerCapture(event.pointerId);
      dragPointerId = null;
      layer.classList.remove("is-dragging-visualizer");
      canvas.dataset.dragging = "false";
    };

    layer.addEventListener("pointerdown", (event) => {
      if (event.pointerType !== "mouse" || event.button !== 0) return;
      if (event.target.closest("button, input, label, a, select, textarea")) return;
      dragPointerId = event.pointerId;
      dragX = event.clientX;
      dragY = event.clientY;
      layer.setPointerCapture?.(event.pointerId);
      layer.classList.add("is-dragging-visualizer");
      canvas.dataset.dragging = "true";
      event.preventDefault();
    });
    layer.addEventListener("pointermove", (event) => {
      if (event.pointerId !== dragPointerId) return;
      const deltaX = event.clientX - dragX;
      const deltaY = event.clientY - dragY;
      dragX = event.clientX;
      dragY = event.clientY;
      targetViewOffset[0] = Math.max(-0.62, Math.min(0.62, targetViewOffset[0] + deltaX / Math.max(480, innerWidth) * 1.55));
      targetViewOffset[1] = Math.max(-0.46, Math.min(0.46, targetViewOffset[1] - deltaY / Math.max(360, innerHeight) * 1.55));
      event.preventDefault();
    });
    layer.addEventListener("pointerup", finishDrag);
    layer.addEventListener("pointercancel", finishDrag);

    canvas.addEventListener("webglcontextlost", (event) => {
      event.preventDefault();
      canvas.dataset.renderer = "context-lost";
    });
    canvas.addEventListener("webglcontextrestored", () => {
      program = null;
      pointBuffer = null;
      pointCount = 0;
      attributes = null;
      uniforms = null;
      visualStartedAt = performance.now();
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
