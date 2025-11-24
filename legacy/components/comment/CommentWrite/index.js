import Component from '../../../core/Component.js';

class CommentWrite extends Component {
  constructor(props) {
    super(props);

    this.state = {
      commentText: '',
      isSubmitting: false
    };

    this.onSubmit = props.onSubmit || (() => {});
    this.loadStyle('/src/components/comment/CommentWrite/style.css');
  }

  render() {
    const { commentText, isSubmitting } = this.state;

    return `
      <div class="comment-write">
        <div class="comment-avatar">
          <img src="https://via.placeholder.com/48/CCCCCC/666?text=U" alt="프로필">
        </div>
        <div class="comment-input-wrapper">
          <textarea
            id="commentInput"
            class="comment-textarea"
            placeholder="댓글 달기..."
            rows="3"
            ${isSubmitting ? 'disabled' : ''}
          >${commentText}</textarea>
          <div class="comment-actions-bottom">
            <button
              class="comment-submit-btn"
              id="submitCommentBtn"
              ${isSubmitting || !commentText.trim() ? 'disabled' : ''}
            >
              ${isSubmitting ? '작성 중...' : '댓글 작성'}
            </button>
          </div>
        </div>
      </div>
    `;
  }

  mounted() {
    this.setupEventListeners();
  }

  updated() {
    this.setupEventListeners();
  }

  setupEventListeners() {
    const textarea = this.$$('#commentInput');
    const submitBtn = this.$$('#submitCommentBtn');

    if (textarea) {
      textarea.addEventListener('input', (e) => {
        this.setState({ commentText: e.target.value });
      });

      textarea.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
          e.preventDefault();
          this.handleSubmit();
        }
      });
    }

    if (submitBtn) {
      submitBtn.addEventListener('click', () => {
        this.handleSubmit();
      });
    }
  }

  async handleSubmit() {
    const text = this.state.commentText.trim();

    if (!text || this.state.isSubmitting) {
      return;
    }

    this.setState({ isSubmitting: true });

    try {
      await this.onSubmit(text);
      this.setState({
        commentText: '',
        isSubmitting: false
      });

      const textarea = this.$$('#commentInput');
      if (textarea) {
        textarea.value = '';
      }
    } catch (error) {
      console.error('Failed to submit comment:', error);
      alert('댓글 작성에 실패했습니다.');
      this.setState({ isSubmitting: false });
    }
  }
}

export default CommentWrite;
