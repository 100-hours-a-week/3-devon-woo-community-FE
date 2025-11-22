const profileData = {
    name: 'John Doe',
    handle: 'A passionate developer',
    bio: '',
    stats: {
        posts: 315,
        reviews: 1,
        comments: 0
    },
    isOwner: true
};

const categories = [
    { name: 'Web Development', count: 145 },
    { name: 'Programming', count: 89 },
    { name: 'Data Science', count: 45 },
    { name: 'DevOps', count: 36 }
];

const tags = [
    'JavaScript',
    'React',
    'Python',
    'Docker',
    'CSS',
    'Node.js',
    'TypeScript',
    'Git'
];

const recentPosts = [
    { id: 1, title: 'Understanding React Hooks' },
    { id: 2, title: 'A Guide to Python Generators' },
    { id: 3, title: 'Docker Compose Basics' },
    { id: 4, title: 'CSS Grid Layout Tutorial' },
    { id: 5, title: 'Improving Node.js Performance' }
];

function generateMockPosts(count) {
    const posts = [];
    const postTitles = [
        'Understanding React Hooks',
        'A Guide to Python Generators',
        'Docker Compose Basics',
        'CSS Grid Layout Tutorial',
        'Improving Node.js Performance',
        'Introduction to TypeScript',
        'Building REST APIs with Express',
        'Mastering Git Workflows',
        'JavaScript ES6+ Features',
        'Async/Await in JavaScript'
    ];

    const postExcerpts = [
        'React Hooks provide a way to use state and lifecycle methods in functional components, making code more reusable and easier to understand.',
        "Python's generators are powerful tools for creating memory-efficient iterables that can handle large datasets without loading everything into memory.",
        'Docker Compose simplifies multi-container application management, allowing you to define and run complex applications with a single command.',
        'CSS Grid Layout is a two-dimensional layout system that provides precise control over both rows and columns in your designs.',
        'Learn various techniques to optimize Node.js applications for better performance, including event loop management and caching strategies.'
    ];

    const allTags = [
        ['React', 'JavaScript', 'Web Development'],
        ['Python', 'Programming', 'Data Science'],
        ['Docker', 'DevOps', 'Web Development'],
        ['CSS', 'Web Development'],
        ['Node.js', 'JavaScript', 'Programming']
    ];

    for (let i = 1; i <= count; i++) {
        const titleIndex = (i - 1) % postTitles.length;
        const excerptIndex = (i - 1) % postExcerpts.length;
        const tagsIndex = (i - 1) % allTags.length;

        posts.push({
            id: i,
            title: `${postTitles[titleIndex]} ${i > 10 ? `(Part ${Math.floor(i / 10)})` : ''}`,
            date: `${['April', 'March', 'February', 'January', 'December'][i % 5]} ${10 + (i % 20)}, 2024`,
            excerpt: postExcerpts[excerptIndex],
            tags: allTags[tagsIndex],
            views: Math.floor(Math.random() * 5000) + 100,
            likes: Math.floor(Math.random() * 200) + 10
        });
    }

    return posts;
}

const allPosts = generateMockPosts(50);

const POSTS_PER_PAGE = 5;
let currentPage = 1;
let currentSort = 'latest';

function renderProfile() {
    document.getElementById('profileName').textContent = profileData.name;
    document.getElementById('profileHandle').textContent = profileData.handle;

    if (profileData.bio) {
        document.getElementById('profileBio').textContent = profileData.bio;
    } else {
        document.getElementById('profileBio').style.display = 'none';
    }

    document.getElementById('postCount').textContent = profileData.stats.posts;
    document.getElementById('reviewCount').textContent = profileData.stats.reviews;
    document.getElementById('commentCount').textContent = profileData.stats.comments;

    if (profileData.isOwner) {
        document.getElementById('editProfileBtn').style.display = 'flex';
    }
}

function renderCategories() {
    const categoryList = document.getElementById('categoryList');

    const categoriesHTML = categories.map(category => `
        <li class="category-item">
            <a href="#" onclick="handleCategoryClick('${category.name}'); return false;">
                <span>${category.name}</span>
                <span class="category-count">${category.count}</span>
            </a>
        </li>
    `).join('');

    categoryList.innerHTML = categoriesHTML;
}

function renderTags() {
    const tagCloud = document.getElementById('tagCloud');

    const tagsHTML = tags.map(tag => `
        <a href="#" class="tag-item" onclick="handleTagClick('${tag}'); return false;">
            ${tag}
        </a>
    `).join('');

    tagCloud.innerHTML = tagsHTML;
}

function renderRecentPosts() {
    const recentPostsList = document.getElementById('recentPostsList');

    const recentPostsHTML = recentPosts.map(post => `
        <li class="recent-post-item">
            <a href="#" onclick="handlePostClick(${post.id}); return false;">
                ${post.title}
            </a>
        </li>
    `).join('');

    recentPostsList.innerHTML = recentPostsHTML;
}

function getTotalPages() {
    return Math.ceil(allPosts.length / POSTS_PER_PAGE);
}

function getCurrentPagePosts() {
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    const endIndex = startIndex + POSTS_PER_PAGE;

    let sortedPosts = [...allPosts];

    if (currentSort === 'popular') {
        sortedPosts.sort((a, b) => b.likes - a.likes);
    } else if (currentSort === 'views') {
        sortedPosts.sort((a, b) => b.views - a.views);
    }

    return sortedPosts.slice(startIndex, endIndex);
}

function renderPosts() {
    const postsList = document.getElementById('postsList');
    const posts = getCurrentPagePosts();

    const postsHTML = posts.map((post, index) => `
        <article class="post-card" onclick="handlePostClick(${post.id})">
            <div class="post-card-content">
                <h3 class="post-card-title">${post.title}</h3>
                <div class="post-card-date">${post.date}</div>
                <p class="post-card-excerpt">${post.excerpt}</p>
                <div class="post-card-tags">
                    ${post.tags.map(tag => `<span class="post-tag">${tag}</span>`).join('')}
                </div>
            </div>
            ${index < posts.length - 1 ? '<div class="post-card-divider"></div>' : ''}
        </article>
    `).join('');

    postsList.innerHTML = postsHTML;
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

function initSortButtons() {
    const sortButtons = document.querySelectorAll('.sort-btn');

    sortButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            sortButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            currentSort = btn.dataset.sort;
            currentPage = 1;
            renderPosts();
        });
    });
}

function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');

    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
    }

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');

        sunIcon.style.display = isDark ? 'none' : 'block';
        moonIcon.style.display = isDark ? 'block' : 'none';

        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
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

    const performSearch = () => {
        const query = searchInput.value.trim();
        if (query) {
            console.log('Search query:', query);
            alert(`"${query}"로 검색합니다.`);
        }
    };

    searchBtn.addEventListener('click', performSearch);

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
}

function initPagination() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    prevBtn.addEventListener('click', goToPrevPage);
    nextBtn.addEventListener('click', goToNextPage);
}

function initEditProfile() {
    const editProfileBtn = document.getElementById('editProfileBtn');

    if (editProfileBtn && editProfileBtn.style.display !== 'none') {
        editProfileBtn.addEventListener('click', () => {
            console.log('Edit profile clicked');
            alert('프로필 편집 페이지로 이동합니다.');
        });
    }
}

function handlePostClick(postId) {
    console.log('Post clicked:', postId);
    alert(`게시글 ${postId}번으로 이동합니다.`);
}

function handleCategoryClick(category) {
    console.log('Category clicked:', category);
    alert(`"${category}" 카테고리로 필터링합니다.`);
}

function handleTagClick(tag) {
    console.log('Tag clicked:', tag);
    alert(`"${tag}" 태그로 필터링합니다.`);
}

function init() {
    renderProfile();
    renderCategories();
    renderTags();
    renderRecentPosts();
    renderPosts();
    initSortButtons();
    initPagination();
    initThemeToggle();
    initScrollTopButton();
    initSearch();
    initEditProfile();
}

document.addEventListener('DOMContentLoaded', init);
