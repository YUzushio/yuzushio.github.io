# Gallery — reference

## Architecture

```
public/data/gallery.json     ← content source of truth
public/assets/thumbnails/    ← images (committed)
public/assets/placeholders/  ← genre SVG fallbacks
scripts/resolve-sns-avatars.mjs  ← prebuild: SNS + SoundCloud metadata
src/hooks/useGalleryData.ts  ← fetch /data/gallery.json at runtime
src/utils/grouping.ts        ← Feed / Timeline / Category / Drill filters
src/utils/thumbnail.ts       ← thumbnail + primary link resolution
```

HashRouter routes: `/feed`, `/drill`, `/timeline`, `/category`.

## View rules (`grouping.ts`)

| View | Items included | Sort |
|------|----------------|------|
| **Feed** | `kind === "work"`, `showInFeed !== false` | `publishedAt` or `year` desc |
| **Timeline** | `kind === "work"` with `year` or `publishedAt` | by year sections, then date desc |
| **Category** | `kind === "work"` or `"hub"` | hub first, then date desc |
| **Drill** | items where `genres` includes selected genre | date desc |

## Item schema

```json
{
  "id": "unique-id",
  "slug": "url-slug",
  "title": "表示タイトル",
  "summary": "短い説明（パネル本文）",
  "kind": "work | hub",
  "category": "sns | project | doujinshi",
  "genres": ["music", "web"],
  "year": 2024,
  "publishedAt": "2024-12-14",
  "url": "https://...",
  "youtube": "https://www.youtube.com/watch?v=...",
  "github": "owner/repo",
  "site": "https://...",
  "booth": "https://booth.pm/...",
  "techbookfest": "https://techbookfest.org/...",
  "thumbnail": "/assets/thumbnails/example.png",
  "parentId": "hub-item-id",
  "showInFeed": true,
  "tags": ["tag1"]
}
```

### Required per item

- `id`, `slug`, `title`, `summary`, `kind`, `category`, `genres` (non-empty array)

### Link priority in modal (`primaryLink`)

`url` → `youtube` → `site` → `techbookfest` → `booth` → GitHub from `github`

## Genre & category ids

Defined only in `gallery.json` root arrays `genres[]` and `categories[]`.  
Adding a new genre requires:

1. Entry in `genres[]` (id, label, icon)
2. Optional SVG `public/assets/placeholders/{id}.svg`
3. Items referencing the new genre id

## Thumbnail directories

| Path | Purpose |
|------|---------|
| `thumbnails/sns/` | Auto-fetched profile/channel icons |
| `thumbnails/soundcloud/` | Track artwork (auto) |
| `thumbnails/x/` | X fan art (manual download) |
| `thumbnails/*.png` | Project covers (manual) |

## npm scripts

| Script | Action |
|--------|--------|
| `npm run dev` | Local dev server |
| `npm run resolve:sns-avatars` | Update SNS/SoundCloud thumbnails + track dates |
| `npm run build` | prebuild resolver + Vite production build |
| `npm run preview` | Preview `dist/` |

## Fork checklist (`meta`)

```json
"meta": {
  "title": "Your Gallery",
  "author": "Your Name",
  "description": "...",
  "siteUrl": "https://your-user.github.io/"
}
```

GitHub Pages: User/Org site repo or project site; set `base` in `vite.config.ts` if not root `/`.
