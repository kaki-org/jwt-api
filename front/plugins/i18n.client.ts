/**
 * i18nクライアントサイドプラグイン
 * Nuxt 4.x対応のi18n初期化処理
 */

export default defineNuxtPlugin(async () => {
  const { $i18n } = useNuxtApp()

  // クライアントサイドでの言語設定の初期化
  if (process.client) {
    // ブラウザの言語設定を取得
    const browserLocale = navigator.language.split('-')[0]

    // サポートしている言語かチェック
    const supportedLocales = ['ja', 'en']
    const defaultLocale = supportedLocales.includes(browserLocale) ? browserLocale : 'ja'

    // ローカルストレージから保存された言語設定を取得
    const savedLocale = localStorage.getItem('nuxt-i18n-locale')

    // 使用する言語を決定（優先順位: 保存された設定 > ブラウザ設定 > デフォルト）
    const targetLocale = savedLocale && supportedLocales.includes(savedLocale)
      ? savedLocale
      : defaultLocale

    // 現在の言語と異なる場合のみ設定を変更
    if ($i18n.locale.value !== targetLocale) {
      await $i18n.setLocale(targetLocale)
    }

    // 言語変更時にローカルストレージに保存
    watch($i18n.locale, (newLocale) => {
      localStorage.setItem('nuxt-i18n-locale', newLocale)
    })
  }
})
