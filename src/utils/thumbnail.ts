import type { GalleryItem, GenreId } from '../types/gallery'

const YOUTUBE_ID_RE =
  /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/

export function extractYouTubeId(url: string): string | null {
  const match = url.match(YOUTUBE_ID_RE)
  return match?.[1] ?? null
}

export function resolveThumbnail(
  item: GalleryItem,
  fallbackGenre: GenreId = 'web',
): string {
  if (item.thumbnail) {
    return item.thumbnail
  }

  if (item.youtube) {
    const id = extractYouTubeId(item.youtube)
    if (id) {
      return `https://img.youtube.com/vi/${id}/hqdefault.jpg`
    }
  }

  if (item.github) {
    return `https://opengraph.githubassets.com/1/${item.github}`
  }

  const genre = item.genres[0] ?? fallbackGenre
  return `/assets/placeholders/${genre}.svg`
}

export function primaryLink(item: GalleryItem): string | undefined {
  return (
    item.url ??
    item.youtube ??
    item.site ??
    item.techbookfest ??
    item.booth ??
    (item.github ? `https://github.com/${item.github}` : undefined)
  )
}
