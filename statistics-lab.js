import {
  analyzeAnova,
  analyzeBayes,
  analyzeCategorical,
  analyzeCorrelation,
  analyzeDistribution,
  analyzeInterval,
  analyzeLogistic,
  analyzeSampling,
  analyzeSummary,
  analyzeWelch,
  benjaminiHochberg,
  chiSquareGoodnessOfFit,
  descriptive,
  exactBinomialTest,
  fCdf,
  fQuantile,
  fisherExact,
  meanConfidenceInterval,
  normalCdf,
  notApplicable,
  oneSampleTTest,
  ordinaryLeastSquares,
  pairedTTest,
  pearson,
  poissonPmf,
  proportionConfidenceInterval,
  sampleMeans,
  simpleRegression,
  studentTQuantile,
  studentTCdf,
  varianceConfidenceInterval,
} from "./statistics-lab-core.js";

const q = (selector) => document.querySelector(selector);
const lab = q("#gaia-statistics-lab");
const openButton = q("#gaia-statistics-button");

if (!lab || !openButton) {
  console.warn("GAIA Statistics Lab markup is unavailable.");
} else {
  // The exploration scene creates several independent stacking contexts. Moving
  // the dialog to document.body guarantees a top-level map overlay.
  document.body.append(lab);
  const ui = {
    close: q("#gaia-statistics-close"),
    context: q("#gaia-statistics-context"),
    dataset: q("#gaia-statistics-dataset"),
    derived: q("#gaia-statistics-derived"),
    recordFilter: q("#gaia-statistics-record-filter"),
    filterClear: q("#gaia-statistics-filter-clear"),
    segmentCompare: q("#gaia-statistics-segment-compare"),
    savedView: q("#gaia-statistics-saved-view"),
    viewSave: q("#gaia-statistics-view-save"),
    viewApply: q("#gaia-statistics-view-apply"),
    viewDelete: q("#gaia-statistics-view-delete"),
    lectures: q("#gaia-statistics-lectures"),
    methods: q("#gaia-statistics-methods"),
    number: q("#gaia-statistics-method-number"),
    title: q("#gaia-statistics-method-title"),
    copy: q("#gaia-statistics-method-copy"),
    status: q("#gaia-statistics-status"),
    kpis: q("#gaia-statistics-kpis"),
    kpiRows: q("#gaia-statistics-kpi-rows"),
    kpiRowsNote: q("#gaia-statistics-kpi-rows-note"),
    kpiCoverage: q("#gaia-statistics-kpi-coverage"),
    kpiCoverageNote: q("#gaia-statistics-kpi-coverage-note"),
    kpiPrimaryLabel: q("#gaia-statistics-kpi-primary-label"),
    kpiPrimary: q("#gaia-statistics-kpi-primary"),
    kpiPrimaryNote: q("#gaia-statistics-kpi-primary-note"),
    kpiQuality: q("#gaia-statistics-kpi-quality"),
    kpiQualityNote: q("#gaia-statistics-kpi-quality-note"),
    filterSummary: q("#gaia-statistics-filter-summary"),
    exportCsv: q("#gaia-statistics-export-csv"),
    exportJson: q("#gaia-statistics-export-json"),
    exportPng: q("#gaia-statistics-export-png"),
    canvas: q("#gaia-statistics-canvas"),
    visual: q("#gaia-statistics-visual"),
    metrics: q("#gaia-statistics-metrics"),
    formula: q("#gaia-statistics-formula"),
    recordCount: q("#gaia-statistics-record-count"),
    recordXHeading: q("#gaia-statistics-record-x-heading"),
    recordYHeading: q("#gaia-statistics-record-y-heading"),
    recordsBody: q("#gaia-statistics-records-body"),
    recordDetails: q(".gaia-statistics-records"),
    recordScroll: q(".gaia-statistics-records-scroll"),
    recordDrillStatus: q("#gaia-statistics-record-drill-status"),
    recordSortHeaders: [...document.querySelectorAll(".gaia-statistics-records thead th[data-record-sort]")],
    recordSortButtons: [...document.querySelectorAll(".gaia-statistics-records [data-record-sort-action]")],
    insights: q("#gaia-statistics-insights"),
    detailPanels: [...document.querySelectorAll(".gaia-statistics-stage > details")],
    panelBackButtons: [...document.querySelectorAll(".gaia-statistics-panel-back")],
  };
  const chartTooltip = document.createElement("output");
  chartTooltip.className = "gaia-statistics-chart-tooltip";
  chartTooltip.setAttribute("role", "status");
  chartTooltip.setAttribute("aria-live", "polite");
  chartTooltip.hidden = true;
  ui.visual.append(chartTooltip);
  ui.tooltip = chartTooltip;

  const MODE_TITLES = {
    "breathing-earth": "Breathing Earth / 地球の一呼吸",
    "blue-circulation": "Blue Circulation / 水の循環",
    "forest-cloud-engine": "Forest Cloud Engine / 森林と降水",
    "pollination-protocol": "Pollination Protocol / 送粉ネットワーク",
    "nothing-is-waste": "Nothing Is Waste / 循環する資源",
    "anthropocene-scar": "Anthropocene Scar / 人新世の痕跡",
    "rhythm-of-disaster": "Rhythm of Disaster / 地震の時間",
    "three-ecologies": "Three Ecologies / 生態・社会・文化",
    "earth-organ": "Earth Organ / 再生可能エネルギー",
  };

  const METHOD_GROUPS = [
    { id: "01", name: "記述統計", methods: [
      ["summary", "要約統計・ヒストグラム・箱ひげ", "中心、広がり、歪み、外れ値を同時に読みます。"],
      ["scatter", "散布図・共分散・Pearson相関", "2変数の方向と強さを、点の配置から確認します。"],
    ] },
    { id: "02", name: "確率分布", methods: [
      ["moments", "PMF・PDF・CDF・モーメント", "分布の形を期待値、分散、歪度、尖度で要約します。"],
    ] },
    { id: "03", name: "離散分布", methods: [
      ["discrete", "二項・ポアソン・幾何分布", "件数と発生間隔を離散確率モデルと照合します。"],
    ] },
    { id: "04", name: "連続分布", methods: [
      ["continuous", "一様・指数・正規・標準化", "観測値をz得点と理論確率面積へ変換します。"],
    ] },
    { id: "05", name: "標本と推定", methods: [
      ["sampling", "チェビチェフ・大数・CLT", "標本平均が安定していく過程と境界を可視化します。"],
      ["unbiased", "不偏分散", "nではなくn−1で割る意味を標本から確認します。"],
    ] },
    { id: "06", name: "区間推定", methods: [
      ["interval", "平均・分散・比率の信頼区間", "点推定だけでなく推定の幅を表示します。"],
      ["difference-ci", "2群差・分散比の区間", "前半と後半など、2群の差と不確実性を比較します。"],
    ] },
    { id: "07", name: "仮説検定", methods: [
      ["hypothesis", "p値・片側/両側・検出力", "帰無仮説と効果量を並べ、p値だけで判断しません。"],
      ["binomial", "正確二項検定", "成功数を二項分布の仮説と比較します。"],
    ] },
    { id: "08", name: "平均の検定", methods: [
      ["welch", "z/t/χ²・等分散t・Welch", "2群平均を分散が異なる可能性も含めて比較します。"],
      ["paired", "対応ありt検定", "同じ対象を対応させ、対象内の差を検定します。"],
    ] },
    { id: "09", name: "質的変数", methods: [
      ["categorical", "クロス集計・χ²独立性", "カテゴリの組み合わせに偏りがあるか確認します。"],
      ["fisher", "Fisher正確検定", "小標本の2×2表を近似なしで評価します。"],
    ] },
    { id: "10", name: "分散分析", methods: [
      ["anova", "1元・2元配置ANOVA", "群間・群内のばらつきと交互作用の可否を確認します。"],
      ["bh", "BH多重比較補正", "複数のp値を同時に扱うときの偽発見を抑えます。"],
    ] },
    { id: "11", name: "回帰分析", methods: [
      ["regression", "単回帰・多項式・最小二乗", "説明変数1単位あたりの変化を直線として推定します。"],
      ["multiple", "重回帰", "複数の自然条件を同時に入れ、係数を比較します。"],
    ] },
    { id: "12", name: "回帰診断", methods: [
      ["diagnostics", "R²・係数t・モデルF・残差", "当てはまりと残差を分けてモデルを診断します。"],
      ["prediction", "予測区間・多重共線性", "予測の幅と説明変数同士の重なりを表示します。"],
    ] },
    { id: "13", name: "ロジスティック", methods: [
      ["logistic", "ロジスティック回帰・最尤推定", "二値結果の確率をオッズ比で説明します。"],
    ] },
    { id: "14", name: "ベイズ", methods: [
      ["bayes", "Beta–Binomial・HDI", "事前分布が観測によってどう更新されたか示します。"],
      ["mcmc", "MCMC診断", "決定的なチェーンで収束指標と有効標本を確認します。"],
    ] },
    { id: "15", name: "総合演習", methods: [
      ["exercise", "GAIA 6段階総合演習", "問い、整形、可視化、推定、限界、次の分析を一続きにします。"],
    ] },
  ];

  const METHOD_LOOKUP = new Map(METHOD_GROUPS.flatMap((group) => group.methods.map((method) => [method[0], { group, id: method[0], label: method[1], copy: method[2] }])));
  const DEFAULT_METHOD = {
    "breathing-earth": "regression",
    "blue-circulation": "summary",
    "forest-cloud-engine": "summary",
    "pollination-protocol": "categorical",
    "nothing-is-waste": "difference-ci",
    "anthropocene-scar": "scatter",
    "rhythm-of-disaster": "discrete",
    "three-ecologies": "scatter",
    "earth-organ": "multiple",
  };
  const SAVED_VIEWS_STORAGE_KEY = "gaia-statistics-saved-views:v1";
  const MAX_SAVED_VIEWS = 8;

  const state = {
    open: false,
    snapshot: null,
    datasets: [],
    datasetId: "",
    modeId: "breathing-earth",
    lectureId: "01",
    methodId: "summary",
    includeDerived: false,
    recordQuery: "",
    recordSortKey: "",
    recordSortDirection: "ascending",
    selectedRecordId: "",
    filterTimer: 0,
    savedViews: [],
    returnFocus: null,
    result: null,
    points: new Map(),
    chartTargets: [],
    chartMeta: null,
    chartKeyboardIndex: -1,
    animation: 0,
    renderToken: 0,
    exportReady: false,
  };

  const finite = (value) => Number.isFinite(Number(value)) ? Number(value) : null;
  const pad2 = (value) => String(value).padStart(2, "0");
  const format = (value, digits = 3) => {
    if (typeof value === "string") return value;
    if (!Number.isFinite(value)) return "—";
    const absolute = Math.abs(value);
    if (absolute > 0 && (absolute < 0.001 || absolute >= 1e6)) return value.toExponential(2);
    return new Intl.NumberFormat("ja-JP", { maximumFractionDigits: digits }).format(value);
  };
  const modeById = (id) => state.snapshot?.modes?.find((mode) => mode.id === id);
  const joinById = (left, right) => {
    const rightMap = new Map(right.map((row) => [row.id || row.iso3 || row.country || row.name, row]));
    return left.map((row) => ({ ...row, ...(rightMap.get(row.id || row.iso3 || row.country || row.name) || {}) }));
  };

  const buildDatasets = (snapshot) => {
    const modes = new Map(snapshot.modes.map((mode) => [mode.id, mode]));
    const breathing = modes.get("breathing-earth")?.signals || {};
    const blue = modes.get("blue-circulation")?.signals || {};
    const forest = modes.get("forest-cloud-engine")?.signals || {};
    const pollination = modes.get("pollination-protocol")?.signals || {};
    const waste = modes.get("nothing-is-waste")?.signals || {};
    const scar = modes.get("anthropocene-scar")?.signals || {};
    const disaster = modes.get("rhythm-of-disaster")?.signals || {};
    const ecologies = modes.get("three-ecologies")?.signals || {};
    const organ = modes.get("earth-organ")?.signals || {};
    const co2 = (breathing.co2 || []).filter((row) => finite(row.deseasonalizedPpm) !== null).slice(-120).map((row, index) => ({
      id: `${row.year}-${pad2(row.month)}`, label: `${row.year}-${pad2(row.month)}`,
      x: row.year + (row.month - 0.5) / 12, y: Number(row.deseasonalizedPpm), value: Number(row.deseasonalizedPpm), provenance: "SOURCE", index,
    }));
    const co2MonthSpan = co2.length
      ? Math.round((co2.at(-1).x - co2[0].x) * 12) + 1
      : 0;
    const co2MissingMonths = Math.max(0, co2MonthSpan - co2.length);
    const co2Period = co2.length ? `${co2[0].label}〜${co2.at(-1).label}` : "観測なし";
    const jma = (breathing.japanCo2 || []).filter((row) => [row.ryoriPpm, row.minamitorishimaPpm, row.yonagunijimaPpm].every((value) => finite(value) !== null)).map((row) => ({
      id: String(row.year), label: String(row.year), x: Number(row.ryoriPpm), y: Number(row.minamitorishimaPpm), value: Number(row.ryoriPpm), paired: Number(row.yonagunijimaPpm), provenance: "SOURCE",
    }));
    const rainfall = (forest.precipitation || []).map((row) => ({ id: row.id, label: row.name, value: Number(row.precipitationMmDay), x: Number(row.lon), y: Number(row.precipitationMmDay), provenance: "SOURCE" }));
    const climate = (blue.climate || []).map((row) => ({ id: row.id, label: row.name, value: Number(row.windSpeedMs), x: Number(row.temperatureC), y: Number(row.windSpeedMs), provenance: "SOURCE", ...row }));
    const earthquakeEvents = (disaster.globalEvents || []).map((row) => ({ ...row, date: new Date(row.occurredAt) })).filter((row) => !Number.isNaN(row.date.valueOf()));
    const yearly = [];
    for (let year = 2001; year <= 2025; year += 1) yearly.push({ id: String(year), label: String(year), value: earthquakeEvents.filter((row) => row.date.getUTCFullYear() === year).length, x: year, y: earthquakeEvents.filter((row) => row.date.getUTCFullYear() === year).length, provenance: "SOURCE" });
    const sortedEvents = [...earthquakeEvents].sort((a, b) => a.date - b.date);
    const gaps = sortedEvents.slice(1).map((row, index) => ({ id: row.id, label: row.date.toISOString().slice(0, 10), value: (row.date - sortedEvents[index].date) / 86_400_000, provenance: "DERIVED" }));
    const wasteRows = (waste.countryWaste || []).map((row) => ({ id: row.id, label: row.name, value: Number(row.recyclePercent), x: Number(row.lon), y: Number(row.recyclePercent), provenance: row.valueStatus === "SOURCE" ? "SOURCE" : "IMPUTED", ...row }));
    const forestUrban = (ecologies.pairedCountries || []).map((row) => ({ id: row.id, label: row.name, x: Number(row.forestPercent), y: Number(row.urbanPercent), value: Number(row.forestPercent), provenance: "SOURCE", ...row }));
    const emissionsUrban = joinById(scar.emissions || [], scar.nightLights || []).map((row) => ({ id: row.id, label: row.name, x: Number(row.urbanPercent), y: Number(row.emissionsMtCo2e), value: Number(row.emissionsMtCo2e), provenance: "SOURCE", ...row }));
    const renewables = joinById(organ.current || [], organ.potential || []).map((row) => ({ id: row.id, label: row.name, x: Number(row.solarKwhM2Day), y: Number(row.renewablePercent), value: Number(row.renewablePercent), provenance: "SOURCE", ...row }));
    const culture = (ecologies.culture || []).map((row, index) => ({ id: String(index), label: row.name, category: row.category, group: row.region, value: index, provenance: "SOURCE", ...row }));
    const interactions = (pollination.interactions || []).map((row, index) => ({ id: `i${index}`, label: row.targetTaxon, category: row.interaction, group: row.sourceTaxon, value: index, provenance: "SOURCE", ...row }));
    const occurrences = (pollination.occurrences || []).map((row, index) => ({ id: `o${index}`, label: row.country, category: row.basisOfRecord, group: row.sampling, value: index, provenance: "SOURCE", ...row }));
    return [
      {
        id: "co2-trend",
        modeId: "breathing-earth",
        title: `CO₂ 観測${co2.length}件（${co2Period} / 欠測${co2MissingMonths}か月）`,
        rows: co2,
        unit: "ppm",
        xLabel: "観測月",
        xKind: "month",
        yLabel: "CO₂",
        reference: co2[0]?.value,
        provenance: ["SOURCE"],
        periodStart: co2[0]?.label,
        periodEnd: co2.at(-1)?.label,
        missingPeriods: co2MissingMonths,
      },
      { id: "jma-co2", modeId: "breathing-earth", title: "JMA CO₂ 3観測所 共通期間", rows: jma, unit: "ppm", xLabel: "綾里", yLabel: "南鳥島", pairedLabel: "与那国島", provenance: ["SOURCE"] },
      { id: "wind-climate", modeId: "blue-circulation", title: "31地点の風速と気温", rows: climate, unit: "m/s", xLabel: "気温", yLabel: "風速", provenance: ["SOURCE"] },
      { id: "rainfall", modeId: "forest-cloud-engine", title: "31地点の平均降水量", rows: rainfall, unit: "mm/day", xLabel: "経度", yLabel: "降水量", provenance: ["SOURCE"] },
      { id: "pollination", modeId: "pollination-protocol", title: "送粉相互作用と記録方式", rows: [...interactions, ...occurrences], categoricalSets: [interactions, occurrences], unit: "件", provenance: ["SOURCE"] },
      { id: "waste", modeId: "nothing-is-waste", title: "31か国の再資源化率", rows: wasteRows, unit: "%", xLabel: "経度", yLabel: "再資源化率", provenance: ["SOURCE", "IMPUTED"] },
      { id: "emissions-urban", modeId: "anthropocene-scar", title: "都市化率と温室効果ガス排出", rows: emissionsUrban, unit: "MtCO₂e", xLabel: "都市化率", yLabel: "排出量", provenance: ["SOURCE"] },
      { id: "earthquakes", modeId: "rhythm-of-disaster", title: "M7以上地震の年別件数（2001–2025）", rows: yearly, gaps, unit: "件/年", xLabel: "年", yLabel: "発生件数", provenance: ["SOURCE", "DERIVED"] },
      { id: "forest-urban", modeId: "three-ecologies", title: "31か国の森林率と都市化率", rows: forestUrban, unit: "%", xLabel: "森林率", yLabel: "都市化率", provenance: ["SOURCE"] },
      { id: "culture", modeId: "three-ecologies", title: "文化遺産カテゴリと地域", rows: culture, unit: "件", provenance: ["SOURCE"] },
      { id: "renewables", modeId: "earth-organ", title: "再生可能比率と自然条件", rows: renewables, unit: "%", xLabel: "太陽光ポテンシャル", yLabel: "再生可能比率", provenance: ["SOURCE"] },
    ];
  };

  const currentDataset = () => state.datasets.find((dataset) => dataset.id === state.datasetId) || state.datasets[0];
  const eligibleRowsFor = (dataset) => dataset.rows.filter((row) => state.includeDerived || row.provenance === "SOURCE");
  const searchableTextFor = (row) => Object.values(row).flatMap((value) => {
    if (value instanceof Date) return value.toISOString();
    if (Array.isArray(value)) return value.map(String);
    if (value === null || value === undefined || typeof value === "object") return [];
    return String(value);
  }).join(" ").toLocaleLowerCase("ja-JP");
  const rowsFor = (dataset) => {
    const eligible = eligibleRowsFor(dataset);
    const tokens = state.recordQuery.trim().toLocaleLowerCase("ja-JP").split(/\s+/u).filter(Boolean);
    if (!tokens.length) return eligible;
    return eligible.filter((row) => {
      const text = searchableTextFor(row);
      return tokens.every((token) => text.includes(token));
    });
  };
  const valuesFor = (dataset) => rowsFor(dataset).map((row) => row.value).filter(Number.isFinite);
  const splitValues = (values) => [values.slice(0, Math.floor(values.length / 2)), values.slice(Math.ceil(values.length / 2))];
  const customInsight = ({ headline, meaning, evidence = [], interpretation, limitations, nextActions, provenance }) => ({ headline, meaning, evidence, interpretation, limitations, nextActions, provenance });
  const customResult = ({ kind = "custom", metrics = [], chart = { type: "summary" }, insight, formula = "" }) => ({ kind, metrics, chart, insight, formula });

  const setExportsEnabled = (enabled) => {
    state.exportReady = Boolean(enabled);
    [ui.exportCsv, ui.exportJson, ui.exportPng].forEach((button) => { if (button) button.disabled = !state.exportReady; });
  };

  const primaryMetricFor = (result) => {
    const metrics = (result.metrics || []).filter((metric) => Number.isFinite(Number(metric?.[1])));
    const preferred = metrics.find(([label]) => /平均|中央値|相関|傾き|R²|推定|確率|オッズ比|効果量|F$|χ²/u.test(label));
    return preferred || metrics.find(([label]) => !/^(?:n|標本数|使用行|自由度)$/u.test(label)) || metrics[0] || null;
  };

  const renderBusinessSummary = (result, dataset) => {
    const usedRows = rowsFor(dataset);
    const eligibleRows = eligibleRowsFor(dataset);
    const totalRows = dataset.rows.length;
    const sourceRows = usedRows.filter((row) => row.provenance === "SOURCE").length;
    const coverage = totalRows ? usedRows.length / totalRows : 0;
    const sourceShare = usedRows.length ? sourceRows / usedRows.length : 0;
    const primary = primaryMetricFor(result);
    const period = dataset.periodStart && dataset.periodEnd ? `${dataset.periodStart}–${dataset.periodEnd}` : "SAVED SNAPSHOT";

    ui.kpiRows.textContent = format(usedRows.length, 0);
    ui.kpiRowsNote.textContent = `${usedRows.length} / ${totalRows} ROWS`;
    ui.kpiCoverage.textContent = `${format(coverage * 100, 1)}%`;
    ui.kpiCoverageNote.textContent = state.recordQuery ? "QUERY SEGMENT" : (state.includeDerived ? "SOURCE + DERIVED" : "SOURCE FILTER");
    ui.kpiPrimaryLabel.textContent = primary?.[0] || "PRIMARY KPI";
    ui.kpiPrimary.textContent = primary ? `${format(primary[1])}${primary[2] || ""}` : "—";
    ui.kpiPrimaryNote.textContent = primary ? `${METHOD_LOOKUP.get(state.methodId)?.group.id || "--"} / LIVE RESULT` : "数値指標なし";
    ui.kpiQuality.textContent = sourceRows === usedRows.length ? "SOURCE ONLY" : `${format(sourceShare * 100, 1)}% SOURCE`;
    ui.kpiQualityNote.textContent = `${sourceRows} SOURCE / ${usedRows.length - sourceRows} DERIVED`;
    ui.kpis.dataset.usedRows = String(usedRows.length);
    ui.kpis.dataset.totalRows = String(totalRows);
    ui.kpis.dataset.sourceRows = String(sourceRows);
    ui.kpis.dataset.coverage = String(coverage);
    ui.kpis.dataset.quality = sourceRows === usedRows.length ? "source-only" : "mixed";
    const querySummary = state.recordQuery ? ` · QUERY “${state.recordQuery}”` : "";
    ui.filterSummary.textContent = `FILTER / ${state.includeDerived ? "SOURCE + DERIVED" : "SOURCE ONLY"}${querySummary} · ${period} · BROWSER LOCAL`;

    const comparisonLabel = document.createElement("span"); comparisonLabel.textContent = "SEGMENT / ALL ELIGIBLE";
    const comparisonValue = document.createElement("strong");
    const comparisonNote = document.createElement("small");
    const numericComparisonAllowed = !usedRows.some((row) => row.category !== undefined || row.group !== undefined);
    const segmentValues = usedRows.map((row) => row.value).filter(Number.isFinite);
    const baselineValues = eligibleRows.map((row) => row.value).filter(Number.isFinite);
    delete ui.segmentCompare.dataset.delta;
    delete ui.segmentCompare.dataset.segmentMean;
    delete ui.segmentCompare.dataset.baselineMean;
    if (!state.recordQuery) {
      comparisonValue.textContent = "セグメント未指定";
      comparisonNote.textContent = "検索すると、表示中平均と全体平均の差を表示します。";
      ui.segmentCompare.dataset.status = "idle";
    } else if (!usedRows.length) {
      comparisonValue.textContent = "NO MATCH";
      comparisonNote.textContent = `「${state.recordQuery}」に一致するレコードはありません。`;
      ui.segmentCompare.dataset.status = "empty";
    } else if (!numericComparisonAllowed || !segmentValues.length || !baselineValues.length) {
      comparisonValue.textContent = `${usedRows.length} RECORDS`;
      comparisonNote.textContent = "カテゴリデータは平均差を作らず、件数だけを比較します。";
      ui.segmentCompare.dataset.status = "categorical";
    } else {
      const segmentMean = segmentValues.reduce((sum, value) => sum + value, 0) / segmentValues.length;
      const baselineMean = baselineValues.reduce((sum, value) => sum + value, 0) / baselineValues.length;
      const difference = segmentMean - baselineMean;
      comparisonValue.textContent = `${difference >= 0 ? "+" : ""}${format(difference)}${dataset.unit}`;
      comparisonNote.textContent = `表示中平均 ${format(segmentMean)}${dataset.unit} / 全${eligibleRows.length}行 ${format(baselineMean)}${dataset.unit}`;
      ui.segmentCompare.dataset.status = difference > 0 ? "above" : difference < 0 ? "below" : "same";
      ui.segmentCompare.dataset.delta = String(difference);
      ui.segmentCompare.dataset.segmentMean = String(segmentMean);
      ui.segmentCompare.dataset.baselineMean = String(baselineMean);
    }
    ui.segmentCompare.replaceChildren(comparisonLabel, comparisonValue, comparisonNote);
  };

  const normalizedExportValue = (value) => {
    if (value instanceof Date) return value.toISOString();
    if (Array.isArray(value) || (value && typeof value === "object")) return JSON.stringify(value);
    return value ?? "";
  };

  const exportColumnsFor = (rows) => {
    const preferred = ["id", "label", "value", "x", "y", "paired", "category", "group", "provenance"];
    const keys = new Set(rows.flatMap((row) => Object.keys(row).filter((key) => typeof row[key] !== "function")));
    return [...preferred.filter((key) => keys.has(key)), ...[...keys].filter((key) => !preferred.includes(key)).sort()];
  };

  const csvCell = (value) => {
    let text = String(normalizedExportValue(value));
    if (/^[=+\-@]/u.test(text) && typeof value !== "number") text = `'${text}`;
    return `"${text.replaceAll('"', '""')}"`;
  };

  const exportBaseName = () => {
    const date = new Date().toISOString().slice(0, 10);
    return `gaia-${currentDataset()?.id || "statistics"}-${state.methodId}-${date}`.replace(/[^a-z0-9._-]+/giu, "-");
  };

  const createExportReport = () => {
    const dataset = currentDataset();
    const method = METHOD_LOOKUP.get(state.methodId);
    const rows = rowsFor(dataset);
    return {
      schemaVersion: "gaia-statistics-report/v1",
      exportedAt: new Date().toISOString(),
      processing: "browser-local",
      filter: { includeDerived: state.includeDerived, provenance: state.includeDerived ? dataset.provenance : ["SOURCE"], query: state.recordQuery },
      dataset: {
        id: dataset.id,
        modeId: dataset.modeId,
        title: dataset.title,
        unit: dataset.unit,
        periodStart: dataset.periodStart || null,
        periodEnd: dataset.periodEnd || null,
        usedRows: rows.length,
        totalRows: dataset.rows.length,
      },
      method: { id: state.methodId, lectureId: method?.group.id || null, label: method?.label || state.methodId },
      metrics: (state.result?.metrics || []).map(([label, value, unit]) => ({ label, value: Number.isFinite(value) ? value : normalizedExportValue(value), unit: unit || "" })),
      formula: state.result?.formula || "",
      insight: state.result?.insight || null,
      rows: rows.map((row) => Object.fromEntries(Object.entries(row).map(([key, value]) => [key, normalizedExportValue(value)]))),
    };
  };

  const downloadBlob = (blob, filename, kind) => {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.hidden = true;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1500);
    window.dispatchEvent(new CustomEvent("gaia:statistics-export", { detail: { kind, filename, datasetId: state.datasetId, methodId: state.methodId } }));
  };

  const exportCsv = () => {
    if (!state.exportReady) return false;
    const dataset = currentDataset();
    const rows = rowsFor(dataset);
    const columns = exportColumnsFor(rows);
    const headers = ["dataset_id", "mode_id", "method_id", ...columns];
    const csvRows = [headers.map(csvCell).join(",")];
    rows.forEach((row) => csvRows.push([dataset.id, dataset.modeId, state.methodId, ...columns.map((column) => row[column])].map(csvCell).join(",")));
    downloadBlob(new Blob([`\uFEFF${csvRows.join("\r\n")}\r\n`], { type: "text/csv;charset=utf-8" }), `${exportBaseName()}.csv`, "csv");
    return true;
  };

  const exportJson = () => {
    if (!state.exportReady) return false;
    downloadBlob(new Blob([`${JSON.stringify(createExportReport(), null, 2)}\n`], { type: "application/json" }), `${exportBaseName()}.json`, "json");
    return true;
  };

  const exportPng = () => new Promise((resolve) => {
    if (!state.exportReady) { resolve(false); return; }
    const source = ui.canvas;
    const ratio = Math.max(1, source.width / Math.max(1, source.getBoundingClientRect().width));
    const headerHeight = Math.round(74 * ratio);
    const footerHeight = Math.round(42 * ratio);
    const canvas = document.createElement("canvas");
    canvas.width = source.width;
    canvas.height = source.height + headerHeight + footerHeight;
    const context = canvas.getContext("2d");
    context.fillStyle = "#031025";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#83e7ff";
    context.font = `700 ${Math.round(10 * ratio)}px Consolas, monospace`;
    context.fillText("GAIA STATISTICS LAB / LOCAL ANALYSIS", Math.round(22 * ratio), Math.round(24 * ratio));
    context.fillStyle = "#edfaff";
    context.font = `600 ${Math.round(18 * ratio)}px sans-serif`;
    context.fillText(`${currentDataset().title} — ${METHOD_LOOKUP.get(state.methodId)?.label || state.methodId}`, Math.round(22 * ratio), Math.round(52 * ratio));
    context.drawImage(source, 0, headerHeight);
    context.strokeStyle = "rgba(131,231,255,.32)";
    context.beginPath(); context.moveTo(Math.round(22 * ratio), canvas.height - footerHeight); context.lineTo(canvas.width - Math.round(22 * ratio), canvas.height - footerHeight); context.stroke();
    context.fillStyle = "rgba(218,243,255,.68)";
    context.font = `600 ${Math.round(9 * ratio)}px Consolas, monospace`;
    context.fillText(ui.filterSummary.textContent, Math.round(22 * ratio), canvas.height - Math.round(16 * ratio));
    canvas.toBlob((blob) => {
      if (!blob) { resolve(false); return; }
      downloadBlob(blob, `${exportBaseName()}.png`, "png");
      resolve(true);
    }, "image/png");
  });

  const readSavedViews = () => {
    try {
      const parsed = JSON.parse(window.localStorage.getItem(SAVED_VIEWS_STORAGE_KEY) || "[]");
      if (!Array.isArray(parsed)) return [];
      return parsed.filter((view) => view && typeof view.id === "string" && typeof view.datasetId === "string" && typeof view.methodId === "string").slice(0, MAX_SAVED_VIEWS);
    } catch {
      return [];
    }
  };

  const persistSavedViews = () => {
    try {
      window.localStorage.setItem(SAVED_VIEWS_STORAGE_KEY, JSON.stringify(state.savedViews.slice(0, MAX_SAVED_VIEWS)));
      return true;
    } catch {
      return false;
    }
  };

  const updateSavedViewButtons = () => {
    const selected = Boolean(ui.savedView.value && state.savedViews.some((view) => view.id === ui.savedView.value));
    ui.viewApply.disabled = !selected;
    ui.viewDelete.disabled = !selected;
  };

  const renderSavedViews = (selectedId = ui.savedView.value) => {
    ui.savedView.replaceChildren();
    const placeholder = document.createElement("option"); placeholder.value = ""; placeholder.textContent = state.savedViews.length ? "保存ビューを選択" : "保存ビューなし";
    ui.savedView.append(placeholder);
    state.savedViews.forEach((view) => {
      const option = document.createElement("option");
      option.value = view.id;
      option.textContent = view.name;
      ui.savedView.append(option);
    });
    ui.savedView.value = state.savedViews.some((view) => view.id === selectedId) ? selectedId : "";
    updateSavedViewButtons();
  };

  const savedViewSignature = ({ datasetId, methodId, includeDerived, recordQuery, recordSortKey, recordSortDirection }) => [
    datasetId,
    methodId,
    includeDerived ? "1" : "0",
    String(recordQuery || "").trim().toLocaleLowerCase("ja-JP"),
    String(recordSortKey || ""),
    recordSortDirection === "descending" ? "desc" : "asc",
  ].join("|");

  const saveCurrentView = () => {
    const dataset = currentDataset();
    const method = METHOD_LOOKUP.get(state.methodId);
    if (!dataset || !method) return false;
    const snapshot = {
      id: globalThis.crypto?.randomUUID?.() || `view-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      name: `${dataset.title.replace(/（.*$/u, "").trim()} · ${method.group.id} ${method.label.split("・")[0]}${state.recordQuery ? ` · ${state.recordQuery}` : ""}`,
      datasetId: dataset.id,
      methodId: state.methodId,
      lectureId: method.group.id,
      includeDerived: state.includeDerived,
      recordQuery: state.recordQuery,
      recordSortKey: state.recordSortKey,
      recordSortDirection: state.recordSortDirection,
      savedAt: new Date().toISOString(),
    };
    const signature = savedViewSignature(snapshot);
    const existing = state.savedViews.find((view) => savedViewSignature(view) === signature);
    if (existing) {
      snapshot.id = existing.id;
      state.savedViews = [snapshot, ...state.savedViews.filter((view) => view.id !== existing.id)];
    } else {
      state.savedViews = [snapshot, ...state.savedViews].slice(0, MAX_SAVED_VIEWS);
    }
    const persisted = persistSavedViews();
    renderSavedViews(snapshot.id);
    ui.status.textContent = persisted ? "VIEW SAVED / LOCAL" : "VIEW NOT SAVED / STORAGE BLOCKED";
    window.dispatchEvent(new CustomEvent("gaia:statistics-view-save", { detail: { ...snapshot, persisted } }));
    return persisted;
  };

  const applySavedView = () => {
    const view = state.savedViews.find((candidate) => candidate.id === ui.savedView.value);
    const dataset = state.datasets.find((candidate) => candidate.id === view?.datasetId);
    const method = METHOD_LOOKUP.get(view?.methodId);
    if (!view || !dataset || !method) return false;
    state.includeDerived = Boolean(view.includeDerived && dataset.provenance.some((kind) => kind !== "SOURCE"));
    state.recordQuery = String(view.recordQuery || "");
    state.recordSortKey = ["label", "x", "y", "provenance"].includes(view.recordSortKey) ? view.recordSortKey : "";
    state.recordSortDirection = view.recordSortDirection === "descending" ? "descending" : "ascending";
    state.selectedRecordId = "";
    state.lectureId = method.group.id;
    state.methodId = method.id;
    ui.recordFilter.value = state.recordQuery;
    ui.filterClear.disabled = !state.recordQuery;
    renderLectures();
    renderMethods();
    setDataset(dataset.id, false);
    window.dispatchEvent(new CustomEvent("gaia:statistics-view-apply", { detail: { ...view } }));
    return true;
  };

  const deleteSavedView = () => {
    const id = ui.savedView.value;
    if (!id) return false;
    state.savedViews = state.savedViews.filter((view) => view.id !== id);
    const persisted = persistSavedViews();
    renderSavedViews();
    ui.status.textContent = persisted ? "VIEW DELETED / LOCAL" : "VIEW DELETE NOT PERSISTED";
    window.dispatchEvent(new CustomEvent("gaia:statistics-view-delete", { detail: { id, persisted } }));
    return persisted;
  };

  const applyRecordQuery = (value, immediate = false) => {
    window.clearTimeout(state.filterTimer);
    const commit = () => {
      const query = String(value || "").trim();
      const changed = query !== state.recordQuery;
      state.recordQuery = query;
      ui.recordFilter.value = query;
      ui.filterClear.disabled = !query;
      if (changed) render();
    };
    if (immediate) commit();
    else state.filterTimer = window.setTimeout(commit, 140);
  };

  const analyzeMoments = (dataset) => {
    const stats = descriptive(valuesFor(dataset));
    if (!stats) return notApplicable("有限な観測値がありません。", ["01 要約統計"]);
    return customResult({
      kind: "distribution", metrics: [["期待値（標本平均）", stats.mean, dataset.unit], ["分散", stats.sampleVariance, `${dataset.unit}²`], ["歪度", stats.skewness, ""], ["超過尖度", stats.excessKurtosis, ""], ["第2中心モーメント", stats.populationVariance, `${dataset.unit}²`]],
      chart: { type: "distribution", values: stats.values, summary: stats, family: "empirical", unit: dataset.unit },
      formula: "経験CDF F(x)=#{Xi≤x}/n / 第k中心モーメント mk=Σ(Xi−X̄)^k/n",
      insight: customInsight({
        headline: `分布は${stats.skewness > 0.45 ? "右裾が長い" : stats.skewness < -0.45 ? "左裾が長い" : "大きな左右非対称がない"}形です。`,
        meaning: "PMF/PDFは値の現れやすさ、CDFはある値以下になる割合を示します。モーメントは中心、広がり、左右非対称、裾の重さを数値へ圧縮します。",
        evidence: [["n", stats.n, "件"], ["平均", stats.mean, dataset.unit], ["歪度", stats.skewness, ""], ["超過尖度", stats.excessKurtosis, ""]],
        interpretation: `この保存標本の歪度は${format(stats.skewness)}、超過尖度は${format(stats.excessKurtosis)}です。平均だけでなく分布全体を見る必要があります。`,
        limitations: ["経験分布が母集団の真の分布と一致する保証はありません。", "地点・期間の選定方法が分布の形に影響します。"],
        nextActions: ["04 連続分布", "05 標本平均"], provenance: dataset.provenance,
      }),
    });
  };

  const analyzeDiscrete = (dataset) => {
    if (dataset.id !== "earthquakes") return notApplicable("この手法は0,1,2…の件数または待ち回数に適用します。現在のデータは離散発生件数として設計されていません。", ["01 要約統計", "04 連続分布"]);
    const values = valuesFor(dataset);
    const stats = descriptive(values);
    const ratio = stats.populationVariance / stats.mean;
    const maximum = Math.max(...values);
    const threshold = Math.ceil(stats.mean);
    const successYears = values.filter((value) => value >= threshold).length;
    const binomialProbability = successYears / values.length;
    const expected = Array.from({ length: maximum + 1 }, (_, k) => poissonPmf(k, stats.mean) * values.length);
    const observed = Array.from({ length: maximum + 1 }, (_, k) => values.filter((value) => value === k).length);
    const goodness = chiSquareGoodnessOfFit(observed, expected);
    return customResult({
      kind: "distribution", metrics: [["年数", stats.n, "年"], ["平均", stats.mean, "件/年"], ["分散", stats.populationVariance, "件²"], ["分散/平均", ratio, ""], [`年${threshold}件以上の比率（二項p）`, binomialProbability, ""], ["幾何分布の期待待ち年", 1 / binomialProbability, "年"], ["χ²（参考）", goodness?.statistic ?? NaN, ""]],
      chart: { type: "discrete", observed, expected, label: "年別件数" },
      formula: "Poisson: P(X=k)=e^(−λ)λ^k/k! / λ=標本平均",
      insight: customInsight({
        headline: `M7以上の地震は年平均${format(stats.mean, 2)}件、分散/平均は${format(ratio, 2)}です。`,
        meaning: "ポアソン分布は、一定の平均率で独立に起きる件数を表し、理論上は平均と分散が等しくなります。幾何分布は次の発生までの試行回数を表します。",
        evidence: [["期間", "2001–2025", ""], ["n", stats.n, "年"], ["平均", stats.mean, "件"], ["分散", stats.populationVariance, "件²"], ["分散/平均", ratio, ""], [`年${threshold}件以上`, successYears, "年"]],
        interpretation: `分散/平均=${format(ratio, 2)}は1より小さく、この保存標本の年ごとの変動は単純ポアソンよりやや狭い傾向です。`,
        limitations: ["独立かつ一定発生率という仮定は地震過程にそのまま成立しません。", "期待度数の小さい階級があるためχ²適合度の確定結論は出しません。"],
        nextActions: ["04 発生間隔", "06 平均件数の区間"], provenance: ["SOURCE", "DERIVED"],
      }),
    });
  };

  const analyzeContinuous = (dataset) => {
    const target = dataset.id === "earthquakes" && state.includeDerived ? dataset.gaps.map((row) => row.value) : valuesFor(dataset);
    const family = dataset.id === "earthquakes" && state.includeDerived ? "exponential" : "normal";
    const result = analyzeDistribution({ values: target, label: family === "exponential" ? "地震発生間隔" : dataset.title, unit: family === "exponential" ? "日" : dataset.unit, family, provenance: family === "exponential" ? ["DERIVED"] : dataset.provenance });
    const stats = descriptive(target);
    if (stats && result.metrics) {
      const maximumZ = stats.populationSd > 0 ? (stats.maximum - stats.mean) / stats.populationSd : NaN;
      const uniformDensity = stats.range > 0 ? 1 / stats.range : NaN;
      result.metrics.push(["最大値のz得点", maximumZ, ""], ["範囲内の一様PDF", uniformDensity, `1/${family === "exponential" ? "日" : dataset.unit}`], ["正規分布の平均±1SD面積", 0.682689, ""]);
      result.insight.meaning += " z得点は平均から何標準偏差離れたか、確率面積は区間へ入る理論確率を表します。一様分布は範囲内を同じ密度と仮定します。";
      result.formula = "z=(x−μ)/σ / Uniform f(x)=1/(b−a) / Exponential f(x)=λe^(−λx)";
    }
    return result;
  };

  const analyzeUnbiased = (dataset) => {
    const stats = descriptive(valuesFor(dataset));
    if (!stats || stats.n < 2) return notApplicable("不偏分散には2件以上必要です。", ["01 要約統計"]);
    return customResult({
      metrics: [["n", stats.n, "件"], ["nで割る分散", stats.populationVariance, `${dataset.unit}²`], ["n−1で割る不偏分散", stats.sampleVariance, `${dataset.unit}²`], ["補正倍率", stats.n / (stats.n - 1), "倍"]],
      chart: { type: "interval", estimate: stats.sampleVariance, interval: [stats.populationVariance, stats.sampleVariance], unit: `${dataset.unit}²` },
      formula: "s²=Σ(Xi−X̄)²/(n−1)",
      insight: customInsight({ headline: `n−1補正で分散は${format(stats.populationVariance)}から${format(stats.sampleVariance)}へ変わります。`, meaning: "標本平均を同じ標本から推定すると自由度を1つ使うため、母分散の推定ではn−1で割ります。", evidence: [["n", stats.n, "件"], ["補正前", stats.populationVariance, `${dataset.unit}²`], ["不偏分散", stats.sampleVariance, `${dataset.unit}²`]], interpretation: `この標本では補正倍率は${format(stats.n / (stats.n - 1))}倍です。標本数が増えるほど差は小さくなります。`, limitations: ["不偏性は繰り返し標本抽出した平均についての性質です。", "外れ値や依存観測の問題は補正だけでは解決しません。"], nextActions: ["05 CLT", "06 分散の区間"], provenance: dataset.provenance }),
    });
  };

  const analyzeDifference = (dataset) => {
    let result;
    let left;
    let right;
    if (dataset.id === "waste") {
      left = dataset.rows.filter((row) => row.provenance === "SOURCE").map((row) => row.value);
      right = dataset.rows.filter((row) => row.provenance === "IMPUTED").map((row) => row.value);
      result = analyzeWelch({ left, right, leftLabel: "実測17か国", rightLabel: "補完14か国", unit: "%", provenance: ["SOURCE", "IMPUTED"], diagnosticOnly: true });
    } else {
      [left, right] = splitValues(valuesFor(dataset));
      result = analyzeWelch({ left, right, leftLabel: "前半", rightLabel: "後半", unit: dataset.unit, provenance: dataset.provenance, diagnosticOnly: true });
    }
    if (result.test) {
      const leftStats = descriptive(left);
      const rightStats = descriptive(right);
      const ratio = leftStats.sampleVariance / rightStats.sampleVariance;
      const alpha = 0.05;
      const lower = ratio / fQuantile(1 - alpha / 2, leftStats.n - 1, rightStats.n - 1);
      const upper = ratio / fQuantile(alpha / 2, leftStats.n - 1, rightStats.n - 1);
      result.metrics.push(["分散比", ratio, "倍"], ["分散比95%下限", lower, "倍"], ["分散比95%上限", upper, "倍"]);
      result.insight.meaning += " 分散比の区間はF分布を使い、2群のばらつきの相対的不確実性を表します。";
      result.insight.evidence.push(["分散比", ratio, "倍"], ["分散比下限", lower, "倍"], ["分散比上限", upper, "倍"]);
      result.formula = "Welch mean difference / variance ratio CI: (s1²/s2²)÷F quantiles";
    }
    return result;
  };

  const analyzeIntervals = (dataset) => {
    const values = valuesFor(dataset);
    const result = analyzeInterval({ values, label: dataset.title, unit: dataset.unit, provenance: dataset.provenance });
    if (!result.metrics) return result;
    const varianceInterval = varianceConfidenceInterval(values);
    const stats = descriptive(values);
    const successes = values.filter((value) => value > stats.median).length;
    const proportionInterval = proportionConfidenceInterval(successes, values.length);
    result.metrics.push(
      ["分散95%下限", varianceInterval.lower, `${dataset.unit}²`],
      ["分散95%上限", varianceInterval.upper, `${dataset.unit}²`],
      ["中央値超の比率", proportionInterval.estimate, ""],
      ["比率95%下限", proportionInterval.lower, ""],
      ["比率95%上限", proportionInterval.upper, ""],
    );
    result.insight.meaning += " 分散の区間はχ²分布、比率の区間は標本比率の標準誤差を使い、対象に応じて不確実性の尺度を変えます。";
    result.insight.evidence.push(["分散下限", varianceInterval.lower, `${dataset.unit}²`], ["分散上限", varianceInterval.upper, `${dataset.unit}²`]);
    result.formula = "平均: X̄±t×s/√n / 分散: (n−1)s²÷χ² / 比率: p̂±z√(p̂(1−p̂)/n)";
    return result;
  };

  const analyzeHypothesis = (dataset) => {
    const values = valuesFor(dataset);
    const hypothesized = Number.isFinite(dataset.reference) ? dataset.reference : descriptive(values)?.median;
    const test = oneSampleTTest(values, hypothesized);
    if (!test) return notApplicable("1標本t検定には2件以上のばらつく値が必要です。", ["01 要約統計"]);
    const effectD = (test.stats.mean - hypothesized) / test.stats.sampleSd;
    const greater = oneSampleTTest(values, hypothesized, "greater");
    const less = oneSampleTTest(values, hypothesized, "less");
    const zCritical = 1.959963984540054;
    const noncentralShift = Math.abs(effectD) * Math.sqrt(values.length);
    const approximatePower = normalCdf(-zCritical - noncentralShift) + 1 - normalCdf(zCritical - noncentralShift);
    const meanInterval = meanConfidenceInterval(values);
    const differenceInterval = [meanInterval.lower - hypothesized, meanInterval.upper - hypothesized];
    return customResult({
      kind: "test", metrics: [["仮説平均", hypothesized, dataset.unit], ["標本平均", test.stats.mean, dataset.unit], ["平均差", test.effect, dataset.unit], ["Cohen d", effectD, ""], ["t", test.statistic, ""], ["p（両側）", test.pValue, ""], ["p（大きい片側）", greater.pValue, ""], ["p（小さい片側）", less.pValue, ""], ["検出力（正規近似）", approximatePower, ""]],
      chart: { type: "test", left: values, right: [hypothesized], leftLabel: "保存標本", rightLabel: "仮説値", unit: dataset.unit, interval: differenceInterval },
      formula: "t=(X̄−μ0)/(s/√n), df=n−1 / approximate power from |d|√n and zα/2",
      insight: customInsight({ headline: test.pValue < 0.05 ? "仮説平均からの差は5%水準で統計的に明瞭です。" : "5%水準では仮説平均との差を棄却できません。", meaning: "p値は帰無仮説の下で今回以上に極端な統計量が出る確率です。効果量dは差を標準偏差単位で表します。", evidence: [["差", test.effect, dataset.unit], ["95%下限", differenceInterval[0], dataset.unit], ["95%上限", differenceInterval[1], dataset.unit], ["p", test.pValue, ""], ["d", effectD, ""]], interpretation: `この保存標本では平均差${format(test.effect)}${dataset.unit}、d=${format(effectD)}です。p値と区間を合わせて読みます。`, limitations: ["p値が大きいことは差がない証明ではありません。", "仮説値は比較条件であり、因果や実質的重要性を自動的に決めません。"], nextActions: ["06 信頼区間", "08 Welch検定"], provenance: dataset.provenance }),
    });
  };

  const analyzeBinomial = (dataset) => {
    const values = valuesFor(dataset);
    const median = descriptive(values)?.median;
    if (!Number.isFinite(median)) return notApplicable("二値化できる観測値がありません。", ["01 要約統計"]);
    const successes = values.filter((value) => value > median).length;
    const test = exactBinomialTest(successes, values.length, 0.5);
    const interval = proportionConfidenceInterval(successes, values.length);
    return customResult({ kind: "test", metrics: [["中央値超", successes, "件"], ["試行", values.length, "件"], ["比率", successes / values.length, ""], ["p", test?.pValue ?? NaN, ""], ["95%下限", interval?.[0] ?? NaN, ""], ["95%上限", interval?.[1] ?? NaN, ""]], chart: { type: "categorical", table: [[successes, values.length - successes]], categoryLevels: ["中央値超", "中央値以下"], groupLevels: [dataset.title] }, formula: "X~Binomial(n,p0), 両側正確確率", insight: customInsight({ headline: `中央値を超える観測は${successes}/${values.length}件です。`, meaning: "正確二項検定は、成功/失敗の回数を仮説比率と直接比較し、小標本でも正規近似を使いません。", evidence: [["成功", successes, "件"], ["n", values.length, "件"], ["p", test?.pValue ?? NaN, ""]], interpretation: `中央値で二値化したため比率は構造上およそ半数になります。ここでは検定計算の成立条件を確認する教材表示です。`, limitations: ["連続量を二値化すると情報が失われます。", "データを見てから閾値を選ぶと検定の解釈が変わります。"], nextActions: ["01 分布全体", "13 ロジスティック回帰"], provenance: dataset.provenance }) });
  };

  const analyzePaired = (dataset) => {
    if (dataset.id !== "jma-co2") return notApplicable("対応あり検定には、同じ年・地点・対象で一対一に対応した2系列が必要です。", ["08 Welch検定", "01 散布図"]);
    const rows = rowsFor(dataset);
    const test = pairedTTest(rows.map((row) => row.x), rows.map((row) => row.paired));
    if (!test) return notApplicable("対応差にばらつきがないか、標本が不足しています。", ["01 要約統計"]);
    return customResult({ kind: "test", metrics: [["共通年", rows.length, "年"], ["綾里−与那国島", test.effect, "ppm"], ["t", test.statistic, ""], ["p", test.pValue, ""]], chart: { type: "test", left: rows.map((row) => row.x), right: rows.map((row) => row.paired), leftLabel: "綾里", rightLabel: "与那国島", unit: "ppm", interval: test.interval }, formula: "di=Xi−Yi, t=d̄/(sd/√n)", insight: customInsight({ headline: `共通${rows.length}年の地点差平均は${format(test.effect)} ppmです。`, meaning: "対応ありt検定は、同じ年の2地点を組にして年ごとの差を評価します。", evidence: [["n", rows.length, "年"], ["平均差", test.effect, "ppm"], ["p", test.pValue, ""]], interpretation: "3観測所には地点差がありますが、共通期間では長期上昇方向が共通しています。", limitations: ["時系列の自己相関があるため、通常の独立差という仮定は厳密には満たしません。", "地点差の原因はこの検定だけでは分かりません。"], nextActions: ["11 時系列回帰", "12 残差診断"], provenance: ["SOURCE"] }) });
  };

  const analyzeMeanTests = (dataset) => {
    const [left, right] = splitValues(valuesFor(dataset));
    const result = analyzeWelch({ left, right, leftLabel: "前半", rightLabel: "後半", unit: dataset.unit, provenance: dataset.provenance, diagnosticOnly: true });
    if (!result.test) return result;
    const leftStats = descriptive(left);
    const rightStats = descriptive(right);
    const df = leftStats.n + rightStats.n - 2;
    const pooledVariance = ((leftStats.n - 1) * leftStats.sampleVariance + (rightStats.n - 1) * rightStats.sampleVariance) / df;
    const pooledSe = Math.sqrt(pooledVariance * (1 / leftStats.n + 1 / rightStats.n));
    const pooledT = (leftStats.mean - rightStats.mean) / pooledSe;
    const pooledP = 2 * (1 - studentTCdf(Math.abs(pooledT), df));
    const zApprox = (leftStats.mean - rightStats.mean) / Math.sqrt(leftStats.populationVariance / leftStats.n + rightStats.populationVariance / rightStats.n);
    const zP = 2 * (1 - normalCdf(Math.abs(zApprox)));
    result.metrics.push(["等分散t", pooledT, ""], ["等分散t p", pooledP, ""], ["z近似", zApprox, ""], ["z近似p", zP, ""]);
    result.insight.meaning += " 等分散tは共通分散を仮定し、Welchは仮定しません。標本が大きい場合のz近似も並べ、仮定による差を確認します。分散のχ²評価は06の分散区間に表示します。";
    result.formula = "pooled t=(X̄1−X̄2)/(sp√(1/n1+1/n2)) / Welch uses separate variances";
    return result;
  };

  const categoricalRows = (dataset) => {
    if (dataset.id === "culture") return [dataset.rows.map((row) => row.category), dataset.rows.map((row) => row.group), "カテゴリ", "地域"];
    if (dataset.id === "pollination") {
      const interactions = dataset.categoricalSets[0];
      return [interactions.map((row) => row.category), interactions.map((row) => row.group), "相互作用", "送粉者"];
    }
    const rows = rowsFor(dataset);
    if (rows.every((row) => Number.isFinite(row.x) && Number.isFinite(row.y))) {
      const mx = descriptive(rows.map((row) => row.x)).median;
      const my = descriptive(rows.map((row) => row.y)).median;
      return [rows.map((row) => row.y > my ? "高" : "低"), rows.map((row) => row.x > mx ? "高" : "低"), dataset.yLabel, dataset.xLabel];
    }
    return [[], [], "カテゴリ", "群"];
  };

  const analyzeFisher = (dataset) => {
    const [categories, groups, categoryLabel, groupLabel] = categoricalRows(dataset);
    const c = [...new Set(categories)]; const g = [...new Set(groups)];
    if (c.length !== 2 || g.length !== 2) return notApplicable(`Fisher正確検定には2×2表が必要です。現在は${g.length}×${c.length}です。`, ["09 クロス集計"]);
    const table = g.map((gv) => c.map((cv) => categories.filter((value, index) => value === cv && groups[index] === gv).length));
    const test = fisherExact(table);
    return customResult({ kind: "categorical", metrics: [["左上", table[0][0], "件"], ["オッズ比", test.oddsRatio, "倍"], ["p", test.pValue, ""]], chart: { type: "categorical", table, categoryLevels: c, groupLevels: g }, formula: "固定周辺度数の超幾何確率を両側合計", insight: customInsight({ headline: test.pValue < 0.05 ? `${categoryLabel}と${groupLabel}に関連が見られます。` : "この2×2表では関連を示す十分な証拠はありません。", meaning: "Fisher正確検定は、期待度数が小さい2×2表でも近似せず組み合わせ確率を計算します。", evidence: [["オッズ比", test.oddsRatio, "倍"], ["p", test.pValue, ""]], interpretation: `保存標本を中央値で2群化した表のオッズ比は${format(test.oddsRatio)}です。`, limitations: ["中央値による群分けは教材用で、連続情報を失います。", "関連があっても因果関係は判断できません。"], nextActions: ["13 ロジスティック回帰", "01 散布図"], provenance: dataset.provenance }) });
  };

  const analyzeCategoricalDataset = (dataset) => {
    if (dataset.id === "pollination") return notApplicable("23相互作用はすべてpollinates、62標本はすべてHUMAN_OBSERVATIONかつ同じ記録方式です。比較カテゴリの変動がないため、独立性検定は成立しません。", ["01 件数を確認する", "比較カテゴリを含むデータを設計する"]);
    const [categories, groups, categoryLabel, groupLabel] = categoricalRows(dataset);
    const result = analyzeCategorical({ categories, groups, categoryLabel, groupLabel, provenance: dataset.provenance });
    if (dataset.id === "culture" && result.metrics) {
      const levels = [...new Set(categories)];
      const observed = levels.map((level) => categories.filter((value) => value === level).length);
      const goodness = chiSquareGoodnessOfFit(observed, observed.map(() => categories.length / levels.length));
      result.metrics.push(["適合度χ²（均等仮説）", goodness.statistic, ""], ["適合度p", goodness.pValue, ""]);
      result.insight.meaning += " 適合度検定はカテゴリ単独の比率が仮定した比率と合うか、独立性検定は2つのカテゴリ変数が関連するかを区別します。";
      result.formula = "χ²=Σ(O−E)²/E / goodness-of-fit and independence table";
    }
    return result;
  };

  const groupsFor = (dataset) => {
    const values = valuesFor(dataset); const size = Math.ceil(values.length / 3);
    return [values.slice(0, size), values.slice(size, size * 2), values.slice(size * 2)].filter((group) => group.length > 1);
  };

  const analyzeBh = (dataset) => {
    const groups = groupsFor(dataset); const tests = [];
    for (let i = 0; i < groups.length; i += 1) for (let j = i + 1; j < groups.length; j += 1) {
      const result = analyzeWelch({ left: groups[i], right: groups[j], leftLabel: `群${i + 1}`, rightLabel: `群${j + 1}`, unit: dataset.unit });
      if (result.test) tests.push({ label: `群${i + 1}–群${j + 1}`, p: result.test.pValue });
    }
    if (!tests.length) return notApplicable("多重比較に必要な群がありません。", ["10 ANOVA"]);
    const adjusted = benjaminiHochberg(tests.map((test) => test.p));
    const metrics = tests.flatMap((test, index) => [[`${test.label} p`, test.p, ""], [`${test.label} BH`, adjusted[index], ""]]);
    return customResult({ metrics, chart: { type: "categorical", table: [tests.map((test) => test.p), adjusted], categoryLevels: tests.map((test) => test.label), groupLevels: ["raw p", "BH"] }, formula: "p(i)×m/i を単調化して偽発見率を制御", insight: customInsight({ headline: `3比較の最小BH補正値は${format(Math.min(...adjusted))}です。`, meaning: "BH補正は複数検定で偶然の小さなp値が増える問題に対し、棄却集合の偽発見率を抑えます。", evidence: [["比較数", tests.length, "本"], ["最小raw p", Math.min(...tests.map((test) => test.p)), ""], ["最小BH", Math.min(...adjusted), ""]], interpretation: "補正後の値を使うと、個別p値だけを並べるより慎重な結論になります。", limitations: ["BH補正は各比較の標本設計や効果量の問題を解決しません。", "事後的な群分けのため探索的表示です。"], nextActions: ["10 ANOVA", "06 差の区間"], provenance: dataset.provenance }) });
  };

  const analyzeAnovaDataset = (dataset) => {
    if (dataset.id !== "renewables") {
      const result = analyzeAnova({ groups: groupsFor(dataset), labels: ["前期", "中期", "後期"], unit: dataset.unit, provenance: dataset.provenance, diagnosticOnly: true });
      if (result.insight) result.insight.limitations.push("2元配置と交互作用には、各観測に2つの要因ラベルが必要です。現在のデータでは1元配置だけを計算しています。");
      return result;
    }
    const rows = rowsFor(dataset).filter((row) => [row.renewablePercent, row.solarKwhM2Day, row.windSpeedMs].every(Number.isFinite));
    const solarMedian = descriptive(rows.map((row) => row.solarKwhM2Day)).median;
    const windMedian = descriptive(rows.map((row) => row.windSpeedMs)).median;
    const encoded = rows.map((row) => ({ ...row, solarGroup: row.solarKwhM2Day > solarMedian ? 1 : 0, windGroup: row.windSpeedMs > windMedian ? 1 : 0 }));
    const response = encoded.map((row) => row.renewablePercent);
    const reduced = ordinaryLeastSquares(encoded.map((row) => [row.solarGroup, row.windGroup]), response);
    const full = ordinaryLeastSquares(encoded.map((row) => [row.solarGroup, row.windGroup, row.solarGroup * row.windGroup]), response);
    if (!reduced || !full || !(full.df > 0)) return notApplicable("2×2の一部セルが空か、特異行列になったため交互作用を推定できません。", ["10 1元配置ANOVA"]);
    const interactionF = Math.max(0, reduced.rss - full.rss) / (full.rss / full.df);
    const interactionP = 1 - fCdf(interactionF, 1, full.df);
    const cellLabels = ["低Solar×低Wind", "低Solar×高Wind", "高Solar×低Wind", "高Solar×高Wind"];
    const groups = [[0, 0], [0, 1], [1, 0], [1, 1]].map(([solarGroup, windGroup]) => encoded.filter((row) => row.solarGroup === solarGroup && row.windGroup === windGroup).map((row) => row.renewablePercent));
    const cellMeans = groups.map((group) => descriptive(group)?.mean ?? NaN);
    return customResult({
      kind: "anova",
      metrics: [["n", rows.length, "か国"], ["完全モデルR²", full.rSquared, ""], ["太陽光主効果係数", full.coefficients[1], "%pt"], ["風速主効果係数", full.coefficients[2], "%pt"], ["交互作用係数", full.coefficients[3], "%pt"], ["交互作用F", interactionF, ""], ["交互作用p", interactionP, ""]],
      chart: { type: "anova", groups, labels: cellLabels, means: cellMeans, unit: "%" },
      formula: "renewable=β0+β1 Solar群+β2 Wind群+β3 Solar群×Wind群 / nested-model F",
      insight: customInsight({
        headline: interactionP < 0.05 ? "太陽光群と風速群の交互作用が見られます。" : "交互作用を示す十分な証拠はありません。",
        meaning: "2元配置ANOVAは2つの要因の主効果と、一方の効果がもう一方の水準で変わる交互作用を分けて評価します。",
        evidence: [["n", rows.length, "か国"], ["交互作用F", interactionF, ""], ["交互作用p", interactionP, ""], ["R²", full.rSquared, ""]],
        interpretation: `中央値で2×2に分けたセル平均は、${cellLabels.map((label, index) => `${label} ${format(cellMeans[index])}%`).join(" / ")}です。全体差だけでは組み合わせの違いを表し切れません。`,
        limitations: ["中央値分割は教材用で、連続量の情報を失います。", "ANOVAだけではどの群同士が異なるか断定せず、追加比較と補正が必要です。", "国別観察標本から因果効果は判断できません。"],
        nextActions: ["10 BH補正", "11 重回帰"], provenance: dataset.provenance,
      }),
    });
  };

  const analyzeRegression = (dataset, detail = "base") => {
    const rows = rowsFor(dataset).filter((row) => Number.isFinite(row.x) && Number.isFinite(row.y));
    if (rows.length < 3) return notApplicable("回帰には2変数の有限な組が3件以上必要です。", ["01 散布図"]);
    const base = analyzeCorrelation({ x: rows.map((row) => row.x), y: rows.map((row) => row.y), xLabel: dataset.xLabel, yLabel: dataset.yLabel, xUnit: dataset.xUnit || "", yUnit: dataset.unit, provenance: dataset.provenance, extraLimitations: detail !== "base" ? ["残差の独立性と等分散性をグラフで追加確認してください。"] : [] });
    if (base.model) {
      const polynomial = ordinaryLeastSquares(rows.map((row) => [row.x, row.x ** 2]), rows.map((row) => row.y));
      base.formula = `ŷ=${format(base.model.coefficients[0])}+${format(base.model.coefficients[1])}x / R²=${format(base.model.rSquared)}`;
      if (polynomial) {
        base.metrics.push(["2次多項式R²", polynomial.rSquared, ""], ["2次項係数", polynomial.coefficients[2], ""]);
        base.insight.interpretation += ` 2次多項式のR²は${format(polynomial.rSquared)}で、直線との差は${format(polynomial.rSquared - base.model.rSquared)}です。`;
      }
      if (detail !== "base") {
        const residualStats = descriptive(base.model.residuals);
        base.metrics.push(["傾きt", base.model.tStatistics[1], ""], ["傾きp", base.model.pValues[1], ""], ["モデルF", base.model.fStatistic, ""], ["モデルF p", base.model.fPValue, ""], ["残差SD", residualStats.sampleSd, dataset.unit], ["最大絶対残差", Math.max(...base.model.residuals.map(Math.abs)), dataset.unit]);
        base.insight.meaning = "R²は期間内変動をモデルが説明する割合、残差は観測値と予測値のずれです。モデルFと係数tは、説明された変動が誤差に比べて大きいかを評価します。";
        base.insight.nextActions = ["12 予測区間", "04 残差分布"];
        if (detail === "prediction") {
          const xs = rows.map((row) => row.x);
          const xMean = descriptive(xs).mean;
          const predicted = base.model.coefficients[0] + base.model.coefficients[1] * xMean;
          const residualSe = Math.sqrt(base.model.rss / base.model.df);
          const critical = studentTQuantile(0.975, base.model.df);
          const sxx = xs.reduce((sum, value) => sum + (value - xMean) ** 2, 0);
          const predictionMargin = critical * residualSe * Math.sqrt(1 + 1 / xs.length + ((xMean - xMean) ** 2) / sxx);
          base.metrics.push(["平均xでの予測", predicted, dataset.unit], ["95%予測下限", predicted - predictionMargin, dataset.unit], ["95%予測上限", predicted + predictionMargin, dataset.unit]);
          base.insight.meaning += " 予測区間は平均応答だけでなく、新しい1観測のばらつきも含みます。";
          base.insight.interpretation += ` 説明変数が標本平均のときの予測は${format(predicted)}${dataset.unit}、95%予測区間は${format(predicted - predictionMargin)}〜${format(predicted + predictionMargin)}${dataset.unit}です。`;
          base.insight.limitations.push("予測区間は線形性、独立性、等分散性、残差正規性を仮定し、標本範囲外への外挿には使いません。");
          base.formula += " / prediction: ŷ±t×s√(1+1/n+(x0−x̄)²/Sxx)";
        }
      }
    }
    return base;
  };

  const analyzeMultiple = (dataset, prediction = false) => {
    if (dataset.id !== "renewables") return notApplicable("重回帰には同じ対象で揃った複数の説明変数が必要です。再生可能エネルギーデータで利用できます。", ["11 単回帰"]);
    const rows = rowsFor(dataset).filter((row) => [row.renewablePercent, row.solarKwhM2Day, row.windSpeedMs, row.precipitationMmDay].every(Number.isFinite));
    const y = rows.map((row) => row.renewablePercent);
    const x = rows.map((row) => [row.solarKwhM2Day, row.windSpeedMs, row.precipitationMmDay]);
    const model = ordinaryLeastSquares(x, y);
    if (!model) return notApplicable("説明変数の特異行列により重回帰を推定できません。", ["01 相関", "12 多重共線性"]);
    const correlationSolar = pearson(rows.map((row) => row.solarKwhM2Day), y);
    const correlationWind = pearson(rows.map((row) => row.windSpeedMs), y);
    const predictors = [
      rows.map((row) => row.solarKwhM2Day),
      rows.map((row) => row.windSpeedMs),
      rows.map((row) => row.precipitationMmDay),
    ];
    const vifs = predictors.map((response, targetIndex) => {
      const design = rows.map((_, rowIndex) => predictors.filter((__, index) => index !== targetIndex).map((values) => values[rowIndex]));
      const auxiliary = ordinaryLeastSquares(design, response);
      return auxiliary && auxiliary.rSquared < 1 ? 1 / (1 - auxiliary.rSquared) : Infinity;
    });
    const metrics = [["n", model.n, "か国"], ["R²", model.rSquared, ""], ["調整済みR²", model.adjustedRSquared, ""], ["モデルF", model.fStatistic, ""], ["モデルF p", model.fPValue, ""], ["太陽光係数", model.coefficients[1], ""], ["風速係数", model.coefficients[2], ""], ["降水係数", model.coefficients[3], ""], ["太陽光 VIF", vifs[0], ""], ["風速 VIF", vifs[1], ""], ["降水 VIF", vifs[2], ""], ["太陽光 単相関", correlationSolar?.r ?? NaN, ""], ["風速 単相関", correlationWind?.r ?? NaN, ""]];
    if (prediction) {
      const means = predictors.map((values) => descriptive(values).mean);
      const predicted = model.coefficients[0] + means.reduce((sum, value, index) => sum + value * model.coefficients[index + 1], 0);
      const residualSe = Math.sqrt(model.rss / model.df);
      const margin = studentTQuantile(0.975, model.df) * residualSe * Math.sqrt(1 + 1 / rows.length);
      metrics.push(["平均条件での予測", predicted, "%"], ["95%予測下限", predicted - margin, "%"], ["95%予測上限", predicted + margin, "%"]);
    }
    return customResult({ kind: "regression", metrics, chart: { type: "scatter", pairs: rows.map((row) => ({ x: row.solarKwhM2Day, y: row.renewablePercent })), line: simpleRegression(rows.map((row) => row.solarKwhM2Day), y), xLabel: "太陽光", yLabel: "再生可能比率", unit: "%" }, formula: "y=β0+β1 solar+β2 wind+β3 rain+ε / β=(X'X)^−1X'y / VIF=1/(1−Rj²)", insight: customInsight({ headline: `3変数の重回帰R²は${format(model.rSquared)}、調整済みR²は${format(model.adjustedRSquared)}です。`, meaning: prediction ? "予測区間は係数推定と新しい観測の両方の不確実性を含みます。多重共線性は説明変数同士が似た情報を持つ状態で、VIFで確認します。" : "重回帰係数は、他の説明変数を一定としたときの1単位当たりの平均変化を表します。", evidence: [["n", model.n, "か国"], ["R²", model.rSquared, ""], ["最大VIF", Math.max(...vifs), ""], ["太陽光単相関", correlationSolar?.r ?? NaN, ""], ["風速単相関", correlationWind?.r ?? NaN, ""]], interpretation: `この保存標本では再生可能比率と太陽光の単相関は${format(correlationSolar?.r)}、風速とは${format(correlationWind?.r)}です。自然条件が高いほど導入率が高いとは限りません。最大VIFは${format(Math.max(...vifs))}です。`, limitations: ["係数は政策・経済・送電網など未収録要因の影響を受けます。", "31か国の観察標本から因果効果は判断できません。", prediction ? "標本範囲外への外挿は行いません。" : "係数の安定性には残差と共線性の追加診断が必要です。"], nextActions: prediction ? ["12 残差診断", "15 総合演習"] : ["12 R²・残差", "01 説明変数間相関"], provenance: ["SOURCE"] }) });
  };

  const analyzeLogisticDataset = (dataset) => {
    if (dataset.id === "pollination") return notApplicable("23相互作用はすべてpollinates、62標本はすべて同じ記録方式です。目的変数に0と1の両方がないためロジスティック回帰は成立しません。", ["01 件数を確認する", "比較カテゴリを含むデータを設計する"]);
    const rows = rowsFor(dataset).filter((row) => Number.isFinite(row.x) && Number.isFinite(row.y));
    if (rows.length < 8) return notApplicable("二値目的変数へ結びつく説明変数が不足しています。", ["09 クロス集計"]);
    const threshold = descriptive(rows.map((row) => row.y)).median;
    return analyzeLogistic({ x: rows.map((row) => row.x), y: rows.map((row) => row.y > threshold ? 1 : 0), xLabel: dataset.xLabel, outcomeLabel: `${dataset.yLabel}が中央値超`, provenance: dataset.provenance, extraLimitations: ["中央値での二値化は教材用で、元の連続情報を失います。"] });
  };

  const analyzeBayesDataset = (dataset, mcmc = false) => {
    const values = valuesFor(dataset); const threshold = descriptive(values)?.median;
    if (!Number.isFinite(threshold)) return notApplicable("成功/失敗へ整理できる標本がありません。", ["01 要約統計"]);
    const successes = values.filter((value) => value > threshold).length;
    const result = analyzeBayes({ successes, trials: values.length, successLabel: "中央値を超える割合", provenance: dataset.provenance, extraLimitations: ["連続値を中央値で二値化した教材用更新です。"] });
    if (mcmc && result.model) {
      const diagnostics = deterministicMcmc(result.model.posteriorAlpha, result.model.posteriorBeta, 4, 900);
      result.metrics.push(["R-hat", diagnostics.rHat, ""], ["有効標本数（概算）", diagnostics.ess, "件"]);
      result.insight.headline = diagnostics.rHat <= 1.05 ? `4チェーンのR-hatは${format(diagnostics.rHat)}で、収束は概ね安定しています。` : `R-hat=${format(diagnostics.rHat)}のため数値的結論を保留します。`;
      result.insight.meaning = "MCMCは事後分布から相関した標本列を生成します。R-hatは複数チェーン間とチェーン内のばらつきを比べ、1に近いほど混ざりが良いことを示します。";
      result.insight.interpretation = `固定seedの4チェーン×${diagnostics.draws}反復でR-hat=${format(diagnostics.rHat)}、有効標本数は概算${format(diagnostics.ess, 0)}です。`;
      result.insight.limitations.unshift(diagnostics.rHat <= 1.05 ? "R-hatが良好でもモデル仮定が正しいとは限りません。" : "未収束時はHDIや事後平均を結論として使用しません。");
      result.formula = "Metropolis–Hastings / 4 chains / fixed seed / R-hat=√(V̂/W)";
    }
    return result;
  };

  const deterministicMcmc = (alpha, beta, chains = 4, draws = 900) => {
    let seed = 0x6a09e667;
    const random = () => { seed = (1664525 * seed + 1013904223) >>> 0; return (seed + 0.5) / 4294967296; };
    const logTarget = (x) => x <= 0 || x >= 1 ? -Infinity : (alpha - 1) * Math.log(x) + (beta - 1) * Math.log(1 - x);
    const all = [];
    for (let c = 0; c < chains; c += 1) {
      let x = (alpha + c + 1) / (alpha + beta + chains + 1); let log = logTarget(x); const chain = [];
      for (let i = 0; i < draws + 200; i += 1) {
        const proposal = Math.max(0.0001, Math.min(0.9999, x + (random() - 0.5) * 0.16)); const candidate = logTarget(proposal);
        if (Math.log(random()) < candidate - log) { x = proposal; log = candidate; }
        if (i >= 200) chain.push(x);
      }
      all.push(chain);
    }
    const means = all.map((chain) => chain.reduce((sum, value) => sum + value, 0) / chain.length);
    const variances = all.map((chain, index) => chain.reduce((sum, value) => sum + (value - means[index]) ** 2, 0) / (chain.length - 1));
    const meanOfMeans = means.reduce((sum, value) => sum + value, 0) / chains;
    const between = draws * means.reduce((sum, value) => sum + (value - meanOfMeans) ** 2, 0) / (chains - 1);
    const within = variances.reduce((sum, value) => sum + value, 0) / chains;
    const varianceHat = ((draws - 1) / draws) * within + between / draws;
    const rHat = Math.sqrt(varianceHat / within);
    let rho1 = 0;
    all.forEach((chain, ci) => { for (let i = 1; i < chain.length; i += 1) rho1 += (chain[i] - means[ci]) * (chain[i - 1] - means[ci]); });
    rho1 /= Math.max(1e-12, chains * (draws - 1) * within);
    return { rHat, ess: Math.min(chains * draws, chains * draws * (1 - rho1) / (1 + rho1)), draws };
  };

  const applyMcmcDiagnostics = (result, diagnostics) => {
    result.metrics.push(["R-hat", diagnostics.rHat, ""], ["有効標本数（概算）", diagnostics.ess, "件"]);
    result.insight.headline = diagnostics.rHat <= 1.05 ? `4チェーンのR-hatは${format(diagnostics.rHat)}で、収束は概ね安定しています。` : `R-hat=${format(diagnostics.rHat)}のため数値的結論を保留します。`;
    result.insight.meaning = "MCMCは事後分布から相関した標本列を生成します。R-hatは複数チェーン間とチェーン内のばらつきを比べ、1に近いほど混ざりが良いことを示します。";
    result.insight.interpretation = `固定seedの4チェーン×${diagnostics.draws}反復でR-hat=${format(diagnostics.rHat)}、有効標本数は概算${format(diagnostics.ess, 0)}です。`;
    result.insight.limitations.unshift(diagnostics.rHat <= 1.05 ? "R-hatが良好でもモデル仮定が正しいとは限りません。" : "未収束時はHDIや事後平均を結論として使用しません。");
    result.formula = "Metropolis–Hastings / Web Worker / 4 chains / fixed seed / R-hat=√(V̂/W)";
    return result;
  };

  const analyzeMcmcDataset = async (dataset) => {
    const result = analyzeBayesDataset(dataset, false);
    if (!result.model) return result;
    const diagnostics = await new Promise((resolve) => {
      if (typeof Worker !== "function") {
        resolve(deterministicMcmc(result.model.posteriorAlpha, result.model.posteriorBeta, 4, 900));
        return;
      }
      const worker = new Worker(new URL("./statistics-lab-worker.js", import.meta.url), { type: "module" });
      const timeout = window.setTimeout(() => {
        worker.terminate();
        resolve(deterministicMcmc(result.model.posteriorAlpha, result.model.posteriorBeta, 4, 900));
      }, 8_000);
      worker.addEventListener("message", (event) => {
        window.clearTimeout(timeout);
        worker.terminate();
        resolve(event.data);
      }, { once: true });
      worker.addEventListener("error", () => {
        window.clearTimeout(timeout);
        worker.terminate();
        resolve(deterministicMcmc(result.model.posteriorAlpha, result.model.posteriorBeta, 4, 900));
      }, { once: true });
      worker.postMessage({ kind: "mcmc", alpha: result.model.posteriorAlpha, beta: result.model.posteriorBeta, chains: 4, draws: 900 });
    });
    return applyMcmcDiagnostics(result, diagnostics);
  };

  const analyzeExercise = (dataset) => {
    let base;
    if (dataset.rows.some((row) => Number.isFinite(row.x) && Number.isFinite(row.y))) base = analyzeRegression(dataset);
    else if (dataset.id === "culture" || dataset.id === "pollination") {
      const [categories, groups, categoryLabel, groupLabel] = categoricalRows(dataset);
      base = analyzeCategorical({ categories, groups, categoryLabel, groupLabel, provenance: dataset.provenance });
    } else base = analyzeSummary({ values: valuesFor(dataset), label: dataset.title, unit: dataset.unit, provenance: dataset.provenance });
    base.insight.meaning = `総合演習は①問いを定める、②SOURCE/補完を分ける、③図にする、④推定する、⑤限界を読む、⑥次の分析を選ぶ、の6段階です。 ${base.insight.meaning}`;
    base.insight.nextActions = ["01 要約統計へ戻る", "データ区分を切り替えて再計算する", ...(base.insight.nextActions || []).slice(0, 2)];
    base.formula = `6 STEPS / QUESTION → PROVENANCE → VISUAL → ESTIMATE → LIMIT → NEXT / ${base.formula || "保存標本から再計算"}`;
    return base;
  };

  const runAnalysis = (methodId, sourceDataset) => {
    const dataset = {
      ...sourceDataset,
      provenance: state.includeDerived ? sourceDataset.provenance : ["SOURCE"],
    };
    const rows = rowsFor(dataset);
    const values = valuesFor(dataset);
    const pairRows = rows.filter((row) => Number.isFinite(row.x) && Number.isFinite(row.y));
    switch (methodId) {
      case "summary": return analyzeSummary({ values, label: dataset.title, unit: dataset.unit, provenance: dataset.provenance });
      case "scatter": return pairRows.length >= 3 ? analyzeCorrelation({ x: pairRows.map((row) => row.x), y: pairRows.map((row) => row.y), xLabel: dataset.xLabel, yLabel: dataset.yLabel, xUnit: dataset.xUnit || "", yUnit: dataset.unit, provenance: dataset.provenance }) : notApplicable("2変数の対応した有限値が3組以上必要です。", ["01 要約統計"]);
      case "moments": return analyzeMoments(dataset);
      case "discrete": return analyzeDiscrete(dataset);
      case "continuous": return analyzeContinuous(dataset);
      case "sampling": return analyzeSampling({ values, label: dataset.title, unit: dataset.unit, provenance: dataset.provenance, sampleSize: Math.min(8, Math.max(2, Math.floor(values.length / 4))) });
      case "unbiased": return analyzeUnbiased(dataset);
      case "interval": return analyzeIntervals(dataset);
      case "difference-ci": return analyzeDifference(dataset);
      case "hypothesis": return analyzeHypothesis(dataset);
      case "binomial": return analyzeBinomial(dataset);
      case "welch": return analyzeMeanTests(dataset);
      case "paired": return analyzePaired(dataset);
      case "categorical": return analyzeCategoricalDataset(dataset);
      case "fisher": return analyzeFisher(dataset);
      case "anova": return analyzeAnovaDataset(dataset);
      case "bh": return analyzeBh(dataset);
      case "regression": return analyzeRegression(dataset);
      case "multiple": return analyzeMultiple(dataset);
      case "diagnostics": return analyzeRegression(dataset, "diagnostics");
      case "prediction": return dataset.id === "renewables" ? analyzeMultiple(dataset, true) : analyzeRegression(dataset, "prediction");
      case "logistic": return analyzeLogisticDataset(dataset);
      case "bayes": return analyzeBayesDataset(dataset);
      case "mcmc": return analyzeMcmcDataset(dataset);
      case "exercise": return analyzeExercise(dataset);
      default: return notApplicable("選択した分析を実行できません。", ["01 要約統計"]);
    }
  };

  const metricText = ([label, value, unit]) => `${label}: ${format(value)}${unit || ""}`;
  const renderMetrics = (result, dataset) => {
    ui.metrics.replaceChildren();
    (result.metrics || []).forEach((metric) => {
      const tr = document.createElement("tr");
      const th = document.createElement("th"); th.scope = "row"; th.textContent = metric[0];
      const td = document.createElement("td");
      const button = document.createElement("button"); button.type = "button"; button.className = "gaia-statistics-evidence-button"; button.textContent = `${format(metric[1])}${metric[2] || ""}`; button.title = `${rowsFor(dataset).length}行を使用。クリックで計算根拠を開きます。`;
      button.addEventListener("click", () => { const details = button.closest("details"); details.open = true; ui.formula.focus?.(); });
      td.append(button);
      tr.append(th, td); ui.metrics.append(tr);
    });
    const count = rowsFor(dataset).length;
    ui.formula.textContent = `使用: ${count} / ${dataset.rows.length}　計算: ${result.formula || "表示中の有限値からブラウザ内で再計算"}`;
    ui.formula.tabIndex = -1;
  };

  const recordValuesFor = (row, dataset, categorical) => ({
    label: row.label || row.name || String(row.id ?? ""),
    x: categorical ? (row.category ?? "") : (Number.isFinite(row.x) ? row.x : (row.index ?? row.category ?? "")),
    y: categorical ? (row.group ?? "") : (Number.isFinite(row.y) ? row.y : (Number.isFinite(row.value) ? row.value : (row.group ?? ""))),
    provenance: row.provenance || "UNKNOWN",
  });

  const compareRecordValues = (left, right) => {
    if (typeof left === "number" && Number.isFinite(left) && typeof right === "number" && Number.isFinite(right)) return left - right;
    if (left === "" || left === null || left === undefined) return right === "" || right === null || right === undefined ? 0 : 1;
    if (right === "" || right === null || right === undefined) return -1;
    return String(left).localeCompare(String(right), "ja-JP", { numeric: true, sensitivity: "base" });
  };

  const updateRecordSortHeaders = () => {
    ui.recordSortHeaders.forEach((header) => {
      const active = header.dataset.recordSort === state.recordSortKey;
      header.setAttribute("aria-sort", active ? state.recordSortDirection : "none");
      const button = header.querySelector("button");
      const indicator = header.querySelector("i");
      const label = header.querySelector("span")?.textContent || "列";
      if (indicator) indicator.textContent = active ? (state.recordSortDirection === "ascending" ? "↑" : "↓") : "↕";
      if (button) button.setAttribute("aria-label", active
        ? `${label}を${state.recordSortDirection === "ascending" ? "降順" : "昇順"}に並べ替える`
        : `${label}を昇順に並べ替える`);
    });
  };

  const renderRecords = (dataset) => {
    const rows = rowsFor(dataset);
    const categorical = rows.some((row) => row.category !== undefined || row.group !== undefined) && !rows.some((row) => Number.isFinite(row.x) && Number.isFinite(row.y));
    const displayRows = rows.map((row, sourceIndex) => ({ row, sourceIndex, values: recordValuesFor(row, dataset, categorical) }));
    if (state.recordSortKey) {
      const factor = state.recordSortDirection === "descending" ? -1 : 1;
      displayRows.sort((left, right) => factor * compareRecordValues(left.values[state.recordSortKey], right.values[state.recordSortKey]) || left.sourceIndex - right.sourceIndex);
    }
    ui.recordCount.textContent = `${rows.length} ROWS`;
    ui.recordXHeading.textContent = categorical ? "カテゴリ" : (dataset.xLabel || "説明変数");
    ui.recordYHeading.textContent = categorical ? "グループ" : (dataset.yLabel || `値${dataset.unit ? ` (${dataset.unit})` : ""}`);
    updateRecordSortHeaders();
    ui.recordsBody.replaceChildren();
    displayRows.forEach(({ row, sourceIndex: index, values }) => {
      const tr = document.createElement("tr");
      tr.dataset.recordId = String(row.id ?? index);
      tr.tabIndex = -1;
      if (tr.dataset.recordId === state.selectedRecordId) tr.dataset.selected = "true";
      const record = document.createElement("th"); record.scope = "row";
      const label = document.createElement("strong"); label.textContent = values.label || String(row.id ?? index + 1);
      const id = document.createElement("small"); id.textContent = String(row.id ?? index + 1);
      record.append(label, id);
      const x = document.createElement("td");
      const xValue = values.x === "" ? "—" : values.x;
      x.textContent = typeof xValue === "number" ? format(xValue) : String(xValue);
      const y = document.createElement("td");
      const yValue = values.y === "" ? "—" : values.y;
      y.textContent = typeof yValue === "number" ? `${format(yValue)}${dataset.unit || ""}` : String(yValue);
      const provenance = document.createElement("td");
      const badge = document.createElement("span"); badge.textContent = values.provenance; badge.dataset.provenance = values.provenance;
      provenance.append(badge);
      tr.append(record, x, y, provenance);
      ui.recordsBody.append(tr);
    });
  };

  const sortRecords = (key) => {
    if (!["label", "x", "y", "provenance"].includes(key)) return false;
    if (state.recordSortKey === key) state.recordSortDirection = state.recordSortDirection === "ascending" ? "descending" : "ascending";
    else { state.recordSortKey = key; state.recordSortDirection = "ascending"; }
    renderRecords(currentDataset());
    window.dispatchEvent(new CustomEvent("gaia:statistics-record-sort", { detail: { key: state.recordSortKey, direction: state.recordSortDirection } }));
    return true;
  };

  const createInsightCard = (kind, index, title, headline, body, items = []) => {
    const article = document.createElement("article"); article.className = "gaia-statistics-insight"; article.dataset.kind = kind;
    const kicker = document.createElement("p"); kicker.textContent = `${String(index).padStart(2, "0")} / ${title}`;
    const heading = document.createElement("h4"); heading.textContent = headline;
    article.append(kicker, heading);
    if (body) { const paragraph = document.createElement("p"); paragraph.textContent = body; article.append(paragraph); }
    if (items.length) { const list = document.createElement("ul"); items.forEach((item) => { const li = document.createElement("li"); li.textContent = item; list.append(li); }); article.append(list); }
    return article;
  };

  const renderInsights = (result) => {
    const insight = result.insight;
    ui.insights.replaceChildren();
    if (!insight) return;
    const meaning = createInsightCard("meaning", 1, "この図が示すこと", insight.headline || "分析結果", insight.meaning || "");
    if (insight.evidence?.length) {
      const evidence = document.createElement("div"); evidence.className = "gaia-statistics-evidence"; evidence.setAttribute("aria-label", "計算根拠を開く数値");
      insight.evidence.forEach((metric) => {
        const button = document.createElement("button"); button.type = "button"; button.className = "gaia-statistics-evidence-button"; button.textContent = metricText(metric);
        button.addEventListener("click", () => { const details = q(".gaia-statistics-values"); details.open = true; details.scrollIntoView({ block: "nearest", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" }); ui.formula.focus(); });
        evidence.append(button);
      });
      meaning.append(evidence);
    }
    ui.insights.append(
      meaning,
      createInsightCard("interpretation", 2, "データから見えたこと", insight.interpretation || "この保存標本から読み取れる傾向を表示します。", ""),
      createInsightCard("limitations", 3, "注意して読むこと", "ここからは言えないこと", "", insight.limitations || ["標本設計とモデル仮定を確認してください。"]),
    );
    const next = createInsightCard("next", 4, "次に確かめる", "関連する分析へ進む", "");
    (insight.nextActions || ["01 要約統計"]).forEach((action) => {
      const button = document.createElement("button"); button.type = "button"; button.className = "gaia-statistics-next-button"; button.textContent = `→ ${action}`;
      button.addEventListener("click", () => selectAction(action)); next.append(button);
    });
    ui.insights.append(next);
  };

  const selectAction = (action) => {
    const lecture = METHOD_GROUPS.find((group) => action.includes(group.id));
    if (lecture) selectLecture(lecture.id);
  };

  const chartPoints = (result, dataset) => {
    const chart = result.chart || {}; const points = [];
    const add = (id, x, y, group = 0, label = "", row = {}) => {
      if (Number.isFinite(x) && Number.isFinite(y)) {
        points.push({ id: String(id), recordId: row.id === null || row.id === undefined ? "" : String(row.id), x, y, group, label, provenance: row.provenance, value: row.value });
      }
    };
    if (["scatter", "logistic"].includes(chart.type)) {
      const pairedRows = rowsFor(dataset).filter((row) => Number.isFinite(row.x) && Number.isFinite(row.y));
      (chart.pairs || []).forEach((point, index) => {
        const row = pairedRows[index] || {};
        add(row.id || index, point.x ?? point[0], point.y ?? point[1], 0, row.label, row);
      });
    }
    else if (["histogram", "distribution"].includes(chart.type)) {
      const bins = chart.bins || [];
      const stacks = new Map();
      const numericRows = rowsFor(dataset).filter((row) => Number.isFinite(row.value));
      (chart.values || result.stats?.values || valuesFor(dataset)).forEach((value, index) => {
        const binIndex = Math.max(0, bins.findIndex((bin, candidateIndex) => value >= bin.x0 && (value < bin.x1 || candidateIndex === bins.length - 1)));
        const rank = (stacks.get(binIndex) || 0) + 1;
        stacks.set(binIndex, rank);
        const row = numericRows[index] || {};
        add(row.id || index, value, rank, 0, row.label, row);
      });
    }
    else if (chart.type === "sampling") (chart.sampleMeans || chart.bins || []).forEach((value, index) => add(index, value.center ?? ((value.x0 + value.x1) / 2), value.count ?? index % 8));
    else if (chart.type === "test") { (chart.left || []).forEach((value, index) => add(`l${index}`, value, index % 7, 0)); (chart.right || []).forEach((value, index) => add(`r${index}`, value, index % 7, 1)); }
    else if (chart.type === "anova") (chart.groups || []).forEach((group, gi) => group.forEach((value, index) => add(`${gi}-${index}`, gi, value, gi)));
    else if (chart.type === "categorical") (chart.table || []).forEach((row, ri) => row.forEach((value, ci) => add(`${ri}-${ci}`, ci, value, ri)));
    else if (chart.type === "bayes") (chart.curve || []).forEach((point, index) => add(index, point[0] ?? point.x, point[1] ?? point.y));
    else if (chart.type === "discrete") (chart.observed || []).forEach((value, index) => add(`o${index}`, index, value, 0));
    else (result.metrics || []).forEach((metric, index) => { if (Number.isFinite(metric[1])) add(index, index, metric[1], 0, metric[0]); });
    return points;
  };

  const hideChartTooltip = () => {
    ui.tooltip.hidden = true;
    state.chartActiveTarget = null;
    ui.canvas.setAttribute("aria-describedby", "gaia-statistics-chart-help");
  };

  const showChartTooltip = (target) => {
    const meta = state.chartMeta;
    if (!target || !meta) return hideChartTooltip();
    const { chart, dataset, width } = meta;
    const title = document.createElement("strong");
    title.textContent = target.label || "観測値";
    const values = document.createElement("span");
    if (["histogram", "distribution", "sampling"].includes(chart.type)) {
      values.textContent = `${dataset.yLabel || "観測値"}: ${format(target.x, 2)}${chart.unit || dataset.unit || ""}`;
    } else {
      values.textContent = `${chart.xLabel || dataset.xLabel || "X"}: ${format(target.x, 2)}${chart.xUnit || dataset.xUnit || ""} / ${chart.yLabel || dataset.yLabel || "Y"}: ${format(target.y, 2)}${chart.yUnit || dataset.unit || ""}`;
    }
    const provenance = document.createElement("small");
    provenance.textContent = target.provenance || (state.includeDerived ? "SOURCE / DERIVED" : "SOURCE");
    ui.tooltip.replaceChildren(title, values, provenance);
    ui.tooltip.style.left = `${target.sx}px`;
    ui.tooltip.style.top = `${target.sy}px`;
    ui.tooltip.dataset.side = target.sx > width * 0.62 ? "left" : "right";
    ui.tooltip.hidden = false;
    state.chartActiveTarget = target;
    ui.tooltip.id ||= "gaia-statistics-chart-tooltip";
    ui.canvas.setAttribute("aria-describedby", `gaia-statistics-chart-help ${ui.tooltip.id}`);
  };

  const showChartTargetByIndex = (requestedIndex) => {
    if (!state.chartTargets.length) return hideChartTooltip();
    const index = Math.max(0, Math.min(state.chartTargets.length - 1, requestedIndex));
    state.chartKeyboardIndex = index;
    ui.canvas.dataset.keyboardIndex = String(index);
    showChartTooltip(state.chartTargets[index]);
  };

  const updateChartTooltipFromKeyboard = (event) => {
    if (!state.chartTargets.length) return;
    if (event.key === "Enter" || event.key === " ") {
      if (!state.chartActiveTarget?.recordId) return;
      event.preventDefault();
      drillToRecord(state.chartActiveTarget);
      return;
    }
    const keys = ["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp", "Home", "End"];
    if (!keys.includes(event.key)) return;
    event.preventDefault();
    const current = state.chartKeyboardIndex < 0 ? 0 : state.chartKeyboardIndex;
    if (event.key === "Home") showChartTargetByIndex(0);
    else if (event.key === "End") showChartTargetByIndex(state.chartTargets.length - 1);
    else if (event.key === "ArrowRight" || event.key === "ArrowDown") showChartTargetByIndex(Math.min(state.chartTargets.length - 1, current + 1));
    else showChartTargetByIndex(Math.max(0, current - 1));
  };

  const updateChartTooltipFromPointer = (event) => {
    if (!state.chartTargets.length || !state.chartMeta) return hideChartTooltip();
    const rect = ui.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const { pad, width, height } = state.chartMeta;
    if (x < pad.left || x > width - pad.right || y < pad.top || y > height - pad.bottom) return hideChartTooltip();
    let nearest = null;
    let nearestDistance = Number.POSITIVE_INFINITY;
    state.chartTargets.forEach((target) => {
      const distance = Math.hypot(target.sx - x, target.sy - y);
      if (distance < nearestDistance) { nearest = target; nearestDistance = distance; }
    });
    const limit = event.pointerType === "touch" ? 42 : 28;
    showChartTooltip(nearestDistance <= limit ? nearest : null);
  };

  const drillToRecord = (target) => {
    const recordId = String(target?.recordId || "");
    if (!recordId) return false;
    const row = [...ui.recordsBody.querySelectorAll("tr")].find((candidate) => candidate.dataset.recordId === recordId);
    if (!row) return false;
    state.selectedRecordId = recordId;
    ui.recordsBody.querySelectorAll("tr[data-selected]").forEach((candidate) => delete candidate.dataset.selected);
    row.dataset.selected = "true";
    ui.recordDetails.open = true;
    const label = row.querySelector("th strong")?.textContent || target.label || recordId;
    ui.recordDrillStatus.textContent = `${label}の監査レコードを表示しました。`;
    requestAnimationFrame(() => {
      row.scrollIntoView({ block: "center", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
      row.focus({ preventScroll: true });
    });
    window.dispatchEvent(new CustomEvent("gaia:statistics-record-drill", { detail: { recordId, label } }));
    return true;
  };

  const drawChart = (result, dataset) => {
    const canvas = ui.canvas; const rect = ui.visual.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    hideChartTooltip();
    state.chartKeyboardIndex = -1;
    delete ui.canvas.dataset.keyboardIndex;
    const ratio = Math.min(2, window.devicePixelRatio || 1);
    const pixelWidth = Math.round(rect.width * ratio);
    const pixelHeight = Math.round(rect.height * ratio);
    if (canvas.width !== pixelWidth) canvas.width = pixelWidth;
    if (canvas.height !== pixelHeight) canvas.height = pixelHeight;
    const ctx = canvas.getContext("2d"); ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    const width = rect.width; const height = rect.height; const pad = { left: width < 560 ? 53 : 66, right: 28, top: 38, bottom: 55 };
    const chart = result.chart || {};
    const points = chartPoints(result, dataset);
    ui.canvas.setAttribute("aria-label", `${dataset.title}の${METHOD_LOOKUP.get(state.methodId)?.label || "統計解析"}。${points.length}点。矢印キーでデータ点を確認し、Enterキーで監査レコードを開けます。`);
    const xs = points.map((point) => point.x); const ys = points.map((point) => point.y);
    let minX = xs.length ? Math.min(...xs) : 0;
    let maxX = xs.length ? Math.max(...xs) : 1;
    let minY = ys.length ? Math.min(...ys) : 0;
    let maxY = ys.length ? Math.max(...ys) : 1;
    const frequencyChart = ["histogram", "distribution", "sampling", "discrete", "categorical"].includes(chart.type);
    if (chart.bins?.length) {
      minX = Math.min(...chart.bins.map((bin) => bin.x0));
      maxX = Math.max(...chart.bins.map((bin) => bin.x1));
      minY = 0;
      maxY = Math.max(maxY, ...chart.bins.map((bin) => bin.count));
    }
    if (minX === maxX) { minX -= 1; maxX += 1; } if (minY === maxY) { minY -= 1; maxY += 1; }
    const xMargin = (maxX - minX) * 0.035;
    minX -= xMargin; maxX += xMargin;
    if (frequencyChart) minY = 0;
    else {
      const yMargin = (maxY - minY) * 0.08;
      minY -= yMargin; maxY += yMargin;
    }
    maxY += Math.max(0.5, (maxY - minY) * 0.08);
    const xScale = (value) => pad.left + (value - minX) / (maxX - minX) * (width - pad.left - pad.right);
    const yScale = (value) => height - pad.bottom - (value - minY) / (maxY - minY) * (height - pad.top - pad.bottom);
    const targets = new Map(points.map((point) => [point.id, { ...point, sx: xScale(point.x), sy: yScale(point.y) }]));
    const starts = new Map(); targets.forEach((target, id) => starts.set(id, state.points.get(id) || { sx: width * 0.5, sy: height * 0.5, group: target.group }));
    state.chartMeta = { chart, dataset, width, height, pad };
    cancelAnimationFrame(state.animation); const start = performance.now(); const duration = matchMedia("(prefers-reduced-motion: reduce)").matches ? 1 : 560;
    const paint = (now) => {
      const t = Math.min(1, (now - start) / duration); const eased = 1 - (1 - t) ** 3;
      ctx.clearRect(0, 0, width, height);
      ctx.strokeStyle = "rgba(125,211,255,.12)"; ctx.lineWidth = 1;
      const tickCount = width < 560 ? 4 : 5;
      ctx.font = `${width < 560 ? 8 : 9}px Consolas`;
      ctx.fillStyle = "rgba(218,243,255,.54)";
      for (let i = 0; i <= tickCount; i += 1) {
        const ratio = i / tickCount;
        const x = pad.left + ratio * (width - pad.left - pad.right);
        const y = pad.top + ratio * (height - pad.top - pad.bottom);
        ctx.strokeStyle = "rgba(125,211,255,.12)";
        ctx.beginPath(); ctx.moveTo(x, pad.top); ctx.lineTo(x, height - pad.bottom); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(width - pad.right, y); ctx.stroke();
        const xValue = minX + ratio * (maxX - minX);
        const yValue = maxY - ratio * (maxY - minY);
        ctx.textAlign = "center";
        ctx.fillText(dataset.xKind === "month" && !frequencyChart ? String(Math.round(xValue)) : format(xValue, Math.abs(maxX - minX) < 12 ? 1 : 0), x, height - pad.bottom + 18);
        ctx.textAlign = "right";
        ctx.fillText(format(yValue, Math.abs(maxY - minY) < 12 ? 1 : 0), pad.left - 8, y + 3);
      }
      const xAxisLabel = frequencyChart
        ? `${dataset.yLabel || "観測値"}${chart.unit || dataset.unit ? ` (${chart.unit || dataset.unit})` : ""}`
        : (chart.xLabel || dataset.xLabel || "OBSERVATION");
      const yAxisLabel = frequencyChart ? "観測数" : (chart.yLabel || dataset.yLabel || dataset.unit || "VALUE");
      canvas.dataset.axisX = xAxisLabel;
      canvas.dataset.axisY = yAxisLabel;
      canvas.dataset.domainX = `${minX},${maxX}`;
      canvas.dataset.domainY = `${minY},${maxY}`;
      canvas.dataset.pointCount = String(points.length);
      ctx.fillStyle = "rgba(218,243,255,.72)"; ctx.font = "10px Consolas"; ctx.textAlign = "center"; ctx.fillText(xAxisLabel, pad.left + (width - pad.left - pad.right) / 2, height - 12); ctx.save(); ctx.translate(15, pad.top + (height - pad.top - pad.bottom) / 2); ctx.rotate(-Math.PI / 2); ctx.fillText(yAxisLabel, 0, 0); ctx.restore();
      if (["histogram", "distribution", "sampling"].includes(chart.type) && chart.bins?.length) {
        ctx.fillStyle = "rgba(65, 148, 222, .13)";
        ctx.strokeStyle = "rgba(117, 214, 255, .28)";
        chart.bins.forEach((bin) => {
          const left = xScale(bin.x0);
          const right = xScale(bin.x1);
          const top = yScale(bin.count);
          ctx.fillRect(left + 1, top, Math.max(1, right - left - 2), height - pad.bottom - top);
          ctx.strokeRect(left + 1, top, Math.max(1, right - left - 2), height - pad.bottom - top);
        });
      }
      if (chart.type === "histogram" && chart.stats) {
        const boxY = pad.top + 8;
        ctx.strokeStyle = "rgba(242, 213, 155, .88)";
        ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(xScale(chart.stats.minimum), boxY); ctx.lineTo(xScale(chart.stats.maximum), boxY); ctx.stroke();
        ctx.strokeRect(xScale(chart.stats.q1), boxY - 6, Math.max(2, xScale(chart.stats.q3) - xScale(chart.stats.q1)), 12);
        ctx.beginPath(); ctx.moveTo(xScale(chart.stats.median), boxY - 8); ctx.lineTo(xScale(chart.stats.median), boxY + 8); ctx.stroke();
      }
      if (chart.type === "distribution" && chart.curve?.length) {
        ctx.strokeStyle = "rgba(242, 213,155,.86)";
        ctx.lineWidth = 2;
        ctx.setLineDash([7, 5]);
        ctx.beginPath();
        chart.curve.forEach((point, index) => { const x = xScale(point.x); const y = yScale(point.y); if (index) ctx.lineTo(x, y); else ctx.moveTo(x, y); });
        ctx.stroke();
        ctx.setLineDash([]);
      }
      if (Array.isArray(chart.line) || chart.line?.slope !== undefined || chart.line?.intercept !== undefined) {
        const intercept = Array.isArray(chart.line) ? chart.line[0] : chart.line.intercept;
        const slope = Array.isArray(chart.line) ? chart.line[1] : chart.line.slope;
        const low = minX; const high = maxX; ctx.strokeStyle = "rgba(126,231,255,.92)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(xScale(low), yScale(intercept + slope * low)); ctx.lineTo(xScale(high), yScale(intercept + slope * high)); ctx.stroke();
      }
      if (chart.type === "bayes" && points.length > 1) { ctx.strokeStyle = "#78dcff"; ctx.lineWidth = 2; ctx.beginPath(); points.forEach((point, index) => { const x = xScale(point.x); const y = yScale(point.y); if (index) ctx.lineTo(x, y); else ctx.moveTo(x, y); }); ctx.stroke(); }
      if (chart.type === "discrete" && chart.expected) { ctx.strokeStyle = "rgba(242,213,155,.9)"; ctx.setLineDash([6, 5]); ctx.beginPath(); chart.expected.forEach((value, index) => { const x = xScale(index); const y = yScale(value); if (index) ctx.lineTo(x, y); else ctx.moveTo(x, y); }); ctx.stroke(); ctx.setLineDash([]); }
      const liveTargets = [];
      targets.forEach((target, id) => {
        const from = starts.get(id); const x = from.sx + (target.sx - from.sx) * eased; const y = from.sy + (target.sy - from.sy) * eased;
        const colors = ["#82e8ff", "#679dff", "#94f2d8", "#f2d59b", "#b692ff"];
        ctx.fillStyle = colors[target.group % colors.length]; ctx.shadowColor = ctx.fillStyle; ctx.shadowBlur = 10; ctx.beginPath(); ctx.arc(x, y, chart.type === "categorical" ? Math.min(12, 4 + Math.sqrt(Math.max(0, target.y))) : 4.2, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;
        liveTargets.push({ ...target, sx: x, sy: y });
        if (t === 1) state.points.set(id, { sx: target.sx, sy: target.sy, group: target.group });
      });
      state.chartTargets = liveTargets;
      ctx.fillStyle = "rgba(226,247,255,.68)"; ctx.font = "10px var(--font-ja), sans-serif"; ctx.textAlign = "right"; ctx.fillText(`${points.length} PLOTS / ${(result.insight?.provenance || dataset.provenance).join(" + ")}`, width - pad.right, 18);
      if (t < 1) state.animation = requestAnimationFrame(paint);
    };
    state.animation = requestAnimationFrame(paint);
  };

  ui.canvas.addEventListener("pointermove", updateChartTooltipFromPointer);
  ui.canvas.addEventListener("pointerdown", updateChartTooltipFromPointer);
  ui.canvas.addEventListener("click", () => drillToRecord(state.chartActiveTarget));
  ui.canvas.addEventListener("pointerleave", hideChartTooltip);
  ui.canvas.addEventListener("keydown", updateChartTooltipFromKeyboard);
  ui.canvas.addEventListener("focus", () => { if (state.chartTargets.length) showChartTargetByIndex(Math.max(0, state.chartKeyboardIndex)); });
  ui.canvas.addEventListener("blur", hideChartTooltip);

  const returnToChart = (button) => {
    const panel = button.closest("details");
    if (!(panel instanceof HTMLDetailsElement)) return;
    panel.open = false;
    requestAnimationFrame(() => ui.canvas.focus({ preventScroll: true }));
    window.dispatchEvent(new CustomEvent("gaia:statistics-chart-return", { detail: { panel: panel.className } }));
  };

  ui.detailPanels.forEach((panel) => panel.addEventListener("toggle", () => {
    if (!panel.open) return;
    ui.detailPanels.forEach((candidate) => {
      if (candidate !== panel) candidate.open = false;
    });
  }));
  ui.panelBackButtons.forEach((button) => button.addEventListener("click", () => returnToChart(button)));

  const render = () => {
    const dataset = currentDataset(); const method = METHOD_LOOKUP.get(state.methodId) || METHOD_LOOKUP.get("summary");
    if (!dataset || !method) return;
    ui.number.textContent = `${method.group.id} / ${method.group.name.toUpperCase()}`; ui.title.textContent = method.label; ui.copy.textContent = method.copy; ui.status.textContent = "CALCULATING"; setExportsEnabled(false);
    const token = ++state.renderToken;
    requestAnimationFrame(async () => {
      if (token !== state.renderToken) return;
      try {
        const result = await runAnalysis(method.id, dataset);
        if (token !== state.renderToken) return;
        state.result = result;
        renderMetrics(result, dataset); renderRecords(dataset); renderBusinessSummary(result, dataset); renderInsights(result); drawChart(result, dataset); setExportsEnabled(true);
        ui.status.textContent = result.kind === "not-applicable" ? "条件不足" : `${rowsFor(dataset).length}件`;
      } catch (error) {
        console.error("GAIA Statistics Lab analysis failed", error);
        const result = notApplicable("計算条件を満たさないため数値的結論を表示しません。", ["01 要約統計"]); state.result = result; renderMetrics(result, dataset); renderRecords(dataset); renderBusinessSummary(result, dataset); renderInsights(result); drawChart(result, dataset); setExportsEnabled(true); ui.status.textContent = "条件不足";
      }
    });
  };

  const renderMethods = () => {
    const group = METHOD_GROUPS.find((candidate) => candidate.id === state.lectureId) || METHOD_GROUPS[0];
    ui.methods.replaceChildren();
    group.methods.forEach(([id, label]) => { const button = document.createElement("button"); button.type = "button"; button.role = "listitem"; button.dataset.method = id; button.setAttribute("aria-pressed", id === state.methodId ? "true" : "false"); button.textContent = label; button.addEventListener("click", () => { state.methodId = id; renderMethods(); render(); }); ui.methods.append(button); });
  };

  const selectLecture = (id, preferredMethod) => {
    const group = METHOD_GROUPS.find((candidate) => candidate.id === id) || METHOD_GROUPS[0]; state.lectureId = group.id; state.methodId = group.methods.some((method) => method[0] === preferredMethod) ? preferredMethod : group.methods[0][0];
    ui.lectures.value = state.lectureId; renderMethods(); render();
  };

  const renderLectures = () => {
    ui.lectures.replaceChildren(); METHOD_GROUPS.forEach((group) => { const option = document.createElement("option"); option.value = group.id; option.textContent = `${group.id}　${group.name}`; ui.lectures.append(option); }); ui.lectures.value = state.lectureId;
  };

  const renderDatasetOptions = () => {
    ui.dataset.replaceChildren();
    state.datasets.forEach((dataset) => { const option = document.createElement("option"); option.value = dataset.id; option.textContent = `${MODE_TITLES[dataset.modeId]?.split(" / ")[0] || dataset.modeId} — ${dataset.title}`; ui.dataset.append(option); });
    ui.dataset.value = state.datasetId;
  };

  const setDataset = (id, chooseDefault = false) => {
    const dataset = state.datasets.find((candidate) => candidate.id === id) || state.datasets[0]; if (!dataset) return;
    const supportsDerived = dataset.provenance.some((kind) => kind !== "SOURCE");
    if (!supportsDerived) state.includeDerived = false;
    if (state.datasetId !== dataset.id) state.selectedRecordId = "";
    state.datasetId = dataset.id; state.modeId = dataset.modeId; ui.dataset.value = dataset.id; ui.derived.checked = state.includeDerived; ui.derived.disabled = !supportsDerived;
    ui.context.textContent = `${MODE_TITLES[dataset.modeId] || dataset.modeId} — ${dataset.title}`;
    if (chooseDefault) { const method = DEFAULT_METHOD[dataset.modeId] || "summary"; const group = METHOD_LOOKUP.get(method).group; state.lectureId = group.id; state.methodId = method; renderLectures(); renderMethods(); }
    render();
  };

  const focusables = () => [...lab.querySelectorAll("button:not([disabled]), select:not([disabled]), input:not([disabled]), details > summary, [tabindex]:not([tabindex='-1'])")].filter((element) => !element.hidden && element.getClientRects().length);
  const trapFocus = (event) => { if (!state.open) return; if (event.key === "Escape") { event.preventDefault(); event.stopImmediatePropagation(); close(); return; } if (event.key !== "Tab") return; const list = focusables(); if (!list.length) return; const first = list[0]; const last = list.at(-1); if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); } else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); } };

  const ensureReady = async () => {
    if (state.snapshot) return;
    const adapter = globalThis.GaiaMapObservationAdapter;
    if (!adapter?.waitSignalsReady) throw new Error("地図データの準備が完了していません。");
    state.snapshot = await adapter.waitSignalsReady(); state.datasets = buildDatasets(state.snapshot); renderDatasetOptions(); renderLectures(); renderMethods();
  };

  const open = async ({ modeId, datasetId } = {}) => {
    state.returnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : openButton; ui.status.textContent = "LOADING DATA";
    lab.hidden = false; lab.setAttribute("aria-hidden", "false"); document.body.classList.add("gaia-statistics-open"); state.open = true; document.addEventListener("keydown", trapFocus, true);
    try {
      await ensureReady();
      const adapterState = globalThis.GaiaMapObservationAdapter?.getState?.(); const inferredMode = modeId || state.snapshot?.modes?.[adapterState?.modeIndex]?.id || state.modeId;
      const preferred = datasetId || state.datasets.find((dataset) => dataset.modeId === inferredMode)?.id || state.datasets[0]?.id;
      setDataset(preferred, true); ui.close.focus(); window.dispatchEvent(new CustomEvent("gaia:statistics-open", { detail: { modeId: inferredMode, datasetId: preferred } }));
    } catch (error) {
      console.error(error); ui.status.textContent = "DATA UNAVAILABLE"; ui.context.textContent = "保存スナップショットを読み込めませんでした。地図を開き直して再試行してください。";
    }
  };

  const close = () => {
    if (!state.open) return; cancelAnimationFrame(state.animation); state.open = false; lab.hidden = true; lab.setAttribute("aria-hidden", "true"); document.body.classList.remove("gaia-statistics-open"); document.removeEventListener("keydown", trapFocus, true); state.returnFocus?.focus?.(); window.dispatchEvent(new CustomEvent("gaia:statistics-close", { detail: { modeId: state.modeId, datasetId: state.datasetId } }));
  };

  [openButton, ...document.querySelectorAll("[data-gaia-statistics-open]")].forEach((button) => button.addEventListener("click", () => void open()));
  ui.close.addEventListener("click", close);
  lab.addEventListener("pointerdown", (event) => { if (event.target === lab) close(); });
  ui.dataset.addEventListener("change", () => setDataset(ui.dataset.value, false));
  ui.lectures.addEventListener("change", () => selectLecture(ui.lectures.value));
  ui.derived.addEventListener("change", () => { state.includeDerived = ui.derived.checked; render(); });
  ui.recordSortButtons.forEach((button) => button.addEventListener("click", () => sortRecords(button.dataset.recordSortAction)));
  ui.recordFilter.addEventListener("input", () => applyRecordQuery(ui.recordFilter.value));
  ui.recordFilter.addEventListener("search", () => applyRecordQuery(ui.recordFilter.value, true));
  ui.filterClear.addEventListener("click", () => {
    ui.recordFilter.value = "";
    applyRecordQuery("", true);
    ui.recordFilter.focus();
  });
  ui.savedView.addEventListener("change", updateSavedViewButtons);
  ui.viewSave.addEventListener("click", saveCurrentView);
  ui.viewApply.addEventListener("click", applySavedView);
  ui.viewDelete.addEventListener("click", deleteSavedView);
  ui.exportCsv.addEventListener("click", exportCsv);
  ui.exportJson.addEventListener("click", exportJson);
  ui.exportPng.addEventListener("click", () => void exportPng());
  new ResizeObserver(() => { if (state.open && state.result) drawChart(state.result, currentDataset()); }).observe(ui.visual);

  state.savedViews = readSavedViews();
  renderSavedViews();

  globalThis.GaiaStatisticsLab = Object.freeze({
    open,
    close,
    getState: () => ({ open: state.open, modeId: state.modeId, datasetId: state.datasetId, lectureId: state.lectureId, methodId: state.methodId, includeDerived: state.includeDerived, recordQuery: state.recordQuery, recordSortKey: state.recordSortKey, recordSortDirection: state.recordSortDirection, selectedRecordId: state.selectedRecordId, savedViewCount: state.savedViews.length, exportReady: state.exportReady }),
    run: (methodId, datasetId = state.datasetId) => runAnalysis(methodId, state.datasets.find((dataset) => dataset.id === datasetId) || currentDataset()),
    createExportReport,
    exportCsv,
    exportJson,
    exportPng,
  });
  window.dispatchEvent(new CustomEvent("gaia:statistics-lab-ready"));
}
