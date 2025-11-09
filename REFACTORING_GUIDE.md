# 프론트엔드 리팩토링 가이드

> PostListPage 리팩토링을 통해 확립된 코드 작성 표준 및 베스트 프랙티스

## 목차
1. [개요](#개요)
2. [유틸리티 함수 분리](#유틸리티-함수-분리)
3. [컴포넌트 분리](#컴포넌트-분리)
4. [Theme CSS 사용](#theme-css-사용)
5. [적용 체크리스트](#적용-체크리스트)

---

## 개요

이 문서는 PostListPage 리팩토링 과정에서 확립된 코드 작성 표준을 정리한 것입니다. 다른 페이지나 컴포넌트를 작성할 때 이 가이드를 참고하여 일관된 코드 품질을 유지하세요.

### 리팩토링 목표
- ✅ **재사용성**: 공통 로직을 유틸리티와 컴포넌트로 분리
- ✅ **일관성**: theme.css 변수를 사용하여 디자인 시스템 적용
- ✅ **유지보수성**: DRY 원칙을 따라 코드 중복 제거
- ✅ **확장성**: 다크모드 등 테마 변경에 즉시 대응 가능

---

## 유틸리티 함수 분리

### 원칙
여러 페이지에서 사용되는 포맷팅, 변환, 검증 로직은 `src/utils/` 폴더로 분리합니다.

### 예시: formatters.js

**위치**: `src/utils/formatters.js`

```javascript
/**
 * 날짜를 "yyyy-MM-dd hh:mm:ss" 형식으로 포맷
 */
export function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

/**
 * 숫자를 k 단위로 포맷
 */
export function formatCount(count) {
  if (count >= 100000) {
    return Math.floor(count / 1000) + 'k';
  } else if (count >= 10000) {
    return Math.floor(count / 1000) + 'k';
  } else if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'k';
  }
  return count.toString();
}

/**
 * 텍스트를 지정된 길이로 자르고 말줄임표 추가
 */
export function truncateText(text, maxLength = 26) {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + '...';
  }
  return text;
}
```

### 사용법

```javascript
import { formatDate, formatCount, truncateText } from '../../utils/formatters.js';

// 페이지나 컴포넌트에서 직접 사용
const formattedDate = formatDate(post.createdAt);
const formattedViews = formatCount(post.viewCount);
const shortTitle = truncateText(post.title, 26);
```

### 중복 제거 예시

**Before (중복 코드)**:
```javascript
// PostListPage.js
formatDate(dateString) { /* ... */ }
formatCount(count) { /* ... */ }

// PostDetailPage.js
formatDate(dateString) { /* ... */ }  // 중복!
formatCount(count) { /* ... */ }      // 중복!
```

**After (유틸리티 사용)**:
```javascript
// PostListPage.js
import { formatDate, formatCount } from '../../utils/formatters.js';

// PostDetailPage.js
import { formatDate, formatCount } from '../../utils/formatters.js';
```

---

## 컴포넌트 분리

### 원칙
재사용 가능한 UI 요소는 독립적인 컴포넌트로 분리합니다.

### 컴포넌트 구조

```
src/components/
├── ComponentName/
│   ├── index.js      # 컴포넌트 로직
│   └── style.css     # 컴포넌트 스타일
```

### 예시 1: LoadingSpinner 컴포넌트

**위치**: `src/components/LoadingSpinner/`

#### `index.js`
```javascript
import Component from '../../core/Component.js';

class LoadingSpinner extends Component {
  constructor(props) {
    super(props);
    this.loadStyle('/src/components/LoadingSpinner/style.css');
  }

  render() {
    const { show = true } = this.props;

    return `
      <div class="loading-spinner" style="display: ${show ? 'flex' : 'none'};">
        <div class="spinner"></div>
      </div>
    `;
  }
}

export default LoadingSpinner;
```

#### `style.css`
```css
.loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: var(--spacing-2xl);
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--color-border-secondary);
  border-top: 4px solid var(--color-primary);
  border-radius: var(--radius-full);
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
```

### 예시 2: PostCard 컴포넌트

**위치**: `src/components/PostCard/`

#### `index.js`
```javascript
import Component from '../../core/Component.js';
import { formatDate, formatCount, truncateText } from '../../utils/formatters.js';

class PostCard extends Component {
  constructor(props) {
    super(props);
    this.loadStyle('/src/components/PostCard/style.css');
  }

  render() {
    const { post } = this.props;

    if (!post) {
      return '<div></div>';
    }

    return `
      <div class="post-card" data-post-id="${post.id}">
        <div class="post-card-header">
          <h3 class="post-card-title">${truncateText(post.title, 26)}</h3>
          <span class="post-card-date">${formatDate(post.createdAt)}</span>
        </div>
        <div class="post-card-stats">
          <span class="post-card-stat">조회수 ${formatCount(post.viewCount)}</span>
          <span class="post-card-stat">댓글 ${formatCount(post.commentCount)}</span>
          <span class="post-card-stat">좋아요 ${formatCount(post.likeCount)}</span>
        </div>
        <div class="post-card-footer">
          ${post.authorProfileImage ?
            `<img src="${post.authorProfileImage}" alt="${post.author}" class="author-profile-image" />` :
            `<div class="author-profile-placeholder"></div>`
          }
          <span class="author-name">${post.author || '익명'}</span>
        </div>
      </div>
    `;
  }
}

export default PostCard;
```

### 컴포넌트 사용법

```javascript
import PostCard from '../../components/PostCard/index.js';
import LoadingSpinner from '../../components/LoadingSpinner/index.js';

class SomePage extends Component {
  render() {
    const loadingSpinner = new LoadingSpinner({ show: this.state.isLoading });

    return `
      <div class="container">
        ${this.state.posts.map(post => {
          const postCard = new PostCard({ post });
          return postCard.render();
        }).join('')}

        ${loadingSpinner.render()}
      </div>
    `;
  }
}
```

---

## Theme CSS 사용

### 원칙
**모든 색상, 여백, border-radius, shadow, transition은 theme.css의 CSS 변수를 사용합니다.**

### Theme CSS 변수 카테고리

#### 1. 색상 (Colors)

```css
/* Primary Colors */
--color-primary: #7F6AEE;
--color-primary-hover: #6B5ED6;
--color-primary-disabled: #ACA0EB;

/* Background Colors */
--color-background: #f5f5f5;
--color-background-white: #ffffff;
--color-background-secondary: #E9E9E9;
--color-background-tertiary: #D9D9D9;

/* Text Colors */
--color-text-primary: #333333;
--color-text-secondary: #666666;
--color-text-tertiary: #999999;
--color-text-white: #ffffff;

/* Border Colors */
--color-border-primary: #e0e0e0;
--color-border-secondary: #f0f0f0;
--color-border-tertiary: #c0c0c0;

/* Semantic Colors */
--color-error: #ff4444;
--color-success: #4caf50;
--color-warning: #ff9800;
--color-info: #2196f3;
```

#### 2. 여백 (Spacing)

```css
--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 16px;
--spacing-lg: 24px;
--spacing-xl: 32px;
--spacing-2xl: 40px;
--spacing-3xl: 48px;
```

#### 3. Border Radius

```css
--radius-sm: 4px;
--radius-md: 6px;
--radius-lg: 8px;
--radius-xl: 12px;
--radius-full: 50%;
```

#### 4. Shadow

```css
--shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.08);
--shadow-md: 0 2px 8px rgba(0, 0, 0, 0.08);
--shadow-lg: 0 4px 12px rgba(0, 0, 0, 0.12);
--shadow-xl: 0 4px 16px rgba(0, 0, 0, 0.2);
```

#### 5. Transition

```css
--transition-fast: 0.2s ease;
--transition-normal: 0.3s ease;
--transition-slow: 0.4s ease;
```

### 변환 예시

**❌ Before (하드코딩)**:
```css
.button {
  background-color: #ACA0EB;
  color: white;
  padding: 12px 40px;
  border-radius: 8px;
  transition: background-color 0.3s ease;
}

.button:hover {
  background-color: #7F6AEE;
}

.card {
  background-color: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  color: #333;
}
```

**✅ After (theme.css 변수 사용)**:
```css
.button {
  background-color: var(--color-primary-disabled);
  color: var(--color-text-white);
  padding: var(--spacing-sm) var(--spacing-2xl);
  border-radius: var(--radius-lg);
  transition: background-color var(--transition-normal);
}

.button:hover {
  background-color: var(--color-primary);
}

.card {
  background-color: var(--color-background-white);
  border-radius: var(--radius-xl);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-sm);
  color: var(--color-text-primary);
}
```

### 빠른 변환 참조표

| 하드코딩 값 | Theme 변수 |
|------------|-----------|
| `#7F6AEE` | `var(--color-primary)` |
| `#ACA0EB` | `var(--color-primary-disabled)` |
| `#333` / `#333333` | `var(--color-text-primary)` |
| `#666` / `#666666` | `var(--color-text-secondary)` |
| `#999` / `#999999` | `var(--color-text-tertiary)` |
| `#e0e0e0` | `var(--color-border-primary)` |
| `#f0f0f0` | `var(--color-border-secondary)` |
| `white` / `#ffffff` | `var(--color-background-white)` 또는 `var(--color-text-white)` |
| `#f5f5f5` | `var(--color-background)` |
| `4px` | `var(--spacing-xs)` |
| `8px` | `var(--spacing-sm)` |
| `16px` | `var(--spacing-md)` |
| `24px` | `var(--spacing-lg)` |
| `32px` | `var(--spacing-xl)` |
| `40px` | `var(--spacing-2xl)` |
| `48px` | `var(--spacing-3xl)` |
| `border-radius: 4px` | `var(--radius-sm)` |
| `border-radius: 8px` | `var(--radius-lg)` |
| `border-radius: 12px` | `var(--radius-xl)` |
| `border-radius: 50%` | `var(--radius-full)` |
| `0.2s ease` | `var(--transition-fast)` |
| `0.3s ease` | `var(--transition-normal)` |

---

## 적용 체크리스트

다른 페이지를 리팩토링할 때 아래 체크리스트를 따르세요.

### 1. 유틸리티 함수 분리 체크

- [ ] 페이지/컴포넌트 내부에 포맷팅 함수가 있는가? (`formatDate`, `formatCount` 등)
- [ ] 다른 페이지에서도 사용할 가능성이 있는가?
- [ ] ✅ Yes → `src/utils/`로 분리 후 import
- [ ] ❌ No → 페이지 내부에 유지

### 2. 컴포넌트 분리 체크

- [ ] 반복되는 UI 패턴이 있는가? (카드, 버튼, 모달 등)
- [ ] 다른 페이지에서도 재사용할 가능성이 있는가?
- [ ] HTML/CSS 코드가 50줄 이상인가?
- [ ] ✅ Yes → `src/components/`로 분리
- [ ] ❌ No → 페이지 내부에 유지

**컴포넌트 분리 시 필수 작업**:
```javascript
// 1. 컴포넌트에서 자체적으로 스타일 로드
class MyComponent extends Component {
  constructor(props) {
    super(props);
    this.loadStyle('/src/components/MyComponent/style.css');
  }
}

// 2. 페이지에서는 컴포넌트 import만
import MyComponent from '../../components/MyComponent/index.js';

// 3. 페이지 스타일 로드에서 컴포넌트 CSS 제거
this.loadStyle('/src/pages/MyPage/style.css');
// ❌ this.loadStyle('/src/components/MyComponent/style.css'); // 불필요!
```

### 3. Theme CSS 적용 체크

- [ ] CSS 파일에 하드코딩된 색상값이 있는가? (`#7F6AEE`, `#333` 등)
- [ ] 하드코딩된 여백/크기 값이 있는가? (`16px`, `24px` 등)
- [ ] 하드코딩된 `border-radius`, `box-shadow`, `transition`이 있는가?
- [ ] ✅ Yes → theme.css 변수로 변경

**자동 검색 명령어** (VSCode):
```regex
검색: #[0-9a-fA-F]{3,6}|rgba?\([^)]+\)
설명: 모든 하드코딩된 색상 찾기
```

### 4. 데이터 모델 체크

- [ ] 디자인에 표시해야 하는 데이터가 모두 포함되어 있는가?
- [ ] 더미 데이터에 작성자 정보, 프로필 이미지 등이 누락되지 않았는가?
- [ ] ✅ 확인 완료 → 다음 단계
- [ ] ❌ 누락됨 → 데이터 모델 수정

### 5. 코드 품질 체크

- [ ] DRY 원칙: 중복 코드가 없는가?
- [ ] SRP 원칙: 각 함수/컴포넌트가 단일 책임만 가지는가?
- [ ] 주석: JSDoc 스타일로 함수 설명이 작성되어 있는가?
- [ ] 네이밍: 변수명/함수명이 명확한가?

---

## 리팩토링 실전 예시

### Before: PostListPage (리팩토링 전)

```javascript
class PostListPage extends Component {
  // ❌ 중복: PostDetailPage에도 같은 함수 존재
  formatDate(dateString) {
    const date = new Date(dateString);
    // ... 포맷팅 로직
  }

  formatCount(count) {
    if (count >= 100000) return Math.floor(count / 1000) + 'k';
    // ...
  }

  render() {
    return `
      <div class="main-container">
        ${this.state.posts.map(post => `
          <!-- ❌ 재사용 가능한데 인라인 HTML -->
          <div class="post-card" data-post-id="${post.id}">
            <h3>${post.title}</h3>
            <span>${this.formatDate(post.createdAt)}</span>
          </div>
        `).join('')}

        <!-- ❌ 재사용 가능한데 인라인 HTML -->
        <div class="loading-spinner">
          <div class="spinner"></div>
        </div>
      </div>
    `;
  }
}
```

**CSS (style.css)**:
```css
/* ❌ 하드코딩된 색상/값 */
.post-card {
  background-color: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.post-card-title {
  color: #333;
}

.post-card-date {
  color: #999;
}
```

### After: PostListPage (리팩토링 후)

```javascript
import Component from '../../core/Component.js';
import PostCard from '../../components/PostCard/index.js';
import LoadingSpinner from '../../components/LoadingSpinner/index.js';

class PostListPage extends Component {
  constructor(props) {
    super(props);
    this.loadStyle('/src/pages/PostListPage/style.css');
    // ✅ 컴포넌트가 자체 스타일 로드하므로 불필요
  }

  render() {
    const loadingSpinner = new LoadingSpinner({ show: this.state.isLoading });

    return `
      <div class="main-container">
        ${this.renderPosts()}
        ${loadingSpinner.render()}
      </div>
    `;
  }

  renderPosts() {
    return this.state.posts.map(post => {
      const postCard = new PostCard({ post });
      return postCard.render();
    }).join('');
  }
}
```

**CSS (style.css)**:
```css
/* ✅ theme.css 변수 사용 */
.welcome-section {
  text-align: center;
  margin-bottom: var(--spacing-3xl);
}

.create-post-btn {
  background-color: var(--color-primary-disabled);
  color: var(--color-text-white);
  padding: var(--spacing-sm) var(--spacing-2xl);
  border-radius: var(--radius-lg);
  transition: background-color var(--transition-normal);
}

.create-post-btn:hover {
  background-color: var(--color-primary);
}
```

---

## 다음 단계

이 가이드를 기반으로 다른 페이지들도 순차적으로 리팩토링하세요:

1. **PostDetailPage**: PostListPage와 유사한 패턴 적용
2. **PostCreatePage**: Form 컴포넌트 분리 가능성 검토
3. **LoginPage**: Input 컴포넌트, Button 컴포넌트 분리
4. 기타 페이지들...

---

## 참고 자료

- **Theme CSS 정의**: `src/styles/theme.css`
- **유틸리티 함수**: `src/utils/formatters.js`
- **기존 컴포넌트**: `src/components/`
- **리팩토링 완료 예시**: `src/pages/PostListPage/`

---

**작성일**: 2025-11-09
**최종 수정일**: 2025-11-09
**작성자**: DevOps Team
