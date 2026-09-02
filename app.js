(async () => {
  "use strict";

  // Keep the highlight independent from each button's own pseudo-elements.
  // A single fixed layer also covers buttons created later by mode renderers.
  const buttonGlint = document.createElement("span");
  buttonGlint.className = "gaia-global-button-glint";
  buttonGlint.setAttribute("aria-hidden", "true");
  document.body.append(buttonGlint);

  let buttonGlintSource = null;
  let buttonGlintTarget = null;
  let buttonGlintPoint = null;
  let buttonGlintFrame = 0;

  const stopButtonGlint = () => {
    buttonGlint.classList.remove("is-active");
    buttonGlintSource = null;
    buttonGlintTarget = null;
    buttonGlintPoint = null;
    if (buttonGlintFrame) cancelAnimationFrame(buttonGlintFrame);
    buttonGlintFrame = 0;
  };

  const validateButtonGlint = () => {
    buttonGlintFrame = 0;
    const button = buttonGlintSource;
    const target = buttonGlintTarget;
    if (!button || !target || !buttonGlint.classList.contains("is-active")) return;
    const bounds = target.getBoundingClientRect();
    const glintBounds = buttonGlint.getBoundingClientRect();
    const visible = typeof button.checkVisibility === "function"
      ? button.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true })
      : button.isConnected && getComputedStyle(button).visibility !== "hidden";
    const topElement = buttonGlintPoint
      ? document.elementFromPoint(buttonGlintPoint.x, buttonGlintPoint.y)
      : button;
    const ownsPointer = !buttonGlintPoint || (topElement && button.contains(topElement));
    const sameBounds = Math.abs(bounds.left - glintBounds.left) < 1
      && Math.abs(bounds.top - glintBounds.top) < 1
      && Math.abs(bounds.width - glintBounds.width) < 1
      && Math.abs(bounds.height - glintBounds.height) < 1;
    if (!button.isConnected || !target.isConnected || button.disabled || !visible || !ownsPointer || !sameBounds) {
      stopButtonGlint();
      return;
    }
    buttonGlintFrame = requestAnimationFrame(validateButtonGlint);
  };

  const triggerButtonGlint = (button, point = null) => {
    if (
      !(button instanceof HTMLButtonElement)
      || button.disabled
      || button.matches(
        ".novel-interaction-open, #novel-log-close, .character-book-selector button, .character-book-expression-list button",
      )
    ) {
      stopButtonGlint();
      return;
    }

    const target = button.querySelector("[data-gaia-glint-surface]") || button;
    const bounds = target.getBoundingClientRect();
    if (bounds.width < 2 || bounds.height < 2) {
      stopButtonGlint();
      return;
    }

    const buttonStyle = getComputedStyle(button);
    const targetStyle = getComputedStyle(target);
    const colorVariables = [
      "--button-accent-rgb",
      "--intro-rgb",
      "--path-rgb",
      "--novel-rgb",
      "--space-rgb",
      "--space-accent-rgb",
      "--gx-rgb",
      "--accent-rgb",
      "--map-accent-rgb",
    ];
    const glintColor = colorVariables
      .map((property) => buttonStyle.getPropertyValue(property).trim())
      .find(Boolean) || "174, 231, 255";

    buttonGlint.style.left = `${bounds.left}px`;
    buttonGlint.style.top = `${bounds.top}px`;
    buttonGlint.style.width = `${bounds.width}px`;
    buttonGlint.style.height = `${bounds.height}px`;
    buttonGlint.style.borderRadius = targetStyle.borderRadius;
    buttonGlint.style.setProperty("--gaia-button-glint-rgb", glintColor);

    stopButtonGlint();
    buttonGlintSource = button;
    buttonGlintTarget = target;
    buttonGlintPoint = point;
    void buttonGlint.offsetWidth;
    buttonGlint.classList.add("is-active");
    buttonGlintFrame = requestAnimationFrame(validateButtonGlint);
  };

  document.addEventListener("pointerover", (event) => {
    const button = event.target instanceof Element ? event.target.closest("button") : null;
    if (!button || (event.relatedTarget instanceof Node && button.contains(event.relatedTarget))) {
      return;
    }
    triggerButtonGlint(button, { x: event.clientX, y: event.clientY });
  });

  document.addEventListener("pointerout", (event) => {
    const button = event.target instanceof Element ? event.target.closest("button") : null;
    if (button && button === buttonGlintSource && !(event.relatedTarget instanceof Node && button.contains(event.relatedTarget))) {
      stopButtonGlint();
    }
  });

  document.addEventListener("focusin", (event) => {
    const button = event.target instanceof Element ? event.target.closest("button") : null;
    if (button) {
      triggerButtonGlint(button);
    }
  });

  // The fixed glint must not outlive a button that swaps the current view.
  // End it in the capture phase so navigation handlers cannot leave its frame
  // floating over the destination screen.
  document.addEventListener("click", (event) => {
    const button = event.target instanceof Element ? event.target.closest("button") : null;
    if (button) {
      stopButtonGlint();
    }
  }, true);

  buttonGlint.addEventListener("animationend", (event) => {
    if (event.animationName === "gaia-button-glint-frame") {
      stopButtonGlint();
    }
  });

  const canvas = document.querySelector("#gaia-canvas");
  const canvasHomeParent = canvas.parentElement;
  const canvasHomeNextSibling = canvas.nextElementSibling;
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
  const mapSignalEncodingLegendTitle = document.querySelector("[data-signal-encoding-legend-title]");
  const mapSignalEncodingLegend = document.querySelector("[data-signal-encoding-legend]");
  const mapMobileLegendToggle = document.querySelector("#map-mobile-legend-toggle");
  const introLayer = document.querySelector("#intro-layer");
  const openingLayer = document.querySelector("#gaia-opening");
  const introPathStage = document.querySelector("#intro-path-stage");
  const introSenseStage = document.querySelector("#intro-sense-stage");
  const introPathGrid = document.querySelector("#intro-path-grid");
  const introPathButtons = Array.from(document.querySelectorAll("[data-intro-path]"));
  const introStoryReturn = document.querySelector(".intro-story-return[data-primary-action=\"true\"]");
  const introTitleReturn = document.querySelector("#intro-title-return");
  const introEntryGuideReplay = document.querySelector("#intro-entry-guide-replay");
  const introScrollCue = document.querySelector("#intro-lp-scroll");
  const introAfterfold = document.querySelector(".intro-lp-afterfold");
  const introGxFeature = document.querySelector("#intro-gx-feature");
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
  const introCharacterJump = document.querySelector("#intro-character-jump");
  const introArchitectureJump = document.querySelector("#intro-architecture-jump");
  const introArchitectureBack = document.querySelector("#intro-architecture-back");
  const introOpenDataExhibit = document.querySelector("#intro-open-data-exhibit");
  const introButton = document.querySelector("#intro-button");
  const japanButton = document.querySelector("#japan-button");
  const japanLayer = document.querySelector("#japan-layer");
  const japanMap = document.querySelector("#japan-map");
  const japanTiles = document.querySelector("#japan-tiles");
  const japanOverlay = document.querySelector("#japan-overlay");
  const mapZoomControls = document.querySelector("#gaia-map-zoom-controls");
  const mapZoomIn = document.querySelector("#gaia-map-zoom-in");
  const mapZoomOut = document.querySelector("#gaia-map-zoom-out");
  const mapZoomReset = document.querySelector("#gaia-map-zoom-reset");
  const japanMapStatus = document.querySelector("#japan-map-status");
  const mapScopeKicker = document.querySelector("#map-scope-kicker");
  const mapScopeNote = document.querySelector("#map-scope-note");
  const japanTitle = document.querySelector("#japan-title");
  const mapTitleTransition = document.querySelector("#map-title-transition");
  const mapTitleTransitionText = document.querySelector("#map-title-transition-text");
  const japanDescription = document.querySelector("#japan-description");
  const mapMobileHeadingToggle = document.querySelector("#map-mobile-heading-toggle");
  const japanModeBank = document.querySelector(".map-mode-bank");
  const mapMobileBankToggle = document.querySelector("#map-mobile-bank-toggle");
  const mapModePreview = document.querySelector("#map-mode-preview");
  const mapModePreviewNumber = document.querySelector("#map-mode-preview-number");
  const mapModePreviewLabel = document.querySelector("#map-mode-preview-label");
  const mapModePreviewCopy = document.querySelector("#map-mode-preview-copy");
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
  const mapReadingGuide = document.querySelector("#map-reading-guide");
  const mapReadingGuideBody = mapReadingGuide?.querySelector(".map-reading-guide-body");
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
  const japanPoiMeta = document.querySelector("#japan-poi-meta");
  const japanPoiSource = document.querySelector("#japan-poi-source");
  const japanPoiPreview = document.querySelector("#japan-poi-preview");
  const japanPoiPreviewKicker = document.querySelector("#japan-poi-preview-kicker");
  const japanPoiPreviewTitle = document.querySelector("#japan-poi-preview-title");
  const japanPoiPreviewMeta = document.querySelector("#japan-poi-preview-meta");
  const dataLedger = window.GaiaDataLedger.create();

  const TRAIL_COUNT = 16;
  // NOAA's MAP02 snapshot currently contains 79 POIs. Keep enough uniform
  // capacity for every visible point so the GPU never silently drops a brush
  // because it happened to be slower than another observation.
  const CURRENT_FIELD_SAMPLE_LIMIT = 96;
  const MODE_COUNT = 9;
  const TRANSITION_DURATION = 1500;
  const AUTO_INTERVAL = 18000;
  const CO2_TIMELINE_START_YEAR = 1958;
  const CO2_TIMELINE_END_YEAR = 2050;
  const CO2_TIMELINE_DURATION_MS = 60000;
  const STORY_MAP_TIMELINE_SPEED = 3;
  const STORY_MAP_FINAL_FRAME_MS = 650;
  const CO2_TIMELINE_STEPS_PER_YEAR = 4;
  const CO2_TIMELINE_MANUAL_PAUSE_MS = 8000;
  const CIRCULATION_TIMELINE_DURATION_MS = 45000;
  const CIRCULATION_TIMELINE_HOURS = 24 * 14;
  const CIRCULATION_TIMELINE_STEPS = 112;
  const MODE_SEQUENCE_DURATION_MS = 48000;
  const ECOLOGIES_SEQUENCE_DURATION_MS = MODE_SEQUENCE_DURATION_MS * 2;
  const ECOLOGIES_SELECTION_TRANSITION_MS = 920;
  const MODE_SEQUENCE_STEPS = 96;
  const MAP_TILE_SIZE = 256;
  const JAPAN_ZOOM = 5;
  const JAPAN_MOBILE_ZOOM = 4;
  const EARTH_ZOOM = 2;
  const EARTH_MOBILE_ZOOM = 1;
  const EARTH_INITIAL_CENTER_LONGITUDE = 138;
  const BLUE_CIRCULATION_FOCUS = Object.freeze({
    label: "tokyo",
    lon: 139.6503,
    lat: 35.6762,
  });
  const EARTH_RADIUS_KM = 6371;
  const P_WAVE_SPEED_KM_S = 7;
  const S_WAVE_SPEED_KM_S = 4;
  const JAPAN_WAVE_VISUAL_LIMIT_KM = 2500;
  const GLOBAL_EARTHQUAKE_MIN_MAGNITUDE = 7.5;
  const GLOBAL_EARTHQUAKE_MAX_MAGNITUDE = 9.1;
  const GLOBAL_EARTHQUAKE_MIN_IMPACT_RADIUS_KM = 500;
  const GLOBAL_EARTHQUAKE_MAX_IMPACT_RADIUS_KM = 2000;
  const GLOBAL_EARTHQUAKE_WAVE_MIN_DURATION_MS = 2200;
  const GLOBAL_EARTHQUAKE_WAVE_MAX_DURATION_MS = 3600;
  const GLOBAL_EARTHQUAKE_YEAR_DWELL_MS = 4600;
  const GLOBAL_EARTHQUAKE_EVENT_STAGGER_MS = 220;
  const GLOBAL_EARTHQUAKE_EVENT_APPEAR_MS = 460;
  const GLOBAL_EARTHQUAKE_RING_DELAY_MS = 90;
  const GLOBAL_EARTHQUAKE_YEAR_COUNT = 27;
  const ANTHROPOCENE_EMISSIONS_SCALE_MT = 12000;
  const ANTHROPOCENE_VISIBLE_RADIUS_PX = 4;
  const GLOBAL_EARTHQUAKE_TIMELINE_DURATION_MS =
    GLOBAL_EARTHQUAKE_YEAR_DWELL_MS * GLOBAL_EARTHQUAKE_YEAR_COUNT;
  const JAPAN_HISTORY_CARD_DELAY = 8000;
  const GAIA_SIGNALS_DATA = "./data/gaia-signals.json?v=gaia-human-history-1";
  const OVATION_AURORA_LIVE_DATA = "https://services.swpc.noaa.gov/json/ovation_aurora_latest.json";
  const OVATION_AURORA_FALLBACK_DATA = "./data/ovation-aurora-snapshot.json?v=gaia-ovation-aurora-1";
  const OVATION_AURORA_REFRESH_MS = 5 * 60 * 1000;
  const NATURAL_EARTH_LAND_DATA = "./data/natural-earth-50m-land.geojson?v=gaia-27";
  const NATURAL_EARTH_COUNTRY_DATA = "./data/natural-earth-50m-countries.geojson?v=gaia-1";
  const JAPAN_PREFECTURE_DATA = "./data/japan-prefectures.topojson?v=gaia-prefecture-boundaries-1";

  const MAP_READING_GUIDES = [
    {
      title: "CO₂の長い変化と、いまのオーロラ",
      subject: "1958年から2050年試算までのCO₂に、NOAAの30〜90分先オーロラ予報を重ねた地図です。",
      reading: "地図色がCO₂、極域の緑〜水色〜淡金の光がオーロラ予報です。斜線はCO₂を周辺8地点から補った場所です。",
      action: "年表示とマスはCO₂を操作します。オーロラは5分ごとに更新しますが、雲や地上から見えるかどうかは含みません。",
    },
    {
      title: "この海流は、14日でどこまで進む？",
      subject: "色付きの矢印が海流です。点から伸びる線は、同じ速さと向きが続くと仮定した移動先です。右下の「○日後」と一緒に読みます。",
      reading: "青→水色→黄→橙の順に海流が速くなります。白い矢印は別資料の平均風で、海流の移動距離の計算には使いません。",
      action: "色付きの点を押すと自動再生が止まり、その地点の速さ・向き・○日後の計算距離を読めます。スライダーでも日数を動かせます。",
    },
    {
      title: "森林と、雨の多い場所はどこで重なる？",
      subject: "緑の森林分布と、31代表地点の平均降水量を同じ世界地図で見比べます。相関係数や、森林が雨を起こす因果関係を示す図ではありません。",
      reading: "大きな水色円が降水量です。直径が大きいほど雨が多く、雨の多い円にはmm/dayを直接表示します。ブラジルのアマゾン付近は5.33 mm/dayです。",
      action: "水色円を押すと自動走査が止まり、代表地点名と平均降水量をカードで読めます。円のない場所は『雨がない』のではなく、この31地点では測っていない場所です。",
    },
    {
      title: "再資源化率は、国ごとにどう違うのか？",
      subject: "各国の都市ごみ100%を同じ大きさの円グラフにし、再資源化された割合と、それ以外を地図上で比べます。",
      reading: "緑の扇形が再資源化率、橙が再資源化として報告されなかった残りです。実線は国連の公開値、破線は近い5か国から補った値です。",
      action: "左右ボタンかスライダーで31の国・地域を切り替えます。円グラフを押すと、再資源化率、報告年、国連公式値か補完値か、出典を確認できます。",
    },
    {
      title: "化石燃料由来CO₂は、1945年からどこで増えたのか？",
      subject: "Global Carbon Projectの国別化石燃料由来CO₂を1945〜2023年で送り、NASA VIIRS 2016の夜間光を固定参照として重ねます。",
      reading: "赤い円は選択年の国全体の化石燃料由来CO₂です。全年度共通の固定尺度で円面積が排出量に比例するため、年を進めると増減が直接見えます。白い発光は2016年固定です。",
      action: "スライダーで年を動かし、円を押して一つの国を追えます。地図を0.65秒以上長押しすると、白い夜間光だけが6秒間薄れます。",
    },
    {
      title: "大地震は、年ごとに世界のどこで起きたのか？",
      subject: "世界表示を基準に、USGSが記録した2000〜2026年のM7.5以上を年度ごとに切り替えます。別年度の震源は同時表示しません。",
      reading: "橙の点がその年の震源です。年度が変わるたび全点から輪がゆっくり広がり、Magnitudeから見積もった可感半径の目安で止まります。M7.5は約500km、M9.1は約2,000kmです。",
      action: "2000〜2026年を約4.6秒ずつ自動再生します。スライダーで年度を切り替えるか、震源を押して日付・深さ・Magnitudeを読めます。輪は推定可感半径で、実際の震度分布・被害範囲・津波範囲ではありません。日本の実測震度は別層です。",
    },
    {
      title: "都市化が進むほど、森林は減るのか？",
      subject: "同じ31か国の森林面積率と都市人口率を一組にして、地図の二重円と散布図で同時に比べます。",
      reading: "内側の緑が森林率、外側の青が都市人口率です。右上の散布図と回帰線が全31か国の関係を示し、相関係数rを直接表示します。紫の菱形は世界遺産例で、計算には含めません。",
      action: "スライダーで都市人口率が低い国から高い国へ移動し、黄色い散布点と地図上の二重円を追います。円を押すと、全体傾向から何ポイント外れる国か読めます。",
    },
    {
      title: "再生可能電力は、どの国で多く使われているか？",
      subject: "31か国の電力に占める再生可能エネルギー比率を、国土の青い濃淡で直接比べる地図です。",
      reading: "暗い青ほど比率が低く、明るい水色ほど高い国です。黄色い輪と緑の矢印は選択国の代表地点の日射・風で、国の青色とは別の自然条件です。",
      action: "スライダーで比率の低い国から高い国へ移動するか、青く塗られた国の代表点を押して現在値を読めます。二地点を結ぶ仮想線は廃止しました。",
    },
    {
      title: "人口の重心は、1960年からどこへ動いたのか？",
      subject: "世界銀行の国別人口を1960〜2025年で送り、同じ31か国を毎年同じ尺度で比べます。",
      reading: "琥珀色の円は選択年の国別人口です。円の面積が人口に比例します。国の代表位置に置いた比較円で、都市位置や人口密度ではありません。",
      action: "スライダーで年を動かし、円を押して選んだ国の人口を年ごとに追えます。人口の多さを豊かさや環境負荷へは変換しません。",
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
  const supportsHover = window.matchMedia("(hover: hover)").matches;
  const usesCompactMapUi = () => window.innerWidth <= 720 || (window.innerHeight <= 520 && coarsePointer);
  const resolveMapOverlayQuality = () => {
    const memory = Number(navigator.deviceMemory) || 0;
    const cores = Number(navigator.hardwareConcurrency) || 0;
    const saveData = navigator.connection?.saveData === true;
    const constrained = saveData
      || (memory > 0 && memory <= 4)
      || (cores > 0 && cores <= 4);
    const nativeQuality = memory >= 8 && cores >= 8;

    if (constrained) {
      return {
        tier: "compact",
        ratioCap: 1,
        maxPixels: coarsePointer ? 650000 : 1600000,
      };
    }
    if (nativeQuality) {
      return { tier: "native", ratioCap: 3, maxPixels: 9000000 };
    }
    return {
      tier: "balanced",
      ratioCap: 2,
      maxPixels: coarsePointer ? 3200000 : 5000000,
    };
  };
  const mapOverlayQuality = resolveMapOverlayQuality();
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
  const ovationAuroraCanvas = document.createElement("canvas");
  const ovationAuroraContext = ovationAuroraCanvas.getContext("2d");
  const ovationAuroraRawCanvas = document.createElement("canvas");
  const ovationAuroraRawContext = ovationAuroraRawCanvas.getContext("2d");
  const referenceWorldCanvas = document.createElement("canvas");
  const referenceWorldContext = referenceWorldCanvas.getContext("2d");
  const japanPoiFocusCanvas = document.createElement("canvas");
  const japanPoiFocusContext = japanPoiFocusCanvas.getContext("2d");
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
    globalThis.GaiaFrameBudgetGovernor?.reportFailure?.("webgl-unavailable");
    errorPanel.hidden = false;
    globalThis.GaiaMapObservationAdapter = Object.freeze({
      waitSignalsReady: () => Promise.reject(new Error("WebGL2 unavailable")),
      selectMode: () => false,
      setSignalTime: () => 0,
      focusEarthLocation: () => false,
      zoomEarthBy: () => false,
      zoomEarthAtLocation: () => false,
      openMap: () => false,
      closeMap: () => false,
      showIntro: () => { errorPanel.hidden = false; },
      focusControl: () => false,
      clearFocus: () => {},
      openSourceTab: () => false,
      closeSource: () => {},
      getTourReceipt: () => { throw new Error("WebGL2 unavailable"); },
      getState: () => ({ fallback: true, mapOpen: false, introOpen: false }),
    });
    window.dispatchEvent(new CustomEvent("gaia:map-adapter-ready", { detail: { fallback: true } }));
    document.documentElement.dataset.gaiaAppReady = "fallback";
    window.dispatchEvent(new CustomEvent("gaia:app-ready", { detail: { fallback: true } }));
    return;
  }
  const parallelShaderCompile = gl.getExtension("KHR_parallel_shader_compile");

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
    uniform float uTrailActive;
    uniform float uModeMemory[${MODE_COUNT}];
    uniform int uModeFrom;
    uniform int uModeTo;
    uniform float uTransition;
    uniform vec4 uSignal;
    uniform float uSourceSignals[9];
    uniform vec4 uCurrentSamples[${CURRENT_FIELD_SAMPLE_LIMIT}];
    uniform int uCurrentSampleCount;

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
      if (uTrailActive < 0.5) return vec2(0.0);
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
      if (mode == 3) return modeNothingIsWaste(p, t, response, uModeMemory[3]);
      if (mode == 4) return modeAnthropoceneScar(p, t, response, uModeMemory[4]);
      if (mode == 5) return modeRhythmOfDisaster(p, t, response, uModeMemory[5]);
      if (mode == 6) return modeThreeEcologies(p, t, response, uModeMemory[6]);
      if (mode == 7) return modeEarthOrgan(p, t, response, uModeMemory[7]);
      return modePopulationTide(p, t, response, uModeMemory[8]);
    }

    void main() {
      vec2 uv = (gl_FragCoord.xy * 2.0 - uResolution) / uResolution.y;
      vec2 response = trailResponse(uv);
      vec2 dataResponse = response + uSignal.zw * 0.08;
      float signalTime = uTime + uSignal.y * 1.6;
      vec3 color = evaluateMode(uModeFrom, uv, signalTime, dataResponse);
      if (uModeFrom != uModeTo) {
        vec3 toColor = evaluateMode(uModeTo, uv, signalTime, dataResponse);
        color = mix(color, toColor, smoothstep(0.0, 1.0, uTransition));
      }
      color *= 0.84 + uSignal.x * 0.32;
      color += vec3(uSignal.y * 0.025, uSignal.z * 0.02, uSignal.w * 0.025);

      float radial = length(uv * vec2(0.72, 1.0));
      float vignette = smoothstep(1.78, 0.4, radial);
      float grainTime = uTime * 12.0;
      float grainFrame = floor(grainTime);
      float grainBlend = smoothstep(0.0, 1.0, fract(grainTime));
      float grain = mix(
        hash21(gl_FragCoord.xy + grainFrame),
        hash21(gl_FragCoord.xy + grainFrame + 1.0),
        grainBlend
      ) - 0.5;
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
    return shader;
  };

  const createProgram = async () => {
    const vertexShader = compileShader(gl.VERTEX_SHADER, vertexSource);
    const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fragmentSource);
    const nextProgram = gl.createProgram();

    gl.attachShader(nextProgram, vertexShader);
    gl.attachShader(nextProgram, fragmentShader);
    gl.linkProgram(nextProgram);

    // Querying COMPILE_STATUS or LINK_STATUS immediately forces Chromium to
    // wait for the GPU process. The full ten-mode shader can take seconds on
    // software or older GPUs, freezing the sound prompt before first input.
    // KHR_parallel_shader_compile lets the browser finish in the background;
    // yielding a timer turn also keeps parsing, layout, and input responsive.
    if (parallelShaderCompile) {
      while (!gl.getProgramParameter(nextProgram, parallelShaderCompile.COMPLETION_STATUS_KHR)) {
        await new Promise((resolve) => window.setTimeout(resolve, 16));
      }
    }

    const shaderError = [vertexShader, fragmentShader]
      .find((shader) => !gl.getShaderParameter(shader, gl.COMPILE_STATUS));
    if (shaderError) {
      const message = gl.getShaderInfoLog(shaderError) || "Shader compilation failed.";
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteProgram(nextProgram);
      throw new Error(message);
    }

    if (!gl.getProgramParameter(nextProgram, gl.LINK_STATUS)) {
      const message = gl.getProgramInfoLog(nextProgram) || "Shader link failed.";
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteProgram(nextProgram);
      throw new Error(message);
    }

    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    return nextProgram;
  };

  let program;

  try {
    program = await createProgram();
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
    trailActive: gl.getUniformLocation(program, "uTrailActive"),
    modeMemory: gl.getUniformLocation(program, "uModeMemory[0]"),
    modeFrom: gl.getUniformLocation(program, "uModeFrom"),
    modeTo: gl.getUniformLocation(program, "uModeTo"),
    transition: gl.getUniformLocation(program, "uTransition"),
    signal: gl.getUniformLocation(program, "uSignal"),
    sourceSignals: gl.getUniformLocation(program, "uSourceSignals[0]"),
    currentSamples: gl.getUniformLocation(program, "uCurrentSamples[0]"),
    currentSampleCount: gl.getUniformLocation(program, "uCurrentSampleCount"),
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
  let introStoryRevealStartTimer = 0;
  let introStoryRevealCommitTimer = 0;
  let introApeironceneRevealed = false;
  let introRevealGeneration = 0;
  let introScrambleGeneration = 0;
  const introRevealTimers = new Set();
  let japanIsOpen = false;
  let japanDataIsOpen = false;
  let japanRestoreFocus = true;
  let japanCloseTimer = 0;
  let japanTilesDirty = true;
  let mapPlotRevealStartedAt = performance.now();
  let mapPlotRevealBlockedUntil = 0;
  let mapPlotRevealGeneration = 0;
  let mapPlotRevealReason = "initial";
  const ecologiesSelectionTransition = {
    generation: -1,
    currentIso3: "",
    previousIso3: "",
    changedAt: performance.now(),
  };
  const earthquakeYearTransition = {
    generation: -1,
    currentYear: "",
    currentEvents: [],
    changedAt: performance.now(),
  };
  let nextJapanOverlayRenderAt = 0;
  let lastJapanOverlayTargetFps = 60;
  const STATIC_MAP_FRAME_INTERVAL_MS = 500;
  let nextShaderRenderAt = 0;
  let lastShaderTargetFps = 60;
  let japanTileErrors = 0;
  let japanEarthquakeDataState = "idle";
  let japanHistoryDataState = "idle";
  let japanDataLayer = "history";
  let storyModeDetour = null;
  let storyModeGlobalSignalConsoleState = null;
  let storyMapTimelineCompleted = false;
  let storyMapReturnTimer = 0;
  let storyMapAivaBackdrop = null;
  let storyMapAivaRuntime = null;
  let mapScope = "earth";
  let japanDataUpdatedAt = null;
  let japanHistoryUpdatedAt = null;
  let selectedJapanPoi = null;
  let hoveredJapanPoi = null;
  let hoveredJapanPoiKey = "";
  let hoveredJapanPoiStartedAt = 0;
  let japanWaveReplay = null;
  let gaiaSnapshot = null;
  let gaiaSnapshotError = null;
  let gaiaModeById = new Map();
  let ovationAuroraState = {
    status: "loading",
    source: "pending",
    observationTime: "",
    forecastTime: "",
    pointCount: 0,
    maximum: 0,
  };
  let ovationAuroraReloadTimer = 0;
  let resolveGaiaSignalsReady;
  const gaiaSignalsReady = new Promise((resolve) => { resolveGaiaSignalsReady = resolve; });
  let naturalEarthLandState = "loading";
  let naturalEarthLandError = null;
  let naturalEarthLandRings = [];
  const naturalEarthPathCache = new Map();
  let naturalEarthCountryState = "loading";
  let naturalEarthCountryError = null;
  let naturalEarthCountryRings = new Map();
  let naturalEarthCountryBoundaryRings = [];
  const naturalEarthCountryPathCache = new Map();
  let japanPrefectureBoundaryState = "loading";
  let japanPrefectureBoundaryError = null;
  let japanPrefectureBoundaryArcs = [];
  const japanPrefectureBoundaryPathCache = new Map();
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
  let anthropoceneSelectedIso3 = "JPN";
  let populationSelectedIso3 = "JPN";
  let wasteSelectedIndex = 0;
  let timelineDisplayTransitionKey = "";
  let japanPoiRevealTimer = 0;
  let japanDeepLinkHandled = false;
  let earthViewAnimationFrame = 0;
  let earthViewAnimationTimer = 0;
  let autoEnabled = false;
  let nextAutoAt = performance.now() + AUTO_INTERVAL;
  const requestedModeNumber = Number.parseInt(new URLSearchParams(window.location.search).get("mode"), 10);
  const initialModeIndex = Number.isFinite(requestedModeNumber)
    ? Math.min(MODE_COUNT - 1, Math.max(0, requestedModeNumber - 1))
    : 0;
  let modeFromIndex = initialModeIndex;
  let modeToIndex = initialModeIndex;
  let mapModeIndex = initialModeIndex;
  let transitionStartedAt = performance.now();
  const getThemeIndex = (index = modeToIndex) => index;
  const isTheme = (themeIndex, index = modeToIndex) => getThemeIndex(index) === themeIndex;
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
  const getEcologiesSelectionTransition = (rows, selected, now) => {
    const nextIso3 = selected?.iso3 || "";
    if (
      ecologiesSelectionTransition.generation !== mapPlotRevealGeneration
      || !ecologiesSelectionTransition.currentIso3
    ) {
      ecologiesSelectionTransition.generation = mapPlotRevealGeneration;
      ecologiesSelectionTransition.currentIso3 = nextIso3;
      ecologiesSelectionTransition.previousIso3 = "";
      ecologiesSelectionTransition.changedAt = now - ECOLOGIES_SELECTION_TRANSITION_MS;
    } else if (nextIso3 && nextIso3 !== ecologiesSelectionTransition.currentIso3) {
      ecologiesSelectionTransition.previousIso3 = ecologiesSelectionTransition.currentIso3;
      ecologiesSelectionTransition.currentIso3 = nextIso3;
      ecologiesSelectionTransition.changedAt = now;
    }

    const linearProgress = reducedMotion
      ? 1
      : clamp((now - ecologiesSelectionTransition.changedAt) / ECOLOGIES_SELECTION_TRANSITION_MS, 0, 1);
    const progress = linearProgress * linearProgress * (3 - 2 * linearProgress);
    const previousIso3 = linearProgress < 1 ? ecologiesSelectionTransition.previousIso3 : "";
    if (linearProgress >= 1) ecologiesSelectionTransition.previousIso3 = "";
    return {
      progress,
      currentIso3: ecologiesSelectionTransition.currentIso3,
      previousIso3,
      current: rows.find((row) => row.iso3 === ecologiesSelectionTransition.currentIso3) || selected,
      previous: rows.find((row) => row.iso3 === previousIso3) || null,
    };
  };
  const compareEarthquakeOccurrence = (a, b) => (
    String(a?.occurredAt || "").localeCompare(String(b?.occurredAt || ""))
    || String(a?.id || "").localeCompare(String(b?.id || ""))
  );
  const getEarthquakeYearTransition = (selectedYear, yearEvents, now) => {
    const nextYear = String(selectedYear || "");
    const nextEvents = Array.isArray(yearEvents)
      ? [...yearEvents].sort(compareEarthquakeOccurrence)
      : [];
    if (
      earthquakeYearTransition.generation !== mapPlotRevealGeneration
      || !earthquakeYearTransition.currentYear
    ) {
      earthquakeYearTransition.generation = mapPlotRevealGeneration;
      earthquakeYearTransition.currentYear = nextYear;
      earthquakeYearTransition.currentEvents = nextEvents;
      earthquakeYearTransition.changedAt = Math.max(now, mapPlotRevealStartedAt);
    } else if (nextYear && nextYear !== earthquakeYearTransition.currentYear) {
      earthquakeYearTransition.currentYear = nextYear;
      earthquakeYearTransition.currentEvents = nextEvents;
      earthquakeYearTransition.changedAt = now;
    } else {
      earthquakeYearTransition.currentEvents = nextEvents;
    }

    const eventCount = earthquakeYearTransition.currentEvents.length;
    const durationMs = Math.max(
      GLOBAL_EARTHQUAKE_EVENT_APPEAR_MS,
      Math.max(0, eventCount - 1) * GLOBAL_EARTHQUAKE_EVENT_STAGGER_MS
        + GLOBAL_EARTHQUAKE_EVENT_APPEAR_MS,
    );
    const elapsedMs = Math.max(0, now - earthquakeYearTransition.changedAt);
    const eventReveals = earthquakeYearTransition.currentEvents.map((event, index) => {
      const localElapsedMs = reducedMotion
        ? durationMs
        : now - earthquakeYearTransition.changedAt - index * GLOBAL_EARTHQUAKE_EVENT_STAGGER_MS;
      const progress = reducedMotion
        ? 1
        : clamp(localElapsedMs / GLOBAL_EARTHQUAKE_EVENT_APPEAR_MS, 0, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const bounce = Math.sin(progress * Math.PI) * (1 - progress) * 0.2;
      return {
        event,
        index,
        progress,
        alpha: clamp(progress * 2.35, 0, 1),
        scale: 0.14 + eased * 0.86 + bounce,
        waveElapsedMs: reducedMotion
          ? GLOBAL_EARTHQUAKE_WAVE_MAX_DURATION_MS
          : Math.max(0, localElapsedMs - GLOBAL_EARTHQUAKE_RING_DELAY_MS),
      };
    });
    const visibleEventCount = eventReveals.filter(({ progress }) => progress > 0).length;
    const activeReveal = visibleEventCount > 0 ? eventReveals[visibleEventCount - 1] : null;
    const activeEvent = activeReveal?.event || null;
    return {
      progress: reducedMotion ? 1 : clamp(elapsedMs / durationMs, 0, 1),
      durationMs,
      visibleEventCount,
      activeEvent,
      activeReveal,
      eventReveals,
      currentYear: earthquakeYearTransition.currentYear,
      currentEvents: earthquakeYearTransition.currentEvents,
    };
  };
  const MAP_TITLE_SEPARATOR_DURATION_MS = 1500;
  const MAP_TITLE_SEPARATOR_REDUCED_DURATION_MS = 460;
  const MAP_PLOT_REVEAL_LEAD_MS = 110;
  const MAP_PLOT_REVEAL_SPREAD_MS = 980;
  const MAP_PLOT_REVEAL_DURATION_MS = 520;
  const restartMapPlotReveal = (reason = "mode-change") => {
    const now = performance.now();
    const waitsForSeparator = mapPlotRevealBlockedUntil > now;
    mapPlotRevealStartedAt = waitsForSeparator ? mapPlotRevealBlockedUntil : now;
    mapPlotRevealGeneration += 1;
    mapPlotRevealReason = reason;
    japanOverlay.dataset.plotRevealState = waitsForSeparator
      ? "waiting-for-separator"
      : reducedMotion
        ? "complete"
        : "running";
    japanOverlay.dataset.plotRevealReason = reason;
    japanOverlay.dataset.plotRevealGeneration = String(mapPlotRevealGeneration);
    japanOverlay.dataset.plotRevealProgress = waitsForSeparator ? "0.000" : reducedMotion ? "1.000" : "0.000";
    japanOverlay.dataset.plotRevealWaitsForSeparator = String(waitsForSeparator);
    japanOverlay.dataset.plotRevealScheduledAt = mapPlotRevealStartedAt.toFixed(1);
    japanOverlay.dataset.plotRevealFirstVisibleAt = (
      mapPlotRevealStartedAt + (reducedMotion ? 0 : MAP_PLOT_REVEAL_LEAD_MS)
    ).toFixed(1);
  };
  const getMapPlotReveal = (index, count, now) => {
    if (now < mapPlotRevealStartedAt) return { progress: 0, alpha: 0, scale: 0.14 };
    if (reducedMotion) return { progress: 1, alpha: 1, scale: 1 };
    const safeCount = Math.max(1, count);
    const order = safeCount === 1 ? 0 : index / (safeCount - 1);
    const delay = MAP_PLOT_REVEAL_LEAD_MS + order * MAP_PLOT_REVEAL_SPREAD_MS;
    const progress = clamp((now - mapPlotRevealStartedAt - delay) / MAP_PLOT_REVEAL_DURATION_MS, 0, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const bounce = Math.sin(progress * Math.PI) * (1 - progress) * 0.24;
    return {
      progress,
      alpha: clamp(progress * 2.4, 0, 1),
      scale: 0.14 + eased * 0.86 + bounce,
    };
  };
  const applyMapPlotReveal = (ctx, point, reveal) => {
    ctx.globalAlpha *= reveal.alpha;
    ctx.translate(point.x, point.y);
    ctx.scale(reveal.scale, reveal.scale);
    ctx.translate(-point.x, -point.y);
  };
  const syncMapPlotRevealState = (now) => {
    const total = MAP_PLOT_REVEAL_LEAD_MS + MAP_PLOT_REVEAL_SPREAD_MS + MAP_PLOT_REVEAL_DURATION_MS;
    const waitingForSeparator = now < mapPlotRevealStartedAt;
    const progress = waitingForSeparator
      ? 0
      : reducedMotion
        ? 1
        : clamp((now - mapPlotRevealStartedAt) / total, 0, 1);
    japanOverlay.dataset.plotRevealState = waitingForSeparator
      ? "waiting-for-separator"
      : progress >= 1
        ? "complete"
        : "running";
    japanOverlay.dataset.plotRevealReason = mapPlotRevealReason;
    japanOverlay.dataset.plotRevealGeneration = String(mapPlotRevealGeneration);
    japanOverlay.dataset.plotRevealProgress = progress.toFixed(3);
    japanOverlay.dataset.plotRevealWaitsForSeparator = String(waitingForSeparator);
  };
  const getGlobalEarthquakeImpactRadiusKm = (magnitude) => {
    const value = clamp(Number(magnitude) || GLOBAL_EARTHQUAKE_MIN_MAGNITUDE, 7, GLOBAL_EARTHQUAKE_MAX_MAGNITUDE);
    // USGS PP 1074 gives approximate perceptibility distances of 400 km at M7
    // and 600 km at M8. The M9.1 anchor reflects documented cross-country felt
    // reports for the 2004 Sumatra and 2011 Tohoku events. This remains an
    // educational estimate, not a ShakeMap, intensity, damage, or tsunami area.
    if (value <= 8) return 400 + (value - 7) * 200;
    return 600 + ((value - 8) / (GLOBAL_EARTHQUAKE_MAX_MAGNITUDE - 8)) * 1400;
  };
  const getGlobalEarthquakeWaveDurationMs = (impactRadiusKm) => {
    const radiusProgress = clamp(
      (impactRadiusKm - GLOBAL_EARTHQUAKE_MIN_IMPACT_RADIUS_KM) /
        (GLOBAL_EARTHQUAKE_MAX_IMPACT_RADIUS_KM - GLOBAL_EARTHQUAKE_MIN_IMPACT_RADIUS_KM),
      0,
      1,
    );
    return GLOBAL_EARTHQUAKE_WAVE_MIN_DURATION_MS +
      radiusProgress * (GLOBAL_EARTHQUAKE_WAVE_MAX_DURATION_MS - GLOBAL_EARTHQUAKE_WAVE_MIN_DURATION_MS);
  };
  const getGlobalEarthquakeImpactEllipse = (event, impactRadiusKm, projection) => {
    const radiusDegrees = (impactRadiusKm / (2 * Math.PI * EARTH_RADIUS_KM)) * 360;
    const verticalRadius = radiusDegrees * projection.scale;
    const latitudeScale = Math.max(0.28, Math.cos(toRadians(event.latitude)));
    return {
      x: verticalRadius / latitudeScale,
      y: verticalRadius,
    };
  };
  const FOREST_RAIN_REFERENCE_MAX_MM_DAY = 6.5;
  const FOREST_RAIN_MIN_RADIUS = 10;
  const FOREST_RAIN_MAX_RADIUS = 54;
  const getForestRainRadius = (precipitationMmDay) => {
    const ratio = Math.sqrt(clamp(
      (Number(precipitationMmDay) || 0) / FOREST_RAIN_REFERENCE_MAX_MM_DAY,
      0,
      1,
    ));
    return FOREST_RAIN_MIN_RADIUS + ratio * (FOREST_RAIN_MAX_RADIUS - FOREST_RAIN_MIN_RADIUS);
  };
  const getForestRainSiteName = (row) => row?.id === "brazil"
    ? `${row.name}（アマゾン付近）`
    : row?.name || "代表地点";
  const wrapLongitude = (longitude) => ((longitude + 540) % 360) - 180;
  const earthLongitudeToMapX = (longitude) =>
    wrapLongitude(longitude - EARTH_INITIAL_CENTER_LONGITUDE) + 180;
  const formatModeNumber = (index) => String(index + 1).padStart(2, "0");
  const formatObservationNumber = (value, maximumFractionDigits = 2) => {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return "—";
    return numeric.toLocaleString("ja-JP", { maximumFractionDigits });
  };
  const formatPopulationCompact = (value) => {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return "—";
    if (numeric >= 1_000_000_000) return `${(numeric / 1_000_000_000).toFixed(1)}B`;
    if (numeric >= 1_000_000) return `${Math.round(numeric / 1_000_000)}M`;
    return formatObservationNumber(numeric, 0);
  };
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
    const projection = {
      scale,
      width,
      height,
      originX: (rect.width - width) / 2 + japanView.earthOffsetX,
      originY: (rect.height - height) / 2 + japanView.earthOffsetY,
    };
    const japanX = projection.originX + earthLongitudeToMapX(138) * projection.scale;
    const japanY = projection.originY + (90 - 36) * projection.scale;
    const tokyoX = projection.originX
      + earthLongitudeToMapX(BLUE_CIRCULATION_FOCUS.lon) * projection.scale;
    const tokyoY = projection.originY
      + (90 - BLUE_CIRCULATION_FOCUS.lat) * projection.scale;
    japanOverlay.dataset.earthZoom = zoom.toFixed(4);
    japanOverlay.dataset.earthOffsetX = japanView.earthOffsetX.toFixed(2);
    japanOverlay.dataset.earthOffsetY = japanView.earthOffsetY.toFixed(2);
    japanOverlay.dataset.japanScreenX = japanX.toFixed(2);
    japanOverlay.dataset.japanScreenY = japanY.toFixed(2);
    japanOverlay.dataset.tokyoScreenX = tokyoX.toFixed(2);
    japanOverlay.dataset.tokyoScreenY = tokyoY.toFixed(2);
    mapZoomControls.dataset.zoom = zoom.toFixed(2);
    mapZoomIn.disabled = zoom >= 7.995;
    mapZoomOut.disabled = zoom <= 1.005;
    mapZoomReset.disabled = zoom <= 1.005
      && Math.abs(japanView.earthOffsetX) < 0.5
      && Math.abs(japanView.earthOffsetY) < 0.5;
    return projection;
  };

  const getEarthWorldCopies = (projection) => [-360, 0, 360].map((repeat) => ({
    repeat,
    x: projection.originX + (repeat - EARTH_INITIAL_CENTER_LONGITUDE) * projection.scale,
    y: projection.originY,
    width: 360 * projection.scale,
    height: 180 * projection.scale,
  }));

  const getEarthViewTarget = (index, rect) => {
    const focusJapan = modes[index]?.id === "blue-circulation";
    const zoom = focusJapan ? (rect.width <= 720 ? 3.35 : 4.15) : 1;
    if (!focusJapan) return { focus: "global", zoom, offsetX: 0, offsetY: 0 };

    const baseScale = Math.max(0.1, Math.max(rect.width / 360, rect.height / 180));
    const scale = baseScale * zoom;
    const width = 360 * scale;
    const height = 180 * scale;
    const targetX = rect.width * 0.5;
    const targetY = rect.height * 0.46;
    return {
      focus: BLUE_CIRCULATION_FOCUS.label,
      zoom,
      offsetX: targetX - (
        (rect.width - width) / 2
        + earthLongitudeToMapX(BLUE_CIRCULATION_FOCUS.lon) * scale
      ),
      offsetY: targetY - (
        (rect.height - height) / 2
        + (90 - BLUE_CIRCULATION_FOCUS.lat) * scale
      ),
    };
  };

  const cancelEarthViewAnimation = (reason = "cancelled") => {
    if (earthViewAnimationFrame) cancelAnimationFrame(earthViewAnimationFrame);
    if (earthViewAnimationTimer) window.clearTimeout(earthViewAnimationTimer);
    earthViewAnimationFrame = 0;
    earthViewAnimationTimer = 0;
    if (japanOverlay.dataset.viewAnimation === "running") {
      japanOverlay.dataset.viewAnimation = reason;
    }
  };

  const applyEarthViewState = ({ zoom, offsetX, offsetY }, rect) => {
    japanView.earthZoom = zoom;
    japanView.earthOffsetX = offsetX;
    japanView.earthOffsetY = offsetY;
    japanView.earthProjection = getEarthProjection(rect);
    japanTilesDirty = true;
  };

  const animateEarthViewToTarget = (target, rect = japanMap.getBoundingClientRect()) => {
    if (!japanIsOpen || mapScope !== "earth") return;
    if (rect.width < 1 || rect.height < 1) return;
    cancelEarthViewAnimation("replaced");
    const start = {
      zoom: japanView.earthZoom,
      offsetX: japanView.earthOffsetX,
      offsetY: japanView.earthOffsetY,
    };
    japanOverlay.dataset.viewTarget = target.focus;
    japanOverlay.dataset.viewAnimation = reducedMotion ? "idle" : "running";
    if (reducedMotion) {
      applyEarthViewState(target, rect);
      return true;
    }

    const duration = 1150;
    let previousFrameAt = performance.now();
    let elapsed = 0;
    const scheduleStep = (step) => {
      const run = (now) => {
        if (!earthViewAnimationFrame && !earthViewAnimationTimer) return;
        if (earthViewAnimationFrame) cancelAnimationFrame(earthViewAnimationFrame);
        if (earthViewAnimationTimer) window.clearTimeout(earthViewAnimationTimer);
        earthViewAnimationFrame = 0;
        earthViewAnimationTimer = 0;
        step(now);
      };
      earthViewAnimationFrame = requestAnimationFrame(run);
      earthViewAnimationTimer = window.setTimeout(() => run(performance.now()), 34);
    };
    const step = (now) => {
      const frameDelta = clamp(now - previousFrameAt, 0, 64);
      previousFrameAt = now;
      elapsed = Math.min(duration, elapsed + frameDelta);
      const progress = elapsed / duration;
      const eased = progress * progress * (3 - 2 * progress);
      applyEarthViewState({
        zoom: start.zoom + (target.zoom - start.zoom) * eased,
        offsetX: start.offsetX + (target.offsetX - start.offsetX) * eased,
        offsetY: start.offsetY + (target.offsetY - start.offsetY) * eased,
      }, rect);
      if (progress < 1) {
        scheduleStep(step);
      } else {
        earthViewAnimationFrame = 0;
        earthViewAnimationTimer = 0;
        japanOverlay.dataset.viewAnimation = "idle";
      }
    };
    scheduleStep(step);
    return true;
  };

  const animateEarthViewForMode = (index = modeToIndex) => {
    const rect = japanMap.getBoundingClientRect();
    return animateEarthViewToTarget(getEarthViewTarget(index, rect), rect);
  };

  const focusEarthLocation = ({ lon, lat, zoom = 3.65, targetX = 0.5, targetY = 0.43, label = "location" } = {}) => {
    const longitude = Number(lon);
    const latitude = Number(lat);
    if (!Number.isFinite(longitude) || !Number.isFinite(latitude) || !japanIsOpen || mapScope !== "earth") return false;
    const rect = japanMap.getBoundingClientRect();
    if (rect.width < 1 || rect.height < 1) return false;
    const resolvedZoom = clamp(Number(zoom) || 3.65, 1, 8);
    const baseScale = Math.max(0.1, Math.max(rect.width / 360, rect.height / 180));
    const scale = baseScale * resolvedZoom;
    const width = 360 * scale;
    const height = 180 * scale;
    return animateEarthViewToTarget({
      focus: String(label || "location"),
      zoom: resolvedZoom,
      offsetX: rect.width * clamp(Number(targetX) || 0.5, 0.2, 0.8)
        - ((rect.width - width) / 2 + earthLongitudeToMapX(longitude) * scale),
      offsetY: rect.height * clamp(Number(targetY) || 0.43, 0.2, 0.8)
        - ((rect.height - height) / 2 + (90 - clamp(latitude, -85, 85)) * scale),
    }, rect);
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

  const zoomEarthBy = (factor = 1) => {
    if (!japanIsOpen || mapScope !== "earth") return false;
    const multiplier = Number(factor);
    if (!Number.isFinite(multiplier) || multiplier <= 0) return false;
    cancelEarthViewAnimation("control-zoom");
    const rect = japanMap.getBoundingClientRect();
    setEarthZoom(japanView.earthZoom * multiplier, rect.left + rect.width / 2, rect.top + rect.height / 2);
    return true;
  };

  const zoomEarthAtLocation = ({ lon, lat, factor = 1, targetX = 0.5, targetY = 0.43 } = {}) => {
    if (!japanIsOpen || mapScope !== "earth") return false;
    const longitude = Number(lon);
    const latitude = Number(lat);
    const multiplier = Number(factor);
    if (!Number.isFinite(longitude) || !Number.isFinite(latitude) || !Number.isFinite(multiplier) || multiplier <= 0) return false;
    cancelEarthViewAnimation("location-zoom");
    const rect = japanMap.getBoundingClientRect();
    if (rect.width < 1 || rect.height < 1) return false;
    const nextZoom = clamp(japanView.earthZoom * multiplier, 1, 8);
    const baseScale = Math.max(0.1, Math.max(rect.width / 360, rect.height / 180));
    const nextScale = baseScale * nextZoom;
    const nextWidth = 360 * nextScale;
    const nextHeight = 180 * nextScale;
    const anchorX = rect.width * clamp(Number(targetX) || 0.5, 0.2, 0.8);
    const anchorY = rect.height * clamp(Number(targetY) || 0.43, 0.2, 0.8);
    japanView.earthZoom = nextZoom;
    japanView.earthOffsetX = anchorX
      - ((rect.width - nextWidth) / 2 + earthLongitudeToMapX(longitude) * nextScale);
    japanView.earthOffsetY = anchorY
      - ((rect.height - nextHeight) / 2 + (90 - clamp(latitude, -85, 85)) * nextScale);
    japanView.earthProjection = getEarthProjection(rect);
    japanTilesDirty = true;
    return true;
  };

  const resetJapanView = () => {
    cancelEarthViewAnimation("reset");
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
    const deviceRatio = Math.min(Math.max(1, window.devicePixelRatio || 1), globalThis.GaiaFrameBudgetGovernor?.getDprCap?.() || Infinity);
    const nativeRatio = Math.min(deviceRatio, mapOverlayQuality.ratioCap);
    const rawWidth = Math.max(1, rect.width * nativeRatio);
    const rawHeight = Math.max(1, rect.height * nativeRatio);
    const cssPixels = Math.max(1, rect.width * rect.height);
    const maxPixels = Math.max(cssPixels, mapOverlayQuality.maxPixels);
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

    const renderedRatio = ratio.toFixed(3);
    const deviceRatioLabel = deviceRatio.toFixed(3);
    if (japanOverlay.dataset.renderQuality !== mapOverlayQuality.tier) {
      japanOverlay.dataset.renderQuality = mapOverlayQuality.tier;
    }
    if (japanOverlay.dataset.renderPixelRatio !== renderedRatio) {
      japanOverlay.dataset.renderPixelRatio = renderedRatio;
    }
    if (japanOverlay.dataset.devicePixelRatio !== deviceRatioLabel) {
      japanOverlay.dataset.devicePixelRatio = deviceRatioLabel;
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

  const getNaturalEarthCountryGeographicPath = (iso3) => {
    if (naturalEarthCountryState !== "ready" || typeof Path2D === "undefined") return null;
    const cacheKey = `earth-country-${iso3}`;
    if (naturalEarthCountryPathCache.has(cacheKey)) return naturalEarthCountryPathCache.get(cacheKey);
    const rings = naturalEarthCountryRings.get(iso3) || [];
    if (!rings.length) return null;
    const path = new Path2D();
    for (const ring of rings) {
      if (ring.length < 3) continue;
      ring.forEach(([longitude, latitude], pointIndex) => {
        const x = longitude + 180;
        const y = 90 - latitude;
        if (pointIndex === 0) path.moveTo(x, y);
        else path.lineTo(x, y);
      });
      path.closePath();
    }
    naturalEarthCountryPathCache.set(cacheKey, path);
    return path;
  };

  const getNaturalEarthCountryBoundaryGeographicPath = () => {
    if (naturalEarthCountryState !== "ready" || typeof Path2D === "undefined") return null;
    const cacheKey = "earth-country-boundaries";
    if (naturalEarthCountryPathCache.has(cacheKey)) return naturalEarthCountryPathCache.get(cacheKey);
    const path = new Path2D();
    for (const ring of naturalEarthCountryBoundaryRings) {
      if (ring.length < 3) continue;
      ring.forEach(([longitude, latitude], pointIndex) => {
        const x = longitude + 180;
        const y = 90 - latitude;
        if (pointIndex === 0) path.moveTo(x, y);
        else path.lineTo(x, y);
      });
      path.closePath();
    }
    naturalEarthCountryPathCache.set(cacheKey, path);
    return path;
  };

  const getJapanPrefectureBoundaryGeographicPath = () => {
    if (japanPrefectureBoundaryState !== "ready" || typeof Path2D === "undefined") return null;
    const cacheKey = "earth-prefecture-boundaries";
    if (japanPrefectureBoundaryPathCache.has(cacheKey)) {
      return japanPrefectureBoundaryPathCache.get(cacheKey);
    }
    const path = new Path2D();
    for (const arc of japanPrefectureBoundaryArcs) {
      arc.forEach(([longitude, latitude], pointIndex) => {
        const x = longitude + 180;
        const y = 90 - latitude;
        if (pointIndex === 0) path.moveTo(x, y);
        else path.lineTo(x, y);
      });
    }
    japanPrefectureBoundaryPathCache.set(cacheKey, path);
    return path;
  };

  const getJapanPrefectureBoundaryMercatorPath = (zoom) => {
    if (japanPrefectureBoundaryState !== "ready" || typeof Path2D === "undefined") return null;
    const cacheKey = `mercator-prefecture-boundaries-${zoom}`;
    if (japanPrefectureBoundaryPathCache.has(cacheKey)) {
      return japanPrefectureBoundaryPathCache.get(cacheKey);
    }
    const path = new Path2D();
    for (const arc of japanPrefectureBoundaryArcs) {
      arc.forEach(([longitude, latitude], pointIndex) => {
        const point = lonLatToWorld(longitude, latitude, zoom);
        if (pointIndex === 0) path.moveTo(point.x, point.y);
        else path.lineTo(point.x, point.y);
      });
    }
    japanPrefectureBoundaryPathCache.set(cacheKey, path);
    return path;
  };

  const drawRenewableCountryChoropleth = (ctx, rect, rows, selectedIso3) => {
    if (mapScope !== "earth" || naturalEarthCountryState !== "ready") return 0;
    const projection = japanView.earthProjection || getEarthProjection(rect);
    const { originX, originY, width, height, scale } = projection;
    const worldCopies = getEarthWorldCopies(projection);
    let filledCount = 0;
    ctx.save();
    ctx.beginPath();
    ctx.rect(originX, originY, width, height);
    ctx.clip();
    for (const row of rows) {
      const path = getNaturalEarthCountryGeographicPath(row.iso3);
      if (!path) continue;
      filledCount += 1;
      const ratio = clamp((row.renewablePercent || 0) / 100, 0, 1);
      const selected = row.iso3 === selectedIso3;
      const red = Math.round(14 + ratio * 32);
      const green = Math.round(72 + ratio * 158);
      const blue = Math.round(150 + ratio * 105);
      for (const copy of worldCopies) {
        ctx.save();
        ctx.translate(copy.x, copy.y);
        ctx.scale(scale, scale);
        ctx.fillStyle = `rgba(${red},${green},${blue},${selected ? 0.94 : 0.38 + ratio * 0.5})`;
        ctx.fill(path, "evenodd");
        ctx.strokeStyle = selected ? "rgba(255,239,146,.98)" : `rgba(110,210,255,${0.28 + ratio * 0.5})`;
        ctx.lineWidth = (selected ? 2.8 : 0.8) / scale;
        ctx.stroke(path);
        ctx.restore();
      }
    }
    ctx.restore();
    return filledCount;
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
      const boundariesReady = naturalEarthCountryState === "ready"
        && japanPrefectureBoundaryState === "ready";
      mapScopeNote.innerHTML =
        mapScope === "earth"
          ? `BASEMAP / NATURAL EARTH 1:50m<br />${boundariesReady
            ? "COUNTRY BORDERS · PREFECTURES / GLOBAL MAP JAPAN"
            : "LOCAL BOUNDARY VECTORS LOADING"}`
          : `BASEMAP / NATURAL EARTH 1:50m<br />${boundariesReady
            ? "PREFECTURES / GLOBAL MAP JAPAN"
            : "LOCAL BOUNDARY VECTORS LOADING"}`;
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
      const worldCopies = getEarthWorldCopies(projection);
      japanOverlay.dataset.vectorWorldCopies = worldCopies
        .map((copy) => copy.x.toFixed(2))
        .join(",");
      const geographicPath = getNaturalEarthGeographicPath();
      const countryBoundaryPath = getNaturalEarthCountryBoundaryGeographicPath();
      const prefectureBoundaryPath = getJapanPrefectureBoundaryGeographicPath();
      const prefectureBoundaryOpacity = clamp((japanView.earthZoom - 1.65) / 0.8, 0, 1);
      const showPrefectureBoundaries = Boolean(prefectureBoundaryPath && prefectureBoundaryOpacity > 0);
      japanOverlay.dataset.worldBoundaryLayer = countryBoundaryPath ? "country" : naturalEarthCountryState;
      japanOverlay.dataset.worldBoundaryRingCount = String(naturalEarthCountryBoundaryRings.length);
      japanOverlay.dataset.prefectureBoundaryLayer = showPrefectureBoundaries
        ? "prefecture"
        : japanPrefectureBoundaryState === "ready" ? "hidden-global" : japanPrefectureBoundaryState;
      japanOverlay.dataset.prefectureBoundaryArcCount = String(japanPrefectureBoundaryArcs.length);

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
        for (const copy of worldCopies) {
          ctx.save();
          ctx.translate(copy.x, copy.y);
          ctx.scale(scale, scale);
          ctx.fillStyle = "rgba(29, 86, 84, 0.28)";
          ctx.fill(geographicPath, "evenodd");
          ctx.strokeStyle = "rgba(135, 244, 216, 0.68)";
          ctx.lineWidth = 1.05 / scale;
          ctx.stroke(geographicPath);
          ctx.restore();
        }
      } else {
        for (const copy of worldCopies) {
          for (const landmass of SIMPLE_WORLD_LANDMASSES) {
            ctx.beginPath();
            landmass.points.forEach(([longitude, latitude], pointIndex) => {
              const x = copy.x + (longitude + 180) * scale;
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

      if (countryBoundaryPath) {
        for (const copy of worldCopies) {
          ctx.save();
          ctx.translate(copy.x, copy.y);
          ctx.scale(scale, scale);
          ctx.strokeStyle = "rgba(194, 241, 229, 0.48)";
          ctx.lineWidth = 0.58 / scale;
          ctx.stroke(countryBoundaryPath);
          ctx.restore();
        }
      }

      if (showPrefectureBoundaries) {
        for (const copy of worldCopies) {
          ctx.save();
          ctx.translate(copy.x, copy.y);
          ctx.scale(scale, scale);
          ctx.strokeStyle = `rgba(226, 255, 246, ${0.42 + prefectureBoundaryOpacity * 0.42})`;
          ctx.lineWidth = (0.72 + prefectureBoundaryOpacity * 0.22) / scale;
          ctx.stroke(prefectureBoundaryPath);
          ctx.restore();
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
    const prefectureBoundaryPath = getJapanPrefectureBoundaryMercatorPath(japanView.zoom);
    japanOverlay.dataset.worldBoundaryLayer = "hidden-japan";
    japanOverlay.dataset.worldBoundaryRingCount = String(naturalEarthCountryBoundaryRings.length);
    japanOverlay.dataset.prefectureBoundaryLayer = prefectureBoundaryPath
      ? "prefecture"
      : japanPrefectureBoundaryState;
    japanOverlay.dataset.prefectureBoundaryArcCount = String(japanPrefectureBoundaryArcs.length);

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

      if (prefectureBoundaryPath) {
        ctx.save();
        ctx.translate(repeatOffset - left, -top);
        ctx.strokeStyle = "rgba(226, 255, 246, 0.82)";
        ctx.lineWidth = japanView.zoom >= 4 ? 0.95 : 0.78;
        ctx.stroke(prefectureBoundaryPath);
        ctx.restore();
      }

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
    if (!referenceWorldContext || referenceWorldContext.isContextLost?.()) {
      japanOverlay.dataset.referenceWorldCache = "direct-fallback";
      renderReferenceWorldModel(ctx, rect, left, top);
      return;
    }

    const logicalWidth = Math.max(1, Math.ceil(rect.width));
    const logicalHeight = Math.max(1, Math.ceil(rect.height));
    const cacheScale = Math.min(1, 2048 / logicalWidth, 2048 / logicalHeight);
    const width = Math.max(1, Math.ceil(logicalWidth * cacheScale));
    const height = Math.max(1, Math.ceil(logicalHeight * cacheScale));
    const projection = mapScope === "earth"
      ? japanView.earthProjection || getEarthProjection(rect)
      : null;
    const cacheKey = [
      mapScope,
      naturalEarthLandState,
      naturalEarthLandRings.length,
      naturalEarthCountryState,
      naturalEarthCountryBoundaryRings.length,
      japanPrefectureBoundaryState,
      japanPrefectureBoundaryArcs.length,
      logicalWidth,
      logicalHeight,
      Math.round(cacheScale * 1000),
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
      referenceWorldContext.setTransform(cacheScale, 0, 0, cacheScale, 0, 0);
      renderReferenceWorldModel(referenceWorldContext, {
        width: logicalWidth,
        height: logicalHeight,
      }, left, top);
      referenceWorldContext.setTransform(1, 0, 0, 1, 0, 0);
      referenceWorldCacheKey = cacheKey;
    }

    japanOverlay.dataset.referenceWorldCache = "ready";
    japanOverlay.dataset.referenceWorldRenderScale = cacheScale.toFixed(4);
    japanOverlay.dataset.referenceWorldBackingSize = `${width}x${height}`;
    ctx.drawImage(referenceWorldCanvas, 0, 0, width, height, 0, 0, rect.width, rect.height);
  };

  const invalidateReferenceWorldCache = () => {
    referenceWorldCacheKey = "";
    japanTilesDirty = true;
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
  const forestRasterCache = new WeakMap();

  const getRasterDimensions = (image) => ({
    width: image?.naturalWidth || image?.videoWidth || image?.width || 0,
    height: image?.naturalHeight || image?.videoHeight || image?.height || 0,
  });

  const getGeographicRaster = (image) => {
    const source = getRasterDimensions(image);
    if (!source.width || !source.height) return null;
    const aspectRatio = source.width / source.height;
    if (aspectRatio > 1.5) return image;

    const cached = geographicRasterCache.get(image);
    if (
      cached?.sourceWidth === source.width &&
      cached?.sourceHeight === source.height
    ) {
      return cached.canvas;
    }

    // The local NASA land-cover and night-light snapshots are square Web
    // Mercator rasters. Convert each one only once to the same geographic
    // 2:1 projection used by the vector coastline, then reuse that canvas.
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(2, source.width * 2);
    canvas.height = Math.max(1, source.height);
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
      const sourceTop = mercatorY(latitudeTop) * source.height;
      const sourceBottom = mercatorY(latitudeBottom) * source.height;
      const targetTop = ((90 - latitudeTop) / 180) * canvas.height;
      const targetBottom = ((90 - latitudeBottom) / 180) * canvas.height;

      rasterContext.drawImage(
        image,
        0,
        sourceTop,
        source.width,
        Math.max(0.001, sourceBottom - sourceTop),
        0,
        targetTop,
        canvas.width,
        Math.max(0.001, targetBottom - targetTop + 0.5),
      );
    }

    geographicRasterCache.set(image, {
      canvas,
      sourceWidth: source.width,
      sourceHeight: source.height,
    });
    return canvas;
  };

  const parseOvationAuroraPayload = (payload) => {
    const coordinates = Array.isArray(payload?.coordinates)
      ? payload.coordinates
        .map((row) => [Number(row?.[0]), Number(row?.[1]), Number(row?.[2])])
        .filter(([lon, lat, value]) =>
          Number.isFinite(lon) && Number.isFinite(lat) && Number.isFinite(value)
          && Math.abs(lat) >= 40 && value > 0,
        )
      : [];
    if (coordinates.length < 80) throw new Error("Invalid OVATION aurora grid");
    const maximum = Math.max(1, ...coordinates.map((row) => row[2]));
    return {
      coordinates,
      maximum,
      observationTime: String(payload["Observation Time"] || payload.observationTime || ""),
      forecastTime: String(payload["Forecast Time"] || payload.forecastTime || ""),
      sampleStep: payload.sampleStep || null,
    };
  };

  const mixOvationColor = (value, maximum, alpha) => {
    const normalized = clamp(value / Math.max(1, maximum), 0, 1);
    const stops = normalized < 0.56
      ? { from: [71, 255, 181], to: [105, 222, 255], mix: normalized / 0.56 }
      : { from: [105, 222, 255], to: [255, 231, 153], mix: (normalized - 0.56) / 0.44 };
    const color = stops.from.map((component, index) =>
      Math.round(component + (stops.to[index] - component) * stops.mix),
    );
    return `rgba(${color.join(",")},${alpha})`;
  };

  const rebuildOvationAuroraRaster = (forecast) => {
    if (!ovationAuroraContext || !ovationAuroraRawContext) return;
    const width = 720;
    const height = 360;
    ovationAuroraCanvas.width = width;
    ovationAuroraCanvas.height = height;
    ovationAuroraRawCanvas.width = width;
    ovationAuroraRawCanvas.height = height;
    const longitudeStep = Math.max(1, Number(forecast.sampleStep?.longitudeDegrees) || 1);
    const latitudeStep = Math.max(1, Number(forecast.sampleStep?.latitudeDegrees) || 1);

    ovationAuroraRawContext.clearRect(0, 0, width, height);
    ovationAuroraRawContext.globalCompositeOperation = "source-over";
    for (const [sourceLongitude, latitude, value] of forecast.coordinates) {
      const visibilityFloor = Math.max(2, forecast.maximum * 0.08);
      if (value < visibilityFloor) continue;
      const longitude = ((sourceLongitude + 540) % 360) - 180;
      const x = ((longitude + 180) / 360) * width;
      const y = ((90 - latitude) / 180) * height;
      const normalized = clamp(
        (value - visibilityFloor) / Math.max(1, forecast.maximum - visibilityFloor),
        0,
        1,
      );
      const alpha = 0.12 + Math.pow(normalized, 0.88) * 0.82;
      const cellWidth = Math.max(2.2, longitudeStep * width / 360 + 0.8);
      const cellHeight = Math.max(2.2, latitudeStep * height / 180 + 0.8);
      ovationAuroraRawContext.fillStyle = mixOvationColor(value, forecast.maximum, alpha);
      ovationAuroraRawContext.fillRect(
        x - cellWidth / 2,
        y - cellHeight / 2,
        cellWidth,
        cellHeight,
      );
    }

    ovationAuroraContext.clearRect(0, 0, width, height);
    ovationAuroraContext.globalCompositeOperation = "lighter";
    ovationAuroraContext.filter = "blur(12px)";
    ovationAuroraContext.globalAlpha = 0.76;
    for (const offset of [-width, 0, width]) {
      ovationAuroraContext.drawImage(ovationAuroraRawCanvas, offset, 0);
    }
    ovationAuroraContext.filter = "blur(3px)";
    ovationAuroraContext.globalAlpha = 0.58;
    for (const offset of [-width, 0, width]) {
      ovationAuroraContext.drawImage(ovationAuroraRawCanvas, offset, 0);
    }
    ovationAuroraContext.filter = "none";
    ovationAuroraContext.globalAlpha = 1;
    ovationAuroraContext.globalCompositeOperation = "source-over";
  };

  const loadOvationAuroraForecast = async () => {
    window.clearTimeout(ovationAuroraReloadTimer);
    let payload;
    let source = "live";
    try {
      payload = await fetchJsonWithTimeout(OVATION_AURORA_LIVE_DATA, 7000);
    } catch {
      source = "snapshot";
      try {
        payload = await fetchJsonWithTimeout(OVATION_AURORA_FALLBACK_DATA, 3500);
      } catch {
        payload = null;
      }
    }
    try {
      const forecast = parseOvationAuroraPayload(payload);
      rebuildOvationAuroraRaster(forecast);
      ovationAuroraState = {
        status: "ready",
        source,
        observationTime: forecast.observationTime,
        forecastTime: forecast.forecastTime,
        pointCount: forecast.coordinates.length,
        maximum: forecast.maximum,
      };
    } catch {
      ovationAuroraState = { ...ovationAuroraState, status: "offline", source };
    }
    ovationAuroraReloadTimer = window.setTimeout(
      loadOvationAuroraForecast,
      OVATION_AURORA_REFRESH_MS,
    );
  };

  const getForestGeographicRaster = (image) => {
    const geographicRaster = getGeographicRaster(image);
    if (!geographicRaster) return null;
    const cached = forestRasterCache.get(image);
    if (
      cached?.source === geographicRaster &&
      cached.canvas.width === geographicRaster.width &&
      cached.canvas.height === geographicRaster.height
    ) {
      return cached.canvas;
    }

    const canvas = document.createElement("canvas");
    canvas.width = geographicRaster.width;
    canvas.height = geographicRaster.height;
    const forestContext = canvas.getContext("2d", { willReadFrequently: true });
    if (!forestContext) return geographicRaster;
    forestContext.drawImage(geographicRaster, 0, 0);
    try {
      const pixels = forestContext.getImageData(0, 0, canvas.width, canvas.height);
      const data = pixels.data;
      for (let index = 0; index < data.length; index += 4) {
        const red = data[index];
        const green = data[index + 1];
        const blue = data[index + 2];
        const alpha = data[index + 3];
        const greenness = green - Math.max(red, blue);
        const isForest = alpha > 0 && green >= 65 && greenness >= 14;
        if (!isForest) {
          data[index + 3] = 0;
          continue;
        }
        data[index] = 24;
        data[index + 1] = 230;
        data[index + 2] = 126;
        data[index + 3] = Math.round(alpha * clamp(0.45 + greenness / 95, 0.45, 0.96));
      }
      forestContext.putImageData(pixels, 0, 0);
      japanOverlay.dataset.forestMask = "ready";
    } catch {
      japanOverlay.dataset.forestMask = "fallback";
      return geographicRaster;
    }
    forestRasterCache.set(image, { canvas, source: geographicRaster });
    return canvas;
  };

  let forestRasterPreparationScheduled = false;
  let forestRasterPreparationAwaitingImage = false;
  const scheduleForestRasterPreparation = () => {
    if (
      japanOverlay.dataset.forestMask === "ready"
      || japanOverlay.dataset.forestMask === "fallback"
      || forestRasterPreparationScheduled
    ) return;
    if (!landCoverImage.complete || !landCoverImage.naturalWidth) {
      if (!forestRasterPreparationAwaitingImage) {
        forestRasterPreparationAwaitingImage = true;
        landCoverImage.addEventListener("load", () => {
          forestRasterPreparationAwaitingImage = false;
          scheduleForestRasterPreparation();
        }, { once: true });
      }
      return;
    }
    forestRasterPreparationScheduled = true;
    const prepare = () => {
      try {
        getForestGeographicRaster(landCoverImage);
      } finally {
        forestRasterPreparationScheduled = false;
      }
    };
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(prepare, { timeout: 1800 });
    } else {
      window.setTimeout(prepare, 0);
    }
  };
  let forestPreparationQueuedForOpening = false;
  const scheduleForestRasterWhenUncovered = () => {
    if (document.body.classList.contains("gaia-opening-active")) {
      if (forestPreparationQueuedForOpening) return;
      forestPreparationQueuedForOpening = true;
      window.addEventListener("gaia:opening-complete", () => {
        forestPreparationQueuedForOpening = false;
        scheduleForestRasterPreparation();
      }, { once: true });
      return;
    }
    scheduleForestRasterPreparation();
  };
  landCoverImage.addEventListener("load", scheduleForestRasterWhenUncovered, { once: true });
  if (landCoverImage.complete && landCoverImage.naturalWidth) scheduleForestRasterWhenUncovered();

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
      phaseLabel: "ある1日の海流 × 移動距離の計算",
      yearLabel: `${day.toFixed(1)}日後`,
      dateLabel: `${sourceDate} UTC`,
      methodLabel: "海流の速さ × 経過時間（風は計算に未使用）",
      warning:
        "ある一日の海流が同じ速さと向きで続くと仮定した距離です。実際の14日後を予報するものではありません。",
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

  const describeCorrelation = (value) => {
    const magnitude = Math.abs(value);
    const strength = magnitude >= 0.7
      ? "強い"
      : magnitude >= 0.4
        ? "中程度の"
        : magnitude >= 0.2
          ? "弱い"
          : "ほぼない";
    if (magnitude < 0.1) return `${strength}相関`;
    return `${strength}${value < 0 ? "負" : "正"}の相関`;
  };

  const getThreeEcologiesComparison = (signals) => {
    const pairedRows = (signals.pairedCountries || []).length
      ? signals.pairedCountries
      : (signals.social || []).map((urban) => {
        const forest = (signals.ecological || []).find((row) => row.iso3 === urban.iso3);
        return forest
          ? {
            ...urban,
            urbanYear: urban.year,
            forestYear: forest.year,
            forestPercent: forest.forestPercent,
          }
          : null;
      }).filter(Boolean);
    if (pairedRows.length < 2) return null;

    const meanUrban = pairedRows.reduce((sum, row) => sum + row.urbanPercent, 0) / pairedRows.length;
    const meanForest = pairedRows.reduce((sum, row) => sum + row.forestPercent, 0) / pairedRows.length;
    const sums = pairedRows.reduce((result, row) => {
      const urbanDelta = row.urbanPercent - meanUrban;
      const forestDelta = row.forestPercent - meanForest;
      result.covariance += urbanDelta * forestDelta;
      result.urbanVariance += urbanDelta ** 2;
      result.forestVariance += forestDelta ** 2;
      return result;
    }, { covariance: 0, urbanVariance: 0, forestVariance: 0 });
    const correlation = sums.covariance / Math.sqrt(sums.urbanVariance * sums.forestVariance);
    const slope = sums.urbanVariance ? sums.covariance / sums.urbanVariance : 0;
    const intercept = meanForest - slope * meanUrban;
    const rows = pairedRows
      .map((row) => {
        const expectedForestPercent = intercept + slope * row.urbanPercent;
        return {
          ...row,
          expectedForestPercent,
          residualPercent: row.forestPercent - expectedForestPercent,
        };
      })
      .sort((a, b) => a.urbanPercent - b.urbanPercent);
    const selectedIndex = getSequenceIndex(rows.length);
    return {
      rows,
      selectedIndex,
      selected: rows[selectedIndex],
      correlation,
      correlationLabel: describeCorrelation(correlation),
      slope,
      intercept,
      meanUrban,
      meanForest,
    };
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
        phaseLabel: `31代表地点 / ${String(index + 1).padStart(2, "0")} OF ${String(rows.length).padStart(2, "0")}`,
        yearLabel: row.precipitationMmDay?.toFixed(2) || "—",
        valueLabel: `mm/day · ${getForestRainSiteName(row)}`,
        methodLabel: "大きな水色円＝降水量 × 緑＝森林分布",
        timeLabel: `代表地点 / AUTO 01→${String(rows.length).padStart(2, "0")}`,
        selectedIndex: index,
        selected: row,
        legend: [
          "大きな水色円 / 降水量",
          "緑の面 / 森林域",
          "円内の数字 / mm/day",
          "31地点 / 標本",
        ],
      };
    }

    if (signalMode.id === "pollination-protocol") {
      const occurrences = signals.occurrences || [];
      const relations = (signals.interactions || []).filter((row) => row.targetTaxon);
      const stageIndex = getSequenceIndex(3);
      const stages = [
        {
          key: "records",
          yearLabel: String(occurrences.length),
          valueLabel: "GBIF観察記録",
          methodLabel: "黄色い点＝人が登録した記録（生息分布ではない）",
          note: "点はミツバチの個体数や生息域ではありません。点がない場所にもミツバチはいる可能性があります。",
          legend: [
            "黄点 / GBIF記録",
            "空白 / 不在ではない",
            "押す / 1件を読む",
            "次へ / 標本の制約",
          ],
        },
        {
          key: "sampling",
          yearLabel: "2",
          valueLabel: "1か国あたり最大件数",
          methodLabel: "31か国 × 最大2件に揃えた展示用標本",
          note: "国ごとの点数を最大2件に揃えています。点の多さから、ミツバチの多さや観察活動の差は比較できません。",
          legend: [
            "線で結ぶ2点 / 同じ国",
            "31か国 / 選択標本",
            "点の数 / 比較不可",
            "次へ / 花との関係",
          ],
        },
        {
          key: "relations",
          yearLabel: String(relations.length),
          valueLabel: "花との記録関係",
          methodLabel: "GloBI文献関係網（地理配置ではない）",
          note: "枝はGloBIに残るミツバチと植物の関係です。場所・頻度・強さを持たないため、地図の観察点へは結びません。",
          legend: [
            "中央 / Apis mellifera",
            "外側 / 植物名",
            "枝 / pollinates",
            "配置 / 非地理",
          ],
        },
      ];
      const stage = stages[stageIndex];
      return {
        kind: "pollination",
        phaseLabel: `3つの読み方 / STEP ${stageIndex + 1} OF 3`,
        yearLabel: stage.yearLabel,
        valueLabel: stage.valueLabel,
        methodLabel: stage.methodLabel,
        timeLabel: "読み方 / ①観察点 → ②標本 → ③関係網",
        selectedIndex: stageIndex,
        selected: stage,
        stageIndex,
        stageKey: stage.key,
        note: stage.note,
        occurrences,
        relations,
        legend: stage.legend,
      };
    }

    if (signalMode.id === "nothing-is-waste") {
      const rows = signals.countryWaste || [];
      const index = clamp(wasteSelectedIndex, 0, Math.max(0, rows.length - 1));
      const selected = rows[index];
      const sourceRecycle = selected?.recyclePercent || 0;
      const imputed = selected?.valueStatus === "IMPUTED";
      return {
        kind: "waste",
        phaseLabel: `${imputed ? "IMPUTED / NEARBY 5 COUNTRIES" : "OFFICIAL / UN SDG 12.5.1"} · ${String(index + 1).padStart(2, "0")} OF ${String(rows.length).padStart(2, "0")}`,
        yearLabel: `${sourceRecycle.toFixed(1)}%`,
        valueLabel: `${selected?.country || "—"} · ${imputed ? "補完値" : `${selected?.year || "—"} 公式値`}`,
        methodLabel: imputed
          ? `破線円 / 近隣5か国の中央値（${selected?.donorIso3?.join("・") || "参照国"}）`
          : "実線円 / 国連SDG 12.5.1の公式値",
        timeLabel: `国・地域 / 01→${String(rows.length).padStart(2, "0")}`,
        sourceRecycle,
        selectedIndex: index,
        selected,
        legend: [
          "緑 / 再資源化",
          "橙 / それ以外",
          "実線 / 国連公式値",
          "破線 / 近隣5か国から補完",
        ],
      };
    }

    if (signalMode.id === "anthropocene-scar") {
      const rows = signals.emissions || [];
      const years = [...new Set(rows.map((row) => Number(row.year)).filter(Number.isFinite))]
        .sort((a, b) => a - b);
      const yearIndex = getSequenceIndex(years.length);
      const selectedYear = years[yearIndex];
      const yearRows = rows.filter((row) => Number(row.year) === selectedYear);
      const selected = yearRows.find((row) => row.iso3 === anthropoceneSelectedIso3)
        || yearRows.find((row) => row.iso3 === "JPN")
        || yearRows[0];
      if (!selected) return null;
      const selectedIndex = yearRows.indexOf(selected);
      const totalMtCo2 = yearRows.reduce((sum, row) => sum + Number(row.emissionsMtCo2 || 0), 0);
      return {
        kind: "anthropocene",
        phaseLabel: `FOSSIL CO₂ HISTORY / ${String(yearIndex + 1).padStart(2, "0")} OF ${String(years.length).padStart(2, "0")}`,
        yearLabel: String(selectedYear),
        valueLabel: `${selected.country} · ${selected.emissionsMtCo2.toFixed(1)} Mt CO₂`,
        methodLabel: `GCP COUNTRY TOTAL / ${yearRows.length} COUNTRIES · VIIRS LIGHTS FIXED AT 2016`,
        timeLabel: `年 / ${years[0]} → ${years.at(-1)}`,
        selectedIndex,
        selected,
        selectedYear,
        yearIndex,
        years,
        yearRows,
        totalMtCo2,
        legend: [
          "赤い円 / 年別化石CO₂",
          "白い発光 / 2016固定",
          "長押し / 6秒比較",
          "重要 / 夜間光は時系列外",
        ],
      };
    }

    if (signalMode.id === "rhythm-of-disaster") {
      const rows = signals.globalEvents || [];
      const years = [...new Set(rows.map((row) => String(row.occurredAt || "").slice(0, 4)).filter(Boolean))]
        .sort((a, b) => Number(a) - Number(b));
      const index = getSequenceIndex(years.length);
      const year = years[index];
      const yearEvents = rows
        .filter((row) => String(row.occurredAt || "").startsWith(year))
        .sort(compareEarthquakeOccurrence);
      const strongest = yearEvents.reduce(
        (current, row) => !current || row.magnitude > current.magnitude ? row : current,
        null,
      );
      if (!year || !strongest) return null;
      return {
        kind: "earthquake",
        phaseLabel: `USGS YEARLY M7.5+ / ${String(index + 1).padStart(2, "0")} OF ${String(years.length).padStart(2, "0")}`,
        yearLabel: year,
        valueLabel: `${yearEvents.length} EVENTS · MAX M${strongest.magnitude.toFixed(1)}`,
        methodLabel: "YEAR SNAPSHOT / CHRONOLOGICAL POP-IN + ESTIMATED FELT RINGS",
        timeLabel: `年次自動再生 / ${years[0]} → ${years.at(-1)} · 約${(
          GLOBAL_EARTHQUAKE_YEAR_DWELL_MS / 1000
        ).toFixed(1)}秒/年`,
        selectedIndex: index,
        selected: strongest,
        selectedYear: year,
        yearEvents,
        years,
        legend: [
          "橙点 / この年の震源",
          "同心円 / ゆっくり伝播",
          "推定可感半径 / Magnitude",
          "重要 / 推定値",
        ],
      };
    }

    if (signalMode.id === "three-ecologies") {
      const comparison = getThreeEcologiesComparison(signals);
      if (!comparison) return null;
      const { rows, selectedIndex, selected, correlation, correlationLabel } = comparison;
      return {
        kind: "ecologies",
        phaseLabel: `FOREST × URBAN / ${String(selectedIndex + 1).padStart(2, "0")} OF ${String(rows.length).padStart(2, "0")}`,
        yearLabel: selected.country,
        valueLabel: `FOREST ${selected.forestPercent.toFixed(1)}% · URBAN ${selected.urbanPercent.toFixed(1)}%`,
        methodLabel: `PAIRED COUNTRY VALUES / PEARSON r ${correlation.toFixed(2)}`,
        timeLabel: `比較国 / 都市人口率が低い → 高い ${String(selectedIndex + 1).padStart(2, "0")}/${String(rows.length).padStart(2, "0")}`,
        selectedIndex,
        selected,
        rows,
        correlation,
        correlationLabel,
        slope: comparison.slope,
        intercept: comparison.intercept,
        legend: [
          "緑の内円 / 森林",
          "青の外円 / 都市",
          "散布図 / 31か国",
          "紫の菱形 / 記憶",
        ],
      };
    }

    if (signalMode.id === "earth-organ") {
      const rows = (signals.current || [])
        .map((current) => ({
          ...current,
          potential: (signals.potential || []).find((row) => row.iso3 === current.iso3) || null,
        }))
        .sort((a, b) => a.renewablePercent - b.renewablePercent);
      const index = getSequenceIndex(rows.length);
      const row = rows[index];
      if (!row) return null;
      return {
        kind: "energy",
        phaseLabel: `RENEWABLE ELECTRICITY / ${String(index + 1).padStart(2, "0")} OF ${String(rows.length).padStart(2, "0")}`,
        yearLabel: `${row.renewablePercent.toFixed(1)}%`,
        valueLabel: `${row.country || row.name} · RENEWABLE ${row.renewablePercent.toFixed(1)}%`,
        methodLabel: "COUNTRY CHOROPLETH / CURRENT ELECTRICITY SHARE",
        timeLabel: `国 / 再生可能電力比率が低い → 高い ${String(index + 1).padStart(2, "0")}/${String(rows.length).padStart(2, "0")}`,
        selectedIndex: index,
        selected: row,
        rows,
        legend: [
          "青い国土 / 現在値",
          "明るさ / 比率",
          "黄円 / 日射条件",
          "緑矢印 / 風条件",
        ],
      };
    }

    if (signalMode.id === "population-tide") {
      const rows = signals.population || [];
      const years = [...new Set(rows.map((row) => Number(row.year)).filter(Number.isFinite))]
        .sort((a, b) => a - b);
      const yearIndex = getSequenceIndex(years.length);
      const selectedYear = years[yearIndex];
      const yearRows = rows.filter((row) => Number(row.year) === selectedYear);
      const selected = yearRows.find((row) => row.iso3 === populationSelectedIso3)
        || yearRows.find((row) => row.iso3 === "JPN")
        || yearRows[0];
      if (!selected) return null;
      const selectedIndex = yearRows.indexOf(selected);
      const totalPopulation = yearRows.reduce((sum, row) => sum + Number(row.population || 0), 0);
      return {
        kind: "population",
        phaseLabel: `POPULATION HISTORY / ${String(yearIndex + 1).padStart(2, "0")} OF ${String(years.length).padStart(2, "0")}`,
        yearLabel: String(selectedYear),
        valueLabel: `${selected.country} · ${formatObservationNumber(selected.population, 0)} 人`,
        methodLabel: `WORLD BANK / ${yearRows.length} COUNTRIES · CIRCLE AREA = POPULATION`,
        timeLabel: `年 / ${years[0]} → ${years.at(-1)}`,
        selectedIndex,
        selected,
        selectedYear,
        yearIndex,
        years,
        yearRows,
        totalPopulation,
        legend: [
          "琥珀円 / 国別人口",
          "面積 / 人口に比例",
          "中心点 / 国の代表位置",
          "重要 / 人口密度ではない",
        ],
      };
    }

    return null;
  };

  const getAnthropoceneEmissionUnit = (emissionsMtCo2) => (
    Math.sqrt(clamp(Number(emissionsMtCo2 || 0) / ANTHROPOCENE_EMISSIONS_SCALE_MT, 0, 1))
  );

  const getAnthropoceneEmissionRadius = (emissionsMtCo2) => (
    getAnthropoceneEmissionUnit(emissionsMtCo2) * 40
  );

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
    const projection = mapScope === "earth"
      ? japanView.earthProjection || getEarthProjection(rect)
      : null;
    const cacheKey = [
      timeline.cacheKey,
      mapScope,
      japanView.zoom,
      Math.round(left * 10),
      Math.round(top * 10),
      Math.round(rect.width),
      Math.round(rect.height),
      projection ? projection.scale.toFixed(6) : "",
      projection ? projection.originX.toFixed(3) : "",
      projection ? projection.originY.toFixed(3) : "",
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
      const anchor = japanWorldToScreen(138, 36, left, top);
      japanOverlay.dataset.gosatAnchorScreenX = anchor.x.toFixed(2);
      japanOverlay.dataset.gosatAnchorScreenY = anchor.y.toFixed(2);
      japanOverlay.dataset.gosatProjectionKey = cacheKey;
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
    const provenance = timeline.kind === "scenario"
      ? "SCENARIO / これまでの傾向が続いた場合"
      : timeline.kind === "reconstruction"
        ? "DERIVED / 昔の記録から再現"
        : spatiallyImputed
          ? "DERIVED / 近くの8地点から補完"
          : temporallyInterpolated
            ? "DERIVED / 二つの時点のあいだ"
            : "SOURCE / 衛星地図から読み取った値";
    return {
      kind: "gosat-grid",
      lon: west + resolution / 2,
      lat: north - resolution / 2,
      meta: hasValue
        ? `約 ${valuePpm.toFixed(1)} ppm / ${timeline.dateLabel} / ${provenance}`
        : `NO DATA / ${timeline.dateLabel}`,
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
        const bearing = (toDegrees(Math.atan2(row.uMs, row.vMs)) + 360) % 360;
        const direction = ["北", "北東", "東", "南東", "南", "南西", "西", "北西"][
          Math.round(bearing / 45) % 8
        ];
        return {
          kind: "current-vector",
          lon: row.lon,
          lat: row.lat,
          meta: `${state?.dateLabel || row.time} / 海流 ${speed.toFixed(2)} m/s / ${direction}方向`,
        };
      });
    }
    if (signalMode.id === "forest-cloud-engine") {
      const rows = signals.precipitation || [];
      return rows.map((row, sequenceIndex) => ({
        ...row,
        kind: "sequence-poi",
        sequenceIndex,
        sequenceLength: rows.length,
        lon: row.lon,
        lat: row.lat,
        meta: `年平均 ${row.precipitationMmDay?.toFixed(2) || "—"} mm/day / NASA POWER`,
      }));
    }
    if (signalMode.id === "pollination-protocol") {
      const rows = signals.occurrences || [];
      return rows.map((row) => ({
        ...row,
        kind: "sequence-poi",
        lon: row.lon,
        lat: row.lat,
        meta: `${row.species || "Apis mellifera"} / ${row.eventDate?.slice(0, 10) || "date unknown"} / GBIF ${row.key}`,
      }));
    }
    if (signalMode.id === "nothing-is-waste") {
      const rows = signals.countryWaste || [];
      return rows.map((row, sequenceIndex) => {
        const imputed = row.valueStatus === "IMPUTED";
        return {
          ...row,
          kind: "sequence-poi",
          sequenceIndex,
          sequenceLength: rows.length,
          meta: imputed
            ? `計算で補った値 / ${row.recyclePercent.toFixed(1)}% / 近くの5か国を参照`
            : `${row.year} / ${row.recyclePercent.toFixed(1)}% / 国連の公式データ`,
        };
      });
    }
    if (signalMode.id === "anthropocene-scar") {
      const state = getMapSequenceState(signalMode);
      return (state?.yearRows || []).map((row) => ({
        ...row,
        kind: "sequence-poi",
        lon: row.lon,
        lat: row.lat,
        meta: `${row.year} / ${row.emissionsMtCo2.toFixed(1)} Mt CO₂ / fossil + cement`,
      }));
    }
    if (signalMode.id === "rhythm-of-disaster") {
      if (japanDataLayer === "history") return [];
      const state = getMapSequenceState(signalMode);
      return (state?.yearEvents || []).map((row) => ({
        ...row,
        lon: row.longitude,
        lat: row.latitude,
        kind: "sequence-poi",
        meta: `${String(row.occurredAt).slice(0, 10)} / M${row.magnitude.toFixed(1)} / DEPTH ${row.depthKm?.toFixed(0) || "—"} km`,
      }));
    }
    if (signalMode.id === "three-ecologies") {
      const state = getMapSequenceState(signalMode);
      return [
        ...(state?.rows || []).map((row) => ({
          ...row,
          kind: "sequence-poi",
          meta: `FOREST ${row.forestPercent.toFixed(1)}% / URBAN ${row.urbanPercent.toFixed(1)}%`,
        })),
        ...(signals.culture || []).map((row) => ({
          ...row,
          kind: "sequence-poi",
          meta: `MEMORY CONTEXT / ${row.category} / ${row.region}`,
        })),
      ];
    }
    if (signalMode.id === "earth-organ") {
      const state = getMapSequenceState(signalMode);
      return (state?.rows || []).map((row) => ({
        ...row,
        kind: "sequence-poi",
        lon: row.lon,
        lat: row.lat,
        meta: `${row.year || "—"} / RENEWABLE ${row.renewablePercent.toFixed(1)}% OF ELECTRICITY`,
      }));
    }
    if (signalMode.id === "population-tide") {
      const state = getMapSequenceState(signalMode);
      return (state?.yearRows || []).map((row) => ({
        ...row,
        kind: "sequence-poi",
        lon: row.lon,
        lat: row.lat,
        meta: `${row.year} / ${formatObservationNumber(row.population, 0)} 人 / World Bank`,
      }));
    }
    return [];
  };

  const renderMapInstallationEffect = (ctx, rect, nodePoints, now) => {
    const signalMode = getActiveSignalMode();
    if (!signalMode) return;
    syncMapPlotRevealState(now);
    const { left, top } = getJapanViewport();
    const time = reducedMotion ? 1.8 : now / 1000;
    const rgb = modes[modeToIndex].rgb;
    const center = { x: rect.width * 0.54, y: rect.height * 0.5 };
    const stroke = (alpha) => `rgba(${rgb}, ${alpha})`;
    const pointFor = (row) => japanWorldToScreen(row.lon, row.lat, left, top);
    const visible = (point, margin = 45) => point.x > -margin && point.x < rect.width + margin && point.y > -margin && point.y < rect.height + margin;
    const drawSelectionLabel = (
      point,
      primary,
      secondary,
      color = "rgba(210,255,242,.96)",
      motion = {},
    ) => {
      ctx.save();
      ctx.globalCompositeOperation = "source-over";
      ctx.textAlign = "left";
      const prominent = motion.prominent === true;
      const compact = rect.width < 600;
      const expansive = rect.width >= 2400;
      const primaryFontPx = prominent
        ? (compact ? 18 : (expansive ? 32 : 20))
        : (compact ? 16 : (expansive ? 30 : 18));
      const secondaryFontPx = prominent
        ? (compact ? 14 : (expansive ? 22 : 15))
        : (compact ? 12 : (expansive ? 20 : 13));
      const horizontalPadding = expansive ? (prominent ? 28 : 26) : (prominent ? 20 : 18);
      const cardHeight = prominent
        ? (compact ? 80 : (expansive ? 120 : 86))
        : (compact ? 68 : (expansive ? 106 : 72));
      ctx.font = `700 ${primaryFontPx}px "Noto Sans JP", sans-serif`;
      const primaryWidth = ctx.measureText(primary).width;
      ctx.font = `600 ${secondaryFontPx}px Consolas, "Courier New", monospace`;
      const secondaryWidth = ctx.measureText(secondary).width;
      const maximumWidth = Math.min(
        prominent ? (expansive ? 900 : 620) : (expansive ? 760 : 520),
        rect.width - (prominent ? 32 : 24),
      );
      const naturalWidth = Math.max(primaryWidth, secondaryWidth) + horizontalPadding * 2;
      const textWidth = prominent
        ? Math.min(maximumWidth, Math.max(Math.min(expansive ? 640 : 460, maximumWidth), naturalWidth))
        : Math.min(maximumWidth, Math.max(Math.min(expansive ? 520 : 340, maximumWidth), naturalWidth));
      const pointGap = prominent ? 24 : 16;
      const x = clamp(
        point.x + pointGap + textWidth > rect.width ? point.x - textWidth - pointGap : point.x + pointGap,
        prominent ? 16 : 12,
        rect.width - textWidth - (prominent ? 16 : 12),
      );
      const y = clamp(point.y - cardHeight / 2, prominent ? 16 : 12, rect.height - cardHeight - (prominent ? 16 : 12));
      const alpha = clamp(Number(motion.alpha ?? 1), 0, 1);
      const scale = clamp(Number(motion.scale ?? 1), 0.9, 1.05);
      const offsetY = Number(motion.offsetY) || 0;
      ctx.globalAlpha *= alpha;
      ctx.translate(x + textWidth / 2, y + cardHeight / 2 + offsetY);
      ctx.scale(scale, scale);
      const drawX = -textWidth / 2;
      const drawY = -cardHeight / 2;
      ctx.fillStyle = prominent ? "rgba(2,13,18,.94)" : "rgba(2,13,18,.88)";
      ctx.fillRect(drawX, drawY, textWidth, cardHeight);
      ctx.strokeStyle = color.replace(/\.96\)$/u, ".52)");
      ctx.lineWidth = prominent ? 1.5 : 1;
      ctx.strokeRect(drawX, drawY, textWidth, cardHeight);
      ctx.fillStyle = color;
      ctx.font = `700 ${primaryFontPx}px "Noto Sans JP", sans-serif`;
      ctx.fillText(
        primary,
        drawX + horizontalPadding,
        drawY + (prominent ? (compact ? 32 : (expansive ? 46 : 35)) : (compact ? 28 : (expansive ? 42 : 30))),
        textWidth - horizontalPadding * 2,
      );
      ctx.fillStyle = "rgba(222,241,240,.76)";
      ctx.font = `600 ${secondaryFontPx}px Consolas, "Courier New", monospace`;
      ctx.fillText(
        secondary,
        drawX + horizontalPadding,
        drawY + (prominent ? (compact ? 64 : (expansive ? 94 : 69)) : (compact ? 55 : (expansive ? 83 : 59))),
        textWidth - horizontalPadding * 2,
      );
      ctx.restore();
      japanOverlay.dataset.selectionLabelWidthPx = textWidth.toFixed(1);
      japanOverlay.dataset.selectionLabelHeightPx = String(cardHeight);
      japanOverlay.dataset.selectionLabelPrimaryFontPx = String(primaryFontPx);
      japanOverlay.dataset.selectionLabelSecondaryFontPx = String(secondaryFontPx);
      return { x, y: y + offsetY, width: textWidth, height: cardHeight, primaryFontPx, secondaryFontPx };
    };
    delete japanOverlay.dataset.selectionLabelWidthPx;
    delete japanOverlay.dataset.selectionLabelHeightPx;
    delete japanOverlay.dataset.selectionLabelPrimaryFontPx;
    delete japanOverlay.dataset.selectionLabelSecondaryFontPx;
    delete japanOverlay.dataset.earthquakeSelectionLabelWidthPx;
    delete japanOverlay.dataset.earthquakeSelectionLabelHeightPx;
    delete japanOverlay.dataset.earthquakeSelectionPrimaryFontPx;
    delete japanOverlay.dataset.auxiliaryPanelId;
    delete japanOverlay.dataset.auxiliaryPanelScreenLeft;
    delete japanOverlay.dataset.auxiliaryPanelScreenTop;
    delete japanOverlay.dataset.auxiliaryPanelScreenRight;
    delete japanOverlay.dataset.auxiliaryPanelScreenBottom;
    delete japanOverlay.dataset.auxiliaryPanelLegendClearance;
    const getLegendSafePanelY = (panelX, panelWidth, defaultY, clearance = 12) => {
      const legendDock = mapSignalEncodingLegend?.closest(".signal-encoding-legend-dock");
      if (!legendDock?.getClientRects().length) return defaultY;
      const legendRect = legendDock.getBoundingClientRect();
      const panelLeft = rect.left + panelX;
      const panelRight = panelLeft + panelWidth;
      const overlapsHorizontally = panelLeft < legendRect.right && panelRight > legendRect.left;
      return overlapsHorizontally
        ? Math.max(defaultY, legendRect.bottom - rect.top + clearance)
        : defaultY;
    };
    const recordAuxiliaryPanel = (id, x, y, width, height) => {
      const legendDock = mapSignalEncodingLegend?.closest(".signal-encoding-legend-dock");
      const legendRect = legendDock?.getClientRects().length
        ? legendDock.getBoundingClientRect()
        : null;
      japanOverlay.dataset.auxiliaryPanelId = id;
      japanOverlay.dataset.auxiliaryPanelScreenLeft = (rect.left + x).toFixed(2);
      japanOverlay.dataset.auxiliaryPanelScreenTop = (rect.top + y).toFixed(2);
      japanOverlay.dataset.auxiliaryPanelScreenRight = (rect.left + x + width).toFixed(2);
      japanOverlay.dataset.auxiliaryPanelScreenBottom = (rect.top + y + height).toFixed(2);
      japanOverlay.dataset.auxiliaryPanelLegendClearance = legendRect
        ? (rect.top + y - legendRect.bottom).toFixed(2)
        : "legend-hidden";
    };
    const drawGlobalRaster = (image, alpha, { forestOnly = false } = {}) => {
      const source = getRasterDimensions(image);
      if (!source.width || !source.height) return;
      if (mapScope === "earth") {
        if (
          forestOnly &&
          japanOverlay.dataset.viewAnimation === "running" &&
          !forestRasterCache.has(image)
        ) return;
        const projection = japanView.earthProjection || getEarthProjection(rect);
        const geographicRaster = forestOnly
          ? getForestGeographicRaster(image)
          : getGeographicRaster(image);
        if (!geographicRaster) return;
        const worldCopies = getEarthWorldCopies(projection);
        japanOverlay.dataset.rasterWorldCopies = worldCopies
          .map((copy) => copy.x.toFixed(2))
          .join(",");
        ctx.globalAlpha = alpha;
        for (const copy of worldCopies) {
          ctx.drawImage(geographicRaster, copy.x, copy.y, copy.width, copy.height);
        }
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
    const drawNightLightsLayer = (image, dimmed) => {
      if (!image.complete || !image.naturalWidth) {
        japanOverlay.dataset.nightLightsLayer = "loading";
        return;
      }
      japanOverlay.dataset.nightLightsLayer = dimmed ? "dimmed" : "visible";
      japanOverlay.dataset.nightLightsSource = "NASA-VIIRS-2016";
      japanOverlay.dataset.nightLightsProjection = "web-mercator-to-geographic";
      japanOverlay.dataset.nightLightsDisplay = "glow-plus-radiance-core";

      ctx.save();
      ctx.filter = "brightness(3.4) contrast(1.25) blur(2.6px)";
      drawGlobalRaster(image, dimmed ? 0.015 : 0.78);
      ctx.restore();

      ctx.save();
      ctx.filter = "brightness(2.7) contrast(1.45)";
      drawGlobalRaster(image, dimmed ? 0.03 : 1);
      ctx.restore();
    };

    ctx.save();
    ctx.globalCompositeOperation = "screen";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    if (signalMode.id === "breathing-earth") {
      const state = getBreathingEarthState(signalMode);
      renderGosatHeatmap(ctx, rect, left, top, state);
      japanOverlay.dataset.auroraForecast = ovationAuroraState.status;
      japanOverlay.dataset.auroraForecastSource = ovationAuroraState.source;
      japanOverlay.dataset.auroraForecastTime = ovationAuroraState.forecastTime;
      japanOverlay.dataset.auroraForecastPointCount = String(ovationAuroraState.pointCount);
      japanOverlay.dataset.auroraForecastMaximum = String(ovationAuroraState.maximum);
      if (ovationAuroraState.status === "ready") {
        const auroraBreath = reducedMotion ? 0.5 : 0.46 + Math.sin(time * 0.42) * 0.06;
        ctx.save();
        ctx.filter = "saturate(1.18) brightness(1.08)";
        ctx.globalCompositeOperation = "source-over";
        drawGlobalRaster(ovationAuroraCanvas, auroraBreath);
        ctx.globalCompositeOperation = "screen";
        drawGlobalRaster(ovationAuroraCanvas, auroraBreath * 0.58);
        ctx.restore();
      }
      ctx.textAlign = "left";
    } else if (signalMode.id === "blue-circulation") {
      const state = getBlueCirculationState(signalMode);
      const longitudeCopies = [0];
      const pulse = reducedMotion ? 0.68 : 0.62 + Math.sin(time * 1.15) * 0.12;
      const arrowStride = rect.width <= 720 ? 6 : 5;
      let currentVisiblePoiCount = 0;
      let currentPoiMarkerCount = 0;
      japanOverlay.dataset.currentVisualLanguage = "calligraphic-current-brush";
      japanOverlay.dataset.currentArrowStride = String(arrowStride);

      for (const [currentIndex, row] of (state?.currents || []).entries()) {
        const speed = Math.hypot(row.uMs, row.vMs);
        if (speed < 0.001) continue;
        const reveal = getMapPlotReveal(currentIndex, state.currents.length, now);
        if (reveal.progress <= 0) continue;
        const destination = getAdvectedCurrentPosition(row, state.horizonHours);
        for (const longitudeCopy of longitudeCopies) {
          const point = pointFor({ lon: row.lon + longitudeCopy, lat: row.lat });
          if (!visible(point, 80)) continue;
          currentVisiblePoiCount += 1;
          ctx.save();
          applyMapPlotReveal(ctx, point, reveal);
          const end = pointFor({ lon: destination.lon + longitudeCopy, lat: destination.lat });
          const speedUnit = clamp(speed / 1.5, 0, 1);
          const directionX = row.uMs / speed;
          const directionY = -row.vMs / speed;
          const normalX = -directionY;
          const normalY = directionX;
          const strandLength = 18 + speedUnit * 28;
          const bend = Math.sin(row.lon * 0.17 + row.lat * 0.11 + time * 0.2) * (3 + speedUnit * 6);
          const strandStart = {
            x: point.x - directionX * strandLength * 0.56,
            y: point.y - directionY * strandLength * 0.56,
          };
          const strandEnd = {
            x: point.x + directionX * strandLength * 0.44,
            y: point.y + directionY * strandLength * 0.44,
          };
          const strandControl = {
            x: point.x + normalX * bend,
            y: point.y + normalY * bend,
          };

          ctx.beginPath();
          ctx.moveTo(strandStart.x, strandStart.y);
          ctx.quadraticCurveTo(strandControl.x, strandControl.y, strandEnd.x, strandEnd.y);
          ctx.strokeStyle = getCurrentSpeedColor(speed, 0.035 + speedUnit * 0.045);
          ctx.lineWidth = 3 + speedUnit * 2.5;
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(strandStart.x, strandStart.y);
          ctx.quadraticCurveTo(strandControl.x, strandControl.y, strandEnd.x, strandEnd.y);
          ctx.strokeStyle = getCurrentSpeedColor(speed, 0.12 + speedUnit * 0.12);
          ctx.lineWidth = 0.5 + speedUnit * 0.65;
          ctx.stroke();

          const pearlProgress = reducedMotion
            ? 0.58
            : (time * (0.055 + speedUnit * 0.04) + currentIndex * 0.173) % 1;
          const inversePearlProgress = 1 - pearlProgress;
          const pearlX = inversePearlProgress * inversePearlProgress * strandStart.x
            + 2 * inversePearlProgress * pearlProgress * strandControl.x
            + pearlProgress * pearlProgress * strandEnd.x;
          const pearlY = inversePearlProgress * inversePearlProgress * strandStart.y
            + 2 * inversePearlProgress * pearlProgress * strandControl.y
            + pearlProgress * pearlProgress * strandEnd.y;
          ctx.beginPath();
          ctx.arc(pearlX, pearlY, 0.8 + speedUnit * 1.15, 0, Math.PI * 2);
          ctx.fillStyle = getCurrentSpeedColor(speed, 0.26 + speedUnit * 0.2);
          ctx.fill();

          if (state.horizonHours > 0.25) {
            const distanceX = end.x - point.x;
            const distanceY = end.y - point.y;
            const distance = Math.hypot(distanceX, distanceY);
            const advectionBend = Math.min(38, distance * 0.18)
              * Math.sin(row.lon * 0.13 - row.lat * 0.09);
            const advectionControlX = (point.x + end.x) * 0.5 + normalX * advectionBend;
            const advectionControlY = (point.y + end.y) * 0.5 + normalY * advectionBend;
            ctx.beginPath();
            ctx.moveTo(point.x, point.y);
            ctx.quadraticCurveTo(advectionControlX, advectionControlY, end.x, end.y);
            ctx.strokeStyle = getCurrentSpeedColor(speed, 0.2 + speedUnit * 0.42);
            ctx.lineWidth = 0.65 + speedUnit * 1.25;
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(end.x, end.y, 1.25 + speed * 0.8, 0, Math.PI * 2);
            ctx.fillStyle = getCurrentSpeedColor(speed, pulse);
            ctx.fill();
          }
          if (currentIndex % arrowStride === 0 || speed >= 0.9) {
            drawVectorArrow(
              ctx,
              point.x,
              point.y,
              row.uMs,
              row.vMs,
              getCurrentSpeedColor(speed, 0.25 + speedUnit * 0.2),
              20,
            );
          }
          const markerRadius = 3.4 + speedUnit * 2.8;
          const markerPulse = reducedMotion ? 1 : 1 + Math.sin(time * 1.6 + currentIndex * 0.73) * 0.08;
          const markerGlow = ctx.createRadialGradient(
            point.x,
            point.y,
            0,
            point.x,
            point.y,
            markerRadius * 3.2,
          );
          markerGlow.addColorStop(0, getCurrentSpeedColor(speed, 0.98));
          markerGlow.addColorStop(0.34, getCurrentSpeedColor(speed, 0.48));
          markerGlow.addColorStop(1, getCurrentSpeedColor(speed, 0));
          ctx.beginPath();
          ctx.arc(point.x, point.y, markerRadius * 3.2 * markerPulse, 0, Math.PI * 2);
          ctx.fillStyle = markerGlow;
          ctx.fill();
          ctx.beginPath();
          ctx.arc(point.x, point.y, markerRadius * markerPulse, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(3,20,34,.9)";
          ctx.fill();
          ctx.strokeStyle = getCurrentSpeedColor(speed, 0.96);
          ctx.lineWidth = 1.25;
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(point.x, point.y, Math.max(1.2, markerRadius * 0.32), 0, Math.PI * 2);
          ctx.fillStyle = "rgba(234,255,255,.98)";
          ctx.fill();
          currentPoiMarkerCount += 1;
          ctx.restore();
        }
      }
      japanOverlay.dataset.currentVisiblePoiCount = String(currentVisiblePoiCount);
      japanOverlay.dataset.currentPoiMarkerCount = String(currentPoiMarkerCount);
      japanOverlay.dataset.currentPoiMarkerStyle = "luminous-ring-above-data-brush";
      for (const [windIndex, row] of (signalMode.signals.climate || []).entries()) {
        if (!Number.isFinite(row.windSpeedMs)) continue;
        if (windIndex % (rect.width <= 720 ? 8 : 7) !== 0) continue;
        const reveal = getMapPlotReveal(windIndex, signalMode.signals.climate.length, now);
        if (reveal.progress <= 0) continue;
        for (const longitudeCopy of longitudeCopies) {
          const point = pointFor({ lon: row.lon + longitudeCopy, lat: row.lat });
          if (!visible(point)) continue;
          ctx.save();
          applyMapPlotReveal(ctx, point, reveal);
          const angle = ((row.windDirectionDeg || 0) - 90) * (Math.PI / 180);
          drawVectorArrow(
            ctx,
            point.x,
            point.y,
            Math.cos(angle) * row.windSpeedMs,
            -Math.sin(angle) * row.windSpeedMs,
            "rgba(235,250,255,.15)",
            2.8,
          );
          ctx.restore();
        }
      }
    } else if (signalMode.id === "forest-cloud-engine") {
      const sequence = getMapSequenceState(signalMode);
      const precipitationRows = signalMode.signals.precipitation || [];
      const visibleRainIndexes = precipitationRows
        .map((row, index) => ({ index, point: pointFor(row) }))
        .filter(({ point }) => visible(point))
        .map(({ index }) => index);
      const rainRevealOrder = new Map(visibleRainIndexes.map((index, order) => [index, order]));
      const brazilRain = precipitationRows.find((row) => row.id === "brazil");
      japanOverlay.dataset.forestRainCircleRange = `${FOREST_RAIN_MIN_RADIUS}-${FOREST_RAIN_MAX_RADIUS}px radius`;
      japanOverlay.dataset.forestRainBrazil = brazilRain
        ? `${brazilRain.precipitationMmDay.toFixed(2)} mm/day`
        : "missing";
      drawGlobalRaster(landCoverImage, 0.5, { forestOnly: true });
      const drawRainCircle = (row, index) => {
        const point = pointFor(row);
        if (!visible(point)) return;
        const reveal = getMapPlotReveal(
          rainRevealOrder.get(index) ?? index,
          Math.max(1, visibleRainIndexes.length),
          now,
        );
        if (reveal.progress <= 0) return;
        const precipitationMmDay = Number(row.precipitationMmDay) || 0;
        const rain = clamp(precipitationMmDay / FOREST_RAIN_REFERENCE_MAX_MM_DAY, 0, 1);
        const radius = getForestRainRadius(precipitationMmDay);
        const selected = index === sequence?.selectedIndex;
        ctx.save();
        applyMapPlotReveal(ctx, point, reveal);
        ctx.beginPath();
        ctx.arc(point.x, point.y, radius + 4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,18,35,${selected ? 0.82 : 0.62})`;
        ctx.fill();

        const fill = ctx.createRadialGradient(
          point.x - radius * 0.24,
          point.y - radius * 0.28,
          Math.max(2, radius * 0.08),
          point.x,
          point.y,
          radius,
        );
        fill.addColorStop(0, `rgba(226,252,255,${selected ? 0.98 : 0.9})`);
        fill.addColorStop(0.18, `rgba(91,218,255,${selected ? 0.9 : 0.78})`);
        fill.addColorStop(1, `rgba(25,125,255,${selected ? 0.52 : 0.3 + rain * 0.25})`);
        ctx.beginPath();
        ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = fill;
        ctx.fill();
        ctx.strokeStyle = selected ? "rgba(222,251,255,.98)" : "rgba(151,225,255,.82)";
        ctx.lineWidth = selected ? 2.4 : 1.4;
        ctx.stroke();

        if (selected) {
          ctx.beginPath();
          ctx.arc(point.x, point.y, radius + 10 + Math.sin(time * 2.2) * 3, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(153,220,255,.88)";
          ctx.lineWidth = 1.8;
          ctx.stroke();
        }

        if (selected || precipitationMmDay >= 3.5) {
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.shadowColor = "rgba(0,10,24,.96)";
          ctx.shadowBlur = 7;
          ctx.fillStyle = "rgba(240,253,255,.98)";
          ctx.font = `700 ${selected ? 11 : 10}px Consolas, "Courier New", monospace`;
          ctx.fillText(precipitationMmDay.toFixed(1), point.x, point.y - 4);
          ctx.font = '700 7px Consolas, "Courier New", monospace';
          ctx.fillText(row.id === "brazil" ? "BRA / AMAZON" : row.iso3 || "RAIN", point.x, point.y + 8);
        } else {
          ctx.beginPath();
          ctx.arc(point.x, point.y, 2.6, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(236,253,255,.94)";
          ctx.fill();
        }
        ctx.restore();

        if (selected) {
          drawSelectionLabel(
            point,
            getForestRainSiteName(row),
            `${row.precipitationMmDay?.toFixed(2) || "—"} mm/day · NASA POWER`,
            "rgba(151,220,255,.96)",
          );
        }
      };
      precipitationRows.forEach((row, index) => {
        if (index !== sequence?.selectedIndex) drawRainCircle(row, index);
      });
      if (sequence?.selected) drawRainCircle(sequence.selected, sequence.selectedIndex);
    } else if (signalMode.id === "pollination-protocol") {
      const sequence = getMapSequenceState(signalMode);
      const records = getModeDataPois();
      const stageKey = sequence?.stageKey || "records";
      const relations = sequence?.relations || [];
      japanOverlay.dataset.pollinationStage = stageKey;
      japanOverlay.dataset.pollinationOccurrenceCount = String(records.length);
      japanOverlay.dataset.pollinationRelationCount = String(relations.length);
      japanOverlay.dataset.pollinationSampling = "max-2-per-country";
      const points = records.map((row, index) => ({ row, index, point: pointFor(row) }));

      if (stageKey === "sampling") {
        const byCountry = new Map();
        points.forEach((entry) => {
          const key = entry.row.countryCode || entry.row.country || "unknown";
          const group = byCountry.get(key) || [];
          group.push(entry);
          byCountry.set(key, group);
        });
        ctx.save();
        ctx.setLineDash([4, 5]);
        byCountry.forEach((group) => {
          if (group.length < 2 || !visible(group[0].point) || !visible(group[1].point)) return;
          ctx.beginPath();
          ctx.moveTo(group[0].point.x, group[0].point.y);
          ctx.lineTo(group[1].point.x, group[1].point.y);
          ctx.strokeStyle = "rgba(255,210,112,.48)";
          ctx.lineWidth = 1.2;
          ctx.stroke();
        });
        ctx.restore();
      }

      const activeRecordIndex = records.length
        ? Math.floor(time * 0.72) % records.length
        : -1;
      points.forEach(({ row, index, point }) => {
        if (!visible(point)) return;
        const reveal = getMapPlotReveal(index, points.length, now);
        if (reveal.progress <= 0) return;
        const active = stageKey === "records" && index === activeRecordIndex;
        const radius = stageKey === "sampling" ? 4.2 : active ? 4.8 : 2.4;
        ctx.save();
        applyMapPlotReveal(ctx, point, reveal);
        ctx.beginPath();
        ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = stageKey === "relations"
          ? "rgba(255,219,109,.16)"
          : active
            ? "rgba(255,247,190,.98)"
            : "rgba(255,219,109,.8)";
        ctx.fill();
        if (stageKey === "sampling") {
          ctx.strokeStyle = "rgba(255,245,192,.86)";
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
        if (active) {
          for (let ring = 0; ring < 3; ring += 1) {
            ctx.beginPath();
            ctx.arc(point.x, point.y, 12 + ring * 8 + Math.sin(time * 2 + ring) * 2, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(255,${210 - ring * 18},112,${0.58 - ring * 0.13})`;
            ctx.stroke();
          }
        }
        ctx.restore();
        if (active) {
          drawSelectionLabel(
            point,
            `${row.country || "観察地域不明"}の一件の記録`,
            `${row.species || "Apis"} · ${row.eventDate?.slice(0, 10) || "DATE UNKNOWN"}`,
            "rgba(255,223,112,.96)",
          );
        }
      });

      const drawEvidencePanel = (code, title, copy) => {
        if (rect.width < 760) return;
        const width = Math.min(430, rect.width * 0.34);
        const x = clamp(rect.width * 0.62 - width / 2, 24, rect.width - width - 24);
        const y = Math.max(94, rect.height * 0.15);
        ctx.save();
        ctx.textAlign = "left";
        ctx.textBaseline = "alphabetic";
        ctx.fillStyle = "rgba(2,15,24,.88)";
        ctx.fillRect(x, y, width, 88);
        ctx.strokeStyle = "rgba(255,211,112,.42)";
        ctx.strokeRect(x, y, width, 88);
        ctx.fillStyle = "rgba(255,220,126,.9)";
        ctx.font = '700 8px Consolas, "Courier New", monospace';
        ctx.fillText(code, x + 16, y + 20);
        ctx.fillStyle = "rgba(246,252,247,.96)";
        ctx.font = '600 16px "Noto Sans JP", sans-serif';
        ctx.fillText(title, x + 16, y + 46, width - 32);
        ctx.fillStyle = "rgba(218,235,232,.68)";
        ctx.font = '10px "Noto Sans JP", sans-serif';
        ctx.fillText(copy, x + 16, y + 69, width - 32);
        ctx.restore();
      };

      if (stageKey === "records") {
        drawEvidencePanel(
          "STEP 1 / POINT ≠ HABITAT",
          "点は、ミツバチではなく観察記録",
          `${records.length}件のGBIF記録。空白は「いない場所」を意味しません。`,
        );
      } else if (stageKey === "sampling") {
        drawEvidencePanel(
          "STEP 2 / SAMPLING LIMIT",
          "各国から最大2件に揃えた標本",
          "線で結ばれた二点は同じ国。点の数では生息数を比較できません。",
        );
      } else if (stageKey === "relations" && relations.length) {
        const centerX = rect.width * (rect.width >= 1000 ? 0.64 : 0.56);
        const centerY = rect.height * 0.47;
        const networkRadius = Math.min(190, Math.max(100, Math.min(rect.width * 0.15, rect.height * 0.21)));
        const activeRelationIndex = Math.floor(time * 0.45) % relations.length;
        const rotation = reducedMotion ? -Math.PI / 2 : time * 0.025;
        let activeNode = null;
        ctx.save();
        ctx.globalCompositeOperation = "source-over";
        relations.forEach((relation, index) => {
          const angle = rotation + (index / relations.length) * Math.PI * 2;
          const radius = networkRadius * (0.78 + (index % 3) * 0.1);
          const x = centerX + Math.cos(angle) * radius;
          const y = centerY + Math.sin(angle) * radius;
          const active = index === activeRelationIndex;
          ctx.beginPath();
          ctx.moveTo(centerX, centerY);
          ctx.lineTo(x, y);
          ctx.strokeStyle = active ? "rgba(255,226,120,.92)" : "rgba(139,232,178,.24)";
          ctx.lineWidth = active ? 2.2 : 0.9;
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(x, y, active ? 7 : 3.5, 0, Math.PI * 2);
          ctx.fillStyle = active ? "rgba(255,230,134,.98)" : "rgba(118,235,173,.78)";
          ctx.fill();
          if (active) activeNode = { x, y, relation };
        });
        ctx.beginPath();
        ctx.arc(centerX, centerY, 34, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(24,34,25,.95)";
        ctx.fill();
        ctx.strokeStyle = "rgba(255,221,116,.92)";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.textAlign = "center";
        ctx.fillStyle = "rgba(255,231,146,.98)";
        ctx.font = '700 10px Consolas, "Courier New", monospace';
        ctx.fillText("Apis", centerX, centerY - 3);
        ctx.fillStyle = "rgba(235,246,226,.82)";
        ctx.font = '8px Consolas, "Courier New", monospace';
        ctx.fillText("mellifera", centerX, centerY + 11);
        ctx.fillStyle = "rgba(255,220,118,.92)";
        ctx.font = '700 9px Consolas, "Courier New", monospace';
        ctx.fillText("NON-GEOGRAPHIC / GloBI RELATION NETWORK", centerX, centerY - networkRadius - 28);
        ctx.fillStyle = "rgba(218,236,224,.66)";
        ctx.font = '9px "Noto Sans JP", sans-serif';
        ctx.fillText("枝の位置・長さは、場所・頻度・強さを表しません", centerX, centerY - networkRadius - 12);
        if (activeNode) {
          const labelWidth = Math.min(360, rect.width - 40);
          const labelX = clamp(centerX - labelWidth / 2, 20, rect.width - labelWidth - 20);
          const labelY = Math.min(rect.height - 72, centerY + networkRadius + 18);
          ctx.fillStyle = "rgba(2,15,20,.9)";
          ctx.fillRect(labelX, labelY, labelWidth, 48);
          ctx.strokeStyle = "rgba(142,236,179,.42)";
          ctx.strokeRect(labelX, labelY, labelWidth, 48);
          ctx.fillStyle = "rgba(151,239,185,.9)";
          ctx.font = '700 8px Consolas, "Courier New", monospace';
          ctx.fillText(`POLLINATES / ${activeRelationIndex + 1} OF ${relations.length}`, centerX, labelY + 17);
          ctx.fillStyle = "rgba(242,250,236,.96)";
          ctx.font = '600 12px "Noto Sans JP", sans-serif';
          ctx.fillText(activeNode.relation.targetTaxon, centerX, labelY + 35, labelWidth - 24);
        }
        ctx.restore();
      }
    } else if (signalMode.id === "nothing-is-waste") {
      const sequence = getMapSequenceState(signalMode);
      const rows = signalMode.signals.countryWaste || [];
      const selectedIndex = sequence?.selectedIndex ?? 0;
      const orderedRows = rows
        .map((row, index) => ({ row, index }))
        .sort((a, b) => Number(a.index === selectedIndex) - Number(b.index === selectedIndex));
      const officialCount = rows.filter((row) => row.valueStatus !== "IMPUTED").length;
      const baseRadius = clamp(rect.width / 78, 20, 29);
      const selectedRadius = clamp(rect.width / 34, 46, 62);
      japanOverlay.dataset.recyclingEncoding = "fixed-diameter-pie";
      japanOverlay.dataset.recyclingPieCount = String(rows.length);
      japanOverlay.dataset.recyclingOfficialCount = String(officialCount);
      japanOverlay.dataset.recyclingImputedCount = String(rows.length - officialCount);
      japanOverlay.dataset.recyclingSelectedRate = sequence?.sourceRecycle.toFixed(1) || "0.0";
      japanOverlay.dataset.recyclingSelectedIndex = String(selectedIndex);
      japanOverlay.dataset.recyclingSelectedStatus = sequence?.selected?.valueStatus === "IMPUTED" ? "imputed" : "official";
      ctx.save();
      ctx.globalCompositeOperation = "source-over";
      orderedRows.forEach(({ row, index }) => {
        const point = pointFor(row);
        if (!visible(point, selectedRadius + 20)) return;
        const reveal = getMapPlotReveal(index, rows.length, now);
        if (reveal.progress <= 0) return;
        const rate = clamp(row.recyclePercent / 100, 0, 1);
        const selected = index === selectedIndex;
        const imputed = row.valueStatus === "IMPUTED";
        const radius = selected ? selectedRadius : baseRadius;
        const startAngle = -Math.PI / 2;
        const endAngle = startAngle + rate * Math.PI * 2;

        ctx.save();
        applyMapPlotReveal(ctx, point, reveal);
        ctx.globalAlpha *= imputed && !selected ? 0.72 : 1;
        ctx.shadowColor = selected ? "rgba(118,255,194,.52)" : "rgba(34,224,153,.22)";
        ctx.shadowBlur = selected ? 22 : 8;
        ctx.beginPath();
        ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = selected ? "rgba(255,137,103,.92)" : "rgba(226,116,88,.78)";
        ctx.fill();

        if (rate > 0.0001) {
          ctx.beginPath();
          ctx.moveTo(point.x, point.y);
          ctx.arc(point.x, point.y, radius, startAngle, endAngle);
          ctx.closePath();
          ctx.fillStyle = selected ? "rgba(91,245,169,.98)" : "rgba(76,225,157,.9)";
          ctx.fill();
        }

        ctx.shadowBlur = 0;
        ctx.setLineDash(imputed ? [3, 3] : []);
        ctx.beginPath();
        ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
        ctx.strokeStyle = selected ? "rgba(238,255,247,.98)" : "rgba(202,255,230,.78)";
        ctx.lineWidth = selected ? 2.4 : 1.4;
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.beginPath();
        ctx.arc(point.x, point.y, selected ? radius * 0.43 : radius * 0.34, 0, Math.PI * 2);
        ctx.fillStyle = selected ? "rgba(3,18,22,.94)" : "rgba(3,18,22,.82)";
        ctx.fill();

        if (selected || rect.width >= 900) {
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillStyle = "rgba(244,255,250,.98)";
          ctx.font = selected
            ? '700 15px Consolas, "Courier New", monospace'
            : '700 8px Consolas, "Courier New", monospace';
          ctx.fillText(`${Math.round(row.recyclePercent)}%`, point.x, point.y + (selected ? -1 : 0));
        }

        if (selected) {
          ctx.textBaseline = "alphabetic";
          drawSelectionLabel(
            { x: point.x + radius + 7, y: point.y },
            row.country,
            imputed
              ? `補完値 ${row.recyclePercent.toFixed(1)}% / 近隣5か国 ${row.donorIso3?.join("・") || "参照"}`
              : `国連公式値 ${row.recyclePercent.toFixed(1)}% / ${row.year || "報告年不明"}`,
            "rgba(138,255,202,.96)",
          );
        }
        ctx.restore();
      });
      ctx.restore();
    } else if (signalMode.id === "anthropocene-scar") {
      const sequence = getMapSequenceState(signalMode);
      const nightLightsDimmed = now < anthropocenePeelUntil;
      drawNightLightsLayer(nightLightsImage, nightLightsDimmed);
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      ctx.globalAlpha = nightLightsDimmed ? 1 : 0.88;
      renderCachedReferenceWorldModel(ctx, rect, left, top);
      ctx.restore();
      japanOverlay.dataset.nightLightsBoundaryOverlay = "coast-and-country";
      const emissionRows = sequence?.yearRows || [];
      const emissionRadii = emissionRows.map((row) => (
        getAnthropoceneEmissionRadius(row.emissionsMtCo2)
      ));
      japanOverlay.dataset.emissionsCircleCount = String(emissionRows.length);
      japanOverlay.dataset.emissionsVisibleCircleCount = String(
        emissionRadii.filter((radius) => radius >= ANTHROPOCENE_VISIBLE_RADIUS_PX).length,
      );
      japanOverlay.dataset.emissionsRadiusSum = emissionRadii
        .reduce((sum, radius) => sum + radius, 0)
        .toFixed(3);
      japanOverlay.dataset.emissionsMaximumRadius = Math.max(0, ...emissionRadii).toFixed(3);
      japanOverlay.dataset.emissionsTotalMtCo2 = Number(sequence?.totalMtCo2 || 0).toFixed(3);
      japanOverlay.dataset.emissionsSelectedCountryMtCo2 = Number(
        sequence?.selected?.emissionsMtCo2 || 0,
      ).toFixed(3);
      japanOverlay.dataset.emissionsScaleMtCo2 = String(ANTHROPOCENE_EMISSIONS_SCALE_MT);
      japanOverlay.dataset.emissionsEncoding = "country-total-fixed-sqrt-area";
      japanOverlay.dataset.emissionsSelectedYear = String(sequence?.selectedYear || "");
      japanOverlay.dataset.nightLightsReferenceYear = "2016";
      emissionRows.forEach((row, index) => {
        const point = pointFor(row);
        if (!visible(point)) return;
        const reveal = getMapPlotReveal(index, emissionRows.length, now);
        if (reveal.progress <= 0) return;
        ctx.save();
        applyMapPlotReveal(ctx, point, reveal);
        const load = getAnthropoceneEmissionUnit(row.emissionsMtCo2);
        const selected = row.iso3 === sequence?.selected?.iso3;
        const radius = getAnthropoceneEmissionRadius(row.emissionsMtCo2);
        ctx.beginPath();
        ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,57,42,${selected ? 0.3 : 0.08 + load * 0.34})`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255,104,70,${selected ? 0.98 : 0.28 + load * 0.68})`;
        ctx.lineWidth = selected ? 2.6 : 0.9 + load * 1.1;
        ctx.stroke();
        if (radius >= ANTHROPOCENE_VISIBLE_RADIUS_PX) {
          ctx.beginPath();
          ctx.arc(point.x, point.y, Math.max(1.5, radius * 0.23), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,196,151,${selected ? 0.92 : 0.3 + load * 0.5})`;
          ctx.fill();
        }
        if (selected) {
          ctx.beginPath();
          ctx.arc(point.x, point.y, radius + 9 + Math.sin(time * 2.2) * 3, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(255,143,103,.42)";
          ctx.stroke();
          drawSelectionLabel(
            { x: point.x + radius + 7, y: point.y },
            row.country,
            `${row.year} · FOSSIL CO₂ ${row.emissionsMtCo2.toFixed(1)} Mt · 点排出源ではない`,
            "rgba(255,151,126,.96)",
          );
        }
        ctx.restore();
      });
    } else if (signalMode.id === "rhythm-of-disaster") {
      const sequence = getMapSequenceState(signalMode);
      const selectedYear = sequence?.selectedYear || "";
      const yearEvents = sequence?.yearEvents || [];
      if (japanDataLayer === "history") {
        japanOverlay.dataset.earthquakeLayer = "japan-history";
      } else {
        const yearTransition = getEarthquakeYearTransition(selectedYear, yearEvents, now);
        const earthProjection = japanView.earthProjection || getEarthProjection(rect);
        const strongestMagnitude = sequence?.selected?.magnitude || GLOBAL_EARTHQUAKE_MIN_MAGNITUDE;
        const strongestImpactRadiusKm = getGlobalEarthquakeImpactRadiusKm(strongestMagnitude);
        const strongestDurationMs = getGlobalEarthquakeWaveDurationMs(strongestImpactRadiusKm);
        const waveProgress = yearTransition.eventReveals.reduce((maximum, reveal) => {
          const eventImpactRadiusKm = getGlobalEarthquakeImpactRadiusKm(reveal.event.magnitude);
          const eventDurationMs = getGlobalEarthquakeWaveDurationMs(eventImpactRadiusKm);
          return Math.max(maximum, clamp(reveal.waveElapsedMs / eventDurationMs, 0, 1));
        }, 0);
        const strongestImpactEllipse = getGlobalEarthquakeImpactEllipse(
          sequence?.selected || { latitude: 0 },
          strongestImpactRadiusKm,
          earthProjection,
        );
        japanOverlay.dataset.earthquakeLayer = "world-year";
        japanOverlay.dataset.earthquakeYear = selectedYear;
        japanOverlay.dataset.earthquakeYearEventCount = String(yearEvents.length);
        japanOverlay.dataset.earthquakeTotalEventCount = String(signalMode.signals.globalEvents?.length || 0);
        japanOverlay.dataset.earthquakeWaveSync = "chronological-sequential-distance-limited";
        japanOverlay.dataset.earthquakeWaveModel = "usgs-estimated-felt-radius";
        japanOverlay.dataset.earthquakeWaveProgress = waveProgress.toFixed(3);
        japanOverlay.dataset.earthquakeWaveRadiusMaxKm = strongestImpactRadiusKm.toFixed(0);
        japanOverlay.dataset.earthquakeWaveRadiusMaxPx = strongestImpactEllipse.y.toFixed(1);
        japanOverlay.dataset.earthquakeWaveRadiusMaxXPx = strongestImpactEllipse.x.toFixed(1);
        japanOverlay.dataset.earthquakeWaveDurationMaxMs = strongestDurationMs.toFixed(0);
        japanOverlay.dataset.earthquakeTimelinePlayback = "auto-loop";
        japanOverlay.dataset.earthquakeYearDwellMs = String(GLOBAL_EARTHQUAKE_YEAR_DWELL_MS);
        japanOverlay.dataset.earthquakeYearTransitionMode = "chronological-pop";
        japanOverlay.dataset.earthquakeYearTransitionMs = String(yearTransition.durationMs);
        japanOverlay.dataset.earthquakeYearTransitionProgress = yearTransition.progress.toFixed(3);
        japanOverlay.dataset.earthquakeYearTransitionTo = yearTransition.currentYear;
        japanOverlay.dataset.earthquakeRevealOrder = "occurred-at-ascending";
        japanOverlay.dataset.earthquakeOrderedEventTimes = yearTransition.currentEvents
          .map((event) => event.occurredAt || "")
          .join(",");
        japanOverlay.dataset.earthquakeEventStaggerMs = String(GLOBAL_EARTHQUAKE_EVENT_STAGGER_MS);
        japanOverlay.dataset.earthquakeEventAppearMs = String(GLOBAL_EARTHQUAKE_EVENT_APPEAR_MS);
        japanOverlay.dataset.earthquakeVisibleEventCount = String(yearTransition.visibleEventCount);
        japanOverlay.dataset.earthquakeActiveEventIndex = String(yearTransition.visibleEventCount - 1);
        japanOverlay.dataset.earthquakeActiveEventOccurredAt = yearTransition.activeEvent?.occurredAt || "";
        japanOverlay.dataset.earthquakeActiveEventProgress = (yearTransition.activeReveal?.progress || 0).toFixed(3);
        japanOverlay.dataset.earthquakeSelectionLabelWidthPx = "0";
        japanOverlay.dataset.earthquakeSelectionLabelHeightPx = "0";
        japanOverlay.dataset.earthquakeSelectionPrimaryFontPx = "0";

        const drawEarthquakeEvent = (event, {
          reveal = null,
          strongest = false,
        } = {}) => {
          if (reveal && reveal.progress <= 0) return;
          const point = pointFor({ lon: event.longitude, lat: event.latitude });
          const magnitudeScale = clamp(
            (event.magnitude - GLOBAL_EARTHQUAKE_MIN_MAGNITUDE) /
              (GLOBAL_EARTHQUAKE_MAX_MAGNITUDE - GLOBAL_EARTHQUAKE_MIN_MAGNITUDE),
            0,
            1,
          );
          const impactRadiusKm = getGlobalEarthquakeImpactRadiusKm(event.magnitude);
          const eventDurationMs = getGlobalEarthquakeWaveDurationMs(impactRadiusKm);
          const eventProgress = reducedMotion
            ? 1
            : clamp((reveal?.waveElapsedMs || 0) / eventDurationMs, 0, 1);
          const easedProgress = eventProgress * eventProgress * (3 - 2 * eventProgress);
          const targetEllipse = getGlobalEarthquakeImpactEllipse(event, impactRadiusKm, earthProjection);
          const radiusX = targetEllipse.x * easedProgress;
          const radiusY = targetEllipse.y * easedProgress;
          const waveOpacity = 0.88 - eventProgress * 0.56;
          if (!visible(point, Math.max(targetEllipse.x, targetEllipse.y) + 12)) return;

          const appearance = reveal?.alpha ?? 1;
          const scale = reveal?.scale ?? 1;
          ctx.save();
          ctx.globalAlpha *= clamp(appearance, 0, 1);
          ctx.translate(point.x, point.y);
          ctx.scale(scale, scale);
          ctx.translate(-point.x, -point.y);

          if (radiusX > 2 && radiusY > 2) {
            [1, 0.72, 0.44].forEach((ringScale, ringIndex) => {
              ctx.beginPath();
              ctx.ellipse(
                point.x,
                point.y,
                radiusX * ringScale,
                radiusY * ringScale,
                0,
                0,
                Math.PI * 2,
              );
              ctx.strokeStyle = ringIndex === 0
                ? `rgba(255,177,86,${waveOpacity * (strongest ? 0.96 : 0.72)})`
                : `rgba(255,116,76,${waveOpacity * (ringIndex === 1 ? 0.38 : 0.2)})`;
              ctx.lineWidth = ringIndex === 0 ? 1.4 + magnitudeScale * 1.8 : 0.8 + magnitudeScale;
              ctx.stroke();
            });
          }

          const sourceRadius = strongest
            ? 7 + magnitudeScale * 9
            : 4.5 + magnitudeScale * 5.5;
          const popStrength = reveal && reveal.progress < 1
            ? Math.sin(reveal.progress * Math.PI)
            : 0;
          if (popStrength > 0.01) {
            ctx.save();
            ctx.shadowColor = "rgba(255,198,104,.94)";
            ctx.shadowBlur = 12 + popStrength * 14;
            ctx.beginPath();
            ctx.arc(
              point.x,
              point.y,
              sourceRadius + 4 + reveal.progress * (10 + magnitudeScale * 8),
              0,
              Math.PI * 2,
            );
            ctx.strokeStyle = `rgba(255,218,139,${popStrength * 0.72})`;
            ctx.lineWidth = 1.4 + popStrength * 1.8;
            ctx.stroke();
            ctx.restore();
          }
          ctx.beginPath();
          ctx.arc(point.x, point.y, sourceRadius, 0, Math.PI * 2);
          ctx.fillStyle = strongest ? "rgba(255,232,151,.98)" : "rgba(255,151,89,.9)";
          ctx.fill();
          ctx.beginPath();
          ctx.arc(point.x, point.y, sourceRadius + 7 + Math.sin(time * 3 + magnitudeScale) * 2, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(255,197,108,${0.22 + magnitudeScale * 0.24})`;
          ctx.lineWidth = 1;
          ctx.stroke();

          ctx.fillStyle = "rgba(255,224,173,.88)";
          ctx.font = `700 ${strongest ? 11 : 9}px Consolas, "Courier New", monospace`;
          ctx.fillText(`M${event.magnitude.toFixed(1)}`, point.x + sourceRadius + 5, point.y - 5);
          ctx.restore();
        };

        yearTransition.eventReveals.forEach((reveal) => drawEarthquakeEvent(reveal.event, {
          reveal,
          strongest: reveal.event.id === sequence?.selected?.id,
        }));

        const strongest = sequence?.selected;
        const strongestReveal = yearTransition.eventReveals.find(({ event }) => event.id === strongest?.id);
        if (strongest && strongestReveal?.progress > 0.42) {
          ctx.save();
          ctx.globalAlpha *= clamp((strongestReveal.progress - 0.42) / 0.58, 0, 1);
          const point = pointFor({ lon: strongest.longitude, lat: strongest.latitude });
          if (visible(point, 80)) {
            const labelBounds = drawSelectionLabel(
              { x: point.x + 14, y: point.y },
              `${selectedYear} / ${yearEvents.length} EVENTS`,
              `MAX M${strongest.magnitude.toFixed(1)} · 推定可感半径 約${strongestImpactRadiusKm.toLocaleString("ja-JP")} km`,
              "rgba(255,203,126,.96)",
              { prominent: true },
            );
            japanOverlay.dataset.earthquakeSelectionLabelWidthPx = labelBounds.width.toFixed(1);
            japanOverlay.dataset.earthquakeSelectionLabelHeightPx = labelBounds.height.toFixed(1);
            japanOverlay.dataset.earthquakeSelectionPrimaryFontPx = String(labelBounds.primaryFontPx);
          }
          ctx.restore();
        }
      }
      ctx.fillStyle = "rgba(255,190,108,.74)";
      ctx.font = '8px Consolas, "Courier New", monospace';
      ctx.fillText("USGS YEARLY M7.5+ / ESTIMATED FELT RADIUS / JMA DETAIL IS A SEPARATE LAYER", 22, rect.height - 26);
    } else if (signalMode.id === "three-ecologies") {
      const state = getMapSequenceState(signalMode);
      const rows = state?.rows || [];
      const selected = state?.selected;
      const selectionTransition = getEcologiesSelectionTransition(rows, selected, now);
      const currentSelectionWeight = selectionTransition.previousIso3 ? selectionTransition.progress : 1;
      const previousSelectionWeight = selectionTransition.previousIso3 ? 1 - selectionTransition.progress : 0;
      drawGlobalRaster(landCoverImage, 0.16, { forestOnly: true });
      japanOverlay.dataset.ecologiesPlot = "paired-country-scatter";
      japanOverlay.dataset.ecologiesPairCount = String(rows.length);
      japanOverlay.dataset.ecologiesCorrelation = Number.isFinite(state?.correlation)
        ? state.correlation.toFixed(3)
        : "";
      japanOverlay.dataset.ecologiesSelectedCountry = selected?.country || "";
      japanOverlay.dataset.ecologiesCultureCount = String(signalMode.signals.culture?.length || 0);
      japanOverlay.dataset.ecologiesCountryDisplayMs = String(Math.round(ECOLOGIES_SEQUENCE_DURATION_MS / Math.max(1, rows.length)));
      japanOverlay.dataset.ecologiesSelectionTransitionMs = String(ECOLOGIES_SELECTION_TRANSITION_MS);
      japanOverlay.dataset.ecologiesSelectionTransitionProgress = selectionTransition.progress.toFixed(3);

      (signalMode.signals.culture || []).forEach((row, index) => {
        const point = pointFor(row);
        if (!visible(point)) return;
        const pulse = reducedMotion ? 0 : Math.sin(time * 1.15 + index) * 1.5;
        ctx.save();
        ctx.translate(point.x, point.y);
        ctx.rotate(Math.PI / 4);
        ctx.fillStyle = "rgba(214,145,255,.74)";
        ctx.fillRect(-3.5, -3.5, 7, 7);
        ctx.strokeStyle = "rgba(231,190,255,.46)";
        ctx.lineWidth = 1;
        ctx.strokeRect(-8 - pulse, -8 - pulse, 16 + pulse * 2, 16 + pulse * 2);
        ctx.restore();
      });

      rows.forEach((row) => {
        const point = pointFor(row);
        if (!visible(point)) return;
        const selectionWeight = row.iso3 === selectionTransition.currentIso3
          ? currentSelectionWeight
          : row.iso3 === selectionTransition.previousIso3
            ? previousSelectionWeight
            : 0;
        const outerRadius = 12 + selectionWeight * 10;
        const innerRadius = 7 + selectionWeight * 8;
        const start = -Math.PI / 2;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.arc(point.x, point.y, outerRadius, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(86,181,255,.12)";
        ctx.lineWidth = 3 + selectionWeight * 2;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(point.x, point.y, outerRadius, start, start + Math.PI * 2 * clamp(row.urbanPercent / 100, 0, 1));
        ctx.strokeStyle = `rgba(92,203,255,${0.72 + selectionWeight * 0.26})`;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(point.x, point.y, innerRadius, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(92,242,145,.12)";
        ctx.lineWidth = 3 + selectionWeight * 2;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(point.x, point.y, innerRadius, start, start + Math.PI * 2 * clamp(row.forestPercent / 100, 0, 1));
        ctx.strokeStyle = `rgba(104,255,164,${0.72 + selectionWeight * 0.26})`;
        ctx.stroke();
        const residualStrength = clamp(Math.abs(row.residualPercent) / 35, 0.15, 1);
        ctx.beginPath();
        ctx.arc(point.x, point.y, 2.5 + selectionWeight * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = row.residualPercent >= 0
          ? `rgba(122,255,174,${0.28 + residualStrength * 0.62})`
          : `rgba(255,174,112,${0.28 + residualStrength * 0.62})`;
        ctx.fill();
        ctx.lineCap = "butt";
      });

      const drawEcologiesSelectionLabel = (row, alpha, outgoing = false) => {
        if (!row || alpha <= 0.01) return;
        const point = pointFor(row);
        if (!visible(point)) return;
        drawSelectionLabel(
          { x: point.x + 26, y: point.y },
          `${row.country} / FOREST ${row.forestPercent.toFixed(1)}%`,
          `URBAN ${row.urbanPercent.toFixed(1)}% · 回帰線との差 ${row.residualPercent >= 0 ? "+" : ""}${row.residualPercent.toFixed(1)}pt`,
          "rgba(216,255,232,.98)",
          {
            alpha,
            offsetY: outgoing ? -8 * (1 - alpha) : 10 * (1 - alpha),
            scale: outgoing ? 0.98 + alpha * 0.02 : 0.97 + alpha * 0.03,
          },
        );
      };
      drawEcologiesSelectionLabel(selectionTransition.previous, previousSelectionWeight, true);
      drawEcologiesSelectionLabel(selectionTransition.current, currentSelectionWeight);

      if (state && rows.length) {
        const compact = rect.width < 680;
        const chartWidth = Math.min(compact ? rect.width - 28 : 360, rect.width * 0.46);
        const chartHeight = compact ? 190 : 250;
        const chartX = compact ? 14 : rect.width - chartWidth - 30;
        const chartBaseY = compact ? Math.max(150, rect.height - chartHeight - 112) : 56;
        const chartY = getLegendSafePanelY(chartX, chartWidth, chartBaseY);
        recordAuxiliaryPanel("three-ecologies-scatter", chartX, chartY, chartWidth, chartHeight);
        const padding = { left: 42, right: 18, top: 48, bottom: 34 };
        const plotLeft = chartX + padding.left;
        const plotRight = chartX + chartWidth - padding.right;
        const plotTop = chartY + padding.top;
        const plotBottom = chartY + chartHeight - padding.bottom;
        const plotX = (value) => plotLeft + clamp(value / 100, 0, 1) * (plotRight - plotLeft);
        const plotY = (value) => plotBottom - clamp(value / 100, 0, 1) * (plotBottom - plotTop);
        ctx.save();
        ctx.globalCompositeOperation = "source-over";
        ctx.fillStyle = "rgba(3,18,27,.88)";
        ctx.strokeStyle = "rgba(174,224,221,.28)";
        ctx.lineWidth = 1;
        ctx.fillRect(chartX, chartY, chartWidth, chartHeight);
        ctx.strokeRect(chartX + 0.5, chartY + 0.5, chartWidth - 1, chartHeight - 1);
        ctx.strokeStyle = "rgba(174,224,221,.2)";
        ctx.beginPath();
        ctx.moveTo(plotLeft, plotTop);
        ctx.lineTo(plotLeft, plotBottom);
        ctx.lineTo(plotRight, plotBottom);
        ctx.stroke();

        const forestAtZero = state.intercept;
        const forestAtHundred = state.intercept + state.slope * 100;
        ctx.beginPath();
        ctx.moveTo(plotX(0), plotY(forestAtZero));
        ctx.lineTo(plotX(100), plotY(forestAtHundred));
        ctx.strokeStyle = "rgba(241,245,212,.72)";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        rows.forEach((row) => {
          const isSelected = row.iso3 === selected?.iso3;
          ctx.beginPath();
          ctx.arc(plotX(row.urbanPercent), plotY(row.forestPercent), isSelected ? 5.5 : 2.7, 0, Math.PI * 2);
          ctx.fillStyle = isSelected ? "rgba(255,238,155,.98)" : "rgba(145,233,211,.7)";
          ctx.fill();
          if (isSelected) {
            ctx.fillStyle = "rgba(255,244,199,.95)";
            ctx.font = '600 8px Consolas, "Courier New", monospace';
            ctx.textAlign = "left";
            ctx.fillText(row.country.toUpperCase(), plotX(row.urbanPercent) + 8, plotY(row.forestPercent) - 7);
          }
        });

        ctx.fillStyle = "rgba(224,246,239,.96)";
        ctx.font = '600 12px "Noto Sans JP", sans-serif';
        ctx.textAlign = "left";
        ctx.fillText("森林率 × 都市人口率", chartX + 16, chartY + 20);
        ctx.fillStyle = "rgba(199,162,255,.96)";
        ctx.font = '600 10px Consolas, "Courier New", monospace';
        ctx.fillText(`r ${state.correlation.toFixed(2)} / ${state.correlationLabel}`, chartX + 16, chartY + 37);
        ctx.fillStyle = "rgba(143,219,203,.76)";
        ctx.font = '8px "Noto Sans JP", sans-serif';
        ctx.fillText("森林率 %", chartX + 8, plotTop - 8);
        ctx.textAlign = "right";
        ctx.fillText("都市人口率 % →", plotRight, chartY + chartHeight - 11);
        ctx.restore();
      }
    } else if (signalMode.id === "earth-organ") {
      const state = getMapSequenceState(signalMode);
      const rows = state?.rows || [];
      const selected = state?.selected;
      const filledCount = drawRenewableCountryChoropleth(ctx, rect, rows, selected?.iso3);
      japanOverlay.dataset.renewableCountryFillCount = String(filledCount);
      japanOverlay.dataset.renewableFillScale = "country-blue-0-100";
      japanOverlay.dataset.renewableSelectedCountry = selected?.country || "";
      japanOverlay.dataset.renewableSelectedPercent = Number.isFinite(selected?.renewablePercent)
        ? selected.renewablePercent.toFixed(1)
        : "";
      japanOverlay.dataset.energyConnectionRemoved = "true";
      japanOverlay.dataset.countryGeometryState = naturalEarthCountryState;

      if (selected) {
        const point = pointFor(selected);
        const potential = selected.potential;
        if (visible(point) && potential) {
          const solar = clamp((potential.solarKwhM2Day || 0) / 7, 0, 1);
          const radius = 18 + solar * 28;
          const pulse = 1 + Math.sin(now / 520) * 0.08;
          ctx.beginPath();
          ctx.arc(point.x, point.y, radius * pulse, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255,222,86,.12)";
          ctx.fill();
          ctx.strokeStyle = "rgba(255,236,126,.98)";
          ctx.lineWidth = 2.4;
          ctx.stroke();
          drawVectorArrow(
            ctx,
            point.x,
            point.y,
            potential.windSpeedMs || 0,
            0.12,
            "rgba(113,255,211,.96)",
            8,
          );
          drawSelectionLabel(
            { x: point.x + radius + 14, y: point.y - 5 },
            `${selected.country} / RENEWABLE ${selected.renewablePercent.toFixed(1)}%`,
            `SOLAR ${potential.solarKwhM2Day.toFixed(2)} · WIND ${potential.windSpeedMs.toFixed(2)}`,
            "rgba(224,255,249,.98)",
          );
        }
      }

      if (state) {
        const compact = rect.width < 680;
        const panelWidth = compact ? Math.min(180, rect.width - 28) : 330;
        const panelHeight = compact ? 92 : 104;
        const panelX = compact ? rect.width - panelWidth - 14 : rect.width - panelWidth - 30;
        const panelY = getLegendSafePanelY(panelX, panelWidth, compact ? 92 : 54);
        const gradientX = panelX + 16;
        const gradientY = panelY + (compact ? 48 : 54);
        const gradientWidth = panelWidth - 32;
        recordAuxiliaryPanel("earth-organ-scale", panelX, panelY, panelWidth, panelHeight);
        japanOverlay.dataset.energyPanelScreenLeft = (rect.left + panelX).toFixed(2);
        japanOverlay.dataset.energyPanelScreenTop = (rect.top + panelY).toFixed(2);
        japanOverlay.dataset.energyPanelScreenRight = (rect.left + panelX + panelWidth).toFixed(2);
        japanOverlay.dataset.energyPanelScreenBottom = (rect.top + panelY + panelHeight).toFixed(2);
        japanOverlay.dataset.energyPanelLegendClearance =
          japanOverlay.dataset.auxiliaryPanelLegendClearance;
        ctx.save();
        ctx.globalCompositeOperation = "source-over";
        ctx.fillStyle = "rgba(3,18,31,.9)";
        ctx.strokeStyle = "rgba(111,218,255,.38)";
        ctx.lineWidth = 1;
        ctx.fillRect(panelX, panelY, panelWidth, panelHeight);
        ctx.strokeRect(panelX + 0.5, panelY + 0.5, panelWidth - 1, panelHeight - 1);
        ctx.fillStyle = "rgba(222,249,255,.96)";
        ctx.font = '600 11px "Noto Sans JP", sans-serif';
        ctx.textAlign = "left";
        ctx.fillText("再生可能電力比率 / 国別", panelX + 16, panelY + 21);
        ctx.fillStyle = "rgba(139,229,255,.9)";
        ctx.font = '600 9px Consolas, "Courier New", monospace';
        ctx.fillText(`${selected?.country?.toUpperCase() || "—"}  ${selected?.renewablePercent?.toFixed(1) || "—"}%`, panelX + 16, panelY + 38);
        const gradient = ctx.createLinearGradient(gradientX, 0, gradientX + gradientWidth, 0);
        gradient.addColorStop(0, "rgb(14,72,150)");
        gradient.addColorStop(0.5, "rgb(30,151,203)");
        gradient.addColorStop(1, "rgb(46,230,255)");
        ctx.fillStyle = gradient;
        ctx.fillRect(gradientX, gradientY, gradientWidth, 12);
        const markerX = gradientX + clamp((selected?.renewablePercent || 0) / 100, 0, 1) * gradientWidth;
        ctx.fillStyle = "rgba(255,240,152,.98)";
        ctx.fillRect(markerX - 1.5, gradientY - 3, 3, 18);
        ctx.fillStyle = "rgba(180,225,238,.82)";
        ctx.font = '8px Consolas, "Courier New", monospace';
        ctx.textAlign = "left";
        ctx.fillText("0%", gradientX, gradientY + 27);
        ctx.textAlign = "center";
        ctx.fillText("50", gradientX + gradientWidth / 2, gradientY + 27);
        ctx.textAlign = "right";
        ctx.fillText("100%", gradientX + gradientWidth, gradientY + 27);
        ctx.restore();
      }
    } else if (signalMode.id === "population-tide") {
      const state = getMapSequenceState(signalMode);
      const rows = state?.yearRows || [];
      const selected = state?.selected;
      const maximumPopulation = Math.max(1, ...rows.map((row) => Number(row.population || 0)));
      const orderedRows = [...rows].sort((leftRow, rightRow) => {
        const leftSelected = leftRow.iso3 === selected?.iso3;
        const rightSelected = rightRow.iso3 === selected?.iso3;
        if (leftSelected !== rightSelected) return Number(leftSelected) - Number(rightSelected);
        return Number(rightRow.population || 0) - Number(leftRow.population || 0);
      });
      japanOverlay.dataset.populationCircleCount = String(rows.length);
      japanOverlay.dataset.populationSelectedYear = String(state?.selectedYear || "");
      japanOverlay.dataset.populationEncoding = "circle-area-proportional-to-population";
      japanOverlay.dataset.populationSampleTotal = String(state?.totalPopulation || 0);
      let visiblePopulationCircleCount = 0;
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      orderedRows.forEach((row, index) => {
        const point = pointFor(row);
        if (!visible(point, 64)) return;
        visiblePopulationCircleCount += 1;
        if (row.iso3 === selected?.iso3) {
          japanOverlay.dataset.populationSelectedScreenX = point.x.toFixed(2);
          japanOverlay.dataset.populationSelectedScreenY = point.y.toFixed(2);
        }
        const reveal = getMapPlotReveal(index, orderedRows.length, now);
        if (reveal.progress <= 0) return;
        const selectedRow = row.iso3 === selected?.iso3;
        const radius = 5 + Math.sqrt(Math.max(0, row.population) / maximumPopulation) * 42;
        const pulse = selectedRow && !reducedMotion ? 1 + Math.sin(time * 1.6) * 0.045 : 1;
        ctx.save();
        applyMapPlotReveal(ctx, point, reveal);
        const gradient = ctx.createRadialGradient(
          point.x - radius * 0.28,
          point.y - radius * 0.32,
          0,
          point.x,
          point.y,
          radius * pulse,
        );
        gradient.addColorStop(0, selectedRow ? "rgba(255,251,214,1)" : "rgba(255,230,154,.84)");
        gradient.addColorStop(0.42, selectedRow ? "rgba(255,183,86,.68)" : "rgba(255,164,76,.38)");
        gradient.addColorStop(1, selectedRow ? "rgba(255,128,70,.06)" : "rgba(255,128,70,.025)");
        ctx.beginPath();
        ctx.arc(point.x, point.y, radius * pulse, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(point.x, point.y, radius * pulse, 0, Math.PI * 2);
        ctx.strokeStyle = selectedRow ? "rgba(255,238,183,.98)" : "rgba(255,194,111,.76)";
        ctx.lineWidth = selectedRow ? 2.2 : 1;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(point.x, point.y, selectedRow ? 4.8 : 2.6, 0, Math.PI * 2);
        ctx.fillStyle = selectedRow ? "rgba(255,255,224,.98)" : "rgba(255,210,128,.86)";
        ctx.fill();
        if (!selectedRow && rect.width >= 760 && row.population >= maximumPopulation * 0.12) {
          ctx.fillStyle = "rgba(255,246,209,.92)";
          ctx.font = '700 9px Consolas, "Courier New", monospace';
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(formatPopulationCompact(row.population), point.x, point.y - radius * 0.24);
        }
        if (selectedRow) {
          drawSelectionLabel(
            { x: point.x + radius + 8, y: point.y },
            `${row.country} / ${row.year}`,
            `${formatObservationNumber(row.population, 0)} 人 · 円の面積が人口に比例`,
            "rgba(255,230,170,.98)",
          );
        }
        ctx.restore();
      });
      ctx.restore();
      japanOverlay.dataset.populationVisibleCircleCount = String(visiblePopulationCircleCount);
    }

    const revealRows = getModeDataPois()
      .slice(0, 48)
      .map((row) => ({ row, point: pointFor(row) }))
      .filter(({ point }) => visible(point, 36));
    japanOverlay.dataset.plotRevealCount = String(revealRows.length);
    ctx.save();
    ctx.globalCompositeOperation = "screen";
    revealRows.forEach(({ point }, index) => {
      const reveal = getMapPlotReveal(index, revealRows.length, now);
      if (reveal.progress <= 0 || reveal.progress >= 1) return;
      const ringProgress = clamp(reveal.progress * 1.18, 0, 1);
      const ringRadius = 4 + ringProgress * 28;
      ctx.beginPath();
      ctx.arc(point.x, point.y, ringRadius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(170,255,229,${(1 - ringProgress) * 0.72})`;
      ctx.lineWidth = 1.6 - ringProgress * 0.8;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(point.x, point.y, 2.2 + reveal.scale * 2.8, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(220,255,246,${Math.sin(reveal.progress * Math.PI) * 0.76})`;
      ctx.fill();
    });
    ctx.restore();

    ctx.restore();
  };

  const getJapanPoiCoordinates = (poi) => {
    if (poi?.type === "data") return { lon: poi.record?.lon, lat: poi.record?.lat };
    if (poi?.type === "history" || poi?.type === "earthquake") {
      return { lon: poi.event?.longitude, lat: poi.event?.latitude };
    }
    return { lon: poi?.node?.lon, lat: poi?.node?.lat };
  };

  const getJapanPoiFocusRadius = (poi, rect) => {
    const signalModeId = getActiveSignalMode()?.id;
    if (poi?.type === "data" && signalModeId === "nothing-is-waste") {
      const selectedRadius = clamp(rect.width / 34, 46, 62);
      const baseRadius = clamp(rect.width / 78, 20, 29);
      return (poi.index === wasteSelectedIndex ? selectedRadius : baseRadius) + 7;
    }
    if (poi?.type === "data" && signalModeId === "forest-cloud-engine") {
      return Math.max(24, getForestRainRadius(poi.record?.precipitationMmDay) + 7);
    }
    if (poi?.type === "data" && signalModeId === "anthropocene-scar") {
      const selected = poi.record?.iso3 === anthropoceneSelectedIso3;
      return getAnthropoceneEmissionRadius(poi.record?.emissionsMtCo2) + (selected ? 10 : 7);
    }
    if (poi?.type === "data" && signalModeId === "population-tide") {
      const state = getMapSequenceState(getActiveSignalMode());
      const maximumPopulation = Math.max(1, ...(state?.yearRows || []).map((row) => Number(row.population || 0)));
      return 12 + Math.sqrt(Math.max(0, poi.record?.population || 0) / maximumPopulation) * 42;
    }
    if (poi?.type === "history" || poi?.type === "earthquake") return 22;
    return 25;
  };

  const renderJapanPoiFocus = (ctx, rect, left, top, now, ratio) => {
    if (!hoveredJapanPoi || selectedJapanPoi || japanLayer.classList.contains("is-live-exhibit")) {
      return;
    }
    const coordinates = getJapanPoiCoordinates(hoveredJapanPoi);
    if (!Number.isFinite(coordinates.lon) || !Number.isFinite(coordinates.lat)) return;
    const point = japanWorldToScreen(coordinates.lon, coordinates.lat, left, top);
    if (point.x < 0 || point.x > rect.width || point.y < 0 || point.y > rect.height) return;

    const elapsed = Math.max(0, now - hoveredJapanPoiStartedAt);
    const progress = reducedMotion ? 1 : clamp(elapsed / 320, 0, 1);
    const eased = 1 - (1 - progress) ** 3;
    const baseRadius = getJapanPoiFocusRadius(hoveredJapanPoi, rect);
    const sourceRadius = baseRadius + 4;
    const magnification = 1 + eased * 0.16;
    const focusRadius = sourceRadius * magnification;
    const pulse = reducedMotion ? 0.35 : 0.5 + Math.sin(now * 0.0042) * 0.5;

    japanOverlay.dataset.hoveredPoiKey = hoveredJapanPoiKey;
    japanOverlay.dataset.hoveredPoiProgress = progress.toFixed(3);
    japanOverlay.dataset.hoveredPoiScale = magnification.toFixed(3);
    japanOverlay.dataset.hoveredPoiScreenX = point.x.toFixed(2);
    japanOverlay.dataset.hoveredPoiScreenY = point.y.toFixed(2);

    const sourceLeft = (point.x - sourceRadius) * ratio;
    const sourceTop = (point.y - sourceRadius) * ratio;
    const sourceSize = sourceRadius * 2 * ratio;
    if (
      japanPoiFocusContext
      && sourceLeft >= 0
      && sourceTop >= 0
      && sourceLeft + sourceSize <= japanOverlay.width
      && sourceTop + sourceSize <= japanOverlay.height
    ) {
      const focusSize = Math.max(2, Math.ceil(sourceSize));
      if (japanPoiFocusCanvas.width !== focusSize || japanPoiFocusCanvas.height !== focusSize) {
        japanPoiFocusCanvas.width = focusSize;
        japanPoiFocusCanvas.height = focusSize;
      }
      japanPoiFocusContext.setTransform(1, 0, 0, 1, 0, 0);
      japanPoiFocusContext.clearRect(0, 0, focusSize, focusSize);
      japanPoiFocusContext.drawImage(
        japanOverlay,
        sourceLeft,
        sourceTop,
        sourceSize,
        sourceSize,
        0,
        0,
        focusSize,
        focusSize,
      );

      ctx.save();
      ctx.beginPath();
      ctx.arc(point.x, point.y, focusRadius, 0, Math.PI * 2);
      ctx.clip();
      ctx.globalAlpha = 0.96;
      ctx.drawImage(
        japanPoiFocusCanvas,
        0,
        0,
        focusSize,
        focusSize,
        point.x - focusRadius,
        point.y - focusRadius,
        focusRadius * 2,
        focusRadius * 2,
      );
      const lensLight = ctx.createRadialGradient(
        point.x - focusRadius * 0.28,
        point.y - focusRadius * 0.32,
        0,
        point.x,
        point.y,
        focusRadius,
      );
      lensLight.addColorStop(0, `rgba(222,255,247,${0.12 * eased})`);
      lensLight.addColorStop(0.58, "rgba(118,246,213,0)");
      lensLight.addColorStop(1, `rgba(78,220,194,${0.08 * eased})`);
      ctx.fillStyle = lensLight;
      ctx.fillRect(
        point.x - focusRadius,
        point.y - focusRadius,
        focusRadius * 2,
        focusRadius * 2,
      );
      ctx.restore();
    }

    ctx.save();
    ctx.globalCompositeOperation = "screen";
    ctx.shadowColor = "rgba(126,255,224,.72)";
    ctx.shadowBlur = 12 + eased * 12;
    ctx.beginPath();
    ctx.arc(point.x, point.y, focusRadius + 1.5, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(190,255,238,${0.46 + eased * 0.34})`;
    ctx.lineWidth = 1.2 + eased * 0.5;
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.arc(point.x, point.y, focusRadius + 6 + pulse * 7, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(104,244,209,${(0.2 + (1 - pulse) * 0.18) * eased})`;
    ctx.lineWidth = 0.8;
    ctx.stroke();
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
    const liveBackdropOnly = japanLayer.classList.contains("is-live-exhibit");
    japanOverlay.dataset.liveBackdrop = liveBackdropOnly ? "reference-map-only" : "standard-mode";
    if (liveBackdropOnly) {
      ctx.restore();
      return;
    }

    if (mapScope === "japan" && isTheme(5)) {
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

    if (isTheme(5) && japanDataLayer === "history") {
      renderJapanHistoryReplay(ctx, rect, left, top, now);
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
        const reveal = getMapPlotReveal(index, japanHistoryEvents.length, now);
        if (reveal.progress <= 0) return;
        ctx.save();
        applyMapPlotReveal(ctx, point, reveal);

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
        ctx.restore();
      });
    }

    if (!isTheme(0) && !isTheme(8) && !isTheme(9)) nodePoints.forEach((node, index) => {
      if (
        node.x < -40 ||
        node.x > rect.width + 40 ||
        node.y < -40 ||
        node.y > rect.height + 40
      ) {
        return;
      }
      const reveal = getMapPlotReveal(index, nodePoints.length, now);
      if (reveal.progress <= 0) return;
      ctx.save();
      applyMapPlotReveal(ctx, node, reveal);

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
      ctx.restore();
    });

    const pulseLifetime = reducedMotion ? 6500 : 4200;
    for (let index = japanPulses.length - 1; index >= 0; index -= 1) {
      const pulse = japanPulses[index];
      const age = now - pulse.bornAt;
      if (age > pulseLifetime) {
        japanPulses.splice(index, 1);
        continue;
      }
      if (isTheme(8) || isTheme(9)) continue;

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
      if (isTheme(8) || isTheme(9) || !latestPulse) {
        japanMapStatus.textContent = getJapanObservationStatus();
      } else if (now - latestPulse.bornAt < pulseLifetime * 0.24) {
        japanMapStatus.textContent = "QUESTION SENT / CONNECTING TO A LISTENING NODE";
      } else {
        japanMapStatus.textContent = "CO-CREATION SIGNAL / RELATION TRACE ACTIVE";
      }
    }

    renderJapanPoiFocus(ctx, rect, left, top, now, ratio);

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

  window.addEventListener("gaia:live-exhibit-change", () => {
    if (japanIsOpen) {
      clearJapanPoiHover();
      restartMapPlotReveal("exhibit-change");
    }
    renderJapanOverlay(performance.now());
  });
  window.addEventListener("gaia:signals-ready", () => {
    if (japanIsOpen) restartMapPlotReveal("data-ready");
  });

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
    if (!isTheme(5)) {
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
    const annualState = getMapSequenceState(getActiveSignalMode());
    return annualState
      ? `USGS ${annualState.selectedYear} / ${annualState.yearEvents.length} EVENTS / MAX M${annualState.selected.magnitude.toFixed(1)} / WORLD VIEW`
      : "USGS YEARLY M7.5+ / LOADING";
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

  const MAP_GUIDE_SCRAMBLE_ALPHABET = Array.from(
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/:.-+◇○△□惑星地球観測光風海森",
  );
  let mapGuideScrambleGeneration = 0;
  let mapGuideAnimationTimer = 0;

  const revealMapGuideText = (target, finalText, duration, delay, generation) => {
    const characters = Array.from(finalText);
    const startedAt = performance.now() + delay;
    const draw = (now) => {
      if (generation !== mapGuideScrambleGeneration) return;
      if (now < startedAt) {
        requestAnimationFrame(draw);
        return;
      }
      const progress = Math.min(1, (now - startedAt) / duration);
      const eased = 1 - (1 - progress) ** 3;
      const settledCount = Math.floor(characters.length * eased);
      target.textContent = characters.map((character, index) => {
        if (index < settledCount || /[\s、。・「」『』（）()／/:：—–!?！？]/u.test(character)) {
          return character;
        }
        return MAP_GUIDE_SCRAMBLE_ALPHABET[
          Math.floor(Math.random() * MAP_GUIDE_SCRAMBLE_ALPHABET.length)
        ];
      }).join("");
      if (progress < 1) requestAnimationFrame(draw);
      else target.textContent = finalText;
    };
    requestAnimationFrame(draw);
  };

  const animateMapReadingGuide = (guide) => {
    if (!guide || !mapReadingGuide) return;
    const texts = [
      [mapGuideTitle, guide.title || modes[modeToIndex].titleJa, 420, 40],
      [mapGuideSubject, guide.subject, 560, 90],
      [mapGuideReading, guide.reading, 620, 130],
      [mapGuideAction, guide.action, 680, 170],
    ];
    mapGuideScrambleGeneration += 1;
    const generation = mapGuideScrambleGeneration;
    window.clearTimeout(mapGuideAnimationTimer);
    mapReadingGuide.classList.remove("is-mode-entering");
    if (reducedMotion) {
      texts.forEach(([target, finalText]) => { target.textContent = finalText; });
      mapReadingGuideBody?.setAttribute("aria-busy", "false");
      return;
    }
    void mapReadingGuide.offsetWidth;
    mapReadingGuide.classList.add("is-mode-entering");
    mapReadingGuideBody?.setAttribute("aria-busy", "true");
    texts.forEach(([target, finalText, duration, delay]) => {
      revealMapGuideText(target, finalText, duration, delay, generation);
    });
    mapGuideAnimationTimer = window.setTimeout(() => {
      if (generation !== mapGuideScrambleGeneration) return;
      texts.forEach(([target, finalText]) => { target.textContent = finalText; });
      mapReadingGuide.classList.remove("is-mode-entering");
      mapReadingGuideBody?.setAttribute("aria-busy", "false");
      mapGuideAnimationTimer = 0;
    }, 900);
  };

  let mapTitleTransitionTimer = 0;
  const cancelMapTitleTransition = () => {
    window.clearTimeout(mapTitleTransitionTimer);
    mapTitleTransitionTimer = 0;
    mapPlotRevealBlockedUntil = 0;
    japanLayer.classList.remove("is-map-title-transitioning");
  };

  const animateMapTitleTransition = (title) => {
    if (!mapTitleTransition || !mapTitleTransitionText || !japanIsOpen) return;
    cancelMapTitleTransition();
    const separatorStartedAt = performance.now();
    const separatorDuration = reducedMotion
      ? MAP_TITLE_SEPARATOR_REDUCED_DURATION_MS
      : MAP_TITLE_SEPARATOR_DURATION_MS;
    mapPlotRevealBlockedUntil = separatorStartedAt + separatorDuration;
    mapTitleTransitionText.textContent = title;
    void mapTitleTransition.offsetWidth;
    japanLayer.classList.add("is-map-title-transitioning");
    japanOverlay.dataset.titleSeparatorState = "running";
    japanOverlay.dataset.titleSeparatorStartedAt = separatorStartedAt.toFixed(1);
    japanOverlay.dataset.titleSeparatorEndsAt = mapPlotRevealBlockedUntil.toFixed(1);
    mapTitleTransitionTimer = window.setTimeout(() => {
      mapTitleTransitionTimer = 0;
      mapPlotRevealBlockedUntil = 0;
      japanLayer.classList.remove("is-map-title-transitioning");
      japanOverlay.dataset.titleSeparatorState = "complete";
      japanOverlay.dataset.titleSeparatorCompletedAt = performance.now().toFixed(1);
    }, separatorDuration);
  };

  const updateMapObservationNarrative = () => {
    const signalMode = getActiveSignalMode();
    const guide = MAP_READING_GUIDES[getThemeIndex()];
    if (guide) animateMapReadingGuide(guide);
    if (!isTheme(5)) {
      if (signalMode?.id === "breathing-earth") {
        japanObservationKicker.textContent = "CO₂ TIMELINE / 1958 → 2050 / 60 SEC LOOP";
        japanObservationCopy.textContent =
          "色はCO₂濃度です。斜線のマスは近くの8地点から計算しました。2026年以降は、最近10年と同じ増え方が続いた場合の試算です。マスを押すと詳しい数字が出ます。";
      } else if (signalMode?.id === "blue-circulation") {
        japanObservationKicker.textContent = "海流の速さを0〜14日まで延長 / 45秒ループ";
        japanObservationCopy.textContent =
          "色付きの矢印が海流です。点から伸びる線は、その流れが変わらないと仮定した移動距離です。白い矢印は比較用の風で、距離計算には使いません。色付きの点を押すと詳しい数字が出ます。";
      } else if (signalMode) {
        const narratives = {
          "forest-cloud-engine": ["FOREST × RAIN / FOREST MASK + 31 SITES", "緑は森林域、大きな水色円は31代表地点の平均降水量です。直径が大きいほど雨が多く、ブラジルのアマゾン付近は5.33 mm/dayです。円のない場所を雨量ゼロとは扱いません。"],
          "pollination-protocol": ["OBSERVATION ≠ DISTRIBUTION / 3 STEPS", "①黄色はGBIF観察点、②各国最大2件の標本制約、③場所のないGloBI花関係を非地理ネットワークで示します。点の空白はミツバチの不在ではありません。"],
          "nothing-is-waste": ["RECYCLING / COUNTRY VALUES", "同じ大きさの円グラフで、緑は再資源化率、橙はそれ以外です。実線は国連の公式値、破線は近隣5か国からの補完値。左右ボタンとスライダーで31の国・地域を切り替えます。"],
          "anthropocene-scar": ["1945—2023 FOSSIL CO₂ × FIXED 2016 LIGHTS", "赤い円は全年度共通の固定尺度で、面積が選択年の国別化石燃料由来CO₂に比例します。白い発光はNASA VIIRS 2016を固定した比較用レイヤーです。円の中心は排出源ではありません。"],
          "three-ecologies": ["FOREST × URBAN / 31 PAIRED COUNTRIES", "同じ31か国の森林率と都市人口率を二重円と散布図で比較します。回帰線と相関係数が全体傾向、選択国の中心色が傾向からの外れ方を示します。紫の世界遺産例は数値計算へ含めません。"],
          "earth-organ": ["RENEWABLE ELECTRICITY / 31 COUNTRY CHOROPLETH", "国土の青が明るいほど、電力に占める再生可能エネルギーの割合が高い国です。スライダーは低い国から高い国へ移動します。黄色の日射と緑の風は選択国の補足で、比率を決める因果表示ではありません。"],
          "population-tide": ["1960—2025 POPULATION / 31 COUNTRIES", "琥珀色の円は選択年の国別人口です。円の面積が人口に比例します。国の代表位置へ置いた比較円で、都市の位置や人口密度ではありません。"],
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
      japanObservationKicker.textContent = "USGS YEARLY WAVES / M7.5+ / 2000–2026";
      japanObservationCopy.textContent =
        "年度ごとに世界のM7.5以上だけを表示します。輪は全震源からゆっくり広がり、Magnitudeから見積もった可感半径の目安で止まります。実際の震度・被害・津波範囲ではありません。";
    }
  };

  const setJapanDataLayer = (layer) => {
    const previousLayer = japanDataLayer;
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
    if (japanIsOpen && previousLayer !== japanDataLayer) restartMapPlotReveal("layer-change");
  };

  const setMapScope = (_scope = "earth", { resetLayer = true } = {}) => {
    mapScope = "earth";
    japanLayer.dataset.mapScope = mapScope;
    mapScopeKicker.textContent = "Planetary lens / Open map";
    const mapHeadingNumber = formatModeNumber(mapModeIndex);
    const mapHeadingTitle = modes[modeToIndex]?.titleJa || "地球の一呼吸";
    japanTitle.dataset.exhibitNumber = mapHeadingNumber;
    japanTitle.textContent = mapHeadingTitle;
    japanTitle.setAttribute("aria-label", `${mapHeadingNumber} ${mapHeadingTitle}`);
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

  const getJapanPoiKey = (poi) => {
    if (poi?.type === "data") {
      const recordKey = poi.record?.id
        || poi.record?.iso3
        || poi.record?.key
        || poi.record?.name
        || poi.record?.country
        || `${poi.record?.lon}:${poi.record?.lat}`;
      return `data:${getActiveSignalMode()?.id || modeToIndex}:${recordKey}:${poi.index}`;
    }
    if (poi?.type === "history") return `history:${poi.event?.id || poi.index}`;
    if (poi?.type === "earthquake") return `earthquake:${poi.event?.id || poi.index}`;
    return `node:${poi?.node?.id || poi?.node?.name || poi?.index}`;
  };

  const getJapanPoiPreviewContent = (poi) => {
    if (poi.type === "data") {
      const record = poi.record || {};
      return {
        kicker: `${formatModeNumber(modeToIndex)} / ${modes[modeToIndex].titleJa}`,
        title: record.nameJa
          || record.countryJa
          || record.name
          || record.country
          || record.place
          || record.species
          || record.iso3
          || "観測データ",
        meta: record.meta || "この地点の観測値と出典を表示します。",
      };
    }
    if (poi.type === "history") {
      const event = poi.event;
      return {
        kicker: "JMA / HISTORICAL POI",
        title: getJmaEventTitle(event),
        meta: `${String(event.occurredAt).slice(0, 4)} / M${event.magnitude.toFixed(1)} / 最大震度 ${getMaximumIntensityText(event)}`,
      };
    }
    if (poi.type === "earthquake") {
      const event = poi.event;
      return {
        kicker: "USGS / EARTHQUAKE POI",
        title: event.place,
        meta: `M${event.magnitude.toFixed(1)} / 深さ ${Math.round(event.depthKm)} km / ${formatJapanEventTime(event.time)}`,
      };
    }
    const node = poi.node;
    return {
      kicker: "MAP / LISTENING POI",
      title: node.nameJa || node.name,
      meta: `${node.name || "観測地点"} / ${node.lat.toFixed(2)}°N ${node.lon.toFixed(2)}°E`,
    };
  };

  const positionJapanPoiPreview = (clientX, clientY) => {
    const layerRect = japanLayer.getBoundingClientRect();
    const width = Math.min(japanPoiPreview.offsetWidth || 330, layerRect.width - 36);
    const height = Math.min(japanPoiPreview.offsetHeight || 150, layerRect.height - 36);
    const localX = clientX - layerRect.left;
    const localY = clientY - layerRect.top;
    const left = clamp(
      localX + width + 28 > layerRect.width ? localX - width - 24 : localX + 24,
      18,
      layerRect.width - width - 18,
    );
    const top = clamp(
      localY - height - 20 >= 18 ? localY - height - 20 : localY + 24,
      18,
      layerRect.height - height - 18,
    );
    japanPoiPreview.style.left = `${left}px`;
    japanPoiPreview.style.top = `${top}px`;
  };

  const clearJapanPoiHover = () => {
    hoveredJapanPoi = null;
    hoveredJapanPoiKey = "";
    hoveredJapanPoiStartedAt = 0;
    japanMap.classList.remove("has-poi-hover");
    japanPoiPreview.classList.remove("is-visible");
    japanPoiPreview.setAttribute("aria-hidden", "true");
    delete japanOverlay.dataset.hoveredPoiKey;
    delete japanOverlay.dataset.hoveredPoiProgress;
    delete japanOverlay.dataset.hoveredPoiScale;
    delete japanOverlay.dataset.hoveredPoiScreenX;
    delete japanOverlay.dataset.hoveredPoiScreenY;
  };

  const showJapanPoiPreview = (poi, clientX, clientY) => {
    const key = getJapanPoiKey(poi);
    const changed = key !== hoveredJapanPoiKey;
    hoveredJapanPoi = poi;
    if (changed) {
      hoveredJapanPoiKey = key;
      hoveredJapanPoiStartedAt = performance.now();
      const content = getJapanPoiPreviewContent(poi);
      japanPoiPreviewKicker.textContent = content.kicker;
      japanPoiPreviewTitle.textContent = content.title;
      japanPoiPreviewMeta.textContent = content.meta;
      japanPoiPreview.classList.remove("is-visible");
      void japanPoiPreview.offsetWidth;
    }
    positionJapanPoiPreview(clientX, clientY);
    japanMap.classList.add("has-poi-hover");
    japanPoiPreview.setAttribute("aria-hidden", "false");
    japanPoiPreview.classList.add("is-visible");
  };

  const updateJapanPoiHover = (event) => {
    if (
      !supportsHover
      || event.pointerType === "touch"
      || event.pointerType === "pen"
      || selectedJapanPoi
      || japanView.dragged
      || japanLayer.classList.contains("is-live-exhibit")
    ) {
      clearJapanPoiHover();
      return;
    }
    const poi = findJapanPoiAt(event.clientX, event.clientY, event.pointerType, {
      allowGridFallback: false,
    });
    if (!poi) {
      clearJapanPoiHover();
      return;
    }
    showJapanPoiPreview(poi, event.clientX, event.clientY);
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
    const cardWidth = Math.min(330, layerRect.width - 40);
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

  const JAPAN_POI_SOURCE_DATASET_IDS = Object.freeze({
    "breathing-earth": "gosat-l3-xco2",
    "blue-circulation": "noaa-current-fallback",
    "forest-cloud-engine": "nasa-power-precip",
    "pollination-protocol": "gbif",
    "nothing-is-waste": "un-sdg",
    "anthropocene-scar": "gcp-fossil-co2",
    "rhythm-of-disaster": "usgs-earthquakes",
    "three-ecologies": "worldbank-forest",
    "earth-organ": "worldbank-renewable",
    "population-tide": "worldbank-population",
  });

  const getJapanPoiSourceUrl = (poi) => {
    const signalMode = getActiveSignalMode();
    const datasets = signalMode?.datasets || [];
    const datasetUrl = (id) => datasets.find((dataset) => dataset.id === id)?.url || "";
    if (poi.type === "history") return datasetUrl("jma-shindo");
    if (poi.type === "earthquake") {
      return poi.event?.url || datasetUrl("usgs-earthquakes");
    }
    if (poi.type === "data") {
      if (poi.record?.url) return poi.record.url;
      if (signalMode?.id === "three-ecologies" && poi.record?.category) {
        return datasetUrl("unesco-whc");
      }
    }
    return datasetUrl(JAPAN_POI_SOURCE_DATASET_IDS[signalMode?.id])
      || datasets.find((dataset) => dataset.kind === "SOURCE" && /^https?:/u.test(dataset.url))?.url
      || "";
  };

  const setJapanPoiSource = (poi) => {
    const sourceUrl = getJapanPoiSourceUrl(poi);
    japanPoiSource.hidden = !sourceUrl;
    japanPoiSource.href = sourceUrl || "#";
  };

  const openJapanPoi = (poi, clientX, clientY) => {
    window.clearTimeout(japanPoiRevealTimer);
    japanPoiRevealTimer = 0;
    clearJapanPoiHover();
    selectedJapanPoi = poi;
    japanPoiCard.hidden = true;
    japanPoiCard.setAttribute("aria-hidden", "true");
    japanLayer.classList.remove("japan-poi-open");

    if (poi.type === "data") {
      const record = poi.record;
      const activeSignalMode = getActiveSignalMode();
      if (activeSignalMode) {
        co2TimelineHeld = true;
        if (activeSignalMode.id === "anthropocene-scar" && record.iso3) {
          anthropoceneSelectedIso3 = record.iso3;
        } else if (activeSignalMode.id === "population-tide" && record.iso3) {
          populationSelectedIso3 = record.iso3;
        }
        if (Number.isInteger(record.sequenceIndex) && record.sequenceLength > 0) {
          if (activeSignalMode.id === "nothing-is-waste") {
            wasteSelectedIndex = record.sequenceIndex;
            signalTimePosition = record.sequenceLength > 1
              ? (record.sequenceIndex / (record.sequenceLength - 1)) * 100
              : 0;
          } else {
            signalTimePosition = clamp(
              ((record.sequenceIndex + 0.5) / record.sequenceLength) * 100,
              0,
              99.999,
            );
            signalTimeInputs.forEach((input) => {
              input.value = String(signalTimePosition);
            });
          }
        }
        updateSignalInterface();
      }
      japanPoiType.textContent = `${modes[modeToIndex].titleJa} / DATA POI`;
      japanPoiMeta.textContent = record.meta;
      setJapanPoiSource(poi);
      japanWaveReplay = null;
      showJapanPoiCard(clientX, clientY);
    } else if (poi.type === "history") {
      const event = poi.event;
      co2TimelineHeld = true;
      updateSignalInterface();
      japanPoiType.textContent = `${String(event.occurredAt).slice(0, 4)} ${getJmaEventTitle(event)} / JMA`;
      japanPoiMeta.textContent = `${formatJapanEventTime(event.occurredAt)} / M${event.magnitude.toFixed(
        1,
      )} / DEPTH ${event.depthKm} KM / 最大震度 ${getMaximumIntensityText(
        event,
      )} / P 7.0・S 4.0 KM/S`;
      setJapanPoiSource(poi);
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
      japanPoiType.textContent = `M${event.magnitude.toFixed(1)} / ${event.place} / USGS`;
      japanPoiMeta.textContent = `${formatJapanEventTime(event.time)} / DEPTH ${Math.round(
        event.depthKm,
      )} KM`;
      setJapanPoiSource(poi);
      japanWaveReplay = null;
      showJapanPoiCard(clientX, clientY);
    } else {
      const node = poi.node;
      co2TimelineHeld = true;
      updateSignalInterface();
      japanPoiType.textContent = `${node.nameJa} / MAP POI`;
      japanPoiMeta.textContent = `${node.name} / ${node.lat.toFixed(2)}°N ${node.lon.toFixed(2)}°E`;
      setJapanPoiSource(poi);
      japanWaveReplay = null;
      showJapanPoiCard(clientX, clientY);
    }
  };

  const findJapanPoiAt = (
    clientX,
    clientY,
    pointerType = "",
    { allowGridFallback = true } = {},
  ) => {
    const firstPoiVisibleAt = mapPlotRevealStartedAt + (reducedMotion ? 0 : MAP_PLOT_REVEAL_LEAD_MS);
    if (performance.now() < firstPoiVisibleAt) return null;
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
      const signalModeId = getActiveSignalMode()?.id;
      let hitRadius = hitRadii.node;
      if (signalModeId === "forest-cloud-engine") {
        hitRadius = Math.max(hitRadius, getForestRainRadius(record.precipitationMmDay));
      } else if (signalModeId === "nothing-is-waste") {
        hitRadius = record.sequenceIndex === wasteSelectedIndex
          ? clamp(rect.width / 34, 46, 62) + 8
          : clamp(rect.width / 78, 20, 29) + 8;
      }
      considerCandidate({ type: "data", record, index }, point, hitRadius);
    });

    if (isTheme(5)) {
      if (japanDataLayer === "history") {
        japanHistoryEvents.forEach((event, index) => {
          const point = japanWorldToScreen(event.longitude, event.latitude, left, top);
          considerCandidate({ type: "history", event, index }, point, hitRadii.history);
        });
      }
    }

    if (modes[modeToIndex].id !== "breathing-earth") {
      getActiveMapNodes().forEach((node, index) => {
        const point = japanWorldToScreen(node.lon, node.lat, left, top);
        considerCandidate({ type: "node", node, index }, point, hitRadii.node);
      });
    }

    if (!closest && allowGridFallback && modes[modeToIndex].id === "breathing-earth") {
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

  const getActiveSignalMode = (index = modeToIndex) => {
    const visualMode = modes[index];
    return gaiaModeById.get(visualMode.dataModeId || visualMode.id) || null;
  };

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
        output: `${state?.dateLabel || "SNAPSHOT"} / 計算 ${((state?.horizonHours || 0) / 24).toFixed(1)}日後`,
        value: `海流 ${state?.vectorCount || 0}地点 / 平均 ${state?.meanSpeedMs.toFixed(2) || "—"} m/s`,
        note: `${state?.warning || "海流を読み込んでいます。"} 色付きは海流、白い矢印は比較用の平均風です。風は距離計算に使いません。`,
        temporal: true,
      };
    }
    if (signalMode.id === "forest-cloud-engine") {
      const state = getMapSequenceState(signalMode);
      const rain = state?.selected;
      return {
        output: state?.phaseLabel || "GLOBAL SAMPLE",
        location: getForestRainSiteName(rain),
        value: `降水量 ${rain?.precipitationMmDay?.toFixed(2) ?? "—"} mm/day`,
        note: "大きな水色円が降水量、緑が森林域です。円の直径で雨量を比べ、地点間は推測で埋めません。相関係数や因果関係を示す図ではありません。",
        temporal: true,
      };
    }
    if (signalMode.id === "pollination-protocol") {
      const state = getMapSequenceState(signalMode);
      return {
        output: state?.phaseLabel || "3つの読み方",
        value: `${state?.yearLabel || "—"} / ${state?.valueLabel || "記録を読み込み中"}`,
        note: state?.note || "観察記録と生息分布の違いを読み込んでいます。",
        temporal: true,
      };
    }
    if (signalMode.id === "nothing-is-waste") {
      const state = getMapSequenceState(signalMode);
      const imputed = state?.selected?.valueStatus === "IMPUTED";
      return {
        output: state?.phaseLabel || "COUNTRY VALUE",
        location: state?.selected?.country || "—",
        value: `再資源化率 ${state?.sourceRecycle.toFixed(1) || "—"}% / ${imputed ? "補完値" : "国連公式値"}`,
        note: imputed
          ? `${state?.selected?.country || "国"}は国連公式値がないため、近隣5か国（${state?.selected?.donorIso3?.join("・") || "参照国"}）の中央値で補完しています。破線は補完値を示し、国別順位や政策評価には使えません。`
          : `${state?.selected?.country || "国"} ${state?.selected?.year || "報告年不明"}。国連SDG 12.5.1の公式値です。実線円の緑が再資源化率、橙がそれ以外です。`,
        temporal: true,
      };
    }
    if (signalMode.id === "anthropocene-scar") {
      const state = getMapSequenceState(signalMode);
      const emission = state?.selected;
      return {
        output: state?.phaseLabel || "FOSSIL CO₂ HISTORY",
        location: emission?.country || "—",
        value: `${state?.selectedYear || "—"} / ${emission?.emissionsMtCo2?.toFixed(1) || "—"} Mt CO₂`,
        note: "赤い円は全年度共通の固定尺度で、円面積が選択年の化石燃料由来CO₂に比例します。白い発光は2016年のNASA VIIRS夜間光を固定した参照です。",
        temporal: true,
      };
    }
    if (signalMode.id === "rhythm-of-disaster") {
      const state = getMapSequenceState(signalMode);
      return {
        output: state?.phaseLabel || "USGS GLOBAL HISTORY",
        value: state ? `${state.selectedYear} / ${state.yearEvents.length} EVENTS / MAX M${state.selected.magnitude.toFixed(1)}` : "NO YEAR",
        note: "この年度の震源だけを発生日時順に世界表示します。各点に続く輪は約2.2〜3.6秒で広がり、Magnitudeから見積もった可感半径で止まります。実際の震度・被害・津波範囲ではありません。",
        temporal: true,
      };
    }
    if (signalMode.id === "three-ecologies") {
      const state = getMapSequenceState(signalMode);
      return {
        output: state?.phaseLabel || "FOREST × URBAN",
        location: state?.selected?.country || "",
        value: state
          ? `FOREST ${state.selected.forestPercent.toFixed(1)}% / URBAN ${state.selected.urbanPercent.toFixed(1)}%`
          : "NO PAIRED COUNTRY DATA",
        note: state
          ? `緑と青の二重円は同じ国の割合です。散布図の r ${state.correlation.toFixed(2)} は${state.correlationLabel}。紫の世界遺産例は相関計算へ含めません。`
          : "同じ国の森林率と都市人口率を組にして比較します。",
        temporal: true,
      };
    }
    if (signalMode.id === "earth-organ") {
      const state = getMapSequenceState(signalMode);
      const current = state?.selected;
      return {
        output: state?.phaseLabel || "RENEWABLE ELECTRICITY",
        location: current?.country || "—",
        value: `再生可能電力 ${current?.renewablePercent?.toFixed(1) || "—"}%`,
        note: "国土の青が明るいほど、電力に占める再生可能エネルギーの割合が高い国です。黄色の日射と緑の風は選択国の補足で、現在の比率を決める因果表示ではありません。",
        temporal: true,
      };
    }
    if (signalMode.id === "population-tide") {
      const state = getMapSequenceState(signalMode);
      const population = state?.selected;
      return {
        output: state?.phaseLabel || "POPULATION HISTORY",
        location: population?.country || "—",
        value: `${state?.selectedYear || "—"} / ${formatObservationNumber(population?.population, 0)} 人`,
        note: "琥珀色の円は選択年の国別人口で、面積が人口に比例します。国の代表位置へ置いた比較円で、都市位置や人口密度ではありません。",
        temporal: true,
      };
    }
    const state = getMapSequenceState(signalMode);
    return {
      output: state?.phaseLabel || "EARTH OBSERVATION ATLAS",
      value: state?.selected
        ? `${state.selected.number} ${state.selected.metric} / ${state.selected.value}`
        : "9 MEASUREMENTS ≠ 1 SCORE",
      note: state?.selected
        ? `${state.selected.scope}。9枚は同時表示しますが、単位と意味が違うため足し算や総合順位にはしません。`
        : "各展示の測るもの・代表値・単位を同時に並べます。",
      temporal: true,
    };
  };

  const getShaderSignalVector = (modeIndex = modeToIndex) => {
    const signalMode = getActiveSignalMode(modeIndex);
    if (!signalMode) return [0.35, 0.25, 0.15, 0.1];
    const { signals } = signalMode;
    if (signalMode.id === "breathing-earth") {
      const state = getBreathingEarthState(signalMode);
      const row = state.co2;
      const temperature = state.temperature;
      return [
        clamp(((row?.deseasonalizedPpm || 315) - 315) / 120, 0, 1),
        state.seasonalUnit * 0.5 + 0.5,
        clamp(((temperature?.anomalyC || 0) + 0.5) / 2, 0, 1),
        0.2,
      ];
    }
    if (signalMode.id === "blue-circulation") {
      const state = getBlueCirculationState(signalMode);
      const meanStrength = clamp((state?.meanSpeedMs || 0) / 1, 0, 1);
      const peakStrength = clamp((state?.maximumSpeedMs || 0) / 1.5, 0, 1);
      const sampleDensity = clamp((state?.vectorCount || 0) / CURRENT_FIELD_SAMPLE_LIMIT, 0, 1);
      const horizonUnit = clamp((state?.horizonHours || 0) / CIRCULATION_TIMELINE_HOURS, 0, 1);
      canvas.dataset.currentMeanSpeedMs = (state?.meanSpeedMs || 0).toFixed(4);
      canvas.dataset.currentMaximumSpeedMs = (state?.maximumSpeedMs || 0).toFixed(4);
      canvas.dataset.currentStrength = meanStrength.toFixed(4);
      canvas.dataset.currentVectorCount = String(state?.vectorCount || 0);
      canvas.dataset.currentBrushLanguage = "one-data-anchored-brush-per-visible-poi";
      canvas.dataset.currentAmbientMotion = "continuous-timeline-independent-gradient";
      return [meanStrength, peakStrength, sampleDensity, horizonUnit];
    }
    if (signalMode.id === "forest-cloud-engine") {
      const row = getMapSequenceState(signalMode)?.selected || pickByPosition(signals.precipitation);
      return [clamp((row?.precipitationMmDay || 0) / 8, 0, 1), 0.42, 0.7, 0.25];
    }
    if (signalMode.id === "pollination-protocol") {
      return [
        clamp((signals.interactions?.length || 0) / 30, 0, 1),
        clamp((signals.occurrences?.length || 0) / 30, 0, 1),
        0.55,
        0.35,
      ];
    }
    if (signalMode.id === "nothing-is-waste") {
      const state = getMapSequenceState(signalMode);
      const recycling = state?.sourceRecycle || 0;
      const selectionProgress = (state?.selectedIndex || 0)
        / Math.max(1, (signalMode.signals.countryWaste?.length || 1) - 1);
      return [recycling / 100, selectionProgress, 0.46, 0.24];
    }
    if (signalMode.id === "anthropocene-scar") {
      const row = getMapSequenceState(signalMode)?.selected;
      const emission = clamp(Math.log10(Math.max(1, row?.emissionsMtCo2 || 1)) / 4.2, 0, 1);
      return [emission, 0.78, anthropocenePeelUntil > performance.now() ? 0.05 : 0.8, 0.18];
    }
    if (signalMode.id === "rhythm-of-disaster") {
      const event = getMapSequenceState(signalMode)?.selected;
      return [
        clamp(((event?.magnitude || 7.5) - 7.5) / 2, 0, 1),
        clamp((event?.depthKm || 0) / 700, 0, 1),
        0.84,
        0.22,
      ];
    }
    if (signalMode.id === "three-ecologies") {
      const state = getMapSequenceState(signalMode);
      return [
        clamp((state?.selected?.forestPercent || 0) / 100, 0, 1),
        clamp((state?.selected?.urbanPercent || 0) / 100, 0, 1),
        clamp(((state?.correlation || 0) + 1) / 2, 0, 1),
        clamp((signals.culture?.length || 0) / 30, 0, 1),
      ];
    }
    if (signalMode.id === "earth-organ") {
      const state = getMapSequenceState(signalMode);
      const row = state?.selected;
      return [
        clamp((row?.renewablePercent || 0) / 100, 0, 1),
        clamp((row?.potential?.solarKwhM2Day || 0) / 7, 0, 1),
        clamp((row?.potential?.windSpeedMs || 0) / 10, 0, 1),
        1,
      ];
    }
    if (signalMode.id === "population-tide") {
      const state = getMapSequenceState(signalMode);
      const selectedPopulation = Number(state?.selected?.population || 0);
      const sampleTotal = Number(state?.totalPopulation || 1);
      const timeProgress = state?.years?.length > 1
        ? state.yearIndex / (state.years.length - 1)
        : 0;
      return [
        clamp(Math.log10(Math.max(1, selectedPopulation)) / 10, 0, 1),
        clamp(selectedPopulation / sampleTotal, 0, 1),
        timeProgress,
        0.58,
      ];
    }
    return [0.72, 0.48, pointer.energy, modeMemory[modeIndex]];
  };

  const observationMetric = (key, label, value, unit = "") => Number.isFinite(Number(value))
    ? { key, label, value: Number(value), unit }
    : null;

  const captureMapObservation = () => {
    const signalMode = getActiveSignalMode();
    if (!signalMode) throw new Error(gaiaSnapshotError || "公開データを読み込んでいます。少し待ってから保存してください。");
    const visualMode = modes[modeToIndex];
    const readout = getSignalReadout(signalMode);
    const sequence = getMapSequenceState(signalMode);
    const metrics = [];
    if (signalMode.id === "breathing-earth") {
      const state = getBreathingEarthState(signalMode);
      const ppm = japanIsOpen ? state.timeline?.referencePpm : state.co2?.averagePpm;
      metrics.push(
        observationMetric("co2_ppm", "CO₂濃度", ppm, "ppm"),
        observationMetric("temperature_anomaly_c", "気温偏差", state.temperature?.anomalyC, "℃"),
      );
    } else if (signalMode.id === "blue-circulation") {
      const state = getBlueCirculationState(signalMode);
      metrics.push(
        observationMetric("mean_speed_ms", "平均海流速度", state?.meanSpeedMs, "m/s"),
        observationMetric("mean_distance_km", "計算上の平均移動距離", state?.meanDistanceKm, "km"),
        observationMetric("horizon_hours", "経過時間", state?.horizonHours, "h"),
      );
    } else if (signalMode.id === "forest-cloud-engine") {
      metrics.push(observationMetric("precipitation_mm_day", "降水量", sequence?.selected?.precipitationMmDay, "mm/day"));
    } else if (signalMode.id === "pollination-protocol") {
      metrics.push(sequence?.stageKey === "relations"
        ? observationMetric("relation_count", "花との記録関係", sequence?.relations?.length, "件")
        : observationMetric("occurrence_count", "GBIF観察記録", sequence?.occurrences?.length, "件"));
    } else if (signalMode.id === "nothing-is-waste") {
      metrics.push(observationMetric("recycle_percent", "再資源化率", sequence?.sourceRecycle, "%"));
    } else if (signalMode.id === "anthropocene-scar") {
      metrics.push(
        observationMetric("fossil_co2_mt", "化石燃料由来CO₂", sequence?.selected?.emissionsMtCo2, "Mt CO₂"),
        observationMetric("selected_year", "表示年", sequence?.selectedYear, "年"),
      );
    } else if (signalMode.id === "rhythm-of-disaster") {
      metrics.push(
        observationMetric("event_count", "M7.5以上の地震", sequence?.yearEvents?.length, "件"),
        observationMetric("maximum_magnitude", "最大マグニチュード", sequence?.selected?.magnitude, "M"),
      );
    } else if (signalMode.id === "three-ecologies") {
      metrics.push(
        observationMetric("forest_percent", "森林率", sequence?.selected?.forestPercent, "%"),
        observationMetric("urban_percent", "都市人口率", sequence?.selected?.urbanPercent, "%"),
        observationMetric("correlation", "相関係数", sequence?.correlation, "r"),
      );
    } else if (signalMode.id === "earth-organ") {
      metrics.push(
        observationMetric("renewable_percent", "再生可能電力", sequence?.selected?.renewablePercent, "%"),
        observationMetric("solar_kwh_m2_day", "日射条件", sequence?.selected?.potential?.solarKwhM2Day, "kWh/m²/day"),
        observationMetric("wind_speed_ms", "風速条件", sequence?.selected?.potential?.windSpeedMs, "m/s"),
      );
    } else if (signalMode.id === "population-tide") {
      metrics.push(
        observationMetric("population", "人口", sequence?.selected?.population, "人"),
        observationMetric("selected_year", "表示年", sequence?.selectedYear, "年"),
      );
    }
    const normalizedMetrics = metrics.filter(Boolean);
    if (!normalizedMetrics.length) throw new Error("この時点には保存できる数値がありません。");
    return {
      version: 1,
      source: "map",
      capturedAt: new Date().toISOString(),
      title: visualMode.titleJa,
      subtitle: readout.output,
      compareKey: `map:${signalMode.id}`,
      metrics: normalizedMetrics,
      context: signalMode.id === "nothing-is-waste"
        ? [
          { label: "表示", value: readout.value },
          { label: "対象国", value: sequence?.selected?.country || "—" },
          { label: "データ区分", value: sequence?.selected?.valueStatus === "IMPUTED" ? "近隣5か国からの補完値" : `国連公式値 / ${sequence?.selected?.year || "報告年不明"}` },
        ]
        : [
          { label: "表示", value: readout.value },
          { label: "観測位置", value: `${Math.round(signalTimePosition)}%` },
        ],
      provenance: {
        classification: [...new Set((signalMode.datasets || []).map((dataset) => dataset.kind).filter(Boolean))].join(" + "),
        datasetIds: (signalMode.datasets || []).map((dataset) => dataset.id).filter(Boolean),
      },
    };
  };

  const mapTransformationReceipt = document.querySelector("#map-transformation-receipt");
  const updateMapTransformationReceipt = () => {
    if (!(mapTransformationReceipt instanceof HTMLElement)) return;
    const signalMode = getActiveSignalMode();
    const visualMode = modes[modeToIndex];
    const sourceOutput = mapTransformationReceipt.querySelector("[data-map-receipt-source]");
    const providerOutput = mapTransformationReceipt.querySelector("[data-map-receipt-provider]");
    const transformOutput = mapTransformationReceipt.querySelector("[data-map-receipt-transform]");
    const visualOutput = mapTransformationReceipt.querySelector("[data-map-receipt-visual]");
    if (!signalMode || !visualMode) {
      sourceOutput.textContent = gaiaSnapshotError ? "公開データを読み込めませんでした。" : "公開データを読み込んでいます。";
      providerOutput.textContent = gaiaSnapshotError || "LOCAL JSON / SNAPSHOT";
      return;
    }
    try {
      const observation = captureMapObservation();
      sourceOutput.textContent = observation.metrics
        .map((metric) => `${metric.label} ${formatObservationNumber(metric.value, 2)}${metric.unit ? ` ${metric.unit}` : ""}`)
        .join(" / ");
      providerOutput.textContent = [...new Set((signalMode.datasets || []).map((dataset) => dataset.organisation).filter(Boolean))].join(" / ");
      transformOutput.textContent = modeDataNarratives[visualMode.id] || "保存済みの公開記録を表示用の尺度へ変換します。";
      visualOutput.textContent = visualMode.description;
    } catch (error) {
      sourceOutput.textContent = "この時点の数値を準備しています。";
      providerOutput.textContent = error instanceof Error ? error.message : "LOCAL JSON / SNAPSHOT";
    }
  };

  let sourceSignalSnapshot = null;
  const sourceSignalVector = new Float32Array(MODE_COUNT);
  const getSourceSignalVector = () => {
    if (!gaiaSnapshot || sourceSignalSnapshot === gaiaSnapshot) return sourceSignalVector;
    const modeSignals = (id) => gaiaModeById.get(id)?.signals || {};
    const mean = (rows, selector) => rows.length
      ? rows.reduce((sum, row) => sum + selector(row), 0) / rows.length
      : 0;
    const air = modeSignals("breathing-earth");
    const currents = modeSignals("blue-circulation");
    const forest = modeSignals("forest-cloud-engine");
    const waste = modeSignals("nothing-is-waste");
    const city = modeSignals("anthropocene-scar");
    const quake = modeSignals("rhythm-of-disaster");
    const ecologies = modeSignals("three-ecologies");
    const energy = modeSignals("earth-organ");
    const population = modeSignals("population-tide");
    const latestCo2 = air.co2?.at(-1)?.deseasonalizedPpm || 315;
    sourceSignalVector.set([
      clamp((latestCo2 - 315) / 120, 0, 1),
      clamp(mean(currents.currents || [], (row) => Math.hypot(row.uMs, row.vMs)) / 0.7, 0, 1),
      clamp(mean(forest.precipitation || [], (row) => row.precipitationMmDay || 0) / 8, 0, 1),
      clamp(mean(waste.countryWaste || [], (row) => row.recyclePercent || 0) / 100, 0, 1),
      clamp(mean(city.emissions || [], (row) => Math.log10(Math.max(1, row.emissionsMtCo2 || 1))) / 4.2, 0, 1),
      clamp((Math.max(...(quake.globalEvents || []).map((row) => row.magnitude || 7.5), 7.5) - 7.5) / 2, 0, 1),
      clamp(mean(ecologies.social || [], (row) => row.urbanPercent || 0) / 100, 0, 1),
      clamp(mean(energy.current || [], (row) => row.renewablePercent || 0) / 100, 0, 1),
      clamp(mean(population.population || [], (row) => Math.log10(Math.max(1, row.population || 1))) / 10, 0, 1),
    ]);
    sourceSignalSnapshot = gaiaSnapshot;
    return sourceSignalVector;
  };

  const updateSignalInterface = () => {
    const signalMode = getActiveSignalMode();
    const readout = getSignalReadout(signalMode);
    const isStoryTemperatureInteraction = storyModeDetour?.kind === "map01"
      && storyModeDetour.phase === "temperature-anomaly";
    const isBreathingTimeline = signalMode?.id === "breathing-earth";
    const isCirculationTimeline = signalMode?.id === "blue-circulation";
    const isWasteCountrySelector = signalMode?.id === "nothing-is-waste";
    const sequenceState = !isBreathingTimeline && !isCirculationTimeline
      ? getMapSequenceState(signalMode)
      : null;
    const breathingState = isBreathingTimeline ? getBreathingEarthState(signalMode) : null;
    const timelineState = isBreathingTimeline
      ? breathingState.timeline
      : isCirculationTimeline
        ? getBlueCirculationState(signalMode)
        : sequenceState;
    const showTimeline = Boolean(japanIsOpen && timelineState);
    co2TimelineDisplay.hidden = !showTimeline;
    japanLayer.classList.toggle("is-co2-timeline", showTimeline);
    if (showTimeline) {
      co2TimelineDisplay.dataset.phase = timelineState.kind;
      const timelineTransport = isWasteCountrySelector
        ? "MANUAL SELECT"
        : reducedMotion
        ? signalMode?.id === "rhythm-of-disaster"
          ? "AUTO · REDUCED FX"
          : "STATIC"
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
      const transitionKey = `${signalMode?.id || "unknown"}:${timelineState.yearLabel}`;
      if (signalMode?.id === "rhythm-of-disaster" && transitionKey !== timelineDisplayTransitionKey) {
        timelineDisplayTransitionKey = transitionKey;
        co2TimelineDisplay.dataset.timeTransitionKey = transitionKey;
        co2TimelineDisplay.classList.remove("is-time-changing");
        if (!reducedMotion) {
          void co2TimelineDisplay.offsetWidth;
          co2TimelineDisplay.classList.add("is-time-changing");
        }
      }
    }
    const activeSignalConsoles = storyModeDetour && japanIsOpen
      ? signalConsoles.filter((consoleElement) => consoleElement.classList.contains("signal-console-map"))
      : signalConsoles.filter((consoleElement) => !consoleElement.hidden && consoleElement.isConnected);
    activeSignalConsoles.forEach((consoleElement) => {
      consoleElement.querySelector("[data-signal-act]").textContent = signalMode
        ? `ACT ${signalMode.act.number} / ${signalMode.act.title}`
        : "DATA SNAPSHOT";
      const signalValue = consoleElement.querySelector("[data-signal-value]");
      const signalLocation = isStoryTemperatureInteraction ? "" : readout.location || "";
      signalValue.textContent = isStoryTemperatureInteraction
        ? `${breathingState?.timeline?.referencePpm?.toFixed(1) || "—"} ppm / 気温偏差 ${breathingState?.temperature?.anomalyC?.toFixed(2) ?? "—"} ℃`
        : signalLocation
          ? `${signalLocation}\n${readout.value}`
          : readout.value;
      signalValue.classList.toggle("has-location", Boolean(signalLocation));
      consoleElement.querySelector("[data-signal-time-output]").textContent = readout.output;
      consoleElement.querySelector("[data-signal-time-label]").textContent = showTimeline
        ? isStoryTemperatureInteraction
          ? "年代を動かす / DRAG"
          : timelineState.timeLabel || (isCirculationTimeline
            ? "経過日数 / 0→14日（自動）"
            : `時点 / AUTO 1958→2050${storyModeDetour?.kind === "map01" ? " · 3×" : ""}`)
        : "観測時点";
      const input = consoleElement.querySelector("[data-signal-time]");
      if (isWasteCountrySelector) {
        const rowCount = signalMode.signals.countryWaste?.length || 1;
        input.min = "0";
        input.max = String(Math.max(0, rowCount - 1));
        input.step = "1";
        input.value = String(sequenceState?.selectedIndex || 0);
      } else {
        input.min = "0";
        input.max = "100";
        input.step = "1";
        input.value = String(signalTimePosition);
      }
      input.disabled = !readout.temporal;
      if (isWasteCountrySelector) {
        input.setAttribute("aria-label", "表示する国・地域を選ぶ");
        input.setAttribute("aria-valuetext", `${sequenceState.selectedIndex + 1}番目、${sequenceState.selected.country}、再資源化率 ${sequenceState.sourceRecycle.toFixed(1)}%、${sequenceState.selected.valueStatus === "IMPUTED" ? "補完値" : "国連公式値"}`);
      } else {
        input.removeAttribute("aria-label");
        input.removeAttribute("aria-valuetext");
      }
      consoleElement.classList.toggle("is-static", !readout.temporal);
    });
    if (mapSignalEncodingLegend) {
      const showEncodingLegend = Boolean(timelineState);
      if (mapSignalEncodingLegendTitle) mapSignalEncodingLegendTitle.hidden = !showEncodingLegend;
      mapSignalEncodingLegend.hidden = !showEncodingLegend;
      if (mapMobileLegendToggle) {
        mapMobileLegendToggle.hidden = !showEncodingLegend;
        if (!showEncodingLegend) {
          mapMobileLegendToggle.setAttribute("aria-expanded", "false");
          japanLayer.classList.remove("is-mobile-legend-expanded");
        }
      }
      mapSignalEncodingLegend.dataset.mode = timelineState?.kind || "co2";
      if (showEncodingLegend) {
        const setEncodingLabel = (key, value) => {
          const element = mapSignalEncodingLegend.querySelector(`[data-encoding-label="${key}"]`);
          if (element) element.lastChild.textContent = value;
        };

        if (sequenceState) {
          const keys = ["heatmap", "nodata", "estimate", "resolution"];
          sequenceState.legend.forEach((label, index) => setEncodingLabel(keys[index], label));
        } else if (isCirculationTimeline) {
          setEncodingLabel("heatmap", "色付き矢印 / 海流");
          setEncodingLabel("nodata", "暗い場所 / データなし");
          setEncodingLabel("estimate", "点から伸びる線 / 仮定の移動");
          setEncodingLabel("resolution", "白い矢印 / 風（比較用）");
        } else {
          setEncodingLabel("heatmap", isStoryTemperatureInteraction ? "背景色 / 気温偏差" : "色 / CO₂濃度");
          setEncodingLabel("nodata", isStoryTemperatureInteraction ? "地図セル / CO₂濃度" : "斜線 / まわりから補った値");
          setEncodingLabel("estimate", isStoryTemperatureInteraction ? "年代 / 同じ時点" : "表示 / データの種類");
          setEncodingLabel("resolution", isStoryTemperatureInteraction ? "地点 / 地図に触れる" : "1セル / 2.5°");
        }
      }
    }
    updateMapTransformationReceipt();
  };

  const getActiveTimelineDuration = () => {
    const id = getActiveSignalMode()?.id;
    const baseDuration = id === "breathing-earth"
      ? CO2_TIMELINE_DURATION_MS
      : id === "blue-circulation"
        ? CIRCULATION_TIMELINE_DURATION_MS
        : id === "rhythm-of-disaster"
          ? GLOBAL_EARTHQUAKE_TIMELINE_DURATION_MS
          : id === "three-ecologies"
            ? ECOLOGIES_SEQUENCE_DURATION_MS
            : MODE_SEQUENCE_DURATION_MS;
    return storyModeDetour?.kind === "map01" && storyModeDetour.phase !== "temperature-anomaly"
      ? baseDuration / STORY_MAP_TIMELINE_SPEED
      : baseDuration;
  };

  const destroyStoryMapAivaBackdrop = () => {
    storyMapAivaRuntime?.destroy?.();
    storyMapAivaRuntime = null;
    storyMapAivaBackdrop?.remove();
    storyMapAivaBackdrop = null;
  };

  const mountStoryMapAivaBackdrop = () => {
    destroyStoryMapAivaBackdrop();
    const shell = document.createElement("div");
    const universe = document.createElement("canvas");
    shell.className = "story-map-aiva-backdrop";
    shell.setAttribute("aria-hidden", "true");
    universe.className = "story-map-aiva-universe";
    universe.setAttribute("aria-hidden", "true");
    shell.append(universe);
    experience.append(shell);
    storyMapAivaBackdrop = shell;

    const createRuntime = () => {
      if (!shell.isConnected) return;
      storyMapAivaRuntime = globalThis.GaiaTrueEndWebGL?.create?.({
        canvas: universe,
        shell,
        onRestore: () => {
          storyMapAivaRuntime?.destroy?.();
          storyMapAivaRuntime = null;
          createRuntime();
        },
      }) || null;
      if (!storyMapAivaRuntime) {
        shell.dataset.webglState = "fallback";
        return;
      }
      shell.dataset.webglState = "active";
      void storyMapAivaRuntime.setScene?.("reconstruction", { immediate: true });
      void storyMapAivaRuntime.setPresence?.("system", {
        emphasis: true,
        signal: "map01-co2-timeline",
        immediate: true,
      });
    };

    createRuntime();
    requestAnimationFrame(() => shell.classList.add("is-visible"));
  };

  const completeStoryMapTimeline = ({ finalFrameMs = STORY_MAP_FINAL_FRAME_MS } = {}) => {
    if (storyModeDetour?.kind !== "map01" || storyModeDetour.phase === "temperature-anomaly" || storyMapTimelineCompleted) return;
    storyMapTimelineCompleted = true;
    signalTimePosition = 100;
    co2TimelineLastStep = -1;
    updateSignalInterface();
    window.clearTimeout(storyMapReturnTimer);
    storyMapReturnTimer = window.setTimeout(() => {
      storyMapReturnTimer = 0;
      if (storyModeDetour?.kind !== "map01") return;
      window.dispatchEvent(new CustomEvent("gaia:story-mode-auto-complete", {
        detail: { kind: "map01", view: "timeline_complete" },
      }));
    }, finalFrameMs);
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
    earthquakeYearTransition.generation = -1;
    earthquakeYearTransition.currentYear = "";
    earthquakeYearTransition.currentEvents = [];
    gosatHeatmapCacheKey = "";
    updateSignalInterface();
  };

  const updateCo2TimelineAnimation = (now) => {
    const signalMode = getActiveSignalMode();
    const isTimelineMode = Boolean(signalMode);
    const reducedMotionStillAdvances = signalMode?.id === "rhythm-of-disaster";
    if (
      (reducedMotion && !reducedMotionStillAdvances) ||
      !japanIsOpen ||
      !isTimelineMode ||
      signalMode.id === "nothing-is-waste" ||
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
          : signalMode.id === "rhythm-of-disaster"
            ? GLOBAL_EARTHQUAKE_YEAR_COUNT
          : MODE_SEQUENCE_STEPS;
    const elapsed = now - co2TimelineStartedAt;
    if (storyModeDetour?.kind === "map01" && storyModeDetour.phase !== "temperature-anomaly" && elapsed >= duration) {
      completeStoryMapTimeline();
      return;
    }
    const loopProgress = (elapsed % duration) / duration;
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
// The OLS projection assumes an unchanged linear trend; it is not a climate model.

// SOURCE: NOAA SWPC OVATION 30–90 minute forecast, refreshed every five minutes.
// The grid remains a forecast/model layer: cloud and daylight visibility are not inferred.
drawSoftPolarRibbon(ovationAuroraGrid, {
  palette: ["emerald", "cyan", "pale-gold"],
  composite: "screen",
});`,
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
drawLargeRainCircle(selectedSite, vaporDensity); // larger diameter = more mm/day
drawMercatorRaster(modisIgbpLandCover2023); // GLOBAL rendered classification
// 31 representative points only: no interpolation, correlation coefficient, or causal claim.`,
    "pollination-protocol": `const stages = ["records", "sampling", "relations"];
drawGbifObservationPoints(gbifOccurrences); // records, not a habitat map
showSamplingRule("31 selected countries", "max 2 records per country");

const documented = globi.filter(row => row.interaction === "pollinates");
drawNonGeographicRelationNetwork(documented); // no location, frequency, or strength
// A blank map area is not absence. Never connect a GloBI relation to a GBIF point.`,
    "nothing-is-waste": `const observed = unSdgCountryValues; // SOURCE / 17 reported regions
const missingCountry = selectedSites.filter(site => !observed.has(site.iso3));
for (const country of missingCountry) {
  const donors = nearestCountriesWithOfficialValues(country, 5);
  country.recyclePercent = median(donors.map(d => d.recyclePercent)); // DERIVED
  country.valueStatus = "IMPUTED";
}

const country = allCountryValues[countrySelectorIndex]; // 01–31 / slider or arrow buttons
drawFixedDiameterPie({ recycled: country.recyclePercent, other: 100 - country.recyclePercent });
drawOutline(country.valueStatus === "IMPUTED" ? "DASHED" : "SOLID");
// Geographic proximity does not explain policy or reporting-definition differences.
showCountryValue({
  country: country.country,
  recyclePercent: country.recyclePercent,
  year: country.year,
  sourceStatus: country.valueStatus, // OFFICIAL or IMPUTED
});`,
    "anthropocene-scar": `const year = mix(1945, 2023, timelinePosition);
const countryValues = gcpFossilCo2.filter(row => row.year === year);
for (const country of countryValues) {
  drawEmissionRing(Math.log10(country.emissionsMtCo2)); // COUNTRY VALUE / year snapshot
}

const viirsGeographic = projectWebMercatorRasterToGeographic(viirsNightLights2016);
drawRadianceGlow(viirsGeographic); // FIXED 2016 REFERENCE; not historical night lights
const nightLightOpacity = longPress ? 0.04 : 0.5;
// Night-light radiance is never converted to emissions.`,
    "rhythm-of-disaster": `const years = groupByYear(usgsM75Since2000); // 2000–2026\nconst events = years[selectedYear].sort(byOccurredAt); // this year only; default view is global\nfor (const [index, event] of events.entries()) {\n  await delay(index * 220); // reveal chronologically, one epicenter at a time\n  const feltRadiusKm = estimateFeltRadiusKm(event.magnitude); // M7.5 ≈ 500 km; M9.1 ≈ 2,000 km\n  const durationMs = scale(feltRadiusKm, 500, 2000, 2200, 3600);\n  drawEstimatedFeltRing(event, feltRadiusKm, durationMs);\n}\n// Estimated felt radius is not a ShakeMap, damage zone, or tsunami extent.\n// Only the optional JMA detail layer owns observed intensity:\nconst distanceKm = Math.hypot(greatCircleKm(epicenter, station), depthKm);\nconst pArrivalSec = distanceKm / 7.0;\nconst sArrivalSec = distanceKm / 4.0;\nif (elapsedSec >= sArrivalSec) drawObservedJmaIntensity(station.intensity);`,
    "three-ecologies": `const paired = joinByIso3(countryForestPercent, countryUrbanPercent); // same countries only
const relation = pearson(paired.map(row => [row.urbanPercent, row.forestPercent]));
const trend = linearRegression(paired); // display the tendency and each residual
drawPairedMapGlyphs(paired, { inner: "forest", outer: "urban", center: "residual" });
drawScatterPlot(paired, trend, relation); // x = urban %, y = forest %

drawForestRaster(modisIgbp2023, { opacity: 0.16 }); // geographic context, not correlation input
drawMemoryContext(unescoGlobalSample); // purple sites; deliberately excluded from r
// COUNTRY VALUES with different latest years. Correlation is not causation.`,
    "earth-organ": `const countries = joinByIso3(countryRenewableShare, naturalEarthCountries);
drawCountryChoropleth(countries, { scale: "dark-blue 0% → cyan 100%" });
const selected = countries.sort(byRenewableShare)[sequenceIndex];
drawSelectedPotential(selected.solarKwhM2Day, selected.windSpeedMs);
// Solar and wind are context, not a causal model of the current electricity share.`,
    "population-tide": `const year = mix(1960, 2025, timelinePosition);
const countryValues = worldBankPopulation.filter(row => row.year === year);
const maximum = Math.max(...countryValues.map(row => row.population));
for (const country of countryValues) {
  const radius = Math.sqrt(country.population / maximum) * maximumRadius;
  drawPopulationCircle(country, radius); // circle area ∝ population
}
// Representative country points: not cities, population density, or environmental load.`,
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
      resolveGaiaSignalsReady?.({ ok: true });
      window.dispatchEvent(new CustomEvent("gaia:signals-ready"));
    } catch (error) {
      console.error(error);
      gaiaSnapshotError = error instanceof Error ? error.message : String(error);
      updateSignalInterface();
      resolveGaiaSignalsReady?.({ ok: false, error: gaiaSnapshotError });
      window.dispatchEvent(new CustomEvent("gaia:signals-error", { detail: { error: gaiaSnapshotError } }));
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

  const loadNaturalEarthCountries = async () => {
    try {
      naturalEarthCountryState = "loading";
      naturalEarthCountryError = null;
      const response = await fetch(NATURAL_EARTH_COUNTRY_DATA, { cache: "force-cache" });
      if (!response.ok) throw new Error(`Natural Earth countries ${response.status}`);
      const geojson = await response.json();
      const countryRings = new Map();
      const boundaryRings = [];

      for (const feature of geojson.features || []) {
        const { geometry, properties = {} } = feature;
        if (!geometry) continue;
        const polygons = geometry.type === "Polygon"
          ? [geometry.coordinates]
          : geometry.type === "MultiPolygon"
            ? geometry.coordinates
            : [];
        for (const polygon of polygons) {
          for (const ring of polygon) {
            if (Array.isArray(ring) && ring.length >= 3) boundaryRings.push(ring);
          }
        }
        const iso3 = [properties.ADM0_A3, properties.ISO_A3, properties.SOV_A3, properties.BRK_A3, properties.WB_A3]
          .find((code) => typeof code === "string" && /^[A-Z]{3}$/.test(code) && code !== "-99");
        if (!iso3) continue;
        const rings = countryRings.get(iso3) || [];
        for (const polygon of polygons) {
          for (const ring of polygon) {
            if (Array.isArray(ring) && ring.length >= 3) rings.push(ring);
          }
        }
        if (rings.length) countryRings.set(iso3, rings);
      }

      if (countryRings.size < 200) {
        throw new Error(`Natural Earth country geometry incomplete (${countryRings.size} countries)`);
      }
      if (boundaryRings.length < 400) {
        throw new Error(`Natural Earth boundary geometry incomplete (${boundaryRings.length} rings)`);
      }
      naturalEarthCountryRings = countryRings;
      naturalEarthCountryBoundaryRings = boundaryRings;
      naturalEarthCountryPathCache.clear();
      naturalEarthCountryState = "ready";
      referenceWorldCacheKey = "";
      japanTilesDirty = true;
      updateMapBasisNote();
    } catch (error) {
      console.error(error);
      naturalEarthCountryError = error instanceof Error ? error.message : String(error);
      naturalEarthCountryState = "error";
      referenceWorldCacheKey = "";
      updateMapBasisNote();
    }
  };

  const loadJapanPrefectureBoundaries = async () => {
    try {
      japanPrefectureBoundaryState = "loading";
      japanPrefectureBoundaryError = null;
      updateMapBasisNote();
      const response = await fetch(JAPAN_PREFECTURE_DATA, { cache: "force-cache" });
      if (!response.ok) throw new Error(`Japan prefectures ${response.status}`);
      const topology = await response.json();
      const geometries = topology?.objects?.japan?.geometries || [];
      const topologyArcs = topology?.arcs || [];
      const scale = topology?.transform?.scale;
      const translate = topology?.transform?.translate;
      if (topology?.type !== "Topology" || geometries.length !== 47
        || !Array.isArray(scale) || !Array.isArray(translate)) {
        throw new Error("Japan prefecture topology is incomplete");
      }

      const referencedArcIndexes = new Set();
      const collectArcIndexes = (value) => {
        if (Number.isInteger(value)) {
          referencedArcIndexes.add(value < 0 ? ~value : value);
          return;
        }
        if (Array.isArray(value)) value.forEach(collectArcIndexes);
      };
      geometries.forEach(({ arcs }) => collectArcIndexes(arcs));

      const decodedArcs = [];
      for (const arcIndex of referencedArcIndexes) {
        const rawArc = topologyArcs[arcIndex];
        if (!Array.isArray(rawArc) || rawArc.length < 2) continue;
        let x = 0;
        let y = 0;
        const arc = rawArc.map(([deltaX, deltaY]) => {
          x += deltaX;
          y += deltaY;
          return [x * scale[0] + translate[0], y * scale[1] + translate[1]];
        });
        if (arc.every(([longitude, latitude]) => Number.isFinite(longitude) && Number.isFinite(latitude))) {
          decodedArcs.push(arc);
        }
      }
      if (decodedArcs.length < 1000) {
        throw new Error(`Japan prefecture boundary geometry incomplete (${decodedArcs.length} arcs)`);
      }

      japanPrefectureBoundaryArcs = decodedArcs;
      japanPrefectureBoundaryPathCache.clear();
      japanPrefectureBoundaryState = "ready";
      referenceWorldCacheKey = "";
      japanTilesDirty = true;
      updateMapBasisNote();
    } catch (error) {
      console.error(error);
      japanPrefectureBoundaryError = error instanceof Error ? error.message : String(error);
      japanPrefectureBoundaryState = "error";
      referenceWorldCacheKey = "";
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
      const activeSignalMode = getActiveSignalMode();
      const isWasteCountrySelector = activeSignalMode?.id === "nothing-is-waste";
      if (isWasteCountrySelector) {
        const rowCount = activeSignalMode.signals.countryWaste?.length || 1;
        wasteSelectedIndex = clamp(Math.round(Number(input.value)), 0, rowCount - 1);
        signalTimePosition = rowCount > 1
          ? (wasteSelectedIndex / (rowCount - 1)) * 100
          : 0;
      } else {
        signalTimePosition = Number(input.value);
      }
      if (japanIsOpen) {
        co2TimelineHeld = storyModeDetour?.phase === "temperature-anomaly";
        const manualPauseMs = activeSignalMode?.id === "rhythm-of-disaster"
          ? GLOBAL_EARTHQUAKE_YEAR_DWELL_MS
          : CO2_TIMELINE_MANUAL_PAUSE_MS;
        co2TimelinePausedUntil = performance.now() + manualPauseMs;
        co2TimelineLastStep = -1;
      }
      signalTimeInputs.forEach((peer) => {
        if (peer !== input) peer.value = String(isWasteCountrySelector ? wasteSelectedIndex : signalTimePosition);
      });
      if (storyModeDetour?.kind === "map01") storyModeDetour.views.add("long_term");
      updateSignalInterface();
      if (storyModeDetour?.kind === "map01") {
        window.dispatchEvent(new CustomEvent("gaia:story-map-interaction", {
          detail: { kind: "map01", view: "long_term", position: signalTimePosition },
        }));
      }
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
    introLayer.scrollLeft = 0;
    setIntroVisual(showingPath ? "default" : introSelectedPath);
    const visibleStage = showingPath ? introPathStage : introSenseStage;
    animateIntroStage(visibleStage, { revealPanels });
    if (!focus) return;
    requestAnimationFrame(() => {
      const target = showingPath
        ? introPathButtons[0]
        : introModeButtons.find((button) => button.getAttribute("aria-selected") === "true" && !button.hidden)
          || introPathBack;
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
          detail: { index: modeToIndex % SPACE_MODE_CHOICES.length },
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
    const choices = introSelectedPath === "space" ? SPACE_MODE_CHOICES : INTRO_MODE_CHOICES;
    const normalizedIndex = ((previewIndex % choices.length) + choices.length) % choices.length;
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
      button.hidden = !option;
      button.disabled = !option;
      if (option && label && cue) {
        label.textContent = option.label;
        cue.textContent = option.cue;
        button.setAttribute(
          "aria-label",
          `${formatModeNumber(index)} ${option.label}、${option.cue}`,
        );
      }
      button.setAttribute("aria-selected", option && index === normalizedIndex ? "true" : "false");
      button.tabIndex = option && index === normalizedIndex ? 0 : -1;
    });
  };

  const updateModeInterface = () => {
    const mode = modes[modeToIndex];
    const selectedMapMode = modes[mapModeIndex];
    modeNumber.textContent = formatModeNumber(modeToIndex);
    modeTitle.textContent = mode.title;
    modeTitleJa.textContent = mode.titleJa;
    modeDescription.textContent = mode.description;
    experience.style.setProperty("--accent", mode.accent);
    experience.style.setProperty("--accent-rgb", mode.rgb);
    japanLayer.style.setProperty("--map-accent", mode.accent);
    japanLayer.style.setProperty("--map-accent-rgb", mode.rgb);
    japanLayer.classList.toggle("is-earthquake-mode", isTheme(5));
    japanModeNumber.textContent = formatModeNumber(mapModeIndex);
    japanModeTitle.textContent = selectedMapMode.titleJa;
    japanModeBank.dataset.activeMode = formatModeNumber(mapModeIndex);
    const mapHeadingNumber = formatModeNumber(mapModeIndex);
    const mapTitleChanged = japanTitle.textContent !== mode.titleJa
      || japanTitle.dataset.exhibitNumber !== mapHeadingNumber;
    japanTitle.dataset.exhibitNumber = mapHeadingNumber;
    japanTitle.textContent = mode.titleJa;
    japanTitle.setAttribute("aria-label", `${mapHeadingNumber} ${mode.titleJa}`);
    if (mapTitleChanged) animateMapTitleTransition(`${mapHeadingNumber}　${mode.titleJa}`);
    document.querySelector('meta[name="theme-color"]').setAttribute("content", "#03070d");

    modeButtons.forEach((button, index) => {
      button.setAttribute("aria-current", index === modeToIndex ? "true" : "false");
    });
    conceptModeButtons.forEach((button, index) => {
      button.setAttribute("aria-current", index === modeToIndex ? "true" : "false");
    });
    japanModeButtons.forEach((button, index) => {
      button.setAttribute("aria-current", index === mapModeIndex ? "true" : "false");
    });
    updateIntroSelection();

    renderSource();
    renderConcept();
    updateSignalInterface();
    const signalMode = getActiveSignalMode();
    if (
      signalMode?.id === "forest-cloud-engine"
      && japanOverlay.dataset.forestMask !== "ready"
      && japanOverlay.dataset.forestMask !== "fallback"
    ) {
      scheduleForestRasterPreparation();
    }
    if (signalMode && gaiaSnapshot) {
      updateMapObservationNarrative();
      dataLedger.updateMode(
        { ...signalMode, titleJa: mode.titleJa },
        modeToIndex + 1,
        gaiaSnapshot.generatedAt,
      );
    }
    window.dispatchEvent(new CustomEvent("gaia:japan-mode-change"));
  };

  const readIntroStoryDestination = () => {
    let mainEndingComplete = false;
    let apeironceneComplete = false;
    let apeironcenePending = false;
    try {
      const progress = JSON.parse(window.localStorage.getItem("gaiaSensewareNovel:progress") || "null");
      mainEndingComplete = progress?.clear === true || globalThis.GaiaNovel?.getState?.().clear === true;
      apeironceneComplete = Boolean(
        progress?.trueEndComplete === true
        || window.localStorage.getItem("gaiaSensewareTrueEnd:complete:v1")
        || globalThis.GaiaTrueEnd?.isComplete?.(),
      );
      apeironcenePending = Boolean(window.localStorage.getItem("gaiaSensewareTrueEnd:pending:v1"));
    } catch {
      // Storage is optional; the ordinary story route remains available.
    }
    return apeironcenePending || (mainEndingComplete && !apeironceneComplete)
      ? "apeironcene"
      : "story";
  };

  const clearIntroStoryRevealTimers = () => {
    window.clearTimeout(introStoryRevealStartTimer);
    window.clearTimeout(introStoryRevealCommitTimer);
    introStoryRevealStartTimer = 0;
    introStoryRevealCommitTimer = 0;
  };

  const renderIntroStoryDestination = (destination) => {
    const isApeironcene = destination === "apeironcene";
    introStoryReturn.dataset.storyDestination = destination;
    introStoryReturn.querySelector("span")?.replaceChildren(isApeironcene ? "TRUE END / UNLOCKED" : "MAIN STORY");
    introStoryReturn.querySelector("strong")?.replaceChildren(
      isApeironcene ? "星々の放課後 ～APEIRONCENE～" : "物語をはじめる",
    );
    introStoryReturn.setAttribute(
      "aria-label",
      isApeironcene ? "星々の放課後 APEIRONCENEへ進む" : "物語をはじめる",
    );
  };

  const syncIntroStoryReturn = () => {
    if (!(introStoryReturn instanceof HTMLButtonElement)) return;
    const destination = readIntroStoryDestination();
    if (destination !== "apeironcene") {
      clearIntroStoryRevealTimers();
      introApeironceneRevealed = false;
      introStoryReturn.classList.remove("is-apeironcene-awakening", "is-apeironcene");
      renderIntroStoryDestination("story");
      return;
    }
    if (introApeironceneRevealed) {
      clearIntroStoryRevealTimers();
      introStoryReturn.classList.remove("is-apeironcene-awakening");
      introStoryReturn.classList.add("is-apeironcene");
      renderIntroStoryDestination("apeironcene");
      return;
    }

    introStoryReturn.classList.remove("is-apeironcene-awakening", "is-apeironcene");
    renderIntroStoryDestination("story");
    if (!introIsOpen || introLayer.hidden || introLayer.getAttribute("aria-hidden") !== "false") return;
    if (introStoryRevealStartTimer || introStoryRevealCommitTimer) return;

    const revealStartDelay = reducedMotion ? 220 : 680;
    const revealCommitDelay = reducedMotion ? 460 : 1420;
    introStoryRevealStartTimer = window.setTimeout(() => {
      introStoryRevealStartTimer = 0;
      if (!introIsOpen || readIntroStoryDestination() !== "apeironcene") return;
      introStoryReturn.classList.add("is-apeironcene-awakening");
      window.dispatchEvent(new CustomEvent("gaia:apeironcene-entry-reveal-start"));
    }, revealStartDelay);
    introStoryRevealCommitTimer = window.setTimeout(() => {
      introStoryRevealCommitTimer = 0;
      if (!introIsOpen || readIntroStoryDestination() !== "apeironcene") {
        introStoryReturn.classList.remove("is-apeironcene-awakening");
        return;
      }
      introApeironceneRevealed = true;
      renderIntroStoryDestination("apeironcene");
      introStoryReturn.classList.remove("is-apeironcene-awakening");
      introStoryReturn.classList.add("is-apeironcene");
      window.dispatchEvent(new CustomEvent("gaia:apeironcene-entry-revealed"));
    }, revealCommitDelay);
  };

  window.addEventListener("gaia:story-progression-change", syncIntroStoryReturn);
  window.addEventListener("gaia:true-end-complete", syncIntroStoryReturn);
  window.addEventListener("storage", (event) => {
    if (["gaiaSensewareNovel:progress", "gaiaSensewareTrueEnd:complete:v1", "gaiaSensewareTrueEnd:pending:v1"].includes(event.key)) {
      syncIntroStoryReturn();
    }
  });

  const selectMode = (index, { resetAutoTimer = true } = {}) => {
    const normalizedIndex = (index + MODE_COUNT) % MODE_COUNT;
    if (japanIsOpen) clearJapanPoiHover();
    if (normalizedIndex === modeToIndex) {
      if (japanIsOpen) {
        restartMapPlotReveal("mode-reselect");
        restartCo2Timeline(0);
        if (isTheme(5, normalizedIndex)) setJapanDataLayer("snapshot");
        animateEarthViewForMode(normalizedIndex);
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
      restartMapPlotReveal("mode-change");
      restartCo2Timeline(0);
      if (isTheme(5, normalizedIndex)) setJapanDataLayer("snapshot");
      animateEarthViewForMode(normalizedIndex);
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

  const setMobileMapLegendExpanded = (expanded) => {
    const shouldExpand = Boolean(expanded && usesCompactMapUi() && !mapMobileLegendToggle?.hidden);
    japanLayer.classList.toggle("is-mobile-legend-expanded", shouldExpand);
    mapMobileLegendToggle?.setAttribute("aria-expanded", String(shouldExpand));
    mapMobileLegendToggle?.querySelector("strong")?.replaceChildren(shouldExpand ? "閉じる" : "凡例");
  };

  const setMobileMapHeadingExpanded = (expanded) => {
    const shouldExpand = Boolean(expanded && usesCompactMapUi());
    japanLayer.classList.toggle("is-mobile-heading-expanded", shouldExpand);
    mapMobileHeadingToggle?.setAttribute("aria-expanded", String(shouldExpand));
    mapMobileHeadingToggle?.querySelector("strong")?.replaceChildren(shouldExpand ? "閉じる" : "詳細");
    if (shouldExpand) {
      japanLayer.classList.remove("is-mobile-bank-expanded");
      mapMobileBankToggle?.setAttribute("aria-expanded", "false");
      mapMobileBankToggle?.querySelector("strong")?.replaceChildren("展示一覧");
      mapReadingGuide.open = false;
      setMobileMapLegendExpanded(false);
    }
  };

  const setMobileMapBankExpanded = (expanded, { restoreFocus = false } = {}) => {
    const shouldExpand = Boolean(expanded && usesCompactMapUi());
    japanLayer.classList.toggle("is-mobile-bank-expanded", shouldExpand);
    mapMobileBankToggle?.setAttribute("aria-expanded", String(shouldExpand));
    mapMobileBankToggle?.querySelector("strong")?.replaceChildren(shouldExpand ? "閉じる" : "展示一覧");
    if (shouldExpand) {
      setMobileMapHeadingExpanded(false);
      setMobileMapLegendExpanded(false);
      mapReadingGuide.open = false;
    } else if (restoreFocus && usesCompactMapUi()) {
      requestAnimationFrame(() => mapMobileBankToggle?.focus({ preventScroll: true }));
    }
  };

  const resetMobileMapUi = () => {
    setMobileMapHeadingExpanded(false);
    setMobileMapBankExpanded(false);
    setMobileMapLegendExpanded(false);
    if (usesCompactMapUi()) {
      mapReadingGuide.open = false;
    }
  };

  let mapModePreviewAnchor = null;

  const positionMapModeTooltip = (tooltip, button = mapModePreviewAnchor) => {
    const bankRect = japanModeBank.getBoundingClientRect();
    const mobile = innerWidth <= 900;
    const width = mobile
      ? bankRect.width
      : Math.min(430, Math.max(320, innerWidth - 24));
    tooltip.style.width = `${Math.round(width)}px`;
    const tooltipHeight = tooltip.getBoundingClientRect().height;
    const buttonRect = button?.getBoundingClientRect?.();
    let left = bankRect.left;
    let top = Math.max(12, bankRect.top - tooltipHeight - 8);
    let placement = "right";
    if (!mobile && buttonRect) {
      const rightCandidate = buttonRect.right + 10;
      const leftCandidate = buttonRect.left - width - 10;
      const opensRight = rightCandidate + width <= innerWidth - 12;
      left = opensRight ? rightCandidate : Math.max(12, leftCandidate);
      placement = opensRight ? "right" : "left";
      top = Math.max(12, Math.min(
        buttonRect.top + (buttonRect.height - tooltipHeight) / 2,
        innerHeight - tooltipHeight - 12,
      ));
    } else if (!mobile) {
      left = Math.min(bankRect.right + 12, innerWidth - width - 12);
      top = Math.max(12, Math.min(bankRect.bottom - tooltipHeight, innerHeight - tooltipHeight - 12));
    }
    tooltip.style.left = `${Math.round(left)}px`;
    tooltip.style.top = `${Math.round(top)}px`;
    tooltip.dataset.placement = placement;
    if (buttonRect && !mobile) {
      const anchorY = Math.max(18, Math.min(tooltipHeight - 18, buttonRect.top + buttonRect.height / 2 - top));
      tooltip.style.setProperty("--map-tooltip-anchor-y", `${Math.round(anchorY)}px`);
    } else {
      tooltip.style.removeProperty("--map-tooltip-anchor-y");
    }
  };

  const scheduleMapModeTooltipPosition = (tooltip, button = mapModePreviewAnchor) => {
    const position = () => positionMapModeTooltip(tooltip, button);
    requestAnimationFrame(() => {
      position();
      requestAnimationFrame(position);
    });
    window.setTimeout(position, 260);
  };

  const syncMapModePreviewContainer = () => {
    const target = usesCompactMapUi() ? japanModeBank : japanLayer;
    if (mapModePreview.parentElement !== target) target.append(mapModePreview);
  };

  syncMapModePreviewContainer();

  const getMapModePreviewContent = (button) => {
    if (button?.dataset.estatExhibit) {
      const exhibit = globalThis.GaiaEstatExhibits?.definitions?.find(({ id }) => id === button.dataset.estatExhibit);
      if (!exhibit) return null;
      return {
        number: `${exhibit.number} / e-Stat MONTHLY`,
        label: exhibit.shortTitle,
        copy: exhibit.caption,
      };
    }
    if (button?.dataset.liveExhibit) {
      const exhibit = globalThis.GaiaLiveExhibits?.definitions?.find(({ id }) => id === button.dataset.liveExhibit);
      if (!exhibit) return null;
      return {
        number: `${exhibit.number} / ${exhibit.signalLabel}`,
        label: exhibit.shortTitle,
        copy: exhibit.caption,
      };
    }
    const index = japanModeButtons.indexOf(button);
    const choice = INTRO_MODE_CHOICES[index];
    if (!choice) return null;
    return {
      number: `${formatModeNumber(index)} / ${choice.code}`,
      label: `${choice.label}の声`,
      copy: choice.copy,
    };
  };

  const setMapModePreviewOpen = (open, button = null) => {
    if (open) {
      const content = getMapModePreviewContent(button);
      if (!content) return;
      mapModePreviewAnchor = button;
      mapModePreviewNumber.textContent = content.number;
      mapModePreviewLabel.textContent = content.label;
      mapModePreviewCopy.textContent = content.copy;
    } else {
      mapModePreviewAnchor = null;
    }
    mapModePreview.classList.toggle("is-open", Boolean(open));
    mapModePreview.setAttribute("aria-hidden", String(!open));
    if (open && usesCompactMapUi()) {
      mapModePreview.style.removeProperty("width");
      mapModePreview.style.removeProperty("left");
      mapModePreview.style.removeProperty("top");
      requestAnimationFrame(() => mapModePreview.scrollIntoView({ block: "nearest", inline: "nearest" }));
    } else if (open) {
      scheduleMapModeTooltipPosition(mapModePreview, button);
    }
  };

  const closeMapModePreview = () => setMapModePreviewOpen(false);
  const syncMapModePreviewIntent = (scope) => {
    requestAnimationFrame(() => {
      const keyboardButton = scope?.querySelector?.(".map-mode-button:focus-visible");
      const hoverButton = supportsHover
        ? scope?.querySelector?.(".map-mode-button:hover")
        : null;
      const button = keyboardButton || hoverButton;
      if (button) setMapModePreviewOpen(true, button);
      else closeMapModePreview();
    });
  };

  const setLightCanvasMounted = (mounted) => {
    if (mounted) {
      if (canvas.parentElement !== japanMap || canvas.nextElementSibling !== japanOverlay) {
        japanOverlay.before(canvas);
      }
      canvas.dataset.mapLayer = "below-reference-map-and-poi";
      return;
    }
    if (canvas.parentElement === canvasHomeParent) return;
    delete canvas.dataset.mapLayer;
    canvasHomeParent.insertBefore(canvas, canvasHomeNextSibling);
  };

  const MAP_LIGHT_OPACITIES = Object.freeze([0.09, 0.72, 0.14, 0.13, 0.15, 0.18, 0.14, 0.17, 0.15]);
  const syncIntegratedMapLight = () => {
    const active = japanIsOpen
      && !japanLayer.classList.contains("is-live-exhibit")
      && !japanLayer.classList.contains("is-estat-exhibit");
    japanLayer.classList.toggle("has-integrated-map-light", active);
    japanModeBank.dataset.mapSurface = "map";
    japanModeBank.dataset.lightIntegration = active ? "mode-matched" : "off";
    if (active) {
      const modeNumber = formatModeNumber(mapModeIndex);
      japanLayer.style.setProperty("--map-light-opacity", String(MAP_LIGHT_OPACITIES[mapModeIndex] ?? 0.15));
      canvas.dataset.integratedMapMode = modeNumber;
      japanOverlay.dataset.layerOrder = "reference-map-and-poi-above-webgl";
        if (modeNumber !== "02") {
        delete canvas.dataset.currentMeanSpeedMs;
        delete canvas.dataset.currentMaximumSpeedMs;
        delete canvas.dataset.currentStrength;
          delete canvas.dataset.currentVectorCount;
          delete canvas.dataset.currentVisiblePoiCount;
          delete canvas.dataset.currentRevealedPoiCount;
          delete canvas.dataset.currentRenderedSampleCount;
          delete canvas.dataset.currentBrushStrokeCount;
          delete canvas.dataset.currentOneStrokePerPoi;
          delete canvas.dataset.currentAllVisiblePoiPainted;
          delete canvas.dataset.currentSampleSelection;
          delete canvas.dataset.currentBrushLanguage;
          delete canvas.dataset.currentAmbientMotion;
          delete japanOverlay.dataset.currentVisiblePoiCount;
          delete japanOverlay.dataset.currentPoiMarkerCount;
          delete japanOverlay.dataset.currentPoiMarkerStyle;
      }
      setLightCanvasMounted(true);
    } else {
      japanLayer.style.removeProperty("--map-light-opacity");
      delete canvas.dataset.integratedMapMode;
      delete canvas.dataset.currentMeanSpeedMs;
      delete canvas.dataset.currentMaximumSpeedMs;
      delete canvas.dataset.currentStrength;
      delete canvas.dataset.currentVectorCount;
      delete canvas.dataset.currentVisiblePoiCount;
      delete canvas.dataset.currentRevealedPoiCount;
      delete canvas.dataset.currentRenderedSampleCount;
      delete canvas.dataset.currentBrushStrokeCount;
      delete canvas.dataset.currentOneStrokePerPoi;
      delete canvas.dataset.currentAllVisiblePoiPainted;
      delete canvas.dataset.currentSampleSelection;
      delete canvas.dataset.currentBrushLanguage;
      delete canvas.dataset.currentAmbientMotion;
      delete japanOverlay.dataset.currentVisiblePoiCount;
      delete japanOverlay.dataset.currentPoiMarkerCount;
      delete japanOverlay.dataset.currentPoiMarkerStyle;
      delete japanOverlay.dataset.layerOrder;
      setLightCanvasMounted(false);
    }
  };

  mapMobileHeadingToggle?.addEventListener("click", () => {
    setMobileMapHeadingExpanded(mapMobileHeadingToggle.getAttribute("aria-expanded") !== "true");
  });
  mapMobileBankToggle?.addEventListener("click", () => {
    setMobileMapBankExpanded(mapMobileBankToggle.getAttribute("aria-expanded") !== "true");
  });
  mapMobileLegendToggle?.addEventListener("click", () => {
    const expand = mapMobileLegendToggle.getAttribute("aria-expanded") !== "true";
    if (expand) {
      setMobileMapHeadingExpanded(false);
      setMobileMapBankExpanded(false);
      mapReadingGuide.open = false;
    }
    setMobileMapLegendExpanded(expand);
  });
  mapReadingGuide.addEventListener("toggle", () => {
    if (!usesCompactMapUi() || !mapReadingGuide.open) return;
    setMobileMapHeadingExpanded(false);
    setMobileMapBankExpanded(false);
    setMobileMapLegendExpanded(false);
  });
  japanModeBank.addEventListener("pointerover", (event) => {
    if (!supportsHover) return;
    const button = event.target.closest?.(".map-mode-button");
    if (button) setMapModePreviewOpen(true, button);
  });
  japanModeBank.addEventListener("pointerout", () => syncMapModePreviewIntent(japanModeBank));
  japanModeBank.addEventListener("focusin", () => syncMapModePreviewIntent(japanModeBank));
  japanModeBank.addEventListener("focusout", () => syncMapModePreviewIntent(japanModeBank));
  japanModeBank.addEventListener("click", (event) => {
    const button = event.target.closest?.(".map-mode-button");
    if (!button) return;
    syncMapModePreviewIntent(japanModeBank);
  }, true);
  window.addEventListener("gaia:live-exhibit-mounted", () => {
    japanModeList.querySelectorAll("[data-live-exhibit]").forEach((button) => {
      button.dataset.mapPreviewSurface = "map";
      button.setAttribute("aria-describedby", "map-mode-preview");
    });
  });
  window.addEventListener("gaia:live-exhibit-change", (event) => {
    if (event.detail?.id) {
      setMobileMapBankExpanded(false, { restoreFocus: true });
    }
    syncIntegratedMapLight();
  });
  window.addEventListener("gaia:estat-exhibit-change", (event) => {
    if (event.detail?.id) setMobileMapBankExpanded(false, { restoreFocus: true });
    syncIntegratedMapLight();
  });
  window.addEventListener("gaia:estat-exhibit-mounted", () => {
    japanModeBank.querySelectorAll("[data-estat-exhibit]").forEach((button) => {
      button.dataset.mapPreviewSurface = "map";
      button.setAttribute("aria-describedby", "map-mode-preview");
    });
  });
  let compactMapUiWasActive = usesCompactMapUi();
  window.addEventListener("resize", () => {
    const compactMapUiIsActive = usesCompactMapUi();
    if (compactMapUiIsActive && !compactMapUiWasActive) resetMobileMapUi();
    if (!compactMapUiIsActive && compactMapUiWasActive) resetMobileMapUi();
    compactMapUiWasActive = compactMapUiIsActive;
    syncMapModePreviewContainer();
    if (mapModePreview.classList.contains("is-open") && !compactMapUiIsActive) {
      scheduleMapModeTooltipPosition(mapModePreview, mapModePreviewAnchor);
    }
  }, { passive: true });

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
    japanModeButton.dataset.mapPreviewSurface = "map";
    japanModeButton.setAttribute("aria-describedby", "map-mode-preview");
    japanModeButton.setAttribute("aria-current", index === 0 ? "true" : "false");
    japanModeButton.addEventListener("click", () => {
      mapModeIndex = index;
      selectMode(mapModeIndex);
      syncIntegratedMapLight();
      setMobileMapBankExpanded(false, { restoreFocus: true });
    });
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
        const source = button.dataset.storyDestination === "apeironcene" ? "apeironcene" : "title-menu";
        runSceneTransition(() => {
          closeIntro({ restoreFocus: false });
          window.dispatchEvent(new CustomEvent("gaia:novel-open-at-mode", {
            detail: { index: 0, source },
          }));
        }, path, event);
        return;
      }
      if (path === "map") {
        runSceneTransition(() => {
          japanModeButtons[0]?.click();
          closeIntro({ restoreFocus: false });
          openJapan({ respectUrlMode: false, focusModeBank: true });
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
    clearJapanPoiHover();
    cancelEarthViewAnimation("user-pointer");
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
    if (!japanIsOpen) {
      return;
    }
    if (!japanView.pointers.has(event.pointerId)) {
      updateJapanPoiHover(event);
      return;
    }
    clearJapanPoiHover();
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
        isTheme(4) &&
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
    if (createPulse && ["map01", "map03", "map08"].includes(storyModeDetour?.kind)) {
      if (storyModeDetour.kind === "map01") storyModeDetour.views.add("temperature_anomaly");
      updateSignalInterface();
      window.dispatchEvent(new CustomEvent("gaia:story-map-interaction", {
        detail: {
          kind: storyModeDetour.kind,
          ...(storyModeDetour.kind === "map01" ? { view: "temperature_anomaly" } : {}),
        },
      }));
    }
  };

  japanMap.addEventListener("pointerup", (event) => releaseJapanPointer(event, true));
  japanMap.addEventListener("pointercancel", (event) =>
    releaseJapanPointer(event, false),
  );
  japanMap.addEventListener("pointerleave", () => {
    if (japanView.pointers.size === 0) clearJapanPoiHover();
  });

  const shouldPreserveMapUiWheel = (target) => target instanceof Element && Boolean(target.closest([
    "#japan-data-panel",
    "#gaia-statistics-lab",
    ".gaia-live-exhibit-readout",
    "#japan-mode-list",
    "input",
    "select",
    "textarea",
    "[contenteditable='true']",
  ].join(",")));

  japanMap.addEventListener(
    "wheel",
    (event) => {
      if (!japanIsOpen || mapScope !== "earth") return;
      if (shouldPreserveMapUiWheel(event.target)) return;
      clearJapanPoiHover();
      cancelEarthViewAnimation("user-wheel");
      event.preventDefault();
      const deltaUnit = event.deltaMode === 1
        ? 18
        : event.deltaMode === 2
          ? Math.max(1, japanMap.getBoundingClientRect().height)
          : 1;
      const delta = clamp(event.deltaY * deltaUnit, -240, 240);
      if (Math.abs(delta) < 0.01) return;
      const factor = Math.exp(-delta * (event.ctrlKey ? 0.006 : 0.0024));
      setEarthZoom(japanView.earthZoom * factor, event.clientX, event.clientY);
      closeJapanPoi();
    },
    { capture: true, passive: false },
  );

  mapZoomIn.addEventListener("click", () => zoomEarthBy(1.35));
  mapZoomOut.addEventListener("click", () => zoomEarthBy(1 / 1.35));
  mapZoomReset.addEventListener("click", () => {
    resetJapanView();
    japanMap.focus({ preventScroll: true });
  });

  japanMap.addEventListener("keydown", (event) => {
    const movement = event.shiftKey ? 110 : 46;
    if (
      mapScope === "earth" &&
      ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "+", "=", "-", "_", "0"].includes(event.key)
    ) {
      cancelEarthViewAnimation("user-keyboard");
    }
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
      event.preventDefault();
      event.stopPropagation();
      resetJapanView();
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      const rect = japanMap.getBoundingClientRect();
      addJapanPulse(rect.left + rect.width / 2, rect.top + rect.height / 2);
      if (["map01", "map03", "map08"].includes(storyModeDetour?.kind)) {
        if (storyModeDetour.kind === "map01") storyModeDetour.views.add("temperature_anomaly");
        updateSignalInterface();
        window.dispatchEvent(new CustomEvent("gaia:story-map-interaction", {
          detail: {
            kind: storyModeDetour.kind,
            keyboard: true,
            ...(storyModeDetour.kind === "map01" ? { view: "temperature_anomaly" } : {}),
          },
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
    const nextHash = isOpen ? "#source" : "#top";
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
    const nextHash = isOpen ? "#concept" : "#top";
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
    const nextHash = isOpen ? "#world" : "#top";
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
    const activeLiveId = japanLayer.dataset.liveExhibit;
    const liveExhibit = globalThis.GaiaLiveExhibits?.definitions?.find?.((candidate) => candidate.id === activeLiveId);
    if (liveExhibit) {
      dataLedger.updateLiveExhibit(liveExhibit, globalThis.GaiaLiveData?.getState?.() || {});
    } else {
      const signalMode = getActiveSignalMode();
      if (signalMode && gaiaSnapshot) {
        dataLedger.updateMode(
          { ...signalMode, titleJa: modes[modeToIndex].titleJa },
          modeToIndex + 1,
          gaiaSnapshot.generatedAt,
        );
      }
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
    if (japanDataPanel.contains(document.activeElement)) {
      if (restoreFocus) {
        japanDataButton.focus({ preventScroll: true });
      } else {
        document.activeElement?.blur?.();
      }
    }
    japanDataIsOpen = false;
    japanDataPanel.inert = true;
    japanDataPanel.setAttribute("aria-hidden", "true");
    japanDataScrim.setAttribute("aria-hidden", "true");
    japanDataScrim.tabIndex = -1;
    japanDataButton.setAttribute("aria-expanded", "false");
    japanLayer.classList.remove("japan-data-open");
    if (restoreFocus && document.activeElement !== japanDataButton) {
      japanDataButton.focus({ preventScroll: true });
    }
  };

  const openJapan = ({
    updateHash = true,
    restoreFocusOnClose = true,
    respectUrlMode = true,
    focusModeBank = false,
  } = {}) => {
    if (japanIsOpen) {
      return;
    }
    const usesExplorationSoundtrack = !document.body.classList.contains("novel-open")
      && !experience.classList.contains("gx-story-open");
    if (usesExplorationSoundtrack) {
      void window.GaiaOpeningAudio?.switchTrack?.("moonreopen", 0.6);
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
    resetMobileMapUi();
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
      mapModeIndex = requestedMode - 1;
      selectMode(mapModeIndex);
    }
    syncIntegratedMapLight();
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
    } else if (isTheme(5)) {
      setJapanDataLayer("snapshot");
    }
    updateJapanDataInterface();
    void loadJapanHistory();
    void loadJapanEarthquakes();
    restartMapPlotReveal("map-open");

    if (updateHash) {
      updateJapanHash(true);
    }

    window.dispatchEvent(new CustomEvent("gaia:japan-open"));
    requestAnimationFrame(() => {
      renderJapanTiles();
      animateEarthViewForMode(modeToIndex);
      if (new URLSearchParams(window.location.search).get("panel") === "data") {
        openJapanData();
      } else if (focusModeBank) {
        japanModeButtons[0]?.focus({ preventScroll: true });
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
    window.GaiaModeEntryGuide?.close?.("map", { restoreFocus: false });
    const usesExplorationSoundtrack = !document.body.classList.contains("novel-open")
      && !experience.classList.contains("gx-story-open");
    if (usesExplorationSoundtrack) {
      void window.GaiaOpeningAudio?.switchTrack?.("senseware", 0.6);
    }

    closeJapanData({ restoreFocus: false });
    clearJapanPoiHover();
    closeJapanPoi();
    cancelMapTitleTransition();
    cancelEarthViewAnimation("map-closed");
    japanIsOpen = false;
    syncIntegratedMapLight();
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

  let mapModeGuideTimer = 0;
  const firstVisibleMapGuideTarget = (...selectors) => selectors
    .map((selector) => document.querySelector(selector))
    .find((element) => {
      if (!(element instanceof HTMLElement)) return false;
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return rect.width > 0 && rect.height > 0 && style.display !== "none" && style.visibility !== "hidden";
    }) || null;
  window.GaiaModeEntryGuide?.register?.("map", {
    version: "v3",
    kicker: "WORLD MAP / 操作ガイド",
    avoid: ".gaia-live-exhibit-readout",
    available: () => japanIsOpen && !japanLayer.hidden,
    steps: [
      {
        target: () => firstVisibleMapGuideTarget(".map-dock-bank-trigger", ".gaia-live-deck-modes", "#japan-mode-list", "#map-mobile-bank-toggle"),
        title: "展示を選ぶ",
        copy: "左右の切替か中央の展示名を押して、世界15展示と日本・都道府県3展示を選べます。",
      },
      {
        target: "[data-signal-time]",
        title: "年代をたどる",
        copy: "青い年代スライダーを動かすと、過去から未来試算まで、地図の色と観測値が連動して変わります。",
      },
      {
        target: "#map-reading-guide",
        title: "問いを読む",
        copy: "この地図で何を見比べるのか、色や記号をどう読むのかを簡単に確認できます。",
      },
      {
        target: () => firstVisibleMapGuideTarget(".map-dock-action--source", "[data-live-deck-source]", "#japan-data-button", "#map-mobile-heading-toggle"),
        title: "データの出典を確認する",
        copy: "表示中の数値がどの公開データから来たか、実測・補完・試算の区分まで確認できます。",
      },
      {
        target: () => firstVisibleMapGuideTarget(".map-dock-action--statistics", "[data-live-deck-analysis]", "#gaia-statistics-button", "#gaia-statistics-button-mobile"),
        title: "データを詳しく分析する",
        copy: "統計解析ラボでは、表示中のデータをチャート・数値一覧・元データ・解説の四つの視点から調べられます。",
      },
    ],
  });
  window.GaiaModeEntryGuide?.mountReplay?.("map", japanLayer, { label: "地図ガイド" });
  const scheduleMapModeGuide = () => {
    window.clearTimeout(mapModeGuideTimer);
    mapModeGuideTimer = window.setTimeout(() => {
      void window.GaiaModeEntryGuide?.open?.("map");
    }, reducedMotion ? 80 : 650);
  };
  window.addEventListener("gaia:japan-open", scheduleMapModeGuide);
  if (japanIsOpen) scheduleMapModeGuide();

  const introEntryGuideSteps = Object.freeze([
    {
      target: document.querySelector("[data-intro-guide='map']"),
      copy: "世界の公開観測データを地図に重ね、地点・年代・変化をたどれます。",
      preview: "./assets/guide-previews/map.jpg",
      previewAlt: "地球の一呼吸を表示した世界観測マップの画面",
      previewLabel: "WORLD MAP / SCREEN PREVIEW",
    },
    {
      target: document.querySelector("[data-intro-guide='sensor']"),
      copy: "実物のセンサーをつなぎ、自分の観測点を地球の感覚器として追加できます。",
      preview: "./assets/guide-previews/sensor.jpg",
      previewAlt: "センサー登録の参加方法を選ぶ画面",
      previewLabel: "SENSOR / SCREEN PREVIEW",
    },
    {
      target: document.querySelector("[data-intro-guide='character']"),
      copy: "物語に登場する三人の設定やビジュアル資料を確認できます。",
      preview: "./assets/guide-previews/character.jpg",
      previewAlt: "雨宮周のプロフィールを表示したキャラクター設定画面",
      previewLabel: "CHARACTER / SCREEN PREVIEW",
    },
    {
      target: document.querySelector("[data-intro-guide='sound']"),
      copy: "作品の音楽を一覧で再生し、シーンを支えるサウンドを鑑賞できます。",
      preview: "./assets/guide-previews/sound.jpg",
      previewAlt: "収録曲一覧と再生パネルを表示したサウンド鑑賞画面",
      previewLabel: "SOUND ARCHIVE / SCREEN PREVIEW",
    },
  ].filter(({ target }) => target instanceof Element));
  const introEntryGuide = document.createElement("section");
  introEntryGuide.className = "intro-entry-guide";
  introEntryGuide.id = "intro-entry-guide";
  introEntryGuide.hidden = true;
  introEntryGuide.inert = true;
  introEntryGuide.tabIndex = 0;
  introEntryGuide.setAttribute("role", "dialog");
  introEntryGuide.setAttribute("aria-modal", "false");
  introEntryGuide.setAttribute("aria-label", "データ入口ガイド");
  introEntryGuide.setAttribute("aria-describedby", "intro-entry-guide-copy intro-entry-guide-hint");
  introEntryGuide.innerHTML = `
    <div class="intro-entry-guide-shade" aria-hidden="true"></div>
    <article class="intro-entry-guide-bubble" aria-live="polite" aria-atomic="true">
      <div class="intro-entry-guide-index"><b><i data-intro-entry-guide-step>1</i> / ${introEntryGuideSteps.length}</b></div>
      <figure class="intro-entry-guide-preview">
        <img data-intro-entry-guide-preview alt="" />
        <figcaption data-intro-entry-guide-preview-label></figcaption>
      </figure>
      <p id="intro-entry-guide-copy" data-intro-entry-guide-copy></p>
      <span class="intro-entry-guide-hint" id="intro-entry-guide-hint"><b>CLICK / TAP</b><span data-intro-entry-guide-action>次へ</span></span>
    </article>`;
  introLayer.append(introEntryGuide);

  const introEntryGuideShade = introEntryGuide.querySelector(".intro-entry-guide-shade");
  const introEntryGuideBubble = introEntryGuide.querySelector(".intro-entry-guide-bubble");
  const introEntryGuidePreview = introEntryGuide.querySelector(".intro-entry-guide-preview");
  const introEntryGuidePreviewImage = introEntryGuide.querySelector("[data-intro-entry-guide-preview]");
  const introEntryGuidePreviewLabel = introEntryGuide.querySelector("[data-intro-entry-guide-preview-label]");
  let introEntryGuideActive = false;
  let introEntryGuideIndex = 0;
  let introEntryGuidePositionFrame = 0;
  let introEntryGuideStartTimer = 0;
  let introEntryGuideSettleTimer = 0;

  const clearIntroEntryGuideTarget = () => {
    introEntryGuideSteps.forEach(({ target }) => target.classList.remove("is-intro-entry-guide-target"));
  };
  const positionIntroEntryGuide = () => {
    introEntryGuidePositionFrame = 0;
    if (!introEntryGuideActive || !(introEntryGuideBubble instanceof HTMLElement)) return;
    const target = introEntryGuideSteps[introEntryGuideIndex]?.target;
    if (!(target instanceof HTMLElement) || target.getClientRects().length === 0) return;
    const targetRect = target.getBoundingClientRect();
    if (introEntryGuideShade instanceof HTMLElement) {
      introEntryGuideShade.style.setProperty("--intro-guide-focus-left", `${targetRect.left}px`);
      introEntryGuideShade.style.setProperty("--intro-guide-focus-top", `${targetRect.top}px`);
      introEntryGuideShade.style.setProperty("--intro-guide-focus-width", `${targetRect.width}px`);
      introEntryGuideShade.style.setProperty("--intro-guide-focus-height", `${targetRect.height}px`);
      introEntryGuideShade.style.setProperty("--intro-guide-focus-radius", getComputedStyle(target).borderRadius || "0px");
    }
    const bubbleRect = introEntryGuideBubble.getBoundingClientRect();
    const compactLandscape = innerHeight <= 430 && innerWidth > innerHeight;
    const viewportInset = compactLandscape ? 8 : 12;
    const gap = compactLandscape ? 8 : 12;
    const preferredLeft = targetRect.left + targetRect.width / 2 - bubbleRect.width / 2;
    const left = Math.max(viewportInset, Math.min(innerWidth - bubbleRect.width - viewportInset, preferredLeft));
    const below = targetRect.bottom + gap;
    const above = targetRect.top - bubbleRect.height - gap;
    const placeBelow = below + bubbleRect.height <= innerHeight - viewportInset;
    const preferredTop = placeBelow ? below : above;
    const top = Math.max(
      viewportInset,
      Math.min(innerHeight - bubbleRect.height - viewportInset, preferredTop),
    );
    const arrowLeft = Math.max(24, Math.min(bubbleRect.width - 24, targetRect.left + targetRect.width / 2 - left));
    introEntryGuideBubble.style.left = `${Math.round(left)}px`;
    introEntryGuideBubble.style.top = `${Math.round(top)}px`;
    introEntryGuideBubble.style.setProperty("--intro-guide-arrow-left", `${Math.round(arrowLeft)}px`);
    introEntryGuideBubble.dataset.placement = placeBelow ? "below" : "above";
  };
  const scheduleIntroEntryGuidePosition = () => {
    cancelAnimationFrame(introEntryGuidePositionFrame);
    introEntryGuidePositionFrame = requestAnimationFrame(() => {
      introEntryGuidePositionFrame = requestAnimationFrame(positionIntroEntryGuide);
    });
  };
  const reflowIntroEntryGuide = () => {
    if (introEntryGuideActive) {
      const target = introEntryGuideSteps[introEntryGuideIndex]?.target;
      if (target instanceof HTMLElement) {
        const targetRect = target.getBoundingClientRect();
        if (targetRect.top < 12 || targetRect.bottom > innerHeight - 12) {
          target.scrollIntoView({ block: "center", inline: "nearest", behavior: "auto" });
        }
      }
    }
    scheduleIntroEntryGuidePosition();
    window.clearTimeout(introEntryGuideSettleTimer);
    introEntryGuideSettleTimer = window.setTimeout(scheduleIntroEntryGuidePosition, reducedMotion ? 0 : 120);
  };
  const setIntroEntryGuideStep = (nextIndex) => {
    if (!introEntryGuideActive || introEntryGuideSteps.length === 0) return;
    introEntryGuideIndex = Math.max(0, Math.min(introEntryGuideSteps.length - 1, nextIndex));
    clearIntroEntryGuideTarget();
    const step = introEntryGuideSteps[introEntryGuideIndex];
    step.target.classList.add("is-intro-entry-guide-target");
    introEntryGuide.querySelector("[data-intro-entry-guide-step]").textContent = String(introEntryGuideIndex + 1);
    introEntryGuide.querySelector("[data-intro-entry-guide-copy]").textContent = step.copy;
    if (introEntryGuidePreviewImage instanceof HTMLImageElement) {
      introEntryGuidePreviewImage.src = step.preview;
      introEntryGuidePreviewImage.alt = step.previewAlt;
    }
    if (introEntryGuidePreviewLabel instanceof HTMLElement) {
      introEntryGuidePreviewLabel.textContent = step.previewLabel;
    }
    if (introEntryGuidePreview instanceof HTMLElement) {
      introEntryGuidePreview.hidden = !step.preview;
    }
    introEntryGuide.querySelector("[data-intro-entry-guide-action]").textContent = introEntryGuideIndex === introEntryGuideSteps.length - 1
      ? "案内を終える"
      : "次へ";
    introEntryGuide.dataset.step = String(introEntryGuideIndex + 1);
    const targetRect = step.target.getBoundingClientRect();
    if (targetRect.top < 12 || targetRect.bottom > innerHeight - 12) {
      step.target.scrollIntoView({ block: "center", inline: "nearest", behavior: reducedMotion ? "auto" : "smooth" });
    }
    scheduleIntroEntryGuidePosition();
    window.clearTimeout(introEntryGuideSettleTimer);
    introEntryGuideSettleTimer = window.setTimeout(scheduleIntroEntryGuidePosition, reducedMotion ? 0 : 420);
  };
  const closeIntroEntryGuide = ({ restoreFocus = true } = {}) => {
    window.clearTimeout(introEntryGuideStartTimer);
    window.clearTimeout(introEntryGuideSettleTimer);
    introEntryGuideStartTimer = 0;
    introEntryGuideSettleTimer = 0;
    if (!introEntryGuideActive) return;
    introEntryGuideActive = false;
    clearIntroEntryGuideTarget();
    introLayer.classList.remove("is-intro-entry-guide-active");
    introEntryGuide.classList.remove("is-visible");
    introEntryGuide.inert = true;
    introEntryGuide.setAttribute("aria-hidden", "true");
    window.setTimeout(() => {
      if (!introEntryGuideActive) introEntryGuide.hidden = true;
    }, reducedMotion ? 0 : 180);
    if (restoreFocus) introEntryGuideReplay?.focus({ preventScroll: true });
  };
  const openIntroEntryGuide = () => {
    if (introEntryGuideActive || introEntryGuideSteps.length === 0 || !introIsOpen || introStage !== "path") return;
    introEntryGuideActive = true;
    introEntryGuide.hidden = false;
    introEntryGuide.inert = false;
    introEntryGuide.setAttribute("aria-hidden", "false");
    introLayer.classList.add("is-intro-entry-guide-active");
    requestAnimationFrame(() => {
      setIntroEntryGuideStep(0);
      positionIntroEntryGuide();
      requestAnimationFrame(() => {
        introEntryGuide.classList.add("is-visible");
        introEntryGuide.focus({ preventScroll: true });
      });
    });
  };
  const scheduleIntroEntryGuide = (delay = 900) => {
    window.clearTimeout(introEntryGuideStartTimer);
    introEntryGuideStartTimer = window.setTimeout(() => {
      introEntryGuideStartTimer = 0;
      openIntroEntryGuide();
    }, reducedMotion ? 80 : delay);
  };
  const advanceIntroEntryGuide = () => {
    if (!introEntryGuideActive) return;
    if (introEntryGuideIndex >= introEntryGuideSteps.length - 1) closeIntroEntryGuide();
    else setIntroEntryGuideStep(introEntryGuideIndex + 1);
  };
  introEntryGuide.addEventListener("click", (event) => {
    if (!introEntryGuideActive) return;
    event.preventDefault();
    advanceIntroEntryGuide();
  });
  introEntryGuide.addEventListener("keydown", (event) => {
    if (!introEntryGuideActive) return;
    event.stopPropagation();
    if (event.key === "Escape") { event.preventDefault(); closeIntroEntryGuide(); }
    else if (event.key === "Enter" || event.key === " ") { event.preventDefault(); advanceIntroEntryGuide(); }
    else if (event.key === "Tab") { event.preventDefault(); introEntryGuide.focus({ preventScroll: true }); }
  });
  introLayer.addEventListener("keydown", (event) => {
    if (!introEntryGuideActive || event.key !== "Escape") return;
    event.preventDefault();
    event.stopPropagation();
    closeIntroEntryGuide();
  }, true);
  introEntryGuideReplay?.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    openIntroEntryGuide();
  });
  introLayer.addEventListener("scroll", scheduleIntroEntryGuidePosition, { passive: true });
  window.addEventListener("resize", reflowIntroEntryGuide, { passive: true });
  globalThis.GaiaIntroEntryGuide = Object.freeze({
    open: openIntroEntryGuide,
    close: closeIntroEntryGuide,
    getState: () => ({
      active: introEntryGuideActive,
      index: introEntryGuideIndex,
      target: introEntryGuideSteps[introEntryGuideIndex]?.target?.dataset.introGuide || null,
    }),
  });

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
    syncIntroStoryReturn();
    introPathButtons.forEach((button) => button.setAttribute("aria-pressed", "false"));
    updateIntroSelection();
    // During the opening dissolve the next screen is already visible behind it.
    // Present complete cards there instead of exposing staggered empty frames.
    const enteringFromOpening = document.body.classList.contains("gaia-opening-active");
    showIntroStage("path", { revealPanels: !enteringFromOpening });
  };

  const closeIntro = ({ restoreFocus = introRestoreFocus } = {}) => {
    closeIntroEntryGuide({ restoreFocus: false });
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

  const clearTourFocus = () => {
    document.querySelectorAll(".gaia-tour-highlight-target").forEach((element) => {
      element.classList.remove("gaia-tour-highlight-target");
      element.removeAttribute("data-gaia-tour-target");
    });
  };
  const focusTourControl = (name) => {
    clearTourFocus();
    const target = {
      start: document.querySelector("[data-intro-path='map']"),
      map: japanMap,
      timeline: japanLayer.querySelector("[data-signal-time]"),
      source: sourcePanel.querySelector("[data-source-tab='raw']"),
      transform: sourcePanel.querySelector("[data-source-tab='transform']"),
      visual: sourcePanel.querySelector("[data-source-tab='visual']"),
      story: document.querySelector("[data-intro-path='novel']"),
      credits: introOpenDataExhibit,
    }[name];
    if (!(target instanceof Element)) return false;
    target.classList.add("gaia-tour-highlight-target");
    target.setAttribute("data-gaia-tour-target", name);
    if (name === "credits") target.scrollIntoView({ block: "center", inline: "nearest", behavior: reducedMotion ? "auto" : "smooth" });
    return true;
  };
  const getTourReceipt = () => {
    const signalMode = getActiveSignalMode();
    const visualMode = modes[modeToIndex];
    if (!signalMode || !visualMode) throw new Error(gaiaSnapshotError || "公開データを読み込めませんでした。");
    const observation = captureMapObservation();
    return {
      title: visualMode.titleJa,
      source: observation.metrics.map((metric) => `${metric.label} ${formatObservationNumber(metric.value, 2)}${metric.unit ? ` ${metric.unit}` : ""}`).join(" / "),
      at: observation.subtitle,
      provider: [...new Set((signalMode.datasets || []).map((dataset) => dataset.organisation).filter(Boolean))].join(" / "),
      classification: observation.provenance.classification || "SOURCE",
      transform: modeDataNarratives[visualMode.id] || "保存済みの公開記録を表示用の尺度へ変換します。",
      visual: visualMode.description,
    };
  };

  const mapObservationAdapter = Object.freeze({
    waitSignalsReady: async () => {
      const result = await gaiaSignalsReady;
      if (!result.ok) throw new Error(result.error || "公開データを読み込めませんでした。");
      return gaiaSnapshot;
    },
    selectMode: (index) => {
      const requested = Number(index);
      if (!Number.isInteger(requested) || requested < 0 || requested >= MODE_COUNT) return false;
      mapModeIndex = requested;
      selectMode(requested);
      return true;
    },
    setSignalTime: (position) => {
      signalTimePosition = clamp(Number(position) || 0, 0, 100);
      co2TimelineHeld = false;
      co2TimelinePausedUntil = performance.now() + CO2_TIMELINE_MANUAL_PAUSE_MS;
      co2TimelineLastStep = -1;
      signalTimeInputs.forEach((input) => { input.value = String(signalTimePosition); });
      updateSignalInterface();
      return signalTimePosition;
    },
    focusEarthLocation,
    zoomEarthBy,
    zoomEarthAtLocation,
    openMap: () => {
      if (!japanIsOpen) openJapan({ updateHash: false, restoreFocusOnClose: false, respectUrlMode: false });
    },
    closeMap: () => {
      if (japanIsOpen) closeJapan({ restoreFocus: false, updateHash: false });
    },
    showIntro: () => {
      if (japanIsOpen) closeJapan({ restoreFocus: false, updateHash: false });
      if (sourceIsOpen) closeSource({ restoreFocus: false, updateHash: false });
      if (!introIsOpen) openIntro({ restoreFocusOnClose: false });
      introLayer.scrollLeft = 0;
      document.scrollingElement?.scrollTo?.({ left: 0, top: 0, behavior: "auto" });
    },
    focusControl: focusTourControl,
    clearFocus: clearTourFocus,
    openSourceTab: (tab = "visual") => {
      if (!sourceTabs.some((button) => button.dataset.sourceTab === tab)) return false;
      activeSourceTab = tab;
      renderSource();
      if (!sourceIsOpen) openSource({ updateHash: false });
      focusTourControl(tab === "raw" ? "source" : tab);
      return true;
    },
    closeSource: () => {
      clearTourFocus();
      if (sourceIsOpen) closeSource({ restoreFocus: false, updateHash: false });
    },
    getTourReceipt,
    captureObservation: captureMapObservation,
    getState: () => ({ modeIndex: modeToIndex, signalTimePosition, mapOpen: japanIsOpen, introOpen: introIsOpen }),
  });
  globalThis.GaiaMapObservationAdapter = mapObservationAdapter;
  window.dispatchEvent(new CustomEvent("gaia:map-adapter-ready"));

  window.addEventListener("gaia:novel-open", () => {
    stopRendering();
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
    const phase = String(event.detail?.phase || "timeline");
    if (!["map01", "map03", "abstract07", "map08"].includes(kind) || !Number.isInteger(index)) return;
    if (kind === "map01" && (index !== 0 || event.detail?.modeId !== "breathing-earth")) return;
    storyModeDetour = { kind, index, phase, views: new Set() };
    startRendering();
    storyMapTimelineCompleted = false;
    window.clearTimeout(storyMapReturnTimer);
    storyMapReturnTimer = 0;
    experience.dataset.storyMode = kind;
    const globalSignalConsole = experience.querySelector(".signal-console-main");
    if (globalSignalConsole) {
      storyModeGlobalSignalConsoleState = {
        hidden: globalSignalConsole.hidden,
        inert: globalSignalConsole.inert,
        ariaHidden: globalSignalConsole.getAttribute("aria-hidden"),
      };
      globalSignalConsole.hidden = true;
      globalSignalConsole.inert = true;
      globalSignalConsole.setAttribute("aria-hidden", "true");
    }
    if (kind !== "abstract07") mapModeIndex = index;
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
    japanLayer.dataset.storyPhase = phase;
    if (kind === "map01") {
      mountStoryMapAivaBackdrop();
      japanLayer.setAttribute("role", "dialog");
      japanLayer.setAttribute("aria-modal", "true");
      if (phase === "temperature-anomaly") {
        restartCo2Timeline(50);
        co2TimelineHeld = true;
        updateSignalInterface();
      } else {
        restartCo2Timeline(0);
        if (reducedMotion) {
          requestAnimationFrame(() => completeStoryMapTimeline({ finalFrameMs: 900 }));
        }
      }
    }
    requestAnimationFrame(() => {
      const focusTarget = phase === "temperature-anomaly"
        ? japanLayer.querySelector("[data-signal-time]")
        : japanMap;
      focusTarget?.focus({ preventScroll: true });
    });
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
    const closedDetour = storyModeDetour;
    if (japanIsOpen) closeJapan({ restoreFocus: false, updateHash: false });
    japanClose.disabled = false;
    delete japanLayer.dataset.storyLayer;
    delete japanLayer.dataset.storyPhase;
    window.clearTimeout(storyMapReturnTimer);
    storyMapReturnTimer = 0;
    storyMapTimelineCompleted = false;
    destroyStoryMapAivaBackdrop();
    delete experience.dataset.storyMode;
    storyModeDetour = null;
    const globalSignalConsole = experience.querySelector(".signal-console-main");
    if (globalSignalConsole && storyModeGlobalSignalConsoleState) {
      globalSignalConsole.hidden = storyModeGlobalSignalConsoleState.hidden;
      globalSignalConsole.inert = storyModeGlobalSignalConsoleState.inert;
      if (storyModeGlobalSignalConsoleState.ariaHidden === null) globalSignalConsole.removeAttribute("aria-hidden");
      else globalSignalConsole.setAttribute("aria-hidden", storyModeGlobalSignalConsoleState.ariaHidden);
      storyModeGlobalSignalConsoleState = null;
      updateSignalInterface();
    }
    const storyReturnDelay = ["map01", "map03", "map08"].includes(closedDetour.kind) && !reducedMotion ? 420 : 0;
    window.setTimeout(() => {
      if (japanLayer.dataset.storyMode === closedDetour.kind) {
        delete japanLayer.dataset.storyMode;
        japanLayer.removeAttribute("role");
        japanLayer.removeAttribute("aria-modal");
      }
      window.dispatchEvent(new CustomEvent("gaia:story-mode-return-to-novel", {
        detail: { kind: closedDetour.kind },
      }));
      stopRendering();
    }, storyReturnDelay);
  });

  window.addEventListener("keydown", (event) => {
    if (!storyModeDetour || event.key !== "Escape") return;
    event.preventDefault();
    event.stopImmediatePropagation();
    const fallbackControl = storyModeDetour.kind === "map01"
      ? document.querySelector("#story-map-modal-skip")
      : document.querySelector("#story-detour-return");
    fallbackControl?.focus({ preventScroll: true });
  }, true);

  window.addEventListener("gaia:opening-complete", (event) => {
    if (event.detail?.destination !== "menu") return;
    const hasDirectDestination =
      ["#source", "#concept", "#world", "#earth", "#japan", "#data", "#story"].includes(
        window.location.hash,
      ) || new URLSearchParams(window.location.search).has("space");
    if (hasDirectDestination) return;
    openIntro({ restoreFocusOnClose: false });
    scheduleIntroEntryGuide();
  });

  window.addEventListener("gaia:return-to-intro", () => {
    startRendering();
    openIntro({ restoreFocusOnClose: false });
  });

  introTitleReturn?.addEventListener("click", () => {
    history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
    window.dispatchEvent(new CustomEvent("gaia:return-to-title"));
    closeIntro({ restoreFocus: false });
  });

  sourcePanel.inert = true;
  conceptPanel.inert = true;
  introLayer.inert = true;
  japanLayer.inert = true;
  japanDataPanel.inert = true;
  japanButton.addEventListener("click", (event) => {
    runSceneTransition(
      () => japanIsOpen
        ? openIntro({ restoreFocusOnClose: false })
        : openJapan(),
      "map",
      event,
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
  sourceButton.addEventListener("click", (event) => {
    if (sourceIsOpen) {
      runSceneTransition(
        () => openIntro({ restoreFocusOnClose: false }),
        "abstract",
        event,
      );
    } else {
      openSource();
    }
  });
  sourceClose.addEventListener("click", (event) => {
    runSceneTransition(
      () => openIntro({ restoreFocusOnClose: false }),
      "abstract",
      event,
    );
  });
  sourceScrim.addEventListener("click", (event) => {
    runSceneTransition(
      () => openIntro({ restoreFocusOnClose: false }),
      "abstract",
      event,
    );
  });
  conceptOpen.addEventListener("click", (event) => {
    if (conceptIsOpen) {
      runSceneTransition(
        () => openIntro({ restoreFocusOnClose: false }),
        "abstract",
        event,
      );
    } else {
      openConcept();
    }
  });
  conceptClose.addEventListener("click", (event) => {
    runSceneTransition(
      () => openIntro({ restoreFocusOnClose: false }),
      "abstract",
      event,
    );
  });
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
  introScrollCue?.addEventListener("click", () => {
    introAfterfold?.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "start",
    });
    window.setTimeout(() => {
      introGxFeature?.focus({ preventScroll: true });
    }, reducedMotion ? 0 : 460);
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
      window.location.hash === "#world" ||
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
      if (
        ["", "#top"].includes(window.location.hash)
        && !document.body.classList.contains("novel-open")
        && !new URLSearchParams(window.location.search).has("space")
      ) {
        openIntro({ restoreFocusOnClose: false });
      }
    }
  });

  document.addEventListener("keydown", (event) => {
    if (introIsOpen) {
      if (event.key === "Escape") {
        event.preventDefault();
        if (introStage === "sense") {
          showIntroStage("path");
        } else {
          introPathButtons[0]?.focus({ preventScroll: true });
        }
      } else if (
        ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key) &&
        (introStage === "path" ? introPathButtons : introModeButtons).includes(document.activeElement)
      ) {
        event.preventDefault();
        const activeButtons = (introStage === "path" ? introPathButtons : introModeButtons)
          .filter((button) => !button.hidden && !button.disabled);
        const currentIndex = activeButtons.indexOf(document.activeElement);
        const direction = event.key === "ArrowLeft" || event.key === "ArrowUp" ? -1 : 1;
        const nextIndex = (currentIndex + direction + activeButtons.length) % activeButtons.length;
        activeButtons[nextIndex].focus({ preventScroll: true });
      } else if (event.key === "Tab") {
        event.preventDefault();
        const targets = (introStage === "path"
          ? [
              ...introPathButtons,
              introScrollCue,
              introCharacterJump,
              introArchitectureJump,
              introArchitectureBack,
            ]
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
        event.preventDefault();
        openIntro({ restoreFocusOnClose: false });
      } else if (/^[1-9]$/.test(event.key)) {
        selectMode(Number(event.key) - 1);
      } else if (event.key === "0") {
        selectMode(9);
      }
      return;
    }
    if (event.key === "Escape" && sourceIsOpen) {
      event.preventDefault();
      openIntro({ restoreFocusOnClose: false });
      return;
    }
    if (event.key === "Escape" && conceptIsOpen) {
      event.preventDefault();
      openIntro({ restoreFocusOnClose: false });
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
    const lodProfile = globalThis.GaiaFrameBudgetGovernor?.getProfile?.() || {};
    const compactRendering = coarsePointer || window.innerWidth <= 720;
    const ratioCap = Math.min(compactRendering ? 1.0 : 1.35, lodProfile.dprCap || Infinity);
    const pixelRatio = Math.min(window.devicePixelRatio || 1, ratioCap);
    const renderScale = Math.max(compactRendering ? 0.58 : 0.35, lodProfile.renderScale || 1);
    const rawWidth = Math.max(1, rect.width * pixelRatio * renderScale);
    const rawHeight = Math.max(1, rect.height * pixelRatio * renderScale);
    const maxPixels = compactRendering ? 560000 : 1300000;
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

  const currentFieldData = new Float32Array(CURRENT_FIELD_SAMPLE_LIMIT * 4);
  const getCurrentFieldUniformData = () => {
    currentFieldData.fill(0);
    if (
      !japanIsOpen
      || japanLayer.classList.contains("is-live-exhibit")
      || getActiveSignalMode()?.id !== "blue-circulation"
    ) {
      delete canvas.dataset.currentVisiblePoiCount;
      delete canvas.dataset.currentRevealedPoiCount;
      delete canvas.dataset.currentRenderedSampleCount;
      delete canvas.dataset.currentBrushStrokeCount;
      delete canvas.dataset.currentOneStrokePerPoi;
      delete canvas.dataset.currentAllVisiblePoiPainted;
      delete canvas.dataset.currentSampleSelection;
      return { count: 0, data: currentFieldData };
    }
    const rect = japanMap.getBoundingClientRect();
    if (rect.width < 1 || rect.height < 1) return { count: 0, data: currentFieldData };
    const { left, top } = getJapanViewport();
    const currentRows = getActiveSignalMode()?.signals?.currents || [];
    const visibleSamples = currentRows
      .map((row, index) => {
        const point = japanWorldToScreen(row.lon, row.lat, left, top);
        return { row, index, point, speed: Math.hypot(row.uMs, row.vMs) };
      })
      .filter(({ point }) => (
        point.x > -80
        && point.x < rect.width + 80
        && point.y > -80
        && point.y < rect.height + 80
      ));
    const now = performance.now();
    const revealedSamples = visibleSamples.filter(({ index }) => (
      getMapPlotReveal(index, currentRows.length, now).progress > 0
    ));
    const samples = revealedSamples.slice(0, CURRENT_FIELD_SAMPLE_LIMIT);

    samples.forEach(({ row, point, speed }, index) => {
      const offset = index * 4;
      currentFieldData[offset] = (point.x * 2 - rect.width) / rect.height;
      currentFieldData[offset + 1] = ((rect.height - point.y) * 2 - rect.height) / rect.height;
      currentFieldData[offset + 2] = clamp(speed / 1.5, 0, 1);
      currentFieldData[offset + 3] = Math.atan2(row.vMs, row.uMs);
    });
    canvas.dataset.currentVisiblePoiCount = String(visibleSamples.length);
    canvas.dataset.currentRevealedPoiCount = String(revealedSamples.length);
    canvas.dataset.currentRenderedSampleCount = String(samples.length);
    canvas.dataset.currentBrushStrokeCount = String(samples.length);
    canvas.dataset.currentOneStrokePerPoi = String(samples.length === revealedSamples.length);
    canvas.dataset.currentAllVisiblePoiPainted = String(samples.length === visibleSamples.length);
    canvas.dataset.currentSampleSelection = "all-visible-poi-stable-order";
    return { count: samples.length, data: currentFieldData };
  };

  const render = (now) => {
    // The geographic base must keep following the shared projection in every
    // chapter. Live chapters render their own data canvas, but the coastlines
    // still need to redraw after wheel, pinch, drag, and control-button input.
    const mapSurfaceIsVisible = japanIsOpen;
    const lodProfile = globalThis.GaiaFrameBudgetGovernor?.getProfile?.() || { targetFps: 60 };
    const lodTarget = lodProfile.targetFps ?? 60;

    if (lodTarget === 0) {
      const enteringStaticFallback = japanOverlay.dataset.renderLoopMode !== "static-fallback";
      japanOverlay.dataset.renderLoopMode = "static-fallback";
      if (
        mapSurfaceIsVisible
        && (enteringStaticFallback || now + 0.5 >= nextJapanOverlayRenderAt)
      ) {
        renderJapanTiles();
        renderJapanOverlay(now);
        nextJapanOverlayRenderAt = now + STATIC_MAP_FRAME_INTERVAL_MS;
      }
      animationFrame = requestAnimationFrame(render);
      return;
    }
    japanOverlay.dataset.renderLoopMode = "dynamic";
    if (!japanIsOpen && lodTarget < 60) {
      if (lodTarget !== lastShaderTargetFps) {
        lastShaderTargetFps = lodTarget;
        nextShaderRenderAt = now;
      }
      if (now + 0.25 < nextShaderRenderAt) {
        animationFrame = requestAnimationFrame(render);
        return;
      }
      const frameInterval = 1000 / lodTarget;
      do nextShaderRenderAt += frameInterval;
      while (nextShaderRenderAt <= now);
    } else {
      lastShaderTargetFps = lodTarget;
      nextShaderRenderAt = now;
    }

    if (japanIsOpen) {
      const brushCurrentIsActive = getActiveSignalMode()?.id === "blue-circulation";
      const mapTargetFps = brushCurrentIsActive
        ? (lodTarget >= 45 ? 60 : Math.max(30, lodTarget))
        : reducedMotion ? 15 : lodTarget >= 45 ? 60 : lodTarget;
      if (mapTargetFps < 60) {
        if (mapTargetFps !== lastJapanOverlayTargetFps) {
          lastJapanOverlayTargetFps = mapTargetFps;
          nextJapanOverlayRenderAt = now;
        }
        if (now + 0.5 < nextJapanOverlayRenderAt) {
          animationFrame = requestAnimationFrame(render);
          return;
        }
        const mapFrameInterval = 1000 / mapTargetFps;
        do nextJapanOverlayRenderAt += mapFrameInterval;
        while (nextJapanOverlayRenderAt <= now);
      } else {
        lastJapanOverlayTargetFps = mapTargetFps;
        nextJapanOverlayRenderAt = now;
      }
    }

    resize();
    updateCo2TimelineAnimation(now);
    if (mapSurfaceIsVisible) {
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
    const trailActive = pointer.down || trail.some((point) => point.strength > 0.001 && now - point.bornAt < 3_100);
    gl.uniform1f(uniforms.trailActive, trailActive ? 1 : 0);
    gl.uniform1fv(uniforms.modeMemory, modeMemory);
    gl.uniform1i(uniforms.modeFrom, modeFromIndex);
    gl.uniform1i(uniforms.modeTo, modeToIndex);
    gl.uniform1f(uniforms.transition, transition);
    const signalVector = getShaderSignalVector(modeToIndex);
    gl.uniform4f(uniforms.signal, signalVector[0], signalVector[1], signalVector[2], signalVector[3]);
    gl.uniform1fv(uniforms.sourceSignals, getSourceSignalVector());
    const currentField = getCurrentFieldUniformData();
    gl.uniform4fv(uniforms.currentSamples, currentField.data);
    gl.uniform1i(uniforms.currentSampleCount, currentField.count);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    if (getActiveSignalMode()?.id === "blue-circulation") {
      canvas.dataset.currentAmbientPhase = (elapsed * timeScale).toFixed(4);
    } else {
      delete canvas.dataset.currentAmbientPhase;
    }

    animationFrame = requestAnimationFrame(render);
  };

  let renderingEnabled = false;

  function startRendering() {
    renderingEnabled = true;
    cancelAnimationFrame(animationFrame);
    animationFrame = requestAnimationFrame(render);
  }

  function stopRendering() {
    renderingEnabled = false;
    cancelAnimationFrame(animationFrame);
    animationFrame = 0;
  }

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      hiddenAt = performance.now();
      cancelAnimationFrame(animationFrame);
    } else if (renderingEnabled) {
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
      globalThis.GaiaFrameBudgetGovernor?.reportFailure?.("context-lost");
    },
    false,
  );

  window.addEventListener("resize", resize, { passive: true });
  window.addEventListener("focus", invalidateReferenceWorldCache, { passive: true });
  window.addEventListener("pageshow", invalidateReferenceWorldCache, { passive: true });
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) invalidateReferenceWorldCache();
  });
  referenceWorldCanvas.addEventListener("contextlost", (event) => {
    event.preventDefault();
    invalidateReferenceWorldCache();
  });
  referenceWorldCanvas.addEventListener("contextrestored", invalidateReferenceWorldCache);

  clearSession();
  setMapScope("earth");
  updateModeInterface();
  updateAutoInterface();
  resize();
  const openingCoversCanvas = document.body.classList.contains("gaia-opening-active");
  const novelCoversCanvas = document.body.classList.contains("novel-open")
    && !document.body.classList.contains("novel-mode-detour");
  if (!openingCoversCanvas && !novelCoversCanvas) {
    startRendering();
  } else if (openingCoversCanvas) {
    window.addEventListener("gaia:opening-complete", () => {
      const coveredByNovel = document.body.classList.contains("novel-open")
        && !document.body.classList.contains("novel-mode-detour");
      if (!coveredByNovel) startRendering();
    }, { once: true });
  }
  document.documentElement.dataset.gaiaAppReady = "true";
  window.dispatchEvent(new CustomEvent("gaia:app-ready"));
  loadGaiaSignals();
  loadOvationAuroraForecast();
  loadNaturalEarthLand();
  loadNaturalEarthCountries();
  loadJapanPrefectureBoundaries();

  if (window.location.hash === "#source") {
    openSource({ updateHash: false });
  } else if (window.location.hash === "#concept") {
    openConcept({ updateHash: false });
  } else if (
    window.location.hash === "#world" ||
    window.location.hash === "#earth" ||
    window.location.hash === "#japan" ||
    window.location.hash === "#data"
  ) {
    openJapan({ updateHash: false, restoreFocusOnClose: false });
    if (window.location.hash === "#data") openJapanData();
  } else if (
    (!openingLayer || openingLayer.hidden)
    && window.location.hash !== "#story"
    && !/\/story\/?$/iu.test(window.location.pathname)
    && !new URLSearchParams(window.location.search).has("space")
  ) {
    openIntro({ restoreFocusOnClose: false });
  }
  if (openingLayer?.hidden && window.location.hash !== "#tour") {
    requestAnimationFrame(() => document.body.classList.remove("gaia-route-handoff"));
  }
})();
