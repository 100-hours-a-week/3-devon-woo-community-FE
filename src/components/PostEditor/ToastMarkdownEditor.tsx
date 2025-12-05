import { useCallback, useEffect, useRef, useState } from 'react'
import { Editor } from '@toast-ui/react-editor'
import type { Editor as ToastEditor } from '@toast-ui/editor'
import '@toast-ui/editor/dist/toastui-editor.css'
import '@toast-ui/editor/dist/i18n/ko-kr'
import AIPromptBox from './AIPromptBox'
import './PostEditor.css'

interface ToastMarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  onUploadImage: (file: File) => Promise<string>
  isPreviewVisible?: boolean
  onTogglePreview?: () => void
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
  const [lastContent, setLastContent] = useState('')
  const [showPromptBox, setShowPromptBox] = useState(false)
  const [promptBoxPosition, setPromptBoxPosition] = useState({ top: 0, left: 0 })
  const [atSymbolPosition, setAtSymbolPosition] = useState<{ start: number; end: number } | null>(null)
  const [isAIGenerating, setIsAIGenerating] = useState(false)

  useEffect(() => {
    const editorInstance = editorRef.current?.getInstance() as ToastEditor | undefined
    if (!editorInstance) return

    const currentMarkdown = editorInstance.getMarkdown()
    if (currentMarkdown !== value) {
      editorInstance.setMarkdown(value || '', true)
      setLastContent(value || '')
    }
  }, [value])

  const handleChange = useCallback(() => {
    const editorInstance = editorRef.current?.getInstance() as ToastEditor | undefined
    if (!editorInstance) return

    const markdown = editorInstance.getMarkdown()
    onChange(markdown)
    setLastContent(markdown)
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
      if (event.key === '@' && !showPromptBox) {
        setTimeout(() => {
          const markdown = editorInstance.getMarkdown()
          const atIndex = markdown.lastIndexOf('@')

          if (atIndex !== -1) {
            const editorEl = editorInstance.getEditorElements().mdEditor
            if (editorEl) {
              const rect = editorEl.getBoundingClientRect()
              setPromptBoxPosition({
                top: rect.top + 60,
                left: rect.left + 20
              })
              setAtSymbolPosition({
                start: atIndex,
                end: atIndex + 1
              })
              setShowPromptBox(true)
            }
          }
        }, 0)
      }
    }

    const editorEl = editorInstance.getEditorElements().mdEditor
    if (editorEl) {
      editorEl.addEventListener('keydown', handleKeyDown, true)
      return () => {
        editorEl.removeEventListener('keydown', handleKeyDown, true)
      }
    }
  }, [onAIGenerate, lastContent, showPromptBox])

  const handlePromptSubmit = useCallback(async (promptText: string) => {
    if (!onAIGenerate || !atSymbolPosition) return

    setIsAIGenerating(true)
    try {
      await onAIGenerate(promptText, atSymbolPosition.start, atSymbolPosition.end)
    } finally {
      setIsAIGenerating(false)
      setShowPromptBox(false)
      setAtSymbolPosition(null)
    }
  }, [onAIGenerate, atSymbolPosition])

  const handlePromptCancel = useCallback(() => {
    if (!atSymbolPosition) return

    const editorInstance = editorRef.current?.getInstance() as ToastEditor | undefined
    if (editorInstance) {
      const markdown = editorInstance.getMarkdown()
      const before = markdown.substring(0, atSymbolPosition.start)
      const after = markdown.substring(atSymbolPosition.end)
      editorInstance.setMarkdown(before + after, false)
    }

    setShowPromptBox(false)
    setAtSymbolPosition(null)
  }, [atSymbolPosition])

  return (
    <>
      <div className="toast-editor-container">
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

      {showPromptBox && (
        <AIPromptBox
          position={promptBoxPosition}
          onSubmit={handlePromptSubmit}
          onCancel={handlePromptCancel}
          isLoading={isAIGenerating}
        />
      )}
    </>
  )
}
