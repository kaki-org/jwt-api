# 要件: Stoplight Elements による API 仕様書(OpenAPI)公開

出典: https://github.com/kaki-org/jwt-api/issues/1164

## 目的

手書きの OpenAPI 仕様書を Stoplight Elements で HTML 化し、GitHub Pages 上に常時最新の公開ドキュメントとして提供する。

## 対象 API（全 4 エンドポイント）

| メソッド | パス | 概要 |
|----------|------|------|
| POST | `/api/v1/auth_token` | ログイン（トークン発行） |
| POST | `/api/v1/auth_token/refresh` | トークンリフレッシュ |
| DELETE | `/api/v1/auth_token/destroy` | ログアウト |
| GET | `/api/v1/projects` | プロジェクト一覧 |

## 確定事項（Issue 設計判断より）

- 生成元: 手書き YAML 1 ファイル（`apidoc/openapi.yaml`）
- 描画: Stoplight Elements を npm でセルフホストバンドル（CDN 非依存）
- ビルド: ルート直下に独立 Vite ミニプロジェクト `apidoc/`
- デプロイ: GitHub Actions 公式（configure-pages + upload-pages-artifact + deploy-pages）、Pages ソース = GitHub Actions
- トリガー: `develop` への push（`apidoc/**` パス変更時のみ）
- 範囲: 全 4 エンドポイント + 認証詳細（securitySchemes、Cookie リフレッシュ、`X-Requested-With` 必須ヘッダ、req/res スキーマ）
- 品質: デプロイ前に `@stoplight/spectral-cli` の oas lint を必須化（PR でも実行、エラー時はデプロイ停止）

## 受け入れ条件

1. `develop` への push で Spectral lint が通り、GitHub Pages に Stoplight Elements で描画された API ドキュメントが公開される
2. 全 4 エンドポイントと認証スキームがドキュメント上で確認できる
3. 仕様書に文法ミスがある場合、CI（Spectral）でデプロイが停止する
