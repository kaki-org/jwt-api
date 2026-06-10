# タスクリスト: apidoc / Stoplight Elements

- [x] `apidoc/` に独立 Vite プロジェクトを新設（`package.json` / `vite.config.ts`）
- [x] `@stoplight/elements` を依存に追加しセルフホストでバンドル（`index.html` + `src/main.ts`）
- [x] `apidoc/openapi.yaml` を手書きで作成
  - [x] 4 エンドポイント全ての path / method / req / res スキーマ
  - [x] securitySchemes: Bearer（暗号化アクセストークン）+ refresh トークン Cookie
  - [x] `X-Requested-With: XMLHttpRequest` 必須ヘッダの記述
- [x] `@stoplight/spectral-cli` を導入し oas ルールで lint（npm script 化 + `.spectral.yaml`）
- [x] GitHub Actions ワークフロー追加（`.github/workflows/apidoc.yml`）
  - [x] `develop` push（`apidoc/**` パス限定）でトリガー
  - [x] Spectral lint ジョブ → 成功時のみ build → deploy-pages
  - [x] PR でも lint を実行
- [x] リポジトリ設定で Pages ソースを「GitHub Actions」に設定 → 手動手順を README に記載（リポジトリ設定変更は外部影響のため自動実行せず手順化）
- [x] ローカル検証（YAML 構文 / `$ref` 解決 / actionlint）

## 申し送り事項

### 実装完了日
2026-06-10

### 計画と実績の差分
- `/add-feature` ワークフローが参照する `steering` / `development-guidelines` /
  `implementation-validator` スキルは本環境に存在しなかったため、軽量な計画ドキュメント作成と
  自己レビューで代替した。
- ビルド構成は `apidoc/openapi.yaml` を正本として保持しつつ、Vite の `?url` import で
  アセット化する方式を採用（公開時も base 配下で正しく解決される）。

### ローカルで検証済み
- `openapi.yaml`・`apidoc.yml`・`package.json` の構文 OK
- OpenAPI 内 7 件の `$ref` がすべて解決 OK
- `actionlint .github/workflows/apidoc.yml` PASS

### CI で実行（ローカル未実行の理由）
- `npm install` / `npm run build` / `npm run lint`(Spectral) は npm レジストリが
  サンドボックス外のためローカル実行不可。`.github/workflows/apidoc.yml` の lint ジョブ
  （PR でも実行）で検証される。

### 学んだこと
- Stoplight Elements は `web-components.min.js` を import するだけで `<elements-api>`
  カスタム要素を登録でき、React セットアップ不要でセルフホストできる。
- GitHub Pages プロジェクトサイトは `base: '/<repo>/'` と `router="hash"` の組合せで
  サブパス配信に対応する。

### 次回への改善提案
- npm レジストリにアクセスできる環境で `package-lock.json` を生成・コミットし、CI を
  `npm ci` に切り替えると再現性が向上する。
- 初回のみ必要な「Pages ソース = GitHub Actions」設定後、初回デプロイ URL を README へ反映する。
