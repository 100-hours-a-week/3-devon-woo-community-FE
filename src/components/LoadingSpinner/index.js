import Component from '../../core/Component.js';

class LoadingSpinner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: props.show !== undefined ? props.show : false
    };
    this.variant = props.variant || 'overlay';
    this.loadStyle('/src/components/LoadingSpinner/style.css');
  }

  render() {
    if (!this.state.show) {
      return '';
    }

    return `
      <div class="loading-spinner loading-spinner--${this.variant}">
        <div class="spinner"></div>
      </div>
    `;
  }

  show() {
    this.setState({ show: true });
  }

  hide() {
    this.setState({ show: false });
  }
}

export default LoadingSpinner;
