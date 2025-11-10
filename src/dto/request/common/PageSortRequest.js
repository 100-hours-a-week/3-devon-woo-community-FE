/**
 * 페이지네이션 및 정렬 요청 DTO
 * @class PageSortRequest
 */
class PageSortRequest {
  /**
   * @param {Object} params
   * @param {number} [params.page=0] - 페이지 번호 (0-based)
   * @param {number} [params.size=20] - 페이지 크기
   * @param {string[]} [params.sort=["createdAt,desc"]] - 정렬 조건 배열
   */
  constructor({ page = 0, size = 20, sort = ["createdAt,desc"] } = {}) {
    this.page = page;
    this.size = size;
    this.sort = Array.isArray(sort) ? sort : [sort];
  }

  /**
   * URL 쿼리 파라미터로 변환
   * @returns {string} - 쿼리 문자열 (예: "page=0&size=20&sort=createdAt,desc")
   */
  toQueryString() {
    const params = new URLSearchParams();
    params.append("page", this.page.toString());
    params.append("size", this.size.toString());
    this.sort.forEach((s) => params.append("sort", s));
    return params.toString();
  }

  /**
   * URLSearchParams 객체로 변환
   * @returns {URLSearchParams}
   */
  toURLSearchParams() {
    const params = new URLSearchParams();
    params.append("page", this.page.toString());
    params.append("size", this.size.toString());
    this.sort.forEach((s) => params.append("sort", s));
    return params;
  }

  /**
   * 더미 데이터를 생성하는 정적 팩토리 메서드
   * @param {number} page - 페이지 번호
   * @param {number} size - 페이지 크기
   * @param {string[]} sort - 정렬 조건
   * @returns {PageSortRequest}
   */
  static createDummy(page = 0, size = 20, sort = ["createdAt,desc"]) {
    return new PageSortRequest({ page, size, sort });
  }

  /**
   * 기본 더미 데이터 (첫 페이지, 20개, 생성일 기준 내림차순)
   * @returns {PageSortRequest}
   */
  static createDefault() {
    return new PageSortRequest();
  }

  /**
   * 댓글용 기본 페이지네이션 (10개, 생성일 기준 오름차순)
   * @returns {PageSortRequest}
   */
  static createForComments() {
    return new PageSortRequest({
      page: 0,
      size: 10,
      sort: ["createdAt,asc"],
    });
  }

  /**
   * 인기순 정렬 페이지네이션
   * @returns {PageSortRequest}
   */
  static createPopularSort() {
    return new PageSortRequest({
      page: 0,
      size: 20,
      sort: ["likes,desc", "views,desc"],
    });
  }
}

export default PageSortRequest;
