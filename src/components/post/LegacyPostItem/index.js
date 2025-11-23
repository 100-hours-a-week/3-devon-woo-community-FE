import Component from '../../../core/Component.js';
import { navigate } from '../../../core/Router.js';

class LegacyPostItem extends Component {
  constructor(props) {
    super(props);
    this.post = props.post || {};
    this.postNumber = props.postNumber || 0;
    this.loadStyle('/src/pages/BlogListPage/style.css');
    this.handleClick = this.handleClick.bind(this);
  }

  render() {
    const { post } = this;
    const gradientClass = `gradient-${((this.postNumber - 1) % 4) + 1}`;
    const category = post.category || 'TECH INSIGHT';

    return `
      <article class="post-item" data-post-id="${post.id}">
        <div class="post-content">
          <div class="post-category">${category}</div>
          <h2 class="post-title">${post.title}</h2>
          <p class="post-excerpt">${post.excerpt}</p>
          <div class="post-meta">
            <span class="post-date">${post.dateFormatted || ''}</span>
            <span class="post-divider">·</span>
            <span class="post-author">${post.author}</span>
            <span class="post-divider">·</span>
            <span class="post-views">${post.views}</span>
          </div>
        </div>
        <div class="post-thumbnail ${gradientClass}">
          Tech Post<br/>#${this.postNumber}
        </div>
      </article>
    `;
  }

  mounted() {
    if (this.$el) {
      this.$el.addEventListener('click', this.handleClick);
    }
  }

  beforeUnmount() {
    if (this.$el) {
      this.$el.removeEventListener('click', this.handleClick);
    }
  }

  handleClick() {
    if (this.post?.id) {
      navigate(`/posts/${this.post.id}`);
    }
  }
}

export default LegacyPostItem;
