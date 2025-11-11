import Component from '../../core/Component.js';

/**
 * Toast 컴포넌트
 * 일시적인 알림 메시지를 표시하는 컴포넌트
 */
class Toast extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: props.show || false,
      message: props.message || ''
    };
    this.loadStyle('/src/components/Toast/style.css');
    this.hideTimeout = null;
  }

  render() {
    return `
      <div class="toast-message" style="display: ${this.state.show ? 'block' : 'none'};">
        ${this.state.message}
      </div>
    `;
  }

  /**
   * 토스트 메시지 표시
   * @param {string} message - 표시할 메시지
   * @param {number} duration - 표시 시간 (ms), 기본 3000ms
   */
  show(message, duration = 3000) {
    // 기존 타이머 취소
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
    }

    this.setState({
      show: true,
      message: message
    });

    // 자동 숨김
    this.hideTimeout = setTimeout(() => {
      this.hide();
    }, duration);
  }

  /**
   * 토스트 메시지 숨김
   */
  hide() {
    this.setState({
      show: false
    });

    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }
  }

  beforeUnmount() {
    // 컴포넌트 제거 시 타이머 정리
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
    }
  }
}

export default Toast;
