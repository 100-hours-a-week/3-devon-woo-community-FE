import ToastMarkdownViewer from './ToastMarkdownViewer'
import './PostEditor.css'

interface ReviewResultPopupProps {
  isVisible: boolean
  reviewItems: string[]
  isStreaming: boolean
  onCloseItem: (index: number) => void
}

export default function ReviewResultPopup({
  isVisible,
  reviewItems,
  isStreaming,
  onCloseItem,
}: ReviewResultPopupProps) {
  if (!isVisible || reviewItems.length === 0) return null

  return (
    <div className="review-popup">
      {reviewItems.map((item, index) => (
        <div key={index} className={`review-card ${isStreaming && index === reviewItems.length - 1 ? 'loading' : ''}`}>
          <button
            className="review-card-close"
            onClick={() => onCloseItem(index)}
            aria-label="닫기"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M12 4L4 12M4 4l8 8"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <div className="review-content">
            <ToastMarkdownViewer content={item} />
          </div>
        </div>
      ))}
    </div>
  )
}
