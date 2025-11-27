import { Link } from 'react-router-dom'
import styles from './TopPostsList.module.css'

interface TopPost {
  id: string | number
  title: string
  url: string
}

interface TopPostsListProps {
  posts: TopPost[]
}

export default function TopPostsList({ posts }: TopPostsListProps) {
  if (!posts || posts.length === 0) {
    return (
      <div className={styles.topPosts}>
        <h3 className={styles.topPostsTitle}>TOP 5</h3>
        <p className={styles.topPostsEmpty}>인기 포스트가 없습니다.</p>
      </div>
    )
  }

  return (
    <div className={styles.topPosts}>
      <h3 className={styles.topPostsTitle}>TOP 5</h3>
      <ol className={styles.topPostsList}>
        {posts.slice(0, 5).map(post => (
          <li key={post.id} className={styles.topPostsItem}>
            <Link to={post.url} className={styles.topPostsLink}>
              {post.title}
            </Link>
          </li>
        ))}
      </ol>
    </div>
  )
}
