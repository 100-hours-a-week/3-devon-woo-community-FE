/**
 * 회원가입 응답 DTO
 * @class SignupResponse
 */
class SignupResponse {
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
   * @returns {SignupResponse}
   */
  static createDummy(userId = 1) {
    return new SignupResponse({ userId });
  }

  /**
   * 기본 더미 데이터
   * @returns {SignupResponse}
   */
  static createDefault() {
    return new SignupResponse({ userId: 2 });
  }
}

export default SignupResponse;
