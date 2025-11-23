import Component from '../../core/Component.js';
import Header from '../../components/Header/index.js';
import { getPostById, getPosts } from '../../api/posts.js';
import { navigate } from '../../core/Router.js';
import { parseMarkdown } from '../../utils/markdown.js';

class PostDetailPage extends Component {
  constructor(props = {}) {
    super(props);

    this.state = {
      post: null,
      isLoading: true,
      likeCount: 0,
      isLiked: false,
      recommendedPosts: [],
      comments: [],
      commentText: ''
    };

    this.postId = props.id || props.postId;
    this.loadStyle('/src/pages/PostDetailPage/style.css');
    this._eventsBound = false;
  }

  render() {
    const { post, isLoading, likeCount, isLiked, recommendedPosts, comments, commentText } = this.state;

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

          <section class="comments-section">
            <div class="comments-header">
              <h3 class="section-title">댓글 <span id="commentCount">${comments.length}</span>개</h3>
              <div class="comments-sort">
                <label for="sortSelect">정렬 기준</label>
                <select id="sortSelect" class="sort-select">
                  <option value="latest">날짜 오름차순</option>
                  <option value="oldest">날짜 내림차순</option>
                  <option value="likes">좋아요순</option>
                </select>
              </div>
            </div>

            <div class="comment-write">
              <div class="comment-avatar">
                <img src="https://via.placeholder.com/48/CCCCCC/666?text=U" alt="프로필">
              </div>
              <div class="comment-input-wrapper">
                <textarea
                  id="commentInput"
                  class="comment-textarea"
                  placeholder="댓글 달기..."
                  rows="3"
                >${commentText}</textarea>
                <div class="comment-actions-bottom">
                  <button class="comment-submit-btn" id="submitCommentBtn">댓글 작성</button>
                </div>
              </div>
            </div>

            <div class="comments-list" id="commentsList">
              ${this.renderComments()}
            </div>
          </section>
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

  renderComments() {
    const { comments } = this.state;

    if (comments.length === 0) {
      return '<div style="text-align: center; color: #999; padding: 40px 0;">댓글이 없습니다.</div>';
    }

    return comments.map(comment => `
      <div class="comment-item">
        <div class="comment-avatar">
          <img src="${comment.avatar || 'https://via.placeholder.com/48/CCCCCC/666?text=U'}" alt="${comment.author}">
        </div>
        <div class="comment-content-wrapper">
          <div class="comment-header">
            <span class="comment-author">${comment.author}</span>
            <span class="comment-date">${comment.date}</span>
          </div>
          <div class="comment-text">${comment.text}</div>
          <div class="comment-actions-row">
            <button class="comment-action-btn ${comment.likes > 0 ? 'liked' : ''}" data-comment-id="${comment.id}" data-action="like">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 14L7 13.1C3.2 9.68 1 7.72 1 5.5C1 3.72 2.36 2.5 4 2.5C5 2.5 6 3 6.5 3.7C7 3 8 2.5 9 2.5C10.64 2.5 12 3.72 12 5.5C12 7.72 9.8 9.68 6 13.1L5 14Z" stroke="currentColor" stroke-width="1.5" ${comment.likes > 0 ? 'fill="currentColor"' : ''}/>
              </svg>
              좋아요
              ${comment.likes > 0 ? `<span>· ${comment.likes}</span>` : ''}
            </button>
            <button class="comment-action-btn" data-comment-id="${comment.id}" data-action="reply">
              답글 달기
            </button>
          </div>
        </div>
      </div>
    `).join('');
  }

  async mounted() {
    await this.$nextTick();

    await this.loadPost();
    await this.loadRecommendedPosts();
    this.loadMockComments();

    this.setupEventListeners();
    this.initScrollTopButton();
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
      const response = await getPosts({
        page: 0,
        size: 3
      });

      const recommendedPosts = response.items.map(post => ({
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

  loadMockComments() {
    const mockComments = [
      {
        id: 1,
        author: '배태준',
        avatar: 'https://via.placeholder.com/48/FF6B6B/FFF?text=배',
        text: '언제 읽어도 좋은 글이네요. 감사합니다~!',
        date: '4년',
        likes: 0
      },
      {
        id: 2,
        author: '조백규',
        avatar: 'https://via.placeholder.com/48/4ECDC4/FFF?text=조',
        text: `옥시 모듈의 버전관리는 어떻게 하셨었나요?
spring같은 경우는 전체 모듈이 동일하게 version이 올라가는 형태인데요.
동일하게 버전을 관리하는 경우에는 멀티모듈 프로젝트에 있는 a, b 시스템 중 a 시스템의 버그로 인해 패치되는 경우 a, b 모두 버전이 올라가버리는 현상이 발생하는데요..
또한 b 시스템은 수정이 안되어도 항상 최신버전을 유지하기 위해 같이 배포를 해줘야하는 상황이 발생할 것 같아서요.`,
        date: '4년',
        likes: 1
      },
      {
        id: 3,
        author: 'WooSeok Park',
        avatar: 'https://via.placeholder.com/48/95E1D3/FFF?text=W',
        text: '좋은 내용 감사합니다.',
        date: '4년',
        likes: 1
      },
      {
        id: 4,
        author: '최준현',
        avatar: 'https://via.placeholder.com/48/F38181/FFF?text=최',
        text: '잘봤습니다~',
        date: '6년',
        likes: 0
      }
    ];

    this.setState({ comments: mockComments });
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

    this.delegate('click', '#submitCommentBtn', () => this.handleCommentSubmit());

    this.delegate('change', '#sortSelect', (e) => this.handleCommentSort(e.target.value));

    this.delegate('keydown', '#commentInput', (e) => {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        this.handleCommentSubmit();
      }
    });

    this.delegate('input', '#commentInput', (e) => {
      this.state.commentText = e.target.value;
    });

    this.delegate('click', '#recommendedList .recommended-item', (e) => {
      const item = e.target.closest('.recommended-item');
      if (item) {
        const postId = item.dataset.postId;
        this.handleRecommendedClick(postId);
      }
    });

    this.delegate('click', '#commentsList .comment-action-btn', (e) => {
      const btn = e.target.closest('.comment-action-btn');
      if (btn) {
        const commentId = parseInt(btn.dataset.commentId, 10);
        const action = btn.dataset.action;

        if (action === 'like') {
          this.handleCommentLike(commentId);
        } else if (action === 'reply') {
          this.handleCommentReply(commentId);
        }
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

  handleCommentSubmit() {
    const commentInput = this.$$('#commentInput');
    const text = commentInput.value.trim();

    if (!text) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }

    const newComment = {
      id: this.state.comments.length + 1,
      author: '익명 사용자',
      avatar: 'https://via.placeholder.com/48/CCCCCC/666?text=U',
      text: text,
      date: '방금',
      likes: 0
    };

    this.setState({
      comments: [newComment, ...this.state.comments],
      commentText: ''
    });

    alert('댓글이 작성되었습니다!');
  }

  handleCommentSort(sortValue) {
    const { comments } = this.state;
    let sortedComments = [...comments];

    if (sortValue === 'latest') {
      sortedComments.sort((a, b) => b.id - a.id);
    } else if (sortValue === 'oldest') {
      sortedComments.sort((a, b) => a.id - b.id);
    } else if (sortValue === 'likes') {
      sortedComments.sort((a, b) => b.likes - a.likes);
    }

    this.setState({ comments: sortedComments });
  }

  handleCommentLike(commentId) {
    const { comments } = this.state;
    const updatedComments = comments.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          likes: comment.likes > 0 ? 0 : 1
        };
      }
      return comment;
    });

    this.setState({ comments: updatedComments });
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
  }
}

export default PostDetailPage;
