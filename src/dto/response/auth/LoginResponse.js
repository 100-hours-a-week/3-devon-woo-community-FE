/**
 * 로그인 응답 DTO
 * @class LoginResponse
 */
class LoginResponse {
  /**
   * @param {Object} params
   * @param {number} params.userId - 사용자 ID
   */
  constructor({ userId }) {
    this.userId = userId;
  }

  /**
   * 더미 데이터를 생성하는 정적 팩토리 메서드
   * @param {number} userId - 사용자 ID (기본값: 1)
   * @returns {LoginResponse}
   */
  static createDummy(userId = 1) {
    return new LoginResponse({ userId });
  }

  /**
   * 기본 더미 데이터
   * @returns {LoginResponse}
   */
  static createDefault() {
    return new LoginResponse({ userId: 1 });
  }
}

export default LoginResponse;
