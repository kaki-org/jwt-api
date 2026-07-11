# 設定変更時の注意

- initializers/user_auth.rb: JWT署名鍵は Rails.application.secret_key_base を直接参照する運用 (ENV の SECRET_KEY_BASE を使い、master key を不要にするため)。credentials.yml.enc への移行を提案しない。
- initializers/cors.rb: HttpOnly Cookie の送受信のため credentials: true が必須。credentials: true と origin '*' は共存できないので、origin を '*' に変えない。origin は ENV['API_DOMAIN'] (デフォルト localhost:3000)。
- トークン寿命などの認証パラメータは user_auth.rb の mattr_accessor に集約されている。変更はここで行い、利用側は UserAuth.xxx を参照する。
