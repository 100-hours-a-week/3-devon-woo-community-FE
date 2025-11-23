import MemberResponse from "../member/MemberResponse.js";
import { mockMarkdownContents, mockSummaries } from "./mockContents.js";

class PostResponse {
  constructor({
    postId,
    member,
    title,
    content,
    summary,
    imageUrl,
    createdAt,
    updatedAt,
    viewCount,
    likeCount,
    commentCount,
    isLiked = false,
    tags = [],
    seriesId = null,
    seriesName = '',
    visibility = 'public'
  }) {
    this.postId = postId;
    this.member = member;
    this.title = title;
    this.content = content;
    this.summary = summary;
    this.imageUrl = imageUrl;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.viewCount = viewCount;
    this.likeCount = likeCount;
    this.commentCount = commentCount;
    this.isLiked = isLiked;
    this.tags = tags;
    this.seriesId = seriesId;
    this.seriesName = seriesName;
    this.visibility = visibility;
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
      "Transactional Outbox 패턴으로 메시지 발행 보장하기",
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
      content: mockMarkdownContents[index],
      summary: mockSummaries[index],
      imageUrl: `https://picsum.photos/seed/post${seed}/800/400`,
      createdAt,
      updatedAt: createdAt,
      viewCount: Math.floor(Math.random() * 1000) + 10,
      likeCount: Math.floor(Math.random() * 100) + 1,
      commentCount: Math.floor(Math.random() * 50),
      isLiked: false,
      tags: ['Java', 'Architecture', 'Best Practice'].slice(0, (seed % 3) + 1),
      seriesId: seed % 2 === 0 ? 1 : null,
      seriesName: seed % 2 === 0 ? '백엔드 아키텍처 노트' : '',
      visibility: 'public'
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
      title: "JavaScript 최신 기능 소개",
      content: mockMarkdownContents[0],
      summary: mockSummaries[0],
      imageUrl: "https://picsum.photos/seed/post1/800/400",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      viewCount: 42,
      likeCount: 5,
      commentCount: 3,
      isLiked: false,
      tags: ['JavaScript', 'ECMAScript'],
      seriesId: null,
      seriesName: '',
      visibility: 'public'
    });
  }
}

export default PostResponse;
