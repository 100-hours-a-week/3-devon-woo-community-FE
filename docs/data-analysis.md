# Data + Component Audit

## 1. Module landscape (components → pages)
- **Entry point**: `index.html` renders `<div id="app"></div>` and loads `src/app.js`.
- **Core layer**: `src/core/Component.js` offers `render`/`setState`/`delegate`, `src/core/Router.js` wires the single `#main` region, helps `navigate()` and keeps the cache for each route.
- **Global styles**: `src/styles/theme.css` defines the design tokens (colors, spacing, font weights, radii, z-indexes) while `src/styles/global.css` applies reset + typography/layout defaults. Components load their own `/style.css` via `Component.loadStyle`.
- **Common services**: `src/services/HeaderService.js` glues the singleton header to pages, exposes helpers (`hideHeader`, `setHeaderVariant`, `refreshAuthState`, etc.) so pages can toggle visibility without reimplementing event plumbing.
- **Reusable UI components**:
  * `src/components/Header/index.js` (navigation / search / auth dropdown driven by `AuthService`).
  * Layout/composite pieces such as `components/layout/Sidebar`, `components/post/TopPostsList`, `components/ui/TagCloud`, `components/ui/NewsletterSubscribe`.
  * Utility widgets (`LoadingSpinner`, `Modal`, `Toast`, `ProfileImageUploader`, `CommentList/CommentItem`) ready for reuse but not consistently wired yet (see below).
- **Pages**: `src/pages/*` implement the route-aware views (BlogListPage, PostDetailPage, PostCreatePage/PostPublishPage, ProfilePage/ProfileEditPage, LoginPage, SignupPage). Each page imports the needed components/services/DTOs instead of reinventing the “SPA” logic from scratch.
- **API layer**: `src/api/*.js` wrap HTTP requests through `src/api/base/axios.js`. The Axios wrapper currently routes through `MockServer` (see §3) but also defines real endpoints for Auth (`/auth/*`), Members (`/api/v1/members/*`), Posts (`/api/v1/posts`), Comments (`/api/v1/comments`), Cloudinary (`/api/v1/images/sign`) and upload helpers.
- **DTOs**: `src/dto/request` and `src/dto/response` capture the expected payload shapes via constructors/static fakes (`createDummy`, `createDefault`). The mock server imports these DTO factories to keep the fake payloads aligned with the domain contracts.
- **Utilities/validation**: `src/utils/AuthService.js` now enforces the API-driven login flow (dev bypass disabled), helpers such as `imageUpload`, `imageProcessor`, `markdown`, `formatters` support UI concerns, and `src/validation/*.js` supply form validators for auth/post flows.

## 2. API + DTO snapshot (fields to rely on)
- **Auth**
  * Endpoints: `POST /auth/login`, `POST /auth/signup`, `POST /auth/logout` (`src/api/auth.js`).
  * DTOs: `LoginRequest`/`SignupRequest` now accept both credentials and the optional profile payload (handle/bio/stack/interests/social links). `LoginResponse`/`SignupResponse` return `{ accessToken, refreshToken, member }`, mirroring what `AuthService.login()` expects. Dev bypass is disabled so every page must go through the API (or the mock server equivalent).
- **Members**
  * Endpoints: `GET /api/v1/members/{id}`, `PATCH /api/v1/members/{id}`, `PATCH /api/v1/members/{id}/password`, `DELETE /api/v1/members/{id}` (`src/api/members.js`).
  * DTOs: `MemberResponse` now carries the full profile surface (`email`, `nickname`, `profileImage`, `handle`, `bio`, `role`, `company`, `location`, `primaryStack`, `interests`, `socialLinks`). `MemberUpdateRequest/Response` accept and return the same fields so ProfilePage/EditPage can rely on API data instead of the former `profileExtrasStorage` shim.
- **Posts**
  * Endpoints: create/list/detail/update/delete plus like/unlike/recommendations remain under `/api/v1/posts`.
  * DTOs:
    - `PostCreateRequest`/`PostUpdateRequest` include `summary`, `tags`, `seriesId`, `visibility`, `isDraft`, and `commentsAllowed` in addition to `memberId`, `title`, `content`, `image`.
    - `PostResponse` exposes the new metadata (`tags`, `seriesId`, `seriesName`, `visibility`).
    - `PostSummaryResponse` (list/recommendations) and `PageResponse` power pagination just as before.
- **Tags & Series**
  * New endpoints: `GET /api/v1/tags` (`src/api/tags.js`) and `GET/POST /api/v1/series` (`src/api/series.js`). DTOs `TagSummaryResponse` and `SeriesResponse` describe the payloads used by BlogListPage’s sidebar and PostPublishPage.
- **Comments**
  * Endpoints unchanged (`src/api/comments.js`), still returning `CommentResponse` wrapped in `PageResponse`.
- **Cloudinary**
  * `GET /api/v1/images/sign?type={profile|post}` remains the entry point for uploads; placeholder config (`cloudName: 'your-cloud-name'`) should be updated when real credentials are available.
- **Mock transport**
  * `MockServer` now keeps in-memory stores for members, series, posts, and tags so create/update/delete flows round-trip predictable data. All DTOs noted above are used by the mock implementation, making the switch to a real backend a drop-in change once `USE_MOCK` is set to `false`.

## 3. Mocking, local storage, drafts
- `src/api/base/axios.js` still defaults `USE_MOCK = true`, but `MockServer` now maintains in-memory stores for members, series, tags, and posts. Create/update/delete requests mutate those stores so subsequent GETs return consistent data.
- `AuthService` persists the issued access/refresh tokens plus the `member` payload in `localStorage`. The dev bootstrap remains available but disabled via `devAuthConfig.bypassAuth = false`.
- Profile data is sourced from the API; `profileExtrasStorage` is no longer required (and left only as a legacy helper).
- `PostCreatePage`/`PostPublishPage` persist draft content via `localStorage` (`postDraft`) but fetch metadata (tags/series) through the new APIs instead of hard-coded arrays.
- Newsletter/email subscriptions are still mocked via `NewsletterSubscribe`’s callback; wiring this to a backend remains future work.

## 4. Current gaps / reuse opportunities
- **Post detail resiliency**: `PostDetailPage` still swaps in a markdown mock if the API fails. Replacing this with a user-facing error (and possibly cached content) will make failures obvious, and the `Toast` component should report the failure while cached content keeps the last successful detail available briefly.
- **Client-side sorting/filtering**: Blog/Profile pages continue to page/filter in memory. Once the backend is available, forward the `search`/`sort` parameters through `getPosts` so totals and pagination are authoritative.
- **Newsletter & OAuth**: `NewsletterSubscribe` resolves via `setTimeout`, and OAuth buttons simply redirect without state. Hooking these into actual endpoints (or centralized mocks) plus surfaced toasts keeps UX consistent.
- **Publish UX polish**: PostPublishPage now consumes tag/series APIs and extended DTOs, but it still depends on `alert/confirm` and a bespoke overlay. Replace those with the shared `Toast`/`Modal`/`LoadingSpinner` components for consistent feedback and a11y.
- **Error surfaces**: Many async flows (series creation, Cloudinary upload, recommended posts fetch) log errors but never inform the user. Centralize these failures through a toast-based error helper so callers can easily notify users.

## 5. Next actions
1. Replace the PostDetail markdown fallback with proper error/loading states (cached when possible) and surface failures via `Toast`.
2. Push Blog/Profile sorting, searching, and pagination down to the API once the backend endpoints are reachable.
3. Wire newsletter/OAuth flows to real endpoints (or the mock server) and surface their results via the shared Toast component.
4. Adopt the shared Modal/Toast/LoadingSpinner components inside Publish flows and other long-running mutations instead of `alert`/`confirm`.
5. Keep the mock server in sync with backend contracts (e.g., add tag-filtered queries, expose comment like counts) to ensure switching `USE_MOCK` off remains painless.
