import { useParams, useNavigate } from 'react-router-dom'
import Header from '@/components/Header'
import ProfileCard from '@/components/ProfileCard'
import ScrollToTopButton from '@/components/ScrollToTopButton'
import Pagination from '@/components/Pagination'
import { useAuth } from '@/features/auth'
import { useProfileOverview, useProfilePosts } from '@/features/profile'
import { formatDateDot } from '@/utils/formatters'
import styles from './ProfilePage.module.css'

const POSTS_PER_PAGE = 5

export default function ProfilePage() {
  const { memberId } = useParams<{ memberId?: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()

  const { profile, posts, isLoading, isOwner } = useProfileOverview({
    memberId: memberId ? Number(memberId) : undefined,
    currentUserId: user?.memberId,
  })

  const {
    currentPage,
    sort,
    paginatedPosts,
    totalPages,
    setCurrentPage,
    setSort,
  } = useProfilePosts({
    posts,
    postsPerPage: POSTS_PER_PAGE,
  })

  if (isLoading) {
    return (
      <div className={styles.profilePage}>
        <Header />
        <div className={styles.loading}>
          <div className={styles.loadingSpinner} />
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className={styles.profilePage}>
        <Header />
        <div className={styles.emptyState}>프로필을 찾을 수 없습니다.</div>
      </div>
    )
  }

  return (
    <div className={styles.profilePage}>
      <Header />

      <div className={styles.mainContainer}>
        <ProfileCard profile={profile} isOwner={isOwner} />

        <section className={styles.postsSection}>
          <div className={styles.postsHeader}>
            <h2>기술 블로그</h2>
            <div className={styles.sortOptions}>
              <button
                className={`${styles.sortBtn} ${sort === 'latest' ? styles.active : ''}`}
                onClick={() => {
                  setSort('latest')
                  setCurrentPage(1)
                }}
              >
                최신순
              </button>
              <button
                className={`${styles.sortBtn} ${sort === 'popular' ? styles.active : ''}`}
                onClick={() => {
                  setSort('popular')
                  setCurrentPage(1)
                }}
              >
                인기순
              </button>
              <button
                className={`${styles.sortBtn} ${sort === 'views' ? styles.active : ''}`}
                onClick={() => {
                  setSort('views')
                  setCurrentPage(1)
                }}
              >
                조회순
              </button>
            </div>
          </div>

          {paginatedPosts.length > 0 ? (
            <div className={styles.postsList}>
              {paginatedPosts.map((post) => (
                <article
                  key={post.id}
                  className={styles.postCard}
                  onClick={() => navigate(`/posts/${post.id}`)}
                >
                  <h3 className={styles.postCardTitle}>{post.title}</h3>
                  <div className={styles.postCardDate}>{formatDateDot(post.date)}</div>
                  <p className={styles.postCardExcerpt}>{post.excerpt}</p>
                </article>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>게시글이 없습니다.</div>
          )}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </section>
      </div>

      <ScrollToTopButton threshold={200} />
    </div>
  )
}
