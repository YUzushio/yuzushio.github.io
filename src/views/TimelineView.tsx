import { useState } from 'react'
import type { GalleryData, GalleryItem } from '../types/gallery'
import { MasonryGrid } from '../components/Panel/MasonryGrid'
import { PanelModal } from '../components/Modal/PanelModal'
import { itemsByYear } from '../utils/grouping'

interface TimelineViewProps {
  data: GalleryData
}

export function TimelineView({ data }: TimelineViewProps) {
  const [selected, setSelected] = useState<GalleryItem | null>(null)
  const grouped = itemsByYear(data.items)

  return (
    <section className="view-section" aria-labelledby="timeline-heading">
      <div className="view-section__header">
        <h2 id="timeline-heading">Timeline</h2>
        <p>年代ごとにセクション分けして表示します。</p>
      </div>

      {[...grouped.entries()].map(([year, items]) => (
        <section key={year} className="timeline-section">
          <h3 className="timeline-section__year">{year}</h3>
          <MasonryGrid
            items={items}
            allItems={data.items}
            onItemClick={setSelected}
          />
        </section>
      ))}

      <PanelModal
        item={selected}
        allItems={data.items}
        onClose={() => setSelected(null)}
      />
    </section>
  )
}
