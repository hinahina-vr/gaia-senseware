(() => {
  "use strict";
  if (globalThis.GaiaGuidedTour || typeof document === "undefined") return;

  const steps = Object.freeze([
    {
      id: "concept", duration: 5, kicker: "01 / CONCEPT", title: "地球の変化を、感覚へ。",
      copy: "公開データとして保存された地球の変化を、光・色・動き・音へ翻訳するインタラクティブ展示です。",
      instruction: "このガイドは実際の展示を使い、60秒で自動進行します。",
    },
    {
      id: "map", duration: 10, kicker: "02 / BREATHING EARTH", title: "数字を、一枚の地球へ。",
      copy: "『地球の一呼吸』では、CO₂濃度と気温偏差を同じ時間軸で確認できます。",
      instruction: "地図へ触れるか、Tabキーで地図を選んで観測地点を確かめてください。",
    },
    {
      id: "time", duration: 12, kicker: "03 / TIME & PLACE", title: "年代を動かして、変化を読む。",
      copy: "1958年から現在、そして仮定を含む将来まで、表示区分を分けてたどります。",
      instruction: "強調された年代スライダーをドラッグするか、矢印キーで動かせます。",
    },
    {
      id: "transform", duration: 11, kicker: "04 / RAW → VISUAL", title: "元データから、光になるまで。",
      copy: "RAW、計算・補間、画面表現を同じパネルで切り替え、どこからが作品の変換かを示します。",
      instruction: "RAW／変換／VISUALのタブは、クリックとキーボードの両方で操作できます。",
    },
    {
      id: "space", duration: 10, kicker: "05 / SOLAR FLARE", title: "観測窓を、宇宙へ広げる。",
      copy: "NASAの保存済み記録を読み、太陽フレアの等級と時刻を光の大きさや波へ変換します。",
      instruction: "『この記録を再生』を押すと、選択中の公開記録が光として再生されます。",
    },
    {
      id: "story", duration: 8, kicker: "06 / STORY", title: "物語から、データへ戻れる。",
      copy: "登場人物が見つけた九つの観測記録は、物語の寄り道ではなく、同じ公開データ展示への入口です。",
      instruction: "「海も、空も、生命も。互いに変え合って、今の地球になりましたの。」— ミズハ",
    },
    {
      id: "proof", duration: 4, kicker: "07 / HOW IT IS MADE", title: "根拠まで、作品の一部に。",
      copy: "HTML・CSS・JavaScriptとブラウザ標準APIで制作し、外部ランタイム描画ライブラリを使っていません。",
      instruction: "○ 公開記録　△ 計算・補間　◇ 仮定・操作を、展示内で区別しています。",
    },
  ]);
  const totalDuration = steps.reduce((sum, step) => sum + step.duration, 0);
  const layer = document.createElement("section");
  layer.className = "gaia-tour";
  layer.id = "gaia-guided-tour";
  layer.hidden = true;
  layer.inert = true;
  layer.setAttribute("role", "dialog");
  layer.setAttribute("aria-modal", "false");
  layer.setAttribute("aria-labelledby", "gaia-tour-title");
  layer.innerHTML = `
    <div class="gaia-tour-vignette" aria-hidden="true"></div>
    <article class="gaia-tour-card">
      <div class="gaia-tour-card-index"><span data-tour-step>01</span><i></i><span>07</span></div>
      <p class="gaia-tour-kicker" data-tour-kicker></p>
      <h2 id="gaia-tour-title" data-tour-title></h2>
      <p class="gaia-tour-copy" data-tour-copy></p>
      <p class="gaia-tour-instruction" data-tour-instruction></p>
      <article class="gaia-tour-receipt" data-tour-receipt hidden aria-label="データから表現への変換レシート">
        <p><span>○ SOURCE / 公開記録</span><strong data-tour-receipt-source></strong><small data-tour-receipt-provider></small></p>
        <p><span>△ DERIVED / 計算・補間</span><strong data-tour-receipt-transform></strong></p>
        <p><span>◇ SCENARIO / 仮定・操作</span><strong data-tour-receipt-visual></strong></p>
      </article>
      <p class="gaia-tour-fallback" data-tour-fallback hidden>表示を読み込めなかったため、同じ構成の静的な説明で続けています。</p>
    </article>
    <section class="gaia-tour-finish" data-tour-finish hidden aria-labelledby="gaia-tour-finish-title">
      <p>60 SECOND TOUR / COMPLETE</p><h2 id="gaia-tour-finish-title">ここから、あなたの観測へ。</h2>
      <p class="gaia-tour-finish-recommend"><span>まず見る3つ</span><strong>地球の一呼吸</strong><strong>世界地図</strong><strong>太陽の閃光</strong></p>
      <div><button type="button" data-tour-destination="explore">13展示を探索</button><button type="button" data-tour-destination="story">物語を始める</button><a href="./sensors/">センサーを見る</a><button type="button" data-tour-destination="source">出典を見る</button></div>
    </section>
    <nav class="gaia-tour-controls" aria-label="60秒ガイドの操作">
      <button type="button" data-tour-action="exit">終了</button><button type="button" data-tour-action="previous" aria-label="前の案内">←</button>
      <button type="button" data-tour-action="toggle" aria-pressed="true"><span data-tour-toggle-label>一時停止</span></button>
      <button type="button" data-tour-action="next" aria-label="次の案内">→</button><div class="gaia-tour-time"><span data-tour-time>60</span><small>SEC</small></div>
      <div class="gaia-tour-progress" aria-hidden="true"><i data-tour-progress></i></div>
    </nav>`;
  document.body.append(layer);

  const find = (selector) => layer.querySelector(selector);
  const card = find(".gaia-tour-card");
  const finishPanel = find("[data-tour-finish]");
  const fallback = find("[data-tour-fallback]");
  const receipt = find("[data-tour-receipt]");
  const toggle = find("[data-tour-action='toggle']");
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let active = false;
  let running = false;
  let index = 0;
  let elapsed = 0;
  let lastFrame = 0;
  let frame = 0;
  let generation = 0;
  let returnFocus = null;
  let returnScroll = { x: 0, y: 0 };
  let runningBeforeHidden = false;
  const stepTimers = new Set();

  const staticReceipts = Object.freeze({
    map: {
      source: "CO₂濃度 315.7 ppm（1958年基準） / 気温偏差 ℃", provider: "NOAA GML / GOSAT・NIES / NASA GISTEMP",
      transform: "保存済みの観測値を年代へ補間し、SOURCE・DERIVED・SCENARIOを分離", visual: "CO₂→明るさと呼吸速度 / 気温偏差→青から赤の色",
    },
    time: {
      source: "年代・CO₂濃度・気温偏差", provider: "NOAA GML / GOSAT・NIES / NASA GISTEMP",
      transform: "1958–2009は再構成、観測期間はSOURCE、2026年以降は試算", visual: "年代スライダー→同じ地球上の色・光・速度",
    },
    transform: {
      source: "同梱JSONの先頭10件と単位・取得日", provider: "公式公開データのローカルスナップショット",
      transform: "正規化・補間・固定尺度をVanilla JavaScriptで計算", visual: "GLSLの色・光・動きへ入力。観客操作はSCENARIOとして分離",
    },
    space: {
      source: "太陽フレア等級と観測時刻", provider: "NASA DONKI",
      transform: "X線等級を表示用の大きさと持続時間へ変換", visual: "フレア強度→開く光 / 観客操作→白い波紋",
    },
  });

  const waitForMapAdapter = () => globalThis.GaiaMapObservationAdapter
    ? Promise.resolve(globalThis.GaiaMapObservationAdapter)
    : new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error("map adapter timeout")), 12000);
        addEventListener("gaia:map-adapter-ready", () => { clearTimeout(timer); resolve(globalThis.GaiaMapObservationAdapter); }, { once: true });
      });
  const waitForSpaceAdapter = () => globalThis.GaiaSpaceTourAdapter
    ? Promise.resolve(globalThis.GaiaSpaceTourAdapter)
    : new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error("space adapter timeout")), 12000);
        addEventListener("gaia:space-tour-adapter-ready", () => { clearTimeout(timer); resolve(globalThis.GaiaSpaceTourAdapter); }, { once: true });
      });
  const scheduleStepTask = (callback, delay, currentGeneration) => {
    const timer = setTimeout(() => {
      stepTimers.delete(timer);
      if (active && generation === currentGeneration) callback();
    }, delay);
    stepTimers.add(timer);
  };
  const clearStepTasks = () => {
    stepTimers.forEach(clearTimeout);
    stepTimers.clear();
  };
  const closeSpace = () => {
    globalThis.GaiaSpaceTourAdapter?.close?.();
    const spaceLayer = document.querySelector("#space-layer");
    if (spaceLayer instanceof HTMLElement && !spaceLayer.hidden) {
      dispatchEvent(new CustomEvent("gaia:space-close", { detail: { returnToTop: false, source: "tour" } }));
    }
  };
  const clearTargets = () => {
    globalThis.GaiaMapObservationAdapter?.clearFocus?.();
    globalThis.GaiaSpaceTourAdapter?.clearFocus?.();
  };
  const renderReceipt = (value) => {
    if (!value) { receipt.hidden = true; return; }
    find("[data-tour-receipt-source]").textContent = [value.source, value.at].filter(Boolean).join(" / ");
    find("[data-tour-receipt-provider]").textContent = value.provider || "保存済み公開データ";
    find("[data-tour-receipt-transform]").textContent = value.transform || "表示用の尺度へ変換";
    find("[data-tour-receipt-visual]").textContent = value.visual || "色・光・動きへ反映";
    receipt.hidden = false;
  };
  const useStaticFallback = (step) => {
    fallback.hidden = false;
    renderReceipt(staticReceipts[step.id] || null);
    layer.dataset.fallback = "true";
  };
  const applyStep = async (step, currentGeneration) => {
    clearStepTasks();
    clearTargets();
    fallback.hidden = true;
    receipt.hidden = true;
    delete layer.dataset.fallback;
    layer.dataset.step = step.id;
    try {
      const mapAdapter = await waitForMapAdapter();
      if (!active || currentGeneration !== generation) return;
      mapAdapter.closeSource?.();
      if (step.id === "concept") {
        closeSpace();
        mapAdapter.showIntro();
      } else if (step.id === "map") {
        closeSpace();
        mapAdapter.selectMode(0);
        mapAdapter.openMap();
        mapAdapter.setSignalTime(42);
        await Promise.race([mapAdapter.waitSignalsReady(), new Promise((_, reject) => setTimeout(() => reject(new Error("signals timeout")), 9000))]);
        if (!active || currentGeneration !== generation) return;
        mapAdapter.focusControl?.("map");
        renderReceipt(mapAdapter.getTourReceipt?.() || staticReceipts.map);
      } else if (step.id === "time") {
        closeSpace();
        mapAdapter.selectMode(0);
        mapAdapter.openMap();
        mapAdapter.setSignalTime(78);
        await Promise.race([mapAdapter.waitSignalsReady(), new Promise((_, reject) => setTimeout(() => reject(new Error("signals timeout")), 9000))]);
        if (!active || currentGeneration !== generation) return;
        mapAdapter.focusControl?.("timeline");
        renderReceipt(mapAdapter.getTourReceipt?.() || staticReceipts.time);
      } else if (step.id === "transform") {
        closeSpace();
        mapAdapter.selectMode(0);
        await Promise.race([mapAdapter.waitSignalsReady(), new Promise((_, reject) => setTimeout(() => reject(new Error("signals timeout")), 9000))]);
        if (!active || currentGeneration !== generation) return;
        mapAdapter.openSourceTab?.("raw");
        renderReceipt(mapAdapter.getTourReceipt?.() || staticReceipts.transform);
        scheduleStepTask(() => mapAdapter.openSourceTab?.("transform"), 3600, currentGeneration);
        scheduleStepTask(() => mapAdapter.openSourceTab?.("visual"), 7600, currentGeneration);
      } else if (step.id === "space") {
        mapAdapter.closeSource?.();
        mapAdapter.closeMap();
        await globalThis.GaiaModeLoader?.load?.("space");
        const spaceAdapter = await waitForSpaceAdapter();
        await Promise.race([spaceAdapter.waitReady(), new Promise((_, reject) => setTimeout(() => reject(new Error("space timeout")), 9000))]);
        if (!active || currentGeneration !== generation) return;
        await spaceAdapter.openAtMode(0);
        spaceAdapter.focusControl?.("launch");
        renderReceipt(spaceAdapter.getTourReceipt?.() || staticReceipts.space);
        scheduleStepTask(() => {
          try { renderReceipt(spaceAdapter.launch?.() || staticReceipts.space); } catch { useStaticFallback(step); }
        }, 2600, currentGeneration);
      } else {
        closeSpace();
        mapAdapter.showIntro();
      }
    } catch {
      if (active && currentGeneration === generation) useStaticFallback(step);
    }
  };

  const completedBefore = () => steps.slice(0, index).reduce((sum, step) => sum + step.duration, 0);
  const updateClock = () => {
    const totalElapsed = Math.min(totalDuration, completedBefore() + elapsed);
    find("[data-tour-time]").textContent = String(Math.max(0, Math.ceil(totalDuration - totalElapsed)));
    find("[data-tour-progress]").style.transform = `scaleX(${totalElapsed / totalDuration})`;
  };
  const syncToggle = () => {
    toggle.setAttribute("aria-pressed", String(running));
    find("[data-tour-toggle-label]").textContent = running ? "一時停止" : "再生";
  };
  const renderStep = () => {
    const step = steps[index];
    generation += 1;
    card.hidden = false;
    finishPanel.hidden = true;
    find("[data-tour-step]").textContent = String(index + 1).padStart(2, "0");
    find("[data-tour-kicker]").textContent = step.kicker;
    find("[data-tour-title]").textContent = step.title;
    find("[data-tour-copy]").textContent = step.copy;
    find("[data-tour-instruction]").textContent = step.instruction;
    updateClock();
    void applyStep(step, generation);
  };
  const showFinish = () => {
    running = false;
    elapsed = steps.at(-1).duration;
    clearStepTasks();
    clearTargets();
    syncToggle();
    updateClock();
    card.hidden = true;
    finishPanel.hidden = false;
    finishPanel.querySelector("button")?.focus({ preventScroll: true });
  };
  const setStep = (nextIndex, { pause = false } = {}) => {
    if (nextIndex >= steps.length) { showFinish(); return; }
    index = Math.max(0, nextIndex);
    elapsed = 0;
    if (pause) running = false;
    syncToggle();
    renderStep();
  };
  const tick = (now) => {
    if (!active) return;
    if (!lastFrame) lastFrame = now;
    const delta = Math.max(0, (now - lastFrame) / 1000);
    lastFrame = now;
    if (running && !document.hidden && finishPanel.hidden) {
      let remaining = delta;
      while (remaining > 0 && running && finishPanel.hidden) {
        const stepRemaining = Math.max(0, steps[index].duration - elapsed);
        if (remaining < stepRemaining) {
          elapsed += remaining;
          remaining = 0;
        } else {
          remaining -= stepRemaining;
          setStep(index + 1);
        }
      }
      if (finishPanel.hidden) updateClock();
    }
    frame = requestAnimationFrame(tick);
  };
  const start = ({ source = "direct" } = {}) => {
    if (active) return;
    returnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    returnScroll = { x: window.scrollX, y: window.scrollY };
    active = true;
    running = true;
    index = 0;
    elapsed = 0;
    lastFrame = 0;
    layer.hidden = false;
    layer.inert = false;
    layer.dataset.source = source;
    layer.classList.toggle("is-reduced-motion", reducedMotion);
    document.body.classList.add("gaia-tour-open");
    history.replaceState(null, "", `${location.pathname}${location.search}#tour`);
    syncToggle();
    renderStep();
    frame = requestAnimationFrame(tick);
    requestAnimationFrame(() => toggle.focus({ preventScroll: true }));
  };
  const exit = ({ keepView = false } = {}) => {
    if (!active) return;
    active = false;
    running = false;
    generation += 1;
    clearStepTasks();
    clearTargets();
    cancelAnimationFrame(frame);
    closeSpace();
    globalThis.GaiaMapObservationAdapter?.closeSource?.();
    layer.hidden = true;
    layer.inert = true;
    document.body.classList.remove("gaia-tour-open");
    if (location.hash === "#tour") history.replaceState(null, "", `${location.pathname}${location.search}`);
    if (!keepView) globalThis.GaiaMapObservationAdapter?.showIntro?.();
    requestAnimationFrame(() => window.scrollTo({ left: returnScroll.x, top: returnScroll.y, behavior: "auto" }));
    returnFocus?.focus?.({ preventScroll: true });
    dispatchEvent(new CustomEvent("gaia:tour-exit"));
  };

  find("[data-tour-action='exit']").addEventListener("click", () => exit());
  find("[data-tour-action='previous']").addEventListener("click", () => setStep(index - 1, { pause: true }));
  find("[data-tour-action='next']").addEventListener("click", () => setStep(index + 1, { pause: true }));
  toggle.addEventListener("click", () => { running = !running; lastFrame = performance.now(); syncToggle(); });
  layer.querySelectorAll("[data-tour-destination]").forEach((button) => button.addEventListener("click", async () => {
    const destination = button.dataset.tourDestination;
    if (destination === "explore") { exit({ keepView: true }); (await waitForMapAdapter()).openMap(); }
    else if (destination === "story") { exit({ keepView: true }); await globalThis.GaiaModeLoader?.load?.("story"); history.replaceState(null, "", `${location.pathname}${location.search}#story`); dispatchEvent(new CustomEvent("gaia:novel-open-at-mode", { detail: { index: 0, source: "tour" } })); }
    else if (destination === "source") { exit({ keepView: true }); document.querySelector("#source-button")?.click(); }
  }));
  document.addEventListener("visibilitychange", () => {
    if (!active) return;
    if (document.hidden) { runningBeforeHidden = running; running = false; }
    else if (runningBeforeHidden) { running = true; lastFrame = performance.now(); runningBeforeHidden = false; }
    syncToggle();
  });
  document.addEventListener("keydown", (event) => {
    if (!active) return;
    if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); exit(); return; }
    if (event.key !== "Tab") return;
    const targets = Array.from(document.querySelectorAll(".gaia-tour-highlight-target, .gaia-tour-highlight-target button, .gaia-tour-highlight-target input, .gaia-tour-highlight-target[tabindex]"));
    const controls = Array.from(layer.querySelectorAll('button:not([disabled]), a[href]'));
    const focusable = [...targets, ...controls].filter((element, position, list) => element instanceof HTMLElement && element.offsetParent !== null && list.indexOf(element) === position);
    const first = focusable[0];
    const last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }, true);

  globalThis.GaiaGuidedTour = Object.freeze({
    start,
    exit,
    getState: () => ({ active, running, index, stepId: steps[index]?.id || "finish", elapsed, totalDuration }),
  });
  dispatchEvent(new CustomEvent("gaia:guided-tour-ready"));
  if (location.hash === "#tour") {
    const opening = document.querySelector("#gaia-opening");
    if (opening instanceof HTMLElement && !opening.hidden) {
      window.addEventListener("gaia:opening-complete", (event) => {
        if (event.detail?.destination === "tour") requestAnimationFrame(() => start());
      }, { once: true });
    } else {
      requestAnimationFrame(() => start());
    }
  }
})();
