# Pinia Stores

このディレクトリには、Nuxt 4.x 対応の Pinia ストアが含まれています。

## ストア構成

### `app.ts` - アプリケーション設定ストア

- アプリケーション全体の設定を管理
- スタイル設定（AppBar の高さなど）
- ログイン後のリダイレクト設定
- 記憶するパスの管理

### `auth.ts` - 認証ストア

- JWT トークンの管理
- 認証状態の管理
- トークンの有効期限チェック

### `user.ts` - ユーザーストア

- 現在のユーザー情報の管理
- ログイン状態の管理
- ユーザー情報の更新

### `project.ts` - プロジェクトストア

- プロジェクト一覧の管理
- 現在のプロジェクトの管理
- プロジェクトの CRUD 操作

### `toast.ts` - トーストストア

- 通知メッセージの管理
- 成功・エラー・警告・情報メッセージの表示
- 自動非表示機能

## 使用方法

```typescript
// コンポーネント内での使用例
<script setup>
  import {(useAuthStore, useUserStore)} from '~/stores' const authStore =
  useAuthStore() const userStore = useUserStore() // 認証状態の確認 if
  (authStore.isAuthenticated) {console.log("ユーザーは認証済みです")}
  // ユーザー情報の取得 const currentUser = userStore.current
</script>
```

## 移行について

この Pinia ストアは、既存の Vuex ストア（`store/index.js`）から移行されました。
主な変更点：

1. **Vuex → Pinia**: より型安全で軽量な状態管理
2. **Composition API**: `defineStore`を使用した新しい記法
3. **TypeScript 対応**: 完全な型安全性
4. **自動インポート**: Nuxt 4.x の自動インポート機能に対応

## 注意事項

- 既存の Vuex ストア（`store/index.js`）は後のタスクで削除予定
- 各ストアは独立しており、必要に応じて他のストアを参照可能
- Nuxt 4.x の自動インポート機能により、明示的なインポートは不要
