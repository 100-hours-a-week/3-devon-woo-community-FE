import { useRef, useEffect, useState } from 'react'
import type { CommentResponse } from '@/types'
import styles from './CommentItem.module.css'

interface CommentItemProps {
  comment: CommentResponse
  onReply?: (commentId: number) => void
  currentUserId?: number
  onEdit?: (commentId: number) => void
  onLikeToggle?: (commentId: number) => void
  isLiked?: boolean
  likeCount?: number
}

export default function CommentItem({
  comment,
  onReply,
  currentUserId,
  onEdit,
  onLikeToggle,
  isLiked = false,
  likeCount = 0,
}: CommentItemProps) {
  const [showDropdown, setShowDropdown] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const isOwner = currentUserId === comment.member.memberId

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showDropdown])

  const handleReply = () => {
    onReply?.(comment.commentId)
  }

  const handleEdit = () => {
    setShowDropdown(false)
    onEdit?.(comment.commentId)
  }

  const handleReportClick = () => {
    setShowDropdown(false)
    setShowReportModal(true)
  }

  const handleReportConfirm = () => {
    alert(`댓글 ${comment.commentId}번을 신고했습니다.`)
    setShowReportModal(false)
  }

  const handleReportCancel = () => {
    setShowReportModal(false)
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
    <>
      <div className={styles.commentItem}>
        <div className={styles.commentAvatar}>
          <img src={avatar} alt={author} />
        </div>
        <div className={styles.commentContentWrapper}>
          <div className={styles.commentHeader}>
            <div className={styles.commentHeaderLeft}>
              <span className={styles.commentAuthor}>{author}</span>
              <span className={styles.commentDate}>{formatDate(comment.createdAt)}</span>
            </div>
            <div className={styles.commentHeaderRight}>
              <button
                className={`${styles.commentActionBtn} ${isLiked ? styles.liked : ''}`}
                onClick={() => onLikeToggle?.(comment.commentId)}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M8 14L7 13.1C3.2 9.68 1 7.72 1 5.5C1 3.72 2.36 2.5 4 2.5C5 2.5 6 3 6.5 3.7C7 3 8 2.5 9 2.5C10.64 2.5 12 3.72 12 5.5C12 7.72 9.8 9.68 6 13.1L5 14Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    fill={isLiked ? 'currentColor' : 'none'}
                  />
                </svg>
                {likeCount > 0 && <span>{likeCount}</span>}
              </button>
              <div className={styles.dropdownWrapper} ref={dropdownRef}>
                <button
                  className={styles.commentActionBtn}
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="3" r="1.5" fill="currentColor" />
                    <circle cx="8" cy="8" r="1.5" fill="currentColor" />
                    <circle cx="8" cy="13" r="1.5" fill="currentColor" />
                  </svg>
                </button>
                {showDropdown && (
                  <div className={styles.dropdownMenu}>
                    {isOwner && (
                      <button className={styles.dropdownItem} onClick={handleEdit}>
                        수정하기
                      </button>
                    )}
                    <button className={styles.dropdownItem} onClick={handleReportClick}>
                      신고하기
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className={styles.commentText}>{comment.content}</div>
        </div>
      </div>

      {showReportModal && (
        <div className={styles.modalOverlay} onClick={handleReportCancel}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>댓글 신고</h3>
            <p className={styles.modalMessage}>이 댓글을 신고하시겠습니까?</p>
            <div className={styles.modalActions}>
              <button className={styles.modalBtnCancel} onClick={handleReportCancel}>
                취소
              </button>
              <button className={styles.modalBtnConfirm} onClick={handleReportConfirm}>
                신고
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
