APIDOC_DIR := apidoc
APIDOC_STAMP := $(APIDOC_DIR)/node_modules/.make-stamp

.DEFAULT_GOAL := help
.PHONY: help apidoc-build apidoc-preview

help: ## ターゲット一覧を表示
	@grep -E '^[a-zA-Z_-]+:.*?## ' $(MAKEFILE_LIST) | awk 'BEGIN{FS=":.*?## "}{printf "  %-16s %s\n",$$1,$$2}'

# package.json / lockfile が変わったときだけ npm ci をやり直す。
# スタンプは npm ci が成功したときだけ作る（npm ci は node_modules ごと消すので、
# 途中で失敗すると古いスタンプも残らず、次回は必ず再インストールされる）。
$(APIDOC_STAMP): $(APIDOC_DIR)/package.json $(APIDOC_DIR)/package-lock.json
	cd $(APIDOC_DIR) && npm ci
	@touch $@

apidoc-build: $(APIDOC_STAMP) ## API ドキュメントをビルド（apidoc/dist/）
	cd $(APIDOC_DIR) && npm run build

apidoc-preview: apidoc-build ## ビルドして preview を起動し、ブラウザで開く
	cd $(APIDOC_DIR) && npm run preview -- --open
