# users テーブルへのインデックス追加 — タスクリスト

- [x] T1: 既存データに重複（activated 同一 email / 同一 refresh_jti）が無いか確認する
- [x] T2: マイグレーションファイル `AddIndexesToUsers` を作成する
- [x] T3: `dip rails db:migrate` を実行し `db/schema.rb` に反映する
- [x] T4: `spec/models/user_spec.rb` に DB 制約の検証テストを追加する
- [x] T5: `dip rspec` を実行し全テストがパスすることを確認する
- [x] T6: `dip rubocop` を実行し規約違反が無いことを確認する
- [x] T7: implementation-validator による品質検証
- [x] T8: 振り返りを本ファイルに追記する

## 申し送り事項

### 実装完了日

2026-07-20

### 検証結果

| 項目 | 結果 |
|------|------|
| `bundle exec rspec` | 128 examples, 0 failures, 1 pending（既存の未実装 projects_spec） |
| 追加テスト | 4 examples, 0 failures（documentation 形式で実行を確認） |
| `bundle exec rubocop` | 64 files inspected, no offenses detected |
| マイグレーション可逆性 | `db:rollback` → `db:migrate` の往復を実行して確認 |
| implementation-validator | 重大な問題なし |

### 計画と実績の差分

1. **Issue 記載の「email への単純なユニークインデックス」は実装しなかった。**
   `EmailValidator` / `User#email_activated?` が「email の一意性は activated=true の
   ユーザー間でのみ保証する」設計であり、単純な UNIQUE では未アクティベートユーザーの
   登録が `ActiveRecord::RecordNotUnique` で壊れる。部分ユニークインデックス
   `UNIQUE (email) WHERE activated` に置き換えた。既存スペックにも
   「アクティブユーザがいない場合の複数登録テスト」があり、この仕様を裏付けている。
2. **`activated` 単独のインデックスは追加しなかった。** boolean でカーディナリティが 2 しかなく、
   実クエリは常に email との複合条件のため、上記部分インデックスに包含される。
3. **Issue 項目 4（Schema バージョンを Rails 8.1 に）は対応不要だった。** 着手時点で
   すでに `ActiveRecord::Schema[8.1]` になっていた。

### 学んだこと

- `db:migrate` は `db/schema.rb` を Rails 標準の dumper 形式で再生成するため、
  本リポジトリの規約（`# frozen_string_literal: true` + シングルクォート）が毎回失われる。
  マイグレーション実行後は `rubocop -a db/schema.rb` を掛け、
  `frozen_string_literal` マジックコメントは手動で復元する必要がある。
- 本リポジトリでは `dip` が未インストールのため、`docker compose run --rm api bundle exec ...`
  で代替した（`dip.yml` の interaction 定義と等価）。
- PostgreSQL の UNIQUE インデックスは NULL 同士を重複と扱わないため、
  `refresh_jti` にユニーク制約を張ってもログアウト済みユーザーが複数いて問題ない。

### 次回への改善提案

- Issue の記述が実装仕様と矛盾する場合があるため、DB 制約の追加時は必ず
  該当カラムを扱うバリデータ・スコープを先に読むこと。
- 本番相当データへ適用する際は、マイグレーション前に重複チェックを実行すること:
  ```sql
  SELECT email, count(*) FROM users WHERE activated GROUP BY email HAVING count(*) > 1;
  SELECT refresh_jti, count(*) FROM users WHERE refresh_jti IS NOT NULL
    GROUP BY refresh_jti HAVING count(*) > 1;
  ```
  （今回は開発 DB で実行済み・重複なしを確認。マイグレーション内での自動チェックは
  本サンプルアプリの規模では過剰と判断し見送った）
- PR では Issue 原文からの逸脱（部分ユニークインデックス採用）の根拠を明示し、
  Issue 起票者と合意を取ること。
