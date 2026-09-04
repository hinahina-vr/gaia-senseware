# 惑星の放課後

**GAIA SENSEWARE / GAIA SENSATION**

[![Contest checks](https://github.com/hinahina-vr/gaia-senseware/actions/workflows/contest-checks.yml/badge.svg)](https://github.com/hinahina-vr/gaia-senseware/actions/workflows/contest-checks.yml)

公開データとして保存された地球の変化を、光・色・動き・音へ翻訳するインタラクティブ作品です。地球観測の可視化、女子学生3人の共同制作を描く物語、参加型センサー、宇宙データ、音楽・キャラクター資料をひとつのWebサイトにまとめています。

- 公開サイト: <https://gaia-senseware.pages.dev/>
- 30秒ガイド: <https://gaia-senseware.pages.dev/#tour>
- コンテスト応募情報: [docs/CONTEST_2026_SUBMISSION.md](docs/CONTEST_2026_SUBMISSION.md)
- 実行構成: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- ドキュメント索引: [docs/README.md](docs/README.md)

## 審査で最初に見る場所

1. [公開サイト](https://gaia-senseware.pages.dev/)でサウンド設定を選び、オープニング後に `物語をはじめる` または `データを探索する` を選択します。
2. [30秒ガイド](https://gaia-senseware.pages.dev/#tour)で、地図・年代・データ変換の基本操作を確認します。
3. `MAP 26—31` で、データ時刻、現在時刻からの経過、ライブ／キャッシュ／保存値の状態を確認します。
4. 各地図展示の `OPEN DATA` と `CODE` で、出典、元の値、加工、描画への対応を確認します。
5. `STORY` で、逗子海岸の展示会から始まる10〜12分の本編と、解放後の `APEIRONCENE` を体験します。

| PC | スマートフォン |
|---|---|
| ![PC版のサウンド選択とキービジュアル](docs/screenshots/contest-entry-pc.png) | ![スマートフォン版の30秒ガイド](docs/screenshots/contest-tour-mobile.png) |

## 現在のコンテンツ

| モード | 内容 |
|---|---|
| `MAP` | 公開データを重ねる地図展示31本。保存データ、国内統計、ライブ／モデル値を同じUIで比較 |
| `STORY` | 本編6章・372ステップ。逗子海岸の展示会、地図、GX、ESP32の提案、放課後の共同制作を描く |
| `APEIRONCENE` | 本編後に解放される3章・133メッセージ。約270万年後に発掘された基板から物語が続く |
| `SENSOR` | 端末やESP32をひとつのセンサーとして参加させる任意拡張 |
| `CHARACTER` | 雨音・瑞葉・咲弥の設定と表情、物語CG6枚 |
| `SOUND` | テーマ曲・劇伴など12曲と、音に反応するビジュアライザー |
| `GX` | 酸素を「最初の廃棄物」として捉え、生物と環境の関係をたどる `THE FIRST GX` |
| `ORBITAL` | 太陽活動、小天体、系外惑星、リュウグウを読む10の観測窓 |
| `TOUR` | 地図操作、年代比較、`SOURCE / DERIVED / SCENARIO` を各10秒で案内する30秒ガイド |

入口のデータ探索画面には `世界を観測する`、`みんなのセンサー`、`登場人物の記録`、`音楽を聴く` の4枚のカードがあります。物語とGXにも同じ画面から移動できます。

## MAP 01—31

| 番号 | 区分 | 展示 |
|---|---|---|
| 01—09 | 基礎展示 | 地球の一呼吸、海流が14日続いたら、森林と降水量を重ねる、再資源化率を比べる、人類世の傷跡、地球からのメッセージ、三つの生態系、人工物の共生化、人口のうねり |
| 10—15 | ライブ／モデル | 風脈、炭素の呼吸、雨の記憶、熱の輪郭、雲の層、微粒子の霞 |
| 16—25 | 日本の公的統計 | 人の潮目、旅の灯、住まいの芽吹き、空の体温、夏の頂、冬の底、湿りの膜、光の貯金、雨の器、雨の足跡 |
| 26 | 全球・直近24時間 | 燃える惑星 — NASA FIRMSの火災・熱異常 |
| 27—31 | 全球・ライブ公開データ | 大気をなぞる、海の脈動、大気の散乱、地殻の波紋、太陽風の到着 |

### データの取得経路と鮮度

| 対象 | 取得経路 | 画面上の扱い |
|---|---|---|
| 01—09 | `data/gaia-signals.json` などの版管理スナップショット。01のオーロラ層だけはNOAA SWPC OVATIONを直接取得し、失敗時に保存値へ切替 | 観測・統計の期間と取得日を表示。未来投影は `SCENARIO` として分離 |
| 10—15 | Cloudflare Pages APIの `/api/live/v1/snapshot`、`/stream`、`/wind-field`。現在の展示値はOpen-MeteoとCAMS | 提供元、地点、JPTのデータ時刻、更新方法、ライブ／保存値の状態を表示 |
| 16—25 | e-Statと気象庁から生成した `data/estat-prefecture-series.json` | 月次・年次・1955〜2025年の長期系列を、47都道府県で比較。閲覧時の外部API通信なし |
| 26 | Pages APIの `/api/live/v1/firms` からNASA LANCE FIRMSを取得 | 取得時刻と観測時刻を分け、UTCの最新時刻と経過時間を表示。失敗時は版管理スナップショット |
| 27—31 | ブラウザからOpen-Meteo、USGS、NOAA SWPCの公開APIを直接取得 | UTCのデータ時刻と経過時間、ライブ／5分キャッシュ／保存値の状態を表示 |
| ORBITAL | `data/space-signals.json` | 閲覧時は外部APIへ接続せず、収録期間・取得日時・単位・加工を表示 |

リアルタイム系の値が取れない場合は、最後の正常値または同じ項目・単位の保存値へ切り替えます。保存値をライブ値として表示することはありません。

## データが表現になるまで

| 区分 | 意味 | 例 |
|---|---|---|
| `○ SOURCE / 公開記録` | 提供元が公開した観測・統計・モデル値 | CO₂濃度、気温、風速、波高、震源、太陽風 |
| `△ DERIVED / 計算・補間` | 元データから計算した値 | 欠測補完、線形補間、正規化、集計、表示用の尺度変換 |
| `◇ SCENARIO / 仮定・操作` | 仮定または観客操作で作る状態 | 2026〜2050年の線形トレンド試算、一定海流を仮定した移動距離 |
| `VISUAL / 表現` | 数値を画面へ割り当てた結果 | 風速→筆触、FRP→粒径、波高→波紋、太陽風速度→粒子速度 |

各展示の `OPEN DATA` には、現在の演出に関係するデータだけを表示します。提供機関、公式URL、取得日、観測期間、単位、空間・時間解像度、加工内容、注意事項を確認できます。`CODE` は `VISUAL CODE / DATA TRANSFORM / RAW DATA` の3タブです。

外部データの利用条件と未解決事項は[外部データ監査](docs/EXTERNAL_DATA_USAGE_AUDIT.md)、素材は[権利台帳](docs/MEDIA_RIGHTS_LEDGER.md)を正本として扱います。監査文書で `要対応` としたデータを、無条件に再利用可能とは案内していません。

## STORY

本編は、オンラインでコードやデータをやり取りしていた3人が、逗子海岸の展示会で初めて顔を合わせるところから始まります。公開データをシェーダーで描く展示を一緒に見て、ESP32を使った新しい観測方法を考え、放課後の共同制作へ進みます。

- 本編: 6章、372ステップ、約10〜12分
- APEIRONCENE: 3章、133メッセージ
- 操作: クリック／タップ／Space、AUTO、早送り、LOG、SAVE／LOAD、設定、シーンジャンプ
- 保存: ブラウザのローカル保存。サーバーへ物語の進行を送信しません
- 台本の正本と生成手順: [story/README.md](story/README.md)
- 現在画面に出る統合台本: [story/現行統合台本.md](story/現行統合台本.md)

場面転換では、次の背景と章セパレーターを先に準備してから画面をフェードさせます。新規開始時や章送りで、基礎のWebGL背景や無地の画面を一瞬見せないことをブラウザテストで確認しています。

## ORBITAL

10の観測窓では、NASA DONKIの太陽フレア・CME・磁気嵐・高エネルギー粒子、NASA/JPL CNEOSの小惑星接近・火球、NASA Exoplanet Archiveの系外惑星、ISAS/JAXA DARTSのはやぶさ2 LIDARを表示します。

データは `data/space-signals.json` に保存済みです。閲覧中はAPIへ接続せず、更新時だけ `npm run data:space` を実行します。`DATA / SOURCE` では、提供機関、URL、取得時刻、期間、単位、加工、注意点、先頭10行を確認できます。

## SENSOR

`/sensors/#map` は任意拡張です。端末センサーまたはESP32の計測をCloudflare Pages Functionsへ送り、D1へ保存して共有地図に表示します。センサーがなくてもMAP、STORY、CHARACTER、SOUND、GX、ORBITAL、TOURは最後まで利用できます。

- 対応測定項目: [docs/SENSOR-MEASUREMENT-CATALOG.md](docs/SENSOR-MEASUREMENT-CATALOG.md)
- APIとWorker実装: `sensor-platform/`
- ブラウザUI: `sensors/`

## 技術構成

- HTML、CSS、JavaScript、WebGL 2、Canvas 2D、Web Audio API
- ブラウザへ外部JavaScriptランタイムライブラリを配信しない構成
- モード単位の遅延読込: exploration / story / gx / space / sound / character / tour
- Natural Earth 1:50m Land / Countriesと国土地理院由来の都道府県境界
- Cloudflare Pages / Pages Functions / D1
- ESP32クライアントは任意
- 描画負荷に応じてDPR・粒子・効果を調整する動的LOD
- WebGL 2を使えない環境向けの静的フォールバック

背景・キャラクターはOpenAI ImageGenで制作し、音楽は主にSuno AIを使用しています。地図展示用の一部音源は、リポジトリ内のNode.jsスクリプトで合成しています。詳細は[メディア権利台帳](docs/MEDIA_RIGHTS_LEDGER.md)に記録しています。

## ローカルで開く

Node.js 20以上を使用します。

```powershell
npm ci
npx http-server . -p 4173 -c-1
```

ブラウザで <http://127.0.0.1:4173/> を開きます。`file://` ではJSON、ES Modules、音声の読込制限があるため、ローカルHTTPサーバーを使用してください。

主な直接URL:

- `http://127.0.0.1:4173/#tour`
- `http://127.0.0.1:4173/#story`
- `http://127.0.0.1:4173/#earth`
- `http://127.0.0.1:4173/#character`
- `http://127.0.0.1:4173/#sound`
- `http://127.0.0.1:4173/?space=1`

## 検査

```powershell
npm run check
npm run check:contest
npm run check:rights
npm --prefix sensor-platform run typecheck
npm --prefix sensor-platform run check:pages-worker
npm --prefix sensor-platform run test:pages
```

GitHub Actionsの `Contest checks` は実Google Chromeで、初期転送量、PC／モバイルレイアウト、遅延読込、直接URL、履歴・再読込、WebGLフォールバック、31展示の主要導線、JavaScriptエラー、未処理Promise、404を検査します。CIからpushやデプロイは行いません。

## 主なファイル

```text
index.html                         軽量な入口と遅延挿入テンプレート
gaia-mode-loader.js               モード単位の読込と直接URL処理
app.js / app-content.js           MAP 01—09と地図ランタイム
src/exploration/                  MAP 10—31、ライブ取得、LOD
novel-mode.js                     物語UI、保存、場面転換
novel-story-data.js               生成済み本編データ
true-end-data.js                  生成済みAPEIRONCENEデータ
character-mode.js                 キャラクター資料とCGアルバム
sound-mode.js                     12曲の音楽アーカイブ
space-mode.js / space-scenes.js   ORBITAL 10展示
sensor-platform/                  Pages Functions、D1、ESP32関連
sensors/                          参加型センサーのブラウザUI
data/                             表示用スナップショット
scripts/                          データ生成と自動検査
docs/                             応募、構成、権利、設計資料
```

作品設定の正本は[GAIA SENSEWARE GX 公式設定](docs/GAIA_SENSEWARE_GX_OFFICIAL_SETTING.md)、公開データの詳細は[外部データ監査](docs/EXTERNAL_DATA_USAGE_AUDIT.md)を参照してください。
