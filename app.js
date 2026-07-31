(() => {
  "use strict";

  const canvas = document.querySelector("#gaia-canvas");
  const experience = document.querySelector(".experience");
  const errorPanel = document.querySelector("#error-panel");
  const modeList = document.querySelector("#mode-list");
  const modeNumber = document.querySelector("#mode-number");
  const modeTitle = document.querySelector("#mode-title");
  const modeTitleJa = document.querySelector("#mode-title-ja");
  const modeDescription = document.querySelector("#mode-description");
  const previousModeButton = document.querySelector("#previous-mode");
  const nextModeButton = document.querySelector("#next-mode");
  const autoButton = document.querySelector("#auto-button");
  const resetButton = document.querySelector("#reset-button");
  const sourceButton = document.querySelector("#source-button");
  const sourceClose = document.querySelector("#source-close");
  const sourcePanel = document.querySelector("#source-panel");
  const sourceScrim = document.querySelector("#source-scrim");
  const sourceCode = document.querySelector("#source-code");
  const sourceTitle = document.querySelector("#source-title");
  const sourceFile = document.querySelector("#source-file");
  const introLayer = document.querySelector("#intro-layer");
  const introEnter = document.querySelector("#intro-enter");
  const introJapan = document.querySelector("#intro-japan");
  const introButton = document.querySelector("#intro-button");
  const japanButton = document.querySelector("#japan-button");
  const japanLayer = document.querySelector("#japan-layer");
  const japanMap = document.querySelector("#japan-map");
  const japanTiles = document.querySelector("#japan-tiles");
  const japanOverlay = document.querySelector("#japan-overlay");
  const japanMapStatus = document.querySelector("#japan-map-status");
  const japanClose = document.querySelector("#japan-close");

  const TRAIL_COUNT = 16;
  const MODE_COUNT = 10;
  const TRANSITION_DURATION = 1500;
  const AUTO_INTERVAL = 18000;
  const MAP_TILE_SIZE = 256;
  const JAPAN_ZOOM = 5;
  const USGS_WEEK_FEED =
    "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson";
  const JAPAN_DATA_BOUNDS = {
    west: 122,
    east: 154,
    south: 20,
    north: 48,
  };
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const japanContext = japanOverlay.getContext("2d");

  const JAPAN_NODES = [
    { name: "NAHA", lon: 127.68, lat: 26.21 },
    { name: "YAKUSHIMA", lon: 130.52, lat: 30.36 },
    { name: "ASO", lon: 131.1, lat: 32.88 },
    { name: "NOTO", lon: 136.9, lat: 37.3 },
    { name: "TOKYO", lon: 139.69, lat: 35.68 },
    { name: "SENDAI", lon: 140.87, lat: 38.27 },
    { name: "NEMURO", lon: 145.58, lat: 43.33 },
  ];

  const modes = [
    {
      id: "breathing-earth",
      title: "Breathing Earth",
      titleJa: "地球の一呼吸",
      description: "指先の問いかけが、惑星を巡る一呼吸として別の場所から返ってくる。",
      accent: "#8ed8ff",
      rgb: "142, 216, 255",
      source: `
vec3 modeBreathingEarth(vec2 p, float t, vec2 response, float memory) {
  float radius = length(p);
  float angle = atan(p.y, p.x);
  float breath = 0.5 + 0.5 * sin(t * 0.52);
  float membrane = lineGlow(radius - (0.48 + breath * 0.07), 0.024);
  float innerPulse = lineGlow(
    radius - fract(t * 0.12 + response.y * 0.08) * 1.05,
    0.025
  );
  float meridian = lineGlow(
    sin(angle * 7.0 + radius * 3.0 - t * 0.18),
    0.032
  ) * smoothstep(0.68, 0.12, radius);
  float livingVein = lineGlow(
    sin(p.x * 7.2 + p.y * 2.4 + fbm(p * 2.1) * 3.0 - t * 0.24),
    0.038
  );
  float reply = response.x * (0.65 + breath * 0.35);
  float density = membrane * 0.74 + innerPulse * 0.24
    + meridian * 0.24 + livingVein * 0.16 + reply;
  vec3 background = baseGradient(p, vec3(0.02, 0.11, 0.18));
  vec3 cool = mix(vec3(0.16, 0.48, 0.68), vec3(0.58, 0.9, 1.0), breath);
  return background + cool * density
    + vec3(0.48, 0.7, 1.0) * response.y * 0.28
    + vec3(0.1, 0.36, 0.44) * memory * membrane * 0.18;
}
`.trim(),
    },
    {
      id: "blue-circulation",
      title: "Blue Circulation",
      titleJa: "青い循環系",
      description: "海流・風・熱がひとつの流体として巡り、触れた圧力差をゆっくり均す。",
      accent: "#63e3ff",
      rgb: "99, 227, 255",
      source: `
vec3 modeBlueCirculation(vec2 p, float t, vec2 response, float memory) {
  vec2 q = rot(-0.22) * p;
  float drift = fbm(q * 1.45 + vec2(t * 0.035, -t * 0.02));
  q += vec2(drift - 0.5, noise(q * 2.2 + t * 0.04) - 0.5) * 0.22;
  q += uVelocity * response.x * 0.045;
  float currentA = lineGlow(
    sin(q.y * 7.0 + q.x * 1.7 + drift * 3.2 - t * 0.46),
    0.035
  );
  float currentB = lineGlow(
    sin(q.y * 12.0 - q.x * 2.4 - drift * 2.0 + t * 0.28),
    0.022
  );
  vec2 gyrePoint = vec2(sin(t * 0.13) * 0.34, cos(t * 0.11) * 0.2);
  float gyre = lineGlow(
    sin(length(q - gyrePoint) * 17.0 - t * 0.8),
    0.034
  ) * exp(-length(q - gyrePoint) * 0.72);
  float density = currentA * 0.55 + currentB * 0.32 + gyre * 0.42
    + response.x * 0.78 + response.y * 0.24;
  vec3 background = baseGradient(p, vec3(0.0, 0.12, 0.2));
  vec3 water = mix(vec3(0.02, 0.3, 0.48), vec3(0.45, 0.95, 1.0), drift);
  return background + water * density
    + vec3(0.15, 0.46, 0.7) * memory * currentA * 0.22;
}
`.trim(),
    },
    {
      id: "forest-cloud-engine",
      title: "Forest Cloud Engine",
      titleJa: "森の気候装置",
      description: "菌糸・樹冠・水蒸気が連続し、森が空をつくる見えない仕事を可視化する。",
      accent: "#7ff0b5",
      rgb: "127, 240, 181",
      source: `
vec3 modeForestCloudEngine(vec2 p, float t, vec2 response, float memory) {
  float climate = fbm(p * vec2(1.4, 1.0) + vec2(t * 0.018, -t * 0.026));
  float lane = abs(fract((p.x + climate * 0.08) * 7.0) - 0.5);
  float trunkMask = smoothstep(-0.9, -0.16, p.y)
    * (1.0 - smoothstep(0.18, 0.68, p.y));
  float trunks = lineGlow(lane, 0.044) * trunkMask;
  float branches = lineGlow(
    sin(p.x * 11.0 + abs(p.y) * 8.0 + climate * 3.0 - t * 0.1),
    0.032
  ) * smoothstep(-0.15, 0.58, p.y);
  float canopy = smoothstep(
    0.5,
    0.78,
    fbm(p * vec2(3.2, 2.1) + vec2(0.0, t * 0.025))
      + smoothstep(-0.1, 0.68, p.y) * 0.22
  );
  float roots = lineGlow(
    sin(p.x * 14.0 - p.y * 5.0 + climate * 4.0),
    0.025
  ) * (1.0 - smoothstep(-0.72, -0.04, p.y));
  float cloud = smoothstep(
    0.62,
    0.84,
    fbm(p * vec2(1.7, 3.0) + vec2(t * 0.03, -t * 0.015))
  ) * smoothstep(0.05, 0.85, p.y);
  float density = trunks * 0.5 + branches * 0.3 + canopy * 0.34
    + roots * 0.25 + cloud * 0.32 + response.x * 0.64;
  vec3 background = baseGradient(p, vec3(0.015, 0.12, 0.085));
  vec3 forest = mix(vec3(0.06, 0.34, 0.18), vec3(0.46, 0.96, 0.66), canopy);
  return background + forest * density
    + vec3(0.42, 0.8, 0.9) * cloud * (0.15 + memory * 0.18)
    + vec3(0.66, 1.0, 0.78) * response.y * 0.2;
}
`.trim(),
    },
    {
      id: "pollination-protocol",
      title: "Pollination Protocol",
      titleJa: "共進化プロトコル",
      description: "異なる二者が出会った場所だけに、新しい色と次世代の形が生まれる。",
      accent: "#ffd270",
      rgb: "255, 210, 112",
      source: `
vec3 modePollinationProtocol(vec2 p, float t, vec2 response, float memory) {
  vec2 q = rot(0.13 * sin(t * 0.13)) * p;
  vec2 cellId = floor(q * 2.7);
  vec2 cell = fract(q * 2.7) - 0.5;
  float seed = hash21(cellId + 17.3);
  float angle = atan(cell.y, cell.x);
  float petalRadius = 0.16 + cos(angle * (5.0 + floor(seed * 3.0))) * 0.055;
  float flowers = lineGlow(length(cell) - petalRadius, 0.025)
    * smoothstep(0.25, 0.62, seed);
  float pollen = 0.0;
  for (int i = 0; i < 6; i++) {
    float fi = float(i);
    vec2 insect = vec2(
      sin(t * (0.23 + fi * 0.017) + fi * 2.4),
      cos(t * (0.19 + fi * 0.013) + fi * 1.7)
    ) * vec2(0.72, 0.54);
    insect += (hash22(vec2(fi, 9.2)) - 0.5) * 0.22;
    pollen += exp(-dot(p - insect, p - insect) * 230.0);
  }
  float meeting = flowers * (pollen * 2.0 + response.x * 1.4);
  float density = flowers * 0.45 + pollen * 0.52 + meeting
    + response.y * 0.25;
  vec3 background = baseGradient(p, vec3(0.12, 0.055, 0.08));
  vec3 petal = mix(vec3(1.0, 0.34, 0.5), vec3(1.0, 0.82, 0.28), seed);
  return background + petal * density
    + vec3(0.8, 0.95, 0.48) * meeting * (0.35 + memory * 0.25);
}
`.trim(),
    },
    {
      id: "nothing-is-waste",
      title: "Nothing Is Waste",
      titleJa: "すべては次の資源",
      description: "破片は消えず、分解・変換・再生の回路を巡って別の生命へ受け渡される。",
      accent: "#b4ef6d",
      rgb: "180, 239, 109",
      source: `
vec3 modeNothingIsWaste(vec2 p, float t, vec2 response, float memory) {
  float radius = length(p);
  float angle = atan(p.y, p.x);
  float spiral = lineGlow(
    sin(angle * 3.0 - radius * 8.0 + t * 0.48),
    0.036
  ) * smoothstep(1.2, 0.12, radius);
  float cycleA = lineGlow(radius - 0.34 - sin(angle * 3.0 + t * 0.3) * 0.06, 0.025);
  float cycleB = lineGlow(radius - 0.68 - cos(angle * 4.0 - t * 0.24) * 0.05, 0.021);
  vec2 movingGrid = p * 7.0 + vec2(t * 0.18, -t * 0.13);
  vec2 fragmentCell = fract(movingGrid) - 0.5;
  float fragmentSeed = hash21(floor(movingGrid));
  float fragments = exp(
    -pow(abs(fragmentCell.x) / 0.25, 4.0)
    -pow(abs(fragmentCell.y) / 0.09, 2.0)
  ) * smoothstep(0.55, 0.9, fragmentSeed);
  float transformed = response.x * (0.6 + cycleA + cycleB);
  float density = spiral * 0.36 + cycleA * 0.52 + cycleB * 0.34
    + fragments * 0.24 + transformed + response.y * 0.18;
  vec3 background = baseGradient(p, vec3(0.08, 0.11, 0.035));
  vec3 cycleColor = mix(vec3(0.24, 0.58, 0.16), vec3(0.88, 0.94, 0.35), radius);
  return background + cycleColor * density
    + vec3(0.35, 1.0, 0.68) * memory * spiral * 0.2;
}
`.trim(),
    },
    {
      id: "anthropocene-scar",
      title: "Anthropocene Scar",
      titleJa: "人類世の傷跡",
      description: "生きた場へ刻まれる直線的な圧力と、それを別の秩序へ編み直す余地を描く。",
      accent: "#ff8a67",
      rgb: "255, 138, 103",
      source: `
vec3 modeAnthropoceneScar(vec2 p, float t, vec2 response, float memory) {
  float organicNoise = fbm(p * 1.8 + vec2(t * 0.018, -t * 0.014));
  float organic = lineGlow(
    sin(p.x * 5.3 + p.y * 2.1 + organicNoise * 4.0 - t * 0.18),
    0.045
  );
  float gridX = lineGlow(sin(p.x * 19.0 + uVelocity.x * 0.2), 0.02);
  float gridY = lineGlow(sin(p.y * 15.0 + uVelocity.y * 0.2), 0.02);
  float grid = gridX + gridY;
  float scarA = lineGlow(
    p.y - sin(p.x * 3.8 + t * 0.11) * 0.12
      - (organicNoise - 0.5) * 0.32,
    0.026
  );
  float scarB = lineGlow(
    p.x + p.y * 0.42 - sin(p.y * 6.0 - t * 0.17) * 0.06,
    0.019
  );
  float rigidity = 0.28 + memory * 0.62;
  float healing = response.x * (0.8 + organic * 0.4);
  vec3 background = baseGradient(p, vec3(0.12, 0.045, 0.025));
  vec3 color = background
    + vec3(0.9, 0.24, 0.12) * (scarA * 0.7 + scarB * 0.44)
    + vec3(0.68, 0.46, 0.22) * grid * rigidity * 0.3
    + vec3(0.1, 0.48, 0.5) * organic * (0.18 + healing * 0.7);
  return color + vec3(0.55, 0.9, 0.78) * response.y * 0.2;
}
`.trim(),
    },
    {
      id: "rhythm-of-disaster",
      title: "Rhythm of Disaster",
      titleJa: "災いと恵み",
      description: "変動を止めるのではなく、そのリズムと同期して次の多様性が芽吹く瞬間を見る。",
      accent: "#ffb45f",
      rgb: "255, 180, 95",
      source: `
vec3 modeRhythmOfDisaster(vec2 p, float t, vec2 response, float memory) {
  float terrain = fbm(p * 1.55 + vec2(4.2, t * 0.014));
  float strata = lineGlow(
    sin((p.y + terrain * 0.14) * 18.0 + p.x * 1.8),
    0.04
  );
  float fault = lineGlow(
    p.y - sin(p.x * 4.1 + terrain * 5.0) * 0.16,
    0.022
  );
  float waves = 0.0;
  float regrowth = 0.0;
  for (int i = 0; i < 3; i++) {
    float fi = float(i);
    vec2 origin = (hash22(vec2(fi, 14.7)) - 0.5) * vec2(1.45, 0.9);
    float phase = fract(t * (0.055 + fi * 0.006) + fi * 0.31);
    float distanceToWave = length(p - origin);
    waves += lineGlow(distanceToWave - phase * 1.25, 0.025)
      * (1.0 - phase);
    regrowth += exp(-distanceToWave * 3.8)
      * smoothstep(0.22, 0.68, phase)
      * (1.0 - smoothstep(0.7, 1.0, phase));
  }
  float seedlings = smoothstep(
    0.58,
    0.78,
    noise(p * 13.0 + terrain * 2.0)
  ) * (fault + regrowth);
  float density = fault * 0.58 + waves * 0.72 + seedlings * 0.44
    + response.y * 0.5;
  vec3 background = baseGradient(p, vec3(0.11, 0.05, 0.025));
  return background
    + vec3(0.48, 0.2, 0.08) * strata * 0.24
    + vec3(1.0, 0.38, 0.13) * (fault * 0.68 + waves * 0.56)
    + vec3(0.32, 0.88, 0.44) * regrowth * 0.22
    + vec3(0.56, 1.0, 0.58) * seedlings * (0.52 + memory * 0.32)
    + vec3(1.0, 0.58, 0.18) * density * 0.08
    + vec3(1.0, 0.78, 0.28) * response.x * 0.45;
}
`.trim(),
    },
    {
      id: "three-ecologies",
      title: "Three Ecologies",
      titleJa: "三つの生態系",
      description: "生態・社会・精神の三層が異なる速度で呼吸し、遅れて互いを書き換える。",
      accent: "#c7a2ff",
      rgb: "199, 162, 255",
      source: `
vec3 modeThreeEcologies(vec2 p, float t, vec2 response, float memory) {
  vec2 ecoCenter = vec2(-0.32, 0.08) + vec2(sin(t * 0.12), cos(t * 0.1)) * 0.06;
  vec2 socialCenter = vec2(0.3, 0.13) + vec2(cos(t * 0.09), sin(t * 0.14)) * 0.07;
  vec2 mindCenter = vec2(0.0, -0.31) + vec2(sin(t * 0.07), cos(t * 0.08)) * 0.055;
  float ecoRadius = length(p - ecoCenter);
  float socialRadius = length(p - socialCenter);
  float mindRadius = length(p - mindCenter);
  float eco = lineGlow(sin(ecoRadius * 18.0 - t * 0.42), 0.035)
    * exp(-ecoRadius * 0.68);
  float social = lineGlow(sin(socialRadius * 15.0 + t * 0.31), 0.038)
    * exp(-socialRadius * 0.72);
  float mind = lineGlow(sin(mindRadius * 20.0 - t * 0.2), 0.03)
    * exp(-mindRadius * 0.7);
  float overlap = min(1.0, eco * social + social * mind + mind * eco);
  float dialogue = response.x * (eco + social + mind + 0.2);
  vec3 background = baseGradient(p, vec3(0.055, 0.045, 0.12));
  vec3 color = background
    + vec3(0.25, 0.9, 0.62) * eco * 0.43
    + vec3(0.24, 0.58, 1.0) * social * 0.42
    + vec3(0.82, 0.44, 1.0) * mind * 0.42;
  return color + vec3(0.86, 0.95, 1.0) * overlap * (0.34 + memory * 0.25)
    + vec3(0.74, 0.6, 1.0) * dialogue * 0.36 + response.y * 0.08;
}
`.trim(),
    },
    {
      id: "earth-organ",
      title: "Earth Organ",
      titleJa: "人工物の共生化",
      description: "都市回路を地球の血管へ変え、集中したエネルギーを地域の細胞へ戻していく。",
      accent: "#75f3d1",
      rgb: "117, 243, 209",
      source: `
vec3 modeEarthOrgan(vec2 p, float t, vec2 response, float memory) {
  vec2 q = rot(-0.08) * p;
  float tissue = fbm(q * 1.8 + vec2(t * 0.016, -t * 0.012));
  float gridX = lineGlow(sin(q.x * 17.0 + tissue * 2.0), 0.024);
  float gridY = lineGlow(sin(q.y * 13.0 - tissue * 2.4), 0.024);
  float city = (gridX + gridY) * 0.34;
  float vesselA = lineGlow(
    sin(q.x * 6.0 + q.y * 2.4 + tissue * 4.0 - t * 0.16),
    0.038
  );
  float vesselB = lineGlow(
    sin(q.y * 8.0 - q.x * 1.7 - tissue * 3.0 + t * 0.11),
    0.033
  );
  float nodes = 0.0;
  for (int i = 0; i < 7; i++) {
    float fi = float(i);
    vec2 node = (hash22(vec2(fi, 31.2)) - 0.5) * vec2(1.55, 1.0);
    float pulse = 0.65 + 0.35 * sin(t * 0.8 + fi * 1.4);
    nodes += exp(-dot(p - node, p - node) * 120.0) * pulse;
  }
  float organicization = 0.22 + memory * 0.58 + response.x * 0.55;
  vec3 background = baseGradient(p, vec3(0.015, 0.105, 0.095));
  vec3 color = background
    + vec3(0.15, 0.58, 0.68) * city * (1.0 - organicization * 0.35)
    + vec3(0.32, 0.98, 0.72) * (vesselA + vesselB) * organicization * 0.48
    + vec3(0.78, 1.0, 0.86) * nodes * (0.24 + organicization * 0.26);
  return color + vec3(0.34, 0.86, 1.0) * response.y * 0.26;
}
`.trim(),
    },
    {
      id: "senseware-2050",
      title: "Senseware 2050",
      titleJa: "共創地球",
      description: "九つの窓に残した軌跡が再集合し、このセッションだけの未来の地球になる。",
      accent: "#c8f7ff",
      rgb: "200, 247, 255",
      source: `
vec3 modeSenseware2050(vec2 p, float t, vec2 response, float memory) {
  float radius = length(p);
  float sphereMask = smoothstep(0.82, 0.7, radius);
  float horizon = lineGlow(radius - 0.75, 0.024);
  float latitude = lineGlow(
    sin(p.y * 12.0 + sin(p.x * 2.0) * 1.2 - t * 0.12),
    0.04
  ) * sphereMask;
  float longitude = lineGlow(
    sin(atan(p.y, p.x) * 8.0 + radius * 2.0 + t * 0.1),
    0.04
  ) * sphereMask;
  float nodes = 0.0;
  float links = 0.0;
  float collective = 0.0;
  for (int i = 0; i < 9; i++) {
    float fi = float(i);
    float contribution = uModeMemory[i];
    vec2 node = (hash22(vec2(fi, 72.4)) - 0.5) * vec2(1.18, 0.92);
    node *= 0.82;
    nodes += exp(-dot(p - node, p - node) * 150.0)
      * (0.28 + contribution * 1.35);
    links += lineGlow(sdSegment(p, node, node * -0.18), 0.014)
      * (0.045 + contribution);
    collective += contribution;
  }
  collective /= 9.0;
  float thought = fbm(p * 2.4 + vec2(t * 0.018, -t * 0.014));
  float atmosphere = smoothstep(0.58, 0.82, thought) * sphereMask;
  float sharedPulse = exp(-abs(radius - 0.46 - sin(t * 0.28) * 0.025) * 22.0)
    * sphereMask;
  vec3 background = baseGradient(p, vec3(0.035, 0.1, 0.16));
  vec3 color = background
    + vec3(0.26, 0.72, 0.9) * (latitude + longitude) * 0.34
    + vec3(0.72, 0.98, 1.0) * nodes * 0.72
    + vec3(0.42, 0.92, 0.72) * links * 0.3
    + vec3(0.42, 0.7, 1.0) * sharedPulse * (0.09 + collective * 0.22)
    + vec3(0.22, 0.54, 0.68) * atmosphere * (0.12 + collective * 0.32);
  return color + vec3(0.8, 0.95, 1.0) * horizon * (0.28 + collective * 0.42)
    + vec3(0.7, 0.88, 1.0) * response.x * 0.5
    + vec3(0.9, 0.72, 1.0) * response.y * 0.22;
}
`.trim(),
    },
  ];

  const gl = canvas.getContext("webgl2", {
    alpha: false,
    antialias: false,
    depth: false,
    powerPreference: "high-performance",
    preserveDrawingBuffer: false,
  });

  if (!gl) {
    errorPanel.hidden = false;
    return;
  }

  const vertexSource = `#version 300 es
    in vec2 aPosition;

    void main() {
      gl_Position = vec4(aPosition, 0.0, 1.0);
    }
  `;

  const fragmentSource = `#version 300 es
    precision highp float;
    precision highp int;

    out vec4 fragColor;

    uniform vec2 uResolution;
    uniform float uTime;
    uniform vec4 uPointer;
    uniform vec2 uVelocity;
    uniform vec4 uTrail[${TRAIL_COUNT}];
    uniform float uModeMemory[${MODE_COUNT}];
    uniform int uModeFrom;
    uniform int uModeTo;
    uniform float uTransition;

    mat2 rot(float angle) {
      float s = sin(angle);
      float c = cos(angle);
      return mat2(c, -s, s, c);
    }

    float hash21(vec2 p) {
      p = fract(p * vec2(123.34, 456.21));
      p += dot(p, p + 45.32);
      return fract(p.x * p.y);
    }

    vec2 hash22(vec2 p) {
      float n = hash21(p);
      return vec2(n, hash21(p + n + 19.19));
    }

    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(
        mix(hash21(i), hash21(i + vec2(1.0, 0.0)), u.x),
        mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), u.x),
        u.y
      );
    }

    float fbm(vec2 p) {
      float value = 0.0;
      float amplitude = 0.5;
      for (int i = 0; i < 4; i++) {
        value += noise(p) * amplitude;
        p = rot(0.72) * p * 2.03 + 17.3;
        amplitude *= 0.52;
      }
      return value;
    }

    float lineGlow(float value, float width) {
      return exp(-abs(value) / max(width, 0.0001));
    }

    float sdSegment(vec2 p, vec2 a, vec2 b) {
      vec2 pa = p - a;
      vec2 ba = b - a;
      float denominator = max(dot(ba, ba), 0.0001);
      float h = clamp(dot(pa, ba) / denominator, 0.0, 1.0);
      return length(pa - ba * h);
    }

    vec2 toScene(vec2 normalizedPoint) {
      vec2 pixelPoint = normalizedPoint * uResolution;
      return (pixelPoint * 2.0 - uResolution) / uResolution.y;
    }

    vec3 baseGradient(vec2 p, vec3 tint) {
      float radial = length(p * vec2(0.72, 1.0));
      float haze = fbm(p * vec2(0.72, 0.54) + 6.7);
      vec3 deep = vec3(0.002, 0.006, 0.012);
      vec3 color = mix(deep, tint, haze * 0.34 + 0.04);
      color += tint * max(0.0, 1.0 - radial) * 0.08;
      return color;
    }

    vec2 trailResponse(vec2 p) {
      float bloomField = 0.0;
      float ringField = 0.0;
      for (int i = 0; i < ${TRAIL_COUNT}; i++) {
        vec4 trailPoint = uTrail[i];
        vec2 point = toScene(trailPoint.xy);
        float age = trailPoint.z;
        float strength = trailPoint.w;
        float life = 1.0 - smoothstep(0.12, 3.1, age);
        vec2 local = p - point;
        float bloom = exp(-dot(local, local) * (31.0 + age * 9.0));
        float ringRadius = age * (0.2 + strength * 0.045);
        float ring = lineGlow(length(local) - ringRadius, 0.015 + age * 0.007);
        bloomField += bloom * life * strength * 0.2;
        ringField += ring * life * strength * 0.12;
      }

      if (uPointer.z > 0.0) {
        vec2 local = p - toScene(uPointer.xy);
        bloomField += exp(-dot(local, local) * 24.0) * (0.28 + uPointer.w * 0.24);
        ringField += lineGlow(length(local) - 0.09, 0.018) * 0.12;
      }

      return vec2(bloomField, ringField);
    }

    ${modes.map((mode) => mode.source).join("\n\n    ")}

    vec3 evaluateMode(int mode, vec2 p, float t, vec2 response) {
      if (mode == 0) return modeBreathingEarth(p, t, response, uModeMemory[0]);
      if (mode == 1) return modeBlueCirculation(p, t, response, uModeMemory[1]);
      if (mode == 2) return modeForestCloudEngine(p, t, response, uModeMemory[2]);
      if (mode == 3) return modePollinationProtocol(p, t, response, uModeMemory[3]);
      if (mode == 4) return modeNothingIsWaste(p, t, response, uModeMemory[4]);
      if (mode == 5) return modeAnthropoceneScar(p, t, response, uModeMemory[5]);
      if (mode == 6) return modeRhythmOfDisaster(p, t, response, uModeMemory[6]);
      if (mode == 7) return modeThreeEcologies(p, t, response, uModeMemory[7]);
      if (mode == 8) return modeEarthOrgan(p, t, response, uModeMemory[8]);
      return modeSenseware2050(p, t, response, uModeMemory[9]);
    }

    void main() {
      vec2 uv = (gl_FragCoord.xy * 2.0 - uResolution) / uResolution.y;
      vec2 response = trailResponse(uv);
      vec3 fromColor = evaluateMode(uModeFrom, uv, uTime, response);
      vec3 toColor = evaluateMode(uModeTo, uv, uTime, response);
      float transition = smoothstep(0.0, 1.0, uTransition);
      vec3 color = mix(fromColor, toColor, transition);

      float radial = length(uv * vec2(0.72, 1.0));
      float vignette = smoothstep(1.78, 0.4, radial);
      float grain = hash21(gl_FragCoord.xy + floor(uTime * 18.0)) - 0.5;
      color *= mix(0.48, 1.0, vignette);
      color += grain * 0.008;
      color = color / (vec3(1.0) + color * 0.42);
      color = pow(max(color, 0.0), vec3(0.88));

      fragColor = vec4(color, 1.0);
    }
  `;

  const compileShader = (type, source) => {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const message = gl.getShaderInfoLog(shader) || "Shader compilation failed.";
      gl.deleteShader(shader);
      throw new Error(message);
    }

    return shader;
  };

  const createProgram = () => {
    const vertexShader = compileShader(gl.VERTEX_SHADER, vertexSource);
    const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fragmentSource);
    const nextProgram = gl.createProgram();

    gl.attachShader(nextProgram, vertexShader);
    gl.attachShader(nextProgram, fragmentShader);
    gl.linkProgram(nextProgram);
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);

    if (!gl.getProgramParameter(nextProgram, gl.LINK_STATUS)) {
      const message = gl.getProgramInfoLog(nextProgram) || "Shader link failed.";
      gl.deleteProgram(nextProgram);
      throw new Error(message);
    }

    return nextProgram;
  };

  let program;

  try {
    program = createProgram();
  } catch (error) {
    console.error(error);
    errorPanel.querySelector("p").textContent = "シェーダーの初期化に失敗しました。";
    errorPanel.querySelector("small").textContent = error.message;
    errorPanel.hidden = false;
    return;
  }

  const fullscreenTriangle = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, fullscreenTriangle);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);

  const positionLocation = gl.getAttribLocation(program, "aPosition");
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

  const uniforms = {
    resolution: gl.getUniformLocation(program, "uResolution"),
    time: gl.getUniformLocation(program, "uTime"),
    pointer: gl.getUniformLocation(program, "uPointer"),
    velocity: gl.getUniformLocation(program, "uVelocity"),
    trail: gl.getUniformLocation(program, "uTrail[0]"),
    modeMemory: gl.getUniformLocation(program, "uModeMemory[0]"),
    modeFrom: gl.getUniformLocation(program, "uModeFrom"),
    modeTo: gl.getUniformLocation(program, "uModeTo"),
    transition: gl.getUniformLocation(program, "uTransition"),
  };

  const pointer = {
    id: null,
    x: 0.5,
    y: 0.5,
    down: false,
    energy: 0,
    velocityX: 0,
    velocityY: 0,
    previousX: 0.5,
    previousY: 0.5,
    previousTime: performance.now(),
  };

  const trail = Array.from({ length: TRAIL_COUNT }, () => ({
    x: -10,
    y: -10,
    bornAt: -100,
    strength: 0,
  }));

  const modeMemory = new Float32Array(MODE_COUNT);
  const trailData = new Float32Array(TRAIL_COUNT * 4);
  const modeButtons = [];
  const japanTileElements = new Map();
  const japanPulses = [];
  let japanEarthquakes = [];
  let trailCursor = 0;
  let previousTrailX = -10;
  let previousTrailY = -10;
  let lastTrailAt = 0;
  let animationFrame = 0;
  let startTime = performance.now();
  let hiddenAt = 0;
  let hiddenDuration = 0;
  let sourceIsOpen = false;
  let introIsOpen = false;
  let introRestoreFocus = false;
  let introCloseTimer = 0;
  let japanIsOpen = false;
  let japanRestoreFocus = true;
  let japanCloseTimer = 0;
  let japanTilesDirty = true;
  let japanTileErrors = 0;
  let japanEarthquakeDataState = "idle";
  let autoEnabled = false;
  let nextAutoAt = performance.now() + AUTO_INTERVAL;
  let modeFromIndex = 0;
  let modeToIndex = 0;
  let transitionStartedAt = performance.now();
  const japanView = {
    zoom: JAPAN_ZOOM,
    centerX: 0,
    centerY: 0,
    pointerId: null,
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0,
    dragged: false,
    width: 0,
    height: 0,
  };

  const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));
  const formatModeNumber = (index) => String(index + 1).padStart(2, "0");
  const lonLatToWorld = (lon, lat, zoom = japanView.zoom) => {
    const worldSize = MAP_TILE_SIZE * 2 ** zoom;
    const latitude = clamp(lat, -85.0511, 85.0511);
    const sinLatitude = Math.sin((latitude * Math.PI) / 180);
    return {
      x: ((lon + 180) / 360) * worldSize,
      y:
        (0.5 -
          Math.log((1 + sinLatitude) / (1 - sinLatitude)) / (4 * Math.PI)) *
        worldSize,
    };
  };

  const resetJapanView = () => {
    const center = lonLatToWorld(137.4, 36.5, JAPAN_ZOOM);
    japanView.zoom = JAPAN_ZOOM;
    japanView.centerX = center.x;
    japanView.centerY = center.y;
    japanTilesDirty = true;
  };

  const getJapanViewport = () => {
    const rect = japanMap.getBoundingClientRect();
    return {
      rect,
      left: japanView.centerX - rect.width / 2,
      top: japanView.centerY - rect.height / 2,
    };
  };

  const renderJapanTiles = () => {
    if (!japanIsOpen || !japanTilesDirty) {
      return;
    }

    const { rect, left, top } = getJapanViewport();
    if (rect.width < 1 || rect.height < 1) {
      return;
    }

    const tileCount = 2 ** japanView.zoom;
    const minimumX = Math.floor(left / MAP_TILE_SIZE);
    const maximumX = Math.floor((left + rect.width - 1) / MAP_TILE_SIZE);
    const minimumY = Math.max(0, Math.floor(top / MAP_TILE_SIZE));
    const maximumY = Math.min(
      tileCount - 1,
      Math.floor((top + rect.height - 1) / MAP_TILE_SIZE),
    );
    const visibleKeys = new Set();

    for (let tileY = minimumY; tileY <= maximumY; tileY += 1) {
      for (let tileX = minimumX; tileX <= maximumX; tileX += 1) {
        const wrappedX = ((tileX % tileCount) + tileCount) % tileCount;
        const key = `${japanView.zoom}/${tileX}/${tileY}`;
        visibleKeys.add(key);

        let tile = japanTileElements.get(key);
        if (!tile) {
          tile = document.createElement("img");
          tile.className = "japan-tile";
          tile.alt = "";
          tile.draggable = false;
          tile.decoding = "async";
          tile.src = `https://tile.openstreetmap.org/${japanView.zoom}/${wrappedX}/${tileY}.png`;
          tile.addEventListener(
            "load",
            () => {
              tile.classList.add("is-loaded");
            },
            { once: true },
          );
          tile.addEventListener(
            "error",
            () => {
              japanTileErrors += 1;
              japanMapStatus.textContent =
                "MAP NETWORK OFFLINE / INTERACTION SIGNAL ACTIVE";
            },
            { once: true },
          );
          japanTileElements.set(key, tile);
          japanTiles.append(tile);
        }

        tile.style.transform = `translate3d(${tileX * MAP_TILE_SIZE - left}px, ${
          tileY * MAP_TILE_SIZE - top
        }px, 0)`;
      }
    }

    for (const [key, tile] of japanTileElements) {
      if (!visibleKeys.has(key)) {
        tile.remove();
        japanTileElements.delete(key);
      }
    }

    japanTilesDirty = false;
  };

  const resizeJapanOverlay = (rect) => {
    const ratio = Math.min(window.devicePixelRatio || 1, coarsePointer ? 1.25 : 1.6);
    const width = Math.max(1, Math.floor(rect.width * ratio));
    const height = Math.max(1, Math.floor(rect.height * ratio));

    if (japanOverlay.width !== width || japanOverlay.height !== height) {
      japanOverlay.width = width;
      japanOverlay.height = height;
      japanView.width = rect.width;
      japanView.height = rect.height;
      japanTilesDirty = true;
    }

    return ratio;
  };

  const japanWorldToScreen = (lon, lat, left, top) => {
    const world = lonLatToWorld(lon, lat);
    return {
      x: world.x - left,
      y: world.y - top,
    };
  };

  const renderJapanOverlay = (now) => {
    if (!japanIsOpen || !japanContext) {
      return;
    }

    const { rect, left, top } = getJapanViewport();
    if (rect.width < 1 || rect.height < 1) {
      return;
    }

    const ratio = resizeJapanOverlay(rect);
    const ctx = japanContext;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.clearRect(0, 0, rect.width, rect.height);

    const nodePoints = JAPAN_NODES.map((node) => ({
      ...node,
      ...japanWorldToScreen(node.lon, node.lat, left, top),
    }));

    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    const plateCenter = { x: rect.width * 0.6, y: rect.height * 0.52 };
    const plateVectors = [
      { label: "CONTINENTAL", x: rect.width * 0.08, y: rect.height * 0.63 },
      { label: "NORTHERN", x: rect.width * 0.58, y: rect.height * 0.08 },
      { label: "PACIFIC", x: rect.width * 0.94, y: rect.height * 0.35 },
      { label: "PHILIPPINE SEA", x: rect.width * 0.76, y: rect.height * 0.92 },
    ];

    ctx.font = '6px Consolas, "Courier New", monospace';
    for (const vector of plateVectors) {
      const directionX = plateCenter.x - vector.x;
      const directionY = plateCenter.y - vector.y;
      const length = Math.max(1, Math.hypot(directionX, directionY));
      const endX = plateCenter.x - (directionX / length) * 34;
      const endY = plateCenter.y - (directionY / length) * 34;
      const angle = Math.atan2(endY - vector.y, endX - vector.x);

      ctx.beginPath();
      ctx.moveTo(vector.x, vector.y);
      ctx.lineTo(endX, endY);
      ctx.strokeStyle = "rgba(124, 239, 209, 0.1)";
      ctx.lineWidth = 0.65;
      ctx.setLineDash([3, 8]);
      ctx.lineDashOffset = -(now / 130);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.beginPath();
      ctx.moveTo(endX, endY);
      ctx.lineTo(endX - Math.cos(angle - 0.48) * 8, endY - Math.sin(angle - 0.48) * 8);
      ctx.lineTo(endX - Math.cos(angle + 0.48) * 8, endY - Math.sin(angle + 0.48) * 8);
      ctx.closePath();
      ctx.fillStyle = "rgba(136, 246, 216, 0.17)";
      ctx.fill();
      ctx.fillStyle = "rgba(196, 244, 232, 0.24)";
      ctx.fillText(vector.label, vector.x + 7, vector.y - 7);
    }

    const strongestEarthquake = japanEarthquakes.reduce(
      (strongest, event) =>
        !strongest || event.magnitude > strongest.magnitude ? event : strongest,
      null,
    );

    for (const [index, event] of japanEarthquakes.entries()) {
      const point = japanWorldToScreen(event.longitude, event.latitude, left, top);
      if (
        point.x < -30 ||
        point.x > rect.width + 30 ||
        point.y < -30 ||
        point.y > rect.height + 30
      ) {
        continue;
      }

      const radius = 2.4 + clamp(event.magnitude - 2.5, 0, 4.5) * 1.35;
      const depthOpacity = 0.56 - clamp(event.depthKm / 650, 0, 1) * 0.28;
      const phase = reducedMotion ? 0.5 : 0.5 + Math.sin(now * 0.001 + index) * 0.5;

      ctx.beginPath();
      ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 174, 112, ${depthOpacity})`;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(point.x, point.y, radius + 4 + phase * 3, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255, 166, 101, ${0.12 + phase * 0.1})`;
      ctx.lineWidth = 0.7;
      ctx.stroke();

      if (event === strongestEarthquake && event.magnitude >= 5.5) {
        ctx.fillStyle = "rgba(255, 204, 166, 0.62)";
        ctx.font = '7px Consolas, "Courier New", monospace';
        ctx.fillText(`M${event.magnitude.toFixed(1)}`, point.x + radius + 5, point.y - 5);
      }
    }

    ctx.beginPath();
    nodePoints.forEach((node, index) => {
      if (index === 0) {
        ctx.moveTo(node.x, node.y);
      } else {
        ctx.lineTo(node.x, node.y);
      }
    });
    ctx.strokeStyle = "rgba(117, 239, 207, 0.16)";
    ctx.lineWidth = 0.8;
    ctx.setLineDash([2, 7]);
    ctx.lineDashOffset = -(now / 95);
    ctx.stroke();
    ctx.setLineDash([]);

    nodePoints.forEach((node, index) => {
      if (
        node.x < -40 ||
        node.x > rect.width + 40 ||
        node.y < -40 ||
        node.y > rect.height + 40
      ) {
        return;
      }

      const phase = now * 0.0014 + index * 0.83;
      const pulse = 0.5 + Math.sin(phase) * 0.5;
      ctx.beginPath();
      ctx.arc(node.x, node.y, 3.2, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(174, 255, 230, 0.92)";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(node.x, node.y, 9 + pulse * 8, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(113, 239, 204, ${0.12 + (1 - pulse) * 0.12})`;
      ctx.lineWidth = 0.8;
      ctx.stroke();
      ctx.fillStyle = "rgba(207, 249, 238, 0.52)";
      ctx.font = '7px Consolas, "Courier New", monospace';
      ctx.fillText(node.name, node.x + 10, node.y - 7);
    });

    const pulseLifetime = reducedMotion ? 6500 : 4200;
    for (let index = japanPulses.length - 1; index >= 0; index -= 1) {
      const pulse = japanPulses[index];
      const age = now - pulse.bornAt;
      if (age > pulseLifetime) {
        japanPulses.splice(index, 1);
        continue;
      }

      const progress = clamp(age / pulseLifetime, 0, 1);
      const x = pulse.worldX - left;
      const y = pulse.worldY - top;
      const disturbanceProgress = clamp(progress / 0.24, 0, 1);
      const regenerationProgress = clamp((progress - 0.12) / 0.88, 0, 1);
      const disturbanceRadius = 8 + disturbanceProgress * 46;
      const regenerationRadius =
        10 + regenerationProgress * Math.min(170, rect.width * 0.34);
      const disturbanceAlpha = (1 - disturbanceProgress) * 0.78;
      const regenerationAlpha = (1 - regenerationProgress) * 0.62;

      if (pulse.nodeIndex !== undefined) {
        const node = nodePoints[pulse.nodeIndex];
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(node.x, node.y);
        ctx.setLineDash([2, 8]);
        ctx.lineDashOffset = -(now / 80);
        ctx.strokeStyle = `rgba(126, 241, 211, ${regenerationAlpha * 0.42})`;
        ctx.lineWidth = 0.7;
        ctx.stroke();
        ctx.setLineDash([]);
      }

      if (disturbanceAlpha > 0.01) {
        ctx.beginPath();
        ctx.arc(x, y, disturbanceRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 139, 94, ${disturbanceAlpha})`;
        ctx.lineWidth = 1.4;
        ctx.stroke();
      }

      for (let ring = 0; ring < 3; ring += 1) {
        ctx.beginPath();
        ctx.arc(
          x,
          y,
          Math.max(2, regenerationRadius - ring * 18),
          0,
          Math.PI * 2,
        );
        ctx.strokeStyle = `rgba(135, 255, 219, ${
          regenerationAlpha * (1 - ring * 0.22)
        })`;
        ctx.lineWidth = ring === 0 ? 1.3 : 0.65;
        ctx.stroke();
      }
    }

    if (japanTileErrors === 0) {
      const latestPulse = japanPulses.at(-1);
      if (!latestPulse) {
        japanMapStatus.textContent = getJapanObservationStatus();
      } else if (now - latestPulse.bornAt < pulseLifetime * 0.24) {
        japanMapStatus.textContent = "DISTURBANCE RECEIVED / LISTENING TO THE EARTH";
      } else {
        japanMapStatus.textContent = "REGENERATION WAVE / SYNCHRONIZING WITH EARTH RHYTHM";
      }
    }

    if (!reducedMotion) {
      const scanX = ((now * 0.032) % (rect.width + 240)) - 120;
      const scanGradient = ctx.createLinearGradient(scanX - 60, 0, scanX + 60, 0);
      scanGradient.addColorStop(0, "rgba(112, 239, 205, 0)");
      scanGradient.addColorStop(0.5, "rgba(112, 239, 205, 0.09)");
      scanGradient.addColorStop(1, "rgba(112, 239, 205, 0)");
      ctx.fillStyle = scanGradient;
      ctx.fillRect(scanX - 60, 0, 120, rect.height);
    }
    ctx.restore();
  };

  const addJapanPulse = (clientX, clientY) => {
    const { rect, left, top } = getJapanViewport();
    const worldX = left + clientX - rect.left;
    const worldY = top + clientY - rect.top;
    let nearestNodeIndex = 0;
    let nearestNodeDistance = Number.POSITIVE_INFINITY;

    JAPAN_NODES.forEach((node, index) => {
      const nodeWorld = lonLatToWorld(node.lon, node.lat);
      const distance = Math.hypot(worldX - nodeWorld.x, worldY - nodeWorld.y);
      if (distance < nearestNodeDistance) {
        nearestNodeDistance = distance;
        nearestNodeIndex = index;
      }
    });

    japanPulses.push({
      worldX,
      worldY,
      nodeIndex: nearestNodeIndex,
      bornAt: performance.now(),
    });
    if (japanPulses.length > 18) {
      japanPulses.shift();
    }
  };

  const japanCoordinateIsVisible = (longitude, latitude) =>
    longitude >= JAPAN_DATA_BOUNDS.west &&
    longitude <= JAPAN_DATA_BOUNDS.east &&
    latitude >= JAPAN_DATA_BOUNDS.south &&
    latitude <= JAPAN_DATA_BOUNDS.north;

  const normalizeJapanEarthquake = (event) => {
    if (event.geometry?.coordinates && event.properties) {
      const [longitude, latitude, depthKm] = event.geometry.coordinates;
      return {
        id: event.id,
        time: new Date(event.properties.time).toISOString(),
        magnitude: Number(event.properties.mag),
        place: event.properties.place || "Japan region",
        longitude: Number(longitude),
        latitude: Number(latitude),
        depthKm: Number(depthKm),
      };
    }

    return {
      id: event.id,
      time: event.time,
      magnitude: Number(event.magnitude),
      place: event.place || "Japan region",
      longitude: Number(event.longitude),
      latitude: Number(event.latitude),
      depthKm: Number(event.depthKm),
    };
  };

  const getJapanObservationStatus = () => {
    if (japanTileErrors > 0) {
      return "MAP NETWORK OFFLINE / INTERACTION SIGNAL ACTIVE";
    }
    if (japanEarthquakeDataState === "loading") {
      return "USGS WEEK FEED / RECEIVING OBSERVATIONS";
    }
    if (japanEarthquakeDataState === "live") {
      return `USGS WEEK FEED / ${japanEarthquakes.length} OBSERVATIONS / M2.5+`;
    }
    if (japanEarthquakeDataState === "snapshot") {
      return `USGS SNAPSHOT / ${japanEarthquakes.length} OBSERVATIONS / M2.5+`;
    }
    if (japanEarthquakeDataState === "offline") {
      return "SEISMIC DATA OFFLINE / INTERACTION SIGNAL ACTIVE";
    }
    return "4 PLATE CONTACT ZONE / EARTH RHYTHM ACTIVE";
  };

  const fetchJsonWithTimeout = async (url, timeout = 6500) => {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), timeout);
    try {
      const response = await fetch(url, {
        cache: "default",
        signal: controller.signal,
      });
      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }
      return await response.json();
    } finally {
      window.clearTimeout(timeoutId);
    }
  };

  const loadJapanEarthquakes = async () => {
    if (
      japanEarthquakeDataState === "loading" ||
      japanEarthquakeDataState === "live" ||
      japanEarthquakeDataState === "snapshot"
    ) {
      return;
    }

    japanEarthquakeDataState = "loading";
    if (japanTileErrors === 0) {
      japanMapStatus.textContent = getJapanObservationStatus();
    }

    try {
      const data = await fetchJsonWithTimeout(USGS_WEEK_FEED);
      japanEarthquakes = data.features
        .map(normalizeJapanEarthquake)
        .filter(
          (event) =>
            Number.isFinite(event.longitude) &&
            Number.isFinite(event.latitude) &&
            Number.isFinite(event.magnitude) &&
            event.magnitude >= 2.5 &&
            japanCoordinateIsVisible(event.longitude, event.latitude),
        )
        .sort((first, second) => Date.parse(second.time) - Date.parse(first.time))
        .slice(0, 40);
      japanEarthquakeDataState = "live";
    } catch {
      try {
        const fallback = await fetchJsonWithTimeout(
          "./data/japan-earthquakes-fallback.json",
          2800,
        );
        japanEarthquakes = fallback.events
          .map(normalizeJapanEarthquake)
          .filter(
            (event) =>
              Number.isFinite(event.longitude) &&
              Number.isFinite(event.latitude) &&
              Number.isFinite(event.magnitude) &&
              japanCoordinateIsVisible(event.longitude, event.latitude),
          );
        japanEarthquakeDataState = "snapshot";
      } catch {
        japanEarthquakes = [];
        japanEarthquakeDataState = "offline";
      }
    }

    if (japanPulses.length === 0 || japanTileErrors > 0) {
      japanMapStatus.textContent = getJapanObservationStatus();
    }
  };

  const clearTrail = () => {
    for (const point of trail) {
      point.x = -10;
      point.y = -10;
      point.bornAt = -100;
      point.strength = 0;
    }

    trailCursor = 0;
    previousTrailX = -10;
    previousTrailY = -10;
    pointer.energy = 0;
  };

  const clearSession = () => {
    clearTrail();
    modeMemory.fill(0);
    experience.classList.remove("has-interacted");
  };

  const addTrailPoint = (x, y, now, strength, force = false) => {
    const distance = Math.hypot(x - previousTrailX, y - previousTrailY);

    if (!force && distance < 0.018 && now - lastTrailAt < 42) {
      return;
    }

    const point = trail[trailCursor];
    point.x = x;
    point.y = y;
    point.bornAt = now;
    point.strength = clamp(strength, 0.28, 1.35);

    trailCursor = (trailCursor + 1) % TRAIL_COUNT;
    previousTrailX = x;
    previousTrailY = y;
    lastTrailAt = now;
    modeMemory[modeToIndex] = clamp(
      modeMemory[modeToIndex] + 0.012 + point.strength * 0.008,
      0,
      1,
    );
  };

  const updatePointer = (event, forceTrail = false) => {
    const rect = canvas.getBoundingClientRect();
    const x = clamp((event.clientX - rect.left) / Math.max(rect.width, 1), 0, 1);
    const y = clamp(1 - (event.clientY - rect.top) / Math.max(rect.height, 1), 0, 1);
    const now = performance.now();
    const elapsed = Math.max(now - pointer.previousTime, 8);

    pointer.velocityX = clamp(((x - pointer.previousX) * 1000) / elapsed, -1.8, 1.8);
    pointer.velocityY = clamp(((y - pointer.previousY) * 1000) / elapsed, -1.8, 1.8);
    const speed = Math.hypot(pointer.velocityX, pointer.velocityY);
    pointer.energy = clamp(pointer.energy + speed * 0.17 + (pointer.down ? 0.08 : 0), 0, 1.35);
    pointer.x = x;
    pointer.y = y;
    pointer.previousX = x;
    pointer.previousY = y;
    pointer.previousTime = now;

    if (pointer.down || event.pointerType === "mouse") {
      addTrailPoint(x, y, now, 0.48 + speed * 0.36 + (pointer.down ? 0.18 : 0), forceTrail);
      experience.classList.add("has-interacted");
    }
  };

  const renderSource = () => {
    const mode = modes[modeToIndex];
    sourceCode.replaceChildren();
    const fragment = document.createDocumentFragment();

    for (const line of mode.source.split("\n")) {
      const lineElement = document.createElement("span");
      lineElement.className = "code-line";
      lineElement.textContent = line || " ";
      fragment.append(lineElement);
    }

    sourceCode.append(fragment);
    sourceTitle.textContent = mode.title;
    sourceFile.textContent = `${formatModeNumber(modeToIndex)}-${mode.id}.frag`;
  };

  const updateModeInterface = () => {
    const mode = modes[modeToIndex];
    modeNumber.textContent = formatModeNumber(modeToIndex);
    modeTitle.textContent = mode.title;
    modeTitleJa.textContent = mode.titleJa;
    modeDescription.textContent = mode.description;
    experience.style.setProperty("--accent", mode.accent);
    experience.style.setProperty("--accent-rgb", mode.rgb);
    document.querySelector('meta[name="theme-color"]').setAttribute("content", "#03070d");

    modeButtons.forEach((button, index) => {
      button.setAttribute("aria-current", index === modeToIndex ? "true" : "false");
    });

    renderSource();
  };

  const selectMode = (index, { resetAutoTimer = true } = {}) => {
    const normalizedIndex = (index + MODE_COUNT) % MODE_COUNT;
    if (normalizedIndex === modeToIndex) {
      if (resetAutoTimer) {
        nextAutoAt = performance.now() + AUTO_INTERVAL;
      }
      return;
    }

    modeFromIndex = modeToIndex;
    modeToIndex = normalizedIndex;
    transitionStartedAt = performance.now();
    if (resetAutoTimer) {
      nextAutoAt = transitionStartedAt + AUTO_INTERVAL;
    }
    updateModeInterface();
  };

  modes.forEach((mode, index) => {
    const button = document.createElement("button");
    button.className = "mode-button";
    button.type = "button";
    button.textContent = formatModeNumber(index);
    button.setAttribute("aria-label", `${formatModeNumber(index)} ${mode.title} ${mode.titleJa}`);
    button.setAttribute("aria-current", index === 0 ? "true" : "false");
    button.addEventListener("click", () => selectMode(index));
    modeButtons.push(button);
    modeList.append(button);
  });

  previousModeButton.addEventListener("click", () => selectMode(modeToIndex - 1));
  nextModeButton.addEventListener("click", () => selectMode(modeToIndex + 1));

  const updateAutoInterface = () => {
    autoButton.setAttribute("aria-pressed", autoEnabled ? "true" : "false");
    autoButton.title = autoEnabled ? "Exhibition mode: on" : "Exhibition mode: off";
    experience.classList.toggle("is-auto", autoEnabled);
  };

  autoButton.addEventListener("click", () => {
    autoEnabled = !autoEnabled;
    nextAutoAt = performance.now() + AUTO_INTERVAL;
    updateAutoInterface();
  });

  resetButton.addEventListener("click", clearSession);

  japanMap.addEventListener("pointerdown", (event) => {
    if (!japanIsOpen || japanView.pointerId !== null) {
      return;
    }
    event.preventDefault();
    japanView.pointerId = event.pointerId;
    japanView.startX = event.clientX;
    japanView.startY = event.clientY;
    japanView.lastX = event.clientX;
    japanView.lastY = event.clientY;
    japanView.dragged = false;
    japanMap.setPointerCapture(event.pointerId);
  });

  japanMap.addEventListener("pointermove", (event) => {
    if (!japanIsOpen || japanView.pointerId !== event.pointerId) {
      return;
    }
    event.preventDefault();
    const deltaX = event.clientX - japanView.lastX;
    const deltaY = event.clientY - japanView.lastY;
    const totalDistance = Math.hypot(
      event.clientX - japanView.startX,
      event.clientY - japanView.startY,
    );

    if (totalDistance > 5) {
      japanView.dragged = true;
      japanMap.classList.add("is-dragging");
    }

    if (japanView.dragged) {
      const worldSize = MAP_TILE_SIZE * 2 ** japanView.zoom;
      japanView.centerX = clamp(japanView.centerX - deltaX, 0, worldSize);
      japanView.centerY = clamp(japanView.centerY - deltaY, 0, worldSize);
      japanTilesDirty = true;
    }

    japanView.lastX = event.clientX;
    japanView.lastY = event.clientY;
  });

  const releaseJapanPointer = (event, createPulse) => {
    if (japanView.pointerId !== event.pointerId) {
      return;
    }
    if (japanMap.hasPointerCapture(event.pointerId)) {
      japanMap.releasePointerCapture(event.pointerId);
    }
    if (createPulse && !japanView.dragged) {
      addJapanPulse(event.clientX, event.clientY);
    }
    japanView.pointerId = null;
    japanView.dragged = false;
    japanMap.classList.remove("is-dragging");
  };

  japanMap.addEventListener("pointerup", (event) => releaseJapanPointer(event, true));
  japanMap.addEventListener("pointercancel", (event) =>
    releaseJapanPointer(event, false),
  );

  japanMap.addEventListener("keydown", (event) => {
    const movement = event.shiftKey ? 110 : 46;
    if (event.key === "ArrowLeft") {
      japanView.centerX -= movement;
    } else if (event.key === "ArrowRight") {
      japanView.centerX += movement;
    } else if (event.key === "ArrowUp") {
      japanView.centerY -= movement;
    } else if (event.key === "ArrowDown") {
      japanView.centerY += movement;
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      const rect = japanMap.getBoundingClientRect();
      addJapanPulse(rect.left + rect.width / 2, rect.top + rect.height / 2);
      return;
    } else {
      return;
    }
    event.preventDefault();
    japanTilesDirty = true;
  });

  canvas.addEventListener("pointerdown", (event) => {
    pointer.id = event.pointerId;
    pointer.down = true;
    canvas.setPointerCapture(event.pointerId);
    updatePointer(event, true);
  });

  canvas.addEventListener("pointermove", (event) => {
    if (pointer.id !== null && pointer.id !== event.pointerId) {
      return;
    }
    updatePointer(event);
  });

  const releasePointer = (event) => {
    if (pointer.id !== null && pointer.id !== event.pointerId) {
      return;
    }
    if (canvas.hasPointerCapture(event.pointerId)) {
      canvas.releasePointerCapture(event.pointerId);
    }
    pointer.down = false;
    pointer.id = null;
  };

  canvas.addEventListener("pointerup", releasePointer);
  canvas.addEventListener("pointercancel", releasePointer);
  canvas.addEventListener("pointerleave", (event) => {
    if (!pointer.down && event.pointerType === "mouse") {
      pointer.energy *= 0.6;
    }
  });

  const updateSourceHash = (isOpen) => {
    const nextHash = isOpen ? "#source" : "";
    if (window.location.hash === nextHash) {
      return;
    }
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${window.location.search}${nextHash}`,
    );
  };

  const openSource = ({ updateHash = true } = {}) => {
    if (sourceIsOpen) {
      return;
    }
    if (japanIsOpen) {
      closeJapan({ restoreFocus: false, updateHash: false });
    }
    sourceIsOpen = true;
    experience.classList.add("source-open");
    sourceButton.setAttribute("aria-expanded", "true");
    sourceButton.setAttribute("aria-label", "GLSLコードを閉じる");
    sourcePanel.setAttribute("aria-hidden", "false");
    sourceScrim.setAttribute("aria-hidden", "false");
    sourcePanel.inert = false;
    if (updateHash) {
      updateSourceHash(true);
    }
    requestAnimationFrame(() => sourceClose.focus({ preventScroll: true }));
  };

  const closeSource = ({ restoreFocus = true, updateHash = true } = {}) => {
    if (!sourceIsOpen) {
      return;
    }
    sourceIsOpen = false;
    experience.classList.remove("source-open");
    sourceButton.setAttribute("aria-expanded", "false");
    sourceButton.setAttribute("aria-label", "GLSLコードを表示");
    sourcePanel.setAttribute("aria-hidden", "true");
    sourceScrim.setAttribute("aria-hidden", "true");
    sourcePanel.inert = true;
    if (updateHash) {
      updateSourceHash(false);
    }
    if (restoreFocus) {
      sourceButton.focus({ preventScroll: true });
    }
  };

  const updateJapanHash = (isOpen) => {
    const nextHash = isOpen ? "#japan" : "";
    if (window.location.hash === nextHash) {
      return;
    }
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${window.location.search}${nextHash}`,
    );
  };

  const setEarthControlsDisabled = (disabled) => {
    previousModeButton.disabled = disabled;
    nextModeButton.disabled = disabled;
    autoButton.disabled = disabled;
    sourceButton.disabled = disabled;
    resetButton.disabled = disabled;
    modeButtons.forEach((button) => {
      button.disabled = disabled;
    });
  };

  const openJapan = ({
    updateHash = true,
    restoreFocusOnClose = true,
  } = {}) => {
    if (japanIsOpen) {
      return;
    }
    if (sourceIsOpen) {
      closeSource({ restoreFocus: false, updateHash: false });
    }
    if (introIsOpen) {
      closeIntro({ restoreFocus: false });
    }

    window.clearTimeout(japanCloseTimer);
    japanIsOpen = true;
    japanRestoreFocus = restoreFocusOnClose;
    japanLayer.hidden = false;
    japanLayer.inert = false;
    japanLayer.setAttribute("aria-hidden", "false");
    japanLayer.classList.remove("is-closing");
    japanButton.setAttribute("aria-pressed", "true");
    japanButton.title = "Return to Earth systems";
    experience.classList.add("japan-open");
    setEarthControlsDisabled(true);
    japanTilesDirty = true;
    nextAutoAt = performance.now() + AUTO_INTERVAL;
    void loadJapanEarthquakes();

    if (updateHash) {
      updateJapanHash(true);
    }

    requestAnimationFrame(() => {
      renderJapanTiles();
      japanClose.focus({ preventScroll: true });
    });
  };

  const closeJapan = ({
    restoreFocus = japanRestoreFocus,
    updateHash = true,
  } = {}) => {
    if (!japanIsOpen) {
      return;
    }

    japanIsOpen = false;
    japanLayer.classList.add("is-closing");
    japanLayer.setAttribute("aria-hidden", "true");
    japanLayer.inert = true;
    japanButton.setAttribute("aria-pressed", "false");
    japanButton.title = "Japan lens";
    experience.classList.remove("japan-open");
    setEarthControlsDisabled(false);
    nextAutoAt = performance.now() + AUTO_INTERVAL;

    if (updateHash) {
      updateJapanHash(false);
    }
    if (restoreFocus) {
      japanButton.focus({ preventScroll: true });
    }

    const closeDelay = reducedMotion ? 0 : 420;
    japanCloseTimer = window.setTimeout(() => {
      if (!japanIsOpen) {
        japanLayer.hidden = true;
      }
    }, closeDelay);
  };

  const hasSeenIntro = () => {
    try {
      return window.sessionStorage.getItem("gaia-senseware-intro") === "seen";
    } catch {
      return false;
    }
  };

  const rememberIntro = () => {
    try {
      window.sessionStorage.setItem("gaia-senseware-intro", "seen");
    } catch {
      // The installation remains usable when storage is unavailable.
    }
  };

  const openIntro = ({ restoreFocusOnClose = true } = {}) => {
    if (introIsOpen) {
      return;
    }
    if (sourceIsOpen) {
      closeSource({ restoreFocus: false });
    }
    if (japanIsOpen) {
      closeJapan({ restoreFocus: false });
    }
    window.clearTimeout(introCloseTimer);
    introIsOpen = true;
    introRestoreFocus = restoreFocusOnClose;
    introLayer.hidden = false;
    introLayer.inert = false;
    introLayer.setAttribute("aria-hidden", "false");
    introLayer.classList.remove("is-closing");
    experience.classList.add("intro-open");
    requestAnimationFrame(() => introEnter.focus({ preventScroll: true }));
  };

  const closeIntro = ({ remember = true, restoreFocus = introRestoreFocus } = {}) => {
    if (!introIsOpen) {
      return;
    }
    introIsOpen = false;
    if (remember) {
      rememberIntro();
    }
    introLayer.classList.add("is-closing");
    introLayer.setAttribute("aria-hidden", "true");
    introLayer.inert = true;
    experience.classList.remove("intro-open");
    nextAutoAt = performance.now() + AUTO_INTERVAL;

    if (restoreFocus) {
      introButton.focus({ preventScroll: true });
    }

    const closeDelay = reducedMotion ? 0 : 520;
    introCloseTimer = window.setTimeout(() => {
      if (!introIsOpen) {
        introLayer.hidden = true;
      }
    }, closeDelay);
  };

  sourcePanel.inert = true;
  introLayer.inert = true;
  japanLayer.inert = true;
  japanButton.addEventListener("click", () => {
    if (japanIsOpen) {
      closeJapan();
    } else {
      openJapan();
    }
  });
  japanClose.addEventListener("click", () => closeJapan());
  sourceButton.addEventListener("click", () => {
    if (sourceIsOpen) {
      closeSource();
    } else {
      openSource();
    }
  });
  sourceClose.addEventListener("click", () => closeSource());
  sourceScrim.addEventListener("click", () => closeSource());
  introButton.addEventListener("click", () => openIntro());
  introEnter.addEventListener("click", () => closeIntro());
  introJapan.addEventListener("click", () => {
    closeIntro({ restoreFocus: false });
    openJapan();
  });
  window.addEventListener("hashchange", () => {
    if (window.location.hash === "#source") {
      closeIntro({ remember: false, restoreFocus: false });
      closeJapan({ restoreFocus: false, updateHash: false });
      openSource({ updateHash: false });
    } else if (window.location.hash === "#japan") {
      closeIntro({ remember: false, restoreFocus: false });
      closeSource({ restoreFocus: false, updateHash: false });
      openJapan({ updateHash: false, restoreFocusOnClose: false });
    } else {
      closeSource({ restoreFocus: false, updateHash: false });
      closeJapan({ restoreFocus: false, updateHash: false });
    }
  });

  document.addEventListener("keydown", (event) => {
    if (introIsOpen) {
      if (event.key === "Escape") {
        closeIntro();
      } else if (event.key === "Tab") {
        event.preventDefault();
        const targets = [introEnter, introJapan];
        const currentIndex = targets.indexOf(document.activeElement);
        const direction = event.shiftKey ? -1 : 1;
        const nextIndex =
          currentIndex === -1
            ? 0
            : (currentIndex + direction + targets.length) % targets.length;
        targets[nextIndex].focus({ preventScroll: true });
      }
      return;
    }
    if (japanIsOpen) {
      if (event.key === "Escape" || event.key.toLowerCase() === "j") {
        closeJapan();
      }
      return;
    }
    if (event.key === "Escape" && sourceIsOpen) {
      closeSource();
      return;
    }
    if (sourceIsOpen || event.ctrlKey || event.metaKey || event.altKey) {
      return;
    }
    if (event.key === "ArrowLeft") {
      selectMode(modeToIndex - 1);
    } else if (event.key === "ArrowRight") {
      selectMode(modeToIndex + 1);
    } else if (event.key.toLowerCase() === "c") {
      openSource();
    } else if (event.key.toLowerCase() === "i") {
      openIntro();
    } else if (event.key.toLowerCase() === "j") {
      openJapan();
    } else if (/^[1-9]$/.test(event.key)) {
      selectMode(Number(event.key) - 1);
    } else if (event.key === "0") {
      selectMode(9);
    }
  });

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    const ratioCap = coarsePointer ? 1.0 : 1.35;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, ratioCap);
    const rawWidth = Math.max(1, rect.width * pixelRatio);
    const rawHeight = Math.max(1, rect.height * pixelRatio);
    const maxPixels = coarsePointer ? 560000 : 1300000;
    const pixelScale = Math.min(1, Math.sqrt(maxPixels / (rawWidth * rawHeight)));
    const width = Math.max(1, Math.floor(rawWidth * pixelScale));
    const height = Math.max(1, Math.floor(rawHeight * pixelScale));

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
    gl.viewport(0, 0, width, height);
  };

  const render = (now) => {
    resize();
    if (japanIsOpen) {
      renderJapanTiles();
      renderJapanOverlay(now);
    }

    if (
      autoEnabled &&
      !sourceIsOpen &&
      !introIsOpen &&
      !japanIsOpen &&
      now >= nextAutoAt
    ) {
      selectMode(modeToIndex + 1, { resetAutoTimer: false });
      nextAutoAt = now + AUTO_INTERVAL;
    }

    const elapsed = Math.max(0, (now - startTime - hiddenDuration) / 1000);
    const timeScale = reducedMotion ? 0.32 : 1;
    const transitionDuration = reducedMotion ? 30 : TRANSITION_DURATION;
    const transition = clamp((now - transitionStartedAt) / transitionDuration, 0, 1);

    if (transition >= 1) {
      modeFromIndex = modeToIndex;
    }

    pointer.energy *= pointer.down ? 0.985 : 0.955;
    pointer.velocityX *= 0.9;
    pointer.velocityY *= 0.9;

    for (let index = 0; index < trail.length; index += 1) {
      const point = trail[index];
      const offset = index * 4;
      trailData[offset] = point.x;
      trailData[offset + 1] = point.y;
      trailData[offset + 2] = Math.max(0, (now - point.bornAt) / 1000);
      trailData[offset + 3] = point.strength;
    }

    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, fullscreenTriangle);
    gl.uniform2f(uniforms.resolution, canvas.width, canvas.height);
    gl.uniform1f(uniforms.time, elapsed * timeScale);
    gl.uniform4f(
      uniforms.pointer,
      pointer.x,
      pointer.y,
      pointer.down ? 1 : 0,
      pointer.energy,
    );
    gl.uniform2f(uniforms.velocity, pointer.velocityX, pointer.velocityY);
    gl.uniform4fv(uniforms.trail, trailData);
    gl.uniform1fv(uniforms.modeMemory, modeMemory);
    gl.uniform1i(uniforms.modeFrom, modeFromIndex);
    gl.uniform1i(uniforms.modeTo, modeToIndex);
    gl.uniform1f(uniforms.transition, transition);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    animationFrame = requestAnimationFrame(render);
  };

  const startRendering = () => {
    cancelAnimationFrame(animationFrame);
    animationFrame = requestAnimationFrame(render);
  };

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      hiddenAt = performance.now();
      cancelAnimationFrame(animationFrame);
    } else {
      if (hiddenAt > 0) {
        hiddenDuration += performance.now() - hiddenAt;
        hiddenAt = 0;
      }
      nextAutoAt = performance.now() + AUTO_INTERVAL;
      startRendering();
    }
  });

  canvas.addEventListener(
    "webglcontextlost",
    (event) => {
      event.preventDefault();
      errorPanel.querySelector("p").textContent = "描画コンテキストが失われました。";
      errorPanel.querySelector("small").textContent = "ページを再読み込みしてください。";
      errorPanel.hidden = false;
    },
    false,
  );

  window.addEventListener("resize", resize, { passive: true });

  clearSession();
  resetJapanView();
  updateModeInterface();
  updateAutoInterface();
  resize();
  startRendering();

  if (window.location.hash === "#source") {
    openSource({ updateHash: false });
  } else if (window.location.hash === "#japan") {
    openJapan({ updateHash: false, restoreFocusOnClose: false });
  } else if (!hasSeenIntro()) {
    openIntro({ restoreFocusOnClose: false });
  }
})();
