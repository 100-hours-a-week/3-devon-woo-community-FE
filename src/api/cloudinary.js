import Axios from "./base/axios.js";
import CloudinaryConfig from "../config/cloudinary.js";

// API 인스턴스 생성
const api = new Axios({
  baseURL: "http://localhost:8080",
});

/**
 * Cloudinary 업로드를 위한 서명(signature) 요청
 *
 * @param {string} type - 이미지 타입 ('profile' | 'post')
 * @returns {Promise<{apiKey: string, cloudName: string, timestamp: number, signature: string, uploadPreset: string, folder?: string}>}
 */
export const getCloudinarySignature = async (type = 'profile') => {
  try {
    // type을 쿼리 파라미터로 전달하여 백엔드가 적절한 folder로 서명 생성
    const res = await api.get(`${CloudinaryConfig.signEndpoint}?type=${type}`);
    return res.data;
  } catch (error) {
    console.error('[Cloudinary API] 서명 요청 실패:', error);
    throw new Error(CloudinaryConfig.errorMessages.signatureFailed);
  }
};
