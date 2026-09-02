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
    const smoothedTimbreBins = new Float32Array(8);
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
    const viewRotation = new Float32Array(2);
    const targetViewRotation = new Float32Array(2);
    let dragPointerId = null;
    let dragX = 0;
    let dragY = 0;

    const vertexSource = `
      precision highp float;

      attribute vec3 position;
      attribute float seed;
      attribute float kind;
      attribute float pointSize;
      attribute float tone;
      attribute float temperature;

      uniform vec2 resolution;
      uniform float time;
      uniform float bass;
      uniform float mid;
      uniform float high;
      uniform float pulse;
      uniform float flux;
      uniform float wave;
      uniform float densityResponse;
      uniform float meanderResponse;
      uniform float causticResponse;
      uniform float playing;
      uniform float trackHue;
      uniform vec2 viewRotation;
      uniform vec4 timbreLow;
      uniform vec4 timbreHigh;

      varying vec3 lightColor;
      varying float lightAlpha;
      varying float lightKind;
      varying float sparkle;
      varying float bandActivity;

      vec3 stellarPalette(float phase) {
        float spectralClass = fract(phase) * 7.0;
        // Approximate visible colours of the O, B, A, F, G, K and M stellar
        // temperature classes. Most stars remain close to white; temperature
        // is expressed as a restrained warm/cool bias instead of neon colour.
        vec3 oStar = vec3(0.46, 0.58, 1.18);
        vec3 bStar = vec3(0.58, 0.69, 1.12);
        vec3 aStar = vec3(0.73, 0.81, 1.06);
        vec3 fStar = vec3(0.97, 0.97, 1.00);
        vec3 gStar = vec3(1.00, 0.92, 0.78);
        vec3 kStar = vec3(1.08, 0.68, 0.36);
        vec3 mStar = vec3(1.16, 0.36, 0.20);
        if (spectralClass < 1.0) return mix(oStar, bStar, spectralClass);
        if (spectralClass < 2.0) return mix(bStar, aStar, spectralClass - 1.0);
        if (spectralClass < 3.0) return mix(aStar, fStar, spectralClass - 2.0);
        if (spectralClass < 4.0) return mix(fStar, gStar, spectralClass - 3.0);
        if (spectralClass < 5.0) return mix(gStar, kStar, spectralClass - 4.0);
        if (spectralClass < 6.0) return mix(kStar, mStar, spectralClass - 5.0);
        return mStar;
      }

      vec3 nebulaPalette(float phase) {
        float emissionClass = fract(phase) * 4.0;
        vec3 hydrogenAlpha = vec3(0.68, 0.07, 0.14);
        vec3 oxygenThree = vec3(0.08, 0.58, 0.55);
        vec3 reflectionBlue = vec3(0.20, 0.36, 0.78);
        vec3 sulphurGold = vec3(0.82, 0.46, 0.14);
        if (emissionClass < 1.0) return mix(hydrogenAlpha, oxygenThree, emissionClass);
        if (emissionClass < 2.0) return mix(oxygenThree, reflectionBlue, emissionClass - 1.0);
        if (emissionClass < 3.0) return mix(reflectionBlue, sulphurGold, emissionClass - 2.0);
        return mix(sulphurGold, hydrogenAlpha, emissionClass - 3.0);
      }

      float sampleTimbre(float selector) {
        float cursor = fract(selector) * 8.0;
        float blend = fract(cursor);
        if (cursor < 1.0) return mix(timbreLow.x, timbreLow.y, blend);
        if (cursor < 2.0) return mix(timbreLow.y, timbreLow.z, blend);
        if (cursor < 3.0) return mix(timbreLow.z, timbreLow.w, blend);
        if (cursor < 4.0) return mix(timbreLow.w, timbreHigh.x, blend);
        if (cursor < 5.0) return mix(timbreHigh.x, timbreHigh.y, blend);
        if (cursor < 6.0) return mix(timbreHigh.y, timbreHigh.z, blend);
        if (cursor < 7.0) return mix(timbreHigh.z, timbreHigh.w, blend);
        return mix(timbreHigh.w, timbreLow.x, blend);
      }

      void main() {
        float travelSpeed = mix(0.035, 0.16, playing);
        float depth = mod(-position.z - time * travelSpeed, 66.0) + 2.8;
        vec3 world = vec3(position.xy, -depth);
        float yawCos = cos(viewRotation.x);
        float yawSin = sin(viewRotation.x);
        world = vec3(
          yawCos * world.x + yawSin * world.z,
          world.y,
          -yawSin * world.x + yawCos * world.z
        );
        float pitchCos = cos(viewRotation.y);
        float pitchSin = sin(viewRotation.y);
        world = vec3(
          world.x,
          pitchCos * world.y - pitchSin * world.z,
          pitchSin * world.y + pitchCos * world.z
        );
        float cameraDepth = -world.z;
        float visible = step(0.9, cameraDepth);
        float focalLength = 1.34;
        vec2 projected = world.xy * focalLength / max(0.9, cameraDepth);
        float aspect = resolution.x / max(1.0, resolution.y);
        projected.x /= aspect;
        gl_Position = visible > 0.5 ? vec4(projected, 0.0, 1.0) : vec4(3.0, 3.0, 0.0, 1.0);

        float depthPulse = exp(-pow(fract(depth * 0.048 - time * 0.035) - 0.5, 2.0) * 48.0);
        float twinkle = 0.58 + 0.42 * sin(time * (0.42 + seed * 0.82) + seed * 47.0 + depth * 0.11);
        twinkle = max(0.0, twinkle);
        float fieldClass = 1.0 - step(0.5, kind);
        float armClass = step(0.5, kind) * (1.0 - step(1.5, kind));
        float nebulaClass = step(1.5, kind) * (1.0 - step(2.5, kind));
        float nurseryClass = step(2.5, kind) * (1.0 - step(3.5, kind));
        float dustClass = step(3.5, kind);
        // The FFT is split into eight timbre bins. Each arm segment, cloud and
        // nursery owns a different bin, so equal-coloured objects do not flash
        // together just because one broad bass/mid/high value moved.
        float localTimbre = sampleTimbre(tone);
        float neighbourTimbre = sampleTimbre(tone + 0.137);
        float spectralEdge = max(0.0, localTimbre - neighbourTimbre * 0.62);
        float spatialPhase = 0.5 + 0.5 * sin(tone * 51.0 + seed * 19.0 + depth * 0.083 + wave * tone * 1.2);
        float localGate = mix(0.28, 1.0, smoothstep(0.18, 0.88, spatialPhase));
        float localActivity = clamp((localTimbre * (1.02 + pulse * 0.14) + spectralEdge * 0.74) * localGate, 0.0, 1.58);
        float materialAffinity = fieldClass * 0.56
          + armClass * (0.62 + mid * 0.10 + meanderResponse * 0.08)
          + nebulaClass * (0.64 + bass * 0.10 + densityResponse * 0.08)
          + nurseryClass * (0.72 + high * 0.20)
          + dustClass * (0.52 + causticResponse * 0.18);
        bandActivity = 0.035 + localActivity * materialAffinity;

        float perspectiveSize = pointSize * (112.0 / max(2.2, cameraDepth));
        float pixelScale = clamp(resolution.y / 900.0, 0.82, 1.55);
        float audioSize = 1.0
          + localActivity * (
            nebulaClass * (0.08 + bass * 0.08)
            + armClass * (0.04 + mid * 0.05)
            + nurseryClass * (0.12 + high * 0.16)
            + dustClass * (0.04 + high * 0.07)
          );
        float classScale = dustClass > 0.5 ? 0.48 : (nebulaClass > 0.5 ? 1.62 : 1.0);
        gl_PointSize = clamp(perspectiveSize * pixelScale * audioSize * classScale, 1.05, 190.0);

        float nearFade = smoothstep(1.9, 4.5, depth);
        float farFade = 1.0 - smoothstep(52.0, 68.0, depth);
        float classLift = fieldClass * 0.52
          + armClass * 0.72
          + nebulaClass * 0.15
          + nurseryClass * 0.86
          + dustClass * 0.20;
        float dustReveal = dustClass > 0.5
          ? smoothstep(0.78 - localActivity * 0.32, 0.98, seed)
          : 1.0;
        lightAlpha = visible * nearFade * farFade * classLift * dustReveal
          * (0.30 + bandActivity * 0.86);
        lightAlpha *= 0.42 + playing * 0.58;
        sparkle = twinkle * (
          fieldClass * (0.08 + localActivity * 0.16)
          + armClass * (0.06 + localActivity * 0.11)
          + nebulaClass * (0.035 + localActivity * 0.05)
          + nurseryClass * (0.12 + localActivity * 0.68)
          + dustClass * (0.05 + localActivity * 0.38)
        ) + depthPulse * flux * localGate * (nurseryClass + dustClass * 0.45);
        lightKind = kind;
        // Temperature colour and audio-bin ownership are intentionally
        // independent. Two stars with the same colour can therefore listen to
        // different spectral components and never have to flash in unison.
        float localHue = fract(temperature * 0.88 + trackHue * 0.08 + seed * 0.02);
        vec3 starRestingColor = stellarPalette(localHue);
        vec3 starActiveColor = pow(stellarPalette(localHue + spectralEdge * 0.018), vec3(1.42));
        vec3 gasColor = nebulaPalette(fract(temperature * 0.73 + seed * 0.05));
        vec3 restingColor = mix(starRestingColor * 0.68, gasColor * 0.34, nebulaClass);
        vec3 activeColor = mix(starActiveColor, gasColor * 0.88, nebulaClass);
        lightColor = mix(restingColor, activeColor, clamp(0.24 + localActivity * 0.48, 0.0, 0.92));
        lightColor *= 0.76 + bandActivity * 0.42;
      }
    `;

    const fragmentSource = `
      precision highp float;

      varying vec3 lightColor;
      varying float lightAlpha;
      varying float lightKind;
      varying float sparkle;
      varying float bandActivity;

      void main() {
        vec2 point = gl_PointCoord - 0.5;
        float radius = length(point) * 2.0;
        if (radius > 1.0) discard;
        float angle = atan(point.y, point.x);
        float halo = exp(-radius * radius * 2.45) * (1.0 - smoothstep(0.76, 1.0, radius));
        float pearl = 1.0 - smoothstep(0.045, 0.19, radius);
        float cross = (
          exp(-abs(point.x) * 34.0) + exp(-abs(point.y) * 34.0)
        ) * exp(-radius * 2.6) * (0.045 + sparkle * 0.075);
        float faceted = 0.93 + 0.07 * cos(atan(point.y, point.x) * (4.0 + mod(lightKind, 3.0)));
        float nebulaClass = step(1.5, lightKind) * (1.0 - step(2.5, lightKind));
        float cloudGrain = 0.72 + 0.28 * sin(angle * 5.0 + radius * 16.0 + sparkle * 2.0);
        float nebulaAlpha = halo * halo * cloudGrain * (0.38 + bandActivity * 0.18);
        float starAlpha = halo * (0.45 + sparkle * 0.24) + pearl * 0.92 + cross;
        float alpha = mix(starAlpha, nebulaAlpha, nebulaClass) * lightAlpha * faceted;
        vec3 color = lightColor * mix(0.84 + halo * 1.02 + sparkle * 0.34, 0.54 + halo * 1.18, nebulaClass);
        color += lightColor * pearl * (0.38 + sparkle * 0.12) * (1.0 - nebulaClass);
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
      const push = (x, y, z, kind, size = 1, tone = random(), temperature = random()) => {
        points.push(
          x,
          y,
          z,
          random(),
          kind,
          size,
          Math.max(0, Math.min(0.999, tone)),
          Math.max(0, Math.min(0.999, temperature)),
        );
      };
      // A broad 3D star volume keeps the frame populated while the camera
      // rotates. The distribution widens with depth, like looking through a
      // real galactic field rather than at a flat particle curtain.
      for (let index = 0; index < 7200; index += 1) {
        const z = -2.8 - random() * 65.8;
        const depthSpread = 8 + (-z / 66) * 21;
        const angle = random() * Math.PI * 2;
        const radius = Math.sqrt(random()) * depthSpread;
        push(
          Math.cos(angle) * radius,
          Math.sin(angle) * radius * 0.62,
          z,
          random() > 0.82 ? 3 : 0,
          0.38 + Math.pow(random(), 2.2) * 1.72,
        );
      }

      // Four loose logarithmic arms. Every arm has a different depth and
      // thickness, so a left-drag exposes genuine parallax between layers.
      const armCount = 4;
      for (let arm = 0; arm < armCount; arm += 1) {
        for (let index = 0; index < 1450; index += 1) {
          const radius = 1.1 + Math.pow(random(), 0.72) * 17.5;
          const angle = arm / armCount * Math.PI * 2 + radius * 0.52 + (random() - 0.5) * (0.34 + radius * 0.018);
          const thickness = 0.24 + radius * 0.045;
          const x = Math.cos(angle) * radius + (random() - 0.5) * thickness;
          const y = Math.sin(angle) * radius * 0.54 + (random() - 0.5) * thickness * 0.72;
          const z = -3.2 - random() * 65.0 + Math.sin(angle * 1.7) * 1.8;
          const tone = (arm * 0.19 + radius * 0.041) % 1;
          const temperature = (arm * 0.27 + radius * 0.073 + 0.31) % 1;
          push(x, y, z, 1, 0.52 + random() * 1.26, tone, temperature);
        }
      }

      // Coloured gaseous knots sit inside the arms. Large, soft point sprites
      // overlap into painterly nebulae without introducing a costly texture.
      for (let index = 0; index < 1500; index += 1) {
        const arm = index % armCount;
        const radius = 2.4 + Math.pow(random(), 0.78) * 15.5;
        const angle = arm / armCount * Math.PI * 2 + radius * 0.52 + (random() - 0.5) * 0.52;
        const cloud = 0.5 + radius * 0.07;
        push(
          Math.cos(angle) * radius + (random() - 0.5) * cloud,
          Math.sin(angle) * radius * 0.54 + (random() - 0.5) * cloud * 0.72,
          -4.0 - random() * 63.0,
          2,
          7.0 + random() * 11.0,
          (arm * 0.23 + radius * 0.037) % 1,
          (arm * 0.31 + radius * 0.089 + 0.17) % 1,
        );
      }

      // Compact star nurseries form occasional bright constellations instead
      // of an evenly filled screen.
      for (let cluster = 0; cluster < 24; cluster += 1) {
        const centerAngle = random() * Math.PI * 2;
        const centerRadius = 3 + random() * 16;
        const centerX = Math.cos(centerAngle) * centerRadius;
        const centerY = Math.sin(centerAngle) * centerRadius * 0.55;
        const centerZ = -5 - random() * 60;
        const clusterTone = 0.02 + random() * 0.96;
        const clusterTemperature = 0.02 + random() * 0.96;
        for (let index = 0; index < 68; index += 1) {
          const spread = Math.pow(random(), 2.4) * 1.65;
          const angle = random() * Math.PI * 2;
          push(
            centerX + Math.cos(angle) * spread,
            centerY + Math.sin(angle) * spread * 0.72,
            centerZ + (random() - 0.5) * 2.8,
            3,
            0.7 + random() * 1.75,
            clusterTone + (random() - 0.5) * 0.018,
            clusterTemperature + (random() - 0.5) * 0.012,
          );
        }
      }

      // Fine dust is the only population whose visible density follows audio.
      for (let index = 0; index < 3600; index += 1) {
        const z = -2.8 - random() * 65.5;
        const spread = 9 + (-z / 66) * 18;
        push(
          (random() * 2 - 1) * spread,
          (random() * 2 - 1) * spread * 0.58,
          z,
          4,
          0.34 + random() * 0.72,
        );
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
      pointCount = geometry.length / 8;
      pointBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, pointBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, geometry, gl.STATIC_DRAW);
      attributes = {
        position: gl.getAttribLocation(program, "position"),
        seed: gl.getAttribLocation(program, "seed"),
        kind: gl.getAttribLocation(program, "kind"),
        pointSize: gl.getAttribLocation(program, "pointSize"),
        tone: gl.getAttribLocation(program, "tone"),
        temperature: gl.getAttribLocation(program, "temperature"),
      };
      canvas.dataset.attributeLocations = Object.values(attributes).join(",");
      uniforms = {
        resolution: gl.getUniformLocation(program, "resolution"),
        time: gl.getUniformLocation(program, "time"),
        bass: gl.getUniformLocation(program, "bass"),
        mid: gl.getUniformLocation(program, "mid"),
        high: gl.getUniformLocation(program, "high"),
        pulse: gl.getUniformLocation(program, "pulse"),
        flux: gl.getUniformLocation(program, "flux"),
        wave: gl.getUniformLocation(program, "wave"),
        densityResponse: gl.getUniformLocation(program, "densityResponse"),
        meanderResponse: gl.getUniformLocation(program, "meanderResponse"),
        causticResponse: gl.getUniformLocation(program, "causticResponse"),
        playing: gl.getUniformLocation(program, "playing"),
        trackHue: gl.getUniformLocation(program, "trackHue"),
        viewRotation: gl.getUniformLocation(program, "viewRotation"),
        timbreLow: gl.getUniformLocation(program, "timbreLow"),
        timbreHigh: gl.getUniformLocation(program, "timbreHigh"),
      };
      gl.enable(gl.BLEND);
      gl.blendEquation(gl.FUNC_ADD);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
      gl.disable(gl.DEPTH_TEST);
      canvas.dataset.renderer = "webgl";
      canvas.dataset.visualizer = "audio-reactive-deep-galaxy";
      canvas.dataset.presentation = "full-screen-webgl";
      canvas.dataset.audioAnalysis = "fft-spectrum-flux-waveform";
      canvas.dataset.reactivity = "fft8-local-timbre-regions";
      canvas.dataset.motionProfile = "fourfold-single-direction-galactic-drift";
      canvas.dataset.formLanguage = "spiral-nebula-starfield";
      canvas.dataset.palette = "stellar-obafgkm-and-emission-nebulae";
      canvas.dataset.illumination = "per-cluster-spectral-bin";
      canvas.dataset.timbreBins = "8";
      canvas.dataset.motionRate = "4x";
      canvas.dataset.dragControl = "left-pointer-orbit-3d";
      canvas.dataset.geometryPoints = String(pointCount);
      return true;
    };

    const initFallback = () => {
      fallback = canvas.getContext("2d");
      canvas.dataset.renderer = fallback ? "canvas2d" : "unavailable";
      canvas.dataset.visualizer = "audio-reactive-deep-galaxy";
      canvas.dataset.presentation = "full-screen-webgl";
      canvas.dataset.audioAnalysis = "fft-spectrum-flux-waveform";
      canvas.dataset.reactivity = "fft8-local-timbre-regions";
      canvas.dataset.motionProfile = "fourfold-single-direction-galactic-drift";
      canvas.dataset.formLanguage = "spiral-nebula-starfield";
      canvas.dataset.palette = "stellar-obafgkm-and-emission-nebulae";
      canvas.dataset.illumination = "per-cluster-spectral-bin";
      canvas.dataset.timbreBins = "8";
      canvas.dataset.motionRate = "4x";
      canvas.dataset.dragControl = "left-pointer-orbit-3d";
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
      for (let bin = 0; bin < smoothedTimbreBins.length; bin += 1) {
        let squaredEnergy = 0;
        for (let offset = 0; offset < 4; offset += 1) {
          const sample = Math.max(0, Math.min(1, spectrum[bin * 4 + offset] || 0));
          squaredEnergy += sample * sample;
        }
        const rootMeanSquare = Math.sqrt(squaredEnergy / 4);
        const boosted = active ? rootMeanSquare * automaticGain * 1.45 : 0;
        const compressed = boosted / (0.34 + boosted);
        const shaped = Math.pow(Math.min(0.98, compressed), 0.82);
        smoothedTimbreBins[bin] = easeBand(
          smoothedTimbreBins[bin],
          shaped,
          reduced ? 0.14 : 0.38,
          reduced ? 0.035 : 0.085,
        );
      }
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
      canvas.dataset.timbreProfile = Array.from(smoothedTimbreBins, (value) => value.toFixed(3)).join(",");
      let dominantTimbre = 0;
      for (let index = 1; index < smoothedTimbreBins.length; index += 1) {
        if (smoothedTimbreBins[index] > smoothedTimbreBins[dominantTimbre]) dominantTimbre = index;
      }
      canvas.dataset.dominantTimbre = String(dominantTimbre);
    };

    const drawFallback = (state, now) => {
      if (!fallback) return;
      updateAudioState(state);
      const width = canvas.width;
      const height = canvas.height;
      const t = (now - visualStartedAt) * 0.001 * (reduced ? 0.16 : 2.08);
      const centerX = width * (0.5 + Math.sin(t * 0.12) * 0.012);
      const centerY = height * (0.5 + Math.cos(t * 0.10) * 0.01);
      const background = fallback.createRadialGradient(centerX, centerY, 0, centerX, centerY, width * 0.72);
      background.addColorStop(0, "rgba(10, 74, 122, .18)");
      background.addColorStop(0.35, "rgba(3, 17, 48, .2)");
      background.addColorStop(1, "rgba(0, 2, 16, .05)");
      fallback.globalCompositeOperation = "source-over";
      fallback.fillStyle = background;
      fallback.fillRect(0, 0, width, height);

      fallback.save();
      fallback.globalCompositeOperation = "screen";
      const zoneColors = ["#9bb0ff", "#aabfff", "#cad7ff", "#f8f7ff", "#fff4ea", "#ffd2a1", "#ff8c52", "#9adbd7"];
      for (let depth = 0; depth < 15; depth += 1) {
        const travel = (depth / 15 + t * (0.018 + smoothedBands[1] * 0.025)) % 1;
        const zone = depth % smoothedTimbreBins.length;
        const zoneResponse = smoothedTimbreBins[zone];
        const scale = 0.04 + travel * travel * 1.05;
        const halfW = width * scale;
        const halfH = height * scale * 0.58;
        fallback.strokeStyle = zoneColors[zone];
        fallback.globalAlpha = 0.025 + travel * 0.09 + zoneResponse * 0.12;
        fallback.lineWidth = 0.6 + travel * 1.1;
        fallback.strokeRect(centerX - halfW, centerY - halfH, halfW * 2, halfH * 2);
        const columns = 12;
        const rows = 7;
        for (let column = 0; column <= columns; column += 1) {
          for (let row = 0; row <= rows; row += 1) {
            const x = centerX - halfW + (column / columns) * halfW * 2;
            const y = centerY - halfH + (row / rows) * halfH * 2;
            const shimmer = 0.42 + 0.58 * Math.sin(t * 1.7 + depth * 1.9 + column * 2.3 + row);
            const size = 0.45 + travel * 2.2 + zoneResponse * (zone >= 5 ? 1.5 : 1.15);
            fallback.globalAlpha = 0.06 + travel * 0.20 + zoneResponse * 0.30 * Math.max(0.24, shimmer);
            fallback.fillStyle = zoneColors[zone];
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
      const stride = 8 * Float32Array.BYTES_PER_ELEMENT;
      gl.enableVertexAttribArray(attributes.position);
      gl.vertexAttribPointer(attributes.position, 3, gl.FLOAT, false, stride, 0);
      gl.enableVertexAttribArray(attributes.seed);
      gl.vertexAttribPointer(attributes.seed, 1, gl.FLOAT, false, stride, 3 * Float32Array.BYTES_PER_ELEMENT);
      gl.enableVertexAttribArray(attributes.kind);
      gl.vertexAttribPointer(attributes.kind, 1, gl.FLOAT, false, stride, 4 * Float32Array.BYTES_PER_ELEMENT);
      gl.enableVertexAttribArray(attributes.pointSize);
      gl.vertexAttribPointer(attributes.pointSize, 1, gl.FLOAT, false, stride, 5 * Float32Array.BYTES_PER_ELEMENT);
      gl.enableVertexAttribArray(attributes.tone);
      gl.vertexAttribPointer(attributes.tone, 1, gl.FLOAT, false, stride, 6 * Float32Array.BYTES_PER_ELEMENT);
      gl.enableVertexAttribArray(attributes.temperature);
      gl.vertexAttribPointer(attributes.temperature, 1, gl.FLOAT, false, stride, 7 * Float32Array.BYTES_PER_ELEMENT);
      gl.uniform2f(uniforms.resolution, canvas.width, canvas.height);
      gl.uniform1f(uniforms.time, (now - visualStartedAt) * 0.001 * (reduced ? 0.16 : 2.08));
      gl.uniform1f(uniforms.bass, smoothedBands[0]);
      gl.uniform1f(uniforms.mid, smoothedBands[1]);
      gl.uniform1f(uniforms.high, smoothedBands[2]);
      gl.uniform1f(uniforms.pulse, smoothedPulse);
      gl.uniform1f(uniforms.flux, smoothedFlux);
      gl.uniform1f(uniforms.wave, smoothedWave);
      gl.uniform1f(uniforms.densityResponse, visualResponses[0]);
      gl.uniform1f(uniforms.meanderResponse, visualResponses[1]);
      gl.uniform1f(uniforms.causticResponse, visualResponses[2]);
      gl.uniform1f(uniforms.playing, state.playing ? 1 : 0);
      const trackIndex = Math.max(0, Object.keys(tracks).indexOf(state.track));
      gl.uniform1f(uniforms.trackHue, trackIndex / Math.max(1, Object.keys(tracks).length - 1));
      gl.uniform4f(uniforms.timbreLow, smoothedTimbreBins[0], smoothedTimbreBins[1], smoothedTimbreBins[2], smoothedTimbreBins[3]);
      gl.uniform4f(uniforms.timbreHigh, smoothedTimbreBins[4], smoothedTimbreBins[5], smoothedTimbreBins[6], smoothedTimbreBins[7]);
      viewRotation[0] += (targetViewRotation[0] - viewRotation[0]) * 0.13;
      viewRotation[1] += (targetViewRotation[1] - viewRotation[1]) * 0.13;
      gl.uniform2f(uniforms.viewRotation, viewRotation[0], viewRotation[1]);
      gl.drawArrays(gl.POINTS, 0, pointCount);
      if (renderedFrames === 0) {
        canvas.dataset.webglError = String(gl.getError());
      }
      renderedFrames += 1;
      canvas.dataset.webglFrame = String(renderedFrames);
      canvas.dataset.viewYaw = viewRotation[0].toFixed(4);
      canvas.dataset.viewPitch = viewRotation[1].toFixed(4);
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
      targetViewRotation[0] = Math.max(-0.42, Math.min(0.42, targetViewRotation[0] + deltaX / Math.max(480, innerWidth) * 1.22));
      targetViewRotation[1] = Math.max(-0.30, Math.min(0.30, targetViewRotation[1] - deltaY / Math.max(360, innerHeight) * 0.94));
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
