import { useState } from 'react'
import type { CommentResponse } from '@/types'
import styles from './CommentItem.module.css'

interface CommentItemProps {
  comment: CommentResponse
  onLike?: (commentId: number, isLiked: boolean) => void
  onReply?: (commentId: number) => void
}

export default function CommentItem({ comment, onLike, onReply }: CommentItemProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [likes, setLikes] = useState(0)

  const handleLike = () => {
    const newIsLiked = !isLiked
    setIsLiked(newIsLiked)
    setLikes(newIsLiked ? likes + 1 : Math.max(0, likes - 1))
    onLike?.(comment.commentId, newIsLiked)
  }

  const handleReply = () => {
    onReply?.(comment.commentId)
  }

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString)
      const now = new Date()
      const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

      if (diffInHours < 1) return '방금'
      if (diffInHours < 24) return `${diffInHours}시간 전`

      const diffInDays = Math.floor(diffInHours / 24)
      if (diffInDays < 7) return `${diffInDays}일 전`
      if (diffInDays < 30) return `${Math.floor(diffInDays / 7)}주 전`
      if (diffInDays < 365) return `${Math.floor(diffInDays / 30)}개월 전`

      return `${Math.floor(diffInDays / 365)}년 전`
    } catch (error) {
      return dateString
    }
  }

  const author = comment.member?.nickname || 'Anonymous'
  const avatar =
    comment.member?.profileImage ||
    `https://via.placeholder.com/48/CCCCCC/666?text=${author.charAt(0)}`

  return (
    <div className={styles.commentItem}>
      <div className={styles.commentAvatar}>
        <img src={avatar} alt={author} />
      </div>
      <div className={styles.commentContentWrapper}>
        <div className={styles.commentHeader}>
          <span className={styles.commentAuthor}>{author}</span>
          <span className={styles.commentDate}>{formatDate(comment.createdAt)}</span>
        </div>
        <div className={styles.commentText}>{comment.content}</div>
        <div className={styles.commentActionsRow}>
          <button
            className={`${styles.commentActionBtn} ${isLiked ? styles.liked : ''}`}
            onClick={handleLike}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M8 14L7 13.1C3.2 9.68 1 7.72 1 5.5C1 3.72 2.36 2.5 4 2.5C5 2.5 6 3 6.5 3.7C7 3 8 2.5 9 2.5C10.64 2.5 12 3.72 12 5.5C12 7.72 9.8 9.68 6 13.1L5 14Z"
                stroke="currentColor"
                strokeWidth="1.5"
                fill={isLiked ? 'currentColor' : 'none'}
              />
            </svg>
            좋아요
            {likes > 0 && <span>· {likes}</span>}
          </button>
          <button className={styles.commentActionBtn} onClick={handleReply}>
            답글 달기
          </button>
        </div>
      </div>
    </div>
  )
}
