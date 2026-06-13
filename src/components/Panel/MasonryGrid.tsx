import Masonry from 'react-masonry-css'
import type { GalleryItem } from '../../types/gallery'
import { ContentPanel } from './ContentPanel'

interface MasonryGridProps {
  items: GalleryItem[]
  onItemClick: (item: GalleryItem) => void
  compact?: boolean
}

const breakpointColumns = {
  default: 4,
  1200: 3,
  768: 2,
  480: 1,
}

export function MasonryGrid({ items, onItemClick, compact = false }: MasonryGridProps) {
  if (items.length === 0) {
    return <p className="empty-state">該当するコンテンツがありません。</p>
  }

  return (
    <Masonry
      breakpointCols={breakpointColumns}
      className="masonry-grid"
      columnClassName="masonry-grid__column"
    >
      {items.map((item) => (
        <ContentPanel
          key={item.id}
          item={item}
          onClick={onItemClick}
          compact={compact}
        />
      ))}
    </Masonry>
  )
}
