const { EMAIL_PATTERN, PASSWORD_MIN_LENGTH } = require("./patterns");
const VALIDATION_MESSAGES = require("./messages");

/**
 * LoginRequest 유효성 검증
 * @param {import('../dto/request/auth/LoginRequest')} dto
 * @returns {Array<{field: string, message: string}>} 에러 배열 (빈 배열이면 유효함)
 */
function validateLoginRequest(dto) {
  const errors = [];

  if (!dto.email) {
    errors.push({
      field: "email",
      message: VALIDATION_MESSAGES.REQUIRED_FIELD,
    });
  } else if (!EMAIL_PATTERN.test(dto.email)) {
    errors.push({
      field: "email",
      message: VALIDATION_MESSAGES.INVALID_EMAIL_FORMAT,
    });
  }

  if (!dto.password) {
    errors.push({
      field: "password",
      message: VALIDATION_MESSAGES.REQUIRED_PASSWORD,
    });
  }

  return errors;
}

/**
 * SignupRequest 유효성 검증
 * @param {import('../dto/request/auth/SignupRequest')} dto
 * @returns {Array<{field: string, message: string}>} 에러 배열 (빈 배열이면 유효함)
 */
function validateSignupRequest(dto) {
  const errors = [];

  if (!dto.email) {
    errors.push({
      field: "email",
      message: VALIDATION_MESSAGES.REQUIRED_FIELD,
    });
  } else if (!EMAIL_PATTERN.test(dto.email)) {
    errors.push({
      field: "email",
      message: VALIDATION_MESSAGES.INVALID_EMAIL_FORMAT,
    });
  }

  if (!dto.password) {
    errors.push({
      field: "password",
      message: VALIDATION_MESSAGES.REQUIRED_PASSWORD,
    });
  } else if (dto.password.length < PASSWORD_MIN_LENGTH) {
    errors.push({
      field: "password",
      message: VALIDATION_MESSAGES.INVALID_PASSWORD_FORMAT,
    });
  }

  if (!dto.nickname) {
    errors.push({
      field: "nickname",
      message: VALIDATION_MESSAGES.REQUIRED_FIELD,
    });
  }

  return errors;
}

module.exports = {
  validateLoginRequest,
  validateSignupRequest,
};
