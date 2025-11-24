/**
 * 태그 요약 정보 DTO
 */
class TagSummaryResponse {
  /**
   * @param {Object} params
   * @param {number} params.tagId - 태그 ID
   * @param {string} params.name - 태그 이름
   * @param {number} params.postCount - 태그가 사용된 게시글 수
   */
  constructor({ tagId, name, postCount }) {
    this.tagId = tagId;
    this.name = name;
    this.postCount = postCount;
  }

  /**
   * 더미 태그 생성
   * @param {number} seed
   * @returns {TagSummaryResponse}
   */
  static createDummy(seed = 1) {
    const tags = [
      'JavaScript',
      'TypeScript',
      'React',
      'Node.js',
      'Spring Boot',
      'MSA',
      'DevOps',
      'Kubernetes',
      'Cloud',
      'AI',
      'Data Engineering',
      'Kafka',
      'Golang',
      'Rust',
      'Python',
    ];
    const index = (seed - 1) % tags.length;
    return new TagSummaryResponse({
      tagId: seed,
      name: tags[index],
      postCount: Math.floor(Math.random() * 80) + 5,
    });
  }

  /**
   * 태그 목록 생성
   * @param {number} count
   * @returns {TagSummaryResponse[]}
   */
  static createDummyList(count = 12) {
    return Array.from({ length: count }, (_, idx) => TagSummaryResponse.createDummy(idx + 1));
  }
}

export default TagSummaryResponse;
