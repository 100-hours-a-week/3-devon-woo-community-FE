const {
  NICKNAME_MAX_LENGTH,
  URL_PATTERN,
  PASSWORD_MIN_LENGTH,
} = require("./patterns");
const VALIDATION_MESSAGES = require("./messages");

/**
 * MemberUpdateRequest 유효성 검증
 * @param {import('../dto/request/member/MemberUpdateRequest')} dto
 * @returns {Array<{field: string, message: string}>} 에러 배열 (빈 배열이면 유효함)
 */
function validateMemberUpdateRequest(dto) {
  const errors = [];

  if (dto.nickname && dto.nickname.length > NICKNAME_MAX_LENGTH) {
    errors.push({
      field: "nickname",
      message: VALIDATION_MESSAGES.INVALID_NICKNAME,
    });
  }

  if (dto.profileImage && !URL_PATTERN.test(dto.profileImage)) {
    errors.push({
      field: "profileImage",
      message: VALIDATION_MESSAGES.INVALID_PROFILE_IMAGE,
    });
  }

  return errors;
}

/**
 * PasswordUpdateRequest 유효성 검증
 * @param {import('../dto/request/member/PasswordUpdateRequest')} dto
 * @returns {Array<{field: string, message: string}>} 에러 배열 (빈 배열이면 유효함)
 */
function validatePasswordUpdateRequest(dto) {
  const errors = [];

  if (!dto.currentPassword) {
    errors.push({
      field: "currentPassword",
      message: VALIDATION_MESSAGES.REQUIRED_PASSWORD,
    });
  }

  if (!dto.newPassword) {
    errors.push({
      field: "newPassword",
      message: VALIDATION_MESSAGES.REQUIRED_PASSWORD,
    });
  } else if (dto.newPassword.length < PASSWORD_MIN_LENGTH) {
    errors.push({
      field: "newPassword",
      message: VALIDATION_MESSAGES.INVALID_PASSWORD_FORMAT,
    });
  }

  return errors;
}

module.exports = {
  validateMemberUpdateRequest,
  validatePasswordUpdateRequest,
};
