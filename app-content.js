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
      lead: "10の観測テーマを二つの演出で見比べられます。20の入口から選んでください。",
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
      copy: "森林の分布と雨の量を重ね、二つが同じ場所に現れる様子を見る。",
    },
    {
      label: "生きもの",
      cue: "花と昆虫",
      code: "LIFE",
      copy: "花と虫の関係と、ミツバチが見つかった場所をそれぞれたどる。",
    },
    {
      label: "ごみ",
      cue: "資源の行方",
      code: "WASTE",
      copy: "国ごとの再資源化率を比べ、ごみの次の行き先を考える。",
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
      copy: "ここまで見てきた九つのデータと、触れた跡を一つに重ねる。",
    },
    {
      label: "呼吸・実装比較",
      cue: "CO₂・気温・GOSAT",
      code: "DATA BREATH",
      copy: "CO₂で伸縮し、気温とGOSATで色と模様が変わる。",
    },
    { label: "海流・演出版", cue: "海流と風", code: "CURRENT RUSH", copy: "海流を光のリボン、風を走る粒子として見る。" },
    { label: "森林・演出版", cue: "森林と雨", code: "RAIN PULSE", copy: "森林・雨・雲を、発光する樹冠と雷雨へ変える。" },
    { label: "送粉・演出版", cue: "花と昆虫", code: "POLLEN CONSTELLATION", copy: "花と送粉者の記録を、出会う星座として見る。" },
    { label: "循環・演出版", cue: "資源の行方", code: "CIRCULAR FOUNDRY", copy: "再資源化率を、分岐して戻る光の流れとして見る。" },
    { label: "都市・演出版", cue: "光と排出", code: "SCAR CITY", copy: "夜間光と排出量を、都市グリッドと赤い亀裂で見る。" },
    { label: "地震・演出版", cue: "P波とS波", code: "SEISMIC CHORUS", copy: "P波とS波を、速度の違う光輪として見る。" },
    { label: "生態・演出版", cue: "三つの層", code: "ECOLOGY PRISM", copy: "森林・都市・文化を、交差する三色の場として見る。" },
    { label: "電力・演出版", cue: "太陽と風", code: "LIVING GRID", copy: "太陽・風・再エネ比率を、脈動する回路として見る。" },
    { label: "統合・演出版", cue: "九つのデータ", code: "GAIA SYNAPSE", copy: "九つの信号を、合計せず神経星座として見る。" },
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
      title: "Forest Cloud Engine",
      titleJa: "森の気候装置",
      description: "NASA MODISの土地被覆と、世界31地点の降水記録を重ねています。背景色が森林・草地・都市などの土地の種類、水色の光が各地点の雨量です。重なりは関係を考える入口で、因果関係の証明ではありません。",
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
      description: "GloBIに記録された花と送粉者の関係を線、GBIFの生物観察記録を点で表します。点に触れると、観察された場所・日付・生きものを読み、記録のある関係だけが光で結ばれます。",
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
      description: "国連SDG 12.5.1の廃棄物データを、再資源化・焼却・埋立へ分かれる粒子として表します。観客が変えた配分は現状値ではなく、別表示した仮想シナリオです。",
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
      title: "Unfinished Gaia Senseware",
      titleJa: "未完の地球センスウェア",
      description: "01〜09で使った異なる公開データと、観客が触れた軌跡を一つの神経網へ重ねます。架空の『地球健康度』にはまとめず、一致しない信号や矛盾も消さずに残します。",
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
    {
      id: "breathing-earth-data",
      dataModeId: "breathing-earth",
      title: "Measured Earth Breath",
      titleJa: "データで息づく地球",
      description: "CO₂で球体が伸縮し、気温とGOSATで色と模様が変わります。",
      accent: "#ff8f74",
      rgb: "255, 143, 116",
      source: `
vec3 modeBreathingEarthData(vec2 p, float t, vec2 response, float memory) {
  float seasonal = (uSignal.y - 0.5) * 2.0;
  float longTerm = uSignal.x;
  float temperature = uSignal.z;

  vec2 center = vec2(0.16, 0.015);
  float earthRadius = 0.57 + seasonal * 0.052;
  vec2 q = (p - center) / earthRadius;
  float radius = length(q);
  float sphere = smoothstep(1.0, 0.955, radius);
  float core = smoothstep(0.98, 0.18, radius);
  float limb = lineGlow(radius - 1.0, 0.026);
  float z = sqrt(max(0.0, 1.0 - radius * radius));

  float longitude = atan(q.x, z) / 6.2831853 + 0.5 + t * 0.006;
  float latitude = asin(clamp(q.y, -1.0, 1.0)) / 3.1415926 + 0.5;
  float gosat = mix(0.45, texture(uGosatTexture, vec2(fract(longitude), 1.0 - latitude)).r, uGosatReady);
  float gosatRelief = smoothstep(0.28, 0.88, gosat + fbm(q * 5.5 + vec2(t * 0.015, 0.0)) * 0.16);
  float gosatContour = lineGlow(sin(gosat * 25.0 + q.x * 2.4 - q.y * 1.7), 0.05) * sphere;

  vec3 cold = vec3(0.055, 0.28, 0.82);
  vec3 neutral = vec3(0.08, 0.72, 0.72);
  vec3 warm = vec3(1.0, 0.18, 0.055);
  vec3 temperatureColor = temperature < 0.5
    ? mix(cold, neutral, temperature * 2.0)
    : mix(neutral, warm, (temperature - 0.5) * 2.0);

  float meridians = (
    lineGlow(sin(longitude * 37.699), 0.055)
    + lineGlow(sin(latitude * 31.416), 0.065)
  ) * sphere * 0.13;
  float weather = smoothstep(
    0.57,
    0.82,
    fbm(q * vec2(4.2, 2.7) + vec2(t * 0.025, -t * 0.012))
  ) * sphere;
  float atmosphere = limb * (0.45 + longTerm * 1.15);
  float dataLight = (0.18 + longTerm * 0.92)
    * (0.42 + gosatRelief * 0.72 + gosatContour * 0.2);

  vec3 background = baseGradient(p, vec3(0.018, 0.07, 0.13));
  vec3 surface = mix(temperatureColor * 0.24, temperatureColor, gosatRelief);
  vec3 color = background
    + surface * sphere * dataLight
    + temperatureColor * gosatContour * (0.12 + longTerm * 0.28)
    + vec3(0.55, 0.92, 1.0) * weather * (0.08 + longTerm * 0.18)
    + vec3(0.65, 0.94, 1.0) * meridians
    + mix(vec3(0.22, 0.62, 1.0), temperatureColor, 0.46) * atmosphere;

  float orbitalDust = 0.0;
  for (int i = 0; i < 7; i++) {
    float fi = float(i);
    vec2 mote = center + vec2(
      sin(t * (0.12 + fi * 0.013) + fi * 1.73),
      cos(t * (0.09 + fi * 0.011) + fi * 2.11)
    ) * vec2(0.82 + fi * 0.035, 0.48 + fi * 0.018);
    orbitalDust += exp(-dot(p - mote, p - mote) * 360.0);
  }

  color += mix(vec3(0.42, 0.82, 1.0), temperatureColor, temperature)
    * orbitalDust * (0.12 + longTerm * 0.32);
  color += vec3(0.78, 0.96, 1.0) * response.x * (0.35 + core * 0.42);
  color += temperatureColor * response.y * 0.2;
  color += vec3(0.24, 0.66, 0.82) * memory * sphere * 0.08;
  return color;
}
`.trim(),
    },
    {
      id: "blue-circulation-live",
      dataModeId: "blue-circulation",
      title: "Current Rush",
      titleJa: "奔流する青",
      description: "海流の平均速度・向きを青いリボン、風の平均速度・向きを白い粒子へ反映します。",
      accent: "#3ce9ff",
      rgb: "60, 233, 255",
      source: `
vec3 modeBlueCirculationLive(vec2 p, float t, vec2 response, float memory) {
  float speed = 0.3 + uSignal.x * 1.5;
  float windSpeed = 0.25 + uSignal.y * 1.8;
  float currentAngle = (uSignal.z - 0.5) * 6.2831853;
  float windAngle = (uSignal.w - 0.5) * 6.2831853;
  vec2 q = rot(-currentAngle) * p;
  float field = fbm(q * 2.2 + vec2(t * 0.08 * speed, -t * 0.045));
  float ribbons = 0.0;
  for (int i = 0; i < 5; i++) {
    float fi = float(i);
    float path = q.y - (fi - 2.0) * 0.17
      - sin(q.x * (2.4 + fi * 0.34) + t * speed + fi * 1.7) * (0.11 + field * 0.1);
    ribbons += lineGlow(path, 0.018 + fi * 0.002) * (0.36 + fi * 0.1);
  }
  vec2 vortexCenter = vec2(0.34 * sin(t * 0.22), 0.22 * cos(t * 0.17));
  vec2 v = q - vortexCenter;
  float vortex = lineGlow(
    sin(atan(v.y, v.x) * 4.0 + length(v) * 25.0 - t * (2.0 + speed)),
    0.035
  ) * exp(-length(v) * 1.35);
  vec2 windQ = rot(-windAngle) * p;
  vec2 sparkGrid = windQ * vec2(12.0, 8.0) - vec2(t * windSpeed * 2.1, 0.0);
  vec2 sparkCell = fract(sparkGrid) - 0.5;
  float sparkSeed = hash21(floor(sparkGrid));
  float sparks = exp(-dot(sparkCell, sparkCell) * 95.0) * smoothstep(0.72, 0.96, sparkSeed);
  float wake = lineGlow(sin((q.x + q.y) * 18.0 - t * 2.4), 0.026) * field;
  vec3 background = baseGradient(p, vec3(0.0, 0.045, 0.15));
  vec3 cyan = mix(vec3(0.0, 0.25, 0.95), vec3(0.2, 1.0, 0.92), field);
  return background
    + cyan * ribbons * (0.34 + speed * 0.28)
    + vec3(0.72, 0.98, 1.0) * vortex * 0.52
    + vec3(0.9, 1.0, 1.0) * sparks * (0.2 + uSignal.y * 0.72)
    + vec3(0.24, 0.56, 1.0) * wake * 0.18
    + vec3(0.4, 0.94, 1.0) * response.x * 0.82
    + vec3(0.18, 0.72, 0.9) * memory * ribbons * 0.12;
}
`.trim(),
    },
    {
      id: "forest-cloud-engine-live",
      dataModeId: "forest-cloud-engine",
      title: "Rainforest Pulse",
      titleJa: "森を走る雨",
      description: "MODIS土地被覆を背景へ写し、選択地点の降水量で雨粒の密度を変えます。",
      accent: "#69ff9d",
      rgb: "105, 255, 157",
      source: `
vec3 modeForestCloudEngineLive(vec2 p, float t, vec2 response, float memory) {
  float rain = 0.18 + uSignal.x * 1.35;
  vec2 q = p;
  vec2 landUv = vec2(fract(p.x * 0.29 + 0.5), clamp(0.5 - p.y * 0.48, 0.0, 1.0));
  vec3 landRaster = texture(uLandCoverTexture, landUv).rgb * uLandCoverReady;
  float landStrength = max(landRaster.g, max(landRaster.r, landRaster.b) * 0.45);
  vec2 selectedSite = vec2((uSignal.y * 2.0 - 1.0) * 1.45, (uSignal.z * 2.0 - 1.0) * 0.78);
  float siteField = exp(-dot(p - selectedSite, p - selectedSite) * 2.8);
  float terrain = fbm(q * 2.1 + vec2(0.0, t * 0.025));
  vec2 cells = q * 6.0;
  vec2 local = fract(cells) - 0.5;
  float seed = hash21(floor(cells));
  float crown = lineGlow(length(local) - (0.16 + seed * 0.14), 0.028)
    * smoothstep(0.28, 0.82, seed + terrain * 0.25);
  float canopy = smoothstep(0.5, 0.76, fbm(q * vec2(4.5, 2.7) + vec2(t * 0.035, 0.0)));
  float roots = lineGlow(
    sin(q.x * 18.0 + q.y * 8.0 + terrain * 5.0 + t * 0.2),
    0.026
  ) * smoothstep(0.1, -0.82, q.y);
  vec2 rainGrid = vec2(q.x * 18.0 + t * 0.3, q.y * 7.0 + t * (1.4 + rain));
  vec2 dropCell = fract(rainGrid) - 0.5;
  float drops = exp(-abs(dropCell.x) * 55.0 - abs(dropCell.y) * 8.0)
    * smoothstep(0.55, 0.92, hash21(floor(rainGrid))) * siteField;
  float cloud = smoothstep(0.52, 0.77, fbm(q * vec2(1.7, 3.4) + vec2(t * 0.08, -t * 0.03)))
    * smoothstep(-0.1, 0.88, q.y);
  float lightning = lineGlow(
    q.x - sin(q.y * 12.0 + floor(t * 1.7)) * 0.035,
    0.012
  ) * cloud * smoothstep(0.78, 0.98, sin(t * 3.4) * 0.5 + 0.5);
  float siteRing = lineGlow(length(p - selectedSite) - (0.12 + rain * 0.08), 0.022);
  vec3 background = baseGradient(p, vec3(0.01, 0.095, 0.055))
    + landRaster * (0.08 + landStrength * 0.22);
  return background
    + mix(vec3(0.03, 0.42, 0.18), vec3(0.5, 1.0, 0.42), seed) * crown * 0.7
    + vec3(0.08, 0.72, 0.34) * canopy * 0.25
    + vec3(0.2, 1.0, 0.65) * roots * 0.3
    + vec3(0.38, 0.86, 1.0) * drops * rain * 0.56
    + vec3(0.32, 0.65, 0.78) * cloud * 0.24
    + vec3(0.9, 1.0, 0.92) * lightning
    + vec3(0.5, 0.94, 1.0) * siteRing * (0.35 + uSignal.x * 0.65)
    + vec3(0.58, 1.0, 0.72) * response.x * 0.76
    + vec3(0.2, 0.8, 0.48) * memory * canopy * 0.13;
}
`.trim(),
    },
    {
      id: "pollination-protocol-live",
      dataModeId: "pollination-protocol",
      title: "Pollination Constellation",
      titleJa: "花粉の星座",
      description: "GloBI関係数を線の密度、GBIF記録数と選択地点を点の密度・位置へ反映します。",
      accent: "#ffe05f",
      rgb: "255, 224, 95",
      source: `
vec3 modePollinationProtocolLive(vec2 p, float t, vec2 response, float memory) {
  float evidence = 0.3 + uSignal.x * 0.7;
  float sightings = 0.3 + uSignal.y * 0.7;
  vec2 selectedRecord = vec2((uSignal.z * 2.0 - 1.0) * 1.45, (uSignal.w * 2.0 - 1.0) * 0.78);
  float flowerField = 0.0;
  float links = 0.0;
  float bees = 0.0;
  for (int i = 0; i < 7; i++) {
    float fi = float(i);
    vec2 flower = (hash22(vec2(fi, 18.4)) - 0.5) * vec2(1.55, 0.98);
    float petalAngle = atan((p - flower).y, (p - flower).x);
    float petalRadius = 0.055 + 0.025 * cos(petalAngle * (5.0 + mod(fi, 3.0)) + t * 0.45);
    flowerField += lineGlow(length(p - flower) - petalRadius, 0.018);
    vec2 bee = flower + vec2(
      sin(t * (0.7 + fi * 0.035) + fi * 1.4),
      cos(t * (0.55 + fi * 0.027) + fi * 1.9)
    ) * vec2(0.22, 0.13);
    bees += exp(-dot(p - bee, p - bee) * 520.0);
    links += lineGlow(sdSegment(p, flower, bee), 0.012) * (0.1 + evidence * 0.22);
  }
  float pollen = smoothstep(0.64, 0.9, noise(p * 20.0 + vec2(t * 0.5, -t * 0.35)));
  float halo = lineGlow(length(p) - (0.3 + sin(t * 0.7) * 0.06), 0.025);
  float selectedPoint = exp(-dot(p - selectedRecord, p - selectedRecord) * 240.0);
  float selectedRing = lineGlow(length(p - selectedRecord) - 0.1, 0.018);
  vec3 background = baseGradient(p, vec3(0.11, 0.025, 0.09));
  vec3 petal = mix(vec3(1.0, 0.22, 0.52), vec3(1.0, 0.9, 0.18), sightings);
  return background
    + petal * flowerField * (0.52 + evidence * 0.34)
    + vec3(1.0, 0.96, 0.52) * bees * (0.5 + sightings * 0.75)
    + vec3(0.65, 1.0, 0.42) * links
    + vec3(1.0, 0.7, 0.18) * pollen * 0.24
    + vec3(1.0, 0.98, 0.72) * (selectedPoint + selectedRing * 0.58)
    + vec3(0.9, 0.4, 1.0) * halo * 0.18
    + vec3(1.0, 0.84, 0.36) * response.x * 0.9
    + vec3(0.82, 0.54, 1.0) * memory * links * 0.25;
}
`.trim(),
    },
    {
      id: "nothing-is-waste-live",
      dataModeId: "nothing-is-waste",
      title: "Circular Foundry",
      titleJa: "循環する工房",
      description: "日本の三処理比率を光の分岐、選択国の再資源化率を外周へ反映します。",
      accent: "#c9ff4f",
      rgb: "201, 255, 79",
      source: `
vec3 modeNothingIsWasteLive(vec2 p, float t, vec2 response, float memory) {
  float recycle = uSignal.x;
  float incineration = uSignal.y;
  float disposal = uSignal.z;
  float countryRecycle = uSignal.w;
  float angle = atan(p.y, p.x);
  float radius = length(p);
  float wheel = lineGlow(radius - (0.34 + 0.035 * sin(angle * 3.0 + t)), 0.025);
  float outer = lineGlow(radius - 0.7, 0.021);
  float spokes = lineGlow(sin(angle * 3.0 + t * 0.65), 0.025)
    * smoothstep(0.72, 0.18, radius);
  float conveyor = lineGlow(
    sin(angle * 6.0 - radius * 18.0 + t * (1.2 + recycle)),
    0.032
  ) * smoothstep(0.92, 0.16, radius);
  vec2 shardGrid = p * 9.0 + vec2(cos(t * 0.4), sin(t * 0.34)) * 2.0;
  vec2 shardCell = fract(shardGrid) - 0.5;
  float shards = exp(-abs(shardCell.x) * 16.0 - abs(shardCell.y) * 34.0)
    * smoothstep(0.68, 0.96, hash21(floor(shardGrid)));
  float furnace = exp(-radius * radius * (8.0 + recycle * 8.0));
  float sector = fract((angle + 3.1415926) / 6.2831853);
  float recycleBranch = 1.0 - smoothstep(recycle, recycle + 0.025, sector);
  float incinerationBranch = smoothstep(recycle - 0.015, recycle + 0.015, sector)
    * (1.0 - smoothstep(recycle + incineration, recycle + incineration + 0.025, sector));
  float disposalBranch = smoothstep(recycle + incineration - 0.015, recycle + incineration + 0.015, sector);
  vec3 branchColor = vec3(0.18, 1.0, 0.42) * recycleBranch
    + vec3(1.0, 0.48, 0.08) * incinerationBranch
    + vec3(0.58, 0.42, 1.0) * disposalBranch;
  float countryRing = lineGlow(radius - (0.56 + countryRecycle * 0.18), 0.022);
  vec3 background = baseGradient(p, vec3(0.075, 0.085, 0.015));
  return background
    + branchColor * (wheel * 0.7 + conveyor * 0.42)
    + vec3(0.96, 1.0, 0.55) * spokes * (0.18 + recycle * 0.5)
    + branchColor * outer * 0.42
    + branchColor * shards * 0.28
    + vec3(0.86, 1.0, 0.72) * countryRing * 0.52
    + vec3(1.0, 0.75, 0.18) * furnace * 0.25
    + vec3(0.62, 1.0, 0.28) * response.x * 0.86
    + vec3(0.35, 0.9, 0.4) * memory * wheel * 0.22;
}
`.trim(),
    },
    {
      id: "anthropocene-scar-live",
      dataModeId: "anthropocene-scar",
      title: "Scar City",
      titleJa: "傷跡の都市",
      description: "VIIRS夜間光を白い地表、選択国のEDGAR排出量を位置と大きさの違う赤い傷へ反映します。",
      accent: "#ff644e",
      rgb: "255, 100, 78",
      source: `
vec3 modeAnthropoceneScarLive(vec2 p, float t, vec2 response, float memory) {
  float emission = uSignal.x;
  float lightVisible = uSignal.w;
  vec2 selectedCountry = vec2((uSignal.y * 2.0 - 1.0) * 1.45, (uSignal.z * 2.0 - 1.0) * 0.78);
  vec2 q = rot(0.08) * p;
  vec2 nightUv = vec2(fract(p.x * 0.29 + 0.5), clamp(0.5 - p.y * 0.48, 0.0, 1.0));
  vec3 nightRaster = texture(uNightLightsTexture, nightUv).rgb * uNightLightsReady;
  float nightLight = max(nightRaster.r, max(nightRaster.g, nightRaster.b));
  float cityX = lineGlow(sin(q.x * 28.0 + floor(q.y * 5.0) * 1.7), 0.018);
  float cityY = lineGlow(sin(q.y * 23.0 + floor(q.x * 6.0) * 1.2), 0.018);
  float blocks = mix((cityX + cityY) * 0.2, nightLight, uNightLightsReady) * lightVisible;
  float terrain = fbm(q * 2.0 + vec2(t * 0.03, -t * 0.02));
  float scar = lineGlow(
    q.y - sin(q.x * 4.0 + t * 0.3) * 0.15 - (terrain - 0.5) * 0.4,
    0.023
  );
  float scarEcho = lineGlow(
    q.y + q.x * 0.38 - sin(q.y * 8.0 - t * 0.48) * 0.06,
    0.016
  );
  float flare = exp(-dot(p - selectedCountry, p - selectedCountry) * (5.0 + emission * 9.0));
  float emissionRing = lineGlow(length(p - selectedCountry) - (0.1 + emission * 0.24), 0.02);
  vec2 trafficGrid = q * vec2(15.0, 9.0) + vec2(t * 1.4, 0.0);
  float traffic = exp(-dot(fract(trafficGrid) - 0.5, fract(trafficGrid) - 0.5) * 80.0)
    * smoothstep(0.72, 0.96, hash21(floor(trafficGrid)));
  float scan = lineGlow(q.y - fract(t * 0.22) * 2.2 + 1.1, 0.025);
  vec3 background = baseGradient(p, vec3(0.08, 0.018, 0.025));
  return background
    + vec3(0.72, 0.82, 1.0) * blocks * 0.25
    + vec3(1.0, 0.12, 0.035) * (scar * 0.72 + scarEcho * 0.4) * (0.5 + emission)
    + vec3(1.0, 0.28, 0.06) * flare * emission * 0.62
    + vec3(1.0, 0.16, 0.04) * emissionRing * (0.35 + emission * 0.65)
    + vec3(1.0, 0.78, 0.42) * traffic * lightVisible * 0.3
    + vec3(0.2, 0.78, 0.82) * scan * 0.15
    + vec3(1.0, 0.34, 0.18) * response.x * 0.82
    + vec3(0.16, 0.72, 0.66) * memory * terrain * 0.13;
}
`.trim(),
    },
    {
      id: "rhythm-of-disaster-live",
      dataModeId: "rhythm-of-disaster",
      title: "Seismic Chorus",
      titleJa: "震動のコーラス",
      description: "選択地震の位置・規模・深さを震源へ置き、P波7km/sとS波4km/sの比率で光輪を広げます。",
      accent: "#ff9d3d",
      rgb: "255, 157, 61",
      source: `
vec3 modeRhythmOfDisasterLive(vec2 p, float t, vec2 response, float memory) {
  float magnitude = 0.55 + uSignal.x * 0.9;
  float depth = uSignal.y;
  vec2 origin = vec2((uSignal.z * 2.0 - 1.0) * 1.45, (uSignal.w * 2.0 - 1.0) * 0.78);
  float radius = length(p - origin);
  float phase = fract(t * (0.18 + magnitude * 0.045));
  float pWave = lineGlow(radius - phase * 1.75, 0.018) * (1.0 - phase * 0.55);
  float sPhase = max(0.0, phase - 0.12);
  float sWave = lineGlow(radius - sPhase * 1.0, 0.03) * (1.0 - sPhase * 0.48);
  float aftershock = lineGlow(radius - fract(phase + 0.48) * 1.45, 0.014) * 0.42;
  float strataNoise = fbm(p * 2.4 + vec2(depth * 5.0, t * 0.018));
  float strata = lineGlow(sin((p.y + strataNoise * 0.11) * 24.0), 0.034);
  float fault = lineGlow(
    p.y + p.x * 0.32 - sin(p.x * 7.0 + t * 0.2) * 0.055,
    0.018
  );
  float debris = smoothstep(0.75, 0.96, noise(p * 24.0 + floor(t * 4.0))) * (pWave + sWave);
  float epicenter = exp(-dot(p - origin, p - origin) * 180.0) * (0.7 + sin(t * 8.0) * 0.3);
  vec3 background = baseGradient(p, vec3(0.095, 0.025, 0.012));
  return background
    + vec3(1.0, 0.86, 0.35) * pWave * (0.45 + magnitude * 0.45)
    + vec3(1.0, 0.22, 0.05) * sWave * (0.5 + magnitude * 0.52)
    + vec3(0.45, 0.72, 1.0) * aftershock
    + vec3(0.42, 0.16, 0.05) * strata * (0.16 + depth * 0.2)
    + vec3(1.0, 0.42, 0.08) * fault * 0.55
    + vec3(1.0, 0.92, 0.58) * (debris * 0.32 + epicenter)
    + vec3(1.0, 0.55, 0.15) * response.x * 0.9
    + vec3(0.72, 0.95, 0.62) * memory * fault * 0.14;
}
`.trim(),
    },
    {
      id: "three-ecologies-live",
      dataModeId: "three-ecologies",
      title: "Ecology Prism",
      titleJa: "三層のプリズム",
      description: "MODIS土地被覆、31か国の都市人口平均、24件の世界遺産標本を緑・青・紫の別層へ反映します。",
      accent: "#d88dff",
      rgb: "216, 141, 255",
      source: `
vec3 modeThreeEcologiesLive(vec2 p, float t, vec2 response, float memory) {
  float urbanMean = uSignal.x;
  float cultureCount = uSignal.y;
  float stage = uSignal.z;
  vec2 landUv = vec2(fract(p.x * 0.29 + 0.5), clamp(0.5 - p.y * 0.48, 0.0, 1.0));
  vec3 landRaster = texture(uLandCoverTexture, landUv).rgb * uLandCoverReady;
  float landField = max(landRaster.g, max(landRaster.r, landRaster.b) * 0.35);
  vec2 a = vec2(-0.34, 0.12) + vec2(sin(t * 0.34), cos(t * 0.27)) * 0.09;
  vec2 b = vec2(0.34, 0.13) + vec2(cos(t * 0.29), sin(t * 0.31)) * 0.09;
  vec2 c = vec2(0.0, -0.34) + vec2(sin(t * 0.23), cos(t * 0.25)) * 0.08;
  float fa = lineGlow(length(p - a) - (0.34 + sin(t * 0.7) * 0.03), 0.026);
  float fb = lineGlow(length(p - b) - (0.34 + cos(t * 0.66) * 0.03), 0.026);
  float fc = lineGlow(length(p - c) - (0.34 + sin(t * 0.58 + 1.0) * 0.03), 0.026);
  float fieldA = exp(-length(p - a) * 2.2);
  float fieldB = exp(-length(p - b) * 2.2);
  float fieldC = exp(-length(p - c) * 2.2);
  float interference = min(1.0, fieldA * fieldB + fieldB * fieldC + fieldC * fieldA);
  float weave = lineGlow(
    sin(p.x * 13.0 + fbm(p * 3.0 + t * 0.03) * 5.0)
      + sin(p.y * 15.0 - t * 0.4),
    0.04
  ) * interference;
  vec2 prismGrid = p * 10.0 + vec2(t * 0.2, -t * 0.15);
  float motes = exp(-dot(fract(prismGrid) - 0.5, fract(prismGrid) - 0.5) * 90.0)
    * smoothstep(0.72 + (1.0 - cultureCount) * 0.18, 0.98, hash21(floor(prismGrid)));
  float ecoStage = 0.3 + (1.0 - smoothstep(0.12, 0.36, stage)) * 0.7 + step(0.95, stage) * 0.7;
  float socialStage = 0.3 + (1.0 - smoothstep(0.2, 0.25, abs(stage - 0.333))) * 0.7 + step(0.95, stage) * 0.7;
  float cultureStage = 0.3 + (1.0 - smoothstep(0.2, 0.25, abs(stage - 0.666))) * 0.7 + step(0.95, stage) * 0.7;
  vec3 background = baseGradient(p, vec3(0.045, 0.025, 0.12))
    + landRaster * landField * 0.16 * ecoStage;
  vec3 color = background
    + vec3(0.12, 1.0, 0.52) * (fa * 0.62 + fieldA * 0.13) * ecoStage
    + vec3(0.12, 0.52, 1.0) * (fb * 0.62 + fieldB * (0.05 + urbanMean * 0.16)) * socialStage
    + vec3(0.92, 0.28, 1.0) * (fc * 0.62 + fieldC * 0.13) * cultureStage;
  return color
    + vec3(0.92, 0.98, 1.0) * interference * 0.3
    + vec3(1.0, 0.76, 0.92) * weave * 0.46
    + vec3(0.72, 0.88, 1.0) * motes * (0.12 + cultureCount * 0.2)
    + vec3(0.72, 0.58, 1.0) * response.x * 0.9
    + vec3(0.5, 1.0, 0.85) * memory * interference * 0.16;
}
`.trim(),
    },
    {
      id: "earth-organ-live",
      dataModeId: "earth-organ",
      title: "Living Grid",
      titleJa: "生きている電力網",
      description: "選択地点の日射・風速と同じ国の再エネ比率を黄・青・緑へ分け、二地点選択だけを仮想回路にします。",
      accent: "#56ffd2",
      rgb: "86, 255, 210",
      source: `
vec3 modeEarthOrganLive(vec2 p, float t, vec2 response, float memory) {
  float solar = uSignal.x;
  float wind = uSignal.y;
  float renewable = uSignal.z;
  float connected = uSignal.w;
  float radius = length(p);
  float angle = atan(p.y, p.x);
  float sun = exp(-radius * radius * 8.0) + lineGlow(radius - 0.22, 0.023);
  float rays = lineGlow(sin(angle * 18.0 + t * (0.45 + solar)), 0.032)
    * smoothstep(0.82, 0.12, radius);
  float windArc = lineGlow(
    sin(p.y * 9.0 + p.x * 2.2 + fbm(p * 2.3) * 3.0 - t * (0.8 + wind)),
    0.034
  );
  float circuitX = lineGlow(sin(p.x * 17.0 + floor(p.y * 5.0)), 0.022);
  float circuitY = lineGlow(sin(p.y * 13.0 - floor(p.x * 6.0)), 0.022);
  float circuits = (circuitX + circuitY) * (0.12 + renewable * 0.5);
  float nodes = 0.0;
  float links = 0.0;
  for (int i = 0; i < 8; i++) {
    float fi = float(i);
    vec2 node = (hash22(vec2(fi, 51.7)) - 0.5) * vec2(1.5, 0.96);
    nodes += exp(-dot(p - node, p - node) * 190.0) * (0.7 + 0.3 * sin(t * 2.0 + fi));
    links += lineGlow(sdSegment(p, node, node * -0.28), 0.012) * (0.05 + renewable * 0.18 + connected * 0.18);
  }
  float pulse = lineGlow(radius - fract(t * 0.34) * 1.2, 0.018);
  vec3 background = baseGradient(p, vec3(0.005, 0.075, 0.075));
  return background
    + vec3(1.0, 0.74, 0.16) * (sun * (0.2 + solar * 0.5) + rays * solar * 0.32)
    + vec3(0.22, 0.82, 1.0) * windArc * (0.18 + wind * 0.48)
    + vec3(0.18, 1.0, 0.62) * circuits
    + vec3(0.82, 1.0, 0.88) * nodes * 0.56
    + vec3(0.34, 1.0, 0.72) * links
    + vec3(0.55, 0.96, 1.0) * pulse * 0.16
    + vec3(0.38, 1.0, 0.78) * response.x * 0.9
    + vec3(0.2, 0.72, 0.66) * memory * links * 0.2;
}
`.trim(),
    },
    {
      id: "senseware-2050-live",
      dataModeId: "senseware-2050",
      title: "Gaia Synapse",
      titleJa: "地球の神経星座",
      description: "01〜09の代表値を九節点の明るさへ、観客の接触記憶を外周へ重ね、合計点にはしません。",
      accent: "#e0fbff",
      rgb: "224, 251, 255",
      source: `
vec3 modeSenseware2050Live(vec2 p, float t, vec2 response, float memory) {
  float radius = length(p);
  float globe = smoothstep(0.82, 0.7, radius);
  float horizon = lineGlow(radius - 0.76, 0.024);
  float neural = 0.0;
  float nodes = 0.0;
  vec3 signalColor = vec3(0.0);
  for (int i = 0; i < 9; i++) {
    float fi = float(i);
    float dataValue = uSourceSignals[i];
    float contribution = 0.18 + dataValue * 1.25;
    float touchMemory = uModeMemory[i];
    float orbitAngle = fi * 0.6981317 + t * (0.035 + fi * 0.003);
    vec2 node = vec2(cos(orbitAngle), sin(orbitAngle)) * (0.44 + mod(fi, 3.0) * 0.1);
    node.y *= 0.72;
    float nodeGlow = exp(-dot(p - node, p - node) * 210.0) * contribution;
    nodes += nodeGlow;
    neural += lineGlow(sdSegment(p, node, node * -0.22), 0.012) * (0.08 + dataValue * 0.3);
    signalColor += mix(
      vec3(0.2, 0.86, 1.0),
      vec3(0.92, 0.35, 1.0),
      fract(fi * 0.37)
    ) * nodeGlow;
    signalColor += vec3(0.35, 1.0, 0.78) * touchMemory
      * lineGlow(length(p - node) - (0.06 + touchMemory * 0.08), 0.016);
  }
  float latitude = lineGlow(sin(p.y * 15.0 + t * 0.35), 0.042) * globe;
  float longitude = lineGlow(sin(atan(p.y, p.x) * 10.0 - t * 0.24), 0.042) * globe;
  float core = exp(-radius * radius * 12.0) * (0.68 + 0.32 * sin(t * 1.7));
  float synapseWave = lineGlow(radius - fract(t * 0.28) * 0.82, 0.018) * globe;
  vec2 starGrid = p * 14.0 + vec2(t * 0.08, -t * 0.05);
  float stars = exp(-dot(fract(starGrid) - 0.5, fract(starGrid) - 0.5) * 130.0)
    * smoothstep(0.78, 0.98, hash21(floor(starGrid)));
  vec3 background = baseGradient(p, vec3(0.018, 0.055, 0.13));
  return background
    + signalColor * 0.65
    + vec3(0.28, 0.94, 0.75) * neural * 0.32
    + vec3(0.72, 0.96, 1.0) * (latitude + longitude) * 0.22
    + vec3(0.9, 0.62, 1.0) * core * 0.46
    + vec3(0.32, 0.78, 1.0) * synapseWave * 0.4
    + vec3(0.84, 0.96, 1.0) * stars * 0.25
    + vec3(0.8, 0.98, 1.0) * horizon * 0.42
    + vec3(0.78, 0.7, 1.0) * response.x * 0.95
    + vec3(0.45, 1.0, 0.82) * memory * nodes * 0.18;
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
        "森には、雨を受け止め、土に水をため、葉から空気へ水分を返す働きがあります。",
      seeing:
        "背景は森林、草地、都市、水面などの土地の種類です。水色の円と粒子は、世界31地点の平均的な雨の量を表します。二つのデータを重ねていますが、この画面だけで森林と雨の原因・結果を決めることはできません。",
      touch:
        "触れると、光が地面の下と空の両方へ伸びます。根、土、葉、大気のあいだを水が動く様子をイメージした演出です。",
      context:
        "授業「森は地球の気候安定装置」では、森を木材の量だけでなく、水や土、気温を支える働きから見ます。この展示は、そのうち森林と雨の分布を並べたものです。",
      question: "雨の多い場所と森林の分布には、どんな重なりがありましたか。",
    },
    "pollination-protocol": {
      lead:
        "花粉を運ぶ虫と花は、長い時間をかけて互いに関わってきました。その記録を線と点で見ます。",
      seeing:
        "線は文献に残る花と送粉者の関係、黄色い点はミツバチが観察された場所です。線と点は別の資料から来ているため、地図上では勝手に結びません。",
      touch:
        "触れると二つの光が近づき、重なった場所に新しい色が生まれます。花と虫の出会いをそのまま再現するのではなく、関係が生まれる様子を抽象化した動きです。",
      context:
        "授業「花と昆虫の共進化」では、花と虫が互いの形や行動に影響してきた歴史を学びます。送粉を守るには、生きものだけでなく、すみかや季節、農薬の使い方も関わります。",
      question: "生きものが出会える場所を残すには、何が必要でしょう。",
    },
    "nothing-is-waste": {
      lead:
        "落ち葉や死がいは、土に戻って次の生命に使われます。人が捨てたものは、どれくらい次の資源に戻っているでしょうか。",
      seeing:
        "円の大きさは国ごとの再資源化率です。実線は国連の記録、内側の破線は近い国から計算した仮の値、外側の破線は自分で動かせる試算です。",
      touch:
        "スライダーを動かすと、外側の破線だけが変わります。現実の統計は変わりません。現在の数字と「こうなったら」を並べて見るための操作です。",
      context:
        "授業「自然界にはゴミもうんちも存在しない」では、ある生きものの不要物が次の生きものの材料になる循環を扱います。人の製品も、作るときから回収や修理まで考える必要があります。",
      question: "今日捨てたものは、このあとどこへ行くでしょう。",
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
        "最後の画面には、ここまで見てきた九つのデータと、あなたが触れた跡が集まります。",
      seeing:
        "CO₂、海流、森林、生きもの、ごみ、排出量、地震、都市と文化、エネルギー。単位も意味も違うので、平均や総合点にはせず、九本の枝として表示します。",
      touch:
        "触れるたびに新しい枝が加わります。触れた跡はこの端末の画面にだけ残り、外部へ送信されません。リセットすると消えます。",
      context:
        "授業「地球大の感覚神経系を獲得した人類」が、この作品の出発点です。人工衛星や観測所の記録を集めると、地球規模の変化が見えてきます。ただし、データが私たちの行動まで決めてくれるわけではありません。",
      question: "九つのデータを見たあと、どの変化がいちばん気になりましたか。",
    },
    "breathing-earth-data": {
      lead: "01を、観測値と直接つながる呼吸へ作り直しました。",
      seeing: "半径＝CO₂季節成分、光＝長期CO₂、色＝気温、模様＝GOSATです。",
      touch: "時間を動かすと、その年月の形と色へ切り替わります。",
      context: "呼吸の大きさは周期演出ではなく、月別CO₂で決まります。",
      question: "01と11を見比べたとき、どちらが『地球の呼吸』として伝わるでしょうか。",
    },
    "blue-circulation-live": {
      lead: "02を、海流と風の平均ベクトルへ直接つなぎました。",
      seeing: "海流の平均速度・向きが青いリボン、風の平均速度・向きが白い粒子を決めます。",
      touch: "触れると流れが強く発光します。",
      context: "海流と風は別々に平均し、一つの値へ混ぜません。",
      question: "02と12では、どちらが流れを感じられますか。",
    },
    "forest-cloud-engine-live": {
      lead: "03を、土地被覆画像と選択地点の雨量へ直接つなぎました。",
      seeing: "MODIS画像が地表、NASA POWERの降水量が雨粒の密度と地点の輪を決めます。",
      touch: "触れると森全体へ光が走ります。",
      context: "森林と雨の重なりを見せ、因果関係までは断定しません。",
      question: "03と13では、森と雨の関係が伝わりますか。",
    },
    "pollination-protocol-live": {
      lead: "04を、関係数・観察数・選択地点へ直接つなぎました。",
      seeing: "GloBI件数が線、GBIF件数が点の密度、選択した観察地点が白い輪を決めます。",
      touch: "触れると花粉の光が広がります。",
      context: "記録にない関係は勝手に結びません。",
      question: "04と14では、出会いの動きが見えますか。",
    },
    "nothing-is-waste-live": {
      lead: "05を、三つの処理比率と国別再資源化率へ直接つなぎました。",
      seeing: "緑＝再資源化、橙＝焼却等、紫＝最終処分。外周は選択国の再資源化率です。",
      touch: "触れると分岐した光が中心へ戻ります。",
      context: "操作で変わる値は試算で、統計そのものではありません。",
      question: "05と15では、循環の行き先が見えますか。",
    },
    "anthropocene-scar-live": {
      lead: "06を、夜間光画像と選択国の排出量へ直接つなぎました。",
      seeing: "VIIRS画像が白い地表、EDGARの国別排出量と位置が赤い傷を決めます。",
      touch: "長押しすると都市の光だけが薄くなります。",
      context: "夜間光を排出量へ換算してはいません。",
      question: "06と16では、二つの違いが見分けられますか。",
    },
    "rhythm-of-disaster-live": {
      lead: "07を、選択地震の位置・規模・深さへ直接つなぎました。",
      seeing: "黄色はP波7km/s、赤はS波4km/s。震源位置と明るさは選択記録で変わります。",
      touch: "触れると震源から新しい波が広がります。",
      context: "波の到達は学習用の単純化した計算です。",
      question: "07と17では、二つの速さの差が見えますか。",
    },
    "three-ecologies-live": {
      lead: "08を、生態・社会・文化の三資料へ直接つなぎました。",
      seeing: "MODIS土地被覆＝緑、都市人口平均＝青、世界遺産標本数＝紫です。",
      touch: "触れると三層の重なりが白く光ります。",
      context: "文化や記憶を一つの点数にはしません。",
      question: "08と18では、三層を同時に読めますか。",
    },
    "earth-organ-live": {
      lead: "09を、選択地点の日射・風と同じ国の電力統計へ直接つなぎました。",
      seeing: "黄＝日射、青＝風速、緑＝再エネ比率。二地点選択だけが仮想リンクです。",
      touch: "地点を選ぶと回路の結びつきが強まります。",
      context: "光の線は実在の送電網ではありません。",
      question: "09と19では、分散する力が伝わりますか。",
    },
    "senseware-2050-live": {
      lead: "10を、01〜09の代表値と接触記憶へ直接つなぎました。",
      seeing: "九つの代表値が各節点の明るさ、観客の接触が節点の外周を決めます。",
      touch: "触れると節点のあいだへ光が走ります。",
      context: "合計点や地球健康度にはまとめません。",
      question: "10と20では、違いを残したつながりが見えますか。",
    },
  };

  const modeDataNarratives = Object.freeze({
    "breathing-earth": "地図の見方：色はCO₂濃度です。斜線のマスは、近くの8地点から計算した値です。1958〜2009年は後年の衛星地図を使った再構成、2026年以降は最近10年の傾向が続いた場合の試算です。",
    "blue-circulation": "地図の見方：青は海流の速さ、シアンの線は同じ流れが続いた場合の移動距離です。白い矢印は風です。線は計算した目安で、海の予報ではありません。",
    "forest-cloud-engine": "地図の見方：背景は2023年の土地の種類、水色の円は世界31地点の平均的な雨の量です。地点の間には値を入れていません。二つの重なりだけで原因・結果を決めることもできません。",
    "pollination-protocol": "地図の見方：黄色い点はGBIFに登録されたミツバチの観察記録です。花と送粉者の線は、GloBIにある別の記録です。どこで起きたか分からない関係は、地図の点へ結んでいません。",
    "nothing-is-waste": "地図の見方：実線は国連の記録、内側の破線は近い5か国から計算した仮の値、外側の破線は自分で動かせる試算です。三つの数字を線の種類で分けました。",
    "anthropocene-scar": "地図の見方：赤い円は国ごとの温室効果ガス排出量、白い地表は人工衛星が見た夜の明かりです。長押しで白だけを薄くできます。二つは別々のデータです。",
    "rhythm-of-disaster": "地図の見方：世界地図には、USGSが記録した2000年以降のM7.5以上の地震を表示します。日本の代表6件では、気象庁の実測震度と、P波・S波が届く目安を再生します。",
    "three-ecologies": "地図の見方：緑は土地の種類、青は都市人口、紫は各地域から選んだ世界遺産です。三つは意味の違う資料です。重ねても、文化や心を点数にはしません。",
    "earth-organ": "地図の見方：外側は31地点の日差しと風、内側はその国の再生可能電力の割合です。二地点を結ぶ破線だけが、この展示で作る試算です。",
    "senseware-2050": "地図の見方：01〜09のデータを48秒で順番に表示し、ここまでに触れた跡を重ねます。単位が違うため、合計や平均にはしていません。",
    "breathing-earth-data": "描画の見方：半径＝NOAA月別CO₂の季節成分、光量＝NOAAの長期増加、青〜赤＝NASA気温偏差、球面の濃淡＝GOSAT XCO₂です。GOSAT観測期間外は最寄りの格子模様へNOAAとの差分を加えたDERIVED表示です。",
    "blue-circulation-live": "描画：NOAA海流79ベクトルの平均速度・向き＝青、NASA POWER 31地点の平均風速・向き＝白。",
    "forest-cloud-engine-live": "描画：MODIS土地被覆画像＝地表、選択したNASA POWER地点の降水量＝雨粒と輪。",
    "pollination-protocol-live": "描画：GloBI関係数＝線密度、GBIF観察数＝点密度、選択観察地点＝白い輪。資料間は接続しません。",
    "nothing-is-waste-live": "描画：日本2024年度の再資源化・焼却等・最終処分比率＝三色分岐、選択国の再資源化率＝外周。",
    "anthropocene-scar-live": "描画：VIIRS 2016夜間光画像＝白、選択国のEDGAR排出量・代表位置＝赤い傷。長押しは白だけを弱めます。",
    "rhythm-of-disaster-live": "描画：USGS選択地震の経緯度＝震源、規模＝光量、深さ＝地層。P/S波は7:4の速度比です。",
    "three-ecologies-live": "描画：MODIS土地被覆＝緑、31か国の都市人口平均＝青、24件の世界遺産標本＝紫。合計しません。",
    "earth-organ-live": "描画：選択地点の日射＝黄、風速＝青、同じ国の再エネ比率＝緑。二地点選択のみSCENARIOです。",
    "senseware-2050-live": "描画：01〜09の代表値＝九節点の明るさ、接触記憶＝外周。単位を足し合わせません。",
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
    "breathing-earth-data": "授業とのつながり：『なぜ風は吹くのか？――宇宙船地球号の循環系を理解する』／01の説明と実装を照合する比較展示",
    "blue-circulation-live": "授業：宇宙船地球号の循環系／02との比較版",
    "forest-cloud-engine-live": "授業：森は地球の気候安定装置／03との比較版",
    "pollination-protocol-live": "授業：花と昆虫の共進化／04との比較版",
    "nothing-is-waste-live": "授業：自然界にはゴミもうんちも存在しない／05との比較版",
    "anthropocene-scar-live": "授業：人類世3.0／06との比較版",
    "rhythm-of-disaster-live": "授業：地球の変動リズム／07との比較版",
    "three-ecologies-live": "授業：三つのエコロジー／08との比較版",
    "earth-organ-live": "授業：地球の変動リズム／09との比較版",
    "senseware-2050-live": "授業：地球大の感覚神経系／10との比較版",
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
