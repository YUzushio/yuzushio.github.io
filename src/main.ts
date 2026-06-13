import './style.css'

const app = document.querySelector<HTMLDivElement>('#app')!

app.innerHTML = `
  <header class="site-header">
    <p class="eyebrow">Portfolio</p>
    <h1>Gallery</h1>
    <p class="lead">個人の制作・実績をまとめたポートフォリオです。</p>
  </header>

  <main class="site-main">
    <section class="works" aria-labelledby="works-heading">
      <h2 id="works-heading">Works</h2>
      <p class="empty-state">作品は準備中です。</p>
    </section>
  </main>

  <footer class="site-footer">
    <p>Built with Vite · Atelier Vault から公開</p>
  </footer>
`
