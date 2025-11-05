# 커뮤니티 사이트

바닐라 JavaScript로 구현한 간단한 커뮤니티 사이트입니다.

## 프로젝트 구조

```
3-devon-woo-community-FE/
├── index.html                 # 메인 HTML 파일
├── src/
│   ├── components/           # 재사용 가능한 컴포넌트
│   │   ├── Header.js        # 헤더 컴포넌트
│   │   ├── Footer.js        # 푸터 컴포넌트
│   │   └── PostItem.js      # 게시글 아이템 컴포넌트
│   ├── pages/               # 페이지 컴포넌트
│   │   ├── LoginPage.js     # 로그인 페이지
│   │   ├── PostListPage.js  # 게시글 리스트 페이지
│   │   ├── PostDetailPage.js # 게시글 상세 페이지
│   │   └── ProfilePage.js   # 개인정보 페이지
│   ├── router/              # 라우팅 시스템
│   │   └── router.js        # 해시 기반 라우터
│   ├── styles/              # CSS 스타일
│   │   ├── global.css       # 전역 스타일
│   │   ├── components.css   # 컴포넌트 스타일
│   │   └── pages.css        # 페이지 스타일
│   └── app.js               # 앱 진입점
└── README.md
```

## 기능

- **로그인 페이지**: 사용자 로그인 UI
- **게시글 리스트**: 게시글 목록 조회
- **게시글 상세**: 게시글 상세 정보 및 댓글
- **개인정보**: 사용자 프로필 정보

## 실행 방법

Node.js나 빌드 도구 없이 바로 실행 가능합니다.

### 방법 1: Live Server 사용 (추천)

VSCode의 Live Server 확장 프로그램을 설치한 후:

1. `index.html` 파일을 엽니다
2. 우클릭 → "Open with Live Server" 선택

### 방법 2: Python 서버 사용

```bash
# Python 3
python -m http.server 8000

# 브라우저에서 http://localhost:8000 접속
```

### 방법 3: 다른 로컬 서버

원하는 로컬 서버를 사용할 수 있습니다.

## 라우팅

해시 기반 라우팅을 사용합니다:

- `#/login` - 로그인 페이지
- `#/posts` - 게시글 리스트
- `#/posts/:id` - 게시글 상세 (예: `#/posts/1`)
- `#/profile` - 개인정보 페이지

## 향후 작업 (TODO)

현재는 기본 구조만 구축된 상태입니다. 다음 작업들이 필요합니다:

- [ ] API 연동
- [ ] 로그인/로그아웃 로직 구현
- [ ] 게시글 CRUD 기능
- [ ] 댓글 기능
- [ ] 상태 관리
- [ ] 로컬 스토리지 활용
- [ ] 폼 검증

## React 마이그레이션 고려사항

이 프로젝트는 향후 React로 전환할 수 있도록 설계되었습니다:

- 컴포넌트 기반 구조
- 명확한 파일 분리
- props를 통한 데이터 전달 패턴
- 이벤트 핸들러 분리

## 기술 스택

- 바닐라 JavaScript (ES6+)
- CSS3
- HTML5
