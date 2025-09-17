# frozen_string_literal: true

# JWT認証トークンの生成と管理を担当するサービス
class AuthTokenService
  attr_reader :user

  def initialize(user)
    @user = user
  end

  # アクセストークンとリフレッシュトークンのペアを生成
  def generate_token_pair
    {
      access_token: access_token_data,
      refresh_token: refresh_token_data
    }
  end

  # アクセストークンの情報を取得
  def access_token_data
    token_instance = encoded_access_token
    {
      token: token_instance.token,
      expires: token_instance.payload[:exp],
      subject: token_instance.payload[:sub]
    }
  end

  # リフレッシュトークンの情報を取得
  def refresh_token_data
    token_instance = encoded_refresh_token
    {
      token: token_instance.token,
      expires: Time.at(token_instance.payload[:exp])
    }
  end

  # リフレッシュトークンをCookieに設定するためのオプションを生成
  def refresh_token_cookie_options
    refresh_data = refresh_token_data
    {
      value: refresh_data[:token],
      expires: refresh_data[:expires],
      secure: Rails.env.production?,
      http_only: true
    }
  end

  private

  # アクセストークンのエンコード済みインスタンス（メモ化）
  def encoded_access_token
    @encoded_access_token ||= user.encode_access_token
  end

  # リフレッシュトークンのエンコード済みインスタンス（メモ化）
  def encoded_refresh_token
    @encoded_refresh_token ||= user.encode_refresh_token
  end
end
