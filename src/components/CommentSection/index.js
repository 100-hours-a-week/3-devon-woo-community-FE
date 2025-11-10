import Component from '../../core/Component.js';
import CommentInput from '../CommentInput/index.js';
import CommentItem from '../CommentItem/index.js';
import Modal from '../Modal/index.js';

// API imports
import { getComments, createComment, updateComment, deleteComment as deleteCommentAPI } from '../../api/comments.js';

// DTO imports
import CommentCreateRequest from '../../dto/request/comment/CommentCreateRequest.js';
import CommentUpdateRequest from '../../dto/request/comment/CommentUpdateRequest.js';

// Utils imports
import AuthService from '../../utils/AuthService.js';

/**
 * CommentSection 컴포넌트
 * 댓글 입력, 목록, CRUD 기능을 담당
 */
class CommentSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comments: [],
      commentInput: '',
      editingCommentId: null,
      editingCommentText: '',
      showDeleteCommentModal: false,
      deleteTargetCommentId: null
    };
    this.loadStyle('/src/components/CommentSection/style.css');
    this.postId = props.postId;
  }

  render() {
    return `
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

        ${this.renderDeleteCommentModal()}
      </section>
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
        isEditing: String(this.state.editingCommentId) === String(commentId),
        editingText: this.state.editingCommentText,
        isOwner
      });
      return commentItem.render();
    }).join('');
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

  mounted() {
    // 댓글 로드
    this.loadComments();
    // 이벤트 리스너 등록
    this.setupEventListeners();
  }

  updated() {
    // DOM이 교체되므로 이벤트 리스너 재등록
    this.setupEventListeners();
  }

  setupEventListeners() {
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
          const textarea = this.$el.querySelector(`.comment-edit-input[data-comment-id="${commentId}"]`);
          if (textarea) {
            this.saveEditCommentWithContent(commentId, textarea.value);
          }
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
    // 모달 스크롤 잠금 해제
    document.body.classList.remove('modal-active');
  }

  // 댓글 로드
  async loadComments() {
    try {
      const commentsData = await getComments(this.postId, {
        page: 0,
        size: 100, // 한 번에 많이 로드 (페이지네이션 추후 구현)
        sort: 'createdAt,desc' // 최신순 정렬
      });

      // PageResponse에서 items 추출
      const comments = commentsData.items || commentsData;

      // setState 대신 직접 수정
      this.state.comments = comments;

      // 부모에게 댓글 개수 전달
      if (this.props.onCommentCountChange) {
        this.props.onCommentCountChange(comments.length);
      }

      // 로드 완료 후 재렌더링 필요 (PostDetailPage에서 처리)
      return true;
    } catch (error) {
      console.error('댓글 로드 실패:', error);
      // 에러 발생 시 빈 배열로 설정
      this.state.comments = [];
      return false;
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

      // 댓글 목록에 새 댓글 추가
      const updatedComments = [newComment, ...this.state.comments];
      this.setState({
        comments: updatedComments,
        commentInput: ''
      });

      // 부모에게 댓글 개수 전달
      if (this.props.onCommentCountChange) {
        this.props.onCommentCountChange(updatedComments.length);
      }
    } catch (error) {
      console.error('댓글 작성 실패:', error);
      alert('댓글 작성에 실패했습니다.');
    }
  }

  // 댓글 수정 시작
  startEditComment(commentId) {
    const comment = this.state.comments.find(c => {
      const cId = String(c.commentId || c.id);
      return cId === String(commentId);
    });

    if (comment) {
      this.setState({
        editingCommentId: String(commentId),
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

  // 댓글 수정 저장 (content를 인자로 받음)
  async saveEditCommentWithContent(commentId, newContent) {
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
        const cId = String(comment.commentId || comment.id);
        return cId === String(commentId) ? updatedComment : comment;
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
      const updatedComments = this.state.comments.filter(c => {
        const cId = String(c.commentId || c.id);
        return cId !== String(commentId);
      });

      this.setState({
        comments: updatedComments,
        showDeleteCommentModal: false,
        deleteTargetCommentId: null
      });

      document.body.classList.remove('modal-active');

      // 부모에게 댓글 개수 전달
      if (this.props.onCommentCountChange) {
        this.props.onCommentCountChange(updatedComments.length);
      }
    } catch (error) {
      console.error('댓글 삭제 실패:', error);
      alert('댓글 삭제에 실패했습니다.');
    }
  }
}

export default CommentSection;
