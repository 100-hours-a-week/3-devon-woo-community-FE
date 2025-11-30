# Components Overview

| Component (path) | Primary role | Refactor / follow-up ideas |
| --- | --- | --- |
| `BlogCard/BlogCard.tsx` | Renders a post summary card with inline date formatting and stat icons. | Extract `formatDate` into `utils/formatters`, and consider a skeleton/loading variant so cards do not reflow when data is pending. |
| `CommentItem/CommentItem.tsx` + `CommentReportModal.tsx` | Presentational comment row with like/report/edit controls and modal. | Dropdown visibility + report alert logic could move to a `useDropdown`/`useCommentActions` hook to avoid per-instance event listeners; also replace `alert` with `Toast`. |
| `CommentList/CommentList.tsx` | Lists comments, exposes a header with sort dropdown, optional composer. | Sorting UI could be its own `CommentListHeader` to reuse on profile detail; keep list purely for rendering (no DOM IDs). |
| `CommentWrite/CommentWrite.tsx` | Controlled textarea form for new comments with max-length guard. | Surface error/submit states via props instead of `alert`, and allow parent to control the value for optimistic updates. |
| `EmptyState/EmptyState.tsx` | Simple “no data” placeholder component. | Allow passing illustration/CTA props to reduce ad-hoc empty states elsewhere. |
| `Footer/Footer.tsx` | Static multi-column footer. | Move links/social metadata into `config/navigation.ts` so content changes do not require JSX edits. |
| `FormField/FormField.tsx` | Generic input/textarea wrapper with label, helper text, password toggle. | Split into `TextField` + `TextareaField` and expose `ref` forwarding for form libraries; consolidate validation styles. |
| `Header/Header.tsx` | Global header with logo, nav, search, auth/profile menu. | Extract `SearchForm` and `ProfileMenu` subcomponents to shrink responsibilities; consider `useAuth`-less variant for marketing pages. |
| `LoadingSpinner/LoadingSpinner.tsx` | Simple spinner overlay. | Allow size/color props and align with design tokens. |
| `NewsletterSubscribe/NewsletterSubscribe.tsx` | Newsletter signup panel with internal validation / success state. | Reuse `validateEmail` from `utils/validators`, and expose callbacks for analytics. |
| `Pagination/Pagination.tsx` | Renders page numbers + next/prev buttons. | Add keyboard accessibility and allow custom labels for i18n. |
| `PostEditor/*` (`ComposeHeader`, `EditorToolbar`, `MarkdownPreview`, `PublishModal`) | Building blocks for editor experience (header actions, toolbar, preview pane, publish modal). | Styles live in a shared CSS file; consider migrating to CSS Modules and exposing a single `PostEditor` composite for easier consumption. |
| `PostItem/PostItem.tsx` | Row item in the blog list with gradient thumbnail and fallback excerpt. | Replace hard-coded `generateExcerpt` text with data-driven summary and extract category text to config. |
| `ProfileCard/ProfileCard.tsx` | Shows member profile, social links, edit action. | Accept skeleton/loading props so ProfilePage can reuse while data is fetching. |
| `ProfileImageUploader/ProfileImageUploader.tsx` | Dropzone-style uploader with preview + clear actions. | Move `FileReader` logic into a hook so multiple uploaders can share progress/error UI. |
| `ScrollToTopButton/ScrollToTopButton.tsx` | Floating “scroll to top” button triggered after threshold. | Convert to intersection observer hook for better performance and make icon customizable. |
| `Sidebar/Sidebar.tsx` | Layout wrapper for sidebar widgets. | Could accept `title`/`sticky` props to reduce custom wrappers in pages. |
| `SocialLogin/SocialLoginButtons.tsx` + `ProviderIcons.tsx` | OAuth provider buttons with provider-specific icons. | Co-locate provider metadata (`id`, `label`, `color`) in a config array to avoid switch statements when adding new providers. |
| `TagCloud/TagCloud.tsx` | Tag chips with selectable state and optional click handler. | Export selected tag state via controlled props so host can reset selection when filters clear. |
| `Toast/Toast.tsx` | Simple toast/notification component. | Generalize into a hook-driven toast system with queue support. |
| `TopPostsList/TopPostsList.tsx` | Ordered list of top posts, used in sidebar. | Accept loading/error props to show skeletons while `useTopPosts` fetches data. |
| `BlogCard`, `PostItem`, `PostEditor` siblings | Template-like UI atoms for posts/editing. | They currently embed business copy; move strings into locales/config and share number/date utils for consistency. |

> **Note:** Most components align with the architecture goal (UI-only). The key refactor targets are `Header`, `FormField`, and the comment-related widgets where non-UI logic still lives, plus components with hard-coded content that should move into config or translations.
