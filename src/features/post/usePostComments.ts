import { useState, useEffect } from 'react'
import { commentApi } from '@/api'
import type { CommentResponse } from '@/types'

interface UsePostCommentsOptions {
  postId: number | undefined
}

interface UsePostCommentsResult {
  comments: CommentResponse[]
  isLoading: boolean
  error: Error | null
  handleCommentSubmit: (text: string) => Promise<void>
  refreshComments: () => Promise<void>
}

export function usePostComments({ postId }: UsePostCommentsOptions): UsePostCommentsResult {
  const [comments, setComments] = useState<CommentResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const loadComments = async () => {
    if (!postId) {
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const response = await commentApi.getComments(postId)
      if (response.success && response.data) {
        setComments(response.data.items)
      } else {
        throw new Error('Failed to load comments')
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'))
      setComments([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadComments()
  }, [postId])

  const handleCommentSubmit = async (text: string) => {
    if (!postId) return

    try {
      const response = await commentApi.createComment(postId, { content: text })
      if (response.success && response.data) {
        setComments([...comments, response.data])
      } else {
        throw new Error('Failed to create comment')
      }
    } catch (err) {
      console.error('Failed to create comment:', err)
      throw err
    }
  }

  const refreshComments = async () => {
    await loadComments()
  }

  return {
    comments,
    isLoading,
    error,
    handleCommentSubmit,
    refreshComments,
  }
}
