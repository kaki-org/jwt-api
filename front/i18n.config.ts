/**
 * Vue I18n設定ファイル - Nuxt 4.x対応
 * Doc: https://i18n.nuxtjs.org/docs/guide/vue-i18n-options
 */

export default defineI18nConfig(() => ({
  // 翻訳対象のキーがない場合に参照される言語
  fallbackLocale: 'en',

  // フォールバック時の警告設定
  // true => 翻訳のキーが存在しない場合のみ警告を表示
  silentFallbackWarn: true,

  // 翻訳の警告を制御
  // true => i18nの警告を完全に表示しない
  silentTranslationWarn: false,

  // 数値フォーマット設定
  numberFormats: {
    ja: {
      currency: {
        style: 'currency',
        currency: 'JPY',
        notation: 'standard',
      },
      decimal: {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      },
      percent: {
        style: 'percent',
        useGrouping: false,
      },
    },
    en: {
      currency: {
        style: 'currency',
        currency: 'USD',
        notation: 'standard',
      },
      decimal: {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      },
      percent: {
        style: 'percent',
        useGrouping: false,
      },
    },
  },

  // 日時フォーマット設定
  datetimeFormats: {
    ja: {
      short: {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      },
      long: {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        weekday: 'short',
        hour: 'numeric',
        minute: 'numeric',
      },
    },
    en: {
      short: {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      },
      long: {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        weekday: 'short',
        hour: 'numeric',
        minute: 'numeric',
      },
    },
  },

  // 複数形ルール設定
  pluralizationRules: {
    ja: (choice: number) => {
      // 日本語は複数形がないため、常に0を返す
      return 0
    },
    en: (choice: number) => {
      // 英語の複数形ルール
      return choice === 0 ? 0 : choice === 1 ? 1 : 2
    },
  },

  // メッセージの欠落時の処理
  missing: (locale: string, key: string) => {
    // 開発環境でのみ警告を表示
    if (process.env.NODE_ENV === 'development') {
      console.warn(`Missing translation for key "${key}" in locale "${locale}"`)
    }
    return key
  },
}))
