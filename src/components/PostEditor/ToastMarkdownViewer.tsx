import { useEffect, useRef } from 'react'
import { Viewer } from '@toast-ui/react-editor'
import type { Viewer as ToastViewer } from '@toast-ui/editor'
import '@toast-ui/editor/dist/toastui-editor-viewer.css'
import './PostEditor.css'

interface ToastMarkdownViewerProps {
  content: string
  className?: string
}

export default function ToastMarkdownViewer({ content, className }: ToastMarkdownViewerProps) {
  const viewerRef = useRef<Viewer>(null)

  useEffect(() => {
    const viewerInstance = viewerRef.current?.getInstance() as ToastViewer | undefined
    viewerInstance?.setMarkdown(content || '')
  }, [content])

  return (
    <div className={className}>
      <Viewer ref={viewerRef} initialValue={content || ''} usageStatistics={false} />
    </div>
  )
}
