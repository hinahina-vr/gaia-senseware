(() => {
  "use strict";

  const SCENES = Object.freeze({
    awakening: Object.freeze({ index: 0, colors: ["#020611", "#0b5b73", "#9af7e4"] }),
    "many-senses": Object.freeze({ index: 1, colors: ["#030817", "#236b68", "#f0bd75"] }),
    excavation: Object.freeze({ index: 2, colors: ["#080814", "#75432f", "#65d6c8"] }),
    loom: Object.freeze({ index: 3, colors: ["#020515", "#4c2f87", "#7be8ff"] }),
    reconstruction: Object.freeze({ index: 4, colors: ["#020913", "#167d83", "#d4fff2"] }),
    galaxy: Object.freeze({ index: 5, colors: ["#01030d", "#3548a3", "#e6b8ff"] }),
    lineage: Object.freeze({ index: 6, colors: ["#020810", "#177064", "#9fffd0"] }),
    fossil: Object.freeze({ index: 7, colors: ["#08070c", "#725438", "#7ad6c4"] }),
    shore: Object.freeze({ index: 8, colors: ["#010713", "#0d6680", "#ffd09c"] }),
  });
  const DEFAULT_SCENE = SCENES.awakening;
  const PRESENCES = Object.freeze({
    narrator: Object.freeze({ index: 0, manifestation: "quiet-field" }),
    system: Object.freeze({ index: 1, manifestation: "measure-grid" }),
    lou: Object.freeze({ index: 2, manifestation: "orbit-seed" }),
    mizuha: Object.freeze({ index: 3, manifestation: "tide-memory" }),
    amane: Object.freeze({ index: 4, manifestation: "time-arc" }),
    sakuya: Object.freeze({ index: 5, manifestation: "crystal-trace" }),
    visitor: Object.freeze({ index: 6, manifestation: "witness-lens" }),
  });
  const DEFAULT_PRESENCE = PRESENCES.narrator;
  const VERTEX_SOURCE = `
    attribute vec2 a_position;
    varying vec2 v_uv;
    void main() {
      v_uv = a_position * 0.5 + 0.5;
      gl_Position = vec4(a_position, 0.0, 1.0);
    }
  `;
  const FRAGMENT_BODY = `
    varying vec2 v_uv;
    uniform vec2 u_resolution;
    uniform vec2 u_pointer;
    uniform float u_time;
    uniform float u_scene;
    uniform float u_speaker_from;
    uniform float u_speaker_from_gain;
    uniform float u_speaker_to;
    uniform float u_speaker_mix;
    uniform float u_signal;
    uniform float u_emphasis;
    uniform vec3 u_color_a;
    uniform vec3 u_color_b;
    uniform vec3 u_color_c;

    float hash21(vec2 p) {
      p = fract(p * vec2(123.34, 456.21));
      p += dot(p, p + 45.32);
      return fract(p.x * p.y);
    }

    float noise21(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(
        mix(hash21(i), hash21(i + vec2(1.0, 0.0)), f.x),
        mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0)), f.x),
        f.y
      );
    }

    mat2 rotate2d(float angle) {
      float s = sin(angle);
      float c = cos(angle);
      return mat2(c, -s, s, c);
    }

    float fbm(vec2 p) {
      float value = 0.0;
      float amplitude = 0.52;
      mat2 turn = rotate2d(0.53);
      for (int octave = 0; octave < 4; octave += 1) {
        value += amplitude * noise21(p);
        p = turn * p * 2.04 + vec2(7.1, 3.7);
        amplitude *= 0.49;
      }
      return value;
    }

    float starLayer(vec2 p, float scale, float seed, float threshold) {
      vec2 grid = p * scale;
      vec2 id = floor(grid);
      vec2 cell = fract(grid) - 0.5;
      float random = hash21(id + seed);
      vec2 offset = vec2(hash21(id + seed + 13.7), hash21(id + seed + 31.9)) - 0.5;
      float radius = mix(0.018, 0.075, pow(random, 18.0));
      float core = 1.0 - smoothstep(0.0, radius, length(cell - offset * 0.58));
      float twinkle = 0.72 + 0.28 * sin(u_time * (0.45 + random * 1.6) + random * 41.0);
      return core * step(threshold, random) * twinkle;
    }

    float fieldEnvelope(vec2 p) {
      vec2 edgeFade = 1.0 - smoothstep(vec2(0.68, 0.58), vec2(1.72, 1.38), abs(p));
      return clamp(edgeFade.x * edgeFade.y, 0.0, 1.0);
    }

    vec3 quietField(vec2 p) {
      vec2 g = p;
      float phase = u_time * 0.12 + u_signal * 4.0;
      float breath = 0.5 + 0.5 * sin(u_time * 0.18 + u_signal * 6.2831);
      float mist = fbm(g * 1.16 + vec2(phase * 0.045, -phase * 0.028));
      float softGrain = fbm(g * 2.08 - vec2(phase * 0.026, phase * 0.018));
      float field = fieldEnvelope(g);
      return mix(u_color_b, u_color_c, 0.34)
        * field * (0.018 + mist * (0.052 + breath * 0.014) + softGrain * 0.026);
    }

    vec3 measureGrid(vec2 p) {
      vec2 g = p;
      float phase = u_time * 0.2 + u_signal * 5.0;
      float dataMist = fbm(g * 2.36 + vec2(phase * 0.046, -phase * 0.031));
      float fineNoise = fbm(g * vec2(3.4, 2.15) - vec2(phase * 0.024, phase * 0.017));
      float samples = starLayer(g + vec2(phase * 0.008, 0.0), 13.0, 67.0 + u_signal, 0.96);
      float field = fieldEnvelope(g);
      return mix(u_color_b, u_color_c, 0.74)
        * field * (dataMist * 0.07 + fineNoise * 0.045 + samples * 0.54);
    }

    vec3 orbitSeed(vec2 p) {
      vec2 g = p;
      float phase = u_time * 0.2 + u_signal * 7.0;
      float pearlMist = fbm(g * vec2(0.58, 1.62) + vec2(phase * 0.04, -phase * 0.022));
      float pearlGrain = fbm(g * vec2(1.15, 2.68) - vec2(phase * 0.018, phase * 0.013));
      float pearlGlow = pow(max(0.0, pearlMist * 0.68 + pearlGrain * 0.32), 2.1);
      float motes = starLayer(g + vec2(-phase * 0.014, phase * 0.006), 11.0, 79.0 + u_signal, 0.945);
      float field = fieldEnvelope(g);
      vec3 pearl = mix(vec3(0.62, 0.94, 1.0), vec3(0.94, 1.0, 0.96), 0.52);
      return pearl * field
        * (pearlMist * 0.055 + pearlGrain * 0.036 + pearlGlow * 0.12 + motes * 0.66);
    }

    vec3 tideMemory(vec2 p) {
      vec2 g = p;
      float phase = u_time * 0.24 + u_signal * 6.0;
      float waterMist = fbm(g * vec2(0.92, 1.38) + vec2(phase * 0.026, -phase * 0.052));
      float suspendedLight = fbm(g * 2.72 - vec2(phase * 0.017, phase * 0.034));
      float shimmer = pow(max(0.0, suspendedLight - waterMist * 0.34), 2.0);
      float field = fieldEnvelope(g);
      return mix(u_color_b, vec3(0.68, 1.0, 0.93), 0.62)
        * field * (waterMist * 0.075 + suspendedLight * 0.032 + shimmer * 0.12);
    }

    vec3 timeArc(vec2 p) {
      vec2 g = p;
      float phase = u_time * 0.24 + u_signal * 5.0;
      float temporalMist = fbm(g * vec2(1.48, 0.86) + vec2(-phase * 0.046, phase * 0.018));
      float distantMist = fbm(g * vec2(2.42, 1.32) + vec2(phase * 0.022, -phase * 0.013));
      float afterimage = pow(max(0.0, temporalMist * 0.72 + distantMist * 0.28), 2.35);
      float motes = starLayer(g + vec2(-u_time * 0.012, 0.0), 12.0, 93.0 + u_signal, 0.95);
      float field = fieldEnvelope(g);
      return mix(vec3(0.62, 0.83, 1.0), u_color_c, 0.48)
        * field * (temporalMist * 0.062 + distantMist * 0.034 + afterimage * 0.1 + motes * 0.62);
    }

    vec3 crystalTrace(vec2 p) {
      vec2 g = p;
      float phase = u_time * 0.14 + u_signal * 6.0;
      float lavenderMist = fbm(g * 1.94 + vec2(phase * 0.034, -phase * 0.021));
      float mineralGrain = fbm(g * 4.18 - vec2(phase * 0.016, phase * 0.012));
      float softGlint = pow(max(0.0, mineralGrain - 0.54), 2.4) * 1.7;
      float motes = starLayer(g + vec2(phase * 0.01, -phase * 0.006), 15.0, 109.0 + u_signal, 0.955);
      float field = fieldEnvelope(g);
      vec3 lavender = mix(vec3(0.56, 0.72, 1.0), vec3(0.93, 0.62, 1.0), 0.66);
      return lavender * field
        * (lavenderMist * 0.058 + mineralGrain * 0.034 + softGlint * 0.11 + motes * 0.58);
    }

    vec3 witnessLens(vec2 p) {
      vec2 g = p;
      float phase = u_time * 0.18 + u_signal * 7.0;
      float amberMist = fbm(g * vec2(1.68, 0.72) + vec2(-phase * 0.028, phase * 0.019));
      float warmGrain = fbm(g * vec2(2.82, 1.42) + vec2(phase * 0.017, -phase * 0.011));
      float warmBloom = pow(max(0.0, amberMist * 0.74 + warmGrain * 0.26), 2.2);
      float motes = starLayer(g + vec2(phase * 0.009, phase * 0.004), 10.0, 131.0 + u_signal, 0.94);
      float field = fieldEnvelope(g);
      vec3 amber = mix(vec3(1.0, 0.7, 0.38), vec3(1.0, 0.97, 0.78), 0.7);
      return amber * field
        * (amberMist * 0.064 + warmGrain * 0.036 + warmBloom * 0.11 + motes * 0.64);
    }

    vec3 presenceField(vec2 p, float speaker) {
      if (speaker < -0.5) return vec3(0.0);
      if (speaker < 0.5) return quietField(p);
      if (speaker < 1.5) return measureGrid(p);
      if (speaker < 2.5) return orbitSeed(p);
      if (speaker < 3.5) return tideMemory(p);
      if (speaker < 4.5) return timeArc(p);
      if (speaker < 5.5) return crystalTrace(p);
      return witnessLens(p);
    }

    void main() {
      vec2 p = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / max(1.0, min(u_resolution.x, u_resolution.y));
      float aspect = u_resolution.x / max(1.0, u_resolution.y);
      p.x *= mix(1.0, 0.82, smoothstep(1.2, 2.2, aspect));

      float scenePhase = u_scene * 0.71;
      float slowTime = u_time * 0.025;
      vec2 drift = vec2(cos(scenePhase + slowTime), sin(scenePhase * 1.37 - slowTime)) * 0.22;
      vec2 q = rotate2d(0.18 * sin(scenePhase)) * (p + drift + u_pointer * vec2(0.035, 0.024));
      float cloud = fbm(q * 1.16 + vec2(slowTime, -slowTime * 0.7));
      float detail = fbm(q * 2.34 - vec2(slowTime * 0.62, scenePhase * 0.28));
      float macroMist = fbm(q * 0.64 + vec2(-slowTime * 0.24, scenePhase * 0.12));
      float veil = smoothstep(0.24, 0.9, cloud);
      float softDetail = smoothstep(0.36, 0.86, detail);

      vec3 color = u_color_a * (0.7 + macroMist * 0.12);
      color += u_color_b * veil * 0.58;
      color += mix(u_color_b, u_color_c, 0.58) * softDetail * 0.16;
      color += mix(u_color_a, u_color_c, 0.46) * macroMist * 0.09;

      float stars = starLayer(p + vec2(slowTime * 0.08, 0.0), 17.0, 7.0 + u_scene, 0.972);
      stars += starLayer(rotate2d(0.24) * p - vec2(slowTime * 0.05, 0.0), 29.0, 19.0 + u_scene * 2.0, 0.982) * 0.72;
      stars += starLayer(rotate2d(-0.17) * p, 46.0, 41.0 + u_scene * 3.0, 0.988) * 0.5;
      color += mix(vec3(0.72, 0.88, 1.0), u_color_c, 0.32) * stars * 1.7;

      float presenceFadeOut = 1.0 - smoothstep(0.0, 0.58, u_speaker_mix);
      float presenceFadeIn = smoothstep(0.42, 1.0, u_speaker_mix);
      vec3 presence = presenceField(p, u_speaker_from) * u_speaker_from_gain * presenceFadeOut
        + presenceField(p, u_speaker_to) * presenceFadeIn;
      float presenceStrength = 0.82 + u_emphasis * 0.32;
      color += presence * presenceStrength;

      float dust = hash21(gl_FragCoord.xy + floor(u_time * 0.12)) - 0.5;
      color += dust * 0.012;
      float vignette = 1.0 - smoothstep(0.18, 1.48, length(p * vec2(0.72, 0.92)));
      color *= 0.48 + vignette * 0.74;
      color = vec3(1.0) - exp(-color * 1.18);
      color = pow(max(color, 0.0), vec3(0.88));
      gl_FragColor = vec4(color, 1.0);
    }
  `;

  const colorToRgb = (hex) => {
    const value = Number.parseInt(String(hex).replace("#", ""), 16);
    return [((value >> 16) & 255) / 255, ((value >> 8) & 255) / 255, (value & 255) / 255];
  };

  const paletteFor = (name) => {
    const scene = SCENES[name] || DEFAULT_SCENE;
    return {
      index: scene.index,
      colors: scene.colors.map(colorToRgb),
    };
  };

  const presenceFor = (name) => PRESENCES[name] || DEFAULT_PRESENCE;

  const signalFor = (value) => {
    let hash = 2166136261;
    for (const character of String(value || "")) {
      hash ^= character.codePointAt(0);
      hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0) / 4294967295;
  };

  const createFallback = (canvas) => {
    canvas.classList.add("is-fallback");
    canvas.dataset.webglState = "fallback";
    return Object.freeze({
      active: false,
      setScene(name) {
        canvas.dataset.webglScene = name || "awakening";
        return Promise.resolve({ cancelled: false });
      },
      setPresence(name, { emphasis = false, signal = "" } = {}) {
        const presence = presenceFor(name);
        canvas.dataset.webglSpeaker = PRESENCES[name] ? name : "narrator";
        canvas.dataset.webglManifestation = presence.manifestation;
        canvas.dataset.webglSignal = signalFor(signal).toFixed(6);
        canvas.dataset.webglEmphasis = emphasis ? "true" : "false";
        canvas.dataset.webglPresenceMix = "1.0000";
        canvas.dataset.webglPresenceState = "steady";
        canvas.dataset.webglPresenceDuration = "0";
        canvas.dataset.webglPresenceCompletedAt = performance.now().toFixed(3);
        return Promise.resolve({ changed: false, cancelled: false });
      },
      destroy() {},
    });
  };

  const create = ({ canvas, shell } = {}) => {
    if (!(canvas instanceof HTMLCanvasElement) || !(shell instanceof HTMLElement)) return null;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let gl;
    try {
      gl = canvas.getContext("webgl", {
        alpha: false,
        antialias: false,
        depth: false,
        stencil: false,
        powerPreference: "high-performance",
      });
    } catch {
      gl = null;
    }
    if (!gl) return createFallback(canvas);

    const highPrecision = gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT)?.precision > 0;
    const compileShader = (type, source) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
      gl.deleteShader(shader);
      return null;
    };
    const vertex = compileShader(gl.VERTEX_SHADER, VERTEX_SOURCE);
    const fragment = compileShader(gl.FRAGMENT_SHADER, `precision ${highPrecision ? "highp" : "mediump"} float;\n${FRAGMENT_BODY}`);
    if (!vertex || !fragment) return createFallback(canvas);
    const program = gl.createProgram();
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program);
      return createFallback(canvas);
    }

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.useProgram(program);
    const position = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    const uniforms = Object.fromEntries([
      "u_resolution", "u_pointer", "u_time", "u_scene", "u_speaker_from", "u_speaker_from_gain", "u_speaker_to",
      "u_speaker_mix", "u_signal", "u_emphasis", "u_color_a", "u_color_b", "u_color_c",
    ].map((name) => [name, gl.getUniformLocation(program, name)]));

    let destroyed = false;
    let frame = 0;
    let raf = 0;
    let lastRenderedAt = 0;
    let pointer = [0, 0];
    let pointerTarget = [0, 0];
    let current = paletteFor("awakening");
    let fromColors = current.colors.map((color) => [...color]);
    let target = current;
    let transitionStartedAt = performance.now();
    const transitionDuration = 1200;
    let presenceFrom = -1;
    let presenceTarget = -1;
    let presenceFromGain = 1;
    let presenceTransitionStartedAt = performance.now();
    const presenceTransitionDuration = 380;
    let presenceSignalFrom = 0;
    let presenceSignalTarget = 0;
    let presenceEmphasisFrom = 0;
    let presenceEmphasisTarget = 0;
    let presenceSignalStartedAt = performance.now();
    const presenceSignalDuration = 520;
    let presenceStatusTimer = 0;
    let presenceCompletionTimer = 0;
    let presenceCompletionResolve = null;
    let sceneCompletionResolve = null;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const quality = innerWidth <= 720 ? 0.68 : 0.72;
      const ratio = Math.min(devicePixelRatio || 1, innerWidth <= 720 ? 1.25 : 1.6) * quality;
      const targetWidth = Math.max(2, rect.width * ratio);
      const targetHeight = Math.max(2, rect.height * ratio);
      const renderScale = Math.min(1, 1440 / targetWidth, 900 / targetHeight);
      const width = Math.max(2, Math.round(targetWidth * renderScale));
      const height = Math.max(2, Math.round(targetHeight * renderScale));
      if (canvas.width === width && canvas.height === height) return;
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
    };

    const paletteAt = (now) => {
      const progress = reducedMotion.matches ? 1 : Math.min(1, (now - transitionStartedAt) / transitionDuration);
      const eased = progress * progress * (3 - 2 * progress);
      const colors = fromColors.map((color, colorIndex) => color.map((channel, channelIndex) => (
        channel + (target.colors[colorIndex][channelIndex] - channel) * eased
      )));
      if (progress >= 1) {
        current = target;
        fromColors = target.colors.map((color) => [...color]);
      }
      return colors;
    };

    const smoothProgress = (now, startedAt, duration) => {
      const progress = reducedMotion.matches ? 1 : Math.min(1, Math.max(0, (now - startedAt) / duration));
      return progress * progress * (3 - 2 * progress);
    };

    const presenceStateAt = (now) => {
      const mix = smoothProgress(now, presenceTransitionStartedAt, presenceTransitionDuration);
      return {
        mix,
        fromGain: presenceFromGain * (1 - smoothProgress(mix, 0, 0.58)),
        targetGain: smoothProgress(mix, 0.42, 0.58),
      };
    };

    const signalStateAt = (now) => {
      const mix = smoothProgress(now, presenceSignalStartedAt, presenceSignalDuration);
      return {
        signal: presenceSignalFrom + (presenceSignalTarget - presenceSignalFrom) * mix,
        emphasis: presenceEmphasisFrom + (presenceEmphasisTarget - presenceEmphasisFrom) * mix,
      };
    };

    const settlePresenceTransition = (cancelled = false) => {
      clearTimeout(presenceCompletionTimer);
      presenceCompletionTimer = 0;
      const resolve = presenceCompletionResolve;
      presenceCompletionResolve = null;
      resolve?.({ changed: true, cancelled });
    };

    const settleSceneDraw = (cancelled = false) => {
      const resolve = sceneCompletionResolve;
      sceneCompletionResolve = null;
      resolve?.({ cancelled });
    };

    const syncPresenceStatus = (now = performance.now()) => {
      const state = presenceStateAt(now);
      canvas.dataset.webglPresenceMix = state.mix.toFixed(4);
      canvas.dataset.webglPresenceState = state.mix < 0.9999 ? "fading" : "steady";
      if (state.mix >= 0.9999 && presenceCompletionResolve) {
        canvas.dataset.webglPresenceCompletedAt = now.toFixed(3);
        settlePresenceTransition(false);
      }
      return state;
    };

    const schedulePresenceStatus = () => {
      clearTimeout(presenceStatusTimer);
      presenceStatusTimer = 0;
      const tick = () => {
        if (destroyed) return;
        const state = syncPresenceStatus();
        if (!reducedMotion.matches && state.mix < 0.9999) {
          presenceStatusTimer = window.setTimeout(tick, 40);
        }
      };
      tick();
    };

    const draw = (now = performance.now()) => {
      if (destroyed) return;
      const frameInterval = innerWidth <= 720 ? 1000 / 20 : 1000 / 24;
      if (!reducedMotion.matches && lastRenderedAt > 0 && now - lastRenderedAt < frameInterval) {
        raf = requestAnimationFrame(draw);
        return;
      }
      lastRenderedAt = now;
      resize();
      pointer[0] += (pointerTarget[0] - pointer[0]) * 0.035;
      pointer[1] += (pointerTarget[1] - pointer[1]) * 0.035;
      const colors = paletteAt(now);
      gl.useProgram(program);
      gl.uniform2f(uniforms.u_resolution, canvas.width, canvas.height);
      gl.uniform2f(uniforms.u_pointer, pointer[0], pointer[1]);
      gl.uniform1f(uniforms.u_time, reducedMotion.matches ? 24 + target.index * 3.7 : now * 0.001);
      gl.uniform1f(uniforms.u_scene, target.index);
      const presenceState = presenceStateAt(now);
      const signalState = signalStateAt(now);
      gl.uniform1f(uniforms.u_speaker_from, presenceFrom);
      gl.uniform1f(uniforms.u_speaker_from_gain, presenceFromGain);
      gl.uniform1f(uniforms.u_speaker_to, presenceTarget);
      gl.uniform1f(uniforms.u_speaker_mix, presenceState.mix);
      gl.uniform1f(uniforms.u_signal, signalState.signal);
      gl.uniform1f(uniforms.u_emphasis, signalState.emphasis);
      gl.uniform3fv(uniforms.u_color_a, colors[0]);
      gl.uniform3fv(uniforms.u_color_b, colors[1]);
      gl.uniform3fv(uniforms.u_color_c, colors[2]);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      frame += 1;
      canvas.dataset.webglFrame = String(frame);
      if (sceneCompletionResolve) settleSceneDraw(false);
      syncPresenceStatus(now);
      if (!reducedMotion.matches && !document.hidden) raf = requestAnimationFrame(draw);
    };

    const start = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      if (!document.hidden) draw();
    };
    const scheduleStaticDraw = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      if (!document.hidden) raf = requestAnimationFrame((now) => {
        raf = 0;
        draw(now);
      });
    };
    const onPointerMove = (event) => {
      pointerTarget = [event.clientX / Math.max(1, innerWidth) - 0.5, 0.5 - event.clientY / Math.max(1, innerHeight)];
    };
    const onVisibilityChange = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      if (!document.hidden) {
        schedulePresenceStatus();
        draw();
      }
    };
    const onMotionChange = () => start();
    const onContextLost = (event) => {
      event.preventDefault();
      cancelAnimationFrame(raf);
      raf = 0;
      canvas.dataset.webglState = "lost";
      canvas.classList.add("is-fallback");
    };
    const observer = typeof ResizeObserver === "function" ? new ResizeObserver(() => start()) : null;
    observer?.observe(canvas);
    if (!observer) window.addEventListener("resize", start, { passive: true });
    shell.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);
    reducedMotion.addEventListener?.("change", onMotionChange);
    canvas.addEventListener("webglcontextlost", onContextLost);
    canvas.dataset.webglState = "active";
    canvas.dataset.webglScene = "awakening";
    canvas.dataset.webglSpeaker = "narrator";
    canvas.dataset.webglManifestation = DEFAULT_PRESENCE.manifestation;
    canvas.dataset.webglSignal = "0.000000";
    canvas.dataset.webglEmphasis = "false";
    canvas.dataset.webglPresenceMix = "0.0000";
    canvas.dataset.webglPresenceState = "hidden";
    canvas.dataset.webglPresenceDuration = String(presenceTransitionDuration);
    start();

    return Object.freeze({
      active: true,
      setScene(name, { immediate = false } = {}) {
        settleSceneDraw(true);
        const next = paletteFor(name);
        const now = performance.now();
        fromColors = immediate ? next.colors.map((color) => [...color]) : paletteAt(now).map((color) => [...color]);
        target = next;
        if (immediate) current = next;
        transitionStartedAt = immediate ? now - transitionDuration : now;
        canvas.dataset.webglScene = SCENES[name] ? name : "awakening";
        canvas.dataset.webglSceneIndex = String(next.index);
        const completion = new Promise((resolve) => { sceneCompletionResolve = resolve; });
        if (reducedMotion.matches) scheduleStaticDraw();
        else start();
        return completion;
      },
      setPresence(name, { emphasis = false, signal = "", immediate = false } = {}) {
        const next = presenceFor(name);
        const now = performance.now();
        const shouldJump = immediate || reducedMotion.matches;
        const currentPresence = presenceStateAt(now);
        const currentSignal = signalStateAt(now);
        const isSamePresence = presenceTarget === next.index;
        settlePresenceTransition(true);
        if (shouldJump) {
          presenceFrom = next.index;
          presenceTarget = next.index;
          presenceFromGain = 1;
          presenceTransitionStartedAt = now - presenceTransitionDuration;
        } else if (!isSamePresence) {
          const sourceIsTarget = currentPresence.targetGain >= currentPresence.fromGain;
          presenceFrom = sourceIsTarget ? presenceTarget : presenceFrom;
          presenceFromGain = Math.max(currentPresence.targetGain, currentPresence.fromGain);
          presenceTarget = next.index;
          presenceTransitionStartedAt = now;
        }
        presenceSignalFrom = shouldJump ? signalFor(signal) : currentSignal.signal;
        presenceSignalTarget = signalFor(signal);
        presenceEmphasisFrom = shouldJump ? (emphasis ? 1 : 0) : currentSignal.emphasis;
        presenceEmphasisTarget = emphasis ? 1 : 0;
        presenceSignalStartedAt = shouldJump ? now - presenceSignalDuration : now;
        canvas.dataset.webglSpeaker = PRESENCES[name] ? name : "narrator";
        canvas.dataset.webglManifestation = next.manifestation;
        canvas.dataset.webglSignal = presenceSignalTarget.toFixed(6);
        canvas.dataset.webglEmphasis = emphasis ? "true" : "false";
        if (shouldJump || isSamePresence) canvas.dataset.webglPresenceCompletedAt = now.toFixed(3);
        else delete canvas.dataset.webglPresenceCompletedAt;
        const completion = shouldJump || isSamePresence
          ? Promise.resolve({ changed: false, cancelled: false })
          : new Promise((resolve) => {
              presenceCompletionResolve = resolve;
              presenceCompletionTimer = window.setTimeout(() => syncPresenceStatus(), presenceTransitionDuration + 80);
            });
        schedulePresenceStatus();
        if (reducedMotion.matches) scheduleStaticDraw();
        else start();
        return completion;
      },
      destroy() {
        if (destroyed) return;
        destroyed = true;
        cancelAnimationFrame(raf);
        clearTimeout(presenceStatusTimer);
        settlePresenceTransition(true);
        settleSceneDraw(true);
        observer?.disconnect();
        if (!observer) window.removeEventListener("resize", start);
        shell.removeEventListener("pointermove", onPointerMove);
        document.removeEventListener("visibilitychange", onVisibilityChange);
        reducedMotion.removeEventListener?.("change", onMotionChange);
        canvas.removeEventListener("webglcontextlost", onContextLost);
        gl.deleteBuffer(buffer);
        gl.deleteProgram(program);
      },
    });
  };

  globalThis.GaiaTrueEndWebGL = Object.freeze({ create });
})();
