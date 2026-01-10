# frozen_string_literal: true

require 'rails_helper'

RSpec.describe AuthResponseBuilder do
  let(:user) { active_user }
  let(:token_service) { AuthTokenService.new(user) }
  let(:builder) { described_class.new(user, token_service) }

  describe '#initialize' do
    it 'userを設定する' do
      expect(builder.user).to eq(user)
    end

    it 'token_serviceを設定する' do
      expect(builder.token_service).to eq(token_service)
    end

    context 'token_serviceがない場合' do
      let(:builder_without_service) { described_class.new(user) }

      it 'デフォルトのAuthTokenServiceを作成する' do
        expect(builder_without_service.token_service).to be_a(AuthTokenService)
      end

      it '作成されたtoken_serviceが同じuserを持つ' do
        expect(builder_without_service.token_service.user).to eq(user)
      end
    end
  end

  describe '#build_login_response' do
    it 'token、expires、userを含むハッシュを返す' do
      result = builder.build_login_response

      expect(result).to be_a(Hash)
      expect(result).to have_key(:token)
      expect(result).to have_key(:expires)
      expect(result).to have_key(:user)
    end

    it 'tokenがアクセストークンである' do
      result = builder.build_login_response
      expect(result[:token]).to eq(token_service.access_token_data[:token])
    end

    it 'expiresがアクセストークンの有効期限である' do
      result = builder.build_login_response
      expect(result[:expires]).to eq(token_service.access_token_data[:expires])
    end

    it 'userにユーザー情報を含む' do
      result = builder.build_login_response
      expect(result[:user]).to have_key(:id)
      expect(result[:user]).to have_key(:name)
      expect(result[:user][:id]).to eq(user.id)
      expect(result[:user][:name]).to eq(user.name)
    end
  end

  describe '#build_error_response' do
    let(:status_code) { 401 }
    let(:message) { 'Unauthorized' }

    it 'statusとerrorを含むハッシュを返す' do
      result = builder.build_error_response(status_code, message)

      expect(result).to be_a(Hash)
      expect(result).to have_key(:status)
      expect(result).to have_key(:error)
    end

    it '渡されたstatus_codeを返す' do
      result = builder.build_error_response(status_code, message)
      expect(result[:status]).to eq(status_code)
    end

    it '渡されたmessageを返す' do
      result = builder.build_error_response(status_code, message)
      expect(result[:error]).to eq(message)
    end
  end

  describe '#build_invalid_jti_response' do
    it '401ステータスとJTIエラーメッセージを返す' do
      result = builder.build_invalid_jti_response

      expect(result[:status]).to eq(401)
      expect(result[:error]).to eq('Invalid jti for refresh token')
    end
  end
end
