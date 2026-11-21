# タスクリスト: apidoc ビューアを Scalar に置き換える

## 🚨 タスク完全完了の原則

このファイルのタスクがすべて `[x]` になるまで作業を続ける。スキップしてよいのは技術的な理由があるときだけで、その場合は理由を明記する。

---

## フェーズ1: 準備（CP1）

- [x] develop を最新にする（すでに最新だった。HEAD は 52a1e81）
- [x] `feature/apidoc-scalar` ブランチを切る
- [x] Stoplight 版のサイズを測って基準値にする（vite 8.3.8 でビルド：dist 2.2M、JS 2,038 kB / gzip 615 kB）
- [x] steering ファイルを作る

## フェーズ2: 実装（CP2）

- [x] 依存を入れ替える（`@stoplight/elements` を外して `@scalar/api-reference` を入れる）。package-lock.json もコミットする（a51f1f4、Scalar 1.82.1）
- [x] `src/main.ts` を Scalar 用に書き換える（e40aee3）
- [x] `vite.config.ts` から、Stoplight のために入れた `global` の define を外す（外してもビルドは通った）
- [x] Stoplight について書いた記述を更新する（4e57a11）
  - [x] `package.json` の description
  - [x] `README.md`（dev の URL の誤記も直す）
  - [x] `index.html` のコメント
  - [x] `.github/workflows/apidoc.yml` の冒頭コメント（追加で見つけた）
- [x] `npm run lint` が通る
- [x] `npm run build` が通り、サイズを記録する
  - dist 全体: 4.8M（112 ファイル）
  - JS: 合計 4,282 kB / gzip 1,296 kB
  - 初回表示で読み込む量: 約 4.0 MB / gzip 1,168 kB
  - Vue のフラグの警告は出なかった

## フェーズ3: 検証（CP3）

- [x] dev サーバーを Chrome で開いて確認する
  - [x] 4 つのエンドポイントがすべて表示される
  - [x] コンソールエラーが出ない（警告は出る：Vue の feature flags、Scalar 内部の Extraneous attrs。どちらも dev のときだけ）
  - [x] 自分のオリジン以外への通信が 0 件（36 件すべて 127.0.0.1:5173 宛て。フォントもシステムフォントになっている）
  - [x] Try it に `X-Requested-With` と Bearer の入力欄が出る（`X-Requested-With` は自動で入っていたので `onBeforeRequest` は不要。送信は localhost:33000 に直接出て、proxy は通らない）
- [x] preview（`/jwt-api/`）で表示できること、hash のディープリンクが効くことを確かめる
  - 通信 22 件はすべて同じオリジン宛て、コンソールエラー 0 件、`#tag/projects/...` を直接開くと該当箇所まで自動でスクロールする
  - 注意：`vite.config.ts` は `command === 'build'` で base を決めているが、preview も `command` は `'serve'` なので base が `/` になり、`/jwt-api/assets` が 404 になる。この問題は以前からある。今回は `--base /jwt-api/` を付けて確かめた
- [x] preview の base を直す（追加タスク、ユーザー承認済み。082c2a7）：`isPreview` のときも `/jwt-api/` を使う。オプションなしの preview で index と assets が 200 を返すこと、dev は `/` のまま 200 を返すことを確かめた
- [x] 判断材料をまとめる（サイズの差、Try it の実用度と CORS、外部通信）→ PR 本文に書く

## フェーズ4: PR（CP4）

- [ ] design-and-ship skill の手順に沿って PR を作る（base は develop）
- [x] 実装後の振り返りを書く

---

## 実装後の振り返り

### 実装完了日
2026-11-21

### 計画と実績の差分

**計画と異なった点**:
- `X-Requested-With` を付けるための `onBeforeRequest` は書かなかった。openapi.yaml の required と default の定義だけで、Try it に最初から入っていたため。
- `vite.config.ts` の `global` define は外せた。Vue の feature flags を `define` で設定することもしなかった。警告は dev のときだけで、build では出ないため。

**新たに必要になったタスク**:
- preview の base の修正。以前からある不具合で、README の記述と合わせるために直した。

### 学んだこと

**技術的な学び**:
- Scalar は既定のままで hash ルーティング、サイドバー、same-origin の fetch になる。外部との通信は、フォント・テレメトリ・Agent の 3 つを設定で止めれば 0 件になった（Network タブで確認）。
- 開発用のツールバー（`showDeveloperTools`）は、既定値の `'localhost'` のままならローカルで開いたときだけ表示される。
- `vite preview` の `command` は `'serve'` になる。base を分けたいときは `isPreview` で判定する。

**プロセス上の改善点**:
- サンドボックスでは次の 4 つが止められる。今回は該当するコマンドだけサンドボックスの外で実行した。
  - `~/.npm` への書き込み → `--cache $TMPDIR` で回避
  - `node_modules` 内の `.idea` / `.vscode` への書き込み
  - ポートの bind
  - SSH と GPG

### 次回への改善提案
- package-lock.json をコミットしたので、CI を `npm ci` に切り替える（別 PR）。
- Pages の Try it から API を呼べるようにするなら、Rails の CORS に `kaki-org.github.io` を許可するかどうかを、別途判断する。
- auth_token から /projects までを Try it で実際に通す確認は、まだできていない（ローカル API を起動できなかったため）。API を起動して確かめる。
