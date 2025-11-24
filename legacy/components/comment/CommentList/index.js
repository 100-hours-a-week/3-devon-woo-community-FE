import Component from '../../../core/Component.js';
import CommentItem from '../CommentItem/index.js';

class CommentList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      comments: props.comments || [],
      sortBy: 'latest'
    };

    this.onLike = props.onLike || (() => {});
    this.onReply = props.onReply || (() => {});
    this.onSortChange = props.onSortChange || (() => {});
    this.loadStyle('/src/components/comment/CommentList/style.css');
    this.commentComponents = [];
  }

  render() {
    const { comments, sortBy } = this.state;

    return `
      <div class="comments-section">
        <div class="comments-header">
          <h3 class="section-title">댓글 <span id="commentCount">${comments.length}</span>개</h3>
          <div class="comments-sort">
            <label for="sortSelect">정렬 기준</label>
            <select id="sortSelect" class="sort-select">
              <option value="latest" ${sortBy === 'latest' ? 'selected' : ''}>날짜 오름차순</option>
              <option value="oldest" ${sortBy === 'oldest' ? 'selected' : ''}>날짜 내림차순</option>
            </select>
          </div>
        </div>

        <div class="comments-list" id="commentsList">
          ${comments.length === 0 ? `
            <div class="comments-empty">
              <p>댓글이 없습니다.</p>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  mounted() {
    this.setupEventListeners();
    this.renderComments();
  }

  updated() {
    this.setupEventListeners();
    this.renderComments();
  }

  setupEventListeners() {
    const sortSelect = this.$$('#sortSelect');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        const newSortBy = e.target.value;
        this.setState({ sortBy: newSortBy });
        this.onSortChange(newSortBy);
      });
    }
  }

  renderComments() {
    const container = this.$$('#commentsList');
    if (!container || this.state.comments.length === 0) return;

    this.commentComponents.forEach(comp => {
      if (comp._isMounted) {
        comp.unmount();
      }
    });
    this.commentComponents = [];

    container.innerHTML = '';

    this.state.comments.forEach(comment => {
      const commentDiv = document.createElement('div');
      container.appendChild(commentDiv);

      const commentItem = new CommentItem({
        comment,
        onLike: (commentId, isLiked) => this.onLike(commentId, isLiked),
        onReply: (commentId) => this.onReply(commentId)
      });

      commentItem.mount(commentDiv);
      this.commentComponents.push(commentItem);
    });
  }

  beforeUnmount() {
    this.commentComponents.forEach(comp => {
      if (comp._isMounted) {
        comp.unmount();
      }
    });
    this.commentComponents = [];
  }
}

export default CommentList;
