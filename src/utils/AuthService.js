/**
 * 로그인 상태 관리 서비스
 * localStorage를 사용하여 로그인 상태를 유지합니다.
 */
class AuthService {
  static STORAGE_KEY = 'user_id';

  /**
   * 로그인 - userId를 localStorage에 저장
   * @param {number} userId - 사용자 ID
   */
  static login(userId) {
    localStorage.setItem(this.STORAGE_KEY, userId.toString());
  }

  /**
   * 로그아웃 - localStorage에서 userId 제거
   */
  static logout() {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  /**
   * 현재 로그인한 사용자 ID 조회
   * @returns {number|null} 사용자 ID 또는 null (로그인하지 않은 경우)
   */
  static getCurrentUserId() {
    const userId = localStorage.getItem(this.STORAGE_KEY);
    return userId ? parseInt(userId, 10) : null;
  }

  /**
   * 로그인 여부 확인
   * @returns {boolean} 로그인 여부
   */
  static isLoggedIn() {
    return this.getCurrentUserId() !== null;
  }

  /**
   * 로그인 확인 및 리다이렉트
   * 로그인하지 않은 경우 로그인 페이지로 이동
   * @returns {boolean} 로그인 여부
   */
  static requireAuth() {
    if (!this.isLoggedIn()) {
      alert('로그인이 필요한 기능입니다.');
      window.router.navigate('/login');
      return false;
    }
    return true;
  }
}

export default AuthService;
