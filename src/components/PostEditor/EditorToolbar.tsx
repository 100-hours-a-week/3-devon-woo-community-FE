import './PostEditor.css'

interface EditorToolbarProps {
  isPreviewMode: boolean
  onFormat: (format: string) => void
  onTogglePreview: () => void
  onImageClick: () => void
}

export default function EditorToolbar({
  isPreviewMode,
  onFormat,
  onTogglePreview,
  onImageClick,
}: EditorToolbarProps) {
  return (
    <div className="editor-toolbar-row">
      <div className="toolbar">
        <div className="toolbar-group">
          <button
            className="toolbar-btn"
            onClick={() => onFormat('bold')}
            title="Bold (Ctrl+B)"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                d="M4 3h7a3.5 3.5 0 0 1 0 7H4V3z M4 10h8a3.5 3.5 0 0 1 0 7H4v-7z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            className="toolbar-btn"
            onClick={() => onFormat('italic')}
            title="Italic (Ctrl+I)"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                d="M10 3h5M3 15h5M11 3l-4 12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            className="toolbar-btn"
            onClick={() => onFormat('strikethrough')}
            title="Strikethrough"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                d="M3 9h12M7 3h7M6 15h6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <div className="toolbar-divider"></div>

        <div className="toolbar-group">
          <button className="toolbar-btn" onClick={() => onFormat('h1')} title="Heading 1">
            <span className="btn-text">H1</span>
          </button>
          <button className="toolbar-btn" onClick={() => onFormat('h2')} title="Heading 2">
            <span className="btn-text">H2</span>
          </button>
          <button className="toolbar-btn" onClick={() => onFormat('h3')} title="Heading 3">
            <span className="btn-text">H3</span>
          </button>
          <button className="toolbar-btn" onClick={() => onFormat('h4')} title="Heading 4">
            <span className="btn-text">H4</span>
          </button>
        </div>

        <div className="toolbar-divider"></div>

        <div className="toolbar-group">
          <button className="toolbar-btn" onClick={() => onFormat('quote')} title="Quote">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                d="M3 9V5a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h0a2 2 0 0 1-2-2zM11 9V5a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h0a2 2 0 0 1-2-2z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
          </button>
          <button
            className="toolbar-btn"
            onClick={() => onFormat('code')}
            title="Code Block"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                d="M5 6l-3 3 3 3M13 6l3 3-3 3M11 3l-4 12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            className="toolbar-btn"
            onClick={() => onFormat('link')}
            title="Link (Ctrl+K)"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                d="M7 11l4-4M8.5 5.5l-1-1a3.5 3.5 0 0 0-5 5l1 1M9.5 12.5l1 1a3.5 3.5 0 0 0 5-5l-1-1"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div className="toolbar-divider"></div>

        <div className="toolbar-group">
          <button className="toolbar-btn" onClick={() => onFormat('ul')} title="Unordered List">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <circle cx="3" cy="4.5" r="1" fill="currentColor" />
              <circle cx="3" cy="9" r="1" fill="currentColor" />
              <circle cx="3" cy="13.5" r="1" fill="currentColor" />
              <path
                d="M7 4.5h8M7 9h8M7 13.5h8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <button className="toolbar-btn" onClick={() => onFormat('ol')} title="Ordered List">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                d="M2 3.5h2M3 3v3M7 4.5h8M7 9h8M7 13.5h8M2 8h3M2 13h3"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <button
            className="toolbar-btn"
            onClick={() => onFormat('checkbox')}
            title="Checklist"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <rect x="2" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
              <path
                d="M3.5 4.5l1 1 1.5-2M9 4.5h7M9 13.5h7"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <rect
                x="2"
                y="11"
                width="5"
                height="5"
                rx="1"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
          </button>
        </div>

        <div className="toolbar-divider"></div>

        <div className="toolbar-group">
          <button className="toolbar-btn" onClick={onImageClick} title="Insert Image">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <rect x="2" y="2" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="6.5" cy="6.5" r="1.5" fill="currentColor" />
              <path
                d="M16 11l-4-4-6 6-2-2-2 2"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            className="toolbar-btn"
            onClick={() => onFormat('divider')}
            title="Horizontal Rule"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M3 9h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="toolbar-spacer"></div>

        <div className="toolbar-group">
          <button
            className={`toolbar-btn toggle-btn ${isPreviewMode ? 'active' : ''}`}
            onClick={onTogglePreview}
            title="Toggle Preview"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                d="M1 9s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="9" cy="9" r="2" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            <span className="btn-text">미리보기</span>
          </button>
        </div>
      </div>
    </div>
  )
}
