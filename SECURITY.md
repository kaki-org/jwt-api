# セキュリティポリシー

## 脆弱性の報告

セキュリティ上の問題を発見した場合は、公開 Issue を作成せず、リポジトリ管理者へ
非公開で連絡してください。

## 秘密情報スキャン

- `.gitleaks.toml` の設定で [gitleaks](https://github.com/gitleaks/gitleaks) を運用。
- CI（`.github/workflows/gitleaks.yml`）が PR / `develop`・`main` への push 時に
  作業ツリーを `gitleaks dir` で走査する。
- ローカル実行例:

  ```bash
  gitleaks dir . --config .gitleaks.toml --redact --verbose
  ```

## インシデント記録: README への秘密情報混入（2022年）

### 概要

2022年6月、`README.md` に以下が平文でコミット・公開された（リポジトリは public）。

| 検出 | コミット | 日付 |
|------|----------|------|
| `RAILS_MASTER_KEY`（credentials 復号鍵） | `410bbb4` (fix README) | 2022-06-28 |
| JWT アクセストークン例 + 暗号化済み subject | `ef2e6db` | 2022-06-27 |
| Heroku router ログの `request_id`（※APIキー誤検知） | `ef2e6db` | 2022-06-27 |

2026-05-16 に gitleaks スキャンで検出。漏洩した `RAILS_MASTER_KEY` は検出時点で
**まだ有効**であり、`config/credentials.yml.enc`（`secret_key_base`）を復号可能な
状態だった。JWT 例は `exp=1654208286`（2022-06-02）で失効済み。`request_id` は
Heroku の HTTP リクエスト相関IDであり秘密情報ではない（gitleaks の誤検知）。

### 実施した対応（2026-05-16）

1. **鍵ローテーション**: 新しい Rails master key と新 `secret_key_base` を生成し
   `config/credentials.yml.enc` を再暗号化。漏洩鍵では復号不可能であることを検証済み。
2. **現行ファイルの除染**: `README.md` の master key / JWT / `request_id` を
   プレースホルダ化。ローカルの `.envrc`（gitignore 済・未コミット）も新キーへ更新。
3. **再発防止**: `.gitleaks.toml` と gitleaks CI ワークフローを追加。

### コミット履歴を書き換えていない理由

秘密情報は約4年間 public リポジトリで公開されており、`git filter-repo` 等で
履歴を書き換え force-push しても、GitHub のキャッシュ・既存クローン・スクレイパー
からは取り除けない。よって**履歴書き換えは実害の解消にならず**、根本対策は
漏洩した秘密情報そのものの無効化（鍵ローテーション）である。多数のブランチ・
PR への影響と全コラボレータの再 clone コストに見合わないため、履歴は意図的に
現状維持とする。CI は履歴全体ではなく作業ツリーのみを走査する。

### 運用者が実施すべき作業（必須）

新しい `RAILS_MASTER_KEY` を安全な経路で受領し、以下を実施すること。

1. Heroku 本番および他の全環境（staging / CI シークレット等）の
   環境変数 `RAILS_MASTER_KEY` を新しい値へ差し替える。
2. アプリを再デプロイする。
   - **影響**: `secret_key_base` が変わるため、既存の全ユーザーセッション・
     発行済みトークン（アクセス/リフレッシュ）が無効化される。再ログインが必要。
3. 旧 `secret_key_base` から派生していた値（署名済み Cookie 等）の失効を確認する。

### 任意対応

- 履歴に残る旧コミットオブジェクトは force-push 後も SHA 直接参照で
  GitHub に残存しうる。完全削除が必要なら GitHub Support にキャッシュ
  パージを依頼する。
