import { useEffect, useState } from 'react'
import { memberApi, postApi } from '@/api'
import type { MemberResponse } from '@/types'
import { DEFAULT_PROFILE_CONFIG } from '@/config/defaults'

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
    profileImage: data.profileImage || DEFAULT_PROFILE_CONFIG.image,
    nickname: data.nickname || DEFAULT_PROFILE_CONFIG.profile.nickname,
    handle: data.handle || DEFAULT_PROFILE_CONFIG.profile.handle,
    bio: data.bio || DEFAULT_PROFILE_CONFIG.profile.bio,
    role: data.role || DEFAULT_PROFILE_CONFIG.profile.role,
    company: data.company || DEFAULT_PROFILE_CONFIG.profile.company,
    location: data.location || DEFAULT_PROFILE_CONFIG.profile.location,
    primaryStack: data.primaryStack?.length ? data.primaryStack : DEFAULT_PROFILE_CONFIG.primaryStack,
    interests: data.interests?.length ? data.interests : DEFAULT_PROFILE_CONFIG.interests,
    socialLinks: {
      github: data.socialLinks?.github || DEFAULT_PROFILE_CONFIG.socialLinks.github,
      website: data.socialLinks?.website || DEFAULT_PROFILE_CONFIG.socialLinks.website,
      linkedin: data.socialLinks?.linkedin || DEFAULT_PROFILE_CONFIG.socialLinks.linkedin,
      notion: data.socialLinks?.notion || DEFAULT_PROFILE_CONFIG.socialLinks.notion,
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
    nickname: DEFAULT_PROFILE_CONFIG.profile.nickname,
    handle: DEFAULT_PROFILE_CONFIG.profile.handle,
    bio: DEFAULT_PROFILE_CONFIG.profile.bio,
    role: DEFAULT_PROFILE_CONFIG.profile.role,
    company: DEFAULT_PROFILE_CONFIG.profile.company,
    location: DEFAULT_PROFILE_CONFIG.profile.location,
    primaryStack: DEFAULT_PROFILE_CONFIG.primaryStack,
    interests: DEFAULT_PROFILE_CONFIG.interests,
    socialLinks: DEFAULT_PROFILE_CONFIG.socialLinks,
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

