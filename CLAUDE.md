# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

JWT認証システムを備えたフルスタックWebアプリケーション。Rails APIバックエンドとNuxt.jsフロントエンド（SPA）で構成されている。

## 技術スタック

- **バックエンド:** Ruby 4.0.0 / Rails 8.1（APIモード）
- **フロントエンド:** Nuxt 4 / Vue 3 / TypeScript / Vuetify 4 / Pinia
- **データベース:** PostgreSQL 18.x
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

# セキュリティスキャン
dip brakeman

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

### Docker環境セットアップ

```bash
dip provision   # DB作成・マイグレーション・シード投入まで一括実行
```

## アーキテクチャ

### JWT認証フロー（Dual-Tokenパターン）

- **アクセストークン:** 有効期限30分、Authorizationヘッダーで送信、Rails MessageEncryptorで暗号化されたuser_id（subject）
- **リフレッシュトークン:** 有効期限24時間、HttpOnly Cookieに格納、jti（JWT ID）でサーバー側検証（Userテーブルの`refresh_jti`カラム）
- トークンクラス: `UserAuth::AccessToken`, `UserAuth::RefreshToken`, `UserAuth::TokenCommons`
- セキュリティ: user_idは平文ではなく暗号化して格納。リフレッシュトークンはJTIのサーバー側照合でリプレイ攻撃を防止

### サービス層（Mixin パターン）

サービスはモジュールとしてコントローラーにincludeされる:

- `AuthTokenService` - トークンペアの生成とCookieシリアライズ
- `AuthResponseBuilder` - トークン＋ユーザーデータのレスポンス構築
- `TokenGenerateService` - トークンのエンコード（Userモデルにinclude）
- `UserAuthenticateService` - アクセストークン検証（Authorizationヘッダーから）
- `UserSessionizeService` - リフレッシュトークン検証（Cookieから）

### APIエンドポイント

- `POST /api/v1/auth_token` - ログイン（トークン発行）
- `POST /api/v1/auth_token/refresh` - トークンリフレッシュ
- `DELETE /api/v1/auth_token` - ログアウト（トークン破棄）
- `GET /api/v1/projects` - プロジェクト一覧
- 全リクエストに `X-Requested-With: XMLHttpRequest` ヘッダーが必要（CSRF対策）

### フロントエンド ミドルウェアチェーン（実行順序が重要）

1. `silent-refresh-token` - 期限切れトークンの自動リフレッシュ（認証チェック前に実行）
2. `authentication` - 認証チェック、未認証時はログインへリダイレクト
3. `logged-in-redirect` - 認証済みユーザーをログイン/サインアップページからリダイレクト

`useApi` composableは401レスポンス時に自動でトークンリフレッシュを試行する。

### フロントエンド状態管理（Pinia）

- `useAuthStore` - トークン・有効期限・JWTペイロード管理
- `useUserStore` - ユーザー情報
- `useProjectStore` - プロジェクト一覧
- `useToastStore` - トースト通知キュー
- `useAppStore` - ナビゲーション状態（認証失敗時のリダイレクト先記憶）

## コーディング規約

### Ruby/Rails

- `# frozen_string_literal: true` を全ファイルの先頭に記載
- RuboCop設定: `.rubocop.yml`（rubocop-rails, rubocop-rspec有効）
- RSpecのコンテキスト名は日本語を使用（例: `context 'の場合'`, `context 'する場合'`）
- コメントは日本語で記載可能

### フロントエンド（Vue/TypeScript）

- Biome（`biome.jsonc`）でリント・フォーマット（シングルクォート、行幅80）
- TypeScript strictモード有効
- パッケージマネージャー: pnpm
- i18n対応（日本語/英語、デフォルト日本語）

## CI/CD

- GitHub Actionsでプルリクエスト時にRuboCop + RSpecを自動実行
- SimpleCovでカバレッジ計測、Codecovにアップロード
- Herokuへデプロイ（`heroku.yml`で設定）

## Docker環境

- ポートマッピング: API 33000, Frontend 3000, DB 25432
- CORS: credentials: true（HttpOnly Cookie送受信のため）
