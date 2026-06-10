# apidoc — jwt-api API ドキュメント

手書きの OpenAPI 仕様書（`openapi.yaml`）を [Stoplight Elements](https://stoplight.io/open-source/elements) で描画し、GitHub Pages に公開する独立 Vite プロジェクト。

公開 URL: https://kaki-org.github.io/jwt-api/

## ローカル開発

```bash
cd apidoc
npm install
npm run dev      # http://localhost:5173/jwt-api/ で開発サーバー起動
npm run build    # dist/ に静的ファイルを生成
npm run preview  # ビルド結果をプレビュー
npm run lint     # Spectral で openapi.yaml を oas lint
```

## 仕様書の編集

- 正本は `openapi.yaml`（OpenAPI 3.1）の 1 ファイル。
- 編集後は `npm run lint` で文法チェックを行う。Spectral の `spectral:oas` ルールに従う。
- `@stoplight/elements` はセルフホストでバンドルしており CDN には依存しない。

## デプロイ

`.github/workflows/apidoc.yml` が以下を行う:

1. **lint**（PR・push 双方）: `npm run lint`（Spectral）。失敗すると後続を停止。
2. **build / deploy**（`develop` への push、`apidoc/**` 変更時のみ）: `npm run build` →
   GitHub Pages 公式アクションで公開。

## リポジトリ設定（初回のみ）

GitHub のリポジトリ設定で Pages のソースを **GitHub Actions** に設定する必要がある:

- Settings → Pages → Build and deployment → Source: **GitHub Actions**

または gh CLI:

```bash
gh api -X POST repos/kaki-org/jwt-api/pages \
  -f 'build_type=workflow' || \
gh api -X PUT repos/kaki-org/jwt-api/pages \
  -f 'build_type=workflow'
```
