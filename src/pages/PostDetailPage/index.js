import Component from '../../core/Component.js';
import Header from '../../components/Header/index.js';
import { getPostById, getRecommendedPosts } from '../../api/posts.js';
import { getComments, createComment } from '../../api/comments.js';
import { navigate } from '../../core/Router.js';
import { parseMarkdown } from '../../utils/markdown.js';
import CommentWrite from '../../components/comment/CommentWrite/index.js';
import CommentList from '../../components/comment/CommentList/index.js';

class PostDetailPage extends Component {
  constructor(props = {}) {
    super(props);

    this.state = {
      post: null,
      isLoading: true,
      likeCount: 0,
      isLiked: false,
      recommendedPosts: [],
      comments: []
    };

    this.postId = props.id || props.postId;
    this.loadStyle('/src/pages/PostDetailPage/style.css');
    this._eventsBound = false;
    this.commentWriteComponent = null;
    this.commentListComponent = null;
  }

  render() {
    const { post, isLoading, likeCount, isLiked, recommendedPosts } = this.state;

    if (isLoading) {
      return `
        <div class="post-detail-page">
          <main class="post-detail-main">
            <div style="text-align: center; padding: 60px 0; color: #999;">
              게시글을 불러오는 중...
            </div>
          </main>
        </div>
      `;
    }

    if (!post) {
      return `
        <div class="post-detail-page">
          <main class="post-detail-main">
            <div style="text-align: center; padding: 60px 0; color: #999;">
              게시글을 찾을 수 없습니다.
            </div>
          </main>
        </div>
      `;
    }

    return `
      <div class="post-detail-page">
        <main class="post-detail-main">
          <article class="post-detail">
            <div class="post-header">
              <div class="post-category">${post.category || 'TECH INSIGHT'}</div>
              <h1 class="post-title">${post.title}</h1>
              <div class="post-meta">
                <span class="post-author">${post.author}</span>
                <span class="post-divider">|</span>
                <span class="post-date">${this.formatDate(post.date)}</span>
              </div>
              <div class="post-actions">
                <button class="like-btn ${isLiked ? 'liked' : ''}" id="likeBtn">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10 17.5L8.5 16.2C4 12.1 1 9.4 1 6.1C1 3.4 3.1 1.3 5.8 1.3C7.3 1.3 8.8 2 10 3.1C11.2 2 12.7 1.3 14.2 1.3C16.9 1.3 19 3.4 19 6.1C19 9.4 16 12.1 11.5 16.2L10 17.5Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <span id="likeCount">${likeCount}</span>
                </button>
              </div>
            </div>

            ${post.thumbnail ? `
              <div class="post-thumbnail">
                <img src="${post.thumbnail}" alt="게시글 썸네일">
              </div>
            ` : ''}

            <div class="post-content" id="postContent">
              ${post.contentHtml || '<p>게시글 내용이 없습니다.</p>'}
            </div>
          </article>

          <section class="recommended-posts">
            <h3 class="section-title">추천 게시글</h3>
            <div class="recommended-list" id="recommendedList">
              ${this.renderRecommendedPosts()}
            </div>
          </section>

          <div id="commentWriteContainer"></div>
          <div id="commentListContainer"></div>
        </main>

        <button class="scroll-top-btn" id="scrollTopBtn">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M18 15l-6-6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    `;
  }

  renderRecommendedPosts() {
    const { recommendedPosts } = this.state;

    if (recommendedPosts.length === 0) {
      return '<div style="text-align: center; color: #999; padding: 20px;">추천 게시글이 없습니다.</div>';
    }

    return recommendedPosts.map(post => `
      <div class="recommended-item" data-post-id="${post.id}">
        <div class="recommended-item-category">${post.category || 'TECH INSIGHT'}</div>
        <div class="recommended-item-title">${post.title}</div>
        <div class="recommended-item-meta">${this.formatDate(post.date)}</div>
      </div>
    `).join('');
  }

  async mounted() {
    await this.$nextTick();

    await this.loadPost();
    await this.loadRecommendedPosts();
    await this.loadComments();

    this.renderCommentComponents();
    this.setupEventListeners();
    this.initScrollTopButton();
  }

  renderCommentComponents() {
    const writeContainer = this.$$('#commentWriteContainer');
    const listContainer = this.$$('#commentListContainer');

    if (!writeContainer || !listContainer) return;

    if (!this.commentWriteComponent) {
      this.commentWriteComponent = new CommentWrite({
        onSubmit: async (text) => {
          await this.handleCommentSubmit(text);
        }
      });
      this.commentWriteComponent.mount(writeContainer);
    }

    if (!this.commentListComponent) {
      this.commentListComponent = new CommentList({
        comments: this.state.comments,
        onLike: (commentId, isLiked) => this.handleCommentLike(commentId, isLiked),
        onReply: (commentId) => this.handleCommentReply(commentId),
        onSortChange: (sortBy) => this.handleCommentSort(sortBy)
      });
      this.commentListComponent.mount(listContainer);
    } else {
      this.commentListComponent.setState({ comments: this.state.comments });
    }
  }

  async loadComments() {
    try {
      const response = await getComments(this.postId, {
        page: 0,
        size: 100,
        sort: 'createdAt,asc'
      });

      this.setState({ comments: response.items });
    } catch (error) {
      console.error('Failed to load comments:', error);
    }
  }

  $nextTick() {
    return new Promise(resolve => setTimeout(resolve, 0));
  }

  async loadPost() {
    this.setState({ isLoading: true });

    try {
      const response = await getPostById(this.postId);

      const post = {
        id: response.postId,
        title: response.title,
        contentMarkdown: response.content,
        contentHtml: parseMarkdown(response.content || ''),
        category: 'TECH INSIGHT',
        author: response.member?.nickname || 'Anonymous',
        date: response.createdAt,
        thumbnail: response.imageUrl || 'https://via.placeholder.com/800x450/E8F5E9/4CAF50?text=Tech+Blog',
        views: response.viewCount || 0
      };

      this.setState({
        post,
        likeCount: response.likeCount || 0,
        isLoading: false
      });
    } catch (error) {
      console.error('Failed to load post:', error);
      this.loadMockPost();
    }
  }

  async loadRecommendedPosts() {
    try {
      const recommendations = await getRecommendedPosts(this.postId);

      const recommendedPosts = recommendations.map(post => ({
        id: post.postId,
        title: post.title,
        category: 'TECH INSIGHT',
        date: post.createdAt
      }));

      this.setState({ recommendedPosts });
    } catch (error) {
      console.error('Failed to load recommended posts:', error);
    }
  }

  loadMockPost() {
    const mockMarkdown = `# 마크다운으로 작성된 샘플 포스트

복잡한 에디터 없이 **간단한 마크다운**으로도 충분히 구성할 수 있습니다.

## 1. 왜 마크다운인가?
- 텍스트 기반
- 버전 관리에 용이
- 협업 툴과 높은 호환성

> "텍스트는 코드다." 라는 말이 있듯이, 마크다운은 문서를 코드처럼 다루게 해 줍니다.

### 코드 블록
\`\`\`js
function greet(name) {
  return \`안녕하세요, \${name}님!\`;
}
\`\`\`

### 이미지
![Mock](https://via.placeholder.com/960x480/F5F7FB/111?text=Markdown+Preview)

---

표준 HTML 태그와 섞여도 안전하게 렌더링되도록 파싱하고 있습니다.`;

    const post = {
      id: 'mock',
      title: '마크다운 샘플 게시글',
      contentMarkdown: mockMarkdown,
      contentHtml: parseMarkdown(mockMarkdown),
      category: 'TECH INSIGHT',
      author: 'Mock Writer',
      date: new Date().toISOString(),
      thumbnail: 'https://via.placeholder.com/800x450/EEF2FF/4B5BDC?text=Markdown+Mock',
      views: 123
    };

    this.setState({
      post,
      likeCount: 12,
      isLoading: false
    });
  }


  formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}년 ${month}월 ${day}일`;
  }

  setupEventListeners() {
    if (this._eventsBound) return;
    this._eventsBound = true;

    this.delegate('click', '#likeBtn', () => this.handleLikeClick());

    this.delegate('click', '#recommendedList .recommended-item', (e) => {
      const item = e.target.closest('.recommended-item');
      if (item) {
        const postId = item.dataset.postId;
        this.handleRecommendedClick(postId);
      }
    });
  }

  handleLikeClick() {
    const { isLiked, likeCount } = this.state;

    this.setState({
      isLiked: !isLiked,
      likeCount: isLiked ? likeCount - 1 : likeCount + 1
    });
  }

  async handleCommentSubmit(text) {
    try {
      const CommentCreateRequest = (await import('../dto/request/comment/CommentCreateRequest.js')).default;
      const commentData = new CommentCreateRequest({
        memberId: 1,
        content: text
      });

      await createComment(this.postId, commentData);
      await this.loadComments();

      if (this.commentListComponent) {
        this.commentListComponent.setState({ comments: this.state.comments });
      }
    } catch (error) {
      console.error('Failed to create comment:', error);
      throw error;
    }
  }

  handleCommentSort(sortBy) {
    const { comments } = this.state;
    let sortedComments = [...comments];

    if (sortBy === 'latest') {
      sortedComments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === 'oldest') {
      sortedComments.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    this.setState({ comments: sortedComments });

    if (this.commentListComponent) {
      this.commentListComponent.setState({ comments: sortedComments });
    }
  }

  handleCommentLike(commentId, isLiked) {
    console.log(`Comment ${commentId} ${isLiked ? 'liked' : 'unliked'}`);
  }

  handleCommentReply(commentId) {
    alert(`댓글 ${commentId}번에 답글을 작성합니다.`);
  }

  handleRecommendedClick(postId) {
    navigate(`/posts/${postId}`);
  }

  initScrollTopButton() {
    const scrollTopBtn = this.$$('#scrollTopBtn');
    if (!scrollTopBtn) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    });

    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  beforeUnmount() {
    if (this.commentWriteComponent && this.commentWriteComponent._isMounted) {
      this.commentWriteComponent.unmount();
    }
    if (this.commentListComponent && this.commentListComponent._isMounted) {
      this.commentListComponent.unmount();
    }
  }
}

export default PostDetailPage;
