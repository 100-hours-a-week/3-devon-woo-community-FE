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
import { withHeader, refreshAuthState } from '../../services/HeaderService.js';

const DEFAULT_PRIMARY_STACK = ['Java', 'Spring Boot', 'JPA', 'MySQL', 'AWS'];
const DEFAULT_INTERESTS = ['서버 아키텍처', '대규모 트래픽 처리', 'Event-driven Design', 'DevOps 자동화'];

class SignupPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 1,
      isSubmitting: false,
      selectedImageFile: null,
      email: '',
      password: '',
      passwordConfirm: '',
      nickname: '',
      emailError: '',
      passwordError: '',
      passwordConfirmError: '',
      nicknameError: '',
      handle: '',
      role: '',
      company: '',
      location: '',
      bio: '',
      bioCharCount: 0,
      primaryStackText: '',
      interestsText: '',
      socialLinks: {
        github: '',
        website: '',
        linkedin: '',
        notion: ''
      }
    };
    this.loadStyle('/src/pages/SignupPage/style.css');
    this.profileImageUploader = null;
    this._eventsBound = false;
  }

  render() {
    return `
      <div class="signup-page">
        <div class="main-container">
          <div class="signup-panel">
            ${this.renderStepHeader()}
            <div class="step-card">
              ${this.state.step === 1 ? this.renderAccountForm() : this.renderProfileForm()}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderStepHeader() {
    const steps = [
      { label: '계정 정보', description: '로그인에 필요한 기본 정보' },
      { label: '프로필 설정', description: '개발자 프로필 정보' }
    ];

    return `
      <div class="signup-steps">
        ${steps.map((step, index) => {
          const stepNumber = index + 1;
          const status = stepNumber === this.state.step
            ? 'active'
            : stepNumber < this.state.step
              ? 'completed'
              : '';
          return `
            <div class="signup-step ${status}">
              <div class="step-indicator">${stepNumber}</div>
              <div class="step-info">
                <p class="step-label">${step.label}</p>
                <p class="step-desc">${step.description}</p>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  renderAccountForm() {
    return `
      <form class="step-form" id="accountForm">
        <h2 class="step-title">계정 정보</h2>
        <p class="step-subtitle">Tech Blog 사용을 위한 필수 정보를 입력해주세요.</p>
        <div class="form-grid two-columns">
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
        </div>
        <div class="step-actions">
          <button type="submit" class="btn-primary" id="accountNextBtn" disabled>
            다음 단계로
          </button>
        </div>
      </form>
    `;
  }

  renderProfileForm() {
    return `
      <form class="step-form" id="profileForm">
        <div class="profile-step-header">
          <div>
            <h2 class="step-title">프로필 설정</h2>
            <p class="step-subtitle">
              프로필 정보는 나중에 프로필 페이지에서 다시 수정할 수 있습니다.
            </p>
          </div>
          <div class="step-actions">
            <button type="button" class="btn-tertiary" id="backToAccountBtn">이전</button>
            <button type="button" class="btn-secondary" id="skipProfileBtn" ${this.state.isSubmitting ? 'disabled' : ''}>나중에 할래요</button>
          </div>
        </div>

        <div class="profile-image-section">
          ${this.renderProfileImageUploader()}
        </div>

        <div class="form-grid two-columns">
          <div class="form-group">
            <label for="handleInput" class="form-label">한 줄 소개</label>
            <input
              type="text"
              id="handleInput"
              class="form-input"
              maxlength="80"
              placeholder="예: Backend Developer / Java Enthusiast"
              value="${this.state.handle}"
            />
          </div>
          <div class="form-group">
            <label for="roleInput" class="form-label">직무/포지션</label>
            <input
              type="text"
              id="roleInput"
              class="form-input"
              placeholder="예: Backend Engineer"
              value="${this.state.role}"
            />
          </div>
          <div class="form-group">
            <label for="companyInput" class="form-label">회사/소속</label>
            <input
              type="text"
              id="companyInput"
              class="form-input"
              placeholder="예: Codestate Labs"
              value="${this.state.company}"
            />
          </div>
          <div class="form-group">
            <label for="locationInput" class="form-label">위치</label>
            <input
              type="text"
              id="locationInput"
              class="form-input"
              placeholder="예: Seoul, Korea"
              value="${this.state.location}"
            />
          </div>
        </div>

        <div class="form-group">
          <label for="bioInput" class="form-label">간단 소개</label>
          <textarea
            id="bioInput"
            class="form-textarea"
            rows="4"
            maxlength="300"
            placeholder="MSA 기반 백엔드 아키텍처 구축과 대규모 트래픽 대응 경험이 있는 Java/Spring 개발자입니다."
          >${this.state.bio || ''}</textarea>
          <div class="char-count">
            <span id="bioCharCount">${this.state.bioCharCount}</span> / 300
          </div>
        </div>

        <div class="form-grid two-columns">
          <div class="form-group">
            <label for="primaryStackInput" class="form-label">주요 기술 스택</label>
            <input
              type="text"
              id="primaryStackInput"
              class="form-input"
              placeholder="Java, Spring Boot, JPA, MySQL, AWS"
              value="${this.state.primaryStackText}"
            />
            <p class="helper-text small">쉼표로 구분해 입력해주세요.</p>
          </div>
          <div class="form-group">
            <label for="interestsInput" class="form-label">관심 분야</label>
            <input
              type="text"
              id="interestsInput"
              class="form-input"
              placeholder="서버 아키텍처, CQRS, Observability"
              value="${this.state.interestsText}"
            />
            <p class="helper-text small">쉼표로 구분해 입력해주세요.</p>
          </div>
        </div>

        <div class="form-grid two-columns">
          ${this.renderSocialInput('github', 'GitHub', 'https://github.com/username', this.state.socialLinks.github)}
          ${this.renderSocialInput('website', 'Website', 'https://your-website.com', this.state.socialLinks.website)}
          ${this.renderSocialInput('linkedin', 'LinkedIn', 'https://linkedin.com/in/username', this.state.socialLinks.linkedin)}
          ${this.renderSocialInput('notion', 'Notion / Portfolio', 'https://notion.so/portfolio', this.state.socialLinks.notion)}
        </div>

        <div class="step-actions">
          <button type="button" class="btn-tertiary" id="backToAccountBtnBottom">이전</button>
          <button type="submit" class="btn-primary" id="profileSubmitBtn" ${this.state.isSubmitting ? 'disabled' : ''}>
            ${this.state.isSubmitting ? '가입 중...' : '완료'}
          </button>
        </div>
      </form>
    `;
  }

  renderSocialInput(key, label, placeholder, value) {
    const errorKey = `${key}Error`;
    const errorMessage = this.state[errorKey] || '';
    return `
      <div class="form-group">
        <label for="${key}Input" class="form-label">${label}</label>
        <input
          type="url"
          id="${key}Input"
          class="form-input ${errorMessage ? 'error' : ''}"
          placeholder="${placeholder}"
          value="${value || ''}"
        />
        <p class="helper-text ${errorMessage ? 'show error' : 'small'}" id="${key}Helper">
          ${errorMessage || `${label} 링크를 입력해주세요.`}
        </p>
      </div>
    `;
  }

  renderProfileImageUploader() {
    if (!this.profileImageUploader) {
      this.profileImageUploader = new ProfileImageUploader({
        imageUrl: '',
        onFileSelected: (file) => {
          this.state.selectedImageFile = file;
        }
      });
    }
    return this.profileImageUploader.render();
  }

  mounted() {
    withHeader((header) => {
      header.show();
      header.setVariant('minimal');
      header.showBackButton(false);
      header.showProfileIcon(false);
    });
    this.setupEventListeners();
    this.updateNextButton();
    this.attachProfileUploader();
  }

  updated() {
    this.setupEventListeners();
    if (this.state.step === 1) {
      this.updateNextButton();
    }
    this.attachProfileUploader();
  }

  attachProfileUploader() {
    if (this.profileImageUploader && this.state.step === 2) {
      const uploaderEl = this.$el.querySelector('.profile-image-uploader');
      if (uploaderEl) {
        this.profileImageUploader.$el = uploaderEl;
        this.profileImageUploader.setupEventListeners();
      }
    }
  }

  beforeUnmount() {
    withHeader((header) => {
      header.setVariant('full');
      header.showBackButton(false);
      header.showProfileIcon(false);
    });
  }

  setupEventListeners() {
    if (!this._eventsBound) {
      this._eventsBound = true;

      this.delegate('submit', '#accountForm', (e) => {
        e.preventDefault();
        this.handleAccountSubmit();
      });

      this.delegate('submit', '#profileForm', (e) => {
        e.preventDefault();
        this.handleProfileSubmit();
      });

      this.delegate('click', '#skipProfileBtn', (e) => {
        e.preventDefault();
        this.completeSignup({ skipProfile: true });
      });

      this.delegate('click', '#backToAccountBtn, #backToAccountBtnBottom', (e) => {
        e.preventDefault();
        this.setState({ step: 1 });
      });

      this.delegate('input', '#emailInput', (e) => {
        this.state.email = e.target.value;
        this.state.emailError = '';
        const helperText = this.$el.querySelector('#emailHelper');
        helperText?.classList.remove('show');
        e.target.classList.remove('error');
        this.updateNextButton();
      });

      this.delegate('blur', '#emailInput', () => {
        this.checkEmailValidity();
      });

      this.delegate('input', '#passwordInput', (e) => {
        this.state.password = e.target.value;
        this.state.passwordError = '';
        const helperText = this.$el.querySelector('#passwordHelper');
        helperText?.classList.remove('show');
        this.updateNextButton();
      });

      this.delegate('blur', '#passwordInput', () => {
        this.checkPasswordValidity();
      });

      this.delegate('input', '#passwordConfirmInput', (e) => {
        this.state.passwordConfirm = e.target.value;
        this.state.passwordConfirmError = '';
        const helperText = this.$el.querySelector('#passwordConfirmHelper');
        helperText?.classList.remove('show');
        this.updateNextButton();
      });

      this.delegate('blur', '#passwordConfirmInput', () => {
        this.checkPasswordConfirmValidity();
      });

      this.delegate('input', '#nicknameInput', (e) => {
        this.state.nickname = e.target.value;
        this.state.nicknameError = '';
        const helperText = this.$el.querySelector('#nicknameHelper');
        helperText?.classList.remove('show');
        this.updateNextButton();
      });

      this.delegate('blur', '#nicknameInput', () => {
        this.checkNicknameValidity();
      });

      // Profile step inputs
      this.delegate('input', '#handleInput', (e) => {
        this.setState({ handle: e.target.value });
      });
      this.delegate('input', '#roleInput', (e) => {
        this.setState({ role: e.target.value });
      });
      this.delegate('input', '#companyInput', (e) => {
        this.setState({ company: e.target.value });
      });
      this.delegate('input', '#locationInput', (e) => {
        this.setState({ location: e.target.value });
      });
      this.delegate('input', '#bioInput', (e) => {
        this.setState({ bio: e.target.value, bioCharCount: e.target.value.length });
      });
      this.delegate('input', '#primaryStackInput', (e) => {
        this.setState({ primaryStackText: e.target.value });
      });
      this.delegate('input', '#interestsInput', (e) => {
        this.setState({ interestsText: e.target.value });
      });

      ['github', 'website', 'linkedin', 'notion'].forEach((key) => {
        this.delegate('input', `#${key}Input`, (e) => {
          this.handleSocialInput(key, e.target.value);
        });
      });
    }
  }

  checkEmailValidity() {
    const errorMessage = validateEmail(this.state.email);
    if (errorMessage) {
      this.setState({ emailError: errorMessage });
      return false;
    }
    this.setState({ emailError: '' });
    return true;
  }

  checkPasswordValidity() {
    const errorMessage = validatePassword(this.state.password);
    if (errorMessage) {
      this.setState({ passwordError: errorMessage });
      return false;
    }
    this.setState({ passwordError: '' });
    return true;
  }

  checkPasswordConfirmValidity() {
    const errorMessage = validatePasswordConfirm(this.state.password, this.state.passwordConfirm);
    if (errorMessage) {
      this.setState({ passwordConfirmError: errorMessage });
      return false;
    }
    this.setState({ passwordConfirmError: '' });
    return true;
  }

  checkNicknameValidity() {
    const errorMessage = validateNickname(this.state.nickname);
    if (errorMessage) {
      this.setState({ nicknameError: errorMessage });
      return false;
    }
    this.setState({ nicknameError: '' });
    return true;
  }

  validateAccountStep() {
    const results = [
      this.checkEmailValidity(),
      this.checkPasswordValidity(),
      this.checkPasswordConfirmValidity(),
      this.checkNicknameValidity()
    ];
    return results.every(Boolean);
  }

  isAccountFormReady() {
    const hasValues =
      this.state.email.trim() &&
      this.state.password.trim() &&
      this.state.passwordConfirm.trim() &&
      this.state.nickname.trim();

    const noErrors =
      !this.state.emailError &&
      !this.state.passwordError &&
      !this.state.passwordConfirmError &&
      !this.state.nicknameError;

    return Boolean(hasValues && noErrors);
  }

  updateNextButton() {
    const button = this.$el?.querySelector('#accountNextBtn');
    if (!button) return;
    button.disabled = !this.isAccountFormReady();
  }

  handleAccountSubmit() {
    if (!this.validateAccountStep()) {
      return;
    }
    this.setState({ step: 2 });
  }

  handleProfileSubmit() {
    this.completeSignup({ skipProfile: false });
  }

  async completeSignup({ skipProfile }) {
    if (this.state.isSubmitting) return;
    if (!this.validateAccountStep()) {
      this.setState({ step: 1 });
      return;
    }

    this.setState({ isSubmitting: true });

    try {
      let profileImageUrl = null;

      if (!skipProfile && this.state.selectedImageFile) {
        try {
          profileImageUrl = await uploadProfileImage(this.state.selectedImageFile);
        } catch (uploadError) {
          console.error('[SignupPage] 프로필 이미지 업로드 실패:', uploadError);
          const proceed = window.confirm('프로필 이미지 업로드에 실패했습니다. 이미지 없이 계속하시겠습니까?');
          if (!proceed) {
            this.setState({ isSubmitting: false });
            return;
          }
        }
      }

      const profilePayload = skipProfile ? {} : {
        handle: this.state.handle.trim(),
        bio: this.state.bio.trim(),
        role: this.state.role.trim(),
        company: this.state.company.trim(),
        location: this.state.location.trim(),
        primaryStack: this.parseList(this.state.primaryStackText, DEFAULT_PRIMARY_STACK),
        interests: this.parseList(this.state.interestsText, DEFAULT_INTERESTS),
        socialLinks: {
          github: this.state.socialLinks.github.trim(),
          website: this.state.socialLinks.website.trim(),
          linkedin: this.state.socialLinks.linkedin.trim(),
          notion: this.state.socialLinks.notion.trim()
        }
      };

      const signupData = new SignupRequest({
        email: this.state.email.trim(),
        password: this.state.password.trim(),
        nickname: this.state.nickname.trim(),
        profileImage: profileImageUrl,
        ...profilePayload
      });

      const response = await signup(signupData);

      AuthService.login(response.accessToken, response.refreshToken, response.member);
      refreshAuthState();
      alert('회원가입이 완료되었습니다!');
      navigateReplace('/');
    } catch (error) {
      console.error('회원가입 실패:', error);
      const message = error.response?.data?.message || '회원가입에 실패했습니다. 입력 정보를 확인해주세요.';
      alert(message);
    } finally {
      this.setState({ isSubmitting: false });
    }
  }

  parseList(text, fallback = []) {
    const parsed = text
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
    return parsed.length ? parsed : fallback;
  }

  handleSocialInput(key, value) {
    const socialLinks = {
      ...this.state.socialLinks,
      [key]: value
    };
    this.setState({ socialLinks });
  }
}

export default SignupPage;
