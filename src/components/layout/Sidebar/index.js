import Component from '../../../core/Component.js';

class Sidebar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      children: props.children || []
    };

    this.loadStyle('/src/components/layout/Sidebar/style.css');
  }

  render() {
    return `
      <aside class="sidebar">
        <div class="sidebar__content" id="sidebarContent"></div>
      </aside>
    `;
  }

  mounted() {
    this.renderChildren();
  }

  updated() {
    this.renderChildren();
  }

  renderChildren() {
    const container = this.$$('#sidebarContent');
    if (!container) return;

    container.innerHTML = '';

    const { children } = this.state;
    if (!children || children.length === 0) return;

    children.forEach(child => {
      if (child && typeof child.mount === 'function') {
        child.mount(container);
      }
    });
  }

  addChild(child) {
    const { children } = this.state;
    this.setState({ children: [...children, child] });
  }

  removeChild(child) {
    const { children } = this.state;
    const index = children.indexOf(child);
    if (index > -1) {
      children[index].unmount();
      this.setState({
        children: children.filter((c, i) => i !== index)
      });
    }
  }

  clearChildren() {
    const { children } = this.state;
    children.forEach(child => {
      if (child && typeof child.unmount === 'function') {
        child.unmount();
      }
    });
    this.setState({ children: [] });
  }

  beforeUnmount() {
    this.clearChildren();
  }
}

export default Sidebar;
