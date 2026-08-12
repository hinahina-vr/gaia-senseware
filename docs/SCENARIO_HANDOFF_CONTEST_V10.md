# コンテスト短尺版 v10｜正本・移行・演出境界

## freeze正本

- 入力: `contest-limited/story/機能限定版台本.md`
- 正本: `story/物語台本.md`
- UTF-8 / LF / 53,597 bytes / 1,019 lines
- SHA-256: `b59f43f536d727d73fcf95d19298f1750f66092a6dbcbd207fedad9b3cb1aa8d`
- 本文・scene ID・scene-metaは入力から変更しない。

## scene順とmetadata

| sceneId | chapter | duration | location | step |
|---|---|---|---|---:|
| `festival_concept` | `01 / CONCEPT` | `0:00–1:45` | オンライン大学・年次対面イベント／学生作品・体験展示ホール | 76 |
| `map_mode01` | `02 / MAP 01` | `1:45–3:25` | 展示端末・地図MODE 01 | 43 |
| `gx_experience` | `03 / DEEP TIME` | `3:25–5:35` | 展示端末・GX／太古の海 | 58 |
| `esp32_pitch` | `04 / PROPOSAL` | `5:35–7:15` | 年次対面イベント・GAIA SENSEWARE展示ブース | 43 |
| `circle_invitation` | `05 / AFTER SCHOOL` | `7:15–9:05` | 年次対面イベント・GAIA SENSEWARE展示ブース | 81 |
| `welcome_chat` | `06 / WELCOME` | `9:05–11:30` | 学内チャット「惑星の放課後」／閉場後の展示ホール | 95 |

絶対日付はfreeze正本にないため補完しない。各sceneは`CURRENT / APPROXIMATE`とし、可視見出しはscene-metaの`duration｜location`から生成する。

## interaction境界

| scene | PREP | interaction | return | POST | kind / target |
|---|---|---|---|---|---|
| `map_mode01` | `_001`〜`_003` | `map_mode01_004` | `_005` | `_005`〜`_043` | `map01` / MODE index 0 / `breathing-earth` / `#japan-layer` |
| `gx_experience` | `_001`〜`_016` | `gx_experience_017` | `_018` | `_018`〜`_058` | `gx` / `#gx-layer` |

interaction stepは本文を追加しないmetadata-only step。PREPの人物台詞後に実clickで開き、CLOSE後にfreeze本文へ戻る。自動openしない。ほかのinteraction kindは本編に置かない。

`gx_experience_046`はfreeze正本の三択`demo_interest`。選択値は同scene後続の`{{demo_interest}}`だけへ表示し、旧E.V.E.S.や後半分岐へ接続しない。

## welcome_chat presentation境界

- `_001`〜`_054`: 学内chat surface（wide）。人物のlarge cast / portrait / voiceは出さない。
- `_055`〜`_077`: 会場で隣にいるミズハ／アマネとの物理会話。通常の展示画面へ戻す。
- `_078`〜`_095`: 帰路のスマートフォン（mobile）。desktopでも縦型、390pxでは二重frameを作らない。
- sakuは`chat` stepだけ。cast / portrait / avatar / voiceは全区間0。

## v9以前のsave移行

- `storyVersion`は10。
- v9以前の`stepId`、旧scene到達、既読、interaction完了、選択、clear、archiveは新routeへ持ち込まず、進行だけ`festival_concept_001`へ移す。
- 音量・muteと、別storageの表示設定は保持する。
- v10の有効な`stepId`はそのまま復帰する。v10の未知`stepId`は`festival_concept_001`へ安全復帰する。
- 未知のsave fieldは利用せず、loadを失敗させない。manual saveも同じnormalize経路を使う。

旧1022step本文はgit履歴にのみ残し、本編route・JUMP・SCRIPT・LOGへ混入させない。
