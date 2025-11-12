import Component from '../../core/Component.js';
import { login } from '../../api/auth.js';
import LoginRequest from '../../dto/request/auth/LoginRequest.js';
import AuthService from '../../utils/AuthService.js';
import { navigateReplace } from '../../core/Router.js';
import { validateEmail, validateLoginPassword } from '../../validation/authValidation.js';
import { VALIDATION_MESSAGES } from '../../validation/messages.js';

class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      emailError: '',
      passwordError: '',
      isLoading: false
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
                class="form-input ${this.state.emailError ? 'error' : ''}"
                placeholder="이메일을 입력하세요"
                value="${this.state.email}"
              />
              <p class="helper-text ${this.state.emailError ? 'show' : ''}" id="emailHelper">
                ${this.state.emailError || '*이메일을 입력해주세요'}
              </p>
            </div>

            <!-- 비밀번호 입력 -->
            <div class="form-group">
              <label for="passwordInput" class="form-label">비밀번호</label>
              <input
                type="password"
                id="passwordInput"
                class="form-input ${this.state.passwordError ? 'error' : ''}"
                placeholder="비밀번호를 입력하세요"
                value="${this.state.password}"
              />
              <p class="helper-text ${this.state.passwordError ? 'show' : ''}" id="passwordHelper">
                ${this.state.passwordError || '*비밀번호를 입력해주세요'}
              </p>
            </div>

            <!-- 로그인 버튼 -->
            <button
              type="submit"
              class="submit-btn ${this.state.isLoading ? 'loading' : ''}"
              id="submitBtn"
              disabled
            >
              ${this.state.isLoading ? '<div class="button-spinner"></div>' : ''}
              <span class="button-text">로그인</span>
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

    // 초기 버튼 상태 체크
    const submitBtn = this.$el.querySelector('#submitBtn');
    this.updateSubmitButton(submitBtn);
  }

  updated() {
    // DOM이 교체되므로 이벤트 리스너 재등록
    this.setupEventListeners();

    // 버튼 상태 재체크
    const submitBtn = this.$el.querySelector('#submitBtn');
    this.updateSubmitButton(submitBtn);
  }

  setupEventListeners() {
    const emailInput = this.$el.querySelector('#emailInput');
    const passwordInput = this.$el.querySelector('#passwordInput');
    const submitBtn = this.$el.querySelector('#submitBtn');
    const form = this.$el.querySelector('#loginForm');

    // 이메일 입력
    if (emailInput) {
      emailInput.addEventListener('input', (e) => {
        this.state.email = e.target.value;
        this.state.emailError = '';

        // 헬퍼 텍스트 숨김
        const helperText = this.$el.querySelector('#emailHelper');
        if (helperText) {
          helperText.classList.remove('show');
        }

        // 입력 필드 에러 상태 제거
        emailInput.classList.remove('error');

        // 버튼 활성화 상태 업데이트
        this.updateSubmitButton(submitBtn);
      });

      emailInput.addEventListener('blur', () => {
        this.checkEmailValidity();
      });
    }

    // 비밀번호 입력
    if (passwordInput) {
      passwordInput.addEventListener('input', (e) => {
        this.state.password = e.target.value;
        this.state.passwordError = '';

        // 헬퍼 텍스트 숨김
        const helperText = this.$el.querySelector('#passwordHelper');
        if (helperText) {
          helperText.classList.remove('show');
        }

        // 입력 필드 에러 상태 제거
        passwordInput.classList.remove('error');

        // 버튼 활성화 상태 업데이트
        this.updateSubmitButton(submitBtn);
      });

      passwordInput.addEventListener('blur', () => {
        this.checkPasswordValidity();
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

  // 이메일 유효성 검사
  checkEmailValidity() {
    const errorMessage = validateEmail(this.state.email);

    if (errorMessage) {
      this.setState({ emailError: errorMessage });
      return false;
    }

    this.setState({ emailError: '' });
    return true;
  }

  // 비밀번호 유효성 검사
  checkPasswordValidity() {
    const errorMessage = validateLoginPassword(this.state.password);

    if (errorMessage) {
      this.setState({ passwordError: errorMessage });
      return false;
    }

    this.setState({ passwordError: '' });
    return true;
  }

  // 폼 유효성 검사
  isFormValid() {
    if (this.state.isLoading) {
      return false;
    }

    const hasEmail = this.state.email.trim() !== '';
    const hasPassword = this.state.password.trim() !== '';
    const noErrors = !this.state.emailError && !this.state.passwordError;

    return hasEmail && hasPassword && noErrors;
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
      return;
    }

    // 최종 유효성 검사
    const isEmailValid = this.checkEmailValidity();
    const isPasswordValid = this.checkPasswordValidity();

    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    // 로딩 상태 시작
    this.setState({ isLoading: true });

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
      this.setState({
        isLoading: false,
        passwordError: VALIDATION_MESSAGES.LOGIN_FAILED
      });
    }
  }
}

export default LoginPage;
