// 게시글 상세 페이지
function PostDetailPage() {
  // TODO: URL에서 게시글 ID 추출
  // TODO: API에서 게시글 상세 정보 가져오기
  const post = {
    id: 1,
    title: '첫 번째 게시글',
    author: '홍길동',
    date: '2025-01-15',
    content: '이것은 게시글 내용입니다. 여기에 더 많은 내용이 들어갈 수 있습니다.',
    likes: 10,
    views: 100
  };

  return `
    <div class="post-detail-page">
      <div class="post-detail-header">
        <h1>${post.title}</h1>
        <div class="post-meta">
          <span class="author">${post.author}</span>
          <span class="date">${post.date}</span>
          <span class="views">조회 ${post.views}</span>
        </div>
      </div>
      <div class="post-content">
        <p>${post.content}</p>
      </div>
      <div class="post-actions">
        <button class="btn-like" id="likeBtn">좋아요 (${post.likes})</button>
        <button class="btn-secondary" id="backBtn">목록으로</button>
      </div>
      <div class="post-comments">
        <h3>댓글</h3>
        <div class="comment-form">
          <textarea placeholder="댓글을 입력하세요" id="commentInput"></textarea>
          <button class="btn-primary" id="submitCommentBtn">댓글 작성</button>
        </div>
        <div class="comment-list">
          <!-- TODO: 댓글 목록 표시 -->
        </div>
      </div>
    </div>
  `;
}

// 게시글 상세 페이지 이벤트 리스너 등록
export function initPostDetailPage() {
  const likeBtn = document.getElementById('likeBtn');
  const backBtn = document.getElementById('backBtn');
  const submitCommentBtn = document.getElementById('submitCommentBtn');

  if (likeBtn) {
    likeBtn.addEventListener('click', () => {
      // TODO: 좋아요 로직 구현
      console.log('좋아요 버튼 클릭됨');
    });
  }

  if (backBtn) {
    backBtn.addEventListener('click', () => {
      window.location.hash = '/posts';
    });
  }

  if (submitCommentBtn) {
    submitCommentBtn.addEventListener('click', () => {
      // TODO: 댓글 작성 로직 구현
      console.log('댓글 작성 버튼 클릭됨');
    });
  }
}

export default PostDetailPage;
