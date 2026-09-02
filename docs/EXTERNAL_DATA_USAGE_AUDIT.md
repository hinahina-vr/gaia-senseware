# 外部データ利用・二次加工・ダウンロード監査レポート

- 監査対象: GAIA SENSEWARE
- 監査日: 2026-09-02（日本時間）
- 監査対象リビジョン: 本レポートと同時に公開するコミット
- 対象範囲: 展示、ライブ表示、地図、統計ラボ、センサー登録で取得・同梱・参照する外部データ
- 対象外: 画像生成物、キャラクターCG、音源、フォント、npm依存パッケージ（別途メディア／ソフトウェア監査の対象）

## 1. 結論と言明

本レポートは、リポジトリ内の取得スクリプト、同梱データ、画面表示、画面内での二次加工、公開ファイルとしての直接取得可能性を、各提供元の2026-09-02時点の公式利用条件と照合した結果である。統計ラボのCSV・JSON・PNGダウンロード機能は同日廃止済みである。

### 1.1 問題ないと言明できる範囲

本レポートで **「可」** としたデータは、各行に記載した出典表示、改変表示、免責、非推奨用途等の条件を守る限り、このサイトでの表示、記載した二次加工、加工結果のダウンロード提供に問題はないと判断し、その旨を言明する。

本レポートで **「条件付可」** としたデータも、各行の条件を満たす運用に限定すれば利用可能である。特に、商用運用を開始する場合の通知・契約、データセット単位の帰属表示、標準タイルの再配布禁止を守る必要がある。

### 1.2 サイト全体についての言明

**現状のサイトに含まれる全外部データについて、表示・二次加工・第三者ダウンロードのすべてに無条件で問題がない、とは言明できない。** 主な理由は次の4点である。

1. GOSATの公式利用条件は、データ製品・画像・関連文書の第三者への配布／譲渡を禁止している。現在は公式画像から復元した格子値とその補完値を `data/gaia-signals.json` に同梱している。
2. UNESCO World Heritage Centreは、データの再掲載に事前の書面許可を求めている。現在は選定した世界遺産データが同梱JSONと画面内分析の対象に入っている。
3. GBIFはレコードごとにCC0、CC BY、CC BY-NCのいずれかが適用されるが、現在の生成処理は各レコードのライセンス、データセット識別子、権利者情報を保存していない。
4. `assets/data/jaxa-fnf-riau.png` は公開配置されている一方、現在の展示から参照されず、個別の取得元・加工内容・適用条件を確定できない。JAXA FNFの元データそのものの再配布は禁止されている。

したがって、末尾の「必須是正」を完了するまでは、本レポートをサイト全体の無条件な権利保証書として使用してはならない。

> 本書は技術・運用上のライセンス監査記録であり、弁護士による法律意見書ではない。提供元の条件変更、第三者権利、準拠法上の最終判断まで保証するものではない。

## 2. 判定基準

| 判定 | 意味 |
|---|---|
| 可 | 現在の用途、二次加工、再配布が公式条件上許容される。記載した出典・免責等は必要 |
| 条件付可 | 用途、契約、商用性、データセット固有の帰属、配信方法等に条件がある |
| 要対応 | 現状の同梱またはダウンロード提供を問題なしとは言明できない |
| 参照のみ | 取得候補または説明資料であり、現行の展示値には使っていない |

「二次加工」には、抽出、単位換算、色・座標への変換、補間、集計、相関・回帰、画像化を含む。「ダウンロード」には、画面上の保存ボタンだけでなく、公開サイトから静的JSON、GeoJSON、TopoJSON、PNGへ直接アクセスできる状態も含む。

## 3. 展示01〜10の外部データ一覧

| 展示／データ | このサイトでの利用・二次加工 | 公開／ダウンロード面 | 判定と条件 |
|---|---|---|---|
| NOAA SWPC OVATION 2020 | 30〜90分オーロラ予報を発光帯へ変換。5分更新、失敗時は同梱スナップショット | ライブJSONの加工表示、`data/ovation-aurora-snapshot.json` | **可**。NOAAを出典表示し、公式予報や保証済み観測と誤認させず、政府の推奨・承認を示唆しない |
| GOSAT FTS SWIR L3 XCO₂ | 公式閲覧画像の色から2.5°格子の近似ppmを復元し、8近傍IDW補完、時点間補間、過去年の空間再構成に使用 | 復元値・補完値を `data/gaia-signals.json` に同梱 | **要対応**。教育・学術目的等の利用と出典表示は認められるが、第三者配布は禁止。商用利用は事前相談が必要 |
| NOAA GML Mauna Loa CO₂ | 月平均を季節変化、長期傾向、過去再構成の濃度水準、直近120か月OLS試算へ使用 | 同梱JSON、画面内分析 | **可**。NOAA出典、改変・試算の明示、非公式加工物であることの明示が必要 |
| NASA GISS GISTEMP v4 | 全球気温偏差を背景色の応答へ変換 | 同梱JSON、加工表示 | **可**。NASA出典とデータセット引用を付し、NASAの承認を示唆しない |
| 気象庁 国内3地点CO₂ | 年平均を地点比較・統計教材へ使用 | 同梱JSON、画面内分析 | **可**。気象庁の出典と、編集した場合は編集した旨を表示。気象業務法上の予報・警報として提供しない |
| NASA/JPL PO.DAAC OSCAR | 海流データ候補として台帳に記載 | 取得失敗のため現行展示値には不使用 | **参照のみ**。表示値がOSCARであると誤認させない現行注記を維持 |
| NOAA CoastWatch Blended NRT currents | u/vから流速・流向を計算し、0〜14日の定常ベクトル移流を作品内計算 | 同梱JSON、統計・可視化 | **可**。NOAA出典、定常流を仮定した計算であること、公式予測でないことを明示 |
| NASA POWER | 31代表地点の風、降水、日射の気候値を抽出し、矢印、点、再生可能電力との比較へ使用 | 同梱JSON、画面内分析 | **可**。NASA POWERと元データを引用し、標本地点と気候値であることを明示 |
| NASA GIBS / MODIS MCD12Q1 | 2023年土地被覆WMSを1024×1024 PNGへ描画し、背景層に使用 | `assets/data/modis-land-cover-2023.png` | **可**。NASA／MODIS／GIBSを出典表示し、解析用の元画素ではなく表示画像である旨を維持 |
| GloBI pollination interactions | `Apis mellifera` の送粉関係を抽出し、非地理ネットワークへ変換 | 同梱JSON、画面内分析 | **可**。GloBIデータは原則CC BY 4.0。GloBIと可能な限り元データセットを帰属表示する |
| GBIF occurrences | 31か国から座標付き記録を最大2件ずつ抽出し、観察点と統計教材へ使用 | 同梱JSON、画面内分析 | **要対応**。レコードごとのライセンスと所有者識別子を保持していないため、再配布条件を検証できない |
| UN SDG 12.5.1 | 各国の最新非欠測値を抽出。欠測国は地理的5近傍中央値で補完し、SOURCEとIMPUTEDを分離 | 同梱JSON、画面内分析 | **条件付可**。UNdataを出典表示すれば複製・再配布可能。元の担当機関、報告年、補完箇所、加工者を明記する |
| Global Carbon Project / CICERO GCB2024 | 31か国の1945〜2023年の化石燃料由来CO₂を抽出し、記号半径を対数尺度化 | 同梱JSON、画面内分析 | **可**。CC BY 4.0として著者、版、DOI、変更内容を表示する |
| NASA GIBS / VIIRS Night Lights | 2016年WMSを固定背景PNGへ変換し、排出量とは独立した参照面として表示 | `assets/data/viirs-night-lights-2016.png` | **可**。NASA／VIIRS／GIBS出典、2016年固定参照である旨を維持 |
| 気象庁 震度データベース | 代表6地震の震度6弱以上の地点を抽出 | `data/jma-intensity-history.json` | **可**。出典と抽出・編集内容を明示し、公式警報・公式原票と誤認させない |
| USGS FDSN Event Web Service | M7.5以上の世界地震を取得し、年別集計と発生間隔へ加工 | 同梱JSON、画面内分析 | **可**。USGS出典、取得条件、加工内容を表示。第三者著作物が個別に示される場合はその条件を優先 |
| World Bank WDI: Forest area | 最新の森林率を31か国で抽出し、都市化率と比較・相関 | 同梱JSON、画面内分析 | **可**。WDIのCC BY 4.0、World Bankと原提供元FAOの帰属、変更表示が必要 |
| World Bank WDI: Urban population | 最新の都市人口率を31か国で抽出し、森林率・排出量と比較 | 同梱JSON、画面内分析 | **可**。World Bankと原提供元UN Population Divisionを帰属表示し、変更を示す |
| UNESCO World Heritage List | 世界各地域から登録物件を選び、文化・記憶レイヤーとカテゴリ統計へ使用 | 同梱JSON、画面内分析 | **要対応**。UNESCO/WHCはデータ再掲載に事前書面許可を要求。現在の同梱・公開配信を問題なしとは言明できない |
| World Bank WDI: Renewable electricity | 最新の再生可能電力比率を31か国で抽出し、POWERの自然条件と比較・回帰 | 同梱JSON、画面内分析 | **可**。CC BY 4.0の帰属、原提供元、変更表示が必要 |
| World Bank WDI: Population, total | 1960年以降の国別人口を時系列表示 | 同梱JSON、統計ラボへの将来連携対象 | **可**。CC BY 4.0の帰属、原提供元UN Population Division、変更表示が必要 |

## 4. 宇宙展示の外部データ一覧

`data/space-signals.json` は閲覧時に外部APIへ接続せず、取得済みスナップショットを配信する。したがって、このJSONの公開はデータの再配布に当たる。

| データ | 利用・二次加工 | 判定と条件 |
|---|---|---|
| NASA DONKI FLR / CME / GST / SEP | 時刻、等級、速度、Kp、関連イベント等を抽出し、光・円弧・磁力線・粒子へ変換 | **可**。NASA出典、取得期間、抽出項目、非公式可視化であることを表示 |
| NASA/JPL CNEOS CAD | 2024年の接近記録を抽出し、距離と速度を軌道表現へ変換 | **可**。NASA/JPL CNEOS出典と取得条件を表示 |
| NASA/JPL CNEOS Fireball | 火球の位置、エネルギー、速度を残光表現へ変換 | **可**。NASA/JPL CNEOS出典と推定値である旨を表示 |
| NASA Exoplanet Archive | 近傍1000件から距離、半径、質量、温度等を抽出し、同心円・色・大きさへ変換 | **条件付可**。Archiveの標準Acknowledgment、DOI、各文献由来値の引用を公開物へ付す |
| ISAS/JAXA DARTS Hayabusa2 LIDAR | Level 2時系列から高度・時刻等を抽出し、小惑星輪郭へ変換 | **可**。LIDAR BundleはCC BY 4.0。DOI `10.17597/isas.darts/hyb2-00500` とISAS/JAXA DARTSを帰属表示する |

## 5. ライブ展示09〜12の外部データ一覧

| データ | 取得・加工 | 判定と条件 |
|---|---|---|
| NOAA NDBC latest observations | ハワイ周辺の最寄り観測点を選択し、風速・風向・気温を表示。取得失敗時は同梱スナップショット | **可**。NOAA/NDBC出典、観測時刻、観測点、フォールバック状態を表示 |
| NOAA GML Mauna Loa hourly CO₂ | ERDDAPの最新時別値を抽出。取得失敗時は同梱スナップショット | **可**。NOAA/GML出典、時刻、品質・速報性を表示 |
| JAXA GSMaP daily precipitation | Hawaii bboxの降水量を集計。現在の本番フラグは無効だがフォールバック値を同梱 | **条件付可**。JAXAは利用・改変・派生物配布を認めるが出典表示が必要。商用利用は事前通知が必要 |
| Copernicus Sentinel-5P L2 NO₂ NRTI | 72時間・品質マスク付きbbox平均。現在の本番フラグは無効だがフォールバック値を同梱 | **可**。Sentinelデータは自由・完全・オープン。公開・配布時は「Contains modified Copernicus Sentinel data [YEAR]」相当の通知を付す |
| Open-Meteo weather | 21都市の現在天気を30分キャッシュで取得 | **条件付可**。データはCC BY 4.0で再配布可能だが、無料APIサービスは非商用・上限内に限定。商用運用は契約またはセルフホストが必要 |
| Open-Meteo Air Quality / CAMS | CO₂・PM2.5等を3時間キャッシュで取得 | **条件付可**。上記に加え、Open-MeteoとCAMS／各元モデルの帰属を表示する |

## 6. 地図・地域コード・補助データ

| データ | 利用・公開状態 | 判定と条件 |
|---|---|---|
| Natural Earth 1:50m Land / Countries | GeoJSONを同梱し、Canvasで陸地・国境を描画 | **可**。Public Domain。加工・電子配布・商用利用可。任意の推奨表記「Made with Natural Earth」を維持するとよい |
| 地球地図日本／国土地理院（dataofjapan変換TopoJSON） | 47都道府県境界を同梱し、地図に重ねる | **条件付可**。現行の展示は出典表示で利用可能と判断。生TopoJSON再配布、商用利用、測量成果としての複製に該当する用途はGSI条件・測量法上の手続を個別確認する |
| OpenStreetMap Standard raster tiles | `tile.openstreetmap.org` を都市地図の表示に使用 | **条件付可**。画面表示は可。見える位置の帰属、Referer、HTTPキャッシュを維持し、タイルの一括取得・オフライン保存・再配布を提供しない。高負荷時は別プロバイダまたは自己ホストへ移行 |
| Unicode CLDR 48.2 | 国・行政区分コードと英語名を生成 | **可**。Unicode License v3の許諾文を付属文書へ保持する。`docs/REGION-CODE-SOURCES.md` に全文を収録済み |
| J-LIS 全国地方公共団体コード | 6桁コードと自治体名だけを抽出し、センサー登録候補へ使用 | **条件付可**。出所明示が必要。J-LISサイト条件は営利目的の複製に事前相談を求め、無断改変を認めていない |
| 国土地理院の自治体庁舎検索結果 | 日本地域選択時の初期POI座標としてキャッシュ | **条件付可**。公開POIであること、初期値であること、GSI出典を表示。地図・測量成果の再配布として使う場合は個別確認する |
| `data/japan-earthquakes-fallback.json` | USGS週間M2.5+フィードの旧フォールバック。現行コードから参照されないが公開配置 | **可**。USGS出典を保持。不要なら公開対象から除外する方が台帳を簡潔にできる |
| `assets/data/jaxa-fnf-riau.png` | 現行コードから参照されないが公開配置 | **要対応**。取得元、版、加工方法を確定できず、JAXA FNF元データはそのままの再配布を禁止。確認完了まで公開対象から除外する |

## 7. 参考文献としてのみ使用する外部情報

`data/gx-deep-time.json` のInternational Chronostratigraphic Chart、USGS解説、国立科学博物館、IUGS/ICS、PNAS、Nature等は、年代・地質説明の事実確認と出典リンクに使っている。論文本文、図版、表を同梱・再配布していないため、本監査では「外部データの再配布」ではなく参考文献・要約として扱う。

要約はサイト独自文であり、出典リンクを維持し、原文・図表の大量転載を行わない限り、現在の使い方に問題はないと判断する。

## 8. 現在のダウンロード経路と評価

### 8.1 静的ファイルの直接取得

Cloudflare Pagesの公開ルートにある次のファイルは、画面にダウンロードボタンがなくてもURLを知れば取得できる。

- `data/gaia-signals.json`
- `data/space-signals.json`
- `data/gx-deep-time.json`
- `data/jma-intensity-history.json`
- `data/japan-earthquakes-fallback.json`
- `data/live-observation-fallback-v1.json`
- `data/ovation-aurora-snapshot.json`
- `data/natural-earth-50m-land.geojson`
- `data/natural-earth-50m-countries.geojson`
- `data/japan-prefectures.topojson`
- `assets/data/modis-land-cover-2023.png`
- `assets/data/viirs-night-lights-2016.png`
- `assets/data/jaxa-fnf-riau.png`

このため、公開リポジトリへの同梱とPagesへの配置は「表示だけ」ではなく、複製物または加工物の配布として判定した。

### 8.2 統計ラボの書き出し（廃止済み）

2026-09-02に、統計ラボから選択データをCSV／JSONへ、グラフをPNGへ保存するボタン、生成処理、公開JavaScript APIをすべて削除した。分析結果は画面内表示に限定され、統計ラボ内に `download` 属性を持つ要素も存在しない。

この変更により、GBIF、UNESCO、GloBI、World Bank等の外部データをサイト機能からファイルとして書き出す経路はなくなった。ただし、8.1の公開静的ファイルはアプリ表示に必要な配信物であり、URLから直接取得できる状態が残るため、再配布条件の監査対象からは外せない。

### 8.3 外部の「元データを開く」リンク

公式サイトを新しいタブで開くだけの導線は、このサイトによる再配布ではない。リンク先の利用者が公式条件に従って取得するため、同梱データより権利上のリスクは低い。

## 9. 必須是正

### 優先度P0: 全体を「問題なし」と言明する前に必要

1. **GOSAT**: NIES GOSAT Project Officeから、本サイトでの表示、画像からの数値復元、加工格子の公衆送信・直接取得可能な公開配信について書面許可を得る。許可がない場合は、GOSAT由来の格子、補完、過去再構成を公開JSONから除外し、公式サイトへのリンクだけにする。
2. **UNESCO**: 世界遺産データの再掲載許可を得るか、同梱・公開配信をやめる。代替する場合は、明示的にオープンライセンスされた別データ源へ切り替え、出典を変更する。
3. **GBIF**: 取得時に `license`、`datasetKey`、`publishingOrgKey`、`occurrence key`、`references` を保存する。商用利用を想定する場合はCC BY-NCを除外し、各レコードの所有者識別子とデータセット引用を再配布物に残す。
4. **JAXA FNF未使用PNG**: `assets/data/jaxa-fnf-riau.png` を公開対象から除外するか、元ファイル、版、加工工程、許諾、必須クレジットを特定して台帳へ登録する。

### 優先度P1: 条件履行を機械的に保証するために必要

5. 各データセットへ `licenseName`、`licenseUrl`、`attribution`、`modifiedNotice`、`commercialUse`、`redistribution` を持たせる。
6. 廃止したCSV／JSON／PNG書き出しを、権利メタデータと再配布条件の再監査なしに復活させない。
7. Open-Meteoの `licenseUrl` を料金ページではなく公式の `/en/terms` または `/en/licence` に変更し、無料APIは非商用であることを運用文書へ明記する。
8. JAXA GSMaPを商用運用する場合はJAXAへ事前通知する。Open-Meteoを商用運用する場合は有料契約またはセルフホストへ切り替える。
9. DARTS LIDAR、NASA Exoplanet Archive、World Bank原提供元、GloBI元データセットの引用を画面と書き出しへ追加する。
10. READMEの「EDGAR」表記を、実装どおりGlobal Carbon Project / CICEROへ統一する。

### 優先度P2: 配信事故を防ぐ運用改善

11. OpenStreetMap標準タイルをダウンロード対象から明示的に除外し、アクセス増加時は利用量を保証するタイル事業者または自己ホストへ移行する。
12. 公開ビルドの許可リストを作り、未使用の外部データファイルを自動的に配信しない。
13. データ更新時に、データセット版、取得日時、ライセンスURL、SHA-256、加工スクリプト版をCIで検査する。

## 10. 是正後に使用できる最終言明文

P0とP1を完了し、再監査で差分がないことを確認した後は、次の文言を公開レポートの結論として使用できる。

> GAIA SENSEWAREが利用する外部データについて、提供元、取得日、適用ライセンス、加工内容、表示箇所、ダウンロード経路を確認した。各データは、出典表示、改変表示、用途・商用条件、再配布条件を満たす範囲で利用しており、サイト上の表示、明記した二次加工、出典・ライセンスを伴う加工結果のダウンロードに、監査日時点で判明している権利上の問題はない。元データの権利は各提供元に帰属し、本サイトは提供元の承認・保証を示唆しない。

現状はP0未完了のため、この最終言明文はまだ適用しない。

## 11. 根拠となる公式利用条件

- [NOAA National Ocean Service Disclaimer](https://oceanservice.noaa.gov/disclaimer.html)
- [NOAA digital media copyright guidance](https://sos.noaa.gov/copyright/)
- [NASA Earthdata: Data Use and Citation Guidance](https://www.earthdata.nasa.gov/engage/open-data-services-software/data-use-policy)
- [Natural Earth: Terms of Use](https://www.naturalearthdata.com/about/terms-of-use/)
- [気象庁ホームページ利用規約](https://www.jma.go.jp/jma/kishou/info/coment.html)
- [USGS Copyrights and Credits](https://www.usgs.gov/information-policies-and-instructions/copyrights-and-credits)
- [NIES GOSAT Project: Site Policy](https://www.gosat.nies.go.jp/eng/about/policy.htm)
- [World Bank Data Catalog: Data Access and Licensing](https://datacatalog.worldbank.org/public-licenses)
- [GBIF Terms of Use](https://www.gbif.org/terms)
- [GBIF Data User Agreement](https://www.gbif.org/terms/data-user)
- [GloBI repository and data license](https://github.com/globalbioticinteractions/globalbioticinteractions)
- [UNdata Terms and Conditions of Use](https://data.un.org/Host.aspx?Content=UNdataUse)
- [Global Carbon Project fossil CO₂ dataset, DOI 10.5281/zenodo.13981696](https://zenodo.org/records/13981696)
- [Open-Meteo Terms](https://open-meteo.com/en/terms)
- [Open-Meteo Data Licence](https://open-meteo.com/en/licence)
- [Copernicus Data Space Ecosystem Terms and Conditions](https://dataspace.copernicus.eu/terms-and-conditions)
- [Copernicus Sentinel data use summary](https://documentation.dataspace.copernicus.eu/APIs/SentinelHub/Data/S3OLCIL2.html)
- [JAXA Terms of Use of Research Data](https://earth.jaxa.jp/en/data/policy/)
- [JAXA ALOS FNF data use notice](https://www.eorc.jaxa.jp/ALOS/palsar_fnf/fnf_jindex20140116.htm)
- [Hayabusa2 LIDAR Bundle, DOI 10.17597/isas.darts/hyb2-00500](https://darts.isas.jaxa.jp/doi/hyb2/hyb2-00500.html)
- [NASA Exoplanet Archive acknowledgment guidance](https://exoplanetarchive.ipac.caltech.edu/docs/acknowledge.html)
- [UNESCO/WHC data conditions of use](https://whc.unesco.org/en/faq/126)
- [国土地理院 地球地図日本](https://www.gsi.go.jp/kankyochiri/gm_jpn.html)
- [国土地理院 地図の利用手続](https://maps.gsi.go.jp/help/intro/general/tetuduki.html)
- [OpenStreetMap Standard Tile Usage Policy](https://operations.osmfoundation.org/policies/tiles/)
- [Unicode License v3](https://www.unicode.org/license.txt)
- [J-LIS リンク・著作権について](https://www.j-lis.go.jp/cms_1142.html)

## 12. 監査した実装箇所

- `scripts/build-gaia-data.mjs`: 展示01〜10の取得・抽出・加工
- `data/gaia-signals.json`: 同梱データ、SOURCE／DERIVED／SCENARIO台帳
- `scripts/build-space-data.mjs`, `data/space-signals.json`: 宇宙展示の取得とスナップショット
- `sensor-platform/src/live-senseware.ts`, `data/live-observation-fallback-v1.json`: ライブ取得、キャッシュ、フォールバック
- `app.js`, `space-mode.js`, `data-ledger.js`: 表示、地図、出典UI
- `statistics-lab.js`: ブラウザ内の分析・画面表示（ファイル書き出しなし）
- `scripts/build-region-code-data.mjs`, `sensor-platform/src/region-code-data.ts`: CLDR・J-LIS地域コード
- `data/japan-prefectures-NOTICE.md`, `docs/REGION-CODE-SOURCES.md`: 地図・コードの既存出典記録
