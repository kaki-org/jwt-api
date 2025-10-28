# frozen_string_literal: true

# 認証レスポンスの構築を担当するサービス
class AuthResponseBuilder
  attr_reader :user, :token_service

  def initialize(user, token_service = nil)
    @user = user
    @token_service = token_service || AuthTokenService.new(user)
  end

  # ログイン成功時のレスポンスを構築
  def build_login_response
    access_token_data = token_service.access_token_data

    {
      token: access_token_data[:token],
      expires: access_token_data[:expires],
      user: user.response_json(sub: access_token_data[:subject])
    }
  end

  # エラーレスポンスを構築
  def build_error_response(status_code, message)
    {
      status: status_code,
      error: message
    }
  end

  # JTIエラー時の特定レスポンス
  def build_invalid_jti_response
    build_error_response(401, 'Invalid jti for refresh token')
  end
end
