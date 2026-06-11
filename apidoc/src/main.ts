// Stoplight Elements をセルフホストでバンドルする（CDN 非依存）。
// web-components バンドルを import すると <elements-api> カスタム要素が登録される。
import '@stoplight/elements/web-components.min.js';
import '@stoplight/elements/styles.min.css';

// openapi.yaml を Vite のアセットとして emit し、base を考慮した URL を得る。
// 正本は apidoc/openapi.yaml のまま保持できる。
import apiDescriptionUrl from '../openapi.yaml?url';

// <elements-api> は DOM へ追加する前に全属性（特に apiDescriptionUrl）を確定させる。
// マウント後に setAttribute すると Stoplight Elements が loading のまま固定されて
// 空白ページになるため、属性をそろえてから appendChild する。
const api = document.createElement('elements-api');
api.setAttribute('apiDescriptionUrl', apiDescriptionUrl);
api.setAttribute('router', 'hash');
api.setAttribute('layout', 'sidebar');
api.setAttribute('tryItCredentialsPolicy', 'same-origin');

document.getElementById('app')?.appendChild(api);
