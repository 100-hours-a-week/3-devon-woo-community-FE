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

    // 헤더 상태 업데이트 (드롭다운 상태 등)
    if (window.updateHeaderState) {
      window.updateHeaderState();
    }
  }

  // 페이지 로드 (main 영역만 업데이트)
  loadPage(path) {
    let PageComponent = this.routes[path];

    // 정확히 일치하는 라우트가 없으면 동적 라우트 검색
    if (!PageComponent) {
      PageComponent = this.matchDynamicRoute(path);
    }

    // 그래도 없으면 기본 페이지
    if (!PageComponent) {
      PageComponent = this.routes['/'];
    }

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

  // 동적 라우트 매칭
  matchDynamicRoute(path) {
    for (const routePath in this.routes) {
      // :id 같은 동적 파라미터를 정규식으로 변환
      const pattern = routePath.replace(/:\w+/g, '(\\d+)');
      const regex = new RegExp(`^${pattern}$`);

      if (regex.test(path)) {
        return this.routes[routePath];
      }
    }
    return null;
  }
}

export default Router;
