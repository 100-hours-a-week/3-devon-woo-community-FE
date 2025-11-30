import styles from './CommentItem.module.css'

interface CommentReportModalProps {
  commentId: number
  onConfirm: () => void
  onCancel: () => void
}

export default function CommentReportModal({
  commentId,
  onConfirm,
  onCancel,
}: CommentReportModalProps) {
  return (
    <div className={styles.modalOverlay} onClick={onCancel}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h3 className={styles.modalTitle}>댓글 신고</h3>
        <p className={styles.modalMessage}>댓글 {commentId}번을 신고하시겠습니까?</p>
        <div className={styles.modalActions}>
          <button className={styles.modalBtnCancel} onClick={onCancel}>
            취소
          </button>
          <button className={styles.modalBtnConfirm} onClick={onConfirm}>
            신고
          </button>
        </div>
      </div>
    </div>
  )
}
