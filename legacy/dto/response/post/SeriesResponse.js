/**
 * 시리즈 응답 DTO
 */
class SeriesResponse {
  /**
   * @param {Object} params
   * @param {number} params.seriesId
   * @param {string} params.name
   * @param {string} [params.description]
   * @param {number} [params.postCount]
   */
  constructor({ seriesId, name, description = '', postCount = 0 }) {
    this.seriesId = seriesId;
    this.name = name;
    this.description = description;
    this.postCount = postCount;
  }

  static createDummy(seed = 1) {
    const seriesNames = [
      'Backend 개발 시리즈',
      'Frontend 아키텍처',
      '클라우드 네이티브 실전',
      '데이터 엔지니어링 노트',
    ];
    const index = (seed - 1) % seriesNames.length;
    return new SeriesResponse({
      seriesId: seed,
      name: seriesNames[index],
      description: `${seriesNames[index]}에 대한 실무 노하우를 정리합니다.`,
      postCount: Math.floor(Math.random() * 12) + 1,
    });
  }

  static createDummyList(count = 4) {
    return Array.from({ length: count }, (_, idx) => SeriesResponse.createDummy(idx + 1));
  }
}

export default SeriesResponse;
