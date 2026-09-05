(() => {
  "use strict";

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

  const displayJptDateTime = (value) => {
    if (!value) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return `${String(value)} JPT`;
    return `${new Intl.DateTimeFormat("ja-JP", {
      timeZone: "Asia/Tokyo",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
    }).format(date)} JPT`;
  };

  const element = (tagName, className, text) => {
    const node = document.createElement(tagName);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };

  const renderDataset = (dataset, index) => {
    const section = element("section", "japan-data-section data-ledger-card");
    section.dataset.kind = dataset.kind || "SOURCE";
    const heading = element(
      "p",
      "japan-data-index",
      String(index + 1).padStart(2, "0"),
    );
    const title = element("h3", "", dataset.title);
    const organisation = element("p", "data-ledger-organisation", dataset.organisation);

    const links = element("div", "data-source-links");
    const sourceLink = element("a", "", "元データを開く ↗");
    sourceLink.href = dataset.url;
    sourceLink.target = "_blank";
    sourceLink.rel = "noopener noreferrer";
    links.append(sourceLink);
    if (dataset.termsUrl) {
      const termsLink = element("a", "", "利用条件 ↗");
      termsLink.href = dataset.termsUrl;
      termsLink.target = "_blank";
      termsLink.rel = "noopener noreferrer";
      links.append(termsLink);
    }

    section.append(heading, title, organisation, links);
    if (dataset.attributionNote) section.append(element("p", "data-ledger-organisation", dataset.attributionNote));
    return section;
  };

  const create = () => {
    const elements = {
      title: getRequiredElement("data-ledger-mode-title"),
      question: getRequiredElement("data-ledger-mode-question"),
      act: getRequiredElement("data-ledger-act"),
      state: getRequiredElement("data-ledger-state"),
      updated: getRequiredElement("data-ledger-updated"),
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
      elements.title.textContent = `${String(modeNumber).padStart(2, "0")} ${mode.titleJa || mode.id}`;
      elements.question.textContent = "";
      elements.act.textContent = `ACT ${mode.act.number} / ${mode.act.title} — ${mode.act.en}`;
      elements.state.textContent = `${mode.datasets.length}種類のデータを使用 / 作品内に保存済み`;
      elements.updated.textContent = `スナップショット作成日：${displayDate(generatedAt)}`;
      const earthquakeMode = mode.id === "rhythm-of-disaster";
      elements.historyState.hidden = !earthquakeMode;
      elements.historyUpdated.hidden = !earthquakeMode;
      elements.liveState.hidden = !earthquakeMode;
      elements.liveUpdated.hidden = !earthquakeMode;
      const datasets = mode.id === "breathing-earth"
        ? [...mode.datasets].sort((left, right) =>
          Number(right.id === "noaa-ovation-aurora") - Number(left.id === "noaa-ovation-aurora"),
        )
        : mode.datasets;
      elements.sources.replaceChildren(...datasets.map(renderDataset));
    };

    const updateLiveExhibit = (exhibit, state) => {
      if (!exhibit) return;
      const event = (state?.events || []).find((candidate) =>
        candidate?.measurements?.some((measurement) => measurement?.key === exhibit.key),
      );
      const measurement = event?.measurements?.find((candidate) => candidate?.key === exhibit.key);
      const providerNames = {
        noaa: "NOAA",
        jaxa: "JAXA Earth Observation Research Center",
        esa: "ESA / Copernicus Data Space Ecosystem",
        "open-meteo": "Open-Meteo / CAMS",
      };
      const openMeteo = event?.provider === "open-meteo" || (!event && ["weatherWindSpeed", "weatherPrecipitation", "weatherTemperature", "cloudCover", "forecastCo2", "pm25"].includes(exhibit.key));
      const airModel = ["forecastCo2", "pm25"].includes(exhibit.key);
      const provider = openMeteo ? airModel ? "Open-Meteo / CAMS" : "Open-Meteo" : providerNames[event?.provider] || event?.provider?.toUpperCase() || "公開データ提供元";
      const location = event?.location;
      const bbox = Array.isArray(location?.bbox) ? ` / bbox ${location.bbox.join(", ")}` : "";
      const loading = state?.requestState === "loading";
      const retained = Boolean(event && state?.requestState === "unavailable");
      const status = loading ? event ? "UPDATING" : "LOADING" : retained ? "CACHED" : event?.status?.toUpperCase() || "UNAVAILABLE";
      const savedEvent = event?.status === "snapshot";
      const modelData = measurement?.sourceKind === "MODEL";
      const dataKind = modelData ? "モデル" : "観測";
      const dataset = {
        id: event?.datasetId || `${exhibit.id}-source-missing`,
        kind: measurement?.sourceKind || "SOURCE",
        title: event?.datasetId || `${exhibit.signalLabel}の公開観測データ`,
        organisation: provider,
        transformation: exhibit.caption,
        retrievedAt: event?.retrievedAt,
        period: event?.observedAt ? `データ時刻 ${displayJptDateTime(event.observedAt)}` : "データ時刻なし",
        unit: measurement?.unit || "—",
        resolution: `${location?.label || exhibit.location?.label || "公開データ対象範囲"}${bbox}`,
        caveat: loading ? event ? "同じ地点の前回取得値を表示して更新しています。時刻は前回取得値のものです。" : "選択した地点のデータを取得中です。別の地点の値で補ってはいません。"
          : retained ? "更新できなかったため、同じ地点の前回取得値とそのデータ時刻を表示しています。"
          : !event ? "選択した地点の値は未取得です。保存データに未収録の場合も、別の地点の値では補いません。"
          : state?.connected && !savedEvent
          ? "公開APIへ接続中です。5分ごとに再取得し、提供元の更新周期と公開遅延をそのまま表示へ反映します。"
          : `${status}。現在は保存済み${dataKind}値を再現しており、現在時刻の実況値ではありません。`,
        url: event?.provenance?.sourceUrl || (openMeteo ? `https://open-meteo.com/en/docs${airModel ? "/air-quality-api" : ""}` : "./data/live-observation-fallback-v1.json"),
        termsUrl: openMeteo ? "https://creativecommons.org/licenses/by/4.0/" : event?.provenance?.licenseUrl,
        attributionNote: openMeteo ? airModel
          ? "Copernicus Atmosphere Monitoring Service (CAMS) の全球モデル予測を Open-Meteo 経由で取得し、色・形・動きへ加工して表示しています（CC BY 4.0）。実測地点の観測値ではありません。"
          : "Open-Meteo のデータを色・形・動きへ加工して表示しています（CC BY 4.0）。" : null,
        preview: [{
          eventId: event?.eventId || null,
          status: event?.status || "missing",
          observedAt: event?.observedAt || null,
          value: measurement?.value ?? null,
          unit: measurement?.unit || null,
          quality: measurement?.quality || "missing",
          location: location?.label || exhibit.location?.label || null,
        }],
      };
      elements.title.textContent = `${exhibit.number} ${exhibit.shortTitle}`;
      elements.question.textContent = "";
      elements.act.textContent = `LIVE SENSEWARE / ${loading || retained || !event ? status : state?.connected ? modelData ? "LATEST MODEL · 5 MIN RECHECK" : "NEAR REAL TIME · 5 MIN REFRESH" : state?.source === "live" ? "LATEST API · RECONNECTING" : modelData ? "SAVED MODEL SNAPSHOT" : "SAVED SNAPSHOT"}`;
      elements.state.textContent = event ? `1種類の${dataKind}データを使用 / ${status}` : loading ? "この地点のデータと出典情報を取得中です" : "この地点のデータは未取得です";
      elements.updated.textContent = `取得日時：${displayJptDateTime(event?.retrievedAt)}`;
      elements.historyState.hidden = true;
      elements.historyUpdated.hidden = true;
      elements.liveState.hidden = true;
      elements.liveUpdated.hidden = true;
      elements.sources.replaceChildren(renderDataset(dataset, 0));
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
      updateLiveExhibit,
      updateOsm,
      updateJma,
      updateUsgs,
      setJsonPreview,
      setPreviewError,
    });
  };

  window.GaiaDataLedger = Object.freeze({ create });
})();
