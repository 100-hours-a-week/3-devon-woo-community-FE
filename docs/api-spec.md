# API 스펙 정리 (프론트엔드 기준 추론)

이 문서는 현재 프론트엔드 코드(`src/api`, `src/types`)만으로 **추론 가능한** 백엔드 HTTP API 스펙을 정리한 것이다.  
실제 서버와 일부 차이가 있을 수 있다.

---

## 공통 규칙

- **베이스 URL**
  - 모든 API는 `API_BASE_URL`(환경변수 `VITE_API_BASE_URL`) 기준의 REST 엔드포인트이다.
- **응답 공통 포맷 – `ApiResponse<T>`**
  - 모든 API 응답은 다음 형태를 따른다.
  - `ApiResponse<T>` (`src/types/common/ApiResponse.ts`)
    - `success: boolean`
    - `message: string | null`
    - `data: T | null`
    - `errors: { field: string; message: string }[] | null`
- **페이지네이션 – `PageResponse<T>`**
  - 리스트 응답 중 일부는 다음 형태를 사용한다.
  - `PageResponse<T>` (`src/types/common/PageResponse.ts`)
    - `items: T[]`
    - `page: number`
    - `size: number`
    - `totalElements: number`
    - `totalPages: number`
- **인증 방식**
  - 로그인/회원가입 성공 시 `accessToken`을 로컬 스토리지에 저장한다.
    - 키: `accessToken`
  - 이후 모든 요청에 `Authorization: Bearer <accessToken>` 헤더를 자동으로 추가한다.
  - 토큰이 만료되어 401 응답이 오면:
    1. `POST {API_BASE_URL}/auth/refresh`(쿠키 기반, `withCredentials: true`)를 호출해 새 토큰을 받는다.
    2. 새 토큰으로 `Authorization` 헤더를 갱신하고 원 요청을 재시도한다.

---

## Auth API

소스: `src/api/authApi.ts`, `src/api/httpClient.ts`, `src/features/auth/AuthContext.tsx`, `src/pages/OAuthCallbackPage.tsx`

### DTO

- `LoginRequest` (`src/types/auth/LoginRequest.ts`)
  - `email: string`
  - `password: string`
- `LoginResponse` (`src/types/auth/LoginResponse.ts`)
  - `userId: number`
  - `accessToken: string`
- `SignupRequest` (`src/types/auth/SignupRequest.ts`)
  - `email: string`
  - `password: string`
  - `passwordConfirm: string`
  - `nickname: string`

### 1) 로그인

**`POST {API_BASE_URL}/auth/login`**

- 설명: 이메일/비밀번호 로그인.
- 인증: 필요 없음.
- 요청 바디 (`LoginRequest`):
  - `email: string`
  - `password: string`
- 응답 (`ApiResponse<LoginResponse>`):
  - `data.userId: number`
  - `data.accessToken: string`
- 클라이언트 후처리:
  - `accessToken`을 로컬 스토리지에 저장 후, `GET /api/v1/members/me` 호출로 사용자 정보 로딩.

### 2) 회원가입

**`POST {API_BASE_URL}/auth/signup`**

- 설명: 회원가입 후 자동 로그인.
- 인증: 필요 없음.
- 요청 바디 (`SignupRequest`):
  - `email: string`
  - `password: string`
  - `passwordConfirm: string`
  - `nickname: string`
- 응답 (`ApiResponse<LoginResponse>`):
  - `data.userId: number`
  - `data.accessToken: string`
- 클라이언트 후처리:
  - 로그인과 동일하게 `accessToken` 저장 후 프로필 로딩.

### 3) 로그아웃

**`POST {API_BASE_URL}/auth/logout`**

- 설명: 로그아웃 처리 (서버 세션/리프레시 토큰 무효화로 추정).
- 인증: 필요(접근 토큰 필요할 가능성 높음).
- 요청 바디: 없음.
- 응답: `ApiResponse<null>`.
- 클라이언트 후처리:
  - 성공 여부와 관계 없이 로컬 `accessToken` 삭제.

### 4) 토큰 재발급 (리프레시)

**`POST {API_BASE_URL}/auth/refresh`**

- 설명: 리프레시 토큰을 이용한 accessToken 재발급.
- 인증:
  - `withCredentials: true`로 호출 → HttpOnly 쿠키 기반 리프레시 토큰 사용으로 추정.
- 요청 바디: `{}` (빈 객체).
- 응답 (`ApiResponse<{ accessToken: string }>`):
  - `data.accessToken: string`
- 사용처:
  - 모든 API에서 401 발생 시 `httpClient` 내부에서 자동 호출.
  - `/oauth/callback` 페이지에서도 소셜 로그인 이후 최초 accessToken 발급 용도로 사용.

### 5) 이메일 중복 체크

**`GET {API_BASE_URL}/auth/check-email?email={email}`**

- 설명: 이메일 중복 여부 확인.
- 인증: 필요 없음 (회원가입 전 검증).
- 쿼리 파라미터:
  - `email: string` (URL-encoded)
- 응답 (`ApiResponse<{ available: boolean }>`):
  - `data.available: boolean` (true면 사용 가능).

### 6) 닉네임 중복 체크

**`GET {API_BASE_URL}/auth/check-nickname?nickname={nickname}`**

- 설명: 닉네임 중복 여부 확인.
- 인증: 필요 없음.
- 쿼리 파라미터:
  - `nickname: string` (URL-encoded)
- 응답 (`ApiResponse<{ available: boolean }>`):
  - `data.available: boolean`.

---

## Member API (회원)

소스: `src/api/memberApi.ts`, `src/types/member/MemberResponse.ts`

### DTO

- `SocialLinks`
  - `github: string`
  - `website: string`
  - `linkedin: string`
  - `notion: string`
- `MemberResponse`
  - `memberId: number`
  - `id: number` (백엔드상의 PK로 추정, `memberId`와 동일 혹은 별개)
  - `email: string`
  - `nickname: string`
  - `profileImage: string`
  - `handle: string`
  - `bio: string`
  - `role: string`
  - `company: string`
  - `location: string`
  - `primaryStack: string[]`
  - `interests: string[]`
  - `socialLinks: SocialLinks`

### 1) 내 프로필 조회

**`GET {API_BASE_URL}/api/v1/members/me`**

- 설명: 로그인한 회원의 상세 프로필 조회.
- 인증: 필요 (Bearer Token).
- 요청: 쿼리/바디 없음.
- 응답: `ApiResponse<MemberResponse>`.

### 2) 특정 회원 프로필 조회

**`GET {API_BASE_URL}/api/v1/members/{memberId}`**

- 설명: 특정 회원의 프로필 조회 (`/profile/:memberId` 페이지 등).
- 인증: 필요할 가능성 높음 (토큰 유무에 상관 없이 헤더는 항상 추가되므로).
- 경로 파라미터:
  - `memberId: number`
- 응답: `ApiResponse<MemberResponse>`.

### 3) 내 프로필 수정

**`PUT {API_BASE_URL}/api/v1/members/me`**

- 설명: 자신의 프로필 정보 수정.
- 인증: 필요.
- 요청 바디: `Partial<MemberResponse>`
  - `MemberResponse`의 일부 필드만 보내도 되는 형태로 클라이언트가 사용.
  - 예: `nickname`, `bio`, `profileImage`, `primaryStack`, `interests`, `socialLinks` 등.
- 응답: `ApiResponse<MemberResponse>` (수정된 최신 프로필).

### 4) 비밀번호 변경

**`PUT {API_BASE_URL}/api/v1/members/me/password`**

- 설명: 현재 비밀번호 검증 후 새 비밀번호로 변경.
- 인증: 필요.
- 요청 바디:
  - `currentPassword: string`
  - `newPassword: string`
- 응답: `ApiResponse<null>`.

### 5) 계정 삭제(탈퇴)

**`DELETE {API_BASE_URL}/api/v1/members/me`**

- 설명: 회원 탈퇴.
- 인증: 필요.
- 요청 바디: 없음.
- 응답: `ApiResponse<null>`.

---

## Post API (게시글)

소스: `src/api/postApi.ts`, `src/types/post/*`

### DTO

- `PostCreateRequest` (`src/types/post/PostCreateRequest.ts`)
  - `title: string`
  - `content: string`
  - `image?: string`
  - `summary?: string`
  - `tags?: string[]`
  - `seriesId?: number | null`
  - `visibility?: 'public' | 'private'`
  - `isDraft?: boolean`
  - `commentsAllowed?: boolean`
- `PostUpdateRequest` (타입 정의만 존재, 실 사용은 `PostCreateRequest`와 같게 쓰고 있음)
  - `title: string`
  - `content: string`
  - `image?: string`
  - `summary?: string`
  - `tags?: string[]`
  - `seriesId?: number | null`
  - `visibility?: 'public' | 'private'`
  - `commentsAllowed?: boolean`
- `PostResponse` (`src/types/post/PostResponse.ts`)
  - `postId: number`
  - `member: MemberResponse`
  - `title: string`
  - `content: string`
  - `summary: string`
  - `imageUrl: string`
  - `createdAt: string`
  - `updatedAt: string`
  - `viewCount: number`
  - `likeCount: number`
  - `commentCount: number`
  - `isLiked: boolean`
  - `tags: string[]`
  - `seriesId: number | null`
  - `seriesName: string`
  - `visibility: 'public' | 'private'`
- `PostSummaryResponse` (`src/types/post/PostSummaryResponse.ts`)
  - `postId: number`
  - `title: string`
  - `summary: string`
  - `thumbnail: string`
  - `member: MemberResponse`
  - `createdAt: string`
  - `viewCount: number`
  - `likeCount: number`
  - `commentCount: number`

### 1) 게시글 목록 조회

**`GET {API_BASE_URL}/api/v1/posts`**

- 설명: 게시글 리스트 조회 (메인, 검색, 특정 유저 글 목록 등).
- 인증: 필수는 아님(토큰이 있으면 Authorization 헤더만 추가).
- 쿼리 파라미터 (`GetPostsParams`):
  - `page?: number` (기본값 0)
  - `size?: number` (기본값 20)
  - `sort?: string` (기본값 `'createdAt,desc'`)
  - `memberId?: number` (특정 사용자의 게시글만 필터)
  - `search?: string` (제목/작성자 닉네임 검색)
- 응답: `ApiResponse<PageResponse<PostSummaryResponse>>`.

### 2) 게시글 상세 조회

**`GET {API_BASE_URL}/api/v1/posts/{postId}`**

- 설명: 단일 게시글 상세 조회.
- 인증: 선택적.
- 경로 파라미터:
  - `postId: number`
- 쿼리 파라미터:
  - `memberId?: number`
    - 클라이언트에서 선택적으로 전달.
    - 서버에서 로그인 사용자 기준 상태(`isLiked` 등)를 계산하는 데 활용할 가능성.
- 응답: `ApiResponse<PostResponse>`.

### 3) 게시글 생성

**`POST {API_BASE_URL}/api/v1/posts`**

- 설명: 새로운 게시글 작성.
- 인증: 필요.
- 요청 바디: `PostCreateRequest`
  - 실제 사용 예: (`src/pages/PostCreatePage.tsx`)
    - `title`, `content`, `summary`, `image`, `tags`, `visibility`, `isDraft`, `commentsAllowed`
- 응답: `ApiResponse<PostResponse>`
  - 생성된 게시글의 전체 정보.

### 4) 게시글 수정

**`PUT {API_BASE_URL}/api/v1/posts/{postId}`**

- 설명: 기존 게시글 수정.
- 인증: 필요 (작성자만 허용될 것으로 추정).
- 경로 파라미터:
  - `postId: number`
- 요청 바디:
  - 프론트에서는 `PostCreateRequest` 타입을 그대로 사용하여 전송.
  - 백엔드에서는 `PostUpdateRequest`와 유사하게 처리될 것으로 추정.
- 응답: `ApiResponse<PostResponse>` (수정된 게시글 정보).

### 5) 게시글 삭제

**`DELETE {API_BASE_URL}/api/v1/posts/{postId}`**

- 설명: 게시글 삭제.
- 인증: 필요 (작성자 또는 관리자).
- 경로 파라미터:
  - `postId: number`
- 요청 바디: 없음.
- 응답: `ApiResponse<null>`.

### 6) 게시글 좋아요 토글

**`POST {API_BASE_URL}/api/v1/posts/{postId}/like`**

- 설명: 게시글 좋아요/좋아요 취소 토글.
- 인증: 필요.
- 경로 파라미터:
  - `postId: number`
- 요청 바디: 없음.
- 응답: `ApiResponse<{ liked: boolean }>`
  - `data.liked: boolean` (현재 상태 기준 true/false).

---

## Comment API (댓글)

소스: `src/api/commentApi.ts`, `src/types/comment/CommentResponse.ts`

### DTO

- `CommentResponse`
  - `commentId: number`
  - `postId: number`
  - `content: string`
  - `member: MemberResponse`
  - `createdAt: string`
  - `updatedAt: string`
- `CommentCreateRequest`
  - `content: string`
- `CommentUpdateRequest`
  - `content: string`

### 1) 댓글 목록 조회

**`GET {API_BASE_URL}/api/v1/posts/{postId}/comments`**

- 설명: 특정 게시글의 댓글 리스트(페이지네이션).
- 인증: 선택적 (공개 게시글의 경우 비로그인도 열람 가능할 것으로 추정).
- 경로 파라미터:
  - `postId: number`
- 쿼리 파라미터:
  - `page: number` (기본값 0)
  - `size: number` (기본값 20)
- 응답: `ApiResponse<PageResponse<CommentResponse>>`.

### 2) 댓글 작성

**`POST {API_BASE_URL}/api/v1/posts/{postId}/comments`**

- 설명: 게시글에 새로운 댓글 작성.
- 인증: 필요.
- 경로 파라미터:
  - `postId: number`
- 요청 바디 (`CommentCreateRequest`):
  - `content: string`
- 응답: `ApiResponse<CommentResponse>` (생성된 댓글).

### 3) 댓글 수정

**`PUT {API_BASE_URL}/api/v1/comments/{commentId}`**

- 설명: 댓글 내용 수정.
- 인증: 필요 (작성자만 허용될 것으로 추정).
- 경로 파라미터:
  - `commentId: number`
- 요청 바디 (`CommentUpdateRequest`):
  - `content: string`
- 응답: `ApiResponse<CommentResponse>` (수정된 댓글).

### 4) 댓글 삭제

**`DELETE {API_BASE_URL}/api/v1/comments/{commentId}`**

- 설명: 댓글 삭제.
- 인증: 필요.
- 경로 파라미터:
  - `commentId: number`
- 요청 바디: 없음.
- 응답: `ApiResponse<null>`.

---

## 기타

- `USE_MOCK` (`src/config/env.ts`) 값이 `true`일 때는 실제 네트워크 요청 대신 더미 데이터를 사용하는데, 더미 생성 로직(`src/mocks/*`)도 실제 API 스펙과 최대한 맞추어 설계되어 있다.
- 에러 케이스(HTTP 상태 코드, 에러 코드 등)는 프론트 코드 상 명시가 없어, 응답 바디가 항상 `ApiResponse` 형태라는 것만 추론 가능하다.
- 권한(작성자/관리자 여부), 비공개 글/프로필 접근 제한 등의 세부 정책은 서버 구현을 직접 봐야 정확히 알 수 있다.

