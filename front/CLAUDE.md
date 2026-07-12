# フロントエンド (Nuxt 4 SPA) の規約

Nuxt 2 から段階移行したコードベース。Nuxt 4 の既定と異なる構成と、動いているように見えるレガシー残骸が混在する。以下は「一見バグや古い書き方に見えるが意図がある」パターンなので、変更や指摘の前に確認すること。

## 構成

- srcDir は front/ 直下 (pages/, stores/, middleware/, composables/, plugins/)。Nuxt 4 既定の app/ ディレクトリは使っていないので、front/app/ 配下にファイルを作っても認識されない。
- ssr: false の純SPA。typescript.typeCheck は有効だが、既存の型エラーで nuxi build の型チェックが失敗する既知状態 (2026-06 時点)。自分の変更と無関係な型エラーの全修正を試みない。
- パッケージマネージャは pnpm 固定 (packageManager 指定)。npm / yarn を使わない。

## API通信

- バックエンド通信は composables/useApi.ts の get/post 等を使う。X-Requested-With ヘッダー・Authorization 付与・401時の自動トークンリフレッシュを担う。stores/user.ts に生 $fetch の直叩きが残っているが、これは真似ない。

## 認証・ストア

- Pinia ストアは全てメモリ保持のみで、トークンを localStorage 等へ永続化しないのは意図的なセキュリティ設計。ハードリロードで認証状態が消えるのは仕様であり、永続化プラグインの追加で「修正」しない。
- 起動時のトークンリフレッシュは plugins/nuxt-client-init.ts が担う。middleware/silent-refresh-token.ts は定義のみでどこからも参照されていない。
- ストアは Options API 形式 (defineStore + state/getters/actions)。this や他ストアを使う getter は通常関数、state のみ参照する getter はアロー関数と使い分けている。アロー関数への一括統一をしない。
- auth ストアの expires はエポックミリ秒 (API は秒で返すため setExpires で1000倍する)。期限比較は Date.now() と直接比較する。
- $auth (plugins/auth.js と auth.ts の二重 provide) はレガシー互換。新規コードは useAuth() と Pinia ストアを使う。

## ミドルウェア・ルーティング

- グローバルミドルウェアは無い。実行順は各レイアウト・ページの definePageMeta({ middleware: [...] }) の配列順だけで決まる (例: layouts/project.vue の ['authentication', 'get-project-list', 'get-project-current'])。ファイル名による順序制御はしない。
- pages/logout.vue の middleware コンポーネントオプション (Nuxt 2 形式) は Nuxt 4 では実行されない死にコード。動作中のログアウト処理と誤認しない。
- pages/project/_id/ の _id は Nuxt 2 の動的ルート記法の残骸で、Nuxt 4 ではパラメータにならない。[id] への変換や削除を独断でしない。

## i18n

- 文言のソースは locales/{ja,en}/*.json。scripts/merge-locales.js が locales/ja.json, en.json へマージし、nuxt.config はマージ後ファイルだけを読む。文言変更はソース側を編集して pnpm merge-locales を実行する (build / generate では自動実行)。test/i18n-locales.test.ts が整合を検証する。
- strategy: no_prefix (URLに言語コードを付けない)。ロケールの永続化は localStorage キー nuxt-i18n-locale (Cookie ではない)。

## Lint・スタイル

- Lint は Biome (ESLint / Prettier ではない)。pnpm lint / pnpm lint:fix。
- Vuetify は Nuxt モジュールでなく plugins/vuetify.client.ts で全コンポーネントをグローバル登録済み。個別 import は不要。

## 検証

pnpm lint を通し、UI 変更は pnpm dev で実際にブラウザ確認する。型チェックと既存テストは機能の正しさを保証しない。
