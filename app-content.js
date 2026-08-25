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
      lead: "意味と操作が異なる9つの観測展示から、最初に触れる入口を選んでください。",
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
      copy: "同じ国の森林率と都市人口率を組にし、全体傾向と例外を見る。",
    },
    {
      label: "エネルギー",
      cue: "太陽と風",
      code: "ENERGY",
      copy: "国土の青で再生可能電力比率を比べ、選択国の日差しと風を補足で見る。",
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
      titleJa: "海流が14日続いたら",
      description: "NOAA CoastWatchのある一日の海流を使い、その速さと向きが変わらないと仮定して、0〜14日後の移動距離を線で示します。色付きの矢印は海流、白い矢印はNASA POWERの平均風です。風は比較用で、移動距離の計算には使いません。",
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
      id: "pollination-protocol",
      title: "Observation Is Not Distribution",
      titleJa: "記録は、生息地図ではない",
      description: "黄色い点はミツバチそのものの分布ではなく、GBIFへ登録された62件の観察記録です。しかも選んだ31か国から最大2件ずつに揃えた展示用標本です。最後に、場所情報を持たないGloBIの花との23関係を、地理ではないネットワークとして表示します。",
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
      description: "国連SDG 12.5.1の都市ごみ再資源化率を、同じ大きさの円グラフで国ごとに比べます。緑は再資源化、橙はそれ以外。実線は公開値、破線は補完値、選択国の外周だけが観客の『もしも』です。",
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
      description: "NASA VIIRS 2016の夜間光画素を地図上の位置へ白く発光させ、EDGARの国別温室効果ガス排出量を赤い円で重ねます。白い光を排出量へ変換せず、二つの別資料を同じ地図で見比べます。",
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
    "pollination-protocol": {
      lead:
        "地図の黄色い点は『ミツバチがいる場所』ではなく、『人が観察しGBIFへ登録した場所』です。記録の地図と生息分布の違いを確かめます。",
      seeing:
        "展示は3段階です。①62件の観察点、②選んだ31か国から最大2件ずつに揃えた標本の制約、③GloBIに記録された花との23関係を、地理ではないネットワークで表示します。点の空白はミツバチの不在を意味しません。",
      touch:
        "スライダーで『観察点→標本の制約→花との関係網』を切り替えられます。黄色い点を押すと、その生きものではなく一件の観察記録として、国・日付・GBIF番号を読めます。",
      context:
        "授業「花と昆虫の共進化」では、花と虫が互いの形や行動に影響してきた歴史を学びます。ミツバチの意味は、地図上の所在地よりも花との関係網にあります。ただし、この23関係にも頻度・強さ・発生場所はありません。",
      question: "点がない場所にミツバチがいないと言えるでしょうか。花との関係網からは、所在地の地図とは違う何が見えましたか。",
    },
    "nothing-is-waste": {
      lead:
        "都市ごみ100%のうち、再び資源になった割合はどれくらいでしょう。国ごとの違いを、同じ大きさの円グラフで比べます。",
      seeing:
        "各円の緑が再資源化率、橙が再資源化として報告されなかった残りです。円の直径はすべて同じなので、緑の扇形が大きい国ほど再資源化率が高いと読めます。実線は国連の公開値、破線は近い5か国から補った値です。",
      touch:
        "国の円グラフを押すと大きくなり、中央に現在値が出ます。スライダーを動かすと選択国の外周だけが『もしも』の割合へ変わり、内側の現在値は固定されます。",
      context:
        "授業「自然界にはゴミもうんちも存在しない」では、ある生きものの不要物が次の生きものの材料になる循環を扱います。人の製品も、作るときから回収や修理まで考える必要があります。",
      question: "緑より橙が大きい国はどこでしょう。現在の再資源化率と、自分が置いた『もしも』にはどれくらい差がありますか。",
    },
    "anthropocene-scar": {
      lead:
        "宇宙から見た夜の明かりを、衛星画像の位置のまま世界地図へ投影します。同じ地図に、国ごとの温室効果ガス排出量を重ねます。",
      seeing:
        "白い発光はNASA VIIRSが捉えた夜間光画素で、都市や道路沿いの位置に現れます。赤い円は国全体の排出量です。円の中心が排出源という意味ではなく、明るさから排出量を計算してもいません。",
      touch:
        "地図を0.65秒以上長押しすると夜間光だけが6秒間薄くなり、赤い円を単独で確認できます。時間がたつと白い夜間光が戻ります。",
      context:
        "授業「人類世3.0」では、産業革命以降、人の活動が地球規模に大きくなったことを扱います。ただし排出量も、その影響を受ける大きさも、地域や人によって同じではありません。",
      question: "白い夜間光が密集する場所と、赤い国別排出量の大きな円は、どこで重なり、どこでずれて見えましたか。",
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
  };

  const modeDataNarratives = Object.freeze({
    "breathing-earth": "地図の見方：色はCO₂濃度です。斜線のマスは、近くの8地点から計算した値です。1958〜2009年は後年の衛星地図を使った再構成、2026年以降は最近10年の傾向が続いた場合の試算です。",
    "blue-circulation": "地図の見方：色付きの矢印は海流で、青→水色→黄→橙の順に速くなります。点から伸びる線は、同じ海流が続くと仮定した0〜14日後の移動距離です。白い矢印は比較用の平均風で、距離計算には使いません。海の予報ではありません。",
    "forest-cloud-engine": "地図の見方：緑は2023年MODIS土地被覆から抜き出した森林域、大きな水色円は世界31代表地点の平均降水量です。直径が大きいほど雨が多く、雨の多い円にはmm/dayも直接表示します。ブラジルのアマゾン付近は5.33 mm/dayです。地点間は補間せず、相関係数や因果関係を示す図ではありません。",
    "pollination-protocol": "地図の見方：①黄色い点はGBIFの観察記録で、生息分布ではありません。②選んだ31か国から最大2件ずつに揃えたため、点の多さを国どうしで比較できません。③GloBIの花との23関係は場所を持たないので、地図へ結ばず、太平洋上に地理ではない関係網として表示します。",
    "nothing-is-waste": "地図の見方：同じ大きさの円グラフの緑が再資源化率、橙がそれ以外です。実線は国連の公開値、破線は近い5か国から計算した補完値。選択国の外周だけが、自分で動かす『もしも』です。",
    "anthropocene-scar": "地図の見方：白い発光はNASA VIIRS 2016の夜間光画素を地理位置へ投影したもの、赤い円は国ごとの温室効果ガス排出量です。0.65秒以上長押しすると白だけが6秒間薄くなります。二つは別々の資料です。",
    "rhythm-of-disaster": "地図の見方：初期表示は世界です。2000〜2026年を年度ごとに切り替え、その年のUSGS M7.5以上だけを表示します。年度切替時に全震源の輪が一斉に始まり、約7〜15秒かけてM7.5約500km〜M9.1約2,000kmの推定可感半径まで広がります。実際の震度分布・被害・津波範囲ではなく、日本の実測震度は別層です。",
    "three-ecologies": "地図の見方：同じ31か国の森林面積率を緑の内円、都市人口率を青の外円で重ねます。散布図の横軸は都市、縦軸は森林で、回帰線と相関係数rが全体傾向を示します。スライダーは都市人口率の低い国から高い国へ比較対象を移します。紫の世界遺産例は相関計算へ含めません。",
    "earth-organ": "地図の見方：31か国の国土を、電力に占める再生可能エネルギーの割合で塗ります。暗い青は0%に近く、明るい水色は100%に近い比率です。スライダーは低い国から高い国へ移動します。黄色の日射円と緑の風矢印は選択国の補足で、現在の比率を説明する因果モデルではありません。",
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
