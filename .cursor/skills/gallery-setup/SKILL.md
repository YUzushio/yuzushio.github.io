---
name: gallery-setup
description: >-
  First-time setup for YUzushio Gallery after fork or clone — rename repo for
  User Pages, customize gallery.json meta, vite base, npm build, and GitHub Pages
  deploy checklist. Use when the user says setup, セットアップ, fork した,
  gallery を公開, github.io デプロイ, or @gallery-setup.
---

# Gallery Setup

fork / clone 直後に **Gallery** を自分用に初期化し、**GitHub Pages 公開まで**の作業を案内する。

## いつ使うか

- [YUzushio/yuzushio.github.io](https://github.com/YUzushio/yuzushio.github.io) を fork して clone した直後
- `gallery.json` の `meta` がまだテンプレ（YUzushio）のまま
- User Pages 用にリポジトリ名 `{ユーザー名}.github.io` へのリネームが必要か確認したい
- 初回 `npm install` · ビルド · push 前のチェックリストが欲しい

## 手順

### 0. GitHub（fork 直後 · ブラウザ）

User Pages（`https://{user}.github.io/`）なら **リポ名 = `{user}.github.io`** が必須。

1. [fork](https://github.com/YUzushio/yuzushio.github.io/fork)
2. fork 先 **Settings → General → Repository name** → `{GitHubユーザー名}.github.io` にリネーム
3. clone して **このフォルダ（Cloneしたフォルダ）** を Cursor で開く

詳細: [reference.md](reference.md) · README §1

### 1. 対話セットアップ（推奨）

```bash
node .cursor/skills/gallery-setup/scripts/setup.mjs
```

- `public/data/gallery.json` の `meta` を更新
- Project Pages なら `vite.config.ts` の `base` を更新
- `git remote` とリポ名の整合を警告
- 任意で `npm install` · `npm run build`

### 2. 非対話（CI / エージェント）

```bash
node .cursor/skills/gallery-setup/scripts/setup.mjs --non-interactive \
  --user "your-github-user" \
  --title "Your Gallery" \
  --author "Your Name" \
  --description "Portfolio description" \
  --pages user
```

Project Pages:

```bash
node .cursor/skills/gallery-setup/scripts/setup.mjs --non-interactive \
  --user "your-github-user" \
  --title "Your Gallery" \
  --author "Your Name" \
  --description "Portfolio description" \
  --pages project \
  --repo-name "gallery"
```

### 3. GitHub Pages を有効化（ブラウザ · 初回のみ）

1. リポ **Settings → Pages → Build and deployment → Source: GitHub Actions**
2. `main` へ push
3. **Actions** タブで `Deploy Gallery to GitHub Pages` が成功するまで待つ
4. `meta.siteUrl` をブラウザで開いて確認

### 4. コンテンツ編集（公開後）

- パネル追加 · 修正: `@gallery-content`
- Wiki 連携: [my-atelier-vault](https://github.com/YUzushio/my-atelier-vault) の `@gallery-vault-sender` → このリポの `@gallery-vault-receiver`

## エージェント向けチェック

1. fork 後リポ名が `{user}.github.io` か（User Pages の場合）
2. `meta.siteUrl` と `vite.config.ts` `base` が Pages 方式と一致するか
3. `npm run build` が通るか
4. Pages の Source が GitHub Actions か（README / reference 参照）

## やらないこと

- ユーザー未確認で `gallery.json` の `items[]` を大量削除する
- 秘密情報を `gallery.json` に書く
- User Pages なのにリポ名リネームをスキップして「そのまま push すれば公開できる」と言う

## 参照

- [reference.md](reference.md) — fork → deploy チェックリスト · 公式リンク
- `@gallery-content` — 公開後の JSON 編集
- `@gallery-vault-receiver` — Vault からの取り込み
