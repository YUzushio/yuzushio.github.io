# YUzushio Gallery

**English** · [日本語 (README.md)](README.md)

A **React SPA portfolio** for open content, creative work, and achievements.  
**Content is JSON and images only** — fork the UI and swap in your own data.

- **Live example:** https://yuzushio.github.io/
- **Content source of truth:** [`public/data/gallery.json`](public/data/gallery.json)

---

## Getting started

### 1. Set up the repository

**A. Fork (recommended)**

1. [Fork on GitHub](https://github.com/YUzushio/yuzushio.github.io/fork) — [YUzushio/yuzushio.github.io](https://github.com/YUzushio/yuzushio.github.io)
2. Clone and create a working branch

**B. Use as a template only**

1. Clone this repository
2. `git remote set-url origin` to your GitHub Pages repo

### 2. Customize site metadata

Edit `meta` in [`public/data/gallery.json`](public/data/gallery.json):

```json
{
  "meta": {
    "title": "Your Gallery",
    "author": "Your Name",
    "description": "Portfolio description",
    "siteUrl": "https://your-name.github.io/"
  }
}
```

### 3. Add panels (works · SNS)

Add objects to `items[]`. Minimal example:

```json
{
  "id": "my-project",
  "slug": "my-project",
  "title": "My Project",
  "summary": "One-line description",
  "kind": "work",
  "category": "project",
  "genres": ["web"],
  "year": 2024,
  "site": "https://example.com",
  "tags": ["Web"]
}
```

| Field | Meaning |
|-------|---------|
| `kind: "hub"` | **Entry point** such as an SNS account (hidden from Feed by default) |
| `kind: "work"` | **Individual content** (shown in Feed / Timeline / Category) |
| `category` | `sns` / `project` / `doujinshi` (Category view sections) |
| `genres` | Drill view genres (pick from `genres[]` at the top of `gallery.json`) |
| `year` / `publishedAt` | Required for Timeline (`work` only) |
| `parentId` | Parent hub `id` (e.g. a video under YouTube → `yuzshio-youtube`) |

Full schema: [Item schema](#item-schema) below and [`.cursor/skills/gallery-content/reference.md`](.cursor/skills/gallery-content/reference.md).

### 4. Thumbnails

| Method | When to use |
|--------|-------------|
| **Automatic** | YouTube / GitHub URL only → OG or `hqdefault` at build time |
| **`npm run resolve:sns-avatars`** | YouTube / X / Pixiv / note / SoundCloud profiles & SoundCloud tracks |
| **Manual** | Put images in `public/assets/thumbnails/` and set `"thumbnail": "/assets/thumbnails/..."` |

Genre SVG placeholders: [`public/assets/placeholders/`](public/assets/placeholders/)

### 5. Preview locally

```bash
npm install
npm run dev
```

Check Feed / Drill / Timeline / Category in the browser.

### 6. Publish (GitHub Pages)

1. Push to `main` (or your Pages branch)
2. Repo **Settings → Pages → Build and deployment → GitHub Actions**
3. When the `build` Action succeeds, the site is live at `meta.siteUrl`

For User Pages (`<user>.github.io` repo), keep `base: '/'` in `vite.config.ts`.  
For Project Pages (`/repo-name/`), change to `base: '/repo-name/'`.

### Typical layout

```
SNS hub (kind: hub, showInFeed: false)
  └─ individual works (linked via parentId)
       e.g. SoundCloud channel → each track
       e.g. X account → fan-art posts
```

---

## Organize content with AI agents

### Skills in this repository

| Skill | Role |
|-------|------|
| [`gallery-content`](.cursor/skills/gallery-content/SKILL.md) | **Gallery only** — `gallery.json` / thumbnails / 4 views |
| [`gallery-vault-receiver`](.cursor/skills/gallery-vault-receiver/SKILL.md) | **Vault → Gallery receive** — merge Wiki into JSON · build |

Vault side (sender): [my-atelier-vault/.cursor/skills/gallery-vault-sender/SKILL.md](https://github.com/YUzushio/my-atelier-vault/blob/main/.cursor/skills/gallery-vault-sender/SKILL.md)

### Vault first, then publish to Gallery

```
1. [my-atelier-vault] @gallery-vault-sender
      Backroom/{slug}/_index.md  … gallery: true, frontmatter, Gallery table

2. [gallery] @gallery-vault-receiver
      merge gallery.json, copy thumbnails, npm run build
```

**Do you need the receiver?** — `export-from-vault.mjs` alone does not set `kind`, child panels, or thumbnails reliably; the receiver Skill is safer. For Gallery-only edits, `@gallery-content` is enough.

### Usage (Cursor)

1. Open the Vault repo or gallery repo in Cursor (sibling folders in one window works too)
2. Examples:

   > `@gallery-vault-sender` Create new project foo in Backroom and prepare it for Gallery  
   > `@gallery-vault-receiver` Sync Backroom foo into gallery.json

3. Day-to-day adds/edits (without Vault):

   > `@gallery-content` Add this URL to the Gallery

Skills under `.cursor/skills/` are included when you fork.

### Skill locations

```
.cursor/skills/
├── gallery-content/           … edit Gallery source
└── gallery-vault-receiver/    … import from Wiki
```

Details: each Skill’s `reference.md`

---

## How the app works (overview)

```
gallery.json  ──→  useGalleryData()  ──→  4 Views
                      │
                      ├─ FeedView      … works, newest first
                      ├─ DrillView     … filter by genre
                      ├─ TimelineView  … by year
                      └─ CategoryView  … by category (hub + work)

Each panel: ContentPanel → resolveThumbnail(item, allItems)
Modal: PanelModal → primaryLink(item)
```

| View | Description |
|------|-------------|
| **Feed** | Individual content, newest first |
| **Drill** | Genre → sub-panels in modal |
| **Timeline** | Sections by year |
| **Category** | Sections by category |

Stack: React 19 + Vite + TypeScript + HashRouter + react-masonry-css

---

## Development

```bash
npm install
npm run dev
```

Build:

```bash
npm run build
npm run preview
```

---

## Deploy (GitHub Pages)

Example: run `YUzushio/yuzushio.github.io` as User Pages:

1. Create a `your-name.github.io` repository on GitHub
2. `git remote set-url origin https://github.com/YOUR_USER/your-name.github.io.git`
3. Push to `main` → GitHub Actions deploys to Pages
4. Enable **Settings → Pages → GitHub Actions**

---

## Item schema

```json
{
  "id": "unique-id",
  "slug": "url-slug",
  "title": "Display title",
  "summary": "Short description",
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

- `kind: "hub"` — SNS channel, etc. (hidden from Feed by default)
- `kind: "work"` — individual deliverable
- Thumbnail resolution order: `thumbnail` → YouTube → GitHub OG → parent hub → genre SVG

---

## SNS / SoundCloud metadata fetch

Items with profile URLs or SoundCloud **track** URLs get thumbnails and dates via a pre-build script:

```bash
npm run resolve:sns-avatars
npm run resolve:sns-avatars -- --force   # re-fetch existing
```

| Target | Fetched |
|--------|---------|
| YouTube / X / Pixiv / note / VRoid Hub profiles | Icon → `thumbnails/sns/` |
| SoundCloud **tracks** | Artwork or channel image, `publishedAt` / `year` |
| SoundCloud profiles | Channel icon |

Also runs automatically in `prebuild` before `npm run build`.

---

## Optional: draft export from Obsidian Vault

If you have [my-atelier-vault](https://github.com/YUzushio/my-atelier-vault) ([fork](https://github.com/YUzushio/my-atelier-vault/fork)) cloned as a sibling folder locally:

1. Vault: `@gallery-vault-sender` — prepare `Backroom/{slug}/` (`gallery: true`)
2. Gallery: `@gallery-vault-receiver` — merge into `gallery.json`

Draft only:

```bash
node scripts/export-from-vault.mjs > public/data/gallery.draft.json
```

Output is **incomplete** (no `kind` / child panels / thumbnails). Use the receiver Skill for production.

---

## Related

- [gallery-content](.cursor/skills/gallery-content/SKILL.md) — Gallery-only editing
- [gallery-vault-receiver](.cursor/skills/gallery-vault-receiver/SKILL.md) — import from Vault
- Vault sender: [my-atelier-vault](https://github.com/YUzushio/my-atelier-vault) · `gallery-vault-sender` skill
- [my-atelier-vault](https://github.com/YUzushio/my-atelier-vault) — Obsidian Wiki template (optional)
