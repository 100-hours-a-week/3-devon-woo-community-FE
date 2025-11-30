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
}

export default function ToastMarkdownEditor({
  value,
  onChange,
  onUploadImage,
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
      try {
        const file =
          blob instanceof File
            ? blob
            : new File([blob], 'image-upload', { type: blob.type || 'application/octet-stream' })
        const uploadedUrl = await onUploadImage(file)
        const altText = file.name || 'image'
        callback(uploadedUrl, altText)
      } catch (error) {
        console.error('이미지 업로드 실패:', error)
        alert('이미지 업로드에 실패했습니다.')
      }
    },
    [onUploadImage]
  )

  return (
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
  )
}
