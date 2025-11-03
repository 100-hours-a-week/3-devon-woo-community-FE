import PostItem from '../components/PostItem.js';

// 게시글 리스트 페이지
function PostListPage() {
  // TODO: API에서 게시글 목록 가져오기
  const posts = [
    { id: 1, title: '첫 번째 게시글', author: '홍길동', date: '2025-01-15', likes: 10 },
    { id: 2, title: '두 번째 게시글', author: '김철수', date: '2025-01-14', likes: 5 },
    { id: 3, title: '세 번째 게시글', author: '이영희', date: '2025-01-13', likes: 8 },
  ];

  const postListHtml = posts.map(post => PostItem(post)).join('');

  return `
    <div class="post-list-page">
      <div class="post-list-header">
        <h1>게시글 목록</h1>
        <button class="btn-primary" id="writePostBtn">글쓰기</button>
      </div>
      <div class="post-list">
        ${postListHtml}
      </div>
    </div>
  `;
}

// 게시글 리스트 페이지 이벤트 리스너 등록
export function initPostListPage() {
  const writeBtn = document.getElementById('writePostBtn');

  if (writeBtn) {
    writeBtn.addEventListener('click', () => {
      // TODO: 글쓰기 페이지로 이동
      console.log('글쓰기 버튼 클릭됨');
    });
  }

  // 게시글 클릭 이벤트
  const postItems = document.querySelectorAll('.post-item');
  postItems.forEach(item => {
    item.addEventListener('click', () => {
      const postId = item.dataset.id;
      window.location.hash = `/posts/${postId}`;
    });
  });
}

export default PostListPage;
