# Blog Detail Page Analysis (Tech Blog Detail)

## Overview
Clean, content-focused blog post detail page with like button, recommended posts, and enhanced comment section.

**Reference**: `new_design/tech-blog-detail/`

---

## Layout Structure

```
┌──────────────────────────────────────────────────────┐
│               Header (Same as blog list)              │
├──────────────────────────────────────────────────────┤
│                                                       │
│           ┌──────────────────────┐                   │
│           │   Post Header        │                   │
│           │   (Category, Title)  │                   │
│           │   Author, Date       │                   │
│           │   [❤ Like Button]    │                   │
│           ├──────────────────────┤                   │
│           │   Thumbnail Image    │                   │
│           ├──────────────────────┤                   │
│           │                      │                   │
│           │   Post Content       │                   │
│           │   (Markdown)         │                   │
│           │                      │                   │
│           └──────────────────────┘                   │
│                                                       │
│           ┌──────────────────────┐                   │
│           │  Recommended Posts   │                   │
│           │  (3 cards grid)      │                   │
│           └──────────────────────┘                   │
│                                                       │
│           ┌──────────────────────┐                   │
│           │  Comments Section    │                   │
│           │  - Write comment     │                   │
│           │  - Comment list      │                   │
│           └──────────────────────┘                   │
│                                                       │
└──────────────────────────────────────────────────────┘
```

### Key Layout Specifications
- **Container**: Max-width 800px (article content width)
- **Padding**: 60px 40px
- **Header**: Same sticky header as blog list
- **No Sidebar**: Full focus on content

---

## Component Breakdown

### 1. Post Header Section
**Container Specifications**:
- Margin-bottom: 40px
- Padding-bottom: 32px
- Border-bottom: 1px solid #e5e5e5

**Category**:
- Font-size: 14px
- Color: #667eea (accent color!)
- Font-weight: 500
- Margin-bottom: 16px

**Title**:
- Font-size: 42px
- Font-weight: 700
- Color: #000
- Line-height: 1.3
- Margin-bottom: 24px

**Meta Information**:
- Display: flex, gap 12px
- Font-size: 14px
- Color: #666
- Margin-bottom: 20px
- Divider: | (color #ddd)
- Format: "Author | Date"

### 2. Like Button (NEW)
**Component to Create**:
```
src/components/LikeButton/
├── index.js
└── style.css
```

**Specifications**:
- Display: flex, gap 6px
- Padding: 8px 16px
- Border: 1px solid #e5e5e5
- Background: #ffffff
- Border-radius: 20px (pill shape)
- Font-size: 14px
- Color: #666
- Cursor: pointer
- Transition: all 0.2s ease

**Icon**:
- SVG heart (20×20)
- Stroke only (not filled) by default
- Stroke-width: 1.5

**States**:
```css
.like-btn:hover {
  border-color: #667eea;
  color: #667eea;
}

.like-btn.liked {
  border-color: #667eea;
  background-color: #667eea;
  color: white;
}

.like-btn.liked svg path {
  fill: white;
}
```

**Interaction**:
```javascript
async function toggleLike() {
  const isLiked = likeBtn.classList.contains('liked');

  try {
    await api.toggleLike(postId);

    if (isLiked) {
      likeBtn.classList.remove('liked');
      likeCount.textContent = parseInt(likeCount.textContent) - 1;
    } else {
      likeBtn.classList.add('liked');
      likeCount.textContent = parseInt(likeCount.textContent) + 1;
    }
  } catch (error) {
    showToast('좋아요 처리에 실패했습니다');
  }
}
```

### 3. Post Thumbnail
**Specifications**:
- Width: 100%
- Height: auto
- Border-radius: 12px
- Margin-bottom: 40px
- Overflow: hidden
- Image: display block, width 100%

### 4. Post Content Area
**Content Typography**:
```css
.post-content {
  font-size: 17px;
  line-height: 1.8;
  color: #333;
}

.post-content p {
  margin-bottom: 24px;
}

.post-content h2 {
  font-size: 32px;
  font-weight: 700;
  margin: 48px 0 24px;
  color: #000;
}

.post-content h3 {
  font-size: 24px;
  font-weight: 600;
  margin: 36px 0 20px;
  color: #000;
}

.post-content ol,
.post-content ul {
  margin: 24px 0;
  padding-left: 28px;
}

.post-content li {
  margin-bottom: 12px;
}

.post-content pre {
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 20px;
  overflow-x: auto;
  margin: 24px 0;
}

.post-content code {
  font-family: 'Monaco', 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.6;
  color: #333;
}

.post-image {
  margin: 32px 0;
  text-align: center;
}

.post-image img {
  max-width: 100%;
  border-radius: 8px;
}
```

### 5. Recommended Posts Section (NEW)
**Component to Create**:
```
src/components/RecommendedPosts/
├── index.js
└── style.css
```

**Container Specifications**:
- Margin-bottom: 80px

**Title**:
- Font-size: 24px
- Font-weight: 700
- Color: #000
- Margin-bottom: 24px

**Grid Layout**:
- Display: grid
- Grid-template-columns: repeat(3, 1fr)
- Gap: 20px

**Card Specifications**:
- Background: #fafafa
- Border-radius: 12px
- Padding: 20px
- Cursor: pointer
- Transition: all 0.2s ease
- Hover: background #f0f0f0, translateY(-2px)

**Card Content**:
- **Category**: 11px, #999, uppercase
- **Title**: 15px, 600 weight, #333, 2-line clamp
- **Meta**: 12px, #999 (date)

### 6. Comments Section (UPDATED)
**Section Container**:
- Padding-top: 40px
- Border-top: 2px solid #e5e5e5

**Header**:
- Display: flex, justify-between
- Margin-bottom: 32px

**Title**: "댓글 23개"
- Font-size: 24px
- Font-weight: 700
- Color: #000

**Sort Dropdown**:
- Display: flex, gap 12px, align-center
- Label: "정렬 기준", 14px, #666
- Select: padding 8px 12px, border 1px #e5e5e5, border-radius 6px

**Sort Options**:
1. 날짜 오름차순 (latest)
2. 날짜 내림차순 (oldest)
3. 좋아요순 (likes)

### 7. Comment Write Component (UPDATED)
**Container**:
- Display: flex, gap 16px
- Background: #fafafa
- Padding: 24px
- Border-radius: 12px
- Margin-bottom: 40px

**Avatar**:
- Size: 48px × 48px circle
- Border-radius: 50%
- Flex-shrink: 0

**Textarea**:
- Width: 100%
- Padding: 12px 16px
- Border: 1px solid #e5e5e5
- Border-radius: 8px
- Font-size: 15px
- Resize: vertical
- Rows: 3
- Background: white
- Focus border-color: #667eea

**Submit Button**:
- Padding: 10px 24px
- Background: #667eea
- Color: white
- Border-radius: 6px
- Font-size: 14px
- Font-weight: 600
- Margin-top: 12px
- Float: right

### 8. Comment List
**Container**:
- Display: flex column, gap 24px

**Comment Item**:
- Display: flex, gap 16px
- Padding-bottom: 24px
- Border-bottom: 1px solid #f0f0f0
- Last-child: no border, no padding-bottom

**Comment Structure**:
```
┌──────┬─────────────────────────────┐
│Avatar│ Author      2시간 전        │
│ 48px │ Comment text...             │
│      │ [❤ 좋아요 5] [답글]         │
└──────┴─────────────────────────────┘
```

**Comment Header**:
- Author: 14px, 600 weight, #333
- Date: 13px, #999
- Gap: 12px

**Comment Text**:
- Font-size: 15px
- Color: #333
- Line-height: 1.6
- White-space: pre-wrap
- Margin-bottom: 12px

**Comment Actions**:
- Display: flex, gap 16px

**Action Button**:
- Display: flex, gap 4px
- Padding: 4px 0
- Background: none
- Border: none
- Color: #666
- Font-size: 13px
- Cursor: pointer
- Hover color: #667eea
- Liked state color: #667eea

---

## Design Patterns

### Color Scheme
```css
Background: #ffffff, #fafafa, #f0f0f0
Text Primary: #000
Text Secondary: #666, #999
Border: #e5e5e5, #f0f0f0
Accent: #667eea
Error: #f44336
Success: #4caf50
```

### Typography
```css
Post Title: 42px / 700
Post Category: 14px / 500
Post Content: 17px / 1.8
H2: 32px / 700
H3: 24px / 600
Code: 14px / 1.6 monospace
Section Title: 24px / 700
Recommended Title: 15px / 600
Comment Author: 14px / 600
Comment Text: 15px / 1.6
```

### Spacing
```css
Container max-width: 800px
Padding: 60px 40px
Post header margin-bottom: 40px
Content paragraph spacing: 24px
Section spacing: 80px
Comment gap: 24px
```

---

## API Integration

### Get Post Detail
```javascript
GET /posts/:id
Response:
{
  "id": 1,
  "title": "Post Title",
  "category": "Category Name",
  "author": "Author Name",
  "createdAt": "2024-01-17T00:00:00Z",
  "content": "# Markdown content...",
  "thumbnail": "https://...",
  "likes": 29,
  "isLiked": false,
  "views": 1234
}
```

### Toggle Like
```javascript
POST /posts/:id/like
Response:
{
  "liked": true,
  "likes": 30
}
```

### Get Recommended Posts
```javascript
GET /posts/:id/recommended?limit=3
Response:
{
  "posts": [
    {
      "id": 2,
      "title": "Recommended Post Title",
      "category": "Category",
      "createdAt": "2024-01-15T00:00:00Z"
    }
  ]
}
```

### Get Comments
```javascript
GET /posts/:id/comments?sort=latest
Response:
{
  "comments": [
    {
      "id": 1,
      "author": "Author Name",
      "avatar": "https://...",
      "content": "Comment text...",
      "createdAt": "2024-01-17T10:00:00Z",
      "likes": 5,
      "isLiked": false,
      "replies": []
    }
  ],
  "total": 23
}
```

### Create Comment
```javascript
POST /posts/:id/comments
Request:
{
  "content": "Comment text..."
}
Response:
{
  "id": 2,
  "author": "Current User",
  "avatar": "https://...",
  "content": "Comment text...",
  "createdAt": "2024-01-17T11:00:00Z",
  "likes": 0,
  "isLiked": false
}
```

### Toggle Comment Like
```javascript
POST /comments/:id/like
Response:
{
  "liked": true,
  "likes": 6
}
```

---

## State Management

### Component State
```javascript
{
  post: null,
  recommendedPosts: [],
  comments: [],
  commentSort: 'latest',
  newComment: '',
  loading: false,
  error: null
}
```

---

## Migration Tasks

### Phase 1: Create New Components
1. Create `LikeButton` component
2. Create `RecommendedPosts` component
3. Update `CommentSection` with new design
4. Update `CommentItem` with like button
5. Update `CommentInput` with new design

### Phase 2: Update Page
1. Redesign `PostDetailPage` layout
2. Add like button to post header
3. Add recommended posts section
4. Update comment section with sort
5. Implement markdown rendering

### Phase 3: API Integration
1. Add like endpoints
2. Add recommended posts endpoint
3. Update comments API with sort
4. Add comment like endpoint

### Phase 4: Styling
1. Apply content typography
2. Style code blocks
3. Style recommended cards
4. Update comment styles
5. Add smooth transitions

---

## Responsive Design

### Tablet (< 1024px)
- Recommended grid: 2 columns

### Mobile (< 768px)
- Container padding: 40px 20px
- Post title: 32px
- Post content: 16px
- H2: 26px
- H3: 20px
- Recommended grid: 1 column
- Comment write padding: 16px

---

## Accessibility

- Semantic article structure
- Proper heading hierarchy (h1 → h2 → h3)
- Alt text on images
- ARIA labels on buttons (like, reply)
- Focus states
- Keyboard navigation

---

## Key Differences from Current Design

| Aspect | Current | New Design |
|--------|---------|------------|
| Post Title Size | Smaller | **42px (large)** |
| Like Button | None | **Heart button with count** |
| Recommended Posts | None | **3-card grid** |
| Comment Section | Basic | **Sortable with enhanced UI** |
| Comment Like | None | **Like button per comment** |
| Content Typography | Standard | **Larger (17px), better spacing** |
| Code Blocks | Basic | **Styled with monospace** |
| Max Width | 700px | **800px** |

---

## Notes

- **Content-Focused**: Clean design, minimal distraction
- **Larger Typography**: 17px body, 42px title for readability
- **Like Feature**: Adds engagement, simple toggle
- **Recommended Posts**: Increases discoverability
- **Comment Sorting**: Useful for popular posts
- **Markdown Support**: Full markdown rendering required
- **Performance**: Lazy load images, optimize markdown parsing
- **Real-time Updates**: Consider WebSocket for live comments (optional)
