import { URL_PATTERN } from './patterns.js';
import { VALIDATION_MESSAGES } from './messages.js';

/**
 * PostCreateRequest 유효성 검증
 * @param {import('../dto/request/post/PostCreateRequest')} dto
 * @returns {Array<{field: string, message: string}>} 에러 배열 (빈 배열이면 유효함)
 */
export function validatePostCreateRequest(dto) {
  const errors = [];

  if (dto.memberId == null) {
    errors.push({
      field: "memberId",
      message: VALIDATION_MESSAGES.REQUIRED_MEMBER_ID,
    });
  }

  if (!dto.title) {
    errors.push({
      field: "title",
      message: VALIDATION_MESSAGES.REQUIRED_POST_TITLE,
    });
  }

  if (!dto.content) {
    errors.push({
      field: "content",
      message: VALIDATION_MESSAGES.REQUIRED_POST_CONTENT,
    });
  }

  if (dto.image && !URL_PATTERN.test(dto.image)) {
    errors.push({
      field: "image",
      message: VALIDATION_MESSAGES.INVALID_IMAGE_URL,
    });
  }

  return errors;
}

/**
 * PostUpdateRequest 유효성 검증
 * @param {import('../dto/request/post/PostUpdateRequest')} dto
 * @returns {Array<{field: string, message: string}>} 에러 배열 (빈 배열이면 유효함)
 */
export function validatePostUpdateRequest(dto) {
  const errors = [];

  if (dto.memberId == null) {
    errors.push({
      field: "memberId",
      message: VALIDATION_MESSAGES.REQUIRED_MEMBER_ID,
    });
  }

  if (!dto.title) {
    errors.push({
      field: "title",
      message: VALIDATION_MESSAGES.REQUIRED_POST_TITLE,
    });
  }

  if (!dto.content) {
    errors.push({
      field: "content",
      message: VALIDATION_MESSAGES.REQUIRED_POST_CONTENT,
    });
  }

  if (dto.image && !URL_PATTERN.test(dto.image)) {
    errors.push({
      field: "image",
      message: VALIDATION_MESSAGES.INVALID_IMAGE_URL,
    });
  }

  return errors;
}
