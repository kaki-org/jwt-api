/**
 * Vitest セットアップ
 *
 * `defineI18nConfig` は @nuxtjs/i18n がビルド時に自動注入するマクロのため、
 * 単体テストで `i18n.config.ts` を素の状態で読み込めるよう、最小のスタブを
 * グローバルへ定義する。スタブはローダー関数をそのまま返すだけで、
 * テスト側で呼び出すと vue-i18n に渡すオプションオブジェクトが得られる。
 */

;(
  globalThis as unknown as { defineI18nConfig: (loader: unknown) => unknown }
).defineI18nConfig = (loader: unknown) => loader
