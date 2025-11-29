/**
 * i18n関連の型定義
 */

// 言語コードの型定義
export type LocaleCode = 'ja' | 'en'

// 言語情報の型定義
export interface LocaleInfo {
  code: LocaleCode
  name: string
  file: string
}

// 翻訳メッセージの型定義（日本語版をベースとした型安全性）
export interface TranslationMessages {
  menus: {
    about: string
    products: string
    price: string
    contact: string
    company: string
    payments: {
      month: string
      year: string
    }
  }
  pages: {
    signup: string
    login: string
    logout: string
    account: {
      settings: string
      password: string
    }
    project: {
      id: {
        dashboard: string
        layouts: string
        pages: string
        components: string
        settings: string
        help: string
      }
    }
  }
  error: {
    Unauthorized: string
    Forbidden: string
    'This page could not be found': string
    'Network Error': string
  }
}

// i18n設定の型定義
export interface I18nConfig {
  locales: LocaleInfo[]
  defaultLocale: LocaleCode
  strategy:
    | 'no_prefix'
    | 'prefix'
    | 'prefix_except_default'
    | 'prefix_and_default'
  langDir: string
  lazy: boolean
  vueI18n: string
}

// 数値フォーマットオプションの型定義
export interface NumberFormatOptions {
  style: 'currency' | 'decimal' | 'percent'
  currency?: string
  notation?: 'standard' | 'scientific' | 'engineering' | 'compact'
  minimumFractionDigits?: number
  maximumFractionDigits?: number
  useGrouping?: boolean
}

// 日時フォーマットオプションの型定義
export interface DateTimeFormatOptions {
  year?: 'numeric' | '2-digit'
  month?: 'numeric' | '2-digit' | 'long' | 'short' | 'narrow'
  day?: 'numeric' | '2-digit'
  weekday?: 'long' | 'short' | 'narrow'
  hour?: 'numeric' | '2-digit'
  minute?: 'numeric' | '2-digit'
  second?: 'numeric' | '2-digit'
}
