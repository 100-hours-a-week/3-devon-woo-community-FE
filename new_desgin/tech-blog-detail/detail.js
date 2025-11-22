const mockRecommendedPosts = [
    {
        id: 1,
        category: 'D2 NEWS',
        title: 'API 호출식 워업의 부작용을 넘어서 : 라이브러리만 데우는 JVM 워업',
        date: '2025.11.20'
    },
    {
        id: 2,
        category: 'TECH INSIGHT',
        title: 'Telegraf로 커스텀 지표 수집하기: Exporter 개발 경험 공유',
        date: '2025.11.18'
    },
    {
        id: 3,
        category: 'DEVELOPER STORY',
        title: '6개월 만에 연간 수십조를 처리하는 DB CDC 복제 도구 만들기',
        date: '2025.11.15'
    }
];

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

let likeCount = 29;
let isLiked = false;
let commentsList = [...mockComments];

function renderRecommendedPosts() {
    const recommendedList = document.getElementById('recommendedList');

    const html = mockRecommendedPosts.map(post => `
        <div class="recommended-item" onclick="handleRecommendedClick(${post.id})">
            <div class="recommended-item-category">${post.category}</div>
            <div class="recommended-item-title">${post.title}</div>
            <div class="recommended-item-meta">${post.date}</div>
        </div>
    `).join('');

    recommendedList.innerHTML = html;
}

function renderComments() {
    const commentsList = document.getElementById('commentsList');
    const commentCount = document.getElementById('commentCount');

    commentCount.textContent = mockComments.length;

    const html = mockComments.map(comment => `
        <div class="comment-item">
            <div class="comment-avatar">
                <img src="${comment.avatar}" alt="${comment.author}">
            </div>
            <div class="comment-content-wrapper">
                <div class="comment-header">
                    <span class="comment-author">${comment.author}</span>
                    <span class="comment-date">${comment.date}</span>
                </div>
                <div class="comment-text">${comment.text}</div>
                <div class="comment-actions-row">
                    <button class="comment-action-btn ${comment.likes > 0 ? 'liked' : ''}" onclick="handleCommentLike(${comment.id})">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M8 14L7 13.1C3.2 9.68 1 7.72 1 5.5C1 3.72 2.36 2.5 4 2.5C5 2.5 6 3 6.5 3.7C7 3 8 2.5 9 2.5C10.64 2.5 12 3.72 12 5.5C12 7.72 9.8 9.68 6 13.1L5 14Z" stroke="currentColor" stroke-width="1.5" ${comment.likes > 0 ? 'fill="currentColor"' : ''}/>
                        </svg>
                        좋아요
                        ${comment.likes > 0 ? `<span>· ${comment.likes}</span>` : ''}
                    </button>
                    <button class="comment-action-btn" onclick="handleCommentReply(${comment.id})">
                        답글 달기
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    commentsList.innerHTML = html;
}

function handleRecommendedClick(postId) {
    console.log('Recommended post clicked:', postId);
    alert(`추천 게시글 ${postId}번으로 이동합니다.`);
}

function handleLikeClick() {
    const likeBtn = document.getElementById('likeBtn');
    const likeCountEl = document.getElementById('likeCount');

    isLiked = !isLiked;

    if (isLiked) {
        likeCount++;
        likeBtn.classList.add('liked');
    } else {
        likeCount--;
        likeBtn.classList.remove('liked');
    }

    likeCountEl.textContent = likeCount;
}

function handleCommentLike(commentId) {
    const comment = mockComments.find(c => c.id === commentId);
    if (comment) {
        if (comment.likes > 0) {
            comment.likes = 0;
        } else {
            comment.likes = 1;
        }
        renderComments();
    }
}

function handleCommentReply(commentId) {
    console.log('Reply to comment:', commentId);
    alert(`댓글 ${commentId}번에 답글을 작성합니다.`);
}

function handleCommentSubmit() {
    const commentInput = document.getElementById('commentInput');
    const text = commentInput.value.trim();

    if (!text) {
        alert('댓글 내용을 입력해주세요.');
        return;
    }

    const newComment = {
        id: mockComments.length + 1,
        author: '익명 사용자',
        avatar: 'https://via.placeholder.com/48/CCCCCC/666?text=U',
        text: text,
        date: '방금',
        likes: 0
    };

    mockComments.unshift(newComment);
    renderComments();
    commentInput.value = '';

    alert('댓글이 작성되었습니다!');
}

function handleCommentSort() {
    const sortSelect = document.getElementById('sortSelect');
    const sortValue = sortSelect.value;

    if (sortValue === 'latest') {
        mockComments.sort((a, b) => b.id - a.id);
    } else if (sortValue === 'oldest') {
        mockComments.sort((a, b) => a.id - b.id);
    } else if (sortValue === 'likes') {
        mockComments.sort((a, b) => b.likes - a.likes);
    }

    renderComments();
}

function initScrollTopButton() {
    const scrollTopBtn = document.getElementById('scrollTopBtn');

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

function initSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');

    searchBtn.addEventListener('click', () => {
        const query = searchInput.value.trim();
        if (query) {
            console.log('Search query:', query);
            alert(`"${query}"로 검색합니다.`);
        }
    });

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = searchInput.value.trim();
            if (query) {
                console.log('Search query:', query);
                alert(`"${query}"로 검색합니다.`);
            }
        }
    });
}

function init() {
    renderRecommendedPosts();
    renderComments();
    initScrollTopButton();
    initSearch();

    const likeBtn = document.getElementById('likeBtn');
    likeBtn.addEventListener('click', handleLikeClick);

    const submitCommentBtn = document.getElementById('submitCommentBtn');
    submitCommentBtn.addEventListener('click', handleCommentSubmit);

    const sortSelect = document.getElementById('sortSelect');
    sortSelect.addEventListener('change', handleCommentSort);

    const commentInput = document.getElementById('commentInput');
    commentInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            handleCommentSubmit();
        }
    });
}

document.addEventListener('DOMContentLoaded', init);
