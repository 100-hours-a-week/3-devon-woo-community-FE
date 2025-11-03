## 1. 클래스 내부 this

```js
class App {
  constructor() {
    this.app = document.getElementById('app');
    this.router = null;
    this.init();
  }

  init() {
    this.setupRouter();
  }

  setupRouter() { ... }

  render(PageComponent, initFunction) { ... }
}
```

this = App 클래스의 인스턴스
따라서 this.app, this.router 모두 인스턴스 변수.
this.init() 호출 시 this = 현재 생성된 App 객체
setupRouter() 안에서도 this = App 인스턴스


## 2. 화살표 함수와 this

```js
const routes = {
  '/': () => this.render(PostListPage, initPostListPage),
  '/login': () => this.render(LoginPage, initLoginPage),
  '/posts': () => this.render(PostListPage, initPostListPage),
  '/posts/:id': () => this.render(PostDetailPage, initPostDetailPage),
  '/profile': () => this.render(ProfilePage, initProfilePage),
};
```

중요 포인트: 화살표 함수 () => ... 사용
화살표 함수는 자기 this를 가지지 않고 외부(this)를 캡처
여기서 외부 this = App 인스턴스
그래서 this.render(...)가 제대로 App 인스턴스를 참조

만약 화살표 함수 대신 일반 함수 function() { this.render(...) } 사용하면,
this는 routes 객체나 호출 컨텍스트를 가리켜서 undefined가 됨


## 3. render 메서드 내부
```js
render(PageComponent, initFunction) {
  const header = Header();
  const page = PageComponent();
  const footer = Footer();

  this.app.innerHTML = `
    ${header}
    <main>${page}</main>
    ${footer}
  `;

  if (initFunction) {
    initFunction();
  }
}
```

this = App 인스턴스
this.app.innerHTML → #app DOM 요소에 HTML 삽입
PageComponent()와 initFunction()은 this를 사용하지 않음, 일반 함수처럼 호출
만약 PageComponent 내부에서 this를 쓴다면, 호출 방식에 따라 다르게 바인딩됨

## 4. 요약: this 관계 그림

```
App 인스턴스 (new App())
│
├─ this.app       => document.getElementById('app')
├─ this.router    => Router 객체
│
├─ this.init()    => this = App 인스턴스
│
├─ setupRouter()
│   └─ routes 화살표 함수 => this = App 인스턴스 (캡처)
│       └─ this.render() 호출 => App 인스턴스 참조
│
└─ render()
    └─ this.app.innerHTML → App 인스턴스의 #app
```


✅ 핵심 포인트

클래스 메서드에서 this = 인스턴스
화살표 함수는 바깥 this 캡처 → 라우터 콜백에서 App 인스턴스를 참조 가능
일반 함수로 쓰면 this가 달라질 수 있어 항상 바인딩 주의
render 안에서 호출되는 PageComponent, initFunction은 독립 함수 → 내부에서 this 쓰면 App 인스턴스 아님