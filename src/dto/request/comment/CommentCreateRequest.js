/**
 * 댓글 생성 요청 DTO
 * @class CommentCreateRequest
 */
class CommentCreateRequest {
  /**
   * @param {Object} params
   * @param {number} params.memberId - 작성자 ID
   * @param {string} params.content - 댓글 내용
   */
  constructor({ memberId, content }) {
    this.memberId = memberId;
    this.content = content;
  }

  /**
   * 더미 데이터를 생성하는 정적 팩토리 메서드
   * @param {number} seed - 더미 데이터 생성용 시드 (기본값: 1)
   * @param {number} memberId - 작성자 ID (기본값: 1)
   * @returns {CommentCreateRequest}
   */
  static createDummy(seed = 1, memberId = 1) {
    const comments = [
      "정말 유익한 글이네요! 감사합니다.",
      "궁금했던 내용인데 잘 정리해주셨네요.",
      "실무에 바로 적용해볼 수 있을 것 같습니다.",
      "이런 관점에서 생각해보지 못했는데 도움이 되었습니다.",
      "추가로 궁금한 점이 있는데 질문해도 될까요?",
      "Great post! Very helpful information.",
      "좋은 정보 공유해주셔서 감사합니다.",
      "다음 포스트도 기대하겠습니다!",
    ];

    const index = (seed - 1) % comments.length;

    return new CommentCreateRequest({
      memberId,
      content: comments[index],
    });
  }

  /**
   * 기본 더미 데이터
   * @returns {CommentCreateRequest}
   */
  static createDefault() {
    return new CommentCreateRequest({
      memberId: 1,
      content: "Great post!",
    });
  }
}

export default CommentCreateRequest;
