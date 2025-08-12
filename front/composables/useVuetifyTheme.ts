/**
 * Vuetifyテーマ管理Composable
 * Nuxt 4.x対応のVuetifyテーマ制御機能
 */

import { useTheme } from 'vuetify'

export const useVuetifyTheme = () => {
  const theme = useTheme()

  // 現在のテーマ名を取得
  const currentTheme = computed(() => theme.global.name.value)

  // ダークモードかどうかを判定
  const isDark = computed(() => theme.global.current.value.dark)

  // ライトモードかどうかを判定
  const isLight = computed(() => !theme.global.current.value.dark)

  // 現在のテーマカラーを取得
  const colors = computed(() => theme.global.current.value.colors)

  // プライマリカラーを取得
  const primaryColor = computed(() => colors.value.primary)

  // セカンダリカラーを取得
  const secondaryColor = computed(() => colors.value.secondary)

  // 背景色を取得
  const backgroundColor = computed(() => colors.value.background)

  // サーフェス色を取得
  const surfaceColor = computed(() => colors.value.surface)

  /**
   * テーマを切り替える
   * @param themeName テーマ名（'light' | 'dark'）
   */
  const switchTheme = (themeName: 'light' | 'dark') => {
    theme.global.name.value = themeName

    // ローカルストレージに保存
    if (process.client) {
      localStorage.setItem('vuetify-theme', themeName)
    }
  }

  /**
   * ダークモードに切り替える
   */
  const switchToDark = () => {
    switchTheme('dark')
  }

  /**
   * ライトモードに切り替える
   */
  const switchToLight = () => {
    switchTheme('light')
  }

  /**
   * テーマを自動切り替えする（システム設定に基づく）
   */
  const switchToAuto = () => {
    if (process.client) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      switchTheme(prefersDark ? 'dark' : 'light')

      // システム設定の変更を監視
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = (e: MediaQueryListEvent) => {
        switchTheme(e.matches ? 'dark' : 'light')
      }

      mediaQuery.addEventListener('change', handleChange)

      // クリーンアップ関数を返す
      return () => {
        mediaQuery.removeEventListener('change', handleChange)
      }
    }
  }

  /**
   * カスタムカラーを設定する
   * @param colorName カラー名
   * @param colorValue カラー値
   */
  const setCustomColor = (colorName: string, colorValue: string) => {
    if (theme.global.current.value.colors) {
      theme.global.current.value.colors[colorName] = colorValue
    }
  }

  /**
   * ブレークポイントに基づいてモバイル表示かどうかを判定
   */
  const isMobile = computed(() => {
    if (process.client) {
      return window.innerWidth < 768
    }
    return false
  })

  /**
   * ブレークポイントに基づいてタブレット表示かどうかを判定
   */
  const isTablet = computed(() => {
    if (process.client) {
      return window.innerWidth >= 768 && window.innerWidth < 1280
    }
    return false
  })

  /**
   * ブレークポイントに基づいてデスクトップ表示かどうかを判定
   */
  const isDesktop = computed(() => {
    if (process.client) {
      return window.innerWidth >= 1280
    }
    return false
  })

  // 初期化処理（クライアントサイドのみ）
  if (process.client) {
    // ローカルストレージからテーマ設定を復元
    const savedTheme = localStorage.getItem('vuetify-theme')
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      theme.global.name.value = savedTheme
    }
  }

  return {
    // 状態
    currentTheme,
    isDark,
    isLight,
    colors,
    primaryColor,
    secondaryColor,
    backgroundColor,
    surfaceColor,
    isMobile,
    isTablet,
    isDesktop,

    // アクション
    switchTheme,
    switchToDark,
    switchToLight,
    switchToAuto,
    setCustomColor,

    // Vuetifyテーマオブジェクト（直接アクセス用）
    theme
  }
}
