/**
 * 회원 정보 수정 요청 DTO
 * @class MemberUpdateRequest
 */
class MemberUpdateRequest {
  /**
   * @param {Object} params
   * @param {string} [params.nickname] - 닉네임
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
  } = {}) {
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
   * @returns {MemberUpdateRequest}
   */
  static createDummy(seed = 1) {
    return new MemberUpdateRequest({
      nickname: `UpdatedUser${seed}`,
      profileImage: `https://via.placeholder.com/150?text=Updated${seed}`,
      handle: `Full-stack Developer #${seed}`,
      bio: '제품 중심의 개발 문화를 지향합니다.',
      role: 'Software Engineer',
      company: 'Codestate Labs',
      location: 'Seoul, Korea',
      primaryStack: ['Java', 'Spring Boot', 'AWS'],
      interests: ['DevOps', 'Distributed System'],
      socialLinks: {
        github: `https://github.com/updated${seed}`,
        website: `https://updated${seed}.example.com`,
        linkedin: `https://www.linkedin.com/in/updated${seed}`,
        notion: `https://notion.so/updated${seed}`
      }
    });
  }

  /**
   * 기본 더미 데이터
   * @returns {MemberUpdateRequest}
   */
  static createDefault() {
    return MemberUpdateRequest.createDummy(1);
  }
}

export default MemberUpdateRequest;
