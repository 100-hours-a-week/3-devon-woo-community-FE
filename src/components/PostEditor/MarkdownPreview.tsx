import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import './PostEditor.css'

interface MarkdownPreviewProps {
  content: string
  isActive: boolean
}

export default function MarkdownPreview({ content, isActive }: MarkdownPreviewProps) {
  return (
    <div className={`preview-pane ${isActive ? 'active' : ''}`}>
      <div className="preview-content">
        {content ? (
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        ) : (
          <p className="preview-placeholder">미리보기 내용이 여기에 표시됩니다</p>
        )}
      </div>
    </div>
  )
}
