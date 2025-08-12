export default defineNuxtConfig({
  // Compatibility date for Nuxt 4.x
  compatibilityDate: "2025-08-09",

  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Global page headers: Nuxt 4.x app.head format
  app: {
    head: {
      title: "app",
      htmlAttrs: {
        lang: "en",
      },
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "description", content: "" },
        { name: "format-detection", content: "telephone=no" },
      ],
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    },
  },

  // Global middleware - Nuxt 4.x format
  // Note: Global middleware should be defined in middleware/ directory with .global.ts suffix
  // or configured in app.vue or layouts

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    "~/assets/sass/main.scss",
    "~/assets/sass/vuetify.scss",
    "vuetify/lib/styles/main.sass"
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  // Note: Plugins are now auto-imported from plugins/ directory in Nuxt 4.x
  // plugins: [
  //   'plugins/auth',
  //   'plugins/my-inject',
  //   'plugins/nuxt-client-init',
  // ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules: buildModules統合 - Nuxt 4.x format
  modules: [
    // ESLint module for Nuxt 4.x
    "@nuxt/eslint",
    // Pinia for state management - Nuxt 4.x format
    "@pinia/nuxt",
    // i18n module for Nuxt 4.x (temporarily disabled for Vuetify testing)
    // "@nuxtjs/i18n",
    // Note: Other modules will be configured in later tasks for Nuxt 4.x compatibility
    // '@nuxtjs/vuetify',
  ],

  runtimeConfig: {
    public: {
      appName: process.env.APP_NAME,
      apiUrl: process.env.API_URL || '/api',
    },
  },

  // Nitro configuration - Nuxt 4.x format
  nitro: {
    // Server handlers for SSL redirect
    handlers: [
      {
        route: "/**",
        handler: "~/server/redirect-ssl.js",
      },
    ],
    // Development proxy - Nuxt 4.x format
    devProxy: {
      "/api": {
        target: process.env.API_URL || "http://localhost:33000",
        changeOrigin: true,
      },
    },
  },

  // Vuetify configuration - Nuxt 4.x format
  // Note: Vuetify 3.x is configured via plugin for better Nuxt 4.x compatibility
  // The configuration is handled in plugins/vuetify.client.ts

  // Vite configuration for Vuetify
  vite: {
    define: {
      'process.env.DEBUG': false,
    },
    css: {
      preprocessorOptions: {
        sass: {
          additionalData: `
            @import "~/assets/sass/variables.scss"
          `,
        },
      },
    },
    ssr: {
      noExternal: ['vuetify'],
    },
  },

  // i18n configuration - Nuxt 4.x format (temporarily disabled for Vuetify testing)
  // Doc: https://i18n.nuxtjs.org/docs/getting-started
  // i18n: {
  //   // 対応言語の設定
  //   locales: [
  //     {
  //       code: 'ja',
  //       name: '日本語',
  //       file: 'ja.json'
  //     },
  //     {
  //       code: 'en',
  //       name: 'English',
  //       file: 'en.json'
  //     }
  //   ],
  //   // デフォルト言語
  //   defaultLocale: 'ja',
  //   // ルーティング戦略（ルート名に言語コードを追加しない）
  //   strategy: 'no_prefix',
  //   // 翻訳ファイルの配置ディレクトリ
  //   langDir: 'locales/',
  //   // 遅延読み込みを有効にする（パフォーマンス向上）
  //   lazy: true,
  //   // Vue I18n設定
  //   vueI18n: './i18n.config.ts'
  // },

  // TypeScript configuration - Nuxt 4.x format
  typescript: {
    // 型チェックを有効にする
    typeCheck: true,
    // 厳格な型チェック
    strict: true,
    // 型定義の自動生成を有効にする
    includeWorkspace: true,
  },

  // Build Configuration: Nuxt 4.x uses Vite by default
  // No need for webpack extend configuration
});
