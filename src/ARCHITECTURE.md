# 프로젝트 구조 가이드 (`src` 기준)

이 문서는 현재 `src` 폴더 구조와 각 레이어의 “역할/책임”을 정리한 아키텍처 가이드입니다.  
새 코드를 추가할 때 어디에 어떤 파일을 두면 좋을지 기준으로 사용하면 됩니다.

---

## 1. 최상위 엔트리

- `src/main.tsx`
  - React 엔트리 포인트.
  - `ReactDOM.createRoot`로 앱을 붙이고, 전역 스타일(`styles/theme.css`, `styles/global.css`)을 포함.
  - 여기서는 **전역 Provider 나열** 정도까지만 하고, 비즈니스 로직은 두지 않습니다.

- `src/App.tsx`
  - 애플리케이션 최상위 컴포넌트.
  - 현재 역할:
    - `AuthProvider`로 전체 앱을 감싸기
    - `Router` 렌더링
  - 앞으로도 **전역 Provider 구성**과 **전역 레이아웃(예: 공통 모달 Portals)** 정도만 담당하고,
    도메인/페이지 로직은 `features`/`pages`로 위임합니다.

---

## 2. 라우팅 & 앱 레벨

- `src/app/Router.tsx`
  - `react-router-dom` 기반 라우터 설정.
  - URL → Page 컴포넌트 매핑만 담당.
  - **규칙**
    - 여기서는 “어떤 경로에 어떤 페이지 컴포넌트를 쓸지”만 정의합니다.
    - API 호출, 상태 관리, 비즈니스 로직은 Page 또는 Feature에서 처리합니다.

---

## 3. Pages (`src/pages`)

**역할: 라우팅되는 “화면 단위 컴포넌트”**  
URL 한 개당 1개의 Page. 레이아웃, 화면 전용 상태, 이벤트 처리 등을 담당합니다.

- 구조 예시
  - `src/pages/BlogListPage/BlogListPage.tsx`
  - `src/pages/PostDetailPage/PostDetailPage.tsx`
  - `src/pages/ProfilePage/ProfilePage.tsx`
  - 각 폴더 안에:
    - `PageName.tsx` – 실제 페이지 컴포넌트
    - `PageName.module.css` – 페이지 전용 스타일
    - `index.ts` – `export { default } from './PageName'` (라우터에서 간단하게 import)

- **Page가 하는 일**
  - 어떤 Feature/Component를 조합해서 화면을 구성할지 결정.
  - 화면 전용 상태/로직:
    - 정렬 방식 (`sort`)
    - 현재 페이지 (`currentPage`)
    - 화면에서만 쓰는 UI 상태 (선택된 탭, 모달 열림 여부 등)
  - `navigate` 호출, 스크롤 이동 등 “뷰 관점”의 행동.

- **Page가 하지 않는 일**
  - 복잡한 도메인 로직(데이터 조회, 가공, 기본값 채우기 등)을 직접 들고 있지 않는 것을 목표로 합니다.
    - 예: 프로필/포스트 데이터 로딩 → `features/profile`, `features/post` 훅에 위임.
  - 공용 UI 컴포넌트 정의 → `components`로 분리.

---

## 4. Features (`src/features`)

**역할: 도메인(기능 묶음) 단위의 상태/로직 캡슐화**

페이지들이 공통으로 사용하는 “비즈니스 로직 + 상태 + 훅”을 도메인별로 묶습니다.

- 현재 도메인들
  - `src/features/auth`
    - `AuthContext.tsx`: 인증 컨텍스트 & 훅
      - `AuthProvider`: 앱 전체를 감싸서 `user`, `login`, `logout` 등 제공.
      - `useAuth`: 로그인/회원가입/로그아웃/현재 유저 정보를 조회하는 훅.
    - `index.ts`: `export * from './AuthContext'`

  - `src/features/post`
    - `usePosts.ts`
      - 게시글 목록 조회, 검색, 페이지네이션 로직 담당.
      - `usePosts({ page, size, search })` 형태로 사용.
    - `index.ts`: `export * from './usePosts'`

  - `src/features/profile`
    - `useProfileOverview.ts`
      - 프로필 + 프로필에 연결된 포스트 목록을 함께 로딩.
      - 기본 프로필/더미 포스트 생성, `isOwner` 계산 등 **프로필 도메인 로직**을 캡슐화.
    - `index.ts`: `export * from './useProfileOverview'`

- **Feature가 하는 일**
  - 도메인에 속한 데이터/행동을 하나의 훅이나 모듈로 묶어서, 페이지/컴포넌트에 제공.
    - 예) `useAuth`, `usePosts`, `useProfileOverview` 등.
  - API 모듈(`src/api`)을 사용해 데이터를 가져오고,
    도메인에 맞는 구조로 가공/정규화.

- **Feature에 넣을 수 있는 것들 (예시)**
  - 도메인 전용 훅: `usePostDetail`, `useEditableProfile`, `useComments` 등.
  - 도메인에 강하게 결합된 UI 컴포넌트:
    - 예: `features/profile/components/ProfileSidebar.tsx` (프로필 화면에서만 쓰는 사이드바)
  - 도메인별 상태 관리 (추가로 zustand, jotai 등을 사용할 경우 여기서 정의).

---

## 5. Components (`src/components`)

**역할: 재사용 가능한 UI 조각들 (프레젠테이션 컴포넌트 중심)**  
도메인보다는 “화면 구조/스타일”에 가까운 것들을 모아 둡니다.

- 구조 패턴
  - 대부분 `컴포넌트명/컴포넌트명.tsx + .module.css + index.ts` 형태:
    - `src/components/Header/Header.tsx` + `Header.module.css` + `index.ts`
    - `src/components/Footer/Footer.tsx` + `Footer.module.css` + `index.ts`
    - `src/components/FormField/FormField.tsx` + `FormField.module.css` + `index.ts`
    - `src/components/CommentList/CommentList.tsx` + `CommentList.module.css` + `index.ts`
    - `src/components/ProfileCard/ProfileCard.tsx` + `ProfileCard.module.css` + `index.ts`
  - 사용 시:
    - `import Header from '@/components/Header'`
    - `import CommentList from '@/components/CommentList'`

- **Component가 하는 일**
  - props로 받은 데이터/콜백을 기반으로 UI 렌더링.
  - 스타일과 레이아웃, 상호작용(버튼 클릭 등) 처리.

- **Component가 하지 않는 일**
  - 직접 API를 호출하거나, 도메인 데이터 로딩을 담당하지 않는 것을 원칙으로 합니다.
    - 그런 로직은 `features`의 훅이나 상위 페이지에서 처리한 뒤, 결과만 props로 내려줍니다.

---

## 6. API & DTO (`src/api`, `src/types`)

### 6.1 API (`src/api`)

- 역할: 백엔드 HTTP API를 호출하는 **순수 함수 집합**.
- 주요 파일들
  - `httpClient.ts`
    - Axios 래퍼에 가까운 공통 HTTP 클라이언트.
    - baseURL, 토큰 설정/삭제, 공통 에러 처리 등을 담당.
  - `authApi.ts`
    - 로그인, 회원가입, 로그아웃 등 인증 관련 API.
  - `memberApi.ts`
    - 프로필 조회/수정 등 회원 관련 API.
  - `postApi.ts`
    - 게시글 목록/상세/생성/수정/삭제/좋아요 API.
    - `USE_MOCK`가 켜져 있으면 `mocks/postDummy`를 사용해 더미 데이터 반환.
  - `commentApi.ts`
    - 댓글 목록/생성 API.
  - `index.ts`
    - 각 API들을 모아서 re-export.

- **API 모듈의 특징**
  - React 훅/상태에 의존하지 않음 (순수 함수).
  - 요청/응답 타입은 `src/types`의 DTO 타입을 사용.
  - 실제로 이 API들을 어떻게 쓸지는 `features` 혹은 `pages`에서 결정.

### 6.2 DTO & 타입 (`src/types`)

- 역할: API 응답/요청, 공통 모델 등에 대한 타입 정의 (DTO에 해당).
- 구조
  - `src/types/post`
    - `PostSummaryResponse`, `PostResponse` 등 게시글 관련 타입.
  - `src/types/auth`
    - `LoginRequest`, `SignupRequest` 등 인증 요청 DTO.
  - `src/types/member`
    - `MemberResponse` 등 프로필/회원 정보 타입.
  - `src/types/comment`
    - 댓글 관련 타입.
  - `src/types/common`
    - `ApiResponse`, `PageResponse` 등 공통 래퍼 타입.

- **원칙**
  - 백엔드 스펙과 맞춰야 하는 데이터 구조는 여기서 정의/관리.
  - 도메인/뷰에서 별도 형태로 가공이 필요하면, feature 훅에서 DTO → ViewModel로 변환.

---

## 7. Hooks (`src/hooks`)

**역할: 도메인에 종속되지 않는 “공용 훅” 위치**

- 현재
  - `useMockData.ts`
    - `USE_MOCK` 플래그에 따라 mock 데이터/실제 데이터를 선택하는 유틸 훅.
    - 아직 실제 사용처는 없지만, “모든 도메인에서 공용으로 쓸 수 있는 로직”이라는 점에서 hooks에 위치.
  - `index.ts`
    - `export { useMockData, useMockDataSync } from './useMockData'`

- 앞으로 이 위치에 둘 만한 것들
  - `useDebounce`, `useIntersectionObserver`, `useToggle` 등 도메인 무관 유틸 훅.

---

## 8. Utils & Config & Styles

- `src/utils`
  - 포맷터/검증 등 순수 함수 모음.
  - 예: `formatters.ts`, `validators.ts`, `index.ts`.
  - React/도메인과 분리된 “순수 로직”을 모읍니다.

- `src/config`
  - 환경 설정, 상수, `USE_MOCK` 같은 플래그.

- `src/styles`
  - 전역 CSS (`theme.css`, `global.css`) 등.
  - 페이지/컴포넌트 전용 스타일은 각 폴더의 `.module.css`로 관리.

---

## 9. Mocks (`src/mocks`)

- 역할: `USE_MOCK`가 true일 때 사용할 더미 데이터/헬퍼.
- 예: `postDummy.ts` – 게시글 더미 데이터 생성.
- 주로 `src/api`나 `features`에서 개발/테스트용으로 사용.

---

## 10. 요약: 어떤 파일을 어디에 둘까?

- **새 페이지를 만들 때**
  - `src/pages/MyNewPage/MyNewPage.tsx`
  - `src/pages/MyNewPage/MyNewPage.module.css`
  - `src/pages/MyNewPage/index.ts`

- **도메인 로직/상태를 만들 때**
  - 인증/게시글/프로필처럼 “기능 이름”이 붙는 로직 → `src/features/<도메인>/`
  - 예: `usePostDetail`, `useEditableProfile`, `useComments` 등.

- **여러 곳에서 재사용 가능한 UI 조각**
  - 버튼/카드/리스트/폼 필드 등 → `src/components/<ComponentName>/`

- **백엔드 API 통신**
  - HTTP 호출 & DTO 매핑 → `src/api`

- **API 타입/공통 모델**
  - DTO/모델 타입 정의 → `src/types`

- **도메인과 무관한 순수 유틸/훅**
  - 포맷/검증/수학/일반 훅 → `src/utils`, `src/hooks`

이 가이드를 기준으로 “의미 있는 것”만 각 레이어에 배치하면,  
코드가 어디에 있어야 할지와 파일 역할이 훨씬 분명해집니다.  
추가로 정리하고 싶은 도메인(예: 댓글, 태그)을 정해주시면, 이 구조에 맞춰 실제 코드 이동도 도와드릴 수 있습니다.

