import { useState, useEffect } from 'react'
import { postApi, commentApi } from '@/api'
import type { PostResponse, CommentResponse } from '@/types'

interface RecommendedPost {
  id: number
  title: string
  category: string
  date: string
}

interface UsePostDetailOptions {
  postId: number | undefined
}

interface UsePostDetailResult {
  post: PostResponse | null
  comments: CommentResponse[]
  likeCount: number
  isLiked: boolean
  recommendedPosts: RecommendedPost[]
  isLoading: boolean
  error: Error | null
  handleLike: () => Promise<void>
  handleCommentSubmit: (text: string) => Promise<void>
  refreshComments: () => Promise<void>
}

export function usePostDetail({ postId }: UsePostDetailOptions): UsePostDetailResult {
  const [post, setPost] = useState<PostResponse | null>(null)
  const [comments, setComments] = useState<CommentResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [likeCount, setLikeCount] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [recommendedPosts, setRecommendedPosts] = useState<RecommendedPost[]>([])
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (postId) {
      loadPost()
      loadRecommendedPosts()
      loadComments()
    }
  }, [postId])

  const loadPost = async () => {
    if (!postId) return

    setIsLoading(true)
    setError(null)
    try {
      const response = await postApi.getPostById(postId)
      if (response.success && response.data) {
        setPost(response.data)
        setLikeCount(response.data.likeCount || 0)
        setIsLiked(response.data.isLiked || false)
      } else {
        setPost(null)
        setError(new Error(response.message || '게시글을 불러오지 못했습니다.'))
      }
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error('게시글을 불러오지 못했습니다.')
      setError(errorObj)
      setPost(null)
    } finally {
      setIsLoading(false)
    }
  }

  const loadRecommendedPosts = async () => {
    try {
      if (postId) {
        const response = await postApi.getPosts({ page: 0, size: 3 })
        if (response.success && response.data) {
          const recommendations: RecommendedPost[] = response.data.items
            .filter(p => p.postId !== postId)
            .slice(0, 3)
            .map(p => ({
              id: p.postId,
              title: p.title,
              category: 'TECH INSIGHT',
              date: p.createdAt,
            }))
          setRecommendedPosts(recommendations)
        }
      }
    } catch (error) {
      console.error('Failed to load recommended posts:', error)
    }
  }

  const loadComments = async () => {
    if (!postId) return

    try {
      const response = await commentApi.getComments(postId)
      if (response.success && response.data) {
        setComments(response.data.items)
      }
    } catch (err) {
      console.error('Failed to load comments:', err)
    }
  }

  const handleLike = async () => {
    if (!post) return

    const newIsLiked = !isLiked
    const newLikeCount = newIsLiked ? likeCount + 1 : likeCount - 1

    setIsLiked(newIsLiked)
    setLikeCount(newLikeCount)

    try {
      if (newIsLiked) {
        await postApi.likePost(post.postId)
      } else {
        await postApi.unlikePost(post.postId)
      }
    } catch (error) {
      console.error('Failed to like/unlike post:', error)
      setIsLiked(!newIsLiked)
      setLikeCount(likeCount)
    }
  }

  const handleCommentSubmit = async (text: string) => {
    if (!postId) return

    try {
      const response = await commentApi.createComment(postId, { content: text })
      if (response.success && response.data) {
        setComments([...comments, response.data])
      }
    } catch (error) {
      console.error('Failed to create comment:', error)
      throw error
    }
  }

  const refreshComments = async () => {
    await loadComments()
  }

  return {
    post,
    comments,
    likeCount,
    isLiked,
    recommendedPosts,
    isLoading,
    error,
    handleLike,
    handleCommentSubmit,
    refreshComments,
  }
}
