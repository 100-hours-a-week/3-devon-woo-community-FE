# Auth Pages - 로그인 및 회원가입

사용자 인증 관련 페이지 (로그인/회원가입)

## 📁 파일 구조

```
sample-page/
├── login/
│   ├── login.html           # 로그인 페이지
│   ├── login.css            # 로그인 스타일
│   └── login.js             # 로그인 로직
└── signup/
    ├── signup.html          # 회원가입 페이지
    ├── signup.css           # 회원가입 스타일
    └── signup.js            # 회원가입 로직
```

---

## 🔐 로그인 페이지

### 주요 기능

#### 1. 기본 폼
- **이메일 입력**: 이메일 형식 검증
- **비밀번호 입력**: 표시/숨기기 토글 버튼
- **로그인 버튼**: 검은색 버튼, 호버 효과

#### 2. OAuth2 소셜 로그인
동그라미 형태의 버튼 4개:
- **Google**: 파란색 (#4285f4)
- **GitHub**: 검은색 (#333)
- **Kakao**: 노란색 (#fee500)
- **Naver**: 초록색 (#03c75a)

각 버튼에 SVG 아이콘 포함

#### 3. 에러 메시지 처리
```css
.error-message {
    min-height: 20px;           /* 공간 미리 확보 */
    visibility: hidden;          /* 레이아웃 유지 */
    opacity: 0;
}

.error-message.visible {
    visibility: visible;
    opacity: 1;
}
```

**특징:**
- `min-height`로 공간을 미리 확보
- `visibility: hidden`으로 숨김 (display: none 대신)
- **레이아웃 시프트 없음** (다른 요소가 밀리지 않음)

#### 4. 비밀번호 토글
- 눈 아이콘 버튼
- 클릭 시 `type="password"` ↔ `type="text"` 전환
- 아이콘 변경 (눈 열림 ↔ 눈 감김)

#### 5. 추가 링크
- 이메일 찾기
- 비밀번호 찾기
- 회원가입 링크

### API 연동

```javascript
// 로그인
POST /api/v1/auth/login
Request: {
  email: string,
  password: string
}
Response: {
  accessToken: string,
  refreshToken: string,
  member: {
    id: number,
    email: string,
    nickname: string
  }
}

// OAuth2 로그인
GET /api/v1/oauth2/authorization/{provider}
provider: google | github | kakao | naver
```

---

## 📝 회원가입 페이지

### 주요 기능

#### 1. 이메일 인증

**플로우:**
```
1. 이메일 입력
2. "인증코드 발송" 버튼 클릭
3. 이메일로 6자리 코드 전송
4. 5분 타이머 시작
5. 인증코드 입력 및 확인
6. 인증 완료
```

**타이머:**
- 5분 카운트다운 (05:00 → 00:00)
- 시간 만료 시 에러 메시지
- 재발송 가능

**상태 관리:**
```javascript
isEmailVerified: false  // 인증 완료 시 true
```

#### 2. 필수 입력 항목

**이메일**
- 형식 검증: `user@domain.com`
- 중복 확인 (인증 코드 발송 시)
- 인증 완료 후 disabled

**닉네임**
- 2-20자 이내
- 실시간 중복 확인 (500ms debounce)
- API: `GET /api/v1/members/check-nickname?nickname=...`

**비밀번호**
- 최소 8자
- 영문, 숫자, 특수문자 모두 포함
- 실시간 강도 검증

**비밀번호 확인**
- 원본 비밀번호와 일치 검증
- 불일치 시 에러 메시지

#### 3. 약관 동의

```
[전체 동의] (체크 시 모두 선택)
────────────────────
[필수] 이용약관 동의 [보기]
[필수] 개인정보 처리방침 동의 [보기]
[선택] 마케팅 정보 수신 동의 [보기]
```

- 필수 약관 미동의 시 회원가입 버튼 비활성화
- 전체 동의 체크 시 모든 항목 선택
- 각 항목별 동의 시 전체 동의 자동 체크

#### 4. 헬프 텍스트 시스템

모든 입력 필드에 헬프 텍스트 영역:

```css
.help-text {
    min-height: 18px;      /* 공간 미리 확보 */
    visibility: hidden;
    opacity: 0;
}

.help-text.visible.error {
    color: #f44336;        /* 빨간색 */
}

.help-text.visible.success {
    color: #4caf50;        /* 초록색 */
}

.help-text.visible.info {
    color: #667eea;        /* 파란색 */
}
```

**타입:**
- `error`: 빨간색 (유효성 검증 실패)
- `success`: 초록색 (검증 성공)
- `info`: 파란색 (안내 메시지)

**예시:**
```
이메일: ✓ 인증코드가 발송되었습니다. (success)
닉네임: ✗ 이미 사용 중인 닉네임입니다. (error)
비밀번호: ✓ 사용 가능한 비밀번호입니다. (success)
```

#### 5. 회원가입 버튼 활성화 조건

모든 조건을 만족해야 활성화:

```javascript
const formValid =
    this.isEmailVerified &&                    // 이메일 인증 완료
    this.nicknameInput.value.trim() &&         // 닉네임 입력
    this.validatePassword() &&                 // 비밀번호 검증 통과
    this.validatePasswordConfirm() &&          // 비밀번호 확인 일치
    requiredTerms;                             // 필수 약관 동의

this.signupBtn.disabled = !formValid;
```

### API 연동

```javascript
// 인증코드 발송
POST /api/v1/auth/email/send
Request: {
  email: string
}

// 인증코드 확인
POST /api/v1/auth/email/verify
Request: {
  email: string,
  code: string (6자리)
}

// 닉네임 중복 확인
GET /api/v1/members/check-nickname?nickname={nickname}
Response: {
  available: boolean
}

// 회원가입
POST /api/v1/auth/signup
Request: {
  email: string,
  nickname: string,
  password: string,
  marketingAgreed: boolean
}
```

---

## 🎨 디자인 시스템

### 컬러 팔레트

```css
Primary: #667eea (파란색/보라색)
Black: #000, #333
Text: #333 (기본), #666 (보조), #999 (비활성)
Border: #e5e5e5
Background: #ffffff, #fafafa
Error: #f44336
Success: #4caf50
Info: #667eea
```

### 타이포그래피

```css
제목: 48px, 700 (모바일: 36px)
부제목: 15px, 400 (line-height: 1.6)
라벨: 14px, 600
입력 필드: 15px, 400
버튼: 16px, 600
헬프 텍스트: 12-13px
```

### 레이아웃

```css
최대 너비: 420px (로그인), 480px (회원가입)
패딩: 60px 20px (데스크톱), 40px 20px (모바일)
간격: 16px, 24px, 32px, 48px
Border Radius: 8px
```

### 인터랙션

```css
Transition: all 0.2s ease
Hover: opacity 0.7, transform translateY(-2px)
Active: transform scale(0.98)
Focus: border-color #667eea
```

---

## 🔍 레이아웃 시프트 방지 전략

### 문제
에러 메시지가 갑자기 나타날 때 다른 요소들이 밀려나는 현상

### 해결 방법

#### 1. 공간 미리 확보
```css
.help-text {
    min-height: 18px;    /* 항상 18px 높이 유지 */
}

.error-message {
    min-height: 20px;    /* 항상 20px 높이 유지 */
}
```

#### 2. visibility 사용 (display 대신)
```css
.help-text {
    visibility: hidden;  /* 공간은 차지하되 안 보임 */
    opacity: 0;
}

.help-text.visible {
    visibility: visible; /* 보이게만 전환 */
    opacity: 1;
}
```

#### 3. 비교

| 방식 | 레이아웃 시프트 | 공간 차지 |
|------|----------------|----------|
| `display: none` → `block` | ❌ 발생 | ❌ 없음 → 있음 |
| `visibility: hidden` → `visible` | ✅ 없음 | ✅ 항상 있음 |
| `opacity: 0` → `1` | ✅ 없음 | ✅ 항상 있음 |

**채택:** `visibility + opacity` 조합

---

## 🛡️ 유효성 검증

### 이메일
```javascript
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
```

### 비밀번호
```javascript
- 최소 8자
- /[a-zA-Z]/ (영문 포함)
- /\d/ (숫자 포함)
- /[!@#$%^&*(),.?":{}|<>]/ (특수문자 포함)
```

### 닉네임
```javascript
- 2-20자
- 중복 확인 API 호출 (500ms debounce)
```

### 인증코드
```javascript
- 정확히 6자리
- 5분 이내 입력
```

---

## 📱 반응형 디자인

### 브레이크포인트: 768px

**모바일 변경사항:**
```css
페이지 제목: 48px → 36px
헤더 높이: 72px → 64px
패딩: 60px → 40px
OAuth 버튼: 48px → 44px
인증 버튼: 가로 배치 → 세로 배치
```

---

## 🚀 사용 흐름

### 로그인 플로우

```
1. /login/login.html 접속
2. 이메일, 비밀번호 입력
3. 로그인 버튼 클릭
4. API 호출 → 토큰 저장
5. 메인 페이지로 리다이렉트
```

또는

```
1. OAuth 버튼 클릭
2. 소셜 로그인 페이지로 이동
3. 인증 후 콜백
4. 토큰 저장 → 메인 페이지
```

### 회원가입 플로우

```
1. /signup/signup.html 접속
2. 이메일 입력 → 인증코드 발송
3. 인증코드 입력 → 확인 (5분 이내)
4. 닉네임 입력 → 중복 확인
5. 비밀번호 입력 및 확인
6. 약관 동의
7. 회원가입 버튼 활성화
8. 회원가입 완료 → 로그인 페이지
```

---

## 🔒 보안 고려사항

### 1. 비밀번호 보안
```javascript
// 프론트엔드에서 평문 전송 (HTTPS 필수)
// 백엔드에서 bcrypt 해싱
POST /api/v1/auth/signup
{
  password: "plaintext"  // HTTPS로 암호화 전송
}
```

### 2. 토큰 저장
```javascript
localStorage.setItem('accessToken', token);
localStorage.setItem('refreshToken', refreshToken);
```

**보안 권장사항:**
- HttpOnly Cookie 사용 권장 (XSS 방지)
- Refresh Token은 별도 저장
- Access Token 만료 시간 짧게 (15분)

### 3. CSRF 방지
OAuth2 로그인 시 state 파라미터 사용

### 4. Rate Limiting
```
인증코드 발송: 1분당 3회
로그인 시도: 5분당 5회
회원가입: 1시간당 3회
```

---

## 📊 상태 관리

### 로그인 상태
```javascript
// localStorage
{
  accessToken: "eyJhbGc...",
  refreshToken: "eyJhbGc...",
  user: {
    id: 123,
    email: "user@example.com",
    nickname: "사용자"
  }
}
```

### 회원가입 상태
```javascript
class SignupController {
  isEmailVerified: boolean;
  timer: number | null;
  remainingTime: number;
}
```

---

## 🎯 접근성 (Accessibility)

### 1. Semantic HTML
```html
<form>
  <label for="emailInput">이메일</label>
  <input id="emailInput" type="email" required>
</form>
```

### 2. ARIA 속성
```html
<button aria-label="비밀번호 표시">
<div aria-live="polite">에러 메시지</div>
```

### 3. 키보드 네비게이션
- Tab 순서 유지
- Enter로 폼 제출
- 포커스 시 outline 표시

### 4. 색상 대비
- 에러: #f44336 (빨간색, 대비 4.5:1 이상)
- 성공: #4caf50 (초록색, 대비 4.5:1 이상)
- 텍스트: #333 (검은색, 대비 12:1)

---

## 🧪 테스트 시나리오

### 로그인
- [ ] 유효한 이메일/비밀번호로 로그인 성공
- [ ] 잘못된 비밀번호 시 에러 메시지
- [ ] 존재하지 않는 이메일 시 에러 메시지
- [ ] OAuth 버튼 클릭 시 리다이렉트
- [ ] 비밀번호 토글 동작
- [ ] 엔터키로 폼 제출

### 회원가입
- [ ] 이메일 인증 코드 발송 및 확인
- [ ] 인증 시간 만료 (5분)
- [ ] 닉네임 중복 확인
- [ ] 비밀번호 강도 검증
- [ ] 비밀번호 확인 일치 검증
- [ ] 필수 약관 미동의 시 버튼 비활성화
- [ ] 전체 동의 체크/해제
- [ ] 회원가입 성공 시 로그인 페이지로 이동

### 레이아웃 시프트
- [ ] 에러 메시지 표시 시 다른 요소 밀림 없음
- [ ] 헬프 텍스트 표시 시 레이아웃 유지
- [ ] 인증 영역 표시 시 스무스한 전환

---

## 📝 개선 가능 사항

### 단기
- 비밀번호 찾기 기능 구현
- 이메일 찾기 기능 구현
- OAuth 추가 (Apple, Facebook)
- 2단계 인증 (2FA)

### 중기
- 소셜 계정 연동
- 프로필 이미지 업로드
- 회원 정보 수정
- 탈퇴 기능

### 장기
- 생체 인증 (Face ID, Touch ID)
- SSO (Single Sign-On)
- 패스키 (Passkey) 지원
- WebAuthn 지원

---

## 🔗 관련 링크

- [OAuth2 인증 플로우](https://oauth.net/2/)
- [WCAG 접근성 가이드](https://www.w3.org/WAI/WCAG21/quickref/)
- [비밀번호 보안 가이드](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)
