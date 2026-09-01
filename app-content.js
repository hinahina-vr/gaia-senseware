// Deployment cache marker: gaia-human-history-2.
(() => {
  "use strict";

  const JAPAN_NODES = [
    {
      name: "NAHA",
      nameJa: "那覇・南西諸島",
      lon: 127.68,
      lat: 26.21,
      description: "那覇のまわりには、暖かい海流、サンゴ礁、台風の通り道、観光都市があります。海の変化が暮らしに近い場所です。",
      relation: "関係する展示：02 海流と風、07 自然・社会・文化の三つの層。",
    },
    {
      name: "YAKUSHIMA",
      nameJa: "屋久島",
      lon: 130.52,
      lat: 30.36,
      description: "屋久島では、高い山に降った雨が古い森を通り、川になって海へ流れます。森と水のつながりを見やすい場所です。",
      relation: "関係する展示：03 森林と雨。",
    },
    {
      name: "ASO",
      nameJa: "阿蘇",
      lon: 131.1,
      lat: 32.88,
      description: "阿蘇の地形は火山活動によってできました。その上で草原、農業、湧水、集落の暮らしが続いています。",
      relation: "関係する展示：06 地震と大地の変化。",
    },
    {
      name: "NOTO",
      nameJa: "能登",
      lon: 136.9,
      lat: 37.3,
      description: "能登では、里山と里海、農業と漁業、祭りや集落の暮らしが近い距離で結ばれてきました。",
      relation: "関係する展示：04 資源の行方、07 自然・社会・文化の三つの層。",
    },
    {
      name: "TOKYO",
      nameJa: "東京",
      lon: 139.69,
      lat: 35.68,
      description: "東京には、遠くから食料、電力、水、物が集まり、大量のごみや排出も生まれます。都市と地球のつながりが見える場所です。",
      relation: "関係する展示：05 夜の光と排出量、08 エネルギー。",
    },
    {
      name: "SENDAI",
      nameJa: "仙台・三陸沿岸",
      lon: 140.87,
      lat: 38.27,
      description: "仙台と三陸沿岸は、海、川、平野、都市が接する地域です。災害の記録と、その後の防災やまちづくりが重なっています。",
      relation: "関係する展示：06 地震、07 自然・社会・文化の三つの層。",
    },
    {
      name: "NEMURO",
      nameJa: "根室・道東",
      lon: 145.58,
      lat: 43.33,
      description: "根室の暮らしは、寒流、湿原、漁業、渡り鳥など、国境を越えて動く海や生きものと深く関わっています。",
      relation: "関係する展示：02 海流と風。",
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
      description: "アマゾンでは、広い森林と雨、大気、生きもの、人の暮らしが結びついています。遠く離れた地域での消費も、土地利用に影響します。",
      relation: "関係する展示：03 森林と雨、05 夜の光と排出量。",
    },
    {
      name: "ARCTIC",
      nameJa: "北極圏",
      lon: 20,
      lat: 74,
      description: "北極圏では、氷、海、大気の変化が互いに影響します。人の少ない地域ですが、その変化は世界の気候とつながっています。",
      relation: "関係する展示：01 CO₂と気温、07 自然・社会・文化の三つの層。",
    },
    {
      name: "SAHEL",
      nameJa: "サヘル",
      lon: 15,
      lat: 15,
      description: "サヘルでは、雨の量や時期が農業、牧畜、人の移動に大きく関わります。気候と暮らしを一緒に見るための地点です。",
      relation: "関係する展示：06 地球の変動、07 自然・社会・文化の三つの層。",
    },
    {
      name: "HIMALAYA",
      nameJa: "ヒマラヤ水系",
      lon: 85,
      lat: 28,
      description: "ヒマラヤの雪や氷河から流れ出す水は、国境を越える大きな川となり、上流から下流まで多くの暮らしを支えます。",
      relation: "関係する展示：02 水と風の循環。",
    },
    {
      name: "CORAL SEA",
      nameJa: "サンゴ海",
      lon: 150,
      lat: -18,
      description: "サンゴ海では、海水温の変化がサンゴや魚に影響し、沿岸の暮らしや観光にもつながります。",
      relation: "関係する展示：02 水と風の循環。",
    },
    {
      name: "ANDES",
      nameJa: "アンデス",
      lon: -70,
      lat: -22,
      description: "アンデスでは、鉱物資源、高地の水、生態系、鉱山の町が近くにあります。私たちが使う機器の材料が採られる地域の一つです。",
      relation: "関係する展示：04 資源の行方、08 エネルギーと人工物。",
    },
    {
      name: "SOUTHERN OCEAN",
      nameJa: "南大洋",
      lon: 30,
      lat: -55,
      description: "南大洋の海流は、熱と炭素を世界の海へ運びます。陸から遠く見えますが、地球の気候に大きく関わる海です。",
      relation: "関係する展示：01 CO₂と気温、02 海流と風。",
    },
  ];

  // Emergency-only geometry shown while the local Natural Earth reference is
  // loading or unavailable. The normal map uses the 1:50m coastline dataset.
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

  const INTRO_PATHS = {
    abstract: {
      kicker: "Abstract mode / Touch the signal",
      title: "どの感覚に、<br />触れますか？",
      lead: "地球が発している9つの信号から、最初に触れるものを選んでください。指やマウスの動きに、光が応答します。",
      prompt: "最初に触れる感覚器を選ぶ",
      note: "マウスを重ねると説明が変わります。クリックすると、選んだ光をすぐに始めます。",
    },
    map: {
      kicker: "Map mode / Read the planet",
      title: "どの信号を、<br />地図で読みますか？",
      lead: "光の意味を世界の場所へ戻します。気になる信号を選び、観測値がどこで記録されたのかをたどってください。",
      prompt: "最初に地図へ重ねる感覚器を選ぶ",
      note: "マウスを重ねると説明が変わります。クリックすると、その信号の地図をすぐに開きます。",
    },
    novel: {
      kicker: "Story mode / Listen to the planet",
      title: "どこから、<br />物語を始めますか？",
      lead: "毎週オンラインで話していたミズハとアマネが、海の近くで初めて出会います。二人は、待ち合わせに来ないサクヤが残した9つの観測記録をたどりながら、人間と地球のこれからを探します。最初から読むなら「01 空気」を選んでください。",
      prompt: "物語を始める場面を選ぶ",
      note: "カードにマウスを重ねると、その場面のあらすじが表示されます。クリックすると、選んだ場面から始まります。",
    },
    space: {
      kicker: "Space mode / Read the cosmos",
      title: "どの宇宙の信号を、<br />観測しますか？",
      lead: "NASA・JPL・JAXAから取得して作品内に保存した記録です。太陽から系外惑星まで、最初に開く観測窓を選んでください。",
      prompt: "最初に見る宇宙の観測窓を選ぶ",
      note: "マウスを重ねると説明が変わります。クリックすると、その観測窓をすぐに開きます。表示は保存済みデータです。",
    },
  };

  const INTRO_MODE_CHOICES = [
    {
      label: "空気",
      cue: "CO₂と気温",
      code: "AIR",
      copy: "CO₂が季節ごとに上下しながら、長い目では増えてきた様子を見る。",
    },
    {
      label: "海",
      cue: "海流の14日移動",
      code: "OCEAN",
      copy: "ある一日の海流が変わらないと仮定し、0〜14日後の移動距離をたどる。白い風矢印は比較用です。",
    },
    {
      label: "森",
      cue: "森林と雨",
      code: "FOREST",
      copy: "森林だけを緑で強調し、31地点の雨量と同じ場所で見比べる。",
    },
    {
      label: "ごみ",
      cue: "再資源化率を比べる",
      code: "RECYCLING",
      copy: "国ごとの現在値を比べ、選んだ国に自分の改善目標を置く。",
    },
    {
      label: "都市",
      cue: "1945年からの排出",
      code: "CITY",
      copy: "1945年からの国別化石燃料由来CO₂を年送りし、2016年の夜間光と見比べる。",
    },
    {
      label: "地震",
      cue: "地球の揺れ",
      code: "QUAKE",
      copy: "世界の大地震と、日本各地で実際に記録された揺れをたどる。",
    },
    {
      label: "暮らし",
      cue: "三つの生態系",
      code: "ECOLOGIES",
      copy: "同じ国の森林率と都市人口率を組にし、全体傾向と例外を見る。",
    },
    {
      label: "エネルギー",
      cue: "太陽と風",
      code: "ENERGY",
      copy: "国土の青で再生可能電力比率を比べ、選択国の日差しと風を補足で見る。",
    },
    {
      label: "人口",
      cue: "1960年からの変化",
      code: "POPULATION",
      copy: "同じ31か国の人口を年ごとに送り、増え方と減り方を円の面積で比べる。",
    },
  ];

  const SPACE_MODE_CHOICES = [
    { label: "太陽の閃光", cue: "フレア等級", code: "FLARE", copy: "2024年5月に記録された太陽フレアを、等級に応じて開く光として見る。" },
    { label: "太陽風の波", cue: "CME速度", code: "CME", copy: "太陽から放たれたプラズマの速度と広がりを、宇宙を横切る円弧として見る。" },
    { label: "磁気圏の嵐", cue: "Kp指数", code: "Kp", copy: "太陽活動で地球の磁場が揺さぶられた強さを、曲がる磁力線として見る。" },
    { label: "太陽から届く粒子", cue: "SEP通知", code: "SEP", copy: "観測機器が高エネルギー粒子を捉えた時刻を、細い光の雨として見る。" },
    { label: "近づく小惑星", cue: "最接近距離", code: "NEO", copy: "2024年に月軌道の内側へ近づいた小惑星を、地球をかすめる軌道として見る。" },
    { label: "大気に燃える火球", cue: "推定エネルギー", code: "BOLIDE", copy: "大気中で強く光った天体の場所とエネルギーを、流星と残光として見る。" },
    { label: "近くの惑星系", cue: "星までの距離", code: "EXO NEAR", copy: "太陽系の外で確認された惑星を、地球から近い順の同心円で見る。" },
    { label: "地球サイズの世界", cue: "半径と平衡温度", code: "EXO EARTH", copy: "大きさと平衡温度が設定範囲に入る系外惑星を、生命判定とは分けて見る。" },
    { label: "リュウグウの地形", cue: "JAXA LIDAR", code: "RYUGU", copy: "はやぶさ2のレーザー高度計が測った距離と表面位置を、凹凸のある輪郭で見る。" },
    { label: "宇宙の感覚神経系", cue: "八つの公開資料", code: "COSMOS", copy: "太陽、地球近傍、小惑星、系外惑星の違う信号を、合計せず一つの網へ重ねる。" },
  ];

  const modes = [
    {
      id: "breathing-earth",
      title: "Breathing Earth",
      titleJa: "地球の一呼吸",
      description: "NOAAとGOSATの大気CO₂に、NOAA SWPCの30〜90分先オーロラ予報を重ねます。長期的な大気の変化と、太陽風に応答する極域の光を同じ地球上で見比べます。",
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
      titleJa: "海流が14日続いたら",
      description: "NOAA CoastWatchのある一日の海流を使い、その速さと向きが変わらないと仮定して、0〜14日後の移動距離を線で示します。色付きの矢印は海流、白い矢印はNASA POWERの平均風です。風は比較用で、移動距離の計算には使いません。",
      accent: "#63e3ff",
      rgb: "99, 227, 255",
      source: `
vec3 modeBlueCirculation(vec2 p, float t, vec2 response, float memory) {
  float slowTime = t * 0.062;
  vec2 q = p;
  float basin = fbm(q * 0.58 + vec2(-slowTime * 0.08, slowTime * 0.035));
  float waterWarp = fbm(q * 1.08 + vec2(slowTime * 0.13, -slowTime * 0.09));
  q += vec2((basin - 0.5) * 0.15, (waterWarp - 0.5) * 0.34);
  q += uVelocity * response.x * 0.018;

  // One broad current carries several translucent filaments instead of a
  // vector-grid texture. The two frequencies separate, meet and separate
  // again slowly, like light seen through moving deep water.
  float currentAxis = -0.06
    + sin((p.x + 0.3) * 0.95 - slowTime * 0.18) * 0.33
    + sin(p.x * 3.4 + slowTime * 0.25) * 0.045
    + (waterWarp - 0.5) * 0.16;
  float meander = p.y - currentAxis;
  float kuroshioRibbon = exp(-abs(meander) / 0.082);
  float ribbonAura = exp(-abs(meander) / 0.36);
  float silkPhase = meander * 43.0
    + fbm(q * 2.05 + vec2(-slowTime * 0.16, slowTime * 0.08)) * 3.8;
  float silk = pow(0.5 + 0.5 * cos(silkPhase), 14.0);
  float undertow = pow(
    0.5 + 0.5 * cos(meander * 22.0 - waterWarp * 2.4 + slowTime * 0.42),
    7.0
  );
  float travelingPearl = 0.34 + 0.66 * pow(
    0.5 + 0.5 * sin(q.x * 6.4 - slowTime * 3.1 + waterWarp * 5.0),
    4.0
  );

  vec2 eddyPointA = p - vec2(0.62, 0.12);
  float eddyRadiusA = length(eddyPointA);
  float eddyAngleA = atan(eddyPointA.y, eddyPointA.x);
  float eddyA = pow(
    0.5 + 0.5 * cos(eddyRadiusA * 18.0 - eddyAngleA * 2.0 - slowTime * 1.8),
    10.0
  ) * exp(-eddyRadiusA * 2.15);

  vec2 eddyPointB = p - vec2(1.18, -0.36);
  float eddyRadiusB = length(eddyPointB);
  float eddyAngleB = atan(eddyPointB.y, eddyPointB.x);
  float eddyB = pow(
    0.5 + 0.5 * cos(eddyRadiusB * 21.0 + eddyAngleB * 2.4 + slowTime * 1.35),
    12.0
  ) * exp(-eddyRadiusB * 2.65);

  float suspendedLight = smoothstep(
    0.86,
    1.0,
    noise(q * 20.0 + vec2(-slowTime * 0.7, slowTime * 0.22))
  ) * ribbonAura;
  float oceanPresence = 0.28 + 0.72 * smoothstep(-0.82, 0.26, p.x);
  float density = ribbonAura * 0.16
    + ribbonAura * (silk * 0.82 + undertow * 0.3) * travelingPearl * oceanPresence
    + kuroshioRibbon * 0.2
    + eddyA * 0.32
    + eddyB * 0.28
    + suspendedLight * 0.34
    + response.x * 0.62
    + response.y * 0.18;

  vec3 background = baseGradient(p, vec3(0.002, 0.065, 0.135));
  vec3 deepWater = mix(
    vec3(0.015, 0.16, 0.34),
    vec3(0.13, 0.72, 0.86),
    smoothstep(0.16, 0.84, waterWarp)
  );
  vec3 pearl = vec3(0.62, 0.96, 1.0)
    * (silk * ribbonAura + kuroshioRibbon * 0.22)
    * travelingPearl
    * oceanPresence;
  return background
    + deepWater * density
    + pearl * 0.42
    + vec3(0.06, 0.3, 0.54) * ribbonAura * (0.08 + memory * 0.13);
}
`.trim(),
    },
    {
      id: "forest-cloud-engine",
      title: "Forest & Rain",
      titleJa: "森林と降水量を重ねる",
      description: "緑の森林分布の上に、世界31地点の平均降水量を大きな水色円で重ねます。円が大きいほど雨が多く、雨の多い地点は円内にもmm/dayを表示します。ブラジルのアマゾン付近の代表点も含みます。地点間の補間や因果関係の断定はしません。",
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
      id: "nothing-is-waste",
      title: "Recycling: Current Rate & Your Target",
      titleJa: "再資源化率を比べる",
      description: "国連SDG 12.5.1の都市ごみ再資源化率を、同じ大きさの円グラフで国ごとに比べます。緑は再資源化、橙はそれ以外。国を選ぶと、現在値を内円に残したまま、自分で決める改善目標を黄色い外周へ置けます。目標は予測や公的目標ではありません。",
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
      description: "Global Carbon Projectの国別化石燃料由来CO₂を1945〜2023年の時系列で送り、NASA VIIRS 2016の夜間光を固定参照として重ねます。夜間光は過去へ遡らず、排出量へも変換しません。",
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
      description: "USGSの世界M7.5以上を2000〜2026年の年度ごとに切り替えます。その年の全震源から輪がゆっくり広がり、Magnitudeから見積もった可感半径の目安で止まります。輪は実際の震度分布・被害範囲・津波範囲ではありません。気象庁の日本実測震度は別層です。",
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
      description: "同じ31か国の森林面積率と都市人口率を組にし、地図の二重円と散布図で関係を可視化します。回帰線から外れる国も選んで比較し、世界遺産例は数値化しない文化・記憶の層として別に残します。",
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
      description: "世界銀行の国別統計を使い、電力に占める再生可能エネルギーの割合を国土の青で表示します。暗い青は低く、明るい水色は高い比率です。NASA POWERの日射と風は、選択国の自然条件を比べる補足として重ねます。",
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
      id: "population-tide",
      title: "Population Tide",
      titleJa: "人口のうねり",
      description: "世界銀行の国別人口を1960〜2025年の年次で切り替えます。31か国を同じ年でそろえ、円の面積を人口に比例させて、世界人口の重心が時間とともに動く様子を見ます。",
      accent: "#ffcf80",
      rgb: "255, 207, 128",
      source: `
vec3 modePopulationTide(vec2 p, float t, vec2 response, float memory) {
  float slowTime = t * 0.055;
  float field = fbm(p * 1.22 + vec2(slowTime * 0.11, -slowTime * 0.07));
  float waveA = lineGlow(
    sin(p.x * 4.6 + p.y * 2.1 + field * 3.4 - slowTime),
    0.048
  );
  float waveB = lineGlow(
    sin(p.y * 6.2 - p.x * 1.4 - field * 2.6 + slowTime * 0.72),
    0.04
  );
  float settlements = 0.0;
  for (int i = 0; i < 8; i++) {
    float fi = float(i);
    vec2 origin = (hash22(vec2(fi, 47.3)) - 0.5) * vec2(1.65, 1.05);
    float breath = 0.72 + 0.28 * sin(slowTime * 1.7 + fi * 1.21);
    settlements += exp(-dot(p - origin, p - origin) * 55.0) * breath;
  }
  float density = (waveA + waveB) * (0.14 + field * 0.2)
    + settlements * 0.36
    + response.x * 0.48
    + response.y * 0.22;
  vec3 background = baseGradient(p, vec3(0.08, 0.055, 0.025));
  vec3 amber = mix(vec3(0.54, 0.22, 0.08), vec3(1.0, 0.78, 0.34), field);
  return background + amber * density
    + vec3(0.48, 0.95, 0.86) * settlements * memory * 0.12;
}
`.trim(),
    },
  ];

  const modeConcepts = {
    "breathing-earth": {
      lead:
        "空気は見えません。でも、CO₂の記録を時間順に並べると、毎年くり返す季節の変化と、何十年も続く増加が見えてきます。",
      seeing:
        "球体の伸び縮みはCO₂の季節変化、明るさは長期的な増加、背景色は地球の平均気温の変化です。世界地図は1958年から2050年まで進みます。実際の記録、計算で補った値、未来の試算には、それぞれ違う表示をつけました。",
      touch:
        "画面に触れると、指先から波が広がります。データの値は変わりません。観測した数字に、自分の動きが重なる仕組みです。",
      context:
        "授業では、風や海流、熱の移動を、地球を動かす大きな循環として学びます。この展示ではCO₂の季節変化を「呼吸」に見立て、そのくり返しの奥にある長期的な変化を見せています。",
      question: "季節の上下だけでなく、長い時間の変化も見えたでしょうか。",
    },
    "blue-circulation": {
      lead:
        "この展示で確かめるのは、ある一日の海流をそのまま延長したときの距離です。未来の海況を予報する展示ではありません。",
      seeing:
        "色付きの矢印が海流です。青から水色、黄、橙に近づくほど速くなります。点から伸びる線は、同じ速さと向きが続くと仮定した移動先です。白い矢印は別資料の平均風で、距離計算には使いません。",
      touch:
        "色付きの点を押すと自動再生が止まり、その地点の海流の速さ・向き・選んだ日数後の移動距離を読めます。スライダーで0〜14日を動かせます。",
      context:
        "風と海流はどちらも熱を運びますが、この画面は両者の因果関係を計算していません。風は比較用に重ね、海流の移動距離だけを計算しています。",
      question: "同じ速さと向きが14日続くと、選んだ地点から何km先まで進む計算になりましたか。",
    },
    "forest-cloud-engine": {
      lead:
        "緑の森林分布と、大きな水色円で示す降水量がどこで重なるかを比べます。相関係数を計算した図ではなく、31の代表地点を同じ地図へ重ねた展示です。",
      seeing:
        "緑はMODISから抜き出した森林域です。水色円は世界31地点の平均降水量で、直径が大きいほど雨が多い地点です。雨の多い円にはmm/dayの数値も表示します。ブラジルのアマゾン付近は5.33 mm/dayです。地点間には値を入れていません。",
      touch:
        "大きな水色円を押すと自動走査が止まり、地図上とカードに代表地点名・平均降水量・資料区分が表示されます。別の円を押して森林との重なり方を比べられます。",
      context:
        "授業「森は地球の気候安定装置」では、森を木材の量だけでなく、水や土、気温を支える働きから見ます。この展示は、そのうち森林と雨の分布を並べたものです。",
      question: "大きな水色円と森林の緑は、アマゾン、東南アジア、アフリカのどこで重なって見えましたか。",
    },
    "nothing-is-waste": {
      lead:
        "都市ごみ100%のうち、再び資源になった割合はどれくらいでしょう。国ごとの違いを、同じ大きさの円グラフで比べます。",
      seeing:
        "各円の緑が再資源化率、橙が再資源化として報告されなかった残りです。円の直径はすべて同じなので、緑の扇形が大きい国ほど再資源化率が高いと読めます。実線は国連の公開値、破線は近い5か国から補った値です。",
      touch:
        "国の円グラフを押すと大きくなり、中央に現在値が出ます。スライダーを右へ動かすと、現在値以上の『自分で決める改善目標』が黄色い外周に出ます。これは予測やその国の公的目標ではなく、観客が置くSCENARIOです。",
      context:
        "授業「自然界にはゴミもうんちも存在しない」では、ある生きものの不要物が次の生きものの材料になる循環を扱います。人の製品も、作るときから回収や修理まで考える必要があります。",
      question: "緑より橙が大きい国はどこでしょう。現在の再資源化率から、自分の改善目標まで何ポイント必要でしょうか。",
    },
    "anthropocene-scar": {
      lead:
        "1945年からの化石燃料由来CO₂を一年ずつ送り、人間活動の大きさがどの地域で膨らんだかを追います。2016年の夜間光は現在に近い空間参照として固定します。",
      seeing:
        "赤い円は選択年度の国全体の化石燃料由来CO₂です。白い発光はNASA VIIRSが2016年に捉えた夜間光で、選択年度に合わせて変化する資料ではありません。円の中心も排出源の場所ではありません。",
      touch:
        "スライダーと左右ボタンで1945〜2023年を動かせます。国の円を押すとその国を選んだまま年を追えます。地図を0.65秒以上長押しすると夜間光だけが6秒間薄くなります。",
      context:
        "授業「人類世3.0」では、産業革命以降、人の活動が地球規模に大きくなったことを扱います。ただし排出量も、その影響を受ける大きさも、地域や人によって同じではありません。",
      question: "1945年から2023年へ進めたとき、どの地域の赤い円が早く、どの地域が遅れて大きくなりましたか。",
    },
    "rhythm-of-disaster": {
      lead:
        "世界の大地震を全部重ねず、2000〜2026年を一年ずつ切り替えます。年によって震源の数と場所がどう変わるかを見ます。",
      seeing:
        "橙の点は選択年度にUSGSが記録したM7.5以上の震源だけです。年度が変わると全震源から輪が同時にゆっくり広がり、M7.5は約500km、M9.1は約2,000kmの推定可感半径で止まります。別年度の点は表示しません。",
      touch:
        "スライダーで年度を切り替えると、その年の輪が一斉に始まり、約7〜15秒かけてそれぞれの推定半径まで広がります。震源を押すと発生日・深さ・Magnitudeを読めます。日本の震度6弱以上の実測記録は、左下の切替から別層で見られます。",
      context:
        "授業では、地球の変動を止めるのではなく、変動に備えられる社会を考えます。輪はUSGSの距離目安とM9.1の広域可感記録から補間した学習用の推定です。実際の揺れは深さ・地盤・断層方向などで変わります。",
      question: "大地震が多い年と少ない年では、震源の分布と波の重なり方がどう違って見えましたか。",
    },
    "three-ecologies": {
      lead:
        "都市で暮らす人が増えるほど、森林は必ず減るのでしょうか。同じ国の二つの割合を組にすると、単純ではない関係が見えてきます。",
      seeing:
        "地図の内側の緑円が森林面積率、外側の青円が都市人口率です。散布図では横軸が都市、縦軸が森林。回帰線と相関係数rが31か国の全体傾向を示し、中心色は各国がその傾向からどちらへ外れるかを示します。",
      touch:
        "スライダーは層を切り替えるのではなく、都市人口率の低い国から高い国へ比較対象を移します。地図の円を押すと、森林率・都市人口率と、回帰線からの差を読めます。",
      context:
        "相関は因果関係ではなく、国別値の最新年も完全には揃いません。紫の世界遺産例は文化の価値を数値へ混ぜず、森林と都市の二変数だけでは場所を語り切れないことを残すための層です。",
      question: "回帰線から大きく外れる国は、なぜ全体傾向と違うのでしょうか。",
    },
    "earth-organ": {
      lead:
        "電力に占める再生可能エネルギーの割合は、国ごとにどれくらい違うでしょう。国土そのものを塗り、世界の差を一目で比べます。",
      seeing:
        "31か国を同じ0〜100%の尺度で塗ります。暗い青ほど比率が低く、明るい水色ほど高い国です。選択国だけに黄色の日射円と緑の風矢印を重ね、現在の利用率と自然条件を分けて読めるようにします。",
      touch:
        "スライダーを動かすと、再生可能電力比率の低い国から高い国へ順番に選択します。国を押しても値を読めます。地点同士を結ぶ機能はなくし、地図の色と国別比較に集中します。",
      context:
        "再生可能電力の割合は、日射や風だけでなく、水力資源、政策、送電網、設備、費用、電力需要などにも左右されます。黄色と緑は導入可能量や因果関係を計算した値ではありません。",
      question: "自然条件が豊かでも現在の割合が低い国、またはその逆の国はあるでしょうか。何が違いを生むのでしょう。",
    },
    "population-tide": {
      lead:
        "人口は一つの現在値ではなく、増える国、横ばいになる国、減り始める国が同時に動く長い時系列です。",
      seeing:
        "琥珀色の円は選択した年の国別人口です。円の面積が人口に比例するので、半径をそのまま人数だと読まないでください。31か国を毎年同じ顔ぶれで比較します。",
      touch:
        "スライダーと左右ボタンで1960〜2025年を移動できます。国の円を押すと、その国を選択したまま年だけを動かして人口の変化を追えます。",
      context:
        "人口の変化は出生・死亡だけでなく、移動、医療、経済、制度、紛争など多くの条件が重なった結果です。この展示は人口の多さを豊かさや環境負荷へ直接変換しません。",
      question: "1960年と最新年を比べたとき、地図上の人口の重心はどちらへ動いたように見えましたか。",
    },
  };

  const modeDataNarratives = Object.freeze({
    "breathing-earth": "地図の見方：色はCO₂濃度です。斜線のマスは、近くの8地点から計算した値です。1958〜2009年は後年の衛星地図を使った再構成、2026年以降は最近10年の傾向が続いた場合の試算です。",
    "blue-circulation": "地図の見方：色付きの矢印は海流で、青→水色→黄→橙の順に速くなります。点から伸びる線は、同じ海流が続くと仮定した0〜14日後の移動距離です。白い矢印は比較用の平均風で、距離計算には使いません。海の予報ではありません。",
    "forest-cloud-engine": "地図の見方：緑は2023年MODIS土地被覆から抜き出した森林域、大きな水色円は世界31代表地点の平均降水量です。直径が大きいほど雨が多く、雨の多い円にはmm/dayも直接表示します。ブラジルのアマゾン付近は5.33 mm/dayです。地点間は補間せず、相関係数や因果関係を示す図ではありません。",
    "nothing-is-waste": "地図の見方：同じ大きさの円グラフの緑が再資源化率、橙がそれ以外です。実線は国連の公開値、破線は近い5か国から計算した補完値。選択国の黄色い外周は、自分で決める改善目標です。予測や公的目標ではありません。",
    "anthropocene-scar": "地図の見方：赤い円は1945〜2023年の国別化石燃料由来CO₂で、スライダーは年を動かします。白い発光は2016年のNASA VIIRS夜間光を固定した比較用レイヤーです。過去の夜間光ではありません。0.65秒以上長押しすると白だけが6秒間薄くなります。",
    "rhythm-of-disaster": "地図の見方：初期表示は世界です。2000〜2026年を年度ごとに切り替え、その年のUSGS M7.5以上だけを表示します。年度切替時に全震源の輪が一斉に始まり、約7〜15秒かけてM7.5約500km〜M9.1約2,000kmの推定可感半径まで広がります。実際の震度分布・被害・津波範囲ではなく、日本の実測震度は別層です。",
    "three-ecologies": "地図の見方：同じ31か国の森林面積率を緑の内円、都市人口率を青の外円で重ねます。散布図の横軸は都市、縦軸は森林で、回帰線と相関係数rが全体傾向を示します。スライダーは都市人口率の低い国から高い国へ比較対象を移します。紫の世界遺産例は相関計算へ含めません。",
    "earth-organ": "地図の見方：31か国の国土を、電力に占める再生可能エネルギーの割合で塗ります。暗い青は0%に近く、明るい水色は100%に近い比率です。スライダーは低い国から高い国へ移動します。黄色の日射円と緑の風矢印は選択国の補足で、現在の比率を説明する因果モデルではありません。",
    "population-tide": "地図の見方：1960〜2025年を一年ずつ切り替え、同じ31か国の人口を琥珀色の円で表示します。円の面積が人口に比例します。点は国を示す代表位置で、都市の場所や人口密度ではありません。",
  });

  const lectureResumeLinks = Object.freeze({
    "breathing-earth": "授業とのつながり：『なぜ風は吹くのか？――宇宙船地球号の循環系を理解する』",
    "blue-circulation": "授業とのつながり：『なぜ風は吹くのか？――宇宙船地球号の循環系を理解する』",
    "forest-cloud-engine": "授業とのつながり：『森は地球の気候安定装置』",
    "nothing-is-waste": "授業とのつながり：『自然界にはゴミもうんちも存在しない』",
    "anthropocene-scar": "授業とのつながり：『人類世3.0――産業革命以降「ガリバー化」した人類』",
    "rhythm-of-disaster": "授業とのつながり：『地球の変動リズムと同期しうる文明設計』",
    "three-ecologies": "授業とのつながり：『三つのエコロジー――生態・社会・精神』",
    "earth-organ": "授業とのつながり：『地球の変動リズムと同期しうる文明設計』",
    "population-tide": "授業とのつながり：『人類世3.0――産業革命以降「ガリバー化」した人類』",
  });

  window.GaiaAppContent = Object.freeze({
    JAPAN_NODES,
    JMA_CO2_SITES,
    EARTH_NODES,
    SIMPLE_WORLD_LANDMASSES,
    SIMPLE_WORLD_ISLAND_LINES,
    JMA_EVENT_TITLES,
    INTRO_PATHS,
    INTRO_MODE_CHOICES,
    SPACE_MODE_CHOICES,
    modes,
    modeConcepts,
    modeDataNarratives,
    lectureResumeLinks,
  });
})();
