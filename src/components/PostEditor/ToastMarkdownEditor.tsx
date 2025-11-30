import { useCallback, useEffect, useRef } from 'react'
import { Editor } from '@toast-ui/react-editor'
import type { Editor as ToastEditor } from '@toast-ui/editor'
import '@toast-ui/editor/dist/toastui-editor.css'
import '@toast-ui/editor/dist/i18n/ko-kr'
import './PostEditor.css'
import type { ImageUploadProvider } from '@/api/uploadApi'

interface ToastMarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  imageProvider: ImageUploadProvider
  onImageProviderChange: (provider: ImageUploadProvider) => void
  onUploadImage: (file: File, provider: ImageUploadProvider) => Promise<string>
}

export default function ToastMarkdownEditor({
  value,
  onChange,
  imageProvider,
  onImageProviderChange,
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
        const uploadedUrl = await onUploadImage(file, imageProvider)
        const altText = file.name || 'image'
        callback(uploadedUrl, altText)
      } catch (error) {
        console.error('이미지 업로드 실패:', error)
        alert('이미지 업로드에 실패했습니다.')
      }
    },
    [imageProvider, onUploadImage]
  )

  return (
    <div className="toast-editor-container">
      <div className="upload-destination">
        <label htmlFor="upload-provider">이미지 업로드 대상</label>
        <select
          id="upload-provider"
          value={imageProvider}
          onChange={e => onImageProviderChange(e.target.value as ImageUploadProvider)}
        >
          <option value="cloudinary">Cloudinary</option>
          <option value="s3">AWS S3</option>
        </select>
      </div>
      <Editor
        ref={editorRef}
        initialValue={value || ' '}
        previewStyle="vertical"
        height="700px"
        initialEditType="markdown"
        useCommandShortcut={true}
        hideModeSwitch={false}
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
