import Component from '../../core/Component.js';
import { validateImageFile } from '../../utils/imageUpload.js';

/**
 * ProfileImageUploader 컴포넌트
 * 프로필 이미지 선택 및 미리보기 기능
 * 실제 업로드는 제출 시 부모 컴포넌트에서 처리
 */
class ProfileImageUploader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageUrl: props.imageUrl || '',
      error: '',
      selectedFile: null // 선택된 파일 객체
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

    // 파일 유효성 검사
    const validation = validateImageFile(file, 'profile');
    if (!validation.valid) {
      this.setState({ error: validation.error });
      e.target.value = '';
      return;
    }

    // 에러 초기화
    this.setState({ error: '' });

    // FileReader로 미리보기 생성 (브라우저에만 표시)
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;

      // 상태 업데이트: File 객체와 미리보기 URL 저장
      this.setState({
        imageUrl: dataUrl,
        selectedFile: file
      });

      // 부모에게 File 객체 전달 (실제 업로드는 제출 시)
      if (this.props.onFileSelected) {
        this.props.onFileSelected(file);
      }
    };
    reader.readAsDataURL(file);
  }

  /**
   * 선택된 파일 가져오기 (부모 컴포넌트에서 사용)
   */
  getSelectedFile() {
    return this.state.selectedFile;
  }
}

export default ProfileImageUploader;
