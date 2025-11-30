// Vuetify 3.x + Nuxt 4.x プラグイン設定
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

// Vuetify スタイルのインポート
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

export default defineNuxtPlugin((nuxtApp) => {
  // Vuetify インスタンスの作成
  const vuetify = createVuetify({
    // コンポーネントの登録
    components,
    directives,

    // テーマ設定
    theme: {
      defaultTheme: 'light',
      themes: {
        light: {
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
            // カスタムカラー
            appblue: '#1867C0',
          },
        },
        dark: {
          dark: true,
          colors: {
            primary: '#4080BE',
            secondary: '#424242',
            accent: '#FF4081',
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
            // カスタムカラー
            appblue: '#1867C0',
          },
        },
      },
    },

    // アイコン設定
    icons: {
      defaultSet: 'mdi',
      aliases,
      sets: {
        mdi,
      },
    },

    // デフォルトプロパティ設定
    defaults: {
      VBtn: {
        style: 'text-transform: none;',
        elevation: 2,
      },
      VCard: {
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
      VAutocomplete: {
        variant: 'outlined',
        density: 'comfortable',
      },
      VCombobox: {
        variant: 'outlined',
        density: 'comfortable',
      },
      VFileInput: {
        variant: 'outlined',
        density: 'comfortable',
      },
      VSwitch: {
        color: 'primary',
      },
      VCheckbox: {
        color: 'primary',
      },
      VRadio: {
        color: 'primary',
      },
    },

    // 表示設定
    display: {
      mobileBreakpoint: 'sm',
      thresholds: {
        xs: 0,
        sm: 600,
        md: 960,
        lg: 1280,
        xl: 1920,
        xxl: 2560,
      },
    },
  })

  // Nuxt アプリケーションにVuetifyを登録
  nuxtApp.vueApp.use(vuetify)
})
