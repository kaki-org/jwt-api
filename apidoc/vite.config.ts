import { defineConfig } from 'vite';

// GitHub Pages プロジェクトサイト（https://kaki-org.github.io/jwt-api/）配信のため
// build 時は base をリポジトリ名に合わせる。dev サーバーでは base を '/' にして
// ルート（http://localhost:5173/）でそのまま開けるようにする。
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/jwt-api/' : '/',
  define: {
    // Stoplight Elements の web-components バンドルは Node グローバル `global` を
    // 参照する。ブラウザでは未定義のため、補完しないと描画前に ReferenceError で
    // 空白ページになる。
    global: 'globalThis',
  },
}));
