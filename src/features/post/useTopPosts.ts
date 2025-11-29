import { useCallback, useEffect, useState } from 'react'
import { postApi } from '@/api'

export interface TopPostSummary {
  id: number
  title: string
  url: string
}

interface UseTopPostsOptions {
  limit?: number
  sort?: string
}

interface UseTopPostsResult {
  topPosts: TopPostSummary[]
  isLoading: boolean
  error: Error | null
  reload: () => Promise<void>
}

export function useTopPosts({ limit = 5, sort = 'viewCount,desc' }: UseTopPostsOptions = {}): UseTopPostsResult {
  const [topPosts, setTopPosts] = useState<TopPostSummary[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const loadTopPosts = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await postApi.getPosts({ page: 0, size: limit, sort })

      if (response.success && response.data) {
        const mapped = response.data.items.map(post => ({
          id: post.postId,
          title: post.title,
          url: `/posts/${post.postId}`,
        }))
        setTopPosts(mapped)
      } else {
        setTopPosts([])
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load top posts'))
      setTopPosts([])
    } finally {
      setIsLoading(false)
    }
  }, [limit, sort])

  useEffect(() => {
    void loadTopPosts()
  }, [loadTopPosts])

  return {
    topPosts,
    isLoading,
    error,
    reload: loadTopPosts,
  }
}
