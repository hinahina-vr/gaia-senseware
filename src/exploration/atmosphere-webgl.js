const VERTEX = `#version 300 es
in vec2 position;
void main() { gl_Position = vec4(position, 0., 1.); }`;
const FRAGMENT = `#version 300 es
precision highp float;
precision highp sampler3D;
uniform vec2 resolution;
uniform vec3 geoView;
uniform float time;
uniform int mode;
uniform float ready;
uniform float weaveReady;
uniform sampler2D scalarField;
uniform sampler2D vectorField;
uniform sampler3D grainMap;
uniform sampler2D windWeave;
out vec4 color;
float grain(vec3 p) { return texture(grainMap, p / 32.).r; }
float clouds(vec3 p) {
  return grain(p) * .53 + grain(p * 2.03 + 13.7) * .27
    + grain(p * 4.11 - 8.3) * .13 + grain(p * 8.17 + 4.9) * .07;
}
// Smooth the voxel interpolation for a diffuse veil without gritty edges.
float cloudNoise(vec3 p) {
  vec3 cell = floor(p), f = fract(p);
  f = f * f * (3. - 2. * f);
  return texture(grainMap, (cell + f + .5) / 32.).r;
}
float cloudMass(vec3 p) {
  return cloudNoise(p) * .64 + cloudNoise(p * 2.01 + 13.7) * .28
    + cloudNoise(p * 3.97 - 8.3) * .08;
}
void main() {
  vec2 p = (gl_FragCoord.xy * 2. - resolution) / resolution.y;
  vec2 geo = geoView.xy + p * geoView.z;
  if (abs(geo.y) > 90.) { color = vec4(0.); return; }
  vec2 uv = (geo + vec2(180., 90.)) / vec2(360., 180.);
  vec4 value = texture(scalarField, uv);
  vec4 wind = texture(vectorField, uv);
  // Spherical coordinates make the texture continuous at the date-line.
  vec2 angle = radians(geo);
  vec3 sphere = vec3(cos(angle.y) * cos(angle.x), sin(angle.y), cos(angle.y) * sin(angle.x));
  vec3 q = sphere * 12.;
  vec3 drift = vec3(time * .018, time * -.007, time * .004);
  if (mode == 0) {
    vec4 weave = texture(windWeave, uv);
    float pulse = (weave.g - .5) * cos(time * .9) - (weave.b - .5) * sin(time * .9);
    float lane = smoothstep(.23, .8, weave.r + pulse * .7);
    float speed = clamp(length(wind.xy) / 18., 0., 1.);
    float pigment = pow(lane, 1.5) * (.26 + speed * .5) * weave.a * weaveReady;
    vec3 ink = mix(vec3(.14,.33,.59), vec3(.45,.90,.92), speed);
    ink = mix(ink, vec3(.48,.43,.79), (1. - smoothstep(.97,1.016,wind.b)) * .28);
    color = vec4(ink, pigment * ready);
  } else if (mode == 1) {
    float haze = max(0., value.a), pm = clamp(value.b, 0., 2.);
    float rolling = clouds(q * .57 + drift);
    float wisps = clouds(q * 1.7 + drift * 1.25 + rolling * 2.);
    float extinction = 1. - exp(-haze * (1.3 + rolling * 3.5));
    float opacity = extinction * (.37 + wisps * .54);
    vec3 ink = mix(vec3(.38,.47,.61), vec3(.72,.58,.53), clamp(pm * .52, 0., 1.));
    ink += pow(wisps, 3.) * vec3(.21,.17,.24);
    color = vec4(ink, min(.72, opacity) * ready);
  } else {
    float cover = clamp(value.r, 0., 1.);
    float sun = clamp(value.g, 0., 1.);
    // Borrow MAP 28's rolling / wispy layering, not its aerosol measurements.
    // No thresholded banks or bright rims: even overcast stays translucent.
    float rolling = cloudMass(q * .57 + drift);
    float wisps = cloudMass(q * 1.25 + drift * 1.1 + rolling * 1.3);
    float density = mix(rolling, wisps, .45);
    float extinction = 1. - exp(-cover * (.48 + density * .9));
    float alpha = min(.42, extinction * (.52 + wisps * .2));
    vec3 shade = mix(vec3(.34,.44,.56), vec3(.62,.73,.80), density);
    // Shortwave radiation adds a restrained warm glow, not opaque white.
    shade += sun * wisps * vec3(.08,.065,.035);
    color = vec4(shade, alpha * ready);
  }
}`;

export function createAtmosphereRenderer(canvas) {
  const gl = canvas.getContext("webgl2", { alpha: true, antialias: false, depth: false,
    premultipliedAlpha: false, powerPreference: "low-power" });
  if (!gl) return null;
  const shader = (type, source) => {
    const result = gl.createShader(type);
    gl.shaderSource(result, source); gl.compileShader(result);
    if (!gl.getShaderParameter(result, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(result));
    return result;
  };
  const vertex = shader(gl.VERTEX_SHADER, VERTEX), fragment = shader(gl.FRAGMENT_SHADER, FRAGMENT);
  const program = gl.createProgram();
  gl.attachShader(program, vertex); gl.attachShader(program, fragment); gl.linkProgram(program);
  gl.deleteShader(vertex); gl.deleteShader(fragment);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program));
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,3,-1,-1,3]), gl.STATIC_DRAW);
  const attribute = gl.getAttribLocation(program, "position");
  gl.enableVertexAttribArray(attribute); gl.vertexAttribPointer(attribute, 2, gl.FLOAT, false, 0, 0);
  const uniforms = Object.fromEntries(["resolution", "geoView", "time", "mode", "ready", "weaveReady",
    "scalarField", "vectorField", "grainMap", "windWeave"].map(key => [key, gl.getUniformLocation(program, key)]));
  const textures = Array.from({ length: 4 }, (_, unit) => {
    const target = unit === 2 ? gl.TEXTURE_3D : gl.TEXTURE_2D;
    const texture = gl.createTexture(); gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(target, texture);
    gl.texParameteri(target, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(target, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(target, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(target, gl.TEXTURE_WRAP_T, unit === 2 ? gl.REPEAT : gl.CLAMP_TO_EDGE);
    if (unit === 2) gl.texParameteri(target, gl.TEXTURE_WRAP_R, gl.REPEAT);
    else gl.texImage2D(target, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(4));
    return texture;
  });
  const upload = (unit, data, width, height, floating = false) => {
    gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, textures[unit]);
    gl.texImage2D(gl.TEXTURE_2D, 0, floating ? gl.RGBA16F : gl.RGBA, width, height, 0,
      gl.RGBA, floating ? gl.FLOAT : gl.UNSIGNED_BYTE, data);
  };
  const noise = new Uint8Array(32 * 32 * 32);
  let seed = 8173;
  for (let i = 0; i < noise.length; i++) {
    seed ^= seed << 13; seed ^= seed >>> 17; seed ^= seed << 5;
    noise[i] = seed >>> 24;
  }
  gl.activeTexture(gl.TEXTURE2); gl.bindTexture(gl.TEXTURE_3D, textures[2]);
  gl.texImage3D(gl.TEXTURE_3D, 0, gl.R8, 32, 32, 32, 0, gl.RED, gl.UNSIGNED_BYTE, noise);
  const cache = new Map();
  let activeKey = null, worker = null, readyAt = Infinity, weaveAt = Infinity, selectedMode = 0;
  let workerBuildsWeave = false;
  let lastStaticView = "";
  const install = (entry) => {
    upload(0, entry.field.scalar, entry.field.width, entry.field.height, true);
    upload(1, entry.field.vector, entry.field.width, entry.field.height, true);
    readyAt = performance.now(); weaveAt = Infinity;
    if (entry.weave) { upload(3, entry.weave.data, entry.weave.width, entry.weave.height); weaveAt = performance.now(); }
    canvas.dataset.weaveState = entry.weave ? "ready" : "pending";
    canvas.dataset.fieldState = "ready";
    canvas.dataset.sourceCount = String(entry.field.sourceCount);
    canvas.dataset.fieldBuildMs = entry.buildMs.toFixed(1);
  };
  const setData = (kind, data) => {
    selectedMode = kind === "wind" ? 0 : kind === "air" ? 1 : 2;
    const key = `${kind === "air" ? "air" : "atmosphere"}:${data.sourceState === "SAVED VALUES"}:${data.observedAt}`;
    canvas.dataset.atmosphereMode = kind;
    canvas.dataset.cloudStyle = "translucent-haze-veil";
    if (key === activeKey && (kind !== "wind" || cache.get(key)?.weave || workerBuildsWeave)) return;
    activeKey = key; readyAt = Infinity; weaveAt = Infinity;
    worker?.terminate(); worker = null; workerBuildsWeave = false;
    if (cache.has(key)) {
      const entry = cache.get(key); install(entry);
      if (kind !== "wind" || entry.weave) return;
    }
    canvas.dataset.fieldState = "building";
    canvas.dataset.weaveState = "pending";
    try {
      worker = new Worker(new URL("./atmosphere-field-worker.js?v=gaia-atmosphere-1", import.meta.url), { type: "module" });
    } catch { canvas.dataset.fieldState = "unavailable"; return; }
    const currentWorker = worker;
    workerBuildsWeave = kind === "wind";
    currentWorker.onmessage = ({ data: result }) => {
      if (result.key !== activeKey) return;
      if (result.field) {
        if (cache.size >= 3) cache.delete(cache.keys().next().value);
        cache.set(key, result); install(result);
        canvas.dataset.fieldBuilds = String((Number(canvas.dataset.fieldBuilds) || 0) + 1);
      } else {
        const entry = cache.get(key); if (!entry) return;
        entry.weave = result.weave;
        upload(3, result.weave.data, result.weave.width, result.weave.height); weaveAt = performance.now();
        canvas.dataset.weaveState = "ready";
      }
      if (result.weave || kind !== "wind") { currentWorker.terminate(); if (worker === currentWorker) { worker = null; workerBuildsWeave = false; } }
    };
    currentWorker.onerror = () => { canvas.dataset.fieldState = "unavailable"; currentWorker.terminate(); worker = null; workerBuildsWeave = false; };
    currentWorker.postMessage({ points: data.points, kind, key });
  };
  const render = (timestamp, view, reducedMotion) => {
    if (gl.isContextLost()) return false;
    const maxPixels = view.rect.width < 720 ? 300000 : 760000;
    const scale = Math.min(1, Math.sqrt(maxPixels / (view.rect.width * view.rect.height)));
    const width = Math.max(1, Math.round(view.rect.width * scale)), height = Math.max(1, Math.round(view.rect.height * scale));
    // Reduced-motion mode needs no identical GPU work once the reveal settles.
    const staticView = [width, height, view.originX, view.originY, view.scale, selectedMode, readyAt, weaveAt].join(":");
    const settled = timestamp > readyAt + 700 && (selectedMode !== 0 || timestamp > weaveAt + 700);
    if (reducedMotion && settled && staticView === lastStaticView) return true;
    lastStaticView = reducedMotion && settled ? staticView : "";
    if (canvas.width !== width || canvas.height !== height) { canvas.width = width; canvas.height = height; }
    gl.viewport(0, 0, width, height); gl.useProgram(program);
    for (let i = 0; i < 4; i++) { gl.activeTexture(gl.TEXTURE0 + i); gl.bindTexture(i === 2 ? gl.TEXTURE_3D : gl.TEXTURE_2D, textures[i]); }
    ["scalarField", "vectorField", "grainMap", "windWeave"].forEach((name, i) => gl.uniform1i(uniforms[name], i));
    gl.uniform2f(uniforms.resolution, width, height);
    gl.uniform3f(uniforms.geoView, (view.rect.width / 2 - view.originX) / view.scale - 42,
      90 - (view.rect.height / 2 - view.originY) / view.scale, view.rect.height / (2 * view.scale));
    gl.uniform1f(uniforms.time, reducedMotion ? 0 : timestamp / 1000);
    gl.uniform1i(uniforms.mode, selectedMode);
    gl.uniform1f(uniforms.ready, Math.max(0, Math.min(1, (timestamp - readyAt) / 700)));
    gl.uniform1f(uniforms.weaveReady, Math.max(0, Math.min(1, (timestamp - weaveAt) / 700)));
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    canvas.dataset.draws = String((Number(canvas.dataset.draws) || 0) + 1);
    return true;
  };
  canvas.addEventListener("webglcontextlost", event => {
    event.preventDefault();
    worker?.terminate(); worker = null; workerBuildsWeave = false; activeKey = null;
    canvas.dataset.fieldState = "context-lost";
  });
  return { setData, render, suspend() { worker?.terminate(); worker = null; workerBuildsWeave = false; activeKey = null; } };
}
