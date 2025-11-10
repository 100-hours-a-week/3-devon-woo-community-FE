import Component from '../../core/Component.js';
import { formatDate } from '../../utils/formatters.js';

/**
 * CommentItem 컴포넌트
 * 개별 댓글 아이템 (읽기/수정 모드)
 */
class CommentItem extends Component {
  constructor(props) {
    super(props);
    this.loadStyle('/src/components/CommentItem/style.css');
  }

  render() {
    const {
      comment,
      isEditing = false,
      editingText = ''
    } = this.props;

    if (!comment) {
      return '<div></div>';
    }

    const commentId = comment.commentId || comment.id;

    return `
      <div class="comment-item ${isEditing ? 'editing' : ''}" data-comment-id="${commentId}">
        <div class="comment-header">
          <div class="comment-author-info">
            <div class="comment-avatar"></div>
            <div class="comment-author-details">
              <span class="comment-author-name">${comment.member?.nickname || '댓글 작성자'}</span>
              <span class="comment-date">${formatDate(comment.createdAt)}</span>
            </div>
          </div>
          <div class="comment-actions">
            <button class="comment-action-btn edit-comment-btn" data-comment-id="${commentId}">수정</button>
            <button class="comment-action-btn delete-comment-btn" data-comment-id="${commentId}">삭제</button>
          </div>
        </div>
        <div class="comment-content">${comment.content}</div>

        <!-- 댓글 수정 모드 -->
        <div class="comment-edit-container">
          <textarea class="comment-edit-input" data-comment-id="${commentId}">${isEditing ? editingText : comment.content}</textarea>
          <div class="comment-edit-actions">
            <button class="comment-edit-btn cancel" data-comment-id="${commentId}">취소</button>
            <button class="comment-edit-btn save" data-comment-id="${commentId}">댓글 수정</button>
          </div>
        </div>
      </div>
    `;
  }
}

export default CommentItem;
