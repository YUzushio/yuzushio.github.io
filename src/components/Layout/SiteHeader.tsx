import type { GalleryMeta } from '../../types/gallery'

interface SiteHeaderProps {
  meta: GalleryMeta
}

export function SiteHeader({ meta }: SiteHeaderProps) {
  return (
    <header className="site-header">
      <p className="eyebrow">{meta.author}</p>
      <h1>{meta.title}</h1>
      <p className="lead">{meta.description}</p>
    </header>
  )
}
