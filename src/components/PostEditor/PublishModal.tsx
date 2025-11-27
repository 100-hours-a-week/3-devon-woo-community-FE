import { ChangeEvent } from 'react'
import './PostEditor.css'

interface PublishModalProps {
  isOpen: boolean
  title: string
  summary: string
  thumbnailUrl: string | null
  visibility: string
  commentSetting: string
  isPublishing: boolean
  onClose: () => void
  onSummaryChange: (value: string) => void
  onVisibilityChange: (value: string) => void
  onCommentSettingChange: (value: string) => void
  onThumbnailSelect: () => void
  onThumbnailRemove: () => void
  onPublish: () => void
}

export default function PublishModal({
  isOpen,
  title,
  summary,
  thumbnailUrl,
  visibility,
  commentSetting,
  isPublishing,
  onClose,
  onSummaryChange,
  onVisibilityChange,
  onCommentSettingChange,
  onThumbnailSelect,
  onThumbnailRemove,
  onPublish,
}: PublishModalProps) {
  if (!isOpen) return null

  return (
    <div className="publish-modal active">
      <div className="publish-modal__overlay" onClick={onClose}></div>
      <div className="publish-modal__sheet">
        <div className="publish-modal__top">
          <div className="publish-modal__heading">
            <p className="publish-modal__eyebrow">발행</p>
            <h3 className="publish-modal__title">게시글 설정</h3>
          </div>
          <div className="publish-modal__actions-top">
            <button type="button" className="publish-modal__close" onClick={onClose}>
              &times;
            </button>
          </div>
        </div>
        <div className="publish-modal__divider"></div>
        <div className="publish-modal__grid">
          <div className="publish-modal__main">
            <div className="publish-row">
              <div className="publish-row__label">제목</div>
              <div className="publish-row__value">{title || '제목을 입력하세요'}</div>
            </div>

            <div className="publish-row">
              <div className="publish-row__label">공개 설정</div>
              <div className="publish-row__value">
                <div className="publish-radio-row">
                  {['public', 'private'].map(key => (
                    <label key={key} className="publish-radio">
                      <input
                        type="radio"
                        name="publishVisibility"
                        value={key}
                        checked={visibility === key}
                        onChange={e => onVisibilityChange(e.target.value)}
                      />
                      <span>{key === 'public' ? '공개' : '비공개'}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="publish-row">
              <div className="publish-row__label">댓글</div>
              <div className="publish-row__value">
                <select
                  className="publish-select"
                  value={commentSetting}
                  onChange={e => onCommentSettingChange(e.target.value)}
                >
                  <option value="allow">댓글 허용</option>
                  <option value="disallow">댓글 비허용</option>
                </select>
              </div>
            </div>

            <div className="publish-row publish-row--textarea">
              <div className="publish-row__label">간단 소개</div>
              <div className="publish-row__value">
                <textarea
                  className="publish-row__textarea"
                  maxLength={150}
                  placeholder="게시글을 간단히 소개해보세요 (최대 150자)"
                  value={summary}
                  onChange={e => onSummaryChange(e.target.value)}
                />
                <span className="publish-row__count">{summary.length} / 150</span>
              </div>
            </div>

            <div className="publish-row">
              <div className="publish-row__label">URL</div>
              <div className="publish-row__value muted">
                https://blog.example.com/{encodeURIComponent(title || '제목')}
              </div>
            </div>
          </div>

          <div className="publish-modal__side">
            <div className={`publish-thumbnail ${thumbnailUrl ? 'has-image' : ''}`}>
              {thumbnailUrl ? (
                <img src={thumbnailUrl} alt="썸네일" />
              ) : (
                <div className="thumbnail-placeholder">
                  <span>대표 이미지 추가</span>
                </div>
              )}
            </div>
            <button type="button" className="publish-thumb-btn" onClick={onThumbnailSelect}>
              이미지 선택
            </button>
            {thumbnailUrl && (
              <button type="button" className="publish-thumb-remove" onClick={onThumbnailRemove}>
                제거
              </button>
            )}
          </div>
        </div>

        <div className="publish-modal__actions">
          <button type="button" className="btn-secondary" onClick={onClose}>
            취소
          </button>
          <button
            type="button"
            className="btn-primary"
            onClick={onPublish}
            disabled={isPublishing}
          >
            {isPublishing ? '출간 중...' : '출간하기'}
          </button>
        </div>
      </div>
    </div>
  )
}
