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
  const sourceLanguage = document.querySelector("#source-language");
  const sourceTabs = Array.from(document.querySelectorAll("[data-source-tab]"));
  const signalConsoles = Array.from(document.querySelectorAll("[data-signal-console]"));
  const signalTimeInputs = Array.from(document.querySelectorAll("[data-signal-time]"));
  const mapSignalEncodingLegend = document.querySelector("[data-signal-encoding-legend]");
  const introLayer = document.querySelector("#intro-layer");
  const introModeList = document.querySelector("#intro-mode-list");
  const introSelectionNumber = document.querySelector("#intro-selection-number");
  const introSelectionTitle = document.querySelector("#intro-selection-title");
  const introSelectionCopy = document.querySelector("#intro-selection-copy");
  const introArchitectureJump = document.querySelector("#intro-architecture-jump");
  const introArchitectureBack = document.querySelector("#intro-architecture-back");
  const architectureExhibit = document.querySelector("#architecture-exhibit");
  const introEnter = document.querySelector("#intro-enter");
  const introJapan = document.querySelector("#intro-japan");
  const introButton = document.querySelector("#intro-button");
  const japanButton = document.querySelector("#japan-button");
  const japanLayer = document.querySelector("#japan-layer");
  const japanMap = document.querySelector("#japan-map");
  const japanTiles = document.querySelector("#japan-tiles");
  const japanOverlay = document.querySelector("#japan-overlay");
  const japanMapStatus = document.querySelector("#japan-map-status");
  const mapScopeKicker = document.querySelector("#map-scope-kicker");
  const mapScopeNote = document.querySelector("#map-scope-note");
  const japanTitle = document.querySelector("#japan-title");
  const japanDescription = document.querySelector("#japan-description");
  const japanModeList = document.querySelector("#japan-mode-list");
  const japanModeNumber = document.querySelector("#japan-mode-number");
  const japanModeTitle = document.querySelector("#japan-mode-title");
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
  const co2TimelineDisplay = document.querySelector("#co2-timeline-display");
  const co2TimelinePhase = document.querySelector("#co2-timeline-phase");
  const co2TimelineYear = document.querySelector("#co2-timeline-year");
  const co2TimelinePpm = document.querySelector("#co2-timeline-ppm");
  const co2TimelineMethod = document.querySelector("#co2-timeline-method");
  const japanHistoryLayerButton = document.querySelector("#japan-history-layer");
  const japanLiveLayerButton = document.querySelector("#japan-live-layer");
  const historyLayerLabel = document.querySelector("#history-layer-label");
  const liveLayerLabel = document.querySelector("#live-layer-label");
  const japanPoiCard = document.querySelector("#japan-poi-card");
  const japanPoiClose = document.querySelector("#japan-poi-close");
  const japanPoiType = document.querySelector("#japan-poi-type");
  const japanPoiTitle = document.querySelector("#japan-poi-title");
  const japanPoiMeta = document.querySelector("#japan-poi-meta");
  const japanPoiDescription = document.querySelector("#japan-poi-description");
  const japanPoiRelation = document.querySelector("#japan-poi-relation");
  const dataLedger = window.GaiaDataLedger.create();

  const TRAIL_COUNT = 16;
  const MODE_COUNT = 10;
  const TRANSITION_DURATION = 1500;
  const AUTO_INTERVAL = 18000;
  const CO2_TIMELINE_START_YEAR = 1958;
  const CO2_TIMELINE_END_YEAR = 2050;
  const CO2_TIMELINE_DURATION_MS = 60000;
  const CO2_TIMELINE_STEPS_PER_YEAR = 4;
  const CO2_TIMELINE_MANUAL_PAUSE_MS = 8000;
  const CIRCULATION_TIMELINE_DURATION_MS = 45000;
  const CIRCULATION_TIMELINE_HOURS = 24 * 14;
  const CIRCULATION_TIMELINE_STEPS = 112;
  const MODE_SEQUENCE_DURATION_MS = 48000;
  const MODE_SEQUENCE_STEPS = 96;
  const MAP_TILE_SIZE = 256;
  const JAPAN_ZOOM = 5;
  const JAPAN_MOBILE_ZOOM = 4;
  const EARTH_ZOOM = 2;
  const EARTH_MOBILE_ZOOM = 1;
  const EARTH_RADIUS_KM = 6371;
  const P_WAVE_SPEED_KM_S = 7;
  const S_WAVE_SPEED_KM_S = 4;
  const JAPAN_WAVE_VISUAL_LIMIT_KM = 2500;
  const JAPAN_HISTORY_CARD_DELAY = 8000;
  const GAIA_SIGNALS_DATA = "./data/gaia-signals.json?v=gaia-22";
  const JMA_HISTORY_DATA = "./data/jma-intensity-history.json";
  const JAPAN_DATA_BOUNDS = {
    west: 122,
    east: 154,
    south: 20,
    north: 48,
  };
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const MAP_POI_HIT_RADII = {
    fine: { history: 34, earthquake: 30, node: 32 },
    coarse: { history: 46, earthquake: 42, node: 44 },
  };
  const japanContext = japanOverlay.getContext("2d");
  const gosatHeatmapCanvas = document.createElement("canvas");
  const gosatHeatmapContext = gosatHeatmapCanvas.getContext("2d");
  let gosatHeatmapCacheKey = "";
  const gosatImputedIndexCache = new WeakMap();

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

  const JMA_CO2_SITES = Object.freeze([
    {
      id: "ryori",
      title: "綾里 CO₂観測所",
      shortTitle: "綾里",
      lon: 141.82,
      lat: 39.03,
      valueKey: "ryoriPpm",
      flagKey: "ryoriFlag",
      note: "岩手県大船渡市。1987年から続く気象庁の大気CO₂観測地点です。",
    },
    {
      id: "minamitorishima",
      title: "南鳥島 CO₂観測所",
      shortTitle: "南鳥島",
      lon: 153.98,
      lat: 24.28,
      valueKey: "minamitorishimaPpm",
      flagKey: "minamitorishimaFlag",
      note: "日本の最東端にある海洋上の観測地点。1993年からの年平均値を表示します。",
    },
    {
      id: "yonagunijima",
      title: "与那国島 CO₂観測所",
      shortTitle: "与那国島",
      lon: 123.02,
      lat: 24.47,
      valueKey: "yonagunijimaPpm",
      flagKey: "yonagunijimaFlag",
      observationEnded: 2024,
      note: "日本の最西端に近い観測地点。観測は2024年3月末で終了したため、最新年は直近の有効値を表示します。",
    },
  ]);

  const EARTH_NODES = [
    {
      name: "AMAZON",
      nameJa: "アマゾン流域",
      lon: -60,
      lat: -3,
      description: "森林、大気、水循環、生物多様性、人間の暮らしが大陸規模で結ばれる場所です。遠く離れた消費と土地利用も、この循環へ参加しています。",
      relation: "03 森の気候装置 × 06 人類世の傷跡 — 森を資源の在庫ではなく、惑星の循環器官として読む。",
    },
    {
      name: "ARCTIC",
      nameJa: "北極圏",
      lon: 20,
      lat: 74,
      description: "氷、海、熱、大気の変化が地球全体へ連鎖する地域です。人の少ない遠隔地も、都市の選択と切り離されていません。",
      relation: "01 地球の一呼吸 × 08 三つの生態系 — 遠隔地の変化を自分たちの時間へ接続する。",
    },
    {
      name: "SAHEL",
      nameJa: "サヘル",
      lon: 15,
      lat: 15,
      description: "乾燥、降雨、農牧業、移動、地域社会の知恵がせめぎ合う帯状の地域です。環境変化を自然だけの問題にしないための地点です。",
      relation: "07 災いと恵み × 08 三つの生態系 — 生態・社会・心の回復を同じ地図で考える。",
    },
    {
      name: "HIMALAYA",
      nameJa: "ヒマラヤ水系",
      lon: 85,
      lat: 28,
      description: "氷河と雪解け水が国境を越えて巨大な河川と生活圏を支えます。上流と下流を別々の世界として扱えない地点です。",
      relation: "02 青い循環系 — 水を所有物ではなく、地域を越えて巡る関係として読む。",
    },
    {
      name: "CORAL SEA",
      nameJa: "サンゴ海",
      lon: 150,
      lat: -18,
      description: "海水温、生態系、沿岸文化が相互に応答する海域です。小さな生物の変化が社会の未来を映す感覚器になります。",
      relation: "04 共進化プロトコル × 10 センスウェア2050 — 生物の応答を未来の意思決定へつなぐ。",
    },
    {
      name: "ANDES",
      nameJa: "アンデス",
      lon: -70,
      lat: -22,
      description: "鉱物資源、高地の水、生態系、都市のテクノロジーが長い供給網で結ばれる地域です。人工物の起源を遡る地点です。",
      relation: "05 すべては次の資源 × 09 人工物の共生化 — 技術を採掘から廃棄までの循環で捉え直す。",
    },
    {
      name: "SOUTHERN OCEAN",
      nameJa: "南大洋",
      lon: 30,
      lat: -55,
      description: "熱と炭素を運ぶ海流が、見えないところで地球の気候を支えています。空白に見える海を働く主体として読む地点です。",
      relation: "01 地球の一呼吸 × 02 青い循環系 — 海の巨大な時間と人間の判断を同期させる。",
    },
  ];

  // A deliberately simplified planetary model. It stays visible when the
  // optional OpenStreetMap detail tiles cannot be loaded.
  const SIMPLE_WORLD_LANDMASSES = [
    {
      label: "NORTH AMERICA",
      labelAt: [-106, 48],
      points: [
        [-168, 72], [-150, 70], [-136, 60], [-128, 52], [-124, 42],
        [-117, 32], [-106, 24], [-97, 18], [-86, 20], [-81, 26],
        [-82, 31], [-75, 38], [-66, 45], [-60, 53], [-67, 59],
        [-79, 63], [-91, 70], [-108, 73], [-127, 72], [-148, 76],
      ],
    },
    {
      label: "SOUTH AMERICA",
      labelAt: [-60, -20],
      points: [
        [-81, 12], [-70, 10], [-60, 7], [-50, 2], [-45, -10],
        [-40, -23], [-48, -29], [-52, -41], [-66, -55], [-74, -50],
        [-76, -35], [-80, -20], [-78, -5],
      ],
    },
    {
      label: "EURASIA",
      labelAt: [73, 49],
      points: [
        [-11, 36], [-10, 44], [1, 51], [12, 57], [26, 60],
        [41, 69], [61, 72], [82, 72], [103, 77], [126, 72],
        [150, 61], [171, 60], [179, 52], [169, 45], [151, 42],
        [144, 35], [135, 34], [125, 25], [115, 20], [105, 8],
        [98, 5], [92, 20], [80, 22], [70, 27], [60, 24],
        [52, 30], [44, 28], [36, 36], [25, 40], [15, 36],
        [6, 43], [-4, 42],
      ],
    },
    {
      label: "AFRICA",
      labelAt: [20, 5],
      points: [
        [-17, 37], [0, 35], [15, 33], [32, 30], [42, 12],
        [50, 2], [44, -12], [35, -25], [28, -34], [18, -35],
        [10, -28], [2, -10], [-8, 5], [-16, 20],
      ],
    },
    {
      label: "AUSTRALIA",
      labelAt: [134, -25],
      points: [
        [112, -11], [130, -10], [145, -18], [153, -28],
        [146, -39], [132, -43], [116, -35], [110, -22],
      ],
    },
    {
      label: "GREENLAND",
      labelAt: [-41, 72],
      points: [
        [-55, 83], [-25, 80], [-18, 70], [-35, 60], [-52, 64], [-62, 74],
      ],
    },
    {
      label: "ANTARCTICA",
      labelAt: [28, -76],
      points: [
        [-180, -70], [-145, -72], [-110, -73], [-70, -70], [-30, -75],
        [10, -72], [48, -68], [88, -70], [128, -66], [162, -71],
        [180, -70], [180, -84], [-180, -84],
      ],
    },
  ];

  const SIMPLE_WORLD_ISLAND_LINES = [
    [[130, 31], [133, 33], [136, 35], [139, 37], [141, 41], [145, 44]],
    [[166, -35], [173, -41], [178, -46]],
    [[-9, 51], [-4, 55], [0, 58]],
    [[47, -13], [49, -20], [46, -25]],
  ];

  const JMA_EVENT_TITLES = {
    20110311144618: "東北地方太平洋沖地震",
    20160416012505: "熊本地震",
    20180906030759: "北海道胆振東部地震",
    20240101161022: "能登半島地震",
    20240417231448: "豊後水道の地震",
    20240808164255: "日向灘の地震",
  };

  const INTRO_MODE_CHOICES = [
    {
      label: "空気",
      cue: "CO₂と気温",
      code: "AIR",
      copy: "季節とともに上下する呼吸と、少しずつ積み重なるCO₂を見る。",
    },
    {
      label: "海",
      cue: "海流と風",
      code: "OCEAN",
      copy: "国境を越えて熱と水を運ぶ、海と風の大きな循環をたどる。",
    },
    {
      label: "森",
      cue: "森林と雨",
      code: "FOREST",
      copy: "森と雨が重なる場所から、気候を支える働きを感じる。",
    },
    {
      label: "生きもの",
      cue: "花と昆虫",
      code: "LIFE",
      copy: "一つの生命だけでは生まれない、花と昆虫の出会いの網を見る。",
    },
    {
      label: "ごみ",
      cue: "資源の行方",
      code: "WASTE",
      copy: "捨てたものがどこへ行き、次の資源へ渡せるかを考える。",
    },
    {
      label: "都市",
      cue: "光と排出",
      code: "CITY",
      copy: "夜の明るさの下に隠れた、人間の活動と環境への負担を見る。",
    },
    {
      label: "地震",
      cue: "地球の揺れ",
      code: "QUAKE",
      copy: "地球から届く波と、各地に残された揺れの記憶を聴く。",
    },
    {
      label: "暮らし",
      cue: "三つの生態系",
      code: "ECOLOGIES",
      copy: "自然、社会、大切な記憶を、切り離さずに重ねて見る。",
    },
    {
      label: "エネルギー",
      cue: "太陽と風",
      code: "ENERGY",
      copy: "自然から受け取れる力と、いまの電力の使い方を見比べる。",
    },
    {
      label: "すべて",
      cue: "九つの信号",
      code: "ALL SIGNALS",
      copy: "異なる地球の声を、一つの点数にまとめず同時に聴く。",
    },
  ];

  const modes = [
    {
      id: "breathing-earth",
      title: "Breathing Earth",
      titleJa: "地球の一呼吸",
      description: "季節ごとに上下する呼吸と、元へ戻らず蓄積するCO₂。その二つの時間を同じ大気から聴く。",
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
      description: "観測された海流が水・熱・生命をどこまで運ぶか、14日間の移流として読む。",
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
      title: "Message from Earth",
      titleJa: "地球からのメッセージ",
      description: "震度6弱以上の記録を選び、P波・S波の近似到達と各地の実測震度を同じ時間で読む。",
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
      title: "Unfinished Gaia Senseware",
      titleJa: "未完の地球センスウェア",
      description: "九つの信号と観客の軌跡を、矛盾を消さない未完の神経網として結ぶ。",
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
  for (int i = 0; i < 9; i++) {
    float fi = float(i);
    float contribution = uModeMemory[i];
    vec2 node = (hash22(vec2(fi, 72.4)) - 0.5) * vec2(1.18, 0.92);
    node *= 0.82;
    nodes += exp(-dot(p - node, p - node) * 150.0)
      * (0.28 + contribution * 1.35);
    links += lineGlow(sdSegment(p, node, node * -0.18), 0.014)
      * (0.045 + contribution);
  }
  float thought = fbm(p * 2.4 + vec2(t * 0.018, -t * 0.014));
  float atmosphere = smoothstep(0.58, 0.82, thought) * sphereMask;
  float sharedPulse = exp(-abs(radius - 0.46 - sin(t * 0.28) * 0.025) * 22.0)
    * sphereMask;
  vec3 background = baseGradient(p, vec3(0.035, 0.1, 0.16));
  vec3 color = background
    + vec3(0.26, 0.72, 0.9) * (latitude + longitude) * 0.34
    + vec3(0.72, 0.98, 1.0) * nodes * 0.72
    + vec3(0.42, 0.92, 0.72) * links * 0.3
    + vec3(0.42, 0.7, 1.0) * sharedPulse * (0.09 + response.x * 0.22)
    + vec3(0.22, 0.54, 0.68) * atmosphere * (0.12 + memory * 0.24);
  return color + vec3(0.8, 0.95, 1.0) * horizon * 0.38
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
        "世界地図の時間は、1958年から2050年へ進みます。色の濃い場所は、衛星が見たCO₂。斜線の場所は、衛星が見られなかった空白を、近くの観測から補ったものです。未来に入ると、これまでの増え方が続いた場合の「もしも」へ変わります。画面の言葉と模様を見れば、実際に測った場所と、計算した場所を見分けられます。",
      touch:
        "指先は命令を入力するコントローラーではなく、地球へ問いを差し出す感覚器です。触れた場所だけが光るのではなく、波が移動し、少し遅れて別の場所から返るように設計しました。自分の行為と結果のあいだに距離や時間差があることを、身体で感じるためです。",
      context:
        "共創地球論が示すのは、人間だけが主体で、自然が受動的な資源だという構図からの転換です。この感覚器では、地球にも固有の時間、限界、応答の仕方があると考えます。持続可能性とは地球を完全に管理することではなく、その反応を聴き、自分たちの行為を調整し続ける関係の技法です。",
      question: "あなたは地球を操作したいですか。それとも、まず応答を聴けますか。",
    },
    "blue-circulation": {
      lead:
        "海は風景ではなく、熱・水・炭素・生命を地球規模で運び、気候の急激な偏りを和らげる巨大な循環器です。",
      seeing:
        "世界地図の青い色はNOAA CoastWatchの海面流速、シアンの線は同じu/vベクトルを保った場合の14日間の局所移流、白い矢印はNASA POWERの年平均風です。大きなDAY表示が進むほど、各観測点から水塊が実距離スケールで運ばれます。海流と風を同じ値に混ぜず、観測時点と計算上の経過時間も分けて表示します。",
      touch:
        "青い観測点を押すと自動再生が止まり、その地点の東西・南北流速、合成速度、表示中の日数で進む計算距離を読めます。スライダーで任意の日へ戻り、同じ速さでも方向によって到達先が変わることを比較できます。線は予報ではなく、観測ベクトルを一定と仮定した思考実験です。",
      context:
        "共創地球論では、地球のシステムは部分ごとに切り離せず、循環の連鎖として理解する必要があります。水不足、海洋温暖化、豪雨、漁業、都市の消費は別々の問題ではありません。循環を止めず、負荷を一か所へ押しつけず、流れ全体の回復力を高める設計こそが、自然とテクノロジーの共創になります。",
      question: "あなたの暮らしから流れ出たものは、どの海、どの未来へ届くでしょう。",
    },
    "forest-cloud-engine": {
      lead:
        "森を木の集合としてではなく、土壌・菌類・植物・大気が共同で気候をつくる生きたインフラとして読み替える感覚器です。",
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
        "自然界では、ある生命の終わりや排出物が、別の生命の材料へ変換されます。『廃棄』を終点ではなく途中の状態として見る感覚器です。",
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
        "地震を抽象的な波紋ではなく、発生時刻・震源・P波とS波の到達・各地の実測震度を伴う『地球からのメッセージ』として読む感覚器です。",
      seeing:
        "気象庁の震度データベースから、震度6弱以上を観測した代表地震と観測点を同梱しています。地震を選ぶと、震源距離を使った均質地殻の近似でP波7 km/s・S波4 km/sの輪が1秒=1秒で広がり、S波の計算到達後に気象庁の実測震度が現れます。波の到達は作品内計算、色付きの震度は観測値です。",
      touch:
        "観客は地震を発生させるのではなく、過去の一件を選び、その波が各地へ届く時間を待ちます。すぐに全地点を点灯させないのは、震源からの距離と時間差、そして同じ地震でも地域ごとに異なる揺れがあることを身体的に理解するためです。",
      context:
        "共創地球論の『地球の変動リズムと同期しうる文明設計』に接続します。変動を完全に排除するのではなく、観測技術、防災、土地利用、地域の記憶を結び、被害を弱い立場へ集中させない社会を考えます。作品は防災情報の代替ではなく、モデルの限界も同じ画面に開示します。",
      question: "変化を止められないとき、私たちは何を守り、何を変えるべきでしょう。",
    },
    "three-ecologies": {
      lead:
        "環境の問題を、自然だけでなく、社会の関係と一人ひとりの感覚まで含む三つの生態系として捉える感覚器です。",
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
        "九つの公開データ信号と観客の軌跡を束ねながら、正解や総合点を出さない『未完の地球センスウェア』です。",
      seeing:
        "CO₂、気温、海流、風、森林、降水、生物間相互作用、廃棄物、排出量、地震、都市・文化、再生可能エネルギーという異なる単位の信号を九本の枝に保ちます。単位も意味も違う値を平均して『地球健康度70点』にはせず、強い信号と矛盾する信号が同時に残る神経網として描きます。",
      touch:
        "最後のタッチは作品を完成させる署名ではありません。九つの記憶へ新しい波を重ね、全体をもう一度揺らします。鑑賞者は外から未来を選ぶ消費者ではなく、すでにその内部で影響を与えている参加者です。同時に、画面は思い通りには固定できず、人間以外の応答が未来に残ります。",
      context:
        "レジュメ『地球大の感覚神経系を獲得した人類 〜未完の「地球センスウエア」創生にむけて』を作品全体の結論に置いています。観測網や公開データは地球を支配するダッシュボードではなく、人間社会が応答の仕方を学ぶための感覚神経系です。技術の完成ではなく、関係を更新し続ける余白を未完として残します。",
      question: "未来を予測するだけでなく、応答を聴きながら共につくる準備はできていますか。",
    },
  };

  const modeDataNarratives = Object.freeze({
    "breathing-earth": "データの読み方：色の濃いマスは衛星地図から読んだ値、斜線のマスは近くの8地点から補った値です。昔は全球の衛星地図がないため、当時のCO₂記録と後年の地図を組み合わせました。未来は、直近10年の増え方がそのまま続いた場合の「もしも」です。どれも実測と同じに見せず、詳しい計算はOPEN DATAに分けています。",
    "blue-circulation": "データ実装：NOAA CoastWatchの日別海流u/vから合成流速を計算し、0〜1.5 m/sの固定色尺度で観測点周辺だけを着色します。DAY 0〜14の線は、そのu/vが変わらないと仮定した実距離スケールのDERIVED局所移流で、予報ではありません。NASA POWERの年平均風は白矢印の別レイヤーです。OSCAR配信が取得時にタイムアウトしたため代替データを使ったことも台帳に記録します。",
    "forest-cloud-engine": "データ実装：NASA GIBSのMODIS IGBP 2023全球土地被覆ラスターに、世界31地点のNASA POWER年平均降水を重ねます。土地被覆は全球画像、降水は点の実データなので、降水の点間を補間しません。水色と地表色の重なりは問いを生む入口であり、因果関係の証明ではありません。",
    "pollination-protocol": "データ実装：世界31か国から最大2件ずつ抽出したGBIFのApis mellifera観察記録を地理点として順に強調します。GloBIのpollinates記録は文献上の関係一覧として件数だけを併記し、座標のない関係をGBIF地点へ偽って接続しません。国別抽出は分布密度ではなく展示用GLOBAL SAMPLEです。",
    "nothing-is-waste": "データの読み方：実線の円は国連に報告された17地域の値です。数字が見つからなかった14地域は、近くの5か国を参考にした仮の値を破線で示します。さらに外側の破線は、観客が動かす未来の「もしも」です。公式値、補った値、観客の選択を、三つの違う線として見せます。",
    "anthropocene-scar": "データ実装：World Bankで配信されるEDGAR由来の国別GHG排出量を赤い対数環、NASA GIBSのVIIRS全球夜間光を白いラスターとして重ねます。長押しで白だけを剥がせますが、夜間光を排出量へ変換したとは扱いません。",
    "rhythm-of-disaster": "データ実装：USGS FDSNの2000年以降M7.5以上を全球で年代順に走査します。Magnitudeを震度へ変換せず、日本の代表6地震を選んだときだけ気象庁の震度6弱以上の実測地点とP/S代表速度モデルを開きます。",
    "three-ecologies": "データ実装：NASA MODISの全球土地被覆を生態、World Bankの国別都市人口比率を社会、UNESCO世界遺産の全球キュレーションを文化・記憶として三層に保ちます。どの分類・件数・比率も精神生態の点数にはせず、異なる意味のまま重ねます。",
    "earth-organ": "データ実装：世界31地点のNASA POWER太陽放射と風速を自然条件として外周へ、同じ国のWorld Bank再エネ電力比率を内側へ分離表示します。点データと国別値を混ぜず、二地点を結ぶ破線だけが観客のSCENARIOです。",
    "senseware-2050": "データ実装：01〜09を48秒で一本ずつ走査し、選択中の枝と観客が各モードへ残した一時的な接触記憶を重ねます。異なる単位の実数値はここで再集計せず、枝を平均した総合点も作りません。観客の軌跡も評価値ではない別の信号です。",
  });

  const lectureResumeLinks = Object.freeze({
    "breathing-earth": "レジュメ接続：05_なぜ風はなぜ吹くのか？〜宇宙船地球号の「循環系」を理解する_レジュメ.pdf",
    "blue-circulation": "レジュメ接続：05_なぜ風はなぜ吹くのか？〜宇宙船地球号の「循環系」を理解する_レジュメ.pdf",
    "forest-cloud-engine": "レジュメ接続：01_森は地球の気候安定装置_レジュメ.pdf",
    "pollination-protocol": "レジュメ接続：06_１億年前のドローン革命〜「花と昆虫の共進化」_レジュメ.pdf",
    "nothing-is-waste": "レジュメ接続：02_自然界にはゴミもうんちも存在しない_レジュメ.pdf",
    "anthropocene-scar": "レジュメ接続：04_人類世3.0〜産業革命以降「ガリバー化」した人類_レジュメ.pdf",
    "rhythm-of-disaster": "レジュメ接続：06_地球の変動リズムと同期しうる文明設計_レジュメ.pdf",
    "three-ecologies": "レジュメ接続：01_３つのエコロジー；生態学的次元、社会的次元、精神的次元_レジュメ.pdf",
    "earth-organ": "レジュメ接続：06_地球の変動リズムと同期しうる文明設計_レジュメ.pdf",
    "senseware-2050": "レジュメ接続：01_地球大の感覚神経系を獲得した人類 〜未完の「地球センスウエア」創生にむけて_レジュメ.pdf",
  });

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
    uniform vec4 uSignal;

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
      vec2 dataResponse = response + uSignal.zw * 0.08;
      vec3 fromColor = evaluateMode(uModeFrom, uv, uTime + uSignal.y * 1.6, dataResponse);
      vec3 toColor = evaluateMode(uModeTo, uv, uTime + uSignal.y * 1.6, dataResponse);
      float transition = smoothstep(0.0, 1.0, uTransition);
      vec3 color = mix(fromColor, toColor, transition);
      color *= 0.84 + uSignal.x * 0.32;
      color += vec3(uSignal.y * 0.025, uSignal.z * 0.02, uSignal.w * 0.025);

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
    signal: gl.getUniformLocation(program, "uSignal"),
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
  const introModeButtons = [];
  const conceptModeButtons = [];
  const japanModeButtons = [];
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
  let mapScope = "earth";
  let japanDataUpdatedAt = null;
  let japanHistoryUpdatedAt = null;
  let selectedJapanPoi = null;
  let japanWaveReplay = null;
  let gaiaSnapshot = null;
  let gaiaSnapshotError = null;
  let gaiaModeById = new Map();
  let signalTimePosition = 100;
  let co2TimelineStartedAt = performance.now();
  let co2TimelinePausedUntil = 0;
  let co2TimelineLastStep = -1;
  let co2TimelineHeld = false;
  const requestedSourceTab = new URLSearchParams(window.location.search).get("code");
  let activeSourceTab = ["visual", "transform", "raw"].includes(requestedSourceTab)
    ? requestedSourceTab
    : "visual";
  let anthropocenePeelUntil = 0;
  const selectedEnergyRegions = [];
  let japanPoiRevealTimer = 0;
  let japanDeepLinkHandled = false;
  let autoEnabled = false;
  let nextAutoAt = performance.now() + AUTO_INTERVAL;
  const requestedModeNumber = Number.parseInt(new URLSearchParams(window.location.search).get("mode"), 10);
  const initialModeIndex = Number.isFinite(requestedModeNumber)
    ? Math.min(MODE_COUNT - 1, Math.max(0, requestedModeNumber - 1))
    : 0;
  let modeFromIndex = initialModeIndex;
  let modeToIndex = initialModeIndex;
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
    pressStartedAt: 0,
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
    const isMobile = window.innerWidth <= 720;
    const nextZoom = isMobile ? EARTH_MOBILE_ZOOM : EARTH_ZOOM;
    const center = lonLatToWorld(15, 18, nextZoom);
    japanView.zoom = nextZoom;
    japanView.centerX = center.x;
    japanView.centerY = center.y;
    japanTilesDirty = true;
  };

  const getActiveMapNodes = () => EARTH_NODES;

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
    const visibleTileUrls = [];

    for (let tileY = minimumY; tileY <= maximumY; tileY += 1) {
      for (let tileX = minimumX; tileX <= maximumX; tileX += 1) {
        const wrappedX = ((tileX % tileCount) + tileCount) % tileCount;
        const key = `${japanView.zoom}/${tileX}/${tileY}`;
        const tileUrl = `https://tile.openstreetmap.org/${japanView.zoom}/${wrappedX}/${tileY}.png`;
        visibleKeys.add(key);
        visibleTileUrls.push(tileUrl);

        let tile = japanTileElements.get(key);
        if (!tile) {
          tile = document.createElement("img");
          tile.className = "japan-tile";
          tile.alt = "";
          tile.draggable = false;
          tile.decoding = "async";
          tile.src = tileUrl;
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
                "MAP TILE OFFLINE / VECTOR EARTH MODEL ACTIVE";
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

    dataLedger.updateOsm({
      scope: mapScope,
      zoom: japanView.zoom,
      urls: visibleTileUrls,
    });

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

  const renderSimplifiedWorldModel = (ctx, rect, left, top) => {
    const worldSize = MAP_TILE_SIZE * 2 ** japanView.zoom;
    const firstRepeat = Math.floor(left / worldSize) - 1;
    const lastRepeat = Math.ceil((left + rect.width) / worldSize) + 1;
    const northY = lonLatToWorld(0, 80).y - top;
    const southY = lonLatToWorld(0, -80).y - top;

    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, rect.width, rect.height);
    ctx.clip();

    ctx.setLineDash([2, 9]);
    ctx.lineWidth = 0.55;
    ctx.strokeStyle = "rgba(135, 224, 211, 0.105)";
    for (let repeat = firstRepeat; repeat <= lastRepeat; repeat += 1) {
      const repeatOffset = repeat * worldSize;
      for (let longitude = -180; longitude < 180; longitude += 30) {
        const x = lonLatToWorld(longitude, 0).x - left + repeatOffset;
        ctx.beginPath();
        ctx.moveTo(x, northY);
        ctx.lineTo(x, southY);
        ctx.stroke();
      }
      for (let latitude = -60; latitude <= 60; latitude += 30) {
        const y = lonLatToWorld(0, latitude).y - top;
        ctx.beginPath();
        ctx.moveTo(-left + repeatOffset, y);
        ctx.lineTo(worldSize - left + repeatOffset, y);
        ctx.stroke();
      }
    }
    ctx.setLineDash([]);

    for (let repeat = firstRepeat; repeat <= lastRepeat; repeat += 1) {
      const repeatOffset = repeat * worldSize;
      for (const landmass of SIMPLE_WORLD_LANDMASSES) {
        ctx.beginPath();
        landmass.points.forEach(([longitude, latitude], pointIndex) => {
          const world = lonLatToWorld(longitude, latitude);
          const x = world.x - left + repeatOffset;
          const y = world.y - top;
          if (pointIndex === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.closePath();
        ctx.fillStyle = "rgba(29, 86, 84, 0.2)";
        ctx.fill();
        ctx.strokeStyle = "rgba(135, 244, 216, 0.52)";
        ctx.lineWidth = japanView.zoom >= 2 ? 1.15 : 0.9;
        ctx.stroke();

        if (japanView.zoom >= 2 && rect.width >= 760) {
          const labelWorld = lonLatToWorld(...landmass.labelAt);
          const labelX = labelWorld.x - left + repeatOffset;
          const labelY = labelWorld.y - top;
          if (labelX > -120 && labelX < rect.width + 120) {
            ctx.fillStyle = "rgba(187, 240, 226, 0.32)";
            ctx.font = '6px Consolas, "Courier New", monospace';
            ctx.textAlign = "center";
            ctx.fillText(landmass.label, labelX, labelY);
          }
        }
      }

      for (const islandLine of SIMPLE_WORLD_ISLAND_LINES) {
        ctx.beginPath();
        islandLine.forEach(([longitude, latitude], pointIndex) => {
          const world = lonLatToWorld(longitude, latitude);
          const x = world.x - left + repeatOffset;
          const y = world.y - top;
          if (pointIndex === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.strokeStyle = "rgba(151, 247, 220, 0.58)";
        ctx.lineWidth = japanView.zoom >= 2 ? 1.05 : 0.8;
        ctx.stroke();
      }

      ctx.strokeStyle = "rgba(135, 224, 211, 0.16)";
      ctx.lineWidth = 0.7;
      ctx.strokeRect(-left + repeatOffset, northY, worldSize, southY - northY);
    }

    const equatorY = lonLatToWorld(0, 0).y - top;
    ctx.setLineDash([8, 12]);
    ctx.strokeStyle = "rgba(164, 244, 221, 0.18)";
    ctx.lineWidth = 0.7;
    ctx.beginPath();
    ctx.moveTo(0, equatorY);
    ctx.lineTo(rect.width, equatorY);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.textAlign = "start";
    ctx.restore();
  };

  const japanScreenToLonLat = (x, y, left, top) => {
    const worldSize = MAP_TILE_SIZE * 2 ** japanView.zoom;
    const worldX = left + x;
    const worldY = top + y;
    const unwrappedLongitude = (worldX / worldSize) * 360 - 180;
    const longitude = ((unwrappedLongitude + 540) % 360) - 180;
    const mercatorN = Math.PI - (2 * Math.PI * worldY) / worldSize;
    return {
      lon: longitude,
      lat: (Math.atan(Math.sinh(mercatorN)) * 180) / Math.PI,
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

  const nightLightsImage = new Image();
  nightLightsImage.src = "./assets/data/viirs-night-lights-2016.png";
  const landCoverImage = new Image();
  landCoverImage.src = "./assets/data/modis-land-cover-2023.png";

  const drawVectorArrow = (ctx, x, y, u, v, color, scale = 34) => {
    const speed = Math.hypot(u, v);
    if (!Number.isFinite(speed) || speed < 0.001) return;
    const nx = u / speed;
    const ny = -v / speed;
    const length = clamp(speed * scale, 7, 42);
    const endX = x + nx * length;
    const endY = y + ny * length;
    const angle = Math.atan2(endY - y, endX - x);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(endX, endY);
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.1;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(endX, endY);
    ctx.lineTo(endX - Math.cos(angle - 0.5) * 5, endY - Math.sin(angle - 0.5) * 5);
    ctx.lineTo(endX - Math.cos(angle + 0.5) * 5, endY - Math.sin(angle + 0.5) * 5);
    ctx.stroke();
  };

  const getClosestTemperature = (rows, year) =>
    (rows || []).reduce(
      (closest, row) =>
        !closest || Math.abs(row.year - year) < Math.abs(closest.year - year) ? row : closest,
      null,
    );

  const getJmaCo2Observation = (rows, site, selectedYear) => {
    let current = null;
    let previous = null;
    for (const row of rows || []) {
      if (row.year > selectedYear) break;
      if (!Number.isFinite(row[site.valueKey])) continue;
      previous = current;
      current = row;
    }
    if (!current) {
      return { site, selectedYear, row: null, valuePpm: null, previousPpm: null, deltaPpm: null };
    }
    return {
      site,
      selectedYear,
      row: current,
      valuePpm: current[site.valueKey],
      previousPpm: previous?.[site.valueKey] ?? null,
      deltaPpm: Number.isFinite(previous?.[site.valueKey])
        ? current[site.valueKey] - previous[site.valueKey]
        : null,
      flag: current[site.flagKey] || null,
    };
  };

  const frameDateToDecimalYear = (date) => {
    const [year, month = 1] = String(date).split("-").map(Number);
    return year + (month - 1) / 12;
  };

  const rowDateToDecimalYear = (row) =>
    Number(row?.year || 0) + (Number(row?.month || 1) - 1) / 12;

  const getFrameMeanPpm = (frame) => {
    if (!frame) return null;
    if (Number.isFinite(frame.meanPpm)) return frame.meanPpm;
    let total = 0;
    let count = 0;
    for (const value of frame.values || []) {
      if (!Number.isFinite(value)) continue;
      total += value;
      count += 1;
    }
    frame.meanPpm = count ? total / count : null;
    return frame.meanPpm;
  };

  const getClosestCo2Row = (rows, decimalYear) =>
    (rows || []).reduce(
      (closest, row) =>
        !closest ||
        Math.abs(rowDateToDecimalYear(row) - decimalYear) <
          Math.abs(rowDateToDecimalYear(closest) - decimalYear)
          ? row
          : closest,
      null,
    );

  const formatTimelineDate = (decimalYear, includeMonth = false) => {
    const year = Math.floor(decimalYear);
    if (!includeMonth) return String(year);
    const month = clamp(Math.floor((decimalYear - year) * 12) + 1, 1, 12);
    return `${year}.${String(month).padStart(2, "0")}`;
  };

  const getFrameImputedIndices = (frame) => {
    if (!frame) return new Set();
    if (!gosatImputedIndexCache.has(frame)) {
      gosatImputedIndexCache.set(frame, new Set(frame.imputedIndices || []));
    }
    return gosatImputedIndexCache.get(frame);
  };

  const timelineCellUsesSpatialImputation = (timeline, index) =>
    getFrameImputedIndices(timeline?.frameA).has(index) ||
    getFrameImputedIndices(timeline?.frameB).has(index);

  const getOlsTrendProjection = (model, year) => {
    if (!model || !Number.isFinite(model.slopePpmYear)) return null;
    const estimate =
      model.levelAtReferencePpm + model.slopePpmYear * (year - model.referenceYear);
    const standardError = model.residualStandardErrorPpm * Math.sqrt(
      1 +
        1 / model.trainingMonths +
        ((year - model.referenceYear) ** 2) / Math.max(model.sxx, 0.000001),
    );
    const halfWidth = model.tCritical95 * standardError;
    return {
      estimate,
      lower95Ppm: estimate - halfWidth,
      upper95Ppm: estimate + halfWidth,
      halfWidth95Ppm: halfWidth,
    };
  };

  const getCo2TimelineState = (signalMode) => {
    const grid = signalMode?.signals?.gosat;
    const frames = grid?.frames || [];
    if (!frames.length) return null;
    const decimalYear =
      CO2_TIMELINE_START_YEAR +
      ((CO2_TIMELINE_END_YEAR - CO2_TIMELINE_START_YEAR) * signalTimePosition) / 100;
    const firstFrame = frames[0];
    const lastFrame = frames.at(-1);
    const firstYear = frameDateToDecimalYear(firstFrame.date);
    const lastYear = frameDateToDecimalYear(lastFrame.date);
    const co2Rows = signalMode?.signals?.co2 || [];
    const timelineStep = Math.round(
      (decimalYear - CO2_TIMELINE_START_YEAR) * CO2_TIMELINE_STEPS_PER_YEAR,
    );

    if (decimalYear < firstYear) {
      const reference = getClosestCo2Row(co2Rows, decimalYear);
      const referencePpm = reference?.deseasonalizedPpm ?? reference?.averagePpm ?? 315;
      const offsetPpm = referencePpm - (getFrameMeanPpm(firstFrame) || referencePpm);
      return {
        kind: "reconstruction",
        phaseLabel: "PAST / CALCULATED FROM RECORDS",
        yearLabel: formatTimelineDate(decimalYear),
        dateLabel: formatTimelineDate(decimalYear),
        methodLabel: "昔の濃度記録 × 最初の衛星地図",
        warning: "この時代には全球を測った地図がありません。昔の濃度記録と、後年の衛星地図を組み合わせた再現です。",
        decimalYear,
        referencePpm,
        frameA: firstFrame,
        frameB: firstFrame,
        mix: 0,
        offsetPpm,
        availableCells: firstFrame.availableCells,
        observedCells: firstFrame.observedCells ?? firstFrame.availableCells,
        imputedCells: firstFrame.imputedCells || 0,
        rangeMinimumPpm: firstFrame.minimumPpm + offsetPpm,
        rangeMaximumPpm: firstFrame.maximumPpm + offsetPpm,
        cacheKey: `past-${timelineStep}`,
      };
    }

    if (decimalYear <= lastYear) {
      let upperIndex = frames.findIndex(
        (frame) => frameDateToDecimalYear(frame.date) >= decimalYear,
      );
      if (upperIndex < 0) upperIndex = frames.length - 1;
      const lowerIndex = Math.max(0, upperIndex - 1);
      const frameA = frames[lowerIndex];
      const frameB = frames[upperIndex];
      const yearA = frameDateToDecimalYear(frameA.date);
      const yearB = frameDateToDecimalYear(frameB.date);
      const mix = yearB === yearA ? 0 : clamp((decimalYear - yearA) / (yearB - yearA), 0, 1);
      const meanA = getFrameMeanPpm(frameA) || 0;
      const meanB = getFrameMeanPpm(frameB) || meanA;
      return {
        kind: "observed",
        phaseLabel: "GOSAT / MEASURED + FILLED",
        yearLabel: formatTimelineDate(decimalYear, true),
        dateLabel: formatTimelineDate(decimalYear, true),
        methodLabel: "実際に測った色 + まわりから補った斜線",
        warning: "色の濃いマスは衛星地図から読んだ値、斜線のマスは近くの8地点から補った値です。",
        decimalYear,
        referencePpm: meanA + (meanB - meanA) * mix,
        frameA,
        frameB,
        mix,
        offsetPpm: 0,
        availableCells: Math.round(
          frameA.availableCells + (frameB.availableCells - frameA.availableCells) * mix,
        ),
        observedCells: Math.round(
          (frameA.observedCells ?? frameA.availableCells) +
            ((frameB.observedCells ?? frameB.availableCells) -
              (frameA.observedCells ?? frameA.availableCells)) *
              mix,
        ),
        imputedCells: Math.round(
          (frameA.imputedCells || 0) + ((frameB.imputedCells || 0) - (frameA.imputedCells || 0)) * mix,
        ),
        rangeMinimumPpm:
          frameA.minimumPpm + (frameB.minimumPpm - frameA.minimumPpm) * mix,
        rangeMaximumPpm:
          frameA.maximumPpm + (frameB.maximumPpm - frameA.maximumPpm) * mix,
        cacheKey: `observed-${timelineStep}`,
      };
    }

    const validRows = co2Rows.filter((row) => Number.isFinite(row.deseasonalizedPpm));
    const latest = validRows.at(-1);
    const forecastModel = signalMode?.signals?.co2ForecastModel;
    const projection = getOlsTrendProjection(forecastModel, decimalYear);
    const baseProjection = getOlsTrendProjection(forecastModel, lastYear);
    const recentTrendPpmYear = forecastModel?.slopePpmYear || 0;
    const offsetPpm = projection && baseProjection
      ? projection.estimate - baseProjection.estimate
      : recentTrendPpmYear * (decimalYear - lastYear);
    const lastMean = getFrameMeanPpm(lastFrame) || latest.deseasonalizedPpm;
    const referencePpm = lastMean + offsetPpm;
    return {
      kind: "scenario",
      phaseLabel: "FUTURE / IF THIS TREND CONTINUES",
      yearLabel: formatTimelineDate(decimalYear),
      dateLabel: formatTimelineDate(decimalYear),
      methodLabel: `直近10年の増え方を延長 / 年 +${recentTrendPpmYear.toFixed(2)} ppm`,
      warning: "これまでと同じ増え方が続いた場合の『もしも』です。未来を言い当てる予言ではありません。",
      decimalYear,
      referencePpm,
      frameA: lastFrame,
      frameB: lastFrame,
      mix: 0,
      offsetPpm,
      recentTrendPpmYear,
      forecastModel,
      lower95Ppm: referencePpm - (projection?.halfWidth95Ppm || 0),
      upper95Ppm: referencePpm + (projection?.halfWidth95Ppm || 0),
      predictionHalfWidth95Ppm: projection?.halfWidth95Ppm || 0,
      availableCells: lastFrame.availableCells,
      observedCells: lastFrame.observedCells ?? lastFrame.availableCells,
      imputedCells: lastFrame.imputedCells || 0,
      rangeMinimumPpm: lastFrame.minimumPpm + offsetPpm,
      rangeMaximumPpm: lastFrame.maximumPpm + offsetPpm,
      cacheKey: `future-${timelineStep}`,
    };
  };

  const getTimelineCellValue = (timeline, index) => {
    if (!timeline) return null;
    const valueA = timeline.frameA?.values?.[index];
    const valueB = timeline.frameB?.values?.[index];
    let value = null;
    if (Number.isFinite(valueA) && Number.isFinite(valueB)) {
      value = valueA + (valueB - valueA) * timeline.mix;
    } else if (timeline.mix < 0.5 && Number.isFinite(valueA)) {
      value = valueA;
    } else if (timeline.mix >= 0.5 && Number.isFinite(valueB)) {
      value = valueB;
    }
    return Number.isFinite(value) ? value + timeline.offsetPpm : null;
  };

  const getBreathingEarthState = (signalMode) => {
    const co2 = pickByPosition(signalMode?.signals?.co2);
    const timeline = getCo2TimelineState(signalMode);
    const gosatFrame = timeline?.frameA || pickByPosition(signalMode?.signals?.gosat?.frames);
    const selectedYear = japanIsOpen && timeline
      ? Math.floor(timeline.decimalYear)
      : co2?.year ?? new Date().getFullYear();
    const temperature = getClosestTemperature(signalMode?.signals?.temperature, selectedYear);
    const seasonalPpm = co2 ? co2.averagePpm - co2.deseasonalizedPpm : 0;
    return {
      co2,
      gosat: signalMode?.signals?.gosat || null,
      gosatFrame,
      timeline,
      selectedYear,
      temperature,
      seasonalPpm,
      seasonalUnit: clamp(seasonalPpm / 5, -1, 1),
      globalGrowthUnit: co2
        ? clamp((co2.deseasonalizedPpm - 315) / 120, 0, 1)
        : 0,
      japan: JMA_CO2_SITES.map((site) =>
        getJmaCo2Observation(signalMode?.signals?.japanCo2, site, selectedYear),
      ),
    };
  };

  const getBlueCirculationState = (signalMode) => {
    const currents = signalMode?.signals?.currents || [];
    if (!currents.length) return null;
    const speeds = currents.map((row) => Math.hypot(row.uMs, row.vMs));
    const horizonHours = (signalTimePosition / 100) * CIRCULATION_TIMELINE_HOURS;
    const meanSpeedMs = speeds.reduce((sum, speed) => sum + speed, 0) / speeds.length;
    const maximumSpeedMs = Math.max(...speeds);
    const sourceDate = String(currents[0]?.time || "SNAPSHOT")
      .slice(0, 10)
      .replaceAll("/", ".")
      .replaceAll("-", ".");
    const day = horizonHours / 24;
    return {
      kind: "transport",
      phaseLabel: "SOURCE CURRENT × DERIVED TRANSPORT",
      yearLabel: `DAY ${day.toFixed(1).padStart(4, "0")}`,
      dateLabel: `${sourceDate} UTC`,
      methodLabel: "NOAA u/v × CONSTANT-VECTOR LOCAL ADVECTION",
      warning:
        "単一日の海流ベクトルを一定とした局所移流。14日後の海況予測や漂流予報ではありません。",
      horizonHours,
      meanSpeedMs,
      maximumSpeedMs,
      meanDistanceKm: meanSpeedMs * horizonHours * 3.6,
      vectorCount: currents.length,
      currents,
    };
  };

  const getSequenceIndex = (length) => {
    if (!length) return 0;
    return Math.min(length - 1, Math.floor((clamp(signalTimePosition, 0, 99.999) / 100) * length));
  };

  const getMapSequenceState = (signalMode) => {
    if (!signalMode) return null;
    const { signals } = signalMode;

    if (signalMode.id === "forest-cloud-engine") {
      const rows = signals.precipitation || [];
      const index = getSequenceIndex(rows.length);
      const row = rows[index];
      if (!row) return null;
      return {
        kind: "forest",
        phaseLabel: `GLOBAL SAMPLE / SITE ${String(index + 1).padStart(2, "0")} OF ${String(rows.length).padStart(2, "0")}`,
        yearLabel: row.precipitationMmDay?.toFixed(2) || "—",
        valueLabel: `mm/day · ${row.name}`,
        methodLabel: "NASA POWER POINTS × MODIS GLOBAL LAND COVER",
        timeLabel: `観測地点 / AUTO 01→${String(rows.length).padStart(2, "0")}`,
        selectedIndex: index,
        selected: row,
        legend: [
          ["水色円 / 降水", `${row.name} ${row.precipitationMmDay?.toFixed(2) || "—"} mm/day`],
          ["粒子 / 水蒸気", "降水量で密度を正規化したDERIVED"],
          ["背景 / 土地被覆", "MODIS IGBP 2023 global rendered raster"],
          ["範囲 / 標本", `${rows.length}地点。全球グリッドではない`],
        ],
      };
    }

    if (signalMode.id === "pollination-protocol") {
      const rows = signals.occurrences || [];
      const index = getSequenceIndex(rows.length);
      const row = rows[index];
      if (!row) return null;
      return {
        kind: "pollination",
        phaseLabel: `GLOBAL SAMPLE / GBIF RECORD ${String(index + 1).padStart(2, "0")} OF ${String(rows.length).padStart(2, "0")}`,
        yearLabel: `REC ${String(index + 1).padStart(2, "0")}`,
        valueLabel: `${String(row.eventDate || "DATE UNKNOWN").slice(0, 10)} · ${row.country || "country unknown"}`,
        methodLabel: "OBSERVATION LOCATIONS ≠ LITERATURE RELATION LOCATIONS",
        timeLabel: `観察記録 / AUTO 01→${String(rows.length).padStart(2, "0")}`,
        selectedIndex: index,
        selected: row,
        legend: [
          ["黄点 / 観察", `GBIF ${rows.length} records / max 2 per country`],
          ["輪 / 選択記録", row.species || "Apis mellifera"],
          ["関係 / 文献", `GloBI ${signals.interactions?.length || 0} relations`],
          ["重要 / 非接続", "文献関係を観察地点へ結ばない"],
        ],
      };
    }

    if (signalMode.id === "nothing-is-waste") {
      const rows = signals.countryWaste || [];
      const index = getSequenceIndex(rows.length);
      const selected = rows[index];
      const sourceRecycle = selected?.recyclePercent || 0;
      const imputed = selected?.valueStatus === "IMPUTED";
      const scenarioRecycle = clamp(sourceRecycle + ((signalTimePosition - 50) / 50) * 20, 0, 100);
      return {
        kind: "waste",
        phaseLabel: `${imputed ? "CALCULATED / NEARBY 5 COUNTRIES" : "MEASURED / OFFICIAL VALUE"} / ${String(index + 1).padStart(2, "0")} OF ${String(rows.length).padStart(2, "0")}`,
        yearLabel: `${sourceRecycle.toFixed(1)}%`,
        valueLabel: `${selected?.country || "—"} · ${imputed ? "STATISTICAL ESTIMATE" : selected?.year || "—"}`,
        methodLabel: imputed
          ? "近くの5か国から、真ん中の値を使う"
          : "国連に報告された値",
        timeLabel: `国別最新値 / AUTO 01→${String(rows.length).padStart(2, "0")}`,
        sourceRecycle,
        scenarioRecycle,
        selectedIndex: index,
        selected,
        legend: [
          [imputed ? "破線円 / 補完値" : "実線円 / 公開値", `${selected?.country || "—"} ${imputed ? "DERIVED" : selected?.year || "—"} ${sourceRecycle.toFixed(1)}%`],
          ["破線 / 仮想", `SCENARIO ${scenarioRecycle.toFixed(1)}%`],
          ["残り / 未分類", `${(100 - sourceRecycle).toFixed(1)}%は埋立・焼却を推定しない`],
          ["比較 / 注意", "報告年・制度・定義が国ごとに異なる"],
        ],
      };
    }

    if (signalMode.id === "anthropocene-scar") {
      const rows = signals.emissions || [];
      const index = getSequenceIndex(rows.length);
      const row = rows[index];
      if (!row) return null;
      return {
        kind: "anthropocene",
        phaseLabel: `COUNTRY VALUE / ${String(index + 1).padStart(2, "0")} OF ${String(rows.length).padStart(2, "0")}`,
        yearLabel: String(row.year),
        valueLabel: `${row.country} · ${row.emissionsMtCo2e.toFixed(1)} Mt CO₂e` ,
        methodLabel: "EDGAR COUNTRY LOAD ≠ VIIRS NIGHT-LIGHT RADIANCE",
        timeLabel: `国別最新値 / AUTO 01→${String(rows.length).padStart(2, "0")}`,
        selectedIndex: index,
        selected: row,
        legend: [
          ["赤い環 / 排出", `${row.country} ${row.emissionsMtCo2e.toFixed(1)} Mt CO₂e`],
          ["白画像 / 夜間光", "NASA VIIRS 2016 rendered radiance"],
          ["長押し / 比較", "全球の白い可視面だけを一時的に剥がす"],
          ["重要 / 非同一", "夜間光を排出量へ変換しない"],
        ],
      };
    }

    if (signalMode.id === "rhythm-of-disaster") {
      const rows = signals.featuredEvents || signals.globalEvents || signals.events || [];
      const index = getSequenceIndex(rows.length);
      const row = rows[index];
      if (!row) return null;
      return {
        kind: "earthquake",
        phaseLabel: `USGS GLOBAL M7.5+ / ${String(index + 1).padStart(2, "0")} OF ${String(rows.length).padStart(2, "0")}`,
        yearLabel: String(row.occurredAt || "").slice(0, 4),
        valueLabel: `M${row.magnitude.toFixed(1)} · DEPTH ${row.depthKm?.toFixed(0) || "—"} km · ${row.name}`,
        methodLabel: "GLOBAL EPICENTRE / MAGNITUDE ≠ JMA INTENSITY",
        timeLabel: `地震記録 / AUTO 01→${String(rows.length).padStart(2, "0")}`,
        selectedIndex: index,
        selected: row,
        legend: [
          ["震源 / USGS", String(row.occurredAt).replace("T", " ").slice(0, 19)],
          ["輪 / M7.5+", "震源位置と規模を年代順に走査"],
          ["速度 / 別実装", "JMA詳細記録ではP 7 / S 4 km/s"],
          ["重要 / 非変換", "Magnitudeを震度へ変換しない"],
        ],
      };
    }

    if (signalMode.id === "three-ecologies") {
      const stages = [
        { code: "LAYER 01", name: "ECOLOGICAL / 生態", method: "COUNTRY FOREST AREA" },
        { code: "LAYER 02", name: "SOCIAL / 社会", method: "COUNTRY URBAN POPULATION" },
        { code: "LAYER 03", name: "MEMORY / 文化・記憶", method: "UNESCO GLOBAL SAMPLE" },
        { code: "ALL 03", name: "COEXIST / 三層を分けたまま重ねる", method: "NO MENTAL-ECOLOGY SCORE" },
      ];
      const index = getSequenceIndex(stages.length);
      const stage = stages[index];
      return {
        kind: "ecologies",
        phaseLabel: `THREE ECOLOGIES / PHASE ${String(index + 1).padStart(2, "0")} OF 04`,
        yearLabel: stage.code,
        valueLabel: stage.name,
        methodLabel: stage.method,
        timeLabel: "表示層 / AUTO ECO→SOCIAL→MEMORY→ALL",
        selectedIndex: index,
        selected: stage,
        legend: [
          ["地表色 / 生態", "MODIS IGBP 2023 global land cover"],
          ["青 / 社会", `${signals.social?.length || 0} country urban values`],
          ["紫 / 記憶", `${signals.culture?.length || 0} UNESCO global sample`],
          ["非数値 / 精神", "件数を精神生態の得点にしない"],
        ],
      };
    }

    if (signalMode.id === "earth-organ") {
      const rows = signals.potential || [];
      const index = getSequenceIndex(rows.length);
      const row = rows[index];
      const current = (signals.current || []).find((entry) => entry.iso3 === row?.iso3);
      if (!row) return null;
      return {
        kind: "energy",
        phaseLabel: `GLOBAL SAMPLE / SITE ${String(index + 1).padStart(2, "0")} OF ${String(rows.length).padStart(2, "0")}`,
        yearLabel: `SITE ${String(index + 1).padStart(2, "0")}`,
        valueLabel: `${row.name} · SOLAR ${row.solarKwhM2Day?.toFixed(2) || "—"} · WIND ${row.windSpeedMs?.toFixed(2) || "—"}`,
        methodLabel: "POTENTIAL ≠ CURRENT SUPPLY / TWO POINTS = SCENARIO",
        timeLabel: `自然条件地点 / AUTO 01→${String(rows.length).padStart(2, "0")}`,
        selectedIndex: index,
        selected: row,
        legend: [
          ["黄円 / 太陽", `${row.solarKwhM2Day?.toFixed(2) || "—"} kWh/m²/day`],
          ["緑矢印 / 風", `${row.windSpeedMs?.toFixed(2) || "—"} m/s`],
          ["現在 / 同じ国", `${current?.year || "—"} renewables ${current?.renewablePercent?.toFixed(1) || "—"}%`],
          ["破線 / 二地点", `SCENARIO selection ${selectedEnergyRegions.length}/2`],
        ],
      };
    }

    if (signalMode.id === "senseware-2050") {
      const index = getSequenceIndex(9);
      const mode = modes[index];
      return {
        kind: "senseware",
        phaseLabel: `UNRESOLVED SIGNAL / ${String(index + 1).padStart(2, "0")} OF 09`,
        yearLabel: `SIGNAL ${String(index + 1).padStart(2, "0")}`,
        valueLabel: mode.titleJa,
        methodLabel: "NINE BRANCHES / NO AGGREGATE EARTH SCORE",
        timeLabel: "感覚信号 / AUTO 01→09",
        selectedIndex: index,
        selected: mode,
        legend: [
          ["枝 / 各信号", "異なる単位を別々に保持"],
          ["明るさ / 接触", "観客の軌跡による一時的な記憶"],
          ["中心 / 未完", "矛盾を平均せず並置"],
          ["総合点 / なし", "地球健康度へ換算しない"],
        ],
      };
    }

    return null;
  };

  const getAdvectedCurrentPosition = (row, horizonHours) => {
    const elapsedSeconds = horizonHours * 3600;
    const latitudeRadians = (row.lat * Math.PI) / 180;
    const longitudeMetersPerDegree = 111_320 * Math.max(0.2, Math.cos(latitudeRadians));
    return {
      lon: row.lon + (row.uMs * elapsedSeconds) / longitudeMetersPerDegree,
      lat: clamp(row.lat + (row.vMs * elapsedSeconds) / 111_320, -84, 84),
    };
  };

  const XCO2_COLOR_STOPS = Object.freeze([
    { value: 300, color: [40, 17, 95] },
    { value: 320, color: [40, 39, 154] },
    { value: 340, color: [21, 84, 199] },
    { value: 360, color: [15, 177, 217] },
    { value: 380, color: [30, 211, 167] },
    { value: 400, color: [179, 233, 63] },
    { value: 420, color: [255, 151, 31] },
    { value: 440, color: [239, 48, 36] },
    { value: 460, color: [200, 42, 132] },
    { value: 480, color: [213, 113, 224] },
    { value: 500, color: [255, 244, 255] },
  ]);

  const getXco2Color = (value, alpha = 1) => {
    const clamped = clamp(value, 300, 500);
    let upperIndex = XCO2_COLOR_STOPS.findIndex((stop) => stop.value >= clamped);
    if (upperIndex <= 0) upperIndex = 1;
    const lower = XCO2_COLOR_STOPS[upperIndex - 1];
    const upper = XCO2_COLOR_STOPS[upperIndex];
    const mix = clamp((clamped - lower.value) / Math.max(0.001, upper.value - lower.value), 0, 1);
    const color = lower.color.map((component, index) =>
      Math.round(component + (upper.color[index] - component) * mix),
    );
    return `rgba(${color.join(",")},${alpha})`;
  };

  const getCurrentSpeedColor = (speed, alpha = 1) => {
    const stops = [
      { value: 0, color: [13, 42, 104] },
      { value: 0.25, color: [14, 123, 190] },
      { value: 0.5, color: [39, 219, 226] },
      { value: 0.85, color: [119, 255, 194] },
      { value: 1.2, color: [255, 228, 91] },
      { value: 1.5, color: [255, 118, 61] },
    ];
    const clamped = clamp(speed, 0, 1.5);
    let upperIndex = stops.findIndex((stop) => stop.value >= clamped);
    if (upperIndex <= 0) upperIndex = 1;
    const lower = stops[upperIndex - 1];
    const upper = stops[upperIndex];
    const mix = clamp((clamped - lower.value) / Math.max(0.001, upper.value - lower.value), 0, 1);
    const color = lower.color.map((component, index) =>
      Math.round(component + (upper.color[index] - component) * mix),
    );
    return `rgba(${color.join(",")},${alpha})`;
  };

  const renderGosatHeatmap = (ctx, rect, left, top, state) => {
    const grid = state.gosat;
    const timeline = state.timeline;
    if (!grid || !timeline || !gosatHeatmapContext) return;
    const cacheKey = [
      timeline.cacheKey,
      mapScope,
      japanView.zoom,
      Math.round(left * 10),
      Math.round(top * 10),
      Math.round(rect.width),
      Math.round(rect.height),
    ].join("/");
    if (cacheKey !== gosatHeatmapCacheKey) {
      const width = Math.max(1, Math.ceil(rect.width));
      const height = Math.max(1, Math.ceil(rect.height));
      if (gosatHeatmapCanvas.width !== width || gosatHeatmapCanvas.height !== height) {
        gosatHeatmapCanvas.width = width;
        gosatHeatmapCanvas.height = height;
      }
      const heatmap = gosatHeatmapContext;
      heatmap.clearRect(0, 0, width, height);
      heatmap.globalCompositeOperation = "source-over";
      const resolution = grid.resolutionDegrees || 2.5;
      const longitudeCopies = mapScope === "earth" ? [-360, 0, 360] : [0];
      heatmap.beginPath();
      for (let row = 0; row < grid.height; row += 1) {
        const north = 90 - row * resolution;
        const south = north - resolution;
        for (let column = 0; column < grid.width; column += 1) {
          const cellIndex = row * grid.width + column;
          const value = getTimelineCellValue(timeline, cellIndex);
          if (!Number.isFinite(value)) continue;
          const imputed = timelineCellUsesSpatialImputation(timeline, cellIndex);
          const baseWest = -180 + column * resolution;
          for (const longitudeCopy of longitudeCopies) {
            const west = baseWest + longitudeCopy;
            const east = west + resolution;
            const northWest = japanWorldToScreen(west, north, left, top);
            const southEast = japanWorldToScreen(east, south, left, top);
            const cellLeft = Math.min(northWest.x, southEast.x);
            const cellTop = Math.min(northWest.y, southEast.y);
            const cellWidth = Math.abs(southEast.x - northWest.x);
            const cellHeight = Math.abs(southEast.y - northWest.y);
            if (
              cellLeft > width ||
              cellTop > height ||
              cellLeft + cellWidth < 0 ||
              cellTop + cellHeight < 0
            ) continue;
            heatmap.fillStyle = getXco2Color(value, imputed ? 0.34 : 0.6);
            heatmap.fillRect(cellLeft - 0.35, cellTop - 0.35, cellWidth + 0.7, cellHeight + 0.7);
            if (imputed) {
              heatmap.moveTo(cellLeft, cellTop + cellHeight);
              heatmap.lineTo(cellLeft + cellWidth, cellTop);
            }
          }
        }
      }
      heatmap.strokeStyle = "rgba(236, 251, 247, 0.2)";
      heatmap.lineWidth = 0.45;
      heatmap.stroke();
      gosatHeatmapCacheKey = cacheKey;
    }
    ctx.save();
    ctx.globalCompositeOperation = "screen";
    ctx.drawImage(gosatHeatmapCanvas, 0, 0, rect.width, rect.height);
    ctx.restore();
  };

  const getGosatCellRecord = (signalMode, longitude, latitude) => {
    const state = getBreathingEarthState(signalMode);
    const grid = state.gosat;
    const timeline = state.timeline;
    if (!grid || !timeline) return null;
    const resolution = grid.resolutionDegrees || 2.5;
    const column = clamp(Math.floor((longitude + 180) / resolution), 0, grid.width - 1);
    const row = clamp(Math.floor((90 - latitude) / resolution), 0, grid.height - 1);
    const west = -180 + column * resolution;
    const north = 90 - row * resolution;
    const cellIndex = row * grid.width + column;
    const valuePpm = getTimelineCellValue(timeline, cellIndex);
    const hasValue = Number.isFinite(valuePpm);
    const spatiallyImputed = timelineCellUsesSpatialImputation(timeline, cellIndex);
    const temporallyInterpolated =
      timeline.kind === "observed" && timeline.mix > 0.001 && timeline.mix < 0.999;
    const validationRmse = Math.max(
      timeline.frameA?.imputation?.validation?.rmsePpm || 0,
      timeline.frameB?.imputation?.validation?.rmsePpm || 0,
    );
    const provenance = timeline.kind === "scenario"
      ? "SCENARIO / これまでの傾向が続いた場合"
      : timeline.kind === "reconstruction"
        ? "DERIVED / 昔の記録から再現"
        : spatiallyImputed
          ? "DERIVED / 近くの8地点から補完"
          : temporallyInterpolated
            ? "DERIVED / 二つの時点のあいだ"
            : "SOURCE / 衛星地図から読み取った値";
    const relation = timeline.kind === "reconstruction"
      ? "この時代には全球を測った衛星地図がないため、昔のCO₂記録へ、後年の衛星地図の模様を重ねて再現しました。実測の世界地図ではありません。"
      : timeline.kind === "scenario"
        ? `直近10年の増え方を一本の線にまとめ、そのまま未来へ伸ばしました。予想のぶれ幅は${timeline.lower95Ppm.toFixed(1)}〜${timeline.upper95Ppm.toFixed(1)} ppmです。未来を言い当てる数字ではありません。`
        : spatiallyImputed
          ? `衛星が測れなかった場所です。近くの8地点を参考にし、近い値ほど強く反映して色を補いました。斜線が「計算で補った場所」の印です。計算の誤差目安は最大${validationRmse.toFixed(2)} ppmでした。`
          : temporallyInterpolated
            ? "観測した二つの時点のあいだを、まっすぐな変化でつないでいます。途中の値を実際に測ったわけではありません。"
            : "このマスはGOSATの公式衛星地図から読み取った値です。地図の色をCO₂濃度へ戻して表示しています。";
    return {
      kind: "gosat-grid",
      lon: west + resolution / 2,
      lat: north - resolution / 2,
      title: "CO₂ TIMELINE / 2.5° GRID",
      meta: hasValue
        ? `約 ${valuePpm.toFixed(1)} ppm / ${timeline.dateLabel} / ${provenance}`
        : `NO DATA / ${timeline.dateLabel}`,
      description: hasValue
        ? `この四角は、緯度 ${north - resolution}〜${north}°・経度 ${west}〜${west + resolution}°の空気を表しています。${timeline.warning}`
        : "手がかりが足りないため、ここには無理に数字を置いていません。",
      relation,
      valuePpm: hasValue ? valuePpm : null,
      provenance,
      frameDate: timeline.dateLabel,
      bounds: { west, east: west + resolution, south: north - resolution, north },
    };
  };

  const getModeDataPois = () => {
    const signalMode = getActiveSignalMode();
    if (!signalMode) return [];
    const { signals } = signalMode;
    if (signalMode.id === "breathing-earth") {
      return [];
    }
    if (signalMode.id === "blue-circulation") {
      const state = getBlueCirculationState(signalMode);
      return (signals.currents || []).map((row) => {
        const speed = Math.hypot(row.uMs, row.vMs);
        const distanceKm = speed * (state?.horizonHours || 0) * 3.6;
        return {
          kind: "current-vector",
          lon: row.lon,
          lat: row.lat,
          title: "海面流ベクトル / 局所移流",
          meta: `${state?.dateLabel || row.time} / ${speed.toFixed(2)} m/s / u ${row.uMs.toFixed(2)} / v ${row.vMs.toFixed(2)}`,
          description: `青い色はこの地点の合成流速です。表示中の${((state?.horizonHours || 0) / 24).toFixed(1)}日では、同じ速度と方向が続くと約${distanceKm.toFixed(1)} km進みます。`,
          relation:
            "SOURCEはNOAA CoastWatchのu/v。シアンの線と距離は一定ベクトルから計算したDERIVEDで、海況予測・漂流予報ではありません。OSCAR取得不能時の代替も台帳へ明記しています。",
        };
      });
    }
    if (signalMode.id === "forest-cloud-engine") {
      return (signals.precipitation || []).map((row) => ({
        kind: "sequence-poi",
        lon: row.lon,
        lat: row.lat,
        title: `${row.name}の降水気候値`,
        meta: `${row.precipitationMmDay?.toFixed(2) || "—"} mm/day / NASA POWER CLIMATOLOGY`,
        description: "年平均降水量を円の大きさと上昇粒子の密度へ変換しています。選択中の地点だけを強調します。",
        relation: `SOURCE / GLOBAL SAMPLE。${signals.precipitation?.length || 0}地点の一つで、全球を補間した値ではありません。MODIS全球土地被覆との重なりから因果関係は主張しません。`,
      }));
    }
    if (signalMode.id === "pollination-protocol") {
      return (signals.occurrences || []).map((row) => ({
        kind: "sequence-poi",
        lon: row.lon,
        lat: row.lat,
        title: row.species,
        meta: `${row.eventDate?.slice(0, 10) || "date unknown"} / GBIF ${row.key}`,
        description: `${row.country || "地域不明"}で記録された生物観察です。黄色い点と選択輪は、この観察記録だけを表します。`,
        relation: "SOURCE / GBIF。GloBIの送粉関係は文献上の別データであり、この観察地点で対象植物との関係が記録されたとは扱いません。",
      }));
    }
    if (signalMode.id === "nothing-is-waste") {
      return (signals.countryWaste || []).map((row) => {
        const imputed = row.valueStatus === "IMPUTED";
        return {
          ...row,
          kind: "sequence-poi",
          title: `${row.country}の都市ごみ再資源化率`,
          meta: imputed
            ? `計算で補った値 / ${row.recyclePercent.toFixed(1)}% / 近くの5か国を参照`
            : `${row.year} / ${row.recyclePercent.toFixed(1)}% / 国連の公式データ`,
          description: imputed
            ? `この地域には公式の数字がありませんでした。そこで、近くの5か国（${row.donorIso3?.join(" / ") || "—"}）を参考にし、真ん中の値を置いています。破線は「計算で補った値」の印です。`
            : "国連に報告された、この国の最新値です。実線の円が実際の統計、外側の破線は観客が動かす「もしも」です。",
          relation: imputed
            ? "近い国でも、ごみの制度や暮らし方は違います。この数字は公式値でも順位でもなく、データの空白について考えるための仮の目安です。"
            : "円の場所は、この国を代表する目印で、処理施設の位置ではありません。残りのごみが焼却か埋立かも、ここでは勝手に決めていません。",
        };
      });
    }
    if (signalMode.id === "anthropocene-scar") {
      return (signals.emissions || []).map((row) => ({
        ...row,
        kind: "sequence-poi",
        lon: row.lon,
        lat: row.lat,
        title: `${row.country}の温室効果ガス排出量`,
        meta: `${row.year} / ${row.emissionsMtCo2e.toFixed(1)} Mt CO₂e / excl. LULUCF`,
        description: "国別値を国の代表座標へ置き、排出量を対数半径の赤い環へ変換しています。",
        relation: "SOURCE / COUNTRY VALUE。白いNASA VIIRS夜間光とは別データです。代表座標を排出源と見なさず、夜間光から排出量を推定しません。",
      }));
    }
    if (signalMode.id === "rhythm-of-disaster") {
      return (signals.globalEvents || []).map((row) => ({
        ...row,
        lon: row.longitude,
        lat: row.latitude,
        kind: "sequence-poi",
        title: row.name,
        meta: `${String(row.occurredAt).slice(0, 10)} / M${row.magnitude.toFixed(1)} / DEPTH ${row.depthKm?.toFixed(0) || "—"} km`,
        description: "USGS FDSNから取得した2000年以降M7.5以上の震源です。全球で年代順に走査します。",
        relation: "SOURCE。Magnitudeと気象庁震度は別尺度です。日本の詳細記録でだけ、観測震度とP/S代表速度モデルを表示します。",
      }));
    }
    if (signalMode.id === "three-ecologies") {
      const stage = getMapSequenceState(signalMode)?.selectedIndex ?? 3;
      return [
        ...(stage === 0 || stage === 3 ? (signals.ecological || []).map((row) => ({ ...row, kind: "sequence-poi", title: `${row.country} / FOREST`, meta: `ECOLOGICAL / ${row.year} / ${row.forestPercent.toFixed(1)}%`, description: "国土に占める森林面積率を緑の面積へ変換した生態レイヤーです。", relation: "SOURCE / COUNTRY VALUE。森林の質や生物多様性を得点化しません。" })) : []),
        ...(stage === 1 || stage === 3 ? (signals.social || []).map((row) => ({ ...row, kind: "sequence-poi", title: `${row.country} / URBAN`, meta: `SOCIAL / ${row.year} / ${row.urbanPercent.toFixed(1)}%`, description: "都市人口比率を青い環へ変換した社会レイヤーです。", relation: "SOURCE / COUNTRY VALUE。幸福度や社会の優劣を表しません。" })) : []),
        ...(stage === 2 || stage === 3 ? (signals.culture || []).map((row) => ({ ...row, kind: "sequence-poi", title: row.name, meta: `CULTURE / ${row.category} / ${row.region}`, description: "UNESCO世界遺産から各大地域へ広がるよう選んだ文化・記憶レイヤーです。", relation: "SOURCE / GLOBAL SAMPLE。全件ではなく、件数を心の価値へ数値化しません。" })) : []),
      ];
    }
    if (signalMode.id === "earth-organ") {
      return (signals.potential || []).map((row) => ({
        kind: "sequence-poi",
        lon: row.lon,
        lat: row.lat,
        title: `${row.name}の自然エネルギー条件`,
        meta: `SOLAR ${row.solarKwhM2Day?.toFixed(2) || "—"} kWh/m²/day / WIND ${row.windSpeedMs?.toFixed(2) || "—"} m/s`,
        description: "NASA POWERの気候値で、設備容量・土地利用・系統制約を含まない自然条件です。",
        relation: `SOURCE / GLOBAL SAMPLE。${signals.potential?.length || 0}地点の一つです。現在の同国電源構成とは別レイヤーで、二地点を選んだ破線だけがSCENARIOです。`,
      }));
    }
    return [];
  };

  const renderMapInstallationEffect = (ctx, rect, nodePoints, now) => {
    const signalMode = getActiveSignalMode();
    if (!signalMode) return;
    const { left, top } = getJapanViewport();
    const time = reducedMotion ? 1.8 : now / 1000;
    const rgb = modes[modeToIndex].rgb;
    const center = { x: rect.width * 0.54, y: rect.height * 0.5 };
    const stroke = (alpha) => `rgba(${rgb}, ${alpha})`;
    const pointFor = (row) => japanWorldToScreen(row.lon, row.lat, left, top);
    const visible = (point, margin = 45) => point.x > -margin && point.x < rect.width + margin && point.y > -margin && point.y < rect.height + margin;
    const drawGlobalMercatorRaster = (image, alpha) => {
      if (!image.complete || !image.naturalWidth) return;
      const northWest = pointFor({ lon: -180, lat: 85.0511 });
      const southEast = pointFor({ lon: 180, lat: -85.0511 });
      const worldWidth = southEast.x - northWest.x;
      ctx.globalAlpha = alpha;
      for (const offset of [-worldWidth, 0, worldWidth]) {
        ctx.drawImage(image, northWest.x + offset, northWest.y, worldWidth, southEast.y - northWest.y);
      }
      ctx.globalAlpha = 1;
    };

    ctx.save();
    ctx.globalCompositeOperation = "screen";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    if (signalMode.id === "breathing-earth") {
      const state = getBreathingEarthState(signalMode);
      renderGosatHeatmap(ctx, rect, left, top, state);
      ctx.textAlign = "left";
    } else if (signalMode.id === "blue-circulation") {
      const state = getBlueCirculationState(signalMode);
      const longitudeCopies = mapScope === "earth" ? [-360, 0, 360] : [0];
      const pulse = reducedMotion ? 0.72 : 0.66 + Math.sin(time * 3.1) * 0.22;

      for (const row of state?.currents || []) {
        const speed = Math.hypot(row.uMs, row.vMs);
        const destination = getAdvectedCurrentPosition(row, state.horizonHours);
        for (const longitudeCopy of longitudeCopies) {
          const point = pointFor({ lon: row.lon + longitudeCopy, lat: row.lat });
          if (!visible(point, 80)) continue;
          const end = pointFor({ lon: destination.lon + longitudeCopy, lat: destination.lat });
          const radius = 20 + clamp(speed / 1.5, 0, 1) * 26;
          const field = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, radius);
          field.addColorStop(0, getCurrentSpeedColor(speed, 0.34));
          field.addColorStop(0.42, getCurrentSpeedColor(speed, 0.16));
          field.addColorStop(1, getCurrentSpeedColor(speed, 0));
          ctx.fillStyle = field;
          ctx.fillRect(point.x - radius, point.y - radius, radius * 2, radius * 2);

          if (state.horizonHours > 0.25) {
            ctx.beginPath();
            ctx.moveTo(point.x, point.y);
            ctx.lineTo(end.x, end.y);
            ctx.strokeStyle = getCurrentSpeedColor(speed, 0.4 + clamp(speed / 1.5, 0, 1) * 0.42);
            ctx.lineWidth = 0.8 + clamp(speed / 1.5, 0, 1) * 1.8;
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(end.x, end.y, 1.8 + speed * 1.35, 0, Math.PI * 2);
            ctx.fillStyle = getCurrentSpeedColor(speed, pulse);
            ctx.fill();
          }
          drawVectorArrow(
            ctx,
            point.x,
            point.y,
            row.uMs,
            row.vMs,
            getCurrentSpeedColor(speed, 0.74),
            45,
          );
        }
      }
      for (const row of signalMode.signals.climate || []) {
        if (!Number.isFinite(row.windSpeedMs)) continue;
        for (const longitudeCopy of longitudeCopies) {
          const point = pointFor({ lon: row.lon + longitudeCopy, lat: row.lat });
          if (!visible(point)) continue;
          const angle = ((row.windDirectionDeg || 0) - 90) * (Math.PI / 180);
          drawVectorArrow(
            ctx,
            point.x,
            point.y,
            Math.cos(angle) * row.windSpeedMs,
            -Math.sin(angle) * row.windSpeedMs,
            "rgba(255,255,255,.66)",
            5,
          );
        }
      }
    } else if (signalMode.id === "forest-cloud-engine") {
      const sequence = getMapSequenceState(signalMode);
      drawGlobalMercatorRaster(landCoverImage, 0.34);
      (signalMode.signals.precipitation || []).forEach((row, index) => {
        const point = pointFor(row);
        if (!visible(point)) return;
        const rain = clamp((row.precipitationMmDay || 0) / 8, 0, 1);
        const selected = index === sequence?.selectedIndex;
        ctx.beginPath();
        ctx.arc(point.x, point.y, 5 + rain * (selected ? 20 : 12), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(67,214,182,${selected ? 0.34 + rain * 0.34 : 0.08 + rain * 0.18})`;
        ctx.fill();
        if (selected) {
          ctx.beginPath();
          ctx.arc(point.x, point.y, 22 + rain * 22 + Math.sin(time * 2.2) * 3, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(168,255,222,.78)";
          ctx.lineWidth = 1.4;
          ctx.stroke();
        }
        const particleCount = selected ? 10 : 3;
        for (let particle = 0; particle < particleCount; particle += 1) {
          const rise = ((time * (5 + rain * 8) + particle * 17 + index * 7) % 55);
          ctx.fillStyle = `rgba(160,255,236,${selected ? 0.28 + rain * 0.58 : 0.08 + rain * 0.25})`;
          ctx.fillRect(point.x + (particle - 1.5) * 4, point.y - rise, 1.2, 4 + rain * 6);
        }
      });
    } else if (signalMode.id === "pollination-protocol") {
      const sequence = getMapSequenceState(signalMode);
      getModeDataPois().forEach((row, index) => {
        const point = pointFor(row);
        if (!visible(point)) return;
        const selected = index === sequence?.selectedIndex;
        ctx.fillStyle = "rgba(255,219,109,.84)";
        ctx.fillRect(point.x - (selected ? 2.5 : 1.5), point.y - (selected ? 2.5 : 1.5), selected ? 5 : 3, selected ? 5 : 3);
        if (selected) {
          for (let ring = 0; ring < 3; ring += 1) {
            ctx.beginPath();
            ctx.arc(point.x, point.y, 12 + ring * 8 + Math.sin(time * 2 + ring) * 2, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(255,${190 - ring * 20},220,${0.54 - ring * 0.12})`;
            ctx.stroke();
          }
        }
      });
    } else if (signalMode.id === "nothing-is-waste") {
      const sequence = getMapSequenceState(signalMode);
      (signalMode.signals.countryWaste || []).forEach((row, index) => {
        const point = pointFor(row);
        if (!visible(point)) return;
        const rate = clamp(row.recyclePercent / 100, 0, 1);
        const selected = index === sequence?.selectedIndex;
        const imputed = row.valueStatus === "IMPUTED";
        const radius = 4 + Math.sqrt(rate) * (selected ? 27 : 15);
        ctx.setLineDash(imputed ? [3, 3] : []);
        ctx.beginPath();
        ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
        ctx.strokeStyle = selected ? "rgba(118,255,194,.94)" : `rgba(98,239,177,${0.18 + rate * 0.42})`;
        ctx.lineWidth = selected ? 2 : 1;
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.arc(point.x, point.y, Math.max(2, radius * rate), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(74,225,158,${imputed ? (selected ? 0.18 : 0.07 + rate * 0.08) : (selected ? 0.38 : 0.12 + rate * 0.16)})`;
        ctx.fill();
        if (selected) {
          ctx.setLineDash([3, 6]);
          ctx.beginPath();
          ctx.arc(point.x, point.y, 8 + sequence.scenarioRecycle * 0.31, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(236,255,245,.82)";
          ctx.stroke();
          ctx.setLineDash([]);
          for (let particle = 0; particle < 20; particle += 1) {
            const angle = (particle / 20) * Math.PI * 2 + time * 0.45;
            const orbit = radius + 7 + (particle % 3) * 4;
            ctx.fillStyle = `rgba(156,255,211,${0.24 + rate * 0.5})`;
            ctx.fillRect(point.x + Math.cos(angle) * orbit, point.y + Math.sin(angle) * orbit, 1.4, 1.4);
          }
        }
      });
    } else if (signalMode.id === "anthropocene-scar") {
      const sequence = getMapSequenceState(signalMode);
      const emission = sequence?.selected;
      drawGlobalMercatorRaster(nightLightsImage, now < anthropocenePeelUntil ? 0.04 : 0.5);
      (signalMode.signals.emissions || []).forEach((row, index) => {
        const point = pointFor(row);
        if (!visible(point)) return;
        const load = clamp(Math.log10(Math.max(1, row.emissionsMtCo2e)) / 4, 0, 1);
        const selected = index === sequence?.selectedIndex;
        ctx.beginPath();
        ctx.arc(point.x, point.y, 5 + load * (selected ? 48 : 25), 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255,72,59,${selected ? 0.94 : 0.2 + load * 0.46})`;
        ctx.lineWidth = selected ? 2.2 : 1;
        ctx.stroke();
        if (selected) {
          ctx.beginPath();
          ctx.arc(point.x, point.y, 12 + load * 56 + Math.sin(time * 2.2) * 4, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(255,143,103,.42)";
          ctx.stroke();
        }
      });
    } else if (signalMode.id === "rhythm-of-disaster") {
      const sequence = getMapSequenceState(signalMode);
      (signalMode.signals.globalEvents || []).forEach((event) => {
        const point = pointFor({ lon: event.longitude, lat: event.latitude });
        if (!visible(point)) return;
        const selected = event.id === sequence?.selected?.id;
        ctx.beginPath();
        ctx.arc(point.x, point.y, selected ? 3.8 : 1.7, 0, Math.PI * 2);
        ctx.fillStyle = selected ? "rgba(255,206,112,.98)" : "rgba(255,143,90,.38)";
        ctx.fill();
      });
      const selected = sequence?.selected;
      if (selected) {
        const point = japanWorldToScreen(selected.longitude, selected.latitude, left, top);
        ctx.beginPath();
        ctx.arc(point.x, point.y, 16 + Math.sin(time * 2.4) * 4, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(255,177,86,.88)";
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      ctx.fillStyle = "rgba(255,190,108,.74)";
      ctx.font = '8px Consolas, "Courier New", monospace';
      ctx.fillText("USGS GLOBAL M7.5+ / JMA DETAIL KEEPS OBSERVED INTENSITY", 22, rect.height - 26);
    } else if (signalMode.id === "three-ecologies") {
      const stage = getMapSequenceState(signalMode)?.selectedIndex ?? 3;
      if (stage === 0 || stage === 3) drawGlobalMercatorRaster(landCoverImage, 0.42);
      getModeDataPois().forEach((row, index) => {
        const point = pointFor(row);
        if (!visible(point)) return;
        const ecological = row.meta.startsWith("ECOLOGICAL");
        const social = row.meta.startsWith("SOCIAL");
        const scale = ecological
          ? clamp((row.forestPercent || 0) / 100, 0, 1)
          : social
            ? clamp((row.urbanPercent || 0) / 100, 0, 1)
            : 0.45;
        ctx.beginPath();
        ctx.arc(point.x, point.y, ecological ? 4 + scale * 13 : social ? 5 + scale * 11 : 5, 0, Math.PI * 2);
        ctx.strokeStyle = ecological
          ? "rgba(92,242,145,.62)"
          : social
            ? "rgba(86,181,255,.62)"
            : "rgba(219,143,255,.72)";
        ctx.lineWidth = ecological || social ? 1.6 : 1;
        ctx.stroke();
        if (!ecological && !social) {
          ctx.beginPath();
          ctx.arc(point.x, point.y, 13 + Math.sin(time + index) * 3, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(219,143,255,.22)";
          ctx.stroke();
        }
      });
    } else if (signalMode.id === "earth-organ") {
      const sequence = getMapSequenceState(signalMode);
      const potential = signalMode.signals.potential || [];
      const points = potential.map((row) => ({ ...row, ...pointFor(row) })).filter((point) => visible(point));
      points.forEach((row, index) => {
        const solar = clamp((row.solarKwhM2Day || 0) / 7, 0, 1);
        const selected = potential.indexOf(row) === sequence?.selectedIndex || row.id === sequence?.selected?.id;
        const current = (signalMode.signals.current || []).find((entry) => entry.iso3 === row.iso3);
        const radius = 6 + solar * (selected ? 25 : 14);
        ctx.beginPath();
        ctx.arc(row.x, row.y, radius, 0, Math.PI * 2);
        ctx.strokeStyle = selected ? "rgba(255,239,129,.95)" : "rgba(255,223,100,.42)";
        ctx.lineWidth = selected ? 2 : 1;
        ctx.stroke();
        if (Number.isFinite(current?.renewablePercent)) {
          ctx.beginPath();
          ctx.arc(row.x, row.y, 2 + current.renewablePercent * (selected ? 0.2 : 0.11), 0, Math.PI * 2);
          ctx.fillStyle = selected ? "rgba(104,255,202,.48)" : "rgba(104,255,202,.2)";
          ctx.fill();
        }
        drawVectorArrow(ctx, row.x, row.y, row.windSpeedMs || 0, 0.1, "rgba(121,255,218,.62)", 4);
      });
      if (selectedEnergyRegions.length === 2) {
        const first = pointFor(selectedEnergyRegions[0]);
        const second = pointFor(selectedEnergyRegions[1]);
        ctx.setLineDash([3, 8]);
        ctx.lineDashOffset = -(now / 90);
        ctx.beginPath();
        ctx.moveTo(first.x, first.y);
        ctx.lineTo(second.x, second.y);
        ctx.strokeStyle = "rgba(200,255,236,.72)";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = "rgba(225,255,245,.86)";
        ctx.font = '8px Consolas, "Courier New", monospace';
        ctx.fillText("SCENARIO / DISTRIBUTED LINK", (first.x + second.x) / 2 + 8, (first.y + second.y) / 2 - 8);
      }
    } else {
      const sequence = getMapSequenceState(signalMode);
      const nine = modes.slice(0, 9).map((entry, index) => {
        const angle = (index / 9) * Math.PI * 2 - Math.PI / 2;
        return { x: center.x + Math.cos(angle) * rect.width * 0.27, y: center.y + Math.sin(angle) * rect.height * 0.31, memory: modeMemory[index] };
      });
      nine.forEach((node, index) => {
        const selected = index === sequence?.selectedIndex;
        ctx.beginPath();
        ctx.moveTo(center.x, center.y);
        ctx.lineTo(node.x, node.y);
        ctx.strokeStyle = `rgba(${modes[index].rgb},${selected ? 0.92 : 0.12 + node.memory * 0.58})`;
        ctx.lineWidth = selected ? 3.2 : 0.7 + node.memory * 2.2;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(node.x, node.y, selected ? 12 : 3 + node.memory * 8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${modes[index].rgb},${selected ? 0.96 : 0.45 + node.memory * 0.45})`;
        ctx.fill();
      });
      ctx.fillStyle = "rgba(230,255,255,.78)";
      ctx.font = '8px Consolas, "Courier New", monospace';
      ctx.fillText("NO TOTAL SCORE / CONTRADICTIONS REMAIN", center.x - 92, center.y + 5);
    }

    ctx.restore();
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

    const nodePoints = getActiveMapNodes().map((node) => ({
      ...node,
      ...japanWorldToScreen(node.lon, node.lat, left, top),
    }));

    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    renderSimplifiedWorldModel(ctx, rect, left, top);

    if (mapScope === "japan" && modeToIndex === 6) {
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
    }

    renderMapInstallationEffect(ctx, rect, nodePoints, now);

    if (modeToIndex === 6) {
      renderJapanHistoryReplay(ctx, rect, left, top, now);

      if (japanDataLayer === "snapshot") {
      const visibleEarthquakes = getVisibleEarthquakes();
      const strongestEarthquake = visibleEarthquakes.reduce(
        (strongest, event) =>
          !strongest || event.magnitude > strongest.magnitude ? event : strongest,
        null,
      );

      for (const [index, event] of visibleEarthquakes.entries()) {
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
    }

    if (modeToIndex !== 0) nodePoints.forEach((node, index) => {
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
      if (mapScope === "earth" || japanView.zoom >= JAPAN_ZOOM || index % 2 === 0) {
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

    getActiveMapNodes().forEach((node, index) => {
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

  const getVisibleEarthquakes = () => {
    if (mapScope === "earth") {
      return japanEarthquakes.slice(0, 320);
    }
    return japanEarthquakes
      .filter((event) => japanCoordinateIsVisible(event.longitude, event.latitude))
      .slice(0, 40);
  };

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
      return "MAP TILE OFFLINE / VECTOR EARTH MODEL ACTIVE";
    }
    if (modeToIndex !== 6) {
      const readout = getSignalReadout(getActiveSignalMode());
      return `${modes[modeToIndex].title.toUpperCase()} / ${readout.value}`;
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
      return "USGS LOCAL SNAPSHOT / LOADING BUNDLED OBSERVATIONS";
    }
    if (japanEarthquakeDataState === "snapshot") {
      return `USGS LOCAL SNAPSHOT / ${getVisibleEarthquakes().length} OBSERVATIONS / M7.5+ / 2000–2026`;
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

  const formatJapanDataTimestamp = (value) =>
    value ? formatJapanDataTime(value).replace("UPDATED ", "") : "—";

  const updateJapanDataInterface = () => {
    const observationCount = japanHistoryEvents.reduce(
      (total, event) => total + event.observations.length,
      0,
    );
    const historyTimestamp = formatJapanDataTimestamp(japanHistoryUpdatedAt);
    const earthquakeTimestamp = formatJapanDataTimestamp(japanDataUpdatedAt);

    if (japanHistoryDataState === "loading") {
      japanHistoryState.textContent = "過去の震度：気象庁データを読み込み中";
    } else if (japanHistoryDataState === "ready") {
      japanHistoryState.textContent = `過去の震度：読み込み済み（代表${japanHistoryEvents.length}地震・${observationCount}地点）`;
    } else if (japanHistoryDataState === "offline") {
      japanHistoryState.textContent = "過去の震度：読み込めませんでした";
    } else {
      japanHistoryState.textContent = "過去の震度：地図を開くと読み込みます";
    }
    japanHistoryUpdated.textContent = japanHistoryUpdatedAt
      ? `保存データ作成日：${historyTimestamp}`
      : "保存データ作成日：—";
    dataLedger.updateJma({
      state: japanHistoryDataState,
      eventCount: japanHistoryEvents.length,
      observationCount,
      retrievedAt: historyTimestamp,
    });

    if (japanEarthquakeDataState === "loading") {
      japanDataState.textContent = "全球の震源：同梱スナップショットを読み込み中";
    } else if (japanEarthquakeDataState === "snapshot") {
      japanDataState.textContent = `全球の震源：保存データを表示中（M7.5以上・${japanEarthquakes.length}件）`;
    } else if (japanEarthquakeDataState === "offline") {
      japanDataState.textContent = "全球の震源：同梱データを読み込めませんでした";
    } else {
      japanDataState.textContent = "全球の震源：地図を開くと同梱データを読み込みます";
    }
    japanDataUpdated.textContent = japanDataUpdatedAt
      ? `保存データ作成日：${earthquakeTimestamp}`
      : "保存データ作成日：—";
    dataLedger.updateUsgs({
      state: japanEarthquakeDataState,
      scope: mapScope,
      totalCount: japanEarthquakes.length,
      visibleCount: getVisibleEarthquakes().length,
      retrievedAt: earthquakeTimestamp,
    });
  };

  const updateMapObservationNarrative = () => {
    const signalMode = gaiaModeById.get(modes[modeToIndex].id);
    if (modeToIndex !== 6) {
      if (signalMode?.id === "breathing-earth") {
        japanObservationKicker.textContent = "CO₂ TIMELINE / 1958 → 2050 / 60 SEC LOOP";
        japanObservationCopy.textContent =
          "濃い色は衛星が見た値、斜線は近くの観測から補った値。未来は、これまでの増え方が続いた場合の「もしも」。地図を押すと、その色の出どころが読める。";
      } else if (signalMode?.id === "blue-circulation") {
        japanObservationKicker.textContent = "OCEAN TRANSPORT / DAY 0 → 14 / 45 SEC LOOP";
        japanObservationCopy.textContent =
          "青は海流速度、シアン線はu/vを一定とした実距離の局所移流、白は別データの年平均風。観測点を押すと停止して値を読める。";
      } else if (signalMode) {
        const narratives = {
          "forest-cloud-engine": ["LAND COVER × RAIN / GLOBAL RASTER + 31 SITES", "地表色はMODIS全球土地被覆、水色はNASA POWER地点降水。全球ラスターと点サンプルを分け、降水を補間しない。"],
          "pollination-protocol": ["POLLINATION EVIDENCE / GLOBAL SAMPLE / 48 SEC LOOP", "黄点は31か国から最大2件ずつ抽出したGBIF観察地点。GloBIの文献関係とは地理的に接続しない。"],
          "nothing-is-waste": ["WASTE DATA / MEASURED, FILLED, IMAGINED", "実線は国連の公式値、破線は近い5か国から補った値。外側の破線は、あなたが動かす未来の「もしも」。"],
          "anthropocene-scar": ["ANTHROPOCENE / GLOBAL COUNTRY GHG / 48 SEC LOOP", "赤はEDGAR由来の国別GHG、白はNASA VIIRS全球夜間光。二つを同じ量として扱わない。"],
          "three-ecologies": ["THREE ECOLOGIES / GLOBAL LAYERS / 48 SEC LOOP", "MODIS全球土地被覆・国別都市人口比率・UNESCO全球サンプルを、異なる意味のまま順に開いて重ねる。"],
          "earth-organ": ["ENERGY CONDITIONS / 31 GLOBAL SITES / 48 SEC LOOP", "黄は地点別の太陽・風、緑は同国の再エネ電力比率。二地点の破線だけを仮想接続とする。"],
          "senseware-2050": ["UNFINISHED SENSEWARE / 9 SIGNALS / 48 SEC LOOP", "九つの異なる信号を一本ずつ聴く。単位の違いと矛盾を平均せず、地球健康度の総合点を作らない。"],
        };
        const [kicker, copy] = narratives[signalMode.id] || [
          `ACT ${signalMode.act.number} / ${signalMode.act.en}`,
          signalMode.question,
        ];
        japanObservationKicker.textContent = kicker;
        japanObservationCopy.textContent = copy;
      }
      return;
    }
    if (japanDataLayer === "history") {
      japanObservationKicker.textContent = "JMA HISTORY / SHINDO 6-JAKU+";
      japanObservationCopy.textContent =
        "世界地図の中で、日本の代表6地震と震度6弱以上の実測地点を読む。地震を選ぶと実時間のP波・S波を再生する。";
    } else {
      japanObservationKicker.textContent = "USGS SNAPSHOT / M7.5+ / 2000–2026";
      japanObservationCopy.textContent =
        "同梱したUSGSの全球M7.5以上の震源を表示。閲覧中はAPIへ接続せず、点を押すと位置・規模・深さ・発生時刻を読める。";
    }
  };

  const setJapanDataLayer = (layer) => {
    japanDataLayer = layer === "snapshot" ? "snapshot" : "history";
    japanHistoryLayerButton.setAttribute(
      "aria-pressed",
      japanDataLayer === "history" ? "true" : "false",
    );
    japanLiveLayerButton.setAttribute(
      "aria-pressed",
      japanDataLayer === "snapshot" ? "true" : "false",
    );
    closeJapanPoi();
    updateMapObservationNarrative();
    japanMapStatus.textContent = getJapanObservationStatus();
  };

  const setMapScope = (_scope = "earth", { resetLayer = true } = {}) => {
    mapScope = "earth";
    japanLayer.dataset.mapScope = mapScope;
    mapScopeKicker.textContent = "Planetary lens / Open map";
    japanTitle.textContent = "地球を聴く";
    japanDescription.textContent =
      "ひとつの惑星を、国境ではなく水・熱・生命・地殻の循環として読む。世界の公開データを、地球が発する異なる信号として聴く。";
    mapScopeNote.innerHTML =
      "PLANETARY BASE / LOCAL VECTOR MODEL<br />DETAIL: OPENSTREETMAP WHEN AVAILABLE";
    japanMap.setAttribute(
      "aria-label",
      "ドラッグで移動し、世界の公開データ信号を選んで解説を読む世界地図",
    );
    historyLayerLabel.textContent = "日本の震度6弱+";
    liveLayerLabel.textContent = "世界 M7.5+";
    closeJapanPoi();
    japanPulses.length = 0;
    resetJapanView();
    if (resetLayer) {
      setJapanDataLayer("snapshot");
    } else {
      setJapanDataLayer(japanDataLayer);
    }
    updateJapanDataInterface();
    updateSignalInterface();
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
    if (co2TimelineHeld) {
      co2TimelineHeld = false;
      co2TimelineStartedAt =
        performance.now() - (signalTimePosition / 100) * getActiveTimelineDuration();
      updateSignalInterface();
    }
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

    if (poi.type === "data") {
      const record = poi.record;
      if (getActiveSignalMode()) {
        co2TimelineHeld = true;
        updateSignalInterface();
      }
      japanPoiType.textContent = `${modes[modeToIndex].titleJa} / DATA POI`;
      japanPoiTitle.textContent = record.title;
      japanPoiMeta.textContent = record.meta;
      japanPoiDescription.textContent = record.description;
      if (modeToIndex === 8) {
        const existingIndex = selectedEnergyRegions.findIndex((entry) => entry.title === record.title);
        if (existingIndex >= 0) selectedEnergyRegions.splice(existingIndex, 1);
        else {
          if (selectedEnergyRegions.length >= 2) selectedEnergyRegions.shift();
          selectedEnergyRegions.push(record);
        }
        japanPoiRelation.textContent = `${record.relation} / SCENARIO選択 ${selectedEnergyRegions.length}/2。二地点で仮想分散リンクを描きます。`;
      } else {
        japanPoiRelation.textContent = record.relation;
      }
      japanWaveReplay = null;
      showJapanPoiCard(clientX, clientY);
    } else if (poi.type === "history") {
      const event = poi.event;
      co2TimelineHeld = true;
      updateSignalInterface();
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
      co2TimelineHeld = true;
      updateSignalInterface();
      japanPoiType.textContent = "USGS OBSERVATION / EARTH SIGNAL";
      japanPoiTitle.textContent = `M${event.magnitude.toFixed(1)} / ${event.place}`;
      japanPoiMeta.textContent = `${formatJapanEventTime(event.time)} / DEPTH ${Math.round(
        event.depthKm,
      )} KM`;
      japanPoiDescription.textContent =
        "橙の点はUSGSの公開記録から作成し、作品へ同梱した震源スナップショットです。円の大きさはマグニチュード、濃さは深さを手がかりにした表示ですが、揺れの強さや被害範囲を示すものではありません。";
      japanPoiRelation.textContent =
        "SNAPSHOTレイヤーは、2000年以降の大規模地震が地球全体へどう分布してきたかを読む層です。表示中にAPI更新は行いません。このデータには各地の震度を重ねていないため、P/S波や揺れの広がりも推測して描きません。観測されていない意味を足さないことも、センスウェアの設計に含めています。";
      japanWaveReplay = null;
      showJapanPoiCard(clientX, clientY);
    } else {
      const node = poi.node;
      co2TimelineHeld = true;
      updateSignalInterface();
      japanPoiType.textContent = "CURATED LISTENING NODE / ARTISTIC POI";
      japanPoiTitle.textContent = node.nameJa;
      japanPoiMeta.textContent = `${node.name} / ${node.lat.toFixed(2)}°N ${node.lon.toFixed(2)}°E`;
      japanPoiDescription.textContent = node.description;
      japanPoiRelation.textContent = node.relation;
      japanWaveReplay = null;
      showJapanPoiCard(clientX, clientY);
    }
  };

  const findJapanPoiAt = (clientX, clientY, pointerType = "") => {
    const { rect, left, top } = getJapanViewport();
    const localX = clientX - rect.left;
    const localY = clientY - rect.top;
    const touchLikePointer =
      coarsePointer || pointerType === "touch" || pointerType === "pen";
    const hitRadii = MAP_POI_HIT_RADII[touchLikePointer ? "coarse" : "fine"];
    let closest = null;

    const considerCandidate = (candidate, point, hitRadius) => {
      const distance = Math.hypot(localX - point.x, localY - point.y);
      if (distance <= hitRadius && (!closest || distance < closest.distance)) {
        closest = { ...candidate, distance };
      }
    };

    getModeDataPois().forEach((record, index) => {
      const point = japanWorldToScreen(record.lon, record.lat, left, top);
      considerCandidate({ type: "data", record, index }, point, hitRadii.node);
    });

    if (modeToIndex === 6) {
      if (japanDataLayer === "history") {
        japanHistoryEvents.forEach((event, index) => {
          const point = japanWorldToScreen(event.longitude, event.latitude, left, top);
          considerCandidate({ type: "history", event, index }, point, hitRadii.history);
        });
      } else {
        getVisibleEarthquakes().forEach((event, index) => {
          const point = japanWorldToScreen(event.longitude, event.latitude, left, top);
          considerCandidate(
            { type: "earthquake", event, index },
            point,
            hitRadii.earthquake,
          );
        });
      }
    }

    if (modes[modeToIndex].id !== "breathing-earth") {
      getActiveMapNodes().forEach((node, index) => {
        const point = japanWorldToScreen(node.lon, node.lat, left, top);
        considerCandidate({ type: "node", node, index }, point, hitRadii.node);
      });
    }

    if (!closest && modes[modeToIndex].id === "breathing-earth") {
      const signalMode = getActiveSignalMode();
      const location = japanScreenToLonLat(localX, localY, left, top);
      const record = signalMode
        ? getGosatCellRecord(signalMode, location.lon, location.lat)
        : null;
      if (record) closest = { type: "data", record, index: -1, distance: 0 };
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
    setMapScope("japan", { resetLayer: false });
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
      dataLedger.setJsonPreview("jma", data, "data/jma-intensity-history.json");
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
      dataLedger.setPreviewError("jma", "JMA JSON LOAD FAILED");
    }
    updateJapanDataInterface();
    japanMapStatus.textContent = getJapanObservationStatus();
    maybeOpenJapanEventFromUrl();
  };

  const loadJapanEarthquakes = async () => {
    if (
      japanEarthquakeDataState === "loading" ||
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
      const snapshot = gaiaSnapshot || (await fetchJsonWithTimeout(GAIA_SIGNALS_DATA));
      const earthquakeMode = snapshot.modes?.find((mode) => mode.id === "rhythm-of-disaster");
      const globalEvents = earthquakeMode?.signals?.globalEvents || [];
      dataLedger.setJsonPreview(
        "usgs-earthquakes",
        globalEvents,
        "data/gaia-signals.json / 07 globalEvents",
      );
      japanEarthquakes = globalEvents
        .map((event) =>
          normalizeJapanEarthquake({
            id: event.id,
            time: event.occurredAt,
            magnitude: event.magnitude,
            place: event.name,
            longitude: event.longitude,
            latitude: event.latitude,
            depthKm: event.depthKm,
          }),
        )
        .filter(
          (event) =>
            Number.isFinite(event.longitude) &&
            Number.isFinite(event.latitude) &&
            Number.isFinite(event.magnitude) &&
            event.magnitude >= 7.5,
        )
        .sort((first, second) => Date.parse(second.time) - Date.parse(first.time))
        .slice(0, 320);
      if (japanEarthquakes.length === 0) {
        throw new Error("USGS globalEvents snapshot is empty");
      }
      japanEarthquakeDataState = "snapshot";
      japanDataUpdatedAt = snapshot.generatedAt || null;
    } catch {
      japanEarthquakes = [];
      japanEarthquakeDataState = "offline";
      japanDataUpdatedAt = null;
      dataLedger.setPreviewError("usgs-earthquakes", "LOCAL USGS SNAPSHOT LOAD FAILED");
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

  const getActiveSignalMode = () => gaiaModeById.get(modes[modeToIndex].id) || null;

  const pickByPosition = (values, position = signalTimePosition) => {
    if (!Array.isArray(values) || values.length === 0) return null;
    const index = Math.round(clamp(position / 100, 0, 1) * (values.length - 1));
    return values[index];
  };

  const getSignalReadout = (signalMode) => {
    if (!signalMode) {
      if (gaiaSnapshotError) {
        return {
          output: "ERROR",
          value: "DATA SNAPSHOT ERROR",
          note: `公開データを読み込めませんでした。再読み込みしてください。 (${gaiaSnapshotError})`,
          temporal: false,
        };
      }
      return { output: "—", value: "DATA SNAPSHOT LOADING", note: "公開データを読み込んでいます。", temporal: false };
    }
    const { signals } = signalMode;
    if (signalMode.id === "breathing-earth") {
      const state = getBreathingEarthState(signalMode);
      const { co2, temperature } = state;
      if (japanIsOpen) {
        const timeline = state.timeline;
        const grid = state.gosat;
        return {
          output: timeline
            ? `${timeline.dateLabel} / ${timeline.kind.toUpperCase()}`
            : "TIMELINE LOADING",
          value: timeline
            ? timeline.kind === "scenario"
              ? `${timeline.referencePpm.toFixed(1)} ppm / 予想の幅 ${timeline.lower95Ppm.toFixed(1)}–${timeline.upper95Ppm.toFixed(1)}`
              : `${timeline.referencePpm.toFixed(1)} ppm / 実測 ${timeline.observedCells || 0} + 補完 ${timeline.imputedCells || 0}`
            : "CO₂ TIMELINE LOADING",
          note: timeline
            ? `${timeline.warning} 世界地図をタップすると${grid?.resolutionDegrees || 2.5}°セルの値を表示します。`
            : "1958〜2050の時系列を準備しています。",
          temporal: true,
        };
      }
      return {
        output: `${co2.year}-${String(co2.month).padStart(2, "0")}`,
        value: `${co2.averagePpm.toFixed(2)} ppm / ΔT ${temperature?.anomalyC?.toFixed(2) ?? "—"} ℃`,
        note: "NOAAの季節成分が全球フレームの収縮、長期基準値が線の強さ、NASA気温偏差が背景色です。地図の時系列モデルとは別に保持しています。",
        temporal: true,
      };
    }
    if (signalMode.id === "blue-circulation") {
      const state = getBlueCirculationState(signalMode);
      return {
        output: `${state?.dateLabel || "SNAPSHOT"} / DAY ${((state?.horizonHours || 0) / 24).toFixed(1)}`,
        value: `MEAN ${state?.meanSpeedMs.toFixed(2) || "—"} m/s / ${state?.vectorCount || 0} VECTORS`,
        note: `${state?.warning || "海流を読み込んでいます。"} 青=海流、白=年平均風。`,
        temporal: true,
      };
    }
    if (signalMode.id === "forest-cloud-engine") {
      const state = getMapSequenceState(signalMode);
      const rain = state?.selected;
      return {
        output: state?.phaseLabel || "GLOBAL SAMPLE",
        value: `PRECIP ${rain?.precipitationMmDay?.toFixed(2) ?? "—"} mm/day / MODIS LAND COVER 2023`,
        note: "全球の土地被覆ラスターへ、層化した31地点の降水を重ねます。降水は点間を補間せず、重なりから因果関係を主張しません。",
        temporal: true,
      };
    }
    if (signalMode.id === "pollination-protocol") {
      const state = getMapSequenceState(signalMode);
      const occurrence = state?.selected;
      return {
        output: state?.phaseLabel || "GBIF RECORD",
        value: `${signals.interactions?.length || 0} RELATIONS / ${signals.occurrences?.length || 0} OCCURRENCES`,
        note: occurrence ? `${occurrence.species} / ${occurrence.country || "country unknown"}。観察地点と文献関係の場所は結びません。` : "記録を読み込んでいます。",
        temporal: true,
      };
    }
    if (signalMode.id === "nothing-is-waste") {
      const state = getMapSequenceState(signalMode);
      const imputed = state?.selected?.valueStatus === "IMPUTED";
      return {
        output: state?.phaseLabel || "COUNTRY VALUE",
        value: `${imputed ? "補った値" : "公式値"} ${state?.sourceRecycle.toFixed(1) || "—"}% → もしも ${state?.scenarioRecycle.toFixed(1) || "—"}%`,
        note: imputed
          ? `${state?.selected?.country || "国"}には公式値がないため、近くの5か国の真ん中の値を置きました。内側の破線が補完、外側の破線が観客の「もしも」です。`
          : `${state?.selected?.country || "国"} ${state?.selected?.year || "—"}。実線は国連の公式値、外側の破線は観客が動かす「もしも」です。`,
        temporal: true,
      };
    }
    if (signalMode.id === "anthropocene-scar") {
      const state = getMapSequenceState(signalMode);
      const emission = state?.selected;
      return {
        output: state?.phaseLabel || "COUNTRY VALUE",
        value: `${emission?.country || "—"} / ${emission?.emissionsMtCo2e?.toFixed(1) || "—"} Mt CO₂e`,
        note: "赤い国別GHGと白い全球VIIRS夜間光は別レイヤーです。長押しで夜間光だけを剥がし、同じ量として扱いません。",
        temporal: true,
      };
    }
    if (signalMode.id === "rhythm-of-disaster") {
      const state = getMapSequenceState(signalMode);
      const event = state?.selected;
      return {
        output: state?.phaseLabel || "USGS GLOBAL HISTORY",
        value: event ? `M${event.magnitude.toFixed(1)} / DEPTH ${event.depthKm?.toFixed(0) || "—"} km` : "NO EVENT",
        note: "2000年以降M7.5以上を全球走査。Magnitudeを震度へ変換せず、日本の詳細記録だけが実測震度とP/S代表速度を持ちます。",
        temporal: true,
      };
    }
    if (signalMode.id === "three-ecologies") {
      const state = getMapSequenceState(signalMode);
      return {
        output: state?.phaseLabel || "THREE LAYERS",
        value: state?.selected?.name || "ECOLOGICAL / SOCIAL / MEMORY",
        note: "生態・社会・文化を順に見た後、別レイヤーのまま重ねます。精神生態の総合点は作りません。",
        temporal: true,
      };
    }
    if (signalMode.id === "earth-organ") {
      const state = getMapSequenceState(signalMode);
      const potential = state?.selected;
      const current = (signals.current || []).find((row) => row.iso3 === potential?.iso3);
      return {
        output: state?.phaseLabel || potential?.name || "REGION",
        value: `${potential?.solarKwhM2Day?.toFixed(2) || "—"} kWh/m²/day / CURRENT ${current?.renewablePercent?.toFixed(1) || "—"}%`,
        note: "外側は自然条件の潜在量、内側は現在の供給比率。二地点の接続はSCENARIOです。",
        temporal: true,
      };
    }
    const state = getMapSequenceState(signalMode);
    return {
      output: state?.phaseLabel || "NO TOTAL SCORE",
      value: "9 SIGNALS + AUDIENCE TRACES",
      note: `${state?.selected?.titleJa || "九つの信号"}を選択中。矛盾する単位を平均せず、九本の枝として残します。`,
      temporal: true,
    };
  };

  const getShaderSignalVector = () => {
    const signalMode = getActiveSignalMode();
    if (!signalMode) return [0.35, 0.25, 0.15, 0.1];
    const { signals } = signalMode;
    if (signalMode.id === "breathing-earth") {
      const row = pickByPosition(signals.co2);
      const temperature = signals.temperature?.find((entry) => entry.year === row?.year);
      return [
        clamp(((row?.deseasonalizedPpm || 315) - 315) / 120, 0, 1),
        clamp(((row?.averagePpm || 0) - (row?.deseasonalizedPpm || 0) + 5) / 10, 0, 1),
        clamp(((temperature?.anomalyC || 0) + 0.5) / 2, 0, 1),
        0.2,
      ];
    }
    if (signalMode.id === "blue-circulation") {
      const rows = signals.currents || [];
      const mean = rows.length ? rows.reduce((sum, row) => sum + Math.hypot(row.uMs, row.vMs), 0) / rows.length : 0;
      return [clamp(mean / 0.7, 0, 1), 0.35, clamp(rows.length / 24, 0, 1), 0.45];
    }
    if (signalMode.id === "forest-cloud-engine") {
      const row = pickByPosition(signals.precipitation);
      return [clamp((row?.precipitationMmDay || 0) / 8, 0, 1), 0.42, 0.7, 0.25];
    }
    if (signalMode.id === "pollination-protocol") {
      return [clamp((signals.interactions?.length || 0) / 30, 0, 1), clamp((signals.occurrences?.length || 0) / 30, 0, 1), 0.55, 0.35];
    }
    if (signalMode.id === "nothing-is-waste") {
      const recycling = getMapSequenceState(signalMode)?.sourceRecycle || 0;
      return [recycling / 100, signalTimePosition / 100, 0.46, 0.24];
    }
    if (signalMode.id === "anthropocene-scar") {
      const row = getMapSequenceState(signalMode)?.selected;
      return [clamp(Math.log10(Math.max(1, row?.emissionsMtCo2e || 1)) / 4, 0, 1), 0.78, anthropocenePeelUntil > performance.now() ? 0.05 : 0.8, 0.18];
    }
    if (signalMode.id === "rhythm-of-disaster") {
      const event = getMapSequenceState(signalMode)?.selected;
      return [clamp(((event?.magnitude || 7.5) - 7.5) / 2, 0, 1), clamp((event?.depthKm || 0) / 700, 0, 1), 0.84, 0.22];
    }
    if (signalMode.id === "three-ecologies") {
      return [0.62, clamp((signals.social?.length || 0) / 10, 0, 1), clamp((signals.culture?.length || 0) / 10, 0, 1), 0.5];
    }
    if (signalMode.id === "earth-organ") {
      const row = pickByPosition(signals.potential);
      return [clamp((row?.solarKwhM2Day || 0) / 7, 0, 1), clamp((row?.windSpeedMs || 0) / 10, 0, 1), selectedEnergyRegions.length / 2, 0.4];
    }
    return [0.72, 0.48, pointer.energy, modeMemory[modeToIndex]];
  };

  const updateSignalInterface = () => {
    const signalMode = getActiveSignalMode();
    const readout = getSignalReadout(signalMode);
    const isBreathingTimeline = signalMode?.id === "breathing-earth";
    const isCirculationTimeline = signalMode?.id === "blue-circulation";
    const sequenceState = !isBreathingTimeline && !isCirculationTimeline
      ? getMapSequenceState(signalMode)
      : null;
    const timelineState = isBreathingTimeline
      ? getBreathingEarthState(signalMode).timeline
      : isCirculationTimeline
        ? getBlueCirculationState(signalMode)
        : sequenceState;
    const showTimeline = Boolean(japanIsOpen && timelineState);
    co2TimelineDisplay.hidden = !showTimeline;
    japanLayer.classList.toggle("is-co2-timeline", showTimeline);
    if (showTimeline) {
      co2TimelineDisplay.dataset.phase = timelineState.kind;
      const timelineTransport = reducedMotion
        ? "STATIC"
        : co2TimelineHeld || performance.now() < co2TimelinePausedUntil
          ? "PAUSED"
          : "AUTO";
      co2TimelinePhase.textContent = `${timelineState.phaseLabel} · ${timelineTransport}`;
      co2TimelineYear.textContent = timelineState.yearLabel;
      co2TimelinePpm.textContent = isCirculationTimeline
        ? timelineState.dateLabel
        : sequenceState
          ? timelineState.valueLabel
          : timelineState.kind === "scenario"
            ? `${timelineState.referencePpm.toFixed(1)} ppm · 幅 ${timelineState.lower95Ppm.toFixed(1)}–${timelineState.upper95Ppm.toFixed(1)}`
            : `${timelineState.referencePpm.toFixed(1)} ppm`;
      co2TimelineMethod.textContent = timelineState.methodLabel;
    }
    signalConsoles.forEach((consoleElement) => {
      consoleElement.querySelector("[data-signal-act]").textContent = signalMode
        ? `ACT ${signalMode.act.number} / ${signalMode.act.title}`
        : "DATA SNAPSHOT";
      consoleElement.querySelector("[data-signal-value]").textContent = readout.value;
      consoleElement.querySelector("[data-signal-time-output]").textContent = readout.output;
      consoleElement.querySelector("[data-signal-note]").textContent = readout.note;
      consoleElement.querySelector("[data-signal-time-label]").textContent = showTimeline
        ? timelineState.timeLabel || (isCirculationTimeline
          ? "移流時間 / AUTO 0→14 DAYS"
          : "時点 / AUTO 1958→2050")
        : "観測時点";
      const input = consoleElement.querySelector("[data-signal-time]");
      input.value = String(signalTimePosition);
      input.disabled = !readout.temporal;
      consoleElement.classList.toggle("is-static", !readout.temporal);
    });
    if (mapSignalEncodingLegend) {
      const showEncodingLegend = Boolean(timelineState);
      mapSignalEncodingLegend.hidden = !showEncodingLegend;
      mapSignalEncodingLegend.dataset.mode = timelineState?.kind || "co2";
      if (showEncodingLegend) {
        const setEncodingLabel = (key, value) => {
          const element = mapSignalEncodingLegend.querySelector(`[data-encoding-label="${key}"]`);
          if (element) element.lastChild.textContent = value;
        };
        const setEncodingValue = (key, value) => {
          const element = mapSignalEncodingLegend.querySelector(`[data-encoding-value="${key}"]`);
          if (!element) return;
          element.textContent = value;
          element.title = value;
        };

        if (sequenceState) {
          const keys = ["heatmap", "nodata", "estimate", "resolution"];
          sequenceState.legend.forEach(([label, value], index) => {
            setEncodingLabel(keys[index], label);
            setEncodingValue(keys[index], value);
          });
        } else if (isCirculationTimeline) {
          setEncodingLabel("heatmap", "色 / 海流速度");
          setEncodingLabel("nodata", "暗部 / 未補間");
          setEncodingLabel("estimate", "線 / 局所移流");
          setEncodingLabel("resolution", "白矢印 / 風");
          setEncodingValue("heatmap", `0–1.5 m/s FIXED · MAX ${timelineState.maximumSpeedMs.toFixed(2)}`);
          setEncodingValue("nodata", "観測点間と陸域を値で埋めない");
          setEncodingValue(
            "estimate",
            `${(timelineState.horizonHours / 24).toFixed(1)} DAYS · MEAN ${timelineState.meanDistanceKm.toFixed(1)} km`,
          );
          setEncodingValue("resolution", `NASA POWER CLIMATOLOGY · ${signalMode.signals.climate?.length || 0} sites`);
        } else {
          setEncodingLabel("heatmap", "色 / CO₂濃度");
          setEncodingLabel("nodata", "斜線 / まわりから補った値");
          setEncodingLabel("estimate", "表示 / データの種類");
          setEncodingLabel("resolution", "1セル / 2.5°");
          const state = getBreathingEarthState(signalMode);
          const timeline = state.timeline;
          const grid = state.gosat;
          const totalCells = (grid?.width || 0) * (grid?.height || 0);
          setEncodingValue(
            "heatmap",
            timeline
              ? `300–500 ppm FIXED · ${timeline.dateLabel}`
              : "LOADING",
          );
          setEncodingValue(
            "nodata",
            timeline
              ? `${timeline.imputedCells || 0} / ${totalCells} マス · 近くの8地点を参照`
              : "—",
          );
          setEncodingValue("estimate", timeline?.phaseLabel || "—");
          setEncodingValue(
            "resolution",
            timeline?.kind === "scenario"
              ? `${grid?.resolutionDegrees || 2.5}° / 予想の幅 ${timeline.lower95Ppm.toFixed(1)}–${timeline.upper95Ppm.toFixed(1)} ppm`
              : `${grid?.resolutionDegrees || 2.5}° / 実測 ${timeline?.observedCells || 0} + 補完 ${timeline?.imputedCells || 0}`,
          );
        }
      }
    }
  };

  const getActiveTimelineDuration = () => {
    const id = getActiveSignalMode()?.id;
    if (id === "breathing-earth") return CO2_TIMELINE_DURATION_MS;
    if (id === "blue-circulation") return CIRCULATION_TIMELINE_DURATION_MS;
    return MODE_SEQUENCE_DURATION_MS;
  };

  const restartCo2Timeline = (position = 0) => {
    const now = performance.now();
    const activeId = getActiveSignalMode()?.id;
    const reducedMotionPosition = activeId === "breathing-earth"
      ? ((2025.9 - CO2_TIMELINE_START_YEAR) /
          (CO2_TIMELINE_END_YEAR - CO2_TIMELINE_START_YEAR)) *
        100
      : activeId === "blue-circulation"
        ? 50
        : 0;
    signalTimePosition = clamp(reducedMotion ? reducedMotionPosition : position, 0, 100);
    co2TimelineStartedAt = now - (signalTimePosition / 100) * getActiveTimelineDuration();
    co2TimelinePausedUntil = 0;
    co2TimelineLastStep = -1;
    co2TimelineHeld = false;
    gosatHeatmapCacheKey = "";
    updateSignalInterface();
  };

  const updateCo2TimelineAnimation = (now) => {
    const signalMode = getActiveSignalMode();
    const isTimelineMode = Boolean(signalMode);
    if (
      reducedMotion ||
      !japanIsOpen ||
      !isTimelineMode ||
      co2TimelineHeld
    ) return;

    const duration = getActiveTimelineDuration();

    if (co2TimelinePausedUntil > 0) {
      if (now < co2TimelinePausedUntil) return;
      co2TimelineStartedAt = now - (signalTimePosition / 100) * duration;
      co2TimelinePausedUntil = 0;
    }

    const totalSteps = signalMode.id === "breathing-earth"
      ? (CO2_TIMELINE_END_YEAR - CO2_TIMELINE_START_YEAR) *
        CO2_TIMELINE_STEPS_PER_YEAR
      : signalMode.id === "blue-circulation"
        ? CIRCULATION_TIMELINE_STEPS
        : MODE_SEQUENCE_STEPS;
    const loopProgress =
      ((now - co2TimelineStartedAt) % duration) /
      duration;
    const step = Math.floor(loopProgress * totalSteps);
    if (step === co2TimelineLastStep) return;
    co2TimelineLastStep = step;
    signalTimePosition = (step / totalSteps) * 100;
    updateSignalInterface();
  };

  const DATA_TRANSFORMS = Object.freeze({
    "breathing-earth": `// SPATIAL IMPUTATION / DERIVED
// Keep every observed cell; fill only null cells with k=8 inverse-distance weights.
const donors = nearestObservedCells(cell, 8, { wrapLongitude: true });
const imputed = sum(donors, d => d.value / d.distance ** 2)
              / sum(donors, d => 1 / d.distance ** 2);
// Validation: hide up to 128 observed cells, predict them, report RMSE and MAE.

const year = mix(1958, 2050, timelinePosition);

if (year < firstGosatYear) {
  value = earliestGosatPattern + (noaaBaseline(year) - earliestGridMean); // DERIVED
} else if (year <= lastGosatYear) {
  value = linearInterpolate(imputedGosatFrames, year); // DERIVED
} else {
  // OLS on the latest 120 deseasonalized NOAA monthly observations.
  // y_hat(t) = y_bar + beta1 * (t - t_bar)
  const projection = olsTrend.predict(year, { predictionInterval: 0.95 });
  value = lastGosatGrid + projection.changeSince(lastGosatYear); // SCENARIO
  showPredictionInterval(projection.lower95, projection.upper95);
}

drawGridCell(lon, lat, 2.5, fixedColorScale(value, 300, 500), {
  hatch: cell.wasSpatiallyImputed,
});
// The OLS projection assumes an unchanged linear trend; it is not a climate model.`,
    "blue-circulation": `// SOURCE: NOAA CoastWatch daily u/v snapshot (OSCAR timeout fallback)
const speedMs = Math.hypot(uMs, vMs);
drawSpeedHalo(fixedColorScale(speedMs, 0, 1.5));

// DERIVED: local constant-vector transport, 0–14 days
const seconds = timelineDays * 24 * 60 * 60;
const deltaLat = vMs * seconds / 111320;
const deltaLon = uMs * seconds / (111320 * Math.cos(latitudeRadians));
drawActualScaleTrack(lon, lat, lon + deltaLon, lat + deltaLat);

// NASA POWER wind climatology stays a separate white-arrow layer.
// This is not an ocean forecast or a drift prediction.`,
    "forest-cloud-engine": `const selectedSite = precipitationSites[sequenceIndex];
const vaporDensity = normalize(selectedSite.precipitationMmDay, 0, 8);
drawRainSignal(selectedSite, vaporDensity); // SOURCE value → DERIVED particles
drawMercatorRaster(modisIgbpLandCover2023); // GLOBAL rendered classification
// Rain is a 31-point GLOBAL SAMPLE: no interpolation and no causal claim.`,
    "pollination-protocol": `const occurrence = gbifOccurrences[sequenceIndex];
drawGeographicPoint(occurrence.lat, occurrence.lon); // SOURCE location

const documented = globi.filter(row => row.interaction === "pollinates");
showRelationCount(documented.length); // literature evidence, non-geographic
// Never connect a GloBI plant relation to a GBIF point without matching evidence.`,
    "nothing-is-waste": `const observed = unSdgCountryValues; // SOURCE / 17 reported regions
const missingCountry = selectedSites.filter(site => !observed.has(site.iso3));
for (const country of missingCountry) {
  const donors = nearestCountriesWithOfficialValues(country, 5);
  country.recyclePercent = median(donors.map(d => d.recyclePercent)); // DERIVED
  country.valueStatus = "IMPUTED";
}

const country = allCountryValues[sequenceIndex];
drawRecycleCircle(country.recyclePercent);
drawOutline(country.valueStatus === "IMPUTED" ? "DASHED" : "SOLID");
// Geographic proximity does not explain policy or reporting-definition differences.

const scenarioRecycle = clamp(country.recyclePercent + scenarioSweep, 0, 100); // SCENARIO
drawOuterDashedScenario(scenarioRecycle); // SOURCE and DERIVED base values remain visible`,
    "anthropocene-scar": `for (const country of edgarCountryValues) {
  drawEmissionRing(Math.log10(country.emissionsMtCo2e)); // COUNTRY VALUE
}
drawMercatorRaster(viirsNightLights2016); // separate observed-radiance layer
const nightLightOpacity = longPress ? 0.04 : 0.5;
// Night-light radiance is never converted to emissions.`,
    "rhythm-of-disaster": `drawGlobalEpicentres(usgsM75Since2000); // Magnitude, depth, time\n// Only a selected JMA detailed event owns observed intensity stations:\nconst distanceKm = Math.hypot(greatCircleKm(epicenter, station), depthKm);\nconst pArrivalSec = distanceKm / 7.0;\nconst sArrivalSec = distanceKm / 4.0;\nif (elapsedSec >= sArrivalSec) drawObservedJmaIntensity(station.intensity);`,
    "three-ecologies": `const layers = [modisGlobalLandCover, countryUrbanPercent, unescoGlobalSample];
drawLayer(layers[sequencePhase]); // ECO → SOCIAL → MEMORY → ALL
// Keep source definitions separate; do not turn culture counts into a mental score.
memories.push({ lon, lat, label: audienceText }); // non-numeric`,
    "earth-organ": `const site = nasaPowerSites[sequenceIndex];
drawPotential(site.solarKwhM2Day, site.windSpeedMs); // SOURCE climate conditions
const current = countryRenewableShare.find(v => v.iso3 === site.iso3);
drawCurrent(current.renewablePercent); // COUNTRY VALUE, separate adoption indicator
scenarioLinks.push([selectedRegionA, selectedRegionB]); // SCENARIO, not a grid plan`,
    "senseware-2050": `const selectedSignal = nineSignals[sequenceIndex];
drawSelectedBranch(selectedSignal);
drawAudienceMemory(audienceTraces);
// Deliberately no averaging across units and no "Earth health score".`,
  });

  const renderCodeLines = (text) => {
    sourceCode.replaceChildren();
    const fragment = document.createDocumentFragment();

    for (const line of text.split("\n")) {
      const lineElement = document.createElement("span");
      lineElement.className = "code-line";
      lineElement.textContent = line || " ";
      fragment.append(lineElement);
    }
    sourceCode.append(fragment);
  };

  const renderSource = () => {
    const mode = modes[modeToIndex];
    const signalMode = getActiveSignalMode();
    sourceTabs.forEach((tab) =>
      tab.setAttribute("aria-selected", tab.dataset.sourceTab === activeSourceTab ? "true" : "false"),
    );
    if (activeSourceTab === "transform") {
      renderCodeLines(DATA_TRANSFORMS[mode.id] || "// No transform registered.");
      sourceFile.textContent = `${formatModeNumber(modeToIndex)}-${mode.id}.transform.js`;
      sourceLanguage.textContent = "VANILLA JAVASCRIPT";
    } else if (activeSourceTab === "raw") {
      const rawPreview = signalMode
        ? {
            notice: "FIRST 10 ROWS PER DATASET / full snapshot: data/gaia-signals.json",
            statisticalMethods: signalMode.statisticalMethods || [],
            statisticalPolicy: gaiaSnapshot?.statisticalPolicy || null,
            datasets: signalMode.datasets.map((dataset) => ({
              id: dataset.id,
              kind: dataset.kind,
              organisation: dataset.organisation,
              url: dataset.url,
              unit: dataset.unit,
              resolution: dataset.resolution,
              preview: (dataset.preview || []).slice(0, 10),
            })),
          }
        : {
            state: gaiaSnapshotError ? "DATA SNAPSHOT ERROR" : "DATA SNAPSHOT LOADING",
            error: gaiaSnapshotError || undefined,
          };
      renderCodeLines(
        JSON.stringify(rawPreview, null, 2),
      );
      sourceFile.textContent = `${formatModeNumber(modeToIndex)}-${mode.id}.snapshot.json`;
      sourceLanguage.textContent = "JSON / FIRST-PARTY SNAPSHOT";
    } else {
      renderCodeLines(mode.source);
      sourceFile.textContent = `${formatModeNumber(modeToIndex)}-${mode.id}.frag`;
      sourceLanguage.textContent = "GLSL ES 3.00";
    }
    sourceTitle.textContent = mode.title;
  };

  const loadGaiaSignals = async () => {
    try {
      gaiaSnapshotError = null;
      const response = await fetch(GAIA_SIGNALS_DATA, { cache: "no-cache" });
      if (!response.ok) throw new Error(`GAIA snapshot ${response.status}`);
      gaiaSnapshot = await response.json();
      gaiaModeById = new Map(gaiaSnapshot.modes.map((mode) => [mode.id, mode]));
      updateModeInterface();
    } catch (error) {
      console.error(error);
      gaiaSnapshotError = error instanceof Error ? error.message : String(error);
      updateSignalInterface();
    }
  };

  sourceTabs.forEach((button) => {
    button.addEventListener("click", () => {
      activeSourceTab = button.dataset.sourceTab;
      sourceTabs.forEach((tab) =>
        tab.setAttribute("aria-selected", tab === button ? "true" : "false"),
      );
      renderSource();
    });
  });

  signalTimeInputs.forEach((input) => {
    input.addEventListener("input", () => {
      signalTimePosition = Number(input.value);
      if (japanIsOpen) {
        co2TimelineHeld = false;
        co2TimelinePausedUntil = performance.now() + CO2_TIMELINE_MANUAL_PAUSE_MS;
        co2TimelineLastStep = -1;
      }
      signalTimeInputs.forEach((peer) => {
        if (peer !== input) peer.value = input.value;
      });
      updateSignalInterface();
    });
  });

  const renderConcept = () => {
    const mode = modes[modeToIndex];
    const concept = modeConcepts[mode.id];
    const position = `${formatModeNumber(modeToIndex)} / ${MODE_COUNT}`;

    conceptNumber.textContent = position;
    conceptPosition.textContent = position;
    conceptTitle.textContent = mode.titleJa;
    conceptTitleEn.textContent = mode.title;
    conceptLead.textContent = concept.lead;
    conceptSeeing.textContent = `${concept.seeing}\n\n${modeDataNarratives[mode.id]}`;
    conceptTouch.textContent = concept.touch;
    conceptContext.textContent = `${concept.context}\n\n${lectureResumeLinks[mode.id]}`;
    conceptQuestion.textContent = concept.question;
  };

  const updateIntroSelection = () => {
    const choice = INTRO_MODE_CHOICES[modeToIndex];
    if (!choice) return;

    introSelectionNumber.textContent = `${formatModeNumber(modeToIndex)} / ${choice.code}`;
    introSelectionTitle.textContent = `${choice.label}の声`;
    introSelectionCopy.textContent = choice.copy;
    introEnter.firstElementChild.textContent = `${choice.label}を光で見る`;
    introJapan.firstElementChild.textContent = `${choice.label}を世界地図で見る`;
    introModeButtons.forEach((button, index) => {
      button.setAttribute("aria-selected", index === modeToIndex ? "true" : "false");
      button.tabIndex = index === modeToIndex ? 0 : -1;
    });
  };

  const updateModeInterface = () => {
    const mode = modes[modeToIndex];
    modeNumber.textContent = formatModeNumber(modeToIndex);
    modeTitle.textContent = mode.title;
    modeTitleJa.textContent = mode.titleJa;
    modeDescription.textContent = mode.description;
    experience.style.setProperty("--accent", mode.accent);
    experience.style.setProperty("--accent-rgb", mode.rgb);
    japanLayer.style.setProperty("--map-accent", mode.accent);
    japanLayer.style.setProperty("--map-accent-rgb", mode.rgb);
    japanLayer.classList.toggle("is-earthquake-mode", modeToIndex === 6);
    japanModeNumber.textContent = formatModeNumber(modeToIndex);
    japanModeTitle.textContent = mode.titleJa;
    document.querySelector('meta[name="theme-color"]').setAttribute("content", "#03070d");

    modeButtons.forEach((button, index) => {
      button.setAttribute("aria-current", index === modeToIndex ? "true" : "false");
    });
    conceptModeButtons.forEach((button, index) => {
      button.setAttribute("aria-current", index === modeToIndex ? "true" : "false");
    });
    japanModeButtons.forEach((button, index) => {
      button.setAttribute("aria-current", index === modeToIndex ? "true" : "false");
    });
    updateIntroSelection();

    renderSource();
    renderConcept();
    updateSignalInterface();
    const signalMode = getActiveSignalMode();
    if (signalMode && gaiaSnapshot) {
      updateMapObservationNarrative();
      dataLedger.updateMode(
        { ...signalMode, titleJa: mode.titleJa },
        modeToIndex + 1,
        gaiaSnapshot.generatedAt,
      );
    }
  };

  const selectMode = (index, { resetAutoTimer = true } = {}) => {
    const normalizedIndex = (index + MODE_COUNT) % MODE_COUNT;
    if (normalizedIndex === modeToIndex) {
      if (japanIsOpen) {
        restartCo2Timeline(0);
        if (normalizedIndex === 6) setJapanDataLayer("history");
      }
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
    if (japanIsOpen) {
      restartCo2Timeline(0);
      if (normalizedIndex === 6) setJapanDataLayer("history");
    }
    if (conceptIsOpen) {
      conceptScroll.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
    }
  };

  modes.forEach((mode, index) => {
    const introChoice = INTRO_MODE_CHOICES[index];
    const introModeButton = document.createElement("button");
    const introModeNumber = document.createElement("span");
    const introModeLabel = document.createElement("strong");
    const introModeCue = document.createElement("small");
    introModeButton.className = "intro-mode-choice";
    introModeButton.type = "button";
    introModeButton.setAttribute("role", "option");
    introModeButton.setAttribute("aria-selected", index === modeToIndex ? "true" : "false");
    introModeButton.setAttribute(
      "aria-label",
      `${formatModeNumber(index)} ${introChoice.label}、${introChoice.cue}`,
    );
    introModeButton.tabIndex = index === modeToIndex ? 0 : -1;
    introModeNumber.textContent = formatModeNumber(index);
    introModeLabel.textContent = introChoice.label;
    introModeCue.textContent = introChoice.cue;
    introModeButton.append(introModeNumber, introModeLabel, introModeCue);
    introModeButton.addEventListener("click", () => {
      selectMode(index);
      updateIntroSelection();
    });
    introModeButtons.push(introModeButton);
    introModeList.append(introModeButton);

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

    const japanModeButton = document.createElement("button");
    japanModeButton.className = "map-mode-button";
    japanModeButton.type = "button";
    japanModeButton.textContent = formatModeNumber(index);
    japanModeButton.setAttribute(
      "aria-label",
      `${formatModeNumber(index)} ${mode.titleJa}の地図演出へ切り替える`,
    );
    japanModeButton.setAttribute("aria-current", index === 0 ? "true" : "false");
    japanModeButton.addEventListener("click", () => selectMode(index));
    japanModeButtons.push(japanModeButton);
    japanModeList.append(japanModeButton);
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
    japanView.pressStartedAt = performance.now();
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
    const pressDuration = performance.now() - japanView.pressStartedAt;
    if (createPulse && !japanView.dragged && modeToIndex === 5 && pressDuration >= 650) {
      anthropocenePeelUntil = performance.now() + 6000;
      japanMapStatus.textContent = "NIGHT LIGHT PEELED / EMISSIONS LAYER REMAINS";
    } else if (createPulse && !japanView.dragged) {
      const poi = findJapanPoiAt(event.clientX, event.clientY, event.pointerType);
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
    const nextHash = isOpen ? "#earth" : "";
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
    respectUrlMode = true,
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
    japanButton.title = "Close map";
    experience.classList.add("japan-open");
    setEarthControlsDisabled(true);
    japanTilesDirty = true;
    nextAutoAt = performance.now() + AUTO_INTERVAL;
    const mapParameters = new URLSearchParams(window.location.search);
    const requestedDataLayer = mapParameters.get("layer");
    const requestedMode = Number(mapParameters.get("mode"));
    const requestedTimelinePosition = Number(mapParameters.get("time"));
    if (
      respectUrlMode &&
      Number.isInteger(requestedMode) &&
      requestedMode >= 1 &&
      requestedMode <= MODE_COUNT
    ) {
      selectMode(requestedMode - 1);
    }
    setMapScope("earth");
    restartCo2Timeline(
      Number.isFinite(requestedTimelinePosition)
        ? clamp(requestedTimelinePosition, 0, 100)
        : 0,
    );
    if (requestedDataLayer === "history" || requestedDataLayer === "snapshot") {
      setJapanDataLayer(requestedDataLayer);
    } else if (requestedDataLayer === "live") {
      setJapanDataLayer("snapshot");
    } else if (modeToIndex === 6) {
      setJapanDataLayer("history");
    }
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
    japanButton.title = "Earth map";
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
    introLayer.scrollTop = 0;
    updateIntroSelection();
    requestAnimationFrame(() =>
      (introModeButtons[modeToIndex] || introEnter).focus({ preventScroll: true }),
    );
  };

  const closeIntro = ({ restoreFocus = introRestoreFocus } = {}) => {
    if (!introIsOpen) {
      return;
    }
    introIsOpen = false;
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
  japanLiveLayerButton.addEventListener("click", () => setJapanDataLayer("snapshot"));
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
  introArchitectureJump.addEventListener("click", () => {
    architectureExhibit.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "start",
    });
    introArchitectureBack.focus({ preventScroll: true });
  });
  introArchitectureBack.addEventListener("click", () => {
    introLayer.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
    (introModeButtons[modeToIndex] || introEnter).focus({ preventScroll: true });
  });
  introJapan.addEventListener("click", () => {
    closeIntro({ restoreFocus: false });
    openJapan({ respectUrlMode: false });
  });
  window.addEventListener("hashchange", () => {
    if (window.location.hash === "#source") {
      closeIntro({ restoreFocus: false });
      closeJapan({ restoreFocus: false, updateHash: false });
      closeConcept({ restoreFocus: false, updateHash: false });
      openSource({ updateHash: false });
    } else if (window.location.hash === "#concept") {
      closeIntro({ restoreFocus: false });
      closeJapan({ restoreFocus: false, updateHash: false });
      closeSource({ restoreFocus: false, updateHash: false });
      openConcept({ updateHash: false });
    } else if (
      window.location.hash === "#earth" ||
      window.location.hash === "#japan" ||
      window.location.hash === "#data"
    ) {
      closeIntro({ restoreFocus: false });
      closeSource({ restoreFocus: false, updateHash: false });
      closeConcept({ restoreFocus: false, updateHash: false });
      openJapan({ updateHash: false, restoreFocusOnClose: false });
      if (window.location.hash === "#data") openJapanData();
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
      } else if (
        ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key) &&
        introModeButtons.includes(document.activeElement)
      ) {
        event.preventDefault();
        const currentIndex = introModeButtons.indexOf(document.activeElement);
        const direction = event.key === "ArrowLeft" || event.key === "ArrowUp" ? -1 : 1;
        const nextIndex = (currentIndex + direction + MODE_COUNT) % MODE_COUNT;
        selectMode(nextIndex);
        updateIntroSelection();
        introModeButtons[nextIndex].focus({ preventScroll: true });
      } else if (event.key === "Tab") {
        event.preventDefault();
        const targets = [
          ...introModeButtons,
          introEnter,
          introJapan,
          introArchitectureJump,
          introArchitectureBack,
        ];
        const currentIndex = targets.indexOf(document.activeElement);
        const direction = event.shiftKey ? -1 : 1;
        const nextIndex =
          currentIndex === -1
            ? 0
            : (currentIndex + direction + targets.length) % targets.length;
        targets[nextIndex].focus();
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
      } else if (/^[1-9]$/.test(event.key)) {
        selectMode(Number(event.key) - 1);
      } else if (event.key === "0") {
        selectMode(9);
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
    const isMobileMap = window.innerWidth <= 720;
    const desiredMapZoom = isMobileMap ? EARTH_MOBILE_ZOOM : EARTH_ZOOM;
    if (japanView.zoom !== desiredMapZoom) {
      resetJapanView();
    }
    gl.viewport(0, 0, width, height);
  };

  const render = (now) => {
    resize();
    updateCo2TimelineAnimation(now);
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
    const signalVector = getShaderSignalVector();
    gl.uniform4f(uniforms.signal, signalVector[0], signalVector[1], signalVector[2], signalVector[3]);
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
        const hiddenElapsed = performance.now() - hiddenAt;
        hiddenDuration += hiddenElapsed;
        co2TimelineStartedAt += hiddenElapsed;
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
  setMapScope("earth");
  updateModeInterface();
  updateAutoInterface();
  resize();
  startRendering();
  loadGaiaSignals();

  if (window.location.hash === "#source") {
    openSource({ updateHash: false });
  } else if (window.location.hash === "#concept") {
    openConcept({ updateHash: false });
  } else if (
    window.location.hash === "#earth" ||
    window.location.hash === "#japan" ||
    window.location.hash === "#data"
  ) {
    openJapan({ updateHash: false, restoreFocusOnClose: false });
    if (window.location.hash === "#data") openJapanData();
  } else {
    openIntro({ restoreFocusOnClose: false });
  }
})();
