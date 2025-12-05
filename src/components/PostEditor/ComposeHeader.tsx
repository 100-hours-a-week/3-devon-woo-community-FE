import './PostEditor.css'

interface ComposeHeaderProps {
  isEditMode: boolean
  autosaveStatusText: string
  autosaveStatusTime: string
  isSaving: boolean
  onBack: () => void
  onTempSave: () => void
  onPublish: () => void
  onReview: () => void
  canTempSave: boolean
  canPublish: boolean
  canReview: boolean
}

export default function ComposeHeader({
  isEditMode,
  autosaveStatusText,
  autosaveStatusTime,
  isSaving,
  onBack,
  onTempSave,
  onPublish,
  onReview,
  canTempSave,
  canPublish,
  canReview,
}: ComposeHeaderProps) {
  return (
    <header className="compose-header">
      <div className="compose-header-content">
        <div className="compose-header-left">
          <button className="icon-btn" onClick={onBack} aria-label="뒤로 가기">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M12 4l-6 6 6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <div className="compose-header-text">
            <span className="compose-label">{isEditMode ? '글 수정' : '새 글 작성'}</span>
          </div>
        </div>
        <div className="compose-header-right">
          <div className={`autosave-status ${isSaving ? 'saving' : ''}`}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="save-icon">
              <path
                d="M13.5 5.5L6 13L2.5 9.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="status-text">{autosaveStatusText}</span>
            <span className="status-time">{autosaveStatusTime}</span>
          </div>
          <button className="btn-secondary" onClick={onTempSave} disabled={!canTempSave}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M12.67 1H3.33A2.33 2.33 0 0 0 1 3.33v9.34A2.33 2.33 0 0 0 15 12.67V3.33A2.33 2.33 0 0 0 12.67 1zM11 15v-4.67H5V15M11 1v3.67H3.33"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            임시 저장
          </button>
          <button className="btn-secondary" onClick={onReview} disabled={!canReview}>
            게시글 평가
          </button>
          <button className="btn-primary" onClick={onPublish} disabled={!canPublish}>
            출간하기
          </button>
        </div>
      </div>
    </header>
  )
}
