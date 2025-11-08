// 간단한 클라이언트 사이드 라우터
class Router {
  constructor() {
    this.routes = {};
    this.currentPage = null;
  }

  // 라우트 등록
  addRoute(path, PageComponent) {
    this.routes[path] = PageComponent;
  }

  // 라우터 초기화
  init() {
    // 뒤로가기/앞으로가기 처리
    window.addEventListener('popstate', () => {
      this.loadPage(window.location.pathname);
    });

    // 링크 클릭 처리
    document.addEventListener('click', (e) => {
      if (e.target.tagName === 'A' && e.target.href) {
        const url = new URL(e.target.href);
        if (url.origin === window.location.origin) {
          e.preventDefault();
          this.navigate(url.pathname);
        }
      }
    });

    // 초기 페이지 로드
    this.loadPage(window.location.pathname);
  }

  // 페이지 이동
  navigate(path) {
    window.history.pushState({}, '', path);
    this.loadPage(path);
  }

  // 페이지 로드 (main 영역만 업데이트)
  loadPage(path) {
    const PageComponent = this.routes[path] || this.routes['/'];

    if (!PageComponent) {
      console.error('Page not found:', path);
      return;
    }

    // 기존 페이지 정리
    if (this.currentPage && this.currentPage.beforeUnmount) {
      this.currentPage.beforeUnmount();
    }

    // main 영역에만 새 페이지 마운트
    const main = document.getElementById('main');
    if (main) {
      main.innerHTML = '';
      this.currentPage = new PageComponent();
      this.currentPage.mount(main);
    }
  }
}

export default Router;
