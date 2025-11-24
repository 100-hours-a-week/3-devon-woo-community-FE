import Component from '../../../core/Component.js';
import { navigate } from '../../../core/Router.js';

class TopPostsList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      posts: props.posts || []
    };

    this.loadStyle('/src/components/post/TopPostsList/style.css');
  }

  render() {
    const { posts } = this.state;

    if (!posts || posts.length === 0) {
      return `
        <div class="top-posts">
          <h3 class="top-posts__title">TOP 5</h3>
          <p class="top-posts__empty">인기 포스트가 없습니다.</p>
        </div>
      `;
    }

    return `
      <div class="top-posts">
        <h3 class="top-posts__title">TOP 5</h3>
        <ol class="top-posts__list">
          ${posts.slice(0, 5).map(post => `
            <li class="top-posts__item">
              <a href="${post.url || `/posts/${post.id}`}"
                 class="top-posts__link"
                 data-post-id="${post.id}"
                 data-route="${post.url || `/posts/${post.id}`}">
                ${post.title}
              </a>
            </li>
          `).join('')}
        </ol>
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
    const links = this.$$all('.top-posts__link');
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const route = link.getAttribute('data-route');
        if (route) {
          navigate(route);
        }
      });
    });
  }

  beforeUnmount() {
    const links = this.$$all('.top-posts__link');
    links.forEach(link => {
      const newLink = link.cloneNode(true);
      link.replaceWith(newLink);
    });
  }
}

export default TopPostsList;
