// 앱 초기화 및 라우트 설정
import { createRouter } from './core/Router.js';
import Header from './components/Header/index.js';
import LoginPage from './pages/LoginPage/index.js';
import SignupPage from './pages/SignupPage/index.js';
import BlogListPage from './pages/BlogListPage/index.js';
import PostCreatePage from './pages/PostCreatePage/index.js';
import PostDetailPage from './pages/PostDetailPage/index.js';
import ProfilePage from './pages/ProfilePage/index.js';
import ProfileEditPage from './pages/ProfileEditPage/index.js';
import PostPublishPage from './pages/PostPublishPage/index.js';
import { registerHeader, syncHeaderWithRoute } from './services/HeaderService.js';

// App 초기화
function initApp() {
  console.log('initApp called');
  const app = document.getElementById('app');

  if (!app) {
    console.error('App container not found');
    return;
  }

  // App 구조 생성
  app.innerHTML = `
    <div id="header"></div>
    <main id="main"></main>
  `;

  console.log('App structure created');

  // Header 렌더링 (한 번만)
  const header = new Header({
    showBackButton: false,
    showProfileIcon: false
  });
  const headerContainer = document.getElementById('header');
  header.mount(headerContainer);

  console.log('Global header mounted');

  registerHeader(header);

  // 라우터 생성 및 라우트 등록
  const router = createRouter();
  console.log('Router created');

  router.addRoute('/', BlogListPage);
  router.addRoute('/login', LoginPage);
  router.addRoute('/signup', SignupPage);
  router.addRoute('/posts', BlogListPage);
  router.addRoute('/posts/create', PostCreatePage);
  router.addRoute('/posts/publish', PostPublishPage);
  router.addRoute('/posts/:id', PostDetailPage);
  router.addRoute('/profile', ProfilePage);
  router.addRoute('/profile/edit', ProfileEditPage);

  console.log('Routes registered');

  // 라우터 초기화
  router.init();
  console.log('Router initialized');

  // 라우트 변경 시 헤더 상태 업데이트
  const handleHeaderSync = () => syncHeaderWithRoute(window.location.pathname);
  handleHeaderSync();
  window.addEventListener('popstate', handleHeaderSync);
}

// DOM 로드 후 앱 초기화
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
