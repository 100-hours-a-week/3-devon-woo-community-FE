/**
 * 로그인 요청 DTO
 * @class LoginRequest
 */
class LoginRequest {
  /**
   * @param {Object} params
   * @param {string} params.email - 이메일
   * @param {string} params.password - 비밀번호
   */
  constructor({ email, password }) {
    this.email = email;
    this.password = password;
  }

  /**
   * 더미 데이터를 생성하는 정적 팩토리 메서드
   * @param {number} seed - 더미 데이터 생성용 시드 (기본값: 1)
   * @returns {LoginRequest}
   */
  static createDummy(seed = 1) {
    return new LoginRequest({
      email: `user${seed}@example.com`,
      password: `password${seed}23`,
    });
  }

  /**
   * 기본 더미 데이터
   * @returns {LoginRequest}
   */
  static createDefault() {
    return new LoginRequest({
      email: "user@example.com",
      password: "password123",
    });
  }
}

export default LoginRequest;
