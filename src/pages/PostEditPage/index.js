import Component from '../../core/Component.js';

class PostEditPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      content: '',
      image: null,
      imageUrl: '',
      existingImageUrl: '', // 기존 이미지 URL
      showImagePreview: false,
      isLoading: true
    };
    this.loadStyle('/src/pages/PostEditPage/style.css');
    this.postId = null;
  }

  render() {
    if (this.state.isLoading) {
      return `
        <div class="main-container">
          <div class="loading-spinner">
            <div class="spinner"></div>
          </div>
        </div>
      `;
    }

    return `
      <div class="main-container">
        <div class="form-wrapper">
          <h2 class="form-title">게시글 수정</h2>

          <form class="post-form" id="postForm">
            <!-- 제목 입력 -->
            <div class="form-group">
              <label for="titleInput" class="form-label">제목*</label>
              <input
                type="text"
                id="titleInput"
                class="form-input"
                placeholder="제목을 입력해주세요. (최대 26글자)"
                maxlength="26"
                autocomplete="off"
                value="${this.state.title}"
              >
              <div class="input-helper">
                <span class="char-count ${this.state.title.length >= 26 ? 'warning' : ''}">
                  <span class="current-count">${this.state.title.length}</span>/26
                </span>
              </div>
            </div>

            <!-- 내용 입력 -->
            <div class="form-group">
              <label for="contentInput" class="form-label">내용*</label>
              <textarea
                id="contentInput"
                class="form-textarea"
                placeholder="내용을 입력해주세요."
                rows="10"
              >${this.state.content}</textarea>
              <div class="helper-text">
                * helper text
              </div>
            </div>

            <!-- 이미지 업로드 -->
            <div class="form-group">
              <label class="form-label">이미지</label>
              <div class="image-upload-section">
                <button type="button" class="image-upload-btn" id="imageUploadBtn">
                  ${this.state.existingImageUrl ? '이미지 변경' : '파일 선택'}
                </button>
                <span class="image-upload-text" id="imageUploadText">
                  ${this.state.image ? this.state.image.name : (this.state.existingImageUrl ? '기존 이미지' : '파일을 선택해주세요.')}
                </span>
                <input
                  type="file"
                  id="imageInput"
                  class="image-input-hidden"
                  accept="image/jpeg,image/png,image/gif,image/jpg"
                >
              </div>

              <!-- 이미지 미리보기 -->
              ${this.state.showImagePreview || this.state.existingImageUrl ? `
                <div class="image-preview-container" id="imagePreviewContainer">
                  <img
                    src="${this.state.imageUrl || this.state.existingImageUrl}"
                    alt="미리보기"
                    class="image-preview"
                    id="imagePreview"
                  >
                  <button type="button" class="image-remove-btn" id="imageRemoveBtn">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                  </button>
                </div>
              ` : ''}
            </div>

            <!-- 제출 버튼 -->
            <button
              type="submit"
              class="submit-btn"
              id="submitBtn"
              disabled
            >
              수정 완료
            </button>
          </form>
        </div>
      </div>
    `;
  }

  // 최초 마운트 시에만 1회 호출
  mounted() {
    // 뒤로가기 버튼 표시
    if (window.headerComponent) {
      window.headerComponent.showBackButton(true);
    }

    // URL에서 postId 추출 및 게시글 데이터 로딩 (1회만 실행됨)
    const path = window.location.pathname;
    const match = path.match(/\/posts\/(\d+)\/edit/);
    if (match) {
      this.postId = match[1];
      this.loadPost();
    }

    // 이벤트 리스너 등록
    this.setupEventListeners();

    // 초기 버튼 상태 체크
    const submitBtn = this.$el.querySelector('#submitBtn');
    this.updateSubmitButton(submitBtn);
  }

  // 업데이트 시마다 호출
  updated() {
    // DOM이 교체되므로 이벤트 리스너 재등록
    this.setupEventListeners();

    // 버튼 상태 재체크
    const submitBtn = this.$el.querySelector('#submitBtn');
    this.updateSubmitButton(submitBtn);
  }

  setupEventListeners() {
    const titleInput = this.$el.querySelector('#titleInput');
    const contentInput = this.$el.querySelector('#contentInput');
    const imageUploadBtn = this.$el.querySelector('#imageUploadBtn');
    const imageInput = this.$el.querySelector('#imageInput');
    const form = this.$el.querySelector('#postForm');
    const submitBtn = this.$el.querySelector('#submitBtn');

    // 제목 입력 - setState 없이 직접 업데이트
    if (titleInput) {
      titleInput.addEventListener('input', (e) => {
        this.state.title = e.target.value;

        // 글자 수 카운터 업데이트
        const charCount = this.$el.querySelector('.current-count');
        const charCountSpan = this.$el.querySelector('.char-count');
        if (charCount) {
          charCount.textContent = this.state.title.length;
        }
        if (charCountSpan) {
          if (this.state.title.length >= 26) {
            charCountSpan.classList.add('warning');
          } else {
            charCountSpan.classList.remove('warning');
          }
        }

        // 버튼 활성화 상태 업데이트
        this.updateSubmitButton(submitBtn);
      });
    }

    // 내용 입력 - setState 없이 직접 업데이트
    if (contentInput) {
      contentInput.addEventListener('input', (e) => {
        this.state.content = e.target.value;

        // 버튼 활성화 상태 업데이트
        this.updateSubmitButton(submitBtn);
      });
    }

    if (imageUploadBtn) {
      imageUploadBtn.addEventListener('click', () => {
        imageInput.click();
      });
    }

    if (imageInput) {
      imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          // 이미지 파일 형식 검증
          const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
          if (!validTypes.includes(file.type)) {
            alert('이미지 파일만 업로드 가능합니다. (jpg, png, gif)');
            imageInput.value = '';
            return;
          }

          const reader = new FileReader();
          reader.onload = (e) => {
            this.setState({
              image: file,
              imageUrl: e.target.result,
              showImagePreview: true,
              existingImageUrl: '' // 새 이미지 선택 시 기존 이미지 제거
            });
          };
          reader.readAsDataURL(file);
        }
      });
    }

    // 이미지 삭제 버튼 (이벤트 위임)
    this.$el.addEventListener('click', (e) => {
      const removeBtn = e.target.closest('#imageRemoveBtn');
      if (removeBtn) {
        this.setState({
          image: null,
          imageUrl: '',
          showImagePreview: false,
          existingImageUrl: ''
        });
        const imageInput = this.$el.querySelector('#imageInput');
        if (imageInput) {
          imageInput.value = '';
        }
      }
    });

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleSubmit();
      });
    }
  }

  beforeUnmount() {
    // 뒤로가기 버튼 숨김
    if (window.headerComponent) {
      window.headerComponent.showBackButton(false);
    }
  }

  // 게시글 데이터 로드
  async loadPost() {
    try {
      // TODO: API 호출
      // const response = await apiGet(`/api/v1/posts/${this.postId}`);

      // 임시 더미 데이터
      await new Promise(resolve => setTimeout(resolve, 500));

      const dummyPost = {
        id: this.postId,
        title: `게시글 제목 ${this.postId}`,
        content: `이것은 게시글 ${this.postId}의 본문입니다.\n\n수정할 수 있습니다.`,
        imageUrl: null // 또는 기존 이미지 URL
      };

      this.setState({
        title: dummyPost.title,
        content: dummyPost.content,
        existingImageUrl: dummyPost.imageUrl || '',
        isLoading: false
      });
    } catch (error) {
      console.error('게시글 로드 실패:', error);
      this.setState({ isLoading: false });
      alert('게시글을 불러오는데 실패했습니다.');
    }
  }

  // 폼 유효성 검사
  isFormValid() {
    return this.state.title.trim() !== '' && this.state.content.trim() !== '';
  }

  // 제출 버튼 활성화 상태 업데이트
  updateSubmitButton(submitBtn) {
    if (submitBtn) {
      if (this.isFormValid()) {
        submitBtn.disabled = false;
      } else {
        submitBtn.disabled = true;
      }
    }
  }

  // 폼 제출 처리
  async handleSubmit() {
    if (!this.isFormValid()) {
      alert('제목, 내용을 모두 작성해주세요.');
      return;
    }

    try {
      console.log('게시글 수정:', {
        title: this.state.title,
        content: this.state.content,
        image: this.state.image,
        existingImageUrl: this.state.existingImageUrl
      });

      // TODO: API 호출
      // const formData = new FormData();
      // formData.append('title', this.state.title);
      // formData.append('content', this.state.content);
      // if (this.state.image) {
      //   formData.append('image', this.state.image);
      // } else if (this.state.existingImageUrl) {
      //   // 기존 이미지 유지
      // }
      // await apiPut(`/api/v1/posts/${this.postId}`, formData);

      alert('게시글이 수정되었습니다.');

      // 수정 완료 후 상세 페이지로 이동
      window.router.navigate(`/posts/${this.postId}`);
    } catch (error) {
      console.error('게시글 수정 실패:', error);
      alert('게시글 수정에 실패했습니다.');
    }
  }
}

export default PostEditPage;
