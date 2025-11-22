import MemberResponse from "../member/MemberResponse.js";

/**
 * 게시글 요약 응답 DTO (목록용)
 * @class PostSummaryResponse
 */
class PostSummaryResponse {
  /**
   * @param {Object} params
   * @param {number} params.postId - 게시글 ID
   * @param {string} params.title - 제목
   * @param {MemberResponse} params.member - 작성자 정보
   * @param {string} params.createdAt - 생성 시각 (ISO 8601 형식)
   * @param {number} params.viewCount - 조회수
   * @param {number} params.likeCount - 좋아요 수
   * @param {number} params.commentCount - 댓글 수
   */
  constructor({
    postId,
    title,
    member,
    createdAt,
    viewCount,
    likeCount,
    commentCount,
  }) {
    this.postId = postId;
    this.title = title;
    this.member = member;
    this.createdAt = createdAt;
    this.viewCount = viewCount;
    this.likeCount = likeCount;
    this.commentCount = commentCount;
  }

  /**
   * 더미 데이터를 생성하는 정적 팩토리 메서드
   * @param {number} seed - 더미 데이터 생성용 시드 (기본값: 1)
   * @returns {PostSummaryResponse}
   */
  static createDummy(seed = 1) {
    const titles = [
      "JavaScript 최신 기능 소개",
      "React 성능 최적화 팁",
      "Node.js 비동기 프로그래밍",
      "웹 개발 트렌드 2025",
      "TypeScript로 마이그레이션하기",
      "CSS Grid 완벽 가이드",
      "REST API 설계 원칙",
      "도커로 개발 환경 구성하기",
      "Git 브랜치 전략",
      "테스트 주도 개발 입문",
    ];

    const index = (seed - 1) % titles.length;
    const now = new Date();
    const createdAt = new Date(
      now.getTime() - seed * 24 * 60 * 60 * 1000
    ).toISOString();

    return new PostSummaryResponse({
      postId: seed,
      title: titles[index],
      member: MemberResponse.createDummy((seed % 8) + 1),
      createdAt,
      viewCount: Math.floor(Math.random() * 1000) + 10,
      likeCount: Math.floor(Math.random() * 100) + 1,
      commentCount: Math.floor(Math.random() * 50),
    });
  }

  /**
   * 기본 더미 데이터
   * @returns {PostSummaryResponse}
   */
  static createDefault() {
    return new PostSummaryResponse({
      postId: 1,
      title: "My First Post",
      member: MemberResponse.createDefault(),
      createdAt: new Date().toISOString(),
      viewCount: 42,
      likeCount: 5,
      commentCount: 3,
    });
  }

  /**
   * 여러 개의 더미 데이터 배열 생성
   * @param {number} count - 생성할 데이터 개수
   * @returns {PostSummaryResponse[]}
   */
  static createDummyList(count = 10) {
    return Array.from({ length: count }, (_, i) =>
      PostSummaryResponse.createDummy(i + 1)
    );
  }
}

export default PostSummaryResponse;
