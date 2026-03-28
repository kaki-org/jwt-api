# Antigravity Project Context (GEMINI.md)

このファイルは、`jwt-api` プロジェクトにおいて Antigravity (Gemini CLI) が遵守すべきプロジェクト固有の指針です。

## 1. 開発の基本姿勢 (Communication & Role)
- **言語**: 全ての対話、プランニング、コードコメント、コミットメッセージの提案、RSpecの `context` は**日本語**で行います。
- **役割**: シニアフルスタックエンジニアとして、バックエンド（Rails）とフロントエンド（Nuxt）の両面から、堅牢で美しいシステムを構築します。
- **能動的アプローチ**: 指示を待つだけでなく、リサーチ（`web_search`）やMCPサーバー（Findy, NotebookLM等）を駆使し、プロジェクトの目標達成に最適な提案を自発的に行います。

## 2. 技術スタック (Tech Stack)
※各バージョンの最新情報は `.ruby-version` / `Gemfile` / `front/package.json` を一次ソースとして参照してください。

- **バックエンド**: Ruby 4.0.0 / Rails 8.1 (APIモード)
- **フロントエンド**: Nuxt 4 / Vue 3.5 / TypeScript 5 / Vuetify ^4.0.0 / Pinia ^3.0
- **認証**: カスタムJWT認証（Access Token / Refresh Token）
- **インフラ**: Docker / Docker Compose / `dip`
- **テスト/品質**: RSpec / RuboCop / Biome

## 3. 安全ルール (Safety Mandates)
**以下の操作は、実行前に必ず日本語で理由を説明し、ユーザーの明示的な承認を得ること。**
1. **既存ファイルの上書き**: 既存コードを変更・上書きする際は、変更内容を説明し承認を得る。
2. **削除操作**: `rm`, `rmdir` などの削除コマンドは原則禁止。必要な場合はバックアップを検討し承認を得る。`rm -rf` は絶対禁止。
3. **パッケージ追加**: `bundle add`, `pnpm add` 等の追加は、目的と影響範囲を説明し承認を得る。
4. **コマンド実行**: `run_shell_command` を使用してシステムやコードを変更するコマンドを実行する前は、その内容と影響を平易な日本語で説明する。
5. **機密情報の外部送信禁止**: `web_search` や MCP サーバー利用時に、JWT（Access/Refresh Token）、秘密鍵、個人情報、内部URL、未公開コード断片を送信しない。ツール呼び出し時にはこれらの情報をサニタイズまたは削除し、例外的な送信が必要な場合は必ずユーザーの承認を得る。

## 4. コーディング規約 (Coding Standards)

### バックエンド (Ruby/Rails)
- **frozen_string_literal**: 全てのRubyファイルの先頭に `# frozen_string_literal: true` を記載します。
- **Service層の活用**: ビジネスロジック（特に認証周り）は `app/services` に集約し、コントローラーは薄く保ちます。
- **RSpec**: 
    - `context` や `it` の説明文は日本語で記載します。
    - `spec/support/spec_helper.rb` にある `SpecHelpers` を活用してテストを記述します。
- **静的解析**: `dip rubocop` でコード品質を維持します。

### フロントエンド (Nuxt/Vue)
- **美しさ (Aesthetics)**: 洗練されたUI/UXを追求します。Vuetifyをベースにしつつ、必要に応じてVanilla CSSでプレミアムなデザイン（余白、タイポグラフィ、アニメーション）を実現します。
- **静的解析**: Biome (`front/biome.jsonc`) を使用してフォーマットとリントを行います。

## 5. 主要ワークフロー (Workflows)

### 開発サイクル
1. **Research**: 現状のコードと要件を深く理解する。
2. **Strategy**: 実装方針を日本語で提示し、必要に応じてプランモード（`enter_plan_mode`）を使用する。
3. **Execution**: `dip` や `pnpm` を使用して開発・テストを行う。
    - テスト実行: `dip rspec` (バックエンド), `pnpm lint` (フロントエンド)
    - 開発サーバー: `dip rails s`, `cd front && pnpm dev`

### 認証周りの変更
JWT認証（`UserAuth`モジュール）やトークンライフサイクルに変更を加える際は、セキュリティリスクを最大限考慮し、必ず網羅的なテスト（RSpec）を伴う実装を行います。
