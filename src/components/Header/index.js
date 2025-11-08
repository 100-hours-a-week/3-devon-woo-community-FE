import Component from '../../core/Component.js';

// 스타일 동적 로드
const loadStyle = () => {
  const linkId = 'header-component-style';
  if (!document.getElementById(linkId)) {
    const link = document.createElement('link');
    link.id = linkId;
    link.rel = 'stylesheet';
    link.href = '/src/components/Header/style.css';
    document.head.appendChild(link);
  }
};

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showBackButton: props.showBackButton || false
    };
    loadStyle();
  }

  render() {
    return `
      <header class="header">
        ${this.state.showBackButton ? `
          <button class="back-button" id="backButton">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        ` : ''}
        <h1 class="header-title">아무 말 대잔치</h1>
      </header>
    `;
  }

  mounted() {
    const backButton = this.$el.querySelector('#backButton');
    if (backButton) {
      backButton.addEventListener('click', () => {
        window.history.back();
      });
    }
  }

  // 뒤로가기 버튼 표시/숨김
  showBackButton(show) {
    this.setState({ showBackButton: show });
  }
}

export default Header;
