import Component from '../../core/Component.js';
import { login } from '../../api/auth.js';
import LoginRequest from '../../dto/request/auth/LoginRequest.js';
import AuthService from '../../utils/AuthService.js';
import { navigateReplace } from '../../core/Router.js';

class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    };
    this.loadStyle('/src/pages/LoginPage/style.css');
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

    if (window.headerComponent) {
      window.headerComponent.showBackButton(false);
      window.headerComponent.showProfileIcon(false);
    }

    this.setupEventListeners();
  }

  updated() {
    this.setupEventListeners();
  }

  setupEventListeners() {
    const emailInput = this.$el.querySelector('#emailInput');
    const passwordInput = this.$el.querySelector('#passwordInput');
    const submitBtn = this.$el.querySelector('#submitBtn');
    const form = this.$el.querySelector('#loginForm');

    // 입력 이벤트
    if (emailInput) {
      emailInput.addEventListener('input', (e) => {
        this.state.email = e.target.value;
        this.checkFormValid(submitBtn);
      });
    }

    if (passwordInput) {
      passwordInput.addEventListener('input', (e) => {
        this.state.password = e.target.value;
        this.checkFormValid(submitBtn);
      });
    }

    // 폼 제출
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleSubmit();
      });
    }
  }

  checkFormValid(submitBtn) {
    if (this.state.email && this.state.password) {
      submitBtn.disabled = false;
    } else {
      submitBtn.disabled = true;
    }
  }

  async handleSubmit() {
    try {
      // DTO 생성
      const loginData = new LoginRequest({
        email: this.state.email,
        password: this.state.password
      });

      // API 호출
      const response = await login(loginData);

      // 로그인 성공 - userId를 localStorage에 저장
      AuthService.login(response.userId);

      // 게시글 목록으로 이동
      navigateReplace('/posts');
    } catch (error) {
      console.error('로그인 실패:', error);
      alert('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
    }
  }
}

export default LoginPage;
