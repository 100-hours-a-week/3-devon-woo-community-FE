import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { usePost } from './usePost'
import { TestFixture } from '@/test/TestFixture'
import * as postApi from '@/api/postApi'

vi.mock('@/api/postApi')

describe('usePost', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize with loading state', () => {
    const { result } = renderHook(() => usePost({ postId: 1 }), {
      wrapper: TestFixture,
    })

    expect(result.current.isLoading).toBe(true)
    expect(result.current.post).toBe(null)
    expect(result.current.error).toBe(null)
  })

  it('should load post successfully', async () => {
    const mockPost = {
      postId: 1,
      title: 'Test Post',
      content: 'Test Content',
      summary: 'Test Summary',
      imageUrl: '',
      likeCount: 0,
      viewCount: 0,
      commentCount: 0,
      isLiked: false,
      tags: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    vi.mocked(postApi.postApi.getPostById).mockResolvedValue({
      success: true,
      data: mockPost,
    })

    const { result } = renderHook(() => usePost({ postId: 1 }), {
      wrapper: TestFixture,
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.post).toEqual(mockPost)
    expect(result.current.error).toBe(null)
  })

  it('should handle error when loading post fails', async () => {
    vi.mocked(postApi.postApi.getPostById).mockRejectedValue(
      new Error('Failed to load post')
    )

    const { result } = renderHook(() => usePost({ postId: 1 }), {
      wrapper: TestFixture,
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.post).toBe(null)
    expect(result.current.error).toBeInstanceOf(Error)
  })

  it('should not load post when postId is undefined', async () => {
    const { result } = renderHook(() => usePost({ postId: undefined }), {
      wrapper: TestFixture,
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.post).toBe(null)
    expect(postApi.postApi.getPostById).not.toHaveBeenCalled()
  })
})
