export interface ValidationResult {
  isValid: boolean
  error: string
}

export function validateEmail(email: string): ValidationResult {
  if (!email.trim()) {
    return { isValid: false, error: '이메일을 입력해주세요.' }
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { isValid: false, error: '올바른 이메일 형식이 아닙니다.' }
  }
  return { isValid: true, error: '' }
}

export function validatePassword(password: string): ValidationResult {
  if (!password) {
    return { isValid: false, error: '비밀번호를 입력해주세요.' }
  }
  if (password.length < 8 || password.length > 20) {
    return { isValid: false, error: '비밀번호는 8자 이상, 20자 이하이어야 합니다.' }
  }
  if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
    return { isValid: false, error: '비밀번호는 영문과 숫자를 포함해야 합니다.' }
  }
  return { isValid: true, error: '' }
}

export function validatePasswordConfirm(password: string, passwordConfirm: string): ValidationResult {
  if (!passwordConfirm) {
    return { isValid: false, error: '비밀번호를 한번 더 입력해주세요.' }
  }
  if (password !== passwordConfirm) {
    return { isValid: false, error: '비밀번호가 일치하지 않습니다.' }
  }
  return { isValid: true, error: '' }
}

export function validateNickname(nickname: string): ValidationResult {
  if (!nickname.trim()) {
    return { isValid: false, error: '닉네임을 입력해주세요.' }
  }
  if (nickname.length > 30) {
    return { isValid: false, error: '닉네임은 30자 이하이어야 합니다.' }
  }
  return { isValid: true, error: '' }
}

export function validateUrl(url: string): ValidationResult {
  if (!url || !url.trim()) {
    return { isValid: true, error: '' }
  }
  try {
    new URL(url)
    return { isValid: true, error: '' }
  } catch {
    return { isValid: false, error: '올바른 URL 형식이 아닙니다.' }
  }
}
