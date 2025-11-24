import Axios from "./base/axios.js";
import PostCreateRequest from "../dto/request/post/PostCreateRequest.js";
import PostUpdateRequest from "../dto/request/post/PostUpdateRequest.js";
import PostResponse from "../dto/response/post/PostResponse.js";
import PostSummaryResponse from "../dto/response/post/PostSummaryResponse.js";
import PageResponse from "../dto/response/common/PageResponse.js";

// API 인스턴스 생성
const api = new Axios({
  baseURL: "http://localhost:8080",
});

/**
 * 게시글 생성
 * @param {PostCreateRequest} postData - 게시글 데이터
 * @returns {Promise<PostResponse>} 생성된 게시글 정보
 */
export const createPost = async (postData) => {
  const res = await api.post("/api/v1/posts", postData);
  return res.data;
};

/**
 * 게시글 목록 조회 (페이지네이션)
 * @param {Object} params - 페이지네이션 파라미터
 * @param {number} [params.page=0] - 페이지 번호 (0-based)
 * @param {number} [params.size=20] - 페이지 크기
 * @param {string} [params.sort='createdAt,desc'] - 정렬 기준
 * @param {number} [params.memberId] - 회원 ID (특정 회원의 게시글만 조회)
 * @returns {Promise<PageResponse<PostSummaryResponse>>} 게시글 목록
 */
export const getPosts = async ({ page = 0, size = 20, sort = "createdAt,desc", memberId } = {}) => {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    sort: sort,
  });

  if (memberId !== undefined && memberId !== null) {
    queryParams.append('memberId', memberId.toString());
  }

  const res = await api.get(`/api/v1/posts?${queryParams.toString()}`);
  return res.data;
};

/**
 * 게시글 상세 조회
 * @param {number} postId - 게시글 ID
 * @param {number} [memberId] - 조회하는 회원 ID (선택적)
 * @returns {Promise<PostResponse>} 게시글 상세 정보
 */
export const getPostById = async (postId, memberId = null) => {
  const queryParams = memberId ? `?memberId=${memberId}` : "";
  const res = await api.get(`/api/v1/posts/${postId}${queryParams}`);
  return res.data;
};

/**
 * 게시글 수정
 * @param {number} postId - 게시글 ID
 * @param {PostUpdateRequest} updateData - 수정할 데이터
 * @returns {Promise<PostResponse>} 수정된 게시글 정보
 */
export const updatePost = async (postId, updateData) => {
  const res = await api.patch(`/api/v1/posts/${postId}`, updateData);
  return res.data;
};

/**
 * 게시글 삭제
 * @param {number} postId - 게시글 ID
 * @param {number} memberId - 회원 ID
 * @returns {Promise<void>} 응답 없음 (204 No Content)
 */
export const deletePost = async (postId, memberId) => {
  await api.delete(`/api/v1/posts/${postId}?memberId=${memberId}`);
};

/**
 * 게시글 좋아요
 * @param {number} postId - 게시글 ID
 * @param {number} memberId - 회원 ID
 * @returns {Promise<void>} 응답 없음 (204 No Content)
 */
export const likePost = async (postId, memberId) => {
  await api.post(`/api/v1/posts/${postId}/like?memberId=${memberId}`);
};

/**
 * 게시글 좋아요 취소
 * @param {number} postId - 게시글 ID
 * @param {number} memberId - 회원 ID
 * @returns {Promise<void>} 응답 없음 (204 No Content)
 */
export const unlikePost = async (postId, memberId) => {
  await api.delete(`/api/v1/posts/${postId}/like?memberId=${memberId}`);
};

/**
 * 추천 게시글 조회 (고정 3개)
 * @param {number} postId - 현재 게시글 ID
 * @returns {Promise<PostSummaryResponse[]>} 추천 게시글 목록 (3개)
 */
export const getRecommendedPosts = async (postId) => {
  const res = await api.get(`/api/v1/posts/${postId}/recommendations`);
  return res.data;
};
