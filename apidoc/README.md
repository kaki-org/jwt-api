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

`info.version` は手で変えない。PR の段階では version を変えず、develop にマージされた後に bot が上げる。

1. **PR（develop 向け）**: `.github/workflows/openapi-version-label.yml` が merge-base の仕様と比べて bump レベルを判定し、`api-version:major` / `api-version:minor` / `api-version:patch` のいずれかのラベルを付ける。判定結果は PR にコメントされる。PR が `info.version` を変えているとチェックが失敗する。
2. **develop へのマージ後**: `.github/workflows/openapi-version-bump.yml` がマージ元 PR のラベルに従って `info.version` を上げ、GitHub App が develop に直接 push する。最後の bump 以降のマージを古い順にすべて処理するので、続けてマージしても 1.1.0 → 1.2.0 と積み上がる。bot の push で `apidoc.yml` も動き、Pages に新しい version が公開される。

| 判定 | 条件（[oasdiff](https://github.com/oasdiff/oasdiff) の `changelog`） | 例 |
|---|---|---|
| major | WARN / ERR の変更がある | エンドポイント削除、必須パラメータ追加、レスポンス型変更 |
| minor | 上記以外の INFO の変更がある | エンドポイント追加、任意フィールド追加 |
| patch | changelog に出ないが差分がある | 説明文・example の変更 |

- 判定を変えたいときは、`api-version:*` ラベルを手で付ける。その時点で bot が付けたラベルは外れ、人が付けたラベルはその後も上書きされない。複数付いていれば大きい方を使う。
- ラベルのない PR（ラベル付けの失敗など）や直接 push は、マージ後に oasdiff で判定し直す。
- fork からの PR にはラベルが付かないので、マージ後の判定になる。

ローカルで判定だけ確かめる場合（oasdiff が必要）:

```bash
git show "$(git merge-base origin/develop HEAD)":apidoc/openapi.yaml > /tmp/base.yaml
bash .github/scripts/openapi-version-bump.sh judge /tmp/base.yaml apidoc/openapi.yaml
```

## デプロイ

`.github/workflows/apidoc.yml` が以下を行う:

1. **lint**（PR・push 双方）: `npm run lint`（Spectral）。失敗すると後続を停止。
2. **build / deploy**（`develop` への push かつ `apidoc/**` または
   `.github/workflows/apidoc.yml` の変更時のみ）: `npm run build` →
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

バージョン自動 bump 用の GitHub App も必要:

1. GitHub App を作成し（Repository permissions: **Contents: Read and write**、Webhook は無効）、このリポジトリにインストールする
2. Repository secret に `OPENAPI_BOT_CLIENT_ID`（App の Client ID）と `OPENAPI_BOT_PRIVATE_KEY`（秘密鍵）を登録する
3. develop の保護は Ruleset で行い、bypass に App を加える（classic のブランチ保護では App に必須チェックを迂回させられないため）

`GITHUB_TOKEN` ではなく App のトークンで push するのは、`GITHUB_TOKEN` の push では他のワークフロー（`apidoc.yml` の Pages 公開など）が起動しないため。
