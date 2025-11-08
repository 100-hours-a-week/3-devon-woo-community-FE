// 앱 초기화 및 라우트 설정
import Router from './core/Router.js';
import Header from './components/Header/index.js';
import LoginPage from './pages/LoginPage/index.js';
import SignupPage from './pages/SignupPage/index.js';
import PostListPage from './pages/PostListPage/index.js';
import PostCreatePage from './pages/PostCreatePage/index.js';

// App 초기화
function initApp() {
  const app = document.getElementById('app');

  // App 구조 생성
  app.innerHTML = `
    <div id="header"></div>
    <main id="main"></main>
  `;

  // Header 렌더링 (한 번만)
  const header = new Header({ showBackButton: false });
  const headerContainer = document.getElementById('header');
  header.mount(headerContainer);

  // 전역 Header 참조 (페이지에서 사용)
  window.headerComponent = header;

  // 라우터 생성 및 라우트 등록
  const router = new Router();
  router.addRoute('/', LoginPage);
  router.addRoute('/login', LoginPage);
  router.addRoute('/signup', SignupPage);
  router.addRoute('/posts', PostListPage);
  router.addRoute('/posts/create', PostCreatePage);

  // 라우터 초기화
  router.init();

  // 전역 라우터 참조 (컴포넌트에서 사용)
  window.router = router;
}

// DOM 로드 후 앱 초기화
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
