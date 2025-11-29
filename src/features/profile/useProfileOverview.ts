import { useEffect, useState } from 'react'
import { memberApi, postApi } from '@/api'
import type { MemberResponse } from '@/types'
import { USE_MOCK } from '@/config/env'

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
  error: Error | null
}

export function useProfileOverview({
  memberId,
  currentUserId,
}: UseProfileOverviewOptions): UseProfileOverviewResult {
  const [profile, setProfile] = useState<MemberResponse | null>(null)
  const [posts, setPosts] = useState<ProfilePost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const isOwner = memberId ? currentUserId === memberId : !!currentUserId

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        setError(null)
        const targetMemberId =
          memberId || currentUserId || (USE_MOCK ? 1 : undefined)

        if (!targetMemberId) {
          setProfile(null)
          setPosts([])
          return
        }

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
      } catch (err) {
        console.error('Failed to load profile data:', err)
        setError(err instanceof Error ? err : new Error('Failed to load profile data'))
        setProfile(null)
        setPosts([])
      } finally {
        setIsLoading(false)
      }
    }

    void loadProfileData()
  }, [memberId, currentUserId])

  return {
    profile,
    posts,
    isLoading,
    isOwner,
    error,
  }
}

function normalizeProfile(data: any): MemberResponse {
  return {
    ...data,
    profileImage: data.profileImage ?? '',
    nickname: data.nickname ?? '',
    handle: data.handle ?? '',
    bio: data.bio ?? '',
    role: data.role ?? '',
    company: data.company ?? '',
    location: data.location ?? '',
    primaryStack: Array.isArray(data.primaryStack) ? data.primaryStack : [],
    interests: Array.isArray(data.interests) ? data.interests : [],
    socialLinks: {
      github: data.socialLinks?.github ?? '',
      website: data.socialLinks?.website ?? '',
      linkedin: data.socialLinks?.linkedin ?? '',
      notion: data.socialLinks?.notion ?? '',
    },
  }
}

function normalizePosts(items: any[]): ProfilePost[] {
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
