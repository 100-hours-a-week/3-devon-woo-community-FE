/**
 * 회원 정보 응답 DTO
 * @class MemberResponse
 */
class MemberResponse {
  /**
   * @param {Object} params
   * @param {number} params.memberId - 회원 ID
   * @param {string} params.nickname - 닉네임
   * @param {string} params.profileImage - 프로필 이미지 URL
   */
  constructor({ memberId, nickname, profileImage }) {
    this.memberId = memberId;
    this.nickname = nickname;
    this.profileImage = profileImage;
  }

  /**
   * 더미 데이터를 생성하는 정적 팩토리 메서드
   * @param {number} seed - 더미 데이터 생성용 시드 (기본값: 1)
   * @returns {MemberResponse}
   */
  static createDummy(seed = 1) {
    const nicknames = [
      "DevUser",
      "CodeMaster",
      "TechEnthusiast",
      "WebDeveloper",
      "JavaScriptNinja",
      "ReactGuru",
      "NodeExpert",
      "FullStackDev",
    ];

    const index = (seed - 1) % nicknames.length;

    return new MemberResponse({
      memberId: seed,
      nickname: nicknames[index],
      profileImage: `https://via.placeholder.com/150?text=${nicknames[index]}`,
    });
  }

  /**
   * 기본 더미 데이터
   * @returns {MemberResponse}
   */
  static createDefault() {
    return new MemberResponse({
      memberId: 1,
      nickname: "DevUser",
      profileImage: "https://via.placeholder.com/150?text=DevUser",
    });
  }
}

export default MemberResponse;
