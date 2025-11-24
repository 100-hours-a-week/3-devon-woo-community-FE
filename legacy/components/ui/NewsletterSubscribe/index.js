import Component from '../../../core/Component.js';

class NewsletterSubscribe extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      isLoading: false,
      isSubscribed: false,
      error: ''
    };

    this.onSubscribe = props.onSubscribe || null;

    this.loadStyle('/src/components/ui/NewsletterSubscribe/style.css');
  }

  render() {
    const { email, isLoading, isSubscribed, error } = this.state;

    if (isSubscribed) {
      return `
        <div class="newsletter">
          <h3 class="newsletter__title">뉴스레터</h3>
          <div class="newsletter__success">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="20" fill="var(--color-success-light)"/>
              <path d="M16 24l6 6 10-12" stroke="var(--color-success)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <p class="newsletter__success-text">구독이 완료되었습니다!</p>
          </div>
        </div>
      `;
    }

    return `
      <div class="newsletter">
        <h3 class="newsletter__title">뉴스레터</h3>
        <p class="newsletter__description">
          새로운 포스트를 이메일로 받아보세요
        </p>

        <form class="newsletter__form" id="newsletterForm">
          <div class="newsletter__input-wrapper">
            <input
              type="email"
              class="newsletter__input"
              id="newsletterEmail"
              placeholder="이메일을 입력하세요"
              value="${email}"
              ${isLoading ? 'disabled' : ''}
              required
            />
            <button
              type="submit"
              class="newsletter__button"
              ${isLoading ? 'disabled' : ''}>
              ${isLoading ? '구독 중...' : '구독하기'}
            </button>
          </div>

          ${error ? `
            <p class="newsletter__error">${error}</p>
          ` : ''}
        </form>
      </div>
    `;
  }

  mounted() {
    this.setupEventListeners();
  }

  updated() {
    this.setupEventListeners();
  }

  setupEventListeners() {
    const form = this.$$('#newsletterForm');
    const input = this.$$('#newsletterEmail');

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleSubmit();
      });
    }

    if (input) {
      input.addEventListener('input', (e) => {
        this.setState({ email: e.target.value, error: '' });
      });
    }
  }

  async handleSubmit() {
    const { email } = this.state;

    if (!email || !this.validateEmail(email)) {
      this.setState({ error: '유효한 이메일 주소를 입력해주세요.' });
      return;
    }

    this.setState({ isLoading: true, error: '' });

    try {
      if (this.onSubscribe) {
        await this.onSubscribe(email);
      } else {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      this.setState({
        isLoading: false,
        isSubscribed: true
      });
    } catch (error) {
      this.setState({
        isLoading: false,
        error: error.message || '구독에 실패했습니다. 다시 시도해주세요.'
      });
    }
  }

  validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  beforeUnmount() {
    const form = this.$$('#newsletterForm');
    if (form) {
      const newForm = form.cloneNode(true);
      form.replaceWith(newForm);
    }
  }
}

export default NewsletterSubscribe;
