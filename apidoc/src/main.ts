// Stoplight Elements をセルフホストでバンドルする（CDN 非依存）。
// web-components バンドルを import すると <elements-api> カスタム要素が登録される。
import '@stoplight/elements/web-components.min.js';
import '@stoplight/elements/styles.min.css';

// openapi.yaml を Vite のアセットとして emit し、base を考慮した URL を得る。
// 正本は apidoc/openapi.yaml のまま保持できる。
import apiDescriptionUrl from '../openapi.yaml?url';

async function mount(): Promise<void> {
  await customElements.whenDefined('elements-api');
  const api = document.querySelector('elements-api');
  if (api) {
    api.setAttribute('apiDescriptionUrl', apiDescriptionUrl);
  }
}

void mount();
