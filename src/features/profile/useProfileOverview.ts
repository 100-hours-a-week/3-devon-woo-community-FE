import { useEffect, useState } from 'react'
import { memberApi, postApi } from '@/api'
import type { MemberResponse } from '@/types'

const DEFAULT_PROFILE_IMAGE =
  'https://ui-avatars.com/api/?name=SH+Woo&background=2563eb&color=fff&size=160'
const DEFAULT_DEVELOPER_PROFILE = {
  nickname: 'SH Woo',
  handle: 'Fullstack Developer / TypeScript Enthusiast',
  bio: '프론트엔드와 백엔드를 넘나들며 커뮤니티 서비스를 만드는 개발자 SH Woo 입니다.',
  role: 'Fullstack Engineer',
  company: 'Dev Community',
  location: 'Seoul, Korea',
}
const DEFAULT_PRIMARY_STACK = ['TypeScript', 'React', 'Node.js', 'Vite']
const DEFAULT_INTERESTS = ['Developer Experience', 'Frontend Architecture', 'Open Source']
const DEFAULT_SOCIAL_LINKS = {
  github: 'https://github.com/sh-woo',
  website: 'https://shwoo.dev',
  linkedin: 'https://www.linkedin.com/in/sh-woo',
  notion: 'https://shwoo.notion.site',
}

export interface ProfilePost {
  id: number
  title: string
  excerpt: string
  date: string
  likes: number | null
  views: number
  comments: number
}

interface UseProfileOverviewOptions {
  memberId?: number
  currentUserId?: number
}

interface UseProfileOverviewResult {
  profile: MemberResponse | null
  posts: ProfilePost[]
  isLoading: boolean
  isOwner: boolean
}

export function useProfileOverview({
  memberId,
  currentUserId,
}: UseProfileOverviewOptions): UseProfileOverviewResult {
  const [profile, setProfile] = useState<MemberResponse | null>(null)
  const [posts, setPosts] = useState<ProfilePost[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const isOwner = !memberId || (currentUserId && currentUserId === memberId) || false

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const targetMemberId = memberId || currentUserId

        if (targetMemberId) {
          const [profileResponse, postsResponse] = await Promise.all([
            memberApi.getProfile(targetMemberId),
            postApi.getPosts({ page: 0, size: 6, memberId: targetMemberId }),
          ])

          if (profileResponse.success && profileResponse.data) {
            setProfile(normalizeProfile(profileResponse.data))
          } else {
            setProfile(null)
          }

          if (postsResponse.success && postsResponse.data) {
            setPosts(normalizePosts(postsResponse.data.items))
          } else {
            setPosts([])
          }
        } else {
          setProfile(createDefaultProfile())
          setPosts(createDefaultPosts())
        }
      } catch (error) {
        console.error('Failed to load profile data:', error)
        setProfile(null)
        setPosts([])
      } finally {
        setIsLoading(false)
      }
    }

    void loadProfileData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memberId, currentUserId])

  return {
    profile,
    posts,
    isLoading,
    isOwner,
  }
}

function normalizeProfile(data: any): MemberResponse {
  return {
    ...data,
    profileImage: data.profileImage || DEFAULT_PROFILE_IMAGE,
    nickname: data.nickname || DEFAULT_DEVELOPER_PROFILE.nickname,
    handle: data.handle || DEFAULT_DEVELOPER_PROFILE.handle,
    bio: data.bio || DEFAULT_DEVELOPER_PROFILE.bio,
    role: data.role || DEFAULT_DEVELOPER_PROFILE.role,
    company: data.company || DEFAULT_DEVELOPER_PROFILE.company,
    location: data.location || DEFAULT_DEVELOPER_PROFILE.location,
    primaryStack: data.primaryStack?.length ? data.primaryStack : DEFAULT_PRIMARY_STACK,
    interests: data.interests?.length ? data.interests : DEFAULT_INTERESTS,
    socialLinks: {
      github: data.socialLinks?.github || DEFAULT_SOCIAL_LINKS.github,
      website: data.socialLinks?.website || DEFAULT_SOCIAL_LINKS.website,
      linkedin: data.socialLinks?.linkedin || DEFAULT_SOCIAL_LINKS.linkedin,
      notion: data.socialLinks?.notion || DEFAULT_SOCIAL_LINKS.notion,
    },
  }
}

function normalizePosts(items: any[]): ProfilePost[] {
  if (!items.length) {
    return createDefaultPosts()
  }

  return items.map(post => ({
    id: post.postId,
    title: post.title,
    excerpt: `${post.title}에 대한 생각을 정리했습니다.`,
    date: post.createdAt,
    likes: post.likeCount || 0,
    views: post.viewCount || 0,
    comments: post.commentCount || 0,
  }))
}

function createDefaultProfile(): MemberResponse {
  return normalizeProfile({
    nickname: DEFAULT_DEVELOPER_PROFILE.nickname,
    handle: DEFAULT_DEVELOPER_PROFILE.handle,
    bio: DEFAULT_DEVELOPER_PROFILE.bio,
    role: DEFAULT_DEVELOPER_PROFILE.role,
    company: DEFAULT_DEVELOPER_PROFILE.company,
    location: DEFAULT_DEVELOPER_PROFILE.location,
    primaryStack: DEFAULT_PRIMARY_STACK,
    interests: DEFAULT_INTERESTS,
    socialLinks: DEFAULT_SOCIAL_LINKS,
  })
}

function createDefaultPosts(): ProfilePost[] {
  return Array.from({ length: 5 }, (_, idx) => ({
    id: idx + 1,
    title: `새로운 기술 노트 ${idx + 1}`,
    excerpt: '아직 게시글이 없어요. 첫 번째 글을 작성해보세요.',
    date: new Date(Date.now() - idx * 86400000).toISOString(),
    likes: 0,
    views: 0,
    comments: 0,
  }))
}

