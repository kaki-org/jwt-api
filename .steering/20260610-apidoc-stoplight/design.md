# 設計: apidoc ミニプロジェクトと API 契約

## ディレクトリ構成

```
apidoc/
├── package.json        # 独立 npm プロジェクト（type: module）
├── vite.config.ts      # base: '/jwt-api/'（GitHub Pages プロジェクトサイト）
├── index.html          # <elements-api> を埋め込むエントリ HTML
├── .spectral.yaml      # extends: spectral:oas
├── .gitignore          # node_modules / dist
├── README.md           # ローカル開発手順
├── openapi.yaml        # 手書き OpenAPI 3.1 仕様書（lint 対象・正本）
└── src/
    ├── main.ts         # Elements web-components + styles を import、spec URL を注入
    └── vite-env.d.ts   # vite/client 型参照
```

## 描画方式

- `@stoplight/elements/web-components.min.js` を import して `<elements-api>` カスタム要素を登録（React セットアップ不要）
- `openapi.yaml` は `?url` import で Vite のアセットとして emit し、`base` を考慮した正しい URL を `apiDescriptionUrl` 属性へ注入（正本を `apidoc/openapi.yaml` に保持したまま参照可能）
- `router="hash"` で GitHub Pages のサブパス配信に対応

## API 契約（ソースコードから抽出した実挙動）

共通: 全リクエストに `X-Requested-With: XMLHttpRequest` 必須。欠如時は 403 `{ status, error: "Forbidden" }`（`ApplicationController#xhr_request?`）。

### POST /api/v1/auth_token（ログイン / create）
- Request body: `{ auth: { email, password } }`
- 200: `{ token: string, expires: integer(unix epoch), user: { id, name } }` + `Set-Cookie: refresh_token`(HttpOnly)
- 404: 認証失敗・非アクティブユーザー（ボディなし）

### POST /api/v1/auth_token/refresh（リフレッシュ / collection）
- 認証: `refresh_token` Cookie
- 200: ログインと同一スキーマ + 新しい `refresh_token` Cookie
- 401(ボディなし): セッション無効（`sessionize_user` → head :unauthorized）
- 401(ボディあり): `{ status: 401, error: "Invalid jti for refresh token" }`（jti 不一致 = リプレイ検知）

### DELETE /api/v1/auth_token/destroy（ログアウト / collection）
- 認証: `refresh_token` Cookie
- 200: ボディなし（Cookie 削除成功）
- 401: セッション無効
- 500: `{ status: 500, error: "Could not delete session" }`

### GET /api/v1/projects（プロジェクト一覧 / index）
- 認証: `Authorization: Bearer <access_token>`（暗号化 user_id を含むアクセストークン）
- 200: `[{ id: integer, name: string, updatedAt: string(date-time) }]`
- 401: 未認証 / 非アクティブ

## securitySchemes

- `bearerAuth`: http / bearer（暗号化アクセストークン）→ projects
- `refreshCookie`: apiKey / in cookie / name `refresh_token` → refresh・destroy

## CI/CD（.github/workflows/apidoc.yml）

- `lint` ジョブ: PR・push 双方で Spectral oas lint（失敗で後続停止）
- `build` ジョブ: `develop` push のみ。`npm install` → `npm run build` → configure-pages → upload-pages-artifact
- `deploy` ジョブ: `develop` push のみ。deploy-pages（environment: github-pages）
- アクションは既存規約に合わせ commit SHA で固定
