import { defineConfig } from 'vite';

// GitHub Pages プロジェクトサイト（https://kaki-org.github.io/jwt-api/）配信のため
// build 時は base をリポジトリ名に合わせる。dev サーバーでは base を '/' にして
// ルート（http://localhost:5173/）でそのまま開けるようにする。
// vite preview は command が 'serve' になるため、isPreview でも build と同じ base にする。
export default defineConfig(({ command, isPreview }) => ({
  base: command === 'build' || isPreview ? '/jwt-api/' : '/',
}));
