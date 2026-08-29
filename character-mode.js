(() => {
  "use strict";

  const layer = document.querySelector("#character-book-layer");
  if (!(layer instanceof HTMLElement)) return;

  const assetVersion = "gaia-character-profile-1";
  const portrait = (filename) => "/assets/characters/" + filename + "?v=" + assetVersion;
  const characters = Object.freeze([
    {
      id: "mizuha",
      roman: "MIZUHA",
      native: "みずは",
      code: "ECOLOGY / BODY",
      copy: "海と身体の変化を読み、観測値を人の感覚へつなぎ直す。",
      domain: "生態・身体",
      tool: "水滴標本・フィールドノート",
      role: "観測設計",
      tone: "61, 153, 186",
      src: portrait("mizuha-calm-07-v2.png"),
      alt: "深い水色の長い髪と青いワンピース姿のみずは",
    },
    {
      id: "amane",
      roman: "AMANE",
      native: "あめ",
      code: "SOCIETY / TECHNOLOGY",
      copy: "センサーと公開データを、人が触れられる確かな体験へ組み上げる。",
      domain: "社会・技術",
      tool: "レコーダー・計測器",
      role: "システム実装",
      tone: "107, 168, 221",
      src: portrait("amane-calm-07-v2.png"),
      alt: "淡い空色の短い髪と白いワンピース姿のあめ",
    },
    {
      id: "sakuya",
      roman: "SAKUYA",
      native: "saku",
      code: "MIND / CULTURE",
      copy: "機能と物語をひとつの流れに編み、観客が参加する入口をつくる。",
      domain: "精神・文化",
      tool: "カメラ・編集ノート",
      role: "構成・制作統括",
      tone: "184, 129, 117",
      src: portrait("sakuya-calm-07-v1.png"),
      alt: "灰桜色の髪とカメラを持ったsaku",
    },
  ]);

  const createAtmosphere = (canvas) => {
    const fallback = () => {
      if (canvas instanceof HTMLCanvasElement) canvas.dataset.webglState = "fallback";
      return Object.freeze({ start() {}, stop() {}, setAccent() {}, setPointer() {}, setDepth() {} });
    };
    if (!(canvas instanceof HTMLCanvasElement)) return fallback();

    try {
      const gl = canvas.getContext("webgl", {
        alpha: true,
        antialias: false,
        depth: false,
        stencil: false,
        powerPreference: "high-performance",
      });
      if (!gl) return fallback();

      const vertexSource = `
        attribute vec2 a_position;
        varying vec2 v_uv;
        void main() {
          v_uv = a_position * 0.5 + 0.5;
          gl_Position = vec4(a_position, 0.0, 1.0);
        }
      `;
      const fragmentSource = `
        precision highp float;
        varying vec2 v_uv;
        uniform vec2 u_resolution;
        uniform vec2 u_pointer;
        uniform float u_time;
        uniform float u_depth;
        uniform vec3 u_accent;

        float hash21(vec2 p) {
          p = fract(p * vec2(123.34, 345.45));
          p += dot(p, p + 34.345);
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
        float fbm(vec2 p) {
          float value = 0.0;
          float amplitude = 0.55;
          for (int i = 0; i < 4; i++) {
            value += noise21(p) * amplitude;
            p = mat2(1.64, -1.11, 1.11, 1.64) * p + 7.13;
            amplitude *= 0.48;
          }
          return value;
        }
        float dust(vec2 uv, float scale, float seed) {
          vec2 cell = fract(uv * scale) - 0.5;
          vec2 id = floor(uv * scale);
          float random = hash21(id + seed);
          vec2 offset = vec2(hash21(id + seed + 7.1), hash21(id + seed + 19.7)) - 0.5;
          float point = 1.0 - smoothstep(0.018, 0.095, length(cell - offset * 0.62));
          return point * step(0.955, random) * (0.65 + 0.35 * sin(u_time * 0.55 + random * 25.0));
        }
        void main() {
          vec2 uv = v_uv;
          float aspect = u_resolution.x / max(u_resolution.y, 1.0);
          vec2 pointer = (u_pointer - 0.5) * vec2(0.025, -0.018);
          vec2 p = uv - 0.5 + pointer;
          p.x *= aspect;
          float t = u_time * 0.035;
          vec3 accent = clamp(u_accent, 0.0, 1.0);
          vec3 pearl = vec3(0.91, 0.96, 0.96);
          vec3 celadon = vec3(0.48, 0.74, 0.76);
          vec3 skyBlue = vec3(0.19, 0.49, 0.68);
          vec3 indigo = vec3(0.035, 0.12, 0.25);
          float horizon = 0.36;

          float skyMix = smoothstep(horizon, 1.0, uv.y);
          vec3 color = mix(pearl, mix(skyBlue, indigo, skyMix), pow(skyMix, 0.72));
          color = mix(color, accent, 0.05 + 0.05 * (1.0 - skyMix));
          float cloudField = fbm(vec2(uv.x * 3.0 - t, uv.y * 8.0 + t * 0.4));
          float cloudBand = exp(-pow((uv.y - 0.53) / 0.13, 2.0));
          color += pearl * smoothstep(0.58, 0.82, cloudField) * cloudBand * 0.16;
          vec2 sunSpace = (uv - vec2(0.14, 0.48)) * vec2(aspect, 1.0);
          float sun = exp(-dot(sunSpace, sunSpace) * 22.0);
          color += vec3(1.0, 0.83, 0.56) * sun * 0.2;

          float waterMask = 1.0 - smoothstep(horizon - 0.01, horizon + 0.025, uv.y);
          float waveField = fbm(vec2(uv.x * 7.0 + t * 1.4, uv.y * 31.0 - t));
          float ripple = 0.5 + 0.5 * sin(uv.x * 54.0 + waveField * 7.0 - t * 18.0);
          vec3 water = mix(indigo * 0.7, mix(celadon, accent, 0.28), uv.y / max(horizon, 0.01));
          water += pearl * pow(ripple, 14.0) * 0.13;
          float reflection = exp(-pow((uv.x - 0.14) / (0.035 + uv.y * 0.35), 2.0));
          water += vec3(1.0, 0.78, 0.45) * reflection * (0.04 + ripple * 0.1);
          color = mix(color, water, waterMask * 0.88);
          float shore = exp(-520.0 * abs(uv.y - horizon - (waveField - 0.5) * 0.003));
          color += pearl * shore * 0.22;

          float ribbonNoise = fbm(vec2(p.x * 0.75 + t, p.y * 1.7 - t * 0.7));
          float ribbonA = exp(-pow(abs(p.y - 0.23 - 0.11 * sin(p.x * 1.35 + t * 4.0) - (ribbonNoise - 0.5) * 0.12) / 0.055, 2.0));
          float ribbonB = exp(-pow(abs(p.y - 0.36 - 0.08 * cos(p.x * 1.1 - t * 3.2) + (ribbonNoise - 0.5) * 0.08) / 0.08, 2.0));
          float ribbonFade = smoothstep(-0.55, 0.42, p.x) * (1.0 - smoothstep(0.36, 0.92, uv.y));
          color += mix(pearl, accent, 0.35) * (ribbonA * 0.05 + ribbonB * 0.035) * ribbonFade;
          float motes = dust(uv + vec2(t * 0.07, t * 0.03), 34.0, 3.2)
            + dust(uv - vec2(t * 0.04, t * 0.06), 57.0, 17.8) * 0.62;
          color += mix(pearl, vec3(1.0, 0.82, 0.55), hash21(floor(uv * 29.0))) * motes * 0.34;
          float vignette = smoothstep(1.1, 0.18, length((uv - 0.5) * vec2(0.78, 1.05)));
          color *= 0.77 + vignette * 0.3;
          color = mix(color, pearl, clamp(u_depth, 0.0, 1.0) * 0.12);
          gl_FragColor = vec4(pow(max(color, 0.0), vec3(0.96)), 0.94);
        }
      `;

      const compile = (type, source) => {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
          const reason = gl.getShaderInfoLog(shader) || "shader compilation failed";
          gl.deleteShader(shader);
          throw new Error(reason);
        }
        return shader;
      };

      const program = gl.createProgram();
      const vertexShader = compile(gl.VERTEX_SHADER, vertexSource);
      const fragmentShader = compile(gl.FRAGMENT_SHADER, fragmentSource);
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program) || "program link failed");

      const buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
      gl.useProgram(program);
      const position = gl.getAttribLocation(program, "a_position");
      gl.enableVertexAttribArray(position);
      gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

      const uniforms = {
        resolution: gl.getUniformLocation(program, "u_resolution"),
        pointer: gl.getUniformLocation(program, "u_pointer"),
        time: gl.getUniformLocation(program, "u_time"),
        depth: gl.getUniformLocation(program, "u_depth"),
        accent: gl.getUniformLocation(program, "u_accent"),
      };
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
      let frameId = 0;
      let running = false;
      let startedAt = performance.now();
      let lastFrame = 0;
      let pointer = [0.5, 0.5];
      let pointerTarget = [0.5, 0.5];
      let accent = [61 / 255, 153 / 255, 186 / 255];
      let accentTarget = [...accent];
      let depth = 0;
      let depthTarget = 0;

      const resize = () => {
        const cssWidth = Math.max(1, canvas.clientWidth);
        const cssHeight = Math.max(1, canvas.clientHeight);
        const cap = Math.sqrt(2350000 / (cssWidth * cssHeight));
        const ratio = Math.min(window.devicePixelRatio || 1, 1.35, cap);
        const width = Math.max(1, Math.round(cssWidth * ratio));
        const height = Math.max(1, Math.round(cssHeight * ratio));
        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width;
          canvas.height = height;
          gl.viewport(0, 0, width, height);
        }
      };

      const draw = (timestamp) => {
        resize();
        for (let i = 0; i < 3; i += 1) accent[i] += (accentTarget[i] - accent[i]) * 0.04;
        pointer[0] += (pointerTarget[0] - pointer[0]) * 0.035;
        pointer[1] += (pointerTarget[1] - pointer[1]) * 0.035;
        depth += (depthTarget - depth) * 0.06;
        gl.useProgram(program);
        gl.uniform2f(uniforms.resolution, canvas.width, canvas.height);
        gl.uniform2f(uniforms.pointer, pointer[0], pointer[1]);
        gl.uniform1f(uniforms.time, (timestamp - startedAt) / 1000);
        gl.uniform1f(uniforms.depth, depth);
        gl.uniform3f(uniforms.accent, accent[0], accent[1], accent[2]);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        canvas.dataset.webglRendered = "true";
      };
      const loop = (timestamp) => {
        if (!running) return;
        if (timestamp - lastFrame >= 1000 / 30) {
          lastFrame = timestamp;
          draw(timestamp);
        }
        frameId = requestAnimationFrame(loop);
      };
      const start = () => {
        if (running) return;
        running = true;
        startedAt = performance.now();
        if (reducedMotion.matches) {
          draw(startedAt + 1);
          running = false;
        } else {
          frameId = requestAnimationFrame(loop);
        }
      };
      const stop = () => {
        running = false;
        cancelAnimationFrame(frameId);
      };
      const setAccent = (tone) => {
        const channels = String(tone).split(",").map((value) => Math.max(0, Math.min(255, Number(value.trim()) || 0)) / 255);
        if (channels.length === 3) accentTarget = channels;
        if (reducedMotion.matches) draw(performance.now());
      };
      const setPointer = (event) => {
        const rect = canvas.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        pointerTarget = [
          Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width)),
          Math.max(0, Math.min(1, 1 - (event.clientY - rect.top) / rect.height)),
        ];
      };
      const setDepth = (value) => { depthTarget = Math.max(0, Math.min(1, Number(value) || 0)); };

      canvas.addEventListener("webglcontextlost", (event) => {
        event.preventDefault();
        stop();
        canvas.dataset.webglState = "fallback";
      });
      window.addEventListener("resize", resize, { passive: true });
      canvas.dataset.webglState = "ready";
      draw(performance.now());
      return Object.freeze({ start, stop, setAccent, setPointer, setDepth });
    } catch (_error) {
      return fallback();
    }
  };

  const canvas = layer.querySelector("#character-book-webgl");
  const scroller = layer.querySelector("#character-book-scroll");
  const closeButton = layer.querySelector("#character-book-close");
  const closeButtons = Array.from(layer.querySelectorAll("[data-character-close]"));
  const selectors = Array.from(layer.querySelectorAll("[data-character-select]"));
  const profileCards = Array.from(layer.querySelectorAll("[data-character-profile]"));
  const heroImage = layer.querySelector("#character-book-image");
  const roman = layer.querySelector("#character-book-roman");
  const native = layer.querySelector("#character-book-native");
  const code = layer.querySelector("#character-book-code");
  const copy = layer.querySelector("#character-book-character-copy");
  const domain = layer.querySelector("#character-book-domain");
  const tool = layer.querySelector("#character-book-tool");
  const role = layer.querySelector("#character-book-role");
  const current = layer.querySelector("#character-book-current");
  const atmosphere = createAtmosphere(canvas);
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  let currentIndex = 0;
  let openState = false;
  let lastFocused = null;
  let backgroundStates = [];
  let switchTimer = 0;

  characters.forEach(({ src }) => {
    const preload = new Image();
    preload.decoding = "async";
    preload.src = src;
  });

  const suspendBackground = () => {
    backgroundStates = [];
    const parent = layer.parentElement;
    if (!parent) return;
    Array.from(parent.children).forEach((element) => {
      if (!(element instanceof HTMLElement) || element === layer) return;
      backgroundStates.push({ element, inert: element.inert });
      element.inert = true;
    });
  };
  const restoreBackground = () => {
    backgroundStates.forEach(({ element, inert }) => {
      if (element.isConnected) element.inert = inert;
    });
    backgroundStates = [];
  };

  const selectCharacter = (id, { moveFocus = false } = {}) => {
    const nextIndex = characters.findIndex((character) => character.id === id);
    if (nextIndex < 0) return;
    const character = characters[nextIndex];
    currentIndex = nextIndex;
    layer.dataset.characterId = character.id;
    layer.style.setProperty("--character-accent-rgb", character.tone);
    atmosphere.setAccent(character.tone);
    selectors.forEach((button) => button.setAttribute("aria-current", String(button.dataset.characterSelect === character.id)));

    const commit = () => {
      if (roman) roman.textContent = character.roman;
      if (native) native.textContent = character.native;
      if (code) code.textContent = character.code;
      if (copy) copy.textContent = character.copy;
      if (domain) domain.textContent = character.domain;
      if (tool) tool.textContent = character.tool;
      if (role) role.textContent = character.role;
      if (current) current.textContent = String(nextIndex + 1).padStart(2, "0");
      if (heroImage instanceof HTMLImageElement) {
        heroImage.src = character.src;
        heroImage.alt = character.alt;
      }
      layer.dataset.imageState = "ready";
      window.clearTimeout(switchTimer);
      switchTimer = window.setTimeout(() => heroImage?.classList.remove("is-switching"), 420);
    };
    if (heroImage instanceof HTMLElement && !reducedMotion.matches) {
      heroImage.classList.remove("is-switching");
      void heroImage.offsetWidth;
      heroImage.classList.add("is-switching");
      window.setTimeout(commit, 80);
    } else {
      commit();
    }
    if (moveFocus) selectors[nextIndex]?.focus({ preventScroll: true });
  };

  const open = (trigger = null) => {
    if (openState) return;
    openState = true;
    lastFocused = trigger instanceof HTMLElement ? trigger : document.activeElement;
    suspendBackground();
    layer.hidden = false;
    layer.inert = false;
    layer.setAttribute("aria-hidden", "false");
    document.body.classList.add("character-mode-open");
    if (scroller instanceof HTMLElement) scroller.scrollTop = 0;
    selectCharacter(characters[currentIndex].id);
    atmosphere.start();
    requestAnimationFrame(() => {
      layer.classList.add("is-open");
      closeButton?.focus({ preventScroll: true });
    });
  };
  const close = () => {
    if (!openState) return;
    openState = false;
    layer.classList.remove("is-open");
    layer.setAttribute("aria-hidden", "true");
    document.body.classList.remove("character-mode-open");
    atmosphere.stop();
    restoreBackground();
    window.clearTimeout(switchTimer);
    window.setTimeout(() => {
      if (!openState) {
        layer.hidden = true;
        layer.inert = true;
      }
    }, 280);
    if (window.location.hash === "#character") {
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    }
    if (lastFocused instanceof HTMLElement && lastFocused.isConnected) lastFocused.focus({ preventScroll: true });
  };

  document.addEventListener("click", (event) => {
    const trigger = event.target instanceof Element ? event.target.closest("[data-character-gallery-open]") : null;
    if (trigger) open(trigger);
  });
  closeButton?.addEventListener("click", close);
  closeButtons.forEach((button) => button.addEventListener("click", close));
  selectors.forEach((button) => {
    button.addEventListener("click", () => selectCharacter(button.dataset.characterSelect));
  });
  profileCards.forEach((card) => {
    card.addEventListener("click", (event) => {
      if (event.target instanceof Element && event.target.closest("a, button")) return;
      selectCharacter(card.dataset.characterProfile);
      layer.querySelector("#character-book-hero")?.scrollIntoView({ behavior: reducedMotion.matches ? "auto" : "smooth" });
    });
  });
  layer.addEventListener("pointermove", (event) => atmosphere.setPointer(event), { passive: true });
  scroller?.addEventListener("scroll", () => {
    if (!(scroller instanceof HTMLElement)) return;
    const heroHeight = Math.max(1, layer.querySelector("#character-book-hero")?.clientHeight || window.innerHeight);
    atmosphere.setDepth(scroller.scrollTop / heroHeight);
    layer.classList.toggle("has-scrolled", scroller.scrollTop > 30);
  }, { passive: true });

  const observer = "IntersectionObserver" in window
    ? new IntersectionObserver((entries) => {
        entries.forEach((entry) => entry.target.classList.toggle("is-visible", entry.isIntersecting));
      }, { root: scroller, threshold: 0.18 })
    : null;
  profileCards.forEach((card) => observer?.observe(card));

  document.addEventListener("keydown", (event) => {
    if (!openState) return;
    if (event.key === "Escape") {
      event.preventDefault();
      close();
      return;
    }
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      const delta = event.key === "ArrowRight" ? 1 : -1;
      const nextIndex = (currentIndex + delta + characters.length) % characters.length;
      selectCharacter(characters[nextIndex].id, { moveFocus: true });
      return;
    }
    if (event.key !== "Tab") return;
    const focusable = Array.from(layer.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'))
      .filter((element) => element instanceof HTMLElement && element.offsetParent !== null);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  if (heroImage instanceof HTMLImageElement) {
    const markReady = () => { layer.dataset.imageState = "ready"; };
    heroImage.addEventListener("load", markReady);
    heroImage.addEventListener("error", () => { layer.dataset.imageState = "error"; });
    if (heroImage.complete && heroImage.naturalWidth > 0) markReady();
  }
  if (window.location.hash === "#character") window.setTimeout(() => open(null), 0);
})();
