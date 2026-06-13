import { useEffect, useState } from 'react'
import type { GalleryData } from '../types/gallery'

export function useGalleryData() {
  const [data, setData] = useState<GalleryData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    fetch(`${import.meta.env.BASE_URL}data/gallery.json`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load gallery data (${response.status})`)
        }
        return response.json() as Promise<GalleryData>
      })
      .then((json) => {
        if (!cancelled) {
          setData(json)
          setLoading(false)
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Unknown error')
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  return { data, error, loading }
}
