const authors = [
    'D2 Coding Team',
    'NAVER Labs',
    'FE Platform',
    'Backend Dev',
    'Data Science Team',
    'Cloud Platform',
    'Security Team',
    'DevOps Team'
];

function generateMockPosts(count) {
    const posts = [];
    const categories = ['NAVER ENGINEERING DAY 2025', 'D2 NEWS', 'TECH INSIGHT', 'DEVELOPER STORY'];
    const gradients = ['gradient-1', 'gradient-2', 'gradient-3', 'gradient-4'];

    for (let i = 1; i <= count; i++) {
        posts.push({
            id: i,
            category: categories[Math.floor(Math.random() * categories.length)],
            title: `기술 블로그 게시글 제목 ${i}번 - 혁신적인 기술과 개발 경험 공유`,
            excerpt: `네이버 사내 기술 교류 행사인 NAVER ENGINEERING DAY 2025(10월)에서 발표되었던 세션을 공개합니다. 발표 내용과 기술적 인사이트를 공유하며, 실무에 적용할 수 있는 다양한 팁과 노하우를 소개합니다.`,
            date: `2025.11.${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
            author: authors[Math.floor(Math.random() * authors.length)],
            views: String(Math.floor(Math.random() * 5000) + 100),
            thumbnail: `Tech Post\n#${i}`,
            gradientClass: gradients[(i - 1) % 4]
        });
    }

    return posts;
}

const allPosts = generateMockPosts(100);

const POSTS_PER_PAGE = 20;
let currentPage = 1;

const mockTopPosts = [
    { id: 1, title: '[무물보] 좋다하라, 백엔드 개발자를 꿈꾸는 학생에게' },
    { id: 2, title: '6개월 만에 연간 수십조를 처리하는 DB CDC 복제 도구 만들기' },
    { id: 3, title: '처음 만나는 OpenTelemetry (feat. 분산추적)' },
    { id: 4, title: '[FE Ground] AI x Front-End: 코딩 생산성 향상을 위한 도구' },
    { id: 5, title: '시로 E2E 테스트를 적어냈다: MAFT' }
];

const mockKeywords = [
    '빅데이터',
    '분산처리',
    'Golang',
    'Scala',
    'kafka',
    'TensorFlow'
];

function getTotalPages() {
    return Math.ceil(allPosts.length / POSTS_PER_PAGE);
}

function getCurrentPagePosts() {
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    const endIndex = startIndex + POSTS_PER_PAGE;
    return allPosts.slice(startIndex, endIndex);
}

function renderPosts() {
    const postList = document.getElementById('postList');
    const posts = getCurrentPagePosts();

    const postsHTML = posts.map(post => `
        <article class="post-item" onclick="handlePostClick(${post.id})">
            <div class="post-content">
                <div class="post-category">${post.category}</div>
                <h2 class="post-title">${post.title}</h2>
                <p class="post-excerpt">${post.excerpt}</p>
                <div class="post-meta">
                    <span class="post-date">${post.date}</span>
                    <span class="post-divider">·</span>
                    <span class="post-author">${post.author}</span>
                    <span class="post-divider">·</span>
                    <span class="post-views">${post.views}</span>
                </div>
            </div>
            <div class="post-thumbnail ${post.gradientClass}">
                ${post.thumbnail}
            </div>
        </article>
    `).join('');

    postList.innerHTML = postsHTML;
    renderPagination();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderPagination() {
    const totalPages = getTotalPages();
    const paginationNumbers = document.getElementById('paginationNumbers');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;

    const pageButtons = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
        pageButtons.push(`<button class="pagination-number" onclick="goToPage(1)">1</button>`);
        if (startPage > 2) {
            pageButtons.push(`<div class="pagination-ellipsis">...</div>`);
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        const activeClass = i === currentPage ? 'active' : '';
        pageButtons.push(`<button class="pagination-number ${activeClass}" onclick="goToPage(${i})">${i}</button>`);
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            pageButtons.push(`<div class="pagination-ellipsis">...</div>`);
        }
        pageButtons.push(`<button class="pagination-number" onclick="goToPage(${totalPages})">${totalPages}</button>`);
    }

    paginationNumbers.innerHTML = pageButtons.join('');
}

function goToPage(page) {
    const totalPages = getTotalPages();
    if (page < 1 || page > totalPages) return;
    currentPage = page;
    renderPosts();
}

function goToPrevPage() {
    if (currentPage > 1) {
        currentPage--;
        renderPosts();
    }
}

function goToNextPage() {
    const totalPages = getTotalPages();
    if (currentPage < totalPages) {
        currentPage++;
        renderPosts();
    }
}

function renderTopPosts() {
    const topList = document.getElementById('topList');

    const topPostsHTML = mockTopPosts.map(post => `
        <li class="top-item">
            <a href="#" onclick="handleTopPostClick(${post.id}); return false;">
                ${post.title}
            </a>
        </li>
    `).join('');

    topList.innerHTML = topPostsHTML;
}

function renderKeywords() {
    const keywordTags = document.getElementById('keywordTags');

    const keywordsHTML = mockKeywords.map(keyword => `
        <a href="#" class="keyword-tag" onclick="handleKeywordClick('${keyword}'); return false;">
            ${keyword}
        </a>
    `).join('');

    keywordTags.innerHTML = keywordsHTML;
}

function handlePostClick(postId) {
    console.log('Post clicked:', postId);
    alert(`게시글 ${postId}번으로 이동합니다.`);
}

function handleTopPostClick(postId) {
    console.log('Top post clicked:', postId);
    alert(`인기 게시글 ${postId}번으로 이동합니다.`);
}

function handleKeywordClick(keyword) {
    console.log('Keyword clicked:', keyword);
    alert(`"${keyword}" 키워드로 검색합니다.`);
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

function initNewsletter() {
    const newsletterBtn = document.querySelector('.newsletter-btn');
    const newsletterInput = document.querySelector('.newsletter-input');

    newsletterBtn.addEventListener('click', () => {
        const email = newsletterInput.value.trim();
        if (email) {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailPattern.test(email)) {
                console.log('Newsletter subscription:', email);
                alert(`${email}로 구독 신청되었습니다!`);
                newsletterInput.value = '';
            } else {
                alert('올바른 이메일 주소를 입력해주세요.');
            }
        } else {
            alert('이메일 주소를 입력해주세요.');
        }
    });

    newsletterInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            newsletterBtn.click();
        }
    });
}

function initPagination() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    prevBtn.addEventListener('click', goToPrevPage);
    nextBtn.addEventListener('click', goToNextPage);
}

function init() {
    renderPosts();
    renderTopPosts();
    renderKeywords();
    initPagination();
    initScrollTopButton();
    initSearch();
    initNewsletter();
}

document.addEventListener('DOMContentLoaded', init);
