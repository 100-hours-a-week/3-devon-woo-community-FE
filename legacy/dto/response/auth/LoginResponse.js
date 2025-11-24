import MemberResponse from "../member/MemberResponse.js";

/**
 * 로그인 응답 DTO
 * @class LoginResponse
 */
class LoginResponse {
  /**
   * @param {Object} params
   * @param {string} params.accessToken - 액세스 토큰
   * @param {string} params.refreshToken - 리프레시 토큰
   * @param {MemberResponse} params.member - 로그인한 회원 정보
   */
  constructor({ accessToken, refreshToken, member }) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.member = member;
  }

  /**
   * 더미 데이터를 생성하는 정적 팩토리 메서드
   * @param {number} memberId - 회원 ID (기본값: 1)
   * @returns {LoginResponse}
   */
  static createDummy(memberId = 1) {
    return new LoginResponse({
      accessToken: `mock-access-token-${memberId}`,
      refreshToken: `mock-refresh-token-${memberId}`,
      member: MemberResponse.createDummy(memberId),
    });
  }

  /**
   * 기본 더미 데이터
   * @returns {LoginResponse}
   */
  static createDefault() {
    return LoginResponse.createDummy(1);
  }
}

export default LoginResponse;
