(() => {
  "use strict";

  const layer = document.querySelector("#character-book-layer");
  if (!(layer instanceof HTMLElement)) return;

  const archiveVersion = "gaia-character-archive-2";
  const sheet = (filename) => `/artifacts/gx-setting-bible/${filename}?v=${archiveVersion}`;
  const fallbackImage = `/assets/visuals-07/opening-keyvisual-v2-834.webp?v=${archiveVersion}`;

  const pages = Object.freeze([
    {
      code: "GX / 01 · CHARACTER MASTER",
      title: "三人の基準設定画",
      description: "みずは生態と身体、あめは社会と技術、sakuは精神と文化。三つの視点と、それぞれが記録に使う道具を一枚にまとめた設定画です。",
      src: sheet("01-three-ecologies-character-master.png"),
      tone: "128, 207, 222",
      alt: "みず、あめ、sakuの三人と、それぞれの持ち物を描いた基準設定画",
    },
    {
      code: "GX / 02 · FIRST MEETING",
      title: "海辺での初対面",
      description: "オンライン大学で言葉だけを交わしてきた三人が、逗子の海辺で初めて同じ景色を見るプロローグ。画面越しの関係が共同制作へ変わる瞬間です。",
      src: sheet("02-first-meeting-zushi-coast.png"),
      tone: "235, 181, 143",
      alt: "逗子の海を見渡す高台で、ノートパソコンを囲んで初めて会う三人",
    },
    {
      code: "GX / 03 · SENSEWARE INSTALLATION",
      title: "GAIA SENSEWAREの展示空間",
      description: "公開データを光、音、地図、物語へ置き換える制作室。三人が異なる素材を持ち寄り、地球の変化を十の感覚器官として編み上げていきます。",
      src: sheet("03-gaia-senseware-installation.png"),
      tone: "111, 222, 198",
      alt: "データの図像を投影した展示制作室で作業する三人",
    },
    {
      code: "GX / 04 · LIFE + EARTH",
      title: "生命と地球の共進化",
      description: "生命が地球を変え、変わった地球が次の生命を変えてきた時間を、海から都市まで続く大きな螺旋として描いた設定です。",
      src: sheet("04-life-earth-coevolution.png"),
      tone: "132, 199, 178",
      alt: "原始の海から現代都市まで、生命と地球の共進化を螺旋状に描いた図",
    },
    {
      code: "GX / 05 · ANTHROPOCENE",
      title: "人新世のスケール",
      description: "都市、産業、物流、農地が一つの地球システムへ及ぼす力を俯瞰するページ。人間を地球の外側ではなく、変化を生む内部の存在として捉えます。",
      src: sheet("05-anthropocene-planetary-force.png"),
      tone: "225, 151, 125",
      alt: "産業都市と自然環境が広がる地球規模の風景を見渡す三人",
    },
    {
      code: "GX / 06 · AI + EARTH",
      title: "AIと地球の共進化",
      description: "AIを支配者や救世主にせず、海、山、交通、生活をつなぐ分散した地球の器官として描く案。三人は地域の知識と計測を重ねて設計します。",
      src: sheet("06-ai-earth-coevolution.png"),
      tone: "122, 202, 231",
      alt: "海辺の地域と自然環境を観測網でつなぎ、三人が設計する未来像",
    },
    {
      code: "GX / 07 · THREE ECOLOGIES",
      title: "三つのエコロジー",
      description: "生態、社会、精神を別々の問題にしない生活世界。海と森、通信と交通、記憶と文化が同じ場所で静かに重なっています。",
      src: sheet("07-three-ecologies-world.png"),
      tone: "153, 214, 170",
      alt: "海と森、町と通信、記憶と文化が重なる場所に立つ三人",
    },
    {
      code: "GX / 08 · OLD OS → GX",
      title: "古いOSからGXへ",
      description: "自然、社会、技術を切り離す一方向の仕組みから、観測、対話、手入れが循環するGXへ。三人が二つの世界の間に新しい接続をつくります。",
      src: sheet("08-old-os-to-gx.png"),
      tone: "224, 192, 124",
      alt: "分断と消費の古い仕組みから、循環と共創のGXへ移る構造図",
    },
    {
      code: "GX / 09 · NEXT STAGE",
      title: "次段階の文明",
      description: "人間、他の生命、人工システムが共進化する現実寄りの未来。海辺の暮らしと交通、食、エネルギー、観測が小さな循環として結ばれています。",
      src: sheet("09-next-stage-civilization.png"),
      tone: "120, 215, 208",
      alt: "海辺の町で自然、暮らし、技術が循環する次段階の文明と三人",
    },
    {
      code: "GX / 10 · FINAL KEY VISUAL",
      title: "第四の共創者へ",
      description: "三人のあいだを流れてきた信号に、観客の手が新しい一点を加える最終キービジュアル。見る人もまた、地球との関係を編み直す共創者になります。",
      src: sheet("10-final-keyvisual.png"),
      tone: "183, 180, 236",
      alt: "海辺に立つ三人へ向けて、観客の手が光の信号を加える最終キービジュアル",
    },
  ]);

  const image = layer.querySelector("#character-book-image");
  const pageButton = layer.querySelector("#character-book-page");
  const previousButton = layer.querySelector("#character-book-previous");
  const nextButton = layer.querySelector("#character-book-next");
  const closeButton = layer.querySelector("#character-book-close");
  const code = layer.querySelector("#character-book-code");
  const title = layer.querySelector("#character-book-page-title");
  const description = layer.querySelector("#character-book-description");
  const currentOutput = layer.querySelector("#character-book-current");
  const progressFill = layer.querySelector("#character-book-progress-fill");
  const imageState = layer.querySelector("#character-book-image-state");
  const stagePageSignal = layer.querySelector("#character-book-stage-page");
  const indexButtons = Array.from(layer.querySelectorAll("[data-character-page]"));
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  let currentPage = 0;
  let isOpen = false;
  let lastFocused = null;
  let pointerStart = null;
  let animationTimer = 0;
  let imageLoadToken = 0;
  let failedPage = -1;
  let backgroundStates = [];

  const clampPage = (value) => Math.max(0, Math.min(pages.length - 1, value));
  const twoDigits = (value) => String(value).padStart(2, "0");

  const preloadPage = (index) => {
    const page = pages[index];
    if (!page) return;
    const preload = new Image();
    preload.decoding = "async";
    preload.src = page.src;
  };

  const setImageState = (state, message) => {
    layer.dataset.imageState = state;
    pageButton?.classList.toggle("is-loading", state === "loading");
    if (imageState instanceof HTMLElement) {
      imageState.hidden = state === "ready";
      const label = imageState.querySelector("b");
      if (label) label.textContent = message;
    }
  };

  const loadPageImage = (page, pageIndex) => {
    if (!(image instanceof HTMLImageElement)) return;
    const token = ++imageLoadToken;
    setImageState("loading", "VISUAL MEMORY / LOADING");
    const probe = new Image();
    probe.decoding = "async";
    probe.fetchPriority = pageIndex === currentPage ? "high" : "auto";
    probe.onload = () => {
      if (token !== imageLoadToken) return;
      let committed = false;
      const commit = () => {
        if (committed || token !== imageLoadToken) return;
        committed = true;
        failedPage = -1;
        image.alt = page.alt;
        layer.style.setProperty("--character-book-current-image", `url("${page.src}")`);
        setImageState("ready", "VISUAL MEMORY / ONLINE");
      };
      image.addEventListener("load", commit, { once: true });
      image.src = page.src;
      if (image.complete && image.naturalWidth > 0) commit();
    };
    probe.onerror = () => {
      if (token !== imageLoadToken) return;
      failedPage = pageIndex;
      image.alt = `${page.alt}（設定画を再読み込みできます）`;
      if (!(image.complete && image.naturalWidth > 0)) image.src = fallbackImage;
      setImageState("error", "画像を読み込めませんでした · クリックで再試行");
    };
    probe.src = page.src;
  };

  const suspendBackground = () => {
    backgroundStates = [];
    const parent = layer.parentElement;
    if (!parent) return;
    Array.from(parent.children).forEach((element) => {
      if (!(element instanceof HTMLElement) || element === layer) return;
      backgroundStates.push({ element, inert: element.inert });
      element.inert = true;
    });
  };

  const restoreBackground = () => {
    backgroundStates.forEach(({ element, inert }) => {
      if (element.isConnected) element.inert = inert;
    });
    backgroundStates = [];
  };

  const showPage = (requestedPage, direction = 0) => {
    const nextPage = clampPage(requestedPage);
    const actualDirection = direction || Math.sign(nextPage - currentPage);
    const page = pages[nextPage];
    currentPage = nextPage;

    if (code) code.textContent = page.code;
    if (title) title.textContent = page.title;
    if (description) description.textContent = page.description;
    if (currentOutput) currentOutput.textContent = twoDigits(nextPage + 1);
    if (progressFill instanceof HTMLElement) progressFill.style.width = `${((nextPage + 1) / pages.length) * 100}%`;
    if (stagePageSignal) stagePageSignal.textContent = `MEMORY ${twoDigits(nextPage + 1)} / ${twoDigits(pages.length)}`;
    layer.dataset.characterPageIndex = String(nextPage + 1);
    layer.style.setProperty("--character-book-accent-rgb", page.tone);

    previousButton?.toggleAttribute("disabled", nextPage === 0);
    nextButton?.toggleAttribute("disabled", nextPage === pages.length - 1);
    if (pageButton instanceof HTMLButtonElement) {
      const isLastPage = nextPage === pages.length - 1;
      pageButton.setAttribute("aria-label", isLastPage ? "設定資料の最終ページ" : `${nextPage + 2}ページへ進む`);
      pageButton.title = isLastPage ? "最終ページ" : "クリックで次のページへ";
    }

    indexButtons.forEach((button, index) => {
      button.setAttribute("aria-current", index === nextPage ? "page" : "false");
    });

    loadPageImage(page, nextPage);

    if (pageButton instanceof HTMLElement && actualDirection !== 0 && !reducedMotion.matches) {
      window.clearTimeout(animationTimer);
      pageButton.classList.remove("is-turning");
      pageButton.dataset.turnDirection = actualDirection > 0 ? "next" : "previous";
      void pageButton.offsetWidth;
      pageButton.classList.add("is-turning");
      animationTimer = window.setTimeout(() => pageButton.classList.remove("is-turning"), 460);
    }

    preloadPage(nextPage - 1);
    preloadPage(nextPage + 1);
  };

  const open = (trigger = null) => {
    if (isOpen) return;
    isOpen = true;
    lastFocused = trigger instanceof HTMLElement ? trigger : document.activeElement;
    suspendBackground();
    layer.hidden = false;
    layer.inert = false;
    layer.setAttribute("aria-hidden", "false");
    document.body.classList.add("character-mode-open");
    showPage(currentPage);
    requestAnimationFrame(() => {
      pageButton?.classList.add("is-entering");
      layer.classList.add("is-open");
      closeButton?.focus({ preventScroll: true });
      window.setTimeout(() => pageButton?.classList.remove("is-entering"), 720);
      window.setTimeout(() => {
        if (isOpen && !layer.contains(document.activeElement)) closeButton?.focus({ preventScroll: true });
      }, 80);
    });
  };

  const close = () => {
    if (!isOpen) return;
    isOpen = false;
    layer.classList.remove("is-open");
    layer.setAttribute("aria-hidden", "true");
    document.body.classList.remove("character-mode-open");
    pageButton?.classList.remove("is-entering");
    restoreBackground();
    window.clearTimeout(animationTimer);
    window.setTimeout(() => {
      if (!isOpen) {
        layer.hidden = true;
        layer.inert = true;
      }
    }, 320);
    if (window.location.hash === "#character") {
      window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
    }
    if (lastFocused instanceof HTMLElement && lastFocused.isConnected) lastFocused.focus({ preventScroll: true });
  };

  const advance = (amount) => showPage(currentPage + amount, amount);

  document.addEventListener("click", (event) => {
    const trigger = event.target instanceof Element ? event.target.closest("[data-character-gallery-open]") : null;
    if (trigger) open(trigger);
  });

  closeButton?.addEventListener("click", close);
  previousButton?.addEventListener("click", () => advance(-1));
  nextButton?.addEventListener("click", () => advance(1));
  pageButton?.addEventListener("click", () => {
    if (failedPage === currentPage) {
      showPage(currentPage);
      return;
    }
    if (currentPage < pages.length - 1) advance(1);
  });

  pageButton?.addEventListener("pointermove", (event) => {
    if (reducedMotion.matches || !window.matchMedia("(hover: hover)").matches) return;
    const rect = pageButton.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
    pageButton.style.setProperty("--character-book-tilt-y", `${((x - 0.5) * 2.2).toFixed(2)}deg`);
    pageButton.style.setProperty("--character-book-tilt-x", `${((0.5 - y) * 1.4).toFixed(2)}deg`);
    pageButton.style.setProperty("--character-book-light-x", `${(x * 100).toFixed(1)}%`);
    pageButton.style.setProperty("--character-book-light-y", `${(y * 100).toFixed(1)}%`);
  });

  pageButton?.addEventListener("pointerleave", () => {
    pageButton.style.removeProperty("--character-book-tilt-x");
    pageButton.style.removeProperty("--character-book-tilt-y");
  });

  indexButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const nextPage = Number(button.dataset.characterPage);
      if (!Number.isInteger(nextPage)) return;
      showPage(nextPage);
    });
  });

  pageButton?.addEventListener("pointerdown", (event) => {
    pointerStart = { x: event.clientX, y: event.clientY, id: event.pointerId };
  });

  pageButton?.addEventListener("pointerup", (event) => {
    if (!pointerStart || pointerStart.id !== event.pointerId) return;
    const deltaX = event.clientX - pointerStart.x;
    const deltaY = event.clientY - pointerStart.y;
    pointerStart = null;
    if (Math.abs(deltaX) < 44 || Math.abs(deltaX) <= Math.abs(deltaY)) return;
    event.preventDefault();
    advance(deltaX < 0 ? 1 : -1);
  });

  pageButton?.addEventListener("pointercancel", () => { pointerStart = null; });

  document.addEventListener("keydown", (event) => {
    if (!isOpen) return;
    if (event.key === "Escape") {
      event.preventDefault();
      close();
      return;
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      advance(-1);
      return;
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      advance(1);
      return;
    }
    if (event.key === "Home") {
      event.preventDefault();
      showPage(0, -1);
      return;
    }
    if (event.key === "End") {
      event.preventDefault();
      showPage(pages.length - 1, 1);
      return;
    }
    if (event.key !== "Tab") return;
    const focusable = Array.from(layer.querySelectorAll("button:not([disabled])"))
      .filter((element) => element instanceof HTMLElement && element.getClientRects().length > 0);
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  showPage(0);
  layer.inert = true;
  if (window.location.hash === "#character") {
    if (document.readyState === "loading") {
      window.addEventListener("load", () => requestAnimationFrame(() => open()), { once: true });
    } else {
      requestAnimationFrame(() => open());
    }
  }
})();
