# Profile Page Analysis

## Overview
Professional profile page with statistics, categories, tags, and post listings. Includes dark mode toggle (UI only).

**Reference**: `new_design/profile/`

---

## Layout Structure

```
┌──────────────────────────────────────────────────────┐
│      Header (Logo + Nav + Search + Dark Mode)        │
├────────────────────┬─────────────────────────────────┤
│                    │                                  │
│  Sidebar (350px)   │    Main Content                 │
│                    │                                  │
│  ┌──────────────┐  │  ┌────────────────────┐        │
│  │ Profile Card │  │  │ Posts Header       │        │
│  │  - Avatar    │  │  │ - Sort Options     │        │
│  │  - Name      │  │  ├────────────────────┤        │
│  │  - Bio       │  │  │ Post Card 1        │        │
│  │  - Stats     │  │  │ Post Card 2        │        │
│  │  - Edit Btn  │  │  │ Post Card 3        │        │
│  └──────────────┘  │  └────────────────────┘        │
│                    │  [Pagination]                   │
│  ┌──────────────┐  │                                  │
│  │ Categories   │  │                                  │
│  └──────────────┘  │                                  │
│                    │                                  │
│  ┌──────────────┐  │                                  │
│  │ Tags         │  │                                  │
│  └──────────────┘  │                                  │
│                    │                                  │
│  ┌──────────────┐  │                                  │
│  │ Recent Posts │  │                                  │
│  └──────────────┘  │                                  │
│                    │                                  │
├────────────────────┴─────────────────────────────────┤
│                    Footer                             │
└──────────────────────────────────────────────────────┘
```

### Key Layout Specifications
- **Container**: Max-width 1200px
- **Grid**: 350px (sidebar) + 1fr (main)
- **Gap**: 40px
- **Padding**: 40px on sides
- **Dark Mode**: CSS variables ready (not activated by default)

---

## Component Breakdown

### 1. Header Updates
**New Elements**:
- Logo: "Tech Blog" (instead of "NAVER D²")
- Navigation: Home, Posts, About Me, Tags, Contact
- Search section (same as blog list)
- **Dark Mode Toggle Button** (NEW)

**Dark Mode Toggle**:
- Size: 40px × 40px circle
- Background: var(--bg-secondary)
- Border-radius: 50%
- Icon: Sun (default), Moon (when dark)
- Color: var(--text-secondary)
- Hover: background var(--border-color)

**Dark Mode Logic** (UI only, no functionality):
```javascript
toggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  toggleIcon(); // swap sun/moon
});
```

### 2. Profile Card (NEW)
**Component to Create**:
```
src/components/ProfileCard/
├── index.js
└── style.css
```

**Container Specifications**:
- Background: var(--bg-card)
- Padding: 32px 24px
- Border-radius: 16px
- Text-align: center
- Box-shadow: var(--shadow-sm)

**Profile Image**:
- Size: 160px × 160px circle
- Border-radius: 50%
- Border: 4px solid var(--bg-primary)
- Box-shadow: var(--shadow-md)
- Margin-bottom: 20px
- Overflow: hidden
- Object-fit: cover

**Profile Name**:
- Font-size: 24px
- Font-weight: 700
- Color: var(--text-primary)
- Margin-bottom: 8px

**Profile Handle** (subtitle/description):
- Font-size: 14px
- Color: var(--text-secondary)
- Margin-bottom: 16px

**Profile Bio** (optional):
- Font-size: 14px
- Color: var(--text-secondary)
- Line-height: 1.6
- Margin-bottom: 20px

### 3. Profile Stats (NEW)
**Layout**:
```
┌──────┬──────┬──────┐
│ 315  │  1   │  0   │
│ 작성 │ 리뷰 │ 댓글 │
└──────┴──────┴──────┘
```

**Container**:
- Display: grid
- Grid-template-columns: repeat(3, 1fr)
- Gap: 16px
- Width: 100%
- Padding: 20px 0
- Border-top: 1px solid var(--border-color)
- Border-bottom: 1px solid var(--border-color)
- Margin-bottom: 20px

**Stat Item**:
- Display: flex column, center aligned

**Stat Number**:
- Font-size: 24px
- Font-weight: 700
- Color: var(--text-primary)
- Margin-bottom: 4px

**Stat Label**:
- Font-size: 12px
- Color: var(--text-secondary)

### 4. Edit Profile Button
**Specifications**:
- Width: 100%
- Padding: 12px 20px
- Background: var(--bg-secondary)
- Color: var(--text-primary)
- Border: 1px solid var(--border-color)
- Border-radius: 8px
- Font-size: 14px
- Font-weight: 600
- Display: flex, center, gap 8px
- SVG edit icon: 16×16
- Show only for own profile (display: none for others)

### 5. Categories Section (NEW)
**Component to Create**:
```
src/components/CategoryList/
├── index.js
└── style.css
```

**Container**:
- Background: var(--bg-card)
- Padding: 20px
- Border-radius: 12px
- Box-shadow: var(--shadow-sm)

**Title**:
- Font-size: 14px
- Font-weight: 700
- Color: var(--text-primary)
- Margin-bottom: 16px

**Category Item**:
- Padding: 8px 0
- Cursor: pointer

**Category Link**:
- Display: flex, gap 8px
- Font-size: 14px
- Color: var(--text-secondary)
- Hover color: var(--accent-color)

**Category Count**:
- Font-size: 12px
- Color: var(--text-tertiary)
- Margin-left: auto

### 6. Tags Section (Reuse from Blog List)
**Same as KeywordCloud** from blog list, but:
- Title: "Tags" instead of "TOP KEYWORDS"
- No limit (show all user's tags)

### 7. Recent Posts Section (NEW)
**Container**:
- Background: var(--bg-card)
- Padding: 20px
- Border-radius: 12px
- Box-shadow: var(--shadow-sm)

**List**:
- List-style: none

**Recent Post Item**:
- Padding: 10px 0
- Border-bottom: 1px solid var(--border-color)
- Last-child: no border

**Link**:
- Font-size: 13px
- Color: var(--text-secondary)
- Line-height: 1.5
- Display: -webkit-box
- -webkit-line-clamp: 2
- Overflow: hidden
- Hover color: var(--accent-color)

### 8. Main Content: Posts Section
**Header**:
- Display: flex, justify-between
- Padding-bottom: 16px
- Border-bottom: 1px solid var(--border-color)
- Margin-bottom: 24px

**Title**: "Posts"
- Font-size: 24px
- Font-weight: 700

**Sort Options**:
- Display: flex, gap 8px

**Sort Button**:
- Padding: 8px 16px
- Background: transparent
- Color: var(--text-secondary)
- Border: 1px solid var(--border-color)
- Border-radius: 8px
- Font-size: 14px
- Font-weight: 500
- Cursor: pointer
- Active: background var(--accent-color), color white

**Options**:
1. 최신순 (latest) - with dropdown arrow icon
2. 인기순 (popular)
3. 조회순 (views)

### 9. Post Cards
**Different from blog list cards** - simpler, no thumbnail

**Container**: Flex column, gap 32px

**Post Card**:
- Cursor: pointer
- Hover: translateY(-2px)

**Card Content**:
- Title: 24px, 700 weight
- Date: 13px, var(--text-secondary)
- Excerpt: 15px, var(--text-secondary), 2-line clamp
- Tags: Same as blog list

**Card Divider**:
- Height: 1px
- Background: var(--border-color)
- Margin-top: 32px

### 10. Footer (NEW)
**Container**:
- Background: var(--bg-card)
- Border-top: 1px solid var(--border-color)
- Margin-top: 80px
- Padding: 32px 0

**Content**:
- Max-width: 1200px
- Margin: 0 auto
- Padding: 0 40px
- Display: flex, justify-between
- Font-size: 13px
- Color: var(--text-secondary)

**Left**: "© 2024, John Doe"
**Right**: "Next.js / Spring · RSS · Sitemap"

---

## CSS Variables System (Dark Mode Ready)

### Light Mode (Default)
```css
:root {
  --bg-primary: #ffffff;
  --bg-secondary: #f9fafb;
  --bg-card: #fafafa;
  --text-primary: #1f2937;
  --text-secondary: #6b7280;
  --text-tertiary: #9ca3af;
  --border-color: #e5e7eb;
  --accent-color: #667eea;
  --accent-hover: #5568d3;
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}
```

### Dark Mode (Prepared, not active by default)
```css
body.dark-mode {
  --bg-primary: #1f2937;
  --bg-secondary: #111827;
  --bg-card: #374151;
  --text-primary: #f9fafb;
  --text-secondary: #9ca3af;
  --text-tertiary: #6b7280;
  --border-color: #4b5563;
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.5);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.5);
}

body {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  transition: background-color 0.3s ease, color 0.3s ease;
}
```

---

## API Integration

### Get User Profile
```javascript
GET /users/:username
Response:
{
  "id": 1,
  "username": "johndoe",
  "nickname": "John Doe",
  "avatar": "https://...",
  "bio": "A passionate developer",
  "stats": {
    "posts": 315,
    "reviews": 1,
    "comments": 0
  },
  "categories": [
    { "name": "JavaScript", "count": 42 },
    { "name": "React", "count": 28 }
  ],
  "tags": [
    { "name": "TypeScript", "count": 15 },
    { "name": "Node.js", "count": 12 }
  ],
  "isOwner": true
}
```

### Get User Posts
```javascript
GET /users/:username/posts?sort=latest&page=1
Response:
{
  "posts": [
    {
      "id": 1,
      "title": "Post Title",
      "excerpt": "Excerpt...",
      "createdAt": "2024-01-17T00:00:00Z",
      "tags": ["JavaScript", "React"]
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 32
  }
}
```

### Get Recent Posts
```javascript
GET /users/:username/posts/recent?limit=5
Response:
{
  "posts": [
    {
      "id": 1,
      "title": "Recent Post Title"
    }
  ]
}
```

---

## State Management

```javascript
{
  user: null,
  posts: [],
  categories: [],
  tags: [],
  recentPosts: [],
  sortBy: 'latest',
  pagination: {
    currentPage: 1,
    totalPages: 1
  },
  loading: false
}
```

---

## Migration Tasks

### Phase 1: Create New Components
1. Create `ProfileCard` component
2. Create `CategoryList` component
3. Create `TagCloud` (reuse/adapt from blog list)
4. Update `Header` with dark mode toggle

### Phase 2: Update Page
1. Redesign `ProfilePage` with 2-column layout
2. Add statistics display
3. Add categories and tags sections
4. Add recent posts sidebar
5. Update post cards (no thumbnail version)

### Phase 3: Theme System
1. Define CSS variables in theme.css
2. Apply variables throughout components
3. Implement dark mode toggle (UI only)
4. Test both themes

### Phase 4: API Integration
1. Add user profile endpoint
2. Add user posts endpoint
3. Add categories/tags for user

---

## Responsive Design

### Tablet (< 1024px)
- Grid: 1 column
- Sidebar: Show first (order: -1)
- Categories, Tags, Recent Posts: Hidden (display: none)

### Mobile (< 768px)
- Profile image: 120px
- Profile name: 20px
- Stat number: 20px
- Posts header: flex-direction column
- Sort buttons: full width

---

## Additional Pages

### Profile Edit Page
**Reference**: `profile-edit.html`

**Form Fields**:
1. Profile image upload
2. Nickname input
3. Bio textarea
4. Email (disabled, display only)

**Layout**: Same container (480px max-width, centered)

### Password Change Page
**Reference**: `password-change.html`

**Form Fields**:
1. Current password
2. New password
3. Confirm new password

**Layout**: Same as signup (480px max-width, centered)

---

## Key Differences from Current Design

| Aspect | Current | New Design |
|--------|---------|------------|
| Layout | Single column | **2-column with sidebar** |
| Profile Card | Basic | **Rich with stats** |
| Categories | None | **Categorized post counts** |
| Tags | None | **Tag cloud** |
| Recent Posts | None | **Quick access sidebar** |
| Dark Mode | None | **CSS variables ready** |
| Footer | None | **Professional footer** |
| Post Cards | With thumbnail | **Text-only, cleaner** |

---

## Notes

- **CSS Variables**: Define all colors as variables for easy theming
- **Dark Mode**: UI ready, functionality optional for Phase 1
- **Sidebar Richness**: Categories, tags, recent posts add value
- **Stats Display**: Engagement metrics visible
- **No Thumbnail**: Profile posts don't need thumbnails (cleaner)
- **Professional Footer**: Tech stack info, links
- **Responsive**: Sidebar hidden on mobile (not critical on small screens)
- **Edit Button**: Only show for authenticated owner
