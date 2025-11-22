import Component from '../../core/Component.js';
import Header from '../../components/Header/index.js';
import BlogCard from '../../components/post/BlogCard/index.js';
import TopPostsList from '../../components/post/TopPostsList/index.js';
import TagCloud from '../../components/ui/TagCloud/index.js';
import NewsletterSubscribe from '../../components/ui/NewsletterSubscribe/index.js';
import Sidebar from '../../components/layout/Sidebar/index.js';
import { getPosts } from '../../api/posts.js';
import { navigate } from '../../core/Router.js';

class BlogListPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      posts: [],
      topPosts: [],
      tags: [],
      isLoading: false,
      currentPage: 0,
      totalPages: 0,
      searchQuery: ''
    };

    this.pageSize = 12;
    this.loadStyle('/src/pages/BlogListPage/style.css');
  }

  render() {
    const { posts, isLoading, currentPage, totalPages, searchQuery } = this.state;

    return `
      <div class="blog-list-page">
        <div id="headerContainer"></div>

        <main class="blog-list-main">
          <div class="blog-list-content">
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

            <div class="blog-list-grid" id="blogListGrid">
              ${isLoading && posts.length === 0 ? `
                <div class="loading-state">
                  <p>게시글을 불러오는 중...</p>
                </div>
              ` : posts.length === 0 ? `
                <div class="empty-state">
                  <p>게시글이 없습니다.</p>
                </div>
              ` : ''}
            </div>

            ${totalPages > 1 ? `
              <div class="pagination" id="pagination">
                <button
                  class="pagination__btn pagination__btn--prev"
                  id="prevBtn"
                  ${currentPage === 0 ? 'disabled' : ''}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M12 16l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>

                <div class="pagination__pages" id="paginationPages"></div>

                <button
                  class="pagination__btn pagination__btn--next"
                  id="nextBtn"
                  ${currentPage >= totalPages - 1 ? 'disabled' : ''}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M8 4l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
              </div>
            ` : ''}
          </div>

          <div id="sidebarContainer"></div>
        </main>
      </div>
    `;
  }

  async mounted() {
    console.log('BlogListPage mounted');
    this.hideGlobalHeader();

    await this.$nextTick();

    console.log('Rendering header and sidebar');
    this.renderHeader();
    this.renderSidebar();

    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('search') || '';

    if (searchQuery) {
      this.state.searchQuery = searchQuery;
    }

    console.log('Loading posts');
    await this.loadPosts();
    await this.loadTopPosts();
    await this.loadTags();

    this.setupEventListeners();
    console.log('BlogListPage setup complete');
  }

  async updated() {
    await this.$nextTick();
    this.renderBlogCards();
    this.renderPaginationPages();
    this.setupEventListeners();
  }

  $nextTick() {
    return new Promise(resolve => setTimeout(resolve, 0));
  }

  renderHeader() {
    const container = this.$$('#headerContainer');
    if (!container) return;

    if (!this.headerComponent) {
      this.headerComponent = new Header({
        variant: 'full'
      });
      this.headerComponent.mount(container);
    }
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
    }
  }

  renderBlogCards() {
    const grid = this.$$('#blogListGrid');
    if (!grid || this.state.posts.length === 0) return;

    grid.innerHTML = '';

    this.state.posts.forEach(post => {
      const card = new BlogCard({ post });
      const cardDiv = document.createElement('div');
      cardDiv.innerHTML = card.render().trim();
      const cardElement = cardDiv.firstElementChild;
      grid.appendChild(cardElement);
      card.$el = cardElement;
      card.mounted();
    });
  }

  renderPaginationPages() {
    const pagesContainer = this.$$('#paginationPages');
    if (!pagesContainer) return;

    const { currentPage, totalPages } = this.state;
    pagesContainer.innerHTML = '';

    const maxVisible = 5;
    let startPage = Math.max(0, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxVisible - 1);

    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(0, endPage - maxVisible + 1);
    }

    if (startPage > 0) {
      const firstBtn = this.createPageButton(0, '1');
      pagesContainer.appendChild(firstBtn);

      if (startPage > 1) {
        const ellipsis = document.createElement('span');
        ellipsis.className = 'pagination__ellipsis';
        ellipsis.textContent = '...';
        pagesContainer.appendChild(ellipsis);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      const btn = this.createPageButton(i, (i + 1).toString());
      pagesContainer.appendChild(btn);
    }

    if (endPage < totalPages - 1) {
      if (endPage < totalPages - 2) {
        const ellipsis = document.createElement('span');
        ellipsis.className = 'pagination__ellipsis';
        ellipsis.textContent = '...';
        pagesContainer.appendChild(ellipsis);
      }

      const lastBtn = this.createPageButton(totalPages - 1, totalPages.toString());
      pagesContainer.appendChild(lastBtn);
    }
  }

  createPageButton(pageNumber, text) {
    const btn = document.createElement('button');
    btn.className = 'pagination__page';
    btn.textContent = text;
    btn.dataset.page = pageNumber;

    if (pageNumber === this.state.currentPage) {
      btn.classList.add('is-active');
    }

    return btn;
  }

  setupEventListeners() {
    const prevBtn = this.$$('#prevBtn');
    const nextBtn = this.$$('#nextBtn');
    const paginationPages = this.$$('#paginationPages');
    const searchClearBtn = this.$$('#searchClearBtn');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (this.state.currentPage > 0) {
          this.goToPage(this.state.currentPage - 1);
        }
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (this.state.currentPage < this.state.totalPages - 1) {
          this.goToPage(this.state.currentPage + 1);
        }
      });
    }

    if (paginationPages) {
      paginationPages.addEventListener('click', (e) => {
        const pageBtn = e.target.closest('.pagination__page');
        if (pageBtn) {
          const page = parseInt(pageBtn.dataset.page, 10);
          this.goToPage(page);
        }
      });
    }

    if (searchClearBtn) {
      searchClearBtn.addEventListener('click', () => {
        navigate('/posts');
      });
    }
  }

  async goToPage(page) {
    this.setState({ currentPage: page });
    await this.loadPosts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async loadPosts() {
    this.setState({ isLoading: true });

    try {
      const response = await getPosts({
        page: this.state.currentPage,
        size: this.pageSize
      });

      const transformedPosts = response.items.map(post => ({
        id: post.postId,
        title: post.title,
        excerpt: this.generateExcerpt(post.title),
        category: 'Tech',
        author: post.member?.nickname || 'Anonymous',
        date: post.createdAt,
        views: post.viewCount || 0,
        thumbnail: post.imageUrl || ''
      }));

      let filteredPosts = transformedPosts;
      if (this.state.searchQuery) {
        const query = this.state.searchQuery.toLowerCase();
        filteredPosts = transformedPosts.filter(post =>
          post.title.toLowerCase().includes(query) ||
          post.author.toLowerCase().includes(query)
        );
      }

      this.setState({
        posts: filteredPosts,
        totalPages: response.totalPages,
        isLoading: false
      });
    } catch (error) {
      console.error('Failed to load posts:', error);
      this.setState({ isLoading: false });
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

      this.setState({ topPosts });

      if (this.topPostsComponent) {
        this.topPostsComponent.setState({ posts: topPosts });
      }
    } catch (error) {
      console.error('Failed to load top posts:', error);
    }
  }

  async loadTags() {
    const mockTags = [
      { name: 'JavaScript', count: 42 },
      { name: 'React', count: 38 },
      { name: 'TypeScript', count: 31 },
      { name: 'CSS', count: 28 },
      { name: 'Node.js', count: 25 },
      { name: 'Vue', count: 22 },
      { name: 'Frontend', count: 45 },
      { name: 'Backend', count: 33 }
    ];

    this.setState({ tags: mockTags });

    if (this.tagCloudComponent) {
      this.tagCloudComponent.setState({ tags: mockTags });
    }
  }

  generateExcerpt(title) {
    return `${title}에 대한 내용을 다룹니다. 자세한 내용은 포스트를 확인해주세요.`;
  }

  hideGlobalHeader() {
    const globalHeader = document.getElementById('header');
    if (globalHeader) {
      globalHeader.style.display = 'none';
    }
  }

  showGlobalHeader() {
    const globalHeader = document.getElementById('header');
    if (globalHeader) {
      globalHeader.style.display = '';
    }
  }

  beforeUnmount() {
    this.showGlobalHeader();

    if (this.headerComponent) {
      this.headerComponent.unmount();
    }
    if (this.sidebarComponent) {
      this.sidebarComponent.unmount();
    }
  }
}

export default BlogListPage;
