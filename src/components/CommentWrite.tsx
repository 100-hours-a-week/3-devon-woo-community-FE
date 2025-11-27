import { useState } from 'react'
import styles from './CommentWrite.module.css'

interface CommentWriteProps {
  onSubmit: (text: string) => Promise<void>
  userProfileImage?: string
}

export default function CommentWrite({
  onSubmit,
  userProfileImage = 'https://via.placeholder.com/48/CCCCCC/666?text=U',
}: CommentWriteProps) {
  const [commentText, setCommentText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    const text = commentText.trim()
    if (!text || isSubmitting) return

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

  return (
    <div className={styles.commentWrite}>
      <div className={styles.commentAvatar}>
        <img src={userProfileImage} alt="프로필" />
      </div>
      <div className={styles.commentInputWrapper}>
        <textarea
          className={styles.commentTextarea}
          placeholder="댓글 달기..."
          rows={3}
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isSubmitting}
        />
        <div className={styles.commentActionsBottom}>
          <button
            className={styles.commentSubmitBtn}
            onClick={handleSubmit}
            disabled={isSubmitting || !commentText.trim()}
          >
            {isSubmitting ? '작성 중...' : '댓글 작성'}
          </button>
        </div>
      </div>
    </div>
  )
}
