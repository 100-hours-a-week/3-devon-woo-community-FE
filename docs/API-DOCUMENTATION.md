# Community Platform REST API Documentation

## Project Overview

- **Project Name**: Community Platform REST API
- **Version**: 1.0
- **Base URL**: `/api/v1`
- **Framework**: Spring Boot 3.x
- **DTO Pattern**: Java Records
- **Validation**: Jakarta Validation
- **Documentation**: OpenAPI 3.0

---

## Table of Contents

1. [Request Objects](#request-objects)
2. [Response Objects](#response-objects)
3. [API Endpoints](#api-endpoints)
4. [Validation Rules](#validation-rules)
5. [Pagination Settings](#pagination-settings)
6. [Architectural Patterns](#architectural-patterns)
7. [Security Notes](#security-notes)

---

## Request Objects

### Authentication Requests

#### LoginRequest
**Package**: `com.kakaotechbootcamp.community.application.auth.dto`

| Field | Type | Validations |
|-------|------|-------------|
| email | String | @NotBlank, @Email |
| password | String | @NotBlank |

**Example**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### SignupRequest
**Package**: `com.kakaotechbootcamp.community.application.auth.dto`

| Field | Type | Validations |
|-------|------|-------------|
| email | String | @NotBlank, @Email |
| password | String | @NotBlank, @Size(min=8) |
| nickname | String | @NotBlank, @Size(max=30) |
| profileImage | String | @Pattern(URL pattern) |

**Example**:
```json
{
  "email": "newuser@example.com",
  "password": "securepass123",
  "nickname": "DevUser",
  "profileImage": "https://example.com/profile.jpg"
}
```

---

### Member Requests

#### MemberUpdateRequest
**Package**: `com.kakaotechbootcamp.community.application.member.dto.request`

| Field | Type | Validations |
|-------|------|-------------|
| nickname | String | @Size(max=30) |
| profileImage | String | @Pattern(URL pattern) |

**Example**:
```json
{
  "nickname": "UpdatedNickname",
  "profileImage": "https://example.com/new-profile.jpg"
}
```

#### PasswordUpdateRequest
**Package**: `com.kakaotechbootcamp.community.application.member.dto.request`

| Field | Type | Validations |
|-------|------|-------------|
| currentPassword | String | @NotBlank |
| newPassword | String | @NotBlank, @Size(min=8) |

**Example**:
```json
{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword456"
}
```

---

### Post Requests

#### PostCreateRequest
**Package**: `com.kakaotechbootcamp.community.application.post.dto.request`

| Field | Type | Validations |
|-------|------|-------------|
| memberId | Long | @NotNull |
| title | String | @NotBlank |
| content | String | @NotBlank |
| image | String | @Pattern(URL pattern) |

**Example**:
```json
{
  "memberId": 1,
  "title": "My First Post",
  "content": "This is the content of my first post.",
  "image": "https://example.com/post-image.jpg"
}
```

#### PostUpdateRequest
**Package**: `com.kakaotechbootcamp.community.application.post.dto.request`

| Field | Type | Validations |
|-------|------|-------------|
| memberId | Long | @NotNull |
| title | String | @NotBlank |
| content | String | @NotBlank |
| image | String | @Pattern(URL pattern) |

**Example**:
```json
{
  "memberId": 1,
  "title": "Updated Post Title",
  "content": "Updated content.",
  "image": "https://example.com/updated-image.jpg"
}
```

---

### Comment Requests

#### CommentCreateRequest
**Package**: `com.kakaotechbootcamp.community.application.comment.dto.request`

| Field | Type | Validations |
|-------|------|-------------|
| memberId | Long | @NotNull |
| content | String | @NotBlank |

**Example**:
```json
{
  "memberId": 1,
  "content": "Great post!"
}
```

#### CommentUpdateRequest
**Package**: `com.kakaotechbootcamp.community.application.comment.dto.request`

| Field | Type | Validations |
|-------|------|-------------|
| memberId | Long | @NotNull |
| content | String | @NotBlank |

**Example**:
```json
{
  "memberId": 1,
  "content": "Updated comment content"
}
```

---

### Common Requests

#### PageSortRequest
**Package**: `com.kakaotechbootcamp.community.application.common.dto.request`

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| page | Integer | 0 | Page number (0-based) |
| size | Integer | 20 | Page size |
| sort | List\<String\> | ["createdAt,desc"] | Sort criteria in format 'fieldName,asc\|desc' |

**Methods**:
- `toPageable()` - Converts to Spring's Pageable object

**Example**:
```
?page=0&size=20&sort=createdAt,desc
```

#### ViewContext
**Package**: `com.kakaotechbootcamp.community.application.post.dto`

| Field | Type | Nullable | Description |
|-------|------|----------|-------------|
| memberId | Long | Yes | Logged-in user ID |
| ipAddress | String | No | Client IP (proxy-aware) |
| userAgent | String | No | Browser User-Agent header |

**Methods**:
- `from(HttpServletRequest, Long memberId)` - Factory method

---

## Response Objects

### Authentication Responses

#### LoginResponse
**Package**: `com.kakaotechbootcamp.community.application.auth.dto`

| Field | Type |
|-------|------|
| userId | Long |

**Example**:
```json
{
  "success": true,
  "message": null,
  "data": {
    "userId": 1
  },
  "errors": null
}
```

#### SignupResponse
**Package**: `com.kakaotechbootcamp.community.application.auth.dto`

| Field | Type |
|-------|------|
| userId | Long |

**Example**:
```json
{
  "success": true,
  "message": null,
  "data": {
    "userId": 2
  },
  "errors": null
}
```

---

### Member Responses

#### MemberResponse
**Package**: `com.kakaotechbootcamp.community.application.member.dto.response`

| Field | Type |
|-------|------|
| memberId | Long |
| nickname | String |
| profileImage | String |

**Methods**:
- `of(Member entity)` - Creates from Member entity

**Example**:
```json
{
  "memberId": 1,
  "nickname": "DevUser",
  "profileImage": "https://example.com/profile.jpg"
}
```

#### MemberUpdateResponse
**Package**: `com.kakaotechbootcamp.community.application.member.dto.response`

| Field | Type |
|-------|------|
| nickname | String |
| profileImage | String |

**Methods**:
- `of(Member entity)` - Creates from Member entity

**Example**:
```json
{
  "success": true,
  "message": null,
  "data": {
    "nickname": "UpdatedNickname",
    "profileImage": "https://example.com/new-profile.jpg"
  },
  "errors": null
}
```

---

### Post Responses

#### PostResponse
**Package**: `com.kakaotechbootcamp.community.application.post.dto.response`

| Field | Type | Description |
|-------|------|-------------|
| postId | Long | |
| member | MemberResponse | Nested object |
| title | String | |
| content | String | |
| imageUrl | String | |
| createdAt | Instant | Timestamp |
| updatedAt | Instant | Timestamp |
| views | Long | View count |
| likes | Long | Like count |

**Methods**:
- `of(Post, Member, Attachment)` - Creates from entities

**Example**:
```json
{
  "postId": 1,
  "member": {
    "memberId": 1,
    "nickname": "DevUser",
    "profileImage": "https://example.com/profile.jpg"
  },
  "title": "My First Post",
  "content": "This is the content of my first post.",
  "imageUrl": "https://example.com/post-image.jpg",
  "createdAt": "2025-11-05T10:30:00Z",
  "updatedAt": "2025-11-05T10:30:00Z",
  "views": 42,
  "likes": 5
}
```

#### PostSummaryResponse
**Package**: `com.kakaotechbootcamp.community.application.post.dto.response`

| Field | Type | Description |
|-------|------|-------------|
| postId | Long | |
| title | String | |
| member | MemberResponse | Nested object |
| createdAt | Instant | Timestamp |
| views | Long | View count |
| likes | Long | Like count |
| commentsCount | Long | Comment count |

**Methods**:
- `fromDto(PostQueryDto)` - Creates from query DTO

**Example**:
```json
{
  "postId": 1,
  "title": "My First Post",
  "member": {
    "memberId": 1,
    "nickname": "DevUser",
    "profileImage": "https://example.com/profile.jpg"
  },
  "createdAt": "2025-11-05T10:30:00Z",
  "views": 42,
  "likes": 5,
  "commentsCount": 3
}
```

---

### Comment Response

#### CommentResponse
**Package**: `com.kakaotechbootcamp.community.application.comment.dto.response`

| Field | Type | Description |
|-------|------|-------------|
| commentId | Long | |
| postId | Long | Parent post ID |
| content | String | |
| member | MemberResponse | Nested object |
| createdAt | Instant | Timestamp |
| updatedAt | Instant | Timestamp |

**Methods**:
- `of(Comment, Member)` - Creates from entities
- `of(CommentQueryDto)` - Creates from query DTO

**Example**:
```json
{
  "commentId": 1,
  "postId": 1,
  "content": "Great post!",
  "member": {
    "memberId": 2,
    "nickname": "Commenter",
    "profileImage": "https://example.com/commenter.jpg"
  },
  "createdAt": "2025-11-05T11:00:00Z",
  "updatedAt": "2025-11-05T11:00:00Z"
}
```

---

### Common Responses

#### PageResponse\<T\>
**Package**: `com.kakaotechbootcamp.community.application.common.dto.response`

**Description**: Generic paginated response wrapper

| Field | Type | Description |
|-------|------|-------------|
| items | List\<T\> | Generic list of data |
| page | int | Current page number (0-based) |
| size | int | Page size |
| totalElements | long | Total number of items |
| totalPages | int | Total number of pages |

**Methods**:
- `of(List<T>, Page<?>)` - Creates from Spring Page object

**Example**:
```json
{
  "items": [...],
  "page": 0,
  "size": 20,
  "totalElements": 100,
  "totalPages": 5
}
```

#### ApiResponse\<T\>
**Package**: `com.kakaotechbootcamp.community.common.dto.api`

**Description**: Generic API response wrapper

| Field | Type | Description |
|-------|------|-------------|
| success | boolean | Operation success flag |
| message | String | Response message |
| data | T | Generic response data |
| errors | List\<FieldError\> | Validation errors |

**Methods**:
- `success()` - Success without data
- `success(T data)` - Success with data
- `success(T data, String message)` - Success with data and message
- `failure(String message)` - Failure
- `failure(String message, List<FieldError> errors)` - Failure with validation errors

**Success Example**:
```json
{
  "success": true,
  "message": null,
  "data": {...},
  "errors": null
}
```

**Error Example**:
```json
{
  "success": false,
  "message": "Validation failed",
  "data": null,
  "errors": [
    {
      "field": "email",
      "message": "올바른 이메일 형식이 아닙니다"
    }
  ]
}
```

---

## API Endpoints

### Authentication Endpoints

**Base URL**: `/api/v1/auth`
**Controller**: `AuthController`
**Package**: `com.kakaotechbootcamp.community.application.auth.controller`

#### 1. Register New User

```http
POST /api/v1/auth/signup
```

- **Request Body**: `SignupRequest`
- **Response**: `ApiResponse<SignupResponse>`
- **HTTP Status**: 201 Created
- **Description**: Register new user

**Example Request**:
```bash
curl -X POST http://localhost:8080/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "securepass123",
    "nickname": "DevUser",
    "profileImage": "https://example.com/profile.jpg"
  }'
```

---

#### 2. Login

```http
POST /api/v1/auth/login
```

- **Request Body**: `LoginRequest`
- **Response**: `ApiResponse<LoginResponse>`
- **HTTP Status**: 200 OK
- **Description**: Login with email and password

**Example Request**:
```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

---

#### 3. Logout

```http
POST /api/v1/auth/logout
```

- **Request Body**: None
- **Response**: `void`
- **HTTP Status**: 204 No Content
- **Description**: Logout current user

**Example Request**:
```bash
curl -X POST http://localhost:8080/api/v1/auth/logout
```

---

### Member Endpoints

**Base URL**: `/api/v1/members`
**Controller**: `MemberController`
**Package**: `com.kakaotechbootcamp.community.application.member.controller`

#### 1. Get Member Profile

```http
GET /api/v1/members/{id}
```

- **Path Variables**: `id` (Long) - Member ID
- **Response**: `ApiResponse<MemberResponse>`
- **HTTP Status**: 200 OK
- **Description**: Get member profile by ID

**Example Request**:
```bash
curl -X GET http://localhost:8080/api/v1/members/1
```

---

#### 2. Update Member Profile

```http
PATCH /api/v1/members/{id}
```

- **Path Variables**: `id` (Long) - Member ID
- **Request Body**: `MemberUpdateRequest`
- **Response**: `ApiResponse<MemberUpdateResponse>`
- **HTTP Status**: 200 OK
- **Description**: Update member profile

**Example Request**:
```bash
curl -X PATCH http://localhost:8080/api/v1/members/1 \
  -H "Content-Type: application/json" \
  -d '{
    "nickname": "UpdatedNickname",
    "profileImage": "https://example.com/new-profile.jpg"
  }'
```

---

#### 3. Change Password

```http
PATCH /api/v1/members/{id}/password
```

- **Path Variables**: `id` (Long) - Member ID
- **Request Body**: `PasswordUpdateRequest`
- **Response**: `void`
- **HTTP Status**: 204 No Content
- **Description**: Change member password

**Example Request**:
```bash
curl -X PATCH http://localhost:8080/api/v1/members/1/password \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "oldpassword123",
    "newPassword": "newpassword456"
  }'
```

---

#### 4. Delete Member Account

```http
DELETE /api/v1/members/{id}
```

- **Path Variables**: `id` (Long) - Member ID
- **Response**: `void`
- **HTTP Status**: 204 No Content
- **Description**: Delete member account

**Example Request**:
```bash
curl -X DELETE http://localhost:8080/api/v1/members/1
```

---

### Post Endpoints

**Base URL**: `/api/v1/posts`
**Controller**: `PostController`
**Package**: `com.kakaotechbootcamp.community.application.post.controller`

#### 1. Create Post

```http
POST /api/v1/posts
```

- **Request Body**: `PostCreateRequest`
- **Response**: `ApiResponse<PostResponse>`
- **HTTP Status**: 201 Created
- **Description**: Create new post

**Example Request**:
```bash
curl -X POST http://localhost:8080/api/v1/posts \
  -H "Content-Type: application/json" \
  -d '{
    "memberId": 1,
    "title": "My First Post",
    "content": "This is the content of my first post.",
    "image": "https://example.com/post-image.jpg"
  }'
```

---

#### 2. Get Post List (Paginated)

```http
GET /api/v1/posts?page={page}&size={size}&sort={sort}
```

- **Query Parameters**:
  - `page` (Integer, default: 0) - Page number (0-based)
  - `size` (Integer, default: 20) - Page size
  - `sort` (String[], default: "createdAt,desc") - Sort criteria (format: fieldName,direction)
- **Response**: `ApiResponse<PageResponse<PostSummaryResponse>>`
- **HTTP Status**: 200 OK
- **Description**: Get paginated list of posts

**Example Request**:
```bash
curl -X GET "http://localhost:8080/api/v1/posts?page=0&size=20&sort=createdAt,desc"
```

---

#### 3. Get Post Details

```http
GET /api/v1/posts/{postId}?memberId={memberId}
```

- **Path Variables**: `postId` (Long) - Post ID
- **Query Parameters**: `memberId` (Long, optional) - Member ID for context
- **Response**: `ApiResponse<PostResponse>`
- **HTTP Status**: 200 OK
- **Description**: Get post details by ID

**Example Request**:
```bash
curl -X GET "http://localhost:8080/api/v1/posts/1?memberId=1"
```

---

#### 4. Update Post

```http
PATCH /api/v1/posts/{postId}
```

- **Path Variables**: `postId` (Long) - Post ID
- **Request Body**: `PostUpdateRequest`
- **Response**: `ApiResponse<PostResponse>`
- **HTTP Status**: 200 OK
- **Description**: Update existing post

**Example Request**:
```bash
curl -X PATCH http://localhost:8080/api/v1/posts/1 \
  -H "Content-Type: application/json" \
  -d '{
    "memberId": 1,
    "title": "Updated Post Title",
    "content": "Updated content.",
    "image": "https://example.com/updated-image.jpg"
  }'
```

---

#### 5. Delete Post

```http
DELETE /api/v1/posts/{postId}
```

- **Path Variables**: `postId` (Long) - Post ID
- **Request Body**: `PostUpdateRequest`
- **Response**: `void`
- **HTTP Status**: 204 No Content
- **Description**: Delete post

**Example Request**:
```bash
curl -X DELETE http://localhost:8080/api/v1/posts/1 \
  -H "Content-Type: application/json" \
  -d '{
    "memberId": 1,
    "title": "",
    "content": ""
  }'
```

---

#### 6. Like Post

```http
POST /api/v1/posts/{postId}/like?memberId={memberId}
```

- **Path Variables**: `postId` (Long) - Post ID
- **Query Parameters**: `memberId` (Long, required) - Member ID who is liking the post
- **Response**: `void`
- **HTTP Status**: 204 No Content
- **Description**: Like a post

**Example Request**:
```bash
curl -X POST "http://localhost:8080/api/v1/posts/1/like?memberId=1"
```

---

#### 7. Unlike Post

```http
DELETE /api/v1/posts/{postId}/like?memberId={memberId}
```

- **Path Variables**: `postId` (Long) - Post ID
- **Query Parameters**: `memberId` (Long, required) - Member ID who is unliking the post
- **Response**: `void`
- **HTTP Status**: 204 No Content
- **Description**: Unlike a post

**Example Request**:
```bash
curl -X DELETE "http://localhost:8080/api/v1/posts/1/like?memberId=1"
```

---

### Comment Endpoints

**Base URL**: `/api/v1`
**Controller**: `CommentController`
**Package**: `com.kakaotechbootcamp.community.application.comment.controller`

#### 1. Create Comment

```http
POST /api/v1/posts/{postId}/comments
```

- **Path Variables**: `postId` (Long) - Post ID
- **Request Body**: `CommentCreateRequest`
- **Response**: `ApiResponse<CommentResponse>`
- **HTTP Status**: 201 Created
- **Description**: Create new comment on a post

**Example Request**:
```bash
curl -X POST http://localhost:8080/api/v1/posts/1/comments \
  -H "Content-Type: application/json" \
  -d '{
    "memberId": 1,
    "content": "Great post!"
  }'
```

---

#### 2. Get Comments for Post (Paginated)

```http
GET /api/v1/posts/{postId}/comments?page={page}&size={size}&sort={sort}
```

- **Path Variables**: `postId` (Long) - Post ID
- **Query Parameters**:
  - `page` (Integer, default: 0) - Page number (0-based)
  - `size` (Integer, default: 10) - Page size
  - `sort` (String[], default: "createdAt,asc") - Sort criteria
- **Response**: `ApiResponse<PageResponse<CommentResponse>>`
- **HTTP Status**: 200 OK
- **Description**: Get paginated list of comments for a post

**Example Request**:
```bash
curl -X GET "http://localhost:8080/api/v1/posts/1/comments?page=0&size=10&sort=createdAt,asc"
```

---

#### 3. Get Single Comment

```http
GET /api/v1/comments/{commentId}
```

- **Path Variables**: `commentId` (Long) - Comment ID
- **Response**: `ApiResponse<CommentResponse>`
- **HTTP Status**: 200 OK
- **Description**: Get single comment by ID

**Example Request**:
```bash
curl -X GET http://localhost:8080/api/v1/comments/1
```

---

#### 4. Update Comment

```http
PATCH /api/v1/comments/{commentId}
```

- **Path Variables**: `commentId` (Long) - Comment ID
- **Request Body**: `CommentUpdateRequest`
- **Response**: `ApiResponse<CommentResponse>`
- **HTTP Status**: 200 OK
- **Description**: Update existing comment

**Example Request**:
```bash
curl -X PATCH http://localhost:8080/api/v1/comments/1 \
  -H "Content-Type: application/json" \
  -d '{
    "memberId": 1,
    "content": "Updated comment content"
  }'
```

---

#### 5. Delete Comment

```http
DELETE /api/v1/comments/{commentId}
```

- **Path Variables**: `commentId` (Long) - Comment ID
- **Request Body**: `CommentUpdateRequest`
- **Response**: `void`
- **HTTP Status**: 204 No Content
- **Description**: Delete comment

**Example Request**:
```bash
curl -X DELETE http://localhost:8080/api/v1/comments/1 \
  -H "Content-Type: application/json" \
  -d '{
    "memberId": 1,
    "content": ""
  }'
```

---

## Validation Rules

### Validation Patterns

| Pattern | Value |
|---------|-------|
| EMAIL_PATTERN | `^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$` |
| URL_PATTERN | `^https?://.*` |
| NICKNAME_MAX_LENGTH | 30 |
| PASSWORD_MIN_LENGTH | 8 |

### Validation Messages

| Message Key | Message (Korean) |
|-------------|------------------|
| REQUIRED_FIELD | 필수 입력 항목입니다 |
| INVALID_EMAIL_FORMAT | 올바른 이메일 형식이 아닙니다 |
| INVALID_PASSWORD_FORMAT | 비밀번호는 최소 8자 이상이어야 합니다 |
| REQUIRED_PASSWORD | 비밀번호를 입력해주세요 |
| INVALID_NICKNAME | 닉네임은 최대 10자까지 입력 가능합니다 |
| INVALID_IMAGE_URL | 올바른 이미지 URL 형식이 아닙니다 |
| INVALID_PROFILE_IMAGE | 올바른 프로필 이미지 URL 형식이 아닙니다 |
| REQUIRED_POST_TITLE | 게시글 제목을 입력해주세요 |
| REQUIRED_POST_CONTENT | 게시글 내용을 입력해주세요 |
| REQUIRED_COMMENT_CONTENT | 댓글 내용을 입력해주세요 |
| REQUIRED_MEMBER_ID | 작성자 정보가 필요합니다 |

---

## Pagination Settings

### Default Values

| Setting | Value |
|---------|-------|
| DEFAULT_PAGE | 0 |
| DEFAULT_SIZE | 20 |
| DEFAULT_SORT | createdAt,desc |
| COMMENT_DEFAULT_SIZE | 10 |
| COMMENT_DEFAULT_SORT | createdAt,asc |

---

## Architectural Patterns

This project follows several key architectural patterns:

1. **Record-based DTOs**
   - Using Java Records for immutable request/response objects
   - Provides compile-time safety and reduces boilerplate code

2. **Nested Response Objects**
   - PostResponse and CommentResponse contain MemberResponse
   - Reduces the need for multiple API calls
   - Provides complete context in single response

3. **Factory Methods**
   - DTOs use static factory methods (`of()`, `fromDto()`) for creation from entities
   - Encapsulates object creation logic
   - Improves code readability

4. **Generic Wrappers**
   - `ApiResponse<T>` and `PageResponse<T>` provide type-safe wrapper responses
   - Consistent response structure across all endpoints
   - Easy error handling

5. **Request/Response Separation**
   - Clear separation between request and response packages
   - Follows Single Responsibility Principle
   - Makes codebase easier to navigate

6. **Validation at DTO Level**
   - Jakarta validation annotations on all request DTOs
   - Automatic validation by Spring framework
   - Centralized validation logic

7. **Pagination Pattern**
   - Reusable PageSortRequest for pagination across all list endpoints
   - Consistent pagination interface
   - Easy to extend and customize

---

## Security Notes

### Current State
- **Authentication Method**: Manual `memberId` in request body
- **Authorization**: Not fully implemented

### Planned Implementation
- **JWT Integration**: JSON Web Token-based authentication
- **Spring Security**: Full Spring Security integration
- **@CurrentUser Annotation**: Extract logged-in user from security context

### Affected Endpoints
The following endpoints currently require `memberId` in request body but will be updated to use security context:

- Post creation/update/delete
- Comment creation/update/delete
- Post like/unlike

### Migration Plan
Once JWT/Spring Security is implemented:
1. Remove `memberId` from request bodies
2. Extract user information from `@CurrentUser` annotation
3. Validate user permissions at service layer
4. Add role-based access control (RBAC)

---

## API Summary

### Total Endpoints: 18

| Category | Count |
|----------|-------|
| Authentication | 3 |
| Member Management | 4 |
| Post Management | 7 |
| Comment Management | 5 |

### HTTP Status Codes Used

| Status Code | Usage |
|-------------|-------|
| 200 OK | Successful GET/PATCH requests |
| 201 Created | Successful POST requests (resource creation) |
| 204 No Content | Successful DELETE requests and some POST requests |
| 400 Bad Request | Validation errors |
| 404 Not Found | Resource not found |
| 500 Internal Server Error | Server errors |

---

## Contact & Support

For issues, questions, or contributions, please refer to the project repository.

**Last Updated**: 2025-11-05
