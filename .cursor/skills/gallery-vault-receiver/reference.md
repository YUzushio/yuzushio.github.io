# Gallery Vault Receiver — reference

Sender ドキュメントと同一の対応表（receiver 作業用）。

## Frontmatter → gallery.json item

| Vault (`Backroom/{slug}/_index.md`) | Gallery field |
|-------------------------------------|---------------|
| フォルダ `{slug}` | `id`, `slug` |
| `project` | `title` |
| 本文リード | `summary` |
| `year` | `year` |
| `publishedAt` | `publishedAt` |
| `url` / `site` / `youtube` / `github` | 同名 |
| `tags` | `tags` |
| 推論 | `kind`, `category`, `genres` |
| 親 hub の id | 子の `parentId` |

## `## Gallery 掲載` 表

| 列 | Gallery |
|----|---------|
| タイトル | `title` |
| 投稿日 | `publishedAt`, `year` |
| URL | `url` |
| メモ | `summary` 補足 / `tags` |

子 item の `id` 例: `sc-{track}`, `x-fanart-{topic}-{year}`

## サムネパス

| 種別 | パス |
|------|------|
| プロジェクト表紙 | `/assets/thumbnails/{slug}.png` |
| SNS 自動 | `/assets/thumbnails/sns/{slug}.jpg` |
| SoundCloud 曲 | `/assets/thumbnails/soundcloud/` or 親フォールバック |
| X ファンアート | `/assets/thumbnails/x/fanart-*.jpg` |

## スクリプト

```bash
# 下書き export（マージ用）
node scripts/export-from-vault.mjs > public/data/gallery.draft.json

# SNS / SoundCloud メタ
npm run resolve:sns-avatars

# 検証
npm run build
```

## 双 Skill フロー

```
[Vault] @gallery-vault-sender
   Backroom/{slug}/_index.md + gallery: true + Gallery 掲載表
              │
              ▼
[Gallery] @gallery-vault-receiver
   gallery.json + thumbnails + npm run build
              │
              ▼
         GitHub Pages
```

## ローカルパス（YUzushio）

| リポ | パス |
|------|------|
| Vault | `C:/Users/byrwg/Atelier-Vault` |
| Gallery | `C:/Users/byrwg/gallery` |

export スクリプトは `gallery/scripts/export-from-vault.mjs` から `../../Atelier-Vault/Backroom` を参照。
