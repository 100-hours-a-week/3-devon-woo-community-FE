/**
 * API 응답 래퍼 DTO
 * @class ApiResponse
 * @template T
 */
class ApiResponse {
  /**
   * @param {Object} params
   * @param {boolean} params.success - 성공 여부
   * @param {string|null} params.message - 응답 메시지
   * @param {T|null} params.data - 응답 데이터
   * @param {Array<{field: string, message: string}>|null} params.errors - 에러 목록
   */
  constructor({ success, message = null, data = null, errors = null }) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.errors = errors;
  }

  /**
   * 성공 응답 생성 (데이터 없음)
   * @returns {ApiResponse<null>}
   */
  static success() {
    return new ApiResponse({
      success: true,
      message: null,
      data: null,
      errors: null,
    });
  }

  /**
   * 성공 응답 생성 (데이터 포함)
   * @template T
   * @param {T} data - 응답 데이터
   * @param {string|null} message - 응답 메시지
   * @returns {ApiResponse<T>}
   */
  static successWithData(data, message = null) {
    return new ApiResponse({
      success: true,
      message,
      data,
      errors: null,
    });
  }

  /**
   * 실패 응답 생성
   * @param {string} message - 에러 메시지
   * @param {Array<{field: string, message: string}>|null} errors - 에러 목록
   * @returns {ApiResponse<null>}
   */
  static failure(message, errors = null) {
    return new ApiResponse({
      success: false,
      message,
      data: null,
      errors,
    });
  }

  /**
   * 유효성 검증 실패 응답 생성
   * @param {Array<{field: string, message: string}>} errors - 에러 목록
   * @returns {ApiResponse<null>}
   */
  static validationFailure(errors) {
    return new ApiResponse({
      success: false,
      message: "Validation failed",
      data: null,
      errors,
    });
  }

  /**
   * 로그인 성공 더미 응답
   * @returns {Promise<ApiResponse>}
   */
  static async createLoginSuccess() {
    const LoginResponse = (await import("../auth/LoginResponse.js")).default;
    return ApiResponse.successWithData(LoginResponse.createDefault());
  }

  /**
   * 회원가입 성공 더미 응답
   * @returns {Promise<ApiResponse>}
   */
  static async createSignupSuccess() {
    const SignupResponse = (await import("../auth/SignupResponse.js")).default;
    return ApiResponse.successWithData(SignupResponse.createDefault());
  }

  /**
   * 게시글 목록 더미 응답
   * @param {number} count - 생성할 게시글 개수
   * @returns {Promise<ApiResponse>}
   */
  static async createPostListSuccess(count = 20) {
    const PageResponse = (await import("./PageResponse.js")).default;
    return ApiResponse.successWithData(
      await PageResponse.createPostSummaryPage(count)
    );
  }

  /**
   * 게시글 상세 더미 응답
   * @param {number} postId - 게시글 ID
   * @returns {Promise<ApiResponse>}
   */
  static async createPostDetailSuccess(postId = 1) {
    const PostResponse = (await import("../post/PostResponse.js")).default;
    return ApiResponse.successWithData(PostResponse.createDummy(postId));
  }

  /**
   * 댓글 목록 더미 응답
   * @param {number} count - 생성할 댓글 개수
   * @param {number} postId - 게시글 ID
   * @returns {Promise<ApiResponse>}
   */
  static async createCommentListSuccess(count = 10, postId = 1) {
    const PageResponse = (await import("./PageResponse.js")).default;
    return ApiResponse.successWithData(
      await PageResponse.createCommentPage(count, postId)
    );
  }

  /**
   * 유효성 검증 실패 더미 응답
   * @returns {ApiResponse<null>}
   */
  static createValidationError() {
    return ApiResponse.validationFailure([
      {
        field: "email",
        message: "올바른 이메일 형식이 아닙니다",
      },
      {
        field: "password",
        message: "비밀번호는 최소 8자 이상이어야 합니다",
      },
    ]);
  }

  /**
   * 인증 실패 더미 응답
   * @returns {ApiResponse<null>}
   */
  static createAuthError() {
    return ApiResponse.failure("인증에 실패했습니다");
  }

  /**
   * 리소스 없음 더미 응답
   * @returns {ApiResponse<null>}
   */
  static createNotFoundError() {
    return ApiResponse.failure("요청한 리소스를 찾을 수 없습니다");
  }
}

export default ApiResponse;
