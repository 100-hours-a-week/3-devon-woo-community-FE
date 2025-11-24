import Axios from "./base/axios.js";
import MemberUpdateRequest from "../dto/request/member/MemberUpdateRequest.js";
import PasswordUpdateRequest from "../dto/request/member/PasswordUpdateRequest.js";
import MemberResponse from "../dto/response/member/MemberResponse.js";
import MemberUpdateResponse from "../dto/response/member/MemberUpdateResponse.js";

// API 인스턴스 생성
const api = new Axios({
  baseURL: "http://localhost:8080",
});

/**
 * 회원 프로필 조회
 * @param {number} id - 회원 ID
 * @returns {Promise<MemberResponse>} 회원 프로필 정보
 */
export const getMemberProfile = async (id) => {
  const res = await api.get(`/api/v1/members/${id}`);
  return res.data;
};

/**
 * 회원 프로필 수정
 * @param {number} id - 회원 ID
 * @param {MemberUpdateRequest} updateData - 수정할 프로필 데이터
 * @returns {Promise<MemberUpdateResponse>} 수정된 프로필 정보
 */
export const updateMemberProfile = async (id, updateData) => {
  const res = await api.patch(`/api/v1/members/${id}`, updateData);
  return res.data;
};

/**
 * 비밀번호 변경
 * @param {number} id - 회원 ID
 * @param {PasswordUpdateRequest} passwordData - 비밀번호 데이터
 * @returns {Promise<void>} 응답 없음 (204 No Content)
 */
export const updatePassword = async (id, passwordData) => {
  await api.patch(`/api/v1/members/${id}/password`, passwordData);
};

/**
 * 회원 탈퇴
 * @param {number} id - 회원 ID
 * @returns {Promise<void>} 응답 없음 (204 No Content)
 */
export const deleteMember = async (id) => {
  await api.delete(`/api/v1/members/${id}`);
};
