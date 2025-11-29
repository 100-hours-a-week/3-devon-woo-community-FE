import { useState, useEffect } from 'react'
import { postApi } from '@/api'

interface RecommendedPost {
  id: number
  title: string
  category: string
  date: string
}

interface UseRecommendedPostsOptions {
  currentPostId: number | undefined
  limit?: number
}

interface UseRecommendedPostsResult {
  posts: RecommendedPost[]
  isLoading: boolean
  error: Error | null
}

export function useRecommendedPosts({
  currentPostId,
  limit = 3,
}: UseRecommendedPostsOptions): UseRecommendedPostsResult {
  const [posts, setPosts] = useState<RecommendedPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const loadRecommended = async () => {
      if (!currentPostId) {
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)

        const response = await postApi.getPosts({ page: 0, size: limit + 1 })
        if (response.success && response.data) {
          const recommendations: RecommendedPost[] = response.data.items
            .filter(p => p.postId !== currentPostId)
            .slice(0, limit)
            .map(p => ({
              id: p.postId,
              title: p.title,
              category: 'TECH INSIGHT',
              date: p.createdAt,
            }))
          setPosts(recommendations)
        }
      } catch (err) {
        console.error('Failed to load recommended posts:', err)
        setError(err instanceof Error ? err : new Error('Failed to load recommended posts'))
        setPosts([])
      } finally {
        setIsLoading(false)
      }
    }

    void loadRecommended()
  }, [currentPostId, limit])

  return { posts, isLoading, error }
}
