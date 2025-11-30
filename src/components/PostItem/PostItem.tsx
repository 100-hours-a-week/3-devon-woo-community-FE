import { useNavigate } from 'react-router-dom'
import type { PostSummaryResponse } from '@/types/post'
import { formatDateDot } from '@/utils/formatters'
import styles from './PostItem.module.css'

interface PostItemProps {
  post: PostSummaryResponse
  postNumber: number
}

export default function PostItem({ post, postNumber }: PostItemProps) {
  const navigate = useNavigate()
  const gradientClass = `gradient${((postNumber - 1) % 4) + 1}`
  const category = 'TECH INSIGHT'

  const handleClick = () => {
    navigate(`/posts/${post.postId}`)
  }


  const generateExcerpt = (title: string) => {
    return '네이버 사내 기술 교류 행사인 NAVER ENGINEERING DAY 2025(10월)에서 발표되었던 세션을 공개합니다. 발표 내용과 기술적 인사이트를 공유하며, 실무에 적용할 수 있는 다양한 팁과 노하우를 소개합니다.'
  }

  return (
    <article className={styles.postItem} onClick={handleClick}>
      <div className={styles.postContent}>
        <div className={styles.postCategory}>{category}</div>
        <h2 className={styles.postTitle}>{post.title}</h2>
        <p className={styles.postExcerpt}>
          {post.summary || generateExcerpt(post.title)}
        </p>
        <div className={styles.postMeta}>
          <span className={styles.postDate}>{formatDateDot(post.createdAt)}</span>
          <span className={styles.postDivider}>·</span>
          <span className={styles.postAuthor}>{post.member.nickname}</span>
          <span className={styles.postDivider}>·</span>
          <span className={styles.postViews}>{post.viewCount}</span>
        </div>
      </div>
      <div className={`${styles.postThumbnail} ${styles[gradientClass]}`}>
        Tech Post
        <br />#{postNumber}
      </div>
    </article>
  )
}
