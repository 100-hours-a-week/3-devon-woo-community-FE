/**
 * 게시글 생성 요청 DTO
 * @class PostCreateRequest
 */
class PostCreateRequest {
  /**
   * @param {Object} params
   * @param {number} params.memberId - 작성자 ID
   * @param {string} params.title - 제목
   * @param {string} params.content - 내용
   * @param {string} [params.image] - 대표 이미지 URL
   * @param {string} [params.summary] - 요약
   * @param {string[]} [params.tags] - 태그 목록
   * @param {number|null} [params.seriesId] - 시리즈 ID
   * @param {string} [params.visibility='public'] - 공개 범위
   * @param {boolean} [params.isDraft=false] - 임시 저장 여부
   */
  constructor({
    memberId,
    title,
    content,
    image,
    summary,
    tags = [],
    seriesId = null,
    visibility = 'public',
    isDraft = false,
    commentsAllowed = true
  }) {
    this.memberId = memberId;
    this.title = title;
    this.content = content;
    this.image = image;
    this.summary = summary;
    this.tags = Array.isArray(tags) ? tags : [];
    this.seriesId = seriesId;
    this.visibility = visibility;
    this.isDraft = isDraft;
    this.commentsAllowed = commentsAllowed;
  }

  /**
   * 더미 데이터를 생성하는 정적 팩토리 메서드
   * @param {number} seed - 더미 데이터 생성용 시드 (기본값: 1)
   * @param {number} memberId - 작성자 ID (기본값: 1)
   * @returns {PostCreateRequest}
   */
  static createDummy(seed = 1, memberId = 1) {
    const titles = [
      "JavaScript 최신 기능 소개",
      "React 성능 최적화 팁",
      "Node.js 비동기 프로그래밍",
      "웹 개발 트렌드 2025",
      "TypeScript로 마이그레이션하기",
    ];

    const contents = [
      "이번 포스트에서는 최신 JavaScript 기능들을 살펴보겠습니다. ES2024의 새로운 기능들과 실무에서 어떻게 활용할 수 있는지 알아봅니다.",
      "React 애플리케이션의 성능을 개선하는 다양한 방법들을 소개합니다. useMemo, useCallback, React.memo 등을 효과적으로 사용하는 법을 배워봅시다.",
      "Node.js의 비동기 처리 방식에 대해 깊이 있게 다룹니다. Promise, async/await, Event Loop의 동작 원리를 이해해봅시다.",
      "2025년 웹 개발 트렌드를 정리했습니다. 최신 프레임워크, 도구, 그리고 베스트 프랙티스를 소개합니다.",
      "기존 JavaScript 프로젝트를 TypeScript로 전환하는 실전 가이드입니다. 단계별로 안전하게 마이그레이션하는 방법을 알아봅니다.",
    ];

    const index = (seed - 1) % titles.length;

    return new PostCreateRequest({
      memberId,
      title: `${titles[index]} #${seed}`,
      content: contents[index],
      image: `https://picsum.photos/seed/createpost${seed}/800/400`,
      summary: contents[index].slice(0, 120),
      tags: ['JavaScript', 'Architecture'],
      seriesId: null,
      visibility: 'public',
      isDraft: false,
      commentsAllowed: true
    });
  }

  /**
   * 기본 더미 데이터
   * @returns {PostCreateRequest}
   */
  static createDefault() {
    return new PostCreateRequest({
      memberId: 1,
      title: "My First Post",
      content: "This is the content of my first post.",
      image: "https://picsum.photos/seed/createpost1/800/400",
      summary: "This is the content of my first post.",
      tags: ['JavaScript'],
      seriesId: null,
      visibility: 'public',
      isDraft: false,
      commentsAllowed: true
    });
  }
}

export default PostCreateRequest;
