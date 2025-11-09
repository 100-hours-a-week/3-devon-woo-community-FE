import Component from '../../core/Component.js';
import { formatDate, formatCount, truncateText } from '../../utils/formatters.js';

class PostCard extends Component {
  constructor(props) {
    super(props);
    this.loadStyle('/src/components/PostCard/style.css');
  }

  render() {
    const { post } = this.props;

    if (!post) {
      return '<div></div>';
    }

    return `
      <div class="post-card" data-post-id="${post.id}">
        <div class="post-card-header">
          <h3 class="post-card-title">${truncateText(post.title, 26)}</h3>
         
        </div>
        <div class="post-card-stats">
          <span class="post-card-stat">조회수 ${formatCount(post.viewCount)}</span>
          <span class="post-card-stat">댓글 ${formatCount(post.commentCount)}</span>
          <span class="post-card-stat">좋아요 ${formatCount(post.likeCount)}</span>
          <span class="post-card-date">${formatDate(post.createdAt)}</span>
        </div>
        <div class="post-card-footer">
          ${post.authorProfileImage ?
            `<img src="${post.authorProfileImage}" alt="${post.author}" class="author-profile-image" />` :
            `<div class="author-profile-placeholder"></div>`
          }
          <span class="author-name">${post.author || '익명'}</span>
        </div>
      </div>
    `;
  }
}

export default PostCard;
