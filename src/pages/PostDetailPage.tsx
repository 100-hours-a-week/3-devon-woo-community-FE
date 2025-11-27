import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Header from '@/components/Header'
import CommentList from '@/components/CommentList'
import Footer from '@/components/Footer'
import ScrollToTopButton from '@/components/ScrollToTopButton'
import { postApi, commentApi } from '@/api'
import { useAuth } from '@/features/auth'
import type { PostResponse, CommentResponse } from '@/types'
import { formatDateLong } from '@/utils/formatters'
import styles from './PostDetailPage.module.css'

interface RecommendedPost {
  id: number
  title: string
  category: string
  date: string
}

export default function PostDetailPage() {
  const { postId } = useParams<{ postId: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [post, setPost] = useState<PostResponse | null>(null)
  const [comments, setComments] = useState<CommentResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [likeCount, setLikeCount] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [recommendedPosts, setRecommendedPosts] = useState<RecommendedPost[]>([])

  useEffect(() => {
    if (postId) {
      loadPost()
      loadRecommendedPosts()
      loadComments()
    }
  }, [postId])


  const loadPost = async () => {
    setIsLoading(true)
    try {
      if (postId) {
        const response = await postApi.getPostById(Number(postId))
        if (response.success && response.data) {
          setPost(response.data)
          setLikeCount(response.data.likeCount || 0)
          setIsLiked(response.data.isLiked || false)
        } else {
          setPost(null)
        }
      }
    } catch (error) {
      console.error('Failed to load post:', error)
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
            .filter(p => p.postId !== Number(postId))
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
    try {
      if (postId) {
        const response = await commentApi.getComments(Number(postId))
        if (response.success && response.data) {
          setComments(response.data.items)
        }
      }
    } catch (error) {
      console.error('Failed to load comments:', error)
    }
  }

  const handleLikeClick = async () => {
    if (!post) return

    const newIsLiked = !isLiked
    const newLikeCount = newIsLiked ? likeCount + 1 : likeCount - 1

    setIsLiked(newIsLiked)
    setLikeCount(newLikeCount)

    try {
      await postApi.likePost(post.postId)
    } catch (error) {
      console.error('Failed to like post:', error)
      setIsLiked(!newIsLiked)
      setLikeCount(likeCount)
    }
  }

  const handleCommentSubmit = async (text: string) => {
    if (!postId) return

    try {
      const response = await commentApi.createComment(Number(postId), { content: text })
      if (response.success && response.data) {
        setComments([...comments, response.data])
      }
    } catch (error) {
      console.error('Failed to create comment:', error)
      throw error
    }
  }

  const handleCommentLike = (commentId: number, isLiked: boolean) => {
    console.log(`Comment ${commentId} ${isLiked ? 'liked' : 'unliked'}`)
  }

  const handleCommentReply = (commentId: number) => {
    alert(`댓글 ${commentId}번에 답글을 작성합니다.`)
  }

  const handleCommentEdit = (commentId: number) => {
    alert(`댓글 ${commentId}번을 수정합니다.`)
  }

  const handleRecommendedClick = (postId: number) => {
    navigate(`/posts/${postId}`)
  }



  if (isLoading) {
    return (
      <div className={styles.postDetailPage}>
        <Header />
        <main className={styles.postDetailMain}>
          <div className={styles.loading}>게시글을 불러오는 중...</div>
        </main>
      </div>
    )
  }

  if (!post) {
    return (
      <div className={styles.postDetailPage}>
        <Header />
        <main className={styles.postDetailMain}>
          <div className={styles.loading}>게시글을 찾을 수 없습니다.</div>
        </main>
      </div>
    )
  }

  return (
    <div className={styles.postDetailPage}>
      <Header />

      <main className={styles.postDetailMain}>
        <article className={styles.postDetail}>
          <div className={styles.postHeader}>
            <div className={styles.postCategory}>TECH INSIGHT</div>
            <h1 className={styles.postTitle}>{post.title}</h1>
            <div className={styles.postMeta}>
              <span className={styles.postAuthor}>{post.member.nickname}</span>
              <span className={styles.postDivider}>|</span>
              <span className={styles.postDate}>{formatDateLong(post.createdAt)}</span>
            </div>
            <div className={styles.postActions}>
              <button
                className={`${styles.likeBtn} ${isLiked ? styles.liked : ''}`}
                onClick={handleLikeClick}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M10 17.5L8.5 16.2C4 12.1 1 9.4 1 6.1C1 3.4 3.1 1.3 5.8 1.3C7.3 1.3 8.8 2 10 3.1C11.2 2 12.7 1.3 14.2 1.3C16.9 1.3 19 3.4 19 6.1C19 9.4 16 12.1 11.5 16.2L10 17.5Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>{likeCount}</span>
              </button>
            </div>
          </div>

          {post.imageUrl && (
            <div className={styles.postThumbnail}>
              <img src={post.imageUrl} alt={post.title} />
            </div>
          )}

          <div className={styles.postContent}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
          </div>
        </article>

        {recommendedPosts.length > 0 && (
          <section className={styles.recommendedPosts}>
            <h3 className={styles.sectionTitle}>추천 게시글</h3>
            <div className={styles.recommendedList}>
              {recommendedPosts.map((recPost) => (
                <div
                  key={recPost.id}
                  className={styles.recommendedItem}
                  onClick={() => handleRecommendedClick(recPost.id)}
                >
                  <div className={styles.recommendedItemCategory}>{recPost.category}</div>
                  <div className={styles.recommendedItemTitle}>{recPost.title}</div>
                  <div className={styles.recommendedItemMeta}>{formatDateLong(recPost.date)}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        <CommentList
          comments={comments}
          onLike={handleCommentLike}
          onReply={handleCommentReply}
          onCommentSubmit={handleCommentSubmit}
          userProfileImage={user?.profileImage || 'https://via.placeholder.com/48/CCCCCC/666?text=U'}
          currentUserId={user?.memberId}
          onEdit={handleCommentEdit}
        />
      </main>

      <ScrollToTopButton />

      <Footer />
    </div>
  )
}
