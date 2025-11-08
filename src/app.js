// 앱 초기화 및 라우트 설정
import Router from './core/Router.js';
import LoginPage from './pages/LoginPage/index.js';
import SignupPage from './pages/SignupPage/index.js';

// 라우터 생성
const router = new Router();

// 라우트 등록
router.addRoute('/', LoginPage);
router.addRoute('/login', LoginPage);
router.addRoute('/signup', SignupPage);

// 라우터 초기화
router.init();

// 전역 라우터 참조 (컴포넌트에서 사용)
window.router = router;
