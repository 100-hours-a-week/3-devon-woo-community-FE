# 클로드 개발 가이드

## 프로젝트 개요

바닐라 JavaScript를 사용하여 React와 유사한 구조의 SPA(Single Page Application)를 구현합니다.
Node.js나 React를 사용하지 않지만, 추후 React로 쉽게 전환할 수 있도록 구조와 코드를 유사하게 작성합니다.

---

## 핵심 원칙

### 1. 바닐라 JS 사용
- Node.js, React, Vue 등의 프레임워크 사용 금지
- 순수 JavaScript (ES6+) 사용
- 브라우저 네이티브 API 활용

### 2. React와 유사한 구조
- 컴포넌트 기반 아키텍처
- 클래스 기반 컴포넌트 (class-based components)
- `render()` 메서드로 HTML 문자열 반환
- Props를 통한 데이터 전달
- 추후 React로 전환 시 최소한의 수정으로 가능

### 3. 컴포넌트화
- 모든 UI 요소를 컴포넌트로 분리
- 재사용 가능한 컴포넌트 설계
- 단일 책임 원칙 적용
- **각 컴포넌트/페이지는 자체 폴더에 `index.js`와 `style.css`를 포함**

### 4. 동적 렌더링
- DOM 조작을 통한 동적 페이지 업데이트
- 이벤트 리스너를 통한 인터랙션
- 상태 변경 시 자동 리렌더링

### 5. SPA (Single Page Application)
- 클라이언트 사이드 라우팅
- History API 활용
- 페이지 새로고침 없이 화면 전환

### 6. API 연동
- 커스텀 Axios 클래스를 사용한 HTTP 통신
- DTO(Data Transfer Object) 활용
- RESTful API 통신
- Mock 서버 지원

### 7. 점진적 개발
- 한 번에 많은 코드를 작성하지 않고 간단하고 레거시한 코드로 시작
- 기본 기능만 포함하여 점차 업그레이드

---

## 프로젝트 구조

### 폴더 구조

**응집성 우선**: 관련된 파일들은 같은 폴더에 배치합니다.

```
3-devon-woo-community-FE/
├── index.html              # SPA 진입점 (단일 HTML)
├── CLAUDE.md               # 개발 가이드 (본 문서)
├── README.md               # 프로젝트 설명
├── src/
│   ├── app.js             # 앱 초기화 및 라우트 설정
│   ├── core/              # 코어 시스템
│   │   ├── Component.js   # 컴포넌트 베이스 클래스
│   │   └── Router.js      # 클라이언트 사이드 라우터
│   ├── components/        # 공통 컴포넌트
│   │   ├── Header/
│   │   ├── PostCard/
│   │   ├── Toast/
│   │   ├── Modal/
│   │   ├── LoadingSpinner/
│   │   ├── CommentSection/
│   │   ├── CommentItem/
│   │   ├── CommentInput/
│   │   └── ProfileImageUploader/
│   ├── pages/             # 페이지 컴포넌트
│   │   ├── LoginPage/
│   │   ├── SignupPage/
│   │   ├── PostListPage/
│   │   ├── PostDetailPage/
│   │   ├── PostCreatePage/
│   │   ├── PostEditPage/
│   │   ├── ProfilePage/
│   │   └── PasswordChangePage/
│   ├── api/               # API 레이어 (도메인별)
│   │   ├── base/
│   │   │   ├── axios.js       # 커스텀 HTTP 클라이언트
│   │   │   └── MockServer.js  # Mock 서버
│   │   ├── auth.js            # 인증 API
│   │   ├── posts.js           # 게시글 API
│   │   ├── comments.js        # 댓글 API
│   │   ├── members.js         # 회원 API
│   │   ├── users.js           # 사용자 API
│   │   └── cloudinary.js      # 이미지 업로드 API
│   ├── dto/               # 데이터 전송 객체
│   │   ├── request/       # API 요청 DTO
│   │   │   ├── auth/      # 인증 관련
│   │   │   ├── member/    # 회원 관련
│   │   │   ├── post/      # 게시글 관련
│   │   │   ├── comment/   # 댓글 관련
│   │   │   └── common/    # 공통 (페이지네이션 등)
│   │   └── response/      # API 응답 DTO
│   │       ├── auth/
│   │       ├── member/
│   │       ├── post/
│   │       ├── comment/
│   │       └── common/
│   ├── validation/        # 검증 로직
│   │   ├── authValidation.js      # 인증 검증
│   │   ├── memberValidation.js    # 회원 검증
│   │   ├── postValidation.js      # 게시글 검증
│   │   ├── commentValidation.js   # 댓글 검증
│   │   ├── patterns.js            # 정규식 패턴 상수
│   │   ├── messages.js            # 검증 메시지 상수
│   │   └── index.js               # 통합 export
│   ├── utils/             # 유틸리티 함수
│   │   ├── AuthService.js     # 인증 상태 관리
│   │   ├── imageUpload.js     # 이미지 업로드
│   │   ├── imageProcessor.js  # 이미지 처리
│   │   └── formatters.js      # 데이터 포맷팅
│   ├── services/          # 비즈니스 로직 서비스
│   │   └── cloudinary.js  # Cloudinary 서비스
│   ├── config/            # 설정 파일
│   │   └── cloudinary.js  # Cloudinary 설정
│   └── styles/            # 전역 스타일
│       ├── theme.css      # 색상 테마 (CSS Variables)
│       └── global.css     # 전역 스타일 (reset, body, layout)
```

### 스타일 관리 전략

1. **전역 스타일** (`src/styles/`)
   - `theme.css`: CSS Variables로 색상, 폰트 등 테마 정의
   - `global.css`: reset, body, 전역 레이아웃 스타일

2. **컴포넌트/페이지별 스타일**
   - 각 폴더 내 `style.css`에 해당 컴포넌트 전용 스타일 작성
   - 동적 로딩: 컴포넌트 생성 시 `loadStyle()` 메서드 호출

3. **장점**
   - 응집성: 관련 파일이 한 곳에 모여있어 관리 용이
   - 스코핑: 각 컴포넌트의 스타일이 명확히 구분됨
   - React 전환 용이: 동일한 폴더 구조 사용

---

## 컴포넌트 작성 가이드

### 기본 컴포넌트 구조

모든 컴포넌트는 `Component` 베이스 클래스를 상속받아 작성합니다.

#### 폴더 구조
```
src/components/MyComponent/
├── index.js      # 컴포넌트 로직
└── style.css     # 컴포넌트 스타일
```

#### index.js 작성 예시

```javascript
import Component from '../../core/Component.js';

class MyComponent extends Component {
  constructor(props = {}) {
    super(props);
    this.state = {
      message: ''
    };
    this.loadStyle('/src/components/MyComponent/style.css');
  }

  render() {
    return `
      <div class="my-component">
        <h1>${this.props.title}</h1>
        <p>${this.state.message}</p>
        <button class="my-button">클릭</button>
      </div>
    `;
  }

  mounted() {
    const button = this.$el.querySelector('.my-button');
    button.addEventListener('click', this.handleClick.bind(this));
  }

  handleClick() {
    this.setState({ message: 'Clicked!' });
  }
}

export default MyComponent;
```

### Component 베이스 클래스 주요 메서드

#### `loadStyle(cssPath)`
- CSS 파일을 동적으로 로드
- 중복 로드 방지 (linkId 기반)
- constructor에서 호출

#### `render()`
- **필수 구현**
- HTML 문자열을 반환
- props와 state를 활용하여 동적으로 생성
- React의 JSX와 유사한 역할

#### `mounted()`
- 컴포넌트가 DOM에 마운트된 후 **최초 1회만** 실행
- 이벤트 리스너 등록
- API 호출 등 초기화 작업 수행
- React의 `componentDidMount()`와 유사

#### `updated()`
- `setState()` 호출로 리렌더링될 때마다 실행
- 필요 시 이벤트 리스너 재등록
- 기본적으로는 비어있음 (자식 클래스에서 필요시 구현)

#### `setState(newState)`
- 상태를 업데이트하고 자동 리렌더링
- React의 `setState()`와 동일한 역할
- `update()` 메서드를 내부적으로 호출

#### `beforeUnmount()`
- 컴포넌트가 제거되기 전 실행
- 이벤트 리스너 정리
- 타이머 정리 등

---

## 페이지 컴포넌트 작성 예시

### 폴더 구조
```
src/pages/LoginPage/
├── index.js      # 로그인 페이지 로직
└── style.css     # 로그인 페이지 스타일
```

### index.js

```javascript
import Component from '../../core/Component.js';
import { login } from '../../api/auth.js';
import LoginRequest from '../../dto/request/auth/LoginRequest.js';
import AuthService from '../../utils/AuthService.js';
import { navigateReplace } from '../../core/Router.js';
import { validateEmail, validateLoginPassword } from '../../validation/authValidation.js';

class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      emailError: '',
      passwordError: '',
      isLoading: false
    };
    this.loadStyle('/src/pages/LoginPage/style.css');
  }

  render() {
    return `
      <div class="main-container">
        <div class="login-wrapper">
          <h2 class="login-title">로그인</h2>
          <form class="login-form" id="loginForm">
            <div class="form-group">
              <label for="emailInput" class="form-label">이메일</label>
              <input
                type="email"
                id="emailInput"
                class="form-input ${this.state.emailError ? 'error' : ''}"
                placeholder="이메일을 입력하세요"
                value="${this.state.email}"
              />
              <p class="helper-text ${this.state.emailError ? 'show' : ''}">
                ${this.state.emailError || '*이메일을 입력해주세요'}
              </p>
            </div>
            <div class="form-group">
              <label for="passwordInput" class="form-label">비밀번호</label>
              <input
                type="password"
                id="passwordInput"
                class="form-input ${this.state.passwordError ? 'error' : ''}"
                placeholder="비밀번호를 입력하세요"
                value="${this.state.password}"
              />
              <p class="helper-text ${this.state.passwordError ? 'show' : ''}">
                ${this.state.passwordError || '*비밀번호를 입력해주세요'}
              </p>
            </div>
            <button type="submit" class="submit-btn" id="submitBtn" disabled>
              로그인
            </button>
            <div class="signup-link-section">
              <a href="/signup" class="signup-link">회원가입</a>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  mounted() {
    const emailInput = this.$el.querySelector('#emailInput');
    const passwordInput = this.$el.querySelector('#passwordInput');
    const submitBtn = this.$el.querySelector('#submitBtn');
    const form = this.$el.querySelector('#loginForm');

    emailInput.addEventListener('input', (e) => {
      this.state.email = e.target.value;
      this.validateEmail();
      this.updateSubmitButton();
    });

    passwordInput.addEventListener('input', (e) => {
      this.state.password = e.target.value;
      this.validatePassword();
      this.updateSubmitButton();
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      await this.handleSubmit();
    });
  }

  validateEmail() {
    this.state.emailError = validateEmail(this.state.email);
    this.update();
  }

  validatePassword() {
    this.state.passwordError = validateLoginPassword(this.state.password);
    this.update();
  }

  updateSubmitButton() {
    const submitBtn = this.$el.querySelector('#submitBtn');
    const isValid = !this.state.emailError && !this.state.passwordError &&
                   this.state.email && this.state.password;
    submitBtn.disabled = !isValid;
  }

  async handleSubmit() {
    try {
      this.setState({ isLoading: true });
      const loginRequest = new LoginRequest({
        email: this.state.email,
        password: this.state.password
      });
      const response = await login(loginRequest);
      AuthService.login(response.userId);
      navigateReplace('/posts');
    } catch (error) {
      alert(error.message || '로그인에 실패했습니다.');
    } finally {
      this.setState({ isLoading: false });
    }
  }
}

export default LoginPage;
```

---

## SPA 라우팅

### 라우터 사용법

```javascript
// app.js
import { createRouter } from './core/Router.js';
import LoginPage from './pages/LoginPage/index.js';
import SignupPage from './pages/SignupPage/index.js';

const router = createRouter();

router.addRoute('/', LoginPage);
router.addRoute('/login', LoginPage);
router.addRoute('/signup', SignupPage);
router.addRoute('/posts/:id', PostDetailPage); // 동적 라우트

router.init();
```

### 페이지 이동

```javascript
import { navigate, navigateReplace } from './core/Router.js';

navigate('/posts');
navigateReplace('/login');

// 링크는 자동으로 SPA 라우팅 처리
<a href="/signup">회원가입</a>
```

---

## API 통신

### API 레이어 구조

도메인별로 API 모듈을 분리하여 관리합니다.

```
src/api/
├── base/
│   ├── axios.js       # 커스텀 HTTP 클라이언트
│   └── MockServer.js  # Mock 서버
├── auth.js            # 인증 API
├── posts.js           # 게시글 API
├── comments.js        # 댓글 API
└── members.js         # 회원 API
```

### 커스텀 Axios 클라이언트

`src/api/base/axios.js`에 fetch 기반 HTTP 클라이언트 구현:

```javascript
class Axios {
  constructor(config = {}) {
    this.baseURL = config.baseURL || "";
    this.headers = config.headers || {};
    this.useMock = config.useMock !== undefined ? config.useMock : USE_MOCK;
  }

  async request(method, url, body, options = {}) {
    const config = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...this.headers,
        ...options.headers,
      },
      body: this.prepareBody(body, options.headers),
    };

    const res = await fetch(this.baseURL + url, config);
    if (res.status === 204) return null;
    const text = await res.text();
    return text ? JSON.parse(text) : null;
  }

  get(url, opt = {}) { return this.request("GET", url, null, opt); }
  post(url, body, opt = {}) { return this.request("POST", url, body, opt); }
  put(url, body, opt = {}) { return this.request("PUT", url, body, opt); }
  patch(url, body, opt = {}) { return this.request("PATCH", url, body, opt); }
  delete(url, opt = {}) { return this.request("DELETE", url, null, opt); }
}
```

### API 모듈 사용 예시

```javascript
// src/api/posts.js
import Axios from "./base/axios.js";

const api = new Axios({
  baseURL: "http://localhost:8080",
});

export const getPosts = async ({ page = 0, size = 20, sort = "createdAt,desc" } = {}) => {
  const queryParams = new URLSearchParams({ page, size, sort });
  const res = await api.get(`/api/v1/posts?${queryParams}`);
  return res.data;
};

export const getPostById = async (postId, memberId = null) => {
  const queryParams = memberId ? `?memberId=${memberId}` : "";
  const res = await api.get(`/api/v1/posts/${postId}${queryParams}`);
  return res.data;
};

export const createPost = async (postData) => {
  const res = await api.post("/api/v1/posts", postData);
  return res.data;
};

export const updatePost = async (postId, updateData) => {
  const res = await api.patch(`/api/v1/posts/${postId}`, updateData);
  return res.data;
};

export const deletePost = async (postId, memberId) => {
  await api.delete(`/api/v1/posts/${postId}?memberId=${memberId}`);
};

export const likePost = async (postId, memberId) => {
  await api.post(`/api/v1/posts/${postId}/like?memberId=${memberId}`);
};

export const unlikePost = async (postId, memberId) => {
  await api.delete(`/api/v1/posts/${postId}/like?memberId=${memberId}`);
};
```

### 페이지에서 API 사용

```javascript
import { getPosts } from '../../api/posts.js';
import { login } from '../../api/auth.js';
import LoginRequest from '../../dto/request/auth/LoginRequest.js';

async mounted() {
  const posts = await getPosts({ page: 0, size: 20 });
  console.log(posts);

  const loginRequest = new LoginRequest({ email, password });
  const response = await login(loginRequest);
}
```

### Mock 서버

개발 중 백엔드 없이 테스트 가능:

```javascript
// src/api/base/axios.js
const USE_MOCK = false; // true로 변경하면 Mock 서버 사용

// MockServer.js에서 Mock 데이터 관리
class MockServer {
  handle(method, url, body) {
    // Mock 응답 반환
  }
}
```

---

## AuthService - 인증 상태 관리

localStorage를 사용하여 로그인 상태를 유지합니다.

```javascript
import AuthService from '../utils/AuthService.js';

AuthService.login(userId);

AuthService.logout();

const userId = AuthService.getCurrentUserId();

const isLoggedIn = AuthService.isLoggedIn();

if (!AuthService.requireAuth()) {
  return;
}
```

---

## DTO 활용

### DTO 생성 및 사용

```javascript
import LoginRequest from '../../dto/request/auth/LoginRequest.js';
import { validateEmail, validateLoginPassword } from '../../validation/authValidation.js';

const loginRequest = new LoginRequest({
  email: 'user@example.com',
  password: 'password123'
});

const emailError = validateEmail(loginRequest.email);
const passwordError = validateLoginPassword(loginRequest.password);

if (emailError || passwordError) {
  console.error('Validation failed');
  return;
}

const response = await login(loginRequest);
```

---

## Validation

### 검증 함수 사용

```javascript
import { validateEmail, validatePassword, validateNickname } from '../../validation/authValidation.js';
import { VALIDATION_MESSAGES } from '../../validation/messages.js';

const emailError = validateEmail(email);
if (emailError) {
  this.setState({ emailError });
}

const passwordError = validatePassword(password);
const nicknameError = validateNickname(nickname);
```

### 검증 패턴

```javascript
// src/validation/patterns.js
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
export const NICKNAME_PATTERN = /^[^\s]{1,10}$/;
```

---

## 스타일 가이드

### CSS Variables 사용

테마 시스템을 활용하여 일관된 스타일을 유지합니다.

```css
.button {
  background-color: var(--color-primary);
  color: var(--color-text-inverse);
}

.button:hover {
  background-color: var(--color-primary-hover);
}

.button:disabled {
  background-color: var(--color-primary-disabled);
}
```

### 주요 CSS Variables

```css
--color-primary: #7F6AEE;
--color-primary-hover: #6B5ED6;
--color-primary-disabled: #ACA0EB;
--color-error: #ff4444;
--color-success: #4caf50;
--color-background: #f5f5f5;
--color-surface: #ffffff;
--color-text: #333333;
--color-text-secondary: #666666;
```

---

## 개발 워크플로우

### 1. 새 페이지 추가

1. `src/pages/NewPage/` 폴더 생성
2. `index.js` 파일 생성 (Component 클래스 상속)
3. `style.css` 파일 생성
4. `render()` 메서드 구현
5. `mounted()` 에서 이벤트 리스너 등록
6. `src/app.js` 에 라우트 추가

### 2. 새 컴포넌트 추가

1. `src/components/NewComponent/` 폴더 생성
2. `index.js` 파일 생성 (Component 클래스 상속)
3. `style.css` 파일 생성
4. `render()` 메서드로 HTML 반환
5. Props를 통해 외부에서 데이터 주입
6. 필요한 페이지에서 import 하여 사용

### 3. API 연동

1. 해당 도메인의 API 모듈 확인 (`src/api/posts.js` 등)
2. 필요한 API 함수가 없으면 추가 작성
3. DTO 파일 확인/생성 (`src/dto/`)
4. 검증 함수 확인/생성 (`src/validation/`)
5. 페이지에서 API 함수 import 및 호출
6. 에러 처리 구현

---

## React 전환 준비

현재 구조는 React로 쉽게 전환할 수 있도록 설계되었습니다.

### 전환 시 변경 사항

1. **폴더 구조** - 동일 (변경 불필요)

2. **컴포넌트 구조**
   ```javascript
   // 현재 (바닐라 JS)
   class LoginPage extends Component {
     render() {
       return `<div>...</div>`;
     }
   }

   // React로 전환
   class LoginPage extends React.Component {
     render() {
       return <div>...</div>;  // JSX 사용
     }
   }
   ```

3. **상태 관리** - 동일
   ```javascript
   this.setState({ email: value });
   ```

4. **라이프사이클**
   ```javascript
   // 현재
   mounted() { }
   beforeUnmount() { }

   // React
   componentDidMount() { }
   componentWillUnmount() { }
   ```

5. **라우팅**
   - 현재 커스텀 라우터 → React Router로 교체

6. **스타일 로딩**
   - 동적 `<link>` 태그 → `import './style.css'`로 변경

7. **API 레이어**
   - 현재 커스텀 Axios → axios 라이브러리로 교체 (선택적)

---

## 베스트 프랙티스

1. **컴포넌트는 작고 단일 책임을 가져야 합니다**
   - 한 컴포넌트는 하나의 역할만 수행
   - 재사용 가능하도록 설계

2. **Props를 통해 데이터를 전달합니다**
   - 부모 → 자식으로 데이터 흐름
   - Props는 읽기 전용

3. **상태는 최소화합니다**
   - 필요한 상태만 관리
   - 계산 가능한 값은 상태로 저장하지 않음

4. **DTO를 활용합니다**
   - API 통신 시 DTO 사용
   - 타입 안정성 확보

5. **검증은 분리합니다**
   - 비즈니스 로직과 검증 로직 분리
   - 재사용 가능한 검증 함수 작성

6. **CSS Variables를 사용합니다**
   - 일관된 디자인 시스템
   - 테마 전환 용이

7. **이벤트 리스너를 정리합니다**
   - `beforeUnmount()`에서 리스너 제거
   - 메모리 누수 방지

8. **에러 처리를 명확히 합니다**
   - try-catch로 에러 처리
   - 사용자에게 명확한 에러 메시지 표시

9. **간단하게 시작하고 점진적으로 개선합니다**
   - 기본 기능만 먼저 구현
   - 동작 확인 후 고급 기능 추가

---

## 주의사항

1. **직접 DOM 조작을 최소화합니다**
   - `setState()`를 통한 상태 변경으로 자동 렌더링
   - 불가피한 경우에만 직접 DOM 접근

2. **이벤트 위임을 고려합니다**
   - 동적으로 생성되는 요소의 이벤트 처리

3. **XSS 공격을 방지합니다**
   - 사용자 입력을 HTML에 직접 삽입하지 않음
   - 필요 시 이스케이프 처리

4. **메모리 누수를 방지합니다**
   - 이벤트 리스너 정리
   - 타이머 정리

---

## 실행 방법

### Live Server 사용 (권장)

VSCode의 Live Server 확장 프로그램을 설치한 후:
1. `index.html` 파일을 엽니다
2. 우클릭 → "Open with Live Server" 선택

### Python 서버 사용

```bash
python -m http.server 8000
```

---

## 참고 문서

- [MDN Web Docs](https://developer.mozilla.org/)
- [JavaScript.info](https://javascript.info/)
- [React 공식 문서](https://react.dev/) (구조 참고용)

---

## 버전 히스토리

- **v1.2.0** (2025-11-18): 실제 구조 반영
  - API 레이어 도메인별 분리 (auth, posts, comments, members)
  - 커스텀 Axios 클래스 구현 및 설명 추가
  - Mock 서버 지원 추가
  - AuthService, 이미지 업로드 등 유틸리티 설명 추가
  - 실제 구현된 컴포넌트 목록 반영
  - Component 베이스 클래스 메서드 상세 설명

- **v1.1.0** (2025-11-08): 폴더 구조 리팩토링
  - 컴포넌트/페이지별 폴더 구조 적용 (index.js + style.css)
  - 스타일 동적 로딩 방식 도입
  - 응집성 향상 및 React 전환 용이성 개선

- **v1.0.0** (2025-11-08): 초기 문서 작성
  - 바닐라 JS + React 유사 구조 가이드
  - SPA 아키텍처 정의
  - 컴포넌트 작성 가이드
