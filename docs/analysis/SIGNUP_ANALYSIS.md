# Signup Page Analysis

## Overview
Comprehensive signup page with email verification, password strength validation, and terms agreement.

**Reference**: `new_design/signup/`

---

## Layout Structure

```
┌─────────────────────────────────────────┐
│            Header (NEXON COMPANY)        │
├─────────────────────────────────────────┤
│                                          │
│            ┌─────────────┐               │
│            │ Signup Form │               │
│            │  Max 480px  │               │
│            └─────────────┘               │
│                                          │
└─────────────────────────────────────────┘
```

### Key Layout Specifications
- **Container**: Centered, max-width 480px
- **Header**: Simple logo only, height 72px
- **Background**: White (#ffffff)
- **Gap between form groups**: 24px

---

## Component Breakdown

### 1. Page Title & Subtitle
```html
<h2>회원가입</h2>
<p>넥슨 계정을 만들고<br>다양한 서비스를 이용해보세요.</p>
```

**Specifications**:
- Title: 48px, 700 weight, black
- Subtitle: 15px, #666 color
- Margin-bottom: 48px

### 2. Email Input with Verification (NEW)
**Layout**: Input + Button side by side

**Component Structure**:
```
┌────────────────────────────┬──────────────┐
│     Email Input            │ 인증코드 발송 │
└────────────────────────────┴──────────────┘
```

**Specifications**:
- Container: display flex, gap 8px
- Input: flex 1, padding 14px 16px
- Button: padding 14px 20px, white-space nowrap
- Button color: Border #667eea, text #667eea
- Button hover: Background #667eea, text white

**Component to Create**:
```
src/components/EmailVerification/
├── index.js
└── style.css
```

### 3. Verification Code Input (NEW)
**Conditional Display**: Shows after email verification code is sent

**Elements**:
1. Code input (6-digit, maxlength="6")
2. Verify button
3. Timer display (05:00 countdown)
4. Help text (success/error messages)

**Timer Specifications**:
- Font-size: 13px
- Color: #f44336 (red)
- Font-weight: 600
- Format: MM:SS
- Duration: 5 minutes
- Text-align: right

**States**:
```javascript
{
  emailSent: false,
  codeVerified: false,
  timeRemaining: 300, // seconds
  timerInterval: null
}
```

**Timer Logic**:
```javascript
function startTimer() {
  const timer = setInterval(() => {
    timeRemaining--;
    updateTimerDisplay();
    if (timeRemaining <= 0) {
      clearInterval(timer);
      showExpiredMessage();
    }
  }, 1000);
}
```

### 4. Form Input Fields
All inputs follow this pattern:

**Structure**:
```html
<div class="form-group">
  <label class="form-label">Label Text</label>
  <input class="form-input" />
  <div class="help-text">Help or error message</div>
</div>
```

**Fields**:
1. **Email** (with verification)
2. **Verification Code** (conditional)
3. **Nickname** (2-20 characters, required)
4. **Password** (8+ chars, with toggle)
5. **Password Confirm** (with toggle)

**Label Specifications**:
- Font-size: 14px
- Font-weight: 600
- Color: #333
- Margin-bottom: 8px

**Input Specifications**:
- Padding: 14px 16px
- Border: 1px solid #e5e5e5
- Border-radius: 8px
- Font-size: 15px
- Background: #fafafa (default), #fff (focus)
- Focus border-color: #667eea
- Disabled: background #f5f5f5, color #999

### 5. Help Text Component (NEW)
**Purpose**: Display validation feedback, errors, success messages

**Specifications**:
- Min-height: 18px (prevents layout shift)
- Font-size: 12px
- Padding-left: 4px
- Visibility: hidden (default), visible (when active)
- Opacity transition: 0.2s ease

**States & Colors**:
```css
.help-text.error   { color: #f44336; } /* Red */
.help-text.success { color: #4caf50; } /* Green */
.help-text.info    { color: #667eea; } /* Blue */
```

**Examples**:
- Email error: "올바른 이메일 형식이 아닙니다"
- Email success: "인증코드가 발송되었습니다"
- Password error: "8자 이상, 영문/숫자/특수문자를 포함해주세요"
- Password confirm error: "비밀번호가 일치하지 않습니다"

### 6. Verification Button States
**Initial**: "인증코드 발송"
**After Send**: "재발송" (can resend after 1 minute)
**Verified**: "인증완료" (success state, disabled)

**Button States**:
```css
.btn-verify                { border #667eea, color #667eea }
.btn-verify:hover          { background #667eea, color white }
.btn-verify:disabled       { background #f5f5f5, border #e5e5e5, color #999 }
.btn-verify.success        { background #4caf50, border #4caf50, color white }
```

### 7. Password Toggle (Reusable)
Same as login page, but appears twice:
- Password input
- Password confirm input

Each toggle is independent.

### 8. Terms Agreement Section (NEW)
**Component to Create**:
```
src/components/AgreementCheckbox/
├── index.js
└── style.css
```

**Layout**:
```
┌─────────────────────────────────────┐
│ ☐ 전체 동의                          │
│ ─────────────────────────────────── │
│ ☐ [필수] 이용약관 동의           보기 │
│ ☐ [필수] 개인정보 처리방침 동의   보기 │
│ ☐ [선택] 마케팅 정보 수신 동의   보기 │
└─────────────────────────────────────┘
```

**Container Specifications**:
- Background: #fafafa
- Border: 1px solid #e5e5e5
- Border-radius: 8px
- Padding: 20px
- Gap: 12px

**Checkbox Specifications**:
- Size: 20px × 20px (22px for "전체 동의")
- Accent-color: #667eea (browser native)
- Cursor: pointer

**"전체 동의" Style**:
- Font-weight: 600
- Font-size: 15px
- Border-bottom divider below it

**Individual Terms**:
- Font-size: 14px
- Color: #333
- "보기" link: color #667eea, font-size 13px

**Logic**:
```javascript
allCheckbox.addEventListener('change', () => {
  const checked = allCheckbox.checked;
  termItems.forEach(item => item.checked = checked);
});

termItems.forEach(item => {
  item.addEventListener('change', () => {
    allCheckbox.checked = termItems.every(i => i.checked);
  });
});
```

### 9. Submit Button
**Specifications**:
- Width: 100%
- Padding: 16px
- Background: #000 (black)
- Color: white
- Border-radius: 8px
- Font: 16px, 600 weight
- Margin-top: 8px
- Disabled state: background #e5e5e5, color #999

**Enable Conditions**:
1. Email verified
2. All required fields filled
3. Password validation passed
4. Passwords match
5. Required terms agreed

### 10. Login Link
**Text**: "이미 계정이 있으신가요? 로그인"
**Specifications**:
- Font-size: 14px
- Color: #666
- Link color: #667eea, font-weight 600
- Margin-top: 32px

---

## Validation Rules

### Email
```javascript
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
  showError('올바른 이메일 형식이 아닙니다');
}
```

### Verification Code
```javascript
if (code.length !== 6) {
  showError('6자리 인증코드를 입력해주세요');
}
if (!/^\d{6}$/.test(code)) {
  showError('숫자만 입력 가능합니다');
}
```

### Nickname
```javascript
if (nickname.length < 2 || nickname.length > 20) {
  showError('2-20자 이내로 입력해주세요');
}
```

### Password
```javascript
const hasMinLength = password.length >= 8;
const hasLetter = /[a-zA-Z]/.test(password);
const hasNumber = /\d/.test(password);
const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

if (!hasMinLength || !hasLetter || !hasNumber || !hasSpecial) {
  showError('8자 이상, 영문/숫자/특수문자를 포함해주세요');
}
```

### Password Confirm
```javascript
if (password !== passwordConfirm) {
  showError('비밀번호가 일치하지 않습니다');
}
```

---

## API Integration

### 1. Send Verification Email
```javascript
POST /auth/email/send-code
Content-Type: application/json

Request:
{
  "email": "user@example.com"
}

Response (Success):
{
  "message": "인증코드가 발송되었습니다",
  "expiresIn": 300 // seconds
}

Response (Error):
{
  "error": "EMAIL_ALREADY_EXISTS",
  "message": "이미 가입된 이메일입니다"
}
```

### 2. Verify Email Code
```javascript
POST /auth/email/verify-code
Content-Type: application/json

Request:
{
  "email": "user@example.com",
  "code": "123456"
}

Response (Success):
{
  "verified": true,
  "message": "이메일 인증이 완료되었습니다"
}

Response (Error):
{
  "verified": false,
  "error": "INVALID_CODE",
  "message": "인증코드가 올바르지 않습니다"
}
```

### 3. Signup
```javascript
POST /auth/signup
Content-Type: application/json

Request:
{
  "email": "user@example.com",
  "emailVerified": true,
  "nickname": "UserNickname",
  "password": "Password123!",
  "termsAgreed": true,
  "privacyAgreed": true,
  "marketingAgreed": false
}

Response (Success):
{
  "accessToken": "...",
  "refreshToken": "...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "nickname": "UserNickname"
  }
}
```

---

## State Management

### Component State
```javascript
{
  // Form fields
  email: '',
  verificationCode: '',
  nickname: '',
  password: '',
  passwordConfirm: '',

  // Verification state
  emailSent: false,
  emailVerified: false,
  timeRemaining: 0,

  // Password visibility
  showPassword: false,
  showPasswordConfirm: false,

  // Terms
  termsAll: false,
  termsService: false,
  termsPrivacy: false,
  termsMarketing: false,

  // UI state
  loading: false,
  errors: {}
}
```

---

## User Flow

```
1. User enters email
   ↓
2. Click "인증코드 발송"
   ↓
3. Email verification input appears
   Timer starts (5:00)
   ↓
4. User enters 6-digit code
   ↓
5. Click "확인"
   ↓
6. Code verified ✓
   Email input becomes disabled
   Verification input becomes disabled with success state
   ↓
7. User fills nickname, password, password confirm
   ↓
8. User agrees to required terms
   ↓
9. Submit button becomes enabled
   ↓
10. User clicks "회원가입"
    ↓
11. Account created, redirect to login or auto-login
```

---

## Migration Tasks

### Phase 1: Create New Components
1. `EmailVerification` component (input + button + timer)
2. `AgreementCheckbox` component (terms section)
3. Update `PasswordInput` (reuse from login)

### Phase 2: Create Page
1. Create new `SignupPage` component
2. Implement all validations
3. Implement email verification flow
4. Implement timer logic
5. Implement terms agreement logic
6. Add form submission

### Phase 3: API Integration
1. Add email verification endpoints to MockServer
2. Add signup endpoint to MockServer
3. Implement API calls in page
4. Handle loading and error states

### Phase 4: Styling
1. Apply all input/button styles
2. Implement help text system
3. Add transitions
4. Ensure no layout shift (min-heights)

---

## Responsive Design

### Mobile (< 768px)
- Header height: 64px
- Page title: 36px
- Subtitle: 14px, margin-bottom 32px
- Input with button: flex-direction column, button width 100%

---

## Accessibility

- Proper labels (for attribute)
- Required attributes on inputs
- Autocomplete attributes (email, new-password)
- ARIA labels on toggle buttons
- Min-height on help text (prevents layout shift)
- Disabled state clear indication
- Timer readable by screen readers

---

## Key Differences from Current Design

| Aspect | Current | New Design |
|--------|---------|------------|
| Email Verification | Not present | **6-digit code with 5-min timer** |
| Terms Agreement | Simple checkbox | **Detailed terms with "전체 동의"** |
| Validation Feedback | Basic | **Real-time with help text** |
| Button Styles | Purple | **Black (#000)** |
| Layout | Simple | **More comprehensive, guided** |
| Max Width | 700px | **480px** |

---

## Notes

- **Prevent Layout Shift**: All help texts have min-height
- **Timer Accuracy**: Use setInterval carefully, clear on unmount
- **Email Verification**: Store verification state, disable email input after verified
- **Form Validation**: Real-time validation on blur, show errors immediately
- **Button Enable**: Only enable when ALL conditions met
- **Resend Logic**: Allow resend after 1 minute (or timer expires)
- **Mock Implementation**: Email verification should work with mock 6-digit codes (e.g., always accept "123456" in dev)
