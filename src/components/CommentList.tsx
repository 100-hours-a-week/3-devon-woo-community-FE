import { useState } from 'react'
import type { CommentResponse } from '@/types'
import CommentItem from './CommentItem'
import styles from './CommentList.module.css'

interface CommentListProps {
  comments: CommentResponse[]
  onLike?: (commentId: number, isLiked: boolean) => void
  onReply?: (commentId: number) => void
}

export default function CommentList({ comments, onLike, onReply }: CommentListProps) {
  const [sortBy, setSortBy] = useState<'latest' | 'oldest'>('latest')

  const getSortedComments = () => {
    const sorted = [...comments]
    if (sortBy === 'latest') {
      return sorted.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    } else {
      return sorted.sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      )
    }
  }

  const sortedComments = getSortedComments()

  return (
    <div className={styles.commentsSection}>
      <div className={styles.commentsHeader}>
        <h3 className={styles.sectionTitle}>
          댓글 <span id="commentCount">{comments.length}</span>개
        </h3>
        <div className={styles.commentsSort}>
          <label htmlFor="sortSelect">정렬 기준</label>
          <select
            id="sortSelect"
            className={styles.sortSelect}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'latest' | 'oldest')}
          >
            <option value="latest">날짜 오름차순</option>
            <option value="oldest">날짜 내림차순</option>
          </select>
        </div>
      </div>

      <div className={styles.commentsList}>
        {sortedComments.length === 0 ? (
          <div className={styles.commentsEmpty}>
            <p>댓글이 없습니다.</p>
          </div>
        ) : (
          sortedComments.map((comment) => (
            <CommentItem
              key={comment.commentId}
              comment={comment}
              onLike={onLike}
              onReply={onReply}
            />
          ))
        )}
      </div>
    </div>
  )
}
