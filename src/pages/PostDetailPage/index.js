import Component from '../../core/Component.js';
import { formatDate, formatCount } from '../../utils/formatters.js';
import LoadingSpinner from '../../components/LoadingSpinner/index.js';
import Modal from '../../components/Modal/index.js';
import CommentInput from '../../components/CommentInput/index.js';
import CommentItem from '../../components/CommentItem/index.js';

// API imports
import { getPostById, deletePost as deletePostAPI, likePost, unlikePost } from '../../api/posts.js';
import { getComments, createComment, updateComment, deleteComment as deleteCommentAPI } from '../../api/comments.js';

// DTO imports
import CommentCreateRequest from '../../dto/request/comment/CommentCreateRequest.js';
import CommentUpdateRequest from '../../dto/request/comment/CommentUpdateRequest.js';
import PostUpdateRequest from '../../dto/request/post/PostUpdateRequest.js';

// Utils imports
import AuthService from '../../utils/AuthService.js';

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
              <span class="stat-value">${formatCount(post.viewCount)}</span>
              <span class="stat-label">조회수</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">${formatCount(post.commentCount)}</span>
              <span class="stat-label">댓글</span>
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
    const currentUserId = AuthService.getCurrentUserId();

    return this.state.comments.map(comment => {
      const commentId = comment.commentId || comment.id;
      const isOwner = currentUserId && comment.member?.memberId === currentUserId;

      const commentItem = new CommentItem({
        comment,
        isEditing: this.state.editingCommentId === commentId,
        editingText: this.state.editingCommentText,
        isOwner
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
        window.router.navigateReplace(`/posts/${this.postId}/edit`);
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

    // 댓글 입력 - 상태 업데이트 및 버튼 활성화 (re-render 없이)
    const commentInput = this.$el.querySelector('#commentInput');
    const commentSubmitBtn = this.$el.querySelector('#commentSubmitBtn');

    if (commentInput && commentSubmitBtn) {
      commentInput.addEventListener('input', (e) => {
        this.state.commentInput = e.target.value;

        if (e.target.value.trim() === '') {
          commentSubmitBtn.disabled = true;
        } else {
          commentSubmitBtn.disabled = false;
        }
      });
    }

    // 댓글 등록
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
        isLiked: postData.isLiked || false, // 좋아요 여부 설정
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
      const commentsData = await getComments(this.postId, {
        page: 0,
        size: 100, // 한 번에 많이 로드 (페이지네이션 추후 구현)
        sort: 'createdAt,desc' // 최신순 정렬
      });

      // PageResponse에서 content 추출
      const comments = commentsData.items || commentsData;

      // 댓글 개수를 post에 반영
      this.setState({
        comments,
        post: this.state.post ? {
          ...this.state.post,
          commentCount: comments.length
        } : null
      });
    } catch (error) {
      console.error('댓글 로드 실패:', error);
      // 에러 발생 시 빈 배열로 설정
      this.setState({ comments: [] });
    }
  }

  // 좋아요 토글
  async toggleLike() {
    // 로그인 확인
    if (!AuthService.requireAuth()) {
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

  // 댓글 작성
  async submitComment() {
    if (this.state.commentInput.trim() === '') {
      return;
    }

    // 로그인 확인
    if (!AuthService.requireAuth()) {
      return;
    }

    try {
      const memberId = AuthService.getCurrentUserId();

      // DTO 생성
      const commentData = new CommentCreateRequest({
        memberId,
        content: this.state.commentInput
      });

      // API 호출
      const newComment = await createComment(this.postId, commentData);

      // 댓글 목록 새로고침 (또는 새 댓글을 목록 맨 앞에 추가)
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
    const comment = this.state.comments.find(c => {
      const cId = c.commentId || c.id;
      return cId === commentId;
    });
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

    // 로그인 확인
    if (!AuthService.requireAuth()) {
      return;
    }

    try {
      const memberId = AuthService.getCurrentUserId();

      // DTO 생성
      const updateData = new CommentUpdateRequest({
        memberId,
        content: newContent
      });

      // API 호출
      const updatedComment = await updateComment(commentId, updateData);

      // 댓글 목록 업데이트
      const updatedComments = this.state.comments.map(comment => {
        const cId = comment.commentId || comment.id;
        return cId === commentId ? updatedComment : comment;
      });

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
    // 로그인 확인
    if (!AuthService.requireAuth()) {
      return;
    }

    try {
      const memberId = AuthService.getCurrentUserId();

      // API 호출
      await deleteCommentAPI(commentId, memberId);

      // 댓글 목록에서 제거
      const filteredComments = this.state.comments.filter(c => {
        const cId = c.commentId || c.id;
        return cId !== commentId;
      });

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
    // 로그인 확인
    if (!AuthService.requireAuth()) {
      return;
    }

    try {
      const memberId = AuthService.getCurrentUserId();

      // API 호출
      await deletePostAPI(this.postId, memberId);

      alert('게시글이 삭제되었습니다.');
      window.router.navigate('/posts');
    } catch (error) {
      console.error('게시글 삭제 실패:', error);
      alert('게시글 삭제에 실패했습니다.');
    }
  }

}

export default PostDetailPage;
