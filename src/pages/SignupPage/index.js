import Component from '../../core/Component.js';

// 스타일 동적 로드
const loadStyle = () => {
  const linkId = 'signup-page-style';
  if (!document.getElementById(linkId)) {
    const link = document.createElement('link');
    link.id = linkId;
    link.rel = 'stylesheet';
    link.href = '/src/pages/SignupPage/style.css';
    document.head.appendChild(link);
  }
};

class SignupPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profileImage: null,
      email: '',
      password: '',
      passwordConfirm: '',
      nickname: ''
    };
    loadStyle();
  }

  render() {
    return `
      <div class="main-container">
        <div class="signup-wrapper">
          <h2 class="signup-title">회원가입</h2>

          <form class="signup-form" id="signupForm">
            <!-- 프로필 이미지 업로드 -->
            <div class="form-group profile-group">
              <label class="form-label">프로필 사진</label>
              <div class="profile-upload-section">
                <div class="profile-image-container" id="profileImageContainer">
                  <img src="" alt="프로필 이미지" class="profile-image" id="profileImage" style="display: none;">
                  <div class="profile-placeholder" id="profilePlaceholder">
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                      <path d="M20 10V30M10 20H30" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                  </div>
                  <input
                    type="file"
                    id="profileInput"
                    class="profile-input-hidden"
                    accept="image/jpeg,image/png,image/jpg"
                  >
                </div>
                <button type="button" class="profile-delete-btn" id="profileDeleteBtn" style="display: none;">
                  이미지 삭제
                </button>
              </div>
              <p class="helper-text" id="profileHelperText">* helper text</p>
            </div>

            <!-- 이메일 입력 -->
            <div class="form-group">
              <label for="emailInput" class="form-label">이메일*</label>
              <input
                type="email"
                id="emailInput"
                class="form-input"
                placeholder="이메일을 입력해주세요"
                value="${this.state.email}"
              />
              <p class="helper-text error" id="emailHelperText"></p>
            </div>

            <!-- 비밀번호 입력 -->
            <div class="form-group">
              <label for="passwordInput" class="form-label">비밀번호*</label>
              <input
                type="password"
                id="passwordInput"
                class="form-input"
                placeholder="비밀번호를 입력해주세요"
                value="${this.state.password}"
              />
              <p class="helper-text error" id="passwordHelperText"></p>
            </div>

            <!-- 비밀번호 확인 -->
            <div class="form-group">
              <label for="passwordConfirmInput" class="form-label">비밀번호 확인*</label>
              <input
                type="password"
                id="passwordConfirmInput"
                class="form-input"
                placeholder="비밀번호를 한번 더 입력해주세요"
                value="${this.state.passwordConfirm}"
              />
              <p class="helper-text error" id="passwordConfirmHelperText"></p>
            </div>

            <!-- 닉네임 입력 -->
            <div class="form-group">
              <label for="nicknameInput" class="form-label">닉네임*</label>
              <input
                type="text"
                id="nicknameInput"
                class="form-input"
                placeholder="닉네임을 입력해주세요"
                maxlength="10"
                value="${this.state.nickname}"
              />
              <p class="helper-text error" id="nicknameHelperText"></p>
            </div>

            <!-- 회원가입 버튼 -->
            <button type="submit" class="submit-btn" id="submitBtn" disabled>
              회원가입
            </button>

            <!-- 로그인 페이지로 이동 -->
            <div class="login-link-section">
              <a href="/login" class="login-link">로그인하러 가기</a>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  mounted() {
    // 회원가입 페이지에서는 뒤로가기 버튼 표시
    if (window.headerComponent) {
      window.headerComponent.showBackButton(true);
    }

    const profileImageContainer = this.$el.querySelector('#profileImageContainer');
    const profileInput = this.$el.querySelector('#profileInput');
    const profileImage = this.$el.querySelector('#profileImage');
    const profilePlaceholder = this.$el.querySelector('#profilePlaceholder');
    const profileDeleteBtn = this.$el.querySelector('#profileDeleteBtn');
    const emailInput = this.$el.querySelector('#emailInput');
    const passwordInput = this.$el.querySelector('#passwordInput');
    const passwordConfirmInput = this.$el.querySelector('#passwordConfirmInput');
    const nicknameInput = this.$el.querySelector('#nicknameInput');
    const submitBtn = this.$el.querySelector('#submitBtn');
    const form = this.$el.querySelector('#signupForm');

    // 프로필 이미지 클릭
    profileImageContainer.addEventListener('click', () => {
      profileInput.click();
    });

    // 프로필 이미지 선택
    profileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          profileImage.src = e.target.result;
          profileImage.style.display = 'block';
          profilePlaceholder.style.display = 'none';
          profileDeleteBtn.style.display = 'block';
          this.state.profileImage = file;
        };
        reader.readAsDataURL(file);
      }
    });

    // 프로필 이미지 삭제
    profileDeleteBtn.addEventListener('click', () => {
      profileImage.src = '';
      profileImage.style.display = 'none';
      profilePlaceholder.style.display = 'flex';
      profileDeleteBtn.style.display = 'none';
      profileInput.value = '';
      this.state.profileImage = null;
    });

    // 입력 이벤트
    emailInput.addEventListener('input', (e) => {
      this.state.email = e.target.value;
      this.checkFormValid(submitBtn);
    });

    passwordInput.addEventListener('input', (e) => {
      this.state.password = e.target.value;
      this.checkFormValid(submitBtn);
    });

    passwordConfirmInput.addEventListener('input', (e) => {
      this.state.passwordConfirm = e.target.value;
      this.checkFormValid(submitBtn);
    });

    nicknameInput.addEventListener('input', (e) => {
      this.state.nickname = e.target.value;
      this.checkFormValid(submitBtn);
    });

    // 폼 제출
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSubmit();
    });
  }

  beforeUnmount() {
    // 페이지 벗어날 때 뒤로가기 버튼 숨김
    if (window.headerComponent) {
      window.headerComponent.showBackButton(false);
    }
  }

  checkFormValid(submitBtn) {
    if (this.state.email && this.state.password &&
        this.state.passwordConfirm && this.state.nickname) {
      submitBtn.disabled = false;
    } else {
      submitBtn.disabled = true;
    }
  }

  handleSubmit() {
    console.log('회원가입 시도:', {
      email: this.state.email,
      password: this.state.password,
      passwordConfirm: this.state.passwordConfirm,
      nickname: this.state.nickname,
      profileImage: this.state.profileImage
    });
    alert('회원가입 기능은 아직 구현되지 않았습니다.');
  }
}

export default SignupPage;
