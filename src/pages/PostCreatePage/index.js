import Component from '../../core/Component.js';
import { navigateTo, navigateReplace } from '../../core/Router.js';
import AuthService from '../../utils/AuthService.js';
import { getCloudinarySignature } from '../../api/cloudinary.js';
import { hideHeader, showHeader } from '../../services/HeaderService.js';

const AUTOSAVE_INTERVAL = 30000;
const STORAGE_KEY = 'postDraft';
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

class PostCreatePage extends Component {
  constructor(props) {
    super(props);
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
                <span class="compose-label">새 글 작성</span>
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
      </div>
    `;
  }


  mounted() {
    // Hide the main header
    hideHeader();
    this.initEditor();
    this.setupEventListeners();
    this.loadDraft();
    this.initAutoSave();
    this.initKeyboardShortcuts();
  }

  beforeUnmount() {
    // Restore the main header
    showHeader();
    clearInterval(this.autosaveTimer);
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
      if (confirm('작성 중인 내용이 있습니다. 정말 나가시겠습니까?')) {
        navigateTo('/posts');
      }
    });

    this.delegate('click', '#tempSaveBtn', () => {
      this.saveDraftToBackend();
    });

    this.delegate('click', '#publishBtn', () => {
      this.navigateToPublish();
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
      lastSaved: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  }

  loadDraft() {
    const draftJson = localStorage.getItem(STORAGE_KEY);
    if (!draftJson) return;

    try {
      const draft = JSON.parse(draftJson);
      this.setState({
        title: draft.title || '',
        content: draft.content || '',
        uploadedImages: draft.images || [],
      });

      if (draft.lastSaved) {
        const lastSaved = new Date(draft.lastSaved);
        this.setState({
          autosaveStatusTime: `${lastSaved.getHours()}:${String(lastSaved.getMinutes()).padStart(2, '0')}`
        });
      }
    } catch (e) {
      console.error('Failed to load draft:', e);
    }
  }

  clearDraft() {
    localStorage.removeItem(STORAGE_KEY);
    this.setState({ uploadedImages: [] });
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
      this.$el.querySelector('#titleInput').focus();
      return;
    }

    if (!content) {
      alert('내용을 입력해주세요.');
      this.$el.querySelector('#contentTextarea').focus();
      return;
    }

    this.saveDraftToLocalStorage();
    navigateTo('/posts/publish'); // Navigate to the publish page
  }
}

export default PostCreatePage;
