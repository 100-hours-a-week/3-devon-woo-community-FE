import { Link } from 'react-router-dom'
import type { PostSummaryResponse } from '@/types/post'
import { formatCount } from '@/utils'
import styles from './BlogCard.module.css'
import Icon from './icons/Icon'

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
              <Icon name="eye" />
              {formatCount(post.viewCount)}
            </span>
            <span className={styles.stat}>
              <Icon name="heart" />
              {formatCount(post.likeCount)}
            </span>
            <span className={styles.stat}>
              <Icon name="comment" />
              {formatCount(post.commentCount)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
