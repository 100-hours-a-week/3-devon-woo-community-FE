export const mockSummaries = [
  "JavaScript는 끊임없이 진화하고 있습니다. ES2024의 새로운 기능들인 Temporal API, Pattern Matching, Record & Tuple 등을 실무에서 어떻게 활용할 수 있는지 알아봅니다.",
  "React 애플리케이션의 성능을 개선하는 다양한 방법들을 소개합니다. useMemo, useCallback, React.memo를 활용한 메모이제이션 기법과 코드 스플리팅, 가상화 등을 효과적으로 사용하는 법을 배워봅시다.",
  "Node.js의 비동기 처리 방식에 대해 깊이 있게 다룹니다. Event Loop의 동작 원리, Promise, async/await, 병렬 처리 등 효율적이고 확장 가능한 Node.js 애플리케이션을 만드는 방법을 이해해봅시다.",
  "2025년 웹 개발 트렌드를 정리했습니다. AI 기반 개발 도구, Edge Computing, React Server Components, TypeScript, WebAssembly 등 최신 프레임워크, 도구, 그리고 베스트 프랙티스를 소개합니다.",
  "기존 JavaScript 프로젝트를 TypeScript로 전환하는 실전 가이드입니다. 환경 설정부터 점진적 변환, 타입 정의까지 단계별로 안전하게 마이그레이션하는 방법을 알아봅니다.",
  "Event Driven Architecture에서 메시지 발행의 신뢰성을 보장하는 Transactional Outbox 패턴을 소개합니다. Polling Publisher 방식을 중심으로 DB 트랜잭션과 Message Broker 간의 완전성을 보장하는 방법을 알아봅니다."
];

export const mockMarkdownContents = [
  `# JavaScript 최신 기능 소개

JavaScript는 끊임없이 진화하고 있습니다. ES2024의 새로운 기능들과 실무에서 어떻게 활용할 수 있는지 알아봅니다.

## 1. Temporal API

기존 Date 객체의 문제점을 해결하기 위해 등장한 새로운 날짜/시간 API입니다.

\`\`\`javascript
const now = Temporal.Now.instant();
const zonedDateTime = now.toZonedDateTimeISO('Asia/Seoul');
console.log(zonedDateTime.toString());
\`\`\`

### 주요 특징

- **불변성**: 모든 Temporal 객체는 불변입니다
- **시간대 지원**: 명시적인 시간대 처리
- **정확성**: 더 정확한 날짜 계산

## 2. Pattern Matching

다른 언어에서 익숙한 패턴 매칭이 JavaScript에도 도입되었습니다.

\`\`\`javascript
const result = match(value) {
  when({ type: 'user' }): handleUser,
  when({ type: 'admin' }): handleAdmin,
  default: handleDefault
};
\`\`\`

## 3. Record & Tuple

불변 데이터 구조를 위한 새로운 원시 타입입니다.

\`\`\`javascript
const record = #{
  name: 'Alice',
  age: 30
};

const tuple = #[1, 2, 3];
\`\`\`

> **Note**: Record와 Tuple은 깊은 불변성을 보장합니다.

---

## 실무 활용 팁

1. **점진적 도입**: 새로운 기능을 한 번에 도입하지 말고 점진적으로 적용하세요
2. **트랜스파일**: 브라우저 호환성을 위해 Babel을 활용하세요
3. **테스트**: 새로운 기능 도입 시 충분한 테스트를 작성하세요

## 결론

최신 JavaScript 기능들을 활용하면 더 안전하고 표현력 있는 코드를 작성할 수 있습니다.`,

  `# React 성능 최적화 팁

React 애플리케이션의 성능을 개선하는 다양한 방법들을 소개합니다.

## 메모이제이션 기법

### useMemo

계산 비용이 높은 값을 캐싱할 때 사용합니다.

\`\`\`jsx
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(a, b);
}, [a, b]);
\`\`\`

### useCallback

함수를 메모이제이션하여 불필요한 리렌더링을 방지합니다.

\`\`\`jsx
const handleClick = useCallback(() => {
  doSomething(a, b);
}, [a, b]);
\`\`\`

### React.memo

컴포넌트를 메모이제이션하여 props가 변경되지 않으면 리렌더링을 방지합니다.

\`\`\`jsx
const MemoizedComponent = React.memo(({ value }) => {
  return <div>{value}</div>;
});
\`\`\`

## 코드 스플리팅

### React.lazy

동적 import를 사용하여 컴포넌트를 지연 로딩합니다.

\`\`\`jsx
const LazyComponent = React.lazy(() => import('./LazyComponent'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyComponent />
    </Suspense>
  );
}
\`\`\`

## 가상화

긴 리스트를 렌더링할 때는 가상화를 활용하세요.

\`\`\`jsx
import { FixedSizeList } from 'react-window';

const Row = ({ index, style }) => (
  <div style={style}>Row {index}</div>
);

const List = () => (
  <FixedSizeList
    height={400}
    itemCount={1000}
    itemSize={35}
    width="100%"
  >
    {Row}
  </FixedSizeList>
);
\`\`\`

> **Warning**: 가상화는 DOM 노드 수를 줄여 성능을 크게 향상시킵니다.

---

## 성능 측정

React DevTools Profiler를 활용하여 성능 병목 지점을 찾으세요.

- [ ] 불필요한 리렌더링 확인
- [ ] 컴포넌트 렌더링 시간 측정
- [ ] 메모이제이션 효과 검증

## 마무리

성능 최적화는 측정 → 분석 → 개선의 반복 과정입니다. 항상 실제 성능을 측정하며 최적화하세요.`,

  `# Node.js 비동기 프로그래밍

Node.js의 비동기 처리 방식에 대해 깊이 있게 다룹니다.

## Event Loop 이해하기

Event Loop는 Node.js의 핵심 개념입니다.

### Event Loop의 단계

1. **Timers**: setTimeout, setInterval 콜백 실행
2. **Pending Callbacks**: I/O 콜백 처리
3. **Idle, Prepare**: 내부 용도
4. **Poll**: 새로운 I/O 이벤트 조회
5. **Check**: setImmediate 콜백 실행
6. **Close Callbacks**: close 이벤트 처리

\`\`\`javascript
console.log('1');

setTimeout(() => console.log('2'), 0);

setImmediate(() => console.log('3'));

process.nextTick(() => console.log('4'));

console.log('5');
\`\`\`

출력 순서: 1 → 5 → 4 → 2 → 3 (또는 2와 3의 순서가 바뀔 수 있음)

## Promise

Promise는 비동기 작업의 최종 완료 또는 실패를 나타내는 객체입니다.

### Promise 생성

\`\`\`javascript
const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('Success!');
  }, 1000);
});

promise.then(result => {
  console.log(result);
}).catch(error => {
  console.error(error);
});
\`\`\`

### Promise 체이닝

\`\`\`javascript
fetch('/api/user')
  .then(response => response.json())
  .then(user => fetch(\`/api/posts/\${user.id}\`))
  .then(response => response.json())
  .then(posts => console.log(posts))
  .catch(error => console.error(error));
\`\`\`

## async/await

Promise를 더 직관적으로 사용할 수 있게 해주는 문법입니다.

\`\`\`javascript
async function fetchUserPosts(userId) {
  try {
    const userResponse = await fetch(\`/api/user/\${userId}\`);
    const user = await userResponse.json();

    const postsResponse = await fetch(\`/api/posts/\${user.id}\`);
    const posts = await postsResponse.json();

    return posts;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
\`\`\`

## 병렬 처리

### Promise.all

모든 Promise가 완료될 때까지 기다립니다.

\`\`\`javascript
const [users, posts, comments] = await Promise.all([
  fetch('/api/users').then(r => r.json()),
  fetch('/api/posts').then(r => r.json()),
  fetch('/api/comments').then(r => r.json())
]);
\`\`\`

### Promise.race

가장 먼저 완료되는 Promise의 결과를 반환합니다.

\`\`\`javascript
const result = await Promise.race([
  fetch('/api/fast'),
  fetch('/api/slow')
]);
\`\`\`

> **Tip**: 병렬 처리를 활용하면 성능을 크게 향상시킬 수 있습니다.

---

## 에러 핸들링

비동기 코드에서 에러 핸들링은 매우 중요합니다.

\`\`\`javascript
async function safeAsyncOperation() {
  try {
    const result = await riskyOperation();
    return result;
  } catch (error) {
    logger.error('Operation failed:', error);
    return defaultValue;
  } finally {
    cleanup();
  }
}
\`\`\`

## 결론

비동기 프로그래밍을 마스터하면 효율적이고 확장 가능한 Node.js 애플리케이션을 만들 수 있습니다.`,

  `# 웹 개발 트렌드 2025

2025년 웹 개발 트렌드를 정리했습니다. 최신 프레임워크, 도구, 그리고 베스트 프랙티스를 소개합니다.

## 1. AI 기반 개발 도구

AI가 개발 프로세스를 혁신하고 있습니다.

### GitHub Copilot & ChatGPT

코드 작성부터 디버깅까지 AI가 도와줍니다.

\`\`\`typescript
// AI가 컨텍스트를 이해하고 자동 완성을 제공합니다
async function fetchData<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(\`HTTP error! status: \${response.status}\`);
  }
  return response.json();
}
\`\`\`

## 2. Edge Computing

엣지에서의 컴퓨팅이 더욱 중요해지고 있습니다.

### Vercel Edge Functions

\`\`\`javascript
export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  const geo = request.geo;
  return new Response(\`Hello from \${geo.city}\`);
}
\`\`\`

## 3. 서버 컴포넌트

React Server Components가 주류로 자리잡았습니다.

\`\`\`jsx
// app/page.tsx (Server Component)
async function Page() {
  const data = await fetch('https://api.example.com/data');
  const posts = await data.json();

  return (
    <div>
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
\`\`\`

## 4. TypeScript의 지배

TypeScript는 이제 선택이 아닌 필수입니다.

### 타입 안정성

\`\`\`typescript
interface User {
  id: number;
  name: string;
  email: string;
}

type UserResponse = {
  data: User[];
  total: number;
  page: number;
};

async function getUsers(page: number): Promise<UserResponse> {
  const response = await fetch(\`/api/users?page=\${page}\`);
  return response.json();
}
\`\`\`

## 5. Web Assembly

성능이 중요한 작업에 WebAssembly를 활용합니다.

\`\`\`javascript
const wasmModule = await WebAssembly.instantiateStreaming(
  fetch('module.wasm')
);

const result = wasmModule.instance.exports.heavyComputation(input);
\`\`\`

## 6. 성능 최적화

### Core Web Vitals

- **LCP** (Largest Contentful Paint): 2.5초 이하
- **FID** (First Input Delay): 100ms 이하
- **CLS** (Cumulative Layout Shift): 0.1 이하

> **Important**: Core Web Vitals는 SEO 순위에도 영향을 미칩니다.

## 7. 마이크로 프론트엔드

대규모 애플리케이션을 작은 단위로 분할합니다.

\`\`\`javascript
import { registerApplication, start } from 'single-spa';

registerApplication({
  name: '@org/navbar',
  app: () => import('@org/navbar'),
  activeWhen: ['/']
});

start();
\`\`\`

## 8. 정리

- [ ] AI 도구 활용하기
- [ ] 엣지 컴퓨팅 고려하기
- [ ] TypeScript 도입하기
- [ ] 성능 모니터링 설정하기

---

## 결론

웹 개발은 빠르게 진화하고 있습니다. 최신 트렌드를 따라가며 지속적으로 학습하는 것이 중요합니다.`,

  `# TypeScript로 마이그레이션하기

기존 JavaScript 프로젝트를 TypeScript로 전환하는 실전 가이드입니다. 단계별로 안전하게 마이그레이션하는 방법을 알아봅니다.

## 왜 TypeScript인가?

### 주요 이점

1. **타입 안정성**: 컴파일 타임에 에러 발견
2. **개발자 경험**: 더 나은 자동완성과 리팩토링
3. **문서화**: 코드 자체가 문서 역할
4. **유지보수**: 대규모 프로젝트에서 특히 유용

## 마이그레이션 전략

### 1단계: 환경 설정

먼저 TypeScript와 관련 도구를 설치합니다.

\`\`\`bash
npm install --save-dev typescript @types/node
npx tsc --init
\`\`\`

### 2단계: tsconfig.json 설정

\`\`\`json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "allowJs": true,
    "checkJs": false,
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": false,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
\`\`\`

> **Tip**: 처음에는 \`strict: false\`로 시작하고, 점진적으로 strict 모드를 활성화하세요.

### 3단계: 점진적 변환

한 번에 모든 파일을 변환하지 말고, 중요도가 낮은 파일부터 시작합니다.

#### Before (JavaScript)

\`\`\`javascript
function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price, 0);
}
\`\`\`

#### After (TypeScript)

\`\`\`typescript
interface Item {
  id: number;
  name: string;
  price: number;
}

function calculateTotal(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}
\`\`\`

### 4단계: 타입 정의

외부 라이브러리의 타입 정의를 설치합니다.

\`\`\`bash
npm install --save-dev @types/react @types/react-dom
npm install --save-dev @types/express @types/node
\`\`\`

## 실전 예제

### API 응답 타입 정의

\`\`\`typescript
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

interface User {
  id: number;
  username: string;
  email: string;
  createdAt: Date;
}

async function fetchUser(id: number): Promise<ApiResponse<User>> {
  const response = await fetch(\`/api/users/\${id}\`);
  return response.json();
}
\`\`\`

### 제네릭 활용

\`\`\`typescript
class DataStore<T> {
  private items: T[] = [];

  add(item: T): void {
    this.items.push(item);
  }

  get(index: number): T | undefined {
    return this.items[index];
  }

  getAll(): T[] {
    return [...this.items];
  }
}

const userStore = new DataStore<User>();
userStore.add({ id: 1, username: 'alice', email: 'alice@example.com', createdAt: new Date() });
\`\`\`

### 유니온 타입과 타입 가드

\`\`\`typescript
type Status = 'pending' | 'approved' | 'rejected';

interface Task {
  id: number;
  title: string;
  status: Status;
}

function isApproved(task: Task): boolean {
  return task.status === 'approved';
}
\`\`\`

## 일반적인 문제와 해결책

### 1. any 타입 남용

❌ **나쁜 예**:
\`\`\`typescript
function process(data: any) {
  return data.value;
}
\`\`\`

✅ **좋은 예**:
\`\`\`typescript
interface Data {
  value: string;
}

function process(data: Data): string {
  return data.value;
}
\`\`\`

### 2. 암시적 any

\`\`\`typescript
// tsconfig.json에서 noImplicitAny: true 설정
{
  "compilerOptions": {
    "noImplicitAny": true
  }
}
\`\`\`

## 마이그레이션 체크리스트

- [ ] TypeScript 및 타입 정의 설치
- [ ] tsconfig.json 설정
- [ ] 유틸리티 함수부터 변환 시작
- [ ] 타입 정의 추가
- [ ] strict 모드 점진적 활성화
- [ ] 테스트 코드 작성
- [ ] CI/CD 파이프라인 업데이트

---

## 결론

TypeScript 마이그레이션은 한 번에 완료하려 하지 말고, 점진적으로 진행하세요. 팀원들과 함께 학습하며 진행하는 것이 중요합니다.

**참고 자료**:
- [TypeScript 공식 문서](https://www.typescriptlang.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Definitely Typed](https://definitelytyped.org/)`,

  `# Transactional Outbox 패턴으로 메시지 발행 보장하기

> Polling Publisher 방식을 중심으로

안녕하세요. 리디 백엔드 엔지니어 강규입니다.

오늘은 Event Driven Architecture에서 메시지 발행의 신뢰성을 보장하는 Transactional Outbox 패턴을 소개하고, 이를 리디 서비스에 적용하며 느낀 내용을 공유하고자 합니다.

## Transactional Outbox 패턴이란 무엇인가요?

Event Driven Architecture를 따르는 서비스에서는 대개 Message Broker를 이용해 다양한 메시지(이벤트)를 publish(발행) 하고, 그에 연관된 작업을 비동기적으로 처리하여 시스템을 통합합니다.

이때 DB 트랜잭션을 실행한 뒤 연관 메시지를 Message Broker에 publish 하게 되는데, 때로 메시지 publish가 반드시 완료되어야 하는 경우가 있습니다.

리디 주문 기능을 예로 들어볼까요? 리디 주문 기능은 DB 트랜잭션을 실행할 때마다 발생합니다. 그리고 Message Broker에 주문 완료 메시지를 publish 합니다.

### 주요 문제점

DB 트랜잭션은 DB 자원에서 완전성(atomicity)을 보장하므로 트랜잭션에 포함된 query들은 완전히 실행되지만, 대개는 DB와 Message Broker가 다른 기종이라 완전적인 처리가 불가능합니다.

따라서 DB 상 주문 완료 처리가 되었더라도 Message Broker에 메시지를 publish 하는 데 실패할 수 있고, DB의 주문 완료 처리를 rollback 하기도 어렵습니다.

![Transactional Outbox Pattern](https://via.placeholder.com/700x400/F5F5F5/333?text=Transactional+Outbox+Pattern)

## 구현 방법

Transactional Outbox 패턴을 구현하는 방법은 크게 두 가지가 있습니다:

1. **Polling Publisher** - 주기적으로 Outbox 테이블을 조회하여 발행
2. **Transaction Log Tailing** - DB 로그를 추적하여 실시간 발행

이번 글에서는 Polling Publisher 방식을 중심으로 설명하겠습니다.

### 코드 예제

\`\`\`java
public class OutboxPublisher {
    @Scheduled(fixedDelay = 1000)
    public void publishOutboxMessages() {
        List<OutboxMessage> messages = outboxRepository.findUnpublished();

        for (OutboxMessage message : messages) {
            try {
                messageProducer.send(message);
                outboxRepository.markAsPublished(message.getId());
            } catch (Exception e) {
                log.error("Failed to publish message", e);
            }
        }
    }
}
\`\`\`

## 마치며

Transactional Outbox 패턴을 통해 메시지 발행의 신뢰성을 크게 향상시킬 수 있었습니다. 다만 구현 복잡도가 증가하고 약간의 지연이 발생할 수 있다는 트레이드오프가 있습니다.

여러분의 서비스에도 적용해보시면 좋을 것 같습니다. 감사합니다!`
];
