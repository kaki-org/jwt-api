/**
 * Vuetifyユーティリティ関数
 * Nuxt 4.x対応のVuetifyヘルパー関数
 */

import type { ColorVariant, VuetifySize, ResponsiveValue } from '~/types/vuetify'

/**
 * レスポンシブ値を現在のブレークポイントに基づいて解決する
 * @param value レスポンシブ値
 * @param currentBreakpoint 現在のブレークポイント
 * @returns 解決された値
 */
export function resolveResponsiveValue<T>(
  value: ResponsiveValue<T>,
  currentBreakpoint: string = 'md'
): T {
  if (typeof value !== 'object' || value === null) {
    return value as T
  }

  const responsiveValue = value as Record<string, T>

  // ブレークポイントの優先順位
  const breakpointOrder = ['xl', 'lg', 'md', 'sm', 'xs', 'ipad', 'mobile']
  const currentIndex = breakpointOrder.indexOf(currentBreakpoint)

  // 現在のブレークポイント以下で最初に見つかった値を返す
  for (let i = currentIndex; i < breakpointOrder.length; i++) {
    const bp = breakpointOrder[i]
    if (responsiveValue[bp] !== undefined) {
      return responsiveValue[bp]
    }
  }

  // フォールバック値を返す
  return responsiveValue.xs || responsiveValue.sm || responsiveValue.md || (value as T)
}

/**
 * カラーバリアントが有効かどうかをチェックする
 * @param color カラー値
 * @returns 有効なカラーバリアントかどうか
 */
export function isValidColorVariant(color: string): color is ColorVariant {
  const validColors: ColorVariant[] = [
    'primary', 'secondary', 'accent', 'error', 'info',
    'success', 'warning', 'background', 'surface', 'appblue'
  ]
  return validColors.includes(color as ColorVariant)
}

/**
 * サイズ値が有効かどうかをチェックする
 * @param size サイズ値
 * @returns 有効なサイズかどうか
 */
export function isValidSize(size: string): size is VuetifySize {
  const validSizes: VuetifySize[] = ['x-small', 'small', 'default', 'large', 'x-large']
  return validSizes.includes(size as VuetifySize)
}

/**
 * CSSクラス名を生成する
 * @param baseClass ベースクラス名
 * @param modifiers モディファイア
 * @returns 生成されたクラス名
 */
export function generateVuetifyClass(
  baseClass: string,
  modifiers: Record<string, string | boolean | undefined> = {}
): string {
  const classes = [baseClass]

  Object.entries(modifiers).forEach(([key, value]) => {
    if (value === true) {
      classes.push(`${baseClass}--${key}`)
    } else if (typeof value === 'string' && value) {
      classes.push(`${baseClass}--${key}-${value}`)
    }
  })

  return classes.join(' ')
}

/**
 * ブレークポイントに基づいてクラス名を生成する
 * @param baseClass ベースクラス名
 * @param breakpoints ブレークポイント別の値
 * @returns 生成されたクラス名配列
 */
export function generateResponsiveClasses(
  baseClass: string,
  breakpoints: Partial<Record<string, string | boolean>>
): string[] {
  const classes: string[] = []

  Object.entries(breakpoints).forEach(([breakpoint, value]) => {
    if (value === true) {
      classes.push(`${baseClass}-${breakpoint}`)
    } else if (typeof value === 'string' && value) {
      classes.push(`${baseClass}-${breakpoint}-${value}`)
    }
  })

  return classes
}

/**
 * Vuetifyのエレベーション値を正規化する
 * @param elevation エレベーション値
 * @returns 正規化されたエレベーション値
 */
export function normalizeElevation(elevation: string | number | undefined): number {
  if (typeof elevation === 'number') {
    return Math.max(0, Math.min(24, elevation))
  }

  if (typeof elevation === 'string') {
    const parsed = parseInt(elevation, 10)
    return isNaN(parsed) ? 0 : Math.max(0, Math.min(24, parsed))
  }

  return 0
}

/**
 * カラー値を正規化する（HEXカラーの場合は#を追加）
 * @param color カラー値
 * @returns 正規化されたカラー値
 */
export function normalizeColor(color: string): string {
  // HEXカラーの場合
  if (/^[0-9A-Fa-f]{6}$/.test(color)) {
    return `#${color}`
  }

  // RGB/RGBA/HSL/HSLA形式の場合はそのまま返す
  if (/^(rgb|rgba|hsl|hsla)\(/.test(color)) {
    return color
  }

  // CSS変数の場合
  if (color.startsWith('var(')) {
    return color
  }

  // その他の場合はそのまま返す（カラー名など）
  return color
}

/**
 * ダークモード用のカラーを生成する
 * @param lightColor ライトモード用のカラー
 * @param darkColor ダークモード用のカラー（オプション）
 * @returns ダークモード用のカラー
 */
export function generateDarkColor(lightColor: string, darkColor?: string): string {
  if (darkColor) {
    return darkColor
  }

  // 簡単なダークモード変換（実際のプロジェクトではより高度な変換が必要）
  const colorMap: Record<string, string> = {
    '#ffffff': '#121212',
    '#f6f6f4': '#1e1e1e',
    '#000000': '#ffffff',
    '#4080BE': '#5090CE',
    '#FB8678': '#FC9688',
    '#44D69E': '#54E6AE',
    '#FEB65E': '#FEC66E',
    '#4FC1E9': '#5FD1F9',
  }

  return colorMap[lightColor] || lightColor
}

/**
 * アクセシビリティ対応のコントラスト比を計算する
 * @param foreground 前景色
 * @param background 背景色
 * @returns コントラスト比
 */
export function calculateContrastRatio(foreground: string, background: string): number {
  // 簡単な実装（実際のプロジェクトではより正確な計算が必要）
  // この関数は将来的にアクセシビリティチェックに使用可能

  const getLuminance = (color: string): number => {
    // HEXカラーからRGB値を抽出
    const hex = color.replace('#', '')
    const r = parseInt(hex.substr(0, 2), 16) / 255
    const g = parseInt(hex.substr(2, 2), 16) / 255
    const b = parseInt(hex.substr(4, 2), 16) / 255

    // 相対輝度を計算
    const toLinear = (c: number) => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)

    return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b)
  }

  try {
    const fgLuminance = getLuminance(foreground)
    const bgLuminance = getLuminance(background)

    const lighter = Math.max(fgLuminance, bgLuminance)
    const darker = Math.min(fgLuminance, bgLuminance)

    return (lighter + 0.05) / (darker + 0.05)
  } catch {
    return 1 // エラーの場合はデフォルト値を返す
  }
}
