# TechBlog 프론트엔드

TechBlog는 순수 자바스크립트로 구현된 SPA(싱글 페이지 애플리케이션) 프론트엔드입니다. React 스타일의 컴포넌트를 기반으로 라우터, 전역 헤더, DTO 중심의 API 호출, 재사용 가능한 UI 조각을 구성하여 마치 React 환경에서 동작하는 것처럼 설계되어 있습니다.

현재 프로젝트의 핵심 흐름은 다음과 같습니다.

- **라우팅/헤더**: `src/app.js`에서 헤더와 메인 컨테이너를 모두 마운트하며 `Router`를 통해 페이지 간 네비게이션과 헤더 상태를 유지합니다.
- **페이지**: `pages/` 폴더 아래 Login, Signup, BlogList, PostCreate/Publish, Profile, ProfileEdit, PostDetail 등 각 화면이 컴포넌트로 구현되어 있습니다. 각 페이지는 상태 관리, API 호출, 이벤트 위임을 자체적으로 수행합니다.
- **컴포넌트**: `Header`, 사이드바/위젯(TopPostsList, TagCloud, NewsletterSubscribe), `PostItem` 등의 재사용 UI를 갖추고 있으며, `LoadingSpinner`, `Modal`, `Toast` 같은 유틸리티 컴포넌트도 준비되어 있습니다.
- **API & DTO**: `src/api/`에서 Axios/MockServer를 통해 Auth, Members, Posts, Comments, Tags, Series, Cloudinary 등을 호출하며, `dto/`에는 요청/응답 구조체와 더미 데이터 생성기가 포함되어 있어 API 계약을 문서화하고 모킹을 일관되게 유지합니다.
- **토폴로지**: 로컬스토리지에 토큰/유저 정보를 보관하고 Profile과 Write 흐름은 이를 기반으로 데이터를 보강하며, 모킹 서버가 시리즈/태그/포스트/유저 데이터를 관리하므로 `USE_MOCK`을 끄기 전까지 실제 백엔드가 없는 상태에서도 전체 흐름을 검증할 수 있습니다.

현재 가장 중요한 작업은 실제 API/DTO를 호출하는 경로로 전환하면서도 기존 스타일과 UX를 유지하는 것입니다. TechBlog 컨셉에 맞춰 카드형 포스트, 태그 기반 필터, 프로필 중심 메뉴를 중심으로 기능을 확장해나갈 계획입니다.
