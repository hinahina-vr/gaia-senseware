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
      for (int octave = 0; octave < 5; octave += 1) {
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

    void main() {
      vec2 p = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / max(1.0, min(u_resolution.x, u_resolution.y));
      float aspect = u_resolution.x / max(1.0, u_resolution.y);
      p.x *= mix(1.0, 0.82, smoothstep(1.2, 2.2, aspect));
      p += u_pointer * vec2(0.035, 0.024);

      float scenePhase = u_scene * 0.71;
      float slowTime = u_time * 0.025;
      vec2 drift = vec2(cos(scenePhase + slowTime), sin(scenePhase * 1.37 - slowTime)) * 0.22;
      vec2 q = rotate2d(0.18 * sin(scenePhase)) * (p + drift);
      float cloud = fbm(q * 1.16 + vec2(slowTime, -slowTime * 0.7));
      float detail = fbm(q * 2.65 - vec2(slowTime * 0.8, scenePhase));
      float ridge = pow(max(0.0, 1.0 - abs(detail * 2.0 - 1.0)), 3.4);
      float veil = smoothstep(0.28, 0.9, cloud) * (0.52 + ridge * 0.62);

      float angle = atan(q.y, q.x);
      float radius = length(q);
      float spiral = sin(angle * (3.0 + mod(u_scene, 3.0)) - log(radius + 0.16) * 4.6 + slowTime * 6.0);
      float arm = pow(max(0.0, spiral * 0.5 + 0.5), 5.0) * exp(-radius * 0.72);
      float filamentNoise = fbm(q * 3.8 + vec2(scenePhase, -slowTime));
      float filament = exp(-34.0 * abs(q.y * 0.58 + 0.16 * sin(q.x * 2.8 + filamentNoise * 4.5 + scenePhase)));

      vec3 color = u_color_a * (0.66 + 0.24 * (1.0 - radius));
      color += u_color_b * veil * 0.72;
      color += mix(u_color_b, u_color_c, 0.62) * ridge * 0.31;
      color += u_color_c * arm * (0.13 + cloud * 0.19);
      color += mix(u_color_b, u_color_c, 0.4) * filament * (0.035 + 0.08 * detail);

      vec2 beacon = vec2(sin(scenePhase * 1.71) * 0.62, cos(scenePhase * 1.13) * 0.34);
      float beaconDistance = length(p - beacon);
      float halo = 0.014 / max(0.025, beaconDistance);
      float ringRadius = 0.18 + 0.035 * mod(u_scene, 4.0);
      float orbit = exp(-125.0 * abs(beaconDistance - ringRadius));
      orbit *= 0.36 + 0.64 * smoothstep(-0.8, 0.8, sin(atan(p.y - beacon.y, p.x - beacon.x) * 3.0 + u_time * 0.11));
      color += u_color_c * halo * 0.42;
      color += mix(u_color_b, u_color_c, 0.72) * orbit * 0.16;

      float stars = starLayer(p + vec2(slowTime * 0.08, 0.0), 17.0, 7.0 + u_scene, 0.972);
      stars += starLayer(rotate2d(0.24) * p - vec2(slowTime * 0.05, 0.0), 29.0, 19.0 + u_scene * 2.0, 0.982) * 0.72;
      stars += starLayer(rotate2d(-0.17) * p, 46.0, 41.0 + u_scene * 3.0, 0.988) * 0.5;
      color += mix(vec3(0.72, 0.88, 1.0), u_color_c, 0.32) * stars * 1.7;

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

  const createFallback = (canvas) => {
    canvas.classList.add("is-fallback");
    canvas.dataset.webglState = "fallback";
    return Object.freeze({
      active: false,
      setScene(name) { canvas.dataset.webglScene = name || "awakening"; },
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
      "u_resolution", "u_pointer", "u_time", "u_scene", "u_color_a", "u_color_b", "u_color_c",
    ].map((name) => [name, gl.getUniformLocation(program, name)]));

    let destroyed = false;
    let frame = 0;
    let raf = 0;
    let pointer = [0, 0];
    let pointerTarget = [0, 0];
    let current = paletteFor("awakening");
    let fromColors = current.colors.map((color) => [...color]);
    let target = current;
    let transitionStartedAt = performance.now();
    const transitionDuration = 1200;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const quality = innerWidth <= 720 ? 0.72 : 0.86;
      const ratio = Math.min(devicePixelRatio || 1, innerWidth <= 720 ? 1.25 : 1.6) * quality;
      const targetWidth = Math.max(2, rect.width * ratio);
      const targetHeight = Math.max(2, rect.height * ratio);
      const renderScale = Math.min(1, 1920 / targetWidth, 1080 / targetHeight);
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

    const draw = (now = performance.now()) => {
      if (destroyed) return;
      resize();
      pointer[0] += (pointerTarget[0] - pointer[0]) * 0.035;
      pointer[1] += (pointerTarget[1] - pointer[1]) * 0.035;
      const colors = paletteAt(now);
      gl.useProgram(program);
      gl.uniform2f(uniforms.u_resolution, canvas.width, canvas.height);
      gl.uniform2f(uniforms.u_pointer, pointer[0], pointer[1]);
      gl.uniform1f(uniforms.u_time, reducedMotion.matches ? 24 + target.index * 3.7 : now * 0.001);
      gl.uniform1f(uniforms.u_scene, target.index);
      gl.uniform3fv(uniforms.u_color_a, colors[0]);
      gl.uniform3fv(uniforms.u_color_b, colors[1]);
      gl.uniform3fv(uniforms.u_color_c, colors[2]);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      frame += 1;
      canvas.dataset.webglFrame = String(frame);
      if (!reducedMotion.matches && !document.hidden) raf = requestAnimationFrame(draw);
    };

    const start = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      if (!document.hidden) draw();
    };
    const onPointerMove = (event) => {
      pointerTarget = [event.clientX / Math.max(1, innerWidth) - 0.5, 0.5 - event.clientY / Math.max(1, innerHeight)];
    };
    const onVisibilityChange = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      if (!document.hidden) draw();
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
    start();

    return Object.freeze({
      active: true,
      setScene(name, { immediate = false } = {}) {
        const next = paletteFor(name);
        const now = performance.now();
        fromColors = immediate ? next.colors.map((color) => [...color]) : paletteAt(now).map((color) => [...color]);
        target = next;
        if (immediate) current = next;
        transitionStartedAt = immediate ? now - transitionDuration : now;
        canvas.dataset.webglScene = SCENES[name] ? name : "awakening";
        canvas.dataset.webglSceneIndex = String(next.index);
        if (reducedMotion.matches) start();
      },
      destroy() {
        if (destroyed) return;
        destroyed = true;
        cancelAnimationFrame(raf);
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
