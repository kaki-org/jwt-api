# テストの規約

- リクエストスペックは spec/support/spec_helper.rb の SpecHelpers を使う: api(path), login, logout, refresh_api, auth(token), res_body, active_user。素の post/get を書く場合も xhr: true を必ず付ける。X-Requested-With ヘッダーが無いと全リクエストが403で落ちる。
- FactoryBot は未導入。テストデータは suite 実行前にロードされる db/seeds.rb と active_user (User.find_by(activated: true)) に依存する。create(:user) は使えない。
- context 名は日本語で書く ('の場合', 'する場合' など)。.rubocop.yml の RSpec/ContextWording AllowedPatterns に日本語パターンが登録済みで、英語 context は逆に lint で落ちうる。
- Cookie の属性検証 (expires / http_only) は request.cookie_jar.instance_variable_get(:@set_cookies) で行うのが既存の慣習。内部変数アクセスだが意図的。時刻比較は travel_to (TimeHelpers 有効) と be_within(1.second) を使う。
- テスト実行は dip rspec <path> (RAILS_ENV=test が自動設定される)。
