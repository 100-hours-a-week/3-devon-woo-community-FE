import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Header from '@/components/Header'
import ProfileCard from '@/components/ProfileCard'
import ScrollToTopButton from '@/components/ScrollToTopButton'
import { memberApi, postApi } from '@/api'
import { useAuth } from '@/features/auth'
import type { MemberResponse } from '@/types'
import { USE_MOCK } from '@/config/env'
import { formatDateDot } from '@/utils/formatters'
import styles from './ProfilePage.module.css'

const POSTS_PER_PAGE = 5
const DEFAULT_PROFILE_IMAGE = 'https://via.placeholder.com/160?text=Profile'
const DEFAULT_DEVELOPER_PROFILE = {
  nickname: '홍길동',
  handle: 'Backend Developer / Java Enthusiast',
  bio: 'MSA 기반 백엔드 아키텍처와 대규모 트래픽 대응 경험이 있는 Java/Spring 개발자입니다.',
  role: 'Backend Engineer',
  company: 'Codestate Labs',
  location: 'Seoul, Korea'
}
const DEFAULT_PRIMARY_STACK = ['Java', 'Spring Boot', 'JPA', 'MySQL', 'AWS']
const DEFAULT_INTERESTS = ['서버 아키텍처', '대규모 트래픽 처리', 'Event-driven Design', 'DevOps 자동화']
const DEFAULT_SOCIAL_LINKS = {
  github: 'https://github.com/codestate-dev',
  website: 'https://blog.codestate.dev',
  linkedin: 'https://www.linkedin.com/in/codestate',
  notion: 'https://codestate.notion.site/portfolio'
}

interface Post {
  id: number
  title: string
  excerpt: string
  date: string
  likes: number
  views: number
  comments: number
}

export default function ProfilePage() {
  const { memberId } = useParams<{ memberId?: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [profile, setProfile] = useState<MemberResponse | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [sort, setSort] = useState<'latest' | 'popular' | 'views'>('latest')

  const isOwner = !memberId || (user && user.memberId === Number(memberId))

  useEffect(() => {
    loadProfileData()
  }, [memberId])


  const loadProfileData = async () => {
    try {
      const targetMemberId = memberId ? Number(memberId) : user?.memberId

      if (!USE_MOCK && targetMemberId) {
        const [profileResponse, postsResponse] = await Promise.all([
          memberApi.getProfile(targetMemberId),
          postApi.getPosts({ page: 0, size: 6, memberId: targetMemberId })
        ])

        if (profileResponse.success && profileResponse.data) {
          setProfile(normalizeProfile(profileResponse.data))
        }
        if (postsResponse.success && postsResponse.data) {
          setPosts(normalizePosts(postsResponse.data.items))
        }
      } else {
        const mockProfile: MemberResponse = {
          memberId: targetMemberId || 1,
          id: targetMemberId || 1,
          email: 'dev@example.com',
          nickname: DEFAULT_DEVELOPER_PROFILE.nickname,
          profileImage: DEFAULT_PROFILE_IMAGE,
          handle: DEFAULT_DEVELOPER_PROFILE.handle,
          bio: DEFAULT_DEVELOPER_PROFILE.bio,
          role: DEFAULT_DEVELOPER_PROFILE.role,
          company: DEFAULT_DEVELOPER_PROFILE.company,
          location: DEFAULT_DEVELOPER_PROFILE.location,
          primaryStack: DEFAULT_PRIMARY_STACK,
          interests: DEFAULT_INTERESTS,
          socialLinks: DEFAULT_SOCIAL_LINKS,
        }
        setProfile(mockProfile)

        const mockPosts: Post[] = Array.from({ length: 5 }, (_, idx) => ({
          id: idx + 1,
          title: `새로운 기술 노트 ${idx + 1}`,
          excerpt: '아직 게시글이 없어요. 첫 번째 글을 작성해보세요.',
          date: new Date(Date.now() - idx * 86400000).toISOString(),
          likes: 0,
          views: 0,
          comments: 0
        }))
        setPosts(mockPosts)
      }
    } catch (error) {
      console.error('Failed to load profile data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const normalizeProfile = (data: any): MemberResponse => {
    return {
      ...data,
      primaryStack: data.primaryStack?.length ? data.primaryStack : DEFAULT_PRIMARY_STACK,
      interests: data.interests?.length ? data.interests : DEFAULT_INTERESTS,
      socialLinks: {
        github: data.socialLinks?.github || DEFAULT_SOCIAL_LINKS.github,
        website: data.socialLinks?.website || DEFAULT_SOCIAL_LINKS.website,
        linkedin: data.socialLinks?.linkedin || DEFAULT_SOCIAL_LINKS.linkedin,
        notion: data.socialLinks?.notion || DEFAULT_SOCIAL_LINKS.notion
      }
    }
  }

  const normalizePosts = (items: any[]): Post[] => {
    if (!items.length) {
      return Array.from({ length: 5 }, (_, idx) => ({
        id: idx + 1,
        title: `새로운 기술 노트 ${idx + 1}`,
        excerpt: '아직 게시글이 없어요. 첫 번째 글을 작성해보세요.',
        date: new Date(Date.now() - idx * 86400000).toISOString(),
        likes: 0,
        views: 0,
        comments: 0
      }))
    }

    return items.map((post) => ({
      id: post.postId,
      title: post.title,
      excerpt: `${post.title}에 대한 생각을 정리했습니다.`,
      date: post.createdAt,
      likes: post.likeCount || 0,
      views: post.viewCount || 0,
      comments: post.commentCount || 0
    }))
  }

  const getProcessedPosts = () => {
    const sorted = [...posts]
    if (sort === 'latest') {
      return sorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    }
    if (sort === 'popular') {
      return sorted.sort((a, b) => (b.likes || 0) - (a.likes || 0))
    }
    if (sort === 'views') {
      return sorted.sort((a, b) => (b.views || 0) - (a.views || 0))
    }
    return sorted
  }

  const getPaginatedPosts = () => {
    const processed = getProcessedPosts()
    const start = (currentPage - 1) * POSTS_PER_PAGE
    return processed.slice(start, start + POSTS_PER_PAGE)
  }

  const getTotalPages = () => {
    const total = getProcessedPosts().length || 1
    return Math.max(1, Math.ceil(total / POSTS_PER_PAGE))
  }

  const getPaginationButtons = () => {
    const totalPages = getTotalPages()
    const maxVisible = 5
    const pages: number[] = []

    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2))
    let end = Math.min(totalPages, start + maxVisible - 1)

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1)
    }

    for (let page = start; page <= end; page++) {
      pages.push(page)
    }

    return pages
  }



  if (isLoading) {
    return (
      <div className={styles.profilePage}>
        <Header />
        <div className={styles.loading}>
          <div className={styles.loadingSpinner} />
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className={styles.profilePage}>
        <Header />
        <div className={styles.emptyState}>프로필을 찾을 수 없습니다.</div>
      </div>
    )
  }

  const paginatedPosts = getPaginatedPosts()
  const totalPages = getTotalPages()

  return (
    <div className={styles.profilePage}>
      <Header />

      <div className={styles.mainContainer}>
        <ProfileCard profile={profile} isOwner={isOwner} />

        <section className={styles.postsSection}>
          <div className={styles.postsHeader}>
            <h2>기술 블로그</h2>
            <div className={styles.sortOptions}>
              <button
                className={`${styles.sortBtn} ${sort === 'latest' ? styles.active : ''}`}
                onClick={() => {
                  setSort('latest')
                  setCurrentPage(1)
                }}
              >
                최신순
              </button>
              <button
                className={`${styles.sortBtn} ${sort === 'popular' ? styles.active : ''}`}
                onClick={() => {
                  setSort('popular')
                  setCurrentPage(1)
                }}
              >
                인기순
              </button>
              <button
                className={`${styles.sortBtn} ${sort === 'views' ? styles.active : ''}`}
                onClick={() => {
                  setSort('views')
                  setCurrentPage(1)
                }}
              >
                조회순
              </button>
            </div>
          </div>

          {paginatedPosts.length > 0 ? (
            <div className={styles.postsList}>
              {paginatedPosts.map((post) => (
                <article
                  key={post.id}
                  className={styles.postCard}
                  onClick={() => navigate(`/posts/${post.id}`)}
                >
                  <h3 className={styles.postCardTitle}>{post.title}</h3>
                  <div className={styles.postCardDate}>{formatDateDot(post.date)}</div>
                  <p className={styles.postCardExcerpt}>{post.excerpt}</p>
                </article>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>게시글이 없습니다.</div>
          )}

          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                className={styles.paginationBtn}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                &lt;
              </button>
              <div className={styles.paginationNumbers}>
                {getPaginationButtons().map(page => (
                  <button
                    key={page}
                    className={`${styles.paginationNumber} ${page === currentPage ? styles.active : ''}`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                className={styles.paginationBtn}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
              >
                &gt;
              </button>
            </div>
          )}
        </section>
      </div>

      <ScrollToTopButton threshold={200} />
    </div>
  )
}
