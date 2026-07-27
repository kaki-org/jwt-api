# users テーブルへのインデックス追加 — 設計

## 追加するインデックス

```ruby
add_index :users, :email, unique: true, where: 'activated', name: 'index_users_on_email_activated'
add_index :users, :refresh_jti, unique: true
```

### 1. `index_users_on_email_activated`

- 対象: `users(email) WHERE activated`
- 目的: `User.find_by(email:, activated: true)` の完全カバー + アクティブユーザー間の email 一意性保証
- PostgreSQL の部分インデックス機能を使用。`where: 'activated'` は boolean カラムをそのまま述語に使う
- 既存の `EmailValidator` によるアプリ層バリデーションは残す（ユーザー向けエラーメッセージのため）。
  DB 制約は競合状態に対する最後の防波堤として機能する

### 2. `index_users_on_refresh_jti`

- 対象: `users(refresh_jti)`, unique
- 目的: `RefreshToken#verify_jti?` 経路の検索高速化と JTI の一意性保証
- `refresh_jti` は `Digest::MD5.hexdigest(SecureRandom.uuid)` 由来で衝突しない
- PostgreSQL の UNIQUE インデックスは NULL を重複とみなさないため、
  ログアウト済み（`refresh_jti = nil`）ユーザーが複数いても問題ない

## マイグレーション

`db/migrate/20260720000000_add_indexes_to_users.rb`

`disable_ddl_transaction!` + `algorithm: :concurrently` は本サンプルアプリの規模では不要と判断し、
通常のトランザクション内マイグレーションとする（既存マイグレーションの様式に合わせる）。

## 既存データへの影響

マイグレーション適用時、以下のデータが存在すると失敗する:

- 同一 email を持つ activated=true のユーザーが 2 件以上
- 同一 refresh_jti を持つユーザーが 2 件以上（実質発生しない）

`db/seeds/development/users.rb` は `find_or_initialize_by(email:, activated: true)` を使っており
重複を作らないため、開発環境では問題ない。マイグレーション実行前に重複チェックを行う。

## テスト方針

`spec/models/user_spec.rb` に DB 制約の検証を追加する:

1. 未アクティベートユーザーがアクティブユーザーと同じ email で保存できること（R1 の非回帰）
2. アクティブユーザー同士の email 重複が `ActiveRecord::RecordNotUnique` になること
   （アプリ層バリデーションを迂回するため `insert_all` / `update_column` を使用）
