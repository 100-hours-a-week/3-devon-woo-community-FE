import Axios from "./base/axios.js";
import SeriesResponse from "../dto/response/post/SeriesResponse.js";

const api = new Axios({
  baseURL: "http://localhost:8080",
});

/**
 * 시리즈 목록 조회
 * @param {Object} params
 * @param {number} [params.memberId]
 * @returns {Promise<SeriesResponse[]>}
 */
export const getSeriesList = async ({ memberId } = {}) => {
  const query = new URLSearchParams();
  if (memberId) {
    query.set('memberId', memberId.toString());
  }
  const queryString = query.toString();
  const res = await api.get(`/api/v1/series${queryString ? `?${queryString}` : ''}`);
  return res.data;
};

/**
 * 시리즈 생성
 * @param {{ name: string, description?: string }} payload
 * @returns {Promise<SeriesResponse>}
 */
export const createSeries = async (payload) => {
  const res = await api.post('/api/v1/series', payload);
  return res.data;
};

export default {
  getSeriesList,
  createSeries,
};
