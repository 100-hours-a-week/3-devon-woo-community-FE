import MemberResponse from "../member/MemberResponse.js";

/**
 * 게시글 상세 응답 DTO
 * @class PostResponse
 */
class PostResponse {
  /**
   * @param {Object} params
   * @param {number} params.postId - 게시글 ID
   * @param {MemberResponse} params.member - 작성자 정보
   * @param {string} params.title - 제목
   * @param {string} params.content - 내용
   * @param {string} params.imageUrl - 이미지 URL
   * @param {string} params.createdAt - 생성 시각 (ISO 8601 형식)
   * @param {string} params.updatedAt - 수정 시각 (ISO 8601 형식)
   * @param {number} params.viewCount - 조회수
   * @param {number} params.likeCount - 좋아요 수
   * @param {number} params.commentCount - 댓글 수
   * @param {boolean} [params.isLiked=false] - 현재 사용자의 좋아요 여부
   */
  constructor({
    postId,
    member,
    title,
    content,
    imageUrl,
    createdAt,
    updatedAt,
    viewCount,
    likeCount,
    commentCount,
    isLiked = false,
  }) {
    this.postId = postId;
    this.member = member;
    this.title = title;
    this.content = content;
    this.imageUrl = imageUrl;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.viewCount = viewCount;
    this.likeCount = likeCount;
    this.commentCount = commentCount;
    this.isLiked = isLiked;
  }

  /**
   * 더미 데이터를 생성하는 정적 팩토리 메서드
   * @param {number} seed - 더미 데이터 생성용 시드 (기본값: 1)
   * @returns {PostResponse}
   */
  static createDummy(seed = 1) {
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
    const now = new Date();
    const createdAt = new Date(
      now.getTime() - seed * 24 * 60 * 60 * 1000
    ).toISOString();

    return new PostResponse({
      postId: seed,
      member: MemberResponse.createDummy((seed % 8) + 1),
      title: titles[index],
      content: contents[index],
      imageUrl: `https://picsum.photos/seed/post${seed}/800/400`,
      createdAt,
      updatedAt: createdAt,
      viewCount: Math.floor(Math.random() * 1000) + 10,
      likeCount: Math.floor(Math.random() * 100) + 1,
      commentCount: Math.floor(Math.random() * 50),
      isLiked: false,
    });
  }

  /**
   * 기본 더미 데이터
   * @returns {PostResponse}
   */
  static createDefault() {
    return new PostResponse({
      postId: 1,
      member: MemberResponse.createDefault(),
      title: "My First Post",
      content: "This is the content of my first post.",
      imageUrl: "https://picsum.photos/seed/post1/800/400",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      viewCount: 42,
      likeCount: 5,
      commentCount: 3,
      isLiked: false,
    });
  }
}

export default PostResponse;
