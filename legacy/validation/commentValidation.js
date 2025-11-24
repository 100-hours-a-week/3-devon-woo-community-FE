import { VALIDATION_MESSAGES } from './messages.js';

/**
 * CommentCreateRequest 유효성 검증
 * @param {import('../dto/request/comment/CommentCreateRequest.js')} dto
 * @returns {Array<{field: string, message: string}>} 에러 배열 (빈 배열이면 유효함)
 */
export function validateCommentCreateRequest(dto) {
  const errors = [];

  if (dto.memberId == null) {
    errors.push({
      field: "memberId",
      message: VALIDATION_MESSAGES.REQUIRED_MEMBER_ID,
    });
  }

  if (!dto.content) {
    errors.push({
      field: "content",
      message: VALIDATION_MESSAGES.REQUIRED_COMMENT_CONTENT,
    });
  }

  return errors;
}

/**
 * CommentUpdateRequest 유효성 검증
 * @param {import('../dto/request/comment/CommentUpdateRequest.js')} dto
 * @returns {Array<{field: string, message: string}>} 에러 배열 (빈 배열이면 유효함)
 */
export function validateCommentUpdateRequest(dto) {
  const errors = [];

  if (dto.memberId == null) {
    errors.push({
      field: "memberId",
      message: VALIDATION_MESSAGES.REQUIRED_MEMBER_ID,
    });
  }

  if (!dto.content) {
    errors.push({
      field: "content",
      message: VALIDATION_MESSAGES.REQUIRED_COMMENT_CONTENT,
    });
  }

  return errors;
}
