# CLAUDE.md

このファイルはClaude Codeにプロジェクトのコンテキストを提供するためのものです。

## プロジェクト概要

JWT認証システムを備えたフルスタックWebアプリケーション。Rails APIバックエンドとNuxt.jsフロントエンド（SPA）で構成されている。

## 技術スタック

- **バックエンド:** Ruby 4.0.0 / Rails 8.1（APIモード）
- **フロントエンド:** Nuxt 4 / Vue 3 / TypeScript / Vuetify 3 / Pinia
- **データベース:** PostgreSQL 18.1
- **Webサーバー:** Puma 7.x
- **コンテナ:** Docker / Docker Compose / dip

## よく使うコマンド

### バックエンド

```bash
# テスト実行（全体）
dip rspec

# テスト実行（特定ディレクトリ・ファイル）
dip rspec spec/models
dip rspec spec/requests/api/v1/auth_token_controller_spec.rb

# Lint実行
dip rubocop

# Lint自動修正
dip rubocop -A

# Railsコンソール
dip rails c

# マイグレーション
dip rails db:migrate

# Docker環境なしの場合
bundle exec rspec
bundle exec rubocop
```

### フロントエンド

```bash
cd front
pnpm install    # 依存パッケージインストール
pnpm dev        # 開発サーバー起動
pnpm build      # ビルド
pnpm lint       # Lint確認
pnpm lint:fix   # Lint自動修正
```

## プロジェクト構成

```
jwt-api/
├── app/
│   ├── controllers/api/v1/   # APIコントローラー（v1）
│   ├── models/               # データモデル
│   ├── services/             # ビジネスロジック
│   │   ├── user_auth/        # JWTトークン処理
│   │   ├── auth_token_service.rb
│   │   └── auth_response_builder.rb
│   └── validators/           # カスタムバリデーター
├── config/                   # Rails設定
├── db/                       # データベース（マイグレーション、スキーマ、シード）
├── spec/                     # RSpecテスト
│   ├── models/
│   ├── requests/api/
│   └── services/
├── front/                    # Nuxt.jsフロントエンド（SPA）
│   ├── components/
│   ├── pages/
│   ├── stores/              # Piniaストア
│   └── locales/             # i18n翻訳ファイル
└── .github/workflows/       # GitHub Actions CI/CD
```

## アーキテクチャ

### JWT認証フロー

- **アクセストークン:** 有効期限30分、リクエストヘッダーで送信、暗号化されたuser_id（subject）
- **リフレッシュトークン:** 有効期限24時間、HttpOnly Cookieに格納、jti（JWT ID）で検証
- トークンクラス: `UserAuth::AccessToken`, `UserAuth::RefreshToken`, `UserAuth::TokenCommons`

### サービス層

- `AuthTokenService` - トークンの生成と管理
- `AuthResponseBuilder` - レスポンスの構築
- `TokenGenerateService` - トークンのエンコード（Userモデルにinclude）
- `UserAuthenticateService` - ユーザー認証ロジック
- `UserSessionizeService` - セッション管理

### APIエンドポイント

- `POST /api/v1/auth_token` - ログイン（トークン発行）
- `POST /api/v1/auth_token/refresh` - トークンリフレッシュ
- `DELETE /api/v1/auth_token` - ログアウト（トークン破棄）
- `GET /api/v1/projects` - プロジェクト一覧

## コーディング規約

### Ruby/Rails

- `# frozen_string_literal: true` を全ファイルの先頭に記載
- メソッド名: snake_case、定数: SCREAMING_SNAKE_CASE
- RuboCop設定: `.rubocop.yml`（対象Ruby 3.2、rubocop-rspec有効）
- RSpecのコンテキスト名は日本語を使用（例: `context 'の場合'`, `context 'する場合'`）
- コメントは日本語で記載可能

### フロントエンド（Vue/TypeScript）

- Biome（`biome.jsonc`）でリント・フォーマット
- シングルクォート使用
- TypeScript strictモード有効
- パッケージマネージャー: pnpm 10.27.0

## CI/CD

- GitHub Actionsでプルリクエスト時にRuboCop + RSpecを自動実行
- SimpleCovでカバレッジ計測、Codecovにアップロード
- Herokuへデプロイ（`heroku.yml`で設定）
