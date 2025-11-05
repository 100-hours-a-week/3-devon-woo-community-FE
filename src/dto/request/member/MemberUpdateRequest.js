/**
 * 회원 정보 수정 요청 DTO
 * @class MemberUpdateRequest
 */
class MemberUpdateRequest {
  /**
   * @param {Object} params
   * @param {string} [params.nickname] - 닉네임
   * @param {string} [params.profileImage] - 프로필 이미지 URL
   */
  constructor({ nickname, profileImage } = {}) {
    this.nickname = nickname;
    this.profileImage = profileImage;
  }

  /**
   * 더미 데이터를 생성하는 정적 팩토리 메서드
   * @param {number} seed - 더미 데이터 생성용 시드 (기본값: 1)
   * @returns {MemberUpdateRequest}
   */
  static createDummy(seed = 1) {
    return new MemberUpdateRequest({
      nickname: `UpdatedUser${seed}`,
      profileImage: `https://via.placeholder.com/150?text=Updated${seed}`,
    });
  }

  /**
   * 기본 더미 데이터
   * @returns {MemberUpdateRequest}
   */
  static createDefault() {
    return new MemberUpdateRequest({
      nickname: "UpdatedNickname",
      profileImage: "https://via.placeholder.com/150?text=UpdatedProfile",
    });
  }
}

module.exports = MemberUpdateRequest;
