import { useState } from 'react'
import type { GalleryData, GalleryItem } from '../types/gallery'
import { MasonryGrid } from '../components/Panel/MasonryGrid'
import { PanelModal } from '../components/Modal/PanelModal'
import { itemsByCategory } from '../utils/grouping'

interface CategoryViewProps {
  data: GalleryData
}

export function CategoryView({ data }: CategoryViewProps) {
  const [selected, setSelected] = useState<GalleryItem | null>(null)
  const grouped = itemsByCategory(data.items)
  const labels = new Map(data.categories.map((category) => [category.id, category.label]))

  return (
    <section className="view-section" aria-labelledby="category-heading">
      <div className="view-section__header">
        <h2 id="category-heading">Category</h2>
        <p>カテゴリごとにセクション分けして表示します。</p>
      </div>

      {[...grouped.entries()].map(([categoryId, items]) => {
        if (items.length === 0) return null

        return (
          <section key={categoryId} className="category-section">
            <h3 className="category-section__title">
              {labels.get(categoryId) ?? categoryId}
            </h3>
            <MasonryGrid items={items} onItemClick={setSelected} />
          </section>
        )
      })}

      <PanelModal item={selected} onClose={() => setSelected(null)} />
    </section>
  )
}
