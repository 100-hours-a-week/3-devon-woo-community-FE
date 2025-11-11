import Component from '../../core/Component.js';

/**
 * ProfileImageUploader 컴포넌트
 * 프로필 이미지 업로드 및 미리보기 기능
 */
class ProfileImageUploader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageUrl: props.imageUrl || '',
      error: ''
    };
    this.loadStyle('/src/components/ProfileImageUploader/style.css');
  }

  render() {
    return `
      <div class="profile-image-uploader">
        <label class="form-label">프로필 사진*</label>
        <div class="profile-upload-section">
          <div class="profile-image-container" id="profileImageContainer">
            ${this.state.imageUrl ? `
              <img src="${this.state.imageUrl}" alt="프로필" class="profile-image">
            ` : `
              <div class="profile-placeholder">
                <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                  <path d="M30 30C37.18 30 43 24.18 43 17C43 9.82 37.18 4 30 4C22.82 4 17 9.82 17 17C17 24.18 22.82 30 30 30ZM30 37C21.34 37 4 41.34 4 50V56H56V50C56 41.34 38.66 37 30 37Z" fill="#999"/>
                </svg>
              </div>
            `}
            <div class="profile-overlay">
              <span class="profile-overlay-text">변경</span>
            </div>
          </div>
          <input
            type="file"
            id="profileImageInput"
            class="profile-input-hidden"
            accept="image/jpeg,image/png,image/jpg,image/gif"
          >
        </div>
        ${this.state.error ? `
          <p class="error-message">${this.state.error}</p>
        ` : ''}
      </div>
    `;
  }

  mounted() {
    this.setupEventListeners();
  }

  updated() {
    this.setupEventListeners();
  }

  setupEventListeners() {
    const container = this.$el.querySelector('#profileImageContainer');
    const input = this.$el.querySelector('#profileImageInput');

    if (container) {
      container.addEventListener('click', () => {
        input.click();
      });
    }

    if (input) {
      input.addEventListener('change', (e) => {
        this.handleFileChange(e);
      });
    }
  }

  handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    // 파일 타입 검증
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      this.setState({
        error: '이미지 파일만 업로드 가능합니다. (JPEG, PNG, JPG, GIF)'
      });
      e.target.value = '';
      return;
    }

    // 파일 크기 검증 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      this.setState({
        error: '이미지 크기는 5MB 이하로 업로드해주세요.'
      });
      e.target.value = '';
      return;
    }

    // 에러 초기화
    this.setState({ error: '' });

    // FileReader로 미리보기 생성
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;

      // 상태 업데이트
      this.setState({ imageUrl: dataUrl });

      // 부모에게 파일과 dataUrl 전달
      if (this.props.onImageChange) {
        this.props.onImageChange(file, dataUrl);
      }
    };
    reader.readAsDataURL(file);
  }
}

export default ProfileImageUploader;
