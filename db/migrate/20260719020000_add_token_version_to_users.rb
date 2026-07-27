# frozen_string_literal: true

# アクセストークン失効用のトークンバージョンをユーザテーブルに追加する
class AddTokenVersionToUsers < ActiveRecord::Migration[8.1]
  def change
    add_column :users, :token_version, :integer, null: false, default: 0
  end
end
