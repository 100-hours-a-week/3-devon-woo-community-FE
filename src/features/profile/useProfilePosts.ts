import { useState, useMemo } from 'react'
import type { ProfilePost } from './useProfileOverview'

export type SortType = 'latest' | 'popular' | 'views'

interface UseProfilePostsOptions {
  posts: ProfilePost[]
  postsPerPage?: number
}

interface UseProfilePostsResult {
  currentPage: number
  sort: SortType
  paginatedPosts: ProfilePost[]
  totalPages: number
  setCurrentPage: (page: number) => void
  setSort: (sort: SortType) => void
}

export function useProfilePosts({
  posts,
  postsPerPage = 5,
}: UseProfilePostsOptions): UseProfilePostsResult {
  const [currentPage, setCurrentPage] = useState(1)
  const [sort, setSort] = useState<SortType>('latest')

  const sortedPosts = useMemo(() => {
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
  }, [posts, sort])

  const paginatedPosts = useMemo(() => {
    const start = (currentPage - 1) * postsPerPage
    return sortedPosts.slice(start, start + postsPerPage)
  }, [sortedPosts, currentPage, postsPerPage])

  const totalPages = useMemo(() => {
    const total = sortedPosts.length || 1
    return Math.max(1, Math.ceil(total / postsPerPage))
  }, [sortedPosts.length, postsPerPage])

  return {
    currentPage,
    sort,
    paginatedPosts,
    totalPages,
    setCurrentPage,
    setSort,
  }
}
