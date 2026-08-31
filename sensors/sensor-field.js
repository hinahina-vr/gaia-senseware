const MAX_FIELD_NODES = 12;
const FIELD_PIXEL_BUDGET = 900_000;
const FIELD_FRAME_INTERVAL = 42;
const fieldStylesheetHref = new URL("./sensor-field.css?v=gaia-sensor-belonging-1", import.meta.url).href;
let fieldStylesReady = Promise.resolve();

if (!document.querySelector("link[data-sensor-field-styles]")) {
  const stylesheet = document.createElement("link");
  stylesheet.rel = "stylesheet";
  stylesheet.href = fieldStylesheetHref;
  stylesheet.dataset.sensorFieldStyles = "";
  fieldStylesReady = new Promise((resolve) => {
    stylesheet.addEventListener("load", resolve, { once: true });
    stylesheet.addEventListener("error", resolve, { once: true });
  });
  document.head.append(stylesheet);
}

const vertexShaderSource = [
  "attribute vec2 a_position;",
  "void main() {",
  "  gl_Position = vec4(a_position, 0.0, 1.0);",
  "}",
].join("\n");

const fragmentShaderSource = [
  "precision mediump float;",
  "uniform vec2 u_resolution;",
  "uniform float u_time;",
  "uniform float u_node_count;",
  "uniform vec4 u_nodes[12];",
  "uniform vec4 u_pulse;",
  "void main() {",
  "  vec2 uv = gl_FragCoord.xy / max(u_resolution, vec2(1.0));",
  "  float aspect = u_resolution.x / max(u_resolution.y, 1.0);",
  "  float field = 0.0;",
  "  float weave = 0.0;",
  "  float focus = 0.0;",
  "  for (int i = 0; i < 12; i++) {",
  "    if (float(i) >= u_node_count) break;",
  "    vec4 node = u_nodes[i];",
  "    vec2 delta = uv - node.xy;",
  "    delta.x *= aspect;",
  "    float distanceToNode = length(delta);",
  "    float halo = exp(-distanceToNode * distanceToNode * 92.0);",
  "    float wave = 0.5 + 0.5 * sin(distanceToNode * 76.0 - u_time * (0.72 + node.z * 0.42) + float(i) * 1.37);",
  "    field += halo * (0.34 + node.z * 0.58);",
  "    weave += halo * wave * (0.18 + node.z * 0.22);",
  "    focus += halo * node.w;",
  "  }",
  "  vec2 pulseDelta = uv - u_pulse.xy;",
  "  pulseDelta.x *= aspect;",
  "  float pulseDistance = length(pulseDelta);",
  "  float pulseRadius = u_pulse.z * 0.18;",
  "  float pulseRing = 1.0 - smoothstep(0.0, 0.018, abs(pulseDistance - pulseRadius));",
  "  pulseRing *= exp(-u_pulse.z * 0.68) * u_pulse.w;",
  "  float breath = 0.86 + 0.14 * sin(u_time * 0.46);",
  "  float energy = field * breath + weave + pulseRing;",
  "  vec3 mint = vec3(0.18, 0.92, 0.76);",
  "  vec3 blue = vec3(0.30, 0.63, 1.0);",
  "  vec3 violet = vec3(0.70, 0.43, 1.0);",
  "  vec3 colour = mix(mint, blue, clamp(weave * 1.8 + pulseRing * 0.5, 0.0, 1.0));",
  "  colour = mix(colour, violet, clamp(focus * 0.6, 0.0, 0.58));",
  "  float vignette = smoothstep(0.76, 0.18, distance(uv, vec2(0.5)));",
  "  float alpha = clamp(energy * 0.26 + focus * 0.10, 0.0, 0.34) * (0.74 + vignette * 0.26);",
  "  gl_FragColor = vec4(colour * (0.68 + pulseRing * 0.52) * alpha, alpha);",
  "}",
].join("\n");

const clamp = (value, minimum, maximum) => Math.max(minimum, Math.min(maximum, value));

export function initSensorSenseField(map, { onParticipate } = {}) {
  if (!map || map.querySelector(".sensor-sense-field")) return null;

  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const canvas = document.createElement("canvas");
  canvas.className = "sensor-sense-field";
  canvas.hidden = true;
  canvas.setAttribute("aria-hidden", "true");
  canvas.dataset.motion = reducedMotion.matches ? "static" : "ambient";
  map.prepend(canvas);

  const belonging = createBelongingPanel(onParticipate);
  belonging.root.hidden = true;
  map.append(belonging.root);

  let nodes = [];
  let selectedId = null;
  let visible = true;
  let frame = 0;
  let lastFrame = 0;
  let pulse = { x: 0.5, y: 0.5, startedAt: -99, strength: 0 };
  let pulseCount = 0;
  let destroyed = false;
  let renderer = createWebGlRenderer(canvas) || createCanvasRenderer(canvas);
  canvas.dataset.renderer = renderer.kind;

  const syncSize = () => {
    const rect = map.getBoundingClientRect();
    if (rect.width < 1 || rect.height < 1) return;
    const requestedRatio = Math.min(devicePixelRatio || 1, 1);
    const budgetRatio = Math.sqrt(FIELD_PIXEL_BUDGET / Math.max(rect.width * rect.height, 1));
    const ratio = clamp(Math.min(requestedRatio, budgetRatio), 0.24, 0.72);
    const width = Math.max(1, Math.round(rect.width * ratio));
    const height = Math.max(1, Math.round(rect.height * ratio));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      canvas.dataset.renderPixels = String(width * height);
      canvas.dataset.renderScale = ratio.toFixed(3);
      renderer.resize();
    }
    draw(performance.now());
  };

  const draw = (now) => {
    const elapsed = Math.max(0, (now - pulse.startedAt) / 1000);
    renderer.draw({
      nodes,
      time: now / 1000,
      pulse: [pulse.x, 1 - pulse.y, elapsed, pulse.strength],
    });
  };

  const animate = (now) => {
    frame = 0;
    if (destroyed || !visible || document.hidden) return;
    if (reducedMotion.matches) {
      draw(now);
      return;
    }
    if (!map.classList.contains("is-dragging") && now - lastFrame >= FIELD_FRAME_INTERVAL) {
      draw(now);
      lastFrame = now;
    }
    frame = requestAnimationFrame(animate);
  };

  const ensureAnimation = () => {
    if (frame || destroyed || !visible || document.hidden) return;
    frame = requestAnimationFrame(animate);
  };

  const triggerPulse = (x, y, strength = 1) => {
    pulse = {
      x: clamp(Number(x) || 0.5, 0, 1),
      y: clamp(Number(y) || 0.5, 0, 1),
      startedAt: performance.now(),
      strength: clamp(strength, 0, 1.4),
    };
    pulseCount += 1;
    canvas.dataset.pulseCount = String(pulseCount);
    draw(performance.now());
    ensureAnimation();
  };

  const updateBelongingForSelection = (node) => {
    if (!node) {
      belonging.root.dataset.state = "ready";
      belonging.message.textContent = "観測点に触れる。あなたの感覚が、地球の現在とつながる。";
      belonging.message.dataset.short = "触れると、地球の「いま」とつながる。";
      return;
    }
    belonging.root.dataset.state = "selected";
    belonging.message.textContent = node.name + "の「いま」に触れています。";
    belonging.message.dataset.short = "この観測点の「いま」に触れています。";
  };

  map.addEventListener("gaia:sensor-field", (event) => {
    nodes = (event.detail?.nodes || []).slice(0, MAX_FIELD_NODES).map((node) => ({
      ...node,
      selected: node.id === selectedId,
    }));
    canvas.dataset.nodeCount = String(nodes.length);
    draw(performance.now());
    ensureAnimation();
  });

  map.addEventListener("gaia:sensor-focus", (event) => {
    selectedId = event.detail?.sensorId || null;
    nodes = nodes.map((node) => ({ ...node, selected: node.id === selectedId }));
    const selected = nodes.find((node) => node.selected);
    updateBelongingForSelection(selected);
    if (selected) triggerPulse(selected.x, selected.y, 0.82);
    else draw(performance.now());
  });

  map.addEventListener("gaia:sensor-sense", (event) => {
    const selected = nodes.find((node) => node.id === event.detail?.sensorId);
    if (selected) triggerPulse(selected.x, selected.y, event.detail?.phase === "received" ? 1.35 : 1.05);
    belonging.root.dataset.state = event.detail?.phase === "received" ? "received" : "sensing";
    belonging.message.textContent = event.detail?.phase === "received"
      ? "この場所の現在が、あなたの感覚へ届きました。"
      : "観測の波を受け取っています。";
    belonging.message.dataset.short = event.detail?.phase === "received"
      ? "地球の「いま」が届きました。"
      : "観測の波を受け取っています。";
  });

  map.addEventListener("pointerdown", (event) => {
    if (event.target.closest("button, a")) return;
    const rect = map.getBoundingClientRect();
    triggerPulse((event.clientX - rect.left) / Math.max(rect.width, 1), (event.clientY - rect.top) / Math.max(rect.height, 1), 0.52);
    belonging.root.dataset.state = "touched";
    belonging.message.textContent = "触れた場所から、地球の感覚がひろがります。";
    belonging.message.dataset.short = "触れた場所から感覚がひろがる。";
  }, { passive: true });

  const resizeObserver = new ResizeObserver(syncSize);
  resizeObserver.observe(map);
  const intersectionObserver = new IntersectionObserver(([entry]) => {
    visible = Boolean(entry?.isIntersecting);
    if (visible) ensureAnimation();
    else if (frame) {
      cancelAnimationFrame(frame);
      frame = 0;
    }
  }, { threshold: 0.01 });
  intersectionObserver.observe(map);

  const onVisibilityChange = () => {
    if (document.hidden && frame) {
      cancelAnimationFrame(frame);
      frame = 0;
    } else ensureAnimation();
  };
  const onMotionChange = () => {
    canvas.dataset.motion = reducedMotion.matches ? "static" : "ambient";
    draw(performance.now());
    ensureAnimation();
  };
  document.addEventListener("visibilitychange", onVisibilityChange);
  reducedMotion.addEventListener?.("change", onMotionChange);
  void fieldStylesReady.then(() => {
    if (destroyed) return;
    canvas.hidden = false;
    belonging.root.hidden = false;
    syncSize();
    ensureAnimation();
  });

  return {
    pulse: triggerPulse,
    destroy() {
      destroyed = true;
      if (frame) cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      reducedMotion.removeEventListener?.("change", onMotionChange);
      renderer.destroy();
      canvas.remove();
      belonging.root.remove();
    },
  };
}

function createBelongingPanel(onParticipate) {
  const root = document.createElement("aside");
  root.className = "sensor-belonging";
  root.dataset.state = "ready";
  root.setAttribute("aria-label", "地球の観測へ参加");

  const signal = document.createElement("span");
  signal.className = "sensor-belonging-signal";
  signal.setAttribute("aria-hidden", "true");
  signal.append(document.createElement("i"), document.createElement("i"), document.createElement("i"));

  const copy = document.createElement("div");
  const label = document.createElement("small");
  label.textContent = "YOU ARE WITHIN THE FIELD";
  const message = document.createElement("p");
  message.setAttribute("aria-live", "polite");
  message.textContent = "観測点に触れる。あなたの感覚が、地球の現在とつながる。";
  message.dataset.short = "触れると、地球の「いま」とつながる。";
  copy.append(label, message);

  const button = document.createElement("button");
  button.type = "button";
  button.className = "sensor-belonging-join";
  button.setAttribute("aria-label", "自分の観測点を地球へ加える");
  const buttonLabel = document.createElement("span");
  buttonLabel.textContent = "自分の観測点を加える";
  const buttonIcon = document.createElement("b");
  buttonIcon.setAttribute("aria-hidden", "true");
  buttonIcon.textContent = "＋";
  button.append(buttonLabel, buttonIcon);
  button.addEventListener("click", () => {
    root.dataset.state = "joining";
    if (typeof onParticipate === "function") onParticipate();
  });

  root.append(signal, copy, button);
  return { root, message };
}

function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createWebGlRenderer(canvas) {
  const gl = canvas.getContext("webgl", {
    alpha: true,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: "low-power",
    premultipliedAlpha: true,
  });
  if (!gl) return null;
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
  if (!vertexShader || !fragmentShader) return null;
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1]), gl.STATIC_DRAW);
  gl.useProgram(program);
  const position = gl.getAttribLocation(program, "a_position");
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  const locations = {
    resolution: gl.getUniformLocation(program, "u_resolution"),
    time: gl.getUniformLocation(program, "u_time"),
    count: gl.getUniformLocation(program, "u_node_count"),
    nodes: gl.getUniformLocation(program, "u_nodes"),
    pulse: gl.getUniformLocation(program, "u_pulse"),
  };
  const nodeUniforms = new Float32Array(MAX_FIELD_NODES * 4);

  return {
    kind: "webgl",
    resize() { gl.viewport(0, 0, canvas.width, canvas.height); },
    draw(state) {
      nodeUniforms.fill(0);
      state.nodes.forEach((node, index) => {
        const offset = index * 4;
        nodeUniforms[offset] = clamp(node.x, 0, 1);
        nodeUniforms[offset + 1] = 1 - clamp(node.y, 0, 1);
        nodeUniforms[offset + 2] = clamp(node.activity || 0.35, 0.12, 1);
        nodeUniforms[offset + 3] = node.selected ? 1 : 0;
      });
      gl.useProgram(program);
      gl.uniform2f(locations.resolution, canvas.width, canvas.height);
      gl.uniform1f(locations.time, state.time);
      gl.uniform1f(locations.count, state.nodes.length);
      gl.uniform4fv(locations.nodes, nodeUniforms);
      gl.uniform4fv(locations.pulse, new Float32Array(state.pulse));
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    },
    destroy() {
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
    },
  };
}

function createCanvasRenderer(canvas) {
  const context = canvas.getContext("2d", { alpha: true, desynchronized: true });
  return {
    kind: "2d",
    resize() {},
    draw(state) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.globalCompositeOperation = "screen";
      state.nodes.forEach((node) => {
        const x = node.x * canvas.width;
        const y = node.y * canvas.height;
        const radius = Math.max(34, Math.min(canvas.width, canvas.height) * (node.selected ? 0.16 : 0.11));
        const gradient = context.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, node.selected ? "rgba(190,146,255,.22)" : "rgba(88,238,210,.18)");
        gradient.addColorStop(0.42, "rgba(91,190,255,.08)");
        gradient.addColorStop(1, "rgba(0,0,0,0)");
        context.fillStyle = gradient;
        context.fillRect(x - radius, y - radius, radius * 2, radius * 2);
      });
      const age = state.pulse[2];
      if (age < 2.4 && state.pulse[3] > 0) {
        context.strokeStyle = "rgba(128,244,224," + Math.max(0, 0.28 - age * 0.1) + ")";
        context.lineWidth = Math.max(1, canvas.width / 1200);
        context.beginPath();
        context.arc(state.pulse[0] * canvas.width, (1 - state.pulse[1]) * canvas.height, age * Math.min(canvas.width, canvas.height) * 0.18, 0, Math.PI * 2);
        context.stroke();
      }
    },
    destroy() {},
  };
}
