(() => {
  "use strict";

  const PREVIEW_LINE_LIMIT = 10;

  const getRequiredElement = (id) => {
    const element = document.getElementById(id);
    if (!element) throw new Error(`Open data ledger element not found: #${id}`);
    return element;
  };

  const displayDate = (value) => {
    if (!value) return "—";
    const date = new Date(value);
    return Number.isNaN(date.getTime())
      ? String(value)
      : new Intl.DateTimeFormat("ja-JP", { dateStyle: "medium", timeStyle: "short" }).format(date);
  };

  const previewText = (rows) => {
    const values = Array.isArray(rows) ? rows : [];
    if (!values.length) return "01 │ このスナップショットにプレビュー行はありません。";
    return values
      .slice(0, PREVIEW_LINE_LIMIT)
      .map((row, index) => `${String(index + 1).padStart(2, "0")} │ ${JSON.stringify(row)}`)
      .join("\n");
  };

  const element = (tagName, className, text) => {
    const node = document.createElement(tagName);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };

  const createSpec = (term, description) => {
    const wrapper = element("div");
    wrapper.append(element("dt", "", term), element("dd", "", description || "—"));
    return wrapper;
  };

  const renderDataset = (dataset, index) => {
    const section = element("section", "japan-data-section data-ledger-card");
    section.dataset.kind = dataset.kind || "SOURCE";
    const heading = element(
      "p",
      "japan-data-index",
      `${String(index + 1).padStart(2, "0")} / ${dataset.kind || "SOURCE"}`,
    );
    const title = element("h3", "", dataset.title);
    const organisation = element("p", "data-ledger-organisation", dataset.organisation);
    const explanation = element("p");
    explanation.append(
      element("strong", "", "画面への変換："),
      document.createTextNode(dataset.transformation || "加工なし"),
    );

    const specs = element("dl", "data-specs");
    specs.append(
      createSpec("提供機関", dataset.organisation),
      createSpec("取得日時", displayDate(dataset.retrievedAt)),
      createSpec("期間", dataset.period),
      createSpec("単位", dataset.unit),
      createSpec("空間・時間解像度", dataset.resolution),
      createSpec("注意事項", dataset.caveat),
    );

    const links = element("div", "data-source-links");
    const sourceLink = element("a", "", "データ元・公式説明 ↗");
    sourceLink.href = dataset.url;
    sourceLink.target = "_blank";
    sourceLink.rel = "noopener noreferrer";
    links.append(sourceLink);

    const details = element("details", "data-preview");
    const summary = element("summary");
    summary.append(
      element("span", "", "RAW PREVIEW"),
      document.createTextNode(" 作品に同梱した先頭10行 "),
      element("em", "", "10 LINES ONLY"),
    );
    const meta = element(
      "p",
      "",
      `${dataset.id} / ${Math.min(PREVIEW_LINE_LIMIT, dataset.preview?.length || 0)}行を表示 / JSONスナップショット`,
    );
    const pre = element("pre");
    pre.append(element("code", "", previewText(dataset.preview)));
    details.append(summary, meta, pre);
    section.append(heading, title, organisation, explanation, specs, links, details);
    return section;
  };

  const renderStatisticalMethod = (method, index) => {
    const article = element("article", "statistics-method-card");
    const heading = element(
      "p",
      "statistics-method-id",
      `${String(index + 1).padStart(2, "0")} / HOW IT WAS DRAWN`,
    );
    const title = element("h4", "", method.plainTitle || method.target);
    const explanation = element(
      "p",
      "statistics-plain",
      method.plainExplanation || method.rule,
    );
    const limit = element("p", "statistics-plain-limit", method.plainLimit || method.validation);
    const technical = element("details", "statistics-technical");
    const technicalSummary = element("summary", "", "くわしい計算を見る");
    const technicalTarget = element(
      "p",
      "statistics-technical-target",
      `${method.id} / 対象：${method.target}`,
    );
    const formula = element("code", "statistics-formula", method.formula);
    const details = element("dl", "data-specs statistics-specs");
    details.append(
      createSpec("どう計算したか", method.rule),
      createSpec("どう確かめたか", method.validation),
      createSpec("画面での見分け方", method.display),
    );
    technical.append(technicalSummary, technicalTarget, formula, details);
    article.append(heading, title, explanation, limit, technical);
    return article;
  };

  const create = () => {
    const elements = {
      title: getRequiredElement("data-ledger-mode-title"),
      question: getRequiredElement("data-ledger-mode-question"),
      act: getRequiredElement("data-ledger-act"),
      state: getRequiredElement("data-ledger-state"),
      updated: getRequiredElement("data-ledger-updated"),
      statistics: getRequiredElement("data-ledger-statistics"),
      statisticsMethods: getRequiredElement("data-ledger-statistics-methods"),
      sources: getRequiredElement("data-ledger-sources"),
      historyState: getRequiredElement("japan-history-state"),
      historyUpdated: getRequiredElement("japan-history-updated"),
      liveState: getRequiredElement("japan-data-state"),
      liveUpdated: getRequiredElement("japan-data-updated"),
    };

    const livePreviews = { jma: null, usgs: null };

    const updateMode = (mode, modeNumber, generatedAt) => {
      if (!mode) {
        elements.state.textContent = "同梱スナップショット：読み込み失敗";
        return;
      }
      elements.title.textContent = `${String(modeNumber).padStart(2, "0")} ${mode.titleJa || mode.id} — この光の出どころ`;
      elements.question.textContent = mode.question;
      elements.act.textContent = `ACT ${mode.act.number} / ${mode.act.title} — ${mode.act.en}`;
      elements.state.textContent = `${mode.datasets.length}種類のデータ / 作品内に保存済み`;
      elements.updated.textContent = `取得日時：${displayDate(generatedAt)}`;
      const statisticalMethods = mode.statisticalMethods || [];
      elements.statistics.hidden = false;
      elements.statisticsMethods.replaceChildren(
        ...(statisticalMethods.length
          ? statisticalMethods.map(renderStatisticalMethod)
          : [
              element(
                "p",
                "statistics-empty",
                "この展示では、空白を計算で埋めたり、未来の値を予測したりしていません。記録がない場所は、そのまま残しています。",
              ),
            ]),
      );
      const earthquakeMode = mode.id === "rhythm-of-disaster";
      elements.historyState.hidden = !earthquakeMode;
      elements.historyUpdated.hidden = !earthquakeMode;
      elements.liveState.hidden = !earthquakeMode;
      elements.liveUpdated.hidden = !earthquakeMode;
      elements.sources.replaceChildren(...mode.datasets.map(renderDataset));
    };

    const updateOsm = () => {};

    const updateJma = ({ state, eventCount = 0, observationCount = 0, retrievedAt }) => {
      elements.historyState.textContent =
        state === "ready"
          ? `JMA HISTORY：${eventCount}地震 / ${observationCount}観測地点`
          : state === "loading"
            ? "JMA HISTORY：読み込み中"
            : "JMA HISTORY：取得できませんでした";
      elements.historyUpdated.textContent = `保存データ作成日：${displayDate(retrievedAt)}`;
    };

    const updateUsgs = ({ state, totalCount = 0, visibleCount = 0, retrievedAt }) => {
      const sourceLabel = state === "snapshot" ? "LOCAL SNAPSHOT" : state.toUpperCase();
      elements.liveState.textContent = `USGS ${sourceLabel}：${totalCount}件保存 / ${visibleCount}件表示`;
      elements.liveUpdated.textContent = `保存データ作成日：${displayDate(retrievedAt)}`;
    };

    const setJsonPreview = (dataset, data, sourceLabel) => {
      livePreviews[dataset] = { sourceLabel, data };
    };

    const setPreviewError = (dataset, message) => {
      livePreviews[dataset] = { error: message };
    };

    return Object.freeze({
      updateMode,
      updateOsm,
      updateJma,
      updateUsgs,
      setJsonPreview,
      setPreviewError,
    });
  };

  window.GaiaDataLedger = Object.freeze({ create });
})();
