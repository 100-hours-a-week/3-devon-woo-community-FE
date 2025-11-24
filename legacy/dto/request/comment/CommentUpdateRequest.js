/**
 * 댓글 수정 요청 DTO
 * @class CommentUpdateRequest
 */
class CommentUpdateRequest {
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
   * @returns {CommentUpdateRequest}
   */
  static createDummy(seed = 1, memberId = 1) {
    return new CommentUpdateRequest({
      memberId,
      content: `Updated comment content #${seed}`,
    });
  }

  /**
   * 기본 더미 데이터
   * @returns {CommentUpdateRequest}
   */
  static createDefault() {
    return new CommentUpdateRequest({
      memberId: 1,
      content: "Updated comment content",
    });
  }
}

export default CommentUpdateRequest;
