// 간단한 환경 설정: 브라우저 전역 변수 APP_ENV 또는 호스트로 판단
const appEnv =
  (typeof window !== 'undefined' && window.APP_ENV) ||
  (typeof location !== 'undefined' && (location.hostname === 'localhost' || location.hostname === '127.0.0.1')
    ? 'development'
    : 'production');

export const ENV = appEnv;
export const isDev = appEnv === 'development';

// 개발 환경에서 자동 로그인/우회 설정
export const devAuthConfig = {
  bypassAuth: false,
  accessToken: 'dev-access-token',
  refreshToken: 'dev-refresh-token',
  user: {
    id: 'dev-user',
    email: 'dev@example.com',
    nickname: '개발자',
  },
};

export default {
  ENV,
  isDev,
  devAuthConfig,
};
