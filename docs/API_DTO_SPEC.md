# API & DTO Specification

## Overview
Complete API endpoints and DTO specifications for Tech Blog migration. All new endpoints support Mock implementation for frontend development.

---

## Authentication APIs

### POST /auth/login
**Purpose**: User login with email/password

**Request DTO**:
```typescript
interface LoginRequest {
  email: string;        // Email format
  password: string;     // Min 8 characters
}
```

**Response DTO** (Success - 200):
```typescript
interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: UserInfo;
}

interface UserInfo {
  id: number;
  email: string;
  nickname: string;
  avatar?: string;
}
```

**Response** (Error - 401):
```typescript
interface ErrorResponse {
  error: "INVALID_CREDENTIALS" | "EMAIL_NOT_VERIFIED";
  message: string;
}
```

### POST /auth/signup
**Purpose**: User registration

**Request DTO**:
```typescript
interface SignupRequest {
  email: string;
  emailVerified: boolean;   // Must be true
  nickname: string;         // 2-20 characters
  password: string;         // 8+ chars, letter+number+special
  termsAgreed: boolean;     // Required
  privacyAgreed: boolean;   // Required
  marketingAgreed: boolean; // Optional
}
```

**Response DTO** (Success - 201):
```typescript
interface SignupResponse {
  accessToken: string;
  refreshToken: string;
  user: UserInfo;
}
```

**Response** (Error - 400):
```typescript
interface SignupErrorResponse {
  error: "EMAIL_EXISTS" | "EMAIL_NOT_VERIFIED" | "INVALID_INPUT";
  message: string;
  field?: string;  // Which field caused error
}
```

### GET /auth/oauth/{provider}/authorize
**Purpose**: Initiate OAuth login

**Parameters**:
- `provider`: "google" | "github" | "kakao" | "naver"
- `redirect_uri`: URL to redirect after auth

**Mock Response**: Redirect to callback with fake code

### GET /auth/oauth/{provider}/callback
**Purpose**: OAuth callback handler

**Query Parameters**:
- `code`: Authorization code

**Response DTO** (Success - 200):
```typescript
interface OAuthCallbackResponse {
  accessToken: string;
  refreshToken: string;
  user: UserInfo;
  isNewUser: boolean;  // True if first time
}
```

---

## Email Verification APIs (NEW)

### POST /auth/email/send-code
**Purpose**: Send 6-digit verification code

**Request DTO**:
```typescript
interface SendCodeRequest {
  email: string;
}
```

**Response DTO** (Success - 200):
```typescript
interface SendCodeResponse {
  message: "인증코드가 발송되었습니다";
  expiresIn: 300;  // seconds (5 minutes)
}
```

**Response** (Error - 400):
```typescript
interface SendCodeError {
  error: "EMAIL_ALREADY_EXISTS" | "INVALID_EMAIL" | "TOO_MANY_REQUESTS";
  message: string;
}
```

### POST /auth/email/verify-code
**Purpose**: Verify 6-digit code

**Request DTO**:
```typescript
interface VerifyCodeRequest {
  email: string;
  code: string;  // 6 digits
}
```

**Response DTO** (Success - 200):
```typescript
interface VerifyCodeResponse {
  verified: true;
  message: "이메일 인증이 완료되었습니다";
}
```

**Response** (Error - 400):
```typescript
interface VerifyCodeError {
  verified: false;
  error: "INVALID_CODE" | "CODE_EXPIRED" | "EMAIL_NOT_FOUND";
  message: string;
}
```

---

## Posts APIs

### GET /posts
**Purpose**: Get paginated post list

**Query Parameters**:
```typescript
interface PostsQuery {
  page?: number;      // Default: 1
  limit?: number;     // Default: 10
  category?: string;  // Filter by category
  tag?: string;       // Filter by tag
  author?: string;    // Filter by author
  search?: string;    // Search in title/content
}
```

**Response DTO** (Success - 200):
```typescript
interface PostsResponse {
  posts: PostSummary[];
  pagination: PaginationInfo;
}

interface PostSummary {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  createdAt: string;  // ISO 8601
  views: number;
  likes: number;
  commentCount: number;
  thumbnail: "gradient-1" | "gradient-2" | "gradient-3" | "gradient-4" | string;  // URL or gradient name
  tags: string[];
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalPosts: number;
  hasNext: boolean;
  hasPrev: boolean;
}
```

### GET /posts/:id
**Purpose**: Get post detail

**Response DTO** (Success - 200):
```typescript
interface PostDetailResponse {
  id: number;
  title: string;
  category: string;
  author: string;
  authorId: number;
  createdAt: string;
  updatedAt: string;
  content: string;      // Markdown
  thumbnail?: string;
  likes: number;
  isLiked: boolean;     // For current user
  views: number;
  tags: string[];
}
```

### POST /posts
**Purpose**: Create new post

**Request DTO**:
```typescript
interface CreatePostRequest {
  title: string;        // Max 200 chars
  content: string;      // Markdown
  category: string;
  tags: string[];       // Max 10 tags
  series?: string;
  thumbnail?: string;   // Image URL
  visibility: "public" | "private" | "unlisted";
}
```

**Response DTO** (Success - 201):
```typescript
interface CreatePostResponse {
  id: number;
  title: string;
  createdAt: string;
  url: string;  // e.g., "/posts/123"
}
```

### PATCH /posts/:id
**Purpose**: Update post

**Request DTO** (Same as CreatePostRequest)

**Response DTO** (Success - 200): Same as CreatePostResponse

### DELETE /posts/:id
**Purpose**: Delete post

**Response DTO** (Success - 204): No content

### POST /posts/:id/like
**Purpose**: Toggle like on post

**Response DTO** (Success - 200):
```typescript
interface LikeResponse {
  liked: boolean;  // New state
  likes: number;   // Total likes
}
```

### GET /posts/:id/recommended
**Purpose**: Get recommended posts

**Query Parameters**:
- `limit?: number` (Default: 3)

**Response DTO** (Success - 200):
```typescript
interface RecommendedPostsResponse {
  posts: PostSummary[];  // Simplified version
}
```

### GET /posts/top
**Purpose**: Get TOP 5 posts

**Query Parameters**:
- `limit?: number` (Default: 5)
- `period?: "day" | "week" | "month"` (Default: "week")

**Response DTO** (Success - 200):
```typescript
interface TopPostsResponse {
  posts: Array<{
    id: number;
    title: string;
    url: string;
  }>;
}
```

### POST /posts/draft
**Purpose**: Save draft (autosave)

**Request DTO**:
```typescript
interface SaveDraftRequest {
  id?: number;      // If updating existing draft
  title: string;
  content: string;
}
```

**Response DTO** (Success - 200):
```typescript
interface SaveDraftResponse {
  id: number;
  updatedAt: string;
}
```

---

## Comments APIs

### GET /posts/:postId/comments
**Purpose**: Get comments for post

**Query Parameters**:
```typescript
interface CommentsQuery {
  sort?: "latest" | "oldest" | "likes";  // Default: latest
  page?: number;
  limit?: number;
}
```

**Response DTO** (Success - 200):
```typescript
interface CommentsResponse {
  comments: Comment[];
  total: number;
}

interface Comment {
  id: number;
  author: string;
  authorId: number;
  avatar: string;
  content: string;
  createdAt: string;
  likes: number;
  isLiked: boolean;
  replies?: Comment[];  // Nested replies (optional)
}
```

### POST /posts/:postId/comments
**Purpose**: Create comment

**Request DTO**:
```typescript
interface CreateCommentRequest {
  content: string;      // Max 1000 chars
  parentId?: number;    // For replies
}
```

**Response DTO** (Success - 201):
```typescript
interface CreateCommentResponse extends Comment {}
```

### DELETE /comments/:id
**Purpose**: Delete comment

**Response DTO** (Success - 204): No content

### POST /comments/:id/like
**Purpose**: Toggle like on comment

**Response DTO** (Success - 200): Same as post like

---

## Upload APIs (NEW)

### POST /upload/image
**Purpose**: Upload image (for posts, profile)

**Request**: multipart/form-data
```typescript
FormData {
  image: File;  // JPG, PNG, GIF, WebP (max 10MB)
}
```

**Response DTO** (Success - 200):
```typescript
interface UploadImageResponse {
  url: string;  // CDN URL
  filename: string;
  size: number;  // bytes
}
```

**Response** (Error - 400):
```typescript
interface UploadError {
  error: "FILE_TOO_LARGE" | "INVALID_FORMAT" | "UPLOAD_FAILED";
  message: string;
}
```

---

## User Profile APIs

### GET /users/:username
**Purpose**: Get user profile

**Response DTO** (Success - 200):
```typescript
interface UserProfileResponse {
  id: number;
  username: string;
  nickname: string;
  avatar: string;
  bio?: string;
  stats: {
    posts: number;
    reviews: number;
    comments: number;
  };
  categories: Array<{
    name: string;
    count: number;
  }>;
  tags: Array<{
    name: string;
    count: number;
  }>;
  isOwner: boolean;  // True if viewing own profile
}
```

### GET /users/:username/posts
**Purpose**: Get user's posts

**Query Parameters**: Same as GET /posts

**Response DTO**: Same as PostsResponse

### GET /users/:username/posts/recent
**Purpose**: Get recent posts for sidebar

**Query Parameters**:
- `limit?: number` (Default: 5)

**Response DTO** (Success - 200):
```typescript
interface RecentPostsResponse {
  posts: Array<{
    id: number;
    title: string;
  }>;
}
```

### PATCH /users/:username
**Purpose**: Update profile

**Request DTO**:
```typescript
interface UpdateProfileRequest {
  nickname?: string;
  bio?: string;
  avatar?: string;  // Image URL
}
```

**Response DTO** (Success - 200):
```typescript
interface UpdateProfileResponse {
  message: "프로필이 업데이트되었습니다";
  user: UserInfo;
}
```

### PATCH /users/:username/password
**Purpose**: Change password

**Request DTO**:
```typescript
interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}
```

**Response DTO** (Success - 200):
```typescript
interface ChangePasswordResponse {
  message: "비밀번호가 변경되었습니다";
}
```

---

## Keywords/Tags APIs (NEW)

### GET /keywords/top
**Purpose**: Get top keywords

**Query Parameters**:
- `limit?: number` (Default: 15)

**Response DTO** (Success - 200):
```typescript
interface TopKeywordsResponse {
  keywords: Array<{
    name: string;
    count: number;
  }>;
}
```

### GET /tags
**Purpose**: Get all tags (for autocomplete)

**Query Parameters**:
- `search?: string`  // Filter by prefix
- `limit?: number`

**Response DTO** (Success - 200):
```typescript
interface TagsResponse {
  tags: string[];
}
```

---

## Newsletter API (NEW)

### POST /newsletter/subscribe
**Purpose**: Subscribe to newsletter

**Request DTO**:
```typescript
interface NewsletterSubscribeRequest {
  email: string;
}
```

**Response DTO** (Success - 200):
```typescript
interface NewsletterSubscribeResponse {
  message: "구독이 완료되었습니다";
}
```

**Response** (Error - 400):
```typescript
interface NewsletterError {
  error: "ALREADY_SUBSCRIBED" | "INVALID_EMAIL";
  message: string;
}
```

---

## DTO Organization

### Request DTOs
```
src/dto/request/
├── AuthDTOs.js          # LoginRequest, SignupRequest, OAuthRequest
├── EmailVerificationDTOs.js  # SendCodeRequest, VerifyCodeRequest
├── PostDTOs.js          # CreatePostRequest, UpdatePostRequest, SaveDraftRequest
├── CommentDTOs.js       # CreateCommentRequest
├── UserDTOs.js          # UpdateProfileRequest, ChangePasswordRequest
├── NewsletterDTOs.js    # NewsletterSubscribeRequest
```

### Response DTOs
```
src/dto/response/
├── AuthDTOs.js          # LoginResponse, SignupResponse, OAuthCallbackResponse
├── EmailVerificationDTOs.js  # SendCodeResponse, VerifyCodeResponse
├── PostDTOs.js          # PostsResponse, PostDetailResponse, PostSummary
├── CommentDTOs.js       # CommentsResponse, Comment
├── UserDTOs.js          # UserProfileResponse, UserInfo
├── CommonDTOs.js        # PaginationInfo, ErrorResponse
├── UploadDTOs.js        # UploadImageResponse
├── NewsletterDTOs.js    # NewsletterSubscribeResponse
├── KeywordDTOs.js       # TopKeywordsResponse, TagsResponse
```

---

## Mock Server Implementation

### Updates to src/api/base/MockServer.js

**New Endpoints to Add**:
1. Email verification endpoints
2. OAuth endpoints (mock flow)
3. Post like endpoint
4. Comment like endpoint
5. Image upload endpoint (return fake URL)
6. Top posts endpoint
7. Keywords endpoint
8. Newsletter endpoint
9. User profile endpoints
10. Recommended posts endpoint

**Mock Data Structure**:
```javascript
class MockServer {
  constructor() {
    this.users = [];
    this.posts = [];
    this.comments = [];
    this.verificationCodes = new Map();  // NEW
    this.likes = new Map();              // NEW
    this.newsletterSubscribers = [];     // NEW
  }

  // Email verification mock
  sendVerificationCode(email) {
    const code = "123456";  // Always same in dev
    this.verificationCodes.set(email, {
      code,
      expiresAt: Date.now() + 300000  // 5 minutes
    });
    return { message: "인증코드가 발송되었습니다", expiresIn: 300 };
  }

  verifyCode(email, code) {
    const stored = this.verificationCodes.get(email);
    if (!stored) return { verified: false, error: "EMAIL_NOT_FOUND" };
    if (stored.code !== code) return { verified: false, error: "INVALID_CODE" };
    if (Date.now() > stored.expiresAt) return { verified: false, error: "CODE_EXPIRED" };

    return { verified: true, message: "이메일 인증이 완료되었습니다" };
  }

  // OAuth mock
  handleOAuthCallback(provider, code) {
    const mockUser = {
      id: Math.random(),
      email: `${provider}user@example.com`,
      nickname: `${provider}User`,
      avatar: `https://via.placeholder.com/160`
    };
    this.users.push(mockUser);

    return {
      accessToken: "mock_access_token",
      refreshToken: "mock_refresh_token",
      user: mockUser,
      isNewUser: true
    };
  }

  // Image upload mock
  uploadImage(file) {
    return {
      url: `https://cdn.example.com/images/${Date.now()}_${file.name}`,
      filename: file.name,
      size: file.size
    };
  }

  // Like toggle mock
  toggleLike(type, id, userId) {
    const key = `${type}_${id}_${userId}`;
    const liked = this.likes.has(key);

    if (liked) {
      this.likes.delete(key);
    } else {
      this.likes.set(key, true);
    }

    return {
      liked: !liked,
      likes: this.getLikeCount(type, id)
    };
  }
}
```

---

## Migration Checklist

- [ ] Add email verification DTOs
- [ ] Add OAuth DTOs
- [ ] Update post DTOs with likes, recommended
- [ ] Add comment like DTOs
- [ ] Add upload DTOs
- [ ] Add user profile DTOs
- [ ] Add keywords/tags DTOs
- [ ] Add newsletter DTOs
- [ ] Implement Mock Server endpoints
- [ ] Update API service files
- [ ] Test all endpoints

---

## Notes

- **Mock First**: All endpoints should work with Mock Server for frontend development
- **DTO Validation**: Add validation in DTOs (e.g., email format, length limits)
- **Error Handling**: Consistent error response format across all endpoints
- **Pagination**: Use consistent pagination structure
- **Timestamps**: Always ISO 8601 format
- **File Upload**: Max 10MB for images
- **Rate Limiting**: Consider for email verification (prevent spam)
