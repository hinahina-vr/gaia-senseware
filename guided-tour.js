(() => {
  "use strict";
  if (globalThis.GaiaGuidedTour || typeof document === "undefined") return;

  const steps = Object.freeze([
    { id: "concept", duration: 10, kicker: "01 / CONCEPT", title: "地球の変化を、感覚へ。", copy: "公開データを色・動き・音・物語へ変換し、数字の向こうにある惑星の時間を体験します。", detail: "SOURCE / DERIVED / SCENARIOを分け、観測・計算・仮想状態の境界を画面内で示します。" },
    { id: "map", duration: 15, kicker: "02 / EARTH MAP", title: "一枚の地図で、九つの声を読む。", copy: "CO₂、海流、森林、降水、生物観察、資源循環、排出、地震、再生可能電力を同じ地球へ重ねます。", detail: "展示01「地球の一呼吸」では、実測・補完・2050年までの試算を年代ごとに確認できます。" },
    { id: "space", duration: 13, kicker: "03 / ORBITAL WINDOW", title: "観測窓を、宇宙まで広げる。", copy: "NASAとJAXAの公開記録から、太陽フレア、磁気嵐、小惑星、系外惑星、リュウグウの輪郭を再構成します。", detail: "表示を読み込めない場合も説明カードへ切り替え、ツアーは止めません。" },
    { id: "sensor", duration: 12, kicker: "04 / ESP32 SENSOR", title: "あなたの場所も、地球の感覚器になる。", copy: "ESP32の温度・湿度・PM2.5などをHTTPSで送り、最近の変化を自分の観測点として確かめられます。", detail: "GPSや住所は不要。公開位置は約10km単位に丸め、基本体験はセンサーなしでも成立します。" },
    { id: "notebook", duration: 10, kicker: "05 / FIELD NOTES", title: "観測を残し、比べ、手渡す。", copy: "地図とESP32の値を観測ノートへ保存し、同じ条件の二つをA／B／差分で比べられます。", detail: "共有はURLの中だけで完結し、端末ID・所有者情報・正確な位置は含めません。" },
  ]);
  const totalDuration = steps.reduce((sum, step) => sum + step.duration, 0);
  const layer = document.createElement("section");
  layer.className = "gaia-tour";
  layer.id = "gaia-guided-tour";
  layer.hidden = true;
  layer.inert = true;
  layer.setAttribute("role", "dialog");
  layer.setAttribute("aria-modal", "true");
  layer.setAttribute("aria-labelledby", "gaia-tour-title");
  layer.innerHTML = `
    <div class="gaia-tour-vignette" aria-hidden="true"></div>
    <article class="gaia-tour-card">
      <div class="gaia-tour-card-index"><span data-tour-step>01</span><i></i><span>05</span></div>
      <p class="gaia-tour-kicker" data-tour-kicker></p><h2 id="gaia-tour-title" data-tour-title></h2>
      <p class="gaia-tour-copy" data-tour-copy></p><p class="gaia-tour-detail" data-tour-detail></p>
      <p class="gaia-tour-fallback" data-tour-fallback hidden>表示を読み込めなかったため、説明カードで続けています。</p>
    </article>
    <section class="gaia-tour-finish" data-tour-finish hidden aria-labelledby="gaia-tour-finish-title">
      <p>60 SECOND TOUR / COMPLETE</p><h2 id="gaia-tour-finish-title">ここから、あなたの観測へ。</h2>
      <div><button type="button" data-tour-destination="explore">9展示を探索</button><button type="button" data-tour-destination="story">物語を始める</button><a href="./sensors/">センサーを見る</a><button type="button" data-tour-destination="source">出典を見る</button></div>
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
  let runningBeforeHidden = false;

  const waitForAdapter = () => globalThis.GaiaMapObservationAdapter
    ? Promise.resolve(globalThis.GaiaMapObservationAdapter)
    : new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error("map adapter timeout")), 12000);
        addEventListener("gaia:map-adapter-ready", () => { clearTimeout(timer); resolve(globalThis.GaiaMapObservationAdapter); }, { once: true });
      });
  const closeSpace = () => {
    const spaceLayer = document.querySelector("#space-layer");
    if (spaceLayer instanceof HTMLElement && !spaceLayer.hidden) {
      dispatchEvent(new CustomEvent("gaia:space-close", { detail: { returnToTop: false, source: "tour" } }));
    }
  };
  const applyStep = async (step, currentGeneration) => {
    fallback.hidden = true;
    layer.dataset.step = step.id;
    try {
      const adapter = await waitForAdapter();
      if (!active || currentGeneration !== generation) return;
      if (step.id === "concept") { closeSpace(); adapter.showIntro(); }
      else if (step.id === "map") {
        closeSpace(); adapter.selectMode(0); adapter.openMap(); adapter.setSignalTime(78);
        await Promise.race([adapter.waitSignalsReady(), new Promise((_, reject) => setTimeout(() => reject(new Error("signals timeout")), 9000))]);
      } else if (step.id === "space") {
        adapter.closeMap(); await globalThis.GaiaModeLoader?.load?.("space");
        const spaceSnapshot = await fetch("./data/space-signals.json?v=gaia-97", { cache: "force-cache" });
        if (!spaceSnapshot.ok) throw new Error(`space snapshot ${spaceSnapshot.status}`);
        if (!active || currentGeneration !== generation) return;
        dispatchEvent(new CustomEvent("gaia:space-open-at-mode", { detail: { index: 0, source: "tour" } }));
      } else { closeSpace(); adapter.showIntro(); }
    } catch { if (active && currentGeneration === generation) fallback.hidden = false; }
    finally {
      setTimeout(() => {
        if (active && currentGeneration === generation && !layer.contains(document.activeElement)) toggle.focus({ preventScroll: true });
      }, 120);
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
    find("[data-tour-detail]").textContent = step.detail;
    updateClock();
    void applyStep(step, generation);
  };
  const showFinish = () => {
    running = false; elapsed = steps.at(-1).duration; syncToggle(); updateClock(); card.hidden = true; finishPanel.hidden = false;
    finishPanel.querySelector("button")?.focus({ preventScroll: true });
  };
  const setStep = (nextIndex, { pause = false } = {}) => {
    if (nextIndex >= steps.length) { showFinish(); return; }
    index = Math.max(0, nextIndex); elapsed = 0; if (pause) running = false; syncToggle(); renderStep();
  };
  const tick = (now) => {
    if (!active) return;
    if (!lastFrame) lastFrame = now;
    const delta = Math.min(0.25, Math.max(0, (now - lastFrame) / 1000));
    lastFrame = now;
    if (running && !document.hidden && finishPanel.hidden) {
      elapsed += delta;
      if (elapsed >= steps[index].duration) setStep(index + 1);
      else updateClock();
    }
    frame = requestAnimationFrame(tick);
  };
  const start = ({ source = "direct" } = {}) => {
    if (active) return;
    returnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    active = true; running = true; index = 0; elapsed = 0; lastFrame = 0;
    layer.hidden = false; layer.inert = false; layer.dataset.source = source; layer.classList.toggle("is-reduced-motion", reducedMotion);
    document.body.classList.add("gaia-tour-open");
    history.replaceState(null, "", `${location.pathname}${location.search}#tour`);
    syncToggle(); renderStep(); frame = requestAnimationFrame(tick);
    requestAnimationFrame(() => toggle.focus({ preventScroll: true }));
  };
  const exit = ({ keepView = false } = {}) => {
    if (!active) return;
    active = false; running = false; generation += 1; cancelAnimationFrame(frame); closeSpace();
    layer.hidden = true; layer.inert = true; document.body.classList.remove("gaia-tour-open");
    if (location.hash === "#tour") history.replaceState(null, "", `${location.pathname}${location.search}`);
    if (!keepView) globalThis.GaiaMapObservationAdapter?.showIntro?.();
    returnFocus?.focus?.({ preventScroll: true }); dispatchEvent(new CustomEvent("gaia:tour-exit"));
  };

  find("[data-tour-action='exit']").addEventListener("click", () => exit());
  find("[data-tour-action='previous']").addEventListener("click", () => setStep(index - 1, { pause: true }));
  find("[data-tour-action='next']").addEventListener("click", () => setStep(index + 1, { pause: true }));
  toggle.addEventListener("click", () => { running = !running; lastFrame = performance.now(); syncToggle(); });
  layer.querySelectorAll("[data-tour-destination]").forEach((button) => button.addEventListener("click", async () => {
    const destination = button.dataset.tourDestination;
    if (destination === "explore") { exit({ keepView: true }); (await waitForAdapter()).openMap(); }
    else if (destination === "story") { exit({ keepView: true }); await globalThis.GaiaModeLoader?.load?.("story"); history.replaceState(null, "", `${location.pathname}${location.search}#story`); dispatchEvent(new CustomEvent("gaia:novel-open-at-mode", { detail: { index: 0, source: "tour" } })); }
    else if (destination === "source") { exit({ keepView: true }); document.querySelector("#source-button")?.click(); }
  }));
  document.addEventListener("visibilitychange", () => {
    if (!active) return;
    if (document.hidden) { runningBeforeHidden = running; running = false; }
    else if (runningBeforeHidden) { running = true; lastFrame = performance.now(); runningBeforeHidden = false; }
    syncToggle();
  });
  layer.addEventListener("keydown", (event) => {
    if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); exit(); return; }
    if (event.key !== "Tab") return;
    const focusable = Array.from(layer.querySelectorAll('button:not([disabled]), a[href]')).filter((element) => element.offsetParent !== null);
    const first = focusable[0]; const last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }, true);

  globalThis.GaiaGuidedTour = Object.freeze({ start, exit, getState: () => ({ active, running, index, elapsed, totalDuration }) });
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
