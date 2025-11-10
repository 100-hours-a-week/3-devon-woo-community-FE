import Axioxs from "./base/axios.js";

// API 인스턴스 생성
const api = new Axioxs({
  baseURL: "https://jsonplaceholder.typicode.com",
  headers: {
    "Authorization": "Bearer your-token-here"
  }
});

/**
 * @typedef {Object} User
 * @property {number} id - 사용자 ID
 * @property {string} name - 사용자 이름
 * @property {string} email - 이메일
 */

/**
 * @typedef {Object} CreateUserDTO
 * @property {string} name - 사용자 이름
 * @property {string} email - 이메일
 */

/**
 * 사용자 목록 조회
 * @returns {Promise<User[]>} 사용자 배열
 */
export const getUsers = async () => {
  const res = await api.get("/users");
  return res.data;
};

/**
 * 특정 사용자 조회
 * @param {number} id - 사용자 ID
 * @returns {Promise<User>} 사용자 객체
 */
export const getUserById = async (id) => {
  const res = await api.get(`/users/${id}`);
  return res.data;
};

/**
 * 사용자 생성
 * @param {CreateUserDTO} userData - 생성할 사용자 데이터
 * @returns {Promise<User>} 생성된 사용자 객체
 */
export const createUser = async (userData) => {
  const res = await api.post("/users", userData);
  return res.data;
};

/**
 * 사용자 정보 전체 수정
 * @param {number} id - 사용자 ID
 * @param {CreateUserDTO} userData - 수정할 사용자 데이터
 * @returns {Promise<User>} 수정된 사용자 객체
 */
export const updateUser = async (id, userData) => {
  const res = await api.put(`/users/${id}`, userData);
  return res.data;
};

/**
 * 사용자 정보 부분 수정
 * @param {number} id - 사용자 ID
 * @param {Partial<CreateUserDTO>} userData - 수정할 사용자 데이터 (일부)
 * @returns {Promise<User>} 수정된 사용자 객체
 */
export const patchUser = async (id, userData) => {
  const res = await api.patch(`/users/${id}`, userData);
  return res.data;
};

/**
 * 사용자 삭제 (특수 에러 처리)
 * @param {number} id - 사용자 ID
 * @returns {Promise<any>} 삭제 결과 또는 에러 객체
 */
export const deleteUser = async (id) => {
  try {
    const res = await api.delete(`/users/${id}`);
    return res.data;
  } catch (error) {
    // 특정 API만 에러를 변환하여 반환
    if (error.response?.data) {
      return error.response.data;
    }
    return { error: "사용자 삭제에 실패했습니다." };
  }
};
