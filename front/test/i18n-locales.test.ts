/**
 * locale データの整合性テスト。
 *
 * i18n の翻訳抜け・統合漏れは @nuxtjs/i18n のバージョンに依らず実害があるため、
 * 言語間のキー整合性と、統合ファイル(ja.json/en.json)の鮮度を検証する。
 */

import { readdirSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import en from '../locales/en.json'
import ja from '../locales/ja.json'

const here = dirname(fileURLToPath(import.meta.url))
const localesDir = join(here, '..', 'locales')

/** ネストしたオブジェクトのリーフキーをドット区切りで列挙する。 */
function flattenKeys(obj: unknown, prefix = ''): string[] {
  if (obj === null || typeof obj !== 'object') return [prefix]
  return Object.entries(obj as Record<string, unknown>).flatMap(([k, v]) =>
    flattenKeys(v, prefix ? `${prefix}.${k}` : k)
  )
}

/** merge-locales.js と同じ手順（分割 JSON の浅いマージ）を再現する。 */
function mergeLocale(locale: string): Record<string, unknown> {
  const dir = join(localesDir, locale)
  const merged: Record<string, unknown> = {}
  for (const file of readdirSync(dir).filter((f) => f.endsWith('.json'))) {
    Object.assign(merged, JSON.parse(readFileSync(join(dir, file), 'utf-8')))
  }
  return merged
}

describe('locale のキー整合性', () => {
  it('ja と en は同一のキー集合を持つ', () => {
    const jaKeys = flattenKeys(ja).sort()
    const enKeys = flattenKeys(en).sort()
    expect(jaKeys).toEqual(enKeys)
  })

  it('翻訳値が空文字でない', () => {
    for (const messages of [ja, en]) {
      const empties = flattenKeys(messages).filter((key) => {
        const value = key
          .split('.')
          .reduce<unknown>(
            (acc, k) => (acc as Record<string, unknown>)?.[k],
            messages
          )
        return typeof value === 'string' && value.trim() === ''
      })
      expect(empties).toEqual([])
    }
  })
})

describe('統合ファイルの鮮度', () => {
  it('ja.json は分割ファイルの統合結果と一致する', () => {
    expect(ja).toEqual(mergeLocale('ja'))
  })

  it('en.json は分割ファイルの統合結果と一致する', () => {
    expect(en).toEqual(mergeLocale('en'))
  })
})
