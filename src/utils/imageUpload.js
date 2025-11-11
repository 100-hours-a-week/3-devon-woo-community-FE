/**
 * 이미지 업로드 유틸리티
 *
 * Cloudinary 서비스를 사용하는 고수준 이미지 업로드 함수 제공
 * 프로필 이미지, 게시글 이미지 등에서 재사용 가능
 */

import cloudinaryService from '../services/cloudinary.js';

/**
 * 이미지 업로드
 *
 * @param {File} file - 업로드할 이미지 파일
 * @param {string} type - 이미지 타입 ('profile' | 'post')
 * @param {Function} onProgress - 업로드 진행률 콜백 (선택)
 * @returns {Promise<string>} 업로드된 이미지 URL
 *
 * @example
 * try {
 *   const imageUrl = await uploadImage(file, 'profile', (progress) => {
 *     console.log(`업로드 진행률: ${progress}%`);
 *   });
 *   console.log('업로드 완료:', imageUrl);
 * } catch (error) {
 *   console.error('업로드 실패:', error.message);
 * }
 */
export const uploadImage = async (file, type = 'profile', onProgress = null) => {
  if (!file) {
    throw new Error('파일이 선택되지 않았습니다.');
  }

  try {
    // Cloudinary 서비스를 통해 업로드
    const imageUrl = await cloudinaryService.upload(file, type, onProgress);
    return imageUrl;
  } catch (error) {
    // 에러를 상위로 전파
    throw error;
  }
};

/**
 * 프로필 이미지 업로드
 *
 * @param {File} file - 업로드할 프로필 이미지
 * @param {Function} onProgress - 업로드 진행률 콜백 (선택)
 * @returns {Promise<string>} 업로드된 이미지 URL
 */
export const uploadProfileImage = async (file, onProgress = null) => {
  return uploadImage(file, 'profile', onProgress);
};

/**
 * 게시글 이미지 업로드
 *
 * @param {File} file - 업로드할 게시글 이미지
 * @param {Function} onProgress - 업로드 진행률 콜백 (선택)
 * @returns {Promise<string>} 업로드된 이미지 URL
 */
export const uploadPostImage = async (file, onProgress = null) => {
  return uploadImage(file, 'post', onProgress);
};

/**
 * 파일 유효성 검사만 수행 (업로드는 하지 않음)
 *
 * @param {File} file - 검사할 파일
 * @param {string} type - 파일 타입 ('profile' | 'post')
 * @returns {{valid: boolean, error: string|null}}
 */
export const validateImageFile = (file, type = 'profile') => {
  return cloudinaryService.validateFile(file, type);
};
