# バックエンド実装の規約

JWT認証は gem に任せず app/services/user_auth/ で自前実装している。認証まわりは一般的な Rails 慣習と意図的に異なる点が多い。以下は「一見バグや設計ミスに見えるが正しい」パターンなので、変更や指摘の前に確認すること。

## トークン (app/services/user_auth/)

- AccessToken / RefreshToken は1クラスで発行と検証を兼ねる (initialize に user_id: なら発行、token: なら検証)。decode専用クラスを新設しない。
- JWT の sub には user_id を平文で入れず MessageEncryptor で暗号化する (token_commons.rb の encrypt_for / decrypt_for)。decrypt_for が復号失敗時に例外でなく nil を返すのは意図的で、握り潰しバグではない。
- リフレッシュトークンの jti は users.refresh_jti とサーバー側照合してリプレイを防ぐ。encode 時の remember_jti (DB更新) を削らない。有効なリフレッシュトークンは1ユーザー1つで、新規発行が旧トークンを無効化する。
- 有効期限・アルゴリズム等は config/initializers/user_auth.rb の UserAuth.xxx を参照する。数値をハードコードしない。

## サービス層

- include型Mixin (TokenGenerateService, UserAuthenticateService, UserSessionizeService) と new型PORO (AuthTokenService, AuthResponseBuilder) の2系統が意図的に共存している。どちらかの形式に統一するリファクタリングをしない。
- current_user は Authorization ヘッダー (アクセストークン) 由来、session_user は Cookie (リフレッシュトークン) 由来。別物なので混同しない。
- AuthResponseBuilder は user が nil でも動く設計 (JTIエラー時に nil で呼ばれる)。nilガード不足のバグではない。

## コントローラー

- 保護リソースの認証は authenticate_active_user を使う。authenticate_user はメール未認証ユーザーも通すので、新規エンドポイントで使わない。
- 全リクエストは before_action :xhr_request? で X-Requested-With ヘッダーを検証し、無ければ403。APIモードでもこれが CSRF 対策の中核なので削らない。
- JTI不一致時は Cookie 削除後にわざと JWT::InvalidJtiError を再raiseし、rescue_from で401を返す (auth_token_controller.rb)。冗長に見えるが意図的なフロー。
- ProjectsController#index はダミーデータをハードコード返却する仮実装で、Project モデルは存在しない。DBクエリへの「修正」を提案しない。レスポンスキーは updatedAt 等の camelCase。
- リフレッシュトークン Cookie の secure は本番のみ true (auth_token_service.rb)。常時 true にするとローカルで Cookie が送受信できなくなる。

## Lint

- rubocop-rails は Gemfile にあるが .rubocop.yml で plugin 無効。Rails/xxx cop の違反は実際には検出されないので、レビューで根拠にしない。

## 検証

変更後は dip rubocop → dip rspec <関連spec> を実行する。認証・認可に触れたら dip brakeman も実行する。
