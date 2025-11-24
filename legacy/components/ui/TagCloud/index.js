import Component from '../../../core/Component.js';

class TagCloud extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tags: props.tags || [],
      selectedTag: props.selectedTag || null
    };

    this.onTagClick = props.onTagClick || (() => {});

    this.loadStyle('/src/components/ui/TagCloud/style.css');
  }

  render() {
    const { tags, selectedTag } = this.state;

    if (!tags || tags.length === 0) {
      return `
        <div class="tag-cloud">
          <h3 class="tag-cloud__title">태그</h3>
          <p class="tag-cloud__empty">태그가 없습니다.</p>
        </div>
      `;
    }

    return `
      <div class="tag-cloud">
        <h3 class="tag-cloud__title">태그</h3>
        <div class="tag-cloud__list">
          ${tags.map(tag => `
            <button
              class="tag-cloud__tag ${selectedTag === tag.name ? 'is-active' : ''}"
              data-tag-name="${tag.name}">
              <span class="tag-cloud__tag-name">${tag.name}</span>
              ${tag.count ? `
                <span class="tag-cloud__tag-count">${tag.count}</span>
              ` : ''}
            </button>
          `).join('')}
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
    const tags = this.$$all('.tag-cloud__tag');
    tags.forEach(tag => {
      tag.addEventListener('click', (e) => {
        e.preventDefault();
        const tagName = tag.getAttribute('data-tag-name');
        if (tagName) {
          this.setState({ selectedTag: tagName });
          if (this.onTagClick) {
            this.onTagClick(tagName);
          }
        }
      });
    });
  }

  beforeUnmount() {
    const tags = this.$$all('.tag-cloud__tag');
    tags.forEach(tag => {
      const newTag = tag.cloneNode(true);
      tag.replaceWith(newTag);
    });
  }

  setSelectedTag(tagName) {
    this.setState({ selectedTag: tagName });
  }

  clearSelection() {
    this.setState({ selectedTag: null });
  }
}

export default TagCloud;
