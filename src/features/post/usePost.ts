import { useState, useEffect } from 'react'
import { postApi } from '@/api'
import type { PostResponse } from '@/types'

interface UsePostOptions {
  postId: number | undefined
}

interface UsePostResult {
  post: PostResponse | null
  isLoading: boolean
  error: Error | null
}

export function usePost({ postId }: UsePostOptions): UsePostResult {
  const [post, setPost] = useState<PostResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const loadPost = async () => {
      if (!postId) {
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)

        const response = await postApi.getPostById(postId)
        if (response.success && response.data) {
          setPost(response.data)
        } else {
          throw new Error('Failed to load post')
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'))
        setPost(null)
      } finally {
        setIsLoading(false)
      }
    }

    void loadPost()
  }, [postId])

  return { post, isLoading, error }
}
