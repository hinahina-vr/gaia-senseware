# Production setup

production originは `https://gaia-senseware.pages.dev`、Google callbackは `https://gaia-senseware.pages.dev/api/auth/google/callback` です。

## 1. Pages Functions / D1

repository rootの構成をproductionのsource of truthとします。

- `wrangler.jsonc`: Pages project `gaia-senseware`、build output `.`、D1 binding `DB`、production vars
- `sensor-platform/src/pages-entry.ts`: advanced-mode entrypointのsource。`/api/*` をSensor Platform handlerへ渡し、それ以外は `env.ASSETS.fetch(request)` へ渡す
- `_worker.js`: `scripts/build-sensor-pages-worker.mjs` がWrangler 4.121.0のlocal dry-run bundlerで生成する、単一self-contained JavaScript upload artifact。手編集しない
- `_routes.json`: Function invocationを `/api/*` のみに限定。story、sensor SPA、主要assetは静的配信
- health check: `GET /api/health`（legacy health endpointは使用しない）

production D1:

1. `gaia-senseware-sensors` を作成済み
2. UUID `6a386d6a-2858-4673-b396-6c340f9ea6d7` をroot `wrangler.jsonc` のD1 bindingへ設定済み
3. remote migration `0001_initial.sql` / `0002_iso_3166_1_alpha2.sql` を適用済み
4. read-only verification済み: migrations 2、countries 249、users 0、devices 0

以後のschema変更は追加migrationとして適用し、既存migrationを書き換えません。

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

`wrangler pages secret put <NAME> --project-name gaia-senseware` のinteractive promptを使い、値をcommand line・source・logへ出しません。`SESSION_SECRET`、`DEVICE_TOKEN_PEPPER`、`PAIRING_CODE_PEPPER` はproductionへ登録済みです。`GOOGLE_CLIENT_ID` と `GOOGLE_CLIENT_SECRET` は未登録で、Google credentialが安全経路で確認できるまで架空値を設定しません。authorization code、state、nonce、PKCE S256、JWKS/iss/aud/exp/iat/nonce/sub検証はlocal API test済みです。

## 3. Release実行順

1. local checker / API / browser focused QA
2. Google callback URI完全一致登録
3. `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` 登録
4. candidateを通常FF pushし、同一tracked snapshotをPages Productionへdeploy
5. `GET /api/health`、`/story`、`/sensors/`、主要assetを最小smoke
6. production TLS chainを再確認し、Starter KitのRoot CAと一致を確認
7. login → device追加 → pairing → telemetry → latestの最小smoke

## 4. Rollback

Pagesを直前公開SHAへ通常revert deployし、Google callback/clientを無効化、Pages secretsを削除します。D1は即削除せず、書込みを停止してexportを保持します。D1削除は別途明示承認を要します。
