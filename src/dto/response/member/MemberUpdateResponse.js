/**
 * 회원 정보 수정 응답 DTO
 * @class MemberUpdateResponse
 */
class MemberUpdateResponse {
  /**
   * @param {Object} params
   * @param {string} params.nickname - 닉네임
   * @param {string} params.profileImage - 프로필 이미지 URL
   */
  constructor({ nickname, profileImage }) {
    this.nickname = nickname;
    this.profileImage = profileImage;
  }

  /**
   * 더미 데이터를 생성하는 정적 팩토리 메서드
   * @param {number} seed - 더미 데이터 생성용 시드 (기본값: 1)
   * @returns {MemberUpdateResponse}
   */
  static createDummy(seed = 1) {
    return new MemberUpdateResponse({
      nickname: `UpdatedUser${seed}`,
      profileImage: `https://via.placeholder.com/150?text=Updated${seed}`,
    });
  }

  /**
   * 기본 더미 데이터
   * @returns {MemberUpdateResponse}
   */
  static createDefault() {
    return new MemberUpdateResponse({
      nickname: "UpdatedNickname",
      profileImage: "https://via.placeholder.com/150?text=UpdatedProfile",
    });
  }
}

module.exports = MemberUpdateResponse;
