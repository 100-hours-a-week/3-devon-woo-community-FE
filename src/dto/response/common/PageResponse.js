/**
 * 페이지네이션 응답 DTO
 * @class PageResponse
 * @template T
 */
class PageResponse {
  /**
   * @param {Object} params
   * @param {T[]} params.items - 데이터 배열
   * @param {number} params.page - 현재 페이지 번호 (0-based)
   * @param {number} params.size - 페이지 크기
   * @param {number} params.totalElements - 전체 데이터 개수
   * @param {number} params.totalPages - 전체 페이지 수
   */
  constructor({ items, page, size, totalElements, totalPages }) {
    this.items = items;
    this.page = page;
    this.size = size;
    this.totalElements = totalElements;
    this.totalPages = totalPages;
  }

  /**
   * 더미 데이터를 생성하는 정적 팩토리 메서드
   * @template T
   * @param {T[]} items - 데이터 배열
   * @param {number} page - 현재 페이지 번호
   * @param {number} size - 페이지 크기
   * @param {number} totalElements - 전체 데이터 개수
   * @returns {PageResponse<T>}
   */
  static createDummy(items, page = 0, size = 20, totalElements = 100) {
    const totalPages = Math.ceil(totalElements / size);
    return new PageResponse({
      items,
      page,
      size,
      totalElements,
      totalPages,
    });
  }

  /**
   * 기본 더미 데이터 (빈 페이지)
   * @returns {PageResponse<any>}
   */
  static createDefault() {
    return new PageResponse({
      items: [],
      page: 0,
      size: 20,
      totalElements: 0,
      totalPages: 0,
    });
  }

  /**
   * PostSummaryResponse 더미 페이지 생성
   * @param {number} count - 생성할 아이템 개수
   * @returns {PageResponse}
   */
  static createPostSummaryPage(count = 20) {
    const PostSummaryResponse = require("../post/PostSummaryResponse");
    const items = PostSummaryResponse.createDummyList(count);
    return PageResponse.createDummy(items, 0, count, 100);
  }

  /**
   * CommentResponse 더미 페이지 생성
   * @param {number} count - 생성할 아이템 개수
   * @param {number} postId - 게시글 ID
   * @returns {PageResponse}
   */
  static createCommentPage(count = 10, postId = 1) {
    const CommentResponse = require("../comment/CommentResponse");
    const items = CommentResponse.createDummyList(count, postId);
    return PageResponse.createDummy(items, 0, count, 50);
  }

  /**
   * 다음 페이지 존재 여부
   * @returns {boolean}
   */
  hasNext() {
    return this.page < this.totalPages - 1;
  }

  /**
   * 이전 페이지 존재 여부
   * @returns {boolean}
   */
  hasPrevious() {
    return this.page > 0;
  }

  /**
   * 첫 페이지 여부
   * @returns {boolean}
   */
  isFirst() {
    return this.page === 0;
  }

  /**
   * 마지막 페이지 여부
   * @returns {boolean}
   */
  isLast() {
    return this.page === this.totalPages - 1;
  }
}

module.exports = PageResponse;
