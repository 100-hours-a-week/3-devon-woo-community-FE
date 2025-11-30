# Toast UI Editor 도입 계획

## 1. 준비 작업
- 필요한 패키지 설치: `@toast-ui/editor`, `@toast-ui/editor/dist/i18n/ko-kr`, 이미지 업로드 훅에서 사용할 HTTP 클라이언트(기존 `postApi` 활용 여부 확인) 및 필요 시 코드 하이라이트용 `prismjs`/`highlight.js`.
- 전역 스타일에 Toast UI CSS와 다크모드 대응을 import. 기존 Markdown 관련 CSS 충돌 여부를 확인하고 정리한다.

## 2. 에디터 래퍼 컴포넌트 작성
- `src/components/PostEditor` 아래 `ToastMarkdownEditor.tsx`(가칭) 생성.
- Toast UI Editor 인스턴스를 ref로 관리하고 `value`, `onChange`, `onUploadImage`, `autosave` 등 현재 PostCreatePage에서 사용하는 책임을 props로 노출.
- 기존 textarea 기반 단축키/toolbar 로직 중 Toast UI가 기본 제공하는 기능은 제거하거나 Toast UI의 툴바 옵션으로 매핑.

## 3. 이미지 업로드 공통 훅 설계
- Cloudinary Presigned / S3 Presigned 양쪽을 지원하는 `uploadImage` 유틸 작성 (`src/lib/uploads` 등).
- Toast UI의 `hooks.addImageBlobHook`에서 해당 유틸을 호출해 업로드 → URL 반환 → `callback(url, altText)` 호출.
- 업로드 대상 선택 UI(드롭다운/토글)을 ComposeHeader 혹은 에디터 툴바 부근에 배치하고 사용자가 Cloudinary/S3를 선택하면 훅에서 그 설정을 참조.

## 4. PostCreatePage 통합
- 기존 `contentTextareaRef`, `applyFormat`, `EditorToolbar`, `MarkdownPreview` 등을 Toast UI 기반으로 교체.
- `content` 상태는 Toast UI에서 `onChange`로 전달받아 동일한 autosave/검증 로직을 사용. autosave 시점이 Toast UI 내부 값과 싱크되는지 검증.
- 프리뷰 토글은 Toast UI의 split/preview 모드를 그대로 노출하거나, 기존처럼 별도 버튼으로 `editorInstance.changePreviewStyle()`을 호출해 토글.
- 이미지 업로드 경고, 임시 저장(로컬스토리지) 등 기존 UX가 유지되도록 Toast UI 이벤트에 맞춰 조정.

## 5. 디스플레이(Viewer) 교체
- 상세 페이지나 목록에서 사용하는 `MarkdownPreview`를 Toast UI Viewer 기반으로 재구현하거나 공존시키기 위한 `ToastMarkdownViewer`를 추가.
- 서버에서 내려오는 마크다운을 동일한 CSS/렌더러로 보여주어 작성 화면과 읽기 화면의 스타일 일관성을 맞춘다.

## 6. 테스트 및 검증
- 에디터 렌더링, 툴바 동작, 로컬스토리지 임시 저장, 업로드 선택(Cloudinary/S3), 게시/임시저장 API 호출까지 수동 확인.
- SSR/빌드 환경에서 Toast UI import가 문제없는지 확인하고, 필요 시 dynamic import나 `import.meta.env.SSR` 가드 추가.
- 접근성 및 다국어(ko-KR 로케일) 설정이 정상 작동하는지 검증.

## 7. 문서 및 마이그레이션 가이드
- `COMPONENTS.md` 및 관련 문서에 Toast UI Editor 사용법, 이미지 업로드 설정 방법, 새 컴포넌트 API를 기록.
- 구버전 Markdown 컴포넌트를 사용하는 다른 페이지가 있는지 확인하고, 순차 마이그레이션 일정과 영향을 명시.
