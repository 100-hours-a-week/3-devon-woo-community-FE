# 프론트엔드 설계 분석서 (Community TechBlog FE)

이 문서는 `3-devon-woo-community-FE` 프로젝트의 **프론트엔드 설계 전반**을 정리한 분석서입니다.  
소스 구조, 라우팅, 도메인별 설계, 상태 관리, API 연동 방식, 확장 포인트를 한 번에 파악할 수 있도록 작성되었습니다.

> 참고: 상세 폴더 규칙과 레이어별 책임은 `src/ARCHITECTURE.md`,  
> 페이지/컴포넌트 레벨 개요는 `src/pages/OVERVIEW.md`, `src/components/COMPONENTS.md`에 정리되어 있습니다.

---

## 1. 프로젝트 개요

- **프로젝트 목적**
  - 개발자 커뮤니티형 **Tech Blog / Community** 서비스의 프론트엔드.
  - 게시글 목록/상세/작성, 댓글, 프로필/프로필 수정, OAuth 기반 로그인 등 커리어/기술 공유 공간을 제공.
- **주요 특징**
  - React + TypeScript + Vite 기반의 SPA.
  - **페이지(Page) / 기능(Feature) / 공용 컴포넌트(Components)** 레이어가 분리된 구조.
  - DTO 중심의 API 모듈, Axios 래퍼(`httpClient`) 및 토큰 리프레시 로직 내장.
  - Toast UI Editor 를 활용한 **Markdown 블로그 에디터 경험** 제공.
  - `USE_MOCK` 플래그와 mock 데이터(`src/mocks`)를 이용한 로컬 개발/테스트 지원.

---

## 2. 기술 스택 및 도구

- **런타임/프레임워크**
  - `React 18`, `ReactDOM` – SPA 뷰 레이어.
  - `react-router-dom 7` – 브라우저 라우팅, `createBrowserRouter` 기반.
- **언어/번들러**
  - `TypeScript`, `Vite` – 모듈 번들링 및 개발 서버 (HMR).
- **HTTP & 상태**
  - `axios` – HTTP 클라이언트, 인터셉터 기반 토큰 주입 및 재발급 처리.
  - React Context + hook 기반 상태 관리 (`AuthContext`, 도메인별 custom hooks).
- **에디터/마크다운**
  - `@toast-ui/editor`, `@toast-ui/react-editor` – 게시글 작성/미리보기용 Markdown 에디터/뷰어.
- **품질 도구**
  - `eslint`, `@typescript-eslint/*`, `eslint-plugin-react(-hooks)`, `eslint-plugin-jsx-a11y`.
  - `prettier`, `eslint-config-prettier`, `eslint-plugin-prettier`.

---

## 3. 상위 아키텍처 개요 (`src` 기준)

주요 레이어는 `src/ARCHITECTURE.md`에서 정의한 규칙을 따릅니다.

- `src/main.tsx`
  - React 엔트리 포인트, 전역 스타일(`styles/theme.css`, `styles/global.css`) 로딩.
- `src/App.tsx`
  - 전역 `AuthProvider`로 앱을 감싸고, `Router`를 렌더링하는 최상위 컴포넌트.
- `src/app/Router.tsx`
  - URL → Page 컴포넌트 매핑만 담당하는 라우터 설정.

레이어별 핵심 역할:

- **Pages (`src/pages`)**
  - 라우터에 연결되는 화면 단위 컴포넌트(페이지).
  - 페이지 전용 상태(검색, 페이징, 탭 등)와 레이아웃 구성.
- **Features (`src/features`)**
  - 도메인별 비즈니스 로직/상태를 custom hook 으로 캡슐화.
  - 예: `features/post`(게시글 목록/상세/추천/좋아요/댓글), `features/auth`, `features/profile`.
- **Components (`src/components`)**
  - 재사용 가능한 UI 조각 (프레젠테이션 중심).
  - Header/Footer, 카드, 리스트, 폼 필드, 토스트, 에디터 UI 등.
- **API (`src/api`)**
  - HTTP 요청을 담당하는 순수 함수 집합 + Axios 래퍼(`httpClient`).
- **Types (`src/types`)**
  - API 요청/응답 DTO 및 공통 모델 타입 정의.
- **Hooks (`src/hooks`)**
  - 도메인에 종속되지 않는 공용 hook (예: mock 데이터 선택 등).
- **Utils/Config/Styles**
  - `src/utils`: 포맷터/검증/업로드 유틸.
  - `src/config`: 환경 변수 래퍼(`env.ts`), 상수/플래그.
  - `src/styles`: 전역 스타일, 디자인 토큰.

---

## 4. 라우팅 및 화면 흐름

라우터 설정: `src/app/Router.tsx`

| Path | Page 컴포넌트 | 설명 |
| --- | --- | --- |
| `/` | `BlogListPage` | 기본 진입점. 최신 글/목록 + 사이드바(인기글, 태그) 노출. |
| `/posts` | `BlogListPage` | 검색/페이징 포함 게시글 리스트. `?search=` 쿼리로 필터링. |
| `/posts/:postId` | `PostDetailPage` | 단일 게시글 상세, 추천 글, 댓글 리스트. |
| `/posts/create` | `PostCreatePage` | 새 게시글 작성 페이지 (Markdown + Toast UI Editor). |
| `/posts/:postId/edit` | `PostCreatePage` | 게시글 수정 모드. 기존 내용을 로딩하여 동일 에디터 UI 사용. |
| `/profile` | `ProfilePage` | 내 프로필(로그인 사용자) 개요 + 최근 게시글. |
| `/profile/:memberId` | `ProfilePage` | 특정 회원의 프로필 및 게시글 목록. |
| `/login` | `LoginPage` | 이메일/비밀번호 로그인 + 소셜 로그인 버튼. |
| `/signup` | `SignupPage` | 회원가입 폼 (계정 정보 + 프로필 정보 수집). |
| `/oauth/callback` | `OAuthCallbackPage` | OAuth 리다이렉트 처리, 토큰 발급 후 홈으로 이동. |

페이지 단위 책임에 대한 요약은 `src/pages/OVERVIEW.md` 에 정리되어 있으며,  
각 페이지는 공통 헤더/푸터/레이아웃 컴포넌트와 도메인별 feature hook 을 조합해 화면을 구성합니다.

---

## 5. 도메인별 설계

### 5.1 인증(Auth) 도메인

- 주요 파일
  - `src/features/auth/AuthContext.tsx`
  - `src/features/auth/useLoginForm.ts` 등
  - `src/api/authApi.ts`, `src/api/httpClient.ts`
- 핵심 흐름
  - 로그인/회원가입 시 `authApi`를 통해 `accessToken`을 발급 받음.
  - 토큰은 `httpClient.setAccessToken`으로 Axios 인스턴스에 주입되며,
    인터셉터에서 모든 요청에 `Authorization: Bearer <token>` 헤더를 자동 추가.
  - 401 응답 발생 시:
    - `POST {API_BASE_URL}/auth/refresh` 호출로 새 토큰을 발급 받음.
    - 실패 시 토큰을 제거(`httpClient.clearTokens`)하고 `/login`으로 리다이렉트.
  - `AuthProvider`는 현재 사용자 정보(`memberApi.getProfile`)를 로딩하여
    `user`, `isAuthenticated`, `login`, `logout`, `signup` 등을 Context 로 제공.
- UI 연계
  - `Header` 컴포넌트에서 로그인/로그아웃 버튼 및 프로필 메뉴를 `useAuth`로 제어.
  - `LoginPage`, `SignupPage`, `OAuthCallbackPage`는 feature hook을 통해 인증 로직을 소비.

### 5.2 게시글(Post) 도메인

- 주요 파일
  - `src/features/post/*` – `usePosts`, `usePostDetail`, `usePostComments`, `usePostLike`, `useRecommendedPosts`, `useTopPosts`, `usePopularTags`, `useCommentInteractions`, `usePostEditor` 등.
  - `src/api/postApi.ts`, `src/types/post/*`, `src/mocks/postDummy.ts`.
- 목록/검색
  - `BlogListPage`에서 `usePosts` hook 사용:
    - 페이지네이션/검색 쿼리(`page`, `size`, `search`)를 받아 게시글 목록과 `totalPages` 제공.
    - `USE_MOCK`일 때는 더미 데이터로 페이지네이션/검색을 클라이언트에서 처리.
  - 사이드바
    - `useTopPosts`, `usePopularTags` → `TopPostsList`, `TagCloud` 컴포넌트로 전달.
- 상세/상호작용
  - `PostDetailPage`:
    - `usePostDetail`이 `post`, `comments`, `likeCount`, `isLiked`, `recommendedPosts` 등 한 번에 로딩.
    - 추천 게시글 클릭 시 `navigate`로 상세 페이지 전환.
  - 좋아요/댓글
    - 게시글 좋아요: `usePostLike` 계열 hook (내부적으로 `postApi` 사용).
    - 댓글: `usePostComments` + `useCommentInteractions` 로 분리
      - 정렬 기준, 좋아요 토글, 정렬된 댓글 리스트를 캡슐화.
      - `CommentList`, `CommentItem`, `CommentWrite` 컴포넌트는 UI에 집중.
- 작성/수정
  - `PostCreatePage`:
    - Toast UI 기반 마크다운 에디터(`ToastMarkdownEditor`)와 미리보기(`ToastMarkdownViewer`) 조합.
    - 임시 저장: `localStorage('postDraft')`에 정기적으로 저장하는 autosave 로직.
    - 발행 설정: 발행 모달(`PublishModal`)에서 공개 범위, 댓글 허용 여부, 썸네일, 요약 설정.
    - `postApi.createPost`, `postApi.updatePost` 호출 후 성공 시 상세 페이지로 이동.

### 5.3 프로필(Profile) 도메인

- 주요 파일
  - `src/features/profile/useProfileOverview.ts`
  - `src/pages/ProfilePage/*`, `src/pages/ProfileEditPage/*`
  - `src/api/memberApi.ts`, `src/types/member/*`
- 핵심 흐름
  - `useProfileOverview`:
    - `memberApi.getProfile`, `postApi.getPosts` 를 동시에 호출하여 프로필 + 최근 게시글 6개 로딩.
    - `MemberResponse`를 화면 친화적인 형태로 `normalizeProfile` 처리.
    - 게시글은 `ProfilePost` 타입으로 `normalizePosts`에서 정규화.
  - `ProfilePage`:
    - URL의 `memberId` 또는 현재 로그인 사용자 ID 기준으로 프로필/게시글 출력.
    - 본인 프로필인지 여부(`isOwner`)를 계산하여 “프로필 편집” 등 액션 컨트롤.
  - `ProfileEditPage`:
    - 큰 단일 폼 구조로 프로필 기본 정보, 경력/관심 스택, 소셜 링크 등을 편집.
    - 프로필 이미지 업로드는 `ProfileImageUploader` 및 업로드 유틸(`uploadImage`)과 연동.

### 5.4 댓글(Comment) 도메인

- 주요 파일
  - `src/components/CommentList`, `CommentItem`, `CommentWrite`.
  - `src/api/commentApi.ts`, `src/types/comment/*`.
  - `src/features/post/usePostComments`, `useCommentInteractions`.
- 설계 포인트
  - API 모듈(`commentApi`)이 CRUD 엔드포인트를 숨기고,
    feature hook이 목록 로딩/생성/정렬/좋아요 상태를 통합 관리.
  - UI 컴포넌트는 props 기반으로 상태를 받아 렌더링만 담당하도록 분리.

---

## 6. UI 컴포넌트 계층

컴포넌트 설계 개요는 `src/components/COMPONENTS.md`에 상세 표로 정리되어 있습니다.  
여기서는 핵심 그룹만 요약합니다.

- **레이아웃/스켈레톤**
  - `Header`, `Footer`, `Sidebar`, `ScrollToTopButton`, `LoadingSpinner`, `EmptyState`.
- **게시글 관련**
  - `BlogCard`, `PostItem`, `TopPostsList`, `TagCloud`.
  - `PostEditor/*` – `ComposeHeader`, `ToastMarkdownEditor`, `ToastMarkdownViewer`, `PublishModal`.
- **댓글/커뮤니케이션**
  - `CommentList`, `CommentItem`, `CommentWrite`, `Toast` (알림).
- **폼/입력**
  - `FormField`, `ProfileImageUploader`, `NewsletterSubscribe`, `SocialLoginButtons`.

대부분의 컴포넌트는 **비즈니스 로직을 갖지 않고 props 기반 UI 렌더링에 집중**하며,  
필요한 데이터/이벤트는 상위 Page/Feature에서 주입받는 구조입니다.

---

## 7. 상태 관리 전략

- **전역 상태**
  - 인증 상태는 `AuthContext`로 전역 관리 (`user`, `isAuthenticated`, `login`, `logout`, `signup`, `loadUser`).
- **도메인 상태**
  - 게시글/댓글/프로필 등 도메인별 상태는 `src/features/<domain>`의 custom hook에 캡슐화.
  - 각 hook은 API 모듈과 DTO 타입을 사용하며, ViewModel 수준의 데이터 가공을 담당.
- **페이지 로컬 상태**
  - 검색어, 현재 페이지, 탭/필터, 모달 열림 여부 등 **화면 전용 상태**는 Page 컴포넌트 내부에서 관리.
- **컴포넌트 로컬 상태**
  - 입력 제어, 펼침/접힘, hover 상태 등 완전히 UI에만 관련된 상태는 컴포넌트 내부 `useState`로 관리.

이 계층 구조 덕분에 **“어디서 어떤 상태를 관리해야 하는지”** 기준이 명확하며,  
새 기능 추가 시에도 우선 feature hook 으로 로직을 캡슐화한 후, Page/Component 에서 소비하는 패턴을 유지할 수 있습니다.

---

## 8. API 연동 및 DTO 설계

- **HTTP 클라이언트 (`src/api/httpClient.ts`)**
  - `axios.create`로 공통 인스턴스를 만들고, baseURL/타임아웃/헤더를 설정.
  - 요청 인터셉터:
    - 메모리 상의 `accessToken`을 `Authorization` 헤더에 주입.
  - 응답 인터셉터:
    - 401 응답 시 한 번에 한해 `_retry` 플래그로 **리프레시 토큰 플로우** 수행.
    - 실패 시 토큰 초기화 및 `/login`으로 이동.
  - `get/post/put/patch/delete` 메서드는 제네릭 타입 `T`를 받아 `response.data`만 반환.
- **환경 변수 (`src/config/env.ts`)**
  - `VITE_API_BASE_URL`, `VITE_USE_MOCK`, `VITE_CLOUDINARY_CLOUD_NAME` 등을 래핑.
  - `USE_MOCK` 플래그로 실제 API 호출 여부를 제어.
- **DTO 타입 (`src/types`)**
  - `types/post`, `types/auth`, `types/member`, `types/comment`, `types/common` 등으로 도메인별 분리.
  - 공통 래퍼 `ApiResponse<T>`, `PageResponse<T>` 형태로 응답 구조를 통일.
- **API 스펙 문서 (`docs/api-spec*.md`)**
  - 프론트 코드 기준으로 추론한 백엔드 HTTP 스펙을 정리.
  - 엔드포인트, 요청/응답 DTO, 인증 요구사항 등을 확인 가능.

---

## 9. Mock 및 로컬 개발 전략

- `USE_MOCK = true` 인 경우:
  - `src/mocks/postDummy.ts` 등에서 생성한 더미 데이터로 게시글 목록/상세를 구성.
  - API 서버 없이도 UI/UX 흐름, 페이지네이션/검색 등을 검증 가능.
- 실제 서버 연동:
  - `.env` 파일에서 `VITE_API_BASE_URL` 을 설정하고 `USE_MOCK`을 `false`로 두면,
    `src/api` 모듈들이 실제 백엔드와 통신하도록 동작.

---

## 10. 확장 및 리팩터링 포인트

기존 분석 문서들(`src/pages/OVERVIEW.md`, `src/components/COMPONENTS.md`)에서 제안된 리팩터링 아이디어를 정리하면 다음과 같습니다.

- **페이지 분리**
  - `BlogListPage`의 검색 헤더, 그리드, 사이드바 등을 서브 컴포넌트로 분리하여 재사용성/가독성 향상.
  - `PostDetailPage`의 헤더/액션 영역, 추천 게시글 리스트를 별도 컴포넌트로 추출.
  - `ProfileEditPage`, `SignupPage`의 대형 폼을 섹션별 폼 컴포넌트와 전용 hook 으로 쪼개기.
- **에디터/댓글 인프라 정리**
  - `PostCreatePage`의 autosave, 단축키, 썸네일 업로드 등 로직을 `usePostEditor` 계열 hook 으로 이전.
  - 댓글 관련 dropdown/report/like 로직을 `useCommentActions` 등으로 통합.
- **UI 시스템화**
  - 버튼/폼/레이아웃 컴포넌트를 더 작은 디자인 시스템 형태로 다듬고,
    하드코딩된 텍스트를 config/locale 파일로 이동.
- **토스트/알림 시스템**
  - 단일 `Toast` 컴포넌트에서 나아가 queue/portal 기반의 글로벌 toast 시스템으로 확장 가능.

이 분석서를 바탕으로, README에서는 프로젝트 목적/주요 기능/기술 스택/아키텍처 문서 링크를 간결하게 정리해  
외부 기여자나 리뷰어가 프로젝트를 빠르게 이해할 수 있도록 합니다.

