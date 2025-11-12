import {
  NICKNAME_MAX_LENGTH,
  URL_PATTERN,
  PASSWORD_PATTERN,
} from './patterns.js';
import { VALIDATION_MESSAGES } from './messages.js';

/**
 * MemberUpdateRequest 유효성 검증
 * @param {import('../dto/request/member/MemberUpdateRequest')} dto
 * @returns {Array<{field: string, message: string}>} 에러 배열 (빈 배열이면 유효함)
 */
export function validateMemberUpdateRequest(dto) {
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
export function validatePasswordUpdateRequest(dto) {
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
  } else if (!PASSWORD_PATTERN.test(dto.newPassword)) {
    errors.push({
      field: "newPassword",
      message: VALIDATION_MESSAGES.INVALID_PASSWORD_FORMAT,
    });
  }

  return errors;
}

/**
 * 비밀번호 유효성 검증 (단일 필드)
 * @param {string} password - 검증할 비밀번호
 * @returns {string} 에러 메시지 (빈 문자열이면 유효함)
 */
export function validatePassword(password) {
  if (!password) {
    return VALIDATION_MESSAGES.REQUIRED_PASSWORD;
  }

  if (!PASSWORD_PATTERN.test(password)) {
    return VALIDATION_MESSAGES.INVALID_PASSWORD_FORMAT;
  }

  return "";
}

/**
 * 비밀번호 확인 유효성 검증
 * @param {string} password - 원본 비밀번호
 * @param {string} passwordConfirm - 확인 비밀번호
 * @returns {string} 에러 메시지 (빈 문자열이면 유효함)
 */
export function validatePasswordConfirm(password, passwordConfirm) {
  if (!passwordConfirm) {
    return VALIDATION_MESSAGES.REQUIRED_PASSWORD;
  }

  if (password !== passwordConfirm) {
    return VALIDATION_MESSAGES.PASSWORD_MISMATCH;
  }

  return "";
}
