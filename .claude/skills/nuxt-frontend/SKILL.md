---
name: nuxt-frontend
description: "jwt-apiリポジトリの front/ ディレクトリ配下にあるNuxt 4フロントエンドアプリケーションでの開発ガイド。Vue 3 / TypeScript / Vuetify 4 / Pinia / Biome / pnpmを使用。認証ミドルウェアチェーン、Piniaストア、useApi composable、i18n対応などフロントエンド作業時に参照する。Nuxt, Vue, Vuetify, Pinia, Biome, pnpm, useApi, silent-refresh-token, authentication middleware などのキーワードで呼び出す。"
---

# Nuxt フロントエンド開発ガイド

## 技術スタック

- Nuxt 4 / Vue 3 / TypeScript (strictモード)
- Vuetify 4 / Pinia
- Biome（lint・format）
- pnpm（パッケージマネージャー）
- i18n対応（日本語/英語、デフォルト日本語）

## 作業ディレクトリ

**必ず `front/` ディレクトリに移動して作業する**。リポジトリルートではなく `front/` 配下に `pages/`, `components/`, `composables/`, `middleware/`, `stores/`, `layouts/`, `plugins/`, `server/`, `utils/`, `locales/`, `types/` などが配置されている。

```bash
cd front
```

## よく使うコマンド

```bash
cd front
pnpm install    # 依存パッケージインストール
pnpm dev        # 開発サーバー起動（http://localhost:3000）
pnpm build      # ビルド
pnpm lint       # Lint確認（Biome）
pnpm lint:fix   # Lint自動修正
```

## アーキテクチャ

### ミドルウェアチェーン（実行順序が重要）

`front/middleware/` 配下に以下の順で実行される:

1. **`silent-refresh-token`** - 期限切れトークンの自動リフレッシュ（認証チェック**前**に実行）
2. **`authentication`** - 認証チェック、未認証時はログインへリダイレクト
3. **`logged-in-redirect`** - 認証済みユーザーをログイン/サインアップページからリダイレクト

ミドルウェアを追加・変更する際はこの実行順序を崩さないこと。

### useApi composable

`front/composables/useApi.ts` はAPIクライアント。401レスポンス時に自動でトークンリフレッシュを試行する。バックエンドと通信する際は生の `$fetch` ではなくこちらを使用する。

### Piniaストア

`front/stores/` 配下:

| ストア | 役割 |
|-----|-----|
| `useAuthStore` | トークン・有効期限・JWTペイロード管理 |
| `useUserStore` | ユーザー情報 |
| `useProjectStore` | プロジェクト一覧 |
| `useToastStore` | トースト通知キュー |
| `useAppStore` | ナビゲーション状態（認証失敗時のリダイレクト先記憶） |

### バックエンドとの連携

- 全リクエストに `X-Requested-With: XMLHttpRequest` ヘッダー必須（CSRF対策）
- リフレッシュトークンはHttpOnly Cookieで送受信されるため `credentials: 'include'` が必要
- 認証エンドポイント: `POST /api/v1/auth_token`, `POST /api/v1/auth_token/refresh`, `DELETE /api/v1/auth_token`

## コーディング規約

- **Biome**（`front/biome.jsonc`）でリント・フォーマット
  - シングルクォート
  - 行幅80
- **TypeScript strictモード**有効
- i18nはデフォルト日本語、翻訳は `front/locales/` で管理

## 検証手順

コード変更後は以下を実行:

1. `cd front && pnpm lint` で静的解析
2. UI/フロントエンド変更時は `pnpm dev` で開発サーバーを起動し、ブラウザで実際に機能を操作して確認
3. ゴールデンパスとエッジケースの両方を確認し、他機能にリグレッションがないか監視
4. 型チェック・テストはコードの正しさを検証するが**機能の正しさ**は検証しない。UIを実際に確認できない場合はその旨を明示する

## Docker環境

- ポート: Frontend `3000`, API `33000`, DB `25432`
- API通信先は環境変数で制御（`front/.envrc` 参照）
