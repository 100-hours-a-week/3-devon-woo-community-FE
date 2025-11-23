import Component from '../../core/Component.js';
import { navigate } from '../../core/Router.js';

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      variant: props.variant || 'full',
      searchQuery: '',
      isSearchFocused: false,
      isAuthenticated: this.checkAuth(),
      user: this.getUser(),
      isVisible: true, // Add isVisible state
    };

    window.headerComponent = this; // Make instance globally available
    this.loadStyle('/src/components/Header/style.css');
  }

  checkAuth() {
    // Should be updated to use AuthService
    return !!localStorage.getItem('accessToken');
  }

  getUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  render() {
    if (!this.state.isVisible) {
      return ''; // Render nothing if not visible
    }

    const { variant } = this.state;
    const isMinimal = variant === 'minimal';

    return `
      <header class="header">
        <div class="header-content">
          <div class="logo-section">
            <h1 class="logo" id="logoLink">
              <span class="logo-text">Tech Blog</span>
            </h1>
          </div>

          ${!isMinimal ? this.renderNav() : ''}
          ${!isMinimal ? this.renderSearch() : ''}
          ${!isMinimal ? this.renderAuthSection() : ''}
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

  renderAuthSection() {
    const { isAuthenticated, user } = this.state;

    if (!isAuthenticated) {
      return `
        <div class="auth-section">
          <button class="auth-btn login-btn" id="loginBtn">로그인</button>
          <button class="auth-btn signup-btn" id="signupBtn">회원가입</button>
        </div>
      `;
    }

    return `
      <div class="profile-section" id="profileBtn">
        <div class="profile-image">
          <img src="${user?.profileImage || '/assets/default-profile.png'}" alt="${user?.username || 'User'}">
        </div>
        <span class="profile-name">${user?.username || 'User'}</span>
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
      profileBtn.addEventListener('click', () => {
        navigate('/profile');
      });
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

  clearSearch() {
    this.setState({ searchQuery: '' });
  }

  setCurrentPage(path) {
    this.currentPath = path;
  }

  showBackButton(show) {
    console.log('showBackButton called:', show);
  }

  showProfileIcon(show) {
    console.log('showProfileIcon called:', show);
  }
}

export default Header;
