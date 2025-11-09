import Component from '../../core/Component.js';

class PasswordChangePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: '',
      passwordConfirm: '',
      passwordError: '',
      passwordConfirmError: '',
      isLoading: false,
      showToast: false
    };
    this.loadStyle('/src/pages/PasswordChangePage/style.css');
  }

  render() {
    return `
      <div class="main-container">
        <div class="password-wrapper">
          <h2 class="password-title">비밀번호수정</h2>

          <form class="password-form" id="passwordForm">
            <!-- 비밀번호 입력 -->
            <div class="form-group">
              <label for="passwordInput" class="form-label">비밀번호</label>
              <input
                type="password"
                id="passwordInput"
                class="form-input ${this.state.passwordError ? 'error' : ''}"
                placeholder="비밀번호를 입력해주세요"
                value="${this.state.password}"
              >
              <p class="helper-text ${this.state.passwordError ? 'show' : ''}" id="passwordHelper">
                *비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.
              </p>
            </div>

            <!-- 비밀번호 확인 -->
            <div class="form-group">
              <label for="passwordConfirmInput" class="form-label">비밀번호 확인</label>
              <input
                type="password"
                id="passwordConfirmInput"
                class="form-input ${this.state.passwordConfirmError ? 'error' : ''}"
                placeholder="비밀번호를 한번 더 입력해주세요"
                value="${this.state.passwordConfirm}"
              >
              <p class="helper-text ${this.state.passwordConfirmError ? 'show' : ''}" id="passwordConfirmHelper">
                *비밀번호와 다릅니다.
              </p>
            </div>

            <!-- 제출 버튼 -->
            <button
              type="submit"
              class="submit-btn ${this.state.isLoading ? 'loading' : ''}"
              id="submitBtn"
              disabled
            >
              ${this.state.isLoading ? '<div class="button-spinner"></div>' : ''}
              <span class="button-text">수정하기</span>
            </button>
          </form>
        </div>

        <!-- 토스트 메시지 -->
        <div class="toast-message" id="toastMessage" style="display: ${this.state.showToast ? 'block' : 'none'}">
          수정 완료
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

    this.setupEventListeners();

    // 초기 버튼 상태 체크
    const submitBtn = this.$el.querySelector('#submitBtn');
    this.updateSubmitButton(submitBtn);
  }

  // 업데이트 시마다 호출
  updated() {
    // DOM이 교체되므로 이벤트 리스너 재등록
    this.setupEventListeners();

    // 버튼 상태 재체크
    const submitBtn = this.$el.querySelector('#submitBtn');
    this.updateSubmitButton(submitBtn);
  }

  setupEventListeners() {
    const passwordInput = this.$el.querySelector('#passwordInput');
    const passwordConfirmInput = this.$el.querySelector('#passwordConfirmInput');
    const form = this.$el.querySelector('#passwordForm');
    const submitBtn = this.$el.querySelector('#submitBtn');

    // 비밀번호 입력 - setState 없이 직접 업데이트
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
        this.validatePassword();
      });
    }

    // 비밀번호 확인 입력 - setState 없이 직접 업데이트
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
        this.validatePasswordConfirm();
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
    // 뒤로가기 버튼 숨김
    if (window.headerComponent) {
      window.headerComponent.showBackButton(false);
    }
  }

  // 비밀번호 유효성 검사
  validatePassword() {
    const password = this.state.password;

    if (!password) {
      this.setState({ passwordError: '*비밀번호를 입력해주세요.' });
      return false;
    }

    // 비밀번호 정규식: 8-20자, 대문자, 소문자, 숫자, 특수문자 각 1개 이상
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,20}$/;

    if (!passwordRegex.test(password)) {
      this.setState({
        passwordError: '*비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.'
      });
      return false;
    }

    this.setState({ passwordError: '' });
    return true;
  }

  // 비밀번호 확인 유효성 검사
  validatePasswordConfirm() {
    const passwordConfirm = this.state.passwordConfirm;

    if (!passwordConfirm) {
      this.setState({ passwordConfirmError: '*비밀번호 확인을 입력해주세요.' });
      return false;
    }

    if (passwordConfirm !== this.state.password) {
      this.setState({ passwordConfirmError: '*비밀번호와 다릅니다.' });
      return false;
    }

    this.setState({ passwordConfirmError: '' });
    return true;
  }

  // 폼 유효성 검사
  isFormValid() {
    if (this.state.isLoading) {
      return false;
    }

    const hasPassword = this.state.password.trim() !== '';
    const hasPasswordConfirm = this.state.passwordConfirm.trim() !== '';
    const noErrors = !this.state.passwordError && !this.state.passwordConfirmError;

    return hasPassword && hasPasswordConfirm && noErrors;
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
    const isPasswordValid = this.validatePassword();
    const isPasswordConfirmValid = this.validatePasswordConfirm();

    if (!isPasswordValid || !isPasswordConfirmValid) {
      return;
    }

    // 로딩 상태 시작
    this.setState({ isLoading: true });

    try {
      console.log('비밀번호 변경:', {
        password: this.state.password
      });

      // TODO: API 호출
      // await apiPut('/api/v1/users/password', {
      //   password: this.state.password
      // });

      // 임시: 1초 대기
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 성공 시 토스트 메시지 표시
      this.setState({
        isLoading: false,
        password: '',
        passwordConfirm: '',
        passwordError: '',
        passwordConfirmError: ''
      });

      this.showToast();

      // 선택: 로그인 페이지로 이동
      // setTimeout(() => {
      //   window.router.navigate('/login');
      // }, 1500);
    } catch (error) {
      console.error('비밀번호 변경 실패:', error);
      this.setState({ isLoading: false });
      alert('비밀번호 변경에 실패했습니다.');
    }
  }

  // 토스트 메시지 표시
  showToast() {
    this.setState({ showToast: true });

    // 3초 후 자동 숨김
    setTimeout(() => {
      this.setState({ showToast: false });
    }, 3000);
  }
}

export default PasswordChangePage;
