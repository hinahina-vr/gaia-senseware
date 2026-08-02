const isFiniteNumber = (value) => Number.isFinite(value);

const round = (value, digits = 3) => {
  if (!isFiniteNumber(value)) return null;
  const scale = 10 ** digits;
  return Math.round(value * scale) / scale;
};

const median = (values) => {
  const sorted = values.filter(isFiniteNumber).sort((first, second) => first - second);
  if (!sorted.length) return null;
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2
    ? sorted[middle]
    : (sorted[middle - 1] + sorted[middle]) / 2;
};

const decimalYear = (row) => Number(row.year) + (Number(row.month || 1) - 1) / 12;

const spatialPrediction = (
  values,
  width,
  height,
  targetIndex,
  { neighborCount = 8, power = 2, excludeIndex = -1 } = {},
) => {
  const row = Math.floor(targetIndex / width);
  const column = targetIndex % width;
  const latitude = 90 - (row + 0.5) * (180 / height);
  const longitudeScale = Math.max(0.12, Math.cos((latitude * Math.PI) / 180));
  const candidates = [];
  const maximumRadius = Math.max(width / 2, height);

  for (let radius = 1; radius <= maximumRadius && candidates.length < neighborCount; radius += 1) {
    for (let deltaRow = -radius; deltaRow <= radius; deltaRow += 1) {
      const candidateRow = row + deltaRow;
      if (candidateRow < 0 || candidateRow >= height) continue;
      for (let deltaColumn = -radius; deltaColumn <= radius; deltaColumn += 1) {
        if (Math.max(Math.abs(deltaRow), Math.abs(deltaColumn)) !== radius) continue;
        const candidateColumn = (column + deltaColumn + width) % width;
        const candidateIndex = candidateRow * width + candidateColumn;
        if (candidateIndex === excludeIndex || !isFiniteNumber(values[candidateIndex])) continue;
        const wrappedColumnDistance = Math.min(
          Math.abs(candidateColumn - column),
          width - Math.abs(candidateColumn - column),
        );
        const distanceCells = Math.hypot(deltaRow, wrappedColumnDistance * longitudeScale);
        candidates.push({
          value: values[candidateIndex],
          distanceCells: Math.max(distanceCells, 0.001),
        });
      }
    }
  }

  const donors = candidates
    .sort((first, second) => first.distanceCells - second.distanceCells)
    .slice(0, neighborCount);
  if (!donors.length) return null;
  let weightedTotal = 0;
  let weightTotal = 0;
  for (const donor of donors) {
    const weight = 1 / donor.distanceCells ** power;
    weightedTotal += donor.value * weight;
    weightTotal += weight;
  }
  return {
    value: weightedTotal / weightTotal,
    donorCount: donors.length,
    nearestDistanceCells: donors[0].distanceCells,
    meanDistanceCells:
      donors.reduce((sum, donor) => sum + donor.distanceCells, 0) / donors.length,
  };
};

const crossValidateSpatialModel = (values, width, height, options) => {
  const observedIndices = values
    .map((value, index) => (isFiniteNumber(value) ? index : -1))
    .filter((index) => index >= 0);
  const validationCount = Math.min(128, observedIndices.length);
  if (!validationCount) return { sampleSize: 0, rmsePpm: null, maePpm: null };
  const squaredErrors = [];
  const absoluteErrors = [];
  for (let sample = 0; sample < validationCount; sample += 1) {
    const sourceIndex = observedIndices[
      Math.floor((sample / validationCount) * observedIndices.length)
    ];
    const prediction = spatialPrediction(values, width, height, sourceIndex, {
      ...options,
      excludeIndex: sourceIndex,
    });
    if (!prediction) continue;
    const error = prediction.value - values[sourceIndex];
    squaredErrors.push(error ** 2);
    absoluteErrors.push(Math.abs(error));
  }
  return {
    sampleSize: squaredErrors.length,
    rmsePpm: squaredErrors.length
      ? round(Math.sqrt(squaredErrors.reduce((sum, value) => sum + value, 0) / squaredErrors.length))
      : null,
    maePpm: absoluteErrors.length
      ? round(absoluteErrors.reduce((sum, value) => sum + value, 0) / absoluteErrors.length)
      : null,
  };
};

const imputeSpatialFrame = (frame, width, height) => {
  const previousImputed = new Set(frame.imputedIndices || []);
  const sourceValues = (frame.values || []).map((value, index) =>
    previousImputed.has(index) ? null : value,
  );
  const options = { neighborCount: 8, power: 2 };
  const validation = crossValidateSpatialModel(sourceValues, width, height, options);
  const values = [...sourceValues];
  const imputedIndices = [];
  const donorDistances = [];

  for (let index = 0; index < values.length; index += 1) {
    if (isFiniteNumber(values[index])) continue;
    const prediction = spatialPrediction(sourceValues, width, height, index, options);
    if (!prediction) continue;
    values[index] = round(prediction.value, 1);
    imputedIndices.push(index);
    donorDistances.push(prediction.meanDistanceCells * (180 / height));
  }

  const finiteValues = values.filter(isFiniteNumber);
  const observedCells = sourceValues.filter(isFiniteNumber).length;
  return {
    ...frame,
    sourceAvailableCells: frame.sourceAvailableCells ?? observedCells,
    observedCells,
    imputedCells: imputedIndices.length,
    availableCells: finiteValues.length,
    sourceMinimumPpm: frame.sourceMinimumPpm ?? frame.minimumPpm,
    sourceMaximumPpm: frame.sourceMaximumPpm ?? frame.maximumPpm,
    minimumPpm: finiteValues.length ? Math.min(...finiteValues) : null,
    maximumPpm: finiteValues.length ? Math.max(...finiteValues) : null,
    values,
    imputedIndices,
    imputation: {
      method: "K_NEAREST_IDW",
      formula: "x_hat(s) = sum(d_i^-2 * x_i) / sum(d_i^-2)",
      neighborCount: options.neighborCount,
      distancePower: options.power,
      longitudeWrap: true,
      meanDonorDistanceDegrees: round(
        donorDistances.reduce((sum, value) => sum + value, 0) / Math.max(1, donorDistances.length),
        2,
      ),
      validation: {
        method: "deterministic spatial holdout",
        ...validation,
      },
      uncertaintyNote:
        "RMSE/MAE are holdout errors for the display-grid interpolation, not measurement uncertainty or a formal confidence interval.",
    },
  };
};

const fitLinearTrend = (rows, trainingCount = 120) => {
  const training = rows
    .filter((row) => isFiniteNumber(row.deseasonalizedPpm))
    .sort((first, second) => decimalYear(first) - decimalYear(second))
    .slice(-trainingCount);
  if (training.length < 3) return null;
  const xs = training.map(decimalYear);
  const ys = training.map((row) => row.deseasonalizedPpm);
  const n = training.length;
  const meanX = xs.reduce((sum, value) => sum + value, 0) / n;
  const meanY = ys.reduce((sum, value) => sum + value, 0) / n;
  const sxx = xs.reduce((sum, value) => sum + (value - meanX) ** 2, 0);
  const sxy = xs.reduce((sum, value, index) => sum + (value - meanX) * (ys[index] - meanY), 0);
  const slope = sxy / sxx;
  const residuals = ys.map((value, index) => value - (meanY + slope * (xs[index] - meanX)));
  const sse = residuals.reduce((sum, value) => sum + value ** 2, 0);
  const sst = ys.reduce((sum, value) => sum + (value - meanY) ** 2, 0);
  const residualStandardError = Math.sqrt(sse / Math.max(1, n - 2));
  const rSquared = sst > 0 ? 1 - sse / sst : 1;
  const tCritical95 = 1.98;
  const predict = (year) => {
    const estimate = meanY + slope * (year - meanX);
    const standardError = residualStandardError * Math.sqrt(
      1 + 1 / n + ((year - meanX) ** 2) / sxx,
    );
    const halfWidth = tCritical95 * standardError;
    return {
      year,
      predictedPpm: round(estimate),
      lower95Ppm: round(estimate - halfWidth),
      upper95Ppm: round(estimate + halfWidth),
      predictionHalfWidth95Ppm: round(halfWidth),
      type: "SCENARIO_OLS_PROJECTION",
    };
  };
  return {
    method: "ordinary least squares linear trend",
    equation: "y_hat(t) = y_bar + beta_1 * (t - t_bar)",
    response: "NOAA Mauna Loa monthly deseasonalized CO2",
    trainingMonths: n,
    trainingPeriod: `${training[0].year}-${String(training[0].month).padStart(2, "0")}–${training.at(-1).year}-${String(training.at(-1).month).padStart(2, "0")}`,
    referenceYear: round(meanX, 6),
    levelAtReferencePpm: round(meanY, 6),
    slopePpmYear: round(slope, 6),
    sxx: round(sxx, 6),
    residualStandardErrorPpm: round(residualStandardError, 6),
    rSquared: round(rSquared, 6),
    tCritical95,
    intervalType: "95% prediction interval for a future monthly observation under the unchanged linear model",
    predict,
  };
};

const haversineKm = (first, second) => {
  const radians = (degrees) => (degrees * Math.PI) / 180;
  const deltaLat = radians(second.lat - first.lat);
  const deltaLon = radians(second.lon - first.lon);
  const a = Math.sin(deltaLat / 2) ** 2 +
    Math.cos(radians(first.lat)) * Math.cos(radians(second.lat)) * Math.sin(deltaLon / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const imputeWasteCountries = (observedRows, referenceSites, neighborCount = 5) => {
  const observed = observedRows
    .filter((row) => row.valueStatus !== "IMPUTED" && isFiniteNumber(row.recyclePercent))
    .map((row) => ({ ...row, valueStatus: "SOURCE" }));
  const observedIso3 = new Set(observed.map((row) => row.iso3));
  const imputed = referenceSites
    .filter((site) => !observedIso3.has(site.iso3))
    .map((site) => {
      const donors = observed
        .map((row) => ({ row, distanceKm: haversineKm(site, row) }))
        .sort((first, second) => first.distanceKm - second.distanceKm)
        .slice(0, neighborCount);
      const estimate = median(donors.map((donor) => donor.row.recyclePercent));
      const absoluteDeviations = donors.map((donor) => Math.abs(donor.row.recyclePercent - estimate));
      return {
        ...site,
        country: site.name,
        year: null,
        recyclePercent: round(estimate, 2),
        valueStatus: "IMPUTED",
        imputationMethod: "GEOGRAPHIC_KNN_MEDIAN",
        neighborCount: donors.length,
        donorIso3: donors.map((donor) => donor.row.iso3),
        maximumDonorDistanceKm: round(Math.max(...donors.map((donor) => donor.distanceKm)), 1),
        donorMedianAbsoluteDeviationPp: round(median(absoluteDeviations), 2),
        caveat: "Official value unavailable in the snapshot; not suitable for country ranking or policy evaluation.",
      };
    })
    .filter((row) => isFiniteNumber(row.recyclePercent));
  return { observed, imputed, combined: referenceSites.map((site) =>
    observed.find((row) => row.iso3 === site.iso3) || imputed.find((row) => row.iso3 === site.iso3),
  ).filter(Boolean) };
};

const upsertDataset = (mode, dataset) => {
  const index = mode.datasets.findIndex((candidate) => candidate.id === dataset.id);
  if (index >= 0) mode.datasets[index] = dataset;
  else mode.datasets.push(dataset);
};

export const enrichSnapshotWithStatistics = (snapshot) => {
  const breathing = snapshot.modes.find((mode) => mode.id === "breathing-earth");
  if (breathing?.signals?.gosat?.frames?.length) {
    const grid = breathing.signals.gosat;
    grid.frames = grid.frames.map((frame) => imputeSpatialFrame(frame, grid.width, grid.height));
    const regression = fitLinearTrend(breathing.signals.co2 || [], 120);
    if (regression) {
      const forecastYears = [2026, 2030, 2035, 2040, 2045, 2050];
      const forecastRows = forecastYears.map(regression.predict);
      const { predict, ...serializableModel } = regression;
      breathing.signals.co2ForecastModel = serializableModel;
      breathing.datasets = breathing.datasets.filter(
        (dataset) => dataset.id !== "co2-future-trend-scenario",
      );
      upsertDataset(breathing, {
        id: "co2-ols-trend-projection",
        kind: "SCENARIO",
        organisation: "GAIA SENSEWARE / statistics layer",
        title: "NOAA直近120か月によるCO₂最小二乗トレンド投影",
        url: "./scripts/statistics.mjs",
        retrievedAt: snapshot.generatedAt,
        period: "2026–2050",
        unit: "ppm / 95% prediction interval",
        resolution: "年次表示・回帰学習は月次120標本",
        transformation: `y_hat(t)=y_bar+beta1(t-t_bar)。beta1=${serializableModel.slopePpmYear} ppm/年、R²=${serializableModel.rSquared}。95%予測区間を残差標準誤差から算出`,
        caveat: "説明変数が時間だけの単回帰。政策・排出シナリオ・炭素循環の構造変化を含まず、気候モデルによる予測ではない。",
        preview: forecastRows.slice(0, 10),
      });
    }
    const auditRows = grid.frames.map((frame) => ({
      date: frame.date,
      observedCells: frame.observedCells,
      imputedCells: frame.imputedCells,
      totalCells: frame.values.length,
      method: frame.imputation.method,
      k: frame.imputation.neighborCount,
      power: frame.imputation.distancePower,
      holdoutRmsePpm: frame.imputation.validation.rmsePpm,
      holdoutMaePpm: frame.imputation.validation.maePpm,
    }));
    upsertDataset(breathing, {
      id: "gosat-spatial-imputation",
      kind: "DERIVED",
      organisation: "GAIA SENSEWARE / statistics layer",
      title: "GOSAT欠測セルの空間k近傍IDW補完",
      url: "./scripts/statistics.mjs",
      retrievedAt: snapshot.generatedAt,
      period: `${grid.frames[0].date}–${grid.frames.at(-1).date}`,
      unit: "approx. ppm XCO₂",
      resolution: `${grid.resolutionDegrees}°格子 / k=8 / 距離指数p=2`,
      transformation: "欠測セルごとに球面上で近い観測8セルを探し、距離の2乗の逆数を重みにした加重平均で補完。経度は日付変更線を循環させる。",
      caveat: "局所的な滑らかさを仮定する展示用補完。GOSAT観測や公式Level 3値ではない。補完セルは低彩度・斜線で区別し、ホールドアウトRMSEを併記する。",
      preview: auditRows.slice(0, 10),
    });
    const decodedDataset = breathing.datasets.find(
      (dataset) => dataset.id === "gosat-gallery-decoded",
    );
    if (decodedDataset) {
      decodedDataset.transformation =
        "各格子中心の色を公式スケールへ照合。読めないセルは観測値を上書きせず、別DERIVED層で8近傍IDW補完する。";
      decodedDataset.caveat =
        "HDF5数値本体ではなく公式閲覧画像から復元した近似値。補完前の観測セル数と補完セル数は統計監査データに保存する。";
    }
    const noaaDataset = breathing.datasets.find((dataset) => dataset.id === "noaa-co2");
    if (noaaDataset) {
      noaaDataset.transformation =
        "球体版では呼吸と長期増加へ使用。地図版では1958–2009の濃度水準と、直近120か月OLSトレンド投影の学習データに使用。";
    }
    breathing.statisticalMethods = [
      {
        id: "SPATIAL_IDW",
        plainTitle: "近くの観測から、空白をそっとつなぐ",
        plainExplanation: "人工衛星が測れなかった場所は、近くにある8つの観測値を手がかりに色をつけました。近い場所の値ほど、強く参考にしています。",
        plainLimit: "斜線の場所は、実際に測った値ではありません。周囲から計算した値です。",
        target: "GOSAT 2.5° XCO₂欠測セル",
        formula: "x_hat(s) = Σ[d_i^-2 x_i] / Σ[d_i^-2]",
        rule: "近い観測8セル。経度は±180°で循環。観測セルは上書きしない。",
        validation: "各時点から最大128観測セルを隠す決定的ホールドアウトでRMSE/MAEを算出。",
        display: "補完セルは低い不透明度と斜線。タップ時にIMPUTEDと誤差指標を表示。",
      },
      {
        id: "TEMPORAL_LINEAR",
        plainTitle: "二つの時点のあいだを、なめらかにつなぐ",
        plainExplanation: "観測した月と次に観測した月のあいだは、二つの値をまっすぐ結んで変化を描きました。",
        plainLimit: "途中の変化を実際に観測したわけではありません。急な変化は表せない方法です。",
        target: "収録したGOSAT時点の間",
        formula: "x_hat(t) = (1-a)x_t0 + a x_t1",
        rule: "前後2時点が存在する区間だけ線形内挿。観測期間外への外挿には使わない。",
        validation: "内挿であり観測ではないため、画面ではDERIVEDと表示。",
        display: "大きな時点表示とDATA TRANSFORMで内挿区間を開示。",
      },
      {
        id: "OLS_TREND_PROJECTION",
        plainTitle: "これまでの増え方が続いたら、未来はどう見える？",
        plainExplanation: "直近10年分のCO₂を一本の傾向線にまとめ、その線を2050年まで伸ばしました。未来の数字には、ぶれの幅も添えています。",
        plainLimit: "これは未来を言い当てる予言ではありません。今までと同じ増え方が続いた場合の『もしも』です。",
        target: "2026–2050 CO₂トレンド投影",
        formula: "y_hat(t) = y_bar + beta_1(t - t_bar)",
        rule: "NOAA季節調整済み月平均の直近120か月を最小二乗法で学習。",
        validation: "R²、残差標準誤差、95%予測区間を表示。構造変化はモデル外。",
        display: "SCENARIOとして中央推定と95% PIを表示し、気候モデル予測とは呼ばない。",
      },
    ];
  }

  const wasteMode = snapshot.modes.find((mode) => mode.id === "nothing-is-waste");
  const energyMode = snapshot.modes.find((mode) => mode.id === "earth-organ");
  if (wasteMode?.signals?.countryWaste && energyMode?.signals?.potential) {
    const waste = imputeWasteCountries(wasteMode.signals.countryWaste, energyMode.signals.potential, 5);
    wasteMode.signals.countryWaste = waste.combined;
    upsertDataset(wasteMode, {
      id: "waste-geographic-knn-median",
      kind: "DERIVED",
      organisation: "GAIA SENSEWARE / statistics layer",
      title: "UN SDG欠測国の地理的5近傍中央値補完",
      url: "./scripts/statistics.mjs",
      retrievedAt: snapshot.generatedAt,
      period: "同梱スナップショット時点",
      unit: "% municipal waste recycled",
      resolution: `${waste.imputed.length} imputed / ${waste.observed.length} observed countries`,
      transformation: "公式値がない選択国について、代表座標から近い公式値保有5か国の再資源化率中央値を割り当てる。中央値は極端値の影響を抑えるため採用。",
      caveat: "制度・定義・所得などを説明変数に含めない展示用推定。公式値ではなく、国別順位・政策評価には使用不可。破線で区別する。",
      preview: waste.imputed.slice(0, 10),
    });
    wasteMode.statisticalMethods = [
      {
        id: "GEOGRAPHIC_KNN_MEDIAN",
        plainTitle: "値のない地域を、近くの5か国から考える",
        plainExplanation: "公式データが見つからない地域は、地理的に近い5か国を参考にし、その真ん中の値を置きました。",
        plainLimit: "近い国でも制度や暮らしは違います。破線の円は公式値ではなく、比較のための仮の値です。",
        target: "UN SDG 12.5.1の未収録14地域",
        formula: "x_hat(c) = median(x of 5 geographically nearest observed countries)",
        rule: "公式値を持つ国だけをドナーにし、観測値は上書きしない。",
        validation: "地理的近さだけでは制度差を説明できないため、推定値を政策比較に使わない。",
        display: "SOURCEは実線、IMPUTEDは破線。POIにドナー国とMADを表示。",
      },
    ];
  }

  for (const mode of snapshot.modes) {
    mode.statisticalMethods ||= [];
  }
  snapshot.statisticalPolicy = {
    principle: "Observed values are never overwritten. Every filled or projected value carries a DERIVED or SCENARIO label.",
    numericMissingness: "Interpolate only when the variable is numeric and a defensible neighborhood or time model exists.",
    structuralMissingness: "Do not fill periods before station opening, after station closure, absent categorical metadata, or unobserved biological relationships.",
    uncertainty: "Show holdout error or prediction interval where the model permits; neither is measurement uncertainty.",
  };
  snapshot.statisticsAppliedAt = new Date().toISOString();
  return snapshot;
};
