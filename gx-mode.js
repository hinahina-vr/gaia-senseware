(() => {
  "use strict";

  const layer = document.querySelector("#gx-layer");
  const canvas = document.querySelector("#gx-canvas");
  const openButton = document.querySelector("#intro-gx-feature");
  if (!layer || !canvas || !openButton) return;

  const context = canvas.getContext("2d", { alpha: false });
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const CYANOBACTERIA_TARGET_CELLS = 28;
  const ERA_TRANSITION_MS = reducedMotion ? 120 : 1900;
  const PHASE = Object.freeze({
    HADEAN: 0,
    ARCHEAN: 1,
    PROTEROZOIC: 2,
    PALEOZOIC: 3,
    MESOZOIC: 4,
    CENOZOIC: 5,
    ANTHROPOCENE: 6,
    GX: 7,
  });
  const ERA_YEARS_BEFORE_PRESENT = {
    hadean: 4_600_000_000,
    "archean-life": 4_000_000_000,
    "proterozoic-oxygen": 2_500_000_000,
    "paleozoic-coal": 538_800_000,
    "mesozoic-impact": 251_900_000,
    "cenozoic-climate": 66_000_000,
    anthropocene: 75,
    "gaia-transformation": 0,
  };
  const numberFormatter = new Intl.NumberFormat("ja-JP", { maximumFractionDigits: 0 });
  const elements = {
    close: layer.querySelector("#gx-close"),
    loading: layer.querySelector("#gx-loading"),
    timePanel: layer.querySelector(".gx-time"),
    time: layer.querySelector("#gx-time-value"),
    timeContext: layer.querySelector("#gx-time-context"),
    kind: layer.querySelector("#gx-kind"),
    index: layer.querySelector("#gx-phase-index"),
    title: layer.querySelector("#gx-phase-title"),
    copy: layer.querySelector("#gx-phase-copy"),
    strataMarker: layer.querySelector("#gx-strata-marker"),
    guide: layer.querySelector("#gx-phase-guide"),
    effect: layer.querySelector("#gx-effect"),
    next: layer.querySelector("#gx-next"),
    eraProgress: layer.querySelector("#gx-era-progress"),
    eraProgressValue: layer.querySelector("#gx-era-progress-value"),
    eraProgressBar: layer.querySelector("#gx-era-progress-bar"),
    eraProgressCopy: layer.querySelector("#gx-era-progress-copy"),
    eraTransition: layer.querySelector("#gx-era-transition"),
    restart: layer.querySelector("#gx-restart"),
    data: layer.querySelector("#gx-data"),
    dataPanel: layer.querySelector("#gx-data-panel"),
    dataClose: layer.querySelector("#gx-data-close"),
    dataNotice: layer.querySelector("#gx-data-notice"),
    dataDate: layer.querySelector("#gx-data-date"),
    sourceList: layer.querySelector("#gx-source-list"),
    nav: layer.querySelector("#gx-phase-nav"),
  };

  const FALLBACK = {
    notice: "地質年代の幅と研究上の解釈を、鑑賞用の時間軸へ変換した展示です。",
    snapshotDate: "2026-08-03",
    phases: [
      { id: "hadean", index: "01 / 08", kind: "SOURCE", time: "約46–40億年前 / 冥王代", title: "岩石より先に、水の記憶がある。", copy: "地球が冷え、海が生まれました。わずかに残るジルコンが、初期の地表環境を伝えます。", marker: "ジルコン結晶・最古級の岩石", guide: "地球へ触れ、結晶の記録を見つけてください。", action: "最初の生命へ進む" },
      { id: "archean-life", index: "02 / 08", kind: "SOURCE", time: "約40–25億年前 / 太古代", title: "生命が、海に層をつくる。", copy: "微生物マットが泥を取り込み、ストロマトライトをつくりました。", marker: "ストロマトライト・微生物マット", guide: "海を生命で満たしてください。", action: "酸素の行方を見る" },
      { id: "proterozoic-oxygen", index: "03 / 08", kind: "SOURCE", time: "約25億–5億3900万年前 / 原生代", title: "酸素が、海と大陸を赤くする。", copy: "酸素が鉄と結びつき、縞状鉄鉱層と赤色層を残しました。", marker: "縞状鉄鉱層・赤色層・氷砕岩", guide: "触れると酸化の層が広がります。", action: "石炭の森へ進む" },
      { id: "paleozoic-coal", index: "04 / 08", kind: "SOURCE", time: "約5億3900万–2億5200万年前 / 古生代", title: "森が、空気を石へ渡す。", copy: "湿地の植物が埋没し、長い時間をかけて石炭層になりました。", marker: "殻化石・植物化石・石炭層", guide: "湿地をなぞり、植物の炭素を地層へ渡してください。", action: "衝突の境界へ進む" },
      { id: "mesozoic-impact", index: "05 / 08", kind: "SOURCE", time: "約2億5200万–6600万年前 / 中生代", title: "一日の衝突が、時代の境界になる。", copy: "約6600万年前の衝突は、イリジウムを含む薄い境界層を残しました。", marker: "K–Pg境界・イリジウム濃集層", guide: "地球へ触れ、境界層を一周させてください。", action: "氷と花粉の時代へ進む" },
      { id: "cenozoic-climate", index: "06 / 08", kind: "SOURCE", time: "6600万年前–現在 / 新生代", title: "気候の往復を、氷と花粉が覚えている。", copy: "氷河堆積物や花粉が、寒冷期と温暖期の往復を記録しています。", marker: "花粉・微化石・氷河堆積物", guide: "上下になぞり、氷と植生の記録を重ねてください。", action: "人間の層へ進む" },
      { id: "anthropocene", index: "07 / 08", kind: "DERIVED", time: "20世紀半ば–現在 / 非公式概念", title: "都市が、未来の化石になる。", copy: "コンクリート、プラスチック、燃焼粒子、放射性核種が急な変化を残します。", marker: "コンクリート・プラスチック・フライアッシュ・放射性核種", guide: "都市へ触れると人工物の層と大気負荷が増えます。", action: "まだない地層へ進む" },
      { id: "gaia-transformation", index: "08 / 08", kind: "SCENARIO", time: "現在–未来 / GX", title: "次の地層は、まだ決まっていない。", copy: "地球の信号を読み、人間の技術や暮らしも変える相互進化をGXと呼びます。", marker: "未定 — 私たちがこれから残す層", guide: "地球へ大きな円を描き、二つの時間を重ねてください。", action: "展示を終える" },
    ],
    sources: [],
  };

  const themes = [
    { top: [15, 8, 9], bottom: [34, 19, 18], glow: [244, 153, 91] },
    { top: [2, 16, 22], bottom: [4, 43, 43], glow: [102, 236, 190] },
    { top: [15, 15, 19], bottom: [54, 26, 20], glow: [218, 102, 60] },
    { top: [8, 24, 21], bottom: [27, 30, 20], glow: [176, 211, 112] },
    { top: [9, 12, 22], bottom: [25, 18, 27], glow: [211, 174, 147] },
    { top: [17, 54, 72], bottom: [5, 31, 48], glow: [179, 226, 240] },
    { top: [12, 17, 22], bottom: [38, 26, 23], glow: [241, 128, 70] },
    { top: [2, 8, 18], bottom: [4, 20, 38], glow: [109, 197, 222] },
  ];

  let exhibit = FALLBACK;
  let isOpen = false;
  let loaded = false;
  let phaseIndex = 0;
  let animationFrame = 0;
  let previousTime = 0;
  let previousFocus = null;
  let returnTo = "intro";
  let width = 0;
  let height = 0;
  let dpr = 1;
  let pointer = { x: 0.64, y: 0.48, active: false };
  let gestureCount = 0;
  let previousPhaseIndex = 0;
  let cyanobacteriaTouches = 0;
  let oxygenReleased = 0;
  let ironCompaction = 0;
  let atmosphericCarbon = 0;
  let gaiaRotation = 0;
  let gaiaSpinVelocity = 0;
  let transcendence = 0;
  let gaiaOrbitPhase = 0;
  let eraTransitionTimer = 0;
  let eraTransitionPending = false;
  let eraCounterFrame = 0;
  let displayedYears = ERA_YEARS_BEFORE_PRESENT.hadean;
  const cyanobacteriaCells = new Set();
  const colonies = [];
  const bubbles = [];
  const rust = [];
  const carbon = [];
  const nodes = [];
  const lights = [];
  const gaiaTrails = [];
  const coalLayers = [];
  const impactRings = [];
  const climateRecords = [];
  const technofossils = [];

  const clamp = (value, minimum, maximum) => Math.max(minimum, Math.min(maximum, value));
  const mix = (a, b, amount) => a + (b - a) * amount;
  const rgb = (array, alpha = 1) => `rgba(${array[0]}, ${array[1]}, ${array[2]}, ${alpha})`;
  const random = (minimum, maximum) => minimum + Math.random() * (maximum - minimum);

  const setUnderlayHidden = (hidden) => {
    const underlay = returnTo === "novel"
      ? document.querySelector("#novel-layer")
      : document.querySelector("#intro-layer");
    underlay?.setAttribute("aria-hidden", String(hidden));
  };

  const loadExhibit = async () => {
    if (loaded) return;
    try {
      const response = await fetch("./data/gx-deep-time.json?v=gx-08", { cache: "no-store" });
      if (!response.ok) throw new Error(`GX data ${response.status}`);
      const data = await response.json();
      if (Array.isArray(data.phases) && data.phases.length) exhibit = data;
    } catch (error) {
      console.warn("THE FIRST GX is using its embedded fallback.", error);
    }
    loaded = true;
    buildNavigation();
    renderSources();
    elements.loading.hidden = true;
  };

  const buildNavigation = () => {
    elements.nav.replaceChildren();
    exhibit.phases.forEach((phase, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = `${index + 1}: ${phase.title}`;
      button.setAttribute("aria-label", `${index + 1}章 ${phase.title}`);
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        setPhase(index);
      });
      elements.nav.append(button);
    });
  };

  const renderSources = () => {
    elements.dataNotice.textContent = exhibit.notice;
    elements.dataDate.textContent = `取得・整理日：${exhibit.snapshotDate || "—"}`;
    elements.sourceList.replaceChildren();
    (exhibit.sources || []).forEach((source) => {
      const anchor = document.createElement("a");
      anchor.href = source.url;
      anchor.target = "_blank";
      anchor.rel = "noopener noreferrer";
      const provider = document.createElement("span");
      const title = document.createElement("strong");
      provider.textContent = source.provider;
      title.textContent = `${source.title} ↗`;
      anchor.append(provider, title);
      elements.sourceList.append(anchor);
    });
  };

  const seedWorld = () => {
    if (!colonies.length) {
      for (let index = 0; index < 24; index += 1) {
        const point = randomPointOnPlanet(0.16, 0.82);
        colonies.push({ x: point.x, y: point.y, radius: random(3, 12), age: random(0, 5), hue: random(0, 1) });
      }
    }
  };

  const resetWorld = () => {
    window.clearTimeout(eraTransitionTimer);
    eraTransitionTimer = 0;
    eraTransitionPending = false;
    cyanobacteriaCells.clear();
    layer.classList.remove("is-era-transitioning");
    elements.eraTransition.classList.remove("is-visible");
    elements.eraTransition.setAttribute("aria-hidden", "true");
    colonies.length = 0;
    bubbles.length = 0;
    rust.length = 0;
    carbon.length = 0;
    nodes.length = 0;
    lights.length = 0;
    coalLayers.length = 0;
    impactRings.length = 0;
    climateRecords.length = 0;
    technofossils.length = 0;
    cyanobacteriaTouches = 0;
    oxygenReleased = 0;
    ironCompaction = 0;
    atmosphericCarbon = 0;
    gaiaRotation = 0;
    gaiaSpinVelocity = 0;
    transcendence = 0;
    gaiaOrbitPhase = 0;
    gaiaTrails.length = 0;
    seedWorld();
    setPhase(0);
  };

  const cyanobacteriaProgress = () => clamp(cyanobacteriaCells.size / CYANOBACTERIA_TARGET_CELLS, 0, 1);

  const updateCyanobacteriaProgress = () => {
    const progress = cyanobacteriaProgress();
    const percentage = Math.round(progress * 100);
    elements.eraProgressValue.textContent = `${percentage}%`;
    elements.eraProgressBar.style.width = `${percentage}%`;
    elements.eraProgressCopy.textContent = progress >= 1
      ? "海が生命で満ちました。酸素が鉄と結びつき、次の時代が始まります。"
      : `地球の海をなぞり、残り${Math.max(0, 100 - percentage)}%を生命で満たしてください。`;
    return progress;
  };

  const beginEraTransition = () => {
    if (eraTransitionPending || phaseIndex !== PHASE.ARCHEAN) return;
    eraTransitionPending = true;
    pointer.active = false;
    elements.effect.textContent = "海を満たした生命が酸素を放ち、溶けていた鉄を赤い鉱物へ変えています。";
    elements.eraProgressCopy.textContent = "充足完了。生命の活動が、地球そのものを次の時代へ押し進めます。";
    layer.classList.add("is-era-transitioning");
    elements.eraTransition.classList.add("is-visible");
    elements.eraTransition.setAttribute("aria-hidden", "false");
    eraTransitionTimer = window.setTimeout(() => {
      eraTransitionTimer = 0;
      layer.classList.remove("is-era-transitioning");
      elements.eraTransition.classList.remove("is-visible");
      elements.eraTransition.setAttribute("aria-hidden", "true");
      eraTransitionPending = false;
      setPhase(PHASE.PROTEROZOIC);
    }, ERA_TRANSITION_MS);
  };

  const addRustParticle = (x, y, strength = 1) => {
    const band = Math.floor(random(0, 7));
    const targetY = 0.83 + band * 0.019 + random(-0.004, 0.004);
    const origin = constrainPointToPlanet(x, y, 8);
    const target = constrainPointToPlanet(x + random(-0.08, 0.08), targetY, 8);
    rust.push({
      x: origin.x,
      y: origin.y,
      originX: origin.x,
      originY: origin.y,
      targetX: target.x,
      targetY: target.y,
      progress: 0,
      size: random(0.9, 3.2) * strength,
      alpha: random(0.45, 0.92),
    });
  };

  const prepareIronTransition = () => {
    ironCompaction = 0;
    rust.length = 0;
    const inheritedCount = clamp(Math.round(colonies.length * 1.8 + oxygenReleased * 0.45), 38, 220);
    for (let index = 0; index < inheritedCount; index += 1) {
      const source = colonies[index % colonies.length] || { x: random(0.43, 0.94), y: random(0.52, 0.82) };
      addRustParticle(
        clamp(source.x + random(-0.045, 0.045), 0.34, 0.99),
        clamp(source.y + random(-0.035, 0.035), 0.42, 0.88),
        0.85 + oxygenReleased / 320,
      );
    }
  };

  const resize = () => {
    const bounds = layer.getBoundingClientRect();
    width = Math.max(1, bounds.width);
    height = Math.max(1, bounds.height);
    dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const renderEraCounter = (years, phase) => {
    displayedYears = Math.max(0, Math.round(years));
    const formatted = numberFormatter.format(displayedYears);
    elements.time.textContent = formatted;
    elements.timePanel.dataset.counter = formatted;
    elements.timePanel.setAttribute(
      "aria-label",
      displayedYears === 0 ? "現在" : `現在まで、あと${formatted}年`,
    );
    if (phase) {
      elements.timeContext.textContent = displayedYears === 0
        ? `${phase.time} / 地球誕生から現在まで`
        : `${phase.time} / 現在からの差`;
    }
  };

  const animateEraCounter = (targetYears, phase, shouldAnimate) => {
    cancelAnimationFrame(eraCounterFrame);
    const startYears = displayedYears;
    if (!shouldAnimate || reducedMotion || startYears === targetYears) {
      renderEraCounter(targetYears, phase);
      elements.timePanel.classList.remove("is-counting");
      return;
    }

    const startedAt = performance.now();
    const duration = 2380;
    elements.timePanel.classList.add("is-counting");
    elements.timeContext.textContent = "ERA SHIFT / 現在との距離を再計算中";

    const tick = (now) => {
      const progress = clamp((now - startedAt) / duration, 0, 1);
      const eased = 1 - ((1 - progress) ** 4);
      renderEraCounter(startYears + (targetYears - startYears) * eased);
      if (progress < 1) {
        eraCounterFrame = requestAnimationFrame(tick);
        return;
      }
      renderEraCounter(targetYears, phase);
      elements.timePanel.classList.remove("is-counting");
      eraCounterFrame = 0;
    };
    eraCounterFrame = requestAnimationFrame(tick);
  };

  const setPhase = (index) => {
    previousPhaseIndex = phaseIndex;
    phaseIndex = (index + exhibit.phases.length) % exhibit.phases.length;
    if (phaseIndex === PHASE.PROTEROZOIC && previousPhaseIndex !== PHASE.PROTEROZOIC) prepareIronTransition();
    const phase = exhibit.phases[phaseIndex];
    gestureCount = 0;
    const targetYears = ERA_YEARS_BEFORE_PRESENT[phase.id] ?? 0;
    animateEraCounter(targetYears, phase, phaseIndex > previousPhaseIndex);
    elements.kind.textContent = phase.kind;
    elements.kind.dataset.kind = phase.kind;
    elements.index.textContent = phase.index;
    elements.title.textContent = phase.title;
    elements.copy.textContent = phase.copy;
    elements.strataMarker.textContent = phase.marker || "—";
    elements.guide.textContent = phase.guide;
    const isCyanobacteriaEra = phaseIndex === PHASE.ARCHEAN;
    elements.eraProgress.hidden = !isCyanobacteriaEra;
    elements.next.hidden = isCyanobacteriaEra;
    if (isCyanobacteriaEra) updateCyanobacteriaProgress();
    if (phaseIndex === PHASE.HADEAN) {
      elements.effect.textContent = "地球へ触れると、最初期の環境を伝えるジルコンの光が残ります。岩石より古い結晶が、当時すでに水があった可能性を示します。";
    } else if (phaseIndex === PHASE.ARCHEAN) {
      const percentage = Math.round(cyanobacteriaProgress() * 100);
      elements.effect.textContent = cyanobacteriaTouches
        ? `微生物マット${cyanobacteriaTouches}か所、海の充足率${percentage}%。別の場所へ生命を広げてください。`
        : "海へ触れると、シアノバクテリアの群落と酸素の泡が生まれます。海が満ちると、自動で次の時代へ進みます。";
    } else if (phaseIndex === PHASE.PROTEROZOIC) {
      elements.effect.textContent = "前の時代の酸素が海中の鉄と結びつき、縞状鉄鉱層をつくります。その後、大気へ達した酸素は陸を錆びさせ、赤色層を残しました。";
    } else if (phaseIndex === PHASE.PALEOZOIC) {
      elements.effect.textContent = "湿地をなぞると植物由来の炭素が埋没し、黒い石炭層へ変わります。大量の植物、生産性の高い湿地、酸素の乏しい埋没環境と地殻変動が重なった結果です。";
    } else if (phaseIndex === PHASE.MESOZOIC) {
      elements.effect.textContent = "触れた点を衝突地点として、薄いK–Pg境界層が地球を一周します。明るい粒は、地表では少ないイリジウムが濃集した証拠を表します。";
    } else if (phaseIndex === PHASE.CENOZOIC) {
      elements.effect.textContent = "上下になぞると、寒冷期と温暖期の往復が氷河堆積物・花粉・微化石の縞として重なります。ひとつの化石ではなく、複数の記録を読み合わせます。";
    } else if (phaseIndex === PHASE.ANTHROPOCENE) {
      elements.effect.textContent = atmosphericCarbon
        ? `人間活動の急増を示す層 ${Math.round(atmosphericCarbon)}%。コンクリート、プラスチック、燃焼粒子、放射性核種が同じ薄い時代へ集中しています。暖色の大気は熱保持の比喩です。`
        : "都市へ触れると人工物と燃焼の痕跡が同じ薄い層へ集中します。人新世は広く使われる言葉ですが、正式な地質年代としては採用されていません。";
    } else if (phaseIndex === PHASE.GX) {
      const level = Math.max(1, Math.ceil(transcendence * 5));
      elements.effect.textContent = transcendence
        ? `共鳴 ${Math.round(transcendence * 100)}% / 次元層 ${level}。大きくなぞるほど地球が加速し、人間の光点が共進化の軌道へ加わります。`
        : "大きく円を描いて地球を回してください。触れた場所は人間の光点となり、地球と一緒に次の層へ入ります。";
    } else {
      elements.effect.textContent = "画面へ触れると、この時代に対応した変化が生まれます。";
    }
    const isFinalPhase = phaseIndex === exhibit.phases.length - 1;
    elements.next.textContent = isFinalPhase
      ? `${returnTo === "novel" ? "ストーリーへ戻る" : "入口へ戻る"}　→`
      : `${phase.action}　→`;
    [...elements.nav.children].forEach((button, buttonIndex) => {
      button.classList.toggle("is-active", buttonIndex === phaseIndex);
      button.setAttribute("aria-current", buttonIndex === phaseIndex ? "step" : "false");
    });
    layer.dataset.phase = phase.id;
    seedWorld();
  };

  const addInteraction = (normalizedX, normalizedY, motion = 0) => {
    const x = clamp(normalizedX, 0, 1);
    const y = clamp(normalizedY, 0, 1);
    if (!isPointOnPlanet(x, y, 2)) return false;
    gestureCount += 1;
    if (phaseIndex === PHASE.HADEAN) {
      lights.push({ x, y, age: 0, radius: random(18, 36), kind: "zircon" });
      if (lights.length > 28) lights.shift();
      elements.effect.textContent = `ジルコンの記録 ${lights.length}点。約44億年前の結晶は、初期の地表に液体の水があった可能性を伝えます。`;
    } else if (phaseIndex === PHASE.ARCHEAN) {
      if (eraTransitionPending) return false;
      for (let index = 0; index < 7; index += 1) {
        const colonyPoint = constrainPointToPlanet(x + random(-0.035, 0.035), y + random(-0.025, 0.025), 12);
        const bubblePoint = constrainPointToPlanet(x + random(-0.025, 0.025), y + random(-0.018, 0.018), 8);
        colonies.push({ x: colonyPoint.x, y: colonyPoint.y, radius: random(4, 13), age: 0, hue: random(0, 1) });
        bubbles.push({ x: bubblePoint.x, y: bubblePoint.y, size: random(2, 6), speed: random(0.025, 0.07), sway: random(0, Math.PI * 2), age: 0 });
      }
      cyanobacteriaTouches += 1;
      oxygenReleased += 7;
      const cellX = Math.floor(x * 20);
      const cellY = Math.floor(y * 14);
      cyanobacteriaCells.add(`${cellX}:${cellY}`);
      const progress = updateCyanobacteriaProgress();
      elements.effect.textContent = `海の充足率 ${Math.round(progress * 100)}%。光合成で生まれた酸素は、次の時代へ持ち越されます。`;
      if (progress >= 1) beginEraTransition();
    } else if (phaseIndex === PHASE.PROTEROZOIC) {
      ironCompaction = clamp(ironCompaction + 0.14, 0, 1);
      oxygenReleased = Math.max(0, oxygenReleased - 4);
      elements.effect.textContent = `酸化の進行 ${Math.round(ironCompaction * 100)}%。地表の鉄が赤褐色へ変わり、海底には縞状の地層が刻まれます。`;
    } else if (phaseIndex === PHASE.PALEOZOIC) {
      const point = constrainPointToPlanet(x, y, 10);
      coalLayers.push({ x: point.x, y: point.y, width: random(0.08, 0.18), age: 0, depth: random(0.45, 0.9) });
      if (coalLayers.length > 18) coalLayers.shift();
      elements.effect.textContent = `植物由来の炭素を${coalLayers.length}層、湿地の底へ埋めました。圧密された黒い帯が、石炭層として地質記録に残ります。`;
    } else if (phaseIndex === PHASE.MESOZOIC) {
      const point = constrainPointToPlanet(x, y, 10);
      impactRings.push({ x: point.x, y: point.y, age: 0, radius: 4, complete: false });
      if (impactRings.length > 5) impactRings.shift();
      elements.effect.textContent = "衝突点から境界層が広がっています。数ミリから数センチほどの薄い層が、約6600万年前という同じ時刻を世界各地で結びます。";
    } else if (phaseIndex === PHASE.CENOZOIC) {
      const point = constrainPointToPlanet(x, y, 10);
      climateRecords.push({ x: point.x, y: point.y, age: 0, kind: gestureCount % 3, strength: clamp(motion * 8 + 0.4, 0.4, 1) });
      if (climateRecords.length > 24) climateRecords.shift();
      const labels = ["氷河堆積物", "花粉", "微化石"];
      elements.effect.textContent = `${labels[gestureCount % 3]}の記録を追加しました。寒暖の往復は、一種類の証拠ではなく、互いに異なる記録の一致から読み取ります。`;
    } else if (phaseIndex === PHASE.ANTHROPOCENE) {
      for (let index = 0; index < 16; index += 1) {
        const carbonPoint = constrainPointToPlanet(x + random(-0.035, 0.035), Math.max(0.64, y), 10);
        carbon.push({
          x: carbonPoint.x,
          y: carbonPoint.y,
          size: random(2, 5),
          rise: random(0.012, 0.032),
          heat: random(0.5, 1),
          drift: random(-0.0001, 0.0001),
        });
      }
      const point = constrainPointToPlanet(x, y, 10);
      const type = gestureCount % 4;
      technofossils.push({ x: point.x, y: point.y, age: 0, type, size: random(5, 13) });
      if (technofossils.length > 36) technofossils.shift();
      atmosphericCarbon = clamp(atmosphericCarbon + 9, 0, 100);
      elements.effect.textContent = `人間活動の急増を示す層 ${Math.round(atmosphericCarbon)}%。コンクリート、プラスチック、燃焼粒子、放射性核種を同じ薄い時間帯へ重ねています。`;
    } else {
      const node = { x, y, age: 0, kind: gestureCount % 4 };
      nodes.push(node);
      if (nodes.length > 18) nodes.shift();
      gaiaSpinVelocity = clamp(gaiaSpinVelocity + 0.008 + motion * 0.18, 0, 0.16);
      transcendence = clamp(transcendence + 0.028 + motion * 0.45, 0, 1);
      const level = Math.max(1, Math.ceil(transcendence * 5));
      elements.effect.textContent = `共鳴 ${Math.round(transcendence * 100)}% / 次元層 ${level}。${nodes.length}個の人間の光が地球の軌道へ入り、ともに回転しています。`;
    }
    return true;
  };

  const drawBackground = (time) => {
    const theme = themes[phaseIndex];
    const gradient = context.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, rgb(theme.top));
    gradient.addColorStop(1, rgb(theme.bottom));
    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);

    const glowX = width * (0.74 + Math.sin(time * 0.00008) * 0.015);
    const glowY = height * 0.42;
    const radial = context.createRadialGradient(glowX, glowY, 0, glowX, glowY, Math.max(width, height) * 0.52);
    radial.addColorStop(0, rgb(theme.glow, phaseIndex === PHASE.ANTHROPOCENE ? 0.22 : 0.28));
    radial.addColorStop(0.4, rgb(theme.glow, 0.08));
    radial.addColorStop(1, rgb(theme.glow, 0));
    context.fillStyle = radial;
    context.fillRect(0, 0, width, height);
  };

  const drawAncientContinents = (centerX, centerY, radius, time) => {
    const drift = Math.sin(time * 0.00007) * radius * 0.008;
    const landFill = phaseIndex === PHASE.PROTEROZOIC
      ? `rgba(${Math.round(mix(92, 143, ironCompaction))},${Math.round(mix(79, 70, ironCompaction))},${Math.round(mix(61, 45, ironCompaction))},.92)`
      : phaseIndex === PHASE.GX
        ? `rgba(38,112,129,${0.075 + transcendence * 0.045})`
      : phaseIndex <= PHASE.ARCHEAN
      ? "rgba(72,78,67,.88)"
      : phaseIndex === PHASE.MESOZOIC
        ? "rgba(91,82,67,.9)"
        : phaseIndex === PHASE.ANTHROPOCENE
          ? "rgba(91,96,92,.9)"
        : "rgba(58,104,82,.88)";
    const coast = phaseIndex === PHASE.PROTEROZOIC
      ? "rgba(205,139,101,.46)"
      : phaseIndex === PHASE.GX
        ? `rgba(205,246,248,${0.34 + transcendence * 0.22})`
        : "rgba(165,232,194,.42)";
    context.fillStyle = landFill;
    context.strokeStyle = coast;
    context.lineWidth = phaseIndex === PHASE.GX ? Math.max(0.8, radius * 0.0032) : Math.max(1, radius * 0.006);

    context.beginPath();
    context.moveTo(centerX - radius * 0.72 + drift, centerY - radius * 0.22);
    context.bezierCurveTo(centerX - radius * 0.57, centerY - radius * 0.62, centerX - radius * 0.16, centerY - radius * 0.57, centerX - radius * 0.08, centerY - radius * 0.32);
    context.bezierCurveTo(centerX - radius * 0.2, centerY - radius * 0.12, centerX - radius * 0.07, centerY + radius * 0.02, centerX - radius * 0.33, centerY + radius * 0.12);
    context.bezierCurveTo(centerX - radius * 0.62, centerY + radius * 0.08, centerX - radius * 0.76, centerY - radius * 0.02, centerX - radius * 0.72 + drift, centerY - radius * 0.22);
    context.closePath();
    context.fill();
    context.stroke();

    context.beginPath();
    context.moveTo(centerX + radius * 0.12 - drift, centerY - radius * 0.56);
    context.bezierCurveTo(centerX + radius * 0.5, centerY - radius * 0.65, centerX + radius * 0.76, centerY - radius * 0.36, centerX + radius * 0.68, centerY - radius * 0.06);
    context.bezierCurveTo(centerX + radius * 0.58, centerY + radius * 0.08, centerX + radius * 0.3, centerY + radius * 0.02, centerX + radius * 0.22, centerY - radius * 0.17);
    context.bezierCurveTo(centerX + radius * 0.03, centerY - radius * 0.3, centerX + radius * 0.02, centerY - radius * 0.48, centerX + radius * 0.12 - drift, centerY - radius * 0.56);
    context.closePath();
    context.fill();
    context.stroke();

    context.beginPath();
    context.moveTo(centerX - radius * 0.16, centerY + radius * 0.32);
    context.bezierCurveTo(centerX + radius * 0.08, centerY + radius * 0.13, centerX + radius * 0.51, centerY + radius * 0.24, centerX + radius * 0.55, centerY + radius * 0.51);
    context.bezierCurveTo(centerX + radius * 0.34, centerY + radius * 0.75, centerX - radius * 0.08, centerY + radius * 0.72, centerX - radius * 0.29, centerY + radius * 0.53);
    context.closePath();
    context.fill();
    context.stroke();

    context.fillStyle = phaseIndex <= PHASE.PROTEROZOIC
      ? "rgba(116,88,65,.55)"
      : phaseIndex === PHASE.GX
        ? `rgba(205,255,240,${0.09 + transcendence * 0.12})`
        : "rgba(187,213,166,.2)";
    for (let index = 0; index < 12; index += 1) {
      const angle = index * 2.17;
      const x = centerX + Math.cos(angle) * radius * (0.22 + (index % 4) * 0.12);
      const y = centerY + Math.sin(angle * 1.19) * radius * 0.42;
      context.beginPath();
      context.arc(x, y, radius * 0.018, 0, Math.PI * 2);
      context.fill();
    }
  };

  const drawAtmosphere = (centerX, centerY, radius, time) => {
    const carbonStrength = phaseIndex === PHASE.ANTHROPOCENE ? atmosphericCarbon / 100 : 0;
    const oxygenStrength = phaseIndex >= PHASE.PROTEROZOIC && phaseIndex < PHASE.GX ? 0.62 : phaseIndex === PHASE.GX ? 0.5 : 0.08;
    const thickness = radius * (0.028 + oxygenStrength * 0.035 + carbonStrength * 0.12 + (phaseIndex === PHASE.GX ? transcendence * 0.055 : 0));
    context.save();
    context.globalCompositeOperation = "screen";
    for (let ring = 0; ring < 7; ring += 1) {
      const amount = ring / 6;
      const ringRadius = radius + thickness * (0.28 + amount);
      const warm = phaseIndex === PHASE.ANTHROPOCENE;
      context.strokeStyle = phaseIndex === PHASE.GX
        ? (ring % 2
          ? `rgba(153,226,255,${0.045 + transcendence * (0.16 - amount * 0.07)})`
          : `rgba(246,226,164,${0.038 + transcendence * (0.14 - amount * 0.06)})`)
        : warm
          ? `rgba(255,126,67,${0.025 + carbonStrength * (0.12 - amount * 0.07)})`
          : `rgba(135,231,248,${0.025 + oxygenStrength * (0.1 - amount * 0.055)})`;
      context.lineWidth = Math.max(1, thickness * (0.24 - amount * 0.018));
      context.beginPath();
      context.arc(centerX, centerY, ringRadius + Math.sin(time * 0.00045 + ring) * 1.5, 0, Math.PI * 2);
      context.stroke();
    }
    context.restore();
  };

  const getPlanetGeometry = () => {
    const baseRadius = Math.min(width, height) * 0.34;
    if (phaseIndex !== PHASE.GX) {
      return { centerX: width * 0.76, centerY: height * 0.48, radius: baseRadius };
    }
    const travel = 0.004 + transcendence * 0.008;
    return {
      centerX: width * (0.72 + Math.sin(gaiaOrbitPhase) * travel),
      centerY: height * (0.49 + Math.cos(gaiaOrbitPhase * 1.31) * travel),
      radius: baseRadius * (0.9 + transcendence * 0.045 + Math.sin(gaiaOrbitPhase * 2.1) * 0.006),
    };
  };

  const isPointOnPlanet = (normalizedX, normalizedY, inset = 0) => {
    const { centerX, centerY, radius } = getPlanetGeometry();
    const pointX = normalizedX * width;
    const pointY = normalizedY * height;
    return Math.hypot(pointX - centerX, pointY - centerY) <= Math.max(0, radius - inset);
  };

  const constrainPointToPlanet = (normalizedX, normalizedY, inset = 0) => {
    const { centerX, centerY, radius } = getPlanetGeometry();
    const pointX = normalizedX * width;
    const pointY = normalizedY * height;
    const offsetX = pointX - centerX;
    const offsetY = pointY - centerY;
    const distance = Math.hypot(offsetX, offsetY);
    const limit = Math.max(1, radius - inset);
    if (distance <= limit) return { x: pointX / width, y: pointY / height };
    const scale = limit / Math.max(distance, 0.001);
    return {
      x: (centerX + offsetX * scale) / width,
      y: (centerY + offsetY * scale) / height,
    };
  };

  const randomPointOnPlanet = (innerRatio = 0, outerRatio = 0.88) => {
    const { centerX, centerY, radius } = getPlanetGeometry();
    const angle = random(0, Math.PI * 2);
    const innerSquared = innerRatio * innerRatio;
    const outerSquared = outerRatio * outerRatio;
    const distance = radius * Math.sqrt(random(innerSquared, outerSquared));
    return {
      x: (centerX + Math.cos(angle) * distance) / width,
      y: (centerY + Math.sin(angle) * distance) / height,
    };
  };

  const drawGaiaRitual = (delta, time) => {
    if (phaseIndex !== PHASE.GX) return;
    gaiaSpinVelocity *= Math.pow(0.982, delta);
    gaiaSpinVelocity = Math.max(0.0008 + transcendence * 0.001, gaiaSpinVelocity);
    gaiaRotation += gaiaSpinVelocity * delta;
    gaiaOrbitPhase += (0.00065 + gaiaSpinVelocity * 0.04) * delta;

    const { centerX, centerY, radius } = getPlanetGeometry();
    if (!gaiaTrails.length || Math.hypot(centerX - gaiaTrails[gaiaTrails.length - 1].x, centerY - gaiaTrails[gaiaTrails.length - 1].y) > 2.5) {
      gaiaTrails.push({ x: centerX, y: centerY, radius, age: 0 });
      if (gaiaTrails.length > 22) gaiaTrails.shift();
    }

    context.save();
    context.globalCompositeOperation = "screen";

    const halo = context.createRadialGradient(centerX, centerY, radius * 0.74, centerX, centerY, radius * 2.2);
    halo.addColorStop(0, `rgba(100,196,229,${0.05 + transcendence * 0.06})`);
    halo.addColorStop(0.36, `rgba(92,166,218,${0.025 + transcendence * 0.035})`);
    halo.addColorStop(0.7, `rgba(211,226,255,${0.008 + transcendence * 0.014})`);
    halo.addColorStop(1, "rgba(76,156,205,0)");
    context.fillStyle = halo;
    context.beginPath();
    context.arc(centerX, centerY, radius * 2.2, 0, Math.PI * 2);
    context.fill();

    gaiaTrails.forEach((trail, index) => {
      trail.age += delta;
      const alpha = (index / Math.max(1, gaiaTrails.length - 1)) * (0.008 + transcendence * 0.022);
      context.strokeStyle = `rgba(148,211,238,${alpha})`;
      context.lineWidth = 0.6;
      context.beginPath();
      context.arc(trail.x, trail.y, trail.radius * (0.93 + index * 0.003), 0, Math.PI * 2);
      context.stroke();
    });

    const layers = 3 + Math.floor(transcendence * 2);
    for (let layerIndex = 0; layerIndex < layers; layerIndex += 1) {
      const amount = layerIndex / Math.max(1, layers - 1);
      const orbit = radius * (1.14 + amount * (0.34 + transcendence * 0.08));
      context.save();
      context.translate(centerX, centerY);
      context.rotate(gaiaRotation * (0.07 + amount * 0.025) + layerIndex * 0.88 - 0.35);
      context.scale(1, 0.36 + amount * 0.09);
      context.strokeStyle = layerIndex % 2
        ? `rgba(137,211,244,${0.065 + transcendence * 0.08})`
        : `rgba(237,235,219,${0.045 + transcendence * 0.06})`;
      context.lineWidth = 0.65 + transcendence * 0.35;
      context.beginPath();
      context.arc(0, 0, orbit, 0, Math.PI * 2);
      context.stroke();
      context.restore();
    }

    const meridians = 5;
    for (let index = 0; index < meridians; index += 1) {
      const angle = gaiaRotation * 0.08 + (index / meridians) * Math.PI;
      context.save();
      context.translate(centerX, centerY);
      context.rotate(angle);
      context.scale(0.26 + (index % 3) * 0.12, 1);
      context.strokeStyle = `rgba(187,225,244,${0.035 + transcendence * 0.035})`;
      context.lineWidth = 0.65;
      context.beginPath();
      context.arc(0, 0, radius * 0.975, 0, Math.PI * 2);
      context.stroke();
      context.restore();
    }
    context.restore();
  };

  const drawPlanet = (time) => {
    const { centerX, centerY, radius } = getPlanetGeometry();
    context.save();
    context.beginPath();
    context.arc(centerX, centerY, radius, 0, Math.PI * 2);
    context.clip();

    const ocean = context.createRadialGradient(centerX - radius * 0.22, centerY - radius * 0.26, radius * 0.02, centerX, centerY, radius);
    const planetColors = phaseIndex === PHASE.PROTEROZOIC
      ? [
          [Math.round(mix(68, 124, ironCompaction)), Math.round(mix(75, 66, ironCompaction)), Math.round(mix(70, 49, ironCompaction))],
          [Math.round(mix(23, 85, ironCompaction)), Math.round(mix(36, 45, ironCompaction)), Math.round(mix(42, 34, ironCompaction))],
          [Math.round(mix(8, 48, ironCompaction)), Math.round(mix(15, 27, ironCompaction)), Math.round(mix(20, 24, ironCompaction))],
        ]
      : phaseIndex === PHASE.PALEOZOIC
        ? [[85, 170, 160], [18, 87, 92], [4, 28, 38]]
        : phaseIndex === PHASE.MESOZOIC
          ? [[82, 132, 139], [24, 65, 74], [7, 24, 33]]
          : phaseIndex === PHASE.CENOZOIC
            ? [[126, 197, 218], [24, 92, 124], [5, 27, 48]]
            : phaseIndex === PHASE.ANTHROPOCENE
              ? [[94, 126, 132], [34, 62, 66], [10, 22, 27]]
              : phaseIndex === PHASE.GX
                ? [[130, 210, 235], [18, 86, 130], [5, 21, 48]]
                : phaseIndex === PHASE.HADEAN
                  ? [[112, 78, 58], [51, 37, 38], [16, 17, 23]]
                  : [[51, 137, 140], [5, 53, 69], [2, 18, 28]];
    ocean.addColorStop(0, rgb(planetColors[0], 0.96));
    ocean.addColorStop(0.55, rgb(planetColors[1], 0.98));
    ocean.addColorStop(1, rgb(planetColors[2]));
    context.fillStyle = ocean;
    context.fillRect(centerX - radius, centerY - radius, radius * 2, radius * 2);

    context.lineWidth = 1;
    const surfaceLines = phaseIndex === PHASE.GX ? 7 : 18;
    for (let index = 0; index < surfaceLines; index += 1) {
      const denominator = Math.max(1, surfaceLines - 1);
      const y = centerY - radius + (index / denominator) * radius * 2;
      const drift = Math.sin(time * 0.0003 + index * 1.7) * radius * (phaseIndex === PHASE.GX ? 0.012 : 0.025);
      context.strokeStyle = phaseIndex === PHASE.PROTEROZOIC
        ? `rgba(211, 137, 96, ${(0.035 + index * 0.002) * ironCompaction})`
        : phaseIndex === PHASE.GX
          ? `rgba(186,224,241,${0.026 + index * 0.001})`
        : `rgba(171, 244, 230, ${0.055 + index * 0.003})`;
      context.beginPath();
      context.moveTo(centerX - radius, y);
      context.bezierCurveTo(centerX - radius * 0.35, y + drift, centerX + radius * 0.35, y - drift, centerX + radius, y);
      context.stroke();
    }
    if (phaseIndex === PHASE.GX) {
      context.save();
      context.globalCompositeOperation = "screen";
      context.translate(centerX, centerY);
      context.rotate(gaiaRotation * 0.025);
      for (let band = 0; band < 4; band += 1) {
        const angle = -0.68 + band * 0.41;
        const bandRadius = radius * (0.52 + band * 0.095);
        context.save();
        context.rotate(angle);
        context.scale(1, 0.23 + band * 0.035);
        context.strokeStyle = band % 2
          ? `rgba(232,231,215,${0.04 + transcendence * 0.045})`
          : `rgba(139,215,244,${0.055 + transcendence * 0.05})`;
        context.lineWidth = 0.8;
        context.beginPath();
        context.arc(0, 0, bandRadius, 0.2, Math.PI * 1.86);
        context.stroke();
        context.restore();
      }
      for (let point = 0; point < 13; point += 1) {
        const angle = point * 2.399 + gaiaRotation * 0.035;
        const distance = radius * (0.18 + ((point * 37) % 61) / 100);
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle * 1.07) * distance * 0.7;
        const pulse = 0.35 + Math.sin(time * 0.0011 + point) * 0.18;
        context.fillStyle = point % 4 === 0
          ? `rgba(244,239,214,${pulse})`
          : `rgba(153,224,244,${pulse})`;
        context.beginPath();
        context.arc(x, y, point % 4 === 0 ? 1.8 : 1.15, 0, Math.PI * 2);
        context.fill();
      }
      context.restore();
    } else {
      drawAncientContinents(centerX, centerY, radius, time);
    }
    context.restore();

    drawAtmosphere(centerX, centerY, radius, time);
    context.strokeStyle = phaseIndex === PHASE.PROTEROZOIC
      ? "rgba(224, 115, 72, 0.45)"
      : phaseIndex === PHASE.GX
        ? `rgba(205,255,234,${0.45 + transcendence * 0.38})`
        : "rgba(145, 242, 207, 0.34)";
    context.lineWidth = phaseIndex === PHASE.GX ? 1 + transcendence * 1.2 : 1.2;
    context.beginPath();
    context.arc(centerX, centerY, radius, 0, Math.PI * 2);
    context.stroke();
  };

  const drawOceanLines = (time) => {
    const baseY = height * 0.57;
    context.save();
    if (phaseIndex === PHASE.GX) {
      context.globalCompositeOperation = "screen";
      const horizon = height * 0.64;
      for (let line = 0; line < 9; line += 1) {
        const y = horizon + line * height * 0.04;
        const drift = Math.sin(time * 0.00018 + line * 0.72) * 5;
        const gradient = context.createLinearGradient(0, y, width, y);
        gradient.addColorStop(0, "rgba(102,184,214,0)");
        gradient.addColorStop(0.38, `rgba(116,202,224,${0.018 + line * 0.002})`);
        gradient.addColorStop(0.72, `rgba(206,234,239,${0.024 + line * 0.002})`);
        gradient.addColorStop(1, "rgba(102,184,214,0)");
        context.strokeStyle = gradient;
        context.lineWidth = 0.7;
        context.beginPath();
        context.moveTo(0, y + drift);
        context.bezierCurveTo(width * 0.3, y - 10 - drift, width * 0.68, y + 9 + drift, width, y - drift);
        context.stroke();
      }
      context.restore();
      return;
    }
    const sea = context.createLinearGradient(0, baseY, 0, height);
    sea.addColorStop(0, phaseIndex === PHASE.PROTEROZOIC ? "rgba(65,44,37,.12)" : "rgba(18,91,99,.13)");
    sea.addColorStop(0.4, phaseIndex === PHASE.PROTEROZOIC ? "rgba(54,31,27,.27)" : "rgba(5,54,70,.32)");
    sea.addColorStop(1, phaseIndex === PHASE.PROTEROZOIC ? "rgba(29,18,18,.55)" : "rgba(2,27,40,.6)");
    context.fillStyle = sea;
    context.fillRect(0, baseY, width, height - baseY);

    context.fillStyle = phaseIndex === PHASE.PROTEROZOIC ? "rgba(95,54,39,.4)" : "rgba(29,72,64,.42)";
    context.beginPath();
    context.moveTo(0, baseY + 8);
    context.bezierCurveTo(width * 0.12, baseY - 25, width * 0.22, baseY + 18, width * 0.34, baseY - 7);
    context.bezierCurveTo(width * 0.42, baseY - 22, width * 0.53, baseY + 14, width * 0.62, baseY - 4);
    context.lineTo(width * 0.62, baseY + 18);
    context.lineTo(0, baseY + 30);
    context.closePath();
    context.fill();

    context.globalCompositeOperation = "screen";
    for (let line = 0; line < 21; line += 1) {
      const y = baseY + line * height * 0.022;
      context.strokeStyle = phaseIndex === PHASE.PROTEROZOIC
        ? `rgba(205, 93, 55, ${0.08 + line * 0.003})`
        : `rgba(116, 224, 215, ${0.06 + line * 0.002})`;
      context.lineWidth = 0.8;
      context.beginPath();
      for (let x = 0; x <= width; x += 18) {
        const wave = Math.sin(x * 0.012 + line * 0.72 + time * 0.00028) * (4 + line * 0.17);
        if (x === 0) context.moveTo(x, y + wave);
        else context.lineTo(x, y + wave);
      }
      context.stroke();
    }
    context.restore();
  };

  const drawColonies = (delta, time) => {
    if (phaseIndex < PHASE.ARCHEAN || phaseIndex > PHASE.PROTEROZOIC) return;
    context.save();
    context.globalCompositeOperation = "screen";
    colonies.forEach((colony) => {
      colony.age += delta;
      const pulse = 1 + Math.sin(time * 0.0015 + colony.x * 13) * 0.18;
      const x = colony.x * width;
      const y = colony.y * height;
      const inheritedScale = phaseIndex === PHASE.PROTEROZOIC
        ? mix(1, 0.28, ironCompaction)
        : 1;
      const radius = colony.radius * pulse * inheritedScale;
      const glow = context.createRadialGradient(x, y, 0, x, y, radius * 3.2);
      glow.addColorStop(0, phaseIndex === PHASE.PROTEROZOIC
        ? "rgba(232,132,76,.54)"
        : colony.hue > 0.5 ? "rgba(179,255,192,.8)" : "rgba(85,242,204,.82)");
      glow.addColorStop(0.28, phaseIndex === PHASE.PROTEROZOIC ? "rgba(184,82,53,.28)" : "rgba(71,210,181,.35)");
      glow.addColorStop(1, "rgba(31,122,111,0)");
      context.fillStyle = glow;
      context.beginPath();
      context.arc(x, y, radius * 3.2, 0, Math.PI * 2);
      context.fill();
      context.fillStyle = "rgba(198,255,222,.72)";
      context.beginPath();
      context.arc(x, y, Math.max(1, radius * 0.25), 0, Math.PI * 2);
      context.fill();
    });
    context.restore();
  };

  const drawBubbles = (delta, time) => {
    if (phaseIndex < PHASE.ARCHEAN || phaseIndex > PHASE.PROTEROZOIC) return;
    if (bubbles.length < 48 && Math.random() < 0.13) {
      bubbles.push({ x: random(0.48, 0.96), y: random(0.61, 0.9), size: random(2, 6), speed: random(0.018, 0.052), sway: random(0, 6.28), age: 0 });
    }
    context.save();
    context.globalCompositeOperation = "screen";
    bubbles.forEach((bubble) => {
      bubble.age += delta;
      bubble.y -= bubble.speed * delta * 0.04;
      const x = (bubble.x + Math.sin(time * 0.001 + bubble.sway) * 0.008) * width;
      const y = bubble.y * height;
      context.strokeStyle = `rgba(194,246,255,${clamp(0.85 - bubble.age * 0.015, 0.1, 0.8)})`;
      context.lineWidth = 1;
      context.beginPath();
      context.arc(x, y, bubble.size, 0, Math.PI * 2);
      context.stroke();
    });
    context.restore();
    for (let index = bubbles.length - 1; index >= 0; index -= 1) {
      if (bubbles[index].y < 0.04 || bubbles[index].age > 90) bubbles.splice(index, 1);
    }
  };

  const drawRust = (delta, time) => {
    if (phaseIndex !== PHASE.PROTEROZOIC) return;
    context.save();
    const legacyAlpha = 1;
    ironCompaction = clamp(ironCompaction + delta * 0.0035, 0, 1);
    rust.forEach((particle) => {
      particle.progress = clamp((particle.progress || 0) + delta * 0.013, 0, 1);
      const eased = 1 - ((1 - particle.progress) ** 3);
      particle.x = mix(particle.originX, particle.targetX, eased);
      particle.y = mix(particle.originY, particle.targetY, eased);
    });

    const { centerX, centerY, radius } = getPlanetGeometry();
    context.beginPath();
    context.arc(centerX, centerY, radius, 0, Math.PI * 2);
    context.clip();

    const oxidation = context.createLinearGradient(0, centerY - radius, 0, centerY + radius);
    oxidation.addColorStop(0, `rgba(126,67,49,${0.04 * ironCompaction * legacyAlpha})`);
    oxidation.addColorStop(0.52, `rgba(151,76,49,${0.13 * ironCompaction * legacyAlpha})`);
    oxidation.addColorStop(1, `rgba(111,45,31,${0.46 * ironCompaction * legacyAlpha})`);
    context.fillStyle = oxidation;
    context.fillRect(centerX - radius, centerY - radius, radius * 2, radius * 2);

    const strata = context.createLinearGradient(0, centerY + radius * 0.36, 0, centerY + radius);
    strata.addColorStop(0, "rgba(111,48,34,0)");
    strata.addColorStop(1, `rgba(104,39,27,${0.24 * ironCompaction * legacyAlpha})`);
    context.fillStyle = strata;
    context.fillRect(centerX - radius, centerY + radius * 0.28, radius * 2, radius * 0.72);

    for (let line = 0; line < 8; line += 1) {
      const y = centerY + radius * (0.48 + line * 0.065);
      const wave = Math.sin(time * 0.00018 + line * 0.9) * radius * 0.008;
      context.strokeStyle = `rgba(214,132,88,${(0.035 + line * 0.008) * ironCompaction * legacyAlpha})`;
      context.lineWidth = Math.max(1, radius * 0.0025);
      context.beginPath();
      context.moveTo(centerX - radius, y);
      context.bezierCurveTo(centerX - radius * 0.35, y + wave, centerX + radius * 0.35, y - wave, centerX + radius, y);
      context.stroke();
    }
    context.restore();
  };

  const clipPlanet = () => {
    const geometry = getPlanetGeometry();
    context.beginPath();
    context.arc(geometry.centerX, geometry.centerY, geometry.radius, 0, Math.PI * 2);
    context.clip();
    return geometry;
  };

  const drawCoalStrata = (delta, time) => {
    if (phaseIndex !== PHASE.PALEOZOIC) return;
    context.save();
    const { centerX, centerY, radius } = clipPlanet();
    const floor = centerY + radius * 0.34;
    const earth = context.createLinearGradient(0, floor, 0, centerY + radius);
    earth.addColorStop(0, "rgba(47,63,43,.08)");
    earth.addColorStop(1, "rgba(19,21,15,.78)");
    context.fillStyle = earth;
    context.fillRect(centerX - radius, floor, radius * 2, radius);

    for (let band = 0; band < 7; band += 1) {
      const y = floor + radius * (0.08 + band * 0.085);
      const drift = Math.sin(time * 0.00016 + band * 1.3) * radius * 0.006;
      context.strokeStyle = band % 2 ? "rgba(116,98,61,.35)" : "rgba(8,12,10,.82)";
      context.lineWidth = Math.max(2, radius * (0.012 + (band % 3) * 0.006));
      context.beginPath();
      context.moveTo(centerX - radius, y);
      context.bezierCurveTo(centerX - radius * 0.3, y + drift, centerX + radius * 0.32, y - drift, centerX + radius, y);
      context.stroke();
    }

    coalLayers.forEach((layer) => {
      layer.age += delta;
      const settle = clamp(layer.age * 0.018, 0, 1);
      const sourceX = layer.x * width;
      const targetY = floor + radius * (0.18 + layer.depth * 0.55);
      const y = mix(layer.y * height, targetY, 1 - ((1 - settle) ** 3));
      const halfWidth = radius * layer.width * (0.55 + settle * 0.65);
      context.strokeStyle = `rgba(5,10,8,${0.38 + settle * 0.55})`;
      context.lineWidth = Math.max(3, radius * 0.022);
      context.lineCap = "round";
      context.beginPath();
      context.moveTo(sourceX - halfWidth, y);
      context.quadraticCurveTo(sourceX, y + Math.sin(layer.age * 0.03) * 2, sourceX + halfWidth, y);
      context.stroke();

      if (settle < 0.78) {
        context.strokeStyle = `rgba(183,218,128,${(1 - settle) * 0.72})`;
        context.lineWidth = 1.1;
        context.beginPath();
        context.moveTo(sourceX, y);
        context.lineTo(sourceX, y - radius * 0.1 * (1 - settle));
        context.moveTo(sourceX, y - radius * 0.055 * (1 - settle));
        context.lineTo(sourceX - radius * 0.038, y - radius * 0.085 * (1 - settle));
        context.moveTo(sourceX, y - radius * 0.075 * (1 - settle));
        context.lineTo(sourceX + radius * 0.043, y - radius * 0.105 * (1 - settle));
        context.stroke();
      }
    });
    context.restore();
  };

  const drawImpactBoundary = (delta, time) => {
    if (phaseIndex !== PHASE.MESOZOIC) return;
    context.save();
    const { centerX, centerY, radius } = clipPlanet();
    const boundaryY = centerY + radius * 0.58;
    context.strokeStyle = "rgba(223,207,183,.58)";
    context.lineWidth = Math.max(2, radius * 0.009);
    context.beginPath();
    context.moveTo(centerX - radius, boundaryY);
    context.bezierCurveTo(centerX - radius * 0.34, boundaryY - 3, centerX + radius * 0.36, boundaryY + 3, centerX + radius, boundaryY);
    context.stroke();
    for (let grain = 0; grain < 52; grain += 1) {
      const x = centerX - radius + ((grain * 47) % 101) / 100 * radius * 2;
      const y = boundaryY + Math.sin(grain * 2.71 + time * 0.00008) * radius * 0.014;
      context.fillStyle = grain % 7 === 0 ? "rgba(247,224,191,.8)" : "rgba(178,158,142,.32)";
      context.fillRect(x, y, grain % 7 === 0 ? 2 : 1, grain % 7 === 0 ? 2 : 1);
    }

    impactRings.forEach((impact) => {
      impact.age += delta;
      const progress = clamp(impact.age * 0.018, 0, 1);
      const x = impact.x * width;
      const y = impact.y * height;
      const ring = radius * progress * 1.7;
      const alpha = (1 - progress) * 0.64;
      context.strokeStyle = `rgba(248,220,188,${alpha})`;
      context.lineWidth = Math.max(1, radius * 0.008 * (1 - progress * 0.7));
      context.beginPath();
      context.arc(x, y, Math.max(2, ring), 0, Math.PI * 2);
      context.stroke();
      const flash = context.createRadialGradient(x, y, 0, x, y, radius * 0.18);
      flash.addColorStop(0, `rgba(255,239,212,${(1 - progress) * 0.74})`);
      flash.addColorStop(1, "rgba(255,190,130,0)");
      context.fillStyle = flash;
      context.beginPath();
      context.arc(x, y, radius * 0.18, 0, Math.PI * 2);
      context.fill();
    });
    context.restore();
  };

  const drawCenozoicRecords = (delta, time) => {
    if (phaseIndex !== PHASE.CENOZOIC) return;
    context.save();
    const { centerX, centerY, radius } = clipPlanet();
    const baseY = centerY + radius * 0.26;
    for (let band = 0; band < 10; band += 1) {
      const y = baseY + radius * band * 0.065;
      context.strokeStyle = band % 2
        ? `rgba(218,230,224,${0.16 + band * 0.008})`
        : `rgba(111,158,171,${0.18 + band * 0.006})`;
      context.lineWidth = Math.max(2, radius * 0.018);
      context.beginPath();
      context.moveTo(centerX - radius, y);
      context.bezierCurveTo(centerX - radius * 0.38, y - 4, centerX + radius * 0.32, y + 4, centerX + radius, y);
      context.stroke();
    }

    climateRecords.forEach((record, index) => {
      record.age += delta;
      const x = record.x * width;
      const y = record.y * height;
      const pulse = 1 + Math.sin(time * 0.0012 + index) * 0.12;
      if (record.kind === 0) {
        context.fillStyle = "rgba(220,240,244,.68)";
        context.beginPath();
        context.moveTo(x, y - 7 * pulse);
        context.lineTo(x + 7 * pulse, y + 6 * pulse);
        context.lineTo(x - 7 * pulse, y + 6 * pulse);
        context.closePath();
        context.fill();
      } else if (record.kind === 1) {
        context.strokeStyle = "rgba(222,216,147,.7)";
        context.lineWidth = 1;
        context.beginPath();
        context.arc(x, y, 5 * pulse, 0, Math.PI * 2);
        context.moveTo(x - 8, y);
        context.lineTo(x + 8, y);
        context.moveTo(x, y - 8);
        context.lineTo(x, y + 8);
        context.stroke();
      } else {
        context.strokeStyle = "rgba(174,231,222,.7)";
        context.beginPath();
        context.arc(x, y, 6 * pulse, 0, Math.PI * 2);
        context.arc(x, y, 2 * pulse, 0, Math.PI * 2);
        context.stroke();
      }
    });
    context.restore();
  };

  const drawTechnofossils = (delta, time) => {
    if (phaseIndex !== PHASE.ANTHROPOCENE) return;
    context.save();
    const { centerX, centerY, radius } = clipPlanet();
    const baseY = centerY + radius * 0.42;
    context.fillStyle = "rgba(52,52,50,.58)";
    context.fillRect(centerX - radius, baseY, radius * 2, radius * 0.58);
    context.strokeStyle = "rgba(177,179,172,.2)";
    context.lineWidth = 1;
    for (let x = centerX - radius; x < centerX + radius; x += radius * 0.11) {
      context.beginPath();
      context.moveTo(x, baseY);
      context.lineTo(x + radius * 0.04, centerY + radius);
      context.stroke();
    }
    context.strokeStyle = "rgba(238,194,159,.5)";
    context.lineWidth = Math.max(1, radius * 0.006);
    context.beginPath();
    context.moveTo(centerX - radius, baseY - radius * 0.018);
    context.lineTo(centerX + radius, baseY - radius * 0.018);
    context.stroke();

    technofossils.forEach((item, index) => {
      item.age += delta;
      const settle = clamp(item.age * 0.025, 0, 1);
      const x = item.x * width;
      const y = mix(item.y * height, baseY + radius * (0.05 + (index % 5) * 0.055), settle);
      const alpha = 0.35 + settle * 0.45;
      if (item.type === 0) {
        context.fillStyle = `rgba(171,176,175,${alpha})`;
        context.fillRect(x - item.size, y - item.size * 0.45, item.size * 2, item.size * 0.9);
      } else if (item.type === 1) {
        context.strokeStyle = `rgba(116,198,209,${alpha})`;
        context.lineWidth = 2;
        context.beginPath();
        context.arc(x, y, item.size * 0.75, 0.2, Math.PI * 1.7);
        context.stroke();
      } else if (item.type === 2) {
        context.fillStyle = `rgba(35,31,31,${alpha})`;
        context.beginPath();
        context.arc(x, y, item.size * 0.38, 0, Math.PI * 2);
        context.fill();
      } else {
        context.strokeStyle = `rgba(247,183,106,${alpha})`;
        context.lineWidth = 1;
        for (let ray = 0; ray < 6; ray += 1) {
          const angle = ray * Math.PI / 3 + time * 0.00008;
          context.beginPath();
          context.moveTo(x + Math.cos(angle) * 2, y + Math.sin(angle) * 2);
          context.lineTo(x + Math.cos(angle) * item.size, y + Math.sin(angle) * item.size);
          context.stroke();
        }
      }
    });
    context.restore();
  };

  const drawBlueSky = (time) => {
    if (phaseIndex !== PHASE.PALEOZOIC) return;
    context.save();
    context.globalCompositeOperation = "screen";
    const horizon = context.createLinearGradient(0, 0, 0, height * 0.72);
    horizon.addColorStop(0, "rgba(96,194,235,.3)");
    horizon.addColorStop(0.68, "rgba(114,225,244,.08)");
    horizon.addColorStop(1, "rgba(114,225,244,0)");
    context.fillStyle = horizon;
    context.fillRect(0, 0, width, height * 0.72);
    for (let index = 0; index < 8; index += 1) {
      const radius = height * (0.13 + index * 0.042) + Math.sin(time * 0.0004 + index) * 4;
      context.strokeStyle = `rgba(157,235,255,${0.11 - index * 0.009})`;
      context.beginPath();
      context.arc(width * 0.76, height * 0.48, radius, Math.PI * 1.08, Math.PI * 1.92);
      context.stroke();
    }
    context.restore();
  };

  const drawCarbon = (delta, time) => {
    if (phaseIndex !== PHASE.ANTHROPOCENE) return;
    context.save();
    for (let line = 0; line < 8; line += 1) {
      const y = height * (0.78 + line * 0.024);
      context.strokeStyle = line % 2 ? "rgba(126,93,70,.28)" : "rgba(22,24,24,.74)";
      context.lineWidth = 5 + line * 1.3;
      context.beginPath();
      context.moveTo(width * 0.34, y);
      context.bezierCurveTo(width * 0.54, y - 10, width * 0.75, y + 9, width, y - 4);
      context.stroke();
    }
    const heatStrength = atmosphericCarbon / 100;
    const warmVeil = context.createLinearGradient(0, 0, 0, height * 0.72);
    warmVeil.addColorStop(0, `rgba(255,102,55,${heatStrength * 0.14})`);
    warmVeil.addColorStop(0.5, `rgba(236,88,42,${heatStrength * 0.055})`);
    warmVeil.addColorStop(1, "rgba(236,88,42,0)");
    context.fillStyle = warmVeil;
    context.fillRect(0, 0, width, height * 0.72);

    for (let band = 0; band < 9; band += 1) {
      const y = height * (0.12 + band * 0.048);
      const distortion = Math.sin(time * 0.001 + band * 0.9) * (6 + heatStrength * 16);
      context.strokeStyle = `rgba(255,164,105,${heatStrength * (0.035 + band * 0.004)})`;
      context.lineWidth = 1 + heatStrength * 1.8;
      context.beginPath();
      context.moveTo(width * 0.3, y);
      context.bezierCurveTo(width * 0.5, y + distortion, width * 0.76, y - distortion, width, y + distortion * 0.35);
      context.stroke();
    }

    context.globalCompositeOperation = "screen";
    carbon.forEach((particle) => {
      particle.y -= particle.rise * delta * 0.018;
      particle.x += (particle.drift || 0) * delta + Math.sin(time * 0.001 + particle.heat * 8) * 0.00006 * delta;
      if (particle.y < 0.13) {
        particle.y = random(0.13, 0.28);
        particle.rise *= 0.22;
      }
      const x = particle.x * width;
      const y = particle.y * height;
      const trail = particle.size * (5 + particle.heat * 5);
      const trailGradient = context.createLinearGradient(x, y, x, y + trail);
      trailGradient.addColorStop(0, `rgba(255,178,116,${0.32 + particle.heat * 0.32})`);
      trailGradient.addColorStop(1, "rgba(225,78,37,0)");
      context.strokeStyle = trailGradient;
      context.lineWidth = Math.max(1, particle.size * 0.48);
      context.beginPath();
      context.moveTo(x, y + trail);
      context.quadraticCurveTo(x + Math.sin(time * 0.002 + particle.heat) * 8, y + trail * 0.5, x, y);
      context.stroke();
    });
    context.restore();
  };

  const drawNetwork = (delta, time) => {
    if (phaseIndex !== PHASE.GX) return;
    const { centerX, centerY, radius: planetRadius } = getPlanetGeometry();
    context.save();
    context.globalCompositeOperation = "screen";
    nodes.forEach((node, index) => {
      node.age += delta;
      const angle = gaiaRotation * (0.34 + (index % 3) * 0.025) + (index / Math.max(1, nodes.length)) * Math.PI * 2;
      const orbitRadius = planetRadius * (1.24 + (index % 3) * 0.17);
      const targetX = (centerX + Math.cos(angle) * orbitRadius) / width;
      const targetY = (centerY + Math.sin(angle) * orbitRadius * 0.5) / height;
      const attraction = (0.006 + transcendence * 0.014) * delta;
      node.x = mix(node.x, targetX, clamp(attraction, 0, 0.18));
      node.y = mix(node.y, targetY, clamp(attraction, 0, 0.18));

      context.strokeStyle = `rgba(184,245,235,${0.06 + transcendence * 0.18})`;
      context.lineWidth = 0.8;
      context.beginPath();
      context.moveTo(centerX, centerY);
      context.quadraticCurveTo(
        centerX + Math.cos(angle - 0.65) * orbitRadius * 0.52,
        centerY + Math.sin(angle - 0.65) * orbitRadius * 0.28,
        node.x * width,
        node.y * height,
      );
      context.stroke();
    });
    for (let first = 0; first < nodes.length; first += 1) {
      for (let second = first + 1; second < nodes.length; second += 1) {
        const a = nodes[first];
        const b = nodes[second];
        const distance = Math.hypot((a.x - b.x) * width, (a.y - b.y) * height);
        if (distance > Math.min(width, height) * 0.36) continue;
        const alpha = 0.32 * (1 - distance / (Math.min(width, height) * 0.36));
        context.strokeStyle = `rgba(136,247,211,${alpha})`;
        context.lineWidth = 1;
        context.beginPath();
        context.moveTo(a.x * width, a.y * height);
        const midX = (a.x + b.x) * width * 0.5;
        const midY = (a.y + b.y) * height * 0.5 - Math.sin(time * 0.0007 + first) * 16;
        context.quadraticCurveTo(midX, midY, b.x * width, b.y * height);
        context.stroke();
      }
    }
    nodes.forEach((node, index) => {
      const x = node.x * width;
      const y = node.y * height;
      const radius = 4.5 + Math.sin(time * 0.002 + index) * 1.4 + transcendence * 1.6;
      const colors = [[139, 245, 222], [117, 220, 244], [240, 237, 211], [188, 210, 232]];
      const color = colors[node.kind % colors.length];
      context.fillStyle = rgb(color, 0.88);
      context.shadowBlur = 16;
      context.shadowColor = rgb(color, 0.66);
      context.beginPath();
      context.arc(x, y, radius * 0.56, 0, Math.PI * 2);
      context.fill();

      context.shadowBlur = 0;
      context.strokeStyle = rgb(color, 0.2 + transcendence * 0.2);
      context.lineWidth = 0.8;
      context.beginPath();
      context.arc(x, y, radius * 1.8, 0, Math.PI * 2);
      context.stroke();
    });

    if (transcendence > 0.5) {
      const coreRadius = planetRadius * (0.06 + (transcendence - 0.5) * 0.12);
      const core = context.createRadialGradient(centerX, centerY, 0, centerX, centerY, coreRadius * 5);
      core.addColorStop(0, `rgba(255,248,211,${0.35 + transcendence * 0.45})`);
      core.addColorStop(0.2, `rgba(187,255,232,${0.18 + transcendence * 0.24})`);
      core.addColorStop(1, "rgba(123,218,230,0)");
      context.fillStyle = core;
      context.beginPath();
      context.arc(centerX, centerY, coreRadius * 5, 0, Math.PI * 2);
      context.fill();
    }
    context.restore();
  };

  const drawLights = (delta) => {
    if (phaseIndex !== PHASE.HADEAN || !lights.length) return;
    context.save();
    context.globalCompositeOperation = "screen";
    lights.forEach((light, index) => {
      light.age = Math.min(48, light.age + delta);
      const x = light.x * width;
      const y = light.y * height;
      const radius = light.radius * (1.15 + Math.sin(light.age * 0.045 + index) * 0.08);
      const glow = context.createRadialGradient(x, y, 0, x, y, radius);
      glow.addColorStop(0, "rgba(231,247,213,.62)");
      glow.addColorStop(0.36, "rgba(169,228,205,.2)");
      glow.addColorStop(1, "rgba(93,223,195,0)");
      context.fillStyle = glow;
      context.beginPath();
      context.arc(x, y, radius, 0, Math.PI * 2);
      context.fill();

      context.save();
      context.translate(x, y);
      context.rotate(Math.PI * 0.25 + index * 0.37);
      context.fillStyle = "rgba(231,240,202,.74)";
      context.strokeStyle = "rgba(251,255,231,.9)";
      context.lineWidth = 1;
      context.beginPath();
      context.moveTo(0, -radius * 0.34);
      context.lineTo(radius * 0.17, 0);
      context.lineTo(0, radius * 0.34);
      context.lineTo(-radius * 0.17, 0);
      context.closePath();
      context.fill();
      context.stroke();
      context.restore();
    });
    context.restore();
  };

  const animate = (time) => {
    if (!isOpen) return;
    const delta = clamp((time - previousTime) / 16.67 || 1, 0.2, 3);
    previousTime = time;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    drawBackground(time);
    drawOceanLines(time);
    drawGaiaRitual(delta, time);
    drawPlanet(time);
    drawColonies(delta, time);
    drawBubbles(delta, time);
    drawRust(delta, time);
    drawCoalStrata(delta, time);
    drawImpactBoundary(delta, time);
    drawCenozoicRecords(delta, time);
    drawTechnofossils(delta, time);
    drawCarbon(delta, time);
    drawNetwork(delta, time);
    drawLights(delta);
    animationFrame = requestAnimationFrame(animate);
  };

  const closeDataPanel = () => {
    elements.dataPanel.classList.remove("is-open");
    elements.dataPanel.setAttribute("aria-hidden", "true");
    elements.data.setAttribute("aria-expanded", "false");
  };

  const openDataPanel = () => {
    elements.dataPanel.classList.add("is-open");
    elements.dataPanel.setAttribute("aria-hidden", "false");
    elements.data.setAttribute("aria-expanded", "true");
    elements.dataClose.focus({ preventScroll: true });
  };

  const openGX = async (options = {}) => {
    if (isOpen) return;
    previousFocus = document.activeElement;
    returnTo = options.returnTo === "novel" ? "novel" : "intro";
    isOpen = true;
    layer.hidden = false;
    layer.setAttribute("aria-hidden", "false");
    document.body.classList.add("gx-open");
    setUnderlayHidden(true);
    resize();
    requestAnimationFrame(() => layer.classList.add("is-open"));
    await loadExhibit();
    setPhase(options.phase ?? 0);
    previousTime = performance.now();
    cancelAnimationFrame(animationFrame);
    animationFrame = requestAnimationFrame(animate);
    elements.close.focus({ preventScroll: true });
  };

  const closeGX = () => {
    if (!isOpen) return;
    closeDataPanel();
    window.clearTimeout(eraTransitionTimer);
    eraTransitionTimer = 0;
    eraTransitionPending = false;
    layer.classList.remove("is-era-transitioning");
    elements.eraTransition.classList.remove("is-visible");
    elements.eraTransition.setAttribute("aria-hidden", "true");
    isOpen = false;
    cancelAnimationFrame(animationFrame);
    cancelAnimationFrame(eraCounterFrame);
    eraCounterFrame = 0;
    layer.classList.remove("is-open");
    layer.setAttribute("aria-hidden", "true");
    document.body.classList.remove("gx-open");
    setUnderlayHidden(false);
    window.setTimeout(() => {
      if (!isOpen) layer.hidden = true;
    }, reducedMotion ? 0 : 340);
    if (returnTo === "novel") {
      window.dispatchEvent(new CustomEvent("gaia:gx-return-to-novel"));
    } else {
      previousFocus?.focus?.({ preventScroll: true });
    }
  };

  const pointerPosition = (event) => {
    const bounds = canvas.getBoundingClientRect();
    return {
      x: (event.clientX - bounds.left) / bounds.width,
      y: (event.clientY - bounds.top) / bounds.height,
    };
  };

  openButton.addEventListener("click", (event) => {
    event.stopPropagation();
    openGX({ returnTo: "intro" });
  });
  elements.close.addEventListener("click", closeGX);
  elements.next.addEventListener("click", () => {
    if (phaseIndex === exhibit.phases.length - 1) closeGX();
    else setPhase(phaseIndex + 1);
  });
  elements.restart.addEventListener("click", resetWorld);
  elements.data.addEventListener("click", openDataPanel);
  elements.dataClose.addEventListener("click", () => {
    closeDataPanel();
    elements.data.focus({ preventScroll: true });
  });

  canvas.addEventListener("pointerdown", (event) => {
    if (!isOpen) return;
    const position = pointerPosition(event);
    if (!isPointOnPlanet(position.x, position.y, 2)) {
      pointer.active = false;
      return;
    }
    pointer = { ...position, active: true };
    addInteraction(position.x, position.y, 0.02);
    canvas.setPointerCapture?.(event.pointerId);
  });
  canvas.addEventListener("pointermove", (event) => {
    if (!pointer.active || !isOpen) return;
    const position = pointerPosition(event);
    const motion = Math.hypot(position.x - pointer.x, position.y - pointer.y);
    if (motion < 0.018) return;
    pointer = { ...position, active: true };
    if (!isPointOnPlanet(position.x, position.y, 2)) return;
    addInteraction(position.x, position.y, motion);
  });
  const releasePointer = () => { pointer.active = false; };
  canvas.addEventListener("pointerup", releasePointer);
  canvas.addEventListener("pointercancel", releasePointer);
  window.addEventListener("resize", () => { if (isOpen) resize(); });
  window.addEventListener("gaia:gx-open", (event) => openGX(event.detail || {}));
  window.addEventListener("keydown", (event) => {
    if (!isOpen) return;
    if (event.key === "Escape") {
      event.preventDefault();
      if (elements.dataPanel.classList.contains("is-open")) closeDataPanel();
      else closeGX();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      if (phaseIndex === exhibit.phases.length - 1) closeGX();
      else setPhase(phaseIndex + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      setPhase(phaseIndex - 1);
    }
  });

  window.GaiaGX = { open: openGX, close: closeGX, setPhase };
})();
