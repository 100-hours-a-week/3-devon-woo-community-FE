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
- Fetch API를 사용한 비동기 통신
- DTO(Data Transfer Object) 활용
- RESTful API 통신

### 7. 점진적 개발
- 한 번에 많은 코드를 작성하지 않고 간단하고 레거시한 코드로 시작
- 기본 기능만 포함하여 점차 업그레이드
- HTML과 CSS 디자인은 sample-page를 그대로 참고

---

## 프로젝트 구조

### 폴더 구조 원칙

**응집성 우선**: 관련된 파일들은 같은 폴더에 배치합니다.
- 각 컴포넌트/페이지는 독립적인 폴더를 가지며, `index.js`와 `style.css`를 포함합니다.
- React 컴포넌트 구조와 동일하여 추후 전환이 쉽습니다.
- 스타일은 컴포넌트 로드 시 동적으로 `<link>` 태그 추가하여 로드합니다.

```
3-devon-woo-community-FE/
├── index.html              # SPA 진입점 (단일 HTML)
├── CLAUDE.MD               # 개발 가이드 (본 문서)
├── README.md               # 프로젝트 설명
├── src/
│   ├── app.js             # 앱 초기화 및 라우트 설정
│   ├── core/              # 코어 시스템
│   │   ├── Component.js   # 컴포넌트 베이스 클래스
│   │   └── Router.js      # 클라이언트 사이드 라우터
│   ├── components/        # 공통 컴포넌트
│   │   └── Header/
│   │       ├── index.js   # Header 컴포넌트
│   │       └── style.css  # Header 전용 스타일
│   ├── pages/             # 페이지 컴포넌트
│   │   ├── LoginPage/
│   │   │   ├── index.js   # LoginPage 컴포넌트
│   │   │   └── style.css  # LoginPage 전용 스타일
│   │   └── SignupPage/
│   │       ├── index.js   # SignupPage 컴포넌트
│   │       └── style.css  # SignupPage 전용 스타일
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
│   │   └── api.js         # API 헬퍼 (GET, POST, PUT, DELETE)
│   └── styles/            # 전역 스타일만 위치
│       ├── theme.css      # 색상 테마 (CSS Variables)
│       └── global.css     # 전역 스타일 (reset, body, layout)
└── sample-page/           # 디자인 레퍼런스 (참고용)
    ├── login/
    ├── sgin-up/
    ├── post-list/
    ├── post-details/
    ├── post-make/
    ├── profile/
    └── profile-edit/
```

### 스타일 관리 전략

1. **전역 스타일** (`src/styles/`)
   - `theme.css`: CSS Variables로 색상, 폰트 등 테마 정의
   - `global.css`: reset, body, 전역 레이아웃 스타일

2. **컴포넌트/페이지별 스타일**
   - 각 폴더 내 `style.css`에 해당 컴포넌트 전용 스타일 작성
   - 동적 로딩: 컴포넌트 생성 시 자동으로 `<link>` 태그 추가

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

// 스타일 동적 로드
const loadStyle = () => {
  const linkId = 'my-component-style';
  if (!document.getElementById(linkId)) {
    const link = document.createElement('link');
    link.id = linkId;
    link.rel = 'stylesheet';
    link.href = '/src/components/MyComponent/style.css';
    document.head.appendChild(link);
  }
};

class MyComponent extends Component {
  constructor(props = {}) {
    super(props);
    this.state = {
      // 상태 정의
    };
    loadStyle(); // 스타일 로드
  }

  // HTML 문자열을 반환하는 메서드
  render() {
    return `
      <div class="my-component">
        <h1>${this.props.title}</h1>
        <p>${this.state.message}</p>
      </div>
    `;
  }

  // 렌더링 후 실행되는 메서드 (이벤트 리스너 등록)
  mounted() {
    const button = this.$el.querySelector('.my-button');
    button.addEventListener('click', this.handleClick.bind(this));
  }

  // 이벤트 핸들러
  handleClick() {
    this.setState({ message: 'Clicked!' });
  }
}

export default MyComponent;
```

### 주요 메서드

#### `render()`
- **필수 구현**
- HTML 문자열을 반환
- props와 state를 활용하여 동적으로 생성
- React의 JSX와 유사한 역할

#### `mounted()`
- 컴포넌트가 DOM에 마운트된 후 실행
- 이벤트 리스너 등록
- API 호출 등 초기화 작업 수행
- React의 `componentDidMount()`와 유사

#### `setState(newState)`
- 상태를 업데이트하고 리렌더링
- React의 `setState()`와 동일한 역할
- 상태 변경 감지 및 자동 렌더링

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

### index.js (간단한 버전)

```javascript
import Component from '../../core/Component.js';

// 스타일 동적 로드
const loadStyle = () => {
  const linkId = 'login-page-style';
  if (!document.getElementById(linkId)) {
    const link = document.createElement('link');
    link.id = linkId;
    link.rel = 'stylesheet';
    link.href = '/src/pages/LoginPage/style.css';
    document.head.appendChild(link);
  }
};

class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    };
    loadStyle();
  }

  render() {
    return `
      <div class="page">
        <header class="header">
          <h1 class="header-title">아무 말 대잔치</h1>
        </header>

        <main class="main-container">
          <div class="login-wrapper">
            <h2 class="login-title">로그인</h2>

            <form class="login-form" id="loginForm">
              <div class="form-group">
                <label for="emailInput" class="form-label">이메일</label>
                <input
                  type="email"
                  id="emailInput"
                  class="form-input"
                  placeholder="이메일을 입력하세요"
                  value="${this.state.email}"
                />
              </div>

              <div class="form-group">
                <label for="passwordInput" class="form-label">비밀번호</label>
                <input
                  type="password"
                  id="passwordInput"
                  class="form-input"
                  placeholder="비밀번호를 입력하세요"
                  value="${this.state.password}"
                />
              </div>

              <button type="submit" class="submit-btn" id="submitBtn" disabled>
                로그인
              </button>

              <div class="signup-link-section">
                <a href="/signup" class="signup-link">회원가입</a>
              </div>
            </form>
          </div>
        </main>
      </div>
    `;
  }

  mounted() {
    const emailInput = this.$el.querySelector('#emailInput');
    const passwordInput = this.$el.querySelector('#passwordInput');
    const submitBtn = this.$el.querySelector('#submitBtn');
    const form = this.$el.querySelector('#loginForm');

    // 입력 이벤트
    emailInput.addEventListener('input', (e) => {
      this.state.email = e.target.value;
      this.checkFormValid(submitBtn);
    });

    passwordInput.addEventListener('input', (e) => {
      this.state.password = e.target.value;
      this.checkFormValid(submitBtn);
    });

    // 폼 제출
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSubmit();
    });
  }

  checkFormValid(submitBtn) {
    if (this.state.email && this.state.password) {
      submitBtn.disabled = false;
    } else {
      submitBtn.disabled = true;
    }
  }

  handleSubmit() {
    console.log('로그인 시도:', {
      email: this.state.email,
      password: this.state.password
    });
    // API 호출 로직 추가 예정
  }
}

export default LoginPage;
```

---

## SPA 라우팅

### 라우터 사용법

```javascript
// app.js
import Router from './core/Router.js';
import LoginPage from './pages/LoginPage/index.js';
import SignupPage from './pages/SignupPage/index.js';

const router = new Router();

// 라우트 등록
router.addRoute('/', LoginPage);
router.addRoute('/login', LoginPage);
router.addRoute('/signup', SignupPage);

// 라우터 초기화
router.init();

// 전역 라우터 참조 (컴포넌트에서 사용)
window.router = router;
```

### 페이지 이동

```javascript
// 프로그래매틱 네비게이션
window.router.navigate('/signup');

// 링크를 통한 네비게이션 (자동 감지)
<a href="/signup">회원가입</a>
```

---

## API 통신

### API 헬퍼 사용

```javascript
import { apiGet, apiPost, apiPut, apiDelete } from '../../utils/api.js';

// GET 요청
const posts = await apiGet('/api/v1/posts');

// POST 요청 (DTO 사용)
const loginDto = new LoginRequest({ email, password });
const response = await apiPost('/api/v1/auth/login', loginDto);

// PUT 요청
const updateDto = new PostUpdateRequest({ title, content });
await apiPut(`/api/v1/posts/${postId}`, updateDto);

// DELETE 요청
await apiDelete(`/api/v1/posts/${postId}`);
```

### DTO 활용

```javascript
import LoginRequest from '../../dto/request/auth/LoginRequest.js';
import { validateLoginRequest } from '../../validation/authValidation.js';

// DTO 생성
const loginDto = new LoginRequest({
  email: 'user@example.com',
  password: 'password123'
});

// 검증
const errors = validateLoginRequest(loginDto);
if (Object.keys(errors).length > 0) {
  // 에러 처리
  console.error('Validation errors:', errors);
  return;
}

// API 호출
const response = await apiPost('/api/v1/auth/login', loginDto);
```

---

## 스타일 가이드

### CSS Variables 사용

테마 시스템을 활용하여 일관된 스타일을 유지합니다.

```css
/* 정의된 색상 사용 */
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
--color-primary: #7F6AEE;           /* 메인 색상 */
--color-primary-hover: #6B5ED6;     /* 호버 상태 */
--color-primary-disabled: #ACA0EB;  /* 비활성 상태 */
--color-error: #ff4444;             /* 에러 */
--color-success: #4caf50;           /* 성공 */
--color-background: #f5f5f5;        /* 배경색 */
--color-surface: #ffffff;           /* 카드/패널 */
--color-text: #333333;              /* 텍스트 */
--color-text-secondary: #666666;    /* 보조 텍스트 */
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

1. 해당 DTO 파일 확인/생성 (`src/dto/`)
2. 검증 함수 확인/생성 (`src/validation/`)
3. API 헬퍼 함수 사용 (`src/utils/api.js`)
4. 에러 처리 구현

---

## 디자인 레퍼런스

`sample-page/` 디렉토리의 HTML/CSS를 참고하여 디자인을 구현합니다.

- **로그인**: `sample-page/login/`
- **회원가입**: `sample-page/sgin-up/`
- **게시글 목록**: `sample-page/post-list/`
- **게시글 상세**: `sample-page/post-details/`
- **게시글 작성**: `sample-page/post-make/`
- **프로필**: `sample-page/profile/`
- **비밀번호 변경**: `sample-page/profile-edit/`

**디자인은 그대로 가져가되, 구조는 컴포넌트화하여 재사용 가능하게 작성합니다.**

---

## React 전환 준비

현재 구조는 React로 쉽게 전환할 수 있도록 설계되었습니다.

### 전환 시 변경 사항

1. **폴더 구조** - 동일 (변경 불필요)
   ```
   src/components/Header/
   ├── index.js      ✓ 동일
   └── style.css     ✓ 동일 (또는 CSS Modules로 전환)
   ```

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
   // 현재
   this.setState({ email: value });

   // React (동일)
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
   - 동적 `<link>` 태그 추가 → `import './style.css'`로 변경

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
   - 타입 안정성 확보 (TypeScript 전환 대비)

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
   - 복잡한 최적화는 필요할 때 적용

---

## 주의사항

1. **직접 DOM 조작을 최소화합니다**
   - `setState()`를 통한 상태 변경으로 자동 렌더링
   - 불가피한 경우에만 직접 DOM 접근

2. **이벤트 위임을 고려합니다**
   - 동적으로 생성되는 요소의 이벤트 처리
   - 성능 최적화

3. **XSS 공격을 방지합니다**
   - 사용자 입력을 HTML에 직접 삽입하지 않음
   - 필요 시 이스케이프 처리

4. **메모리 누수를 방지합니다**
   - 이벤트 리스너 정리
   - 타이머 정리

5. **SEO를 고려합니다**
   - SPA의 한계 인지
   - 필요 시 SSR 또는 Pre-rendering 고려

---

## 실행 방법

### Live Server 사용 (권장)

VSCode의 Live Server 확장 프로그램을 설치한 후:
1. `index.html` 파일을 엽니다
2. 우클릭 → "Open with Live Server" 선택

### Python 서버 사용

```bash
# 프로젝트 루트에서
python -m http.server 8000

# 브라우저에서 http://localhost:8000 접속
```

**주의**: 서버 실행 테스트는 개발 과정에서 제외합니다.

---

## 참고 문서

- [MDN Web Docs](https://developer.mozilla.org/)
- [JavaScript.info](https://javascript.info/)
- [React 공식 문서](https://react.dev/) (구조 참고용)

---

## 버전 히스토리

- **v1.1.0** (2025-11-08): 폴더 구조 리팩토링
  - 컴포넌트/페이지별 폴더 구조 적용 (index.js + style.css)
  - 스타일 동적 로딩 방식 도입
  - 응집성 향상 및 React 전환 용이성 개선

- **v1.0.0** (2025-11-08): 초기 문서 작성
  - 바닐라 JS + React 유사 구조 가이드
  - SPA 아키텍처 정의
  - 컴포넌트 작성 가이드
