export type ItemKind = 'work' | 'hub'

export type GenreId =
  | 'music'
  | 'game'
  | 'doujin'
  | 'web'
  | 'community'
  | 'sns'
  | 'illust'

export type CategoryId = 'sns' | 'project' | 'doujinshi'

export interface Genre {
  id: GenreId
  label: string
  icon: string
}

export interface Category {
  id: CategoryId
  label: string
}

export interface GalleryItem {
  id: string
  slug: string
  title: string
  summary: string
  kind: ItemKind
  category: CategoryId
  genres: GenreId[]
  year?: number
  publishedAt?: string
  url?: string
  youtube?: string
  github?: string
  site?: string
  techbookfest?: string
  booth?: string
  thumbnail?: string
  parentId?: string
  showInFeed?: boolean
  tags?: string[]
}

export interface GalleryMeta {
  title: string
  author: string
  description: string
  siteUrl: string
}

export interface GalleryData {
  meta: GalleryMeta
  genres: Genre[]
  categories: Category[]
  items: GalleryItem[]
}
