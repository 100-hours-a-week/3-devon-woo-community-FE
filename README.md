# 아무 말 대잔치

바닐라 JavaScript로 구현한 React 스타일 SPA 커뮤니티 사이트입니다.
Node.js나 React 없이 순수 JavaScript로 구현하되, React로 쉽게 전환할 수 있는 구조로 설계되었습니다.

## 프로젝트 구조

```
3-devon-woo-community-FE/
├── index.html              # SPA 진입점 (단일 HTML)
├── CLAUDE.md               # 개발 가이드
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
│   │   ├── SignupPage/
│   │   │   ├── index.js
│   │   │   └── style.css
│   │   ├── PostListPage/
│   │   │   ├── index.js
│   │   │   └── style.css
│   │   ├── PostDetailPage/
│   │   │   ├── index.js
│   │   │   └── style.css
│   │   ├── PostEditPage/
│   │   │   ├── index.js
│   │   │   └── style.css
│   │   ├── ProfilePage/
│   │   │   ├── index.js
│   │   │   └── style.css
│   │   └── ProfileEditPage/
│   │       ├── index.js
│   │       └── style.css
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
│   │   ├── authValidation.js
│   │   ├── memberValidation.js
│   │   ├── postValidation.js
│   │   ├── commentValidation.js
│   │   ├── patterns.js
│   │   ├── messages.js
│   │   └── index.js
│   ├── utils/             # 유틸리티 함수
│   │   └── api.js         # API 헬퍼 (GET, POST, PUT, DELETE)
│   └── styles/            # 전역 스타일
│       ├── theme.css      # 색상 테마 (CSS Variables)
│       └── global.css     # 전역 스타일 (reset, body, layout)
└── sample-page/           # 디자인 레퍼런스
    ├── login/
    ├── sgin-up/
    ├── post-list/
    ├── post-details/
    ├── post-make/
    ├── profile/
    └── profile-edit/
```

## 핵심 특징

- **React 스타일 컴포넌트**: 클래스 기반, `render()`, `setState()`, Props
- **컴포넌트별 폴더 구조**: 각 폴더에 `index.js` + `style.css`
- **SPA 라우팅**: History API 기반, 페이지 새로고침 없음
- **DTO 및 검증**: API 요청/응답 DTO, 분리된 검증 로직
- **CSS Variables**: 일관된 테마 시스템

## 주요 기능

로그인/회원가입, 게시글 CRUD, 댓글, 프로필 관리, 비밀번호 변경

## 실행 방법

### VSCode Live Server (추천)
`index.html` 우클릭 → "Open with Live Server"

### Python 서버
```bash
python -m http.server 8000
```

## 라우팅

- `/` - 게시글 목록
- `/login` - 로그인
- `/signup` - 회원가입
- `/posts/:id` - 게시글 상세
- `/posts/:id/edit` - 게시글 수정
- `/posts/create` - 게시글 작성
- `/profile` - 프로필
- `/profile/edit` - 프로필 수정

## 기술 스택

바닐라 JavaScript (ES6+) · CSS3 (CSS Variables) · HTML5

## 참고

- 개발 가이드: [CLAUDE.md](./CLAUDE.md)
- 샘플 디자인: [sample-page/](./sample-page/)
