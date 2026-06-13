import { useEffect } from 'react'
import type { GalleryItem } from '../../types/gallery'
import { primaryLink, resolveThumbnail } from '../../utils/thumbnail'

interface PanelModalProps {
  item: GalleryItem | null
  allItems?: GalleryItem[]
  onClose: () => void
  title?: string
  subtitle?: string
  children?: React.ReactNode
}

export function PanelModal({
  item,
  allItems = [],
  onClose,
  title,
  subtitle,
  children,
}: PanelModalProps) {
  useEffect(() => {
    if (!item && !children) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [item, children, onClose])

  if (!item && !children) return null

  const link = item ? primaryLink(item) : undefined
  const thumbnail = item ? resolveThumbnail(item, allItems) : undefined

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        className="modal-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <button type="button" className="modal-close" onClick={onClose}>
          Close
        </button>

        {title ? (
          <div className="modal-panel__header">
            <h2 id="modal-title">{title}</h2>
            {subtitle ? <p>{subtitle}</p> : null}
          </div>
        ) : null}

        {item ? (
          <div className="modal-panel__detail">
            {thumbnail ? (
              <img className="modal-panel__thumb" src={thumbnail} alt="" />
            ) : null}
            <div>
              <h2 id="modal-title">{item.title}</h2>
              <p>{item.summary}</p>
              {item.tags && item.tags.length > 0 ? (
                <div className="content-panel__tags">
                  {item.tags.map((tag) => (
                    <span key={tag} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}
              {link ? (
                <a className="modal-link" href={link} target="_blank" rel="noreferrer">
                  Open content
                </a>
              ) : null}
            </div>
          </div>
        ) : null}

        {children}
      </div>
    </div>
  )
}
