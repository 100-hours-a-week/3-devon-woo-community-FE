import type { ChangeEvent } from 'react'
import type { CommentResponse } from '@/types'
import CommentItem from '@/components/CommentItem'
import CommentWrite from '@/components/CommentWrite'
import styles from './CommentList.module.css'

type SortOption = 'latest' | 'oldest'

interface CommentListProps {
  comments: CommentResponse[]
  sortBy: SortOption
  onSortChange: (sort: SortOption) => void
  onLike?: (commentId: number, isLiked: boolean) => void
  onReply?: (commentId: number) => void
  onCommentSubmit?: (text: string) => Promise<void>
  userProfileImage?: string
  currentUserName?: string
  currentUserId?: number
  onEdit?: (commentId: number) => void
  getLikeState?: (commentId: number) => { isLiked: boolean; likeCount: number }
  onToggleLike?: (commentId: number) => boolean | void
}

export default function CommentList({
  comments,
  sortBy,
  onSortChange,
  onLike,
  onReply,
  onCommentSubmit,
  userProfileImage,
  currentUserName,
  currentUserId,
  onEdit,
  getLikeState,
  onToggleLike,
}: CommentListProps) {
  const handleSortChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onSortChange(event.target.value as SortOption)
  }

  const handleLike = (commentId: number) => {
    if (!onToggleLike) {
      onLike?.(commentId, true)
      return
    }
    const nextLiked = onToggleLike(commentId)
    if (typeof nextLiked === 'boolean') {
      onLike?.(commentId, nextLiked)
    }
  }

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
            onChange={handleSortChange}
          >
            <option value="latest">최신순</option>
            <option value="oldest">오래된 순</option>
          </select>
        </div>
      </div>

      {onCommentSubmit && (
        <CommentWrite
          onSubmit={onCommentSubmit}
          userProfileImage={userProfileImage}
          userName={currentUserName}
        />
      )}

      <div className={styles.commentsList}>
        {comments.length === 0 ? (
          <div className={styles.commentsEmpty}>
            <p>댓글이 없습니다.</p>
          </div>
        ) : (
          comments.map((comment) => {
            const likeStateForComment = getLikeState?.(comment.commentId)

            return (
              <CommentItem
                key={comment.commentId}
                comment={comment}
                onLikeToggle={handleLike}
                onReply={onReply}
                currentUserId={currentUserId}
                onEdit={onEdit}
                isLiked={likeStateForComment?.isLiked}
                likeCount={likeStateForComment?.likeCount}
              />
            )
          })
        )}
      </div>
    </div>
  )
}
