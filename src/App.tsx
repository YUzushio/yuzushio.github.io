import { Navigate, Route, Routes } from 'react-router-dom'
import { useGalleryData } from './hooks/useGalleryData'
import { SiteHeader } from './components/Layout/SiteHeader'
import { ViewTabs } from './components/Layout/ViewTabs'
import { FeedView } from './views/FeedView'
import { DrillView } from './views/DrillView'
import { TimelineView } from './views/TimelineView'
import { CategoryView } from './views/CategoryView'

export default function App() {
  const { data, error, loading } = useGalleryData()

  if (loading) {
    return (
      <div className="app-shell">
        <p className="status-message">Loading gallery…</p>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="app-shell">
        <p className="status-message status-message--error">
          {error ?? 'Gallery data unavailable'}
        </p>
      </div>
    )
  }

  return (
    <div className="app-shell">
      <SiteHeader meta={data.meta} />
      <ViewTabs />
      <main className="site-main">
        <Routes>
          <Route path="/" element={<Navigate to="/feed" replace />} />
          <Route path="/feed" element={<FeedView data={data} />} />
          <Route path="/drill" element={<DrillView data={data} />} />
          <Route path="/timeline" element={<TimelineView data={data} />} />
          <Route path="/category" element={<CategoryView data={data} />} />
        </Routes>
      </main>
      <footer className="site-footer">
        <p>
          Open content hub · fork-friendly JSON ·{' '}
          <a href="https://github.com/YUzushio/YUzushio.github.io">GitHub</a>
        </p>
      </footer>
    </div>
  )
}
