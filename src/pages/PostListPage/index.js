import Component from '../../core/Component.js';
import PostCard from '../../components/PostCard/index.js';
import LoadingSpinner from '../../components/LoadingSpinner/index.js';
import { getPosts } from '../../api/posts.js';

class PostListPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      isLoading: false,
      hasMore: true,
      page: 0  // API는 0부터 시작
    };
    this.loadStyle('/src/pages/PostListPage/style.css');
    this.observer = null;
    this.pageSize = 10;
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
    // Header 설정: 뒤로가기 숨김, 프로필 아이콘 표시
    if (window.headerComponent) {
      window.headerComponent.showBackButton(false);
      window.headerComponent.showProfileIcon(true);
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
      // API 호출
      const response = await getPosts({
        page: this.state.page,
        size: this.pageSize
      });

      // DTO 데이터를 PostCard가 기대하는 형식으로 변환
      const transformedPosts = response.items.map(post => ({
        id: post.postId,
        title: post.title,
        createdAt: post.createdAt,
        viewCount: post.viewCount,
        commentCount: post.commentCount,
        likeCount: post.likeCount,
        author: post.member?.nickname || '익명',
        authorProfileImage: post.member?.profileImage || null,
        imageUrl: post.imageUrl || null
      }));

      this.setState({
        posts: [...this.state.posts, ...transformedPosts],
        page: this.state.page + 1,
        isLoading: false,
        hasMore: true
      });
    } catch (error) {
      console.error('게시글 로드 실패:', error);
      this.setState({ isLoading: false });
      alert('게시글을 불러오는데 실패했습니다.');
    }
  }
}

export default PostListPage;
