import { useEffect, useState } from 'react'
import { postApi } from '@/api'
import type { PostSummaryResponse } from '@/types/post'
import { USE_MOCK } from '@/config/env'
import { generateMockPosts } from '@/mocks/postDummy'

interface UsePostsOptions {
  page: number
  size: number
  search?: string
}

interface UsePostsResult {
  posts: PostSummaryResponse[]
  totalPages: number
  isLoading: boolean
  reload: () => Promise<void>
}

export function usePosts({ page, size, search }: UsePostsOptions): UsePostsResult {
  const [posts, setPosts] = useState<PostSummaryResponse[]>([])
  const [totalPages, setTotalPages] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const loadPosts = async () => {
    setIsLoading(true)
    try {
      if (USE_MOCK) {
        const mockPosts = generateMockPosts(100)
        const startIndex = (page - 1) * size
        const endIndex = startIndex + size

        let filteredPosts = mockPosts

        if (search) {
          const query = search.toLowerCase()
          filteredPosts = mockPosts.filter(
            post =>
              post.title.toLowerCase().includes(query) ||
              post.member.nickname.toLowerCase().includes(query)
          )
        }

        setPosts(filteredPosts.slice(startIndex, endIndex))
        setTotalPages(Math.ceil(filteredPosts.length / size))
      } else {
        const response = await postApi.getPosts({
          page: page - 1,
          size,
        })

        if (response.success && response.data) {
          let filteredPosts = response.data.items

          if (search) {
            const query = search.toLowerCase()
            filteredPosts = filteredPosts.filter(
              post =>
                post.title.toLowerCase().includes(query) ||
                post.member.nickname.toLowerCase().includes(query)
            )
          }

          setPosts(filteredPosts)
          setTotalPages(response.data.totalPages)
        }
      }
    } catch (error) {
      console.error('Failed to load posts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadPosts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, size, search])

  return {
    posts,
    totalPages,
    isLoading,
    reload: loadPosts,
  }
}

