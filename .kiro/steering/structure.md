# プロジェクト構造

## ルートディレクトリレイアウト

```
jwt-rails/
├── app/                    # Railsアプリケーションコード
├── front/                  # Nuxt.jsフロントエンドアプリケーション
├── config/                 # Rails設定
├── db/                     # データベースファイル（マイグレーション、スキーマ、シード）
├── spec/                   # RSpecテストファイル
├── docker-compose.yml      # Dockerサービス設定
├── dip.yml                 # Docker interaction process設定
├── Gemfile                 # Ruby依存関係
└── .env                    # 環境変数
```

## Rails API構造（`app/`）

```
app/
├── controllers/
│   ├── api/v1/            # APIエンドポイント（バージョン管理）
│   ├── application_controller.rb
│   └── concerns/          # 共有コントローラーロジック
├── models/
│   ├── user.rb           # JWT統合付きUserモデル
│   └── concerns/         # 共有モデルロジック
├── services/
│   ├── user_auth/        # JWTトークン管理
│   ├── token_generate_service.rb
│   ├── user_authenticate_service.rb
│   └── user_sessionize_service.rb
└── validators/
    └── email_validator.rb # カスタムメールバリデーション
```

## フロントエンド構造（`front/`）

```
front/
├── components/           # Vue.jsコンポーネント
│   ├── App/             # グローバルアプリコンポーネント
│   ├── BeforeLogin/     # 認証前コンポーネント
│   ├── LoggedIn/        # 認証後コンポーネント
│   ├── Home/            # ランディングページコンポーネント
│   ├── Project/         # プロジェクト関連コンポーネント
│   └── User/            # ユーザーフォームコンポーネント
├── pages/               # Nuxt.jsページ（自動ルーティング）
├── layouts/             # ページレイアウト
├── middleware/          # ルートミドルウェア
├── plugins/             # Vue.jsプラグイン
├── store/               # Vuex状態管理
├── locales/             # i18n翻訳ファイル
├── assets/              # 静的アセット（SCSS、画像）
└── nuxt.config.ts       # Nuxt.js設定
```

## 主要設定ファイル

- **Rails設定**: `config/application.rb`、`config/routes.rb`
- **データベース**: `db/schema.rb`、`db/migrate/`
- **フロントエンド設定**: `front/nuxt.config.ts`、`front/package.json`
- **Docker**: `docker-compose.yml`、`Dockerfile`
- **環境**: `.env`、`.envrc`

## 認証アーキテクチャ

- **JWTサービス**: `app/services/user_auth/`に配置
- **トークンタイプ**: アクセストークン（30分）とリフレッシュトークン（24時間）
- **保存場所**: リフレッシュトークンはHTTP-onlyクッキー、アクセストークンはメモリ
- **ミドルウェア**: `app/controllers/concerns/`で認証処理

## APIエンドポイント

すべてのAPIルートは`/api/v1/`名前空間下にあります：
- `POST /api/v1/auth_token` - ログイン
- `POST /api/v1/auth_token/refresh` - トークンリフレッシュ
- `DELETE /api/v1/auth_token` - ログアウト
- `GET /api/v1/projects` - プロジェクト一覧

## フロントエンドルーティング

- `/` - ランディングページ
- `/login` - 認証
- `/signup` - ユーザー登録
- `/projects` - プロジェクトダッシュボード（認証済み）
- `/account/*` - ユーザーアカウント管理

## テスト構造

- **Railsテスト**: RSpecを使用した`spec/`ディレクトリ
- **フロントエンドテスト**: コード品質のためのESLint
- **テストタイプ**: モデルspec、リクエストspec、統合テスト
