# Tech Blog Project - Requirements & Guidelines

## Project Overview

This project is transitioning from "아무말 대잔치" (Random Talk Festival) to a professional Tech Blog platform. The legacy design in `src/` must be completely replaced with the new design from `new_design/`, while maintaining the SPA architecture and component-based structure.

## Architecture Decision

- **Approach**: Hybrid (SPA + new_design UI)
- **Maintain**: React-like component structure, routing system, component reusability
- **Replace**: All UI/UX, design system, visual components
- **Preserve**: Folder structure, rendering approach, core framework

## Current Status

**Source Directories**:
- `src/` = Legacy version (to be replaced)
- `new_design/` = New design reference (UI/UX source)

**Goal**: Transform `src/` by replacing all design and domain logic while keeping only the architectural structure.

---

## Migration Strategy

### Phase 1: Analysis & Design Documentation
1. Analyze `new_design/` and create design analysis documents
2. Remove existing `theme.css` and create new one based on new_design
3. Analyze each page's behavior and rules, document specifications
4. Create Entity, DTO, and API design specifications

### Phase 2: Complete Replacement of src/
1. Add JSON (DTO) content based on API/DTO specifications
2. Add new API endpoints as needed
3. Rewrite all components and pages based on analysis documents
4. Completely remove and replace legacy components and pages

---

## Code Requirements

### Future-Proof for React Migration
- Write code similar to React patterns (this will be migrated to React later)
- Use functional programming principles where applicable
- Maintain clear component lifecycle patterns

### Style Isolation & Scoping
- Minimize style conflicts between pages and components
- Use specific, scoped style names
- Independent designs should not be affected by global styles
- Avoid duplicate style names in isolated components

### Component Architecture
- **DO**: Separate components to follow SRP (Single Responsibility Principle)
- **DO**: Maximize reusability through meaningful component separation
- **DON'T**: Create components unnecessarily (avoid meaningless fragmentation)
- **DO**: Keep JS and styles in the same folder for high cohesion

### Design Consistency
- All designs must be consistent
- When design requirements conflict, **prioritize Tech-Blog design** (tech-blog and tech-blog-detail style)

---

## Code Quality Standards

### Minimize Duplication
- Reduce duplicate code as much as possible
- Maximize reusability
- Abstract common patterns into base Component class when possible

### Naming Conventions
- Use detailed, specific variable names over simple ones
- Avoid generic style variable names that could conflict
- Prefer descriptive names that prevent collisions

### Code Cleanliness
- **NO COMMENTS** (per user requirement)
- Remove unnecessary code
- Follow requirements first before adding extra features

### Performance
- Prevent Layout Shift
- Prevent Reflow
- Prevent Content Jank
- Optimize component rendering

### Current Issues
- Fix SPA and rendering issues if found
- Improve architecture problems proactively

---

## Design Requirements

### Design Philosophy

**Target Style**: Tech-Blog Design (clean, professional)
- Reference: `tech-blog` and `tech-blog-detail` design style
- This is the **primary design direction**

**Avoid**: AI Design Style
- Avoid excessive rounded corners
- Avoid unnecessary shadows
- Avoid excessive borders
- Avoid "bubbly" design patterns

### Color Palette

**Preferred**: Achromatic (black/white/gray)
- Primary: Black and white
- Grays: Various tones for hierarchy
- Colors: Only when necessary (errors, required highlights)

**Use color for**:
- Error messages (red)
- Success states (green)
- Required functional highlights

### Theme System

- Define extensive values in `theme.css`
- Prepare for dark mode (structure CSS variables for future theme switching)
- Do not implement dark mode now, but make it easy to add later

---

## Priority & Flexibility

### Lower Priority Rules
- If a design deviates from Tech-Blog style or leans toward AI design, you may change it to Tech-Blog design for cleanliness
- Prefer achromatic colors over colorful designs
- Use color only when functionally necessary (errors, critical actions)

---

## Technical Constraints

### What to Preserve
- Folder structure pattern
- Rendering approach (SPA)
- Component-based architecture
- Router system

### What to Replace
- All domain logic (change from "random talk" to "tech blog")
- All design and styling
- All visual components
- All page layouts

---

## Development Workflow

1. **Read before writing**: Always read existing files before modifying
2. **Test after each phase**: Verify functionality after each migration phase
3. **Document as you go**: Create README.md for each component/page
4. **Maintain consistency**: Follow Tech-Blog design throughout

---

## Anti-Patterns to Avoid

- Unnecessary rounded corners, shadows, borders
- Colorful designs without purpose
- Meaningless component fragmentation
- Generic variable names
- Code comments
- Unnecessary optimizations before requirements
- Breaking existing architecture patterns

---

## Success Criteria

- All pages follow Tech-Blog design style
- No duplicate code
- High component reusability
- No layout shift or content jank
- Clean, minimal, professional design
- Achromatic color scheme with purposeful color usage
- Ready for dark mode (structure only)
- Easy to migrate to React later
