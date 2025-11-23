import Component from '../../core/Component.js';
import { signup } from '../../api/auth.js';
import SignupRequest from '../../dto/request/auth/SignupRequest.js';
import AuthService from '../../utils/AuthService.js';
import { navigateReplace } from '../../core/Router.js';
import ProfileImageUploader from '../../components/ProfileImageUploader/index.js';
import { uploadProfileImage } from '../../utils/imageUpload.js';
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
      selectedImageFile: null, // 선택된 File 객체 (제출 시 업로드)
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
    this.profileImageUploader = null; // ProfileImageUploader 인스턴스
    this._eventsBound = false;
  }

  render() {
    return `
      <div class="main-container">
        <div class="signup-wrapper">
          <h2 class="signup-title">회원가입</h2>

          <form class="signup-form" id="signupForm">
            <!-- 프로필 이미지 업로드 -->
            <div class="form-group">
              ${this.renderProfileImageUploader()}
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

  renderProfileImageUploader() {
    if (!this.profileImageUploader) {
      this.profileImageUploader = new ProfileImageUploader({
        imageUrl: '',
        onFileSelected: (file) => {
          // File 객체만 저장 (업로드는 제출 시)
          this.state.selectedImageFile = file;
          console.log('[SignupPage] 프로필 이미지 선택됨:', file.name);
        }
      });
    }
    return this.profileImageUploader.render();
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
    // 버튼 상태 재체크
    const submitBtn = this.$el.querySelector('#submitBtn');
    this.updateSubmitButton(submitBtn);
  }

  setupEventListeners() {
    if (!this._eventsBound) {
      this._eventsBound = true;

      this.delegate('input', '#emailInput', (e) => {
        this.state.email = e.target.value;
        this.state.emailError = '';
        const helperText = this.$el.querySelector('#emailHelper');
        if (helperText) {
          helperText.classList.remove('show');
        }
        e.target.classList.remove('error');
        const submitBtn = this.$el.querySelector('#submitBtn');
        this.updateSubmitButton(submitBtn);
      });

      this.delegate('blur', '#emailInput', () => {
        this.checkEmailValidity();
      });

      this.delegate('input', '#passwordInput', (e) => {
        this.state.password = e.target.value;
        this.state.passwordError = '';
        const helperText = this.$el.querySelector('#passwordHelper');
        if (helperText) {
          helperText.classList.remove('show');
        }
        e.target.classList.remove('error');
        const submitBtn = this.$el.querySelector('#submitBtn');
        this.updateSubmitButton(submitBtn);
      });

      this.delegate('blur', '#passwordInput', () => {
        this.checkPasswordValidity();
      });

      this.delegate('input', '#passwordConfirmInput', (e) => {
        this.state.passwordConfirm = e.target.value;
        this.state.passwordConfirmError = '';
        const helperText = this.$el.querySelector('#passwordConfirmHelper');
        if (helperText) {
          helperText.classList.remove('show');
        }
        e.target.classList.remove('error');
        const submitBtn = this.$el.querySelector('#submitBtn');
        this.updateSubmitButton(submitBtn);
      });

      this.delegate('blur', '#passwordConfirmInput', () => {
        this.checkPasswordConfirmValidity();
      });

      this.delegate('input', '#nicknameInput', (e) => {
        this.state.nickname = e.target.value;
        this.state.nicknameError = '';
        const helperText = this.$el.querySelector('#nicknameHelper');
        if (helperText) {
          helperText.classList.remove('show');
        }
        e.target.classList.remove('error');
        const submitBtn = this.$el.querySelector('#submitBtn');
        this.updateSubmitButton(submitBtn);
      });

      this.delegate('blur', '#nicknameInput', () => {
        this.checkNicknameValidity();
      });

      this.delegate('submit', '#signupForm', (e) => {
        e.preventDefault();
        this.handleSubmit();
      });
    }

    // ProfileImageUploader의 DOM 요소 연결 및 이벤트 리스너 등록
    if (this.profileImageUploader) {
      const uploaderEl = this.$el.querySelector('.profile-image-uploader');
      if (uploaderEl) {
        this.profileImageUploader.$el = uploaderEl;
        this.profileImageUploader.setupEventListeners();
      }
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
      let profileImageUrl = null;

      // 프로필 이미지가 선택되었다면 업로드
      if (this.state.selectedImageFile) {
        console.log('[SignupPage] 프로필 이미지 업로드 시작...');

        try {
          // Cloudinary에 업로드
          profileImageUrl = await uploadProfileImage(this.state.selectedImageFile);
          console.log('[SignupPage] 프로필 이미지 업로드 완료:', profileImageUrl);
        } catch (uploadError) {
          console.error('[SignupPage] 프로필 이미지 업로드 실패:', uploadError);
          alert('프로필 이미지 업로드에 실패했습니다. 이미지 없이 진행하시겠습니까?');
          // 이미지 업로드 실패 시에도 회원가입은 진행 가능
        }
      }

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
