import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import Header from '@/components/Header'
import BlogCard from '@/components/BlogCard'
import { memberApi, postApi } from '@/api'
import { useAuth } from '@/features/auth'
import type { MemberResponse, PostSummaryResponse } from '@/types'
import { USE_MOCK } from '@/config/env'
import styles from './ProfilePage.module.css'

export default function ProfilePage() {
  const { memberId } = useParams<{ memberId?: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [profile, setProfile] = useState<MemberResponse | null>(null)
  const [posts, setPosts] = useState<PostSummaryResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const isOwner = !memberId || (user && user.memberId === Number(memberId))

  useEffect(() => {
    loadProfile()
    loadPosts()
  }, [memberId])

  const loadProfile = async () => {
    if (!USE_MOCK) {
      try {
        const response = await memberApi.getProfile(
          memberId ? Number(memberId) : undefined
        )
        if (response.success && response.data) {
          setProfile(response.data)
        }
      } catch (error) {
        console.error('Failed to load profile:', error)
      } finally {
        setIsLoading(false)
      }
    } else {
      const mockProfile: MemberResponse = {
        memberId: Number(memberId) || user?.memberId || 1,
        id: Number(memberId) || user?.id || 1,
        email: 'dev@example.com',
        nickname: user?.nickname || 'DevUser',
        profileImage:
          user?.profileImage ||
          'https://ui-avatars.com/api/?name=DevUser&background=667eea&color=fff&size=160',
        handle: 'Backend Engineer / Tech Enthusiast',
        bio: 'MSA 기반 백엔드 아키텍처와 대규모 트래픽 대응 경험이 있는 개발자입니다.',
        role: 'Backend Engineer',
        company: 'Tech Corp',
        location: 'Seoul, Korea',
        primaryStack: ['Java', 'Spring Boot', 'JPA', 'MySQL', 'AWS'],
        interests: ['서버 아키텍처', '대규모 트래픽 처리', 'DevOps'],
        socialLinks: {
          github: 'https://github.com/devuser',
          website: 'https://blog.devuser.com',
          linkedin: 'https://linkedin.com/in/devuser',
          notion: 'https://notion.so/devuser',
        },
      }
      setProfile(mockProfile)
      setIsLoading(false)
    }
  }

  const loadPosts = async () => {
    const targetMemberId = memberId ? Number(memberId) : user?.memberId

    if (!USE_MOCK && targetMemberId) {
      try {
        const response = await postApi.getPosts({
          memberId: targetMemberId,
          page: 0,
          size: 20,
        })
        if (response.success && response.data) {
          setPosts(response.data.items)
        }
      } catch (error) {
        console.error('Failed to load posts:', error)
      }
    } else {
      const mockPosts: PostSummaryResponse[] = Array.from({ length: 5 }, (_, i) => ({
        postId: i + 1,
        title: `Sample Post ${i + 1}`,
        summary: 'This is a sample post summary.',
        thumbnail: `https://picsum.photos/seed/profile${i}/800/400`,
        member: profile || ({} as any),
        createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
        viewCount: Math.floor(Math.random() * 1000),
        likeCount: Math.floor(Math.random() * 100),
        commentCount: Math.floor(Math.random() * 50),
      }))
      setPosts(mockPosts)
    }
  }

  if (isLoading) {
    return (
      <div className={styles.profilePage}>
        <Header />
        <div className={styles.loading}>프로필을 불러오는 중...</div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className={styles.profilePage}>
        <Header />
        <div className={styles.loading}>프로필을 찾을 수 없습니다.</div>
      </div>
    )
  }

  return (
    <div className={styles.profilePage}>
      <Header />

      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.profileCard}>
            <div className={styles.profileHeader}>
              <img
                src={profile.profileImage}
                alt={profile.nickname}
                className={styles.profileImage}
              />
              <div className={styles.profileInfo}>
                <h1 className={styles.nickname}>{profile.nickname}</h1>
                {profile.handle && <p className={styles.handle}>{profile.handle}</p>}
                {profile.bio && <p className={styles.bio}>{profile.bio}</p>}
              </div>
              {isOwner && (
                <Link to="/profile/edit" className={styles.editBtn}>
                  프로필 수정
                </Link>
              )}
            </div>

            <div className={styles.profileDetails}>
              {profile.company && (
                <div className={styles.detailItem}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M2 14h12M3 14V4h4V2h2v2h4v10M6 7h1M6 10h1M9 7h1M9 10h1"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span>{profile.company}</span>
                </div>
              )}
              {profile.location && (
                <div className={styles.detailItem}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M8 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M8 14s-5-4-5-8a5 5 0 0 1 10 0c0 4-5 8-5 8z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>{profile.location}</span>
                </div>
              )}
            </div>

            {profile.primaryStack && profile.primaryStack.length > 0 && (
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>주요 기술 스택</h3>
                <div className={styles.tags}>
                  {profile.primaryStack.map(tech => (
                    <span key={tech} className={styles.tag}>
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {profile.interests && profile.interests.length > 0 && (
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>관심 분야</h3>
                <div className={styles.tags}>
                  {profile.interests.map(interest => (
                    <span key={interest} className={styles.tag}>
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {profile.socialLinks && (
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>소셜 링크</h3>
                <div className={styles.socialLinks}>
                  {profile.socialLinks.github && (
                    <a
                      href={profile.socialLinks.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.socialLink}
                    >
                      GitHub
                    </a>
                  )}
                  {profile.socialLinks.website && (
                    <a
                      href={profile.socialLinks.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.socialLink}
                    >
                      Website
                    </a>
                  )}
                  {profile.socialLinks.linkedin && (
                    <a
                      href={profile.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.socialLink}
                    >
                      LinkedIn
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className={styles.postsSection}>
            <h2 className={styles.postsTitle}>작성한 글</h2>
            {posts.length > 0 ? (
              <div className={styles.postsGrid}>
                {posts.map(post => (
                  <BlogCard key={post.postId} post={post} />
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>작성한 글이 없습니다.</div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
