import { useCallback, useEffect, useRef } from 'react'
import { Editor } from '@toast-ui/react-editor'
import type { Editor as ToastEditor } from '@toast-ui/editor'
import '@toast-ui/editor/dist/toastui-editor.css'
import '@toast-ui/editor/dist/i18n/ko-kr'
import './PostEditor.css'

interface ToastMarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  onUploadImage: (file: File) => Promise<string>
  isPreviewVisible: boolean
  onTogglePreview: () => void
  onAIGenerate?: (promptText: string, startPos: number, endPos: number) => void
}

export default function ToastMarkdownEditor({
  value,
  onChange,
  onUploadImage,
  isPreviewVisible,
  onTogglePreview,
  onAIGenerate,
}: ToastMarkdownEditorProps) {
  const editorRef = useRef<Editor>(null)

  useEffect(() => {
    const editorInstance = editorRef.current?.getInstance() as ToastEditor | undefined
    if (!editorInstance) return

    const currentMarkdown = editorInstance.getMarkdown()
    if (currentMarkdown !== value) {
      editorInstance.setMarkdown(value || '', true)
    }
  }, [value])

  const handleChange = useCallback(() => {
    const editorInstance = editorRef.current?.getInstance() as ToastEditor | undefined
    if (!editorInstance) return

    const markdown = editorInstance.getMarkdown()
    onChange(markdown)
  }, [onChange])

  const handleAddImageBlob = useCallback(
    async (blob: Blob | File, callback: (url: string, altText: string) => void) => {
      const editorInstance = editorRef.current?.getInstance() as ToastEditor | undefined
      let placeholderUrl: string | null = null
      try {
        const file =
          blob instanceof File
            ? blob
            : new File([blob], 'image-upload', { type: blob.type || 'application/octet-stream' })
        const altText = file.name || 'image'
        placeholderUrl = URL.createObjectURL(file)

        callback(placeholderUrl, altText)

        const uploadedUrl = await onUploadImage(file)
        if (editorInstance && placeholderUrl) {
          const markdown = editorInstance.getMarkdown()
          if (markdown.includes(placeholderUrl)) {
            editorInstance.setMarkdown(markdown.replaceAll(placeholderUrl, uploadedUrl), false)
          }
        }
      } catch (error) {
        if (editorInstance && placeholderUrl) {
          const markdown = editorInstance.getMarkdown()
          if (markdown.includes(placeholderUrl)) {
            editorInstance.setMarkdown(markdown.replaceAll(placeholderUrl, ''), false)
          }
        }
        console.error('이미지 업로드 실패:', error)
        alert('이미지 업로드에 실패했습니다.')
      } finally {
        if (placeholderUrl) {
          URL.revokeObjectURL(placeholderUrl)
        }
      }
    },
    [onUploadImage]
  )

  useEffect(() => {
    const editorInstance = editorRef.current?.getInstance() as ToastEditor | undefined
    if (!editorInstance || !onAIGenerate) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        const markdown = editorInstance.getMarkdown()
        const atMatch = markdown.match(/@([^\s@]+)$/)

        if (atMatch) {
          event.preventDefault()

          const promptText = atMatch[1]
          const endPos = markdown.length
          const startPos = endPos - atMatch[0].length

          onAIGenerate(promptText, startPos, endPos)
        }
      }
    }

    const editorEl = editorInstance.getEditorElements().mdEditor
    if (editorEl) {
      editorEl.addEventListener('keydown', handleKeyDown)
      return () => {
        editorEl.removeEventListener('keydown', handleKeyDown)
      }
    }
  }, [onAIGenerate])

  return (
    <div className="toast-editor-container">
      <button
        type="button"
        className={`toolbar-preview-toggle ${isPreviewVisible ? 'active' : ''}`}
        aria-pressed={isPreviewVisible}
        onClick={onTogglePreview}
        title="미리보기 토글"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
          <path
            d="M1 9s3.5-5 8-5 8 5 8 5-3.5 5-8 5-8-5-8-5z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="9" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </button>
      <Editor
        ref={editorRef}
        initialValue={value || ' '}
        previewStyle="tab"
        height="720px"
        initialEditType="markdown"
        useCommandShortcut={true}
        hideModeSwitch={true}
        usageStatistics={false}
        language="ko-KR"
        placeholder="내용을 입력하세요 (Markdown & WYSIWYG 모두 지원)"
        onChange={handleChange}
        hooks={{
          addImageBlobHook: handleAddImageBlob,
        }}
      />
    </div>
  )
}
