# frozen_string_literal: true

require 'rails_helper'

RSpec.describe AuthTokenService do
  let(:user) { active_user }
  let(:service) { described_class.new(user) }

  describe '#initialize' do
    it 'userを設定する' do
      expect(service.user).to eq(user)
    end
  end

  describe '#generate_token_pair' do
    it 'アクセストークンとリフレッシュトークンのペアを返す' do
      result = service.generate_token_pair

      expect(result).to be_a(Hash)
      expect(result).to have_key(:access_token)
      expect(result).to have_key(:refresh_token)
    end

    it 'access_token_dataとrefresh_token_dataを含む' do
      result = service.generate_token_pair

      expect(result[:access_token]).to eq(service.access_token_data)
      expect(result[:refresh_token]).to eq(service.refresh_token_data)
    end
  end

  describe '#access_token_data' do
    it 'トークン、有効期限、サブジェクトを含むハッシュを返す' do
      result = service.access_token_data

      expect(result).to be_a(Hash)
      expect(result).to have_key(:token)
      expect(result).to have_key(:expires)
      expect(result).to have_key(:subject)
    end

    it 'トークンが文字列である' do
      result = service.access_token_data
      expect(result[:token]).to be_a(String)
    end

    it '有効期限が整数である' do
      result = service.access_token_data
      expect(result[:expires]).to be_a(Integer)
    end

    it 'サブジェクトが文字列である' do
      result = service.access_token_data
      expect(result[:subject]).to be_a(String)
      expect(result[:subject]).to be_present
    end
  end

  describe '#refresh_token_data' do
    it 'トークンと有効期限を含むハッシュを返す' do
      result = service.refresh_token_data

      expect(result).to be_a(Hash)
      expect(result).to have_key(:token)
      expect(result).to have_key(:expires)
    end

    it 'トークンが文字列である' do
      result = service.refresh_token_data
      expect(result[:token]).to be_a(String)
    end

    it '有効期限がTimeオブジェクトである' do
      result = service.refresh_token_data
      expect(result[:expires]).to be_a(Time)
    end
  end

  describe '#refresh_token_cookie_options' do
    it 'Cookieオプションを含むハッシュを返す' do
      result = service.refresh_token_cookie_options

      expect(result).to be_a(Hash)
      expect(result).to have_key(:value)
      expect(result).to have_key(:expires)
      expect(result).to have_key(:secure)
      expect(result).to have_key(:http_only)
    end

    it 'valueがリフレッシュトークンである' do
      result = service.refresh_token_cookie_options
      expect(result[:value]).to eq(service.refresh_token_data[:token])
    end

    it 'http_onlyがtrueである' do
      result = service.refresh_token_cookie_options
      expect(result[:http_only]).to be true
    end

    context 'テスト環境の場合' do
      it 'secureがfalseである' do
        result = service.refresh_token_cookie_options
        expect(result[:secure]).to be false
      end
    end
  end
end
