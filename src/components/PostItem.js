// 게시글 아이템 컴포넌트
function PostItem(post) {
  return `
    <div class="post-item" data-id="${post.id}">
      <h3 class="post-title">${post.title}</h3>
      <div class="post-info">
        <span class="post-author">${post.author}</span>
        <span class="post-date">${post.date}</span>
        <span class="post-likes">좋아요 ${post.likes}</span>
      </div>
    </div>
  `;
}

export default PostItem;
