import Component from '../../core/Component.js';
import { navigate } from '../../core/Router.js';
import { registerHeader } from '../../services/HeaderService.js';
import AuthService from '../../utils/AuthService.js';

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      variant: props.variant || 'full',
      searchQuery: '',
      isSearchFocused: false,
      isAuthenticated: this.checkAuth(),
      user: this.getUser(),
      isProfileMenuOpen: false,
      isVisible: true
    };

    this.handleDocumentClick = this.handleDocumentClick.bind(this);
    this._documentListenerAttached = false;

    registerHeader(this);
    this.loadStyle('/src/components/Header/style.css');
  }

  checkAuth() {
    return AuthService.isLoggedIn();
  }

  getUser() {
    return AuthService.getUser();
  }

  render() {
    const { variant } = this.state;
    const isMinimal = variant === 'minimal';
    const visibilityStyle = this.state.isVisible ? '' : 'style="display: none;"';

    return `
      <header class="header" ${visibilityStyle}>
        <div class="header-content">
          <div class="logo-section">
            <h1 class="logo" id="logoLink">
              <span class="logo-text">Tech Blog</span>
            </h1>
          </div>

          ${!isMinimal ? this.renderNav() : ''}
          ${!isMinimal ? this.renderSearch() : ''}
          ${this.renderAuthSection(isMinimal)}
        </div>
      </header>
    `;
  }
  
  renderNav() {
    return `
      <nav class="nav-menu">
        <a href="/" class="nav-link" data-route="/">Posts</a>
        <a href="/posts/create" class="nav-link" data-route="/posts/create">About</a>
        <a href="/profile" class="nav-link" data-route="/profile">Profile</a>
      </nav>
    `;
  }

  renderSearch() {
    return `
      <div class="search-section">
        <input
          type="text"
          class="search-input"
          id="searchInput"
          placeholder="검색"
          value="${this.state.searchQuery}"
        />
        <button class="search-btn" id="searchBtn" aria-label="검색">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM19 19l-4.35-4.35" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    `;
  }

  renderAuthSection(isMinimal) {
    const { isAuthenticated, user, isProfileMenuOpen } = this.state;

    if (!isAuthenticated) {
      return isMinimal ? '' : `
        <div class="auth-section">
          <button class="auth-btn login-btn" id="loginBtn">로그인</button>
          <button class="auth-btn signup-btn" id="signupBtn">회원가입</button>
        </div>
      `;
    }

    return `
      <div class="profile-wrapper ${isProfileMenuOpen ? 'open' : ''}" id="profileDropdown">
        <button type="button" class="profile-section" id="profileBtn" aria-haspopup="true" aria-expanded="${isProfileMenuOpen}">
          <div class="profile-image">
            <img src="${user?.profileImage || '/assets/default-profile.png'}" alt="${user?.username || 'User'}">
          </div>
          <span class="profile-name">${user?.username || 'User'}</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
        <div class="profile-menu" id="profileMenu">
          <div class="profile-menu-header">
            <div class="profile-menu-image">
              <img src="${user?.profileImage || '/assets/default-profile.png'}" alt="${user?.username || 'User'}">
            </div>
            <div>
              <p class="profile-menu-name">${user?.username || 'User'}</p>
              <p class="profile-menu-email">${user?.email || ''}</p>
            </div>
          </div>
          <div class="profile-menu-actions">
            <button type="button" class="profile-menu-item" data-action="profile">프로필 보기</button>
            <button type="button" class="profile-menu-item" data-action="editProfile">프로필 편집</button>
            <button type="button" class="profile-menu-item" data-action="writePost">게시글 작성</button>
            <button type="button" class="profile-menu-item" data-action="settings">설정</button>
          </div>
          <button type="button" class="profile-menu-item logout" data-action="logout">로그아웃</button>
        </div>
      </div>
    `;
  }

  mounted() {
    this.setupEventListeners();
  }

  updated() {
    this.setupEventListeners();
  }

  setupEventListeners() {
    const logoLink = this.$$('#logoLink');
    const navLinks = this.$$all('.nav-link');
    const searchInput = this.$$('#searchInput');
    const searchBtn = this.$$('#searchBtn');
    const loginBtn = this.$$('#loginBtn');
    const signupBtn = this.$$('#signupBtn');
    const profileBtn = this.$$('#profileBtn');
    const profileMenu = this.$$('#profileMenu');

    if (logoLink) {
      logoLink.addEventListener('click', (e) => {
        e.preventDefault();
        navigate('/');
      });
    }

    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const route = link.getAttribute('data-route');
        if (route) {
          navigate(route);
        }
      });
    });

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.setState({ searchQuery: e.target.value });
      });

      searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.handleSearch();
        }
      });

      searchInput.addEventListener('focus', () => {
        this.setState({ isSearchFocused: true });
      });

      searchInput.addEventListener('blur', () => {
        this.setState({ isSearchFocused: false });
      });
    }

    if (searchBtn) {
      searchBtn.addEventListener('click', () => {
        this.handleSearch();
      });
    }

    if (loginBtn) {
      loginBtn.addEventListener('click', () => {
        navigate('/login');
      });
    }

    if (signupBtn) {
      signupBtn.addEventListener('click', () => {
        navigate('/signup');
      });
    }

    if (profileBtn) {
      profileBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggleProfileMenu();
      });
    }

    if (profileMenu) {
      profileMenu.addEventListener('click', (e) => {
        const item = e.target.closest('.profile-menu-item');
        if (!item) return;
        const action = item.dataset.action;
        this.handleProfileMenuAction(action);
      });
    }

    if (!this._documentListenerAttached) {
      document.addEventListener('click', this.handleDocumentClick);
      this._documentListenerAttached = true;
    }
  }

  handleSearch() {
    const query = this.state.searchQuery.trim();
    if (query) {
      navigate(`/posts?search=${encodeURIComponent(query)}`);
    }
  }

  setVariant(variant) {
    this.setState({ variant });
  }

  toggleProfileMenu() {
    this.setState({ isProfileMenuOpen: !this.state.isProfileMenuOpen });
  }

  closeProfileMenu() {
    if (this.state.isProfileMenuOpen) {
      this.setState({ isProfileMenuOpen: false });
    }
  }

  handleProfileMenuAction(action) {
    if (!action) return;

    switch (action) {
      case 'profile':
        navigate('/profile');
        break;
      case 'editProfile':
        navigate('/profile/edit');
        break;
      case 'writePost':
        navigate('/posts/create');
        break;
      case 'settings':
        navigate('/posts');
        break;
      case 'logout':
        AuthService.logout();
        this.setState({ isAuthenticated: false, user: null });
        navigate('/login');
        break;
      default:
        break;
    }

    this.closeProfileMenu();
  }

  handleDocumentClick(e) {
    if (!this.state.isProfileMenuOpen) return;
    const dropdown = this.$$('#profileDropdown');
    if (dropdown && !dropdown.contains(e.target)) {
      this.closeProfileMenu();
    }
  }

  clearSearch() {
    this.setState({ searchQuery: '' });
  }

  setCurrentPage(path) {
    this.currentPath = path;
  }

  hide() {
    if (!this.state.isVisible) return;
    this.setState({ isVisible: false });
  }

  show() {
    if (this.state.isVisible) return;
    this.setState({ isVisible: true });
  }

  showBackButton(show) {
    console.log('showBackButton called:', show);
  }

  showProfileIcon(show) {
    console.log('showProfileIcon called:', show);
  }

  refreshProfileImage() {
    this.setState({ user: this.getUser() });
  }
}

export default Header;
