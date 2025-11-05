# DTO 사용 가이드

본 문서는 프로젝트에서 정의된 DTO(Data Transfer Object)의 사용 방법을 안내합니다.

---

## 목차

1. [프로젝트 구조](#프로젝트-구조)
2. [Request DTO 사용법](#request-dto-사용법)
3. [Response DTO 사용법](#response-dto-사용법)
4. [Validation 사용법](#validation-사용법)
5. [더미 데이터 생성](#더미-데이터-생성)
6. [실전 예시](#실전-예시)

---

## 프로젝트 구조

```
src/
├── dto/
│   ├── request/
│   │   ├── auth/          # 인증 관련 Request DTO
│   │   ├── member/        # 회원 관련 Request DTO
│   │   ├── post/          # 게시글 관련 Request DTO
│   │   ├── comment/       # 댓글 관련 Request DTO
│   │   └── common/        # 공통 Request DTO (페이지네이션 등)
│   └── response/
│       ├── auth/          # 인증 관련 Response DTO
│       ├── member/        # 회원 관련 Response DTO
│       ├── post/          # 게시글 관련 Response DTO
│       ├── comment/       # 댓글 관련 Response DTO
│       └── common/        # 공통 Response DTO (ApiResponse, PageResponse)
└── validation/
    ├── authValidation.js      # 인증 관련 검증
    ├── memberValidation.js    # 회원 관련 검증
    ├── postValidation.js      # 게시글 관련 검증
    ├── commentValidation.js   # 댓글 관련 검증
    ├── patterns.js            # 검증 패턴 상수
    ├── messages.js            # 검증 메시지 상수
    └── index.js               # 통합 export
```

---

## Request DTO 사용법

### 기본 사용

```javascript
const LoginRequest = require('./src/dto/request/auth/LoginRequest');

// 일반적인 사용
const loginDto = new LoginRequest({
  email: 'user@example.com',
  password: 'password123'
});

// 폼 데이터에서 생성
const formData = { email: 'user@example.com', password: 'password123' };
const loginDto = new LoginRequest(formData);
```

### 게시글 생성 예시

```javascript
const PostCreateRequest = require('./src/dto/request/post/PostCreateRequest');

const postDto = new PostCreateRequest({
  memberId: 1,
  title: '새로운 게시글',
  content: '게시글 내용입니다.',
  image: 'https://example.com/image.jpg'
});
```

### 페이지네이션 요청

```javascript
const PageSortRequest = require('./src/dto/request/common/PageSortRequest');

// 기본 페이지네이션 (첫 페이지, 20개, 생성일 내림차순)
const pageRequest = new PageSortRequest();

// 커스텀 페이지네이션
const customPageRequest = new PageSortRequest({
  page: 2,
  size: 10,
  sort: ['likes,desc', 'views,desc']
});

// URL 쿼리 문자열로 변환
const queryString = pageRequest.toQueryString();
// 결과: "page=0&size=20&sort=createdAt,desc"
```

---

## Response DTO 사용법

### API 응답 처리

```javascript
const ApiResponse = require('./src/dto/response/common/ApiResponse');
const LoginResponse = require('./src/dto/response/auth/LoginResponse');

// API 호출 후 응답 처리
async function login(email, password) {
  const response = await fetch('/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const jsonData = await response.json();

  // ApiResponse로 감싸진 데이터
  if (jsonData.success) {
    const loginResponse = new LoginResponse(jsonData.data);
    console.log('로그인 성공, 사용자 ID:', loginResponse.userId);
  } else {
    console.error('로그인 실패:', jsonData.message);
    console.error('에러 목록:', jsonData.errors);
  }
}
```

### 페이지네이션 응답 처리

```javascript
const PageResponse = require('./src/dto/response/common/PageResponse');
const PostSummaryResponse = require('./src/dto/response/post/PostSummaryResponse');

async function fetchPosts(page = 0) {
  const response = await fetch(`/api/v1/posts?page=${page}&size=20`);
  const jsonData = await response.json();

  if (jsonData.success) {
    const pageResponse = new PageResponse(jsonData.data);

    console.log(`현재 페이지: ${pageResponse.page + 1}/${pageResponse.totalPages}`);
    console.log(`전체 게시글 수: ${pageResponse.totalElements}`);

    pageResponse.items.forEach(post => {
      console.log(`- ${post.title} (조회: ${post.views}, 좋아요: ${post.likes})`);
    });

    if (pageResponse.hasNext()) {
      console.log('다음 페이지가 있습니다.');
    }
  }
}
```

---

## Validation 사용법

### 개별 Validation 함수 사용

```javascript
const { validateLoginRequest } = require('./src/validation');
const LoginRequest = require('./src/dto/request/auth/LoginRequest');

// DTO 생성
const loginDto = new LoginRequest({
  email: 'invalid-email',
  password: ''
});

// 유효성 검증
const errors = validateLoginRequest(loginDto);

if (errors.length > 0) {
  console.log('검증 실패:');
  errors.forEach(error => {
    console.log(`- ${error.field}: ${error.message}`);
  });
} else {
  console.log('검증 성공');
}
```

### 폼 제출 시 통합 검증

```javascript
const { validatePostCreateRequest } = require('./src/validation');
const PostCreateRequest = require('./src/dto/request/post/PostCreateRequest');

function handlePostSubmit(formData) {
  // DTO 생성
  const postDto = new PostCreateRequest({
    memberId: getCurrentUserId(),
    title: formData.get('title'),
    content: formData.get('content'),
    image: formData.get('image')
  });

  // 유효성 검증
  const errors = validatePostCreateRequest(postDto);

  if (errors.length > 0) {
    // 에러 표시
    displayErrors(errors);
    return;
  }

  // API 호출
  submitPost(postDto);
}

function displayErrors(errors) {
  errors.forEach(error => {
    const field = document.querySelector(`[name="${error.field}"]`);
    const errorElement = field.nextElementSibling;
    errorElement.textContent = error.message;
  });
}
```

### ApiResponse와 함께 사용

```javascript
const ApiResponse = require('./src/dto/response/common/ApiResponse');

async function submitPost(postDto) {
  try {
    const response = await fetch('/api/v1/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postDto)
    });

    const jsonData = await response.json();

    if (!jsonData.success) {
      // 서버측 검증 에러 표시
      if (jsonData.errors) {
        displayErrors(jsonData.errors);
      } else {
        alert(jsonData.message);
      }
    } else {
      alert('게시글이 성공적으로 등록되었습니다.');
      location.href = `/posts/${jsonData.data.postId}`;
    }
  } catch (error) {
    console.error('네트워크 에러:', error);
  }
}
```

---

## 더미 데이터 생성

모든 DTO는 테스트 및 개발을 위한 더미 데이터 생성 메서드를 제공합니다.

### 기본 더미 데이터

```javascript
const PostResponse = require('./src/dto/response/post/PostResponse');

// 기본 더미 데이터 생성
const dummyPost = PostResponse.createDefault();
console.log(dummyPost);
```

### 시드 기반 더미 데이터

```javascript
const PostSummaryResponse = require('./src/dto/response/post/PostSummaryResponse');

// 여러 더미 데이터 생성
for (let i = 1; i <= 5; i++) {
  const post = PostSummaryResponse.createDummy(i);
  console.log(`게시글 #${i}:`, post.title);
}
```

### 더미 목록 생성

```javascript
const PostSummaryResponse = require('./src/dto/response/post/PostSummaryResponse');
const CommentResponse = require('./src/dto/response/comment/CommentResponse');

// 10개의 게시글 더미 생성
const posts = PostSummaryResponse.createDummyList(10);

// 특정 게시글의 댓글 20개 생성
const comments = CommentResponse.createDummyList(20, 1);
```

### ApiResponse 더미 생성

```javascript
const ApiResponse = require('./src/dto/response/common/ApiResponse');

// 로그인 성공 응답
const loginSuccess = ApiResponse.createLoginSuccess();

// 게시글 목록 응답
const postList = ApiResponse.createPostListSuccess(20);

// 게시글 상세 응답
const postDetail = ApiResponse.createPostDetailSuccess(1);

// 댓글 목록 응답
const commentList = ApiResponse.createCommentListSuccess(10, 1);

// 에러 응답
const validationError = ApiResponse.createValidationError();
const authError = ApiResponse.createAuthError();
const notFoundError = ApiResponse.createNotFoundError();
```

---

## 실전 예시

### 로그인 페이지

```javascript
const LoginRequest = require('./src/dto/request/auth/LoginRequest');
const { validateLoginRequest } = require('./src/validation');

document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);

  // DTO 생성
  const loginDto = new LoginRequest({
    email: formData.get('email'),
    password: formData.get('password')
  });

  // 클라이언트 측 검증
  const errors = validateLoginRequest(loginDto);
  if (errors.length > 0) {
    displayErrors(errors);
    return;
  }

  // API 호출
  try {
    const response = await fetch('/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginDto)
    });

    const jsonData = await response.json();

    if (jsonData.success) {
      sessionStorage.setItem('userId', jsonData.data.userId);
      location.href = '/';
    } else {
      alert(jsonData.message);
    }
  } catch (error) {
    console.error('로그인 실패:', error);
  }
});
```

### 게시글 목록 페이지

```javascript
const PageSortRequest = require('./src/dto/request/common/PageSortRequest');
const PageResponse = require('./src/dto/response/common/PageResponse');
const PostSummaryResponse = require('./src/dto/response/post/PostSummaryResponse');

async function loadPosts(page = 0) {
  // 페이지네이션 요청 생성
  const pageRequest = new PageSortRequest({
    page,
    size: 20,
    sort: ['createdAt,desc']
  });

  try {
    const response = await fetch(
      `/api/v1/posts?${pageRequest.toQueryString()}`
    );
    const jsonData = await response.json();

    if (jsonData.success) {
      const pageResponse = new PageResponse(jsonData.data);

      // 게시글 렌더링
      renderPosts(pageResponse.items);

      // 페이지네이션 UI 업데이트
      updatePagination(pageResponse);
    }
  } catch (error) {
    console.error('게시글 로드 실패:', error);
  }
}

function renderPosts(posts) {
  const container = document.getElementById('postList');
  container.innerHTML = posts.map(post => `
    <div class="post-item">
      <h3><a href="/posts/${post.postId}">${post.title}</a></h3>
      <div class="post-meta">
        <span>작성자: ${post.member.nickname}</span>
        <span>조회: ${post.views}</span>
        <span>좋아요: ${post.likes}</span>
        <span>댓글: ${post.commentsCount}</span>
      </div>
    </div>
  `).join('');
}

function updatePagination(pageResponse) {
  const pagination = document.getElementById('pagination');

  pagination.innerHTML = `
    <button
      ${!pageResponse.hasPrevious() ? 'disabled' : ''}
      onclick="loadPosts(${pageResponse.page - 1})">
      이전
    </button>
    <span>페이지 ${pageResponse.page + 1} / ${pageResponse.totalPages}</span>
    <button
      ${!pageResponse.hasNext() ? 'disabled' : ''}
      onclick="loadPosts(${pageResponse.page + 1})">
      다음
    </button>
  `;
}
```

### 게시글 작성 페이지

```javascript
const PostCreateRequest = require('./src/dto/request/post/PostCreateRequest');
const { validatePostCreateRequest } = require('./src/validation');

document.getElementById('postForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const userId = sessionStorage.getItem('userId');

  // DTO 생성
  const postDto = new PostCreateRequest({
    memberId: parseInt(userId),
    title: formData.get('title'),
    content: formData.get('content'),
    image: formData.get('image')
  });

  // 유효성 검증
  const errors = validatePostCreateRequest(postDto);
  if (errors.length > 0) {
    displayErrors(errors);
    return;
  }

  // API 호출
  try {
    const response = await fetch('/api/v1/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postDto)
    });

    const jsonData = await response.json();

    if (jsonData.success) {
      alert('게시글이 등록되었습니다.');
      location.href = `/posts/${jsonData.data.postId}`;
    } else {
      if (jsonData.errors) {
        displayErrors(jsonData.errors);
      } else {
        alert(jsonData.message);
      }
    }
  } catch (error) {
    console.error('게시글 등록 실패:', error);
  }
});
```

### 개발/테스트용 더미 데이터 사용

```javascript
const ApiResponse = require('./src/dto/response/common/ApiResponse');

// 개발 중 API 서버가 준비되지 않았을 때 더미 데이터 사용
const USE_DUMMY_DATA = process.env.NODE_ENV === 'development';

async function fetchPosts(page = 0) {
  if (USE_DUMMY_DATA) {
    // 더미 데이터 반환
    return ApiResponse.createPostListSuccess(20);
  }

  // 실제 API 호출
  const response = await fetch(`/api/v1/posts?page=${page}`);
  return await response.json();
}

async function fetchPostDetail(postId) {
  if (USE_DUMMY_DATA) {
    // 더미 데이터 반환
    return ApiResponse.createPostDetailSuccess(postId);
  }

  // 실제 API 호출
  const response = await fetch(`/api/v1/posts/${postId}`);
  return await response.json();
}
```

---

## 요약

- **DTO 생성**: 객체 구조 분해를 통한 간결한 생성
- **Validation**: 별도 함수로 분리하여 재사용성 확보
- **더미 데이터**: 개발/테스트 시 즉시 사용 가능한 더미 데이터 메서드 제공
- **TypeScript 마이그레이션 준비**: 현재 구조를 유지하면서 타입 안정성 추가 가능

이 구조는 JavaScript로 빠르게 개발하면서도, 향후 TypeScript로 전환 시 최소한의 변경만으로 마이그레이션할 수 있도록 설계되었습니다.
