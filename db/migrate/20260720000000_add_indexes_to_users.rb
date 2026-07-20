# frozen_string_literal: true

# usersテーブルの検索カラムにインデックスを追加する
#
# emailは部分ユニークインデックスとする。本アプリはemailの一意性を
# activated=trueのユーザー間でのみ保証する設計(EmailValidator参照)であり、
# 単純なユニークインデックスでは未アクティベートユーザーの登録が壊れるため。
class AddIndexesToUsers < ActiveRecord::Migration[8.1]
  def change
    add_index :users, :email, unique: true, where: 'activated',
                              name: 'index_users_on_email_activated'
    add_index :users, :refresh_jti, unique: true
  end
end
