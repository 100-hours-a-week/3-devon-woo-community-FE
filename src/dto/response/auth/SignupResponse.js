import MemberResponse from "../member/MemberResponse.js";

/**
 * 회원가입 응답 DTO
 * @class SignupResponse
 */
class SignupResponse {
  /**
   * @param {Object} params
   * @param {string} params.accessToken - 액세스 토큰
   * @param {string} params.refreshToken - 리프레시 토큰
   * @param {MemberResponse} params.member - 생성된 회원 정보
   */
  constructor({ accessToken, refreshToken, member }) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.member = member;
  }

  /**
   * 더미 데이터를 생성하는 정적 팩토리 메서드
   * @param {number} memberId - 회원 ID (기본값: 1)
   * @returns {SignupResponse}
   */
  static createDummy(memberId = 1) {
    return new SignupResponse({
      accessToken: `mock-access-token-${memberId}`,
      refreshToken: `mock-refresh-token-${memberId}`,
      member: MemberResponse.createDummy(memberId),
    });
  }

  /**
   * 기본 더미 데이터
   * @returns {SignupResponse}
   */
  static createDefault() {
    return SignupResponse.createDummy(2);
  }
}

export default SignupResponse;
