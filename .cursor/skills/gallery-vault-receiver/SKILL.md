---
name: gallery-vault-receiver
description: >-
  Imports my-atelier-vault Backroom gallery: true notes into public/data/gallery.json,
  copies wiki assets to thumbnails, and runs build. Use after vault sender prep,
  when syncing wiki to Gallery, merging export-from-vault draft, or when the user
  says Vault to Gallery, receive from wiki, or update gallery from Backroom.
---

# Gallery Vault Receiver

Gallery リポジトリの **受信側**。Vault で整えたメタを `gallery.json` に反映する。

**Receiver は必要か？** — はい。`export-from-vault.mjs` はフィールドが不足しており、子パネル・`kind`・サムネコピー・`npm run build` までを一連で行うのがこの Skill の役割。Gallery 単体の日々の修正は `@gallery-content`。

## 前提

- Vault: `../my-atelier-vault/Backroom/`（[公開テンプレ](https://github.com/YUzushio/my-atelier-vault) を sibling に clone した場合）
- Gallery: このリポジトリ root
- Sender 側で `gallery: true` と `_index.md` が用意済み
- Vault 側 taxonomy は `visibility: open/private/closed`（`closed` は終了）

## 受信手順

### 1. 対象を特定

- ユーザー指定の `{slug}` 一覧、または
- `gallery: true` の全 `_index.md`（大規模同期時）

### 2. Vault を読む

各 `Backroom/{slug}/_index.md`:

1. YAML frontmatter
2. 先頭段落 → `summary`
3. `## Gallery 掲載` 表 → 子 `work` items
4. `assets/*` → サムネ候補

Optional:

```bash
node scripts/export-from-vault.mjs > public/data/gallery.draft.json
```

draft はヒント。必ず手動マージ品質で `gallery.json` を更新。

### 3. `gallery.json` にマージ

- 既存 `id` があれば更新、なければ `items[]` に追加
- **必須**: `id`, `slug`, `title`, `summary`, `kind`, `category`, `genres`
- Timeline 対象の `work` には `year` または `publishedAt`
- hub 子は `parentId`（親 hub が先に存在すること）

フィールド対応: [reference.md](reference.md)

### 4. サムネイル

| ソース | 置き先 |
|--------|--------|
| `Backroom/{slug}/assets/cover.png` 等 | `public/assets/thumbnails/{slug}.png` |
| SNS / SoundCloud URL | `npm run resolve:sns-avatars` |
| X ファンアート URL | `public/assets/thumbnails/x/` + 手動 DL（`gallery-content` 参照） |

### 5. 検証

```bash
npm run build
npm run preview
```

Feed / Timeline / Category / Drill を目視。重複 `id` がないこと。

### 6. Vault へフィードバック（任意）

Gallery 掲載表・TODO を `Backroom/{slug}/_index.md` に追記（sender と整合）。

## 推論ルール（export に無い項目）

| 手がかり | 決定 |
|----------|------|
| `platform: YouTube` + チャンネル URL | `kind: hub`, `category: sns`, `showInFeed: false` |
| 単一作品・動画・記事 URL | `kind: work` |
| `tags` に `技術書典` / doujin | `category: doujinshi`, `genres: ["doujin"]` |
| コミュニティ・Web アプリ | `category: project`, `genres: ["web"]` 等 |
| Gallery 掲載表の行 | `work` + `parentId` |

新しい `genre` id は勝手に増やさない。必要なら `gallery.json` 先頭 `genres[]` を先に追加。

## やらないこと

- Vault の `visibility`（open/private/closed）を理由に Gallery から除外しない（`gallery: true` が優先）
- 秘密情報を `gallery.json` に書かない
- sender 未整備の slug を推測だけで大量追加しない（summary / URL を確認）

## 関連 Skill

- 日常の JSON 編集: [gallery-content/SKILL.md](../gallery-content/SKILL.md)
- Vault 側準備: [my-atelier-vault · gallery-vault-sender](https://github.com/YUzushio/my-atelier-vault/blob/main/.cursor/skills/gallery-vault-sender/SKILL.md)

## 参照

- [reference.md](reference.md) — フィールド対応・パス
