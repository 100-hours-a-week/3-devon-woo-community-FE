import { useCallback, useMemo, useState } from 'react'
import type { CommentResponse } from '@/types'

export type CommentSortOption = 'latest' | 'oldest'

interface LikeState {
  isLiked: boolean
  likeCount: number
}

export function useCommentInteractions(comments: CommentResponse[]) {
  const [sortBy, setSortBy] = useState<CommentSortOption>('latest')
  const [likeState, setLikeState] = useState<Record<number, LikeState>>({})

  const sortedComments = useMemo(() => {
    const sorted = [...comments]
    return sorted.sort((a, b) => {
      const aDate = new Date(a.createdAt).getTime()
      const bDate = new Date(b.createdAt).getTime()
      return sortBy === 'latest' ? bDate - aDate : aDate - bDate
    })
  }, [comments, sortBy])

  const toggleLike = useCallback((commentId: number) => {
    let nextLiked = false

    setLikeState(prev => {
      const prevEntry = prev[commentId] ?? { isLiked: false, likeCount: 0 }
      nextLiked = !prevEntry.isLiked
      const nextCount = Math.max(0, prevEntry.likeCount + (nextLiked ? 1 : -1))

      return {
        ...prev,
        [commentId]: {
          isLiked: nextLiked,
          likeCount: nextCount,
        },
      }
    })

    return nextLiked
  }, [])

  const getLikeState = useCallback(
    (commentId: number): LikeState => {
      return likeState[commentId] ?? { isLiked: false, likeCount: 0 }
    },
    [likeState]
  )

  return {
    sortBy,
    setSortBy,
    sortedComments,
    toggleLike,
    getLikeState,
  }
}

export default useCommentInteractions
