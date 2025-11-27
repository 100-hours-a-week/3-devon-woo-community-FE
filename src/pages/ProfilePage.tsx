import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Header from '@/components/Header'
import ProfileCard from '@/components/ProfileCard'
import ScrollToTopButton from '@/components/ScrollToTopButton'
import Pagination from '@/components/Pagination'
import { memberApi, postApi } from '@/api'
import { useAuth } from '@/features/auth'
import type { MemberResponse } from '@/types'
import { formatDateDot } from '@/utils/formatters'
import styles from './ProfilePage.module.css'

const POSTS_PER_PAGE = 5
const DEFAULT_PROFILE_IMAGE =
  'https://ui-avatars.com/api/?name=SH+Woo&background=2563eb&color=fff&size=160'
const DEFAULT_DEVELOPER_PROFILE = {
  nickname: 'SH Woo',
  handle: 'Fullstack Developer / TypeScript Enthusiast',
  bio: '프론트엔드와 백엔드를 넘나들며 커뮤니티 서비스를 만드는 개발자 SH Woo 입니다.',
  role: 'Fullstack Engineer',
  company: 'Dev Community',
  location: 'Seoul, Korea'
}
const DEFAULT_PRIMARY_STACK = ['TypeScript', 'React', 'Node.js', 'Vite']
const DEFAULT_INTERESTS = ['Developer Experience', 'Frontend Architecture', 'Open Source']
const DEFAULT_SOCIAL_LINKS = {
  github: 'https://github.com/sh-woo',
  website: 'https://shwoo.dev',
  linkedin: 'https://www.linkedin.com/in/sh-woo',
  notion: 'https://shwoo.notion.site'
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

      if (targetMemberId) {
        const [profileResponse, postsResponse] = await Promise.all([
          memberApi.getProfile(targetMemberId),
          postApi.getPosts({ page: 0, size: 6, memberId: targetMemberId }),
        ])

        if (profileResponse.success && profileResponse.data) {
          setProfile(normalizeProfile(profileResponse.data))
        }
        if (postsResponse.success && postsResponse.data) {
          setPosts(normalizePosts(postsResponse.data.items))
        }
      } else {
        setProfile(null)
        setPosts([])
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

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </section>
      </div>

      <ScrollToTopButton threshold={200} />
    </div>
  )
}
