import Component from '../../core/Component.js';
import { login } from '../../api/auth.js';
import LoginRequest from '../../dto/request/auth/LoginRequest.js';
import AuthService from '../../utils/AuthService.js';
import { navigateTo, navigateReplace } from '../../core/Router.js';
import { withHeader, refreshAuthState } from '../../services/HeaderService.js';

const OAUTH_API_BASE_URL = 'http://localhost:8080';

class LoginPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      errorMessage: '',
      isPasswordVisible: false,
    };
    this._eventsBound = false;

    // If already logged in, redirect to the main page
    if (AuthService.isLoggedIn()) {
      navigateReplace('/');
      return;
    }

    this.loadStyle('/src/pages/LoginPage/style.css');
  }

  render() {
    // The main container and wrapper are now part of the component's template
    return `
      <div class="login-page">
        <div class="main-container">
          <div class="login-wrapper">
            <h2 class="page-title">로그인</h2>

            <form class="login-form" id="loginForm">
                <div class="form-group">
                    <input
                        type="email"
                        id="emailInput"
                        class="form-input"
                        placeholder="이메일"
                        required
                        autocomplete="email"
                    >
                </div>

                <div class="form-group">
                    <div class="password-wrapper">
                        <input
                            type="${this.state.isPasswordVisible ? 'text' : 'password'}"
                            id="passwordInput"
                            class="form-input"
                            placeholder="비밀번호"
                            required
                            autocomplete="current-password"
                        >
                        <button type="button" class="password-toggle ${this.state.isPasswordVisible ? 'active' : ''}" id="passwordToggle" aria-label="비밀번호 표시">
                           <svg class="eye-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path class="eye-open" d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <circle class="eye-open" cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path class="eye-closed" d="M2 2L22 22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: none;"/>
                            </svg>
                        </button>
                    </div>
                </div>

                <div class="error-message ${this.state.errorMessage ? 'visible' : ''}" id="errorMessage" aria-live="polite">
                    ${this.state.errorMessage || ' '}
                </div>

                <button type="submit" class="btn-primary btn-login">로그인</button>
            </form>

            <div class="divider">
                <span>또는</span>
            </div>

            <div class="oauth-section">
                <div class="oauth-buttons">
                    <button type="button" class="oauth-btn google" aria-label="구글로 로그인" title="구글로 로그인">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M18.17 8.37H10v3.45h4.71c-.4 2.06-2.02 3.18-4.71 3.18-2.87 0-5.2-2.33-5.2-5.2s2.33-5.2 5.2-5.2c1.24 0 2.37.44 3.25 1.17l2.58-2.58C14.33 1.85 12.28 1 10 1 5.03 1 1 5.03 1 10s4.03 9 9 9c5.18 0 8.92-3.64 8.92-8.78 0-.59-.06-1.17-.17-1.73-.08-.33-.17-.66-.58-1.12z" fill="currentColor"/>
                        </svg>
                    </button>
                    <button type="button" class="oauth-btn github" aria-label="깃허브로 로그인" title="깃허브로 로그인">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M10 0C4.477 0 0 4.477 0 10c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0110 4.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C17.137 18.165 20 14.418 20 10c0-5.523-4.477-10-10-10z" fill="currentColor"/>
                        </svg>
                    </button>
                    <button type="button" class="oauth-btn kakao" aria-label="카카오로 로그인" title="카카오로 로그인">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M10 0C4.477 0 0 3.582 0 8c0 2.866 1.946 5.37 4.867 6.75l-1.247 4.597c-.113.418.368.748.731.502l5.028-3.417c.206.011.414.018.621.018 5.523 0 10-3.582 10-8s-4.477-8-10-8z" fill="currentColor"/>
                        </svg>
                    </button>
                    <button type="button" class="oauth-btn naver" aria-label="네이버로 로그인" title="네이버로 로그인">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M13.6 10.8L6.4 0H0v20h6.4V9.2L13.6 20H20V0h-6.4v10.8z" fill="currentColor"/>
                        </svg>
                    </button>
                </div>
            </div>

            <div class="form-links">
                <a href="#" class="link" data-link="email">이메일</a>
                <span class="divider-dot">|</span>
                <a href="#" class="link" data-link="password">비밀번호</a>
                <span>를 잊으셨나요?</span>
            </div>

            <div class="signup-link">
                처음 지원하실경우엔 <a href="/signup" data-link>회원가입</a>이 필요합니다.
            </div>
          </div>
        </div>
      </div>
    `;
  }

  mounted() {
    withHeader((header) => {
      header.show();
      header.setVariant('minimal');
      header.showBackButton(false);
      header.showProfileIcon(false);
    });
    this.setupEventListeners();
  }

  beforeUnmount() {
    withHeader((header) => {
      header.setVariant('full');
      header.showBackButton(false);
      header.showProfileIcon(false);
    });
  }

  setupEventListeners() {
    if (this._eventsBound) return;
    this._eventsBound = true;

    this.delegate('submit', '#loginForm', (e) => {
      e.preventDefault();
      this.handleLogin();
    });

    this.delegate('click', '#passwordToggle', () => {
      this.setState({ isPasswordVisible: !this.state.isPasswordVisible });
    });

    this.delegate('click', '.oauth-btn', (e) => {
      const button = e.target.closest('.oauth-btn');
      if (!button) return;

      if (button.classList.contains('google')) this.handleOAuthLogin('google');
      if (button.classList.contains('github')) this.handleOAuthLogin('github');
      if (button.classList.contains('kakao')) this.handleOAuthLogin('kakao');
      if (button.classList.contains('naver')) this.handleOAuthLogin('naver');
    });

    this.delegate('input', '#emailInput, #passwordInput', () => {
      this.hideError();
    });

    this.delegate('click', '[data-link]', (e) => {
      e.preventDefault();
      const link = e.target.closest('[data-link]');
      if (!link) return;
      const href = link.getAttribute('href');
      if (href) {
        navigateTo(href);
      }
    });
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  async handleLogin() {
    const emailInput = this.$el.querySelector('#emailInput');
    const passwordInput = this.$el.querySelector('#passwordInput');
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email) {
      this.setState({ errorMessage: '이메일을 입력해주세요.' });
      emailInput.focus();
      return;
    }

    if (!this.isValidEmail(email)) {
      this.setState({ errorMessage: '올바른 이메일 형식이 아닙니다.' });
      emailInput.focus();
      return;
    }

    if (!password) {
      this.setState({ errorMessage: '비밀번호를 입력해주세요.' });
      passwordInput.focus();
      return;
    }

    try {
      const loginData = new LoginRequest({ email, password });
      const response = await login(loginData);

      AuthService.login(response.accessToken, response.refreshToken, response.member);
      refreshAuthState();
      navigateReplace('/');
    } catch (error) {
      console.error('Login failed:', error);
      const message = error.response?.data?.message || '이메일 또는 비밀번호가 올바르지 않습니다.';
      this.setState({ errorMessage: message });
    }
  }

  hideError() {
    if (this.state.errorMessage) {
      this.setState({ errorMessage: '' });
    }
  }

  handleOAuthLogin(provider) {
    window.location.href = `${OAUTH_API_BASE_URL}/oauth2/authorization/${provider}`;
  }
}

export default LoginPage;
