# Production setup (external changes — HOLD until release approval)

このcandidateはCloudflare Pages Functions advanced modeとlocal D1までを検証し、Cloudflare/Googleの外部resourceを作成しません。production originは `https://gaia-senseware.pages.dev`、Google callbackは `https://gaia-senseware.pages.dev/api/auth/google/callback` です。

## 1. Pages Functions / D1

repository rootの構成をproductionのsource of truthとします。

- `wrangler.jsonc`: Pages project `gaia-senseware`、build output `.`、D1 binding `DB`、production vars
- `sensor-platform/src/pages-entry.ts`: advanced-mode entrypointのsource。`/api/*` をSensor Platform handlerへ渡し、それ以外は `env.ASSETS.fetch(request)` へ渡す
- `_worker.js`: `scripts/build-sensor-pages-worker.mjs` がWrangler 4.121.0のlocal dry-run bundlerで生成する、単一self-contained JavaScript upload artifact。手編集しない
- `_routes.json`: Function invocationを `/api/*` のみに限定。story、sensor SPA、主要assetは静的配信
- health check: `GET /api/health`（legacy health endpointは使用しない）

公開承認後のD1操作:

1. `wrangler d1 create gaia-senseware-sensors`
2. 返されたproduction UUIDをroot `wrangler.jsonc` のD1 bindingへ設定し、別candidateとして再検証する
3. `wrangler d1 migrations apply gaia-senseware-sensors --remote --config wrangler.jsonc`

現在のPages設定にproduction D1は存在しないため、UUIDを架空値で埋めていません。D1作成・UUID反映は外部変更承認後に行います。

`node scripts/build-sensor-pages-worker.mjs --check` はsourceから一時bundleを再生成し、tracked `_worker.js`とのbyte一致、TypeScript import残存0、source map参照0、secret埋込0、ASSETS fallbackを検査します。source変更後にartifactがstaleなら失敗します。

## 2. Google OIDC / secrets

Google Cloud ConsoleでWeb application OAuth clientを作成し、次のAuthorized redirect URIを完全一致で登録します。

`https://gaia-senseware.pages.dev/api/auth/google/callback`

Pages projectへ登録するsecret（全て別値）:

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `SESSION_SECRET`（32 random bytes以上）
- `DEVICE_TOKEN_PEPPER`（32 random bytes以上）
- `PAIRING_CODE_PEPPER`（32 random bytes以上）

`wrangler pages secret put <NAME> --project-name gaia-senseware` のinteractive promptを使い、値をcommand line・source・logへ出しません。Google credentialは現在存在しないため、実Google loginは外部接続HOLDです。authorization code、state、nonce、PKCE S256、JWKS/iss/aud/exp/iat/nonce/sub検証はlocal API test済みです。

## 3. 承認後の実行順

1. production D1作成
2. root `wrangler.jsonc`へ実UUIDを反映し、local checkerを再実行
3. remote migration適用
4. Pages secrets登録
5. Google callback URI完全一致登録
6. 承認candidateを通常FF pushし、同一tracked snapshotをPages Productionへdeploy
7. `GET /api/health`、`/story`、`/sensors/`、主要assetを最小smoke
8. production TLS chainを再確認し、Starter KitのRoot CAと一致を確認
9. login → device追加 → pairing → telemetry → latestの最小smoke

## 4. Rollback

Pagesを直前公開SHAへ通常revert deployし、Google callback/clientを無効化、Pages secretsを削除します。D1は即削除せず、書込みを停止してexportを保持します。D1削除は別途明示承認を要します。
