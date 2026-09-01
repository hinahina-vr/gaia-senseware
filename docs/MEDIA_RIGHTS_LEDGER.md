# 公開素材・データ権利台帳

この文書は `scripts/build-media-rights-ledger.mjs` により機械可読JSONから生成されます。生成サービスの利用プランは独立に確認できないため、全件「確認していない」と記載します。

- 公開メディア: 279件
- 各ファイル: SHA-256、制作サービス、最初のリポジトリ証拠日、加工説明、元台帳、利用条件URLをJSONへ収録
- 生成日時: ファイル単位で証明できない場合は推測せず、不明理由を記録

## データ出典

| 提供者 | データセット | 取得・退避方針 |
|---|---|---|
| [NOAA NDBC](https://www.ndbc.noaa.gov/data/latest_obs/latest_obs.txt) | latest observations | live: 5 minutes; versioned snapshot fallback |
| [NOAA GML](https://erddap.gml.noaa.gov/erddap/tabledap/greenhouse_gases_co2_insitu_hourly_averages_surface.html) | Mauna Loa hourly CO2 | latest published: 1 hour; versioned snapshot fallback |
| [JAXA Earth API](https://data.earth.jaxa.jp/en/) | JAXA.EORC_GSMaP_standard.Gauge.00Z-23Z.v6_daily | live: 6 hours; fixed Hawaii bbox mean; versioned snapshot fallback |
| [ESA / Copernicus Data Space](https://documentation.dataspace.copernicus.eu/APIs/SentinelHub/Data/S5PL2.html) | Sentinel-5P L2 NO2 NRTI | live: 30 minutes; 72-hour quality-masked bbox mean; versioned snapshot fallback |
| [Open-Meteo](https://open-meteo.com/en/docs) | Best Match / Tokyo current weather | model: 30-minute Cloudflare cache; 5-minute refresh check; versioned snapshot fallback |
| [Open-Meteo / CAMS](https://open-meteo.com/en/docs/air-quality-api) | Global greenhouse gas and air-quality forecast / Tokyo grid | model: 3-hour Cloudflare cache; 5-minute refresh check; versioned snapshot fallback |

## 検査

`npm run check:rights` は公開メディア全件との対応、SHA-256、必須項目、生成結果の差分を検査します。詳細は [media-rights-ledger.json](media-rights-ledger.json) を参照してください。
