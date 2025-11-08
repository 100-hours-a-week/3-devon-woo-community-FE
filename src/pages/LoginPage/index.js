import Component from '../../core/Component.js';

// 스타일 동적 로드
const loadStyle = () => {
  const linkId = 'login-page-style';
  if (!document.getElementById(linkId)) {
    const link = document.createElement('link');
    link.id = linkId;
    link.rel = 'stylesheet';
    link.href = '/src/pages/LoginPage/style.css';
    document.head.appendChild(link);
  }
};

class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    };
    loadStyle();
  }

  render() {
    return `
      <div class="main-container">
        <div class="login-wrapper">
          <h2 class="login-title">로그인</h2>

          <form class="login-form" id="loginForm">
            <!-- 이메일 입력 -->
            <div class="form-group">
              <label for="emailInput" class="form-label">이메일</label>
              <input
                type="email"
                id="emailInput"
                class="form-input"
                placeholder="이메일을 입력하세요"
                value="${this.state.email}"
              />
              <p class="helper-text error" id="emailHelperText">* helper text</p>
            </div>

            <!-- 비밀번호 입력 -->
            <div class="form-group">
              <label for="passwordInput" class="form-label">비밀번호</label>
              <input
                type="password"
                id="passwordInput"
                class="form-input"
                placeholder="비밀번호를 입력하세요"
                value="${this.state.password}"
              />
              <p class="helper-text error" id="passwordHelperText">* helper text</p>
            </div>

            <!-- 로그인 버튼 -->
            <button type="submit" class="submit-btn" id="submitBtn" disabled>
              로그인
            </button>

            <!-- 회원가입 링크 -->
            <div class="signup-link-section">
              <a href="/signup" class="signup-link">회원가입</a>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  mounted() {
    const emailInput = this.$el.querySelector('#emailInput');
    const passwordInput = this.$el.querySelector('#passwordInput');
    const submitBtn = this.$el.querySelector('#submitBtn');
    const form = this.$el.querySelector('#loginForm');

    // 입력 이벤트
    emailInput.addEventListener('input', (e) => {
      this.state.email = e.target.value;
      this.checkFormValid(submitBtn);
    });

    passwordInput.addEventListener('input', (e) => {
      this.state.password = e.target.value;
      this.checkFormValid(submitBtn);
    });

    // 폼 제출
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSubmit();
    });
  }

  checkFormValid(submitBtn) {
    if (this.state.email && this.state.password) {
      submitBtn.disabled = false;
    } else {
      submitBtn.disabled = true;
    }
  }

  handleSubmit() {
    console.log('로그인 시도:', {
      email: this.state.email,
      password: this.state.password
    });
    alert('로그인 기능은 아직 구현되지 않았습니다.');
  }
}

export default LoginPage;
