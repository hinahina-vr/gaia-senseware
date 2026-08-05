// Persistent three-layer ambience: stars / light motes / flowing traces.
(() => {
  const ID = "gs-particle-canvas-v9";
  const OLD_IDS = ["gs-particle-canvas-v7", "gs-particle-canvas-v8"];
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let canvas;
  let ctx;
  let width = 0;
  let height = 0;
  let dpr = 1;
  let raf = 0;
  let last = performance.now();
  let stars = [];
  let motes = [];
  let flows = [];

  const hideOldCanvases = () => {
    OLD_IDS.forEach((id) => {
      const oldCanvas = document.getElementById(id);
      if (oldCanvas) oldCanvas.style.setProperty("display", "none", "important");
    });
  };

  const applyCanvasStyle = () => {
    const styles = {
      position: "fixed",
      inset: "0",
      width: "100vw",
      height: "100vh",
      pointerEvents: "none",
      zIndex: "2147482000",
      opacity: "0.88",
      mixBlendMode: "screen",
      display: "block",
      visibility: "visible",
      transform: "translateZ(0)"
    };
    Object.entries(styles).forEach(([key, value]) => {
      canvas.style.setProperty(key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`), value, "important");
    });
  };

  const ensureCanvas = () => {
    hideOldCanvases();
    canvas = document.getElementById(ID) || document.createElement("canvas");
    canvas.id = ID;
    canvas.setAttribute("aria-hidden", "true");
    applyCanvasStyle();
    if (canvas.parentNode !== document.documentElement) document.documentElement.appendChild(canvas);
    ctx = canvas.getContext("2d", { alpha: true });
    return canvas;
  };

  const randomStar = () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    radius: 0.65 + Math.random() * 1.55,
    alpha: 0.32 + Math.random() * 0.64,
    phase: Math.random() * Math.PI * 2,
    speed: 0.35 + Math.random() * 0.8
  });

  const randomMote = () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    radius: 12 + Math.random() * 34,
    vx: -3 + Math.random() * 6,
    vy: -7 - Math.random() * 13,
    alpha: 0.08 + Math.random() * 0.17,
    hue: Math.random() > 0.3 ? 174 : 211
  });

  const makeFlow = (index) => ({
    y: height * (0.26 + index * 0.24),
    amplitude: height * (0.055 + index * 0.012),
    phase: index * 1.8,
    speed: 0.055 + index * 0.014,
    hue: index === 1 ? 207 : 174,
    head: index * 0.31
  });

  const rebuild = () => {
    stars = Array.from({ length: Math.max(80, Math.round((width * height) / 12500)) }, randomStar);
    motes = Array.from({ length: Math.max(14, Math.round(width / 95)) }, randomMote);
    flows = Array.from({ length: 3 }, (_, i) => makeFlow(i));
  };

  const resize = () => {
    ensureCanvas();
    dpr = Math.min(devicePixelRatio || 1, 1.5);
    width = innerWidth;
    height = innerHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    rebuild();
    draw(performance.now(), 0);
  };

  const drawStars = (time) => {
    for (const star of stars) {
      const pulse = 0.58 + 0.42 * Math.sin(time * 0.001 * star.speed + star.phase);
      const alpha = star.alpha * pulse;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(216,248,255,${alpha})`;
      ctx.fill();
      if (star.radius > 1.65) {
        ctx.strokeStyle = `rgba(137,238,225,${alpha * 0.62})`;
        ctx.lineWidth = 0.65;
        ctx.beginPath();
        ctx.moveTo(star.x - 4, star.y);
        ctx.lineTo(star.x + 4, star.y);
        ctx.moveTo(star.x, star.y - 4);
        ctx.lineTo(star.x, star.y + 4);
        ctx.stroke();
      }
    }
  };

  const drawMotes = (dt) => {
    for (const mote of motes) {
      if (!reduceMotion) {
        mote.x += mote.vx * dt;
        mote.y += mote.vy * dt;
      }
      if (mote.y < -mote.radius) {
        mote.y = height + mote.radius;
        mote.x = Math.random() * width;
      }
      if (mote.x < -mote.radius) mote.x = width + mote.radius;
      if (mote.x > width + mote.radius) mote.x = -mote.radius;
      const gradient = ctx.createRadialGradient(mote.x, mote.y, 0, mote.x, mote.y, mote.radius);
      gradient.addColorStop(0, `hsla(${mote.hue},90%,78%,${mote.alpha})`);
      gradient.addColorStop(0.24, `hsla(${mote.hue},88%,68%,${mote.alpha * 0.55})`);
      gradient.addColorStop(1, `hsla(${mote.hue},82%,55%,0)`);
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(mote.x, mote.y, mote.radius, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const flowPoint = (flow, t, time) => {
    const x = -width * 0.08 + t * width * 1.16;
    const wave = Math.sin(t * Math.PI * 2.2 + flow.phase + time * 0.00012) * flow.amplitude;
    const lift = Math.sin(t * Math.PI) * height * 0.035;
    return { x, y: flow.y + wave - lift };
  };

  const drawFlows = (time, dt) => {
    flows.forEach((flow, index) => {
      ctx.save();
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.setLineDash([2, 15]);
      ctx.lineDashOffset = -time * (0.012 + index * 0.003);
      ctx.strokeStyle = `hsla(${flow.hue},88%,72%,${0.2 + index * 0.035})`;
      ctx.lineWidth = 1.15;
      ctx.beginPath();
      for (let i = 0; i <= 80; i++) {
        const p = flowPoint(flow, i / 80, time);
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }
      ctx.stroke();
      ctx.setLineDash([]);
      if (!reduceMotion) flow.head = (flow.head + dt * flow.speed) % 1;
      const head = flowPoint(flow, flow.head, time);
      const glow = ctx.createRadialGradient(head.x, head.y, 0, head.x, head.y, 28);
      glow.addColorStop(0, `hsla(${flow.hue},100%,88%,0.9)`);
      glow.addColorStop(0.18, `hsla(${flow.hue},100%,73%,0.55)`);
      glow.addColorStop(1, `hsla(${flow.hue},90%,55%,0)`);
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(head.x, head.y, 28, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  };

  const draw = (time, dt) => {
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);
    drawStars(time);
    drawMotes(dt);
    drawFlows(time, dt);
  };

  const tick = (time) => {
    const dt = Math.min((time - last) / 1000, 0.05);
    last = time;
    draw(time, dt);
    raf = requestAnimationFrame(tick);
  };

  const start = () => {
    ensureCanvas();
    resize();
    cancelAnimationFrame(raf);
    if (!reduceMotion) raf = requestAnimationFrame(tick);
  };

  addEventListener("resize", resize, { passive: true });
  new MutationObserver(() => {
    hideOldCanvases();
    if (!document.getElementById(ID) || canvas.parentNode !== document.documentElement) {
      ensureCanvas();
      resize();
    }
  }).observe(document.documentElement, { childList: true, subtree: true });

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true });
  else start();
})();
