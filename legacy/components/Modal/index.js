import Component from '../../core/Component.js';

/**
 * Modal 컴포넌트
 * 확인/취소 버튼이 있는 재사용 가능한 모달
 */
class Modal extends Component {
  constructor(props) {
    super(props);
    this.loadStyle('/src/components/Modal/style.css');
  }

  render() {
    const {
      show = false,
      title = '확인',
      message = '',
      cancelText = '취소',
      confirmText = '확인',
      id = 'modal'
    } = this.props;

    return `
      <div class="modal-overlay" id="${id}" style="display: ${show ? 'flex' : 'none'};">
        <div class="modal-content">
          <h3 class="modal-title">${title}</h3>
          <p class="modal-message">${message}</p>
          <div class="modal-actions">
            <button class="modal-btn cancel-btn" data-action="cancel">${cancelText}</button>
            <button class="modal-btn confirm-btn" data-action="confirm">${confirmText}</button>
          </div>
        </div>
      </div>
    `;
  }
}

export default Modal;
