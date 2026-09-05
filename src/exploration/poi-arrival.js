export const POI_ARRIVAL_LIFETIME_MS = 1650;
const clamp01 = value => Math.max(0, Math.min(1, value));
const smooth = value => { const p = clamp01(value); return p * p * (3 - 2 * p); };

export const createPoiArrival = (points, startedAt, reducedMotion = false) => {
  // The ordering is a stable visual sequence, not a new observation timestamp.
  const order = points.map((point, index) => ({ index,
    key: ((Math.sin(point.lon * 12.9898 + point.lat * 78.233 + index) * 43758.5453) % 1 + 1) % 1,
  })).sort((a, b) => a.key - b.key || a.index - b.index).map(item => item.index);
  const spread = Math.min(5400, Math.max(600, points.length * 22));
  const startsAt = startedAt + (reducedMotion ? 0 : 900);
  const bornAt = new Float64Array(points.length);
  order.forEach((index, rank) => { bornAt[index] = startsAt + (points.length > 1 ? rank / (points.length - 1) * spread : 0); });
  const settlesAt = reducedMotion ? startedAt : startsAt + (points.length > 1 ? spread : 0) + POI_ARRIVAL_LIFETIME_MS;
  return {
    points, order, bornAt, startsAt, settlesAt, reducedMotion,
    opacity: (index, now) => reducedMotion || now >= settlesAt ? 1 : smooth((now - bornAt[index]) / 220),
    phase: now => reducedMotion ? "reduced" : now < startsAt ? "waiting" : now >= settlesAt ? "settled" : "entering",
  };
};

const glow = (ctx, sprite, x, y, width, height = width, alpha = 1) => {
  ctx.save();
  ctx.globalAlpha *= alpha;
  ctx.drawImage(sprite, x - width / 2, y - height / 2, width, height);
  ctx.restore();
};

const drawWindArrival = (ctx, point, p, envelope, sprite, rgb) => {
  const direction = (point.windDirection + 180) * Math.PI / 180;
  ctx.rotate(Math.atan2(-Math.cos(direction), Math.sin(direction)));
  const reach = (55 + clamp01(point.windSpeed / 18) * 40) * (1 - (1 - p) ** 3);
  for (let lane = 0; lane < 3; lane++) {
    const offset = (lane - 1) * 6;
    const bend = Math.sin(p * 3.4 + lane) * 14;
    ctx.beginPath();
    ctx.moveTo(-reach, offset);
    ctx.bezierCurveTo(-reach * .68, offset - bend, -reach * .25, offset + bend, 0, offset * .15);
    ctx.strokeStyle = `rgba(${rgb}, .13)`;
    ctx.lineWidth = 5 - lane;
    ctx.stroke();
    ctx.strokeStyle = `rgba(221, 255, 255, ${.8 - lane * .17})`;
    ctx.lineWidth = 1.4 - lane * .3;
    ctx.stroke();
    glow(ctx, sprite, 0, offset * .15, 12, 12, .65);
  }
  glow(ctx, sprite, 0, 0, 38, 38, envelope);
};

const drawAirArrival = (ctx, p, sprite) => {
  // Broad translucent folds, with no granular dust or hard-edged rings.
  ctx.rotate(-.25);
  const unfold = 1 - (1 - p) ** 3;
  glow(ctx, sprite, -18 * unfold, -10 * unfold, 45 + 90 * unfold, 30, .7);
  glow(ctx, sprite, 25 * unfold, -25 * unfold, 38 + 75 * unfold, 24, .8);
  glow(ctx, sprite, 0, -5 * unfold, 46, 56, .95);
};

const drawQuakeArrival = (ctx, p, sprite, rgb) => {
  for (let wave = 0; wave < 2; wave++) {
    const travel = clamp01((p - wave * .16) / (1 - wave * .16));
    if (!travel) continue;
    ctx.beginPath();
    ctx.arc(0, 0, 3 + (1 - (1 - travel) ** 2) * 72, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(${rgb}, ${(1 - travel) * .72})`;
    ctx.lineWidth = 1.8 - travel;
    ctx.stroke();
  }
  glow(ctx, sprite, 0, 0, 58 * (1 - p * .4), 58 * (1 - p * .4), .9);
};

const drawCloudArrival = (ctx, p, sprite) => {
  const grow = 1 - (1 - p) ** 3;
  ctx.rotate(.18);
  glow(ctx, sprite, 0, -34 * grow, 20, 115 * grow, .9);
  glow(ctx, sprite, -10 * grow, -22 * grow, 9, 80 * grow, .55);
  glow(ctx, sprite, 11 * grow, -25 * grow, 8, 92 * grow, .6);
  glow(ctx, sprite, 0, 0, 52, 28, .95);
};

export const drawPoiArrivals = (ctx, arrival, { now, view, project, kind, rgb, sprite }) => {
  const limit = view.rect.width < 720 ? 14 : 48;
  const result = { count: 0, limit, indices: [] };
  if (!arrival || arrival.phase(now) !== "entering") return result;
  const size = view.rect.width >= 2400 ? 1.6 : view.rect.width < 720 ? .85 : 1;
  const occupied = new Set();
  for (let rank = arrival.order.length - 1; rank >= 0 && result.count < limit; rank--) {
    const index = arrival.order[rank];
    const age = now - arrival.bornAt[index];
    if (age <= 0 || age >= POI_ARRIVAL_LIFETIME_MS) continue;
    const point = arrival.points[index], at = project(point, view);
    if (at.x < 0 || at.y < 0 || at.x > view.rect.width || at.y > view.rect.height) continue;
    const cell = `${Math.floor(at.x / (96 * size))}:${Math.floor(at.y / (96 * size))}`;
    if (occupied.has(cell)) continue;
    occupied.add(cell);
    const p = age / POI_ARRIVAL_LIFETIME_MS;
    const envelope = smooth(age / 180) * (1 - smooth((age - 600) / (POI_ARRIVAL_LIFETIME_MS - 600)));
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.globalAlpha = envelope;
    ctx.lineCap = "round";
    ctx.translate(at.x, at.y);
    ctx.scale(size, size);
    if (kind === "wind") drawWindArrival(ctx, point, p, envelope, sprite, rgb);
    else if (kind === "air") drawAirArrival(ctx, p, sprite);
    else if (kind === "quake") drawQuakeArrival(ctx, p, sprite, rgb);
    else drawCloudArrival(ctx, p, sprite);
    ctx.restore();
    result.count++;
    result.indices.push(index);
  }
  return result;
};
