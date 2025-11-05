/**
 * Validation 함수들의 중앙 집중식 export
 */

const authValidation = require("./authValidation");
const memberValidation = require("./memberValidation");
const postValidation = require("./postValidation");
const commentValidation = require("./commentValidation");
const patterns = require("./patterns");
const VALIDATION_MESSAGES = require("./messages");

module.exports = {
  // Auth validations
  validateLoginRequest: authValidation.validateLoginRequest,
  validateSignupRequest: authValidation.validateSignupRequest,

  // Member validations
  validateMemberUpdateRequest: memberValidation.validateMemberUpdateRequest,
  validatePasswordUpdateRequest: memberValidation.validatePasswordUpdateRequest,

  // Post validations
  validatePostCreateRequest: postValidation.validatePostCreateRequest,
  validatePostUpdateRequest: postValidation.validatePostUpdateRequest,

  // Comment validations
  validateCommentCreateRequest: commentValidation.validateCommentCreateRequest,
  validateCommentUpdateRequest: commentValidation.validateCommentUpdateRequest,

  // Patterns and messages
  patterns,
  VALIDATION_MESSAGES,
};
