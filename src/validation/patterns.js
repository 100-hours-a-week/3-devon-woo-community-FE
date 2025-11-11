/**
 * 유효성 검증 패턴 상수
 */

export const EMAIL_PATTERN = /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
export const URL_PATTERN = /^https?:\/\/.*/;
export const NICKNAME_MAX_LENGTH = 30;
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 20;
// 비밀번호: 8-20자, 영문과 숫자 혼합
export const PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/;
