# Theme Design Specification

## Overview
Complete redesign of `theme.css` based on new_design analysis. Focus on **achromatic color scheme** with **minimal color usage**, following Tech-Blog design principles.

**Goal**: Replace existing purple-focused theme with clean, professional black/white/gray system.

---

## Design Philosophy

### Core Principles
1. **Achromatic Primary**: Black, white, and grays as foundation
2. **Minimal Color Usage**: Colors only when functionally necessary
3. **Clean & Professional**: NAVER D2 / Tech Blog inspired
4. **Dark Mode Ready**: CSS variables structured for easy theme switching
5. **No AI Design**: Avoid excessive rounded corners, shadows, borders

### Color Usage Guidelines
✅ **USE COLOR FOR**:
- Error states (#f44336 - red)
- Success states (#4caf50 - green)
- Primary accent (#667eea - purple-blue, used sparingly)
- OAuth brand colors (only in OAuth buttons)

❌ **AVOID COLOR FOR**:
- Backgrounds (use white/gray)
- Text (use black/gray)
- Borders (use gray)
- Buttons (primary buttons should be black)

---

## Color System

### Base Colors (Achromatic)
```css
:root {
  /* Pure Colors */
  --color-white: #ffffff;
  --color-black: #000000;

  /* Gray Scale */
  --color-gray-50: #fafafa;
  --color-gray-100: #f5f5f5;
  --color-gray-200: #e8e8e8;
  --color-gray-300: #e5e5e5;
  --color-gray-400: #d0d0d0;
  --color-gray-500: #999999;
  --color-gray-600: #666666;
  --color-gray-700: #333333;
  --color-gray-800: #1f1f1f;
  --color-gray-900: #0f0f0f;
}
```

### Functional Colors (Minimal Usage)
```css
:root {
  /* Accent (use sparingly) */
  --color-accent: #667eea;
  --color-accent-hover: #5568d3;
  --color-accent-active: #4557bc;

  /* Semantic Colors */
  --color-error: #f44336;
  --color-error-light: #ffebee;
  --color-success: #4caf50;
  --color-success-light: #e8f5e9;
  --color-warning: #ff9800;
  --color-warning-light: #fff3e0;
  --color-info: #2196f3;
  --color-info-light: #e3f2fd;

  /* OAuth Brand Colors (specific use only) */
  --color-google: #4285f4;
  --color-github: #333333;
  --color-kakao-bg: #fee500;
  --color-kakao-text: #3c1e1e;
  --color-naver-bg: #03c75a;
  --color-naver-text: #ffffff;
}
```

### Gradient Colors (Thumbnails Only)
```css
:root {
  /* Only for blog post thumbnails */
  --gradient-1-start: #667eea;
  --gradient-1-end: #764ba2;
  --gradient-2-start: #f093fb;
  --gradient-2-end: #f5576c;
  --gradient-3-start: #4facfe;
  --gradient-3-end: #00f2fe;
  --gradient-4-start: #43e97b;
  --gradient-4-end: #38f9d7;
}
```

---

## Semantic Color Tokens

### Background
```css
:root {
  --bg-primary: var(--color-white);
  --bg-secondary: var(--color-gray-50);
  --bg-tertiary: var(--color-gray-100);
  --bg-card: var(--color-gray-50);
  --bg-overlay: rgba(0, 0, 0, 0.5);
  --bg-input: var(--color-gray-50);
  --bg-input-focus: var(--color-white);
}
```

### Text
```css
:root {
  --text-primary: var(--color-black);
  --text-secondary: var(--color-gray-600);
  --text-tertiary: var(--color-gray-500);
  --text-quaternary: var(--color-gray-400);
  --text-disabled: var(--color-gray-400);
  --text-placeholder: var(--color-gray-500);
  --text-link: var(--color-black);
  --text-link-hover: var(--color-accent);
}
```

### Border
```css
:root {
  --border-primary: var(--color-gray-300);
  --border-secondary: var(--color-gray-200);
  --border-tertiary: var(--color-gray-100);
  --border-focus: var(--color-accent);
  --border-error: var(--color-error);
  --border-divider: var(--color-gray-400);
}
```

### Button
```css
:root {
  /* Primary Button (BLACK, not purple!) */
  --btn-primary-bg: var(--color-black);
  --btn-primary-bg-hover: var(--color-gray-700);
  --btn-primary-bg-active: var(--color-black);
  --btn-primary-text: var(--color-white);
  --btn-primary-border: var(--color-black);

  /* Secondary Button (Outlined) */
  --btn-secondary-bg: transparent;
  --btn-secondary-bg-hover: var(--color-gray-100);
  --btn-secondary-bg-active: var(--color-gray-200);
  --btn-secondary-text: var(--color-gray-600);
  --btn-secondary-border: var(--color-gray-300);

  /* Accent Button (Sparingly) */
  --btn-accent-bg: var(--color-accent);
  --btn-accent-bg-hover: var(--color-accent-hover);
  --btn-accent-bg-active: var(--color-accent-active);
  --btn-accent-text: var(--color-white);

  /* Disabled */
  --btn-disabled-bg: var(--color-gray-300);
  --btn-disabled-text: var(--color-gray-500);
  --btn-disabled-border: var(--color-gray-300);
}
```

---

## Typography

### Font Family
```css
:root {
  --font-family-base: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  --font-family-mono: 'Monaco', 'Courier New', monospace;
}
```

### Font Size
```css
:root {
  /* Display */
  --font-size-display: 48px;  /* Page titles */
  --font-size-h1: 42px;        /* Article title */
  --font-size-h2: 32px;        /* Section heading */
  --font-size-h3: 24px;        /* Subsection */
  --font-size-h4: 20px;        /* Minor heading */

  /* Body */
  --font-size-xlarge: 28px;    /* Logo */
  --font-size-large: 18px;     /* Post card title */
  --font-size-base: 17px;      /* Article body */
  --font-size-medium: 15px;    /* Input, normal text */
  --font-size-small: 14px;     /* Label, nav */
  --font-size-xsmall: 13px;    /* Meta, help text */
  --font-size-tiny: 12px;      /* Sidebar, tags */
  --font-size-mini: 11px;      /* Category badge */
}
```

### Font Weight
```css
:root {
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
}
```

### Line Height
```css
:root {
  --line-height-tight: 1.3;    /* Titles */
  --line-height-normal: 1.4;   /* Post titles */
  --line-height-medium: 1.6;   /* General text */
  --line-height-relaxed: 1.8;  /* Article content */
}
```

### Letter Spacing
```css
:root {
  --letter-spacing-tight: -0.5px;
  --letter-spacing-normal: 0;
  --letter-spacing-wide: 0.5px;  /* Category badges */
}
```

---

## Spacing

### Base Scale (4px)
```css
:root {
  --space-0: 0;
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-7: 28px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
  --space-20: 80px;
  --space-24: 96px;
}
```

### Component Spacing
```css
:root {
  /* Padding */
  --padding-input: 16px 20px;
  --padding-input-small: 14px 16px;
  --padding-button: 12px 24px;
  --padding-button-small: 10px 20px;
  --padding-button-large: 16px;
  --padding-card: 20px;
  --padding-card-large: 24px;
  --padding-section: 32px 24px;

  /* Gap */
  --gap-xsmall: var(--space-2);  /* 8px */
  --gap-small: var(--space-3);   /* 12px */
  --gap-medium: var(--space-4);  /* 16px */
  --gap-large: var(--space-6);   /* 24px */
  --gap-xlarge: var(--space-8);  /* 32px */
  --gap-2xlarge: var(--space-10); /* 40px */
}
```

---

## Border Radius

### Radius Scale
```css
:root {
  --radius-none: 0;
  --radius-sm: 6px;     /* Small elements, tags */
  --radius-md: 8px;     /* Inputs, buttons, cards */
  --radius-lg: 12px;    /* Large cards */
  --radius-xl: 16px;    /* Profile cards */
  --radius-pill: 999px; /* Pills, circular buttons */
  --radius-circle: 50%; /* Circles */
}
```

### Component Radius
```css
:root {
  --radius-input: var(--radius-md);
  --radius-button: var(--radius-md);
  --radius-card: var(--radius-md);
  --radius-card-large: var(--radius-lg);
  --radius-tag: var(--radius-md);  /* Not fully rounded! */
  --radius-avatar: var(--radius-circle);
  --radius-search: var(--radius-pill);
}
```

---

## Shadows

### Shadow Scale (Minimal)
```css
:root {
  --shadow-none: none;
  --shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}
```

### Component Shadows
```css
:root {
  --shadow-card: var(--shadow-sm);
  --shadow-dropdown: var(--shadow-md);
  --shadow-modal: var(--shadow-xl);
  --shadow-scroll-button: 0 4px 12px rgba(0, 0, 0, 0.15);
}
```

---

## Layout

### Container Widths
```css
:root {
  --width-xs: 420px;   /* Login/Signup */
  --width-sm: 480px;   /* Signup extended */
  --width-md: 800px;   /* Article content */
  --width-lg: 900px;   /* Editor */
  --width-xl: 1200px;  /* Main container */
  --width-2xl: 1400px; /* Header max-width */
}
```

### Header & Footer
```css
:root {
  --height-header: 72px;
  --height-header-mobile: 64px;
  --height-footer: auto;
}
```

### Sidebar
```css
:root {
  --width-sidebar: 280px;  /* Blog list sidebar */
  --width-sidebar-large: 350px;  /* Profile sidebar */
}
```

---

## Z-Index Scale

```css
:root {
  --z-base: 0;
  --z-dropdown: 10;
  --z-sticky: 50;
  --z-header: 100;
  --z-overlay: 500;
  --z-modal: 1000;
  --z-toast: 2000;
}
```

---

## Transitions

### Duration
```css
:root {
  --duration-fast: 0.15s;
  --duration-normal: 0.2s;
  --duration-slow: 0.3s;
}
```

### Easing
```css
:root {
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
}
```

### Component Transitions
```css
:root {
  --transition-default: all var(--duration-normal) var(--ease-in-out);
  --transition-color: color var(--duration-normal) var(--ease-in-out);
  --transition-bg: background-color var(--duration-normal) var(--ease-in-out);
  --transition-border: border-color var(--duration-normal) var(--ease-in-out);
  --transition-transform: transform var(--duration-normal) var(--ease-out);
}
```

---

## Dark Mode Variables (Prepared)

```css
body.dark-mode {
  /* Background */
  --bg-primary: #1f2937;
  --bg-secondary: #111827;
  --bg-tertiary: #0f1419;
  --bg-card: #374151;
  --bg-input: #374151;
  --bg-input-focus: #4b5563;

  /* Text */
  --text-primary: #f9fafb;
  --text-secondary: #9ca3af;
  --text-tertiary: #6b7280;
  --text-quaternary: #4b5563;
  --text-placeholder: #6b7280;

  /* Border */
  --border-primary: #4b5563;
  --border-secondary: #374151;
  --border-tertiary: #1f2937;

  /* Button */
  --btn-primary-bg: #f9fafb;
  --btn-primary-bg-hover: #d1d5db;
  --btn-primary-text: #111827;
  --btn-secondary-bg: transparent;
  --btn-secondary-bg-hover: #374151;
  --btn-secondary-text: #9ca3af;

  /* Shadows (darker) */
  --shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.3);
  --shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.4);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.5);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.5);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.6);
}

body {
  transition: background-color var(--duration-slow) var(--ease-in-out),
              color var(--duration-slow) var(--ease-in-out);
}
```

---

## Implementation Notes

### Usage Examples

**Background**:
```css
.container {
  background-color: var(--bg-primary);
}

.card {
  background-color: var(--bg-card);
}
```

**Text**:
```css
.title {
  color: var(--text-primary);
  font-size: var(--font-size-h1);
  font-weight: var(--font-weight-bold);
}

.subtitle {
  color: var(--text-secondary);
  font-size: var(--font-size-medium);
}
```

**Buttons**:
```css
.btn-primary {
  background-color: var(--btn-primary-bg);
  color: var(--btn-primary-text);
  padding: var(--padding-button);
  border-radius: var(--radius-button);
  transition: var(--transition-bg);
}

.btn-primary:hover {
  background-color: var(--btn-primary-bg-hover);
}
```

**Spacing**:
```css
.section {
  margin-bottom: var(--space-20);
  gap: var(--gap-large);
}
```

---

## Key Changes from Old Theme

| Aspect | Old Theme | New Theme |
|--------|-----------|-----------|
| Primary Color | Purple (#7F6AEE) | **Black (#000)** |
| Button Style | Purple | **Black** |
| Color Philosophy | Colorful | **Achromatic** |
| Accent Usage | Frequent | **Minimal** |
| Max Width | 700px | **Multiple widths** (800px, 1200px, 1400px) |
| Border Radius | Consistent 8px | **Varied** (6px-16px) |
| Shadows | Moderate | **Minimal** |
| Dark Mode | Not supported | **Ready** |

---

## Migration Checklist

- [ ] Replace all purple references with black for primary buttons
- [ ] Update color system to achromatic base
- [ ] Add CSS variable support to all components
- [ ] Implement semantic color tokens
- [ ] Add dark mode color definitions
- [ ] Update spacing system to 4px scale
- [ ] Standardize border radius across components
- [ ] Minimize shadow usage
- [ ] Add transition variables
- [ ] Test dark mode toggle (UI only for Phase 1)

---

## Notes

- **Black Buttons**: Primary buttons MUST be black (#000), not purple
- **Minimal Color**: Only use color where functionally necessary
- **CSS Variables**: All values should be defined as variables for easy theming
- **Dark Mode**: Structure ready, activation in later phase
- **Clean Design**: Follow Tech-Blog design principles (NAVER D2 style)
- **No AI Design**: Avoid excessive decoration
