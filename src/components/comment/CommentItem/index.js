import Component from '../../../core/Component.js';

class CommentItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      comment: props.comment || {},
      isLiked: false,
      likes: 0
    };

    this.onLike = props.onLike || (() => {});
    this.onReply = props.onReply || (() => {});
    this.loadStyle('/src/components/comment/CommentItem/style.css');
  }

  render() {
    const { comment, isLiked, likes } = this.state;
    const {
      commentId,
      content,
      member,
      createdAt
    } = comment;

    const author = member?.nickname || 'Anonymous';
    const avatar = member?.profileImageUrl || `https://via.placeholder.com/48/CCCCCC/666?text=${author.charAt(0)}`;

    return `
      <div class="comment-item" data-comment-id="${commentId}">
        <div class="comment-avatar">
          <img src="${avatar}" alt="${author}">
        </div>
        <div class="comment-content-wrapper">
          <div class="comment-header">
            <span class="comment-author">${author}</span>
            <span class="comment-date">${this.formatDate(createdAt)}</span>
          </div>
          <div class="comment-text">${this.escapeHtml(content)}</div>
          <div class="comment-actions-row">
            <button class="comment-action-btn ${isLiked ? 'liked' : ''}" data-action="like">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 14L7 13.1C3.2 9.68 1 7.72 1 5.5C1 3.72 2.36 2.5 4 2.5C5 2.5 6 3 6.5 3.7C7 3 8 2.5 9 2.5C10.64 2.5 12 3.72 12 5.5C12 7.72 9.8 9.68 6 13.1L5 14Z" stroke="currentColor" stroke-width="1.5" ${isLiked ? 'fill="currentColor"' : ''}/>
              </svg>
              좋아요
              ${likes > 0 ? `<span>· ${likes}</span>` : ''}
            </button>
            <button class="comment-action-btn" data-action="reply">
              답글 달기
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
    const likeBtn = this.$$('.comment-action-btn[data-action="like"]');
    const replyBtn = this.$$('.comment-action-btn[data-action="reply"]');

    if (likeBtn) {
      likeBtn.addEventListener('click', () => {
        this.handleLike();
      });
    }

    if (replyBtn) {
      replyBtn.addEventListener('click', () => {
        this.handleReply();
      });
    }
  }

  handleLike() {
    const newIsLiked = !this.state.isLiked;
    const newLikes = newIsLiked ? this.state.likes + 1 : Math.max(0, this.state.likes - 1);

    this.setState({
      isLiked: newIsLiked,
      likes: newLikes
    });

    this.onLike(this.state.comment.commentId, newIsLiked);
  }

  handleReply() {
    this.onReply(this.state.comment.commentId);
  }

  formatDate(dateString) {
    if (!dateString) return '';

    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

      if (diffInHours < 1) return '방금';
      if (diffInHours < 24) return `${diffInHours}시간 전`;

      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 7) return `${diffInDays}일 전`;
      if (diffInDays < 30) return `${Math.floor(diffInDays / 7)}주 전`;
      if (diffInDays < 365) return `${Math.floor(diffInDays / 30)}개월 전`;

      return `${Math.floor(diffInDays / 365)}년 전`;
    } catch (error) {
      return dateString;
    }
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML.replace(/\n/g, '<br>');
  }
}

export default CommentItem;
