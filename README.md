# Community TechBlog Frontend

https://github.com/user-attachments/assets/32695646-487e-4083-a134-323ec0145b43

개발자 커뮤니티형 **Tech Blog / Community** 서비스의 프론트엔드 코드베이스입니다.  
React + TypeScript + Vite 기반의 SPA로, 게시글 목록/상세/작성, 댓글, 프로필, OAuth 로그인 등 기능을 제공합니다.

---

## 주요 기능

- **게시글**
  - 게시글 목록/검색/페이지네이션 (`/`, `/posts`)
  - 게시글 상세 보기 및 추천 글, 조회수/좋아요/댓글 노출 (`/posts/:postId`)
  - Toast UI 기반 **Markdown 에디터**로 글 작성/수정 (`/posts/create`, `/posts/:postId/edit`)
- **댓글**
  - 댓글 목록/작성/정렬 및 좋아요, 신고/편집 액션용 UI 컴포넌트
- **프로필**
  - 내 프로필 및 다른 회원 프로필 조회 (`/profile`, `/profile/:memberId`)
  - 프로필 편집 페이지에서 기본 정보, 경력/스택, 소셜 링크 수정
- **인증**
  - 이메일/비밀번호 로그인 및 회원가입 (`/login`, `/signup`)
  - OAuth 로그인 콜백 처리 (`/oauth/callback`)
  - `AuthContext`를 통한 전역 로그인 상태 관리
- **기타**
  - 상단 헤더/하단 푸터, 사이드바(인기글/태그), 스크롤 탑 버튼, 토스트 알림 등 공용 UI

---

## 기술 스택

- **프레임워크**: React 18, React Router DOM 7
- **언어/번들러**: TypeScript, Vite
- **HTTP 클라이언트**: Axios (토큰 인터셉터 및 리프레시 토큰 플로우 내장)
- **에디터/마크다운**: @toast-ui/editor, @toast-ui/react-editor
- **스타일**: CSS Modules + 전역 스타일(`src/styles`)
- **품질 도구**: ESLint, Prettier, TypeScript ESLint 플러그인들

---

## 프로젝트 구조 (요약)

자세한 구조 가이드는 `src/ARCHITECTURE.md`를 참고하세요.

- `src/main.tsx` – React 엔트리 포인트, 전역 스타일 로딩
- `src/App.tsx` – `AuthProvider`로 앱 전체를 감싸고 라우터 렌더링
- `src/app/Router.tsx` – 라우팅 정의 (페이지별 URL 매핑)
- `src/pages` – 라우팅되는 화면 단위 컴포넌트
- `src/features` – 도메인별 비즈니스 로직/상태를 캡슐화한 custom hooks
- `src/components` – 재사용 가능한 프레젠테이션(UI) 컴포넌트 모음
- `src/api` – Axios 기반 API 모듈 및 HTTP 클라이언트 (`httpClient`)
- `src/types` – API DTO 및 공통 타입 정의
- `src/config` – 환경 변수 래퍼(`env.ts`), 기본 설정/플래그
- `src/mocks` – `USE_MOCK` 플래그로 사용하는 더미 데이터

페이지/컴포넌트에 대한 자세한 개요는 다음 문서를 참고할 수 있습니다.

- `src/pages/OVERVIEW.md`
- `src/components/COMPONENTS.md`
- `docs/api-spec.md`, `docs/api-spec.v2.md` – 프론트 기준으로 추론한 백엔드 API 스펙

---

## 환경 설정

Vite 환경 변수를 통해 API 서버와 모킹 여부 등을 제어합니다 (`src/config/env.ts` 참고).

필요한 기본 변수 예시는 다음과 같습니다.

```bash
VITE_API_BASE_URL=http://localhost:8080
VITE_USE_MOCK=false         # true 로 설정하면 일부 도메인에서 mock 데이터 사용
VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
```

프로젝트 루트에 `.env.local` 등을 생성 후 위와 같이 설정한 뒤 개발 서버를 실행합니다.

---

## 개발 및 빌드

프로젝트 루트에서 다음 스크립트를 사용할 수 있습니다.

- `npm install` – `package.json`에 선언된 의존성 설치
- `npm run dev` – Vite 개발 서버 실행 (기본: `http://localhost:5173`)
- `npm run build` – TypeScript 타입 체크 후 Vite 프로덕션 빌드
- `npm run preview` – 빌드 결과를 로컬에서 미리보기

브라우저에서 `http://localhost:5173`를 열어 애플리케이션을 확인할 수 있습니다.

---

## 설계 문서 모음

이 레포지토리는 프론트엔드 구조와 API 설계를 문서로 함께 관리합니다.

- `docs/frontend-architecture-analysis.md` – 이 프로젝트 전체를 대상으로 한 프론트 설계 분석서
- `src/ARCHITECTURE.md` – `src` 폴더 구조와 레이어별 책임 가이드
- `src/pages/OVERVIEW.md` – 페이지 역할/리팩터링 아이디어 개요
- `src/components/COMPONENTS.md` – 공용 컴포넌트 목록 및 개선 포인트
- `docs/api-spec.md`, `docs/api-spec.v2.md`, `docs/api-spec-review.md` – API 스펙 및 검토 기록

위 문서들을 함께 참고하면, 신규 기능 설계나 코드 리뷰 시 프로젝트 의도를 빠르게 파악할 수 있습니다.
