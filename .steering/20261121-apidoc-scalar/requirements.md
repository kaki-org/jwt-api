# 要求内容: apidoc ビューアを Scalar に置き換える

## 概要

GitHub Pages で公開している API ドキュメント（`apidoc/`）のビューアを、Stoplight Elements から Scalar（`@scalar/api-reference`）に置き換える。

## 背景

- taskleaf で OpenAPI ビューアを比べた。Try it のしやすさ、UI のモダンさ、開発の活発さの 3 点から、Scalar を試すことにした。
- 前回 Stoplight を導入したときの記録（`.steering/20260610-apidoc-stoplight/`）では、Stoplight は Issue #1164 の時点で「確定事項」になっている。選んだ理由と比べた候補は残っておらず、Scalar にも触れていない。
- 前回の方針のうち次の 4 つは、今回もそのまま守る。
  - npm でバンドルしてセルフホストする（CDN に依存しない）
  - `apidoc/` は独立した Vite プロジェクトにする
  - Pages へのデプロイは公式アクションで行う
  - Spectral lint を必須にする

## 実装対象の機能

### 1. ビューアの置き換え
- `@stoplight/elements` を外して `@scalar/api-reference` を入れ、npm でバンドルする。
- `apidoc/openapi.yaml` の URL は、今と同じく `?url` で import して渡す。

### 2. Stoplight で設定していた項目を Scalar で再現する
- hash ルーティング（Pages のサブパス `/jwt-api/` で動かすため）
- サイドバーのレイアウト
- Try it の credentials を same-origin にする。あわせて `X-Requested-With` ヘッダーと Bearer 認証の入力欄を出す。

### 3. 外部への通信を止める
- 次の 3 つを止める。
  - 外部フォント（fonts.scalar.com）
  - テレメトリ
  - AI Agent
- 外部プロキシ（proxy.scalar.com）は使わない。

## 受け入れ条件

### ビューアの置き換え
- [ ] `npm run lint` と `npm run build` が通る
- [ ] `npm run dev` で 4 つのエンドポイントがすべて表示され、コンソールエラーが出ない
- [ ] `npm run preview`（base は `/jwt-api/`）でも表示でき、hash のディープリンクが効く

### 設定の再現と外部通信
- [ ] Try it に `X-Requested-With` と Bearer の入力欄が出る
- [ ] Network タブで、自分のオリジン以外へのリクエストが 0 件

## 成功指標

- `dist/` のサイズと Try it の実用度を Stoplight と比べ、採用するかどうか判断できる材料をそろえる。

## スコープ外

- Rails 本体の変更（CORS の許可オリジン追加など）
- `apidoc/openapi.yaml` の中身の変更
- CI を `npm ci` に切り替えること（別 PR で提案する）

## 参照ドキュメント

- `.steering/20260610-apidoc-stoplight/`
- https://guides.scalar.com/scalar/scalar-api-references/configuration
- https://guides.scalar.com/scalar/scalar-api-references/html
