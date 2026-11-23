// Scalar API Reference をセルフホストでバンドルする（CDN 非依存）。
import { createApiReference } from '@scalar/api-reference';
import '@scalar/api-reference/style.css';

// openapi.yaml を Vite のアセットとして emit し、base を考慮した URL を得る。
// 正本は apidoc/openapi.yaml のまま保持できる。
import url from '../openapi.yaml?url';

// Scalar 標準のテーマ切替は Developer Tools ツールバーの中にあり、ツールバーは既定で
// localhost でしか出ない。ツールバーには Share（仕様を Scalar のサーバーへアップロード）
// や Deploy もあり外部通信を止める方針に反するため、Pages では出さずテーマ切替だけを自前で置く。
// ID は @scalar/themes の themeIds / themeLabels に合わせる（'none' は除外）。
const THEMES = {
  default: 'Default',
  alternate: 'Alternate',
  moon: 'Moon',
  purple: 'Purple',
  solarized: 'Solarized',
  bluePlanet: 'Blue Planet',
  deepSpace: 'Deep Space',
  saturn: 'Saturn',
  kepler: 'Kepler-11e',
  mars: 'Mars',
  laserwave: 'Laserwave',
  elysiajs: 'Elysia.js',
  fastify: 'Fastify',
  halloween: 'Halloween',
} as const;
type ThemeId = keyof typeof THEMES;

const STORAGE_KEY = 'jwt-api-apidoc-theme';
const isThemeId = (value: unknown): value is ThemeId =>
  typeof value === 'string' && Object.hasOwn(THEMES, value);

// 選んだテーマはこのブラウザにだけ保存する。プライベートモード等で使えなくても既定で表示する。
const loadTheme = (): ThemeId => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return isThemeId(saved) ? saved : 'default';
  } catch {
    return 'default';
  }
};
const saveTheme = (theme: ThemeId) => {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // 保存できなくても切替自体は効く。
  }
};

const reference = createApiReference('#app', {
  url,
  theme: loadTheme(),
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

const select = document.querySelector<HTMLSelectElement>('#theme-select');
if (select) {
  for (const [id, label] of Object.entries(THEMES)) {
    select.add(new Option(label, id));
  }
  select.value = loadTheme();
  select.addEventListener('change', () => {
    if (!isThemeId(select.value)) return;
    saveTheme(select.value);
    // updateConfiguration は設定を丸ごと置き換えるので、現在の設定に theme だけ重ねる。
    reference.updateConfiguration({ ...reference.getConfiguration(), theme: select.value });
  });
}
