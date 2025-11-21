# Post Create - 게시글 작성 시스템

마크다운 기반 게시글 작성 및 출간 시스템

## 📁 파일 구조

```
sample-page/post-create/
├── create.html          # 메인 에디터 페이지
├── create.css           # 에디터 스타일
├── create.js            # 에디터 로직
├── publish.html         # 출간 설정 페이지
├── publish.css          # 출간 페이지 스타일
├── publish.js           # 출간 로직
└── README.md            # 문서 (현재 파일)
```

## ✨ 주요 기능

### 1. 마크다운 에디터 (create.html)

#### 툴바 기능
- **텍스트 서식**: Bold(`**`), Italic(`*`), Strikethrough(`~~`)
- **제목**: H1(`#`), H2(`##`), H3(`###`), H4(`####`)
- **리스트**: 순서 없는 목록(`-`), 순서 있는 목록(`1.`), 체크리스트(`- [ ]`)
- **삽입**: 인용구(`>`), 코드 블록(` ``` `), 링크(`[]()`)
- **이미지**: 드래그 앤 드롭 또는 버튼 클릭
- **구분선**: 수평선(`---`)
- **미리보기**: 토글 방식 렌더링

#### 이미지 업로드
- **드래그 앤 드롭**: 에디터 영역 어디서나 가능
- **클릭 업로드**: 툴바 이미지 버튼
- **업로드 플로우**:
  1. Pre-signed URL 요청 (`GET /api/v1/images/sign?type=post`)
  2. Cloudinary 업로드
  3. 마크다운 자동 삽입 (`![filename](url)`)
- **제한사항**:
  - 최대 파일 크기: 10MB
  - 허용 형식: JPEG, PNG, GIF, WebP

#### 자동 저장
- **로컬 저장**: 30초마다 localStorage에 자동 저장
- **백엔드 저장**: "임시 저장" 버튼 클릭 시 서버에 저장
- **저장 상태**: 실시간 저장 상태 표시
- **복원**: 페이지 로드 시 자동 복원

#### 키보드 단축키
- `Ctrl/Cmd + B`: Bold
- `Ctrl/Cmd + I`: Italic
- `Ctrl/Cmd + K`: Link
- `Ctrl/Cmd + S`: 임시 저장

### 2. 출간 설정 페이지 (publish.html)

#### 게시글 정보
- **제목 미리보기**: 에디터에서 작성한 제목 표시 (읽기 전용)
- **간단한 소개**: 150자 이내 요약 (선택)
- **문자 수 카운터**: 실시간 표시

#### 썸네일 관리
- **자동 설정**: 게시글의 첫 번째 이미지 자동 사용
- **수동 업로드**: 별도 이미지 업로드 가능
- **제거**: 선택된 썸네일 제거

#### 태그 시스템
- **자동 완성**: 입력 시 기존 태그 추천
- **커스텀 태그**: 새로운 태그 추가 가능
- **입력 방식**: Enter 키로 추가
- **최대 개수**: 5개
- **시각화**: 태그 칩으로 표시 (제거 가능)

#### 시리즈 선택
- **기존 시리즈**: 드롭다운에서 선택
- **새 시리즈**: 모달을 통해 생성
  - 시리즈 이름 (필수)
  - 시리즈 설명 (선택)

#### 공개 설정
- **전체 공개**: 모든 사람이 볼 수 있음
- **비공개**: 본인만 볼 수 있음

## 🎨 디자인 시스템

### 컬러
- Primary: `#667eea` (보라/블루)
- Text: `#333` (기본), `#666` (보조), `#999` (비활성)
- Border: `#e5e5e5`
- Background: `#ffffff`, `#fafafa`, `#f5f5f5`

### 타이포그래피
- Font Stack: `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif`
- 제목 입력: 42px, Bold
- 본문: 17px, line-height 1.8
- H2: 32px, H3: 24px, H4: 20px

### 레이아웃
- 최대 너비: 800px (에디터), 720px (출간)
- 여백: 24px, 32px, 48px
- Border Radius: 8px~12px
- 반응형 브레이크포인트: 1024px, 768px

## 🔧 기술 구현

### 마크다운 파싱
바닐라 JavaScript로 기본 구현 (라이브러리 교체 가능)

```javascript
parseMarkdown(markdown) {
  // 코드 블록, 제목, 리스트, 링크, 이미지 등 파싱
  // 정규식 기반 변환
  return html;
}
```

### 데이터 구조

#### localStorage 스키마
```javascript
{
  postDraft: {
    title: string,
    content: string,
    images: string[],
    lastSaved: timestamp
  }
}
```

#### 게시글 생성 Payload
```javascript
{
  memberId: number,
  title: string,
  content: string,
  image: string | null,
  summary: string | null,
  tags: string[],
  seriesId: number | null,
  visibility: 'public' | 'private',
  isDraft: boolean
}
```

## 🚀 사용 흐름

1. **작성 시작**: `create.html` 접속
2. **제목/내용 입력**: 마크다운 툴바 활용
3. **이미지 추가**: 드래그 앤 드롭 또는 버튼 클릭
4. **자동 저장**: 30초마다 로컬 저장
5. **임시 저장** (선택): 백엔드에 저장
6. **출간하기**: `publish.html`로 이동
7. **메타 정보 입력**: 요약, 태그, 시리즈, 썸네일
8. **최종 출간**: API 호출 → 게시글 상세 페이지로 리다이렉트

## 📡 API 연동

### 이미지 업로드
```
GET /api/v1/images/sign?type=post
→ Pre-signed URL 및 업로드 파라미터 반환

POST {cloudinary_upload_url}
→ 이미지 업로드 및 URL 반환
```

### 게시글 저장/출간
```
POST /api/v1/posts
Body: {
  memberId, title, content, image,
  summary, tags, seriesId, visibility, isDraft
}
```

## 🎯 컴포넌트 분리 구조

추후 `src/components/`로 분리 가능하도록 모듈화

```javascript
class MarkdownEditor {
  - initToolbar()
  - applyFormat()
  - parseMarkdown()
  - initAutoSave()
  - initImageUpload()
}

class PublishController {
  - loadDraft()
  - initTagsInput()
  - initThumbnail()
  - publishPost()
}
```

## 📱 반응형 지원

### 모바일 (768px 이하)
- 툴바 버튼 크기 축소
- 제목 폰트 크기 조정 (42px → 32px)
- 버튼 레이아웃 세로 정렬
- 모달 전체 너비 사용

### 태블릿 (1024px 이하)
- 컨테이너 최대 너비 조정
- 그리드 레이아웃 축소

## 🔍 주요 기능 상세

### 마크다운 미리보기
- 토글 버튼으로 편집/미리보기 전환
- 실시간 HTML 렌더링
- 게시글 상세 페이지와 동일한 스타일 적용

### 이미지 업로드 진행 표시
- 모달 팝업으로 업로드 진행률 표시
- 다중 이미지 동시 업로드 지원
- 성공/실패 아이콘 표시

### 태그 자동 완성
- 입력 시 유사 태그 최대 5개 추천
- 클릭 또는 Enter로 선택
- 중복 태그 방지

## 🛠️ 설정 값

```javascript
const AUTOSAVE_INTERVAL = 30000;        // 30초
const STORAGE_KEY = 'postDraft';
const API_BASE_URL = 'http://localhost:8080/api/v1';
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_IMAGE_TYPES = [
  'image/jpeg', 'image/jpg',
  'image/png', 'image/gif', 'image/webp'
];
```

## 📝 개선 가능 사항

- 마크다운 라이브러리 교체 (marked.js, markdown-it 등)
- 코드 하이라이팅 (highlight.js, prism.js)
- 실시간 협업 편집 (WebSocket)
- 버전 히스토리 관리
- 이미지 리사이징 및 최적화
- 목차 자동 생성
- 다크 모드 지원
