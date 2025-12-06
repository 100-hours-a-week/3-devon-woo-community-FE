import { useState, useRef, useEffect } from 'react'
import './AIPromptBox.css'

interface AIPromptBoxProps {
  position: { top: number; left: number }
  onSubmit: (prompt: string) => void
  onCancel: () => void
  isLoading?: boolean
}

export default function AIPromptBox({ position, onSubmit, onCancel, isLoading }: AIPromptBoxProps) {
  const [prompt, setPrompt] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSubmit = () => {
    if (prompt.trim() && !isLoading) {
      onSubmit(prompt.trim())
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault()
      handleSubmit()
    } else if (e.key === 'Escape') {
      onCancel()
    }
  }

  return (
    <div
      className="ai-prompt-box-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onCancel()
        }
      }}
    >
      <div
        className="ai-prompt-box"
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`
        }}
      >
        <div className="ai-prompt-header">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M8 1.5L9.5 6.5H14.5L10.5 9.5L12 14.5L8 11.5L4 14.5L5.5 9.5L1.5 6.5H6.5L8 1.5Z"
              fill="currentColor"
            />
          </svg>
          <span>AI로 글 작성하기</span>
        </div>

        <div className="ai-prompt-input-wrapper">
          <input
            ref={inputRef}
            type="text"
            className="ai-prompt-input"
            placeholder="어떤 내용을 작성할까요? (예: 블로그 소개글 작성)"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
          />

          <button
            className="ai-prompt-submit"
            onClick={handleSubmit}
            disabled={!prompt.trim() || isLoading}
          >
            {isLoading ? (
              <div className="ai-prompt-spinner" />
            ) : (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M2 8H14M14 8L9 3M14 8L9 13"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>
        </div>

        <div className="ai-prompt-hint">
          <kbd>Enter</kbd>로 생성 · <kbd>Esc</kbd>로 취소
        </div>
      </div>
    </div>
  )
}
