import { EMAIL_PATTERN, PASSWORD_PATTERN, NICKNAME_MAX_LENGTH } from './patterns.js';
import { VALIDATION_MESSAGES } from './messages.js';

/**
 * 이메일 유효성 검증 (단일 필드)
 * @param {string} email - 검증할 이메일
 * @returns {string} 에러 메시지 (빈 문자열이면 유효함)
 */
export function validateEmail(email) {
  if (!email || email.trim() === '') {
    return VALIDATION_MESSAGES.REQUIRED_EMAIL;
  }

  if (!EMAIL_PATTERN.test(email)) {
    return VALIDATION_MESSAGES.INVALID_EMAIL_FORMAT;
  }

  return "";
}

/**
 * 비밀번호 유효성 검증 (단일 필드 - 로그인용)
 * @param {string} password - 검증할 비밀번호
 * @returns {string} 에러 메시지 (빈 문자열이면 유효함)
 */
export function validateLoginPassword(password) {
  if (!password || password.trim() === '') {
    return VALIDATION_MESSAGES.REQUIRED_PASSWORD;
  }

  if (!PASSWORD_PATTERN.test(password)) {
    return VALIDATION_MESSAGES.INVALID_PASSWORD_FORMAT;
  }

  return "";
}

/**
 * 닉네임 유효성 검증 (단일 필드)
 * @param {string} nickname - 검증할 닉네임
 * @returns {string} 에러 메시지 (빈 문자열이면 유효함)
 */
export function validateNickname(nickname) {
  if (!nickname) {
    return VALIDATION_MESSAGES.REQUIRED_FIELD;
  }

  if (nickname.length > NICKNAME_MAX_LENGTH) {
    return VALIDATION_MESSAGES.INVALID_NICKNAME;
  }

  return "";
}

/**
 * LoginRequest 유효성 검증
 * @param {import('../dto/request/auth/LoginRequest.js')} dto
 * @returns {Array<{field: string, message: string}>} 에러 배열 (빈 배열이면 유효함)
 */
export function validateLoginRequest(dto) {
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
 * @param {import('../dto/request/auth/SignupRequest.js')} dto
 * @returns {Array<{field: string, message: string}>} 에러 배열 (빈 배열이면 유효함)
 */
export function validateSignupRequest(dto) {
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
  } else if (!PASSWORD_PATTERN.test(dto.password)) {
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
