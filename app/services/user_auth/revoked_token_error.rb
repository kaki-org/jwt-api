# frozen_string_literal: true

module UserAuth
  # 失効済みトークンを表すエラー
  # JWT::DecodeErrorを継承する事で既存のrescue(401フロー)に捕捉させる
  class RevokedTokenError < JWT::DecodeError; end
end
