/**
 * Cloudinary Service
 *
 * Cloudinary를 사용한 이미지 업로드 서비스
 * Signed Upload 방식을 사용하여 보안성을 확보합니다.
 */

import { getCloudinarySignature } from '../api/cloudinary.js';
import CloudinaryConfig from '../config/cloudinary.js';

class CloudinaryService {
  /**
   * 파일 유효성 검사
   *
   * @param {File} file - 검사할 파일
   * @param {string} type - 파일 타입 ('profile' | 'post')
   * @returns {{valid: boolean, error: string|null}}
   */
  validateFile(file, type = 'profile') {
    if (!file) {
      return { valid: false, error: '파일이 선택되지 않았습니다.' };
    }

    // 파일 타입 검사
    if (!CloudinaryConfig.allowedTypes.includes(file.type)) {
      return { valid: false, error: CloudinaryConfig.errorMessages.invalidType };
    }

    // 파일 크기 검사
    const maxSize = CloudinaryConfig.maxFileSize[type] || CloudinaryConfig.maxFileSize.profile;
    if (file.size > maxSize) {
      const maxSizeMB = Math.round(maxSize / (1024 * 1024));
      return {
        valid: false,
        error: `${CloudinaryConfig.errorMessages.fileTooLarge} (최대 ${maxSizeMB}MB)`,
      };
    }

    return { valid: true, error: null };
  }

  /**
   * Cloudinary에 이미지 업로드
   *
   * @param {File} file - 업로드할 파일
   * @param {Object} options - 업로드 옵션
   * @param {string} options.type - 이미지 타입 ('profile' | 'post')
   * @param {Function} options.onProgress - 업로드 진행률 콜백 (선택)
   * @returns {Promise<string>} 업로드된 이미지의 secure_url
   */
  async uploadToCloudinary(file, options = {}) {
    const { type = 'profile', onProgress } = options;

    try {
      console.log('[Cloudinary] 업로드 시작:', file.name, '| 타입:', type);

      // 1단계: 서버에서 서명(signature) 발급 (type 전달)
      console.log('[Cloudinary] 서명 요청 중... (type:', type, ')');
      const signData = await getCloudinarySignature(type);

      if (!signData || !signData.signature) {
        throw new Error(CloudinaryConfig.errorMessages.signatureFailed);
      }

      // 백엔드가 서명 생성 시 사용한 파라미터 추출
      const {
        apiKey,
        cloudName,
        timestamp,
        signature,
        uploadPreset,
        folder: signedFolder,  // 백엔드가 서명에 사용한 folder
        publicId: signedPublicId,  // 백엔드가 서명에 사용한 public_id (있다면)
        ...otherSignedParams  // 기타 서명에 사용된 파라미터
      } = signData;

      console.log('[Cloudinary] 서명 발급 완료');
      console.log('[Cloudinary] 백엔드 서명 데이터:', {
        apiKey,
        cloudName,
        timestamp,
        signature: signature.substring(0, 20) + '...',
        uploadPreset,
        signedFolder,
        signedPublicId,
        otherSignedParams
      });

      // 2단계: FormData 생성
      // ★ 중요: 백엔드가 서명 생성에 사용한 파라미터만 추가해야 함!
      const formData = new FormData();
      formData.append('file', file);  // file은 서명에 포함되지 않음
      formData.append('api_key', apiKey);
      formData.append('timestamp', timestamp);
      formData.append('signature', signature);

      // upload_preset (백엔드가 서명에 포함했다면 추가)
      if (uploadPreset) {
        formData.append('upload_preset', uploadPreset);
      }

      // folder (백엔드가 서명에 포함했다면 추가)
      if (signedFolder) {
        formData.append('folder', signedFolder);
      }

      // public_id (백엔드가 서명에 포함했다면 추가)
      if (signedPublicId) {
        formData.append('public_id', signedPublicId);
      }

      // 기타 서명된 파라미터 추가 (백엔드가 추가로 서명한 것들)
      Object.keys(otherSignedParams).forEach(key => {
        if (otherSignedParams[key] !== undefined && otherSignedParams[key] !== null) {
          formData.append(key, otherSignedParams[key]);
        }
      });

      // FormData 내용 확인 (디버깅용)
      console.log('[Cloudinary] FormData 내용:');
      for (let [key, value] of formData.entries()) {
        if (key === 'file') {
          console.log(`  ${key}: [File] ${value.name}`);
        } else {
          console.log(`  ${key}: ${value}`);
        }
      }

      // 3단계: Cloudinary로 직접 업로드
      // image/upload 또는 auto/upload 사용 (auto는 자동 타입 감지)
      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
      console.log('[Cloudinary] 업로드 요청:', cloudinaryUrl);

      const xhr = new XMLHttpRequest();

      // 프로미스로 래핑
      const uploadPromise = new Promise((resolve, reject) => {
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable && onProgress) {
            const percentComplete = Math.round((e.loaded / e.total) * 100);
            onProgress(percentComplete);
          }
        });

        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const response = JSON.parse(xhr.responseText);
              resolve(response);
            } catch (error) {
              reject(new Error('응답 파싱 실패'));
            }
          } else {
            reject(new Error(`업로드 실패: ${xhr.status}`));
          }
        });

        xhr.addEventListener('error', () => {
          reject(new Error(CloudinaryConfig.errorMessages.networkError));
        });

        xhr.addEventListener('abort', () => {
          reject(new Error('업로드가 취소되었습니다.'));
        });

        xhr.open('POST', cloudinaryUrl);
        xhr.send(formData);
      });

      const uploadResult = await uploadPromise;

      console.log('[Cloudinary] 업로드 성공:', uploadResult.secure_url);

      // secure_url 반환 (HTTPS URL)
      return uploadResult.secure_url || uploadResult.url;
    } catch (error) {
      console.error('[Cloudinary] 업로드 실패:', error);

      if (error.message.includes('서명')) {
        throw error;
      } else if (error.message.includes('네트워크')) {
        throw error;
      } else {
        throw new Error(CloudinaryConfig.errorMessages.uploadFailed);
      }
    }
  }

  /**
   * 이미지 업로드 (검증 포함)
   *
   * @param {File} file - 업로드할 파일
   * @param {string} type - 파일 타입 ('profile' | 'post')
   * @param {Function} onProgress - 업로드 진행률 콜백 (선택)
   * @returns {Promise<string>} 업로드된 이미지 URL
   */
  async upload(file, type = 'profile', onProgress = null) {
    // 파일 검증
    const validation = this.validateFile(file, type);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    // 업로드 실행 (type을 전달하여 백엔드가 적절한 folder로 서명 생성)
    return await this.uploadToCloudinary(file, { type, onProgress });
  }
}

// 싱글톤 인스턴스 생성
const cloudinaryService = new CloudinaryService();

export default cloudinaryService;
