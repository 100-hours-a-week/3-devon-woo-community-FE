import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Header from '@/components/Header'
import { postApi, commentApi } from '@/api'
import { useAuth } from '@/features/auth'
import type { PostResponse, CommentResponse } from '@/types'
import { formatDate, formatCount } from '@/utils'
import { USE_MOCK } from '@/config/env'
import { generateMockPost } from '@/mocks/postDummy'
import styles from './PostDetailPage.module.css'

export default function PostDetailPage() {
  const { postId } = useParams<{ postId: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [post, setPost] = useState<PostResponse | null>(null)
  const [comments, setComments] = useState<CommentResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [newComment, setNewComment] = useState('')

  useEffect(() => {
    if (postId) {
      loadPost()
      loadComments()
    }
  }, [postId])

  const loadPost = async () => {
    setIsLoading(true)
    try {
      if (USE_MOCK) {
        const mockPost = generateMockPost(Number(postId))
        setPost(mockPost)
      } else {
        const response = await postApi.getPostById(Number(postId))
        if (response.success && response.data) {
          setPost(response.data)
        }
      }
    } catch (error) {
      console.error('Failed to load post:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadComments = async () => {
    if (!USE_MOCK) {
      try {
        const response = await commentApi.getComments(Number(postId))
        if (response.success && response.data) {
          setComments(response.data.items)
        }
      } catch (error) {
        console.error('Failed to load comments:', error)
      }
    } else {
      const mockComments: CommentResponse[] = [
        {
          commentId: 1,
          postId: Number(postId),
          content: '정말 유익한 글이네요!',
          member: {
            memberId: 2,
            id: 2,
            email: 'user@example.com',
            nickname: 'CodeMaster',
            profileImage:
              'https://ui-avatars.com/api/?name=CodeMaster&background=667eea&color=fff&size=128',
            handle: 'Frontend Developer',
            bio: '',
            role: 'Frontend Developer',
            company: 'Tech Inc',
            location: 'Seoul',
            primaryStack: ['React', 'TypeScript'],
            interests: ['Frontend'],
            socialLinks: { github: '', website: '', linkedin: '', notion: '' },
          },
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        },
      ]
      setComments(mockComments)
    }
  }

  const handleLike = async () => {
    if (!post) return
    if (!USE_MOCK) {
      try {
        const response = await postApi.likePost(post.postId)
        if (response.success) {
          setPost({
            ...post,
            isLiked: !post.isLiked,
            likeCount: post.isLiked ? post.likeCount - 1 : post.likeCount + 1,
          })
        }
      } catch (error) {
        console.error('Failed to like post:', error)
      }
    } else {
      setPost({
        ...post,
        isLiked: !post.isLiked,
        likeCount: post.isLiked ? post.likeCount - 1 : post.likeCount + 1,
      })
    }
  }

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || !postId) return

    if (!USE_MOCK) {
      try {
        const response = await commentApi.createComment(Number(postId), {
          content: newComment,
        })
        if (response.success && response.data) {
          setComments([...comments, response.data])
          setNewComment('')
        }
      } catch (error) {
        console.error('Failed to create comment:', error)
      }
    } else {
      const mockComment: CommentResponse = {
        commentId: comments.length + 1,
        postId: Number(postId),
        content: newComment,
        member: user || ({} as any),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setComments([...comments, mockComment])
      setNewComment('')
    }
  }

  if (isLoading) {
    return (
      <div className={styles.postDetailPage}>
        <Header variant="minimal" />
        <div className={styles.loading}>게시글을 불러오는 중...</div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className={styles.postDetailPage}>
        <Header variant="minimal" />
        <div className={styles.loading}>게시글을 찾을 수 없습니다.</div>
      </div>
    )
  }

  return (
    <div className={styles.postDetailPage}>
      <Header variant="minimal" />

      <main className={styles.main}>
        <article className={styles.post}>
          <div className={styles.postHeader}>
            <h1 className={styles.title}>{post.title}</h1>
            <div className={styles.meta}>
              <span className={styles.author}>{post.member.nickname}</span>
              <span className={styles.divider}>|</span>
              <span className={styles.date}>{formatDate(post.createdAt)}</span>
            </div>
            <div className={styles.actions}>
              <button
                className={`${styles.likeBtn} ${post.isLiked ? styles.liked : ''}`}
                onClick={handleLike}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M10 17.5L8.5 16.2C4 12.1 1 9.4 1 6.1C1 3.4 3.1 1.3 5.8 1.3C7.3 1.3 8.8 2 10 3.1C11.2 2 12.7 1.3 14.2 1.3C16.9 1.3 19 3.4 19 6.1C19 9.4 16 12.1 11.5 16.2L10 17.5Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    fill={post.isLiked ? 'currentColor' : 'none'}
                  />
                </svg>
                <span>{formatCount(post.likeCount)}</span>
              </button>
              <span className={styles.stat}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M10 3C5.5 3 2 5.61 1 9c1 3.39 4.5 6 9 6s8-2.61 9-6c-1-3.39-4.5-6-9-6zm0 10a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0-2.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"
                    fill="currentColor"
                  />
                </svg>
                {formatCount(post.viewCount)}
              </span>
            </div>
          </div>

          {post.imageUrl && (
            <div className={styles.thumbnail}>
              <img src={post.imageUrl} alt={post.title} />
            </div>
          )}

          <div className={styles.content}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className={styles.tags}>
              {post.tags.map(tag => (
                <span key={tag} className={styles.tag}>
                  {tag}
                </span>
              ))}
            </div>
          )}
        </article>

        <section className={styles.commentsSection}>
          <h2 className={styles.commentsTitle}>
            댓글 <span>{comments.length}</span>
          </h2>

          {user && (
            <form className={styles.commentForm} onSubmit={handleCommentSubmit}>
              <textarea
                className={styles.commentInput}
                placeholder="댓글을 작성하세요..."
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                rows={3}
              />
              <button type="submit" className={styles.commentSubmitBtn}>
                댓글 작성
              </button>
            </form>
          )}

          <div className={styles.commentsList}>
            {comments.map(comment => (
              <div key={comment.commentId} className={styles.comment}>
                <img
                  src={comment.member.profileImage}
                  alt={comment.member.nickname}
                  className={styles.commentAvatar}
                />
                <div className={styles.commentContent}>
                  <div className={styles.commentHeader}>
                    <span className={styles.commentAuthor}>
                      {comment.member.nickname}
                    </span>
                    <span className={styles.commentDate}>
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>
                  <p className={styles.commentText}>{comment.content}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
