import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PostItem from '@/components/PostItem/PostItem'
import Sidebar from '@/components/Sidebar/Sidebar'
import TopPostsList from '@/components/TopPostsList/TopPostsList'
import TagCloud from '@/components/TagCloud/TagCloud'
import Pagination from '@/components/Pagination'
import { postApi } from '@/api'
import type { PostSummaryResponse } from '@/types/post'
import { USE_MOCK } from '@/config/env'
import { generateMockPosts } from '@/mocks/postDummy'
import styles from './BlogListPage.module.css'

interface TopPost {
  id: string | number
  title: string
  url: string
}

interface Tag {
  name: string
  count: number
}

export default function BlogListPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const [posts, setPosts] = useState<PostSummaryResponse[]>([])
  const [topPosts, setTopPosts] = useState<TopPost[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const searchQuery = searchParams.get('search') || ''
  const pageSize = 20

  useEffect(() => {
    loadPosts()
  }, [currentPage, searchQuery])

  useEffect(() => {
    loadTopPosts()
    loadTags()
  }, [])

  const loadPosts = async () => {
    setIsLoading(true)
    try {
      if (USE_MOCK) {
        const mockPosts = generateMockPosts(100)
        const startIndex = (currentPage - 1) * pageSize
        const endIndex = startIndex + pageSize

        let filteredPosts = mockPosts

        if (searchQuery) {
          const query = searchQuery.toLowerCase()
          filteredPosts = mockPosts.filter(
            post =>
              post.title.toLowerCase().includes(query) ||
              post.member.nickname.toLowerCase().includes(query)
          )
        }

        setPosts(filteredPosts.slice(startIndex, endIndex))
        setTotalPages(Math.ceil(filteredPosts.length / pageSize))
      } else {
        const response = await postApi.getPosts({
          page: currentPage - 1,
          size: pageSize,
        })

        if (response.success && response.data) {
          let filteredPosts = response.data.items

          if (searchQuery) {
            const query = searchQuery.toLowerCase()
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

  const loadTopPosts = async () => {
    try {
      if (USE_MOCK) {
        const mockPosts = generateMockPosts(20)
        const sortedPosts = [...mockPosts].sort((a, b) => b.viewCount - a.viewCount)
        const topPostsList = sortedPosts.slice(0, 5).map(post => ({
          id: post.postId,
          title: post.title,
          url: `/posts/${post.postId}`,
        }))
        setTopPosts(topPostsList)
      } else {
        const response = await postApi.getPosts({
          page: 0,
          size: 5,
          sort: 'viewCount,desc',
        })

        if (response.success && response.data) {
          const topPostsList = response.data.items.map(post => ({
            id: post.postId,
            title: post.title,
            url: `/posts/${post.postId}`,
          }))
          setTopPosts(topPostsList)
        }
      }
    } catch (error) {
      console.error('Failed to load top posts:', error)
    }
  }

  const loadTags = async () => {
    try {
      const mockTags: Tag[] = [
        { name: 'JavaScript', count: 45 },
        { name: 'React', count: 38 },
        { name: 'TypeScript', count: 32 },
        { name: 'Node.js', count: 28 },
        { name: 'CSS', count: 25 },
        { name: 'Python', count: 22 },
        { name: 'Java', count: 20 },
        { name: 'Spring', count: 18 },
        { name: 'Docker', count: 15 },
        { name: 'AWS', count: 12 },
      ]
      setTags(mockTags)
    } catch (error) {
      console.error('Failed to load tags:', error)
    }
  }

  const handleClearSearch = () => {
    navigate('/posts')
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleTagClick = (tagName: string) => {
    navigate(`/posts?search=${encodeURIComponent(tagName)}`)
  }



  return (
    <div className={styles.blogListPage}>
      <Header />

      <main className={styles.blogListMain}>
        <div className={styles.blogListContentWrapper}>
          <section className={styles.blogListContent}>
            {searchQuery && (
              <div className={styles.searchResultHeader}>
                <h2 className={styles.searchResultTitle}>
                  "{searchQuery}" 검색 결과
                </h2>
                <button className={styles.searchClearBtn} onClick={handleClearSearch}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M12 4L4 12M4 4l8 8"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                  검색 초기화
                </button>
              </div>
            )}

            <div className={styles.blogListGrid}>
              {isLoading && posts.length === 0 ? (
                <div className={styles.blogListLoading}>Loading...</div>
              ) : posts.length === 0 ? (
                <div className={styles.emptyState}>
                  <p>게시글이 없습니다.</p>
                </div>
              ) : (
                posts.map((post, index) => {
                  const postNumber = (currentPage - 1) * pageSize + index + 1
                  return <PostItem key={post.postId} post={post} postNumber={postNumber} />
                })
              )}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </section>

          <Sidebar>
            <TopPostsList posts={topPosts} />
            <TagCloud tags={tags} onTagClick={handleTagClick} />
          </Sidebar>
        </div>
      </main>

      <Footer />
    </div>
  )
}
