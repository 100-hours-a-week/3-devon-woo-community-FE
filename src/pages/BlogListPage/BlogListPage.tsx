import { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PostItem from '@/components/PostItem/PostItem'
import Sidebar from '@/components/Sidebar/Sidebar'
import TopPostsList from '@/components/TopPostsList/TopPostsList'
import TagCloud from '@/components/TagCloud/TagCloud'
import Pagination from '@/components/Pagination'
import { usePosts, useTopPosts, usePopularTags } from '@/features/post'
import styles from './BlogListPage.module.css'

export default function BlogListPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(1)
  const searchQuery = searchParams.get('search') || ''
  const pageSize = 20

  const { posts, totalPages, isLoading } = usePosts({
    page: currentPage,
    size: pageSize,
    search: searchQuery || undefined,
  })

  const { topPosts, isLoading: isTopPostsLoading } = useTopPosts({ limit: 5 })
  const { tags, isLoading: isTagsLoading } = usePopularTags({ limit: 10 })

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
            <TopPostsList posts={isTopPostsLoading ? [] : topPosts} />
            <TagCloud tags={isTagsLoading ? [] : tags} onTagClick={handleTagClick} />
          </Sidebar>
        </div>
      </main>

      <Footer />
    </div>
  )
}
