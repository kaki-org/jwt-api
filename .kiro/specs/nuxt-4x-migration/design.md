# 設計書

## 概要

front ディレクトリ配下の Nuxt.js アプリケーションを Nuxt 4.x の最新仕様に完全対応させるためのマイグレーション設計です。現在のプロジェクトは Nuxt 4.0.0 を使用していますが、設定ファイルや構造が古い Nuxt 2/3 の形式のままになっており、Nuxt 4.x の新機能や最適化を活用できていません。

## アーキテクチャ

### 現在の構造

```
front/
├── nuxt.config.ts (Nuxt 2/3形式)
├── .eslintrc.js (CommonJS形式)
├── tsconfig.json (基本設定のみ)
├── plugins/ (古い形式)
├── middleware/ (古い形式)
├── store/ (Vuex使用)
└── layouts/ (既存形式)
```

### 移行後の構造

```
front/
├── nuxt.config.ts (Nuxt 4.x形式)
├── eslint.config.js (Flat Config形式)
├── tsconfig.json (Nuxt 4.x最適化)
├── plugins/ (defineNuxtPlugin使用)
├── middleware/ (defineNuxtRouteMiddleware使用)
├── composables/ (状態管理をPiniaに移行)
└── layouts/ (新しいレイアウトシステム)
```

## コンポーネントと インターフェース

### 1. 設定ファイルの移行

#### nuxt.config.ts

- **現在**: Nuxt 2/3 の古い形式
- **移行後**: Nuxt 4.x の新しい設定形式
- **主な変更点**:
  - `buildModules` → `modules`に統合
  - `head` → `app.head`に変更
  - `router.middleware` → `app.middleware`に変更
  - `serverMiddleware` → `nitro.serverHandlers`に変更
  - `axios`設定を`$fetch`ベースに変更
  - `proxy`設定を`nitro.devProxy`に変更

#### ESLint 設定

- **現在**: `.eslintrc.js` (CommonJS)
- **移行後**: `eslint.config.js` (Flat Config)
- **主な変更点**:
  - `@nuxt/eslint`モジュールの使用
  - Flat Config 形式への移行
  - TypeScript 対応の強化

### 2. プラグインシステムの移行

#### 認証プラグイン (plugins/auth.js)

- **現在**: 古い形式の`defineNuxtPlugin`使用
- **移行後**: 新しい Composables + Pinia ベースの状態管理
- **変更点**:
  - Vuex からの脱却
  - `useAuthStore`コンポーザブルの作成
  - JWT 処理の最適化

#### Axios プラグイン (plugins/axios.js)

- **現在**: `$axios`インターセプター使用
- **移行後**: `$fetch`/`ofetch`ベースの HTTP クライアント
- **変更点**:
  - `$fetch`のインターセプター使用
  - 型安全性の向上
  - エラーハンドリングの改善

### 3. 状態管理の移行

#### Vuex → Pinia

- **現在**: `store/index.js` (Vuex)
- **移行後**: `stores/` (Pinia)
- **移行対象**:
  - `auth` store → `useAuthStore`
  - `user` store → `useUserStore`
  - `project` store → `useProjectStore`
  - `toast` store → `useToastStore`

### 4. ミドルウェアの移行

#### 認証ミドルウェア

- **現在**: `middleware/authentication.js`
- **移行後**: `defineNuxtRouteMiddleware`使用
- **変更点**:
  - 新しいミドルウェア形式への移行
  - Composables との連携
  - 型安全性の向上

### 5. モジュールの移行

#### i18n 設定

- **現在**: `@nuxtjs/i18n` v10.0.0
- **移行後**: Nuxt 4.x 対応の最新設定
- **変更点**:
  - 設定形式の更新
  - 型定義の改善
  - パフォーマンスの最適化

#### Vuetify 設定

- **現在**: `@nuxtjs/vuetify` v1.12.3
- **移行後**: Nuxt 4.x 対応の設定
- **変更点**:
  - モジュール設定の更新
  - テーマ設定の最適化
  - Tree-shaking の改善

## データモデル

### 認証データモデル

```typescript
interface AuthState {
  token: string | null;
  expires: number;
  payload: JWTPayload;
  user: User | null;
}

interface User {
  sub: string;
  email: string;
  name: string;
}
```

### プロジェクトデータモデル

```typescript
interface Project {
  id: number;
  name: string;
  description: string;
}

interface ProjectState {
  current: Project | null;
  list: Project[];
}
```

## エラーハンドリング

### HTTP エラーハンドリング

- `$fetch`のエラーハンドリング機能を活用
- 401 エラーの自動リフレッシュトークン処理
- ユーザーフレンドリーなエラーメッセージ表示

### 認証エラーハンドリング

- トークン期限切れの自動検出
- リフレッシュトークンによる自動更新
- ログアウト処理の改善

## テスト戦略

### 単体テスト

- Composables のテスト
- Store のテスト
- ユーティリティ関数のテスト

### 統合テスト

- 認証フローのテスト
- API 通信のテスト
- ルーティングのテスト

### E2E テスト

- ログイン・ログアウトフローのテスト
- 国際化機能のテスト
- レスポンシブデザインのテスト

## パフォーマンス最適化

### バンドルサイズ最適化

- Tree-shaking の活用
- 動的インポートの使用
- 不要な依存関係の削除

### ランタイムパフォーマンス

- Composition API の活用
- リアクティブシステムの最適化
- メモリリークの防止

## セキュリティ考慮事項

### JWT 処理

- トークンの安全な保存
- XSS 攻撃の防止
- CSRF 攻撃の防止

### API 通信

- HTTPS 通信の強制
- 適切な CORS 設定
- レート制限の実装

## 移行戦略

### フェーズ 1: 設定ファイルの移行

1. `nuxt.config.ts`の更新
2. ESLint 設定の移行
3. TypeScript 設定の最適化

### フェーズ 2: 状態管理の移行

1. Pinia の導入
2. Vuex からの移行
3. Composables の作成

### フェーズ 3: プラグイン・ミドルウェアの移行

1. 認証プラグインの更新
2. HTTP クライアントの移行
3. ミドルウェアの更新

### フェーズ 4: モジュール設定の最適化

1. i18n 設定の更新
2. Vuetify 設定の最適化
3. その他モジュールの更新

### フェーズ 5: テスト・検証

1. 機能テストの実行
2. パフォーマンステスト
3. セキュリティ検証

## 互換性とリスク

### 互換性リスク

- Vuex → Pinia 移行時のデータ構造変更
- プラグイン API の変更による影響
- モジュール設定変更による影響

### 軽減策

- 段階的な移行による影響範囲の限定
- 十分なテストによる品質保証
- ロールバック計画の準備

## 技術的制約

### 依存関係制約

- Node.js >=20.12.2
- Vue 3.5.13
- Nuxt 4.0.0 以上

### 開発環境制約

- Docker 環境での動作保証
- 既存の CI/CD パイプラインとの互換性
- 開発チームのスキルレベル考慮
