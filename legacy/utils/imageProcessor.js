/**
 * 이미지 처리 유틸리티
 *
 * 브라우저에서 Canvas API를 사용하여 이미지를 리사이즈, 크롭, WebP 변환
 */

/**
 * File을 Image 객체로 로드
 *
 * @param {File} file - 이미지 파일
 * @returns {Promise<HTMLImageElement>}
 */
const loadImage = (file) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('이미지 로드 실패'));
    };

    img.src = url;
  });
};

/**
 * Canvas를 Blob으로 변환
 *
 * @param {HTMLCanvasElement} canvas - Canvas 요소
 * @param {number} quality - 압축 품질 (0-1)
 * @returns {Promise<Blob>}
 */
const canvasToBlob = (canvas, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Blob 변환 실패'));
        }
      },
      'image/webp',
      quality
    );
  });
};

/**
 * 프로필 이미지 처리
 * - 중앙 기준 정사각형 크롭
 * - 100x100 리사이즈
 * - WebP 변환 및 압축
 *
 * @param {File} file - 원본 이미지 파일
 * @returns {Promise<File>} 처리된 이미지 파일
 */
export const processProfileImage = async (file) => {
  try {
    console.log('[ImageProcessor] 프로필 이미지 처리 시작:', file.name);

    // 1. 이미지 로드
    const img = await loadImage(file);
    console.log('[ImageProcessor] 원본 크기:', img.width, 'x', img.height);

    // 2. Canvas 생성
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // 3. 정사각형 크롭을 위한 계산
    const size = Math.min(img.width, img.height);
    const sourceX = (img.width - size) / 2;
    const sourceY = (img.height - size) / 2;

    // 4. 최종 크기 설정 (100x100)
    const targetSize = 100;
    canvas.width = targetSize;
    canvas.height = targetSize;

    // 5. 이미지 그리기 (크롭 + 리사이즈)
    ctx.drawImage(
      img,
      sourceX, sourceY, size, size,  // 원본에서 잘라낼 영역
      0, 0, targetSize, targetSize    // Canvas에 그릴 영역
    );

    console.log('[ImageProcessor] 처리 완료 크기:', targetSize, 'x', targetSize);

    // 6. WebP로 변환 (품질 0.8)
    const blob = await canvasToBlob(canvas, 0.8);

    // 7. File 객체로 변환
    const processedFile = new File(
      [blob],
      file.name.replace(/\.[^/.]+$/, '.webp'),
      { type: 'image/webp' }
    );

    console.log('[ImageProcessor] 원본 크기:', (file.size / 1024).toFixed(2), 'KB');
    console.log('[ImageProcessor] 처리 후 크기:', (processedFile.size / 1024).toFixed(2), 'KB');

    return processedFile;
  } catch (error) {
    console.error('[ImageProcessor] 프로필 이미지 처리 실패:', error);
    throw new Error('이미지 처리에 실패했습니다.');
  }
};

/**
 * 포스트 이미지 처리
 * - 크롭 없음
 * - 너비 600px 리사이즈 (높이는 비율 유지)
 * - WebP 변환 및 압축
 *
 * @param {File} file - 원본 이미지 파일
 * @returns {Promise<File>} 처리된 이미지 파일
 */
export const processPostImage = async (file) => {
  try {
    console.log('[ImageProcessor] 포스트 이미지 처리 시작:', file.name);

    // 1. 이미지 로드
    const img = await loadImage(file);
    console.log('[ImageProcessor] 원본 크기:', img.width, 'x', img.height);

    // 2. Canvas 생성
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // 3. 리사이즈 계산 (너비 600px, 높이는 비율 유지)
    const targetWidth = 600;
    const scale = targetWidth / img.width;
    const targetHeight = Math.round(img.height * scale);

    // 원본이 이미 600px보다 작으면 원본 크기 사용
    if (img.width <= targetWidth) {
      canvas.width = img.width;
      canvas.height = img.height;
    } else {
      canvas.width = targetWidth;
      canvas.height = targetHeight;
    }

    console.log('[ImageProcessor] 리사이즈 크기:', canvas.width, 'x', canvas.height);

    // 4. 이미지 그리기 (리사이즈)
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // 5. WebP로 변환 (품질 0.85)
    const blob = await canvasToBlob(canvas, 0.85);

    // 6. File 객체로 변환
    const processedFile = new File(
      [blob],
      file.name.replace(/\.[^/.]+$/, '.webp'),
      { type: 'image/webp' }
    );

    console.log('[ImageProcessor] 원본 크기:', (file.size / 1024).toFixed(2), 'KB');
    console.log('[ImageProcessor] 처리 후 크기:', (processedFile.size / 1024).toFixed(2), 'KB');

    return processedFile;
  } catch (error) {
    console.error('[ImageProcessor] 포스트 이미지 처리 실패:', error);
    throw new Error('이미지 처리에 실패했습니다.');
  }
};

/**
 * 이미지 타입에 따라 적절한 처리 함수 선택
 *
 * @param {File} file - 원본 이미지 파일
 * @param {string} type - 이미지 타입 ('profile' | 'post')
 * @returns {Promise<File>} 처리된 이미지 파일
 */
export const processImage = async (file, type = 'profile') => {
  if (type === 'profile') {
    return processProfileImage(file);
  } else if (type === 'post') {
    return processPostImage(file);
  } else {
    throw new Error(`지원하지 않는 이미지 타입: ${type}`);
  }
};
