/**
 * i18n.config.ts（vue-i18n オプション）の挙動テスト。
 *
 * @nuxtjs/i18n / vue-i18n のアップグレードで翻訳・フォーマット・フォールバックの
 * 挙動が変わっていないことを担保する。実際の locale JSON と i18n.config の設定を
 * そのまま createI18n に渡して検証する。
 */

import { describe, expect, it } from 'vitest'
import { createI18n } from 'vue-i18n'
import i18nConfig from '../i18n.config'
import en from '../locales/en.json'
import ja from '../locales/ja.json'

// setup.ts のスタブにより default export はローダー関数。呼び出すとオプションを得る。
const options = (i18nConfig as unknown as () => Record<string, unknown>)()

function makeI18n(
  extra: { ja?: Record<string, unknown>; en?: Record<string, unknown> } = {}
) {
  return createI18n({
    legacy: false,
    locale: 'ja',
    fallbackLocale: options.fallbackLocale as string,
    messages: {
      ja: { ...ja, ...(extra.ja ?? {}) },
      en: { ...en, ...(extra.en ?? {}) },
    },
    numberFormats: options.numberFormats as never,
    datetimeFormats: options.datetimeFormats as never,
    pluralRules: options.pluralizationRules as never,
    missing: options.missing as never,
  })
}

describe('i18n.config の設定値', () => {
  it('fallbackLocale は en', () => {
    expect(options.fallbackLocale).toBe('en')
  })

  it('missing ハンドラは未翻訳キーをそのまま返す', () => {
    const missing = options.missing as (l: string, k: string) => string
    expect(missing('ja', 'some.unknown.key')).toBe('some.unknown.key')
  })

  it('日本語の複数形ルールは常に 0 を返す', () => {
    const rules = options.pluralizationRules as {
      ja: (n: number) => number
      en: (n: number) => number
    }
    expect(rules.ja(0)).toBe(0)
    expect(rules.ja(1)).toBe(0)
    expect(rules.ja(100)).toBe(0)
  })

  it('英語の複数形ルールは 0/1/複数 を区別する', () => {
    const rules = options.pluralizationRules as { en: (n: number) => number }
    expect(rules.en(0)).toBe(0)
    expect(rules.en(1)).toBe(1)
    expect(rules.en(5)).toBe(2)
  })

  it('通貨フォーマットは ja=JPY / en=USD', () => {
    const nf = options.numberFormats as Record<string, never>
    expect((nf.ja as never as Record<string, never>).currency).toMatchObject({
      currency: 'JPY',
    })
    expect((nf.en as never as Record<string, never>).currency).toMatchObject({
      currency: 'USD',
    })
  })
})

describe('翻訳の解決', () => {
  it('ネストしたキーを ja で解決する', () => {
    const { global: g } = makeI18n()
    expect(g.t('menus.about')).toBe('サイトについて')
    expect(g.t('pages.project.id.dashboard')).toBe('ダッシュボード')
  })

  it('ロケール切替で en の翻訳を返す', () => {
    const i18n = makeI18n()
    i18n.global.locale.value = 'en'
    expect(i18n.global.t('menus.about')).toBe('About')
  })

  it('ja に無いキーは fallbackLocale(en) にフォールバックする', () => {
    const i18n = makeI18n({ en: { onlyInEn: 'English only' } })
    // locale は ja のまま
    expect(i18n.global.t('onlyInEn')).toBe('English only')
  })

  it('どのロケールにも無いキーは missing ハンドラ経由でキー名を返す', () => {
    const { global: g } = makeI18n()
    expect(g.t('totally.missing.key')).toBe('totally.missing.key')
  })
})

describe('数値・日時フォーマット', () => {
  it('ja の通貨は円記号を含む', () => {
    const { global: g } = makeI18n()
    expect(g.n(1000, 'currency')).toMatch(/[¥￥]/)
  })

  it('en の通貨はドル記号を含む', () => {
    const i18n = makeI18n()
    i18n.global.locale.value = 'en'
    expect(i18n.global.n(1000, 'currency')).toContain('$')
  })

  it('decimal は小数2桁でフォーマットされる', () => {
    const { global: g } = makeI18n()
    expect(g.n(1234.5, 'decimal')).toMatch(/\.\d{2}$/)
  })

  it('日時フォーマットは short/long を出力し long の方が情報量が多い', () => {
    const { global: g } = makeI18n()
    const date = new Date('2024-01-15T09:30:00Z')
    const short = g.d(date, 'short')
    const long = g.d(date, 'long')
    expect(short).toContain('2024')
    expect(long).toContain('2024')
    expect(long.length).toBeGreaterThan(short.length)
  })
})
