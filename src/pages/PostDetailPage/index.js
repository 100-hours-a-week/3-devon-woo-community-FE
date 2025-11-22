import Component from '../../core/Component.js';
import { formatDate, formatCount } from '../../utils/formatters.js';
import LoadingSpinner from '../../components/LoadingSpinner/index.js';
import Modal from '../../components/Modal/index.js';
import CommentSection from '../../components/CommentSection/index.js';

// API imports
import { getPostById, deletePost as deletePostAPI, likePost, unlikePost } from '../../api/posts.js';

// Utils imports
import AuthService from '../../utils/AuthService.js';
import { navigate, navigateReplace } from '../../core/Router.js';

class PostDetailPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      post: null,
      isLiked: false,
      isLoading: true,
      showDeleteModal: false,
      showLoginModal: false
    };
    this.loadStyle('/src/pages/PostDetailPage/style.css');
    this.postId = null;
    this.commentSection = null; // CommentSection 인스턴스 저장
    this.commentSectionMounted = false; // CommentSection 마운트 여부
  }

  render() {
    if (this.state.isLoading) {
      const loadingSpinner = new LoadingSpinner({ show: true });
      return `
        <div class="main-container">
          ${loadingSpinner.render()}
        </div>
      `;
    }

    const post = this.state.post;
    if (!post) {
      return `
        <div class="main-container">
          <div class="error-message">게시글을 찾을 수 없습니다.</div>
        </div>
      `;
    }

    return `
      <div class="main-container">
        <!-- 게시글 상세 섹션 -->
        <article class="post-detail">
          <!-- 게시글 헤더 -->
          <div class="post-header">
            <h2 class="post-title">${post.title}</h2>

          </div>

          <!-- 게시글 메타 정보 -->
          <div class="post-meta">
            <div class="author-info">
              <div class="author-avatar">
                ${post.member?.profileImage ?
                  `<img src="${post.member.profileImage}" alt="${post.member.nickname}" class="avatar-image" />` :
                  `<div class="avatar-placeholder"></div>`
                }
              </div>
              <div class="author-details">
                <span class="author-name">${post.member?.nickname || '작성자'}</span>
                <span class="post-date">${formatDate(post.createdAt)}</span>
              </div>
            </div>
            ${this.isPostOwner() ? `
              <div class="post-actions">
                <button class="action-btn edit-btn" id="editBtn">수정</button>
                <button class="action-btn delete-btn" id="deleteBtn">삭제</button>
              </div>
            ` : ''}
          </div>

          <!-- 게시글 이미지 -->
          ${post.imageUrl ? `
            <div class="post-image-container">
              <img src="${post.imageUrl}" alt="게시글 이미지" class="post-image">
            </div>
          ` : ''}

          <!-- 게시글 본문 -->
          <div class="post-content">${post.content}</div>

          <!-- 게시글 통계 -->
          <div class="post-stats">
            <button
              class="like-button ${this.state.isLiked ? 'active' : ''}"
              id="likeBtn"
            >  
              <span class="stat-value">${formatCount(post.likeCount)}</span>
              <span class="stat-label">좋아요수</span>
            </button>
            <div class="stat-item">
              <span class="stat-value">${formatCount(post.viewCount + 1)}</span>
              <span class="stat-label">조회수</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">${formatCount(post.commentCount)}</span>
              <span class="stat-label">댓글</span>
            </div>
          </div>
        </article>

        <!-- 댓글 섹션 -->
        ${this.renderCommentSection()}

        ${this.renderDeleteModal()}
        ${this.renderLoginModal()}
      </div>
    `;
  }

  renderCommentSection() {
    // CommentSection 인스턴스가 없을 때만 생성 (재사용)
    if (!this.commentSection) {
      this.commentSection = new CommentSection({
        postId: this.postId,
        onCommentCountChange: (count) => {
          // 댓글 개수 업데이트 (리렌더링 방지)
          if (this.state.post && this.state.post.commentCount !== count) {
            // 직접 state 업데이트 (setState 사용 안 함)
            this.state.post.commentCount = count;
            // 댓글 개수 표시 부분만 업데이트
            const commentCountEl = this.$el?.querySelector('.post-stats .stat-item:last-child .stat-value');
            if (commentCountEl) {
              commentCountEl.textContent = formatCount(count);
            }
          }
        }
      });
    }
    return this.commentSection.render();
  }

  renderDeleteModal() {
    const deleteModal = new Modal({
      show: this.state.showDeleteModal,
      title: '게시글을 삭제하시겠습니까?',
      message: '삭제한 내용은 복구할 수 없습니다.',
      id: 'deleteModal'
    });
    return deleteModal.render();
  }

  renderLoginModal() {
    const loginModal = new Modal({
      show: this.state.showLoginModal,
      title: '로그인이 필요합니다',
      message: '로그인을 했을 때만 좋아요를 누를 수 있습니다.\n로그인하시겠습니까?',
      id: 'loginModal'
    });
    return loginModal.render();
  }

  // 최초 마운트 시에만 1회 호출 (React의 componentDidMount와 동일)
  mounted() {
    // Header 설정: 뒤로가기 표시, 프로필 아이콘 표시
    if (window.headerComponent) {
      window.headerComponent.showBackButton(true);
      window.headerComponent.showProfileIcon(true);
    }

    // URL에서 postId 추출 및 데이터 로딩 (1회만 실행됨)
    const path = window.location.pathname;
    const match = path.match(/\/posts\/(\d+)/);
    if (match) {
      this.postId = match[1];
      this.loadPost();
    }

    // 이벤트 리스너 등록
    this.setupEventListeners();
  }

  // 업데이트 시마다 호출 (React의 componentDidUpdate와 동일)
  updated() {
    // DOM이 교체되므로 이벤트 리스너 재등록
    this.setupEventListeners();
  }

  setupEventListeners() {
    // 게시글 수정 버튼
    const editBtn = this.$el.querySelector('#editBtn');
    if (editBtn) {
      editBtn.addEventListener('click', () => {
        navigate(`/posts/${this.postId}/edit`);
      });
    }

    // 게시글 삭제 버튼
    const deleteBtn = this.$el.querySelector('#deleteBtn');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', () => {
        this.setState({ showDeleteModal: true });
        document.body.classList.add('modal-active');
      });
    }

    // 좋아요 버튼
    const likeBtn = this.$el.querySelector('#likeBtn');
    if (likeBtn) {
      likeBtn.addEventListener('click', () => {
        this.toggleLike();
      });
    }

    // 게시글 삭제 모달 버튼
    const deleteModal = this.$el.querySelector('#deleteModal');
    if (deleteModal) {
      deleteModal.addEventListener('click', (e) => {
        const btn = e.target.closest('.modal-btn');
        if (!btn) return;

        const action = btn.dataset.action;
        if (action === 'cancel') {
          this.setState({ showDeleteModal: false });
          document.body.classList.remove('modal-active');
        } else if (action === 'confirm') {
          this.deletePost();
        }
      });
    }

    // 로그인 모달 버튼
    const loginModal = this.$el.querySelector('#loginModal');
    if (loginModal) {
      loginModal.addEventListener('click', (e) => {
        const btn = e.target.closest('.modal-btn');
        if (!btn) return;

        const action = btn.dataset.action;
        if (action === 'cancel') {
          this.setState({ showLoginModal: false });
          document.body.classList.remove('modal-active');
        } else if (action === 'confirm') {
          // 로그인 페이지로 이동
          this.setState({ showLoginModal: false });
          document.body.classList.remove('modal-active');
          navigateReplace('/login');
        }
      });
    }

    // CommentSection의 DOM 요소 연결 및 초기화
    if (this.commentSection) {
      const commentSectionEl = this.$el.querySelector('.comment-section');
      if (commentSectionEl) {
        this.commentSection.$el = commentSectionEl;

        // 최초 1회만 mounted() 호출 (댓글 로드 포함)
        if (!this.commentSectionMounted) {
          this.commentSectionMounted = true;
          this.commentSection.mounted();
        } else {
          // 이후에는 이벤트 리스너만 재등록
          this.commentSection.setupEventListeners();
        }
      }
    }
  }


  beforeUnmount() {
    // 뒤로가기 버튼 숨김
    if (window.headerComponent) {
      window.headerComponent.showBackButton(false);
    }
    // 모달 스크롤 잠금 해제
    document.body.classList.remove('modal-active');
  }

  // 게시글 작성자 확인
  isPostOwner() {
    if (!this.state.post || !this.state.post.member) return false;
    const currentUserId = AuthService.getCurrentUserId();
    if (!currentUserId) return false;
    return this.state.post.member.memberId === currentUserId;
  }

  // 게시글 로드
  async loadPost() {
    try {
      // 현재 로그인한 사용자 ID 가져오기
      const memberId = AuthService.getCurrentUserId();

      const postData = await getPostById(this.postId, memberId);

      this.setState({
        post: postData,
        // isLiked가 null이거나 undefined일 경우 false로 설정
        isLiked: postData.isLiked === true,
        isLoading: false
      });
    } catch (error) {
      console.error('게시글 로드 실패:', error);
      this.setState({ isLoading: false });
      alert('게시글을 불러오는데 실패했습니다.');
    }
  }

  // 좋아요 토글
  async toggleLike() {
    // 로그인 확인 - 로그인하지 않은 경우 모달 표시
    if (!AuthService.isLoggedIn()) {
      this.setState({ showLoginModal: true });
      document.body.classList.add('modal-active');
      return;
    }

    try {
      const memberId = AuthService.getCurrentUserId();

      const newIsLiked = !this.state.isLiked;
      const likeCountDelta = newIsLiked ? 1 : -1;

      // API 호출
      if (newIsLiked) {
        await likePost(this.postId, memberId);
      } else {
        await unlikePost(this.postId, memberId);
      }

      this.setState({
        isLiked: newIsLiked,
        post: {
          ...this.state.post,
          likeCount: this.state.post.likeCount + likeCountDelta
        }
      });
    } catch (error) {
      console.error('좋아요 처리 실패:', error);
      alert('좋아요 처리에 실패했습니다.');
    }
  }

  // 게시글 삭제
  async deletePost() {
    // 로그인 확인
    if (!AuthService.requireAuth()) {
      return;
    }

    try {
      const memberId = AuthService.getCurrentUserId();

      // API 호출
      await deletePostAPI(this.postId, memberId);

      alert('게시글이 삭제되었습니다.');
      navigateReplace('/posts');
    } catch (error) {
      console.error('게시글 삭제 실패:', error);
      alert('게시글 삭제에 실패했습니다.');
    }
  }

}

export default PostDetailPage;
