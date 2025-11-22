import Axios from "./base/axios.js";
import CommentCreateRequest from "../dto/request/comment/CommentCreateRequest.js";
import CommentUpdateRequest from "../dto/request/comment/CommentUpdateRequest.js";
import CommentResponse from "../dto/response/comment/CommentResponse.js";
import PageResponse from "../dto/response/common/PageResponse.js";

// API 인스턴스 생성
const api = new Axios({
  baseURL: "http://localhost:8080",
});

/**
 * 댓글 생성
 * @param {number} postId - 게시글 ID
 * @param {CommentCreateRequest} commentData - 댓글 데이터
 * @returns {Promise<CommentResponse>} 생성된 댓글 정보
 */
export const createComment = async (postId, commentData) => {
  const res = await api.post(`/api/v1/posts/${postId}/comments`, commentData);
  return res.data;
};

/**
 * 게시글의 댓글 목록 조회 (페이지네이션)
 * @param {number} postId - 게시글 ID
 * @param {Object} params - 페이지네이션 파라미터
 * @param {number} [params.page=0] - 페이지 번호 (0-based)
 * @param {number} [params.size=10] - 페이지 크기
 * @param {string} [params.sort='createdAt,asc'] - 정렬 기준
 * @returns {Promise<PageResponse<CommentResponse>>} 댓글 목록
 */
export const getComments = async (postId, { page = 0, size = 10, sort = "createdAt,asc" } = {}) => {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    sort: sort,
  });
  const res = await api.get(`/api/v1/posts/${postId}/comments?${queryParams.toString()}`);
  return res.data;
};

/**
 * 특정 댓글 조회
 * @param {number} commentId - 댓글 ID
 * @returns {Promise<CommentResponse>} 댓글 정보
 */
export const getCommentById = async (commentId) => {
  const res = await api.get(`/api/v1/comments/${commentId}`);
  return res.data;
};

/**
 * 댓글 수정
 * @param {number} commentId - 댓글 ID
 * @param {CommentUpdateRequest} updateData - 수정할 데이터
 * @returns {Promise<CommentResponse>} 수정된 댓글 정보
 */
export const updateComment = async (commentId, updateData) => {
  const res = await api.patch(`/api/v1/comments/${commentId}`, updateData);
  return res.data;
};

/**
 * 댓글 삭제
 * @param {number} commentId - 댓글 ID
 * @param {number} memberId - 회원 ID
 * @returns {Promise<void>} 응답 없음 (204 No Content)
 */
export const deleteComment = async (commentId, memberId) => {
  await api.delete(`/api/v1/comments/${commentId}?memberId=${memberId}`);
};
