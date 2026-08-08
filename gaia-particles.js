(() => {
  "use strict";

  const REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const TAU = Math.PI * 2;

  const OPENING_RIBBONS = [
    {
      points: [[-0.035, 1.1], [-0.07, 0.7], [0.055, 0.23], [0.16, -0.1]],
      hue: 194,
      width: 2.3,
      alpha: 0.3,
      spread: 5.4,
      wobble: 9,
      phase: 0.2,
      speed: 0.72,
    },
    {
      points: [[-0.08, 0.38], [0.18, 0.52], [0.36, 0.43], [0.56, 0.27]],
      hue: 208,
      width: 1.45,
      alpha: 0.25,
      spread: 3.8,
      wobble: 7,
      phase: 1.6,
      speed: 0.54,
    },
    {
      points: [[0.46, 1.08], [0.44, 0.69], [0.66, 0.73], [0.78, 0.5]],
      hue: 205,
      width: 1.8,
      alpha: 0.27,
      spread: 4.5,
      wobble: 8,
      phase: 2.7,
      speed: 0.63,
    },
    {
      points: [[0.76, 1.08], [0.84, 0.79], [1.04, 0.72], [1.02, 0.38]],
      hue: 222,
      width: 1.1,
      alpha: 0.19,
      spread: 3.2,
      wobble: 6,
      phase: 4.2,
      speed: 0.46,
    },
  ];

  const OPENING_ORBITS = [
    { x: 0.46, y: 0.3, radiusX: 0.105, radiusY: 0.055, rotation: -0.62, hue: 204, phase: 0.5 },
    { x: 0.64, y: 0.68, radiusX: 0.14, radiusY: 0.078, rotation: 0.58, hue: 212, phase: 2.8 },
    { x: 0.2, y: 0.54, radiusX: 0.09, radiusY: 0.042, rotation: 0.22, hue: 190, phase: 4.4 },
  ];

  const cubic = (a, b, c, d, time) => {
    const inverse = 1 - time;
    return inverse ** 3 * a
      + 3 * inverse ** 2 * time * b
      + 3 * inverse * time ** 2 * c
      + time ** 3 * d;
  };

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
    let motes = [];
    let sparkles = [];
    let pointerX = 0.5;
    let pointerY = 0.5;

    const random = (min, max) => min + Math.random() * (max - min);
    const pickHue = () => palette[Math.floor(Math.random() * palette.length)];
    const riseZones = variant === "story"
      ? [
          { x: 0.08, spread: 0.07, hue: 188 },
          { x: 0.26, spread: 0.1, hue: 218 },
          { x: 0.76, spread: 0.11, hue: 286 },
          { x: 0.94, spread: 0.05, hue: 202 },
        ]
      : [
          { x: 0.07, spread: 0.07, hue: 188 },
          { x: 0.24, spread: 0.1, hue: 218 },
          { x: 0.58, spread: 0.12, hue: 286 },
          { x: 0.88, spread: 0.07, hue: 202 },
        ];

    const makeMote = (entering = false) => {
      const zone = riseZones[Math.floor(Math.random() * riseZones.length)];
      const depth = random(0.18, 1);
      const radius = random(34, variant === "story" ? 108 : 96) * (0.68 + depth * 0.5);
      return {
        baseX: (zone.x + random(-zone.spread, zone.spread)) * width,
        y: entering ? height + random(radius * 0.6, height * 0.18 + radius) : random(height * 0.06, height * 1.12),
        vy: -random(16, variant === "story" ? 38 : 34) * (0.7 + depth * 0.42),
        radius,
        aspect: random(0.78, 1.08),
        sway: random(10, 38) * (0.72 + depth * 0.42),
        curl: random(0.64, 1.28),
        drift: random(0.1, 0.24),
        depth,
        hue: Math.random() < 0.76 ? zone.hue + random(-8, 8) : pickHue(),
        alpha: random(0.15, variant === "story" ? 0.31 : 0.28) * intensity,
        phase: random(0, Math.PI * 2),
        lobes: Array.from({ length: Math.random() < 0.6 ? 4 : 3 }, (_, index) => ({
          x: index === 0 ? 0 : random(-0.48, 0.48),
          y: index === 0 ? 0 : random(-0.34, 0.34),
          scale: index === 0 ? random(0.78, 1) : random(0.42, 0.72),
        })),
      };
    };

    const makeSparkle = (entering = false) => ({
      x: random(width * -0.04, width * 1.04),
      y: entering ? height + random(4, height * 0.12) : random(-height * 0.04, height * 1.04),
      radius: random(0.45, 1.7),
      alpha: random(0.18, 0.66) * intensity,
      velocity: random(4, 15),
      drift: random(-3.2, 3.2),
      phase: random(0, TAU),
      pulse: random(0.45, 1.25),
      hue: random(188, 224),
    });

    const rebuild = () => {
      const compact = width < 720;
      const motionFactor = REDUCED_MOTION ? 0.45 : 1;
      const moteCount = Math.round((compact ? 6 : variant === "story" ? 10 : 8) * intensity * motionFactor);
      motes = Array.from({ length: Math.max(5, moteCount) }, () => makeMote());
      sparkles = variant === "opening"
        ? Array.from({ length: compact ? 38 : 74 }, () => makeSparkle())
        : [];
    };

    const ribbonPoint = (spec, progress, offset, time) => {
      const [first, second, third, fourth] = spec.points;
      const x = cubic(first[0], second[0], third[0], fourth[0], progress) * width;
      const y = cubic(first[1], second[1], third[1], fourth[1], progress) * height;
      const ahead = Math.min(1, progress + 0.006);
      const aheadX = cubic(first[0], second[0], third[0], fourth[0], ahead) * width;
      const aheadY = cubic(first[1], second[1], third[1], fourth[1], ahead) * height;
      const tangentX = aheadX - x;
      const tangentY = aheadY - y;
      const length = Math.max(0.001, Math.hypot(tangentX, tangentY));
      const wave = Math.sin(progress * 13 + time * 0.00022 * spec.speed + spec.phase) * spec.wobble;
      return {
        x: x - (tangentY / length) * (offset + wave),
        y: y + (tangentX / length) * (offset + wave),
      };
    };

    const traceRibbon = (spec, offset, time, sampleCount) => {
      context.beginPath();
      for (let index = 0; index <= sampleCount; index += 1) {
        const point = ribbonPoint(spec, index / sampleCount, offset, time);
        if (index === 0) context.moveTo(point.x, point.y);
        else context.lineTo(point.x, point.y);
      }
    };

    const drawOpeningRibbons = (time) => {
      const compact = width < 720;
      const activeRibbons = OPENING_RIBBONS.slice(0, compact ? 3 : OPENING_RIBBONS.length);
      const samples = compact ? 42 : 64;
      const strandCount = REDUCED_MOTION ? 2 : compact ? 3 : 5;

      activeRibbons.forEach((spec, ribbonIndex) => {
        context.save();
        context.lineCap = "round";
        context.lineJoin = "round";

        traceRibbon(spec, 0, time, samples);
        context.strokeStyle = `hsla(${spec.hue}, 96%, 72%, ${spec.alpha * 0.2 * intensity})`;
        context.lineWidth = spec.width * 9;
        context.shadowColor = `hsla(${spec.hue}, 100%, 74%, ${spec.alpha * 0.72 * intensity})`;
        context.shadowBlur = compact ? 18 : 30;
        context.stroke();

        for (let strand = 0; strand < strandCount; strand += 1) {
          const centered = strand - (strandCount - 1) / 2;
          traceRibbon(spec, centered * spec.spread, time + strand * 280, samples);
          const lightness = 76 + (strand % 2) * 12;
          context.strokeStyle = `hsla(${spec.hue + strand * 2}, 100%, ${lightness}%, ${spec.alpha * (0.48 + strand * 0.055) * intensity})`;
          context.lineWidth = Math.max(0.55, spec.width * (1 - strand * 0.09));
          context.shadowBlur = 11;
          context.stroke();
        }

        const dotCount = compact ? 28 : 46;
        for (let dot = 0; dot < dotCount; dot += 1) {
          const progress = dot / (dotCount - 1);
          const travel = (progress + time * 0.000018 * spec.speed + spec.phase / TAU) % 1;
          const offset = Math.sin(dot * 1.74 + spec.phase) * spec.spread * 1.4;
          const point = ribbonPoint(spec, progress, offset, time);
          const edgeFade = Math.sin(progress * Math.PI);
          const pulse = 0.32 + 0.68 * Math.max(0, Math.cos((progress - travel) * TAU));
          const dotAlpha = spec.alpha * edgeFade * (0.28 + pulse * 0.92) * intensity;
          const dotRadius = 0.55 + pulse * (ribbonIndex === 0 ? 1.35 : 0.9);
          context.fillStyle = `hsla(${spec.hue}, 100%, 90%, ${dotAlpha})`;
          context.shadowColor = `hsla(${spec.hue}, 100%, 80%, ${dotAlpha})`;
          context.shadowBlur = pulse > 0.82 ? 10 : 3;
          context.beginPath();
          context.arc(point.x, point.y, dotRadius, 0, TAU);
          context.fill();
        }
        context.restore();
      });
    };

    const drawOpeningOrbits = (time) => {
      const compact = width < 720;
      const activeOrbits = OPENING_ORBITS.slice(0, compact ? 2 : OPENING_ORBITS.length);
      activeOrbits.forEach((orbit, orbitIndex) => {
        const centerX = orbit.x * width;
        const centerY = orbit.y * height;
        const radiusX = orbit.radiusX * width;
        const radiusY = orbit.radiusY * height;
        const dotCount = compact ? 30 : 52;
        const phase = time * 0.00012 * (orbitIndex % 2 ? -1 : 1) + orbit.phase;

        context.save();
        context.translate(centerX, centerY);
        context.rotate(orbit.rotation);
        context.setLineDash([1.2, compact ? 7 : 9]);
        context.lineDashOffset = -time * 0.012 * (orbitIndex % 2 ? -1 : 1);
        context.lineWidth = 0.75;
        context.strokeStyle = `hsla(${orbit.hue}, 100%, 82%, ${0.19 * intensity})`;
        context.shadowColor = `hsla(${orbit.hue}, 100%, 76%, ${0.34 * intensity})`;
        context.shadowBlur = 7;
        context.beginPath();
        context.ellipse(0, 0, radiusX, radiusY, 0, 0, TAU);
        context.stroke();
        context.setLineDash([]);

        for (let dot = 0; dot < dotCount; dot += 1) {
          const angle = dot / dotCount * TAU;
          const highlight = Math.max(0, Math.cos(angle - phase));
          const alpha = (0.12 + highlight ** 5 * 0.72) * intensity;
          const dotRadius = 0.48 + highlight ** 4 * 1.18;
          context.fillStyle = `hsla(${orbit.hue}, 100%, 91%, ${alpha})`;
          context.shadowBlur = highlight > 0.8 ? 9 : 2;
          context.beginPath();
          context.arc(Math.cos(angle) * radiusX, Math.sin(angle) * radiusY, dotRadius, 0, TAU);
          context.fill();
        }
        context.restore();

        const nodePulse = 0.72 + Math.sin(time * 0.001 + orbit.phase) * 0.28;
        context.save();
        context.fillStyle = `hsla(${orbit.hue}, 100%, 94%, ${0.62 * nodePulse * intensity})`;
        context.shadowColor = `hsla(${orbit.hue}, 100%, 76%, ${0.72 * nodePulse * intensity})`;
        context.shadowBlur = 18;
        context.beginPath();
        context.arc(centerX, centerY, 1.5 + nodePulse * 1.35, 0, TAU);
        context.fill();
        context.strokeStyle = `hsla(${orbit.hue}, 100%, 88%, ${0.24 * intensity})`;
        context.lineWidth = 0.7;
        context.beginPath();
        context.moveTo(centerX - 15 * nodePulse, centerY);
        context.lineTo(centerX + 15 * nodePulse, centerY);
        context.moveTo(centerX, centerY - 15 * nodePulse);
        context.lineTo(centerX, centerY + 15 * nodePulse);
        context.stroke();
        context.restore();
      });
    };

    const drawOpeningSparkles = (time, deltaSeconds) => {
      sparkles.forEach((sparkle) => {
        if (!REDUCED_MOTION) {
          sparkle.y -= sparkle.velocity * deltaSeconds;
          sparkle.x += sparkle.drift * deltaSeconds;
        }
        if (sparkle.y < -12 || sparkle.x < -24 || sparkle.x > width + 24) {
          Object.assign(sparkle, makeSparkle(true));
        }
        const pulse = 0.36 + (Math.sin(time * 0.0012 * sparkle.pulse + sparkle.phase) + 1) * 0.32;
        const alpha = sparkle.alpha * pulse;
        context.fillStyle = `hsla(${sparkle.hue}, 100%, 91%, ${alpha})`;
        context.shadowColor = `hsla(${sparkle.hue}, 100%, 77%, ${alpha})`;
        context.shadowBlur = sparkle.radius > 1.25 ? 9 : 4;
        context.beginPath();
        context.arc(sparkle.x, sparkle.y, sparkle.radius * pulse, 0, TAU);
        context.fill();
      });
    };

    const drawOpeningField = (time, deltaSeconds) => {
      const animationTime = REDUCED_MOTION ? 0 : time;
      context.save();
      drawOpeningSparkles(animationTime, deltaSeconds);
      drawOpeningRibbons(animationTime);
      drawOpeningOrbits(animationTime);
      context.restore();
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

    const draw = (time) => {
      if (!running) return;
      const deltaSeconds = Math.min(0.034, Math.max(0, (time - (lastTime || time)) / 1000));
      lastTime = time;
      context.clearRect(0, 0, width, height);
      context.save();
      context.globalCompositeOperation = "lighter";

      motes.forEach((mote) => {
        mote.y += mote.vy * deltaSeconds;
        mote.phase += mote.drift * deltaSeconds;
        if (mote.y < -mote.radius * 2.4) {
          Object.assign(mote, makeMote(true));
          return;
        }
        const wave = time * 0.00022 * mote.curl + mote.phase;
        const x = mote.baseX
          + Math.sin(wave) * mote.sway
          + Math.sin(wave * 1.73 + mote.depth * 5.3) * mote.sway * 0.22;
        const lowerFade = Math.min(1, Math.max(0, (height + mote.radius - mote.y) / (height * 0.14)));
        const upperFade = Math.min(1, Math.max(0, (mote.y + mote.radius * 1.6) / (height * 0.2)));
        const travel = Math.min(1, Math.max(0, 1 - mote.y / Math.max(1, height)));
        const pulse = 0.8 + Math.sin(time * 0.00058 + mote.phase) * 0.2;
        const alpha = mote.alpha * lowerFade * upperFade * pulse;
        const parallaxX = variant === "story" ? (pointerX - 0.5) * 22 * mote.depth : 0;
        const parallaxY = variant === "story" ? (pointerY - 0.5) * 14 * mote.depth : 0;
        const puffRadius = mote.radius * (0.72 + travel * 0.48) * pulse;

        context.save();
        context.translate(x + parallaxX, mote.y + parallaxY);
        context.rotate(Math.sin(wave * 0.61) * 0.045);
        context.scale(1, mote.aspect);
        context.shadowColor = `hsla(${mote.hue}, 98%, 86%, ${alpha * 0.68})`;
        context.shadowBlur = puffRadius * 0.58;

        mote.lobes.forEach((lobe, index) => {
          const lobeRadius = puffRadius * lobe.scale;
          const lobeX = lobe.x * puffRadius;
          const lobeY = lobe.y * puffRadius;
          const glow = context.createRadialGradient(
            lobeX - lobeRadius * 0.14,
            lobeY - lobeRadius * 0.18,
            0,
            lobeX,
            lobeY,
            lobeRadius,
          );
          const lobeAlpha = alpha * (index === 0 ? 1 : 0.64);
          glow.addColorStop(0, `hsla(${mote.hue}, 100%, 96%, ${lobeAlpha})`);
          glow.addColorStop(0.28, `hsla(${mote.hue}, 98%, 86%, ${lobeAlpha * 0.72})`);
          glow.addColorStop(0.68, `hsla(${mote.hue}, 92%, 72%, ${lobeAlpha * 0.24})`);
          glow.addColorStop(1, `hsla(${mote.hue}, 86%, 62%, 0)`);
          context.fillStyle = glow;
          context.beginPath();
          context.arc(lobeX, lobeY, lobeRadius, 0, Math.PI * 2);
          context.fill();
        });
        context.restore();
      });

      if (variant === "opening") drawOpeningField(time, deltaSeconds);

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
