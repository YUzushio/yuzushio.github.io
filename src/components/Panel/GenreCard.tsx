import type { Genre } from '../../types/gallery'

interface GenreCardProps {
  genre: Genre
  count: number
  onClick: () => void
}

export function GenreCard({ genre, count, onClick }: GenreCardProps) {
  return (
    <button type="button" className="genre-card" onClick={onClick}>
      <div className="genre-card__icon">
        <img src={`/assets/placeholders/${genre.id}.svg`} alt="" />
      </div>
      <div className="genre-card__body">
        <h3>{genre.label}</h3>
        <p>{count} items</p>
      </div>
    </button>
  )
}
