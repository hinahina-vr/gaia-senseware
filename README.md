# GAIA SENSEWARE

**地球を聴く、10の窓**

地球を操作対象ではなく、触れるたびに応答する「共創の相手」として体験する、
ブラウザ上のインタラクティブ・インスタレーションです。

画面に触れた軌跡は各作品の記憶として蓄積されます。第10章では、それまでの九つの
記憶が一つの未来の地球へ再集合します。

## 10の作品

1. **Breathing Earth / 呼吸する地球** — 地球の膜と呼吸を感じる
2. **Blue Circulation / 蒼い循環** — 海流と水循環に触れる
3. **Forest Cloud Engine / 森の雲生成器** — 森林と大気の往復を見る
4. **Pollination Protocol / 受粉プロトコル** — 花粉と送粉者のネットワークを結ぶ
5. **Nothing Is Waste / 廃棄物という誤解** — 直線的な消費を循環へ戻す
6. **Anthropocene Scar / 人新世の傷跡** — 人工的な格子と回復する生命を重ねる
7. **Rhythm of Disaster / 災いと恵み** — 変動と再生の時間に同期する
8. **Three Ecologies / 三つの生態系** — 生態・社会・精神の重なりを聴く
9. **Earth Organ / 人工物の共生化** — 都市回路を地球の器官へ変える
10. **Senseware 2050 / 共創地球** — 九つの体験から、その場限りの未来を描く

## 操作

- 画面をマウスで動かす／ドラッグする、または指でなぞる
- 下部の `01`〜`10`、左右矢印、キーボードの矢印キーで作品を切り替える
- `AUTO` で18秒ごとの自動展示モードを切り替える
- `CODE` で現在の作品に使われているGLSLコードを表示する
- `RESET` で軌跡と10作品の記憶を消去する

## 技術と応募規約

- HTML / CSS / JavaScript
- ブラウザ標準のWebGL2 APIと自作GLSL
- Pointer Eventsによるマウス・タッチ入力
- React、Three.js、jQuery、CDN、外部フォントなどの外部依存なし
- ビルド処理なし
- PC版・スマートフォン版Google Chrome対応
- GitHub Pagesでそのまま配信可能

## ローカルで開く

`index.html` をGoogle Chromeで直接開くか、このディレクトリで静的サーバーを起動します。

```powershell
python -m http.server 8080
```

その後、`http://localhost:8080/` を開いてください。

## ファイル構成

- `index.html` — 作品の構造とアクセシビリティ情報
- `styles.css` — 展示UI、レスポンシブレイアウト、コードパネル
- `app.js` — WebGL2描画、10種のGLSL、遷移、入力とセッション記憶
