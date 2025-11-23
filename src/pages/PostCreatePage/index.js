import Component from '../../core/Component.js';
import { navigateTo, navigateReplace } from '../../core/Router.js';
import AuthService from '../../utils/AuthService.js';
import { getCloudinarySignature } from '../../api/cloudinary.js';
import { createPost } from '../../api/posts.js';
import PostCreateRequest from '../../dto/request/post/PostCreateRequest.js';
import { hideHeader, showHeader } from '../../services/HeaderService.js';

const AUTOSAVE_INTERVAL = 30000;
const STORAGE_KEY = 'postDraft';
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

class PostCreatePage extends Component {
  constructor(props) {
    super(props);
    this.mode = props.mode || 'create';
    this.postId = props.postId || null;
    this.initialData = props.initialData || null;
    this.loadPostHandler = typeof props.loadPost === 'function' ? props.loadPost : null;
    this.publishExecutor = typeof props.onPublish === 'function' ? props.onPublish : null;
    this.afterPublish = typeof props.onPublishSuccess === 'function' ? props.onPublishSuccess : null;

    if (!AuthService.isLoggedIn()) {
      alert('로그인이 필요한 기능입니다.');
      navigateReplace('/login');
      return;
    }

    this.state = {
      title: '',
      content: '',
      uploadedImages: [],
      isPreviewMode: false,
      autosaveStatusText: '모든 변경사항 저장됨',
      autosaveStatusTime: '',
      isSaving: false,
      imageUploadModalActive: false,
      imageUploadProgress: [],
      showPublishModal: false,
      summary: '',
      summaryCharCount: 0,
      thumbnailUrl: null,
      visibility: 'public',
      isPublishing: false,
      commentSetting: 'allow'
    };

    this.autosaveTimer = null;
    this.loadStyle('/src/pages/PostCreatePage/style.css');
    this._eventsBound = false;
  }

  shouldUpdate(nextProps, nextState, prevState) {
    const changedKeys = Object.keys(nextState).filter((key) => nextState[key] !== prevState[key]);
    if (changedKeys.length === 0) return false;

    // 입력 중일 때는 불필요한 리렌더를 막아 커서가 튀지 않도록 한다.
    const contentOnlyChanged = changedKeys.every((key) => key === 'title' || key === 'content');
    if (contentOnlyChanged && !nextState.isPreviewMode) {
      return false;
    }

    return true;
  }

  update() {
    const activeElement = document.activeElement;
    const isTitleFocused = activeElement === this.titleInput;
    const isContentFocused = activeElement === this.contentTextarea;
    const selectionStart = isContentFocused && this.contentTextarea ? this.contentTextarea.selectionStart : null;
    const selectionEnd = isContentFocused && this.contentTextarea ? this.contentTextarea.selectionEnd : null;

    super.update();

    if (isTitleFocused && this.titleInput) {
      this.titleInput.focus();
      return;
    }

    if (isContentFocused && this.contentTextarea) {
      this.contentTextarea.focus();
      if (selectionStart !== null && selectionEnd !== null) {
        this.contentTextarea.setSelectionRange(selectionStart, selectionEnd);
      }
    }
  }

  render() {
    return `
      <div class="post-create-page">
        <header class="compose-header">
          <div class="compose-header-content">
            <div class="compose-header-left">
              <button class="icon-btn" id="backBtn" aria-label="뒤로 가기">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M12 4l-6 6 6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
              <div class="compose-header-text">
                <span class="compose-label">${this.mode === 'edit' ? '글 수정' : '새 글 작성'}</span>
              </div>
            </div>
            <div class="compose-header-right">
              <div class="autosave-status ${this.state.isSaving ? 'saving' : ''}" id="autosaveStatus">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" class="save-icon">
                  <path d="M13.5 5.5L6 13L2.5 9.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span class="status-text">${this.state.autosaveStatusText}</span>
                <span class="status-time">${this.state.autosaveStatusTime}</span>
              </div>
              <button class="btn-secondary" id="tempSaveBtn">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M12.67 1H3.33A2.33 2.33 0 0 0 1 3.33v9.34A2.33 2.33 0 0 0 15 12.67V3.33A2.33 2.33 0 0 0 12.67 1zM11 15v-4.67H5V15M11 1v3.67H3.33" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                임시 저장
              </button>
              <button class="btn-primary" id="publishBtn">출간하기</button>
            </div>
          </div>
        </header>

        <main class="main-container">
          <div class="editor-toolbar-row">
            <div class="toolbar" id="toolbar">
                <div class="toolbar-group">
                    <button class="toolbar-btn" data-action="bold" title="Bold (Ctrl+B)">
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <path d="M4 3h7a3.5 3.5 0 0 1 0 7H4V3z M4 10h8a3.5 3.5 0 0 1 0 7H4v-7z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
                        </svg>
                    </button>
                    <button class="toolbar-btn" data-action="italic" title="Italic (Ctrl+I)">
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <path d="M10 3h5M3 15h5M11 3l-4 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                    <button class="toolbar-btn" data-action="strikethrough" title="Strikethrough">
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <path d="M3 9h12M7 3h7M6 15h6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                </div>

                <div class="toolbar-divider"></div>

                <div class="toolbar-group">
                    <button class="toolbar-btn" data-action="h1" title="Heading 1">
                        <span class="btn-text">H1</span>
                    </button>
                    <button class="toolbar-btn" data-action="h2" title="Heading 2">
                        <span class="btn-text">H2</span>
                    </button>
                    <button class="toolbar-btn" data-action="h3" title="Heading 3">
                        <span class="btn-text">H3</span>
                    </button>
                    <button class="toolbar-btn" data-action="h4" title="Heading 4">
                        <span class="btn-text">H4</span>
                    </button>
                </div>

                <div class="toolbar-divider"></div>

                <div class="toolbar-group">
                    <button class="toolbar-btn" data-action="quote" title="Quote">
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <path d="M3 9V5a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h0a2 2 0 0 1-2-2zM11 9V5a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h0a2 2 0 0 1-2-2z" stroke="currentColor" stroke-width="1.5"/>
                        </svg>
                    </button>
                    <button class="toolbar-btn" data-action="code" title="Code Block">
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <path d="M5 6l-3 3 3 3M13 6l3 3-3 3M11 3l-4 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                    <button class="toolbar-btn" data-action="link" title="Link (Ctrl+K)">
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <path d="M7 11l4-4M8.5 5.5l-1-1a3.5 3.5 0 0 0-5 5l1 1M9.5 12.5l1 1a3.5 3.5 0 0 0 5-5l-1-1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                        </svg>
                    </button>
                </div>

                <div class="toolbar-divider"></div>

                <div class="toolbar-group">
                    <button class="toolbar-btn" data-action="ul" title="Unordered List">
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <circle cx="3" cy="4.5" r="1" fill="currentColor"/>
                            <circle cx="3" cy="9" r="1" fill="currentColor"/>
                            <circle cx="3" cy="13.5" r="1" fill="currentColor"/>
                            <path d="M7 4.5h8M7 9h8M7 13.5h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                        </svg>
                    </button>
                    <button class="toolbar-btn" data-action="ol" title="Ordered List">
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <path d="M2 3.5h2M3 3v3M7 4.5h8M7 9h8M7 13.5h8M2 8h3M2 13h3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                        </svg>
                    </button>
                    <button class="toolbar-btn" data-action="checkbox" title="Checklist">
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <rect x="2" y="2" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.5"/>
                            <path d="M3.5 4.5l1 1 1.5-2M9 4.5h7M9 13.5h7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            <rect x="2" y="11" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.5"/>
                        </svg>
                    </button>
                </div>

                <div class="toolbar-divider"></div>

                <div class="toolbar-group">
                    <button class="toolbar-btn" data-action="image" title="Insert Image">
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <rect x="2" y="2" width="14" height="14" rx="2" stroke="currentColor" stroke-width="1.5"/>
                            <circle cx="6.5" cy="6.5" r="1.5" fill="currentColor"/>
                            <path d="M16 11l-4-4-6 6-2-2-2 2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                    <button class="toolbar-btn" data-action="divider" title="Horizontal Rule">
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <path d="M3 9h12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                    </button>
                </div>

                <div class="toolbar-spacer"></div>

                <div class="toolbar-group">
                    <button class="toolbar-btn toggle-btn ${this.state.isPreviewMode ? 'active' : ''}" data-action="preview" title="Toggle Preview" id="previewToggle">
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <path d="M1 9s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            <circle cx="9" cy="9" r="2" stroke="currentColor" stroke-width="1.5"/>
                        </svg>
                        <span class="btn-text">미리보기</span>
                    </button>
                </div>
            </div>
          </div>

          <div class="editor-wrapper">
            <div class="editor-header">
                <input
                    type="text"
                    class="title-input"
                    id="titleInput"
                    placeholder="제목을 입력하세요"
                    maxlength="200"
                    value="${this.state.title}"
                >
            </div>

            <div class="editor-container">
                <div class="editor-pane ${!this.state.isPreviewMode ? 'active' : ''}" id="editorPane">
                    <div class="upload-zone" id="uploadZone">
                        <div class="upload-overlay" id="uploadOverlay">
                            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                                <path d="M24 36V16M16 24l8-8 8 8M8 40h32" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <p>이미지를 여기에 드롭하세요</p>
                        </div>
                        <textarea
                            class="content-textarea"
                            id="contentTextarea"
                            placeholder="내용을 입력하세요..."
                            spellcheck="false"
                        >${this.state.content}</textarea>
                    </div>
                </div>

                <div class="preview-pane ${this.state.isPreviewMode ? 'active' : ''}" id="previewPane">
                    <div class="preview-content" id="previewContent">
                        ${this.state.content ? this.parseMarkdown(this.state.content) : '<p class="preview-placeholder">미리보기 내용이 여기에 표시됩니다</p>'}
                    </div>
                </div>
            </div>
          </div>
        </main>

        <input type="file" id="imageInput" accept="image/jpeg,image/jpg,image/png,image/gif,image/webp" style="display: none;" multiple>
        <input type="file" id="thumbnailInput" accept="image/jpeg,image/jpg,image/png,image/gif,image/webp" style="display: none;">

        <div class="image-upload-modal ${this.state.imageUploadModalActive ? 'active' : ''}" id="imageUploadModal">
          <div class="modal-backdrop"></div>
          <div class="modal-content">
              <div class="modal-header">
                  <h3>이미지 업로드 중</h3>
              </div>
              <div class="upload-progress-list" id="uploadProgressList">
                ${this.state.imageUploadProgress.map(item => `
                  <div class="upload-progress-item">
                      <div class="upload-progress-icon ${item.status === 'uploading' ? 'uploading' : (item.status === 'success' ? 'success' : 'error')}">
                          ${item.status === 'uploading' ? `
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="2" stroke-dasharray="50" stroke-dashoffset="25"/>
                            </svg>
                          ` : item.status === 'success' ? `
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M16 6l-7 8-5-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                          ` : `
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M10 5v5m0 3v.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="2"/>
                            </svg>
                          `}
                      </div>
                      <div class="upload-progress-info">
                          <div class="upload-progress-name">${item.filename}</div>
                          <div class="upload-progress-bar">
                              <div class="upload-progress-fill" style="width: ${item.progress}%"></div>
                          </div>
                          <div class="upload-progress-status">${item.message}</div>
                      </div>
                  </div>
                `).join('')}
              </div>
          </div>
        </div>

        <div class="publish-modal ${this.state.showPublishModal ? 'active' : ''}" id="publishModal">
          <div class="publish-modal__overlay" data-publish-close="true"></div>
          <div class="publish-modal__sheet">
            <div class="publish-modal__top">
              <div class="publish-modal__heading">
                <p class="publish-modal__eyebrow">발행</p>
                <h3 class="publish-modal__title">게시글 설정</h3>
              </div>
              <div class="publish-modal__actions-top">
                <button type="button" class="publish-modal__link" id="openCclSetting">CCL 설정</button>
                <button type="button" class="publish-modal__close" id="publishModalClose" aria-label="닫기">&times;</button>
              </div>
            </div>
            <div class="publish-modal__divider"></div>
            <div class="publish-modal__grid">
              <div class="publish-modal__main">
                <div class="publish-row">
                  <div class="publish-row__label">제목</div>
                  <div class="publish-row__value">${this.state.title || '제목을 입력하세요'}</div>
                </div>

                <div class="publish-row">
                  <div class="publish-row__label">기본</div>
                  <div class="publish-row__value">
                    <div class="publish-radio-row">
                      ${['basic', 'public', 'protected', 'private'].map((key) => {
                        const labels = {
                          basic: '기본',
                          public: '공개',
                          protected: '공개(보호)',
                          private: '비공개'
                        };
                        const checked = this.state.visibility === key ? 'checked' : '';
                        return `
                          <label class="publish-radio">
                            <input type="radio" name="publishVisibility" value="${key}" ${checked}>
                            <span>${labels[key]}</span>
                          </label>
                        `;
                      }).join('')}
                    </div>
                  </div>
                </div>

                <div class="publish-row">
                  <div class="publish-row__label">댓글</div>
                  <div class="publish-row__value">
                    <select id="commentSetting" class="publish-select">
                      <option value="allow" ${this.state.commentSetting === 'allow' ? 'selected' : ''}>댓글 허용</option>
                      <option value="disallow" ${this.state.commentSetting === 'disallow' ? 'selected' : ''}>댓글 비허용</option>
                    </select>
                  </div>
                </div>

                <div class="publish-row publish-row--textarea">
                  <div class="publish-row__label">간단 소개</div>
                  <div class="publish-row__value">
                    <textarea
                      id="summaryInput"
                      class="publish-row__textarea"
                      maxlength="150"
                      placeholder="게시글을 간단히 소개해보세요 (최대 150자)"
                    >${this.state.summary}</textarea>
                    <span class="publish-row__count">
                      <span id="summaryCharCount">${this.state.summaryCharCount}</span> / 150
                    </span>
                  </div>
                </div>

                <div class="publish-row">
                  <div class="publish-row__label">URL</div>
                  <div class="publish-row__value muted">https://blog.example.com/${encodeURIComponent(this.state.title || '제목')}</div>
                </div>
              </div>

              <div class="publish-modal__side">
                <div class="publish-thumbnail ${this.state.thumbnailUrl ? 'has-image' : ''}" id="thumbnailPreview">
                  ${this.state.thumbnailUrl ? `<img src="${this.state.thumbnailUrl}" alt="썸네일">` : `
                    <div class="thumbnail-placeholder">
                      <span>대표 이미지 추가</span>
                    </div>
                  `}
                </div>
                <button type="button" class="publish-thumb-btn" id="thumbnailSelectBtn">이미지 선택</button>
                <button type="button" class="publish-thumb-remove ${this.state.thumbnailUrl ? '' : 'is-hidden'}" id="removeThumbnailBtn">제거</button>
              </div>
            </div>

            <div class="publish-modal__actions">
              <button type="button" class="btn-secondary" id="publishModalCancel">취소</button>
              <button type="button" class="btn-primary" id="confirmPublishBtn" ${this.state.isPublishing ? 'disabled' : ''}>
                ${this.state.isPublishing ? '출간 중...' : '출간하기'}
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }


  mounted() {
    // Hide the main header
    hideHeader();
    this.initEditor();
    this.setupEventListeners();
    this.initializeContent();
    this.initAutoSave();
    this.initKeyboardShortcuts();
  }

  beforeUnmount() {
    // Restore the main header
    showHeader();
    clearInterval(this.autosaveTimer);
    document.body.classList.remove('publish-modal-active');
  }

  updated() {
    this.initEditor();
    this.setupEventListeners();

    // 미리보기 모드일 때는 컨텐츠를 즉시 다시 렌더링
    if (this.state.isPreviewMode && this.previewContent) {
      this.previewContent.innerHTML = this.state.content
        ? this.parseMarkdown(this.state.content)
        : '<p class="preview-placeholder">미리보기 내용이 여기에 표시됩니다</p>';
    }
  }

  initEditor() {
    this.titleInput = this.$el.querySelector('#titleInput');
    this.contentTextarea = this.$el.querySelector('#contentTextarea');
    this.previewContent = this.$el.querySelector('#previewContent');
    this.previewPane = this.$el.querySelector('#previewPane');
    this.editorPane = this.$el.querySelector('#editorPane');
    this.previewToggle = this.$el.querySelector('#previewToggle');
    this.autosaveStatus = this.$el.querySelector('#autosaveStatus');
    this.uploadZone = this.$el.querySelector('#uploadZone');
    this.uploadOverlay = this.$el.querySelector('#uploadOverlay');
    this.imageInput = this.$el.querySelector('#imageInput');
    this.imageUploadModal = this.$el.querySelector('#imageUploadModal');
    this.uploadProgressList = this.$el.querySelector('#uploadProgressList');
    this.autoResizeContent();
  }

  async initializeContent() {
    if (this.mode === 'edit') {
      await this.loadExistingPost();
    } else {
      this.promptRestoreDraft();
    }
  }

  async loadExistingPost() {
    try {
      let data = this.initialData;
      if (!data && this.loadPostHandler) {
        data = await this.loadPostHandler(this.postId);
      }
      if (!data) return;

      const nextState = {
        title: data.title || '',
        content: data.content || '',
        uploadedImages: data.images || [],
        summary: data.summary || '',
        summaryCharCount: (data.summary || '').length,
        thumbnailUrl: data.thumbnail || null,
        visibility: data.visibility || 'public'
      };

      this.setState(nextState, () => {
        if (this.contentTextarea) {
          this.contentTextarea.value = this.state.content;
          this.autoResizeContent();
        }
      });
    } catch (error) {
      console.error('Failed to load post for editing:', error);
      alert('게시글 정보를 불러오지 못했습니다.');
    }
  }

  autoResizeContent() {
    if (!this.contentTextarea) return;
    requestAnimationFrame(() => {
      if (!this.contentTextarea) return;
      const textarea = this.contentTextarea;
      textarea.style.height = 'auto';
      const minHeight = 400;
      const nextHeight = Math.max(textarea.scrollHeight, minHeight);
      textarea.style.height = `${nextHeight}px`;
    });
  }

  setupEventListeners() {
    if (this._eventsBound) return;
    this._eventsBound = true;

    this.delegate('input', '#titleInput', (e) => {
      this.setState({ title: e.target.value });
      this.triggerAutoSave();
    });

    this.delegate('input', '#contentTextarea', (e) => {
      this.setState({ content: e.target.value });
      this.triggerAutoSave();
      this.autoResizeContent();
    });

    this.delegate('click', '#toolbar', (e) => {
      const btn = e.target.closest('.toolbar-btn');
      if (!btn) return;

      const action = btn.dataset.action;
      if (action === 'preview') {
        this.togglePreview();
      } else if (action === 'image') {
        this.imageInput?.click();
      } else {
        this.applyFormat(action);
      }
    });

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach((eventName) => {
      this.delegate(eventName, '#uploadZone', (e) => {
        e.preventDefault();
        e.stopPropagation();
      });
    });

    ['dragenter', 'dragover'].forEach((eventName) => {
      this.delegate(eventName, '#uploadZone', () => {
        this.uploadOverlay?.classList.add('active');
      });
    });

    ['dragleave', 'drop'].forEach((eventName) => {
      this.delegate(eventName, '#uploadZone', () => {
        this.uploadOverlay?.classList.remove('active');
      });
    });

    this.delegate('drop', '#uploadZone', (e) => {
      const files = Array.from(e.dataTransfer.files).filter(file =>
        ALLOWED_IMAGE_TYPES.includes(file.type)
      );
      if (files.length > 0) {
        this.handleImageFiles(files);
      }
    });

    this.delegate('change', '#imageInput', (e) => {
      const files = Array.from(e.target.files);
      if (files.length > 0) {
        this.handleImageFiles(files);
      }
      e.target.value = '';
    });

    this.delegate('click', '#backBtn', () => {
      if (this.hasUnsavedChanges()) {
        const leavePage = window.confirm('작성 중인 내용이 있습니다. 페이지를 나가시겠습니까?');
        if (!leavePage) return;

        const keepDraft = window.confirm('임시 저장하시겠습니까? 확인을 누르면 저장된 상태로 이동하고, 취소하면 작성 중인 내용이 삭제됩니다.');
        if (!keepDraft) {
          this.clearDraft();
        } else {
          this.saveDraftToLocalStorage();
        }
      } else {
        this.clearDraft();
      }
      navigateTo('/posts');
    });

    this.delegate('click', '#tempSaveBtn', () => {
      this.saveDraftToBackend();
    });

    this.delegate('click', '#publishBtn', () => {
      this.navigateToPublish();
    });

    this.delegate('click', '#publishModalClose', () => {
      this.closePublishModal();
    });

    this.delegate('click', '#openCclSetting', () => {
      alert('CCL 설정 기능은 준비 중입니다.');
    });

    this.delegate('click', '#publishModalCancel', () => {
      this.closePublishModal();
    });

    this.delegate('click', '[data-publish-close]', () => {
      this.closePublishModal();
    });

    this.delegate('input', '#summaryInput', (e) => {
      this.state.summary = e.target.value;
      this.state.summaryCharCount = e.target.value.length;
      this.updateSummaryCount();
    });

    this.delegate('click', '#thumbnailSelectBtn', () => {
      const input = this.$el.querySelector('#thumbnailInput');
      if (input) {
        input.click();
      }
    });

    this.delegate('change', '#thumbnailInput', (e) => {
      const file = e.target.files && e.target.files[0];
      if (file) {
        this.handleThumbnailUpload(file);
      }
      e.target.value = '';
    });

    this.delegate('click', '#removeThumbnailBtn', () => {
      if (!this.state.thumbnailUrl) return;
      this.state.thumbnailUrl = null;
      this.updateThumbnailPreview();
    });

    this.delegate('change', 'input[name="publishVisibility"]', (e) => {
      const input = e.target;
      if (!input) return;
      this.state.visibility = input.value;
    });

    this.delegate('change', '#commentSetting', (e) => {
      this.state.commentSetting = e.target.value;
    });

    this.delegate('click', '#confirmPublishBtn', () => {
      this.submitPublish();
    });
  }

  applyFormat(format) {
    const textarea = this.contentTextarea;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    const beforeText = textarea.value.substring(0, start);
    const afterText = textarea.value.substring(end);

    let newText = '';
    let cursorOffset = 0;

    switch (format) {
      case 'bold':
        newText = `**${selectedText || '텍스트'}**`;
        cursorOffset = selectedText ? newText.length : 2;
        break;
      case 'italic':
        newText = `*${selectedText || '텍스트'}*`;
        cursorOffset = selectedText ? newText.length : 1;
        break;
      case 'strikethrough':
        newText = `~~${selectedText || '텍스트'}~~`;
        cursorOffset = selectedText ? newText.length : 2;
        break;
      case 'h1':
        newText = `\n# ${selectedText || '제목 1'}\n`;
        cursorOffset = selectedText ? newText.length - 1 : 2;
        break;
      case 'h2':
        newText = `\n## ${selectedText || '제목 2'}\n`;
        cursorOffset = selectedText ? newText.length - 1 : 3;
        break;
      case 'h3':
        newText = `\n### ${selectedText || '제목 3'}\n`;
        cursorOffset = selectedText ? newText.length - 1 : 4;
        break;
      case 'h4':
        newText = `\n#### ${selectedText || '제목 4'}\n`;
        cursorOffset = selectedText ? newText.length - 1 : 5;
        break;
      case 'quote':
        newText = `\n> ${selectedText || '인용문'}\n`;
        cursorOffset = selectedText ? newText.length - 1 : 2;
        break;
      case 'code':
        newText = '\n```\n' + (selectedText || '코드') + '\n```\n';
        cursorOffset = selectedText ? 4 + selectedText.length : 4;
        break;
      case 'link':
        newText = `[${selectedText || '링크 텍스트'}](url)`;
        cursorOffset = selectedText ? newText.length - 4 : 1;
        break;
      case 'ul':
        newText = `\n- ${selectedText || '목록 항목'}\n`;
        cursorOffset = selectedText ? newText.length - 1 : 2;
        break;
      case 'ol':
        newText = `\n1. ${selectedText || '목록 항목'}\n`;
        cursorOffset = selectedText ? newText.length - 1 : 3;
        break;
      case 'checkbox':
        newText = `\n- [ ] ${selectedText || '할 일'}\n`;
        cursorOffset = selectedText ? newText.length - 1 : 6;
        break;
      case 'divider':
        newText = '\n---\n';
        cursorOffset = newText.length;
        break;
      default:
        return;
    }

    textarea.value = beforeText + newText + afterText;
    textarea.focus();
    textarea.setSelectionRange(start + cursorOffset, start + cursorOffset);

    this.setState({ content: textarea.value });
    this.triggerAutoSave();
  }

  togglePreview() {
    this.setState({ isPreviewMode: !this.state.isPreviewMode });
    // Render preview will be called automatically by updated() if needed
  }

  parseMarkdown(markdown) {
    if (!markdown.trim()) return '';

    let html = markdown;

    html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

    html = html.replace(/^#### (.*$)/gim, '<h4>$1</h4>');
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

    html = html.replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>');

    html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
    html = html.replace(/~~(.+?)~~/g, '<del>$1</del>');

    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">');

    html = html.replace(/^- \[ \] (.*)$/gim, '<ul class="checklist"><li>$1</li></ul>');
    html = html.replace(/^- \[x\] (.*)$/gim, '<ul class="checklist"><li class="checked">$1</li></ul>');
    html = html.replace(/^- (.*)$/gim, '<ul><li>$1</li></ul>');
    html = html.replace(/^\d+\. (.*)$/gim, '<ol><li>$1</li></ol>');

    html = html.replace(/<\/ul>\s*<ul>/g, '');
    html = html.replace(/<\/ul>\s*<ul class="checklist">/g, '');
    html = html.replace(/<\/ul class="checklist">\s*<ul class="checklist">/g, '');
    html = html.replace(/<\/ol>\s*<ol>/g, '');
    html = html.replace(/<\/blockquote>\s*<blockquote>/g, '\n');

    html = html.replace(/^---$/gim, '<hr>');

    html = html.split('\n').map(line => {
      if (line.trim() &&
        !line.match(/^<(h[1-6]|ul|ol|li|blockquote|pre|hr|div)/) &&
        !line.match(/<\/(h[1-6]|ul|ol|li|blockquote|pre|code|div)>$/)) {
        return `<p>${line}</p>`;
      }
      return line;
    }).join('\n');

    return html;
  }

  initAutoSave() {
    const autoSave = () => {
      this.saveDraftToLocalStorage();
      this.setState({ autosaveStatusText: '모든 변경사항 저장됨', isSaving: false });
    };

    this.autosaveTimer = setInterval(autoSave, AUTOSAVE_INTERVAL);
  }

  triggerAutoSave() {
    this.setState({ autosaveStatusText: '저장 중...', isSaving: true });
    clearInterval(this.autosaveTimer);

    setTimeout(() => {
      this.saveDraftToLocalStorage();
      const now = new Date();
      this.setState({
        autosaveStatusText: '모든 변경사항 저장됨',
        autosaveStatusTime: `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`,
        isSaving: false
      });
    }, 1000);

    this.autosaveTimer = setInterval(() => {
      this.saveDraftToLocalStorage();
      const now = new Date();
      this.setState({
        autosaveStatusText: '모든 변경사항 저장됨',
        autosaveStatusTime: `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`,
        isSaving: false
      });
    }, AUTOSAVE_INTERVAL);
  }

  saveDraftToLocalStorage() {
    const draft = {
      title: this.state.title,
      content: this.state.content,
      images: this.state.uploadedImages,
      summary: this.state.summary,
      thumbnailUrl: this.state.thumbnailUrl,
      visibility: this.state.visibility,
      lastSaved: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  }

  promptRestoreDraft() {
    const draft = this.getSavedDraft();
    if (!draft) return;

    const shouldLoad = window.confirm('이전에 작성하던 게시글이 있습니다. 불러오시겠습니까?');
    if (!shouldLoad) {
      this.clearDraft();
      return;
    }

    this.applyDraft(draft);
  }

  getSavedDraft() {
    const draftJson = localStorage.getItem(STORAGE_KEY);
    if (!draftJson) return null;
    try {
      return JSON.parse(draftJson);
    } catch (error) {
      console.error('Invalid draft data:', error);
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
  }

  applyDraft(draft) {
    this.setState({
      title: draft.title || '',
      content: draft.content || '',
      uploadedImages: draft.images || [],
      summary: draft.summary || '',
      summaryCharCount: (draft.summary || '').length,
      thumbnailUrl: draft.thumbnailUrl || null,
      visibility: draft.visibility || 'public'
    }, () => {
      if (this.contentTextarea) {
        this.contentTextarea.value = this.state.content;
        this.autoResizeContent();
      }
    });

    if (draft.lastSaved) {
      const lastSaved = new Date(draft.lastSaved);
      this.setState({
        autosaveStatusTime: `${lastSaved.getHours()}:${String(lastSaved.getMinutes()).padStart(2, '0')}`
      });
    }
  }

  clearDraft() {
    localStorage.removeItem(STORAGE_KEY);
    this.setState({
      uploadedImages: [],
      summary: '',
      summaryCharCount: 0,
      thumbnailUrl: null
    });
  }

  hasUnsavedChanges() {
    if (this.mode === 'edit' && this.initialData) {
      const baseTitle = this.initialData.title || '';
      const baseContent = this.initialData.content || '';
      const baseSummary = this.initialData.summary || '';
      const baseThumbnail = this.initialData.thumbnail || null;

      if (
        baseTitle !== this.state.title ||
        baseContent !== this.state.content ||
        baseSummary !== this.state.summary ||
        baseThumbnail !== this.state.thumbnailUrl
      ) {
        return true;
      }
    }
    return Boolean(
      this.state.title.trim() ||
      this.state.content.trim() ||
      (this.state.summary && this.state.summary.trim()) ||
      this.state.uploadedImages.length
    );
  }

  async handleImageFiles(files) {
    this.setState({ imageUploadModalActive: true });
    let newImageUploadProgress = [];

    const cursorPosition = this.contentTextarea.selectionStart;
    let insertText = '';

    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) {
        alert(`${file.name}은(는) 파일 크기가 너무 큽니다. (최대 10MB)`);
        continue;
      }

      const progressItemIndex = newImageUploadProgress.length;
      newImageUploadProgress.push({
        filename: file.name,
        progress: 0,
        status: 'uploading',
        message: '업로드 중...',
      });
      this.setState({ imageUploadProgress: newImageUploadProgress });

      try {
        const imageUrl = await this.uploadImage(file, progressItemIndex);
        insertText += `\n![${file.name}](${imageUrl})\n`;
        const updatedImages = [...this.state.uploadedImages, imageUrl];
        this.setState({ uploadedImages: updatedImages });
        if (!this.state.thumbnailUrl) {
          this.state.thumbnailUrl = imageUrl;
          if (this.state.showPublishModal) {
            this.updateThumbnailPreview();
          }
        }

        newImageUploadProgress[progressItemIndex] = {
          ...newImageUploadProgress[progressItemIndex],
          progress: 100,
          status: 'success',
          message: '업로드 완료',
        };
        this.setState({ imageUploadProgress: newImageUploadProgress });
      } catch (error) {
        console.error('Upload failed:', error);
        newImageUploadProgress[progressItemIndex] = {
          ...newImageUploadProgress[progressItemIndex],
          status: 'error',
          message: error.message || '업로드 실패',
        };
        this.setState({ imageUploadProgress: newImageUploadProgress });
      }
    }

    if (insertText) {
      const beforeText = this.state.content.substring(0, cursorPosition);
      const afterText = this.state.content.substring(cursorPosition);
      const newContent = beforeText + insertText + afterText;
      this.setState({ content: newContent });
      this.contentTextarea.value = newContent; // Update textarea value directly
      this.contentTextarea.focus();
      this.autoResizeContent();
      this.triggerAutoSave();
    }

    setTimeout(() => {
      this.setState({ imageUploadModalActive: false, imageUploadProgress: [] });
    }, 2000);
  }

  async uploadImage(file, progressItemIndex) {
    // Using existing cloudinary.js API service
    const signData = await getCloudinarySignature('post');

    // Simulate progress updates for demo
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 10;
      if (currentProgress < 90) {
        let newProgress = [...this.state.imageUploadProgress];
        if (newProgress[progressItemIndex]) {
          newProgress[progressItemIndex].progress = currentProgress;
          this.setState({ imageUploadProgress: newProgress });
        }
      } else {
        clearInterval(interval);
      }
    }, 100);

    const formData = new FormData();
    Object.keys(signData.uploadParams).forEach(key => {
      formData.append(key, signData.uploadParams[key]);
    });
    formData.append('file', file);

    const uploadResponse = await fetch(signData.uploadUrl, {
      method: 'POST',
      body: formData
    });

    if (!uploadResponse.ok) {
      clearInterval(interval);
      throw new Error('이미지 업로드 실패');
    }

    const uploadResult = await uploadResponse.json();
    clearInterval(interval);
    return uploadResult.secure_url || uploadResult.url;
  }

  initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        this.applyFormat('bold');
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
        e.preventDefault();
        this.applyFormat('italic');
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        this.applyFormat('link');
      } else if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        this.saveDraftToBackend();
      }
    });
  }

  async saveDraftToBackend() {
    const title = this.state.title.trim();
    const content = this.state.content.trim();

    if (!title || !content) {
      alert('제목과 내용을 입력해주세요.');
      return;
    }

    this.setState({ autosaveStatusText: '저장 중...', isSaving: true });

    try {
      // TODO: Implement actual backend save API call
      console.log('Saving draft to backend:', { title, content, images: this.state.uploadedImages, isDraft: true });

      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call

      alert('임시 저장되었습니다.');
      const now = new Date();
      this.setState({
        autosaveStatusText: '모든 변경사항 저장됨',
        autosaveStatusTime: `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`,
        isSaving: false
      });
    } catch (error) {
      console.error('Failed to save draft:', error);
      alert('임시 저장에 실패했습니다.');
      this.setState({
        autosaveStatusText: '저장 실패',
        isSaving: false
      });
    }
  }

  navigateToPublish() {
    const title = this.state.title.trim();
    const content = this.state.content.trim();

    if (!title) {
      alert('제목을 입력해주세요.');
      this.$el.querySelector('#titleInput')?.focus();
      return;
    }

    if (!content) {
      alert('내용을 입력해주세요.');
      this.$el.querySelector('#contentTextarea')?.focus();
      return;
    }

    if (!this.state.thumbnailUrl && this.state.uploadedImages?.length > 0) {
      this.state.thumbnailUrl = this.state.uploadedImages[0];
    }

    const summaryCharCount = this.state.summary.length;
    this.setState({
      showPublishModal: true,
      summaryCharCount
    });
    document.body.classList.add('publish-modal-active');
  }

  closePublishModal(force = false) {
    if (!force && this.state.isPublishing) return;
    if (!this.state.showPublishModal) return;
    document.body.classList.remove('publish-modal-active');
    this.setState({ showPublishModal: false });
  }

  updateSummaryCount() {
    const counter = this.$el?.querySelector('#summaryCharCount');
    if (counter) {
      counter.textContent = `${this.state.summaryCharCount}`;
    }
  }

  updateThumbnailPreview() {
    const preview = this.$el?.querySelector('#thumbnailPreview');
    if (!preview) return;
    if (this.state.thumbnailUrl) {
      preview.classList.add('has-image');
      preview.innerHTML = `<img src="${this.state.thumbnailUrl}" alt="썸네일">`;
    } else {
      preview.classList.remove('has-image');
      preview.innerHTML = `
        <div class="thumbnail-placeholder">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <rect x="4" y="4" width="24" height="24" rx="4" stroke="currentColor" stroke-width="2"/>
            <circle cx="12" cy="12" r="3" fill="currentColor"/>
            <path d="M28 20l-7-7-10 10-4-4-5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <p>썸네일 이미지를 선택하세요</p>
        </div>
      `;
    }
    const removeBtn = this.$el?.querySelector('#removeThumbnailBtn');
    if (removeBtn) {
      if (this.state.thumbnailUrl) {
        removeBtn.classList.remove('is-hidden');
      } else {
        removeBtn.classList.add('is-hidden');
      }
    }
  }

  async handleThumbnailUpload(file) {
    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.includes(file.type) || file.size > MAX_FILE_SIZE) {
      alert('10MB 이하의 이미지 파일(JPEG, PNG, GIF, WebP)만 업로드할 수 있습니다.');
      return;
    }

    try {
      const signData = await getCloudinarySignature('post');
      const formData = new FormData();
      Object.keys(signData.uploadParams).forEach((key) => formData.append(key, signData.uploadParams[key]));
      formData.append('file', file);

      const uploadResponse = await fetch(signData.uploadUrl, { method: 'POST', body: formData });
      if (!uploadResponse.ok) {
        throw new Error('썸네일 업로드 실패');
      }

      const uploadResult = await uploadResponse.json();
      this.state.thumbnailUrl = uploadResult.secure_url || uploadResult.url;
      this.updateThumbnailPreview();
    } catch (error) {
      console.error('Thumbnail upload failed:', error);
      alert(error.message || '썸네일 업로드에 실패했습니다.');
    }
  }

  async submitPublish() {
    if (this.state.isPublishing) return;

    const title = this.state.title.trim();
    const content = this.state.content.trim();

    if (!title || !content) {
      alert('제목과 내용을 입력해주세요.');
      return;
    }

    const payload = new PostCreateRequest({
      memberId: AuthService.getUser()?.id,
      title,
      content,
      image: this.state.thumbnailUrl || this.state.uploadedImages[0] || null,
      summary: this.state.summary.trim() || null,
      visibility: this.state.visibility,
      commentsAllowed: this.state.commentSetting === 'allow',
      isDraft: false
    });

    this.setState({ isPublishing: true });

    try {
      const executor = this.publishExecutor || this.createNewPost;
      const response = await executor(payload, {
        mode: this.mode,
        postId: this.postId
      });
      localStorage.removeItem(STORAGE_KEY);
      alert('게시글이 성공적으로 출간되었습니다!');
      this.closePublishModal(true);
      if (this.afterPublish) {
        this.afterPublish(response);
      } else if (response?.data?.id) {
        navigateReplace(`/posts/${response.data.id}`);
      } else {
        navigateReplace('/posts');
      }
    } catch (error) {
      console.error('Failed to publish post:', error);
      alert('게시글 출간에 실패했습니다. 다시 시도해주세요.');
    } finally {
      this.setState({ isPublishing: false });
    }
  }

  async createNewPost(payload) {
    return createPost(payload);
  }
}

export default PostCreatePage;
