/**
 * 유효성 검증 메시지 상수
 */

const VALIDATION_MESSAGES = {
  REQUIRED_FIELD: "필수 입력 항목입니다",
  INVALID_EMAIL_FORMAT: "올바른 이메일 형식이 아닙니다",
  INVALID_PASSWORD_FORMAT: "비밀번호는 최소 8자 이상이어야 합니다",
  REQUIRED_PASSWORD: "비밀번호를 입력해주세요",
  INVALID_NICKNAME: "닉네임은 최대 30자까지 입력 가능합니다",
  INVALID_IMAGE_URL: "올바른 이미지 URL 형식이 아닙니다",
  INVALID_PROFILE_IMAGE: "올바른 프로필 이미지 URL 형식이 아닙니다",
  REQUIRED_POST_TITLE: "게시글 제목을 입력해주세요",
  REQUIRED_POST_CONTENT: "게시글 내용을 입력해주세요",
  REQUIRED_COMMENT_CONTENT: "댓글 내용을 입력해주세요",
  REQUIRED_MEMBER_ID: "작성자 정보가 필요합니다",
};

module.exports = VALIDATION_MESSAGES;
