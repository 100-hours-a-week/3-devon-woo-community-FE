import { useState } from 'react'
import './PostEditor.css'

interface FeedbackMenuProps {
  onGetFeedback: () => void
  onClearAll: () => void
  canGetFeedback: boolean
  hasFeedback: boolean
  isLoading?: boolean
}

export default function FeedbackMenu({ onGetFeedback, onClearAll, canGetFeedback, hasFeedback, isLoading }: FeedbackMenuProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="feedback-menu-container">
      <button
        className={`btn-secondary btn-feedback ${isExpanded ? 'expanded' : ''}`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M8 1.5L9.5 6.5H14.5L10.5 9.5L12 14.5L8 11.5L4 14.5L5.5 9.5L1.5 6.5H6.5L8 1.5Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
        AI 피드백
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          className={`expand-icon ${isExpanded ? 'rotated' : ''}`}
        >
          <path
            d="M3 4.5L6 7.5L9 4.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div className={`feedback-submenu ${isExpanded ? 'show' : ''}`}>
        <button
          className="feedback-submenu-item"
          onClick={() => {
            onGetFeedback()
            setIsExpanded(false)
          }}
          disabled={!canGetFeedback || isLoading}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8C2 4.68629 4.68629 2 8 2"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M14 2V6H10"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          피드백 받기
        </button>

        <button
          className="feedback-submenu-item danger"
          onClick={() => {
            onClearAll()
            setIsExpanded(false)
          }}
          disabled={!hasFeedback}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M2 4h12M5.5 4V2.5A1.5 1.5 0 0 1 7 1h2a1.5 1.5 0 0 1 1.5 1.5V4m2 0v9a2 2 0 0 1-2 2h-5a2 2 0 0 1-2-2V4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          전체 지우기
        </button>
      </div>
    </div>
  )
}
