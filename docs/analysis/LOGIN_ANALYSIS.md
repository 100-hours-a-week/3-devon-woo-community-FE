# Login Page Analysis

## Overview
Professional login page with OAuth social login support and modern UI design.

**Reference**: `new_design/login/`

---

## Layout Structure

```
┌─────────────────────────────────────────┐
│            Header (NEXON COMPANY)        │
├─────────────────────────────────────────┤
│                                          │
│            ┌─────────────┐               │
│            │ Login Form  │               │
│            │  Max 420px  │               │
│            └─────────────┘               │
│                                          │
└─────────────────────────────────────────┘
```

### Key Layout Specifications
- **Container**: Centered, max-width 420px
- **Header**: Simple logo only, height 72px
- **Vertical Alignment**: Center-aligned main content
- **Background**: White (#ffffff)

---

## Component Breakdown

### 1. Header Component
**Specifications**:
- Height: 72px
- Max-width: 1400px
- Border-bottom: 1px solid #e5e5e5
- Logo: "NEXON COMPANY" (24px, 700 weight)

**Component to Create**:
- Update existing `src/components/Header/` to support minimal variant

### 2. Page Title & Subtitle
```html
<h2>로그인</h2>
<p>하나의 아이디로 넥슨 관계사를 전부 지원할 수 있습니다.</p>
```

**Specifications**:
- Title: 48px, 700 weight, black
- Subtitle: 15px, #666 color
- Spacing: 16px between title and subtitle
- Margin-bottom: 48px

### 3. Login Form
**Fields**:
1. Email input (type="email", required, autocomplete="email")
2. Password input with toggle (type="password", required)

**Input Specifications**:
- Padding: 16px 20px
- Border: 1px solid #e5e5e5
- Border-radius: 8px
- Font-size: 15px
- Background: #fafafa (default), #fff (focus)
- Focus border-color: #667eea
- Gap between inputs: 16px

### 4. Password Toggle Component (NEW)
**Location**: Inside password input field (absolute positioned right)

**Features**:
- Eye icon SVG (24x24)
- Shows/hides password
- Position: absolute, right 16px
- Color: #999 (default), #667eea (hover)
- Two states: eye-open (visible), eye-closed (hidden with slash)

**Component to Create**:
```
src/components/PasswordInput/
├── index.js
└── style.css
```

### 5. Error Message
**Specifications**:
- Min-height: 20px (prevents layout shift)
- Font-size: 13px
- Color: #f44336 (red)
- Visibility: hidden (default), visible (on error)
- Opacity transition: 0.2s ease

### 6. Submit Button
**Specifications**:
- Width: 100%
- Padding: 16px
- Background: #000 (black button - important!)
- Color: white
- Border-radius: 8px
- Font: 16px, 600 weight
- Hover: #333
- Active: scale(0.98)

### 7. Divider with Text
**Specifications**:
- Horizontal line with centered text "또는"
- Line: 1px #e5e5e5
- Text background: white
- Padding: 0 16px
- Margin: 32px 0

### 8. OAuth Section (NEW)
**Label**: "소셜 계정으로 로그인"
- Font-size: 13px
- Color: #666
- Text-align: center

**Component to Create**:
```
src/components/SocialLoginButtons/
├── index.js
└── style.css
```

**OAuth Buttons**:
- Container: flex, justify-center, gap 12px
- Button size: 48px × 48px
- Shape: Circle (border-radius: 50%)
- Border: 1px solid #e5e5e5
- Background: white
- Hover: translateY(-2px), box-shadow
- Icons: 20×20 SVG

**Providers & Colors**:
1. **Google**: #4285f4
2. **GitHub**: #333
3. **Kakao**: #fee500 background, #3c1e1e text
4. **Naver**: #03c75a background, white text

### 9. Form Links
**Text**: "이메일 | 비밀번호를 잊으셨나요?"
**Specifications**:
- Font-size: 14px
- Color: #666
- Links underlined, color #000
- Hover color: #667eea
- Divider: | with color #ddd

### 10. Signup Link
**Text**: "처음 지원하실경우엔 회원가입이 필요합니다."
**Specifications**:
- Font-size: 14px
- Link color: #667eea
- Font-weight: 600
- Hover: opacity 0.7, underline

---

## Design Patterns

### Color Scheme
```css
Primary Button: #000 (black)
Accent Color: #667eea (purple-blue)
Background: #ffffff, #fafafa
Text: #000, #666, #999
Border: #e5e5e5
Error: #f44336
```

### Typography
```css
Page Title: 48px / 700
Subtitle: 15px / 400
Input: 15px / 400
Button: 16px / 600
Small Text: 13-14px / 400-600
```

### Spacing
```css
Header height: 72px
Form max-width: 420px
Input padding: 16px 20px
Gap between elements: 16px, 24px, 32px, 48px
Border-radius: 8px (inputs/buttons), 50% (OAuth)
```

### Transitions
```css
All interactive elements: 0.2s ease
Hover states: opacity, background-color, color, transform
```

---

## Interactions

### 1. Password Toggle
```javascript
toggle.addEventListener('click', () => {
  const type = input.type === 'password' ? 'text' : 'password';
  input.type = type;
  toggle.classList.toggle('active');
});
```

### 2. Error Display
```javascript
function showError(message) {
  errorElement.textContent = message;
  errorElement.classList.add('visible');
}

function hideError() {
  errorElement.classList.remove('visible');
}
```

### 3. Form Validation
- Email format validation
- Password min length (8 characters)
- Show error on submit failure
- Clear error on input focus

### 4. OAuth Click (Mock)
```javascript
function handleOAuthLogin(provider) {
  console.log(`OAuth login with ${provider}`);
  // Mock: Simulate OAuth flow
  // Redirect to callback URL with mock token
}
```

---

## API Integration

### Login Endpoint
```javascript
POST /auth/login
Content-Type: application/json

Request:
{
  "email": "user@example.com",
  "password": "password123"
}

Response (Success):
{
  "accessToken": "...",
  "refreshToken": "...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "nickname": "User"
  }
}

Response (Error):
{
  "error": "INVALID_CREDENTIALS",
  "message": "이메일 또는 비밀번호가 올바르지 않습니다."
}
```

### OAuth Endpoints (Mock)
```javascript
GET /auth/oauth/{provider}/authorize
  - Redirects to provider authorization page
  - Mock: Return success with fake token

GET /auth/oauth/{provider}/callback
  - Processes OAuth callback
  - Returns access token
```

---

## State Management

### Component State
```javascript
{
  email: '',
  password: '',
  showPassword: false,
  error: null,
  loading: false
}
```

---

## Migration Tasks

### Phase 1: Update Components
1. Update `Header` component with minimal variant (logo only)
2. Create `PasswordInput` component with toggle
3. Create `SocialLoginButtons` component

### Phase 2: Create Page
1. Create new `LoginPage` component
2. Implement form validation
3. Integrate OAuth Mock API
4. Add error handling
5. Add loading states

### Phase 3: Styling
1. Apply black button style (#000)
2. Implement hover/active states
3. Add transitions
4. Ensure no layout shift

---

## Responsive Design

### Mobile (< 768px)
- Header height: 64px
- Logo font-size: 20px
- Page title: 36px
- Subtitle: 14px, margin-bottom 32px
- OAuth buttons: 44px × 44px, gap 8px
- Padding: 40px 20px

---

## Accessibility

- Proper form labels (for attribute)
- ARIA labels on icon buttons (aria-label="비밀번호 표시")
- Error messages with aria-live="polite"
- Autocomplete attributes (email, current-password)
- Keyboard navigation support

---

## Key Differences from Current Design

| Aspect | Current | New Design |
|--------|---------|------------|
| Primary Button | Purple (#7F6AEE) | **Black (#000)** |
| OAuth Login | Not present | **4 providers (Google, GitHub, Kakao, Naver)** |
| Password Toggle | Not present | **Eye icon toggle** |
| Max Width | 700px | **420px** |
| Header | Full navigation | **Logo only** |
| Design Style | Colorful | **Minimal, Black/White** |

---

## Notes

- **Tech-Blog Design**: This login page follows a clean, minimal aesthetic with black buttons
- **No unnecessary decorations**: No excessive shadows or rounded corners
- **Achromatic focus**: Black button, minimal color usage
- **Layout shift prevention**: Min-height on error message, fixed button sizes
- **OAuth is Mock**: Implement OAuth flow simulation for frontend development
