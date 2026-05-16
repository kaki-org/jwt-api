# jwt-rails

```mermaid
pie title 進捗率
    "Done" : 102
```

🎉

動かして身につく。RailsAPI と Nuxt.js で作る JWT（JSONWebToken）ログイン認証【22 時間超解説】

## architechture

- ruby 3.4.4
- rails 8.0.x
- nuxt 3.3.x
- node 18.16.0

- [Vuetify — A Material Design Framework for Vue.js](https://vuetifyjs.com/ja/)

## 本番環境での動作確認

heroku はメンテナンスモードにしているので、それを解除した上で <https://u.fitsplus.jp> へ移動

```zsh
teruo.kakikubo@QCPF6X4PQY ~/Documents/jwt-rails/api % heroku maintenance:off
```

## ローカル環境でのセットアップ

### 設定

Rails 側は以下の通り設定ファイルを用意しておく。

```zsh
teruo.kakikubo@QCPF6X4PQY ~/Documents/jwt-rails/api % cat .env
# commons
WORKDIR=app
API_PORT=33000
FRONT_PORT=3000
API_DOMAIN=localhost:3000

# db
POSTGRES_PASSWORD=password

RAILS_MASTER_KEY=<your_rails_master_key>
```

Nuxt 側は以下の通りアプリケーション名だけ指定する

```
teruo.kakikubo@QCPF6X4PQY ~/Documents/jwt-rails/api/front % cat .env
APP_NAME=BizPlanner
```

### Rails 側の設定

```sh
dip provision
```

### Nuxt 側の設定

```sh
cd front
pnpm install
```

### 起動してみる

terminal1

```sh
dip rails s
```

terminal2

```sh
cd front
pnpm dev
```

上記をもって http://localhost:3000 にアクセスすれば、トップページに遷移する。

## DB

for heroku

```sh
heroku run rails db:migrate
heroku run rails db:seed
```

## hello 　 API

```sh
docker-compose up
```

してから以下へアクセスして、`Rails からAPIを取得する`ボタンを押す。
ブラウザで console を開くと通信した内容を確認する事ができる。
cors 設定が完了していると、問題なく通信できている(CORS のエラーがでない)

http://localhost:8080/

## heroku 関連

```sh
heroku login
heroku update beta
heroku plugins:install @heroku-cli/plugin-manifest
heroku plugins
```

元に戻すには(まだ実行しない)

```sh
heroku update stable
heroku plugins:remove manifest
```

### プロジェクト作成

```sh
heroku create jwt-v1-api --manifest
heroku open
```

https://jwt-v1-api.herokuapp.com/

```sh
teruo.kakikubo@QCPF6X4PQY ~/Documents/jwt-rails/api % git remote -v
heroku  https://git.heroku.com/jwt-v1-api.git (fetch)
heroku  https://git.heroku.com/jwt-v1-api.git (push)
origin  https://github.com/kakikubo/jwt-api.git (fetch)
origin  https://github.com/kakikubo/jwt-api.git (push)
teruo.kakikubo@QCPF6X4PQY ~/Documents/jwt-rails/api % git remote remove heroku
teruo.kakikubo@QCPF6X4PQY ~/Documents/jwt-rails/api % git remote add heroku git@heroku.com:jwt-v1-api.git
teruo.kakikubo@QCPF6X4PQY ~/Documents/jwt-rails/api % heroku stack
=== ⬢ jwt-v1-api Available Stacks
* container
  heroku-18
  heroku-20
```

### master key の登録

```sh
teruo.kakikubo@QCPF6X4PQY ~/Documents/jwt-rails/api % pbcopy < config/master.key
teruo.kakikubo@QCPF6X4PQY ~/Documents/jwt-rails/api % heroku config:set RAILS_MASTER_KEY=****
```

### heroku 環境の確認

```sh
teruo.kakikubo@QCPF6X4PQY ~/Documents/jwt-rails/api % heroku run rails db:migrate
Running rails db:migrate on ⬢ jwt-v1-api... up, run.1968 (Free)
teruo.kakikubo@QCPF6X4PQY ~/Documents/jwt-rails/api % heroku open /api/v1/hello
teruo.kakikubo@QCPF6X4PQY ~/Documents/jwt-rails/api % heroku ps
Free dyno hours quota remaining this month: 992h 8m (99%)
Free dyno usage for this app: 0h 0m (0%)
For more information on dyno sleeping and how to upgrade, see:
https://devcenter.heroku.com/articles/dyno-sleeping

=== web (Free): /bin/sh -c bundle\ exec\ puma\ -C\ config/puma.rb (1)
web.1: up 2022/05/08 09:50:39 +0900 (~ 2m ago)

```

### PostgreSQL のインストールと heroku 上の設定の確認

```zsh
teruo.kakikubo@QCPF6X4PQY ~/Documents/jwt-rails/api % brew install postgresql
teruo.kakikubo@QCPF6X4PQY ~/Documents/jwt-rails/api % psql --version
psql (PostgreSQL) 14.2
teruo.kakikubo@QCPF6X4PQY ~/Documents/jwt-rails/api % heroku pg:info
=== DATABASE_URL
Plan:                  Hobby-dev
Status:                Available
Connections:           0/20
PG Version:            14.2
Created:               2022-05-07 23:16 UTC
Data Size:             8.6 MB/1.00 GB (In compliance)
Tables:                2
Rows:                  1/10000 (In compliance)
Fork/Follow:           Unsupported
Rollback:              Unsupported
Continuous Protection: Off
Add-on:                postgresql-reticulated-66819
teruo.kakikubo@QCPF6X4PQY ~/Documents/jwt-rails/api % heroku pg:psql postgresql-reticulated-66819
--> Connecting to postgresql-reticulated-66819
psql (14.2)
SSL connection (protocol: TLSv1.3, cipher: TLS_AES_256_GCM_SHA384, bits: 256, compression: off)
Type "help" for help.

jwt-v1-api::DATABASE=> show timezone;
 TimeZone
----------
 Etc/UTC
(1 row)
```

## Nuxt プロジェクトを push

### heroku アプリケーションを作成

```sh
teruo.kakikubo@QCPF6X4PQY ~/Documents/jwt-rails/front % heroku create jwt-v1-front --manifest
Reading heroku.yml manifest... done
Creating ⬢ jwt-v1-front... done, stack is container
Setting config vars... done
https://jwt-v1-front.herokuapp.com/ | https://git.heroku.com/jwt-v1-front.git
```

### heroku アプリケーションを push

```sh
teruo.kakikubo@QCPF6X4PQY ~/Documents/jwt-rails/front % git push heroku main
Enumerating objects: 38, done.
Counting objects: 100% (38/38), done.
```

### Hirb をインストールして利用する

```sh
irb(main):004:0> puts Hirb::Helpers::Table.render [[1,2], [2,3]]
+---+---+
| 0 | 1 |
+---+---+
| 1 | 2 |
| 2 | 3 |
+---+---+
2 rows in set
=> nil
irb(main):005:0> puts Hirb::Helpers::Table.render [{:age=>10, :weight=>100}, {:age=>80, :weight=>500}]
+-----+--------+
| age | weight |
+-----+--------+
| 10  | 100    |
| 80  | 500    |
+-----+--------+
2 rows in set
=> nil
irb(main):006:0>
```

こんな感じで見やすく表示してくれる。

## ちょっとワンポイント

今回は SPA 開発なので SEO 対策を気に掛ける必要はありません。
しかしブログなど Universal モードの場合は、コントラストを考えてカラーを設定しなければサイト評価が下がります。（若干ではありますが）
ちなみに上記のカラー設定は SEO 的にアウトです。
例えば primary は# 0053A3 まで濃くすればコントラストが正常と判断されます。
コントラストの判定は下記 URL から行うことができます。

https://dequeuniversity.com/rules/axe/3.2/color-contrast

```
teruo.kakikubo@QCPF6X4PQY ~/Documents/dietplus-server % time dip bundle exec rspec spec/requests/kenpo/events_spec.rb
[+] Running 2/0
 ⠿ Container dietplus-server-db-1     Running                                                                                                                                                0.0s
 ⠿ Container dietplus-server-redis-1  Running                                                                                                                                                0.0s
/usr/local/bundle/gems/mime-types-3.3/lib/mime/types/logger.rb:30: warning: `_1' is reserved for numbered parameter; consider another name
/usr/local/bundle/gems/mime-types-3.3/lib/mime/types/logger.rb:30: warning: `_2' is reserved for numbered parameter; consider another name
/usr/local/bundle/gems/mime-types-3.3/lib/mime/types/logger.rb:30: warning: `_3' is reserved for numbered parameter; consider another name
.

Finished in 12.73 seconds (files took 14.75 seconds to load)
1 example, 0 failures

dip bundle exec rspec spec/requests/kenpo/events_spec.rb  0.28s user 0.19s system 1% cpu 29.109 total
teruo.kakikubo@QCPF6X4PQY ~/Documents/dietplus-server %

```

↓

```sh
teruo.kakikubo@QCPF6X4PQY ~/Documents/dietplus-server % time dip bundle exec rspec spec/requests/kenpo/events_spec.rb
[+] Running 2/0
 ⠿ Container dietplus-server-db-1     Running                                                                                                                                                0.0s
 ⠿ Container dietplus-server-redis-1  Running                                                                                                                                                0.0s
/usr/local/bundle/gems/mime-types-3.3/lib/mime/types/logger.rb:30: warning: `_1' is reserved for numbered parameter; consider another name
/usr/local/bundle/gems/mime-types-3.3/lib/mime/types/logger.rb:30: warning: `_2' is reserved for numbered parameter; consider another name
/usr/local/bundle/gems/mime-types-3.3/lib/mime/types/logger.rb:30: warning: `_3' is reserved for numbered parameter; consider another name
.

Finished in 7.73 seconds (files took 9.7 seconds to load)
1 example, 0 failures

dip bundle exec rspec spec/requests/kenpo/events_spec.rb  0.27s user 0.19s system 2% cpu 18.988 total
```

### heroku での環境変数のセット

```sh
teruo.kakikubo@QCPF6X4PQY ~/Documents/jwt-rails/front % heroku config:set APP_NAME=BizPlanner
Setting APP_NAME and restarting ⬢ jwt-v1-front... done, v8
APP_NAME: BizPlanner
teruo.kakikubo@QCPF6X4PQY ~/Documents/jwt-rails/front % heroku config
=== jwt-v1-front Config Vars
APP_NAME: BizPlanner
NODE_ENV: production
```

BASE_URL を指定した時の例

```sh
teruo.kakikubo@QCPF6X4PQY ~/Documents/jwt-rails/api % heroku config:set BASE_URL=https://jwt-v1-api.herokuapp.com
Setting BASE_URL and restarting ⬢ jwt-v1-api... done, v17
BASE_URL: https://jwt-v1-api.herokuapp.com
teruo.kakikubo@QCPF6X4PQY ~/Documents/jwt-rails/api %
```

### アイキャッチ画像を取得する

#### <https://www.manypixels.co/gallery>

ライセンス的にはどうなのかを調べる必要があるが、現時点ではフリーで良さげな素材が色々ありそう。
でもよくよく考えたらこれ駄目なんじゃないかって気がしてきた。

#### <https://picsum.photos/>

やっぱりこっちが有名だし、無難かなって思う

## https://jwt.io/

JWT の 3 つのメリット

1. 情報が改ざんできない
2. ユーザーテーブルが完結になる
3. 発行者が担保される

エンコードされた文字列が入っている。
デコードすると以下の情報が入っている。
構造は次の通り

```text
<ヘッダー>.<ペイロード>.<署名>
```

- ヘッダー
  - typ トークンのタイプ
  - alg 署名アルゴリズムの情報
- ペイロード(任意の情報)
  - iat 有効期限
  - name ユーザー識別情報
  - sub サブジェクト
- 署名
  - JWT の送信者が本人であること
  - JWT が改ざんされていないこと
  - HMACSHA256( エンコードされたヘッダ + "." + エンコードされたペイロード, シークレットキー)

### 署名アルゴリズム

- HS256(default)
  - 署名時の鍵と同じ鍵を使って検証する
- RS256
  - 秘密鍵と公開鍵のペアで検証する

### 注意点

1. 誰でもトークンの内容が確認できる

### テストの作成

integration テストを追加しようとすると、rspec の場合は requests spec になる

```sh
docker-compose run --rm api rails g integration_test RefreshToken
```

### ログイン認証を試す

アクセストークンを簡単に得る方法

```sh
teruo.kakikubo@QCPF6X4PQY ~/Documents/jwt-rails % docker-compose run --rm api rails r 'puts User.last.to_access_token' | pbcopy
```

### curl コマンドでログイン認証のテスト

```sh
curl -X POST http://localhost:3000/api/v1/auth_token \
-H "X-Requested-With: XMLHttpRequest" \
-H "Content-Type: application/json" \
-d '{"auth": {"email": "user0@example.com", "password": "password"}}'
```

### SameSite 属性の設定

```sh
teruo.kakikubo@QCPF6X4PQY ~/Documents/jwt-rails/api % heroku config:set COOKIES_SAME_SITE=none
Setting COOKIES_SAME_SITE and restarting ⬢ jwt-v1-api... done, v18
COOKIES_SAME_SITE: none
```

### db migrate がうまくいっているかどうかを確認する

```sh
teruo.kakikubo@QCPF6X4PQY ~/Documents/jwt-rails/api % heroku run rails r 'puts User.column_names'
Running rails r "puts User.column_names" on ⬢ jwt-v1-api... up, run.1995 (Free)
id
name
email
password_digest
activated
admin
created_at
updated_at
refresh_jti
```

### 認証をおこなって　トークンの発行

以下の操作で refresh_token が User テーブルに挿入される事を確認できる

```sh
teruo.kakikubo@QCPF6X4PQY ~/Documents/jwt-rails/api % heroku run rails r 'pp User.find(2)'
Running rails r "pp User.find(2)" on ⬢ jwt-v1-api... up, run.2870 (Free)
#<User:0x00007efef7f8b248
 id: 2,
 name: "user1",
 email: "user1@example.com",
 password_digest: "[FILTERED]",
 activated: true,
 admin: false,
 created_at: Wed, 11 May 2022 08:20:05.941092000 JST +09:00,
 updated_at: Wed, 11 May 2022 08:20:05.941092000 JST +09:00,
 refresh_jti: nil>
```

認証を行ってみる(User.find(2) => user1@example.comのユーザである)

```sh
teruo.kakikubo@QCPF6X4PQY ~/Documents/jwt-rails/api % heroku config:get BASE_URL | pbcopy
curl -X POST https://jwt-v1-api.herokuapp.com/api/v1/auth_token \
-H "X-Requested-With: XMLHttpRequest" \
-H "Content-Type: application/json" \
-d '{"auth": {"email": "user1@example.com", "password": "password"}}'
{"token":"<JWT_ACCESS_TOKEN>","expires":1654208286,"user":{"id":2,"name":"user1","sub":"<ENCRYPTED_SUBJECT>"}}%
```

再度ユーザ情報を見てみる。

```sh
teruo.kakikubo@QCPF6X4PQY ~/Documents/jwt-rails/api % heroku run rails r 'pp User.find(2)'
Running rails r "pp User.find(2)" on ⬢ jwt-v1-api... up, run.8481 (Free)
#<User:0x00007fa586adac68
 id: 2,
 name: "user1",
 email: "user1@example.com",
 password_digest: "[FILTERED]",
 activated: true,
 admin: false,
 created_at: Wed, 11 May 2022 08:20:05.941092000 JST +09:00,
 updated_at: Fri, 03 Jun 2022 06:48:06.132098000 JST +09:00,
 refresh_jti: "97e89e4b18779f1b1ea6ed201a96b401">
teruo.kakikubo@QCPF6X4PQY ~/Documents/jwt-rails/api %
```

きちんと `refresh_jti`の値が更新されている事がわかる。

一連の操作をしたログは以下の通り確認できる

```sh
teruo.kakikubo@QCPF6X4PQY ~/Documents/jwt-rails/api % heroku logs --tail
2022-06-02T21:35:40.055012+00:00 app[web.1]: I, [2022-06-03T06:35:40.054921 #6]  INFO -- : [<request_id>] Started POST "/api/v1/auth_token" for 150.249.253.216 at 2022-06-03 06:35:40 +0900
2022-06-02T21:35:40.056407+00:00 app[web.1]: I, [2022-06-03T06:35:40.056335 #6]  INFO -- : [<request_id>] Processing by Api::V1::AuthTokenController#create as */*
2022-06-02T21:35:40.056534+00:00 app[web.1]: I, [2022-06-03T06:35:40.056453 #6]  INFO -- : [<request_id>]   Parameters: {"auth"=>{"email"=>"user0@example.com", "password"=>"[FILTERED]"}, "auth_token"=>{"auth"=>{"email"=>"user0@example.com", "password"=>"[FILTERED]"}}}
2022-06-02T21:35:40.393250+00:00 heroku[router]: at=info method=POST path="/api/v1/auth_token" host=jwt-v1-api.herokuapp.com request_id=<request_id> fwd="150.249.253.216" dyno=web.1 connect=0ms service=343ms status=200 bytes=1626 protocol=https
2022-06-02T21:35:40.396164+00:00 app[web.1]: I, [2022-06-03T06:35:40.396081 #6]  INFO -- : [<request_id>] Completed 200 OK in 339ms (Views: 0.3ms | ActiveRecord: 12.2ms | Allocations: 1377)
2022-06-02T21:35:46.884513+00:00 app[web.1]: I, [2022-06-03T06:35:46.884435 #6]  INFO -- : [<request_id>] Started POST "/api/v1/auth_token" for 150.249.253.216 at 2022-06-03 06:35:46 +0900
```

### リフレッシュとアクセスを使った Rails のログイン機能の構築

| 種類                 | 役割                                     | 保存先・取得先             | 有効期限 | トークンの無効化              |
| -------------------- | ---------------------------------------- | -------------------------- | -------- | ----------------------------- |
| リフレッシュトークン | セッション管理(アクセスを発行)           | Cookie                     | 24 時間  | ユーザーテーブルの jti を削除 |
| アクセストークン     | リソースの保護(本人認証とコンテンツ保護) | メモリ・リクエストヘッダー | 30 分    | -                             |

## フロントエンドのログイン判定

vuex の user が存在する && auth.expires が有効期限内
↓
loggedIn: true

| vuex の user | expires  | access token                     | refresh token | logged in | redirect           |
| ------------ | -------- | -------------------------------- | ------------- | --------- | ------------------ |
| 存在する     | 期限内   | -                                | -             | true      | -                  |
| 存在する     | 期限切れ | 更新処理(サイレントリフレッシュ) | 有効          | true      | -                  |
| 存在する     | 期限切れ | 更新処理(サイレントリフレッシュ) | 無効          | false     | 「セッション切れ」 |
| 存在しない   | -        | -                                | -             | false     | 「ログインして」   |

## パソコンがスリープ状態になってもサイレントリフレッシュできるようにするには

<https://stackoverflow.com/questions/6346849/what-happens-to-settimeout-when-the-computer-goes-to-sleep>

## SameSite 属性問題に対処する

Safari ではきちんと SameSite 属性問題を回避しないと、クッキーに値が保存されない等の問題が起こる。
この為、heroku 側に本番設定をほどこしてあげる必要がある。

Safari でリロードするとログアウトする
↓
原因: refresh_token が Cookie に保存されていない

Safari サードパーティの Cookie を拒否する仕様の為
Chrome 2023 年の後半までに上記仕様となる

↓
同一サイトとみなされれば Cookie は拒否されない
↓
同じドメインのサブドメイン同士の例

- ドメイン
  - example.com
  - udemy-v2.example.com (nuxt)
  - api.udemy-v2.example.com (rails)

のようになっていれば問題ない

- 現状
  - Nuxt
    - https://jwt-v1-front.herokuapp.com/
  - Rails
    - https://jwt-v1-api.herokuapp.com/

これを以下のような形にする？

- 理想
  - Nuxt
    - https://jwt-v1-front.herokuapp.com/
  - Rails
    - https://jwt-v1-api.herokuapp.com/

ドメイン名は一旦以下ですすめる。

u.fitsplus.jp

### Heroku でのカスタムドメインの設定

```bash
teruo.kakikubo@QCPF6X4PQY ~/Documents/jwt-rails/front % heroku domains:add u.fitsplus.jp
Configure your app's DNS provider to point to the DNS Target solid-rhododendron-b5pfegn1jtlix76xnzq9clnu.herokudns.com.
    For help, see https://devcenter.heroku.com/articles/custom-domains

The domain u.fitsplus.jp has been enqueued for addition
Run heroku domains:wait 'u.fitsplus.jp' to wait for completion
Adding u.fitsplus.jp to ⬢ jwt-v1-front... done
teruo.kakikubo@QCPF6X4PQY ~/Documents/jwt-rails/front %
```

fitsplus.jp 上でも CNAME で上記の DNS Target を登録する。
heroku 上では https://dashboard.heroku.com/apps/jwt-v1-front/resources から `Change Dyno Type`から
`Hobby Plan`を選択する。この時点で$7/month かかる。2022/06/23 契約した。

### API 側

```sh
teruo.kakikubo@QCPF6X4PQY ~/Documents/jwt-rails/api % heroku config:get API_DOMAIN
jwt-v1-front.herokuapp.com
teruo.kakikubo@QCPF6X4PQY ~/Documents/jwt-rails/api % heroku config:set API_DOMAIN=u.fitsplus.jp
Setting API_DOMAIN and restarting ⬢ jwt-v1-api... done, v20
API_DOMAIN: u.fitsplus.jp
teruo.kakikubo@QCPF6X4PQY ~/Documents/jwt-rails/api % heroku config:get API_DOMAIN
u.fitsplus.jp
```

### Front 側

```sh
teruo.kakikubo@QCPF6X4PQY ~/Documents/jwt-rails/front % heroku config:set BASE_URL=https://u.fitsplus.jp
Setting BASE_URL and restarting ⬢ jwt-v1-front... done, v15
BASE_URL: https://u.fitsplus.jp
```

## Rails 側にカスタムドメイン設定

```sh
teruo.kakikubo@QCPF6X4PQY ~/Documents/jwt-rails/api % heroku domains
=== jwt-v1-api Heroku Domain
jwt-v1-api.herokuapp.com
teruo.kakikubo@QCPF6X4PQY ~/Documents/jwt-rails/api % heroku domains:add api.u.fitsplus.jp
Configure your app's DNS provider to point to the DNS Target encircled-mandarin-8byc2nzg3s65004d1rt3ugta.herokudns.com.
    For help, see https://devcenter.heroku.com/articles/custom-domains

The domain api.u.fitsplus.jp has been enqueued for addition
Run heroku domains:wait 'api.u.fitsplus.jp' to wait for completion
Adding api.u.fitsplus.jp to ⬢ jwt-v1-api... done
teruo.kakikubo@QCPF6X4PQY ~/Documents/jwt-rails/api %
```

Rails 側はコマンドラインからプラン変更

```sh
teruo.kakikubo@QCPF6X4PQY ~/Documents/jwt-rails/api % heroku ps:resize web=hobby
Scaling dynos on ⬢ jwt-v1-api... done
=== Dyno Types
type  size   qty  cost/mo
────  ─────  ───  ───────
web   Hobby  1    7
=== Dyno Totals
type   total
─────  ─────
Hobby  1
teruo.kakikubo@QCPF6X4PQY ~/Documents/jwt-rails/api % heroku ps
=== web (Hobby): /bin/sh -c bundle\ exec\ puma\ -C\ config/puma.rb (1)
web.1: starting 2022/06/23 06:57:15 +0900 (~ 9s ago)
```

ちなみに、プランを戻す時は以下で大丈夫なんだそうだ。

```sh
heroku ps:resize web=free
```

### Rails 側の SSL 証明書がきちんと動作しているか確認

これもコマンドラインからいけるみたい

```sh
teruo.kakikubo@QCPF6X4PQY ~/Documents/jwt-rails/api % heroku certs:auto
=== Automatic Certificate Management is enabled on jwt-v1-api

Certificate details:
Common Name(s): api.u.fitsplus.jp
Domain(s):      a1db12c5-072a-4dce-897c-8ce0748556fd
Expires At:     2022-09-20 20:57 UTC
Issuer:         /C=US/O=Let's Encrypt/CN=R3
Starts At:      2022-06-22 20:57 UTC
Subject:        /CN=api.u.fitsplus.jp
SSL certificate is verified by a root authority.

Domain             Status       Last Updated
─────────────────  ───────────  ────────────
api.u.fitsplus.jp  Cert issued  4 minutes
```

API_URL もセットしてみる

```sh
teruo.kakikubo@QCPF6X4PQY ~/Documents/jwt-rails/api % heroku config:set API_URL=https://api.u.fitsplus.jp
Setting API_URL and restarting ⬢ jwt-v1-api... done, v23
API_URL: https://api.u.fitsplus.jp
```

### 常時 SSL 化

```sh
teruo.kakikubo@QCPF6X4PQY ~/Documents/jwt-rails/api % heroku config:get BASE_URL
https://jwt-v1-api.herokuapp.com
teruo.kakikubo@QCPF6X4PQY ~/Documents/jwt-rails/api % heroku config:set BASE_URL=https://api.u.fitsplus.jp
Setting BASE_URL and restarting ⬢ jwt-v1-api... done, v24
BASE_URL: https://api.u.fitsplus.jp
teruo.kakikubo@QCPF6X4PQY ~/Documents/jwt-rails/api % heroku config:get BASE_URL
https://api.u.fitsplus.jp
```

SameSite 属性の値を変更

```sh
teruo.kakikubo@QCPF6X4PQY ~/Documents/jwt-rails/api % heroku config:set COOKIES_SAME_SITE=lax
Setting COOKIES_SAME_SITE and restarting ⬢ jwt-v1-api... done, v26
COOKIES_SAME_SITE: lax
teruo.kakikubo@QCPF6X4PQY ~/Documents/jwt-rails/api % heroku config:get COOKIES_SAME_SITE
lax
```

## 宿題

- [x] heroku のプランを free プランに戻す
- [x] heroku をメンテナンスモードにしておく
- [ ] heroku で IP 制限をかける
- [x] front を Vercel に格納する
- [x] api の中に `jwt-rails`と`jwt-front`を格納する
- [ ] api を ECS で扱えるようにする。

## Document

- [docker-compose.yml を使って Rails6 を構築する(PostgreSQL パスワード変更方法) - 独学プログラマ](https://blog.cloud-acct.com/posts/u-docker-compose-rails6new/)
- [docker-compose.yml を使って Nuxt.js を構築する - 独学プログラマ](https://blog.cloud-acct.com/posts/u-docker-create-nuxtjs/)
- [複数プロジェクトで行う Git 管理の全体像を理解しよう(Git サブモジュール解説) - 独学プログラマ](https://blog.cloud-acct.com/posts/u-git-management/)
- [【Rails6】"Hello" json を返すコントローラを作成する - 独学プログラマ](https://blog.cloud-acct.com/posts/u-railsapi-hello-json/)
- [【Nuxt.js】axios の初期設定を行う(baseURL・browserBaseURL を解説) - 独学プログラマ](https://blog.cloud-acct.com/posts/u-nuxtjs-axios/)
- [【Rails6】Gem rack-cors を導入して CORS 設定を行う(オリジン・CORS とは何か) - 独学プログラマ](https://blog.cloud-acct.com/posts/u-rails-rackcors/)
- [デプロイ準備。Heroku へ新規会員登録を行い HerokuCLI をインストールする - 独学プログラマ](https://blog.cloud-acct.com/posts/u-heroku-deploy-intro/)
- [HerokuCLI-manifest のデプロイ解説編。Docker 環境の Rails6 を Heroku にデプロイする(2/2) - 独学プログラマ](https://blog.cloud-acct.com/posts/u-setup-herokuyml-deploy/)
- [Managing SSH Keys | Heroku Dev Center](https://devcenter.heroku.com/articles/keys)
- [SSH キーの管理 | Heroku Dev Center(上記の日本語版)](https://devcenter.heroku.com/ja/articles/keys)
- [HerokuCLI-manifest のデプロイ解説編。Docker 環境の Rails6 を Heroku にデプロイする(2/2) - 独学プログラマ ](https://blog.cloud-acct.com/posts/u-setup-herokuyml-deploy/)
- [Dockerfile 解説編。Docker 環境の Nuxt.js を Heroku にデプロイする(1/2) - 独学プログラマ](https://blog.cloud-acct.com/posts/u-nuxtjs-herokudeploy-dcokerfile/)
- [【Rails6】application.rb の初期設定(タイムゾーン・I18n・Zeitwerk) - 独学プログラマ](https://blog.cloud-acct.com/posts/u-rails-applicationrb-settings/)
- [【Rails6】モデル開発に必要な Gem のインストールと Hirb.enable の自動化 - 独学プログラマ](https://blog.cloud-acct.com/posts/u-rails-gem-install/)
- [Rails ユーザーモデル作成。テーブル設計・ユーザー認証設計を理解する - 独学プログラマ](https://blog.cloud-acct.com/posts/u-rails-user-table-desing/)
- [Rails ユーザーモデルのバリデーション設定(has_secure_password 解説) - 独学プログラマ](https://blog.cloud-acct.com/posts/u-rails-user-validates/)
- [Rails バリデーションエラーメッセージの日本語化(ja.yml 設定方法) - 独学プログラマ](https://blog.cloud-acct.com/posts/u-rails-error-messages-jayml/)
- [EachValidator クラスのカスタムバリデーション設定(Rails6/lib 以下読込) - 独学プログラマ](https://blog.cloud-acct.com/posts/u-rails-custom-eachvalidator/)
- [Rails 環境ごとに Seed データ切り替える seeds.rb の書き方 - 独学プログラマ](https://blog.cloud-acct.com/posts/u-rails-user-seeddata/)
- [Rails6 から導入された並列テストを理解する - 独学プログラマ](https://blog.cloud-acct.com/posts/u-rail6-parallel-testing/)
- [Rails ユーザーモデルバリデーションテスティング(name/email/password) - 独学プログラマ](https://blog.cloud-acct.com/posts/u-rails-validation-testing/)
- [Nuxt.js から Rails のユーザーテーブルを取得し Heroku にデプロイする - 独学プログラマ](https://blog.cloud-acct.com/posts/u-user-table-heroku-deploy/)
- [Docker Alpine ベースの Node.js 上で動く Nuxt.js に Vuetify を導入する - 独学プログラマ](https://blog.cloud-acct.com/posts/u-docker-nuxtjs-vuetify-install/)
- [Vuetify にカスタム CSS を導入してオリジナルブレイクポイントを作る - 独学プログラマ](https://blog.cloud-acct.com/posts/u-vuetify-add-custom-css/)
- [Nuxt.js に nuxt-i18n を導入して国際化に対応する - 独学プログラマ](https://blog.cloud-acct.com/posts/u-nuxtjs-i18n-settings/)
- [Nuxt.js ウェルカムページを構成するコンポーネントファイル群を作成しよう(1/4) - 独学プログラマ](https://blog.cloud-acct.com/posts/u-nuxtjs-welcome-page-1/)
- [Nuxt.js ウェルカムページにアイキャッチ画像・アプリ名・メニューボタンを表示しよう(2/4) - 独学プログラマ](https://blog.cloud-acct.com/posts/u-nuxtjs-welcome-page-2/)
- [Nuxt.js addEventListener でスクロールを検知しツールバーの色を変化させよう(3/4) - 独学プログラマ](https://blog.cloud-acct.com/posts/u-nuxtjs-welcome-page-3/)
- [Nuxt.js ウェルカムページをレスポンシブデザインに対応させよう(4/4) - 独学プログラマ](https://blog.cloud-acct.com/posts/u-nuxtjs-welcome-page-4/)
- [Nuxt.js 会員登録ページのレイアウトファイルを作成しよう(1/4) - 独学プログラマ](https://blog.cloud-acct.com/posts/u-signup-page-1/)
- [Nuxt.js 名前、メール、パスワードのコンポーネントファイルを作成しよう(2/4) - 独学プログラマ](https://blog.cloud-acct.com/posts/u-signup-page-2/)
- [Nuxt.js 親子コンポーネント間の双方向データバインディングを実装する(3/4) - 独学プログラマ](https://blog.cloud-acct.com/posts/u-signup-page-3/)
- [Nuxt.js Vuetify の v-text-field を使った会員登録フォームのバリデーション設定(4/4) - 独学プログラマ](https://blog.cloud-acct.com/posts/u-signup-page-4/)
- [Nuxt.js ログイン後のツールバーを作成しよう(inject 解説) - 独学プログラマ](https://blog.cloud-acct.com/posts/u-logged-in-layouts-1/)
- [Nuxt.js アカウントメニューページ・ログアウト機能を実装しよう(nuxt-child 解説) - 独学プログラマ](https://blog.cloud-acct.com/posts/u-logged-in-layouts-2/)
- [Nuxt.js ログイン後のトップページにプロジェクト一覧を表示しよう - 独学プログラマ](https://blog.cloud-acct.com/posts/u-logged-in-layouts-3)
- [Nuxt.js プロジェクトページに Vuetify のナビゲーションドロワーを追加しよう - 独学プログラマ](https://blog.cloud-acct.com/posts/u-logged-in-layouts-4/)
- [Nuxt.js paramsID からプロジェクトを検索して Vuex に保存しよう - 独学プログラマ](https://blog.cloud-acct.com/posts/u-logged-in-layouts-5/)
- [JWT とは何か?(ruby-jwt のインストール) - 独学プログラマ](https://blog.cloud-acct.com/posts/u-rails-whats-jwt/)
- [クロスサイトスクリプティング(XSS)対策として Cookie の HttpOnly 属性でどこまで安全になるのか - YouTube](https://www.youtube.com/watch?v=4JREwhSC2dQ)
- [「same-site」と「same-origin」を理解する](https://web.dev/same-site-same-origin/)
