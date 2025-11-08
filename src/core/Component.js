// 간단한 컴포넌트 베이스 클래스
class Component {
  constructor(props = {}) {
    this.props = props;
    this.state = {};
    this.$el = null;
  }

  // 스타일 동적 로드 (자식 클래스에서 호출)
  loadStyle(cssPath) {
    const linkId = `${this.constructor.name.toLowerCase()}-style`;
    if (!document.getElementById(linkId)) {
      const link = document.createElement('link');
      link.id = linkId;
      link.rel = 'stylesheet';
      link.href = cssPath;
      document.head.appendChild(link);
    }
  }

  // HTML 문자열 반환 (자식 클래스에서 구현)
  render() {
    return '';
  }

  // 상태 업데이트 및 리렌더링
  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.update();
  }

  // DOM에 마운트
  mount(container) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = this.render();
    this.$el = tempDiv.firstElementChild;
    container.appendChild(this.$el);
    this.mounted();
  }

  // 리렌더링
  update() {
    if (!this.$el) return;

    const parent = this.$el.parentNode;
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = this.render();
    const newEl = tempDiv.firstElementChild;

    parent.replaceChild(newEl, this.$el);
    this.$el = newEl;
    this.mounted();
  }

  // 마운트 후 실행 (이벤트 리스너 등록)
  mounted() {
    // 자식 클래스에서 구현
  }

  // 언마운트 전 실행
  beforeUnmount() {
    // 자식 클래스에서 구현
  }
}

export default Component;
