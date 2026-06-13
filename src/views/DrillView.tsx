import { useState } from 'react'
import type { GalleryData, GalleryItem, Genre } from '../types/gallery'
import { GenreCard } from '../components/Panel/GenreCard'
import { MasonryGrid } from '../components/Panel/MasonryGrid'
import { PanelModal } from '../components/Modal/PanelModal'
import { genreCounts, itemsByGenre } from '../utils/grouping'

interface DrillViewProps {
  data: GalleryData
}

export function DrillView({ data }: DrillViewProps) {
  const [activeGenre, setActiveGenre] = useState<Genre | null>(null)
  const [selected, setSelected] = useState<GalleryItem | null>(null)
  const counts = genreCounts(data.items)

  const genreItems = activeGenre
    ? itemsByGenre(data.items, activeGenre.id)
    : []

  return (
    <section className="view-section" aria-labelledby="drill-heading">
      <div className="view-section__header">
        <h2 id="drill-heading">Drill</h2>
        <p>ジャンルから作品を掘り下げて表示します。</p>
      </div>

      <div className="genre-grid">
        {data.genres.map((genre) => (
          <GenreCard
            key={genre.id}
            genre={genre}
            count={counts.get(genre.id) ?? 0}
            onClick={() => setActiveGenre(genre)}
          />
        ))}
      </div>

      {activeGenre ? (
        <PanelModal
          item={null}
          title={activeGenre.label}
          subtitle={`${counts.get(activeGenre.id) ?? 0} items`}
          onClose={() => {
            setActiveGenre(null)
            setSelected(null)
          }}
        >
          <MasonryGrid
            items={genreItems}
            allItems={data.items}
            compact
            onItemClick={(item) => setSelected(item)}
          />
        </PanelModal>
      ) : null}

      <PanelModal
        item={selected}
        allItems={data.items}
        onClose={() => setSelected(null)}
      />
    </section>
  )
}
