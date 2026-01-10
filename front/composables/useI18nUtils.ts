/**
 * i18n関連のユーティリティComposable
 * Nuxt 4.x対応のi18n機能を提供
 */

/**
 * 翻訳キーの型安全性を向上させるためのヘルパー
 */
export type TranslationKey =
  | 'menus.about'
  | 'menus.products'
  | 'menus.price'
  | 'menus.contact'
  | 'menus.company'
  | 'menus.payments.month'
  | 'menus.payments.year'
  | 'pages.signup'
  | 'pages.login'
  | 'pages.logout'
  | 'pages.account.settings'
  | 'pages.account.password'
  | 'pages.project.id.dashboard'
  | 'pages.project.id.layouts'
  | 'pages.project.id.pages'
  | 'pages.project.id.components'
  | 'pages.project.id.settings'
  | 'pages.project.id.help'
  | 'error.Unauthorized'
  | 'error.Forbidden'
  | 'error.This page could not be found'
  | 'error.Network Error'

/**
 * i18nユーティリティComposable
 */
export const useI18nUtils = () => {
  const { t, locale, locales, setLocale } = useI18n()

  /**
   * 型安全な翻訳関数
   * @param key 翻訳キー
   * @param params 翻訳パラメータ
   * @returns 翻訳されたテキスト
   */
  const translate = (
    key: TranslationKey,
    params?: Record<string, any>
  ): string => {
    return t(key, params)
  }

  /**
   * エラーメッセージの翻訳
   * @param errorKey エラーキー
   * @returns 翻訳されたエラーメッセージ
   */
  const translateError = (errorKey: string): string => {
    const key = `error.${errorKey}` as TranslationKey
    return t(key, errorKey) // フォールバックとして元のキーを使用
  }

  /**
   * 現在の言語が日本語かどうかを判定
   * @returns 日本語の場合true
   */
  const isJapanese = computed(() => locale.value === 'ja')

  /**
   * 現在の言語が英語かどうかを判定
   * @returns 英語の場合true
   */
  const isEnglish = computed(() => locale.value === 'en')

  /**
   * 利用可能な言語一覧を取得
   * @returns 言語一覧
   */
  const availableLocales = computed(() => {
    return locales.value.filter((locale) => locale.code !== locale.value)
  })

  /**
   * 言語を切り替える
   * @param newLocale 新しい言語コード
   */
  const switchLocale = async (newLocale: string) => {
    try {
      await setLocale(newLocale)
    } catch (error) {
      console.error('Failed to switch locale:', error)
    }
  }

  /**
   * 現在の言語に応じたフォーマット済み日付を取得
   * @param date 日付
   * @param format フォーマット形式
   * @returns フォーマット済み日付
   */
  const formatDate = (
    date: Date | string,
    format: 'short' | 'long' = 'short'
  ): string => {
    const { d } = useI18n()
    return d(new Date(date), format)
  }

  /**
   * 現在の言語に応じたフォーマット済み数値を取得
   * @param number 数値
   * @param format フォーマット形式
   * @returns フォーマット済み数値
   */
  const formatNumber = (
    number: number,
    format: 'currency' | 'decimal' | 'percent' = 'decimal'
  ): string => {
    const { n } = useI18n()
    return n(number, format)
  }

  return {
    // 基本的な翻訳機能
    t,
    translate,
    translateError,

    // 言語情報
    locale,
    locales,
    isJapanese,
    isEnglish,
    availableLocales,

    // 言語切り替え
    setLocale,
    switchLocale,

    // フォーマット機能
    formatDate,
    formatNumber,
  }
}
