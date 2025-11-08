import Component from '../../core/Component.js';

class PostListPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      isLoading: false,
      hasMore: true,
      page: 1
    };
    this.loadStyle('/src/pages/PostListPage/style.css');
    this.observer = null;
  }

  render() {
    return `
      <div class="main-container">
        <div class="welcome-section">
          <p class="welcome-text">안녕하세요,</p>
          <p class="welcome-text">아무 말 대잔치 <strong>게시판</strong> 입니다.</p>
          <button class="create-post-btn" id="createPostBtn">게시글 작성</button>
        </div>

        <div class="post-list-container" id="postListContainer">
          ${this.renderPosts()}
        </div>

        <!-- 무한 스크롤 감지 요소 -->
        <div class="scroll-observer" id="scrollObserver"></div>

        <!-- 로딩 스피너 -->
        <div class="loading-spinner" style="display: ${this.state.isLoading ? 'flex' : 'none'};">
          <div class="spinner"></div>
        </div>

        <!-- 빈 목록 메시지 -->
        ${this.state.posts.length === 0 && !this.state.isLoading ? `
          <div class="empty-message">
            <p>게시글이 없습니다</p>
          </div>
        ` : ''}
      </div>
    `;
  }

  renderPosts() {
    return this.state.posts.map(post => `
      <div class="post-card" data-post-id="${post.id}">
        <div class="post-card-header">
          <h3 class="post-card-title">${this.truncateTitle(post.title)}</h3>
          <span class="post-card-date">${this.formatDate(post.createdAt)}</span>
        </div>
        <div class="post-card-stats">
          <span class="post-card-stat">조회수 ${this.formatCount(post.viewCount)}</span>
          <span class="post-card-stat">댓글 ${this.formatCount(post.commentCount)}</span>
          <span class="post-card-stat">좋아요 ${this.formatCount(post.likeCount)}</span>
        </div>
        <div class="post-card-footer">
          <div class="dummy-profile"></div>
          <span class="dummy-comment">댓글 미리보기...</span>
        </div>
      </div>
    `).join('');
  }

  mounted() {
    // Header 뒤로가기 버튼 숨김
    if (window.headerComponent) {
      window.headerComponent.showBackButton(false);
    }

    const createPostBtn = this.$el.querySelector('#createPostBtn');
    const postListContainer = this.$el.querySelector('#postListContainer');

    // 게시글 작성 버튼 클릭
    createPostBtn.addEventListener('click', () => {
      window.router.navigate('/posts/create');
    });

    // 게시글 카드 클릭 (이벤트 위임)
    postListContainer.addEventListener('click', (e) => {
      const postCard = e.target.closest('.post-card');
      if (postCard) {
        const postId = postCard.dataset.postId;
        window.router.navigate(`/posts/${postId}`);
      }
    });

    // 무한 스크롤 설정
    this.setupInfiniteScroll();

    // 초기 데이터 로드
    this.loadPosts();
  }

  beforeUnmount() {
    // IntersectionObserver 해제
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  // 무한 스크롤 설정
  setupInfiniteScroll() {
    const scrollObserver = this.$el.querySelector('#scrollObserver');

    this.observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry.isIntersecting && !this.state.isLoading && this.state.hasMore) {
        this.loadPosts();
      }
    }, {
      threshold: 0.1
    });

    this.observer.observe(scrollObserver);
  }

  // 게시글 데이터 로드
  async loadPosts() {
    if (this.state.isLoading || !this.state.hasMore) return;

    this.setState({ isLoading: true });

    try {
      // TODO: API 호출로 교체
      // const response = await apiGet(`/api/v1/posts?page=${this.state.page}&size=10`);

      // 임시 데이터 (데모용)
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newPosts = this.generateDummyPosts(10);

      this.setState({
        posts: [...this.state.posts, ...newPosts],
        page: this.state.page + 1,
        isLoading: false,
        hasMore: this.state.page < 3 // 데모: 3페이지까지만
      });
    } catch (error) {
      console.error('게시글 로드 실패:', error);
      this.setState({ isLoading: false });
      alert('게시글을 불러오는데 실패했습니다.');
    }
  }

  // 임시 더미 데이터 생성 (데모용)
  generateDummyPosts(count) {
    const posts = [];
    const baseId = (this.state.page - 1) * 10;

    for (let i = 0; i < count; i++) {
      posts.push({
        id: baseId + i + 1,
        title: `게시글 제목 ${baseId + i + 1} - 이것은 테스트 게시글입니다`,
        createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
        viewCount: Math.floor(Math.random() * 100000),
        commentCount: Math.floor(Math.random() * 1000),
        likeCount: Math.floor(Math.random() * 5000)
      });
    }

    return posts;
  }

  // 제목 26자 제한
  truncateTitle(title) {
    if (title.length > 26) {
      return title.substring(0, 26) + '...';
    }
    return title;
  }

  // 날짜 포맷: yyyy-MM-dd hh:mm:ss
  formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  // 카운트 포맷: 1,000 → 1k / 10,000 → 10k / 100,000 → 100k
  formatCount(count) {
    if (count >= 100000) {
      return Math.floor(count / 1000) + 'k';
    } else if (count >= 10000) {
      return Math.floor(count / 1000) + 'k';
    } else if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'k';
    }
    return count.toString();
  }
}

export default PostListPage;
