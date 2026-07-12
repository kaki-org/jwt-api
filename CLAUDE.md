# CLAUDE.md

JWT認証のサンプルアプリ。Rails 8.1 APIモード (リポジトリルート) と Nuxt 4 SPA (front/) のモノレポ。API仕様の正本は apidoc/openapi.yaml。

## 全域で守ること

- バックエンドのコマンドは dip 経由で実行する (dip rspec / dip rubocop / dip brakeman / dip rails c)。Docker外なら bundle exec。フロントエンドは front/ で pnpm。
- API は全リクエストに X-Requested-With: XMLHttpRequest ヘッダーが必要で、無いと403になる (CSRF対策)。バックエンドの実装・テスト、フロントエンドのAPI呼び出しすべてに影響する。
- 認証は HttpOnly Cookie を使うため CORS は credentials: true。ポート: API 33000 / Front 3000 / DB 25432。
- Rubyファイルは先頭に # frozen_string_literal: true を付ける。
- コミットメッセージに Co-Authored-By 行を含めない。
- 詳細な規約は各ディレクトリの CLAUDE.md にある (app/, config/, spec/, front/)。

## セットアップ・CI

- dip provision で DB作成・マイグレーション・シード投入まで一括実行。
- PRごとに RuboCop + RSpec が走る (SimpleCov→Codecov)。デプロイは Heroku (heroku.yml)。
