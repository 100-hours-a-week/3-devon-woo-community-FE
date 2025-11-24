import MemberResponse from "../member/MemberResponse.js";
import { mockSummaries } from "./mockContents.js";

class PostSummaryResponse {
  constructor({
    postId,
    title,
    summary,
    thumbnail,
    member,
    createdAt,
    viewCount,
    likeCount,
    commentCount,
  }) {
    this.postId = postId;
    this.title = title;
    this.summary = summary;
    this.thumbnail = thumbnail;
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
      "Transactional Outbox 패턴으로 메시지 발행 보장하기",
      "CSS Grid 완벽 가이드",
      "REST API 설계 원칙",
      "도커로 개발 환경 구성하기",
      "Git 브랜치 전략",
    ];

    const summaries = [
      ...mockSummaries,
      "CSS Grid를 활용한 현대적인 레이아웃 구성 방법을 배웁니다.",
      "확장 가능한 REST API를 설계하는 핵심 원칙들을 소개합니다.",
      "도커를 활용하여 일관된 개발 환경을 구성하는 방법을 알아봅니다.",
      "효과적인 Git 브랜치 전략으로 협업 워크플로우를 개선하세요."
    ];

    const index = (seed - 1) % titles.length;
    const now = new Date();
    const createdAt = new Date(
      now.getTime() - seed * 24 * 60 * 60 * 1000
    ).toISOString();

    return new PostSummaryResponse({
      postId: seed,
      title: titles[index],
      summary: summaries[index],
      thumbnail: `https://picsum.photos/seed/post${seed}/800/400`,
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
      title: "JavaScript 최신 기능 소개",
      summary: mockSummaries[0],
      thumbnail: "https://picsum.photos/seed/post1/800/400",
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
