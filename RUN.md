# 실행 방법

## 간단한 HTTP 서버로 실행

프로젝트 루트에서 다음 명령어 실행:

```bash
# Python 3 사용
python3 -m http.server 3000

# 또는 Python 2
python -m SimpleHTTPServer 3000

# 또는 npx 사용
npx http-server -p 3000
```

그 다음 브라우저에서 접속:
```
http://localhost:3000
```

## 디버깅

브라우저 개발자 도구(F12) 콘솔에서 다음 로그 확인:
- `initApp called`
- `Router created`
- `BlogListPage mounted`
- `Loading posts`

에러가 있다면 콘솔 메시지를 확인하세요.

## 현재 설정

- Mock API: **활성화** (`src/api/base/axios.js` - `USE_MOCK = true`)
- 메인 페이지: `/` → BlogListPage
- 포트: 3000 (변경 가능)
