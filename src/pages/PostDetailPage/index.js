import Component from '../../core/Component.js';
import { formatDate, formatCount } from '../../utils/formatters.js';
import LoadingSpinner from '../../components/LoadingSpinner/index.js';
import Modal from '../../components/Modal/index.js';
import CommentInput from '../../components/CommentInput/index.js';
import CommentItem from '../../components/CommentItem/index.js';

class PostDetailPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      post: null,
      comments: [],
      commentInput: '',
      editingCommentId: null,
      editingCommentText: '',
      isLiked: false,
      isLoading: true,
      showDeleteModal: false,
      showDeleteCommentModal: false,
      deleteTargetCommentId: null
    };
    this.loadStyle('/src/pages/PostDetailPage/style.css');
    this.postId = null;
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
            <div class="post-actions">
              <button class="action-btn edit-btn" id="editBtn">수정</button>
              <button class="action-btn delete-btn" id="deleteBtn">삭제</button>
            </div>
          </div>

          <!-- 게시글 메타 정보 -->
          <div class="post-meta">
            <div class="author-info">
              <div class="author-avatar"></div>
              <div class="author-details">
                <span class="author-name">${post.author || '작성자'}</span>
                <span class="post-date">${formatDate(post.createdAt)}</span>
              </div>
            </div>
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
              <span class="like-button-label">좋아요</span>
              <span class="like-button-count">${formatCount(post.likeCount)}</span>
            </button>
            <div class="stat-item">
              <span class="stat-label">조회수</span>
              <span class="stat-value">${formatCount(post.viewCount)}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">댓글</span>
              <span class="stat-value">${formatCount(post.commentCount)}</span>
            </div>
          </div>
        </article>

        <!-- 댓글 섹션 -->
        <section class="comment-section">
          ${this.renderCommentInput()}

          <!-- 댓글 목록 -->
          <div class="comment-list" id="commentList">
            ${this.renderComments()}
          </div>

          <!-- 댓글 없음 메시지 -->
          ${this.state.comments.length === 0 ? `
            <div class="no-comments">
              <p>아직 댓글이 없습니다.</p>
            </div>
          ` : ''}
        </section>

        ${this.renderDeleteModal()}
        ${this.renderDeleteCommentModal()}
      </div>
    `;
  }

  renderCommentInput() {
    const commentInput = new CommentInput({
      value: this.state.commentInput
    });
    return commentInput.render();
  }

  renderComments() {
    return this.state.comments.map(comment => {
      const commentItem = new CommentItem({
        comment,
        isEditing: this.state.editingCommentId === comment.id,
        editingText: this.state.editingCommentText
      });
      return commentItem.render();
    }).join('');
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

  renderDeleteCommentModal() {
    const deleteCommentModal = new Modal({
      show: this.state.showDeleteCommentModal,
      title: '댓글을 삭제하시겠습니까?',
      message: '삭제한 내용은 복구할 수 없습니다.',
      id: 'deleteCommentModal'
    });
    return deleteCommentModal.render();
  }

  // 최초 마운트 시에만 1회 호출 (React의 componentDidMount와 동일)
  mounted() {
    // 뒤로가기 버튼 표시
    if (window.headerComponent) {
      window.headerComponent.showBackButton(true);
    }

    // URL에서 postId 추출 및 데이터 로딩 (1회만 실행됨)
    const path = window.location.pathname;
    const match = path.match(/\/posts\/(\d+)/);
    if (match) {
      this.postId = match[1];
      this.loadPost();
      this.loadComments();
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
        window.router.navigate(`/posts/${this.postId}/edit`);
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

    // 댓글 입력 - setState 없이 직접 업데이트
    const commentInput = this.$el.querySelector('#commentInput');
    if (commentInput) {
      commentInput.addEventListener('input', (e) => {
        this.state.commentInput = e.target.value;
      });
    }

    // 댓글 등록
    const commentSubmitBtn = this.$el.querySelector('#commentSubmitBtn');
    if (commentSubmitBtn) {
      commentSubmitBtn.addEventListener('click', () => {
        this.submitComment();
      });
    }

    // 댓글 수정/삭제 버튼 (이벤트 위임)
    const commentList = this.$el.querySelector('#commentList');
    if (commentList) {
      commentList.addEventListener('click', (e) => {
        const editBtn = e.target.closest('.edit-comment-btn');
        const deleteBtn = e.target.closest('.delete-comment-btn');
        const cancelBtn = e.target.closest('.comment-edit-btn.cancel');
        const saveBtn = e.target.closest('.comment-edit-btn.save');

        if (editBtn) {
          const commentId = editBtn.dataset.commentId;
          this.startEditComment(commentId);
        } else if (deleteBtn) {
          const commentId = deleteBtn.dataset.commentId;
          this.setState({
            showDeleteCommentModal: true,
            deleteTargetCommentId: commentId
          });
          document.body.classList.add('modal-active');
        } else if (cancelBtn) {
          this.cancelEditComment();
        } else if (saveBtn) {
          const commentId = saveBtn.dataset.commentId;
          this.saveEditComment(commentId);
        }
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

    // 댓글 삭제 모달 버튼
    const deleteCommentModal = this.$el.querySelector('#deleteCommentModal');
    if (deleteCommentModal) {
      deleteCommentModal.addEventListener('click', (e) => {
        const btn = e.target.closest('.modal-btn');
        if (!btn) return;

        const action = btn.dataset.action;
        if (action === 'cancel') {
          this.setState({
            showDeleteCommentModal: false,
            deleteTargetCommentId: null
          });
          document.body.classList.remove('modal-active');
        } else if (action === 'confirm') {
          this.deleteComment(this.state.deleteTargetCommentId);
        }
      });
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

  // 게시글 로드
  async loadPost() {
    try {
      // TODO: API 호출
      // const response = await apiGet(`/api/v1/posts/${this.postId}`);

      // 임시 더미 데이터
      await new Promise(resolve => setTimeout(resolve, 500));

      const dummyPost = {
        id: this.postId,
        title: `게시글 제목 ${this.postId}`,
        content: `이것은 게시글 ${this.postId}의 본문입니다.\n\n바닐라 JavaScript로 만든 SPA입니다.`,
        author: '작성자 이름',
        createdAt: new Date().toISOString(),
        imageUrl: null,
        viewCount: 1234,
        likeCount: 56,
        commentCount: 0
      };

      this.setState({
        post: dummyPost,
        isLoading: false
      });
    } catch (error) {
      console.error('게시글 로드 실패:', error);
      this.setState({ isLoading: false });
      alert('게시글을 불러오는데 실패했습니다.');
    }
  }

  // 댓글 로드
  async loadComments() {
    try {
      // TODO: API 호출
      // const response = await apiGet(`/api/v1/posts/${this.postId}/comments`);

      // 임시 더미 데이터
      const dummyComments = [
        {
          id: '1',
          content: '첫 번째 댓글입니다!',
          author: '댓글 작성자 1',
          createdAt: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: '2',
          content: '좋은 글 감사합니다.',
          author: '댓글 작성자 2',
          createdAt: new Date(Date.now() - 7200000).toISOString()
        }
      ];

      this.setState({ comments: dummyComments });
    } catch (error) {
      console.error('댓글 로드 실패:', error);
    }
  }

  // 좋아요 토글
  async toggleLike() {
    try {
      const newIsLiked = !this.state.isLiked;
      const likeCountDelta = newIsLiked ? 1 : -1;

      // TODO: API 호출
      // if (newIsLiked) {
      //   await apiPost(`/api/v1/posts/${this.postId}/like`);
      // } else {
      //   await apiDelete(`/api/v1/posts/${this.postId}/like`);
      // }

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

  // 댓글 작성
  async submitComment() {
    if (this.state.commentInput.trim() === '') {
      return;
    }

    try {
      // TODO: API 호출
      // const response = await apiPost(`/api/v1/posts/${this.postId}/comments`, {
      //   content: this.state.commentInput
      // });

      // 임시: 새 댓글 추가
      const newComment = {
        id: Date.now().toString(),
        content: this.state.commentInput,
        author: '현재 사용자',
        createdAt: new Date().toISOString()
      };

      this.setState({
        comments: [newComment, ...this.state.comments],
        commentInput: '',
        post: {
          ...this.state.post,
          commentCount: this.state.post.commentCount + 1
        }
      });
    } catch (error) {
      console.error('댓글 작성 실패:', error);
      alert('댓글 작성에 실패했습니다.');
    }
  }

  // 댓글 수정 시작
  startEditComment(commentId) {
    const comment = this.state.comments.find(c => c.id === commentId);
    if (comment) {
      this.setState({
        editingCommentId: commentId,
        editingCommentText: comment.content
      });
    }
  }

  // 댓글 수정 취소
  cancelEditComment() {
    this.setState({
      editingCommentId: null,
      editingCommentText: ''
    });
  }

  // 댓글 수정 저장
  async saveEditComment(commentId) {
    const textarea = this.$el.querySelector(`.comment-edit-input[data-comment-id="${commentId}"]`);
    const newContent = textarea ? textarea.value : '';

    if (newContent.trim() === '') {
      alert('댓글 내용을 입력해주세요.');
      return;
    }

    try {
      // TODO: API 호출
      // await apiPut(`/api/v1/comments/${commentId}`, { content: newContent });

      // 임시: 댓글 업데이트
      const updatedComments = this.state.comments.map(comment =>
        comment.id === commentId
          ? { ...comment, content: newContent }
          : comment
      );

      this.setState({
        comments: updatedComments,
        editingCommentId: null,
        editingCommentText: ''
      });
    } catch (error) {
      console.error('댓글 수정 실패:', error);
      alert('댓글 수정에 실패했습니다.');
    }
  }

  // 댓글 삭제
  async deleteComment(commentId) {
    try {
      // TODO: API 호출
      // await apiDelete(`/api/v1/comments/${commentId}`);

      // 임시: 댓글 제거
      const filteredComments = this.state.comments.filter(c => c.id !== commentId);

      this.setState({
        comments: filteredComments,
        showDeleteCommentModal: false,
        deleteTargetCommentId: null,
        post: {
          ...this.state.post,
          commentCount: this.state.post.commentCount - 1
        }
      });

      document.body.classList.remove('modal-active');
    } catch (error) {
      console.error('댓글 삭제 실패:', error);
      alert('댓글 삭제에 실패했습니다.');
    }
  }

  // 게시글 삭제
  async deletePost() {
    try {
      // TODO: API 호출
      // await apiDelete(`/api/v1/posts/${this.postId}`);

      alert('게시글이 삭제되었습니다.');
      window.router.navigate('/posts');
    } catch (error) {
      console.error('게시글 삭제 실패:', error);
      alert('게시글 삭제에 실패했습니다.');
    }
  }

}

export default PostDetailPage;
