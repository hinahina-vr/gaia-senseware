import { buildCurrentWeave } from "../../current-flow-worker.js?v=gaia-atmosphere-1";

const sphere = (lon, lat) => {
  const a = lon * Math.PI / 180, b = lat * Math.PI / 180, c = Math.cos(b);
  return [c * Math.cos(a), Math.sin(b), c * Math.sin(a)];
};

// Display field only: keep source rows/POIs intact. Chord-distance neighbours
// are continuous across the date-line and near the poles.
export function buildAtmosphereField(points, kind, width = 192, height = 96) {
  const fields = kind === "air" ? ["pm25", "aerosol"] : ["cloud", "radiation", "windSpeed", "windDirection", "pressure"];
  const rows = points.filter(p => Number.isFinite(p.lon) && Number.isFinite(p.lat)
    && Math.abs(p.lat) <= 90 && fields.every(key => Number.isFinite(p[key]))).map(p => {
    const angle = p.windDirection * Math.PI / 180;
    return {
      position: sphere(p.lon, p.lat),
      scalar: kind === "air" ? [0, 0, p.pm25 / 60, p.aerosol] : [p.cloud / 100, p.radiation / 1000, 0, 0],
      // Meteorological bearing is where wind comes FROM.
      vector: kind === "air" ? [0, 0, 1, 0]
        : [-Math.sin(angle) * p.windSpeed, -Math.cos(angle) * p.windSpeed, p.pressure / 1000, p.windSpeed],
    };
  }).filter(p => [...p.scalar, ...p.vector].every(Number.isFinite));
  const scalar = new Float32Array(width * height * 4), vector = new Float32Array(scalar.length);
  const neighbours = new Int32Array(8), distances = new Float64Array(8);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const position = sphere((x + 0.5) / width * 360 - 180, (y + 0.5) / height * 180 - 90);
      distances.fill(Infinity); neighbours.fill(-1);
      rows.forEach((row, index) => {
        const distance = Math.max(0, 2 - 2 * row.position.reduce((sum, p, i) => sum + p * position[i], 0));
        if (distance >= distances[7]) return;
        let rank = 7;
        while (rank > 0 && distance < distances[rank - 1]) {
          distances[rank] = distances[rank - 1]; neighbours[rank] = neighbours[rank - 1]; rank--;
        }
        distances[rank] = distance; neighbours[rank] = index;
      });
      const offset = (y * width + x) * 4;
      let total = 0;
      for (let i = 0; i < 8 && neighbours[i] >= 0; i++) {
        const weight = 1 / (0.00004 + distances[i] * distances[i]);
        const row = rows[neighbours[i]];
        for (let channel = 0; channel < 4; channel++) {
          scalar[offset + channel] += row.scalar[channel] * weight;
          vector[offset + channel] += row.vector[channel] * weight;
        }
        total += weight;
      }
      if (total) for (let channel = 0; channel < 4; channel++) {
        scalar[offset + channel] /= total; vector[offset + channel] /= total;
      }
    }
  }
  return { scalar, vector, width, height, sourceCount: rows.length };
}

if (typeof self !== "undefined" && typeof document === "undefined") {
  self.onmessage = ({ data: { points, kind, key } }) => {
    const started = performance.now();
    const field = buildAtmosphereField(points, kind);
    // Send clouds/haze immediately. Only wind needs streamline integration.
    self.postMessage({ key, field, buildMs: performance.now() - started });
    if (kind === "wind") {
      const flow = new Float32Array(field.vector.length);
      for (let i = 0; i < flow.length; i += 4) {
        flow[i] = field.vector[i]; flow[i + 1] = field.vector[i + 1];
        flow[i + 2] = field.sourceCount ? 1 : 0;
        flow[i + 3] = Math.hypot(flow[i], flow[i + 1]);
      }
      const weave = buildCurrentWeave({ data: flow, width: field.width, height: field.height },
        768, 384, null, { steps: 40, step: 0.5 });
      self.postMessage({ key, weave, buildMs: performance.now() - started }, [weave.data.buffer]);
    }
  };
}
