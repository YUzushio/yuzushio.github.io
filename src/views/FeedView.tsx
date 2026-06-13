import { useState } from 'react'
import type { GalleryData, GalleryItem } from '../types/gallery'
import { MasonryGrid } from '../components/Panel/MasonryGrid'
import { PanelModal } from '../components/Modal/PanelModal'
import { feedItems } from '../utils/grouping'

interface FeedViewProps {
  data: GalleryData
}

export function FeedView({ data }: FeedViewProps) {
  const [selected, setSelected] = useState<GalleryItem | null>(null)
  const items = feedItems(data.items)

  return (
    <section className="view-section" aria-labelledby="feed-heading">
      <div className="view-section__header">
        <h2 id="feed-heading">Feed</h2>
        <p>個別コンテンツを新着順に表示します。</p>
      </div>
      <MasonryGrid items={items} onItemClick={setSelected} />
      <PanelModal item={selected} onClose={() => setSelected(null)} />
    </section>
  )
}
