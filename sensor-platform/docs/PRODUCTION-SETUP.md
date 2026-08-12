# Production setup (external changes — HOLD until release approval)

このcandidateはlocal D1/Miniflare相当までを検証し、Cloudflare/Googleの外部resourceを作成しません。公開判断後に次を行います。

## 1. Cloudflare D1 / Worker

1. `wrangler d1 create gaia-senseware-sensors`
2. 返されたUUIDをproduction用`wrangler.jsonc`の`database_id`へ設定します。repositoryのUUID `00000000-0000-0000-0000-000000000001` はlocal-only placeholderです。
3. `wrangler d1 migrations apply gaia-senseware-sensors --remote`（migrationを先に適用）。
4. Worker custom domainまたは既存Pages custom domain上の衝突しないroute `/api/*` を設定します。`pages.dev` aliasへWorkers routeを重ねられない場合、sensor UIもWorker Static Assetsへ載せるか、同一site custom domainを用意してください。第三者cookieに依存するcross-site構成は採用しません。
5. `PUBLIC_ORIGIN` と `WEB_ORIGIN` を実際のHTTPS originへ変更します。

## 2. Google OIDC

Google Cloud ConsoleでWeb application OAuth clientを作成し、Authorized redirect URIを完全一致で登録します。

`https://<production-origin>/api/auth/google/callback`

必要secret（全て別値）:

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `SESSION_SECRET`（32 random bytes以上）
- `DEVICE_TOKEN_PEPPER`（32 random bytes以上）
- `PAIRING_CODE_PEPPER`（32 random bytes以上）

`wrangler secret put <NAME>` のinteractive promptを使い、値をcommand line・source・logへ出しません。Google credentialが現在ないため、実Google loginは外部接続HOLDです。コードはauthorization code、state、nonce、PKCE S256、JWKS/iss/aud/exp/iat/nonce/sub検証を実装済みです。

## 3. Deploy order

1. D1作成とmigration
2. secrets登録
3. Worker dry-run / deploy
4. custom route/domain
5. Google redirect URI完全一致
6. Pages `/sensors/` とnavを同一承認SHAからdeploy
7. TLS chainを確認してStarter Kit Root CAを確定

現candidateのredirect URI（local）: `http://127.0.0.1:8787/api/auth/google/callback`。これはGoogle production credentialへ登録しません。
