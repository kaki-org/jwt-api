// Scalar API Reference をセルフホストでバンドルする（CDN 非依存）。
import { createApiReference } from '@scalar/api-reference';
import '@scalar/api-reference/style.css';

// openapi.yaml を Vite のアセットとして emit し、base を考慮した URL を得る。
// 正本は apidoc/openapi.yaml のまま保持できる。
import url from '../openapi.yaml?url';

createApiReference('#app', {
  url,
  // ルーティングは既定の hash ルーティング（GitHub Pages のサブパスでもリロード可能）。
  layout: 'modern',
  showSidebar: true,
  // Try it は既定の fetch（credentials: same-origin）で送る。トークンは保存しない。
  authentication: {
    preferredSecurityScheme: 'bearerAuth',
  },
  // 外部通信を止める: fonts.scalar.com のフォント、テレメトリ、AI Agent。
  // proxyUrl は指定しない（指定しなければ proxy.scalar.com を経由しない）。
  withDefaultFonts: false,
  telemetry: false,
  agent: { disabled: true },
});
