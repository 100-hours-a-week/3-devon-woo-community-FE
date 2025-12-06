import ToastMarkdownViewer from './ToastMarkdownViewer'
import './PostEditor.css'

interface AIConfirmDialogProps {
  isOpen: boolean
  generatedText: string
  onAccept: () => void
  onReject: () => void
}

export default function AIConfirmDialog({
  isOpen,
  generatedText,
  onAccept,
  onReject,
}: AIConfirmDialogProps) {
  if (!isOpen) return null

  return (
    <div className="ai-confirm-overlay">
      <div className="ai-confirm-content">
        <h3 className="ai-confirm-title">AI가 생성한 텍스트</h3>
        <div className="ai-confirm-preview">
          <ToastMarkdownViewer content={generatedText} />
        </div>
        <div className="ai-confirm-actions">
          <button className="btn-secondary" onClick={onReject}>
            취소
          </button>
          <button className="btn-primary" onClick={onAccept}>
            유지
          </button>
        </div>
      </div>
    </div>
  )
}
