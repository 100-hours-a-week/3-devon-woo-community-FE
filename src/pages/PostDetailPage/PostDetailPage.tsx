import { useParams, useNavigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Header from '@/components/Header'
import CommentList from '@/components/CommentList'
import Footer from '@/components/Footer'
import ScrollToTopButton from '@/components/ScrollToTopButton'
import { useAuth } from '@/features/auth'
import { usePostDetail } from '@/features/post'
import { formatDateLong } from '@/utils/formatters'
import styles from './PostDetailPage.module.css'

export default function PostDetailPage() {
  const { postId } = useParams<{ postId: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()

  const {
    post,
    comments,
    likeCount,
    isLiked,
    recommendedPosts,
    isLoading,
    handleLike,
    handleCommentSubmit,
  } = usePostDetail({
    postId: postId ? Number(postId) : undefined,
  })

  const handleCommentLike = (commentId: number, isLiked: boolean) => {
    console.log(`Comment ${commentId} ${isLiked ? 'liked' : 'unliked'}`)
  }

  const handleCommentReply = (commentId: number) => {
    alert(`댓글 ${commentId}번에 답글을 작성합니다.`)
  }

  const handleCommentEdit = (commentId: number) => {
    alert(`댓글 ${commentId}번을 수정합니다.`)
  }

  const handleRecommendedClick = (postId: number) => {
    navigate(`/posts/${postId}`)
  }

  if (isLoading) {
    return (
      <div className={styles.postDetailPage}>
        <Header />
        <main className={styles.postDetailMain}>
          <div className={styles.loading}>게시글을 불러오는 중...</div>
        </main>
      </div>
    )
  }

  if (!post) {
    return (
      <div className={styles.postDetailPage}>
        <Header />
        <main className={styles.postDetailMain}>
          <div className={styles.loading}>게시글을 찾을 수 없습니다.</div>
        </main>
      </div>
    )
  }

  return (
    <div className={styles.postDetailPage}>
      <Header />

      <main className={styles.postDetailMain}>
        <article className={styles.postDetail}>
          <div className={styles.postHeader}>
            <div className={styles.postCategory}>TECH INSIGHT</div>
            <h1 className={styles.postTitle}>{post.title}</h1>
            <div className={styles.postMeta}>
              <span className={styles.postAuthor}>{post.member.nickname}</span>
              <span className={styles.postDivider}>|</span>
              <span className={styles.postDate}>{formatDateLong(post.createdAt)}</span>
            </div>
            <div className={styles.postActions}>
              <button
                className={`${styles.likeBtn} ${isLiked ? styles.liked : ''}`}
                onClick={handleLike}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M10 17.5L8.5 16.2C4 12.1 1 9.4 1 6.1C1 3.4 3.1 1.3 5.8 1.3C7.3 1.3 8.8 2 10 3.1C11.2 2 12.7 1.3 14.2 1.3C16.9 1.3 19 3.4 19 6.1C19 9.4 16 12.1 11.5 16.2L10 17.5Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>{likeCount}</span>
              </button>
            </div>
          </div>

          {post.imageUrl && (
            <div className={styles.postThumbnail}>
              <img src={post.imageUrl} alt={post.title} />
            </div>
          )}

          <div className={styles.postContent}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
          </div>
        </article>

        {recommendedPosts.length > 0 && (
          <section className={styles.recommendedPosts}>
            <h3 className={styles.sectionTitle}>추천 게시글</h3>
            <div className={styles.recommendedList}>
              {recommendedPosts.map((recPost) => (
                <div
                  key={recPost.id}
                  className={styles.recommendedItem}
                  onClick={() => handleRecommendedClick(recPost.id)}
                >
                  <div className={styles.recommendedItemCategory}>{recPost.category}</div>
                  <div className={styles.recommendedItemTitle}>{recPost.title}</div>
                  <div className={styles.recommendedItemMeta}>{formatDateLong(recPost.date)}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        <CommentList
          comments={comments}
          onLike={handleCommentLike}
          onReply={handleCommentReply}
          onCommentSubmit={handleCommentSubmit}
          userProfileImage={user?.profileImage || 'https://via.placeholder.com/48/CCCCCC/666?text=U'}
          currentUserId={user?.memberId}
          onEdit={handleCommentEdit}
        />
      </main>

      <ScrollToTopButton />

      <Footer />
    </div>
  )
}
