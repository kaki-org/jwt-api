export default defineNuxtConfig({
  // Compatibility date for Nuxt 4.x
  compatibilityDate: '2025-08-09',

  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Global page headers: Nuxt 4.x app.head format
  app: {
    head: {
      title: 'app',
      htmlAttrs: {
        lang: 'en',
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: '' },
        { name: 'format-detection', content: 'telephone=no' },
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    },
  },

  // Global middleware - Nuxt 4.x format
  // Note: Global middleware should be defined in middleware/ directory with .global.ts suffix
  // or configured in app.vue or layouts

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['~/assets/sass/main.scss'],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  // plugins: [
  //   'plugins/auth',
  //   'plugins/axios',
  //   'plugins/my-inject',
  //   'plugins/nuxt-client-init',
  // ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules: buildModules統合 - Nuxt 4.x format
  modules: [
    // Note: All modules will be configured in later tasks for Nuxt 4.x compatibility
    // '@nuxtjs/eslint-module',
    // '@nuxtjs/i18n',
    // '@nuxtjs/vuetify',
  ],

  runtimeConfig: {
    public: {
      appName: process.env.APP_NAME,
    },
  },

  // Nitro configuration - Nuxt 4.x format
  nitro: {
    // Server handlers for SSL redirect
    handlers: [
      {
        route: '/**',
        handler: '~/server/redirect-ssl.js',
      },
    ],
    // Development proxy - Nuxt 4.x format
    devProxy: {
      '/api': {
        target: process.env.API_URL || 'http://localhost:33000',
        changeOrigin: true,
      },
    },
  },

  // Vuetify configuration - Nuxt 4.x format
  // Note: Vuetify configuration will be handled in a separate plugin for Nuxt 4.x compatibility
  // vuetify: {
  //   // 開発環境でcustomVariablesを有効にするフラグ
  //   // Doc: https://vuetifyjs.com/ja/customization/a-la-carte/
  //   // Doc: https://vuetifyjs.com/ja/features/sass-variables/#nuxt-3067306e30a430f330b930c830fc30eb
  //   treeShake: true,
  //   customVariables: ['~/assets/sass/variables.scss'],
  //   theme: {
  //     themes: {
  //       light: {
  //         primary: '4080BE',
  //         info: '4FC1E9',
  //         success: '44D69E',
  //         warning: 'FEB65E',
  //         error: 'FB8678',
  //         background: 'f6f6f4',
  //         appblue: '#1867C0',
  //       },
  //     },
  //   },
  // },

  // i18n configuration - Nuxt 4.x format
  // Note: i18n configuration will be handled in a later task
  // Doc: https://nuxt-community.github.io/nuxt-i18n/basic-usage.html#nuxt-link
  // i18n: {
  //   locales: ['ja', 'en'],
  //   defaultLocale: 'ja',
  //   // ルート名に__jaを追加しない
  //   strategy: 'no_prefix',
  //   // Doc: https://kazupon.github.io/vue-i18n/api/#properties
  //   vueI18n: {
  //     // 翻訳対象のキーがない場合に参照される言語
  //     // 'login': 'ログイン'(ja)
  //     // 'login': 'login'(en)
  //     fallbackLocale: 'en',
  //     // true => i18nの警告を完全に表示しない(default: false)
  //     // silentTranslationWarn: true,
  //     // フォールバック時に警告を発生させる(default: false)
  //     // true => 警告を発生させない(翻訳のキーが存在しない場合のみ警告)
  //     silentFallbackWarn: true,
  //     // 翻訳データ
  //     messages: {
  //       ja: require('./locales/ja.json'),
  //       en: require('./locales/en.json'),
  //     },
  //   },
  // },

  // Build Configuration: Nuxt 4.x uses Vite by default
  // No need for webpack extend configuration
});
