import Component from '../../core/Component.js';
import { navigateTo, navigateReplace } from '../../core/Router.js';
import AuthService from '../../utils/AuthService.js';
import { getCloudinarySignature } from '../../api/cloudinary.js';
import { createPost } from '../../api/posts.js';
import PostCreateRequest from '../../dto/request/post/PostCreateRequest.js';

const STORAGE_KEY = 'postDraft';
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

// Mock data as in the original new_design
const MOCK_TAGS = [
    'JavaScript', 'React', 'Vue', 'Angular', 'Node.js',
    'TypeScript', 'Python', 'Java', 'Spring', 'Django',
    'Backend', 'Frontend', 'DevOps', 'AWS', 'Docker',
    'Kubernetes', 'Database', 'SQL', 'MongoDB', 'Redis',
    'Architecture', 'Design Pattern', 'Algorithm', 'Data Structure',
    'Web', 'Mobile', 'iOS', 'Android', 'Flutter'
];

const MOCK_SERIES = [
    { id: 1, name: 'Backend 개발 시리즈' },
    { id: 2, name: 'Frontend 기초부터 심화까지' },
    { id: 3, name: '클라우드 아키텍처' },
    { id: 4, name: '알고리즘 정복하기' }
];

class PostPublishPage extends Component {
  constructor(props) {
    super(props);

    if (!AuthService.isLoggedIn()) {
      alert('로그인이 필요한 기능입니다.');
      navigateReplace('/login');
      return;
    }
    
    this.postData = this.loadDraft();
    if (!this.postData) {
        alert('저장된 초안이 없습니다. 글 작성 페이지로 돌아갑니다.');
        navigateReplace('/posts/create');
        return;
    }

    this.state = {
        title: this.postData.title,
        summary: '',
        summaryCharCount: 0,
        thumbnailUrl: this.postData.images && this.postData.images.length > 0 ? this.postData.images[0] : null,
        tags: [],
        tagInput: '',
        tagSuggestions: [],
        series: MOCK_SERIES,
        selectedSeriesId: null,
        visibility: 'public',
        isSeriesModalActive: false,
        isLoading: false,
    };

    this.loadStyle('/src/pages/PostPublishPage/style.css');
  }

  loadDraft() {
    const draftJson = localStorage.getItem(STORAGE_KEY);
    return draftJson ? JSON.parse(draftJson) : null;
  }
  
  render() {
    return `
      <main class="main-container">
          <div class="publish-wrapper">
              <div class="publish-header">
                  <h2 class="publish-title">게시글 출간</h2>
                  <p class="publish-subtitle">게시글의 정보를 입력하고 출간해보세요</p>
              </div>

              <div class="publish-content">
                  <section class="publish-section">
                      <h3 class="section-label">게시글 제목</h3>
                      <div class="post-title-preview" id="postTitlePreview">
                          ${this.state.title || '제목 없음'}
                      </div>
                  </section>

                  <section class="publish-section">
                      <label for="summaryInput" class="section-label">
                          간단한 소개
                          <span class="label-optional">선택</span>
                      </label>
                      <textarea
                          id="summaryInput"
                          class="summary-input"
                          placeholder="게시글을 간단히 소개해보세요 (최대 150자)"
                          maxlength="150"
                          rows="3"
                      >${this.state.summary}</textarea>
                      <div class="char-count">
                          <span id="summaryCharCount">${this.state.summaryCharCount}</span> / 150
                      </div>
                  </section>

                  <section class="publish-section">
                      <label class="section-label">
                          썸네일
                          <span class="label-optional">선택</span>
                      </label>
                      <div class="thumbnail-section">
                          <div class="thumbnail-preview ${this.state.thumbnailUrl ? 'has-image' : ''}" id="thumbnailPreview">
                              ${this.state.thumbnailUrl ? `<img src="${this.state.thumbnailUrl}" alt="썸네일">` : `
                                <div class="thumbnail-placeholder">
                                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                                        <rect x="6" y="6" width="36" height="36" rx="4" stroke="currentColor" stroke-width="3"/>
                                        <circle cx="18" cy="18" r="4" fill="currentColor"/>
                                        <path d="M42 30l-10-10-15 15-5-5-6 6" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                    <p>썸네일 이미지를 선택하세요</p>
                                </div>
                              `}
                          </div>
                          <div class="thumbnail-actions">
                              <button class="btn-secondary btn-small" id="uploadThumbnailBtn">
                                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                      <path d="M8 12V4M4 8l4-4 4 4M2 14h12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                  </svg>
                                  이미지 업로드
                              </button>
                              <button class="btn-secondary btn-small" id="removeThumbnailBtn" style="${this.state.thumbnailUrl ? '' : 'display: none;'}">
                                  제거
                              </button>
                          </div>
                          <p class="thumbnail-hint">첫 번째 이미지가 자동으로 썸네일로 설정됩니다</p>
                      </div>
                  </section>
                  
                  <section class="publish-section">
                    <label for="tagsInput" class="section-label">
                        태그
                        <span class="label-optional">선택</span>
                    </label>
                    <div class="tags-input-wrapper">
                        <div class="tags-container" id="tagsContainer">
                           <div class="selected-tags" id="selectedTags">
                              ${this.state.tags.map(tag => `
                                <div class="tag-chip" data-tag="${tag}">
                                    ${tag}
                                    <button class="remove-tag-btn">
                                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                            <path d="M10.5 3.5l-7 7M3.5 3.5l7 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                                        </svg>
                                    </button>
                                </div>
                              `).join('')}
                           </div>
                            <input
                                type="text"
                                id="tagsInput"
                                class="tags-input"
                                placeholder="태그를 입력하고 Enter를 누르세요"
                                value="${this.state.tagInput}"
                            >
                        </div>
                        <div class="tags-suggestions" id="tagsSuggestions" style="${this.state.tagSuggestions.length > 0 ? '' : 'display: none;'}">
                          ${this.state.tagSuggestions.map(suggestion => `
                            <div class="tag-suggestion-item" data-tag="${suggestion}">${suggestion}</div>
                          `).join('')}
                        </div>
                    </div>
                    <p class="tags-hint">태그를 입력하면 비슷한 태그를 추천해드립니다</p>
                </section>

                <section class="publish-section">
                    <label class="section-label">
                        시리즈
                        <span class="label-optional">선택</span>
                    </label>
                    <div class="series-selector">
                        <select id="seriesSelect" class="series-select">
                            <option value="">시리즈를 선택하세요</option>
                            ${this.state.series.map(s => `<option value="${s.id}" ${this.state.selectedSeriesId == s.id ? 'selected' : ''}>${s.name}</option>`).join('')}
                        </select>
                        <button class="btn-secondary btn-small" id="createSeriesBtn">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M8 3v10M3 8h10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                            </svg>
                            새 시리즈
                        </button>
                    </div>
                </section>

                <section class="publish-section">
                    <label class="section-label">
                        공개 설정
                    </label>
                    <div class="visibility-options">
                        <label class="radio-option">
                            <input type="radio" name="visibility" value="public" ${this.state.visibility === 'public' ? 'checked' : ''}>
                            <div class="radio-content">
                                <div class="radio-label">
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                        <path d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM10 1v18M1 10h18" stroke="currentColor" stroke-width="1.5"/>
                                    </svg>
                                    <span class="radio-title">전체 공개</span>
                                </div>
                                <p class="radio-description">모든 사람이 볼 수 있습니다</p>
                            </div>
                        </label>
                        <label class="radio-option">
                            <input type="radio" name="visibility" value="private" ${this.state.visibility === 'private' ? 'checked' : ''}>
                            <div class="radio-content">
                                <div class="radio-label">
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                        <rect x="3" y="8" width="14" height="10" rx="2" stroke="currentColor" stroke-width="1.5"/>
                                        <path d="M6 8V6a4 4 0 0 1 8 0v2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                                    </svg>
                                    <span class="radio-title">비공개</span>
                                </div>
                                <p class="radio-description">나만 볼 수 있습니다</p>
                            </div>
                        </label>
                    </div>
                </section>
              </div>

              <div class="publish-actions">
                  <button class="btn-secondary" id="cancelBtn">취소</button>
                  <button class="btn-primary" id="publishBtn">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M14 10v3.33A1.67 1.67 0 0 1 12.33 15H3.67A1.67 1.67 0 0 1 2 13.33V10M11.33 5.33L8 2 4.67 5.33M8 2v8.67" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                      출간하기
                  </button>
              </div>
          </div>
      </main>

      <input type="file" id="thumbnailInput" accept="image/jpeg,image/jpg,image/png,image/gif,image/webp" style="display: none;">

      <div class="modal ${this.state.isSeriesModalActive ? 'active' : ''}" id="seriesModal">
          <div class="modal-backdrop"></div>
          <div class="modal-content">
              <div class="modal-header">
                  <h3 class="modal-title">새 시리즈 만들기</h3>
                  <button class="modal-close" id="closeSeriesModal">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                          <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                      </svg>
                  </button>
              </div>
              <div class="modal-body">
                  <div class="form-group">
                      <label for="seriesNameInput" class="form-label">시리즈 이름</label>
                      <input
                          type="text"
                          id="seriesNameInput"
                          class="form-input"
                          placeholder="시리즈 이름을 입력하세요"
                          maxlength="50"
                      >
                  </div>
                  <div class="form-group">
                      <label for="seriesDescInput" class="form-label">시리즈 설명</label>
                      <textarea
                          id="seriesDescInput"
                          class="form-input"
                          placeholder="시리즈에 대한 간단한 설명을 입력하세요"
                          rows="3"
                          maxlength="200"
                      ></textarea>
                  </div>
              </div>
              <div class="modal-footer">
                  <button class="btn-secondary" id="cancelSeriesBtn">취소</button>
                  <button class="btn-primary" id="createSeriesSubmitBtn">만들기</button>
              </div>
          </div>
      </div>
      
      <div class="loading-overlay" id="loadingOverlay" style="${this.state.isLoading ? 'display: flex;' : 'display: none;'}">
          <div class="loading-spinner">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <circle cx="24" cy="24" r="20" stroke="#e5e5e5" stroke-width="4"/>
                  <circle cx="24" cy="24" r="20" stroke="#667eea" stroke-width="4" stroke-dasharray="125" stroke-dashoffset="25" stroke-linecap="round"/>
              </svg>
              <p>게시글을 출간하는 중...</p>
          </div>
      </div>
    `;
  }
  
  mounted() {
    if (window.headerComponent) {
      window.headerComponent.setState({ isVisible: false });
    }
    this.setupEventListeners();
  }

  componentWillUnmount() {
    if (window.headerComponent) {
      window.headerComponent.setState({ isVisible: true });
    }
  }

  setupEventListeners() {
    this.$el.querySelector('#summaryInput').addEventListener('input', e => {
      this.setState({ summary: e.target.value, summaryCharCount: e.target.value.length });
    });

    this.$el.querySelector('#tagsContainer').addEventListener('click', () => {
      this.$el.querySelector('#tagsInput').focus();
    });
    
    this.$el.querySelector('#tagsInput').addEventListener('input', e => {
        const query = e.target.value;
        const suggestions = MOCK_TAGS.filter(tag =>
            tag.toLowerCase().includes(query.toLowerCase()) && !this.state.tags.includes(tag)
        ).slice(0, 5);
        this.setState({ tagInput: query, tagSuggestions: suggestions });
    });
    
    this.$el.querySelector('#tagsInput').addEventListener('keydown', e => {
        if (e.key === 'Enter' && this.state.tagInput.trim()) {
            e.preventDefault();
            this.addTag(this.state.tagInput.trim());
        }
    });

    this.$el.querySelector('#tagsSuggestions').addEventListener('click', e => {
        if (e.target.classList.contains('tag-suggestion-item')) {
            this.addTag(e.target.dataset.tag);
        }
    });
    
    this.$el.querySelector('#selectedTags').addEventListener('click', e => {
        if (e.target.closest('.remove-tag-btn')) {
            const tagChip = e.target.closest('.tag-chip');
            this.removeTag(tagChip.dataset.tag);
        }
    });

    this.$el.querySelector('#uploadThumbnailBtn').addEventListener('click', () => {
      this.$el.querySelector('#thumbnailInput').click();
    });

    this.$el.querySelector('#thumbnailInput').addEventListener('change', e => {
      const file = e.target.files[0];
      this.handleThumbnailUpload(file);
      e.target.value = '';
    });

    this.$el.querySelector('#removeThumbnailBtn').addEventListener('click', () => {
      this.setState({ thumbnailUrl: null });
    });

    this.$el.querySelector('#seriesSelect').addEventListener('change', e => {
      this.setState({ selectedSeriesId: e.target.value || null });
    });

    this.$el.querySelector('#createSeriesBtn').addEventListener('click', () => {
      this.setState({ isSeriesModalActive: true });
    });

    this.$el.querySelector('#closeSeriesModal').addEventListener('click', () => this.setState({ isSeriesModalActive: false }));
    this.$el.querySelector('#cancelSeriesBtn').addEventListener('click', () => this.setState({ isSeriesModalActive: false }));
    this.$el.querySelector('#seriesModal .modal-backdrop').addEventListener('click', () => this.setState({ isSeriesModalActive: false }));
    this.$el.querySelector('#createSeriesSubmitBtn').addEventListener('click', () => this.createSeries());

    this.$el.querySelectorAll('input[name="visibility"]').forEach(radio => {
      radio.addEventListener('change', e => this.setState({ visibility: e.target.value }));
    });
    
    this.$el.querySelector('#cancelBtn').addEventListener('click', () => {
        if (confirm('작성을 취소하시겠습니까? 작성 페이지로 돌아갑니다.')) {
            navigateTo('/posts/create');
        }
    });

    this.$el.querySelector('#publishBtn').addEventListener('click', () => {
        this.publishPost();
    });
  }

  addTag(tag) {
    if (this.state.tags.includes(tag) || this.state.tags.length >= 5) return;
    this.setState({
      tags: [...this.state.tags, tag],
      tagInput: '',
      tagSuggestions: []
    });
  }

  removeTag(tag) {
    this.setState({
      tags: this.state.tags.filter(t => t !== tag)
    });
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
      Object.keys(signData.uploadParams).forEach(key => formData.append(key, signData.uploadParams[key]));
      formData.append('file', file);

      const uploadResponse = await fetch(signData.uploadUrl, { method: 'POST', body: formData });

      if (!uploadResponse.ok) throw new Error('썸네일 업로드 실패');

      const uploadResult = await uploadResponse.json();
      this.setState({ thumbnailUrl: uploadResult.secure_url || uploadResult.url });
    } catch (error) {
      console.error('Thumbnail upload failed:', error);
      alert(error.message);
    }
  }

  createSeries() {
    const nameInput = this.$el.querySelector('#seriesNameInput');
    const name = nameInput.value.trim();
    if (!name) {
      alert('시리즈 이름을 입력해주세요.');
      return;
    }

    // This is mock logic, in real app this would be an API call
    const newSeries = { id: this.state.series.length + 1, name };
    const updatedSeries = [...this.state.series, newSeries];
    
    this.setState({
      series: updatedSeries,
      selectedSeriesId: newSeries.id,
      isSeriesModalActive: false,
    });
    
    nameInput.value = '';
    this.$el.querySelector('#seriesDescInput').value = '';
  }

  async publishPost() {
    if (!this.postData.title || !this.postData.content) {
      alert('제목과 내용을 입력해주세요. 작성 페이지로 돌아갑니다.');
      navigateTo('/posts/create');
      return;
    }

    this.setState({ isLoading: true });

    const postPayload = new PostCreateRequest({
        memberId: AuthService.getUser()?.id, // Assuming user info is stored in AuthService
        title: this.postData.title,
        content: this.postData.content,
        image: this.state.thumbnailUrl,
        summary: this.state.summary || null,
        tags: this.state.tags,
        seriesId: this.state.selectedSeriesId,
        visibility: this.state.visibility,
        isDraft: false
    });
    
    try {
      const response = await createPost(postPayload);
      localStorage.removeItem(STORAGE_KEY);
      alert('게시글이 성공적으로 출간되었습니다!');
      navigateReplace(`/posts/${response.data.id}`);
    } catch (error) {
      console.error('Failed to publish post:', error);
      alert('게시글 출간에 실패했습니다. 다시 시도해주세요.');
      this.setState({ isLoading: false });
    }
  }
}

export default PostPublishPage;
