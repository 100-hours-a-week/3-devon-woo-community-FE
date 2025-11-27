import { Link } from 'react-router-dom'
import type { PostSummaryResponse } from '@/types/post'
import { formatCount } from '@/utils'
import styles from './BlogCard.module.css'

interface BlogCardProps {
  post: PostSummaryResponse
}

export default function BlogCard({ post }: BlogCardProps) {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      const now = new Date()
      const diff = now.getTime() - date.getTime()
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))

      if (days === 0) return '오늘'
      if (days === 1) return '어제'
      if (days < 7) return `${days}일 전`
      if (days < 30) return `${Math.floor(days / 7)}주 전`

      return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`
    } catch {
      return dateString
    }
  }

  return (
    <Link to={`/posts/${post.postId}`} className={styles.blogCard}>
      {post.thumbnail && (
        <div className={styles.thumbnail}>
          <img src={post.thumbnail} alt={post.title} loading="lazy" />
        </div>
      )}

      <div className={styles.content}>
        <div className={styles.meta}>
          <span className={styles.author}>{post.member.nickname}</span>
          <span className={styles.divider}>·</span>
          <span className={styles.date}>{formatDate(post.createdAt)}</span>
        </div>

        <h2 className={styles.title}>{post.title}</h2>

        {post.summary && <p className={styles.summary}>{post.summary}</p>}

        <div className={styles.footer}>
          <div className={styles.stats}>
            <span className={styles.stat}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M8 3C4.5 3 1.73 5.61 1 8c.73 2.39 3.5 5 7 5s6.27-2.61 7-5c-.73-2.39-3.5-5-7-5zm0 8a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0-2a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"
                  fill="currentColor"
                />
              </svg>
              {formatCount(post.viewCount)}
            </span>
            <span className={styles.stat}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M2 5.5a3.5 3.5 0 0 1 5.898-2.549 5.508 5.508 0 0 1 6.65 6.65 3.5 3.5 0 1 1-6.65 2.398 5.508 5.508 0 0 1-5.898-6.5zM8 12.5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9z"
                  fill="currentColor"
                />
              </svg>
              {formatCount(post.likeCount)}
            </span>
            <span className={styles.stat}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M3 2h10a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H6l-3 3V3a1 1 0 0 1 1-1z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  fill="none"
                />
              </svg>
              {formatCount(post.commentCount)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
