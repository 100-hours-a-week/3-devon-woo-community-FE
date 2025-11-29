import { useCallback, useEffect, useState } from 'react'
import { tagApi } from '@/api'
import type { PopularTag } from '@/types/tag'

interface UsePopularTagsOptions {
  limit?: number
}

interface UsePopularTagsResult {
  tags: PopularTag[]
  isLoading: boolean
  error: Error | null
  reload: () => Promise<void>
}

export function usePopularTags({ limit = 10 }: UsePopularTagsOptions = {}): UsePopularTagsResult {
  const [tags, setTags] = useState<PopularTag[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const loadTags = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await tagApi.getPopularTags(limit)
      if (response.success && response.data) {
        setTags(response.data.items)
      } else {
        setTags([])
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load tags'))
      setTags([])
    } finally {
      setIsLoading(false)
    }
  }, [limit])

  useEffect(() => {
    void loadTags()
  }, [loadTags])

  return {
    tags,
    isLoading,
    error,
    reload: loadTags,
  }
}
