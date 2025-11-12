// 앱 초기화 및 라우트 설정
import { createRouter } from './core/Router.js';
import Header from './components/Header/index.js';
import LoginPage from './pages/LoginPage/index.js';
import SignupPage from './pages/SignupPage/index.js';
import PostListPage from './pages/PostListPage/index.js';
import PostCreatePage from './pages/PostCreatePage/index.js';
import PostDetailPage from './pages/PostDetailPage/index.js';
import PostEditPage from './pages/PostEditPage/index.js';
import ProfilePage from './pages/ProfilePage/index.js';
import PasswordChangePage from './pages/PasswordChangePage/index.js';

// App 초기화
function initApp() {
  const app = document.getElementById('app');

  // App 구조 생성
  app.innerHTML = `
    <div id="header"></div>
    <main id="main"></main>
  `;

  // Header 렌더링 (한 번만)
  const header = new Header({
    showBackButton: false,
    showProfileIcon: false  // 초기값을 명시적으로 false로 설정
  });
  const headerContainer = document.getElementById('header');
  header.mount(headerContainer);

  // 전역 Header 참조 (페이지에서 사용)
  window.headerComponent = header;

  // 라우터 생성 및 라우트 등록
  const router = createRouter();
  router.addRoute('/', LoginPage);
  router.addRoute('/login', LoginPage);
  router.addRoute('/signup', SignupPage);
  router.addRoute('/posts', PostListPage);
  router.addRoute('/posts/create', PostCreatePage);
  router.addRoute('/posts/:id', PostDetailPage); // 동적 라우트
  router.addRoute('/posts/:id/edit', PostEditPage); // 동적 라우트
  router.addRoute('/profile', ProfilePage);
  router.addRoute('/password-change', PasswordChangePage);

  // 라우터 초기화
  router.init();

  // 라우트 변경 시 헤더 상태 업데이트
  window.updateHeaderState = updateHeaderState;
  updateHeaderState();
  window.addEventListener('popstate', updateHeaderState);
}

// 헤더 상태 업데이트 함수
function updateHeaderState() {
  const path = window.location.pathname;
  const headerComponent = window.headerComponent;

  if (!headerComponent) return;

  // 현재 페이지 경로만 업데이트 (드롭다운 활성화 상태용)
  headerComponent.setCurrentPage(path);
}

// DOM 로드 후 앱 초기화
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
