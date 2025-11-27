import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { postApi } from '@/api'
import type { PostCreateRequest } from '@/types'
import { USE_MOCK } from '@/config/env'
import ComposeHeader from '@/components/PostEditor/ComposeHeader'
import EditorToolbar from '@/components/PostEditor/EditorToolbar'
import MarkdownPreview from '@/components/PostEditor/MarkdownPreview'
import PublishModal from '@/components/PostEditor/PublishModal'
import './PostCreatePage.css'

export default function PostCreatePage() {
  const { postId } = useParams<{ postId: string }>()
  const navigate = useNavigate()
  const titleTextareaRef = useRef<HTMLTextAreaElement>(null)
  const contentTextareaRef = useRef<HTMLTextAreaElement>(null)

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [autosaveStatusText, setAutosaveStatusText] = useState('모든 변경사항 저장됨')
  const [autosaveStatusTime, setAutosaveStatusTime] = useState('')
  const [showPublishModal, setShowPublishModal] = useState(false)
  const [summary, setSummary] = useState('')
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null)
  const [visibility, setVisibility] = useState('public')
  const [commentSetting, setCommentSetting] = useState('allow')
  const [isPublishing, setIsPublishing] = useState(false)

  const isEditMode = !!postId

  useEffect(() => {
    if (isEditMode) {
      loadPost()
    } else {
      const savedDraft = localStorage.getItem('postDraft')
      if (savedDraft) {
        try {
          const draft = JSON.parse(savedDraft)
          setTitle(draft.title || '')
          setContent(draft.content || '')
          setAutosaveStatusText('임시 저장된 글을 불러왔습니다')
        } catch (error) {
          console.error('Failed to load draft:', error)
        }
      }
    }

    const autosaveInterval = setInterval(() => {
      if (title || content) {
        const now = new Date()
        const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
        localStorage.setItem(
          'postDraft',
          JSON.stringify({ title, content, savedAt: new Date().toISOString() })
        )
        setAutosaveStatusText('저장됨')
        setAutosaveStatusTime(timeStr)
      }
    }, 30000)

    return () => {
      clearInterval(autosaveInterval)
    }
  }, [title, content, isEditMode])

  const loadPost = async () => {
    if (!postId) return

    if (!USE_MOCK) {
      try {
        const response = await postApi.getPostById(Number(postId))
        if (response.success && response.data) {
          const post = response.data
          setTitle(post.title)
          setContent(post.content)
          setSummary(post.summary)
          setThumbnailUrl(post.imageUrl)
        }
      } catch (error) {
        console.error('Failed to load post:', error)
      }
    }
  }

  const handleBack = () => {
    if (title || content) {
      if (confirm('작성 중인 내용이 있습니다. 나가시겠습니까?')) {
        navigate(-1)
      }
    } else {
      navigate(-1)
    }
  }

  const handleTempSave = () => {
    const now = new Date()
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
    localStorage.setItem(
      'postDraft',
      JSON.stringify({ title, content, savedAt: new Date().toISOString() })
    )
    setAutosaveStatusText('임시 저장됨')
    setAutosaveStatusTime(timeStr)
    alert('임시 저장되었습니다.')
  }

  const applyFormat = (format: string) => {
    const textarea = contentTextareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = content.substring(start, end)
    const beforeText = content.substring(0, start)
    const afterText = content.substring(end)

    let newText = ''
    let cursorOffset = 0

    switch (format) {
      case 'bold':
        newText = `**${selectedText || '굵게'}**`
        cursorOffset = selectedText ? newText.length : 2
        break
      case 'italic':
        newText = `*${selectedText || '기울임'}*`
        cursorOffset = selectedText ? newText.length : 1
        break
      case 'strikethrough':
        newText = `~~${selectedText || '취소선'}~~`
        cursorOffset = selectedText ? newText.length : 2
        break
      case 'h1':
        newText = `\n# ${selectedText || '제목 1'}\n`
        cursorOffset = selectedText ? newText.length - 1 : 3
        break
      case 'h2':
        newText = `\n## ${selectedText || '제목 2'}\n`
        cursorOffset = selectedText ? newText.length - 1 : 4
        break
      case 'h3':
        newText = `\n### ${selectedText || '제목 3'}\n`
        cursorOffset = selectedText ? newText.length - 1 : 5
        break
      case 'h4':
        newText = `\n#### ${selectedText || '제목 4'}\n`
        cursorOffset = selectedText ? newText.length - 1 : 6
        break
      case 'quote':
        newText = `\n> ${selectedText || '인용문'}\n`
        cursorOffset = selectedText ? newText.length - 1 : 3
        break
      case 'code':
        newText = `\n\`\`\`\n${selectedText || '코드'}\n\`\`\`\n`
        cursorOffset = selectedText ? newText.length - 5 : 5
        break
      case 'link':
        newText = `[${selectedText || '링크 텍스트'}](https://example.com)`
        cursorOffset = selectedText ? newText.length - 23 : 6
        break
      case 'ul':
        newText = `\n- ${selectedText || '목록 항목'}\n`
        cursorOffset = selectedText ? newText.length - 1 : 3
        break
      case 'ol':
        newText = `\n1. ${selectedText || '목록 항목'}\n`
        cursorOffset = selectedText ? newText.length - 1 : 4
        break
      case 'checkbox':
        newText = `\n- [ ] ${selectedText || '체크리스트 항목'}\n`
        cursorOffset = selectedText ? newText.length - 1 : 7
        break
      case 'divider':
        newText = '\n---\n'
        cursorOffset = newText.length
        break
      default:
        return
    }

    const updatedContent = beforeText + newText + afterText
    setContent(updatedContent)

    setTimeout(() => {
      textarea.focus()
      const newCursorPos = start + cursorOffset
      textarea.setSelectionRange(newCursorPos, newCursorPos)
    }, 0)
  }

  const handleImageClick = () => {
    const fileInput = document.createElement('input')
    fileInput.type = 'file'
    fileInput.accept = 'image/*'
    fileInput.onchange = async (e: Event) => {
      const target = e.target as HTMLInputElement
      const file = target.files?.[0]
      if (file) {
        alert('이미지 업로드 기능은 아직 구현되지 않았습니다.')
      }
    }
    fileInput.click()
  }

  const handleThumbnailSelect = () => {
    const fileInput = document.createElement('input')
    fileInput.type = 'file'
    fileInput.accept = 'image/*'
    fileInput.onchange = async (e: Event) => {
      const target = e.target as HTMLInputTarget
      const file = target.files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (event: ProgressEvent<FileReader>) => {
          if (event.target?.result) {
            setThumbnailUrl(event.target.result as string)
          }
        }
        reader.readAsDataURL(file)
      }
    }
    fileInput.click()
  }

  const handleThumbnailRemove = () => {
    setThumbnailUrl(null)
  }

  const handlePublishFromModal = async () => {
    if (!title.trim()) {
      alert('제목을 입력해주세요.')
      return
    }

    if (!content.trim()) {
      alert('내용을 입력해주세요.')
      return
    }

    setIsPublishing(true)

    const postData: PostCreateRequest = {
      title: title.trim(),
      content: content.trim(),
      summary: summary.trim() || content.slice(0, 150),
      image: thumbnailUrl || undefined,
      tags: [],
      visibility: visibility as 'public' | 'private',
      isDraft: false,
      commentsAllowed: commentSetting === 'allow',
    }

    if (!USE_MOCK) {
      try {
        if (isEditMode) {
          const response = await postApi.updatePost(Number(postId), postData)
          if (response.success) {
            localStorage.removeItem('postDraft')
            navigate(`/posts/${postId}`)
          }
        } else {
          const response = await postApi.createPost(postData)
          if (response.success && response.data) {
            localStorage.removeItem('postDraft')
            navigate(`/posts/${response.data.postId}`)
          }
        }
      } catch (error) {
        console.error('Failed to publish post:', error)
        alert('게시글 발행에 실패했습니다.')
      } finally {
        setIsPublishing(false)
        setShowPublishModal(false)
      }
    } else {
      setTimeout(() => {
        localStorage.removeItem('postDraft')
        alert('게시글이 발행되었습니다! (Mock)')
        setIsPublishing(false)
        setShowPublishModal(false)
        navigate('/')
      }, 1000)
    }
  }

  const adjustTextareaHeight = useCallback((element: HTMLTextAreaElement | null) => {
    if (element) {
      element.style.height = 'auto'
      element.style.height = `${element.scrollHeight}px`
    }
  }, [])

  useEffect(() => {
    adjustTextareaHeight(titleTextareaRef.current)
  }, [title, adjustTextareaHeight])

  useEffect(() => {
    adjustTextareaHeight(contentTextareaRef.current)
  }, [content, adjustTextareaHeight])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && !isPreviewMode) {
        switch (e.key.toLowerCase()) {
          case 'b':
            e.preventDefault()
            applyFormat('bold')
            break
          case 'i':
            e.preventDefault()
            applyFormat('italic')
            break
          case 'k':
            e.preventDefault()
            applyFormat('link')
            break
          case 's':
            e.preventDefault()
            handleTempSave()
            break
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [content, isPreviewMode])

  return (
    <div className="post-create-page">
      <ComposeHeader
        isEditMode={isEditMode}
        autosaveStatusText={autosaveStatusText}
        autosaveStatusTime={autosaveStatusTime}
        isSaving={false}
        onBack={handleBack}
        onTempSave={handleTempSave}
        onPublish={() => setShowPublishModal(true)}
      />

      <div className="main-container">
        <EditorToolbar
          isPreviewMode={isPreviewMode}
          onFormat={applyFormat}
          onTogglePreview={() => setIsPreviewMode(!isPreviewMode)}
          onImageClick={handleImageClick}
        />

        <div className="editor-wrapper">
          <div className="editor-header">
            <textarea
              ref={titleTextareaRef}
              className="title-input"
              placeholder="제목을 입력하세요"
              value={title}
              onChange={e => setTitle(e.target.value)}
              rows={1}
            />
          </div>

          <div className="editor-container">
            <div className={`editor-pane ${!isPreviewMode ? 'active' : ''}`}>
              <textarea
                ref={contentTextareaRef}
                className="content-textarea"
                placeholder="내용을 입력하세요 (Markdown 지원)"
                value={content}
                onChange={e => setContent(e.target.value)}
              />
            </div>

            <MarkdownPreview content={content} isActive={isPreviewMode} />
          </div>
        </div>
      </div>

      <PublishModal
        isOpen={showPublishModal}
        title={title}
        summary={summary}
        thumbnailUrl={thumbnailUrl}
        visibility={visibility}
        commentSetting={commentSetting}
        isPublishing={isPublishing}
        onClose={() => setShowPublishModal(false)}
        onSummaryChange={setSummary}
        onVisibilityChange={setVisibility}
        onCommentSettingChange={setCommentSetting}
        onThumbnailSelect={handleThumbnailSelect}
        onThumbnailRemove={handleThumbnailRemove}
        onPublish={handlePublishFromModal}
      />
    </div>
  )
}

interface HTMLInputTarget extends EventTarget {
  files: FileList | null
}
