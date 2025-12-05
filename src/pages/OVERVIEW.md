# Pages Overview

| Page | Primary responsibility | Component split / refactor opportunities |
| --- | --- | --- |
| `BlogListPage` | Lists paginated posts, manages search query state, renders sidebar widgets (TopPosts/Tags) and pagination. | Extract a `SearchResultHeader` + `PostsGrid` component so other list pages can reuse that layout; wrap sidebar widgets in a `BlogSidebar` organism to keep the page lean. |
| `HomePage` | Simple placeholder hero describing the migration. | None today, but future hero/CTA blocks should be extracted into dedicated components (`HeroSection`, `FeatureList`). |
| `LoginPage` | Minimal layout with email/password form, error message, OAuth buttons. | Turn the `<form>` into a reusable `LoginForm` component and split footer links/social login into `LoginSupport` to enable modal usage. |
| `SignupPage` | Two-step signup wizard collecting account info and profile metadata. | Break into `SignupSteps` (progress indicator), `AccountInfoForm`, `ProfileInfoForm`, and `ProfileSocialLinks` components to avoid 80+ prop setters inside one file. |
| `OAuthCallbackPage` | Exchanges OAuth code for tokens, loads the user, navigates home. | Replace inline flexbox styles with a shared `FullPageLoader`, and move side effects into a `useOAuthCallback` hook for readability/tests. |
| `PostCreatePage` | Markdown editor with autosave, toolbar, preview, publish modal, handling both create/edit modes. | Extract `usePostDraft` for autosave/localStorage, `MarkdownEditorPane` for textarea handling, and `EditorStatusBar` for autosave text instead of inlining everything. |
| `PostDetailPage` | Displays a single post, recommended posts, and the comment section. | Comment state already uses hooks, but the article header + action buttons and the recommended posts grid could be their own components to simplify the page and enable reuse in e.g. a “reading mode”. |
| `ProfilePage` | Renders member profile info plus sortable/paginated post list. | Create a `ProfilePostsSection` atom containing sort tabs + pagination; also split the empty/loading view into reusable components. |
| `ProfileEditPage` | Large profile edit form with validation, unsaved-change guard, toasts, and preview. | Split into `BasicInfoForm`, `CareerInfoForm`, `StackInterestForm`, and `SocialLinksForm` components, and move toast/unsaved-change logic into hooks such as `useUnsavedChanges`. |
