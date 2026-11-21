# apidoc — jwt-api API ドキュメント

手書きの OpenAPI 仕様書（`openapi.yaml`）を [Scalar API Reference](https://github.com/scalar/scalar)（`@scalar/api-reference`）で描画し、GitHub Pages に公開する独立 Vite プロジェクト。

公開 URL: https://kaki-org.github.io/jwt-api/

## ローカル開発

```bash
cd apidoc
npm install
npm run dev      # http://localhost:5173/ で開発サーバー起動
npm run build    # dist/ に静的ファイルを生成（base は /jwt-api/）
npm run preview  # ビルド結果を http://localhost:4173/jwt-api/ でプレビュー
npm run lint     # Spectral で openapi.yaml を oas lint
```

リポジトリのルートからは `make apidoc-preview` で、依存のインストール（package.json / lockfile 更新時のみ）・ビルド・
preview の起動をまとめて行い、ブラウザで開く。ターゲット一覧は `make help`。

## 仕様書の編集

- 正本は `openapi.yaml`（OpenAPI 3.1）の 1 ファイル。
- 編集後は `npm run lint` で文法チェックを行う。Spectral の `spectral:oas` ルールに従う。
- `@scalar/api-reference` はセルフホストでバンドルしており CDN には依存しない。
- 外部通信は `src/main.ts` で止めている（`withDefaultFonts: false` / `telemetry: false` /
  `agent: { disabled: true }`、`proxyUrl` は未指定）。Try it は同一オリジン以外の API へは
  CORS の許可がない限り送れない。

## バージョン運用

`info.version` は手で上げない。`openapi.yaml` を変更した develop 向けの PR で `.github/workflows/openapi-version.yml` が base ブランチの仕様と比べて自動で bump し、bot がコミットする（判定ロジックは `.github/scripts/openapi-version-bump.sh`）。

| 判定 | 条件（[oasdiff](https://github.com/oasdiff/oasdiff) の `changelog`） | 例 |
|---|---|---|
| major | WARN / ERR の変更がある | エンドポイント削除、必須パラメータ追加、レスポンス型変更 |
| minor | 上記以外の INFO の変更がある | エンドポイント追加、任意フィールド追加 |
| patch | changelog に出ないが差分がある | 説明文・example の変更 |

- 判定結果は PR にコメントされる。判定を変えたいときは `api-version:major` / `api-version:minor` / `api-version:patch` ラベルを付ける（複数あれば大きい方）。
- `info.version` は常に「base を判定レベルで上げた値」に揃える。手で書いた値も上書きされるので、多めに上げたいときはラベルを使う（ラベルを外せば判定どおりの値に戻る）。
- base が進んでも PR 側は再判定されない。同時期に複数の PR が仕様を変える場合は、マージ前に base を取り込んで再実行する。
- fork からの PR は対象外（Secrets を使えないため）。

ローカルで判定だけ確かめる場合（oasdiff が必要）:

```bash
git show origin/develop:apidoc/openapi.yaml > /tmp/base.yaml
bash .github/scripts/openapi-version-bump.sh /tmp/base.yaml apidoc/openapi.yaml
```

※ `openapi.yaml` の `info.version` を書き換えるので、確認だけなら実行後に `git checkout apidoc/openapi.yaml` で戻す。

## デプロイ

`.github/workflows/apidoc.yml` が以下を行う:

1. **lint**（PR・push 双方）: `npm run lint`（Spectral）。失敗すると後続を停止。
2. **build / deploy**（`develop` への push かつ `apidoc/**` または
   `.github/workflows/apidoc.yml` の変更時のみ）: `npm run build` →
   GitHub Pages 公式アクションで公開。

## リポジトリ設定（初回のみ）

GitHub のリポジトリ設定で Pages のソースを **GitHub Actions** に設定する必要がある:

- Settings → Pages → Build and deployment → Source: **GitHub Actions**

バージョン自動 bump 用の GitHub App も必要:

1. GitHub App を作成する（Repository permissions: **Contents: Read and write**、Webhook は無効）し、このリポジトリにインストールする
2. Secrets に `OPENAPI_BOT_CLIENT_ID`（App の Client ID）と `OPENAPI_BOT_PRIVATE_KEY`（秘密鍵）を登録する

`GITHUB_TOKEN` ではなく App のトークンで push するのは、`GITHUB_TOKEN` の push では他のワークフロー（RSpec・Spectral など）が再実行されないため。

または gh CLI:

```bash
gh api -X POST repos/kaki-org/jwt-api/pages \
  -f 'build_type=workflow' || \
gh api -X PUT repos/kaki-org/jwt-api/pages \
  -f 'build_type=workflow'
```
