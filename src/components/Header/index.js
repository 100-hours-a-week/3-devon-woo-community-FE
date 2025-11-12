import Component from '../../core/Component.js';
import AuthService from '../../utils/AuthService.js';
import { getMemberProfile } from '../../api/members.js';
import { navigate } from '../../core/Router.js';

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showBackButton: props.showBackButton || false,
      isDropdownOpen: false,
      showProfileIcon: props.showProfileIcon || false,
      currentPage: props.currentPage || '',
      profileImage: null
    };
    this.loadStyle('/src/components/Header/style.css');
    this.outsideClickHandler = null;
    this.profileImageLoaded = false; // 프로필 이미지 로드 완료 플래그
  }

  render() {
    return `
      <header class="header">
        <div class="header-inner">
          <!-- back button -->
          ${this.state.showBackButton ? `
            <button class="back-button" id="backButton">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          ` : ''}

          <h1 class="header-title ${this.isAuthPage() ? 'non-clickable' : ''}" id="headerTitle">아무 말 대잔치</h1>

          <!-- profile icon -->
          ${this.state.showProfileIcon ? `
            <div class="profile-icon-wrapper">
              <button class="profile-icon-btn" id="profileIconBtn">
                ${this.state.profileImage ? `
                  <img src="${this.state.profileImage}" alt="프로필" class="profile-image" />
                ` : `
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                    <circle cx="20" cy="20" r="19.5" stroke="#333" stroke-width="1"/>
                    <path d="M20 20C23.3137 20 26 17.3137 26 14C26 10.6863 23.3137 8 20 8C16.6863 8 14 10.6863 14 14C14 17.3137 16.6863 20 20 20ZM20 23C15.5817 23 7 25.2091 7 29.5V32H33V29.5C33 25.2091 24.4183 23 20 23Z" fill="#333"/>
                  </svg>
                `}
              </button>

              <div class="dropdown-menu" id="dropdownMenu"
                  style="display: ${this.state.isDropdownOpen ? 'block' : 'none'}">
                <a href="/profile" class="dropdown-item ${this.state.currentPage === '/profile' ? 'active' : ''}">
                  회원정보수정
                </a>
                <a href="/password-change" class="dropdown-item ${this.state.currentPage === '/password-change' ? 'active' : ''}">
                  비밀번호수정
                </a>
                <button class="dropdown-item logout-item" id="logoutBtn">
                  로그아웃
                </button>
              </div>
            </div>
          ` : ''}
        </div>
      </header>

    `;
  }

  mounted() {
    this.setupEventListeners();
    this.loadProfileImage();
  }

  updated() {
    this.setupEventListeners();

    // showProfileIcon이 활성화되고 아직 로드하지 않은 경우에만 프로필 이미지 로드
    if (this.state.showProfileIcon && !this.profileImageLoaded) {
      this.loadProfileImage();
    }
  }

  setupEventListeners() {
    const backButton = this.$el.querySelector('#backButton');
    const profileIconBtn = this.$el.querySelector('#profileIconBtn');
    const logoutBtn = this.$el.querySelector('#logoutBtn');
    const headerTitle = this.$el.querySelector('#headerTitle');

    // 뒤로가기 버튼
    if (backButton) {
      backButton.addEventListener('click', () => {
        window.history.back();
      });
    }

    // 헤더 타이틀 클릭 - /posts로 이동 (로그인/회원가입 페이지 제외)
    if (headerTitle) {
      headerTitle.addEventListener('click', () => {
        const currentPage = this.state.currentPage;
        // 로그인/회원가입 페이지가 아닐 때만 이동
        if (currentPage !== '/login' && currentPage !== '/' && currentPage !== '/signup') {
          navigate('/posts');
        }
      });
    }

    // 프로필 아이콘 클릭
    if (profileIconBtn) {
      profileIconBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleDropdown();
      });
    }

    // 로그아웃 버튼
    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleLogout();
      });
    }
  }

  // 드롭다운 토글
  toggleDropdown() {
    const newState = !this.state.isDropdownOpen;
    this.setState({ isDropdownOpen: newState });

    if (newState) {
      // 드롭다운 열릴 때 외부 클릭 감지
      setTimeout(() => {
        this.outsideClickHandler = (e) => {
          const dropdown = this.$el.querySelector('#dropdownMenu');
          const profileIconBtn = this.$el.querySelector('#profileIconBtn');

          if (dropdown && !dropdown.contains(e.target) && !profileIconBtn.contains(e.target)) {
            this.closeDropdown();
          }
        };
        document.addEventListener('click', this.outsideClickHandler);
      }, 0);
    } else {
      this.removeOutsideClickHandler();
    }
  }

  // 드롭다운 닫기
  closeDropdown() {
    this.setState({ isDropdownOpen: false });
    this.removeOutsideClickHandler();
  }

  // 외부 클릭 핸들러 제거
  removeOutsideClickHandler() {
    if (this.outsideClickHandler) {
      document.removeEventListener('click', this.outsideClickHandler);
      this.outsideClickHandler = null;
    }
  }

  // 프로필 이미지 로드
  async loadProfileImage() {
    if (!this.state.showProfileIcon) return;
    if (this.profileImageLoaded) return; // 이미 로드했으면 중복 로드 방지

    const memberId = AuthService.getCurrentUserId();
    if (!memberId) return;

    try {
      const profile = await getMemberProfile(memberId);
      this.profileImageLoaded = true; // 로드 완료 플래그 설정
      this.setState({ profileImage: profile.profileImage });
    } catch (error) {
      console.error('프로필 이미지 로드 실패:', error);
      this.profileImageLoaded = true; // 실패해도 플래그 설정 (재시도 방지)
    }
  }

  // 로그아웃 처리
  handleLogout() {
    this.closeDropdown();

    AuthService.logout();

    alert('로그아웃되었습니다.');

    // 로그인 페이지로 이동
    navigate('/login');
  }

  // 뒤로가기 버튼 표시/숨김
  showBackButton(show) {
    this.setState({ showBackButton: show });
  }

  // 프로필 아이콘 표시/숨김
  showProfileIcon(show) {
    this.setState({ showProfileIcon: show });

    // 프로필 아이콘을 표시할 때 프로필 이미지 로드
    if (show) {
      this.loadProfileImage();
    } else {
      // 숨길 때 플래그 리셋
      this.profileImageLoaded = false;
    }
  }

  // 프로필 이미지 리프레시 (ProfilePage에서 업데이트 후 호출용)
  refreshProfileImage() {
    this.profileImageLoaded = false; // 플래그 리셋
    this.loadProfileImage(); // 다시 로드
  }

  // 현재 페이지 설정 (활성화 표시용)
  setCurrentPage(page) {
    this.setState({ currentPage: page });
  }

  // 인증 페이지(로그인/회원가입) 여부 확인
  isAuthPage() {
    const currentPage = this.state.currentPage;
    return currentPage === '/login' || currentPage === '/' || currentPage === '/signup';
  }

  beforeUnmount() {
    // 외부 클릭 핸들러 정리
    this.removeOutsideClickHandler();
  }
}

export default Header;
