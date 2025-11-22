import Axios from "./base/axios.js";
import SignupRequest from "../dto/request/auth/SignupRequest.js";
import LoginRequest from "../dto/request/auth/LoginRequest.js";
import SignupResponse from "../dto/response/auth/SignupResponse.js";
import LoginResponse from "../dto/response/auth/LoginResponse.js";

// API 인스턴스 생성
const api = new Axios({
  baseURL: "http://localhost:8080",
});

/**
 * 회원가입
 * @param {SignupRequest} signupData - 회원가입 데이터
 * @returns {Promise<SignupResponse>} 생성된 사용자 정보
 */
export const signup = async (signupData) => {
  const res = await api.post("/auth/signup", signupData);
  console.log(res.data);
  return res.data;
};

/**
 * 로그인
 * @param {LoginRequest} loginData - 로그인 데이터
 * @returns {Promise<LoginResponse>} 로그인한 사용자 정보
 */
export const login = async (loginData) => {
  const res = await api.post("/auth/login", loginData);
  console.log(res.data);
  return res.data;
};

/**
 * 로그아웃
 * @returns {Promise<void>} 응답 없음 (204 No Content)
 */
export const logout = async () => {
  await api.post("/auth/logout");
};
