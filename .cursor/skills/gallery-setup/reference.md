# Gallery Setup — reference

fork から GitHub Pages 公開までのチェックリスト。

## フロー概要

```
GitHub fork
    → リポ名 {user}.github.io にリネーム（User Pages）
    → clone · @gallery-setup
    → gallery.json meta 更新 · npm run build
    → Settings → Pages → GitHub Actions
    → push main → Actions 成功 → 公開 URL 確認
```

## GitHub（ブラウザ）

| # | 作業 | リンク |
|---|------|--------|
| 1 | テンプレ fork | [github.com/YUzushio/yuzushio.github.io/fork](https://github.com/YUzushio/yuzushio.github.io/fork) |
| 2 | リポ名リネーム | fork 先 **Settings → General → Repository name** → `{user}.github.io` |
| 3 | Pages 有効化 | **Settings → Pages → Build and deployment → GitHub Actions** |
| 4 | 初回 deploy 確認 | **Actions** → `Deploy Gallery to GitHub Pages` |

## ローカル（clone 後）

| # | 作業 | コマンド |
|---|------|----------|
| 1 | セットアップ | `node .cursor/skills/gallery-setup/scripts/setup.mjs` |
| 2 | 開発プレビュー | `npm run dev` |
| 3 | ビルド確認 | `npm run build` |
| 4 | 初回 push | `git push -u origin main` |

## Pages 方式と設定

| 方式 | 公開 URL | リポ名 | `vite.config.ts` `base` | `meta.siteUrl` |
|------|----------|--------|-------------------------|----------------|
| **User Pages（推奨）** | `https://{user}.github.io/` | `{user}.github.io` | `'/'` | `https://{user}.github.io/` |
| **Project Pages** | `https://{user}.github.io/{repo}/` | 任意 | `'/{repo}/'` | 同上 |

## よくあるつまずき

| 症状 | 原因 | 対処 |
|------|------|------|
| 404 / 真っ白 | fork 名 `yuzushio.github.io` のまま User Pages 期待 | リポを `{user}.github.io` にリネーム |
| アセット 404 | Project Pages なのに `base: '/'` | `base: '/{repo}/'` に変更 |
| Actions が走らない | Pages Source が未設定 | Settings → Pages → GitHub Actions |
| ビルド失敗 | 依存未インストール | `npm install` → `npm run build` |

## 公式ドキュメント

- [GitHub Pages とは](https://docs.github.com/ja/pages/getting-started-with-github-pages/about-github-pages)
- [User / Project Pages](https://docs.github.com/ja/pages/getting-started-with-github-pages/about-github-pages#types-of-github-pages-sites)
- [GitHub Actions で公開](https://docs.github.com/ja/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site#publishing-with-a-custom-github-actions-workflow)

## 関連 Skill

- `@gallery-content` — `items[]` · サムネ · 4 ビュー
- `@gallery-vault-receiver` — [my-atelier-vault](https://github.com/YUzushio/my-atelier-vault) から取り込み
