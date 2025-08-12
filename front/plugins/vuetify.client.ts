/**
 * Vuetify 3.x プラグイン - Nuxt 4.x対応
 * Doc: https://vuetifyjs.com/en/getting-started/installation/#nuxt-3
 */

import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css'

// Vuetifyテーマ設定
const lightTheme = {
  dark: false,
  colors: {
    primary: '#4080BE',
    secondary: '#424242',
    accent: '#82B1FF',
    error: '#FB8678',
    info: '#4FC1E9',
    success: '#44D69E',
    warning: '#FEB65E',
    background: '#f6f6f4',
    surface: '#FFFFFF',
    'on-primary': '#FFFFFF',
    'on-secondary': '#FFFFFF',
    'on-surface': '#000000',
    'on-background': '#000000',
    'on-error': '#FFFFFF',
    // カスタムカラー
    appblue: '#1867C0',
  },
}

const darkTheme = {
  dark: true,
  colors: {
    primary: '#4080BE',
    secondary: '#424242',
    accent: '#82B1FF',
    error: '#FB8678',
    info: '#4FC1E9',
    success: '#44D69E',
    warning: '#FEB65E',
    background: '#121212',
    surface: '#1E1E1E',
    'on-primary': '#FFFFFF',
    'on-secondary': '#FFFFFF',
    'on-surface': '#FFFFFF',
    'on-background': '#FFFFFF',
    'on-error': '#FFFFFF',
    // カスタムカラー
    appblue: '#1867C0',
  },
}

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    // コンポーネントの設定
    components,
    directives,

    // アイコン設定
    icons: {
      defaultSet: 'mdi',
      aliases,
      sets: {
        mdi,
      },
    },

    // テーマ設定
    theme: {
      defaultTheme: 'light',
      themes: {
        light: lightTheme,
        dark: darkTheme,
      },
      variations: {
        colors: ['primary', 'secondary', 'accent', 'error', 'info', 'success', 'warning'],
        lighten: 5,
        darken: 5,
      },
    },

    // ディスプレイ設定（レスポンシブ）
    display: {
      mobileBreakpoint: 'sm',
      thresholds: {
        xs: 0,
        sm: 600,
        md: 960,
        lg: 1280,
        xl: 1920,
        // カスタムブレークポイント
        mobile: 426,
        ipad: 768,
      },
    },

    // デフォルト設定
    defaults: {
      VBtn: {
        variant: 'flat',
        color: 'primary',
      },
      VCard: {
        variant: 'elevated',
        elevation: 2,
      },
      VTextField: {
        variant: 'outlined',
        density: 'comfortable',
      },
      VSelect: {
        variant: 'outlined',
        density: 'comfortable',
      },
      VTextarea: {
        variant: 'outlined',
        density: 'comfortable',
      },
      VCheckbox: {
        color: 'primary',
      },
      VRadio: {
        color: 'primary',
      },
      VSwitch: {
        color: 'primary',
      },
      VSlider: {
        color: 'primary',
      },
      VProgressLinear: {
        color: 'primary',
      },
      VProgressCircular: {
        color: 'primary',
      },
    },
  })

  nuxtApp.vueApp.use(vuetify)
})
