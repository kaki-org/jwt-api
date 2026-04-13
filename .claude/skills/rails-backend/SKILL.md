---
name: rails-backend
description: "jwt-apiリポジトリのRails 8.1 APIバックエンドでの開発ガイド。JWT認証（Dual-Tokenパターン）、サービス層Mixin、RSpecテスト、RuboCopなどバックエンド側のコーディング・テスト・デバッグ作業時に参照する。Rails, RSpec, RuboCop, JWT, AuthToken, UserAuth, dip, Brakeman などのキーワードで呼び出す。"
---

# Rails バックエンド開発ガイド

## 技術スタック

- Ruby 4.0.0 / Rails 8.1（APIモード）
- PostgreSQL 18.x / Puma 7.x
- Docker / Docker Compose / dip

## 作業ディレクトリ

リポジトリルート（`/`配下）で作業する。`app/`, `config/`, `spec/` などRails標準構成。

## よく使うコマンド

Docker環境（dip）を優先的に使用する。

```bash
# テスト
dip rspec                                              # 全体
dip rspec spec/models                                  # ディレクトリ
dip rspec spec/requests/api/v1/auth_token_controller_spec.rb  # 単体

# Lint / セキュリティ
dip rubocop            # 確認
dip rubocop -A         # 自動修正
dip brakeman           # セキュリティスキャン

# Rails
dip rails c            # コンソール
dip rails db:migrate   # マイグレーション
dip provision          # DB作成・マイグレーション・シード一括

# Docker環境なしの場合のフォールバック
bundle exec rspec
bundle exec rubocop
```

## アーキテクチャ

### JWT認証フロー（Dual-Tokenパターン）

- **アクセストークン:** 有効期限30分、`Authorization`ヘッダーで送信、Rails MessageEncryptorで暗号化されたuser_id（subject）
- **リフレッシュトークン:** 有効期限24時間、HttpOnly Cookieに格納、jti（JWT ID）でサーバー側検証（Userテーブルの`refresh_jti`カラム）
- トークンクラス: `UserAuth::AccessToken`, `UserAuth::RefreshToken`, `UserAuth::TokenCommons`
- セキュリティ原則: user_idは平文ではなく暗号化して格納。リフレッシュトークンはJTIのサーバー側照合でリプレイ攻撃を防止

### サービス層（Mixinパターン）

サービスはモジュールとしてコントローラーに `include` される:

| モジュール | 役割 |
|-----|-----|
| `AuthTokenService` | トークンペアの生成とCookieシリアライズ |
| `AuthResponseBuilder` | トークン＋ユーザーデータのレスポンス構築 |
| `TokenGenerateService` | トークンのエンコード（Userモデルにinclude） |
| `UserAuthenticateService` | アクセストークン検証（Authorizationヘッダーから） |
| `UserSessionizeService` | リフレッシュトークン検証（Cookieから） |

### APIエンドポイント

- `POST /api/v1/auth_token` - ログイン（トークン発行）
- `POST /api/v1/auth_token/refresh` - トークンリフレッシュ
- `DELETE /api/v1/auth_token` - ログアウト（トークン破棄）
- `GET /api/v1/projects` - プロジェクト一覧
- 全リクエストに `X-Requested-With: XMLHttpRequest` ヘッダー必須（CSRF対策）

## コーディング規約

- 全Rubyファイルの先頭に `# frozen_string_literal: true` を記載
- RuboCop設定: `.rubocop.yml`（`rubocop-rails`, `rubocop-rspec` 有効）
- RSpecのコンテキスト名は**日本語**を使用（例: `context 'の場合'`, `context 'する場合'`）
- コメントは日本語可
- コミットメッセージに `Co-Authored-By` 行は**含めない**

## 検証手順

コード変更後は必ず以下を実行:

1. `dip rubocop` で静的解析
2. `dip rspec <関連スペック>` でテスト実行
3. 認証・認可に関わる変更は `dip brakeman` を追加実行

ログを確認し、動作を証明できるまで完了としない。

## CI/CD

- GitHub Actionsでプルリクエスト時にRuboCop + RSpecを自動実行
- SimpleCovでカバレッジ計測、Codecovにアップロード
- Herokuへデプロイ（`heroku.yml`で設定）

## Docker環境

- ポートマッピング: API `33000`, Frontend `3000`, DB `25432`
- CORS: `credentials: true`（HttpOnly Cookie送受信のため）
