(() => {
  "use strict";
  if (globalThis.GaiaGuidedTour || typeof document === "undefined") return;

  const steps = Object.freeze([
    {
      id: "map", duration: 9, kicker: "地図の基本", title: "ドラッグして、光を押す。", gesture: "↔",
      copy: "光る点＝観測地点です。",
      instruction: "地図を動かし、光を押す",
      hint: "ドラッグ＝移動　／　ホイール・ピンチ＝拡大",
      result: "地点名と観測値が開きます。",
      actions: [["移動", "ドラッグ"], ["拡大", "ホイール／ピンチ"], ["開く", "光を押す"]],
      cues: ["ドラッグで地図を移動", "ホイール／ピンチで拡大", "光る地点を押す"],
    },
    {
      id: "time", duration: 7, kicker: "時間を比べる", title: "つまみを動かして、比べる。", gesture: "⇆",
      copy: "年を変えると、同じ地点を比べられます。",
      instruction: "青いつまみを左右へ動かす",
      hint: "左＝過去　／　右＝現在・未来",
      result: "年・色・観測値が一緒に変わります。",
      actions: [["つかむ", "青いつまみ"], ["動かす", "左＝過去・右＝未来"], ["読む", "年と地図"]],
      cues: ["青いつまみをつかむ", "左へ過去・右へ未来", "年と地図の変化を見る"],
    },
    {
      id: "transform", duration: 7, kicker: "しくみを見る", title: "3つのタブを、順に押す。", gesture: "1→2→3",
      copy: "観測値が光になる3段階です。",
      instruction: "「元の数字 → 計算 → 光」を順に押す",
      hint: "ガイド中も自動で切り替えます",
      result: "元データと作品表現を分けて確認できます。",
      actions: [["1", "元の数字"], ["2", "計算"], ["3", "光"]],
      cues: ["1　元の数字を見る", "2　計算を見る", "3　光への変換を見る"],
    },
    {
      id: "space", duration: 7, kicker: "宇宙を見る", title: "記録を選び、再生する。", gesture: "▶",
      copy: "フレアの強さ＝開く光の大きさです。",
      instruction: "「この記録を再生」を押す",
      hint: "ガイド中は一度、自動再生します",
      result: "強い記録ほど光が大きく開きます。",
      actions: [["選ぶ", "フレア記録"], ["再生", "ボタンを押す"], ["比べる", "光の大きさ"]],
      cues: ["再生する記録を選ぶ", "「この記録を再生」を押す", "開いた光の大きさを見る"],
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
    <div class="gaia-tour-target-spotlight" data-tour-target-spotlight hidden aria-hidden="true"></div>
    <article class="gaia-tour-card" aria-live="polite">
      <div class="gaia-tour-card-index"><span><small>STEP</small><b data-tour-step>1</b></span><i></i><span data-tour-step-total>${steps.length}</span></div>
      <p class="gaia-tour-kicker" data-tour-kicker></p>
      <h2 id="gaia-tour-title" data-tour-title></h2>
      <p class="gaia-tour-copy" data-tour-copy></p>
      <section class="gaia-tour-instruction" aria-label="この画面の操作方法">
        <span class="gaia-tour-gesture" data-tour-gesture aria-hidden="true">◎</span>
        <div><b>操作</b><strong data-tour-instruction></strong><small data-tour-hint></small></div>
      </section>
      <ol class="gaia-tour-operation-path" data-tour-operation-path aria-label="操作の順序"></ol>
      <p class="gaia-tour-result"><b data-tour-result-label>こう変わる</b><span data-tour-result></span></p>
      <details class="gaia-tour-receipt" data-tour-receipt hidden aria-label="データから表現への変換レシート">
        <summary>出典と変換を見る</summary>
        <p><span>○ SOURCE / 公開記録</span><strong data-tour-receipt-source></strong><small data-tour-receipt-provider></small></p>
        <p><span>△ DERIVED / 計算・補間</span><strong data-tour-receipt-transform></strong></p>
        <p><span>◇ SCENARIO / 仮定・操作</span><strong data-tour-receipt-visual></strong></p>
      </details>
      <p class="gaia-tour-fallback" data-tour-fallback hidden>表示を準備しています。ガイドはこのまま続けられます。</p>
      <div class="gaia-tour-step-rail" data-tour-step-rail aria-label="ガイドの進行"></div>
    </article>
    <div class="gaia-tour-target-cue" data-tour-target-cue hidden aria-hidden="true"><i data-tour-target-action>1</i><span></span></div>
    <section class="gaia-tour-finish" data-tour-finish hidden aria-labelledby="gaia-tour-finish-title">
      <p>30秒ガイド 完了</p><h2 id="gaia-tour-finish-title">基本操作はここまで。好きな展示へ。</h2>
      <p class="gaia-tour-finish-recommend"><span>おすすめ</span><strong>まずは、気になった光をひとつ押してみてください。</strong></p>
      <div><button class="is-primary" type="button" data-tour-destination="explore">展示を見に行く</button><button type="button" data-tour-destination="story">物語から見る</button><a href="./sensors/">センサーを見る</a><button type="button" data-tour-destination="source">データの出典</button></div>
    </section>
    <nav class="gaia-tour-controls" aria-label="30秒ガイドの操作">
      <button type="button" data-tour-action="exit">閉じる</button><button type="button" data-tour-action="previous">戻る</button>
      <button type="button" data-tour-action="toggle" aria-pressed="true"><span data-tour-toggle-label>止める</span></button>
      <button type="button" data-tour-action="next"><span data-tour-next-label>次へ</span></button><div class="gaia-tour-time"><small>あと</small><span data-tour-time>${totalDuration}</span><small>秒</small></div>
      <div class="gaia-tour-progress" aria-hidden="true"><i data-tour-progress></i></div>
    </nav>`;
  document.body.append(layer);

  const find = (selector) => layer.querySelector(selector);
  const card = find(".gaia-tour-card");
  const finishPanel = find("[data-tour-finish]");
  const fallback = find("[data-tour-fallback]");
  const receipt = find("[data-tour-receipt]");
  const toggle = find("[data-tour-action='toggle']");
  const previous = find("[data-tour-action='previous']");
  const next = find("[data-tour-action='next']");
  const targetCue = find("[data-tour-target-cue]");
  const targetAction = find("[data-tour-target-action]");
  const targetSpotlight = find("[data-tour-target-spotlight]");
  const operationPath = find("[data-tour-operation-path]");
  const stepRail = find("[data-tour-step-rail]");
  stepRail.replaceChildren(...steps.map((step, stepIndex) => {
    const marker = document.createElement("i");
    marker.title = `${stepIndex + 1}. ${step.title}`;
    return marker;
  }));
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
  let targetCueFrame = 0;
  let activeCueIndex = 0;
  let initialFocusPending = false;
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
    cancelAnimationFrame(targetCueFrame);
    targetCueFrame = 0;
    targetCue.hidden = true;
    targetSpotlight.hidden = true;
  };
  const positionTargetCue = () => {
    targetCueFrame = 0;
    if (!active || !finishPanel.hidden) { targetCue.hidden = true; targetSpotlight.hidden = true; return; }
    const target = document.querySelector(".gaia-tour-highlight-target");
    const step = steps[index];
    const cue = step?.cues?.[activeCueIndex];
    if (!(target instanceof Element) || !cue || target.getClientRects().length === 0) {
      targetCue.hidden = true;
      targetSpotlight.hidden = true;
      return;
    }
    const bounds = target.getBoundingClientRect();
    const viewportInset = 6;
    const spotlightLeft = Math.max(viewportInset, bounds.left - 6);
    const spotlightTop = Math.max(viewportInset, bounds.top - 6);
    const spotlightRight = Math.min(innerWidth - viewportInset, bounds.right + 6);
    const spotlightBottom = Math.min(innerHeight - viewportInset, bounds.bottom + 6);
    targetSpotlight.hidden = false;
    targetSpotlight.style.left = `${Math.round(spotlightLeft)}px`;
    targetSpotlight.style.top = `${Math.round(spotlightTop)}px`;
    targetSpotlight.style.width = `${Math.round(Math.max(0, spotlightRight - spotlightLeft))}px`;
    targetSpotlight.style.height = `${Math.round(Math.max(0, spotlightBottom - spotlightTop))}px`;
    targetSpotlight.style.borderRadius = getComputedStyle(target).borderRadius || "12px";
    targetAction.textContent = String(activeCueIndex + 1);
    targetCue.querySelector("span").textContent = cue;
    targetCue.hidden = false;
    const cueBounds = targetCue.getBoundingClientRect();
    const wideTarget = bounds.width > innerWidth * 0.55 || bounds.height > innerHeight * 0.45;
    const preferredLeft = wideTarget ? bounds.left + 16 : bounds.left;
    let left = Math.max(10, Math.min(innerWidth - cueBounds.width - 10, preferredLeft));
    const above = bounds.top - cueBounds.height - 13;
    const below = bounds.bottom + 13;
    let top = wideTarget
      ? Math.max(10, Math.min(innerHeight - cueBounds.height - 10, bounds.top + 16))
      : above >= 10 ? above : Math.min(innerHeight - cueBounds.height - 10, below);
    const cardBounds = card.getBoundingClientRect();
    const overlapsCard = () => left < cardBounds.right + 8
      && left + cueBounds.width > cardBounds.left - 8
      && top < cardBounds.bottom + 8
      && top + cueBounds.height > cardBounds.top - 8;
    if (overlapsCard()) {
      const candidates = [
        { left, top: cardBounds.bottom + 12 },
        { left, top: cardBounds.top - cueBounds.height - 12 },
        { left: cardBounds.left - cueBounds.width - 12, top },
      ];
      const safe = candidates.find((candidate) => candidate.left >= 10
        && candidate.top >= 10
        && candidate.left + cueBounds.width <= innerWidth - 10
        && candidate.top + cueBounds.height <= innerHeight - 76);
      if (safe) ({ left, top } = safe);
    }
    targetCue.style.left = `${Math.round(left)}px`;
    targetCue.style.top = `${Math.round(top)}px`;
    targetCue.classList.toggle("is-inside", wideTarget);
  };
  const scheduleTargetCue = () => {
    cancelAnimationFrame(targetCueFrame);
    targetCueFrame = requestAnimationFrame(() => {
      targetCueFrame = requestAnimationFrame(positionTargetCue);
    });
  };
  const setTargetCueStage = (nextCueIndex) => {
    const cues = steps[index]?.cues || [];
    activeCueIndex = Math.max(0, Math.min(cues.length - 1, nextCueIndex));
    layer.dataset.action = String(activeCueIndex + 1);
    scheduleTargetCue();
  };
  const playCueSequence = (step, currentGeneration) => {
    const cues = step.cues || [];
    setTargetCueStage(0);
    if (!running || cues.length < 2) return;
    const interval = (step.duration * 1000) / cues.length;
    cues.slice(1).forEach((_, cueIndex) => {
      scheduleStepTask(() => setTargetCueStage(cueIndex + 1), Math.round(interval * (cueIndex + 1)), currentGeneration);
    });
  };
  const settleInitialFocus = (currentGeneration) => {
    if (!initialFocusPending) return;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      if (!active || currentGeneration !== generation || !initialFocusPending) return;
      initialFocusPending = false;
      toggle.focus({ preventScroll: true });
    }));
  };
  const renderReceipt = (value) => {
    if (!value) { receipt.hidden = true; return; }
    find("[data-tour-receipt-source]").textContent = [value.source, value.at].filter(Boolean).join(" / ");
    find("[data-tour-receipt-provider]").textContent = value.provider || "保存済み公開データ";
    find("[data-tour-receipt-transform]").textContent = value.transform || "表示用の尺度へ変換";
    find("[data-tour-receipt-visual]").textContent = value.visual || "色・光・動きへ反映";
    receipt.open = false;
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
      if (step.id === "map") {
        closeSpace();
        mapAdapter.selectMode(0);
        mapAdapter.openMap();
        mapAdapter.setSignalTime(42);
        await Promise.race([mapAdapter.waitSignalsReady(), new Promise((_, reject) => setTimeout(() => reject(new Error("signals timeout")), 9000))]);
        if (!active || currentGeneration !== generation) return;
        mapAdapter.focusControl?.("map");
        renderReceipt(mapAdapter.getTourReceipt?.() || staticReceipts.map);
        playCueSequence(step, currentGeneration);
      } else if (step.id === "time") {
        closeSpace();
        mapAdapter.selectMode(0);
        mapAdapter.openMap();
        mapAdapter.setSignalTime(22);
        await Promise.race([mapAdapter.waitSignalsReady(), new Promise((_, reject) => setTimeout(() => reject(new Error("signals timeout")), 9000))]);
        if (!active || currentGeneration !== generation) return;
        mapAdapter.focusControl?.("timeline");
        renderReceipt(mapAdapter.getTourReceipt?.() || staticReceipts.time);
        playCueSequence(step, currentGeneration);
        if (running) {
          scheduleStepTask(() => mapAdapter.setSignalTime(58), 2300, currentGeneration);
          scheduleStepTask(() => mapAdapter.setSignalTime(88), 4600, currentGeneration);
        }
      } else if (step.id === "transform") {
        closeSpace();
        mapAdapter.selectMode(0);
        await Promise.race([mapAdapter.waitSignalsReady(), new Promise((_, reject) => setTimeout(() => reject(new Error("signals timeout")), 9000))]);
        if (!active || currentGeneration !== generation) return;
        mapAdapter.openSourceTab?.("raw");
        renderReceipt(mapAdapter.getTourReceipt?.() || staticReceipts.transform);
        playCueSequence(step, currentGeneration);
        if (running) {
          scheduleStepTask(() => { mapAdapter.openSourceTab?.("transform"); scheduleTargetCue(); }, 2300, currentGeneration);
          scheduleStepTask(() => { mapAdapter.openSourceTab?.("visual"); scheduleTargetCue(); }, 4600, currentGeneration);
        }
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
        playCueSequence(step, currentGeneration);
        if (running) {
          scheduleStepTask(() => {
            try { renderReceipt(spaceAdapter.launch?.() || staticReceipts.space); } catch { useStaticFallback(step); }
          }, 2500, currentGeneration);
        }
      } else if (step.id === "story") {
        closeSpace();
        mapAdapter.showIntro();
        mapAdapter.focusControl?.("story");
      } else if (step.id === "proof") {
        closeSpace();
        mapAdapter.showIntro();
        mapAdapter.focusControl?.("credits");
      }
      scheduleTargetCue();
      settleInitialFocus(currentGeneration);
    } catch {
      if (active && currentGeneration === generation) {
        useStaticFallback(step);
        scheduleTargetCue();
        settleInitialFocus(currentGeneration);
      }
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
    find("[data-tour-toggle-label]").textContent = running ? "止める" : "続ける";
    toggle.setAttribute("aria-label", running ? "自動案内を止める" : "自動案内を続ける");
  };
  const renderStep = () => {
    const step = steps[index];
    generation += 1;
    delete layer.dataset.finished;
    delete card.dataset.interacted;
    card.hidden = false;
    finishPanel.hidden = true;
    find("[data-tour-step]").textContent = String(index + 1);
    find("[data-tour-kicker]").textContent = step.kicker;
    find("[data-tour-title]").textContent = step.title;
    find("[data-tour-copy]").textContent = step.copy;
    find("[data-tour-instruction]").textContent = step.instruction;
    find("[data-tour-hint]").textContent = step.hint;
    find("[data-tour-result]").textContent = step.result;
    find("[data-tour-result-label]").textContent = "こう変わる";
    find("[data-tour-gesture]").textContent = step.gesture;
    operationPath.replaceChildren(...step.actions.map(([label, action]) => {
      const item = document.createElement("li");
      const name = document.createElement("b");
      const value = document.createElement("span");
      name.textContent = label;
      value.textContent = action;
      item.append(name, value);
      return item;
    }));
    activeCueIndex = 0;
    layer.dataset.action = "1";
    previous.disabled = index === 0;
    find("[data-tour-next-label]").textContent = index === steps.length - 1 ? "完了" : "次へ";
    Array.from(stepRail.children).forEach((marker, markerIndex) => {
      marker.dataset.state = markerIndex < index ? "complete" : markerIndex === index ? "current" : "pending";
    });
    card.classList.remove("is-entering");
    requestAnimationFrame(() => card.classList.add("is-entering"));
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
    layer.dataset.finished = "true";
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
    initialFocusPending = true;
    layer.hidden = false;
    layer.inert = false;
    layer.dataset.source = source;
    layer.classList.toggle("is-reduced-motion", reducedMotion);
    document.body.classList.add("gaia-tour-open");
    document.body.classList.remove("gaia-route-handoff");
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
  previous.addEventListener("click", () => setStep(index - 1));
  next.addEventListener("click", () => setStep(index + 1));
  toggle.addEventListener("click", () => {
    running = !running;
    lastFrame = performance.now();
    generation += 1;
    clearStepTasks();
    if (running) {
      setTargetCueStage(0);
      void applyStep(steps[index], generation);
    }
    syncToggle();
  });
  const confirmTargetInteraction = (event) => {
    if (!active || !(event.target instanceof Element) || !event.target.closest(".gaia-tour-highlight-target")) return;
    find("[data-tour-result-label]").textContent = "操作できました";
    card.dataset.interacted = "true";
  };
  document.addEventListener("click", confirmTargetInteraction, true);
  document.addEventListener("input", confirmTargetInteraction, true);
  layer.querySelectorAll("[data-tour-destination]").forEach((button) => button.addEventListener("click", async () => {
    const destination = button.dataset.tourDestination;
    if (destination === "explore") { exit({ keepView: true }); (await waitForMapAdapter()).openMap(); }
    else if (destination === "story") { exit({ keepView: true }); await globalThis.GaiaModeLoader?.load?.("story"); history.replaceState(null, "", `${location.pathname}${location.search}#story`); dispatchEvent(new CustomEvent("gaia:novel-open-at-mode", { detail: { index: 0, source: "tour" } })); }
    else if (destination === "source") { exit({ keepView: true }); document.querySelector("#source-button")?.click(); }
  }));
  document.addEventListener("visibilitychange", () => {
    if (!active) return;
    if (document.hidden) {
      runningBeforeHidden = running;
      running = false;
      generation += 1;
      clearStepTasks();
    } else if (runningBeforeHidden) {
      running = true;
      lastFrame = performance.now();
      runningBeforeHidden = false;
      generation += 1;
      void applyStep(steps[index], generation);
    }
    syncToggle();
  });
  window.addEventListener("resize", scheduleTargetCue, { passive: true });
  window.addEventListener("scroll", scheduleTargetCue, { passive: true, capture: true });
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
      start();
    }
  }
})();
