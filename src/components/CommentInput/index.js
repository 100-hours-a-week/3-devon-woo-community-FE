import Component from '../../core/Component.js';

/**
 * CommentInput 컴포넌트
 * 댓글 입력 영역과 등록 버튼
 */
class CommentInput extends Component {
  constructor(props) {
    super(props);
    this.loadStyle('/src/components/CommentInput/style.css');
  }

  render() {
    const { value = '', placeholder = '댓글을 남겨주세요!' } = this.props;
    const isDisabled = value.trim() === '';

    return `
      <div class="comment-input-container">
        <textarea
          class="comment-input"
          id="commentInput"
          placeholder="${placeholder}"
          rows="3"
        >${value}</textarea>
        <button
          class="comment-submit-btn"
          id="commentSubmitBtn"
          ${isDisabled ? 'disabled' : ''}
        >
          댓글 등록
        </button>
      </div>
    `;
  }
}

export default CommentInput;
