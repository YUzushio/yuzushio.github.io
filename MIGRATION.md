# 旧 gallery リポからの移行

Gallery SPA は **User Pages** として公開します。

| 項目 | 値 |
|------|-----|
| 新 URL | https://yuzushio.github.io/ |
| 新リポ | `YUzushio/YUzushio.github.io` |
| 旧 URL | https://yuzushio.github.io/gallery/ |
| 旧リポ | `YUzushio/gallery` |

## 手順

1. GitHub で `YUzushio.github.io` リポを作成（Public）
2. ローカル `gallery/` の remote を切り替え:

   ```bash
   git remote set-url origin https://github.com/YUzushio/YUzushio.github.io.git
   git push -u origin main
   ```

3. **Settings → Pages → GitHub Actions** を有効化
4. 旧 `YUzushio/gallery` リポの README を以下に差し替え（Pages は無効化推奨）:

   ```markdown
   # Gallery moved

   このサイトは移行しました。

   **新 URL:** https://yuzushio.github.io/
   ```

5. ブックマーク用に旧 `/gallery/` からリダイレクトしたい場合は、旧リポに最小 `index.html` を置いて meta refresh する方法もあります。

## 同人誌表紙サムネイル

Wiki に `![[assets/cover.png]]` がある同人誌は、画像を取得後に次へ配置してください:

- `public/assets/thumbnails/zenhub-agile-pm.png`
- `public/assets/thumbnails/mai-akina-se-walkthrough.png`

`gallery.json` の該当 item に `"thumbnail": "/assets/thumbnails/zenhub-agile-pm.png"` を追加します。
