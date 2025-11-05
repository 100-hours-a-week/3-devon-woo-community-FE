/**
 * 유효성 검증 패턴 상수
 */

const EMAIL_PATTERN = /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const URL_PATTERN = /^https?:\/\/.*/;
const NICKNAME_MAX_LENGTH = 30;
const PASSWORD_MIN_LENGTH = 8;

module.exports = {
  EMAIL_PATTERN,
  URL_PATTERN,
  NICKNAME_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
};
