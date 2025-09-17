# frozen_string_literal: true

module Api
  module V1
    # Token認証を行う為のコントローラ
    class AuthTokenController < ApplicationController
      include UserSessionizeService

      # 404エラーが発生した場合にヘッダーのみを返す
      rescue_from UserAuth.not_found_exception_class, with: :not_found
      # refresh_tokenのInvalidJitErrorが発生した場合はカスタムエラーを返す
      rescue_from JWT::InvalidJtiError, with: :invalid_jti

      # userのログイン情報を確認する
      before_action :authenticate, only: [:create]
      # 処理前にsessionを削除する
      before_action :delete_session, only: [:create]
      # session_userを取得、存在しない場合は401を返す
      before_action :sessionize_user, only: %i[refresh destroy]

      # ログイン
      def create
        @user = login_user
        token_service = AuthTokenService.new(@user)
        response_builder = AuthResponseBuilder.new(@user, token_service)

        refresh_token_to_cookie(token_service)
        render json: response_builder.build_login_response
      end

      # リフレッシュ
      def refresh
        @user = session_user
        token_service = AuthTokenService.new(@user)
        response_builder = AuthResponseBuilder.new(@user, token_service)

        refresh_token_to_cookie(token_service)
        render json: response_builder.build_login_response
      end

      # ログアウト
      def destroy
        delete_session if session_user.forget
        if cookies[session_key].nil?
          head(:ok)
        else
          response_500('Could not delete session')
        end
      end

      private

      # params[:email]からアクティブなユーザーを返す
      def login_user
        @_login_user ||= User.find_by_activated(auth_params[:email]) # rubocop:disable Naming/MemoizedInstanceVariableName
      end

      # ログインユーザーが居ない、もしくはpasswordが一致しない場合404を返す
      def authenticate
        unless login_user.present? &&
               login_user.authenticate(auth_params[:password])
          raise UserAuth.not_found_exception_class
        end
      end

      # refresh_tokenをcookieにセットする
      def refresh_token_to_cookie(token_service)
        cookies[session_key] = token_service.refresh_token_cookie_options
      end

      # 404ヘッダーのみの返却を行う
      # Doc: https://gist.github.com/mlanett/a31c340b132ddefa9cca
      def not_found
        head(:not_found)
      end

      # decode jti != user.refresh_jti のエラー処理
      def invalid_jti
        response_builder = AuthResponseBuilder.new(nil)
        render status: 401, json: response_builder.build_invalid_jti_response
      end

      def auth_params
        params.require(:auth).permit(:email, :password)
      end
    end
  end
end
