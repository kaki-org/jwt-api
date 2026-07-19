# タスクリスト

## 🚨 タスク完全完了の原則

**このファイルの全タスクが完了するまで作業を継続すること**

- 全てのタスクを`[x]`にすること。未完了タスク（`[ ]`）を残したまま作業を終了しない
- スキップは技術的理由がある場合のみ。`- [x] ~~タスク名~~（理由）` 形式で明記する

---

## フェーズ1: DB・モデル

- [x] マイグレーション作成: users に token_version (integer, null: false, default: 0) を追加
- [x] マイグレーション実行と db/schema.rb 更新
- [x] User#forget を refresh_jti 削除 + token_version インクリメントに変更

## フェーズ2: トークン発行・検証

- [x] UserAuth::RevokedTokenError (< JWT::DecodeError) を追加
- [x] TokenGenerateService#encode_access_token で ver クレームを自動付与
- [x] UserAuth::AccessToken#entity_for_user に token_version 照合を追加（ver 欠落時は 0 とみなす）

## フェーズ3: テスト

- [x] spec/models/user_spec.rb: forget の token_version インクリメントを検証
- [x] spec/requests/access_tokens_spec.rb: ver クレーム付与と失効検証（RevokedTokenError）を追加
- [x] spec/requests/api/v1/auth_token_spec.rb: ログアウト後の旧アクセストークンが 401、再ログイン後の新トークンが 200 を検証

## フェーズ4: ドキュメント・検証

- [x] SECURITY.md にログアウト時のトークン失効挙動を記載
- [x] rubocop 全件パス（63 files, no offenses）
- [x] RSpec 全件パス（124 examples, 0 failures, 1 pending は既存の projects_spec）。brakeman は gem 未導入のため実行不可（導入は Issue #1116 で追跡中）

---

## 実装後の振り返り

**実装完了日**: 2026-07-19

**計画と実績の差分**:
- 計画外の前提修正が2件発生した。(1) docker-compose.yml の db マウント先修正（postgres:18 イメージが旧 PGDATA マウントを拒否し DB が起動不能だったため。pg17 の既存データは pgsql-data.pg17.bak に退避し 18 で再初期化）。(2) ローカル bundler の rdoc プラグイン書込権限修正（brew Cellar 内ファイルが read-only だった）。
- brakeman は gem 未導入（Issue #1116 で追跡中）のため実行できず、rubocop + RSpec + implementation-validator 検証で代替した。
- それ以外は design.md の通りに実装され、アプリコードの呼び出し元（コントローラ・サービス）は無変更で完了した。

**検証結果**:
- rubocop: 63 files, no offenses（schema.rb 再生成分のクォートは -a/-A で修正）
- RSpec: 124 examples, 0 failures, 1 pending（pending は既存の projects_spec）
- implementation-validator: 品質・セキュリティ・規約準拠は問題なし。docker-compose.yml の変更を design.md 影響範囲へ追記済み

**学んだこと**:
- ver クレーム照合は「署名検証済み payload に対してのみ行う」前提が安全性の根拠。fetch(:ver, 0) の移行措置は署名があるため攻撃経路にならない
- RSpec/ContextWording の AllowedPatterns（日本語）は「〜を実行する場合」のような を+する形にする必要がある
- renovate による postgres メジャーアップデート（17→18）はマウントレイアウト非互換を引き起こす。同種の構成では docker-compose の volumes 見直しが必須

**次回への改善提案**:
- コミット時は docker-compose.yml 修正を本機能と別コミット/別PRに分離する（1PR=1関心事）
- postgres 18 マウント問題は他の開発者も踏むため、README かセットアップ手順への注記を検討
- Issue #1116（brakeman 導入）を先に処理すると認証系変更の検証が強化される
