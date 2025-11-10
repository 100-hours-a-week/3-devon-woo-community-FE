import Component from '../../core/Component.js';

class LoadingSpinner extends Component {
  constructor(props) {
    super(props);
    this.loadStyle('/src/components/LoadingSpinner/style.css');
  }

  render() {
    const { show = true } = this.props;

    return `
      <div class="loading-spinner" style="display: ${show ? 'flex' : 'none'};">
        <div class="spinner"></div>
      </div>
    `;
  }
}

export default LoadingSpinner;
