/**
 * 게시글 수정 요청 DTO
 * @class PostUpdateRequest
 */
class PostUpdateRequest {
  /**
   * @param {Object} params
   * @param {number} params.memberId - 작성자 ID
   * @param {string} params.title - 제목
   * @param {string} params.content - 내용
   * @param {string} [params.image] - 이미지 URL
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
   * @returns {PostUpdateRequest}
   */
  static createDummy(seed = 1, memberId = 1) {
    return new PostUpdateRequest({
      memberId,
      title: `Updated Post Title #${seed}`,
      content: `This is the updated content for post #${seed}. The content has been modified with new information.`,
      image: `https://picsum.photos/seed/updatepost${seed}/800/400`,
      summary: '업데이트된 요약입니다.',
      tags: ['Update', 'Refactor'],
      seriesId: null,
      visibility: 'public',
      isDraft: false,
      commentsAllowed: true
    });
  }

  /**
   * 기본 더미 데이터
   * @returns {PostUpdateRequest}
   */
  static createDefault() {
    return PostUpdateRequest.createDummy(1);
  }
}

export default PostUpdateRequest;
