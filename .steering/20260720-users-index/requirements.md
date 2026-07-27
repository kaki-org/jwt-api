# users テーブルへのインデックス追加 — 要件

Issue: https://github.com/kaki-org/jwt-api/issues/1108

## 背景

`users` テーブルの頻繁に検索されるカラムにインデックスが未設定。
`User.find_by_activated(email)` は `find_by(email:, activated: true)` を実行しており、
ログイン (`Api::V1::AuthTokenController#login_user`) とメール重複判定 (`EmailValidator`) の
両方で毎リクエスト呼ばれるが、対応するインデックスが存在しない。

## Issue 記載内容と実装方針の差分（重要）

Issue では `email` に **単純なユニークインデックス** を追加するよう記載されているが、
これは本アプリのドメインモデルと矛盾するため、そのままは実装しない。

根拠:

- `app/validators/email_validator.rb:13` — `record.errors.add(attribute, :taken) if record.email_activated?`
- `app/models/user.rb:55-58` — `email_activated?` は「自分以外の**アクティブな**同一 email ユーザー」のみ検出

つまり本アプリは **「email の一意性は activated=true のユーザー間でのみ保証する」** 設計であり、
未アクティベートユーザーは既存アクティブユーザーと同じ email を持てる。
`email` 全体に UNIQUE 制約を張るとこの仕様が壊れ、サインアップ時に
`ActiveRecord::RecordNotUnique` が発生する。

→ 代替として **部分ユニークインデックス** `UNIQUE (email) WHERE activated` を採用する。
これによりアプリの実際の不変条件を DB 層で保証しつつ、`find_by(email:, activated: true)` を
完全にカバーできる。

## 要件

| ID | 内容 | 対応 |
|----|------|------|
| R1 | `find_by_activated` のクエリをインデックスで解決する | `email` への部分ユニークインデックス (`WHERE activated`) |
| R2 | アクティブユーザー間の email 一意性を DB 層で保証する | 同上 |
| R3 | `refresh_jti` の検証クエリを高速化し一意性を保証する | `refresh_jti` へのユニークインデックス (NULL 重複可) |
| R4 | `activated` 単独のインデックス | **不採用**（下記参照） |
| R5 | `ActiveRecord::Schema` のバージョンを Rails 8.1 に合わせる | **対応済み**（現状すでに `Schema[8.1]`） |

### R4 を不採用とする理由

`activated` は boolean（カーディナリティ 2）であり、単独インデックスはプランナに
ほぼ選択されない。かつ実際のクエリは常に `email` との複合条件であり、
R1 の部分インデックスが `WHERE activated` を含むため既にカバーされている。
冗長なインデックスは書き込みコストのみ増やすため追加しない。

## 受け入れ条件

- [ ] マイグレーションが `dip rails db:migrate` で適用でき、`db/schema.rb` に反映される
- [ ] 既存の RSpec が全てパスする（特に email 重複バリデーション、リフレッシュトークン系）
- [ ] 未アクティベートユーザーがアクティブユーザーと同じ email で保存できる（回帰防止テスト）
- [ ] アクティブユーザー同士の email 重複が DB 層で拒否される（新規テスト）
- [ ] `dip rubocop` がパスする
