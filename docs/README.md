# GAIA SENSEWARE ドキュメント索引

このディレクトリには、応募・実装・権利・物語制作の資料が混在しています。2026-09-04時点の現行資料と、制作途中の引継ぎ記録を次のように区別します。

## 最初に読む資料

| 資料 | 役割 |
|---|---|
| [../README.md](../README.md) | 作品全体、31地図展示、各モード、起動・検査方法 |
| [CONTEST_2026_SUBMISSION.md](CONTEST_2026_SUBMISSION.md) | コンテスト審査用のURL、確認順、技術・データ・権利の要約 |
| [ARCHITECTURE.md](ARCHITECTURE.md) | 遅延読込、データ経路、アダプター、イベント、フォールバック |
| [EXTERNAL_DATA_USAGE_AUDIT.md](EXTERNAL_DATA_USAGE_AUDIT.md) | 外部データの利用条件、加工、再配布、未解決事項 |
| [MEDIA_RIGHTS_LEDGER.md](MEDIA_RIGHTS_LEDGER.md) | 画像・音声・フォント等の人間向け権利台帳 |
| [media-rights-ledger.json](media-rights-ledger.json) | CIが検査する機械可読の権利台帳 |

## 実装・運用資料

| 資料 | 役割 |
|---|---|
| [SENSOR-MEASUREMENT-CATALOG.md](SENSOR-MEASUREMENT-CATALOG.md) | 参加型センサーの測定項目、単位、検証規則 |
| [REGION-CODE-SOURCES.md](REGION-CODE-SOURCES.md) | 国・地域・自治体コードの出典とライセンス |
| [NOVEL_MODE_IMPLEMENTATION_GUIDE.md](NOVEL_MODE_IMPLEMENTATION_GUIDE.md) | ノベルUIの実装上の補足。台本文言の正本ではない |
| [../story/README.md](../story/README.md) | 台本の正本、生成物、統合台本、更新手順 |

## 世界観の正本

| 資料 | 役割 |
|---|---|
| [GAIA_SENSEWARE_GX_OFFICIAL_SETTING.md](GAIA_SENSEWARE_GX_OFFICIAL_SETTING.md) | 現代編、キャラクター、GXの公式設定 |
| [GAIA_SENSEWARE_BEYOND_SAELIVA_CANON.md](GAIA_SENSEWARE_BEYOND_SAELIVA_CANON.md) | APEIRONCENEとSÆLIVAの設定 |
| [../story/現行統合台本.md](../story/現行統合台本.md) | 現在画面に出る本編・スタッフロール・APEIRONCENEの確認用正本 |

## 制作記録・過去仕様

次のファイルは、制作過程の判断や特定改修の引継ぎを残す資料です。現行UIや台本の正本ではありません。内容が競合するときは、実装、ルートREADME、アーキテクチャ、台本管理資料を優先します。

- `SCENARIO_HANDOFF_*.md`
- `SCENE_SPEC_*.md`
- `UI_BACK_HALF_SURFACE_HANDOFF.md`
- `EVES_COPY_SPEC.md`
- `GAIA_SENSEWARE_META_WORLD_TRUE_END_DESIGN.txt`
- `GAIA_SENSEWARE_STORY_SCRIPT.txt`

## 更新ルール

1. 展示数、モード名、直接URL、API経路を変えたら、ルートREADME、応募ガイド、アーキテクチャを同じ変更で更新します。
2. 台詞を変えるときは[story/README.md](../story/README.md)の生成手順に従い、生成済みJavaScriptを直接編集しません。
3. データセット、取得方法、加工、配信範囲を変えたら外部データ監査を更新します。
4. 画像・音声・フォントを追加または差し替えたら機械可読台帳を更新し、`npm run check:rights` を実行します。
5. 応募前は `npm run check:contest` と `npm run check` を実行し、公開GitHubのコミットとCloudflare Pagesの配布物を一致させます。
