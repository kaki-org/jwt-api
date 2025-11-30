/**
 * 翻訳ファイル統合スクリプト
 * 分割された翻訳ファイルを統合してメインの翻訳ファイルを生成
 */

import { readdirSync, readFileSync, writeFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const localesDir = join(__dirname, '../locales')
const supportedLocales = ['ja', 'en']

/**
 * 指定された言語の翻訳ファイルを統合
 * @param {string} locale 言語コード
 */
function mergeLocaleFiles(locale) {
  const localeDir = join(localesDir, locale)
  const mergedTranslations = {}

  try {
    // 言語ディレクトリ内のJSONファイルを取得
    const files = readdirSync(localeDir).filter((file) =>
      file.endsWith('.json')
    )

    // 各ファイルの内容を統合
    for (const file of files) {
      const filePath = join(localeDir, file)
      const content = JSON.parse(readFileSync(filePath, 'utf-8'))
      Object.assign(mergedTranslations, content)
    }

    // 統合されたファイルを出力
    const outputPath = join(localesDir, `${locale}.json`)
    writeFileSync(
      outputPath,
      JSON.stringify(mergedTranslations, null, 2),
      'utf-8'
    )

    console.log(
      `✅ Merged ${locale} translations: ${files.join(', ')} -> ${locale}.json`
    )
  } catch (error) {
    console.error(`❌ Failed to merge ${locale} translations:`, error.message)
  }
}

/**
 * すべての言語の翻訳ファイルを統合
 */
function mergeAllLocales() {
  console.log('🔄 Starting locale files merge...')

  for (const locale of supportedLocales) {
    mergeLocaleFiles(locale)
  }

  console.log('✨ Locale files merge completed!')
}

// スクリプトが直接実行された場合
if (import.meta.url === `file://${process.argv[1]}`) {
  mergeAllLocales()
}

export { mergeLocaleFiles, mergeAllLocales }
