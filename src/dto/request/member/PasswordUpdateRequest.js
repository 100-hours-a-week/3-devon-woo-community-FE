/**
 * 비밀번호 변경 요청 DTO
 * @class PasswordUpdateRequest
 */
class PasswordUpdateRequest {
  /**
   * @param {Object} params
   * @param {string} params.currentPassword - 현재 비밀번호
   * @param {string} params.newPassword - 새 비밀번호
   */
  constructor({ currentPassword, newPassword }) {
    this.currentPassword = currentPassword;
    this.newPassword = newPassword;
  }

  /**
   * 더미 데이터를 생성하는 정적 팩토리 메서드
   * @param {number} seed - 더미 데이터 생성용 시드 (기본값: 1)
   * @returns {PasswordUpdateRequest}
   */
  static createDummy(seed = 1) {
    return new PasswordUpdateRequest({
      currentPassword: `oldpassword${seed}23`,
      newPassword: `newpassword${seed}56`,
    });
  }

  /**
   * 기본 더미 데이터
   * @returns {PasswordUpdateRequest}
   */
  static createDefault() {
    return new PasswordUpdateRequest({
      currentPassword: "oldpassword123",
      newPassword: "newpassword456",
    });
  }
}

export default PasswordUpdateRequest;
