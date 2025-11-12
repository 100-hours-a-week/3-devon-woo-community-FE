import Component from '../../core/Component.js';
import { signup } from '../../api/auth.js';
import SignupRequest from '../../dto/request/auth/SignupRequest.js';
import AuthService from '../../utils/AuthService.js';
import { navigateReplace } from '../../core/Router.js';
import {
  validateEmail,
  validatePassword,
  validatePasswordConfirm,
  validateNickname
} from '../../validation/index.js';

class SignupPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profileImage: null,
      email: '',
      password: '',
      passwordConfirm: '',
      nickname: '',
      emailError: '',
      passwordError: '',
      passwordConfirmError: '',
      nicknameError: ''
    };
    this.loadStyle('/src/pages/SignupPage/style.css');
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
            </div>

            <!-- 이메일 입력 -->
            <div class="form-group">
              <label for="emailInput" class="form-label">이메일*</label>
              <input
                type="email"
                id="emailInput"
                class="form-input ${this.state.emailError ? 'error' : ''}"
                placeholder="이메일을 입력해주세요"
                value="${this.state.email}"
              />
              <p class="helper-text ${this.state.emailError ? 'show' : ''}" id="emailHelper">
                ${this.state.emailError || '*올바른 이메일 주소를 입력해주세요.'}
              </p>
            </div>

            <!-- 비밀번호 입력 -->
            <div class="form-group">
              <label for="passwordInput" class="form-label">비밀번호*</label>
              <input
                type="password"
                id="passwordInput"
                class="form-input ${this.state.passwordError ? 'error' : ''}"
                placeholder="비밀번호를 입력해주세요"
                value="${this.state.password}"
              />
              <p class="helper-text ${this.state.passwordError ? 'show' : ''}" id="passwordHelper">
                ${this.state.passwordError || '*비밀번호는 8자 이상, 20자 이하이며, 영문과 숫자를 포함해야 합니다.'}
              </p>
            </div>

            <!-- 비밀번호 확인 -->
            <div class="form-group">
              <label for="passwordConfirmInput" class="form-label">비밀번호 확인*</label>
              <input
                type="password"
                id="passwordConfirmInput"
                class="form-input ${this.state.passwordConfirmError ? 'error' : ''}"
                placeholder="비밀번호를 한번 더 입력해주세요"
                value="${this.state.passwordConfirm}"
              />
              <p class="helper-text ${this.state.passwordConfirmError ? 'show' : ''}" id="passwordConfirmHelper">
                ${this.state.passwordConfirmError || '*비밀번호를 한번 더 입력해주세요.'}
              </p>
            </div>

            <!-- 닉네임 입력 -->
            <div class="form-group">
              <label for="nicknameInput" class="form-label">닉네임*</label>
              <input
                type="text"
                id="nicknameInput"
                class="form-input ${this.state.nicknameError ? 'error' : ''}"
                placeholder="닉네임을 입력해주세요"
                maxlength="30"
                value="${this.state.nickname}"
              />
              <p class="helper-text ${this.state.nicknameError ? 'show' : ''}" id="nicknameHelper">
                ${this.state.nicknameError || '*닉네임을 입력해주세요.'}
              </p>
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
      window.headerComponent.showProfileIcon(false);
    }

    this.setupEventListeners();

    // 초기 버튼 상태 체크
    const submitBtn = this.$el.querySelector('#submitBtn');
    this.updateSubmitButton(submitBtn);
  }

  updated() {
    this.setupEventListeners();

    // 버튼 상태 재체크
    const submitBtn = this.$el.querySelector('#submitBtn');
    this.updateSubmitButton(submitBtn);
  }

  setupEventListeners() {
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
    if (profileImageContainer) {
      profileImageContainer.addEventListener('click', () => {
        profileInput.click();
      });
    }

    // 프로필 이미지 선택
    if (profileInput) {
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
    }

    // 프로필 이미지 삭제
    if (profileDeleteBtn) {
      profileDeleteBtn.addEventListener('click', () => {
        profileImage.src = '';
        profileImage.style.display = 'none';
        profilePlaceholder.style.display = 'flex';
        profileDeleteBtn.style.display = 'none';
        profileInput.value = '';
        this.state.profileImage = null;
      });
    }

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

    // 비밀번호 확인 입력
    if (passwordConfirmInput) {
      passwordConfirmInput.addEventListener('input', (e) => {
        this.state.passwordConfirm = e.target.value;
        this.state.passwordConfirmError = '';

        // 헬퍼 텍스트 숨김
        const helperText = this.$el.querySelector('#passwordConfirmHelper');
        if (helperText) {
          helperText.classList.remove('show');
        }

        // 입력 필드 에러 상태 제거
        passwordConfirmInput.classList.remove('error');

        // 버튼 활성화 상태 업데이트
        this.updateSubmitButton(submitBtn);
      });

      passwordConfirmInput.addEventListener('blur', () => {
        this.checkPasswordConfirmValidity();
      });
    }

    // 닉네임 입력
    if (nicknameInput) {
      nicknameInput.addEventListener('input', (e) => {
        this.state.nickname = e.target.value;
        this.state.nicknameError = '';

        // 헬퍼 텍스트 숨김
        const helperText = this.$el.querySelector('#nicknameHelper');
        if (helperText) {
          helperText.classList.remove('show');
        }

        // 입력 필드 에러 상태 제거
        nicknameInput.classList.remove('error');

        // 버튼 활성화 상태 업데이트
        this.updateSubmitButton(submitBtn);
      });

      nicknameInput.addEventListener('blur', () => {
        this.checkNicknameValidity();
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

  beforeUnmount() {
    // 페이지 벗어날 때 뒤로가기 버튼 숨김
    if (window.headerComponent) {
      window.headerComponent.showBackButton(false);
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
    const errorMessage = validatePassword(this.state.password);

    if (errorMessage) {
      this.setState({ passwordError: errorMessage });
      return false;
    }

    this.setState({ passwordError: '' });
    return true;
  }

  // 비밀번호 확인 유효성 검사
  checkPasswordConfirmValidity() {
    const errorMessage = validatePasswordConfirm(this.state.password, this.state.passwordConfirm);

    if (errorMessage) {
      this.setState({ passwordConfirmError: errorMessage });
      return false;
    }

    this.setState({ passwordConfirmError: '' });
    return true;
  }

  // 닉네임 유효성 검사
  checkNicknameValidity() {
    const errorMessage = validateNickname(this.state.nickname);

    if (errorMessage) {
      this.setState({ nicknameError: errorMessage });
      return false;
    }

    this.setState({ nicknameError: '' });
    return true;
  }

  // 폼 유효성 검사
  isFormValid() {
    const hasEmail = this.state.email.trim() !== '';
    const hasPassword = this.state.password.trim() !== '';
    const hasPasswordConfirm = this.state.passwordConfirm.trim() !== '';
    const hasNickname = this.state.nickname.trim() !== '';
    const noErrors = !this.state.emailError && !this.state.passwordError &&
                     !this.state.passwordConfirmError && !this.state.nicknameError;

    return hasEmail && hasPassword && hasPasswordConfirm && hasNickname && noErrors;
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

  async handleSubmit() {
    if (!this.isFormValid()) {
      return;
    }

    // 최종 유효성 검사
    const isEmailValid = this.checkEmailValidity();
    const isPasswordValid = this.checkPasswordValidity();
    const isPasswordConfirmValid = this.checkPasswordConfirmValidity();
    const isNicknameValid = this.checkNicknameValidity();

    if (!isEmailValid || !isPasswordValid || !isPasswordConfirmValid || !isNicknameValid) {
      return;
    }

    try {
      // TODO: 프로필 이미지 업로드 처리 (추후 구현)
      // 현재는 이미지 URL을 null로 전달
      const profileImageUrl = null;

      // DTO 생성
      const signupData = new SignupRequest({
        email: this.state.email,
        password: this.state.password,
        nickname: this.state.nickname,
        profileImage: profileImageUrl
      });

      // API 호출
      const response = await signup(signupData);

      // 회원가입 성공 - 자동 로그인 처리
      AuthService.login(response.userId);

      alert('회원가입이 완료되었습니다!');

      // 게시글 목록으로 이동
      navigateReplace('/posts');
    } catch (error) {
      console.error('회원가입 실패:', error);

      // 에러 응답에 따라 적절한 에러 메시지 표시
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert('회원가입에 실패했습니다. 입력 정보를 확인해주세요.');
      }
    }
  }
}

export default SignupPage;
