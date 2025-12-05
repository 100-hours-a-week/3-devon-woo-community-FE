import { useState } from 'react'
import ToastMarkdownViewer from './ToastMarkdownViewer'
import './PostEditor.css'

interface ReviewResultPopupProps {
  isVisible: boolean
  reviewItems: Array<{ id: string; content: string }>
  isStreaming: boolean
  onCloseItem: (id: string) => void
}

export default function ReviewResultPopup({
  isVisible,
  reviewItems,
  isStreaming,
  onCloseItem,
}: ReviewResultPopupProps) {
  const [removingId, setRemovingId] = useState<string | null>(null)

  if (!isVisible) return null

  const handleClose = (id: string) => {
    setRemovingId(id)
    setTimeout(() => {
      onCloseItem(id)
      setRemovingId(null)
    }, 300)
  }

  return (
    <div className="review-popup">
      {isStreaming && reviewItems.length === 0 && (
        <div className="review-card loading-initial">
          <div className="review-loading-spinner">
            <div className="spinner-circle"></div>
            <span>AI가 게시글을 분석하고 있습니다...</span>
          </div>
        </div>
      )}

      {reviewItems.map((item, index) => (
        <div
          key={item.id}
          className={`review-card ${isStreaming && index === reviewItems.length - 1 ? 'loading' : ''} ${
            removingId === item.id ? 'removing' : ''
          }`}
        >
          <button
            className="review-card-close"
            onClick={() => handleClose(item.id)}
            aria-label="닫기"
            disabled={removingId === item.id}
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
            <div className={`review-text-content ${isStreaming && index === reviewItems.length - 1 ? 'typing' : ''}`}>
              <ToastMarkdownViewer content={item.content} />
            </div>
          </div>
          {isStreaming && index === reviewItems.length - 1 && (
            <div className="review-streaming-indicator">
              <div className="streaming-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
