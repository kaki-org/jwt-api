/**
 * Vuetify関連の型定義
 * Nuxt 4.x対応のVuetify型定義
 */

// テーマ名の型定義
export type ThemeName = 'light' | 'dark'

// カスタムカラーの型定義
export interface CustomColors {
  primary: string
  secondary: string
  accent: string
  error: string
  info: string
  success: string
  warning: string
  background: string
  surface: string
  appblue: string
}

// ブレークポイントの型定義
export interface Breakpoints {
  xs: number
  sm: number
  md: number
  lg: number
  xl: number
  mobile: number
  ipad: number
}

// ディスプレイ設定の型定義
export interface DisplayOptions {
  mobileBreakpoint: keyof Breakpoints
  thresholds: Breakpoints
}

// テーマ設定の型定義
export interface ThemeDefinition {
  dark: boolean
  colors: CustomColors
}

// Vuetifyコンポーネントのデフォルト設定型
export interface ComponentDefaults {
  VBtn?: {
    variant?: 'flat' | 'elevated' | 'tonal' | 'outlined' | 'text' | 'plain'
    color?: string
    size?: 'x-small' | 'small' | 'default' | 'large' | 'x-large'
  }
  VCard?: {
    variant?: 'flat' | 'elevated' | 'tonal' | 'outlined' | 'text' | 'plain'
    elevation?: number | string
  }
  VTextField?: {
    variant?: 'filled' | 'outlined' | 'plain' | 'underlined' | 'solo' | 'solo-inverted' | 'solo-filled'
    density?: 'default' | 'comfortable' | 'compact'
  }
  VSelect?: {
    variant?: 'filled' | 'outlined' | 'plain' | 'underlined' | 'solo' | 'solo-inverted' | 'solo-filled'
    density?: 'default' | 'comfortable' | 'compact'
  }
  VTextarea?: {
    variant?: 'filled' | 'outlined' | 'plain' | 'underlined' | 'solo' | 'solo-inverted' | 'solo-filled'
    density?: 'default' | 'comfortable' | 'compact'
  }
  [key: string]: any
}

// Vuetify設定オプションの型定義
export interface VuetifyOptions {
  components?: any
  directives?: any
  icons?: {
    defaultSet: string
    aliases?: any
    sets?: any
  }
  theme?: {
    defaultTheme: ThemeName
    themes: Record<ThemeName, ThemeDefinition>
    variations?: {
      colors: string[]
      lighten: number
      darken: number
    }
  }
  display?: DisplayOptions
  defaults?: ComponentDefaults
}

// レスポンシブヘルパーの型定義
export type ResponsiveValue<T> = T | {
  xs?: T
  sm?: T
  md?: T
  lg?: T
  xl?: T
  mobile?: T
  ipad?: T
}

// Vuetifyアイコンの型定義
export type VuetifyIcon = string | {
  icon: string
  color?: string
  size?: string | number
}

// Vuetifyカラーバリアントの型定義
export type ColorVariant =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'error'
  | 'info'
  | 'success'
  | 'warning'
  | 'background'
  | 'surface'
  | 'appblue'

// Vuetifyサイズの型定義
export type VuetifySize = 'x-small' | 'small' | 'default' | 'large' | 'x-large'

// Vuetifyバリアントの型定義
export type VuetifyVariant = 'flat' | 'elevated' | 'tonal' | 'outlined' | 'text' | 'plain'
