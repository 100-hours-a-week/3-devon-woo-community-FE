// 상태 관리
const state = {
    posts: [],
    currentPage: 1,
    isLoading: false,
    hasMore: true,
    pageSize: 10
};

// DOM 요소
const elements = {
    postListContainer: document.querySelector('.post-list-container'),
    loadingSpinner: document.querySelector('.loading-spinner'),
    emptyMessage: document.querySelector('.empty-message'),
    scrollObserver: document.querySelector('.scroll-observer'),
    createPostBtn: document.querySelector('.create-post-btn')
};

// 유틸리티 함수: 숫자를 k 단위로 변환
function formatCount(count) {
    if (count >= 100000) {
        return Math.floor(count / 1000) + 'k';
    } else if (count >= 10000) {
        return Math.floor(count / 1000) + 'k';
    } else if (count >= 1000) {
        return (count / 1000).toFixed(1) + 'k';
    }
    return count.toString();
}

// 유틸리티 함수: 날짜 포맷팅
function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// 유틸리티 함수: 제목 26자 제한
function truncateTitle(title, maxLength = 26) {
    if (title.length > maxLength) {
        return title.substring(0, maxLength);
    }
    return title;
}

// 게시글 카드 생성
function createPostCard(post) {
    const card = document.createElement('div');
    card.className = 'post-card';
    card.dataset.postId = post.id;

    card.innerHTML = `
        <div class="post-card-header">
            <h2 class="post-card-title">${truncateTitle(post.title)}</h2>
            <span class="post-card-date">${formatDate(post.createdAt)}</span>
        </div>
        <div class="post-card-stats">
            <span class="post-card-stat">좋아요 ${formatCount(post.likeCount)}</span>
            <span class="post-card-stat">댓글 ${formatCount(post.commentCount)}</span>
            <span class="post-card-stat">조회수 ${formatCount(post.viewCount)}</span>
        </div>
        <div class="post-card-footer">
            <div class="dummy-profile"></div>
            <span class="dummy-comment">더미 작성자 1</span>
        </div>
    `;

    // 카드 클릭 이벤트
    card.addEventListener('click', () => {
        handlePostCardClick(post.id);
    });

    return card;
}

// 게시글 카드 클릭 핸들러
function handlePostCardClick(postId) {
    // TODO: 상세 페이지로 이동
    console.log(`Navigate to /posts/${postId}`);
    // window.location.href = `/posts/${postId}`;
}

// 게시글 목록 렌더링
function renderPosts(posts) {
    posts.forEach(post => {
        const card = createPostCard(post);
        elements.postListContainer.appendChild(card);
    });
}

// 로딩 상태 표시
function showLoading() {
    elements.loadingSpinner.style.display = 'flex';
}

function hideLoading() {
    elements.loadingSpinner.style.display = 'none';
}

// 빈 목록 메시지 표시
function showEmptyMessage() {
    elements.emptyMessage.style.display = 'block';
}

function hideEmptyMessage() {
    elements.emptyMessage.style.display = 'none';
}

// API: 게시글 목록 조회
async function fetchPosts(page = 1) {
    // TODO: 실제 API 호출 구현
    // 임시 더미 데이터 반환
    return new Promise((resolve) => {
        setTimeout(() => {
            const mockPosts = Array.from({ length: 10 }, (_, index) => ({
                id: (page - 1) * 10 + index + 1,
                title: `제목 ${(page - 1) * 10 + index + 1}`,
                createdAt: '2021-01-01T00:00:00',
                viewCount: Math.floor(Math.random() * 100000),
                commentCount: Math.floor(Math.random() * 1000),
                likeCount: Math.floor(Math.random() * 10000)
            }));

            resolve({
                posts: mockPosts,
                hasMore: page < 5 // 5페이지까지만 데이터 있다고 가정
            });
        }, 500);
    });

    /*
    // 실제 API 호출 예시
    try {
        const response = await fetch(`/api/posts?page=${page}&size=${state.pageSize}`);
        if (!response.ok) {
            throw new Error('Failed to fetch posts');
        }
        const data = await response.json();
        return {
            posts: data.posts,
            hasMore: data.hasMore || data.nextCursor !== null
        };
    } catch (error) {
        console.error('Error fetching posts:', error);
        throw error;
    }
    */
}

// 게시글 로드
async function loadPosts() {
    // 중복 요청 방지
    if (state.isLoading || !state.hasMore) {
        return;
    }

    state.isLoading = true;
    showLoading();

    try {
        const { posts, hasMore } = await fetchPosts(state.currentPage);

        if (posts.length === 0 && state.posts.length === 0) {
            showEmptyMessage();
        } else {
            hideEmptyMessage();
            state.posts.push(...posts);
            renderPosts(posts);
            state.currentPage++;
            state.hasMore = hasMore;
        }
    } catch (error) {
        console.error('Error loading posts:', error);
        alert('게시글을 불러오는 중 오류가 발생했습니다.');
    } finally {
        state.isLoading = false;
        hideLoading();
    }
}

// 무한 스크롤 구현 (IntersectionObserver)
function initInfiniteScroll() {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !state.isLoading && state.hasMore) {
                    loadPosts();
                }
            });
        },
        {
            root: null,
            rootMargin: '100px',
            threshold: 0.1
        }
    );

    observer.observe(elements.scrollObserver);
}

// 게시글 작성 버튼 클릭 핸들러
function handleCreatePostClick() {
    // TODO: 게시글 작성 페이지로 이동
    console.log('Navigate to /posts/create');
    // window.location.href = '/posts/create';
}

// 이벤트 리스너 등록
function initEventListeners() {
    elements.createPostBtn.addEventListener('click', handleCreatePostClick);
}

// 초기화
async function init() {
    initEventListeners();
    initInfiniteScroll();

    // 초기 데이터 로드
    await loadPosts();
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', init);
