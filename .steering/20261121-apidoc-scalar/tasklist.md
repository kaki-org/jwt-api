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

- [ ] 依存を入れ替える（`@stoplight/elements` を外して `@scalar/api-reference` を入れる）。package-lock.json もコミットする
- [ ] `src/main.ts` を Scalar 用に書き換える
- [ ] `vite.config.ts` から、Stoplight のために入れた `global` の define を外す
- [ ] Stoplight について書いた記述を更新する
  - [ ] `package.json` の description
  - [ ] `README.md`（dev の URL の誤記も直す）
  - [ ] `index.html` のコメント
- [ ] `npm run lint` が通る
- [ ] `npm run build` が通り、サイズを記録する

## フェーズ3: 検証（CP3）

- [ ] dev サーバーを Chrome で開いて確認する
  - [ ] 4 つのエンドポイントがすべて表示される
  - [ ] コンソールエラーが出ない
  - [ ] 自分のオリジン以外への通信が 0 件
  - [ ] Try it に `X-Requested-With` と Bearer の入力欄が出る
- [ ] preview（`/jwt-api/`）で表示できること、hash のディープリンクが効くことを確かめる
- [ ] 判断材料をまとめる（サイズの差、Try it の実用度と CORS、外部通信）

## フェーズ4: PR（CP4）

- [ ] design-and-ship skill の手順に沿って PR を作る（base は develop）
- [ ] 実装後の振り返りを書く

---

## 実装後の振り返り

（完了後に記入）
