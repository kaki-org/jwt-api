# 技術スタック

## バックエンド（Rails API）

- **フレームワーク**: Rails 8.0.x（API専用モード）
- **Rubyバージョン**: 3.4.4
- **データベース**: PostgreSQL 17.5
- **認証**: パスワードハッシュ化にbcryptを使用したJWT
- **主要Gem**:
  - `jwt` - JSON Web Token実装
  - `bcrypt` - パスワードハッシュ化
  - `rack-cors` - クロスオリジンリソース共有
  - `pg` - PostgreSQLアダプター
  - `puma` - Webサーバー

## フロントエンド（Nuxt.js）

- **フレームワーク**: Nuxt.js 3.x（SPAモード）
- **Nodeバージョン**: >=20.12.2
- **UIフレームワーク**: Vuetify（マテリアルデザイン）
- **主要依存関係**:
  - `@nuxtjs/i18n` - 国際化
  - `jwt-decode` - JWTトークンデコード
  - `core-js` - JavaScriptポリフィル

## 開発ツール

- **コンテナ化**: Docker & Docker Compose
- **プロセス管理**: dip（Docker Interaction Process）
- **テスト**: RSpec（Rails）、ESLint（フロントエンド）
- **コード品質**: RuboCop、Brakeman

## よく使用するコマンド

### 開発環境セットアップ
```bash
# 初期セットアップ
dip provision

# Rails APIサーバー起動
dip rails s

# Nuxt.jsフロントエンド起動
cd front && pnpm dev

# テスト実行
dip rspec
dip bundle exec rubocop
```

### Docker操作
```bash
# 全サービス起動
docker-compose up

# データベースとAPIのみ起動
docker-compose up db api

# シェルアクセス
dip sh
```

### データベース操作
```bash
# マイグレーション実行
dip rails db:migrate

# シードデータ投入
dip rails db:seed

# データベースリセット
dip rails db:migrate:reset db:seed
```

## 環境設定

- **開発環境**: 設定に`.env`ファイルを使用
- **本番環境**: 環境変数を使用したHeroku
- **主要変数**: `RAILS_MASTER_KEY`、`POSTGRES_PASSWORD`、`API_DOMAIN`、`BASE_URL`