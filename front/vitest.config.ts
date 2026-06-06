import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // vue-i18n の t/n/d は DOM 不要のため node 環境で十分
    environment: 'node',
    include: ['test/**/*.test.ts'],
    setupFiles: ['test/setup.ts'],
  },
})
