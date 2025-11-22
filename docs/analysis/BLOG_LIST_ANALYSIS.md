# Blog List Page Analysis (Tech Blog)

## Overview
Professional tech blog list page inspired by NAVER D2, featuring sidebar with TOP 5 posts, keywords, and newsletter subscription.

**Reference**: `new_design/tech-blog/`

---

## Layout Structure

```
┌──────────────────────────────────────────────────────┐
│               Header (NAVER D² + Nav + Search)        │
├─────────────────────┬────────────────────────────────┤
│                     │                                 │
│   Main Content      │       Sidebar (280px)          │
│   (800px max)       │                                 │
│                     │   ┌─────────────────┐          │
│   ┌───────────┐     │   │    TOP 5        │          │
│   │  Post 1   │     │   └─────────────────┘          │
│   ├───────────┤     │   ┌─────────────────┐          │
│   │  Post 2   │     │   │  TOP KEYWORDS   │          │
│   ├───────────┤     │   └─────────────────┘          │
│   │  Post 3   │     │   ┌─────────────────┐          │
│   └───────────┘     │   │   Newsletter    │          │
│                     │   └─────────────────┘          │
│   [Pagination]      │                                 │
│                     │                                 │
└─────────────────────┴────────────────────────────────┘
```

### Key Layout Specifications
- **Container**: Max-width 1200px (main content 800px + sidebar 280px + gap 40px)
- **Grid**: 2-column grid (1fr 280px)
- **Gap**: 40px
- **Padding**: 40px on sides
- **Header**: Sticky, height 72px

---

## Component Breakdown

### 1. Header Component (MAJOR UPDATE)
**Complete redesign from simple header**

**Layout**:
```
┌────────┬──────────────────────┬──────────────┐
│ NAVER  │  Hello world         │   Search     │
│   D²   │  D2 News             │   [ D2에서  ]│
│        │  About D2            │   검색      │
└────────┴──────────────────────┴──────────────┘
```

**Component Structure**:
```
Header
├── Logo Section (NAVER D²)
├── Navigation Menu
└── Search Section
```

**Logo Specifications**:
- Font-size: 28px
- Font-weight: 700
- "NAVER" + "D²" separated with gap 4px
- Both parts: color #000

**Navigation Specifications**:
- Display: flex, gap 40px
- Margin-left: 60px (from logo)
- Link font-size: 16px
- Link color: #666 (default), #000 (hover)
- Font-weight: 400

**Search Section Specifications**:
- Background: #f5f5f5
- Border-radius: 24px (pill shape)
- Padding: 8px 16px
- Width: 280px
- Input: transparent background, no border
- Icon: 20×20, color #666

**Sticky Header**:
```css
.header {
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: #ffffff;
  border-bottom: 1px solid #e5e5e5;
}
```

### 2. Post List Section
**Container**: Flex column, gap 24px

**Component to Create**:
```
src/components/BlogCard/
├── index.js
└── style.css
```

**Post Item Layout**:
```
┌──────────────────────────┬─────────────┐
│ CATEGORY                 │             │
│ Title (large, bold)      │   Gradient  │
│ Excerpt (2 lines)        │   Thumbnail │
│ Author · Date · Views    │   180×120   │
└──────────────────────────┴─────────────┘
```

**Grid Specifications**:
- Display: grid
- Grid-template-columns: 1fr 180px
- Gap: 24px
- Padding-bottom: 24px
- Border-bottom: 1px solid #e5e5e5
- Cursor: pointer
- Hover: opacity 0.8

**Category**:
- Font-size: 11px
- Color: #666
- Text-transform: uppercase
- Letter-spacing: 0.5px
- Margin-bottom: 8px

**Title**:
- Font-size: 18px
- Font-weight: 700
- Color: #000
- Line-height: 1.4
- Margin-bottom: 10px

**Excerpt**:
- Font-size: 13px
- Color: #666
- Line-height: 1.5
- Margin-bottom: 10px
- Display: -webkit-box
- -webkit-line-clamp: 2
- Overflow: hidden

**Meta**:
- Font-size: 12px
- Color: #999
- Gap: 6px
- Divider: · (color #ddd)

**Thumbnail**:
- Size: 180px × 120px
- Border-radius: 8px
- Background: Gradient
- Display: flex, center aligned
- Color: white
- Font-size: 14px, weight 600
- Flex-shrink: 0

**Gradient Variants**:
```css
.gradient-1 { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.gradient-2 { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
.gradient-3 { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
.gradient-4 { background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); }
```

### 3. Sidebar Container
**Component to Create**:
```
src/components/Sidebar/
├── index.js
└── style.css
```

**Specifications**:
- Width: 280px (fixed)
- Display: flex column
- Gap: 20px

### 4. TOP 5 Section (NEW)
**Component to Create**:
```
src/components/TopPostsList/
├── index.js
└── style.css
```

**Container Specifications**:
- Background: #fafafa
- Padding: 16px
- Border-radius: 8px

**Title**:
- Font-size: 14px
- Font-weight: 700
- Color: #000
- Margin-bottom: 12px

**List**:
- Ordered list with CSS counter
- List-style: none
- Counter-reset: top-counter

**List Item**:
- Padding: 8px 0 8px 24px (left padding for number)
- Border-bottom: 1px solid #e5e5e5
- Position: relative

**Number Display** (using CSS ::before):
```css
.top-item::before {
  content: counter(top-counter);
  counter-increment: top-counter;
  position: absolute;
  left: 0;
  font-size: 12px;
  font-weight: 700;
  color: #999;
}
```

**Link**:
- Font-size: 12px
- Color: #333
- Line-height: 1.4
- Hover color: #667eea

### 5. TOP KEYWORDS Section (NEW)
**Component to Create**:
```
src/components/KeywordCloud/
├── index.js
└── style.css
```

**Container Specifications**:
- Background: #fafafa
- Padding: 16px
- Border-radius: 8px

**Tags Container**:
- Display: flex
- Flex-wrap: wrap
- Gap: 6px

**Keyword Tag**:
- Background: #ffffff
- Color: #666
- Padding: 5px 12px
- Border-radius: 14px (pill)
- Font-size: 11px
- Border: 1px solid #e5e5e5
- Cursor: pointer
- Hover: background #667eea, color white, border #667eea

### 6. Newsletter Section (NEW)
**Component to Create**:
```
src/components/NewsletterSubscribe/
├── index.js
└── style.css
```

**Container Specifications**:
- Background: #fafafa
- Padding: 16px
- Border-radius: 8px
- Text-align: center
- Flex column, center aligned

**Icon**:
- Size: 40px × 40px circle
- Background: #667eea
- Color: white
- SVG: 20×20 (mail icon)
- Margin-bottom: 12px

**Input**:
- Width: 100%
- Padding: 10px 12px
- Border: 1px solid #e5e5e5
- Border-radius: 6px
- Font-size: 12px
- Margin-bottom: 10px
- Placeholder: "D2의 새로운 소식 받기"

**Button**:
- Width: 100%
- Padding: 10px 20px
- Background: #667eea
- Color: white
- Border-radius: 6px
- Font-size: 12px
- Font-weight: 600

### 7. Pagination Component
**Complete redesign with new style**

**Container**:
- Display: flex, center aligned
- Gap: 8px
- Margin-top: 40px
- Padding-top: 24px
- Border-top: 1px solid #e5e5e5

**Nav Buttons (Prev/Next)**:
- Size: 36px × 36px circles
- Border: 1px solid #e5e5e5
- Background: #ffffff
- Color: #666
- SVG icon: 16×16
- Hover: border #667eea, background #667eea, color white
- Disabled: opacity 0.3

**Page Numbers**:
- Size: 36px × 36px
- Border: none
- Background: transparent
- Font-size: 14px
- Font-weight: 500
- Color: #666
- Hover: background #f5f5f5
- Active: background #d5d5e0, color #333, font-weight 600
- Border-radius: 50%

**Ellipsis** (...):
- Same size as page numbers
- Color: #999

### 8. Scroll to Top Button
**Specifications**:
- Position: fixed, bottom 40px, right 40px
- Size: 48px × 48px circle
- Background: #333
- Color: white
- SVG: 24×24 (arrow up)
- Opacity: 0 (hidden), 1 (visible when scrolled)
- Visibility: hidden/visible
- Transition: all 0.3s ease
- Box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15)
- Hover: background #000, translateY(-2px)

**Show/Hide Logic**:
```javascript
window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    scrollBtn.classList.add('visible');
  } else {
    scrollBtn.classList.remove('visible');
  }
});
```

---

## Design Patterns

### Color Scheme
```css
Background: #ffffff, #fafafa
Text Primary: #000
Text Secondary: #666
Text Tertiary: #999
Border: #e5e5e5, #ddd
Accent: #667eea
Gradients: Multiple colorful gradients (thumbnail only)
```

### Typography
```css
Logo: 28px / 700
Nav Link: 16px / 400
Page Title: 18px / 700
Excerpt: 13px / 400
Meta: 12px / 400
Sidebar Title: 14px / 700
Keyword: 11px / 400
Category: 11px / 400 uppercase
```

### Spacing
```css
Container max-width: 1200px
Content max-width: 800px
Sidebar width: 280px
Grid gap: 40px
Post gap: 24px
Sidebar section gap: 20px
```

---

## API Integration

### Get Posts
```javascript
GET /posts?page=1&limit=10
Response:
{
  "posts": [
    {
      "id": 1,
      "title": "Post Title",
      "excerpt": "Post excerpt...",
      "category": "Category Name",
      "author": "Author Name",
      "createdAt": "2024-01-17T00:00:00Z",
      "views": 1234,
      "thumbnail": "gradient-1"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "totalPosts": 100,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### Get TOP 5
```javascript
GET /posts/top?limit=5
Response:
{
  "posts": [
    {
      "id": 1,
      "title": "Top Post Title",
      "url": "/posts/1"
    }
  ]
}
```

### Get Keywords
```javascript
GET /keywords/top?limit=15
Response:
{
  "keywords": [
    {
      "name": "JavaScript",
      "count": 42
    }
  ]
}
```

### Newsletter Subscribe
```javascript
POST /newsletter/subscribe
Request:
{
  "email": "user@example.com"
}
Response:
{
  "message": "구독이 완료되었습니다"
}
```

---

## State Management

### Component State
```javascript
{
  posts: [],
  topPosts: [],
  keywords: [],
  pagination: {
    currentPage: 1,
    totalPages: 1
  },
  loading: false,
  error: null
}
```

---

## Migration Tasks

### Phase 1: Update Header
1. Completely redesign `Header` component
2. Add navigation menu
3. Add search section
4. Make header sticky

### Phase 2: Create Sidebar Components
1. Create `Sidebar` container component
2. Create `TopPostsList` component
3. Create `KeywordCloud` component
4. Create `NewsletterSubscribe` component

### Phase 3: Update Main Content
1. Replace `PostCard` with new `BlogCard` design
2. Update pagination design
3. Add scroll-to-top button
4. Implement 2-column grid layout

### Phase 4: API Integration
1. Add TOP posts endpoint
2. Add keywords endpoint
3. Add newsletter endpoint
4. Update posts endpoint for new fields

---

## Responsive Design

### Tablet (< 1024px)
- Grid: 1 column (sidebar hidden)
- Post item: 1 column (thumbnail full width, height 140px)

### Mobile (< 768px)
- Header: Logo smaller (24px), nav hidden, search smaller (200px)
- Header height: 64px
- Padding: 30px 20px
- Post title: 16px
- Post excerpt: 12px
- Thumbnail: Full width, 120px height
- Scroll button: 40px bottom, 40px right

---

## Accessibility

- Semantic HTML (header, nav, main, aside, section)
- ARIA labels on search button
- Keyboard navigation
- Focus states on all interactive elements
- Alt text on images (when real images used)

---

## Key Differences from Current Design

| Aspect | Current | New Design |
|--------|---------|------------|
| Layout | Single column | **2-column with sidebar** |
| Header | Simple | **Full nav + search** |
| Post Card | Basic | **Professional D2-style** |
| Thumbnail | None/basic | **Colorful gradients** |
| Sidebar | None | **TOP 5 + Keywords + Newsletter** |
| Max Width | 700px | **1200px (800px + 280px)** |
| Pagination | Basic | **Circular buttons with numbers** |
| Scroll Button | None | **Floating circle button** |

---

## Notes

- **D2-Inspired**: This is the primary "Tech-Blog Design" reference
- **Clean & Professional**: Minimal decoration, focus on content
- **Colorful Gradients**: Only on thumbnails, rest is achromatic
- **Sticky Header**: Enhances navigation experience
- **Sidebar Value**: TOP 5 and Keywords add discoverability
- **Newsletter**: Simple subscription form, no popup
- **Pagination**: Full number display with ellipsis
- **Performance**: Lazy load images, infinite scroll optional
