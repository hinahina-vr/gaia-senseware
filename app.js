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
  const conceptOpen = document.querySelector("#concept-open");
  const conceptPanel = document.querySelector("#concept-panel");
  const conceptClose = document.querySelector("#concept-close");
  const conceptNumber = document.querySelector("#concept-number");
  const conceptTitle = document.querySelector("#concept-title");
  const conceptTitleEn = document.querySelector("#concept-title-en");
  const conceptLead = document.querySelector("#concept-lead");
  const conceptSeeing = document.querySelector("#concept-seeing");
  const conceptTouch = document.querySelector("#concept-touch");
  const conceptContext = document.querySelector("#concept-context");
  const conceptQuestion = document.querySelector("#concept-question");
  const conceptScroll = document.querySelector("#concept-scroll");
  const conceptPosition = document.querySelector("#concept-position");
  const conceptPrevious = document.querySelector("#concept-previous");
  const conceptNext = document.querySelector("#concept-next");
  const conceptModeList = document.querySelector("#concept-mode-list");
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
  const japanDataButton = document.querySelector("#japan-data-button");
  const japanDataPanel = document.querySelector("#japan-data-panel");
  const japanDataClose = document.querySelector("#japan-data-close");
  const japanDataScrim = document.querySelector("#japan-data-scrim");
  const japanDataState = document.querySelector("#japan-data-state");
  const japanDataUpdated = document.querySelector("#japan-data-updated");
  const japanHistoryState = document.querySelector("#japan-history-state");
  const japanHistoryUpdated = document.querySelector("#japan-history-updated");
  const japanObservationKicker = document.querySelector("#japan-observation-kicker");
  const japanObservationCopy = document.querySelector("#japan-observation-copy");
  const japanHistoryLayerButton = document.querySelector("#japan-history-layer");
  const japanLiveLayerButton = document.querySelector("#japan-live-layer");
  const japanPoiCard = document.querySelector("#japan-poi-card");
  const japanPoiClose = document.querySelector("#japan-poi-close");
  const japanPoiType = document.querySelector("#japan-poi-type");
  const japanPoiTitle = document.querySelector("#japan-poi-title");
  const japanPoiMeta = document.querySelector("#japan-poi-meta");
  const japanPoiDescription = document.querySelector("#japan-poi-description");
  const japanPoiRelation = document.querySelector("#japan-poi-relation");

  const TRAIL_COUNT = 16;
  const MODE_COUNT = 10;
  const TRANSITION_DURATION = 1500;
  const AUTO_INTERVAL = 18000;
  const MAP_TILE_SIZE = 256;
  const JAPAN_ZOOM = 5;
  const JAPAN_MOBILE_ZOOM = 4;
  const EARTH_RADIUS_KM = 6371;
  const P_WAVE_SPEED_KM_S = 7;
  const S_WAVE_SPEED_KM_S = 4;
  const JAPAN_WAVE_VISUAL_LIMIT_KM = 2500;
  const JAPAN_HISTORY_CARD_DELAY = 8000;
  const USGS_WEEK_FEED =
    "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson";
  const JMA_HISTORY_DATA = "./data/jma-intensity-history.json";
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
    {
      name: "NAHA",
      nameJa: "那覇・南西諸島",
      lon: 127.68,
      lat: 26.21,
      description: "亜熱帯の島々では、海流、サンゴ礁、台風、観光都市の営みが近い距離で重なります。海を境界ではなく、島々を結ぶ循環として読むための地点です。",
      relation: "02 青い循環系 × 08 三つの生態系 — 海の変化と地域社会の変化を一つの関係として考える。",
    },
    {
      name: "YAKUSHIMA",
      nameJa: "屋久島",
      lon: 130.52,
      lat: 30.36,
      description: "高い山地、豊かな雨、古い森林、海まで続く水の流れが、短い距離の中でつながる島です。森が気候と水循環を支える働きを聴く地点として置いています。",
      relation: "03 森の気候装置 — 森林を木材の集合ではなく、水と雲をつくる生きたインフラとして捉える。",
    },
    {
      name: "ASO",
      nameJa: "阿蘇",
      lon: 131.1,
      lat: 32.88,
      description: "火山活動が生んだ地形の上に、草原、農業、湧水、集落の営みが重なる地域です。大地の変動を消すのではなく、恵みとリスクの両方を引き受ける場所として選びました。",
      relation: "07 災いと恵み — 変動する地球に文明の側がどう同期し、回復の余地を残すかを問う。",
    },
    {
      name: "NOTO",
      nameJa: "能登",
      lon: 136.9,
      lat: 37.3,
      description: "里山と里海、農漁業、祭礼、集落の知恵が相互に支え合ってきた半島です。自然環境だけでなく、暮らしと記憶を含めて再生を考える地点です。",
      relation: "05 すべては次の資源 × 08 三つの生態系 — 資源循環、共同体、心の回復を切り離さない。",
    },
    {
      name: "TOKYO",
      nameJa: "東京",
      lon: 139.69,
      lat: 35.68,
      description: "食料、電力、水、情報、廃棄物が巨大な規模で集中・通過する都市です。都市を自然の外部ではなく、地球の代謝に責任を持つ人工的な器官として考える地点です。",
      relation: "06 人類世の傷跡 × 09 人工物の共生化 — 都市の効率を、周囲へ何を返すかという尺度で測り直す。",
    },
    {
      name: "SENDAI",
      nameJa: "仙台・三陸沿岸",
      lon: 140.87,
      lat: 38.27,
      description: "海、川、平野、都市が接する沿岸域です。災害の記憶、防災、土地利用、生態系の回復を、別々の課題ではなく重なる時間として読む地点です。",
      relation: "07 災いと恵み × 08 三つの生態系 — 観測技術と地域の記憶を結び、被害を弱い立場へ集中させない。",
    },
    {
      name: "NEMURO",
      nameJa: "根室・道東",
      lon: 145.58,
      lat: 43.33,
      description: "寒流、湿原、漁業、渡り鳥など、国境を越える流れが地域の暮らしを形づくる場所です。地図上の端ではなく、海と生物の循環が交差する入口として置いています。",
      relation: "02 青い循環系 × 04 共進化プロトコル — 海流と生物移動がつくる、領域を越えた相互依存を読む。",
    },
  ];

  const JMA_EVENT_TITLES = {
    20110311144618: "東北地方太平洋沖地震",
    20160416012505: "熊本地震",
    20180906030759: "北海道胆振東部地震",
    20240101161022: "能登半島地震",
    20240417231448: "豊後水道の地震",
    20240808164255: "日向灘の地震",
  };

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

  const modeConcepts = {
    "breathing-earth": {
      lead:
        "地球を、背景に置かれた青い球ではなく、無数の循環を重ねながら応答する一つの生命的システムとして捉え直すための入口です。",
      seeing:
        "画面中央の膜は、海・大気・岩石・生物圏を分ける境界であると同時に、それらを結ぶ呼吸面です。一定に見える周期の内側には、ゆらぎ、脈動、遅れて現れる波が重なっています。地球の安定とは停止ではなく、変化を受け止めながら均衡をつくり直す動的な状態だという見方を、ひとつの呼吸として可視化しています。",
      touch:
        "指先は命令を入力するコントローラーではなく、地球へ問いを差し出す感覚器です。触れた場所だけが光るのではなく、波が移動し、少し遅れて別の場所から返るように設計しました。自分の行為と結果のあいだに距離や時間差があることを、身体で感じるためです。",
      context:
        "共創地球論が示すのは、人間だけが主体で、自然が受動的な資源だという構図からの転換です。この窓では、地球にも固有の時間、限界、応答の仕方があると考えます。持続可能性とは地球を完全に管理することではなく、その反応を聴き、自分たちの行為を調整し続ける関係の技法です。",
      question: "あなたは地球を操作したいですか。それとも、まず応答を聴けますか。",
    },
    "blue-circulation": {
      lead:
        "海は風景ではなく、熱・水・炭素・生命を地球規模で運び、気候の急激な偏りを和らげる巨大な循環器です。",
      seeing:
        "幾層もの青い流線は、海流、上空の風、水蒸気、熱輸送を一つの連続した流体として表現しています。流れは同じ方向へ揃わず、渦をつくり、ぶつかり、遠く離れた場所へ影響を運びます。目の前の水面だけで完結しない海の働きを、惑星の血流のような運動へ置き換えました。",
      touch:
        "触れると局所的な圧力差が生まれ、周囲の流れがそれをすぐ消去せず、迂回しながらゆっくり均していきます。ひとつの介入が流域や海域を越えて伝わること、そして環境への働きかけには見えない下流が存在することを示すインタラクションです。",
      context:
        "共創地球論では、地球のシステムは部分ごとに切り離せず、循環の連鎖として理解する必要があります。水不足、海洋温暖化、豪雨、漁業、都市の消費は別々の問題ではありません。循環を止めず、負荷を一か所へ押しつけず、流れ全体の回復力を高める設計こそが、自然とテクノロジーの共創になります。",
      question: "あなたの暮らしから流れ出たものは、どの海、どの未来へ届くでしょう。",
    },
    "forest-cloud-engine": {
      lead:
        "森を木の集合としてではなく、土壌・菌類・植物・大気が共同で気候をつくる生きたインフラとして読み替える窓です。",
      seeing:
        "下層の細い網は菌糸と根、中央の柱は幹、上層の粒子は樹冠から立ち上る水蒸気を示します。地下の交換と地上の蒸散は連続しており、森は水を蓄えるだけでなく、雲や雨の条件そのものに関わります。見えにくい相互扶助が、地域の気候を支える装置として働いている様子です。",
      touch:
        "触れた場所から光が一本だけ伸びるのではなく、地下と上空の複数の層へ分岐します。木を一本の所有物として扱う視線から、関係網の一部として触れる感覚へ移るためです。強く速くなぞるほど応答が複雑になり、単純な制御では全体を読めないことも表します。",
      context:
        "共創地球論の『エッセンシャル・ワーカーとしての自然』という視点に立てば、森の価値は木材や吸収量だけでは測れません。菌類、昆虫、微生物、植物が担う無償の仕事を認識し、人間の技術や経済をその働きを壊さない形へ組み替えることが重要です。保全とは静止画を保存することではなく、関係が更新され続ける条件を守ることです。",
      question: "森が提供する見えない仕事に、私たちはどう報いることができるでしょう。",
    },
    "pollination-protocol": {
      lead:
        "花と虫の出会いを、生物同士が長い時間をかけて互いを変え合ってきた『共進化の通信規約』として描きます。",
      seeing:
        "花弁のパターンと移動する光点は、植物と送粉者が交換する色、匂い、蜜、花粉の信号です。どちらか一方だけでは次の形は生まれず、異なる存在が接触した場所でだけ色彩が増えます。生命の多様性が、孤立した強者ではなく、うまく噛み合う関係から生まれることを示しています。",
      touch:
        "指の軌跡は、出会いを強制する線ではなく、偶然が起こりやすい『場』を一時的につくります。触れ続けても全画面を同じ模様にはできません。相手の自由と差異を残したまま、接触の条件だけを整えることが、共創における人間の役割だと考えたからです。",
      context:
        "共創地球論では、進化や革新を単独の主体の成果ではなく、複数種の相互作用として捉えます。農業や都市のテクノロジーも、送粉者を代替して終わるのではなく、生息地、季節、農薬、移動経路まで含む関係を再設計する必要があります。効率だけではなく、出会いの余白を残すことが未来の生産性を支えます。",
      question: "違いを消さずに、出会いが生まれる条件をどう設計しますか。",
    },
    "nothing-is-waste": {
      lead:
        "自然界では、ある生命の終わりや排出物が、別の生命の材料へ変換されます。『廃棄』を終点ではなく途中の状態として見る窓です。",
      seeing:
        "回転する破片は、落葉、死骸、排泄物、鉱物、有機物を抽象化したものです。それらは消えることなく、細かく分解され、円環の別の層へ渡され、新しい構造に組み込まれます。美しい循環だけでなく、分解に必要な時間と、変換を担う無数の生物の仕事も、遅い運動として残しています。",
      touch:
        "触れると破片の経路が変わり、別の循環へ接続されますが、瞬時に無害化されるわけではありません。人間の技術ができるのは、ごみを魔法のように消すことではなく、素材を次の利用者へ渡せる形に整え、循環から漏れ出す量を減らすことだという表現です。",
      context:
        "共創地球論の循環的な世界観では、人間も分解者、修復者、媒介者として生態系の仕事に参加できます。製品の設計、回収、修理、再利用を別工程に分断せず、誕生から次の誕生までを一つの物語として考える。循環経済は標語ではなく、誰がどの変換を担うかを具体化する社会設計です。",
      question: "あなたが捨てたものの『次の利用者』を、設計段階で想像できますか。",
    },
    "anthropocene-scar": {
      lead:
        "人間活動が地球の地層や循環に刻む圧力を直視しつつ、罪悪感だけで終わらず、別の秩序へ編み直す余地を探ります。",
      seeing:
        "直線的な格子は道路、採掘、物流、行政区分、データセンターなど、人間が効率のために敷いたシステムです。その下を流れる有機的な線は、水や生命の地形です。二つが衝突した場所には赤い傷が残り、過去の選択が現在の風景へ蓄積していることを表します。",
      touch:
        "指で触れても傷は消えません。その周囲に別の流れが生まれ、硬い格子の一部が生態的なパターンへほどけていきます。修復とは過去をなかったことにする演出ではなく、残された条件を引き受けながら、次の選択肢を増やす継続的な行為だと位置づけています。",
      context:
        "『人類世』という言葉は、人類全員を同じ加害者にするためではなく、地球規模の影響力と責任の偏りを可視化するために使えます。共創地球論の観点では、テクノロジーを捨てるか推進するかの二択ではありません。誰のための効率か、どの生命へ負荷が移るかを問い直し、人工システムを地球の循環へ接続し直すことが課題です。",
      question: "消せない傷跡を、次の共創の入口へ変えるには何が必要でしょう。",
    },
    "rhythm-of-disaster": {
      lead:
        "火山、地震、洪水、山火事のような変動を、単なる異常ではなく、地球が長期的に形を更新するリズムとして考える窓です。",
      seeing:
        "地層を横切る断層と周期的な衝撃波は、蓄積されたエネルギーの解放を表します。波が過ぎたあとには、小さな緑の点が異なる場所から芽生えます。攪乱が常に善だと言うのではなく、破壊と再生が同じ時間軸には収まらず、生態系が変化を材料に多様性を組み直す場面を描いています。",
      touch:
        "触れると新しい衝撃が加わりますが、その色は時間とともに災いの橙から再生の緑へ移ります。重要なのは、衝撃を楽しむことではなく、自分の介入もまた誰かにとっての攪乱になり得ると知ることです。触れたあとの変化まで待つことで、短期の反応だけで判断しない態度を促します。",
      context:
        "共創地球論は、変動を完全に排除する文明から、変動を観測し、被害を減らし、回復の余地を残す文明への転換を問いかけます。ただし自然災害と人為的な環境破壊を同一視してはいけません。地球のリズムを理解することは、予測技術、防災、土地利用、地域の記憶を結び、弱い立場へ被害を集中させないための共創です。",
      question: "変化を止められないとき、私たちは何を守り、何を変えるべきでしょう。",
    },
    "three-ecologies": {
      lead:
        "環境の問題を、自然だけでなく、社会の関係と一人ひとりの感覚まで含む三つの生態系として捉える窓です。",
      seeing:
        "緑は生態環境、青は社会的な制度や共同体、紫は精神や知覚の領域を示します。三つの波は異なる速度で広がり、重なる部分だけが白く明るくなります。どれか一層だけを改善しても、他の層とのずれが残れば全体は安定しないという構造を、干渉する波として表現しました。",
      touch:
        "ひとつの層へ触れた振動は、遅れて別の層を揺らします。自然保護の情報が制度を変え、制度の変化が安心感や価値観を変え、価値観が消費や投票を通じて再び環境へ返る。その循環に鑑賞者自身も含まれていることを、画面全体に残る余韻で示します。",
      context:
        "共創地球論にとって持続可能性は、二酸化炭素の数値だけでは完結しません。孤立、格差、疲労、想像力の枯渇が進めば、環境を守る社会的な力も失われます。生態・社会・精神を別部門にせず、互いを回復させる政策、地域活動、メディア、教育を組み合わせることが、長く続く変化の条件になります。",
      question: "環境・社会・心のうち、あなたの暮らしで最初に響かせるべき層はどこですか。",
    },
    "earth-organ": {
      lead:
        "都市、通信網、エネルギー設備を自然の反対物ではなく、地球の代謝へ参加し得る『新しい器官』として問い直します。",
      seeing:
        "規則的な都市格子のあいだを、血管や菌糸に似た柔らかな回路が伸びています。集中していた光は、時間とともに地域の小さな節点へ分散します。人工物を緑色に塗る表現ではなく、資源を集め、使い、捨てる一方向の装置が、循環し、修復し、周囲へ応答する器官へ変わる過程です。",
      touch:
        "触れた場所では硬いグリッドと有機的な流れが接続され、エネルギーが別の節点へ渡ります。操作の中心を一つ増やすのではなく、地域ごとに判断と回復力を分配する振る舞いです。テクノロジーの価値を、速度や規模だけでなく、周囲の生命をどれだけ生かすかで測り直します。",
      context:
        "共創地球論では、人間の技術も地球が生み出した物質と知性の延長にあります。だから人工か自然かを分けるだけでは足りません。建築、AI、電力網、交通が、水・熱・生物・地域文化の循環を感知し、それらの再生へ働くなら、都市は寄生的な装置から共生的な器官へ近づけます。問われるのは技術の有無ではなく、その代謝の設計です。",
      question: "あなたの街のテクノロジーは、何を吸い上げ、何を地域へ返していますか。",
    },
    "senseware-2050": {
      lead:
        "九つの窓で残した触覚の記憶を束ね、正解を予言するのではなく、この鑑賞者と地球が共につくった一時的な未来像を立ち上げます。",
      seeing:
        "中央の球体には、これまで触れた各モードの強さが九つの節点として再配置されます。線の密度、光の偏り、呼吸の大きさはセッションごとに異なります。未来を完成済みの設計図として表示するのではなく、過去の関わり方が可能性の分布を変える、生成途中の地球として描いています。",
      touch:
        "最後のタッチは作品を完成させる署名ではありません。九つの記憶へ新しい波を重ね、全体をもう一度揺らします。鑑賞者は外から未来を選ぶ消費者ではなく、すでにその内部で影響を与えている参加者です。同時に、画面は思い通りには固定できず、人間以外の応答が未来に残ります。",
      context:
        "共創地球論が開く2050年は、単一の技術解決によって到達する場所ではありません。自然の働きを聴くこと、循環をつなぎ直すこと、社会と心を同時にケアすること、攪乱に備えること。それらを複数の主体が更新し続けるプロセスです。この窓は、テクノロジーを地球サイズの感覚器＝センスウェアとして使えるかを問いかけます。",
      question: "未来を予測するだけでなく、応答を聴きながら共につくる準備はできていますか。",
    },
  };

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
  const conceptModeButtons = [];
  const japanTileElements = new Map();
  const japanPulses = [];
  let japanEarthquakes = [];
  let japanHistoryEvents = [];
  let trailCursor = 0;
  let previousTrailX = -10;
  let previousTrailY = -10;
  let lastTrailAt = 0;
  let animationFrame = 0;
  let startTime = performance.now();
  let hiddenAt = 0;
  let hiddenDuration = 0;
  let sourceIsOpen = false;
  let conceptIsOpen = false;
  let introIsOpen = false;
  let introRestoreFocus = false;
  let introCloseTimer = 0;
  let japanIsOpen = false;
  let japanDataIsOpen = false;
  let japanRestoreFocus = true;
  let japanCloseTimer = 0;
  let japanTilesDirty = true;
  let japanTileErrors = 0;
  let japanEarthquakeDataState = "idle";
  let japanHistoryDataState = "idle";
  let japanDataLayer = "history";
  let japanDataUpdatedAt = null;
  let japanHistoryUpdatedAt = null;
  let selectedJapanPoi = null;
  let japanWaveReplay = null;
  let japanPoiRevealTimer = 0;
  let japanDeepLinkHandled = false;
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
    const nextZoom = window.innerWidth <= 720 ? JAPAN_MOBILE_ZOOM : JAPAN_ZOOM;
    const center = lonLatToWorld(136.4, 36.2, nextZoom);
    japanView.zoom = nextZoom;
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

  const getJmaEventTitle = (event) => JMA_EVENT_TITLES[event.id] || event.name;
  const getMaximumIntensityText = (event) =>
    String(event.maximumIntensity || "—").normalize("NFKC");
  const getIntensityColor = (intensityCode, alpha = 1) => {
    if (intensityCode === "7") {
      return `rgba(255, 80, 121, ${alpha})`;
    }
    if (intensityCode === "D") {
      return `rgba(255, 141, 72, ${alpha})`;
    }
    return `rgba(255, 209, 102, ${alpha})`;
  };
  const getIntensityShortLabel = (intensityCode) =>
    intensityCode === "7" ? "7" : intensityCode === "D" ? "6+" : "6-";

  const toRadians = (degrees) => (degrees * Math.PI) / 180;
  const toDegrees = (radians) => (radians * 180) / Math.PI;
  const getSurfaceDistanceKm = (lonA, latA, lonB, latB) => {
    const latitudeA = toRadians(latA);
    const latitudeB = toRadians(latB);
    const latitudeDelta = latitudeB - latitudeA;
    const longitudeDelta = toRadians(lonB - lonA);
    const haversine =
      Math.sin(latitudeDelta / 2) ** 2 +
      Math.cos(latitudeA) * Math.cos(latitudeB) * Math.sin(longitudeDelta / 2) ** 2;
    return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(haversine)));
  };
  const getDestinationLonLat = (lon, lat, bearingDegrees, distanceKm) => {
    const angularDistance = distanceKm / EARTH_RADIUS_KM;
    const bearing = toRadians(bearingDegrees);
    const latitude = toRadians(lat);
    const longitude = toRadians(lon);
    const destinationLatitude = Math.asin(
      Math.sin(latitude) * Math.cos(angularDistance) +
        Math.cos(latitude) * Math.sin(angularDistance) * Math.cos(bearing),
    );
    const destinationLongitude =
      longitude +
      Math.atan2(
        Math.sin(bearing) * Math.sin(angularDistance) * Math.cos(latitude),
        Math.cos(angularDistance) - Math.sin(latitude) * Math.sin(destinationLatitude),
      );
    return {
      lon: ((toDegrees(destinationLongitude) + 540) % 360) - 180,
      lat: toDegrees(destinationLatitude),
    };
  };
  const getSurfaceWaveRadiusKm = (travelDistanceKm, depthKm) =>
    Math.sqrt(Math.max(0, travelDistanceKm ** 2 - depthKm ** 2));
  const drawGeodesicWaveRing = (
    ctx,
    event,
    radiusKm,
    left,
    top,
    strokeStyle,
    lineWidth,
  ) => {
    if (radiusKm <= 0 || radiusKm > JAPAN_WAVE_VISUAL_LIMIT_KM) {
      return null;
    }
    let labelPoint = null;
    ctx.beginPath();
    for (let bearing = 0; bearing <= 360; bearing += 5) {
      const destination = getDestinationLonLat(
        event.longitude,
        event.latitude,
        bearing,
        radiusKm,
      );
      const point = japanWorldToScreen(destination.lon, destination.lat, left, top);
      if (bearing === 0) {
        ctx.moveTo(point.x, point.y);
      } else {
        ctx.lineTo(point.x, point.y);
      }
      if (bearing === 75) {
        labelPoint = point;
      }
    }
    ctx.closePath();
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
    return labelPoint;
  };

  const renderJapanHistoryReplay = (ctx, rect, left, top, now) => {
    if (japanDataLayer !== "history" || japanWaveReplay?.kind !== "history") {
      return;
    }

    const event = japanWaveReplay.event;
    const source = japanWorldToScreen(event.longitude, event.latitude, left, top);
    const elapsedSeconds = reducedMotion
      ? Number.POSITIVE_INFINITY
      : Math.max(0, now - japanWaveReplay.bornAt) / 1000;
    const pTravelDistanceKm = elapsedSeconds * P_WAVE_SPEED_KM_S;
    const sTravelDistanceKm = elapsedSeconds * S_WAVE_SPEED_KM_S;
    const pSurfaceRadiusKm = getSurfaceWaveRadiusKm(pTravelDistanceKm, event.depthKm);
    const sSurfaceRadiusKm = getSurfaceWaveRadiusKm(sTravelDistanceKm, event.depthKm);

    if (!reducedMotion) {
      const pLabelPoint = drawGeodesicWaveRing(
        ctx,
        event,
        pSurfaceRadiusKm,
        left,
        top,
        "rgba(121, 222, 255, 0.64)",
        1.3,
      );
      if (pLabelPoint) {
        ctx.fillStyle = "rgba(174, 235, 255, 0.88)";
        ctx.font = '7px Consolas, "Courier New", monospace';
        ctx.fillText("P / 7.0 KM/S", pLabelPoint.x + 6, pLabelPoint.y - 5);
      }

      const sLabelPoint = drawGeodesicWaveRing(
        ctx,
        event,
        sSurfaceRadiusKm,
        left,
        top,
        "rgba(255, 126, 97, 0.82)",
        1.8,
      );
      if (sLabelPoint) {
        ctx.fillStyle = "rgba(255, 184, 139, 0.92)";
        ctx.font = '7px Consolas, "Courier New", monospace';
        ctx.fillText("S / 4.0 KM/S", sLabelPoint.x + 6, sLabelPoint.y + 11);
      }
    }

    const sourcePulse = reducedMotion ? 4 : 4 + Math.sin(now * 0.012) * 1.5;
    ctx.beginPath();
    ctx.arc(source.x, source.y, sourcePulse, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255, 240, 209, 0.95)";
    ctx.fill();
    ctx.fillStyle = "rgba(255, 240, 209, 0.82)";
    ctx.font = '7px Consolas, "Courier New", monospace';
    ctx.fillText(
      reducedMotion
        ? `SOURCE / DEPTH ${event.depthKm} KM / STATIC`
        : `SOURCE / DEPTH ${event.depthKm} KM / T+${Math.floor(elapsedSeconds)}S`,
      source.x + 9,
      source.y + 15,
    );

    const occupiedLabelCells = new Set();
    let arrivedCount = 0;
    for (const observation of event.observations) {
      const point = japanWorldToScreen(
        observation.longitude,
        observation.latitude,
        left,
        top,
      );
      const surfaceDistanceKm = getSurfaceDistanceKm(
        event.longitude,
        event.latitude,
        observation.longitude,
        observation.latitude,
      );
      const hypocentralDistanceKm = Math.hypot(surfaceDistanceKm, event.depthKm);
      if (!reducedMotion && sTravelDistanceKm < hypocentralDistanceKm) {
        continue;
      }
      arrivedCount += 1;
      if (
        point.x < -24 ||
        point.x > rect.width + 24 ||
        point.y < -24 ||
        point.y > rect.height + 24
      ) {
        continue;
      }

      const arrival = reducedMotion
        ? 1
        : clamp((sTravelDistanceKm - hypocentralDistanceKm) / 24, 0.12, 1);
      const pointRadius = observation.intensityCode === "7" ? 5.2 : observation.intensityCode === "D" ? 4 : 3.2;
      ctx.beginPath();
      ctx.arc(point.x, point.y, pointRadius + (1 - arrival) * 7, 0, Math.PI * 2);
      ctx.fillStyle = getIntensityColor(observation.intensityCode, 0.32 + arrival * 0.58);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(point.x, point.y, pointRadius + 5 + (1 - arrival) * 8, 0, Math.PI * 2);
      ctx.strokeStyle = getIntensityColor(observation.intensityCode, 0.12 + arrival * 0.28);
      ctx.lineWidth = 0.8;
      ctx.stroke();

      const cell = `${Math.round(point.x / 58)}:${Math.round(point.y / 30)}`;
      if (observation.intensityCode === "7" || !occupiedLabelCells.has(cell)) {
        occupiedLabelCells.add(cell);
        ctx.fillStyle = getIntensityColor(observation.intensityCode, 0.9);
        ctx.font = '7px Consolas, "Courier New", monospace';
        ctx.fillText(getIntensityShortLabel(observation.intensityCode), point.x + 7, point.y - 5);
      }
    }
    japanWaveReplay.arrivedCount = arrivedCount;
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

    renderJapanHistoryReplay(ctx, rect, left, top, now);

    if (japanDataLayer === "live") {
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
    } else {
      japanHistoryEvents.forEach((event, index) => {
        const point = japanWorldToScreen(event.longitude, event.latitude, left, top);
        if (
          point.x < -34 ||
          point.x > rect.width + 34 ||
          point.y < -34 ||
          point.y > rect.height + 34
        ) {
          return;
        }

        const isSelected = selectedJapanPoi?.type === "history" && selectedJapanPoi.event.id === event.id;
        const phase = reducedMotion ? 0.4 : 0.5 + Math.sin(now * 0.0012 + index * 0.9) * 0.5;
        const maximumIntensity = getMaximumIntensityText(event);
        const radius = maximumIntensity === "7" ? 6.2 : 5;
        const colorCode = maximumIntensity === "7" ? "7" : "C";
        ctx.beginPath();
        ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = getIntensityColor(colorCode, isSelected ? 1 : 0.82);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(point.x, point.y, radius + 5 + phase * (isSelected ? 8 : 4), 0, Math.PI * 2);
        ctx.strokeStyle = getIntensityColor(colorCode, isSelected ? 0.62 : 0.24);
        ctx.lineWidth = isSelected ? 1.5 : 0.8;
        ctx.stroke();
        ctx.fillStyle = getIntensityColor(colorCode, isSelected ? 1 : 0.72);
        ctx.font = '7px Consolas, "Courier New", monospace';
        ctx.fillText(
          `${String(event.occurredAt).slice(0, 4)} / ${maximumIntensity}`,
          point.x + radius + 6,
          point.y - 6,
        );
      });
    }

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
      if (japanView.zoom >= JAPAN_ZOOM || index % 2 === 0) {
        ctx.fillText(node.name, node.x + 10, node.y - 7);
      }
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
        ctx.strokeStyle = `rgba(126, 221, 255, ${disturbanceAlpha})`;
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
        japanMapStatus.textContent = "QUESTION SENT / CONNECTING TO A LISTENING NODE";
      } else {
        japanMapStatus.textContent = "CO-CREATION SIGNAL / RELATION TRACE ACTIVE";
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
    if (japanDataLayer === "history") {
      if (japanHistoryDataState === "loading") {
        return "JMA HISTORY / LOADING OBSERVED INTENSITY";
      }
      if (japanHistoryDataState === "ready") {
        const observationCount = japanHistoryEvents.reduce(
          (total, event) => total + event.observations.length,
          0,
        );
        if (selectedJapanPoi?.type === "history") {
          const siteCount = selectedJapanPoi.event.observations.length;
          if (reducedMotion) {
            return `JMA OBSERVED INTENSITY / ${siteCount} SITES / STATIC ACCESSIBLE VIEW`;
          }
          const elapsedSeconds = japanWaveReplay
            ? Math.max(0, performance.now() - japanWaveReplay.bornAt) / 1000
            : 0;
          return `REAL TIME T+${Math.floor(elapsedSeconds)}S / P 7.0 KM/S / S 4.0 KM/S / ${
            japanWaveReplay?.arrivedCount || 0
          }/${siteCount} SITES`;
        }
        return `JMA HISTORY / ${japanHistoryEvents.length} EVENTS / ${observationCount} INTENSITY 6-7 SITES`;
      }
      if (japanHistoryDataState === "offline") {
        return "JMA HISTORY OFFLINE / ARTISTIC POI REMAIN AVAILABLE";
      }
      return "JMA HISTORY / STANDBY";
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

  const formatJapanDataTime = (value) => {
    if (!value) {
      return "UPDATED —";
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return "UPDATED —";
    }
    return `UPDATED ${new Intl.DateTimeFormat("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Tokyo",
      timeZoneName: "short",
    }).format(date)}`;
  };

  const updateJapanDataInterface = () => {
    if (japanHistoryDataState === "loading") {
      japanHistoryState.textContent = "過去の震度：気象庁データを読み込み中";
    } else if (japanHistoryDataState === "ready") {
      const observationCount = japanHistoryEvents.reduce(
        (total, event) => total + event.observations.length,
        0,
      );
      japanHistoryState.textContent = `過去の震度：読み込み済み（代表${japanHistoryEvents.length}地震・${observationCount}地点）`;
    } else if (japanHistoryDataState === "offline") {
      japanHistoryState.textContent = "過去の震度：読み込めませんでした";
    } else {
      japanHistoryState.textContent = "過去の震度：日本モードを開くと読み込みます";
    }
    japanHistoryUpdated.textContent = japanHistoryUpdatedAt
      ? `保存データ作成日：${formatJapanDataTime(japanHistoryUpdatedAt).replace("UPDATED ", "")}`
      : "保存データ作成日：—";

    if (japanEarthquakeDataState === "loading") {
      japanDataState.textContent = "直近の震源：USGSから取得中";
    } else if (japanEarthquakeDataState === "live") {
      japanDataState.textContent = `直近の震源：USGSから取得済み（${japanEarthquakes.length}件）`;
    } else if (japanEarthquakeDataState === "snapshot") {
      japanDataState.textContent = `直近の震源：保存データを表示中（${japanEarthquakes.length}件）`;
    } else if (japanEarthquakeDataState === "offline") {
      japanDataState.textContent = "直近の震源：現在表示できません";
    } else {
      japanDataState.textContent = "直近の震源：日本モードを開くと取得します";
    }
    japanDataUpdated.textContent = japanDataUpdatedAt
      ? `取得日時：${formatJapanDataTime(japanDataUpdatedAt).replace("UPDATED ", "")}`
      : "取得日時：—";
  };

  const setJapanDataLayer = (layer) => {
    japanDataLayer = layer === "live" ? "live" : "history";
    japanHistoryLayerButton.setAttribute(
      "aria-pressed",
      japanDataLayer === "history" ? "true" : "false",
    );
    japanLiveLayerButton.setAttribute(
      "aria-pressed",
      japanDataLayer === "live" ? "true" : "false",
    );
    closeJapanPoi();
    if (japanDataLayer === "history") {
      japanObservationKicker.textContent = "JMA HISTORY / SHINDO 6-JAKU+";
      japanObservationCopy.textContent =
        "地震を選ぶとP波7 km/s・S波4 km/sを1秒=1秒で再生し、S波の計算到達時に実測震度地点が立ち上がる。";
    } else {
      japanObservationKicker.textContent = "USGS LIVE / M2.5+ / 7 DAYS";
      japanObservationCopy.textContent =
        "直近7日間の震源を表示。点を選ぶと、位置・規模・深さ・発生時刻を読むことができる。";
    }
    japanMapStatus.textContent = getJapanObservationStatus();
  };

  const formatJapanEventTime = (value) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return String(value).replace("T", " ").replace("+09:00", " JST");
    }
    return new Intl.DateTimeFormat("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Tokyo",
      timeZoneName: "short",
    }).format(date);
  };

  const closeJapanPoi = ({ restoreFocus = false } = {}) => {
    window.clearTimeout(japanPoiRevealTimer);
    japanPoiRevealTimer = 0;
    if (!selectedJapanPoi) {
      return;
    }
    selectedJapanPoi = null;
    japanWaveReplay = null;
    japanPoiCard.hidden = true;
    japanPoiCard.setAttribute("aria-hidden", "true");
    japanLayer.classList.remove("japan-poi-open");
    if (restoreFocus) {
      japanMap.focus({ preventScroll: true });
    }
  };

  const positionJapanPoiCard = (clientX, clientY) => {
    if (window.innerWidth <= 720) {
      japanPoiCard.style.removeProperty("left");
      japanPoiCard.style.removeProperty("top");
      return;
    }
    const layerRect = japanLayer.getBoundingClientRect();
    const cardWidth = Math.min(370, layerRect.width - 40);
    const cardHeight = Math.min(japanPoiCard.offsetHeight || 330, layerRect.height - 40);
    const localX = clientX - layerRect.left;
    const localY = clientY - layerRect.top;
    const left = clamp(
      localX + 22 + cardWidth > layerRect.width ? localX - cardWidth - 22 : localX + 22,
      20,
      layerRect.width - cardWidth - 20,
    );
    const top = clamp(localY - 70, 20, layerRect.height - cardHeight - 20);
    japanPoiCard.style.left = `${left}px`;
    japanPoiCard.style.top = `${top}px`;
  };

  const showJapanPoiCard = (clientX, clientY, { focusClose = true } = {}) => {
    japanPoiCard.hidden = false;
    japanPoiCard.setAttribute("aria-hidden", "false");
    japanLayer.classList.add("japan-poi-open");
    requestAnimationFrame(() => {
      positionJapanPoiCard(clientX, clientY);
      if (focusClose) {
        japanPoiClose.focus({ preventScroll: true });
      }
    });
  };

  const openJapanPoi = (poi, clientX, clientY) => {
    window.clearTimeout(japanPoiRevealTimer);
    japanPoiRevealTimer = 0;
    selectedJapanPoi = poi;
    japanPoiCard.hidden = true;
    japanPoiCard.setAttribute("aria-hidden", "true");
    japanLayer.classList.remove("japan-poi-open");

    if (poi.type === "history") {
      const event = poi.event;
      japanPoiType.textContent = "JMA HISTORY / REAL-TIME REPRESENTATIVE MODEL";
      japanPoiTitle.textContent = `${String(event.occurredAt).slice(0, 4)} ${getJmaEventTitle(event)}`;
      japanPoiMeta.textContent = `${formatJapanEventTime(event.occurredAt)} / M${event.magnitude.toFixed(
        1,
      )} / DEPTH ${event.depthKm} KM / 最大震度 ${getMaximumIntensityText(
        event,
      )} / P 7.0・S 4.0 KM/S`;
      japanPoiDescription.textContent =
        `気象庁の震度データベースから、この地震で震度6弱・6強・7を実際に観測した${event.observations.length}地点を収録しています。色は黄=6弱、橙=6強、赤紫=7です。震度はマグニチュードから推定した値ではありません。`;
      japanPoiRelation.textContent =
        "気象庁の一般向け解説に基づく代表速度P波7 km/s・S波4 km/sを、1秒=1秒で再生しています。震央から観測点までの地表距離と震源深さから直線的な震源距離を求め、S波の計算到達時に実測震度点を表示します。実際の速度は地質・深さ・経路で変わるため、これは観測到達時刻や緊急地震速報の予測ではありません。";
      japanWaveReplay = {
        kind: "history",
        event,
        bornAt: performance.now(),
        arrivedCount: 0,
      };
      japanMapStatus.textContent = getJapanObservationStatus();
      const revealDelay = reducedMotion ? 0 : JAPAN_HISTORY_CARD_DELAY;
      japanPoiRevealTimer = window.setTimeout(() => {
        japanPoiRevealTimer = 0;
        if (japanIsOpen && selectedJapanPoi === poi) {
          showJapanPoiCard(clientX, clientY, { focusClose: reducedMotion });
        }
      }, revealDelay);
    } else if (poi.type === "earthquake") {
      const event = poi.event;
      japanPoiType.textContent = "USGS OBSERVATION / EARTH SIGNAL";
      japanPoiTitle.textContent = `M${event.magnitude.toFixed(1)} / ${event.place}`;
      japanPoiMeta.textContent = `${formatJapanEventTime(event.time)} / DEPTH ${Math.round(
        event.depthKm,
      )} KM`;
      japanPoiDescription.textContent =
        "橙の点はUSGS GeoJSONから取得した震源の観測値です。円の大きさはマグニチュード、濃さは深さを手がかりにした表示ですが、揺れの強さや被害範囲を示すものではありません。";
      japanPoiRelation.textContent =
        "LIVEレイヤーは『いま地球がどこで動いているか』を読む入口です。このフィードには各地の震度を重ねていないため、P/S波や揺れの広がりは再生しません。観測されていない意味を足さないことも、センスウェアの設計に含めています。";
      japanWaveReplay = null;
      showJapanPoiCard(clientX, clientY);
    } else {
      const node = poi.node;
      japanPoiType.textContent = "CURATED LISTENING NODE / ARTISTIC POI";
      japanPoiTitle.textContent = node.nameJa;
      japanPoiMeta.textContent = `${node.name} / ${node.lat.toFixed(2)}°N ${node.lon.toFixed(2)}°E`;
      japanPoiDescription.textContent = node.description;
      japanPoiRelation.textContent = node.relation;
      japanWaveReplay = null;
      showJapanPoiCard(clientX, clientY);
    }
  };

  const findJapanPoiAt = (clientX, clientY) => {
    const { rect, left, top } = getJapanViewport();
    const localX = clientX - rect.left;
    const localY = clientY - rect.top;
    let closest = null;

    if (japanDataLayer === "history") {
      japanHistoryEvents.forEach((event, index) => {
        const point = japanWorldToScreen(event.longitude, event.latitude, left, top);
        const distance = Math.hypot(localX - point.x, localY - point.y);
        if (distance <= 25 && (!closest || distance < closest.distance)) {
          closest = { type: "history", event, index, distance };
        }
      });
    } else {
      japanEarthquakes.forEach((event, index) => {
        const point = japanWorldToScreen(event.longitude, event.latitude, left, top);
        const distance = Math.hypot(localX - point.x, localY - point.y);
        if (distance <= 19 && (!closest || distance < closest.distance)) {
          closest = { type: "earthquake", event, index, distance };
        }
      });
    }

    if (!closest) {
      JAPAN_NODES.forEach((node, index) => {
        const point = japanWorldToScreen(node.lon, node.lat, left, top);
        const distance = Math.hypot(localX - point.x, localY - point.y);
        if (distance <= 18 && (!closest || distance < closest.distance)) {
          closest = { type: "node", node, index, distance };
        }
      });
    }

    return closest;
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

  const maybeOpenJapanEventFromUrl = () => {
    if (japanDeepLinkHandled || !japanIsOpen || japanHistoryDataState !== "ready") {
      return;
    }
    const eventId = new URLSearchParams(window.location.search).get("event");
    const event = japanHistoryEvents.find((candidate) => candidate.id === eventId);
    if (!event) {
      return;
    }
    japanDeepLinkHandled = true;
    setJapanDataLayer("history");
    requestAnimationFrame(() => {
      const { rect, left, top } = getJapanViewport();
      const point = japanWorldToScreen(event.longitude, event.latitude, left, top);
      openJapanPoi(
        { type: "history", event },
        rect.left + clamp(point.x, 24, rect.width - 24),
        rect.top + clamp(point.y, 24, rect.height - 24),
      );
    });
  };

  const loadJapanHistory = async () => {
    if (japanHistoryDataState === "loading" || japanHistoryDataState === "ready") {
      maybeOpenJapanEventFromUrl();
      return;
    }
    japanHistoryDataState = "loading";
    updateJapanDataInterface();
    japanMapStatus.textContent = getJapanObservationStatus();
    try {
      const data = await fetchJsonWithTimeout(JMA_HISTORY_DATA, 3500);
      if (!Array.isArray(data.events)) {
        throw new Error("Invalid JMA history payload");
      }
      japanHistoryEvents = data.events.filter(
        (event) =>
          Number.isFinite(event.longitude) &&
          Number.isFinite(event.latitude) &&
          Array.isArray(event.observations),
      );
      japanHistoryUpdatedAt = data.retrievedAt || null;
      japanHistoryDataState = "ready";
    } catch {
      japanHistoryEvents = [];
      japanHistoryUpdatedAt = null;
      japanHistoryDataState = "offline";
    }
    updateJapanDataInterface();
    japanMapStatus.textContent = getJapanObservationStatus();
    maybeOpenJapanEventFromUrl();
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
    japanDataUpdatedAt = null;
    updateJapanDataInterface();
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
      japanDataUpdatedAt = data.metadata?.generated || Date.now();
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
        japanDataUpdatedAt = fallback.retrievedAt || null;
      } catch {
        japanEarthquakes = [];
        japanEarthquakeDataState = "offline";
        japanDataUpdatedAt = null;
      }
    }

    updateJapanDataInterface();

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

  const renderConcept = () => {
    const mode = modes[modeToIndex];
    const concept = modeConcepts[mode.id];
    const position = `${formatModeNumber(modeToIndex)} / ${MODE_COUNT}`;

    conceptNumber.textContent = position;
    conceptPosition.textContent = position;
    conceptTitle.textContent = mode.titleJa;
    conceptTitleEn.textContent = mode.title;
    conceptLead.textContent = concept.lead;
    conceptSeeing.textContent = concept.seeing;
    conceptTouch.textContent = concept.touch;
    conceptContext.textContent = concept.context;
    conceptQuestion.textContent = concept.question;
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
    conceptModeButtons.forEach((button, index) => {
      button.setAttribute("aria-current", index === modeToIndex ? "true" : "false");
    });

    renderSource();
    renderConcept();
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
    if (conceptIsOpen) {
      conceptScroll.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
    }
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

    const conceptButton = document.createElement("button");
    conceptButton.className = "concept-mode-button";
    conceptButton.type = "button";
    conceptButton.textContent = formatModeNumber(index);
    conceptButton.setAttribute(
      "aria-label",
      `${formatModeNumber(index)} ${mode.titleJa}の解説を読む`,
    );
    conceptButton.setAttribute("aria-current", index === 0 ? "true" : "false");
    conceptButton.addEventListener("click", () => {
      selectMode(index);
      conceptScroll.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
    });
    conceptModeButtons.push(conceptButton);
    conceptModeList.append(conceptButton);
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
      const poi = findJapanPoiAt(event.clientX, event.clientY);
      if (poi) {
        openJapanPoi(poi, event.clientX, event.clientY);
      } else {
        closeJapanPoi();
        addJapanPulse(event.clientX, event.clientY);
      }
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
    if (conceptIsOpen) {
      closeConcept({ restoreFocus: false, updateHash: false });
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

  const updateConceptHash = (isOpen) => {
    const nextHash = isOpen ? "#concept" : "";
    if (window.location.hash === nextHash) {
      return;
    }
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${window.location.search}${nextHash}`,
    );
  };

  const openConcept = ({ updateHash = true } = {}) => {
    if (conceptIsOpen) {
      return;
    }
    if (sourceIsOpen) {
      closeSource({ restoreFocus: false, updateHash: false });
    }
    if (japanIsOpen) {
      closeJapan({ restoreFocus: false, updateHash: false });
    }
    if (introIsOpen) {
      closeIntro({ restoreFocus: false });
    }

    conceptIsOpen = true;
    experience.classList.add("concept-open");
    conceptOpen.setAttribute("aria-expanded", "true");
    conceptPanel.setAttribute("aria-hidden", "false");
    sourceScrim.setAttribute("aria-hidden", "false");
    conceptPanel.inert = false;
    renderConcept();
    conceptScroll.scrollTop = 0;
    if (updateHash) {
      updateConceptHash(true);
    }
    requestAnimationFrame(() => conceptClose.focus({ preventScroll: true }));
  };

  const closeConcept = ({ restoreFocus = true, updateHash = true } = {}) => {
    if (!conceptIsOpen) {
      return;
    }
    conceptIsOpen = false;
    experience.classList.remove("concept-open");
    conceptOpen.setAttribute("aria-expanded", "false");
    conceptPanel.setAttribute("aria-hidden", "true");
    sourceScrim.setAttribute("aria-hidden", "true");
    conceptPanel.inert = true;
    if (updateHash) {
      updateConceptHash(false);
    }
    if (restoreFocus) {
      conceptOpen.focus({ preventScroll: true });
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
    conceptOpen.disabled = disabled;
    resetButton.disabled = disabled;
    modeButtons.forEach((button) => {
      button.disabled = disabled;
    });
  };

  const openJapanData = () => {
    if (!japanIsOpen || japanDataIsOpen) {
      return;
    }
    japanDataIsOpen = true;
    japanDataPanel.inert = false;
    japanDataPanel.setAttribute("aria-hidden", "false");
    japanDataScrim.setAttribute("aria-hidden", "false");
    japanDataScrim.tabIndex = 0;
    japanDataButton.setAttribute("aria-expanded", "true");
    japanLayer.classList.add("japan-data-open");
    requestAnimationFrame(() => japanDataClose.focus({ preventScroll: true }));
  };

  const closeJapanData = ({ restoreFocus = true } = {}) => {
    if (!japanDataIsOpen) {
      return;
    }
    japanDataIsOpen = false;
    japanDataPanel.inert = true;
    japanDataPanel.setAttribute("aria-hidden", "true");
    japanDataScrim.setAttribute("aria-hidden", "true");
    japanDataScrim.tabIndex = -1;
    japanDataButton.setAttribute("aria-expanded", "false");
    japanLayer.classList.remove("japan-data-open");
    if (restoreFocus) {
      japanDataButton.focus({ preventScroll: true });
    }
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
    if (conceptIsOpen) {
      closeConcept({ restoreFocus: false, updateHash: false });
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
    const requestedDataLayer = new URLSearchParams(window.location.search).get("layer");
    setJapanDataLayer(requestedDataLayer === "live" ? "live" : japanDataLayer);
    updateJapanDataInterface();
    void loadJapanHistory();
    void loadJapanEarthquakes();

    if (updateHash) {
      updateJapanHash(true);
    }

    requestAnimationFrame(() => {
      renderJapanTiles();
      if (new URLSearchParams(window.location.search).get("panel") === "data") {
        openJapanData();
      } else {
        japanClose.focus({ preventScroll: true });
      }
    });
  };

  const closeJapan = ({
    restoreFocus = japanRestoreFocus,
    updateHash = true,
  } = {}) => {
    if (!japanIsOpen) {
      return;
    }

    closeJapanData({ restoreFocus: false });
    closeJapanPoi();
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
    if (conceptIsOpen) {
      closeConcept({ restoreFocus: false });
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
  conceptPanel.inert = true;
  introLayer.inert = true;
  japanLayer.inert = true;
  japanDataPanel.inert = true;
  japanButton.addEventListener("click", () => {
    if (japanIsOpen) {
      closeJapan();
    } else {
      openJapan();
    }
  });
  japanClose.addEventListener("click", () => closeJapan());
  japanDataButton.addEventListener("click", openJapanData);
  japanDataClose.addEventListener("click", () => closeJapanData());
  japanDataScrim.addEventListener("click", () => closeJapanData());
  japanPoiClose.addEventListener("click", () => closeJapanPoi({ restoreFocus: true }));
  japanHistoryLayerButton.addEventListener("click", () => setJapanDataLayer("history"));
  japanLiveLayerButton.addEventListener("click", () => setJapanDataLayer("live"));
  sourceButton.addEventListener("click", () => {
    if (sourceIsOpen) {
      closeSource();
    } else {
      openSource();
    }
  });
  sourceClose.addEventListener("click", () => closeSource());
  sourceScrim.addEventListener("click", () => {
    if (conceptIsOpen) {
      closeConcept();
    } else {
      closeSource();
    }
  });
  conceptOpen.addEventListener("click", () => {
    if (conceptIsOpen) {
      closeConcept();
    } else {
      openConcept();
    }
  });
  conceptClose.addEventListener("click", () => closeConcept());
  conceptPrevious.addEventListener("click", () => selectMode(modeToIndex - 1));
  conceptNext.addEventListener("click", () => selectMode(modeToIndex + 1));
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
      closeConcept({ restoreFocus: false, updateHash: false });
      openSource({ updateHash: false });
    } else if (window.location.hash === "#concept") {
      closeIntro({ remember: false, restoreFocus: false });
      closeJapan({ restoreFocus: false, updateHash: false });
      closeSource({ restoreFocus: false, updateHash: false });
      openConcept({ updateHash: false });
    } else if (window.location.hash === "#japan") {
      closeIntro({ remember: false, restoreFocus: false });
      closeSource({ restoreFocus: false, updateHash: false });
      closeConcept({ restoreFocus: false, updateHash: false });
      openJapan({ updateHash: false, restoreFocusOnClose: false });
    } else {
      closeSource({ restoreFocus: false, updateHash: false });
      closeConcept({ restoreFocus: false, updateHash: false });
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
      if (event.key === "Escape" && japanDataIsOpen) {
        closeJapanData();
      } else if (event.key === "Escape" && selectedJapanPoi) {
        closeJapanPoi({ restoreFocus: true });
      } else if (event.key === "Escape" || event.key.toLowerCase() === "j") {
        closeJapan();
      }
      return;
    }
    if (event.key === "Escape" && sourceIsOpen) {
      closeSource();
      return;
    }
    if (event.key === "Escape" && conceptIsOpen) {
      closeConcept();
      return;
    }
    if (sourceIsOpen || conceptIsOpen || event.ctrlKey || event.metaKey || event.altKey) {
      return;
    }
    if (event.key === "ArrowLeft") {
      selectMode(modeToIndex - 1);
    } else if (event.key === "ArrowRight") {
      selectMode(modeToIndex + 1);
    } else if (event.key.toLowerCase() === "c") {
      openSource();
    } else if (event.key.toLowerCase() === "n") {
      openConcept();
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
    const desiredJapanZoom = window.innerWidth <= 720 ? JAPAN_MOBILE_ZOOM : JAPAN_ZOOM;
    if (japanView.zoom !== desiredJapanZoom) {
      resetJapanView();
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
      !conceptIsOpen &&
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
  setJapanDataLayer("history");
  updateJapanDataInterface();
  updateModeInterface();
  updateAutoInterface();
  resize();
  startRendering();

  if (window.location.hash === "#source") {
    openSource({ updateHash: false });
  } else if (window.location.hash === "#concept") {
    openConcept({ updateHash: false });
  } else if (window.location.hash === "#japan") {
    openJapan({ updateHash: false, restoreFocusOnClose: false });
  } else if (!hasSeenIntro()) {
    openIntro({ restoreFocusOnClose: false });
  }
})();
