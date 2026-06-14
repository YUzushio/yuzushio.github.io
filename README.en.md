# YUzushio Gallery

**English** · [日本語 (README.md)](README.md)

A **React SPA portfolio** for open content, creative work, and achievements.  
**Content is JSON and images only** — fork the UI and swap in your own data.

- **Live example:** https://yuzushio.github.io/
- **Content source of truth:** [`public/data/gallery.json`](public/data/gallery.json)

## Publish free on `{user}.github.io` — no server needed

This template targets **[GitHub Pages](https://pages.github.com/)**.  
You can host your portfolio **without renting a VPS or shared server** — just push to a GitHub repository.

| Point | Details |
|-------|---------|
| **Cost** | **Free** for public repos ([GitHub Free plan](https://github.com/pricing)) |
| **Ops** | No server setup, patching, or uptime babysitting — **git push deploys** |
| **URL** | `{github-username}.github.io` becomes your live site |
| **HTTPS** | Enabled by default |
| **Custom domain** | Optional (e.g. `portfolio.example.com`) |

Fork → rename → edit `gallery.json` → push — that’s enough to launch your Gallery.

**Learn more (GitHub Docs)**

- [About GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages)
- [Creating a GitHub Pages site](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)
- [User Pages vs Project Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages#types-of-github-pages-sites)
- [Custom domains](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/about-custom-domains-and-github-pages)
- [Publishing with GitHub Actions](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site#publishing-with-a-custom-github-actions-workflow) (this repo uses Actions)

---

## Getting started

### Recommended: `@gallery-setup` (fork → publish)

After clone, open **this folder (the cloned folder)** in **Cursor / VS Code / Claude Code**:

| Editor | Action |
|--------|--------|
| **Cursor / Claude Code** | Type `@gallery-setup` and follow the prompts |
| **VS Code + Copilot** | Reference [`.cursor/skills/gallery-setup/SKILL.md`](.cursor/skills/gallery-setup/SKILL.md) in Chat |

**Run the script directly:**

```bash
node .cursor/skills/gallery-setup/scripts/setup.mjs
```

Guides you through `gallery.json` meta · User Pages repo-name check · build · GitHub Pages deploy.

Sections §1 onward are **manual details** (skip §2 if you already ran the Skill).

### 1. Set up the repository

GitHub Pages has **User Pages** and **Project Pages**. This template targets **User Pages** (`https://{username}.github.io/`).

| Mode | Example URL | Repository name |
|------|-------------|-----------------|
| **User Pages (recommended)** | `https://your-name.github.io/` | **`your-name.github.io`** (must match your username) |
| **Project Pages** | `https://your-name.github.io/gallery/` | Any name (e.g. `gallery`) · requires changing `base` in `vite.config.ts` |

> **Important:** After you [fork](https://github.com/YUzushio/yuzushio.github.io/fork), the repo is still named `your-name/yuzushio.github.io`.  
> To publish at **`https://your-name.github.io/`**, you must **rename the repository to `your-name.github.io`** (or create a repo with that name from the start).

**A. Fork (recommended)**

1. [Fork on GitHub](https://github.com/YUzushio/yuzushio.github.io/fork) — [YUzushio/yuzushio.github.io](https://github.com/YUzushio/yuzushio.github.io)
2. On your fork: **Settings → General → Repository name** → rename to **`{your-github-username}.github.io`**  
   (e.g. user `tanaka` → repo `tanaka.github.io`)
3. Clone (`<your-account>` = your GitHub username):

```bash
git clone https://github.com/<your-account>/<your-account>.github.io.git
cd <your-account>.github.io
```

4. Create a working branch and edit

**B. Use as a template only**

1. Create an **empty** GitHub repo named **`{username}.github.io`** (skip “Add README”)
2. Clone the template and point `origin` at your repo:

```bash
git clone https://github.com/YUzushio/yuzushio.github.io.git gallery-template
cd gallery-template
git remote set-url origin https://github.com/<your-account>/<your-account>.github.io.git
git push -u origin main
```

**C. Publish as Project Pages (optional)**

- Any repo name is fine (keeping the fork name `yuzushio.github.io` works)
- Change `vite.config.ts` `base: '/'` to `base: '/{repo-name}/'`
- Set `gallery.json` `meta.siteUrl` to `https://{user}.github.io/{repo-name}/`

### 2. Customize site metadata

**Skip if you ran [`@gallery-setup`](#recommended-gallery-setup-fork--publish).** To edit manually, change `meta` in [`public/data/gallery.json`](public/data/gallery.json):

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

1. Push to `main`
2. Enable **Settings → Pages → Build and deployment → GitHub Actions**
3. When the `build` Action succeeds, the site is live

**User Pages** (if you renamed the repo to `{username}.github.io` in §1):

- Live URL: `https://{username}.github.io/`
- Keep `base: '/'` in `vite.config.ts`
- Match `gallery.json` `meta.siteUrl` to the same URL

For **Project Pages**, see §1 C (`base` and `siteUrl` must include `/repo-name/`).

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
| [`gallery-setup`](.cursor/skills/gallery-setup/SKILL.md) | **After fork** — meta · Pages config · build · deploy checklist |
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

   > `@gallery-setup` I forked this — walk me through publish setup  
   > `@gallery-vault-sender` Create new project foo in Backroom and prepare it for Gallery  
   > `@gallery-vault-receiver` Sync Backroom foo into gallery.json

3. Day-to-day adds/edits (without Vault):

   > `@gallery-content` Add this URL to the Gallery

Skills under `.cursor/skills/` are included when you fork.

### Skill locations

```
.cursor/skills/
├── gallery-setup/             … first-time fork setup
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

If you set the repository name to `{username}.github.io` in §1, follow §6 to publish as User Pages.  
On first deploy, enable **Settings → Pages → GitHub Actions**.

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
- [my-atelier-vault](https://github.com/YUzushio/my-atelier-vault) ([fork](https://github.com/YUzushio/my-atelier-vault/fork)) — Obsidian Wiki template (optional) · [`gallery-vault-sender`](https://github.com/YUzushio/my-atelier-vault/blob/main/.cursor/skills/gallery-vault-sender/SKILL.md)
