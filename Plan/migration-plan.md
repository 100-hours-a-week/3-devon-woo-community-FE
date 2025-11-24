# React + TypeScript 마이그레이션 상세 계획 (tech-blog)

> 이 문서는 `legacy/` 바닐라 JS 코드를 `src/` React + TS 구조로 옮기는 **실행 계획 + 체크리스트**이다.  
> 실제 진행 상황에 따라 체크박스를 갱신하고, 필요한 세부 계획은 항목별로 하위 문서를 추가한다.

---

## 1. 환경/도구 정비 (React TS 추가 설정)

### 1-1. 경로 alias 및 빌드 설정

- [ ] `tsconfig.json` 에 `paths` 추가
  - 예: `@/components/*`, `@/pages/*`, `@/features/*`, `@/shared/*`, `@/api/*`, `@/types/*`, `@/utils/*`
- [ ] `vite.config.ts` 의 `resolve.alias` 에 동일 alias 반영
- [ ] `import` 경로를 상대경로 대신 `@` 기반 절대 경로로 사용하는 규칙 확립

### 1-2. 환경 변수 설계

- [ ] Vite env 규칙 정리 (`.env`, `.env.local`, `VITE_` prefix 등)
- [ ] API 베이스 URL, 환경별 설정을 env로 분리
  - 예: `VITE_API_BASE_URL`, `VITE_IMAGE_CDN_URL`
- [ ] env 타입 정의 (`import.meta.env` 타입 확장) 여부 결정 및 구현

### 1-3. Lint/Format (초기 필수 셋업)

- [ ] ESLint 기본 설정
  - TypeScript + React 플러그인 포함
  - 기본 규칙: `no-unused-vars`, `no-explicit-any` 최소 적용
- [ ] Prettier 기본 설정
  - 세미콜론/따옴표 등 포맷팅 규칙 최소 정의
- [ ] ESLint ↔ Prettier 충돌 방지
  - `eslint-config-prettier` 등으로 역할 분리 (Lint는 품질, Prettier는 포맷)

---

## 2. 컨벤션 및 디렉터리 구조

### 2-1. 디렉터리 구조 제안

> 실제 적용 전, 아래 구조를 기본안으로 사용하되 필요하면 사용자와 조정한다.

- `src/app` – 앱 엔트리, Router, 전역 Provider
- `src/pages` – 라우트 단위 페이지 컴포넌트
- `src/components` – 재사용 가능한 UI 컴포넌트
- `src/features` – 도메인/기능 단위 모듈 (예: profile, post, auth 등)
- `src/api` – API 클라이언트, 서비스 함수
- `src/types` – DTO/타입 정의 (Req/Res/Domain)
- `src/utils` – 유틸 함수 (라이브러리로 대체되지 않는 부분)
- `src/styles` – `global.css`, `theme.css`, 공용 변수
- `src/mocks` – DTO 기반 더미 데이터 및 mock API 설정

### 2-2. 네이밍 컨벤션

- 컴포넌트/페이지
  - 파일: `PascalCase.tsx` (예: `UserProfileCard.tsx`, `HomePage.tsx`)
  - 컴포넌트 이름 = 파일 이름 동일하게 유지
- 훅(hook)
  - 파일: `useSomething.ts` (예: `useUserProfile.ts`)
- 타입/DTO
  - 인터페이스: `PascalCase` + `Dto` / `Request` / `Response`
    - 예: `UserProfileDto`, `UpdateProfileRequest`, `UpdateProfileResponse`
- CSS
  - 공용: `global.css`, `theme.css`
  - 컴포넌트 전용: `ComponentName.module.css`

### 2-3. Props / State 설계 원칙

- Props
  - 가능한 **DTO 기반 타입** 사용 (`UserProfileDto` 등)
  - 불필요한 콜백/상태 전달 지양 (상태 끌어올리기 최소화)
- State
  - 초반: 컴포넌트별 **UI 상태만 로컬 state**로 관리
  - 서버 데이터/전역 상태가 복잡해지면, 추후 React Query/Zustand로 업그레이드
  - 파생 상태는 가능하면 계산으로 처리 (`useMemo` 등)

---

## 3. 기반 작업 (공통 코드) 계획

### 3-1. Theme / Global CSS

- [ ] `src/styles/global.css` 생성 및 reset / base 스타일 정리
- [ ] `src/styles/theme.css` 생성
  - 색상, 폰트, spacing, z-index 등 CSS 변수 정의
- [ ] `index.html` 혹은 `src/main.tsx` 에서 global/theme CSS import
- [ ] 기존 `legacy/` CSS를
  - 공통 스타일 → `global.css` / `theme.css`
  - 페이지/컴포넌트 전용 스타일 → 해당 컴포넌트의 `*.module.css` 로 분리
  - 복사는 명령어/도구로 하고, 필요한 부분만 수정하는 방식으로 진행 (토큰 절약)

### 3-2. Req / Res / API / DTO (TS 버전)

- [ ] `src/types/api` 디렉터리 생성
- [ ] legacy 코드와 API 스펙을 보고 DTO 정의
  - Request DTO, Response DTO, Domain DTO 분리
  - 각 파일에 **단일 책임** 부여 (하나의 도메인/리소스 기준)
- [ ] DTO 기반 더미 데이터 구조 및 규칙 정리

### 3-3. 더미 데이터 (DTO와 분리)

- [ ] `src/mocks` 디렉터리 생성
- [ ] `src/mocks/*Dummy.ts` 형태로 DTO와 일치하는 더미 데이터 정의
- [ ] 실제 API 연동 전에는 페이지/컴포넌트가 더미 데이터를 사용하도록 설계

### 3-4. API Service 코드

- [ ] HTTP 클라이언트
  - **SPA(Vite, tech-blog)**: Axios 사용 (기존 레거시와 통일)
  - **추후 Next.js 환경**: `fetch` 기반 래퍼로 전환/분리 (별도 Plan 문서에서 설계)
- [ ] `src/api/httpClient.ts` 에 공통 클라이언트(베이스 URL, 인터셉터, 에러 핸들링) 정의
- [ ] 도메인별 API 서비스 분리 (예: `src/api/profileApi.ts`, `src/api/postApi.ts`)
- [ ] 각 API 함수에 DTO 타입 연결 (입력/출력 모두)

### 3-5. Utils 코드

- [ ] `legacy/utils` 분석 후, 아래 기준으로 분류
  - **라이브러리로 대체 가능** → 적절한 라이브러리 도입 (예: date 처리, validation 등)
  - **순수 로직/프로젝트 특화** → `src/utils` 로 TS 변환하여 이식
- [ ] 불필요한 전역 상태 의존/DOM 직접 접근 유틸은 React 패턴에 맞게 리팩터링

### 3-6. Validation 방식 전환 (추후 업그레이드 대상)

- [ ] 현재 validation 로직 파악 (폼, 입력 검증 등)
- [ ] 의미 있는 폼 페이지(회원가입/로그인/글쓰기 등) 설계 시점에,
      **React Hook Form + Zod** 조합 도입
  - RHF: 폼 상태/에러 관리
  - Zod: 스키마/DTO 수준의 검증 책임
- [ ] DTO와 Validation 스키마를 명확히 분리
- [ ] 폼 컴포넌트에서 재사용 가능한 validation 훅/유틸 설계

---

## 4. 컴포넌트 마이그레이션 전략

### 4-1. 공통 UI 컴포넌트 식별

- [ ] `legacy/` HTML/JS에서 반복되는 UI 패턴 목록화
  - 버튼, 카드, 모달, 입력 폼, 네비게이션, 헤더/푸터 등
- [ ] 각 패턴별 React 컴포넌트 설계
  - Props 타입 정의 (DTO 기반), 상태/이벤트 책임 범위 명확히
- [ ] `src/components/common` 등에 공통 컴포넌트 배치

### 4-2. CSS 모듈 적용

- [ ] 각 컴포넌트에 대응하는 `ComponentName.module.css` 생성
- [ ] 기존 CSS 선택자 → className 매핑 전략 수립
  - 전역 영향 필요 시에만 `global.css` 사용

### 4-3. 리렌더링/성능 고려

- [ ] 비용 큰 컴포넌트는 `React.memo`, `useMemo`, `useCallback` 고려
- [ ] 리스트 렌더링 시 key, pagination/virtualization 검토

---

## 5. 페이지/라우팅 마이그레이션 전략

### 5-1. 라우터 도입

- [ ] React Router 도입 여부 및 버전 결정
- [ ] `src/app/router.tsx` (또는 유사한 파일)에서 라우트 구성
  - legacy URL → React Route 매핑 테이블 작성
- [ ] 페이지 단위 컴포넌트(`src/pages/*`) 생성

### 5-2. 페이지별 단계적 마이그레이션

- [ ] 우선순위가 높은 페이지부터 React로 이식
  - 예: 홈, 로그인/회원가입, 마이페이지 등
- [ ] 각 페이지에서
  - 더미 데이터 → 실제 API 연동으로 점진 전환
  - 레이아웃/디자인이 기존과 최대한 동일하도록 CSS 조정

### 5-3. 상태/인증 처리 (추후 업그레이드 포함)

- [ ] 초반에는 간단한 Auth Context 또는 httpClient 인터셉터 기반으로 최소 구현
- [ ] AccessToken 및 세션 관리를 **로컬스토리지 직활용 대신 React 방식**으로 재설계
- [ ] 서버 상태/전역 상태가 복잡해지면 **React Query + Zustand 조합** 도입
- [ ] OAuth2는 후순위로 두고, 필요한 경우 별도 Plan 문서로 분리

---

## 6. 품질/안정성 체크리스트

- [ ] 레이아웃 안정성: 이미지 크기 지정, 레이아웃 쉬프트 점검
- [ ] 폰트 로딩: FOUT/FOIT 방지 전략 (font-display 등) 적용 여부 확인
- [ ] 리렌더링 최소화: 불필요한 상위 state/props 전달 제거
- [ ] 비동기 안정성: 컴포넌트 언마운트 시 요청 취소/무시 처리
- [ ] 이벤트 처리: 스로틀/디바운스, 핸들러 메모이제이션 등 적용
- [ ] CSS 충돌 방지: module.css 기준, 전역 클래스 최소화
- [ ] 메모리 누수 방지: `useEffect` cleanup, `addEventListener` 해제 등 전역 자원 관리
- [ ] 라우팅 전환 안정성: 페이지 전환 시 깜빡임/상태 꼬임 없는지 확인
- [ ] 접근성: 키보드 내비게이션, 포커스 관리, aria 속성, 시맨틱 태그 사용

---

## 7. 추후 업그레이드 기준 (React Query / Zustand / RHF / Zod)

- React Query 도입 기준
  - 서버 데이터가 많아지고, 로딩/에러/캐시/리페치 로직이 반복될 때
  - 목록/상세 페이지에서 비슷한 `useEffect + axios` 패턴이 쌓일 때
- Zustand 도입 기준
  - 여러 페이지/컴포넌트에서 공유하는 UI/도메인 상태가 생길 때
  - props drilling이 심해지고 Context만으로 관리하기 어려울 때
- React Hook Form + Zod 도입 기준
  - 로그인/회원가입/글쓰기/프로필 수정 등 폼이 본격적으로 복잡해질 때
  - 동일한 validation 로직이 여러 폼에서 재사용될 필요가 있을 때

---

## 8. 사용자에게 확인이 필요한 선택 사항 목록

아래 항목은 여전히 **사용자와 상의 후 결정**해야 한다.

- [ ] Lint/Format 세부 규칙 (ESLint 규칙 세트, Prettier 스타일 등)
- [ ] 디렉터리 구조 세부 형태 (features 중심 vs pages 중심, `src/features` 범위 등)
- [ ] 테스트 도구 도입 시점 및 범위 (Vitest/RTL 도입 여부, 커버리지 목표 등)
