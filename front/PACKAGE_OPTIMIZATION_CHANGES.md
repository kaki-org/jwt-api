# Package.json 最適化変更ログ

## 概要

このドキュメントは、`front/package.json` に対して実施された最適化変更の詳細な記録です。これらの変更は、開発体験の向上、モダンな Node.js 環境への対応、および pnpm 設定の競合解決を目的として実施されました。

## 実施日

2025 年 8 月 9 日

## 変更内容

### 1. Node.js レガシーオプションの削除

#### 変更前

```json
{
  "scripts": {
    "dev": "NODE_OPTIONS='--openssl-legacy-provider' nuxi dev",
    "dev:mock": "NODE_OPTIONS='--openssl-legacy-provider' MOCK_SERVER=1 pnpm dev",
    "build": "NODE_OPTIONS='--openssl-legacy-provider' nuxi build",
    "start": "NODE_OPTIONS='--openssl-legacy-provider' nuxi start",
    "generate": "NODE_OPTIONS='--openssl-legacy-provider' nuxi generate"
  }
}
```

#### 変更後

```json
{
  "scripts": {
    "dev": "nuxi dev",
    "dev:mock": "MOCK_SERVER=1 pnpm dev",
    "build": "nuxi build",
    "start": "nuxi start",
    "generate": "nuxi generate"
  }
}
```

#### 変更理由

- Node.js 20.12.2+ では `--openssl-legacy-provider` フラグが不要
- モダンな暗号化機能を使用することでセキュリティが向上
- クリーンなスクリプト設定により保守性が向上

### 2. pnpm ビルド依存関係設定の最適化

#### 変更前

```json
{
  "pnpm": {
    "ignoredBuiltDependencies": ["@parcel/watcher", "core-js", "esbuild"],
    "onlyBuiltDependencies": ["esbuild"]
  }
}
```

#### 変更後

```json
{
  "pnpm": {
    "ignoredBuiltDependencies": ["@parcel/watcher", "core-js"],
    "onlyBuiltDependencies": ["esbuild"]
  }
}
```

#### 変更理由

- `esbuild` が `ignoredBuiltDependencies` と `onlyBuiltDependencies` の両方に含まれていた競合を解決
- `esbuild` は `onlyBuiltDependencies` にのみ保持し、適切にビルドされるように設定
- 競合しない明確なルールにより、パッケージインストール時の問題を回避

### 3. Vuetify 設定の検証

#### 現在の設定

- `vuetify`: 3.9.4 (dependencies)
- `@nuxtjs/vuetify`: 1.12.3 (devDependencies)

#### 検証結果

- 両方のパッケージが適切にインストールされることを確認
- Vuetify コンポーネント（v-text-field、v-btn など）が正常に動作することを確認
- ピア依存関係の警告はあるが、機能的には問題なし

## テスト結果

### 実行したテスト

1. **クリーンインストールテスト**

   ```bash
   rm -rf node_modules pnpm-lock.yaml
   pnpm install
   ```

   - 結果: ✅ 成功（25 秒で完了）
   - 警告: Vuetify 2.x のピア依存関係警告（機能には影響なし）

2. **開発サーバーテスト**

   ```bash
   pnpm dev
   ```

   - 結果: ✅ 成功
   - OpenSSL エラーなし
   - サーバーが正常に起動（http://localhost:3000）

3. **ビルドテスト**

   ```bash
   pnpm build
   ```

   - 結果: ✅ 成功
   - ビルド時間: 約 1.5 秒
   - 出力サイズ: 1.65 MB (394 kB gzip)

4. **静的生成テスト**

   ```bash
   pnpm generate
   ```

   - 結果: ✅ 成功
   - 17 ルートのプリレンダリング完了
   - 静的ホスティング用ファイル生成成功

5. **プロダクションサーバーテスト**

   ```bash
   pnpm start
   ```

   - 結果: ✅ 成功
   - プレビューモードで正常起動

## 潜在的な問題とトラブルシューティング

### 1. Vuetify ピア依存関係警告

**問題**: `@nuxtjs/vuetify` が Vue 2.x を期待しているが、Vue 3.x を使用している

**症状**:

```
└─┬ @nuxtjs/vuetify 1.12.3
  ├─┬ vuetify 2.6.13
  │ └── ✕ unmet peer vue@^2.6.4: found 3.5.13
```

**解決策**:

- 現在の設定では機能的に問題なし
- 将来的には Nuxt 3 対応の Vuetify モジュールへの移行を検討
- 警告を無視して継続使用可能

### 2. OpenSSL エラーが発生する場合

**症状**: `digital envelope routines::unsupported` エラー

**原因**: 古い Node.js バージョンまたは特定の依存関係の問題

**解決策**:

1. Node.js バージョンを確認（20.12.2+ 推奨）
2. 一時的にレガシーフラグを復活させる:
   ```json
   {
     "scripts": {
       "dev": "NODE_OPTIONS='--openssl-legacy-provider' nuxi dev"
     }
   }
   ```

### 3. pnpm インストールエラー

**症状**: ビルド依存関係のインストールに失敗

**原因**: 競合する pnpm 設定

**解決策**:

1. `pnpm.ignoredBuiltDependencies` と `pnpm.onlyBuiltDependencies` の重複を確認
2. キャッシュをクリア: `pnpm store prune`
3. 再インストール: `rm -rf node_modules pnpm-lock.yaml && pnpm install`

## ロールバック手順

変更に問題が発生した場合、以下の手順でロールバックできます：

### 1. バックアップファイルからの復元

```bash
cd front
cp package.json.backup package.json
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### 2. 個別の設定復元

#### Node.js レガシーオプションの復元

```json
{
  "scripts": {
    "dev": "NODE_OPTIONS='--openssl-legacy-provider' nuxi dev",
    "build": "NODE_OPTIONS='--openssl-legacy-provider' nuxi build"
  }
}
```

#### pnpm 設定の復元

```json
{
  "pnpm": {
    "ignoredBuiltDependencies": ["@parcel/watcher", "core-js", "esbuild"],
    "onlyBuiltDependencies": ["esbuild"]
  }
}
```

## 今後の推奨事項

### 1. Vuetify 設定の現代化

- Nuxt 3 対応の Vuetify 統合方法への移行を検討
- `@nuxtjs/vuetify` から直接的な Vuetify 3 統合への移行

### 2. 依存関係の定期的な更新

- 月次での依存関係更新チェック
- セキュリティアップデートの適用

### 3. Node.js バージョン管理

- `.tool-versions` ファイルでの Node.js バージョン固定
- CI/CD パイプラインでの同一バージョン使用

## 関連ファイル

- `package.json` - メインの設定ファイル
- `package.json.backup` - 変更前のバックアップ
- `nuxt.config.ts` - Nuxt.js 設定
- `.tool-versions` - Node.js バージョン指定

## 変更者

Kiro AI Assistant

## 承認者

プロジェクト開発者による確認が必要
