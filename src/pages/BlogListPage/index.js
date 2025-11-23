import Component from '../../core/Component.js';
import TopPostsList from '../../components/post/TopPostsList/index.js';
import BlogCard from '../../components/post/BlogCard/index.js';
import LoadingSpinner from '../../components/LoadingSpinner/index.js';
import TagCloud from '../../components/ui/TagCloud/index.js';
import NewsletterSubscribe from '../../components/ui/NewsletterSubscribe/index.js';
import Sidebar from '../../components/layout/Sidebar/index.js';
import { getPosts } from '../../api/posts.js';
import { getPopularTags } from '../../api/tags.js';
import { navigate } from '../../core/Router.js';

class BlogListPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      posts: [],
      topPosts: [],
      tags: [],
      isLoading: false,
      currentPage: 1,
      totalPages: 0,
      searchQuery: ''
    };

    this.pageSize = 20;
    this.loadStyle('/src/pages/BlogListPage/style.css');
    this._eventsBound = false;
    this.postComponents = [];
    this.loadingSpinner = null;
  }

  render() {
    const { currentPage, totalPages, searchQuery } = this.state;

    return `
      <div class="blog-list-page">
        <main class="blog-list-main">
          <div class="blog-list-content-wrapper">
            <section class="blog-list-content">
              ${searchQuery ? `
                <div class="search-result-header">
                  <h2 class="search-result-title">
                    "${searchQuery}" 검색 결과
                  </h2>
                  <button class="search-clear-btn" id="searchClearBtn">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                    검색 초기화
                  </button>
                </div>
              ` : ''}

              <div class="blog-list-grid" id="blogListGrid"></div>

              ${totalPages > 1 ? `
                <div class="pagination" id="pagination">
                  <button
                    class="pagination__btn pagination__btn--prev"
                    id="prevBtn"
                    ${currentPage === 1 ? 'disabled' : ''}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M12.5 15l-5-5 5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button>

                  <div class="pagination__pages" id="paginationPages"></div>

                  <button
                    class="pagination__btn pagination__btn--next"
                    id="nextBtn"
                    ${currentPage >= totalPages ? 'disabled' : ''}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M7.5 15l5-5-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button>
                </div>
              ` : ''}
            </section>

            <div id="sidebarContainer"></div>
          </div>
        </main>
      </div>
    `;
  }

  async mounted() {
    await this.$nextTick();

    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('search') || '';

    if (searchQuery) {
      this.state.searchQuery = searchQuery;
    }

    await this.loadPosts();
    await this.loadTopPosts();
    await this.loadTags();

    this.renderSidebar();
    this.setupEventListeners();
  }

  async updated() {
    await this.$nextTick();
    this.renderPosts();
    this.renderPaginationPages();
  }

  $nextTick() {
    return new Promise(resolve => setTimeout(resolve, 0));
  }

  renderSidebar() {
    const container = this.$$('#sidebarContainer');
    if (!container) return;

    if (!this.sidebarComponent) {
      this.topPostsComponent = new TopPostsList({
        posts: this.state.topPosts
      });

      this.tagCloudComponent = new TagCloud({
        tags: this.state.tags,
        onTagClick: (tagName) => {
          navigate(`/posts?search=${encodeURIComponent(tagName)}`);
        }
      });

      this.newsletterComponent = new NewsletterSubscribe({
        onSubscribe: async (email) => {
          await new Promise(resolve => setTimeout(resolve, 1000));
          console.log('Newsletter subscription:', email);
        }
      });

      this.sidebarComponent = new Sidebar({
        children: [
          this.topPostsComponent,
          this.tagCloudComponent,
          this.newsletterComponent
        ]
      });

      this.sidebarComponent.mount(container);
    } else if (!this.sidebarComponent._isMounted) {
      container.innerHTML = '';
      this.sidebarComponent.mount(container);
    }
  }

  renderPosts() {
    const grid = this.$$('#blogListGrid');
    if (!grid) return;

    this._destroyPostComponents();
    this._destroyLoadingSpinner();
    grid.innerHTML = '';

    if (this.state.isLoading && this.state.posts.length === 0) {
      this._mountLoadingSpinner(grid);
      return;
    }

    if (!this.state.isLoading && this.state.posts.length === 0) {
      grid.innerHTML = `
        <div class="empty-state">
          <p>게시글이 없습니다.</p>
        </div>
      `;
      return;
    }

    this.state.posts.forEach((post) => {
      const card = new BlogCard({ post });
      card.mount(grid);
      this.postComponents.push(card);
    });
  }

  renderPaginationPages() {
    const pagesContainer = this.$$('#paginationPages');
    if (!pagesContainer) return;

    const { currentPage, totalPages } = this.state;
    const pageButtons = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      pageButtons.push(`<button class="pagination__page" data-page="1">1</button>`);
      if (startPage > 2) {
        pageButtons.push(`<div class="pagination__ellipsis">...</div>`);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      const activeClass = i === currentPage ? 'is-active' : '';
      pageButtons.push(`<button class="pagination__page ${activeClass}" data-page="${i}">${i}</button>`);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageButtons.push(`<div class="pagination__ellipsis">...</div>`);
      }
      pageButtons.push(`<button class="pagination__page" data-page="${totalPages}">${totalPages}</button>`);
    }

    pagesContainer.innerHTML = pageButtons.join('');
  }

  setupEventListeners() {
    if (this._eventsBound) return;
    this._eventsBound = true;

    this.delegate('click', '#prevBtn', () => {
      if (this.state.currentPage > 1) {
        this.goToPage(this.state.currentPage - 1);
      }
    });

    this.delegate('click', '#nextBtn', () => {
      if (this.state.currentPage < this.state.totalPages) {
        this.goToPage(this.state.currentPage + 1);
      }
    });

    this.delegate('click', '#paginationPages .pagination__page', (e) => {
      const pageBtn = e.target.closest('.pagination__page');
      if (pageBtn) {
        const page = parseInt(pageBtn.dataset.page, 10);
        this.goToPage(page);
      }
    });

    this.delegate('click', '#searchClearBtn', () => {
      navigate('/posts');
    });

  }

  async goToPage(page) {
    this.state.currentPage = page;
    await this.loadPosts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async loadPosts() {
    if (!this.state.isLoading && this.$el) {
      this.state.isLoading = true;
      this.renderPosts();
    } else {
      this.state.isLoading = true;
    }

    try {
      const response = await getPosts({
        page: this.state.currentPage - 1,
        size: this.pageSize
      });

      const transformedPosts = response.items.map(post => ({
        id: post.postId,
        title: post.title,
        excerpt: post.summary || this.generateExcerpt(post.title),
        category: 'TECH INSIGHT',
        author: post.member?.nickname || 'Anonymous',
        date: post.createdAt,
        views: post.viewCount || 0,
        thumbnail: post.thumbnail || post.imageUrl || ''
      }));

      let filteredPosts = transformedPosts;
      if (this.state.searchQuery) {
        const query = this.state.searchQuery.toLowerCase();
        filteredPosts = transformedPosts.filter(post =>
          post.title.toLowerCase().includes(query) ||
          post.author.toLowerCase().includes(query)
        );
      }

      this.state.posts = filteredPosts;
      this.state.totalPages = response.totalPages;
      this.state.isLoading = false;
      this.renderPosts();
      this.renderPaginationPages();
    } catch (error) {
      console.error('Failed to load posts:', error);
      this.state.isLoading = false;
      this.renderPosts();
    }
  }

  async loadTopPosts() {
    try {
      const response = await getPosts({
        page: 0,
        size: 5,
        sort: 'viewCount,desc'
      });

      const topPosts = response.items.map(post => ({
        id: post.postId,
        title: post.title,
        url: `/posts/${post.postId}`
      }));

      this.state.topPosts = topPosts;
      if (this.topPostsComponent) {
        this.topPostsComponent.setState({ posts: topPosts });
      }
    } catch (error) {
      console.error('Failed to load top posts:', error);
    }
  }

  async loadTags() {
    try {
      const response = await getPopularTags({ limit: 20 });
      const tags = (response || []).map((tag) => ({
        name: tag.name,
        count: tag.postCount ?? tag.count ?? 0
      }));

      this.state.tags = tags;
      if (this.tagCloudComponent) {
        this.tagCloudComponent.setState({ tags });
      }
    } catch (error) {
      console.error('Failed to load tags:', error);
    }
  }

  generateExcerpt(title) {
    return `네이버 사내 기술 교류 행사인 NAVER ENGINEERING DAY 2025(10월)에서 발표되었던 세션을 공개합니다. 발표 내용과 기술적 인사이트를 공유하며, 실무에 적용할 수 있는 다양한 팁과 노하우를 소개합니다.`;
  }

  _mountLoadingSpinner(container) {
    this.loadingSpinner = new LoadingSpinner({ show: true, variant: 'inline' });
    const wrapper = document.createElement('div');
    wrapper.className = 'blog-list-loading';
    container.appendChild(wrapper);
    this.loadingSpinner.mount(wrapper);
  }

  _destroyLoadingSpinner() {
    if (this.loadingSpinner) {
      this.loadingSpinner.unmount();
      this.loadingSpinner = null;
    }
  }

  _destroyPostComponents() {
    if (!this.postComponents) return;
    this.postComponents.forEach((component) => {
      if (component && typeof component.unmount === 'function') {
        component.unmount();
      }
    });
    this.postComponents = [];
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
  }

  beforeUnmount() {
    if (this.sidebarComponent) {
      this.sidebarComponent.unmount();
    }
    this._destroyPostComponents();
    this._destroyLoadingSpinner();
  }
}

BlogListPage.enableCache = false;

export default BlogListPage;
