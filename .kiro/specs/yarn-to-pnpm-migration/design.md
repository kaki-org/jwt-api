# 設計書

## 概要

この設計書は、`./front/` Nuxt.js プロジェクトの yarn から pnpm への移行戦略を概説します。移行では、既存の Rails API バックエンドと開発ワークフローとの完全な互換性を維持しながら、パッケージ管理設定、ビルドプロセス、デプロイメントスクリプト、ドキュメントの更新が含まれます。

pnpm は yarn に対していくつかの利点を提供します：

- **パフォーマンス**: コンテンツアドレス可能ストレージによる高速なインストール時間
- **ディスク容量**: プロジェクト間での依存関係の共有によりディスク使用量を削減
- **厳密な解決**: より良い依存関係解決により幻の依存関係を防止
- **互換性**: 改善されたキャッシュ機能を持つ完全な npm 互換性

## アーキテクチャ

### 現在のアーキテクチャ

```
jwt-rails/
├── front/                  # Nuxt.jsフロントエンド（現在yarnを使用）
│   ├── package.json       # yarn固有のスクリプトを含む
│   ├── yarn.lock          # Yarnロックファイル
│   ├── Dockerfile         # yarnコマンドを使用
│   └── heroku.yml         # yarnでのデプロイメント
├── docker-compose.yml     # コメント内でyarnを参照
└── dip.yml               # yarnコマンド定義を含む
```

### 目標アーキテクチャ

```
jwt-rails/
├── front/                  # Nuxt.jsフロントエンド（pnpmに移行）
│   ├── package.json       # pnpm互換スクリプトで更新
│   ├── pnpm-lock.yaml     # pnpmロックファイル
│   ├── .npmrc             # pnpm設定
│   ├── Dockerfile         # pnpmコマンドを使用するよう更新
│   └── heroku.yml         # pnpmでのデプロイメントに更新
├── docker-compose.yml     # 参照を更新
└── dip.yml               # コマンド定義を更新
```

## コンポーネントとインターフェース

### 1. パッケージ管理設定

**package.json 更新**

- dependencies から yarn 依存関係を削除
- yarn を参照するスクリプトを pnpm を使用するよう更新
- 既存のすべての依存関係バージョンを維持
- 必要に応じて pnpm 固有の設定を追加

**ロックファイル移行**

- `yarn.lock`を削除
- 同等の依存関係解決で`pnpm-lock.yaml`を生成
- 移行中にバージョンドリフトが発生しないことを確保

**pnpm 設定**

- pnpm 固有の設定用に`.npmrc`ファイルを作成
- 厳密なピア依存関係処理を設定
- 適切なレジストリとキャッシュ設定をセットアップ

### 2. ビルドと開発環境

**Docker 統合**

- `front/Dockerfile`を yarn の代わりに pnpm を使用するよう更新
- Docker イメージに pnpm をインストール
- ビルドと開始コマンドを更新
- 既存の環境変数とビルド引数を維持

**開発スクリプト**

- package.json 内のすべての npm スクリプトを更新
- `dev`、`build`、`start`、`generate`、`lint`、`lintfix`が pnpm で動作することを確保
- 既存の NODE_OPTIONS と環境設定を維持

### 3. デプロイメントと CI/CD

**Heroku デプロイメント**

- `front/heroku.yml`を pnpm コマンドを使用するよう更新
- Heroku ビルドパックの pnpm 互換性を確保
- 既存の環境変数とビルド設定を維持

**Docker Compose**

- `docker-compose.yml`内の yarn 参照を更新
- サービス定義が pnpm ベースのコンテナで動作することを確保

**DIP 設定**

- `dip.yml`の yarn コマンドを pnpm に置き換え
- 既存のコマンド構造と説明を維持

### 4. ドキュメントとセットアップ

**README 更新**

- yarn インストール指示を pnpm に置き換え
- すべてのコマンド例を pnpm を使用するよう更新
- pnpm インストールの前提条件を追加

**開発セットアップ**

- 新しい開発者向けのセットアップ指示を更新
- 既存の開発ワークフローとの互換性を確保

## データモデル

### 移行状態追跡

```typescript
interface MigrationState {
  packageJsonUpdated: boolean;
  lockFileGenerated: boolean;
  dockerfileUpdated: boolean;
  deploymentConfigUpdated: boolean;
  documentationUpdated: boolean;
  yarnArtifactsRemoved: boolean;
}
```

### 依存関係マッピング

```typescript
interface DependencyMapping {
  name: string;
  currentVersion: string;
  resolvedVersion: string;
  migrationStatus: "pending" | "migrated" | "verified";
}
```

## エラーハンドリング

### 移行検証

- **依存関係解決の競合**: pnpm の厳密な解決が問題を引き起こす場合、適切な設定で`.npmrc`を設定
- **ビルド失敗**: 重大な問題が発生した場合の yarn へのロールバック戦略を実装
- **Docker ビルド問題**: コンテナ化環境で pnpm のインストールとキャッシュが正しく動作することを確保

### 互換性チェック

- **Node バージョン互換性**: pnpm が Node.js 22.17.0-alpine で動作することを確認
- **Nuxt.js 互換性**: pnpm が Nuxt.js 3.x で正しく動作することを確保
- **依存関係互換性**: 既存のすべての依存関係が pnpm の解決で動作することを検証

### ロールバック戦略

- 初期移行中に yarn.lock をバックアップとして保持
- 重大な問題が発生した場合のロールバック手順を文書化
- yarn アーティファクトを削除する前に検証手順を実装

## テスト戦略

### 移行前テスト

1. **ベースライン機能**: 現在のアプリケーション動作を文書化
2. **依存関係監査**: 現在のすべての依存関係とそのバージョンを確認
3. **ビルドプロセス**: 現在のビルド時間と出力を文書化

### 移行テスト

1. **依存関係インストール**: pnpm install が同一の node_modules を生成することを確認
2. **開発サーバー**: `pnpm dev`が正しく起動し、ホットリロードが動作することをテスト
3. **ビルドプロセス**: `pnpm build`が yarn build と同一の出力を生成することを確認
4. **リンティング**: `pnpm lint`と`pnpm lintfix`が正しく動作することを確保

### 移行後テスト

1. **Docker ビルド**: コンテナ化されたビルドが pnpm で動作することを確認
2. **デプロイメント**: 更新された設定でデプロイメントプロセスをテスト
3. **パフォーマンス**: インストールとビルド時間を比較
4. **統合**: フロントエンドが Rails API と正しく通信することを確認

### 自動テスト

1. **CI パイプライン**: 既存のテストが pnpm で通ることを確保
2. **E2E テスト**: ユーザーワークフローが機能し続けることを確認
3. **リグレッションテスト**: 移行前後のアプリケーション動作を比較

## 実装フェーズ

### フェーズ 1: ローカル移行

- package.json スクリプトの更新
- pnpm-lock.yaml の生成
- .npmrc 設定の作成
- ローカル開発ワークフローのテスト

### フェーズ 2: コンテナ化

- Dockerfile の更新
- Docker ビルドプロセスのテスト
- docker-compose.yml 参照の更新

### フェーズ 3: デプロイメント設定

- heroku.yml の更新
- dip.yml の更新
- デプロイメントプロセスのテスト

### フェーズ 4: クリーンアップとドキュメント

- yarn.lock と yarn 参照の削除
- README とドキュメントの更新
- 最終検証とテスト

## セキュリティ考慮事項

- **依存関係整合性**: pnpm-lock.yaml が yarn.lock と同じセキュリティ姿勢を維持することを確保
- **レジストリセキュリティ**: .npmrc でセキュアなレジストリ設定を構成
- **ビルドセキュリティ**: Docker ビルドプロセスが脆弱性を導入しないことを確認

## パフォーマンス期待値

- **インストール速度**: 20-30%高速な依存関係インストールを期待
- **ディスク使用量**: pnpm のリンク戦略によりディスク使用量の削減を期待
- **ビルド時間**: 同等またはわずかに改善されたビルド時間を期待
- **キャッシュ効率**: より良いキャッシュにより後続のインストールが改善されることを期待
