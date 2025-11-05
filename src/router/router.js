// 간단한 해시 기반 라우터
class Router {
  constructor(routes) {
    this.routes = routes;
    this.init();
  }

  init() {
    // 해시 변경 감지
    window.addEventListener('hashchange', () => this.route());
    window.addEventListener('load', () => this.route());
  }

  route() {
    const hash = window.location.hash.slice(1) || '/';
    const [path, ...params] = hash.split('/').filter(Boolean);

    let currentPath = `/${path || ''}`;

    // 동적 라우트 처리 (예: /posts/:id)
    let matchedRoute = this.routes[currentPath];

    if (!matchedRoute) {
      // 동적 파라미터가 있는 경우 (예: /posts/1)
      const keys = Object.keys(this.routes);
      for (const key of keys) {
        if (key.includes(':')) {
          const routePattern = key.split('/');
          const urlPattern = currentPath.split('/');

          if (routePattern.length === urlPattern.length) {
            const isMatch = routePattern.every((part, i) =>
              part.startsWith(':') || part === urlPattern[i]
            );

            if (isMatch) {
              matchedRoute = this.routes[key];
              // 파라미터 추출 (추후 사용 가능)
              const paramName = routePattern.find(p => p.startsWith(':')).slice(1);
              const paramValue = params[0] || urlPattern[urlPattern.length - 1];
              break;
            }
          }
        }
      }
    }

    // 라우트가 없으면 기본 페이지로
    const handler = matchedRoute || this.routes['/'];

    if (handler) {
      handler();
    }
  }

  navigate(path) {
    window.location.hash = path;
  }
}

export default Router;
