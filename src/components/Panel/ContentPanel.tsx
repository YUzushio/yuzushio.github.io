import type { GalleryItem } from '../../types/gallery'
import { resolveThumbnail } from '../../utils/thumbnail'

interface ContentPanelProps {
  item: GalleryItem
  onClick: (item: GalleryItem) => void
  compact?: boolean
}

export function ContentPanel({ item, onClick, compact = false }: ContentPanelProps) {
  const thumbnail = resolveThumbnail(item)

  return (
    <button
      type="button"
      className={`content-panel${compact ? ' content-panel--compact' : ''}`}
      onClick={() => onClick(item)}
    >
      <div className="content-panel__media">
        <img src={thumbnail} alt="" loading="lazy" />
        {item.year ? (
          <span className="content-panel__badge">{item.year}</span>
        ) : null}
      </div>
      <div className="content-panel__body">
        <h3>{item.title}</h3>
        <p>{item.summary}</p>
        {item.tags && item.tags.length > 0 ? (
          <div className="content-panel__tags">
            {item.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </button>
  )
}
