(() => {
  "use strict";

  const REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const create = (canvas, options = {}) => {
    if (!(canvas instanceof HTMLCanvasElement)) return { start() {}, stop() {} };
    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return { start() {}, stop() {} };

    const variant = options.variant === "story" ? "story" : "opening";
    const palette = variant === "story"
      ? [188, 205, 224, 264, 286, 320]
      : [186, 202, 222, 270, 296, 332];
    const intensity = Math.max(0.2, Math.min(1.4, Number(options.intensity) || 1));

    let width = 1;
    let height = 1;
    let ratio = 1;
    let frame = 0;
    let running = false;
    let lastTime = 0;
    let streaks = [];
    let motes = [];
    let stars = [];
    let filaments = [];
    let pointerX = 0.5;
    let pointerY = 0.5;

    const random = (min, max) => min + Math.random() * (max - min);
    const pickHue = () => palette[Math.floor(Math.random() * palette.length)];

    const makeStreak = (entering = false) => {
      const angle = random(-1.18, -0.77);
      const speed = random(22, 58) * (variant === "story" ? 0.78 : 1);
      return {
        x: entering ? random(-width * 0.18, width * 0.62) : random(-width * 0.12, width * 1.08),
        y: entering ? height + random(20, height * 0.34) : random(-height * 0.1, height * 1.18),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        length: random(width < 720 ? 62 : 105, width < 720 ? 180 : 330),
        width: random(0.7, 1.75),
        hue: pickHue(),
        alpha: random(0.2, 0.5) * intensity,
        pulse: random(0.00045, 0.0011),
        phase: random(0, Math.PI * 2),
      };
    };

    const makeMote = (entering = false) => ({
      x: entering ? random(-30, width * 0.8) : random(-20, width + 20),
      y: entering ? height + random(0, 80) : random(-20, height + 20),
      vx: random(1.1, variant === "story" ? 3.8 : 5.8),
      vy: random(variant === "story" ? -5.2 : -8.2, -1.8),
      radius: random(variant === "story" ? 0.5 : 0.35, variant === "story" ? 2.25 : 1.35),
      depth: random(0.18, 1),
      hue: pickHue(),
      alpha: random(0.1, variant === "story" ? 0.4 : 0.48) * intensity,
      pulse: random(0.0007, 0.002),
      phase: random(0, Math.PI * 2),
    });

    const makeStar = (entering = false) => ({
      x: entering ? random(0, width) : random(width * 0.04, width * 0.96),
      y: entering ? height + random(20, 140) : random(height * 0.04, height * 0.96),
      vx: random(2, 7),
      vy: random(-7, -2),
      radius: random(1.5, width < 720 ? 3.2 : 4.6),
      hue: pickHue(),
      alpha: random(0.18, 0.62) * intensity,
      pulse: random(0.0008, 0.0017),
      phase: random(0, Math.PI * 2),
    });

    const makeFilament = () => ({
      x: random(-width * 0.12, width * 0.92),
      y: random(height * 0.08, height * 0.92),
      span: random(width * 0.16, width * 0.34),
      lift: random(height * 0.04, height * 0.14) * (Math.random() > 0.5 ? 1 : -1),
      drift: random(1.4, 4.4),
      hue: pickHue(),
      alpha: random(0.035, 0.11) * intensity,
      phase: random(0, Math.PI * 2),
      pulse: random(0.00016, 0.00034),
      depth: random(0.25, 0.8),
    });

    const rebuild = () => {
      const compact = width < 720;
      const motionFactor = REDUCED_MOTION ? 0.45 : 1;
      const streakCount = Math.round((compact ? 6 : variant === "story" ? 7 : 12) * intensity * motionFactor);
      const moteCount = Math.round((compact ? 22 : variant === "story" ? 58 : 52) * intensity * motionFactor);
      const starCount = Math.round((compact ? 4 : variant === "story" ? 6 : 8) * intensity * motionFactor);
      streaks = Array.from({ length: Math.max(3, streakCount) }, () => makeStreak());
      motes = Array.from({ length: Math.max(10, moteCount) }, () => makeMote());
      stars = Array.from({ length: Math.max(3, starCount) }, () => makeStar());
      filaments = variant === "story"
        ? Array.from({ length: compact ? 3 : 7 }, () => makeFilament())
        : [];
    };

    const onPointerMove = (event) => {
      pointerX = Math.max(0, Math.min(1, event.clientX / Math.max(1, width)));
      pointerY = Math.max(0, Math.min(1, event.clientY / Math.max(1, height)));
    };

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      width = Math.max(1, Math.round(bounds.width || window.innerWidth));
      height = Math.max(1, Math.round(bounds.height || window.innerHeight));
      ratio = Math.min(window.devicePixelRatio || 1, 1.6);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      rebuild();
    };

    const drawStar = (star, pulse) => {
      const radius = star.radius * (0.55 + pulse * 0.8);
      const alpha = star.alpha * (0.28 + pulse * 0.72);
      context.save();
      context.translate(star.x, star.y);
      context.strokeStyle = `hsla(${star.hue}, 88%, 88%, ${alpha})`;
      context.shadowColor = `hsla(${star.hue}, 96%, 82%, ${alpha})`;
      context.shadowBlur = radius * 5;
      context.lineWidth = 0.65;
      context.beginPath();
      context.moveTo(-radius * 2.2, 0);
      context.lineTo(radius * 2.2, 0);
      context.moveTo(0, -radius * 2.2);
      context.lineTo(0, radius * 2.2);
      context.stroke();
      context.rotate(Math.PI / 4);
      context.globalAlpha = 0.48;
      context.beginPath();
      context.moveTo(-radius, 0);
      context.lineTo(radius, 0);
      context.moveTo(0, -radius);
      context.lineTo(0, radius);
      context.stroke();
      context.restore();
    };

    const draw = (time) => {
      if (!running) return;
      const deltaSeconds = Math.min(0.034, Math.max(0, (time - (lastTime || time)) / 1000));
      lastTime = time;
      context.clearRect(0, 0, width, height);
      context.save();
      context.globalCompositeOperation = "lighter";

      if (variant === "story") {
        filaments.forEach((filament) => {
          filament.x += filament.drift * deltaSeconds;
          if (filament.x > width + filament.span) Object.assign(filament, makeFilament(), { x: -filament.span });
          const pulse = 0.5 + Math.sin(time * filament.pulse + filament.phase) * 0.5;
          const parallaxX = (pointerX - 0.5) * 24 * filament.depth;
          const parallaxY = (pointerY - 0.5) * 16 * filament.depth;
          const x = filament.x + parallaxX;
          const y = filament.y + parallaxY;
          const gradient = context.createLinearGradient(x, y, x + filament.span, y);
          gradient.addColorStop(0, `hsla(${filament.hue}, 80%, 76%, 0)`);
          gradient.addColorStop(0.5, `hsla(${filament.hue}, 82%, 82%, ${filament.alpha * (0.42 + pulse * 0.58)})`);
          gradient.addColorStop(1, `hsla(${filament.hue}, 80%, 76%, 0)`);
          context.strokeStyle = gradient;
          context.lineWidth = 0.7 + filament.depth * 0.7;
          context.setLineDash([1, 8 + filament.depth * 8]);
          context.lineDashOffset = -time * 0.006 * filament.drift;
          context.beginPath();
          context.moveTo(x, y);
          context.bezierCurveTo(
            x + filament.span * 0.28,
            y + filament.lift,
            x + filament.span * 0.68,
            y - filament.lift * 0.72,
            x + filament.span,
            y
          );
          context.stroke();
        });
        context.setLineDash([]);
      }

      streaks.forEach((streak) => {
        streak.x += streak.vx * deltaSeconds;
        streak.y += streak.vy * deltaSeconds;
        const magnitude = Math.hypot(streak.vx, streak.vy) || 1;
        const dx = streak.vx / magnitude;
        const dy = streak.vy / magnitude;
        const tailX = streak.x - dx * streak.length;
        const tailY = streak.y - dy * streak.length;
        const pulse = 0.58 + Math.sin(time * streak.pulse + streak.phase) * 0.42;
        const gradient = context.createLinearGradient(tailX, tailY, streak.x, streak.y);
        gradient.addColorStop(0, `hsla(${streak.hue}, 86%, 67%, 0)`);
        gradient.addColorStop(0.58, `hsla(${streak.hue}, 90%, 72%, ${streak.alpha * pulse * 0.36})`);
        gradient.addColorStop(0.82, `hsla(${streak.hue}, 92%, 78%, ${streak.alpha * pulse * 0.72})`);
        gradient.addColorStop(1, `hsla(${streak.hue}, 96%, 91%, ${streak.alpha * pulse})`);
        context.strokeStyle = gradient;
        context.lineWidth = streak.width;
        context.shadowColor = `hsla(${streak.hue}, 92%, 74%, ${streak.alpha * pulse})`;
        context.shadowBlur = streak.width * 8;
        context.beginPath();
        context.moveTo(tailX, tailY);
        context.lineTo(streak.x, streak.y);
        context.stroke();
        if (streak.y < -streak.length || streak.x > width + streak.length) {
          Object.assign(streak, makeStreak(true));
        }
      });

      context.shadowBlur = 0;
      motes.forEach((mote) => {
        mote.x += mote.vx * deltaSeconds;
        mote.y += mote.vy * deltaSeconds;
        if (mote.y < -24 || mote.x > width + 24) Object.assign(mote, makeMote(true));
        const pulse = 0.5 + Math.sin(time * mote.pulse + mote.phase) * 0.5;
        const radius = mote.radius * (0.7 + pulse * 0.55) * (0.7 + mote.depth * 0.55);
        const alpha = mote.alpha * (0.32 + pulse * 0.68);
        const parallaxX = variant === "story" ? (pointerX - 0.5) * 34 * mote.depth : 0;
        const parallaxY = variant === "story" ? (pointerY - 0.5) * 24 * mote.depth : 0;
        context.fillStyle = `hsla(${mote.hue}, 88%, 88%, ${alpha})`;
        context.shadowColor = `hsla(${mote.hue}, 96%, 82%, ${alpha})`;
        context.shadowBlur = radius * (variant === "story" ? 11 : 7);
        context.beginPath();
        context.arc(mote.x + parallaxX, mote.y + parallaxY, radius, 0, Math.PI * 2);
        context.fill();
      });

      stars.forEach((star) => {
        star.x += star.vx * deltaSeconds;
        star.y += star.vy * deltaSeconds;
        if (star.y < -30 || star.x > width + 30) Object.assign(star, makeStar(true));
        drawStar(star, 0.5 + Math.sin(time * star.pulse + star.phase) * 0.5);
      });

      context.restore();
      frame = requestAnimationFrame(draw);
    };

    return {
      start() {
        if (running) return;
        running = true;
        lastTime = 0;
        resize();
        window.addEventListener("resize", resize, { passive: true });
        if (variant === "story") window.addEventListener("pointermove", onPointerMove, { passive: true });
        frame = requestAnimationFrame(draw);
      },
      stop() {
        running = false;
        cancelAnimationFrame(frame);
        window.removeEventListener("resize", resize);
        window.removeEventListener("pointermove", onPointerMove);
        context.clearRect(0, 0, width, height);
      },
    };
  };

  window.GaiaParticles = Object.freeze({ create });
})();
