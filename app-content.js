(() => {
  "use strict";

  const JAPAN_NODES = [
    {
      name: "NAHA",
      nameJa: "那覇・南西諸島",
      lon: 127.68,
      lat: 26.21,
      description: "那覇のまわりには、暖かい海流、サンゴ礁、台風の通り道、観光都市があります。海の変化が暮らしに近い場所です。",
      relation: "関係する展示：02 海流と風、08 自然・社会・文化の三つの層。",
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
      relation: "関係する展示：07 地震と大地の変化。",
    },
    {
      name: "NOTO",
      nameJa: "能登",
      lon: 136.9,
      lat: 37.3,
      description: "能登では、里山と里海、農業と漁業、祭りや集落の暮らしが近い距離で結ばれてきました。",
      relation: "関係する展示：05 資源の行方、08 自然・社会・文化の三つの層。",
    },
    {
      name: "TOKYO",
      nameJa: "東京",
      lon: 139.69,
      lat: 35.68,
      description: "東京には、遠くから食料、電力、水、物が集まり、大量のごみや排出も生まれます。都市と地球のつながりが見える場所です。",
      relation: "関係する展示：06 夜の光と排出量、09 エネルギー。",
    },
    {
      name: "SENDAI",
      nameJa: "仙台・三陸沿岸",
      lon: 140.87,
      lat: 38.27,
      description: "仙台と三陸沿岸は、海、川、平野、都市が接する地域です。災害の記録と、その後の防災やまちづくりが重なっています。",
      relation: "関係する展示：07 地震、08 自然・社会・文化の三つの層。",
    },
    {
      name: "NEMURO",
      nameJa: "根室・道東",
      lon: 145.58,
      lat: 43.33,
      description: "根室の暮らしは、寒流、湿原、漁業、渡り鳥など、国境を越えて動く海や生きものと深く関わっています。",
      relation: "関係する展示：02 海流と風、04 生きものの関係。",
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
      relation: "関係する展示：03 森林と雨、06 夜の光と排出量。",
    },
    {
      name: "ARCTIC",
      nameJa: "北極圏",
      lon: 20,
      lat: 74,
      description: "北極圏では、氷、海、大気の変化が互いに影響します。人の少ない地域ですが、その変化は世界の気候とつながっています。",
      relation: "関係する展示：01 CO₂と気温、08 自然・社会・文化の三つの層。",
    },
    {
      name: "SAHEL",
      nameJa: "サヘル",
      lon: 15,
      lat: 15,
      description: "サヘルでは、雨の量や時期が農業、牧畜、人の移動に大きく関わります。気候と暮らしを一緒に見るための地点です。",
      relation: "関係する展示：07 地球の変動、08 自然・社会・文化の三つの層。",
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
      relation: "関係する展示：04 生きものの関係、10 九つのデータの重なり。",
    },
    {
      name: "ANDES",
      nameJa: "アンデス",
      lon: -70,
      lat: -22,
      description: "アンデスでは、鉱物資源、高地の水、生態系、鉱山の町が近くにあります。私たちが使う機器の材料が採られる地域の一つです。",
      relation: "関係する展示：05 資源の行方、09 エネルギーと人工物。",
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
      lead: "意味と操作が異なる10の観測展示から、最初に触れる入口を選んでください。",
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
      lead: "毎週オンラインで話していたミズハとアマネが、海の近くで初めて出会います。二人は、待ち合わせに来ないサクヤが残した10の観測記録をたどりながら、人間と地球のこれからを探します。最初から読むなら「01 空気」を選んでください。",
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
      cue: "海流と風",
      code: "OCEAN",
      copy: "海の流れが同じ速さで続いたら、14日でどこまで進むかをたどる。",
    },
    {
      label: "森",
      cue: "森林と雨",
      code: "FOREST",
      copy: "森林だけを緑で強調し、31地点の雨量と同じ場所で見比べる。",
    },
    {
      label: "ミツバチ",
      cue: "観察場所と文献関係",
      code: "BEE RECORDS",
      copy: "ミツバチが見つかった場所をたどり、場所を持たない文献上の関係とは分けて読む。",
    },
    {
      label: "ごみ",
      cue: "再資源化の現在ともしも",
      code: "RECYCLING",
      copy: "国ごとの現在値と、自分で動かす仮想値を分けて比べる。",
    },
    {
      label: "都市",
      cue: "光と排出",
      code: "CITY",
      copy: "宇宙から見た夜の明かりと、国ごとの排出量を見比べる。",
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
      copy: "森林、都市、文化の記録を三つの層に分けて見る。",
    },
    {
      label: "エネルギー",
      cue: "太陽と風",
      code: "ENERGY",
      copy: "各地の日差しや風と、現在使われている再生可能電力を見比べる。",
    },
    {
      label: "すべて",
      cue: "九つのデータ",
      code: "ALL SIGNALS",
      copy: "九つの信号を番号つきの枝で見比べ、総合点にせず残す。",
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
      description: "NOAAとGOSATの大気CO₂、NASAの気温偏差を重ねています。季節ごとのCO₂の上下を呼吸する動き、長期的な増加を光の強さ、気温偏差を青から赤への色として表します。",
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
      description: "NOAA CoastWatchの海流とNASA POWERの風を重ねています。流れる青い線が海流の向きと速さ、白い矢印が風向・風速です。二つは別の観測値として表示します。",
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
      title: "Forest & Rain",
      titleJa: "森林と雨を比べる",
      description: "NASA MODISから森林域だけを緑で強調し、世界31地点の雨量を水色の円で重ねます。地点を選ぶと名称とmm/dayを地図上で読めます。地点間の補間や因果関係の断定はしません。",
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
      title: "Pollination Evidence",
      titleJa: "ミツバチの観察記録",
      description: "GBIFに登録されたミツバチの観察場所を黄色い点で示します。地点を選ぶと生きもの・国・日付を読めます。GloBIの花と送粉者の文献関係には場所がないため、地図上では結びません。",
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
      title: "Recycling: Now & What If",
      titleJa: "再資源化の現在ともしも",
      description: "国連SDG 12.5.1の都市ごみ再資源化率を国ごとの円で比べます。実線は公開値、内側の破線は補完値、外側の破線は観客が動かす仮想値です。現在と『もしも』を混ぜません。",
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
      description: "NASA VIIRSの夜間光とEDGARの温室効果ガス排出量を重ねています。白い光は都市の明るさ、赤い領域は排出量です。夜間光を排出量そのものとして扱わず、繁栄の可視面と環境負荷を見比べます。",
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
      description: "気象庁とUSGSの地震記録を使います。地震を選ぶとP波・S波の到達目安が輪となって進み、到達後に各観測点の震度が現れます。波の速さは簡略化した地殻モデルによる近似です。",
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
      description: "森林、都市、人が大切にしてきた場所を、生態・社会・文化の三層に分けて重ねます。数値化できる観測記録と、数値に還元しない記憶の層を分け、切り離せない三つの生態系として読みます。",
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
      description: "NASA POWERの太陽・風の条件と、世界銀行などの再生可能エネルギー統計を別の層で表示します。二地域を選んで生まれる光の回路は、実際の送電網ではなく分散型ネットワークの仮想シナリオです。",
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
      title: "Nine Signals, One Earth",
      titleJa: "九つの地球信号を見比べる",
      description: "01〜09の異なる公開データを番号つきの九本の枝で順番に見比べます。選択中の信号名を中央に表示し、観客が触れた跡も残しますが、架空の『地球健康度』にはまとめません。",
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
        "海の水は、ゆっくり動き続けています。その流れは、熱や栄養、生きものを遠くまで運びます。",
      seeing:
        "青が濃いほど海流が速く、シアンの線は同じ流れが続いた場合の移動距離です。DAY 0から14まで線が伸びます。白い矢印は風で、海流とは別のデータです。",
      touch:
        "青い点を押すと動きが止まり、その場所の流速、向き、移動距離を読めます。距離は「いまの流れが変わらない」と仮定した計算です。実際の海の予報ではありません。",
      context:
        "授業の「宇宙船地球号の循環系」では、風と海流が熱を運ぶ仕組みを扱います。水や熱は国境で止まらないため、海の変化も一つの地域だけでは考えられません。",
      question: "選んだ場所の海水は、14日でどこまで進みましたか。",
    },
    "forest-cloud-engine": {
      lead:
        "森林が多い場所と雨が多い地点は、世界地図のどこで重なるでしょうか。二つの記録を同じ場所で比べます。",
      seeing:
        "緑はMODISから抜き出した森林域だけです。水色の円は世界31地点の平均降水量で、大きいほど雨が多い地点です。地点と地点の間には値を入れていません。",
      touch:
        "水色の地点を押すと自動走査が止まり、地図上とカードに地点名・mm/day・資料区分が表示されます。別の地点を押して重なり方を比べられます。",
      context:
        "授業「森は地球の気候安定装置」では、森を木材の量だけでなく、水や土、気温を支える働きから見ます。この展示は、そのうち森林と雨の分布を並べたものです。",
      question: "森林域と雨の多い観測地点は、どこで重なり、どこで重ならなかったでしょうか。",
    },
    "pollination-protocol": {
      lead:
        "ミツバチが実際に記録された場所をたどります。花との関係を記した文献資料とは、混ぜずに読みます。",
      seeing:
        "黄色い点はGBIFの観察記録です。GloBIの花と送粉者の関係には場所情報がないため、件数と関係名だけを凡例・データカードに示し、地図上の点へは結びません。",
      touch:
        "黄色い点を押すと自動走査が止まり、生きもの・国・観察日・GBIF記録番号を地図上とカードで読めます。",
      context:
        "授業「花と昆虫の共進化」では、花と虫が互いの形や行動に影響してきた歴史を学びます。送粉を守るには、生きものだけでなく、すみかや季節、農薬の使い方も関わります。",
      question: "どの地域に観察記録があり、記録の空白はどこに残っているでしょうか。",
    },
    "nothing-is-waste": {
      lead:
        "都市ごみが再び資源になる割合は、国ごとに違います。現在の記録と『もしも増やせたら』を分けて比べます。",
      seeing:
        "円の大きさは国ごとの再資源化率です。実線は国連の記録、内側の破線は近い国から計算した仮の値、外側の破線は自分で動かせる試算です。",
      touch:
        "国の円を押すと現在値で走査が止まります。スライダーを動かすと外側の破線と地図上の比較表示だけが変わり、実線・内側の破線は固定されます。",
      context:
        "授業「自然界にはゴミもうんちも存在しない」では、ある生きものの不要物が次の生きものの材料になる循環を扱います。人の製品も、作るときから回収や修理まで考える必要があります。",
      question: "現在の再資源化率と、自分が置いた『もしも』には、どれくらい差があるでしょうか。",
    },
    "anthropocene-scar": {
      lead:
        "宇宙から見た夜の地球には、都市の明かりが広がっています。同じ地図に、国ごとの温室効果ガス排出量を重ねます。",
      seeing:
        "白は人工衛星が記録した夜の明かり、赤い円は国全体の排出量です。長押しすると白だけが薄くなります。明るさから排出量を計算しているわけではありません。",
      touch:
        "画面を長押しすると夜間光だけが薄くなり、赤い円を見やすくできます。指を離すと元に戻ります。",
      context:
        "授業「人類世3.0」では、産業革命以降、人の活動が地球規模に大きくなったことを扱います。ただし排出量も、その影響を受ける大きさも、地域や人によって同じではありません。",
      question: "夜の明かりと赤い円は、同じ場所にありましたか。",
    },
    "rhythm-of-disaster": {
      lead:
        "地震が起きると、速いP波が先に届き、遅いS波があとから届きます。その時間差を地図上で再生します。",
      seeing:
        "世界地図の点は、2000年以降のM7.5以上の地震です。日本の代表例では、P波を秒速7km、S波を秒速4kmとして到着の目安を計算しています。各地の震度は気象庁の実際の記録です。",
      touch:
        "地震の点を選ぶと再生が始まります。波が届くまで少し待ってください。場所による到着時刻と揺れの違いを見比べられます。",
      context:
        "授業では、地球の変動を止めるのではなく、変動に備えられる社会を考えます。観測データは防災の手がかりになりますが、この展示の波は単純な速度で計算した学習用の目安です。",
      question: "P波とS波は、どれくらい時間をあけて届きましたか。",
    },
    "three-ecologies": {
      lead:
        "暮らす場所は、自然環境だけで決まりません。都市の仕組みや、受け継がれてきた文化も、同じ場所にあります。",
      seeing:
        "緑は森林面積、青は都市で暮らす人の割合、紫は各地域から選んだ世界遺産です。三つを順番に表示してから重ねます。世界遺産の点は、文化の優劣を表すものではありません。",
      touch:
        "触れた波は、一つの層から次の層へ少し遅れて広がります。三つの資料が同じ場所に重なる様子を見るための演出です。",
      context:
        "授業「三つのエコロジー」では、生態、社会、精神を切り離さずに考えます。この展示では、直接測りにくい「精神」を点数にせず、文化や記憶の場所を考える入口として世界遺産を置きました。",
      question: "あなたの大切な場所には、どんな自然・社会・記憶がありますか。",
    },
    "earth-organ": {
      lead:
        "日差しや風が豊かな場所と、再生可能電力が多く使われている国は、必ずしも同じではありません。",
      seeing:
        "外側の光は31地点の日差しと風、内側はその国の電力に占める再生可能エネルギーの割合です。二地点を結ぶ破線は、実在する送電線ではなく、この展示で作る試算です。",
      touch:
        "二つの地点を押すと破線で結ばれます。これは発電計画ではありません。土地、設備、費用、送電網などの条件は含んでいません。",
      context:
        "授業では、地球の変動に合わせられる分散型の仕組みを考えます。再生可能エネルギーも、自然条件だけで決まるのではなく、地域の暮らしや設備と一緒に考える必要があります。",
      question: "自然条件と、実際の電力の割合には、どんな差がありましたか。",
    },
    "senseware-2050": {
      lead:
        "最後の画面では、ここまでの九つのデータを番号つきの枝で一つずつ見比べます。",
      seeing:
        "01 CO₂、02 海流、03 森林と雨、04 ミツバチ、05 再資源化、06 排出、07 地震、08 三層、09 エネルギー。選択中の番号と名前を中央に表示し、単位の違う値は合計しません。",
      touch:
        "スライダーで01〜09を選び、各枝の名前を確かめられます。地図に触れた跡はこの端末にだけ残り、外部へ送信されません。リセットすると消えます。",
      context:
        "授業「地球大の感覚神経系を獲得した人類」が、この作品の出発点です。人工衛星や観測所の記録を集めると、地球規模の変化が見えてきます。ただし、データが私たちの行動まで決めてくれるわけではありません。",
      question: "九つを順番に見比べたとき、どの信号がいちばん気になりましたか。",
    },
  };

  const modeDataNarratives = Object.freeze({
    "breathing-earth": "地図の見方：色はCO₂濃度です。斜線のマスは、近くの8地点から計算した値です。1958〜2009年は後年の衛星地図を使った再構成、2026年以降は最近10年の傾向が続いた場合の試算です。",
    "blue-circulation": "地図の見方：青は海流の速さ、シアンの線は同じ流れが続いた場合の移動距離です。白い矢印は風です。線は計算した目安で、海の予報ではありません。",
    "forest-cloud-engine": "地図の見方：緑は2023年MODIS土地被覆から色判定で抜き出した森林域、水色の円は世界31地点の平均降水量です。選択点には名称とmm/dayを表示します。地点間の補間はせず、重なりだけで因果も決めません。",
    "pollination-protocol": "地図の見方：黄色い点はGBIFに登録されたミツバチの観察記録です。GloBIにある花と送粉者の文献関係は場所を持たないため、件数を凡例に示すだけで地図の点へ結びません。",
    "nothing-is-waste": "地図の見方：実線は国連の公開値、内側の破線は近い5か国から計算した補完値、外側の破線は自分で動かす試算です。選択国の現在値→もしもを地図上へ併記します。",
    "anthropocene-scar": "地図の見方：赤い円は国ごとの温室効果ガス排出量、白い地表は人工衛星が見た夜の明かりです。長押しで白だけを薄くできます。二つは別々のデータです。",
    "rhythm-of-disaster": "地図の見方：世界地図には、USGSが記録した2000年以降のM7.5以上の地震を表示します。日本の代表6件では、気象庁の実測震度と、P波・S波が届く目安を再生します。",
    "three-ecologies": "地図の見方：緑は土地の種類、青は都市人口、紫は各地域から選んだ世界遺産です。三つは意味の違う資料です。重ねても、文化や心を点数にはしません。",
    "earth-organ": "地図の見方：外側は31地点の日差しと風、内側はその国の再生可能電力の割合です。二地点を結ぶ破線だけが、この展示で作る試算です。",
    "senseware-2050": "地図の見方：01〜09のデータを番号つきの九本の枝で48秒かけて順番に表示し、選択名を中央へ出します。ここまでに触れた跡は重ねますが、単位が違うため合計や平均にはしません。",
  });

  const lectureResumeLinks = Object.freeze({
    "breathing-earth": "授業とのつながり：『なぜ風は吹くのか？――宇宙船地球号の循環系を理解する』",
    "blue-circulation": "授業とのつながり：『なぜ風は吹くのか？――宇宙船地球号の循環系を理解する』",
    "forest-cloud-engine": "授業とのつながり：『森は地球の気候安定装置』",
    "pollination-protocol": "授業とのつながり：『1億年前のドローン革命――花と昆虫の共進化』",
    "nothing-is-waste": "授業とのつながり：『自然界にはゴミもうんちも存在しない』",
    "anthropocene-scar": "授業とのつながり：『人類世3.0――産業革命以降「ガリバー化」した人類』",
    "rhythm-of-disaster": "授業とのつながり：『地球の変動リズムと同期しうる文明設計』",
    "three-ecologies": "授業とのつながり：『三つのエコロジー――生態・社会・精神』",
    "earth-organ": "授業とのつながり：『地球の変動リズムと同期しうる文明設計』",
    "senseware-2050": "授業とのつながり：『地球大の感覚神経系を獲得した人類――未完の地球センスウェア創生にむけて』",
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
