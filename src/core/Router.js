import { syncHeaderWithRoute } from '../services/HeaderService.js';

// 간단한 클라이언트 사이드 라우터
class Router {
  constructor() {
    this.routes = {};
    this.currentPage = null;
    this.currentPath = null;
    this.pageCache = new Map();
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
    syncHeaderWithRoute(path);
  }

  // 페이지 이동 (히스토리 스택에 추가하지 않고 현재 항목 대체)
  navigateReplace(path) {
    window.history.replaceState({}, '', path);
    this.loadPage(path);

    // 헤더 상태 업데이트 (드롭다운 상태 등)
    syncHeaderWithRoute(path);
  }

  // 페이지 로드 (main 영역만 업데이트)
  loadPage(path) {
    console.log('loadPage called with path:', path);
    let PageComponent = this.routes[path];
    let props = {};
    const cacheKey = path;
    let shouldCache = true;

    // 정확히 일치하는 라우트가 없으면 동적 라우트 검색
    if (!PageComponent) {
      console.log('Exact route not found, trying dynamic route');
      const result = this.matchDynamicRoute(path);
      if (result) {
        PageComponent = result.component;
        props = result.params;
      }
    }

    // 그래도 없으면 기본 페이지
    if (!PageComponent) {
      console.log('Dynamic route not found, using default route');
      PageComponent = this.routes['/'];
    }

    if (!PageComponent) {
      console.error('Page not found:', path);
      return;
    }

    shouldCache = PageComponent.enableCache !== false;
    if (!shouldCache) {
      this.pageCache.delete(cacheKey);
    }

    console.log('Page component found:', PageComponent.name);

    // 기존 페이지 정리 (컴포넌트 인스턴스는 캐시에 남겨 재사용)
    if (this.currentPage) {
      this.currentPage.unmount();
      this.currentPage = null;
      this.currentPath = null;
    }

    // main 영역에만 새 페이지 마운트
    const main = document.getElementById('main');
    if (main) {
      console.log('Mounting page to main container');
      main.innerHTML = '';
      let pageInstance = shouldCache ? this.pageCache.get(cacheKey) : null;

      if (!pageInstance) {
        pageInstance = new PageComponent(props);
        if (shouldCache) {
          this.pageCache.set(cacheKey, pageInstance);
        }
      } else {
        pageInstance.props = { ...pageInstance.props, ...props };
      }

      this.currentPage = pageInstance;
      this.currentPath = cacheKey;
      this.currentPage.mount(main);
    } else {
      console.error('Main container not found');
    }
  }

  // 동적 라우트 매칭
  matchDynamicRoute(path) {
    for (const routePath in this.routes) {
      const paramNames = [];
      const pattern = routePath.replace(/:(\w+)/g, (match, paramName) => {
        paramNames.push(paramName);
        return '(\\d+)';
      });
      const regex = new RegExp(`^${pattern}$`);
      const match = path.match(regex);

      if (match) {
        const params = {};
        paramNames.forEach((name, index) => {
          params[name] = match[index + 1];
        });
        return {
          component: this.routes[routePath],
          params
        };
      }
    }
    return null;
  }
}

// Singleton 인스턴스
let routerInstance = null;

// Router 인스턴스 생성 (app.js에서 호출)
export function createRouter() {
  if (!routerInstance) {
    routerInstance = new Router();
  }
  return routerInstance;
}

// navigate 함수 export (React의 useNavigate()와 유사)
export function navigate(path) {
  if (!routerInstance) {
    console.error('Router not initialized. Call createRouter() first.');
    return;
  }
  routerInstance.navigate(path);
}

// navigateTo 별칭 export (기존 코드 호환용)
export function navigateTo(path) {
  navigate(path);
}

// navigateReplace 함수 export
export function navigateReplace(path) {
  if (!routerInstance) {
    console.error('Router not initialized. Call createRouter() first.');
    return;
  }
  routerInstance.navigateReplace(path);
}

export default Router;
