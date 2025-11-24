import Axios from "./base/axios.js";
import TagSummaryResponse from "../dto/response/post/TagSummaryResponse.js";

const api = new Axios({
  baseURL: "http://localhost:8080",
});

/**
 * 인기 태그 조회
 * @param {Object} params
 * @param {number} [params.limit=20] - 조회할 태그 수
 * @returns {Promise<TagSummaryResponse[]>}
 */
export const getPopularTags = async ({ limit = 20 } = {}) => {
  const query = new URLSearchParams({
    limit: limit.toString(),
  });
  const res = await api.get(`/api/v1/tags?${query.toString()}`);
  return res.data;
};

export default {
  getPopularTags,
};
