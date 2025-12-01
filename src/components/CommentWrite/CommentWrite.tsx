import { useState } from 'react'
import ProfileImage from '@/components/ProfileImage'
import styles from './CommentWrite.module.css'

interface CommentWriteProps {
  onSubmit: (text: string) => Promise<void>
  userProfileImage?: string | null
  userName?: string
}

const MAX_LENGTH = 500

export default function CommentWrite({
  onSubmit,
  userProfileImage,
  userName = 'User',
}: CommentWriteProps) {
  const [commentText, setCommentText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    const text = commentText.trim()
    if (!text || isSubmitting || text.length > MAX_LENGTH) return

    setIsSubmitting(true)
    try {
      await onSubmit(text)
      setCommentText('')
    } catch (error) {
      console.error('Failed to submit comment:', error)
      alert('댓글 작성에 실패했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value
    if (text.length <= MAX_LENGTH) {
      setCommentText(text)
    }
  }

  const isOverLimit = commentText.length > MAX_LENGTH

  return (
    <div className={styles.commentWrite}>
      <div className={styles.commentAvatar}>
        <ProfileImage imageUrl={userProfileImage} name={userName} alt="프로필" />
      </div>
      <div className={styles.commentInputWrapper}>
        <textarea
          className={styles.commentTextarea}
          placeholder="댓글 달기..."
          rows={3}
          value={commentText}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={isSubmitting}
          maxLength={MAX_LENGTH}
        />
        <div className={styles.commentActionsBottom}>
          <span className={`${styles.charCount} ${isOverLimit ? styles.overLimit : ''}`}>
            {commentText.length}/{MAX_LENGTH}
          </span>
          <button
            className={styles.commentSubmitBtn}
            onClick={handleSubmit}
            disabled={isSubmitting || !commentText.trim() || isOverLimit}
          >
            {isSubmitting ? '작성 중...' : '댓글 작성'}
          </button>
        </div>
      </div>
    </div>
  )
}
