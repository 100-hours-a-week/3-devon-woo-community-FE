# React 아키텍처 분석 리포트

## 1. 문서로 정리된 아키텍처 레이어 (`src/ARCHITECTURE.md`)
- `main.tsx`/`App.tsx`는 전역 Provider(`AuthProvider`)와 Router만 담당하며, 비즈니스 로직은 포함하지 않음.
- `Router.tsx`는 경로마다 Page 컴포넌트를 매핑하는 역할만 수행하고, API 호출/상태 관리는 Page나 Feature로 위임.
- `pages`는 URL 별 화면을 구성하고 화면 전용 상태/뷰 로직(`search`, `currentPage`, `navigate` 등)을 담음.
- `features`는 도메인 훅(`useAuth`, `usePosts`, `useProfileOverview` 등)으로 상태/도메인 로직을 캡슐화.
- `components`는 재사용 가능한 UI 조각(헤더·사이드바·PostItem 등)으로, props 중심으로 UI만 렌더링함.
- `api`는 Axios 기반 HTTP 클라이언트를 감싼 순수 함수, `types`는 DTO 및 공통 응답 타입을 정의.
- `hooks`, `utils`, `config`, `styles`, `mocks`는 각각 공용 훅/순수 로직/환경 설정/전역 스타일/더미 데이터 용도.

## 2. 구현에서 확인한 실제 매핑
### 엔트리 & 라우터
- `src/main.tsx`에서 `ReactDOM.createRoot` → `<App />`을 렌더링하고 글로벌 CSS를 로드하며, `App.tsx`에서는 `AuthProvider`로만 감싼 뒤 `Router`를 뿌림 (`src/App.tsx`).
- `src/app/Router.tsx`는 `createBrowserRouter`로 `/`, `/posts/:postId`, `/profile` 등 경로와 페이지 컴포넌트를 1:1 매핑하며, 라우터 자체에 API/상태 로직 없음.

### Pages & View 로직
- `src/pages/BlogListPage/BlogListPage.tsx`는 `usePosts` 도메인 훅으로 게시글 목록을 가져오고 `Header`, `Pagination`, `Sidebar` 등 재사용 컴포넌트로 UI를 조합. 검색/페이지 사이즈/스크롤 제어는 페이지 내부에 있음.
- `src/pages/PostDetailPage/PostDetailPage.tsx`는 URL 파라미터를 `usePostDetail`에 넘겨(API + 댓글/좋아요 로직을 캡슐화) 로딩/좋아요 로직만 처리하며, `CommentList` 등의 UI 컴포넌트를 사용.
- `ProfilePage`는 `useProfileOverview`에서 API(fetch profile + posts)와 기본값(normalize)을 처리하고, `useProfilePosts`에서 정렬/페이징을 메모이제이션으로 계산.
- 인증 관련 화면(`LoginPage`, `SignupPage`)은 각각 `useLoginForm`, `useSignupForm` 훅을 통해 폼 상태/유효성/서버 호출을 제어하고, `FormField`, `ProfileImageUploader` 같은 UI 컴포넌트를 호출.

### Features & API 연동
- `src/features/auth/AuthContext.tsx`는 `authApi`/`memberApi`를 호출하여 `user` 상태를 유지하고, `login`, `logout`, `loadUser` 함수를 제공. `useAuth` 훅은 이 Context를 소비.
- `src/features/post`에 있는 여러 훅(`usePosts`, `usePostDetail`, `usePostLike`, `usePostComments`, `useRecommendedPosts`)은 `postApi`, `commentApi`, `USE_MOCK` 플래그, `mocks/postDummy` 등 실제 데이터/모킹을 처리해 페이지에 전달.
- `src/features/profile/useProfileOverview.ts`는 `memberApi`, `postApi`를 병렬 호출하고 `DEFAULT_PROFILE_CONFIG`로 null-safe한 객체를 만듦. `useProfilePosts.ts`는 정렬/페이징을 `useMemo`로 분리하여 UI에는 상태 변경만 제공.

### 공용 요소
- `src/api/httpClient.ts`는 Axios 인스턴스를 만들고 인증 토큰, 401 리프레시, `withCredentials` 등을 처리하여 모든 API 모듈이 동일한 클라이언트를 쓰도록 통일.
- `src/components`에 `Header`, `Footer`, `PostItem`, `Sidebar`, `CommentList`, `Pagination` 등 UI 요소가 존재하고 페이지/Feature에서 props를 통해 조립.
- `src/utils`의 `validators.ts`, `formatters.ts`는 폼 검증/날짜/텍스트 포맷 처리를 제공하고 페이지/훅 전반에서 공유됨.
- `src/config/env.ts`의 `USE_MOCK`, `API_BASE_URL`, `CLOUDINARY_CLOUD_NAME` 등의 플래그를 읽어 `USE_MOCK`이 활성화되면 `mocks/postDummy.ts`를 사용하는 흐름이 `features/post/usePosts.ts`에서 확인됨.
- `src/hooks/useMockData.ts`는 `USE_MOCK`에 따라 동기/비동기 더미 데이터를 구분하는 제너릭 훅을 제공.
- `src/mocks/postDummy.ts` 같은 파일이 `USE_MOCK` 조건 하에 게시글 데이터를 만들어냄.

## 3. 평가 요약 및 관찰점
- 문서에 나열된 레이어가 실제 구조에 잘 반영되어 있으며, `features` 훅에서 도메인(API 호출, 가공, 상태 관리)이 집중되고 `pages`는 그 결과를 조합하는 방식으로 역할 분리가 지켜짐 (`src/pages` & `src/features`).
- 일부 화면(예: `BlogListPage`)은 고정된 상위 `tags`/`topPosts` 데이터를 page-local 로직(`postApi`, mock array)에서 가져오지만, 이도 “뷰 중심” 행동으로 문서 지침과 크게 어긋나지 않음.
- 문서에 언급된 `mocks`, `hooks`, `utils`, `config` 경로가 모두 존재하며, 실제 코드에서 `USE_MOCK` 플래그(`src/config/env.ts`)와 `DEFAULT_PROFILE_CONFIG`(`src/config/defaults.ts`)로 백업 데이터/설정에 접근.
- `features/auth/useLoginForm.ts`, `useSignupForm.ts`는 뷰 상태/유효성/로딩/에러 핸들링을 훅 내부에서 처리하여 페이지는 간결하게 유지.
- 전체적으로 React + React Router + Context + custom hooks 조합을 통한 계층화가 문서에 제시된 구조를 잘 반영하고 있음.

## 4. 제안 사항
1. `useLoginForm.ts`/`useSignupForm.ts`의 에러 메시지/기본값에 신뢰할 수 없는 문자열(인코딩 깨짐)이 있어 사용자 피드백을 명확히 검토하면 좋겠습니다 (`src/features/auth/useLoginForm.ts`, `src/features/auth/useSignupForm.ts`).
2. `BlogListPage`의 `loadTopPosts`/`loadTags`는 예외/로딩 처리를 보다 재사용 가능한 훅으로 빼면 테스트/재사용성이 올라갈 여지가 있습니다.
3. 도메인 훅(`usePostDetail`, `useProfileOverview`) 내부에서 `console.error` 로깅을 사용하는데, 추후 Sentry 등으로 통합하거나 에러 상태를 page에 명시적으로 전달하면 복구 UX 개선이 가능합니다.
