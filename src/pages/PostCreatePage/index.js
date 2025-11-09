import Component from '../../core/Component.js';

class PostCreatePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      content: '',
      image: null,
      imageUrl: '',
      showImagePreview: false
    };
    this.loadStyle('/src/pages/PostCreatePage/style.css');
  }

  render() {
    return `
      <div class="main-container">
        <div class="form-wrapper">
          <h2 class="form-title">게시글 작성</h2>

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
                  파일 선택
                </button>
                <span class="image-upload-text" id="imageUploadText">
                  ${this.state.image ? this.state.image.name : '파일을 선택해주세요.'}
                </span>
                <input
                  type="file"
                  id="imageInput"
                  class="image-input-hidden"
                  accept="image/jpeg,image/png,image/gif,image/jpg"
                >
              </div>

              <!-- 이미지 미리보기 -->
              ${this.state.showImagePreview ? `
                <div class="image-preview-container" id="imagePreviewContainer">
                  <img src="${this.state.imageUrl}" alt="미리보기" class="image-preview" id="imagePreview">
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
              ${this.isFormValid() ? '' : 'disabled'}
            >
              완료
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

    // 이벤트 리스너 등록
    this.setupEventListeners();
  }

  // 업데이트 시마다 호출
  updated() {
    // DOM이 교체되므로 이벤트 리스너 재등록
    this.setupEventListeners();
  }

  // 이벤트 리스너 설정
  setupEventListeners() {
    const titleInput = this.$el.querySelector('#titleInput');
    const contentInput = this.$el.querySelector('#contentInput');
    const imageUploadBtn = this.$el.querySelector('#imageUploadBtn');
    const imageInput = this.$el.querySelector('#imageInput');
    const form = this.$el.querySelector('#postForm');

    // 제목 입력
    if (titleInput) {
      titleInput.addEventListener('input', (e) => {
        this.setState({ title: e.target.value });
      });
    }

    // 내용 입력
    if (contentInput) {
      contentInput.addEventListener('input', (e) => {
        this.setState({ content: e.target.value });
      });
    }

    // 이미지 업로드 버튼 클릭
    if (imageUploadBtn && imageInput) {
      imageUploadBtn.addEventListener('click', () => {
        imageInput.click();
      });
    }

    // 이미지 파일 선택
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
              showImagePreview: true
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
          showImagePreview: false
        });
        if (imageInput) {
          imageInput.value = '';
        }
      }
    });

    // 폼 제출
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

  // 폼 유효성 검사
  isFormValid() {
    return this.state.title.trim() !== '' && this.state.content.trim() !== '';
  }

  // 폼 제출 처리
  handleSubmit() {
    if (!this.isFormValid()) {
      alert('제목, 내용을 모두 작성해주세요.');
      return;
    }

    console.log('게시글 작성:', {
      title: this.state.title,
      content: this.state.content,
      image: this.state.image
    });

    // TODO: API 호출
    // const formData = new FormData();
    // formData.append('title', this.state.title);
    // formData.append('content', this.state.content);
    // if (this.state.image) {
    //   formData.append('image', this.state.image);
    // }
    // await apiPost('/api/v1/posts', formData);

    alert('게시글 작성 기능은 아직 구현되지 않았습니다.');

    // 작성 완료 후 리스트로 이동
    // window.router.navigate('/posts');
  }
}

export default PostCreatePage;
