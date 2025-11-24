# tech-blog 마이그레이션 마스터 플랜

## 1. 목표와 범위

- **목표**: `legacy/`에 있는 바닐라 JS 기반 Web Site를 **React + TypeScript(Vite)** 기반의 SPA로 **기능/디자인을 유지**하면서 점진적으로 마이그레이션한다.
- **범위**
  - UI 전부를 React 컴포넌트로 전환
  - JS → TS (DTO/타입 적극 활용)
  - CSS 구조 재정리 (global vs module.css)
  - API/인증/상태 관리 레이어 재구성

## 2. 현재 상태

- Vite 기반 **React + TypeScript** 프로젝트 생성 완료.
- 프로젝트 이름: **`tech-blog`**
- 빌드/개발 스크립트 동작 확인:
  - `npm run dev`
  - `npm run build`
  - `npm run preview`

세부 마이그레이션 계획과 체크리스트는 `Plan/migration-plan.md` 에 정리하고, 이 문서에는 **주요 방향과 상위 진행 상황**만 유지한다.

## 3. 상위 단계 플로우

1. React TS 추가 설정 및 도구 정비
2. 컨벤션 및 디렉터리 구조 확정
3. 기반 코드(Theme, Global, DTO, API, Utils, Validation) 구축
4. 공통 UI 컴포넌트 마이그레이션
5. 페이지 단위 마이그레이션 및 라우팅
6. 접근성·성능·리렌더링·비동기 안정성 점검

각 단계의 세부 작업과 체크리스트는 `Plan/migration-plan.md` 참고.

## 4. 작업 원칙 (요약)

- **선택이 필요한 경우**: 중요한 아키텍처/라이브러리 선택은 **반드시 사용자에게 다시 질문** 후 결정한다.
- **디자인 유지**: 기존 디자인/레이아웃과 크게 달라지지 않도록 한다.
- **JS → TS 우선**: any/unknown 남발 금지, DTO와 명시적 타입을 적극 사용.
- **DTO 우선**: API Req/Res, ViewModel은 DTO 기준으로 설계하고, 더미 데이터는 DTO와 분리해 관리.
- **CSS 전략**:
  - 전역 스타일: `global.css`, `theme.css` 등에 한정.
  - 컴포넌트/페이지 전용 스타일: **`*.module.css`** 사용.
- **React 기능 적극 활용**:
  - 라우팅: React Router 등으로 SPA 라우팅 구현.
  - 상태 관리: 초반에는 로컬 state + 간단한 Context 위주로 시작하고, 필요 시 React Query/Zustand로 확장.
  - 이미지/Markdown/Axios 등은 가급적 검증된 라이브러리 사용.
- **컴포넌트 분리**: 재사용성을 높이고, 하나의 파일이 비대해지는 것을 피한다.

## 7. 초기 필수 셋업 vs 추후 업그레이드

- 초기 필수 셋업
  - 폴더 구조 + `@` alias + env 패턴 정립
  - Axios 기반 `httpClient` 레이어 (직접 axios 호출 금지)
  - ESLint + Prettier 최소 설정
- 추후 업그레이드 대상
  - 상태 관리: React Query(TanStack Query) + Zustand
  - 폼/Validation: React Hook Form + Zod
  - HTTP 클라이언트: 향후 Next.js 환경에서 `fetch` 래퍼 기반으로 분리 설계

## 5. React/TS 품질 기준 (요약)

- 레이아웃 안정성
  - 이미지 크기 지정, Layout Shift 방지
  - 폰트 로딩 시 FOUT/FOIT 최소화
- 리렌더링 최소화
  - props 최소화, `React.memo`, 훅 분리 등 활용
- 비동기 안정성
  - 취소 가능한 요청, 로딩/에러 상태 명시
- 이벤트 처리 성능 관리
  - 불필요한 핸들러 생성/바인딩 최소화
- CSS 충돌 방지
  - 전역 클래스 최소화, module.css 적극 활용
- 상태 최소화와 설계 원칙
  - 필요 최소 범위에만 상태 두기, 파생 상태는 계산으로 해결
- 메모리 누수 방지
  - `useEffect` cleanup 필수, `addEventListener` → `removeEventListener`, Worker/Socket 해제
- 라우팅 전환 안정성
  - 전환 시 상태 초기화/유지 전략 명확히
- 접근성
  - 시맨틱 태그, aria-* 속성, 키보드 내비게이션, 포커스 관리

## 6. 문서 구조

- `CLAUDE.md` (이 문서)
  - 마이그레이션 **마스터 플랜**과 원칙, 상위 진행 상황 기록
- `Plan/migration-plan.md`
  - 구체적인 **단계별 계획, 체크리스트, TODO** 상세 기술

향후 큰 방향/진행 상황이 바뀔 때마다 이 문서를 업데이트하고, 개별 태스크/세부 단계는 `Plan/` 이하 문서에서 관리한다.
