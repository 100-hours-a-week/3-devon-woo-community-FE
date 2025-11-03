import Router from './router/router.js';
import Header from './components/Header.js';
import Footer from './components/Footer.js';
import LoginPage, { initLoginPage } from './pages/LoginPage.js';
import PostListPage, { initPostListPage } from './pages/PostListPage.js';
import PostDetailPage, { initPostDetailPage } from './pages/PostDetailPage.js';
import ProfilePage, { initProfilePage } from './pages/ProfilePage.js';

// 앱 초기화
class App {
  constructor() {
    this.app = document.getElementById('app');
    this.router = null;
    this.init();
  }

  init() {
    this.setupRouter();
  }

  setupRouter() {
    const routes = {
      '/': () => this.render(PostListPage, initPostListPage),
      '/login': () => this.render(LoginPage, initLoginPage),
      '/posts': () => this.render(PostListPage, initPostListPage),
      '/posts/:id': () => this.render(PostDetailPage, initPostDetailPage),
      '/profile': () => this.render(ProfilePage, initProfilePage),
    };

    this.router = new Router(routes);
  }

  render(PageComponent, initFunction) {
    const header = Header();
    const page = PageComponent();
    const footer = Footer();

    this.app.innerHTML = `
      ${header}
      <main>
        ${page}
      </main>
      ${footer}
    `;

    // 페이지 로드 후 이벤트 리스너 등록
    if (initFunction) {
      initFunction();
    }
  }
}

// 앱 실행
new App();
