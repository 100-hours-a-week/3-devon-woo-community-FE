import { useState } from 'react'
import { postApi } from '@/api'

interface UsePostLikeOptions {
  postId: number | undefined
  initialLiked?: boolean
  initialCount?: number
}

interface UsePostLikeResult {
  isLiked: boolean
  likeCount: number
  handleLike: () => Promise<void>
  error: Error | null
}

export function usePostLike({
  postId,
  initialLiked = false,
  initialCount = 0,
}: UsePostLikeOptions): UsePostLikeResult {
  const [isLiked, setIsLiked] = useState(initialLiked)
  const [likeCount, setLikeCount] = useState(initialCount)
  const [error, setError] = useState<Error | null>(null)

  const handleLike = async () => {
    if (!postId) return

    const newIsLiked = !isLiked
    const newLikeCount = newIsLiked ? likeCount + 1 : likeCount - 1

    setIsLiked(newIsLiked)
    setLikeCount(newLikeCount)
    setError(null)

    try {
      if (newIsLiked) {
        await postApi.likePost(postId)
      } else {
        await postApi.unlikePost(postId)
      }
    } catch (err) {
      console.error('Failed to like/unlike post:', err)
      setError(err instanceof Error ? err : new Error('Failed to like/unlike post'))
      setIsLiked(!newIsLiked)
      setLikeCount(likeCount)
    }
  }

  return { isLiked, likeCount, handleLike, error }
}
