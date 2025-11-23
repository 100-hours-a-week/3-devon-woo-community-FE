import Component from '../../core/Component.js';
import { withHeader } from '../../services/HeaderService.js';
import { navigate } from '../../core/Router.js';
import AuthService from '../../utils/AuthService.js';
import { getMemberProfile, updateMemberProfile } from '../../api/members.js';
import MemberUpdateRequest from '../../dto/request/member/MemberUpdateRequest.js';
import { uploadProfileImage } from '../../utils/imageUpload.js';
import { getProfileExtras, saveProfileExtras } from '../../utils/profileExtrasStorage.js';

const DEFAULT_PROFILE_IMAGE = 'https://via.placeholder.com/160?text=Profile';
const DEFAULT_PRIMARY_STACK = ['Java', 'Spring Boot', 'JPA', 'MySQL', 'AWS'];
const DEFAULT_INTERESTS = ['서버 아키텍처', '대규모 트래픽 처리', 'Event-driven Design', 'DevOps 자동화'];
const DEFAULT_SOCIAL_LINKS = {
  github: 'https://github.com/codestate-dev',
  website: 'https://blog.codestate.dev',
  linkedin: 'https://www.linkedin.com/in/codestate',
  notion: 'https://codestate.notion.site/portfolio'
};

class ProfileEditPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isSaving: false,
      name: '',
      handle: '',
      bio: '',
      role: '',
      company: '',
      location: '',
      primaryStackText: '',
      interestsText: '',
      socialLinks: {
        github: '',
        website: '',
        linkedin: '',
        notion: ''
      },
      profileImageUrl: '',
      selectedImageFile: null,
      errors: {
        name: '',
        github: '',
        website: '',
        linkedin: '',
        notion: ''
      },
      bioCharCount: 0,
      toast: {
        show: false,
        message: '',
        type: 'success'
      }
    };

    this._eventsBound = false;
    this.toastTimeout = null;
    this.initialSnapshot = null;
    this.beforeUnloadHandler = this.handleBeforeUnload.bind(this);
    this.initialProfileImage = '';
    this.loadStyle('/src/pages/ProfileEditPage/style.css');
  }

  render() {
    if (this.state.isLoading) {
      return `
        <div class="profile-edit-page loading-state">
          <div class="loading-spinner"></div>
        </div>
      `;
    }

    const { errors, socialLinks, toast } = this.state;

    return `
      <div class="profile-edit-page">
        <div class="main-container">
          ${this.renderProfilePreview()}
          ${this.renderEditForm(errors, socialLinks)}
        </div>

        <div class="toast ${toast.show ? `show ${toast.type}` : ''}" id="toast">
          <span class="toast-message">${this.escapeHTML(toast.message)}</span>
        </div>

        <div class="loading-overlay ${this.state.isSaving ? 'show' : ''}" id="loadingOverlay">
          <div class="loading-spinner"></div>
          <p>저장하는 중...</p>
        </div>
      </div>
    `;
  }

  renderProfilePreview() {
    const primaryStack = this.state.primaryStackText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const interests = this.state.interestsText
      .split(',')
      .map((i) => i.trim())
      .filter(Boolean);
    const socialLinks = this.state.socialLinks || {};

    return `
      <aside class="profile-preview">
        <div class="profile-cover"></div>
        <div class="profile-card__body">
          <div class="profile-card__main">
            <div class="profile-avatar">
              <img src="${this.escapeHTML(this.state.profileImageUrl || DEFAULT_PROFILE_IMAGE)}" alt="${this.escapeHTML(this.state.name || '프로필')}" id="profileImagePreview" />
            </div>
            <div class="profile-summary">
              <div class="profile-summary__row">
                <div>
                  <h1 class="profile-name">${this.escapeHTML(this.state.name || '사용자')}</h1>
                  ${this.state.handle ? `<p class="profile-handle">${this.escapeHTML(this.state.handle)}</p>` : ''}
                </div>
              </div>
              <ul class="profile-details">
                ${this.state.role ? `<li>${this.escapeHTML(this.state.role)}</li>` : ''}
                ${this.state.company ? `<li>${this.escapeHTML(this.state.company)}</li>` : ''}
                ${this.state.location ? `<li>${this.escapeHTML(this.state.location)}</li>` : ''}
              </ul>
              ${socialLinks.website ? `
                <a href="${this.escapeHTML(socialLinks.website)}" class="profile-website" target="_blank" rel="noopener noreferrer">
                  ${this.escapeHTML(socialLinks.website)}
                </a>
              ` : ''}
            </div>
          </div>

          ${this.state.bio ? `<p class="profile-bio">${this.escapeHTML(this.state.bio)}</p>` : ''}
        </div>

        ${primaryStack.length ? `
          <div class="profile-section">
            <h3>주요 기술 스택</h3>
            <div class="skills-list">
              ${primaryStack.map((skill) => `<span class="skill-chip">${this.escapeHTML(skill)}</span>`).join('')}
            </div>
          </div>
        ` : ''}

        ${interests.length ? `
          <div class="profile-section">
            <h3>관심 분야</h3>
            <ul class="interest-list">
              ${interests.map((interest) => `<li>${this.escapeHTML(interest)}</li>`).join('')}
            </ul>
          </div>
        ` : ''}

        ${this.renderSocialLinks(socialLinks)}
      </aside>
    `;
  }

  renderSocialLinks(links = {}) {
    const labelMap = {
      github: 'GitHub',
      website: 'Website',
      linkedin: 'LinkedIn',
      notion: 'Notion'
    };
    const items = Object.entries(links)
      .filter(([key, value]) => value && labelMap[key])
      .map(([key, value]) => `
        <a href="${this.escapeHTML(value)}" target="_blank" rel="noopener noreferrer">
          ${labelMap[key]}
        </a>
      `);

    if (!items.length) return '';

    return `
      <div class="profile-section">
        <h3>링크</h3>
        <div class="social-links">
          ${items.join('')}
        </div>
      </div>
    `;
  }

  renderEditForm(errors, socialLinks) {
    return `
      <section class="edit-section">
        <div class="edit-header">
          <h2 class="edit-title">프로필 편집</h2>
          <p class="edit-subtitle">프로필 정보를 수정하고 저장하세요</p>
        </div>

        <form class="edit-form" id="profileForm">
          <section class="form-section">
            <div class="form-group">
              <label class="form-label">프로필 이미지</label>
              <button type="button" class="btn-change-photo" id="changePhotoBtn">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M14.5 12v2.5H1.5V12M11 4.5L8 1.5 5 4.5M8 1.5v9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                </svg>
                사진 변경
              </button>
              <input type="file" id="profileImageInput" accept="image/jpeg,image/jpg,image/png,image/gif" style="display:none;" />
              <p class="form-hint">JPG, PNG, GIF (최대 5MB)</p>
            </div>
          </section>

          <section class="form-section">
            <div class="form-group">
              <label for="nameInput" class="form-label">
                이름 <span class="label-required">*</span>
              </label>
              <input
                type="text"
                id="nameInput"
                class="form-input ${errors.name ? 'error' : ''}"
                maxlength="50"
                placeholder="이름을 입력하세요"
                value="${this.escapeHTML(this.state.name)}"
              />
              <p class="form-error" id="nameError">${errors.name || ''}</p>
            </div>

            <div class="form-group">
              <label for="handleInput" class="form-label">
                한 줄 소개 <span class="label-optional">선택</span>
              </label>
              <input
                type="text"
                id="handleInput"
                class="form-input"
                maxlength="100"
                placeholder="Backend Developer / Java Enthusiast"
                value="${this.escapeHTML(this.state.handle)}"
              />
            </div>

            <div class="form-group">
              <label for="bioInput" class="form-label">
                자기소개 <span class="label-optional">선택</span>
              </label>
              <textarea
                id="bioInput"
                class="form-textarea"
                rows="4"
                maxlength="300"
                placeholder="자신을 소개해주세요"
              >${this.escapeHTML(this.state.bio)}</textarea>
              <div class="char-count">
                <span id="bioCharCount">${this.state.bioCharCount}</span> / 300
              </div>
            </div>
          </section>

          <section class="form-section">
            <h3 class="section-title">직무 정보</h3>

            <div class="form-group">
              <label for="roleInput" class="form-label">직무/포지션</label>
              <input
                type="text"
                id="roleInput"
                class="form-input"
                placeholder="Backend Engineer"
                value="${this.escapeHTML(this.state.role)}"
              />
            </div>

            <div class="form-group">
              <label for="companyInput" class="form-label">회사/소속</label>
              <input
                type="text"
                id="companyInput"
                class="form-input"
                placeholder="Codestate Labs"
                value="${this.escapeHTML(this.state.company)}"
              />
            </div>

            <div class="form-group">
              <label for="locationInput" class="form-label">위치</label>
              <input
                type="text"
                id="locationInput"
                class="form-input"
                placeholder="Seoul, Korea"
                value="${this.escapeHTML(this.state.location)}"
              />
            </div>
          </section>

          <section class="form-section">
            <h3 class="section-title">기술 & 관심사</h3>

            <div class="form-group">
              <label for="primaryStackInput" class="form-label">주요 기술 스택</label>
              <input
                type="text"
                id="primaryStackInput"
                class="form-input"
                placeholder="Java, Spring Boot, JPA, MySQL, AWS"
                value="${this.escapeHTML(this.state.primaryStackText)}"
              />
              <p class="form-hint">쉼표(,)로 구분하여 입력하세요</p>
            </div>

            <div class="form-group">
              <label for="interestsInput" class="form-label">관심 분야</label>
              <input
                type="text"
                id="interestsInput"
                class="form-input"
                placeholder="서버 아키텍처, 대규모 트래픽 처리, Event-driven Design"
                value="${this.escapeHTML(this.state.interestsText)}"
              />
              <p class="form-hint">쉼표(,)로 구분하여 입력하세요</p>
            </div>
          </section>

          <section class="form-section">
            <h3 class="section-title">소셜 링크</h3>

            <div class="form-group">
              <label for="githubInput" class="form-label">GitHub</label>
              <input
                type="url"
                id="githubInput"
                class="form-input ${errors.github ? 'error' : ''}"
                placeholder="https://github.com/username"
                value="${this.escapeHTML(socialLinks.github || '')}"
              />
              <p class="form-error" id="githubError">${errors.github || ''}</p>
            </div>

            <div class="form-group">
              <label for="websiteInput" class="form-label">Website</label>
              <input
                type="url"
                id="websiteInput"
                class="form-input ${errors.website ? 'error' : ''}"
                placeholder="https://blog.example.com"
                value="${this.escapeHTML(socialLinks.website || '')}"
              />
              <p class="form-error" id="websiteError">${errors.website || ''}</p>
            </div>

            <div class="form-group">
              <label for="linkedinInput" class="form-label">LinkedIn</label>
              <input
                type="url"
                id="linkedinInput"
                class="form-input ${errors.linkedin ? 'error' : ''}"
                placeholder="https://linkedin.com/in/username"
                value="${this.escapeHTML(socialLinks.linkedin || '')}"
              />
              <p class="form-error" id="linkedinError">${errors.linkedin || ''}</p>
            </div>

            <div class="form-group">
              <label for="notionInput" class="form-label">Notion/Portfolio</label>
              <input
                type="url"
                id="notionInput"
                class="form-input ${errors.notion ? 'error' : ''}"
                placeholder="https://notion.so/portfolio"
                value="${this.escapeHTML(socialLinks.notion || '')}"
              />
              <p class="form-error" id="notionError">${errors.notion || ''}</p>
            </div>
          </section>

          <div class="form-actions">
            <button type="button" class="btn-secondary" id="cancelBtn">취소</button>
            <button type="submit" class="btn-primary" id="saveBtn" ${this.state.isSaving ? 'disabled' : ''}>
              ${this.state.isSaving ? '저장 중...' : '변경사항 저장'}
            </button>
          </div>
        </form>
      </section>
    `;
  }

  async mounted() {
    withHeader((header) => {
      header.show();
      header.setVariant('minimal');
    });

    if (!AuthService.requireAuth()) {
      navigate('/login');
      return;
    }

    await this.loadProfileData();
    this.setupEventListeners();
    window.addEventListener('beforeunload', this.beforeUnloadHandler);
  }

  updated() {
    this.setupEventListeners();
  }

  beforeUnmount() {
    window.removeEventListener('beforeunload', this.beforeUnloadHandler);
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
      this.toastTimeout = null;
    }
    withHeader((header) => {
      header.setVariant('full');
      header.showBackButton(false);
      header.showProfileIcon(false);
    });
  }

  async loadProfileData() {
    try {
      const memberId = AuthService.getCurrentUserId();
      const [profile, extras] = await Promise.all([
        getMemberProfile(memberId),
        Promise.resolve(getProfileExtras(memberId))
      ]);

      const initialData = {
        name: profile?.nickname || '',
        handle: extras.handle || '',
        bio: extras.bio || '',
        role: extras.role || '',
        company: extras.company || '',
        location: extras.location || '',
        primaryStack: Array.isArray(extras.primaryStack)
          ? extras.primaryStack
          : Array.isArray(extras.skills)
            ? extras.skills
            : [],
        interests: Array.isArray(extras.interests) ? extras.interests : [],
        socialLinks: extras.socialLinks || { github: '', website: '', linkedin: '', notion: '' },
        profileImageUrl: profile?.profileImage || ''
      };

      const resolvedPrimaryStack = initialData.primaryStack.length
        ? initialData.primaryStack
        : DEFAULT_PRIMARY_STACK;
      const resolvedInterests = initialData.interests.length
        ? initialData.interests
        : DEFAULT_INTERESTS;
      const resolvedSocialLinks = {
        github: initialData.socialLinks.github || DEFAULT_SOCIAL_LINKS.github,
        website: initialData.socialLinks.website || DEFAULT_SOCIAL_LINKS.website,
        linkedin: initialData.socialLinks.linkedin || DEFAULT_SOCIAL_LINKS.linkedin,
        notion: initialData.socialLinks.notion || DEFAULT_SOCIAL_LINKS.notion
      };

      this.initialSnapshot = JSON.stringify({
        ...initialData,
        primaryStack: resolvedPrimaryStack,
        interests: resolvedInterests,
        socialLinks: resolvedSocialLinks
      });
      this.initialProfileImage = initialData.profileImageUrl || '';

      this.setState({
        ...initialData,
        primaryStackText: resolvedPrimaryStack.join(', '),
        interestsText: resolvedInterests.join(', '),
        socialLinks: resolvedSocialLinks,
        bioCharCount: (initialData.bio || '').length,
        isLoading: false
      });
    } catch (error) {
      console.error('Failed to load profile data:', error);
      this.setState({ isLoading: false });
      this.showToast('프로필을 불러오지 못했습니다.', 'error');
    }
  }

  setupEventListeners() {
    if (this._eventsBound) return;
    this._eventsBound = true;

    this.delegate('input', '#nameInput', (event) => {
      const value = event.target.value;
      const errors = { ...this.state.errors, name: value.trim() ? '' : '이름을 입력해주세요' };
      this.setState({ name: value, errors });
    });

    this.delegate('input', '#handleInput', (event) => {
      this.setState({ handle: event.target.value });
    });

    this.delegate('input', '#bioInput', (event) => {
      this.setState({ bio: event.target.value, bioCharCount: event.target.value.length });
    });

    this.delegate('input', '#roleInput', (event) => {
      this.setState({ role: event.target.value });
    });

    this.delegate('input', '#companyInput', (event) => {
      this.setState({ company: event.target.value });
    });

    this.delegate('input', '#locationInput', (event) => {
      this.setState({ location: event.target.value });
    });

    this.delegate('input', '#primaryStackInput', (event) => {
      this.setState({ primaryStackText: event.target.value });
    });

    this.delegate('input', '#interestsInput', (event) => {
      this.setState({ interestsText: event.target.value });
    });

    this.delegate('input', '#githubInput', (event) => {
      this.handleSocialInput('github', event.target.value);
    });
    this.delegate('input', '#websiteInput', (event) => {
      this.handleSocialInput('website', event.target.value);
    });
    this.delegate('input', '#linkedinInput', (event) => {
      this.handleSocialInput('linkedin', event.target.value);
    });
    this.delegate('input', '#notionInput', (event) => {
      this.handleSocialInput('notion', event.target.value);
    });

    this.delegate('click', '#changePhotoBtn', (event) => {
      event.preventDefault();
      const input = this.$el?.querySelector('#profileImageInput');
      input?.click();
    });

    this.delegate('change', '#profileImageInput', (event) => {
      const [file] = event.target.files || [];
      if (!file) return;
      if (!/^image\/(jpeg|jpg|png|gif)$/i.test(file.type)) {
        this.showToast('JPG, PNG, GIF 파일만 업로드 가능합니다.', 'error');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        this.showToast('이미지는 5MB 이하로 업로드해주세요.', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        this.setState({ selectedImageFile: file, profileImageUrl: reader.result });
      };
      reader.readAsDataURL(file);
    });

    this.delegate('submit', '#profileForm', (event) => {
      event.preventDefault();
      this.handleSubmit();
    });

    this.delegate('click', '#cancelBtn', (event) => {
      event.preventDefault();
      this.handleCancel();
    });

  }

  handleSocialInput(key, value) {
    const socialLinks = {
      ...this.state.socialLinks,
      [key]: value
    };
    const errors = { ...this.state.errors };
    errors[key] = this.validateURL(value) ? '' : '올바른 URL을 입력해주세요';

    this.setState({ socialLinks, errors });
  }

  async handleSubmit() {
    if (this.state.isSaving) return;
    if (!this.validateForm()) {
      this.showToast('입력 항목을 확인해주세요.', 'error');
      return;
    }

    this.setState({ isSaving: true });

    try {
      const memberId = AuthService.getCurrentUserId();
      let profileImage = this.initialProfileImage || this.state.profileImageUrl;

      if (this.state.selectedImageFile) {
        profileImage = await uploadProfileImage(this.state.selectedImageFile);
      } else if (this.state.profileImageUrl && this.state.profileImageUrl.startsWith('data')) {
        profileImage = this.initialProfileImage || '';
      } else if (this.state.profileImageUrl) {
        profileImage = this.state.profileImageUrl;
      }

      const updatePayload = new MemberUpdateRequest({
        nickname: this.state.name.trim(),
        profileImage: profileImage || null
      });

      await updateMemberProfile(memberId, updatePayload);

      const parsedPrimaryStack = this.state.primaryStackText
        .split(',')
        .map((skill) => skill.trim())
        .filter(Boolean);

      const parsedInterests = this.state.interestsText
        .split(',')
        .map((interest) => interest.trim())
        .filter(Boolean);

      saveProfileExtras(memberId, {
        handle: this.state.handle.trim(),
        bio: this.state.bio.trim(),
        role: this.state.role.trim(),
        company: this.state.company.trim(),
        location: this.state.location.trim(),
        primaryStack: parsedPrimaryStack,
        interests: parsedInterests,
        socialLinks: {
          github: this.state.socialLinks.github.trim(),
          website: this.state.socialLinks.website.trim(),
          linkedin: this.state.socialLinks.linkedin.trim(),
          notion: this.state.socialLinks.notion.trim()
        }
      });

      this.showToast('프로필이 저장되었습니다!');
      this.initialSnapshot = JSON.stringify({
        name: this.state.name.trim(),
        handle: this.state.handle.trim(),
        bio: this.state.bio.trim(),
        role: this.state.role.trim(),
        company: this.state.company.trim(),
        location: this.state.location.trim(),
        primaryStack: parsedPrimaryStack,
        interests: parsedInterests,
        socialLinks: {
          github: this.state.socialLinks.github.trim(),
          website: this.state.socialLinks.website.trim(),
          linkedin: this.state.socialLinks.linkedin.trim(),
          notion: this.state.socialLinks.notion.trim()
        },
        profileImageUrl: profileImage || ''
      });
      this.initialProfileImage = profileImage || '';

      setTimeout(() => {
        navigate('/profile');
      }, 800);
    } catch (error) {
      console.error('Failed to save profile:', error);
      this.showToast('저장 중 오류가 발생했습니다.', 'error');
    } finally {
      this.setState({ isSaving: false });
    }
  }

  handleCancel() {
    if (this.hasChanges()) {
      const confirmed = window.confirm('변경 사항이 저장되지 않았습니다. 나가시겠습니까?');
      if (!confirmed) {
        return;
      }
    }
    navigate('/profile');
  }

  validateForm() {
    let isValid = true;
    const errors = { ...this.state.errors };

    if (!this.state.name.trim()) {
      errors.name = '이름을 입력해주세요';
      isValid = false;
    }

    ['github', 'website', 'linkedin', 'notion'].forEach((key) => {
      if (!this.validateURL(this.state.socialLinks[key])) {
        errors[key] = '올바른 URL을 입력해주세요';
        isValid = false;
      } else {
        errors[key] = '';
      }
    });

    this.setState({ errors });
    return isValid;
  }

  validateURL(value) {
    const trimmed = (value || '').trim();
    if (!trimmed) return true;
    try {
      const url = new URL(trimmed);
      return !!url.protocol && !!url.host;
    } catch (error) {
      return false;
    }
  }

  hasChanges() {
    if (!this.initialSnapshot) return false;
    const currentSnapshot = JSON.stringify({
      name: this.state.name.trim(),
      handle: this.state.handle.trim(),
      bio: this.state.bio.trim(),
      role: this.state.role.trim(),
      company: this.state.company.trim(),
      location: this.state.location.trim(),
      primaryStack: this.state.primaryStackText
        .split(',')
        .map((skill) => skill.trim())
        .filter(Boolean),
      interests: this.state.interestsText
        .split(',')
        .map((interest) => interest.trim())
        .filter(Boolean),
      socialLinks: {
        github: this.state.socialLinks.github.trim(),
        website: this.state.socialLinks.website.trim(),
        linkedin: this.state.socialLinks.linkedin.trim(),
        notion: this.state.socialLinks.notion.trim()
      },
      profileImageUrl: this.state.profileImageUrl
    });
    return currentSnapshot !== this.initialSnapshot;
  }

  handleBeforeUnload(event) {
    if (this.hasChanges()) {
      event.preventDefault();
      event.returnValue = '';
    }
  }

  showToast(message, type = 'success') {
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
      this.toastTimeout = null;
    }

    this.setState({
      toast: {
        show: true,
        message,
        type
      }
    });

    this.toastTimeout = setTimeout(() => {
      this.setState({
        toast: {
          ...this.state.toast,
          show: false
        }
      });
    }, 2500);
  }

  escapeHTML(value) {
    if (typeof value !== 'string') return '';
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
}

export default ProfileEditPage;
