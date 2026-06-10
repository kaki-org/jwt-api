import { defineConfig } from 'vite';

// GitHub Pages プロジェクトサイト（https://kaki-org.github.io/jwt-api/）配信のため
// base をリポジトリ名に合わせる。
export default defineConfig({
  base: '/jwt-api/',
  define: {
    // Stoplight Elements の web-components バンドルは Node グローバル `global` を
    // 参照する。ブラウザでは未定義のため、補完しないと描画前に ReferenceError で
    // 空白ページになる。
    global: 'globalThis',
  },
});
