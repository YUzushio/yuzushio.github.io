import type { CategoryId, GalleryItem, GenreId } from '../types/gallery'

export function feedItems(items: GalleryItem[]): GalleryItem[] {
  return items
    .filter((item) => item.kind === 'work' && item.showInFeed !== false)
    .sort((a, b) => {
      const dateA = a.publishedAt ?? `${a.year ?? 0}-01-01`
      const dateB = b.publishedAt ?? `${b.year ?? 0}-01-01`
      return dateB.localeCompare(dateA)
    })
}

export function itemsByGenre(
  items: GalleryItem[],
  genreId: GenreId,
): GalleryItem[] {
  return items
    .filter((item) => item.genres.includes(genreId))
    .sort((a, b) => {
      const dateA = a.publishedAt ?? `${a.year ?? 0}-01-01`
      const dateB = b.publishedAt ?? `${b.year ?? 0}-01-01`
      return dateB.localeCompare(dateA)
    })
}

export function itemsByYear(items: GalleryItem[]): Map<number, GalleryItem[]> {
  const map = new Map<number, GalleryItem[]>()

  for (const item of items.filter((entry) => entry.kind === 'work')) {
    const year = item.year ?? Number(item.publishedAt?.slice(0, 4))
    if (!year) continue

    const bucket = map.get(year) ?? []
    bucket.push(item)
    map.set(year, bucket)
  }

  for (const [year, bucket] of map) {
    bucket.sort((a, b) => {
      const dateA = a.publishedAt ?? `${year}-01-01`
      const dateB = b.publishedAt ?? `${year}-01-01`
      return dateB.localeCompare(dateA)
    })
  }

  return new Map([...map.entries()].sort((a, b) => b[0] - a[0]))
}

export function itemsByCategory(
  items: GalleryItem[],
): Map<CategoryId, GalleryItem[]> {
  const order: CategoryId[] = ['sns', 'project', 'doujinshi']
  const map = new Map<CategoryId, GalleryItem[]>()

  for (const categoryId of order) {
    map.set(categoryId, [])
  }

  for (const item of items.filter((entry) => entry.kind === 'work')) {
    const bucket = map.get(item.category) ?? []
    bucket.push(item)
    map.set(item.category, bucket)
  }

  for (const bucket of map.values()) {
    bucket.sort((a, b) => {
      const dateA = a.publishedAt ?? `${a.year ?? 0}-01-01`
      const dateB = b.publishedAt ?? `${b.year ?? 0}-01-01`
      return dateB.localeCompare(dateA)
    })
  }

  return map
}

export function genreCounts(items: GalleryItem[]): Map<GenreId, number> {
  const counts = new Map<GenreId, number>()

  for (const item of items) {
    for (const genre of item.genres) {
      counts.set(genre, (counts.get(genre) ?? 0) + 1)
    }
  }

  return counts
}
