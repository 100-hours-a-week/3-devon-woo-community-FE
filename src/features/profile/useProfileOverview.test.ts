import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useProfileOverview } from './useProfileOverview'
import { TestFixture } from '@/test/TestFixture'
import * as memberApi from '@/api/memberApi'
import * as postApi from '@/api/postApi'

vi.mock('@/api/memberApi')
vi.mock('@/api/postApi')

describe('useProfileOverview', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize with loading state', () => {
    const { result } = renderHook(
      () => useProfileOverview({ memberId: 1, currentUserId: 1 }),
      { wrapper: TestFixture }
    )

    expect(result.current.isLoading).toBe(true)
    expect(result.current.profile).toBe(null)
    expect(result.current.posts).toEqual([])
  })

  it('should load profile and posts successfully', async () => {
    const mockProfile = {
      memberId: 1,
      email: 'test@example.com',
      nickname: 'Test User',
      profileImage: 'https://example.com/image.jpg',
      handle: 'Developer',
      bio: 'Test bio',
      role: 'Engineer',
      company: 'Test Company',
      location: 'Seoul',
      primaryStack: ['React', 'TypeScript'],
      interests: ['Frontend', 'Testing'],
      socialLinks: {
        github: 'https://github.com/test',
        website: 'https://test.com',
        linkedin: '',
        notion: '',
      },
    }

    const mockPosts = {
      items: [
        {
          postId: 1,
          title: 'Test Post',
          createdAt: new Date().toISOString(),
          likeCount: 10,
          viewCount: 100,
          commentCount: 5,
        },
      ],
      totalElements: 1,
      totalPages: 1,
    }

    vi.mocked(memberApi.memberApi.getProfile).mockResolvedValue({
      success: true,
      data: mockProfile,
    })

    vi.mocked(postApi.postApi.getPosts).mockResolvedValue({
      success: true,
      data: mockPosts,
    })

    const { result } = renderHook(
      () => useProfileOverview({ memberId: 1, currentUserId: 1 }),
      { wrapper: TestFixture }
    )

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.profile).toBeDefined()
    expect(result.current.posts.length).toBeGreaterThan(0)
    expect(result.current.error).toBe(null)
  })

  it('should handle error when loading profile fails', async () => {
    vi.mocked(memberApi.memberApi.getProfile).mockRejectedValue(
      new Error('Failed to load profile')
    )

    vi.mocked(postApi.postApi.getPosts).mockRejectedValue(
      new Error('Failed to load posts')
    )

    const { result } = renderHook(
      () => useProfileOverview({ memberId: 1, currentUserId: 1 }),
      { wrapper: TestFixture }
    )

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.profile).toBe(null)
    expect(result.current.error).toBeInstanceOf(Error)
  })

  it('should determine isOwner correctly when memberId matches currentUserId', () => {
    const { result } = renderHook(
      () => useProfileOverview({ memberId: 1, currentUserId: 1 }),
      { wrapper: TestFixture }
    )

    expect(result.current.isOwner).toBe(true)
  })

  it('should determine isOwner correctly when memberId does not match currentUserId', () => {
    const { result } = renderHook(
      () => useProfileOverview({ memberId: 1, currentUserId: 2 }),
      { wrapper: TestFixture }
    )

    expect(result.current.isOwner).toBe(false)
  })
})
