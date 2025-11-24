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
   * @param {string} [params.handle]
   * @param {string} [params.bio]
   * @param {string} [params.role]
   * @param {string} [params.company]
   * @param {string} [params.location]
   * @param {string[]} [params.primaryStack]
   * @param {string[]} [params.interests]
   * @param {Object} [params.socialLinks]
   */
  constructor({
    email,
    password,
    nickname,
    profileImage,
    handle,
    bio,
    role,
    company,
    location,
    primaryStack = [],
    interests = [],
    socialLinks = {},
  }) {
    this.email = email;
    this.password = password;
    this.nickname = nickname;
    this.profileImage = profileImage;
    this.handle = handle;
    this.bio = bio;
    this.role = role;
    this.company = company;
    this.location = location;
    this.primaryStack = Array.isArray(primaryStack) ? primaryStack : [];
    this.interests = Array.isArray(interests) ? interests : [];
    this.socialLinks = socialLinks;
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
      handle: `Full-stack Developer #${seed}`,
      bio: '사용자 경험을 개선하는 기술 블로그 운영자입니다.',
      role: 'Software Engineer',
      company: 'Codestate Labs',
      location: 'Seoul, Korea',
      primaryStack: ['TypeScript', 'React', 'Node.js'],
      interests: ['Design System', 'Web Performance'],
      socialLinks: {
        github: `https://github.com/newuser${seed}`,
        website: `https://newuser${seed}.example.com`,
        linkedin: `https://www.linkedin.com/in/newuser${seed}`,
        notion: `https://notion.so/newuser${seed}`
      }
    });
  }

  /**
   * 기본 더미 데이터
   * @returns {SignupRequest}
   */
  static createDefault() {
    return SignupRequest.createDummy(1);
  }
}

export default SignupRequest;
