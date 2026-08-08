(() => {
  "use strict";

  // Keep the highlight independent from each button's own pseudo-elements.
  // A single fixed layer also covers buttons created later by mode renderers.
  const buttonGlint = document.createElement("span");
  buttonGlint.className = "gaia-global-button-glint";
  buttonGlint.setAttribute("aria-hidden", "true");
  document.body.append(buttonGlint);

  const triggerButtonGlint = (button) => {
    if (!(button instanceof HTMLButtonElement) || button.disabled) {
      return;
    }

    const bounds = button.getBoundingClientRect();
    if (bounds.width < 2 || bounds.height < 2) {
      return;
    }

    const buttonStyle = getComputedStyle(button);
    const colorVariables = [
      "--button-accent-rgb",
      "--intro-rgb",
      "--path-rgb",
      "--novel-rgb",
      "--space-rgb",
      "--space-accent-rgb",
      "--gx-rgb",
      "--accent-rgb",
    ];
    const glintColor = colorVariables
      .map((property) => buttonStyle.getPropertyValue(property).trim())
      .find(Boolean) || "174, 231, 255";

    buttonGlint.style.left = `${bounds.left}px`;
    buttonGlint.style.top = `${bounds.top}px`;
    buttonGlint.style.width = `${bounds.width}px`;
    buttonGlint.style.height = `${bounds.height}px`;
    buttonGlint.style.borderRadius = buttonStyle.borderRadius;
    buttonGlint.style.setProperty("--gaia-button-glint-rgb", glintColor);

    buttonGlint.classList.remove("is-active");
    void buttonGlint.offsetWidth;
    buttonGlint.classList.add("is-active");
  };

  document.addEventListener("pointerover", (event) => {
    const button = event.target instanceof Element ? event.target.closest("button") : null;
    if (!button || (event.relatedTarget instanceof Node && button.contains(event.relatedTarget))) {
      return;
    }
    triggerButtonGlint(button);
  });

  document.addEventListener("focusin", (event) => {
    const button = event.target instanceof Element ? event.target.closest("button") : null;
    if (button) {
      triggerButtonGlint(button);
    }
  });

  buttonGlint.addEventListener("animationend", (event) => {
    if (event.animationName === "gaia-button-glint-frame") {
      buttonGlint.classList.remove("is-active");
    }
  });

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
  const openingLayer = document.querySelector("#gaia-opening");
  const introPathStage = document.querySelector("#intro-path-stage");
  const introSenseStage = document.querySelector("#intro-sense-stage");
  const introPathGrid = document.querySelector("#intro-path-grid");
  const introPathButtons = Array.from(document.querySelectorAll("[data-intro-path]"));
  const introSoundPreviewButton = document.querySelector(".intro-path-card--sound");
  const introVisuals = Array.from(document.querySelectorAll("[data-intro-visual]"));
  const introPathBack = document.querySelector("#intro-path-back");
  const introPathKicker = document.querySelector("#intro-path-kicker");
  const introSenseTitle = document.querySelector("#intro-sense-title");
  const introSenseLead = document.querySelector("#intro-sense-lead");
  const introSelectionPrompt = document.querySelector("#intro-selection-prompt");
  const introPathNote = document.querySelector("#intro-path-note");
  const introModeList = document.querySelector("#intro-mode-list");
  const introSelectionPreview = document.querySelector(".intro-selection-preview");
  const introSelectionNumber = document.querySelector("#intro-selection-number");
  const introSelectionTitle = document.querySelector("#intro-selection-title");
  const introSelectionCopy = document.querySelector("#intro-selection-copy");
  const introArchitectureJump = document.querySelector("#intro-architecture-jump");
  const introArchitectureBack = document.querySelector("#intro-architecture-back");
  const introOpenDataExhibit = document.querySelector("#intro-open-data-exhibit");
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
  const mapGuideTitle = document.querySelector("#map-guide-title");
  const mapGuideSubject = document.querySelector("#map-guide-subject");
  const mapGuideReading = document.querySelector("#map-guide-reading");
  const mapGuideAction = document.querySelector("#map-guide-action");
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
  const EARTH_INITIAL_CENTER_LONGITUDE = 138;
  const EARTH_RADIUS_KM = 6371;
  const P_WAVE_SPEED_KM_S = 7;
  const S_WAVE_SPEED_KM_S = 4;
  const JAPAN_WAVE_VISUAL_LIMIT_KM = 2500;
  const JAPAN_HISTORY_CARD_DELAY = 8000;
  const GAIA_SIGNALS_DATA = "./data/gaia-signals.json?v=gaia-31";
  const NATURAL_EARTH_LAND_DATA = "./data/natural-earth-50m-land.geojson?v=gaia-27";

  const MAP_READING_GUIDES = [
    {
      title: "CO₂は、いつから増えたのか？",
      subject: "大気中のCO₂濃度が、1958年から現在、そして2050年の試算までどう変わるかを見る地図です。",
      reading: "地図の色がCO₂濃度です。斜線は観測がない場所を周辺8地点から補った印。2026年以降は実測ではなく試算です。",
      action: "年表示を動かすかマスを押すと、その時点の濃度と、実測・補完・試算の区分を確認できます。",
    },
    {
      title: "風と海は、どこへ運ぶのか？",
      subject: "海流・風・海面水温を一枚に重ねた、世界の循環図です。",
      reading: "青い光は海流の速さ、シアンの線は同じ流れが14日続いた場合の移動距離、白い矢印は風です。",
      action: "青い点を押すと動きが止まり、その地点の流速・方向・水温を読めます。",
    },
    {
      title: "森が多い場所では、雨も多いのか？",
      subject: "森の多い場所と雨の多い場所を、同じ世界地図で見比べます。森林が雨を起こすと断定する図ではありません。",
      reading: "緑が濃い場所は森林、黄・茶・灰は草地・農地・都市などです。水色の光は31地点の平均降水量で、大きいほど雨が多い場所です。",
      action: "水色の地点を押すと、場所の名前・年間降水量・周辺の森林率・データの年が表示されます。森と雨の重なりを自分で確かめられます。",
    },
    {
      title: "花と虫は、どこで出会ったのか？",
      subject: "ミツバチが観察された場所と、文献に記録された花との関係を重ねた地図です。",
      reading: "黄色い点はGBIFの観察記録、花と虫を結ぶ線はGloBIの関係記録です。点と線は別の資料から来ています。",
      action: "点を押すと、生きもの・観察場所・記録日と、どの資料に基づくかを読めます。",
    },
    {
      title: "捨てたものは、どこへ行くのか？",
      subject: "国ごとの廃棄物と再資源化率を、現在値・補完値・仮想案に分けた地図です。",
      reading: "実線は国連の記録、内側の破線は近い5か国から補った値、外側の破線は観客が動かす仮想案です。",
      action: "スライダーを動かすと仮想案だけが変化します。現状の記録とは混ざりません。",
    },
    {
      title: "都市の光の下に、何が隠れているのか？",
      subject: "国ごとの温室効果ガス排出量と、人工衛星が見た夜の明かりを比較する地図です。",
      reading: "赤い円が排出量、白い光が夜間光です。夜の明るさを、排出量そのものとして扱ってはいません。",
      action: "地図を長押しすると白い光だけが薄れ、環境負荷の層と見比べられます。",
    },
    {
      title: "地震は、世界をどう伝わるのか？",
      subject: "USGSが記録した世界のM7.5以上の地震（2000〜2026）を表示します。日本では、気象庁の震度6弱以上の観測点まで詳しく重ねています。",
      reading: "世界の点は震源の位置・規模・深さ、日本の細かな点は実際に観測された震度です。二つの輪はP波とS波の到達目安で、速さは簡略化した地殻モデルです。",
      action: "海外の震源を押すと発生時刻・深さ・マグニチュードを、日本の地震を選ぶと波の到達後に各地の震度を読めます。",
    },
    {
      title: "自然・暮らし・記憶は、どこで重なるのか？",
      subject: "森林、都市で暮らす人の割合、文化と記憶の場所を三つの層で見る地図です。",
      reading: "緑は森林、青は都市人口、紫は各地域から選んだ世界遺産です。文化の価値を件数で順位づけはしていません。",
      action: "時点を動かすと三つの層が順に現れ、最後に重なります。点を押すと出典と意味を読めます。",
    },
    {
      title: "自然の力を、どこで分かち合えるか？",
      subject: "自然エネルギーの条件と、各国の現在の再生可能電力比率を分けて見る地図です。",
      reading: "黄色は31地点の日差しと風、緑は国全体の再生可能電力比率。二地点を結ぶ破線だけが展示上の仮想案です。",
      action: "二地点を選ぶと、地域を結ぶ分散型ネットワークのシナリオが生まれます。",
    },
    {
      title: "九つの信号を、どう受け取るか？",
      subject: "01〜09の信号を一つの画面へ戻し、互いに矛盾する変化もそのまま残す地図です。",
      reading: "単位の違うデータは合計せず、色・線・点として並べます。架空の『地球健康度』にはまとめません。",
      action: "地図に触れると九つの信号が順に応答し、観客の軌跡が最後のレイヤーとして残ります。",
    },
  ];
  const JMA_HISTORY_DATA = "./data/jma-intensity-history.json";
  const JAPAN_DATA_BOUNDS = {
    west: 122,
    east: 154,
    south: 20,
    north: 48,
  };
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const runSceneTransition = (swapScene, tone = "default", event = null) => {
    const hasPointerOrigin = Number.isFinite(event?.clientX) && Number.isFinite(event?.clientY) &&
      (event.clientX !== 0 || event.clientY !== 0);
    const transition = window.GaiaSceneTransition;
    if (!transition) return Promise.resolve(swapScene());
    return transition.run(swapScene, {
      tone,
      origin: hasPointerOrigin ? { x: event.clientX, y: event.clientY } : undefined,
    });
  };
  const MAP_POI_HIT_RADII = {
    fine: { history: 34, earthquake: 30, node: 32 },
    coarse: { history: 46, earthquake: 42, node: 44 },
  };
  const japanContext = japanOverlay.getContext("2d");
  const gosatHeatmapCanvas = document.createElement("canvas");
  const gosatHeatmapContext = gosatHeatmapCanvas.getContext("2d");
  const referenceWorldCanvas = document.createElement("canvas");
  const referenceWorldContext = referenceWorldCanvas.getContext("2d");
  let gosatHeatmapCacheKey = "";
  let referenceWorldCacheKey = "";
  const gosatImputedIndexCache = new WeakMap();

  const appContent = window.GaiaAppContent;
  if (!appContent) {
    throw new Error("app-content.js must load before app.js");
  }
  const {
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
  } = appContent;
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
  let introStage = "path";
  let introSelectedPath = null;
  let introRestoreFocus = false;
  let introCloseTimer = 0;
  let introRevealGeneration = 0;
  let introScrambleGeneration = 0;
  const introRevealTimers = new Set();
  let japanIsOpen = false;
  let japanDataIsOpen = false;
  let japanRestoreFocus = true;
  let japanCloseTimer = 0;
  let japanTilesDirty = true;
  let lastJapanOverlayRenderAt = -Infinity;
  let lastBackgroundRenderAt = -Infinity;
  let japanTileErrors = 0;
  let japanEarthquakeDataState = "idle";
  let japanHistoryDataState = "idle";
  let japanDataLayer = "history";
  let storyModeDetour = null;
  let mapScope = "earth";
  let japanDataUpdatedAt = null;
  let japanHistoryUpdatedAt = null;
  let selectedJapanPoi = null;
  let japanWaveReplay = null;
  let gaiaSnapshot = null;
  let gaiaSnapshotError = null;
  let gaiaModeById = new Map();
  let naturalEarthLandState = "loading";
  let naturalEarthLandError = null;
  let naturalEarthLandRings = [];
  const naturalEarthPathCache = new Map();
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
    earthZoom: 1,
    earthOffsetX: 0,
    earthOffsetY: 0,
    pointerId: null,
    pointers: new Map(),
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0,
    dragged: false,
    gesture: false,
    pinchDistance: 0,
    pinchCenterX: 0,
    pinchCenterY: 0,
    pressStartedAt: 0,
    width: 0,
    height: 0,
    earthProjection: null,
  };

  const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));
  const wrapLongitude = (longitude) => ((longitude + 540) % 360) - 180;
  const earthLongitudeToMapX = (longitude) =>
    wrapLongitude(longitude - EARTH_INITIAL_CENTER_LONGITUDE) + 180;
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

  const getEarthProjection = (rect) => {
    const baseScale = Math.max(
      0.1,
      Math.max(rect.width / 360, rect.height / 180),
    );
    const zoom = clamp(japanView.earthZoom, 1, 8);
    const scale = baseScale * zoom;
    const width = 360 * scale;
    const height = 180 * scale;
    // Use a cover scale so the 2:1 world projection always fills viewports
    // with a different aspect ratio. The unavoidable excess is cropped and
    // becomes the available drag range instead of appearing as letterboxing.
    const maximumOffsetX = Math.abs(width - rect.width) / 2;
    const maximumOffsetY = Math.abs(height - rect.height) / 2;
    japanView.earthZoom = zoom;
    japanView.earthOffsetX = clamp(
      japanView.earthOffsetX,
      -maximumOffsetX,
      maximumOffsetX,
    );
    japanView.earthOffsetY = clamp(
      japanView.earthOffsetY,
      -maximumOffsetY,
      maximumOffsetY,
    );
    return {
      scale,
      width,
      height,
      originX: (rect.width - width) / 2 + japanView.earthOffsetX,
      originY: (rect.height - height) / 2 + japanView.earthOffsetY,
    };
  };

  const setEarthZoom = (nextZoom, clientX, clientY) => {
    const rect = japanMap.getBoundingClientRect();
    if (rect.width < 1 || rect.height < 1) return;

    const current = getEarthProjection(rect);
    const anchorX = clamp(clientX - rect.left, 0, rect.width);
    const anchorY = clamp(clientY - rect.top, 0, rect.height);
    const mapX = (anchorX - current.originX) / current.scale;
    const mapY = (anchorY - current.originY) / current.scale;

    japanView.earthZoom = clamp(nextZoom, 1, 8);
    const baseScale = Math.max(
      0.1,
      Math.max(rect.width / 360, rect.height / 180),
    );
    const nextScale = baseScale * japanView.earthZoom;
    const nextWidth = 360 * nextScale;
    const nextHeight = 180 * nextScale;
    japanView.earthOffsetX =
      anchorX - mapX * nextScale - (rect.width - nextWidth) / 2;
    japanView.earthOffsetY =
      anchorY - mapY * nextScale - (rect.height - nextHeight) / 2;
    japanView.earthProjection = getEarthProjection(rect);
    japanTilesDirty = true;
  };

  const resetJapanView = () => {
    const isMobile = window.innerWidth <= 720;
    const nextZoom = isMobile ? EARTH_MOBILE_ZOOM : EARTH_ZOOM;
    const center = lonLatToWorld(15, 18, nextZoom);
    japanView.zoom = nextZoom;
    japanView.centerX = center.x;
    japanView.centerY = center.y;
    japanView.earthZoom = 1;
    japanView.earthOffsetX = 0;
    japanView.earthOffsetY = 0;
    japanView.earthProjection = null;
    japanTilesDirty = true;
  };

  const getActiveMapNodes = () => EARTH_NODES;

  const getJapanViewport = () => {
    const rect = japanMap.getBoundingClientRect();
    if (mapScope === "earth") {
      japanView.earthProjection = getEarthProjection(rect);
      return { rect, left: 0, top: 0 };
    }
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

    if (mapScope === "earth") {
      japanTiles.hidden = true;
      for (const tile of japanTileElements.values()) tile.remove();
      japanTileElements.clear();
      dataLedger.updateOsm({ scope: mapScope, zoom: japanView.zoom, urls: [] });
      japanTilesDirty = false;
      return;
    }
    japanTiles.hidden = false;

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
    const ratioCap = coarsePointer ? 1 : 1.2;
    const nativeRatio = Math.min(window.devicePixelRatio || 1, ratioCap);
    const rawWidth = Math.max(1, rect.width * nativeRatio);
    const rawHeight = Math.max(1, rect.height * nativeRatio);
    const maxPixels = coarsePointer ? 650000 : 1600000;
    const pixelScale = Math.min(1, Math.sqrt(maxPixels / (rawWidth * rawHeight)));
    const width = Math.max(1, Math.floor(rawWidth * pixelScale));
    const height = Math.max(1, Math.floor(rawHeight * pixelScale));
    const ratio = width / Math.max(1, rect.width);

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
    if (mapScope === "earth") {
      const projection = japanView.earthProjection || getEarthProjection(japanMap.getBoundingClientRect());
      return {
        x: projection.originX + earthLongitudeToMapX(clamp(lon, -180, 180)) * projection.scale,
        y: projection.originY + (90 - clamp(lat, -90, 90)) * projection.scale,
      };
    }
    const world = lonLatToWorld(lon, lat);
    return {
      x: world.x - left,
      y: world.y - top,
    };
  };

  const getNaturalEarthLandPath = (zoom) => {
    if (naturalEarthLandState !== "ready" || typeof Path2D === "undefined") {
      return null;
    }

    if (naturalEarthPathCache.has(zoom)) {
      return naturalEarthPathCache.get(zoom);
    }

    const path = new Path2D();
    for (const ring of naturalEarthLandRings) {
      if (ring.length < 3) continue;
      ring.forEach(([longitude, latitude], pointIndex) => {
        const world = lonLatToWorld(longitude, latitude, zoom);
        if (pointIndex === 0) path.moveTo(world.x, world.y);
        else path.lineTo(world.x, world.y);
      });
      path.closePath();
    }
    naturalEarthPathCache.set(zoom, path);
    return path;
  };

  const getNaturalEarthGeographicPath = () => {
    const cacheKey = "earth-geographic";
    if (naturalEarthLandState !== "ready" || typeof Path2D === "undefined") return null;
    if (naturalEarthPathCache.has(cacheKey)) return naturalEarthPathCache.get(cacheKey);
    const path = new Path2D();
    for (const ring of naturalEarthLandRings) {
      if (ring.length < 3) continue;
      ring.forEach(([longitude, latitude], pointIndex) => {
        const x = longitude + 180;
        const y = 90 - latitude;
        if (pointIndex === 0) path.moveTo(x, y);
        else path.lineTo(x, y);
      });
      path.closePath();
    }
    naturalEarthPathCache.set(cacheKey, path);
    return path;
  };

  const renderReferenceLand = (ctx, repeatOffset, left, top) => {
    const referencePath = getNaturalEarthLandPath(japanView.zoom);
    if (referencePath) {
      ctx.save();
      ctx.translate(repeatOffset - left, -top);
      ctx.fillStyle = "rgba(29, 86, 84, 0.2)";
      ctx.fill(referencePath, "evenodd");
      ctx.strokeStyle = "rgba(135, 244, 216, 0.56)";
      ctx.lineWidth = japanView.zoom >= 2 ? 1.05 : 0.78;
      ctx.stroke(referencePath);
      ctx.restore();
      return true;
    }

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
    return false;
  };

  const updateMapBasisNote = () => {
    if (naturalEarthLandState === "ready") {
      mapScopeNote.innerHTML =
        mapScope === "earth"
          ? "BASEMAP / NATURAL EARTH 1:50m<br />LOCAL GEOJSON · WGS84 GEOGRAPHIC · ONE WORLD"
          : "BASEMAP / NATURAL EARTH 1:50m<br />LOCAL GEOJSON · WGS84 → WEB MERCATOR";
      return;
    }
    if (naturalEarthLandState === "error") {
      mapScopeNote.innerHTML =
        "BASEMAP / EMBEDDED FALLBACK<br />NATURAL EARTH FILE COULD NOT LOAD";
      return;
    }
    mapScopeNote.innerHTML = "BASEMAP / NATURAL EARTH 1:50m<br />LOCAL VECTOR LOADING";
  };

  const renderReferenceWorldModel = (ctx, rect, left, top) => {
    if (mapScope === "earth") {
      const projection = japanView.earthProjection || getEarthProjection(rect);
      const { originX, originY, width, height, scale } = projection;
      const geographicPath = getNaturalEarthGeographicPath();

      ctx.save();
      ctx.beginPath();
      ctx.rect(originX, originY, width, height);
      ctx.clip();
      ctx.fillStyle = "rgba(7, 25, 43, 0.46)";
      ctx.fillRect(originX, originY, width, height);

      ctx.setLineDash([2, 9]);
      ctx.lineWidth = 0.55;
      ctx.strokeStyle = "rgba(135, 224, 211, 0.105)";
      for (let longitude = -180; longitude <= 180; longitude += 30) {
        const x = originX + earthLongitudeToMapX(longitude) * scale;
        ctx.beginPath();
        ctx.moveTo(x, originY);
        ctx.lineTo(x, originY + height);
        ctx.stroke();
      }
      for (let latitude = -90; latitude <= 90; latitude += 30) {
        const y = originY + (90 - latitude) * scale;
        ctx.beginPath();
        ctx.moveTo(originX, y);
        ctx.lineTo(originX + width, y);
        ctx.stroke();
      }
      ctx.setLineDash([]);

      if (geographicPath) {
        for (const repeat of [-360, 0, 360]) {
          ctx.save();
          ctx.translate(
            originX + (repeat - EARTH_INITIAL_CENTER_LONGITUDE) * scale,
            originY,
          );
          ctx.scale(scale, scale);
          ctx.fillStyle = "rgba(29, 86, 84, 0.28)";
          ctx.fill(geographicPath, "evenodd");
          ctx.strokeStyle = "rgba(135, 244, 216, 0.68)";
          ctx.lineWidth = 1.05 / scale;
          ctx.stroke(geographicPath);
          ctx.restore();
        }
      } else {
        for (const repeat of [-360, 0, 360]) {
          for (const landmass of SIMPLE_WORLD_LANDMASSES) {
            ctx.beginPath();
            landmass.points.forEach(([longitude, latitude], pointIndex) => {
              const x =
                originX +
                (longitude + 180 - EARTH_INITIAL_CENTER_LONGITUDE + repeat) * scale;
              const y = originY + (90 - latitude) * scale;
              if (pointIndex === 0) ctx.moveTo(x, y);
              else ctx.lineTo(x, y);
            });
            ctx.closePath();
            ctx.fillStyle = "rgba(29, 86, 84, 0.24)";
            ctx.fill();
            ctx.strokeStyle = "rgba(135, 244, 216, 0.58)";
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      if (rect.width >= 760) {
        for (const landmass of SIMPLE_WORLD_LANDMASSES) {
          const labelX = originX + earthLongitudeToMapX(landmass.labelAt[0]) * scale;
          const labelY = originY + (90 - landmass.labelAt[1]) * scale;
          ctx.fillStyle = "rgba(187, 240, 226, 0.34)";
          ctx.font = '6px Consolas, "Courier New", monospace';
          ctx.textAlign = "center";
          ctx.fillText(landmass.label, labelX, labelY);
        }
      }

      const equatorY = originY + 90 * scale;
      ctx.setLineDash([8, 12]);
      ctx.strokeStyle = "rgba(164, 244, 221, 0.22)";
      ctx.beginPath();
      ctx.moveTo(originX, equatorY);
      ctx.lineTo(originX + width, equatorY);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.strokeStyle = "rgba(135, 244, 216, 0.3)";
      ctx.lineWidth = 0.8;
      ctx.strokeRect(originX, originY, width, height);
      ctx.textAlign = "start";
      ctx.restore();
      return;
    }

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
      renderReferenceLand(ctx, repeatOffset, left, top);

      if (japanView.zoom >= 2 && rect.width >= 760) {
        for (const landmass of SIMPLE_WORLD_LANDMASSES) {
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

  const renderCachedReferenceWorldModel = (ctx, rect, left, top) => {
    if (!referenceWorldContext) {
      renderReferenceWorldModel(ctx, rect, left, top);
      return;
    }

    const width = Math.max(1, Math.ceil(rect.width));
    const height = Math.max(1, Math.ceil(rect.height));
    const projection = mapScope === "earth"
      ? japanView.earthProjection || getEarthProjection(rect)
      : null;
    const cacheKey = [
      mapScope,
      naturalEarthLandState,
      naturalEarthLandRings.length,
      width,
      height,
      japanView.zoom,
      Math.round(left),
      Math.round(top),
      projection ? Math.round(projection.scale * 1000) : 0,
      projection ? Math.round(projection.originX) : 0,
      projection ? Math.round(projection.originY) : 0,
    ].join("/");

    if (cacheKey !== referenceWorldCacheKey) {
      if (referenceWorldCanvas.width !== width || referenceWorldCanvas.height !== height) {
        referenceWorldCanvas.width = width;
        referenceWorldCanvas.height = height;
      }
      referenceWorldContext.setTransform(1, 0, 0, 1, 0, 0);
      referenceWorldContext.clearRect(0, 0, width, height);
      renderReferenceWorldModel(referenceWorldContext, { width, height }, left, top);
      referenceWorldCacheKey = cacheKey;
    }

    ctx.drawImage(referenceWorldCanvas, 0, 0, rect.width, rect.height);
  };

  const japanScreenToLonLat = (x, y, left, top) => {
    if (mapScope === "earth") {
      const projection = japanView.earthProjection || getEarthProjection(japanMap.getBoundingClientRect());
      const mapLongitude = (x - projection.originX) / projection.scale - 180;
      return {
        lon: wrapLongitude(mapLongitude + EARTH_INITIAL_CENTER_LONGITUDE),
        lat: clamp(90 - (y - projection.originY) / projection.scale, -90, 90),
      };
    }
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
  const geographicRasterCache = new WeakMap();

  const getGeographicRaster = (image) => {
    if (!image.complete || !image.naturalWidth) return null;
    const aspectRatio = image.naturalWidth / image.naturalHeight;
    if (aspectRatio > 1.5) return image;

    const cached = geographicRasterCache.get(image);
    if (
      cached?.sourceWidth === image.naturalWidth &&
      cached?.sourceHeight === image.naturalHeight
    ) {
      return cached.canvas;
    }

    // The local NASA land-cover and night-light snapshots are square Web
    // Mercator rasters. Convert each one only once to the same geographic
    // 2:1 projection used by the vector coastline, then reuse that canvas.
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(2, image.naturalWidth * 2);
    canvas.height = Math.max(1, image.naturalHeight);
    const rasterContext = canvas.getContext("2d");
    if (!rasterContext) return image;

    const latitudeLimit = 85.05112878;
    const latitudeBands = Math.min(720, canvas.height);
    const mercatorY = (latitude) => {
      const radians = clamp(latitude, -latitudeLimit, latitudeLimit) * Math.PI / 180;
      return (
        1 - Math.log(Math.tan(Math.PI / 4 + radians / 2)) / Math.PI
      ) / 2;
    };

    for (let index = 0; index < latitudeBands; index += 1) {
      const latitudeTop = latitudeLimit - (index / latitudeBands) * latitudeLimit * 2;
      const latitudeBottom = latitudeLimit - ((index + 1) / latitudeBands) * latitudeLimit * 2;
      const sourceTop = mercatorY(latitudeTop) * image.naturalHeight;
      const sourceBottom = mercatorY(latitudeBottom) * image.naturalHeight;
      const targetTop = ((90 - latitudeTop) / 180) * canvas.height;
      const targetBottom = ((90 - latitudeBottom) / 180) * canvas.height;

      rasterContext.drawImage(
        image,
        0,
        sourceTop,
        image.naturalWidth,
        Math.max(0.001, sourceBottom - sourceTop),
        0,
        targetTop,
        canvas.width,
        Math.max(0.001, targetBottom - targetTop + 0.5),
      );
    }

    geographicRasterCache.set(image, {
      canvas,
      sourceWidth: image.naturalWidth,
      sourceHeight: image.naturalHeight,
    });
    return canvas;
  };

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
        warning: "この時代には世界全体を測った地図がありません。昔の濃度記録と、後年の衛星地図を組み合わせた再現です。",
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
        "一日の海流が同じ速さと向きで続くと仮定した移動距離です。14日後の海況や漂流を予報するものではありません。",
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
          ["範囲 / 標本", `${rows.length}地点。世界全体を埋めた地図ではない`],
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
          ["長押し / 比較", "世界の白い夜間光だけを一時的に薄くする"],
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
          ["非数値 / 記憶", "文化財の件数で心の豊かさを点数にしない"],
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
        timeLabel: "表示データ / AUTO 01→09",
        selectedIndex: index,
        selected: mode,
        legend: [
          ["枝 / 各データ", "単位が違うため別々に表示"],
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
      const longitudeCopies = [0];
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
      ? "この時代には世界全体を測った衛星地図がないため、昔のCO₂記録へ、後年の衛星地図の模様を重ねて再現しました。実測の世界地図ではありません。"
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
          title: "海流の速さ・向き / 計算上の移動",
          meta: `${state?.dateLabel || row.time} / ${speed.toFixed(2)} m/s / u ${row.uMs.toFixed(2)} / v ${row.vMs.toFixed(2)}`,
          description: `この地点の海流は、東西と南北の速さを合わせて表示しています。同じ流れが${((state?.horizonHours || 0) / 24).toFixed(1)}日続くと、計算上は約${distanceKm.toFixed(1)} km進みます。`,
          relation:
            "青い点はNOAA CoastWatchの記録です。シアンの線と距離は、その速さと向きが変わらないと仮定して計算しました。航海や漂流の予報には使えません。",
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
        description: "この地点の平均的な雨の量を、円の大きさと粒子の数で示しています。",
        relation: `NASA POWERから選んだ${signals.precipitation?.length || 0}地点の一つです。世界中のすき間を埋めた地図ではありません。森林との重なりは見られますが、原因・結果までは分かりません。`,
      }));
    }
    if (signalMode.id === "pollination-protocol") {
      return (signals.occurrences || []).map((row) => ({
        kind: "sequence-poi",
        lon: row.lon,
        lat: row.lat,
        title: row.species,
        meta: `${row.eventDate?.slice(0, 10) || "date unknown"} / GBIF ${row.key}`,
        description: `${row.country || "地域不明"}で、実際にこの生物が記録された場所です。`,
        relation: "この点はGBIFの観察記録です。花と送粉者の関係はGloBIという別の資料なので、この場所で送粉が起きたとは限りません。",
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
            ? "近い国でも、ごみの制度や暮らし方は違います。この数字は公式統計ではなく、空白を仮に補った目安です。"
            : "円は国の目印で、ごみ処理施設の位置ではありません。この資料だけでは、残りのごみが焼却か埋立かも分かりません。",
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
        description: "国全体の排出量が多いほど、赤い円が大きくなります。国どうしの差が大きいため、対数という縮尺で見やすくしています。",
        relation: "赤い円は国全体の値です。点の場所が排出源という意味ではありません。白い夜間光とも別のデータです。",
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
        description: "USGSが記録した、2000年以降のM7.5以上の地震です。データは作品内に保存しています。",
        relation: "マグニチュードは地震の規模、震度は各地の揺れです。日本の代表例だけ、実測震度とP波・S波が届く目安を表示します。",
      }));
    }
    if (signalMode.id === "three-ecologies") {
      const stage = getMapSequenceState(signalMode)?.selectedIndex ?? 3;
      return [
        ...(stage === 0 || stage === 3 ? (signals.ecological || []).map((row) => ({ ...row, kind: "sequence-poi", title: `${row.country} / FOREST`, meta: `ECOLOGICAL / ${row.year} / ${row.forestPercent.toFixed(1)}%`, description: "国土のうち森林が占める割合を、緑の大きさで示しています。", relation: "国全体の数字です。森の質や生きものの豊かさまでは分かりません。" })) : []),
        ...(stage === 1 || stage === 3 ? (signals.social || []).map((row) => ({ ...row, kind: "sequence-poi", title: `${row.country} / URBAN`, meta: `SOCIAL / ${row.year} / ${row.urbanPercent.toFixed(1)}%`, description: "人口のうち都市で暮らす人の割合を、青い円で示しています。", relation: "国全体の数字です。幸福度や暮らしやすさを表すものではありません。" })) : []),
        ...(stage === 2 || stage === 3 ? (signals.culture || []).map((row) => ({ ...row, kind: "sequence-poi", title: row.name, meta: `CULTURE / ${row.category} / ${row.region}`, description: "各地域から選んだUNESCO世界遺産の一つです。", relation: "展示用に選んだ例で、全世界遺産の一覧ではありません。点の数で文化の価値を比べることもできません。" })) : []),
      ];
    }
    if (signalMode.id === "earth-organ") {
      return (signals.potential || []).map((row) => ({
        kind: "sequence-poi",
        lon: row.lon,
        lat: row.lat,
        title: `${row.name}の自然エネルギー条件`,
        meta: `SOLAR ${row.solarKwhM2Day?.toFixed(2) || "—"} kWh/m²/day / WIND ${row.windSpeedMs?.toFixed(2) || "—"} m/s`,
        description: "NASA POWERがまとめた、この場所の日差しと風の平均的な値です。発電設備や土地、費用は含みません。",
        relation: `${signals.potential?.length || 0}地点から選んだ一つです。内側の円は国全体の現在の電力統計です。二地点を結ぶ破線だけが、この展示で作る試算です。`,
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
    const drawGlobalRaster = (image, alpha) => {
      if (!image.complete || !image.naturalWidth) return;
      if (mapScope === "earth") {
        const projection = japanView.earthProjection || getEarthProjection(rect);
        const geographicRaster = getGeographicRaster(image);
        if (!geographicRaster) return;
        ctx.globalAlpha = alpha;
        ctx.drawImage(
          geographicRaster,
          projection.originX,
          projection.originY,
          projection.width,
          projection.height,
        );
        ctx.globalAlpha = 1;
        return;
      }
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
      const longitudeCopies = [0];
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
      drawGlobalRaster(landCoverImage, 0.34);
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
      drawGlobalRaster(nightLightsImage, now < anthropocenePeelUntil ? 0.04 : 0.5);
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
      if (stage === 0 || stage === 3) drawGlobalRaster(landCoverImage, 0.42);
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
    renderCachedReferenceWorldModel(ctx, rect, left, top);

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
      japanDataState.textContent = "世界の震源：作品内データを読み込み中";
    } else if (japanEarthquakeDataState === "snapshot") {
      japanDataState.textContent = `世界の震源：保存データを表示中（M7.5以上・${japanEarthquakes.length}件）`;
    } else if (japanEarthquakeDataState === "offline") {
      japanDataState.textContent = "世界の震源：作品内データを読み込めませんでした";
    } else {
      japanDataState.textContent = "世界の震源：地図を開くと作品内データを読み込みます";
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
    const guide = MAP_READING_GUIDES[modeToIndex];
    if (guide) {
      mapGuideTitle.textContent = guide.title || modes[modeToIndex].titleJa;
      mapGuideSubject.textContent =
        modeToIndex === 6 && japanDataLayer === "snapshot"
          ? "作品内に保存した、2000〜2026年の世界のM7.5以上の地震を読む地図です。"
          : guide.subject;
      mapGuideReading.textContent = guide.reading;
      mapGuideAction.textContent = guide.action;
    }
    if (modeToIndex !== 6) {
      if (signalMode?.id === "breathing-earth") {
        japanObservationKicker.textContent = "CO₂ TIMELINE / 1958 → 2050 / 60 SEC LOOP";
        japanObservationCopy.textContent =
          "色はCO₂濃度です。斜線のマスは近くの8地点から計算しました。2026年以降は、最近10年と同じ増え方が続いた場合の試算です。マスを押すと詳しい数字が出ます。";
      } else if (signalMode?.id === "blue-circulation") {
        japanObservationKicker.textContent = "OCEAN TRANSPORT / DAY 0 → 14 / 45 SEC LOOP";
        japanObservationCopy.textContent =
          "青は海流の速さ、シアンの線は同じ流れが続いた場合の移動距離です。白い矢印は風です。青い点を押すと動きが止まり、詳しい数字が出ます。";
      } else if (signalMode) {
        const narratives = {
          "forest-cloud-engine": ["LAND COVER × RAIN / GLOBAL RASTER + 31 SITES", "背景は土地の種類、水色は31地点の平均的な雨の量です。地点と地点のあいだには値を入れていません。"],
          "pollination-protocol": ["POLLINATION EVIDENCE / GLOBAL SAMPLE / 48 SEC LOOP", "黄色い点はGBIFに登録されたミツバチの観察場所です。花と虫の関係を示す線は、別の文献資料から来ています。"],
          "nothing-is-waste": ["WASTE DATA / MEASURED, FILLED, IMAGINED", "実線は国連の記録、内側の破線は近い5か国から計算した値、外側の破線は自分で動かせる試算です。"],
          "anthropocene-scar": ["ANTHROPOCENE / GLOBAL COUNTRY GHG / 48 SEC LOOP", "赤い円は国ごとの温室効果ガス排出量、白は人工衛星が見た夜の明かりです。二つは別々のデータです。"],
          "three-ecologies": ["THREE ECOLOGIES / GLOBAL LAYERS / 48 SEC LOOP", "森林、都市人口、各地域から選んだ世界遺産を順番に表示し、最後に三つを重ねます。"],
          "earth-organ": ["ENERGY CONDITIONS / 31 GLOBAL SITES / 48 SEC LOOP", "黄色は地点ごとの日差しと風、緑はその国の再生可能電力の割合です。二地点を結ぶ破線は展示上の試算です。"],
          "senseware-2050": ["UNFINISHED SENSEWARE / 9 SIGNALS / 48 SEC LOOP", "九つのデータを順番に表示します。単位が違うため、合計や平均にはしていません。"],
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
        "日本の代表6地震と、震度6弱以上を記録した地点を表示します。地震を選ぶと、P波とS波が届く目安を再生します。";
    } else {
      japanObservationKicker.textContent = "USGS SNAPSHOT / M7.5+ / 2000–2026";
      japanObservationCopy.textContent =
        "作品内に保存したUSGSの世界のM7.5以上を表示します。閲覧中はAPIへ接続せず、点を押すと位置・規模・深さ・発生時刻を読めます。";
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
    japanTitle.textContent = "世界のデータを見る";
    japanDescription.textContent =
      "水、熱、生きもの、大地の動きは国境で止まりません。世界の観測記録を一枚の地図に重ねています。";
    updateMapBasisNote();
    japanMap.setAttribute(
      "aria-label",
      "世界の観測地図。ドラッグで移動、ホイールまたはピンチで拡大縮小し、地点を押すとデータの解説を読めます",
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
        note: "球体の動きはCO₂の季節変化、明るさは長期的な増加、背景色はNASAがまとめた気温の変化です。",
        temporal: true,
      };
    }
    if (signalMode.id === "blue-circulation") {
      const state = getBlueCirculationState(signalMode);
      return {
        output: `${state?.dateLabel || "SNAPSHOT"} / DAY ${((state?.horizonHours || 0) / 24).toFixed(1)}`,
        value: `MEAN ${state?.meanSpeedMs.toFixed(2) || "—"} m/s / ${state?.vectorCount || 0} VECTORS`,
        note: `${state?.warning || "海流を読み込んでいます。"} 青は海流の速さ、白い矢印は別データの年平均風です。`,
        temporal: true,
      };
    }
    if (signalMode.id === "forest-cloud-engine") {
      const state = getMapSequenceState(signalMode);
      const rain = state?.selected;
      return {
        output: state?.phaseLabel || "GLOBAL SAMPLE",
        value: `PRECIP ${rain?.precipitationMmDay?.toFixed(2) ?? "—"} mm/day / MODIS LAND COVER 2023`,
        note: "土地の種類を示す背景に、31地点の雨の量を重ねています。地点の間には値を入れていません。",
        temporal: true,
      };
    }
    if (signalMode.id === "pollination-protocol") {
      const state = getMapSequenceState(signalMode);
      const occurrence = state?.selected;
      return {
        output: state?.phaseLabel || "GBIF RECORD",
        value: `${signals.interactions?.length || 0} RELATIONS / ${signals.occurrences?.length || 0} OCCURRENCES`,
        note: occurrence ? `${occurrence.species} / ${occurrence.country || "地域不明"}。黄色い点は観察場所です。送粉関係の線は別の資料から来ています。` : "記録を読み込んでいます。",
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
        note: "赤い円は国ごとの排出量、白は夜の明かりです。長押しすると白だけが薄くなります。",
        temporal: true,
      };
    }
    if (signalMode.id === "rhythm-of-disaster") {
      const state = getMapSequenceState(signalMode);
      const event = state?.selected;
      return {
        output: state?.phaseLabel || "USGS GLOBAL HISTORY",
        value: event ? `M${event.magnitude.toFixed(1)} / DEPTH ${event.depthKm?.toFixed(0) || "—"} km` : "NO EVENT",
        note: "2000年以降のM7.5以上を年代順に表示します。日本の代表例では、実測震度とP波・S波が届く目安も見られます。",
        temporal: true,
      };
    }
    if (signalMode.id === "three-ecologies") {
      const state = getMapSequenceState(signalMode);
      return {
        output: state?.phaseLabel || "THREE LAYERS",
        value: state?.selected?.name || "ECOLOGICAL / SOCIAL / MEMORY",
        note: "森林、都市人口、世界遺産を順番に表示し、最後に三つを重ねます。",
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
        note: "外側は日差しと風、内側は現在の再生可能電力の割合です。二地点を結ぶ破線は、この展示で作る試算です。",
        temporal: true,
      };
    }
    const state = getMapSequenceState(signalMode);
    return {
      output: state?.phaseLabel || "NO TOTAL SCORE",
      value: "9 SIGNALS + AUDIENCE TRACES",
      note: `${state?.selected?.titleJa || "九つのデータ"}を表示中。単位が違うため、平均せず九本の枝として並べています。`,
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
          setEncodingLabel("estimate", "線 / 計算上の移動距離");
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

  const loadNaturalEarthLand = async () => {
    try {
      naturalEarthLandState = "loading";
      naturalEarthLandError = null;
      updateMapBasisNote();
      const response = await fetch(NATURAL_EARTH_LAND_DATA, { cache: "force-cache" });
      if (!response.ok) throw new Error(`Natural Earth land ${response.status}`);
      const geojson = await response.json();
      const rings = [];

      for (const feature of geojson.features || []) {
        const { geometry } = feature;
        if (!geometry) continue;
        const polygons = geometry.type === "Polygon"
          ? [geometry.coordinates]
          : geometry.type === "MultiPolygon"
            ? geometry.coordinates
            : [];
        for (const polygon of polygons) {
          for (const ring of polygon) {
            if (Array.isArray(ring) && ring.length >= 3) rings.push(ring);
          }
        }
      }

      if (rings.length < 1000) {
        throw new Error(`Natural Earth geometry incomplete (${rings.length} rings)`);
      }
      naturalEarthLandRings = rings;
      naturalEarthPathCache.clear();
      naturalEarthLandState = "ready";
      updateMapBasisNote();
    } catch (error) {
      console.error(error);
      naturalEarthLandError = error instanceof Error ? error.message : String(error);
      naturalEarthLandState = "error";
      updateMapBasisNote();
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

  const clearIntroPanelReveal = () => {
    introRevealGeneration += 1;
    introRevealTimers.forEach((timer) => window.clearTimeout(timer));
    introRevealTimers.clear();
    [...introPathButtons, ...introModeButtons].forEach((panel) => {
      panel.classList.remove("is-awaiting-reveal", "is-depth-arriving");
    });
  };

  const setIntroVisual = (key = "default") => {
    const selectedKey = introVisuals.some((visual) => visual.dataset.introVisual === key)
      ? key
      : "default";
    introLayer.dataset.preview = selectedKey;
    introVisuals.forEach((visual) => {
      visual.classList.toggle("is-active", visual.dataset.introVisual === selectedKey);
    });
  };

  const revealIntroPanels = (stageElement) => {
    clearIntroPanelReveal();
    const generation = introRevealGeneration;
    const panels = Array.from(
      stageElement.querySelectorAll(".intro-path-card, .intro-mode-choice"),
    );
    if (reducedMotion || panels.length === 0) return;

    panels.forEach((panel) => panel.classList.add("is-awaiting-reveal"));
    requestAnimationFrame(() => {
      panels.forEach((panel, index) => {
        const jitter = index ? (index * 11) % 17 : 0;
        const timer = window.setTimeout(() => {
          introRevealTimers.delete(timer);
          if (generation !== introRevealGeneration || !panel.isConnected) return;
          panel.classList.remove("is-awaiting-reveal");
          panel.classList.add("is-depth-arriving");
          const cleanupTimer = window.setTimeout(() => {
            introRevealTimers.delete(cleanupTimer);
            if (panel.isConnected) panel.classList.remove("is-depth-arriving");
          }, 820);
          introRevealTimers.add(cleanupTimer);
        }, 80 + index * 52 + jitter);
        introRevealTimers.add(timer);
      });
    });
  };

  const animateIntroStage = (stageElement, { revealPanels = true } = {}) => {
    stageElement.classList.remove("is-entering");
    if (revealPanels) {
      revealIntroPanels(stageElement);
    } else {
      clearIntroPanelReveal();
    }
    if (reducedMotion) return;
    void stageElement.offsetWidth;
    stageElement.classList.add("is-entering");
  };

  const showIntroStage = (stage, { focus = true, revealPanels = true } = {}) => {
    introStage = stage;
    const showingPath = stage === "path";
    introPathStage.hidden = !showingPath;
    introSenseStage.hidden = showingPath;
    introLayer.scrollTop = 0;
    setIntroVisual(showingPath ? "default" : introSelectedPath);
    const visibleStage = showingPath ? introPathStage : introSenseStage;
    animateIntroStage(visibleStage, { revealPanels });
    if (!focus) return;
    requestAnimationFrame(() => {
      const target = showingPath
        ? introPathButtons[0]
        : introModeButtons[modeToIndex] || introPathBack;
      target?.focus({ preventScroll: true });
      if (showingPath) setIntroVisual("default");
    });
  };

  const selectIntroPath = (path) => {
    const pathConfig = INTRO_PATHS[path];
    if (!pathConfig) return;
    introSelectedPath = path;
    introLayer.dataset.path = path;
    setIntroVisual(path);
    introPathButtons.forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.introPath === path));
    });
    introPathKicker.textContent = pathConfig.kicker;
    introSenseTitle.innerHTML = pathConfig.title;
    introSenseLead.textContent = pathConfig.lead;
    introSelectionPrompt.textContent = pathConfig.prompt;
    introPathNote.textContent = pathConfig.note;
    updateIntroSelection();
    showIntroStage("sense");
  };

  const enterIntroSelection = (event = null) => {
    const selectedPath = introSelectedPath;
    if (!INTRO_PATHS[selectedPath]) return;
    runSceneTransition(() => {
      if (selectedPath === "abstract") {
        closeIntro();
        return;
      }
      if (selectedPath === "map") {
        closeIntro({ restoreFocus: false });
        openJapan({ respectUrlMode: false });
        return;
      }
      if (selectedPath === "space") {
        closeIntro({ restoreFocus: false });
        window.dispatchEvent(new CustomEvent("gaia:space-open-at-mode", {
          detail: { index: modeToIndex },
        }));
        return;
      }
      closeIntro({ restoreFocus: false });
      window.dispatchEvent(new CustomEvent("gaia:novel-open-at-mode", {
        detail: { index: modeToIndex },
      }));
    }, selectedPath, event);
  };

  const INTRO_SCRAMBLE_ALPHABET = Array.from(
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/:.-+◇○△□",
  );

  const revealIntroText = (target, finalText, duration, delay, generation) => {
    const characters = Array.from(finalText);
    const startedAt = performance.now() + delay;

    const draw = (now) => {
      if (generation !== introScrambleGeneration) return;
      if (now < startedAt) {
        requestAnimationFrame(draw);
        return;
      }

      const progress = Math.min(1, (now - startedAt) / duration);
      const eased = 1 - (1 - progress) ** 3;
      const settledCount = Math.floor(characters.length * eased);
      target.textContent = characters
        .map((character, index) => {
          if (
            index < settledCount ||
            /[\s、。・「」『』（）()／/:：—–-]/u.test(character)
          ) {
            return character;
          }
          return INTRO_SCRAMBLE_ALPHABET[
            Math.floor(Math.random() * INTRO_SCRAMBLE_ALPHABET.length)
          ];
        })
        .join("");
      target.classList.remove("is-intro-scramble-pending");

      if (progress < 1) {
        requestAnimationFrame(draw);
      } else {
        target.textContent = finalText;
        if (target === introSelectionCopy) {
          introSelectionPreview.setAttribute("aria-busy", "false");
        }
      }
    };

    requestAnimationFrame(draw);
  };

  const animateIntroSelectionText = (number, title, copy) => {
    introScrambleGeneration += 1;
    const generation = introScrambleGeneration;

    introSelectionPreview.classList.remove("is-decoding");
    if (reducedMotion) {
      introSelectionNumber.classList.remove("is-intro-scramble-pending");
      introSelectionTitle.classList.remove("is-intro-scramble-pending");
      introSelectionCopy.classList.remove("is-intro-scramble-pending");
      introSelectionNumber.textContent = number;
      introSelectionTitle.textContent = title;
      introSelectionCopy.textContent = copy;
      introSelectionPreview.setAttribute("aria-busy", "false");
      return;
    }

    void introSelectionPreview.offsetWidth;
    introSelectionNumber.classList.add("is-intro-scramble-pending");
    introSelectionTitle.classList.add("is-intro-scramble-pending");
    introSelectionCopy.classList.add("is-intro-scramble-pending");
    introSelectionPreview.classList.add("is-decoding");
    introSelectionPreview.setAttribute("aria-busy", "true");
    revealIntroText(introSelectionNumber, number, 280, 0, generation);
    revealIntroText(introSelectionTitle, title, 440, 35, generation);
    revealIntroText(introSelectionCopy, copy, 680, 90, generation);
  };

  const updateIntroSelection = (previewIndex = modeToIndex) => {
    const normalizedIndex = (previewIndex + MODE_COUNT) % MODE_COUNT;
    const choices = introSelectedPath === "space" ? SPACE_MODE_CHOICES : INTRO_MODE_CHOICES;
    const choice = choices[normalizedIndex];
    if (!choice) return;

    animateIntroSelectionText(
      `${formatModeNumber(normalizedIndex)} / ${choice.code}`,
      `${choice.label}の声`,
      choice.copy,
    );
    introPathBack.hidden = false;
    introModeButtons.forEach((button, index) => {
      const option = choices[index];
      const label = button.querySelector("strong");
      const cue = button.querySelector("small");
      if (option && label && cue) {
        label.textContent = option.label;
        cue.textContent = option.cue;
        button.setAttribute(
          "aria-label",
          `${formatModeNumber(index)} ${option.label}、${option.cue}`,
        );
      }
      button.setAttribute("aria-selected", index === normalizedIndex ? "true" : "false");
      button.tabIndex = index === normalizedIndex ? 0 : -1;
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

  window.addEventListener("gaia:select-mode", (event) => {
    const requestedIndex = Number(event.detail?.index);
    if (Number.isInteger(requestedIndex) && requestedIndex >= 0 && requestedIndex < MODE_COUNT) {
      selectMode(requestedIndex);
    }
  });

  modes.forEach((mode, index) => {
    const introChoice = INTRO_MODE_CHOICES[index];
    const introModeButton = document.createElement("button");
    const introModeNumber = document.createElement("span");
    const introModeLabel = document.createElement("strong");
    const introModeCue = document.createElement("small");
    const introModeReveal = document.createElement("span");
    introModeButton.className = "intro-mode-choice";
    introModeButton.type = "button";
    introModeButton.setAttribute("role", "option");
    introModeButton.setAttribute("aria-selected", index === modeToIndex ? "true" : "false");
    introModeButton.setAttribute(
      "aria-label",
      `${formatModeNumber(index)} ${introChoice.label}、${introChoice.cue}`,
    );
    introModeButton.tabIndex = index === modeToIndex ? 0 : -1;
    introModeReveal.className = "intro-card-reveal-fx";
    introModeReveal.setAttribute("aria-hidden", "true");
    introModeNumber.textContent = formatModeNumber(index);
    introModeLabel.textContent = introChoice.label;
    introModeCue.textContent = introChoice.cue;
    introModeButton.append(introModeReveal, introModeNumber, introModeLabel, introModeCue);
    const previewIntroMode = () => {
      updateIntroSelection(index);
    };
    introModeButton.addEventListener("pointerenter", previewIntroMode);
    introModeButton.addEventListener("focus", previewIntroMode);
    introModeButton.addEventListener("click", (event) => {
      selectMode(index);
      updateIntroSelection(index);
      enterIntroSelection(event);
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

  introPathButtons.forEach((button) => {
    button.setAttribute("aria-pressed", "false");
    const previewPath = () => setIntroVisual(button.dataset.introPath);
    button.addEventListener("pointerenter", previewPath);
    button.addEventListener("focus", previewPath);
    button.addEventListener("click", (event) => {
      const path = button.dataset.introPath;
      if (path === "novel") {
        runSceneTransition(() => {
          closeIntro({ restoreFocus: false });
          window.dispatchEvent(new CustomEvent("gaia:novel-open-at-mode", {
            detail: { index: 0, source: "entrance" },
          }));
        }, path, event);
        return;
      }
      runSceneTransition(() => selectIntroPath(path), path, event);
    });
  });

  const previewIntroSound = () => setIntroVisual("sound");
  introSoundPreviewButton?.addEventListener("pointerenter", previewIntroSound);
  introSoundPreviewButton?.addEventListener("focus", previewIntroSound);

  introPathGrid?.addEventListener("pointerleave", () => {
    if (introStage === "path") setIntroVisual("default");
  });
  introPathGrid?.addEventListener("focusout", (event) => {
    if (introStage === "path" && !introPathGrid.contains(event.relatedTarget)) {
      setIntroVisual("default");
    }
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
    if (!japanIsOpen) {
      return;
    }
    event.preventDefault();
    japanMap.setPointerCapture(event.pointerId);
    japanView.pointers.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY,
    });

    if (japanView.pointerId === null) {
      japanView.pointerId = event.pointerId;
      japanView.startX = event.clientX;
      japanView.startY = event.clientY;
      japanView.lastX = event.clientX;
      japanView.lastY = event.clientY;
      japanView.dragged = false;
      japanView.gesture = false;
      japanView.pressStartedAt = performance.now();
    }

    if (mapScope === "earth" && japanView.pointers.size === 2) {
      const [first, second] = [...japanView.pointers.values()];
      japanView.pinchDistance = Math.hypot(second.x - first.x, second.y - first.y);
      japanView.pinchCenterX = (first.x + second.x) / 2;
      japanView.pinchCenterY = (first.y + second.y) / 2;
      japanView.dragged = true;
      japanView.gesture = true;
      japanMap.classList.add("is-dragging");
    }
  });

  japanMap.addEventListener("pointermove", (event) => {
    if (!japanIsOpen || !japanView.pointers.has(event.pointerId)) {
      return;
    }
    event.preventDefault();
    japanView.pointers.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY,
    });

    if (mapScope === "earth" && japanView.pointers.size >= 2) {
      const [first, second] = [...japanView.pointers.values()];
      const distance = Math.max(1, Math.hypot(second.x - first.x, second.y - first.y));
      const centerX = (first.x + second.x) / 2;
      const centerY = (first.y + second.y) / 2;
      japanView.earthOffsetX += centerX - japanView.pinchCenterX;
      japanView.earthOffsetY += centerY - japanView.pinchCenterY;
      setEarthZoom(
        japanView.earthZoom * (distance / Math.max(1, japanView.pinchDistance)),
        centerX,
        centerY,
      );
      japanView.pinchDistance = distance;
      japanView.pinchCenterX = centerX;
      japanView.pinchCenterY = centerY;
      japanView.gesture = true;
      closeJapanPoi();
      return;
    }

    if (japanView.pointerId !== event.pointerId) return;
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
      if (mapScope === "earth") {
        japanView.earthOffsetX += deltaX;
        japanView.earthOffsetY += deltaY;
        japanView.earthProjection = getEarthProjection(japanMap.getBoundingClientRect());
      } else {
        const worldSize = MAP_TILE_SIZE * 2 ** japanView.zoom;
        japanView.centerX = clamp(japanView.centerX - deltaX, 0, worldSize);
        japanView.centerY = clamp(japanView.centerY - deltaY, 0, worldSize);
      }
      japanTilesDirty = true;
      closeJapanPoi();
    }

    japanView.lastX = event.clientX;
    japanView.lastY = event.clientY;
  });

  const releaseJapanPointer = (event, createPulse) => {
    if (!japanView.pointers.has(event.pointerId)) {
      return;
    }
    if (japanMap.hasPointerCapture(event.pointerId)) {
      japanMap.releasePointerCapture(event.pointerId);
    }
    const isPrimaryPointer = japanView.pointerId === event.pointerId;
    if (isPrimaryPointer) {
      const pressDuration = performance.now() - japanView.pressStartedAt;
      if (
        createPulse &&
        !japanView.dragged &&
        !japanView.gesture &&
        modeToIndex === 5 &&
        pressDuration >= 650
      ) {
        anthropocenePeelUntil = performance.now() + 6000;
        japanMapStatus.textContent = "NIGHT LIGHT PEELED / EMISSIONS LAYER REMAINS";
      } else if (createPulse && !japanView.dragged && !japanView.gesture) {
        const poi = findJapanPoiAt(event.clientX, event.clientY, event.pointerType);
        if (poi) {
          openJapanPoi(poi, event.clientX, event.clientY);
        } else {
          closeJapanPoi();
          addJapanPulse(event.clientX, event.clientY);
        }
      }
    }
    japanView.pointers.delete(event.pointerId);

    if (japanView.pointers.size > 0) {
      const [pointerId, point] = japanView.pointers.entries().next().value;
      japanView.pointerId = pointerId;
      japanView.startX = point.x;
      japanView.startY = point.y;
      japanView.lastX = point.x;
      japanView.lastY = point.y;
      japanView.dragged = true;
      return;
    }

    japanView.pointerId = null;
    japanView.dragged = false;
    japanView.gesture = false;
    japanView.pinchDistance = 0;
    japanMap.classList.remove("is-dragging");
    if (createPulse && ["map03", "map08"].includes(storyModeDetour?.kind)) {
      window.dispatchEvent(new CustomEvent("gaia:story-map-interaction", {
        detail: { kind: storyModeDetour.kind },
      }));
    }
  };

  japanMap.addEventListener("pointerup", (event) => releaseJapanPointer(event, true));
  japanMap.addEventListener("pointercancel", (event) =>
    releaseJapanPointer(event, false),
  );

  japanMap.addEventListener(
    "wheel",
    (event) => {
      if (!japanIsOpen || mapScope !== "earth") return;
      event.preventDefault();
      const delta = clamp(event.deltaY, -240, 240);
      const factor = Math.exp(-delta * (event.ctrlKey ? 0.006 : 0.0024));
      setEarthZoom(japanView.earthZoom * factor, event.clientX, event.clientY);
      closeJapanPoi();
    },
    { passive: false },
  );

  japanMap.addEventListener("keydown", (event) => {
    const movement = event.shiftKey ? 110 : 46;
    if (event.key === "ArrowLeft") {
      if (mapScope === "earth") japanView.earthOffsetX += movement;
      else japanView.centerX -= movement;
    } else if (event.key === "ArrowRight") {
      if (mapScope === "earth") japanView.earthOffsetX -= movement;
      else japanView.centerX += movement;
    } else if (event.key === "ArrowUp") {
      if (mapScope === "earth") japanView.earthOffsetY += movement;
      else japanView.centerY -= movement;
    } else if (event.key === "ArrowDown") {
      if (mapScope === "earth") japanView.earthOffsetY -= movement;
      else japanView.centerY += movement;
    } else if ((event.key === "+" || event.key === "=") && mapScope === "earth") {
      const rect = japanMap.getBoundingClientRect();
      setEarthZoom(japanView.earthZoom * 1.35, rect.left + rect.width / 2, rect.top + rect.height / 2);
    } else if ((event.key === "-" || event.key === "_") && mapScope === "earth") {
      const rect = japanMap.getBoundingClientRect();
      setEarthZoom(japanView.earthZoom / 1.35, rect.left + rect.width / 2, rect.top + rect.height / 2);
    } else if (event.key === "0" && mapScope === "earth") {
      resetJapanView();
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      const rect = japanMap.getBoundingClientRect();
      addJapanPulse(rect.left + rect.width / 2, rect.top + rect.height / 2);
      if (["map03", "map08"].includes(storyModeDetour?.kind)) {
        window.dispatchEvent(new CustomEvent("gaia:story-map-interaction", {
          detail: { kind: storyModeDetour.kind, keyboard: true },
        }));
      }
      return;
    } else {
      return;
    }
    event.preventDefault();
    if (mapScope === "earth") {
      japanView.earthProjection = getEarthProjection(japanMap.getBoundingClientRect());
    }
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
    if (event.type === "pointerup" && storyModeDetour?.kind === "abstract07") {
      window.dispatchEvent(new CustomEvent("gaia:story-abstract-interaction", {
        detail: { kind: "abstract07" },
      }));
    }
  };

  canvas.addEventListener("pointerup", releasePointer);
  canvas.addEventListener("pointercancel", releasePointer);
  canvas.addEventListener("keydown", (event) => {
    if (storyModeDetour?.kind !== "abstract07" || !["Enter", " "].includes(event.key)) return;
    event.preventDefault();
    pointer.energy = Math.max(pointer.energy, 1);
    window.dispatchEvent(new CustomEvent("gaia:story-abstract-interaction", {
      detail: { kind: "abstract07", keyboard: true },
    }));
  });
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
    introSelectedPath = null;
    delete introLayer.dataset.path;
    setIntroVisual();
    introPathButtons.forEach((button) => button.setAttribute("aria-pressed", "false"));
    updateIntroSelection();
    // During the opening dissolve the next screen is already visible behind it.
    // Present complete cards there instead of exposing staggered empty frames.
    const enteringFromOpening = document.body.classList.contains("gaia-opening-active");
    showIntroStage("path", { revealPanels: !enteringFromOpening });
  };

  const closeIntro = ({ restoreFocus = introRestoreFocus } = {}) => {
    if (!introIsOpen) {
      return;
    }
    introIsOpen = false;
    clearIntroPanelReveal();
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

  window.addEventListener("gaia:novel-open", () => {
    if (introIsOpen) closeIntro({ restoreFocus: false });
    if (sourceIsOpen) closeSource({ restoreFocus: false });
    if (conceptIsOpen) closeConcept({ restoreFocus: false });
    if (autoEnabled) {
      autoEnabled = false;
      updateAutoInterface();
    }
  });

  window.addEventListener("gaia:story-mode-open", (event) => {
    const kind = event.detail?.kind;
    const index = Number(event.detail?.index);
    if (!["map03", "abstract07", "map08"].includes(kind) || !Number.isInteger(index)) return;
    storyModeDetour = { kind, index };
    experience.dataset.storyMode = kind;
    selectMode(index, { resetAutoTimer: false });
    if (introIsOpen) closeIntro({ restoreFocus: false });
    if (sourceIsOpen) closeSource({ restoreFocus: false, updateHash: false });
    if (conceptIsOpen) closeConcept({ restoreFocus: false, updateHash: false });
    if (kind === "abstract07") {
      if (japanIsOpen) closeJapan({ restoreFocus: false, updateHash: false });
      requestAnimationFrame(() => canvas.focus({ preventScroll: true }));
      return;
    }
    if (!japanIsOpen) {
      openJapan({ updateHash: false, restoreFocusOnClose: false, respectUrlMode: false });
    }
    japanClose.disabled = true;
    japanLayer.dataset.storyMode = kind;
    requestAnimationFrame(() => japanMap.focus({ preventScroll: true }));
  });

  window.addEventListener("gaia:story-mode-layer", (event) => {
    if (!storyModeDetour || event.detail?.kind !== storyModeDetour.kind) return;
    const storyLayer = String(event.detail?.layer || "");
    japanLayer.dataset.storyLayer = storyLayer;
    const labels = {
      forest: "FOREST / 森林分布を表示",
      rain: "RAIN / 降水量を表示",
      overlay: "FOREST + RAIN / 二つの記録を重ねて表示",
      nature: "NATURE / 自然環境",
      life: "LIFE / 人の暮らし",
      memory: "MEMORY / 土地の記憶",
    };
    if (labels[storyLayer]) japanMapStatus.textContent = labels[storyLayer];
  });

  window.addEventListener("gaia:story-mode-close", (event) => {
    if (!storyModeDetour || (event.detail?.kind && event.detail.kind !== storyModeDetour.kind)) return;
    if (japanIsOpen) closeJapan({ restoreFocus: false, updateHash: false });
    japanClose.disabled = false;
    delete japanLayer.dataset.storyMode;
    delete japanLayer.dataset.storyLayer;
    delete experience.dataset.storyMode;
    storyModeDetour = null;
  });

  window.addEventListener("keydown", (event) => {
    if (!storyModeDetour || event.key !== "Escape") return;
    event.preventDefault();
    event.stopImmediatePropagation();
    document.querySelector("#story-detour-return")?.focus({ preventScroll: true });
  }, true);

  window.addEventListener("gaia:opening-complete", () => {
    const hasDirectDestination =
      ["#source", "#concept", "#earth", "#japan", "#data", "#story"].includes(
        window.location.hash,
      ) || new URLSearchParams(window.location.search).has("space");
    if (hasDirectDestination) return;
    openIntro({ restoreFocusOnClose: false });
  }, { once: true });

  window.addEventListener("gaia:return-to-intro", () => {
    openIntro({ restoreFocusOnClose: false });
  });

  sourcePanel.inert = true;
  conceptPanel.inert = true;
  introLayer.inert = true;
  japanLayer.inert = true;
  japanDataPanel.inert = true;
  japanButton.addEventListener("click", () => {
    runSceneTransition(
      () => japanIsOpen ? closeJapan() : openJapan(),
      japanIsOpen ? "abstract" : "map",
    );
  });
  japanClose.addEventListener("click", (event) => {
    if (storyModeDetour) {
      event.preventDefault();
      document.querySelector("#story-detour-return")?.focus({ preventScroll: true });
      return;
    }
    runSceneTransition(() => openIntro(), "map", event);
  });
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
  introButton.addEventListener("click", (event) => {
    if (window.GaiaSceneTransition?.running) {
      openIntro();
      return;
    }
    runSceneTransition(() => openIntro(), "abstract", event);
  });
  introPathBack.addEventListener("click", (event) => {
    runSceneTransition(
      () => showIntroStage("path"),
      introSelectedPath || "default",
      event,
    );
  });
  introArchitectureJump.addEventListener("click", () => {
    introOpenDataExhibit.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "start",
    });
    introOpenDataExhibit.focus({ preventScroll: true });
  });
  introArchitectureBack.addEventListener("click", () => {
    introLayer.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
    showIntroStage("path");
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
        if (introStage === "sense") showIntroStage("path");
        else closeIntro();
      } else if (
        ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key) &&
        (introStage === "path" ? introPathButtons : introModeButtons).includes(document.activeElement)
      ) {
        event.preventDefault();
        const activeButtons = introStage === "path" ? introPathButtons : introModeButtons;
        const currentIndex = activeButtons.indexOf(document.activeElement);
        const direction = event.key === "ArrowLeft" || event.key === "ArrowUp" ? -1 : 1;
        const nextIndex = (currentIndex + direction + activeButtons.length) % activeButtons.length;
        activeButtons[nextIndex].focus({ preventScroll: true });
      } else if (event.key === "Tab") {
        event.preventDefault();
        const targets = (introStage === "path"
          ? [...introPathButtons, introArchitectureJump, introArchitectureBack]
          : [...introModeButtons, introPathBack]
        ).filter((element) => !element.hidden && element.getClientRects().length > 0);
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
    if (japanIsOpen) {
      const mapFrameInterval = reducedMotion ? 1000 / 15 : coarsePointer ? 1000 / 24 : 1000 / 30;
      if (now - lastJapanOverlayRenderAt < mapFrameInterval) {
        animationFrame = requestAnimationFrame(render);
        return;
      }
      lastJapanOverlayRenderAt = now;
    }

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

    if (japanIsOpen) {
      const backgroundFrameInterval = reducedMotion ? 1000 : 200;
      if (now - lastBackgroundRenderAt < backgroundFrameInterval) {
        animationFrame = requestAnimationFrame(render);
        return;
      }
      lastBackgroundRenderAt = now;
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
  loadNaturalEarthLand();

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
  } else if (!openingLayer || openingLayer.hidden) {
    openIntro({ restoreFocusOnClose: false });
  }
})();
