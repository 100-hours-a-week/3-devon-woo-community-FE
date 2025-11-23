import Component from '../../../core/Component.js';
import { navigate } from '../../../core/Router.js';

class BlogCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      post: props.post || {}
    };

    this.loadStyle('/src/components/post/BlogCard/style.css');
  }

  render() {
    const { post } = this.state;
    const {
      id,
      title = 'Untitled',
      excerpt = '',
      category = 'General',
      author = 'Anonymous',
      date = '',
      views = 0,
      thumbnail = ''
    } = post;

    return `
      <article class="blog-card" data-post-id="${id}">
        ${thumbnail ? `
          <div class="blog-card__thumbnail">
            <img src="${thumbnail}" alt="${title}" loading="lazy" />
          </div>
        ` : ''}

        <div class="blog-card__content">
          <div class="blog-card__meta">
            <span class="blog-card__category">${category}</span>
            <span class="blog-card__divider">·</span>
            <span class="blog-card__date">${this.formatDate(date)}</span>
          </div>

          <h2 class="blog-card__title">${title}</h2>

          ${excerpt ? `
            <p class="blog-card__excerpt">${excerpt}</p>
          ` : ''}

          <div class="blog-card__footer">
            <span class="blog-card__author">${author}</span>
            <span class="blog-card__views">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 3C4.5 3 1.73 5.61 1 8c.73 2.39 3.5 5 7 5s6.27-2.61 7-5c-.73-2.39-3.5-5-7-5zm0 8a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0-2a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" fill="currentColor"/>
              </svg>
              ${this.formatViews(views)}
            </span>
          </div>
        </div>
      </article>
    `;
  }

  formatDate(dateString) {
    if (!dateString) return '';

    try {
      const date = new Date(dateString);
      const now = new Date();
      const diff = now - date;
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));

      if (days === 0) return '오늘';
      if (days === 1) return '어제';
      if (days < 7) return `${days}일 전`;
      if (days < 30) return `${Math.floor(days / 7)}주 전`;

      return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
    } catch (error) {
      return dateString;
    }
  }

  formatViews(views) {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    }
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  }

  mounted() {
    this.setupEventListeners();
  }

  updated() {
    this.setupEventListeners();
  }

  setupEventListeners() {
    const card = this.$$('.blog-card');
    if (card) {
      card.addEventListener('click', (e) => {
        e.preventDefault();
        const postId = card.getAttribute('data-post-id');
        if (postId) {
          navigate(`/posts/${postId}`);
        }
      });
    }
  }

  beforeUnmount() {
    const card = this.$$('.blog-card');
    if (card) {
      card.replaceWith(card.cloneNode(true));
    }
  }
}

export default BlogCard;
