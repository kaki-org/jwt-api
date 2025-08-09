# 設計書

## 概要

frontディレクトリ配下のNuxt.jsアプリケーションをNuxt 4.xの最新仕様に完全対応させるためのマイグレーション設計です。現在のプロジェクトはNuxt 4.0.0を使用していますが、設定ファイルや構造が古いNuxt 2/3の形式のままになっており、Nuxt 4.xの新機能や最適化を活用できていません。

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
- **現在**: Nuxt 2/3の古い形式
- **移行後**: Nuxt 4.xの新しい設定形式
- **主な変更点**:
  - `buildModules` → `modules`に統合
  - `head` → `app.head`に変更
  - `router.middleware` → `app.middleware`に変更
  - `serverMiddleware` → `nitro.serverHandlers`に変更
  - `axios`設定を`$fetch`ベースに変更
  - `proxy`設定を`nitro.devProxy`に変更

#### ESLint設定
- **現在**: `.eslintrc.js` (CommonJS)
- **移行後**: `eslint.config.js` (Flat Config)
- **主な変更点**:
  - `@nuxt/eslint`モジュールの使用
  - Flat Config形式への移行
  - TypeScript対応の強化

### 2. プラグインシステムの移行

#### 認証プラグイン (plugins/auth.js)
- **現在**: 古い形式の`defineNuxtPlugin`使用
- **移行後**: 新しいComposables + Piniaベースの状態管理
- **変更点**:
  - Vuexからの脱却
  - `useAuthStore`コンポーザブルの作成
  - JWT処理の最適化

#### Axiosプラグイン (plugins/axios.js)
- **現在**: `$axios`インターセプター使用
- **移行後**: `$fetch`/`ofetch`ベースのHTTPクライアント
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
  - Composablesとの連携
  - 型安全性の向上

### 5. モジュールの移行

#### i18n設定
- **現在**: `@nuxtjs/i18n` v10.0.0
- **移行後**: Nuxt 4.x対応の最新設定
- **変更点**:
  - 設定形式の更新
  - 型定義の改善
  - パフォーマンスの最適化

#### Vuetify設定
- **現在**: `@nuxtjs/vuetify` v1.12.3
- **移行後**: Nuxt 4.x対応の設定
- **変更点**:
  - モジュール設定の更新
  - テーマ設定の最適化
  - Tree-shakingの改善

## データモデル

### 認証データモデル
```typescript
interface AuthState {
  token: string | null
  expires: number
  payload: JWTPayload
  user: User | null
}

interface User {
  sub: string
  email: string
  name: string
}
```

### プロジェクトデータモデル
```typescript
interface Project {
  id: number
  name: string
  description: string
}

interface ProjectState {
  current: Project | null
  list: Project[]
}
```

## エラーハンドリング

### HTTPエラーハンドリング
- `$fetch`のエラーハンドリング機能を活用
- 401エラーの自動リフレッシュトークン処理
- ユーザーフレンドリーなエラーメッセージ表示

### 認証エラーハンドリング
- トークン期限切れの自動検出
- リフレッシュトークンによる自動更新
- ログアウト処理の改善

## テスト戦略

### 単体テスト
- Composablesのテスト
- Storeのテスト
- ユーティリティ関数のテスト

### 統合テスト
- 認証フローのテスト
- API通信のテスト
- ルーティングのテスト

### E2Eテスト
- ログイン・ログアウトフローのテスト
- 国際化機能のテスト
- レスポンシブデザインのテスト

## パフォーマンス最適化

### バンドルサイズ最適化
- Tree-shakingの活用
- 動的インポートの使用
- 不要な依存関係の削除

### ランタイムパフォーマンス
- Composition APIの活用
- リアクティブシステムの最適化
- メモリリークの防止

## セキュリティ考慮事項

### JWT処理
- トークンの安全な保存
- XSS攻撃の防止
- CSRF攻撃の防止

### API通信
- HTTPS通信の強制
- 適切なCORS設定
- レート制限の実装

## 移行戦略

### フェーズ1: 設定ファイルの移行
1. `nuxt.config.ts`の更新
2. ESLint設定の移行
3. TypeScript設定の最適化

### フェーズ2: 状態管理の移行
1. Piniaの導入
2. Vuexからの移行
3. Composablesの作成

### フェーズ3: プラグイン・ミドルウェアの移行
1. 認証プラグインの更新
2. HTTPクライアントの移行
3. ミドルウェアの更新

### フェーズ4: モジュール設定の最適化
1. i18n設定の更新
2. Vuetify設定の最適化
3. その他モジュールの更新

### フェーズ5: テスト・検証
1. 機能テストの実行
2. パフォーマンステスト
3. セキュリティ検証

## 互換性とリスク

### 互換性リスク
- Vuex → Pinia移行時のデータ構造変更
- プラグインAPIの変更による影響
- モジュール設定変更による影響

### 軽減策
- 段階的な移行による影響範囲の限定
- 十分なテストによる品質保証
- ロールバック計画の準備

## 技術的制約

### 依存関係制約
- Node.js >=20.12.2
- Vue 3.5.13
- Nuxt 4.0.0以上

### 開発環境制約
- Docker環境での動作保証
- 既存のCI/CDパイプラインとの互換性
- 開発チームのスキルレベル考慮