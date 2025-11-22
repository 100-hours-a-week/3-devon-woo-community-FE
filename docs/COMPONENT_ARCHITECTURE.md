# Component Architecture

## Overview
Complete component structure for Tech Blog redesign. Maintains React-like component pattern while replacing all UI/UX.

**Principles**:
- Component-based architecture (keep existing pattern)
- Single Responsibility Principle (SRP)
- High reusability
- Avoid meaningless fragmentation
- JS + CSS in same folder for high cohesion

---

## Component Hierarchy

```
src/
├── core/                    # Core framework (KEEP)
│   ├── Component.js         # Base component class (enhance)
│   └── Router.js            # Client-side router (keep)
│
├── pages/                   # Page components (REPLACE ALL)
│   ├── LoginPage/
│   ├── SignupPage/
│   ├── BlogListPage/        # Renamed from PostListPage
│   ├── BlogDetailPage/      # Renamed from PostDetailPage
│   ├── PostCreatePage/
│   ├── PostEditPage/
│   ├── ProfilePage/
│   └── PasswordChangePage/
│
└── components/              # Reusable components
    ├── layout/              # Layout components
    │   ├── Header/          # MAJOR UPDATE
    │   ├── Footer/          # NEW
    │   └── Sidebar/         # NEW
    │
    ├── common/              # Common UI components
    │   ├── Modal/           # Keep, update style
    │   ├── Toast/           # Keep, update style
    │   ├── Button/          # NEW (standardized)
    │   ├── Input/           # NEW (standardized)
    │   └── PasswordInput/   # NEW
    │
    ├── auth/                # Auth-specific components
    │   ├── SocialLoginButtons/  # NEW
    │   ├── EmailVerification/   # NEW
    │   └── AgreementCheckbox/   # NEW
    │
    ├── post/                # Post-related components
    │   ├── BlogCard/        # NEW (replaces PostCard)
    │   ├── LikeButton/      # NEW
    │   ├── RecommendedPosts/  # NEW
    │   ├── TopPostsList/    # NEW
    │   └── MarkdownEditor/  # NEW
    │
    ├── comment/             # Comment components
    │   ├── CommentSection/  # UPDATE
    │   ├── CommentItem/     # UPDATE
    │   └── CommentInput/    # UPDATE
    │
    ├── profile/             # Profile components
    │   ├── ProfileCard/     # NEW
    │   ├── CategoryList/    # NEW
    │   └── TagCloud/        # NEW (also used in blog list)
    │
    ├── upload/              # Upload components
    │   ├── ImageUploader/   # NEW
    │   └── ProfileImageUploader/  # Keep, update style
    │
    ├── ui/                  # Small UI elements
    │   ├── Pagination/      # UPDATE
    │   ├── ScrollTopButton/ # NEW
    │   ├── NewsletterSubscribe/  # NEW
    │   └── KeywordCloud/    # NEW
    │
    └── editor/              # Editor components
        └── MarkdownToolbar/ # NEW
```

---

## New Components (12 components)

### 1. SocialLoginButtons
**Path**: `src/components/auth/SocialLoginButtons/`

**Purpose**: OAuth login buttons (Google, GitHub, Kakao, Naver)

**Props**:
```javascript
{
  onOAuthClick: (provider: string) => void
}
```

**Files**:
- `index.js` - Component logic
- `style.css` - OAuth button styles

### 2. EmailVerification
**Path**: `src/components/auth/EmailVerification/`

**Purpose**: Email verification with 6-digit code and timer

**Props**:
```javascript
{
  email: string,
  onVerified: (email: string) => void,
  onError: (message: string) => void
}
```

**State**:
```javascript
{
  code: string,
  timeRemaining: number,
  isVerified: boolean,
  loading: boolean
}
```

**Files**:
- `index.js` - Timer logic, verification API calls
- `style.css` - Input, timer, button styles

### 3. AgreementCheckbox
**Path**: `src/components/auth/AgreementCheckbox/`

**Purpose**: Terms agreement with "select all" functionality

**Props**:
```javascript
{
  onChange: (agreements: object) => void
}
```

**Files**:
- `index.js` - Checkbox logic
- `style.css` - Checkbox container styles

### 4. PasswordInput
**Path**: `src/components/common/PasswordInput/`

**Purpose**: Password input with visibility toggle

**Props**:
```javascript
{
  id: string,
  placeholder: string,
  value: string,
  onChange: (value: string) => void,
  required: boolean
}
```

**Files**:
- `index.js` - Toggle logic
- `style.css` - Input + button styles

### 5. BlogCard
**Path**: `src/components/post/BlogCard/`

**Purpose**: Blog post card (replaces PostCard) with D2 style

**Props**:
```javascript
{
  post: {
    id: number,
    title: string,
    excerpt: string,
    category: string,
    author: string,
    date: string,
    views: number,
    thumbnail: string
  },
  onClick: (id: number) => void
}
```

**Files**:
- `index.js` - Card rendering
- `style.css` - D2-style card layout

### 6. LikeButton
**Path**: `src/components/post/LikeButton/`

**Purpose**: Heart-shaped like button with count

**Props**:
```javascript
{
  likes: number,
  isLiked: boolean,
  onToggle: () => Promise<void>
}
```

**Files**:
- `index.js` - Toggle logic, optimistic update
- `style.css` - Pill-shaped button styles

### 7. RecommendedPosts
**Path**: `src/components/post/RecommendedPosts/`

**Purpose**: 3-card grid of recommended posts

**Props**:
```javascript
{
  posts: Array<PostSummary>
}
```

**Files**:
- `index.js` - Grid rendering
- `style.css` - 3-column grid

### 8. TopPostsList
**Path**: `src/components/post/TopPostsList/`

**Purpose**: Sidebar TOP 5 posts with CSS counter

**Props**:
```javascript
{
  posts: Array<{ id, title, url }>
}
```

**Files**:
- `index.js` - List rendering
- `style.css` - Numbered list with ::before

### 9. MarkdownEditor
**Path**: `src/components/editor/MarkdownEditor/`

**Purpose**: Markdown textarea with drag & drop image upload

**Props**:
```javascript
{
  value: string,
  onChange: (value: string) => void,
  onImageUpload: (files: FileList) => Promise<void>
}
```

**Files**:
- `index.js` - Textarea, drag & drop logic
- `style.css` - Editor + upload overlay

### 10. MarkdownToolbar
**Path**: `src/components/editor/MarkdownToolbar/`

**Purpose**: Toolbar with markdown formatting buttons

**Props**:
```javascript
{
  onInsert: (before: string, after: string) => void,
  onPreviewToggle: () => void,
  isPreview: boolean
}
```

**Files**:
- `index.js` - Toolbar actions
- `style.css` - Sticky toolbar styles

### 11. ProfileCard
**Path**: `src/components/profile/ProfileCard/`

**Purpose**: Rich profile card with avatar, stats

**Props**:
```javascript
{
  user: {
    avatar: string,
    name: string,
    bio: string,
    stats: { posts, reviews, comments }
  },
  isOwner: boolean,
  onEdit: () => void
}
```

**Files**:
- `index.js` - Card rendering
- `style.css` - Centered card with stats grid

### 12. CategoryList
**Path**: `src/components/profile/CategoryList/`

**Purpose**: User's categories with post counts

**Props**:
```javascript
{
  categories: Array<{ name, count }>,
  onCategoryClick: (name: string) => void
}
```

**Files**:
- `index.js` - List rendering
- `style.css` - List with counts

### 13. TagCloud
**Path**: `src/components/ui/TagCloud/`

**Purpose**: Tag cloud (used in blog list and profile)

**Props**:
```javascript
{
  tags: Array<{ name, count }>,
  onTagClick: (name: string) => void
}
```

**Files**:
- `index.js` - Tag pills rendering
- `style.css` - Pill-shaped tags

### 14. NewsletterSubscribe
**Path**: `src/components/ui/NewsletterSubscribe/`

**Purpose**: Newsletter subscription form

**Props**:
```javascript
{
  onSubscribe: (email: string) => Promise<void>
}
```

**Files**:
- `index.js` - Form submission
- `style.css` - Centered form in card

### 15. ScrollTopButton
**Path**: `src/components/ui/ScrollTopButton/`

**Purpose**: Fixed scroll-to-top button

**Props**: None (self-contained)

**Files**:
- `index.js` - Scroll detection, button click
- `style.css` - Fixed circular button

### 16. Sidebar
**Path**: `src/components/layout/Sidebar/`

**Purpose**: Container for sidebar sections (blog list, profile)

**Props**:
```javascript
{
  children: Component[]
}
```

**Files**:
- `index.js` - Sidebar container
- `style.css` - Fixed width, gap layout

### 17. Footer
**Path**: `src/components/layout/Footer/`

**Purpose**: Footer with copyright and links

**Props**:
```javascript
{
  author: string,
  year: number
}
```

**Files**:
- `index.js` - Footer rendering
- `style.css` - Footer layout

### 18. ImageUploader
**Path**: `src/components/upload/ImageUploader/`

**Purpose**: Image upload with progress modal

**Props**:
```javascript
{
  onUpload: (files: FileList) => Promise<void>,
  onComplete: (urls: string[]) => void
}
```

**Files**:
- `index.js` - Upload logic, progress tracking
- `style.css` - Modal + progress bars

---

## Components to Update (5 components)

### 1. Header (MAJOR UPDATE)
**Current**: Simple logo + profile icon
**New**: Logo + Navigation + Search + Dark Mode Toggle

**Changes**:
- Add navigation menu
- Add search section
- Add dark mode toggle button
- Make sticky
- Support multiple variants (full, minimal)

**New Props**:
```javascript
{
  variant: "full" | "minimal",  // full for blog, minimal for auth
  showSearch: boolean,
  showNav: boolean,
  onSearch: (query: string) => void
}
```

### 2. CommentSection (UPDATE)
**Changes**:
- Add sort dropdown (latest, oldest, likes)
- Update write area design (fafafa background)
- Update list styling

### 3. CommentItem (UPDATE)
**Changes**:
- Add like button to each comment
- Update author/date styling
- Add reply button (optional)

### 4. CommentInput (UPDATE)
**Changes**:
- Update to fafafa background
- Add avatar beside textarea
- Update button styling

### 5. Pagination (UPDATE)
**Current**: Basic pagination
**New**: Circular buttons with numbers

**Changes**:
- Circular button design
- Page numbers in center
- Ellipsis support
- Circular shape for all buttons

---

## Components to Remove (1 component)

### PostCard
**Reason**: Replaced by BlogCard with completely different design

**Migration**: All usages replaced with BlogCard

---

## Component Standards

### File Structure
```
ComponentName/
├── index.js       # Component logic
├── style.css      # Component styles
└── README.md      # Usage documentation (optional)
```

### Component Template
```javascript
import Component from '../../core/Component.js';
import './style.css';

export default class ComponentName extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // Component state
    };
  }

  render() {
    return `
      <div class="component-name">
        <!-- Component HTML -->
      </div>
    `;
  }

  mounted() {
    // Setup event listeners
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Event binding
  }

  updated() {
    // Re-setup if needed
  }

  beforeUnmount() {
    // Cleanup
  }
}
```

### Styling Standards
```css
/* Component scope */
.component-name {
  /* Use CSS variables from theme.css */
  background-color: var(--bg-primary);
  color: var(--text-primary);
  padding: var(--space-4);
  border-radius: var(--radius-md);
  transition: var(--transition-default);
}

/* BEM naming for sub-elements */
.component-name__element {
  /* Styles */
}

.component-name__element--modifier {
  /* Modifier styles */
}

/* State classes */
.component-name.is-active {
  /* Active state */
}

.component-name.is-loading {
  /* Loading state */
}

.component-name.is-disabled {
  /* Disabled state */
}
```

---

## Component Composition Examples

### Blog List Page
```javascript
class BlogListPage extends Component {
  render() {
    return `
      <div>
        <Header variant="full" showSearch showNav />
        <main class="content-wrapper">
          <section class="posts">
            ${this.state.posts.map(post => `
              <BlogCard post="${post}" />
            `).join('')}
            <Pagination />
          </section>
          <Sidebar>
            <TopPostsList posts="${this.state.topPosts}" />
            <TagCloud tags="${this.state.keywords}" />
            <NewsletterSubscribe />
          </Sidebar>
        </main>
        <ScrollTopButton />
      </div>
    `;
  }
}
```

### Post Create Page
```javascript
class PostCreatePage extends Component {
  render() {
    return `
      <div>
        <Header variant="minimal" />
        <main class="editor-container">
          <input type="text" class="title-input" />
          <MarkdownToolbar />
          <MarkdownEditor
            value="${this.state.content}"
            onImageUpload="${this.handleImageUpload}"
          />
        </main>
        <footer class="editor-footer">
          <Button variant="secondary">나가기</Button>
          <Button variant="secondary">임시 저장</Button>
          <Button variant="primary">출간하기</Button>
        </footer>
      </div>
    `;
  }
}
```

---

## Migration Strategy

### Phase 1: Core Components (Week 1)
1. Update Header component
2. Create PasswordInput
3. Create SocialLoginButtons
4. Create EmailVerification
5. Create AgreementCheckbox

### Phase 2: Blog Components (Week 2)
1. Create BlogCard
2. Create TopPostsList
3. Create TagCloud
4. Create NewsletterSubscribe
5. Create LikeButton
6. Create RecommendedPosts
7. Update Pagination

### Phase 3: Editor Components (Week 3)
1. Create MarkdownToolbar
2. Create MarkdownEditor
3. Create ImageUploader

### Phase 4: Profile & UI (Week 4)
1. Create ProfileCard
2. Create CategoryList
3. Create Sidebar
4. Create Footer
5. Create ScrollTopButton
6. Update Comment components

---

## Testing Checklist

For each component:
- [ ] Renders correctly
- [ ] Props work as expected
- [ ] State updates correctly
- [ ] Events trigger properly
- [ ] Styles applied correctly
- [ ] Responsive design works
- [ ] No layout shift
- [ ] Transitions smooth
- [ ] Accessible (keyboard, screen reader)
- [ ] No console errors

---

## Notes

- **Maintain React-like Pattern**: Keep existing component lifecycle
- **CSS Variables**: All components use theme.css variables
- **BEM Naming**: Use BEM for better style organization
- **Event Delegation**: Use event delegation where appropriate
- **Memory Leaks**: Always cleanup in beforeUnmount
- **Reusability**: Design for reuse, but avoid over-engineering
- **Documentation**: Document complex components
- **Accessibility**: ARIA labels, semantic HTML, keyboard navigation
