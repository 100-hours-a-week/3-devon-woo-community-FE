import Component from '../../core/Component.js';
import PostCard from '../../components/PostCard/index.js';
import LoadingSpinner from '../../components/LoadingSpinner/index.js';

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
    const loadingSpinner = new LoadingSpinner({ show: this.state.isLoading });

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

        ${loadingSpinner.render()}

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
    return this.state.posts.map(post => {
      const postCard = new PostCard({ post });
      return postCard.render();
    }).join('');
  }

  // 최초 마운트 시에만 1회 호출
  mounted() {
    // Header 뒤로가기 버튼 숨김
    if (window.headerComponent) {
      window.headerComponent.showBackButton(false);
    }

    // 이벤트 리스너 등록
    this.setupEventListeners();

    // 무한 스크롤 설정 (1회만)
    this.setupInfiniteScroll();

    // 초기 데이터 로드
    this.loadPosts();
  }

  // 업데이트 시마다 호출
  updated() {
    // DOM이 교체되므로 이벤트 리스너 재등록
    this.setupEventListeners();

    // IntersectionObserver는 재설정 필요 없음 (scrollObserver 요소가 유지됨)
  }

  // 이벤트 리스너 설정
  setupEventListeners() {
    const createPostBtn = this.$el.querySelector('#createPostBtn');
    const postListContainer = this.$el.querySelector('#postListContainer');

    // 게시글 작성 버튼 클릭
    if (createPostBtn) {
      createPostBtn.addEventListener('click', () => {
        window.router.navigateReplace('/posts/create');
      });
    }

    // 게시글 카드 클릭 (이벤트 위임)
    if (postListContainer) {
      postListContainer.addEventListener('click', (e) => {
        const postCard = e.target.closest('.post-card');
        if (postCard) {
          const postId = postCard.dataset.postId;
          window.router.navigate(`/posts/${postId}`);
        }
      });
    }
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
      await new Promise(resolve => setTimeout(resolve, 10));

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
    const authors = ['김철수', '이영희', '박민수', '정수진', '최동욱'];

    for (let i = 0; i < count; i++) {
      const postId = baseId + i + 1;
      const authorIndex = Math.floor(Math.random() * authors.length);

      posts.push({
        id: postId,
        title: `게시글 제목 ${postId} - 이것은 테스트 게시글입니다`,
        createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
        viewCount: Math.floor(Math.random() * 100000),
        commentCount: Math.floor(Math.random() * 1000),
        likeCount: Math.floor(Math.random() * 5000),
        author: authors[authorIndex],
        authorProfileImage: `https://picsum.photos/seed/user${authorIndex}/40/40`,
        imageUrl: Math.random() > 0.3 ? `https://picsum.photos/seed/post${postId}/400/300` : null
      });
    }

    return posts;
  }
}

export default PostListPage;
