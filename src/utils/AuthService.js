import { navigate } from '../core/Router.js';
import { devAuthConfig, isDev } from '../config/env.js';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_KEY = 'user';
const DEV_BOOTSTRAP_DISABLED_KEY = 'devBootstrapDisabled';
const DEFAULT_DEV_USER = {
  id: 'dev-user',
  email: 'dev@example.com',
  nickname: '개발자',
};

/**
 * 로그인 상태 관리 서비스
 * localStorage를 사용하여 로그인 상태를 유지합니다.
 */
class AuthService {
  /**
   * 로그인 - 토큰과 사용자 정보를 localStorage에 저장
   * @param {string} accessToken
   * @param {string} refreshToken
   * @param {object} user
   */
  static login(accessToken, refreshToken, user) {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    localStorage.removeItem(DEV_BOOTSTRAP_DISABLED_KEY);
  }

  /**
   * 로그아웃 - localStorage에서 토큰과 사용자 정보 제거
   */
  static logout() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    if (isDev && devAuthConfig.bypassAuth) {
      localStorage.setItem(DEV_BOOTSTRAP_DISABLED_KEY, 'true');
    }
  }

  /**
   * 액세스 토큰 조회
   * @returns {string|null}
   */
  static getAccessToken() {
    this.bootstrapDevSession();
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }

  /**
   * 리프레시 토큰 조회
   * @returns {string|null}
   */
  static getRefreshToken() {
    this.bootstrapDevSession();
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }

  /**
   * 현재 사용자 정보 조회
   * @returns {object|null}
   */
  static getUser() {
    this.bootstrapDevSession();
    const user = localStorage.getItem(USER_KEY);
    if (!user || user === 'undefined') return null;
    try {
      return JSON.parse(user);
    } catch (error) {
      console.warn('[AuthService] Failed to parse user from storage:', error);
      localStorage.removeItem(USER_KEY);
      return null;
    }
  }

  /**
   * 로그인 여부 확인
   * @returns {boolean} 로그인 여부
   */
  static isLoggedIn() {
    if (isDev && devAuthConfig.bypassAuth) {
      this.bootstrapDevSession();
    }
    return !!localStorage.getItem(ACCESS_TOKEN_KEY);
  }

  /**
   * 현재 로그인한 사용자의 ID를 숫자로 반환
   * 백엔드 연동 전까지는 기본값 1을 사용
   * @param {number} [defaultId=1]
   * @returns {number}
   */
  static getCurrentUserId(defaultId = 1) {
    const user = this.getUser();
    if (!user) return defaultId;

    const rawId = user.memberId ?? user.id;
    if (typeof rawId === 'number' && !Number.isNaN(rawId)) {
      return rawId;
    }

    const parsed = parseInt(rawId, 10);
    return Number.isNaN(parsed) ? defaultId : parsed;
  }

  /**
   * 로그인 확인 및 리다이렉트
   * 로그인하지 않은 경우 로그인 페이지로 이동
   * @returns {boolean} 로그인 여부
   */
  static requireAuth() {
    if (isDev && devAuthConfig.bypassAuth) {
      this.bootstrapDevSession();
      return true;
    }
    if (!this.isLoggedIn()) {
      alert('로그인이 필요한 기능입니다.');
      navigate('/login');
      return false;
    }
    return true;
  }

  /**
   * 개발 환경에서 자동 세션을 심어주는 함수
   */
  static bootstrapDevSession() {
    if (!(isDev && devAuthConfig.bypassAuth)) return;
    if (localStorage.getItem(DEV_BOOTSTRAP_DISABLED_KEY) === 'true') return;
    if (localStorage.getItem(ACCESS_TOKEN_KEY)) return;

    const devUser = devAuthConfig.user || DEFAULT_DEV_USER;
    const accessToken = devAuthConfig.accessToken || 'dev-access-token';
    const refreshToken = devAuthConfig.refreshToken || 'dev-refresh-token';
    this.login(accessToken, refreshToken, devUser);
  }
}

export default AuthService;
