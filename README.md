# YUzushio Gallery

**日本語** · [English (README.en.md)](README.en.md)

Open コンテンツ・制作・実績を並べる **React SPA ポートフォリオ**です。  
**中身は JSON と画像だけ** — UI は fork したまま差し替え可能です。

- **公開例:** https://yuzushio.github.io/
- **コンテンツ正本:** [`public/data/gallery.json`](public/data/gallery.json)

## `{user}.github.io` なら、サーバー不要で無料公開

このテンプレは **[GitHub Pages](https://pages.github.com/)** 向けです。  
**VPS やレンタルサーバーを契約せず**、GitHub リポジトリに push するだけでポートフォリオを公開できます。

| ポイント | 内容 |
|---------|------|
| **コスト** | public リポの Pages は **無料**（[GitHub Free プラン](https://github.com/pricing) で利用可） |
| **運用** | サーバー構築 · 常時監視 · OS 更新は不要 — **Git push がデプロイ** |
| **URL** | `{GitHubユーザー名}.github.io` がそのまま公開アドレス |
| **HTTPS** | 標準で有効 |
| **独自ドomain** | 任意で設定可能（例: `portfolio.example.com`） |

fork → リネーム → `gallery.json` 編集 → push だけで、あなた専用の Gallery が立ち上がります。

**もっと詳しく（GitHub 公式）**

- [GitHub Pages とは](https://docs.github.com/ja/pages/getting-started-with-github-pages/about-github-pages)
- [GitHub Pages サイトの作成](https://docs.github.com/ja/pages/getting-started-with-github-pages/creating-a-github-pages-site)
- [User Pages と Project Pages の違い](https://docs.github.com/ja/pages/getting-started-with-github-pages/about-github-pages#types-of-github-pages-sites)
- [カスタムドメインの設定](https://docs.github.com/ja/pages/configuring-a-custom-domain-for-your-github-pages-site/about-custom-domains-and-github-pages)
- [GitHub Actions で Pages を公開](https://docs.github.com/ja/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site#publishing-with-a-custom-github-actions-workflow)（このリポは Actions ビルド）

---

## はじめて使う（HowTo）

### 1. リポジトリを用意する

GitHub Pages には **User Pages** と **Project Pages** があります。このテンプレは **User Pages**（`https://{ユーザー名}.github.io/`）想定です。

| 方式 | 公開 URL の例 | リポジトリ名 |
|------|--------------|-------------|
| **User Pages（推奨）** | `https://your-name.github.io/` | **`your-name.github.io`**（ユーザー名と一致必須） |
| **Project Pages** | `https://your-name.github.io/gallery/` | 任意（例: `gallery`）· `vite.config.ts` の `base` 変更が必要 |

> **重要:** [fork](https://github.com/YUzushio/yuzushio.github.io/fork) 直後は `your-name/yuzushio.github.io` という名前のままです。  
> **`https://your-name.github.io/` で公開したいなら、リポジトリ名を `your-name.github.io` に変更する**（または最初からその名前でリポを作る）必要があります。

**A. Fork する（おすすめ）**

1. [YUzushio/yuzushio.github.io](https://github.com/YUzushio/yuzushio.github.io) を [GitHub で fork](https://github.com/YUzushio/yuzushio.github.io/fork)
2. fork 先リポの **Settings → General → Repository name** を **`{あなたのGitHubユーザー名}.github.io`** にリネーム  
   （例: ユーザー `tanaka` → リポ名 `tanaka.github.io`）
3. clone（`<your-account>` は自分の GitHub ユーザー名）:

```bash
git clone https://github.com/<your-account>/<your-account>.github.io.git
cd <your-account>.github.io
```

4. 作業ブランチを切って編集

**B. テンプレートだけ使う**

1. GitHub で **`{ユーザー名}.github.io`** という名前の **空リポジトリ** を新規作成（Add README はオフで OK）
2. テンプレを clone して remote を差し替え:

```bash
git clone https://github.com/YUzushio/yuzushio.github.io.git gallery-template
cd gallery-template
git remote set-url origin https://github.com/<your-account>/<your-account>.github.io.git
git push -u origin main
```

**C. Project Pages で公開する場合（任意）**

- リポ名は任意（fork 名 `yuzushio.github.io` のままでも可）
- `vite.config.ts` の `base: '/'` を `base: '/{repo-name}/'` に変更
- `gallery.json` の `meta.siteUrl` も `https://{user}.github.io/{repo-name}/` に合わせる

### 2. サイト情報を自分用に変える

[`public/data/gallery.json`](public/data/gallery.json) の `meta` を編集します。

```json
{
  "meta": {
    "title": "あなたの Gallery",
    "author": "Your Name",
    "description": "ポートフォリオの説明",
    "siteUrl": "https://your-name.github.io/"
  }
}
```

### 3. パネル（作品・SNS）を追加する

`items[]` にオブジェクトを追加します。最小例:

```json
{
  "id": "my-project",
  "slug": "my-project",
  "title": "My Project",
  "summary": "一行説明",
  "kind": "work",
  "category": "project",
  "genres": ["web"],
  "year": 2024,
  "site": "https://example.com",
  "tags": ["Web"]
}
```

| フィールド | 意味 |
|------------|------|
| `kind: "hub"` | SNS アカウントなど**入口**（Feed 非表示がデフォルト） |
| `kind: "work"` | **個別コンテンツ**（Feed / Timeline / Category に載る） |
| `category` | `sns` / `project` / `doujinshi`（Category ビューのセクション） |
| `genres` | Drill ビューのジャンル（`gallery.json` 先頭の `genres[]` から選ぶ） |
| `year` / `publishedAt` | Timeline 表示に必要（`work` のみ） |
| `parentId` | 親 hub の `id`（例: YouTube 配下の動画 → `yuzshio-youtube`） |

詳細スキーマは下記 [Item スキーマ](#item-スキーマ) と [`.cursor/skills/gallery-content/reference.md`](.cursor/skills/gallery-content/reference.md) を参照。

### 4. サムネイルを置く

| 方法 | いつ使う |
|------|----------|
| **自動** | YouTube / GitHub URL のみ → ビルド時に OG または `hqdefault` |
| **`npm run resolve:sns-avatars`** | YouTube / X / Pixiv / note / SoundCloud プロフィール & SoundCloud 楽曲 |
| **手動** | `public/assets/thumbnails/` に画像を置き、`"thumbnail": "/assets/thumbnails/..."` を指定 |

ジャンル SVG プレースホルダー: [`public/assets/placeholders/`](public/assets/placeholders/)

### 5. ローカルで確認

```bash
npm install
npm run dev
```

ブラウザで Feed / Drill / Timeline / Category を確認します。

### 6. 公開（GitHub Pages）

1. `main` へ push
2. リポジトリ **Settings → Pages → Build and deployment → GitHub Actions** を有効化
3. Actions の `build` が成功すれば公開

**User Pages**（§1 でリポ名を `{ユーザー名}.github.io` にした場合）:

- 公開 URL: `https://{ユーザー名}.github.io/`
- `vite.config.ts` の `base: '/'` のままで OK
- `gallery.json` の `meta.siteUrl` も同じ URL に

**Project Pages** の場合は §1 の C を参照（`base` と `siteUrl` を `/repo-name/` 付きに）。

### よくある構成

```
SNS hub（kind: hub, showInFeed: false）
  └─ 個別 work（parentId で紐付け）
       例: SoundCloud チャンネル → 各楽曲
       例: X アカウント → ファンアート投稿
```

---

## AI エージェントでコンテンツを整理する

### Skill 一覧（このリポジトリ）

| Skill | 役割 |
|-------|------|
| [`gallery-content`](.cursor/skills/gallery-content/SKILL.md) | **Gallery 単体** — `gallery.json` / サムネ / 4 ビュー |
| [`gallery-vault-receiver`](.cursor/skills/gallery-vault-receiver/SKILL.md) | **Vault → Gallery 受信** — Wiki から JSON へマージ・ビルド |

Vault 側（送信）: [my-atelier-vault](https://github.com/YUzushio/my-atelier-vault) の `gallery-vault-sender` skill

### Vault を先に作ってから Gallery へ載せる

```
1. [my-atelier-vault] @gallery-vault-sender
      Backroom/{slug}/_index.md  … gallery: true, frontmatter, Gallery 掲載表

2. [gallery] @gallery-vault-receiver
      gallery.json マージ, サムネコピー, npm run build
```

**Receiver は必要？** — `export-from-vault.mjs` だけでは `kind` / 子パネル / サムネが足りないため、受信専用 Skill があると安全。Gallery だけ触るときは `@gallery-content` で十分。

### 使い方（Cursor）

1. Vault リポまたは gallery リポを Cursor で開く（両方 sibling なら同じウィンドウでも可）
2. 例:

   > `@gallery-vault-sender` 新プロジェクト foo を Backroom に作って Gallery 用に整えて  
   > `@gallery-vault-receiver` Backroom の foo を gallery.json に反映して

3. 日常の追加・修正（Vault 経由しない）:

   > `@gallery-content` この URL を Gallery に追加して

fork 時は `.cursor/skills/` ごと渡ります。

### Skill の場所

```
.cursor/skills/
├── gallery-content/           … Gallery 正本の編集
└── gallery-vault-receiver/    … Wiki からの取り込み
```

詳細: 各 Skill 内の `reference.md`

---

## アプリの仕組み（概要）

```
gallery.json  ──→  useGalleryData()  ──→  4 Views
                      │
                      ├─ FeedView      … work を新着順
                      ├─ DrillView     … genre で絞り込み
                      ├─ TimelineView  … year ごと
                      └─ CategoryView  … category ごと（hub + work）

各パネル: ContentPanel → resolveThumbnail(item, allItems)
モーダル: PanelModal → primaryLink(item)
```

| View | 説明 |
|------|------|
| **Feed** | 個別コンテンツを新着順 |
| **Drill** | ジャンル → モーダル内サブパネル |
| **Timeline** | 年代ごとセクション |
| **Category** | カテゴリごとセクション |

技術スタック: React 19 + Vite + TypeScript + HashRouter + react-masonry-css

---

## Development

```bash
npm install
npm run dev
```

ビルド:

```bash
npm run build
npm run preview
```

---

## Deploy (GitHub Pages)

§1 でリポジトリ名を `{ユーザー名}.github.io` にしておけば、§6 の手順で User Pages として公開できます。  
初回は **Settings → Pages → GitHub Actions** の有効化を忘れずに。

---

## Item スキーマ

```json
{
  "id": "unique-id",
  "slug": "url-slug",
  "title": "表示タイトル",
  "summary": "短い説明",
  "kind": "work | hub",
  "category": "sns | project | doujinshi",
  "genres": ["music", "web"],
  "year": 2024,
  "publishedAt": "2024-12-14",
  "youtube": "https://www.youtube.com/watch?v=...",
  "github": "owner/repo",
  "site": "https://example.com",
  "url": "https://...",
  "thumbnail": "/assets/thumbnails/custom.png",
  "parentId": "optional-hub-id",
  "showInFeed": true,
  "tags": ["tag1", "tag2"]
}
```

- `kind: "hub"` — SNS チャンネル等（Feed 非表示がデフォルト）
- `kind: "work"` — 個別成果
- サムネ解決順: `thumbnail` → YouTube → GitHub OG → 親 hub → ジャンル SVG

---

## SNS / SoundCloud メタデータ自動取得

プロフィール URL または SoundCloud **楽曲** URL を持つ item は、ビルド前スクリプトでサムネ・投稿日を取得します。

```bash
npm run resolve:sns-avatars
npm run resolve:sns-avatars -- --force   # 既存も再取得
```

| 対象 | 取得内容 |
|------|----------|
| YouTube / X / Pixiv / note / VRoid Hub プロフィール | アイコン → `thumbnails/sns/` |
| SoundCloud **楽曲** | アートワーク or チャンネル画像、`publishedAt` / `year` |
| SoundCloud プロフィール | チャンネルアイコン |

`npm run build` の `prebuild` でも自動実行されます。

---

## Optional: Obsidian Vault から下書き export

ローカルに [my-atelier-vault](https://github.com/YUzushio/my-atelier-vault)（[fork](https://github.com/YUzushio/my-atelier-vault/fork)）を sibling に clone している場合:

1. Vault 側: `@gallery-vault-sender` で `Backroom/{slug}/` を整備（`gallery: true`）
2. Gallery 側: `@gallery-vault-receiver` で `gallery.json` にマージ

下書きのみ欲しい場合:

```bash
node scripts/export-from-vault.mjs > public/data/gallery.draft.json
```

出力は **不完全**（`kind` / 子パネル / サムネなし）。本番反映は receiver Skill 手順で。

---

## Related

- [gallery-content](.cursor/skills/gallery-content/SKILL.md) — Gallery 単体編集
- [gallery-vault-receiver](.cursor/skills/gallery-vault-receiver/SKILL.md) — Vault から取り込み
- [my-atelier-vault](https://github.com/YUzushio/my-atelier-vault)（[fork](https://github.com/YUzushio/my-atelier-vault/fork)）— Obsidian Wiki テンプレ（任意）· [`gallery-vault-sender`](https://github.com/YUzushio/my-atelier-vault/blob/main/.cursor/skills/gallery-vault-sender/SKILL.md)
