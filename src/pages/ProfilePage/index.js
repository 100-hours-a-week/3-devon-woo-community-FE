import Component from '../../core/Component.js';
import { getMemberProfile } from '../../api/members.js';
import { getPosts } from '../../api/posts.js';
import AuthService from '../../utils/AuthService.js';
import { navigate } from '../../core/Router.js';
import { withHeader } from '../../services/HeaderService.js';

const POSTS_PER_PAGE = 5;
const DEFAULT_PROFILE_IMAGE = 'https://via.placeholder.com/160?text=Profile';
const DEFAULT_DEVELOPER_PROFILE = {
  nickname: '홍길동',
  handle: 'Backend Developer / Java Enthusiast',
  bio: 'MSA 기반 백엔드 아키텍처와 대규모 트래픽 대응 경험이 있는 Java/Spring 개발자입니다.',
  role: 'Backend Engineer',
  company: 'Codestate Labs',
  location: 'Seoul, Korea'
};
const DEFAULT_PRIMARY_STACK = ['Java', 'Spring Boot', 'JPA', 'MySQL', 'AWS'];
const DEFAULT_INTERESTS = ['서버 아키텍처', '대규모 트래픽 처리', 'Event-driven Design', 'DevOps 자동화'];
const DEFAULT_SOCIAL_LINKS = {
  github: 'https://github.com/codestate-dev',
  website: 'https://blog.codestate.dev',
  linkedin: 'https://www.linkedin.com/in/codestate',
  notion: 'https://codestate.notion.site/portfolio'
};

class ProfilePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      profile: {
        nickname: '',
        handle: '',
        bio: '',
        profileImageUrl: '',
        role: '',
        company: '',
        location: '',
        primaryStack: [],
        interests: [],
        socialLinks: {
          github: '',
          website: '',
          linkedin: '',
          notion: ''
        }
      },
      posts: [],
      currentPage: 1,
      sort: 'latest',
      showScrollTop: false,
      isOwner: true
    };

    this._eventsBound = false;
    this.handleScroll = this.handleScroll.bind(this);
    this.loadStyle('/src/pages/ProfilePage/style.css');
  }

  render() {
    if (this.state.isLoading) {
      return `
        <div class="profile-page loading">
          <div class="loading-spinner"></div>
        </div>
      `;
    }

    const posts = this.getPaginatedPosts();
    const totalPages = this.getTotalPages();

    return `
      <div class="profile-page">
        <div class="main-container">
          ${this.renderProfileCard()}
          ${this.renderPostsSection(posts, totalPages)}
        </div>

        <button class="scroll-top-btn ${this.state.showScrollTop ? 'visible' : ''}" id="scrollTopBtn" aria-label="맨 위로 이동">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M18 15l-6-6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
          </svg>
        </button>
      </div>
    `;
  }

  renderProfileCard() {
    const { profile, isOwner } = this.state;
    const primaryStack = profile.primaryStack || [];
    const interests = profile.interests || [];
    const socialLinks = profile.socialLinks || {};

    return `
      <section class="profile-card">
        <div class="profile-cover"></div>
        <div class="profile-card__body">
          <div class="profile-card__main">
            <div class="profile-avatar">
              <img src="${this.escapeHTML(profile.profileImageUrl || DEFAULT_PROFILE_IMAGE)}" alt="${this.escapeHTML(profile.nickname || '프로필')}" />
            </div>
            <div class="profile-summary">
              <div class="profile-summary__row">
                <div>
                  <h1 class="profile-name">${this.escapeHTML(profile.nickname || '사용자')}</h1>
                  ${profile.handle ? `<p class="profile-handle">${this.escapeHTML(profile.handle)}</p>` : ''}
                </div>
                ${isOwner ? `
                  <button class="profile-edit-icon" id="editProfileBtn" aria-label="프로필 수정">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M12.5 2.75L15.25 5.5m-6.57 7.32l-4.18 1.16 1.16-4.18 6.82-6.82a1.5 1.5 0 0 1 2.12 0l1.72 1.72a1.5 1.5 0 0 1 0 2.12l-7.64 7.64z" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </button>
                ` : ''}
              </div>
              <ul class="profile-details">
                ${profile.role ? `<li>${this.escapeHTML(profile.role)}</li>` : ''}
                ${profile.company ? `<li>${this.escapeHTML(profile.company)}</li>` : ''}
                ${profile.location ? `<li>${this.escapeHTML(profile.location)}</li>` : ''}
              </ul>
              ${socialLinks.website ? `
                <a href="${this.escapeHTML(socialLinks.website)}" class="profile-website" target="_blank" rel="noopener noreferrer">
                  ${this.escapeHTML(socialLinks.website)}
                </a>
              ` : ''}
            </div>
          </div>

          ${profile.bio ? `<p class="profile-bio">${this.escapeHTML(profile.bio)}</p>` : ''}

          ${this.renderInfoGrid([
            this.renderInfoItem('직무', profile.role),
            this.renderInfoItem('소속', profile.company),
            this.renderInfoItem('위치', profile.location)
          ])}
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
      </section>
    `;
  }

  renderInfoItem(label, value, isLink = false) {
    if (!value) return '';
    const content = isLink
      ? `<a href="${this.escapeHTML(value)}" target="_blank" rel="noopener noreferrer">${this.escapeHTML(value)}</a>`
      : `<span>${this.escapeHTML(value)}</span>`;
    return `
      <div class="info-item">
        <span class="info-label">${label}</span>
        ${content}
      </div>
    `;
  }

  renderInfoGrid(items = []) {
    const content = items.filter(Boolean).join('');
    if (!content) return '';
    return `
      <div class="profile-info-grid">
        ${content}
      </div>
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

  renderPostsSection(posts, totalPages) {
    return `
      <section class="posts-section">
        <div class="posts-header">
          <h2>기술 블로그</h2>
          <div class="sort-options">
            <button class="sort-btn ${this.state.sort === 'latest' ? 'active' : ''}" data-sort="latest">최신순</button>
            <button class="sort-btn ${this.state.sort === 'popular' ? 'active' : ''}" data-sort="popular">인기순</button>
            <button class="sort-btn ${this.state.sort === 'views' ? 'active' : ''}" data-sort="views">조회순</button>
          </div>
        </div>
        ${posts.length ? `
          <div class="posts-list" id="postsList">
            ${posts.map((post) => `
              <article class="post-card" data-post-id="${post.id}">
                <h3 class="post-card-title">${this.escapeHTML(post.title)}</h3>
                <div class="post-card-date">${this.formatDate(post.date)}</div>
                <p class="post-card-excerpt">${this.escapeHTML(post.excerpt)}</p>
              </article>
            `).join('')}
          </div>
        ` : `
          <div class="empty-state">게시글이 없습니다.</div>
        `}
        ${totalPages > 1 ? this.renderPagination(totalPages) : ''}
      </section>
    `;
  }

  renderPagination(totalPages) {
    const buttons = this.getPaginationButtons(totalPages);
    return `
      <div class="pagination" id="pagination">
        <button class="pagination-btn" id="prevBtn" ${this.state.currentPage === 1 ? 'disabled' : ''}>&lt;</button>
        <div class="pagination-numbers">
          ${buttons.join('')}
        </div>
        <button class="pagination-btn" id="nextBtn" ${this.state.currentPage >= totalPages ? 'disabled' : ''}>&gt;</button>
      </div>
    `;
  }

  getPaginationButtons(totalPages) {
    const { currentPage } = this.state;
    const maxVisible = 5;
    const pages = [];

    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let page = start; page <= end; page += 1) {
      pages.push(`
        <button class="pagination-number ${page === currentPage ? 'active' : ''}" data-page="${page}">
          ${page}
        </button>
      `);
    }

    return pages;
  }

  async mounted() {
    withHeader((header) => {
      header.show();
      header.setVariant('full');
    });

    await this.loadProfileData();
    this.setupEventListeners();
    window.addEventListener('scroll', this.handleScroll);
  }

  updated() {
    this.setupEventListeners();
  }

  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  async loadProfileData() {
    if (!AuthService.requireAuth()) {
      this.setState({ isLoading: false });
      return;
    }

    try {
      const memberId = AuthService.getCurrentUserId();
      const [profileResponse, postsResponse] = await Promise.all([
        getMemberProfile(memberId),
        getPosts({ page: 0, size: 6, memberId })
      ]);

      const normalizedPosts = this.normalizePosts(postsResponse?.items || []);

      this.setState({
        isLoading: false,
        profile: this.normalizeProfile(profileResponse),
        posts: normalizedPosts
      });
    } catch (error) {
      console.error('Failed to load profile data:', error);
      this.setState({ isLoading: false });
    }
  }

  normalizePosts(items) {
    if (!items.length) {
      return Array.from({ length: 5 }, (_, idx) => ({
        id: idx + 1,
        title: `새로운 기술 노트 ${idx + 1}`,
        excerpt: '아직 게시글이 없어요. 첫 번째 글을 작성해보세요.',
        date: new Date(Date.now() - idx * 86400000).toISOString(),
        likes: 0,
        views: 0,
        comments: 0
      }));
    }

    return items.map((post) => ({
      id: post.postId,
      title: post.title,
      excerpt: this.generateExcerpt(post.title),
      date: post.createdAt,
      likes: post.likeCount || 0,
      views: post.viewCount || 0,
      comments: post.commentCount || 0
    }));
  }

  generateExcerpt(title = '') {
    return `${title}에 대한 생각을 정리했습니다.`;
  }

  normalizeProfile(profileResponse = {}) {
    const primaryStack = Array.isArray(profileResponse.primaryStack) && profileResponse.primaryStack.length
      ? profileResponse.primaryStack
      : DEFAULT_PRIMARY_STACK;
    const interests = Array.isArray(profileResponse.interests) && profileResponse.interests.length
      ? profileResponse.interests
      : DEFAULT_INTERESTS;
    const socialLinks = {
      github: profileResponse.socialLinks?.github || DEFAULT_SOCIAL_LINKS.github,
      website: profileResponse.socialLinks?.website || DEFAULT_SOCIAL_LINKS.website,
      linkedin: profileResponse.socialLinks?.linkedin || DEFAULT_SOCIAL_LINKS.linkedin,
      notion: profileResponse.socialLinks?.notion || DEFAULT_SOCIAL_LINKS.notion
    };

    return {
      nickname: profileResponse.nickname || DEFAULT_DEVELOPER_PROFILE.nickname,
      handle: profileResponse.handle || DEFAULT_DEVELOPER_PROFILE.handle,
      bio: profileResponse.bio || DEFAULT_DEVELOPER_PROFILE.bio,
      profileImageUrl: profileResponse.profileImage || DEFAULT_PROFILE_IMAGE,
      role: profileResponse.role || DEFAULT_DEVELOPER_PROFILE.role,
      company: profileResponse.company || DEFAULT_DEVELOPER_PROFILE.company,
      location: profileResponse.location || DEFAULT_DEVELOPER_PROFILE.location,
      primaryStack,
      interests,
      socialLinks
    };
  }

  setupEventListeners() {
    if (!this._eventsBound) {
      this._eventsBound = true;

      this.delegate('click', '.sort-btn', (event) => {
        const button = event.target.closest('.sort-btn');
        if (!button || !this.$el?.contains(button)) return;
        const { sort } = button.dataset;
        if (sort && sort !== this.state.sort) {
          this.setState({ sort, currentPage: 1 });
        }
      });

      this.delegate('click', '.pagination-number', (event) => {
        const button = event.target.closest('.pagination-number');
        if (!button) return;
        const page = Number(button.dataset.page);
        if (Number.isFinite(page)) {
          this.setState({ currentPage: page });
        }
      });

      this.delegate('click', '#prevBtn', () => {
        if (this.state.currentPage > 1) {
          this.setState({ currentPage: this.state.currentPage - 1 });
        }
      });

      this.delegate('click', '#nextBtn', () => {
        const totalPages = this.getTotalPages();
        if (this.state.currentPage < totalPages) {
          this.setState({ currentPage: this.state.currentPage + 1 });
        }
      });

      this.delegate('click', '.post-card', (event) => {
        const card = event.target.closest('.post-card');
        if (!card) return;
        const postId = card.dataset.postId;
        if (postId) {
          navigate(`/posts/${postId}`);
        }
      });

      this.delegate('click', '#editProfileBtn', () => {
        navigate('/profile/edit');
      });
      this.delegate('click', '#scrollTopBtn', (event) => {
        event.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }

  getProcessedPosts() {
    const posts = [...this.state.posts];
    const { sort } = this.state;

    if (sort === 'latest') {
      return posts.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    if (sort === 'popular') {
      return posts.sort((a, b) => (b.likes || 0) - (a.likes || 0));
    }
    if (sort === 'views') {
      return posts.sort((a, b) => (b.views || 0) - (a.views || 0));
    }
    return posts;
  }

  getPaginatedPosts() {
    const posts = this.getProcessedPosts();
    const start = (this.state.currentPage - 1) * POSTS_PER_PAGE;
    return posts.slice(start, start + POSTS_PER_PAGE);
  }

  getTotalPages() {
    const totalPosts = this.getProcessedPosts().length || 1;
    return Math.max(1, Math.ceil(totalPosts / POSTS_PER_PAGE));
  }

  handleScroll() {
    const shouldShow = window.scrollY > 200;
    if (shouldShow !== this.state.showScrollTop) {
      this.setState({ showScrollTop: shouldShow });
    }
  }

  formatDate(isoString) {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
    } catch (error) {
      return isoString;
    }
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

export default ProfilePage;
