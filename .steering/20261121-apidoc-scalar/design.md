# 設計書: apidoc ビューアを Scalar に置き換える

## アーキテクチャ概要

構成は変えない。`apidoc/` は独立した Vite プロジェクトのままにし、描画ライブラリだけを差し替える。

```
openapi.yaml --(?url import)--> src/main.ts --createApiReference('#app', config)--> index.html
                                                   └─ @scalar/api-reference（Vue ランタイムを含めてバンドル）
vite build (base=/jwt-api/) --> dist/ --> GitHub Pages
```

## Stoplight の設定と Scalar の設定の対応

| Stoplight | Scalar | 備考 |
|---|---|---|
| `@stoplight/elements/web-components.min.js` と CSS | `createApiReference` と `@scalar/api-reference/style.css` | |
| `router=hash` | 既定が hash ルーティング | 設定は不要 |
| `layout=sidebar` | `layout: 'modern'`、`showSidebar: true` | どちらも既定値だが、意図を残すため明示的に書く |
| `tryItCredentialsPolicy=same-origin` | 既定の fetch（credentials は same-origin） | `customFetch` は使わない |
| （なし） | `authentication.preferredSecurityScheme: 'bearerAuth'` | トークンを事前に入れたり保存したりはしない |

`X-Requested-With` は、openapi.yaml で required と default `XMLHttpRequest` を定義済み。Try it に自動で入るかを実際に確かめる。入らなかったときだけ `onBeforeRequest` で付ける。

## 外部通信を止める設定

| 設定 | 止まるもの |
|---|---|
| `withDefaultFonts: false` | fonts.scalar.com からの Inter と JetBrains Mono の読み込み |
| `telemetry: false` | 分析プラグイン（OSS 版は既定でも読み込まれないが、念のため） |
| `agent: { disabled: true }` | AI Agent（localhost では既定で有効。最初のメッセージで spec が Scalar にアップロードされる） |
| `proxyUrl` を指定しない | proxy.scalar.com を経由しない |

## Stoplight 用の回避策のうち外すもの

- 属性を設定してから append する手順。Scalar は `createApiReference` に config を渡すだけで済む。
- `vite.config.ts` の `define: { global: 'globalThis' }`。外すとビルドや実行が失敗する場合は残す。

## テスト戦略

自動テストはない。lint、build、Chrome での目視確認（dev と preview）、Network タブの確認で検証する。

## 依存ライブラリ

- 追加: `@scalar/api-reference`（2026-11-21 時点の最新は 1.82.1）
- 削除: `@stoplight/elements`

## セキュリティ考慮事項

- 認証情報を localStorage に保存しない（`persistAuth` は既定の false のまま）。
- 外部へは送信しない（上の 4 項目）。
- GitHub Pages から本番 API への Try it は、CORS の許可オリジンが `ENV["API_DOMAIN"]` の 1 つだけなので通らない見込み。今回は Rails を変えず、対応の選択肢を報告にまとめる。

## パフォーマンス考慮事項

- Scalar は Vue と API Client を含むので、バンドルが大きくなる可能性がある。
- 比べる基準値は、Stoplight を vite 8.3.8 でビルドしたときのサイズ。
  - dist 全体: 2.2M
  - JS: 2,038 kB（gzip 615 kB）
  - CSS: 291 kB（gzip 49 kB）
