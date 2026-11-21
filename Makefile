APIDOC_DIR := apidoc

.DEFAULT_GOAL := help
.PHONY: help apidoc-build apidoc-preview

help: ## ターゲット一覧を表示
	@grep -E '^[a-zA-Z_-]+:.*?## ' $(MAKEFILE_LIST) | awk 'BEGIN{FS=":.*?## "}{printf "  %-16s %s\n",$$1,$$2}'

# lockfile が更新されたときだけ npm ci をやり直す
$(APIDOC_DIR)/node_modules: $(APIDOC_DIR)/package-lock.json
	cd $(APIDOC_DIR) && npm ci
	@touch $@

apidoc-build: $(APIDOC_DIR)/node_modules ## API ドキュメントをビルド（apidoc/dist/）
	cd $(APIDOC_DIR) && npm run build

apidoc-preview: apidoc-build ## ビルドして preview を起動し、ブラウザで開く
	cd $(APIDOC_DIR) && npm run preview -- --open
