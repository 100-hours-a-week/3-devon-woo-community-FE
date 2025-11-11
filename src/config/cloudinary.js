/**
 * Cloudinary 설정
 *
 * 이미지 업로드 관련 설정을 관리합니다.
 */

const CloudinaryConfig = {
  // Cloudinary cloud name (환경에 따라 수정)
  cloudName: 'your-cloud-name', // TODO: 실제 cloud name으로 변경

  // API 엔드포인트
  signEndpoint: '/api/v1/images/sign',

  // 업로드 폴더 구조
  folders: {
    profile: 'profiles',
    post: 'posts',
  },

  // 파일 크기 제한 (bytes)
  maxFileSize: {
    profile: 5 * 1024 * 1024, // 5MB
    post: 10 * 1024 * 1024,   // 10MB
  },

  // 허용 파일 타입
  allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'],

  // 에러 메시지
  errorMessages: {
    invalidType: '이미지 파일만 업로드 가능합니다. (JPEG, PNG, GIF)',
    fileTooLarge: '파일 크기가 너무 큽니다.',
    uploadFailed: '이미지 업로드에 실패했습니다.',
    signatureFailed: '업로드 인증에 실패했습니다.',
    networkError: '네트워크 오류가 발생했습니다.',
  },
};

export default CloudinaryConfig;
