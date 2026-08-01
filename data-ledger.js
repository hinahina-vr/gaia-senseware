(() => {
  "use strict";

  const PREVIEW_LINE_LIMIT = 10;

  const getRequiredElement = (id) => {
    const element = document.getElementById(id);
    if (!element) {
      throw new Error(`Open data ledger element not found: #${id}`);
    }
    return element;
  };

  const formatPreviewLines = (lines) =>
    lines
      .slice(0, PREVIEW_LINE_LIMIT)
      .map((line, index) => `${String(index + 1).padStart(2, "0")} │ ${line}`)
      .join("\n");

  const getPreviewElements = (elements, dataset) => {
    if (dataset === "jma") {
      return {
        preview: elements.jmaPreview,
        meta: elements.jmaPreviewMeta,
      };
    }
    if (dataset === "usgs") {
      return {
        preview: elements.usgsPreview,
        meta: elements.usgsPreviewMeta,
      };
    }
    throw new Error(`Unknown open data preview: ${dataset}`);
  };

  const create = () => {
    const elements = {
      osmZoom: getRequiredElement("osm-data-zoom"),
      osmCount: getRequiredElement("osm-data-count"),
      osmPreview: getRequiredElement("osm-data-preview"),
      osmPreviewMeta: getRequiredElement("osm-preview-meta"),
      jmaCount: getRequiredElement("jma-data-count"),
      jmaRetrieved: getRequiredElement("jma-data-retrieved"),
      jmaPreview: getRequiredElement("jma-data-preview"),
      jmaPreviewMeta: getRequiredElement("jma-preview-meta"),
      usgsCount: getRequiredElement("usgs-data-count"),
      usgsScope: getRequiredElement("usgs-data-scope"),
      usgsRetrieved: getRequiredElement("usgs-data-retrieved"),
      usgsPreview: getRequiredElement("usgs-data-preview"),
      usgsPreviewMeta: getRequiredElement("usgs-preview-meta"),
    };

    const setJsonPreview = (dataset, data, sourceLabel) => {
      const { preview, meta } = getPreviewElements(elements, dataset);
      const lines = JSON.stringify(data, null, 2).split(/\r?\n/);
      const shownCount = Math.min(PREVIEW_LINE_LIMIT, lines.length);
      preview.textContent = formatPreviewLines(lines);
      meta.textContent = `${sourceLabel} / 全${lines.length.toLocaleString(
        "ja-JP",
      )}行中 1–${shownCount}行 / ${PREVIEW_LINE_LIMIT}行で打ち切り`;
    };

    const setPreviewError = (dataset, message) => {
      const { preview, meta } = getPreviewElements(elements, dataset);
      preview.textContent = `01 │ ${message}`;
      meta.textContent = "データを取得できなかったため、プレビューはありません。";
    };

    const updateOsm = ({ scope, zoom, urls }) => {
      const visibleUrls = Array.isArray(urls) ? urls : [];
      const shownCount = Math.min(PREVIEW_LINE_LIMIT, visibleUrls.length);
      elements.osmZoom.textContent = `${scope.toUpperCase()} z${zoom} / EPSG:3857`;
      elements.osmCount.textContent = `${visibleUrls.length}タイル（現在の画面）`;
      elements.osmPreview.textContent = formatPreviewLines(visibleUrls);
      elements.osmPreviewMeta.textContent =
        `現在の表示領域 / 全${visibleUrls.length}件中 1–${shownCount}件 / ` +
        "画像タイルのため要求URLを1件＝1行で表示";
    };

    const updateJma = ({ state, eventCount, observationCount, retrievedAt }) => {
      if (state === "ready") {
        elements.jmaCount.textContent = `${eventCount}地震 / ${observationCount}観測地点`;
      } else if (state === "loading") {
        elements.jmaCount.textContent = "読み込み中";
      } else if (state === "offline") {
        elements.jmaCount.textContent = "取得失敗";
      } else {
        elements.jmaCount.textContent = "読み込み前";
      }
      elements.jmaRetrieved.textContent = retrievedAt || "—";
    };

    const updateUsgs = ({
      state,
      scope,
      totalCount,
      visibleCount,
      retrievedAt,
    }) => {
      elements.usgsScope.textContent =
        scope === "earth" ? "EARTH 世界全域" : "JAPAN 122–154°E / 20–48°N";
      if (state === "live" || state === "snapshot") {
        const sourceLabel = state === "live" ? "LIVE" : "保存JSON";
        elements.usgsCount.textContent =
          `${totalCount}件取得 / ${visibleCount}件表示（${sourceLabel}）`;
      } else if (state === "loading") {
        elements.usgsCount.textContent = "読み込み中";
      } else if (state === "offline") {
        elements.usgsCount.textContent = "取得失敗";
      } else {
        elements.usgsCount.textContent = "読み込み前";
      }
      elements.usgsRetrieved.textContent = retrievedAt || "—";
    };

    return Object.freeze({
      setJsonPreview,
      setPreviewError,
      updateOsm,
      updateJma,
      updateUsgs,
    });
  };

  window.GaiaDataLedger = Object.freeze({ create });
})();
