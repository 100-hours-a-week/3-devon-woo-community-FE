/**
 * 회원 정보 응답 DTO
 * @class MemberResponse
 */
class MemberResponse {
  /**
   * @param {Object} params
   * @param {number} params.memberId - 회원 ID
   * @param {string} params.email - 이메일
   * @param {string} params.nickname - 닉네임
   * @param {string} params.profileImage - 프로필 이미지 URL
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
    memberId,
    email,
    nickname,
    profileImage,
    handle = '',
    bio = '',
    role = '',
    company = '',
    location = '',
    primaryStack = [],
    interests = [],
    socialLinks = {},
  }) {
    this.memberId = memberId;
    this.id = memberId;
    this.email = email;
    this.nickname = nickname;
    this.profileImage = profileImage;
    this.handle = handle;
    this.bio = bio;
    this.role = role;
    this.company = company;
    this.location = location;
    this.primaryStack = Array.isArray(primaryStack) ? primaryStack : [];
    this.interests = Array.isArray(interests) ? interests : [];
    this.socialLinks = {
      github: socialLinks.github || '',
      website: socialLinks.website || '',
      linkedin: socialLinks.linkedin || '',
      notion: socialLinks.notion || '',
    };
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

    const roles = [
      'Backend Engineer',
      'Frontend Developer',
      'Full-stack Engineer',
      'Data Engineer',
      'SRE',
      'Platform Engineer',
      'Software Architect',
      'Team Lead'
    ];

    const companies = [
      'Codestate Labs',
      'Tech Research',
      'NextOps',
      'DevFoundry',
      'CloudBase',
      'TeraTech',
      'Stacksmith',
      'Lambda Corp'
    ];

    const index = (seed - 1) % nicknames.length;

    return new MemberResponse({
      memberId: seed,
      email: `dev${seed}@example.com`,
      nickname: nicknames[index],
      profileImage: `https://picsum.photos/seed/user${seed}/200/200`,
      handle: `${roles[index]} / ${companies[index]}`,
      bio: '지속 가능한 아키텍처와 자동화를 추구하는 개발자입니다.',
      role: roles[index],
      company: companies[index],
      location: 'Seoul, Korea',
      primaryStack: ['Java', 'Spring Boot', 'JPA', 'MySQL', 'AWS'],
      interests: ['MSA', 'DevOps', 'Data Engineering'],
      socialLinks: {
        github: `https://github.com/dev${seed}`,
        website: `https://dev${seed}.example.com`,
        linkedin: `https://www.linkedin.com/in/dev${seed}`,
        notion: `https://notion.so/dev${seed}`
      }
    });
  }

  /**
   * 기본 더미 데이터
   * @returns {MemberResponse}
   */
  static createDefault() {
    return MemberResponse.createDummy(1);
  }
}

export default MemberResponse;
