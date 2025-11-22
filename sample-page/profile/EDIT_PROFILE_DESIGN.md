# 프로필 편집 페이지 디자인

## 개요
사용자가 자신의 프로필 정보를 수정할 수 있는 페이지입니다. Tech Blog의 일관된 디자인을 유지하면서, 직관적이고 사용하기 쉬운 인터페이스를 제공합니다.

## 페이지 목적
- 프로필 사진 업로드 및 변경
- 기본 정보 수정 (이름, 한 줄 소개)
- 상세 자기소개 작성
- 소셜 링크 추가
- 변경 사항 저장

## 레이아웃 구조

```
+---------------------------------------------------------------+
|                          Header                               |
|  Tech Blog  |  Home  Posts  About Me  Tags  Contact  | [🔍] [🌙] |
+---------------------------------------------------------------+

                    +------------------------------+
                    |    프로필 편집 카드           |
                    |  (max-width: 680px)          |
                    |                              |
                    |  [프로필 사진 섹션]            |
                    |    - 160x160 원형 이미지      |
                    |    - "사진 변경" 버튼         |
                    |                              |
                    |  [기본 정보]                  |
                    |    이름: [____________]       |
                    |    한 줄 소개: [____________] |
                    |                              |
                    |  [자기소개]                   |
                    |    [________________]         |
                    |    [________________]         |
                    |    [________________]         |
                    |    (0 / 300)                 |
                    |                              |
                    |  [소셜 링크]                  |
                    |    GitHub: [____________]     |
                    |    Twitter: [____________]    |
                    |    Website: [____________]    |
                    |                              |
                    |  [취소]  [변경사항 저장]       |
                    +------------------------------+

+---------------------------------------------------------------+
|                          Footer                               |
+---------------------------------------------------------------+
```

## 섹션별 상세 설계

### 1. 헤더
- Profile 페이지와 동일한 헤더 사용
- 로고, 네비게이션 메뉴, 검색, 다크모드 토글
- Sticky 헤더 (스크롤 시 상단 고정)

### 2. 프로필 사진 섹션

#### 2.1 현재 프로필 사진
- 크기: 160x160px
- 형태: 원형 (border-radius: 50%)
- 테두리: 4px solid var(--bg-primary)
- 그림자: var(--shadow-md)

#### 2.2 사진 변경 버튼
```
위치: 프로필 사진 하단 중앙
스타일: Secondary 버튼
텍스트: "사진 변경"
아이콘: 카메라 SVG
```

#### 2.3 파일 선택
- 지원 포맷: JPG, PNG, GIF (최대 5MB)
- 미리보기 기능
- 드래그 앤 드롭 또는 클릭하여 선택

### 3. 기본 정보 입력

#### 3.1 이름
```
라벨: "이름" (필수)
타입: text
플레이스홀더: "이름을 입력하세요"
최대 길이: 50자
검증: 필수 입력
```

#### 3.2 한 줄 소개
```
라벨: "한 줄 소개" (선택)
타입: text
플레이스홀더: "간단한 소개를 입력하세요"
최대 길이: 100자
검증: 선택 입력
예시: "A passionate developer"
```

### 4. 상세 정보

#### 4.1 자기소개
```
라벨: "자기소개" (선택)
타입: textarea
플레이스홀더: "자신을 소개해주세요"
최대 길이: 300자
행 수: 6
문자 수 카운터: 실시간 표시 "0 / 300"
```

### 5. 소셜 링크

#### 5.1 GitHub
```
라벨: "GitHub"
타입: url
플레이스홀더: "https://github.com/username"
아이콘: GitHub 로고
검증: URL 형식
```

#### 5.2 Twitter
```
라벨: "Twitter"
타입: url
플레이스홀더: "https://twitter.com/username"
아이콘: Twitter 로고
검증: URL 형식
```

#### 5.3 Website
```
라벨: "Website"
타입: url
플레이스홀더: "https://your-website.com"
아이콘: Globe
검증: URL 형식
```

### 6. 액션 버튼

#### 6.1 취소 버튼
```
스타일: Secondary
텍스트: "취소"
기능: 변경 사항 무시하고 프로필 페이지로 이동
확인: 변경 사항이 있으면 확인 다이얼로그 표시
```

#### 6.2 저장 버튼
```
스타일: Primary
텍스트: "변경사항 저장"
아이콘: 저장 SVG
기능: 폼 검증 후 서버에 저장
피드백: 성공/실패 메시지 표시
```

## 색상 및 스타일

### 색상 스키마 (CSS 변수)

```css
라이트 모드:
--bg-primary: #ffffff
--bg-secondary: #f9fafb
--bg-card: #fafafa
--text-primary: #1f2937
--text-secondary: #6b7280
--text-tertiary: #9ca3af
--border-color: #e5e7eb
--accent-color: #667eea
--accent-hover: #5568d3
--error-color: #f44336
--success-color: #4caf50

다크 모드:
--bg-primary: #1f2937
--bg-secondary: #111827
--bg-card: #374151
--text-primary: #f9fafb
--text-secondary: #9ca3af
--text-tertiary: #6b7280
--border-color: #4b5563
```

### 타이포그래피

```
페이지 제목: 28px, 700 weight
섹션 제목: 16px, 600 weight
라벨: 14px, 600 weight
입력 필드: 15px, 400 weight
도움말/힌트: 13px, 400 weight
버튼: 15px, 600 weight
```

### 간격

```
섹션 간격: 32px
폼 그룹 간격: 24px
라벨-입력 간격: 8px
버튼 간격: 12px
카드 패딩: 48px (모바일: 24px)
```

### 입력 필드 스타일

```css
.form-input {
    width: 100%;
    padding: 14px 16px;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    background-color: var(--bg-secondary);
    font-size: 15px;
    transition: all 0.2s ease;
}

.form-input:focus {
    background-color: var(--bg-primary);
    border-color: var(--accent-color);
    outline: none;
}

.form-input:disabled {
    background-color: var(--bg-secondary);
    color: var(--text-tertiary);
    cursor: not-allowed;
}
```

### 버튼 스타일

```css
Primary 버튼:
- background: var(--accent-color)
- color: white
- padding: 14px 28px
- border-radius: 8px
- font-weight: 600
- hover: background var(--accent-hover)

Secondary 버튼:
- background: transparent
- border: 1px solid var(--border-color)
- color: var(--text-secondary)
- padding: 14px 28px
- border-radius: 8px
- hover: background var(--bg-secondary)
```

## 반응형 디자인

### 데스크톱 (1024px 이상)
- 카드 max-width: 680px
- 카드 패딩: 48px
- 입력 필드 폰트: 15px

### 태블릿 (768px - 1023px)
- 카드 max-width: 100%
- 카드 패딩: 40px
- 입력 필드 폰트: 15px

### 모바일 (767px 이하)
- 카드 max-width: 100%
- 카드 패딩: 24px
- 입력 필드 폰트: 14px
- 헤더 단순화
- 버튼 전체 너비
- 프로필 사진 크기: 120x120px

## 폼 검증 규칙

### 필수 입력
- 이름: 1자 이상 50자 이하

### 선택 입력
- 한 줄 소개: 최대 100자
- 자기소개: 최대 300자
- 소셜 링크: 유효한 URL 형식

### 에러 메시지

```
이름 비어있음: "이름을 입력해주세요"
이름 너무 김: "이름은 50자 이하로 입력해주세요"
한 줄 소개 너무 김: "한 줄 소개는 100자 이하로 입력해주세요"
자기소개 너무 김: "자기소개는 300자 이하로 입력해주세요"
잘못된 URL: "올바른 URL을 입력해주세요"
파일 크기 초과: "이미지 파일은 5MB 이하로 업로드해주세요"
지원하지 않는 파일: "JPG, PNG, GIF 형식만 지원합니다"
```

## 인터랙션

### 프로필 사진 변경
1. "사진 변경" 버튼 클릭
2. 파일 선택 다이얼로그 표시
3. 이미지 선택
4. 즉시 미리보기 표시
5. 저장 버튼 클릭 시 업로드

### 입력 필드
- 포커스 시 테두리 색상 변경 (#667eea)
- 에러 시 테두리 빨강 + 에러 메시지 표시
- 실시간 문자 수 카운팅 (자기소개)

### 저장
1. 폼 검증
2. 에러 있으면 에러 메시지 표시 + 포커스
3. 성공 시 서버에 전송
4. 로딩 인디케이터 표시
5. 성공 메시지 + 프로필 페이지로 리다이렉트

### 취소
1. 변경 사항 확인
2. 변경 있으면 확인 다이얼로그
3. 확인 시 프로필 페이지로 이동

## 접근성

- 모든 입력 필드에 label 연결
- 키보드 네비게이션 지원
- ARIA 라벨 사용
- 색각 이상자를 위한 에러 표시 (색상 + 아이콘)
- 충분한 색상 대비
- 포커스 표시

## 성능

- 이미지 미리보기: FileReader API 사용
- 파일 크기 제한: 5MB
- 디바운싱: 실시간 검증 (300ms)
- 최적화된 이미지 업로드 (리사이징)

## 참고 페이지

- 레이아웃: publish.html (게시글 출간 페이지)
- 헤더: profile.html (프로필 페이지)
- 입력 필드: signup.html (회원가입 페이지)
- 버튼: 공통 스타일
- 색상: profile.css의 CSS 변수
