# YUzushio Gallery

YUzushio の Open コンテンツ・制作・実績をまとめた **React SPA ポートフォリオ**です。

- **公開 URL:** https://yuzushio.github.io/
- **コンテンツ正本:** [`public/data/gallery.json`](public/data/gallery.json)（fork して差し替えるだけで流用可能）

## Views

| View | 説明 |
|------|------|
| **Feed** | 個別コンテンツを新着順 |
| **Drill** | ジャンル → モーダル内サブパネル |
| **Timeline** | 年代ごとセクション |
| **Category** | カテゴリごとセクション |

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

## Deploy (GitHub Pages)

このリポジトリは **User Pages** として `YUzushio/YUzushio.github.io` にデプロイします。

1. GitHub で `YUzushio.github.io` リポジトリを作成（未作成の場合）
2. このリポジトリの remote を設定:

   ```bash
   git remote set-url origin https://github.com/YUzushio/YUzushio.github.io.git
   ```

3. `main` へ push → GitHub Actions が Pages にデプロイ
4. **Settings → Pages → Build and deployment → GitHub Actions** を有効化

旧 `YUzushio/gallery` リポから移行した場合は、そちらの README で新 URL へ誘導してください。

## Fork して使う

1. リポジトリを fork
2. [`public/data/gallery.json`](public/data/gallery.json) を編集
   - `meta.title`, `meta.author`, `meta.description`, `meta.siteUrl` を自分用に変更
   - `items[]` に作品を追加・削除
3. 必要なら [`public/assets/placeholders/`](public/assets/placeholders/) の SVG を差し替え
4. `public/assets/thumbnails/` に手動サムネイルを追加（任意）
5. GitHub Pages を有効化して deploy

### Item スキーマ（主要フィールド）

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
  "thumbnail": "/assets/thumbnails/custom.webp",
  "parentId": "optional-hub-id",
  "showInFeed": true,
  "tags": ["tag1", "tag2"]
}
```

- `kind: "hub"` — SNS チャンネル等の入口（Feed 非表示がデフォルト）
- `kind: "work"` — 個別成果（Feed・Timeline・Category に表示）
- サムネイル: `thumbnail` 未指定時は YouTube / GitHub OG → ジャンル SVG の順で解決

## Optional: Vault からの下書き export

ローカルに [Atelier-Vault](https://github.com/YUzushio/atelier-vault) がある場合:

```bash
node scripts/export-from-vault.mjs > public/data/gallery.draft.json
```

## Related

- [Atelier Vault](../Atelier-Vault) — private Obsidian wiki (`Backroom`)
- ローカル配置: `C:/Users/byrwg/` 直下（`Backroom/local-layout.md`）
