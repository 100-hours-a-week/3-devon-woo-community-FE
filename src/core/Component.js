class Component {
  constructor(props = {}) {
    this.props = props;
    this.state = {};
    this.$el = null;
    this._isMounted = false;
    this._loadedStyles = new Set();
    this._delegatedEvents = [];
  }

  loadStyle(cssPath) {
    if (this._loadedStyles.has(cssPath)) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const linkId = `${this.constructor.name.toLowerCase()}-style`;

      if (document.getElementById(linkId)) {
        this._loadedStyles.add(cssPath);
        resolve();
        return;
      }

      const link = document.createElement('link');
      link.id = linkId;
      link.rel = 'preload';
      link.as = 'style';
      link.href = cssPath;

      link.onload = () => {
        link.rel = 'stylesheet';
        this._loadedStyles.add(cssPath);
        resolve();
      };

      link.onerror = () => {
        console.error(`Failed to load style: ${cssPath}`);
        reject(new Error(`Style load failed: ${cssPath}`));
      };

      document.head.appendChild(link);
    });
  }

  render() {
    return '';
  }

  setState(newState, callback) {
    const prevState = { ...this.state };
    this.state = { ...this.state, ...newState };

    if (this.shouldUpdate && !this.shouldUpdate(this.props, this.state, prevState)) {
      return;
    }

    this.update();

    if (callback && typeof callback === 'function') {
      callback();
    }
  }

  shouldUpdate() {
    return true;
  }

  mount(container) {
    if (!container) {
      console.error('Mount container is not provided');
      return;
    }

    try {
      const html = this.render();
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html.trim();
      this.$el = tempDiv.firstElementChild;

      if (!this.$el) {
        console.error('Render returned invalid HTML');
        return;
      }

      container.appendChild(this.$el);
      this._isMounted = true;
      this.mounted();
    } catch (error) {
      console.error('Mount error:', error);
      this.handleError(error);
    }
  }

  update() {
    if (!this.$el || !this._isMounted) return;

    try {
      const parent = this.$el.parentNode;
      if (!parent) {
        console.warn('Parent node not found during update');
        return;
      }

      const html = this.render();
      const newEl = this._createElementFromHTML(html);

      if (!newEl) {
        console.error('Update render returned invalid HTML');
        return;
      }

      if (newEl.tagName !== this.$el.tagName) {
        parent.replaceChild(newEl, this.$el);
        this.$el = newEl;
      } else {
        this._patchDom(this.$el, newEl);
      }

      this.updated();
    } catch (error) {
      console.error('Update error:', error);
      this.handleError(error);
    }
  }

  unmount() {
    if (!this.$el) return;

    try {
      this.beforeUnmount();
      this._removeDelegatedEvents();

      if (this.$el.parentNode) {
        this.$el.parentNode.removeChild(this.$el);
      }

      this.$el = null;
      this._isMounted = false;
    } catch (error) {
      console.error('Unmount error:', error);
    }
  }

  mounted() {
  }

  updated() {
  }

  beforeUnmount() {
  }

  handleError(error) {
    console.error(`Error in ${this.constructor.name}:`, error);
  }

  $$(selector) {
    return this.$el ? this.$el.querySelector(selector) : null;
  }

  $$all(selector) {
    return this.$el ? Array.from(this.$el.querySelectorAll(selector)) : [];
  }

  on(selector, event, handler, options = {}) {
    if (!this.$el) return;

    const element = typeof selector === 'string' ? this.$$(selector) : selector;
    if (element) {
      element.addEventListener(event, handler, options);
    }
  }

  off(selector, event, handler) {
    if (!this.$el) return;

    const element = typeof selector === 'string' ? this.$$(selector) : selector;
    if (element) {
      element.removeEventListener(event, handler);
    }
  }

  delegate(eventType, selector, handler) {
    const wrappedHandler = (e) => {
      if (!this.$el) return;
      const target = e.target.closest(selector);
      if (target && this.$el.contains(target)) {
        handler.call(target, e);
      }
    };

    document.addEventListener(eventType, wrappedHandler);
    const eventRecord = { eventType, selector, handler, wrappedHandler };
    this._delegatedEvents.push(eventRecord);

    return () => {
      this._removeDelegatedEvent(eventRecord);
    };
  }

  emit(eventName, detail = {}) {
    if (!this.$el) return;

    const event = new CustomEvent(eventName, {
      detail,
      bubbles: true,
      cancelable: true
    });

    this.$el.dispatchEvent(event);
  }

  _removeDelegatedEvent(eventRecord) {
    if (!eventRecord) return;
    document.removeEventListener(eventRecord.eventType, eventRecord.wrappedHandler);
    this._delegatedEvents = this._delegatedEvents.filter((record) => record !== eventRecord);
  }

  _removeDelegatedEvents() {
    this._delegatedEvents.forEach((record) => {
      document.removeEventListener(record.eventType, record.wrappedHandler);
    });
    this._delegatedEvents = [];
  }

  _createElementFromHTML(html) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html.trim();
    return tempDiv.firstElementChild;
  }

  _patchDom(oldNode, newNode) {
    if (!oldNode || !newNode) return;

    if (oldNode.nodeType === Node.TEXT_NODE && newNode.nodeType === Node.TEXT_NODE) {
      if (oldNode.textContent !== newNode.textContent) {
        oldNode.textContent = newNode.textContent;
      }
      return;
    }

    if (oldNode.nodeType !== newNode.nodeType || oldNode.nodeName !== newNode.nodeName) {
      const parent = oldNode.parentNode;
      if (parent) {
        parent.replaceChild(newNode, oldNode);
        if (oldNode === this.$el) {
          this.$el = newNode;
        }
      }
      return;
    }

    this._syncAttributes(oldNode, newNode);

    const oldChildren = Array.from(oldNode.childNodes);
    const newChildren = Array.from(newNode.childNodes);
    const maxLength = Math.max(oldChildren.length, newChildren.length);

    for (let i = 0; i < maxLength; i++) {
      const oldChild = oldChildren[i];
      const newChild = newChildren[i];

      if (!newChild && oldChild) {
        oldNode.removeChild(oldChild);
        continue;
      }

      if (newChild && !oldChild) {
        oldNode.appendChild(newChild);
        continue;
      }

      if (!oldChild || !newChild) continue;

      if (oldChild.nodeType === Node.TEXT_NODE && newChild.nodeType === Node.TEXT_NODE) {
        if (oldChild.textContent !== newChild.textContent) {
          oldChild.textContent = newChild.textContent;
        }
        continue;
      }

      if (oldChild.nodeName !== newChild.nodeName) {
        oldNode.replaceChild(newChild, oldChild);
        continue;
      }

      this._patchDom(oldChild, newChild);
    }
  }

  _syncAttributes(oldNode, newNode) {
    if (!oldNode.attributes || !newNode.attributes) return;

    Array.from(oldNode.attributes).forEach((attr) => {
      if (!newNode.hasAttribute(attr.name)) {
        oldNode.removeAttribute(attr.name);
      }
    });

    Array.from(newNode.attributes).forEach((attr) => {
      if (oldNode.getAttribute(attr.name) !== attr.value) {
        oldNode.setAttribute(attr.name, attr.value);
      }
    });
  }
}

export default Component;
