import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const jsonPath = path.join(root, "docs", "media-rights-ledger.json");
const markdownPath = path.join(root, "docs", "MEDIA_RIGHTS_LEDGER.md");
const checkOnly = process.argv.includes("--check");
const nasaCloudFile = "assets/maps/nasa-blue-marble-clouds-2048.jpg";
const nasaCloudCredit = "NASA Goddard Space Flight Center / Reto Stöckli";
const mediaPattern = /\.(?:avif|gif|jpe?g|m4a|mp3|ogg|png|wav|webp)$/iu;

const walk = (directory) => fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
  const target = path.join(directory, entry.name);
  return entry.isDirectory() ? walk(target) : [target];
});

const normalize = (file) => path.relative(root, file).split(path.sep).join("/");
const media = walk(path.join(root, "assets")).filter((file) => mediaPattern.test(file)).sort();
const evidenceDates = new Map();
let activeDate = null;
const history = execFileSync("git", ["log", "--reverse", "--diff-filter=A", "--format=@@%aI", "--name-only", "--", "assets"], { cwd: root, encoding: "utf8" });
for (const line of history.split(/\r?\n/u)) {
  if (line.startsWith("@@")) activeDate = line.slice(2);
  else if (activeDate && mediaPattern.test(line) && !evidenceDates.has(line)) evidenceDates.set(line, activeDate);
}

const ledgerFor = (relative) => {
  if (relative === nasaCloudFile) return "assets/maps/NASA-CLOUDS-RIGHTS.md";
  if (relative === "assets/audio/gaia-map-ambient-harp-felt-piano.wav") return "scripts/build-map-ambient-score.mjs";
  if (/^assets\/audio\//u.test(relative)) return "README.md#credits";
  if (/^assets\/characters\//u.test(relative)) return "assets/characters/AMANE-STYLE-V3-RIGHTS.md";
  if (/^assets\/visuals-07\//u.test(relative)) return "assets/visuals-07/README.md";
  return "assets/ILLUSTRATION-V8.md";
};

const serviceFor = (relative) => {
  if (relative === nasaCloudFile) return nasaCloudCredit;
  if (relative === "assets/audio/gaia-map-ambient-harp-felt-piano.wav") return "In-repository procedural synthesis (Node.js)";
  if (/\.(?:m4a|mp3|ogg|wav)$/iu.test(relative)) return "Suno AI";
  if (/^assets\/(?:characters|visuals-07)\//u.test(relative)) return "OpenAI ImageGen";
  return "未特定（元台帳参照）";
};

const termsFor = (service) => {
  if (service === nasaCloudCredit) return "https://www.nasa.gov/nasa-brand-center/images-and-media/";
  if (service === "OpenAI ImageGen") return "https://openai.com/policies/service-terms/";
  if (service === "Suno AI") return "https://suno.com/terms";
  return null;
};

const processingFor = (relative) => relative === "assets/audio/gaia-map-ambient-harp-felt-piano.wav"
  ? "純粋なNode.jsによる決定的ステレオPCM合成。ハープ、フェルトピアノ、弦、低域ドローン、濾波ノイズ、拡散リバーブを生成"
  : relative === nasaCloudFile ? "NASA公開JPEGを無加工で保存。描画時に輝度を雲形の透過マスクとして使用。濃淡・微小な移動は演出。現在の衛星画像ではなく参考画像として明記"
  : "採用ファイル。個別の加工履歴は元台帳を参照";

const accountPlanFor = (service) => service === "In-repository procedural synthesis (Node.js)"
  ? "適用外（ローカル生成）"
  : service === nasaCloudCredit ? "適用外（NASA公開素材・利用条件は元台帳参照）"
  : "確認していない";

const assets = media.map((file) => {
  const relative = normalize(file);
  const service = serviceFor(relative);
  return {
    path: relative,
    sha256: createHash("sha256").update(fs.readFileSync(file)).digest("hex"),
    generationService: service,
    generationDate: null,
    generationDateUnknownReason: relative === nasaCloudFile ? "NASA公開日は2002-02-11。個別の撮影日・合成日は特定せず、公開日と観測時刻を区別する" : "個別ファイル単位の生成日時を独立検証できないため、最初のリポジトリ証拠日を併記",
    firstRepositoryEvidenceAt: evidenceDates.get(relative) || null,
    processing: processingFor(relative),
    sourceLedger: ledgerFor(relative),
    officialTermsUrl: termsFor(service),
    accountPlan: accountPlanFor(service),
    publicationStatus: "public",
  };
});

const sources = [
  { provider: "NOAA NDBC", datasetId: "latest observations", sourceUrl: "https://www.ndbc.noaa.gov/data/latest_obs/latest_obs.txt", termsUrl: "https://www.noaa.gov/information-technology/open-data-dissemination", retrievalPolicy: "live: 5 minutes; versioned snapshot fallback" },
  { provider: "NOAA GML", datasetId: "Mauna Loa hourly CO2", sourceUrl: "https://erddap.gml.noaa.gov/erddap/tabledap/greenhouse_gases_co2_insitu_hourly_averages_surface.html", termsUrl: "https://gml.noaa.gov/ccgg/about/co2_measurements.html", retrievalPolicy: "latest published: 1 hour; versioned snapshot fallback" },
  { provider: "JAXA Earth API", datasetId: "JAXA.EORC_GSMaP_standard.Gauge.00Z-23Z.v6_daily", sourceUrl: "https://data.earth.jaxa.jp/en/", termsUrl: "https://data.earth.jaxa.jp/en/terms-of-use/", retrievalPolicy: "live: 6 hours; fixed Hawaii bbox mean; versioned snapshot fallback" },
  { provider: "ESA / Copernicus Data Space", datasetId: "Sentinel-5P L2 NO2 NRTI", sourceUrl: "https://documentation.dataspace.copernicus.eu/APIs/SentinelHub/Data/S5PL2.html", termsUrl: "https://dataspace.copernicus.eu/terms-and-conditions", retrievalPolicy: "live: 30 minutes; 72-hour quality-masked bbox mean; versioned snapshot fallback" },
  { provider: "Open-Meteo", datasetId: "Best Match / Tokyo current weather", sourceUrl: "https://open-meteo.com/en/docs", termsUrl: "https://open-meteo.com/en/pricing", retrievalPolicy: "model: 30-minute Cloudflare cache; 5-minute refresh check; versioned snapshot fallback" },
  { provider: "Open-Meteo / CAMS", datasetId: "Global greenhouse gas and air-quality forecast / Tokyo grid", sourceUrl: "https://open-meteo.com/en/docs/air-quality-api", termsUrl: "https://open-meteo.com/en/pricing", retrievalPolicy: "model: 3-hour Cloudflare cache; 5-minute refresh check; versioned snapshot fallback" },
];

const payload = { schemaVersion: 1, generatedBy: "scripts/build-media-rights-ledger.mjs", accountPlanDisclosure: "生成サービスの利用プランは確認していない", assets, sources };
const json = `${JSON.stringify(payload, null, 2)}\n`;
const markdown = `# 公開素材・データ権利台帳\n\nこの文書は \`scripts/build-media-rights-ledger.mjs\` により機械可読JSONから生成されます。生成サービスの利用プランは独立に確認できないため、全件「確認していない」と記載します。\n\n- 公開メディア: ${assets.length}件\n- 各ファイル: SHA-256、制作サービス、最初のリポジトリ証拠日、加工説明、元台帳、利用条件URLをJSONへ収録\n- 生成日時: ファイル単位で証明できない場合は推測せず、不明理由を記録\n\n## データ出典\n\n| 提供者 | データセット | 取得・退避方針 |\n|---|---|---|\n${sources.map((source) => `| [${source.provider}](${source.sourceUrl}) | ${source.datasetId} | ${source.retrievalPolicy} |`).join("\n")}\n\n## 検査\n\n\`npm run check:rights\` は公開メディア全件との対応、SHA-256、必須項目、生成結果の差分を検査します。詳細は [media-rights-ledger.json](media-rights-ledger.json) を参照してください。\n`;

if (assets.length !== media.length) throw new Error("Every public media file must have one ledger entry");
for (const asset of assets) {
  if (!asset.path || !asset.sha256 || !asset.processing || !asset.sourceLedger || !asset.publicationStatus || !asset.accountPlan) throw new Error(`Incomplete ledger entry: ${asset.path}`);
  if (!fs.existsSync(path.join(root, asset.path))) throw new Error(`Missing public media: ${asset.path}`);
}

if (checkOnly) {
  if (!fs.existsSync(jsonPath) || fs.readFileSync(jsonPath, "utf8") !== json) throw new Error("docs/media-rights-ledger.json is stale; run npm run rights:build");
  if (!fs.existsSync(markdownPath) || fs.readFileSync(markdownPath, "utf8") !== markdown) throw new Error("docs/MEDIA_RIGHTS_LEDGER.md is stale; run npm run rights:build");
  console.log(JSON.stringify({ status: "passed", assets: assets.length, sources: sources.length }));
} else {
  fs.writeFileSync(jsonPath, json);
  fs.writeFileSync(markdownPath, markdown);
  console.log(JSON.stringify({ status: "generated", assets: assets.length, sources: sources.length }));
}
