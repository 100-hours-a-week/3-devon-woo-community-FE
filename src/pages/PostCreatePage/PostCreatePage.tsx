import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { postApi, aiApi } from '@/api'
import type { PostCreateRequest } from '@/types'
import { USE_MOCK } from '@/config/env'
import ComposeHeader from '@/components/PostEditor/ComposeHeader'
import PublishModal from '@/components/PostEditor/PublishModal'
import ToastMarkdownEditor from '@/components/PostEditor/ToastMarkdownEditor'
import ToastMarkdownViewer from '@/components/PostEditor/ToastMarkdownViewer'
import AIConfirmDialog from '@/components/PostEditor/AIConfirmDialog'
import ReviewResultPopup from '@/components/PostEditor/ReviewResultPopup'
import { uploadImage } from '@/utils/uploads/uploadImage'
import './PostCreatePage.css'

export default function PostCreatePage() {
  const { postId } = useParams<{ postId: string }>()
  const navigate = useNavigate()
  const titleTextareaRef = useRef<HTMLTextAreaElement>(null)

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [autosaveStatusText, setAutosaveStatusText] = useState('모든 변경사항 저장됨')
  const [autosaveStatusTime, setAutosaveStatusTime] = useState('')
  const [showPublishModal, setShowPublishModal] = useState(false)
  const [summary, setSummary] = useState('')
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null)
  const [visibility, setVisibility] = useState('public')
  const [commentSetting, setCommentSetting] = useState('allow')
  const [isPublishing, setIsPublishing] = useState(false)
  const [showPreviewRail, setShowPreviewRail] = useState(true)
  const [reviewItems, setReviewItems] = useState<string[]>([])
  const [isReviewing, setIsReviewing] = useState(false)
  const [showAIConfirm, setShowAIConfirm] = useState(false)
  const [aiGeneratedText, setAIGeneratedText] = useState('')
  const [aiPromptToReplace, setAIPromptToReplace] = useState<{start: number, end: number} | null>(null)

  const isEditMode = !!postId
  const canPublish = !!title.trim() && !!content.trim()
  const canTempSave = !!(title.trim() || content.trim())
  const canReview = !!content.trim()
  const handleEditorChange = (value: string) => {
    setContent(value)
  }

  const handleImageUpload = useCallback((file: File) => uploadImage(file, { type: 'post' }), [])

  const handleAIGenerate = useCallback(async (promptText: string, startPos: number, endPos: number) => {
    try {
      const beforePrompt = content.substring(0, startPos)
      const afterPrompt = content.substring(endPos)

      const contentWithPlaceholder = beforePrompt + '{게시글 작성}' + afterPrompt

      const result = await aiApi.generate({
        content: contentWithPlaceholder,
        instruction: promptText
      })

      setAIGeneratedText(result)
      setAIPromptToReplace({ start: startPos, end: endPos })
      setShowAIConfirm(true)
    } catch (error) {
      console.error('AI 생성 실패:', error)
      alert('AI 생성에 실패했습니다.')
    }
  }, [content])

  const handleAIAccept = useCallback(() => {
    if (!aiPromptToReplace) return

    const before = content.substring(0, aiPromptToReplace.start)
    const after = content.substring(aiPromptToReplace.end)

    setContent(before + aiGeneratedText + after)
    setShowAIConfirm(false)
    setAIGeneratedText('')
    setAIPromptToReplace(null)
  }, [aiPromptToReplace, aiGeneratedText, content])

  const handleAIReject = useCallback(() => {
    if (!aiPromptToReplace) return

    const before = content.substring(0, aiPromptToReplace.start)
    const after = content.substring(aiPromptToReplace.end)

    setContent(before + '@' + after)
    setShowAIConfirm(false)
    setAIGeneratedText('')
    setAIPromptToReplace(null)
  }, [aiPromptToReplace, content])

  const handleReview = useCallback(async () => {
    if (!content.trim()) return

    setReviewItems([])
    setIsReviewing(true)

    let buffer = ''

    try {
      await aiApi.reviewStream(
        { text: content },
        (chunk: string) => {
          buffer += chunk
          const items = buffer.split('<<<REVIEW_ITEM>>>').filter(s => s.trim())
          setReviewItems(items)
        }
      )
    } catch (error) {
      console.error('리뷰 요청 실패:', error)
      alert('리뷰 요청에 실패했습니다.')
    } finally {
      setIsReviewing(false)
    }
  }, [content])

  const handleCloseReviewItem = useCallback((index: number) => {
    setReviewItems(prev => prev.filter((_, i) => i !== index))
  }, [])

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
  }, [isEditMode, postId])

  useEffect(() => {
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
  }, [title, content])

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
    if (showPublishModal) {
      document.body.classList.add('publish-modal-active')
    } else {
      document.body.classList.remove('publish-modal-active')
    }

    return () => {
      document.body.classList.remove('publish-modal-active')
    }
  }, [showPublishModal])

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
        onReview={handleReview}
        canTempSave={canTempSave}
        canPublish={canPublish}
        canReview={canReview}
      />

      <div className="main-container">
        <div className="title-container">
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
        </div>

        <div className="editor-shell">
          <div className="editor-wrapper">
            <div className="editor-container">
              <ToastMarkdownEditor
                value={content}
                onChange={handleEditorChange}
                onUploadImage={handleImageUpload}
                onAIGenerate={handleAIGenerate}
              />
            </div>
          </div>

          {/* {showPreviewRail && (
            <aside className="editor-preview-rail">
              <div className="preview-rail-body">
                <div className="preview-rail-scale">
                  <ToastMarkdownViewer content={content || ' '} />
                </div>
              </div>
            </aside>
          )} */}
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

      <AIConfirmDialog
        isOpen={showAIConfirm}
        generatedText={aiGeneratedText}
        onAccept={handleAIAccept}
        onReject={handleAIReject}
      />

      <ReviewResultPopup
        isVisible={reviewItems.length > 0}
        reviewItems={reviewItems}
        isStreaming={isReviewing}
        onCloseItem={handleCloseReviewItem}
      />
    </div>
  )
}

interface HTMLInputTarget extends EventTarget {
  files: FileList | null
}
