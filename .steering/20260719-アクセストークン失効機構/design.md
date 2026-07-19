# 設計書

## アーキテクチャ概要

ユーザー単位のトークンバージョン方式（user-side counter）を採用する。JWT はステートレスのまま、ユーザーテーブルに整数カウンタ `token_version` を持ち、アクセストークンの `ver` クレームと照合する。denylist 方式（jti 単位の失効テーブル）は保存・掃除のコストがかかるため採用しない。

```
ログイン/リフレッシュ:
  User#encode_access_token ──> payload に ver: user.token_version を付与して JWT.encode

リクエスト認証:
  Authorization ヘッダー ──> AccessToken(token:) デコード
    └─ entity_for_user: User.find 後に ver クレーム == user.token_version を照合
         └─ 不一致 → UserAuth::RevokedTokenError (< JWT::DecodeError)
              └─ UserAuthenticateService が rescue → nil → 401

ログアウト:
  User#forget: refresh_jti を nil 化 + token_version をインクリメント
    └─ 発行済みアクセストークンの ver が古くなり一括失効
```

## コンポーネント設計

### 1. マイグレーション（db/migrate/xxx_add_token_version_to_users.rb）

**責務**:
- `users.token_version` integer カラム追加（null: false, default: 0）

**実装の要点**:
- 既存の `add_refresh_jti_to_users.rb` と同じ単純な add_column 形式
- 既存ユーザーは default 0 で埋まる

### 2. UserAuth::RevokedTokenError（app/services/user_auth/revoked_token_error.rb）

**責務**:
- 失効済みトークンを表す例外

**実装の要点**:
- `JWT::DecodeError` を継承する。これにより `UserAuthenticateService#fetch_user_from_access_token` の既存 rescue（`JWT::DecodeError`）に捕捉され、変更なしで 401 フローに乗る
- Zeitwerk 規約に従い app/services/user_auth/ 配下に配置

### 3. TokenGenerateService#encode_access_token（発行側）

**責務**:
- アクセストークン発行時に `ver` クレームを自動付与

**実装の要点**:
- `UserAuth::AccessToken.new(user_id: id, payload: { ver: token_version }.merge(payload))`
- user インスタンスの属性を使うため追加クエリ不要
- 呼び出し側（AuthTokenService 経由のログイン/リフレッシュ）は変更不要

### 4. UserAuth::AccessToken#entity_for_user（検証側）

**責務**:
- ユーザー取得後にトークンバージョンを照合し、不一致なら RevokedTokenError を raise

**実装の要点**:
- RefreshToken の jti サーバー側照合と同じ「トークンクラス内で DB 状態を検証する」既存パターンに合わせる（app/CLAUDE.md 準拠）
- `ver` クレーム欠落時は 0 とみなす: `payload.with_indifferent_access.fetch(:ver, 0).to_i == user.token_version`
  - 既存 spec の低レベル API 直接利用（`AccessToken.new(user_id:)`、ver なし）が token_version 0 のユーザーで動き続ける
  - デプロイ前発行のレガシートークンも初回ログアウトまでは有効（移行措置）
  - 署名検証があるため攻撃者が ver クレームを剥がすことはできない

### 5. User#forget（失効トリガー）

**責務**:
- ログアウト時に refresh_jti 削除と token_version インクリメントを同時に行う

**実装の要点**:
- `update!(refresh_jti: nil, token_version: token_version + 1)`
- 呼び出し元（AuthTokenController#destroy）は変更不要

## データフロー

### ログアウト → 旧アクセストークンでのアクセス
```
1. DELETE /api/v1/auth_token/destroy → User#forget → token_version: 0→1
2. 旧アクセストークン (ver=0) で GET /api/v1/projects
3. authenticate_active_user → current_user → from_access_token
4. AccessToken#entity_for_user: ver(0) != token_version(1) → RevokedTokenError
5. rescue JWT::DecodeError → current_user は nil → 401 Unauthorized
```

## テスト戦略

- spec/models/user_spec.rb: `forget` が token_version をインクリメントすること
- spec/requests/access_tokens_spec.rb: ver 不一致トークンの entity_for_user が RevokedTokenError を raise すること / user.encode_access_token の payload に ver が含まれること
- spec/requests/api/v1/auth_token_spec.rb: ログアウト後に旧アクセストークンで /api/v1/projects へアクセスすると 401、再ログイン後の新トークンでは 200
- spec/CLAUDE.md 準拠: SpecHelpers (login/logout/auth/res_body/active_user) を使用、context 名は日本語、FactoryBot 不使用

## 影響範囲

- 変更: db/schema.rb, user.rb, token_generate_service.rb, access_token.rb, SECURITY.md
- 追加: マイグレーション1件, revoked_token_error.rb
- 変更なし: RefreshToken, AuthTokenController, UserAuthenticateService, AuthTokenService, front/, apidoc/
- 前提修正（本機能とは別関心事・実装中に発覚）: docker-compose.yml の db ボリュームマウント先を `/var/lib/postgresql` に変更。postgres:18 系イメージ（renovate 更新済み）は旧マウント（`/var/lib/postgresql/data`）を拒否して起動しないため、マイグレーション・テスト実行の前提として修正した。コミット時は本機能と分離することを推奨（1PR=1関心事）。
