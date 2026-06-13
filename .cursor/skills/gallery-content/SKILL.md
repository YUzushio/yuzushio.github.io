---
name: gallery-content
description: >-
  Maintains Gallery SPA content (public/data/gallery.json, thumbnails, parent
  hubs, Timeline dates) and explains how JSON maps to Feed/Drill/Timeline/Category
  views. Use when adding or editing gallery items, SNS or SoundCloud panels, fan
  art tweets, fork setup, thumbnail resolution, or when the user mentions Gallery
  content, gallery.json, or portfolio panels.
---

# Gallery Content

React SPA whose **only content source** is `public/data/gallery.json` plus static assets under `public/assets/`. UI code rarely changes; most work is JSON + thumbnails.

## Before editing

1. Read `public/data/gallery.json` and `src/types/gallery.ts`.
2. For field rules and view logic, read [reference.md](reference.md).
3. Match existing item naming: `id`/`slug` kebab-case, unique `id`.

## Add or update an item

### 1. Classify

| kind | Use for | Feed default | Timeline |
|------|---------|--------------|----------|
| `hub` | SNS channel, account entry | hidden (`showInFeed: false`) | no |
| `work` | Single work, track, post, project | shown | yes if `year` or `publishedAt` |

Pick one `category`: `sns` | `project` | `doujinshi`.  
Pick one or more `genres` from `gallery.json` → `genres[]` (must exist).

### 2. Links and parent

- Set the best primary link in `url`, `youtube`, `site`, `github`, `booth`, or `techbookfest`.
- Child of a hub: `"parentId": "<hub-id>"` (e.g. SoundCloud tracks → `yuzshio-soundcloud`, X fan art → `yuzshio-x`).
- Hub items must exist before children reference them.

### 3. Dates (Timeline)

- `work` needs `year` and/or `publishedAt` (`YYYY-MM-DD`) or it **won't appear in Timeline**.
- Year-only is OK; sort falls back to `{year}-01-01`.

### 4. Thumbnail

Priority at runtime (`src/utils/thumbnail.ts`):

1. `item.thumbnail` (local path under `/assets/thumbnails/…`)
2. YouTube `hqdefault` from `youtube`
3. GitHub OpenGraph from `github`
4. Parent hub thumbnail via `parentId`
5. Genre placeholder SVG `/assets/placeholders/{genre}.svg`

**Automated prebuild** (`scripts/resolve-sns-avatars.mjs`):

- Profile URLs (YouTube, X, Pixiv, note, VRoid, SoundCloud profile) → `public/assets/thumbnails/sns/{slug}.{ext}`
- SoundCloud **track** URLs → artwork or channel fallback; sets `publishedAt` from page HTML
- Run: `npm run resolve:sns-avatars` or `--force` to refresh

**Manual patterns:**

| Content | Save to | Set in JSON |
|---------|---------|-------------|
| Cover / screenshot | `public/assets/thumbnails/{slug}.png` | `"/assets/thumbnails/{slug}.png"` |
| X fan art tweet | `public/assets/thumbnails/x/fanart-{topic}-{year}.{jpg\|png}` | same path |
| SoundCloud track art | `public/assets/thumbnails/soundcloud/` | written by script |

For X fan art: fetch media via `https://cdn.syndication.twimg.com/tweet-result?id={TWEET_ID}&token=0`, download `media_url_https`, set `publishedAt` from `created_at`.

### 5. Validate

```bash
npm run build
npm run preview
```

Check: Feed order, Timeline year bucket, Category section, Drill genre modal, panel modal link + thumbnail.

## Common patterns

**SNS hub** — one per platform account; `showInFeed: false`.

**Hub child** — `kind: "work"`, `parentId`, own title/summary; share or override thumbnail.

**Project** — `category: "project"`, genres often `web` / `community`; `year` for Timeline.

**Doujinshi** — `category: "doujinshi"`, local cover in `public/assets/thumbnails/`.

## Optional: Obsidian Vault

If `Atelier-Vault/Backroom/{slug}/_index.md` has `gallery: true` in frontmatter:

```bash
node scripts/export-from-vault.mjs > public/data/gallery.draft.json
```

Merge draft into `gallery.json` manually; export is hints only (incomplete schema).

## Wiki sync (YUzushio)

When user also keeps Atelier-Vault: update matching `Backroom/*/ _index.md` (Gallery table, `gallery: true`, dates). Gallery JSON remains the **deploy source of truth**.

**Vault-first workflow:** use `@gallery-vault-sender` in Atelier-Vault, then `@gallery-vault-receiver` in this repo. See [gallery-vault-receiver/SKILL.md](../gallery-vault-receiver/SKILL.md).

## Don't

- Commit secrets (.env, passwords).
- Invent `genre` or `category` ids not in `gallery.json` top-level arrays.
- Change React views for content-only requests unless grouping rules must change.

## Reference

Full schema, view filters, and file map: [reference.md](reference.md)
