/**
 * 회원가입 요청 DTO
 * @class SignupRequest
 */
class SignupRequest {
  /**
   * @param {Object} params
   * @param {string} params.email - 이메일
   * @param {string} params.password - 비밀번호
   * @param {string} params.nickname - 닉네임
   * @param {string} [params.profileImage] - 프로필 이미지 URL
   */
  constructor({ email, password, nickname, profileImage }) {
    this.email = email;
    this.password = password;
    this.nickname = nickname;
    this.profileImage = profileImage;
  }

  /**
   * 더미 데이터를 생성하는 정적 팩토리 메서드
   * @param {number} seed - 더미 데이터 생성용 시드 (기본값: 1)
   * @returns {SignupRequest}
   */
  static createDummy(seed = 1) {
    return new SignupRequest({
      email: `newuser${seed}@example.com`,
      password: `securepass${seed}23`,
      nickname: `DevUser${seed}`,
      profileImage: `https://picsum.photos/seed/newuser${seed}/200/200`,
    });
  }

  /**
   * 기본 더미 데이터
   * @returns {SignupRequest}
   */
  static createDefault() {
    return new SignupRequest({
      email: "newuser@example.com",
      password: "securepass123",
      nickname: "DevUser",
      profileImage: "https://picsum.photos/seed/newuser1/200/200",
    });
  }
}

export default SignupRequest;
