import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Header from '@/components/Header'
import CommentList from '@/components/CommentList'
import Footer from '@/components/Footer'
import { postApi, commentApi } from '@/api'
import { useAuth } from '@/features/auth'
import type { PostResponse, CommentResponse } from '@/types'
import { USE_MOCK } from '@/config/env'
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
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    if (postId) {
      loadPost()
      loadRecommendedPosts()
      loadComments()
    }
  }, [postId])

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const loadPost = async () => {
    setIsLoading(true)
    try {
      if (!USE_MOCK && postId) {
        const response = await postApi.getPostById(Number(postId))
        if (response.success && response.data) {
          setPost(response.data)
          setLikeCount(response.data.likeCount || 0)
          setIsLiked(response.data.isLiked || false)
        }
      } else {
        loadMockPost()
      }
    } catch (error) {
      console.error('Failed to load post:', error)
      loadMockPost()
    } finally {
      setIsLoading(false)
    }
  }

  const loadMockPost = () => {
    const mockMarkdown = `# 마크다운으로 작성된 샘플 포스트

복잡한 에디터 없이 **간단한 마크다운**으로도 충분히 구성할 수 있습니다.

## 1. 왜 마크다운인가?
- 텍스트 기반
- 버전 관리에 용이
- 협업 툴과 높은 호환성

> "텍스트는 코드다." 라는 말이 있듯이, 마크다운은 문서를 코드처럼 다루게 해 줍니다.

### 코드 블록
\`\`\`js
function greet(name) {
  return \`안녕하세요, \${name}님!\`;
}
\`\`\`

### 이미지
![Mock](https://via.placeholder.com/960x480/F5F7FB/111?text=Markdown+Preview)

---

표준 HTML 태그와 섞여도 안전하게 렌더링되도록 파싱하고 있습니다.`

    const mockPost: PostResponse = {
      postId: Number(postId) || 1,
      title: '마크다운 샘플 게시글',
      content: mockMarkdown,
      member: {
        memberId: 1,
        id: 1,
        email: 'mock@example.com',
        nickname: 'Mock Writer',
        profileImage: 'https://via.placeholder.com/48',
        handle: 'Tech Writer',
        bio: '',
        role: '',
        company: '',
        location: '',
        primaryStack: [],
        interests: [],
        socialLinks: { github: '', website: '', linkedin: '', notion: '' },
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      imageUrl: 'https://via.placeholder.com/800x450/EEF2FF/4B5BDC?text=Markdown+Mock',
      likeCount: 12,
      viewCount: 123,
      commentCount: 0,
      isLiked: false,
      tags: ['JavaScript', 'Markdown', 'Writing'],
    }

    setPost(mockPost)
    setLikeCount(12)
    setIsLiked(false)
  }

  const loadRecommendedPosts = async () => {
    try {
      if (!USE_MOCK && postId) {
        const response = await postApi.getPosts({ page: 0, size: 3 })
        if (response.success && response.data) {
          const recommendations: RecommendedPost[] = response.data.items
            .filter((p) => p.postId !== Number(postId))
            .slice(0, 3)
            .map((p) => ({
              id: p.postId,
              title: p.title,
              category: 'TECH INSIGHT',
              date: p.createdAt,
            }))
          setRecommendedPosts(recommendations)
        }
      } else {
        const mockRecommended: RecommendedPost[] = [
          {
            id: 2,
            title: 'React 성능 최적화 가이드',
            category: 'TECH INSIGHT',
            date: new Date(Date.now() - 86400000).toISOString(),
          },
          {
            id: 3,
            title: 'TypeScript 고급 타입 활용하기',
            category: 'TECH INSIGHT',
            date: new Date(Date.now() - 2 * 86400000).toISOString(),
          },
          {
            id: 4,
            title: 'Vite로 빠른 개발 환경 구축하기',
            category: 'TECH INSIGHT',
            date: new Date(Date.now() - 3 * 86400000).toISOString(),
          },
        ]
        setRecommendedPosts(mockRecommended)
      }
    } catch (error) {
      console.error('Failed to load recommended posts:', error)
    }
  }

  const loadComments = async () => {
    try {
      if (!USE_MOCK && postId) {
        const response = await commentApi.getComments(Number(postId))
        if (response.success && response.data) {
          setComments(response.data.items)
        }
      } else {
        const mockComments: CommentResponse[] = [
          {
            commentId: 1,
            postId: Number(postId),
            content: '정말 유익한 글이네요! 마크다운으로 작성하니 훨씬 깔끔하고 관리하기 편한 것 같아요.',
            member: {
              memberId: 2,
              id: 2,
              email: 'user1@example.com',
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
          {
            commentId: 2,
            postId: Number(postId),
            content: '코드 블록 부분이 특히 마음에 드네요. 다음 프로젝트에 적용해봐야겠습니다!',
            member: {
              memberId: 3,
              id: 3,
              email: 'user2@example.com',
              nickname: 'DevNinja',
              profileImage:
                'https://ui-avatars.com/api/?name=DevNinja&background=764ba2&color=fff&size=128',
              handle: 'Backend Engineer',
              bio: '',
              role: 'Backend Engineer',
              company: 'Startup Co',
              location: 'Busan',
              primaryStack: ['Node.js', 'Express'],
              interests: ['Backend'],
              socialLinks: { github: '', website: '', linkedin: '', notion: '' },
            },
            createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          },
        ]
        setComments(mockComments)
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

    if (!USE_MOCK) {
      try {
        await postApi.likePost(post.postId)
      } catch (error) {
        console.error('Failed to like post:', error)
        setIsLiked(!newIsLiked)
        setLikeCount(likeCount)
      }
    }
  }

  const handleCommentSubmit = async (text: string) => {
    if (!postId) return

    try {
      if (!USE_MOCK) {
        const response = await commentApi.createComment(Number(postId), { content: text })
        if (response.success && response.data) {
          setComments([...comments, response.data])
        }
      } else {
        const mockComment: CommentResponse = {
          commentId: comments.length + 1,
          postId: Number(postId),
          content: text,
          member: user || {
            memberId: 1,
            id: 1,
            email: 'current@example.com',
            nickname: user?.nickname || 'Current User',
            profileImage:
              user?.profileImage ||
              'https://ui-avatars.com/api/?name=User&background=667eea&color=fff&size=128',
            handle: '',
            bio: '',
            role: '',
            company: '',
            location: '',
            primaryStack: [],
            interests: [],
            socialLinks: { github: '', website: '', linkedin: '', notion: '' },
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        setComments([...comments, mockComment])
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}년 ${month}월 ${day}일`
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
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
              <span className={styles.postDate}>{formatDate(post.createdAt)}</span>
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
                  <div className={styles.recommendedItemMeta}>{formatDate(recPost.date)}</div>
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

      <button
        className={`${styles.scrollTopBtn} ${showScrollTop ? styles.visible : ''}`}
        onClick={scrollToTop}
        aria-label="맨 위로 이동"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M18 15l-6-6-6 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <Footer />
    </div>
  )
}
