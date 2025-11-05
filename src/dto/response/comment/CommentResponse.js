const MemberResponse = require("../member/MemberResponse");

/**
 * 댓글 응답 DTO
 * @class CommentResponse
 */
class CommentResponse {
  /**
   * @param {Object} params
   * @param {number} params.commentId - 댓글 ID
   * @param {number} params.postId - 게시글 ID
   * @param {string} params.content - 댓글 내용
   * @param {MemberResponse} params.member - 작성자 정보
   * @param {string} params.createdAt - 생성 시각 (ISO 8601 형식)
   * @param {string} params.updatedAt - 수정 시각 (ISO 8601 형식)
   */
  constructor({ commentId, postId, content, member, createdAt, updatedAt }) {
    this.commentId = commentId;
    this.postId = postId;
    this.content = content;
    this.member = member;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  /**
   * 더미 데이터를 생성하는 정적 팩토리 메서드
   * @param {number} seed - 더미 데이터 생성용 시드 (기본값: 1)
   * @param {number} postId - 게시글 ID (기본값: 1)
   * @returns {CommentResponse}
   */
  static createDummy(seed = 1, postId = 1) {
    const comments = [
      "정말 유익한 글이네요! 감사합니다.",
      "궁금했던 내용인데 잘 정리해주셨네요.",
      "실무에 바로 적용해볼 수 있을 것 같습니다.",
      "이런 관점에서 생각해보지 못했는데 도움이 되었습니다.",
      "추가로 궁금한 점이 있는데 질문해도 될까요?",
      "Great post! Very helpful information.",
      "좋은 정보 공유해주셔서 감사합니다.",
      "다음 포스트도 기대하겠습니다!",
      "상세한 설명 덕분에 이해가 잘 되었어요.",
      "북마크해두고 나중에 다시 봐야겠습니다.",
    ];

    const index = (seed - 1) % comments.length;
    const now = new Date();
    const createdAt = new Date(
      now.getTime() - seed * 60 * 60 * 1000
    ).toISOString();

    return new CommentResponse({
      commentId: seed,
      postId,
      content: comments[index],
      member: MemberResponse.createDummy((seed % 8) + 1),
      createdAt,
      updatedAt: createdAt,
    });
  }

  /**
   * 기본 더미 데이터
   * @returns {CommentResponse}
   */
  static createDefault() {
    const now = new Date().toISOString();
    return new CommentResponse({
      commentId: 1,
      postId: 1,
      content: "Great post!",
      member: MemberResponse.createDummy(2),
      createdAt: now,
      updatedAt: now,
    });
  }

  /**
   * 여러 개의 더미 데이터 배열 생성
   * @param {number} count - 생성할 데이터 개수
   * @param {number} postId - 게시글 ID
   * @returns {CommentResponse[]}
   */
  static createDummyList(count = 10, postId = 1) {
    return Array.from({ length: count }, (_, i) =>
      CommentResponse.createDummy(i + 1, postId)
    );
  }
}

module.exports = CommentResponse;
