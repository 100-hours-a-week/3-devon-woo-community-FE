# 컴포넌트 리팩토링 가이드

## 개요

현재 코드의 문제점과 개선 방안을 정리한 문서입니다.
추후 코드 품질 향상을 위해 참고하세요.

---

## 현재 코드의 문제점

### 1. querySelector 남발

**현재 코드 (SignupPage.js 예시):**
```javascript
mounted() {
  const profileImageContainer = this.$el.querySelector('#profileImageContainer');
  const profileInput = this.$el.querySelector('#profileInput');
  const profileImage = this.$el.querySelector('#profileImage');
  const profilePlaceholder = this.$el.querySelector('#profilePlaceholder');
  const profileDeleteBtn = this.$el.querySelector('#profileDeleteBtn');
  const emailInput = this.$el.querySelector('#emailInput');
  const passwordInput = this.$el.querySelector('#passwordInput');
  const passwordConfirmInput = this.$el.querySelector('#passwordConfirmInput');
  const nicknameInput = this.$el.querySelector('#nicknameInput');
  const submitBtn = this.$el.querySelector('#submitBtn');
  const form = this.$el.querySelector('#signupForm');
  // 총 11개의 querySelector 호출...
}
```

**문제점:**
- 코드가 장황하고 반복적
- 요소를 찾지 못하면 null 반환 → 에러 발생 가능
- React의 ref 패턴과 다름

### 2. 직접 DOM 조작

```javascript
profileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      profileImage.src = e.target.result;
      profileImage.style.display = 'block';  // ❌ 직접 DOM 조작
      profilePlaceholder.style.display = 'none';  // ❌
      profileDeleteBtn.style.display = 'block';  // ❌
      this.state.profileImage = file;  // ❌ state 직접 변경
    };
    reader.readAsDataURL(file);
  }
});
```

**문제점:**
- React에서는 state로 관리하고 렌더링으로 반영
- 직접 DOM 조작은 유지보수 어려움
- setState()를 사용하지 않아 컴포넌트 철학에 맞지 않음

### 3. state 직접 변경 (안티패턴)

```javascript
this.state.profileImage = file;  // ❌
this.state.email = e.target.value;  // ❌
this.state.password = e.target.value;  // ❌
```

**문제점:**
- React에서는 절대 하면 안 되는 패턴
- `setState()`를 사용해야 리렌더링 트리거
- 현재는 리렌더링 없이 state만 변경됨

### 4. 검증 로직 없음

```javascript
checkFormValid(submitBtn) {
  // 단순히 값이 있는지만 체크
  if (this.state.email && this.state.password &&
      this.state.passwordConfirm && this.state.nickname) {
    submitBtn.disabled = false;
  } else {
    submitBtn.disabled = true;
  }
}
```

**문제점:**
- 이메일 형식, 비밀번호 강도 등 검증 없음
- `src/validation/` 폴더가 있지만 사용하지 않음
- helper text 표시 안 함

---

## 개선 방안 1: React Ref 패턴 구현

### 개념 설명

React의 `useRef` / `createRef`와 유사한 시스템을 바닐라 JS로 구현합니다.

**React에서의 ref:**
```jsx
// React 함수형 컴포넌트
function SignupPage() {
  const emailInputRef = useRef(null);

  return <input ref={emailInputRef} type="email" />;

  // emailInputRef.current로 접근
}
```

**React 클래스형 컴포넌트:**
```jsx
class SignupPage extends React.Component {
  constructor(props) {
    super(props);
    this.emailInputRef = React.createRef();
  }

  render() {
    return <input ref={this.emailInputRef} type="email" />;
  }

  componentDidMount() {
    // this.emailInputRef.current로 접근
  }
}
```

### 우리 시스템에 적용

#### Step 1: Component.js 수정

```javascript
// src/core/Component.js
class Component {
  constructor(props = {}) {
    this.props = props;
    this.state = {};
    this.$el = null;
    this.refs = {};  // ✨ ref 저장소 추가
  }

  // 스타일 동적 로드 (자식 클래스에서 호출)
  loadStyle(cssPath) {
    const linkId = `${this.constructor.name.toLowerCase()}-style`;
    if (!document.getElementById(linkId)) {
      const link = document.createElement('link');
      link.id = linkId;
      link.rel = 'stylesheet';
      link.href = cssPath;
      document.head.appendChild(link);
    }
  }

  // ✨ ref 수집 메서드 추가
  collectRefs() {
    // data-ref 속성을 가진 모든 요소 찾기
    const refElements = this.$el.querySelectorAll('[data-ref]');

    // this.refs 초기화
    this.refs = {};

    // 각 요소를 refs 객체에 저장
    refElements.forEach(el => {
      const refName = el.getAttribute('data-ref');
      this.refs[refName] = el;
    });
  }

  // HTML 문자열 반환 (자식 클래스에서 구현)
  render() {
    return '';
  }

  // 상태 업데이트 및 리렌더링
  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.update();
  }

  // DOM에 마운트
  mount(container) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = this.render();
    this.$el = tempDiv.firstElementChild;
    container.appendChild(this.$el);
    this.collectRefs();  // ✨ ref 수집
    this.mounted();
  }

  // 리렌더링
  update() {
    if (!this.$el) return;

    const parent = this.$el.parentNode;
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = this.render();
    const newEl = tempDiv.firstElementChild;

    parent.replaceChild(newEl, this.$el);
    this.$el = newEl;
    this.collectRefs();  // ✨ ref 수집
    this.mounted();
  }

  // 마운트 후 실행 (이벤트 리스너 등록)
  mounted() {
    // 자식 클래스에서 구현
  }

  // 언마운트 전 실행
  beforeUnmount() {
    // 자식 클래스에서 구현
  }
}

export default Component;
```

#### Step 2: 컴포넌트에서 사용

**Before (현재 방식):**
```javascript
class SignupPage extends Component {
  render() {
    return `
      <input type="email" id="emailInput" />
      <input type="password" id="passwordInput" />
      <button id="submitBtn">제출</button>
    `;
  }

  mounted() {
    // ❌ querySelector 남발
    const emailInput = this.$el.querySelector('#emailInput');
    const passwordInput = this.$el.querySelector('#passwordInput');
    const submitBtn = this.$el.querySelector('#submitBtn');

    emailInput.addEventListener('input', ...);
    passwordInput.addEventListener('input', ...);
  }
}
```

**After (ref 패턴):**
```javascript
class SignupPage extends Component {
  render() {
    return `
      <input type="email" data-ref="emailInput" />
      <input type="password" data-ref="passwordInput" />
      <button data-ref="submitBtn">제출</button>
    `;
  }

  mounted() {
    // ✅ this.refs로 간편하게 접근
    const { emailInput, passwordInput, submitBtn } = this.refs;

    emailInput.addEventListener('input', (e) => {
      this.setState({ email: e.target.value });
    });

    passwordInput.addEventListener('input', (e) => {
      this.setState({ password: e.target.value });
    });
  }
}
```

### 전체 예시: SignupPage 리팩토링

```javascript
// src/pages/SignupPage/index.js
import Component from '../../core/Component.js';

class SignupPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profileImage: null,
      profileImageUrl: '',      // ✨ 이미지 URL
      showProfileImage: false,  // ✨ 이미지 표시 여부
      showDeleteButton: false,  // ✨ 삭제 버튼 표시 여부
      email: '',
      password: '',
      passwordConfirm: '',
      nickname: ''
    };
    this.loadStyle('/src/pages/SignupPage/style.css');
  }

  render() {
    return `
      <div class="main-container">
        <div class="signup-wrapper">
          <h2 class="signup-title">회원가입</h2>

          <form class="signup-form" data-ref="signupForm">
            <!-- 프로필 이미지 -->
            <div class="form-group profile-group">
              <label class="form-label">프로필 사진</label>
              <div class="profile-upload-section">
                <div class="profile-image-container" data-ref="profileImageContainer">
                  <img
                    src="${this.state.profileImageUrl}"
                    alt="프로필 이미지"
                    class="profile-image"
                    data-ref="profileImage"
                    style="display: ${this.state.showProfileImage ? 'block' : 'none'};"
                  >
                  <div
                    class="profile-placeholder"
                    data-ref="profilePlaceholder"
                    style="display: ${this.state.showProfileImage ? 'none' : 'flex'};"
                  >
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                      <path d="M20 10V30M10 20H30" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                  </div>
                  <input
                    type="file"
                    data-ref="profileInput"
                    class="profile-input-hidden"
                    accept="image/jpeg,image/png,image/jpg"
                  >
                </div>
                <button
                  type="button"
                  class="profile-delete-btn"
                  data-ref="profileDeleteBtn"
                  style="display: ${this.state.showDeleteButton ? 'block' : 'none'};"
                >
                  이미지 삭제
                </button>
              </div>
            </div>

            <!-- 이메일 -->
            <div class="form-group">
              <label for="emailInput" class="form-label">이메일*</label>
              <input
                type="email"
                data-ref="emailInput"
                class="form-input"
                placeholder="이메일을 입력해주세요"
                value="${this.state.email}"
              />
              <p class="helper-text error" data-ref="emailHelperText"></p>
            </div>

            <!-- 비밀번호 -->
            <div class="form-group">
              <label for="passwordInput" class="form-label">비밀번호*</label>
              <input
                type="password"
                data-ref="passwordInput"
                class="form-input"
                placeholder="비밀번호를 입력해주세요"
                value="${this.state.password}"
              />
              <p class="helper-text error" data-ref="passwordHelperText"></p>
            </div>

            <!-- 비밀번호 확인 -->
            <div class="form-group">
              <label for="passwordConfirmInput" class="form-label">비밀번호 확인*</label>
              <input
                type="password"
                data-ref="passwordConfirmInput"
                class="form-input"
                placeholder="비밀번호를 한번 더 입력해주세요"
                value="${this.state.passwordConfirm}"
              />
              <p class="helper-text error" data-ref="passwordConfirmHelperText"></p>
            </div>

            <!-- 닉네임 -->
            <div class="form-group">
              <label for="nicknameInput" class="form-label">닉네임*</label>
              <input
                type="text"
                data-ref="nicknameInput"
                class="form-input"
                placeholder="닉네임을 입력해주세요"
                maxlength="10"
                value="${this.state.nickname}"
              />
              <p class="helper-text error" data-ref="nicknameHelperText"></p>
            </div>

            <!-- 제출 버튼 -->
            <button
              type="submit"
              class="submit-btn"
              data-ref="submitBtn"
              disabled="${!this.isFormValid()}"
            >
              회원가입
            </button>

            <div class="login-link-section">
              <a href="/login" class="login-link">로그인하러 가기</a>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  mounted() {
    // 뒤로가기 버튼 표시
    if (window.headerComponent) {
      window.headerComponent.showBackButton(true);
    }

    // ✅ refs로 간편하게 접근
    const {
      profileImageContainer,
      profileInput,
      emailInput,
      passwordInput,
      passwordConfirmInput,
      nicknameInput,
      signupForm,
      profileDeleteBtn
    } = this.refs;

    // 프로필 이미지 클릭
    profileImageContainer.addEventListener('click', () => {
      profileInput.click();
    });

    // 프로필 이미지 선택
    profileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          // ✅ setState로 상태 변경 (DOM 직접 조작 X)
          this.setState({
            profileImage: file,
            profileImageUrl: e.target.result,
            showProfileImage: true,
            showDeleteButton: true
          });
        };
        reader.readAsDataURL(file);
      }
    });

    // 프로필 이미지 삭제
    profileDeleteBtn.addEventListener('click', () => {
      // ✅ setState로 상태 변경
      this.setState({
        profileImage: null,
        profileImageUrl: '',
        showProfileImage: false,
        showDeleteButton: false
      });
      profileInput.value = '';
    });

    // 입력 이벤트 (setState 사용)
    emailInput.addEventListener('input', (e) => {
      this.setState({ email: e.target.value });
    });

    passwordInput.addEventListener('input', (e) => {
      this.setState({ password: e.target.value });
    });

    passwordConfirmInput.addEventListener('input', (e) => {
      this.setState({ passwordConfirm: e.target.value });
    });

    nicknameInput.addEventListener('input', (e) => {
      this.setState({ nickname: e.target.value });
    });

    // 폼 제출
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSubmit();
    });
  }

  beforeUnmount() {
    if (window.headerComponent) {
      window.headerComponent.showBackButton(false);
    }
  }

  // ✅ state만 보고 판단 (DOM 매개변수 X)
  isFormValid() {
    return this.state.email &&
           this.state.password &&
           this.state.passwordConfirm &&
           this.state.nickname;
  }

  handleSubmit() {
    console.log('회원가입 시도:', {
      email: this.state.email,
      password: this.state.password,
      passwordConfirm: this.state.passwordConfirm,
      nickname: this.state.nickname,
      profileImage: this.state.profileImage
    });
    alert('회원가입 기능은 아직 구현되지 않았습니다.');
  }
}

export default SignupPage;
```

### ref 패턴의 장점

✅ **코드 간결성**: querySelector 11개 → refs 구조 분해 1줄
✅ **React와 유사**: `data-ref` ≈ React의 `ref` 속성
✅ **타입 안정성**: 모든 ref가 this.refs에 모여있어 관리 용이
✅ **에러 감소**: 오타나 잘못된 선택자 문제 감소
✅ **재사용성**: Component 베이스 클래스가 자동 처리

### ref 패턴의 단점

❌ **초기 학습 곡선**: 새로운 패턴 이해 필요
❌ **HTML 수정 필요**: 기존 `id` → `data-ref`로 변경
❌ **디버깅**: refs가 제대로 수집되었는지 확인 필요

---

## 개선 방안 3: Validation 추가

### 현재 문제

```javascript
checkFormValid(submitBtn) {
  // 값이 있는지만 체크
  if (this.state.email && this.state.password && ...) {
    submitBtn.disabled = false;
  }
}
```

**문제점:**
- 이메일 형식 검증 없음
- 비밀번호 강도 검증 없음
- 비밀번호 확인 일치 검증 없음
- helper text 표시 안 함
- `src/validation/` 폴더 미사용

### 개선 방안

#### Step 1: Validation 함수 작성

```javascript
// src/validation/authValidation.js
import { EMAIL_PATTERN, PASSWORD_PATTERN } from './patterns.js';
import { VALIDATION_MESSAGES } from './messages.js';

/**
 * 이메일 유효성 검사
 */
export function validateEmail(email) {
  if (!email) {
    return VALIDATION_MESSAGES.EMAIL.REQUIRED;
  }
  if (!EMAIL_PATTERN.test(email)) {
    return VALIDATION_MESSAGES.EMAIL.INVALID_FORMAT;
  }
  return '';
}

/**
 * 비밀번호 유효성 검사
 */
export function validatePassword(password) {
  if (!password) {
    return VALIDATION_MESSAGES.PASSWORD.REQUIRED;
  }
  if (password.length < 8) {
    return VALIDATION_MESSAGES.PASSWORD.MIN_LENGTH;
  }
  if (password.length > 20) {
    return VALIDATION_MESSAGES.PASSWORD.MAX_LENGTH;
  }
  if (!PASSWORD_PATTERN.test(password)) {
    return VALIDATION_MESSAGES.PASSWORD.INVALID_FORMAT;
  }
  return '';
}

/**
 * 비밀번호 확인 검사
 */
export function validatePasswordConfirm(password, passwordConfirm) {
  if (!passwordConfirm) {
    return VALIDATION_MESSAGES.PASSWORD_CONFIRM.REQUIRED;
  }
  if (password !== passwordConfirm) {
    return VALIDATION_MESSAGES.PASSWORD_CONFIRM.NOT_MATCH;
  }
  return '';
}

/**
 * 닉네임 유효성 검사
 */
export function validateNickname(nickname) {
  if (!nickname) {
    return VALIDATION_MESSAGES.NICKNAME.REQUIRED;
  }
  if (nickname.length > 10) {
    return VALIDATION_MESSAGES.NICKNAME.MAX_LENGTH;
  }
  // 공백 검사
  if (/\s/.test(nickname)) {
    return VALIDATION_MESSAGES.NICKNAME.NO_WHITESPACE;
  }
  return '';
}

/**
 * 회원가입 전체 검증
 */
export function validateSignupForm({ email, password, passwordConfirm, nickname }) {
  const errors = {};

  const emailError = validateEmail(email);
  if (emailError) errors.email = emailError;

  const passwordError = validatePassword(password);
  if (passwordError) errors.password = passwordError;

  const passwordConfirmError = validatePasswordConfirm(password, passwordConfirm);
  if (passwordConfirmError) errors.passwordConfirm = passwordConfirmError;

  const nicknameError = validateNickname(nickname);
  if (nicknameError) errors.nickname = nicknameError;

  return errors;
}
```

#### Step 2: 패턴 정의

```javascript
// src/validation/patterns.js

/**
 * 이메일 정규식
 * 예: user@example.com
 */
export const EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * 비밀번호 정규식
 * - 최소 8자, 최대 20자
 * - 영문 대소문자, 숫자, 특수문자 중 최소 2가지 조합
 */
export const PASSWORD_PATTERN = /^(?=.*[a-zA-Z])(?=.*[0-9!@#$%^&*]).{8,20}$/;

/**
 * 닉네임 정규식
 * - 한글, 영문, 숫자만 허용
 * - 공백 불가
 */
export const NICKNAME_PATTERN = /^[가-힣a-zA-Z0-9]+$/;
```

#### Step 3: 메시지 정의

```javascript
// src/validation/messages.js

export const VALIDATION_MESSAGES = {
  EMAIL: {
    REQUIRED: '이메일을 입력해주세요.',
    INVALID_FORMAT: '올바른 이메일 주소 형식을 입력해주세요. (예: example@example.com)',
    ALREADY_EXISTS: '중복된 이메일입니다.'
  },
  PASSWORD: {
    REQUIRED: '비밀번호를 입력해주세요.',
    MIN_LENGTH: '비밀번호는 8자 이상이어야 합니다.',
    MAX_LENGTH: '비밀번호는 20자 이하여야 합니다.',
    INVALID_FORMAT: '비밀번호는 영문, 숫자, 특수문자 중 2가지 이상을 조합해야 합니다.'
  },
  PASSWORD_CONFIRM: {
    REQUIRED: '비밀번호를 한번 더 입력해주세요.',
    NOT_MATCH: '비밀번호가 일치하지 않습니다.'
  },
  NICKNAME: {
    REQUIRED: '닉네임을 입력해주세요.',
    MAX_LENGTH: '닉네임은 최대 10자까지 가능합니다.',
    NO_WHITESPACE: '닉네임에 공백을 포함할 수 없습니다.',
    ALREADY_EXISTS: '중복된 닉네임입니다.'
  }
};
```

#### Step 4: 컴포넌트에 적용

```javascript
// src/pages/SignupPage/index.js
import Component from '../../core/Component.js';
import {
  validateEmail,
  validatePassword,
  validatePasswordConfirm,
  validateNickname
} from '../../validation/authValidation.js';

class SignupPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profileImage: null,
      email: '',
      password: '',
      passwordConfirm: '',
      nickname: '',
      errors: {  // ✨ 에러 상태 추가
        email: '',
        password: '',
        passwordConfirm: '',
        nickname: ''
      }
    };
    this.loadStyle('/src/pages/SignupPage/style.css');
  }

  render() {
    return `
      <div class="main-container">
        <div class="signup-wrapper">
          <h2 class="signup-title">회원가입</h2>

          <form class="signup-form" id="signupForm">
            <!-- 이메일 -->
            <div class="form-group">
              <label for="emailInput" class="form-label">이메일*</label>
              <input
                type="email"
                id="emailInput"
                class="form-input ${this.state.errors.email ? 'error' : ''}"
                placeholder="이메일을 입력해주세요"
                value="${this.state.email}"
              />
              <p class="helper-text ${this.state.errors.email ? 'show' : ''}" id="emailHelperText">
                ${this.state.errors.email}
              </p>
            </div>

            <!-- 비밀번호 -->
            <div class="form-group">
              <label for="passwordInput" class="form-label">비밀번호*</label>
              <input
                type="password"
                id="passwordInput"
                class="form-input ${this.state.errors.password ? 'error' : ''}"
                placeholder="비밀번호를 입력해주세요"
                value="${this.state.password}"
              />
              <p class="helper-text ${this.state.errors.password ? 'show' : ''}" id="passwordHelperText">
                ${this.state.errors.password}
              </p>
            </div>

            <!-- 비밀번호 확인 -->
            <div class="form-group">
              <label for="passwordConfirmInput" class="form-label">비밀번호 확인*</label>
              <input
                type="password"
                id="passwordConfirmInput"
                class="form-input ${this.state.errors.passwordConfirm ? 'error' : ''}"
                placeholder="비밀번호를 한번 더 입력해주세요"
                value="${this.state.passwordConfirm}"
              />
              <p class="helper-text ${this.state.errors.passwordConfirm ? 'show' : ''}" id="passwordConfirmHelperText">
                ${this.state.errors.passwordConfirm}
              </p>
            </div>

            <!-- 닉네임 -->
            <div class="form-group">
              <label for="nicknameInput" class="form-label">닉네임*</label>
              <input
                type="text"
                id="nicknameInput"
                class="form-input ${this.state.errors.nickname ? 'error' : ''}"
                placeholder="닉네임을 입력해주세요"
                maxlength="10"
                value="${this.state.nickname}"
              />
              <p class="helper-text ${this.state.errors.nickname ? 'show' : ''}" id="nicknameHelperText">
                ${this.state.errors.nickname}
              </p>
            </div>

            <!-- 제출 버튼 -->
            <button
              type="submit"
              class="submit-btn"
              id="submitBtn"
              ${this.isFormValid() ? '' : 'disabled'}
            >
              회원가입
            </button>
          </form>
        </div>
      </div>
    `;
  }

  mounted() {
    const emailInput = this.$el.querySelector('#emailInput');
    const passwordInput = this.$el.querySelector('#passwordInput');
    const passwordConfirmInput = this.$el.querySelector('#passwordConfirmInput');
    const nicknameInput = this.$el.querySelector('#nicknameInput');
    const form = this.$el.querySelector('#signupForm');

    // ✅ 이메일 검증
    emailInput.addEventListener('input', (e) => {
      const email = e.target.value;
      const error = validateEmail(email);

      this.setState({
        email,
        errors: { ...this.state.errors, email: error }
      });
    });

    // ✅ 비밀번호 검증
    passwordInput.addEventListener('input', (e) => {
      const password = e.target.value;
      const error = validatePassword(password);

      this.setState({
        password,
        errors: { ...this.state.errors, password: error }
      });
    });

    // ✅ 비밀번호 확인 검증
    passwordConfirmInput.addEventListener('input', (e) => {
      const passwordConfirm = e.target.value;
      const error = validatePasswordConfirm(this.state.password, passwordConfirm);

      this.setState({
        passwordConfirm,
        errors: { ...this.state.errors, passwordConfirm: error }
      });
    });

    // ✅ 닉네임 검증
    nicknameInput.addEventListener('input', (e) => {
      const nickname = e.target.value;
      const error = validateNickname(nickname);

      this.setState({
        nickname,
        errors: { ...this.state.errors, nickname: error }
      });
    });

    // 폼 제출
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSubmit();
    });
  }

  // ✅ 모든 필드가 유효한지 확인
  isFormValid() {
    const { email, password, passwordConfirm, nickname, errors } = this.state;

    // 값이 있고, 에러가 없어야 함
    return email && password && passwordConfirm && nickname &&
           !errors.email && !errors.password &&
           !errors.passwordConfirm && !errors.nickname;
  }

  handleSubmit() {
    if (!this.isFormValid()) {
      alert('입력 항목을 확인해주세요.');
      return;
    }

    console.log('회원가입 시도:', {
      email: this.state.email,
      password: this.state.password,
      passwordConfirm: this.state.passwordConfirm,
      nickname: this.state.nickname,
      profileImage: this.state.profileImage
    });

    // TODO: API 호출
    alert('회원가입 기능은 아직 구현되지 않았습니다.');
  }
}

export default SignupPage;
```

### Validation 패턴의 장점

✅ **사용자 경험 향상**: 실시간 에러 메시지 표시
✅ **데이터 품질**: 잘못된 데이터 서버 전송 방지
✅ **재사용성**: validation 함수를 다른 컴포넌트에서도 사용
✅ **유지보수성**: 검증 로직이 한 곳에 집중
✅ **확장성**: 새로운 규칙 추가 용이

### Validation 적용 체크리스트

- [ ] `src/validation/patterns.js` 작성
- [ ] `src/validation/messages.js` 작성
- [ ] `src/validation/authValidation.js` 작성
- [ ] SignupPage에 validation 함수 import
- [ ] state에 errors 필드 추가
- [ ] input 이벤트에 validation 추가
- [ ] render에서 에러 메시지 표시
- [ ] CSS에서 .error, .show 클래스 스타일 확인
- [ ] isFormValid() 메서드 수정

---

## 추천 적용 순서

### 단계별 리팩토링

**Phase 1: Validation 먼저 (즉시 적용 가능)**
1. validation 파일 작성 (patterns.js, messages.js, authValidation.js)
2. SignupPage에 validation 적용
3. LoginPage에 validation 적용
4. 테스트 및 확인

**Phase 2: Ref 패턴 (여유 있을 때)**
1. Component.js에 ref 시스템 추가
2. 한 페이지씩 천천히 ref 패턴으로 전환
3. 테스트 및 확인

**Phase 3: State 기반 렌더링 (선택 사항)**
1. 직접 DOM 조작을 setState()로 변경
2. UI 상태를 state에 추가
3. 테스트 및 확인

---

## 참고 자료

### React 공식 문서
- [Refs and the DOM](https://react.dev/learn/referencing-values-with-refs)
- [Form Validation](https://react.dev/learn/reacting-to-input-with-state#step-3-connect-the-event-handlers-to-set-state)

### 관련 파일
- `src/core/Component.js` - 컴포넌트 베이스 클래스
- `src/validation/` - 검증 로직
- `src/pages/SignupPage/` - 회원가입 페이지
- `src/pages/LoginPage/` - 로그인 페이지

---

## 마무리

이 문서는 추후 코드 품질 향상을 위한 참고 자료입니다.
당장 적용하지 않아도 되며, 필요할 때 참고하여 단계적으로 개선하세요.

**우선순위:**
1. ✅ **Validation 추가** - 즉시 적용 가능, 사용자 경험 개선
2. ⏸️ **Ref 패턴** - 여유 있을 때 천천히 적용
3. ⏸️ **State 기반 렌더링** - 선택 사항
